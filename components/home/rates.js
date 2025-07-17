"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Ticket,
  Plant,
  Flower,
} from "phosphor-react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import pricing from "@/public/data/pricing";

// Mapping Phosphor icons
const ICON_MAP = {
  Admission: Ticket,
  Hayride: () => <svg className="mx-auto mb-2 text-accent " xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="var(--accent)" viewBox="0 0 256 256"><path d="M240,188a28,28,0,1,1-28-28A28,28,0,0,1,240,188ZM68,128a44,44,0,1,0,44,44A44,44,0,0,0,68,128Z" opacity="0.2"></path><path d="M240,165.41V134a15.89,15.89,0,0,0-11.4-15.32l-.21-.06L192,108.71V72a8,8,0,0,0-16,0v32.38l-24-6.5V56h8a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16h8V88H40a8,8,0,0,0,0,16H68a68.07,68.07,0,0,1,68,68v12a8,8,0,0,0,8,8h32.23A36,36,0,1,0,240,165.41ZM68,88H64V56h72v66.77A83.92,83.92,0,0,0,68,88Zm84,26.45L224,134v20.1A36,36,0,0,0,178.06,176H152ZM212,208a20,20,0,1,1,20-20A20,20,0,0,1,212,208ZM68,120a52,52,0,1,0,52,52A52.06,52.06,0,0,0,68,120Zm0,88a36,36,0,1,1,36-36A36,36,0,0,1,68,208Zm12-36a12,12,0,1,1-12-12A12,12,0,0,1,80,172Z"></path></svg>,
  "U-Pick Pumpkins": () => <svg className="mx-auto mb-2 text-accent " xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="var(--accent)" viewBox="0 0 256 256"><path d="M138.54,149.46C106.62,96.25,149.18,43.05,239.63,48.37,245,138.82,191.75,181.39,138.54,149.46ZM16.26,88.26c-3.8,64.61,34.21,95,72.21,72.21C111.27,122.47,80.87,84.46,16.26,88.26Z" opacity="0.2"></path><path d="M247.63,47.89a8,8,0,0,0-7.52-7.52c-51.76-3-93.32,12.74-111.18,42.22-11.8,19.48-11.78,43.16-.16,65.74a71.37,71.37,0,0,0-14.17,26.95L98.33,159c7.82-16.33,7.52-33.36-1-47.49C84.09,89.73,53.62,78,15.79,80.27a8,8,0,0,0-7.52,7.52c-2.23,37.83,9.46,68.3,31.25,81.5A45.82,45.82,0,0,0,63.44,176,54.58,54.58,0,0,0,87,170.33l25,25V224a8,8,0,0,0,16,0V194.51a55.61,55.61,0,0,1,12.27-35,73.91,73.91,0,0,0,33.31,8.4,60.9,60.9,0,0,0,31.83-8.86C234.89,141.21,250.67,99.65,247.63,47.89ZM86.06,146.74l-24.41-24.4a8,8,0,0,0-11.31,11.31l24.41,24.41c-9.61,3.18-18.93,2.39-26.94-2.46C32.47,146.31,23.79,124.32,24,96c28.31-.25,50.31,8.47,59.6,23.81C88.45,127.82,89.24,137.14,86.06,146.74Zm111.06-1.36c-13.4,8.11-29.15,8.73-45.15,2l53.69-53.7a8,8,0,0,0-11.31-11.32L140.65,136c-6.76-16-6.15-31.76,2-45.15,13.94-23,47-35.8,89.33-34.83C232.94,98.34,220.14,131.44,197.12,145.38Z"></path></svg>,
  "U-Pick Flowers": Flower,
};

export default function Rates() {
  const items = [
    {
      title: "Admission",
      details: [
        "Corn Maze",
        "Nature Trails",
        "Photo Opportunities",
        "Various Games",
        "Sunflower Fields",
        "Petting Zoo",
        "Playground",
        "Picnic Area",
      ],
      price: pricing.admission,
    },
    {
      title: "Hayride",
      details: [
        "Scenic farm tour on a hay wagon",
        "Family-friendly, rules apply",
      ],
      cta: { href: "/activities/hayrides", label: "Learn More" },
      price: pricing.hayride
    },
    {
      title: "U-Pick Pumpkins",
      details: [
        "Choose your own pumpkins in the patch",
        "Carts available (limited on busy days)",
      ],
      cta: { href: "/activities/pumpkin-patch", label: "Learn More" },
      price: pricing["pumpkin-patch"],
    },
    {
      title: "U-Pick Flowers",
      details: [
        "Zinnia & Sunflower fields to pick from",
        "Cutters & cups available onsite",
        "Vases sold at the arrangement wagon",
      ],
      cta: { href: "/activities/flower-fields", label: "Learn More" },
      price: pricing["flower-cup"]
    },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background */}
      <Image
        src="/willow.jpg"
        alt="Scenic farm"
        fill
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent -z-10" />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-[Satisfy] text-center text-white mb-12 relative"
      >
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-accent rounded"></span>
        Our Rates
      </motion.h1>

      {/* Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {items.map((item) => (
          <RateCard key={item.title} {...item} />
        ))}
      </div>

      <p className="text-center text-lg text-white/80 mt-12 italic">
        *Age 3 and under are free
      </p>
    </section>
  );
}

function RateCard({ title, details, price, cta }) {
  const Icon = ICON_MAP[title];
  return (
    <motion.article
      whileHover={{ scale: 1.05 }}
      className="group bg-foreground/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col"
    >
      {/* Icon and Title */}
      <div className="p-6 text-center border-b border-foreground/30">
        {Icon && (
          <Icon
            size={48}
            weight="duotone"
            className="mx-auto mb-2 text-accent"
          />
        )}
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      {/* Details */}
      <ul className="flex-1 p-6 space-y-2 text-white">
        {Array.isArray(details) ? (
          details.map((line) => (
            <li key={line} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{line}</span>
            </li>
          ))
        ) : (
          <li>{details}</li>
        )}
      </ul>

      {/* CTA */}
      {cta && (
        <Link
          href={cta.href}
          className="mx-6 mb-4 py-2 text-center text-white bg-accent rounded-full font-semibold hover:bg-accent/90 transition"
          onClick={() => {
            track(
              'Rate Card CTA',
              { title }
            )
          }}
        >
          {cta.label}
        </Link>
      )}

      {/* Price Tag */}
      <div className="bg-foreground/90 text-center p-4">
        <p className="text-4xl font-bold text-background">
          {price.amount >= 1.0 ? `$${price.amount}` : `¢${(price.amount * 100).toFixed(0)}`}
        </p>
        {price.per && <p className="text-sm text-background/80 -mt-2">/ {price.per}</p>}
        {price.notes.map((note) => (
          <p key={note} className="text-xs text-background/60 mt-1">
            {note}
          </p>
        ))}
      </div>
    </motion.article>
  );
}
