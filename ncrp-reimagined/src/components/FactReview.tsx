"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import type { ExtractedFact } from "@/lib/store";
import DemoCopyButton from "@/components/DemoCopyButton";

export default function FactReview({ incidentId, initialFacts }: { incidentId: string; initialFacts: ExtractedFact[] }) {
  const router = useRouter();
  const [facts, setFacts] = useState(initialFacts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function confirmFacts() {
    if (saving || incidentId === "DEMO0001") return;
    setSaving(true);
    setError("");
    setSaved(false);
    const reviewed = facts.map((fact): ExtractedFact => {
      const missing = fact.value === null || /^(?:\s*|not provided|not stated|unknown|not sure|n\/a)$/i.test(String(fact.value).trim());
      return { ...fact, value: missing ? null : fact.value, confirmationStatus: missing ? "missing" : "confirmed" };
    });
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(incidentId)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedFacts: reviewed }),
      });
      if (!response.ok) throw new Error("Unable to save facts");
      setFacts(reviewed);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Facts could not be saved. Your edits are still here; please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (incidentId === "DEMO0001") return <DemoCopyButton nextPage="check" />;
  if (!facts.length) return <p className="text-sm text-ink-soft">No structured facts were extracted. This does not establish safety or rule out loss. Continue with the evidence you have.</p>;

  return <div>
    <p className="mb-4 text-sm text-ink-soft">Review every value before confirming. Leave unknown details blank; they will remain missing, not confirmed.</p>
    <fieldset disabled={saving} className="space-y-3">{facts.map((fact, index) => <div key={`${fact.field}-${index}`} className="grid gap-3 border-b border-line pb-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div><label htmlFor={`fact-${index}`} className="text-xs font-bold uppercase tracking-[.1em] text-ink-faint">{fact.field}</label>
        <input id={`fact-${index}`} value={String(fact.value ?? "")} onChange={(event) => {
          setSaved(false);
          setFacts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value, source: "user", confidence: 1, confirmationStatus: "corrected" } : item));
        }} className="mt-2 min-h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-sm font-bold text-ink focus:border-service focus:outline-none" />
        <p className="mt-1 text-xs text-ink-soft">Source: {fact.source} / {Math.round(fact.confidence * 100)}% extraction confidence, not proof</p>
      </div>
      <span className="text-xs font-bold text-ink-soft">{fact.confirmationStatus === "confirmed" ? "Confirmed" : fact.confirmationStatus === "missing" ? "Missing" : fact.confirmationStatus === "corrected" ? "Edited, not saved" : "Needs review"}</span>
    </div>)}</fieldset>
    {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
    {saved && <p role="status" className="mt-4 text-sm text-success">Review saved. Unknown details remain missing.</p>}
    <button type="button" onClick={confirmFacts} disabled={saving || saved} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-service px-4 text-sm font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}{saving ? "Saving facts" : "Confirm reviewed facts"}</button>
  </div>;
}
