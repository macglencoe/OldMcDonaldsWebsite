"use client"
import { useMemo } from "react"
import Link from "next/link"
import {
    ArrowUpRight,
    CloudRain,
    CloudLightning,
    CloudSnow,
    Wind,
    Megaphone,
    Warning
} from "phosphor-react"



/** Maps backend-provided icon names to actual Phosphor components. */
const ICON_MAP = {
    CloudRain,
    CloudLightning,
    CloudSnow,
    Wind,
    Megaphone,
    Warning
}

/** Tailwind styles keyed by Statsig severity level. */
const SEVERITY_STYLES = {
    info: {
        container: "",
        badge: "bg-accent/15 text-accent",
        iconWrapper: "bg-accent/15 text-accent"
    },
    warning: {
        container: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-900",
        iconWrapper: "bg-yellow-50 text-yellow-900"
    },
    alert: {
        container: "border-red-200",
        badge: "bg-red-100 text-red-900",
        iconWrapper: "bg-red-50 text-red-800"
    }
}

/** Higher value == higher priority when sorting announcements. */
const SEVERITY_PRIORITY = {
    alert: 3,
    warning: 2,
    info: 1
}

const CARD_BASE_CLASSES = "rounded-2xl border border-foreground/10 bg-background text-foreground/90 p-4 text-sm shadow-sm"

const DATE_FORMAT_OPTIONS = { month: "short", day: "numeric" }
const dateFormatter = new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS)

const isExternalLink = (href = "") => /^https?:\/\//i.test(href)

/**
 * Convert values into numeric timestamps so we can reuse them throughout the render.
 * @param {unknown} value
 * @returns {number|null}
 */
const toTimestamp = (value) => {
    if (!value) return null
    const instance = value instanceof Date ? value : new Date(value)
    const time = instance.getTime()
    return Number.isNaN(time) ? null : time
}

/**
 * Render the announcements marquee using sanitized items coming from the server component.
 * @param {{items?: Array<object>}} props
 */
export default function AnnouncementsView({ items } = {}) {
    const { summary, list } = useMemo(() => {
        const now = Date.now()
        const prepared = (items ?? [])
            .filter(Boolean)
            .map((announcement) => {
                const issuedAt = toTimestamp(announcement.issued)
                const expiresAt = toTimestamp(announcement.expires)
                return {
                    ...announcement,
                    issuedAt,
                    expiresAt
                }
            })
            .filter((announcement) => !announcement.expiresAt || announcement.expiresAt >= now)

        prepared.sort((a, b) => {
            const severityDiff =
                (SEVERITY_PRIORITY[b.severity] ?? 0) - (SEVERITY_PRIORITY[a.severity] ?? 0)
            if (severityDiff !== 0) return severityDiff
            return (b.issuedAt ?? 0) - (a.issuedAt ?? 0)
        })

        return {
            list: prepared,
            summary: prepared[0] ?? null
        }
    }, [items]) // Memo keeps filtering/sorting work out of render cycle.

    if (!list.length || !summary) return null

    const summaryAnnouncement = summary
    const summaryMeta = getAnnouncementDisplayMeta(summaryAnnouncement)

    return (
        <section
            aria-label="Latest announcements"
            aria-live="polite"
            className="border-y border-foreground/10 bg-background text-foreground"
        >
            <details className="group">
                <AnnouncementSummary announcement={summaryAnnouncement} count={list.length} meta={summaryMeta} />
                <div className="px-4 pb-5 pt-4">
                    <div className="mx-auto flex max-w-5xl flex-col gap-2 border-b border-foreground/10 pb-3 text-xs uppercase tracking-wide text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-foreground">
                            <Megaphone size={18} weight="bold" />
                            Latest announcements
                        </p>
                    </div>
                    <ul className="mx-auto mt-4 flex max-w-5xl flex-col gap-3">
                        {list.map((announcement) => (
                            <AnnouncementCard key={announcement.id ?? announcement.short} announcement={announcement} />
                        ))}
                    </ul>
                </div>
            </details>
        </section>
    )
}

/**
 * Derive display-specific data (styles, formatted dates, CTA props) for an announcement entry.
 * @param {object} announcement
 */
function getAnnouncementDisplayMeta(announcement) {
    const severityStyles = SEVERITY_STYLES[announcement.severity ?? "info"] ?? SEVERITY_STYLES.info
    const Icon = ICON_MAP[announcement.icon] ?? Megaphone
    const issuedText = announcement.issuedAt ? dateFormatter.format(announcement.issuedAt) : null
    const expiresText = announcement.expiresAt ? dateFormatter.format(announcement.expiresAt) : null
    const ctaHref = announcement.cta?.href
    const isExternal = ctaHref ? isExternalLink(ctaHref) : false
    const ctaProps = ctaHref
        ? {
            href: ctaHref,
            text: announcement.cta?.text,
            target: isExternal ? "_blank" : undefined,
            rel: isExternal ? "noopener noreferrer" : undefined
        }
        : null

    return {
        Icon,
        severityStyles,
        issuedText,
        expiresText,
        ctaProps
    }
}

/**
 * Summary row that highlights the top-priority announcement.
 * @param {{announcement: object, count: number, meta: ReturnType<typeof getAnnouncementDisplayMeta>}} props
 */
function AnnouncementSummary({ announcement, count, meta }) {
    const { Icon, severityStyles, issuedText } = meta
    return (
        <summary className="list-none border-b border-foreground/10 px-4 py-4 text-left text-sm text-foreground outline-none transition hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
            <div className="flex flex-1 items-start gap-3">
                <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${severityStyles.iconWrapper ?? "bg-foreground/10 text-foreground"}`}
                >
                    <Icon size={26} weight="bold" />
                </span>
                <div className="space-y-1">
                    <p className="text-base font-semibold">{announcement.short}</p>
                    {issuedText && (
                        <p className="text-xs uppercase tracking-wide text-foreground/60">
                            Issued {issuedText}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-wide text-foreground/60 sm:mt-0">
                <span className="group-open:hidden">
                    View {count} updates
                </span>
                <span className="hidden group-open:inline">Hide updates</span>
            </div>
        </summary>
    )
}

/**
 * Full card renderer for the announcements list.
 * @param {{announcement: object}} props
 */
function AnnouncementCard({ announcement }) {
    const { Icon, severityStyles, issuedText, expiresText, ctaProps } = getAnnouncementDisplayMeta(announcement)

    return (
        <li className={`${CARD_BASE_CLASSES} ${severityStyles.container}`}>
            <div className="flex items-start gap-3">
                <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${severityStyles.iconWrapper ?? "bg-foreground/10 text-foreground"}`}
                >
                    <Icon size={22} weight="bold" />
                </span>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold">{announcement.short}</p>
                    </div>
                    {(issuedText || expiresText) && (
                        <p className="text-xs uppercase tracking-tighter text-foreground/60">
                            {issuedText && `Issued ${issuedText}`}
                            {issuedText && expiresText && " • "}
                            {expiresText && `Thru ${expiresText}`}
                        </p>
                    )}
                    <p className="text-sm leading-relaxed text-foreground/80">
                        {announcement.long}
                    </p>
                    {ctaProps && (
                        <Link
                            href={ctaProps.href}
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent transition hover:opacity-80"
                            target={ctaProps.target}
                            rel={ctaProps.rel}
                        >
                            {ctaProps.text}
                            <ArrowUpRight size={16} weight="bold" />
                        </Link>
                    )}
                </div>
            </div>
        </li>
    )
}
