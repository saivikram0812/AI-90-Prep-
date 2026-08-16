/* ============================================================
   VIEWS: AI Lab · Review (spaced repetition) · Applications
   ============================================================ */

/* ------------------------------------------------ AI LAB ------ */
const AILAB_BY_DAY = {};
(window.AILAB || []).forEach(t => { AILAB_BY_DAY[t.d] = t; });

const COST_CHIP = { free: ["grn", "free"], local: ["blu", "runs local"],
                    freemium: ["acc", "free tier"], paid: ["pnk", "paid"] };

function ailabDone(d) { return !!S.lab[d]; }

function toolCard(t, compact) {
  const [cc, cl] = COST_CHIP[t.cost] || ["", t.cost];
  const done = ailabDone(t.d);
  return `
  <div class="tool ${done ? "ok" : ""}">
    <div class="tool-hd">
      <div style="flex:1;min-width:0">
        <div class="tool-t">
          <a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.name)} ↗</a>
          <span class="chip">${esc(t.cat)}</span>
          <span class="chip ${cc}">${esc(cl)}</span>
          ${compact ? "" : `<span class="chip">day ${t.d}</span>`}
        </div>
        <div class="tool-w">${esc(t.what)}</div>
      </div>
    </div>
    <div class="tool-task"><b>Try this (15–25 min)</b>${esc(t.task)}</div>
    <div class="tool-why">${esc(t.why)}</div>
    <button class="mark ${done ? "on" : ""}" data-labtick="${t.d}">
      ${done ? "✓ Tried it" : "Mark as tried"}
    </button>
  </div>`;
}

let labF = { q: "", cat: "", status: "" };
function viewAilab() {
  const sched = scheduledDay();
  const today = AILAB_BY_DAY[sched];
  const done = Object.keys(S.lab).length;
  const cats = [...new Set(AILAB.map(t => t.cat))].sort();

  let list = AILAB.filter(t => {
    if (labF.cat && t.cat !== labF.cat) return false;
    if (labF.status === "todo" && ailabDone(t.d)) return false;
    if (labF.status === "done" && !ailabDone(t.d)) return false;
    if (labF.q) {
      const h = `${t.name} ${t.cat} ${t.what} ${t.task}`.toLowerCase();
      if (!h.includes(labF.q.toLowerCase())) return false;
    }
    return true;
  });

  return `
  <div class="page-head">
    <h2>AI Lab</h2>
    <p>One tool a day, one small creative task. The curriculum gives you depth;
       this gives you breadth — so you can say "I've actually used it" about 90 tools
       instead of "I've read about it". Budget 15–25 min, and it is the first thing to
       skip on a bad day.</p>
  </div>

  <div class="stat-row">
    <div class="stat"><div class="k">Tools tried</div><div class="v">${done}</div>
      <div class="s">of ${AILAB.length}</div></div>
    <div class="stat"><div class="k">Categories</div>
      <div class="v">${new Set(AILAB.filter(t => ailabDone(t.d)).map(t => t.cat)).size}</div>
      <div class="s">of ${cats.length} explored</div></div>
    <div class="stat"><div class="k">Free / local</div>
      <div class="v">${AILAB.filter(t => t.cost === "free" || t.cost === "local").length}</div>
      <div class="s">need no card</div></div>
    <div class="stat"><div class="k">Paid</div>
      <div class="v">${AILAB.filter(t => t.cost === "paid").length}</div>
      <div class="s">skip or trial these</div></div>
  </div>

  ${today ? `
  <div class="today">
    <div class="lbl">Today · day ${sched}</div>
    <h3>${esc(today.name)}</h3>
    <div class="hook">${esc(today.what)}</div>
    ${toolCard(today, true)}
  </div>` : ""}

  ${weeklyHTML(Math.min(13, Math.ceil(sched / 7)))}

  <div class="card" id="newsbox">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:11px;flex-wrap:wrap">
      <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3)">
        What's new in AI</h4>
      <span class="chip">live · Hacker News</span>
      <button class="btn sm ghost" id="newsrefresh" style="margin-left:auto;padding:3px 9px">↻</button>
    </div>
    <div id="newslist" style="font-size:13.5px;color:var(--txt-3)">Loading…</div>
    <p style="font-size:11px;color:var(--txt-3);margin-top:10px">
      Cap this at 15 minutes. Staying current is a habit; doom-scrolling AI news is
      procrastination that feels like work.</p>
  </div>

  <div class="filters" style="margin-top:18px">
    <input id="lq" placeholder="Search tools…" value="${esc(labF.q)}">
    <select id="lcat"><option value="">All categories</option>
      ${cats.map(c => `<option ${labF.cat === c ? "selected" : ""}>${esc(c)}</option>`).join("")}
    </select>
    <select id="lstatus"><option value="">All</option>
      <option value="todo" ${labF.status === "todo" ? "selected" : ""}>Not tried</option>
      <option value="done" ${labF.status === "done" ? "selected" : ""}>Tried</option>
    </select>
    <span style="font-size:12.5px;color:var(--txt-3)">${list.length} shown</span>
  </div>

  ${list.length ? list.map(t => toolCard(t)).join("")
    : `<div class="empty"><div class="big">∅</div><p>Nothing matches that filter.</p></div>`}`;
}

