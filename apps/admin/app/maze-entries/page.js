import Link from 'next/link';

import { getMazeEntries, MAZE_ENTRIES_PAGE_SIZE } from '@/lib/mazeEntries.mjs';
import { buildMazeEntriesUrl, parsePage, parseYear } from '@/lib/mazeEntriesView.mjs';

export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/New_York',
});

export const metadata = {
  title: 'Maze Entries | OMPP Admin',
};

export default async function MazeEntriesPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = parsePage(params?.page);
  const year = parseYear(params?.year);
  const {
    entries,
    years,
    currentPage,
    totalEntries,
    totalPages,
  } = await getMazeEntries({ page: requestedPage, year });

  const exportUrl = year
    ? `/maze-entries/export?year=${encodeURIComponent(year)}`
    : '/maze-entries/export';
  const firstEntryNumber = totalEntries ? (currentPage - 1) * MAZE_ENTRIES_PAGE_SIZE + 1 : 0;
  const lastEntryNumber = Math.min(currentPage * MAZE_ENTRIES_PAGE_SIZE, totalEntries);

  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-foreground/60">Form submissions</p>
          <h1 className="text-3xl font-bold">Maze entries</h1>
          <p className="mt-2 text-foreground/70">Read-only contest entries, newest first.</p>
        </div>
        <a
          className="w-fit rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:opacity-90"
          href={exportUrl}
        >
          Download CSV
        </a>
      </div>

      <form className="mb-6 flex flex-wrap items-end gap-3" method="get">
        <label className="flex flex-col gap-1 font-semibold" htmlFor="year">
          Contest year
          <select
            className="rounded-lg border border-foreground/30 bg-white px-3 py-2 font-normal"
            defaultValue={year ?? ''}
            id="year"
            name="year"
          >
            <option value="">All years</option>
            {years.map((availableYear) => (
              <option key={availableYear} value={availableYear}>{availableYear}</option>
            ))}
          </select>
        </label>
        <button className="rounded-lg border border-foreground px-4 py-2 font-semibold hover:bg-foreground hover:text-white" type="submit">
          Apply filter
        </button>
        {year && <Link className="px-2 py-2 underline" href="/maze-entries">Clear</Link>}
      </form>

      <p className="mb-3 text-sm text-foreground/70" aria-live="polite">
        Showing {firstEntryNumber}–{lastEntryNumber} of {totalEntries} entries
      </p>

      {entries.length ? (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-foreground/20 md:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-foreground text-white">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Year</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr className="border-t border-foreground/15 odd:bg-foreground/[0.03]" key={entry.id}>
                    <td className="whitespace-nowrap px-4 py-3">{dateFormatter.format(new Date(entry.created_at))}</td>
                    <td className="px-4 py-3 font-medium">{entry.name}</td>
                    <td className="px-4 py-3"><a className="underline" href={`tel:${entry.phone}`}>{entry.phone}</a></td>
                    <td className="px-4 py-3">{entry.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {entries.map((entry) => (
              <article className="rounded-xl border border-foreground/20 p-4 shadow-sm" key={entry.id}>
                <p className="font-bold">{entry.name}</p>
                <p className="mt-1"><a className="underline" href={`tel:${entry.phone}`}>{entry.phone}</a></p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="font-semibold text-foreground/60">Submitted</dt>
                    <dd>{dateFormatter.format(new Date(entry.created_at))}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground/60">Year</dt>
                    <dd>{entry.year}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-foreground/30 p-8 text-center">
          No maze entries match this filter.
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Maze entry pages" className="mt-6 flex items-center justify-between gap-4">
          {currentPage > 1 ? (
            <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={buildMazeEntriesUrl({ page: currentPage - 1, year })}>
              Previous
            </Link>
          ) : <span />}
          <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages ? (
            <Link className="rounded-lg border border-foreground px-4 py-2 font-semibold" href={buildMazeEntriesUrl({ page: currentPage + 1, year })}>
              Next
            </Link>
          ) : <span />}
        </nav>
      )}
    </main>
  );
}
