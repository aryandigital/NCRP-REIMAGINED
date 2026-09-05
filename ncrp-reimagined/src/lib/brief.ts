import type { ShieldAssessment, ShieldSource } from "@/lib/shield";

/**
 * Answers collected from the victim during the confirm phase.
 * NEVER stores OTP/PIN/CVV/Aadhaar values — only yes/no for credential exposure.
 */
export interface VictimAnswers {
  // --- Who they are (collected first so authorities can reach them) ---
  victimName: string | null;           // "Priya Sharma" — for authorities to address them
  callbackNumber: string | null;       // E.164 or local; authorities call this back
  location: string | null;             // city / state — routes to the correct police jurisdiction

  // --- Safety ---
  immediateDanger: boolean | null;     // confined, threatened, told not to leave / hang up

  // --- Financial loss ---
  moneyMoved: boolean | null;
  amountInr: number | null;
  paidAt: string | null;               // ISO — when the transfer happened
  bankOrWallet: string | null;
  utr: string | null;                  // UTR/RRN; never the OTP

  // --- Access compromise ---
  sharedCredentials: boolean | null;   // OTP/PIN/CVV shared, app installed, or screen shared (yes/no only — never the value)

  // --- Suspect ---
  callerNumber: string | null;         // phone or WhatsApp number as shown on screen
  callerClaims: string | null;         // "CBI officer", "SBI customer care"

  // --- Context ---
  reportingForSomeoneElse: boolean;    // child reporting for parent, etc.
}

export type Escalation = "112" | "1930" | "report-suspect" | "none";

export interface IncidentBrief {
  id: string;
  generatedAt: string;
  escalation: Escalation;
  escalationReason: string;
  confirmed: string[];          // victim-verified facts, one line each
  transcriptEvidence: string[]; // quoted phrases + timing, suspect identifiers
  aiAssessment: string[];       // clearly advisory
  readAloud: string;            // script the victim reads to 112/1930 operator
  emailSubject: string;
  emailBody: string;
  vapiBriefing: VapiBriefing;   // structured context for the Vapi agent
}

/**
 * Structured data the Vapi assistant receives as variableValues.
 * Flat strings so the assistant can read them naturally on a call.
 */
export interface VapiBriefing {
  victimLine: string;        // "Victim: Priya Sharma, callback +91-98765-43210, Bengaluru"
  situationLine: string;     // "Probable digital-arrest scam. Money has NOT moved yet."
  suspectLine: string;       // "Caller number: +91-70000-12345, claimed: CBI officer"
  keyFacts: string;          // bullet lines joined with ". "
  recommendation: string;    // "Route to 1930 (CFCFRMS): money has moved."
  fullReadAloud: string;     // the same readAloud script so the agent can speak it verbatim
}

export function emptyAnswers(): VictimAnswers {
  return {
    victimName: null, callbackNumber: null, location: null,
    immediateDanger: null, moneyMoved: null, amountInr: null, paidAt: null,
    bankOrWallet: null, utr: null, sharedCredentials: null,
    callerNumber: null, callerClaims: null, reportingForSomeoneElse: false,
  };
}

/** Danger beats money. Never routes to both 112 and 1930 at once. */
export function decideEscalation(a: VictimAnswers): { escalation: Escalation; reason: string } {
  if (a.immediateDanger === true)
    return { escalation: "112", reason: "You are in immediate danger or being prevented from leaving. 112 is India's unified emergency number." };
  if (a.moneyMoved === true || a.sharedCredentials === true)
    return {
      escalation: "1930",
      reason: a.moneyMoved === true
        ? "Money has moved. 1930 (CFCFRMS) can ask banks to hold the funds; the first hours matter most."
        : "You shared credentials or access. 1930 can help you secure your accounts and log the fraud.",
    };
  if (a.callerNumber)
    return { escalation: "report-suspect", reason: "You provided a suspect number. Consider reporting it; safety, loss and access exposure must be confirmed separately." };
  return { escalation: "none", reason: "No emergency or financial escalation has been confirmed. Check safety, financial loss and access exposure; keep the evidence." };
}

const ist = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });

