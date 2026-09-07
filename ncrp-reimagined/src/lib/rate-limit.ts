import { NextRequest, NextResponse } from "next/server";

// ── Configuration ────────────────────────────────────────────────────────────
// Edit these values to change limits across the whole application.

export const RATE_LIMIT_CONFIG = {
  /** Max requests per window for endpoints that call an external AI API */
  AI_MAX: 200,
  /** Max requests per window for all other API endpoints */
  DEFAULT_MAX: 500,
  /** Window duration in milliseconds (default: 1 minute) */
  WINDOW_MS: 60_000,
} as const;

/** Paths that make external AI API calls — subject to the lower AI_MAX limit */
export const AI_ROUTE_PATHS = new Set([
  "/api/agent",
  "/api/analyze",
  "/api/dojo/debrief",
  "/api/dojo/session",
  "/api/shield/alert",
]);

// ── Global counters ───────────────────────────────────────────────────────────
// Shared across all requests in this Node.js process.
// No IP, session, or user identifier — purely global traffic budgets.

let aiCount = 0;
let aiWindowStart = Date.now();
let defaultCount = 0;
let defaultWindowStart = Date.now();

function check(pathname: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();

  if (AI_ROUTE_PATHS.has(pathname)) {
    if (now - aiWindowStart >= RATE_LIMIT_CONFIG.WINDOW_MS) {
      aiCount = 0;
      aiWindowStart = now;
    }
    aiCount++;
    return {
      limited: aiCount > RATE_LIMIT_CONFIG.AI_MAX,
      retryAfter: Math.ceil((RATE_LIMIT_CONFIG.WINDOW_MS - (now - aiWindowStart)) / 1000),
    };
  }

  if (now - defaultWindowStart >= RATE_LIMIT_CONFIG.WINDOW_MS) {
    defaultCount = 0;
    defaultWindowStart = now;
  }
  defaultCount++;
  return {
    limited: defaultCount > RATE_LIMIT_CONFIG.DEFAULT_MAX,
    retryAfter: Math.ceil((RATE_LIMIT_CONFIG.WINDOW_MS - (now - defaultWindowStart)) / 1000),
  };
}

/**
 * Returns a 429 NextResponse when the global rate limit is exceeded, or null
 * when the request should proceed. Call at the top of every API route handler:
 *
 *   const _rl = rateLimit(req); if (_rl) return _rl;
 */
export function rateLimit(req: NextRequest): NextResponse | null {
  const { limited, retryAfter } = check(new URL(req.url).pathname);
  if (!limited) return null;
  return NextResponse.json(
    { error: "Too Many Requests" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
