"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Timeline from "./timeline";
import FetchedStatus from "./fetchedStatus";
import { HAYRIDE_WAGONS, HAYRIDE_WAGON_LOOKUP, getWagonDefaults } from "@/lib/wagons";
import { getSlotsForDate } from "@/lib/slots";

const DEFAULT_POLL_INTERVAL = 30000; // 30 seconds
const EDIT_POLL_INTERVAL = 2000; // 2 seconds

function clampFilled(value, capacity) {
  const numericCapacity = Number.isFinite(capacity) ? Math.max(0, capacity) : 0;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0;
  }
  if (numericCapacity === 0) {
    return Math.max(0, Math.round(numericValue));
  }
  return Math.max(0, Math.min(Math.round(numericValue), numericCapacity));
}

function mergeSlotWithRoster(slot) {
  const existingWagons = Array.isArray(slot?.wagons) ? slot.wagons : [];
  const existingMap = new Map(existingWagons.map((wagon) => [wagon?.id, wagon]));

  const merged = HAYRIDE_WAGONS.map((rosterWagon) => {
    const existing = existingMap.get(rosterWagon.id);
    if (existing) {
      const capacity = Number.isFinite(existing.capacity)
        ? existing.capacity
        : rosterWagon.capacity ?? 0;
      const version = Number(existing.version);
      const filledValue = existing.filled ?? existing.fill;
      return {
        ...rosterWagon,
        ...existing,
        capacity,
        filled: clampFilled(filledValue, capacity),
        fill: clampFilled(existing.fill ?? filledValue ?? 0, capacity),
        version: Number.isFinite(version) && version > 0 ? Math.round(version) : 1,
      };
    }

    return {
      ...rosterWagon,
      filled: 0,
      fill: 0,
      version: 1,
    };
  });

  // Preserve any extra wagons not in the roster definition.
  existingWagons.forEach((wagon) => {
    if (!wagon?.id || HAYRIDE_WAGON_LOOKUP[wagon.id]) {
      return;
    }
    const capacity = Number.isFinite(wagon.capacity) ? wagon.capacity : 0;
    const filledValue = wagon.filled ?? wagon.fill;
    const version = Number(wagon.version);
    merged.push({
      ...wagon,
      filled: clampFilled(filledValue, capacity),
      fill: clampFilled(wagon.fill ?? filledValue ?? 0, capacity),
      version: Number.isFinite(version) && version > 0 ? Math.round(version) : 1,
    });
  });

  return {
    ...slot,
    start: slot?.start ?? null,
    label: slot?.label ?? null,
    wagons: merged,
  };
}

