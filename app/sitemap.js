import fs from 'fs';
import path from 'path';

const baseUrl = 'https://oldmcdonaldspumpkinpatchwv.com';

// File names that define a routable page in App Router
const PAGE_BASENAMES = new Set(['page.js', 'page.jsx', 'page.ts', 'page.tsx']);

/**
 * Return true if a directory segment should contribute to the URL path.
 * Excludes:
 *  - dynamic segments: [slug]
 *  - private/utility folders: starting with "_" (e.g., _components)
 *  - API routes: "api" (App Router API route folders)
 *  - route groups: (marketing) — not part of the URL
 */
function isRoutableSegment(name) {
  if (!name) return false;
  if (name === 'api') return false;
  if (name.startsWith('_')) return false;
  if (name.startsWith('[')) return false;
  if (name.startsWith('(') && name.endsWith(')')) return false;
  return true;
}

/**
 * Recursively walk the `app/` directory to find every folder that contains a page.* file.
 * Returns an array of { path: '/foo/bar', mtime: Date }.
 */
function getAllRoutesFromApp() {
  const appDir = path.join(process.cwd(), 'app');
  const out = [];

  function walk(dir, segments) {
    // Check if this folder contains a page file
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // Track the newest mtime among page files found in this folder (usually only one)
    let pageMtime = null;
    for (const e of entries) {
      if (e.isFile() && PAGE_BASENAMES.has(e.name)) {
        const filePath = path.join(dir, e.name);
        const stat = fs.statSync(filePath);
        // Record the route represented by the current segments
        const routePath = segments.length ? `/${segments.join('/')}` : '';
        pageMtime = pageMtime ? new Date(Math.max(+pageMtime, +stat.mtime)) : stat.mtime;
        out.push({ path: routePath, mtime: pageMtime });
        // No break: if multiple page.* variants exist, consider latest mtime
      }
    }

    // Recurse into subdirectories
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const seg = e.name;
      // For URL path purposes, ignore non-routable segments
      const nextSegments = isRoutableSegment(seg) ? [...segments, seg] : segments;
      walk(path.join(dir, seg), nextSegments);
    }
  }

  // Guard: if app/ doesn’t exist, return just root
  if (!fs.existsSync(appDir)) {
    return [{ path: '', mtime: new Date() }];
  }

  walk(appDir, []);

  // De-duplicate (can happen if odd structures exist)
  const seen = new Map(); // path -> max mtime
  for (const { path: p, mtime } of out) {
    const prev = seen.get(p);
    if (!prev || +mtime > +prev) seen.set(p, mtime);
  }

  return Array.from(seen.entries())
    .map(([p, mtime]) => ({ path: p, mtime }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Optional: per-route overrides for changeFrequency/priority.
 * Anything not listed here will use the defaults below.
 */
const OVERRIDES = {
  '':              { changeFrequency: 'daily',   priority: 1.0 },
  '/visit':        { changeFrequency: 'yearly',  priority: 1.0 },
  '/activities':   { changeFrequency: 'monthly', priority: 1.0 },
  '/about':        { changeFrequency: 'monthly', priority: 0.5 },
  '/faq':          { changeFrequency: 'monthly', priority: 0.5 },
  '/reservations': { changeFrequency: 'monthly', priority: 0.8 },
  '/gallery':      { changeFrequency: 'monthly', priority: 0.6 },
  '/maze-game':    { changeFrequency: 'monthly', priority: 0.4 },
  '/vendors':      { changeFrequency: 'monthly', priority: 0.5 },
  '/privacy-policy': { changeFrequency: 'yearly', priority: 0.3 },
  '/attribution':    { changeFrequency: 'yearly', priority: 0.2 },
};

// Defaults if not in OVERRIDES
const DEFAULTS = { changeFrequency: 'monthly', priority: 0.5 };

export default function sitemap() {
  const discovered = getAllRoutesFromApp();

  return discovered.map(({ path: p, mtime }) => {
    const o = OVERRIDES[p] ?? DEFAULTS;
    return {
      url: `${baseUrl}${p}`,
      lastModified: mtime ?? new Date(),
      changeFrequency: o.changeFrequency,
      priority: o.priority,
    };
  });
}
