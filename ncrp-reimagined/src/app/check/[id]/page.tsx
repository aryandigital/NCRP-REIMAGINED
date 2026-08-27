import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getIncident } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import FactReview from "@/components/FactReview";
import { IconAlert, IconClock, IconEmergency, IconEvidence, IconGuide, IconRadar } from "@/components/icons";

export const dynamic = "force-dynamic";

/**
 * The verdict screen.
 *
 * Ordering is deliberate and follows crisis-service research: the one urgent
 * action comes before any administrative content, the shame-reducing line is
 * said once at the point of highest shame, and uncertainty is named rather than
 * hidden. The verdict contract allows High / Needs caution / No match, never
 * "safe".
 */

const RISK_VIEW = {
  high: {
    label: "High risk",
    tone: "border-danger/45 bg-danger-soft",
    accent: "text-danger",
    meaning: "This closely matches a scam script we hold. Treat it as an active attempt to take your money or your information.",
  },
  medium: {
    label: "Needs caution",
    tone: "border-warning/45 bg-warning-soft",
    accent: "text-warning",
    meaning: "Parts of this match known scam behaviour. Treat it as unverified until you can check it through an official channel you found yourself.",
  },
  unclear: {
    label: "No match found",
    tone: "border-line-strong bg-surface",
    accent: "text-ink-soft",
    meaning: "We could not match this to a script we hold. That does not mean it is safe, it means we have no match. Your own judgement still counts.",
  },
} as const;

/** Said once, at the point of highest shame. Never paired with a prevention tip. */
const NOT_YOUR_FAULT: Record<string, string> = {
  "digital-arrest":
    "There is no such thing as a digital arrest. No police officer, court, CBI, ED, or customs official in India will arrest you over a video call, or ask you to transfer money to prove you are innocent. If you were told this, you were being deceived by criminals, not investigated. Being frightened was the point.",
  "sextortion-image-threat":
    "You are not in trouble. The person threatening you is committing a crime, you are not. These are usually organised groups who contact hundreds of people at a time, and paying them almost never stops it.",
  "task-scam":
    "This was done to you by people who do it for a living. They run scripts refined on thousands of people before you. Losing money to them is not a failure of intelligence.",
  "investment-pig-butchering":
    "These operations are run by organised groups using scripts refined on thousands of people. Careful, experienced people are targeted every day, and many of them are caught.",
  "upi-collect-request":
    "This was done to you by people who do it for a living. Payment requests are designed to look like refunds. Being caught by one is not a failure of intelligence.",
};

const NOT_YOUR_FAULT_DEFAULT =
  "Scams like this are run by organised groups using scripts refined on thousands of people. Being targeted is not a failure of intelligence, and you are not alone.";

/** The one imperative action. First word is a verb wherever possible. */
const FIRST_ACTION: Record<string, { do: string; why: string }> = {
  "task-scam": {
    do: "Stop replying, and do not deposit money to unlock your earnings.",
    why: "The balance shown in their app is not real money. The deposit is the theft.",
  },
  "digital-arrest": {
    do: "Hang up. Then call 1930.",
    why: "No real officer will video-call you, ask you to stay on camera, or ask for a transfer.",
  },
  "investment-pig-butchering": {
    do: "Stop sending money, and do not add more to release your balance.",
    why: "The withdrawal block is part of the script, not a technical problem.",
  },
  "upi-collect-request": {
    do: "Decline the payment request, and never enter your UPI PIN to receive money.",
    why: "Entering a PIN never receives money. It only sends money.",
  },
  "sextortion-image-threat": {
    do: "Stop replying and do not pay. Keep the messages.",
    why: "Paying leads to another demand. The messages are your evidence.",
  },
};

const FIRST_ACTION_DEFAULT = {
  do: "Stop contact, and do not send money or share any code.",
  why: "Ending the conversation removes their pressure and buys you time to check independently.",
};

