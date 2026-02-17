'use client'
import Locator from "@/components/locator";
import Hours from "@/components/hours";
import QuickCard from "@/components/quickCard";
import { FAQDrop } from "@/components/faqDrop";
import { MapTrifold, Question, Ticket, MapPin } from "phosphor-react";
import Link from "next/link";

export default function VisitClient() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

    return (
        <div className="max-w-5xl mx-auto px-3 md:px-0">
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[180px]">
                    <QuickCard
                        title="Get Directions"
                        href={mapsUrl}
                        image="/localMap.png"
                        external
                        Icon={() => <MapTrifold size={28} weight="duotone" />}
                    />
                    <QuickCard
                        title="Activities"
                        href="/activities"
                        image="/tractorSunset.jpg"
                        Icon={() => <MapPin size={28} weight="duotone" />}
                    />
                    <QuickCard
                        title="Pricing & Tickets"
                        href="/pricing"
                        image="/entrance.jpg"
                        Icon={() => <Ticket size={28} weight="duotone" />}
                    />
                    <QuickCard
                        title="FAQ"
                        href="/faq"
                        image="/natureMazePath.jpg"
                        Icon={() => <Question size={28} weight="duotone" />}
                    />
                </div>
            </section>

            <section>
                <div className="grid gap-6 md:grid-cols-2 mt-8">
                    <div className="rounded-xl border border-foreground/10 overflow-hidden min-h-64 shadow hover:shadow-md transition">
                        <div className="w-full h-full min-h-64">
                            <Locator />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 text-xl">
                        <h2 className="font-semibold text-5xl font-satisfy mt-3">Getting There</h2>
                        <p>Our address is &nbsp;
                            <span className="font-semibold text-accent hover:underline cursor-pointer group" onClick={() => navigator.clipboard.writeText(address).then(() => alert("Copied to clipboard"))}>
                                1597 Arden Nollville Rd, Inwood, WV 25428
                            </span>,<br/>
                            right off of I-81, between Martinsburg and Inwood
                        </p>
                        <h2 className="font-semibold text-5xl font-satisfy mt-3">Parking</h2>
                        <p>Our parking lot is in the field north of the big white barn, right on the side of the road.</p>
                        <p><strong>Please look for parking attendants.</strong></p>
                    </div>
                </div>
            </section>

            <section className="flex flex-row items-center flex-wrap justify-center md:justify-between my-12 bg-foreground py-3 px-3 md:px-5 rounded-xl text-background shadow-lg">
                <div className="flex flex-col items-start h-full justify-center text-left">
                    <h2 className="text-center font-satisfy text-5xl mt-5">Hours</h2>
                    <p className="description text-center my-5">Weather permitting. <Link className="link" href="/#calendar">See calendar</Link> for more details</p>
                </div>
                <Hours />
            </section>
        </div>
    )
}

 
