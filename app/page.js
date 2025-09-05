import Layout from "@/components/layout";
import { PiArticleDuotone, PiCalendarCheckDuotone, PiCalendarDotsDuotone, PiChartLineDuotone, PiClockCountdownDuotone, PiCurrencyCircleDollarDuotone, PiDevToLogoDuotone, PiFlagDuotone, PiGithubLogoDuotone, PiPaperPlaneTiltDuotone, PiSealQuestionDuotone, PiStarDuotone } from 'react-icons/pi'

export default function Page() {
    const externalLinks = [
        {
            title: "Analytics",
            serviceName: "Vercel",
            href: "https://vercel.com/old-mc-donald-s/old-mcdonalds-website/analytics",
            icon: PiChartLineDuotone
        },
        {
            title: "Code Repository",
            serviceName: "GitHub",
            href: "https://github.com/macglencoe/OldMcDonaldsWebsite",
            icon: PiGithubLogoDuotone
        },
        {
            title: "Gallery Upload Folder",
            serviceName: "GitHub",
            href: "https://github.com/macglencoe/OldMcDonaldsWebsite/tree/main/public/gallery",
            icon: PiGithubLogoDuotone
        },
        {
            title: "Email Platform",
            serviceName: "SendGrid",
            href: "https://app.sendgrid.com",
            icon: PiPaperPlaneTiltDuotone
        },
        {
            title: "Development Blog",
            serviceName: "Dev.to",
            href: "https://dev.to/macglencoe/series/31726",
            icon: PiDevToLogoDuotone
        },
        {
            title: "Vendor Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1T1RuEWKEGxdTbREg_LHOzOxuGCuX1AVlAjQU7Bzo6UQ/edit#response=ACYDBNg2s9ipAgpbz9JYbpEz-Wy0kV4kcFFBBaWArriHUAt3Mn9pqoMCrKiHWGJLJCnPCoc",
            icon: PiArticleDuotone
        },
        {
            title: "Rental Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1YsA54-3DO8T43Yy6wylSlFj8neIIbMYViYJ-qyYcTEM/edit#response=ACYDBNjfI4699RNaVczP8v3JVD6-YY7OrIiYUQAx1Pg-NfE8MDmewrU1cJlipD5SZ3YNDFY",
            icon: PiArticleDuotone
        }
    ]
    const Admininks = [
        {
            title: "Feature Flags",
            href: "/flags",
            icon: PiFlagDuotone
        },
        {
            title: "Prices",
            href: "/prices",
            icon: PiCurrencyCircleDollarDuotone,
            notImplemented: true
        },
        {
            title: "Hours",
            href: "/hours",
            icon: PiClockCountdownDuotone,
            notImplemented: true
        },
        {
            title: "Calendar",
            href: "/calendar",
            icon: PiCalendarDotsDuotone,
            notImplemented: true
        },
        {
            title: "Rental Availability",
            href: "/gazeboRentalSlots",
            icon: PiCalendarCheckDuotone,
            notImplemented: true
        },
        {
            title: "Testimonials",
            href: "/testimonials",
            icon: PiStarDuotone,
            notImplemented: true
        },
        {
            title: "FAQ",
            href: "/faq",
            icon: PiSealQuestionDuotone,
            notImplemented: true
        },
    ]
    const formsLinks = [
        {
            title: "General Vendor Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1T1RuEWKEGxdTbREg_LHOzOxuGCuX1AVlAjQU7Bzo6UQ/edit#response=ACYDBNg2s9ipAgpbz9JYbpEz-Wy0kV4kcFFBBaWArriHUAt3Mn9pqoMCrKiHWGJLJCnPCoc",
            icon: PiArticleDuotone
        },
        {
            title: "Gazebo Rental Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1YsA54-3DO8T43Yy6wylSlFj8neIIbMYViYJ-qyYcTEM/edit#response=ACYDBNjfI4699RNaVczP8v3JVD6-YY7OrIiYUQAx1Pg-NfE8MDmewrU1cJlipD5SZ3YNDFY",
            icon: PiArticleDuotone
        },
        {
            title: "Photo Submissions",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSfdYBDpAJ0jIF3Qg1AgYKx3aTT-assp9eAPFGg-m5Z9dx-xyA/viewform?usp=header",
            icon: PiArticleDuotone
        }
    ]
    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-10 py-10">
                <Panel links={Admininks} title="Admin Directory" />
                <Panel links={formsLinks} title="Forms" />
                <Panel links={externalLinks} title="External Links" />
            </div>
        </Layout>
    )
}


