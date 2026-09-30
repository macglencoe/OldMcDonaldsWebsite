"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight, Campfire, Flashlight, MoonStars } from "phosphor-react";
import styles from "./nightMazeBanner.module.css";

const highlights = [
  { Icon: Flashlight, label: "Corn maze after dark" },
  { Icon: MoonStars, label: "Hayrides through the woods" },
  { Icon: Campfire, label: "Private campfires" },
];

export default function NightMazeBanner() {
  return (
    <section className={styles.promotion} aria-labelledby="night-maze-promo-heading">
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.imageWrap}>
          <Image alt="Campfires glowing in the darkness during the Night Maze" className={styles.image} fill sizes="(max-width: 800px) 100vw, 50vw" src="/bonfires.jpg" />
          <div className={styles.imageShade} aria-hidden="true" />
          <div className={styles.dateCard}><span>Bring a flashlight</span><strong>October nights</strong></div>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Night Maze at Old McDonald&apos;s</p>
          <h2 id="night-maze-promo-heading">Come see the farm after dark.</h2>
          <p className={styles.intro}>Bring a flashlight and find your way through the corn maze at night. We&apos;ll also have hayrides, campfires, vendors, and the playground open.</p>
          <ul className={styles.highlights}>
            {highlights.map(({ Icon, label }) => <li key={label}><Icon aria-hidden="true" weight="duotone" /><span>{label}</span></li>)}
          </ul>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/activities/night-maze" onClick={() => track("Night Maze Click", { location: "Home Promotion" })}>Night Maze details <ArrowRight aria-hidden="true" weight="bold" /></Link>
            <Link className={styles.secondaryAction} href="/activities/night-maze#reservations" onClick={() => track("Campfire Reservation Click", { location: "Home Night Maze Promotion" })}><Campfire aria-hidden="true" weight="fill" /> Request a campfire</Link>
          </div>
          <p className={styles.disclaimer}>Submitting a campfire request does not reserve one. We&apos;ll contact you to confirm availability.</p>
        </div>
      </div>
    </section>
  );
}
