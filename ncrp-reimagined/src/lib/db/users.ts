import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { users } from "./schema";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle(neon(url));
}

let tableReady: Promise<void> | null = null;

async function ensureTable() {
  tableReady ??= getDb().execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      name text,
      created_at timestamptz NOT NULL
    )
  `).then(() => undefined);
  await tableReady;
}

export interface UserRow {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  createdAt: Date;
}

export async function createUser(data: { id: string; email: string; passwordHash: string; name?: string }): Promise<UserRow> {
  await ensureTable();
  const db = getDb();
  const row = {
    id: data.id,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name ?? null,
    createdAt: new Date(),
  };
  await db.insert(users).values(row).execute();
  return row;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  await ensureTable();
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  await ensureTable();
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}
