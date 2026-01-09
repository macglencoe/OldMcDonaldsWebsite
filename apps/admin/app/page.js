import DirectoryGrid from "@/components/directoryGrid";
import ExternalLinks from "@/components/externalLinks";
import Hero from "@/components/hero";
import Link from "next/link";

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

            <h2 className="tracking-widest uppercase text-xl ml-3 border-b-3 border-accent/10 text-foreground/80">Configuration</h2>
            
            <DirectoryGrid
                items={[
                    {
                        name: "Announcements",
                        url: "/config/announcements",
                    },
                    {
                        name: "FAQs",
                        url: "/config/faqs"
                    },
                    {
                        name: "Calendar Events",
                        url: "/config/events"
                    },
                    {
                        name: "Pricing",
                        url: "/config/pricing"
                    },
                    {
                        name: "Weekly Hours",
                        url: "/config/hours"
                    },
                    {
                        name: "Feature Flags (Statsig)",
                        url: "https://console.statsig.com/7sbSQx3I6cLjQgTO65sn45/gates",
                        target: "_blank"
                    }
                ]}
            />

        </section>
    )
}