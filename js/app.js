/* ============================================================
   AI CO-OP 90 — application
   ============================================================ */

const DAYS = [].concat(
  window.CURRICULUM_P1 || [],
  window.CURRICULUM_P2 || [],
  window.CURRICULUM_P3 || []
).sort((a, b) => a.d - b.d);

const KEY = "aicoop90.v1";

/* Flatten NeetCode 150 and assign each problem to a day, evenly inside each
   scheduled block. Deterministic — edit DSA_PLAN to reshape the whole schedule. */
const DSA = [];
(function buildDSA() {
  const byId = {};
  (window.DSA_CATS || []).forEach(c => { byId[c.id] = c; });
  let gi = 0;
  (window.DSA_PLAN || []).forEach(b => {
    const pool = [];
    b.cats.forEach(id => (byId[id] ? byId[id].qs : []).forEach(q =>
      pool.push(Object.assign({}, q, { cat: id, catName: byId[id].name, catShort: byId[id].short }))));
    const D = b.to - b.from + 1, N = pool.length;
    for (let i = 0; i < D; i++) {
      const a = Math.floor(i * N / D), z = Math.floor((i + 1) * N / D);
      for (let k = a; k < z; k++) {
        pool[k].day = b.from + i;
        pool[k].i = ++gi;
        DSA.push(pool[k]);
      }
    }
  });
})();
const DSA_BY_SLUG = {};
DSA.forEach(p => { DSA_BY_SLUG[p.s] = p; });

function dsaForDay(n) { return DSA.filter(p => p.day === n); }
function dsaBlockFor(n) { return (window.DSA_PLAN || []).find(b => n >= b.from && n <= b.to); }
function dsaSolved(s) { return !!S.dsa[s]; }
function dsaRedo(s) { return !!S.redo[s]; }
function dsaSolvedCount() { return Object.keys(S.dsa).length; }
function dsaRedoCount() { return Object.keys(S.redo).filter(s => !S.dsa[s] || true).length; }
function lcURL(p) { return "https://leetcode.com/problems/" + p.s + "/"; }

const PHASE_COLOR = {
  "Foundations": "var(--blu)",
  "Classical ML": "var(--grn)",
  "Deep Learning": "var(--pur)",
  "NLP & Transformers": "var(--pnk)",
  "LLM Engineering": "var(--acc)",
  "MLOps & Interview": "var(--red)"
};
const TRACK_CHIP = {
  Math: "blu", Python: "blu", Data: "blu", Stats: "blu", Tooling: "blu",
  ML: "grn", DL: "pur", NLP: "pnk", LLM: "acc", RAG: "acc", Agents: "acc",
  MLOps: "red", Interview: "red", Project: "pnk", Review: ""
};

/* ---------------- state ---------------- */
let S = load();

function blank() {
  return { startDate: todayISO(), done: {}, notes: {}, conf: {},
           projects: {}, iv: {}, dsa: {}, redo: {},
           t: {},   // per-key mutation timestamps — see sync.js for why
           v: 2 };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    return Object.assign(blank(), JSON.parse(raw));
  } catch (e) {
    console.warn("state load failed, starting fresh", e);
    return blank();
  }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast("Could not save — storage may be full"); }
}

