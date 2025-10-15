import { createClient as createEdgeConfigClient } from '@vercel/edge-config';
import fallbackFlagsJson from '@/public/flags/featureFlags.json' assert { type: 'json' };
import {
    setFeatureFlags as setEvaluatorFlags,
    createFeatureEvaluator
} from '@/public/lib/featureEvaluator';
import {
    setFeatureArgumentFlags,
    createFeatureArgumentGetter
} from '@/public/lib/featureArguments';
import { track } from '@vercel/analytics/server';

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG ?? null;
const EDGE_CONFIG_ITEM_KEY = process.env.EXPERIMENTATION_CONFIG_ITEM_KEY ?? null;

const edgeConfigClient = EDGE_CONFIG_URL ? createEdgeConfigClient(EDGE_CONFIG_URL) : null;
const REFRESH_INTERVAL_MS = 60_000;

let lastKnownGood = cloneFlags(fallbackFlagsJson);
let lastRefreshTimestamp = 0;
let inFlightRefresh = null;
let loggedEdgeConfigWarning = false;

seedCaches(lastKnownGood);

function cloneFlags(source) {
    if (!source || typeof source !== 'object') return {};
    if (typeof structuredClone === 'function') {
        return structuredClone(source);
    }
    return JSON.parse(JSON.stringify(source));
}

function seedCaches(flags) {
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

async function tryEdgeConfig() {
    if (!edgeConfigClient) {
        if (EDGE_CONFIG_URL && !loggedEdgeConfigWarning) {
            console.warn('Edge Config connection string is present but the client could not be created.');
            loggedEdgeConfigWarning = true;
        }
        return null;
    }

    if (!EDGE_CONFIG_ITEM_KEY) {
        if (!loggedEdgeConfigWarning) {
            console.warn('Edge Config item key is not set; loading all Edge Config items as feature flags.');
            loggedEdgeConfigWarning = true;
        }
        return loadAllFlagsFromEdgeConfig();
    }

    try {
        const data = await edgeConfigClient.get(EDGE_CONFIG_ITEM_KEY);
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return {
                flags: cloneFlags(data),
                source: 'edge_config'
            };
        }

        console.warn(`Edge Config item "${EDGE_CONFIG_ITEM_KEY}" was missing or not an object; attempting to load all items instead.`);
        await safeTrack('flags_fetch_failure', {
            reason: 'edge_config_invalid',
            status: '0'
        });
        const merged = await loadAllFlagsFromEdgeConfig();
        if (merged) return merged;
        return null;
    } catch (err) {
        console.error('Failed to load feature flags from Edge Config', err);
        await safeTrack('flags_fetch_failure', {
            reason: 'edge_config_error',
            status: '0'
        });
        const merged = await loadAllFlagsFromEdgeConfig();
        if (merged) return merged;
        return null;
    }
}

async function loadAllFlagsFromEdgeConfig() {
    if (!edgeConfigClient) return null;

    try {
        const allItems = await edgeConfigClient.getAll();
        if (!allItems || typeof allItems !== 'object') {
            await safeTrack('flags_fetch_failure', {
                reason: 'edge_config_all_invalid',
                status: '0'
            });
            return null;
        }

        const mergedEntries = Object.entries(allItems).filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value));
        if (mergedEntries.length === 0) {
            await safeTrack('flags_fetch_failure', {
                reason: 'edge_config_all_empty',
                status: '0'
            });
            return null;
        }

        const mergedFlags = Object.fromEntries(mergedEntries);
        return {
            flags: cloneFlags(mergedFlags),
            source: 'edge_config_all'
        };

    } catch (err) {
        console.error('Failed to load feature flags from Edge Config (getAll)', err);
        await safeTrack('flags_fetch_failure', {
            reason: 'edge_config_get_all_error',
            status: '0'
        });
        return null;
    }
}

async function refreshFlags(force = false) {
    const now = Date.now();
    if (!force && now - lastRefreshTimestamp < REFRESH_INTERVAL_MS) {
        return lastKnownGood;
    }

    if (inFlightRefresh) {
        return inFlightRefresh;
    }

    const refreshPromise = (async () => {
        const sources = [tryEdgeConfig];

        for (const loadSource of sources) {
            const result = await loadSource();
            if (result?.flags) {
                lastKnownGood = result.flags;
                seedCaches(lastKnownGood);
                lastRefreshTimestamp = Date.now();
                await safeTrack('flags_fetch_success', {
                    source: result.source
                });
                return lastKnownGood;
            }
        }

        if (!force) {
            console.warn('No remote feature flag source succeeded; continuing with last known good flags.');
        } else {
            console.error('Forced feature flag refresh failed; retaining last known good flags.');
        }
        lastRefreshTimestamp = Date.now();
        return lastKnownGood;
    })().catch(async (err) => {
        console.error('Unexpected error while refreshing feature flags', err);
        await safeTrack('flags_fetch_failure', {
            reason: 'unexpected_error',
            status: '0'
        });
        lastRefreshTimestamp = Date.now();
        return lastKnownGood;
    }).finally(() => {
        inFlightRefresh = null;
    });

    inFlightRefresh = refreshPromise;
    return refreshPromise;
}

export async function loadFlags(options = {}) {
    const { force = false } = options ?? {};
    await refreshFlags(force);
    return lastKnownGood;
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
