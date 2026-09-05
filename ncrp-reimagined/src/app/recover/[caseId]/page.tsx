import Link from "next/link";
import { ArrowLeft, ArrowRight, FileDown } from "lucide-react";
import { getIncident, isIncidentId } from "@/lib/store";
import { CLOCKS, type ClockKind } from "@/lib/clocks";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import DownloadBundle from "@/components/DownloadBundle";
import DemoCopyButton from "@/components/DemoCopyButton";

export const dynamic = "force-dynamic";

function timestamp(value: string | null) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime())
    ? date.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }) + " IST"
    : "Not recorded";
}

export default async function RecoverPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  if (!isIncidentId(caseId)) notFound();
  const incident = await getIncident(caseId);
  if (!incident) notFound();
  const id = encodeURIComponent(incident.id);
  const example = incident.id === "DEMO0001";
  const guidance: ClockKind[] = [];
  if (incident.tracks.includes("money")) guidance.push("RBI_ZERO_LIABILITY", "BANK_SHADOW_REVERSAL", "BANKING_OMBUDSMAN", "MRM_APPLICATION");
  if (incident.tracks.includes("content")) guidance.push("PLATFORM_TAKEDOWN", "PLATFORM_GRIEVANCE_ACK", "PLATFORM_GRIEVANCE_RESOLUTION", "GAC_APPEAL");

  return <div className="min-h-[100dvh] bg-paper">
    <SiteHeader current="track" />
    <main id="main-content" className="public-shell py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href={`/act/${id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
          <ArrowLeft size={16} aria-hidden="true" /> {example ? "View read-only example action board" : "Back to action board"}
        </Link>
        <header className="mt-7 border-b border-line pb-6">
          <p className="kicker">Recovery guidance</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">{incident.dna?.patternName ?? "Cyber fraud incident"}</h1>
          <div className="panel mt-5 border-service/30 p-5">
            <p className="text-sm font-bold text-ink">Raksha case ID</p>
            <p className="mono-ref mt-2 select-all break-all text-xl font-bold text-ink">{incident.id}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">Keep this ID to reopen your record. It is not an official complaint acknowledgement.</p>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-bold text-ink">Record created</dt><dd className="mt-1 text-ink-soft">{timestamp(incident.createdAt)}</dd></div>
            <div><dt className="font-bold text-ink">Transaction timestamp (user-provided)</dt><dd className="mt-1 text-ink-soft">{timestamp(incident.occurredAt)}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-ink-soft">Neither timestamp establishes when a bank, platform or authority received a complaint.</p>
          {example ? <DemoCopyButton nextPage="act" /> : incident.syntheticOnly && <p className="mt-4 text-sm font-bold text-service">Synthetic example copy. Use fictional details only.</p>}
        </header>

        <section className="panel mt-7 border-danger/30 bg-danger-soft p-5">
          <p className="kicker text-danger">Recovery scam warning</p>
          <h2 className="mt-2 text-lg font-bold text-ink">Do not pay someone who promises to recover your money.</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Verify contacts through official channels. Never share an OTP, PIN or password, or transfer money to someone claiming it is needed to release your funds.</p>
        </section>

        <section className="mt-8" aria-labelledby="guidance-heading">
          <h2 id="guidance-heading" className="text-xl font-bold text-ink">Conditional next steps, not legal countdowns</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">No legal deadline is calculated here. Required trigger events are not yet recorded. Creating a record or preparing a packet does not start a statutory clock. Eligibility and current rules need checking; recovery, zero liability, reversal and takedown are not guaranteed.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {guidance.map((kind) => {
              const definition = CLOCKS[kind];
              return <article key={kind} className="panel-tight border border-line p-5">
                <h3 className="text-base font-bold text-ink">{definition.label}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{definition.why}</p>
                {/* No verified legal trigger fields exist in the current incident schema. */}
                <p className="mt-4 text-xs font-bold text-warning">Required trigger event: not yet recorded</p>
                <p className="mt-1 text-xs leading-5 text-ink-soft">{definition.triggerEvent}.</p>
                <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-ink-soft">{definition.basis}</p>
                <a href={definition.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-service">Check official source (opens new tab)</a>
              </article>;
            })}
          </div>
          {guidance.length === 0 && <p className="panel mt-4 p-5 text-sm leading-6 text-ink-soft">No money or content track is recorded. Review the action board for guidance appropriate to your situation; no legal trigger dates are inferred.</p>}
        </section>

        <section className="panel mt-8 p-5 sm:p-6" aria-labelledby="packets-heading">
          <h2 id="packets-heading" className="text-xl font-bold text-ink">Local preparation</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">All packets and event entries below are prepared locally, not sent to any bank, platform, police or authority. Older record labels do not establish submission, delivery or acknowledgement.</p>
          <p className="mt-3 text-sm text-ink-soft">{incident.missingFacts.length} facts still open. This is not a measure of eligibility or readiness to file.</p>
          {incident.packets.length ? <ul className="mt-4 divide-y divide-line">
            {incident.packets.map((packet, index) => <li key={`${packet.recipient}-${index}`} className="py-3 text-sm">
              <span className="font-bold uppercase text-ink">{packet.recipient}</span> <span className="text-ink-soft">packet: Prepared locally. Not sent.</span>
            </li>)}
          </ul> : <p className="mt-4 text-sm text-ink-soft">No packets have been prepared.</p>}
          <h3 className="mt-6 text-base font-bold text-ink">Local event history</h3>
          {incident.routingEvents.length ? <ol className="mt-3 divide-y divide-line">
            {incident.routingEvents.map((event, index) => <li key={index} className="py-3 text-sm leading-6 text-ink-soft">
              <p className="font-bold text-ink">Prepared locally. Not sent.</p>
              <p>Local entry timestamp: {timestamp(event.occurredAt)}</p>
            </li>)}
          </ol> : <p className="mt-3 text-sm text-ink-soft">No local preparation events recorded. No official submission is confirmed.</p>}
          <Link href={`/report/${id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service">
            {example ? "View read-only example report" : "Review local report preparation"} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>

        <section className="panel mt-6 p-5 sm:p-6" aria-label="Case export and review">
          <DownloadBundle incidentId={incident.id} />
          <a
            href={`/api/incidents/${incident.id}/document`}
            download={`complaint-draft-${incident.id.toLowerCase()}.pdf`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service"
          >
            <FileDown size={16} aria-hidden="true" /> Complaint draft (PDF) — prototype document, no legal standing
          </a>
          <Link href={`/operator?caseId=${id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service">
            {example ? "View read-only synthetic operator example" : "View this case in read-only operator view"} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  </div>;
}
