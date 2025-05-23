import styles from './oldMcDonutsAd.module.css'

export default function OldMcDonutsAd( { title, description, href, src, alt, buttonText } ) {
    return (
        <div className={styles.container}>
            <img className={styles.backdrop} src={src} alt={alt}></img>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
                <div>
                    <a className={styles.button} href={href}>{buttonText}</a>
                    <div className={styles.divider}></div>
                </div>
            </div>
        </div>
    )
}