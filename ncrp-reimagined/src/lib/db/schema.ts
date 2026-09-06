import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const incidents = pgTable("incidents", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id"),
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

export const identifierReports = pgTable("identifier_reports", {
  value: text("value").primaryKey(),
  type: text("type").notNull(),
  reportCount: integer("report_count").notNull().default(1),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull(),
});
