import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql, eq } from "drizzle-orm";
import { identifierReports } from "@/lib/db/schema";

const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;

let tableReady: Promise<void> | null = null;

async function ensureTable() {
  if (!database) return;
  tableReady ??= database.execute(sql`
    CREATE TABLE IF NOT EXISTS identifier_reports (
      value text PRIMARY KEY,
      type text NOT NULL,
      report_count integer NOT NULL DEFAULT 1,
      first_seen_at timestamptz NOT NULL,
      last_seen_at timestamptz NOT NULL
    )
  `).then(() => undefined).catch((error) => { tableReady = null; throw error; });
  await tableReady;
}

/** Normalise an identifier value for consistent storage and lookup. */
export function normalizeIdentifier(value: string, type: string): string {
  const trimmed = value.trim().toLowerCase();
  if (type === "url") {
    try {
      const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      return (u.hostname + u.pathname).replace(/\/$/, "");
    } catch {
      return trimmed;
    }
  }
  if (type === "phone") {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length > 10 ? digits.slice(-10) : digits;
  }
  return trimmed;
}

/**
 * Upsert a report for each identifier. Silently no-ops when DATABASE_URL
 * is absent so the prototype degrades gracefully.
 */
export async function recordIdentifiers(
  identifiers: Array<{ value: string; type: string }>
): Promise<void> {
  if (!database || identifiers.length === 0) return;
  try {
    await ensureTable();
    const now = new Date();
    for (const { value, type } of identifiers) {
      const normalized = normalizeIdentifier(value, type);
      if (!normalized) continue;
      await database.execute(sql`
        INSERT INTO identifier_reports (value, type, report_count, first_seen_at, last_seen_at)
        VALUES (${normalized}, ${type}, 1, ${now}, ${now})
        ON CONFLICT (value) DO UPDATE
          SET report_count = identifier_reports.report_count + 1,
              last_seen_at = ${now}
      `);
    }
  } catch {
    // Never let telemetry break incident creation.
  }
}

export interface IdentifierLookupResult {
  found: boolean;
  count: number;
  type: string | null;
  firstSeenAt: Date | null;
}

export async function lookupIdentifier(value: string, type: string): Promise<IdentifierLookupResult> {
  const empty: IdentifierLookupResult = { found: false, count: 0, type: null, firstSeenAt: null };
  if (!database) return empty;
  try {
    await ensureTable();
    const normalized = normalizeIdentifier(value, type);
    if (!normalized) return empty;
    const rows = await database.select().from(identifierReports).where(eq(identifierReports.value, normalized)).limit(1);
    if (!rows[0]) return empty;
    return {
      found: true,
      count: rows[0].reportCount,
      type: rows[0].type,
      firstSeenAt: rows[0].firstSeenAt,
    };
  } catch {
    return empty;
  }
}
