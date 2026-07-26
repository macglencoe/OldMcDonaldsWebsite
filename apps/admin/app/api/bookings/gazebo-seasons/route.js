import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { createGazeboSeasonConfig } from '@/lib/bookings.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const season = await createGazeboSeasonConfig(await readBookingJson(request));
    return bookingApiSuccess({ season }, 201);
  } catch (error) {
    return bookingApiError(error, 'Creating gazebo season configuration');
  }
}
