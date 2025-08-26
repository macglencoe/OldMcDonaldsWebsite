import Image from "next/image";
import Link from "next/link";


export default function OneLaneRoadBanner() {
    return (
        <div className="bg-foreground py-10 px-2">
            <div className="max-w-5xl mx-auto bg-background/10 rounded-2xl overflow-hidden">
                <div className="w-full flex flex-col items-center gap-4 py-5 bg-accent/20">
                    <span className="bg-accent uppercase rounded-full text-foreground py-2 px-3 font-bold text-center mx-auto">Live Performance</span>
                    <h2 className="text-background font-satisfy text-center text-5xl md:text-7xl">One Lane Road</h2>
                    <p className="text-accent/80 text-2xl font-semibold">Authentic Bluegrass</p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 p-3 md:p-6">
                    <div className="border-4 border-x-transparent border-y-background flex-1">
                        <Image src={'/olr-graphic.PNG'} width={1400} height={1400} className="p-2"/>
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                        <h3 className="text-3xl text-background font-semibold">Live at Old McDonald's</h3>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">Someday, Someber Nth, 2025</p>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl">N:00AM - N:00PM</p>
                        <p className="w-full bg-background/20 text-background p-4 rounded-xl"><Link href="/visit" className="text-accent underline">Glencoe Farm</Link></p>


                    </div>
                </div>
            </div>
        </div>
    )
}