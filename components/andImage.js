
import styles from './andImge.module.css'

export const AndImage = ({ src, children }) => {
    return (
        <div className={styles.andImage}>
            <div>
                {children}
            </div>
            <img src={src}></img>
        </div>
    )
}