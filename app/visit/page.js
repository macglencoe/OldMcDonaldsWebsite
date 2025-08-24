import Layout from "@/components/layout"
import PageHeader from "@/components/pageHeader"
import VisitClient from "./visitClient"

export const metadata = {
    title: "Visit"
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