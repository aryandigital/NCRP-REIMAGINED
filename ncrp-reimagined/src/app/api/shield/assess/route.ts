import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assessWithAI, assessLocal, readShieldBody, shieldTranscriptSchema, shieldTranscriptWindow } from "@/lib/shield";

const requestSchema = z.object({
  transcript: shieldTranscriptSchema,
  mode: z.enum(["local", "model"]).optional(),
});

export async function POST(req: NextRequest) {
  let input: unknown;
  try {
    input = await readShieldBody(req);
  } catch {
    return NextResponse.json({ error: "Invalid or oversized JSON body" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid assessment request" }, { status: 400 });
  const body = parsed.data;

  // Rolling window: only assess the last 3000 chars to keep latency down.
  const redacted = shieldTranscriptWindow(body.transcript);

  const assessment =
    body.mode === "local"
      ? assessLocal(redacted)
      : await assessWithAI(redacted);

  return NextResponse.json({ assessment });
}
