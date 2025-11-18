import { getConfig, getConfigs } from '@/app/configs.server';
import { normalizePricing } from '@/utils/pricingConfig';

export function extractPricingFromFlags(flags) {
  return normalizePricing(flags?.configs?.pricing?.raw);
}

export function extractPricingFromConfigs(configs) {
  return normalizePricing(configs?.pricing?.raw);
}

export function extractPricingFromConfig(config) {
  return normalizePricing(config?.raw);
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
