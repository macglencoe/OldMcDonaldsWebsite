"use client";

import { useConfig } from "@/app/ConfigsContext";
import { FestivalCalendar } from "@oldmc/public-ui";

export default function Calendar() {
    const scheduleConfig = useConfig("calendar_schedule", "schedule")
    const initialDateConfig = useConfig("calendar_schedule", "initialDate")

    return (
        <FestivalCalendar
            scheduleConfig={scheduleConfig}
            initialDateConfig={initialDateConfig}
            bgSrc="/tractorForge.jpg"
        />
    )
}