"use client"
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google"
import Action from "../action"
import { Cake, ClockAfternoon, Cloud, Copy, MapPin, Ticket } from "phosphor-react";
import clsx from "clsx";


export default function InfoStrip() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428";
    const [forecast, setForecast] = useState({ today: null, tomorrow: null });
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

    useEffect(() => {
        let isActive = true;
        async function fetchWeather() {
            try {
                const res = await fetch('/api/weather');
                if (!res.ok) throw new Error('Failed to fetch weather');
                const data = await res.json();
                const days = (data?.forecast?.forecastday ?? []).slice(0, 2);

                const toSnapshot = (day) => {
                    if (!day?.date || !day?.day) return null;
                    const high = Number(day.day.maxtemp_f);
                    const low = Number(day.day.mintemp_f);
                    const rainChance = Number(day.day.daily_chance_of_rain);
                    return {
                        date: day.date,
                        icon: day.day.condition?.icon ?? "",
                        condition: day.day.condition?.text ?? "Forecast unavailable",
                        high: Number.isFinite(high) ? Math.round(high) : null,
                        low: Number.isFinite(low) ? Math.round(low) : null,
                        rainChance: Number.isFinite(rainChance) ? rainChance : null,
                    };
                };

                if (isActive) {
                    setForecast({
                        today: days[0] ? toSnapshot(days[0]) : null,
                        tomorrow: days[1] ? toSnapshot(days[1]) : null
                    });
                    setWeatherError(null);
                }
            } catch (error) {
                console.warn("Failed to load weather data", error);
                if (isActive) setWeatherError("Unable to load weather right now.");
            } finally {
                if (isActive) setWeatherLoading(false);
            }
        }

        fetchWeather();
        return () => { isActive = false; };
    }, []);

    const items = [
        {
            id: "hours",
            title: "Hours",
            cta: { href: "#calendar", text: "Calendar" },
            content: (
                <table className="table-auto text-center border-separate border-spacing-y-3 -mt-3">
                    <thead className="text-background">
                        <tr>
                            <th></th>
                            <th>Open</th>
                            <th>Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        <HoursRow day="FRI" opens="1:00 PM" closes="6:00 PM" />
                        <HoursRow day="SAT" opens="10:00 AM" closes="6:00 PM" />
                        <HoursRow day="SUN" opens="12:00 PM" closes="6:00 PM" />
                    </tbody>
                </table>
            ),
            icon: ClockAfternoon
        },
        {
            id: "pricing-admission",
            title: "Admission",
            cta: { href: "#rates", text: "Rates" },
            content: (
                <>
                    <p className="font-satisfy text-8xl text-background mt-3">$6<span className="text-2xl tracking-wide">/person</span></p>
                    <p className="font-light tracking-wide">Children 3 and under are free</p>
                </>
            ),
            icon: Ticket
        },
        {
            id: "weather",
            title: "Weather",
            cta: null,
            content: (
                <WeatherSummary
                    loading={weatherLoading}
                    error={weatherError}
                    today={forecast.today}
                    tomorrow={forecast.tomorrow}
                />
            ),
            icon: Cloud
        },
        {
            id: "location",
            title: "Location",
            cta: { href: "/visit", text: "Visit" },
            content: (
                <>
                    <p className="font-light tracking-wide"><i>Old McDonald's<br className="block sm:hidden lg:block" /> Pumpkin Patch & Corn Maze</i></p>
                    <div className="flex flex-row items-center justify-between bg-accent/20 px-2 py-1 rounded-lg hover:underline cursor-pointer" onClick={() => navigator.clipboard.writeText(address).then(() => alert("Copied to clipboard"))}>
                        <p className="font-semibold text-left" >
                            1597 Arden Nollville Rd,<br className="block sm:hidden lg:block" /> Inwood, WV 25428
                        </p>
                        <Copy size={30} className="ml-3 text-accent" />
                    </div>
                </>
            ),
            icon: MapPin
        },
        {
            id: "opening-day",
            title: "Opening Day",
            cta: null,
            content: (
                <>
                    <p className="font-light tracking-widest text-2xl my-4">Saturday, September 28th, 2026</p>
                    <p className="font-satisfy text-6xl text-background mt-2">Save the Date!</p>
                </>
            ), //TODO: Update date yearly
            icon: Cake
        },
        
    ]
    return (
        <section className="bg-foreground py-4">
            <div className="max-w-5xl mx-auto flex flex-wrap items-stretch px-1 sm:px-2 gap-2 sm:gap-4">
                {items.map(item => (
                    <InfoItem
                        key={item.id}
                        title={item.title}
                        cta={item.cta}
                        icon={item.icon}>
                        {item.content}
                    </InfoItem>
                ))}
            </div>
        </section>
    )
}

