"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FAQDrop } from "@/components/faqDrop"

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

function highlight(text, query) {
  if (!query) return text
  const pattern = query
    .trim()
    .split(/\s+/)
    .map(q => q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  if (!pattern) return text
  const regex = new RegExp(`(${pattern})`, "ig")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
  )
}

export default function FaqSearchList({ items }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQ = searchParams.get("q") || ""
  const [q, setQ] = useState(initialQ)
  const inputRef = useRef(null)

  // Keep URL in sync
  useEffect(() => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()))
    if (q) sp.set("q", q)
    else sp.delete("q")
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!q) return items
    const nq = normalize(q)
    return items.filter(it => {
      const kw = Array.isArray(it.keywords)
        ? it.keywords.join(" ")
        : (typeof it.keywords === "string" ? it.keywords : "")
      const hay = normalize(`${it.question} ${it.answer} ${kw}`)
      // simple AND-match across words
      const words = nq.split(/\s+/).filter(Boolean)
      return words.every(w => hay.includes(w))
    })
  }, [items, q])

  const count = filtered.length

  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
        <div className="flex items-center gap-2">
          <input
            id="faq-search"
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search questions (e.g., pumpkins, stroller, hours)"
            className="w-full rounded-full border-2 border-accent px-3 py-2"
            type="search"
            inputMode="search"
            aria-label="Search FAQs"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("")
                inputRef.current?.focus()
              }}
              className="rounded-full bg-accent text-background font-bold px-3 py-2"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-2 text-sm text-foreground/70" role="status" aria-live="polite">
          {q ? `${count} ${count === 1 ? "result" : "results"}` : `${items.length} total questions`}
        </div>
      </div>

      {count === 0 ? (
        <p className="text-foreground/70">No results. Try different keywords, or <a href="tel:304-839-2330">Contact Us</a>.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <FAQDrop key={i} q={item.question} ADA={item.ADA}>
                {item.answer}
            </FAQDrop>
          ))}
        </div>
      )}
    </div>
  )
}
