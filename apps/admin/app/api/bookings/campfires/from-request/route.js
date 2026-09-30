import { bookingApiError, bookingApiSuccess, readBookingJson } from '@/lib/bookingApi.mjs';
import { convertCampfireRequest } from '@/lib/bookings.mjs';
export const runtime='nodejs';
export async function POST(request){try{return bookingApiSuccess({booking:await convertCampfireRequest(await readBookingJson(request))},201);}catch(error){return bookingApiError(error,'Converting a campfire request');}}
