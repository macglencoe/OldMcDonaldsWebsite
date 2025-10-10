const FRIDAY_TIMES = [
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

const SATURDAY_TIMES = [
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

const SUNDAY_TIMES = [
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const MONDAY_TIMES = [
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]

function toLabel(date, time) {
  try {
    const [hours, minutes] = time.split(":");
    const dt = new Date(`${date}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(dt);
  } catch (error) {
    return time;
  }
}

function toIso(date, time) {
  const [hours, minutes] = time.split(":");
  const h = hours.padStart(2, "0");
  const m = minutes.padStart(2, "0");
  return `${date}T${h}:${m}:00`;
}

/**
 * Returns ordered slot definitions for a particular date.
 * @param {string} dateISO Date string in YYYY-MM-DD format.
 * @returns {Array<{ start: string, label: string }>} Slots for that day.
 */
export function getSlotsForDate(dateISO) {
  if (!dateISO) {
    return [];
  }

  const date = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return [];
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);

  let times;
  switch (weekday.toLowerCase()) {
    case "friday":
      times = FRIDAY_TIMES;
      break;
    case "saturday":
      times = SATURDAY_TIMES;
      break;
    case "sunday":
      times = SUNDAY_TIMES;
      break;
    case "monday":
      times = MONDAY_TIMES;
      break;
    default:
      times = [];
      break;
  }

  return times.map((time) => ({
    start: toIso(dateISO, time),
    label: toLabel(dateISO, time),
  }));
}

export const SLOT_TEMPLATES = {
  friday: FRIDAY_TIMES,
  saturday: SATURDAY_TIMES,
  sunday: SUNDAY_TIMES,
  monday: MONDAY_TIMES
};
