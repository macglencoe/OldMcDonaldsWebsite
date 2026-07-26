import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { convertReservationRequest } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const booking = await convertReservationRequest(await readBookingJson(request));
    return bookingApiSuccess({ booking }, 201);
  } catch (error) {
    return bookingApiError(error, 'Converting a reservation request');
  }
}
