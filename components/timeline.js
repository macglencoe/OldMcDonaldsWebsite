"use client";

import { useMemo } from "react";
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
  const sortedSlots = useMemo(() => {
    return [...slots]
      .filter(Boolean)
      .sort((a, b) => new Date(a?.start ?? 0) - new Date(b?.start ?? 0));
  }, [slots]);

  return (
    <div className="flex flex-col">
      {sortedSlots.map((slot, slotIndex) => {
        const wagons = Array.isArray(slot?.wagons) ? slot.wagons : [];
        const slotKey = slot?.start ?? slot?.label ?? `slot-${slotIndex}`;

        return (
          <section key={slotKey}>
            <header className="flex flex-row items-center h-6 gap-3 text-4xl relative">
              <Clock className="absolute text-accent -left-4" weight="bold" />
              <h3 className="absolute left-6 text-lg font-semibold text-gray-800">
                {getSlotLabel(slot?.label, slot?.start)}
              </h3>
            </header>

            {wagons.length ? (
              <div className="py-4  border-l-2 border-accent pl-2">
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
        );
      })}
    </div>
  );
}
