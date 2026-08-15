/* ============================================================
   SYNC — two-way, last-write-wins per key.
   ------------------------------------------------------------
   Progress is a set of independent keys (done days, solved problems,
   ticked questions, per-day notes). Syncing the whole blob with
   last-write-wins would lose work: tick a problem on your phone and
   a day on your laptop, and whichever syncs second wins outright.

   So every mutation stamps a timestamp against its own key in S.t,
   and merging is per-key. A key missing on one side with a NEWER
   timestamp is a deletion, not an absence — which is what makes
   un-ticking something actually stick across devices.
   ============================================================ */

const SYNC_KEY_STORE = "aicoop90.sync";
const KEY_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";   // base32, no 0/1/8/9 ambiguity
const SYNC_MAPS = ["done", "notes", "conf", "projects", "iv", "dsa", "redo"];

let SYNC = loadSync();
let syncTimer = null;
let syncing = false;
let lastError = "";

function loadSync() {
  const base = { url: "", key: "", version: 0, lastAt: 0, enabled: false };
  try { return Object.assign(base, JSON.parse(localStorage.getItem(SYNC_KEY_STORE) || "{}")); }
  catch { return base; }
}
function saveSync() {
  try { localStorage.setItem(SYNC_KEY_STORE, JSON.stringify(SYNC)); } catch (e) { /* full */ }
}

function newSyncKey() {
  const b = new Uint8Array(26);
  crypto.getRandomValues(b);
  return Array.from(b, x => KEY_ALPHABET[x % 32]).join("");
}
function prettyKey(k) { return (k.match(/.{1,6}/g) || []).join("-"); }
function normKey(k) { return String(k || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }

/* ---------------- mutation tracking ---------------- */

/** Every state change goes through here so it gets a timestamp and a sync nudge. */
function mut(map, key, value) {
  if (value === undefined) delete S[map][key];
  else S[map][key] = value;
  S.t[map + ":" + key] = Date.now();
  save();
  queueSync();
}
function mutMeta(field, value) {
  S[field] = value;
  S.t["meta:" + field] = Date.now();
  save();
  queueSync();
}

/* ---------------- merge ---------------- */

/**
 * Merge two states key by key. Neither side is authoritative — for each key we
 * take whichever side stamped it more recently, and an absent key with a newer
 * stamp wins as a deletion.
 */
function mergeState(local, remote) {
  const out = blank();
  out.t = {};

  // startDate: newest stamp wins; if neither is stamped, keep the earlier date
  // so a device that was set up first doesn't get its schedule shifted.
  const lt = (local.t || {})["meta:startDate"] || 0;
  const rt = (remote.t || {})["meta:startDate"] || 0;
  if (lt || rt) {
    out.startDate = lt >= rt ? local.startDate : remote.startDate;
    out.t["meta:startDate"] = Math.max(lt, rt);
  } else {
    out.startDate = (local.startDate || "9999") <= (remote.startDate || "9999")
      ? local.startDate : remote.startDate;
  }

  for (const map of SYNC_MAPS) {
    const L = local[map] || {}, R = remote[map] || {};
    const keys = new Set(Object.keys(L).concat(Object.keys(R)));
    for (const k of keys) {
      const path = map + ":" + k;
      const a = (local.t || {})[path] || 0;
      const b = (remote.t || {})[path] || 0;
      const inL = Object.prototype.hasOwnProperty.call(L, k);
      const inR = Object.prototype.hasOwnProperty.call(R, k);

      let take;
      if (a === b) {
        // Equal stamps (usually both 0 — data from before sync existed).
        // Union rather than delete: never lose progress on a tie.
        take = inL ? L[k] : (inR ? R[k] : undefined);
      } else if (a > b) {
        take = inL ? L[k] : undefined;
      } else {
        take = inR ? R[k] : undefined;
      }
      if (take !== undefined) out[map][k] = take;
      const stamp = Math.max(a, b);
      if (stamp) out.t[path] = stamp;
    }
  }
  return out;
}

/* ---------------- transport ---------------- */

function syncHeaders() {
  return { "Authorization": "Bearer " + SYNC.key, "Content-Type": "application/json" };
}
function apiURL() { return SYNC.url.replace(/\/+$/, "") + "/api/state"; }

async function pull() {
  const r = await fetch(apiURL(), { headers: syncHeaders() });
  if (r.status === 404) return { data: null, version: 0 };
  if (r.status === 401) throw new Error("Sync key rejected by the server");
  if (r.status === 429) throw new Error("Rate limited — try again in a minute");
  if (!r.ok) throw new Error("Server returned " + r.status);
  const j = await r.json();
  return { data: j.data, version: j.version || 0 };
}

async function push(data, baseVersion) {
  const r = await fetch(apiURL(), {
    method: "PUT",
    headers: syncHeaders(),
    body: JSON.stringify({ data, baseVersion })
  });
  if (r.status === 409) {
    const j = await r.json();
    return { conflict: true, data: j.data, version: j.version || 0 };
  }
  if (r.status === 413) throw new Error("Progress payload too large");
  if (!r.ok) throw new Error("Server returned " + r.status);
  const j = await r.json();
  return { conflict: false, version: j.version };
}

/** Pull, merge, push. Retries once on a version conflict, then gives up until next nudge. */
async function syncNow(opts) {
  opts = opts || {};
  if (!SYNC.enabled || !SYNC.url || !SYNC.key) return { ok: false, reason: "not configured" };
  if (syncing) return { ok: false, reason: "already running" };
  if (!navigator.onLine) { lastError = "Offline"; renderSyncPill(); return { ok: false, reason: "offline" }; }

  syncing = true; lastError = ""; renderSyncPill();
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const remote = await pull();
      const merged = remote.data ? mergeState(S, remote.data) : Object.assign(blank(), S);

      const res = await push(merged, remote.version);
      if (res.conflict) continue;              // someone wrote between our pull and push

      S = merged;
      SYNC.version = res.version;
      SYNC.lastAt = Date.now();
      save(); saveSync();
      syncing = false;
      if (!opts.quiet) toast("Synced");
      route();
      return { ok: true };
    }
    throw new Error("Kept conflicting — another device is writing right now");
  } catch (e) {
    lastError = e.message || String(e);
    syncing = false;
    renderSyncPill();
    if (!opts.quiet) toast("Sync failed: " + lastError);
    return { ok: false, reason: lastError };
  }
}

