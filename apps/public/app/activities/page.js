import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import ActivitiesClient from "./activitiesClient";
import { getSiteSettingsData } from "@/utils/siteSettingsServer";

export const metadata = {
    title: "Activities",
    description: "Explore all the fun at Old McDonald’s Pumpkin Patch"
}

export default async function Activities() {
    const settings = await getSiteSettingsData();
    return (
        <Layout>
            <PageHeader subtitle={settings.season.name}>Activities</PageHeader>
            <ActivitiesClient />
        </Layout>
    );
}
