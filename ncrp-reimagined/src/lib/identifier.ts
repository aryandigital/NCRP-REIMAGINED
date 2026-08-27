/**
 * Identifier risk engine.
 *
 * When a user submits a bare identifier, a link, a UPI ID, or a phone number, * keyword pattern matching has nothing to work with. This module applies
 * deterministic phishing/fraud heuristics so identifiers get a real verdict:
 *
 *   URL  → TLD reputation, brand lookalikes, IP hosts, punycode, shorteners,
 *          keyword stuffing, scheme, structure
 *   UPI  → scam-vocabulary handles, random-looking local parts, fresh-bank VPAs
 *   Phone → format validation + honest limits (a number alone can't be proven)
 *
 * The output is a DnaResult-shaped verdict so the result page can render
 * signals, a likely next move, and hard "do not" rules exactly like a
 * message analysis.
 */

import type { DnaResult } from "@/lib/store";

export type IdentifierKind = "url" | "upi" | "phone";

export interface IdentifierVerdict {
  kind: IdentifierKind;
  value: string;
  dna: DnaResult;
}

// ─── Detection ──────────────────────────────────────────────────────────────

const UPI_RE = /^[\w.\-]{2,64}@[a-zA-Z][a-zA-Z0-9]{1,20}$/;
const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const URLISH_RE = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-zA-Z]{2,}(?:[/?#][^\s]*)?$/i;
const IP_HOST_RE = /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/;

export function detectIdentifier(input: string): { kind: IdentifierKind; value: string } | null {
  const value = input.trim();
  if (!value || value.includes(" ") || value.includes("\n")) return null;
  if (/^https?:\/\//i.test(value)) return { kind: "url", value };
  if (UPI_RE.test(value) && !value.split("@")[1]?.includes(".")) return { kind: "upi", value };
  if (PHONE_RE.test(value.replace(/[\s-]/g, "").replace(/^\+91/, "91").replace(/^91(?=\d{10}$)/, ""))) return { kind: "phone", value: value.replace(/[\s-]/g, "") };
  if (URLISH_RE.test(value)) return { kind: "url", value };
  return null;
}

// ─── URL heuristics ─────────────────────────────────────────────────────────

/** TLDs that dominate phishing telemetry in India-focused campaigns. */
const RISKY_TLDS = new Set([
  "xyz", "top", "club", "live", "buzz", "online", "site", "icu", "rest",
  "quest", "cfd", "loan", "click", "link", "work", "support", "cam", "gq",
  "ml", "ga", "cf", "tk", "shop", "monster", "beauty", "hair", "mom",
]);

/** Brands that Indian phishers impersonate constantly. */
const IMPERSONATED_BRANDS: Array<{ token: string; official: RegExp }> = [
  { token: "sbi", official: /(^|\.)onlinesbi\.(com|sbi)$/i },
  { token: "hdfc", official: /(^|\.)hdfcbank\.com$/i },
  { token: "icici", official: /(^|\.)icicibank\.com$/i },
  { token: "axis", official: /(^|\.)axisbank\.(com|co\.in)$/i },
  { token: "kotak", official: /(^|\.)kotak\.com$/i },
  { token: "paytm", official: /(^|\.)paytm\.com$/i },
  { token: "phonepe", official: /(^|\.)phonepe\.com$/i },
  { token: "gpay", official: /(^|\.)pay\.google\.com$/i },
  { token: "googlepay", official: /(^|\.)pay\.google\.com$/i },
  { token: "bhim", official: /(^|\.)bhimupi\.org\.in$/i },
  { token: "npci", official: /(^|\.)npci\.org\.in$/i },
  { token: "upi", official: /(^|\.)npci\.org\.in$/i },
  { token: "rbi", official: /(^|\.)rbi\.org\.in$/i },
  { token: "irctc", official: /(^|\.)irctc\.co\.in$/i },
  { token: "amazon", official: /(^|\.)amazon\.(com|in)$/i },
  { token: "flipkart", official: /(^|\.)flipkart\.com$/i },
  { token: "india-post", official: /(^|\.)indiapost\.gov\.in$/i },
  { token: "indiapost", official: /(^|\.)indiapost\.gov\.in$/i },
  { token: "incometax", official: /(^|\.)incometax\.gov\.in$/i },
  { token: "whatsapp", official: /(^|\.)whatsapp\.com$/i },
  { token: "telegram", official: /(^|\.)telegram\.(org|me)$/i },
  { token: "facebook", official: /(^|\.)facebook\.com$/i },
  { token: "instagram", official: /(^|\.)instagram\.com$/i },
];

/** Words that phishers stuff into hosts and paths to create urgency. */
const SCARE_WORDS = [
  "verify", "verification", "kyc", "update", "secure", "security", "login",
  "signin", "blocked", "block", "suspend", "suspended", "deactivate", "reactivate",
  "refund", "cashback", "reward", "rewards", "prize", "winner", "lucky",
  "helpdesk", "support", "customercare", "care", "alert", "confirm", "validate",
  "unlock", "freeze", "unfreeze", "penalty", "challan", "echallan",
];

const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "rb.gy", "is.gd",
  "shorturl.at", "rebrand.ly", "ow.ly", "buff.ly", "t.ly", "s.id", "linktr.ee",
]);

function analyzeUrl(raw: string): IdentifierVerdict {
  const signals: string[] = [];
  let score = 0;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return {
      kind: "url",
      value: raw,
      dna: verdictDna("url", raw, 0.4, ["This link is malformed, a hallmark of obfuscated phishing URLs."]),
    };
  }

  const host = url.hostname.toLowerCase();
  const fullPath = `${host}${url.pathname}${url.search}`.toLowerCase();
  const tld = host.split(".").pop() ?? "";
  const registered = host.split(".").slice(-2).join(".");

  if (IP_HOST_RE.test(host)) {
    score += 0.45;
    signals.push("The link points to a raw server address instead of a real domain name, legitimate banks and services never do this.");
  }

  if (host.startsWith("xn--") || host.includes(".xn--")) {
    score += 0.4;
    signals.push("The address uses punycode encoding, a trick used to mimic real brand names with look-alike characters.");
  }

  if (RISKY_TLDS.has(tld)) {
    score += 0.25;
    signals.push(`It ends in ".${tld}", an extension heavily used in phishing campaigns because it is cheap and disposable.`);
  }

  const brandHit = IMPERSONATED_BRANDS.find((b) => fullPath.includes(b.token));
  if (brandHit && !brandHit.official.test(host)) {
    score += 0.5;
    signals.push(`It references "${brandHit.token}" but is NOT hosted on the official domain, a classic look-alike domain attack.`);
  }

  const scareHits = SCARE_WORDS.filter((w) => fullPath.includes(w));
  if (scareHits.length > 0) {
    score += Math.min(0.15 * scareHits.length, 0.35);
    signals.push(`The address is stuffed with urgency words (${[...new Set(scareHits)].slice(0, 3).join(", ")}) designed to make you act without thinking.`);
  }

  if (SHORTENERS.has(host) || SHORTENERS.has(registered)) {
    score += 0.3;
    signals.push("It hides behind a URL shortener, so you cannot see the real destination before clicking.");
  }

  if (url.protocol === "http:") {
    score += 0.15;
    signals.push("It uses plain HTTP without encryption, no legitimate payment or banking page does this.");
  }

  const subdomainCount = host.split(".").length - 2;
  if (subdomainCount >= 3) {
    score += 0.2;
    signals.push("The address chains many sub-domains to bury the real destination at the end.");
  }

  const hyphenCount = (host.match(/-/g) ?? []).length;
  if (hyphenCount >= 3) {
    score += 0.1;
    signals.push("The domain name is padded with hyphens, a common look-alike pattern.");
  }

  if (raw.length > 100) {
    score += 0.1;
    signals.push("The link is unusually long, often used to hide malicious parameters.");
  }

  if (raw.includes("@")) {
    score += 0.2;
    signals.push("It contains an \"@\" symbol, browsers ignore everything before it, so the visible address is fake.");
  }

  if (signals.length === 0) {
    signals.push("No obvious phishing markers were detected. That is not proof of safety, verify the sender through an official channel before opening it.");
  }

  const confidence = Math.min(0.35 + score, 0.97);
  return { kind: "url", value: raw, dna: verdictDna("url", raw, score > 0 ? confidence : 0.1, signals, score) };
}

