import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null, { headers: { "Cache-Control": "private, no-store" } });
  try {
    const user = await getUserById(session.userId);
    return NextResponse.json(user ? { userId: user.id, email: user.email, name: user.name } : null, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json(null, { headers: { "Cache-Control": "private, no-store" } });
  }
}
