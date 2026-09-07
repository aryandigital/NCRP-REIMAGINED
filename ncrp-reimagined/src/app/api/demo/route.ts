import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createDemoIncident } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const _rl = rateLimit(req); if (_rl) return _rl;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to save a personal demo copy" }, { status: 401 });
  try {
    const incident = await createDemoIncident(session.userId);
    return NextResponse.json({ id: incident.id, syntheticOnly: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not create a demo copy" }, { status: 503 });
  }
}
