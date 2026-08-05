"use client"
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google"
import { Action } from "@ui/action";
import { Cake, ClockAfternoon, Cloud, Copy, ForkKnife, MapPin, PawPrint, Prohibit, Smiley, SquareLogo, Ticket, Wheelchair } from "phosphor-react";
import clsx from "clsx";
import Link from "next/link";
import { track } from '@vercel/analytics'
import { useFlags } from "@/app/FlagsContext";
import { useConfig, useConfigs } from "@/app/ConfigsContext";
import Hours from "../hours";

const OPENING_DAY_DATE = "2026-09-26T10:00:00-04:00";
const DEFAULT_CALENDAR_DATES = "20260928T100000/20260928T180000";

const formatCalendarDatesParam = (isoDate, startTime = "T100000", endTime = "T180000") => {
    if (typeof isoDate !== "string") return null;
    const [datePart] = isoDate.split("T");
    if (!datePart) return null;
    const normalizedDate = datePart.replace(/-/g, "");
    if (normalizedDate.length !== 8) return null;
    return `${normalizedDate}${startTime}/${normalizedDate}${endTime}`;
};


export default function InfoStrip() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428";
    const [forecast, setForecast] = useState({ today: null, tomorrow: null });
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);
    const { isFeatureEnabled } = useFlags();

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

    const openingDayCalendarDates = formatCalendarDatesParam(OPENING_DAY_DATE) ?? DEFAULT_CALENDAR_DATES;
    const openingDayCalendarHref = `https://calendar.google.com/calendar/r/eventedit?text=Old+McDonalds+Opening+Day&dates=${openingDayCalendarDates}&details=Come+visit+us+for+our+opening+day!+https://oldmcdonaldspumpkinpatch.com&location=Old%20McDonalds%20Pumpkin%20Patch%20%26%20Corn%20Maze%2C%201597%20Arden%20Nollville%20Rd%2C%20Inwood%2C%20WV%2025428%2C%20USA`;

    const FEATURE_CONFIG = [
        { id: "hours" },
        { id: "pricing-admission" },
        { id: "location"},
        { id: "weather", flag: "infostrip_show_weather"},
        { id: "opening-day", flag: "infostrip_show_countdown"}
    ]

    const baseItems = {
        "hours": {
            title: "Hours",
            cta: { href: "#calendar", text: "Calendar" },
            content: (
                <Hours />
            ),
            icon: ClockAfternoon
        },
        "pricing-admission": {
            title: "Admission",
            cta: { href: "#rates", text: "Rates" },
            content: (
                <>
                    <p className="font-satisfy text-4xl sm:text-8xl text-background mt-3">$6<span className="text-xl sm:text-2xl tracking-wide">/person</span></p>
                    <p className="font-light tracking-wide text-xs sm:text-base">Children 3 and under are free</p>
                </>
            ),
            icon: Ticket
        },
        "weather": {
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
        "location": {
            title: "Location",
            cta: { href: "/visit", text: "Visit" },
            content: (
                <div className="flex flex-col h-full items-center flex-wrap space-x-3 space-y-1 w-full justify-evenly">
                    <p className="font-light tracking-wide text-xs sm:text-base md:text-2xl"><i>Old McDonald&rsquo;s<br className="block sm:hidden lg:block" /> Pumpkin Patch & Corn Maze</i></p>
                    <div className="flex flex-row items-center justify-between bg-accent/20 px-2 py-1 rounded-lg hover:underline cursor-pointer" onClick={() => navigator.clipboard.writeText(address).then(() => alert("Copied to clipboard"))}>
                        <p className="font-semibold text-left text-xs sm:text-base" >
                            1597 Arden Nollville Rd,<br className="block sm:hidden lg:block" /> Inwood, WV 25428
                        </p>
                        <Copy size={30} className="ml-3 text-accent" />
                    </div>
                </div>
            ),
            icon: MapPin
        },
        "opening-day": {
            title: "Opening Day",
            cta: {
                href: openingDayCalendarHref,
                text: "Save the Date!",
                target: "_blank"
            },
            content: (
                <OpeningDayCountdown targetDate={OPENING_DAY_DATE} />
            ), //TODO: Update date yearly
            icon: Cake
        },
    }

    const items = FEATURE_CONFIG
        .filter(({ flag }) => !flag || isFeatureEnabled(flag))
        .map(({ id }) => ({ id, ...baseItems[id]}));
    return (
        <section className="bg-foreground py-4 space-y-5">
            <div className="max-w-5xl mx-auto flex flex-wrap items-stretch px-1 sm:px-2 gap-2 sm:gap-4">
                {items.map(item => (
                    <InfoItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        cta={item.cta}
                        icon={item.icon}>
                        {item.content}
                    </InfoItem>
                ))}
            </div>
            <SecondaryStrip />
        </section>
    )
}

