'use client'

import { useEffect, useState } from 'react'


export default function WeekendWeather() {
    const [forecast, setForecast] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const res = await fetch('/api/weather')

                const data = await res.json()
                const days = data.forecast.forecastday
                const today = new Date().toISOString().split('T')[0]
                const todayIndex = days.findIndex(d => d.date === today)
                const dow = new Date().getDay()

                const weekendOrder = [5, 6, 0] // Fri–Sun
                let orderedDays = weekendOrder
                let orderedLabels = ['Friday', 'Saturday', 'Sunday']

                if ([5, 6, 0].includes(dow)) {
                    const i = weekendOrder.indexOf(dow)
                    orderedDays = [...weekendOrder.slice(i), ...weekendOrder.slice(0, i)]
                    orderedLabels = orderedDays.map(d => (d === dow ? 'Today' : dayName(d)))
                }

                const result = []
                for (let i = 0; result.length < 3 && i < days.length; i++) {
                    const d = new Date(days[i].date)
                    if (orderedDays.includes(d.getDay())) {
                        const label = d.getDay() === dow ? 'Today' : dayName(d.getDay())
                        if (!result.find(r => r.day === label)) {
                            result.push({
                                day: label,
                                icon: days[i].day.condition.icon,
                                condition: days[i].day.condition.text,
                                dateLabel: d.toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                }),
                            })
                        }
                    }
                }

                setForecast(result)
                setLoading(false)
            } catch (e) {
                console.error(e)
            }
        }

        fetchForecast()
    }, [])

    const dayName = d =>
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]

    if (loading)
        return <div className="text-center p-6 text-background text-lg">Loading forecast…</div>

    return (
        <section className="w-full mx-auto">
            
                <div className="flex flex-col gap-2 md:flex-row md:justify-start md:gap-2">
                    {forecast.map((day, i) => (
                        <div className='flex flex-col text-center px-4 hover:scale-105  transition-transform '>
                            <div
                                key={i}
                                className="gap-3 flex flex-row items-center text-center"
                            >
                                <div className="flex flex-col text-xl  text-background">
                                    <span className='font-semibold'>{day.day}</span>
                                    <span className="text-sm">{day.dateLabel}</span>
                                </div>
                                <img src={day.icon} alt={day.condition} className="h-14 w-14 mb-2" />
                            </div>
                            <div className="text-sm text-background">{day.condition}</div>
                        </div>
                    ))}
            </div>
        </section>
    )
}
