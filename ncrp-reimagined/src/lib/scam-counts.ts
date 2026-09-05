import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectIdentifier } from "@/lib/identifier";

const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;
const fallbackPath = process.env.RAKSHA_COUNTS_PATH ?? join(tmpdir(), "raksha-scam-counts.json");

const countsCache = new Map<string, number>();
let cacheLoaded = false;
let tableReady: Promise<void> | null = null;

export function normalizeIdentifier(raw: string): string | null {
  const detected = detectIdentifier(raw.trim());
  if (!detected) return null;
  const v = detected.value.toLowerCase();
  if (detected.kind === "phone") {
    const digits = v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    return `phone:${digits}`;
  }
  if (detected.kind === "upi") return `upi:${v}`;
  return `url:${v.replace(/^https?:\/\//, "")}`;
}

async function ensureTable() {
  if (!database) return;
  tableReady ??= database
    .execute(
      sql`CREATE TABLE IF NOT EXISTS scam_counts (
        identifier text PRIMARY KEY,
        count integer NOT NULL DEFAULT 0,
        last_seen_at timestamptz NOT NULL DEFAULT now()
      )`
    )
    .then(() => undefined);
  await tableReady;
}

async function loadFallback() {
  if (cacheLoaded) return;
  try {
    const contents = await readFile(/* turbopackIgnore: true */ fallbackPath, "utf8");
    const data = JSON.parse(contents) as Record<string, number>;
    for (const [k, v] of Object.entries(data)) countsCache.set(k, v);
  } catch {
    // file doesn't exist yet — created lazily on first write
  }
  cacheLoaded = true;
}

async function saveFallback() {
  const obj: Record<string, number> = {};
  for (const [k, v] of countsCache) obj[k] = v;
  await writeFile(fallbackPath, JSON.stringify(obj, null, 2), "utf8");
}

export async function getCount(normalized: string): Promise<number> {
  if (database) {
    await ensureTable();
    const result = await database.execute(
      sql`SELECT count FROM scam_counts WHERE identifier = ${normalized}`
    );
    const row = result.rows[0] as { count: number } | undefined;
    return row ? Number(row.count) : 0;
  }
  await loadFallback();
  return countsCache.get(normalized) ?? 0;
}

export async function incrementCount(normalized: string): Promise<void> {
  if (database) {
    await ensureTable();
    await database.execute(
      sql`INSERT INTO scam_counts (identifier, count, last_seen_at)
          VALUES (${normalized}, 1, now())
          ON CONFLICT (identifier) DO UPDATE
          SET count = scam_counts.count + 1, last_seen_at = now()`
    );
    return;
  }
  await loadFallback();
  countsCache.set(normalized, (countsCache.get(normalized) ?? 0) + 1);
  await saveFallback();
}
