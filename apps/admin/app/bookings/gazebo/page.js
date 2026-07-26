import Link from "next/link";
import { PiGearBold, PiPlusBold, PiWarningBold } from "react-icons/pi";

import BookingCalendar from "@/components/bookings/bookingCalendar";
import BookingFilters from "@/components/bookings/bookingFilters";
import { GazeboBookingListBySeason } from "@/components/bookings/bookingList";
import { bookingFilterParams, parseBookingFilters } from "@/lib/bookingFilters.mjs";
import { getGazeboBookings, getGazeboSeasons } from "@/lib/bookings.mjs";
import { parsePage } from "@/lib/mazeEntriesView.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gazebo Bookings | OMPP Admin" };

const PAGE_SIZE = 25;

function easternDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function initialCalendarDate(bookings, seasons) {
  if (bookings.length) return bookings[0].booking_date;
  const today = easternDate();
  const current = seasons.find((season) => season.start_date <= today && season.end_date >= today);
  if (current) return today;
  const upcoming = seasons
    .filter((season) => season.start_date > today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
  return upcoming?.start_date ?? seasons[0]?.start_date ?? null;
}

export default async function GazeboBookingsPage({ searchParams }) {
  const params = await searchParams;
  const filters = parseBookingFilters(params, "gazebo");
  const [bookings, seasons] = await Promise.all([getGazeboBookings(filters), getGazeboSeasons()]);
  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(params?.page), totalPages);
  const listedBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const returnParams = bookingFilterParams(filters, { page: currentPage });
  const returnTo = `/bookings/gazebo${returnParams.size ? `?${returnParams}` : ""}`;
  const calendarDate = initialCalendarDate(bookings, seasons);
  const pageHref = (page) => {
    const query = bookingFilterParams(filters, { page });
    return `/bookings/gazebo${query.size ? `?${query}` : ""}`;
  };
  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Bookings</p>
          <h1 className="text-3xl font-bold">Gazebo</h1>
          <p className="mt-2 text-foreground/70">One gazebo with an early and late slot each day.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex items-center gap-2 rounded-lg border border-foreground px-4 py-2 font-semibold transition hover:bg-foreground hover:text-white" href="/bookings/gazebo/seasons">
            <PiGearBold aria-hidden="true" /> Season settings
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:opacity-90" href="/bookings/gazebo/new">
            <PiPlusBold aria-hidden="true" /> New booking
          </Link>
        </div>
      </div>
      {!seasons.length && (
        <p className="mt-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">
          <PiWarningBold aria-hidden="true" size={20} /> Create a gazebo season before adding bookings.
        </p>
      )}
      <BookingFilters filters={filters} type="gazebo" />
      <p className="mt-4 text-sm text-foreground/70">
        {bookings.length} matching booking{bookings.length === 1 ? "" : "s"}.
        {filters.status === "active" && " Cancelled bookings are hidden."}
      </p>
      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-bold">Calendar</h2>
        <BookingCalendar
          bookings={bookings}
          initialDate={calendarDate}
          returnTo={returnTo}
          seasons={seasons}
          type="gazebo"
        />
      </section>
      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-bold">All bookings</h2>
        <GazeboBookingListBySeason
          bookings={listedBookings}
          returnTo={returnTo}
          seasons={seasons}
        />
        {totalPages > 1 && (
          <nav className="mt-6 flex justify-between">
            {currentPage > 1 ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={pageHref(currentPage - 1)}>Previous</Link> : <span />}
            <span className="self-center text-sm font-semibold">Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={pageHref(currentPage + 1)}>Next</Link> : <span />}
          </nav>
        )}
      </section>
    </main>
  );
}
