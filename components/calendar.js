"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from "react"

export default function FestivalCalendar() {
  const [events, setEvents] = useState([])
  // Weather
  const [weatherByDate, setWeatherByDate] = useState({})

  useEffect(() => {
    async function loadData() {
      const [eventRes, scheduleRes] = await Promise.all([
        fetch('/data/events.json'),
        fetch('/data/schedule.json')
      ])
      const [eventData, scheduleData] = await Promise.all([
        eventRes.json(),
        scheduleRes.json()
      ])

      const taggedEvents = eventData.map(e => ({
        ...e,
        category: e.category === undefined ? 'event' : e.category
      }))
      const taggedSchedule = scheduleData.map(e => ({
        ...e,
        category: e.category === undefined ? 'schedule' : e.category
      }))

      const combined = [...taggedEvents, ...taggedSchedule].map(e => ({
        ...e,
        color:
          e.category === 'event' ? 'var(--accent)' :
            e.category === 'schedule' ? 'var(--foreground)' :
              '#6b7280' // gray fallback
      }))

      setEvents(combined)
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
      setWeatherByDate(weatherMap)
      } catch (e) {
        console.warn("Failed to load weather data", e)
      }
    }

    loadData()
  }, [])


  return (
    <div className="overflow-x-scroll w-full min-w-300px p-4 bg-background text-foreground">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialDate={"2025-10-01"}
        events={events}
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
          }
        }}
        dayCellContent={(arg) => {
          const day = arg.date.toISOString().split('T')[0]
          const weather = weatherByDate[day]
          console.log(day, weather)
          if(!weather) return arg.dayNumberText

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
    </div>
  )
}