"use client"

import { track } from "@/utils/analytics"

export default function TestStatsig() {
    return(
        <div className="flex items-center justify-center w-full h-screen shadow-inner">
            <button onClick={() => {
                track("test event", {property: "bruh"});
                alert("haha you tested it");
            }} className="bg-accent text-background">Test Statsig</button>
        </div>
    )
}