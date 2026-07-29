"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PiArrowsClockwiseBold } from "react-icons/pi";

import {
  HAYRIDE_TIME_ZONE,
  todayInHayrideTimeZone,
} from "@/lib/hayrideSchedule.mjs";

import HayrideTimeline from "./hayrideTimeline";

const VIEW_POLL_INTERVAL = 30_000;
const EDIT_POLL_INTERVAL = 2_000;

function ordinal(day) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  return `${day}${({ 1: "st", 2: "nd", 3: "rd" })[day % 10] ?? "th"}`;
}

function formatScheduleDate(dateString) {
  const [year, month, day] = (dateString ?? "").split("-").map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(Date.UTC(year, month - 1, day));
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  return parts.map((part) => part.type === "day" ? ordinal(day) : part.value).join("");
}

function FetchedStatus({ fetchedAt, lastUpdated }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1_000);
    return () => clearInterval(timer);
  }, []);

  if (!fetchedAt) return <span className="text-sm text-foreground/60">Waiting for schedule data…</span>;
  const seconds = Math.max(0, Math.round((Date.now() - new Date(fetchedAt).getTime()) / 1_000));

  return (
    <span className="text-sm text-foreground/60">
      Fetched {seconds < 2 ? "just now" : `${seconds} seconds ago`}
      {lastUpdated ? ` · Server response ${new Date(lastUpdated).toLocaleTimeString()}` : ""}
    </span>
  );
}

export default function HayrideScheduleView({ isEditable = false }) {
  const [selectedDate, setSelectedDate] = useState(() => todayInHayrideTimeZone());
  const [schedule, setSchedule] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchSchedule = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setIsFetching(true);
    try {
      const response = await fetch(`/api/hayrides?date=${encodeURIComponent(selectedDate)}`, {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message ?? `Request failed with ${response.status}`);
      }
      setSchedule(payload?.data ?? null);
      setMeta(payload?.meta ?? null);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load the schedule.");
    } finally {
      if (!quiet) setIsFetching(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSchedule();
    const pollInterval = isEditable ? EDIT_POLL_INTERVAL : VIEW_POLL_INTERVAL;
    const timer = setInterval(() => fetchSchedule({ quiet: true }), pollInterval);
    return () => clearInterval(timer);
  }, [fetchSchedule, isEditable]);

  const formattedDate = useMemo(() => formatScheduleDate(selectedDate), [selectedDate]);

  const handleWagonChange = useCallback(({ slotStart, wagonId, wagon, updateMeta }) => {
    if (!wagonId || !wagon) return;
    setSchedule((current) => {
      if (!current?.slots) return current;
      return {
        ...current,
        lastUpdated: updateMeta?.lastUpdated ?? current.lastUpdated,
        slots: current.slots.map((slot) => slot.start !== slotStart
          ? slot
          : {
            ...slot,
            wagons: slot.wagons.map((entry) => entry.id === wagonId ? { ...entry, ...wagon } : entry),
          }),
      };
    });
  }, []);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-7 px-3 py-8 sm:px-6">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-background p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
              {isEditable ? "Admissions console" : "Driver console"}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Hayride Schedule</h1>
            <p className="mt-2 text-3xl font-semibold text-accent sm:text-5xl">{formattedDate}</p>
          </div>

          <div className="flex min-w-52 flex-col gap-2">
            <label className="text-sm font-semibold text-foreground/80" htmlFor="hayride-date">
              Schedule date
            </label>
            <input
              id="hayride-date"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                if (!event.target.value) return;
                setSchedule(null);
                setMeta(null);
                setError(null);
                setSelectedDate(event.target.value);
              }}
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <div className="flex gap-2">
              <Link
                href={isEditable ? "/hayrides" : "/hayrides/edit"}
                className="flex-1 rounded-lg border border-foreground/20 px-3 py-2 text-center text-sm font-semibold hover:bg-foreground/5"
              >
                {isEditable ? "View only" : "Edit counts"}
              </Link>
              <button
                type="button"
                onClick={() => fetchSchedule()}
                disabled={isFetching}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
              >
                <PiArrowsClockwiseBold className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-foreground/10 pt-3">
          <FetchedStatus fetchedAt={meta?.fetchedAt} lastUpdated={schedule?.lastUpdated} />
          <span className="ml-2 text-xs text-foreground/40">({schedule?.timezone ?? HAYRIDE_TIME_ZONE})</span>
        </div>
        {error ? (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Failed to load schedule: {error}
          </p>
        ) : null}
      </header>

      {isFetching && !schedule ? (
        <div className="rounded-2xl border border-foreground/10 p-10 text-center text-foreground/60">
          Loading hayride schedule…
        </div>
      ) : (
        <HayrideTimeline
          slots={schedule?.date === selectedDate ? schedule.slots : []}
          date={selectedDate}
          isEditable={isEditable}
          onWagonChange={handleWagonChange}
        />
      )}
    </main>
  );
}
