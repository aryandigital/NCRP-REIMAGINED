import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { users } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl ? drizzle(neon(databaseUrl)) : null;

let tableReady: Promise<void> | null = null;

async function ensureTable() {
  if (!database) {
    await ensureMemoryUsers();
    return;
  }

  tableReady ??= database.execute(sql`
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

const memoryUsersByEmail = new Map<string, UserRow>();
const memoryUsersById = new Map<string, UserRow>();
let memoryUsersReady: Promise<void> | null = null;

async function ensureMemoryUsers() {
  memoryUsersReady ??= (async () => {
    const createdAt = new Date();
    const demoUsers = [
      { id: "USRDEMO000001", email: "user1@email.com", passwordHash: "$2b$12$EJ8RujQD0jR1kxz4XgtVUuh3HakJ071HM7.A5uKPM4V80qTDbd6nu", name: "User One" },
      { id: "USRDEMO000002", email: "user2@email.com", passwordHash: "$2b$12$LUQHOALIDoatb7RnBK8snOTKCqZERHRxgNtryeMcscZ1IZV6XCF66", name: "User Two" },
    ];

    for (const demoUser of demoUsers) {
      const user: UserRow = { ...demoUser, createdAt };
      memoryUsersByEmail.set(user.email, user);
      memoryUsersById.set(user.id, user);
    }
  })();

  await memoryUsersReady;
}

export async function createUser(data: { id: string; email: string; passwordHash: string; name?: string }): Promise<UserRow> {
  await ensureTable();
  const row = {
    id: data.id,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name ?? null,
    createdAt: new Date(),
  };

  if (!database) {
    memoryUsersByEmail.set(row.email, row);
    memoryUsersById.set(row.id, row);
    return row;
  }

  await database.insert(users).values(row).execute();
  return row;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  await ensureTable();
  const normalizedEmail = email.toLowerCase();
  if (!database) return memoryUsersByEmail.get(normalizedEmail) ?? null;
  const rows = await database.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  await ensureTable();
  if (!database) return memoryUsersById.get(id) ?? null;
  const rows = await database.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}
