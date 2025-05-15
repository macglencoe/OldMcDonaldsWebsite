
import styles from './andImge.module.css'

export const AndImage = ({ src, children, style }) => {
    return (
        <div className={styles.andImage + " " + (
            style == "night" ? styles.night : ""
        )}>
            <div className={styles.backdrop}>

                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <img src={src}></img>
        </div>
    )
}