import { pgTable, text, jsonb, integer, timestamp, index } from "drizzle-orm/pg-core";

/**
 * One row per sync key. We never store the key itself — only its SHA-256 hash,
 * so a database leak does not hand anyone the ability to read or write progress.
 *
 * `version` drives optimistic concurrency: a client PUTs the version it based its
 * merge on, and the write is rejected with 409 if the row moved underneath it.
 */
export const state = pgTable("state", {
  keyHash: text("key_hash").primaryKey(),
  data: jsonb("data").notNull(),
  version: integer("version").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  // Coarse abuse guard: lets us spot a key being hammered without storing IPs.
  writes: integer("writes").notNull().default(0)
}, (t) => ({
  updatedIdx: index("state_updated_idx").on(t.updatedAt)
}));

export type StateRow = typeof state.$inferSelect;
