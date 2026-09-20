"use client";

import { useConfig } from '@/app/ConfigsContext';
import { normalizeSiteSettings } from '@oldmc/config/site-settings';
import { useMemo } from 'react';

export default function useSiteSettings() {
  const config = useConfig('site-settings');
  return useMemo(() => normalizeSiteSettings(config?.raw), [config?.raw]);
}
