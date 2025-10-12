"use client";
import { createContext, useContext, useMemo } from "react";
import { createFeatureEvaluator, setFeatureFlags as setEvaluatorFlags } from "@/public/lib/featureEvaluator";
import { createFeatureArgumentGetter, setFeatureArgumentFlags } from "@/public/lib/featureArguments";

const FlagsContext = createContext(null);

export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error("FlagsContext is missing");
  return ctx;
}

export function FlagsProvider({ flags, children }) {
  const safeFlags = flags ?? {};

  // Update module-level caches so legacy helpers stay in sync on the client.
  setEvaluatorFlags(safeFlags);
  setFeatureArgumentFlags(safeFlags);

  const value = useMemo(() => ({
    flags: safeFlags,
    isFeatureEnabled: createFeatureEvaluator(safeFlags),
    getFeatureArg: createFeatureArgumentGetter(safeFlags),
  }), [safeFlags]);

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}
