"use client";

import ConfigActionsBar from "@/components/config/actionsBar";
import { normalizeSiteSettings } from "@oldmc/config/site-settings";
import { useMemo, useRef, useState } from "react";

const GROUPS = [
  {
    key: "season",
    title: "Season",
    description: "Shared season label, boundaries, timezone, and marketing facts.",
    fields: [
      ["name", "Season name", "text", "2026 Fall Season"],
      ["year", "Season year", "number"],
      ["opensAt", "Season opens at", "text", "2026-09-26T11:00:00-04:00"],
      ["closesAt", "Season closes at", "text", "2026-10-31T18:00:00-04:00"],
      ["timeZone", "Time zone", "text", "America/New_York"],
      ["weekendCount", "Number of weekends", "number"],
    ],
  },
  {
    key: "nightMaze",
    title: "Night Maze",
    description: "Shared dates and times used by every Night Maze page.",
    fields: [
      ["firstDate", "First date", "date"],
      ["opensAt", "Opens", "time"],
      ["closesAt", "Closes", "time"],
      ["lastAdmissionAt", "Last admission", "time"],
    ],
  },
  {
    key: "policies",
    title: "Policies",
    description: "Small policy values repeated throughout the public site.",
    fields: [["freeAdmissionMaxAge", "Maximum free-admission age", "number"]],
  },
  {
    key: "business",
    title: "Business identity",
    description: "Canonical contact and location values used in navigation, contact pages, and search metadata.",
    fields: [
      ["name", "Public name", "text"],
      ["legalName", "Legal name", "text"],
      ["phone", "Phone (E.164)", "tel", "+13048392330"],
      ["phoneDisplay", "Phone display", "text", "(304) 839-2330"],
      ["email", "Email", "email"],
      ["streetAddress", "Street address", "text"],
      ["addressLocality", "City", "text"],
      ["addressRegion", "State/region", "text"],
      ["postalCode", "Postal code", "text"],
      ["addressCountry", "Country code", "text", "US"],
      ["latitude", "Latitude", "number"],
      ["longitude", "Longitude", "number"],
    ],
  },
  {
    key: "social",
    title: "Social links",
    description: "Canonical social and reviews URLs.",
    fields: [
      ["facebookUrl", "Facebook URL", "url"],
      ["instagramUrl", "Instagram URL", "url"],
      ["tiktokUrl", "TikTok URL", "url"],
      ["reviewsUrl", "Reviews URL", "url"],
    ],
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function SiteSettingsPageClient({ settings }) {
  const initial = useMemo(() => normalizeSiteSettings(settings), [settings]);
  const originalRef = useRef(initial);
  const [value, setValue] = useState(() => clone(initial));
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const hasChanges = JSON.stringify(value) !== JSON.stringify(originalRef.current);

  const updateField = (group, field, type, rawValue) => {
    const nextValue = type === "number" ? Number(rawValue) : rawValue;
    setValue((current) => ({
      ...current,
      [group]: { ...current[group], [field]: nextValue },
    }));
  };

  const reset = () => setValue(clone(originalRef.current));

  const save = async () => {
    setSaveState({ status: "saving", message: "" });
    try {
      const response = await fetch("/api/config?key=site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(data.details) && data.details.length
          ? `${data.details[0].instancePath || "value"} ${data.details[0].message}`
          : data.error;
        throw new Error(detail || `Save failed with status ${response.status}`);
      }
      const saved = normalizeSiteSettings(data.value ?? value);
      originalRef.current = saved;
      setValue(clone(saved));
      setSaveState({ status: "success", message: "Saved" });
    } catch (error) {
      setSaveState({ status: "error", message: error instanceof Error ? error.message : "Failed to save" });
    }
  };

  return (
    <div className="space-y-5 p-3">
      <ConfigActionsBar
        title="Site Settings"
        description="Edit shared season, Night Maze, policy, contact, and social values. Times use 24-hour notation."
        buttons={[
          { label: saveState.status === "saving" ? "Saving..." : "Save changes", onClick: save, disabled: !hasChanges || saveState.status === "saving" },
          { label: "Revert to original", onClick: reset, disabled: !hasChanges },
        ]}
      />

      {saveState.status === "error" && <p className="text-sm text-red-600">Save failed: {saveState.message}</p>}
      {saveState.status === "success" && <p className="text-sm text-green-600">Saved</p>}

      <div className="grid gap-5 xl:grid-cols-2">
        {GROUPS.map((group) => (
          <section key={group.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{group.description}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map(([field, label, type, placeholder]) => (
                <label key={field} className="space-y-1 text-sm font-medium text-gray-700">
                  <span>{label}</span>
                  <input
                    type={type}
                    step={type === "number" ? "any" : undefined}
                    value={value[group.key][field]}
                    placeholder={placeholder}
                    onChange={(event) => updateField(group.key, field, type, event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
