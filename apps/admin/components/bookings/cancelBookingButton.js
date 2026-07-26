"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiXCircleBold } from "react-icons/pi";

export default function CancelBookingButton({ bookingId, type }) {
  const router = useRouter();
  const [state, setState] = useState({ pending: false, error: "" });

  async function cancel() {
    if (!window.confirm("Cancel this booking? Its record will remain in the booking history.")) return;
    setState({ pending: true, error: "" });
    try {
      const response = await fetch(`/api/bookings/${type}/${bookingId}/cancel`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The booking could not be cancelled.");
      router.refresh();
    } catch (error) {
      setState({ pending: false, error: error.message });
    }
  }

  return (
    <div className="text-right">
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={state.pending}
        onClick={cancel}
        type="button"
      >
        <PiXCircleBold aria-hidden="true" />
        {state.pending ? "Cancelling…" : "Cancel booking"}
      </button>
      {state.error && <p className="mt-2 max-w-xs text-sm font-medium text-red-700" role="alert">{state.error}</p>}
    </div>
  );
}
