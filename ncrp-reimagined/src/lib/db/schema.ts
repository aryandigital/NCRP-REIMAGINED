import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('citizen').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// incidents — the spine; everything else hangs off it
// ---------------------------------------------------------------------------
export const incidents = pgTable('incidents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  anonymous: boolean('anonymous').default(false).notNull(),
  language: varchar('language', { length: 10 }).default('en').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  redactedNarrative: text('redacted_narrative'),
  evidence: jsonb('evidence').$type<Record<string, unknown>>().default({}),
  answers: jsonb('answers').$type<Record<string, unknown>>().default({}),
  patternSlug: varchar('pattern_slug', { length: 100 }),
  stageId: varchar('stage_id', { length: 100 }),
  risk: varchar('risk', { length: 20 }).default('UNCLEAR').notNull(),
  tracks: text('tracks').array().default(['money']),
  dnaVerdict: jsonb('dna_verdict').$type<Record<string, unknown>>(),
});

// ---------------------------------------------------------------------------
// actions — ordered checklist for Immediate Action Mode (Stage 2)
// ---------------------------------------------------------------------------
export const actions = pgTable('actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').references(() => incidents.id).notNull(),
  track: varchar('track', { length: 50 }).notNull(),
  order: integer('order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// ---------------------------------------------------------------------------
// clocks — statutory countdown deadlines
// ---------------------------------------------------------------------------
export const clocks = pgTable('clocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').references(() => incidents.id).notNull(),
  kind: varchar('kind', { length: 50 }).notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
  satisfied: boolean('satisfied').default(false).notNull(),
  legalBasis: varchar('legal_basis', { length: 500 }).notNull(),
});

// ---------------------------------------------------------------------------
// documents — pre-filled legal documents generated from incident state
// ---------------------------------------------------------------------------
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').references(() => incidents.id).notNull(),
  kind: varchar('kind', { length: 50 }).notNull(),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// complaints — formal submission record
// ---------------------------------------------------------------------------
export const complaints = pgTable('complaints', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').references(() => incidents.id).unique().notNull(),
  ackNumber: varchar('ack_number', { length: 14 }).unique().notNull(),
  status: varchar('status', { length: 50 }).default('SUBMITTED').notNull(),
  statusPlain: text('status_plain').notNull(),
  events: jsonb('events').$type<unknown[]>().default([]),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// hashes — privacy-preserving perceptual image hashes (NO raw image stored)
// ---------------------------------------------------------------------------
export const hashes = pgTable('hashes', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').references(() => incidents.id).notNull(),
  algo: varchar('algo', { length: 50 }).default('blockhash64').notNull(),
  hashHex: varchar('hash_hex', { length: 128 }).notNull(),
  mediaType: varchar('media_type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// indicators — reported identifiers (phone, UPI, URL, bank account)
// ---------------------------------------------------------------------------
export const indicators = pgTable('indicators', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  value: varchar('value', { length: 500 }).notNull(),
  reportCount: integer('report_count').default(1).notNull(),
  firstSeen: timestamp('first_seen', { withTimezone: true }).defaultNow().notNull(),
  patternSlug: varchar('pattern_slug', { length: 100 }),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  incidents: many(incidents),
}));

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  user: one(users, { fields: [incidents.userId], references: [users.id] }),
  actions: many(actions),
  clocks: many(clocks),
  documents: many(documents),
  complaint: one(complaints, { fields: [incidents.id], references: [complaints.incidentId] }),
  hashes: many(hashes),
}));

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type Clock = typeof clocks.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;
export type Hash = typeof hashes.$inferSelect;
export type Indicator = typeof indicators.$inferSelect;
