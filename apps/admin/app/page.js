import DirectoryGrid from "@/components/directoryGrid";
import ExternalLinks from "@/components/externalLinks";
import Hero from "@/components/hero";
import Link from "next/link";
import { PiCalendarDuotone, PiClockDuotone, PiCurrencyDollarDuotone, PiFlagDuotone, PiMegaphoneDuotone, PiQuestionDuotone } from "react-icons/pi";

export default function () {
    return (
        <section className="pt-10">
            <ExternalLinks
                items={[
                    {
                        name: "Public Site",
                        url: "https://oldmcdonaldspumpkinpatch.com"
                    },
                    {
                        name: "Employee Schedule",
                        url: "about:blank"
                    }, // TODO: Add real link
                    {
                        name: "Staff Tools",
                        url: "https://ops.oldmcdonaldspumpkinpatch.com"
                    },
                    {
                        name: "Email",
                        url: "https://mail.zoho.com"
                    },
                ]}
            />
            <Hero />

            <h2 className="tracking-widest uppercase text-xl ml-3 border-b-3 border-accent/10 text-foreground/80">Site Configuration</h2>
            
            <DirectoryGrid
                items={[
                    {
                        name: "Announcements",
                        url: "/config/announcements",
                        icon: PiMegaphoneDuotone
                    },
                    {
                        name: "FAQs",
                        url: "/config/faqs",
                        icon: PiQuestionDuotone
                    },
                    {
                        name: "Calendar Events",
                        url: "/config/events",
                        icon: PiCalendarDuotone
                    },
                    {
                        name: "Pricing",
                        url: "/config/pricing",
                        icon: PiCurrencyDollarDuotone
                    },
                    {
                        name: "Weekly Hours",
                        url: "/config/hours",
                        icon: PiClockDuotone
                    },
                    {
                        name: "Feature Flags (Statsig)",
                        url: "https://console.statsig.com/7sbSQx3I6cLjQgTO65sn45/gates",
                        target: "_blank",
                        icon: PiFlagDuotone
                    }
                ]}
            />

        </section>
    )
}