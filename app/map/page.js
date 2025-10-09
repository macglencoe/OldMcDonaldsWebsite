import Action from "@/components/action";
import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import PhotoOpsMap from "@/components/photoOpsMap";
import PhotoOpsMapClient from "@/components/photoOpsMapClient";

export const metadata = {
    title: "Map",
    description: "View a detailed map of Old McDonald’s Pumpkin Patch in Inwood, WV. Get directions, locate activities, and plan your day at our corn maze and fall festival."
}

export default function PhotoOps() {
    return (
        <Layout>
            <PageHeader 
                subtitle="Explore the farm"
                content={(
                    <Action as="a" href="/visit" className={'mx-auto'} variant="outline-secondary">Click here for directions</Action>
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