/* ---------------- date helpers ---------------- */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n) { return String(n).padStart(2, "0"); }
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween(a, b) {
  return Math.round((parseISO(b) - parseISO(a)) / 86400000);
}
function dateForDay(n) {
  const d = parseISO(S.startDate);
  d.setDate(d.getDate() + n - 1);
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

/* ---------------- derived ---------------- */
function scheduledDay() {
  return Math.min(90, Math.max(1, daysBetween(S.startDate, todayISO()) + 1));
}
function doneCount() { return Object.keys(S.done).length; }
function isDone(n) { return !!(S.done[n] && S.done[n].at); }
function nextUp() {
  for (let i = 1; i <= 90; i++) if (!isDone(i)) return i;
  return 90;
}
/** Streak = consecutive calendar days (ending today or yesterday) with >=1 completion. */
function streak() {
  const days = new Set(Object.values(S.done).map(x => (x.at || "").slice(0, 10)).filter(Boolean));
  if (!days.size) return 0;
  let n = 0;
  const c = new Date();
  const key = () => `${c.getFullYear()}-${pad(c.getMonth() + 1)}-${pad(c.getDate())}`;
  if (!days.has(key())) c.setDate(c.getDate() - 1);   // grace: today not done yet
  while (days.has(key())) { n++; c.setDate(c.getDate() - 1); }
  return n;
}
function phaseStats() {
  const m = {};
  DAYS.forEach(d => {
    m[d.phase] = m[d.phase] || { t: 0, c: 0 };
    m[d.phase].t++;
    if (isDone(d.d)) m[d.phase].c++;
  });
  return m;
}
function byDay(n) { return DAYS.find(d => d.d === n); }

/* ---------------- small utils ---------------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function ytURL(v) {
  return "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(`${v.ch} ${v.t}`);
}
let toastT;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------------- routing ---------------- */
const ROUTES = ["dash", "day", "plan", "notes", "dsa", "projects", "interview", "journey", "settings"];
function go(hash) { location.hash = hash; }
function route() {
  const h = (location.hash || "#/dash").replace(/^#\/?/, "");
  const [view, arg] = h.split("/");
  const v = ROUTES.includes(view) ? view : "dash";
  document.querySelectorAll(".nav button").forEach(b =>
    b.classList.toggle("on", b.dataset.v === (v === "day" ? "plan" : v)));
  const main = document.getElementById("main");
  main.scrollTop = 0;
  window.scrollTo(0, 0);
  main.innerHTML = ({
    dash: viewDash, day: () => viewDay(+arg || nextUp()), plan: viewPlan,
    notes: viewNotes, dsa: viewDSA, projects: viewProjects, interview: viewInterview,
    journey: viewJourney, settings: viewSettings
  })[v]();
  renderSide();
  wire(v);
}

/* ---------------- sidebar ---------------- */
function renderSide() {
  const done = doneCount(), pc = Math.round(done / 90 * 100), C = 2 * Math.PI * 24;
  document.getElementById("side-foot").innerHTML = `
    <div class="ring-wrap">
      <div class="ring">
        <svg width="56" height="56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="var(--bg-3)" stroke-width="5"/>
          <circle cx="28" cy="28" r="24" fill="none" stroke="var(--acc)" stroke-width="5"
            stroke-linecap="round" stroke-dasharray="${C}"
            stroke-dashoffset="${C * (1 - done / 90)}"/>
        </svg>
        <div class="ring-txt">${pc}%</div>
      </div>
      <div class="ring-meta">
        <b>${done} / 90</b>days complete<br>
        <b style="color:var(--acc)">${streak()} day</b>streak
      </div>
    </div>
    <button class="sync-pill" id="sync-pill"></button>`;
  const pill = document.getElementById("sync-pill");
  pill.addEventListener("click", () => SYNC.enabled ? syncNow() : go("#/settings"));
  renderSyncPill();
  document.querySelector('[data-v="plan"] .badge').textContent = `${done}/90`;
  document.querySelector('[data-v="dsa"] .badge').textContent = `${dsaSolvedCount()}/${DSA.length}`;
  const ivTotal = INTERVIEW.reduce((a, c) => a + c.qs.length, 0);
  document.querySelector('[data-v="interview"] .badge').textContent =
    `${Object.keys(S.iv).length}/${ivTotal}`;
  document.querySelector('[data-v="projects"] .badge').textContent =
    `${Object.values(S.projects).filter(x => x === "shipped").length}/6`;
}

/* ---------------- view: dashboard ---------------- */
function viewDash() {
  const sched = scheduledDay(), next = nextUp(), d = byDay(next);
  const done = doneCount();
  const behind = sched - 1 - done;
  const wk = d.w, wkDays = DAYS.filter(x => x.w === wk);
  const ps = phaseStats();

  return `
  <div class="page-head">
    <h2>Day ${sched} of 90</h2>
    <p>${behind > 2
      ? `You're <b style="color:var(--acc)">${behind} days behind schedule</b> — that's fine. Do the next one. Consistency beats catching up in a panic.`
      : behind > 0
        ? `${behind} day${behind > 1 ? "s" : ""} behind. Close it today and you're back on track.`
        : `On schedule. Keep the streak.`}</p>
  </div>

  <div class="stat-row">
    <div class="stat"><div class="k">Completed</div><div class="v">${done}</div>
      <div class="s">of 90 days</div></div>
    <div class="stat hot"><div class="k">Streak</div><div class="v">${streak()}</div>
      <div class="s">consecutive days</div></div>
    <div class="stat"><div class="k">NeetCode 150</div><div class="v">${dsaSolvedCount()}</div>
      <div class="s">${DSA.filter(p => p.day <= sched && !dsaSolved(p.s)).length} due by today</div></div>
    <div class="stat"><div class="k">Projects shipped</div>
      <div class="v">${Object.values(S.projects).filter(x => x === "shipped").length}</div>
      <div class="s">of 6 scheduled</div></div>
  </div>

  <div class="today">
    <div class="lbl">${isDone(next) ? "All caught up — next" : "Next up"}</div>
    <h3>Day ${d.d} · ${esc(d.title)}</h3>
    <div class="hook">${esc(d.hook)}</div>
    <div class="meta">
      <span class="chip acc">Week ${d.w}</span>
      <span class="chip">${esc(d.phase)}</span>
      <span class="chip ${TRACK_CHIP[d.track] || ""}">${esc(d.track)}</span>
      <span class="chip">${fmtDate(dateForDay(d.d))}</span>
    </div>
    <div class="acts">
      <button class="btn pri" data-go="#/day/${d.d}">Start day ${d.d} →</button>
      <button class="btn ghost" data-go="#/plan">See full plan</button>
    </div>
  </div>

  <div class="grid g2">
    <div class="card">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:12px">
        Week ${wk} · ${esc(wkDays[0].phase)}</h4>
      <div class="wk-strip">
        ${wkDays.map(x => `<div class="wk-dot ${isDone(x.d) ? "done" : ""} ${x.d === sched ? "today" : ""} ${x.d > sched ? "future" : ""}"
            data-go="#/day/${x.d}" title="Day ${x.d}: ${esc(x.title)}">${x.d}</div>`).join("")}
      </div>
      <div style="margin-top:14px;font-size:13px;color:var(--txt-2)">
        ${wkDays.filter(x => isDone(x.d)).length} of ${wkDays.length} done this week.
      </div>
    </div>
    <div class="card">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:14px">
        Progress by phase</h4>
      <div class="phase-bar">
        ${Object.entries(ps).map(([n, v]) => `
          <div class="phase-row">
            <div class="nm">${esc(n)}</div>
            <div class="bar"><i style="width:${v.c / v.t * 100}%;background:${PHASE_COLOR[n]}"></i></div>
            <div class="pc">${v.c}/${v.t}</div>
          </div>`).join("")}
      </div>
    </div>
  </div>

  ${(() => {
    const ps = dsaForDay(d.d);
    if (!ps.length) return "";
    return `
    <div class="card" style="margin-top:14px">
      <div style="display:flex;align-items:baseline;gap:11px;margin-bottom:12px;flex-wrap:wrap">
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3)">
          DSA for day ${d.d} · ${esc(ps[0].catName)}</h4>
        <button class="btn sm ghost" style="margin-left:auto;padding:3px 9px" data-go="#/dsa">All 150 →</button>
      </div>
      ${ps.map(p => dsaRow(p, false)).join("")}
    </div>`;
  })()}

  <div class="card" style="margin-top:14px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:12px">
      Coming up</h4>
    ${DAYS.filter(x => !isDone(x.d) && x.d > next).slice(0, 4).map(x => `
      <div class="d-row" data-go="#/day/${x.d}">
        <div class="d-num">${x.d}</div>
        <div class="d-body"><div class="t">${esc(x.title)}</div>
          <div class="h">${esc(x.hook)}</div></div>
        <div class="d-tags"><span class="chip ${TRACK_CHIP[x.track] || ""}">${esc(x.track)}</span></div>
      </div>`).join("") || `<p style="color:var(--txt-3);font-size:13px">Nothing left. You finished all 90 days.</p>`}
  </div>`;
}

/* ---------------- view: single day ---------------- */
function viewDay(n) {
  const d = byDay(n);
  if (!d) return `<div class="empty"><div class="big">?</div><p>Day ${n} not found.</p></div>`;
  const prev = n > 1 ? n - 1 : null, next = n < 90 ? n + 1 : null;

  return `
  <div class="day-top">
    <div><button class="btn sm ghost" data-go="#/plan">← All days</button></div>
    <div class="day-nav">
      ${prev ? `<button class="btn sm" data-go="#/day/${prev}">← Day ${prev}</button>` : ""}
      ${next ? `<button class="btn sm" data-go="#/day/${next}">Day ${next} →</button>` : ""}
    </div>
  </div>

  <div class="day-hero">
    <div style="font-size:12px;letter-spacing:1.3px;text-transform:uppercase;color:var(--acc);font-weight:700">
      Day ${d.d} · Week ${d.w} · ${fmtDate(dateForDay(d.d))}</div>
    <h2>${esc(d.title)}</h2>
    <div class="hook">${esc(d.hook)}</div>
    <div class="day-meta">
      <span class="chip" style="color:${PHASE_COLOR[d.phase]}">${esc(d.phase)}</span>
      <span class="chip ${TRACK_CHIP[d.track] || ""}">${esc(d.track)}</span>
      ${isDone(n) ? `<span class="chip grn">✓ Completed</span>` : ""}
      ${(d.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}
    </div>
  </div>

  <div class="sec">
    <h4>Why this matters for your co-op</h4>
    <div class="why-box">${esc(d.why)}</div>
  </div>

  <div class="sec">
    <h4>Understand it</h4>
    ${d.learn.map(l => `
      <div class="learn-item"><h5>${esc(l.h)}</h5><p>${esc(l.p)}</p></div>`).join("")}
  </div>

  <div class="sec">
    <h4>Cheat note — copy this into your own handwriting</h4>
    ${noteHTML(d)}
  </div>

  <div class="sec">
    <h4>Watch — optional, ~20 min</h4>
    <div class="why-box" style="border-left-color:var(--txt-3);margin-bottom:11px;font-size:13.2px">
      <b style="color:var(--txt)">You do not need these to do the lab.</b> The
      <i>Understand it</i> section above is the actual teaching — videos are reinforcement for
      anything that did not land. Where a link is a long course, the note says which part to watch.
      Never watch a whole 4-hour course in a day; that is not what this plan expects of you.
    </div>
    ${d.vids.map(v => `
      <a class="vid ${v.n ? "long" : ""}" href="${ytURL(v)}" target="_blank" rel="noopener">
        <div class="play">▶</div>
        <div><div class="tt">${esc(v.t)}</div>
          <div class="ch">${esc(v.ch)} · ${v.n ? esc(v.n) : "short video"}</div></div>
      </a>`).join("")}
    <p style="font-size:11.5px;color:var(--txt-3);margin-top:9px">
      Links open a YouTube search for that exact title and channel, so they never rot.
      Pick the top result from the named channel.</p>
  </div>

  <div class="sec">
    <h4>Build it — today's lab</h4>
    <div class="lab">
      <h5>${esc(d.lab.t)}</h5>
      <ol>${d.lab.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="out"><b>Deliverable:</b> ${esc(d.lab.out)}</div>
    </div>
  </div>

  ${dsaSection(n)}

  <div class="sec">
    <h4>Interview drill — answer out loud before revealing</h4>
    ${d.qs.map((q, i) => `
      <div class="qa" data-qa="${i}">
        <button><span class="q-ic">▶</span><span>${esc(q.q)}</span></button>
        <div class="ans">${esc(q.a)}</div>
      </div>`).join("")}
  </div>

  <div class="sec">
    <h4>Your notes</h4>
    <textarea class="note-in" id="dnotes" placeholder="What clicked? What's still fuzzy? Anything you had to look up twice goes here — this becomes your revision list in week 13.">${esc(S.notes[n] || "")}</textarea>
  </div>

  <div class="done-bar">
    <button class="btn ${isDone(n) ? "" : "pri"}" id="mark">
      ${isDone(n) ? "✓ Completed — click to undo" : "Mark day " + n + " complete"}
    </button>
    <div class="conf"><span>Confidence</span>
      ${[1, 2, 3, 4, 5].map(i =>
        `<button data-conf="${i}" class="${S.conf[n] === i ? "on" : ""}">${i}</button>`).join("")}
    </div>
    ${next ? `<button class="btn ghost" style="margin-left:auto" data-go="#/day/${next}">Next day →</button>` : ""}
  </div>`;
}

function dsaSection(n) {
  const ps = dsaForDay(n);
  if (n >= DSA_REVISION.from && n <= DSA_REVISION.to) {
    const flagged = DSA.filter(p => dsaRedo(p.s));
    return `
    <div class="sec">
      <h4>DSA · revision (no new problems)</h4>
      <div class="lab">
        <h5>${flagged.length} problem${flagged.length === 1 ? "" : "s"} flagged for redo</h5>
        <p style="color:var(--txt-2);font-size:14px;margin-bottom:${flagged.length ? "13px" : "0"}">
          ${esc(DSA_REVISION.note)}</p>
        ${flagged.slice(0, 8).map(p => dsaRow(p, true)).join("")}
        ${flagged.length > 8 ? `<div style="margin-top:10px"><button class="btn sm" data-go="#/dsa">See all ${flagged.length} →</button></div>` : ""}
      </div>
    </div>`;
  }
  if (!ps.length) {
    return `
    <div class="sec">
      <h4>DSA</h4>
      <div class="why-box" style="border-left-color:var(--txt-3)">
        No problems scheduled today — DSA starts on day 3, once your environment is set up.
      </div>
    </div>`;
  }
  const blk = dsaBlockFor(n);
  return `
  <div class="sec">
    <h4>DSA · today's set (${ps.length} problem${ps.length === 1 ? "" : "s"}, ~45 min)</h4>
    ${blk ? `<div class="ds-note">${esc(ps[0].catName)} — ${esc(blk.note)}</div>` : ""}
    ${ps.map(p => dsaRow(p, true)).join("")}
    <details class="pat-note" style="margin-top:10px">
      <summary>${esc(ps[0].catName)} pattern cheat note</summary>
      ${noteHTML({ cheat: DSA_CATS.find(c => c.id === ps[0].cat).cheat }, false)}
    </details>
    <p style="font-size:11.5px;color:var(--txt-3);margin-top:9px">
      Attempt for 25 minutes before reading the key idea. If you needed it, hit ↻ to flag the
      problem for week-13 revision.</p>
  </div>`;
}

function noteHTML(d, alt) {
  const c = d.cheat;
  return `
  <div class="note ${alt ? "alt" : ""}">
    <div class="note-t">${esc(c.title)}</div>
    <ul class="note-pts">${c.pts.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    ${(c.eq || []).map(e => `<div class="note-eq">${esc(e)}</div>`).join("")}
    ${c.warn ? `<div class="note-warn"><b>⚠ trap</b>${esc(c.warn)}</div>` : ""}
    ${alt ? `<div class="note-src">${d.d === "—" ? "DSA pattern" : "Day " + d.d} · ${esc(d.title)}</div>` : ""}
  </div>`;
}

/* ---------------- view: full plan ---------------- */
let planF = { q: "", track: "", status: "" };
function viewPlan() {
  const sched = scheduledDay();
  const tracks = [...new Set(DAYS.map(d => d.track))].sort();
  let list = DAYS.filter(d => {
    if (planF.track && d.track !== planF.track) return false;
    if (planF.status === "done" && !isDone(d.d)) return false;
    if (planF.status === "todo" && isDone(d.d)) return false;
    if (planF.q) {
      const hay = `${d.title} ${d.hook} ${d.why} ${(d.tags || []).join(" ")} ${d.phase} ${d.track}`.toLowerCase();
      if (!hay.includes(planF.q.toLowerCase())) return false;
    }
    return true;
  });

  const weeks = [...new Set(list.map(d => d.w))];
  return `
  <div class="page-head">
    <h2>The 90-day plan</h2>
    <p>Thirteen weeks. Six learning days plus one consolidation day per week, six shipped projects,
       and interview prep running in parallel from week 2.</p>
  </div>

  <div class="filters">
    <input id="fq" placeholder="Search topics, tags, concepts…" value="${esc(planF.q)}">
    <select id="ftrack"><option value="">All tracks</option>
      ${tracks.map(t => `<option ${planF.track === t ? "selected" : ""}>${esc(t)}</option>`).join("")}
    </select>
    <select id="fstatus"><option value="">All</option>
      <option value="todo" ${planF.status === "todo" ? "selected" : ""}>Not done</option>
      <option value="done" ${planF.status === "done" ? "selected" : ""}>Completed</option>
    </select>
    <span style="font-size:12.5px;color:var(--txt-3)">${list.length} day${list.length === 1 ? "" : "s"}</span>
  </div>

  ${weeks.length === 0 ? `<div class="empty"><div class="big">∅</div><p>No days match that filter.</p></div>` :
    weeks.map(w => {
      const ds = list.filter(d => d.w === w);
      const all = DAYS.filter(d => d.w === w);
      const c = all.filter(d => isDone(d.d)).length;
      return `
      <div class="wk-block">
        <div class="wk-hd">
          <h3>Week ${w}</h3>
          <span class="ph" style="color:${PHASE_COLOR[all[0].phase]}">${esc(all[0].phase)}</span>
          <span class="pr">${c}/${all.length}</span>
        </div>
        ${ds.map(d => `
          <div class="d-row ${isDone(d.d) ? "done" : ""} ${d.d === sched ? "today" : ""}" data-go="#/day/${d.d}">
            <div class="d-num">${isDone(d.d) ? "✓" : d.d}</div>
            <div class="d-body">
              <div class="t">${esc(d.title)}</div>
              <div class="h">${esc(d.hook)}</div>
            </div>
            <div class="d-tags">
              <span class="chip ${TRACK_CHIP[d.track] || ""}">${esc(d.track)}</span>
            </div>
          </div>`).join("")}
      </div>`;
    }).join("")}`;
}

/* ---------------- view: cheat notes wall ---------------- */
function viewNotes() {
  const done = DAYS.filter(d => isDone(d.d));
  const pats = DSA_CATS.filter(c => DSA.some(p => p.cat === c.id && dsaSolved(p.s)));
  const total = done.length + pats.length;
  return `
  <div class="page-head">
    <h2>Cheat notes</h2>
    <p>Every note you've unlocked — AI topics from completed days, DSA patterns from problems
       you've solved. This is your revision wall: print it, or copy each one into a real notebook
       by hand. Handwriting them is what makes them stick.</p>
  </div>
  <div class="filters">
    <button class="btn sm" onclick="window.print()">🖨 Print all</button>
    <span style="font-size:12.5px;color:var(--txt-3)">
      ${done.length}/90 AI notes · ${pats.length}/${DSA_CATS.length} DSA patterns · ${total} total</span>
  </div>
  ${total === 0 ? `
    <div class="empty"><div class="big">✎</div>
      <p>Complete your first day, or solve your first NeetCode problem, and the notes start
         appearing here. They accumulate into a full revision deck by day 90.</p></div>` : `
    ${pats.length ? `
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1.1px;color:var(--txt-3);margin:6px 0 14px">
        DSA patterns</h3>
      <div class="wall">${pats.map(c =>
        noteHTML({ cheat: c.cheat, d: "—", title: c.name }, true)).join("")}</div>` : ""}
    ${done.length ? `
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1.1px;color:var(--txt-3);margin:22px 0 14px">
        AI topics</h3>
      <div class="wall">${done.map(d => noteHTML(d, true)).join("")}</div>` : ""}`}`;
}

/* ---------------- DSA rendering ---------------- */
const DIFF = { E: ["grn", "Easy"], M: ["acc", "Med"], H: ["red", "Hard"] };

function dsaRow(p, showCat) {
  const [cls, lbl] = DIFF[p.d];
  return `
  <div class="ds-row ${dsaSolved(p.s) ? "ok" : ""} ${dsaRedo(p.s) ? "redo" : ""}" data-slug="${esc(p.s)}">
    <button class="ds-tick" data-dtick="${esc(p.s)}" title="Mark solved">✓</button>
    <div class="ds-n">${p.i}</div>
    <div class="ds-body">
      <div class="ds-t">
        <a href="${lcURL(p)}" target="_blank" rel="noopener">${esc(p.t)}</a>
        ${p.p ? `<span class="chip pur" title="LeetCode Premium — use neetcode.io's free version">premium</span>` : ""}
      </div>
      <div class="ds-k">${esc(p.k)}</div>
    </div>
    <div class="ds-meta">
      ${showCat ? `<span class="chip">${esc(p.catShort)}</span>` : ""}
      <span class="chip">day ${p.day}</span>
      <span class="chip ${cls}">${lbl}</span>
      <button class="ds-flag ${dsaRedo(p.s) ? "on" : ""}" data-dredo="${esc(p.s)}"
        title="Flag for week-13 revision">↻</button>
    </div>
  </div>`;
}

/* ---------------- view: DSA ---------------- */
let dsaF = { q: "", cat: "", status: "" };
function viewDSA() {
  const solved = dsaSolvedCount(), redo = Object.keys(S.redo).length;
  const byDiff = { E: [0, 0], M: [0, 0], H: [0, 0] };
  DSA.forEach(p => { byDiff[p.d][1]++; if (dsaSolved(p.s)) byDiff[p.d][0]++; });
  const sched = scheduledDay();
  const dueNow = DSA.filter(p => p.day <= sched && !dsaSolved(p.s)).length;

  let list = DSA.filter(p => {
    if (dsaF.cat && p.cat !== dsaF.cat) return false;
    if (dsaF.status === "todo" && dsaSolved(p.s)) return false;
    if (dsaF.status === "done" && !dsaSolved(p.s)) return false;
    if (dsaF.status === "redo" && !dsaRedo(p.s)) return false;
    if (dsaF.q) {
      const hay = `${p.t} ${p.k} ${p.catName}`.toLowerCase();
      if (!hay.includes(dsaF.q.toLowerCase())) return false;
    }
    return true;
  });

  return `
  <div class="page-head">
    <h2>DSA · NeetCode 150</h2>
    <p>Runs in parallel with the AI track — roughly two problems a day, ordered by pattern,
       scheduled across days 3–84. Days 85–90 are revision only. Budget about
       <b>45 minutes on top</b> of the daily AI work.</p>
  </div>

  <div class="stat-row">
    <div class="stat"><div class="k">Solved</div><div class="v">${solved}</div>
      <div class="s">of ${DSA.length}</div></div>
    <div class="stat ${dueNow > 8 ? "hot" : ""}"><div class="k">Due by today</div>
      <div class="v">${dueNow}</div><div class="s">unsolved, day ≤ ${sched}</div></div>
    <div class="stat"><div class="k">Flagged for redo</div><div class="v">${redo}</div>
      <div class="s">week-13 revision list</div></div>
    <div class="stat"><div class="k">By difficulty</div>
      <div class="v" style="font-size:17px;letter-spacing:0">
        <span style="color:var(--grn)">${byDiff.E[0]}/${byDiff.E[1]}</span> ·
        <span style="color:var(--acc)">${byDiff.M[0]}/${byDiff.M[1]}</span> ·
        <span style="color:var(--red)">${byDiff.H[0]}/${byDiff.H[1]}</span></div>
      <div class="s">easy · medium · hard</div></div>
  </div>

  <div class="filters">
    <input id="dq" placeholder="Search problems or techniques…" value="${esc(dsaF.q)}">
    <select id="dcat"><option value="">All patterns</option>
      ${DSA_CATS.map(c => `<option value="${c.id}" ${dsaF.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
    </select>
    <select id="dstatus"><option value="">All</option>
      <option value="todo" ${dsaF.status === "todo" ? "selected" : ""}>Unsolved</option>
      <option value="done" ${dsaF.status === "done" ? "selected" : ""}>Solved</option>
      <option value="redo" ${dsaF.status === "redo" ? "selected" : ""}>Flagged for redo</option>
    </select>
    <a class="btn sm ghost" href="https://neetcode.io/practice" target="_blank" rel="noopener">neetcode.io ↗</a>
    <span style="font-size:12.5px;color:var(--txt-3)">${list.length} shown</span>
  </div>

  ${list.length === 0 ? `<div class="empty"><div class="big">∅</div><p>Nothing matches that filter.</p></div>` :
    DSA_CATS.map(c => {
      const ps = list.filter(p => p.cat === c.id);
      if (!ps.length) return "";
      const all = DSA.filter(p => p.cat === c.id);
      const done = all.filter(p => dsaSolved(p.s)).length;
      const blk = dsaBlockFor(all[0].day);
      return `
      <div class="wk-block">
        <div class="wk-hd">
          <h3>${esc(c.name)}</h3>
          <span class="ph">days ${all[0].day}–${all[all.length - 1].day}</span>
          <span class="pr">${done}/${all.length}</span>
        </div>
        ${blk && ps.length === all.length ? `<div class="ds-note">${esc(blk.note)}</div>` : ""}
        <details class="pat-note" ${done ? "" : ""}>
          <summary>Pattern cheat note</summary>
          ${noteHTML({ cheat: c.cheat }, false)}
        </details>
        ${ps.map(p => dsaRow(p, false)).join("")}
      </div>`;
    }).join("")}

  <div class="card" style="margin-top:8px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:11px">
      Days 85–90 · revision</h4>
    <p style="font-size:13.8px;color:var(--txt-2)">${esc(DSA_REVISION.note)}</p>
  </div>`;
}

/* ---------------- view: projects ---------------- */
function viewProjects() {
  const shipped = Object.values(S.projects).filter(x => x === "shipped").length;
  return `
  <div class="page-head">
    <h2>Project bank</h2>
    <p>Six are scheduled into the curriculum — those are the portfolio. The rest are alternates
       if a scheduled one doesn't fit your interests. <b>${shipped}</b> shipped so far.</p>
  </div>
  ${[1, 2, 3, 4, 5, 6].map(t => {
    const ps = PROJECTS.filter(p => p.tier === t);
    if (!ps.length) return "";
    const names = { 1: "Tier 1 · Foundation (weeks 4-5)", 2: "Tier 2 · Deep learning (week 7)",
      3: "Tier 3 · NLP & fine-tuning (week 9)", 4: "Tier 4 · LLM systems (week 11) — flagship",
      5: "Tier 5 · MLOps (week 12)", 6: "Tier 6 · Differentiators" };
    return `
    <div class="wk-block">
      <div class="wk-hd"><h3>${names[t]}</h3></div>
      ${ps.map(p => projectHTML(p)).join("")}
    </div>`;
  }).join("")}`;
}

function projectHTML(p) {
  const st = S.projects[p.id] || "";
  return `
  <div class="pj ${p.scheduled ? "sched" : ""}">
    <div class="pj-hd">
      <h3>${esc(p.title)}</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${p.scheduled ? `<span class="chip acc">Scheduled · day ${p.day}</span>` : ""}
        <span class="chip">${esc(p.cat)}</span>
        <span class="chip">${esc(p.hours)} h</span>
      </div>
    </div>
    <div class="pitch">${esc(p.pitch)}</div>

    <div class="lbl">What it proves</div>
    <ul class="proves">${p.proves.map(x => `<li>${esc(x)}</li>`).join("")}</ul>

    <div class="lbl">Stack</div>
    <div class="stack">${p.stack.map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div>

    <details>
      <summary>Build steps &amp; stretch goals</summary>
      <ol>${p.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="lbl" style="margin-top:13px">Stretch</div>
      <ul class="proves">${p.stretch.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="lbl" style="margin-top:13px">Data</div>
      <p style="font-size:13.3px;color:var(--txt-2)">${esc(p.data)}</p>
    </details>

    <div class="why">${esc(p.why)}</div>

    <div class="pj-status" data-pj="${p.id}">
      ${["planned", "building", "shipped"].map(s =>
        `<button data-s="${s}" class="${st === s ? "on" : ""}">${s[0].toUpperCase() + s.slice(1)}</button>`).join("")}
    </div>
  </div>`;
}

/* ---------------- view: interview ---------------- */
function viewInterview() {
  const total = INTERVIEW.reduce((a, c) => a + c.qs.length, 0);
  const got = Object.keys(S.iv).length;
  return `
  <div class="page-head">
    <h2>Interview bank</h2>
    <p>Tick a question only when you can answer it <b>out loud, unprompted, in under two minutes,
       with nothing open</b>. Recognising an answer is not the same as knowing it.
       <b style="color:var(--acc)">${got} / ${total}</b> locked in.</p>
  </div>
  ${INTERVIEW.map(c => {
    const cg = c.qs.filter(q => S.iv[q.id]).length;
    return `
    <div class="iv-cat">
      <div class="hd">
        <h3>${esc(c.cat)}</h3>
        <span class="chip ${cg === c.qs.length ? "grn" : ""}">${cg}/${c.qs.length}</span>
      </div>
      <div class="note-line">${esc(c.note)}</div>
      ${c.qs.map(q => `
        <div class="iv-q ${S.iv[q.id] ? "got" : ""}" data-iv="${q.id}">
          <div class="top">
            <button class="iv-tick" data-tick="${q.id}">✓</button>
            <div class="qt">${esc(q.q)}</div>
          </div>
          <div class="key"><b style="color:var(--txt)">Key points:</b> ${esc(q.key)}</div>
        </div>`).join("")}
    </div>`;
  }).join("")}`;
}

/* ---------------- view: journey ---------------- */
function viewJourney() {
  const items = Object.entries(S.done)
    .map(([n, v]) => ({ n: +n, at: v.at, notes: S.notes[n], conf: S.conf[n] }))
    .sort((a, b) => (b.at || "").localeCompare(a.at || "") || b.n - a.n);
  const shipped = PROJECTS.filter(p => S.projects[p.id] === "shipped");

  return `
  <div class="page-head">
    <h2>Journey log</h2>
    <p>Everything you've completed, newest first — with your own notes. In week 13 this is
       your personalised revision list, and it's also the raw material for your behavioural stories.</p>
  </div>

  ${shipped.length ? `
  <div class="card" style="margin-bottom:18px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:11px">
      Shipped projects</h4>
    ${shipped.map(p => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0">
        <span class="chip grn">✓</span>
        <span style="font-size:14px;font-weight:600">${esc(p.title)}</span>
        <span class="chip" style="margin-left:auto">${esc(p.cat)}</span>
      </div>`).join("")}
  </div>` : ""}

  ${items.length === 0 ? `
    <div class="empty"><div class="big">◷</div>
      <p>Nothing logged yet. Complete day 1 and your journey starts here.</p></div>` : `
    <div class="tl">
      ${items.map(it => {
        const d = byDay(it.n);
        const ms = d && (d.track === "Project" || it.n === 90);
        return `
        <div class="tl-item ${ms ? "ms" : ""}">
          <div class="tl-d">${it.at ? new Date(it.at).toLocaleDateString(undefined,
            { day: "numeric", month: "short", year: "numeric" }) : "—"}
            ${it.conf ? ` · confidence ${it.conf}/5` : ""}</div>
          <div class="tl-t" style="cursor:pointer" data-go="#/day/${it.n}">
            Day ${it.n} · ${esc(d ? d.title : "")}</div>
          ${it.notes ? `<div class="tl-n">${esc(it.notes)}</div>` : ""}
        </div>`;
      }).join("")}
    </div>`}`;
}

/* ---------------- view: settings ---------------- */
function viewSettings() {
  return `
  <div class="page-head">
    <h2>Settings, sync &amp; backup</h2>
    <p>Progress lives in this browser's local storage. Turn on sync to share it across devices —
       otherwise export regularly, because clearing site data loses it.</p>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:11px;margin-bottom:4px;flex-wrap:wrap">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3)">
        Device sync</h4>
      <span class="sync-pill ${syncStatus().cls}" style="margin-left:auto">${esc(syncStatus().txt)}</span>
    </div>
    <p style="font-size:13px;color:var(--txt-3);margin-bottom:14px;max-width:70ch">
      Two-way, merged per item — ticking a problem on your phone and a day on your laptop both
      survive. Your sync key is the only credential; anyone holding it can read and write your
      progress, so treat it like a password. The server never stores the key itself, only its hash.
    </p>

    <div class="set-row">
      <div><div class="l">Sync server</div>
        <div class="d">The base URL of your deployed sync service, e.g.
          <code>https://ai-coop-90-sync.up.railway.app</code>. Leave blank to keep sync off.</div></div>
      <input type="text" id="syncurl" placeholder="https://…" value="${esc(SYNC.url)}"
        style="min-width:270px">
    </div>

    <div class="set-row">
      <div><div class="l">Sync key</div>
        <div class="d">${SYNC.key
          ? "Paste this same key on your other devices to join them to this progress."
          : "Generate one here, then paste it on your other devices."}</div></div>
      <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap">
        <input type="text" id="synckey" placeholder="paste a key, or generate one"
          value="${esc(SYNC.key ? prettyKey(SYNC.key) : "")}"
          spellcheck="false" style="min-width:250px;font-family:var(--mono);font-size:12.5px">
        <button class="btn sm" id="genkey">Generate</button>
        ${SYNC.key ? `<button class="btn sm" id="copykey">Copy</button>` : ""}
      </div>
    </div>

    <div class="set-row">
      <div><div class="l">${SYNC.enabled ? "Sync is on" : "Sync is off"}</div>
        <div class="d">${SYNC.enabled
          ? "Changes push automatically a couple of seconds after you make them, and pull whenever you return to the tab."
          : "Set a server URL and a key, then turn it on."}</div></div>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        ${SYNC.enabled ? `<button class="btn sm" id="syncnow">↻ Sync now</button>` : ""}
        <button class="btn sm ${SYNC.enabled ? "" : "pri"}" id="synctoggle"
          ${(!SYNC.url || !SYNC.key) && !SYNC.enabled ? "disabled" : ""}>
          ${SYNC.enabled ? "Turn off" : "Turn on sync"}</button>
      </div>
    </div>
    ${lastError ? `<div class="set-row" style="border:none"><div class="d" style="color:var(--red)">
      Last error: ${esc(lastError)}</div></div>` : ""}
  </div>

  <div class="card">
    <div class="set-row">
      <div><div class="l">Start date</div>
        <div class="d">Day 1 of the sprint. Changing this shifts every scheduled date;
          your completions are unaffected.</div></div>
      <input type="date" id="sdate" value="${esc(S.startDate)}">
    </div>
    <div class="set-row">
      <div><div class="l">Export progress</div>
        <div class="d">Downloads a JSON file with every completion, note, confidence rating,
          project status, and interview tick.</div></div>
      <button class="btn" id="exp">↓ Export JSON</button>
    </div>
    <div class="set-row">
      <div><div class="l">Import progress</div>
        <div class="d">Restore from a previously exported file. This replaces current progress.</div></div>
      <label class="btn" style="cursor:pointer">↑ Import
        <input type="file" id="imp" accept="application/json" style="display:none"></label>
    </div>
    <div class="set-row">
      <div><div class="l" style="color:var(--red)">Reset everything</div>
        <div class="d">Wipes all progress. Export first if there's any chance you want it back.</div></div>
      <button class="btn" id="reset" style="border-color:rgba(248,113,113,.4);color:var(--red)">Reset</button>
    </div>
  </div>

  <div class="card" style="margin-top:14px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:11px">
      How to use this well</h4>
    <ul style="padding-left:19px;color:var(--txt-2);font-size:13.8px;line-height:1.9">
      <li><b>Daily shape:</b> ~45 min concept → ~60 min lab → ~45 min DSA → ~15 min interview drill.
          That's about 2 h 45 m. On a bad day, do the DSA and the drill and skip the lab —
          never the reverse.</li>
      <li>Do the <b>lab</b> whenever you can. Reading without building produces recognition, not knowledge.</li>
      <li>Copy each cheat note out <b>by hand</b> into a real notebook. That is the point of the format.</li>
      <li>On DSA: attempt for <b>25 minutes before reading the key idea</b>. If you needed it,
          hit ↻ to flag it — those flagged problems are exactly what week 13 re-solves.</li>
      <li>Answer the interview drill <b>out loud before revealing</b> the answer.</li>
      <li>Write in the notes box every day — anything you looked up twice.</li>
      <li>Missing a day is fine. Missing a week is how sprints die. Do a short day instead of none.</li>
      <li>Export your progress every Sunday.</li>
    </ul>
  </div>`;
}

/* ---------------- wiring ---------------- */
function wire(view) {
  document.querySelectorAll("[data-go]").forEach(el =>
    el.addEventListener("click", e => { e.preventDefault(); go(el.dataset.go); }));

  /* DSA controls appear on dash, day and dsa pages — wire them everywhere */
  document.querySelectorAll("[data-dtick]").forEach(b =>
    b.addEventListener("click", e => {
      e.stopPropagation();
      const s = b.dataset.dtick;
      if (S.dsa[s]) { mut("dsa", s, undefined); }
      else { mut("dsa", s, new Date().toISOString()); mut("redo", s, undefined); }
      route();
    }));
  document.querySelectorAll("[data-dredo]").forEach(b =>
    b.addEventListener("click", e => {
      e.stopPropagation();
      const s = b.dataset.dredo;
      if (S.redo[s]) mut("redo", s, undefined);
      else { mut("redo", s, 1); toast("Flagged for week-13 revision"); }
      route();
    }));

  if (view === "dsa") {
    const q = document.getElementById("dq");
    let t;
    q.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        dsaF.q = q.value;
        document.getElementById("main").innerHTML = viewDSA(); wire("dsa");
        const nq = document.getElementById("dq");
        nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length);
      }, 220);
    });
    document.getElementById("dcat").addEventListener("change", e => { dsaF.cat = e.target.value; route(); });
    document.getElementById("dstatus").addEventListener("change", e => { dsaF.status = e.target.value; route(); });
  }

  if (view === "day") {
    document.querySelectorAll(".qa").forEach(qa =>
      qa.querySelector("button").addEventListener("click", () => qa.classList.toggle("open")));

    const n = +(location.hash.split("/")[2] || nextUp());
    const ta = document.getElementById("dnotes");
    let t;
    ta.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        mut("notes", n, ta.value.trim() ? ta.value : undefined);
      }, 500);
    });

    document.getElementById("mark").addEventListener("click", () => {
      if (isDone(n)) {
        mut("done", n, undefined);
        toast(`Day ${n} un-marked`);
      } else {
        mut("done", n, { at: new Date().toISOString() });
        toast(`Day ${n} complete — ${doneCount()}/90`);
      }
      route();
    });

    document.querySelectorAll("[data-conf]").forEach(b =>
      b.addEventListener("click", () => {
        const v = +b.dataset.conf;
        mut("conf", n, S.conf[n] === v ? undefined : v);
        route();
      }));
  }

  if (view === "plan") {
    const q = document.getElementById("fq");
    let t;
    q.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        planF.q = q.value;
        const main = document.getElementById("main");
        main.innerHTML = viewPlan(); wire("plan");
        const nq = document.getElementById("fq");
        nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length);
      }, 220);
    });
    document.getElementById("ftrack").addEventListener("change", e => {
      planF.track = e.target.value; route();
    });
    document.getElementById("fstatus").addEventListener("change", e => {
      planF.status = e.target.value; route();
    });
  }

  if (view === "projects") {
    document.querySelectorAll("[data-pj] button").forEach(b =>
      b.addEventListener("click", () => {
        const id = b.closest("[data-pj]").dataset.pj, s = b.dataset.s;
        mut("projects", id, S.projects[id] === s ? undefined : s);
        route();
        if (S.projects[id] === "shipped") toast("Shipped. Update your resume.");
      }));
  }

  if (view === "interview") {
    document.querySelectorAll(".iv-q .qt").forEach(el =>
      el.addEventListener("click", () => el.closest(".iv-q").classList.toggle("open")));
    document.querySelectorAll("[data-tick]").forEach(b =>
      b.addEventListener("click", e => {
        e.stopPropagation();
        const id = b.dataset.tick;
        mut("iv", id, S.iv[id] ? undefined : 1);
        route();
      }));
  }

  if (view === "settings") {
    document.getElementById("sdate").addEventListener("change", e => {
      mutMeta("startDate", e.target.value || todayISO()); toast("Start date updated"); route();
    });

    /* --- sync controls --- */
    const urlEl = document.getElementById("syncurl");
    const keyEl = document.getElementById("synckey");
    urlEl.addEventListener("change", () => {
      SYNC.url = urlEl.value.trim().replace(/\/+$/, ""); saveSync(); route();
    });
    keyEl.addEventListener("change", () => {
      const k = normKey(keyEl.value);
      if (k && k.length !== 26) { toast("A sync key is 26 characters"); return; }
      if (k !== SYNC.key) { SYNC.key = k; SYNC.version = 0; SYNC.lastAt = 0; }
      saveSync(); route();
    });
    document.getElementById("genkey").addEventListener("click", () => {
      SYNC.key = newSyncKey(); SYNC.version = 0; SYNC.lastAt = 0;
      saveSync(); toast("New key generated — copy it to your other devices"); route();
    });
    const copyBtn = document.getElementById("copykey");
    if (copyBtn) copyBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(prettyKey(SYNC.key)); toast("Key copied"); }
      catch { toast("Copy failed — select the field and copy manually"); }
    });
    document.getElementById("synctoggle").addEventListener("click", async () => {
      if (SYNC.enabled) {
        SYNC.enabled = false; saveSync(); toast("Sync turned off"); route(); return;
      }
      if (!SYNC.url || !SYNC.key) { toast("Set a server URL and a key first"); return; }
      SYNC.enabled = true; saveSync();
      const r = await syncNow();
      if (!r.ok) { SYNC.enabled = false; saveSync(); route(); }
    });
    const nowBtn = document.getElementById("syncnow");
    if (nowBtn) nowBtn.addEventListener("click", () => syncNow());
    document.getElementById("exp").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ai-coop-90-progress-${todayISO()}.json`;
      a.click(); URL.revokeObjectURL(a.href);
      toast("Exported");
    });
    document.getElementById("imp").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const d = JSON.parse(r.result);
          if (!d || typeof d !== "object" || !d.done) throw new Error("bad shape");
          S = Object.assign(blank(), d);
          // Exports made before sync existed have no timestamps. Stamp them now so an
          // explicit import wins over whatever is already on the server.
          if (!d.t) {
            const now = Date.now();
            S.t = {};
            for (const map of ["done", "notes", "conf", "projects", "iv", "dsa", "redo"])
              for (const k of Object.keys(S[map] || {})) S.t[map + ":" + k] = now;
            S.t["meta:startDate"] = now;
          }
          save(); queueSync(); route(); toast("Progress imported");
        } catch (err) { toast("That file isn't a valid export"); }
      };
      r.readAsText(f);
    });
    document.getElementById("reset").addEventListener("click", async () => {
      if (!confirm("Wipe all progress? This cannot be undone. Export first if unsure.")) return;
      if (SYNC.enabled && SYNC.url && SYNC.key) {
        // Without this the next sync would pull everything straight back from the server.
        if (confirm("Also delete the synced copy on the server?\n\nOK = wipe everywhere.\nCancel = wipe this device only and turn sync off.")) {
          try { await fetch(apiURL(), { method: "DELETE", headers: syncHeaders() }); }
          catch (e) { toast("Could not reach the server — turned sync off instead"); }
        }
        SYNC.enabled = false; SYNC.version = 0; SYNC.lastAt = 0; saveSync();
      }
      localStorage.removeItem(KEY);
      S = load(); route(); toast("Reset");
    });
  }
}

/* ---------------- boot ---------------- */
window.addEventListener("hashchange", route);
document.addEventListener("keydown", e => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
  const m = (location.hash || "").match(/^#\/day\/(\d+)/);
  if (!m) return;
  const n = +m[1];
  if (e.key === "ArrowLeft" && n > 1) go(`#/day/${n - 1}`);
  if (e.key === "ArrowRight" && n < 90) go(`#/day/${n + 1}`);
});
route();
