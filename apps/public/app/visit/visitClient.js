'use client'
import Locator from "@/components/locator";
import Hours from "@/components/hours";
import EssentialActions from "@/components/essentialActions";
import { ArrowSquareOut, MapTrifold, Question, Ticket, MapPin, Car, Wheelchair, ToiletPaper } from "phosphor-react";
import Link from "next/link";
import useSiteSettings from "@/hooks/useSiteSettings";
import { createDirectionsUrl } from "@oldmc/config/site-settings";

export default function VisitClient() {
    const settings = useSiteSettings();
    const mapsUrl = createDirectionsUrl(settings);

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6">
            <section className="mt-8 overflow-hidden rounded-2xl bg-foreground text-background shadow-lg">
                <div className="grid items-center gap-8 px-5 py-7 md:grid-cols-[1fr_auto] md:px-8 md:py-9">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Plan your visit</p>
                        <h2 className="font-satisfy text-4xl md:text-5xl">Hours at a glance</h2>
                        <p className="mt-3 max-w-xl text-background/80">
                            Open Friday through Sunday during the season, weather permitting. Check the calendar before heading out.
                        </p>
                        <Link className="mt-4 inline-flex items-center gap-1 font-semibold text-accent hover:underline" href="/#calendar">
                            See the season calendar <ArrowSquareOut size={18} aria-hidden />
                        </Link>
                    </div>
                    <Hours />
                </div>
            </section>

            <section aria-labelledby="visit-actions-heading" className="mt-6">
                <h2 id="visit-actions-heading" className="sr-only">Visit actions</h2>
                <EssentialActions
                    actions={[
                        { title: "Get directions", description: "Open the route in Google Maps", href: mapsUrl, Icon: MapTrifold, external: true, primary: true },
                        { title: "Pricing & tickets", description: "Review admission before you arrive", href: "/pricing", Icon: Ticket },
                        { title: "Explore activities", description: "Pumpkins, mazes, hayrides, and more", href: "/activities", Icon: MapPin },
                        { title: "Visitor FAQ", description: "Quick answers for planning your day", href: "/faq", Icon: Question },
                    ]}
                />
            </section>

            <section aria-labelledby="visit-essentials-heading" className="mt-10">
                <div className="mb-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Before you arrive</p>
                    <h2 id="visit-essentials-heading" className="mt-1 font-satisfy text-4xl md:text-5xl">Visit essentials</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-foreground/10 bg-background p-5">
                        <Car className="mb-3 text-accent" size={28} weight="duotone" aria-hidden />
                        <h3 className="text-xl font-semibold">Parking</h3>
                        <p className="mt-2 text-foreground/75">Park in the field north of the big white barn, beside the road. Please follow the parking attendants when you arrive.</p>
                    </div>
                    <div className="rounded-xl border border-foreground/10 bg-background p-5">
                        <MapPin className="mb-3 text-accent" size={28} weight="duotone" aria-hidden />
                        <h3 className="text-xl font-semibold">Address</h3>
                        <p className="mt-2 text-foreground/75">{settings.business.streetAddress}<br />{settings.business.addressLocality}, {settings.business.addressRegion} {settings.business.postalCode}</p>
                        <p className="mt-2 text-sm text-foreground/60">Just off I-81, between Martinsburg and Inwood.</p>
                    </div>
                    <Link href="/faq" className="group rounded-xl border border-foreground/10 bg-background p-5 hover:border-accent/60">
                        <Wheelchair className="mb-3 text-accent" size={28} weight="duotone" aria-hidden />
                        <h3 className="text-xl font-semibold group-hover:text-accent">Accessibility details</h3>
                        <p className="mt-2 text-foreground/75">Find information for wheelchairs, strollers, and navigating the farm.</p>
                    </Link>
                    <Link href="/faq" className="group rounded-xl border border-foreground/10 bg-background p-5 hover:border-accent/60">
                        <ToiletPaper className="mb-3 text-accent" size={28} weight="duotone" aria-hidden />
                        <h3 className="text-xl font-semibold group-hover:text-accent">Restrooms & payment</h3>
                        <p className="mt-2 text-foreground/75">Check the practical details that help make the day go smoothly.</p>
                    </Link>
                </div>
            </section>

            <section className="my-10">
                <details className="group overflow-hidden rounded-xl border border-foreground/15 bg-background">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold hover:bg-foreground/[0.03]">
                        <span>View location map</span>
                        <span className="text-sm font-normal text-foreground/60 group-open:hidden">Optional</span>
                        <span className="hidden text-sm font-normal text-foreground/60 group-open:inline">Hide map</span>
                    </summary>
                    <div className="h-80 border-t border-foreground/10 md:h-96">
                        <Locator />
                    </div>
                </details>
            </section>
        </div>
    )
}

 
