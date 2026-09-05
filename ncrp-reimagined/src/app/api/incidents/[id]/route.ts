import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getIncident, isIncidentId, makeAckNumber, updateIncident, type ExtractedFact } from "@/lib/store";
import { redact, sanitizeCredentials, readBoundedBody, evidenceIdentifiers } from "@/lib/redact";
import { buildBrief, emptyAnswers, type VictimAnswers } from "@/lib/brief";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
const text = z.string().trim().min(1).max(120);
const answerText = z.string().trim().max(300).nullable();
const answerSchema = z.object({
  victimName: answerText, callbackNumber: answerText, location: answerText,
  immediateDanger: z.boolean().nullable(), moneyMoved: z.boolean().nullable(),
  amountInr: z.number().finite().min(0).max(1_000_000_000_000).nullable(),
  paidAt: z.iso.datetime({ offset: true }).nullable(), bankOrWallet: answerText, utr: answerText,
  sharedCredentials: z.boolean().nullable(), callerNumber: answerText, callerClaims: answerText,
  reportingForSomeoneElse: z.boolean(),
});
const answerFields: Record<string, keyof VictimAnswers> = {
  "victim name": "victimName", "callback number": "callbackNumber", location: "location",
  "immediate danger": "immediateDanger", "money moved": "moneyMoved", "financial amount": "amountInr",
  "paid at": "paidAt", "bank or wallet": "bankOrWallet", utr: "utr",
  "credential or access exposure": "sharedCredentials", "caller number": "callerNumber",
  "caller claims": "callerClaims", "reporting for someone else": "reportingForSomeoneElse",
};
const patchSchema = z.object({
  answers: z.record(z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/).refine((key) => !["constructor", "prototype", "__proto__"].includes(key)), z.boolean()).refine((value) => Object.keys(value).length <= 32).optional(),
  extractedFacts: z.array(z.object({
    field: text,
    value: z.union([z.string().max(2000), z.number().finite(), z.boolean(), z.null()]),
    source: z.enum(["user", "screenshot", "model"]),
    confidence: z.number().finite().min(0).max(1),
    confirmationStatus: z.enum(["unconfirmed", "confirmed", "corrected", "missing"]),
  }).strict()).max(65)
    .refine((facts) => facts.filter((fact) => factKey(fact.field) !== "simulation edits").length <= 64)
    .refine((facts) => new Set(facts.map((fact) => factKey(fact.field))).size === facts.length).optional(),
  missingFacts: z.array(text).max(64).optional(),
  completedActions: z.array(text).max(64).optional(),
  submitMock: z.boolean().optional(),
  rawText: z.string().max(6000).optional(),
}).strict().refine((body) => Object.keys(body).length > 0);

