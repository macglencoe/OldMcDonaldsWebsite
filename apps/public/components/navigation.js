"use client";

import { FloatingNav } from "@ui/floatingNav";
import { Navbar } from "@ui/navbar";
import { usePathname } from "next/navigation";
import { ArrowUp } from "phosphor-react";
import faq from '@/public/data/faq.json';
import useSiteSettings from '@/hooks/useSiteSettings';
import { createDirectionsUrl } from '@oldmc/config/site-settings';

const PRIMARY_KEYS = new Set(["visit", "activities", "pricing", "reservations"]);

export default function Navigation() {
    const pathname = usePathname();
    const settings = useSiteSettings();
    const directionsUrl = createDirectionsUrl(settings);

    const hasFaq = faq.some(item =>
        item.pages?.includes(pathname) // only true if this FAQ applies to current path
    );


    return (
        <>
            <FloatingNav
                controls={[
                    {
                        id: 'scrollTop',
                        label: 'Scroll to Top',
                        children: <ArrowUp size={24} weight="bold" />,
                        scrollToTop: true
                    },
                    ...(hasFaq ? [{
                        id: 'scrollToFAQ',
                        label: 'Scroll to FAQ',
                        children: 'FAQ',
                        scrollToId: 'faq'
                    }] : [])
                ]}
            />
            <Navbar
                titleText="Old McDonald's"
                items={[
                    { key: "visit", title: "Visit", path: '/visit' },
                    { key: "activities", title: "Activities", path: '/activities' },
                    { key: "pricing", title: "Pricing", path: '/pricing' },
                    { key: "reservations", title: "Groups & Events", path: '/reservations' },
                    { key: "about", title: "About", path: '/about' },
                    { key: "gallery", title: "Gallery", path: '/gallery' },
                    { key: "faq", title: "FAQ", path: '/faq' },
                    { key: "vendors", title: "Vendors", path: '/vendors' },
                    { key: "contact", title: "Contact", path: '/contact' },
                    { key: "map", title: "Farm Map", path: '/map' }
                ]}
                primaryKeys={PRIMARY_KEYS}
                actionItem={{
                    href: directionsUrl,
                    title: "Get Directions",
                    external: true
                }}
                mobileFooter={(
                    <>
                        <p>{settings.business.streetAddress}<br />{settings.business.addressLocality}, {settings.business.addressRegion} {settings.business.postalCode}</p>
                        <p><a href={`tel:${settings.business.phone}`}>Call {settings.business.phoneDisplay}</a></p>
                    </>
                )}
            />
        </>
    )
}
