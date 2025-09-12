"use client";
import { useState } from "react";

import Layout from "@/components/layout";
import calendarData from "@/public/data/schedule.json";
import CommitPanel from "@/components/commitPanel";

export default function CalendarEditor() {
    const [calendarState, setCalendarState] = useState(calendarData);
    return (
        <Layout>
            {
                calendarState.map((event, index) => {
                    return (
                        <div key={index} className="p-4 flex flex-col gap-2">
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
                        </div>
                    )
                })
            }
            <CommitPanel content={calendarState} filePath="public/data/schedule.json" title="Update calendar" />
        </Layout>
    )
}

function EventInput({ title, startValue, endValue, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <input type="text" name="title" value={title} onChange={onChange}/>
            <input type="datetime-local" name="start" value={startValue} onChange={onChange}/>
            <input type="datetime-local" name="end" value={endValue} onChange={onChange}/>
        </div>
    )
}
