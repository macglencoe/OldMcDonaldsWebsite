import { cache } from 'react';
import { evaluate, combine, flag } from 'flags/next';
import { createStatsigAdapter } from '@flags-sdk/statsig';

const STATSIG_ID_COOKIE = 'statsig-stable-id';

const GATE_DEFINITIONS = [
  { key: 'show_cookie_notice', defaultValue: true },
  { key: 'show_night_maze_ad', defaultValue: true },
  { key: 'show_flood_banner', defaultValue: true },
  { key: 'show_aux_search', defaultValue: true },
  { key: 'show_farm_swap_banner', defaultValue: false },
  { key: 'show_olr_banner', defaultValue: true },
  { key: 'show_vendor_promos', defaultValue: false },
  { key: 'show_vendors', defaultValue: true },
  { key: 'show_facebook_feed', defaultValue: true },
  { key: 'show_countdown', defaultValue: false },
  { key: 'show_contact_form', defaultValue: true },
  { key: 'maze_game_enabled', defaultValue: true },
  { key: 'use_google_forms', defaultValue: false },
  { key: 'use_fall_hero', defaultValue: false },
  { key: 'use_winter_hero', defaultValue: false },
  { key: 'show_survey', defaultValue: false}
];

const CONFIG_DEFINITIONS = [
  {
    statsigKey: 'show_flood_banner_config',
    targetKey: 'show_flood_banner',
    flagKey: 'show_flood_banner_config.config',
    defaultValue: {},
  },
  {
    statsigKey: 'announcements',
    defaultValue: { items: [] },
  },
];

const defaultGates = Object.freeze(
  Object.fromEntries(GATE_DEFINITIONS.map(({ key, defaultValue }) => [key, defaultValue])),
);

const statsigEnvironment = process.env.STATSIG_ENV_STRING?.trim();

const statsigAdapter = createStatsigAdapter({
  statsigServerApiKey: process.env.STATSIG_SERVER_API_KEY ?? '',
  statsigOptions: statsigEnvironment ? { environment: { tier: statsigEnvironment } } : undefined,
});

function identifyStatsigUser({ headers, cookies }) {
  const cookieId = cookies?.get(STATSIG_ID_COOKIE)?.value;
  const forwardedFor = headers?.get('x-forwarded-for') ?? '';
  const ip = forwardedFor.split(',')[0]?.trim() || undefined;
  const vercelId = headers?.get('x-vercel-id') ?? headers?.get('x-request-id') ?? undefined;
  const userAgent = headers?.get('user-agent') ?? undefined;
  const userID = cookieId ?? vercelId ?? ip ?? 'anonymous';

  const statsigUser = {
    userID,
  };

  if (ip) {
    statsigUser.ip = ip;
  }

  if (userAgent) {
    statsigUser.userAgent = userAgent;
  }

  if (vercelId) {
    statsigUser.custom = { vercelId };
  }

  return statsigUser;
}

function createGateFlag({ key, defaultValue }) {
  return flag({
    key,
    defaultValue,
    identify: identifyStatsigUser,
    adapter: statsigAdapter.featureGate(
      (gate) => (typeof gate?.value === 'boolean' ? gate.value : defaultValue),
      { exposureLogging: true },
    ),
  });
}

function createConfigFlag({ flagKey, defaultValue }) {
  if (!flagKey) {
    throw new Error('statsig config definitions require a flagKey');
  }
  return flag({
    key: flagKey,
    defaultValue,
    identify: identifyStatsigUser,
    adapter: statsigAdapter.dynamicConfig(
      (config) => (config?.value && typeof config.value === 'object' ? config.value : defaultValue),
      { exposureLogging: true },
    ),
  });
}

const gateFlagEntries = GATE_DEFINITIONS.map((definition) => ({
  key: definition.key,
  defaultValue: definition.defaultValue,
  declaration: createGateFlag(definition),
}));

const configFlagEntries = CONFIG_DEFINITIONS.map((definition) => {
  const statsigKey = definition.statsigKey ?? definition.flagKey?.split('.')?.[0];
  const flagKey = definition.flagKey ?? (statsigKey ? `${statsigKey}.config` : undefined);

  if (!flagKey) {
    throw new Error('statsig config definitions require either statsigKey or flagKey');
  }

  return {
    flagKey,
    targetKey: definition.targetKey ?? statsigKey ?? flagKey.split('.')[0],
    declaration: createConfigFlag({ ...definition, flagKey }),
  };
});

const gateDeclarations = gateFlagEntries.map((entry) => entry.declaration);
const configDeclarations = configFlagEntries.map((entry) => entry.declaration);

function formatArgEntry(key, raw) {
  if (raw && typeof raw === 'object' && Array.isArray(raw.values) && raw.key === key) {
    return {
      key,
      values: [...raw.values],
      raw,
    };
  }

  if (Array.isArray(raw)) {
    return {
      key,
      values: [...raw],
      raw,
    };
  }

  if (raw === undefined || raw === null) {
    return {
      key,
      values: [],
      raw,
    };
  }

  return {
    key,
    values: [raw],
    raw,
  };
}

function normalizeConfigValue(value) {
  if (!value || typeof value !== 'object') {
    return {
      raw: value,
      args: [formatArgEntry('value', value)],
    };
  }

  if (Array.isArray(value.args)) {
    return {
      raw: value,
      args: value.args.map((arg) => formatArgEntry(arg.key, arg)),
    };
  }

  const entries = Object.entries(value).map(([key, raw]) => formatArgEntry(key, raw));
  return {
    raw: value,
    args: entries,
  };
}

function lookupFeatureArg(config, param) {
  if (!config) return null;

  if (Array.isArray(config.args)) {
    const match = config.args.find((arg) => arg.key === param);
    if (match) return match;
  }

  if (config.raw && typeof config.raw === 'object' && param in config.raw) {
    return formatArgEntry(param, config.raw[param]);
  }

  return null;
}

async function readGates() {
  if (gateDeclarations.length === 0) {
    return { ...defaultGates };
  }

  const gateValues = await evaluate(gateDeclarations);
  const combinedGates = combine(gateDeclarations, gateValues);
  return {
    ...defaultGates,
    ...combinedGates,
  };
}

async function readConfigs() {
  if (configDeclarations.length === 0) {
    return {};
  }

  const configValues = await evaluate(configDeclarations);
  const combinedConfigs = combine(configDeclarations, configValues);

  const normalized = {};
  for (const entry of configFlagEntries) {
    const value = combinedConfigs[entry.flagKey];
    if (value === undefined) continue;
    normalized[entry.targetKey] = normalizeConfigValue(value);
  }

  return normalized;
}

async function loadFlagsRaw() {
  try {
    const [gates, configs] = await Promise.all([readGates(), readConfigs()]);
    return { gates, configs };
  } catch (error) {
    console.error('Failed to load Statsig feature flags; falling back to defaults.', error);
    return {
      gates: { ...defaultGates },
      configs: {},
    };
  }
}

const loadFlagsCached = cache(loadFlagsRaw);

export async function loadFlags(options = {}) {
  if (options?.force) {
    return loadFlagsRaw();
  }
  return loadFlagsCached();
}

export function getFeatureEvaluator(flags) {
  const snapshot = flags ?? { gates: defaultGates };
  const gates = snapshot.gates ?? defaultGates;
  return (key) => Boolean(gates[key]);
}

export function getFeatureArgumentGetter(flags) {
  const snapshot = flags ?? { configs: {} };
  const configs = snapshot.configs ?? {};
  return (key, param) => lookupFeatureArg(configs[key], param);
}
