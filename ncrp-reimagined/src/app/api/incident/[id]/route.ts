import { NextRequest, NextResponse } from 'next/server';
import { db, incidents } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// GET /api/incident/[id]
// Returns the full incident record by UUID — used by all downstream stages
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const [incident] = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, id))
      .limit(1);

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (err) {
    console.error('[/api/incident/[id]] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch incident.' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/incident/[id]
// Update incident fields (triage answers, active tracks, etc.)
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const body = await req.json() as Partial<{
      answers: Record<string, unknown>;
      tracks: string[];
      stageId: string;
      risk: string;
    }>;

    const [updated] = await db
      .update(incidents)
      .set(body)
      .where(eq(incidents.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Incident not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[/api/incident/[id]] PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update incident.' }, { status: 500 });
  }
}
