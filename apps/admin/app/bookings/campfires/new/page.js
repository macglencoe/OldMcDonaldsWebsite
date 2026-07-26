import Link from "next/link";

import BookingForm from "@/components/bookings/bookingForm";

export const metadata = { title: "New Campfire Booking | OMPP Admin" };

export default function NewCampfireBookingPage() {
  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="underline" href="/bookings/campfires">← Campfire bookings</Link>
      <h1 className="mt-4 text-3xl font-bold">New campfire booking</h1>
      <p className="mb-8 mt-2 text-foreground/70">One booking reserves one campfire.</p>
      <BookingForm type="campfires" />
    </main>
  );
}
