import Link from "next/link";
import { notFound } from "next/navigation";

import SeasonForm from "@/components/bookings/seasonForm";
import { BookingError, getGazeboSeason } from "@/lib/bookings.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Gazebo Season | OMPP Admin" };

export default async function EditGazeboSeasonPage({ params }) {
  const { id } = await params;
  let season;
  try {
    season = await getGazeboSeason(id);
  } catch (error) {
    if (error instanceof BookingError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="inline-block font-semibold text-foreground/70 underline underline-offset-4 hover:text-foreground" href="/bookings/gazebo/seasons">← Gazebo season settings</Link>
      <h1 className="mt-4 text-3xl font-bold">Edit {season.season_name}</h1>
      <p className="mb-8 mt-2 max-w-3xl text-foreground/70">
        Changes set the defaults for future bookings. Existing bookings retain the slot times captured when they were created.
      </p>
      <SeasonForm season={season} />
    </main>
  );
}
