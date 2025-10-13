import {
    setFeatureFlags as setEvaluatorFlags,
    createFeatureEvaluator
} from '@/public/lib/featureEvaluator';
import {
    setFeatureArgumentFlags,
    createFeatureArgumentGetter
} from '@/public/lib/featureArguments';

let lastKnownGood = null;

function updateCaches(flags) {
    if (flags && typeof flags === 'object') {
        setEvaluatorFlags(flags);
        setFeatureArgumentFlags(flags);
    } else {
        setEvaluatorFlags({});
        setFeatureArgumentFlags({});
    }
}

export async function loadFlags() {
    if (!process.env.FLAGS_URL) {
        console.error('FLAGS_URL is not configured; cannot load feature flags');
        lastKnownGood = null;
        updateCaches(null);
        return null;
    }

    try {
        const res = await fetch(process.env.FLAGS_URL, {
            next: { revalidate: 30 },
            headers: { Accept: 'application/json' }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch feature flags: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        if (!json || typeof json !== 'object') {
            throw new Error('Flags response was not an object');
        }

        lastKnownGood = json;
        updateCaches(lastKnownGood);
        return lastKnownGood;
    } catch (err) {
        console.error("Failed to load flags", err);
        lastKnownGood = null;
        updateCaches(null);
        return null;
    }
}

export function getFlags() {
    return lastKnownGood;
}

export function getFeatureEvaluator(flags = lastKnownGood) {
    return createFeatureEvaluator(flags && typeof flags === 'object' ? flags : {});
}

export function getFeatureArgumentGetter(flags = lastKnownGood) {
    return createFeatureArgumentGetter(flags && typeof flags === 'object' ? flags : {});
}
