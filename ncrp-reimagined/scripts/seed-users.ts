import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import { users } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const db = drizzle(neon(DATABASE_URL));

async function seed() {
  // Ensure table exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      name text,
      created_at timestamptz NOT NULL
    )
  `);

  const seedData = [
    { email: "user1@email.com", password: "Password1@123", name: "User One" },
    { email: "user2@email.com", password: "Password2@123", name: "User Two" },
  ];

  for (const { email, password, name } of seedData) {
    const passwordHash = await hash(password, 12);
    const id = `USR${Math.random().toString(36).slice(2, 14).toUpperCase()}`;

    await db
      .insert(users)
      .values({ id, email, passwordHash, name, createdAt: new Date() })
      .onConflictDoNothing()
      .execute();

    console.log(`✓ ${email}`);
  }

  console.log("\nDone. Users seeded.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
