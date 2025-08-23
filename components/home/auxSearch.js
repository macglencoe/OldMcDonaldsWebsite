"use client"

import { MagnifyingGlass } from "phosphor-react"


export default function AuxSearch() {


    return (
        <div className="bg-foreground py-5">
            <h2 className="text-background text-lg md:text-2xl max-w-5xl mx-auto text-center mb-5">Looking for something specific?</h2>
            <div className="max-w-5xl mx-3 md:mx-auto border-2 border-background/10 rounded-full p-2 bg-background/10">
                <form className="flex flex-row items-stretch gap-2" action="/search" method="GET">
                    <button type="submit" aria-label="Search">
                        <MagnifyingGlass size={32} weight="bold" className="text-background"/>
                    </button>
                    <input className="flex-1 outline-none text-background" placeholder="Search..." name="q" type="search">

                    </input>
                </form>
            </div>
        </div>
    )
}