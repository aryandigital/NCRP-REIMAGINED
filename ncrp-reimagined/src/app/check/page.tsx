"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Square, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { createLocalImageFingerprint } from "@/lib/hash";
import { detectIdentifier } from "@/lib/identifier";
import { IconEvidence, IconGuide, IconRadar, IconVoice } from "@/components/icons";

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

type FingerprintState = "idle" | "hashing" | "ready" | "registering" | "error";

const EXAMPLES = [
  { label: "A suspicious link", value: "https://sbi-secure-kyc-verify.xyz/login" },
  { label: "A strange UPI ID", value: "refund.helpdesk9034@ybl" },
  { label: "A scam message", value: "Dear customer, your SBI account will be blocked today. Verify your KYC immediately or your account will be suspended. Call 9876543210." },
] as const;

function detectionLabel(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const detected = detectIdentifier(trimmed);
  if (!detected) {
    if (trimmed.length < 4) return null;
    return { label: "Reading this as a message", detail: "We compare the wording against scam scripts we hold" };
  }
  if (detected.kind === "url") return { label: "Reading this as a link", detail: "We check the address for phishing signals" };
  if (detected.kind === "upi") return { label: "Reading this as a UPI ID", detail: "We check the handle against fraud patterns" };
  return { label: "Reading this as a phone number", detail: "We check the number against scam indicators" };
}

function CheckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(() => searchParams.get("q") ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const [privateFile, setPrivateFile] = useState<File | null>(null);
  const [fingerprint, setFingerprint] = useState("");
  const [fingerprintState, setFingerprintState] = useState<FingerprintState>("idle");
  const [copied, setCopied] = useState(false);
  const [privateError, setPrivateError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const privateInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const draftLoadedRef = useRef(false);
  const emergency = searchParams.get("mode") === "emergency";
  const recovery = searchParams.get("mode") === "lost";

  const detection = detectionLabel(text);

  useEffect(() => {
    if (searchParams.get("q")) {
      draftLoadedRef.current = true;
      return;
    }
    const timeout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("raksha-intake-draft");
        if (saved) {
          const draft = JSON.parse(saved) as { text?: string; voiceLanguage?: string };
          if (draft.text) setText(draft.text);
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
      window.localStorage.setItem("raksha-intake-draft", JSON.stringify({ text, voiceLanguage }));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [text, voiceLanguage]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  // Error summaries take focus so the problem is announced, not just painted.
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || q.trim().length <= 3) return;
    const timeout = window.setTimeout(() => {
      const form = new FormData();
      form.append("text", q);
      fetch("/api/analyze", { method: "POST", body: form })
        .then((response) => response.json())
        .then(({ id }: { id?: string }) => { if (id) router.push(`/check/${id}`); })
        .catch(() => setError("We could not check that. Try again, or open the example case."));
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
    setFilePreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(selected);
    });
    setFile(selected);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }, [selectFile]);

  function clearFile() {
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
  }

  function toggleVoiceCapture() {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = (window as VoiceWindow).SpeechRecognition ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice input is not available in this browser. Type or paste instead.");
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
      setError("Voice input stopped. Check microphone access, or continue by typing.");
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

    const body = text.trim();
    if (!body && !file) {
      setError("Paste a message, number, UPI ID, or link — or attach a screenshot.");
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
      setError("We could not check that right now. Try again, or open the example case.");
      setLoading(false);
    }
  }

  // ── Private photo protection ──────────────────────────────────────────────

  const selectPrivateFile = useCallback(async (selected: File | undefined) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setPrivateError("Choose a PNG, JPG, WEBP, or HEIC image.");
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setPrivateError("Keep the image under 8 MB.");
      return;
    }
    setPrivateError("");
    setCopied(false);
    setFingerprint("");
    setPrivateFile(selected);

    // Protection starts the moment the photo is chosen. No extra click, no dead end.
    setFingerprintState("hashing");
    try {
      const code = await createLocalImageFingerprint(selected);
      setFingerprint(code);
      setFingerprintState("ready");
    } catch {
      setFingerprintState("error");
      setPrivateError("This photo could not be processed here. Try a different image.");
    }
  }, []);

  function clearPrivateFile() {
    setPrivateFile(null);
    setFingerprint("");
    setFingerprintState("idle");
    setCopied(false);
    setPrivateError("");
  }

  async function copyFingerprint() {
    try {
      await navigator.clipboard.writeText(fingerprint);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setPrivateError("Copy did not work. Select the code and copy it manually.");
    }
  }

  async function registerFingerprint() {
    if (!fingerprint) return;
    setFingerprintState("registering");
    setPrivateError("");
    try {
      const response = await fetch("/api/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      });
      if (!response.ok) throw new Error("Registration failed");
      const { id } = await response.json() as { id: string };
      router.push(`/check/${id}`);
    } catch {
      setFingerprintState("ready");
      setPrivateError("We could not open your case right now. Your code above still works — copy it and keep it, then try again.");
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="check" />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="stage-rail bg-surface" aria-label="Incident stages">
          {["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => <div key={label} className={index === 0 ? "is-active" : "opacity-60"}><span className="block font-mono text-[10px] font-bold">0{index + 1}</span><span className="mt-1 block text-xs font-bold">{label}</span></div>)}
        </div>

        <div className="mt-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to response desk</Link>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">Step 01 / tell us what happened</p>
              <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">Show us what happened.</h1>
              <p className="mt-3 text-[17px] leading-8 text-ink-soft">Paste anything you received. We work out what it is and check it for you.</p>
              <p className="mt-2.5 text-sm leading-6 text-ink-faint">Take as long as you need. Nothing is checked until you choose to continue, and you can ask someone you trust to help you with this.</p>
            </div>
            <Link href="/check/DEMO0001" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-service hover:text-ink">See a worked example <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>

          {(emergency || recovery) && <div className={`mt-6 p-5 ${emergency ? "notice notice-danger" : "notice notice-warning"}`}><p className={`text-[15px] font-bold ${emergency ? "text-danger" : "text-warning"}`}>{emergency ? "If money is leaving now, call 1930 before you finish this form." : "Start with the incident record. We will keep the recovery actions in view."}</p><p className="mt-2 text-sm leading-6 text-ink-soft">This environment does not transmit reports to authorities.</p></div>}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            {/* ── One box, every input type ────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="panel overflow-hidden">
              <div className="flex items-start gap-3 border-b border-line px-5 py-5 sm:px-7">
                <IconEvidence size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" />
                <div>
                  <p className="text-[15px] font-bold text-ink">What did they send you?</p>
                  <p className="mt-1.5 text-sm leading-6 text-ink-soft">A message, a phone number, a UPI ID, or a link. One box takes all of them.</p>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-7">
                <div className={`relative rounded-[4px] border bg-paper transition-colors ${dragging ? "border-service" : detection ? "border-service/50" : "border-line"} focus-within:border-service`}>
                  <label htmlFor="incident-input" className="sr-only">Paste the message, phone number, UPI ID, or link</label>
                  <textarea
                    id="incident-input"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    placeholder={"Paste here — a message, phone number, UPI ID, or link.\nYou can also drop a screenshot onto this box."}
                    rows={6}
                    className="min-h-[168px] w-full resize-y rounded-[4px] bg-transparent px-4 pb-16 pt-4 text-[15px] leading-7 text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 rounded-b-[12px] border-t border-line bg-surface/70 px-3 py-2.5">
                    <button type="button" onClick={toggleVoiceCapture} aria-pressed={recording} className={`inline-flex min-h-11 items-center gap-2 rounded-[3px] px-3 text-[13px] font-bold ${recording ? "bg-danger text-white" : "text-ink-soft hover:bg-paper hover:text-ink"}`}>
                      {recording ? <Square size={14} aria-hidden="true" /> : <IconVoice size={16} aria-hidden="true" />}
                      {recording ? "Stop" : "Speak instead"}
                    </button>
                    <label className="sr-only" htmlFor="voice-language">Voice language</label>
                    <select id="voice-language" value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)} className="min-h-11 rounded-[3px] border border-line bg-paper px-2.5 text-xs font-semibold text-ink focus:border-service focus:outline-none">
                      <option value="en-IN">English</option>
                      <option value="hi-IN">हिन्दी</option>
                      <option value="ta-IN">தமிழ்</option>
                      <option value="te-IN">తెలుగు</option>
                      <option value="bn-IN">বাংলা</option>
                      <option value="mr-IN">मराठी</option>
                    </select>
                    <span className="mx-1 hidden h-5 w-px bg-line-strong sm:block" aria-hidden="true" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-[3px] px-3 text-[13px] font-bold text-ink-soft hover:bg-paper hover:text-ink">
                      <IconRadar size={16} aria-hidden="true" />
                      Add screenshot
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
                    {detection && (
                      <span className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-service-soft px-3 text-xs font-bold text-service">
                        <span className="h-1.5 w-1.5 rounded-full bg-service" aria-hidden="true" />
                        {detection.label}
                      </span>
                    )}
                  </div>
                </div>

                {detection && <p className="mt-2.5 text-sm text-ink-faint">{detection.detail}.</p>}

                {file && (
                  <div className="mt-4 flex items-center gap-3 notice notice-success p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {filePreview && <img src={filePreview} alt="" className="h-12 w-12 rounded-[3px] object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{file.name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">Added as evidence · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <button type="button" onClick={clearFile} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[3px] px-3 text-xs font-bold text-ink-soft hover:bg-paper hover:text-danger">
                      <X size={14} aria-hidden="true" /> Remove
                    </button>
                  </div>
                )}

                {!text && !file && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-ink-faint">Not sure what to paste? Try one:</span>
                    {EXAMPLES.map((example) => (
                      <button key={example.label} type="button" onClick={() => { setText(example.value); setError(""); }} className="inline-flex min-h-11 items-center rounded-[3px] border border-line px-3.5 text-xs font-bold text-ink-soft hover:border-service hover:text-service">
                        {example.label}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div ref={errorRef} tabIndex={-1} role="alert" className="mt-5 notice notice-danger p-4">
                    <p className="text-sm font-bold text-danger">There is a problem</p>
                    <p className="mt-1.5 text-sm leading-6 text-ink">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[3px] bg-service px-5 text-base font-bold text-white hover:bg-[var(--saffron-deep)] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
                  {loading ? "Checking this..." : "Check this for me"}
                  {!loading && <ArrowRight size={17} aria-hidden="true" />}
                </button>

                <div className="mt-5 notice notice-service p-4">
                  <p className="text-xs font-bold text-ink">Raksha will never ask for your OTP, PIN, card number, or password.</p>
                  <p className="mt-1.5 text-xs leading-5 text-ink-soft">Do not type those here. Personal details are masked before anything is checked. Nobody who calls offering to recover your money for a fee is genuine.</p>
                </div>
              </div>
            </form>

            {/* ── Private photo protection ─────────────────────────────────── */}
            <section className="panel overflow-hidden" aria-labelledby="photo-protection-heading">
              <div className="border-b border-line px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <IconGuide size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" />
                  <div>
                    <p id="photo-protection-heading" className="text-[15px] font-bold text-ink">Is someone threatening to share your photos?</p>
                    <p className="mt-1.5 text-sm leading-6 text-ink-soft">You can act on it here without showing the photo to anyone, including us.</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-6">
                {fingerprintState === "idle" && (
                  <>
                    <div className="notice notice-warning p-4">
                      <p className="text-xs font-bold leading-5 text-warning">Do NOT send, share, or download any photo or video in order to use this.</p>
                      <p className="mt-1.5 text-xs leading-5 text-ink-soft">Only use a photo that is already on this device.</p>
                    </div>

                    <button type="button" onClick={() => privateInputRef.current?.click()} className="mt-4 flex w-full cursor-pointer flex-col items-center rounded-[4px] border-2 border-dashed border-line px-4 py-9 text-center transition-colors hover:border-service hover:bg-service-soft/40">
                      <IconGuide size={28} className="text-service" aria-hidden="true" />
                      <span className="mt-3 text-[15px] font-bold text-ink">Choose the photo to protect</span>
                      <span className="mt-1.5 text-xs text-ink-soft">A photo will not be shown on this screen</span>
                    </button>
                    <input ref={privateInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => selectPrivateFile(event.target.files?.[0])} />

                    <p className="mt-4 text-sm font-bold leading-6 text-ink">Your photo will not leave this device. Only a code made from it is sent, never the photo itself.</p>
                    <ol className="mt-3.5 space-y-3">
                      {[
                        "Pick the photo someone is threatening to share.",
                        "This device turns it into a unique code — like a fingerprint for that photo. Nobody sees the photo, including us.",
                        "Register the code to open your case and get the steps that apply to you.",
                      ].map((step, index) => (
                        <li key={step} className="flex gap-3 text-sm leading-6 text-ink-soft">
                          <span className="mt-0.5 font-mono text-[11px] font-bold text-service">0{index + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-xs leading-5 text-ink-faint">You do not have to give your name to use this.</p>
                  </>
                )}

                {fingerprintState !== "idle" && (
                  <div>
                    {/* The photo is deliberately never rendered back to the screen. */}
                    <div className="flex items-center gap-3 rounded-[3px] border border-line bg-paper p-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] bg-service-soft text-service"><IconGuide size={18} aria-hidden="true" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{privateFile?.name}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">Kept on this device. Not shown, not uploaded.</p>
                      </div>
                      <button type="button" onClick={clearPrivateFile} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[3px] px-3 text-xs font-bold text-ink-soft hover:bg-surface hover:text-danger">
                        <X size={14} aria-hidden="true" /> Remove
                      </button>
                    </div>

                    {fingerprintState === "hashing" && (
                      <div className="mt-4 flex items-center gap-3 rounded-[3px] border border-service/30 bg-service-soft p-4">
                        <Loader2 size={18} className="shrink-0 animate-spin text-service" aria-hidden="true" />
                        <p className="text-sm font-semibold leading-6 text-ink">Making your code on this device…</p>
                      </div>
                    )}

                    {(fingerprintState === "ready" || fingerprintState === "registering") && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-success">
                          <Check size={18} aria-hidden="true" />
                          <p className="text-[15px] font-bold">Your photo is protected.</p>
                        </div>
                        <p className="mt-2.5 text-sm leading-6 text-ink-soft">
                          A code has been sent from this device, but not the photo itself. Your photo has not been shared and it stays on this device.
                        </p>
                        <p className="mt-2.5 text-sm leading-6 text-ink-soft">
                          Any copy of the same photo produces the same code, so a platform can find and block it without ever seeing it.
                        </p>
                        <div className="mt-4 flex items-stretch gap-2">
                          <code className="mono-ref min-w-0 flex-1 break-all rounded-[3px] border border-line bg-paper px-3 py-3 text-[11px] font-bold leading-5 text-service">{fingerprint}</code>
                          <button type="button" onClick={copyFingerprint} className="inline-flex min-h-11 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-[3px] border border-line bg-surface text-[10px] font-bold text-ink-soft hover:border-service hover:text-service">
                            {copied ? <Check size={15} aria-hidden="true" /> : null}
                            {copied ? "Copied" : "Copy code"}
                          </button>
                        </div>
                        <button type="button" onClick={registerFingerprint} disabled={fingerprintState === "registering"} className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[3px] bg-service px-4 text-base font-bold text-white hover:bg-[var(--saffron-deep)] disabled:cursor-not-allowed disabled:opacity-60">
                          {fingerprintState === "registering" ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : null}
                          {fingerprintState === "registering" ? "Opening your case..." : "Open my case"}
                          {fingerprintState !== "registering" && <ArrowRight size={16} aria-hidden="true" />}
                        </button>
                        <p className="mt-3.5 text-xs leading-5 text-ink-faint">
                          This opens a case with the steps that apply to you. To have images blocked across participating platforms, also create a case at StopNCII.org — it works the same way, and your images stay on your device there too.
                        </p>
                      </div>
                    )}

                    {fingerprintState === "error" && (
                      <button type="button" onClick={() => privateInputRef.current?.click()} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[3px] border border-line px-4 text-sm font-bold text-ink hover:border-service">
                        Try another photo
                      </button>
                    )}

                    {privateError && (
                      <div role="alert" className="mt-4 notice notice-danger p-4">
                        <p className="text-sm font-bold text-danger">There is a problem</p>
                        <p className="mt-1.5 text-sm leading-6 text-ink">{privateError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckPage() {
  return <Suspense fallback={<div className="min-h-[100dvh] bg-paper" />}><CheckForm /></Suspense>;
}
