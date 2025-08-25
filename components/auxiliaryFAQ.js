"use client"
import faq from '@/public/data/faq.json'
import { FAQDrop } from './faqDrop'
import { usePathname } from 'next/navigation'

export default function AuxiliaryFAQ() {
    const pathname = usePathname();

    const normalize = (p) =>
    (p ?? '/').replace(/\/+$/, '') || '/'

    const current = normalize(pathname)

    const items = (faq).filter(
        qa => Array.isArray(qa.pages) && 
            qa.pages.some(p => normalize(p) === current)
    )

    if (items.length === 0) {
        return null
    }

    
    return (
        <section 
            className='max-w-5xl mx-auto p-3' 
            id='faq'
            aria-labelledby='faq-heading'
        >
            <div className='flex flex-row gap-6 items-center' aria-hidden='true'>
                <div className='h-1 w-full bg-foreground/50 flex-1'/>
                <h2 id='faq-heading' className='text-center text-3xl uppercase py-5 text-foreground/50'>Frequently Asked Questions</h2>
                <div className='h-1 w-full bg-foreground/50 flex-1'/>
            </div>
            <ul>
                {items.map((qa, i) => {
                    return (
                        <li key={i} className='py-2'>
                            <FAQDrop q={qa.question} ADA={qa.ADA}>
                                {qa.answer}
                            </FAQDrop>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}