function AdminDirectory() {
    const links = [
        {
            title: "Feature Flags",
            href: "/flags",
            icon: PiFlagDuotone
        },
        {
            title: "Prices",
            href: "/prices",
            icon: PiCurrencyCircleDollarDuotone,
            notImplemented: true
        },
        {
            title: "Hours",
            href: "/hours",
            icon: PiClockCountdownDuotone,
            notImplemented: true
        },
        {
            title: "Calendar",
            href: "/calendar",
            icon: PiCalendarDotsDuotone,
            notImplemented: true
        },
        {
            title: "Rental Availability",
            href: "/gazeboRentalSlots",
            icon: PiCalendarCheckDuotone,
            notImplemented: true
        },
        {
            title: "Testimonials",
            href: "/testimonials",
            icon: PiStarDuotone,
            notImplemented: true
        },
        {
            title: "FAQ",
            href: "/faq",
            icon: PiSealQuestionDuotone,
            notImplemented: true
        },
    ]
    return (
        <div className="rounded-xl overflow-hidden">
            <h1 className="text-3xl py-2 px-4 w-full bg-accent/20 uppercase">Admin Directory</h1>
            <div className="flex flex-row flex-wrap gap-2">
                {links.map(({ title, href, icon, notImplemented }) => {
                    const Icon = icon

                    if (href && !notImplemented) {
                        return (
                            <a href={href} key={href} className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                                <Icon size={38} color="var(--accent)" />
                                {title}
                            </a>
                        );
                    }
                    else {
                        return (
                            <div key={href} className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                                <Icon size={38} color="var(--foreground)" />
                                <div className="flex flex-col">
                                    {title}
                                    <p className="text-sm text-foreground/50">Not yet implemented</p>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function Panel({ links, title }) {
    return (
        <div className="rounded-xl overflow-hidden">
            <h1 className="text-3xl py-2 px-4 w-full bg-accent/20 uppercase">{title}</h1>
            <div className="flex flex-row flex-wrap gap-2">
                {links.map(({ title: linkTitle, serviceName, href, icon, notImplemented }) => {
                    const Icon = icon

                    if (href && !notImplemented) {
                        return (
                            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                                <Icon size={38} color="var(--accent)" />
                                <div>
                                    <p className="font-bold">{linkTitle}</p>
                                    <p className="text-sm">{serviceName}</p>
                                </div>
                            </a>
                        );
                    }
                    else {
                        return (
                            <div key={href} className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                                <Icon size={38} color="var(--foreground)" />
                                <div className="flex flex-col">
                                    <p className="font-bold">{linkTitle}</p>
                                    <p className="text-sm text-foreground/50">{serviceName}</p>
                                    <p className="text-sm text-foreground/50">Not yet implemented</p>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function ServicesPanel() {
    const links = [
        {
            title: "Analytics",
            serviceName: "Vercel",
            href: "https://vercel.com/old-mc-donald-s/old-mcdonalds-website/analytics",
            icon: PiChartLineDuotone
        },
        {
            title: "Code Repository",
            serviceName: "GitHub",
            href: "https://github.com/macglencoe/OldMcDonaldsWebsite",
            icon: PiGithubLogoDuotone
        },
        {
            title: "Gallery Upload Folder",
            serviceName: "GitHub",
            href: "https://github.com/macglencoe/OldMcDonaldsWebsite/tree/main/public/gallery",
            icon: PiGithubLogoDuotone
        },
        {
            title: "Email Platform",
            serviceName: "SendGrid",
            href: "https://app.sendgrid.com",
            icon: PiPaperPlaneTiltDuotone
        },
        {
            title: "Development Blog",
            serviceName: "Dev.to",
            href: "https://dev.to/macglencoe/series/31726",
            icon: PiDevToLogoDuotone
        },
        {
            title: "Vendor Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1T1RuEWKEGxdTbREg_LHOzOxuGCuX1AVlAjQU7Bzo6UQ/edit#response=ACYDBNg2s9ipAgpbz9JYbpEz-Wy0kV4kcFFBBaWArriHUAt3Mn9pqoMCrKiHWGJLJCnPCoc",
            icon: PiArticleDuotone
        },
        {
            title: "Rental Applications",
            serviceName: "Google Forms",
            href: "https://docs.google.com/forms/d/1YsA54-3DO8T43Yy6wylSlFj8neIIbMYViYJ-qyYcTEM/edit#response=ACYDBNjfI4699RNaVczP8v3JVD6-YY7OrIiYUQAx1Pg-NfE8MDmewrU1cJlipD5SZ3YNDFY",
            icon: PiArticleDuotone
        }
    ]

    return (
        <div className="rounded-xl overflow-hidden">
            <h1 className="text-3xl py-2 px-4 w-full bg-accent/20 uppercase">External</h1>
            <div className="flex flex-row flex-wrap gap-2">
                {links.map(({ title, serviceName, href, icon }, index) => {
                    const Icon = icon

                    return (
                        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                            <Icon size={38} color="var(--accent)" />
                            <div>
                                <p className="font-bold">{title}</p>
                                <p className="text-sm">{serviceName}</p>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}