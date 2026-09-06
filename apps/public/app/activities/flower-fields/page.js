import { Action } from "@oldmc/ui";
import {
    ArticleFacts,
    ArticleLayout,
    ArticleLead,
    ArticleNotice,
    ArticleSection,
    ArticleSteps,
} from "@/components/article";
import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import { getPricingData } from "@/utils/pricingServer";

export const metadata = {
    title: "Flower Fields",
    description: "Pick your own sunflowers, zinnias, and cosmos at Old McDonald’s Pumpkin Patch. Visit our flower fields, cut your own bouquet, and capture farm photos."
}

export default async function FlowerFields() {
    const pricing = await getPricingData();
    const flowerCupPrice = Number(pricing["flower-cup"]?.amount ?? 0).toFixed(2);
    return (
        <Layout>
            <PageHeader subtitle="2026 Season">Flower Fields</PageHeader>
            <ArticleLayout>
                <ArticleLead image="/sunflowerCloseUp.jpg" imageAlt="A sunflower growing in the flower field" imageFocalPoint="center 42%" heading="Sunflowers, Cosmos, & Zinnias">
                    <p>Take a stroll out to our flower field</p>
                    <p><a href="#cut-your-own">Cut your own</a>, take some pictures, or just enjoy</p>
                    <Action as="Link" href='/map?x=39.38235414782929&y=-78.04704499977541' variant="primary">Find on the Map</Action>
                </ArticleLead>

                <ArticleSteps
                    title="Cut your own"
                    items={[
                        { title: "Visit the Flower Bar", description: "The arrangement station is near the flower fields." },
                        { title: "Get cutters and a cup", description: `One cup of any flower is $${flowerCupPrice}.` },
                        { title: "Arrange your flowers", description: "Please return cutters to the arrangement station." },
                    ]}
                />

                <ArticleNotice title="Please return cutters">
                    <p>Please return cutters to the arrangement station</p>
                </ArticleNotice>

                <ArticleSection id="cut-your-own" image="/flowerbar.jpg" imageAlt="The Flower Bar arrangement station beside the flower fields" imagePosition="left" imageRatio="landscape" imageFocalPoint="center 54%">
                    <h2>Flower Bar</h2>
                    <p>We have an arrangement station (&quot;Flower Bar&quot;) near the flower fields, where you will find cutters and cups</p>
                    <p>For <b>one cup</b> of <b>Any Flower</b>:</p>
                    <p className="text-3xl!">${flowerCupPrice}</p>
                </ArticleSection>

                <ArticleSection image="/flowerbarInterior.jpg" imageAlt="Glass vases inside the Flower Bar" imageRatio="landscape" imageFocalPoint="center 50%">
                    <h2>Grab a vase too!</h2>
                    <p>We have a limited selection of glass vases available at the arrangement station</p>
                    <p>Each vase is priced individually</p>
                </ArticleSection>
            </ArticleLayout>
        </Layout>
    )
}
