"use client";

import Link from "next/link";
import { useFlags } from "@/app/FlagsContext";

export default function ArticleFeatureLink({ href, children, flag }) {
    const { isFeatureEnabled } = useFlags();
    if (flag && !isFeatureEnabled(flag)) return null;

    return (
        <Link href={href}>
            {children} <span aria-hidden="true">↗</span>
        </Link>
    );
}
