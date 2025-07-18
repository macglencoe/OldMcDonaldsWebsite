import { createFeatureGate } from "@/flags";
import HeroFall from "./heroFall";
import HeroWinter from "./heroWinter";
import HeroSummer from "./heroSummer";



export default async function Hero() {
    const useSummerHero = await createFeatureGate("use_summer_hero")();
    const useFallHero = await createFeatureGate("use_fall_hero")();
    const useWinterHero = await createFeatureGate("use_winter_hero")()

    console.log(useSummerHero, useFallHero, useWinterHero)

    if (useFallHero) {
        return <HeroFall />;
    } else if (useWinterHero) {
        return <HeroWinter />;
    } else if (useSummerHero) { // change to just `else` to make default
        return <HeroSummer />;
    }
}