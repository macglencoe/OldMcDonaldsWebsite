"use client"

import { useStatsigClient } from "@statsig/react-bindings"

export default function TestStatsig() {
    const { client } = useStatsigClient();
    return(
        <div className="flex items-center justify-center w-full h-screen shadow-inner">
            <button onClick={() => {
                client.logEvent("test event");
                alert("haha you tested it")
            }} className="bg-accent text-background">Test Statsig</button>
        </div>
    )
}