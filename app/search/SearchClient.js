// app/search/SearchClient.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

function renderHighlighted(text, terms) {
  if (!terms.length || !text) return text;
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="rounded px-1">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function makeSnippet(content, terms, before = 60, after = 160) {
  if (!content) return "";
  if (!terms.length) return content.slice(0, 220);
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "i");
  const idx = content.toLowerCase().search(re);
  const start = Math.max(0, idx === -1 ? 0 : idx - before);
  const end = Math.min(content.length, idx === -1 ? 220 : idx + after);
  const prefix = start > 0 ? "… " : "";
  const suffix = end < content.length ? " …" : "";
  return `${prefix}${content.slice(start, end)}${suffix}`;
}

function scoreDoc(doc, terms) {
  if (!terms.length) return 0;
  const re = new RegExp(terms.map(escapeRegExp).join("|"), "gi");
  const count = (s, w = 1) => (s ? (s.match(re) || []).length * w : 0);
  return (
    count(doc.title, 3) + count(doc.description, 2) + count(doc.content, 1)
  );
}

export default function SearchClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef(null);

  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const dq = useDebouncedValue(query, 250);
  const terms = useMemo(() => tokenize(dq), [dq]);

  // Fetch index
  const [index, setIndex] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        if (!cancelled) {
          setIndex(Array.isArray(data?.pages) ? data.pages : []);
          setLoadError(false);
        }
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

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

  const results = useMemo(() => {
    if (!terms.length) return [];
    const filtered = index
      .map((doc) => ({ ...doc, _score: scoreDoc(doc, terms) }))
      .filter((d) => d._score > 0);
    filtered.sort((a, b) => b._score - a._score);
    return filtered.slice(0, 100); // safety cap
  }, [index, terms]);

  const count = results.length;

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/30"
          type="search"
          placeholder="Search… (press / to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={Boolean(initialQ)}
          aria-label="Search the site"
        />
        <div
          aria-live="polite"
          className="mt-2 text-sm text-foreground/70 min-h-5"
        >
          {terms.length
            ? `${count} result${count === 1 ? "" : "s"}`
            : "Type to search the site"}
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load <code>/search-index.json</code>. Make sure you’ve run{" "}
          <code>npm run build:search</code> and that{" "}
          <code>public/search-index.json</code> exists.
        </div>
      )}

      {terms.length > 0 && (
        <ol className="space-y-4">
          {results.map((doc) => {
            const snippet = makeSnippet(doc.content, terms);
            return (
              <li
                key={doc.url}
                className="rounded-xl border bg-background p-4 ring-1 ring-foreground/10 hover:ring-foreground/25 transition"
              >
                <Link
                  href={doc.url}
                  className="text-lg font-medium underline-offset-4 hover:underline"
                >
                  {renderHighlighted(doc.title || doc.url, terms)}
                </Link>

                {doc.description ? (
                  <p className="mt-1 text-sm text-foreground/70">
                    {renderHighlighted(doc.description, terms)}
                  </p>
                ) : null}

                {snippet ? (
                  <p className="mt-2 text-sm leading-6 text-foreground/80 line-clamp-3">
                    {renderHighlighted(snippet, terms)}
                  </p>
                ) : null}

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
