import { sql as dsql } from "drizzle-orm";
import * as schema from "./schema.js";

/**
 * Two drivers, same Drizzle API:
 *
 *  - DATABASE_URL=postgres://…   real Postgres (Neon, Supabase, Railway) — production
 *  - DATABASE_URL unset, or "pglite"  embedded Postgres in ./.data — zero-setup local dev
 *
 * PGlite is real Postgres compiled to WASM, so local behaviour matches production
 * closely enough that you can develop without provisioning a database at all.
 */
const url = (process.env.DATABASE_URL || "").trim();
const usePglite = url === "" || url === "pglite" || url.startsWith("pglite:");

type DB = any;
export let db: DB;
let execute: (q: any) => Promise<unknown>;
export const driver = usePglite ? "pglite" : "postgres";

if (usePglite) {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dir = url.startsWith("pglite:") ? url.slice(7) : (process.env.PGLITE_DIR || "./.data");
  const client = new PGlite(dir === "memory" ? undefined : dir);
  db = drizzle(client, { schema });
  execute = (q) => db.execute(q);
  console.log(`db: pglite (${dir === "memory" ? "in-memory" : dir})`);
} else {
  const postgres = (await import("postgres")).default;
  const { drizzle } = await import("drizzle-orm/postgres-js");
  // Managed Postgres requires TLS; a local server usually doesn't.
  const isLocal = /@(localhost|127\.0\.0\.1)/.test(url);
  const client = postgres(url, {
    ssl: isLocal ? false : "require",
    max: 5, idle_timeout: 20, connect_timeout: 10
  });
  db = drizzle(client, { schema });
  execute = (q) => db.execute(q);
  console.log("db: postgres");
}

/** Create the table on boot so a fresh deploy works without a migration step. */
export async function init() {
  await execute(dsql`
    CREATE TABLE IF NOT EXISTS state (
      key_hash   text PRIMARY KEY,
      data       jsonb NOT NULL,
      version    integer NOT NULL DEFAULT 1,
      updated_at timestamptz NOT NULL DEFAULT now(),
      writes     integer NOT NULL DEFAULT 0
    )`);
  await execute(dsql`CREATE INDEX IF NOT EXISTS state_updated_idx ON state (updated_at)`);
}

export async function ping() {
  await execute(dsql`SELECT 1`);
}

/** A key untouched for a year is abandoned; keep the table small. */
export async function purgeOld() {
  await execute(dsql`DELETE FROM state WHERE updated_at < now() - interval '365 days'`);
}
