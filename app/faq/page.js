import Layout from '@/components/layout'
import styles from './page.module.css'
import { FAQDrop } from '@/components/faqDrop';
import faq from '@/public/data/faq.json';
import PageHeader from '@/components/pageHeader';
import FaqSearchList from '@/components/faqSearchList';

export const FAQ = () => {
    return (
        <Layout>
            <PageHeader subtitle="Frequently Asked Questions">FAQ</PageHeader>
            <div className={'body basic' + ' ' + styles.body}>
                <FaqSearchList items={faq} />
            </div>
        </Layout>
    )
}

export default FAQ;