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
                <AndImage src="https://images.unsplash.com/photo-1603980640727-9bbc2a1fb110?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>George the Llama</h2>
                    <p>I like to sniff people</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1650119097921-53bb715fea34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Thomas the Turkey & Nervous Nelly</h2>
                    <p>BOGLDOGLDGLDGLDGDGDGD</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1545487970-b6fc4321578d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Gomez & Fester</h2>
                    <p>I feel like a fem queen</p>
                    <p>I feel like might pick my makeup</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1719501953220-b1d880c3850a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Grace & Frankie</h2>
                    <p>We know what you did</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1706775576908-80cc9622dc94?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Cinnamon & Nutmeg</h2>
                    <p>Come with us... It's important</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1610359797625-64f9f083cf99?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Pugsley</h2>
                    <p>Do u have games on ur phone?</p>
                </AndImage>
                <AndImage src="https://images.unsplash.com/photo-1501677123889-f7f4d2268f5d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Rongo & Maui</h2>
                    <p>Meow</p>
                </AndImage>
            </div>
        </Layout>
    )
}