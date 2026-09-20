import { getConfig } from "@/lib/configs";
import SiteSettingsPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  const settings = await getConfig("site-settings");
  const parsed = typeof settings === "string" ? JSON.parse(settings) : settings;
  return <SiteSettingsPageClient settings={parsed} />;
}
