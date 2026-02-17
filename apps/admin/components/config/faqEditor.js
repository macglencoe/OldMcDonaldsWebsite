

export default function FAQEditor({ faq, onChange, onDelete }) {
    const handleFieldChange = (field, value) => {
        onChange({ ...faq, [field]: value })
    }

    const listToText = (value) => Array.isArray(value) ? value.join("\n") : (value ?? "")

    const handleListChange = (field, rawValue) => {
        const nextList = rawValue
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean)
        handleFieldChange(field, nextList)
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="space-y-4 p-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Question</label>
                    <input
                        type="text"
                        value={faq.question ?? ""}
                        onChange={(event) => handleFieldChange("question", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        placeholder="What are your hours?"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Answer</label>
                    <textarea
                        value={faq.answer ?? ""}
                        onChange={(event) => handleFieldChange("answer", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        rows={4}
                        placeholder="We're open seasonally during the fall..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Pages (routes)</label>
                        <textarea
                            value={listToText(faq.pages)}
                            onChange={(event) => handleListChange("pages", event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                            rows={3}
                            placeholder="/activities/pumpkin-patch"
                        />
                        <p className="text-[11px] text-gray-500">One route per line.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Keywords</label>
                        <textarea
                            value={listToText(faq.keywords)}
                            onChange={(event) => handleListChange("keywords", event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                            rows={3}
                            placeholder="hours"
                        />
                        <p className="text-[11px] text-gray-500">Use new lines or commas to separate keywords.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
                <span className="text-gray-500">Question: {faq.question?.trim() || "Required"}</span>
                {onDelete ? (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        aria-label="Delete FAQ"
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
