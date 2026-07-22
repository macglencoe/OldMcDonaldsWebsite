import { getConfig } from "@/lib/configs";
import PricingPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function() {
    const pricing = await getConfig('pricing');
    const parsed = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;
    return (
        <PricingPageClient pricing={parsed} />
    )
}
