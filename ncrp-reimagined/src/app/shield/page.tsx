"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Mic, PhoneCall, Play, Save, ShieldAlert, Square,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { DEMO_CALL_LINES } from "@/data/demoCall";
import { assessLocal, type ShieldAssessment } from "@/lib/shield";
import { decideEscalation, emptyAnswers, type VictimAnswers } from "@/lib/brief";

// ── Speech API types (mirrors check/page.tsx) ──────────────────────────────
type SpeechResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
type VoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

// ── Constants ───────────────────────────────────────────────────────────────
type Phase  = "idle" | "listening" | "confirm" | "saving";
type Source = "mic" | "simulation" | "text";

const IDLE_ASSESSMENT: ShieldAssessment = {
  verdict: "listening", patternSlug: null, patternName: null, stageId: null,
  confidence: 0, method: "keyword", markers: [],
  coach: { headline: "Listening…", sayThis: "", doNot: [] },
  language: "en",
};

/** Fixed blip positions on the radar (percentages), revealed as markers land. */
const BLIP_POS: Array<[number, number]> = [
  [62, 22], [78, 44], [30, 30], [55, 68], [72, 66], [24, 58], [44, 18], [66, 80],
];

const SAVING_LINES = [
  "Filtering recognised identifiers and labelled credentials…",
  "Checking transcript evidence on the server…",
  "Preparing your draft brief. Nothing is sent to authorities.",
];

function rank(a: ShieldAssessment) {
  return a.verdict === "scam" ? 2 : a.verdict === "suspicious" ? 1 : 0;
}

