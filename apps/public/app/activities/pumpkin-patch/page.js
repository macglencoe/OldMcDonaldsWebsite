import Layout from "@/components/layout"
import styles from "./page.module.css"
import {
    ArticleCallout,
    ArticleDivider,
    ArticleFacts,
    ArticleLayout,
    ArticleLead,
    ArticleSection,
} from "@/components/article"
import PumpkinPriceGadget from "@/components/pumpkinPriceGadget"
import PageHeader from "@/components/pageHeader"
import { getPricingData } from "@/utils/pricingServer"
import { Action } from "@oldmc/ui";

export const metadata = {
    title: "Pumpkin Patch",
    description: "Pick your perfect pumpkin at Old McDonald’s Pumpkin Patch in Inwood, WV. Browse carving pumpkins, gourds, white pumpkins, and more by the pound."
}

export const PumpkinPatch = async () => {
    const pricing = await getPricingData()
    const pumpkinPatchPrice = pricing["pumpkin-patch"]
    const pumpkinAmount = Number(pumpkinPatchPrice?.amount ?? 0).toFixed(2)
    const pumpkinUnit = pumpkinPatchPrice?.per ?? 'pound'
    return (
        <Layout>
            <PageHeader subtitle="2026 Season">Pumpkin Patch</PageHeader>
            <ArticleLayout>
                <ArticleLead
                    image="/pumpkinlanes.jpg"
                    imageAlt="Rows of pumpkins growing in the pumpkin patch"
                    imageFocalPoint="center 58%"
                    heading="Where is it?"
                >
                    <p>The two pumpkin patches can be found beyond the hayride corral, just along the farm lane</p>
                    <Action as="Link" variant="primary" href="/map?x=39.3825184665116&y=-78.04699996825022">Find on the Map</Action>
                </ArticleLead>

                <ArticleFacts items={[
                    { value: "2", label: "Pumpkin patches", detail: "Along the farm lane" },
                    { value: `$${pumpkinAmount}`, label: `Per ${pumpkinUnit}`, detail: "For pumpkins from the patch" },
                    { value: "8+", label: "Varieties", detail: "Of pumpkins" },
                    { value: "$0.00", label: "Fee", detail: "To use our wagons"}
                ]} />

                <ArticleCallout tone="quiet" className={styles.pricing}>
                        <h2 className="text-center border-b-3">Pricing</h2>
                        <p className="text-center">Pumpkins from the patch are priced at:</p>
                        <p className="text-center text-3xl!">${pumpkinAmount} / {pumpkinUnit}</p>
                        <PumpkinPriceGadget/>
                        <p className="text-center">Pay at the weighing station, on your way back from the patch</p>
                        <p className="text-center">Cash and cards accepted</p>
                </ArticleCallout>

                <ArticleDivider label="Picking Pumpkins" />

                <ArticleSection image="/cart-corral.jpg" imageAlt="Wagons available near the pumpkin patch entrance" imagePosition="left" imageRatio="landscape" imageFocalPoint="center 58%">
                    <h2>Transportation</h2>
                    <p>If you want to pick multiple pumpkins, you may want to use a wagon</p>
                    <p>You can <b>grab a wagon</b> from the entrance, or bring your own. Don&apos;t be afraid to share wagons!</p>
                </ArticleSection>

                <ArticleSection image="/smallPumpkins.jpg" imageAlt="A variety of small pumpkins and gourds" imageRatio="landscape" imageFocalPoint="center 54%">
                    <h2>Variety</h2>
                    <p>We grow a diverse range of pumpkins, including:</p>
                    <ul>
                        <li>Traditional carving pumpkins (Cronus, Adonis, etc.)</li>
                        <li>Blue Hubbards</li>
                        <li>Acorn Squash</li>
                        <li>White Pumpkins (Casper)</li>
                        <li>Batwing Gourds</li>
                        <li>Apple Gourds</li>
                        <li>Gooseneck Gourds</li>
                        <li>And More!</li>
                    </ul>
                </ArticleSection>

                <ArticleCallout className={styles.dosAndDonts}>
                    <h2>Do&apos;s and Don&apos;ts</h2>
                    <div>
                        <section>
                            <h3>Don&apos;t</h3>
                            <ul>
                                <li>Destroy Pumpkins</li>
                                <li>Abuse the carts</li>
                                <li>Pick pumpkins you don&apos;t intend on purchasing</li>
                            </ul>
                        </section>
                        <section>
                            <h3>Do</h3>
                            <ul>
                                <li>Pick ripe pumpkins</li>
                                <li>Haul pumpkins in a cart (or carry them)</li>
                                <li>Take and share photos</li>
                            </ul>
                        </section>
                    </div>
                </ArticleCallout>
            </ArticleLayout>
        </Layout>
    )
}

export default PumpkinPatch
