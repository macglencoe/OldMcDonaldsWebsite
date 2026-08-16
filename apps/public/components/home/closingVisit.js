import Image from "next/image";
import Link from "next/link";
import styles from "./homeSections.module.css";

export default function ClosingVisit() {
  return (
    <section className={styles.closingSection} aria-labelledby="closing-visit-heading">
      <Image fill sizes="100vw" src="/forgeSunset.jpg" alt="A warm sunset over Glencoe Farm" />
      <div className={styles.closingCard}>
        <p className={styles.eyebrow}>Inwood, West Virginia</p>
        <h2 className={styles.heading} id="closing-visit-heading">Come spend the day with us</h2>
        <p>1597 Arden Nollville Road<br />Inwood, WV 25428</p>
        <div className={styles.closingActions}>
          <Link href="/visit">Get directions</Link>
          <a href="tel:304-839-2330">Call (304) 839-2330</a>
        </div>
      </div>
    </section>
  );
}
