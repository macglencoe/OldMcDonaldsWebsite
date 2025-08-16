import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import PhotoOpsMap from "@/components/photoOpsMap";
import PhotoOpsMapClient from "@/components/photoOpsMapClient";

export default function PhotoOps() {
    return (
        <Layout>
            <PageHeader 
                subtitle="Explore the farm"
                content={(
                    <div className="body basic">
                        <a className="mt-5 mb-2" href="/visit">Click here for directions</a>
                    </div>
                )}
            >
                Map
            </PageHeader>
            <div className="body basic">
                <PhotoOpsMapClient />
            </div>
        </Layout>
    );
}