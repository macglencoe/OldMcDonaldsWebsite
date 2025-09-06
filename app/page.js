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
import Hero from "@/components/home/hero";
import { isFeatureEnabled } from "@/public/lib/featureEvaluator";
import NightMazeBanner from "@/components/home/nightMazeBanner";
import FloodBanner from "@/components/home/floodBanner";
import AuxSearch from "@/components/home/auxSearch";
import FarmSwapBanner from "@/components/home/farmSwapBanner";
import OneLaneRoadBanner from "@/components/home/oneLaneRoadBanner";


export const metadata = {
  title: "Real Farm Fun - Old McDonald's Pumpkin Patch",
  description: "Celebrate fall in Berkeley County, WV at Old McDonald’s Pumpkin Patch. Enjoy hayrides, a corn maze, petting zoo, flower fields, and family-friendly farm fun all season long."
}

export default async function Home() {


  const events = [
    { name: 'Event 1', date: '2025-10-12' },
    { name: 'Event 2', date: '2025-10-15' },
    { name: 'Event 3', date: '2025-10-20' },
  ];

  const octoberOpenDates = [
    1, 2, 7, 8, 9, 14, 15, 16, 21, 22, 23, 28, 29, 30
  ];


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Old McDonald's Pumpkin Patch",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1597 Arden Nollville Rd",
      addressLocality: "Inwood",
      addressRegion: "WV",
      postalCode: "25428",
      addressCountry: "US"
    },
    telephone: "+1-304-839-2330",
    openingHours: ["Fr 13:00-18:00", "Sa 11:00-18:00", "Su 12:00-18:00"],
    url: "https://www.oldmcdonaldspumpkinpatch.com"
  };




  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.wrapper}>
        {isFeatureEnabled("show_night_maze_ad", {
          now: new Date()
        }) && (
            <NightMazeBanner />
          )
        }

        {isFeatureEnabled("show_flood_banner") && (
          <FloodBanner />
        )}


        <section className={styles.hero}>
          <Hero />
        </section>

        {isFeatureEnabled("show_aux_search") &&
          <AuxSearch />
        }

        <Season />

        <FarmSwapBanner />

        {isFeatureEnabled("show_olr_banner") &&
          <OneLaneRoadBanner />
        }


        <YearProgressBar highlightStart="2025-09-20" highlightEnd="2025-11-02" />
        <Rates />

        {isFeatureEnabled("show_vendor_promos") && (
          <>
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
          </>
        )
        }
        <TestimonialCarousel />
        <FacebookFeed />
        {isFeatureEnabled("show_contact_form") &&
          <div className="flex justify-center bg-foreground"><ContactForm theme="onDark" /></div>
        }
      </div>
    </Layout>
  )
}
