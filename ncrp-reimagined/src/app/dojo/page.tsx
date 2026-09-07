"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Briefcase, CreditCard, Flame, Gauge, IndianRupee, Mic, MicOff, PhoneCall, PhoneOff, RotateCcw, Send, Share2, ShieldAlert, ShieldCheck, Siren, Sparkles, Swords, Trophy, Wifi, WifiOff, Zap,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { DOJO_SCENARIOS, DOJO_STAGES, STAGE_HINTS, STAGE_INDEX, SLIP_RULES, type DojoDifficulty, type DojoLanguage, type DojoScenario, type DojoStage } from "@/data/dojo";
import { assessLocal, type ShieldAssessment } from "@/lib/shield";
import type { DojoDebrief } from "@/app/api/dojo/debrief/route";

// -----------------------------------------------------------------------------
// Raksha Dojo — the scam calls YOU, before a real one does.
// A live OpenAI Realtime voice agent plays the scammer over WebRTC. Call Shield
// scores the caller's words as they land. A slip detector flags anything the
// trainee gives away. After hang-up, a structured debrief coaches the citizen.
// -----------------------------------------------------------------------------

type Phase = "setup" | "connecting" | "call" | "ending" | "debrief";
type Outcome = "resisted" | "complied" | "hung_up" | "timeout" | "aborted";
interface Turn { id: string; role: "scammer" | "you"; text: string; at: number; final: boolean }
interface StageState { stage: DojoStage["id"]; pressure: number; tactic: string }
interface Slip { kind: string; at: number; quote: string }

const IDLE: ShieldAssessment = {
  verdict: "listening", patternSlug: null, patternName: null, stageId: null, confidence: 0, method: "keyword", markers: [],
  coach: { headline: "", sayThis: "", doNot: [] }, language: "en",
};

const PHASE_LABELS = ["Setup", "Connecting", "Live call", "Debrief"];
const SILENCE_TYPING_MS = 1800;  // ms of silence before showing typing dots
const SILENCE_LATENCY_MS = 4500; // ms of silence before showing latency badge

/** Animated typing bubble shown when the caller is thinking / latency is high */
function CallerTypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="caller-bubble text-ink">
        <div className="dojo-typing-dots" aria-label="Caller is thinking">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function inferStage(callerText: string): StageState | null {
  if (!callerText.trim()) return null;
  const hit = STAGE_HINTS.find((h) => h.test.test(callerText));
  if (!hit) return null;
  return { stage: hit.stage, pressure: STAGE_INDEX[hit.stage] + 1, tactic: hit.tactic };
}

