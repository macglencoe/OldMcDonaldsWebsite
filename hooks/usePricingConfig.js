"use client";

import { useMemo } from 'react';
import { useConfig } from '@/app/FlagsContext';
import { normalizePricing } from '@/utils/pricingConfig';

export function usePricingConfig() {
  const config = useConfig('pricing');
  return useMemo(() => normalizePricing(config?.raw), [config]);
}
