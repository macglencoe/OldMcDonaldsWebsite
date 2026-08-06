"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { useMemo, useState } from "react";

const STATUS_COLORS = {
  tentative: "#b45309",
  confirmed: "#166534",
  cancelled: "#6b7280",
};

function formatTime(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function dateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initialVisibleRange(initialDate) {
  const parsed = initialDate ? new Date(`${initialDate}T12:00:00`) : new Date();
  return {
    start: dateString(new Date(parsed.getFullYear(), parsed.getMonth(), 1)),
    end: dateString(new Date(parsed.getFullYear(), parsed.getMonth() + 1, 1)),
  };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function BookingCalendar({
  bookings,
  type,
  returnTo = null,
  seasons = [],
  initialDate = null,
}) {
  const [visibleRange, setVisibleRange] = useState(() => initialVisibleRange(initialDate));
  const events = useMemo(
    () =>
      bookings.map((booking) => ({
        id: booking.id,
        start: booking.booking_date,
        allDay: true,
        url: `/bookings/${type}/${booking.id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`,
        color: STATUS_COLORS[booking.status],
        title:
          type === "gazebo"
            ? `Gazebo ${booking.gazebo_code} · ${booking.time_slot === "early" ? "Early" : "Late"} · ${booking.customer_name}`
            : `CF-${booking.id} · ${booking.customer_name}`,
        extendedProps: booking,
      })),
    [bookings, returnTo, type],
  );
  const visibleSeasons = useMemo(
    () => seasons.filter(
      (season) => season.start_date < visibleRange.end && season.end_date >= visibleRange.start,
    ),
    [seasons, visibleRange],
  );

  return (
    <div>
      {type === "gazebo" && (
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          {visibleSeasons.map((season) => (
            <div className="rounded-xl border border-accent/30 bg-accent/[0.07] p-4" key={season.id}>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Visible season</p>
              <h3 className="text-lg font-bold">{season.season_name}</h3>
              <p className="text-sm text-foreground/70">{formatDate(season.start_date)}–{formatDate(season.end_date)}</p>
              <p className="mt-2 text-sm font-medium">
                Early: {formatTime(season.early_start_time)}–{formatTime(season.early_end_time)}
                {" · "}
                Late: {formatTime(season.late_start_time)}–{formatTime(season.late_end_time)}
              </p>
            </div>
          ))}
          {!visibleSeasons.length && (
            <p className="rounded-xl border border-dashed border-foreground/30 p-4 text-foreground/70 md:col-span-2">
              No gazebo season is configured for the visible month.
            </p>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-foreground/20 bg-white p-3 shadow-sm">
        <div className="min-w-[700px]">
        <FullCalendar
          datesSet={({ view }) => {
            const nextRange = {
              start: dateString(view.currentStart),
              end: dateString(view.currentEnd),
            };
            setVisibleRange((current) =>
              current.start === nextRange.start && current.end === nextRange.end
                ? current
                : nextRange
            );
          }}
          dayMaxEvents
          events={events}
          eventContent={({ event }) => {
            const booking = event.extendedProps;
            return (
              <div className="overflow-hidden px-1 py-0.5 text-xs leading-tight">
                <strong>{event.title}</strong>
                {type === "gazebo" && (
                  <div>{formatTime(booking.start_time)}–{formatTime(booking.end_time)}</div>
                )}
              </div>
            );
          }}
          fixedWeekCount={false}
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          initialDate={initialDate ?? undefined}
          initialView="dayGridMonth"
          plugins={[dayGridPlugin]}
        />
        </div>
      </div>
    </div>
  );
}
