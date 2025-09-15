import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import { isFeatureEnabled } from "@/public/lib/featureEvaluator";
import VendorMenu from "@/components/vendorMenu";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Vendor: Old McDonuts",
    description: "Try fresh donuts, hot coffee, and apple cider slushies at Old McDonuts, a featured vendor at Old McDonald’s Pumpkin Patch in Inwood, WV.",
    openGraph: {
        title: "Vendor: Old McDonuts",
        description: "Try fresh donuts, hot coffee, and apple cider slushies at Old McDonuts, a featured vendor at Old McDonald’s Pumpkin Patch in Inwood, WV.",
        url: "/vendors/old-mcdonuts",
        images: [{ url: "/oldMcDonuts.jpg" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vendor: Old McDonuts",
        description: "Fresh donuts, hot coffee, and apple cider slushies.",
        images: ["/oldMcDonuts.jpg"],
    },
};

export default function OldMcDonuts() {
    const useOldMcDonutsMenu = isFeatureEnabled("use_donuts_menu");
    if (!useOldMcDonutsMenu) return notFound();

    const SECTIONS = [
        {
            id: 'coffee',
            title: 'Coffee',
            items: [
                { name: 'Latte', price: 3.46, desc: 'Espresso + steamed milk' },
                { name: 'Pumpkin Spice Latte', price: 2.99, desc: 'Seasonal favorite' },
                { name: 'Drip Coffee', price: 3.99, desc: 'Freshly brewed' },
                { name: 'Mocha', price: 3.99, desc: 'Chocolate + espresso' },
            ],
        },
        {
            id: 'treats',
            title: 'Sweet Treats',
            items: [
                { name: 'Apple Cider Slushie', price: 1.99, desc: 'Crisp and refreshing' },
                { name: 'Apple Cider Donut x 6', price: 3.99, desc: 'Half dozen, made fresh' },
                { name: 'Apple Cider Donut x 12', price: 5.99, desc: 'Full dozen, shareable' },
            ],
        },
    ];

    return (
        <Layout>
            <PageHeader subtitle="Donuts & Coffee">Old McDonuts</PageHeader>
            <VendorMenu
                sections={SECTIONS}
                bgSrc="/oldMcDonuts.jpg"
                bgAlt="Old McDonuts stand with fresh donuts and coffee"
                mapHref="/map?x=39.38310990806668&y=-78.04274712816566"
            />
        </Layout>
    );
}
