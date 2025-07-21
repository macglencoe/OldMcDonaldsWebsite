import Layout from "@/components/layout";
import { PiArticleDuotone, PiCalendarCheckDuotone, PiCalendarDotsDuotone, PiChartLineDuotone, PiClockCountdownDuotone, PiCurrencyCircleDollarDuotone, PiDevToLogoDuotone, PiFlagDuotone, PiGithubLogoDuotone, PiPaperPlaneTiltDuotone, PiSealQuestionDuotone, PiStarDuotone } from 'react-icons/pi'

export default function Page() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-10 py-10">
                <AdminDirectory />
                <ServicesPanel />
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
            icon: PiCurrencyCircleDollarDuotone
        },
        {
            title: "Hours",
            href: "/hours",
            icon: PiClockCountdownDuotone
        },
        {
            title: "Calendar",
            href: "/calendar",
            icon: PiCalendarDotsDuotone
        },
        {
            title: "Rental Availability",
            href: "/gazeboRentalSlots",
            icon: PiCalendarCheckDuotone
        },
        {
            title: "Testimonials",
            href: "/testimonials",
            icon: PiStarDuotone
        },
        {
            title: "FAQ",
            href: "/faq",
            icon: PiSealQuestionDuotone
        },
    ]
    return (
        <div className="rounded-xl overflow-hidden">
            <h1 className="text-3xl py-2 px-4 w-full bg-accent/20 uppercase">Admin Directory</h1>
            <div className="flex flex-row flex-wrap gap-2">
                {links.map(({title, href, icon}) => {
                    const Icon = icon

                    return (
                        <a href={href} key={href} className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                            <Icon size={38} color="var(--accent)"/>
                            {title}
                        </a>
                    )
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
                {links.map(({title, serviceName, href, icon}, index) => {
                    const Icon = icon

                    return (
                        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-fit flex flex-row items-center gap-2 py-2 px-4 hover:bg-accent/20 relative">
                            <Icon size={38} color="var(--accent)"/>
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