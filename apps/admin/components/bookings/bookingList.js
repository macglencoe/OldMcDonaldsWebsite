import Link from "next/link";

import { groupGazeboBookingsBySeason } from "@/lib/bookingFilters.mjs";

import CancelBookingButton from "./cancelBookingButton";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeZone: "UTC",
});

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function formatTime(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
    .format(new Date(2000, 0, 1, hours, minutes));
}

export default function BookingList({ bookings, type, returnTo = null }) {
  const detailUrl = (id) =>
    `/bookings/${type}/${id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  if (!bookings.length) {
    return <p className="rounded-xl border border-dashed p-8 text-center">No bookings have been created.</p>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article className={`rounded-xl border p-5 shadow-sm ${booking.status === "cancelled" ? "opacity-65" : "border-foreground/20"}`} key={booking.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                {type === "gazebo" ? `GZ-${booking.id}` : `CF-${booking.id}`} · {booking.status}
              </p>
              <h3 className="text-xl font-bold">
                <Link className="underline" href={detailUrl(booking.id)}>{booking.customer_name}</Link>
              </h3>
              <p>
                <a className="underline" href={`mailto:${booking.customer_email}`}>{booking.customer_email}</a>
                {" · "}
                <a className="underline" href={`tel:${booking.customer_phone_normalized}`}>{booking.customer_phone}</a>
              </p>
            </div>
            {booking.status !== "cancelled" && (
              <CancelBookingButton
                bookingId={booking.id}
                type={type === "gazebo" ? "gazebo" : "campfires"}
              />
            )}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div><dt className="font-semibold">Date</dt><dd>{formatDate(booking.booking_date)}</dd></div>
            {type === "gazebo" && (
              <div>
                <dt className="font-semibold">Slot</dt>
                <dd className="capitalize">{booking.time_slot} · {formatTime(booking.start_time)}–{formatTime(booking.end_time)}</dd>
              </div>
            )}
            <div><dt className="font-semibold">Party size</dt><dd>{booking.party_size ?? "Not provided"}</dd></div>
          </dl>
          {booking.internal_notes && <p className="mt-3"><strong>Internal notes:</strong> {booking.internal_notes}</p>}
          {booking.reservation_request_id && (
            <p className="mt-3">
              <Link className="font-semibold underline" href={`/reservation-requests?request=${booking.reservation_request_id}`}>
                Reservation request #{booking.reservation_request_id}
              </Link>
            </p>
          )}
          <Link className="mt-4 inline-block font-semibold underline" href={detailUrl(booking.id)}>
            {booking.status === "cancelled" ? "View historical booking" : "View or edit booking"}
          </Link>
        </article>
      ))}
    </div>
  );
}

export function GazeboBookingListBySeason({ bookings, seasons, returnTo = null }) {
  if (!bookings.length) {
    return <BookingList bookings={[]} returnTo={returnTo} type="gazebo" />;
  }

  const groups = groupGazeboBookingsBySeason(bookings, seasons);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.key}>
          <div className="mb-3">
            <h3 className="text-xl font-bold">{group.season?.season_name ?? "Outside configured seasons"}</h3>
            {group.season && (
              <p className="text-sm text-foreground/70">
                {formatDate(group.season.start_date)} through {formatDate(group.season.end_date)}
              </p>
            )}
          </div>
          <BookingList bookings={group.bookings} returnTo={returnTo} type="gazebo" />
        </section>
      ))}
    </div>
  );
}
