"use client"

import ErrorPage from "@/components/error/errorPage"

export default function NormalError({ error, reset }) {

    return (
        <ErrorPage error={error} reset={reset} message="Something went wrong"/>
    )
}