import Layout from '@/components/layout'
import {
    ArticleFacts,
    ArticleLayout,
    ArticleLead,
    ArticleSection,
    ArticleSteps,
} from '@/components/article'
import PageHeader from '@/components/pageHeader'
import { getPricingData } from '@/utils/pricingServer'
import { Action } from "@oldmc/ui";

export const metadata = {
    title: "Hay Rides",
    description: "Enjoy scenic hayrides at Old McDonald’s Pumpkin Patch. Take a 20-minute tour of the farm by wagon, with special night hayrides in October."
}

export const HayRide = async () => {
    const pricing = await getPricingData()
    const hayridePrice = Number(pricing.hayride?.amount ?? 0).toFixed(2)
    return (
        <Layout>
            <PageHeader subtitle="2026 Season">Hay Rides</PageHeader>
            <ArticleLayout>
                <ArticleLead image="/hillview.jpg" imageAlt="A scenic view across Glencoe Farm" imageFocalPoint="center 54%" heading="A tour of the farm">
                    <p>Relax on a 20-minute haywagon ride with scenic views of the property</p>
                </ArticleLead>

                <ArticleFacts items={[
                    { value: "20", label: "Minutes", detail: "Around the farm" },
                    { value: `$${hayridePrice}`, label: "Per person", detail: "Above 3 years of age" },
                    { value: "4", label: "Wagons", detail: "Available every half-hour" },
                ]} />

                <ArticleSection image="/pondeastdock.jpg" imageAlt="The pond and dock along the hayride route" imageRatio="landscape" imageFocalPoint="center 52%">
                    <h2>Pricing</h2>
                    <p>For one person, above 3 years of age:</p>
                    <p className='text-3xl! font-bold'>${hayridePrice}</p>
                    <p>Must be paid at the admission booth</p>
                    <p>If you plan on bringing a large group, make sure your group is all together at the admission booth</p>
                </ArticleSection>

                <ArticleSteps
                    title="When to get on"
                    items={[
                        { title: "Check your ticket", description: "Each ticket has a color and a time written on the back." },
                        { title: "Arrive before your time", description: "Go to the hayride corral, which is across the creek." },
                        { title: "Find your wagon", description: "The drivers will direct you to the correct wagon, and take your ticket." },
                    ]}
                />

                <ArticleSection image="/hayrideGroupPhoto.jpg" imageAlt="A group riding together on a farm haywagon" imagePosition="left" imageRatio="landscape" imageFocalPoint="center 48%">
                    <h2>Hayride corral</h2>
                    <p>Can&apos;t find the corral? Check the map below</p>
                    <Action as='Link' href='/map?x=39.382529281329774&y=-78.04355774914931' variant='primary'>Find on the Map</Action>
                </ArticleSection>

                <ArticleSection imageAttribution tone="night" image="https://images.unsplash.com/photo-1707755939969-e9c1da71c5bb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" imageAlt="Trees beneath a dark night sky" imageRatio="landscape" imageFocalPoint="center 62%">
                    <h2>Hayrides at night</h2>
                    <p>Starting October 16th, we will have hayrides open from 7:30pm to 10pm</p>
                    <p>Bring your friends and some warm clothes for a spooky tour of the deep dark forest at night</p>
                    <Action as='Link' href='/activities/night-maze' variant='secondary'>See More</Action>
                </ArticleSection>
            </ArticleLayout>
        </Layout>
    )
}

export default HayRide
