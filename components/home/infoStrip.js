"use client"
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google"
import Action from "../action"
import { Cake, ClockAfternoon, Cloud, Copy, ForkKnife, MapPin, PawPrint, Prohibit, SquareLogo, Ticket, Wheelchair } from "phosphor-react";
import clsx from "clsx";
import Link from "next/link";
import { track } from '@vercel/analytics'

const OPENING_DAY_DATE = "2026-09-28T10:00:00-04:00";
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
                <div className="flex flex-col h-full items-center flex-wrap space-x-3 space-y-1 w-full justify-evenly">
                    <p className="font-light tracking-wide md:text-2xl"><i>Old McDonald's<br className="block sm:hidden lg:block" /> Pumpkin Patch & Corn Maze</i></p>
                    <div className="flex flex-row items-center justify-between bg-accent/20 px-2 py-1 rounded-lg hover:underline cursor-pointer" onClick={() => navigator.clipboard.writeText(address).then(() => alert("Copied to clipboard"))}>
                        <p className="font-semibold text-left" >
                            1597 Arden Nollville Rd,<br className="block sm:hidden lg:block" /> Inwood, WV 25428
                        </p>
                        <Copy size={30} className="ml-3 text-accent" />
                    </div>
                </div>
            ),
            icon: MapPin
        },
        {
            id: "opening-day",
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

    ]
    return (
        <section className="bg-foreground py-4 space-y-5">
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
            <SecondaryStrip />
        </section>
    )
}