/** Debounced nudge — batches a burst of ticks into one round trip. */
function queueSync() {
  if (!SYNC.enabled) return;
  clearTimeout(syncTimer);
  renderSyncPill();
  syncTimer = setTimeout(() => syncNow({ quiet: true }), 2500);
}

/* ---------------- status pill ---------------- */
function syncStatus() {
  if (!SYNC.enabled) return { cls: "", txt: "Sync off" };
  if (syncing) return { cls: "busy", txt: "Syncing…" };
  if (lastError) return { cls: "err", txt: lastError === "Offline" ? "Offline" : "Sync error" };
  if (!SYNC.lastAt) return { cls: "", txt: "Not synced yet" };
  const m = Math.round((Date.now() - SYNC.lastAt) / 60000);
  return { cls: "ok", txt: m < 1 ? "Synced just now" : m < 60 ? `Synced ${m}m ago` : `Synced ${Math.round(m / 60)}h ago` };
}
function renderSyncPill() {
  const el = document.getElementById("sync-pill");
  if (!el) return;
  const s = syncStatus();
  el.className = "sync-pill " + s.cls;
  el.textContent = s.txt;
  el.title = lastError || (SYNC.enabled ? "Click to sync now" : "Set up sync in Settings");
}

/* ---------------- lifecycle ---------------- */
window.addEventListener("online", () => { lastError = ""; queueSync(); });
window.addEventListener("offline", () => { lastError = "Offline"; renderSyncPill(); });
document.addEventListener("visibilitychange", () => {
  // Coming back to the tab is the most likely moment another device has written.
  if (document.visibilityState === "visible" && SYNC.enabled) syncNow({ quiet: true });
});
window.addEventListener("beforeunload", () => {
  if (!SYNC.enabled || !syncTimer) return;
  try {
    // Best-effort flush; keepalive lets it outlive the page.
    fetch(apiURL(), {
      method: "PUT", headers: syncHeaders(), keepalive: true,
      body: JSON.stringify({ data: S, baseVersion: SYNC.version })
    });
  } catch (e) { /* nothing useful to do here */ }
});
