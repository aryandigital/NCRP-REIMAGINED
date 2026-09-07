import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { users } from "@/lib/db/schema";

const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;
let tableReady: Promise<void> | null = null;

export interface UserRow {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  createdAt: Date;
}

export class DatabaseRequiredError extends Error {
  constructor() {
    super("Persistent accounts require DATABASE_URL");
    this.name = "DatabaseRequiredError";
  }
}

export const JUDGE_ACCOUNT = {
  id: "USRJUDGE00000001",
  email: "judge@raksha.demo",
  password: "Raksha-2026",
  name: "Hackathon Judge",
} as const;

export function judgeUser(): UserRow {
  return { ...JUDGE_ACCOUNT, passwordHash: "", createdAt: new Date("2026-01-01T00:00:00Z") };
}

async function ensureTable() {
  if (!database) throw new DatabaseRequiredError();
  tableReady ??= database.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      name text,
      created_at timestamptz NOT NULL
    )
  `).then(() => undefined).catch((error) => { tableReady = null; throw error; });
  await tableReady;
}

export async function createUser(data: { id: string; email: string; passwordHash: string; name?: string }) {
  await ensureTable();
  const row = {
    id: data.id,
    email: data.email.trim().toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name?.trim() || null,
    createdAt: new Date(),
  };
  await database!.insert(users).values(row).execute();
  return row;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  await ensureTable();
  const rows = await database!.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  if (id === JUDGE_ACCOUNT.id) return judgeUser();
  await ensureTable();
  const rows = await database!.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}
