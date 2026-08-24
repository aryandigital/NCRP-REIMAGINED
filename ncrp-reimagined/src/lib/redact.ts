/**
 * On-ingest PII redaction.
 *
 * Round-1 implementation: deterministic regex + checksum validation, runs in-process.
 * Production path: microsoft/presidio (Python) as a sidecar analyzer/anonymizer service.
 *
 * Rule: raw user text is NEVER persisted and NEVER sent to an LLM.
 * We store `redacted` and the typed `entities` (values kept only where the
 * identifier IS the evidence, e.g. a scammer's UPI ID — see `keepAsEvidence`).
 */

export type PiiType =
  | "aadhaar"
  | "pan"
  | "phone"
  | "upi"
  | "card"
  | "account"
  | "ifsc"
  | "email"
  | "url";

export interface PiiEntity {
  type: PiiType;
  value: string;
  start: number;
  end: number;
  /** Identifiers belonging to the SCAMMER are evidence and are retained. */
  keepAsEvidence: boolean;
}

export interface RedactionResult {
  redacted: string;
  entities: PiiEntity[];
}

/** Identifier classes that describe the attacker, not the victim. */
const EVIDENCE_TYPES: ReadonlySet<PiiType> = new Set(["upi", "url", "phone", "account"]);

const PATTERNS: ReadonlyArray<{ type: PiiType; re: RegExp }> = [
  { type: "aadhaar", re: /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g },
  { type: "pan", re: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
  { type: "ifsc", re: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g },
  { type: "upi", re: /\b[\w.\-]{2,256}@[a-zA-Z]{2,64}\b/g },
  { type: "email", re: /\b[\w.\-+]+@[\w\-]+\.[a-zA-Z]{2,}\b/g },
  { type: "url", re: /\bhttps?:\/\/[^\s<>"')]+/g },
  { type: "card", re: /\b(?:\d[ -]?){13,19}\b/g },
  { type: "phone", re: /(?:\+?91[\s-]?)?\b[6-9]\d{9}\b/g },
  { type: "account", re: /\b\d{11,18}\b/g },
];

/** Luhn check so we don't flag every long number as a card. */
function isLuhnValid(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * A UPI VPA and an email are ambiguous (`name@bank` vs `name@bank.com`).
 * Emails always contain a dot in the domain; VPAs conventionally do not.
 */
function isEmailShaped(value: string): boolean {
  const domain = value.split("@")[1] ?? "";
  return domain.includes(".");
}

export function redact(input: string): RedactionResult {
  const found: PiiEntity[] = [];

  for (const { type, re } of PATTERNS) {
    for (const m of input.matchAll(re)) {
      const value = m[0];
      const start = m.index ?? 0;

      if (type === "card" && !isLuhnValid(value)) continue;
      if (type === "upi" && isEmailShaped(value)) continue;
      if (type === "email" && !isEmailShaped(value)) continue;

      found.push({
        type,
        value,
        start,
        end: start + value.length,
        keepAsEvidence: EVIDENCE_TYPES.has(type),
      });
    }
  }

  // Longest match wins on overlap (an IFSC inside an account string, etc.)
  found.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const entities: PiiEntity[] = [];
  let cursor = -1;
  for (const e of found) {
    if (e.start >= cursor) {
      entities.push(e);
      cursor = e.end;
    }
  }

  let redacted = "";
  let last = 0;
  for (const e of entities) {
    redacted += input.slice(last, e.start) + `[${e.type.toUpperCase()}]`;
    last = e.end;
  }
  redacted += input.slice(last);

  return { redacted, entities };
}

/** Identifiers worth matching against the indicator repository. */
export function evidenceIdentifiers(entities: PiiEntity[]) {
  return entities
    .filter((e) => e.keepAsEvidence)
    .map((e) => ({ type: e.type, value: e.value.trim().toLowerCase() }));
}
