"use client"
import { Geist, Geist_Mono } from "next/font/google"
import Action from "../action"
import { Copy } from "phosphor-react";
import clsx from "clsx";


export default function InfoStrip() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428";
    return (
        <section className="bg-foreground py-4">
            <div className="max-w-5xl mx-auto flex flex-wrap items-stretch px-1 sm:px-2 gap-2 sm:gap-4">
                <InfoItem
                    title="Hours"
                    cta={{ href: "#calendar", text: "Calendar" }}>

                    <table className="table-auto text-center border-separate border-spacing-y-3 -mt-3">
                        <thead className="text-background">
                            <tr>
                                <th></th>
                                <th>Open</th>
                                <th>Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            <HoursRow day="FRI" opens="1:00 PM" closes="6:00 PM" />
                            <HoursRow day="SAT" opens="10:00 AM" closes="6:00 PM" />
                            <HoursRow day="SUN" opens="12:00 PM" closes="6:00 PM" />
                        </tbody>
                    </table>
                </InfoItem>
                <InfoItem
                    title="Admission"
                    cta={{ href: "#rates", text: "Rates" }}>

                        <p className="font-satisfy text-8xl text-background mt-3">$6<span className="text-2xl tracking-wide">/person</span></p>
                        <p className="font-light tracking-wide">Children 3 and under are free</p>
                </InfoItem>
                <InfoItem
                    title="Location"
                    cta={{ href: "/visit", text: "Visit" }}>
                        <p className="font-light tracking-wide"><i>Old McDonald's<br className="block sm:hidden lg:block" /> Pumpkin Patch & Corn Maze</i></p>
                        <div className="flex flex-row items-center justify-between bg-accent/20 px-2 py-1 rounded-lg hover:underline cursor-pointer" onClick={() => navigator.clipboard.writeText(address).then(() => alert("Copied to clipboard"))}>
                            <p className="font-semibold text-left" >
                                1597 Arden Nollville Rd,<br className="block sm:hidden lg:block"/> Inwood, WV 25428
                            </p>
                            <Copy size={30} className="ml-3 text-accent" />
                        </div>
                </InfoItem>
            </div>
        </section>
    )
}

function InfoItem({ title, cta, children, className }) {
    return (
        <div className={clsx("flex flex-col flex-[1_1_260px] min-w-[240px] sm:min-w-[260px]", className, "border-2 border-background/20 bg-background/10 rounded-2xl  overflow-hidden items-center gap-2")}>
            {title &&
                <h3 className="text-background text-2xl font-bold bg-background/10 w-full text-center py-1 uppercase tracking-widest">{title}</h3>
            }
                <div className="flex flex-col items-center p-1 sm:p-2 pt-1 sm:pt-4 w-full gap-2 h-full justify-between text-center text-background">
                    {children}
                    {cta && cta.href && cta.text && (
                        <Action as="a" href={cta.href} className="uppercase tracking-wider w-full text-center max-w-md">{cta.text}</Action>
                    )}
                </div>
        </div>
    )
}

function HoursRow({ day, opens, closes }) {
    return (
        <tr className="text-center my-2">
            <td className="pr-4 text-background font-bold" style={{
                fontFamily: "var(--font-geist-mono)"
            }}>{day}</td>
            <td className="bg-background/70 text-foreground py-0.5 px-3 rounded-l-lg">{opens}</td>
            <td className="bg-foreground text-background py-0.5 px-3 rounded-r-lg">{closes}</td>
        </tr>
    )
}
