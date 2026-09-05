"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoStartButton({ className = "btn-daylight" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demo", { method: "POST" });
      if (!response.ok) throw new Error("Demo unavailable");
      const data = await response.json();
      const id = data.incident?.id;
      if (typeof id !== "string" || !/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("Missing demo case");
      router.push(`/act/${encodeURIComponent(id)}`);
    } catch {
      setError("The sample is unavailable right now. Try again, or open Call Shield to start your own check.");
      setBusy(false);
    }
  }

  return <div>
    <button type="button" onClick={start} disabled={busy} className={`${className} disabled:opacity-60`}>{busy ? "Preparing sample..." : "Try an isolated sample"}</button>
    {error && <p role="alert" className="mt-3 max-w-sm text-sm text-ink">{error}</p>}
  </div>;
}
