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

  const canonicalBase = "https://www.oldmcdonaldspumpkinpatchwv.com";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Old McDonald's Pumpkin Patch",
      alternateName: "Old McDonald's Pumpkin Patch & Corn Maze",
      url: canonicalBase,
      logo: `${canonicalBase}/logo.png`,
      image: [
        `${canonicalBase}/hillview.jpg`,
        `${canonicalBase}/entrance.jpg`,
        `${canonicalBase}/pumpkinsCloseUp.jpg`,
        `${canonicalBase}/hayrideGroupPhoto.jpg`,
        `${canonicalBase}/sunflower.jpg`,
        `${canonicalBase}/localMap.png`
      ],
      telephone: "+1-304-839-2330",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1597 Arden Nollville Rd",
        addressLocality: "Inwood",
        addressRegion: "WV",
        postalCode: "25428",
        addressCountry: "US"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 39.38273,
        longitude: -78.04342
      },
      hasMap: `${canonicalBase}/map`,
      sameAs: [
        "https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze",
        "https://www.instagram.com/oldmcdonaldspumpkin/",
        "https://www.tiktok.com/@glencoefarmwv"
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Friday",
          opens: "13:00",
          closes: "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "11:00",
          closes: "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "12:00",
          closes: "18:00"
        }
      ],
      priceRange: "$"
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Old McDonald's Pumpkin Patch",
      url: canonicalBase,
      potentialAction: {
        "@type": "SearchAction",
        target: `${canonicalBase}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];




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
