
import styles from './andImge.module.css'

export const AndImage = ({ src, children, style, fromUnsplash }) => {
    return (
        <div className={styles.andImage + " " + (
            style == "night" ? styles.night : ""
        )}>
            <div className={styles.backdrop}>

                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <div className={styles.image}>
                <img src={src}></img>
                {fromUnsplash && 
                    <div className={styles.overlay}>
                        <a href='/attribution'>Attribution</a>
                    </div>}
            </div>
        </div>
    )
}