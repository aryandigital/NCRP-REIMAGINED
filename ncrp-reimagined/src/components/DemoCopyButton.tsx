"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoCopyButton({ nextPage }: { nextPage: "check" | "act" | "report" }) {
  const router = useRouter();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createCopy() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo", { method: "POST" });
      if (!response.ok) throw new Error("Copy unavailable");
      const result = await response.json();
      if (typeof result.id !== "string" || !/^INC[A-F0-9]{32}$/.test(result.id) || result.syntheticOnly !== true) throw new Error("Invalid copy response");
      router.push(`/${nextPage}/${result.id}`);
      router.refresh();
    } catch {
      pending.current = false;
      setBusy(false);
      setError("The example copy could not be opened. Please try again; the public example has not changed.");
    }
  }

  return <div className="mt-5 rounded-[10px] border border-line p-4">
    <p className="text-sm leading-6 text-ink-soft">This public example is read-only. Create a separate synthetic copy before reviewing facts, saving actions or preparing local packets. Use synthetic details only.</p>
    <button type="button" onClick={createCopy} disabled={busy} className="mt-3 inline-flex min-h-11 items-center rounded-[8px] bg-service px-4 text-sm font-bold text-white disabled:opacity-60">{busy ? "Creating example copy..." : "Create my example copy"}</button>
    {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
  </div>;
}
