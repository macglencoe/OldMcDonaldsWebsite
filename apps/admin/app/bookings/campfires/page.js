import Link from "next/link";

import BookingCalendar from "@/components/bookings/bookingCalendar";
import BookingFilters from "@/components/bookings/bookingFilters";
import BookingList from "@/components/bookings/bookingList";
import { bookingFilterParams, parseBookingFilters } from "@/lib/bookingFilters.mjs";
import { getCampfireBookings } from "@/lib/bookings.mjs";
import { parsePage } from "@/lib/mazeEntriesView.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Campfire Bookings | OMPP Admin" };

const PAGE_SIZE = 25;

export default async function CampfireBookingsPage({ searchParams }) {
  const params = await searchParams;
  const filters = parseBookingFilters(params, "campfires");
  const bookings = await getCampfireBookings(filters);
  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(params?.page), totalPages);
  const listedBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const returnParams = bookingFilterParams(filters, { page: currentPage });
  const returnTo = `/bookings/campfires${returnParams.size ? `?${returnParams}` : ""}`;
  const pageHref = (page) => {
    const query = bookingFilterParams(filters, { page });
    return `/bookings/campfires${query.size ? `?${query}` : ""}`;
  };
  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Bookings</p>
          <h1 className="text-3xl font-bold">Campfires</h1>
          <p className="mt-2 text-foreground/70">Each record reserves one campfire for the selected night.</p>
        </div>
        <Link className="rounded-lg bg-accent px-4 py-2 font-semibold text-white" href="/bookings/campfires/new">New booking</Link>
      </div>
      <BookingFilters filters={filters} type="campfires" />
      <p className="mt-4 text-sm text-foreground/70">
        {bookings.length} matching booking{bookings.length === 1 ? "" : "s"}.
        {filters.status === "active" && " Cancelled bookings are hidden."}
      </p>
      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-bold">Calendar</h2>
        <BookingCalendar bookings={bookings} returnTo={returnTo} type="campfires" />
      </section>
      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-bold">All bookings</h2>
        <BookingList bookings={listedBookings} returnTo={returnTo} type="campfires" />
        {totalPages > 1 && (
          <nav className="mt-6 flex justify-between">
            {currentPage > 1 ? <Link href={pageHref(currentPage - 1)}>Previous</Link> : <span />}
            <span>Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages ? <Link href={pageHref(currentPage + 1)}>Next</Link> : <span />}
          </nav>
        )}
      </section>
    </main>
  );
}
