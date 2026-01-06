"use client";

import { Gear } from "phosphor-react";



export default function Hero() {
    return (
        <div className="w-full py-4 px-6 bg-accent rounded-2xl flex items-center relative mb-8 overflow-hidden">
            <Gear size={150} weight="duotone" 
                className="
                text-background mr-4
                animate-spin [animation-duration:10s]
                absolute left-4 opacity-30
                "
            />
            <div className="z-10 space-y-2">
                <h2 className="text-background font-semibold text-lg md:text-4xl">Manage Old McDonald&apos;s Website</h2>
                <p className="text-background/90 max-w-lg">Welcome to the Old McDonald&apos;s website admin panel</p>
            </div>
        </div>
    )
}