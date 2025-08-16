

export default function PageHeader({ children, subtitle, content }) {
    return (
        <div className="header">
            <h1>{children}</h1>
            {subtitle && <span>{subtitle}</span>}
            {content && content}
        </div>
    )
}