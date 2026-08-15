# ai-coop-90 sync

A ~150-line Hono + Postgres service that stores one JSON blob per sync key, so the tracker
works across your laptop and phone.

Stack matches your locked project stack: **Hono + Postgres + Drizzle, TypeScript**.

---

## Run it locally (no database setup required)

```bash
cd server && npm install && npm run dev
```

With no `DATABASE_URL` it uses **PGlite** — real Postgres compiled to WASM, stored in `./.data`.
Nothing to provision. Point the tracker's *Sync server* field at `http://localhost:8787` and it works.

```bash
npm test
```

Runs the full suite: auth, key isolation, optimistic-concurrency conflicts, and a two-device
simulation that drives the browser's actual merge code against the real app. 21 checks.

---

## Deploy it (~10 minutes, free tiers)

**1. Database — [Neon](https://neon.tech)** (free tier is generous, no card). Create a project,
copy the connection string.

**2. Service — [Railway](https://railway.app), [Render](https://render.com) or [Fly.io](https://fly.io).**
Point it at this repo with root directory `server`, then set:

| Variable | Value |
|---|---|
| `DATABASE_URL` | your Neon connection string |
| `ALLOWED_ORIGINS` | `https://YOURNAME.github.io` (add `,http://localhost:8931` for local testing) |

Build `npm install && npm run build`, start `npm start`. The table is created automatically on
first boot — no migration step.

**3. In the tracker:** Settings → Device sync → paste the service URL → **Generate** a key →
**Turn on sync**. On your phone, open the same site, paste the *same key*, turn on sync.

---

## API

Auth is a bearer token — the sync key itself. There are no accounts.

| | |
|---|---|
| `GET /health` | `{ok, db, driver}` |
| `GET /api/state` | → `{data, version, updatedAt}`, or **404** if nothing synced yet |
| `PUT /api/state` | body `{data, baseVersion}` → `{version}`, or **409** with the current state |
| `DELETE /api/state` | wipes this key |

`409` is normal, not an error: it means another device wrote between your read and your write.
The response includes the current server state so the client re-merges and retries in one round trip.

---

## Security notes, stated plainly

**The sync key is the only credential.** Anyone holding it can read and write your progress.
Treat it like a password — don't paste it into a public repo, screenshot, or chat.

**The server never stores the key**, only its SHA-256 hash. A database leak exposes progress
blobs but does not let anyone write to them or derive keys.

**What's actually in the data:** which days you completed, which problems you solved, your
confidence ratings, and your free-text daily notes. No credentials, nothing sensitive — worth
knowing, since it does leave your device.

**Rate limited** to 120 requests/minute per key, in-process. Fine for one person on two devices;
if you ever run multiple instances, move it to Redis.

**Keys idle for a year are deleted** by a daily cleanup, so the table can't grow unbounded.

---

## Files

```
src/index.ts    routes, auth, rate limiting, optimistic concurrency
src/db.ts       driver selection (Postgres or PGlite) + table bootstrap
src/schema.ts   the single Drizzle table
test/e2e.ts     21 checks incl. a real two-device merge simulation
```

The merge algorithm itself lives client-side in [`../js/sync.js`](../js/sync.js) — the server is
deliberately dumb storage, so there is exactly one place where conflict resolution can be wrong.
