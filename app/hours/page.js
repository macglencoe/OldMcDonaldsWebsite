"use client";

import Layout from '@/components/layout'
import hoursData from '@/public/data/hours.json'
import { useState } from 'react';
import CommitPanel from "@/components/commitPanel";

export default function HoursPage() {
    const [hoursState, setHoursState] = useState(hoursData);
    return (
        <Layout>
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
            <CommitPanel content={hoursState} filePath="public/data/hours.json" title="Update hours" />
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
