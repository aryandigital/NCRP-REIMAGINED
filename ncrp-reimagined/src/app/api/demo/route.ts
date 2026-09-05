import { NextResponse } from "next/server";
import { createDemoIncident } from "@/lib/store";

export async function POST() {
  try {
    const incident = await createDemoIncident();
    return NextResponse.json({ id: incident.id, syntheticOnly: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not create a demo copy" }, { status: 503 });
  }
}
