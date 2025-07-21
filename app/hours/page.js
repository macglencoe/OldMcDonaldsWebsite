"use client";

import Layout from '@/components/layout'
import hoursData from '@/public/data/hours.json'
import { useState } from 'react';

export default function HoursPage() {
    const [hoursState, setHoursState] = useState(hoursData);
    return (
        <Layout>
            {
                hoursData.map((hour, index) => {
                    return (
                        <div key={index} className="p-4 flex flex-col gap-2">
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
                        </div>
                    )
                })
            }
        </Layout>
    )
}

function HoursInput( { title, dayValue, openValue, closeValue, onChange}) {
    return (
        <div className="flex flex-row gap-2">
            <label className="mr-2">{title}:</label>
            <label className="mr-2">Open:</label>
            <input className="w-1/3" name="open" type="time" value={openValue} onChange={onChange} />
            <label className="mr-2">Close:</label>
            <input className="w-1/3" name="close" type="time" value={closeValue} onChange={onChange} />
        </div>
    )
}
