import {
    ArticleLayout,
    ArticleLead,
    ArticleRules,
    ArticleSection,
    ArticleSteps,
} from '@/components/article';
import Layout from '@/components/layout';
import PageHeader from '@/components/pageHeader';
import { Action } from "@oldmc/ui";

export const metadata = {
    title: "Nature Trails",
    description: "Explore nature trails at Old McDonald’s Pumpkin Patch. Hike through scenic woodlands, enjoy fall colors, and experience the beauty of Inwood, WV."
}

export const NatureTrails = () => {
    return (
        <Layout>
            <PageHeader subtitle="2026 Season">Nature Trails</PageHeader>
            <ArticleLayout>
                <ArticleLead image="/walnutbottom.jpg" imageAlt="A mowed trail through the woods at Glencoe Farm" imageFocalPoint="center 56%" heading="Take a hike!">
                    <p>Our lush forest has many trails just for visitors!</p>
                </ArticleLead>

                <ArticleSteps
                    title="How do I get there?"
                    items={[
                        { title: "Cross the creek", description: "Pass the hayride corral, and continue on the farm lane." },
                        { title: "Walk to the pumpkin patch", description: "Go all the way out the lane, almost until you reach the pond." },
                        { title: "Turn north", description: "It's at the top of the hill." },
                    ]}
                />

                <ArticleSection image="/forestlane.jpg" imageAlt="The farm lane leading toward the forest" imagePosition="left" imageRatio="landscape" imageFocalPoint="center 54%">
                    <h2>Still can't find it?</h2>
                    <p>Use our interactive map</p>
                    <Action as='Link' href='/map?x=39.38477237376192&y=-78.04864825577425' variant='primary'>Find on the Map</Action>
                </ArticleSection>

                <ArticleRules
                    title="Things to keep in mind"
                    items={[
                        { title: "Consider the weather conditions", description: "It is liable to be muddy." },
                        { title: "Stay in the mowed paths" },
                    ]}
                />
            </ArticleLayout>
        </Layout>
    )
}

export default NatureTrails;
