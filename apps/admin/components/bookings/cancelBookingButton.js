"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        className="rounded border border-red-700 px-3 py-1.5 text-sm font-semibold text-red-800 disabled:opacity-50"
        disabled={state.pending}
        onClick={cancel}
        type="button"
      >
        {state.pending ? "Cancelling…" : "Cancel booking"}
      </button>
      {state.error && <p className="mt-1 max-w-xs text-sm text-red-700">{state.error}</p>}
    </div>
  );
}
