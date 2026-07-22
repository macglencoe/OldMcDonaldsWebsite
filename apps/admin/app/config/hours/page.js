import { getConfig } from "@/lib/configs";
import WeeklyHoursPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function WeeklyHoursPage() {
    const weeklyHours = await getConfig("weekly-hours");
    const parsed = typeof weeklyHours === "string" ? JSON.parse(weeklyHours) : weeklyHours;
    return <WeeklyHoursPageClient weeklyHours={parsed} />;
}
