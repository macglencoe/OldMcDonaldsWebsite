"use client"
import dynamic from "next/dynamic";
import { ArrowRight, HandWaving } from "phosphor-react";
import Hours from "../hours";
import Countdown from "./countdown";
import { useFlags } from "@/app/FlagsContext";


// dynamic import
const FestivalCalendar = dynamic(() => import("@/components/calendar"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Season() {
  const { isFeatureEnabled } = useFlags();
  return (
    <section className="bg-foreground py-16 px-6 md:px-12 lg:px-24 w-full">
      <h1 className="text-4xl font-bold text-center text-background mb-12">2025 Season</h1>
      <Hours />

      { isFeatureEnabled('show_countdown') &&
        <Countdown targetDate={"2025-09-27T11:00:00.000-05:00"} title="Opening Weekend" />
      }
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-background/60 mb-4">Calendar</h2>
        <div>
          <p className="md:hidden text-background py-4">If you&apos;re on mobile, you can scroll left and right to see the full calendar <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="var(--background)" viewBox="0 0 256 256" className="inline-block"><path d="M216,140v36c0,25.59-8.49,42.85-8.85,43.58A8,8,0,0,1,200,224a7.9,7.9,0,0,1-3.57-.85,8,8,0,0,1-3.58-10.73c.06-.12,7.16-14.81,7.16-36.42V140a12,12,0,0,0-24,0v4a8,8,0,0,1-16,0V124a12,12,0,0,0-24,0v12a8,8,0,0,1-16,0V68a12,12,0,0,0-24,0V176a8,8,0,0,1-14.79,4.23l-18.68-30-.14-.23A12,12,0,1,0,41.6,162L70.89,212A8,8,0,1,1,57.08,220l-29.32-50a28,28,0,0,1,48.41-28.17L80,148V68a28,28,0,0,1,56,0V98.7a28,28,0,0,1,38.65,16.69A28,28,0,0,1,216,140Zm32-92H195.31l18.34-18.34a8,8,0,0,0-11.31-11.32l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.31-11.32L195.31,64H248a8,8,0,0,0,0-16Z"></path></svg></p>
        </div>
        <FestivalCalendar />
      </div>
    </section>
  )
}
