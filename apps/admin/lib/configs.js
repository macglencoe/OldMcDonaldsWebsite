import { Statsig } from "@flags-sdk/statsig";

export class ConfigError extends Error {
    constructor(message, { code, publicMessage, cause } = {}) {
        super(message, { cause })
        this.name = "ConfigError"
        this.code = code
        this.publicMessage = publicMessage
    }
}

let init;
async function ensureInit() {
    if (init) return init;
    const key = process.env.STATSIG_SERVER_API_KEY;
    if (!key) {
        throw new ConfigError("STATSIG_SERVER_API_KEY is not set", {
            code: "STATSIG_API_KEY_MISSING",
            publicMessage: "Configuration issue. Please contact the developer."
        })
    }
    try {
        init = Statsig.initialize(key);
        await init
        return init;
    } catch (err) {
        init = undefined
        throw new ConfigError("Statsig initialization failed", {
            code: "STATSIG_INIT_FAILED",
            publicMessage: "Configuration issue. Please contact the developer.",
            cause: err
        })
    }
}

export async function getConfig(key, user = { userID: 'admin'}) {
    await ensureInit();
    return Statsig.getConfigSync(user, key).value ?? null;
}