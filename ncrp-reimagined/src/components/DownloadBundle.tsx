"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

export default function DownloadBundle({ incidentId }: { incidentId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function download() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(incidentId)}?format=bundle`, { cache: "no-store" });
      if (!response.ok) throw new Error("Bundle unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `raksha-${incidentId.toLowerCase()}-personal-details.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Download requested. Review the file for personal details before sharing. Packets are SIMULATED, not sent.");
    } catch {
      setFailed(true);
      setMessage("The bundle could not be downloaded. Your case has not changed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div>
    <p className="mb-3 text-xs leading-5 text-ink-soft">This JSON bundle contains personal details, including saved answers, narrative and any incident brief. Credentials are filtered, but the file is not anonymised. Review it before sharing and store it securely. Packets are prepared locally, not sent.</p>
    <button type="button" onClick={download} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line-strong bg-surface px-4 text-sm font-bold text-ink hover:border-service hover:text-service disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{busy ? "Preparing bundle" : "Download personal-details JSON bundle"}</button>
    {message && <p role={failed ? "alert" : "status"} className="mt-3 text-sm text-ink-soft">{message}</p>}
  </div>;
}
