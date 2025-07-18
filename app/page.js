import Image from "next/image";
import Layout from "@/components/layout";
import { createFeatureGate } from "@/flags";
import YearProgressBar from "@/components/yearProgress";
import OldMcDonutsAd from "@/components/oldMcDonutsAd";
import TestimonialCarousel from "@/components/testimonials";
import styles from "./page.module.css";
import HeroFall from "@/components/home/heroFall";
import HeroSummer from "@/components/home/heroSummer";
import HeroWinter from "@/components/home/heroWinter";
import Season from "@/components/home/season";
import FacebookFeed from "@/components/facebookFeed";
import Rates from "@/components/home/rates";
import ContactForm from "@/components/contactForm";




export default async function Home() {


  const events = [
    { name: 'Event 1', date: '2025-10-12' },
    { name: 'Event 2', date: '2025-10-15' },
    { name: 'Event 3', date: '2025-10-20' },
  ];

  const octoberOpenDates = [
    1, 2, 7, 8, 9, 14, 15, 16, 21, 22, 23, 28, 29, 30
  ];


  const summerHeroGate = await createFeatureGate("summer_hero")();
  const fallHeroGate = await createFeatureGate("fall_hero")();
  const winterHeroGate = await createFeatureGate("winter_hero")();







  return (
    <Layout>
      <div className={styles.wrapper}>
        <section className={styles.hero}>
          {fallHeroGate && // Fall Hero
            <HeroFall />
          }

          {(summerHeroGate || (!fallHeroGate && !winterHeroGate && !summerHeroGate)) && // or default
            <HeroSummer />
          }

          {winterHeroGate && // Winter Hero
            <HeroWinter />
          }
        </section>
        <Season/>



        <YearProgressBar highlightStart="2025-09-20" highlightEnd="2025-11-02" />
        <Rates/>

        <OldMcDonutsAd
          title="Old McDonuts"
          description="Coffee, Apple Cider Donuts, and Slushies, right on the farm"
          menu="/vendors/old-mcdonuts"
          src="/oldMcDonuts.jpg"
        />
        <OldMcDonutsAd
          title="Twisted Taters"
          description="Butterfly Potatoes, Burgers, & more!"
          href="/vendors"
          buttonText="See More"
          src="/twistedTaters.jpg"
        />
        <TestimonialCarousel />
        <FacebookFeed />
        <div className="flex justify-center bg-foreground"><ContactForm theme="onDark" /></div>
      </div>
    </Layout>
  )
}
