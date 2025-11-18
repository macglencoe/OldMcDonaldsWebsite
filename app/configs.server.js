import { cache } from 'react';
import { evaluate, combine, flag } from 'flags/next';
import { identifyStatsigUser, statsigAdapter } from './statsig';

/**
 * Statsig dynamic config declarations and the keys we expose locally.
 */
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
  {
    statsigKey: 'calendar_schedule',
    defaultValue: {
      schedule: [],
      initialDate: '',
    },
  },
  {
    statsigKey: 'pricing',
    defaultValue: {},
  },
  {
    statsigKey: 'weekly-hours',
    defaultValue: {
      friday: {},
      saturday: {},
      sunday: {}
    }
  }
];

/**
 * Create a Statsig dynamic config definition.
 *
 * @param {{flagKey:string, defaultValue:object}} param0
 * @returns {import('flags/next').FlagDeclaration}
 */
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

const configDeclarations = configFlagEntries.map((entry) => entry.declaration);

/**
 * Normalize a raw config entry into the `args` shape consumers expect.
 *
 * @param {string} key
 * @param {unknown} raw
 * @returns {{key:string, values:Array<unknown>, raw:unknown}}
 */
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

/**
 * Convert a Statsig dynamic config payload into the shared normalized structure.
 *
 * @param {unknown} value
 * @returns {{raw:unknown, args:Array<{key:string, values:Array<unknown>, raw:unknown}>}}
 */
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

/**
 * Evaluate all configured dynamic configs and normalize their payloads.
 *
 * @returns {Promise<Record<string, {raw:unknown, args:Array<{key:string, values:Array<unknown>, raw:unknown>}>>>}
 */
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

/**
 * Fetch configs with error handling and default fallbacks.
 *
 * @returns {Promise<Record<string, ReturnType<typeof normalizeConfigValue>>>}
 */
async function loadConfigsRaw() {
  try {
    return await readConfigs();
  } catch (error) {
    console.error('Failed to load Statsig configs; falling back to defaults.', error);
    return {};
  }
}

const loadConfigsCached = cache(loadConfigsRaw);

/**
 * Resolve all configs, memoized per-request unless forced.
 *
 * @param {{force?:boolean}} [options]
 * @returns {Promise<Record<string, ReturnType<typeof normalizeConfigValue>>>}
 */
export async function getConfigs(options = {}) {
  if (options?.force) {
    return loadConfigsRaw();
  }
  return loadConfigsCached();
}

/**
 * Fetch a single config value by key.
 *
 * @param {string} key
 * @param {{force?:boolean}} [options]
 * @returns {Promise<ReturnType<typeof normalizeConfigValue>|undefined>}
 */
export async function getConfig(key, options = {}) {
  if (!key) return undefined;
  const configs = await getConfigs(options);
  return configs[key];
}
