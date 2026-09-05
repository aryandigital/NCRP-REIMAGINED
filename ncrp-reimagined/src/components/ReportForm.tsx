"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type { ExtractedFact, Incident } from "@/lib/store";
import { useRouter } from "next/navigation";
import DemoCopyButton from "@/components/DemoCopyButton";

const fieldKey = (field: string) => {
  const key = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/[_-]/g, " ").trim().replace(/\s+/g, " ");
  if (["bank", "bank or wallet", "bank or payment app"].includes(key)) return "bank or wallet";
  if (["amount", "amount inr", "transaction amount", "financial amount"].includes(key)) return "financial amount";
  return key;
};
const provided = (value: ExtractedFact["value"] | undefined) => value !== null && value !== undefined && !/^(?:\s*|not provided|not stated|not given|unknown|not sure|n\/a|\[CREDENTIAL\])$/i.test(String(value).trim());

export default function ReportForm({ incident }: { incident: Incident }) {
  const router = useRouter();
  // Older Shield records used lower-case field names. Keep a single canonical fact.
  const amountFact = incident.extractedFacts.find((fact) => fieldKey(fact.field) === "financial amount");
  const bankFact = incident.extractedFacts.find((fact) => fieldKey(fact.field) === "bank or wallet");
  const [amount, setAmount] = useState(String((provided(amountFact?.value) ? amountFact?.value : incident.shield?.answers?.amountInr) ?? ""));
  const [bank, setBank] = useState(String((provided(bankFact?.value) ? bankFact?.value : incident.shield?.answers?.bankOrWallet) ?? ""));
  const [description, setDescription] = useState(incident.rawText ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || incident.id === "DEMO0001") return;
    setError("");
    const normalizedAmount = amount.replace(/[,\s₹]/g, "");
    if (provided(amount) && (!/^\d+(?:\.\d{1,2})?$/.test(normalizedAmount) || !Number.isFinite(Number(normalizedAmount)))) {
      setError("Enter a non-negative INR amount with up to two decimal places, or leave it blank if unknown.");
      return;
    }
    setSubmitting(true);
    try {
      const carriedFacts = incident.extractedFacts.filter((fact) => !["financial amount", "bank or wallet"].includes(fieldKey(fact.field)));
      const financialFacts: ExtractedFact[] = [
        { field: "Financial amount", value: provided(amount) ? Number(normalizedAmount) : null, source: "user", confidence: provided(amount) ? 1 : 0, confirmationStatus: provided(amount) ? "confirmed" : "missing" },
        { field: "Bank or wallet", value: provided(bank) ? bank.trim() : null, source: "user", confidence: provided(bank) ? 1 : 0, confirmationStatus: provided(bank) ? "confirmed" : "missing" },
      ];
      const response = await fetch(`/api/incidents/${encodeURIComponent(incident.id)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submitMock: true, rawText: description, extractedFacts: [...carriedFacts, ...financialFacts] }),
      });
      if (!response.ok) throw new Error("Preparation failed");
      const result = await response.json();
      if (result.status !== "prepared_locally" || result.sent !== false || result.incident?.id !== incident.id) throw new Error("Preparation not confirmed");
      router.push(`/recover/${encodeURIComponent(incident.id)}`);
      router.refresh();
    } catch {
      setError("The local packets could not be prepared. Your edits are still here. Try again; nothing was sent to an institution.");
      setSubmitting(false);
    }
  }

  if (incident.id === "DEMO0001") return <DemoCopyButton nextPage="report" />;

  return <form onSubmit={submit} className="panel mt-6 p-5 sm:p-6">
    {incident.syntheticOnly && <p className="mb-4 text-sm text-warning">You are editing a synthetic example. Use fictional details only; edits retain the original simulation provenance and do not turn this into a verified real incident.</p>}
    <fieldset disabled={submitting}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">Financial amount (INR)</span><input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Leave blank if unknown" className="mt-2 min-h-12 w-full rounded-[8px] border border-line bg-paper px-3 text-sm text-ink focus:border-service focus:outline-none" /></label>
        <label className="block"><span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">Bank or wallet</span><input value={bank} onChange={(event) => setBank(event.target.value)} placeholder="Leave blank if unknown" className="mt-2 min-h-12 w-full rounded-[8px] border border-line bg-paper px-3 text-sm text-ink focus:border-service focus:outline-none" /></label>
      </div>
      <label className="mt-5 block"><span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">Incident description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-[140px] w-full rounded-[8px] border border-line bg-paper px-3 py-3 text-sm leading-6 text-ink focus:border-service focus:outline-none" /></label>
    </fieldset>
    <p className="mt-3 text-xs leading-5 text-ink-soft">Check the amount and bank before preparing. Filled fields are confirmed by you; blank or unknown fields stay missing. Other facts retain their review status.</p>
    {error && <p role="alert" className="mt-4 rounded-[8px] border border-danger/35 bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}
    <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white disabled:opacity-60">{submitting ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{submitting ? "Preparing local packets" : "Prepare SIMULATED packets"}</button>
    <p className="mt-3 text-center text-xs leading-5 text-ink-soft">Prepared locally, not sent. This does not file a complaint or create an official acknowledgement.</p>
  </form>;
}
