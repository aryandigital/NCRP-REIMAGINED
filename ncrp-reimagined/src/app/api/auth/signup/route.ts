import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { DatabaseRequiredError, createUser, getUserByEmail } from "@/lib/db/users";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(254),
  password: z.string().min(12, "Use at least 12 characters").max(128),
}).strict();

export async function POST(request: NextRequest) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid account details" }, { status: 400 });
  const { name, email, password } = parsed.data;
  try {
    if (await getUserByEmail(email)) return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 });
    const user = await createUser({
      id: `USR${crypto.randomUUID().replace(/-/g, "").slice(0, 20).toUpperCase()}`,
      email,
      name,
      passwordHash: await hashPassword(password),
    });
    await setSessionCookie({ userId: user.id, email: user.email });
    return NextResponse.json({ userId: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (error) {
    if (error instanceof DatabaseRequiredError) return NextResponse.json({ error: "Account storage is unavailable" }, { status: 503 });
    return NextResponse.json({ error: "Could not create the account" }, { status: 500 });
  }
}
