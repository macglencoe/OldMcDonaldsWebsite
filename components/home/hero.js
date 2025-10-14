import HeroFall from "./heroFall";
import HeroWinter from "./heroWinter";
import HeroSummer from "./heroSummer";
import { getFeatureEvaluator } from "@/app/flags";

export default function Hero() {
  const isFeatureEnabled = getFeatureEvaluator();
  const now = new Date();

  if (isFeatureEnabled("use_fall_hero", { now })) {
    return <HeroFall />;
  }

  if (isFeatureEnabled("use_winter_hero", { now })) {
    return <HeroWinter />;
  }

  return <HeroSummer />;
}
