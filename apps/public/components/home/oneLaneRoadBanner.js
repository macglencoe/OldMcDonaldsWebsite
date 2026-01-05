"use client"
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "phosphor-react";


export default function OneLaneRoadBanner() {
    
    const oldDate = "Sunday, October 19th, 2025";
    const date = "Saturday, October 25th, 2025";
    const oldTime = "3PM - 5PM";
    const time = "1PM - 3PM";
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
                        <Image src={'/olr-graphic-postponed.jpg'} width={1400} height={1400} className="p-2" alt="One Lane Road Promotional Graphic: Live music at Old McDonald's"/>
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                        <h3 className="text-3xl text-background font-semibold">Live at Old McDonald's</h3>
                        <p className="w-full bg-background py-2 px-3 rounded-2xl outline-4 outline-red-400
                            uppercase font-bold text-3xl text-red-500 text-center"
                            >Postponed</p>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">
                            <div>
                                <Calendar weight="bold" size={24} className="inline mr-2" aria-label="Date"/>
                                {date}
                            </div>
                            <div className="line-through text-red-300">
                                {oldDate}
                            </div>
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


                    </div>
                </div>
            </div>
        </div>
    )
}
