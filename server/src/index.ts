import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, and, sql as dsql } from "drizzle-orm";
import { createHash, timingSafeEqual } from "node:crypto";
import { db, init, ping, purgeOld, driver } from "./db.js";
import { state } from "./schema.js";

const PORT = Number(process.env.PORT || 8787);
const MAX_BYTES = 512 * 1024;          // progress blobs are ~10-40 KB; 512 KB is generous
const KEY_RE = /^[A-Z0-9]{26}$/;       // base32, 128 bits — must match the client generator

/* Origins allowed to call the API. Set ALLOWED_ORIGINS on the host, e.g.
   "https://saivikram.github.io,http://localhost:8931". Empty = allow all,
   which is acceptable here because auth is a bearer token, not a cookie. */
const ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);

/* drizzle needs a raw expression for `writes = writes + 1` */
function sqlIncr() { return dsql`${state.writes} + 1`; }

const app = new Hono();

app.use("/api/*", cors({
  origin: (o) => (ORIGINS.length === 0 ? o || "*" : (ORIGINS.includes(o) ? o : null)),
  allowMethods: ["GET", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
  maxAge: 86400
}));

/* ---------- auth ---------- */
function hashKey(k: string) {
  return createHash("sha256").update(k, "utf8").digest("hex");
}

/** Returns the key hash, or null if the Authorization header is missing/malformed. */
function keyHashFrom(auth: string | undefined): string | null {
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const raw = auth.slice(7).trim().toUpperCase().replace(/-/g, "");
  if (!KEY_RE.test(raw)) return null;
  return hashKey(raw);
}

/* ---------- crude per-key rate limit (in-memory, single instance) ---------- */
const buckets = new Map<string, { n: number; reset: number }>();
const LIMIT = 120, WINDOW = 60_000;    // 120 requests/minute/key — far above real use
function rateLimited(kh: string) {
  const now = Date.now();
  const b = buckets.get(kh);
  if (!b || now > b.reset) { buckets.set(kh, { n: 1, reset: now + WINDOW }); return false; }
  b.n++;
  return b.n > LIMIT;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k);
}, WINDOW).unref?.();

/* ---------- routes ---------- */
app.get("/", (c) => c.text("ai-coop-90 sync service"));
app.get("/health", async (c) => {
  try {
    await ping();
    return c.json({ ok: true, db: "up", driver });
  } catch {
    return c.json({ ok: false, db: "down", driver }, 503);
  }
});

/** Fetch the stored blob for this key. 404 means "nothing synced yet" — not an error. */
app.get("/api/state", async (c) => {
  const kh = keyHashFrom(c.req.header("authorization"));
  if (!kh) return c.json({ error: "invalid or missing sync key" }, 401);
  if (rateLimited(kh)) return c.json({ error: "rate limited" }, 429);

  const [row] = await db.select().from(state).where(eq(state.keyHash, kh)).limit(1);
  if (!row) return c.json({ error: "no state for this key" }, 404);
  return c.json({ data: row.data, version: row.version, updatedAt: row.updatedAt });
});

/**
 * Write a merged blob. The client sends the version it merged against; if the row
 * has moved on since, we reject with 409 AND return the current state so the client
 * can re-merge and retry without a second round trip.
 */
app.put("/api/state", async (c) => {
  const kh = keyHashFrom(c.req.header("authorization"));
  if (!kh) return c.json({ error: "invalid or missing sync key" }, 401);
  if (rateLimited(kh)) return c.json({ error: "rate limited" }, 429);

  const len = Number(c.req.header("content-length") || 0);
  if (len > MAX_BYTES) return c.json({ error: "payload too large" }, 413);

  let body: { data?: unknown; baseVersion?: number };
  try { body = await c.req.json(); }
  catch { return c.json({ error: "malformed json" }, 400); }

  const data = body?.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return c.json({ error: "data must be an object" }, 400);
  }
  if (JSON.stringify(data).length > MAX_BYTES) {
    return c.json({ error: "payload too large" }, 413);
  }
  const base = Number(body?.baseVersion ?? 0);

  // First write for this key.
  if (base === 0) {
    const [row] = await db.insert(state)
      .values({ keyHash: kh, data, version: 1, writes: 1 })
      .onConflictDoNothing()
      .returning();
    if (row) return c.json({ version: row.version, updatedAt: row.updatedAt });
    // Someone else created it between our GET and this insert — report the conflict.
    const [cur] = await db.select().from(state).where(eq(state.keyHash, kh)).limit(1);
    return c.json({ error: "conflict", data: cur?.data, version: cur?.version }, 409);
  }

  const [row] = await db.update(state)
    .set({ data, version: base + 1, updatedAt: new Date(), writes: sqlIncr() })
    .where(and(eq(state.keyHash, kh), eq(state.version, base)))
    .returning();

  if (row) return c.json({ version: row.version, updatedAt: row.updatedAt });

  const [cur] = await db.select().from(state).where(eq(state.keyHash, kh)).limit(1);
  if (!cur) return c.json({ error: "no state for this key" }, 404);
  return c.json({ error: "conflict", data: cur.data, version: cur.version }, 409);
});

app.delete("/api/state", async (c) => {
  const kh = keyHashFrom(c.req.header("authorization"));
  if (!kh) return c.json({ error: "invalid or missing sync key" }, 401);
  await db.delete(state).where(eq(state.keyHash, kh));
  return c.json({ ok: true });
});

/* ---------- boot ---------- */
export { app };

await init();
if (!process.env.NO_LISTEN) serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`ai-coop-90 sync listening on :${info.port}`);
  console.log(`  origins: ${ORIGINS.length ? ORIGINS.join(", ") : "(all)"}`);
});

// A key with no writes for a year is almost certainly abandoned; keep the table small.
setInterval(() => {
  purgeOld().catch((e) => console.warn("cleanup failed", e));
}, 24 * 60 * 60 * 1000).unref?.();

/* Timing-safe compare kept available for any future shared-secret admin route. */
export function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
