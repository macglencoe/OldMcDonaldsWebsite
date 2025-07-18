import { createFeatureGate } from "@/flags";
import HeroFall from "./heroFall";
import HeroWinter from "./heroWinter";
import HeroSummer from "./heroSummer";
import { isFeatureEnabled } from "@/public/lib/featureEvaluator";



export default async function Hero() {
    const useFallHero = isFeatureEnabled(
        'use_fall_hero', 
        { now: new Date() }
    );
    const useWinterHero = isFeatureEnabled(
        'use_winter_hero', 
        { now: new Date() }
    );

    if (useFallHero) {
        return <HeroFall />;
    } else if (useWinterHero) {
        return <HeroWinter />;
    } else {
        return <HeroSummer />;
    }
}