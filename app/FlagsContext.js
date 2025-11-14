"use client";
import { createContext, useContext, useMemo } from "react";

const defaultFlags = {
  gates: {},
  configs: {},
};

const FlagsContext = createContext({
  flags: defaultFlags,
  isFeatureEnabled: () => false,
  getFeatureArg: () => null,
});

export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error("FlagsContext is missing");
  return ctx;
}

export function useConfig(configKey, param) {
  const { flags } = useFlags();
  const configs = flags?.configs ?? {};

  return useMemo(() => {
    const config = configs[configKey];
    if (!config) return null;

    if (param === undefined) {
      return config;
    }

    if (Array.isArray(config.args)) {
      const match = config.args.find((arg) => arg.key === param);
      if (match) return match;
    }

    if (config.raw && typeof config.raw === "object" && param in config.raw) {
      return normalizeFeatureArg(param, config.raw[param]);
    }

    return null;
  }, [configs, configKey, param]);
}

function normalizeFeatureArg(param, raw) {
  if (raw && typeof raw === "object" && Array.isArray(raw.values) && raw.key === param) {
    return {
      key: param,
      values: [...raw.values],
      raw,
    };
  }

  if (Array.isArray(raw)) {
    return {
      key: param,
      values: [...raw],
      raw,
    };
  }

  if (raw === undefined || raw === null) {
    return {
      key: param,
      values: [],
      raw,
    };
  }

  return {
    key: param,
    values: [raw],
    raw,
  };
}

export function FlagsProvider({ flags, children }) {
  const safeFlags = flags ?? defaultFlags;

  const value = useMemo(() => {
    const gates = safeFlags?.gates ?? {};
    const configs = safeFlags?.configs ?? {};

    const isFeatureEnabled = (key) => Boolean(gates[key]);

    const getFeatureArg = (key, param) => {
      const config = configs[key];
      if (!config) return null;

      if (Array.isArray(config.args)) {
        const match = config.args.find((arg) => arg.key === param);
        if (match) return match;
      }

      if (config.raw && typeof config.raw === "object" && param in config.raw) {
        return normalizeFeatureArg(param, config.raw[param]);
      }

      return null;
    };

    return {
      flags: safeFlags,
      isFeatureEnabled,
      getFeatureArg,
    };
  }, [safeFlags]);

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}
