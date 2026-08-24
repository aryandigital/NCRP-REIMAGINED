"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

export default function DownloadBundle({ incidentId }: { incidentId: string }) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const response = await fetch(`/api/incidents/${incidentId}?format=bundle`);
      if (!response.ok) throw new Error("Bundle unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `raksha-${incidentId.toLowerCase()}-redacted.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return <button type="button" onClick={download} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line-strong bg-surface px-4 text-sm font-bold text-ink hover:border-service hover:text-service disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{busy ? "Preparing bundle" : "Download redacted JSON"}</button>;
}
