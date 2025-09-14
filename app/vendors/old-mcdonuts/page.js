import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import { isFeatureEnabled } from "@/public/lib/featureEvaluator";
import Image from "next/image";
import Link from "next/link";
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

    const formatUSD = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

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


            <div className="body basic">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <main className="lg:col-span-3 relative p-5">
                        <div className="absolute inset-0 -z-20">
                            <Image
                                src="/oldMcDonuts.jpg"
                                alt="Old McDonuts stand with fresh donuts and coffee"
                                priority
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="absolute inset-0 -z-10 pointer-events-none" style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(225, 225, 225, 0.8) 0%, rgba(225, 225, 225, 0.9) 40%, white 65%)'
                        }}/>
                        <div className="flex flex-wrap items-baseline justify-between mb-4">
                            <h2 className="text-2xl font-bold">Menu</h2>
                            <p className="text-sm text-foreground/70">Subject to change. <Link href="/#hours" className="underline text-accent font-medium">See hours</Link></p>
                        </div>

                        {SECTIONS.map((section) => (
                            <section key={section.id} id={section.id} className="mb-8 scroll-mt-24">
                                <h3 className="text-xl font-semibold border-b-2 border-accent/80 pb-2 mb-4">{section.title}</h3>
                                <ul className="!list-none pl-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {section.items.map((item) => (
                                        <li key={item.name} className="relative bg-amber-50 rounded-lg p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:-translate-y-[1px]">
                                            <div className="absolute right-3 top-3 bg-accent/20 text-accent px-2 py-1 rounded-full text-sm font-semibold">
                                                {formatUSD(item.price)}
                                            </div>
                                            <h4 className="text-lg font-bold pr-24">{item.name}</h4>
                                            {item.desc && <p className="text-sm text-foreground/80 mt-1">{item.desc}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </main>

                    <aside className="lg:col-span-1 lg:sticky lg:top-8 space-y-4">
                        <div className="bg-amber-50 rounded-lg p-4 shadow-sm ring-1 ring-black/5">
                            <h3 className="font-semibold mb-2">Menu Sections</h3>
                            <ul className="list-disc list-inside">
                                <li><Link href="#coffee" className="underline text-accent">Coffee</Link></li>
                                <li><Link href="#treats" className="underline text-accent">Sweet Treats</Link></li>
                            </ul>
                        </div>
                        <div className="bg-amber-100 rounded-lg p-4 shadow-sm ring-1 ring-black/5">
                            <h3 className="font-semibold mb-2">Plan Your Visit</h3>
                            <ul className="space-y-2">
                                <li><Link href="/vendors" className="underline text-accent">Back to Vendors</Link></li>
                                <li><Link href="/map?x=39.38310990806668&y=-78.04274712816566" className="underline text-accent">Find on the Map</Link></li>
                                <li><Link href="/#hours" className="underline text-accent">Hours & Admission</Link></li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}
