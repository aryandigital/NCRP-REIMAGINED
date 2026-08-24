"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";

export default function ActionChecklist({ incidentId, items, initialCompleted = [] }: { incidentId: string; items: string[]; initialCompleted?: string[] }) {
  const [completed, setCompleted] = useState<string[]>(initialCompleted);

  async function toggle(item: string) {
    const next = completed.includes(item) ? completed.filter((value) => value !== item) : [...completed, item];
    setCompleted(next);
    await fetch(`/api/incidents/${incidentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completedActions: next }) });
  }

  return <div className="grid gap-2 sm:grid-cols-2">{items.map((item) => { const done = completed.includes(item); return <button type="button" key={item} onClick={() => toggle(item)} className={`flex min-h-12 items-center gap-3 rounded-[8px] border px-3 text-left text-xs font-semibold ${done ? "border-success/30 bg-success-soft text-success" : "border-line bg-paper text-ink-soft hover:border-service hover:text-ink"}`}>{done ? <Check size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}{item}</button>; })}</div>;
}
