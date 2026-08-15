/* ============================================================
   PHASE 5-6 :: Days 61-90
   LLM Engineering -> RAG -> Agents -> MLOps -> Interview Sprint
   ============================================================ */

window.CURRICULUM_P3 = [

/* ---------- WEEK 9 (cont) ---------- */
{
  d: 61, w: 9, phase: "NLP & Transformers", track: "LLM",
  title: "Evaluating LLMs — The Hardest Unsolved Problem",
  hook: "Anyone can build a demo. Proving it works is the actual job.",
  why: "Evaluation is the number one thing separating a toy LLM project from a production one, and it is where most candidates have nothing to say. Having a real eval story makes your projects credible.",
  learn: [
    { h: "Why LLM evaluation is genuinely hard",
      p: "There is no single correct output. Two responses can be equally good with zero token overlap, so exact-match and BLEU-style metrics are nearly useless for open-ended generation. You need task-specific criteria, and you must define them before you build, or you will unconsciously grade toward whatever your system already does." },
    { h: "The evaluation ladder",
      p: "Deterministic checks first — does it parse as valid JSON, does it contain the required fields, is it within length limits. Then reference-based metrics where a gold answer exists. Then LLM-as-judge with an explicit rubric for subjective quality. Then human review on a sample. Use the cheapest method that answers the question." },
    { h: "LLM-as-judge, done carefully",
      p: "It correlates reasonably with human judgement but has known biases: it prefers longer answers, favours the first option presented, and rates its own family of models higher. Mitigate by randomising position, using a detailed rubric with explicit scoring anchors, requiring reasoning before the score, and calibrating against a set of human-labelled examples." },
    { h: "Build a golden set early",
      p: "Fifty to two hundred carefully chosen input-output pairs covering typical cases, edge cases, and known failures. Run it on every change. This turns 'it seems better' into a number and is the single highest-value artefact in an LLM project. Benchmarks like MMLU tell you about general models, not about your application." }
  ],
  cheat: {
    title: "LLM Eval Card",
    pts: [
      "define criteria BEFORE building",
      "1. deterministic checks (JSON valid, fields)",
      "2. reference metrics if gold answers exist",
      "3. LLM-as-judge w/ explicit rubric",
      "4. human review on a sample",
      "golden set: 50-200 curated cases",
      "judge biases: length, position, self-preference",
      "-> randomise order, reason-then-score",
      "regression-test every prompt change"
    ],
    eq: ["pass@k, exact match, faithfulness, relevance, latency p95, cost/req"],
    warn: "Public benchmark scores do not transfer to your task. A model topping MMLU can be worse than a small one on your specific extraction problem. Always evaluate on your own data."
  },
  vids: [
    { t: "How to evaluate LLM applications", ch: "LangChain" },
    { t: "LLM as a judge evaluation explained", ch: "Weights and Biases" }
  ],
  lab: {
    t: "Build an eval harness you reuse all sprint",
    steps: [
      "Pick an LLM task (extraction, summarisation, or Q&A)",
      "Write 50 golden examples covering typical, edge, and adversarial cases",
      "Implement deterministic checks plus an LLM-judge with a written rubric",
      "Score two different prompts and two different models; produce a comparison table",
      "Validate the judge: hand-label 20 outputs yourself and measure agreement with the judge"
    ],
    out: "src/evals/ — the artefact that makes every later LLM project credible."
  },
  qs: [
    { q: "How would you evaluate an LLM-powered summarisation feature?",
      a: "Start by defining what good means with stakeholders — likely faithfulness to the source, coverage of key points, and length compliance. Build a golden set of 100 documents with human-written references and known edge cases. Layer the evaluation: deterministic length and format checks, reference-based similarity as a weak signal, an LLM judge scoring faithfulness and coverage against an explicit rubric, and periodic human review. Critically, I would validate the judge against human labels before trusting it, and track cost and p95 latency alongside quality since those are real product constraints." },
    { q: "What are the pitfalls of LLM-as-judge?",
      a: "Position bias, where the option presented first is favoured; length bias toward verbose answers; self-preference for outputs from the same model family; and poor calibration where scores cluster in a narrow band. Mitigations are randomising presentation order, using a detailed rubric with concrete anchors for each score level, requiring the judge to reason before scoring, using pairwise comparison rather than absolute scores, and validating against human labels on a held-out sample." }
  ],
  tags: ["evaluation", "llm-judge", "interview"]
},
{
  d: 62, w: 9, phase: "NLP & Transformers", track: "Project",
  title: "PROJECT 4 — Fine-Tuned NLP Model",
  hook: "Prove you can adapt a model, not just call one.",
  why: "The fine-tuning skill is what separates AI engineers from API users. This project demonstrates the full loop: data curation, training, evaluation, and deployment.",
  learn: [
    { h: "The data is the project",
      p: "Fine-tuning quality is dominated by data quality, not hyperparameters. Five hundred carefully curated, consistent examples beat five thousand noisy ones. Document how you collected, cleaned, and validated your dataset — reviewers care far more about that than about your learning rate." },
    { h: "Always show the baseline",
      p: "Report base model, prompted base model, and fine-tuned model on the same eval. If prompting alone gets 90% of the benefit, say so honestly — that reads as good judgement, not weakness. Fake improvements get caught in interviews." }
  ],
  cheat: {
    title: "Project 4 Rubric",
    pts: [
      "[ ] documented data collection + curation",
      "[ ] 300+ high-quality examples, held-out split",
      "[ ] baselines: base, base+prompt, then fine-tuned",
      "[ ] LoRA/QLoRA w/ documented config + rank ablation",
      "[ ] eval harness from day 61, real numbers",
      "[ ] error analysis on failures",
      "[ ] model + dataset card on HuggingFace Hub",
      "[ ] Gradio demo deployed",
      "[ ] cost + latency reported"
    ],
    eq: ["500 clean examples > 5000 noisy ones. Every time."],
    warn: "If your fine-tune barely beats good prompting, report that honestly and explain why. Interviewers respect the judgement far more than an inflated claim they can poke holes in."
  },
  vids: [
    { t: "Fine tune an llm end to end project", ch: "Sam Witteveen" }
  ],
  lab: {
    t: "Ship Project 4",
    steps: [
      "Choose a task with a clear format the base model handles poorly (structured extraction, domain-specific style, a niche classification schema)",
      "Curate the dataset; document every decision",
      "Work through the rubric completely",
      "Push model and dataset cards to the Hub; deploy the demo",
      "Update resume v4"
    ],
    out: "A fine-tuned model on the Hub with an honest evaluation."
  },
  qs: [
    { q: "Walk me through your fine-tuning project.",
      a: "Lead with the problem and why prompting was insufficient, then the data — how many examples, how collected, how validated — because that is what determines quality. Then the method and why LoRA over full fine-tuning given the compute constraint. Then the evaluation with baselines, including the prompted base model, and honest numbers. Then error analysis and limitations. Interviewers probe hardest on data quality and evaluation, so spend your airtime there rather than on hyperparameters." }
  ],
  tags: ["project", "fine-tuning", "milestone"]
},
{
  d: 63, w: 9, phase: "NLP & Transformers", track: "Review",
  title: "Week 9 — Applications Sprint",
  hook: "Halfway. Time to make the job search real.",
  why: "You now have four projects and two months of depth. Applications should be going out in volume. The single biggest predictor of co-op outcomes is application count times quality, and most students under-apply badly.",
  learn: [
    { h: "Volume and targeting both matter",
      p: "Aim for a portfolio of applications: a handful of dream roles with genuinely tailored materials, a larger set of good-fit roles with light tailoring, and a broad base of reasonable-fit roles applied to efficiently. Pure spray gets low conversion; pure precision gets too few shots." },
    { h: "Referrals dominate cold applications",
      p: "A referral converts at several times the rate of a cold application. Use NEU alumni on LinkedIn — a short, specific message referencing something real about their work, with a clear small ask, works far better than a generic connection request." },
    { h: "Your projects are your differentiator",
      p: "Most applicants have coursework. You have shipped models with live demos, honest evaluation, and public write-ups. Make that impossible to miss: links at the top of the resume, a pinned GitHub README, and a LinkedIn featured section." }
  ],
  cheat: {
    title: "Application Card",
    pts: [
      "resume: projects ABOVE coursework",
      "every bullet: action + method + NUMBER",
      "1 page. no photo. no skill bars.",
      "tailor the top 3 bullets per role",
      "referral > cold apply, by a lot",
      "alumni msg: specific + short + small ask",
      "track every application in a sheet",
      "target: steady weekly volume, not bursts"
    ],
    eq: ["outcome ~ (applications x quality x referral_rate)"],
    warn: "Do not wait until you 'feel ready'. Nobody feels ready. Applications submitted in week 9 with four projects beat perfect applications submitted after the deadline."
  },
  vids: [
    { t: "How to get referrals on linkedin for internships", ch: "Jeff Su" },
    { t: "Machine learning resume tips", ch: "Ken Jee" }
  ],
  lab: {
    t: "Application infrastructure day",
    steps: [
      "Rebuild the resume with all 4 projects, quantified, one page",
      "Update LinkedIn: headline, about section, featured projects with demo links",
      "Pin your best 4 repos on GitHub; make sure every README has a demo GIF or key chart at the top",
      "Build an application tracker (company, role, date, referral, status, notes)",
      "Send 10 applications and 5 alumni outreach messages today"
    ],
    out: "Applications actively in flight + a tracking system."
  },
  qs: [
    { q: "Walk me through your resume.",
      a: "Ninety seconds, structured as a narrative rather than a list: where you are academically, the deliberate decision to go deep on ML and how you structured that, then the two projects most relevant to this specific role with the problem and the measurable result, then what you are looking for next and why this team. End with a question. Never read the resume aloud — they can read." }
  ],
  tags: ["applications", "resume", "networking"]
},

/* ---------- WEEK 10 : LLM Engineering & RAG ---------- */
{
  d: 64, w: 10, phase: "LLM Engineering", track: "LLM",
  title: "Prompt Engineering That Actually Works",
  hook: "Not tricks. Specification writing.",
  why: "Every LLM application starts here, and the difference between a sloppy prompt and a well-structured one is often larger than the difference between two model generations.",
  learn: [
    { h: "A prompt is a specification",
      p: "State the role, the task, the constraints, the output format, and the edge-case handling explicitly. Ambiguity in the prompt becomes variance in the output. If you cannot write down what a correct answer looks like, the model cannot produce one reliably." },
    { h: "Few-shot examples beat instructions",
      p: "Showing three well-chosen examples usually outperforms three paragraphs of description, because examples pin down format, tone, and edge-case handling simultaneously. Choose examples that cover the boundaries of the task, not the easy centre, and keep them consistent in style." },
    { h: "Chain-of-thought and its cost",
      p: "Asking the model to reason step by step before answering substantially improves accuracy on multi-step problems, because it gives the model more computation per answer. The cost is tokens and latency. For structured extraction, put reasoning in a separate field so downstream parsing stays clean." },
    { h: "Structure and delimiters",
      p: "Use clear section markers, put instructions before long context, place the most important constraints at the beginning and end (models attend less reliably to the middle of long inputs), and delimit user-supplied content explicitly so injected instructions inside it are less likely to be followed." }
  ],
  cheat: {
    title: "Prompting Card",
    pts: [
      "role + task + constraints + format + edge cases",
      "3 good examples > 3 paragraphs of rules",
      "pick BOUNDARY examples, not easy ones",
      "CoT for multi-step reasoning (costs tokens)",
      "instructions BEFORE long context",
      "key constraints at START and END (lost middle)",
      "delimit user content clearly (injection defence)",
      "temp=0 for anything structured",
      "iterate against your day-61 eval set"
    ],
    eq: ["specificity + examples + format spec + eval loop"],
    warn: "Never tune prompts by vibes. Change one thing, run your golden set, record the number. Otherwise you will spend a week making things quietly worse."
  },
  vids: [
    { t: "Prompt engineering guide best practices", ch: "Anthropic" },
    { t: "Advanced prompt engineering techniques", ch: "Matt Wolfe" }
  ],
  lab: {
    t: "Systematic prompt improvement",
    steps: [
      "Take your day-61 task and eval set",
      "V1: a naive one-line prompt. Score it.",
      "V2: add role, explicit constraints, and output format. Score.",
      "V3: add 3 boundary few-shot examples. Score.",
      "V4: add chain-of-thought in a separate reasoning field. Score.",
      "Plot score, token cost, and latency across all four. Find the best value point."
    ],
    out: "A quantified prompt-improvement curve — a great interview artefact."
  },
  qs: [
    { q: "How do you improve a prompt systematically?",
      a: "Build an eval set first — 50 to 100 cases with known good outputs — so improvement is measurable rather than felt. Then change one thing at a time and rerun: add explicit format specification, add few-shot examples chosen from the boundaries of the task, add chain-of-thought if the task is multi-step, and reorder so key constraints are not buried in the middle. Track quality, token cost, and latency together, because the best prompt is not always the highest-scoring one." },
    { q: "When does chain-of-thought help and when does it hurt?",
      a: "It helps on multi-step reasoning, arithmetic, and tasks where intermediate structure matters, because the generated tokens act as working memory and give the model more computation before committing. It hurts on simple classification or extraction, where it adds latency and cost, and it can introduce errors by letting the model talk itself into a wrong conclusion. It also complicates parsing unless the reasoning is isolated in its own output field." }
  ],
  tags: ["prompting", "few-shot", "chain-of-thought"]
},
{
  d: 65, w: 10, phase: "LLM Engineering", track: "LLM",
  title: "Structured Output & Tool Calling",
  hook: "Turning a text generator into a reliable software component.",
  why: "Every real LLM feature needs the output to be parseable. Knowing the difference between asking nicely for JSON and constrained decoding is a genuine engineering distinction.",
  learn: [
    { h: "Asking for JSON is not the same as guaranteeing it",
      p: "Prompting for JSON works most of the time, and 'most of the time' is a production incident. Modern APIs support constrained decoding against a schema, which masks invalid tokens during generation so the output is structurally valid by construction. Use the schema-enforced mode whenever it is available." },
    { h: "Define schemas with a validator",
      p: "Use Pydantic or Zod as the single source of truth: generate the JSON schema from it, pass that to the model, and validate the response against it. Now your types, your prompt, and your runtime check cannot drift apart, and validation failures give you actionable errors." },
    { h: "Tool calling is structured output with a dispatch loop",
      p: "You describe available functions with their schemas; the model emits a call with arguments; your code executes it and feeds the result back; the model continues. The model never runs anything — your code does, which is exactly where authorisation and validation belong." },
    { h: "Handle failure explicitly",
      p: "Always validate, and on failure retry once with the validation error included in the prompt, which usually fixes it. Give the model an explicit way to say 'I cannot determine this' — a nullable field or a refusal option — otherwise it will fabricate a value to satisfy the schema." }
  ],
  cheat: {
    title: "Structured Output Card",
    pts: [
      "prefer SCHEMA-ENFORCED mode over 'please output JSON'",
      "Pydantic/Zod = source of truth -> schema -> validate",
      "temperature 0 for structured tasks",
      "on parse fail: retry once WITH the error message",
      "give an explicit 'unknown'/null option",
      "  else the model invents values",
      "tool calling: model proposes, YOUR CODE executes",
      "validate tool args before executing. always."
    ],
    eq: ["describe tools -> model emits call -> you execute -> feed result -> repeat"],
    warn: "Never execute a tool call without validating its arguments. The model can be manipulated by content in its context into requesting something you did not intend."
  },
  vids: [
    { t: "Structured outputs from llms json schema", ch: "Jason Liu" },
    { t: "Function calling tool use llm explained", ch: "Sam Witteveen" }
  ],
  lab: {
    t: "Build a reliable extraction service",
    steps: [
      "Define a Pydantic model for something non-trivial (invoice with line items, or a resume parser)",
      "Extract from 30 messy real documents; measure the parse success rate with plain prompting",
      "Switch to schema-enforced output; measure again",
      "Add validation with retry-on-error and measure the final success rate",
      "Then build a 2-tool agent loop (calculator + web search or a local lookup) and trace every step"
    ],
    out: "src/extract.py with a measured reliability number — not a vibe."
  },
  qs: [
    { q: "How do you get reliable JSON out of an LLM?",
      a: "Use schema-constrained decoding where the provider supports it, since it masks invalid tokens during generation and makes malformed output structurally impossible rather than merely unlikely. Define the schema from a Pydantic or Zod model so types, prompt, and validation share one source of truth. Set temperature to zero, validate every response, and on failure retry once including the validation error in the prompt. And always give the model an explicit null or unknown option so it does not fabricate values to satisfy required fields." },
    { q: "How does tool calling work under the hood?",
      a: "You pass function definitions with JSON schemas alongside the conversation. The model, rather than emitting prose, emits a structured call naming a function and its arguments. Your application parses that, validates the arguments, executes the function itself, and appends the result to the conversation. The model then continues with that information. The key point is that the model only ever proposes — execution and authorisation stay entirely in your code." }
  ],
  tags: ["structured-output", "tool-calling", "pydantic"]
},
{
  d: 66, w: 10, phase: "LLM Engineering", track: "RAG",
  title: "Embeddings & Vector Databases",
  hook: "Day 8's cosine similarity, now at production scale.",
  why: "Vector search is the retrieval half of RAG. Understanding ANN indexes and their recall tradeoffs is what lets you debug a retrieval system rather than guess at it.",
  learn: [
    { h: "Modern embedding models",
      p: "Sentence-transformer style models trained contrastively map text into a space where cosine similarity tracks semantic relatedness. Key selection criteria: dimensionality (affects storage and speed), max sequence length, multilingual support, and score on the MTEB benchmark for retrieval specifically. Many models also expect an instruction prefix for queries versus documents — using it wrong quietly degrades retrieval." },
    { h: "Exact vs approximate nearest neighbour",
      p: "Exact search is a full scan: perfect recall, linear cost, fine up to roughly a hundred thousand vectors. Beyond that you need an ANN index, which trades a small amount of recall for orders-of-magnitude speedup. Knowing that ANN is approximate — and measuring your actual recall — is the mark of someone who has debugged a real system." },
    { h: "Index types",
      p: "HNSW builds a navigable small-world graph: excellent recall and speed, higher memory. IVF partitions the space into clusters and searches only the nearest few: lower memory, tunable via nprobe. Product quantisation compresses vectors to cut memory dramatically at some accuracy cost. Most systems use HNSW or IVF plus PQ." },
    { h: "Choosing a vector store",
      p: "pgvector when you already run Postgres and want one database with transactional consistency and easy metadata filtering — usually the right default. Qdrant, Weaviate, or Milvus for dedicated scale and richer filtering. Pinecone for fully managed. FAISS as an in-process library with no server. Choose by operational simplicity first." }
  ],
  cheat: {
    title: "Vector Search Card",
    pts: [
      "embed -> store vector + metadata -> ANN search",
      "cosine similarity (normalise first!)",
      "<100k vectors: brute force is FINE",
      "HNSW: graph, fast + high recall, more RAM",
      "IVF: cluster + probe n, tune nprobe",
      "PQ: compress, big memory win, some accuracy loss",
      "ANN is APPROXIMATE -> measure recall@k",
      "check if your model needs query/doc prefixes",
      "pgvector = boring, correct default"
    ],
    eq: ["recall@k = |retrieved_k ∩ true_top_k| / k"],
    warn: "Metadata filtering plus ANN is subtle: pre-filtering can wreck the index graph, post-filtering can return too few results. Check how your chosen store handles it before designing around it."
  },
  vids: [
    { t: "Vector databases explained", ch: "Fireship" },
    { t: "HNSW algorithm explained vector search", ch: "James Briggs" }
  ],
  lab: {
    t: "Benchmark your own retrieval",
    steps: [
      "Embed 10k documents with two different embedding models",
      "Implement brute-force cosine search as ground truth",
      "Build an HNSW index with FAISS; measure recall@10 versus brute force, and latency for both",
      "Sweep the HNSW ef_search parameter and plot the recall-versus-latency curve",
      "Set the same thing up in pgvector and compare the developer experience"
    ],
    out: "A recall/latency curve you generated — instantly credible in an interview."
  },
  qs: [
    { q: "How does a vector database find nearest neighbours quickly?",
      a: "It uses approximate nearest neighbour indexes rather than scanning every vector. HNSW builds a multi-layer navigable graph where search starts at a coarse layer and descends, giving logarithmic-ish search at high recall but with substantial memory overhead. IVF clusters the space and only searches the nearest clusters, controlled by an nprobe parameter, and is often combined with product quantisation to compress vectors. The essential point is that these are approximate, so you should measure recall against brute force on your own data rather than assuming it." },
    { q: "When do you actually need a vector database?",
      a: "Less often than people assume. Under roughly a hundred thousand vectors, brute-force cosine similarity in NumPy or pgvector's exact search is fast enough and simpler to operate. A dedicated vector store earns its complexity at larger scale, or when you need sophisticated metadata filtering, distributed operation, or high write throughput. If the team already runs Postgres, pgvector usually wins on operational simplicity." }
  ],
  tags: ["embeddings", "vector-db", "ann", "hnsw"]
},
{
  d: 67, w: 10, phase: "LLM Engineering", track: "RAG",
  title: "RAG — The Full Pipeline",
  hook: "The single most in-demand AI engineering skill right now.",
  why: "RAG is the default architecture for LLM applications over private data. Being able to draw the pipeline and name the failure mode at each stage is the most employable thing in this entire curriculum.",
  learn: [
    { h: "The pipeline, stage by stage",
      p: "Ingestion: load, parse, chunk, embed, index — done offline. Retrieval: embed the query, search, filter, optionally rerank. Generation: build a prompt with the retrieved context, generate an answer, and attach citations. Each stage has its own failure modes and its own metrics." },
    { h: "Why RAG rather than fine-tuning for knowledge",
      p: "You can update the index in seconds without retraining. You can cite sources, which is often a hard requirement. You can enforce access control at retrieval time so users only see documents they are entitled to. And you reduce hallucination because the answer is grounded in retrieved text. Fine-tuning gives you none of these." },
    { h: "Where RAG systems actually fail",
      p: "Retrieval failure — the right chunk was never returned, and no amount of prompt work fixes it. Chunking failure — the answer was split across chunk boundaries. Ranking failure — the right chunk was retrieved but buried below noise. Generation failure — the context was correct but the model ignored or misread it. Diagnose in that order, because retrieval failures dominate." },
    { h: "Measure retrieval separately from generation",
      p: "Most teams evaluate only the final answer and then cannot tell what is broken. Measure retrieval with recall@k and precision@k against known-relevant documents, and generation with faithfulness and answer relevance. Separating them turns debugging from guesswork into a decision." }
  ],
  cheat: {
    title: "RAG Pipeline Card",
    pts: [
      "INGEST: load > parse > chunk > embed > index",
      "RETRIEVE: embed q > search > filter > rerank",
      "GENERATE: context + q > answer + CITATIONS",
      "failure order: retrieval > chunking > rank > gen",
      "always measure retrieval SEPARATELY",
      "recall@k first. if the chunk isn't there, stop.",
      "RAG for FACTS, fine-tune for FORM",
      "cite sources or users won't trust it",
      "access control belongs at RETRIEVAL time"
    ],
    eq: ["answer_quality <= retrieval_quality. It is a hard ceiling."],
    warn: "If recall@10 is 60%, your system's best possible accuracy is 60%. Fix retrieval before touching the generation prompt. Most teams do this backwards and waste weeks."
  },
  vids: [
    { t: "RAG retrieval augmented generation explained", ch: "IBM Technology" },
    { t: "Build a RAG application from scratch", ch: "LangChain" }
  ],
  lab: {
    t: "Build RAG from scratch, no framework",
    steps: [
      "Pick a corpus you care about (your own notes, a textbook, NEU course docs, a codebase)",
      "Write ingestion yourself: parse, chunk, embed, store — no LangChain",
      "Write retrieval and prompt assembly with explicit citation formatting",
      "Create 30 question-answer pairs with known source chunks",
      "Measure recall@5 and answer faithfulness separately. Record both numbers."
    ],
    out: "A RAG system you fully understand, with two real metrics."
  },
  qs: [
    { q: "Design a RAG system for a company's internal documentation.",
      a: "Ingestion runs offline: parse each format, chunk with structure awareness and overlap, embed, and index alongside metadata for source, permissions, and recency. At query time: embed the query, run hybrid search combining vector and keyword retrieval, filter by the user's access permissions, rerank the top 50 down to the top 5 with a cross-encoder, and assemble a prompt with explicit citation instructions. I would measure retrieval recall and generation faithfulness separately, cache aggressively, and handle the no-relevant-results case by declining rather than guessing. Access control at retrieval time is non-negotiable — the model must never see documents the user cannot access." },
    { q: "Your RAG system gives wrong answers. How do you debug?",
      a: "Isolate the stage. First check whether the correct chunk was retrieved at all by inspecting the top-k against known-relevant documents — if recall is the problem, nothing downstream can fix it, and I would look at chunking strategy, embedding model fit, and whether hybrid search would help with exact terms like error codes. If retrieval is fine, check ranking: was the right chunk present but buried, in which case add a reranker. If the right context was in the prompt and the answer is still wrong, it is a generation problem — prompt clarity, context ordering given the lost-in-the-middle effect, or model capability." }
  ],
  tags: ["rag", "retrieval", "architecture", "interview"]
},
{
  d: 68, w: 10, phase: "LLM Engineering", track: "RAG",
  title: "Chunking — The Underrated Half of RAG",
  hook: "Where most RAG systems quietly fail.",
  why: "Chunking is unglamorous and it determines your recall ceiling. Having strong opinions here, backed by measurement, immediately marks you as someone who has actually built RAG.",
  learn: [
    { h: "The fundamental tension",
      p: "Small chunks give precise retrieval but may lack the context needed to answer. Large chunks carry context but dilute the embedding — a single vector representing 2000 words is a blurry average that matches everything and nothing. The right answer depends on your documents and your query patterns, and must be measured." },
    { h: "Strategies, roughly in order of sophistication",
      p: "Fixed-size with overlap is the naive baseline. Recursive splitting respects paragraph and sentence boundaries and is a solid default. Structure-aware splitting uses document structure — markdown headings, code functions, HTML sections — and is usually best when structure exists. Semantic chunking splits where embedding similarity drops between sentences. Late chunking embeds the full document then pools per chunk, preserving global context." },
    { h: "Small-to-big retrieval",
      p: "Index small precise chunks for matching, but return the larger parent section to the model for generation. This resolves the tension directly: precision in retrieval, context in generation. It is one of the highest-value techniques and it is easy to implement." },
    { h: "Enrich chunks with metadata",
      p: "Prepend the document title and section headings to each chunk before embedding, so an isolated paragraph carries its context into the vector. Store source, page, date, and permissions alongside for filtering and citation. Contextual retrieval — using an LLM to write a one-line situating summary for each chunk — measurably improves recall at ingestion-time cost." }
  ],
  cheat: {
    title: "Chunking Card",
    pts: [
      "small = precise match, weak context",
      "big = rich context, blurry embedding",
      "start: recursive split, ~500 tok, 10-15% overlap",
      "better: split on STRUCTURE (headings/functions)",
      "small-to-big: index small, RETURN parent",
      "prepend title + headings before embedding",
      "store metadata: source, page, date, permissions",
      "contextual retrieval: LLM-written chunk summary",
      "MEASURE recall@k per strategy. no guessing."
    ],
    eq: ["chunk_text = doc_title + ' > ' + section_heading + '\\n' + body"],
    warn: "Splitting a table, code function, or numbered list across chunks destroys it. Structure-aware chunking is not a refinement — it is the difference between working and not."
  },
  vids: [
    { t: "Chunking strategies for RAG", ch: "Greg Kamradt" },
    { t: "Advanced RAG chunking techniques", ch: "LlamaIndex" }
  ],
  lab: {
    t: "Chunking bake-off",
    steps: [
      "Using your day-67 corpus and question set, implement 4 strategies: fixed, recursive, structure-aware, and small-to-big",
      "Measure recall@5 for each. Build the comparison table.",
      "Sweep chunk size in [200, 500, 1000, 2000] tokens for the best strategy",
      "Add title and heading prefixes and measure the delta",
      "Write up which won on your data and, importantly, why"
    ],
    out: "A measured chunking recommendation — very few candidates have this."
  },
  qs: [
    { q: "How do you choose a chunking strategy?",
      a: "Empirically, against a labelled question set with known relevant sources, measuring recall@k. As a starting point I use recursive splitting at around 500 tokens with 10-15% overlap, but I move to structure-aware splitting whenever the documents have real structure like markdown headings or code functions, since splitting mid-table or mid-function destroys meaning. I also prepend document and section titles to each chunk before embedding so isolated passages retain context, and I use small-to-big retrieval — index small chunks for precision, return the parent section for context." },
    { q: "Why does chunk size matter so much?",
      a: "Because a chunk is compressed into a single fixed-size vector. A large chunk covering several topics produces an averaged embedding that is not strongly similar to any specific query, hurting retrieval precision. A very small chunk embeds cleanly but may not contain enough information for the model to answer, and it fragments multi-sentence reasoning. Chunk size therefore sets a hard ceiling on retrieval quality, which is why it must be measured rather than assumed." }
  ],
  tags: ["chunking", "rag", "retrieval"]
},
{
  d: 69, w: 10, phase: "LLM Engineering", track: "RAG",
  title: "Hybrid Search & Reranking",
  hook: "The two upgrades that fix most bad RAG systems.",
  why: "Vector search alone fails on exact identifiers, product codes, and rare terms. Hybrid search plus reranking is the standard production fix and naming it demonstrates real experience.",
  learn: [
    { h: "Why pure vector search fails",
      p: "Embeddings capture semantics but blur exact tokens. A query for error code 'E4092' or a specific person's name may retrieve semantically similar but literally wrong documents. BM25 keyword search handles exact matching perfectly. They fail in different ways, which is exactly why combining them works." },
    { h: "Hybrid retrieval and fusion",
      p: "Run both retrievers and combine. Reciprocal Rank Fusion is the robust default: score each document as the sum over retrievers of 1/(k + rank), which needs no score normalisation and is insensitive to the different score scales the two methods produce. Weighted score fusion works too but requires calibration." },
    { h: "Cross-encoder reranking",
      p: "Bi-encoders embed query and document separately, which is fast and cacheable but cannot model their interaction. A cross-encoder processes the query and document together and scores relevance directly — far more accurate, far too slow for the whole corpus. The standard pattern is retrieve 50-100 cheaply, then rerank down to 3-5 accurately." },
    { h: "Query transformation",
      p: "Rewrite vague queries into explicit ones using conversation history. Generate multiple query variants and union the results to improve recall. HyDE generates a hypothetical answer and embeds that instead of the question, which often matches document phrasing better than a question does. Each costs a model call, so measure whether it earns its latency." }
  ],
  cheat: {
    title: "Retrieval Quality Card",
    pts: [
      "vector: semantic, fuzzy | BM25: exact, literal",
      "hybrid = both. RRF to fuse:",
      "  score = sum 1/(60 + rank_i)",
      "bi-encoder: fast, precompute, less accurate",
      "cross-encoder: slow, accurate, no precompute",
      "pattern: retrieve 50 cheap -> rerank to 5",
      "reranking is usually the single biggest win",
      "query rewrite for multi-turn conversations",
      "HyDE: embed a hypothetical ANSWER"
    ],
    eq: ["RRF(d) = sum over retrievers of 1 / (k + rank_r(d)),  k=60"],
    warn: "Reranking adds real latency — a cross-encoder over 50 candidates can cost 100-300ms. Budget for it, and cache aggressively on repeated queries."
  },
  vids: [
    { t: "Hybrid search BM25 and vector search", ch: "Weaviate" },
    { t: "Rerankers explained cross encoder RAG", ch: "James Briggs" }
  ],
  lab: {
    t: "Stack the retrieval upgrades",
    steps: [
      "Baseline: your day-68 best vector-only setup. Record recall@5.",
      "Add BM25 and fuse with RRF. Record.",
      "Add a cross-encoder reranker over the top 50. Record.",
      "Add query rewriting for multi-turn. Record.",
      "Build a table of recall@5, p95 latency, and cost for each stage — then recommend a configuration"
    ],
    out: "A retrieval upgrade ladder with measured cost/benefit at each rung."
  },
  qs: [
    { q: "What is hybrid search and why does it help?",
      a: "It combines dense vector retrieval with sparse keyword retrieval like BM25. Vector search captures semantic similarity but blurs exact tokens, so it fails on identifiers, product codes, rare names, and precise terminology. BM25 handles those perfectly but misses paraphrases. Fusing them — typically with Reciprocal Rank Fusion, which combines ranks rather than incomparable scores — covers both failure modes and reliably improves recall over either alone." },
    { q: "Why use a reranker if you already have vector search?",
      a: "Vector search uses a bi-encoder that embeds query and document independently, which is necessary for precomputation and speed but means the model never sees them together and cannot reason about their interaction. A cross-encoder processes the pair jointly and produces a much more accurate relevance score, but is far too slow to run over a whole corpus. So you retrieve a broad candidate set cheaply and rerank a small set accurately — in practice this is often the single largest quality improvement in a RAG pipeline." }
  ],
  tags: ["hybrid-search", "reranking", "bm25", "rrf"]
},
{
  d: 70, w: 10, phase: "LLM Engineering", track: "RAG",
  title: "RAG Evaluation & The Retrieval Metrics",
  hook: "Numbers, not vibes. This is what makes you hireable.",
  why: "Almost every candidate can build a RAG demo. Very few can tell you its recall@5 and faithfulness score. That gap is your opportunity.",
  learn: [
    { h: "Retrieval metrics",
      p: "Recall@k: what fraction of relevant documents appear in the top k — the ceiling on everything downstream. Precision@k: what fraction of the top k are relevant, which matters because irrelevant context degrades generation. MRR: how high the first relevant result ranks. NDCG: rank-weighted relevance for graded judgements." },
    { h: "Generation metrics",
      p: "Faithfulness: is every claim in the answer supported by the retrieved context — this is the hallucination measure. Answer relevance: does it actually address the question. Context precision: is the retrieved context ranked usefully. The RAGAS framework operationalises these with LLM judges." },
    { h: "Building the labelled set",
      p: "You need questions paired with known-relevant source chunks. Generate candidates by having an LLM write questions from each chunk, then have a human verify and correct. A hundred verified pairs is enough to make decisions, and building it is a one-day investment that pays for the whole project." },
    { h: "Track the operational metrics too",
      p: "p50 and p95 latency, cost per query, and cache hit rate belong in the same dashboard as quality. A system that is 3% more accurate but twice as slow and three times the cost is often the wrong choice, and being able to make that argument is what engineering judgement looks like." }
  ],
  cheat: {
    title: "RAG Metrics Card",
    pts: [
      "RETRIEVAL:",
      " recall@k = relevant found / relevant total",
      " precision@k = relevant in top-k / k",
      " MRR = 1/rank of first relevant",
      "GENERATION:",
      " faithfulness = claims supported by context",
      " answer relevance = addresses the question",
      "OPS: p50/p95 latency, $/query, cache hit %",
      "100 verified Q->chunk pairs is enough"
    ],
    eq: ["faithfulness = supported_claims / total_claims_in_answer"],
    warn: "Measure retrieval BEFORE generation. If recall@5 is 0.6, your answer accuracy cannot exceed 0.6, and every hour spent on the generation prompt is wasted."
  },
  vids: [
    { t: "RAGAS evaluation framework RAG", ch: "LangChain" },
    { t: "How to evaluate RAG systems", ch: "LlamaIndex" }
  ],
  lab: {
    t: "Full RAG evaluation report",
    steps: [
      "Build 100 verified question-to-chunk pairs for your corpus (LLM-generate, human-verify)",
      "Compute recall@1/5/10, precision@5, and MRR for every configuration you built this week",
      "Add RAGAS faithfulness and answer relevance for the top two configurations",
      "Record p95 latency and cost per query for each",
      "Write a one-page report recommending a configuration with the tradeoffs stated explicitly"
    ],
    out: "A RAG evaluation report — genuinely rare in a student portfolio."
  },
  qs: [
    { q: "How do you measure whether a RAG system is good?",
      a: "Separately at each stage. Retrieval with recall@k against a labelled set of questions with known relevant chunks, since that sets the hard ceiling, plus precision@k because irrelevant context actively degrades generation. Generation with faithfulness — whether every claim is supported by the retrieved context, which is the hallucination measure — and answer relevance. Then operational metrics: p95 latency, cost per query, cache hit rate. The labelled set is the key investment; without it you are tuning by feel." },
    { q: "What is faithfulness and why does it matter more than fluency?",
      a: "Faithfulness measures whether the claims in the generated answer are actually supported by the retrieved context, typically by decomposing the answer into atomic claims and checking each against the context. It matters more than fluency because the entire point of RAG is grounding: a fluent answer that invents a fact is worse than an awkward one that cites correctly, since users cannot distinguish confident hallucination from truth. It is also the metric that directly reflects whether retrieval is being used." }
  ],
  tags: ["rag-evaluation", "ragas", "metrics"]
},

/* ---------- WEEK 11 : Agents & Production LLM ---------- */
{
  d: 71, w: 11, phase: "LLM Engineering", track: "Agents",
  title: "Agents — ReAct, Tools & Loops",
  hook: "An LLM in a loop with tools and a stopping condition.",
  why: "Agentic systems are the fastest-growing category of AI engineering roles. Knowing why agents fail — and being sceptical in the right places — is more impressive than enthusiasm.",
  learn: [
    { h: "The ReAct loop",
      p: "Thought, Action, Observation, repeated. The model reasons about what it needs, calls a tool, observes the result, and reasons again until it can answer. That is the core pattern behind essentially every agent framework, and you can implement it in about fifty lines without any framework at all." },
    { h: "Tool design determines agent quality",
      p: "Clear names, precise descriptions, tight schemas, and informative error messages matter more than the model choice. An agent fails mostly because it cannot tell which tool to use or what arguments are valid. Fewer, better-described tools beat many overlapping ones — and returning a useful error lets the model self-correct." },
    { h: "Where agents actually fail",
      p: "Compounding errors — 90% reliability per step is 59% over five steps. Infinite loops repeating a failing action. Context overflow as observations accumulate. Cost and latency blowup from unbounded iterations. Always cap iterations, add loop detection, and summarise or truncate history." },
    { h: "Be honest about when to use one",
      p: "If the sequence of steps is known in advance, write a deterministic pipeline — it is cheaper, faster, testable, and more reliable. Agents earn their unpredictability only when the path genuinely depends on intermediate results. Saying this in an interview signals judgement rather than hype." }
  ],
  cheat: {
    title: "Agent Card",
    pts: [
      "loop: Thought -> Action -> Observation -> repeat",
      "tool quality > model quality",
      "clear name + precise description + tight schema",
      "return USEFUL errors -> model self-corrects",
      "0.9 per step ^ 5 steps = 0.59 end to end",
      "ALWAYS cap max iterations",
      "detect repeated identical actions -> break",
      "known steps? use a pipeline, not an agent",
      "log every step for debugging. always."
    ],
    eq: ["P(success) = p_step ^ n_steps    <- why long agent chains fail"],
    warn: "Never give an agent an unvalidated destructive tool. Anything that deletes, sends, pays, or writes needs explicit validation and ideally human confirmation."
  },
  vids: [
    { t: "ReAct agents explained llm", ch: "LangChain" },
    { t: "Building AI agents from scratch", ch: "Sam Witteveen" }
  ],
  lab: {
    t: "Write an agent with no framework",
    steps: [
      "Implement the ReAct loop yourself in ~100 lines: tool registry, prompt template, parse, dispatch, observe",
      "Give it 3 tools: calculator, document search (your day-67 RAG), and a local file reader",
      "Add max-iteration capping and repeated-action detection",
      "Test on 20 multi-step questions; log every step; compute the success rate",
      "Find the most common failure mode and fix it with better tool descriptions"
    ],
    out: "src/agent.py — an agent you understand completely, with a measured success rate."
  },
  qs: [
    { q: "How does an AI agent work?",
      a: "It is an LLM in a loop with tools. The model receives the goal plus tool descriptions, reasons about what it needs, emits a structured tool call, your code executes it and returns the observation, and the loop repeats until the model produces a final answer or a stopping condition triggers. The ReAct pattern makes the reasoning explicit before each action. The critical engineering is outside the model: tool schema design, argument validation, iteration caps, loop detection, and context management as observations accumulate." },
    { q: "Why do agents fail in production?",
      a: "Mainly compounding error — even 90% per-step reliability gives 59% success over five steps, so long chains are inherently fragile. Beyond that: looping on a failing action, context overflow as observations accumulate, unbounded cost and latency, and poor tool descriptions leaving the model unable to choose correctly. The mitigations are capping iterations, detecting repetition, summarising history, validating arguments, and — most importantly — using a deterministic pipeline whenever the steps are actually known in advance." }
  ],
  tags: ["agents", "react", "tool-use"]
},
{
  d: 72, w: 11, phase: "LLM Engineering", track: "Agents",
  title: "Multi-Agent Systems & Orchestration",
  hook: "Sometimes many small specialists beat one generalist. Sometimes.",
  why: "Multi-agent architectures are heavily hyped, so a balanced, evidence-based view stands out sharply against candidates who just list framework names.",
  learn: [
    { h: "Common topologies",
      p: "Supervisor: one orchestrator routes subtasks to specialists and assembles results — the most controllable. Sequential pipeline: fixed handoffs between stages. Parallel fan-out with aggregation: run independent subtasks concurrently then merge, which genuinely helps latency. Debate: multiple agents critique each other, useful for reasoning quality at high cost." },
    { h: "Why decomposition helps when it helps",
      p: "Each agent gets a focused prompt, a small tool set, and its own context, which reduces confusion and keeps context windows manageable. It also lets you use a cheap model for simple subtasks and an expensive one only where needed — often the main practical benefit." },
    { h: "The costs are real",
      p: "Every handoff loses information, cost multiplies with agent count, latency compounds unless you parallelise, and debugging becomes much harder. Many multi-agent systems are outperformed by a single well-prompted agent with good tools. Start single, decompose only when you can point to the specific failure it fixes." },
    { h: "State and handoff design",
      p: "Decide explicitly what each agent sees: full history is expensive and noisy, a structured summary is usually better. Define handoff contracts as schemas rather than free text. Graph-based orchestration frameworks make the control flow explicit and inspectable, which matters a great deal for debugging." }
  ],
  cheat: {
    title: "Multi-Agent Card",
    pts: [
      "supervisor: router + specialists (controllable)",
      "sequential: fixed pipeline handoffs",
      "parallel: fan out, aggregate (helps latency)",
      "debate: critique loop, costly, better reasoning",
      "benefit: focused prompts + cheap model routing",
      "cost: info loss per handoff, $ x N, hard debug",
      "handoffs = SCHEMAS not free text",
      "START SINGLE. decompose only on evidence."
    ],
    eq: ["latency = sum(sequential steps) but max(parallel steps)"],
    warn: "Multi-agent is not automatically better. Benchmark against a single well-tooled agent before adding the complexity, and be ready to say so in interviews."
  },
  vids: [
    { t: "Multi agent systems langgraph explained", ch: "LangChain" },
    { t: "Building multi agent workflows", ch: "Anthropic" }
  ],
  lab: {
    t: "Single agent vs multi-agent, measured",
    steps: [
      "Take a task with 3 distinct phases (research, analyse, write)",
      "Implementation A: one agent with all tools",
      "Implementation B: supervisor plus 3 specialists",
      "Run both on 20 test cases; compare quality, cost, latency, and lines of code",
      "Write an honest recommendation — including if the simple one won"
    ],
    out: "An evidence-based position on multi-agent architectures."
  },
  qs: [
    { q: "When would you use multiple agents instead of one?",
      a: "When subtasks need genuinely different tools, prompts, or model tiers — for example routing simple classification to a small cheap model and complex synthesis to a large one. When context would otherwise overflow, since separate agents keep separate contexts. And when subtasks are independent enough to parallelise for latency. I would not use it just because the task has phases; a single agent with well-described tools is simpler, cheaper, and easier to debug, so I start there and decompose only when I can name the specific failure that motivates it." }
  ],
  tags: ["multi-agent", "orchestration", "langgraph"]
},
{
  d: 73, w: 11, phase: "LLM Engineering", track: "Agents",
  title: "Model Context Protocol & Tool Integration",
  hook: "The emerging standard for connecting models to systems.",
  why: "MCP is becoming the common interface for tool integration across the industry. Knowing it signals that you follow the ecosystem, not just the textbook.",
  learn: [
    { h: "The problem it solves",
      p: "Before a standard, every application wrote bespoke integrations for every tool — an N-times-M problem. MCP defines a common protocol so any compliant client can talk to any compliant server, turning it into N plus M. It is conceptually similar to what the Language Server Protocol did for editors and language tooling." },
    { h: "The three primitives",
      p: "Tools are functions the model can invoke. Resources are data the client can read into context, like files or database rows. Prompts are reusable templates the server exposes. Servers declare what they offer and the client decides what to surface to the model." },
    { h: "Where the trust boundary sits",
      p: "The client controls what the model sees and what it is permitted to invoke. Content returned by a server is data, not instruction — if a document retrieved through MCP contains text telling the model to do something, that must not be treated as a command. Designing with that boundary explicit is the whole security story." },
    { h: "Practical value for you",
      p: "Building a small MCP server is a compact, differentiated portfolio project. It demonstrates protocol-level thinking, clean tool design, and awareness of where the ecosystem is going — all things very few co-op applicants can show." }
  ],
  cheat: {
    title: "MCP Card",
    pts: [
      "problem: N clients x M tools -> N + M",
      "primitives: TOOLS, RESOURCES, PROMPTS",
      "tools = callable functions",
      "resources = readable context data",
      "prompts = reusable templates",
      "client controls exposure + permissions",
      "server content is DATA, never instructions",
      "transport: stdio (local) or HTTP (remote)"
    ],
    eq: ["client <-> protocol <-> server(tools, resources, prompts)"],
    warn: "Treat everything returned by a tool or resource as untrusted input. Text inside a retrieved document that says 'ignore previous instructions' is an attack, not a command."
  },
  vids: [
    { t: "Model context protocol MCP explained", ch: "Anthropic" },
    { t: "Build your first MCP server", ch: "Matt Pocock" }
  ],
  lab: {
    t: "Build an MCP server",
    steps: [
      "Pick something you personally use — your notes, your GitHub, a local database, this 90-day tracker",
      "Implement a small MCP server exposing 3-4 tools and at least one resource",
      "Write precise tool descriptions and strict argument schemas",
      "Connect it to a client and test 20 realistic requests",
      "Document it well and publish it — this is a genuinely differentiated portfolio item"
    ],
    out: "A published MCP server — very few students have one."
  },
  qs: [
    { q: "What problem does MCP solve?",
      a: "Tool integration used to be an N-times-M problem: every AI application wrote custom connectors for every data source and tool. MCP standardises the interface so any compliant client can use any compliant server, reducing it to N plus M. It defines three primitives — tools the model can call, resources the client can read into context, and reusable prompt templates — with the client retaining control over what is exposed and permitted. Architecturally it is the same idea as the Language Server Protocol for editors." }
  ],
  tags: ["mcp", "protocols", "integration"]
},
{
  d: 74, w: 11, phase: "LLM Engineering", track: "LLM",
  title: "Guardrails, Prompt Injection & Safety",
  hook: "The part everyone skips, and the part that causes incidents.",
  why: "Any company deploying LLMs cares deeply about this. Being able to discuss prompt injection concretely is a strong differentiator, because most candidates have never thought about it.",
  learn: [
    { h: "Prompt injection is the core vulnerability",
      p: "Instructions and data share one channel: the context window. If untrusted content — a web page, an email, a retrieved document — contains text that reads as an instruction, the model may follow it. Indirect injection, where the payload arrives through retrieved content rather than user input, is the dangerous variant because the user never sees it." },
    { h: "There is no complete fix, only layers",
      p: "Delimit and label untrusted content clearly. Apply least privilege to tools so a compromised turn cannot do much. Validate every tool argument. Require human confirmation for irreversible actions. Filter outputs. Treat all tool and retrieval results as data. Defence in depth, because no single mitigation is reliable." },
    { h: "Input and output guardrails",
      p: "On input: check for policy violations, PII, and obvious injection patterns. On output: validate schema, check for leaked system prompt content, scan for PII, and verify claims against retrieved context in a RAG setting. Both add latency, so decide deliberately what runs synchronously versus asynchronously." },
    { h: "PII and data governance",
      p: "Know what data goes to which provider, whether it is retained or used for training, and what your data-residency obligations are. Redact PII before sending where possible. For your own school-platform work this matters concretely — India's DPDP Act imposes real obligations around children's data." }
  ],
  cheat: {
    title: "LLM Safety Card",
    pts: [
      "injection: data and instructions share a channel",
      "INDIRECT injection (via retrieved docs) = worst",
      "no full fix -> layer defences",
      "1. delimit + label untrusted content",
      "2. least privilege on tools",
      "3. validate every tool argument",
      "4. human confirm for irreversible actions",
      "5. output validation + PII scan",
      "tool results are DATA, never instructions"
    ],
    eq: ["blast_radius = tool_permissions x autonomy_level"],
    warn: "An agent with email-send access and a RAG index is a data-exfiltration vector: a malicious document can instruct it to email your context elsewhere. Restrict destructive tools and require confirmation."
  },
  vids: [
    { t: "Prompt injection attacks explained", ch: "Simon Willison" },
    { t: "LLM security guardrails", ch: "Anthropic" }
  ],
  lab: {
    t: "Attack your own system",
    steps: [
      "Take your day-67 RAG system. Plant a document containing injected instructions.",
      "Confirm the attack works — see the model follow the planted instruction",
      "Add layered defences: delimiting, an explicit system instruction about untrusted content, and output validation",
      "Retest with 10 injection variants; record which get through",
      "Write notes/security.md documenting the attacks and mitigations"
    ],
    out: "A security section in your RAG project — almost nobody has this."
  },
  qs: [
    { q: "What is prompt injection and how do you defend against it?",
      a: "Instructions and data occupy the same channel, so untrusted text that reads like an instruction can hijack the model's behaviour. Indirect injection is the serious case: the payload arrives inside a retrieved document or fetched web page, so the user never sees it. There is no complete fix, so you layer: clearly delimit and label untrusted content, apply least privilege to tools so a compromised turn has a small blast radius, validate every tool argument, require human confirmation before irreversible actions, and validate outputs. The governing principle is that anything returned by a tool or retrieval is data, never a command." },
    { q: "How would you prevent an LLM app from leaking sensitive data?",
      a: "Enforce access control at retrieval time so the model never sees documents the user is not entitled to — filtering after generation is too late. Redact PII before it reaches the provider where feasible, and confirm the provider's retention and training policy. Restrict tool permissions so no single turn can exfiltrate, especially avoiding combinations like retrieval plus outbound email. Scan outputs for PII and system-prompt leakage. And log enough to audit, while making sure the logs themselves are not a new leak." }
  ],
  tags: ["security", "prompt-injection", "guardrails"]
},
{
  d: 75, w: 11, phase: "LLM Engineering", track: "LLM",
  title: "Cost, Latency & Production Optimisation",
  hook: "The conversation that happens after the demo impresses everyone.",
  why: "Engineers who can reason about cost per request and p95 latency get hired over engineers who only build demos. This is directly what a manager worries about.",
  learn: [
    { h: "Know your cost model",
      p: "Cost is input tokens times input price plus output tokens times output price, and output is typically several times more expensive. So verbose system prompts hurt on every call, and unbounded output length is a budget risk. Compute cost per request and project it to expected volume before you ship anything." },
    { h: "Caching is the biggest lever",
      p: "Prompt caching on a stable prefix — system prompt, few-shot examples, retrieved context — can cut both cost and latency dramatically. Semantic caching returns a stored answer when a new query is embedding-similar to a previous one. Exact-match caching is trivial and often covers a surprising share of real traffic." },
    { h: "Model routing",
      p: "Do not use your largest model for everything. Route by difficulty: a small model handles classification and simple extraction, escalating to a large one only when needed, possibly gated by a confidence check. This routinely cuts costs by an order of magnitude with minimal quality loss — measure it on your eval set." },
    { h: "Latency structure",
      p: "Time to first token is dominated by prefill over the input, so long contexts hurt perceived responsiveness. Total time is dominated by output length during decode. Stream responses so users see progress immediately, parallelise independent calls, and always report p95 rather than mean — the tail is what users actually complain about." }
  ],
  cheat: {
    title: "LLM Production Card",
    pts: [
      "cost = in_tok*in_$ + out_tok*out_$",
      "output tokens cost ~3-5x input. cap them.",
      "prompt caching on stable prefix = biggest win",
      "semantic cache for near-duplicate queries",
      "route: small model default, escalate on need",
      "TTFT driven by INPUT length (prefill)",
      "total time driven by OUTPUT length (decode)",
      "STREAM. always. perceived latency halves.",
      "report p95, not mean"
    ],
    eq: ["monthly_cost = req/day * 30 * (in_tok*in_$ + out_tok*out_$) / 1e6"],
    warn: "A demo that costs $0.02 per request is $60k/year at 100 requests/minute. Do this arithmetic before the meeting, not after."
  },
  vids: [
    { t: "LLM inference optimization techniques", ch: "Efficient NLP" },
    { t: "Reducing llm api costs in production", ch: "Weights and Biases" }
  ],
  lab: {
    t: "Optimise your RAG system",
    steps: [
      "Instrument day-67's RAG: log input/output tokens, latency, and cost per request",
      "Establish the baseline: cost per query and p95 latency over 100 queries",
      "Add exact-match caching, then prompt caching, then a small-model router — measure after each",
      "Add streaming and measure the change in time to first token",
      "Produce a before/after table and project monthly cost at 10k requests/day"
    ],
    out: "A cost/latency optimisation case study with real numbers."
  },
  qs: [
    { q: "Your LLM feature costs too much. What do you do?",
      a: "First measure where the cost is: token counts by request type, and which requests dominate volume. Then in order of leverage: prompt caching on the stable prefix, which is often a large immediate win; trimming the system prompt and retrieved context, since input tokens are paid on every call; capping output length, since output tokens cost several times more; routing simple requests to a smaller model with escalation only when needed; and caching exact and semantically similar queries. I would validate each change against the eval set so cost reduction does not silently trade away quality." },
    { q: "How do you reduce perceived latency?",
      a: "Stream tokens so the user sees output immediately — this roughly halves perceived latency without changing total time. Reduce time to first token by shortening the input, since prefill scales with context length, which means aggressive context trimming and reranking to fewer chunks. Parallelise independent calls such as retrieval and any classification step. Cache. And optimise for p95 rather than the mean, because the tail is what users actually experience as slowness." }
  ],
  tags: ["cost", "latency", "caching", "production"]
},
{
  d: 76, w: 11, phase: "LLM Engineering", track: "Project",
  title: "PROJECT 5 — Production-Grade RAG or Agent App",
  hook: "Your flagship. The one you lead with.",
  why: "This is the project most aligned with what AI co-ops actually need right now. Built to the standard below, it is stronger than most portfolios you will compete against.",
  learn: [
    { h: "What makes it production-grade",
      p: "Not features — rigour. Measured retrieval quality, an evaluation harness, cost and latency numbers, security consideration, error handling, and a written architecture decision record. Every one of those is a talking point that a demo alone cannot give you." },
    { h: "Solve a problem you actually have",
      p: "Your own notes, your coursework, a codebase you work in, or your family's school operations. Genuine motivation shows in the quality of the questions you test with, and it makes the interview conversation far more engaging than a generic dataset would." }
  ],
  cheat: {
    title: "Project 5 Rubric",
    pts: [
      "[ ] real corpus, real users (even if only you)",
      "[ ] chunking strategy chosen BY MEASUREMENT",
      "[ ] hybrid search + reranking",
      "[ ] eval harness: recall@k + faithfulness",
      "[ ] cost/query + p95 latency reported",
      "[ ] caching + model routing implemented",
      "[ ] prompt injection defences + writeup",
      "[ ] graceful failure ('I don't know' path)",
      "[ ] deployed + demo GIF at top of README",
      "[ ] ARCHITECTURE.md with decisions + tradeoffs"
    ],
    eq: ["metrics + tradeoffs documented > any feature you could add"],
    warn: "Do not add features to impress. Add measurements. An interviewer will remember 'recall@5 went from 0.61 to 0.89 with hybrid search plus reranking' far longer than any UI."
  },
  vids: [
    { t: "Production RAG best practices", ch: "LlamaIndex" }
  ],
  lab: {
    t: "Ship Project 5",
    steps: [
      "Choose your corpus and define 5 realistic user questions before writing any code",
      "Work the rubric completely — every box",
      "Write ARCHITECTURE.md explaining each decision and what you rejected",
      "Deploy it somewhere clickable",
      "Update resume v5; write a LinkedIn post with the key metrics"
    ],
    out: "Your flagship project. This is the one you lead every interview with."
  },
  qs: [
    { q: "Tell me about your most complex project.",
      a: "Lead with the problem and the users, then the architecture and — crucially — the decisions you rejected and why, since that is where judgement shows. Then the measurements: retrieval recall before and after each upgrade, faithfulness, cost per query, p95 latency. Then what broke and how you found it. Then limitations. Interviewers will probe hardest at the points where you made a tradeoff, so know each one cold." }
  ],
  tags: ["project", "rag", "flagship", "milestone"]
},
{
  d: 77, w: 11, phase: "LLM Engineering", track: "Review",
  title: "Week 11 Consolidation — The GenAI Interview Deep Dive",
  hook: "Consolidate the highest-value block in the curriculum.",
  why: "Weeks 8 to 11 cover what AI co-op interviews focus on most heavily right now. Consolidating it deliberately turns four weeks of learning into recallable answers.",
  learn: [
    { h: "Build the concept map",
      p: "Draw one page connecting: tokenisation to embeddings to attention to transformer blocks to pretraining to fine-tuning to RAG to agents. Seeing the dependencies as one structure makes recall dramatically more reliable than remembering isolated facts." },
    { h: "Prepare for the depth ladder",
      p: "Interviewers escalate: 'what is RAG' becomes 'how do you chunk' becomes 'how do you measure retrieval' becomes 'your recall is 0.6, what now'. Prepare three levels deep on every major topic. The third level is where candidates run out and where you should still have answers." }
  ],
  cheat: {
    title: "GenAI Recall Test",
    pts: [
      "[ ] attention equation + why sqrt(d_k)",
      "[ ] transformer block from memory",
      "[ ] enc-only vs dec-only vs enc-dec",
      "[ ] temperature vs top-p, when to use 0",
      "[ ] LoRA: what, why low-rank, when",
      "[ ] RAG vs fine-tuning: the real answer",
      "[ ] full RAG pipeline + failure order",
      "[ ] chunking tradeoff + small-to-big",
      "[ ] hybrid search + RRF + reranking",
      "[ ] retrieval metrics vs generation metrics",
      "[ ] agent loop + why they fail",
      "[ ] prompt injection + layered defence",
      "[ ] cost model + caching + routing"
    ],
    eq: ["if you cannot go 3 levels deep, you cannot go 1 level deep convincingly"],
    warn: "Do not memorise definitions. Interviewers ask 'why' and 'what would you do if'. Understand the causal chain — each design choice solves a specific named problem."
  },
  vids: [
    { t: "LLM interview questions and answers", ch: "Krish Naik" }
  ],
  lab: {
    t: "Deep-dive drilling",
    steps: [
      "Draw the full concept map on one page, by hand, without references",
      "Complete the recall checklist above; anything you miss goes into weak-spots.md",
      "For your 3 weakest items, write a three-level-deep answer and record yourself giving it",
      "Do a 45-minute mock GenAI interview with a friend or an AI, focused on RAG and agents",
      "Rest properly. Week 12 is heavy."
    ],
    out: "Verified recall on the highest-value interview block."
  },
  qs: [
    { q: "How do modern LLM applications differ from classical ML applications?",
      a: "Classical ML trains a task-specific model on labelled data and evaluates against a fixed metric. LLM applications typically start from a general pretrained model and are engineered around it — prompting, retrieval, tools, and orchestration — so most of the work is system design rather than model training. Evaluation is much harder because outputs are open-ended, so you need golden sets and LLM judges rather than accuracy. And cost and latency become first-class design constraints, since inference is expensive per call rather than negligible." }
  ],
  tags: ["review", "genai", "interview"]
},

/* ---------- WEEK 12 : MLOps & System Design ---------- */
{
  d: 78, w: 12, phase: "MLOps & Interview", track: "MLOps",
  title: "Serving Models — FastAPI, Docker, ONNX",
  hook: "A model in a notebook has zero value. Ship it.",
  why: "'Can you deploy?' separates ML engineers from data scientists in hiring. Even a basic containerised API on your resume changes how you are read.",
  learn: [
    { h: "The serving contract",
      p: "A prediction API needs: input validation with clear error messages, the prediction itself, a health check for orchestrators, a version identifier so you can trace which model produced which prediction, and structured logging. Pydantic gives you validation and OpenAPI docs essentially for free with FastAPI." },
    { h: "Async, batching, and throughput",
      p: "FastAPI's async handling matters when your endpoint waits on I/O. For CPU-bound inference, use a worker pool. Dynamic batching — collecting requests for a few milliseconds and running them together — dramatically improves GPU throughput at a small latency cost, and is what dedicated servers like Triton and vLLM do for you." },
    { h: "Containers make it reproducible",
      p: "Multi-stage Dockerfiles keep images small. Pin every dependency. Do not bake large model weights into the image — mount them or fetch from object storage at startup so image builds stay fast and models can be swapped independently." },
    { h: "Export formats",
      p: "ONNX gives a portable graph with a fast runtime and no Python dependency. TorchScript keeps you in the PyTorch ecosystem with lower friction. Quantisation to int8 typically gives 2-4x speedup and 4x smaller models with modest accuracy loss — always measure that loss on your own eval set before shipping." }
  ],
  cheat: {
    title: "Serving Card",
    pts: [
      "FastAPI + Pydantic: validation + docs free",
      "endpoints: /predict /health /version",
      "log: input hash, prediction, latency, model ver",
      "load the model ONCE at startup, not per request",
      "dynamic batching -> big GPU throughput win",
      "Docker multi-stage, pin deps, weights OUTSIDE",
      "ONNX for portability, TorchScript for PyTorch",
      "int8 quantisation: ~2-4x faster, measure loss"
    ],
    eq: ["p95 latency and requests/sec are the two numbers that matter"],
    warn: "Loading the model inside the request handler is the classic beginner bug — it adds seconds to every call. Load once at startup into module or app state."
  },
  vids: [
    { t: "Deploy machine learning model fastapi docker", ch: "Patrick Loeber" },
    { t: "ONNX runtime model optimization", ch: "Microsoft Developer" }
  ],
  lab: {
    t: "Containerise a real model",
    steps: [
      "Wrap your Project 1 model in FastAPI with validation, health, and version endpoints",
      "Add structured logging and a latency histogram",
      "Write a multi-stage Dockerfile; measure the final image size",
      "Load-test with locust or hey; report p50, p95, and requests/sec",
      "Export to ONNX, quantise to int8, and compare latency and accuracy"
    ],
    out: "A containerised, load-tested inference API with real performance numbers."
  },
  qs: [
    { q: "How would you deploy a model to production?",
      a: "Package the model artefact with its version and preprocessing code, wrap it in a FastAPI service with input validation, health, and version endpoints, load it once at startup, and add structured logging of inputs, predictions, and latency. Containerise with pinned dependencies and keep weights outside the image. Deploy behind a load balancer with autoscaling, and roll out gradually — shadow mode first, then a canary percentage — while monitoring latency, error rate, and prediction distribution. For efficiency I would export to ONNX and consider int8 quantisation after measuring the accuracy impact." },
    { q: "How do you handle a model that is too slow?",
      a: "Measure first to find where the time goes — often it is preprocessing or I/O rather than the model. Then: batch requests dynamically to exploit parallelism, quantise to int8 or use a distilled smaller model, export to ONNX or TensorRT for a faster runtime, cache repeated inputs, and move to a GPU if the arithmetic justifies it. If the model is one stage of a pipeline, consider a cheap fast filter that handles the easy majority and escalates only hard cases." }
  ],
  tags: ["deployment", "fastapi", "docker", "onnx"]
},
{
  d: 79, w: 12, phase: "MLOps & Interview", track: "MLOps",
  title: "Experiment Tracking & Reproducibility",
  hook: "'Which run was that again?' is a question you should never have to ask.",
  why: "Reproducibility is a standard interview topic and an immediate signal of professional habits. It is also genuinely useful for the rest of your career.",
  learn: [
    { h: "What must be tracked",
      p: "Code version (git SHA), data version or hash, full hyperparameter config, environment and dependency versions, random seeds, metrics over time, and the resulting artefacts. Miss any one and reproduction becomes guesswork. Tools like MLflow or Weights and Biases capture most of this automatically." },
    { h: "Config over hardcoding",
      p: "Move every parameter into a YAML or Hydra config, log the config with the run, and never edit constants in code between experiments. This alone converts an unmanageable pile of runs into a comparable, searchable set." },
    { h: "Data versioning",
      p: "Code alone is not enough — the same code on different data gives different models. DVC or lakeFS version datasets by content hash and keep pointers in git. At minimum, hash your dataset and log the hash with every run." },
    { h: "Model registry and lineage",
      p: "A registry stores model versions with stage tags (staging, production), the metrics that qualified them, and links back to the exact run and data. When a production model misbehaves, lineage is what lets you answer 'what changed' in minutes instead of days." }
  ],
  cheat: {
    title: "Reproducibility Card",
    pts: [
      "log: git SHA + data hash + config + env + seed",
      "config in YAML, never hardcoded constants",
      "seed python, numpy, torch (and cudnn determinism)",
      "MLflow / W&B autolog metrics + artefacts",
      "DVC or content-hash your datasets",
      "registry: version + stage + metrics + lineage",
      "if you can't rerun it in 6 months, it's not tracked",
      "name runs meaningfully, not 'test3_final_v2'"
    ],
    eq: ["reproducible = code + data + config + env + seed, all pinned"],
    warn: "Full determinism on GPU requires disabling some cuDNN optimisations and costs speed. Know the tradeoff and choose deliberately rather than assuming seeding is enough."
  },
  vids: [
    { t: "MLflow tutorial experiment tracking", ch: "Krish Naik" },
    { t: "Weights and biases tutorial", ch: "Weights and Biases" }
  ],
  lab: {
    t: "Retrofit tracking onto your projects",
    steps: [
      "Add MLflow or W&B to your Project 1 training script",
      "Move all parameters into a YAML config; log it with every run",
      "Run 10 experiments varying hyperparameters; compare them in the UI",
      "Log the git SHA and a dataset hash with each run",
      "Prove it: check out an old commit, rerun a logged config, and verify you reproduce the metric"
    ],
    out: "A reproducibility demonstration you can describe concretely."
  },
  qs: [
    { q: "How do you make ML experiments reproducible?",
      a: "Pin all five inputs: code via git SHA, data via a content hash or DVC pointer, configuration in a versioned file logged with the run, the environment via pinned dependencies and a container image, and random seeds across Python, NumPy, and the framework. Log all of it automatically with an experiment tracker alongside metrics and artefacts. The test is whether I can check out a commit six months later, rerun the logged config, and get the same number — and full GPU determinism additionally requires disabling some cuDNN autotuning, which costs speed." }
  ],
  tags: ["mlops", "mlflow", "reproducibility"]
},
{
  d: 80, w: 12, phase: "MLOps & Interview", track: "MLOps",
  title: "Monitoring, Drift & Model Decay",
  hook: "Models degrade silently. Nothing errors. Metrics just quietly get worse.",
  why: "This is what separates 'I trained a model' from 'I operated a model'. Very few students can discuss drift concretely, so it is a strong differentiator.",
  learn: [
    { h: "Three things to monitor",
      p: "System health: latency, throughput, error rate, resource use. Data quality: schema conformance, null rates, range violations, unexpected categories. Model behaviour: prediction distribution, confidence distribution, and — when labels eventually arrive — actual performance." },
    { h: "Data drift versus concept drift",
      p: "Data drift means the input distribution changed: P(X) shifted, perhaps a new user demographic. Concept drift means the relationship changed: P(y|X) shifted, so the same inputs now imply different outcomes — a fraud pattern evolving, or user behaviour changing after a product change. Data drift is detectable immediately; concept drift usually needs labels." },
    { h: "Detection methods",
      p: "Population Stability Index and KL divergence for distribution shift on individual features, Kolmogorov-Smirnov tests for continuous variables, chi-square for categoricals. As a rule of thumb PSI above 0.2 warrants investigation. Prediction-distribution monitoring is a useful proxy when labels are delayed." },
    { h: "The label delay problem",
      p: "You often cannot measure true accuracy for days or months — a churn prediction is only verifiable after the churn window closes. So you monitor leading indicators: input drift, prediction drift, and confidence collapse. Designing around delayed feedback is a genuinely senior consideration." }
  ],
  cheat: {
    title: "Monitoring Card",
    pts: [
      "monitor: system + data quality + model behaviour",
      "data drift: P(X) changed",
      "concept drift: P(y|X) changed  <- worse",
      "PSI > 0.1 watch, > 0.2 investigate",
      "KS test (continuous), chi-square (categorical)",
      "labels are DELAYED -> use leading indicators",
      "  = input drift + prediction drift + confidence",
      "alert on trends, not single points (noise)",
      "have a retraining trigger + rollback plan"
    ],
    eq: ["PSI = sum (actual% - expected%) * ln(actual% / expected%)"],
    warn: "Do not alert on every statistical test firing — with hundreds of features you get constant false alarms. Alert on sustained shifts in features that actually matter to the model."
  },
  vids: [
    { t: "Data drift detection machine learning monitoring", ch: "Evidently AI" },
    { t: "ML monitoring in production", ch: "MLOps Community" }
  ],
  lab: {
    t: "Build a drift detector",
    steps: [
      "Split a dataset temporally into reference and current windows",
      "Implement PSI and a KS test yourself; compute per-feature drift",
      "Artificially inject drift (shift a feature's distribution) and verify detection",
      "Simulate concept drift by changing the label rule and show input drift does NOT catch it",
      "Build a small monitoring dashboard, or wire up Evidently, and define alert thresholds"
    ],
    out: "src/monitoring.py + a demonstrated understanding of the drift types."
  },
  qs: [
    { q: "How do you know when a model in production needs retraining?",
      a: "Monitor several signals because the ideal one — live accuracy — is usually delayed. Input drift via PSI or KS tests on important features, prediction-distribution drift, and confidence collapse are leading indicators available immediately. When labels arrive, track the actual metric against a threshold agreed with stakeholders. I would trigger retraining on sustained degradation rather than a single alert, and combine that with a scheduled cadence as a floor. Crucially, I would validate the retrained model against the current model before promotion, and keep a rollback path." },
    { q: "Data drift vs concept drift?",
      a: "Data drift is a change in the input distribution P(X) — for example a new marketing channel bringing a different user population. The learned relationship may still hold, but the model is now operating outside its training distribution. Concept drift is a change in P(y|X): the same inputs now map to different outcomes, such as fraud tactics evolving. Concept drift is more dangerous because it invalidates the model's core learning and cannot be detected from inputs alone — you need labels or a proxy." }
  ],
  tags: ["monitoring", "drift", "production"]
},
{
  d: 81, w: 12, phase: "MLOps & Interview", track: "Interview",
  title: "ML System Design — The Framework",
  hook: "The highest-weight round in any ML interview. Learn the structure.",
  why: "System design questions are open-ended and candidates flounder without a framework. Having one makes you look organised and senior even when you are uncertain about specifics.",
  learn: [
    { h: "The seven-step framework",
      p: "1. Clarify requirements and constraints. 2. Frame it as an ML problem with a defined target and metric. 3. Data: sources, labels, volume, freshness. 4. Features and the training pipeline. 5. Modelling approach, starting with a baseline. 6. Serving architecture and scale. 7. Monitoring, iteration, and failure modes. Say the structure out loud at the start — interviewers explicitly reward it." },
    { h: "Spend real time on step 1",
      p: "Ask about scale (requests per second, corpus size), latency budget, whether it is real-time or batch, what the model's output triggers, what data already exists, and what the current baseline is. Candidates who jump straight to model architecture lose points, because in real work the requirements determine everything downstream." },
    { h: "Two metrics, always",
      p: "An offline metric you can optimise (AUC, recall@k, NDCG) and an online business metric you actually care about (engagement, revenue, cost saved). Explain how you would validate that the offline metric predicts the online one — usually via an A/B test. This connects day 32 to day 81." },
    { h: "Talk about failure",
      p: "What happens on a cold start, on a model outage, on a bad deploy, on adversarial input? Fallback to a simpler model or heuristic, shadow deployment, canary rollout, and a rollback plan. Volunteering this is one of the strongest seniority signals available to you." }
  ],
  cheat: {
    title: "ML SYSTEM DESIGN FRAMEWORK",
    pts: [
      "1. CLARIFY: scale, latency, batch/RT, action, data",
      "2. FRAME: target, population, horizon, metric",
      "3. DATA: sources, labels, volume, freshness, bias",
      "4. FEATURES: engineering, store, train/serve skew",
      "5. MODEL: baseline -> simple -> complex, justify",
      "6. SERVE: architecture, scale, cache, latency budget",
      "7. MONITOR: drift, retrain trigger, A/B, rollback",
      "say the framework OUT LOUD at the start",
      "always: offline metric + online metric"
    ],
    eq: ["candidate generation (fast, recall) -> ranking (rich, precision)"],
    warn: "Train/serve skew — features computed differently in training and serving — is the most common production failure and the most impressive thing to raise unprompted. A feature store exists to prevent it."
  },
  vids: [
    { t: "Machine learning system design interview", ch: "Exponent" },
    { t: "ML system design framework", ch: "Alex Xu" }
  ],
  lab: {
    t: "Learn the framework by using it",
    steps: [
      "Write out the 7-step framework on one page; memorise the step names",
      "Apply it in writing to: 'design YouTube video recommendations'",
      "Then to: 'design a system to detect fraudulent transactions in real time'",
      "Time-box each to 45 minutes, as in a real interview",
      "For each, explicitly cover train/serve skew and the failure/rollback plan"
    ],
    out: "Two complete written system designs + a memorised framework."
  },
  qs: [
    { q: "Design a system to recommend videos to users.",
      a: "Clarify first: scale, latency budget, whether it is homepage or related-video, cold start expectations, and the objective — watch time, satisfaction, or diversity. Then a two-stage architecture: candidate generation retrieves a few hundred from millions using two-tower embeddings plus approximate nearest neighbour, optimised for recall and speed; then a ranking model scores those with rich features — user history, video metadata, context, and cross features — optimised for precision. Features come from a feature store shared by training and serving to avoid skew. Offline metric is NDCG or recall@k; online metric is watch time validated by A/B test. Monitoring covers drift, popularity feedback loops, and diversity; fallbacks handle cold start with popularity and content-based signals." },
    { q: "What is train/serve skew?",
      a: "When the features a model sees at inference differ from those it was trained on — because they are computed by different code paths, use different time windows, or because a training aggregate accidentally included data unavailable at prediction time. The model performs well offline and poorly in production, and it is hard to diagnose because nothing errors. The standard fix is a feature store that computes features once and serves them to both training and inference, plus point-in-time-correct joins when building training data." }
  ],
  tags: ["system-design", "interview", "architecture"]
},
{
  d: 82, w: 12, phase: "MLOps & Interview", track: "Interview",
  title: "ML System Design — Practice Cases",
  hook: "Four cases that cover most of what gets asked.",
  why: "Pattern recognition matters. Most system design questions are variations on retrieval-and-ranking, real-time classification, generative applications, or forecasting.",
  learn: [
    { h: "Case archetype 1: retrieval and ranking",
      p: "Recommendations, search, feed ranking, ads. Always two-stage: cheap high-recall candidate generation, then expensive high-precision ranking. Discuss embeddings, ANN indexes, feature stores, freshness, and feedback loops where the model's own output shapes future training data." },
    { h: "Case archetype 2: real-time classification",
      p: "Fraud, spam, content moderation, abuse detection. Key themes: extreme class imbalance, tight latency budgets, adversarial adaptation, threshold selection from cost asymmetry, human review queues, and delayed or noisy labels." },
    { h: "Case archetype 3: generative and LLM systems",
      p: "Support assistants, document Q&A, code assistance. Themes: RAG architecture, evaluation without ground truth, hallucination mitigation and citation, cost and latency, caching, guardrails and injection, and a human escalation path. This is increasingly the most likely case you will get." },
    { h: "Case archetype 4: forecasting and estimation",
      p: "Demand forecasting, ETA prediction, capacity planning. Themes: temporal validation, seasonality and holidays, hierarchical aggregation, prediction intervals rather than point estimates, and the asymmetric cost of over- versus under-prediction." }
  ],
  cheat: {
    title: "Case Archetypes",
    pts: [
      "RETRIEVE+RANK: 2-stage, ANN, feature store,",
      "  freshness, feedback loops",
      "REALTIME CLASSIFY: imbalance, latency, adversarial,",
      "  threshold from cost, review queue",
      "GENERATIVE: RAG, eval w/o truth, citations,",
      "  cost, guardrails, human escalation",
      "FORECAST: temporal CV, seasonality, intervals,",
      "  asymmetric cost",
      "always: baseline, A/B plan, failure mode"
    ],
    eq: ["identify the archetype in the first 60 seconds -> structure follows"],
    warn: "Do not design the most sophisticated system. Design the simplest one that meets the stated requirements, then say how you would evolve it. Over-engineering is a real negative signal."
  },
  vids: [
    { t: "ML system design mock interview", ch: "Exponent" },
    { t: "Design a fraud detection system machine learning", ch: "Data Science Jay" }
  ],
  lab: {
    t: "Four cases, 45 minutes each",
    steps: [
      "Case 1: design a personalised news feed (retrieve + rank)",
      "Case 2: design real-time payment fraud detection (classify)",
      "Case 3: design an AI customer support assistant over a knowledge base (generative)",
      "Case 4: design food delivery ETA prediction (forecast)",
      "For each, produce a one-page written design following the day-81 framework, then review against the archetype checklist"
    ],
    out: "Four written designs covering the main archetypes."
  },
  qs: [
    { q: "Design a real-time fraud detection system.",
      a: "Clarify volume, latency budget — typically under 100ms in the payment path — the cost of a false positive versus a missed fraud, and whether a human review queue exists. Frame it as ranking transactions by fraud probability rather than binary classification, because the threshold is a business decision from the cost asymmetry. Features come from a feature store with real-time aggregates over the card, device, and merchant, all computed point-in-time correctly. Start with gradient-boosted trees as a strong baseline; graph features for ring detection are a strong extension. Serve behind a strict latency budget with a rules fallback for outages. Evaluate with PR-AUC and precision@k matched to review capacity. Critically, fraud is adversarial, so patterns drift fast and the system needs frequent retraining plus monitoring for both drift and label delay, since chargebacks arrive weeks later." }
  ],
  tags: ["system-design", "practice", "interview"]
},
{
  d: 83, w: 12, phase: "MLOps & Interview", track: "MLOps",
  title: "Data Engineering Essentials for ML",
  hook: "ML engineers spend more time on pipelines than on models.",
  why: "Co-op job descriptions frequently list Airflow, Spark, or dbt. You do not need mastery, but you need to hold a competent conversation and know the vocabulary.",
  learn: [
    { h: "Batch versus streaming",
      p: "Batch processes bounded data on a schedule: simpler, cheaper, correct for most ML training. Streaming processes unbounded data continuously: necessary when freshness is measured in seconds, as in fraud or live personalisation. Most systems are hybrid — batch training with streaming features." },
    { h: "Orchestration",
      p: "Airflow, Dagster, or Prefect express pipelines as DAGs with dependencies, retries, scheduling, and backfills. The concepts that matter for interviews are idempotency (rerunning a task produces the same result), backfilling historical partitions, and how failures propagate and are retried." },
    { h: "Storage layers",
      p: "Data lake for raw files, warehouse for modelled analytical tables, lakehouse formats like Delta or Iceberg adding transactions and time travel over object storage. The medallion pattern — bronze raw, silver cleaned, gold aggregated — is common vocabulary worth knowing." },
    { h: "Feature stores",
      p: "They solve train/serve skew by computing a feature once and serving it to both offline training and online inference, with point-in-time correct joins so training data never contains values that were unavailable at that timestamp. Even if you never use one, understanding what they solve is directly relevant to day 81." }
  ],
  cheat: {
    title: "Data Engineering Card",
    pts: [
      "batch: scheduled, bounded, simple, cheap",
      "streaming: continuous, unbounded, fresh, complex",
      "orchestrator = DAG + schedule + retry + backfill",
      "IDEMPOTENT tasks: rerun = same result",
      "lake (raw) -> warehouse (modelled)",
      "lakehouse: Delta/Iceberg = ACID on object store",
      "medallion: bronze -> silver -> gold",
      "feature store: one definition, both paths",
      "point-in-time joins prevent leakage"
    ],
    eq: ["training row at time t must use ONLY data available before t"],
    warn: "Non-idempotent pipeline tasks cause duplicated or corrupted data on retry — and retries always happen. Design every task so rerunning it is safe."
  },
  vids: [
    { t: "Apache airflow tutorial for beginners", ch: "freeCodeCamp" },
    { t: "Feature stores explained machine learning", ch: "Tecton" }
  ],
  lab: {
    t: "Build an orchestrated pipeline",
    steps: [
      "Build an Airflow or Prefect DAG: ingest, validate, transform, train, evaluate, register",
      "Make every task idempotent and prove it by running the DAG twice",
      "Add data validation with Great Expectations or Pandera and make the DAG fail on violation",
      "Implement a backfill over 30 days of partitioned data",
      "Write down where train/serve skew could enter your pipeline and how you would prevent it"
    ],
    out: "An orchestrated, validated, idempotent ML pipeline."
  },
  qs: [
    { q: "What is a feature store and what problem does it solve?",
      a: "It is a system that defines each feature once and serves it to both offline training and online inference, which eliminates train/serve skew — the situation where a feature is computed by different code in the two paths and the model silently underperforms in production. It also provides point-in-time correct joins so training rows only contain values that were actually available at that timestamp, preventing temporal leakage, plus reuse and discovery across teams. The tradeoff is real operational complexity, so it is usually justified only with several models sharing features or with strict real-time requirements." }
  ],
  tags: ["data-engineering", "airflow", "feature-store"]
},
{
  d: 84, w: 12, phase: "MLOps & Interview", track: "Project",
  title: "PROJECT 6 — Deployed End-to-End System",
  hook: "The project that proves you can operate, not just train.",
  why: "Most student portfolios stop at a notebook. A deployed system with monitoring is a category difference and it directly addresses the 'can they actually ship?' question.",
  learn: [
    { h: "Scope tightly, finish completely",
      p: "A simple model that is deployed, monitored, tested, and documented beats a sophisticated model in a notebook. Choose something small enough to complete in the time available, then take it all the way to running with observability." },
    { h: "The operational story is the deliverable",
      p: "Show the retraining path, what happens when the model degrades, how you would roll back, and what your dashboard shows. Those are the questions an ML engineering interviewer actually asks, and having concrete answers built from your own system is enormously more convincing than theory." }
  ],
  cheat: {
    title: "Project 6 Rubric",
    pts: [
      "[ ] training pipeline, config-driven, tracked",
      "[ ] model registry w/ versions + metrics",
      "[ ] FastAPI service, validated, containerised",
      "[ ] CI: tests + lint + build on push",
      "[ ] load-tested: p95 latency + throughput",
      "[ ] drift monitoring + a dashboard",
      "[ ] documented retraining trigger + rollback",
      "[ ] deployed and publicly reachable",
      "[ ] ARCHITECTURE.md with diagram"
    ],
    eq: ["simple model + full ops > complex model + notebook"],
    warn: "Watch cloud costs. Use free tiers (Railway, Render, Fly.io, HuggingFace Spaces) or shut resources down between demos. Set a billing alert on day one."
  },
  vids: [
    { t: "End to end mlops project tutorial", ch: "Krish Naik" }
  ],
  lab: {
    t: "Ship Project 6",
    steps: [
      "Choose a simple, well-understood model — the ops is the point, not the modelling",
      "Work the rubric completely",
      "Add a GitHub Actions workflow running tests and building the image on every push",
      "Deploy publicly; run a load test; screenshot the monitoring dashboard for the README",
      "Update resume v6 — this is your final resume for the sprint"
    ],
    out: "A deployed, monitored, CI-backed ML system."
  },
  qs: [
    { q: "Walk me through the lifecycle of a model you deployed.",
      a: "Problem framing and metric selection, then data pipeline with validation, then training driven by a versioned config with experiment tracking, then evaluation against a baseline with the promotion criteria stated in advance, then registration with lineage back to code and data. Deployment as a containerised service, rolled out via shadow then canary while watching latency and prediction distribution. Then monitoring for input drift, prediction drift, and eventually true performance as labels arrive, with a defined retraining trigger and a rollback path. The parts interviewers dig into are the promotion criteria and the rollback plan." }
  ],
  tags: ["project", "mlops", "deployment", "milestone"]
},

/* ---------- WEEK 13 : Interview Sprint ---------- */
{
  d: 85, w: 13, phase: "MLOps & Interview", track: "Interview",
  title: "Coding Interviews for ML Roles",
  hook: "Yes, you still have to code. No, it is not Codeforces.",
  why: "ML co-ops usually include a coding round. It is typically easier than pure SWE interviews but includes ML-flavoured implementation questions that catch people off guard.",
  learn: [
    { h: "What actually gets asked",
      p: "Easy-to-medium data structure and algorithm problems — which your NeetCode 150 track has been covering since day 3, so today is not about starting that. Plus Python and pandas fluency. Plus the part nobody drills: implement-this-ML-thing from scratch, without libraries — k-means, k-NN, gradient descent, precision and recall, a train/test split. That last category is where ML candidates lose points they did not need to lose." },
    { h: "The ML implementation set",
      p: "Practise writing from scratch: k-NN, k-means, linear and logistic regression with gradient descent, the confusion matrix and its derived metrics, train/test split, cross-validation, softmax and cross-entropy, and scaled dot-product attention. These come up far more than hard DP problems." },
    { h: "Communicate while you code",
      p: "State your approach before typing, name the time and space complexity, mention edge cases (empty input, single element, ties, division by zero), and test your code out loud on an example. A slightly slower correct solution explained clearly beats a fast silent one." },
    { h: "Know your Python properly",
      p: "List and dict comprehensions, collections (defaultdict, Counter, deque), itertools, generators, decorators, context managers, and the difference between shallow and deep copy. NumPy vectorisation from day 2. These appear constantly in ML coding rounds." }
  ],
  cheat: {
    title: "Coding Round Card",
    pts: [
      "scope: easy-medium DSA + pandas + implement-ML",
      "NC150 covers the DSA half (days 3-84)",
      "TODAY = the ML half nobody drills:",
      "  kNN, kmeans, linreg GD, logreg GD",
      "  confusion matrix -> P/R/F1",
      "  train_test_split, k-fold, softmax+CE",
      "  scaled dot-product attention",
      "say approach + complexity BEFORE coding",
      "edge cases: empty, single, ties, div-by-zero",
      "test out loud on a small example"
    ],
    eq: ["clear + correct + communicated > clever + silent"],
    warn: "For an ML co-op, do NOT keep grinding new hard DP problems now. Re-solve your flagged NC150 problems and drill the from-scratch ML implementations — that is where the marginal point actually is."
  },
  vids: [
    { t: "Machine learning coding interview questions", ch: "Data Science Jay" },
    { t: "Python interview questions for data science", ch: "Keith Galli" }
  ],
  lab: {
    t: "Timed implementation drills",
    steps: [
      "Implement each of the 8 from-scratch ML items above in 20 minutes each, no references",
      "Re-solve 6 of your flagged NC150 problems from a blank file, 25 minutes each",
      "Do 10 pandas problems (StrataScratch or similar) under time pressure",
      "Anything you fail today gets re-flagged and redone tomorrow morning",
      "Record yourself solving one problem while narrating — review the communication, not just the code"
    ],
    out: "Verified from-scratch implementation speed under time pressure."
  },
  qs: [
    { q: "Implement k-means from scratch.",
      a: "Initialise k centroids, ideally with k-means++ rather than randomly to avoid poor local optima. Loop: assign each point to its nearest centroid by euclidean distance using broadcasting rather than a Python loop; recompute each centroid as the mean of its assigned points; stop when assignments stop changing or centroid movement falls below a tolerance, with a max-iteration cap. Handle the empty-cluster edge case by reinitialising that centroid to the point furthest from any centroid. Mention that features must be scaled first and that the result depends on initialisation, so you run it several times and keep the lowest inertia." }
  ],
  tags: ["coding-interview", "leetcode", "implementation"]
},
{
  d: 86, w: 13, phase: "MLOps & Interview", track: "Interview",
  title: "ML Theory Rapid Review",
  hook: "Days 1-60, compressed and stress-tested.",
  why: "Spaced retrieval is the most effective revision method there is. Today you deliberately re-derive rather than re-read.",
  learn: [
    { h: "Retrieval, not review",
      p: "Close everything. Write the answer from memory. Then check. The struggle to recall is what strengthens the memory — recognising an answer when you see it feels like knowing and is not the same thing. This distinction is why re-reading notes is such a poor use of the last week." },
    { h: "Target your weak spots",
      p: "Your weak-spots.md from twelve weeks is a personalised revision list far better than any generic guide. Prioritise those, and prioritise the high-frequency topics: bias-variance, metrics, regularisation, attention, RAG, and system design." }
  ],
  cheat: {
    title: "Core Recall Checklist",
    pts: [
      "[ ] bias-variance + how to diagnose from curves",
      "[ ] precision/recall/F1/ROC vs PR-AUC",
      "[ ] L1 vs L2 + WHY L1 is sparse",
      "[ ] bagging vs boosting",
      "[ ] why cross-entropy not MSE",
      "[ ] leakage: types + prevention",
      "[ ] CV variants: stratified, group, time-series",
      "[ ] imbalance playbook (threshold first!)",
      "[ ] backprop + vanishing gradients + fixes",
      "[ ] BatchNorm vs LayerNorm",
      "[ ] attention equation + sqrt(d_k)",
      "[ ] RAG vs fine-tuning",
      "[ ] train/serve skew",
      "[ ] data vs concept drift"
    ],
    eq: ["if you cannot write it from a blank page, you do not know it yet"],
    warn: "Do not learn anything new this week. Consolidate what you have. New material this late adds anxiety without adding recall."
  },
  vids: [
    { t: "Machine learning interview questions and answers", ch: "StatQuest" }
  ],
  lab: {
    t: "Blank-page recall",
    steps: [
      "Work through the checklist above on blank paper, no references",
      "Score yourself: solid, shaky, or absent",
      "For everything shaky or absent, reread only that day's page on this site and redo it",
      "Then re-derive: linear regression gradient, logistic gradient, attention — all from scratch",
      "Do a 45-minute mock ML theory interview"
    ],
    out: "An honest map of what you know cold versus what needs one more pass."
  },
  qs: [
    { q: "What is the most important thing you learned in the last 12 weeks?",
      a: "Answer with a specific technical insight plus what it changed about how you work — for example, learning that retrieval quality sets a hard ceiling on RAG answer quality, which changed your debugging order permanently, or that threshold tuning usually beats resampling for imbalanced problems. A concrete, non-obvious lesson with evidence behind it is far more memorable than 'I learned a lot about deep learning'." }
  ],
  tags: ["review", "recall", "interview"]
},
{
  d: 87, w: 13, phase: "MLOps & Interview", track: "Interview",
  title: "GenAI Interview Questions — Rapid Fire",
  hook: "The questions most likely to decide an AI co-op right now.",
  why: "This is the hottest and least standardised area, which means preparation has outsized returns. Most candidates are vague here; precision stands out immediately.",
  learn: [
    { h: "Expect the depth ladder",
      p: "Every question has follow-ups. 'What is RAG' leads to chunking, then to measuring retrieval, then to 'recall is 0.6, what now'. Prepare three levels on every topic and you will still have answers when others run dry." },
    { h: "Have opinions, backed by measurement",
      p: "'I measured hybrid search plus reranking lifting recall@5 from 0.61 to 0.89 on my corpus' is worth more than any amount of correct definition. Your week 10-11 evaluation work is exactly this ammunition — use it." }
  ],
  cheat: {
    title: "GenAI Rapid Fire",
    pts: [
      "attention eq + why sqrt(d_k)",
      "why transformers beat RNNs (parallel + path)",
      "temperature vs top-p, when temp=0",
      "LoRA: what/why/when + rank tradeoff",
      "RAG vs fine-tune vs prompt (the real answer)",
      "RAG failure order: retrieval > chunk > rank > gen",
      "chunking strategies + small-to-big",
      "hybrid search + RRF + cross-encoder rerank",
      "retrieval metrics vs generation metrics",
      "LLM-as-judge + its biases",
      "prompt injection + layered defence",
      "agent loop + compounding error",
      "cost model + caching + routing",
      "KV cache + why GQA exists",
      "hallucination: causes + mitigations"
    ],
    eq: ["measured claims > memorised definitions, every time"],
    warn: "If you do not know something, say so and reason about how you would find out. Confident fabrication is instantly obvious to anyone who works in this area — and it is ironic in an LLM interview."
  },
  vids: [
    { t: "Generative AI interview questions", ch: "Krish Naik" },
    { t: "LLM engineer interview preparation", ch: "AI Engineer" }
  ],
  lab: {
    t: "Rapid-fire drilling",
    steps: [
      "Answer all 15 checklist items out loud, 2 minutes each, recorded",
      "Watch it back and mark: precise, vague, or wrong",
      "For every vague answer, write a three-level-deep version and re-record",
      "Do a 45-minute mock focused entirely on RAG and agents",
      "Prepare 5 questions to ask YOUR interviewer about their AI stack"
    ],
    out: "Sharp, specific GenAI answers backed by your own measurements."
  },
  qs: [
    { q: "How do you reduce hallucination in an LLM application?",
      a: "Ground the model with retrieval so answers come from real sources, and require citations so claims are checkable. Give the model an explicit path to decline — 'if the context does not contain the answer, say so' — because forcing an answer guarantees invention. Use temperature 0 for factual tasks. Constrain output to a schema where applicable. Then verify: measure faithfulness by decomposing answers into claims and checking each against the retrieved context, and consider a verification pass for high-stakes outputs. And improve retrieval, since most apparent hallucination in a RAG system is actually retrieval failure." }
  ],
  tags: ["genai-interview", "rapid-fire", "llm"]
},
{
  d: 88, w: 13, phase: "MLOps & Interview", track: "Interview",
  title: "Behavioural Mastery & Your Narrative",
  hook: "The round most technical people underprepare, and it decides offers.",
  why: "For co-ops especially, managers hire for coachability, communication, and ownership. Technical bar is necessary; the behavioural round is frequently what actually differentiates.",
  learn: [
    { h: "You need one narrative, not six stories",
      p: "Tie everything to a coherent arc: you identified a gap, built a structured plan, executed for 90 days, shipped six projects, and measured your own progress. Every story becomes a chapter in that arc rather than a disconnected anecdote, and it makes you memorable in a way isolated examples never are." },
    { h: "Own your failures precisely",
      p: "The strongest failure stories are specific, technical, and end with a systemic change — not just 'I learned to communicate more'. 'My CV score was inflated by leakage; I now put every transformation inside a Pipeline' shows exactly the kind of learning that transfers." },
    { h: "Ask questions that reveal seriousness",
      p: "Ask about how they evaluate models, what their biggest data quality challenge is, how a co-op's work gets shipped, and what would make someone successful in the role. Questions about the work signal engagement; questions about perks do not." }
  ],
  cheat: {
    title: "Behavioural Final Card",
    pts: [
      "ONE narrative arc, stories are chapters",
      "'Tell me about yourself': 90s, present-past-future",
      "STAR w/ 50% on Action, quantified Result",
      "failure story: specific + systemic fix",
      "conflict story: focus on resolution not blame",
      "'why this company': name something REAL",
      "ask about: eval, data problems, shipping, success",
      "always have 3 questions ready. always."
    ],
    eq: ["coachable + communicates + owns outcomes = co-op hire"],
    warn: "Never criticise a past team, professor, or project harshly. It reads as a future liability regardless of whether you were right."
  },
  vids: [
    { t: "Tell me about yourself best answer", ch: "Jeff Su" },
    { t: "Questions to ask at the end of an interview", ch: "Exponent" }
  ],
  lab: {
    t: "Final behavioural polish",
    steps: [
      "Rewrite all 6 stories from day 35 with 12 weeks of new material",
      "Write and rehearse the 90-second 'tell me about yourself' with the 90-day arc in it",
      "Record all of them; cut anything over 90 seconds",
      "Write 8 questions to ask interviewers; pick 3 favourites",
      "Do a full mock behavioural round with someone who will be honest with you"
    ],
    out: "A coherent personal narrative you can deliver under pressure."
  },
  qs: [
    { q: "Tell me about yourself.",
      a: "Present, past, future in 90 seconds. Present: who you are and what you focus on. Past: the two or three most relevant things you have built and what they demonstrate. Future: what you want next and specifically why this team. Weave the 90-day sprint in as evidence of self-direction — identifying a gap, building a structured plan, and shipping six measured projects is a strong, verifiable signal of exactly the ownership co-op managers screen for." }
  ],
  tags: ["behavioural", "narrative", "interview"]
},
{
  d: 89, w: 13, phase: "MLOps & Interview", track: "Interview",
  title: "Mock Interviews & Portfolio Polish",
  hook: "Full dress rehearsal. Find the gaps while they are still cheap.",
  why: "Performance under pressure is a separate skill from knowledge. The only way to build it is to simulate the pressure before it counts.",
  learn: [
    { h: "Simulate the real conditions",
      p: "Camera on, time-boxed, with someone who will interrupt and push back. The gap between knowing something and explaining it while nervous with someone watching is large, and it only closes with practice." },
    { h: "Polish the first ten seconds of everything",
      p: "Recruiters and hiring managers scan. GitHub profile README, pinned repos, the top of each project README, and your LinkedIn headline are where decisions get made. Make each one immediately clear about what you built and what it achieved." }
  ],
  cheat: {
    title: "Final Polish Checklist",
    pts: [
      "[ ] GitHub profile README with the 6 projects",
      "[ ] 6 repos pinned, each w/ demo GIF or chart",
      "[ ] every README: problem, result, how to run",
      "[ ] LinkedIn headline + featured demo links",
      "[ ] resume final: 1 page, quantified, projects up top",
      "[ ] this tracker site deployed (it IS a project)",
      "[ ] 3 mocks done: technical, system design, behavioural",
      "[ ] 3 questions ready for interviewers",
      "[ ] application tracker up to date"
    ],
    eq: ["reviewers give you 30 seconds. optimise those 30 seconds."],
    warn: "Do not start a new project in week 13. Polish and present what you have. Six well-documented projects beat seven where one is half-finished."
  },
  vids: [
    { t: "Mock machine learning interview", ch: "Exponent" }
  ],
  lab: {
    t: "Dress rehearsal",
    steps: [
      "Mock 1: ML theory and coding, 60 minutes, recorded",
      "Mock 2: ML system design, 45 minutes",
      "Mock 3: behavioural, 45 minutes",
      "After each, list 3 concrete improvements and fix them the same day",
      "Complete the polish checklist above end to end"
    ],
    out: "Three completed mocks and a fully polished public presence."
  },
  qs: [
    { q: "Do you have any questions for us?",
      a: "Always yes, and make them about the work. How do you evaluate models before shipping them? What is the hardest data quality problem the team deals with? What does a co-op's first project usually look like, and does that work reach production? What separates someone who does well here from someone who struggles? These signal that you are thinking about doing the job, not just getting it." }
  ],
  tags: ["mock-interview", "portfolio", "polish"]
},
{
  d: 90, w: 13, phase: "MLOps & Interview", track: "Review",
  title: "Day 90 — Launch, Reflect, Continue",
  hook: "The sprint ends. The compounding does not.",
  why: "Ninety days ago you could not have built any of this. Today you can frame problems, train models, deploy systems, build RAG applications, and defend every decision. Consolidate the win and set up what comes next.",
  learn: [
    { h: "Take stock honestly",
      p: "Six shipped projects. Around 90 topics with notes. A deployed system with monitoring. A measured RAG pipeline. A fine-tuned model. Written system designs. Rehearsed stories. That is a substantially stronger position than most co-op applicants, and it is worth spending an hour writing down." },
    { h: "The habits matter more than the content",
      p: "Baseline before modelling. Measure before optimising. Pipeline everything to prevent leakage. Evaluate before believing. Ship before perfecting. Those habits will outlast every specific technique in this curriculum, including the ones that will be obsolete in two years." },
    { h: "What comes next",
      p: "Keep a smaller cadence: one deep topic per week, one project per month, continuous applications until you sign. Read papers in the area you enjoyed most. Contribute to an open source project. And when the co-op starts, the learning habit is what will make you useful in week one rather than week eight." }
  ],
  cheat: {
    title: "90 Days: Delivered",
    pts: [
      "[x] math + classical ML foundations",
      "[x] deep learning + PyTorch from scratch",
      "[x] transformers + attention, implemented",
      "[x] LLM engineering, RAG, agents",
      "[x] MLOps: serve, track, monitor, deploy",
      "[x] NeetCode 150, all 18 patterns",
      "[x] 6 shipped projects w/ real metrics",
      "[x] interview-ready across all rounds",
      "-> now: 1 topic/week, 1 project/month,",
      "   apply until signed. keep the streak."
    ],
    eq: ["consistency for 90 days > intensity for 9"],
    warn: "The most common failure now is stopping entirely. Drop to a sustainable cadence instead — one topic a week keeps everything warm at a fraction of the effort."
  },
  vids: [
    { t: "How to keep learning machine learning after the basics", ch: "Ken Jee" }
  ],
  lab: {
    t: "Close the loop",
    steps: [
      "Write a retrospective: what worked, what did not, what you would change",
      "Publish a blog post or LinkedIn article: 'What I learned building 6 AI projects in 90 days' with links to all of them",
      "Update the resume one final time and send 10 more applications today",
      "Set your next 30-day plan: 4 topics, 1 project, a weekly application target",
      "Export your progress from this site and keep it. Then take a day off. You earned it."
    ],
    out: "A published retrospective, a final resume, and a next-30-days plan."
  },
  qs: [
    { q: "Where do you see yourself growing over the next year?",
      a: "Be specific and grounded in what you have actually done. Name the area you found most engaging in these 90 days, what you want to go deeper on, and what kind of work would accelerate that — for example moving from building RAG systems to understanding retrieval quality at scale, or from training models to operating them. Concrete direction reads as self-aware; 'I want to learn everything' does not." }
  ],
  tags: ["review", "reflection", "milestone", "launch"]
}

];
