import Layout from "@/components/layout"
import styles from "./page.module.css"
import { AndImage } from "@/components/andImage"
import PumpkinPriceGadget from "@/components/pumpkinPriceGadget"

export const PumpkinPatch = () => {
    return (
        <Layout>
            <div className="header">
                <h1>Pumpkin Patch</h1>
                <span>2025 Season</span>
            </div>
            <div className="body basic">
                <div className={styles.body}>
                    <AndImage src="/pumpkinlanes.jpg">
                        <h2>Where is it?</h2>
                        <p>The two pumpkin patches can be found beyond the corn maze, just along the farm lane</p>
                        <a className="button" href="/map?x=39.3825184665116&y=-78.04699996825022">Find on the Map</a>
                    </AndImage>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-center border-b-3">Pricing</h2>
                        <p className="text-center">Pumpkins from the patch are priced at:</p>
                        <p className={styles.big + " text-center"}>$0.50 / pound</p>
                        <PumpkinPriceGadget/>
                        <p className="text-center">Pay at the weighing station, on your way back from the patch</p>
                        <p className="text-center">Cash and cards accepted</p>
                    </div>
                    <AndImage fromUnsplash src="https://images.unsplash.com/photo-1740578266454-eee1d51fe7ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Transportation</h2>
                        <p>If you want to pick multiple pumpkins, you may want to use a wagon</p>
                        <p>You can <b>grab a wagon</b> from the entrance, or bring your own. Don't be afraid to share wagons!</p>
                    </AndImage>
                    <AndImage src="/smallPumpkins.jpg">
                        <h2>Variety</h2>
                        <p>We grow a diverse range of pumpkins, including (but not limited to):</p>
                        <ul>
                            <li>Traditional carving pumpkins</li>
                            <li>Decorative gourds</li>
                            <li>Winter squash</li>
                            <li>Ornamental varieties</li>
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
                            <li>Smoke Skooma</li>
                            <li>Smoke Skooma</li>
                            <li>Smoke Skooma</li>
                        </ul>
                    </AndImage>
                </div>
            </div>
        </Layout>
    )
}

export default PumpkinPatch