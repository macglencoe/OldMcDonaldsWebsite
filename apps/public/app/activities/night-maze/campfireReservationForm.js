"use client";

import { useState } from 'react';

const initialForm = { email: '', name: '', phone: '', preferredDate: '', fallbackDates: '', partySize: '', priceAcknowledged: false, additionalComments: '' };

export default function CampfireReservationForm({ priceDisplay = '$50.00' }) {
  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState(null);
  const update = event => {
    const { name, type, checked, value } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  async function submit(event) {
    event.preventDefault(); setPending(true); setError('');
    try {
      const response = await fetch('/api/forms/campfire-reservation-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The request could not be submitted.');
      setRequestId(data.requestId); setForm(initialForm);
    } catch (submissionError) { setError(submissionError.message); }
    finally { setPending(false); }
  }
  if (requestId) return <div className="mt-6 rounded-lg p-6 bg-foreground/10"><h3 className="!font-serif font-bold">Request received</h3><p>Your request number is <strong>CF-{requestId}</strong>. We sent you a receipt; staff will contact you to confirm availability and payment.</p></div>;
  const inputClass = 'mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 !text-foreground';
  return <form className="mt-6 space-y-4 rounded-lg bg-foreground/10 p-5 text-foreground" onSubmit={submit}>
    <div><h3 className="!font-serif font-bold">Request a campfire</h3><p className="!text-base"><strong>This is a request, not a confirmed booking.</strong></p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="font-semibold">Name *<input className={inputClass} maxLength={120} name="name" onChange={update} required value={form.name} /></label>
      <label className="font-semibold">Email *<input className={inputClass} maxLength={254} name="email" onChange={update} required type="email" value={form.email} /></label>
      <label className="font-semibold">Phone *<input className={inputClass} maxLength={40} name="phone" onChange={update} required type="tel" value={form.phone} /></label>
      <label className="font-semibold">Preferred night *<input className={inputClass} name="preferredDate" onChange={update} required type="date" value={form.preferredDate} /></label>
      <label className="font-semibold">Party size<input className={inputClass} max={10000} min={1} name="partySize" onChange={update} type="number" value={form.partySize} /></label>
    </div>
    <label className="block font-semibold">Other dates that work<textarea className={inputClass} maxLength={1000} name="fallbackDates" onChange={update} rows={2} value={form.fallbackDates} /></label>
    <label className="block font-semibold">Additional comments<textarea className={inputClass} maxLength={2000} name="additionalComments" onChange={update} rows={3} value={form.additionalComments} /></label>
    <label className="flex gap-3 rounded-lg bg-foreground/[0.06] p-3"><input checked={form.priceAcknowledged} name="priceAcknowledged" onChange={update} required type="checkbox" /><span>I understand the campfire rental costs <strong>{priceDisplay}</strong> per night and that submitting this form does not confirm a reservation.</span></label>
    {error && <p className="rounded-lg bg-red-50! p-3 text-red-800!" role="alert">{error}</p>}
    <button className="w-full rounded-lg bg-accent px-5 py-3 font-bold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? 'Sending request…' : 'Submit campfire request'}</button>
  </form>;
}
