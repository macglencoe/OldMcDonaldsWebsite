"use client";

import Layout from '@/components/layout';
import hoursData from '@/public/data/hours.json';
import { useEffect, useState } from 'react';
import CommitPanel from "@/components/commitPanel";

const HOURS_PATH = "public/data/hours.json";

function encodePath(path) {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

export default function HoursPage() {
    const [hoursState, setHoursState] = useState(hoursData);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [remoteError, setRemoteError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchRemoteHours() {
            setLoadingRemote(true);
            setRemoteError(null);
            try {
                const res = await fetch(`/api/blob/${encodePath(HOURS_PATH)}`);
                if (res.status === 404) {
                    return;
                }
                if (!res.ok) throw new Error(`Failed to fetch hours (${res.status})`);
                const payload = await res.json();
                let remote = null;
                if (Array.isArray(payload?.content)) {
                    remote = payload.content;
                } else if (typeof payload?.content === "string") {
                    try {
                        remote = JSON.parse(payload.content);
                    } catch (error) {
                        console.warn("Remote hours payload is not valid JSON", error);
                    }
                }
                if (!cancelled && Array.isArray(remote)) {
                    setHoursState(remote);
                }
            } catch (error) {
                console.error("Failed to load hours from blob", error);
                if (!cancelled) setRemoteError(error.message || "Failed to load hours");
            } finally {
                if (!cancelled) setLoadingRemote(false);
            }
        }
        fetchRemoteHours();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Layout>
            {loadingRemote && (
                <p className="px-4 text-sm text-foreground/60">Loading latest hours…</p>
            )}
            {remoteError && (
                <p className="px-4 text-sm text-red-600">{remoteError}</p>
            )}
            <div className="stack">
                {hoursState.map((hour, index) => (
                    <HoursInput
                        key={index}
                        title={hour.day}
                        dayValue={hour.day}
                        openValue={hour.open}
                        closeValue={hour.close}
                        onChange={(e) => {
                            const newHours = [...hoursState];
                            newHours[index][e.target.name] = e.target.value;
                            setHoursState(newHours);
                        }}
                    />
                ))}
            </div>
            <CommitPanel content={hoursState} filePath={HOURS_PATH} title="Update hours" />
        </Layout>
    )
}

function HoursInput( { title, dayValue, openValue, closeValue, onChange}) {
    return (
        <div className="card">
            <div className="card-header">{title}</div>
            <div className="card-body row">
                <div className="field w-1/2">
                    <label className="label">Open</label>
                    <input className="input" name="open" type="text" value={openValue} onChange={onChange} />
                </div>
                <div className="field w-1/2">
                    <label className="label">Close</label>
                    <input className="input" name="close" type="text" value={closeValue} onChange={onChange} />
                </div>
            </div>
        </div>
    )
}
