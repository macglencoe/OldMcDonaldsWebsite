import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import ActivitiesClient from "./activitiesClient";

export const metadata = {
    title: "Activities"
}

export default function Activities() {
    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Activities</PageHeader>
            <ActivitiesClient />
        </Layout>
    );
}