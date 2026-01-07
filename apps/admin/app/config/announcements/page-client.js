"use client"

import AnnouncementEditor from "@/components/config/announcementEditor"
import PreviewDivider from "@/components/config/previewDivider"
import { AnnouncementsView } from "@public-ui/announcementsView"
import { useMemo, useRef, useState } from "react"

function cloneItems(items) {
    return JSON.parse(JSON.stringify(items ?? []))
}

export default function AnnouncementsPageClient({ announcements }) {
    const originalItemsRef = useRef(cloneItems(announcements))
    const [items, setItems] = useState(() => cloneItems(announcements))
    const [selectedIndex, setSelectedIndex] = useState(() => (announcements?.length ? 0 : null))
    const [saveState, setSaveState] = useState({ status: "idle", message: "" })

    const hasChanges = useMemo(() => {
        return JSON.stringify(items) !== JSON.stringify(originalItemsRef.current)
    }, [items])

    const validationErrors = useMemo(() => {
        const errors = []
        const ids = new Set()
        items.forEach((item, idx) => {
            if (!item.id?.trim()) errors.push(`Announcement ${idx + 1} is missing an id`)
            if (!item.short?.trim()) errors.push(`Announcement ${idx + 1} is missing a title`)
            if (!item.long?.trim()) errors.push(`Announcement ${idx + 1} is missing a description`)
            if (item.id) {
                if (ids.has(item.id)) errors.push(`Duplicate id "${item.id}"`)
                ids.add(item.id)
            }
        })
        return errors
    }, [items])

    const handleAnnouncementChange = (index, nextAnnouncement) => {
        setItems((current) => current.map((item, i) => i === index ? nextAnnouncement : item))
    }

    const handleAnnouncementDelete = (index) => {
        setItems((current) => {
            const next = current.filter((_, i) => i !== index)
            setSelectedIndex((prev) => {
                if (next.length === 0) return null
                if (prev === null) return 0
                if (prev === index) return Math.min(index, next.length - 1)
                if (prev > index) return prev - 1
                return prev
            })
            return next
        })
    }

    const handleResetAll = () => {
        setItems(cloneItems(originalItemsRef.current))
        setSelectedIndex(originalItemsRef.current.length ? 0 : null)
    }

    const handleAddAnnouncement = () => {
        setItems((current) => {
            const next = [
                ...current,
                {
                    id: "",
                    short: "",
                    long: "",
                    icon: "Megaphone",
                    severity: "info",
                    issued: new Date().toISOString(),
                    expires: null,
                    cta: { text: "", href: "" }
                }
            ]
            setSelectedIndex(next.length - 1)
            return next
        })
    }

    const formatDate = (iso) => {
        if (!iso) return "Not set"
        const date = new Date(iso)
        if (Number.isNaN(date.getTime())) return "Invalid date"
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    }

    const isExpired = (iso) => {
        if (!iso) return false
        const date = new Date(iso)
        return !Number.isNaN(date.getTime()) && date.getTime() < Date.now()
    }

    const sanitizedItems = () => {
        return items.map((item) => {
            const next = { ...item }
            const hasCta = item.cta && (item.cta.text?.trim() || item.cta.href?.trim())
            if (!hasCta) {
                delete next.cta
            } else {
                next.cta = {
                    text: item.cta.text ?? "",
                    href: item.cta.href ?? "",
                }
            }
            return next
        })
    }

    const handleSave = async () => {
        setSaveState({ status: "saving", message: "" })
        try {
            const response = await fetch("/api/config?key=announcements", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: sanitizedItems() }),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.error || `Save failed with status ${response.status}`)
            }
            const data = await response.json()
            originalItemsRef.current = cloneItems(data.value?.items ?? items)
            setItems(cloneItems(data.value?.items ?? items))
            setSaveState({ status: "success", message: "Saved" })
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save"
            setSaveState({ status: "error", message })
        } finally {
            setTimeout(() => setSaveState({ status: "idle", message: "" }), 2000)
        }
    }

    return (
        <div className="space-y-5 p-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
                    <p className="text-sm text-gray-600">Edit copy, icons, and severity. Changes update immediately.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={validationErrors.length > 0 || !hasChanges || saveState.status === "saving"}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saveState.status === "saving" ? "Saving..." : "Save changes"}
                    </button>
                    <button
                        type="button"
                        onClick={handleAddAnnouncement}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Add announcement
                    </button>
                    <button
                        type="button"
                        onClick={handleResetAll}
                        disabled={!hasChanges}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Revert to original
                    </button>
                </div>
            </div>
            {(saveState.status === "error" || validationErrors.length > 0 || saveState.status === "success") && (
                <div className="text-xs">
                    {validationErrors.length > 0 && (
                        <p className="text-red-600">Fix before saving: {validationErrors[0]}</p>
                    )}
                    {saveState.status === "error" && (
                        <p className="text-red-600">Save failed: {saveState.message}</p>
                    )}
                    {saveState.status === "success" && (
                        <p className="text-green-600">Saved</p>
                    )}
                </div>
            )}

            <div className="grid gap-2 md:grid-cols-[320px_minmax(0,1fr)]">
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                        Announcements ({items.length})
                    </div>
                    {items.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-gray-500">No announcements found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {items.map((announcement, index) => {
                                const selected = index === selectedIndex
                                const expired = isExpired(announcement.expires)
                                return (
                                    <li key={announcement.id ?? index}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedIndex(index)}
                                            className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${selected ? "bg-accent/10" : "hover:bg-gray-50"}`}
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {announcement.short?.trim() || "Untitled"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Issued {formatDate(announcement.issued)} - Expires {announcement.expires ? formatDate(announcement.expires) : "No expiry"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 text-xs">
                                                <span className={`rounded-full px-2 py-0.5 font-medium ${announcement.severity === "alert" ? "bg-red-100 text-red-700" : announcement.severity === "warning" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {announcement.severity ?? "info"}
                                                </span>
                                                {expired && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] text-gray-700">Expired</span>}
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                <div className="">
                    {selectedIndex === null ? (
                        <p className="text-sm text-gray-500">Select an announcement to edit.</p>
                    ) : (
                        <AnnouncementEditor
                            announcement={items[selectedIndex]}
                            onChange={(updated) => handleAnnouncementChange(selectedIndex, updated)}
                            onDelete={() => handleAnnouncementDelete(selectedIndex)}
                        />
                    )}
                </div>
            </div>
            <PreviewDivider />
            <AnnouncementsView items={items} />
        </div>
    )
}
