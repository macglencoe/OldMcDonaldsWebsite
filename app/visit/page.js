import Layout from "@/components/layout"
import PageHeader from "@/components/pageHeader"
import VisitClient from "./visitClient"

export const metadata = {
    title: "Visit",
    description: "Plan your visit to Old McDonald’s Pumpkin Patch in Inwood, WV. Get directions, hours, parking info, payment options, accessibility, and visitor details."
}

export const Visit = () => {
    return (
        <Layout>
            <PageHeader>Visit</PageHeader>
            <VisitClient />
        </Layout>
    )
}

export default Visit