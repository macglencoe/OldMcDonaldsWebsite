// app/search/SearchClient.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { track } from '@vercel/analytics';

// ---- utilities

function useDebouncedValue(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(q) {
  return (q || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

// fuse highlights use index ranges; merge and render them
function mergeRanges(ranges) {
  if (!ranges?.length) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s <= last[1] + 1) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}

function isWordChar(ch) {
  return /[A-Za-z0-9]/.test(ch);
}
function isWholeWord(text, s, e) {
  const before = s - 1 >= 0 ? text[s - 1] : " ";
  const after  = e + 1 < text.length ? text[e + 1] : " ";
  return !isWordChar(before) && !isWordChar(after);
}

function renderHighlightedByIndices(text, indices) {
  if (!text) return null;
  const merged = mergeRanges(indices)
    // drop very short highlights
    .filter(([s, e]) => e - s + 1 >= 3)
    // keep only whole words
    .filter(([s, e]) => isWholeWord(text, s, e));

  if (merged.length === 0) return text;

  const out = [];
  let cursor = 0;
  for (let i = 0; i < merged.length; i++) {
    const [s, e] = merged[i];
    if (cursor < s) out.push(<span key={`t-${cursor}`}>{text.slice(cursor, s)}</span>);
    out.push(<mark key={`m-${i}-${s}-${e}`} className="rounded px-1 bg-accent/20">{text.slice(s, e + 1)}</mark>);
    cursor = e + 1;
  }
  if (cursor < text.length) out.push(<span key={`t-end-${cursor}`}>{text.slice(cursor)}</span>);
  return out;
}


function renderHighlightedFallback(text, terms) {
  if (!text || !terms.length) return text;

  // filter out very short tokens to prevent noisy highlighting
  const safe = terms.filter(t => t.length >= 2);
  if (!safe.length) return text;

  // capture group ensures matches appear as odd indices in parts
  const re = new RegExp(`\\b(${safe.map(escapeRegExp).join("|")})\\b`, "gi");

  const parts = text.split(re);

  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="rounded px-1 bg-accent/20">{part}</mark>
      : <span key={i}>{part}</span>
  );
}


function makeSnippetFromMatches(doc, matches, before = 60, after = 160) {
  const content = doc.content || "";
  if (!content) return { snippet: "", indices: [] };

  // Prefer a match in content; else try description; else fall back
  const mContent = matches?.find((m) => m.key === "content");
  const baseText = mContent ? content : doc.description || content;
  const chosen = mContent || matches?.find((m) => m.key === "description");

  if (!chosen || !chosen.indices?.length) {
    // no indices; return a simple head slice
    const raw = baseText.slice(0, 220);
    return { snippet: raw, indices: [] };
  }

  const [hitStart, hitEnd] = chosen.indices[0];
  const start = Math.max(0, hitStart - before);
  const end = Math.min(baseText.length, hitEnd + after);

  const snippet = `${start > 0 ? "… " : ""}${baseText.slice(start, end)}${end < baseText.length ? " …" : ""}`;

  // shift/clip indices into snippet space
  const shifted = mergeRanges(
    chosen.indices
      .map(([s, e]) => [s - start, e - start])
      .filter(([s, e]) => e >= 0 && s <= snippet.length - 1)
      .map(([s, e]) => [Math.max(0, s), Math.min(snippet.length - 1, e)])
  );

  return { snippet, indices: shifted };
}

// ---- component

export default function SearchClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);

  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const dq = useDebouncedValue(query, 250);
  const terms = useMemo(() => tokenize(dq), [dq]);
  const hasQuery = dq.trim().length > 0;

  // Load index
  const [index, setIndex] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // avoid double-logging in react strict mode dev
    const loggedRef = { current: false };
    let cancelled = false;
    const t0 = performance.now();
    fetch("/search-index.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        if (cancelled) return;

        const pages = Array.isArray(data?.pages) ? data.pages : [];
        setIndex(pages);
        setLoadError(false);

        const latency = Math.round(performance.now() - t0);
        if (!loggedRef.current) {
          track('search_index_load', {
            count: pages.length,
            latency_ms: latency
          });
          loggedRef.current = true;
        }
      })
      .catch(err => {
        if (cancelled) return;

        setLoadError(true);

        const latency = Math.round(performance.now() - t0);
        if (!loggedRef.current) {
          track('search_index_error', {
            reason: (err?.message || 'fetch_failed').slice(0, 64),
            latency_ms: latency
          });
          loggedRef.current = true;
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Build Fuse index when data changes
  const fuse = useMemo(() => {
    if (!index.length) return null;
    return new Fuse(index, {
      includeScore: true,
      includeMatches: true,
      shouldSort: true,
      threshold: 0.2,       
      ignoreLocation: true, 
      minMatchCharLength: 3,
      keys: [
        { name: "title", weight: 0.5 },
        { name: "description", weight: 0.3 },
        { name: "content", weight: 0.2 },
        { name: "keywords", weight: 0.6 },
        { name: "url", weight: 0.1 },
      ],
    });
  }, [index]);

  // Keep URL in sync (replace, not push)
  useEffect(() => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    if (dq) sp.set("q", dq);
    else sp.delete("q");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq, pathname]);

  // Keyboard shortcut: focus with "/"
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Run search
  const results = useMemo(() => {
    if (!fuse || !hasQuery) return [];
    return fuse.search(dq).slice(0, 100); // [{ item, score, matches }]
  }, [fuse, dq, hasQuery]);

  const count = results.length;

  // Send analytics on search
  useEffect(() => {
    if (!fuse || !hasQuery) return;
    // Guard very-short inputs
    if ((dq?.trim()?.length ?? 0) < 2) return;

    if (count === 0) {
      track('search_no_results', {
        query: dq,
      })
      return
    }

    track('search', {
      query: dq,
      result: count,
    });
  }, [dq, count, hasQuery, fuse]);

  const trackClick = (query, url) => {
    track('search_click', {
      query,
      url
    })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full rounded-full border border-accent bg-background px-4 py-3 outline-none ring-1 ring-accent focus:ring-2 focus:ring-accent/20"
          type="search"
          placeholder="Search… (press / to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={Boolean(initialQ)}
          aria-label="Search the site"
        />
        <div aria-live="polite" className="mt-2 min-h-5 text-sm text-foreground/70">
          {hasQuery ? `${count} result${count === 1 ? "" : "s"}` : "Type to search the site"}
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load <code>/search-index.json</code>. Please contact the developer.
        </div>
      )}

      {hasQuery && (
        <ol className="space-y-4" aria-label="Search results">
          {results.map(({ item: doc, matches }) => {
            const titleMatch = matches?.find((m) => m.key === "title");
            const descMatch = matches?.find((m) => m.key === "description");
            const { snippet, indices } = makeSnippetFromMatches(doc, matches);
            const kwMatch = matches?.find((m) => m.key === "keywords");



            return (
              <li
                key={doc.url}
                className="rounded-xl border border-foreground/20 bg-background/5 p-4 transition hover:bg-accent/5"
              >
                <Link href={doc.url} onClick={() => trackClick(dq, doc.url)} className="text-lg font-medium underline-offset-4 hover:underline">
                  {titleMatch
                    ? renderHighlightedByIndices(doc.title || doc.url, titleMatch.indices)
                    : renderHighlightedFallback(doc.title || doc.url, terms)}
                </Link>

                {doc.description && (doc.description != "The official website for Old McDonald's Pumpkin Patch and Corn Maze in Inwood, WV") ? (
                  <p className="mt-1 text-sm text-foreground/70">
                    {descMatch
                      ? renderHighlightedByIndices(doc.description, descMatch.indices)
                      : renderHighlightedFallback(doc.description, terms)}
                  </p>
                ) : null}

                {snippet ? (
                  <p className="mt-2 text-sm leading-6 text-foreground/80 line-clamp-3">
                    {indices.length
                      ? renderHighlightedByIndices(snippet, indices)
                      : renderHighlightedFallback(snippet, terms)}
                  </p>
                ) : null}

                {kwMatch && (
                  <p className="mt-1 text-xs text-accent">
                    Matched keyword: {kwMatch.value}
                  </p>
                )}


                <p className="mt-1 text-xs text-foreground/50">{doc.url}</p>
              </li>
            );
          })}

          {count === 0 && (
            <li className="rounded-xl border bg-background p-6 text-foreground/70">
              No matches. Try different keywords or fewer terms.
            </li>
          )}
        </ol>
      )}
    </div>
  );
}
