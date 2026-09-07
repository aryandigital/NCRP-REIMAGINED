import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";

export async function GET(req: NextRequest) {
  const _rl = rateLimit(req); if (_rl) return _rl;
  const session = await getSession();
  if (!session) return NextResponse.json(null, { headers: { "Cache-Control": "private, no-store" } });
  try {
    const user = await getUserById(session.userId);
    return NextResponse.json(user ? { userId: user.id, email: user.email, name: user.name } : null, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json(null, { headers: { "Cache-Control": "private, no-store" } });
  }
}
