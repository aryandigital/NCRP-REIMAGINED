import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/dna";
import { createIncident } from "@/lib/store";
import { redact, evidenceIdentifiers, readBoundedBody } from "@/lib/redact";

export async function POST(req: NextRequest) {
  let fd: FormData;
  try { fd = await new Response(await readBoundedBody(req, 32768), { headers: { "Content-Type": req.headers.get("content-type") ?? "" } }).formData(); }
  catch (error) { return NextResponse.json({ error: error instanceof RangeError ? "Input too large" : "Expected form data" }, { status: error instanceof RangeError ? 413 : 400 }); }
  const text = fd.get("text");
  const image = fd.get("image");
  if (image !== null && (!(image instanceof File) || image.size > 0)) {
    return NextResponse.json({ error: "Images are not processed because credentials cannot be filtered safely. Paste the relevant text without personal details." }, { status: 415 });
  }
  if (typeof text !== "string" || !text.trim() || text.length > 6000 || fd.getAll("text").length !== 1 || [...fd.keys()].some((key) => !["text", "image"].includes(key))) {
    return NextResponse.json({ error: "Provide 1 to 6000 characters of text" }, { status: 400 });
  }
  try {
    const { redacted, entities } = redact(text);
    const identifiers = evidenceIdentifiers(entities);
    const dna = await analyzeWithAI(redacted);

    // Inject exact matches from redaction that AI may have missed
    if (identifiers.length > 0) {
      const existing = new Set(dna.exactMatches.map((m) => m.value));
      for (const id of identifiers.slice(0, 5)) {
        if (!existing.has(id.value)) {
          dna.exactMatches.push({ type: id.type, value: id.value });
        }
      }
    }

    // 4. Create incident
    const incident = await createIncident({
      rawText: redacted,
      syntheticOnly: false,
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
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
