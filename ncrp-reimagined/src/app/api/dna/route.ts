import { NextRequest, NextResponse } from 'next/server';
import { runScamDNA } from '@/lib/scam-dna';
import { db } from '@/lib/db';
import { incidents } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const maxDuration = 15;

// ---------------------------------------------------------------------------
// POST /api/dna
// Input:  { text: string }  — redacted or raw narrative
// Output: ScamVerdictContract + incidentId (created in DB)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { text?: string };
    const text = body.text?.trim();

    if (!text || text.length < 3) {
      return NextResponse.json({ error: 'text is required.' }, { status: 400 });
    }

    // Run the 8-step DNA pipeline
    const verdict = await runScamDNA(text);

    // Persist incident to DB (if DATABASE_URL is set)
    let incidentId: string | null = null;
    try {
      const [incident] = await db
        .insert(incidents)
        .values({
          redactedNarrative: verdict.redactedNarrative,
          evidence: verdict.entities as unknown as Record<string, unknown>,
          patternSlug: verdict.patternSlug,
          stageId: verdict.currentStageId,
          risk: verdict.risk,
          tracks: verdict.tracks,
          dnaVerdict: verdict as unknown as Record<string, unknown>,
        })
        .returning({ id: incidents.id });
      incidentId = incident.id;
    } catch (dbErr) {
      // DB unavailable (no env var) — still return verdict without persistence
      console.warn('[/api/dna] DB write skipped:', (dbErr as Error).message);
    }

    return NextResponse.json({ ...verdict, incidentId });
  } catch (err) {
    console.error('[/api/dna] error:', err);
    return NextResponse.json({ error: 'DNA analysis failed.' }, { status: 500 });
  }
}
