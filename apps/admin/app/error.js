"use client";

import { ErrorPage } from "@oldmc/ui";

export default function NormalError({ error, reset }) {
    const message = 
        error?.publicMessage ||
        (error?.name === "ConfigError"
            ? "Configuration issue. Please contact the developer"
            : "Something went wrong"
        )
    return (
        <ErrorPage error={error} reset={reset} message={message} buttons={[
            {
                label: "Go Home",
                href: "/"
            },
            {
                label: "Contact the developer",
                href: "mailto:developer@oldmcdonaldspumpkinpatch.com",
                target: "_blank"
            }
        ]}/>
    )
}