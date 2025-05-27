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
        <section className={styles.rates + " basic"}>
          <Image
            src="/willow.jpg"
            width={1500}
            height={1000}
            alt="Old McDonald's"
          />
          <div className={styles.overlay}></div>
          <h1>Rates</h1>
          <ul>
            <li>
              <h2>Admission</h2>
              <div className={styles.rateInfo}>
                <h3>Includes:</h3>
                <ul>
                  <li><a href="/activities/corn-maze">Corn Maze</a></li>
                  <li><a href="/activities/nature-trails">Nature Trails</a></li>
                  <li>Photo Opportunities</li>
                  <li>Various Games</li>
                  <li><a href="/activities/flower-fields">Sunflower Fields</a></li>
                  <li><a href="/activities/petting-zoo">Petting Zoo</a></li>
                  <li>Playground</li>
                  <li><a href="/vendors">Picnic Area</a></li>
                </ul>
              </div>
              <div className={styles.price}>
                <b>$6</b>
                <span>/ person*</span>
                <p>Must be paid at the admission booth</p>
              </div>
            </li>
            <li>
              <h2>Hayride</h2>
              <div className={styles.rateInfo}>
                <p>Take a tour of the farm on a hayride, featuring scenic views</p>
                <p>Rules apply</p>
              </div>
              <a className="button" href="/activities/hayrides">Learn More</a>
              <div className={styles.price}>
                <b>$4</b>
                <span>/ person*</span>
                <p>Must be paid at the admission booth</p>
              </div>
            </li>
            <li>
              <h2>U-Pick Pumpkins</h2>
              <div className={styles.rateInfo}>
                <p>Pick your own pumpkins and enjoy a scenic walk</p>
                <p>Carts for hauling pumpkins are available, but may be limited on busy days</p>
              </div>
              <a className="button" href="/activities/pumpkin-patch">Learn More</a>
              <div className={styles.price}>
                <b>¢50</b>
                <span>/ pound</span>
                <p>Must be paid at weighing station</p>
                <p>Card & cash are accepted</p>
              </div>
            </li>
            <li>
              <h2>U-Pick Flowers</h2>
              <div className={styles.rateInfo}>
                <p>Pick from our Zinnia & Sunflower fields, and enjoy a scenic walk</p>
                <p>Cutters and cups are available at the arrangement wagon, near the flower fields</p>
                <p>Vases are also available for sale at the arrangement wagon, priced individually</p>
              </div>
              <a className="button" href="/activities/flower-fields">Learn More</a>
              <div className={styles.price}>
                <b>$7</b>
                <span>/ cup</span>
                <p>Must be paid at the weighing station</p>
              </div>
            </li>
          </ul>
          <p>*Age 3 and under are free</p>

        </section>

        <OldMcDonutsAd
          title="Old McDonuts"
          description="Coffee, Apple Cider Donuts, and Slushies, right on the farm"
          href="/vendors/old-mcdonuts"
          buttonText="Menu"
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
      </div>
    </Layout>
  )
}
