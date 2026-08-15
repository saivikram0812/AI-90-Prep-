/* ============================================================
   INTERVIEW BANK — checkable question bank by round.
   Tick each when you can answer it OUT LOUD, unprompted, in
   under 2 minutes, without notes.
   ============================================================ */

window.INTERVIEW = [
{
  cat: "ML Fundamentals",
  note: "Asked in essentially every round. If any of these are shaky, they are your highest-priority revision.",
  qs: [
    { id: "f1", q: "Explain the bias-variance tradeoff and how you diagnose which one you have.", key: "err = bias^2 + var + noise. Diagnose from learning curves: high train error + small gap = bias; low train error + big gap = variance. More data fixes variance, NOT bias." },
    { id: "f2", q: "What is overfitting and how do you prevent it?", key: "Memorised noise. Prevent: more data, augmentation, regularisation (L1/L2/dropout), simpler model, early stopping, cross-validation." },
    { id: "f3", q: "L1 vs L2 regularisation — and why is L1 sparse?", key: "L1 constraint region has corners on the axes, so the optimum lands where coefficients are exactly 0. L2's sphere has no corners. L1 = feature selection, L2 = handles correlated features." },
    { id: "f4", q: "Explain precision, recall, F1, and when you optimise each.", key: "P = TP/(TP+FP) cost of false alarms. R = TP/(TP+FN) cost of misses. Spam -> precision. Cancer screening -> recall. F1 only when genuinely indifferent." },
    { id: "f5", q: "When is ROC-AUC the wrong metric?", key: "Under heavy imbalance: FPR's denominator is the huge negative class, so it flatters. Use PR-AUC and precision@k. Also wrong when you need calibration, since AUC is rank-only." },
    { id: "f6", q: "What is data leakage? Give three concrete examples.", key: "Target leakage (feature known only after the outcome), train-test contamination (scaling/imputing before split), temporal leakage (random split on time series), group leakage (same user in both splits)." },
    { id: "f7", q: "Bagging vs boosting.", key: "Bagging: parallel, independent, bootstrap samples, averages, attacks VARIANCE, deep learners. Boosting: sequential, each fits prior errors, attacks BIAS, shallow learners, can overfit." },
    { id: "f8", q: "How does Random Forest reduce overfitting?", key: "Averaging k models divides variance by k — but only if they are decorrelated. Random feature selection per split is what decorrelates them. Var = rho*s^2 + (1-rho)*s^2/k." },
    { id: "f9", q: "How do you handle a 99:1 imbalanced dataset?", key: "Order: change metric (PR-AUC), class weights, TUNE THRESHOLD from cost matrix, then resample inside folds only. Below 0.1% positives, reframe as anomaly detection." },
    { id: "f10", q: "Explain cross-validation and its variants.", key: "k-fold gives mean AND std. Stratified for classification, GroupKFold for shared entities, TimeSeriesSplit for temporal. Nested CV for unbiased estimates after tuning." },
    { id: "f11", q: "Why use a Pipeline instead of transforming upfront?", key: "Transformers must fit on the training fold only. Upfront scaling leaks validation statistics into training and inflates CV. Pipelines make correctness structural." },
    { id: "f12", q: "Explain PCA and when it hurts.", key: "Eigenvectors of covariance, ordered by variance. Hurts when signal is in a low-variance direction (it's unsupervised), destroys interpretability, and is usually pointless for trees." },
    { id: "f13", q: "How do you choose the number of clusters?", key: "Silhouette over elbow (elbow is ambiguous), gap statistic if principled. But the real answer is downstream utility — if marketing runs 4 campaigns, 4 usable clusters beat 7 optimal ones." },
    { id: "f14", q: "Explain a p-value to a non-technical stakeholder.", key: "How surprising the result would be if the change did nothing. p=0.03 means we'd see a difference this big by chance 3% of the time. NOT the probability the change works." },
    { id: "f15", q: "Why not use MSE for classification?", key: "Non-convex with sigmoid, and its gradient contains a sigmoid-derivative factor that vanishes exactly when the model is confidently wrong. Cross-entropy's gradient is (p - y), which stays large." }
  ]
},
{
  cat: "Deep Learning",
  note: "Expect at least three of these in any AI-flavoured co-op interview.",
  qs: [
    { id: "d1", q: "Explain backpropagation.", key: "Reverse-mode autodiff. Forward pass builds the graph and caches intermediates; backward pass applies the chain rule node by node from the loss. Reverse mode because one scalar output, many parameters." },
    { id: "d2", q: "Why do vanishing gradients happen and how do you fix them?", key: "Gradients are products of per-layer derivatives; consistently <1 decays exponentially. Fix: ReLU family, residual connections, He/Xavier init, normalisation layers." },
    { id: "d3", q: "Why do neural networks need activation functions?", key: "Composition of linear maps is linear. Without nonlinearity a 100-layer net equals one linear layer and can only learn linear boundaries." },
    { id: "d4", q: "What is the dying ReLU problem?", key: "Pre-activation permanently negative -> output 0, derivative 0, no gradient, unit never recovers. Fix: LeakyReLU/ELU, lower lr, He init." },
    { id: "d5", q: "How does dropout work, and why does train differ from test?", key: "Zero units with prob p during training to prevent co-adaptation; approximates an ensemble of subnetworks. At test all units active. PyTorch uses inverted dropout (scale by 1/(1-p) at train)." },
    { id: "d6", q: "BatchNorm vs LayerNorm — when each?", key: "BN across the batch per feature: needs decent batch size, keeps running stats, good for CNNs. LN across features per example: batch-independent, works at batch size 1 and variable lengths -> transformers." },
    { id: "d7", q: "Adam vs SGD vs AdamW.", key: "Adam = momentum + per-parameter adaptive lr from first/second moments. AdamW decouples weight decay so it isn't scaled by the adaptive term — correct L2, standard for transformers. Tuned SGD+momentum often generalises slightly better in vision." },
    { id: "d8", q: "Your loss is not decreasing. Walk me through debugging.", key: "Look at real batches. Check loss at init ~ ln(n_classes). Overfit 8 samples. lr sweep. Verify zero_grad + .grad not None. Log per-layer gradient norms. Check train/eval mode." },
    { id: "d9", q: "Why convolutions instead of fully-connected layers for images?", key: "Parameter sharing (orders of magnitude fewer weights), correct inductive bias (locality + translation equivariance), and preserved spatial structure." },
    { id: "d10", q: "Why do residual connections help?", key: "They fix DEGRADATION (deeper nets had worse TRAINING error — an optimisation failure, not overfitting). Identity is free, so extra depth can't hurt; also gives gradients a direct path." },
    { id: "d11", q: "Compute the output shape of a conv layer.", key: "out = floor((in + 2p - k)/s) + 1, channels = number of filters. params = k*k*C_in*C_out + C_out." },
    { id: "d12", q: "When do you freeze a backbone vs fine-tune fully?", key: "Freeze for small data in a similar domain. Fine-tune for more data or a distant domain. Middle path: train head frozen, then unfreeze with lr/100. Watch catastrophic forgetting." },
    { id: "d13", q: "What is mixed precision training?", key: "fp16/bf16 compute with an fp32 master copy and loss scaling. ~2x throughput, ~half activation memory, negligible accuracy cost. torch.autocast + GradScaler." },
    { id: "d14", q: "Explain non-maximum suppression.", key: "Sort detections by confidence, keep the top, drop anything overlapping above an IoU threshold, repeat, per class. Soft-NMS decays instead of dropping; DETR removes the need entirely." }
  ]
},
{
  cat: "Transformers & LLMs",
  note: "The highest-value block for AI co-ops right now. Be able to go three levels deep on every one.",
  qs: [
    { id: "t1", q: "Explain self-attention.", key: "Each token projects to Q, K, V. Query dotted with every key gives relevance scores, scaled by sqrt(d_k), softmaxed to weights, then weighted-sum the values. Any two positions connect in one step." },
    { id: "t2", q: "Why divide by sqrt(d_k)?", key: "Dot product of d_k-dim unit-variance vectors has variance d_k. Large scores saturate softmax toward one-hot where its gradient vanishes. Scaling restores unit variance." },
    { id: "t3", q: "Why did transformers replace RNNs?", key: "Parallelism — RNNs are sequential so training can't parallelise over the sequence. And path length — attention connects any two positions in one step instead of many degrading transformations." },
    { id: "t4", q: "Draw and explain a transformer block.", key: "Pre-norm: x = x + MHA(LN(x)); x = x + FFN(LN(x)). FFN expands to 4d and back, holds ~2/3 of params. Attention moves information, FFN transforms it." },
    { id: "t5", q: "Why do transformers need positional encoding?", key: "Attention is permutation-equivariant — no term depends on index. Sinusoidal (extrapolates), learned (simple, hard limit), RoPE (rotates q,k by position, relative, modern default)." },
    { id: "t6", q: "Encoder-only vs decoder-only vs encoder-decoder.", key: "Encoder (BERT): bidirectional, understanding/embeddings, can't generate. Decoder (GPT): causal mask, generation, scales best. Enc-dec (T5): cross-attention, seq2seq." },
    { id: "t7", q: "Explain temperature and top-p.", key: "Temperature divides logits pre-softmax: <1 sharpens, >1 flattens, 0 = greedy. Top-p keeps the smallest token set summing to p — adaptive to model confidence. Use temp 0 for structured tasks." },
    { id: "t8", q: "What is the KV cache and why does it matter?", key: "Caches keys/values of previous positions so each new token is one incremental step instead of recomputing everything. Its memory is the main serving constraint — hence GQA/MQA." },
    { id: "t9", q: "Why do LLMs struggle to count letters in a word?", key: "They never see letters — text is subword tokens. 'strawberry' may be 2-3 tokens with no character-level access. Same cause as inconsistent arithmetic and string reversal." },
    { id: "t10", q: "Explain LoRA.", key: "Freeze W, learn W + BA with inner rank r=8-64. Trains <1% of params, tiny optimiser memory, swappable adapters. Works because the adaptation update is empirically low-rank. B init to 0 so training starts at the pretrained model." },
    { id: "t11", q: "RAG vs fine-tuning — when each?", key: "RAG for FACTS: updatable without retraining, citable, access-controllable, reduces hallucination. Fine-tune for FORM: format, style, task structure. Fine-tuning to inject facts produces fluent hallucination." },
    { id: "t12", q: "What does FlashAttention do?", key: "Exact, not approximate. Tiles the computation to keep blocks in on-chip SRAM and uses online softmax so the n x n matrix is never written to HBM. It's an IO optimisation." },
    { id: "t13", q: "How do you reduce hallucination?", key: "Ground with retrieval, require citations, give an explicit 'I don't know' path, temp 0, schema constraints, measure faithfulness. Most RAG 'hallucination' is actually retrieval failure." }
  ]
},
{
  cat: "RAG & AI Engineering",
  note: "The most likely deep-dive if the role mentions LLMs. Answer with YOUR measured numbers, not definitions.",
  qs: [
    { id: "r1", q: "Design a RAG system for internal company documentation.", key: "Offline: parse, structure-aware chunk, embed, index with metadata for source/permissions/recency. Online: embed query, hybrid search, permission filter, rerank top-50 to top-5, generate with citations. Measure retrieval and generation separately." },
    { id: "r2", q: "Your RAG gives wrong answers. Debug it.", key: "Isolate the stage in order: was the chunk retrieved at all (recall)? was it retrieved but buried (ranking)? was it split across chunks (chunking)? was context right but answer wrong (generation)? Retrieval dominates." },
    { id: "r3", q: "How do you choose a chunking strategy?", key: "Empirically against labelled Q->chunk pairs measuring recall@k. Start recursive ~500 tok with 10-15% overlap; prefer structure-aware where structure exists; prepend title+headings; small-to-big retrieval." },
    { id: "r4", q: "What is hybrid search and why does it help?", key: "Dense vector (semantic, fuzzy) + BM25 (exact, literal), fused with RRF: sum 1/(60+rank). Vectors fail on IDs, error codes, rare names; BM25 fails on paraphrase. Different failure modes." },
    { id: "r5", q: "Why add a reranker?", key: "Bi-encoders embed query and doc separately (fast, precomputable, but never see them together). Cross-encoders score the pair jointly — far more accurate, too slow for the corpus. Retrieve 50 cheap, rerank to 5 accurate. Often the single biggest quality win." },
    { id: "r6", q: "How do you evaluate a RAG system?", key: "Separately. Retrieval: recall@k (the hard ceiling), precision@k, MRR. Generation: faithfulness (claims supported by context), answer relevance. Ops: p95 latency, cost/query, cache hit rate. Build 100 verified pairs." },
    { id: "r7", q: "When do you actually need a vector database?", key: "Less often than people think. Under ~100k vectors brute force or pgvector exact search is fine. Dedicated stores earn complexity at scale, with heavy metadata filtering, or high write throughput." },
    { id: "r8", q: "How does ANN search work and what does it cost you?", key: "HNSW: navigable small-world graph, high recall, more RAM. IVF: cluster + probe n. PQ: compress. All are APPROXIMATE — measure recall@k against brute force on your data." },
    { id: "r9", q: "How do you get reliable JSON from an LLM?", key: "Schema-constrained decoding where available (structurally impossible to be invalid), Pydantic/Zod as single source of truth, temp 0, validate + retry once with the error, and give an explicit null/unknown option so it doesn't fabricate." },
    { id: "r10", q: "How does tool calling work under the hood?", key: "You pass function schemas; the model emits a structured call; YOUR code validates and executes; the result is appended and the model continues. The model only proposes — execution and authorisation stay in your code." },
    { id: "r11", q: "How does an agent work and why do they fail?", key: "LLM in a loop: Thought -> Action -> Observation. Fail from compounding error (0.9^5 = 0.59), loops, context overflow, cost blowup. Cap iterations, detect repeats, summarise history. If steps are known in advance, use a pipeline." },
    { id: "r12", q: "What is prompt injection and how do you defend?", key: "Instructions and data share the context channel. Indirect (via retrieved docs) is worst. No full fix — layer: delimit untrusted content, least-privilege tools, validate arguments, human confirm irreversible actions, validate output. Tool results are DATA." },
    { id: "r13", q: "Your LLM feature costs too much. What do you do?", key: "Measure token distribution first. Then prompt caching on the stable prefix, trim system prompt and context, cap output length (output costs 3-5x), route simple requests to a small model, cache exact and semantic duplicates. Validate against the eval set." },
    { id: "r14", q: "How would you evaluate an LLM feature with no ground truth?", key: "Golden set of 50-200 curated cases. Layer: deterministic checks, reference metrics where possible, LLM-judge with an explicit rubric, human sample review. Validate the judge against human labels; mitigate position/length/self-preference bias." }
  ]
},
{
  cat: "ML System Design",
  note: "Highest-weight round. Always say the framework out loud before diving in.",
  qs: [
    { id: "s1", q: "Design a video recommendation system.", key: "Two-stage: candidate generation (two-tower + ANN, recall-optimised) -> ranking (rich features, precision-optimised). Feature store to prevent skew. Offline NDCG, online watch time via A/B. Cold start, feedback loops, diversity." },
    { id: "s2", q: "Design real-time fraud detection.", key: "Rank not classify — threshold from cost asymmetry. Real-time aggregates from a feature store, point-in-time correct. GBDT baseline, graph features for rings. <100ms budget, rules fallback. PR-AUC + precision@review-capacity. Adversarial drift + delayed labels." },
    { id: "s3", q: "Design an AI customer support assistant.", key: "RAG over the knowledge base with citations and access control. Eval without ground truth: golden set + LLM judge on faithfulness. Human escalation path. Cost/latency budget, caching, injection defences, explicit 'I don't know'." },
    { id: "s4", q: "Design a delivery ETA prediction system.", key: "Temporal validation, seasonality and holidays, route/restaurant/courier/weather features. Prediction intervals not point estimates. Asymmetric cost — late is worse than early. Monitor drift as cities and traffic change." },
    { id: "s5", q: "What is train/serve skew and how do you prevent it?", key: "Features computed differently in training vs serving — model looks good offline, fails in production, nothing errors. Fix: feature store computing once for both paths, plus point-in-time-correct joins for training data." },
    { id: "s6", q: "How do you know when a model needs retraining?", key: "Labels are delayed, so use leading indicators: input drift (PSI>0.2), prediction drift, confidence collapse. When labels arrive, track true metric vs threshold. Trigger on sustained degradation + a scheduled floor. Validate before promotion, keep rollback." },
    { id: "s7", q: "Data drift vs concept drift.", key: "Data drift: P(X) changed (new user population) — detectable immediately from inputs. Concept drift: P(y|X) changed (fraud tactics evolved) — more dangerous, needs labels or a proxy to detect." },
    { id: "s8", q: "How would you deploy a model to production?", key: "Version the artefact + preprocessing, FastAPI with validation/health/version, load once at startup, structured logging, containerise with pinned deps and external weights, shadow -> canary rollout, monitor latency + prediction distribution, rollback plan." },
    { id: "s9", q: "How do you make ML experiments reproducible?", key: "Pin all five: code (git SHA), data (hash/DVC), config (versioned file, logged), environment (pinned deps + image), seeds. Track automatically. Test: rerun a logged config six months later and match the metric." },
    { id: "s10", q: "What is a feature store and what does it solve?", key: "One feature definition served to both training and inference — eliminates train/serve skew. Plus point-in-time correct joins preventing temporal leakage, and reuse across teams. Real operational cost, so justify it." },
    { id: "s11", q: "How do you handle a model that is too slow?", key: "Profile first — often preprocessing/IO, not the model. Then: dynamic batching, quantise to int8, distil to a smaller model, ONNX/TensorRT runtime, cache, GPU. Or a cheap fast filter handling the easy majority with escalation." }
  ]
},
{
  cat: "Coding Round",
  note: "Implement each of these from a blank file in under 20 minutes, no references.",
  qs: [
    { id: "c1", q: "Implement k-nearest neighbours from scratch.", key: "Vectorised distance via broadcasting, argpartition for top-k (not full sort), majority vote with tie handling. Mention scaling is required and the O(n) query cost." },
    { id: "c2", q: "Implement k-means from scratch.", key: "k-means++ init, assign by nearest centroid (broadcast), recompute means, stop on assignment stability or tolerance, cap iterations. Handle empty clusters. Scale first; run multiple times, keep lowest inertia." },
    { id: "c3", q: "Implement linear regression with gradient descent.", key: "grad = (2/n) X^T (Xw - y). Standardise features first or GD zigzags. Track loss, verify it decreases monotonically." },
    { id: "c4", q: "Implement logistic regression with gradient descent.", key: "p = sigmoid(Xw+b), loss = -[y log p + (1-y) log(1-p)], grad = X^T (p - y)/n. Use a numerically stable sigmoid and clip probabilities before the log." },
    { id: "c5", q: "Compute a confusion matrix and derive precision, recall, F1.", key: "TP/FP/TN/FN from comparisons. Guard every division by zero. Support a configurable threshold, not a hardcoded 0.5." },
    { id: "c6", q: "Implement train_test_split and stratified k-fold.", key: "Shuffle with a seed. For stratified, split per class then combine so ratios are preserved in every fold. Yield index arrays, not copies." },
    { id: "c7", q: "Implement softmax and cross-entropy stably.", key: "Subtract max before exp (softmax is shift-invariant). For CE use log-sum-exp rather than log(softmax(x)). Explain why naive versions produce NaN." },
    { id: "c8", q: "Implement scaled dot-product attention.", key: "scores = Q @ K.T / sqrt(d_k), optional causal mask to -inf, softmax over the last axis, @ V. Get the shapes right: (B, H, N, d)." },
    { id: "c9", q: "Given a dataframe of transactions, compute month-over-month revenue growth per category.", key: "Parse dates, groupby category + period, sum, sort, then pct_change() within group via groupby().transform or apply. Watch for missing months." },
    { id: "c10", q: "Find the top 3 earners per department (SQL).", key: "CTE with ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC), outer WHERE rn <= 3. Use DENSE_RANK if ties should all be included." },
    { id: "c11", q: "Implement IoU and non-maximum suppression.", key: "IoU = intersection area / union area, guard zero-area boxes. NMS: sort by score, greedily keep, drop IoU > threshold, per class." },
    { id: "c12", q: "Implement PSI (population stability index) for drift detection.", key: "Bin the reference distribution, compute both distributions' proportions per bin, PSI = sum (a - e) * ln(a/e). Add epsilon to avoid log(0). >0.1 watch, >0.2 investigate." }
  ]
},
{
  cat: "Behavioural",
  note: "Rehearse each to under 90 seconds, out loud, recorded. Action gets 50% of your airtime; the Result must be quantified.",
  qs: [
    { id: "b1", q: "Tell me about yourself.", key: "Present-past-future in 90s. Weave in the 90-day sprint as evidence of self-direction. Never read the resume aloud." },
    { id: "b2", q: "Tell me about a project you're proud of.", key: "Problem + who it helps, why it was non-trivial, what you tried and what failed, honest result vs baseline, what you'd do differently." },
    { id: "b3", q: "Tell me about a time you failed.", key: "Specific, technical, bounded. End with a SYSTEMIC fix, not 'I learned to communicate more'. e.g. leakage inflated CV -> everything now goes in a Pipeline." },
    { id: "b4", q: "Tell me about a disagreement with a teammate.", key: "Focus on how you resolved it and what you learned, not on who was right. Never criticise the other person harshly." },
    { id: "b5", q: "Tell me about a time you had to learn something quickly.", key: "The 90-day sprint itself works here, or a specific tool you picked up under deadline. Emphasise the method you used, not just the outcome." },
    { id: "b6", q: "Tell me about a time you took initiative.", key: "Something nobody asked you to do. This tracker, the curriculum design, or a project you scoped yourself." },
    { id: "b7", q: "Why are you interested in this role / company?", key: "Name something REAL — their product, a paper, an engineering blog post. Connect it to a specific project of yours and to what you want to learn." },
    { id: "b8", q: "What's your biggest weakness?", key: "A real gap plus concrete evidence you're closing it. The 90-day plan IS that evidence. Never a fake weakness." },
    { id: "b9", q: "How do you handle being stuck?", key: "Concrete process: reproduce minimally, isolate the variable, check assumptions from the outside in, time-box before asking, and come with what you've already ruled out." },
    { id: "b10", q: "Do you have any questions for us?", key: "Always yes, always about the work. How do you evaluate models before shipping? Biggest data quality challenge? Does co-op work reach production? What makes someone successful here?" }
  ]
}
];
