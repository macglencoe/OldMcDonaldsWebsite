import Link from "next/link";

const inputClass = "mt-1 block rounded-lg border border-foreground/30 bg-background px-3 py-2";

export default function BookingFilters({ filters, type }) {
  const basePath = `/bookings/${type}`;
  return (
    <form className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-foreground/20 p-4">
      <label className="font-semibold">
        Customer or ID
        <input
          className={`${inputClass} w-64`}
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
      <button className="rounded-lg bg-accent px-4 py-2 font-semibold text-white">Apply filters</button>
      <Link className="px-2 py-2 underline" href={basePath}>Clear</Link>
    </form>
  );
}
