import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { PATTERN_BY_SLUG } from "@/data/patterns";
import { getIncident, isIncidentId, isIncidentOwnedBy, getUserIncidents } from "@/lib/store";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SYNTHETIC_CLUSTER = [
  ["SYN-UP-041", "Uttar Pradesh", "hotel-rating job offer", "WhatsApp"],
  ["SYN-UP-052", "Uttar Pradesh", "prepaid task deposit", "Telegram"],
  ["SYN-MH-018", "Maharashtra", "fake review agency", "Instagram"],
  ["SYN-KA-027", "Karnataka", "unlocking fee demand", "WhatsApp"],
];

function fmt(iso: string | null | undefined): string {
  if (!iso) return "Not recorded";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "Invalid date";
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
}

function riskClass(risk: string | null | undefined): string {
  if (risk === "high") return "border-red-200 bg-red-50 text-red-700";
  if (risk === "medium") return "border-yellow-200 bg-yellow-50 text-yellow-700";
  return "border-line bg-paper text-ink-soft";
}

function statusClass(status: string): string {
  if (status === "complete") return "bg-green-50 text-green-700";
  if (status === "pending") return "bg-yellow-50 text-yellow-700";
  return "bg-paper text-ink-soft";
}

function confirmClass(status: string): string {
  if (status === "confirmed" || status === "corrected") return "text-green-700";
  if (status === "missing") return "text-red-600";
  return "text-yellow-700";
}

