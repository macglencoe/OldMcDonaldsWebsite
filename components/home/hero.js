import HeroFall from "./heroFall";
import HeroWinter from "./heroWinter";
import HeroSummer from "./heroSummer";
import { getFlagEvaluator, getFlags } from "@/app/flags.server";

export default async function Hero() {
  const flags = await getFlags();
  const isFeatureEnabled = getFlagEvaluator(flags);
  const now = new Date();

  if (isFeatureEnabled("use_fall_hero", { now })) {
    return <HeroFall />;
  }

  if (isFeatureEnabled("use_winter_hero", { now })) {
    return <HeroWinter />;
  }

  return <HeroSummer />;
}
