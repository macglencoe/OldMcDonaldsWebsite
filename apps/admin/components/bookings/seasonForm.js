"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiFloppyDiskBold, PiPlusCircleBold } from "react-icons/pi";

const inputClass = "mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function SeasonForm({ season = null }) {
  const router = useRouter();
  const isEditing = Boolean(season);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch(
      isEditing ? `/api/bookings/gazebo-seasons/${season.id}` : "/api/bookings/gazebo-seasons",
      {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "The season could not be created.");
      setPending(false);
      return;
    }
    router.push("/bookings/gazebo");
    router.refresh();
  }

  return (
    <form className="grid max-w-3xl gap-4 rounded-xl border border-foreground/20 bg-white p-5 shadow-sm sm:grid-cols-2" onSubmit={submit}>
      <label className="font-semibold sm:col-span-2">
        Season name
        <input className={inputClass} defaultValue={season?.season_name ?? ""} name="seasonName" placeholder="2027 Fall Season" required />
      </label>
      <label className="font-semibold">Start date<input className={inputClass} defaultValue={season?.start_date ?? ""} name="startDate" required type="date" /></label>
      <label className="font-semibold">End date<input className={inputClass} defaultValue={season?.end_date ?? ""} name="endDate" required type="date" /></label>
      <label className="font-semibold">Early start<input className={inputClass} defaultValue={season?.early_start_time ?? "13:00"} name="earlyStartTime" required type="time" /></label>
      <label className="font-semibold">Early end<input className={inputClass} defaultValue={season?.early_end_time ?? "15:00"} name="earlyEndTime" required type="time" /></label>
      <label className="font-semibold">Late start<input className={inputClass} defaultValue={season?.late_start_time ?? "16:00"} name="lateStartTime" required type="time" /></label>
      <label className="font-semibold">Late end<input className={inputClass} defaultValue={season?.late_end_time ?? "18:00"} name="lateEndTime" required type="time" /></label>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 font-semibold text-red-800 sm:col-span-2" role="alert">{error}</p>}
      <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" disabled={pending} type="submit">
        {isEditing ? <PiFloppyDiskBold aria-hidden="true" /> : <PiPlusCircleBold aria-hidden="true" />}
        {pending ? (isEditing ? "Saving changes…" : "Creating season…") : (isEditing ? "Save changes" : "Create season")}
      </button>
    </form>
  );
}
