import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleAlert, FileText, Network, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { PATTERN_BY_SLUG } from "@/data/patterns";
import { getAllIncidents, getIncident, type Incident } from "@/lib/store";

export const dynamic = "force-dynamic";

const SYNTHETIC_CLUSTER = [
  ["SYN-UP-041", "Uttar Pradesh", "hotel-rating job offer", "WhatsApp"],
  ["SYN-UP-052", "Uttar Pradesh", "prepaid task deposit", "Telegram"],
  ["SYN-MH-018", "Maharashtra", "fake review agency", "Instagram"],
  ["SYN-KA-027", "Karnataka", "unlocking fee demand", "WhatsApp"],
];

const RISK_BADGE: Record<string, string> = {
  high: "bg-[#ffeaea] text-[#ba1a1a]",
  medium: "bg-[#fff3e0] text-[#b36200]",
  unclear: "bg-[#f5f5f5] text-[#555]",
};

function RiskBadge({ risk }: { risk: string | undefined }) {
  const label = risk ?? "unknown";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[.08em] ${RISK_BADGE[label] ?? RISK_BADGE.unclear}`}>
      {label}
    </span>
  );
}

async function IncidentDetail({ incidentId }: { incidentId: string }) {
  const incident = await getIncident(incidentId);

  if (!incident) {
    return (
      <div className="mx-auto max-w-6xl">
        <Link href="/operator" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
          <ArrowLeft size={16} aria-hidden="true" /> Back to incident list
        </Link>
        <div className="mt-8 panel p-8 text-center">
          <p className="text-base font-bold text-ink">Incident not found</p>
          <p className="mt-2 text-sm text-ink-soft">The case ID <code className="font-mono">{incidentId}</code> does not exist in this environment.</p>
        </div>
      </div>
    );
  }

  const pattern = incident.dna?.patternSlug ? PATTERN_BY_SLUG.get(incident.dna.patternSlug) : null;
  const confirmed = incident.extractedFacts.filter((f) => f.confirmationStatus === "confirmed").length;
  const total = confirmed + incident.missingFacts.length;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/operator" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
        <ArrowLeft size={16} aria-hidden="true" /> Back to incident list
      </Link>

      <div className="mt-7 flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Operator console / case record</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Incident graph</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">Provenance, missing fields, packet minimisation, routing events, and linked cluster.</p>
        </div>
        <span className="mono-ref text-xs font-bold text-ink-faint">{incident.ackNumber ?? incident.id}</span>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <section className="panel p-5"><p className="kicker">Readiness</p><p className="mt-3 text-3xl font-bold text-ink">{confirmed}/{total || 1}</p><p className="mt-1 text-xs text-ink-soft">confirmed facts</p></section>
        <section className="panel p-5"><p className="kicker">Packets</p><p className="mt-3 text-3xl font-bold text-ink">{incident.packets.length}</p><p className="mt-1 text-xs text-ink-soft">recipient-specific</p></section>
        <section className="panel p-5"><p className="kicker">Events</p><p className="mt-3 text-3xl font-bold text-ink">{incident.routingEvents.length}</p><p className="mt-1 text-xs text-ink-soft">routing events</p></section>
        <section className="panel p-5"><p className="kicker">Cluster</p><p className="mt-3 text-3xl font-bold text-ink">{SYNTHETIC_CLUSTER.length}</p><p className="mt-1 text-xs text-ink-soft">linked neighbours</p></section>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="panel min-w-0 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Network size={20} className="text-service" aria-hidden="true" />
            <div><p className="kicker">Normalized incident graph</p><h2 className="mt-2 text-lg font-bold text-ink">Facts with provenance</h2></div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead><tr className="border-b border-line text-xs uppercase tracking-[.1em] text-ink-faint"><th className="pb-3 pr-3">Field</th><th className="pb-3 pr-3">Value</th><th className="pb-3 pr-3">Source</th><th className="pb-3">State</th></tr></thead>
              <tbody>
                {incident.extractedFacts.length > 0
                  ? incident.extractedFacts.map((fact) => (
                    <tr key={fact.field} className="border-b border-line last:border-0">
                      <td className="py-3 pr-3 font-semibold text-ink">{fact.field}</td>
                      <td className="py-3 pr-3 text-ink-soft">{String(fact.value ?? "Not found")}</td>
                      <td className="py-3 pr-3 text-xs text-ink-faint">{fact.source} / {Math.round(fact.confidence * 100)}%</td>
                      <td className="py-3 text-xs font-bold text-success">{fact.confirmationStatus}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={4} className="py-4 text-sm text-ink-faint">No facts extracted yet.</td></tr>
                }
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-[8px] bg-warning-soft p-4">
            <p className="text-xs font-bold text-warning">Open fields</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{incident.missingFacts.length ? incident.missingFacts.join(" · ") : "No missing fields after packet preparation."}</p>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-service" aria-hidden="true" />
            <div><p className="kicker">Data minimisation</p><h2 className="mt-2 text-lg font-bold text-ink">What each recipient receives</h2></div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { label: "Helpline 1930 (simulated)", body: "Incident summary, indicators, and evidence index." },
              { label: "Bank nodal desk", body: "Amount, transaction time, beneficiary, and freeze request." },
              { label: "Police queue", body: "Chronology, narrative, and evidence manifest." },
            ].map((item) => (
              <div key={item.label} className="border-b border-line pb-3 last:border-0">
                <p className="text-sm font-bold text-ink">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3 rounded-[8px] bg-success-soft p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            <p className="text-xs leading-5 text-ink-soft">Only sample data is routed in this environment. No external institution is contacted.</p>
          </div>
        </section>
      </div>

      <section className="panel mt-6 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <CircleAlert size={20} className="text-warning" aria-hidden="true" />
          <div>
            <p className="kicker text-warning">Explainable pattern cluster</p>
            <h2 className="mt-2 text-lg font-bold text-ink">{pattern?.name ?? incident.dna?.patternName ?? "Unmatched pattern"}</h2>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft">The pattern match is based on behavioural signals, not identity. These neighbours share the same sequence and channel pattern; they are anonymised examples, not real complaints.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {SYNTHETIC_CLUSTER.map(([id, state, signal, channel]) => (
            <div key={id} className="panel-tight bg-paper p-4">
              <p className="mono-ref text-xs font-bold text-service">{id}</p>
              <p className="mt-3 text-sm font-bold text-ink">{state}</p>
              <p className="mt-1 text-xs leading-5 text-ink-soft">{signal}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[.1em] text-ink-faint">{channel}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel mt-6 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-success" aria-hidden="true" />
          <div><p className="kicker text-success">Audit history</p><h2 className="mt-2 text-lg font-bold text-ink">Routing events</h2></div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {incident.routingEvents.length
            ? incident.routingEvents.map((event, index) => (
              <div key={`${event.type}-${index}`} className="border-l-2 border-success pl-3">
                <p className="text-sm font-bold text-ink">{event.message}</p>
                <p className="mt-1 text-xs text-ink-faint">{new Date(event.occurredAt).toLocaleString("en-IN")} · {event.status}</p>
              </div>
            ))
            : <p className="text-sm text-ink-soft">No routing events yet. Prepare the response packets to populate this audit view.</p>
          }
        </div>
      </section>
    </div>
  );
}

async function IncidentList() {
  const all = await getAllIncidents();
  const highRisk = all.filter((i) => i.dna?.risk === "high").length;
  const filed = all.filter((i) => !i.syntheticOnly).length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Operator console</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Incident registry</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">All incidents in the system. Click any row to inspect the full incident graph.</p>
        </div>
        <Link href="/recover/DEMO0001" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
          <ArrowLeft size={16} aria-hidden="true" /> Recovery cockpit
        </Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <section className="panel p-5"><p className="kicker">Total incidents</p><p className="mt-3 text-3xl font-bold text-ink">{all.length}</p><p className="mt-1 text-xs text-ink-soft">in this environment</p></section>
        <section className="panel p-5"><p className="kicker">High risk</p><p className="mt-3 text-3xl font-bold text-danger">{highRisk}</p><p className="mt-1 text-xs text-ink-soft">require immediate attention</p></section>
        <section className="panel p-5"><p className="kicker">Citizen-filed</p><p className="mt-3 text-3xl font-bold text-ink">{filed}</p><p className="mt-1 text-xs text-ink-soft">non-synthetic incidents</p></section>
      </div>

      <section className="panel mt-7 overflow-hidden">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <p className="text-[15px] font-bold text-ink">All incidents</p>
          <p className="mt-1 text-xs text-ink-soft">Sorted by most recent. Demo / synthetic incidents are included.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase tracking-[.08em] text-ink-faint">
                <th className="px-5 py-3 pr-3 sm:px-6">Case ref</th>
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Risk</th>
                <th className="py-3 pr-3">Pattern</th>
                <th className="py-3 pr-6">Summary</th>
                <th className="py-3 pr-5 sm:pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {all.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
              {all.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-faint sm:px-6">
                    No incidents yet. File one through the Check page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const date = new Date(incident.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const summary = (incident.rawText ?? "").slice(0, 70).replace(/\s+/g, " ").trim();
  return (
    <tr className="border-b border-line transition-colors last:border-0 hover:bg-surface">
      <td className="px-5 py-3.5 pr-3 sm:px-6">
        <span className="mono-ref text-xs font-bold text-service">{incident.ackNumber ?? incident.id}</span>
      </td>
      <td className="py-3.5 pr-3 text-xs text-ink-soft whitespace-nowrap">{date}</td>
      <td className="py-3.5 pr-3">
        <RiskBadge risk={incident.dna?.risk} />
      </td>
      <td className="py-3.5 pr-3 max-w-[160px]">
        <span className="block truncate text-xs text-ink">{incident.dna?.patternName ?? "—"}</span>
      </td>
      <td className="py-3.5 pr-6 max-w-[200px]">
        <span className="block truncate text-xs text-ink-soft">{summary || "—"}</span>
      </td>
      <td className="py-3.5 pr-5 sm:pr-6 text-right">
        <Link href={`/operator?id=${incident.id}`} className="inline-flex min-h-9 items-center rounded-[3px] border border-line px-3 text-xs font-bold text-ink-soft hover:border-service hover:text-service">
          Inspect
        </Link>
      </td>
    </tr>
  );
}

export default async function OperatorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="operator" />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        {id ? <IncidentDetail incidentId={id} /> : <IncidentList />}
      </main>
    </div>
  );
}
