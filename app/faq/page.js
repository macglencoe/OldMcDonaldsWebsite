import Layout from '@/components/layout'
import styles from './page.module.css'
import { FAQDrop } from '@/components/faqDrop';
import faq from '@/public/data/faq.json';

export const FAQ = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>FAQ</h1>
                <span>Frequently Asked Questions</span>
            </div>
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