import Link from "next/link";
import { PiFunnelBold, PiMagnifyingGlassBold } from "react-icons/pi";

const inputClass = "mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function BookingFilters({ filters, type }) {
  const basePath = `/bookings/${type}`;
  return (
    <form className="mt-6 grid gap-4 rounded-xl border border-foreground/20 bg-foreground/[0.02] p-4 sm:grid-cols-2 lg:grid-cols-6">
      <label className="font-semibold sm:col-span-2">
        <span className="flex items-center gap-1.5"><PiMagnifyingGlassBold aria-hidden="true" /> Customer or ID</span>
        <input
          className={inputClass}
          defaultValue={filters.search ?? ""}
          name="search"
          placeholder={type === "gazebo" ? "Name, email, phone, GZ-12, #381" : "Name, email, phone, CF-12"}
          type="search"
        />
      </label>
      <label className="font-semibold">
        From
        <input className={inputClass} defaultValue={filters.from ?? ""} name="from" type="date" />
      </label>
      <label className="font-semibold">
        To
        <input className={inputClass} defaultValue={filters.to ?? ""} name="to" type="date" />
      </label>
      <label className="font-semibold">
        Status
        <select className={inputClass} defaultValue={filters.status} name="status">
          <option value="active">Active</option>
          <option value="confirmed">Confirmed</option>
          <option value="tentative">Tentative</option>
          <option value="cancelled">Cancelled</option>
          <option value="all">All, including cancelled</option>
        </select>
      </label>
      {type === "gazebo" && (
        <label className="font-semibold">
          Slot
          <select className={inputClass} defaultValue={filters.slot} name="slot">
            <option value="all">Both slots</option>
            <option value="early">Early</option>
            <option value="late">Late</option>
          </select>
        </label>
      )}
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:opacity-90">
          <PiFunnelBold aria-hidden="true" /> Apply
        </button>
        <Link className="rounded-lg px-3 py-2 font-semibold underline underline-offset-4" href={basePath}>Clear</Link>
      </div>
    </form>
  );
}
