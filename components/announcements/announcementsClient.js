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

export default function AnnouncementsClient({ items } = {}) {
    const { summary, list } = useMemo(() => {
        const now = new Date()
        const prepared = (items ?? [])
            .filter(Boolean)
            .map((announcement) => {
                const issuedDate = parseDate(announcement.issued)
                const expiresDate = parseDate(announcement.expires)
                return {
                    ...announcement,
                    issuedDate,
                    expiresDate,
                    issuedTimestamp: issuedDate?.getTime() ?? 0
                }
            })
            .filter((announcement) => !announcement.expiresDate || announcement.expiresDate >= now)

        prepared.sort((a, b) => {
            const severityDiff =
                (SEVERITY_PRIORITY[b.severity] ?? 0) - (SEVERITY_PRIORITY[a.severity] ?? 0)
            if (severityDiff !== 0) return severityDiff
            return (b.issuedTimestamp ?? 0) - (a.issuedTimestamp ?? 0)
        })

        return {
            list: prepared,
            summary: prepared[0] ?? null
        }
    }, [items])

    if (!list.length || !summary) return null

    const summaryAnnouncement = summary
    const summarySeverity =
        SEVERITY_STYLES[summaryAnnouncement.severity ?? "info"] ?? SEVERITY_STYLES.info
    const SummaryIcon = ICON_MAP[summaryAnnouncement.icon] ?? Megaphone
    const summaryIssued = formatDate(summaryAnnouncement.issuedDate ?? summaryAnnouncement.issued)

    return (
        <section
            aria-label="Latest announcements"
            aria-live="polite"
            className="border-y border-foreground/10 bg-background text-foreground"
        >
            <details className="group">
                <summary className="list-none border-b border-foreground/10 px-4 py-4 text-left text-sm text-foreground outline-none transition hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
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
                            View {list.length} updates
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
                        {list.map((announcement) => {
                            const Icon = ICON_MAP[announcement.icon] ?? Megaphone
                            const severity =
                                SEVERITY_STYLES[announcement.severity ?? "info"] ?? SEVERITY_STYLES.info
                            const issuedOn = formatDate(announcement.issuedDate ?? announcement.issued)
                            const expiresOn = formatDate(announcement.expiresDate ?? announcement.expires)
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
