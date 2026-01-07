

export default function ConfigActionsBar({ title, description, buttons = [] }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            {buttons.length > 0 &&
                <div className="flex items-center gap-2">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={button.disabled}
                            onClick={button.onClick}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            }
        </div>
    )
}