import Layout from "@/components/layout";
import Testimonials from "@/components/testimonials";
import styles from "./page.module.css";
import FacebookFeed from "@/components/facebookFeed";
import ContactForm from "@/components/contactForm";
import Hero from "@/components/home/hero";
import NightMazeBanner from "@/components/home/nightMazeBanner";
import FloodBanner from "@/components/home/floodBanner";
import FarmSwapBanner from "@/components/home/farmSwapBanner";
import OneLaneRoadBanner from "@/components/home/oneLaneRoadBanner";
import { getFlagEvaluator, getFlags } from "./flags.server";
import Calendar from "@/components/calendarClient"; 
import VisitOverview from "@/components/home/visitOverview";
import ActivityShowcase from "@/components/home/activityShowcase";
import FarmStory from "@/components/home/farmStory";
import PricingOverview from "@/components/home/pricingOverview";
import ClosingVisit from "@/components/home/closingVisit";
import VendorHighlights from "@/components/home/vendorHighlights";
import { getConfig } from "./configs.server";
import { getSiteSettingsData } from "@/utils/siteSettingsServer";

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
  const [flags, siteSettingsConfig, weeklyHoursConfig] = await Promise.all([
    getFlags(),
    getConfig("site-settings"),
    getConfig("weekly-hours"),
  ]);
  const isFeatureEnabled = getFlagEvaluator(flags);
  const settings = await getSiteSettingsData({ config: siteSettingsConfig });
  const weeklyHours = weeklyHoursConfig?.raw ?? {};

  const canonicalBase = "https://www.oldmcdonaldspumpkinpatchwv.com";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: settings.business.name,
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
      telephone: settings.business.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.business.streetAddress,
        addressLocality: settings.business.addressLocality,
        addressRegion: settings.business.addressRegion,
        postalCode: settings.business.postalCode,
        addressCountry: settings.business.addressCountry
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: settings.business.latitude,
        longitude: settings.business.longitude
      },
      hasMap: `${canonicalBase}/map`,
      sameAs: [
        settings.social.facebookUrl,
        settings.social.instagramUrl,
        settings.social.tiktokUrl
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Friday",
          opens: weeklyHours.friday?.open?.slice(0, 5) ?? "11:00",
          closes: weeklyHours.friday?.close?.slice(0, 5) ?? "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: weeklyHours.saturday?.open?.slice(0, 5) ?? "11:00",
          closes: weeklyHours.saturday?.close?.slice(0, 5) ?? "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: weeklyHours.sunday?.open?.slice(0, 5) ?? "12:00",
          closes: weeklyHours.sunday?.close?.slice(0, 5) ?? "18:00"
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

        <VisitOverview />

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
