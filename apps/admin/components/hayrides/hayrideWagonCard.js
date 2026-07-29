"use client";

import HayrideFillBar from "./hayrideFillBar";

const COLOR_STYLES = {
  blue: "border-blue-500 bg-blue-50 text-blue-700",
  green: "border-green-500 bg-green-50 text-green-700",
  red: "border-red-500 bg-red-50 text-red-700",
  white: "border-slate-400 bg-white text-slate-800",
};

export default function HayrideWagonCard({
  wagon,
  slotStart,
  date,
  isEditable,
  onChange,
}) {
  const color = String(wagon.color ?? "").toLowerCase();
  return (
    <article className={`rounded-xl border-l-4 p-4 shadow-sm ${COLOR_STYLES[color] ?? "border-slate-500 bg-slate-50 text-slate-800"}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold">{wagon.label ?? `${color || "Unknown"} Wagon`}</h3>
          {wagon.notes ? <p className="text-xs opacity-70">{wagon.notes}</p> : null}
        </div>
        <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-bold uppercase tracking-wide">
          Capacity {wagon.capacity}
        </span>
      </div>
      <HayrideFillBar
        wagon={wagon}
        slotStart={slotStart}
        date={date}
        isEditable={isEditable}
        onChange={onChange}
      />
    </article>
  );
}

