import { NextResponse } from "next/server"
import { Statsig } from "@flags-sdk/statsig"

const statsigEnv = process.env.STATSIG_ENV_STRING?.trim()
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
