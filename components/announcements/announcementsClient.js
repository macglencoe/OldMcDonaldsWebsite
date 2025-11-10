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
        long: "Heavy rain is forecasted, so the farm will remain closed on Friday, October 18. We plan to reopen Saturday at 10 AM.",
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
    },
    {
        id: "windy-2025-10-19",
        short: "High winds on Saturday",
        long: "High wind is forecasted on Saturday, October 18. We will remain open despite the wind.",
        icon: "Wind",
        severity: "warning",
        issued: "2025-10-15T11:30:00-04:00",
        expires: "2025-12-10T00:00:00-04:00"
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

const SEVERITY_PRIORITY = {
    alert: 3,
    warning: 2,
    info: 1
}

const CARD_BASE_CLASSES = "rounded-2xl border border-foreground/10 bg-background text-foreground/90 p-4 text-sm shadow-sm"

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

export default function AnnouncementsClient({ items = DEFAULT_ANNOUNCEMENTS } = {}) {
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
            className="border-y border-foreground/10 bg-background text-foreground"
        >
            <details className="group" open>
                <summary className="list-none border-b border-foreground/10 px-4 py-4 text-left text-sm text-foreground outline-none transition hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-1 items-start gap-3">
                        <span
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${summarySeverity.iconWrapper ?? "bg-foreground/10 text-foreground"}`}
                        >
                            <SummaryIcon size={26} weight="bold" />
                        </span>
                        <div className="space-y-1">
                            <p className="text-base font-semibold">{summaryAnnouncement.short}</p>
                            {summaryIssued && (
                                <p className="text-xs uppercase tracking-wide text-foreground/60">
                                    Issued {summaryIssued}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-wide text-foreground/60 sm:mt-0">
                        <span className="group-open:hidden">
                            View {sortedAnnouncements.length} updates
                        </span>
                        <span className="hidden group-open:inline">Hide updates</span>
                    </div>
                </summary>
                <div className="px-4 pb-5 pt-4">
                    <div className="mx-auto flex max-w-5xl flex-col gap-2 border-b border-foreground/10 pb-3 text-xs uppercase tracking-wide text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-foreground">
                            <Megaphone size={18} weight="bold" />
                            Latest announcements
                        </p>
                    </div>
                    <ul className="mx-auto mt-4 flex max-w-5xl flex-col gap-3">
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
                                    className={`${CARD_BASE_CLASSES} ${severity.container}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${severity.iconWrapper ?? "bg-foreground/10 text-foreground"}`}
                                        >
                                            <Icon size={22} weight="bold" />
                                        </span>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-semibold">{announcement.short}</p>
                                            </div>
                                            {(issuedOn || expiresOn) && (
                                                <p className="text-xs uppercase tracking-tighter text-foreground/60">
                                                    {issuedOn && `Issued ${issuedOn}`}
                                                    {issuedOn && expiresOn && " • "}
                                                    {expiresOn && `Thru ${expiresOn}`}
                                                </p>
                                            )}
                                            <p className="text-sm leading-relaxed text-foreground/80">
                                                {announcement.long}
                                            </p>
                                            {announcement.cta?.href && (
                                                <Link
                                                    href={announcement.cta.href}
                                                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent transition hover:opacity-80"
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
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </details>
        </section>
    )
}
