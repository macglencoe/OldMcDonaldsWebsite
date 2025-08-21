"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FAQDrop } from "@/components/faqDrop"
import { track } from "@vercel/analytics"

function normalize(str = "") {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
}

function redactQuery(q) {
    // Trim, collapse whitespace, and cap length to avoid sending PII accidentally
    return q.trim().replace(/\s+/g, " ").slice(0, 60)
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
    const [debouncedQ, setDebouncedQ] = useState(initialQ)
    const inputRef = useRef(null)
    const lastTracked = useRef(null)



    // Debounce q -> debouncedQ
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(q), 200)
        return () => clearTimeout(t) // cancel on change/unmount
    }, [q])

    // Keep URL in sync
    useEffect(() => {
        const sp = new URLSearchParams(Array.from(searchParams.entries()))
        if (debouncedQ) sp.set("q", debouncedQ)
        else sp.delete("q")
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
    }, [debouncedQ]) // eslint-disable-line react-hooks/exhaustive-deps

    const filtered = useMemo(() => {
        if (!debouncedQ) return items
        const nq = normalize(debouncedQ)
        return items.filter(it => {
            const kw = Array.isArray(it.keywords)
                ? it.keywords.join(" ")
                : (typeof it.keywords === "string" ? it.keywords : "")
            const hay = normalize(`${it.question} ${it.answer} ${kw}`)
            // simple AND-match across words
            const words = nq.split(/\s+/).filter(Boolean)
            return words.every(w => hay.includes(w))
        })
    }, [items, debouncedQ])

    // Analytics: track after debounce 
    useEffect(() => {
        const q = redactQuery(debouncedQ || "")
        const ok = q.length >= 2
        if (!ok) {
            lastTracked.current = null
            return
        }
        const signature = `${q}|${filtered.length}|${global}|${pathname}`
        if (signature === lastTracked.current) return
        lastTracked.current = signature

        track("faq_search", {
            q, // redacted, trimmed, max 60 chars
        })
    }, [debouncedQ, filtered.length, global, pathname])

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
