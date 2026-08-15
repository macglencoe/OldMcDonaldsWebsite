'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { REQUEST_REVIEW_STATUS_LABELS } from '@/lib/reservationRequestsView.mjs';

export const REQUEST_STATUS_STYLES = {
  new: 'border-blue-200 bg-blue-50 text-blue-800',
  reviewing: 'border-amber-200 bg-amber-50 text-amber-800',
  resolved: 'border-green-200 bg-green-50 text-green-800',
  irrelevant: 'border-gray-300 bg-gray-100 text-gray-700',
  spam: 'border-red-200 bg-red-50 text-red-800',
};

export function RequestStatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${REQUEST_STATUS_STYLES[status]}`}>{REQUEST_REVIEW_STATUS_LABELS[status]}</span>;
}

export default function ReservationRequestReview({ request }) {
  const router = useRouter();
  const [status, setStatus] = useState(request.review_status);
  const [note, setNote] = useState(request.internal_note ?? '');
  const [state, setState] = useState({ pending: false, error: '', saved: false });

  useEffect(() => {
    setStatus(request.review_status);
    setNote(request.internal_note ?? '');
  }, [request.review_status, request.internal_note]);

  async function submit(event) {
    event.preventDefault();
    if (status === 'spam' && request.review_status !== 'spam'
      && !window.confirm(`Mark reservation request #${request.id} as spam? It can be restored later.`)) return;
    setState({ pending: true, error: '', saved: false });
    try {
      const response = await fetch('/api/reservation-requests/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request.id, status, note }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The review update could not be saved.');
      setState({ pending: false, error: '', saved: true });
      router.refresh();
    } catch (error) {
      setState({ pending: false, error: error.message, saved: false });
    }
  }

  return (
    <form className="mt-5 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-4" onSubmit={submit}>
      <div className="grid gap-3 lg:grid-cols-[minmax(10rem,14rem)_1fr_auto] lg:items-end">
        <label className="font-semibold">
          Review status
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" onChange={event => setStatus(event.target.value)} value={status}>
            {Object.entries(REQUEST_REVIEW_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="font-semibold">
          Internal note
          <input className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" maxLength={1000} onChange={event => setNote(event.target.value)} placeholder="For example: Campfire booking created" value={note} />
        </label>
        <button className="rounded-lg bg-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={state.pending} type="submit">
          {state.pending ? 'Saving…' : 'Save review'}
        </button>
      </div>
      {state.saved && <p className="mt-2 text-sm font-semibold text-green-700" role="status">Review updated.</p>}
      {state.error && <p className="mt-2 text-sm font-semibold text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}
