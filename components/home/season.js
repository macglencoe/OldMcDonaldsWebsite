"use client"
import dynamic from "next/dynamic";
import { ArrowRight } from "phosphor-react";

// dynamic import
const FestivalCalendar = dynamic(() => import("@/components/calendar"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function Season() {
    return (
        <section className="bg-foreground py-16 px-6 md:px-12 lg:px-24 w-full">
          <h1 className="text-4xl font-bold text-center text-background mb-12">2025 Season</h1>

          {/* Times Section */}
          <div className="mb-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li className="bg-background/10 p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-background/60 mb-4">Fridays</h2>
                <div className="flex flex-col gap-2 text-background">
                  <span><b>Open: </b>1:00 AM</span>
                  <span><b>Close: </b>6:00 PM</span>
                </div>
              </li>
              <li className="bg-background/10 p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-background/60 mb-4">Saturdays</h2>
                <div className="flex flex-col gap-2 text-background">
                  <span><b>Open: </b>11:00 AM</span>
                  <span><b>Close: </b>6:00 PM</span>
                </div>
              </li>
              <li className="bg-background/10 p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-background/60 mb-4">Sundays</h2>
                <div className="flex flex-col gap-2 text-background">
                  <span><b>Open: </b>12:00 PM</span>
                  <span><b>Close: </b>6:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Dates Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-background/60 mb-4">Season Duration</h2>
            <div className="flex items-center justify-center gap-4 text-lg text-background">
              <span>September 26</span>
              <ArrowRight size={24} weight="bold" />
              <span>October 26</span>
            </div>
          </div>
          <FestivalCalendar/>
        </section>
    )
}