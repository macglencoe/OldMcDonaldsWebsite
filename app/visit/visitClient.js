'use client'
import styles from "./page.module.css"
import Locator from "@/components/locator";
import Hours from "@/components/hours";
import { track } from "@vercel/analytics";

export default function VisitClient() {
    const address = "1597 Arden Nollville Rd. Inwood, WV 25428"
    const copyAddress = () => navigator.clipboard.writeText(address)
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <div className={styles.location}>
                    <div className={styles.mapContainer}><Locator /></div>
                    <div className={styles.info}>
                        <p>Our farm is located in Inwood, West Virginia, right off I-81</p>
                        <div className={styles.address}>
                            <p>1597 Arden Nollville Rd.</p>
                            <p>Inwood, WV 25428</p>
                            <button className={styles.copy} onClick={() => {
                                copyAddress();
                                alert("Copied address to clipboard!");
                                track('Address Copied', { location: 'Visit Page' })
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 -960 960 960"><path d="M371.31-230q-41.03 0-69.67-28.64T273-328.31v-463.38q0-41.03 28.64-69.67T371.31-890h343.38q41.03 0 69.67 28.64T813-791.69v463.38q0 41.03-28.64 69.67T714.69-230H371.31Zm0-86h343.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-463.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H371.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v463.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Zm-166 252q-41.03 0-69.67-28.64T107-162.31v-549.38h86v549.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h429.38v86H205.31ZM359-316v-488 488Z" /></svg>
                            </button>
                        </div>
                        <p>Our parking lot is in the field north of the big white barn</p>
                        <p>Please look for parking attendants</p>
                        <p><b>Hours:</b></p>
                        <Hours />
                    </div>
                </div>
            </div>
        </div>
    )
}