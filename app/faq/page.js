import Layout from '@/components/layout'
import styles from './page.module.css'
import { FAQDrop } from '@/components/faqDrop';
import faq from '@/public/data/faq.json';
import PageHeader from '@/components/pageHeader';

export const FAQ = () => {
    return (
        <Layout>
            <PageHeader subtitle="Frequently Asked Questions">FAQ</PageHeader>
            <div className={'body basic' + ' ' + styles.body}>
                {faq.map((faq, i) => (
                    <FAQDrop key={i} q={faq.question}>
                        {faq.answer}
                    </FAQDrop>
                ))}
            </div>
        </Layout>
    )
}

export default FAQ;