# AI Co-op 90

A self-designed 90-day AI/ML curriculum with progress tracking, built to go from *comfortable
with Python, new to ML* → *interview-ready for an AI/ML co-op*.

One topic per day. Every day has a clear explanation, a handwritten-style cheat note, curated
video links, a hands-on lab with a real deliverable, and interview questions to answer out loud.

**Open `index.html` in a browser. That's it — no build step, no install, no server.**

---

## What's in it

| | |
|---|---|
| **90 days** | 13 weeks · 6 phases · every day with explanation, cheat note, lab, videos, drills |
| **NeetCode 150** | All 150 problems, 18 patterns, scheduled ~2/day across days 3–84, each with the key idea |
| **6 projects** | Scheduled into the plan at days 28, 35, 49, 62, 76, 84 — plus 9 alternates |
| **89 interview questions** | 7 categories, each with key points, tickable when you can answer cold |
| **Progress tracking** | Completion, streak, per-phase progress, confidence ratings, daily notes |
| **Cheat note wall** | 90 AI notes + 18 DSA pattern notes, in one printable page |
| **Journey log** | Timeline of what you did when, with your own notes — your week-13 revision list |

### The curriculum arc

| Weeks | Phase | Covers |
|---|---|---|
| 1–2 | Foundations | NumPy, pandas, EDA, SQL, linear algebra, calculus, gradient descent, probability, stats |
| 3–5 | Classical ML | Framing & leakage, regression, regularisation, metrics, CV & pipelines, trees, ensembles, XGBoost, feature engineering, imbalance, clustering, PCA, recsys, A/B testing, time series, SHAP |
| 6–7 | Deep Learning | PyTorch, autograd, training loops, activations, losses, regularisation, normalisation, CNNs, augmentation, transfer learning, debugging, detection & segmentation |
| 8–9 | NLP & Transformers | Embeddings, RNN/LSTM, **attention from scratch**, transformer blocks, tokenisation/BPE, RoPE & FlashAttention, HuggingFace, BERT, GPT decoding, LoRA/QLoRA, LLM evaluation |
| 10–11 | LLM Engineering | Prompting, structured output & tool calling, vector DBs, **full RAG pipeline**, chunking, hybrid search & reranking, RAG evaluation, agents, MCP, prompt injection, cost & latency |
| 12–13 | MLOps & Interview | FastAPI/Docker/ONNX serving, experiment tracking, drift monitoring, **ML system design**, data engineering, then a 6-day interview sprint |

Interview prep runs **in parallel from week 2** — resume v1 goes out on day 14, applications
start in volume on day 63. Co-op deadlines arrive earlier than you feel ready for.

### The DSA track (NeetCode 150)

Runs as a **parallel track**, not a replacement for the daily AI topic. It appears on each day's
page as "today's set", and has its own page with all 150 problems grouped by pattern.

| Days | Patterns | Load |
|---|---|---|
| 1–2 | — | environment setup only |
| 3–14 | Arrays & Hashing · Two Pointers · Sliding Window · Stack | 2.25/day |
| 15–28 | Binary Search · Linked List · Trees | 2.4/day |
| 29–42 | Tries · Heap · Backtracking · Graphs | 2.3/day |
| 43–56 | Advanced Graphs · 1-D DP | 1.3/day — lighter, the AI track is heavy here |
| 57–70 | 2-D DP · Greedy | 1.4/day |
| 71–84 | Intervals · Math & Geometry · Bit Manipulation | 1.5/day |
| 85–90 | revision only — re-solve everything you flagged ↻ | — |

Each problem carries the **key idea**, not a restatement of the prompt. Each of the 18 patterns
has its own handwritten cheat note with the code template, recognition cues, and the trap.
Seven problems are LeetCode Premium — they're marked, use neetcode.io's free versions.

---

## How to use it (this matters more than the content)

**Daily shape: ~45 min concept → ~60 min lab → ~45 min DSA → ~15 min drill.** About 2h45.
On a bad day, do the DSA and the drill and skip the lab — never the reverse, because DSA
decays fastest without daily contact.

1. **Do the lab whenever you can.** Reading produces recognition; building produces knowledge.
2. **Copy each cheat note by hand** into a real notebook. That's why they're formatted as paper —
   handwriting is the encoding step.
3. **On DSA: attempt for 25 minutes before reading the key idea.** If you needed it, hit ↻ to flag
   the problem. Those flags *are* your week-13 revision list.
4. **Answer the interview drill out loud before revealing.** The struggle to recall is what
   strengthens memory. Recognising an answer feels like knowing and isn't.
5. **Write in the notes box daily.** Anything you looked up twice goes there.
6. **Export your progress every Sunday** (Settings → Export). It lives in browser localStorage,
   which is one cleared cache away from gone.
7. **Missing a day is fine. Missing a week is how sprints die.** Do a short day instead of none.

---

## Notes on design decisions

**Video links are YouTube searches, not video IDs.** Each link opens a search for the exact
title + channel. Video IDs rot; searches don't. Take the top result from the named channel.

**No framework, no build step.** Plain HTML/CSS/JS with data in `window.*` globals rather than
`fetch`ed JSON, specifically so `file://` works — double-click and it runs. Deploy by dropping
the folder on GitHub Pages, Netlify, or Vercel.

**Progress is local-first.** No backend, no account, no telemetry. The tradeoff is that it lives
in one browser, hence the export button.

**The cheat notes are deliberately terse and slightly cryptic.** They're memory hooks for
something you already understood that day, not a substitute for the explanation.

---

## Files

```
index.html                    shell + nav
css/style.css                 all styling (incl. handwritten paper notes + print stylesheet)
js/app.js                     routing, state, all views
js/data/curriculum-p1.js      days  1–30   Foundations → Trees & Ensembles
js/data/curriculum-p2.js      days 31–60   DS toolkit → PyTorch → CNNs → Transformers
js/data/curriculum-p3.js      days 61–90   LLM engineering → RAG → Agents → MLOps → Interview
js/data/dsa.js                NeetCode 150 by pattern + the day-range schedule
js/data/projects.js           15 project ideas, tiered
js/data/interview.js          89 interview questions across 7 rounds
```

Editing a day is just editing an object in the relevant `curriculum-p*.js` file — the schema is
`{ d, w, phase, track, title, hook, why, learn[], cheat{}, vids[], lab{}, qs[], tags[] }`.

**To reshape the DSA pace**, edit `DSA_PLAN` at the bottom of `dsa.js` — it's a list of
`{ from, to, cats }` blocks, and problems are distributed evenly across each block's days
automatically. Widening a block's day range immediately lightens every day inside it.

---

## Deploying it

```bash
cd /Users/vicky/Start/ai-coop-90 && git init && git add -A && git commit -m "AI Co-op 90: self-directed curriculum + tracker"
```

Then push to GitHub and enable Pages (Settings → Pages → deploy from `main`, root).
Free, and the live URL belongs on your resume — this tracker is itself project #15 in the bank,
because "identified a gap, designed a 90-day system, executed it" is exactly the trait co-op
managers screen for.
