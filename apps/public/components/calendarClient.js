"use client";

import { useConfig } from "@/app/ConfigsContext";
import useSiteSettings from "@/hooks/useSiteSettings";
import { FestivalCalendar } from "@oldmc/public-ui";
import { formatBusinessAddress } from "@oldmc/config/site-settings";

export default function Calendar() {
    const scheduleConfig = useConfig("calendar_schedule", "schedule")
    const initialDateConfig = useConfig("calendar_schedule", "initialDate")
    const settings = useSiteSettings()

    return (
        <FestivalCalendar
            scheduleConfig={scheduleConfig}
            initialDateConfig={initialDateConfig}
            location={`${settings.business.name}, ${formatBusinessAddress(settings, { oneLine: true })}`}
            bgSrc="/tractorForge.jpg"
        />
    )
}
