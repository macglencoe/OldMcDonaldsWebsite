"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiCheckCircleBold, PiFloppyDiskBold, PiPlusCircleBold } from "react-icons/pi";

const inputClass = "mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const fieldsetClass = "grid gap-4 rounded-xl border border-foreground/20 bg-white p-5 shadow-sm sm:grid-cols-2";

export default function BookingForm({ type, request = null, booking = null, returnTo = null }) {
  const router = useRouter();
  const isConversion = type === "gazebo" && Boolean(request);
  const isEditing = Boolean(booking);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form);
    body.partySize = body.partySize || null;
    if (isConversion) body.reservationRequestId = request.id;

    const endpoint = isConversion
      ? "/api/bookings/gazebo/from-request"
      : isEditing
        ? `/api/bookings/${type}/${booking.id}`
        : `/api/bookings/${type}`;
    try {
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The booking could not be created.");
      router.push(returnTo || `/bookings/${type}`);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError.message);
      setPending(false);
    }
  }

  return (
    <form className="max-w-3xl space-y-6" onSubmit={submit}>
      {!isConversion && (
        <fieldset className={fieldsetClass}>
          <legend className="px-2 text-xl font-bold">Customer details</legend>
          <label className="font-semibold">
            Name
            <input className={inputClass} defaultValue={booking?.customer_name ?? ""} maxLength={120} name="customerName" required />
          </label>
          <label className="font-semibold">
            Email
            <input className={inputClass} defaultValue={booking?.customer_email ?? ""} maxLength={254} name="customerEmail" required type="email" />
          </label>
          <label className="font-semibold">
            Phone
            <input className={inputClass} defaultValue={booking?.customer_phone ?? ""} maxLength={40} name="customerPhone" required type="tel" />
          </label>
          <label className="font-semibold">
            Party size <span className="font-normal text-foreground/60">(optional)</span>
            <input className={inputClass} defaultValue={booking?.party_size ?? ""} max={10000} min={1} name="partySize" type="number" />
          </label>
        </fieldset>
      )}

      <fieldset className={fieldsetClass}>
        <legend className="px-2 text-xl font-bold">Booking details</legend>
        <label className="font-semibold">
          Date
          <input
            className={inputClass}
            defaultValue={booking?.booking_date ?? request?.preferred_date ?? ""}
            name="bookingDate"
            required
            type="date"
          />
        </label>
        {type === "gazebo" && (
          <label className="font-semibold">
            Gazebo slot
            <select
              className={inputClass}
              defaultValue={booking?.time_slot ?? (request?.preferred_time_slot === "either" ? "" : request?.preferred_time_slot ?? "")}
              name="timeSlot"
              required
            >
              <option disabled value="">Choose a slot</option>
              <option value="early">Early</option>
              <option value="late">Late</option>
            </select>
          </label>
        )}
        <label className="font-semibold">
          Status
          <select className={inputClass} defaultValue={booking?.status ?? "confirmed"} name="status">
            <option value="confirmed">Confirmed</option>
            <option value="tentative">Tentative</option>
          </select>
        </label>
        {isConversion && (
          <label className="font-semibold">
            Party size <span className="font-normal text-foreground/60">(optional)</span>
            <input className={inputClass} max={10000} min={1} name="partySize" type="number" />
          </label>
        )}
        <label className="font-semibold sm:col-span-2">
          Internal notes <span className="font-normal text-foreground/60">(optional)</span>
          <textarea className={inputClass} defaultValue={booking?.internal_notes ?? ""} maxLength={2000} name="internalNotes" rows={4} />
        </label>
      </fieldset>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 font-semibold text-red-800" role="alert">{error}</p>}
      <button
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={pending}
        type="submit"
      >
        {isEditing
          ? <PiFloppyDiskBold aria-hidden="true" />
          : isConversion
            ? <PiCheckCircleBold aria-hidden="true" />
            : <PiPlusCircleBold aria-hidden="true" />}
        {pending
          ? isEditing ? "Saving changes…" : "Creating booking…"
          : isEditing ? "Save changes" : isConversion ? "Create booking from request" : "Create booking"}
      </button>
    </form>
  );
}
