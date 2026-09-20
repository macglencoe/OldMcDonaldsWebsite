import { getConfig } from '@/app/configs.server';
import { normalizeSiteSettings } from '@oldmc/config/site-settings';

export function extractSiteSettingsFromConfig(config) {
  return normalizeSiteSettings(config?.raw);
}

export async function getSiteSettingsData(options = {}) {
  if (options.config) return extractSiteSettingsFromConfig(options.config);
  const config = await getConfig('site-settings');
  return extractSiteSettingsFromConfig(config);
}
