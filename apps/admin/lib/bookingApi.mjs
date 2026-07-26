import { NextResponse } from 'next/server';

import { BookingError } from './bookings.mjs';

const MAX_REQUEST_BYTES = 20_000;

export async function readBookingJson(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    throw new BookingError('REQUEST_TOO_LARGE', 'Request is too large.', 413);
  }
  try {
    return await request.json();
  } catch {
    throw new BookingError('INVALID_JSON', 'Invalid JSON.', 400);
  }
}

export function bookingApiError(error, operation) {
  if (error instanceof BookingError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  console.error(`${operation} failed:`, error?.message ?? error);
  return NextResponse.json(
    { error: 'The booking operation could not be completed.', code: 'DATABASE_ERROR' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}

export function bookingApiSuccess(data, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}
