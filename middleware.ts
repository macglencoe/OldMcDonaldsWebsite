// Password-protects the app with HTTP Basic Auth via Next.js middleware.
// When enabled (see `ENABLE_PREVIEW_PROTECTION`), every request must include
// valid credentials in the `Authorization: Basic ...` header.
import { NextRequest, NextResponse } from "next/server";

function getGitBranch(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GIT_BRANCH ||
    process.env.NEXT_PUBLIC_GIT_BRANCH ||
    ""
  );
}

// Helper: decide whether this request should require authentication
function shouldProtect(req: NextRequest): boolean {
  // Activation toggle: protection is on only when the env var is "1"
  if (process.env.ENABLE_PREVIEW_PROTECTION !== "1") return false;

  // Do not protect on the staging branch
  const branch = getGitBranch().toLowerCase();
  if (branch === "staging") return false;

  // With the toggle on and not staging, protect all requests
  return true;
}

export function middleware(req: NextRequest) {
  if (!shouldProtect(req)) {
    return NextResponse.next();
  }

  const user = process.env.PREVIEW_USER || "";
  const pass = process.env.PREVIEW_PASS || "";

  // Read the Authorization header (if present)
  const auth = req.headers.get("authorization") || "";

  // Build the expected HTTP Basic token: "Basic " + base64("user:pass")
  // `btoa` is available in the Edge runtime used by middleware.
  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (auth === expected) {
    return NextResponse.next();
  }

  // Challenge the client: a 401 with `WWW-Authenticate` prompts a login dialog
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Preview Access"',
      // Prevent intermediaries from caching the challenge response
      "Cache-Control": "no-store",
    },
  });
}

// Apply this middleware to all paths (Next.js may skip some internal assets)
export const config = {
  matcher: [
    // Match every route under the site root
    "/:path*",
  ],
};
