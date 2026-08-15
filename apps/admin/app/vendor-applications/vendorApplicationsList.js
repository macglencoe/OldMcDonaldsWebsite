'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  CERTIFICATION_LABELS,
  ELECTRICITY_LABELS,
  REVIEW_STATUS_LABELS,
} from '@/lib/vendorApplicationsView.mjs';

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York',
});

const STATUS_STYLES = {
  new: 'border-blue-200 bg-blue-50 text-blue-800',
  reviewing: 'border-amber-200 bg-amber-50 text-amber-800',
  contacted: 'border-violet-200 bg-violet-50 text-violet-800',
  accepted: 'border-green-200 bg-green-50 text-green-800',
  declined: 'border-gray-300 bg-gray-100 text-gray-700',
  spam: 'border-red-200 bg-red-50 text-red-800',
};

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[status]}`}>{REVIEW_STATUS_LABELS[status]}</span>;
}

async function saveReview(payload) {
  const response = await fetch('/api/vendor-applications/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The review update could not be saved.');
  return data;
}

function ReviewEditor({ entry, onSaved }) {
  const [status, setStatus] = useState(entry.review_status);
  const [note, setNote] = useState(entry.internal_note ?? '');
  const [state, setState] = useState({ pending: false, error: '' });

  useEffect(() => {
    setStatus(entry.review_status);
    setNote(entry.internal_note ?? '');
  }, [entry.review_status, entry.internal_note]);

  async function submit(event) {
    event.preventDefault();
    if (status === 'spam' && entry.review_status !== 'spam'
      && !window.confirm(`Mark application #${entry.id} as spam? It can be restored later.`)) return;
    setState({ pending: true, error: '' });
    try {
      await saveReview({ ids: [entry.id], status, note });
      setState({ pending: false, error: '' });
      onSaved(`Application #${entry.id} updated.`);
    } catch (error) {
      setState({ pending: false, error: error.message });
    }
  }

  return (
    <form className="mt-5 border-t border-foreground/10 pt-4" onSubmit={submit}>
      <div className="grid gap-3 lg:grid-cols-[minmax(10rem,14rem)_1fr_auto] lg:items-end">
        <label className="font-semibold">
          Review status
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" onChange={event => setStatus(event.target.value)} value={status}>
            {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="font-semibold">
          Internal note
          <input className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" maxLength={1000} onChange={event => setNote(event.target.value)} placeholder="Optional; never included in exports" value={note} />
        </label>
        <button className="rounded-lg bg-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={state.pending} type="submit">
          {state.pending ? 'Saving…' : 'Save review'}
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm font-semibold text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}

function ApplicationDetails({ entry, onSaved }) {
  return (
    <div className="min-w-0 overflow-hidden p-4 sm:p-5">
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-sm font-semibold text-foreground/60">Email</dt><dd className="break-all"><a className="underline" href={`mailto:${entry.email}`}>{entry.email}</a></dd></div>
        <div><dt className="text-sm font-semibold text-foreground/60">Phone</dt><dd><a className="underline" href={`tel:${entry.phone_normalized}`}>{entry.phone}</a></dd></div>
        <div><dt className="text-sm font-semibold text-foreground/60">Electricity</dt><dd>{ELECTRICITY_LABELS[entry.electricity_requirement]}</dd></div>
        <div><dt className="text-sm font-semibold text-foreground/60">Certification</dt><dd>{entry.certification_status ? CERTIFICATION_LABELS[entry.certification_status] : 'Not applicable'}</dd></div>
      </dl>
      {entry.website_url && <p className="mt-4 break-all"><strong>Website/social:</strong> <a className="underline" href={entry.website_url} rel="noopener noreferrer" target="_blank">{entry.website_url}</a></p>}
      {entry.availability_notes && <p className="mt-2 whitespace-pre-wrap"><strong>Availability:</strong> {entry.availability_notes}</p>}
      <ReviewEditor entry={entry} onSaved={onSaved} />
    </div>
  );
}

export default function VendorApplicationsList({ entries }) {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('spam');
  const [expanded, setExpanded] = useState(new Set());
  const [state, setState] = useState({ pending: false, error: '', message: '' });

  function toggleSelection(id) {
    setSelected(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleExpanded(id) {
    setExpanded(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function refreshed(message) {
    setState({ pending: false, error: '', message });
    router.refresh();
  }

  async function applyBulkUpdate() {
    const ids = [...selected];
    if (!ids.length) return;
    if (bulkStatus === 'spam' && !window.confirm(`Mark ${ids.length} selected application${ids.length === 1 ? '' : 's'} as spam? They can be restored later.`)) return;
    setState({ pending: true, error: '', message: '' });
    try {
      await saveReview({ ids, status: bulkStatus });
      setSelected(new Set());
      refreshed(`${ids.length} application${ids.length === 1 ? '' : 's'} updated.`);
    } catch (error) {
      setState({ pending: false, error: error.message, message: '' });
    }
  }

  const allSelected = entries.length > 0 && entries.every(entry => selected.has(entry.id));
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(entries.map(entry => entry.id)));
  }

  if (!entries.length) return <p className="rounded-xl border border-dashed p-8 text-center">No applications match these filters.</p>;

  return (
    <>
      <div className="mb-3 flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-foreground/20 bg-foreground/[0.03] p-2.5">
        <span className="min-w-24 text-sm font-semibold">{selected.size ? `${selected.size} selected` : 'Select entries'}</span>
        <select aria-label="Bulk review status" className="rounded-lg border border-foreground/30 bg-white px-3 py-2 text-sm" onChange={event => setBulkStatus(event.target.value)} value={bulkStatus}>
          {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button className="rounded-lg border border-foreground px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={!selected.size || state.pending} onClick={applyBulkUpdate} type="button">
          {state.pending ? 'Updating…' : 'Update selected'}
        </button>
        {state.message && <p className="text-sm font-semibold text-green-700" role="status">{state.message}</p>}
        {state.error && <p className="text-sm font-semibold text-red-700" role="alert">{state.error}</p>}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-foreground/20 md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-foreground text-white">
            <tr>
              <th className="w-12 px-4 py-3"><input aria-label="Select all applications on this page" checked={allSelected} onChange={toggleAll} type="checkbox" /></th>
              <th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <FragmentRow entry={entry} expanded={expanded.has(entry.id)} key={entry.id} onSaved={refreshed} onToggle={() => toggleExpanded(entry.id)} selected={selected.has(entry.id)} toggleSelection={() => toggleSelection(entry.id)} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid min-w-0 gap-3 md:hidden">
        {entries.map(entry => (
          <article className="min-w-0 overflow-hidden rounded-xl border border-foreground/20 shadow-sm" key={entry.id}>
            <div className="flex items-start gap-3 p-4">
              <input aria-label={`Select application ${entry.id}`} checked={selected.has(entry.id)} className="mt-1" onChange={() => toggleSelection(entry.id)} type="checkbox" />
              <div className="min-w-0 flex-1"><p className="font-bold">#{entry.id} · {entry.business_name}</p><p className="truncate text-sm">{entry.contact_name} · {entry.email}</p><p className="mt-1 text-xs text-foreground/60">{dateTime.format(new Date(entry.created_at))}</p></div>
              <StatusBadge status={entry.review_status} />
            </div>
            <details className="min-w-0 border-t border-foreground/10"><summary className="cursor-pointer px-4 py-3 font-semibold">View and review</summary><ApplicationDetails entry={entry} onSaved={refreshed} /></details>
          </article>
        ))}
      </div>
    </>
  );
}

function FragmentRow({ entry, expanded, onSaved, onToggle, selected, toggleSelection }) {
  return (
    <>
      <tr className="border-t border-foreground/15 odd:bg-foreground/[0.03]">
        <td className="px-4 py-3"><input aria-label={`Select application ${entry.id}`} checked={selected} onChange={toggleSelection} type="checkbox" /></td>
        <td className="whitespace-nowrap px-4 py-3 text-sm"><span className="block font-semibold">#{entry.id}</span>{dateTime.format(new Date(entry.created_at))}</td>
        <td className="max-w-xs px-4 py-3"><span className="block font-semibold">{entry.business_name}</span><span className="block truncate text-sm">{entry.contact_name} · {entry.email}</span></td>
        <td className="px-4 py-3 text-sm">{entry.is_food_vendor ? 'Food vendor' : 'Non-food vendor'}</td>
        <td className="px-4 py-3"><StatusBadge status={entry.review_status} /></td>
        <td className="px-4 py-3 text-right"><button aria-expanded={expanded} className="rounded-lg border border-foreground/30 px-3 py-2 text-sm font-semibold" onClick={onToggle} type="button">{expanded ? 'Close' : 'Review'}</button></td>
      </tr>
      {expanded && <tr className="border-t border-foreground/10 bg-white"><td colSpan={6}><ApplicationDetails entry={entry} onSaved={onSaved} /></td></tr>}
    </>
  );
}
