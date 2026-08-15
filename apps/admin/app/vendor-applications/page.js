import Link from 'next/link';

import { getVendorApplications, VENDOR_PAGE_SIZE } from '@/lib/vendorApplications.mjs';
import {
  CERTIFICATION_LABELS,
  ELECTRICITY_LABELS,
  parseCertification,
  parseElectricity,
  parseFood,
  parseReviewStatus,
  parseVendorSearch,
  REVIEW_STATUS_LABELS,
} from '@/lib/vendorApplicationsView.mjs';
import { parsePage } from '@/lib/mazeEntriesView.mjs';

import VendorApplicationsList from './vendorApplicationsList.js';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vendor Applications | OMPP Admin' };

function queryString({ page, food, electricity, certification, status, search }) {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (status) params.set('status', status);
  if (food !== null) params.set('food', food ? 'yes' : 'no');
  if (electricity) params.set('electricity', electricity);
  if (certification) params.set('certification', certification);
  if (page > 1) params.set('page', page);
  return params.size ? `?${params}` : '';
}

function exportQuery({ food, electricity, certification }) {
  const params = new URLSearchParams();
  if (food !== null) params.set('food', food ? 'yes' : 'no');
  if (electricity) params.set('electricity', electricity);
  if (certification) params.set('certification', certification);
  return params.size ? `?${params}` : '';
}

export default async function VendorApplicationsPage({ searchParams }) {
  const params = await searchParams;
  const food = parseFood(params?.food);
  const electricity = parseElectricity(params?.electricity);
  const certification = parseCertification(params?.certification);
  const status = parseReviewStatus(params?.status);
  const search = parseVendorSearch(params?.q);
  const data = await getVendorApplications({
    page: parsePage(params?.page), food, electricity, certification, status, search,
  });
  const filterState = { food, electricity, certification, status, search };
  const firstEntry = data.totalEntries ? ((data.currentPage - 1) * VENDOR_PAGE_SIZE) + 1 : 0;
  const lastEntry = Math.min(data.currentPage * VENDOR_PAGE_SIZE, data.totalEntries);

  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Form submissions</p>
          <h1 className="text-3xl font-bold">Vendor applications</h1>
          <p className="mt-2 text-foreground/70">Review applications and keep suspected spam out of the active queue.</p>
        </div>
        <a className="h-fit rounded-lg bg-accent px-4 py-2 font-semibold text-white" href={`/vendor-applications/export${exportQuery(filterState)}`}>Download CSV</a>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-foreground/15 bg-foreground/[0.02] p-4 sm:grid-cols-2 lg:grid-cols-6" method="get">
        <label className="font-semibold sm:col-span-2">
          Search
          <input className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={search ?? ''} maxLength={100} name="q" placeholder="Business, contact, email, or phone" type="search" />
        </label>
        <label className="font-semibold">
          Status
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={status ?? ''} name="status">
            <option value="">All</option>
            {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="font-semibold">
          Food vendor
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={food === null ? '' : food ? 'yes' : 'no'} name="food">
            <option value="">All</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
        <label className="font-semibold">
          Electricity
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={electricity ?? ''} name="electricity">
            <option value="">All</option>{Object.entries(ELECTRICITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="font-semibold">
          Certification
          <select className="mt-1 block w-full rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal" defaultValue={certification ?? ''} name="certification">
            <option value="">All</option>{Object.entries(CERTIFICATION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
          <button className="rounded-lg border border-foreground bg-foreground px-4 py-2 font-semibold text-white" type="submit">Apply filters</button>
          <Link className="px-3 py-2 font-semibold underline underline-offset-4" href="/vendor-applications">Clear</Link>
        </div>
      </form>

      <p className="mb-3 text-sm text-foreground/70" aria-live="polite">Showing {firstEntry}–{lastEntry} of {data.totalEntries} applications</p>
      <VendorApplicationsList entries={data.entries} />

      {data.totalPages > 1 && (
        <nav aria-label="Vendor application pages" className="mt-6 flex items-center justify-between gap-4">
          {data.currentPage > 1
            ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={`/vendor-applications${queryString({ ...filterState, page: data.currentPage - 1 })}`}>Previous</Link>
            : <span />}
          <span className="text-sm font-semibold">Page {data.currentPage} of {data.totalPages}</span>
          {data.currentPage < data.totalPages
            ? <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={`/vendor-applications${queryString({ ...filterState, page: data.currentPage + 1 })}`}>Next</Link>
            : <span />}
        </nav>
      )}
    </main>
  );
}
