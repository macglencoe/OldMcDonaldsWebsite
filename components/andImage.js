
import styles from './andImge.module.css'

export const AndImage = ({ src, children }) => {
    return (
        <div className={styles.andImage}>
            <div className={styles.backdrop}>

                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <img src={src}></img>
        </div>
    )
}