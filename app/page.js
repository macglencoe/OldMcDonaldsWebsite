import Image from "next/image";
import Layout from "@/components/layout";
import Calendar from "@/components/calendar";
import { createFeatureGate } from "@/flags";
import YearProgressBar from "@/components/yearProgress";
import OldMcDonutsAd from "@/components/oldMcDonutsAd";
import TestimonialCarousel from "@/components/testimonials";
import HomePage from "@/components/homePage";




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
    <HomePage summerHeroGate={summerHeroGate} fallHeroGate={fallHeroGate} winterHeroGate={winterHeroGate} />
  )
}
