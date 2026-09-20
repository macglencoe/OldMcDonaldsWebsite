"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ClockAfternoon, Cloud, Copy, MapPin, PawPrint, SquareLogo, Ticket, Wheelchair } from "phosphor-react";
import { useConfig } from "@/app/ConfigsContext";
import { useFlags } from "@/app/FlagsContext";
import { usePricingConfig } from "@/hooks/usePricingConfig";
import useSiteSettings from "@/hooks/useSiteSettings";
import { formatBusinessAddress } from "@oldmc/config/site-settings";
import styles from "./visitOverview.module.css";

const FALLBACK_HOURS = {
  friday: { open: "11:00", close: "18:00" },
  saturday: { open: "11:00", close: "18:00" },
  sunday: { open: "12:00", close: "18:00" },
};
const DAY_ORDER = ["friday", "saturday", "sunday"];

function toMinutes(time) {
  if (typeof time !== "string") return null;
  const [hour, minute] = time.split(":").map(Number);
  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : null;
}

function formatTime(time) {
  const total = toMinutes(time);
  if (total === null) return null;
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function normalizeSchedule(raw) {
  const source = raw && typeof raw === "object" ? raw : FALLBACK_HOURS;
  return DAY_ORDER.map((key) => {
    const configured = source[key] || FALLBACK_HOURS[key];
    const openValue = configured.open || FALLBACK_HOURS[key].open;
    const closeValue = configured.close || FALLBACK_HOURS[key].close;
    return {
      key,
      label: `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
      open: formatTime(openValue),
      close: formatTime(closeValue),
      openMinutes: toMinutes(openValue),
      closeMinutes: toMinutes(closeValue),
    };
  });
}

function getLocalTime(now, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now).map((part) => [part.type, part.value]));
  return { day: parts.weekday?.toLowerCase(), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function getSeasonStatus(now, schedule, settings, { showCountdown, isWinter }) {
  const openingDay = new Date(settings.season.opensAt);
  const closingDay = new Date(settings.season.closesAt);
  const daysUntilOpening = Math.ceil((openingDay.getTime() - now.getTime()) / 86_400_000);

  if (isWinter || now.getTime() > closingDay.getTime()) {
    return {
      badge: "Closed for the season",
      heading: "Thanks for a wonderful fall",
      detail: "We’re getting the farm ready for the next season. We hope to welcome you back then.",
    };
  }

  if (daysUntilOpening > 0) {
    return {
      badge: "Opening soon",
      heading: "Opening",
      headingKeep: openingDay.toLocaleDateString("en-US", { timeZone: settings.season.timeZone, month: "long", day: "numeric" }),
      detail: `${settings.season.weekendCount} weekends of pumpkins, hayrides, and real farm fun are almost here.`,
      metric: daysUntilOpening,
      metricLabel: daysUntilOpening === 1 ? "day to go" : "days to go",
      isCountdown: true,
      showMetric: showCountdown,
    };
  }

  const local = getLocalTime(now, settings.season.timeZone);
  const today = schedule.find((day) => day.key === local.day);
  if (!today) return { badge: "Closed today", heading: "Open", headingKeep: "Friday through Sunday", longHeadingKeep: true, detail: "Choose the best weekend day for your visit." };
  if (local.minutes < today.openMinutes) return { badge: "Closed now", heading: "Opens today at", headingKeep: today.open, detail: `We’ll be welcoming visitors until ${today.close}.` };
  if (local.minutes >= today.closeMinutes) return { badge: "Closed for today", heading: "See you next visit", detail: "Use the weekend schedule below to plan your farm day." };
  return { badge: "Open today", heading: "Here until", headingKeep: today.close, detail: "Come on down for pumpkins, trails, animals, games, and plenty of time outside." };
}

function formatPrice(price) {
  if (typeof price?.amount !== "number") return "See pricing";
  const amount = price.amount < 1 ? `${Math.round(price.amount * 100)}¢` : `$${Number.isInteger(price.amount) ? price.amount : price.amount.toFixed(2)}`;
  return price.per ? `${amount}/${price.per}` : amount;
}

function WeatherSummary({ loading, error, today, tomorrow }) {
  if (loading) return <p className={styles.weatherMessage}>Checking the forecast…</p>;
  if (error || !today) return <p className={styles.weatherMessage}>Forecast unavailable right now.</p>;
  return (
    <div className={styles.weatherForecast}>
      {[{ label: "Today", data: today }, { label: "Tomorrow", data: tomorrow }].filter(({ data }) => data).map(({ label, data }) => (
        <div className={styles.weatherDay} key={data.date}>
          <div><strong>{label}</strong><span>{data.condition}</span></div>
          <p>{Number.isFinite(data.high) ? `${data.high}°` : "—"}<span>{Number.isFinite(data.low) ? ` / ${data.low}°` : ""}</span></p>
        </div>
      ))}
    </div>
  );
}

export default function VisitOverview() {

  /* Testing Values */
  
  const spoofedNow = null; //new Date("09/30/2026 16:00:00"); // Change this date/time to test different scenarios

  /* End Testing Values */


  const { isFeatureEnabled } = useFlags();
  const weeklyHoursConfig = useConfig("weekly-hours");
  const pricing = usePricingConfig();
  const settings = useSiteSettings();
  const showWeather = isFeatureEnabled("infostrip_show_weather");
  const showCountdown = isFeatureEnabled("infostrip_show_countdown");
  const isWinter = isFeatureEnabled("use_winter_hero");
  const schedule = useMemo(() => normalizeSchedule(weeklyHoursConfig?.raw), [weeklyHoursConfig?.raw]);
  const [now, setNow] = useState(() => new Date());
  const [forecast, setForecast] = useState({ today: null, tomorrow: null });
  const [weatherLoading, setWeatherLoading] = useState(showWeather);
  const [weatherError, setWeatherError] = useState(null);
  const [copied, setCopied] = useState(false);
  const status = getSeasonStatus(spoofedNow || now, schedule, settings, { showCountdown, isWinter });
  const address = formatBusinessAddress(settings, { oneLine: true });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showWeather) return undefined;
    let isActive = true;
    async function fetchWeather() {
      try {
        const response = await fetch("/api/weather");
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        const days = (data?.forecast?.forecastday || []).slice(0, 2);
        const snapshot = (day) => ({
          date: day?.date,
          condition: day?.day?.condition?.text || "Forecast unavailable",
          high: Number.isFinite(Number(day?.day?.maxtemp_f)) ? Math.round(Number(day.day.maxtemp_f)) : null,
          low: Number.isFinite(Number(day?.day?.mintemp_f)) ? Math.round(Number(day.day.mintemp_f)) : null,
        });
        if (isActive) {
          setForecast({ today: days[0] ? snapshot(days[0]) : null, tomorrow: days[1] ? snapshot(days[1]) : null });
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
  }, [showWeather]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const openingDate = settings.season.opensAt.slice(0, 10).replaceAll("-", "");
  const openingTime = settings.season.opensAt.slice(11, 19).replaceAll(":", "");
  const openingDayKey = new Intl.DateTimeFormat("en-US", { timeZone: settings.season.timeZone, weekday: "long" })
    .format(new Date(settings.season.opensAt)).toLowerCase();
  const openingClose = schedule.find((day) => day.key === openingDayKey)?.closeMinutes ?? 18 * 60;
  const closingTime = `${String(Math.floor(openingClose / 60)).padStart(2, "0")}${String(openingClose % 60).padStart(2, "0")}00`;
  const calendarHref = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(`${settings.business.name} Opening Day`)}&dates=${openingDate}T${openingTime}/${openingDate}T${closingTime}&ctz=${encodeURIComponent(settings.season.timeZone)}&details=${encodeURIComponent("Come visit us for our opening day!")}&location=${encodeURIComponent(address)}`;

  return (
    <section className={styles.section} aria-labelledby="visit-overview-heading">
      <div className={styles.inner}>
        <h2 id="visit-overview-heading" className={styles.srOnly}>Plan your visit</h2>

          { spoofedNow &&
            <p>Spoofing date/time to {spoofedNow.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
          }
        <div className={styles.layout}>
          <article className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <div>
                <span className={styles.statusBadge}>{status.badge}</span>
                <h3>
                  {status.heading}
                  {status.headingKeep && <> <span className={`${styles.headingKeep}${status.longHeadingKeep ? ` ${styles.longHeadingKeep}` : ""}`}>{status.headingKeep}</span></>}
                </h3>
                <p>{status.detail}</p>
              </div>
              {status.showMetric && <div className={styles.countdown} aria-label={`${status.metric} ${status.metricLabel}`}><strong>{status.metric}</strong><span>{status.metricLabel}</span></div>}
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.blockHeading}><ClockAfternoon aria-hidden="true" size={25} weight="duotone" /><h4>Weekend hours</h4></div>
              <dl className={styles.schedule}>{schedule.map((day) => <div key={day.key}><dt>{day.label}</dt><dd>{day.open}–{day.close}</dd></div>)}</dl>
            </div>

            {showWeather && <div className={styles.infoBlock}>
              <div className={styles.blockHeading}><Cloud aria-hidden="true" size={25} weight="duotone" /><h4>Farm forecast</h4></div>
              <WeatherSummary loading={weatherLoading} error={weatherError} today={forecast.today} tomorrow={forecast.tomorrow} />
            </div>}

            <div className={styles.statusActions}>
              <a href="#calendar">View full calendar <span aria-hidden="true">↓</span></a>
              {status.isCountdown && <a href={calendarHref} target="_blank" rel="noopener noreferrer">Save opening day <span aria-hidden="true">↗</span></a>}
            </div>
          </article>

          <div className={styles.supportingCards}>
            <article className={`${styles.detailCard} ${styles.admissionCard}`}>
              <Ticket aria-hidden="true" size={30} weight="duotone" />
              <p className={styles.cardLabel}>General admission</p>
              <p className={styles.admissionPrice}>{formatPrice(pricing.admission)}</p>
              <p className={styles.muted}>Children age {settings.policies.freeAdmissionMaxAge} and under are free.</p>
              <Link href="/pricing">See complete pricing <span aria-hidden="true">→</span></Link>
            </article>

            <article className={`${styles.detailCard} ${styles.locationCard}`}>
              <MapPin aria-hidden="true" size={30} weight="duotone" />
              <p className={styles.cardLabel}>{settings.business.addressLocality}, {settings.business.addressRegion}</p>
              <h3>Find your way to the farm</h3>
              <address>{settings.business.streetAddress}<br />{settings.business.addressLocality}, {settings.business.addressRegion} {settings.business.postalCode}</address>
              <div className={styles.locationActions}>
                <Link href="/visit">Get directions <span aria-hidden="true">→</span></Link>
                <button type="button" onClick={copyAddress} aria-live="polite"><Copy aria-hidden="true" size={18} /> {copied ? "Copied" : "Copy address"}</button>
              </div>
            </article>
          </div>
        </div>

        <div className={styles.quickFacts}>
          <ul>
            <li><PawPrint aria-hidden="true" size={24} weight="duotone" /><span><strong>Pets</strong>Please leave pets at home.</span></li>
            <li><SquareLogo aria-hidden="true" size={24} weight="duotone" /><span><strong>Payment</strong>Cash, cards, and contactless accepted.</span></li>
            <li><Wheelchair aria-hidden="true" size={24} weight="duotone" /><span><strong>Terrain</strong>Expect grass, gravel, and uneven paths.</span></li>
          </ul>
          <Link href="/visit">See all visitor information <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
