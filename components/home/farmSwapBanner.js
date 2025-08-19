"use client"
import Link from "next/link"
import { FacebookLogo } from "phosphor-react"


export default function FarmSwapBanner() {
    const date = "October 4th"
    const eventURL = "https://facebook.com"
    const subtitle = "Crafts - Art - Produce"
    return (
        <div className="bg-foreground" style={{
            backgroundImage: "url(/picnicTable.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <div className="backdrop-blur-xs py-9 px-2 md:px-5 text-background bg-accent/80" style={{
                backgroundImage: "linear-gradient(var(--accent) -20%, transparent 30%, transparent 60%, var(--accent) 100%)"
            }}>
                <div className="max-w-5xl mx-auto flex flex-col gap-5 items-center">
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="flex flex-col gap-5 flex-1 items-center justify-center">
                            <h2 className="font-satisfy text-7xl pb-4 border-b-2">Farm Swap</h2>
                            <p className="text-background/80 text-2xl font-medium">{subtitle}</p>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="bg-background/80 shadow-2xl rounded-full py-4 px-7 text-accent text-center">
                                <p><strong className="uppercase text-lg">Save the Date</strong></p>
                                <p className="text-foreground/90 text-3xl font-bold">{date}</p>
                            </div>
                            <Link href={eventURL} className="bg-blue-700 py-4 px-6 rounded-full text-xl font-bold flex flex-row items-center">
                                <FacebookLogo weight="bold" size={30} className="inline-block mr-3"/>View Facebook Event
                            </Link>
                        </div>
                    </div>
                    <p className="text-3xl text-center text-background/80">Join us for a mini-fair with local artisans, craftsmen, and more. Discover unique treasures alongside our regular daytime activities</p>
                </div>
            </div>
        </div>
    )
}