
import Image from "next/image";
import styles from "./hero.module.css";

export default function HeroWinter() {
    return (
        <section className={styles.hero}>
              <Image
                src="https://images.unsplash.com/photo-1574457572226-7cc7ea7dd6c2?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1500}
                height={1000}
                alt="Old McDonald's"
              />
              <div className={styles.cover}>
                <div className={styles.top}>
                  <h1 className={styles.tagline}>Real Farm Fun</h1>
                  <div>
                    <p className={styles.winter + " " + styles.description}>Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family</p>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.cta}>
                    <p>Want to reminisce?</p>
                    <div className={styles.buttons}>
                      <a href="/gallery">
                        <ArrowLeft size={24} weight="bold" />
                        Gallery
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Closed for the season</h2>
                      <p>We'll see you next year!</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    )
}