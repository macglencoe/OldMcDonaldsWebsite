import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_SITE_SETTINGS } from "../../../packages/config/site-settings.mjs";
import { ensureSiteSettingsAreConsistent } from "./siteSettings.mjs";

function settings(overrides = {}) {
  return {
    ...structuredClone(DEFAULT_SITE_SETTINGS),
    ...overrides,
  };
}

test("accepts the checked-in site settings", () => {
  assert.doesNotThrow(() => ensureSiteSettingsAreConsistent(settings()));
});

test("rejects inconsistent season boundaries and time zones", () => {
  const closesFirst = settings({
    season: {
      ...DEFAULT_SITE_SETTINGS.season,
      closesAt: "2026-09-25T18:00:00-04:00",
    },
  });
  assert.throws(() => ensureSiteSettingsAreConsistent(closesFirst), /closing time/);

  const badZone = settings({
    season: { ...DEFAULT_SITE_SETTINGS.season, timeZone: "Eastern-ish" },
  });
  assert.throws(() => ensureSiteSettingsAreConsistent(badZone), /IANA time zone/);
});

test("rejects inconsistent Night Maze dates and times", () => {
  const beforeSeason = settings({
    nightMaze: { ...DEFAULT_SITE_SETTINGS.nightMaze, firstDate: "2026-09-20" },
  });
  assert.throws(() => ensureSiteSettingsAreConsistent(beforeSeason), /within the configured season/);

  const lateAdmission = settings({
    nightMaze: { ...DEFAULT_SITE_SETTINGS.nightMaze, lastAdmissionAt: "23:00" },
  });
  assert.throws(() => ensureSiteSettingsAreConsistent(lateAdmission), /last admission/);
});
