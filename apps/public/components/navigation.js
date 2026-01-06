"use client";

import { FloatingNav } from "@ui/floatingNav";
import { Navbar } from "@ui/navbar";
import { usePathname } from "next/navigation";
import { ArrowUp } from "phosphor-react";
import faq from '@/public/data/faq.json';

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
                    { key: "activities", title: "Activities", path: '/activities' },
                    { key: "about", title: "About", path: '/about' },
                    { key: "reservations", title: "Reservations", path: '/reservations' },
                    { key: "faq", title: "FAQ", path: '/faq' },
                    { key: "gallery", title: "Gallery", path: '/gallery' },
                    { key: "pricing", title: "Pricing", path: '/pricing' }
                ]}
                primaryKeys={new Set(["activities", "reservations", "pricing"])}
                primaryLink={{
                    href: "tel:304-839-2330",
                    text: "Call"
                }}
                secondaryLink={{
                    href: "/visit",
                    text: "Visit"
                }}
            />
        </>
    )
}