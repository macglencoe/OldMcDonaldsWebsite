import Layout from '@/components/layout'
import styles from './page.module.css'
import { FAQDrop } from '@/components/faqDrop';
import faqStatic from '@/public/data/faq.json';
import PageHeader from '@/components/pageHeader';
import FaqSearchList from '@/components/faqSearchList';
import { Suspense } from 'react';
import { getConfig } from '../configs.server';

export const metadata = {
    title: "FAQ",
    description: "Find answers to common questions about Old McDonald’s Pumpkin Patch. Learn about admission, hours, accessibility, parking, tickets, and seasonal farm activities."
}

export const FAQ = async () => {
    const faqConfig = await getConfig('faq');
    const faq = faqConfig?.raw.questions ?? faqStatic
    console.log(faq)
    return (
        <Layout>
            <PageHeader subtitle="Frequently Asked Questions">FAQ</PageHeader>
            <div className={'body basic' + ' ' + styles.body}>
                <Suspense fallback={<div aria-busy="true">Loading FAQ…</div>}>
                    <FaqSearchList items={faq} />
                </Suspense>
            </div>
        </Layout>
    )
}

export default FAQ;