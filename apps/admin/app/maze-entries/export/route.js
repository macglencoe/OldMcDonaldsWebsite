import { getMazeEntriesForExport } from '@/lib/mazeEntries.mjs';
import { createMazeEntriesCsv, parseYear } from '@/lib/mazeEntriesView.mjs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const rawYear = request.nextUrl.searchParams.get('year');
  const year = parseYear(rawYear);

  if (rawYear && !year) {
    return Response.json({ error: 'Invalid year.' }, { status: 400 });
  }

  const entries = await getMazeEntriesForExport({ year });
  const csv = createMazeEntriesCsv(entries);
  const filename = year ? `maze-entries-${year}.csv` : 'maze-entries-all.csv';

  return new Response(csv, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}