/* ---- weekly creative build ---- */
function weekDone(w) { return !!S.wk[w]; }
function weeklyHTML(curW) {
  const all = window.WEEKLY || [];
  const b = all.find(x => x.w === curW);
  if (!b) return "";
  return `
  <div class="wkb">
    <div class="wkb-hd">
      <span class="chip acc">Week ${b.w} build</span>
      <span class="chip">${esc(b.time)}</span>
      <span class="chip ${weekDone(b.w) ? "grn" : ""}">${weekDone(b.w) ? "\u2713 built" : "not started"}</span>
      <button class="btn sm ghost" data-go="#/weekly" style="margin-left:auto;padding:3px 9px">
        all 13 \u2192</button>
    </div>
    <h3>${esc(b.title)}</h3>
    <p class="wkb-pitch">${esc(b.pitch)}</p>
    <div class="wkb-tools">${b.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    <ol class="wkb-steps">${b.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    <div class="wkb-out"><b>You end up with</b>${esc(b.out)}</div>
    <div class="wkb-share"><b>Worth posting?</b>${esc(b.share)}</div>
    <button class="mark ${weekDone(b.w) ? "on" : ""}" data-wktick="${b.w}">
      ${weekDone(b.w) ? "\u2713 Built it" : "Mark as built"}</button>
  </div>`;
}

