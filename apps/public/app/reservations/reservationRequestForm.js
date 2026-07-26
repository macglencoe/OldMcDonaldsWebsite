"use client"

import { useEffect, useState } from 'react';
import { useFlags } from '@/app/FlagsContext';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfUPYvXsF4qcMsmtgOuidB06WPJkKKwlSLmo3uPnNDWgziPsw/viewform?usp=sharing&ouid=100113173059112922558';
const initialForm = {
  email: '', name: '', phone: '', preferredDate: '', preferredTimeSlot: '', fallbackDates: '',
  priceAcknowledged: false, weatherRefundAcknowledged: false, earlyArrivalAcknowledged: false,
  additionalComments: '',
};

export default function ReservationRequestForm({ priceDisplay }) {
  const { isFeatureEnabled } = useFlags();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [forceGoogleForm, setForceGoogleForm] = useState(false);
  const [slotLookup, setSlotLookup] = useState({
    status: 'idle', slots: {}, season: null, error: '',
  });

  useEffect(() => {
    const until = Number(localStorage.getItem('reservation_forms_disabled_until') || 0);
    if (until > Date.now()) setForceGoogleForm(true);
  }, []);

  const useDatabase = isFeatureEnabled('use_db_reservations') && !forceGoogleForm;

  useEffect(() => {
    if (!useDatabase || !form.preferredDate) {
      setSlotLookup({ status: 'idle', slots: {}, season: null, error: '' });
      return;
    }
    const controller = new AbortController();
    setSlotLookup({ status: 'loading', slots: {}, season: null, error: '' });
    fetch(`/api/reservations/gazebo-slots?date=${encodeURIComponent(form.preferredDate)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status >= 500) {
          localStorage.setItem('reservation_forms_disabled_until', String(Date.now() + 24 * 60 * 60 * 1000));
          setForceGoogleForm(true);
        }
        if (!response.ok) throw new Error(data.error || 'Gazebo times are unavailable for this date.');
        setSlotLookup({ status: 'ready', slots: data.slots, season: data.season, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setSlotLookup({ status: 'error', slots: {}, season: null, error: error.message });
        }
      });
    return () => controller.abort();
  }, [form.preferredDate, useDatabase]);

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'preferredDate' ? { preferredTimeSlot: '' } : {}),
    }));
  };

  const enableFallback = () => {
    localStorage.setItem('reservation_forms_disabled_until', String(Date.now() + 24 * 60 * 60 * 1000));
    setForceGoogleForm(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/forms/reservation-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setRequestId(data.requestId);
        setForm(initialForm);
      } else {
        setMessage(data.error || 'The request could not be submitted.');
        if (response.status === 429 || response.status >= 500) enableFallback();
      }
    } catch (error) {
      console.error('Reservation submission error:', error);
      setMessage('The request service is unavailable. Please use our backup form.');
      enableFallback();
    } finally { setIsSubmitting(false); }
  };

  if (!useDatabase) return (
    <div className="mx-auto my-12 max-w-2xl rounded-xl border border-accent/40 p-8 text-center">
      <h3 className="!text-5xl mb-4">Request a gazebo</h3>
      {forceGoogleForm && <p className="mb-4 font-semibold">Our request form is temporarily unavailable. Please use the backup form.</p>}
      <a className="inline-block rounded-lg bg-accent px-5 py-3 !text-white font-semibold" href={GOOGLE_FORM_URL} rel="noopener noreferrer" target="_blank">Open reservation request form</a>
      <p className="mt-4 !text-base">Submitting a request does not confirm a reservation.</p>
    </div>
  );

  if (requestId) return (
    <div className="mx-auto my-12 max-w-2xl rounded-xl border border-green-700/30 bg-green-50 p-8 text-center">
      <h3 className="!text-4xl">Request received</h3>
      <p className="mt-3">Your request number is <strong>#{requestId}</strong>.</p>
      <p>We sent you a receipt. This is not a booking confirmation; staff will contact you about availability and payment.</p>
    </div>
  );

  const inputClass = 'w-full rounded-lg border border-foreground/30 bg-white px-3 py-2';
  return (
    <form className="mx-auto my-12 max-w-2xl space-y-5 rounded-xl border border-foreground/20 p-5 sm:p-8 shadow-lg" onSubmit={submit}>
      <div><h3 className="!text-5xl text-center">Request a gazebo</h3><p className="mt-2 text-center"><strong>This is a request, not a confirmed booking.</strong> Staff will contact you about availability.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="font-semibold">Name *<input className={inputClass} maxLength={120} name="name" onChange={update} required value={form.name} /></label>
        <label className="font-semibold">Email *<input className={inputClass} maxLength={254} name="email" onChange={update} required type="email" value={form.email} /></label>
        <label className="font-semibold">Phone number *<input className={inputClass} maxLength={40} name="phone" onChange={update} required type="tel" value={form.phone} /></label>
        <label className="font-semibold">Preferred date *<input className={inputClass} name="preferredDate" onChange={update} required type="date" value={form.preferredDate} /></label>
      </div>
      <label className="block font-semibold">Preferred time slot *
        <select
          className={inputClass}
          disabled={slotLookup.status !== 'ready'}
          name="preferredTimeSlot"
          onChange={update}
          required
          value={form.preferredTimeSlot}
        >
          <option value="">
            {!form.preferredDate ? 'Choose a date first' : slotLookup.status === 'loading' ? 'Loading times…' : 'Choose a time'}
          </option>
          {Object.entries(slotLookup.slots).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        {slotLookup.season && <span className="mt-1 block text-sm font-normal text-foreground/70">{slotLookup.season.name}</span>}
        {slotLookup.error && <span className="mt-1 block text-sm font-normal text-red-700">{slotLookup.error}</span>}
      </label>
      <label className="block font-semibold">Fallback dates or times<textarea className={inputClass} maxLength={1000} name="fallbackDates" onChange={update} rows={3} value={form.fallbackDates} /></label>
      <fieldset className="space-y-3 rounded-lg bg-foreground/[0.04] p-4">
        <legend className="font-bold">Required acknowledgments</legend>
        <label className="flex gap-3"><input checked={form.priceAcknowledged} name="priceAcknowledged" onChange={update} required type="checkbox" /><span>I understand the rental costs <strong>{priceDisplay}</strong> for two hours, due in full at the start of the time slot.</span></label>
        <label className="flex gap-3"><input checked={form.weatherRefundAcknowledged} name="weatherRefundAcknowledged" onChange={update} required type="checkbox" /><span>I understand I am entitled to a refund if weather conditions prevent the business from opening.</span></label>
        <label className="flex gap-3"><input checked={form.earlyArrivalAcknowledged} name="earlyArrivalAcknowledged" onChange={update} required type="checkbox" /><span>I understand I may arrive 30 minutes early to decorate and set up.</span></label>
      </fieldset>
      <label className="block font-semibold">Additional comments<textarea className={inputClass} maxLength={2000} name="additionalComments" onChange={update} rows={4} value={form.additionalComments} /></label>
      {message && <p className="rounded-lg bg-red-50 p-3 text-red-800" role="alert">{message}</p>}
      <button className="w-full rounded-lg bg-accent px-5 py-3 font-bold text-white disabled:opacity-60" disabled={isSubmitting || slotLookup.status !== 'ready'} type="submit">{isSubmitting ? 'Sending request…' : 'Submit request'}</button>
    </form>
  );
}
