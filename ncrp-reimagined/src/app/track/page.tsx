"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import DemoCopyButton from "@/components/DemoCopyButton";

export default function TrackPage() {
  const router = useRouter();
  const pending = useRef(false);
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const value = new FormData(event.currentTarget).get("caseId");
    const id = typeof value === "string" ? value.trim().toUpperCase() : "";
    setCaseId(id);
    setError("");
    // Match the store's current IDs and persisted ten-hex-digit IDs, not acknowledgement numbers.
    if (!/^(?:INC(?:[A-F0-9]{10}|[A-F0-9]{32})|DEMO0001)$/.test(id)) {
      setError("Enter the complete Raksha case ID from your record, starting with INC, or DEMO0001 for the read-only example.");
      return;
    }
    pending.current = true;
    setLoading(true);
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(id)}`, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(10000) });
      if (response.status === 404) {
        setError("No saved case was found for that Raksha case ID. Check the ID and try again.");
        pending.current = false;
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error("Lookup unavailable");
      const result = await response.json();
      if (result?.incident?.id !== id) throw new Error("Case mismatch");
      router.push(`/recover/${encodeURIComponent(id)}`);
    } catch {
      setError("Your case could not be opened right now. Please try again. No changes were made to your record.");
      pending.current = false;
      setLoading(false);
    }
  }

  return <div className="min-h-[100dvh] bg-paper">
    <SiteHeader current="track" />
    <main id="main-content" className="public-shell py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to response desk</Link>
        <div className="mt-8">
          <p className="kicker">Case tracking</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Find your recovery plan.</h1>
          <p className="mt-4 text-base leading-7 text-ink-soft">Enter the Raksha case ID shown on your record. This opens local preparation and guidance, not an official complaint status.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="panel mt-7 p-5 sm:p-6">
          <label htmlFor="caseId" className="block text-sm font-bold text-ink">Raksha case ID</label>
          <p id="caseId-help" className="mt-2 text-xs leading-5 text-ink-soft">Use the complete ID starting with INC. Official acknowledgement numbers and simulated references cannot be used here.</p>
          <div className="relative mt-3">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input id="caseId" name="caseId" value={caseId} onChange={(event) => { setCaseId(event.target.value); setError(""); }} disabled={loading} required maxLength={64} autoCapitalize="characters" autoComplete="off" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={error ? "caseId-help caseId-error" : "caseId-help"} placeholder="Example: DEMO0001" className="min-h-12 w-full rounded-[8px] border border-line bg-paper pl-10 pr-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" />
          </div>
          {error && <p id="caseId-error" role="alert" className="mt-3 text-sm leading-6 text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white hover:bg-command disabled:opacity-60">{loading ? "Checking case..." : "Open case"} <ArrowRight size={17} aria-hidden="true" /></button>
          <p role="status" className="mt-2 text-sm text-ink-soft">{loading ? "Checking your Raksha case ID before opening the record." : ""}</p>
        </form>
        <section className="panel mt-4 border-service/30 bg-service-soft p-5">
          <h2 className="text-sm font-bold text-ink">Explore a synthetic example</h2>
          <p className="mt-2 text-xs leading-5 text-ink-soft">DEMO0001 is a shared, read-only example. Its packets are local drafts, not official submissions.</p>
          <Link href="/recover/DEMO0001" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service">View read-only example <ArrowRight size={16} aria-hidden="true" /></Link>
          <DemoCopyButton nextPage="act" />
        </section>
      </div>
    </main>
  </div>;
}
