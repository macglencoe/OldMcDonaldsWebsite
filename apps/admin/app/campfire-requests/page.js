import Link from 'next/link';
import { getCampfireRequests, CAMPFIRE_REQUEST_PAGE_SIZE } from '@/lib/campfireRequests.mjs';
import { getActiveBooking, isRequestOpen, parseRequestId, parseRequestReviewFilter, REQUEST_REVIEW_FILTER_LABELS, REQUEST_REVIEW_STATUS_LABELS, formatDateOnly } from '@/lib/reservationRequestsView.mjs';
import { parsePage, parseYear } from '@/lib/mazeEntriesView.mjs';
import ReservationRequestReview, { RequestStatusBadge } from '@/app/reservation-requests/reservationRequestReview.js';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campfire Requests | OMPP Admin' };
const submittedFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' });
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });
const formatDate = value => dateFormatter.format(new Date(`${formatDateOnly(value)}T00:00:00Z`));

function pageUrl({ page, year, requestId, reviewFilter }) {
  const params = new URLSearchParams();
  if (year) params.set('year', year); if (requestId) params.set('request', requestId);
  if (!requestId && reviewFilter !== 'open') params.set('review', reviewFilter); if (page > 1) params.set('page', page);
  return `/campfire-requests${params.size ? `?${params}` : ''}`;
}

function RequestAction({ request }) {
  const active = getActiveBooking(request.bookings);
  if (active) return <Link className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white" href={`/bookings/campfires/${active.id}`}>View active booking CF-{active.id}</Link>;
  if (!isRequestOpen(request.review_status)) return <p className="mt-4 text-sm font-semibold text-foreground/65">No booking action available while marked {REQUEST_REVIEW_STATUS_LABELS[request.review_status]}.</p>;
  return <Link className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white" href={`/bookings/campfires/new?request=${request.id}`}>{request.bookings.length ? 'Create replacement booking' : 'Review and create booking'}</Link>;
}

export default async function CampfireRequestsPage({ searchParams }) {
  const params = await searchParams; const year = parseYear(params?.year); const requestId = parseRequestId(params?.request); const reviewFilter = parseRequestReviewFilter(params?.review);
  const data = await getCampfireRequests({ page: parsePage(params?.page), year, requestId, reviewFilter });
  return <main className="px-4 py-8 sm:px-8">
    <div className="mb-7 flex flex-wrap justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Night Maze form submissions</p><h1 className="text-3xl font-bold">Campfire requests</h1><p className="mt-2 text-foreground/70">Requests are not confirmed bookings.</p></div><a className="h-fit rounded-lg bg-accent px-4 py-2 font-semibold text-white" href={`/campfire-requests/export${year ? `?year=${year}` : ''}`}>Download CSV</a></div>
    {requestId && <div className="mb-5 flex justify-between rounded-lg border border-accent/30 bg-accent/[0.07] p-4"><p className="font-semibold">Showing request CF-{requestId}</p><Link className="underline" href="/campfire-requests">Show open requests</Link></div>}
    {!requestId && <form className="mb-6 flex flex-wrap items-end gap-3">
      <label className="font-semibold">Review status<select className="mt-1 block rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={reviewFilter} name="review">{Object.entries(REQUEST_REVIEW_FILTER_LABELS).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="font-semibold">Year<select className="mt-1 block rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={year ?? ''} name="year"><option value="">All</option>{data.years.map(value => <option key={value}>{value}</option>)}</select></label>
      <button className="rounded-lg border border-foreground px-4 py-2 font-semibold">Apply</button><Link className="p-2 font-semibold underline" href="/campfire-requests">Clear</Link>
    </form>}
    <p className="mb-3 text-sm">Showing {data.totalEntries ? (data.currentPage-1)*CAMPFIRE_REQUEST_PAGE_SIZE+1 : 0}–{Math.min(data.currentPage*CAMPFIRE_REQUEST_PAGE_SIZE,data.totalEntries)} of {data.totalEntries}</p>
    <div className="space-y-4">{data.entries.map(request => <article className="rounded-xl border border-foreground/20 p-5 shadow-sm" key={request.id}>
      <div className="flex flex-wrap justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="text-xl font-bold">CF-{request.id} · {request.name}</h2><RequestStatusBadge status={request.review_status}/></div><p><a className="underline" href={`mailto:${request.email}`}>{request.email}</a> · <a className="underline" href={`tel:${request.phone_normalized}`}>{request.phone}</a></p></div><p className="text-sm text-foreground/60">Submitted {submittedFormatter.format(new Date(request.created_at))}</p></div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3"><div><dt className="font-semibold">Preferred night</dt><dd>{formatDate(request.preferred_date)}</dd></div><div><dt className="font-semibold">Party size</dt><dd>{request.party_size ?? 'Not provided'}</dd></div><div><dt className="font-semibold">Price acknowledged</dt><dd>${(request.price_cents_snapshot/100).toFixed(2)}</dd></div></dl>
      {request.fallback_dates && <p className="mt-3"><strong>Other dates:</strong> {request.fallback_dates}</p>}{request.additional_comments && <p className="mt-2"><strong>Comments:</strong> {request.additional_comments}</p>}
      {request.bookings.length > 0 && <ul className="mt-4 rounded-lg border p-3">{request.bookings.map(booking => <li key={booking.id}>CF-{booking.id} · {formatDate(booking.booking_date)} · {booking.status} · <Link className="underline" href={`/bookings/campfires/${booking.id}`}>View</Link></li>)}</ul>}
      <RequestAction request={request}/><ReservationRequestReview endpoint="/api/campfire-requests/review" request={request} requestLabel="campfire request" />
    </article>)}{!data.entries.length && <p className="rounded-xl border border-dashed p-8 text-center">{requestId ? 'Campfire request not found.' : 'No requests match this filter.'}</p>}</div>
    {data.totalPages > 1 && <nav className="mt-6 flex justify-between">{data.currentPage>1?<Link className="rounded-lg border px-4 py-2" href={pageUrl({page:data.currentPage-1,year,requestId,reviewFilter})}>Previous</Link>:<span/>}<span>Page {data.currentPage} of {data.totalPages}</span>{data.currentPage<data.totalPages?<Link className="rounded-lg border px-4 py-2" href={pageUrl({page:data.currentPage+1,year,requestId,reviewFilter})}>Next</Link>:<span/>}</nav>}
  </main>;
}
