import { NextResponse } from 'next/server';
import { updateCampfireRequestReview } from '@/lib/campfireRequests.mjs';
import { validateRequestReviewUpdate } from '@/lib/reservationRequestsView.mjs';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) return NextResponse.json({ error: 'Send a JSON request body.' }, { status: 415 });
  if (Number(request.headers.get('content-length') || 0) > 10_000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  let body; try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const update = validateRequestReviewUpdate(body);
  if (update.error) return NextResponse.json({ error: update.error }, { status: 400 });
  try {
    const rows = await updateCampfireRequestReview(update);
    if (!rows.length) return NextResponse.json({ error: 'Campfire request not found.' }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) { console.error('Campfire request review update failed:', error?.message ?? error); return NextResponse.json({ error: 'The review update could not be saved.' }, { status: 503 }); }
}
