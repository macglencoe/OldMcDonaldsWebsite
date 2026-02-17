function toDateTimeInputValue(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
}

function fromDateTimeInput(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export default function EventEditor({ event, onChange, onDelete, possibleCategories }) {
    const handleFieldChange = (field, value) => {
        onChange({ ...event, [field]: value });
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="space-y-4 p-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Title</label>
                    <input
                        type="text"
                        value={event.title ?? ""}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        placeholder="Fall Festival"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Start date &amp; time</label>
                        <input
                            type="datetime-local"
                            value={toDateTimeInputValue(event.start)}
                            onChange={(e) => handleFieldChange("start", fromDateTimeInput(e.target.value))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">End date &amp; time</label>
                        <input
                            type="datetime-local"
                            value={toDateTimeInputValue(event.end)}
                            onChange={(e) => handleFieldChange("end", fromDateTimeInput(e.target.value))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        />
                    </div>
                </div>

                {possibleCategories?.length ? (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Category (optional)</label>
                        <select
                            value={event.category ?? ""}
                            onChange={(e) => handleFieldChange("category", e.target.value || "")}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        >
                            <option value="">No category</option>
                            {possibleCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
                {onDelete ? (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        aria-label="Delete event"
                    >
                        Delete
                    </button>
                ) : (
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">Delete disabled</span>
                )}
            </div>
        </div>
    );
}
