// Scam DNA Pipeline — 8-step behavioral matching engine.
// Step 1: Ingest (handled externally via /api/ingest)
// Step 2: Redact PII (redact.ts)
// Step 3: Extract entities (redact.ts)
// Step 4: Exact match (Safe Browsing, PhishTank, URLhaus)
// Step 5: Behavioral match (in-memory keyword + cosine similarity)
// Step 6: Stage detection
// Step 7: Next-move prediction
// Step 8: Emit ScamVerdictContract

import { redactPII, extractEntities, type ExtractedEntities } from './redact';
import { PATTERNS, type ScamPattern, type ScamStage, type RiskLevel } from './patterns';

// ---------------------------------------------------------------------------
// Verdict contract — output of the pipeline
// ---------------------------------------------------------------------------
export interface ScamVerdictContract {
  risk: RiskLevel;
  patternSlug: string;
  patternName: string;
  confidence: number;
  currentStageId: string;
  currentStageName: string;
  likelyNextMove: string;
  quotedSignals: [string, string, string];
  doNot: string[];
  safeVerification: string;
  entities: ExtractedEntities;
  redactedNarrative: string;
  tracks: string[];
}

// ---------------------------------------------------------------------------
// Exact-match check against URLhaus (public API, no key needed)
// ---------------------------------------------------------------------------
async function checkUrlhaus(url: string): Promise<boolean> {
  try {
    const res = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url)}`,
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json() as { query_status?: string };
    return data.query_status === 'is_urlhaus';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Exact-match check against Google Safe Browsing
// ---------------------------------------------------------------------------
async function checkSafeBrowsing(urls: string[]): Promise<string[]> {
  const key = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!key || urls.length === 0) return [];
  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'ncrp-reimagined', clientVersion: '1.0.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: urls.map(u => ({ url: u })),
          },
        }),
        signal: AbortSignal.timeout(5000),
      }
    );
    const data = await res.json() as { matches?: Array<{ threat: { url: string } }> };
    return data.matches?.map(m => m.threat.url) ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Tokenize: lowercase, strip punctuation, split on whitespace
// ---------------------------------------------------------------------------
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Score a pattern against the redacted narrative using keyword overlap.
// Returns a 0..1 confidence score.
// ---------------------------------------------------------------------------
function scorePattern(tokens: Set<string>, pattern: ScamPattern): number {
  const allSignals = [
    ...pattern.keywordSignals,
    ...pattern.stages.flatMap(s => s.signals),
  ];
  const signalTokens = allSignals.flatMap(s => tokenize(s));
  const signalSet = new Set(signalTokens);

  let hits = 0;
  let total = 0;
  for (const t of signalSet) {
    total++;
    if (tokens.has(t)) hits++;
  }
  if (total === 0) return 0;

  // Boost score for multi-word phrase matches
  let phraseBonus = 0;
  const lowerText = [...tokens].join(' ');
  for (const sig of pattern.keywordSignals) {
    if (lowerText.includes(sig.toLowerCase())) phraseBonus += 0.08;
  }

  return Math.min(1, hits / total + phraseBonus);
}

// ---------------------------------------------------------------------------
// Detect which stage of the matched pattern the victim is in
// ---------------------------------------------------------------------------
function detectStage(tokens: Set<string>, pattern: ScamPattern): ScamStage {
  let bestStage = pattern.stages[0];
  let bestScore = 0;

  for (const stage of pattern.stages) {
    const stageTokens = stage.signals.flatMap(s => tokenize(s));
    let hits = stageTokens.filter(t => tokens.has(t)).length;
    const score = stageTokens.length > 0 ? hits / stageTokens.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestStage = stage;
    }
  }
  return bestStage;
}

// ---------------------------------------------------------------------------
// Extract up to 3 quoted signal phrases from the original text
// ---------------------------------------------------------------------------
function extractQuotedSignals(
  originalText: string,
  pattern: ScamPattern,
  stage: ScamStage
): [string, string, string] {
  const signals: string[] = [];
  const lc = originalText.toLowerCase();

  // Try stage-specific signals first
  for (const sig of stage.signals) {
    const idx = lc.indexOf(sig.toLowerCase());
    if (idx !== -1 && signals.length < 3) {
      const start = Math.max(0, idx - 5);
      const end = Math.min(originalText.length, idx + sig.length + 20);
      signals.push(`"…${originalText.slice(start, end).trim()}…"`);
    }
  }

  // Fill remaining slots with pattern-level signals
  for (const sig of pattern.keywordSignals) {
    if (signals.length >= 3) break;
    const idx = lc.indexOf(sig.toLowerCase());
    if (idx !== -1) {
      const start = Math.max(0, idx - 5);
      const end = Math.min(originalText.length, idx + sig.length + 20);
      signals.push(`"…${originalText.slice(start, end).trim()}…"`);
    }
  }

  // Pad to exactly 3
  while (signals.length < 3) {
    signals.push(`"${stage.signals[signals.length % stage.signals.length] ?? pattern.keywordSignals[0] ?? 'Suspicious language detected'}"`);
  }

  return [signals[0], signals[1], signals[2]];
}

// ---------------------------------------------------------------------------
// Main DNA pipeline entry point
// ---------------------------------------------------------------------------
export async function runScamDNA(rawInput: string): Promise<ScamVerdictContract> {
  // Step 2: Extract entities (before redaction to preserve values)
  const entities = extractEntities(rawInput);

  // Step 3: Redact PII
  const redactedNarrative = redactPII(rawInput);

  // Tokenize redacted narrative for matching
  const tokens = new Set(tokenize(redactedNarrative));

  // Step 4: Exact-match checks (run in parallel, non-blocking)
  const [safeBrowsingHits, urlhausResults] = await Promise.all([
    checkSafeBrowsing(entities.urls),
    Promise.all(entities.urls.map(u => checkUrlhaus(u))),
  ]);

  const knownMaliciousUrls = [
    ...safeBrowsingHits,
    ...entities.urls.filter((_, i) => urlhausResults[i]),
  ];

  // Step 5: Behavioral pattern matching (in-memory, <5ms)
  const scored = PATTERNS.map(p => ({
    pattern: p,
    score: scorePattern(tokens, p),
  })).sort((a, b) => b.score - a.score);

  const topMatch = scored[0];
  const confidence = topMatch.score;

  // Determine risk level
  let risk: RiskLevel;
  if (knownMaliciousUrls.length > 0 || confidence > 0.35) {
    risk = 'HIGH';
  } else if (confidence > 0.15) {
    risk = 'MEDIUM';
  } else {
    risk = 'UNCLEAR';
  }

  // Boost to HIGH if exact-match blacklist hit
  if (knownMaliciousUrls.length > 0) risk = 'HIGH';

  const pattern = topMatch.pattern;

  // Step 6: Stage detection
  const stage = detectStage(tokens, pattern);

  // Step 7: Next-move prediction
  const likelyNextMove = stage.nextMove;

  // Step 8: Emit verdict contract
  const quotedSignals = extractQuotedSignals(rawInput, pattern, stage);

  return {
    risk,
    patternSlug: pattern.slug,
    patternName: pattern.name,
    confidence: Math.round(confidence * 100) / 100,
    currentStageId: stage.id,
    currentStageName: stage.name,
    likelyNextMove,
    quotedSignals,
    doNot: pattern.doNot,
    safeVerification: pattern.safeVerification,
    entities,
    redactedNarrative,
    tracks: pattern.tracks,
  };
}
