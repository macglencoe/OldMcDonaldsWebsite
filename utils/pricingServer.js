import { loadFlags } from '@/app/flags';
import { normalizePricing } from '@/utils/pricingConfig';

export function extractPricingFromFlags(flags) {
  const raw = flags?.configs?.pricing?.raw;
  return normalizePricing(raw);
}

export async function getPricingData(options = {}) {
  if (options?.flags) {
    return extractPricingFromFlags(options.flags);
  }
  const flags = await loadFlags();
  return extractPricingFromFlags(flags);
}
