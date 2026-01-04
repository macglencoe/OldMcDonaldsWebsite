'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFlags } from '@/app/FlagsContext'



export default function FloodBanner() {
    const { getFeatureArg } = useFlags()
    const dates = useMemo(() => {
        const arg = getFeatureArg('show_flood_banner', 'dates')
        return Array.isArray(arg?.values) ? [...arg.values] : []
    }, [getFeatureArg])

    return (
        <div className="w-full bg-accent p-4 flex flex-row flex-wrap gap-4 justify-between items-center" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }}>
            <div className="flex flex-col">
                <h1 className="text-4xl md:text-6xl font-bold text-background/70 uppercase">Weather Advisory</h1>
                <p className="text-2xl md:text-3xl text-background/70">Old McDonald&apos;s hours may be affected.</p>
                <a href="https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze" target="_blank" rel="noopener noreferrer" className="text-md text-accent font-bold tracking-wider uppercase my-2 bg-foreground/70 py-1 px-2 w-fit">Stay updated on Facebook</a>
            </div>

            <div>
                <Weather dates={dates} />
            </div>

        </div>
    )
}

function Weather({ dates }) {
    const [weather, setWeather] = useState({})
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchWeather() {
            try {
                const weatherRes = await fetch('/api/weather')
                if (!weatherRes.ok) throw new Error('Failed to fetch weather')
                const weatherData = await weatherRes.json()

                const weatherMap = {}
                weatherData.forecast.forecastday.forEach(day => {
                    weatherMap[day.date] = {
                        icon: day.day.condition.icon,
                        text: day.day.condition.text
                    }
                })

                const weatherDataForDates = {}
                const convertedDates = dates.map(date => {
                    const newDate = new Date(date)
                    return newDate.toISOString().split('T')[0]
                })
                convertedDates.forEach(date => {
                    weatherDataForDates[date] = weatherMap[date]
                })

                setWeather(weatherDataForDates)
            } catch (e) {
                console.warn('Failed to load weather data', e)
                setError('Could not load weather.')
            }
        }

        fetchWeather()
    }, [dates])

    useEffect(() => {
        console.log('Weather updated', weather)
    }, [weather])

    if (error) return <p>{error}</p>
    if (!Object.keys(weather).length) return <p>Loading weather...</p>

    return (
        <div className="flex flex-row flex-wrap items-stretch gap-2">
            { weather &&
                Object.entries(weather).map(([date, data]) => (
                    data && data.icon && data.text &&
                    <div key={date} className="flex flex-col gap-2 bg-background/30 p-2 rounded-2xl items-center flex-1 text-center">
                        <span className='text-sm font-bold'>{new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        <img src={data.icon} alt={data.text} className="w-15 h-15" />
                        <span>{data.text}</span>
                    </div>
                ))
            }
        </div>
    )
}
