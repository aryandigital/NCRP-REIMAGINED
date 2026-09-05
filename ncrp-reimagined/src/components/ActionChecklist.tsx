"use client";

import { useRef, useState } from "react";
import { Check, Circle } from "lucide-react";
import DemoCopyButton from "@/components/DemoCopyButton";

export default function ActionChecklist({ incidentId, items, initialCompleted = [] }: { incidentId: string; items: string[]; initialCompleted?: string[] }) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);

  async function toggle(item: string) {
    if (pending.current || incidentId === "DEMO0001") return;
    pending.current = true;
    setSaving(true);
    setError("");
    const next = completed.includes(item) ? completed.filter((value) => value !== item) : [...completed, item];
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(incidentId)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completedActions: next }) });
      if (!response.ok) throw new Error("Save failed");
      setCompleted(next);
    } catch {
      setError("That checklist change was not saved. Please try it again.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  if (incidentId === "DEMO0001") return <DemoCopyButton nextPage="act" />;

  return <div aria-busy={saving}>
    <div className="grid gap-2 sm:grid-cols-2">{items.map((item) => {
      const done = completed.includes(item);
      return <button type="button" key={item} aria-pressed={done} disabled={saving} onClick={() => toggle(item)} className={`flex min-h-12 items-center gap-3 rounded-[8px] border px-3 text-left text-xs font-semibold disabled:opacity-60 ${done ? "border-success/30 bg-success-soft text-success" : "border-line bg-paper text-ink-soft hover:border-service hover:text-ink"}`}>{done ? <Check size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}{item}</button>;
    })}</div>
    {saving && <p role="status" className="mt-3 text-xs text-ink-soft">Saving checklist...</p>}
    {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
  </div>;
}