export default async function OperatorPage({ searchParams }: { searchParams: Promise<{ caseId?: string | string[] }> }) {
  const params = await searchParams;
  const caseId = params.caseId;

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (!caseId) {
    const session = await getSession();
    const incidents = session
      ? (await getUserIncidents(session.userId))
          .filter((i) => !i.syntheticOnly)
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      : [];

    return (
      <div className="min-h-[100dvh] bg-paper">
        <SiteHeader current="operator" />
        <main id="main-content" className="public-shell py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <header className="border-b border-line pb-6">
              <p className="kicker">Operator console / read-only</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">All reported incidents</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
                {incidents.length === 0
                  ? "No cases linked to your account yet."
                  : `${incidents.length} case${incidents.length !== 1 ? "s" : ""} linked to your account.`}{" "}
                No complaint delivery, bank action, or official acknowledgement is verified here.
              </p>
            </header>

            <div className="mt-4 flex items-start gap-2.5 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
              <span className="mt-0.5 shrink-0 font-bold uppercase tracking-wide">Prototype note</span>
              <span>In this prototype build, access to the Operator Console is open to all users. In a production deployment this view would be restricted to verified law enforcement and authorised institutional operators only.</span>
            </div>

            {incidents.length === 0 ? (
              <div className="panel mt-8 grid justify-items-center gap-4 px-6 py-16 text-center">
                <FileText size={38} className="text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-lg font-bold text-ink">No incidents yet</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {session ? "Cases you report will appear here with full detail and timestamps." : "Sign in to see your reported cases here."}
                  </p>
                </div>
                {session ? (
                  <Link href="/check" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md bg-service px-4 text-sm font-bold text-white hover:bg-service-deep">
                    Report an incident <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link href="/login?next=/operator" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md bg-service px-4 text-sm font-bold text-white hover:bg-service-deep">
                    Sign in <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {incidents.map((incident) => {
                  const confirmed = incident.extractedFacts.filter((f) => ["confirmed", "corrected"].includes(f.confirmationStatus)).length;
                  const unconfirmed = incident.extractedFacts.filter((f) => f.confirmationStatus === "unconfirmed").length;
                  return (
                    <div key={incident.id} className="panel p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-bold text-ink">{incident.dna?.patternName ?? "Incident record"}</span>
                            {incident.dna?.risk && (
                              <span className={`inline-block rounded border px-2 py-0.5 text-[11px] font-bold uppercase ${riskClass(incident.dna.risk)}`}>
                                {incident.dna.risk} risk
                              </span>
                            )}
                            <span className="inline-block rounded border border-service/30 bg-service-soft px-2 py-0.5 text-[11px] font-bold uppercase text-service">
                              {incident.origin === "call-shield" ? "Call Shield" : incident.origin === "intake" ? "Intake" : incident.origin}
                            </span>
                          </div>
                          <p className="mono-ref mt-1.5 text-xs text-ink-faint">{incident.ackNumber ?? incident.id}</p>
                          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:flex sm:flex-wrap sm:gap-x-10">
                            <div>
                              <p className="font-semibold text-ink">Reported</p>
                              <p className="mt-0.5 text-ink-soft">{fmt(incident.createdAt)}</p>
                            </div>
                            {incident.occurredAt && (
                              <div>
                                <p className="font-semibold text-ink">Incident at</p>
                                <p className="mt-0.5 text-ink-soft">{fmt(incident.occurredAt)}</p>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-ink">Facts</p>
                              <p className="mt-0.5 text-ink-soft">{confirmed} confirmed · {unconfirmed} pending</p>
                            </div>
                            <div>
                              <p className="font-semibold text-ink">Packets</p>
                              <p className="mt-0.5 text-ink-soft">{incident.packets.length} prepared</p>
                            </div>
                            <div>
                              <p className="font-semibold text-ink">Events</p>
                              <p className="mt-0.5 text-ink-soft">{incident.routingEvents.length} logged</p>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/operator?caseId=${incident.id}`}
                          className="shrink-0 flex min-h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-bold text-service hover:border-service hover:bg-service-soft"
                        >
                          View detail <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 rounded-lg border border-dashed border-line p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Synthetic example — not a real case</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ink">DEMO0001 — task-scam pattern</p>
                  <p className="mono-ref mt-1 text-xs text-ink-faint">DEMO0001</p>
                </div>
                <Link
                  href="/operator?caseId=DEMO0001"
                  className="shrink-0 flex min-h-9 items-center gap-1.5 rounded-md border border-dashed border-line px-3 text-xs font-bold text-ink-soft hover:text-service"
                >
                  View <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── DETAIL VIEW ────────────────────────────────────────────────────────────
  if (typeof caseId !== "string" || !isIncidentId(caseId)) notFound();
  const incident = await getIncident(caseId);
  if (!incident) notFound();
  if (caseId !== "DEMO0001") {
    const session = await getSession();
    if (!session) redirect(`/login?next=${encodeURIComponent(`/operator?caseId=${caseId}`)}`);
    if (!isIncidentOwnedBy(incident, session.userId)) notFound();
  }

  const example = incident.id === "DEMO0001";
  const pattern = incident.dna?.patternSlug ? PATTERN_BY_SLUG.get(incident.dna.patternSlug) : null;
  const confirmed = incident.extractedFacts.filter((f) => ["confirmed", "corrected"].includes(f.confirmationStatus)).length;
  const unconfirmed = incident.extractedFacts.filter((f) => f.confirmationStatus === "unconfirmed").length;

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="operator" />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link href="/operator" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
            <ArrowLeft size={16} aria-hidden="true" /> All incidents
          </Link>

          {/* ── Case header ── */}
          <header className="mt-7 border-b border-line pb-6">
            <p className="kicker">Operator view / read-only</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">
              {incident.dna?.patternName ?? "Incident detail"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
              This is not an institutional console. No complaint delivery, bank action, official acknowledgement or recovery is verified here.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {incident.dna?.risk && (
                <span className={`inline-block rounded border px-2 py-0.5 text-xs font-bold uppercase ${riskClass(incident.dna.risk)}`}>
                  {incident.dna.risk} risk
                </span>
              )}
              <span className="inline-block rounded border border-service/30 bg-service-soft px-2 py-0.5 text-xs font-bold uppercase text-service">
                {incident.origin === "call-shield" ? "Call Shield" : incident.origin === "intake" ? "Intake form" : incident.origin}
              </span>
              {example && (
                <span className="inline-block rounded border border-dashed border-line px-2 py-0.5 text-xs font-bold uppercase text-ink-faint">
                  Synthetic demo
                </span>
              )}
            </div>

            <dl className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Raksha case ID</dt>
                <dd className="mono-ref mt-1 select-all break-all text-sm font-bold text-ink">{incident.id}</dd>
              </div>
              {incident.ackNumber && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Ack number</dt>
                  <dd className="mono-ref mt-1 select-all break-all text-sm font-bold text-ink">{incident.ackNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Reported at</dt>
                <dd className="mt-1 text-sm text-ink">{fmt(incident.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Incident at</dt>
                <dd className="mt-1 text-sm text-ink">{fmt(incident.occurredAt)}</dd>
              </div>
              {incident.dna?.currentStage && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Scam stage</dt>
                  <dd className="mt-1 text-sm text-ink">{incident.dna.currentStage}</dd>
                </div>
              )}
              {incident.dna?.confidence !== undefined && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Pattern confidence</dt>
                  <dd className="mt-1 text-sm text-ink">{Math.round(incident.dna.confidence * 100)}%</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Language</dt>
                <dd className="mt-1 text-sm capitalize text-ink">{incident.language}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Status</dt>
                <dd className="mt-1 text-sm text-ink">{confirmed} confirmed · {unconfirmed} pending · {incident.missingFacts.length} open</dd>
              </div>
            </dl>
          </header>

          {/* ── Risk signals ── */}
          {incident.dna?.signals && incident.dna.signals.length > 0 && (
            <section className="panel mt-7 p-5" aria-labelledby="signals-heading">
              <h2 id="signals-heading" className="text-xl font-bold text-ink">Risk signals</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-6 text-ink-soft">
                {incident.dna.signals.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </section>
          )}

          {/* ── Call Shield session ── */}
          {incident.shield && (
            <section className="panel mt-6 p-5" aria-labelledby="shield-heading">
              <h2 id="shield-heading" className="text-xl font-bold text-ink">Call Shield session</h2>
              <dl className="mt-4 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="font-bold text-ink">Source</dt>
                  <dd className="mt-0.5 capitalize text-ink-soft">{incident.shield.source ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Session started</dt>
                  <dd className="mt-0.5 text-ink-soft">{fmt(incident.shield.startedAt)}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Session ended</dt>
                  <dd className="mt-0.5 text-ink-soft">{fmt(incident.shield.endedAt)}</dd>
                </div>
                {incident.shield.assessment?.verdict && (
                  <div>
                    <dt className="font-bold text-ink">Shield verdict</dt>
                    <dd className="mt-0.5 capitalize text-ink-soft">{incident.shield.assessment.verdict}</dd>
                  </div>
                )}
                {incident.shield.assessment?.confidence !== undefined && (
                  <div>
                    <dt className="font-bold text-ink">Shield confidence</dt>
                    <dd className="mt-0.5 text-ink-soft">{Math.round(incident.shield.assessment.confidence * 100)}%</dd>
                  </div>
                )}
                {incident.shield.assessment?.method && (
                  <div>
                    <dt className="font-bold text-ink">Detection method</dt>
                    <dd className="mt-0.5 capitalize text-ink-soft">{incident.shield.assessment.method}</dd>
                  </div>
                )}
              </dl>
              {incident.shield.transcript && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-ink">Transcript</p>
                  <p className="mono-ref mt-2 max-h-40 overflow-y-auto rounded bg-paper p-3 text-xs leading-5 text-ink-soft whitespace-pre-wrap">
                    {incident.shield.transcript}
                  </p>
                </div>
              )}
              {incident.shield.alerts.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-ink">Alerts ({incident.shield.alerts.length})</p>
                  <ul className="mt-2 divide-y divide-line">
                    {incident.shield.alerts.map((alert, i) => (
                      <li key={i} className="py-2 text-xs text-ink-soft">
                        <span className="font-semibold capitalize text-ink">{alert.kind}</span> → {alert.to} ·{" "}
                        {fmt(alert.at)} · <span className="capitalize">{alert.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* ── Extracted facts ── */}
          <section className="panel mt-6 p-5" aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="text-xl font-bold text-ink">Extracted facts</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {confirmed} confirmed or corrected · {unconfirmed} unconfirmed · {incident.missingFacts.length} open questions.
            </p>
            {incident.extractedFacts.length > 0 ? (
              <dl className="mt-4 divide-y divide-line">
                {incident.extractedFacts.map((fact, i) => (
                  <div key={`${fact.field}-${i}`} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
                    <dt className="break-words text-sm font-bold text-ink">{fact.field}</dt>
                    <dd className="min-w-0 break-words text-sm text-ink-soft">
                      <p>{fact.value === null ? "Not recorded" : String(fact.value)}</p>
                      <p className="mt-1 text-xs">
                        Source: <span className="font-semibold">{fact.source}</span> ·{" "}
                        Confidence: <span className="font-semibold">{Math.round(fact.confidence * 100)}%</span> ·{" "}
                        Status:{" "}
                        <span className={`font-semibold ${confirmClass(fact.confirmationStatus)}`}>
                          {fact.confirmationStatus}
                        </span>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-ink-soft">No extracted facts recorded.</p>
            )}
            {incident.missingFacts.length > 0 && (
              <>
                <h3 className="mt-6 text-base font-bold text-ink">Open questions</h3>
                <ul className="mt-2 list-inside list-disc text-sm leading-7 text-ink-soft">
                  {incident.missingFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                </ul>
              </>
            )}
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* ── Packets ── */}
            <section className="panel p-5">
              <h2 className="text-xl font-bold text-ink">Local packets</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">Prepared locally. Not sent to any authority.</p>
              {incident.packets.length > 0 ? (
                <ul className="mt-4 divide-y divide-line">
                  {incident.packets.map((packet, i) => (
                    <li key={i} className="py-3 text-sm">
                      <p className="font-bold uppercase text-ink">{packet.recipient}</p>
                      <p className="mt-0.5 capitalize text-ink-soft">{packet.status.replace(/_/g, " ")}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">No packets prepared.</p>
              )}
            </section>

            {/* ── Event log ── */}
            <section className="panel p-5">
              <h2 className="text-xl font-bold text-ink">Event log</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">Local entries only. Not delivery confirmations.</p>
              {incident.routingEvents.length > 0 ? (
                <ol className="mt-4 divide-y divide-line">
                  {incident.routingEvents.map((event, i) => {
                    const at = new Date(event.occurredAt);
                    return (
                      <li key={i} className="py-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-bold capitalize text-ink">{event.type.replace(/_/g, " ")}</p>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${statusClass(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-ink-soft">{event.message}</p>
                        <p className="mt-1 text-xs text-ink-faint">
                          {Number.isFinite(at.getTime()) ? at.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Kolkata" }) : "Time not recorded"}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">No events recorded.</p>
              )}
            </section>
          </div>

          {/* ── Pattern context ── */}
          {pattern && (
            <section className="panel mt-6 p-5">
              <h2 className="text-xl font-bold text-ink">Advisory pattern context</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {pattern.name}. A pattern resemblance is not proof of a shared perpetrator or a database match.
              </p>
              <Link href={`/atlas/${encodeURIComponent(pattern.slug)}`} className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-service">
                Read pattern guidance <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* ── Synthetic cluster (DEMO0001 only) ── */}
          {example && (
            <section className="panel mt-6 p-5">
              <h2 className="text-xl font-bold text-ink">Synthetic cluster illustration</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Fictional examples only. Not verified links or database results.
              </p>
              <ul className="mt-4 divide-y divide-line">
                {SYNTHETIC_CLUSTER.map(([id, region, description, channel]) => (
                  <li key={id} className="py-3 text-sm leading-6 text-ink-soft">
                    <span className="mono-ref font-bold text-ink">{id}</span>: {region}, {description}, {channel}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
