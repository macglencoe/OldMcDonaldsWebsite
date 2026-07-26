import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { createGazeboBooking } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const booking = await createGazeboBooking(await readBookingJson(request));
    return bookingApiSuccess({ booking }, 201);
  } catch (error) {
    return bookingApiError(error, 'Creating a gazebo booking');
  }
}
