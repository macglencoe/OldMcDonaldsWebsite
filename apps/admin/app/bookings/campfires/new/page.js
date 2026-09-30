import Link from "next/link";

import BookingForm from "@/components/bookings/bookingForm";
import { BookingError, getCampfireRequestForBooking } from "@/lib/bookings.mjs";
import { notFound } from "next/navigation";

export const metadata = { title: "New Campfire Booking | OMPP Admin" };

export const dynamic = "force-dynamic";
export default async function NewCampfireBookingPage({ searchParams }) {
  const params = await searchParams;
  let request = null;
  if (params?.request) { try { request = await getCampfireRequestForBooking(params.request); } catch (error) { if (error instanceof BookingError && error.status === 404) notFound(); throw error; } }
  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="inline-block font-semibold text-foreground/70 underline underline-offset-4 hover:text-foreground" href="/bookings/campfires">← Campfire bookings</Link>
      <h1 className="mt-4 text-3xl font-bold">{request ? `Book campfire request CF-${request.id}` : "New campfire booking"}</h1>
      {request && <section className="my-6 max-w-3xl rounded-xl border border-accent/30 bg-accent/[0.05] p-5"><h2 className="text-xl font-bold">{request.name}</h2><p><a className="underline" href={`mailto:${request.email}`}>{request.email}</a> · <a className="underline" href={`tel:${request.phone_normalized}`}>{request.phone}</a></p><p className="mt-3"><strong>Preferred night:</strong> {request.preferred_date}</p><p><strong>Party size:</strong> {request.party_size ?? 'Not provided'}</p>{request.fallback_dates && <p><strong>Other dates:</strong> {request.fallback_dates}</p>}{request.additional_comments && <p><strong>Comments:</strong> {request.additional_comments}</p>}<p><strong>Price acknowledged:</strong> ${(request.price_cents_snapshot/100).toFixed(2)}</p></section>}
      {!request && <p className="mb-8 mt-2 text-foreground/70">One booking reserves one campfire.</p>}
      <BookingForm request={request} type="campfires" returnTo={request ? `/campfire-requests?request=${request.id}` : null} />
    </main>
  );
}
