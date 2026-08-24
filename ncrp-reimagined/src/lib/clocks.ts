/**
 * The deadline engine.
 *
 * This is the part of the portal that no existing Indian service gives a citizen:
 * every statutory right they hold has a clock, and each clock has exactly one
 * document that must go out before it expires.
 *
 * LEGAL TEXT MUST BE VERIFIED against the primary source before submission.
 * Every entry carries its `basis` so a reviewer can check it.
 */

export type ClockKind =
  | "RBI_ZERO_LIABILITY"
  | "BANK_SHADOW_REVERSAL"
  | "PLATFORM_TAKEDOWN"
  | "PLATFORM_GRIEVANCE_ACK"
  | "PLATFORM_GRIEVANCE_RESOLUTION"
  | "GAC_APPEAL"
  | "MRM_APPLICATION"
  | "BANKING_OMBUDSMAN";

export type DocumentKind =
  | "BANK_NODAL_LETTER"
  | "SHADOW_REVERSAL_FOLLOWUP"
  | "PLATFORM_TAKEDOWN_NOTICE"
  | "GAC_APPEAL"
  | "MRM_DATASHEET"
  | "OMBUDSMAN_COMPLAINT";

export interface ClockDefinition {
  kind: ClockKind;
  track: "money" | "content";
  label: string;
  /** Shown to the citizen in plain language. */
  why: string;
  duration: number;
  unit: "workingDays" | "calendarDays" | "hours";
  /** Primary source, rendered in the UI so the claim is checkable. */
  basis: string;
  /** The document this clock exists to trigger. */
  triggers?: DocumentKind;
  /** What becomes available once this clock expires unmet. */
  onExpiry?: ClockKind;
}

export const CLOCKS: Record<ClockKind, ClockDefinition> = {
  RBI_ZERO_LIABILITY: {
    kind: "RBI_ZERO_LIABILITY",
    track: "money",
    label: "Zero-liability window",
    why: "Tell your bank in writing within this window and you are not liable for the loss.",
    duration: 3,
    unit: "workingDays",
    basis:
      "RBI circular DBR.No.Leg.BC.78/09.07.005/2017-18, 6 July 2017. This service displays the three-working-day rule for incidents before 1 January 2027. Verify the current rule before formal use.",
    triggers: "BANK_NODAL_LETTER",
    onExpiry: "BANK_SHADOW_REVERSAL",
  },
  BANK_SHADOW_REVERSAL: {
    kind: "BANK_SHADOW_REVERSAL",
    track: "money",
    label: "Bank must credit your account",
    why: "Once notified, the bank must reverse the disputed amount within this period.",
    duration: 10,
    unit: "workingDays",
    basis: "RBI circular 6 July 2017, reversal timeline for zero/limited liability.",
    triggers: "SHADOW_REVERSAL_FOLLOWUP",
    onExpiry: "BANKING_OMBUDSMAN",
  },
  PLATFORM_TAKEDOWN: {
    kind: "PLATFORM_TAKEDOWN",
    track: "content",
    label: "Platform must remove the content",
    why: "The platform is required to take this content down within 24 hours of your complaint.",
    duration: 24,
    unit: "hours",
    basis:
      "IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, Rule 3(2)(b) — removal within 24 hours of a complaint by or on behalf of the individual, for content exposing private areas, nudity, sexual acts, or impersonation including morphed images.",
    triggers: "PLATFORM_TAKEDOWN_NOTICE",
    onExpiry: "GAC_APPEAL",
  },
  PLATFORM_GRIEVANCE_ACK: {
    kind: "PLATFORM_GRIEVANCE_ACK",
    track: "content",
    label: "Grievance Officer must acknowledge",
    why: "The platform's Grievance Officer must acknowledge your complaint within 24 hours.",
    duration: 24,
    unit: "hours",
    basis: "IT Rules 2021, Rule 3(2)(a).",
  },
  PLATFORM_GRIEVANCE_RESOLUTION: {
    kind: "PLATFORM_GRIEVANCE_RESOLUTION",
    track: "content",
    label: "Grievance Officer must resolve",
    why: "The platform must dispose of your complaint within 15 days.",
    duration: 15,
    unit: "calendarDays",
    basis: "IT Rules 2021, Rule 3(2)(a).",
    onExpiry: "GAC_APPEAL",
  },
  GAC_APPEAL: {
    kind: "GAC_APPEAL",
    track: "content",
    label: "Appeal to the Grievance Appellate Committee",
    why: "If the platform refused or ignored you, you can appeal — but only within 30 days.",
    duration: 30,
    unit: "calendarDays",
    basis: "IT Rules 2021, Rule 3A — appeal to GAC (gac.gov.in) within 30 days of the Grievance Officer's decision.",
    triggers: "GAC_APPEAL",
  },
  MRM_APPLICATION: {
    kind: "MRM_APPLICATION",
    track: "money",
    label: "Claim frozen funds",
    why: "If money was traced or frozen, apply for restoration using your 14-digit acknowledgement number.",
    duration: 30,
    unit: "calendarDays",
    basis: "MHA Money Restoration Module (mrm-ncrp.mha.gov.in), operating under CFCFRMS; MHA SOP of January 2026.",
    triggers: "MRM_DATASHEET",
  },
  BANKING_OMBUDSMAN: {
    kind: "BANKING_OMBUDSMAN",
    track: "money",
    label: "Escalate to the Banking Ombudsman",
    why: "If the bank has not resolved it in 30 days, escalate free of cost.",
    duration: 30,
    unit: "calendarDays",
    basis: "RBI Integrated Ombudsman Scheme 2021 — complaint after 30 days of no reply, within one year.",
    triggers: "OMBUDSMAN_COMPLAINT",
  },
};

const MS_HOUR = 3_600_000;
const MS_DAY = 86_400_000;

function isWorkingDay(d: Date): boolean {
  const day = d.getDay();
  return day !== 0 && day !== 6; // Sunday, Saturday. Bank holidays not modelled.
}

export function computeDueAt(def: ClockDefinition, startAt: Date): Date {
  if (def.unit === "hours") return new Date(startAt.getTime() + def.duration * MS_HOUR);
  if (def.unit === "calendarDays") return new Date(startAt.getTime() + def.duration * MS_DAY);

  const due = new Date(startAt.getTime());
  let remaining = def.duration;
  while (remaining > 0) {
    due.setDate(due.getDate() + 1);
    if (isWorkingDay(due)) remaining--;
  }
  return due;
}

export type ClockStatus = "running" | "due_soon" | "expired" | "satisfied";

export function statusOf(dueAt: Date, satisfied: boolean, now = new Date()): ClockStatus {
  if (satisfied) return "satisfied";
  const left = dueAt.getTime() - now.getTime();
  if (left <= 0) return "expired";
  if (left <= 6 * MS_HOUR) return "due_soon";
  return "running";
}

/** Human countdown: "4 hours left", "2 days left", "overdue by 3 hours". */
export function humanRemaining(dueAt: Date, now = new Date()): string {
  const ms = dueAt.getTime() - now.getTime();
  const abs = Math.abs(ms);
  const unit =
    abs >= MS_DAY
      ? `${Math.floor(abs / MS_DAY)} day${Math.floor(abs / MS_DAY) === 1 ? "" : "s"}`
      : abs >= MS_HOUR
        ? `${Math.floor(abs / MS_HOUR)} hour${Math.floor(abs / MS_HOUR) === 1 ? "" : "s"}`
        : `${Math.max(1, Math.floor(abs / 60_000))} minutes`;
  return ms >= 0 ? `${unit} left` : `overdue by ${unit}`;
}
