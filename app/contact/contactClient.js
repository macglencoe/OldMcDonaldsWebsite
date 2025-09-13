"use client"
import ContactForm from "@/components/contactForm";
import QuickCard from "@/components/quickCard";
import Image from "next/image";
import { Envelope, PaperPlaneTilt, PhoneCall, Pinwheel, MapTrifold, MapPin, Ticket, Question, Clock, ArrowDown, Code, GithubLogo, ArrowSquareUpRight, ArrowSquareOut, Chat, Chats } from "phosphor-react";

export default function ContactClient() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    const devPhone = "+13042406828";
    const smsPrompt = "Hi Liam, I wanted to ask you something about Old McDonald's Website:\n\n";
    const smsHref = `sms:${devPhone}?&body=${encodeURIComponent(smsPrompt)}`;
    const devEmail = "me@macglencoe.com";
    const emailSubject = "Website feedback";
    const emailBody = "Hi Liam, I wanted to ask you something about Old McDonald's Website:\n\n";
    const mailtoHref = `mailto:${devEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return (
        <div className="mx-auto max-w-5xl">
            {/* Quick Links */}
            <section>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[180px] ">
                    <QuickCard
                        title="Reservations"
                        href="/reservations"
                        image="/rentalgazebo.jpg"
                        Icon={() => <Clock size={28} weight="duotone" />}
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
                    <div className="rounded-xl border border-foreground/10 overflow-hidden shadow hover:shadow-md transition">
                        <div
                            className="p-6 bg-[url('/entrance.jpg')] bg-cover bg-center relative"
                            aria-hidden
                        >
                            <div className="absolute inset-0 standard-backdrop rounded-t-xl" />
                            <div className="relative z-10 text-background">
                                <h3 className="text-3xl font-satisfy mb-2">Old McDonald’s Pumpkin Patch</h3>
                                <p className="opacity-90">Glencoe Farm, Inwood, WV</p>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <ContactInfoItem title="Mailing Address" Icon={() => (<Envelope size={32} weight="bold" />)}>
                                <p>
                                    1597 Arden Nollville Rd
                                    <br />
                                    Inwood, WV 25428
                                </p>
                            </ContactInfoItem>
                            <ContactInfoItem title="Phone" Icon={() => (<PhoneCall size={32} weight="bold" />)}>
                                <a className="hover:underline text-accent" href="tel:+13048392330">+1 304 839 2330</a>
                            </ContactInfoItem>
                            <ContactInfoItem title="Email (Business Inquiries)" Icon={() => <PaperPlaneTilt size={32} weight="bold" />}>
                                <a className="hover:underline text-accent" href="mailto:oldmcdonaldsglencoefarm@gmail.com">oldmcdonaldsglencoefarm@gmail.com</a>
                            </ContactInfoItem>
                        </div>
                    </div>

                    <div className="rounded-xl border border-foreground/10 overflow-hidden min-h-64 shadow hover:shadow-md transition">
                        <iframe
                            title="Map to Old McDonald’s Pumpkin Patch"
                            className="w-full h-full min-h-64"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.314756569123!2d-78.04480392349423!3d39.3858425716188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c10301e71eed7b%3A0x4d0d869ee11addca!2sOld%20McDonald%E2%80%99s%20Pumpkin%20Patch%20%26%20Corn%20Maze!5e0!3m2!1sen!2sus!4v1726050000000"
                        />
                    </div>
                </div>
            </section>

            <section className="mt-2">
                <div className="rounded-2xl overflow-hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[url('/brookbridge.jpg')] bg-cover bg-center" />
                        <div className="absolute inset-0" />
                        <div className="relative flex justify-center standard-backdrop">
                            <ContactForm theme="onDark" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="dev" className="mt-2">
                <div className="rounded-2xl overflow-hidden border border-foreground/10 shadow p-6 relative">
                    <Code size={"200%"} className="-z-10 text-foreground/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <h2 className="text-5xl text-center font-satisfy m-3">Feedback</h2>
                    <p className="text-center text-foreground/80">Found a problem with the website? Have a suggestion? <strong>Contact the dev <ArrowDown className="inline" weight="bold" size={20} /></strong></p>

                    <div className="rounded-2xl overflow-hidden border border-foreground/10 shadow px-6 py-3 my-4 bg-background">
                        <h3 className="text-xl font-semibold">Liam McDonald</h3>
                        <a
                            href="https://github.com/macglencoe"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Liam McDonald's GitHub profile"
                            className="group block rounded border border-foreground/10 bg-foreground text-background px-6 py-4 my-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition transform"
                        >
                            <div className="flex items-center gap-4">
                                <span className="shrink-0">
                                    <GithubLogo size={28} weight="fill" />
                                </span>
                                <Image
                                    width={48}
                                    height={48}
                                    src="/macglencoe.jpeg"
                                    alt="macglencoe avatar"
                                    className="rounded-full shrink-0"
                                />
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">@macglencoe</span>
                                    <span className="text-sm text-background/80">View GitHub profile</span>
                                </div>
                                <span className="ml-auto opacity-80 group-hover:opacity-100">
                                    <ArrowSquareOut size={24} />
                                </span>
                            </div>
                        </a>

                        <a
                            href={smsHref}
                            aria-label="Send Liam an SMS"
                            className="group block rounded border border-foreground/10 bg-foreground text-background px-6 py-4 my-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition transform"
                        >
                            <div className="flex items-center gap-4">
                                <span className="shrink-0">
                                    <Chats size={26} weight="fill" />
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">Text Liam (SMS)</span>
                                    <span className="text-sm text-background/80">Opens in your default SMS app</span>
                                </div>
                                <span className="ml-auto opacity-80 group-hover:opacity-100">
                                    <Chat size={24} />
                                </span>
                            </div>
                        </a>

                        <a
                            href={mailtoHref}
                            aria-label="Email Liam"
                            className="group block rounded border border-foreground/10 bg-foreground text-background px-6 py-4 my-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition transform"
                        >
                            <div className="flex items-center gap-4">
                                <span className="shrink-0">
                                    <PaperPlaneTilt size={26} weight="fill" />
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">Email Liam</span>
                                    <span className="text-sm text-background/80">Opens in your default Email app</span>
                                </div>
                                <span className="ml-auto opacity-80 group-hover:opacity-100">
                                    <Envelope size={24} />
                                </span>
                            </div>
                        </a>


                    </div>

                </div>
            </section>
        </div>
    )
}

function ContactInfoItem({ Icon, title, children }) {
    return (
        <div className="flex flex-row items-center gap-3">
            {Icon && <Icon />}
            <div>
                <div className="font-semibold">{title}</div>
                {children}
            </div>
        </div>
    )
}
