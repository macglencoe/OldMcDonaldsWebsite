import ExternalLinks from "@/components/externalLinks";
import Hero from "@/components/hero";

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
                    }
                ]}
            />
            <Hero />
        </section>
    )
}