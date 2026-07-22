import { getConfig } from "@/lib/configs";
import FAQsPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function() {
    const faqs = await getConfig('faq');
    const parsed = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;

    return (
        <FAQsPageClient faqs={parsed.questions} />
    )
}
