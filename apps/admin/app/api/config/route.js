import { NextResponse } from "next/server"
import { Statsig } from "@flags-sdk/statsig"
import Ajv from "ajv"
import addFormats from "ajv-formats"

import announcementsSchema from "@/schemas/announcements.schema.json"
import faqSchema from "@/schemas/faq.schema.json"
import calendarScheduleSchema from "@/schemas/calendar_schedule.schema.json"
import weeklyHoursSchema from "@/schemas/weekly-hours.schema.json"

const statsigEnv = process.env.STATSIG_ENV_STRING?.trim()
const consoleApiKey = process.env.STATSIG_CONSOLE_API_KEY

let initPromise

async function ensureStatsigInitialized() {
  if (initPromise) return initPromise

  const apiKey = process.env.STATSIG_SERVER_API_KEY
  if (!apiKey) {
    throw new Error("STATSIG_SERVER_API_KEY is not set")
  }

  initPromise = Statsig.initialize(apiKey, statsigEnv ? { environment: { tier: statsigEnv } } : undefined)
  try {
    await initPromise
  } catch (error) {
    initPromise = undefined
    throw error
  }
}

const ajv = addFormats(new Ajv({ allErrors: true, strict: false }))
const schemaRegistry = {
  announcements: ajv.compile(announcementsSchema),
  faq: ajv.compile(faqSchema),
  calendar_schedule: ajv.compile(calendarScheduleSchema),
  "weekly-hours": ajv.compile(weeklyHoursSchema),
}

const CONFIG_IDS = {
  announcements: process.env.STATSIG_CONFIG_ID_ANNOUNCEMENTS ?? "announcements",
  faq: process.env.STATSIG_CONFIG_ID_FAQ ?? "faq",
  calendar_schedule: process.env.STATSIG_CONFIG_ID_CALENDAR ?? "calendar_schedule",
  "weekly-hours": process.env.STATSIG_CONFIG_ID_WEEKLY_HOURS ?? "weekly-hours",
}

/**
 * Ensures that a given key has a corresponding schema validator.
 *
 * If the key is not found in the schema registry, an error is thrown.
 *
 * @param {string} key - The key to look up in the schema registry.
 * @returns {import("ajv").ValidateFunction} - The schema validator for the given key.
 * @throws {Error} - If the key is not found in the schema registry.
 */
function ensureSchemaForKey(key) {
  const validator = schemaRegistry[key]
  if (!validator) {
    const supported = Object.keys(schemaRegistry).join(", ")
    const error = new Error(`Unsupported config key "${key}". Supported: ${supported}`)
    error.status = 400
    throw error
  }
  return validator
}

/**
 * Check if any announcement item has a duplicate id, and throw an error if so.
 * This function is only relevant for the "announcements" config key.
 * @throws {Error} if duplicate announcement id is found
 */
function ensureUniqueIdsIfPresent(key, payload) {
  if (key !== "announcements") return
  const ids = new Set()
  for (const item of payload.items ?? []) {
    if (!item?.id) continue
    if (ids.has(item.id)) {
      const error = new Error(`Duplicate announcement id "${item.id}"`)
      error.status = 400
      throw error
    }
    ids.add(item.id)
  }
}

async function writeConfigToStatsig(key, value) {
  if (!consoleApiKey) throw Object.assign(new Error("STATSIG_CONSOLE_API_KEY is not set"), { status: 500 })
  const configId = CONFIG_IDS[key] ?? key
  const res = await fetch(`https://statsigapi.net/console/v1/dynamic_configs/${configId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "STATSIG-API-KEY": consoleApiKey,
    },
    body: JSON.stringify({
      isEnabled: true,
      description: `Admin config: ${key}`,
      rules: [],
      defaultValue: value,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw Object.assign(new Error(`Failed to write config (${res.status}): ${text}`), { status: res.status })
  }
  return res.json()
}


// GET

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key") ?? searchParams.get("config")

  if (!key) {
    return NextResponse.json({ error: "Missing config key (?key=...)" }, { status: 400 })
  }

  try {
    await ensureStatsigInitialized()
    const config = Statsig.getConfigSync({ userID: "admin-test" }, key)
    return NextResponse.json({ key, value: config?.value ?? null })
  } catch (error) {
    console.error("Failed to fetch Statsig config", error)
    const message = error instanceof Error ? error.message : "Failed to load config"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT

export async function PUT(request) {
  try {
    // Get and validate key
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key") ?? searchParams.get("config")
    if (!key) {
      return NextResponse.json({ error: "Missing config key (?key=...)" }, { status: 400 })
    }

    const validator = ensureSchemaForKey(key) // ensure schema exists
    const body = await request.json() // parse body

    const valid = validator(body) // validate body
    if (!valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validator.errors ?? [] },
        { status: 400 }
      )
    }

    // announcement-specific: ensure unique ids.
    ensureUniqueIdsIfPresent(key, body)

    const writeResult = await writeConfigToStatsig(key, body)

    return NextResponse.json({ key, value: body, saved: writeResult })
  } catch (error) {
    const status = error?.status ?? 500
    const message = error instanceof Error ? error.message : "Failed to update config"
    console.error("PATCH /api/config error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
