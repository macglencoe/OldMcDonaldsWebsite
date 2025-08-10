"use client"
import { FacebookLogo } from "phosphor-react"


export default function FarmSwapBanner() {
    const date = "October 4th"
    const eventURL = "https://facebook.com"
    const subtitle = "Crafts - Stuff - Placeholder - Words"
    return (
        <div className="py-9 px-2 md:px-5 flex flex-col md:flex-row items-center flex-wrap bg-foreground text-background">
            <div className="w-fit text-sm md:text-5xl flex flex-col gap-1 md:max-w-none max-w-[280px]">
                <p className="border-b-2 pb-1 md:pb-2"><strong>{date}</strong> - Come visit our <strong className="font-satisfy">Farm Swap</strong></p>
                <p className="text-center md:text-left text-md md:text-2xl">{subtitle}</p>
            </div>
            <div className="flex-1 flex items-center justify-center w-fit">
                <a href={eventURL} target="_blank" className="flex items-center bg-accent w-fit py-1 px-2 md:py-2 md:px-3 my-2 text-background md:text-lg text-sm font-bold rounded md:rounded-xl">
                    More info
                    &nbsp;<FacebookLogo size={24} weight="bold" alt="Facebook" className="inline-block" />
                </a>
            </div>
        </div>
    )
}