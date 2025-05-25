import { AndImage } from "@/components/andImage";
import Layout from "@/components/layout";


export default function PettingZoo() {
    return (
        <Layout>
            <div className="header">
                <h1>Petting Zoo</h1>
            </div>
            <div className="body basic">
                <a className="button" href="/map?x=39.38343412023281&y=-78.04263671453262">Find on the Map</a>
                <AndImage src="/george.jpg">
                    <h2>George the Llama</h2>
                    <p>I like to sniff people</p>
                </AndImage>
                <AndImage fromUnsplash src="https://images.unsplash.com/photo-1650119097921-53bb715fea34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Thomas the Turkey & Nervous Nelly</h2>
                    <p>BOGLDOGLDGLDGLDGDGDGD</p>
                </AndImage>
                <AndImage src="/gomezfester.jpg">
                    <h2>Gomez & Fester</h2>
                    <p>I feel like a fem queen</p>
                    <p>I feel like might pick my makeup</p>
                </AndImage>
            </div>
        </Layout>
    )
}