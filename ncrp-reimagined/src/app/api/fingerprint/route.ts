import { NextRequest, NextResponse } from "next/server";
import { createIncident } from "@/lib/store";

/**
 * Registers a locally-computed perceptual image fingerprint.
 *
 * The image itself NEVER leaves the user's device — the browser computes the
 * fingerprint with blockhash and only the fingerprint string is submitted.
 * Registering it opens an incident on the content-protection track so the user
 * lands on the sextortion playbook instead of a dead end.
 */
export async function POST(req: NextRequest) {
  try {
    const { fingerprint } = (await req.json()) as { fingerprint?: string };

    if (!fingerprint || !/^[0-9a-f]{16,128}$/i.test(fingerprint)) {
      return NextResponse.json({ error: "A valid fingerprint is required" }, { status: 400 });
    }

    const incident = await createIncident({
      rawText: null,
      dna: {
        risk: "high",
        patternSlug: "sextortion-image-threat",
        patternName: "Private image protection",
        confidence: 0.9,
        currentStage: null,
        signals: [
          "You protected a private photo on this device.",
          "The photo itself was never uploaded — only its unique code was registered.",
          "If anyone threatens to share this photo, this code is your proof and your shield.",
        ],
        nextMove: "If someone threatens to publish this image, they will demand money or more images. Paying once guarantees another demand.",
        doNot: [
          "Do not pay or negotiate with anyone threatening to share your images.",
          "Do not delete the threatening messages — they are your evidence.",
          "Do not share more images, no matter what is promised.",
        ],
        exactMatches: [{ type: "fingerprint", value: fingerprint }],
        noDatabaseMatch: false,
      },
      tracks: ["content", "safety"],
      extractedFacts: [
        { field: "Photo fingerprint", value: fingerprint, source: "user" as const, confidence: 1, confirmationStatus: "confirmed" as const },
      ],
      missingFacts: ["platform where threat was received", "threat sender handle or number"],
      routingEvents: [
        {
          type: "fingerprint-registered",
          message: "On-device image fingerprint registered to this incident.",
          occurredAt: new Date().toISOString(),
          status: "complete",
        },
      ],
    });

    return NextResponse.json({ id: incident.id });
  } catch (err) {
    console.error("/api/fingerprint error:", err);
    return NextResponse.json({ error: "Fingerprint registration failed" }, { status: 500 });
  }
}
