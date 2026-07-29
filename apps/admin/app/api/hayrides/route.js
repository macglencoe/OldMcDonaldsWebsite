import { NextResponse } from "next/server";

import {
  HayrideError,
  getHayrideSchedule,
  updateHayrideWagon,
} from "@/lib/hayrides.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function errorResponse(error, operation) {
  console.error(`[${operation}]`, error);
  const status = error instanceof HayrideError ? error.status : 500;
  return NextResponse.json(
    {
      status: "error",
      code: error instanceof HayrideError ? error.code : "HAYRIDE_ERROR",
      message: error instanceof HayrideError
        ? error.message
        : "The hayride schedule request could not be completed.",
    },
    { status, headers: NO_STORE_HEADERS },
  );
}

export async function GET(request) {
  try {
    const date = new URL(request.url).searchParams.get("date");
    return NextResponse.json(
      { status: "ok", ...await getHayrideSchedule(date) },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    return errorResponse(error, "GET /api/hayrides");
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new HayrideError("INVALID_CONTENT_TYPE", "Send a JSON request body.", 415);
    }
    return NextResponse.json(
      { status: "ok", ...await updateHayrideWagon(await request.json()) },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(
        new HayrideError("INVALID_JSON", "Request body must contain valid JSON."),
        "POST /api/hayrides",
      );
    }
    return errorResponse(error, "POST /api/hayrides");
  }
}
