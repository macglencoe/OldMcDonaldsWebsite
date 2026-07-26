import Link from "next/link";
import { PiArrowLeftBold, PiPencilBold } from "react-icons/pi";

import SeasonForm from "@/components/bookings/seasonForm";
import { getGazeboSeasons } from "@/lib/bookings.mjs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gazebo Seasons | OMPP Admin" };

export default async function GazeboSeasonsPage() {
  const seasons = await getGazeboSeasons();
  return (
    <main className="px-4 py-8 sm:px-8">
      <Link className="inline-flex items-center gap-2 font-semibold text-foreground/70 underline underline-offset-4 hover:text-foreground" href="/bookings/gazebo">
        <PiArrowLeftBold aria-hidden="true" /> Gazebo bookings
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Gazebo season settings</h1>
      <p className="mb-8 mt-2 text-foreground/70">Slot times are copied onto each booking when it is created.</p>
      <SeasonForm />
      <section className="mt-10 max-w-3xl">
        <h2 className="mb-3 text-2xl font-bold">Configured seasons</h2>
        <div className="space-y-3">
          {seasons.map((season) => (
            <article className="rounded-xl border border-foreground/20 bg-white p-5 shadow-sm" key={season.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{season.season_name}</h3>
                  <p className="text-sm text-foreground/70">{season.start_date} through {season.end_date}</p>
                  <p className="mt-2 font-medium">Early: {season.early_start_time}–{season.early_end_time} · Late: {season.late_start_time}–{season.late_end_time}</p>
                </div>
                <Link className="inline-flex items-center gap-2 rounded-lg border border-foreground px-3 py-2 font-semibold transition hover:bg-foreground hover:text-white" href={`/bookings/gazebo/seasons/${season.id}`}>
                  <PiPencilBold aria-hidden="true" /> Edit season
                </Link>
              </div>
            </article>
          ))}
          {!seasons.length && <p className="rounded-xl border border-dashed border-foreground/30 p-8 text-center text-foreground/70">No gazebo seasons configured.</p>}
        </div>
      </section>
    </main>
  );
}
