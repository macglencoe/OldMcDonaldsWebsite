import Layout from "@/components/layout";
import PhotoOpsMap from "@/components/photoOpsMap";
import PhotoOpsMapClient from "@/components/photoOpsMapClient";

export default function PhotoOps() {
    return (
        <Layout>
            <div className="header">
                <h1>Map</h1>
                <p>Explore the farm from the palm of your hand</p>
            </div>
            <div className="body basic">
                <PhotoOpsMapClient />
            </div>
        </Layout>
    );
}