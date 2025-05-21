import { AndImage } from "@/components/andImage";
import Layout from "@/components/layout";


export default function FlowerFields() {
    return (
        <Layout>
            <div className="header">
                <h1>Flower Fields</h1>
                <span>2025 Season</span>
                <p>Frolicking skipping yippity hooray!!!</p>
            </div>
            <div className="body basic">
                <AndImage src="https://images.unsplash.com/photo-1610558316028-efee14358b76?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Sunflowers & Zinnias</h2>
                    <p>Take a stroll out to one of our 1-acre flower fields</p>
                    <p><a href="#cut-your-own">Cut your own</a>, take some pictures, or just enjoy</p>
                    <a className="button" href="/map?x=39.38163138370034&y=-78.04489454865366">Find on the Map</a>

                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1588311082740-88c1b480d72d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2 id="cut-your-own">Cut your own</h2>
                    <p>We have an arrangement station near the flower fields, where you will find cutters and cups</p>
                    <p>Flowers are priced by type:</p>
                    <ul>
                        <li>For <b>one cup</b> of <b>Zinnias</b>:<br></br><p className="big">$7.00</p></li>
                        <li>For <b>one Sunflower stem</b>:<br></br><p className="big">$1.00</p></li>
                    </ul>
                    <b>PLEASE RETURN CUTTERS TO ARRANGEMENT STATION</b>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1659480637106-11a47a59bfd7?q=80&w=1822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Grab a vase too!</h2>
                    <p>We have a limited selection of glass vases available at the arrangement station</p>
                    <p>Each vase is priced individually</p>
                </AndImage>
            </div>
        </Layout>
    )
}