import Link from "next/link";
import { PiArrowRightBold, PiCalendarCheckDuotone, PiCampfireDuotone } from "react-icons/pi";

export const metadata = { title: "Bookings | OMPP Admin" };

export default function BookingsPage() {
  return (
    <main className="px-4 py-8 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Staff tools</p>
      <h1 className="text-3xl font-bold">Bookings</h1>
      <p className="mt-2 text-foreground/70">Choose the booking calendar for your shift.</p>
      <div className="mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
        <Link className="group rounded-xl border border-foreground/20 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md" href="/bookings/gazebo">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <PiCalendarCheckDuotone aria-hidden="true" size={26} />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Day staff</p>
          <h2 className="mt-1 text-2xl font-bold">Gazebo bookings</h2>
          <p className="mt-2 text-foreground/70">Manage early and late rental slots for Gazebos A and B.</p>
          <p className="mt-5 flex items-center gap-2 font-semibold text-accent group-hover:underline">
            Open gazebo calendar <PiArrowRightBold aria-hidden="true" />
          </p>
        </Link>
        <Link className="group rounded-xl border border-foreground/20 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md" href="/bookings/campfires">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <PiCampfireDuotone aria-hidden="true" size={27} />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Night staff</p>
          <h2 className="mt-1 text-2xl font-bold">Campfire bookings</h2>
          <p className="mt-2 text-foreground/70">Track individual campfire reservations by Night Maze date.</p>
          <p className="mt-5 flex items-center gap-2 font-semibold text-accent group-hover:underline">
            Open campfire calendar <PiArrowRightBold aria-hidden="true" />
          </p>
        </Link>
      </div>
    </main>
  );
}
