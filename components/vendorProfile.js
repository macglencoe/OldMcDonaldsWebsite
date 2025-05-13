import styles from './vendorProfile.module.css'

export const VendorProfile = ({ name, subtitle, imgSrc, website }) => {
    return (
        <div className={styles.container}>
            {imgSrc && <img src={imgSrc}></img>}
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.name}>{name}</span>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
                <p>A little blurb about what they sell</p>
                <p>Like awesome hotdogs, chips, and drinks</p>
                {website &&
                    <a href={website} className={styles.website}>Website</a>
                }
            </div>
        </div>
    )
}

export default VendorProfile