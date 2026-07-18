export function parsePage(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function parseYear(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (!/^\d{4}$/.test(String(value))) {
    return null;
  }

  const parsed = Number(value);
  return parsed >= 2000 && parsed <= 2100 ? parsed : null;
}

export function buildMazeEntriesUrl({ page = 1, year = null } = {}) {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/maze-entries?${query}` : '/maze-entries';
}

function protectCsvFormula(value) {
  const stringValue = String(value ?? '');
  return /^[=+\-@]/.test(stringValue) ? `'${stringValue}` : stringValue;
}

export function escapeCsvCell(value) {
  const safeValue = protectCsvFormula(value).replaceAll('"', '""');
  return `"${safeValue}"`;
}

export function createMazeEntriesCsv(entries) {
  const header = ['Entry ID', 'Submitted At', 'Name', 'Phone', 'Year'];
  const rows = entries.map((entry) => [
    entry.id,
    new Date(entry.created_at).toISOString(),
    entry.name,
    entry.phone,
    entry.year,
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n');
}
