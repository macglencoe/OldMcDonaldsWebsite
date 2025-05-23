export default function MenuItem({ description, price, children }) {
    return (
        <div className="flex flex-col py-4">
            <div className="flex flex-row justify-between">
                <span className="text-foreground text-xl md:text-2xl font-bold">{children}</span>
                <span className="text-accent text-xl md:text-2xl font-bold">{price}</span>
            </div>
            { description && <p>{description}</p>}
        </div>
    )
}