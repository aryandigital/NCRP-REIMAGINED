import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db/users";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  name: z.string().min(1).max(100).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues ?? [];
    const first = issues[0]?.message ?? parsed.error.message ?? "Invalid input";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const id = `USR${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const user = await createUser({ id, email, passwordHash, name });

  await setSessionCookie({ userId: user.id, email: user.email });

  return NextResponse.json({ userId: user.id, email: user.email, name: user.name }, { status: 201 });
}
