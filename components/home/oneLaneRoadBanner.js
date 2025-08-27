"use client"
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, FacebookLogo, MapPin } from "phosphor-react";
import Action from "@/components/action"


export default function OneLaneRoadBanner() {
    const date = "Sunday, October 26th, 2025";
    const time = "3PM - 5PM";
    const eventUrl = "https://www.facebook.com"
    return (
        <div className="py-10 px-2 relative z-0" style={{
            backgroundImage: 'url(/hillview.jpg)',
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <div className="absolute inset-0 -z-10 standard-backdrop" />
            <div className="max-w-5xl mx-auto bg-foreground/80 rounded-2xl overflow-hidden z-20">
                <div className="w-full flex flex-col items-center gap-4 py-5 bg-accent/20">
                    <span className="bg-accent uppercase rounded-full text-foreground py-2 px-3 font-bold text-center mx-auto">Live Performance</span>
                    <h2 className="text-background font-satisfy text-center text-5xl md:text-7xl">One Lane Road</h2>
                    <p className="text-accent/80 text-2xl font-semibold">Authentic Bluegrass</p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 p-3 md:p-6 items-center">
                    <div className="border-4 border-x-transparent border-y-background flex-1">
                        <Image src={'/olr-graphic.PNG'} width={1400} height={1400} className="p-2" alt={"One Lane Road"}/>
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                        <h3 className="text-3xl text-background font-semibold">Live at Old McDonald's</h3>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">
                            <Calendar weight="bold" size={24} className="inline mr-2" aria-label="Date"/>
                            {date}
                        </p>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">
                            <Clock weight="bold" size={24} className="inline mr-2" aria-label="Time"/>
                            {time}
                        </p>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">
                            <MapPin weight="bold" size={24} className="inline mr-2" aria-label="Location"/>
                            <Link href="/visit" className="text-accent underline">
                                Glencoe Farm
                            </Link>
                        </p>
                        <Action as="a" href={eventUrl} className={"bg-blue-700 hover:bg-blue-600"}><FacebookLogo size={24} weight="bold"  className="inline mr-3"/>See more</Action>


                    </div>
                </div>
            </div>
        </div>
    )
}