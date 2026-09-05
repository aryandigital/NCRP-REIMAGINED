import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createIncident, updateIncident, type DnaResult } from "@/lib/store";
import { redact, evidenceIdentifiers, stripCredentials } from "@/lib/redact";
import { assessWithAI, readShieldBody, shieldTranscriptSchema, shieldTranscriptWindow } from "@/lib/shield";
import { buildBrief, emptyAnswers, type VictimAnswers } from "@/lib/brief";
import { PATTERNS } from "@/data/patterns";

const textAnswer = z.string().max(300).transform((text) => stripCredentials(text.trim()) || null).nullable().optional();
const timestamp = z.iso.datetime({ offset: true });
const requestSchema = z.object({
  transcript: shieldTranscriptSchema,
  source: z.enum(["mic", "simulation", "text"]),
  startedAt: timestamp,
  endedAt: timestamp,
  answers: z.object({
    victimName: textAnswer,
    callbackNumber: textAnswer,
    location: textAnswer,
    immediateDanger: z.boolean().nullable().optional(),
    moneyMoved: z.boolean().nullable().optional(),
    amountInr: z.number().min(0).max(1_000_000_000_000).nullable().optional(),
    paidAt: timestamp.nullable().optional(),
    bankOrWallet: textAnswer,
    utr: textAnswer,
    sharedCredentials: z.boolean().nullable().optional(),
    callerNumber: textAnswer,
    callerClaims: textAnswer,
    reportingForSomeoneElse: z.boolean().optional(),
  }).optional(),
}).refine((body) => Date.parse(body.endedAt) >= Date.parse(body.startedAt));

export async function POST(req: NextRequest) {
  let input: unknown;
  try {
    input = await readShieldBody(req);
  } catch {
    return NextResponse.json({ error: "Invalid or oversized JSON body" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid shield save request" }, { status: 400 });
  const body = parsed.data;

  // The schema strips unknown keys, including any client-supplied assessment.
  const answers: VictimAnswers = { ...emptyAnswers(), ...(body.answers ?? {}) };
  const redacted = shieldTranscriptWindow(body.transcript);
  // Reassess on the server, with the same grounding, timeout and local fallback as live screening.
  const a = await assessWithAI(redacted);
  // Only a user-labelled suspect number establishes identifier ownership here.
  const { entities } = redact(answers.callerNumber ?? "");
  const pattern = a.patternSlug ? PATTERNS.find((p) => p.slug === a.patternSlug) ?? null : null;
  const { startedAt, endedAt, source } = body;

  const dna: DnaResult = {
    risk: a.verdict === "scam" ? "high" : a.verdict === "suspicious" ? "medium" : "unclear",
    patternSlug:  a.patternSlug,
    patternName:  pattern?.name ?? a.patternName,
    confidence:   a.confidence,
    currentStage: a.stageId,
    signals:      a.markers.map((m) => `"${m.quote}" — ${m.why}`),
    nextMove:     pattern && a.stageId ? pattern.nextMove[a.stageId] ?? null : null,
    doNot:        pattern?.doNot ?? a.coach.doNot,
    exactMatches: evidenceIdentifiers(entities).map((e) => ({ type: e.type, value: e.value })),
    noDatabaseMatch: !a.patternSlug,
  };

  try {
    const incident = await createIncident({
      language: a.language,
      rawText: redacted,
      dna,
      origin: source === "simulation" ? "demo" : "call-shield",
      syntheticOnly: source === "simulation",
      occurredAt: answers.moneyMoved === true ? answers.paidAt : null,
      answers: {
        ...(answers.moneyMoved !== null ? { paid: answers.moneyMoved } : {}),
        ...(answers.sharedCredentials !== null ? { otp: answers.sharedCredentials } : {}),
        ...(answers.immediateDanger !== null ? { danger: answers.immediateDanger } : {}),
      },
      tracks: pattern?.tracks ?? ["money", "safety"],
      shield: {
        // Spread keeps the existing store type compatible; JSON persistence retains source.
        ...{ source },
        transcript: redacted,
        assessment: a,
        startedAt,
        endedAt,
        answers,
        brief: null,
        alerts: [],
      },
      extractedFacts: [
        { field: "screening_source", value: source, source: "user", confidence: 1, confirmationStatus: "confirmed" },
        { field: "screening_started_at", value: startedAt, source: "user", confidence: 1, confirmationStatus: "confirmed" },
        ...(answers.victimName   ? [{ field: "victim_name",    value: answers.victimName,    source: "user" as const, confidence: 1, confirmationStatus: "confirmed"   as const }] : []),
        ...(answers.callbackNumber ? [{ field: "callback_number", value: answers.callbackNumber, source: "user" as const, confidence: 1, confirmationStatus: "confirmed" as const }] : []),
        ...(answers.location     ? [{ field: "location",       value: answers.location,      source: "user" as const, confidence: 1, confirmationStatus: "confirmed"   as const }] : []),
        ...(pattern              ? [{ field: "Scam type",      value: pattern.name,          source: "model" as const, confidence: a.confidence, confirmationStatus: "unconfirmed" as const }] : []),
        ...(answers.callerNumber ? [{ field: "caller_number",  value: answers.callerNumber,  source: "user" as const, confidence: 1, confirmationStatus: "confirmed"   as const }] : []),
        ...(answers.moneyMoved === true && answers.amountInr !== null ? [{ field: "financial amount", value: answers.amountInr, source: "user" as const, confidence: 1, confirmationStatus: "confirmed" as const }] : []),
        ...(answers.moneyMoved === true && answers.utr ? [{ field: "utr", value: answers.utr, source: "user" as const, confidence: 1, confirmationStatus: "confirmed" as const }] : []),
      ],
      missingFacts: [
        ...(answers.victimName     ? [] : ["victim name"]),
        ...(answers.callbackNumber ? [] : ["callback number"]),
        ...(answers.callerNumber   ? [] : ["caller number"]),
        ...(answers.location       ? [] : ["location"]),
        ...(answers.immediateDanger === null ? ["immediate danger"] : []),
        ...(answers.moneyMoved === null ? ["money moved"] : []),
        ...(answers.sharedCredentials === null ? ["credential or access exposure"] : []),
        ...(answers.moneyMoved && !answers.utr ? ["UTR"] : []),
      ],
    });

    // Attach the brief (needs the incident id).
    const brief = buildBrief({ id: incident.id, assessment: a, answers, startedAt, endedAt, source, redactedTranscript: redacted });
    const updated = await updateIncident(incident.id, {
      shield: { ...incident.shield!, brief },
    });
    if (!updated) throw new Error("Incident unavailable");

    return NextResponse.json({ id: incident.id, escalation: brief.escalation });
  } catch {
    console.error("[shield] save failed");
    return NextResponse.json({ error: "Unable to save screening" }, { status: 500 });
  }
}
