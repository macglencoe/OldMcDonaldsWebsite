"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "phosphor-react";
import { usePricingConfig } from "@/hooks/usePricingConfig";
import styles from "./homeSections.module.css";

const included = [
  "Corn maze",
  "Nature trails",
  "Farm animals",
  "Playground and games",
  "Flower fields",
  "Photo opportunities",
];

function formatPrice(price) {
  const amount = price?.amount;
  if (typeof amount !== "number") return "See rates";
  if (amount < 1) return `${Math.round(amount * 100)}¢`;
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

function formatPriceWithPer(price) {
  const formattedPrice = formatPrice(price);
  return price?.per ? `${formattedPrice}/${price.per}` : formattedPrice;
}

export default function PricingOverview() {
  const pricing = usePricingConfig();
  const admission = pricing.admission;
  const addOns = [
    ["Hayrides", pricing.hayride],
    ["U-pick pumpkins", pricing["pumpkin-patch"]],
    ["U-pick flowers", pricing["flower-cup"]],
  ];

  return (
    <section className={`${styles.section} ${styles.pricingSection}`} id="rates" aria-labelledby="home-pricing-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Family-friendly pricing</p>
        <h2 className={styles.heading} id="home-pricing-heading">A full day of farm fun starts here</h2>
        <p className={styles.intro}>General admission covers the activities families enjoy most. A few seasonal experiences are priced separately.</p>

        <div className={styles.pricingGrid}>
          <article className={styles.admissionCard}>
            <h3>General admission</h3>
            <p className={styles.price}>
              {formatPrice(admission)}{admission?.per && <span>/{admission.per}</span>}
            </p>
            <p>Children age 3 and under are free.</p>
          </article>

          <article className={styles.includedCard}>
            <h3>Included with admission</h3>
            <ul className={styles.includedList}>
              {included.map((item) => (
                <li key={item}><CheckCircle aria-hidden="true" size={22} weight="fill" /> {item}</li>
              ))}
            </ul>
            <p className={styles.addons}>
              <strong>Optional add-ons:</strong>{" "}
              {addOns.map(([label, price], index) => (
                <span key={label}>{index > 0 ? " · " : ""}{label} {formatPriceWithPer(price)}</span>
              ))}
            </p>
          </article>
        </div>

        <Link className={styles.pricingLink} href="/pricing">
          See complete pricing <ArrowRight aria-hidden="true" size={20} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