function viewWeekly() {
  const all = window.WEEKLY || [];
  const cur = Math.min(13, Math.ceil(scheduledDay() / 7));
  const done = Object.keys(S.wk).length;
  return `
  <div class="page-head">
    <h2>Weekly builds</h2>
    <p>One genuinely different thing per week \u2014 2\u20134 hours, and each produces something
       worth showing. These are deliberately not the standard portfolio projects: nobody else
       in your cohort will have animated a loss surface or fine-tuned a model on their own
       writing. <b>${done} of 13 built.</b></p>
  </div>
  ${all.map(b => `
    <div class="wkb ${b.w === cur ? "now" : ""} ${weekDone(b.w) ? "ok" : ""}">
      <div class="wkb-hd">
        <span class="chip ${b.w === cur ? "acc" : ""}">Week ${b.w}${b.w === cur ? " \u00b7 now" : ""}</span>
        <span class="chip">${esc(b.time)}</span>
        ${weekDone(b.w) ? `<span class="chip grn">\u2713 built</span>` : ""}
      </div>
      <h3>${esc(b.title)}</h3>
      <p class="wkb-pitch">${esc(b.pitch)}</p>
      <div class="wkb-tools">${b.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <details><summary>Steps &amp; what to post</summary>
        <ol class="wkb-steps">${b.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
        <div class="wkb-out"><b>You end up with</b>${esc(b.out)}</div>
        <div class="wkb-share"><b>Worth posting?</b>${esc(b.share)}</div>
        <div class="wkb-why">${esc(b.why)}</div>
      </details>
      <button class="mark ${weekDone(b.w) ? "on" : ""}" data-wktick="${b.w}">
        ${weekDone(b.w) ? "\u2713 Built it" : "Mark as built"}</button>
    </div>`).join("")}`;
}

/* Live AI news. Hacker News' Algolia API is public, free and CORS-enabled,
   so this needs no backend and no API key. */
async function loadNews() {
  const box = document.getElementById("newslist");
  if (!box) return;
  const KEY = "aicoop90.news";
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || "null");
    // Never serve an empty cached result — a transient failure would otherwise
    // stick for the whole session.
    if (cached && cached.hits && cached.hits.length &&
        Date.now() - cached.at < 30 * 60 * 1000) return renderNews(cached.hits);
  } catch (e) { /* ignore a bad cache */ }

  box.textContent = "Loading…";
  try {
    // The HN Algolia API treats `query` as a phrase — it does NOT support boolean OR.
    // So run a few single-term queries in parallel and merge, deduping by story id.
    const since = Math.floor(Date.now() / 1000) - 7 * 86400;
    const base = "https://hn.algolia.com/api/v1/search?tags=story&numericFilters=" +
                 `created_at_i>${since},points>30&hitsPerPage=40&query=`;
    const terms = ["AI", "LLM", "OpenAI", "Anthropic", "machine learning"];
    const results = await Promise.all(terms.map(t =>
      fetch(base + encodeURIComponent(t))
        .then(r => r.ok ? r.json() : { hits: [] })
        .catch(() => ({ hits: [] }))
    ));

    const kw = /\b(ai|llm|gpt|claude|gemini|openai|anthropic|model|models|neural|agent|agents|transformer|diffusion|deepseek|llama|mistral|rag|ml|gpu|inference|training)\b/i;
    const seen = new Set();
    const hits = results
      .flatMap(j => j.hits || [])
      .filter(h => {
        if (!h.title || seen.has(h.objectID) || !kw.test(h.title)) return false;
        seen.add(h.objectID);
        return true;
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 6)
      .map(h => ({ t: h.title, u: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
                   p: h.points, c: h.num_comments || 0, id: h.objectID,
                   txt: h.story_text || "", at: h.created_at_i }));

    if (!hits.length) throw new Error("no stories matched");
    try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), hits })); } catch (e) {}
    renderNews(hits);
  } catch (e) {
    box.innerHTML = `<span style="color:var(--txt-3)">Could not load news (${esc(e.message)}).
      <a href="https://news.ycombinator.com/" target="_blank" rel="noopener">Open Hacker News →</a></span>`;
  }
}
/* ---- news classification + a per-story blurb ----------------------------
   There is no free, CORS-accessible source of real article summaries (Jina
   Reader now needs a key; HN only carries text for self-posts). So instead of
   repeating one generic line, the blurb is composed from signals we DO have:
   the kind of source, the engagement shape, and the story's own text when it
   has any. Varied, honest, and enough to decide whether to open it.
------------------------------------------------------------------------- */
const K_MODEL  = { k: "Model release", c: "acc" };
const K_RESEARCH = { k: "Research", c: "pur" };
const K_TOOL   = { k: "Tooling", c: "blu" };
const K_SAFETY = { k: "Safety", c: "red" };
const K_BIZ    = { k: "Industry", c: "pnk" };
const K_TAKE   = { k: "Analysis", c: "" };

const TITLE_RULES = [
  [K_TOOL,     /\b(show hn|open.?sourc\w*|library|framework|SDK|CLI|repo|toolkit|sandbox\w*|runtime|container|self.host\w*|I built|I made|introducing \w+ for)\b/i],
  [K_MODEL,    /\b(release[ds]?|launch(es|ed|ing)?|announc\w*|unveil\w*|now available|ships?|GPT-?\d|Claude \d|Gemini \d|Llama ?\d|new model|open weights?)\b/i],
  [K_RESEARCH, /\b(paper|arxiv|study|researchers?|benchmark|SOTA|state.of.the.art|we (show|find|present)|attack|stealing|extract\w*|distill\w*|probing|traces|evaluat\w*|ablation)\b/i],
  [K_SAFETY,   /\b(safety|alignment|regulat\w*|policy|ban(ned|s)?|lawsuit|copyright|privacy|ethic\w*|harm|jailbreak|misuse)\b/i],
  [K_BIZ,      /\b(raise[sd]?|funding|valuation|acquir\w*|layoff|hiring|revenue|IPO|billion|CEO|leaves|joins|attacks|rivals|market|compet\w*)\b/i]
];
const DOMAIN_RULES = [
  [K_RESEARCH, /arxiv\.org|openreview|nature\.com|science\.org/i],
  [K_TOOL,     /github\.com|gitlab|npmjs|pypi|docker\.com|huggingface\.co/i],
  [K_BIZ,      /techcrunch|theverge|wired|reuters|nytimes|wsj|ft\.com|bloomberg|businessinsider|cnbc/i],
  [K_MODEL,    /(openai|anthropic|deepmind|mistral|cerebras|nvidia|cohere|meta)\.(com|ai)/i]
];
/* Title signals first (most specific), then the domain, then a neutral fallback. */
function classifyNews(t, dom) {
  const byTitle = TITLE_RULES.find(r => r[1].test(t));
  if (byTitle) return byTitle[0];
  const byDom = DOMAIN_RULES.find(r => r[1].test(dom || ""));
  if (byDom) return byDom[0];
  return K_TAKE;
}

