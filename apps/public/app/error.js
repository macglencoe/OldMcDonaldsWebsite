"use client"

import ContactForm from "@/components/contactForm"
import { ErrorPage } from "@oldmc/ui";
import Layout from "@/components/layout"

export default function NormalError({ error, reset }) {

    return (
        <Layout><ErrorPage error={error} reset={reset} message="Something went wrong"/></Layout>
    )
}
