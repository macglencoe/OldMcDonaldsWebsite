import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import { isFeatureEnabled } from "@/public/lib/featureEvaluator";
import VendorMenu from "@/components/vendorMenu";
import { notFound } from "next/navigation";
import { desc } from "framer-motion/client";

export const metadata = {
  title: "Vendor: Twisted Taters",
  description:
    "Crispy butterfly potatoes and savory toppings at Twisted Taters, a featured vendor at Old McDonald’s Pumpkin Patch.",
  openGraph: {
    title: "Vendor: Twisted Taters",
    description:
      "Crispy butterfly potatoes and savory toppings at Twisted Taters, a featured vendor at Old McDonald’s Pumpkin Patch.",
    url: "/vendors/twisted-taters",
    images: ["/twistedTaters.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor: Twisted Taters",
    description: "Crispy butterfly potatoes with tasty toppings.",
    images: ["/twistedTaters.jpg"],
  },
};

export default function TwistedTaters() {
  const useTwistedTatersMenu = isFeatureEnabled("use_taters_menu");
  if (!useTwistedTatersMenu) return notFound();

  const SECTIONS = [
    {
      id: "taters",
      title: "Food",
      items: [
        { name: "Butterfly Potatoes", price: 0.0},
        { name: "Baked Potato", price: 0.0},
        { name: "Cheeseburger", price: 0.0,},
        { name: "Another placeholder", price: 7.0, desc: "They can even have descriptions"},
      ],
    },
    {
      id: "sides",
      title: "Sauces & Toppings",
      items: [
        { name: "Nacho Cheese",},
        { name: "Sour Cream"},
        { name: "Chili", price: 1.0, desc: "*Only available on select days*" },
      ],
    },
    {
      id: "drinks",
      title: "Drinks",
      items: [
        { name: "Bottled Water", price: 1.0, desc: "16.9 oz" },
        { name: "Soda", price: 2.0, desc: "Assorted" },
      ],
    },
  ];

  return (
    <Layout>
      <PageHeader subtitle="Butterfly Potatoes">Twisted Taters</PageHeader>
      <VendorMenu
        sections={SECTIONS}
        bgSrc="/twistedTaters.jpg"
        bgAlt="Twisted Taters stand with butterfly potatoes"
        mapHref="/map?x=39.38310990806668&y=-78.04274712816566"
      />
    </Layout>
  );
}
