"use client";
import { createContext, useContext, useMemo } from "react";

const defaultFlags = Object.freeze({});

/**
 * React context containing the latest gate snapshot and helpers.
 */
const FlagsContext = createContext({
  flags: defaultFlags,
  isFeatureEnabled: () => false,
});

/**
 * Access the current flags context from a client component.
 *
 * @returns {{flags:Record<string, boolean>, isFeatureEnabled:(key:string)=>boolean}}
 */
export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error("FlagsContext is missing");
  return ctx;
}

/**
 * Provide gate values to client components.
 *
 * @param {{flags?:Record<string, boolean>, children:import('react').ReactNode}} props
 * @returns {JSX.Element}
 */
export function FlagsProvider({ flags, children }) {
  const safeFlags = flags ?? defaultFlags;

  const value = useMemo(() => {
    const gates = safeFlags ?? defaultFlags;
    const isFeatureEnabled = (key) => Boolean(gates[key]);

    return {
      flags: gates,
      isFeatureEnabled,
    };
  }, [safeFlags]);

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}
