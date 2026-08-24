import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI, analyzeLocal } from "@/lib/dna";
import { createIncident } from "@/lib/store";
import { redact, evidenceIdentifiers } from "@/lib/redact";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const rawText = (fd.get("text") as string | null) ?? "";
    const imageFile = fd.get("image") as File | null;

    // 1. Redact PII from text before any processing
    const { redacted, entities } = redact(rawText);
    const identifiers = evidenceIdentifiers(entities);

    // 2. Convert image to base64 if provided
    let imageBase64: string | undefined;
    if (imageFile) {
      const buf = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(buf).toString("base64");
    }

    // 3. Analyse
    const textForAnalysis = redacted || rawText; // use redacted for AI, raw for local
    const dna = await analyzeWithAI(textForAnalysis, imageBase64);

    // Inject exact matches from redaction that AI may have missed
    if (identifiers.length > 0) {
      const existing = new Set(dna.exactMatches.map((m) => m.value));
      for (const id of identifiers) {
        if (!existing.has(id.value)) {
          dna.exactMatches.push({ type: id.type, value: id.value });
        }
      }
    }

    // 4. Create incident
    const incident = await createIncident({
      rawText: (redacted || rawText).slice(0, 2000),
      dna,
      tracks: dna.patternSlug
        ? (["task-scam", "investment-pig-butchering", "upi-collect-request"].includes(dna.patternSlug)
          ? ["money"]
          : dna.patternSlug === "sextortion-image-threat"
          ? ["content", "money", "safety"]
          : dna.patternSlug === "digital-arrest"
          ? ["money", "safety"]
          : ["money"])
        : ["money"],
      extractedFacts: [
        ...(dna.patternName ? [{ field: "Scam type", value: dna.patternName, source: "model" as const, confidence: dna.confidence, confirmationStatus: "unconfirmed" as const }] : []),
        ...dna.exactMatches.slice(0, 3).map((match) => ({ field: match.type, value: match.value, source: "user" as const, confidence: 0.9, confirmationStatus: "unconfirmed" as const })),
      ],
      missingFacts: ["incident date and time", "bank or wallet", "financial amount"],
    });

    return NextResponse.json({ id: incident.id, risk: dna.risk });
  } catch (err) {
    console.error("/api/analyze error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

// GET for the search-param flow from the homepage
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q) {
    return NextResponse.redirect(new URL("/check", req.url));
  }

  const { redacted } = redact(q);
  const dna = analyzeLocal(redacted || q);

  const incident = await createIncident({
    rawText: redacted.slice(0, 500),
    dna,
    tracks: ["money"],
    missingFacts: ["incident date and time", "bank or wallet", "financial amount"],
  });

  return NextResponse.redirect(new URL(`/check/${incident.id}`, req.url));
}
