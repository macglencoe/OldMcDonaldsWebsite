let featureFlags = {};

/**
 * Replace the in-memory feature flag cache used for arguments.
 * @param {Record<string, any>} flags
 */
export function setFeatureArgumentFlags(flags) {
    if (flags && typeof flags === 'object') {
        featureFlags = flags;
    } else {
        featureFlags = {};
    }
}

function locateFeatureArg(flags, key, param) {
    const source = flags && typeof flags === 'object' ? flags : featureFlags;
    const flag = source?.[key];
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return null;
    }

    if (!Array.isArray(flag.args) || flag.args.length === 0) {
        console.warn(`Flag has no arguments: ${key}`);
        return null;
    }

    for (const arg of flag.args) {
        if (arg.key === param) {
            return arg;
        }
    }

    console.warn(`Argument not found: ${param}`);
    return null;
}

export function getFeatureArg(key, param) {
    return locateFeatureArg(featureFlags, key, param);
}

export function createFeatureArgumentGetter(flags) {
    return (key, param) => locateFeatureArg(flags, key, param);
}
