"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Timeline from "./timeline";
import FetchedStatus from "./fetchedStatus";

const DEFAULT_POLL_INTERVAL = 30000; // 30 seconds

function extractSlots(data) {
  return Array.isArray(data?.slots) ? data.slots : [];
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

          if (!Array.isArray(slot?.wagons)) {
            return slot;
          }

          let slotChanged = false;
          const nextWagons = slot.wagons.map((wagon) => {
            if (wagon?.id !== wagonId) {
              return wagon;
            }

            const updated = { ...wagon };
            if (Number.isFinite(filled)) {
              updated.filled = filled;
              updated.fill = filled;
            }
            if (Number.isFinite(version)) {
              updated.version = Math.max(1, Math.round(version));
            }
            slotChanged = true;
            return updated;
          });

          if (!slotChanged) {
            return slot;
          }

          changed = true;
          return { ...slot, wagons: nextWagons };
        });

        if (!changed) {
          return previous;
        }

        const patched = { ...previous, slots: nextSlots };
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

  const slots = useMemo(() => extractSlots(data), [data]);
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
