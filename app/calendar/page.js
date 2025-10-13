"use client";
import { useEffect, useState } from "react";

import Layout from "@/components/layout";
import calendarData from "@/public/data/schedule.json";
import CommitPanel from "@/components/commitPanel";

const CALENDAR_PATH = "public/data/schedule.json";

function encodePath(path) {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

export default function CalendarEditor() {
    const [calendarState, setCalendarState] = useState(calendarData);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [remoteError, setRemoteError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchRemoteCalendar() {
            setLoadingRemote(true);
            setRemoteError(null);
            try {
                const res = await fetch(`/api/blob/${encodePath(CALENDAR_PATH)}`);
                if (res.status === 404) {
                    return;
                }
                if (!res.ok) throw new Error(`Failed to fetch calendar (${res.status})`);
                const payload = await res.json();
                let remote = null;
                if (Array.isArray(payload?.content)) {
                    remote = payload.content;
                } else if (typeof payload?.content === "string") {
                    try {
                        remote = JSON.parse(payload.content);
                    } catch (error) {
                        console.warn("Remote calendar payload is not valid JSON", error);
                    }
                }
                if (!cancelled && Array.isArray(remote)) {
                    setCalendarState(remote);
                }
            } catch (error) {
                console.error("Failed to load calendar from blob", error);
                if (!cancelled) setRemoteError(error.message || "Failed to load calendar");
            } finally {
                if (!cancelled) setLoadingRemote(false);
            }
        }
        fetchRemoteCalendar();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Layout>
            {loadingRemote && (
                <p className="px-4 text-sm text-foreground/60">Loading latest calendar…</p>
            )}
            {remoteError && (
                <p className="px-4 text-sm text-red-600">{remoteError}</p>
            )}
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
            <CommitPanel content={calendarState} filePath={CALENDAR_PATH} title="Update calendar" />
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
