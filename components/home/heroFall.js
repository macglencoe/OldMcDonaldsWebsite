"use client"
import Image from "next/image";
import styles from "./hero.module.css";
import { ArrowLeft, NavigationArrow } from "phosphor-react";
import { track } from "@vercel/analytics";
import AbstractHero from "./abstractHero";

export default function HeroFall() {
  return (
    <AbstractHero
      backdrop={{
        src: "https://images.unsplash.com/photo-1572978385565-b4c1c4b9ce17?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEwfHxwdW1wa2luJTIwcGF0Y2h8ZW58MHx8fHwxNzQzMDE4NTUwfDA&ixlib=rb-4.0.3&w=1500",
      }}
      cta={{
        description: "See what we're all about",
        buttons: [
          {
            href: '/activities',
            label: 'Activities',
            onClick: () => {
              track(
                'Activities',
                { location: 'Hero Fall' }
              )
            },
            Icon: ArrowLeft
          },
          {
            href: '/visit',
            label: 'Visit',
            onClick: () => {
              track(
                'Visit',
                { location: 'Hero Fall' }
              )
            },
            Icon: NavigationArrow
          }
        ]
      }}
      seasonInfo={{
        title: 'Open Now',
        content: 'Come visit us on the weekend!'
      }}
    />
  )
}