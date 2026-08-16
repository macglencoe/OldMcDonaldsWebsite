import Layout from "@/components/layout";
import Testimonials from "@/components/testimonials";
import styles from "./page.module.css";
import FacebookFeed from "@/components/facebookFeed";
import ContactForm from "@/components/contactForm";
import Hero from "@/components/home/hero";
import NightMazeBanner from "@/components/home/nightMazeBanner";
import FloodBanner from "@/components/home/floodBanner";
import AuxSearch from "@/components/home/auxSearch";
import FarmSwapBanner from "@/components/home/farmSwapBanner";
import OneLaneRoadBanner from "@/components/home/oneLaneRoadBanner";
import SurveyBanner from "@/components/home/surveyBanner";
import { getFlagEvaluator, getFlags } from "./flags.server";
import Calendar from "@/components/calendarClient"; 
import InfoStrip from "@/components/home/infoStrip";
import ActivityShowcase from "@/components/home/activityShowcase";
import FarmStory from "@/components/home/farmStory";
import PricingOverview from "@/components/home/pricingOverview";
import ClosingVisit from "@/components/home/closingVisit";
import VendorHighlights from "@/components/home/vendorHighlights";

const featuredVendors = [
  {
    name: "Old McDonuts",
    description: "Fresh apple cider donuts, hot coffee, and ice-cold cider slushies served right here on the farm.",
    image: {
      src: "/oldMcDonuts.jpg",
      alt: "The Old McDonuts concession trailer at the farm",
      position: "center 48%",
    },
    actions: [
      { href: "/vendors/old-mcdonuts", label: "View menu" },
    ],
  },
  {
    name: "Twisted Taters",
    description: "Crispy butterfly potatoes, burgers, and satisfying festival favorites for a full day at the farm.",
    image: {
      src: "/twistedTaters.jpg",
      alt: "The Twisted Taters food trailer at the farm",
      position: "center",
    },
    actions: [
      { href: "/vendors", label: "Learn more" },
    ],
  },
];

export const metadata = {
  title: "Real Farm Fun - Old McDonald's Pumpkin Patch",
  description: "Celebrate fall in Berkeley County, WV at Old McDonald’s Pumpkin Patch. Enjoy hayrides, a corn maze, petting zoo, flower fields, and family-friendly farm fun all season long."
}

export default async function Home() {
  const flags = await getFlags();
  const isFeatureEnabled = getFlagEvaluator(flags);

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

        {/* {isFeatureEnabled("show_flood_banner") && (
          <FloodBanner />
        )} */}

        


        <section className={styles.hero}>
          <Hero />
        </section>

        <InfoStrip />

        {isFeatureEnabled("show_aux_search") &&
          <AuxSearch />
        }

        {isFeatureEnabled("show_survey") &&
          <SurveyBanner href="https://docs.google.com/forms/d/e/1FAIpQLSckFc0F7xg2RFf8z_Qg2cYz7LSfBSCCaVdQQwbENOV00yOU-w/viewform?usp=header" />
        }

        <Calendar />

        <ActivityShowcase />

        <FarmStory />

        <PricingOverview />
        {isFeatureEnabled("show_farm_swap_banner") &&
          <FarmSwapBanner />
        }

        {isFeatureEnabled("show_olr_banner") &&
          <OneLaneRoadBanner />
        }



        {isFeatureEnabled("show_vendor_promos") && (
          <VendorHighlights vendors={featuredVendors} />
        )
        }
        <Testimonials />
        <FacebookFeed />
        {isFeatureEnabled("show_contact_form") &&
          <div className="flex justify-center bg-foreground"><ContactForm theme="onDark" /></div>
        }
        <ClosingVisit />
      </div>
    </Layout>
  )
}
