"use client";

import { useMemo } from "react";
import { useConfigs } from "@/app/ConfigsContext";
import { AnnouncementsView } from "@oldmc/public-ui";

/** Statsig severities we allow through to the client UI. */
const VALID_SEVERITIES = new Set(["info", "warning", "alert"]);

/**
 * Convert unknown user-provided values into trimmed strings.
 * @param {unknown} value
 * @returns {string|undefined}
 */
function coerceString(value) {
  return typeof value === "string" ? value.trim() : undefined;
}

/**
 * Normalize CTA entries coming from Statsig configs.
 * @param {unknown} raw
 * @returns {{text:string, href:string}|undefined}
 */
function sanitizeCta(raw) {
  if (!raw || typeof raw !== "object") return undefined;
  const text = coerceString(raw.text);
  const href = coerceString(raw.href);
  if (!text || !href) return undefined;
  return { text, href };
}

/**
 * Convert raw Statsig config entries into the shape the client expects.
 * @param {unknown} entry
 * @returns {{id?:string, short:string, long:string, icon?:string, issued?:string, expires?:string, severity?:string, cta?:{text:string, href:string}}|null}
 */
function sanitizeAnnouncement(entry) {
  if (!entry || typeof entry !== "object") return null;

  const short = coerceString(entry.short);
  const long = coerceString(entry.long);

  if (!short || !long) {
    return null;
  }

  const id = coerceString(entry.id);
  const icon = coerceString(entry.icon);
  const issued = coerceString(entry.issued);
  const expires = coerceString(entry.expires);
  const severityCandidate =
    typeof entry.severity === "string" ? entry.severity.trim().toLowerCase() : undefined;
  const severity = severityCandidate && VALID_SEVERITIES.has(severityCandidate) ? severityCandidate : undefined;
  const cta = sanitizeCta(entry.cta);

  return {
    id: id ?? undefined,
    short,
    long,
    icon: icon ?? undefined,
    issued: issued ?? undefined,
    expires: expires ?? undefined,
    severity: severity ?? undefined,
    cta,
  };
}

/**
 * Read the announcements dynamic config from ConfigsContext and sanitize its payload.
 * @param {(key:string, param:string)=>{raw?:unknown, values?:unknown[]}|null} getConfigArg
 * @returns {Array<object>|undefined}
 */
function parseAnnouncementsFromConfig(getConfigArg) {
  if (typeof getConfigArg !== "function") {
    return undefined;
  }

  const itemsArg = getConfigArg("announcements", "items");
  const entries = Array.isArray(itemsArg?.raw)
    ? itemsArg.raw
    : Array.isArray(itemsArg?.values)
      ? itemsArg.values
      : undefined;

  if (!Array.isArray(entries)) {
    return undefined;
  }

  const sanitized = entries.map(sanitizeAnnouncement).filter(Boolean);
  return sanitized.length > 0 ? sanitized : undefined;
}

/**
 * Client component that fetches announcements via the Configs context.
 * Sanitizing here keeps the downstream UI focused on presentation.
 */
export default function Announcements() {
  const { getConfigArg } = useConfigs();
  const items = useMemo(() => parseAnnouncementsFromConfig(getConfigArg), [getConfigArg]);

  return <AnnouncementsView items={items} />;
}
