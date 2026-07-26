import Link from "next/link";

import SeasonForm from "@/components/bookings/seasonForm";
import { getGazeboSeasons } from "@/lib/bookings.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gazebo Seasons | OMPP Admin" };

export default async function GazeboSeasonsPage() {
  const seasons = await getGazeboSeasons();
  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="underline" href="/bookings/gazebo">← Gazebo bookings</Link>
      <h1 className="mt-4 text-3xl font-bold">Gazebo season settings</h1>
      <p className="mb-8 mt-2 text-foreground/70">Slot times are copied onto each booking when it is created.</p>
      <SeasonForm />
      <section className="mt-10 max-w-3xl">
        <h2 className="mb-3 text-2xl font-bold">Configured seasons</h2>
        <div className="space-y-3">
          {seasons.map((season) => (
            <article className="rounded-xl border border-foreground/20 p-4" key={season.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{season.season_name}</h3>
                  <p>{season.start_date} through {season.end_date}</p>
                  <p>Early: {season.early_start_time}–{season.early_end_time} · Late: {season.late_start_time}–{season.late_end_time}</p>
                </div>
                <Link className="font-semibold underline" href={`/bookings/gazebo/seasons/${season.id}`}>Edit season</Link>
              </div>
            </article>
          ))}
          {!seasons.length && <p>No gazebo seasons configured.</p>}
        </div>
      </section>
    </main>
  );
}
