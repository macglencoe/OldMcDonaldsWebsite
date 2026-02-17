import { getConfig } from "@/lib/configs";
import CalendarPageClient from "./page-client";

export default async function() {
    const calendar = await getConfig('calendar_schedule');
    const parsed = typeof calendar === 'string' ? JSON.parse(calendar) : calendar;
    return (
        <CalendarPageClient calendarConfig={parsed} />
    )
}