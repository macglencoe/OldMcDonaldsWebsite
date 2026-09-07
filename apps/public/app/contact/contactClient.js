"use client";

import ContactForm from "@/components/contactForm";
import EssentialActions from "@/components/essentialActions";
import { CalendarCheck, ChatCircleText, Envelope, MapPin, PhoneCall } from "phosphor-react";

const FARM_PHONE = "+13048392330";
const FARM_EMAIL = "team@oldmcdonaldspumpkinpatch.com";
const DEV_EMAIL = "me@macglencoe.com";

export default function ContactClient() {
    const developerMailto = `mailto:${DEV_EMAIL}?subject=${encodeURIComponent("Website feedback")}`;

    return (
        <div className="mx-auto max-w-5xl px-4 md:px-6">
            <section aria-labelledby="contact-options-heading" className="mt-8">
                <div className="mb-5 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Choose the quickest route</p>
                    <h2 id="contact-options-heading" className="mt-1 font-satisfy text-4xl md:text-5xl">How can we help?</h2>
                    <p className="mt-2 text-lg text-foreground/70">
                        Call for a quick question, email for business inquiries, or send us a message below.
                    </p>
                </div>

                <EssentialActions
                    className="lg:grid-cols-3"
                    actions={[
                        { title: "Call the farm", description: "(304) 839-2330", href: `tel:${FARM_PHONE}`, Icon: PhoneCall, native: true, primary: true },
                        { title: "Email us", description: "Business and general inquiries", href: `mailto:${FARM_EMAIL}`, Icon: Envelope, native: true },
                        { title: "Send a message", description: "Use the contact form", href: "#contact-form", Icon: ChatCircleText },
                    ]}
                />
            </section>

            <section id="contact-form" aria-label="Send us a message" className="mt-10 scroll-mt-24 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.025]">
                <ContactForm />
            </section>

            <section className="mt-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background">
                    <div className="relative bg-[url('/entrance.jpg')] bg-cover bg-center px-6 py-8 text-background">
                        <div className="standard-backdrop absolute inset-0" />
                        <div className="relative">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Farm contact</p>
                            <h2 className="mt-1 font-satisfy text-3xl md:text-4xl">Old McDonald’s Pumpkin Patch</h2>
                            <p className="mt-1 text-background/80">Glencoe Farm · Inwood, West Virginia</p>
                        </div>
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-2">
                        <ContactInfoItem title="Mailing address" Icon={MapPin}>
                            <address className="not-italic text-foreground/70">
                                1597 Arden Nollville Rd<br />Inwood, WV 25428
                            </address>
                        </ContactInfoItem>
                        <ContactInfoItem title="Phone" Icon={PhoneCall}>
                            <a className="break-words text-accent hover:underline" href={`tel:${FARM_PHONE}`}>(304) 839-2330</a>
                        </ContactInfoItem>
                        <ContactInfoItem title="Email" Icon={Envelope} className="sm:col-span-2">
                            <a className="break-all text-accent hover:underline" href={`mailto:${FARM_EMAIL}`}>{FARM_EMAIL}</a>
                        </ContactInfoItem>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-foreground p-6 text-background">
                    <div>
                        <CalendarCheck className="text-accent" size={34} weight="duotone" aria-hidden />
                        <h2 className="mt-4 font-satisfy text-3xl md:text-4xl">Planning a group visit?</h2>
                        <p className="mt-3 text-background/75">Gazebo rentals, school groups, and private gatherings have their own planning form.</p>
                    </div>
                    <a className="mt-7 inline-flex w-fit rounded-full bg-accent px-5 py-2.5 font-semibold text-background transition hover:-translate-y-0.5 hover:shadow-lg" href="/reservations">
                        View reservations
                    </a>
                </div>
            </section>

            <p className="my-8 text-center text-sm text-foreground/55">
                Found a problem with this website? <a className="font-medium text-foreground/75 underline underline-offset-2 hover:text-accent" href={developerMailto}>Email the site developer.</a>
            </p>
        </div>
    );
}

function ContactInfoItem({ Icon, title, children, className = "" }) {
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <span className="mt-0.5 shrink-0 text-foreground"><Icon size={26} weight="duotone" aria-hidden /></span>
            <div className="min-w-0">
                <h3 className="font-semibold">{title}</h3>
                <div className="mt-1">{children}</div>
            </div>
        </div>
    );
}
