/**
 * Scam DNA analysis engine.
 *
 * Two paths:
 * 1. If OPENAI_API_KEY is set → real extraction + pattern matching via embeddings
 * 2. Otherwise → fast keyword/signal matching from the patterns corpus (always works in demo)
 */

import { PATTERNS, type ScamPattern, type ScamStage } from "@/data/patterns";
import type { DnaResult } from "@/lib/store";

// ─── Keyword-based local matching (no API key needed) ─────────────────────

function scorePattern(text: string, pattern: ScamPattern): { stage: ScamStage | null; score: number } {
  const lower = text.toLowerCase();
  let bestStage: ScamStage | null = null;
  let bestScore = 0;

  for (const stage of pattern.stages) {
    let hits = 0;
    for (const signal of stage.signals) {
      const words = signal.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matched = words.filter((w) => lower.includes(w)).length;
      hits += matched / Math.max(words.length, 1);
    }
    const score = hits / stage.signals.length;
    if (score > bestScore) {
      bestScore = score;
      bestStage = stage;
    }
  }

  return { stage: bestStage, score: bestScore };
}

function extractSignals(text: string, pattern: ScamPattern, stage: ScamStage): string[] {
  // Return signals whose keywords actually appear in the text
  return stage.signals
    .filter((signal) => {
      const words = signal.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      return words.some((w) => text.toLowerCase().includes(w));
    })
    .slice(0, 3);
}

function extractIdentifiers(text: string): DnaResult["exactMatches"] {
  const matches: DnaResult["exactMatches"] = [];
  const upiRe = /[\w.\-]{2,64}@[a-zA-Z]{2,20}/g;
  const phoneRe = /(?:\+?91[\s-]?)?\b[6-9]\d{9}\b/g;
  const urlRe = /https?:\/\/[^\s<>"']+/g;

  for (const m of text.matchAll(upiRe)) matches.push({ type: "upi", value: m[0] });
  for (const m of text.matchAll(phoneRe)) matches.push({ type: "phone", value: m[0] });
  for (const m of text.matchAll(urlRe)) matches.push({ type: "url", value: m[0] });

  return matches.slice(0, 5);
}

export function analyzeLocal(text: string): DnaResult {
  const matches = extractIdentifiers(text);

  let topPattern: ScamPattern | null = null;
  let topStage: ScamStage | null = null;
  let topScore = 0;

  for (const pattern of PATTERNS) {
    const { stage, score } = scorePattern(text, pattern);
    if (score > topScore) {
      topScore = score;
      topPattern = pattern;
      topStage = stage;
    }
  }

  // Need a minimum confidence to name the pattern
  if (topScore < 0.08 || !topPattern || !topStage) {
    return {
      risk: "unclear",
      patternSlug: null,
      patternName: null,
      confidence: topScore,
      currentStage: null,
      signals: [],
      nextMove: null,
      doNot: [
        "Do not send any money or share personal details until you have verified independently.",
        "Do not click links sent to you by this contact.",
      ],
      exactMatches: matches,
      noDatabaseMatch: true,
    };
  }

  const signals = extractSignals(text, topPattern, topStage);
  const risk = topScore > 0.35 ? "high" : topScore > 0.15 ? "medium" : "unclear";

  return {
    risk,
    patternSlug: topPattern.slug,
    patternName: topPattern.name,
    confidence: Math.min(topScore * 2.2, 0.98),
    currentStage: topStage.id,
    signals: signals.length ? signals : topStage.signals.slice(0, 3),
    nextMove: topPattern.nextMove[topStage.id] ?? null,
    doNot: topPattern.doNot,
    exactMatches: matches,
    noDatabaseMatch: false,
  };
}

// ─── OpenAI-powered analysis (when key is available) ──────────────────────

const SYSTEM_PROMPT = `You are a cyber-crime pattern analyst. Given text (and optionally an image),
identify which scam script the victim is encountering from the pattern library, which stage they are at,
and what the attacker will ask for next.

Pattern library (slugs):
- task-scam: job offer → micro tasks → prepaid task → fake balance → withdrawal blocked → unlocking fee
- digital-arrest: parcel / case allegation → transferred to 'police' → isolation → verification transfer
- investment-pig-butchering: grooming → demo gain → scale-up → exit block
- upi-collect-request: refund pretext → collect request → PIN entry
- sextortion-image-threat: friendly contact → recording made → threat to publish → payment demanded

Respond ONLY with this JSON:
{
  "patternSlug": string | null,
  "stageId": string | null,
  "confidence": number,   // 0-1
  "signals": string[],    // 3 quotes from the user's own text
  "nextMove": string | null,
  "doNot": string[],
  "riskReason": string
}`;

export async function analyzeWithAI(text: string, imageBase64?: string): Promise<DnaResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return analyzeLocal(text);

  const matches = extractIdentifiers(text);

  type ContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } };

  const userContent: ContentPart[] = [{ type: "text", text: `Analyze this:\n\n${text}` }];
  if (imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    if (!res.ok) return analyzeLocal(text);
    const json = await res.json() as { choices: Array<{ message: { content: string } }> };
    const raw = JSON.parse(json.choices[0].message.content) as {
      patternSlug?: string | null;
      stageId?: string | null;
      confidence?: number;
      signals?: string[];
      nextMove?: string | null;
      doNot?: string[];
      riskReason?: string;
    };

    const pattern = raw.patternSlug ? PATTERNS.find((p) => p.slug === raw.patternSlug) ?? null : null;
    const confidence = raw.confidence ?? 0;
    const risk: DnaResult["risk"] = confidence > 0.6 ? "high" : confidence > 0.35 ? "medium" : "unclear";

    return {
      risk,
      patternSlug: raw.patternSlug ?? null,
      patternName: pattern?.name ?? null,
      confidence,
      currentStage: raw.stageId ?? null,
      signals: raw.signals ?? [],
      nextMove: raw.nextMove ?? null,
      doNot: raw.doNot ?? (pattern?.doNot ?? []),
      exactMatches: matches,
      noDatabaseMatch: !raw.patternSlug,
    };
  } catch {
    return analyzeLocal(text);
  }
}
