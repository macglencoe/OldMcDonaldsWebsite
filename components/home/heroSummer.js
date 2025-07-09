"use client"

import Image from "next/image";
import styles from "./hero.module.css";
import { ArrowLeft, ArrowSquareOut } from "phosphor-react";

export default function HeroSummer() {
  return (
    <section className={styles.hero}>
      <Image
        src="/summer.jpg"
        width={1500}
        height={1000}
        alt="Old McDonald's"
      />
      <div className={styles.cover}>
        <div className={styles.top}>
          <h1 className={styles.tagline}>Real Farm Fun</h1>
          <div>
            <p className={styles.description}>Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.seasonInfo}>
            <div className={styles.card}>
              <h2 style={{ fontFamily: 'Inter'}}>Site Under Construction</h2>
              <p>We're doing some minor setup before the full site is live. Check back soon!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}