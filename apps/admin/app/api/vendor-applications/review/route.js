import { NextResponse } from 'next/server';

import { updateVendorApplicationReviews } from '@/lib/vendorApplications.mjs';
import { validateReviewUpdate } from '@/lib/vendorApplicationsView.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 'no-store, max-age=0' };

export async function POST(request) {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Send a JSON request body.' }, { status: 415, headers: HEADERS });
  }
  if (Number(request.headers.get('content-length') || 0) > 20_000) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413, headers: HEADERS });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400, headers: HEADERS });
  }

  const update = validateReviewUpdate(body);
  if (update.error) {
    return NextResponse.json({ error: update.error }, { status: 400, headers: HEADERS });
  }

  try {
    const rows = await updateVendorApplicationReviews(update);
    return NextResponse.json({ success: true, updated: rows.length }, { headers: HEADERS });
  } catch (error) {
    console.error('Vendor application review update failed:', error?.message ?? error);
    return NextResponse.json(
      { error: 'The review update could not be saved.' },
      { status: 503, headers: HEADERS },
    );
  }
}
