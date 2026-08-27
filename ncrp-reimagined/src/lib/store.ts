import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { incidents } from "@/lib/db/schema";

export interface ExtractedFact {
  field: string;
  value: string | number | boolean | null;
  source: "user" | "screenshot" | "model";
  confidence: number;
  confirmationStatus: "unconfirmed" | "confirmed" | "corrected" | "missing";
}

export interface ActionPacket {
  recipient: "ncrp" | "bank" | "police";
  status: "draft" | "confirmed" | "submitted" | "acknowledged";
  payload: Record<string, unknown>;
}

export interface RoutingEvent {
  type: string;
  message: string;
  occurredAt: string;
  status: "complete" | "pending" | "recorded";
}

export interface DnaResult {
  risk: "high" | "medium" | "unclear";
  patternSlug: string | null;
  patternName: string | null;
  confidence: number;
  currentStage: string | null;
  signals: string[];
  nextMove: string | null;
  doNot: string[];
  exactMatches: Array<{ type: string; value: string }>;
  noDatabaseMatch: boolean;
}

export interface Incident {
  id: string;
  createdAt: string;
  language: "en" | "hi" | "hinglish";
  rawText: string | null;
  imageDataUrl: string | null;
  dna: DnaResult | null;
  answers: Record<string, boolean>;
  tracks: string[];
  ackNumber: string | null;
  completedActions: string[];
  extractedFacts: ExtractedFact[];
  missingFacts: string[];
  packets: ActionPacket[];
  routingEvents: RoutingEvent[];
  syntheticOnly: boolean;
  userId?: string | null;
}

const memoryStore = new Map<string, Incident>();
const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;
const fallbackPath = process.env.RAKSHA_STORE_PATH ?? join(tmpdir(), "raksha-incidents.json");
let storageReady: Promise<void> | null = null;

function makeId(prefix = "INC") {
  return `${prefix}${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

function makeAckNumber() {
  return `NCRP${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

async function ensureStorage() {
  if (!database) {
    try {
      const contents = await readFile(/* turbopackIgnore: true */ fallbackPath, "utf8");
      const saved = JSON.parse(contents) as Record<string, Incident>;
      memoryStore.clear();
      for (const [id, incident] of Object.entries(saved)) memoryStore.set(id, incident);
    } catch {
      // The fallback file is created lazily after the demo incident is seeded.
    }
    return;
  }
  storageReady ??= database.execute(sql`
    CREATE TABLE IF NOT EXISTS incidents (
      id text PRIMARY KEY,
      created_at timestamptz NOT NULL,
      payload jsonb NOT NULL
    )
  `).then(() => undefined);
  await storageReady;
}

async function persistFallback() {
  if (database) return;
  await writeFile(fallbackPath, JSON.stringify(Object.fromEntries(memoryStore), null, 2), "utf8");
}

function seedDemoIncident(): Incident {
  return {
    id: "DEMO0001",
    createdAt: new Date().toISOString(),
    language: "en",
    rawText: "Hi! We are hiring for part-time hotel-rating jobs. Earn ₹5000-₹15000 per day from home. Please complete 3 simple tasks and get paid. Download our app to start.",
    imageDataUrl: null,
    dna: {
      risk: "high",
      patternSlug: "task-scam",
      patternName: "Task / Part-time Job Scam",
      confidence: 0.96,
      currentStage: "approach",
      signals: [
        "Unsolicited message offering easy daily earnings",
        "Claims hotel-rating or product-review work, a known task-scam cover",
        "Asks you to download an app before any contract or verification",
      ],
      nextMove: "They will send you a few genuinely paid micro-tasks to build trust, then ask you to deposit your own money to unlock higher-paying tasks.",
      doNot: [
        "Do not download the app they send.",
        "Do not deposit any money to activate tasks.",
        "Do not share your bank account or UPI details.",
        "Do not delete this conversation. It is your evidence.",
      ],
      exactMatches: [],
      noDatabaseMatch: false,
    },
    answers: { paid: false },
    tracks: ["money"],
    ackNumber: "NCRPDEMO0001",
    completedActions: [],
    extractedFacts: [
      { field: "Scam type", value: "Task / part-time job scam", source: "model", confidence: 0.96, confirmationStatus: "confirmed" },
      { field: "First contact channel", value: "Messaging app", source: "user", confidence: 0.9, confirmationStatus: "confirmed" },
      { field: "Money already transferred", value: "No", source: "user", confidence: 0.95, confirmationStatus: "confirmed" },
    ],
    missingFacts: ["bank", "transaction amount"],
    packets: [],
    routingEvents: [],
    syntheticOnly: true,
  };
}

export async function createIncident(partial: Partial<Incident> = {}): Promise<Incident> {
  await ensureStorage();
  const incident: Incident = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    language: "en",
    rawText: null,
    imageDataUrl: null,
    dna: null,
    answers: {},
    tracks: [],
    ackNumber: null,
    completedActions: [],
    extractedFacts: [],
    missingFacts: [],
    packets: [],
    routingEvents: [],
    syntheticOnly: true,
    ...partial,
  };
  memoryStore.set(incident.id, incident);
  if (database) {
    await database.insert(incidents).values({ id: incident.id, createdAt: new Date(incident.createdAt), payload: incident }).execute();
  } else {
    await persistFallback();
  }
  return incident;
}

export async function getIncident(id: string): Promise<Incident | undefined> {
  await ensureStorage();
  if (database) {
    const rows = await database.select().from(incidents).where(sql`${incidents.id} = ${id} OR ${incidents.payload}->>'ackNumber' = ${id}`).limit(1);
    if (rows[0]) return rows[0].payload as Incident;
    if (id === "DEMO0001" || id === "NCRPDEMO0001") {
      const demo = seedDemoIncident();
      await database.insert(incidents).values({ id: demo.id, createdAt: new Date(demo.createdAt), payload: demo }).onConflictDoNothing().execute();
      return demo;
    }
    return undefined;
  }
  if (!memoryStore.has("DEMO0001")) {
    memoryStore.set("DEMO0001", seedDemoIncident());
    await persistFallback();
  }
  let incident = memoryStore.get(id);
  if (!incident) {
    incident = Array.from(memoryStore.values()).find(i => i.ackNumber === id);
  }
  return incident;
}

export async function updateIncident(id: string, updates: Partial<Incident>): Promise<Incident | null> {
  const existing = await getIncident(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  memoryStore.set(id, updated);
  if (database) {
    await database.update(incidents).set({ payload: updated, createdAt: new Date(updated.createdAt) }).where(eq(incidents.id, id)).execute();
  } else {
    await persistFallback();
  }
  return updated;
}

export async function getUserIncidents(userId: string): Promise<Incident[]> {
  await ensureStorage();
  if (database) {
    const rows = await database
      .select()
      .from(incidents)
      .where(sql`${incidents.payload}->>'userId' = ${userId}`)
      .execute();
    return rows.map((r) => r.payload as Incident);
  }
  return Array.from(memoryStore.values()).filter(
    (i) => i.userId === userId && !i.syntheticOnly
  );
}

export { makeAckNumber };
