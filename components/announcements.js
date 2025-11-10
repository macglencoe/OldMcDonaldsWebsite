"use client"
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

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "weather-closure-2025-10-18",
        short: "Closed Friday, Oct 18",
        long: "A line of heavy rain is moving through Berkeley County, so the farm will remain closed on Friday, October 18. We plan to reopen Saturday at 11 AM once the fields dry out.",
        icon: "CloudRain",
        severity: "alert",
        issued: "2025-10-15T09:00:00-04:00",
        expires: "2025-12-18T23:59:59-04:00"
    },
    {
        id: "weekend-bluegrass-2025-10-19",
        short: "Live bluegrass this Saturday",
        long: "The One Lane Road bluegrass band is playing from 2-5 PM on Saturday, October 19.",
        icon: "Megaphone",
        severity: "info",
        issued: "2025-10-15T11:30:00-04:00",
        expires: "2025-12-20T00:00:00-04:00",
        cta: {
            text: "See More",
            href: "/#one-lane-road"
        }
    }
]

const ICON_MAP = {
    CloudRain,
    CloudLightning,
    CloudSnow,
    Wind,
    Megaphone,
    Warning
}

const SEVERITY_STYLES = {
    info: {
        container: "border-foreground/15 bg-foreground text-background",
        badge: "bg-accent/10 text-accent",
        icon: "bg-accent/20 text-accent"
    },
    warning: {
        container: "border-yellow-500/40 bg-yellow-50 text-yellow-900",
        badge: "bg-yellow-100 text-yellow-900",
        icon: "bg-yellow-200 text-yellow-900"
    },
    alert: {
        container: "border-red-500/40 bg-foreground text-red-100",
        badge: "bg-red-100 text-red-900",
        icon: "bg-red-200 text-red-900"
    }
}

const SEVERITY_PRIORITY = {
    alert: 3,
    warning: 2,
    info: 1
}

const DATE_FORMAT_OPTIONS = { month: "short", day: "numeric" }

const isExternalLink = (href = "") => /^https?:\/\//i.test(href)

const parseDate = (value) => {
    if (!value) return null
    const instance = value instanceof Date ? value : new Date(value)
    return Number.isNaN(instance.getTime()) ? null : instance
}

const formatDate = (value) => {
    const date = parseDate(value)
    return date ? date.toLocaleDateString("en-US", DATE_FORMAT_OPTIONS) : null
}

export default function Announcements({ items = DEFAULT_ANNOUNCEMENTS } = {}) {
    const now = new Date()

    const activeAnnouncements = (items ?? [])
        .filter(Boolean)
        .filter((announcement) => {
            const expires = parseDate(announcement.expires)
            return !expires || expires >= now
        })
        .sort((a, b) => {
            const issuedA = parseDate(a.issued)?.getTime() ?? 0
            const issuedB = parseDate(b.issued)?.getTime() ?? 0
            return issuedB - issuedA
        })

    if (!activeAnnouncements.length) return null

    const sortedAnnouncements = [...activeAnnouncements].sort((a, b) => {
        const severityDiff =
            (SEVERITY_PRIORITY[b.severity] ?? 0) - (SEVERITY_PRIORITY[a.severity] ?? 0)
        if (severityDiff !== 0) return severityDiff
        const issuedA = parseDate(a.issued)?.getTime() ?? 0
        const issuedB = parseDate(b.issued)?.getTime() ?? 0
        return issuedB - issuedA
    })

    const summaryAnnouncement = sortedAnnouncements[0]
    const summarySeverity =
        SEVERITY_STYLES[summaryAnnouncement.severity ?? "info"] ?? SEVERITY_STYLES.info
    const SummaryIcon = ICON_MAP[summaryAnnouncement.icon] ?? Megaphone
    const summaryIssued = formatDate(summaryAnnouncement.issued)

    return (
        <section
            aria-label="Latest announcements"
            aria-live="polite"
            className="border-b border-foreground/10 bg-background text-foreground"
        >
            <details className="group">
                <summary className="flex cursor-pointer flex-col gap-3 px-4 py-4 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background/60 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-1 items-center gap-3">
                        <span
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${summarySeverity.icon}`}
                        >
                            <SummaryIcon size={26} weight="bold" />
                        </span>
                        <div>
                            <p className="text-base font-semibold">{summaryAnnouncement.short}</p>
                            {summaryIssued && (
                                <p className="text-xs uppercase tracking-wide text-foreground/70">
                                    Issued {summaryIssued}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-wide text-foreground/70 group-open:hidden">
                            View all {sortedAnnouncements.length} updates
                        </span>
                        <span className="text-xs uppercase tracking-wide text-foreground/70 hidden group-open:block">
                            Hide Updates
                        </span>
                    </div>
                </summary>
                <div className="border-t border-foreground/20 bg-background/95">
                    <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 text-sm text-foreground/90 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 font-semibold uppercase tracking-wide text-foreground">
                            <Megaphone size={18} weight="bold" />
                            Latest announcements
                        </p>
                    </div>
                    <ul className="mx-auto grid max-w-5xl gap-3 px-4 pb-4 md:grid-cols-2">
                        {sortedAnnouncements.map((announcement) => {
                            const Icon = ICON_MAP[announcement.icon] ?? Megaphone
                            const severity =
                                SEVERITY_STYLES[announcement.severity ?? "info"] ?? SEVERITY_STYLES.info
                            const issuedOn = formatDate(announcement.issued)
                            const expiresOn = formatDate(announcement.expires)
                            const key = announcement.id ?? announcement.short

                            return (
                                <li
                                    key={key}
                                    className={`group rounded-2xl border p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${severity.container}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${severity.icon}`}
                                        >
                                            <Icon size={26} weight="bold" />
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-base font-semibold">{announcement.short}</p>
                                            {(issuedOn || expiresOn) && (
                                                <p className="text-xs uppercase tracking-wide opacity-80">
                                                    {issuedOn && `Issued ${issuedOn}`}
                                                    {issuedOn && expiresOn && " • "}
                                                    {expiresOn && `Thru ${expiresOn}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed opacity-90">
                                        {announcement.long}
                                    </p>
                                    {announcement.cta?.href && (
                                        <Link
                                            href={announcement.cta.href}
                                            className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent hover:underline"
                                            target={
                                                isExternalLink(announcement.cta.href) ? "_blank" : undefined
                                            }
                                            rel={
                                                isExternalLink(announcement.cta.href)
                                                    ? "noopener noreferrer"
                                                    : undefined
                                            }
                                        >
                                            {announcement.cta.text}
                                            <ArrowUpRight size={16} weight="bold" />
                                        </Link>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </details>
        </section>
    )
}
