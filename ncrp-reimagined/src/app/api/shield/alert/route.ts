import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getIncident, isIncidentId, updateIncident } from "@/lib/store";
import { sanitizeCredentials, readBoundedBody } from "@/lib/redact";

// Two modes: audio-only (no `to`) or phone call (`to` required).
const audioSchema = z.object({
  incidentId: z.string().refine(isIncidentId),
  consent: z.literal(true),
}).strict();
const callSchema = z.object({
  incidentId: z.string().refine(isIncidentId),
  to: z.string().regex(/^\+[1-9]\d{7,14}$/),
  consent: z.literal(true),
}).strict();

const cooldownMs = 60_000;
const replayMs = 10 * 60_000;
type AlertState = {
  locks: Set<string>;
  cooldowns: Map<string, number>;
  replays: Map<string, { expires: number; status: number; body: Record<string, unknown> }>;
};
const processState = globalThis as typeof globalThis & { rakshaAlertState?: AlertState };
const { locks, cooldowns, replays } = processState.rakshaAlertState ??= { locks: new Set(), cooldowns: new Map(), replays: new Map() };

function xmlEscape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function POST(req: NextRequest) {
  if (process.env.DEMO_MODE !== "true") return NextResponse.json({ error: "Demo calls are disabled. Raksha never dials public helplines automatically." }, { status: 403 });
  let input: unknown;
  try { input = await new Response(await readBoundedBody(req, 2048)).json(); }
  catch (error) { return NextResponse.json({ error: error instanceof RangeError ? "Input too large" : "Invalid JSON" }, { status: error instanceof RangeError ? 413 : 400 }); }

  // Determine mode: audio-only (Sarvam TTS) or phone call (Twilio).
  const hasTo = typeof (input as Record<string, unknown>)?.to === "string";

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 1: Audio-only — generate Sarvam Bulbul v3 TTS, return base64 audio
  // ═══════════════════════════════════════════════════════════════════════════
  if (!hasTo) {
    const parsed = audioSchema.safeParse(input);
    if (!parsed.success) return NextResponse.json({ error: "A valid incidentId and explicit consent are required" }, { status: 400 });
    const { incidentId } = parsed.data;
    if (incidentId === "DEMO0001") return NextResponse.json({ error: "The public example is read-only. Create your own synthetic demo copy first." }, { status: 409 });

    const sarvamKey = process.env.SARVAM_API_KEY;
    if (!sarvamKey) return NextResponse.json({ error: "SARVAM_API_KEY is not configured. Add it to .env.local to enable voice demo." }, { status: 503 });

    const incident = await getIncident(incidentId);
    if (!incident?.shield?.brief) return NextResponse.json({ error: "Save an incident brief first" }, { status: 404 });
    if (!incident.syntheticOnly) return NextResponse.json({ error: "Only synthetic demo incidents can use the voice demo" }, { status: 403 });

    const brief = sanitizeCredentials(incident.shield.brief);
    const spokenText = [
      "This is a Raksha prototype demonstration. Not a government service. No report has been filed.",
      brief.readAloud,
      "End of demonstration.",
    ].join(" ").slice(0, 2400); // Sarvam REST limit is 2500 chars

    try {
      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-subscription-key": sarvamKey },
        body: JSON.stringify({
          text: spokenText,
          language_code: "en-IN",
          speaker: "meera",
          model: "bulbul:v3",
          audio_format: "mp3",
          sample_rate: 22050,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.error("[shield] Sarvam TTS HTTP", res.status);
        return NextResponse.json({ error: "Voice generation failed. Check SARVAM_API_KEY." }, { status: 502 });
      }
      const data = (await res.json()) as { audios?: string[] };
      const audio = data.audios?.[0];
      if (!audio) return NextResponse.json({ error: "No audio returned from Sarvam" }, { status: 502 });

      // Record the audio demo in the incident alerts.
      await updateIncident(incidentId, (current) => ({
        shield: current.shield ? {
          ...current.shield,
          alerts: [...current.shield.alerts, {
            kind: "vapi-demo" as const, to: "browser-audio", at: new Date().toISOString(),
            status: "requested" as const, detail: "Audio briefing generated with Sarvam Bulbul v3; played in browser.",
          }],
        } : null,
      }));

      return NextResponse.json({
        ok: true, status: "requested",
        audio, audioMimeType: "audio/mp3",
        message: "Sarvam Bulbul v3 Indian English voice. No authority was contacted.",
      });
    } catch {
      return NextResponse.json({ error: "Voice generation timed out or failed" }, { status: 502 });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 2: Phone call via Twilio — requires TWILIO_* env vars
  // ═══════════════════════════════════════════════════════════════════════════
  const parsed = callSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "A valid incidentId, E.164 destination and explicit consent are required" }, { status: 400 });
  const { incidentId, to } = parsed.data;
  if (incidentId === "DEMO0001") return NextResponse.json({ error: "The public example is read-only. Create your own synthetic demo copy first." }, { status: 409 });
  const allow = (process.env.ALERT_ALLOWLIST ?? "").split(",").map((n) => n.trim()).filter(Boolean);
  if (!allow.includes(to)) return NextResponse.json({ error: "Destination is not on the demo allowlist" }, { status: 403 });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return NextResponse.json({ error: "Phone calling is unavailable (Twilio not configured). Use the audio preview instead." }, { status: 503 });

  const idempotencyKey = req.headers.get("idempotency-key");
  if (idempotencyKey !== null && !/^[a-zA-Z0-9_-]{8,128}$/.test(idempotencyKey)) return NextResponse.json({ error: "Invalid idempotency key" }, { status: 400 });

  const now = Date.now();
  for (const [entry, expiry] of cooldowns) if (expiry <= now) cooldowns.delete(entry);
  for (const [entry, replay] of replays) if (replay.expires <= now) replays.delete(entry);
  const replayKey = `${incidentId}:${to}:${idempotencyKey ?? "default"}`;
  const replay = replays.get(replayKey);
  if (replay) return NextResponse.json({ ...replay.body, replayed: true }, { status: replay.status });
  const lockKeys = [`case:${incidentId}`, `destination:${to}`];
  if (lockKeys.some((e) => locks.has(e))) return NextResponse.json({ error: "A demo call request is already in progress" }, { status: 409 });
  if (lockKeys.some((e) => cooldowns.has(e))) return NextResponse.json({ error: "Wait before requesting another demo call" }, { status: 429, headers: { "Retry-After": "60" } });
  if (replays.size + locks.size >= 4096) return NextResponse.json({ error: "Demo calling is temporarily busy" }, { status: 503 });
  lockKeys.forEach((e) => locks.add(e));

  let reserved = false;
  const at = new Date(now).toISOString();
  const finish = (body: Record<string, unknown>, status: number) => {
    if (reserved) replays.set(replayKey, { body, status, expires: Date.now() + replayMs });
    return NextResponse.json(body, { status });
  };
  try {
    const incident = await getIncident(incidentId);
    if (!incident?.shield?.brief) return finish({ error: "Save an incident brief first" }, 404);
    if (!incident.syntheticOnly) return finish({ error: "Only synthetic demo incidents can request demo calls" }, 403);
    if (incident.shield.alerts.some((a) => a.kind === "vapi-demo" && now - Date.parse(a.at) < cooldownMs)) return finish({ error: "Wait before requesting another demo call" }, 429);

    const brief = sanitizeCredentials(incident.shield.brief);
    const spokenText = xmlEscape([
      "This is a Raksha prototype demonstration. Not a government service.",
      brief.readAloud,
      "End of demonstration.",
    ].join(" ").slice(0, 3000));
    const twiml = `<Response><Say voice="Polly.Kajal-Neural" language="en-IN">${spokenText}</Say></Response>`;

    const saved = await updateIncident(incidentId, (current) => ({ shield: current.shield ? {
      ...current.shield,
      alerts: [...current.shield.alerts, { kind: "vapi-demo" as const, to, at, status: "requested" as const, detail: "Demo call requested via Twilio; delivery unverified." }],
    } : null }));
    if (!saved?.shield) return finish({ error: "Could not reserve the demo request" }, 503);
    reserved = true;
    lockKeys.forEach((e) => cooldowns.set(e, now + cooldownMs));

    let accepted = false;
    try {
      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const body = new URLSearchParams({ To: to, From: fromNumber, Twiml: twiml, TimeLimit: "300" });
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${credentials}` },
          body: body.toString(),
          signal: AbortSignal.timeout(8000),
        },
      );
      accepted = response.ok;
      await response.body?.cancel().catch(() => undefined);
    } catch { /* no provider details in logs */ }
    if (!accepted) {
      await updateIncident(incidentId, (current) => ({ shield: current.shield ? {
        ...current.shield,
        alerts: current.shield.alerts.map((a) => a.at === at && a.to === to ? { ...a, status: "failed" as const, detail: "Provider acceptance unconfirmed." } : a),
      } : null }));
      return finish({ error: "Demo call could not be confirmed. Use the audio preview instead." }, 502);
    }
    return finish({ ok: true, status: "requested", message: "Demo call requested. Delivery is not confirmed. No authority was contacted." }, 200);
  } catch {
    return finish({ error: reserved ? "Demo request outcome unknown." : "Storage unavailable" }, 503);
  } finally {
    lockKeys.forEach((e) => locks.delete(e));
  }
}
