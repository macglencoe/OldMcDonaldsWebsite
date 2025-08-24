"use client"
import Link from "next/link"
import { FacebookLogo } from "phosphor-react"

export default function FarmSwapBanner() {
    const date = "October 4th"
    const eventURL = "https://facebook.com"
    const subtitle = "Local Crafts • Fresh Produce • Handmade Art"
    
    return (
        <div className="relative overflow-hidden bg-foreground" style={{
            backgroundImage: "url(/picnicTable.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            {/* Improved overlay with better gradient */}
            <div className="relative py-16 px-4 md:px-8 text-white bg-gradient-to-b from-black/70 via-black/50 to-black/70">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    
                    {/* Main title section */}
                    <div className="space-y-4">
                        <h1 className="font-satisfy text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
                            Farm Swap
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-medium tracking-wide">
                            {subtitle}
                        </p>
                    </div>

                    {/* Date and CTA section */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl py-4 px-8 shadow-xl border border-white/20">
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-1">
                                Save the Date
                            </p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                {date}
                            </p>
                        </div>
                        
                        <Link 
                            href={eventURL} 
                            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-xl py-4 px-8 rounded-2xl text-lg font-bold flex items-center gap-3 text-white border border-blue-500/20"
                        >
                            <FacebookLogo weight="bold" size={24} />
                            View Event
                        </Link>
                    </div>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed pt-4">
                        <b>Dont miss out!</b> Join us for a mini-fair with local artisans, craftsmen, and more. Discover unique treasures alongside our regular daytime activities.
                    </p>
                </div>
            </div>
        </div>
    )
}