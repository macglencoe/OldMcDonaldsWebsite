import fallbackFlags from '@/public/flags/featureFlags.json';
import {
    setFeatureFlags as setEvaluatorFlags,
    createFeatureEvaluator
} from '@/public/lib/featureEvaluator';
import {
    setFeatureArgumentFlags,
    createFeatureArgumentGetter
} from '@/public/lib/featureArguments';

let lastKnownGood = fallbackFlags ?? {};

function updateCaches(flags) {
    setEvaluatorFlags(flags);
    setFeatureArgumentFlags(flags);
}

export async function loadFlags() {
    try {
        if (!process.env.FLAGS_URL) {
            console.warn('FLAGS_URL is not configured; using fallback flags');
            updateCaches(lastKnownGood);
            return lastKnownGood;
        }

        const res = await fetch(process.env.FLAGS_URL, {
            next: { revalidate: 30 },
            headers: { Accept: 'application/json' }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch feature flags: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        if (json && typeof json === 'object') {
            lastKnownGood = json;
        } else {
            console.warn('Flags response was not an object; retaining last known flags');
        }
    } catch (err) {
        console.error("Failed to load flags", err);
    }

    updateCaches(lastKnownGood);
    return lastKnownGood;
}

export function getFlags() {
    return lastKnownGood;
}

export function getFeatureEvaluator(flags = lastKnownGood) {
    return createFeatureEvaluator(flags);
}

export function getFeatureArgumentGetter(flags = lastKnownGood) {
    return createFeatureArgumentGetter(flags);
}
