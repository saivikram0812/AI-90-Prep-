/* ============================================================
   PROJECT IDEAS — tiered, co-op targeted
   Six are scheduled into the curriculum (days 28, 35, 49, 62, 76, 84).
   The rest are alternates / stretch options.
   ============================================================ */

window.PROJECTS = [

/* ---------- TIER 1 : Foundation (weeks 4-5) ---------- */
{
  id: "p1-churn",
  tier: 1, day: 28, scheduled: true,
  title: "Subscriber Churn — Ranking for Retention",
  cat: "Tabular ML",
  pitch: "Predict which subscribers will cancel in the next 30 days so a retention team with limited capacity can prioritise who to contact.",
  proves: ["Problem framing with a real decision attached", "Honest validation and leakage prevention", "Threshold selection from business cost", "Model explanation with SHAP"],
  stack: ["pandas", "scikit-learn", "LightGBM", "SHAP", "Optuna"],
  steps: [
    "Frame it: define churn, the horizon, the prediction timestamp, and what action the prediction triggers",
    "EDA with explicit leakage hunt — any feature only known after cancellation is out",
    "Baseline: majority class, then simple logistic regression",
    "Pipeline with ColumnTransformer; stratified CV reporting mean and std",
    "Tune LightGBM with Optuna; tune the decision threshold against a cost matrix",
    "SHAP global and local explanations; error analysis on the 20 worst predictions",
    "README aimed at a retention manager, not an ML engineer"
  ],
  stretch: ["Add uplift modelling: who will churn AND can be persuaded", "Simulate campaign ROI at different thresholds"],
  data: "Telco churn (Kaggle), KKBox churn, or any subscription dataset with timestamps",
  hours: "10-14",
  why: "Every company has a retention problem. This is the most universally legible ML project there is, and the framing work transfers to almost any interview question."
},
{
  id: "p1-fraud",
  tier: 1,
  title: "Rare-Event Detection Under Extreme Imbalance",
  cat: "Tabular ML",
  pitch: "Detect fraudulent transactions at 0.17% positive rate, where accuracy is meaningless and threshold choice is everything.",
  proves: ["Metric selection under imbalance", "Threshold tuning beats resampling", "Cost-sensitive decision making", "Precision@k for a capacity-limited review queue"],
  stack: ["pandas", "scikit-learn", "XGBoost", "imbalanced-learn"],
  steps: [
    "Establish that accuracy is useless here — show the trivial baseline scoring 99.8%",
    "Compare interventions in order: class weights, threshold tuning, then SMOTE inside CV folds",
    "Report PR-AUC and precision@100 (matched to a realistic review team's capacity)",
    "Build a cost matrix and compute the cost-optimal threshold; state the dollar impact",
    "Compare against IsolationForest as an unsupervised alternative"
  ],
  stretch: ["Add graph features for fraud-ring detection", "Simulate adversarial drift: retrain as patterns change"],
  data: "Credit Card Fraud (Kaggle), IEEE-CIS Fraud Detection",
  hours: "8-12",
  why: "Demonstrates the single most-tested judgement in applied ML: choosing metrics and thresholds from business cost rather than defaults."
},
{
  id: "p1-segments",
  tier: 1, day: 35, scheduled: true,
  title: "Customer Segmentation with Named Personas",
  cat: "Unsupervised / DS",
  pitch: "RFM-based segmentation that ends with named personas and a concrete recommendation per segment — not just coloured scatter plots.",
  proves: ["Unsupervised methods with business validation", "Communicating to non-technical stakeholders", "Knowing that k is a business decision as much as a statistical one"],
  stack: ["pandas", "scikit-learn", "plotly"],
  steps: [
    "Engineer RFM features from raw transactions",
    "Scale, then compare k-means, hierarchical, and DBSCAN",
    "Choose k with silhouette AND downstream usability (how many campaigns can marketing actually run?)",
    "Profile and NAME each segment; write one recommended action per segment",
    "Validate: do segments differ meaningfully on a holdout metric?"
  ],
  stretch: ["Add CLV prediction per segment", "Track segment migration over time"],
  data: "Online Retail II (UCI), Brazilian E-Commerce (Olist), Instacart",
  hours: "8-10",
  why: "The most common real analytics deliverable, and one of the few projects that demonstrates stakeholder communication."
},

/* ---------- TIER 2 : Deep Learning (week 7) ---------- */
{
  id: "p2-vision",
  tier: 2, day: 49, scheduled: true,
  title: "Custom Image Classifier with Live Demo",
  cat: "Computer Vision",
  pitch: "Collect your own image dataset, fine-tune a pretrained backbone, and deploy a demo an interviewer can use from their phone.",
  proves: ["Data collection and labelling on real, messy data", "Transfer learning with proper learning-rate strategy", "Augmentation ablation", "Deployment"],
  stack: ["PyTorch", "torchvision", "timm", "Gradio", "HuggingFace Spaces"],
  steps: [
    "Collect 300+ images across 3-5 classes — photograph them yourself if possible",
    "Baseline: small CNN from scratch",
    "Feature extraction with a frozen pretrained backbone",
    "Full fine-tuning with discriminative learning rates",
    "Augmentation ablation table: none / flip+crop / RandAugment / mixup",
    "Confusion matrix and a failure gallery — show the images it gets wrong",
    "Gradio app deployed to Spaces; demo GIF at the top of the README"
  ],
  stretch: ["Add Grad-CAM to visualise what the model attends to", "Quantise to int8 and report the latency/accuracy tradeoff"],
  data: "Your own photos — plants, food, equipment, handwriting, anything you have access to",
  hours: "12-16",
  why: "A live demo is disproportionately memorable, and custom data proves you can handle the collection and labelling that real work requires."
},
{
  id: "p2-detect",
  tier: 2,
  title: "Object Detection on a Custom Domain",
  cat: "Computer Vision",
  pitch: "Fine-tune a detector on a domain you care about, and analyse exactly which objects it misses and why.",
  proves: ["Detection task formulation", "Annotation workflow", "mAP and IoU understanding", "Systematic failure analysis"],
  stack: ["Ultralytics YOLO", "Roboflow", "OpenCV"],
  steps: [
    "Annotate 150-300 images with bounding boxes",
    "Fine-tune a pretrained YOLO; evaluate mAP@0.5 and mAP@0.5:0.95",
    "Implement IoU and NMS yourself to prove you understand them",
    "Failure analysis by object size, occlusion, and class frequency",
    "Run inference on video and measure FPS"
  ],
  stretch: ["Add object tracking across video frames", "Deploy to run on a phone or Raspberry Pi"],
  data: "Self-annotated via Roboflow — campus scenes, sports footage, retail shelves",
  hours: "14-18",
  why: "Detection is common in real co-op work and far less common in student portfolios than classification."
},

/* ---------- TIER 3 : NLP & Fine-Tuning (week 9) ---------- */
{
  id: "p3-finetune",
  tier: 3, day: 62, scheduled: true,
  title: "LoRA Fine-Tune for Structured Extraction",
  cat: "NLP / LLM",
  pitch: "Teach a small open model to output a strict schema reliably for a domain where the base model is inconsistent.",
  proves: ["Data curation discipline", "PEFT/LoRA under real compute constraints", "Honest baselines including prompted base model", "Evaluation harness design"],
  stack: ["transformers", "peft", "bitsandbytes", "datasets", "HuggingFace Hub"],
  steps: [
    "Choose a task where the base model's format compliance is genuinely poor",
    "Curate 300-1000 instruction-response pairs; document every cleaning decision",
    "Baselines: base model, base + strong prompt, base + few-shot",
    "LoRA fine-tune; ablate rank r in [4, 16, 64] against trainable parameter count",
    "Evaluate with the day-61 harness; report format compliance AND content accuracy",
    "Push model card and dataset card to the Hub; deploy a Gradio demo"
  ],
  stretch: ["Compare LoRA against full fine-tuning if compute allows", "Add DPO on preference pairs"],
  data: "Build it — synthetic generation plus human curation is itself a demonstrable skill",
  hours: "14-20",
  why: "Fine-tuning is the clearest signal that you are an AI engineer rather than an API caller, and the data curation story is what interviewers dig into."
},
{
  id: "p3-classifier",
  tier: 3,
  title: "BERT vs LLM — A Cost/Accuracy Study",
  cat: "NLP / LLM",
  pitch: "Prove that a fine-tuned DistilBERT beats a general LLM on a narrow classification task at a fraction of the cost.",
  proves: ["Engineering judgement about when NOT to use an LLM", "Cost modelling", "Latency measurement", "Encoder fine-tuning"],
  stack: ["transformers", "sentence-transformers", "an LLM API", "scikit-learn"],
  steps: [
    "Pick a real classification task with a few thousand labelled examples",
    "Fine-tune DistilBERT with Trainer",
    "Benchmark zero-shot and few-shot LLM classification on the same test set",
    "Build the comparison table: accuracy, p95 latency, cost per 1M requests, deployment complexity",
    "Write the recommendation as if to an engineering manager"
  ],
  stretch: ["Add a routing layer: cheap model by default, escalate low-confidence cases to the LLM"],
  data: "Any labelled text dataset — support tickets, product reviews, news topics",
  hours: "8-12",
  why: "Cost-conscious judgement is rare in student portfolios and highly valued by anyone who pays an inference bill."
},

/* ---------- TIER 4 : LLM Systems (week 11) — FLAGSHIP ---------- */
{
  id: "p4-rag",
  tier: 4, day: 76, scheduled: true,
  title: "Production-Grade RAG Over Your Own Corpus",
  cat: "LLM Systems",
  pitch: "A retrieval system with measured recall, hybrid search, reranking, evaluation, cost tracking, and injection defences. The flagship.",
  proves: ["The most in-demand AI engineering skill right now", "Measurement over vibes", "Cost and latency awareness", "Security thinking"],
  stack: ["An LLM API", "sentence-transformers", "pgvector or Qdrant", "BM25", "cross-encoder reranker", "FastAPI", "RAGAS"],
  steps: [
    "Choose a corpus you genuinely use — your notes, a textbook, a codebase, school documents",
    "Write 100 verified question-to-source pairs BEFORE building the retriever",
    "Chunking bake-off: fixed vs recursive vs structure-aware vs small-to-big, measured by recall@5",
    "Add BM25 + RRF fusion; then a cross-encoder reranker; measure after each",
    "Generation with mandatory citations and an explicit 'I don't know' path",
    "Evaluate: recall@k, precision@k, faithfulness, answer relevance",
    "Instrument cost per query and p95 latency; add caching and model routing",
    "Plant an injection attack, defend it, document it in security.md",
    "ARCHITECTURE.md with every decision and what you rejected"
  ],
  stretch: ["Multi-hop retrieval for questions needing two documents", "Conversational memory with query rewriting", "Per-user access control at retrieval time"],
  data: "Your own — the personal motivation shows in the quality of your test questions",
  hours: "25-35",
  why: "This is the project that most directly matches what AI co-ops are hiring for in 2026. Built to this standard, it beats most portfolios you will compete against."
},
{
  id: "p4-agent",
  tier: 4,
  title: "Tool-Using Agent, No Framework",
  cat: "LLM Systems",
  pitch: "Implement the ReAct loop yourself, give it three real tools, and measure its actual multi-step success rate.",
  proves: ["Understanding agents rather than importing them", "Tool schema design", "Failure mode analysis", "Honest reliability measurement"],
  stack: ["An LLM API", "Pydantic", "your own loop in ~100 lines"],
  steps: [
    "Implement the loop: tool registry, prompt assembly, structured parse, dispatch, observation",
    "Three tools: calculator, document search (reuse your RAG), and one real API",
    "Add iteration capping, repeated-action detection, and full step logging",
    "Test on 20 multi-step tasks; compute end-to-end success rate",
    "Identify the dominant failure mode and fix it via tool description improvements; re-measure",
    "Compare against a deterministic pipeline for the same task — and report honestly which won"
  ],
  stretch: ["Add a supervisor with specialist sub-agents and benchmark against the single agent", "Wrap it as an MCP server"],
  data: "N/A — task design is the work here",
  hours: "16-22",
  why: "Almost everyone imports an agent framework. Writing the loop and measuring its reliability puts you in a much smaller group."
},
{
  id: "p4-mcp",
  tier: 4,
  title: "MCP Server for a Tool You Actually Use",
  cat: "LLM Systems",
  pitch: "Build and publish a Model Context Protocol server exposing tools and resources for something in your own workflow.",
  proves: ["Protocol-level thinking", "Clean tool and schema design", "Awareness of where the ecosystem is heading"],
  stack: ["MCP SDK", "Python or TypeScript", "Pydantic/Zod"],
  steps: [
    "Choose the target: your notes, your GitHub, a local database, even this tracker",
    "Expose 3-4 tools with precise descriptions and strict argument schemas",
    "Expose at least one resource",
    "Test 20 realistic requests through a client; fix descriptions where the model chose wrongly",
    "Document thoroughly and publish"
  ],
  stretch: ["Add authentication and per-tool permissions", "Publish to a public MCP registry"],
  data: "N/A",
  hours: "10-14",
  why: "Extremely differentiated. Very few co-op applicants have built one, and it signals you follow the ecosystem rather than only coursework."
},

/* ---------- TIER 5 : MLOps (week 12) ---------- */
{
  id: "p5-mlops",
  tier: 5, day: 84, scheduled: true,
  title: "Deployed ML System with Monitoring",
  cat: "MLOps",
  pitch: "A simple model taken all the way: config-driven training, registry, containerised API, CI, load tests, and a drift dashboard.",
  proves: ["You can operate models, not just train them", "Reproducibility discipline", "Production thinking end to end"],
  stack: ["FastAPI", "Docker", "MLflow", "GitHub Actions", "Evidently", "Railway/Render/Fly.io"],
  steps: [
    "Config-driven training pipeline with MLflow tracking and a model registry",
    "FastAPI service: /predict, /health, /version, with Pydantic validation and structured logging",
    "Multi-stage Dockerfile; weights fetched at startup, not baked in",
    "GitHub Actions: tests, lint, and image build on every push",
    "Load test; report p50, p95, and requests/sec",
    "Drift monitoring with PSI on key features; a dashboard; defined alert thresholds",
    "Document the retraining trigger and the rollback plan",
    "ARCHITECTURE.md with a diagram"
  ],
  stretch: ["Add shadow deployment comparing two model versions on live traffic", "Automate retraining on drift alert"],
  data: "Reuse your Project 1 model — the ops is the point, not the modelling",
  hours: "20-28",
  why: "Most student portfolios stop at a notebook. A monitored, deployed, CI-backed system is a category difference in how you get read."
},
{
  id: "p5-pipeline",
  tier: 5,
  title: "Orchestrated Feature Pipeline with Validation",
  cat: "Data Engineering",
  pitch: "An Airflow or Prefect DAG that ingests, validates, transforms, trains, and registers — idempotent and backfillable.",
  proves: ["Pipeline thinking", "Idempotency and backfill", "Data quality gates", "Train/serve skew awareness"],
  stack: ["Airflow or Prefect", "Great Expectations or Pandera", "DuckDB or Postgres"],
  steps: [
    "Build the DAG with clear task boundaries and dependencies",
    "Make every task idempotent; prove it by running the DAG twice and diffing outputs",
    "Add data validation gates that fail the DAG loudly on schema or range violations",
    "Implement a 30-day backfill over partitioned data",
    "Document where train/serve skew could enter and how you prevent it"
  ],
  stretch: ["Add a minimal feature store with point-in-time correct joins", "Add data lineage tracking"],
  data: "Any dataset with timestamps and natural partitions",
  hours: "14-18",
  why: "ML engineers spend more time on pipelines than models, and Airflow appears by name in a large share of job descriptions."
},

/* ---------- TIER 6 : Differentiators ---------- */
{
  id: "p6-nanogpt",
  tier: 6,
  title: "Transformer From Scratch — nanoGPT",
  cat: "Deep Learning",
  pitch: "Build a working GPT line by line: attention, blocks, positional encoding, tokeniser, training loop, generation.",
  proves: ["Genuine architectural understanding, not API usage", "The ability to answer any transformer follow-up"],
  stack: ["PyTorch", "your own BPE tokeniser"],
  steps: [
    "Implement BPE tokenisation yourself",
    "Implement scaled dot-product attention, then multi-head, then the full block",
    "Assemble the model with positional encoding and causal masking",
    "Train on a corpus you chose; generate samples at several checkpoints",
    "Ablate: remove residuals, then layer norm, then multi-head — document how training degrades",
    "Write it up as a teaching post"
  ],
  stretch: ["Add RoPE and compare against learned positional embeddings", "Add KV caching and measure the generation speedup"],
  data: "Any text you like — your own writing makes the samples entertaining",
  hours: "16-24",
  why: "Interviewers probe depth on transformers. Having built one means you never hit the bottom of your knowledge in that conversation."
},
{
  id: "p6-tracker",
  tier: 6,
  title: "This Site — Your Learning Tracker",
  cat: "Full Stack",
  pitch: "The tracker you are reading right now is itself a shippable project: a self-designed 90-day curriculum with progress tracking.",
  proves: ["Self-direction and planning", "Front-end capability", "Follow-through over 90 days"],
  stack: ["Vanilla JS", "localStorage", "any static host"],
  steps: [
    "Deploy it (GitHub Pages, Netlify, Vercel — all free)",
    "Add anything you wish it had as you use it",
    "Write a README framing it as a self-directed learning system",
    "Link it in your resume and LinkedIn featured section"
  ],
  stretch: ["Add a backend so progress syncs across devices", "Add spaced-repetition scheduling for the cheat notes"],
  data: "N/A",
  hours: "4-8",
  why: "It demonstrates exactly the trait co-op managers screen for: identifying a gap and building a structured system to close it."
},
{
  id: "p6-school",
  tier: 6,
  title: "Applied AI for Your School Platform",
  cat: "Applied / Domain",
  pitch: "Apply the RAG and extraction skills to a real domain problem you already care about — with real privacy constraints.",
  proves: ["Building under real constraints", "Privacy and compliance awareness", "Domain reasoning, not just Kaggle"],
  stack: ["Your existing stack", "RAG pipeline", "structured extraction"],
  steps: [
    "Pick one narrow, genuinely useful capability — a document Q&A over policies, or structured extraction from forms",
    "Define the privacy boundary explicitly before building: what data can leave the system, what cannot",
    "Build with access control at retrieval time, not after generation",
    "Evaluate with a real golden set drawn from actual use",
    "Document the compliance reasoning alongside the technical design"
  ],
  stretch: ["On-device or self-hosted model to avoid sending sensitive data to a provider at all"],
  data: "Your own domain — with careful attention to what is and is not appropriate to use",
  hours: "20+",
  why: "Interviews get far more engaging when you built something for a real user with real constraints. The privacy reasoning is itself a strong signal."
}

];
