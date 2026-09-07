import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { DIFFICULTY_NOTES, DOJO_TOOLS, LANGUAGE_NOTES, dojoScenario } from "@/data/dojo";

// Mints a short-lived OpenAI Realtime client secret. The browser connects to
// OpenAI directly over WebRTC with this secret; the long-lived API key never
// leaves the server. No login needed: the Dojo is a public training tool.

const requestSchema = z.object({
  scenario: z.string().max(64),
  difficulty: z.enum(["gentle", "realistic", "ruthless"]).default("realistic"),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
  trainee: z.object({
    name: z.string().trim().max(40).optional(),
    city: z.string().trim().max(40).optional(),
  }).optional(),
}).strict();

export async function POST(request: NextRequest) {
  const _rl = rateLimit(request); if (_rl) return _rl;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Live voice rehearsal is not configured on this deployment." }, { status: 503 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid session request" }, { status: 400 });
  const { difficulty, language, trainee } = parsed.data;
  const scenario = dojoScenario(parsed.data.scenario);

  const traineeNote = trainee?.name || trainee?.city
    ? `The trainee has told the simulator their first name is "${trainee?.name ?? "unknown"}" and city is "${trainee?.city ?? "unknown"}". A real scammer would know this from a data leak — use it casually to sound credible.`
    : "You do not know the trainee's name. Fish for it early (\"main kisse baat kar raha hoon?\").";

  const instructions = [
    scenario.script,
    DIFFICULTY_NOTES[difficulty],
    LANGUAGE_NOTES[language],
    traineeNote,
    `Keep the whole call under ${Math.round(scenario.durationSec / 60)} minutes. Open the call now with your hook line.`,
  ].join("\n\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: 600 },
        session: {
          type: "realtime",
          model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime",
          instructions,
          tools: DOJO_TOOLS,
          tool_choice: "auto",
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe", language: language === "english" ? "en" : "hi" },
              turn_detection: { type: "semantic_vad", eagerness: difficulty === "ruthless" ? "high" : "medium", create_response: true, interrupt_response: true },
            },
            output: { voice: scenario.voice, speed: difficulty === "ruthless" ? 1.1 : 1.0 },
          },
        },
      }),
    });
    if (!response.ok) {
      console.error("[dojo] client_secrets HTTP", response.status, await response.text().catch(() => ""));
      return NextResponse.json({ error: "Could not start the rehearsal call. Try again." }, { status: 502 });
    }
    const json = (await response.json()) as { value: string; expires_at: number };
    return NextResponse.json({
      clientSecret: json.value,
      expiresAt: json.expires_at,
      model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime",
      scenario: { slug: scenario.slug, title: scenario.title, callerName: scenario.callerName, callerClaim: scenario.callerClaim, durationSec: scenario.durationSec },
    });
  } catch (error) {
    console.error("[dojo] session failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not reach the voice service." }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
