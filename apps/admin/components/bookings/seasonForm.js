"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = "mt-1 block w-full rounded-lg border border-foreground/30 bg-background px-3 py-2";

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
    <form className="grid max-w-3xl gap-4 rounded-xl border border-foreground/20 p-5 sm:grid-cols-2" onSubmit={submit}>
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
      {error && <p className="rounded-lg bg-red-100 p-3 font-semibold text-red-800 sm:col-span-2">{error}</p>}
      <button className="w-fit rounded-lg bg-accent px-5 py-3 font-bold text-white disabled:opacity-50" disabled={pending} type="submit">
        {pending ? (isEditing ? "Saving changes…" : "Creating season…") : (isEditing ? "Save changes" : "Create season")}
      </button>
    </form>
  );
}