// ─── UPI heuristics ─────────────────────────────────────────────────────────

const UPI_SCARE_WORDS = [
  "refund", "cashback", "reward", "kyc", "help", "support", "verify",
  "offer", "win", "winner", "prize", "lucky", "bonus", "claim", "free",
  "care", "desk", "service", "alert",
];

/** Banks/wallets that issue VPAs; a handle on an unknown suffix is weaker evidence. */
const KNOWN_UPI_SUFFIXES = new Set([
  "ybl", "okhdfcbank", "okicici", "oksbi", "okaxis", "paytm", "ybl", "axl",
  "upi", "ibl", "axisb", "sbi", "hdfcbank", "icici", "kotak", "fbl", "federal",
  "rbl", "idfcfirst", "yesbank", "apl", "yapl", "rapl", "jio", "airtel",
  "slice", "gobind", "dbs", "citi", "boi", "pnb", "barodampay", "cnrb",
]);

function analyzeUpi(raw: string): IdentifierVerdict {
  const signals: string[] = [];
  let score = 0;
  const [local = "", bank = ""] = raw.toLowerCase().split("@");

  const scareHits = UPI_SCARE_WORDS.filter((w) => local.includes(w));
  if (scareHits.length > 0) {
    score += 0.45;
    signals.push(`The ID is built around "${scareHits[0]}", scam handles pose as refunds, rewards, or helpdesks to make you accept a collect request.`);
  }

  const digitRatio = (local.match(/\d/g) ?? []).length / Math.max(local.length, 1);
  if (digitRatio > 0.6 && local.length >= 8) {
    score += 0.25;
    signals.push("The ID is mostly random digits, typical of throwaway accounts opened for a single fraud run.");
  }

  if (/^[a-z]+\d{4,}$/.test(local) || /\d{5,}/.test(local)) {
    score += 0.15;
    signals.push("The ID looks machine-generated rather than a person's chosen name.");
  }

  if (!KNOWN_UPI_SUFFIXES.has(bank)) {
    score += 0.1;
    signals.push(`The "@${bank}" part is not a commonly recognised bank or wallet handle, treat it as unverified.`);
  }

  if (signals.length === 0) {
    signals.push("The format is valid, but a UPI ID alone cannot prove who owns it, names shown in apps are chosen by the account holder.");
  }

  const confidence = Math.min(0.3 + score, 0.95);
  return { kind: "upi", value: raw, dna: verdictDna("upi", raw, score > 0 ? confidence : 0.15, signals, score) };
}

