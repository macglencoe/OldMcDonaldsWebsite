import { AndImage } from "@/components/andImage";
import Layout from "@/components/layout";
import pricing from "@/public/data/pricing";

export default function FlowerFields() {
    return (
        <Layout>
            <div className="header">
                <h1>Flower Fields</h1>
                <span>2025 Season</span>
                <p>Frolicking skipping yippity hooray!!!</p>
            </div>
            <div className="body basic">
                <AndImage src="/sunflowerCloseUp.jpg">
                    <h2>Sunflowers, Cosmos, & Zinnias</h2>
                    <p>Take a stroll out to one of our 1-acre flower fields</p>
                    <p><a href="#cut-your-own">Cut your own</a>, take some pictures, or just enjoy</p>
                    <a className="button" href="/map?x=39.38163138370034&y=-78.04489454865366">Find on the Map</a>

                </AndImage>
                <AndImage src="/flowerbar.jpg">
                    <h2 id="cut-your-own">Cut your own</h2>
                    <p>We have an arrangement station near the flower fields, where you will find cutters and cups</p>
                    <ul>
                        <li>For <b>one cup</b> of <b>Any Flower</b>:<br></br><p className="big">${pricing["flower-cup"].amount.toFixed(2)}</p></li>
                    </ul>
                    <b>PLEASE RETURN CUTTERS TO ARRANGEMENT STATION</b>
                </AndImage>
                <AndImage src="/flowerbarInterior.jpg">
                    <h2>Grab a vase too!</h2>
                    <p>We have a limited selection of glass vases available at the arrangement station</p>
                    <p>Each vase is priced individually</p>
                </AndImage>
            </div>
        </Layout>
    )
}