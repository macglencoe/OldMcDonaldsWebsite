"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HayrideCard from "./hayrideCard";
import { Clock } from "phosphor-react";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function getSlotLabel(label, start) {
  if (label) {
    return label;
  }

  if (!start) {
    return "Scheduled";
  }

  try {
    return timeFormatter.format(new Date(start));
  } catch (error) {
    return "Scheduled";
  }
}

export default function Timeline({
  slots = [],
  isEditable = false,
  onWagonFilledChange,
  date,
}) {
  const [activeAnchor, setActiveAnchor] = useState(null);
  const nowAnchorRef = useRef(null);

  const sortedSlots = useMemo(() => {
    return [...slots]
      .filter(Boolean)
      .sort((a, b) => new Date(a?.start ?? 0) - new Date(b?.start ?? 0));
  }, [slots]);

  const timelineItems = useMemo(() => {
    return sortedSlots.map((slot, slotIndex) => {
      const wagons = Array.isArray(slot?.wagons) ? slot.wagons : [];
      const slotKey = slot?.start ?? slot?.label ?? `slot-${slotIndex}`;
      const label = getSlotLabel(slot?.label, slot?.start);
      const baseId = (slot?.start ?? label ?? `slot-${slotIndex}`)
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const anchorId = `slot-${baseId}-${slotIndex}`;

      return {
        slot,
        slotIndex,
        wagons,
        slotKey,
        label,
        anchorId,
      };
    });
  }, [sortedSlots]);

  useEffect(() => {
    if (!activeAnchor && timelineItems.length) {
      setActiveAnchor(timelineItems[0].anchorId);
    }
  }, [timelineItems, activeAnchor]);

  useEffect(() => {
    if (!timelineItems.length) {
      nowAnchorRef.current = null;
      return;
    }

    const systemNow = new Date();
    const timePortion = `${systemNow.getHours().toString().padStart(2, "0")}:${
      systemNow.getMinutes().toString().padStart(2, "0")
    }:${systemNow.getSeconds().toString().padStart(2, "0")}`;
    const now = date ? new Date(`${date}T${timePortion}`) : systemNow;
    const target = timelineItems.reduce(
      (closest, item) => {
        const startValue = item.slot?.start;
        if (!startValue) {
          return closest;
        }
        const slotDate = new Date(startValue);
        if (Number.isNaN(slotDate.getTime())) {
          return closest;
        }
        const diff = Math.abs(slotDate.getTime() - now.getTime());
        if (!closest || diff < closest.diff) {
          return { anchorId: item.anchorId, diff };
        }
        return closest;
      },
      null
    );

    nowAnchorRef.current = target ? target.anchorId : timelineItems[0].anchorId;
  }, [timelineItems, date]);

  useEffect(() => {
    if (!timelineItems.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveAnchor(visible[0].target.id);
        } else {
          const first = entries.sort((a, b) => entryTop(a) - entryTop(b))[0];
          if (first) {
            setActiveAnchor(first.target.id);
          }
        }
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    function entryTop(entry) {
      return entry.target.getBoundingClientRect().top;
    }

    timelineItems.forEach(({ anchorId }) => {
      const element = document.getElementById(anchorId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [timelineItems]);

  const handleScrollToNow = () => {
    const targetId = nowAnchorRef.current;
    if (!targetId) {
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <nav className="-mx-6 overflow-x-auto px-6 md:mx-0 md:w-40 md:overflow-visible">
        <div className="sticky top-20 flex flex-col items-stretch gap-3 bg-background">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Jump to time</h4>
          <button
            type="button"
            onClick={handleScrollToNow}
            className="rounded-full border border-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-background focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Now
          </button>
          <div className="flex overflow-x-auto pb-1 items-center md:flex-col md:overflow-visible">
            {timelineItems.map(({ anchorId, label }) => {
              const isActive = anchorId === activeAnchor;
              return (
                <div key={anchorId} className="relative">
                  <div
                    className={`hidden md:block absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-colors ${isActive ? "bg-accent" : "bg-accent/30"}`}
                  />
                <a
                  href={`#${anchorId}`}
                  className={`whitespace-nowrap border-l px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent md:w-full md:text-left ${
                    isActive
                      ? "border-accent bg-accent text-background"
                      : "border-accent text-accent hover:bg-accent hover:text-background"
                  }`}
                >
                  {label}
                </a>
              </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="flex-1">
        {timelineItems.map(({ slot, slotKey, wagons, label, anchorId }) => (
          <section id={anchorId} key={slotKey} className="scroll-mt-28">
            <header className="relative flex h-6 flex-row items-center gap-3 text-4xl">
              <Clock className="absolute -left-4 text-accent" weight="bold" />
              <h3 className="absolute left-6 text-lg font-semibold text-gray-800">
                {label}
              </h3>
            </header>

            {wagons.length ? (
              <div className="border-l-2 border-accent py-4 pl-2">
                <div className="flex flex-col">
                  {wagons.map((wagon, index) => {
                    const wagonKey = wagon?.id ?? `${slotKey}-wagon-${index}`;
                    const handleFilledChange =
                      typeof onWagonFilledChange === "function"
                        ? (update) => {
                            const payload =
                              update && typeof update === "object"
                                ? update
                                : { filled: update };

                            onWagonFilledChange({
                              ...payload,
                              slotStart: slot?.start ?? payload?.slotStart ?? null,
                              slotLabel: slot?.label ?? null,
                              wagonId: wagon?.id ?? payload?.wagonId ?? null,
                              date: payload?.date ?? date ?? null,
                            });
                          }
                        : undefined;

                    return (
                      <HayrideCard
                        key={wagonKey}
                        color={wagon?.color}
                        capacity={wagon?.capacity}
                        filled={wagon?.filled}
                        fill={wagon?.fill}
                        version={wagon?.version}
                        slotStart={slot?.start ?? null}
                        wagonId={wagon?.id ?? null}
                        date={date}
                        isEditable={isEditable}
                        onFilledChange={isEditable ? handleFilledChange : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No wagons scheduled for this time.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
