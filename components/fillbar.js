"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle, CircleNotch, Minus, Person, Plus, WarningCircle } from "phosphor-react";

const BAR_COLOR_CLASSES = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  lime: "bg-lime-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  teal: "bg-teal-500",
  violet: "bg-violet-500",
  yellow: "bg-yellow-500",
};

export default function Fillbar({
  color = "green",
  amount = 0,
  max = 0,
  isEditable = false,
  slotStart,
  wagonId,
  date,
  version,
  onChange,
}) {
  const [localVersion, setLocalVersion] = useState(() => {
    const numeric = Number(version);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDirection, setPendingDirection] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const numeric = Number(version);
    if (Number.isFinite(numeric) && numeric > localVersion) {
      setLocalVersion(numeric);
    }
  }, [version, localVersion]);

  useEffect(() => {
    if (!status || status.type !== "success") {
      return undefined;
    }
    const timeout = setTimeout(() => setStatus(null), 2000);
    return () => clearTimeout(timeout);
  }, [status]);
  const numericAmount = Number(amount);
  const hasPositiveAmount = Number.isFinite(numericAmount) && numericAmount > 0;
  const clampedAmount = hasPositiveAmount ? numericAmount : 0;
  const numericMax = Number(max);
  const hasPositiveMax = Number.isFinite(numericMax) && numericMax > 0;
  const safeMax = hasPositiveMax ? numericMax : clampedAmount || 1;

  const normalizedColor = String(color).toLowerCase();
  const fillClass = BAR_COLOR_CLASSES[normalizedColor] ?? "bg-gray-500";
  const totalSegments = Math.max(1, Math.round(safeMax));
  const filledSegments = Math.max(
    0,
    Math.min(totalSegments, Math.round(clampedAmount))
  );

  const displayAmount = Math.round(clampedAmount);
  const displayMax = Math.round(safeMax);

  const canIncrement = isEditable && filledSegments < totalSegments && !isSubmitting;
  const canDecrement = isEditable && filledSegments > 0 && !isSubmitting;

  const mutateServer = useCallback(
    async (delta) => {
      if (!slotStart) {
        setStatus({ type: "error", message: "Missing slot start time" });
        return;
      }

      if (!wagonId) {
        if (typeof onChange === "function") {
          const localNext = Math.max(0, Math.min(totalSegments, filledSegments + delta));
          onChange(localNext, {
            slotStart,
            wagonId,
            date,
          });
        }
        setStatus({ type: "success", message: "Updated locally" });
        return;
      }

      try {
        setIsSubmitting(true);
        setPendingDirection(Math.sign(delta));
        setStatus({ type: "info", message: "Saving..." });

        const response = await fetch("/api/hayrides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            slotStart,
            wagonId,
            delta,
            expectedVersion: localVersion,
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message = payload?.message ?? `Request failed with ${response.status}`;
          throw new Error(message);
        }

        const updatedWagon = payload?.data?.wagon ?? null;
        const nextFilled = updatedWagon?.filled;
        const nextVersion = updatedWagon?.version;

        if (Number.isFinite(nextVersion)) {
          setLocalVersion(nextVersion);
        }

        if (typeof onChange === "function" && Number.isFinite(nextFilled)) {
          onChange(nextFilled, {
            version: nextVersion,
            meta: payload?.meta ?? null,
            wagon: updatedWagon,
            date: payload?.data?.date ?? date ?? null,
            slotStart,
          });
        }

        setStatus({ type: "success", message: "Saved" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save";
        setStatus({ type: "error", message });
      } finally {
        setIsSubmitting(false);
        setPendingDirection(null);
      }
    },
    [date, filledSegments, localVersion, onChange, slotStart, totalSegments, wagonId]
  );

  const handleIncrement = () => {
    if (!canIncrement) {
      return;
    }
    const nextAmount = Math.min(totalSegments, filledSegments + 1);
    const delta = nextAmount - filledSegments;
    if (delta !== 0) {
      mutateServer(delta);
    }
  };

  const handleDecrement = () => {
    if (!canDecrement) {
      return;
    }
    const nextAmount = Math.max(0, filledSegments - 1);
    const delta = nextAmount - filledSegments;
    if (delta !== 0) {
      mutateServer(delta);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full overflow-hidden rounded-md border border-gray-300">
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isFilled = index < filledSegments;
          const isLastFilled = isEditable && isFilled && index === filledSegments - 1;
          const isNextToFill =
            isEditable &&
            !isFilled &&
            index === filledSegments &&
            filledSegments < totalSegments;

          const segmentClasses = clsx(
            "flex-1 basis-0 h-9 flex items-center justify-center text-xs font-semibold transition-colors border-l border-gray-200 first:border-l-0",
            isFilled ? clsx(fillClass, "text-white") : "bg-gray-100 text-gray-600"
          );

          if (isLastFilled) {
            return (
              <button
                type="button"
                key={index}
                onClick={handleDecrement}
                className={clsx(segmentClasses, "cursor-pointer select-none", (!canDecrement || isSubmitting) && "opacity-60" )}
                aria-label="Remove one"
                disabled={!canDecrement}
              >
                {isSubmitting && pendingDirection === -1 ? (
                  <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                ) : (
                  <Minus weight="bold" />
                )}
              </button>
            );
          }

          if (isNextToFill) {
            return (
              <button
                type="button"
                key={index}
                onClick={handleIncrement}
                className={clsx(segmentClasses, "cursor-pointer select-none", (!canIncrement || isSubmitting) && "opacity-60")}
                aria-label="Add one"
                disabled={!canIncrement}
              >
                {isSubmitting && pendingDirection === 1 ? (
                  <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                ) : (
                  <Plus weight="bold" />
                )}
              </button>
            );
          }

          return (
            <div key={index} className={segmentClasses}>
              {isFilled ? (
                <Person weight="fill" size={16} className="hidden md:block text-white" />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium text-gray-700">{`${displayAmount}/${displayMax}`}</span>
        {status ? (
          <span
            className={clsx(
              "flex items-center gap-1 text-xs",
              status.type === "success"
                ? "text-emerald-600"
                : status.type === "error"
                  ? "text-red-600"
                  : "text-gray-600"
            )}
          >
            {status.type === "success" ? (
              <CheckCircle className="h-4 w-4" weight="bold" />
            ) : status.type === "error" ? (
              <WarningCircle className="h-4 w-4" weight="bold" />
            ) : (
              <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
            )}
            {status.message}
          </span>
        ) : null}
      </div>
    </div>
  );
}
