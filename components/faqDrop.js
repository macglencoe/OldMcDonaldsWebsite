import styles from './faqDrop.module.css'

export const FAQDrop = ({ q, children }) => {
    return (
        <div className={styles.wrapper}>
            <details>
                <summary>
                    {q}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-312 208-584l88-88 184 184 184-184 88 88-272 272Z"/></svg>
                </summary>
                <div className={styles.content}>
                    {children}
                </div>
            </details>
        </div>
    )
}