import Link from 'next/link';

import { getReservationRequests, RESERVATION_PAGE_SIZE } from '@/lib/reservationRequests.mjs';
import {
  formatDateOnly,
  getActiveBooking,
  getRequestSlotLabel,
  isRequestOpen,
  parseRequestId,
  parseRequestReviewFilter,
  parseSlot,
  REQUEST_REVIEW_FILTER_LABELS,
  REQUEST_REVIEW_STATUS_LABELS,
  SLOT_LABELS,
} from '@/lib/reservationRequestsView.mjs';
import { parsePage, parseYear } from '@/lib/mazeEntriesView.mjs';

import ReservationRequestReview, { RequestStatusBadge } from './reservationRequestReview.js';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reservation Requests | OMPP Admin' };

const submittedFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/New_York',
});
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeZone: 'UTC',
});

function formatDate(value) {
  return dateFormatter.format(new Date(`${formatDateOnly(value)}T00:00:00Z`));
}

function pageUrl({ page, year, slot, requestId, reviewFilter }) {
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (slot) params.set('slot', slot);
  if (requestId) params.set('request', requestId);
  if (!requestId && reviewFilter && reviewFilter !== 'open') params.set('review', reviewFilter);
  if (page > 1) params.set('page', page);
  return `/reservation-requests${params.size ? `?${params}` : ''}`;
}

function BookingHistory({ bookings }) {
  if (!bookings.length) return null;
  return (
    <section className="mt-5 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Booking history</h3>
      <ul className="mt-2 space-y-2">
        {bookings.map((booking) => (
          <li className="flex flex-wrap items-center justify-between gap-2" key={booking.id}>
            <span>
              <strong>GZ-{booking.id}</strong>
              {' · '}{formatDate(booking.booking_date)}
              {' · '}Gazebo {booking.gazebo_code}
              {' · '}<span className="capitalize">{booking.time_slot}</span>
              {' · '}<span className="capitalize">{booking.status}</span>
            </span>
            <Link className="font-semibold text-accent underline underline-offset-4" href={`/bookings/gazebo/${booking.id}`}>
              View booking
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RequestAction({ request }) {
  const activeBooking = getActiveBooking(request.bookings);
  if (activeBooking) {
    return (
      <Link
        className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:opacity-90"
        href={`/bookings/gazebo/${activeBooking.id}`}
      >
        View active booking GZ-{activeBooking.id}
      </Link>
    );
  }
  if (!isRequestOpen(request.review_status)) {
    return (
      <p className="mt-4 text-sm font-semibold text-foreground/65">
        No gazebo action available while this request is marked {REQUEST_REVIEW_STATUS_LABELS[request.review_status]}.
      </p>
    );
  }
  return (
    <Link
      className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:opacity-90"
      href={`/bookings/gazebo/new?request=${request.id}`}
    >
      {request.bookings.length ? 'Create replacement booking' : 'Review and create booking'}
    </Link>
  );
}

export default async function ReservationRequestsPage({ searchParams }) {
  const params = await searchParams;
  const year = parseYear(params?.year);
  const slot = parseSlot(params?.slot);
  const requestId = parseRequestId(params?.request);
  const reviewFilter = parseRequestReviewFilter(params?.review);
  const data = await getReservationRequests({
    page: parsePage(params?.page),
    year,
    slot,
    requestId,
    reviewFilter,
  });
  const exportParams = new URLSearchParams();
  if (year) exportParams.set('year', year);
  if (slot) exportParams.set('slot', slot);

  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Form submissions</p>
          <h1 className="text-3xl font-bold">Reservation requests</h1>
          <p className="mt-2 text-foreground/70">Requests are not confirmed bookings.</p>
        </div>
        <a
          className="h-fit rounded-lg bg-accent px-4 py-2 font-semibold text-white"
          href={`/reservation-requests/export${exportParams.size ? `?${exportParams}` : ''}`}
        >
          Download CSV
        </a>
      </div>

      {requestId && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/[0.07] p-4">
          <p className="font-semibold">Showing reservation request #{requestId}</p>
          <Link className="underline" href="/reservation-requests">Show open requests</Link>
        </div>
      )}

      {!requestId && (
        <form className="mb-6 flex flex-wrap items-end gap-3">
          <label className="font-semibold">
            Review status
            <select className="mt-1 block rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={reviewFilter} name="review">
              {Object.entries(REQUEST_REVIEW_FILTER_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="font-semibold">
            Year
            <select className="mt-1 block rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={year ?? ''} name="year">
              <option value="">All</option>
              {data.years.map((availableYear) => <option key={availableYear}>{availableYear}</option>)}
            </select>
          </label>
          <label className="font-semibold">
            Time
            <select className="mt-1 block rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={slot ?? ''} name="slot">
              <option value="">All</option>
              {Object.entries(SLOT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <button className="rounded-lg border border-foreground px-4 py-2 font-semibold transition hover:bg-foreground hover:text-white">Apply</button>
          <Link className="p-2 font-semibold underline underline-offset-4" href="/reservation-requests">Clear</Link>
        </form>
      )}

      <p className="mb-3 text-sm">
        Showing {data.totalEntries ? ((data.currentPage - 1) * RESERVATION_PAGE_SIZE) + 1 : 0}–
        {Math.min(data.currentPage * RESERVATION_PAGE_SIZE, data.totalEntries)} of {data.totalEntries}
      </p>

      <div className="space-y-4">
        {data.entries.map((request) => (
          <article className="rounded-xl border border-foreground/20 p-5 shadow-sm" key={request.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">#{request.id} · {request.name}</h2><RequestStatusBadge status={request.review_status} /></div>
                <p>
                  <a className="underline" href={`mailto:${request.email}`}>{request.email}</a>
                  {' · '}
                  <a className="underline" href={`tel:${request.phone_normalized}`}>{request.phone}</a>
                </p>
              </div>
              <p className="text-sm text-foreground/60">
                Submitted {submittedFormatter.format(new Date(request.created_at))}
              </p>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div><dt className="font-semibold">Preferred date</dt><dd>{formatDate(request.preferred_date)}</dd></div>
              <div><dt className="font-semibold">Preferred time</dt><dd>{getRequestSlotLabel(request)}</dd></div>
              <div><dt className="font-semibold">Price acknowledged</dt><dd>${(request.price_cents_snapshot / 100).toFixed(2)}</dd></div>
            </dl>
            {request.fallback_dates && <p className="mt-3"><strong>Fallbacks:</strong> {request.fallback_dates}</p>}
            {request.additional_comments && <p className="mt-2"><strong>Comments:</strong> {request.additional_comments}</p>}
            <BookingHistory bookings={request.bookings} />
            <RequestAction request={request} />
            <ReservationRequestReview request={request} />
          </article>
        ))}
        {!data.entries.length && (
          <p className="rounded-xl border border-dashed p-8 text-center">
            {requestId ? 'Reservation request not found.' : 'No requests match this filter.'}
          </p>
        )}
      </div>

      {data.totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between gap-4">
          {data.currentPage > 1
            ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={pageUrl({ page: data.currentPage - 1, year, slot, requestId, reviewFilter })}>Previous</Link>
            : <span />}
          <span className="text-sm font-semibold">Page {data.currentPage} of {data.totalPages}</span>
          {data.currentPage < data.totalPages
            ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={pageUrl({ page: data.currentPage + 1, year, slot, requestId, reviewFilter })}>Next</Link>
            : <span />}
        </nav>
      )}
    </main>
  );
}
