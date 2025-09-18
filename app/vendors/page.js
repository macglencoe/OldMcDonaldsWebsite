import Layout from '@/components/layout'
import styles from './page.module.css'
import VendorProfile from '@/components/vendorProfile'
import PageHeader from '@/components/pageHeader'
import Action from '@/components/action'
import { isFeatureEnabled } from '@/public/lib/featureEvaluator'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'

export const metadata = {
    title: "Vendors",
    description: "Discover food and craft vendors at Old McDonald’s Pumpkin Patch. Enjoy fresh donuts, hotdogs, twisted taters, slushies, and local artisan treats."
}

export const Vendors = () => {
    const useTwistedTatersMenu = isFeatureEnabled("use_taters_menu");
    let donutsMarkdown = '';
    try {
        const mdPath = path.join(process.cwd(), 'app', 'vendors', 'old-mcdonuts.md');
        donutsMarkdown = fs.readFileSync(mdPath, 'utf8');
    } catch (e) {
        // fail silently; no markdown rendered if read fails
        donutsMarkdown = '';
    }
    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Vendors</PageHeader>
            <div className="body basic !pb-6">
                <Action as='a' variant='primary' className={'mx-auto'} href={'/map?x=39.38310990806668&y=-78.04274712816566'}>Find on the Map</Action>
                <VendorProfile
                    name="Old McDonuts"
                    subtitle="Donuts, Coffee, and Slushies"
                    imgSrc="/oldMcDonuts.jpg"
                    description="Classic fall flavors, always fresh and delicious"
                >
                    {donutsMarkdown && (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                table: ({ children }) => (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-separate border-spacing-0 text-sm bg-white shadow-sm">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-accent/20 text-foreground/50 text-xl uppercase">
                                        {children}
                                    </thead>
                                ),
                                tr: ({ children }) => (
                                    <tr className="even:bg-foreground/5 hover:bg-foreground/10 transition-colors">
                                        {children}
                                    </tr>
                                ),
                                th: ({ children }) => (
                                    <th className="text-left font-semibold text-foreground px-3 py-2 border-b border-foreground/20">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="px-3 py-2 border-b border-foreground/10 align-top">
                                        {children}
                                    </td>
                                ),
                                h1: ({ children }) => (
                                    <h1 className='text-3xl font-semibold my-3'>
                                        {children}
                                    </h1>
                                )
                            }}
                        >
                            {donutsMarkdown}
                        </ReactMarkdown>
                    )}
                </VendorProfile>
                <VendorProfile
                    name="Twisted Taters"
                    subtitle="Butterfly Potatoes & more"
                    description="Crispy and delicious butterfly potatoes, and much more"
                    imgSrc="/twistedTaters.jpg"
                />
                <VendorProfile
                    name="Doggystyle"
                    subtitle="Hotdogs"
                    imgSrc="/doggystyle.jpg"
                    description="Veteran owned and operated, all beef hotdogs with lots of toppings"
                    website="https://www.facebook.com/doggystylewv/"
                />
            </div>
        </Layout>
    )
}

export default Vendors
