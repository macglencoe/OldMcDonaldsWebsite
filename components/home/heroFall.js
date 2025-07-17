"use client"
import Image from "next/image";
import styles from "./hero.module.css";
import { ArrowLeft } from "phosphor-react";
import { track } from "@vercel/analytics";

export default function HeroFall() {
    return (
        <section className={styles.hero}>
              <Image
                src="https://images.unsplash.com/photo-1572978385565-b4c1c4b9ce17?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEwfHxwdW1wa2luJTIwcGF0Y2h8ZW58MHx8fHwxNzQzMDE4NTUwfDA&ixlib=rb-4.0.3&w=1500"
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
                  <div className={styles.cta}>
                    <p>See what we're all about</p>
                    <div className={styles.buttons}>
                      <a href="/visit" onClick={() => {
                        track(
                          'Visit',
                          { location: 'Hero Fall' }
                        )
                      }}>
                        Visit
                      </a>
                      <a href="/activities" onClick={() => {
                        track(
                          'Activities',
                          { location: 'Hero Fall' }
                        )
                      }}>
                        Activities
                        <ArrowLeft size={24} weight="bold" />
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Open Now</h2>
                      <p>Come visit us on the weekend!</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    )
}