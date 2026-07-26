import { getDatabase } from '@oldmc/db';
import { NextResponse } from 'next/server';

import { sendReservationCustomerReceipt, sendReservationStaffNotification } from '@/lib/email/server';
import { gazeboSlotLabels, snapshotGazeboSlotConfig } from '@/lib/gazeboSlotConfig.mjs';
import { getGazeboSeasonForDate } from '@/lib/gazeboSlotConfigServer.mjs';
import { getClientIp, hashIp, normalizeUserAgent } from '@/lib/mazeEntry.mjs';
import { validateReservationRequest } from '@/lib/reservationRequest.mjs';
import { getPricingData } from '@/utils/pricingServer';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 20_000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;
const POLICY_VERSION = 1;

export async function POST(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const validation = validateReservationRequest(body);
  if (validation.error) return NextResponse.json({ error: validation.error }, { status: 400 });
  const value = validation.value;

  let gazeboSeason;
  try {
    gazeboSeason = await getGazeboSeasonForDate(value.preferredDate);
    if (!gazeboSeason) {
      return NextResponse.json(
        { error: 'Gazebo rentals are not configured for the selected date.', code: 'DATE_UNAVAILABLE' },
        { status: 422 },
      );
    }
  } catch (error) {
    console.error('Reservation slot configuration error:', error.message);
    return NextResponse.json(
      { error: 'Gazebo times are temporarily unavailable.', code: 'DATABASE_ERROR' },
      { status: 503 },
    );
  }

  let ipHash;
  try { ipHash = hashIp(getClientIp(request.headers), process.env.IP_HASH_SECRET); }
  catch (error) {
    console.error('Reservation configuration error:', error.message);
    return NextResponse.json({ error: 'Reservation request service is unavailable.' }, { status: 503 });
  }

  let priceCents;
  try {
    const pricing = await getPricingData();
    priceCents = Math.round(Number(pricing?.['gazebo-rental']?.amount) * 100);
    if (!Number.isSafeInteger(priceCents) || priceCents <= 0) throw new Error('Gazebo price is unavailable.');
  } catch (error) {
    console.error('Reservation pricing error:', error.message);
    return NextResponse.json({ error: 'Reservation pricing is unavailable.' }, { status: 503 });
  }

  try {
    const slotConfigSnapshot = snapshotGazeboSlotConfig(gazeboSeason);
    const rows = await getDatabase().query(
      `WITH rate_limit_lock AS MATERIALIZED (
         SELECT pg_advisory_xact_lock(hashtextextended($1, 0))
       ), recent_requests AS MATERIALIZED (
         SELECT count(*)::int AS request_count FROM reservation_requests, rate_limit_lock
         WHERE ip_hash = $1 AND created_at >= CURRENT_TIMESTAMP - ($2 * INTERVAL '1 hour')
       )
       INSERT INTO reservation_requests (
         email, name, phone, phone_normalized, preferred_date, preferred_time_slot,
         fallback_dates, price_acknowledged, weather_refund_acknowledged,
         early_arrival_acknowledged, price_cents_snapshot, policy_version,
         additional_comments, ip_hash, user_agent, meta_json
       )
       SELECT $3, $4, $5, $6, $7::date, $8, $9, true, true, true, $10, $11, $12, $1, $13, $14::jsonb
       FROM recent_requests WHERE request_count < $15
       RETURNING id::text, created_at`,
      [ipHash, RATE_LIMIT_WINDOW_HOURS, value.email, value.name, value.phone, value.phoneNormalized,
        value.preferredDate, value.preferredTimeSlot, value.fallbackDates, priceCents, POLICY_VERSION,
        value.additionalComments, normalizeUserAgent(request.headers), JSON.stringify({
          source: 'reservations-page',
          gazeboSlotConfig: slotConfigSnapshot,
        }), RATE_LIMIT_MAX],
    );

    if (!rows.length) return NextResponse.json(
      { error: 'Too many reservation requests. Please try again later.', code: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    );

    const emailData = {
      id: rows[0].id, ...value, priceCents,
      preferredTimeLabel: gazeboSlotLabels(gazeboSeason)[value.preferredTimeSlot],
    };
    const [staffEmail, customerEmail] = await Promise.allSettled([
      sendReservationStaffNotification(emailData), sendReservationCustomerReceipt(emailData),
    ]);
    if (staffEmail.status === 'rejected') console.error('Reservation saved, but staff notification failed:', staffEmail.reason?.message);
    if (customerEmail.status === 'rejected') console.error('Reservation saved, but customer receipt failed:', customerEmail.reason?.message);

    return NextResponse.json({
      success: true, requestId: rows[0].id, submittedAt: rows[0].created_at,
      notifications: { staff: staffEmail.status === 'fulfilled', customer: customerEmail.status === 'fulfilled' },
    }, { status: 201 });
  } catch (error) {
    console.error('Reservation database operation failed:', error.message);
    return NextResponse.json({ error: 'The reservation request could not be saved.', code: 'DATABASE_ERROR' }, { status: 503 });
  }
}
