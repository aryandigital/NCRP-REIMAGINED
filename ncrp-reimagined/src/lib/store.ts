import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { incidents } from "@/lib/db/schema";
import { redact, sanitizeCredentials } from "@/lib/redact";

export interface ExtractedFact {
  field: string;
  value: string | number | boolean | null;
  source: "user" | "screenshot" | "model";
  confidence: number;
  confirmationStatus: "unconfirmed" | "confirmed" | "corrected" | "missing";
}

export interface ActionPacket {
  recipient: "ncrp" | "bank" | "police";
  status: "draft" | "confirmed" | "prepared_locally";
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
  occurredAt: string | null;
  origin: "intake" | "call-shield" | "demo";
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
  shield: {
    source?: "mic" | "simulation" | "text";
    transcript: string;
    assessment: import("@/lib/shield").ShieldAssessment;
    startedAt: string;
    endedAt: string;
    answers: import("@/lib/brief").VictimAnswers | null;
    brief: import("@/lib/brief").IncidentBrief | null;
    alerts: Array<{
      kind: "vapi-demo" | "mailto" | "tel";
      to: string;
      at: string;
      status: "simulated" | "opened" | "failed" | "requested";
      detail?: string;
    }>;
  } | null;
}

const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;
const fallbackPath = process.env.RAKSHA_STORE_PATH ?? join(tmpdir(), "raksha-incidents.json");
type StoreState = { memory: Map<string, Incident>; ready: Promise<void> | null; tail: Promise<unknown> };
const processState = globalThis as typeof globalThis & { rakshaStores?: Map<string, StoreState> };
const stores = processState.rakshaStores ??= new Map();
const storeKey = databaseUrl ?? fallbackPath;
if (!stores.has(storeKey)) stores.set(storeKey, { memory: new Map(), ready: null, tail: Promise.resolve() });
const state = stores.get(storeKey)!;
const memoryStore = state.memory;
// Only serialises this process. Shared files / multiple app instances need a
// transactional store. IDs are not auth: real-data ownership is a deployment blocker.

function transaction<T>(operation: () => Promise<T>): Promise<T> {
  const result = state.tail.then(operation);
  state.tail = result.catch(() => undefined);
  return result;
}

export function isIncidentId(id: string): boolean {
  return /^(?:INC(?:[A-F0-9]{10}|[A-F0-9]{32})|DEMO0001)$/.test(id);
}

function makeId(prefix = "INC") {
  return `${prefix}${crypto.randomUUID().replace(/-/g, "").toUpperCase()}`;
}

function makeAckNumber() {
  return `RAKSHA-SIM-${crypto.randomUUID().replace(/-/g, "").toUpperCase()}`;
}

