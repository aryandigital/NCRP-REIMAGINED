import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db/users";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await getUserByEmail(email);
  if (!user) {
    // Constant-time rejection, don't reveal whether email exists
    await verifyPassword(password, "$2a$12$placeholder.hash.for.timing.safety.xxxxx");
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, email: user.email });

  return NextResponse.json({ userId: user.id, email: user.email, name: user.name });
}
