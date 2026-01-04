function formatCurrency(value) {
    if (value === undefined || value === null || value === "") return null;
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return value;
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    } catch {
        return value;
    }
}

export default function MenuItem({ description, price, children }) {
    const formatted = formatCurrency(price);
    return (
        <div className="flex flex-col py-4">
            <div className="flex flex-row justify-between">
                <span className="text-foreground text-xl md:text-2xl font-bold">{children}</span>
                {formatted && (
                    <span className="text-accent text-xl md:text-2xl font-bold">{formatted}</span>
                )}
            </div>
            { description && <p>{description}</p>}
        </div>
    )
}
