import HayrideScheduleView from "@/components/hayrideScheduleView";
import { headers } from "next/headers";

async function fetchHayrideSchedule() {
  const headerStore = headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  const baseUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    return { data: null, error: "Missing base URL" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/hayrides`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { data: null, error: `Request failed with ${response.status}` };
    }

    const payload = await response.json();
    return { data: payload?.data ?? null, meta: payload?.meta ?? null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: message };
  }
}

export default async function Home() {
  const initial = await fetchHayrideSchedule();

  return <HayrideScheduleView initialData={initial.data} initialMeta={initial.meta} initialError={initial.error} />;
}
