import { Statsig } from "@flags-sdk/statsig";

let init;
async function ensureInit() {
    if (init) return init;
    const key = process.env.STATSIG_SERVER_API_KEY;
    init = Statsig.initialize(key);
    //await init;
    return init;
}

export async function getConfig(key, user = { userID: 'admin'}) {
    await ensureInit();
    return Statsig.getConfigSync(user, key).value ?? null;
}