function factKey(field: string) {
  const key = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/[_-]/g, " ").trim().replace(/\s+/g, " ");
  if (["bank", "bank or wallet", "bank or payment app"].includes(key)) return "bank or wallet";
  if (["amount", "amount inr", "transaction amount", "financial amount"].includes(key)) return "financial amount";
  if (["name", "victim name"].includes(key)) return "victim name";
  if (["suspect number", "caller number"].includes(key)) return "caller number";
  if (["caller claimed identity", "caller claims"].includes(key)) return "caller claims";
  if (["money already transferred", "money transferred", "money moved"].includes(key)) return "money moved";
  if (["shared credentials", "credential or access exposure"].includes(key)) return "credential or access exposure";
  if (["transaction date and time", "payment time", "paid at"].includes(key)) return "paid at";
  return key;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isIncidentId(id)) return NextResponse.json({ error: "Incident not found" }, { status: 404, headers });
  try {
    const incident = await getIncident(id);
    if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404, headers });
    if (req.nextUrl.searchParams.get("format") === "bundle") {
      return new NextResponse(JSON.stringify({
        label: "Incident bundle containing personal details. Credentials filtered; not anonymised.",
        status: "prepared_locally",
        sent: false,
        caseReference: incident.ackNumber ?? incident.id,
        syntheticOnly: incident.syntheticOnly,
        incident: { ...incident, narrative: incident.rawText, imageDataUrl: undefined },
      }, null, 2), { headers: { ...headers, "Content-Type": "application/json", "Content-Disposition": `attachment; filename="raksha-${id.toLowerCase()}-personal-details.json"` } });
    }
    return NextResponse.json({ incident }, { headers });
  } catch {
    return NextResponse.json({ error: "Incident storage is unavailable" }, { status: 503, headers });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "DEMO0001") return NextResponse.json({ error: "This example is read-only. POST /api/demo to create your own synthetic copy." }, { status: 409, headers });
  if (!isIncidentId(id)) return NextResponse.json({ error: "Incident not found" }, { status: 404, headers });
  let input: unknown;
  try { input = await new Response(await readBoundedBody(req, 160000)).json(); }
  catch (error) { return NextResponse.json({ error: error instanceof RangeError ? "Input too large" : "Invalid JSON" }, { status: error instanceof RangeError ? 413 : 400, headers }); }
  const parsed = patchSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid incident update" }, { status: 400, headers });
  const body = sanitizeCredentials(parsed.data);
  try {
    const updated = await updateIncident(id, (incident) => {
      let facts: ExtractedFact[] = (body.extractedFacts ?? incident.extractedFacts).map((fact) => {
        const missing = fact.confirmationStatus === "missing" || fact.value === null || (typeof fact.value === "string" && /^(?:\s*|not provided|not stated|not given|not sure|n\/a|unknown|\[CREDENTIAL\])$/i.test(fact.value.trim()));
        return missing ? { ...fact, value: null, confidence: 0, confirmationStatus: "missing" as const } : fact;
      });
      const answers = { ...incident.answers, ...body.answers };
      let shield = incident.shield;
      let occurredAt = incident.occurredAt;
      let dna = incident.dna;
      const required: string[] = [];
      if (shield) {
        const next = { ...emptyAnswers(), ...shield.answers };
        // Only reviewed fields become answers. The screening evidence and source
        // remain original; an edited narrative is not a replacement transcript.
        if (body.extractedFacts) facts = facts.map((fact) => {
          const field = factKey(fact.field);
          const provenance = field === "screening source" ? shield!.source : field === "screening started at" ? shield!.startedAt : field === "screening ended at" ? shield!.endedAt : undefined;
          if (provenance !== undefined) return { ...fact, value: provenance, source: "user", confidence: 1, confirmationStatus: "confirmed" };
          const key = Object.hasOwn(answerFields, field) ? answerFields[field] : undefined;
          if (!key || fact.confirmationStatus === "unconfirmed") return fact;
          let value = fact.value;
          if (key === "amountInr" && typeof value === "string") {
            const amount = value.replace(/[,\s₹]/g, "");
            if (/^\d+(?:\.\d{1,2})?$/.test(amount)) value = Number(amount);
          }
          if (["immediateDanger", "moneyMoved", "sharedCredentials", "reportingForSomeoneElse"].includes(key) && typeof value === "string") {
            if (/^(true|yes)$/i.test(value.trim())) value = true;
            else if (/^(false|no)$/i.test(value.trim())) value = false;
          }
          if (key === "reportingForSomeoneElse" && value === null) value = false;
          value = answerSchema.shape[key].parse(value);
          Object.assign(next, { [key]: value });
          return { ...fact, value };
        });
        // Explicit boolean edits win over carried facts. Remove stale aliases so
        // a later screen cannot turn an explicit false/null back into true.
        for (const [key, canonical, aliases, label] of [
          ["moneyMoved", "paid", ["paid", "moneyMoved"], "money moved"],
          ["immediateDanger", "danger", ["danger", "beingThreatened", "immediateDanger"], "immediate danger"],
          ["sharedCredentials", "otp", ["otp", "app", "screen", "sharedOtpOrPin", "installedApp", "sharedScreen", "attackerStillHasAccess", "sharedCredentials"], "credential or access exposure"],
          ["reportingForSomeoneElse", "reportingForSomeoneElse", ["reportingForSomeoneElse"], "reporting for someone else"],
        ] as const) {
          const supplied = aliases.map((alias) => body.answers?.[alias]).filter((value) => typeof value === "boolean");
          const granularExposure = key === "sharedCredentials" && body.answers?.sharedCredentials === undefined && !body.extractedFacts?.some((fact) => factKey(fact.field) === label && fact.confirmationStatus !== "unconfirmed");
          if (supplied.length) {
            // Turning off screen sharing alone must not erase a reported OTP/app exposure.
            next[key] = granularExposure ? aliases.some((alias) => answers[alias] === true) : supplied.includes(true);
            const fact: ExtractedFact = { field: label, value: next[key], source: "user", confidence: 1, confirmationStatus: "confirmed" };
            facts = facts.map((item) => factKey(item.field) === label ? fact : item);
          }
          if (!granularExposure) {
            for (const alias of aliases) delete answers[alias];
            if (typeof next[key] === "boolean") answers[canonical] = next[key];
          }
        }
        const confirmedAnswers = answerSchema.parse(next);
        occurredAt = confirmedAnswers.moneyMoved === true ? confirmedAnswers.paidAt : null;
        if (dna && confirmedAnswers.callerNumber !== shield.answers?.callerNumber) {
          dna = { ...dna, exactMatches: evidenceIdentifiers(redact(confirmedAnswers.callerNumber ?? "").entities).map(({ type, value }) => ({ type, value })) };
        }
        shield = { ...shield, answers: confirmedAnswers, brief: buildBrief({
          id, assessment: shield.assessment, answers: confirmedAnswers,
          source: shield.source, startedAt: shield.startedAt, endedAt: shield.endedAt,
          redactedTranscript: shield.transcript,
        }) };
        required.push("victim name", "callback number", "caller number", "location", "immediate danger", "money moved", "credential or access exposure");
        if (confirmedAnswers.moneyMoved === true) required.push("financial amount", "bank or wallet", "paid at", "utr");
      }
      // Editing an already-labelled example does not make it a real incident.
      // This annotation never promotes a non-synthetic record into the call gate.
      const editedSimulation = incident.syntheticOnly && (body.rawText !== undefined || body.extractedFacts !== undefined || body.answers !== undefined || incident.extractedFacts.some((fact) => fact.field === "Simulation edits"));
      facts = facts.filter((fact) => factKey(fact.field) !== "simulation edits");
      if (editedSimulation) facts.push({ field: "Simulation edits", value: "User-edited synthetic example; original simulation provenance retained.", source: "user", confidence: 1, confirmationStatus: "confirmed" });
      const resolved = new Set(facts.filter((fact) => ["confirmed", "corrected"].includes(fact.confirmationStatus)).map((fact) => factKey(fact.field)));
      const missingFacts = [...new Set([...incident.missingFacts, ...(body.missingFacts ?? []), ...facts.filter((fact) => fact.confirmationStatus === "missing").map((fact) => fact.field), ...required].map(factKey))].filter((field) => {
        const key = Object.hasOwn(answerFields, field) ? answerFields[field] : undefined;
        if (shield?.answers && key) {
          if (shield.answers.moneyMoved === false && ["amountInr", "bankOrWallet", "paidAt", "utr"].includes(key)) return false;
          return shield.answers[key] === null;
        }
        return !resolved.has(field);
      });
      const now = new Date().toISOString();
      return {
        answers, shield, occurredAt, dna,
        rawText: body.rawText === undefined ? incident.rawText : redact(body.rawText).redacted,
        extractedFacts: facts,
        missingFacts,
        syntheticOnly: incident.syntheticOnly,
        completedActions: body.completedActions ?? incident.completedActions,
        ackNumber: body.submitMock ? (incident.ackNumber ?? makeAckNumber()) : incident.ackNumber,
        packets: body.submitMock ? (["ncrp", "bank", "police"] as const).map((recipient) => ({ recipient, status: "prepared_locally" as const, payload: { incidentId: id, preparedAt: now, sent: false } })) : incident.packets,
        routingEvents: body.submitMock && !incident.routingEvents.some((event) => event.type === "prepared_locally")
          ? [...incident.routingEvents, { type: "prepared_locally", message: "Prepared locally. Not sent to any authority or bank.", occurredAt: now, status: "recorded" as const }]
          : incident.routingEvents,
      };
    });
    if (!updated) return NextResponse.json({ error: "Incident not found" }, { status: 404, headers });
    return NextResponse.json({ incident: updated, ...(body.submitMock ? { status: "prepared_locally", sent: false } : {}) }, { headers });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid reviewed Shield answer" }, { status: 400, headers });
    return NextResponse.json({ error: "Incident storage is unavailable" }, { status: 503, headers });
  }
}
