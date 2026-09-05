"use client";

import { useState } from "react";

export default function CopyBrief({ text, incidentId }: { text: string; incidentId: string }) {
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setMessage("Brief copied. Review personal details before sharing.");
    } catch {
      setFailed(true);
      setMessage("Clipboard unavailable. Select the brief below to copy it, or download it.");
    }
  }

  function download() {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `raksha-${incidentId}-brief.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setFailed(false);
      setMessage("Brief download requested. This file may contain personal details.");
    } catch {
      setFailed(true);
      setMessage("Download unavailable. Select the brief below to copy it.");
    }
  }

  return <div className="mt-3">
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copy} className="min-h-11 rounded-[10px] border border-line px-4 text-sm font-bold text-ink">Copy brief</button>
      <button type="button" onClick={download} className="min-h-11 rounded-[10px] border border-line px-4 text-sm font-bold text-ink">Download brief (.txt)</button>
    </div>
    {message && <p role="status" className="mt-2 text-sm text-ink-soft">{message}</p>}
    {failed && <label className="mt-3 block text-sm text-ink">Select brief to copy<textarea readOnly value={text} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-48 w-full rounded-[8px] border border-line bg-paper p-3 text-ink" /></label>}
  </div>;
}
