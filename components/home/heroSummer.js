"use client"

import Image from "next/image";
import styles from "./hero.module.css";
import { ArrowLeft, ArrowSquareOut, Calendar } from "phosphor-react";
import { track } from "@vercel/analytics";
import AbstractHero from "./abstractHero";

export default function HeroSummer() {
  return (
    <AbstractHero
      backdrop={{
        src: "/summer.webp",
        blurDataURL: "/summer-xs.webp"
      }}
      cta={{
        description: "Available through August 20",
        buttons: [
          {
            href: '/reservations',
            label: 'Book your event',
            onClick: () => {
              track(
                'Reservations',
                { location: 'Hero Summer' }
              )
            },
            Icon: Calendar
          },
          {
            href: 'https://docs.google.com/forms/d/e/1FAIpQLSdNLOwNjhKnsI4QT18MCGOrEvxXP164zfLpXQOZSSBcJQxo3A/viewform?usp=header',
            label: 'Apply to be a vendor',
            onClick: () => {
              track(
                'Vendor Application',
                { location: 'Hero Summer' }
              )
            },
            Icon: ArrowSquareOut
          }
        ]
      }}
      seasonInfo={{
        title: "Open Soon",
        content: "We'e still getting ready for the season"
      }}
    />
  )
}