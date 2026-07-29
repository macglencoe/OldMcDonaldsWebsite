import assert from "node:assert/strict";
import test from "node:test";

import {
  getSlotsForDate,
  isValidHayrideDate,
  mergeHayrideSchedule,
  todayInHayrideTimeZone,
} from "./hayrideSchedule.mjs";

test("validates calendar dates rather than only their shape", () => {
  assert.equal(isValidHayrideDate("2026-10-03"), true);
  assert.equal(isValidHayrideDate("2026-02-30"), false);
  assert.equal(isValidHayrideDate("10/03/2026"), false);
});

test("builds the Saturday template through the 10 PM night-maze slot", () => {
  const slots = getSlotsForDate("2026-10-03");
  assert.equal(slots[0].start, "2026-10-03T11:30:00");
  assert.equal(slots.at(-1).start, "2026-10-03T22:00:00");
  assert.equal(slots.at(-1).label, "10:00 PM");
});

test("uses the farm's Eastern time zone when choosing the default date", () => {
  assert.equal(
    todayInHayrideTimeZone(new Date("2026-01-01T05:30:00.000Z")),
    "2026-01-01",
  );
});

test("merges persisted counts into the roster and preserves ad-hoc slots", () => {
  const slots = mergeHayrideSchedule(
    "2026-10-03",
    [
      { id: 10, start: "2026-10-03T11:30:00", label: null },
      { id: 11, start: "2026-10-03T10:00:00", label: "Early run" },
    ],
    [
      {
        slot_id: 10,
        wagon_id: "wagon-blue",
        color: "blue",
        capacity: 20,
        filled: 7,
        version: 3,
      },
    ],
  );

  assert.equal(slots[0].label, "Early run");
  const firstTemplate = slots.find((slot) => slot.start.endsWith("T11:30:00"));
  assert.equal(firstTemplate.wagons.length, 4);
  assert.equal(firstTemplate.wagons.find((wagon) => wagon.id === "wagon-blue").filled, 7);
  assert.equal(firstTemplate.wagons.find((wagon) => wagon.id === "wagon-green").filled, 0);
});
