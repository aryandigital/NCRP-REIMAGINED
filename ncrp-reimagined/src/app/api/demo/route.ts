import { NextResponse } from "next/server";
import { createDemoIncident } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to save a personal demo copy" }, { status: 401 });
  try {
    const incident = await createDemoIncident(session.userId);
    return NextResponse.json({ id: incident.id, syntheticOnly: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not create a demo copy" }, { status: 503 });
  }
}
