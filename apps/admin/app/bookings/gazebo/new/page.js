import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "@/components/bookings/bookingForm";
import { BookingError, getReservationRequestForBooking } from "@/lib/bookings.mjs";
import { getRequestSlotLabel } from "@/lib/reservationRequestsView.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Gazebo Booking | OMPP Admin" };

export default async function NewGazeboBookingPage({ searchParams }) {
  const params = await searchParams;
  let request = null;
  if (params?.request) {
    try {
      request = await getReservationRequestForBooking(params.request);
    } catch (error) {
      if (error instanceof BookingError && error.status === 404) notFound();
      throw error;
    }
  }

  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="inline-block font-semibold text-foreground/70 underline underline-offset-4 hover:text-foreground" href="/bookings/gazebo">← Gazebo bookings</Link>
      <h1 className="mt-4 text-3xl font-bold">{request ? `Book request #${request.id}` : "New gazebo booking"}</h1>
      {request && (
        <section className="my-6 max-w-3xl rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Reservation request #{request.id}</p>
          <h2 className="mt-1 text-xl font-bold">{request.name}</h2>
          <p><a className="underline" href={`mailto:${request.email}`}>{request.email}</a> · <a className="underline" href={`tel:${request.phone_normalized}`}>{request.phone}</a></p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="font-semibold">Preferred date</dt><dd>{request.preferred_date}</dd></div>
            <div><dt className="font-semibold">Preferred slot</dt><dd>{getRequestSlotLabel(request)}</dd></div>
          </dl>
          {request.fallback_dates && <p className="mt-3"><strong>Fallback dates:</strong> {request.fallback_dates}</p>}
          {request.additional_comments && <p className="mt-3"><strong>Customer comments:</strong> {request.additional_comments}</p>}
          <p className="mt-3"><strong>Price acknowledged:</strong> ${(request.price_cents_snapshot / 100).toFixed(2)}</p>
          {request.bookings.length > 0 && (
            <div className="mt-4 rounded-lg border border-foreground/10 bg-white/70 p-3">
              <strong>Previous bookings:</strong>
              <ul className="list-disc pl-5">
                {request.bookings.map((booking) => (
                  <li key={booking.id}>GZ-{booking.id}: {booking.booking_date}, Gazebo {booking.gazebo_code}, {booking.time_slot}, {booking.status}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
      {!request && <p className="mb-8 mt-2 text-foreground/70">Create a booking entered directly by staff.</p>}
      <BookingForm request={request} type="gazebo" />
    </main>
  );
}
