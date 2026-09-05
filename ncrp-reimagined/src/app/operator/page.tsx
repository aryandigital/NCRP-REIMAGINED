import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { PATTERN_BY_SLUG } from "@/data/patterns";
import { getIncident, isIncidentId } from "@/lib/store";

export const dynamic = "force-dynamic";

const SYNTHETIC_CLUSTER = [
  ["SYN-UP-041", "Uttar Pradesh", "hotel-rating job offer", "WhatsApp"],
  ["SYN-UP-052", "Uttar Pradesh", "prepaid task deposit", "Telegram"],
  ["SYN-MH-018", "Maharashtra", "fake review agency", "Instagram"],
  ["SYN-KA-027", "Karnataka", "unlocking fee demand", "WhatsApp"],
];

export default async function OperatorPage({ searchParams }: { searchParams: Promise<{ caseId?: string | string[] }> }) {
  const { caseId = "DEMO0001" } = await searchParams;
  if (typeof caseId !== "string" || !isIncidentId(caseId)) notFound();
  const incident = await getIncident(caseId);
  if (!incident) notFound();
  const example = incident.id === "DEMO0001";
  const pattern = incident.dna?.patternSlug ? PATTERN_BY_SLUG.get(incident.dna.patternSlug) : null;
  const reviewed = incident.extractedFacts.filter((fact) => ["confirmed", "corrected"].includes(fact.confirmationStatus)).length;
  const unconfirmed = incident.extractedFacts.filter((fact) => fact.confirmationStatus === "unconfirmed").length;

  return <div className="min-h-[100dvh] bg-paper">
    <SiteHeader current="operator" />
    <main id="main-content" className="public-shell py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href={`/recover/${encodeURIComponent(incident.id)}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> {example ? "View read-only example recovery guidance" : "Back to this case's recovery guidance"}</Link>
        <header className="mt-7 border-b border-line pb-6">
          <p className="kicker">Operator view / read-only</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Review the local case record.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">This is not an institutional console. No complaint delivery, bank action, official acknowledgement or recovery is verified here.</p>
          <p className="mt-4 text-sm font-bold text-ink">Raksha case ID</p>
          <p className="mono-ref mt-2 select-all break-all text-xl font-bold text-ink">{incident.id}</p>
          {example && <p className="mt-4 text-sm font-bold text-service">Synthetic read-only example: DEMO0001. Not a live case or linked crime database.</p>}
          {!example && incident.syntheticOnly && <p className="mt-4 text-sm font-bold text-service">Synthetic example copy. This view is read-only.</p>}
        </header>

        <section className="panel mt-7 p-5" aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="text-xl font-bold text-ink">Fact review, not filing readiness</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{reviewed} confirmed or corrected entries; {unconfirmed} unconfirmed entries; {incident.missingFacts.length} open questions. Counts do not establish completeness, eligibility or official verification.</p>
          {incident.extractedFacts.length ? <dl className="mt-4 divide-y divide-line">
            {incident.extractedFacts.map((fact, index) => <div key={`${fact.field}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
              <dt className="break-words text-sm font-bold text-ink">{fact.field}</dt>
              <dd className="min-w-0 break-words text-sm text-ink-soft">
                <p>{fact.value === null ? "Not recorded" : String(fact.value)}</p>
                <p className="mt-1 text-xs">Source: {fact.source}. Review state: {fact.confirmationStatus}.</p>
              </dd>
            </div>)}
          </dl> : <p className="mt-4 text-sm text-ink-soft">No extracted facts recorded.</p>}
          <h3 className="mt-5 text-base font-bold text-ink">Open questions</h3>
          {incident.missingFacts.length ? <ul className="mt-2 list-inside list-disc text-sm leading-7 text-ink-soft">{incident.missingFacts.map((fact, index) => <li key={index}>{fact}</li>)}</ul> : <p className="mt-2 text-sm text-ink-soft">No open questions listed. This does not certify filing readiness.</p>}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="panel p-5">
            <h2 className="text-xl font-bold text-ink">Local packets</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">Prepared locally. Not sent. This applies to older records too, regardless of their stored status labels.</p>
            {incident.packets.length ? <ul className="mt-4 divide-y divide-line">{incident.packets.map((packet, index) => <li key={index} className="py-3 text-sm text-ink-soft"><span className="font-bold uppercase text-ink">{packet.recipient}</span> packet: Prepared locally. Not sent.</li>)}</ul> : <p className="mt-4 text-sm text-ink-soft">No packets prepared.</p>}
          </section>
          <section className="panel p-5">
            <h2 className="text-xl font-bold text-ink">Local event entries</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">These entries do not establish routing, delivery or an official response.</p>
            {incident.routingEvents.length ? <ol className="mt-4 divide-y divide-line">{incident.routingEvents.map((event, index) => {
              const at = new Date(event.occurredAt);
              return <li key={index} className="py-3 text-sm text-ink-soft"><p className="font-bold text-ink">Prepared locally. Not sent.</p><p className="mt-1 break-words">Local entry timestamp: {Number.isFinite(at.getTime()) ? at.toISOString() : "Not recorded"}</p></li>;
            })}</ol> : <p className="mt-4 text-sm text-ink-soft">No local preparation events recorded.</p>}
          </section>
        </div>

        {pattern && <section className="panel mt-6 p-5">
          <h2 className="text-xl font-bold text-ink">Advisory pattern context</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{pattern.name}. A pattern resemblance is not proof of a shared perpetrator or a database match.</p>
          <Link href={`/atlas/${encodeURIComponent(pattern.slug)}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-service">Read pattern guidance</Link>
        </section>}
        {example && <section className="panel mt-6 p-5">
          <h2 className="text-xl font-bold text-ink">Synthetic cluster illustration</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Fictional examples only. These are not verified links to this record or results from a crime database.</p>
          <ul className="mt-4 divide-y divide-line">{SYNTHETIC_CLUSTER.map(([id, region, description, channel]) => <li key={id} className="py-3 text-sm leading-6 text-ink-soft"><span className="mono-ref font-bold text-ink">{id}</span>: {region}, {description}, {channel}</li>)}</ul>
        </section>}
      </div>
    </main>
  </div>;
}
