import Link from "next/link";
import { ArrowLeft, ArrowRight, Banknote, FileCheck2, LockKeyhole, PhoneCall, ShieldAlert } from "lucide-react";
import { getIncident } from "@/lib/store";
import { buildBrief, emptyAnswers } from "@/lib/brief";
import { BANK_PLAYBOOKS, CONTENT_PLAYBOOK, HELPLINE_1930 } from "@/lib/playbooks";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ActionChecklist from "@/components/ActionChecklist";
import DemoAlertButton from "@/components/DemoAlertButton";
import CopyBrief from "@/components/CopyBrief";

export const dynamic = "force-dynamic";

const TRIGGER_LABELS: Record<string, string> = {
  paid: "money was transferred",
  otp: "an OTP or PIN was shared",
  app: "an app was installed",
  screen: "screen access was granted",
  images: "private images are involved",
  id: "identity documents were shared",
  call: "a suspicious call was screened",
};

export default async function ActPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trigger?: string | string[] }>;
}) {
  const { id }             = await params;
  const { trigger } = await searchParams;
  const incident           = await getIncident(id);
  if (!incident) notFound();

  const hint = typeof trigger === "string" ? trigger : undefined;
  const answers = incident.shield?.answers;
  const savedAnswer = (keys: string[]) => {
    const values = keys.map((key) => incident.answers[key]);
    if (values.includes(true)) return true;
    if (values.includes(false)) return false;
    return undefined;
  };
  const paid = incident.shield ? answers?.moneyMoved ?? undefined : savedAnswer(["paid"]);
  const access = incident.shield ? answers?.sharedCredentials ?? undefined : savedAnswer(["otp", "app", "screen", "sharedOtpOrPin", "installedApp", "sharedScreen", "attackerStillHasAccess"]);
  const images = savedAnswer(["images", "intimateContentInvolved", "contentAlreadyPublished"]);
  const danger = incident.shield ? answers?.immediateDanger ?? undefined : savedAnswer(["danger", "beingThreatened"]);
  const isCall = Boolean(incident.shield) || incident.origin === "call-shield" || hint === "call";
  const isAccess = access === true || incident.tracks.includes("access") || (access === undefined && ["otp", "app", "screen"].includes(hint ?? ""));
  const isMoney = paid === true || isAccess || incident.tracks.includes("money") || (paid === undefined && hint === "paid");
  const isContent = images === true || incident.tracks.includes("content") || (images === undefined && hint === "images");
  const isEmergency = danger === true || isMoney || isAccess || isContent || isCall;
  const context = [paid === true ? TRIGGER_LABELS.paid : null, access === true ? "credentials or device access were shared" : null, images === true ? TRIGGER_LABELS.images : null, isCall ? TRIGGER_LABELS.call : null].filter(Boolean);

  const unknown = [danger === undefined ? "Immediate danger: not established." : null, paid === undefined ? "Money transfer or loss: not established." : null, access === undefined ? "Credential or device access: not established." : null].filter(Boolean);
  const brief = incident.shield ? buildBrief({
    id,
    assessment: incident.shield.assessment,
    answers: incident.shield.answers ?? emptyAnswers(),
    source: incident.shield.source,
    startedAt: incident.shield.startedAt,
    endedAt: incident.shield.endedAt,
    redactedTranscript: incident.shield.transcript,
  }) : null;

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="stage-rail bg-surface" aria-label="Incident stages">
          {["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => (
            <div key={label} className={index === 3 ? "is-active" : ""}>
              <span className="block font-mono text-[10px] font-bold">0{index + 1}</span>
              <span className="mt-1 block text-xs font-bold">{label}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <Link href={`/check/${id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
            <ArrowLeft size={16} aria-hidden="true" /> Back to analysis
          </Link>
          <div className="mt-7 border-b border-line pb-6">
            <p className="kicker">Step 04 / immediate action board</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">
              Act in the right order.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
              {context.length ? `Saved context: ${context.join("; ")}.` : "The extent of harm is not yet established."} These steps use saved answers and relevant risk tracks, with the initial URL hint only where answers are missing. Containment comes before paperwork.
            </p>
          </div>

          {isEmergency && (
            <section className="panel mt-7 border-danger/40 bg-danger-soft p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <ShieldAlert size={26} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                <div>
                  <p className="kicker text-danger">Containment first</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">Stop. Do exactly this.</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Do not wait for this service to finish processing before calling the official helpline.
                  </p>
                  {danger === true && !brief && <a href="tel:112" className="mt-3 inline-flex min-h-12 items-center rounded-[8px] bg-danger px-5 text-sm font-bold text-white">Call 112 now (immediate danger)</a>}
                </div>
              </div>
            </section>
          )}

          {/* ── CALL SHIELD ESCALATION BOARD ───────────────────────────── */}
          {isCall && brief && (() => {
            const mailto = `mailto:?subject=${encodeURIComponent(brief.emailSubject)}&body=${encodeURIComponent(brief.emailBody)}`;
            const waText = encodeURIComponent(`${brief.emailSubject}\n\n${brief.readAloud}`);
            const primary =
              brief.escalation === "112"
                ? { href: "tel:112",  label: "Call 112 now (India unified emergency)" }
                : brief.escalation === "1930"
                ? { href: "tel:1930", label: "Call 1930 now (cyber financial fraud helpline)" }
                : null;

            return (
              <section className="panel mt-7 p-5 sm:p-6">
                <p className="kicker">Your saved brief / review before sharing</p>
                {incident.extractedFacts.some((fact) => fact.field === "Simulation edits") && <p className="mt-3 text-sm text-warning">User-edited simulation. This remains a synthetic example, not a verified real incident.</p>}
                {unknown.length > 0 && <p className="mt-3 text-sm text-warning">{unknown.join(" ")} Unknown does not mean safe or no loss.</p>}

                {primary && (
                  <div className="mt-4 rounded-[10px] border-2 border-danger bg-danger-soft p-4">
                    <p className="text-sm text-ink-soft">{brief.escalationReason}</p>
                    <a
                      href={primary.href}
                      className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-danger px-5 text-base font-bold text-white"
                    >
                      <PhoneCall size={20} aria-hidden="true" />
                      {primary.label}
                      <span className="ml-2 rounded-full border border-white/40 px-2 py-0.5 text-[11px]">
                        Opens your dialler
                      </span>
                    </a>
                    <details className="mt-4 text-sm text-ink" open>
                      <summary className="cursor-pointer font-semibold">
                        Read this to the operator
                      </summary>
                      <p className="mt-2 rounded-[10px] bg-paper p-3 font-mono text-[13px] leading-7">
                        {brief.readAloud}
                      </p>
                    </details>
                  </div>
                )}

                {!primary && (
                  <div className="mt-4 rounded-[10px] border border-line p-4">
                    <p className="text-sm text-ink">{brief.escalationReason}</p>
                  </div>
                )}

                {/* Three-column brief */}
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[10px] border border-line p-4">
                    <p className="text-xs font-semibold uppercase text-success">Saved reported answers</p>
                    <ul className="mt-2 list-disc pl-4 text-sm text-ink">
                      {brief.confirmed.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-[10px] border border-line p-4">
                    <p className="text-xs font-semibold uppercase text-ink-faint">Transcript evidence</p>
                    <ul className="mt-2 list-disc pl-4 text-sm text-ink">
                      {brief.transcriptEvidence.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-[10px] border border-line p-4">
                    <p className="text-xs font-semibold uppercase text-warning">AI assessment · advisory</p>
                    <ul className="mt-2 list-disc pl-4 text-sm text-ink">
                      {brief.aiAssessment.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Report the number */}
                <div className="mt-5 rounded-[10px] border border-line p-4">
                  <p className="text-sm font-bold text-ink">
                    Report suspected misuse of the number{" "}
                    <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-semibold text-ink-faint">
                      External official sites
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href="https://cybercrime.gov.in/Webform/cyber_suspect.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-[10px] border border-line px-4 text-sm font-bold text-ink"
                    >
                      NCRP — Report Suspect ↗
                    </a>
                    <a
                      href="https://sancharsaathi.gov.in/sfc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-[10px] border border-line px-4 text-sm font-bold text-ink"
                    >
                      Chakshu (Sanchar Saathi) ↗
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-ink-faint">
                    You are leaving Raksha. Review the official form and share only the details it needs. Chakshu is for suspected fraudulent communications, not a substitute for reporting financial loss to 1930 / NCRP. Raksha does not submit on your behalf.
                  </p>
                </div>

                {/* Share */}
                <div className="mt-5 rounded-[10px] border border-line p-4">
                  <p className="text-sm font-bold text-ink">Share the brief</p>
                  <p className="mt-2 text-xs leading-5 text-ink-soft">The brief may include your name, callback number, location and transaction details. Share only with a recipient you trust. Email and WhatsApp open external services; Raksha does not send the brief automatically.</p>
                  <CopyBrief text={brief.emailBody} incidentId={id} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={mailto}
                      className="inline-flex min-h-11 items-center rounded-[10px] border border-line px-4 text-sm font-bold text-ink"
                    >
                      Email the brief (opens your mail app)
                    </a>
                    <a
                      href={`https://wa.me/?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-[10px] border border-line px-4 text-sm font-bold text-ink"
                    >
                      Tell someone you trust (WhatsApp)
                    </a>
                  </div>
                  {/* Demo Vapi alert */}
                  <DemoAlertButton incidentId={id} readAloud={brief.readAloud} />
                </div>
              </section>
            );
          })()}

          {/* ── MONEY / OTP TRACKS (existing) ───────────────────────────── */}
          {isMoney && danger !== true && (!brief || brief.escalation === "1930") && (
            <section className="panel mt-4 border-danger/40 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <PhoneCall size={22} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                  <div>
                    <p className="kicker text-danger">Action 01 / official helpline</p>
                    <h2 className="mt-2 text-xl font-bold text-ink">Call 1930 now</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      If money moved or financial access may be exposed, contact your bank and the National Cybercrime Financial Helpline promptly. This track alone is not confirmation of loss.
                    </p>
                  </div>
                </div>
                <a href="tel:1930" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-danger px-5 text-sm font-bold text-white hover:bg-command">
                  <PhoneCall size={16} aria-hidden="true" /> 1930
                </a>
              </div>
              <div className="mt-5 rounded-[8px] bg-paper p-4">
                <p className="font-mono text-xs leading-6 text-ink">{HELPLINE_1930.script}</p>
              </div>
              <p className="mt-4 text-xs leading-5 text-warning">
                Call first. Then use this checklist to organise evidence and prepare the response packets.
              </p>
            </section>
          )}

          {isMoney && (
            <section className="panel mt-4 p-5 sm:p-6">
              <div className="flex gap-3">
                <Banknote size={21} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                <div>
                  <p className="kicker text-warning">{danger === true ? "After emergency help / bank containment" : "Action 02 / bank containment"}</p>
                  <h2 className="mt-2 text-xl font-bold text-ink">Ask your bank to block exposed payment access</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Use a trusted device and verify contact details in your bank&apos;s official app, website or on your card. Ask about blocking cards / UPI / online banking and disputing affected transactions. Raksha cannot freeze accounts or guarantee recovery.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {BANK_PLAYBOOKS.map((bank) => (
                  <details key={bank.id} className="panel-tight bg-paper">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-3 text-sm font-bold text-ink">
                      <span>{bank.shortName}</span>
                      <span className="font-mono text-[10px] text-ink-faint">{bank.helpline}</span>
                    </summary>
                    <div className="border-t border-line px-3 pb-4 pt-3">
                      <p className="text-xs leading-5 text-ink-soft">{bank.appSteps.join(" · ")}</p>
                      <a href={`tel:${bank.helpline.replace(/-/g, "")}`} className="mt-3 inline-flex min-h-10 items-center text-xs font-bold text-service">
                        Call {bank.helpline}
                      </a>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {isAccess && <section className="panel mt-4 border-warning/30 p-5 sm:p-6">
            <p className="kicker text-warning">Device and account containment</p>
            <h2 className="mt-2 text-xl font-bold text-ink">End remote access before doing more banking.</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-soft">
              <li>If screen sharing or remote control may be active, end the session and disconnect the affected device from the internet.</li>
              <li>From a different trusted device, contact your bank, change exposed passwords and revoke unknown sessions. Never share an OTP, PIN or recovery code.</li>
              <li>Record the suspicious app name and relevant messages without delaying containment. Remove untrusted apps and permissions; seek trusted technical help if access persists.</li>
            </ul>
          </section>}

          {isContent && (
            <section className="panel mt-4 border-service/30 p-5 sm:p-6">
              <div className="flex gap-3">
                <LockKeyhole size={21} className="mt-0.5 shrink-0 text-service" aria-hidden="true" />
                <div>
                  <p className="kicker">Content protection track</p>
                  <h2 className="mt-2 text-xl font-bold text-ink">Keep the original image on your device.</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    The local fingerprint path is now available from intake. Do not upload intimate images to this service.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {CONTENT_PLAYBOOK.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-3 border-t border-line pt-4">
                    <span className="font-mono text-xs font-bold text-service">0{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink-soft">{step.body}</p>
                      {step.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="mr-4 mt-2 inline-flex min-h-11 items-center text-sm font-bold text-service">{link.label} (external)</a>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="panel mt-4 p-5 sm:p-6">
            <div className="flex gap-3">
              <FileCheck2 size={21} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              <div>
                <p className="kicker text-success">
                  Action {isMoney || isContent ? "03" : isCall ? "02" : "01"} / evidence
                </p>
                <h2 className="mt-2 text-xl font-bold text-ink">
                  Preserve evidence before deleting anything.
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Mark each item complete. These checklist actions organise your evidence and do not contact an institution.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ActionChecklist
                incidentId={id}
                initialCompleted={incident.completedActions}
                items={[
                  "Export the full conversation",
                  "Save the suspect profile and number",
                  "Record the transaction ID or UTR",
                  "Keep incoming messages and call details",
                  "Record the exact dates and times",
                  "Save the screenshot or receipt",
                ]}
              />
            </div>
          </section>

          <section className="mt-6">
            <Link
              href={`/report/${id}`}
              className="flex min-h-14 items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white hover:bg-command"
            >
              Continue to prepared incident packets <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs text-ink-faint">
              Review confirmed and missing facts next. Packets and routing are SIMULATED, prepared locally and not sent.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
