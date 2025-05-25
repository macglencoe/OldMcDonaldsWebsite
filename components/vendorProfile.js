import styles from './vendorProfile.module.css'

export const VendorProfile = ({ name, subtitle, description, imgSrc, website, menu }) => {
    return (
        <div className={styles.container}>
            {imgSrc && <img src={imgSrc}></img>}
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.name}>{name}</span>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
                <div className={styles.content}>
                    <p>{description}</p>
                    <div className={styles.interactionPanel}>
                        {website &&
                            <a href={website} className={styles.button}>Website</a>
                        }
                        {menu &&
                            <a href={menu} className={styles.button}>Menu</a>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorProfile