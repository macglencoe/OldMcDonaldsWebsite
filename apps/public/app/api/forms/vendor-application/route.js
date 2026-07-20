import { getDatabase } from '@oldmc/db';
import { NextResponse } from 'next/server';
import { sendVendorCustomerReceipt, sendVendorStaffNotification } from '@/lib/email/server';
import { getClientIp, hashIp, normalizeUserAgent } from '@/lib/mazeEntry.mjs';
import { CERTIFICATION_LABELS, ELECTRICITY_LABELS, validateVendorApplication } from '@/lib/vendorApplication.mjs';

export const runtime = 'nodejs';
const MAX_REQUEST_BYTES = 20_000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;
const POLICY_VERSION = 1;

export async function POST(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) return NextResponse.json({ error: 'Application is too large.' }, { status: 413 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const validation = validateVendorApplication(body);
  if (validation.error) return NextResponse.json({ error: validation.error }, { status: 400 });
  let ipHash;
  try { ipHash = hashIp(getClientIp(request.headers), process.env.IP_HASH_SECRET); }
  catch (error) {
    console.error('Vendor application configuration error:', error.message);
    return NextResponse.json({ error: 'Vendor application service is unavailable.' }, { status: 503 });
  }
  const value = validation.value;
  try {
    const rows = await getDatabase().query(
      `WITH rate_limit_lock AS MATERIALIZED (
         SELECT pg_advisory_xact_lock(hashtextextended($1, 0))
       ), recent_applications AS MATERIALIZED (
         SELECT count(*)::int AS application_count FROM vendor_applications, rate_limit_lock
         WHERE ip_hash = $1 AND created_at >= CURRENT_TIMESTAMP - ($2 * INTERVAL '1 hour')
       )
       INSERT INTO vendor_applications (
         business_name, contact_name, email, phone, phone_normalized, website_url,
         electricity_requirement, is_food_vendor, health_certification_acknowledged,
         certification_status, availability_notes, policy_version, ip_hash, user_agent, meta_json
       )
       SELECT $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $1, $15, $16::jsonb
       FROM recent_applications WHERE application_count < $17
       RETURNING id::text, created_at`,
      [ipHash, RATE_LIMIT_WINDOW_HOURS, value.businessName, value.contactName, value.email,
        value.phone, value.phoneNormalized, value.websiteUrl, value.electricityRequirement,
        value.isFoodVendor, value.healthCertificationAcknowledged, value.certificationStatus,
        value.availabilityNotes, POLICY_VERSION, normalizeUserAgent(request.headers),
        JSON.stringify({ source: 'vendor-application-page' }), RATE_LIMIT_MAX],
    );
    if (!rows.length) return NextResponse.json(
      { error: 'Too many applications. Please try again later.', code: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    );
    const emailData = {
      id: rows[0].id, ...value,
      electricityLabel: ELECTRICITY_LABELS[value.electricityRequirement],
      certificationLabel: value.certificationStatus ? CERTIFICATION_LABELS[value.certificationStatus] : null,
    };
    const [staffEmail, customerEmail] = await Promise.allSettled([
      sendVendorStaffNotification(emailData), sendVendorCustomerReceipt(emailData),
    ]);
    if (staffEmail.status === 'rejected') console.error('Vendor application saved, but staff notification failed:', staffEmail.reason?.message);
    if (customerEmail.status === 'rejected') console.error('Vendor application saved, but customer receipt failed:', customerEmail.reason?.message);
    return NextResponse.json({
      success: true, applicationId: rows[0].id, submittedAt: rows[0].created_at,
      notifications: { staff: staffEmail.status === 'fulfilled', customer: customerEmail.status === 'fulfilled' },
    }, { status: 201 });
  } catch (error) {
    console.error('Vendor application database operation failed:', error.message);
    return NextResponse.json({ error: 'The vendor application could not be saved.', code: 'DATABASE_ERROR' }, { status: 503 });
  }
}
