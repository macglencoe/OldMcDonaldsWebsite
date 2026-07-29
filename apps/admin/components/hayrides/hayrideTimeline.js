"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PiClockBold } from "react-icons/pi";

import HayrideWagonCard from "./hayrideWagonCard";
import HayrideWagonOrderEditor from "./hayrideWagonOrderEditor";

function anchorFor(slot, index) {
  return `hayride-${(slot.start ?? slot.label ?? index).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;
}

export default function HayrideTimeline({
  slots,
  date,
  isEditable,
  onWagonChange,
}) {
  const [activeAnchor, setActiveAnchor] = useState(null);
  const [wagonOrder, setWagonOrder] = useState([]);
  const observerRef = useRef(null);

  const availableWagons = useMemo(() => {
    const wagons = new Map();
    slots.forEach((slot) => slot.wagons?.forEach((wagon) => {
      if (!wagons.has(wagon.id)) wagons.set(wagon.id, wagon);
    }));
    return [...wagons.values()];
  }, [slots]);

  useEffect(() => {
    setWagonOrder((current) => {
      const incoming = new Map(availableWagons.map((wagon) => [wagon.id, wagon]));
      const next = current
        .filter((wagon) => incoming.has(wagon.id))
        .map((wagon) => incoming.get(wagon.id));
      const known = new Set(next.map((wagon) => wagon.id));
      availableWagons.forEach((wagon) => {
        if (!known.has(wagon.id)) next.push(wagon);
      });
      return next;
    });
  }, [availableWagons]);

  const orderMap = useMemo(
    () => new Map(wagonOrder.map((wagon, index) => [wagon.id, index])),
    [wagonOrder],
  );

  const items = useMemo(() => [...slots]
    .sort((left, right) => left.start.localeCompare(right.start))
    .map((slot, index) => ({
      ...slot,
      anchor: anchorFor(slot, index),
      wagons: [...(slot.wagons ?? [])].sort(
        (left, right) => (orderMap.get(left.id) ?? 999) - (orderMap.get(right.id) ?? 999),
      ),
    })), [orderMap, slots]);

  useEffect(() => {
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActiveAnchor(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    observerRef.current = observer;
    items.forEach((item) => {
      const element = document.getElementById(item.anchor);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [items]);

  const scrollTo = useCallback((anchor) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToNow = useCallback(() => {
    if (!items.length) return;
    const now = Date.now();
    const closest = items.reduce((best, item) => {
      const distance = Math.abs(new Date(item.start).getTime() - now);
      return !best || distance < best.distance ? { item, distance } : best;
    }, null);
    if (closest) scrollTo(closest.item.anchor);
  }, [items, scrollTo]);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center">
        <h2 className="text-xl font-bold">No hayride times scheduled</h2>
        <p className="mt-2 text-foreground/60">Choose a Friday, Saturday, Sunday, or Monday.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {isEditable && wagonOrder.length ? (
        <HayrideWagonOrderEditor wagons={wagonOrder} onOrderChange={setWagonOrder} />
      ) : null}

      <div className="flex flex-col gap-6 md:flex-row">
        <nav aria-label="Hayride times" className="md:w-40 md:shrink-0">
          <div className="sticky top-4 flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            <p className="hidden text-xs font-bold uppercase tracking-wider text-accent md:block">Jump to time</p>
            <button
              type="button"
              onClick={scrollToNow}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-bold text-background"
            >
              <PiClockBold />
              Now
            </button>
            {items.map((item) => (
              <button
                key={item.anchor}
                type="button"
                onClick={() => scrollTo(item.anchor)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  activeAnchor === item.anchor
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-foreground/15 bg-background hover:border-accent/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          {items.map((slot) => (
            <section
              id={slot.anchor}
              key={slot.anchor}
              className="scroll-mt-4 rounded-2xl border border-foreground/10 bg-background p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3 border-b border-foreground/10 pb-3">
                <span className="h-3 w-3 rounded-full bg-accent" />
                <h2 className="text-2xl font-bold">{slot.label}</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {slot.wagons.map((wagon) => (
                  <HayrideWagonCard
                    key={wagon.id}
                    wagon={wagon}
                    slotStart={slot.start}
                    date={date}
                    isEditable={isEditable}
                    onChange={onWagonChange}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

