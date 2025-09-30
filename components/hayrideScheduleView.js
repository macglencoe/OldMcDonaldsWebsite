"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Timeline from "./timeline";
import FetchedStatus from "./fetchedStatus";
import { HAYRIDE_WAGONS, HAYRIDE_WAGON_LOOKUP, getWagonDefaults } from "@/lib/wagons";

const DEFAULT_POLL_INTERVAL = 30000; // 30 seconds

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

export default function HayrideScheduleView({
  initialData = null,
  initialMeta = null,
  initialError = null,
  pollInterval = DEFAULT_POLL_INTERVAL,
  isEditable = false,
}) {
  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(initialMeta);
  const [error, setError] = useState(initialError);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setData(initialData);
    setMeta(initialMeta);
    setError(initialError);
  }, [initialData, initialMeta, initialError]);

  const fetchSchedule = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch("/api/hayrides", { cache: "no-store" });
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
  }, []);

  useEffect(() => {
    if (!pollInterval || pollInterval <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchSchedule();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchSchedule, pollInterval]);

  const handleManualRefresh = useCallback(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleWagonFilledChange = useCallback(
    ({ slotStart, wagonId, filled, version, meta: updateMeta }) => {
      if (!wagonId) {
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
    []
  );

  const slots = useMemo(() => {
    const baseSlots = Array.isArray(data?.slots) ? data.slots : [];
    if (!isEditable) {
      return baseSlots;
    }
    return baseSlots.map(mergeSlotWithRoster);
  }, [data, isEditable]);
  const scheduleDate = data?.date ?? null;
  const timezone = data?.timezone ?? null;
  const lastUpdated = data?.lastUpdated ?? null;
  const fetchedAt = meta?.fetchedAt ?? null;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hayride Schedule</h1>
            {scheduleDate ? (
              <p className="text-sm text-gray-600">
                Date: {scheduleDate}
                {timezone ? ` (${timezone})` : ""}
              </p>
            ) : null}
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
        onWagonFilledChange={isEditable ? handleWagonFilledChange : undefined}
      />
    </main>
  );
}
