"use client";
import Link from "next/link";
import { track } from "@vercel/analytics";


export default function NightMazeBanner() {
    return (
        <Link href="/activities/night-maze" onClick={() => {
            track('Night Maze Click', { location: 'Banner' })
            }}>
            <div className="w-full px-5 py-2 bg-accent flex flex-row flex-wrap gap-4 justify-between items-center" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1716573253327-cda613725dca?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}>
                <div className="flex flex-row flex-wrap gap-2 md:gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-6xl font-bold text-accent/70 uppercase">Six Nights</h1>
                        <span className="text-2xl md:text-3xl text-background/70 tracking-wider">at Old McDonald's!</span>
                    </div>
                    <ul className="flex flex-col flex-wrap font-bold text-background/70 list-disc list-inside">
                        <li >Corn Maze in the dark</li>
                        <li>Hayrides through the woods</li>
                        <li>Bonfires</li>
                        <li>Vendors</li>
                    </ul>
                </div>
                <span className="text-md md:text-3xl text-foreground font-bold tracking-wider uppercase mr-10 bg-background/50 p-2">
                    Click to Learn More
                </span>
            </div>
        </Link>
    )
}