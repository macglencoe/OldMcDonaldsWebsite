import Link from "next/link";

export const metadata = { title: "Bookings | OMPP Admin" };

export default function BookingsPage() {
  return (
    <main className="px-4 py-8 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Staff tools</p>
      <h1 className="text-3xl font-bold">Bookings</h1>
      <p className="mt-2 text-foreground/70">Choose the booking calendar for your shift.</p>
      <div className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
        <Link className="rounded-xl border border-foreground/20 p-6 shadow-sm transition hover:border-accent" href="/bookings/gazebo">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Day staff</p>
          <h2 className="mt-1 text-2xl font-bold">Gazebo bookings</h2>
          <p className="mt-2 text-foreground/70">Manage the gazebo’s early and late rental slots.</p>
        </Link>
        <Link className="rounded-xl border border-foreground/20 p-6 shadow-sm transition hover:border-accent" href="/bookings/campfires">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Night staff</p>
          <h2 className="mt-1 text-2xl font-bold">Campfire bookings</h2>
          <p className="mt-2 text-foreground/70">Track individual campfire reservations by Night Maze date.</p>
        </Link>
      </div>
    </main>
  );
}
