"use client";
import { useState } from "react";

import Layout from "@/components/layout";
import calendarData from "@/public/data/schedule.json";
import CommitPanel from "@/components/commitPanel";

export default function CalendarEditor() {
    const [calendarState, setCalendarState] = useState(calendarData);
    return (
        <Layout>
            <div className="stack">
                {calendarState.map((event, index) => (
                    <EventInput
                        key={index}
                        title={event.title}
                        startValue={event.start}
                        endValue={event.end}
                        onChange={(e) => {
                            const newEvents = [...calendarState];
                            newEvents[index][e.target.name] = e.target.value;
                            setCalendarState(newEvents);
                        }}
                    />
                ))}
            </div>
            <CommitPanel content={calendarState} filePath="public/data/schedule.json" title="Update calendar" />
        </Layout>
    )
}

function EventInput({ title, startValue, endValue, onChange }) {
    return (
        <div className="card">
            <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="field">
                    <label className="label">Title</label>
                    <input className="input" type="text" name="title" value={title} onChange={onChange}/>
                </div>
                <div className="field">
                    <label className="label">Start</label>
                    <input className="input" type="datetime-local" name="start" value={startValue} onChange={onChange}/>
                </div>
                <div className="field">
                    <label className="label">End</label>
                    <input className="input" type="datetime-local" name="end" value={endValue} onChange={onChange}/>
                </div>
            </div>
        </div>
    )
}
