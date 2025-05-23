import styles from './oldMcDonutsAd.module.css'

export default function OldMcDonutsAd() {
    return (
        <div className={styles.container}>
            <img className={styles.backdrop} src='https://images.unsplash.com/photo-1683508860120-04c80c721095?q=80&w=1615&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'></img>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>Old McDonuts</h2>
                    <p>Coffee, Apple Cider Donuts, and Slushies, right on the farm</p>
                </div>
                <div>
                    <a className={styles.button} href="/vendors/old-mcdonuts">Menu</a>
                    <div className={styles.divider}></div>
                </div>
            </div>
        </div>
    )
}