// ─── Phone heuristics ───────────────────────────────────────────────────────

function analyzePhone(raw: string): IdentifierVerdict {
  const digits = raw.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const signals: string[] = [
    "The number is a valid Indian mobile format, but caller ID is trivially spoofed, the displayed number proves nothing about who is calling.",
  ];
  let score = 0.15;

  if (/^(\d)\1{5,}/.test(digits)) {
    score += 0.3;
    signals.push("The number is an obvious repeating-digit pattern, not a genuine subscriber number.");
  }

  const confidence = Math.min(0.25 + score, 0.9);
  return { kind: "phone", value: raw, dna: verdictDna("phone", raw, confidence, signals, score) };
}

// ─── Verdict shaping ────────────────────────────────────────────────────────

const KIND_LABEL: Record<IdentifierKind, string> = {
  url: "Suspicious link",
  upi: "Suspicious UPI ID",
  phone: "Unverified phone number",
};

const KIND_NEXT_MOVE: Record<IdentifierKind, string> = {
  url: "If you open it, the page will imitate a real bank, payment app, or government portal and ask for your card details, UPI PIN, or an OTP. That is the payload.",
  upi: "The likely next step is a UPI collect request from this ID, or a demand to send a 'small verification amount'. Approving either hands over money.",
  phone: "The caller will escalate urgency, a blocked account, a parcel, a police case, and then ask for an OTP, a screen-share app, or a transfer.",
};

const KIND_DO_NOT: Record<IdentifierKind, string[]> = {
  url: [
    "Do not open the link, even 'just to check'. Some pages trigger actions on load.",
    "Do not enter card details, UPI PIN, passwords, or OTPs on any page it leads to.",
    "Do not forward it to family or group chats, report it instead.",
  ],
  upi: [
    "Do not approve any collect request from this ID, entering your PIN to 'receive' money actually sends it.",
    "Do not send even ₹1 as a 'verification' payment.",
    "Do not assume the display name in your UPI app is the real owner.",
  ],
  phone: [
    "Do not share OTPs, PINs, or card details over a call from this number.",
    "Do not install any app (AnyDesk, TeamViewer, RustDesk) if the caller asks.",
    "Do not call back on numbers sent by SMS, use the official number from the bank's website or card.",
  ],
};

function verdictDna(kind: IdentifierKind, value: string, confidence: number, signals: string[], rawScore = confidence): DnaResult {
  const risk: DnaResult["risk"] = rawScore >= 0.35 ? "high" : rawScore >= 0.15 ? "medium" : "unclear";
  return {
    risk,
    patternSlug: kind === "upi" ? "upi-collect-request" : null,
    patternName: risk === "unclear" ? `Unverified ${kind === "url" ? "link" : kind}` : KIND_LABEL[kind],
    confidence,
    currentStage: null,
    signals,
    nextMove: risk === "unclear" ? null : KIND_NEXT_MOVE[kind],
    doNot: KIND_DO_NOT[kind],
    exactMatches: [{ type: kind, value: value.trim().toLowerCase() }],
    noDatabaseMatch: true,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Analyse a bare identifier. Returns null when the input is not identifier-shaped
 * (i.e. it is a message and should go through pattern analysis instead).
 */
export function analyzeIdentifier(input: string): IdentifierVerdict | null {
  const detected = detectIdentifier(input);
  if (!detected) return null;
  switch (detected.kind) {
    case "url": return analyzeUrl(detected.value);
    case "upi": return analyzeUpi(detected.value);
    case "phone": return analyzePhone(detected.value);
  }
}

/**
 * Merge an identifier verdict with the message-pattern result, keeping whichever
 * carries higher risk so short identifier inputs are never reported as "unclear"
 * when the heuristics fired.
 */
export function mergeWithPatternResult(identifier: IdentifierVerdict, pattern: DnaResult): DnaResult {
  const rank = { high: 2, medium: 1, unclear: 0 } as const;
  const base = rank[identifier.dna.risk] >= rank[pattern.risk] ? identifier.dna : pattern;
  const mergedMatches = [...identifier.dna.exactMatches];
  for (const match of pattern.exactMatches) {
    if (!mergedMatches.some((m) => m.value === match.value)) mergedMatches.push(match);
  }
  return { ...base, exactMatches: mergedMatches.slice(0, 5) };
}
