import { getConfig } from "@/lib/configs";
import WeeklyHoursPageClient from "./page-client";

export default async function WeeklyHoursPage() {
    const weeklyHours = await getConfig("weekly-hours");
    const parsed = typeof weeklyHours === "string" ? JSON.parse(weeklyHours) : weeklyHours;
    return <WeeklyHoursPageClient weeklyHours={parsed} />;
}
