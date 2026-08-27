"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type { Incident } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ReportForm({ incident }: { incident: Incident }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [description, setDescription] = useState(incident.rawText ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    // Validate required fields
    const missing: string[] = [];
    if (!description.trim()) missing.push("incident description");
    if (!amount.trim()) missing.push("financial amount (enter 0 if no money was lost)");
    if (!bank.trim()) missing.push("bank or wallet name");

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const carriedFacts = incident.extractedFacts.filter((fact) => fact.field !== "Financial amount" && fact.field !== "Bank or wallet");
      const response = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitMock: true,
          rawText: description.trim(),
          extractedFacts: [
            ...carriedFacts,
            { field: "Financial amount", value: amount.trim(), source: "user", confidence: 1, confirmationStatus: "confirmed" },
            { field: "Bank or wallet", value: bank.trim(), source: "user", confidence: 1, confirmationStatus: "confirmed" },
          ],
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      router.push(`/recover/${incident.id}`);
    } catch {
      setError("The response packets could not be created. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel mt-6 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">
            Financial amount <span className="text-danger">*</span>
          </span>
          <input
            value={amount}
            onChange={(event) => { setAmount(event.target.value); setError(""); }}
            placeholder="Example: 24999 (enter 0 if none)"
            required
            className="mt-2 min-h-12 w-full rounded-[4px] border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus:border-[var(--navy)] focus:bg-surface focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">
            Bank or wallet <span className="text-danger">*</span>
          </span>
          <input
            value={bank}
            onChange={(event) => { setBank(event.target.value); setError(""); }}
            placeholder="Example: SBI, PhonePe, GPay"
            required
            className="mt-2 min-h-12 w-full rounded-[4px] border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus:border-[var(--navy)] focus:bg-surface focus:outline-none"
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="block text-xs font-bold uppercase tracking-[.1em] text-ink-faint">
          Incident description <span className="text-danger">*</span>
        </span>
        <textarea
          value={description}
          onChange={(event) => { setDescription(event.target.value); setError(""); }}
          required
          className="mt-2 min-h-[140px] w-full rounded-[4px] border border-line bg-paper px-3 py-3 text-sm leading-6 text-ink focus:border-[var(--navy)] focus:bg-surface focus:outline-none"
        />
      </label>
      {error && (
        <p role="alert" className="mt-4 rounded-[4px] border border-danger/35 bg-danger-soft p-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-service px-5 text-sm font-bold text-white hover:bg-[var(--saffron-deep)] disabled:opacity-60"
      >
        {submitting ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        {submitting ? "Preparing response packets" : "Prepare response packets"}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-ink-faint">
        This prepares recipient-specific records. Nothing is transmitted to an institution from this environment.
      </p>
    </form>
  );
}
