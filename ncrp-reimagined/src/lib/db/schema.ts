import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const incidents = pgTable("incidents", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  payload: jsonb("payload").notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

