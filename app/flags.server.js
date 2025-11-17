import { cache } from 'react';
import { evaluate, combine, flag } from 'flags/next';
import { identifyStatsigUser, statsigAdapter } from './statsig';

/**
 * Feature gate definitions along with their local default values.
 */
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
  { key: 'show_survey', defaultValue: false },
];

const defaultGates = Object.freeze(
  Object.fromEntries(GATE_DEFINITIONS.map(({ key, defaultValue }) => [key, defaultValue])),
);

/**
 * Create a Statsig flag declaration for a gate so it can be evaluated server-side.
 *
 * @param {{key:string, defaultValue:boolean}} param0
 * @returns {import('flags/next').FlagDeclaration}
 */
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

const gateFlagEntries = GATE_DEFINITIONS.map((definition) => ({
  key: definition.key,
  defaultValue: definition.defaultValue,
  declaration: createGateFlag(definition),
}));

const gateDeclarations = gateFlagEntries.map((entry) => entry.declaration);

/**
 * Evaluate all configured gates against Statsig and merge them with defaults.
 *
 * @returns {Promise<Record<string, boolean>>}
 */
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

/**
 * Fetch the latest gate snapshot with error handling.
 *
 * @returns {Promise<Record<string, boolean>>}
 */
async function loadFlagsRaw() {
  try {
    return await readGates();
  } catch (error) {
    console.error('Failed to load Statsig feature flags; falling back to defaults.', error);
    return { ...defaultGates };
  }
}

const loadFlagsCached = cache(loadFlagsRaw);

/**
 * Resolve the full gate map, using a per-request cache by default.
 *
 * @param {{force?:boolean}} [options]
 * @returns {Promise<Record<string, boolean>>}
 */
export async function getFlags(options = {}) {
  if (options?.force) {
    return loadFlagsRaw();
  }
  return loadFlagsCached();
}

/**
 * Read a single gate by key, pulling from the cached snapshot when possible.
 *
 * @param {string} key
 * @param {{force?:boolean}} [options]
 * @returns {Promise<boolean>}
 */
export async function getFlag(key, options = {}) {
  const gates = await getFlags(options);
  return Boolean(gates?.[key]);
}

/**
 * Create a gate lookup helper from a previously fetched snapshot.
 *
 * @param {Record<string, boolean>} [flags]
 * @returns {(key:string)=>boolean}
 */
export function getFlagEvaluator(flags) {
  const snapshot = flags ?? defaultGates;
  return (key) => Boolean(snapshot?.[key]);
}
