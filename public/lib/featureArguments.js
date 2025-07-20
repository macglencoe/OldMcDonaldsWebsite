import featureFlags from '@/public/flags/featureFlags.json'


export function getFeatureArg(key, param) {
    const flag = featureFlags[key];
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return null;
    }

    if (!flag.args) {
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