import {
    setFeatureFlags as setEvaluatorFlags,
    createFeatureEvaluator
} from '@/public/lib/featureEvaluator';
import {
    setFeatureArgumentFlags,
    createFeatureArgumentGetter
} from '@/public/lib/featureArguments';
import { track } from '@vercel/analytics/server';

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

async function safeTrack(event, props) {
    try {
        await track(event, props);
    } catch (err) {
        console.error(`Failed to record analytics event "${event}"`, err);
    }
}

function extractPath(url) {
    try {
        const parsed = new URL(url);
        return parsed.pathname.replace(/^\//, '') || parsed.pathname || parsed.hostname || 'unknown';
    } catch {
        return 'unknown';
    }
}

async function handleFailure({ reason, status, blobPath, clearCaches = false }) {
    await safeTrack('flags_fetch_failure', {
        reason,
        status: String(status ?? 0)
    });

    if (blobPath) {
        await safeTrack('flags_blob_not_found', {
            path: blobPath,
            runtime: 'server'
        });
    }

    if (clearCaches) {
        lastKnownGood = null;
        updateCaches(null);
        await safeTrack('flags_cache_cleared', {
            trigger: reason,
            runtime: 'server'
        });
    } else {
        console.warn(`Retaining previous feature flags after ${reason}; status=${status ?? 'n/a'}`);
    }

    return lastKnownGood;
}

export async function loadFlags() {
    if (!process.env.FLAGS_URL) {
        console.error('FLAGS_URL is not configured; cannot load feature flags');
        lastKnownGood = null;
        updateCaches(null);
        await safeTrack('flags_env_missing', { runtime: 'server' });
        await safeTrack('flags_cache_cleared', { trigger: 'env_missing', runtime: 'server' });
        return null;
    }

    try {
        const res = await fetch(process.env.FLAGS_URL, {
            next: { revalidate: 30 },
            headers: { Accept: 'application/json' }
        });

        if (!res.ok) {
            const reason = res.status === 404 ? 'blob_not_found' : 'http_error';
            const path = res.status === 404 ? extractPath(process.env.FLAGS_URL) : undefined;
            console.error(`Failed to fetch feature flags: ${res.status} ${res.statusText}`);
            return handleFailure({ reason, status: res.status, blobPath: path, clearCaches: false });
        }

        let json;
        try {
            json = await res.json();
        } catch (parseErr) {
            console.error('Failed to parse flags response', parseErr);
            return handleFailure({ reason: 'parse_error', status: res.status, clearCaches: true });
        }

        if (!json || typeof json !== 'object') {
            console.error('Flags response was not an object');
            return handleFailure({ reason: 'invalid_payload', status: res.status, clearCaches: true });
        }

        lastKnownGood = json;
        updateCaches(lastKnownGood);
        await safeTrack('flags_fetch_success', { source: 'remote' });
        return lastKnownGood;
    } catch (err) {
        console.error("Failed to load flags", err);
        return handleFailure({ reason: 'fetch_error', status: 0, clearCaches: false });
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