function fmtClock(totalSec: number) {
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function highlight(text: string, markers: ShieldAssessment["markers"]) {
  if (!markers.length) return text;
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const m of markers) {
    const at = lower.indexOf(m.quote.toLowerCase());
    if (at >= 0) ranges.push([at, at + m.quote.length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  for (const [s, e] of ranges) {
    if (s < cursor) continue;
    out.push(text.slice(cursor, s));
    out.push(<mark key={s}>{text.slice(s, e)}</mark>);
    cursor = e;
  }
  out.push(text.slice(cursor));
  return out;
}

function rank(a: ShieldAssessment) { return a.verdict === "scam" ? 2 : a.verdict === "suspicious" ? 1 : 0; }

type BestScores = Record<string, number>;
const BEST_KEY = "raksha-dojo-best";
function loadBest(): BestScores {
  try { return JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}") as BestScores; } catch { return {}; }
}

// -----------------------------------------------------------------------------

export default function DojoPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [scenario, setScenario] = useState<DojoScenario>(DOJO_SCENARIOS[0]);
  const [difficulty, setDifficulty] = useState<DojoDifficulty>("realistic");
  const [language, setLanguage] = useState<DojoLanguage>("hinglish");
  const [traineeName, setTraineeName] = useState("");
  const [error, setError] = useState("");
  const [best, setBest] = useState<BestScores>({});

  // Live call state
  const [turns, setTurns] = useState<Turn[]>([]);
  const [toolStage, setToolStage] = useState<StageState | null>(null);
  const [slips, setSlips] = useState<Slip[]>([]);
  const [serverAssessment, setServerAssessment] = useState<ShieldAssessment>(IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [scammerSpeaking, setScammerSpeaking] = useState(false);
  const [youSpeaking, setYouSpeaking] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [hasMic, setHasMic] = useState(true);
  const [typed, setTyped] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("aborted");
  const [debrief, setDebrief] = useState<DojoDebrief | null>(null);
  const [debriefPending, setDebriefPending] = useState(false);

  // Latency / silence indicator state
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [callerSilentSince, setCallerSilentSince] = useState<number | null>(null);
  const [, forceUpdate] = useState(0);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for the RTC plumbing
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAtRef = useRef<number>(0);
  const turnsRef = useRef<Turn[]>([]);
  const slipsRef = useRef<Slip[]>([]);
  const lastAssessedRef = useRef("");
  const assessBusyRef = useRef(false);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const responseActiveRef = useRef(false);
  const responseQueuedRef = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setBest(loadBest()));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => { turnsRef.current = turns; }, [turns]);
  useEffect(() => { slipsRef.current = slips; }, [slips]);
  const lastTurnText = turns[turns.length - 1]?.text;
  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [turns.length, lastTurnText]);

  const now = () => (performance.now() - startedAtRef.current) / 1000;

  // Timer
  useEffect(() => {
    if (phase !== "call") return;
    const t = setInterval(() => setElapsed(Math.floor(now())), 500);
    return () => clearInterval(t);
  }, [phase]);

  // Force re-render every second to keep silentMs fresh for the latency badge
  useEffect(() => {
    if (phase !== "call") return;
    const id = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // -- Latency / silence detection -------------------------------------------
  // When scammer stops speaking, start a timer. If responseActiveRef is true
  // and they still haven't spoken after SILENCE_TYPING_MS, show typing dots.
  useEffect(() => {
    if (phase !== "call") return;
    if (scammerSpeaking) {
      setCallerSilentSince(null);
      setShowTypingIndicator(false);
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    } else {
      setCallerSilentSince(Date.now());
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (responseActiveRef.current) setShowTypingIndicator(true);
      }, SILENCE_TYPING_MS);
    }
    return () => { if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; } };
  }, [scammerSpeaking, phase]);

  const silentMs = callerSilentSince ? Date.now() - callerSilentSince : 0;
  const showLatencyBadge = phase === "call" && !scammerSpeaking && silentMs > SILENCE_LATENCY_MS && responseActiveRef.current;

  // -- Live Call Shield on the scammer's words -------------------------------
  // Local keyword scoring is derived synchronously; the server (model) verdict
  // is merged in when it ranks at least as high. Same for the pressure ladder:
  // local inference is the floor, the agent's set_stage tool call is authoritative.
  const callerText = useMemo(() => turns.filter((t) => t.role === "scammer" && t.final).map((t) => t.text).join("\n"), [turns]);
  const localAssessment = useMemo(() => (callerText ? assessLocal(callerText) : IDLE), [callerText]);
  const assessment = rank(serverAssessment) >= rank(localAssessment) && serverAssessment.markers.length ? serverAssessment : localAssessment;
  const inferredStage = useMemo(() => inferStage(callerText), [callerText]);
  const stage = toolStage && (!inferredStage || STAGE_INDEX[toolStage.stage] >= STAGE_INDEX[inferredStage.stage]) ? toolStage : inferredStage;
  useEffect(() => {
    if (phase !== "call") return;
    const id = setInterval(async () => {
      const text = callerText;
      if (!text || text.length < 40 || text === lastAssessedRef.current || assessBusyRef.current) return;
      assessBusyRef.current = true;
      lastAssessedRef.current = text;
      try {
        const res = await fetch("/api/shield/assess", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript: text }) });
        if (res.ok) {
          const { assessment: a } = (await res.json()) as { assessment: ShieldAssessment };
          setServerAssessment((prev) => (rank(a) >= rank(prev) ? a : prev));
        }
      } catch { /* keep local */ } finally { assessBusyRef.current = false; }
    }, 4000);
    return () => clearInterval(id);
  }, [phase, callerText]);

  // -- Slip detector on the trainee's words ---------------------------------
  const detectSlips = useCallback((text: string, at: number) => {
    const found: Slip[] = [];
    for (const rule of SLIP_RULES) {
      const m = text.match(rule.test);
      if (!m) continue;
      // Don't double-count a 4-digit run inside an Aadhaar / card match.
      if (rule.kind === "OTP / PIN" && found.some((f) => f.kind === "Aadhaar number" || f.kind === "card number" || f.kind === "phone number")) continue;
      found.push({ kind: rule.kind, at, quote: m[0] });
    }
    if (found.length) setSlips((prev) => [...prev, ...found]);
  }, []);

  // -- Realtime plumbing ----------------------------------------------------
  const send = useCallback((event: Record<string, unknown>) => {
    const dc = dcRef.current;
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(event));
  }, []);

  /** Ask for a model turn without colliding with one already in flight. */
  const requestResponse = useCallback(() => {
    if (responseActiveRef.current) { responseQueuedRef.current = true; return; }
    responseActiveRef.current = true;
    // When requesting a response, start the typing indicator timer
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => setShowTypingIndicator(true), SILENCE_TYPING_MS);
    send({ type: "response.create" });
  }, [send]);

  const teardown = useCallback(() => {
    if (endTimerRef.current) { clearTimeout(endTimerRef.current); endTimerRef.current = null; }
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    try { dcRef.current?.close(); } catch { /* noop */ }
    try { pcRef.current?.getSenders().forEach((s) => s.track?.stop()); pcRef.current?.close(); } catch { /* noop */ }
    micRef.current?.getTracks().forEach((t) => t.stop());
    if (audioRef.current) { audioRef.current.srcObject = null; }
    dcRef.current = null; pcRef.current = null; micRef.current = null;
    setScammerSpeaking(false); setYouSpeaking(false);
    setShowTypingIndicator(false); setCallerSilentSince(null);
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const upsertTurn = useCallback((id: string, role: Turn["role"], text: string, final: boolean) => {
    setTurns((prev) => {
      const i = prev.findIndex((t) => t.id === id);
      if (i === -1) return [...prev, { id, role, text, at: now(), final }];
      const next = prev.slice();
      next[i] = { ...next[i], text, final };
      return next;
    });
  }, []);

  const finishCall = useCallback(async (finalOutcome: Outcome) => {
    setOutcome(finalOutcome);
    teardown();
    setPhase("debrief");
    setDebriefPending(true);
    const duration = now();
    const transcript = turnsRef.current.filter((t) => t.text.trim()).map((t) => ({ role: t.role, text: t.text.slice(0, 2000), at: Math.max(0, Math.round(t.at)) }));
    try {
      const res = await fetch("/api/dojo/debrief", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenario.slug, outcome: finalOutcome, durationSec: Math.round(duration), slips: [...new Set(slipsRef.current.map((s) => s.kind))], transcript }),
      });
      const json = (await res.json()) as { debrief: DojoDebrief };
      setDebrief(json.debrief);
      const current = loadBest();
      if ((current[scenario.slug] ?? -1) < json.debrief.score) {
        current[scenario.slug] = json.debrief.score;
        localStorage.setItem(BEST_KEY, JSON.stringify(current));
        setBest(current);
      }
    } catch {
      setDebrief(null);
      setError("Could not build your debrief. Your transcript is still shown below.");
    } finally { setDebriefPending(false); }
  }, [scenario.slug, teardown]);

  const hangUp = useCallback(async (finalOutcome: Outcome) => {
    if (phase === "ending" || phase === "debrief") return;
    setPhase("ending");
    await finishCall(finalOutcome);
  }, [finishCall, phase]);

  // Hard cap on call length (checked from the clock tick, not a render effect).
  const hangUpRef = useRef(hangUp);
  useEffect(() => { hangUpRef.current = hangUp; }, [hangUp]);
  useEffect(() => {
    if (phase !== "call") return;
    const cap = setInterval(() => { if (now() >= scenario.durationSec + 45) void hangUpRef.current("timeout"); }, 1000);
    return () => clearInterval(cap);
  }, [phase, scenario.durationSec]);

  const handleTool = useCallback((name: string, callId: string, args: string) => {
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(args || "{}"); } catch { /* ignore */ }
    if (name === "set_stage") {
      const s = String(parsed.stage ?? "hook") as DojoStage["id"];
      setToolStage({ stage: STAGE_INDEX[s] !== undefined ? s : "hook", pressure: Math.max(1, Math.min(5, Number(parsed.pressure) || 1)), tactic: String(parsed.tactic ?? "") });
      send({ type: "conversation.item.create", item: { type: "function_call_output", call_id: callId, output: JSON.stringify({ ok: true }) } });
      return;
    }
    if (name === "end_call") {
      const result: Outcome = parsed.outcome === "complied" ? "complied" : "resisted";
      send({ type: "conversation.item.create", item: { type: "function_call_output", call_id: callId, output: JSON.stringify({ ok: true, note: "Say your last_words now, then the line will drop." }) } });
      requestResponse();
      // Give the model a few seconds to deliver its last line, then drop.
      endTimerRef.current = setTimeout(() => { void finishCall(result); }, 7000);
      setPhase("ending");
      setOutcome(result);
    }
  }, [finishCall, requestResponse, send]);

  const onEvent = useCallback((raw: MessageEvent<string>) => {
    let e: Record<string, unknown>;
    try { e = JSON.parse(raw.data); } catch { return; }
    const type = String(e.type ?? "");
    switch (type) {
      case "response.created": responseActiveRef.current = true; return;
      case "response.done": {
        responseActiveRef.current = false;
        setShowTypingIndicator(false);
        if (responseQueuedRef.current) { responseQueuedRef.current = false; requestResponse(); }
        return;
      }
      case "conversation.item.input_audio_transcription.completed": {
        const text = String(e.transcript ?? "").trim();
        if (!text) return;
        const id = String(e.item_id ?? crypto.randomUUID());
        upsertTurn(id, "you", text, true);
        detectSlips(text, now());
        return;
      }
      case "response.output_audio_transcript.delta": {
        setShowTypingIndicator(false);
        const id = String(e.item_id ?? "live");
        setTurns((prev) => {
          const i = prev.findIndex((t) => t.id === id);
          if (i === -1) return [...prev, { id, role: "scammer", text: String(e.delta ?? ""), at: now(), final: false }];
          const next = prev.slice();
          next[i] = { ...next[i], text: next[i].text + String(e.delta ?? "") };
          return next;
        });
        return;
      }
      case "response.output_audio_transcript.done": {
        upsertTurn(String(e.item_id ?? "live"), "scammer", String(e.transcript ?? ""), true);
        return;
      }
      case "response.output_item.done": {
        const item = e.item as { type?: string; name?: string; call_id?: string; arguments?: string } | undefined;
        if (item?.type === "function_call" && item.name && item.call_id) handleTool(item.name, item.call_id, item.arguments ?? "{}");
        return;
      }
      case "output_audio_buffer.started": setScammerSpeaking(true); setShowTypingIndicator(false); return;
      case "output_audio_buffer.stopped":
      case "output_audio_buffer.cleared": setScammerSpeaking(false); return;
      case "input_audio_buffer.speech_started": setYouSpeaking(true); return;
      case "input_audio_buffer.speech_stopped": setYouSpeaking(false); return;
      case "error": {
        const err = e.error as { message?: string; code?: string } | undefined;
        console.error("[dojo] realtime error", err?.code, err?.message);
        if (err?.message && !/cancel|active response/i.test(err.message)) setError(err.message);
        return;
      }
      default: return;
    }
  }, [detectSlips, handleTool, requestResponse, upsertTurn]);

  const startCall = useCallback(async () => {
    setError(""); setTurns([]); setSlips([]); setToolStage(null); setServerAssessment(IDLE); setElapsed(0); setDebrief(null); setOutcome("aborted");
    setShowTypingIndicator(false); setCallerSilentSince(null);
    lastAssessedRef.current = "";
    setPhase("connecting");
    try {
      const sessionRes = await fetch("/api/dojo/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenario.slug, difficulty, language, trainee: traineeName ? { name: traineeName } : undefined }),
      });
      const session = (await sessionRes.json()) as { clientSecret?: string; model?: string; error?: string };
      if (!sessionRes.ok || !session.clientSecret) throw new Error(session.error ?? "Could not start the rehearsal.");

      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      const audio = new Audio();
      audio.autoplay = true;
      audioRef.current = audio;
      pc.ontrack = (ev) => { audio.srcObject = ev.streams[0]; void audio.play().catch(() => undefined); };

      let mic: MediaStream | null = null;
      try {
        mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        micRef.current = mic;
        pc.addTrack(mic.getAudioTracks()[0], mic);
        setHasMic(true);
      } catch {
        // No mic: still receive audio; trainee replies by typing.
        pc.addTransceiver("audio", { direction: "recvonly" });
        setHasMic(false);
      }

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("message", onEvent);
      dc.addEventListener("open", () => {
        startedAtRef.current = performance.now();
        setPhase("call");
        // The scammer speaks first — show typing indicator while they're connecting
        responseActiveRef.current = true;
        send({ type: "response.create" });
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => setShowTypingIndicator(true), SILENCE_TYPING_MS);
      });
      dc.addEventListener("close", () => { /* handled by finish/hangUp */ });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpRes = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(session.model ?? "gpt-realtime")}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.clientSecret}`, "Content-Type": "application/sdp" },
        body: offer.sdp,
      });
      if (!sdpRes.ok) throw new Error(`Voice connection failed (${sdpRes.status}).`);
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });
    } catch (reason) {
      teardown();
      setPhase("setup");
      setError(reason instanceof Error ? reason.message : "Could not start the rehearsal.");
    }
  }, [difficulty, language, onEvent, scenario.slug, send, teardown, traineeName]);

  const toggleMic = () => {
    const track = micRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const sendTyped = () => {
    const text = typed.trim();
    if (!text) return;
    const id = crypto.randomUUID();
    upsertTurn(id, "you", text, true);
    detectSlips(text, now());
    send({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text }] } });
    requestResponse();
    setTyped("");
  };

  const isScam = assessment.verdict === "scam";
  const stageIdx = stage ? STAGE_INDEX[stage.stage] : -1;
  const immunity = DOJO_SCENARIOS.filter((s) => (best[s.slug] ?? 0) >= 80).length;
  const phaseIndex = { setup: 0, connecting: 1, call: 2, ending: 2, debrief: 3 }[phase] ?? 0;

  const shareText = debrief
    ? `Maine Raksha Dojo pe "${scenario.title}" scam call ka rehearsal kiya — score ${debrief.score}/100 (${debrief.grade}).\n\nYaad rakho: ${debrief.oneLiner}\n\nFamily tip: ${debrief.familyTip}\n\nAap bhi try karo: ${typeof window !== "undefined" ? window.location.origin : ""}/dojo`
    : "";

  // Phase progress rail — mirrors the check/shield stage pattern
  const PhaseRail = ({ active }: { active: number }) => (
    <div className="stage-rail bg-surface mb-6" aria-label="Training stages">
      {PHASE_LABELS.map((label, index) => (
        <div key={label} className={index === active ? "is-active" : "opacity-60"}>
          <span className="block font-mono text-[10px] font-bold">0{index + 1}</span>
          <span className="mt-1 block text-xs font-bold">{label}</span>
        </div>
      ))}
    </div>
  );

  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="dojo" />

      {/* ========================= SETUP ========================= */}
      {phase === "setup" && (
        <main id="main-content" className="public-shell py-8 sm:py-12">
          {/* Emergency help bar — mirrors Check Suspect */}
          <section aria-label="Emergency help" className="panel mb-6 border-danger/40 bg-danger-soft p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink">Receiving a live scam call right now?</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:1930" className="inline-flex min-h-11 items-center rounded-[8px] bg-danger px-4 text-sm font-bold text-white">Call 1930: cyber fraud</a>
                <a href="tel:112" className="inline-flex min-h-11 items-center rounded-[8px] border border-danger/40 bg-paper px-4 text-sm font-bold text-danger">Call 112: immediate danger</a>
              </div>
            </div>
          </section>
          <PhaseRail active={phaseIndex} />
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
              <div>
                <p className="kicker flex items-center gap-2"><Swords size={14} aria-hidden="true" /> Raksha Dojo · Scam rehearsal</p>
                <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">
                  Let a scammer call you <span className="text-service">before</span> a real one does.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
                  An AI plays the caller — live, in Hindi, Hinglish or English — and applies the exact pressure a real fraud call centre uses.
                  You talk back. Call Shield watches. When you hang up, you get a coach&apos;s scorecard and the one line you should have said.
                </p>
                <ul className="mt-5 grid gap-2 text-sm text-ink-soft sm:grid-cols-3">
                  <li className="flex items-start gap-2"><PhoneCall size={16} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /> A real-time voice caller, not a quiz.</li>
                  <li className="flex items-start gap-2"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /> Every red flag lit up as it is spoken.</li>
                  <li className="flex items-start gap-2"><Trophy size={16} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /> A scorecard you can forward to family.</li>
                </ul>
              </div>
              <div className="panel p-5">
                <p className="mono-ref text-[11px] uppercase tracking-wider text-ink-faint">Your immunity</p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <p className="text-4xl font-bold tabular-nums text-ink">{immunity}</p>
                  <p className="text-sm text-ink-soft">/ {DOJO_SCENARIOS.length} shielded</p>
                </div>
                <div className="mt-4 space-y-3">
                  {DOJO_SCENARIOS.map((s) => {
                    const score = best[s.slug] ?? 0;
                    const shielded = score >= 80;
                    return (
                      <div key={s.slug}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="truncate text-[11px] font-semibold text-ink-soft">{s.title}</p>
                          {shielded
                            ? <ShieldCheck size={12} className="shrink-0 text-success" aria-label="Shielded" />
                            : score > 0
                              ? <span className="mono-ref shrink-0 text-[10px] text-ink-faint">{score}</span>
                              : null}
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-line">
                          <div
                            className={`h-full rounded-full transition-all ${shielded ? "bg-success" : score > 0 ? "bg-service" : ""}`}
                            style={{ width: score > 0 ? `${score}%` : "0%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[10px] leading-4 text-ink-faint">Score 80+ to earn a shield. Stored only on this device.</p>
              </div>
            </div>

            {/* Scenario picker */}
            <section aria-labelledby="pick-scenario" className="mt-10">
              <h2 id="pick-scenario" className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">1 · Who is calling?</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {DOJO_SCENARIOS.map((s) => {
                  const active = s.slug === scenario.slug;
                  const ScenarioIcon = { "digital-arrest": Siren, "kyc-bank-impersonation": CreditCard, "upi-collect-request": IndianRupee, "task-scam": Briefcase }[s.slug] ?? Swords;
                  return (
                    <button
                      key={s.slug} type="button" onClick={() => setScenario(s)} aria-pressed={active}
                      className={`group panel flex h-full flex-col gap-3 p-4 text-left transition-colors ${active ? "border-service ring-2 ring-service/30" : "hover:border-line-strong"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-200 ${active ? "border-service bg-service-soft" : "border-line bg-surface group-hover:border-service group-hover:bg-service-soft"}`}>
                          <ScenarioIcon size={16} className={`transition-colors duration-200 ${active ? "text-service" : "text-ink-faint group-hover:text-service"}`} aria-hidden="true" />
                        </span>
                        {(best[s.slug] ?? 0) >= 80 ? <ShieldCheck size={16} className="shrink-0 text-success" aria-label="Shielded" /> : best[s.slug] !== undefined ? <span className="mono-ref text-[11px] text-ink-faint">{best[s.slug]}</span> : null}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-ink">{s.title}</p>
                        <p className="mt-1 text-[13px] italic leading-5 text-ink-soft">{s.tagline}</p>
                      </div>
                      <p className="mt-auto text-[11px] text-ink-faint">For: {s.practiceFor.join(" · ")}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">2 · How hard?</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["gentle", "realistic", "ruthless"] as DojoDifficulty[]).map((d) => (
                    <button key={d} type="button" aria-pressed={difficulty === d} onClick={() => setDifficulty(d)}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-[8px] border px-4 text-sm font-bold capitalize transition-colors ${difficulty === d ? "border-command bg-command text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}>
                      {d === "ruthless" && <Flame size={14} aria-hidden="true" />}{d}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">3 · Language</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["hinglish", "hindi", "english"] as DojoLanguage[]).map((l) => (
                    <button key={l} type="button" aria-pressed={language === l} onClick={() => setLanguage(l)}
                      className={`inline-flex min-h-11 items-center rounded-[8px] border px-4 text-sm font-bold capitalize transition-colors ${language === l ? "border-command bg-command text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}>
                      {l === "hindi" ? "हिन्दी" : l}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">4 · Optional: your first name</h2>
                <input value={traineeName} onChange={(e) => setTraineeName(e.target.value.slice(0, 40))} placeholder="Real scammers already know it from leaks"
                  className="mt-3 min-h-11 w-full rounded-[10px] border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus:border-service" />
              </section>
            </div>

            {error && <p role="alert" className="mt-6 rounded-[8px] border border-danger/35 bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={startCall}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-service px-6 text-sm font-bold text-white hover:bg-command">
                <PhoneCall size={18} aria-hidden="true" /> Answer the call
              </button>
              <p className="text-xs leading-5 text-ink-faint">Uses your microphone. No mic? You can type replies. Nothing you say is stored on our servers; credentials are stripped before coaching.</p>
            </div>
          </div>
        </main>
      )}

      {/* ========================= CONNECTING ========================= */}
      {phase === "connecting" && (
        <main id="main-content" className="public-shell py-8 sm:py-12">
          <PhaseRail active={1} />
          <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
            <div className="dojo-ring" aria-hidden="true"><PhoneCall size={30} /></div>
            <p className="mono-ref mt-6 text-[11px] uppercase tracking-wider text-ink-faint">Incoming · simulation</p>
            <p className="mt-2 text-2xl font-bold tracking-[-.03em] text-ink">{scenario.callerName}</p>
            <p className="mt-1 text-sm text-ink-soft">{scenario.callerClaim}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-ink-faint">
              <span className="dojo-latency-dot" />
              <span>Connecting the caller — allow the microphone when asked</span>
            </div>
            <div className="mt-5 panel p-4 text-left max-w-xs w-full">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint mb-2">What to expect</p>
              <ul className="space-y-1.5 text-ink-soft text-xs leading-5">
                <li>• The AI caller will speak first</li>
                <li>• Reply naturally — you are being coached</li>
                <li>• Call Shield watches for scam tactics in real time</li>
                <li>• Your microphone stays local; only transcripts are sent</li>
              </ul>
            </div>
            <button type="button" onClick={() => { teardown(); setPhase("setup"); }} className="mt-6 text-sm font-bold text-service hover:underline">Cancel</button>
          </div>
        </main>
      )}

      {/* ========================= LIVE CALL ========================= */}
      {(phase === "call" || phase === "ending") && (
        <main id="main-content" className="public-shell py-6 sm:py-8">
          <PhaseRail active={2} />
          <div className="mx-auto max-w-6xl">
            {/* Caller bar */}
            <div className={`panel flex flex-wrap items-center gap-4 p-4 ${isScam ? "border-danger/40 bg-danger-soft" : phase === "ending" ? "border-warning/40 bg-warning-soft" : ""}`}>
              {/* Avatar with speaking animation (via .is-speaking modifier) */}
              <div
                className={`dojo-avatar shrink-0 transition-all ${isScam ? "bg-danger/10 text-danger" : "bg-service/10 text-service"} ${scammerSpeaking ? "is-speaking" : ""}`}
                aria-hidden="true"
              >
                <PhoneCall size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${phase === "ending" ? "bg-warning" : isScam ? "bg-danger animate-pulse" : "bg-success animate-pulse"}`} aria-hidden="true" />
                  <p className="mono-ref text-[10px] uppercase tracking-wider text-ink-faint">{phase === "ending" ? "Call ending" : "On call · simulation"}</p>
                  {/* Latency / long-silence badge */}
                  {showLatencyBadge && (
                    <span className="dojo-latency-badge" role="status" aria-live="polite">
                      <span className="dojo-latency-dot" />
                      <WifiOff size={10} aria-hidden="true" />
                      High latency — caller connecting
                    </span>
                  )}
                </div>
                <p className="truncate text-lg font-bold text-ink">{scenario.callerName} <span className="text-sm font-normal text-ink-soft">· {scenario.callerClaim}</span></p>
              </div>
              <p className="mono-ref text-2xl tabular-nums text-ink">{fmtClock(elapsed)}</p>
              <div className="flex items-center gap-2">
                {hasMic && (
                  <button type="button" onClick={toggleMic} aria-pressed={!micOn} aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-line-strong ${youSpeaking && micOn ? "ring-2 ring-service/40" : ""} ${!micOn ? "bg-ink text-white" : ""}`}>
                    {micOn ? <Mic size={18} aria-hidden="true" /> : <MicOff size={18} aria-hidden="true" />}
                  </button>
                )}
                <button type="button" onClick={() => void hangUp("hung_up")} disabled={phase === "ending"}
                  className="inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-danger px-5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60">
                  <PhoneOff size={16} aria-hidden="true" /> Cut the call
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              {/* Transcript */}
              <section aria-label="Live transcript" className="panel flex min-h-[420px] flex-col p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Live call · you vs the caller</p>
                  <div className="flex items-center gap-3">
                    {youSpeaking && micOn && (
                      <span className="dojo-latency-badge" style={{ background: "rgba(26,122,76,.1)", borderColor: "rgba(26,122,76,.3)", color: "var(--color-success)" }} aria-live="polite">
                        <Mic size={10} aria-hidden="true" />
                        Speaking…
                      </span>
                    )}
                    <p className="mono-ref text-[11px] text-ink-faint">{turns.filter((t) => t.role === "you").length} replies</p>
                  </div>
                </div>
                <div className="mt-3 max-h-[52vh] flex-1 space-y-2 overflow-y-auto pr-1">
                  {/* Improved empty state with icon */}
                  {turns.length === 0 && !showTypingIndicator && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="dojo-ring mb-4" style={{ width: "52px", height: "52px" }} aria-hidden="true">
                        <Wifi size={20} />
                      </div>
                      <p className="text-sm font-semibold text-ink">Waiting for the caller to speak…</p>
                      <p className="mt-1 text-xs text-ink-faint">The scammer will introduce themselves shortly</p>
                    </div>
                  )}
                  {turns.filter((t) => t.text.trim()).map((t) => (
                    <div key={t.id} className={`flex ${t.role === "you" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[85%] flex-col gap-0.5 ${t.role === "you" ? "items-end" : "items-start"}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                          {t.role === "you" ? "You" : scenario.callerName}
                        </p>
                        <p className={`text-sm leading-6 ${t.role === "you" ? "dojo-you-bubble" : "caller-bubble text-ink"}`}>
                          {t.role === "scammer" ? highlight(t.text, assessment.markers) : t.text}
                        </p>
                        {!t.final && t.role === "scammer" && (
                          <p className="text-[10px] italic text-ink-faint">receiving…</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Typing / latency indicator bubble */}
                  {showTypingIndicator && <CallerTypingBubble />}
                  <div ref={transcriptEndRef} />
                </div>
                {/* Text reply (always available; primary when there is no mic) */}
                <form onSubmit={(e) => { e.preventDefault(); sendTyped(); }} className="mt-3 flex gap-2 border-t border-line pt-3">
                  <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={hasMic ? "Or type a reply…" : "No microphone — type what you would say"}
                    className="min-h-11 flex-1 rounded-[10px] border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus:border-service" />
                  <button type="submit" aria-label="Send reply" className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-service text-white"><Send size={16} aria-hidden="true" /></button>
                </form>
              </section>

              {/* Right rail: pressure + shield + slips */}
              <div className="flex flex-col gap-4">
                <section aria-label="Manipulation stage" className="panel p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Pressure ladder</p>
                    <p className="mono-ref flex items-center gap-1 text-[11px] text-ink-faint"><Gauge size={12} aria-hidden="true" /> {stage ? `${stage.pressure}/5` : "—"}</p>
                  </div>
                  <ol className="mt-3 grid grid-cols-5 gap-1.5">
                    {DOJO_STAGES.map((s, i) => (
                      <li key={s.id} className="text-center">
                        <div className={`h-2 rounded-full ${i < stageIdx ? "bg-warning" : i === stageIdx ? (s.id === "payment" ? "bg-danger" : "bg-service") : "bg-line"}`} />
                        <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-wide ${i === stageIdx ? "text-ink" : "text-ink-faint"}`}>{s.label}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    {stage ? <><span className="font-bold text-ink">Tactic:</span> {stage.tactic || DOJO_STAGES[stageIdx]?.hint}</> : "Waiting for the caller to reveal a tactic…"}
                  </p>
                </section>

                <section aria-label="Call Shield" className={`panel p-5 ${isScam ? "border-danger/40 bg-danger-soft" : assessment.verdict === "suspicious" ? "border-warning/50 bg-warning-soft" : ""}`}>
                  <div className="flex items-center gap-2">
                    {isScam ? <Siren size={16} className="text-danger" aria-hidden="true" /> : <ShieldAlert size={16} className="text-ink-faint" aria-hidden="true" />}
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Call Shield · watching the caller</p>
                  </div>
                  <p className={`mt-2 text-lg font-bold ${isScam ? "text-danger" : "text-ink"}`}>
                    {isScam ? `Scam script: ${assessment.patternName}` : assessment.verdict === "suspicious" ? `Suspicious · ${assessment.patternName ?? "pattern forming"}` : "No known script yet"}
                  </p>
                  {assessment.coach.sayThis && (
                    <p className="mt-2 text-sm leading-6 text-ink"><span className="font-bold">Say this:</span> &ldquo;{assessment.coach.sayThis}&rdquo;</p>
                  )}
                  {assessment.markers.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {assessment.markers.slice(0, 4).map((m, i) => (
                        <li key={`${m.quote}-${i}`} className="text-[13px] leading-5 text-ink-soft"><span className="font-semibold text-ink">&ldquo;{m.quote}&rdquo;</span> — {m.why}</li>
                      ))}
                    </ul>
                  )}
                </section>

                <section aria-label="What you gave away" aria-live="polite" className={`panel p-5 ${slips.length ? "border-danger bg-danger-soft dojo-slip-flash" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className={slips.length ? "text-danger" : "text-ink-faint"} aria-hidden="true" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Slip detector · your words</p>
                  </div>
                  {slips.length === 0
                    ? <p className="mt-2 text-sm text-ink-soft">Nothing sensitive shared. Keep it that way.</p>
                    : <ul className="mt-2 flex flex-wrap gap-2">
                        {slips.map((s, i) => (
                          <li key={`${s.kind}-${i}`} className="rounded-[6px] border border-danger/40 bg-danger-soft px-3 py-1 text-xs font-bold text-danger">{s.kind} · {fmtClock(s.at)}</li>
                        ))}
                      </ul>}
                </section>
              </div>
            </div>
            {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
          </div>
        </main>
      )}

      {/* ========================= DEBRIEF ========================= */}
      {phase === "debrief" && (
        <main id="main-content" className="public-shell py-8 sm:py-12">
          <PhaseRail active={3} />
          <div className="mx-auto max-w-5xl">
            <p className="kicker flex items-center gap-2"><Sparkles size={14} aria-hidden="true" /> Debrief · {scenario.title} · {difficulty}</p>
            {debriefPending && (
              <div className="panel mt-4 p-8 text-center">
                <div className="dojo-ring mx-auto" aria-hidden="true"><Sparkles size={26} /></div>
                <p className="mt-4 text-sm font-semibold text-ink">Your coach is replaying the call…</p>
                <p className="mt-1 text-xs text-ink-faint">Analysing {turns.filter((t) => t.text.trim()).length} turns · {fmtClock(elapsed)}</p>
              </div>
            )}
            {!debriefPending && debrief && (
              <>
                <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
                  <section className={`panel flex flex-col items-center justify-center p-6 text-center ${debrief.grade === "Shielded" ? "bg-success-soft border-success/40" : debrief.grade === "Exposed" ? "bg-danger-soft border-danger/40" : "bg-warning-soft border-warning/50"}`}>
                    <div className="dojo-score" style={{ ["--score" as string]: debrief.score }}>
                      <span className="display text-5xl text-ink">{debrief.score}</span>
                    </div>
                    <p className={`mt-3 text-xl font-bold ${debrief.grade === "Shielded" ? "text-success" : debrief.grade === "Exposed" ? "text-danger" : "text-ink"}`}>{debrief.grade}</p>
                    <p className="mt-1 text-xs text-ink-faint">Outcome: {outcome.replace("_", " ")} · {fmtClock(elapsed)}</p>
                    {(best[scenario.slug] ?? 0) === debrief.score && <p className="mono-ref mt-2 text-[11px] uppercase tracking-wider text-service">Personal best</p>}
                  </section>
                  <section className="panel p-6">
                    <h1 className="mt-1 text-2xl font-bold tracking-[-.03em] text-ink sm:text-3xl">{debrief.headline}</h1>
                    <p className="mt-3 text-sm leading-7 text-ink-soft">{debrief.summary}</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-success">What you did right</p>
                        <ul className="mt-2 space-y-1.5">{debrief.wins.length ? debrief.wins.map((w) => <li key={w} className="flex gap-2 text-[13px] leading-5 text-ink"><span className="text-success" aria-hidden="true">✓</span>{w}</li>) : <li className="text-[13px] text-ink-faint">Nothing yet — try again.</li>}</ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-danger">Where it could have gone wrong</p>
                        <ul className="mt-2 space-y-1.5">{debrief.risks.map((r) => <li key={r} className="flex gap-2 text-[13px] leading-5 text-ink"><span className="text-danger" aria-hidden="true">•</span>{r}</li>)}</ul>
                      </div>
                    </div>
                  </section>
                </div>

                {debrief.moments.length > 0 && (
                  <section className="mt-5">
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Turning points · what to say instead</h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {debrief.moments.map((m, i) => (
                        <article key={i} className="panel p-5">
                          <p className="text-[13px] italic leading-5 text-ink-soft">Caller: &ldquo;{m.scammerSaid}&rdquo;</p>
                          <p className="mt-2 text-[13px] leading-5 text-ink">You: &ldquo;{m.youSaid}&rdquo;</p>
                          <p className="mt-3 rounded-[10px] border border-service/30 bg-service-soft p-3 text-sm font-bold leading-6 text-ink">Say instead: &ldquo;{m.betterSay}&rdquo;</p>
                          <p className="mt-2 text-xs leading-5 text-ink-faint">{m.why}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {/* The "one rule" — full-width dark say-now slab */}
                <section className="say-now mt-5 p-6">
                  <p className="kicker" style={{ color: "var(--saffron, #f4b942)" }}>The one rule from this call</p>
                  <p className="display mt-3 text-2xl leading-snug sm:text-[1.9rem]">&ldquo;{debrief.oneLiner}&rdquo;</p>
                  <p className="mt-4 text-sm leading-6" style={{ color: "rgba(254,252,248,.72)" }}>
                    <span className="font-bold" style={{ color: "#fefcf8" }}>Family tip:</span> {debrief.familyTip}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-success px-5 text-sm font-bold text-white hover:brightness-110">
                      <Share2 size={16} aria-hidden="true" /> Send to family on WhatsApp
                    </a>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(shareText)}
                      className="inline-flex min-h-12 items-center rounded-[10px] border border-white/20 bg-white/10 px-5 text-sm font-bold text-white hover:bg-white/20">Copy</button>
                  </div>
                </section>
              </>
            )}
            {!debriefPending && !debrief && error && <p role="alert" className="mt-4 rounded-[8px] border border-danger/35 bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}

            {/* Transcript replay */}
            <details className="panel mt-5 p-5">
              <summary className="cursor-pointer text-sm font-bold text-ink">Replay the transcript ({turns.length} lines{slips.length ? ` · ${slips.length} slip${slips.length === 1 ? "" : "s"}` : ""})</summary>
              <div className="mt-3 space-y-2">
                {turns.filter((t) => t.text.trim()).map((t) => (
                  <div key={t.id} className={`flex ${t.role === "you" ? "justify-end" : "justify-start"}`}>
                    <p className={`max-w-[85%] text-sm leading-6 ${t.role === "you" ? "dojo-you-bubble" : "caller-bubble text-ink"}`}><span className="mono-ref mr-2 text-[10px] text-ink-faint">{fmtClock(t.at)}</span>{t.text}</p>
                  </div>
                ))}
              </div>
            </details>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => { if (difficulty !== "ruthless") setDifficulty(difficulty === "gentle" ? "realistic" : "ruthless"); void startCall(); }}
                className="inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-service px-6 text-sm font-bold text-white hover:bg-command">
                <RotateCcw size={16} aria-hidden="true" /> Rehearse again{difficulty !== "ruthless" ? " — harder" : ""}
              </button>
              <button type="button" onClick={() => setPhase("setup")} className="inline-flex min-h-12 items-center gap-2 rounded-[10px] border border-line bg-surface px-6 text-sm font-bold text-ink hover:border-line-strong">Try another scam</button>
              <Link href="/shield" className="inline-flex min-h-12 items-center gap-2 rounded-[10px] border border-line bg-surface px-6 text-sm font-bold text-ink hover:border-line-strong">
                Turn on Call Shield for a real call <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
