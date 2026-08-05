"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useMemo, useState } from "react"

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render"
const SCHEDULE_EVENT_TITLE = "Old McDonald's"
const NIGHT_MAZE_EVENT_TITLE = "Night Maze at Old McDonald's"

function formatDateForGoogleCalendar(date, isAllDay) {
  if (!date) return ""
  const parsedDate = date instanceof Date ? date : new Date(date)
  if (isAllDay) return parsedDate.toISOString().slice(0, 10).replace(/-/g, "")
  return parsedDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function getEventEndDate(event) {
  if (event.end) return event.end
  if (event.allDay && event.start) {
    const nextDay = new Date(event.start)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
  }
  return event.start
}

function buildGoogleCalendarUrl(event) {
  if (!event?.start) return null

  const url = new URL(GOOGLE_CALENDAR_URL)
  url.searchParams.set("action", "TEMPLATE")

  const category = event.extendedProps?.category ?? event.category
  const title = category === "schedule"
    ? SCHEDULE_EVENT_TITLE
    : category === "night-maze"
      ? NIGHT_MAZE_EVENT_TITLE
      : (event.title || SCHEDULE_EVENT_TITLE)
  url.searchParams.set("text", title)

  const start = formatDateForGoogleCalendar(event.start, event.allDay)
  const end = formatDateForGoogleCalendar(getEventEndDate(event), event.allDay)
  if (start && end) url.searchParams.set("dates", `${start}/${end}`)

  const description = event.extendedProps?.description
    ?? event.extendedProps?.details
    ?? event.description
    ?? event.details
  if (description) url.searchParams.set("details", description)

  url.searchParams.set(
    "location",
    "Old McDonalds Pumpkin Patch & Corn Maze, 1597 Arden Nollville Rd, Inwood, WV 25428, USA"
  )

  return url.toString()
}

function dateKey(date) {
  if (!date) return ""
  const parsedDate = date instanceof Date ? date : new Date(date)
  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
  const day = String(parsedDate.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatEventTime(event) {
  const start = event.start ? new Date(event.start) : null
  const end = event.end ? new Date(event.end) : null
  const formatTime = (date) => date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  }).toLowerCase()

  if (!start) return ""
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start)
}

function eventColor(event) {
  const category = event.extendedProps?.category ?? event.category
  if (category === "event") return "var(--accent)"
  if (category === "night-maze") return "var(--nightMazeBackground)"
  return "var(--foreground)"
}

export function FestivalCalendar({
  scheduleConfig,
  scheduleArray,
  initialDateConfig,
  initialDateString,
  bgSrc
}) {
  const [weatherByDate, setWeatherByDate] = useState({})

  const events = useMemo(() => {
    const entries = Array.isArray(scheduleArray)
      ? scheduleArray
      : Array.isArray(scheduleConfig?.values)
        ? scheduleConfig.values
        : Array.isArray(scheduleConfig?.raw)
          ? scheduleConfig.raw
          : []

    return entries
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => {
        const category = entry.category === undefined ? "schedule" : entry.category
        return {
          ...entry,
          category,
          color: eventColor({ category })
        }
      })
  }, [scheduleArray, scheduleConfig])

  const initialDate = useMemo(() => {
    if (typeof initialDateString === "string") return initialDateString
    if (typeof initialDateConfig?.raw === "string") return initialDateConfig.raw
    return null
  }, [initialDateConfig, initialDateString])

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (!selectedDate && initialDate) setSelectedDate(initialDate.slice(0, 10))
  }, [initialDate, selectedDate])

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return []
    return events
      .filter((event) => dateKey(event.start) === selectedDate)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
  }, [events, selectedDate])

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return "Select a date"
    const [year, month, day] = selectedDate.split("-").map(Number)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(year, month - 1, day))
  }, [selectedDate])

  useEffect(() => {
    let didCancel = false

    async function loadWeather() {
      try {
        const weatherRes = await fetch("/api/weather")
        const weatherData = await weatherRes.json()
        const weatherMap = {}
        weatherData.forecast.forecastday.forEach((day) => {
          weatherMap[day.date] = {
            icon: day.day.condition.icon,
            text: day.day.condition.text
          }
        })
        if (!didCancel) setWeatherByDate(weatherMap)
      } catch (error) {
        console.warn("Failed to load weather data", error)
      }
    }

    loadWeather()
    return () => { didCancel = true }
  }, [])

  return (
    <section
      className="text-center bg-background relative bg-cover bg-center"
      id="calendar"
      style={{ backgroundImage: `url(${bgSrc})` }}
    >
      <div className="standard-backdrop py-7">
        <div className="max-w-6xl mx-auto overflow-hidden w-full p-4 z-20 backdrop-blur-xl bg-foreground/20 text-background rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-4 items-start text-left">
            <div className="min-w-0 festival-calendar-grid">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "today"
                }}
                initialDate={initialDate}
                events={events}
                fixedWeekCount={false}
                dayMaxEvents={4}
                dateClick={(info) => setSelectedDate(info.dateStr.slice(0, 10))}
                eventClick={(info) => {
                  info.jsEvent?.preventDefault()
                  setSelectedDate(dateKey(info.event.start))
                }}
                eventContent={(arg) => (
                  <span
                    className="festival-calendar-dot"
                    style={{ backgroundColor: eventColor(arg.event) }}
                    aria-hidden="true"
                  />
                )}
                eventDidMount={(info) => {
                  const label = `${info.event.title}. Select this date for details.`
                  info.el.title = label
                  info.el.setAttribute("aria-label", label)
                }}
                dayCellClassNames={(arg) => dateKey(arg.date) === selectedDate ? ["is-selected"] : []}
                dayCellContent={(arg) => {
                  const weather = weatherByDate[dateKey(arg.date)]
                  if (!weather) return arg.dayNumberText
                  return (
                    <span className="festival-calendar-day-label">
                      <span>{arg.dayNumberText}</span>
                      <img src={weather.icon} title={weather.text} alt={weather.text} />
                    </span>
                  )
                }}
              />
            </div>

            <aside className="calendar-detail-panel" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-background/70">Selected date</p>
              <h3 className="text-xl font-bold mt-1">{selectedDateLabel}</h3>

              <div className="mt-4 space-y-3">
                {selectedEvents.length > 0 ? selectedEvents.map((event, index) => (
                  <button
                    type="button"
                    key={`${event.start}-${event.title}-${index}`}
                    className="calendar-detail-event"
                    style={{ borderLeftColor: eventColor(event) }}
                    onClick={() => {
                      const calendarUrl = buildGoogleCalendarUrl(event)
                      if (calendarUrl) window.open(calendarUrl, "_blank", "noopener,noreferrer")
                    }}
                  >
                    <span className="block font-bold">{event.title}</span>
                    <span className="block text-sm mt-1 text-background/80">{formatEventTime(event)}</span>
                    <span className="calendar-detail-action">Add to Google Calendar ↗</span>
                  </button>
                )) : (
                  <p className="calendar-detail-empty">No scheduled events for this date.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