function domainOf(u) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return "news.ycombinator.com"; }
}

const SRC_NOTE = [
  [/arxiv\.org/i,            "A preprint — not peer reviewed. Read the abstract and figures; skip the rest unless it is on your path."],
  [/github\.com/i,           "Source code you can actually read and run, which makes it far more useful than a writeup."],
  [/(openai|anthropic|deepmind|google|meta|mistral|cerebras|nvidia|cohere|databricks)\./i,
                             "A vendor post, so expect the benchmark that flatters them. Useful for what shipped, not for how good it is."],
  [/(techcrunch|theverge|wired|reuters|nytimes|wsj|ft\.com|bloomberg|guardian|walrus|businessinsider)\./i,
                             "Press coverage. Fine for context, but thin on technical detail — do not learn the mechanism from here."],
  [/(substack|medium|blog\.|\.dev|hey\.com|simonwillison)/i,
                             "One person's analysis. Often the clearest explanation you will find, but it is a take, not a finding."],
  [/news\.ycombinator/i,     "A discussion thread — the comments are the content here."]
];
function sourceNote(dom) {
  const m = SRC_NOTE.find(x => x[0].test(dom));
  return m ? m[1] : "";
}

function newsBlurb(h) {
  const bits = [];
  // the story's own text, when it is a self-post
  if (h.txt) {
    const clean = h.txt.replace(/<[^>]+>/g, " ")
                       .replace(/&#x2F;/g, "/").replace(/&#x27;/g, "'")
                       .replace(/&quot;/g, '"').replace(/&amp;/g, "&")
                       .replace(/\s+/g, " ").trim();
    // Self-post text is often just a bare archive link. Strip URLs and only use
    // it if there is real prose left underneath.
    const prose = clean.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
    if (prose.length >= 60) bits.push(prose.slice(0, 210) + (prose.length > 210 ? "…" : ""));
  }
  if (!bits.length) {
    const sn = sourceNote(domainOf(h.u));
    if (sn) bits.push(sn);
  }
  // engagement shape says something real about the story
  const ratio = h.c / Math.max(h.p, 1);
  if (ratio > 0.9)      bits.push("More comments than upvotes — this one is contested, so the argument is the substance.");
  else if (h.p > 600)   bits.push("Unusually high engagement even for a busy week.");
  else if (ratio < 0.2 && h.c > 5) bits.push("Broadly agreed on rather than argued over.");

  const days = Math.max(0, Math.round((Date.now() / 1000 - (h.at || 0)) / 86400));
  bits.push(days <= 0 ? "Posted today." : days === 1 ? "Posted yesterday." : `Posted ${days} days ago.`);
  return bits.join(" ");
}

function renderNews(hits) {
  const box = document.getElementById("newslist");
  if (!box) return;
  if (!hits.length) { box.textContent = "Nothing notable in the last week."; return; }
  box.innerHTML = hits.map(h => {
    const kind = classifyNews(h.t, domainOf(h.u));
    return `
    <a class="news" href="https://news.ycombinator.com/item?id=${esc(h.id)}"
       target="_blank" rel="noopener">
      <div class="news-hd">
        <span class="chip ${kind.c}">${esc(kind.k)}</span>
        <span class="news-src">${esc(domainOf(h.u))}</span>
      </div>
      <div class="news-t">${esc(h.t)}</div>
      <div class="news-why">${esc(newsBlurb(h))}</div>
    </a>`;
  }).join("");
}

/* ------------------------------------------------ REVIEW ------ */
let revCard = null, revShown = false;

function viewReview() {
  const st = srsStats();
  if (st.total === 0) {
    return `
    <div class="page-head"><h2>Review</h2>
      <p>Spaced repetition. Cards appear here automatically as you cover material —
         nothing you haven't studied ever shows up.</p></div>
    <div class="empty"><div class="big">◱</div>
      <p>No cards yet. They unlock when you<br>
         complete a day, tick an interview question, or solve a DSA problem.</p></div>`;
  }

  const cards = srsCards();
  const queue = srsDue(cards);
  if (!revCard || !queue.some(c => c.id === revCard.id)) {
    revCard = queue[0] || null;
    revShown = false;
  }

  return `
  <div class="page-head">
    <h2>Review</h2>
    <p>Answer <b>out loud from memory</b> before revealing. The struggle to recall is what
       builds the memory — if it feels uncomfortable, it is working.</p>
  </div>

  <div class="stat-row">
    <div class="stat ${st.due ? "hot" : ""}"><div class="k">Due now</div>
      <div class="v">${st.due}</div><div class="s">${st.fresh} never seen</div></div>
    <div class="stat"><div class="k">In the deck</div><div class="v">${st.total}</div>
      <div class="s">grows as you study</div></div>
    <div class="stat"><div class="k">Mature</div><div class="v">${st.mature}</div>
      <div class="s">21+ day interval</div></div>
    <div class="stat"><div class="k">Done today</div><div class="v">${st.reviewedToday}</div>
      <div class="s">cards reviewed</div></div>
  </div>

  ${!revCard ? `
    <div class="card" style="text-align:center;padding:44px 20px">
      <div style="font-size:34px;margin-bottom:10px">✓</div>
      <div style="font-size:17px;font-weight:650;margin-bottom:6px">Nothing due today</div>
      <p style="color:var(--txt-2);font-size:13.5px;max-width:46ch;margin:0 auto">
        Come back tomorrow. Reviewing early doesn't help — the schedule is designed to
        catch you just before you forget.</p>
    </div>` : `
    <div class="rev">
      <div class="rev-meta">
        <span class="chip">${esc(revCard.src)}</span>
        <span class="chip ${TRACK_CHIP[revCard.tag] || ""}">${esc(revCard.tag)}</span>
        <span class="chip" style="margin-left:auto">${queue.length} left</span>
      </div>
      <div class="rev-front">${esc(revCard.front)}</div>
      ${revShown ? `
        <div class="rev-back">${esc(revCard.back)}</div>
        <div class="rev-btns">
          <button class="rev-b forgot" data-grade="0">Forgot<span>again tomorrow</span></button>
          <button class="rev-b hard"   data-grade="1">Hard<span>shorter gap</span></button>
          <button class="rev-b good"   data-grade="2">Good<span>normal gap</span></button>
          <button class="rev-b easy"   data-grade="3">Easy<span>longer gap</span></button>
        </div>`
      : `<button class="btn pri" id="revshow" style="margin-top:18px">Show answer</button>`}
    </div>`}

  ${st.leeches.length ? `
  <div class="card" style="margin-top:14px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--red);margin-bottom:10px">
      Sticking points — forgotten 4+ times</h4>
    <p style="font-size:13px;color:var(--txt-2);margin-bottom:10px">
      These aren't sticking. Don't just keep re-reading them — go back to the day and
      re-do the lab, or write the explanation out longhand.</p>
    ${st.leeches.slice(0, 6).map(c => `
      <div style="font-size:13.3px;color:var(--txt-2);padding:5px 0;border-top:1px solid var(--line)">
        <span class="chip red">${srsState(c.id).lapses}×</span>
        ${esc(c.front.split("\n")[0])}</div>`).join("")}
  </div>` : ""}`;
}

/* ------------------------------------------ APPLICATIONS ------ */
const APP_STAGES = ["applied", "oa", "phone", "onsite", "offer"];
const APP_LABEL = { applied: "Applied", oa: "OA / take-home", phone: "Phone screen",
                    onsite: "Onsite / final", offer: "Offer",
                    rejected: "Rejected", ghosted: "Ghosted" };
const APP_CHIP = { applied: "", oa: "blu", phone: "pur", onsite: "acc",
                   offer: "grn", rejected: "red", ghosted: "red" };

function appsFunnel() {
  const a = S.apps || [];
  const reached = s => a.filter(x => {
    if (x.status === "rejected" || x.status === "ghosted") {
      return APP_STAGES.indexOf(x.peak || "applied") >= APP_STAGES.indexOf(s);
    }
    return APP_STAGES.indexOf(x.status) >= APP_STAGES.indexOf(s);
  }).length;
  return APP_STAGES.map(s => ({ s, n: reached(s) }));
}

function viewApps() {
  const a = S.apps || [];
  const f = appsFunnel();
  const live = a.filter(x => !["rejected", "ghosted", "offer"].includes(x.status)).length;
  const ref = a.filter(x => x.src === "referral").length;
  const pct = (n, d) => d ? Math.round(n / d * 100) + "%" : "—";

  return `
  <div class="page-head">
    <h2>Applications</h2>
    <p>Track every application. The funnel tells you <b>where</b> you're losing —
       a low applied→OA rate is a resume problem; a low onsite→offer rate is an
       interviewing problem. Those need completely different fixes, and most people
       never find out which one they have.</p>
  </div>

  <div class="stat-row">
    <div class="stat"><div class="k">Applied</div><div class="v">${a.length}</div>
      <div class="s">${live} still live</div></div>
    <div class="stat"><div class="k">Interviewing</div>
      <div class="v">${a.filter(x => ["phone","onsite"].includes(x.status)).length}</div>
      <div class="s">phone or onsite</div></div>
    <div class="stat hot"><div class="k">Offers</div>
      <div class="v">${a.filter(x => x.status === "offer").length}</div>
      <div class="s">the only number that ends this</div></div>
    <div class="stat"><div class="k">Via referral</div><div class="v">${ref}</div>
      <div class="s">${pct(ref, a.length)} of applications</div></div>
  </div>

  ${a.length ? `
  <div class="card" style="margin-bottom:14px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:14px">
      Funnel</h4>
    <div class="phase-bar">
      ${f.map((x, i) => `
        <div class="phase-row">
          <div class="nm">${esc(APP_LABEL[x.s])}</div>
          <div class="bar"><i style="width:${f[0].n ? x.n / f[0].n * 100 : 0}%;
            background:${i === 4 ? "var(--grn)" : "var(--acc)"}"></i></div>
          <div class="pc">${x.n}${i ? ` · ${pct(x.n, f[i-1].n)}` : ""}</div>
        </div>`).join("")}
    </div>
    <p style="font-size:12px;color:var(--txt-3);margin-top:12px">
      Percentages are conversion from the previous stage. Rough benchmarks for students:
      applied→OA around 10–20%, onsite→offer around 20–35%. Well below on the first means
      fix the resume and get referrals; well below on the second means practise interviewing.</p>
  </div>` : ""}

  <div class="card" style="margin-bottom:14px">
    <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt-3);margin-bottom:12px">
      Add an application</h4>
    <div class="app-form">
      <input id="ac" placeholder="Company *">
      <input id="ar" placeholder="Role">
      <select id="at"><option value="coop">Co-op</option><option value="intern">Internship</option>
        <option value="ft">Full-time</option></select>
      <select id="as"><option value="cold">Cold apply</option><option value="referral">Referral</option>
        <option value="fair">Career fair</option><option value="recruiter">Recruiter reached out</option></select>
      <input id="au" placeholder="Link (optional)">
      <button class="btn pri" id="aadd">Add</button>
    </div>
  </div>

  ${a.length === 0 ? `
    <div class="empty"><div class="big">▤</div>
      <p>No applications yet. Day 63 is the big application sprint, but if you see
         something good before then, apply — co-op deadlines come earlier than you expect.</p></div>`
    : `<div>${a.slice().sort((x, y) => (y.date || "").localeCompare(x.date || "")).map(x => `
      <div class="app-row" data-app="${esc(x.id)}">
        <div style="flex:1;min-width:0">
          <div class="app-co">${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.co)}</a>` : esc(x.co)}
            <span class="chip">${esc(x.type)}</span>
            ${x.src === "referral" ? `<span class="chip grn">referral</span>` : `<span class="chip">${esc(x.src)}</span>`}
          </div>
          <div class="app-role">${esc(x.role || "—")} · applied ${esc(x.date || "—")}</div>
        </div>
        <select class="app-status" data-astatus="${esc(x.id)}">
          ${Object.keys(APP_LABEL).map(s =>
            `<option value="${s}" ${x.status === s ? "selected" : ""}>${esc(APP_LABEL[s])}</option>`).join("")}
        </select>
        <span class="chip ${APP_CHIP[x.status] || ""}">${esc(APP_LABEL[x.status])}</span>
        <button class="ds-flag" data-adel="${esc(x.id)}" title="Delete">✕</button>
      </div>`).join("")}</div>`}`;
}
