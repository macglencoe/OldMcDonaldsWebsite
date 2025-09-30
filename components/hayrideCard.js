"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Fillbar from "./fillbar";

const TEXT_COLOR_CLASSES = {
  amber: "text-amber-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  green: "text-green-600",
  indigo: "text-indigo-600",
  lime: "text-lime-600",
  orange: "text-orange-600",
  pink: "text-pink-600",
  purple: "text-purple-600",
  red: "text-red-600",
  rose: "text-rose-600",
  sky: "text-sky-600",
  teal: "text-teal-600",
  violet: "text-violet-600",
  yellow: "text-yellow-600",
};

export default function HayrideCard({
  color,
  capacity,
  filled,
  fill,
  version,
  slotStart,
  wagonId,
  onFilledChange,
  isEditable = true,
}) {
  const normalizedColor = String(color).toLowerCase();
  const headingColor = TEXT_COLOR_CLASSES[normalizedColor] ?? "text-foreground";
  const initialFilled = useMemo(() => {
    const value = filled ?? fill ?? 0;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.max(0, Math.round(numericValue)) : 0;
  }, [filled, fill]);

  const safeCapacity = useMemo(() => {
    const numericCapacity = Number(capacity);
    if (!Number.isFinite(numericCapacity)) {
      return undefined;
    }

    return Math.max(0, Math.round(numericCapacity));
  }, [capacity]);

  const initialVersion = useMemo(() => {
    const numericVersion = Number(version);
    return Number.isFinite(numericVersion) && numericVersion > 0
      ? Math.round(numericVersion)
      : 1;
  }, [version]);

  const [currentFilled, setCurrentFilled] = useState(initialFilled);
  const [currentVersion, setCurrentVersion] = useState(initialVersion);

  useEffect(() => {
    setCurrentFilled(initialFilled);
  }, [initialFilled]);

  useEffect(() => {
    setCurrentVersion(initialVersion);
  }, [initialVersion]);

  const handleFilledChange = (nextValue, details) => {
    if (!Number.isFinite(nextValue)) {
      return;
    }

    const clampedValue = Math.max(0, Math.min(nextValue, safeCapacity ?? nextValue));
    setCurrentFilled(clampedValue);

    const numericVersion = Number(details?.version);
    const resolvedVersion = Number.isFinite(numericVersion)
      ? Math.max(1, Math.round(numericVersion))
      : currentVersion;

    if (resolvedVersion !== currentVersion) {
      setCurrentVersion(resolvedVersion);
    }

    if (typeof onFilledChange === "function") {
      onFilledChange({
        filled: clampedValue,
        version: resolvedVersion,
        slotStart,
        wagonId,
        meta: details?.meta ?? null,
        wagon: details?.wagon ?? null,
      });
    }
  };

  const effectiveMax = safeCapacity ?? Math.max(currentFilled, 1);

  return (
    <div className="shadow-lg p-3 rounded-2xl">
      <h2 className={clsx(headingColor, "text-xl font-bold")}>
        {String(color).toUpperCase()}
      </h2>
      <Fillbar
        color={normalizedColor}
        max={effectiveMax}
        amount={currentFilled}
        isEditable={isEditable}
        slotStart={slotStart}
        wagonId={wagonId}
        version={currentVersion}
        onChange={handleFilledChange}
      />
    </div>
  );
}
