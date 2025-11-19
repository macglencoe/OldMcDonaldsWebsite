"use client"

import { useConfig } from "@/app/ConfigsContext";

const HOURS_DAY_KEYS = ["friday", "saturday", "sunday"];
const FALLBACK_HOURS = [
    { day: "FRI", opens: "1:00 PM", closes: "6:00 PM" },
    { day: "SAT", opens: "10:00 AM", closes: "6:00 PM" },
    { day: "SUN", opens: "12:00 PM", closes: "6:00 PM" },
];

function buildHoursRows(schedule) {
    if (!schedule || typeof schedule !== "object") {
        return FALLBACK_HOURS;
    }

    const rows = HOURS_DAY_KEYS.reduce((acc, dayKey) => {
        const data = schedule?.[dayKey];
        if (!data || typeof data !== "object") return acc;

        const opens = formatTimeToEnUs(data.open);
        const closes = formatTimeToEnUs(data.close);

        if (!opens || !closes) return acc;

        acc.push({
            day: dayKey.slice(0, 3).toUpperCase(),
            opens,
            closes,
        });

        return acc;
    }, []);

    return rows.length ? rows : FALLBACK_HOURS;
}

function formatTimeToEnUs(timeString) {
    if (typeof timeString !== "string") return null;

    const [hourPart, minutePart] = timeString.trim().split(":");
    if (hourPart === undefined || minutePart === undefined) return null;

    const hours = Number(hourPart);
    const minutes = Number(minutePart);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

    const normalizedHours = ((hours % 24) + 24) % 24;
    const period = normalizedHours >= 12 ? "PM" : "AM";
    const displayHour = normalizedHours % 12 || 12;
    const displayMinutes = String(minutes).padStart(2, "0");

    return `${displayHour}:${displayMinutes} ${period}`;
}

export default function Hours() {
    const weeklyHoursConfig = useConfig("weekly-hours");
    const weeklyHours = weeklyHoursConfig?.raw;
    const hoursRows = buildHoursRows(weeklyHours);

    return (
        <div className="p-2">
            <table className="table-auto text-center border-separate border-spacing-y-3 -mt-3">
                    <thead className="text-background">
                        <tr>
                            <th></th>
                            <th>Open</th>
                            <th>Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hoursRows.map(({ day, opens, closes }) => (
                            <HoursRow key={day} day={day} opens={opens} closes={closes} />
                        ))}
                    </tbody>
                </table>
        </div>
    )
}

function HoursRow({ day, opens, closes }) {
    return (
        <tr className="text-center my-2">
            <td className="pr-4 text-background font-bold" style={{
                fontFamily: "var(--font-geist-mono)"
            }}>{day}</td>
            <td className="bg-background/70 text-foreground py-0.5 px-3 rounded-l-lg">{opens}</td>
            <td className="bg-foreground text-background py-0.5 px-3 rounded-r-lg">{closes}</td>
        </tr>
    )
}