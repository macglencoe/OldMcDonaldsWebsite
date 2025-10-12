"use client";
import { createContext, useContext } from "react";

const FlagsContext = createContext(null);

export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error("FlagsContext is missing");
  return ctx;
}

export function FlagsProvider({ value, children }) {
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}