function InfoItem({ id, title, cta, children, icon, className }) {
    const IconComponent = icon;
    return (
        <div className={clsx("relative flex flex-col",  " min-w-44 sm:min-w-65 flex-1 sm:flex-[1_1_260px]",  className, "border-2 border-background/20 bg-background/10 rounded-2xl  overflow-hidden items-center gap-2 group")} key={id}>
            {title &&
                <h3 className="text-background text-lg sm:text-2xl font-bold bg-background/20 w-full text-center py-1 uppercase tracking-widest shadow-2xl z-20">{title}</h3>
            }
            {IconComponent && (
                <div className="pointer-events-none w-full absolute flex justify-between gap-0.5 px-3 group-hover:px-4 transition-all duration-500 ease-in-out z-10" style={{
                    top: "0.15rem"
                }}>
                    <IconComponent
                        className="text-foreground group-hover:text-accent transition-all duration-500 ease-in-out"
                        size={35}
                        aria-hidden="true"
                        weight="duotone"
                    />
                    <IconComponent
                        className="text-foreground group-hover:text-accent transition-all duration-500 ease-in-out"
                        size={35}
                        aria-hidden="true"
                        weight="duotone"
                    />
                </div>
            )}
            <div className="flex flex-col items-center p-1 sm:p-2 pt-1 sm:pt-4 w-full gap-2 h-full justify-between text-center text-background z-20">
                {children}
                {cta && cta.href && cta.text && (
                    <Action as="a" href={cta.href} target={cta.target} className="text-sm sm:text-base uppercase tracking-wider w-full text-center max-w-md" onClick={() => {
                        track('infostrip-cta-click', {href: cta.href});
                    }}>{cta.text}</Action>
                )}
            </div>
        </div>
    )
}


function OpeningDayCountdown({ targetDate }) {
    const calculateTimeLeft = () => {
        const now = new Date();
        const target = new Date(targetDate);
        const difference = target - now;

        if (Number.isNaN(target.getTime()) || difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const formatDisplayDate = () => {
        const target = new Date(targetDate);
        if (Number.isNaN(target.getTime())) return "";

        return target.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const pad = (n) => String(n).padStart(2, "0");
    const displayDate = formatDisplayDate();

    const units = [
        { label: "Days", value: pad(timeLeft.days) },
        { label: "Hours", value: pad(timeLeft.hours) },
        { label: "Minutes", value: pad(timeLeft.minutes) },
        { label: "Seconds", value: pad(timeLeft.seconds) },
    ];

    return (
        <div className="flex flex-col items-center text-background w-full gap-3 my-2">
            <p className="font-light tracking-widest text-sm sm:text-2xl">{displayDate || "Date TBA"}</p>
            <div className="grid grid-cols-2 gap-2 w-full">
                {units.map((unit) => (
                    <div key={unit.label} className="bg-background/20 text-background rounded-2xl py-2 flex flex-col items-center">
                        <span className="text-lg sm:text-3xl font-bold font-['Satisfy']">{unit.value}</span>
                        <span className="text-xs uppercase tracking-widest sm:tracking-[0.3em] font-semibold">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
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


// secondary strip

function SecondaryStrip() {
    const items = [
        {
            id: "no-pets",
            topic: "Pets",
            icon: PawPrint,
            text: (
                <p>Please leave pets at home.</p>
            )
        },
        {
            id: "no-smoking",
            topic: "Smoking",
            icon: Prohibit,
            text: (
                <p>Smoking is limited to designated areas because of fire risk and the presence of children. Please follow posted signs.</p>
            )
        },
        {
            id: "handicap",
            topic: "Accessibility",
            icon: Wheelchair,
            text: (
                <p>Most areas are wheelchair accessible, but paths include grass, gravel, and uneven ground. Hayrides are not wheelchair accessible.</p>
            )
        },
        {
            id: "card-payments",
            topic: "Payment",
            icon: SquareLogo,
            text: (
                <p>We accept cash, major cards, and contactless payments.</p>
            )
        },
        {
            id: "food-vendors",
            topic: "Food",
            icon: ForkKnife,
            text: (
                <p>Food is available on-site during the season. Offerings may vary. <Link href="/vendors" className="text-accent hover:underline">See vendors</Link>.</p>
            )
        },
        {
            id: "all-ages",
            topic: "All ages",
            icon: Smiley,
            text: (
                <p>Enjoy children&apos;s activities, photo opportunities, scenic walking areas, and plenty of places to rest.</p>
            )
        }
    ]
    return (
        <div className="max-w-5xl mx-auto px-2">
            <div className="overflow-hidden rounded-2xl border border-background/20 bg-background/10">
                <h2 className="bg-background/20 px-4 py-2 text-center text-lg font-bold uppercase tracking-widest text-background sm:text-xl">
                    Know Before You Go
                </h2>
                <table className="w-full border-collapse text-left text-background">
                    <thead className="sr-only">
                        <tr>
                            <th scope="col">Topic</th>
                            <th scope="col">What to know</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <tr className="border-t border-background/15 first:border-t-0" key={item.id}>
                                    <th className="w-32 px-3 py-3 align-top font-semibold sm:w-44 sm:px-4" scope="row">
                                        <span className="flex items-center gap-2">
                                            <Icon aria-hidden="true" className="shrink-0 text-accent" size={28} weight="duotone" />
                                            <span>{item.topic}</span>
                                        </span>
                                    </th>
                                    <td className="px-3 py-3 text-sm leading-relaxed text-background/90 sm:px-4 sm:text-base">
                                        {item.text}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="border-t border-background/15 px-4 py-3 text-center">
                    <Link className="font-semibold text-accent underline underline-offset-4 hover:text-background" href="/visit">
                        Plan your first visit
                    </Link>
                </div>
            </div>
        </div>
    )
}
