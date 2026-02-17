import { getConfig } from "@/lib/configs";
import AnnouncementsPageClient from "./page-client";

export default async function () {
    const announcements = await getConfig('announcements');
    const parsed = typeof announcements === 'string' ? JSON.parse(announcements) : announcements;
    // TODO: schema validation
    return (
        <AnnouncementsPageClient announcements={parsed.items} />
    )
}