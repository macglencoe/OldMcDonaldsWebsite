import featureFlags from '@/public/flags/featureFlags.json'


export function getFeatureArg(key, paramKey) {
    const flag = featureFlags[key];
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return null;
    }

    const args = flag.args;
    if (!Array.isArray(args)) {
        console.warn(`Feature args not found or invalid for: ${key}`);
        return null;
    }

    const arg = args.find(a => a && a.key === paramKey);
    if (!arg) {
        console.warn(`Feature param not found: ${key}.${paramKey}`);
        return null;
    }

    switch (arg.type) {
        case 'dates':
            return Array.isArray(arg.values) ? arg.values : [];
        case 'boolean':
            return typeof arg.value === 'boolean' ? arg.value : String(arg.value) === 'true';
        case 'number':
            return typeof arg.value === 'number' ? arg.value : Number(arg.value);
        case 'string':
        default:
            return arg.value ?? '';
    }
}
