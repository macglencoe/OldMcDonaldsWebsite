

import {
    CloudLightning,
    CloudRain,
    CloudSnow,
    Megaphone,
    Warning,
    Wind
} from "phosphor-react"

const ICON_OPTIONS = [
    { value: "Megaphone", label: "Megaphone" },
    { value: "CloudRain", label: "Rain" },
    { value: "CloudLightning", label: "Lightning" },
    { value: "CloudSnow", label: "Snow" },
    { value: "Wind", label: "Wind" },
    { value: "Warning", label: "Warning" },
]

const ICON_MAP = {
    CloudLightning,
    CloudRain,
    CloudSnow,
    Megaphone,
    Warning,
    Wind,
}

const SEVERITY_OPTIONS = [
    { value: "info", label: "Info", swatch: "bg-amber-400" },
    { value: "warning", label: "Warning", swatch: "bg-orange-500" },
    { value: "alert", label: "Alert", swatch: "bg-red-500" },
]

function toDateInputValue(isoString) {
    if (!isoString) return ""
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().slice(0, 10)
}

function formatIssued(isoString) {
    if (!isoString) return "Not set"
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return "Not set"
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

export default function AnnouncementEditor({ announcement, onChange, onDelete }) {
    const Icon = ICON_MAP[announcement.icon] ?? Megaphone

    const handleFieldChange = (field, value) => {
        onChange({ ...announcement, [field]: value })
    }

    const handleExpiryChange = (value) => {
        const next = value ? new Date(`${value}T00:00:00`).toISOString() : null
        handleFieldChange("expires", next)
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-start gap-4 p-4">
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">ID (required)</label>
                            <input
                                type="text"
                                required
                                value={announcement.id ?? ""}
                                onChange={(event) => handleFieldChange("id", event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                                placeholder="example-title"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Title</label>
                            <input
                                type="text"
                                value={announcement.short ?? ""}
                                onChange={(event) => handleFieldChange("short", event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                                placeholder="Example Title"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Description</label>
                        <textarea
                            value={announcement.long ?? ""}
                            onChange={(event) => handleFieldChange("long", event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                            rows={3}
                            placeholder="Example Description"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Expiry</label>
                            <input
                                type="date"
                                value={toDateInputValue(announcement.expires)}
                                onChange={(event) => handleExpiryChange(event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Icon</label>
                            <div className="flex items-center gap-3 rounded-md border border-gray-300 px-3 py-2">
                                <select
                                    value={announcement.icon ?? "Megaphone"}
                                    onChange={(event) => handleFieldChange("icon", event.target.value)}
                                    className="flex-1 bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                                >
                                    {ICON_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <Icon className="h-6 w-6 text-gray-500" weight="duotone" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Severity</label>
                            <div className="flex items-center gap-3 rounded-md border border-gray-300 px-3 py-2">
                                <select
                                    value={announcement.severity ?? "info"}
                                    onChange={(event) => handleFieldChange("severity", event.target.value)}
                                    className="flex-1 bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                                >
                                    {SEVERITY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {(() => {
                                    const selected = SEVERITY_OPTIONS.find((option) => option.value === announcement.severity) ?? SEVERITY_OPTIONS[0]
                                    return <span className={`h-4 w-4 rounded-full ${selected.swatch}`} aria-hidden />
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
                <div className="space-x-3">
                    <span>Issued: {formatIssued(announcement.issued)}</span>
                    <span className="text-gray-400">id: {announcement.id?.trim() || "required"}</span>
                </div>
                {onDelete ? (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        aria-label="Delete announcement"
                    >
                        Delete
                    </button>
                ) : (
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">Post disabled</span>
                )}
            </div>
        </div>
    )
}