function InfoItem({ key, title, cta, children, icon, className }) {
    const IconComponent = icon;
    return (
        <div className={clsx("relative flex flex-col flex-[1_1_260px] min-w-[240px] sm:min-w-[260px]", className, "border-2 border-background/20 bg-background/10 rounded-2xl  overflow-hidden items-center gap-2")} key={key}>
            {title &&
                <h3 className="text-background text-2xl font-bold bg-background/10 w-full text-center py-1 uppercase tracking-widest shadow-2xl z-20">{title}</h3>
            }
            {IconComponent &&
                <>
                    <IconComponent className="absolute text-background/10 z-10" style={{
                        top: "0.3rem",
                        left: "0.3rem",
                    }} size={30} aria-hidden="true" weight="bold" />
                    <IconComponent className="absolute text-background/10 z-10" style={{
                        top: "0.3rem",
                        right: "0.3rem",
                    }} size={30} aria-hidden="true" weight="bold" />
                </>
            }
            <div className="flex flex-col items-center p-1 sm:p-2 pt-1 sm:pt-4 w-full gap-2 h-full justify-between text-center text-background z-20">
                {children}
                {cta && cta.href && cta.text && (
                    <Action as="a" href={cta.href} className="uppercase tracking-wider w-full text-center max-w-md">{cta.text}</Action>
                )}
            </div>
        </div>
    )
}

function HoursRow({ day, opens, closes }) {
    return (
        <tr className="text-center my-2">
            <td className="pr-4 text-background font-bold" style={{
                fontFamily: "var(--font-geist-mono)"
            }}>{day}</td>
            <td className="bg-background/70 text-foreground py-0.5 px-3 rounded-l-lg">{opens}</td>
            <td className="bg-foreground text-background py-0.5 px-3 rounded-r-lg">{closes}</td>
        </tr>
    )
}

function WeatherSummary({ loading, error, today, tomorrow }) {
    if (error) return <p className="text-red-200 text-sm w-full">{error}</p>;
    if (loading) return <p className="text-background/80 text-sm w-full">Checking the latest forecast...</p>;

    const days = [
        today && { label: "Today", ...today },
        tomorrow && { label: "Tomorrow", ...tomorrow }
    ].filter(Boolean);

    if (!days.length) {
        return <p className="text-sm text-background/80 w-full">Weather forecast unavailable.</p>;
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {days.map(day => (
                <div key={day.date} className="flex w-full items-center justify-between gap-3 rounded-xl bg-background/15 p-2">
                    <div className="flex items-center gap-3 text-left">
                        {day.icon &&
                            <img src={day.icon} alt={day.condition} className="h-12 w-12" />
                        }
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest">{day.label}</p>
                            <p className="text-xs text-background/80">{day.condition}</p>
                        </div>
                    </div>
                    <div className="text-right text-sm">
                        {Number.isFinite(day.high) && <p className="font-semibold">High {day.high}&deg;F</p>}
                        {Number.isFinite(day.low) && <p className="text-background/80">Low {day.low}&deg;F</p>}
                        {Number.isFinite(day.rainChance) && <p className="text-xs text-background/70">{day.rainChance}% chance of rain</p>}
                    </div>
                </div>
            ))}
        </div>
    )
}
