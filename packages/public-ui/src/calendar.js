"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useMemo, useState } from "react"

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/render'
const SCHEDULE_EVENT_TITLE = "Old McDonald's"
const NIGHT_MAZE_EVENT_TITLE = "Night Maze at Old McDonald's"

function formatDateForGoogleCalendar(date, isAllDay) {
  if (!date) return ''
  if (isAllDay) {
    return date.toISOString().slice(0, 10).replace(/-/g, '')
  }
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
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
  url.searchParams.set('action', 'TEMPLATE')

  const category = event.extendedProps?.category
  const title = category === 'schedule'
    ? SCHEDULE_EVENT_TITLE
    : category === 'night-maze'
    ? NIGHT_MAZE_EVENT_TITLE
    : (event.title || SCHEDULE_EVENT_TITLE)
  url.searchParams.set('text', title)

  const start = formatDateForGoogleCalendar(event.start, event.allDay)
  const end = formatDateForGoogleCalendar(getEventEndDate(event), event.allDay)
  if (start && end) {
    url.searchParams.set('dates', `${start}/${end}`)
  }

  const description = event.extendedProps?.description ?? event.extendedProps?.details
  if (description) {
    url.searchParams.set('details', description)
  }

    url.searchParams.set('location', 'Old McDonalds Pumpkin Patch & Corn Maze, 1597 Arden Nollville Rd, Inwood, WV 25428, USA')

  return url.toString()
}

export function FestivalCalendar({
  scheduleConfig, initialDateConfig,
  bgSrc
}) {
  // Weather
  const [weatherByDate, setWeatherByDate] = useState({})

  const events = useMemo(() => {
    const entries = Array.isArray(scheduleConfig?.values)
      ? scheduleConfig.values
      : Array.isArray(scheduleConfig?.raw)
        ? scheduleConfig.raw
        : []

    return entries
      .filter((entry) => entry && typeof entry === 'object')
      .map((entry) => {
        const category = entry.category === undefined ? 'schedule' : entry.category
        return {
          ...entry,
          category,
          color:
            category === 'event'
              ? 'var(--accent)'
              : category === 'schedule'
                ? 'var(--foreground)'
                : '#6b7280'
        }
      })
  }, [scheduleConfig])

  const initialDate = useMemo(() => {
    if (typeof initialDateConfig?.raw === 'string') {
      return initialDateConfig.raw
    }
    else return null
  }, [initialDateConfig])

  useEffect(() => {
    let didCancel = false

    async function loadWeather() {
      try {
        const weatherRes = await fetch('/api/weather')
        const weatherData = await weatherRes.json()
        const weatherMap = {}
        weatherData.forecast.forecastday.forEach(day => {
          weatherMap[day.date] = {
            icon: day.day.condition.icon,
            text: day.day.condition.text
          }
        })
        if (!didCancel) {
          setWeatherByDate(weatherMap)
        }
      } catch (e) {
        console.warn("Failed to load weather data", e)
      }
    }

    loadWeather()

    return () => {
      didCancel = true
    }
  }, [])


  return (
    <section className="text-center bg-background relative bg-cover bg-center" id="calendar" style={{ backgroundImage: `url(${bgSrc})` }}>
      <div className="standard-backdrop py-7">
        <div>
          <p className="md:hidden text-background py-4">If you're on mobile, you can scroll left and right to see the full calendar <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="var(--background)" viewBox="0 0 256 256" className="inline-block"><path d="M216,140v36c0,25.59-8.49,42.85-8.85,43.58A8,8,0,0,1,200,224a7.9,7.9,0,0,1-3.57-.85,8,8,0,0,1-3.58-10.73c.06-.12,7.16-14.81,7.16-36.42V140a12,12,0,0,0-24,0v4a8,8,0,0,1-16,0V124a12,12,0,0,0-24,0v12a8,8,0,0,1-16,0V68a12,12,0,0,0-24,0V176a8,8,0,0,1-14.79,4.23l-18.68-30-.14-.23A12,12,0,1,0,41.6,162L70.89,212A8,8,0,1,1,57.08,220l-29.32-50a28,28,0,0,1,48.41-28.17L80,148V68a28,28,0,0,1,56,0V98.7a28,28,0,0,1,38.65,16.69A28,28,0,0,1,216,140Zm32-92H195.31l18.34-18.34a8,8,0,0,0-11.31-11.32l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.31-11.32L195.31,64H248a8,8,0,0,0,0-16Z"></path></svg></p>
        </div>
  
        <div className="max-w-5xl mx-auto overflow-x-scroll w-full min-w-300px p-4 z-20 backdrop-blur-xl bg-foreground/20 no-scrollbar text-background rounded-2xl">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialDate={initialDate}
            events={events}
            eventClick={(info) => {
              info.jsEvent?.preventDefault()
              const calendarUrl = buildGoogleCalendarUrl(info.event)
              if (calendarUrl) {
                window.open(calendarUrl, '_blank', 'noopener,noreferrer')
              }
            }}
            eventContent={(arg) => {
              const start = arg.event.start;
              const end = arg.event.end;
  
              const formatTime = (date) =>
                date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  
              const timeRange = start && end ? `${formatTime(start)} - ${formatTime(end)}` : '';
  
              const wrapper = document.createElement('div');
              wrapper.style.whiteSpace = 'normal';
              wrapper.style.wordBreak = 'break-word';
              wrapper.style.lineHeight = '1.2';
              wrapper.style.padding = '2px 2px';
              wrapper.innerHTML = `<strong>${timeRange}</strong><br/>${arg.event.title}`;
  
              return { domNodes: [wrapper] };
            }}
            eventDidMount={info => {
              // info.el is the <a> wrapper for that event in month‐view
              const cat = info.event.extendedProps.category;
              if (cat === 'schedule') {
                info.el.style.backgroundColor = 'var(--foreground)';
                info.el.style.color = 'white';
              } else if (cat === 'night-maze') {
                info.el.style.backgroundColor = 'var(--nightMazeBackground)';
                info.el.style.color = 'white';
              } else if (cat == 'event') {
                info.el.style.backgroundColor = 'var(--accent)';
                info.el.style.color = 'white'
              }
            }}
            dayCellContent={(arg) => {
              const day = arg.date.toISOString().split('T')[0]
              const weather = weatherByDate[day]
              if (!weather) return arg.dayNumberText
  
              const el = document.createElement('div');
              el.style.display = 'flex';
              el.style.flexDirection = 'row-reverse';
              el.style.alignItems = 'center';
              el.style.justifyContent = 'center';
              el.innerHTML = `
              <span>${arg.dayNumberText}</span>
              <img src="${weather.icon}" title="${weather.text}" style="width: 32px; height: 32px;" />
              `
              return {
                domNodes: [el]
              }
            }}
            
  
          />
          <p className="mt-4">Click any event to add it to your Google Calendar</p>
        </div>
      </div>
    </section>
  )
}
