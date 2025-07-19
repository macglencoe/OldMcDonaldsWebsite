import featureFlags from '@/public/flags/featureFlags.json'


export function getFeatureArg(key, param) {
    const flag = featureFlags[key];
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return null;
    }

    if (!flag.args) {
        console.warn(`Feature param not found: ${key}`);
        return null;
    }

    return flag.args[param];
}