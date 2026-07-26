import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { createCampfireBooking } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const booking = await createCampfireBooking(await readBookingJson(request));
    return bookingApiSuccess({ booking }, 201);
  } catch (error) {
    return bookingApiError(error, 'Creating a campfire booking');
  }
}
