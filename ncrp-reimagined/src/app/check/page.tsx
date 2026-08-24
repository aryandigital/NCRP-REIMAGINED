"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileImage, Fingerprint, Link2, MessageSquareText, Mic, PhoneCall, Search, ShieldCheck, Square, Upload } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { createLocalImageFingerprint } from "@/lib/hash";

type Mode = "paste" | "voice" | "upload" | "identifier" | "private";

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
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type VoiceWindow = Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; };

function CheckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<Mode>(() => requestedMode === "emergency" ? "identifier" : "paste");
  const [text, setText] = useState(() => searchParams.get("q") ?? "");
  const [identifier, setIdentifier] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashing, setHashing] = useState(false);
  const [localFingerprint, setLocalFingerprint] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const draftLoadedRef = useRef(false);
  const emergency = requestedMode === "emergency";
  const recovery = requestedMode === "lost";

  useEffect(() => {
    if (searchParams.get("q")) {
      draftLoadedRef.current = true;
      return;
    }
    const timeout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("raksha-intake-draft");
        if (saved) {
          const draft = JSON.parse(saved) as { mode?: Mode; text?: string; identifier?: string; voiceLanguage?: string };
          if (draft.mode) setMode(draft.mode);
          if (draft.text) setText(draft.text);
          if (draft.identifier) setIdentifier(draft.identifier);
          if (draft.voiceLanguage) setVoiceLanguage(draft.voiceLanguage);
        }
      } catch {
        // A blocked or malformed local draft should never stop intake.
      } finally {
        draftLoadedRef.current = true;
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  useEffect(() => {
    if (!draftLoadedRef.current) return;
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem("raksha-intake-draft", JSON.stringify({ mode, text, identifier, voiceLanguage }));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [identifier, mode, text, voiceLanguage]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || q.trim().length <= 3) return;
    const timeout = window.setTimeout(() => {
      const form = new FormData();
      form.append("text", q);
      fetch("/api/analyze", { method: "POST", body: form })
        .then((response) => response.json())
        .then(({ id }: { id?: string }) => { if (id) router.push(`/check/${id}`); })
        .catch(() => setError("We could not analyse that message. Try again or open the example case."));
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [router, searchParams]);

  const selectFile = useCallback((selected: File | undefined) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, WEBP, or HEIC image.");
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError("Keep the image under 8 MB.");
      return;
    }
    setError("");
    setLocalFingerprint("");
    setFile(selected);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }, [selectFile]);

  function toggleVoiceCapture() {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = (window as VoiceWindow).SpeechRecognition ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice capture is not supported in this browser. Use the text box instead.");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceLanguage;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      setText(transcript.trim());
    };
    recognition.onerror = () => {
      setRecording(false);
      setError("Voice capture stopped. Check microphone access or continue by typing the transcript.");
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    setError("");
    setRecording(true);
    recognition.start();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (mode === "private") {
      if (!file) {
        setError("Choose the image you want to fingerprint on this device.");
        return;
      }
      setHashing(true);
      try {
        setLocalFingerprint(await createLocalImageFingerprint(file));
      } catch {
        setError("This image could not be fingerprinted in the browser.");
      } finally {
        setHashing(false);
      }
      return;
    }

    const body = mode === "identifier" ? identifier : text;
    if (!body && !file) {
      setError("Enter something to check, or choose a screenshot.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      if (body) form.append("text", body);
      if (file) form.append("image", file);
      const response = await fetch("/api/analyze", { method: "POST", body: form });
      if (!response.ok) throw new Error("Analysis failed");
      const { id } = await response.json() as { id: string };
      router.push(`/check/${id}`);
    } catch {
      setError("Analysis is unavailable right now. Use the example case or try again.");
      setLoading(false);
    }
  }

  const tabs: Array<{ id: Mode; label: string; icon: typeof MessageSquareText }> = [
    { id: "paste", label: "Message", icon: MessageSquareText },
    { id: "voice", label: "Voice", icon: Mic },
    { id: "upload", label: "Screenshot", icon: FileImage },
    { id: "identifier", label: "Number or link", icon: Link2 },
    { id: "private", label: "Private image hash", icon: Fingerprint },
  ];

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="check" />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="stage-rail bg-surface" aria-label="Incident stages">
          {["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => <div key={label} className={index === 0 ? "is-active" : "opacity-60"}><span className="block font-mono text-[10px] font-bold">0{index + 1}</span><span className="mt-1 block text-xs font-bold">{label}</span></div>)}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to response desk</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_310px] lg:items-start">
            <div>
              <p className="kicker">Step 01 / incident intake</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Show us what happened.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">We will identify the script, explain what may happen next, and prepare the safest response path.</p>

              {(emergency || recovery) && <div className={`mt-6 panel p-4 ${emergency ? "border-danger/40 bg-danger-soft" : "border-warning/40 bg-warning-soft"}`}><p className={`text-sm font-bold ${emergency ? "text-danger" : "text-warning"}`}>{emergency ? "If money is leaving now, call 1930 before you finish this form." : "Start with the incident record. We will keep the recovery actions in view."}</p><p className="mt-2 text-xs leading-5 text-ink-soft">This environment does not transmit reports to authorities.</p></div>}

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="panel p-2">
                  <div className="grid gap-1 sm:grid-cols-5" role="tablist" aria-label="Choose intake method">
                    {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} type="button" role="tab" aria-selected={mode === tab.id} onClick={() => { setMode(tab.id); setError(""); }} className={`flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-2 text-xs font-bold sm:px-3 ${mode === tab.id ? "bg-command text-white" : "text-ink-soft hover:bg-paper hover:text-ink"}`}><Icon size={15} aria-hidden="true" /><span>{tab.label}</span></button>; })}
                  </div>
                </div>

                {mode === "paste" && <div className="panel p-5"><label htmlFor="incident-message" className="block text-sm font-bold text-ink">Paste the message or conversation</label><textarea id="incident-message" value={text} onChange={(event) => setText(event.target.value)} placeholder={'Example: Your SBI account will be blocked. Share the OTP to verify.'} className="mt-3 min-h-[190px] w-full resize-y rounded-[8px] border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /><p className="mt-3 text-xs leading-5 text-ink-faint">English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.</p></div>}

                {mode === "voice" && <div className="panel p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><label htmlFor="voice-language" className="block text-sm font-bold text-ink">Tell the story in your own words</label><p className="mt-2 text-xs leading-5 text-ink-soft">Use the browser microphone for a local transcript. Hinglish works best when you choose the language you naturally speak.</p></div><label className="block sm:w-40"><span className="block text-[10px] font-bold uppercase tracking-[.1em] text-ink-faint">Voice language</span><select id="voice-language" value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)} className="mt-2 min-h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-xs font-semibold text-ink focus:border-service focus:bg-surface focus:outline-none"><option value="en-IN">English / India</option><option value="hi-IN">हिन्दी</option><option value="ta-IN">தமிழ்</option><option value="te-IN">తెలుగు</option><option value="bn-IN">বাংলা</option><option value="mr-IN">मराठी</option></select></label></div><button type="button" onClick={toggleVoiceCapture} className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-bold ${recording ? "bg-danger text-white" : "bg-command text-white"}`} aria-pressed={recording}>{recording ? <Square size={15} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}{recording ? "Stop recording" : "Start recording"}</button><label htmlFor="voice-transcript" className="mt-5 block text-sm font-bold text-ink">Transcript</label><textarea id="voice-transcript" value={text} onChange={(event) => setText(event.target.value)} placeholder="Your words will appear here. You can edit them before analysis." className="mt-3 min-h-[170px] w-full resize-y rounded-[8px] border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /><p className="mt-3 text-xs leading-5 text-ink-faint">Microphone access is optional. Nothing is sent until you choose Analyse this incident.</p></div>}

                {(mode === "upload" || mode === "private") && <div><div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`panel cursor-pointer border-2 border-dashed p-8 text-center ${dragging ? "border-service bg-service-soft" : file ? "border-success bg-success-soft" : "hover:border-service hover:bg-service-soft/40"}`}><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />{file ? <><Check size={28} className="mx-auto text-success" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-ink">{file.name}</p><p className="mt-1 text-xs text-ink-soft">{(file.size / 1024 / 1024).toFixed(1)} MB selected</p><button type="button" onClick={(event) => { event.stopPropagation(); setFile(null); setLocalFingerprint(""); }} className="mt-3 min-h-11 px-3 text-xs font-bold text-danger underline underline-offset-2">Remove image</button></> : <><Upload size={26} className="mx-auto text-service" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-ink">Drop an image here or browse</p><p className="mt-1 text-xs text-ink-soft">PNG, JPG, WEBP, and HEIC up to 8 MB</p></>}</div>{mode === "private" && <div className="mt-4 panel-tight border-service/30 bg-service-soft p-4"><div className="flex gap-3"><Fingerprint size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /><div><p className="text-sm font-bold text-ink">Local fingerprinting</p><p className="mt-1 text-xs leading-5 text-ink-soft">The original image stays in this browser. Raksha creates an on-device perceptual fingerprint. For real intimate-image protection, use the official StopNCII process.</p>{localFingerprint && <p className="mono-ref mt-3 break-all text-[11px] font-bold text-service">Fingerprint: {localFingerprint}</p>}</div></div></div>}</div>}

                {mode === "identifier" && <div className="panel p-5"><label htmlFor="incident-identifier" className="block text-sm font-bold text-ink">Enter a phone number, UPI ID, or link</label><div className="relative mt-3"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="incident-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Example: seller@ybl or https://example.com" className="min-h-12 w-full rounded-[8px] border border-line bg-paper pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /></div><p className="mt-3 text-xs leading-5 text-ink-faint">Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.</p></div>}

                {error && <div role="alert" className="panel border-danger/40 bg-danger-soft p-4 text-sm font-semibold text-danger">{error}</div>}

                <button type="submit" disabled={loading || hashing} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white hover:bg-command disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Analysing the incident..." : hashing ? "Creating local fingerprint..." : mode === "private" ? "Create local fingerprint" : "Analyse this incident"}{!loading && !hashing && <ArrowRight size={17} aria-hidden="true" />}</button>
              </form>

              <div className="mt-6 text-center"><p className="text-xs text-ink-faint">Want to see the complete response path?</p><Link href="/check/DEMO0001" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service hover:text-ink">Open the example task-scam case <ArrowRight size={15} aria-hidden="true" /></Link></div>
            </div>

            <aside className="space-y-4 lg:pt-8"><div className="panel border-danger/35 bg-danger-soft p-5"><div className="flex gap-3"><PhoneCall size={20} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" /><div><p className="text-sm font-bold text-danger">Money moving now?</p><p className="mt-2 text-xs leading-5 text-ink-soft">Call 1930 immediately. This intake can wait.</p><a href="tel:1930" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-danger px-4 text-sm font-bold text-white hover:bg-command">Call 1930 <ArrowRight size={15} aria-hidden="true" /></a></div></div></div><div className="panel p-5"><div className="flex gap-3"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" /><div><p className="text-sm font-bold text-ink">Privacy boundary</p><p className="mt-2 text-xs leading-5 text-ink-soft">Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.</p></div></div></div></aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckPage() {
  return <Suspense fallback={<div className="min-h-[100dvh] bg-paper" />}><CheckForm /></Suspense>;
}