function fmt(n: number | null) {
  if (n === null) return "[amount not given]";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function buildBrief(input: {
  id: string;
  assessment: ShieldAssessment;
  answers: VictimAnswers;
  startedAt: string;
  endedAt: string;
  redactedTranscript: string;
  source?: ShieldSource;
}): IncidentBrief {
  const { id, assessment: s, answers: a, startedAt, endedAt } = input;
  const { escalation, reason: escalationReason } = decideEscalation(a);
  const sessionLabel = input.source === "simulation" ? "Simulation screening"
    : input.source === "text" ? "Text screening" : "Recording / screening";
  const durationSeconds = (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000;

  // ── Victim-confirmed facts ──────────────────────────────────────────────
  const confirmed: string[] = [];
  if (a.reportingForSomeoneElse) confirmed.push("Reported on behalf of someone else.");

  if (a.victimName) confirmed.push(`Victim name: ${a.victimName}.`);
  if (a.callbackNumber) confirmed.push(`Callback number: ${a.callbackNumber}.`);
  if (a.location) confirmed.push(`Location: ${a.location}.`);

  confirmed.push(
    a.immediateDanger === true  ? "⚠ Victim reports IMMEDIATE DANGER or confinement."
    : a.immediateDanger === false ? "Victim reports no immediate physical danger."
    : "Physical safety: not stated.",
  );
  confirmed.push(
    a.moneyMoved === true
      ? `Money moved: ${fmt(a.amountInr)}${a.paidAt ? ` at ${ist(a.paidAt)}` : ""}${a.bankOrWallet ? ` via ${a.bankOrWallet}` : ""}${a.utr ? `, UTR ${a.utr}` : ""}.`
      : a.moneyMoved === false ? "No money has moved."
      : "Money moved: not stated.",
  );
  confirmed.push(
    a.sharedCredentials === true  ? "Credential or device access exposure reported (specific type and value not recorded)."
    : a.sharedCredentials === false ? "No OTP, PIN, app install or screen share."
    : "Credentials: not stated.",
  );
  if (a.callerNumber)  confirmed.push(`Suspect number: ${a.callerNumber}.`);
  if (a.callerClaims)  confirmed.push(`Caller claimed to be: ${a.callerClaims}.`);

  // ── Transcript evidence ────────────────────────────────────────────────
  const transcriptEvidence: string[] = [
    `${sessionLabel} session from ${ist(startedAt)} to ${ist(endedAt)} IST (${durationSeconds} seconds). These are session times, not confirmed call times.`,
    ...s.markers.map((m) => `Transcript contains: "${m.quote}"`),
  ];

  // ── AI assessment (advisory) ───────────────────────────────────────────
  const aiAssessment: string[] = [
    `Suspected script: ${s.patternName ?? "unknown"}${s.stageId ? ` (stage: ${s.stageId})` : ""}.`,
    `Detection: ${s.method === "model" ? "AI (structured output)" : "keyword match"}; heuristic strength ${Math.round(s.confidence * 100)}/100, not a calibrated probability. Advisory only — not a legal finding.`,
    ...s.markers.map((m, index) => `Interpretation of transcript quote ${index + 1}: ${m.why}`),
  ];

  // ── Read-aloud script ─────────────────────────────────────────────────
  const whoLine = a.victimName
    ? (a.reportingForSomeoneElse
        ? `I am reporting a suspected scam on behalf of ${a.victimName}.`
        : `My name is ${a.victimName}. I am reporting a suspected scam.`)
    : (a.reportingForSomeoneElse
        ? "I am reporting a suspected scam on behalf of someone else."
        : "I am reporting a suspected scam.");

  const readAloud = [
    input.source === "simulation" ? "This is a simulation, not a verified real incident." : "",
    a.immediateDanger === true ? "Immediate danger or confinement has been reported. Emergency help is needed."
      : a.immediateDanger === false ? "No immediate physical danger has been reported."
      : "Physical safety has not been confirmed.",
    whoLine,
    `${sessionLabel} began at ${ist(startedAt)}; the actual call start time is not confirmed.`,
    a.callerNumber ? `Reported suspect number: ${a.callerNumber}.` : "Suspect number has not been provided.",
    a.callerClaims ? `The caller reportedly claimed to be ${a.callerClaims}.` : "The caller's claimed identity has not been provided.",
    s.patternName ? `The screening suggests a possible ${s.patternName} pattern; this is advisory, not a confirmed finding.` : "The screening has not identified a supported scam pattern.",
    a.moneyMoved === true
      ? `A transfer of ${fmt(a.amountInr)} was reported${a.bankOrWallet ? ` via ${a.bankOrWallet}` : ""}${a.utr ? `, UTR ${a.utr}` : ""}.`
      : a.moneyMoved === false ? "No money has moved." : "Whether money moved has not been confirmed.",
    a.sharedCredentials === true ? "Credential or device access exposure was reported; the specific type has not been confirmed."
      : a.sharedCredentials === false ? "No credential or device access exposure was reported."
      : "Credential or device access exposure has not been confirmed.",
    `${a.location ? `Reported location: ${a.location}. ` : ""}${a.callbackNumber ? `Callback number: ${a.callbackNumber}.` : ""}`,
  ].filter(Boolean).join(" ");

  // ── Email ─────────────────────────────────────────────────────────────
  const emailSubject = `${input.source === "simulation" ? "SIMULATION: " : ""}Suspected ${s.patternName ?? "cyber fraud"} screening${a.location ? ` — ${a.location}` : ""} — Raksha ref ${id}`;
  const emailBody = [
    "RAKSHA INCIDENT BRIEF — VICTIM-PREPARED",
    "This brief was prepared by the victim using Raksha (independent hackathon prototype).",
    "It has NOT been submitted to any authority automatically.",
    "",
    "VICTIM-CONFIRMED FACTS",
    ...confirmed.map((l) => `• ${l}`),
    "",
    "TRANSCRIPT EVIDENCE (Recognised identifiers/labelled credentials filtered, not anonymised)",
    ...transcriptEvidence.map((l) => `• ${l}`),
    "",
    "ADVISORY ASSESSMENT (AI — not a legal finding)",
    ...aiAssessment.map((l) => `• ${l}`),
    "",
    `RECOMMENDED CHANNEL: ${escalation === "112" ? "112 (emergency)" : escalation === "1930" ? "1930 (cyber financial fraud)" : escalation === "report-suspect" ? "NCRP Report Suspect / Chakshu" : "none"}`,
    `Reason: ${escalationReason}`,
    "",
    "SCRIPT TO READ TO OPERATOR",
    readAloud,
    "",
    "FILTERED TRANSCRIPT (retained screening window; recognised identifiers/labelled credentials filtered, not anonymised)",
    "----",
    input.redactedTranscript,
  ].join("\n");

  // ── Vapi briefing (structured, for the AI agent on the demo call) ─────
  const victimLine = [
    a.victimName ? `Victim: ${a.victimName}` : "Victim: name not given",
    a.callbackNumber ? `callback ${a.callbackNumber}` : "callback not given",
    a.location ?? "location not given",
  ].join(", ");

  const situationLine = [
    input.source === "simulation" ? "SIMULATION." : "",
    s.patternName ? `Possible ${s.patternName}; advisory only.` : "Scam pattern not established.",
    a.immediateDanger === true ? "⚠ IMMEDIATE DANGER reported." : a.immediateDanger === false ? "No immediate physical danger reported." : "Physical safety not stated.",
    a.moneyMoved === true ? `${fmt(a.amountInr)} transferred${a.bankOrWallet ? ` via ${a.bankOrWallet}` : ""}${a.utr ? `, UTR ${a.utr}` : ""}.` : a.moneyMoved === false ? "No money moved." : "Money moved: not stated.",
    a.sharedCredentials === true ? "Credentials / access exposure reported." : a.sharedCredentials === false ? "No credentials / access exposure reported." : "Credentials / access exposure not stated.",
  ].filter(Boolean).join(" ");

  const suspectLine = [
    a.callerNumber ? `Caller number: ${a.callerNumber}` : "Caller number: not given",
    a.callerClaims ? `claimed: ${a.callerClaims}` : "",
  ].filter(Boolean).join(", ");

  const keyFacts = confirmed.join(" ");
  const recommendation = `${escalation === "112" ? "ROUTE TO 112 (emergency)" : escalation === "1930" ? "ROUTE TO 1930 (CFCFRMS)" : escalation === "report-suspect" ? "File NCRP Report Suspect" : "Confirm safety, loss and access exposure"}. ${escalationReason}`;

  const vapiBriefing: VapiBriefing = {
    victimLine, situationLine, suspectLine, keyFacts, recommendation, fullReadAloud: readAloud,
  };

  return {
    id, generatedAt: new Date().toISOString(), escalation, escalationReason,
    confirmed, transcriptEvidence, aiAssessment, readAloud, emailSubject, emailBody, vapiBriefing,
  };
}
