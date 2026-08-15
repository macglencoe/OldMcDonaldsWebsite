import { NextResponse } from 'next/server';

import { updateReservationRequestReview } from '@/lib/reservationRequests.mjs';
import { validateRequestReviewUpdate } from '@/lib/reservationRequestsView.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 'no-store, max-age=0' };

export async function POST(request) {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Send a JSON request body.' }, { status: 415, headers: HEADERS });
  }
  if (Number(request.headers.get('content-length') || 0) > 10_000) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413, headers: HEADERS });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400, headers: HEADERS });
  }

  const update = validateRequestReviewUpdate(body);
  if (update.error) {
    return NextResponse.json({ error: update.error }, { status: 400, headers: HEADERS });
  }

  try {
    const rows = await updateReservationRequestReview(update);
    if (!rows.length) return NextResponse.json({ error: 'Reservation request not found.' }, { status: 404, headers: HEADERS });
    return NextResponse.json({ success: true, review: rows[0] }, { headers: HEADERS });
  } catch (error) {
    console.error('Reservation request review update failed:', error?.message ?? error);
    return NextResponse.json({ error: 'The review update could not be saved.' }, { status: 503, headers: HEADERS });
  }
}
