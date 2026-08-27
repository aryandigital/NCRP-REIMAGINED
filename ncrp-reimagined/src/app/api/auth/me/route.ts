import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(null);
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json(null);
  }

  return NextResponse.json({ userId: user.id, email: user.email, name: user.name });
}
