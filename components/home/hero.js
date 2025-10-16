import HeroFall from "./heroFall";
import HeroWinter from "./heroWinter";
import HeroSummer from "./heroSummer";
import { getFeatureEvaluator, loadFlags } from "@/app/flags";

export default async function Hero() {
  const flags = await loadFlags();
  const isFeatureEnabled = getFeatureEvaluator(flags);
  const now = new Date();

  if (isFeatureEnabled("use_fall_hero", { now })) {
    return <HeroFall />;
  }

  if (isFeatureEnabled("use_winter_hero", { now })) {
    return <HeroWinter />;
  }

  return <HeroSummer />;
}