function fmtClock(totalSec: number) {
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Highlight marker quotes inside a transcript string ─────────────────────
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

// ── YesNo button pair ────────────────────────────────────────────────────────
function YesNo({
  value, onChange, yesLabel = "Yes", noLabel = "No",
}: { value: boolean | null; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={value === true}
        onClick={() => onChange(true)}
        className={`inline-flex min-h-12 items-center rounded-full border px-6 text-sm font-bold transition-colors ${value === true ? "border-danger bg-danger text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        aria-pressed={value === false}
        onClick={() => onChange(false)}
        className={`inline-flex min-h-12 items-center rounded-full border px-6 text-sm font-bold transition-colors ${value === false ? "border-success bg-success text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
      >
        {noLabel}
      </button>
    </div>
  );
}

// ── Question card shell ──────────────────────────────────────────────────────
function Question({
  n, title, hint, answered, children,
}: { n: number; title: React.ReactNode; hint?: string; answered: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`question-${n}`} className={`panel p-5 transition-colors sm:p-6 ${answered ? "border-service/40" : ""}`}>
      <div className="flex items-start gap-3">
        <span className={`mono-ref mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[11px] font-bold ${answered ? "bg-service text-white" : "bg-command text-ink-soft"}`}>
          {answered ? <CheckCircle2 size={15} aria-hidden="true" /> : `Q${n}`}
        </span>
        <div className="min-w-0 flex-1">
          <p id={`question-${n}`} className="text-sm font-bold leading-6 text-ink">{title}</p>
          {hint && <p className="mt-1 text-xs leading-5 text-ink-soft">{hint}</p>}
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

const fieldCls =
  "mt-1 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-service";

// ── Main page ────────────────────────────────────────────────────────────────
export default function ShieldPage() {
  const router = useRouter();

  // Phase
  const [phase, setPhase]           = useState<Phase>("idle");
  const [source, setSource]         = useState<Source>("mic");
  const [lang, setLang]             = useState<"hi-IN" | "en-IN">("hi-IN");

  // Detection
  const [bubbles, setBubbles]       = useState<string[]>([]);
  const [assessment, setAssessment] = useState<ShieldAssessment>(IDLE_ASSESSMENT);
  const [elapsed, setElapsed]       = useState(0);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [typedText, setTypedText] = useState("");

  // Confirm form state
  const [answers, setAnswers]       = useState<VictimAnswers>(emptyAnswers());
  const ans = (patch: Partial<VictimAnswers>) => setAnswers((prev) => ({ ...prev, ...patch }));

  const [error, setError]           = useState("");

  // Refs
  const startedAtRef    = useRef("");
  const endedAtRef      = useRef("");
  const startMsRef      = useRef(0);
  const transcriptRef   = useRef("");
  const recognitionRef  = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const simTimerRef     = useRef<number | null>(null);
  const lastAssessedRef = useRef("");
  const inFlightRef     = useRef(false);
  const listeningRef    = useRef(false);
  const sessionRef      = useRef(0);
  const assessmentRequestRef = useRef<AbortController | null>(null);
  const savingRef = useRef(false);
  const mainRef = useRef<HTMLElement | null>(null);

  function updateTranscript(lines: string[]) {
    const text = lines.join(" ").trim().slice(-12000);
    transcriptRef.current = text;
    setBubbles(lines);
    const local = assessLocal(text);
    setAssessment((prev) => (rank(local) > rank(prev) || prev.method === "keyword" ? local : prev));
  }

  useEffect(() => {
    if (phase === "idle") return;
    mainRef.current?.focus({ preventScroll: true });
    mainRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [phase]);

  // ── AI assessment on a steady 4 s cadence (reads ref, never stale) ───────
  useEffect(() => {
    if (phase !== "listening") return;
    const session = sessionRef.current;
    const id = window.setInterval(async () => {
      const t = transcriptRef.current;
      if (inFlightRef.current || t.length < 20 || t === lastAssessedRef.current) return;
      inFlightRef.current = true;
      lastAssessedRef.current = t;
      const controller = new AbortController();
      assessmentRequestRef.current = controller;
      try {
        const res = await fetch("/api/shield/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: t }),
          signal: controller.signal,
        });
        if (res.ok) {
          const { assessment: a } = (await res.json()) as { assessment: ShieldAssessment };
          if (!controller.signal.aborted && listeningRef.current && session === sessionRef.current) {
            setAssessment((prev) => (rank(a) >= rank(prev) ? a : prev));
          }
        }
      } catch { /* keep local */ }
      finally { if (session === sessionRef.current) inFlightRef.current = false; }
    }, 4000);
    return () => { window.clearInterval(id); assessmentRequestRef.current?.abort(); };
  }, [phase]);

  // ── Elapsed clock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "listening") return;
    const id = window.setInterval(() => {
      if (!endedAtRef.current) setElapsed(Math.max(0, Math.floor((Date.now() - startMsRef.current) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // ── Live mic ─────────────────────────────────────────────────────────────
  function startMic() {
    if (listeningRef.current) return;
    const Ctor = (window as VoiceWindow).SpeechRecognition
      ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Ctor) {
      setError("Speech recognition is unavailable. Type what you heard or try the scripted demo instead.");
      return;
    }
    const r = new Ctor();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = lang;
    let previous: string[] = [];
    let finalized: string[] = [];
    begin("mic");
    const session = sessionRef.current;
    r.onresult = (e) => {
      if (!listeningRef.current || session !== sessionRef.current) return;
      const finals: string[] = [];
      let live = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0].transcript.trim();
        if (!t) continue;
        if (res.isFinal) finals.push(t);
        else live = t;
      }
      finalized = finals;
      updateTranscript([...previous, ...finals, ...(live ? [live] : [])]);
    };
    const switchToText = () => {
      if (!listeningRef.current || session !== sessionRef.current) return;
      r.onend = null;
      r.onresult = null;
      r.stop();
      recognitionRef.current = null;
      setSource("text");
      setError("Microphone unavailable. Your existing transcript is kept; add what you heard below or continue to help.");
    };
    r.onerror = switchToText;
    r.onend = () => {
      if (!listeningRef.current || session !== sessionRef.current) return;
      previous = [...previous, ...finalized];
      finalized = [];
      try { r.start(); } catch { switchToText(); }
    };
    recognitionRef.current = r;
    try { r.start(); } catch { switchToText(); }
  }

  // ── Simulation ───────────────────────────────────────────────────────────
  function startSimulation() {
    if (listeningRef.current) return;
    begin("simulation");
    const session = sessionRef.current;
    const lines: string[] = [];
    let i = 0;
    const playNext = () => {
      if (!listeningRef.current || session !== sessionRef.current) return;
      if (i >= DEMO_CALL_LINES.length) {
        endedAtRef.current = new Date().toISOString();
        setPlaybackComplete(true);
        return;
      }
      const line = DEMO_CALL_LINES[i++];
      lines.push(line.text);
      updateTranscript([...lines]);
      const audio = new Audio(line.audio);
      audioRef.current = audio;
      let scheduled = false;
      const advance = (delay: number, unavailable = false) => {
        if (scheduled || !listeningRef.current || session !== sessionRef.current) return;
        scheduled = true;
        if (unavailable) setError("Audio unavailable. The fictional script continues as text; detection still works.");
        simTimerRef.current = window.setTimeout(playNext, delay);
      };
      audio.onended = () => advance(600);
      audio.onerror = () => advance(5000, true);
      audio.play().catch(() => advance(5000, true));
    };
    playNext();
  }

  function begin(s: Source) {
    if (listeningRef.current) return;
    sessionRef.current += 1;
    setError("");
    setBubbles([]);
    transcriptRef.current = "";
    setAssessment(IDLE_ASSESSMENT);
    setElapsed(0);
    setPlaybackComplete(false);
    setTypedText("");
    endedAtRef.current = "";
    inFlightRef.current = false;
    lastAssessedRef.current = "";
    startedAtRef.current    = new Date().toISOString();
    startMsRef.current      = Date.now();
    listeningRef.current    = true;
    setSource(s);
    setPhase("listening");
  }

  function stop() {
    endedAtRef.current ||= new Date().toISOString();
    listeningRef.current = false;
    sessionRef.current += 1;
    assessmentRequestRef.current?.abort();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
    setPhase("confirm");
  }

  useEffect(() => () => {
    listeningRef.current = false;
    sessionRef.current += 1;
    assessmentRequestRef.current?.abort();
    recognitionRef.current?.stop();
    audioRef.current?.pause();
    if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  async function saveAndContinue() {
    if (savingRef.current) return;
    if (!transcriptRef.current.trim()) {
      setError("No transcript was captured. Add a fictional transcript below before saving, or use the official help links without saving.");
      return;
    }
    savingRef.current = true;
    setPhase("saving");
    setError("");
    try {
      const res = await fetch("/api/shield/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptRef.current,
          source,
          answers,
          startedAt: startedAtRef.current,
          endedAt: endedAtRef.current || new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Could not save. Please try again.");
      }
      const { id } = (await res.json()) as { id: string };
      router.push(`/act/${id}?trigger=call`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.");
      setPhase("confirm");
    } finally {
      savingRef.current = false;
    }
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const escalationPreview = decideEscalation(answers);

  const answeredCount = [
    answers.immediateDanger !== null,
    !!(answers.victimName || answers.callbackNumber),
    !!answers.location,
    answers.moneyMoved !== null,
    answers.sharedCredentials !== null,
    !!(answers.callerNumber || answers.callerClaims),
  ].filter(Boolean).length;

  const blipCount = Math.min(assessment.markers.length, BLIP_POS.length);
  const isScam = assessment.verdict === "scam";

  const routeStamp =
    escalationPreview.escalation === "112"            ? { text: "ROUTE → 112", cls: "text-danger" }
    : escalationPreview.escalation === "1930"         ? { text: "ROUTE → 1930", cls: "text-danger" }
    : escalationPreview.escalation === "report-suspect" ? { text: "REPORT → NCRP", cls: "text-warning" }
    : { text: "DRAFT · CHECK FACTS", cls: "text-ink-soft" };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="shield-page min-h-[100dvh] bg-paper" data-raksha-i18n="react">
      <SiteHeader />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="shield-main public-shell py-8 pb-40 sm:py-12 sm:pb-40">

        {/* ══════════════════════ IDLE — mission briefing ══════════════════ */}
        {phase === "idle" && (
          <div className="mx-auto max-w-4xl">
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink">
              <ArrowLeft size={16} aria-hidden="true" /> Home
            </Link>

            <div className="mt-8 text-center">
              <p className="kicker">Call Shield · live call screening</p>
              <h1 className="display mx-auto mt-4 max-w-2xl text-4xl text-ink sm:text-5xl">
                Someone on the phone is pushing you?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-soft">
                Rehearse a suspicious call with fictional data. Raksha flags known patterns,
                gives you words to end the call, and prepares a fact-separated brief.
                Detection is advisory, not proof of a scam.
              </p>
            </div>

            {/* The radar IS the listen button */}
            <div className="mt-10">
              <button
                type="button"
                onClick={startMic}
                aria-label="Start listening to the call"
                className="radar radar-idle group mx-auto block cursor-pointer"
                data-state="idle"
              >
                <span className="radar-rings" aria-hidden="true" />
                <span className="radar-sweep" aria-hidden="true" />
                <span className="radar-core" aria-hidden="true">
                  <span className="transition-transform group-hover:scale-110">
                    <Mic size={30} />
                  </span>
                </span>
              </button>
              <p className="mt-4 text-center text-sm font-bold text-ink">
                Tap the radar to start listening
              </p>
              <p className="mt-1 text-center text-xs text-ink-faint">
                Chrome or Edge speech recognition may send audio to its provider.
                Recognised identifiers are filtered before text analysis; filtering is not anonymisation.
              </p>
            </div>

            {/* Language + actions */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex justify-center" role="group" aria-label="Caller's language">
                {(["hi-IN", "en-IN"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                    className={`min-h-11 border px-5 text-sm font-bold transition-colors ${l === "hi-IN" ? "rounded-l-full" : "rounded-r-full"} ${lang === l ? "border-service bg-service text-white" : "border-line bg-surface text-ink-soft hover:text-ink"}`}
                  >
                    {l === "hi-IN" ? "हिन्दी / Hinglish" : "English"}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={startMic} className="btn-ink">
                  <Mic size={18} aria-hidden="true" /> Listen to the call
                </button>
                <button type="button" onClick={startSimulation} className="btn-ghost">
                  <Play size={18} aria-hidden="true" /> Simulate a scam call
                </button>
              </div>
              <button type="button" onClick={() => begin("text")} className="btn-ghost mt-3 w-full">
                Type what you heard instead
              </button>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Simulation plays a synthetic voice reading a fictional digital-arrest script.
                Script text is supplied directly, not transcribed from audio. No real call was recorded.
              </p>
              {error && <p role="alert" className="mt-3 text-center text-sm text-danger">{error}</p>}
            </div>

            {/* Three-step strip */}
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {[
                ["01", "Separate device", "Raksha cannot join an existing phone call. Rehearse using speaker audio from a second device."],
                ["02", "Watch the radar", "Known scam scripts light up as blips, with the reason for each flag."],
                ["03", "Stop, then choose", "Optional answers become a draft brief. You choose whether to contact an official channel."],
              ].map(([n, t, d]) => (
                <div key={n} className="bg-surface p-5">
                  <p className="mono-ref text-xs font-bold text-service">{n}</p>
                  <p className="mt-2 text-sm font-bold text-ink">{t}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-soft">{d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════ LISTENING — the radar ═══════════════════ */}
        {phase === "listening" && (
          <div className="mx-auto max-w-6xl">
            {/* Status strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-danger">
                <span className={playbackComplete ? "" : "live-dot"} aria-hidden="true" />
                {playbackComplete ? "Demo complete" : source === "mic" ? "Listening" : source === "text" ? "Text screening" : "Scripted demo"}
              </span>
              <span className="mono-ref text-xs font-bold text-ink-soft">{fmtClock(elapsed)}</span>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-faint">
                {source === "mic" ? (lang === "hi-IN" ? "Hindi / Hinglish speech" : "English speech") : "Advisory screening"}
              </span>
              {source === "simulation" && (
                <span className="rounded-full border border-warning/50 bg-warning-soft px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                  Synthetic call · not a real recording
                </span>
              )}
              <span className="ml-auto text-[11px] text-ink-faint">
                {assessment.method === "model" ? "AI analysis" : "Keyword watch"} · redacted before analysis
              </span>
            </div>

            <div className="shield-actionbar flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 shadow-lg">
              <button type="button" onClick={stop} className="btn-ink flex-1">
                <Square size={16} aria-hidden="true" /> Stop screening &amp; get help
              </button>
              <p className="text-xs text-ink-soft">End the phone call yourself. Raksha cannot hang up for you.</p>
            </div>

            {source === "text" && (
              <form className="panel mt-4 p-4" onSubmit={(event) => {
                event.preventDefault();
                if (!typedText.trim()) return;
                updateTranscript([...bubbles, typedText.trim()]);
                setTypedText("");
              }}>
                <label htmlFor="heard-text" className="text-sm font-bold">What did you hear? Use fictional details, never actual credentials.</label>
                <textarea id="heard-text" value={typedText} maxLength={3000} onChange={(event) => setTypedText(event.target.value)} className={fieldCls} rows={3} />
                <button type="submit" disabled={!typedText.trim()} className="btn-ghost mt-2">Add to screening</button>
              </form>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {/* ── Left: radar + verdict ─────────────────────────────── */}
              <section
                role="alert"
                aria-live="assertive"
                className={`panel p-6 ${isScam ? "border-danger/60" : assessment.verdict === "suspicious" ? "border-warning/50" : ""}`}
              >
                <div className="radar" data-state={assessment.verdict}>
                  <div className="radar-rings" aria-hidden="true" />
                  <div className="radar-sweep" aria-hidden="true" />
                  {Array.from({ length: blipCount }).map((_, i) => (
                    <span
                      key={i}
                      className="radar-blip"
                      style={{ left: `${BLIP_POS[i][0]}%`, top: `${BLIP_POS[i][1]}%` }}
                      aria-hidden="true"
                    />
                  ))}
                  <div className="radar-core">
                    <div>
                      {isScam ? <ShieldAlert size={30} aria-hidden="true" /> : <Mic size={30} aria-hidden="true" />}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className={`mono-ref text-xl font-black tracking-[.18em] sm:text-2xl ${isScam ? "text-danger" : assessment.verdict === "suspicious" ? "text-warning" : "text-ink-soft"}`}>
                    {isScam ? "SCAM SCRIPT" : assessment.verdict === "suspicious" ? "SUSPICIOUS" : "LISTENING…"}
                  </p>
                  {assessment.patternName && (
                    <p className="mt-2 text-sm font-bold text-ink">{assessment.patternName}</p>
                  )}
                  <div className="mx-auto mt-4 max-w-[220px]">
                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      <span>Heuristic strength</span>
                      <span>{Math.round(assessment.confidence * 100)}%{assessment.method === "keyword" && assessment.confidence >= 0.7 ? " (keyword cap)" : ""}</span>
                    </div>
                    <div className="meter mt-1.5">
                      <span style={{ width: `${Math.round(assessment.confidence * 100)}%` }} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink-soft">{assessment.coach.headline}</p>
                  <p className="mt-2 text-xs text-ink-faint">Not a calibrated probability. A missing warning does not mean the call is safe.</p>
                </div>
              </section>

              {/* ── Right: coach + transcript ─────────────────────────── */}
              <div className="flex min-w-0 flex-col gap-4">
                {/* SAY THIS NOW — the glanceable coach */}
                {assessment.verdict !== "listening" && assessment.coach.sayThis && (
                  <section className="say-now p-5 sm:p-6">
                    <p className="kicker text-danger">Say this now — then hang up</p>
                    <p className="display mt-3 text-2xl leading-snug text-ink sm:text-[1.9rem]">
                      &ldquo;{assessment.coach.sayThis}&rdquo;
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Ruko · do not</p>
                        <ul className="mt-1.5 space-y-1">
                          {assessment.coach.doNot.map((d) => (
                            <li key={d} className="flex gap-2 text-[13px] leading-5 text-ink-soft">
                              <span className="text-danger" aria-hidden="true">✕</span>{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-end gap-2">
                        {isScam && (
                          <button
                            type="button"
                            onClick={stop}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-bold text-white hover:brightness-110"
                          >
                            <Square size={16} aria-hidden="true" />
                            Choose the right help
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Live transcript — caller bubbles */}
                <section className="panel min-w-0 flex-1 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                      {source === "simulation" ? "Fictional script" : "Screening transcript (speaker not verified)"}
                    </p>
                    <p className="mono-ref text-[11px] text-ink-faint">
                      {bubbles.length} line{bubbles.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto break-words">
                    {bubbles.length === 0 && (
                      <p className="text-sm text-ink-faint">
                        {source === "simulation" ? "Starting the fictional script…" : source === "text" ? "Add a fictional transcript above." : "Waiting for speech…"}
                      </p>
                    )}
                    {bubbles.map((b, i) => (
                      <p key={i} className="caller-bubble text-sm leading-6 text-ink">
                        {highlight(b, assessment.markers)}
                      </p>
                    ))}
                  </div>
                  {assessment.markers.length > 0 && (
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                        Why these are red flags
                      </p>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {assessment.markers.map((m, i) => (
                          <li key={`${m.quote}-${i}`} className="rounded-[10px] border border-danger/25 bg-danger-soft p-3 text-[13px]">
                            <span className="font-semibold text-ink">&ldquo;{m.quote}&rdquo;</span>
                            <span className="mt-0.5 block text-ink-soft">{m.why}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* Exit actions */}
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    type="button"
                    onClick={stop}
                    className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-bold text-white ${isScam ? "bg-danger hover:brightness-110" : "bg-service hover:bg-command"}`}
                  >
                    <PhoneCall size={18} aria-hidden="true" />
                     Continue to help
                  </button>
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Stop listening"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-bold text-ink hover:border-line-strong"
                  >
                    <Square size={15} aria-hidden="true" /> Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ CONFIRM — the dispatch desk ═════════════ */}
        {phase === "confirm" && (
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-success/40 bg-success-soft p-5">
              <p className="flex items-start gap-3 text-sm font-bold leading-6 text-ink">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                Screening stopped. If the call is still connected, end it yourself.
                These questions are optional; unanswered facts stay unknown. Use fictional details only.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="progress-cells flex-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className={i < answeredCount ? "is-done" : ""} />
                  ))}
                </div>
                <span className="mono-ref text-xs font-bold text-ink-soft">{answeredCount}/6</span>
              </div>
            </div>
            <div className="shield-actionbar flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 shadow-lg">
              <button type="button" onClick={saveAndContinue} className="btn-ink flex-1"><Save size={16} aria-hidden="true" /> Prepare draft brief</button>
              {(escalationPreview.escalation === "112" || escalationPreview.escalation === "1930") && (
                <a href={`tel:${escalationPreview.escalation}`} className="btn-ghost">Call {escalationPreview.escalation} yourself</a>
              )}
              <p className="w-full text-xs text-ink-soft">In a real emergency, call now. These questions can wait. Never call emergency services to test the demo.</p>
              {!transcriptRef.current.trim() && <button type="button" className="btn-ghost" onClick={() => begin("text")}>Add a fictional transcript</button>}
            </div>
            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
              {/* ── Questions ─────────────────────────────────────────── */}
              <div className="flex min-w-0 flex-col gap-4">
                <Question
                  n={1}
                  answered={answers.immediateDanger !== null}
                  title="Are you in immediate physical danger right now, or being stopped from leaving or hanging up?"
                >
                  <YesNo
                    value={answers.immediateDanger}
                    onChange={(v) => ans({ immediateDanger: v })}
                    yesLabel="Yes — I am in danger"
                    noLabel="No — I am safe"
                  />
                  {answers.immediateDanger === true && (
                    <div className="q-reveal mt-4">
                      <a
                        href="tel:112"
                        className="flex min-h-14 items-center justify-center gap-2 rounded-[12px] bg-danger px-5 text-base font-bold text-white hover:brightness-110"
                      >
                        <PhoneCall size={20} aria-hidden="true" />
                        Call 112 now (India unified emergency)
                        <span className="rounded-full border border-white/40 px-2 py-0.5 text-[11px]">
                          Opens your dialler
                        </span>
                      </a>
                      <p className="mt-2 text-xs text-ink-soft">
                        In a real emergency, call now; the questions can wait. Do not call 112 to test this demo.
                      </p>
                    </div>
                  )}
                </Question>

                <Question
                  n={2}
                  answered={!!(answers.victimName || answers.callbackNumber)}
                  title="Fictional contact details (optional)"
                  hint="These appear in the draft you review. Nothing is sent to authorities. Do not enter a real victim's details."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="victim-name" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Your name</label>
                      <input
                        id="victim-name"
                        maxLength={300}
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={answers.victimName ?? ""}
                        onChange={(e) => ans({ victimName: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="callback-number" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Callback number</label>
                      <input
                        id="callback-number"
                        maxLength={300}
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={answers.callbackNumber ?? ""}
                        onChange={(e) => ans({ callbackNumber: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                  </div>
                </Question>

                <Question
                  n={3}
                  answered={!!answers.location}
                  title="Your city / state"
                  hint="Adds location context to the draft. Raksha does not route or file complaints."
                >
                  <input
                    aria-label="Your city / state"
                    maxLength={300}
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={answers.location ?? ""}
                    onChange={(e) => ans({ location: e.target.value || null })}
                    className={fieldCls}
                  />
                </Question>

                <Question
                  n={4}
                  answered={answers.moneyMoved !== null}
                  title="Has any money moved?"
                >
                  <YesNo
                    value={answers.moneyMoved}
                    onChange={(v) => ans(v ? { moneyMoved: true } : { moneyMoved: false, amountInr: null, bankOrWallet: null, paidAt: null, utr: null })}
                    yesLabel="Yes, money moved"
                    noLabel="No"
                  />
                  {answers.moneyMoved === true && (
                    <div className="q-reveal mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="amount" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Amount (INR)</label>
                        <input
                          id="amount"
                          type="number"
                          min={0}
                          placeholder="24999"
                          value={answers.amountInr ?? ""}
                          onChange={(e) => ans({ amountInr: e.target.value ? Number(e.target.value) : null })}
                          className={fieldCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="bank-wallet" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Bank or wallet</label>
                        <input
                          id="bank-wallet"
                          maxLength={300}
                          type="text"
                          placeholder="HDFC Bank / PhonePe"
                          value={answers.bankOrWallet ?? ""}
                          onChange={(e) => ans({ bankOrWallet: e.target.value || null })}
                          className={fieldCls}
                        />
                      </div>
                      <div>
                        <p className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Approximate transfer time (optional)</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(["Just now", "~10 min ago", "~1 hour ago"] as const).map((chip) => {
                            const offsets: Record<string, number> = { "Just now": 0, "~10 min ago": 10, "~1 hour ago": 60 };
                            const iso = new Date(Date.now() - offsets[chip] * 60_000).toISOString();
                            const active = answers.paidAt && Math.abs(new Date(answers.paidAt).getTime() - new Date(iso).getTime()) < 120_000;
                            return (
                              <button
                                key={chip}
                                type="button"
                                aria-pressed={!!active}
                                onClick={() => ans({ paidAt: iso })}
                                className={`inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${active ? "border-service bg-service text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="utr" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">UTR / RRN (if you have it)</label>
                        <input
                          id="utr"
                          maxLength={300}
                          type="text"
                          placeholder="418722339012"
                          value={answers.utr ?? ""}
                          onChange={(e) => ans({ utr: e.target.value || null })}
                          className={fieldCls}
                        />
                      </div>
                    </div>
                  )}
                </Question>

                <Question
                  n={5}
                  answered={answers.sharedCredentials !== null}
                  title="Did you share an OTP, PIN or CVV, install an app, or give screen access?"
                  hint="Just yes or no. Never type the OTP or PIN itself here."
                >
                  <YesNo value={answers.sharedCredentials} onChange={(v) => ans({ sharedCredentials: v })} />
                </Question>

                <Question
                  n={6}
                  answered={!!(answers.callerNumber || answers.callerClaims)}
                  title="About the caller"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="caller-number" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Caller&apos;s number</label>
                      <input
                        id="caller-number"
                        maxLength={300}
                        type="tel"
                        placeholder="+91 70000 12345"
                        value={answers.callerNumber ?? ""}
                        onChange={(e) => ans({ callerNumber: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="caller-claims" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Claimed to be</label>
                      <input
                        id="caller-claims"
                        maxLength={300}
                        type="text"
                        placeholder="CBI officer / SBI customer care"
                        value={answers.callerClaims ?? ""}
                        onChange={(e) => ans({ callerClaims: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={answers.reportingForSomeoneElse}
                      onChange={(e) => ans({ reportingForSomeoneElse: e.target.checked })}
                      className="h-4 w-4 rounded border-line"
                    />
                    I am filling this in on behalf of someone else (parent, family member)
                  </label>
                </Question>
              </div>

              {/* ── Live dispatch ticket ───────────────────────────────── */}
              <aside className="ticket p-5 lg:sticky lg:top-24" aria-live="polite">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-ref text-[11px] font-bold uppercase tracking-[.16em] text-ink-faint">
                    Raksha dispatch · draft
                  </p>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint">
                    not sent
                  </span>
                </div>
                <div className="mt-4 font-mono text-[13px] leading-6">
                  {(
                    [
                      ["VICTIM", answers.victimName],
                      ["CALLBACK", answers.callbackNumber],
                      ["LOCATION", answers.location],
                      ["DANGER", answers.immediateDanger === null ? null : answers.immediateDanger ? "YES — immediate" : "no"],
                      ["MONEY", answers.moneyMoved === null ? null : answers.moneyMoved ? `${answers.amountInr ? `₹${answers.amountInr.toLocaleString("en-IN")}` : "moved"}${answers.bankOrWallet ? ` · ${answers.bankOrWallet}` : ""}${answers.utr ? ` · UTR ${answers.utr}` : ""}` : "no loss"],
                      ["ACCESS", answers.sharedCredentials === null ? null : answers.sharedCredentials ? "compromised" : "not shared"],
                      ["SUSPECT", answers.callerNumber ?? answers.callerClaims],
                    ] as Array<[string, string | null]>
                  ).map(([k, v]) => (
                    <div key={k} className="ticket-row">
                      <span className="text-ink-faint">{k}</span>
                      <span className={`min-w-0 break-words text-right ${v ? "text-ink" : "text-ink-faint/50"}`}>{v ?? "Unknown"}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-dashed border-line pt-4 text-center">
                  <span className={`ticket-stamp ${routeStamp.cls}`}>{routeStamp.text}</span>
                  <p className="mt-3 text-[11px] leading-5 text-ink-faint">{escalationPreview.reason}</p>
                </div>
                <div className="mt-5 grid gap-2">
                  <button
                    type="button"
                    onClick={saveAndContinue}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-service px-6 text-sm font-bold text-white hover:bg-command"
                  >
                    <Save size={17} aria-hidden="true" />
                    Prepare draft brief
                  </button>
                  <button
                    type="button"
                    onClick={saveAndContinue}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-6 text-sm font-bold text-ink hover:border-line-strong"
                  >
                    Skip remaining questions
                  </button>
                  <p className="text-center text-[11px] text-ink-faint">
                    Nothing is sent to any authority. You choose what happens next.
                  </p>
                </div>
                {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
              </aside>
            </div>
          </div>
        )}

        {/* ══════════════════════ SAVING ══════════════════════════════════ */}
        {phase === "saving" && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="radar radar-idle mx-auto" data-state="listening" style={{ width: 140 }}>
              <div className="radar-rings" aria-hidden="true" />
              <div className="radar-sweep" aria-hidden="true" />
              <div className="radar-core">
                <div style={{ height: 48, width: 48 }}><Save size={20} aria-hidden="true" /></div>
              </div>
            </div>
            <p className="mt-6 text-base font-bold text-ink">Preparing your brief</p>
            <ul className="mt-4 space-y-2">
              {SAVING_LINES.map((line, i) => (
                <li key={line} className="q-reveal mono-ref text-xs text-ink-soft" style={{ animationDelay: `${i * 600}ms` }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
