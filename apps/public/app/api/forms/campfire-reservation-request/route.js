import { getDatabase } from '@oldmc/db';
import { NextResponse } from 'next/server';

import { sendCampfireRequestCustomerReceipt, sendCampfireRequestStaffNotification } from '@/lib/email/server';
import { validateCampfireReservationRequest } from '@/lib/campfireReservationRequest.mjs';
import { getClientIp, hashIp, normalizeUserAgent } from '@/lib/mazeEntry.mjs';
import { getPricingData } from '@/utils/pricingServer';

export const runtime = 'nodejs';
const MAX_REQUEST_BYTES = 20_000;
const RATE_LIMIT_MAX = 3;
const POLICY_VERSION = 1;

export async function POST(request) {
  if (Number(request.headers.get('content-length') || 0) > MAX_REQUEST_BYTES) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const validation = validateCampfireReservationRequest(body);
  if (validation.error) return NextResponse.json({ error: validation.error }, { status: 400 });
  const value = validation.value;
  let ipHash;
  try { ipHash = hashIp(getClientIp(request.headers), process.env.IP_HASH_SECRET); }
  catch { return NextResponse.json({ error: 'Campfire request service is unavailable.' }, { status: 503 }); }
  let priceCents;
  try {
    const pricing = await getPricingData();
    priceCents = Math.round(Number(pricing?.['campfire-rental']?.amount) * 100);
    if (!Number.isSafeInteger(priceCents) || priceCents <= 0) throw new Error('Invalid price');
  } catch { return NextResponse.json({ error: 'Campfire pricing is unavailable.' }, { status: 503 }); }
  try {
    const rows = await getDatabase().query(
      `WITH rate_limit_lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtextextended($1, 0))),
       recent_requests AS MATERIALIZED (
         SELECT count(*)::int AS request_count FROM campfire_reservation_requests, rate_limit_lock
         WHERE ip_hash = $1 AND created_at >= CURRENT_TIMESTAMP - INTERVAL '1 hour'
       )
       INSERT INTO campfire_reservation_requests (
         email, name, phone, phone_normalized, preferred_date, fallback_dates, party_size,
         price_acknowledged, price_cents_snapshot, policy_version, additional_comments,
         ip_hash, user_agent, meta_json
       )
       SELECT $2, $3, $4, $5, $6::date, $7, $8, true, $9, $10, $11, $1, $12, $13::jsonb
       FROM recent_requests WHERE request_count < $14
       RETURNING id::text, created_at`,
      [ipHash, value.email, value.name, value.phone, value.phoneNormalized, value.preferredDate,
        value.fallbackDates, value.partySize, priceCents, POLICY_VERSION, value.additionalComments,
        normalizeUserAgent(request.headers), JSON.stringify({ source: 'night-maze-page' }), RATE_LIMIT_MAX],
    );
    if (!rows.length) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': '3600' } });
    const emailData = { id: rows[0].id, ...value, priceCents };
    const [staff, customer] = await Promise.allSettled([sendCampfireRequestStaffNotification(emailData), sendCampfireRequestCustomerReceipt(emailData)]);
    if (staff.status === 'rejected') console.error('Campfire request saved, but staff notification failed:', staff.reason?.message);
    if (customer.status === 'rejected') console.error('Campfire request saved, but customer receipt failed:', customer.reason?.message);
    return NextResponse.json({ success: true, requestId: rows[0].id, submittedAt: rows[0].created_at }, { status: 201 });
  } catch (error) {
    console.error('Campfire request database operation failed:', error.message);
    return NextResponse.json({ error: 'The campfire request could not be saved.' }, { status: 503 });
  }
}
