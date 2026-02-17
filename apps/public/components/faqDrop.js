"use client"
import styles from './faqDrop.module.css'
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Wheelchair } from 'phosphor-react';

export const FAQDrop = ({ q, children, ADA }) => {

    return (
        <div className={styles.wrapper}>
            <details>
                <summary>
                    <div className='flex flex-row gap-4 items-center'>
                        {ADA && 
                            <div className='p-2 bg-blue-600 rounded-full'><Wheelchair size={35} weight='bold' color='white'/></div>
                        }
                        {q}
                    </div>
                    <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-312 208-584l88-88 184 184 184-184 88 88-272 272Z"/></svg>
                </summary>
                <div className={styles.content}>
                    <ReactMarkdown
                        components={{
                            a: ({ href, children }) => <Link href={href}>{children}</Link>,
                        }}
                    >
                        {children}
                    </ReactMarkdown>
                </div>
            </details>
        </div>
    )
}