"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import DemoCopyButton from "@/components/DemoCopyButton";

type SpeechState = "idle" | "playing" | "done" | "error";
type AudioState  = "idle" | "loading" | "playing" | "done" | "error";

export default function DemoAlertButton({
  incidentId,
  readAloud,
}: {
  incidentId: string;
  readAloud?: string;
}) {
  // ── Web Speech API (primary — zero cost, zero setup) ─────────────────────
  const [voices, setVoices]             = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName]       = useState("");
  const [speechState, setSpeechState]   = useState<SpeechState>("idle");
  const utterRef                        = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Sarvam Bulbul v3 (secondary — needs SARVAM_API_KEY) ──────────────────
  const [sarvamState, setSarvamState]   = useState<AudioState>("idle");
  const [sarvamSrc, setSarvamSrc]       = useState("");
  const [sarvamMsg, setSarvamMsg]       = useState("");
  const sarvamUrlRef                    = useRef("");
  const audioPending                    = useRef(false);

  // ── Twilio phone call (tertiary — needs TWILIO_PHONE_NUMBER setup) ────────
  const [to, setTo]                     = useState("");
  const [consent, setConsent]           = useState(false);
  const [callState, setCallState]       = useState<"idle" | "calling" | "done" | "error">("idle");
  const [callMsg, setCallMsg]           = useState("");
  const callPending                     = useRef(false);
  const requestKeys                     = useRef(new Map<string, string>());

  // Load available voices; auto-select the best Indian English one.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const pick = (all: SpeechSynthesisVoice[]) => {
      return (
        all.find((v) => v.lang === "en-IN" && v.name.toLowerCase().includes("natural")) ||
        all.find((v) => v.lang === "en-IN" && v.name.toLowerCase().includes("neural"))  ||
        all.find((v) => v.lang === "en-IN")                                             ||
        all.find((v) => v.name.includes("Swati") || v.name.includes("Rishi"))          ||
        all.find((v) => v.lang.startsWith("en"))                                        ||
        null
      );
    };
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);
      const best = pick(all);
      if (best && !voiceName) setVoiceName(best.name);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSpeechState("error");
      return;
    }
    window.speechSynthesis.cancel();
    const disclaimer =
      "This is a Raksha prototype demonstration. Not a government service. No report has been filed with any authority.";
    const closing = "End of demonstration. Raksha has not contacted any police, bank, or emergency service.";
    const text = [disclaimer, readAloud ?? "", closing].filter(Boolean).join(" ");

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = "en-IN";
    utter.rate  = 0.88;
    utter.pitch = 1;

    const voice = voices.find((v) => v.name === voiceName);
    if (voice) utter.voice = voice;

    utter.onstart = () => setSpeechState("playing");
    utter.onend   = () => setSpeechState("done");
    utter.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") return;
      setSpeechState("error");
    };

    utterRef.current = utter;
    setSpeechState("playing");
    window.speechSynthesis.speak(utter);
  }

  function stopSpeech() {
    window.speechSynthesis?.cancel();
    setSpeechState("idle");
  }

  // ── Sarvam TTS ──────────────────────────────────────────────────────────
  async function playDemoAudio() {
    if (audioPending.current || sarvamState === "playing" || incidentId === "DEMO0001") return;
    audioPending.current = true;
    setSarvamState("loading");
    setSarvamMsg("");
    try {
      const res = await fetch("/api/shield/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId, consent: true }),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await res.json()) as {
        ok?: boolean; status?: string; audio?: string;
        audioMimeType?: string; message?: string; error?: string;
      };
      if (!res.ok || !result.audio) {
        setSarvamState("error");
        setSarvamMsg(result.error ?? "Add SARVAM_API_KEY to .env.local to enable Sarvam Bulbul v3.");
        return;
      }
      const bytes = atob(result.audio);
      const arr   = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: result.audioMimeType ?? "audio/mp3" });
      if (sarvamUrlRef.current) URL.revokeObjectURL(sarvamUrlRef.current);
      const url = URL.createObjectURL(blob);
      sarvamUrlRef.current = url;
      setSarvamSrc(url);
      setSarvamState("playing");
      setSarvamMsg(result.message ?? "Sarvam Bulbul v3 Indian English voice.");
    } catch {
      setSarvamState("error");
      setSarvamMsg("Could not reach the audio API. Check SARVAM_API_KEY and your connection.");
    } finally {
      audioPending.current = false;
    }
  }

  // ── Twilio phone call ──────────────────────────────────────────────────
  async function fireCall() {
    if (callPending.current || callState === "done" || incidentId === "DEMO0001") return;
    if (!consent || !/^\+[1-9]\d{7,14}$/.test(to.trim())) {
      setCallState("error");
      setCallMsg("Enter an allowlisted number with country code and confirm consent.");
      return;
    }
    callPending.current = true;
    setCallState("calling");
    setCallMsg("");
    try {
      const destination   = `${incidentId}:${to.trim()}`;
      const idempotencyKey = requestKeys.current.get(destination) ?? crypto.randomUUID();
      requestKeys.current.set(destination, idempotencyKey);
      const res = await fetch("/api/shield/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ incidentId, to: to.trim(), consent: true }),
        signal: AbortSignal.timeout(15000),
      });
      const result = (await res.json()) as { ok?: boolean; status?: string; message?: string; error?: string };
      if (!res.ok || result.ok !== true || result.status !== "requested") {
        setCallState("error");
        setCallMsg(
          res.status === 503 || res.status === 403
            ? "Twilio not configured or TWILIO_PHONE_NUMBER missing. Use the audio options above."
            : "Call could not be confirmed. Use the audio options above.",
        );
        return;
      }
      setCallState("done");
      setCallMsg("Call request accepted. Delivery not confirmed. No authority was contacted.");
    } catch {
      setCallState("error");
      setCallMsg("Could not confirm the call request.");
    } finally {
      callPending.current = false;
    }
  }

  if (incidentId === "DEMO0001") return <DemoCopyButton nextPage="act" />;

  const hasReadAloud  = Boolean(readAloud);
  const hasSpeechAPI  = typeof window !== "undefined" && Boolean(window.speechSynthesis);
  const indianVoices  = voices.filter(
    (v) => v.lang.startsWith("en-IN") || v.name.includes("Swati") || v.name.includes("Rishi") || v.name.toLowerCase().includes("india"),
  );
  const otherVoices   = voices.filter((v) => !indianVoices.includes(v)).slice(0, 8);

  return (
    <div className="mt-4 space-y-5 rounded-[10px] border border-dashed border-line p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
        Simulated response desk · hear the briefing
      </p>

      {/* ═══════════════════════════════════════════════════════════════════
          PRIMARY — Web Speech API (zero cost, zero setup)
      ════════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-ink">Play briefing · browser speech</p>
            <p className="mt-0.5 text-[11px] leading-5 text-ink-soft">
              Uses your browser&apos;s built-in voice engine — no API key, no account, no cost.
              For the best Indian English voice, open in{" "}
              <strong className="text-ink">Microsoft Edge</strong>{" "}
              on Windows (<code className="font-mono">Microsoft Swati Online</code> is neural quality).
            </p>
          </div>
        </div>

        {/* Voice picker */}
        {(indianVoices.length > 0 || otherVoices.length > 0) && speechState !== "playing" && (
          <select
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            aria-label="Choose voice"
            className="mt-2 w-full rounded-[8px] border border-line bg-surface px-2 py-1.5 text-xs text-ink"
          >
            {indianVoices.length > 0 && (
              <optgroup label="Indian English (recommended)">
                {indianVoices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </optgroup>
            )}
            {otherVoices.length > 0 && (
              <optgroup label="Other voices">
                {otherVoices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </optgroup>
            )}
          </select>
        )}

        {/* Play / Stop */}
        <div className="mt-2 flex gap-2">
          {speechState !== "playing" ? (
            <button
              type="button"
              onClick={speak}
              disabled={!hasReadAloud || !hasSpeechAPI}
              className="inline-flex flex-1 min-h-12 items-center justify-center gap-2 rounded-[10px] bg-service px-4 text-sm font-bold text-white disabled:opacity-40 hover:bg-command"
            >
              <Volume2 size={16} aria-hidden="true" />
              {hasSpeechAPI ? "Play briefing" : "Browser speech unavailable"}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopSpeech}
              className="inline-flex flex-1 min-h-12 items-center justify-center gap-2 rounded-[10px] bg-danger px-4 text-sm font-bold text-white"
            >
              <VolumeX size={16} aria-hidden="true" />
              Stop
            </button>
          )}
          {(speechState === "done" || speechState === "error") && (
            <button
              type="button"
              onClick={speak}
              aria-label="Replay"
              className="inline-flex min-h-12 items-center gap-1.5 rounded-[10px] border border-line px-3 text-xs font-semibold text-ink-soft hover:text-ink"
            >
              <RotateCcw size={13} aria-hidden="true" /> Replay
            </button>
          )}
        </div>

        {speechState === "playing" && (
          <p role="status" className="mt-2 text-[11px] text-service">
            <span className="live-dot mr-1" aria-hidden="true" />
            Playing…{voiceName ? ` ${voiceName}` : ""}
          </p>
        )}
        {speechState === "done" && (
          <p role="status" className="mt-2 text-[11px] text-success">
            ✓ Briefing complete. No authority was contacted.
          </p>
        )}
        {speechState === "error" && (
          <p role="alert" className="mt-2 text-[11px] text-danger">
            Speech unavailable in this browser. Try Sarvam Bulbul v3 below, or copy the brief.
          </p>
        )}
        {!hasReadAloud && (
          <p className="mt-2 text-[11px] text-ink-faint">
            Brief not yet generated — complete the Shield flow and save first.
          </p>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECONDARY — Sarvam Bulbul v3 (better voice, needs API key)
      ════════════════════════════════════════════════════════════════════ */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-ink-soft hover:text-ink">
          <span className="transition-transform duration-150 group-open:rotate-90">▶</span>
          Better voice: Sarvam Bulbul v3 (add SARVAM_API_KEY to .env.local)
        </summary>
        <div className="mt-3 space-y-2">
          <p className="text-[11px] leading-5 text-ink-soft">
            Neural Indian English/Hindi voice. Add <code className="font-mono">SARVAM_API_KEY</code> from{" "}
            <strong>dashboard.sarvam.ai</strong> to .env.local, then restart dev. Brief text is sent to Sarvam — synthetic data only.
          </p>
          {sarvamState !== "playing" && sarvamState !== "done" && (
            <button
              type="button"
              onClick={playDemoAudio}
              disabled={sarvamState === "loading"}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-sm font-semibold text-ink disabled:opacity-50 hover:border-line-strong"
            >
              {sarvamState === "loading" ? (
                <><span className="live-dot" aria-hidden="true" /> Generating…</>
              ) : (
                <>▶ Generate Sarvam audio</>
              )}
            </button>
          )}
          {(sarvamState === "playing" || sarvamState === "done") && sarvamSrc && (
            <div>
              <audio controls autoPlay src={sarvamSrc} className="w-full rounded-[8px]" onEnded={() => setSarvamState("done")} />
              <button type="button" onClick={() => { setSarvamState("idle"); setSarvamSrc(""); }} className="mt-1 text-[11px] text-service underline">Regenerate</button>
            </div>
          )}
          {sarvamMsg && (
            <p role={sarvamState === "error" ? "alert" : "status"} className={`text-[11px] leading-5 ${sarvamState === "error" ? "text-danger" : "text-ink-soft"}`}>
              {sarvamMsg}
            </p>
          )}
        </div>
      </details>

      {/* ═══════════════════════════════════════════════════════════════════
          TERTIARY — Twilio outbound phone call
      ════════════════════════════════════════════════════════════════════ */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-ink-soft hover:text-ink">
          <span className="transition-transform duration-150 group-open:rotate-90">▶</span>
          Call an allowlisted phone (requires TWILIO_PHONE_NUMBER — Twilio trial free)
        </summary>
        <div className="mt-3 space-y-2">
          <p className="text-[11px] leading-5 text-ink-soft">
            Real phone rings using Polly.Kajal-Neural voice. Requires a verified Twilio number
            (free trial). Not a police, bank, 112, or 1930 connection.
          </p>
          {callState !== "done" && (
            <fieldset disabled={callState === "calling"} className="space-y-2">
              <label className="block text-sm text-ink">
                Allowlisted recipient (E.164)
                <input
                  type="tel"
                  autoComplete="off"
                  value={to}
                  onChange={(e) => { setTo(e.target.value); setConsent(false); }}
                  placeholder="+918XXXXXXXXX"
                  className="mt-1 min-h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-sm text-ink"
                />
              </label>
              <label className="flex min-h-10 items-start gap-2 text-[11px] leading-5 text-ink-soft">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                I have the recipient&apos;s permission and consent to sharing the brief with Twilio.
              </label>
              <button
                type="button"
                onClick={fireCall}
                disabled={!consent || callState === "calling"}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-command px-4 text-sm font-bold text-white disabled:opacity-50"
              >
                {callState === "calling" ? "Requesting…" : "Request real demo call"}
              </button>
            </fieldset>
          )}
          {callMsg && (
            <p role={callState === "error" ? "alert" : "status"} className={`text-[11px] leading-5 ${callState === "error" ? "text-danger" : "text-ink-soft"}`}>
              {callMsg}
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
