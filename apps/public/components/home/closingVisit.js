"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./homeSections.module.css";
import useSiteSettings from "@/hooks/useSiteSettings";

export default function ClosingVisit() {
  const settings = useSiteSettings();
  return (
    <section className={styles.closingSection} aria-labelledby="closing-visit-heading">
      <Image fill sizes="100vw" src="/forgeSunset.jpg" alt="A warm sunset over Glencoe Farm" />
      <div className={styles.closingCard}>
        <p className={styles.eyebrow}>{settings.business.addressLocality}, {settings.business.addressRegion}</p>
        <h2 className={styles.heading} id="closing-visit-heading">Come spend the day with us</h2>
        <p>{settings.business.streetAddress}<br />{settings.business.addressLocality}, {settings.business.addressRegion} {settings.business.postalCode}</p>
        <div className={styles.closingActions}>
          <Link href="/visit">Get directions</Link>
          <a href={`tel:${settings.business.phone}`}>Call {settings.business.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