function getOrdinalSuffix(day) {
  const rem100 = day % 100;
  if (rem100 >= 11 && rem100 <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatScheduleDate(dateString) {
  if (typeof dateString !== "string" || !dateString) {
    return null;
  }

  const [yearString, monthString, dayString] = dateString.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return dateString;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const ordinal = getOrdinalSuffix(day);
  if (typeof formatter.formatToParts === "function") {
    return formatter
      .formatToParts(date)
      .map((part) => (part.type === "day" ? `${part.value}${ordinal}` : part.value))
      .join("");
  }

  const formatted = formatter.format(date);
  return formatted.replace(new RegExp(`\\b${day}\\b`), `${day}${ordinal}`);
}

export default function HayrideScheduleView({
  initialData = null,
  initialMeta = null,
  initialError = null,
  isEditable = false,
  pollInterval = isEditable ? EDIT_POLL_INTERVAL : DEFAULT_POLL_INTERVAL,
}) {
  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(initialMeta);
  const [error, setError] = useState(initialError);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof initialData?.date === "string" && initialData.date) {
      return initialData.date;
    }
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  useEffect(() => {
    setData(initialData);
    setMeta(initialMeta);
    setError(initialError);
  }, [initialData, initialMeta, initialError]);

  const fetchSchedule = useCallback(async (targetDate = selectedDate) => {
    try {
      setIsFetching(true);
      const query = targetDate ? `?date=${encodeURIComponent(targetDate)}` : "";
      const response = await fetch(`/api/hayrides${query}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      const payload = await response.json();
      setData(payload?.data ?? null);
      setMeta(payload?.meta ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsFetching(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!pollInterval || pollInterval <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchSchedule(selectedDate);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchSchedule, pollInterval, selectedDate]);

  useEffect(() => {
    fetchSchedule(selectedDate);
  }, [selectedDate, fetchSchedule]);

  const handleManualRefresh = useCallback(() => {
    fetchSchedule(selectedDate);
  }, [fetchSchedule, selectedDate]);

  const handleWagonFilledChange = useCallback(
    ({ slotStart, wagonId, filled, version, meta: updateMeta, date }) => {
      if (!wagonId) {
        return;
      }

      const effectiveDate = date ?? (typeof slotStart === "string" ? slotStart.slice(0, 10) : null) ?? selectedDate;
      if (effectiveDate !== selectedDate) {
        return;
      }

      setData((previous) => {
        if (!previous || !Array.isArray(previous.slots)) {
          return previous;
        }

        let changed = false;

        const nextSlots = previous.slots.map((slot) => {
          if (slotStart && slot?.start !== slotStart) {
            return slot;
          }

          const existingWagons = Array.isArray(slot?.wagons) ? [...slot.wagons] : [];
          const targetIndex = existingWagons.findIndex((wagon) => wagon?.id === wagonId);
          const numericFilled = Number.isFinite(filled) ? Math.max(0, Math.round(filled)) : null;
          const numericVersion = Number.isFinite(version) ? Math.max(1, Math.round(version)) : null;

          if (targetIndex === -1) {
            const defaults = getWagonDefaults(wagonId);
            const baseCapacity = Number.isFinite(defaults.capacity) ? defaults.capacity : 0;
            const newWagon = {
              ...defaults,
              id: wagonId,
              capacity: baseCapacity,
              filled: numericFilled ?? 0,
              fill: numericFilled ?? 0,
              version: numericVersion ?? 1,
            };
            existingWagons.push(newWagon);
            changed = true;
            return {
              ...slot,
              wagons: existingWagons,
            };
          }

          const nextWagons = existingWagons.map((wagon, index) => {
            if (index !== targetIndex) {
              return wagon;
            }
            const updated = { ...wagon };
            if (numericFilled !== null) {
              updated.filled = numericFilled;
              updated.fill = numericFilled;
            }
            if (numericVersion !== null) {
              updated.version = numericVersion;
            }
            return updated;
          });

          changed = true;
          return {
            ...slot,
            wagons: nextWagons,
          };
        });

        if (!changed) {
          return previous;
        }

        const patchedSlots = isEditable
          ? nextSlots.map(mergeSlotWithRoster)
          : nextSlots;

        const patched = { ...previous, slots: patchedSlots };
        if (updateMeta?.lastUpdated) {
          patched.lastUpdated = updateMeta.lastUpdated;
        }
        return patched;
      });

      if (updateMeta) {
        setMeta((previousMeta) => ({
          ...(previousMeta ?? {}),
          ...updateMeta,
          fetchedAt: new Date().toISOString(),
        }));
      }
    },
    [selectedDate]
  );

  const slots = useMemo(() => {
    const baseSlots = Array.isArray(data?.slots) ? data.slots : [];

    const rosterSlots = getSlotsForDate(selectedDate).map((template) => ({
      start: template.start,
      label: template.label,
      wagons: [],
    }));

    const slotKey = (slot) => {
      if (!slot?.start) {
        return `${selectedDate}|${slot?.label ?? ""}`;
      }
      const start = slot.start;
      const keyDate = start.slice(0, 10) || selectedDate;
      const timePart = start.slice(11, 16) || slot?.label || "";
      return `${keyDate}|${timePart}`;
    };

    const fetchedMap = new Map();
    baseSlots.forEach((slot) => {
      fetchedMap.set(slotKey(slot), slot);
    });

    const mergedSlots = rosterSlots.map((slot) => {
      const fetched = fetchedMap.get(slotKey(slot));
      if (!fetched) {
        return mergeSlotWithRoster(slot);
      }

      const slotWithStart = {
        ...fetched,
        start: fetched?.start ?? slot.start ?? null,
        label: fetched?.label ?? slot.label ?? null,
      };

      return mergeSlotWithRoster(slotWithStart);
    });

    baseSlots.forEach((slot) => {
      const key = slotKey(slot);
      if (!fetchedMap.has(key)) {
        const slotWithStart = {
          ...slot,
          start: slot?.start ?? null,
          label: slot?.label ?? null,
        };
        mergedSlots.push(mergeSlotWithRoster(slotWithStart));
      }
    });

    return mergedSlots.sort((a, b) => {
      const timeA = new Date(a?.start ?? 0).getTime();
      const timeB = new Date(b?.start ?? 0).getTime();
      return timeA - timeB;
    });
  }, [data, selectedDate]);

  const scheduleDate = selectedDate;
  const timezone = data?.timezone ?? null;
  const lastUpdated = data?.lastUpdated ?? null;
  const fetchedAt = meta?.fetchedAt ?? null;
  const formattedScheduleDate = useMemo(() => formatScheduleDate(scheduleDate), [scheduleDate]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hayride Schedule</h1>
            {formattedScheduleDate ? (
              <p className="text-5xl text-accent">
                {formattedScheduleDate}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <label className="font-medium text-gray-700" htmlFor="schedule-date">
              Select date
            </label>
            <input
              id="schedule-date"
              type="date"
              value={scheduleDate ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                if (!value) {
                  return;
                }
                setSelectedDate(value);
              }}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <FetchedStatus lastUpdated={lastUpdated} fetchedAt={fetchedAt} />
        {error ? (
          <p className="text-sm text-red-600">Failed to load schedule: {error}</p>
        ) : null}
      </header>

      <Timeline
        slots={slots}
        isEditable={isEditable}
        date={scheduleDate}
        onWagonFilledChange={isEditable ? handleWagonFilledChange : undefined}
      />
    </main>
  );
}
