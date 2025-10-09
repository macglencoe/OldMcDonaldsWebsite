import Layout from "@/components/layout"
import styles from "./page.module.css"
import { AndImage } from "@/components/andImage"
import PumpkinPriceGadget from "@/components/pumpkinPriceGadget"
import pricing from "@/public/data/pricing"
import PageHeader from "@/components/pageHeader"
import Action from "@/components/action"

export const metadata = {
    title: "Pumpkin Patch",
    description: "Pick your perfect pumpkin at Old McDonald’s Pumpkin Patch in Inwood, WV. Browse carving pumpkins, gourds, white pumpkins, and more by the pound."
}

export const PumpkinPatch = () => {
    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Pumpkin Patch</PageHeader>
            <div className="body basic">
                <div className={styles.body}>
                    <AndImage src="/pumpkinlanes.jpg">
                        <h2>Where is it?</h2>
                        <p>The two pumpkin patches can be found beyond the corn maze, just along the farm lane</p>
                        <Action as="Link" className={'mx-auto'} variant="primary" href={'/map?x=39.3825184665116&y=-78.04699996825022'}>See More</Action>
                    </AndImage>
                    <div className="flex flex-col gap-3 shadow-lg rounded-2xl p-6 border border-accent/20">
                        <h2 className="text-center border-b-3">Pricing</h2>
                        <p className="text-center">Pumpkins from the patch are priced at:</p>
                        <p className={styles.big + " text-center"}>${pricing["pumpkin-patch"].amount.toFixed(2)} / {pricing["pumpkin-patch"].per}</p>
                        <PumpkinPriceGadget/>
                        <p className="text-center">Pay at the weighing station, on your way back from the patch</p>
                        <p className="text-center">Cash and cards accepted</p>
                    </div>
                    <AndImage src="/cart-corral.jpg">
                        <h2>Transportation</h2>
                        <p>If you want to pick multiple pumpkins, you may want to use a wagon</p>
                        <p>You can <b>grab a wagon</b> from the entrance, or bring your own. Don't be afraid to share wagons!</p>
                    </AndImage>
                    <AndImage src="/smallPumpkins.jpg">
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
                    </AndImage>
                    <AndImage src="/pumpkinsCloseUp.jpg">
                        <h2>Do's and Don'ts</h2>
                        <p>Don't:</p>
                        <ul>
                            <li>Destroy Pumpkins</li>
                            <li>Abuse the carts</li>
                            <li>Pick pumpkins you don't intend on purchasing</li>
                        </ul>
                        <p>Do:</p>
                        <ul>
                            <li>Pick ripe pumpkins</li>
                            <li>Haul pumpkins in a cart (or carry them)</li>
                            <li>Take and share photos</li>
                        </ul>
                    </AndImage>
                </div>
            </div>
        </Layout>
    )
}

export default PumpkinPatch