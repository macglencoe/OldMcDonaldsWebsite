import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { updateGazeboSeasonConfig } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const season = await updateGazeboSeasonConfig(id, await readBookingJson(request));
    return bookingApiSuccess({ season });
  } catch (error) {
    return bookingApiError(error, 'Updating gazebo season configuration');
  }
}
