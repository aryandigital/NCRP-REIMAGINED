import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { dojoScenario } from "@/data/dojo";
import { stripCredentials } from "@/lib/redact";

// Post-call debrief: turns the rehearsal transcript into a coaching scorecard.
// Structured Outputs keep the shape strict; a local fallback keeps the demo alive offline.

const turnSchema = z.object({
  role: z.enum(["scammer", "you"]),
  text: z.string().max(2000),
  at: z.number().min(0).max(3600),
});

const requestSchema = z.object({
  scenario: z.string().max(64),
  outcome: z.enum(["resisted", "complied", "hung_up", "timeout", "aborted"]),
  durationSec: z.number().min(0).max(3600),
  slips: z.array(z.string().max(40)).max(20),
  transcript: z.array(turnSchema).max(200),
}).strict();

const DEBRIEF_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "dojo_debrief",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "integer", minimum: 0, maximum: 100 },
        grade: { type: "string", enum: ["Shielded", "Alert", "Wobbly", "Exposed"] },
        headline: { type: "string" },
        summary: { type: "string" },
        wins: { type: "array", items: { type: "string" }, maxItems: 4 },
        risks: { type: "array", items: { type: "string" }, maxItems: 4 },
        moments: {
          type: "array",
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              scammerSaid: { type: "string" },
              youSaid: { type: "string" },
              betterSay: { type: "string" },
              why: { type: "string" },
            },
            required: ["scammerSaid", "youSaid", "betterSay", "why"],
          },
        },
        oneLiner: { type: "string" },
        familyTip: { type: "string" },
      },
      required: ["score", "grade", "headline", "summary", "wins", "risks", "moments", "oneLiner", "familyTip"],
    },
  },
} as const;

export interface DojoDebrief {
  score: number;
  grade: "Shielded" | "Alert" | "Wobbly" | "Exposed";
  headline: string;
  summary: string;
  wins: string[];
  risks: string[];
  moments: Array<{ scammerSaid: string; youSaid: string; betterSay: string; why: string }>;
  oneLiner: string;
  familyTip: string;
  method: "model" | "local";
}

const debriefSchema = z.object({
  score: z.number().int().min(0).max(100),
  grade: z.enum(["Shielded", "Alert", "Wobbly", "Exposed"]),
  headline: z.string(),
  summary: z.string(),
  wins: z.array(z.string()),
  risks: z.array(z.string()),
  moments: z.array(z.object({ scammerSaid: z.string(), youSaid: z.string(), betterSay: z.string(), why: z.string() })),
  oneLiner: z.string(),
  familyTip: z.string(),
});

function localDebrief(input: z.infer<typeof requestSchema>): DojoDebrief {
  const yours = input.transcript.filter((t) => t.role === "you");
  const refusals = yours.filter((t) => /1930|scam|fraud|nahi|no\b|not sharing|police station|branch|hang|band|cut/i.test(t.text)).length;
  let score = 55 + refusals * 8 - input.slips.length * 18;
  if (input.outcome === "resisted" || input.outcome === "hung_up") score += 20;
  if (input.outcome === "complied") score -= 30;
  score = Math.max(0, Math.min(100, score));
  const grade = score >= 80 ? "Shielded" : score >= 60 ? "Alert" : score >= 40 ? "Wobbly" : "Exposed";
  return {
    score,
    grade,
    headline: grade === "Shielded" ? "You held the line." : grade === "Exposed" ? "This call would have cost you." : "Close call — one push more and it tips.",
    summary: `You spoke ${yours.length} times over ${Math.round(input.durationSec)} seconds. ${input.slips.length ? `You revealed: ${input.slips.join(", ")}.` : "You did not reveal any credential."} Outcome: ${input.outcome}.`,
    wins: refusals ? ["You pushed back instead of complying immediately."] : [],
    risks: input.slips.length ? input.slips.map((s) => `Shared ${s} on a call you did not initiate.`) : ["You stayed on the line longer than needed."],
    moments: [],
    oneLiner: "No officer, bank or company asks for OTP, PIN or a 'verification transfer' on a call. Cut the call. Dial 1930.",
    familyTip: "Agree on a family code word. If a caller says a relative is in trouble, ask for the code word first.",
    method: "local",
  };
}

export async function POST(request: NextRequest) {
  const _rl = rateLimit(request); if (_rl) return _rl;
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid debrief request" }, { status: 400 });
  const input = parsed.data;
  // Never let a trainee's real OTP / card / Aadhaar reach the model or logs.
  input.transcript = input.transcript.map((t) => ({ ...t, text: stripCredentials(t.text) }));
  const scenario = dojoScenario(input.scenario);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || input.transcript.length === 0) return NextResponse.json({ debrief: localDebrief(input) });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 900,
        response_format: DEBRIEF_SCHEMA,
        messages: [
          {
            role: "system",
            content: `You are the coach in Raksha Dojo, an Indian anti-scam rehearsal simulator. A trainee just finished a simulated "${scenario.title}" scam call where an AI played "${scenario.callerName}" (${scenario.callerClaim}). Scammer's goal: ${scenario.goal}
Score the TRAINEE (role "you") from 0-100 on how safely they handled it. Scoring guide: hung up or refused firmly and early = 85-100; refused but engaged too long or shared harmless details = 60-84; wavered, shared identifying details, or nearly complied = 35-59; shared OTP/PIN/card/Aadhaar or agreed to transfer = 0-34.
Grades: Shielded (80+), Alert (60-79), Wobbly (40-59), Exposed (<40).
Write in warm, plain Hinglish-friendly English (short sentences; Hindi phrases welcome). No shaming. Be specific: quote what they actually said.
"moments": up to 4 turning points — quote the scammer, quote the trainee, give the exact better line to say, explain why in one sentence.
"oneLiner": a single memorable rule they should remember from THIS call.
"familyTip": one sentence they can forward to parents/family on WhatsApp. It must encourage TALKING to family / calling 1930 / visiting the bank branch in person — never "don't tell anyone" (that is the scammer's line).
Detected slips (things the trainee revealed, from the client): ${input.slips.length ? input.slips.join(", ") : "none"}. If any slips exist, at least one "risks" item must name it and explain how a scammer would use it. Outcome: ${input.outcome}. Duration: ${Math.round(input.durationSec)}s.`,
          },
          {
            role: "user",
            content: input.transcript.map((t) => `[${Math.round(t.at)}s] ${t.role === "you" ? "TRAINEE" : "SCAMMER"}: ${t.text}`).join("\n"),
          },
        ],
      }),
    });
    if (!response.ok) {
      console.error("[dojo] debrief HTTP", response.status);
      return NextResponse.json({ debrief: localDebrief(input) });
    }
    const json = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const debrief = debriefSchema.parse(JSON.parse(json.choices[0].message.content));
    return NextResponse.json({ debrief: { ...debrief, method: "model" } satisfies DojoDebrief });
  } catch (error) {
    console.error("[dojo] debrief failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ debrief: localDebrief(input) });
  } finally {
    clearTimeout(timer);
  }
}
