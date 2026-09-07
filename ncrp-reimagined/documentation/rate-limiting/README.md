# API Rate Limiting

## Overview

All API routes in this application enforce a global, process-level rate limit. The limiter tracks total traffic volume per minute across the whole server process — not per IP, user, or session. It acts as a cost-control and abuse-prevention budget for the deployed instance.

The implementation lives in [src/lib/rate-limit.ts](../../src/lib/rate-limit.ts).

---

## Two-Tier Limits

Routes are split into two tiers based on whether they make external AI API calls, which carry direct monetary cost.

| Tier | Limit | Window | Routes |
|------|-------|--------|--------|
| **AI** | 200 requests | 1 minute | `/api/agent`, `/api/analyze`, `/api/dojo/debrief`, `/api/dojo/session`, `/api/shield/alert` |
| **Default** | 500 requests | 1 minute | All other API routes |

### AI routes

These endpoints call an external LLM or voice API. The lower limit (200 req/min) prevents accidental or malicious spend.

| Route | Handler | External call |
|-------|---------|--------------|
| `POST /api/agent` | AI agent dispatch | Claude / OpenAI |
| `POST /api/analyze` | Incident DNA analysis | Claude |
| `POST /api/dojo/debrief` | Raksha Dojo debrief scoring | Claude |
| `POST /api/dojo/session` | Raksha Dojo voice session | OpenAI Realtime |
| `POST /api/shield/alert` | Call Shield demo dial | Twilio / VAPI |

### Default routes

All other API routes share the higher 500 req/min budget.

| Route | Methods |
|-------|---------|
| `GET /api/auth/me` | session check |
| `POST /api/auth/signin` | sign in |
| `POST /api/auth/signout` | sign out |
| `POST /api/auth/signup` | register |
| `POST /api/demo` | create demo incident copy |
| `GET /api/identifier/lookup` | identifier search |
| `GET /api/incidents/[id]` | fetch incident |
| `PATCH /api/incidents/[id]` | update incident |
| `GET /api/incidents/[id]/document` | PDF download |
| `POST /api/shield/assess` | Call Shield assessment |
| `POST /api/shield/save` | save Call Shield session |

---

## How It Works

```
rateLimit(req) → null (proceed) | NextResponse 429 (blocked)
```

At the top of every route handler:

```ts
const _rl = rateLimit(request);
if (_rl) return _rl;
```

Internally, `check(pathname)` looks up the pathname against `AI_ROUTE_PATHS`. If matched, it increments and checks `aiCount`; otherwise `defaultCount`. Counters reset when the current wall-clock time exceeds the window start by `WINDOW_MS`.

**Important:** counters are module-level variables in a single Node.js process. In a multi-instance deployment (e.g. multiple serverless workers), each instance has its own independent counters — the effective cluster-wide limit scales with the number of instances.

---

## Response Format

When the limit is exceeded the route returns:

```
HTTP 429 Too Many Requests
Retry-After: <seconds until window resets>
Content-Type: application/json

{ "error": "Too Many Requests" }
```

---

## Changing the Limits

Edit `RATE_LIMIT_CONFIG` in [src/lib/rate-limit.ts](../../src/lib/rate-limit.ts):

```ts
export const RATE_LIMIT_CONFIG = {
  AI_MAX: 200,       // max AI-tier requests per window
  DEFAULT_MAX: 500,  // max default-tier requests per window
  WINDOW_MS: 60_000, // window duration in milliseconds
} as const;
```

To add a new route to the AI tier, add its pathname to `AI_ROUTE_PATHS`:

```ts
export const AI_ROUTE_PATHS = new Set([
  "/api/agent",
  "/api/your-new-ai-route", // ← add here
  ...
]);
```

---

## Migration Note — `dojo/session`

Prior to the unified rate limiter, `/api/dojo/session` had its own IP-based throttle (12 requests per minute per IP address). That logic was removed in the same commit that introduced this library, and the route now uses the global AI-tier limit along with the other AI routes.
