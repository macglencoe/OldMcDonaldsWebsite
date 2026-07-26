import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "@/components/bookings/bookingForm";
import BookingList from "@/components/bookings/bookingList";
import CancelBookingButton from "@/components/bookings/cancelBookingButton";
import { safeBookingReturnPath } from "@/lib/bookingFilters.mjs";
import { BookingError, getGazeboBooking } from "@/lib/bookings.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gazebo Booking | OMPP Admin" };

export default async function GazeboBookingPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const returnTo = safeBookingReturnPath(query?.returnTo, "gazebo");
  let booking;
  try {
    booking = await getGazeboBooking(id);
  } catch (error) {
    if (error instanceof BookingError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="underline" href={returnTo}>← Gazebo bookings</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">GZ-{booking.id}</p>
          <h1 className="text-3xl font-bold">{booking.status === "cancelled" ? "Cancelled gazebo booking" : "Edit gazebo booking"}</h1>
        </div>
        {booking.status !== "cancelled" && <CancelBookingButton bookingId={booking.id} type="gazebo" />}
      </div>
      {booking.reservation_request_id && (
        <p className="my-5">
          Created from{" "}
          <Link className="font-semibold underline" href={`/reservation-requests?request=${booking.reservation_request_id}`}>
            reservation request #{booking.reservation_request_id}
          </Link>
        </p>
      )}
      {booking.status === "cancelled" ? (
        <div className="mt-8 max-w-4xl">
          <p className="mb-4 rounded-lg bg-foreground/5 p-4">Cancelled bookings are retained as read-only history.</p>
          <BookingList bookings={[booking]} type="gazebo" />
        </div>
      ) : (
        <div className="mt-8"><BookingForm booking={booking} returnTo={returnTo} type="gazebo" /></div>
      )}
    </main>
  );
}
