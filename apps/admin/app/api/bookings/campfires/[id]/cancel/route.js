import { bookingApiError, bookingApiSuccess } from '@/lib/bookingApi.mjs';
import { cancelCampfireBooking } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function POST(_request, { params }) {
  try {
    const { id } = await params;
    const booking = await cancelCampfireBooking(id);
    return bookingApiSuccess({ booking });
  } catch (error) {
    return bookingApiError(error, 'Cancelling a campfire booking');
  }
}
