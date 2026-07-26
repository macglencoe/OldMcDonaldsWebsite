import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { updateCampfireBooking } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const booking = await updateCampfireBooking(id, await readBookingJson(request));
    return bookingApiSuccess({ booking });
  } catch (error) {
    return bookingApiError(error, 'Updating a campfire booking');
  }
}