function InfoItem({ key, title, cta, children, icon, className }) {
    const IconComponent = icon;
    return (
        <div className={clsx("relative flex flex-col flex-[1_1_260px] min-w-[240px] sm:min-w-[260px]", className, "border-2 border-background/20 bg-background/10 rounded-2xl  overflow-hidden items-center gap-2 group")} key={key}>
            {title &&
                <h3 className="text-background text-2xl font-bold bg-background/20 w-full text-center py-1 uppercase tracking-widest shadow-2xl z-20">{title}</h3>
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
                        weight="light"
                    />
                </div>
            )}
            <div className="flex flex-col items-center p-1 sm:p-2 pt-1 sm:pt-4 w-full gap-2 h-full justify-between text-center text-background z-20">
                {children}
                {cta && cta.href && cta.text && (
                    <Action as="a" href={cta.href} target={cta.target} className="uppercase tracking-wider w-full text-center max-w-md" onClick={() => {
                        track('infostrip-cta-click', {href: cta.href});
                    }}>{cta.text}</Action>
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
            <p className="font-light tracking-widest text-xl sm:text-2xl">{displayDate || "Date TBA"}</p>
            <div className="grid grid-cols-2 gap-2 w-full">
                {units.map((unit) => (
                    <div key={unit.label} className="bg-background/20 text-background rounded-2xl py-2 flex flex-col items-center">
                        <span className="text-3xl font-bold font-['Satisfy']">{unit.value}</span>
                        <span className="text-xs uppercase tracking-[0.3em] font-semibold">{unit.label}</span>
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
    const [selected, setSelected] = useState(null);

    const items = [
        {
            id: "no-pets",
            content: (
                <>
                    <PawPrint size={32+16} weight="fill" className="absolute"/>
                    <Prohibit size={64+16} weight="regular" className="text-red-500 absolute"/>
                </>
            ),
            text: (
                <p>We have a strict <b>no pets</b> policy</p> //TODO: Rewrite this
            )
        },
        {
            id: "no-smoking",
            content: (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute" width="48" height="48" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,128H32a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V144A16,16,0,0,0,224,128Zm0,48H96V144H224v32ZM201,60.08c8-14.23,7.42-21.71,6.36-24.91a7.79,7.79,0,0,0-2.64-3.86,8,8,0,1,1,6.5-14.62,22.57,22.57,0,0,1,11.32,13.44c3.36,10.14.81,22.85-7.6,37.79-8,14.23-7.42,21.72-6.36,24.92a7.79,7.79,0,0,0,2.64,3.85,8,8,0,1,1-6.5,14.62,22.53,22.53,0,0,1-11.32-13.44C190.07,87.73,192.62,75,201,60.08Zm-40,0c8-14.23,7.42-21.71,6.36-24.91a7.79,7.79,0,0,0-2.64-3.86,8,8,0,1,1,6.5-14.62,22.57,22.57,0,0,1,11.32,13.44c3.36,10.14.81,22.85-7.6,37.79-8,14.23-7.42,21.72-6.36,24.92a7.79,7.79,0,0,0,2.64,3.85,8,8,0,1,1-6.5,14.62,22.53,22.53,0,0,1-11.32-13.44C150.07,87.73,152.62,75,161,60.08Z"></path></svg>
                    <Prohibit size={64+16} weight="regular" className="text-red-500 absolute"/>
                </>
            ),
            text: (
                <p><b>No smoking is allowed</b> on the farm, due to the high risk of fire in the autumn season, and children present. <br/>
                We have <b>two designated smoking areas</b>, one near the parking lot, and another near the fire pits.</p>
            )
        },
        {
            id: "handicap",
            content: (
                <div className="bg-blue-700 p-2 rounded-2xl">
                    <Wheelchair size={32+16} weight="fill" color="white" />
                    
                </div>
            ),
            text: (
                <p>The farm is <i>mostly</i> wheelchair accessible. Hayrides are not wheelchair accessible</p>
            )
        },
        {
            id: "card-payments",
            content: (
                <SquareLogo size={64} weight="duotone" />
            ),
            text: (
                <p>We accept <b>all major card providers</b>, as well as tap-to-pay with <a href="https://squareup.com/us/en" target="_blank" className="text-accent hover:underline">Square</a>.</p>
            )
        },
        {
            id: "food-vendors",
            content: (
                <ForkKnife size={32+16} weight="duotone" className="" />
            ),
            text: (
                <>
                    <p>We have <b>3</b> food vendors available on-site every weekend to make your fall day as tasty as it is fun!</p>
                    <Link href="/vendors" className="text-accent hover:underline">See More</Link>
                </>
            )
        },
        {
            id: "all-ages",
            content: (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="uppercase text-2xl font-semibold">All<br />Ages</p>
                </div>
            ),
            text: (
                <p>Our farm is the perfect place for a fall day, no matter your age. With a large playground and various fun activities, kids are sure to be entertained.<br />
                We have x amount photo ops, so bring your friends and take some pics for your insta story!<br />
                Just looking for a leisurely stroll? Enjoy our park-like grounds with a gentle flowing creek, lots of benches, and scenic views of the farm.
                </p> //TODO x amount
            )
        }
    ]
    return (
        <div className="flex flex-col gap-4 items-center max-w-5xl mx-auto px-2">
            {/* icons */}
            <div className="flex flex-row flex-wrap justify-center-safe gap-2">
                {items.map((item)=> (
                    <button 
                        className={clsx(`aspect-square h-18 md:h-20 bg-background/20 rounded-2xl outline-4
                            hover:scale-105 active:scale-95 transition-all duration-300 
                            flex items-center justify-center relative overflow-hidden text-background
                            ${selected == item.id ? 'outline-background/40' : 'outline-transparent'}
                            `
                        )}
                        onClick={() => {
                            setSelected(item.id);
                            track('infostrip-secondary-click', {key: item.id})
                        }}
                        key={item.id}
                        >
                        {item.content}
                    </button>
                ))}
            </div>
            {/* text */}
            <div className={clsx(`w-full bg-background/20 rounded-2xl overflow-hidden ${selected == null ? 'sr-only' : ''}`)}>
                {items.map((item)=> (
                    <div className={clsx(`space-y-1 text-background text-lg ${selected == item.id ? '' : 'sr-only'}`)} >
                        <h2 className="text-sm tracking-wider uppercase text-background/20 w-full px-3 py-1 pt-1.5 bg-background/10">{item.id}</h2>
                        <div className="px-4 py-2">{item.text}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
