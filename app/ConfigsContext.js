"use client";
import { createContext, useContext, useMemo } from "react";

const defaultConfigs = Object.freeze({});

/**
 * React context exposing normalized config payloads and helpers.
 */
const ConfigsContext = createContext({
  configs: defaultConfigs,
  getConfig: () => null,
  getConfigArg: () => null,
});

/**
 * Consume the configs context inside a client component.
 *
 * @returns {{configs:Record<string, object>, getConfig:(key:string)=>object|null, getConfigArg:(key:string,param:string)=>object|null}}
 */
export function useConfigs() {
  const ctx = useContext(ConfigsContext);
  if (!ctx) throw new Error("ConfigsContext is missing");
  return ctx;
}

/**
 * Convenience hook to read a single config (or argument) by key.
 *
 * @param {string} configKey
 * @param {string} [param]
 * @returns {{raw:unknown, args:Array<object>}|{key:string, values:Array<unknown>, raw:unknown}|null}
 */
export function useConfig(configKey, param) {
  const { getConfig, getConfigArg } = useConfigs();

  return useMemo(() => {
    if (!configKey) return null;
    if (param === undefined) {
      return getConfig(configKey);
    }
    return getConfigArg(configKey, param);
  }, [configKey, getConfig, getConfigArg, param]);
}

/**
 * Normalize raw config argument values into the shared object shape.
 *
 * @param {string} param
 * @param {unknown} raw
 * @returns {{key:string, values:Array<unknown>, raw:unknown}}
 */
function normalizeConfigArg(param, raw) {
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

/**
 * Provide normalized Statsig configs to client components.
 *
 * @param {{configs?:Record<string, object>, children:import('react').ReactNode}} props
 * @returns {JSX.Element}
 */
export function ConfigsProvider({ configs, children }) {
  const safeConfigs = configs ?? defaultConfigs;

  const value = useMemo(() => {
    const configMap = safeConfigs ?? defaultConfigs;

    const getConfig = (key) => {
      if (!key) return null;
      return configMap[key] ?? null;
    };

    const getConfigArg = (key, param) => {
      if (!key || param === undefined) {
        return null;
      }

      const config = configMap[key];
      if (!config) return null;

      if (Array.isArray(config.args)) {
        const match = config.args.find((arg) => arg.key === param);
        if (match) return match;
      }

      if (config.raw && typeof config.raw === "object" && param in config.raw) {
        return normalizeConfigArg(param, config.raw[param]);
      }

      return null;
    };

    return {
      configs: configMap,
      getConfig,
      getConfigArg,
    };
  }, [safeConfigs]);

  return <ConfigsContext.Provider value={value}>{children}</ConfigsContext.Provider>;
}
