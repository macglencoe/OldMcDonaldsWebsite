"use client";

import { FloatingNav } from "@ui/floatingNav";
import { Navbar } from "@ui/navbar";
import { usePathname } from "next/navigation";
import { ArrowUp } from "phosphor-react";
import faq from '@/public/data/faq.json';

const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=1597%20Arden%20Nollville%20Rd.%20Inwood%2C%20WV%2025428";
const PRIMARY_KEYS = new Set(["visit", "activities", "pricing", "reservations"]);

export default function Navigation() {
    const pathname = usePathname();

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
                    href: DIRECTIONS_URL,
                    title: "Get Directions",
                    external: true
                }}
                mobileFooter={(
                    <>
                        <p>1597 Arden Nollville Rd<br />Inwood, WV 25428</p>
                        <p><a href="tel:304-839-2330">Call (304) 839-2330</a></p>
                    </>
                )}
            />
        </>
    )
}
