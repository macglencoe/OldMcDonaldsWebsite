import { getConfig, getConfigs } from '@/app/configs.server';
import { normalizePricing } from '@/utils/pricingConfig';
import defaultPricing from '@/public/data/pricing.json';

function withPricingDefaults(raw) {
  return {
    ...normalizePricing(defaultPricing),
    ...normalizePricing(raw),
  };
}

export function extractPricingFromFlags(flags) {
  return withPricingDefaults(flags?.configs?.pricing?.raw);
}

export function extractPricingFromConfigs(configs) {
  return withPricingDefaults(configs?.pricing?.raw);
}

export function extractPricingFromConfig(config) {
  return withPricingDefaults(config?.raw);
}

export async function getPricingData(options = {}) {
  if (options?.config) {
    return extractPricingFromConfig(options.config);
  }

  if (options?.configs) {
    return extractPricingFromConfigs(options.configs);
  }

  if (options?.flags) {
    return extractPricingFromFlags(options.flags);
  }

  const config = await getConfig('pricing');
  if (config) {
    return extractPricingFromConfig(config);
  }
  const configs = await getConfigs();
  return extractPricingFromConfigs(configs);
}
