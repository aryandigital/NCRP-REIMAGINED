/**
 * On-ingest PII redaction.
 *
 * Round-1 implementation: deterministic regex + checksum validation, runs in-process.
 * Production path: microsoft/presidio (Python) as a sidecar analyzer/anonymizer service.
 *
 * Deterministic filtering is not a guarantee of anonymisation. Structured
 * incident briefs intentionally contain personal details; credentials do not.
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

const CREDENTIAL_LABEL = String.raw`(?:\b(?:otp|(?:one[ -]?time|verification|security)\s+(?:password|code)|(?:upi\s*|atm\s*)?pin|cvv|cvc|password|passwd|pwd|passcode)\b|ओटीपी|पिन|पासवर्ड)(?:\s+(?:code|number|value))?`;
const CREDENTIAL_KEY = /^(?:(?:upi|atm)?pin|otp|cvv|cvc|(?:current|new|old)?password|passwd|pwd|passcode|onetimepassword|verificationcode|securitycode)(?:value|number|code)?$/i;
const credentialKey = (key: string) => CREDENTIAL_KEY.test(key.replace(/[\s_-]/g, ""));
const CREDENTIAL_PROSE = /^(?:not|never|no|none|unknown|missing|shared|sharing|exposure|compromised|requested|required|needed|safe|secure|or|and|with|to|from|for|was|is|has|have|should|must|will|can|may)[.,;!?]?$/i;

/** Filter labelled credentials before deriving any entity/evidence side channel. */
export function stripCredentials(input: string): string {
  return input
    .replace(/\bhttps?:\/\/[^\s<>"')]+/gi, (value) => {
      try {
        const url = new URL(value);
        // Query strings, fragments and userinfo may contain credentials/tokens.
        return `${url.origin}${url.pathname}`;
      } catch { return "[URL]"; }
    })
    .replace(new RegExp(`(${CREDENTIAL_LABEL})["']?\\s*(?:(?:is|was|hai|है)\\s*)?[:=\\-]?\\s*["']?([0-9०-९](?:[ \\-]?[0-9०-९]){2,})["']?(?=$|\\s|[.,;!?](?:\\s|$))`, "gi"), "$1 [CREDENTIAL]")
    .replace(new RegExp(`(${CREDENTIAL_LABEL})\\s+((?=[^\\s<>]*[0-9०-९])[^\\s<>]+)`, "gi"), "$1 [CREDENTIAL]")
    .replace(new RegExp(`(${CREDENTIAL_LABEL})["']?\\s*(?:(?:is|was|hai|है)\\s*)?[:=\\-]\\s*(?:"[^"\\r\\n]*"|'[^'\\r\\n]*'|[^\\s<>]+)`, "gi"), "$1 [CREDENTIAL]")
    .replace(new RegExp(`(${CREDENTIAL_LABEL})\\s+(?:is|was|hai|है)\\s+("[^"\\r\\n]*"|'[^'\\r\\n]*'|[^\\s<>]+)`, "gi"), (match, label: string, value: string) => CREDENTIAL_PROSE.test(value) ? match : `${label} [CREDENTIAL]`)
    .replace(/\b(password|passwd|pwd|passcode)\s+(?!\[)("[^"\r\n]*"|'[^'\r\n]*'|[^\s<>]+)/gi, (match, label: string, value: string) => CREDENTIAL_PROSE.test(value) ? match : `${label} [CREDENTIAL]`);
}

/** Retains intended contact/evidence fields, but removes credentials at any depth. */
export function sanitizeCredentials<T>(value: T): T {
  if (typeof value === "string") return stripCredentials(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeCredentials(item)) as T;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    const sensitiveFact = [object.field, object.type].some((field) => typeof field === "string" && new RegExp(CREDENTIAL_LABEL, "i").test(field));
    return Object.fromEntries(Object.entries(object)
      .filter(([key]) => !["__proto__", "prototype", "constructor"].includes(key))
      .map(([key, item]) => [stripCredentials(key),
        (credentialKey(key) || (key === "value" && sensitiveFact)) && item !== null && typeof item !== "boolean"
          ? "[CREDENTIAL]" : sanitizeCredentials(item)])) as T;
  }
  return value;
}

/** Bound ingestion before parsing, including chunked bodies with no Content-Length. */
export async function readBoundedBody(request: Request, maxBytes: number): Promise<ArrayBuffer> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new RangeError("Input too large");
  const reader = request.body?.getReader();
  if (!reader) return new ArrayBuffer(0);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => undefined);
        throw new RangeError("Input too large");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body.buffer;
}

export interface PiiEntity {
  type: PiiType;
  value: string;
  start: number;
  end: number;
  /** Candidate evidence; callers must establish ownership before attribution. */
  keepAsEvidence: boolean;
}

export interface RedactionResult {
  redacted: string;
  entities: PiiEntity[];
}

/** Candidate evidence only: a regex cannot establish who owns an identifier. */
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
  input = stripCredentials(input);
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
