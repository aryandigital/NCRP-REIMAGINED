import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { redact, evidenceIdentifiers } from "@/lib/redact";
import { lookupIdentifier } from "@/lib/db/identifiers";

export async function GET(req: NextRequest) {
  const _rl = rateLimit(req); if (_rl) return _rl;
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 3 || q.length > 500) {
    return NextResponse.json({ found: false, count: 0, type: null, firstSeenAt: null });
  }

  const { entities } = redact(q);
  const identifiers = evidenceIdentifiers(entities);

  if (identifiers.length === 0) {
    return NextResponse.json({ found: false, count: 0, type: null, firstSeenAt: null });
  }

  // Use the first (highest-priority) identified entity.
  const { type, value } = identifiers[0];
  const result = await lookupIdentifier(value, type);
  return NextResponse.json(result);
}
