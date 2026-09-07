import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const _rl = rateLimit(req); if (_rl) return _rl;
  await clearSessionCookie();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
