const hours = [
    {
        day: 'Fridays',
        open: '1:00 PM',
        close: '6:00 PM',
    },
    {
        day: 'Saturdays',
        open: '11:00 AM',
        close: '6:00 PM',
    },
    {
        day: 'Sundays',
        open: '12:00 PM',
        close: '6:00 PM',
    },
]

export default function Hours() {
    return (
        <div className="mb-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hours.map(({ day, open, close }) => (
                    <li key={day} className="bg-background/10 p-6 rounded-lg shadow hover:shadow-md transition">
                        <h2 className="text-xl font-semibold text-background/60 mb-4">{day}</h2>
                        <div className="flex flex-col gap-2 text-background">
                            <span><b>Open: </b>{open}</span>
                            <span><b>Close: </b>{close}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