/** Identifier-only verdicts get an action matched to the identifier type. */
const IDENTIFIER_ACTION: Record<string, { do: string; why: string }> = {
  url: {
    do: "Do not open the link.",
    why: "The page is built to imitate a real bank or payment app and capture what you type.",
  },
  upi: {
    do: "Decline any payment request from this ID.",
    why: "Approving a request with your PIN sends money. It never receives money.",
  },
  phone: {
    do: "Do not share any code, PIN, or card detail with this number.",
    why: "A number displayed on your screen can be faked. It proves nothing about who is calling.",
  },
};

/** Max four primary choices on a decision screen; the rest are quiet links. */
const PRIMARY_TRIGGERS = [
  { id: "paid", label: "Money was sent" },
  { id: "otp", label: "I shared an OTP, PIN, or password" },
  { id: "app", label: "I installed an app or shared my screen" },
  { id: "images", label: "Private photos or videos are involved" },
] as const;

const SECONDARY_TRIGGERS = [
  { id: "id", label: "I shared Aadhaar or PAN" },
  { id: "none", label: "None of this has happened yet" },
] as const;

export default async function CheckResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const incident = await getIncident(id);
  // Anonymous incidents (no owner) are reachable by their unguessable ID;
  // owned incidents are only visible to the signed-in owner.
  if (!incident || !incident.dna || (!incident.syntheticOnly && incident.userId && incident.userId !== session?.userId)) notFound();

  const dna = incident.dna;
  const view = RISK_VIEW[dna.risk];
  const identifierKind = dna.exactMatches[0]?.type ?? "";
  const firstAction =
    (dna.patternSlug && FIRST_ACTION[dna.patternSlug]) ||
    (!dna.patternSlug && IDENTIFIER_ACTION[identifierKind]) ||
    FIRST_ACTION_DEFAULT;
  const notYourFault = (dna.patternSlug && NOT_YOUR_FAULT[dna.patternSlug]) || NOT_YOUR_FAULT_DEFAULT;
  const moneyAtRisk = dna.risk === "high" && dna.patternSlug !== "sextortion-image-threat";

  const facts = incident.extractedFacts.length > 0 ? incident.extractedFacts : [
    ...(dna.patternName ? [{ field: "Scam type", value: dna.patternName, source: "model" as const, confidence: dna.confidence, confirmationStatus: "unconfirmed" as const }] : []),
    ...dna.exactMatches.map((match) => ({ field: match.type, value: match.value, source: "user" as const, confidence: .9, confirmationStatus: "unconfirmed" as const })),
  ];
  const confirmedCount = facts.filter((fact) => fact.confirmationStatus === "confirmed").length;

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="check" />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="stage-rail bg-surface" aria-label="Incident stages">
          {["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => (
            <div key={label} className={index === 2 ? "is-active" : index < 2 ? "" : "opacity-60"}>
              <span className="block font-mono text-[10px] font-bold">0{index + 1}</span>
              <span className="mt-1 block text-xs font-bold">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/check" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
            <ArrowLeft size={16} aria-hidden="true" /> Check something else
          </Link>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Step 03 / what we found</p>
              <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">What we found</h1>
            </div>
            <span className="mono-ref text-xs font-bold text-ink-faint">Case {id}</span>
          </div>

          {/* ── 1. The verdict ───────────────────────────────────────────── */}
          <section className={`panel mt-7 border p-6 sm:p-8 ${view.tone}`} aria-labelledby="verdict-heading">
            <div className="grid gap-7 lg:grid-cols-[1.5fr_1fr] lg:items-start">
              <div>
                <div className="flex items-center gap-2.5">
                  <IconAlert size={20} className={view.accent} aria-hidden="true" />
                  <p className={`font-mono text-[11px] font-bold uppercase tracking-[.14em] ${view.accent}`}>{view.label}</p>
                </div>
                <h2 id="verdict-heading" className="mt-3 text-2xl font-bold tracking-[-.03em] text-ink sm:text-[1.75rem]">
                  {dna.patternName ?? "Unrecognised cyber incident"}
                </h2>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-7 text-ink-soft">{view.meaning}</p>
              </div>

              <div className="rounded-[3px] border border-line bg-paper p-4">
                {dna.risk === "unclear" ? (
                  <>
                    <p className="text-xs font-bold text-ink">No script matched</p>
                    <p className="mt-2 text-xs leading-5 text-ink-soft">We are telling you this instead of guessing. A missing match is not a clean bill of health.</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-bold text-ink">Pattern match</p>
                      <p className={`mono-ref text-lg font-bold ${view.accent}`}>{Math.round(dna.confidence * 100)}%</p>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-line" role="img" aria-label={`Pattern match confidence ${Math.round(dna.confidence * 100)} percent`}>
                      <div className={`h-full rounded-full ${dna.risk === "high" ? "bg-danger" : "bg-warning"}`} style={{ width: `${Math.max(Math.round(dna.confidence * 100), 4)}%` }} />
                    </div>
                  </>
                )}
                <p className="mt-3.5 border-t border-line pt-3 text-[11px] leading-5 text-ink-faint">
                  Raksha pattern corpus, compiled from public advisories. A pattern match is a warning, not proof of identity, guilt, or safety.
                </p>
              </div>
            </div>
          </section>

          {/* ── 2. Said once, at the point of highest shame ───────────────── */}
          <section className="notice notice-service mt-4 p-5 sm:p-6">
            <div className="flex gap-3.5">
              <IconGuide size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" />
              <div>
                <p className="text-[15px] font-bold text-ink">This is not your fault.</p>
                <p className="mt-2 max-w-[72ch] text-sm leading-6 text-ink-soft">{notYourFault}</p>
              </div>
            </div>
          </section>

          {/* ── 3. The one urgent action, before anything administrative ──── */}
          <section className="panel mt-4 border-danger/40 p-6 sm:p-7" aria-labelledby="do-now-heading">
            <div className="grid gap-6 lg:grid-cols-[1.5fr_auto] lg:items-center">
              <div>
                <p className="kicker text-danger">Do this now</p>
                <h2 id="do-now-heading" className="mt-3 text-xl font-bold leading-8 text-ink sm:text-2xl">{firstAction.do}</h2>
                <p className="mt-2.5 max-w-[60ch] text-sm leading-6 text-ink-soft">{firstAction.why}</p>
              </div>
              {moneyAtRisk && (
                <div className="lg:text-right">
                  <a href="tel:1930" className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[3px] bg-danger px-7 text-base font-bold text-white hover:bg-[#a02020] lg:w-auto">
                    <IconEmergency size={19} aria-hidden="true" /> Call 1930
                  </a>
                  <p className="mt-2.5 max-w-[26ch] text-[11px] leading-5 text-ink-faint lg:ml-auto">Answered 24 hours. Reporting sooner gives the bank more chance to freeze the money.</p>
                </div>
              )}
            </div>
          </section>

          {/* ── 4. The containment router ─────────────────────────────────── */}
          <section className="panel mt-4 p-6 sm:p-7" aria-labelledby="already-heading">
            <p className="kicker">Next step</p>
            <h2 id="already-heading" className="mt-3 text-xl font-bold text-ink">Has any of this already happened?</h2>
            <p className="mt-2.5 max-w-[62ch] text-sm leading-6 text-ink-soft">
              Pick the closest one. It decides what we put in front of you next, containment comes before paperwork.
            </p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {PRIMARY_TRIGGERS.map((item) => (
                <Link
                  key={item.id}
                  href={`/act/${id}?trigger=${item.id}`}
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-[3px] border border-line bg-paper px-4 py-3 text-[15px] font-bold text-ink hover:border-service hover:bg-service-soft"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={17} className="shrink-0 text-service transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4">
              {SECONDARY_TRIGGERS.map((item) => (
                <Link key={item.id} href={`/act/${id}?trigger=${item.id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service">
                  {item.label} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-ink-faint">Not sure? Choose the closest. You can change it later, and nothing is sent anywhere.</p>
          </section>

          {/* ── 5. Evidence and honesty, side by side ─────────────────────── */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="panel p-6" aria-labelledby="why-heading">
              <div className="flex items-center gap-2.5">
                <IconEvidence size={19} className="text-service" aria-hidden="true" />
                <p className="kicker">Evidence</p>
              </div>
              <h2 id="why-heading" className="mt-3 text-lg font-bold text-ink">Why we flagged this</h2>
              <ul className="mt-4 space-y-3">
                {dna.signals.map((signal) => (
                  <li key={signal} className="flex gap-3 text-sm leading-6 text-ink-soft">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dna.risk === "unclear" ? "bg-ink-faint" : "bg-danger"}`} aria-hidden="true" />
                    {signal}
                  </li>
                ))}
              </ul>
              {dna.patternSlug && (
                <Link href={`/atlas/${dna.patternSlug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service hover:text-ink">
                  More about how this script works <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </section>

            <section className="panel p-6" aria-labelledby="unknown-heading">
              <div className="flex items-center gap-2.5">
                <IconRadar size={19} className="text-ink-soft" aria-hidden="true" />
                <p className="kicker text-ink-faint">Limits</p>
              </div>
              <h2 id="unknown-heading" className="mt-3 text-lg font-bold text-ink">What we cannot tell you</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />Who is operating the account or number behind this.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />Whether money already sent can be returned. That depends on how fast the bank acts, and it often cannot be recovered once it has moved on.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />Whether this exact message was sent to others. We match behaviour, not identity.</li>
              </ul>
              <p className="mt-4 border-t border-line pt-3.5 text-xs leading-5 text-ink-faint">
                This environment runs on sample data and transmits nothing to banks, police, or platforms.
              </p>
            </section>
          </div>

          {/* ── 6. What comes next from them ─────────────────────────────── */}
          {dna.nextMove && (
            <section className="notice notice-warning mt-4 p-6 sm:p-7">
              <div className="flex gap-3.5">
                <IconClock size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                <div>
                  <p className="kicker text-warning">What they will try next</p>
                  <p className="mt-3 max-w-[72ch] text-base font-semibold leading-7 text-ink">{dna.nextMove}</p>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">If this is already happening, it is confirmation of the script, not a new problem. Do not pay, and do not share another code.</p>
                </div>
              </div>
            </section>
          )}

          {/* ── 7. Hard rules ────────────────────────────────────────────── */}
          <section className="notice notice-danger mt-4 p-6 sm:p-7">
            <p className="kicker text-danger">Do not do this</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {dna.doNot.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-danger/20 pt-4 text-sm leading-6 text-ink-soft">
              Raksha and the 1930 helpline will never ask you for money, an OTP, a PIN, or to install an app. Nobody who calls offering to recover your funds for a fee is genuine.
            </p>
          </section>

          {/* ── 8. Administrative: confirm what we read ───────────────────── */}
          <section className="panel mt-4 p-6 sm:p-7" aria-labelledby="facts-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="kicker">Your record</p>
                <h2 id="facts-heading" className="mt-3 text-lg font-bold text-ink">Have we understood this correctly?</h2>
                <p className="mt-2.5 max-w-[62ch] text-sm leading-6 text-ink-soft">
                  Correct anything that is wrong. Only what you confirm is used later. If you do not know an answer, leave it, an estimate or a gap is fine.
                </p>
              </div>
              <span className="mono-ref shrink-0 rounded-[3px] bg-service-soft px-2.5 py-1.5 text-[11px] font-bold text-service">
                {confirmedCount} of {facts.length} confirmed
              </span>
            </div>
            <div className="mt-5">
              <FactReview incidentId={id} initialFacts={facts} />
            </div>
          </section>

          {/* ── 9. What happens next ──────────────────────────────────────── */}
          <section className="panel mt-4 p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="kicker">What to expect</p>
                <h2 className="mt-3 text-lg font-bold text-ink">Nothing has been sent yet.</h2>
                <p className="mt-2.5 max-w-[62ch] text-sm leading-6 text-ink-soft">
                  Take as long as you need. When you continue, we assemble your complaint from what you have already given us, you will not be asked the same thing twice.
                  {incident.missingFacts.length > 0 && ` ${incident.missingFacts.length} details are still open and can be added later.`}
                </p>
              </div>
              <Link href={`/report/${id}`} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[3px] bg-service px-6 text-base font-bold text-white hover:bg-[var(--saffron-deep)]">
                Continue to your report <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
