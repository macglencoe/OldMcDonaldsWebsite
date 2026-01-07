

export default function ConfigSplitListEditor({
    title,
    items,
    selectedIndex,
    onSelect,
    renderRow,
    renderEmpty,
    rightContent,
    getKey = (_, idx) => idx,
}) {
    return (
        <div className="grid gap-2 md:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    {title} ({items.length})
                </div>
                {items.length === 0 ? (
                    renderEmpty ?? <p className="px-4 py-6 text-center text-sm text-gray-500">No items found.</p>
                ): (
                    <ul className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                        {items.map((item, index) => (
                            <li key={getKey(item, index)}>
                                {renderRow({
                                    item,
                                    index,
                                    selected: index === selectedIndex,
                                    onSelect: () => onSelect(index),
                                })
                                }
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {rightContent ?? null}
        </div>
    )
}