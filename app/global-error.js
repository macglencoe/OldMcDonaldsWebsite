"use client";

import "@/app/globals.css";
import ErrorPage from "@/components/error/errorPage";

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <ErrorPage error={error} reset={reset} message="Something went catastrophically wrong" />
            </body>
        </html>
    );
}