import Layout from "@/components/layout";
import ContactClient from "./contactClient";
import PageHeader from "@/components/pageHeader";

export const metadata = {
    title: "Contact Us",
    description:
        "Get in touch with Old McDonald’s Pumpkin Patch & Corn Maze in Inwood, WV. Find our address, hours, and send us a message.",
};

export default function Contact() {
    return (
        <Layout>
            <PageHeader subtitle="We’d love to hear from you">Contact Us</PageHeader>

            <ContactClient />
        </Layout>
    );
}

