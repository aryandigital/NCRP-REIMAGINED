import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { DatabaseRequiredError, getUserByEmail } from "@/lib/db/users";

const signInSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict();

export async function POST(request: NextRequest) {
  const parsed = signInSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  try {
    const user = await getUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    await setSessionCookie({ userId: user.id, email: user.email });
    return NextResponse.json({ userId: user.id, email: user.email, name: user.name });
  } catch (error) {
    if (error instanceof DatabaseRequiredError) return NextResponse.json({ error: "Account storage is unavailable" }, { status: 503 });
    return NextResponse.json({ error: "Could not sign in" }, { status: 500 });
  }
}
