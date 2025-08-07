"use client"

import Image from "next/image";
import styles from "./hero.module.css";
import { ArrowLeft, ArrowSquareOut } from "phosphor-react";
import { track } from "@vercel/analytics";

export default function HeroSummer() {
    return (
        <section className={styles.hero}>
              <Image
                src="/summer.webp"
                width={1500}
                height={1000}
                priority
                placeholder="blur"
                blurDataURL="/summer-xs.webp"
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
                    <p>Available through August 20</p>
                    <div className={styles.buttons}>
                      <a href="/reservations" onClick={() => 
                        track(
                          'Reservations',
                          { location: 'Hero Summer' }
                        )
                      }>
                        <ArrowLeft size={24} weight="bold" />
                        Book Your Event
                      </a>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdNLOwNjhKnsI4QT18MCGOrEvxXP164zfLpXQOZSSBcJQxo3A/viewform?usp=header" target="_blank" onClick={() => {
                        track(
                          'Vendor Application',
                          { location: 'Hero Summer' }
                        )
                      }}>
                        Vendor Application
                        <ArrowSquareOut size={24} weight="bold" />
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Open Soon</h2>
                      <p>We'e still getting ready for the season</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    )
}