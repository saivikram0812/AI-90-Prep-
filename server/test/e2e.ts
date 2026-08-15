/**
 * End-to-end sync test. Runs the real Hono app against an in-memory Postgres
 * (PGlite) and drives two simulated devices through the same merge code the
 * browser uses — so a regression in either half fails here.
 *
 *   npm test
 */
process.env.DATABASE_URL = "pglite:memory";
process.env.NO_LISTEN = "1";

import { readFileSync } from "node:fs";
// Dynamic import, NOT a static one: static imports are hoisted and would evaluate
// db.ts before the env vars above are assigned, silently using the wrong driver.
const { app } = await import("../src/index.js");

let pass = 0, fail = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) console.log(`        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`);
}

/* Pull mergeState + blank out of the browser bundle so both halves are the real thing. */
const syncSrc = readFileSync(new URL("../../js/sync.js", import.meta.url), "utf8");
const mergeSrc = syncSrc.slice(syncSrc.indexOf("const SYNC_MAPS"), syncSrc.indexOf("/* ---------------- transport"));
const blankSrc = `function blank(){return{startDate:"2026-08-13",done:{},notes:{},conf:{},projects:{},iv:{},dsa:{},redo:{},t:{},v:2};}`;
const mergeState = new Function(`${blankSrc}\n${mergeSrc.replace(/^const SYNC_MAPS/m, "var SYNC_MAPS")}\nreturn mergeState;`)() as
  (a: any, b: any) => any;
const blank = new Function(`${blankSrc} return blank;`)() as () => any;

const KEY_A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, 26);
const KEY_B = "BBBBBBBBBBBBBBBBBBBBBBBBBB";

function req(method: string, path: string, key?: string, body?: unknown, extra?: HeadersInit) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(extra as any) };
  if (key) headers["Authorization"] = "Bearer " + key;
  return app.request("http://x" + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body)
  });
}

/** One device: local state + its own view of the server version. */
class Device {
  S = blank();
  version = 0;
  constructor(public name: string, public key: string) {}
  mut(map: string, k: string, v: unknown, t?: number) {
    if (v === undefined) delete this.S[map][k]; else this.S[map][k] = v;
    this.S.t[`${map}:${k}`] = t ?? Date.now();
  }
  /** Mirrors syncNow() in the browser: pull → merge → push, retry once on conflict. */
  async sync() {
    for (let i = 0; i < 2; i++) {
      const g = await req("GET", "/api/state", this.key);
      let remote: any = null, ver = 0;
      if (g.status === 200) { const j: any = await g.json(); remote = j.data; ver = j.version; }
      const merged = remote ? mergeState(this.S, remote) : this.S;
      const p = await req("PUT", "/api/state", this.key, { data: merged, baseVersion: ver });
      if (p.status === 409) continue;
      if (!p.ok) throw new Error("push failed " + p.status);
      const j: any = await p.json();
      this.S = merged; this.version = j.version;
      return;
    }
    throw new Error("kept conflicting");
  }
}

console.log("\nauth & validation");
check("health", (await (await req("GET", "/health")).json() as any).ok, true);
check("no auth header -> 401", (await req("GET", "/api/state")).status, 401);
check("garbage key -> 401", (await req("GET", "/api/state", "nope")).status, 401);
check("wrong length key -> 401", (await req("GET", "/api/state", "ABCDEF")).status, 401);
check("unknown key -> 404", (await req("GET", "/api/state", KEY_B)).status, 404);
check("non-object data -> 400", (await req("PUT", "/api/state", KEY_A, { data: [1, 2], baseVersion: 0 })).status, 400);
check("lowercase+dashed key accepted", (await req("GET", "/api/state", "abcdef-ghijkl-mnopqr-stuvwx-yz")).status, 404);

console.log("\nversioning");
const first = await req("PUT", "/api/state", KEY_A, { data: blank(), baseVersion: 0 });
check("first write -> version 1", (await first.json() as any).version, 1);
check("stale baseVersion -> 409", (await req("PUT", "/api/state", KEY_A, { data: blank(), baseVersion: 0 })).status, 409);
const conflictBody: any = await (await req("PUT", "/api/state", KEY_A, { data: blank(), baseVersion: 99 })).json();
check("409 returns current state", typeof conflictBody.data === "object" && conflictBody.version === 1, true);

console.log("\nkey isolation");
await req("PUT", "/api/state", KEY_B, { data: { marker: "b", done: {}, t: {} }, baseVersion: 0 });
const aRow: any = await (await req("GET", "/api/state", KEY_A)).json();
check("key A cannot see key B's data", aRow.data.marker, undefined);

console.log("\ntwo devices, concurrent edits");
const K = "CCCCCCCCCCCCCCCCCCCCCCCCCC";
const laptop = new Device("laptop", K), phone = new Device("phone", K);

laptop.mut("done", "1", { at: "d1" });
await laptop.sync();
await phone.sync();                                   // phone joins, picks up day 1
check("phone picked up laptop's day 1", Object.keys(phone.S.done), ["1"]);

// Now both edit different things before either syncs — the case naive LWW loses.
laptop.mut("done", "2", { at: "d2" });
phone.mut("dsa", "two-sum", "t");
phone.mut("dsa", "valid-anagram", "t");
await laptop.sync();
await phone.sync();
check("phone has both sides", [Object.keys(phone.S.done).sort(), Object.keys(phone.S.dsa).sort()],
  [["1", "2"], ["two-sum", "valid-anagram"]]);
await laptop.sync();
check("laptop converges to same state", JSON.stringify(laptop.S), JSON.stringify(phone.S));

console.log("\ndeletes propagate");
phone.mut("done", "1", undefined);                    // un-tick day 1 on the phone
await phone.sync();
await laptop.sync();
check("un-tick on phone removes it on laptop", Object.keys(laptop.S.done), ["2"]);
check("un-tick did not resurrect on next sync", (await (async () => {
  await phone.sync(); await laptop.sync(); return Object.keys(laptop.S.done);
})()), ["2"]);

console.log("\nnotes and last-write-wins");
laptop.mut("notes", "5", "laptop version", 5000);
phone.mut("notes", "5", "phone version", 6000);       // phone edited later
await laptop.sync(); await phone.sync(); await laptop.sync();
check("newer note wins on both", [laptop.S.notes["5"], phone.S.notes["5"]], ["phone version", "phone version"]);

console.log("\nrealistic payload size");
const big = blank();
for (let i = 1; i <= 90; i++) { big.done[i] = { at: new Date().toISOString() }; big.t[`done:${i}`] = Date.now(); }
for (let i = 0; i < 150; i++) { big.dsa["problem-slug-" + i] = new Date().toISOString(); big.t[`dsa:problem-slug-${i}`] = Date.now(); }
for (let i = 1; i <= 90; i++) { big.notes[i] = "a".repeat(300); big.t[`notes:${i}`] = Date.now(); }
const bytes = JSON.stringify(big).length;
const D = "DDDDDDDDDDDDDDDDDDDDDDDDDD";
const bigRes = await req("PUT", "/api/state", D, { data: big, baseVersion: 0 });
check(`full 90-day payload (${(bytes / 1024).toFixed(0)} KB) accepted`, bigRes.status, 200);
check("payload well under the 512 KB cap", bytes < 512 * 1024, true);

console.log("\ndelete endpoint");
check("delete ok", (await req("DELETE", "/api/state", D)).status, 200);
check("gone after delete", (await req("GET", "/api/state", D)).status, 404);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
