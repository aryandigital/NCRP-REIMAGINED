"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import type { ExtractedFact } from "@/lib/store";

export default function FactReview({ incidentId, initialFacts }: { incidentId: string; initialFacts: ExtractedFact[] }) {
  const [facts, setFacts] = useState(initialFacts);
  const [saving, setSaving] = useState(false);

  async function confirmFacts() {
    setSaving(true);
    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedFacts: facts.map((fact) => ({ ...fact, confirmationStatus: "confirmed" })) }),
      });
      if (!response.ok) throw new Error("Unable to save facts");
      setFacts((current) => current.map((fact) => ({ ...fact, confirmationStatus: "confirmed" })));
    } finally {
      setSaving(false);
    }
  }

  if (facts.length === 0) return <p className="text-sm text-ink-soft">No structured facts were extracted. Continue with the available evidence and stay cautious.</p>;

  return <div><div className="space-y-3">{facts.map((fact) => <div key={fact.field} className="grid gap-3 border-b border-line pb-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><label htmlFor={`fact-${fact.field}`} className="text-xs font-bold uppercase tracking-[.1em] text-ink-faint">{fact.field}</label><input id={`fact-${fact.field}`} value={String(fact.value ?? "")} onChange={(event) => setFacts((current) => current.map((item) => item.field === fact.field ? { ...item, value: event.target.value, confirmationStatus: "corrected" } : item))} className="mt-2 min-h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-sm font-bold text-ink focus:border-service focus:bg-surface focus:outline-none" /><p className="mt-1 text-xs text-ink-soft">Source: {fact.source} · {Math.round(fact.confidence * 100)}% confidence</p></div><span className={`inline-flex min-h-8 items-center justify-center rounded-[6px] px-2 text-[10px] font-bold uppercase tracking-[.08em] ${fact.confirmationStatus === "confirmed" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{fact.confirmationStatus === "confirmed" ? "Confirmed" : fact.confirmationStatus === "corrected" ? "Edited" : "Needs review"}</span></div>)}</div><button type="button" onClick={confirmFacts} disabled={saving || facts.every((fact) => fact.confirmationStatus === "confirmed")} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-service px-4 text-sm font-bold text-white hover:bg-command disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />} {saving ? "Saving facts" : "Confirm edited facts"}</button></div>;
}
