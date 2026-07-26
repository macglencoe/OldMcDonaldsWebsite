import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "@/components/bookings/bookingForm";
import BookingList from "@/components/bookings/bookingList";
import CancelBookingButton from "@/components/bookings/cancelBookingButton";
import { safeBookingReturnPath } from "@/lib/bookingFilters.mjs";
import { BookingError, getCampfireBooking } from "@/lib/bookings.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Campfire Booking | OMPP Admin" };

export default async function CampfireBookingPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const returnTo = safeBookingReturnPath(query?.returnTo, "campfires");
  let booking;
  try {
    booking = await getCampfireBooking(id);
  } catch (error) {
    if (error instanceof BookingError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="underline" href={returnTo}>← Campfire bookings</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">CF-{booking.id}</p>
          <h1 className="text-3xl font-bold">{booking.status === "cancelled" ? "Cancelled campfire booking" : "Edit campfire booking"}</h1>
        </div>
        {booking.status !== "cancelled" && <CancelBookingButton bookingId={booking.id} type="campfires" />}
      </div>
      {booking.status === "cancelled" ? (
        <div className="mt-8 max-w-4xl">
          <p className="mb-4 rounded-lg bg-foreground/5 p-4">Cancelled bookings are retained as read-only history.</p>
          <BookingList bookings={[booking]} type="campfires" />
        </div>
      ) : (
        <div className="mt-8"><BookingForm booking={booking} returnTo={returnTo} type="campfires" /></div>
      )}
    </main>
  );
}