async function ensureStorage() {
  if (!database) {
    state.ready ??= (async () => {
      try {
        const contents = await readFile(/* turbopackIgnore: true */ fallbackPath, "utf8");
        const saved = JSON.parse(contents) as Record<string, Incident>;
        if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw new Error("Invalid store");
        const loaded = new Map(Object.entries(saved)
          .filter(([id, incident]) => id !== "DEMO0001" && isIncidentId(id) && incident?.id === id)
          .map(([id, incident]) => [id, cleanIncident(incident)]));
        memoryStore.clear();
        for (const [id, incident] of loaded) memoryStore.set(id, incident);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    })().catch((error) => { state.ready = null; throw error; });
    await state.ready;
    return;
  }
  state.ready ??= database.execute(sql`
    CREATE TABLE IF NOT EXISTS incidents (
      id text PRIMARY KEY,
      created_at timestamptz NOT NULL,
      payload jsonb NOT NULL
    )
  `).then(() => undefined).catch((error) => { state.ready = null; throw error; });
  await state.ready;
}

async function persist(incident: Incident, create: boolean) {
  if (database) {
    if (create) await database.insert(incidents).values({ id: incident.id, createdAt: new Date(incident.createdAt), payload: incident }).execute();
    else await database.update(incidents).set({ payload: incident }).where(eq(incidents.id, incident.id)).execute();
    return;
  }
  const snapshot = new Map(memoryStore).set(incident.id, incident);
  const temporaryPath = `${fallbackPath}.${crypto.randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, JSON.stringify(Object.fromEntries(snapshot), null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" });
    await rename(temporaryPath, fallbackPath);
    memoryStore.set(incident.id, incident);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

function cleanIncident(input: Incident): Incident {
  const incident = sanitizeCredentials(input);
  if (incident.rawText) incident.rawText = redact(incident.rawText).redacted;
  if (incident.shield) incident.shield.transcript = redact(incident.shield.transcript).redacted;
  incident.syntheticOnly = incident.syntheticOnly === true && (incident.origin === "demo" || incident.shield?.source === "simulation");
  if (incident.shield) incident.shield.alerts = incident.shield.alerts.map((alert) => alert.kind === "vapi-demo" ? {
    ...alert, status: alert.status === "failed" ? "failed" : "requested",
    detail: alert.status === "failed" ? "Provider acceptance unconfirmed. Delivery unknown; no automatic retry." : "Demo call requested; delivery unverified.",
  } : alert);
  incident.imageDataUrl = null; // Images cannot be credential-filtered here.
  // Persisted prototypes used misleading institutional states; never replay them.
  if (incident.ackNumber && !incident.ackNumber.startsWith("RAKSHA-SIM-")) incident.ackNumber = `RAKSHA-SIM-${incident.id}`;
  incident.packets = (incident.packets ?? []).map((packet) => ({
    ...packet, status: "prepared_locally", payload: { incidentId: incident.id, ...(typeof packet.payload?.preparedAt === "string" ? { preparedAt: packet.payload.preparedAt } : {}), sent: false },
  }));
  incident.routingEvents = (incident.routingEvents ?? []).map((event) => ({
    ...event, type: "prepared_locally", message: "Prepared locally. Not sent to any authority or bank.", status: "recorded",
  }));
  return incident;
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
      noDatabaseMatch: true,
    },
    answers: { paid: false },
    tracks: ["money"],
    ackNumber: "RAKSHA-SIM-DEMO0001",
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
    occurredAt: null,
    origin: "demo",
    shield: null,
  };
}

export async function createIncident(partial: Partial<Incident> = {}): Promise<Incident> {
  return transaction(async () => {
    await ensureStorage();
    const incident = cleanIncident({
      occurredAt: null,
      origin: "intake",
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
      syntheticOnly: false,
      shield: null,
      ...partial,
      id: makeId(),
      createdAt: new Date().toISOString(),
    });
    await persist(incident, true);
    return structuredClone(incident);
  });
}

async function readIncident(id: string): Promise<Incident | undefined> {
  if (id === "DEMO0001") return seedDemoIncident();
  if (!isIncidentId(id)) return undefined;
  await ensureStorage();
  if (database) {
    const rows = await database.select().from(incidents).where(eq(incidents.id, id)).limit(1);
    if (rows[0]) return cleanIncident(rows[0].payload as Incident);
    return undefined;
  }
  const incident = memoryStore.get(id);
  return incident ? cleanIncident(incident) : undefined;
}

export async function getIncident(id: string): Promise<Incident | undefined> {
  if (id === "DEMO0001") return seedDemoIncident();
  return transaction(() => readIncident(id));
}

export async function createDemoIncident(): Promise<Incident> {
  return createIncident({ ...seedDemoIncident(), ackNumber: null });
}

export async function updateIncident(id: string, updates: Partial<Incident> | ((incident: Incident) => Partial<Incident>)): Promise<Incident | null> {
  if (id === "DEMO0001") return null;
  return transaction(async () => {
    const existing = await readIncident(id);
    if (!existing) return null;
    const createdAt = existing.createdAt;
    const changes = typeof updates === "function" ? updates(existing) : updates;
    const updated = cleanIncident({ ...existing, ...changes, id, createdAt });
    await persist(updated, false);
    return structuredClone(updated);
  });
}

export { makeAckNumber };
