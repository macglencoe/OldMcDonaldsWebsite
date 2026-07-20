import Link from 'next/link';
import { getVendorApplications, VENDOR_PAGE_SIZE } from '@/lib/vendorApplications.mjs';
import { CERTIFICATION_LABELS, ELECTRICITY_LABELS, parseCertification, parseElectricity, parseFood } from '@/lib/vendorApplicationsView.mjs';
import { parsePage } from '@/lib/mazeEntriesView.mjs';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vendor Applications | OMPP Admin' };
const dateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' });
function queryString({ page, food, electricity, certification }, includePage = true) {
  const params = new URLSearchParams();
  if (food !== null) params.set('food', food ? 'yes' : 'no');
  if (electricity) params.set('electricity', electricity); if (certification) params.set('certification', certification);
  if (includePage && page > 1) params.set('page', page);
  return params.size ? `?${params}` : '';
}
export default async function VendorApplicationsPage({ searchParams }) {
  const params = await searchParams; const food = parseFood(params?.food); const electricity = parseElectricity(params?.electricity); const certification = parseCertification(params?.certification);
  const data = await getVendorApplications({ page: parsePage(params?.page), food, electricity, certification });
  const filterState = { food, electricity, certification };
  return <main className="px-4 py-8 sm:px-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Form submissions</p><h1 className="text-3xl font-bold">Vendor applications</h1><p className="mt-2 text-foreground/70">Applications are not approvals to vend.</p></div><a className="h-fit rounded-lg bg-accent px-4 py-2 font-semibold text-white" href={`/vendor-applications/export${queryString(filterState, false)}`}>Download CSV</a></div>
    <form className="mb-6 flex flex-wrap items-end gap-3">
      <label className="font-semibold">Food vendor<select className="block rounded border p-2" defaultValue={food === null ? '' : food ? 'yes' : 'no'} name="food"><option value="">All</option><option value="yes">Yes</option><option value="no">No</option></select></label>
      <label className="font-semibold">Electricity<select className="block rounded border p-2" defaultValue={electricity ?? ''} name="electricity"><option value="">All</option>{Object.entries(ELECTRICITY_LABELS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="font-semibold">Certification<select className="block rounded border p-2" defaultValue={certification ?? ''} name="certification"><option value="">All</option>{Object.entries(CERTIFICATION_LABELS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <button className="rounded border px-4 py-2 font-semibold">Apply</button><Link className="p-2 underline" href="/vendor-applications">Clear</Link>
    </form>
    <p className="mb-3 text-sm">Showing {data.totalEntries ? (data.currentPage - 1) * VENDOR_PAGE_SIZE + 1 : 0}–{Math.min(data.currentPage * VENDOR_PAGE_SIZE, data.totalEntries)} of {data.totalEntries}</p>
    <div className="space-y-4">{data.entries.map(entry => <article className="rounded-xl border border-foreground/20 p-5 shadow-sm" key={entry.id}>
      <div className="flex flex-wrap justify-between gap-2"><div><h2 className="text-xl font-bold">#{entry.id} · {entry.business_name}</h2><p>{entry.contact_name} · <a className="underline" href={`mailto:${entry.email}`}>{entry.email}</a> · <a className="underline" href={`tel:${entry.phone_normalized}`}>{entry.phone}</a></p></div><p className="text-sm text-foreground/60">Submitted {dateTime.format(new Date(entry.created_at))}</p></div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3"><div><dt className="font-semibold">Electricity</dt><dd>{ELECTRICITY_LABELS[entry.electricity_requirement]}</dd></div><div><dt className="font-semibold">Food vendor</dt><dd>{entry.is_food_vendor ? 'Yes' : 'No'}</dd></div><div><dt className="font-semibold">Certification</dt><dd>{entry.certification_status ? CERTIFICATION_LABELS[entry.certification_status] : 'Not applicable'}</dd></div></dl>
      {entry.website_url && <p className="mt-3"><strong>Website/social:</strong> <a className="underline" href={entry.website_url} rel="noopener noreferrer" target="_blank">{entry.website_url}</a></p>}{entry.availability_notes && <p className="mt-2"><strong>Availability:</strong> {entry.availability_notes}</p>}
    </article>)}{!data.entries.length && <p className="rounded-xl border border-dashed p-8 text-center">No applications match this filter.</p>}</div>
    {data.totalPages > 1 && <nav className="mt-6 flex justify-between">{data.currentPage > 1 ? <Link href={`/vendor-applications${queryString({ ...filterState, page: data.currentPage - 1 })}`}>Previous</Link> : <span/>}<span>Page {data.currentPage} of {data.totalPages}</span>{data.currentPage < data.totalPages ? <Link href={`/vendor-applications${queryString({ ...filterState, page: data.currentPage + 1 })}`}>Next</Link> : <span/>}</nav>}
  </main>;
}
