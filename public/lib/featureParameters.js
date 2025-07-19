import featureFlags from '@/public/flags/featureFlags.json'


export function getFeatureParam(key, param) {
    const flag = featureFlags[key];
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return null;
    }

    if (!flag.params) {
        console.warn(`Feature params not found: ${key}`);
        return null;
    }

    return flag.params[param];
}