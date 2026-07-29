"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PiCheckCircleFill,
  PiMinusBold,
  PiPersonFill,
  PiPlusBold,
  PiSpinnerGapBold,
  PiWarningCircleFill,
} from "react-icons/pi";

const FILL_STYLES = {
  blue: "bg-blue-600 text-white",
  green: "bg-green-600 text-white",
  red: "bg-red-600 text-white",
  white: "bg-slate-300 text-slate-900",
};

export default function HayrideFillBar({
  wagon,
  slotStart,
  date,
  isEditable,
  onChange,
}) {
  const [version, setVersion] = useState(Number(wagon.version) || 1);
  const [saving, setSaving] = useState(false);
  const [pendingDirection, setPendingDirection] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => setVersion(Number(wagon.version) || 1), [wagon.version, slotStart]);
  useEffect(() => {
    if (status?.type !== "success") return undefined;
    const timer = setTimeout(() => setStatus(null), 2_000);
    return () => clearTimeout(timer);
  }, [status]);

  const capacity = Math.max(0, Math.round(Number(wagon.capacity) || 0));
  const filled = Math.min(capacity, Math.max(0, Math.round(Number(wagon.filled) || 0)));
  const fillStyle = FILL_STYLES[String(wagon.color).toLowerCase()] ?? "bg-slate-600 text-white";

  const segments = useMemo(() => Array.from({ length: Math.max(capacity, 1) }), [capacity]);

  async function update(delta) {
    if (!isEditable || saving || (delta > 0 && filled >= capacity) || (delta < 0 && filled <= 0)) return;
    setSaving(true);
    setPendingDirection(Math.sign(delta));
    setStatus({ type: "saving", message: "Saving…" });

    try {
      const response = await fetch("/api/hayrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slotStart,
          wagonId: wagon.id,
          delta,
          expectedVersion: version,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.message ?? `Request failed with ${response.status}`);

      const updatedWagon = payload?.data?.wagon;
      setVersion(Number(updatedWagon?.version) || version);
      setStatus({ type: "success", message: "Saved" });
      onChange?.({
        slotStart,
        wagonId: wagon.id,
        wagon: updatedWagon,
        updateMeta: payload?.meta,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save.",
      });
    } finally {
      setSaving(false);
      setPendingDirection(0);
    }
  }

  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-lg border border-black/15 bg-white">
        {segments.map((_, index) => {
          const isFilled = index < filled;
          const removeControl = isEditable && isFilled && index === filled - 1;
          const addControl = isEditable && !isFilled && index === filled;
          const className = `flex h-9 min-w-0 flex-1 items-center justify-center border-l border-black/10 first:border-l-0 ${
            isFilled ? fillStyle : "bg-white text-slate-400"
          }`;

          if (removeControl) {
            return (
              <button
                key={index}
                type="button"
                className={className}
                disabled={saving}
                onClick={() => update(-1)}
                aria-label={`Remove one rider from ${wagon.label}`}
              >
                {saving && pendingDirection < 0
                  ? <PiSpinnerGapBold className="animate-spin" />
                  : <PiMinusBold />}
              </button>
            );
          }
          if (addControl) {
            return (
              <button
                key={index}
                type="button"
                className={`${className} hover:bg-slate-100`}
                disabled={saving}
                onClick={() => update(1)}
                aria-label={`Add one rider to ${wagon.label}`}
              >
                {saving && pendingDirection > 0
                  ? <PiSpinnerGapBold className="animate-spin" />
                  : <PiPlusBold />}
              </button>
            );
          }
          return (
            <span key={index} className={className} aria-hidden="true">
              {isFilled && capacity <= 20 ? <PiPersonFill className="hidden xl:block" /> : null}
            </span>
          );
        })}
      </div>

      <div className="mt-2 flex min-h-6 items-start justify-between gap-3">
        <span className="text-lg font-extrabold">{filled}/{capacity}</span>
        {status ? (
          <span className={`flex max-w-64 items-center gap-1 text-right text-xs font-semibold ${
            status.type === "error" ? "text-red-700" : status.type === "success" ? "text-emerald-700" : "text-slate-600"
          }`}>
            {status.type === "error"
              ? <PiWarningCircleFill className="shrink-0" />
              : status.type === "success"
                ? <PiCheckCircleFill className="shrink-0" />
                : <PiSpinnerGapBold className="shrink-0 animate-spin" />}
            {status.message}
          </span>
        ) : null}
      </div>
    </div>
  );
}

