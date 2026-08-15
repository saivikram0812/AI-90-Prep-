/* ============================================================
   PHASE 3-4 :: Days 31-60
   DS toolkit -> PyTorch -> CNNs -> Sequences -> Transformers
   ============================================================ */

window.CURRICULUM_P2 = [

/* ---------- WEEK 5 (cont) : DS Toolkit ---------- */
{
  d: 31, w: 5, phase: "Classical ML", track: "ML",
  title: "Anomaly Detection & Recommender Basics",
  hook: "Two enormous product areas that almost never come up in coursework.",
  why: "Recommenders power a huge share of industry ML jobs, and 'how would you build a recommendation system?' is a classic open-ended interview question. Anomaly detection covers the extreme-imbalance case from day 27.",
  learn: [
    { h: "Anomaly detection models 'normal'",
      p: "When positives are almost absent, stop trying to learn a boundary from three examples. Isolation Forest exploits the fact that anomalies are easier to isolate with random splits, so they sit at shallower tree depth. One-Class SVM learns a boundary around the dense region. An autoencoder learns to reconstruct normal data, and high reconstruction error flags an anomaly." },
    { h: "Collaborative filtering",
      p: "'Users like you also liked X.' User-based compares user rating vectors; item-based compares item vectors and is usually more stable because items change slower than tastes. Matrix factorisation decomposes the sparse user-item matrix into low-rank user and item embeddings whose dot product predicts a rating — this is day 9's SVD again." },
    { h: "Content-based and hybrids",
      p: "Content-based recommends items similar in feature space to what the user liked; it works from day one for new items but cannot surprise the user. Collaborative filtering discovers surprising links but suffers cold start. Every real system is a hybrid, usually with a two-stage retrieve-then-rank architecture." },
    { h: "The cold start problem",
      p: "New users and new items have no interaction history. Solutions: fall back to popularity, use content features, ask a few onboarding questions, or use contextual bandits to explore. Naming cold start unprompted in an interview is a strong signal." }
  ],
  cheat: {
    title: "AnomDet + RecSys Card",
    pts: [
      "IsolationForest: anomalies isolate FAST (shallow)",
      "autoencoder: high recon error = anomaly",
      "CF: user-item matrix -> latent factors",
      "item-item CF > user-user (items are stabler)",
      "MF: R ~ U V^T, dot product = predicted rating",
      "content-based: no cold start, no surprise",
      "real systems: retrieve (fast) -> rank (rich)",
      "metrics: precision@k, recall@k, NDCG, MAP"
    ],
    eq: ["r_hat(u,i) = mu + b_u + b_i + p_u . q_i"],
    warn: "Offline metrics like NDCG often disagree with online engagement, because recommendations change what users see and thus what data you collect. Feedback loops are the hard part of recsys."
  },
  vids: [
    { t: "Recommender systems explained collaborative filtering", ch: "Serrano Academy" },
    { t: "Isolation forest anomaly detection", ch: "Data Science Garage" }
  ],
  lab: {
    t: "Build a recommender + an anomaly detector",
    steps: [
      "Use MovieLens 100k; build item-item collaborative filtering with cosine similarity",
      "Add matrix factorisation via TruncatedSVD; compare RMSE and precision@10",
      "Handle cold start explicitly with a popularity fallback",
      "Separately: run IsolationForest on the fraud dataset and compare precision@100 against day 27's supervised model"
    ],
    out: "notebooks/31_recsys.ipynb — a genuinely differentiated portfolio topic."
  },
  qs: [
    { q: "How would you build a recommendation system for a new e-commerce site?",
      a: "Start with a popularity and category baseline because there is no interaction data. As interactions accumulate, add item-item collaborative filtering, which is more robust than user-user with sparse data. Then move to matrix factorisation or two-tower embeddings with a retrieve-then-rank architecture: fast approximate nearest-neighbour retrieval of a few hundred candidates, then a richer ranking model. Throughout, handle cold start with content features, and evaluate online with A/B tests because offline NDCG frequently disagrees with engagement." },
    { q: "What is the cold start problem?",
      a: "A new user or item has no interaction history, so collaborative filtering has nothing to work with. For new items, use content features to place them near similar existing items. For new users, use popularity, onboarding preference questions, or demographic priors, and use exploration strategies like bandits to gather signal quickly rather than being purely greedy." }
  ],
  tags: ["recsys", "anomaly-detection", "cold-start"]
},
{
  d: 32, w: 5, phase: "Classical ML", track: "Stats",
  title: "A/B Testing & Experimentation Design",
  hook: "How you prove your model was actually worth deploying.",
  why: "Guaranteed in DS interviews and increasingly asked of ML engineers. It also completes your day-13 stats into something you can run.",
  learn: [
    { h: "Design before you run",
      p: "Fix the hypothesis, primary metric, minimum detectable effect, alpha, power, and duration in advance. Compute required sample size from those. Pre-registration is what makes the p-value at the end meaningful, and skipping it is why so many 'wins' fail to replicate." },
    { h: "Randomisation unit matters",
      p: "Randomise by user, not by session or pageview, or a single user will land in both arms and contaminate the comparison. If there is network interaction between users, like a marketplace or social feed, even user-level randomisation leaks and you need cluster or switchback designs." },
    { h: "Guardrails and novelty",
      p: "Always track guardrail metrics you must not harm: latency, error rate, revenue, churn. And beware novelty effects — a shiny new UI lifts engagement for a week and then decays, so run long enough to see the steady state." },
    { h: "Variance reduction gets you results faster",
      p: "CUPED uses pre-experiment data on the same metric as a covariate to strip out predictable variation, often cutting the required sample size by 30-50%. Stratification and covariate adjustment do similar work. Mentioning CUPED signals real exposure to experimentation." }
  ],
  cheat: {
    title: "A/B Testing Card",
    pts: [
      "pre-register: metric, MDE, alpha, power, N",
      "randomise by USER not session",
      "duration >= 1 full week (seasonality)",
      "guardrails: latency, errors, revenue, churn",
      "peeking inflates FPR -> fix N or sequential",
      "novelty effect decays; run long enough",
      "SRM check: is the split actually 50/50?",
      "CUPED: covariate adjust, -30-50% sample"
    ],
    eq: ["n_per_arm = 16 * sigma^2 / MDE^2   (alpha=.05, power=.80)"],
    warn: "Sample Ratio Mismatch (observed split != intended split) invalidates the whole test — it means assignment is broken. Check it FIRST, before reading any result."
  },
  vids: [
    { t: "A/B testing full course data science", ch: "Data Science Dojo" },
    { t: "CUPED variance reduction explained", ch: "Statsig" }
  ],
  lab: {
    t: "Run and analyse a simulated experiment",
    steps: [
      "Extend your day-13 calculator to output required N given baseline, MDE, alpha, power",
      "Simulate an experiment with a known 3% true lift; analyse it correctly and report the CI",
      "Implement an SRM chi-square check and demonstrate it catching a broken 55/45 split",
      "Implement CUPED using a simulated pre-period metric; measure the variance reduction you achieve"
    ],
    out: "src/experiment.py — a complete experimentation toolkit."
  },
  qs: [
    { q: "How would you design an A/B test for a new recommendation model?",
      a: "Define the primary metric tied to the decision, say click-through or conversion per user, plus guardrails on latency and revenue. Randomise at the user level, verify no network effects, and compute sample size from the baseline rate and the minimum lift that would justify shipping. Run at least a full week for seasonality, check SRM before analysing, and avoid peeking by fixing the duration or using a sequential method. At the end, report effect size with a confidence interval, not just a p-value." },
    { q: "Your A/B test is not significant. What do you do?",
      a: "First check the test was valid: SRM, instrumentation, and whether the run was long enough. Then ask whether it was adequately powered — a null result with a confidence interval spanning plus or minus 10% tells us nothing, whereas one spanning plus or minus 0.5% is genuine evidence of no meaningful effect. I would look at segment-level results as hypothesis generation only, never as a post-hoc claim, and consider variance reduction or a longer run before iterating on the change itself." }
  ],
  tags: ["ab-testing", "experimentation", "interview"]
},
{
  d: 33, w: 5, phase: "Classical ML", track: "ML",
  title: "Time Series Fundamentals",
  hook: "The domain where every rule you learned so far changes.",
  why: "Forecasting shows up in retail, finance, ops, and infrastructure roles. And time-series validation errors are the most common way candidates accidentally leak the future.",
  learn: [
    { h: "Decomposition: trend, seasonality, residual",
      p: "Almost every series is a combination of a long-run trend, repeating seasonal cycles (daily, weekly, yearly), and noise. Decompose first — it tells you what your model actually has to learn and often reveals data problems like a sensor outage or a reporting change." },
    { h: "Stationarity",
      p: "Classical models like ARIMA assume the statistical properties do not change over time. Differencing removes trend, seasonal differencing removes seasonality, and log transforms stabilise variance. Test with ADF or KPSS. Modern ML approaches care less, but the concept still explains why raw series mislead." },
    { h: "Validation must respect time",
      p: "Never shuffle. Use expanding or rolling window backtests where you always train on the past and validate on the future. And when building lag or rolling features, guarantee that every feature at time t uses only data available strictly before t. Getting this wrong produces spectacular fake accuracy." },
    { h: "Turning forecasting into supervised ML",
      p: "The practical modern approach: build lag features (t-1, t-7, t-28), rolling statistics, and calendar features, then throw LightGBM at it. This beats ARIMA on most business problems with multiple related series, and it is what you should describe in an interview." }
  ],
  cheat: {
    title: "Time Series Card",
    pts: [
      "decompose: trend + seasonal + residual",
      "stationary = stats constant over time",
      "diff to remove trend, seas-diff for season",
      "ADF test: p<0.05 -> stationary",
      "NEVER shuffle. expanding/rolling backtest.",
      "features: lags, rolling mean/std, calendar",
      "GBDT on lag features > ARIMA (usually)",
      "metrics: MAE, RMSE, MAPE (beware zeros), sMAPE"
    ],
    eq: ["y_t features: y_{t-1}, y_{t-7}, roll_mean_28(y_{<t}), dow, month"],
    warn: "A rolling mean computed with pandas .rolling() includes the CURRENT row by default. Shift by 1 or you have leaked the answer into the feature."
  },
  vids: [
    { t: "Time series analysis full course python", ch: "freeCodeCamp" },
    { t: "Time series forecasting with machine learning", ch: "Rob Mulla" }
  ],
  lab: {
    t: "Forecast with correct backtesting",
    steps: [
      "Take a daily series (store sales, energy demand, web traffic)",
      "Decompose and plot; note trend and seasonality visually",
      "Baseline 1: naive (last value). Baseline 2: seasonal naive (value 7 days ago). Record MAE.",
      "Build lag + rolling + calendar features (all shifted correctly) and fit LightGBM",
      "Backtest with TimeSeriesSplit; plot predictions vs actuals on the final fold"
    ],
    out: "A forecast that beats seasonal naive — a harder bar than it sounds."
  },
  qs: [
    { q: "How do you validate a time-series model?",
      a: "With forward-chaining backtests: train on data up to time t and validate on t+1 onwards, rolling that window forward to get multiple honest estimates. Never random k-fold, because that trains on the future and predicts the past. I also verify every engineered feature is computed with a strict shift so no future information enters, and I always compare against a seasonal-naive baseline." },
    { q: "What is stationarity and why does it matter?",
      a: "A series is stationary when its mean, variance, and autocorrelation structure do not change over time. Classical models like ARIMA assume it because their parameters are constant, so a trending series would produce systematically biased forecasts. You achieve it by differencing for trend, seasonal differencing for cycles, and log transforms for variance, and you test it with ADF or KPSS." }
  ],
  tags: ["time-series", "forecasting", "backtesting"]
},
{
  d: 34, w: 5, phase: "Classical ML", track: "ML",
  title: "Model Explainability — SHAP, LIME, Permutation",
  hook: "'Why did the model reject my loan?' is a question you will be asked in production.",
  why: "Explainability is legally required in finance, healthcare, and hiring, and it is a genuine differentiator in interviews because most candidates only know feature_importances_.",
  learn: [
    { h: "Global vs local explanations",
      p: "Global answers 'what does this model rely on overall' — permutation importance, mean absolute SHAP. Local answers 'why THIS prediction' — SHAP force plots, LIME. Different questions, different tools; conflating them is a common mistake." },
    { h: "Permutation importance",
      p: "Shuffle one feature's column and measure how much performance drops. Model-agnostic, computed on validation data so it reflects generalisation, and free of the cardinality bias that corrupts tree impurity importance. The caveat: correlated features share credit, so a duplicated feature will show near-zero importance for both." },
    { h: "SHAP",
      p: "Based on Shapley values from cooperative game theory: the average marginal contribution of a feature across all possible orderings. It has strong theoretical guarantees — contributions sum exactly to the prediction minus the base value, which makes it genuinely additive and auditable. TreeSHAP computes it exactly and fast for tree ensembles." },
    { h: "Explanation is not causation",
      p: "SHAP tells you what the model used, not what causes the outcome. If your model relies on a proxy for a protected attribute, SHAP will faithfully report that reliance — which is exactly why it is useful for fairness auditing. Never present SHAP as causal evidence." }
  ],
  cheat: {
    title: "Explainability Card",
    pts: [
      "global: perm importance, mean |SHAP|",
      "local: SHAP force, LIME",
      "perm imp = shuffle col, measure drop",
      "compute perm imp on VALIDATION not train",
      "SHAP sums exactly to pred - base value",
      "TreeSHAP = exact + fast for GBDT",
      "correlated feats SPLIT credit (both look low)",
      "explains the MODEL, not the world"
    ],
    eq: ["f(x) = base_value + sum_i shap_i(x)"],
    warn: "Impurity-based feature_importances_ is biased toward high-cardinality and continuous features. Never present it as the headline. Use permutation or SHAP."
  },
  vids: [
    { t: "SHAP values explained machine learning", ch: "Data Professor" },
    { t: "Explainable AI SHAP LIME", ch: "Krish Naik" }
  ],
  lab: {
    t: "Explain your Project 1 model",
    steps: [
      "Compute impurity importance, permutation importance, and mean |SHAP| for the same model",
      "Compare the three rankings and write about where and why they disagree",
      "Produce a SHAP summary plot and a dependence plot for the top feature",
      "Pick 3 individual predictions (one confident correct, one confident wrong, one borderline) and explain each locally",
      "Deliberately duplicate a feature and show how it splits importance"
    ],
    out: "An explainability section added to Project 1 — most portfolios lack this entirely."
  },
  qs: [
    { q: "A customer asks why your model denied their loan. How do you answer?",
      a: "Use a local explanation — SHAP values for that specific prediction — which decomposes the score into per-feature contributions that sum exactly to the outcome, so I can name the top three factors that pushed it down. I would present them in plain language with actionable direction where possible. I would also be careful to say these are the factors the model used, not proven causes, and I would ensure no protected attribute or close proxy is among them." },
    { q: "Why not just use feature_importances_ from your tree model?",
      a: "Impurity-based importance is computed on training data and is systematically biased toward high-cardinality and continuous features, because they offer more possible split points. It also cannot tell you the direction of an effect. Permutation importance on a validation set measures actual predictive contribution and is model-agnostic; SHAP additionally gives direction and per-prediction attribution." }
  ],
  tags: ["explainability", "shap", "interpretability"]
},
{
  d: 35, w: 5, phase: "Classical ML", track: "Review",
  title: "Week 5 Consolidation — Behavioural Stories v1",
  hook: "Technical skill gets you the interview. Stories get you the offer.",
  why: "Every co-op interview has a behavioural round, and unprepared candidates ramble. You now have five weeks of real material to build stories from — capture it while it is fresh.",
  learn: [
    { h: "STAR, with emphasis on R",
      p: "Situation and Task get 20% of your airtime; Action gets 50%; Result gets 30% and must be quantified. Most candidates spend 80% on context and run out of time before the result. Practise the compression explicitly." },
    { h: "Six stories cover almost everything",
      p: "Prepare: a technical challenge you overcame, a time you failed, a conflict or disagreement, a time you learned something fast, a time you took initiative, and a project you are proud of. Nearly every behavioural question maps onto one of these six with light reframing." },
    { h: "Your 90-day sprint is itself a story",
      p: "'I identified that I lacked ML depth for the roles I wanted, designed a structured 90-day curriculum, shipped six projects, and tracked my progress publicly.' That demonstrates initiative, self-direction, and follow-through — which is exactly what co-op managers screen for." }
  ],
  cheat: {
    title: "Behavioural Card",
    pts: [
      "S+T 20% | A 50% | R 30% (QUANTIFIED)",
      "6 stories: challenge, failure, conflict,",
      "  fast learning, initiative, proud project",
      "always name YOUR contribution ('I', not 'we')",
      "failure story needs a real lesson, not a humblebrag",
      "90 sec target. Time yourself out loud.",
      "end with what you'd do differently"
    ],
    eq: ["'Reduced X by N% by doing Y' > 'worked on Y'"],
    warn: "Never say 'I have no weaknesses' or pick a fake one. Name a real gap plus concrete evidence you are closing it — this 90-day plan IS that evidence."
  },
  vids: [
    { t: "STAR method interview answers examples", ch: "Jeff Su" },
    { t: "Behavioral interview questions software engineer", ch: "Exponent" }
  ],
  lab: {
    t: "Write and record 6 stories",
    steps: [
      "Draft all six STAR stories in notes/behavioural.md, with quantified results",
      "Record yourself telling each one. Watch it back. It will be uncomfortable and it works.",
      "Cut every story to under 90 seconds",
      "Then: Project 2 — take your day-29 segmentation or day-32 experiment analysis and polish it into a portfolio piece",
      "Update resume v2 with Projects 1 and 2"
    ],
    out: "notes/behavioural.md + Project 2 shipped + resume v2."
  },
  qs: [
    { q: "Tell me about a time you failed.",
      a: "Pick a real, bounded technical failure with a clear lesson: for example, reporting a strong cross-validation score that collapsed on held-out data because a feature had leaked. Explain how you diagnosed it, what you changed structurally — moving all transformations inside a Pipeline — and what habit it created. The lesson and the systemic fix matter more than the failure itself." },
    { q: "Why are you interested in this role?",
      a: "Connect three things concretely: something specific about what the team builds, a project of yours that touches the same problem space, and what you want to learn there. Generic enthusiasm reads as mass-applying. Naming their actual product or a paper the team published is what separates you." }
  ],
  tags: ["behavioural", "interview", "portfolio"]
},

/* ---------- WEEK 6 : PyTorch & Neural Nets ---------- */
{
  d: 36, w: 6, phase: "Deep Learning", track: "DL",
  title: "PyTorch — Tensors & Autograd",
  hook: "NumPy, plus a GPU, plus automatic derivatives.",
  why: "PyTorch is the industry and research default. Fluency here is assumed for any AI/ML co-op, and understanding autograd is what stops you from being confused by every training bug for the next month.",
  learn: [
    { h: "Tensors are NumPy arrays that remember",
      p: "Same shapes, same broadcasting, same indexing as day 2. The additions are: they can live on a GPU (.to('cuda') or 'mps' on your Mac), and if requires_grad=True they record every operation applied to them into a graph." },
    { h: "Autograd builds the graph as you go",
      p: "PyTorch is define-by-run: the computation graph is constructed dynamically during the forward pass. Calling .backward() on a scalar walks that graph in reverse, applying the chain rule from day 10, and accumulates results into each leaf tensor's .grad attribute." },
    { h: "Gradients accumulate — this bites everyone",
      p: "PyTorch adds to .grad rather than replacing it, which is useful for gradient accumulation across micro-batches but means you MUST call optimizer.zero_grad() every iteration. Forgetting it silently sums gradients across steps and training degrades mysteriously." },
    { h: "Detaching and no_grad",
      p: "Use torch.no_grad() during evaluation and inference to skip graph construction, which saves substantial memory and time. Use .detach() to cut a tensor out of the graph. Calling .item() on a scalar gets the Python number without holding a reference to the whole graph — a common source of memory leaks in logging loops." }
  ],
  cheat: {
    title: "PyTorch Basics Card",
    pts: [
      "x = torch.tensor(..., requires_grad=True)",
      "loss.backward() -> fills .grad on leaves",
      "GRADIENTS ACCUMULATE -> zero_grad() always",
      "with torch.no_grad(): for eval/inference",
      ".detach() cuts from graph, .item() -> float",
      "device: 'cuda' | 'mps' (mac) | 'cpu'",
      "model.train() vs model.eval() (dropout/BN!)",
      "x.shape constantly. print it. every time."
    ],
    eq: ["zero_grad() -> forward -> loss -> backward() -> step()"],
    warn: "model.eval() does NOT disable gradients, and torch.no_grad() does NOT disable dropout. They are separate concerns and you need both at inference."
  },
  vids: [
    { t: "PyTorch tutorial for beginners full course", ch: "Patrick Loeber" },
    { t: "The spelled-out intro to neural networks and backpropagation micrograd", ch: "Andrej Karpathy" }
  ],
  lab: {
    t: "Build micrograd (seriously, do this one)",
    steps: [
      "Follow Karpathy's micrograd video and implement a scalar autograd engine yourself",
      "Support +, *, tanh, and backward() with topological ordering",
      "Verify your gradients against PyTorch on the same expression",
      "Then redo day 11's gradient descent using PyTorch autograd instead of hand-derived gradients"
    ],
    out: "You now understand autograd from the inside. Very few candidates do."
  },
  qs: [
    { q: "What does loss.backward() actually do?",
      a: "It performs reverse-mode automatic differentiation over the dynamic graph built during the forward pass. Starting from the scalar loss with an implicit gradient of 1, it traverses the graph in reverse topological order, applying each operation's local derivative via the chain rule, and accumulates the result into the .grad attribute of every leaf tensor with requires_grad=True." },
    { q: "Why do you need optimizer.zero_grad()?",
      a: "PyTorch accumulates gradients into .grad rather than overwriting them, which enables gradient accumulation across micro-batches to simulate a larger batch size. But in a normal loop that means each step would use the sum of all previous gradients, so you must clear them before each backward pass." }
  ],
  tags: ["pytorch", "autograd", "tensors"]
},
{
  d: 37, w: 6, phase: "Deep Learning", track: "DL",
  title: "Your First Neural Network + The Training Loop",
  hook: "Memorise this loop. You will write it a thousand times.",
  why: "The training loop is the atom of deep learning. Being able to write it from memory, and knowing what each line guards against, is table stakes in a PyTorch interview.",
  learn: [
    { h: "nn.Module is the unit of composition",
      p: "Subclass it, define layers in __init__, define the forward pass in forward(). PyTorch automatically registers parameters, so .parameters() collects everything for the optimiser and .to(device) moves it all. Modules nest arbitrarily — a Transformer is just modules inside modules." },
    { h: "Dataset and DataLoader",
      p: "Dataset defines __len__ and __getitem__ for a single example. DataLoader handles batching, shuffling, parallel worker processes, and pinned memory. Shuffle the training loader and never the validation loader. This separation is what lets you swap datasets without touching the training code." },
    { h: "The five-line loop",
      p: "zero_grad, forward, loss, backward, step. Everything else — logging, scheduling, mixed precision, gradient clipping — decorates those five lines. Write it from memory today and it stops being a source of anxiety." },
    { h: "Always validate every epoch",
      p: "Wrap validation in model.eval() and torch.no_grad(). Track both train and validation loss and plot them. That single plot diagnoses overfitting, underfitting, a bad learning rate, and a broken data pipeline — it is your primary instrument." }
  ],
  cheat: {
    title: "THE Training Loop",
    pts: [
      "for epoch: model.train()",
      "  for xb,yb in loader:",
      "    opt.zero_grad()",
      "    out = model(xb)",
      "    loss = crit(out, yb)",
      "    loss.backward()",
      "    opt.step()",
      "  model.eval(); with torch.no_grad(): validate",
      "  track train+val loss EVERY epoch"
    ],
    eq: ["zero_grad -> forward -> loss -> backward -> step"],
    warn: "Overfit a single batch of 8 samples to ~zero loss BEFORE training for real. If you cannot, your model, loss, or data pipeline is broken. This test takes 30 seconds and saves hours."
  },
  vids: [
    { t: "PyTorch training loop explained", ch: "Aladdin Persson" },
    { t: "Building a neural network from scratch pytorch", ch: "Patrick Loeber" }
  ],
  lab: {
    t: "MLP on FashionMNIST, written from memory",
    steps: [
      "Write the whole thing without looking anything up. Then check and fix.",
      "Custom Dataset, DataLoader, nn.Module with 2 hidden layers, CrossEntropyLoss, Adam",
      "Run the single-batch overfit sanity check first and confirm loss goes near zero",
      "Train, plot train/val curves, report test accuracy",
      "Deliberately break something (wrong loss, no zero_grad, lr=100) and observe each failure mode"
    ],
    out: "A training loop you can write blindfolded + a catalogue of failure signatures."
  },
  qs: [
    { q: "Write a PyTorch training loop.",
      a: "Set model.train(); for each batch: optimizer.zero_grad(), forward pass to get outputs, compute loss, loss.backward(), optimizer.step(). After each epoch switch to model.eval() and wrap validation in torch.no_grad(). Mention that model.train()/eval() toggles dropout and batchnorm behaviour, and that zero_grad is required because gradients accumulate." },
    { q: "Your loss is not decreasing at all. How do you debug?",
      a: "First, try to overfit a single small batch — if that fails, the bug is in the model, loss, or data, not in optimisation. Check that the learning rate is sane, that labels align with inputs, that the loss function matches the output format (for example CrossEntropyLoss expects raw logits, not softmax outputs), that zero_grad is being called, and that gradients are actually non-zero by inspecting .grad norms. Then check data normalisation." }
  ],
  tags: ["pytorch", "training-loop", "debugging"]
},
{
  d: 38, w: 6, phase: "Deep Learning", track: "DL",
  title: "Activations, Initialisation & Why Depth Works",
  hook: "Without nonlinearity, a hundred layers collapse into one.",
  why: "'Why do we need activation functions?' is asked in nearly every deep learning interview, and the initialisation discussion shows whether you understand training stability.",
  learn: [
    { h: "Nonlinearity is what makes depth meaningful",
      p: "A composition of linear maps is itself a linear map, so stacking linear layers without activations gives you exactly the expressive power of one linear layer. The activation is what lets networks carve up space nonlinearly, and the universal approximation theorem says a sufficiently wide single hidden layer can approximate any continuous function." },
    { h: "The activation zoo",
      p: "ReLU: cheap, no vanishing gradient for positive inputs, but dead units when inputs go permanently negative. LeakyReLU and ELU fix dying ReLU with a small negative slope. GELU is the default in transformers, smooth and probabilistically motivated. Sigmoid and tanh belong at outputs, not in deep hidden layers." },
    { h: "Initialisation controls variance flow",
      p: "If initial weights are too large, activations explode through the layers; too small and they vanish. Xavier/Glorot keeps variance stable for tanh-like activations; He initialisation accounts for ReLU zeroing half the inputs and scales by 2/fan_in. Modern frameworks default sensibly, but knowing why matters." },
    { h: "Depth vs width",
      p: "Depth buys hierarchical composition — early layers learn simple features that later layers combine — and is exponentially more parameter-efficient than width for many function classes. But depth brings optimisation difficulty, which is exactly what residual connections and normalisation exist to solve." }
  ],
  cheat: {
    title: "Activation & Init Card",
    pts: [
      "no activation -> stacked linear = 1 linear",
      "ReLU: max(0,x), fast, dying-unit risk",
      "LeakyReLU/ELU: fix dying ReLU",
      "GELU: transformer default, smooth",
      "sigmoid/tanh: outputs only, saturate",
      "He init for ReLU: var = 2/fan_in",
      "Xavier for tanh: var = 1/fan_in",
      "output layer: NO activation for logits"
    ],
    eq: ["He: W ~ N(0, sqrt(2/fan_in))    Xavier: W ~ N(0, sqrt(1/fan_in))"],
    warn: "Do not apply softmax before nn.CrossEntropyLoss — it applies log_softmax internally. Doing both gives wrong gradients and quietly bad training."
  },
  vids: [
    { t: "Activation functions in neural networks explained", ch: "StatQuest" },
    { t: "Weight initialization in neural networks", ch: "DeepLearningAI" }
  ],
  lab: {
    t: "Watch signals die and explode",
    steps: [
      "Build a 20-layer MLP; plot activation variance per layer at init with zeros, small-random, Xavier, and He init",
      "Train the same net with sigmoid vs ReLU vs GELU; compare loss curves",
      "Count dead ReLU units after training and try LeakyReLU as a fix",
      "Add residual connections and show that the 20-layer net now trains where it previously did not"
    ],
    out: "Visual proof of why initialisation and activation choice matter."
  },
  qs: [
    { q: "Why do neural networks need activation functions?",
      a: "Because a composition of linear transformations is itself linear, so without a nonlinearity a deep stack has exactly the expressive power of a single linear layer and can only learn linear decision boundaries. Nonlinear activations let the network approximate arbitrary continuous functions and build hierarchical features." },
    { q: "What is the dying ReLU problem?",
      a: "If a unit's pre-activation becomes negative for all inputs — often after a large gradient update — ReLU outputs zero and its derivative is zero, so no gradient flows and the unit never recovers. Fixes: LeakyReLU or ELU which have non-zero negative slope, lower learning rates, and He initialisation which keeps activations properly scaled from the start." }
  ],
  tags: ["activations", "initialisation", "depth"]
},
{
  d: 39, w: 6, phase: "Deep Learning", track: "DL",
  title: "Loss Functions, Softmax & Numerical Stability",
  hook: "Choosing the loss is choosing what the model cares about.",
  why: "Mismatched loss and output format is one of the most common bugs in real code, and the log-sum-exp stability trick is a genuinely impressive thing to know in an interview.",
  learn: [
    { h: "Match the loss to the task",
      p: "Regression: MSE for normally distributed errors, MAE or Huber when outliers matter. Binary classification: BCEWithLogitsLoss. Multi-class single label: CrossEntropyLoss on raw logits. Multi-label: BCEWithLogitsLoss with a sigmoid per class. Ranking and retrieval: contrastive or triplet losses." },
    { h: "Softmax turns logits into a distribution",
      p: "exp of each logit divided by the sum of exps. It is shift-invariant — adding a constant to every logit changes nothing — which is exactly the property used for numerical stability: subtract the max logit before exponentiating so you never compute exp of a large positive number and overflow to infinity." },
    { h: "Cross-entropy punishes confident errors",
      p: "-log(p_true). If the model assigns 0.99 to the right class the loss is ~0.01; if it assigns 0.01 the loss is ~4.6. That asymmetry is deliberate: it forces the model to be calibrated rather than recklessly confident, and it is why the gradient stays strong for confident mistakes." },
    { h: "Class weighting and label smoothing",
      p: "Pass class weights to handle imbalance in the loss itself, which is cleaner than resampling. Label smoothing replaces hard 1.0 targets with 0.9 spread over classes, which reduces overconfidence, improves calibration, and typically gives a small accuracy gain — standard practice in modern vision and language training." }
  ],
  cheat: {
    title: "Loss Function Card",
    pts: [
      "regression: MSE | outliers -> MAE/Huber",
      "binary: BCEWithLogitsLoss (raw logits!)",
      "multi-class: CrossEntropyLoss (raw logits!)",
      "multi-LABEL: BCEWithLogits, sigmoid per class",
      "softmax(z) = e^z / sum e^z",
      "STABILITY: subtract max(z) first",
      "CE = -log(p_true)",
      "label smoothing 0.1 -> better calibration"
    ],
    eq: ["logsumexp(z) = m + log(sum(exp(z - m))),  m = max(z)"],
    warn: "nn.CrossEntropyLoss expects RAW LOGITS and applies log_softmax itself. Passing softmax output is a silent bug that degrades training without erroring."
  },
  vids: [
    { t: "Cross entropy loss and softmax explained", ch: "Aurelien Geron" },
    { t: "Loss functions explained deep learning", ch: "Patrick Loeber" }
  ],
  lab: {
    t: "Break and fix numerical stability",
    steps: [
      "Implement naive softmax; feed it logits like [1000, 1001] and watch it produce NaN",
      "Implement the max-subtraction version; confirm it works",
      "Implement cross-entropy from scratch and match nn.CrossEntropyLoss",
      "Train the same classifier with and without label smoothing; compare accuracy AND a calibration curve"
    ],
    out: "src/losses.py + a demonstrated understanding of numerical stability."
  },
  qs: [
    { q: "Why subtract the max before softmax?",
      a: "Softmax is invariant to adding a constant to all logits, since the constant factors out of numerator and denominator. Exponentiating large logits overflows to infinity in floating point, producing NaN. Subtracting the maximum makes the largest exponent exactly zero, so all terms are in (0,1] — mathematically identical, numerically safe. The same idea underlies log-sum-exp." },
    { q: "MSE vs cross-entropy for classification?",
      a: "Cross-entropy is the correct choice because it is the negative log-likelihood of the categorical distribution the model is parameterising, it is convex when paired with a linear model plus softmax, and its gradient reduces to (p - y), which stays large exactly when the model is confidently wrong. MSE with a sigmoid or softmax has a vanishing gradient factor in that regime, so learning stalls precisely when it should be fastest." }
  ],
  tags: ["loss-functions", "softmax", "stability"]
},
{
  d: 40, w: 6, phase: "Deep Learning", track: "DL",
  title: "Regularisation for Deep Learning",
  hook: "Big models memorise. These are your defences.",
  why: "Every deep learning interview asks about dropout. Knowing why dropout behaves differently at train and test time separates people who used it from people who understand it.",
  learn: [
    { h: "Dropout",
      p: "During training, randomly zero each unit with probability p, which prevents co-adaptation and approximates training an ensemble of exponentially many subnetworks. At test time all units are active, so activations are scaled — PyTorch does inverted dropout, scaling by 1/(1-p) during training so inference needs no adjustment. This is why model.eval() matters so much." },
    { h: "Weight decay",
      p: "L2 penalty on weights, exactly day 17's ridge applied to neural networks. In PyTorch, note that Adam's weight_decay parameter is not true L2 for adaptive methods; AdamW implements decoupled weight decay and is the correct default for transformers." },
    { h: "Early stopping",
      p: "Monitor validation loss, stop when it stops improving for a set patience, and restore the best checkpoint. It is free, effective, and it is also implicitly a form of regularisation because it limits how far parameters travel from initialisation." },
    { h: "Data augmentation is the strongest regulariser",
      p: "More effective than any of the above when applicable, because it adds genuine information about invariances: an image of a cat rotated 10 degrees is still a cat. Augment the training set only, never validation or test." }
  ],
  cheat: {
    title: "DL Regularisation Card",
    pts: [
      "dropout p=0.1-0.5, TRAIN only",
      "PyTorch scales by 1/(1-p) at train (inverted)",
      "model.eval() disables dropout. Do not forget.",
      "weight decay = L2 = ridge for nets",
      "use AdamW not Adam+weight_decay",
      "early stopping + restore best checkpoint",
      "augmentation = best regulariser (train only)",
      "more data > all of the above"
    ],
    eq: ["train: h = mask * h / (1-p)   |   eval: h = h"],
    warn: "Dropout before a batchnorm layer causes a train/test variance mismatch. Modern architectures generally place dropout after normalisation, or skip dropout entirely in convolutional layers."
  },
  vids: [
    { t: "Dropout regularization explained", ch: "DeepLearningAI" },
    { t: "Regularization in deep learning", ch: "Andrej Karpathy" }
  ],
  lab: {
    t: "Regularisation ablation",
    steps: [
      "Deliberately overfit a small dataset with a large MLP; confirm a huge train/val gap",
      "Add each regulariser one at a time (dropout, weight decay, early stopping, augmentation) and record the val score",
      "Build a table: technique, val accuracy, training-time cost",
      "Sweep dropout p from 0 to 0.7 and find where it starts underfitting"
    ],
    out: "An ablation table — exactly the kind of rigour interviewers look for."
  },
  qs: [
    { q: "How does dropout work and why does it help?",
      a: "During training each unit is zeroed independently with probability p, so the network cannot rely on any specific co-adapted set of units and must learn redundant, robust features. It approximates averaging an exponential ensemble of subnetworks. At inference all units are used; PyTorch uses inverted dropout, scaling activations by 1/(1-p) during training so expected activations match at test time." },
    { q: "Adam vs AdamW?",
      a: "In Adam, the weight_decay term is added to the gradient, so it gets divided by the adaptive per-parameter scaling — meaning parameters with large gradient history get effectively less regularisation, which is not what L2 is supposed to do. AdamW decouples it, applying the decay directly to the weights after the adaptive step. It generalises better and is the standard for training transformers." }
  ],
  tags: ["dropout", "weight-decay", "regularisation"]
},
{
  d: 41, w: 6, phase: "Deep Learning", track: "DL",
  title: "Normalisation & Learning Rate Schedules",
  hook: "The two tricks that made deep networks actually trainable.",
  why: "BatchNorm vs LayerNorm is a very common interview question, especially once you mention transformers — knowing why transformers use LayerNorm is a real differentiator.",
  learn: [
    { h: "BatchNorm normalises across the batch",
      p: "For each feature, subtract the batch mean and divide by the batch standard deviation, then apply learnable scale and shift. It stabilises the distribution of layer inputs, allows higher learning rates, and adds slight regularising noise. It keeps running statistics for inference, which is another reason model.eval() matters." },
    { h: "LayerNorm normalises across features",
      p: "It normalises each individual example over its own feature dimension, so it is independent of batch size and of other examples. That independence is why transformers and any variable-length sequence model use it: batch statistics are meaningless when sequences have different lengths, and it works identically at batch size 1 during autoregressive generation." },
    { h: "Residual connections",
      p: "y = x + F(x). Gradients get an unimpeded identity path back through the network, so very deep stacks remain trainable. Combined with normalisation, this is what unlocked networks with hundreds of layers, and it is the structural backbone of every transformer block." },
    { h: "Learning rate schedules",
      p: "Warmup ramps the learning rate up over the first few hundred steps to avoid destabilising early updates — essential for transformers. Cosine annealing then decays smoothly to near zero. Step decay and ReduceLROnPlateau are simpler alternatives. Warmup plus cosine decay is the modern default." }
  ],
  cheat: {
    title: "Norm & Schedule Card",
    pts: [
      "BatchNorm: across BATCH, per feature",
      "  -> needs decent batch size, running stats",
      "LayerNorm: across FEATURES, per example",
      "  -> batch-size independent -> transformers",
      "residual: y = x + F(x), gradient highway",
      "warmup: ramp lr up first ~1-5% of steps",
      "cosine decay after warmup = modern default",
      "small batch (<8)? use LayerNorm/GroupNorm"
    ],
    eq: ["BN: (x - mu_batch)/sigma_batch * gamma + beta"],
    warn: "BatchNorm at batch size 1 or 2 gives garbage statistics and training collapses. If memory forces tiny batches, use GroupNorm or LayerNorm instead."
  },
  vids: [
    { t: "Batch normalization explained", ch: "DeepLearningAI" },
    { t: "Layer normalization vs batch normalization", ch: "AI Coffee Break" }
  ],
  lab: {
    t: "Normalisation and schedule comparison",
    steps: [
      "Train the same net with no norm, BatchNorm, and LayerNorm; compare convergence speed and final accuracy",
      "Show BatchNorm failing at batch size 2 and LayerNorm surviving",
      "Implement warmup + cosine schedule manually; plot the lr curve",
      "Compare constant lr vs step decay vs warmup+cosine on the same model"
    ],
    out: "Empirical evidence for every scheduling decision you will make later."
  },
  qs: [
    { q: "BatchNorm vs LayerNorm — when do you use each?",
      a: "BatchNorm normalises each feature across the batch dimension, so it depends on batch composition and needs a reasonable batch size, and it maintains running statistics for inference. It works well in CNNs with fixed-size inputs. LayerNorm normalises each example across its own features, making it independent of batch size and of other examples — which is essential for variable-length sequences and for autoregressive generation at batch size 1. That is why transformers use LayerNorm." },
    { q: "Why do transformers need learning rate warmup?",
      a: "Early in training the adaptive moment estimates in Adam are based on very few samples and are therefore high-variance, so a full learning rate produces unstable, large updates that can push the model into a bad region it never recovers from. Warmup ramps the rate up gradually while those estimates stabilise. The effect is amplified in deep residual stacks with LayerNorm, where early large updates disrupt the residual signal." }
  ],
  tags: ["batchnorm", "layernorm", "schedules"]
},
{
  d: 42, w: 6, phase: "Deep Learning", track: "Review",
  title: "Week 6 Build — Neural Net vs GBDT Showdown",
  hook: "Know when NOT to use deep learning. That is seniority.",
  why: "Candidates who reach for neural networks on every problem look inexperienced. Being able to say 'on this tabular dataset, LightGBM beats an MLP and trains in a tenth the time' is exactly the judgement co-op managers want.",
  learn: [
    { h: "Deep learning wins on unstructured data",
      p: "Images, audio, text, and video have spatial or sequential structure that convolutions and attention exploit natively. On tabular data with heterogeneous, weakly-correlated columns, gradient-boosted trees remain state of the art and require far less tuning. This is a well-documented empirical result, not an opinion." },
    { h: "Cost is part of the decision",
      p: "Compare on accuracy, training time, inference latency, memory footprint, and maintenance burden. A 0.3% accuracy gain that costs a GPU and ten times the latency is usually the wrong trade in production. Presenting that reasoning is what separates engineers from tutorial-followers." }
  ],
  cheat: {
    title: "When To Use What",
    pts: [
      "tabular -> GBDT first. always. seriously.",
      "images/audio/text -> deep learning",
      "small data (<10k rows) -> classical ML",
      "need interpretability -> linear / GBDT+SHAP",
      "need low latency -> smaller/simpler model",
      "compare: acc, train time, latency, memory",
      "0.3% gain for 10x latency = usually NO"
    ],
    eq: ["decision = accuracy gain vs (compute + latency + maintenance)"],
    warn: "'I used a neural network' is not an achievement. 'I used a neural network because X, having ruled out Y for reason Z' is."
  },
  vids: [
    { t: "Why tree based models still outperform deep learning on tabular data", ch: "Yannic Kilcher" }
  ],
  lab: {
    t: "Head-to-head on your own data",
    steps: [
      "Take your Project 1 dataset. Train a tuned MLP in PyTorch and a tuned LightGBM",
      "Build a comparison table: accuracy/AUC, training time, inference latency per 1000 rows, model size on disk, lines of code",
      "Write a one-paragraph recommendation as if to an engineering manager",
      "Then repeat the same comparison on an image dataset and observe the reversal"
    ],
    out: "A judgement-demonstrating artefact that most portfolios completely lack."
  },
  qs: [
    { q: "When would you NOT use deep learning?",
      a: "On tabular data, where gradient-boosted trees consistently match or beat neural networks with far less tuning and compute. On small datasets, where deep models overfit and classical methods with strong priors do better. When interpretability is a hard requirement, such as regulated lending. When inference latency or cost is tight. And when a simple heuristic or rules engine already solves the problem — the best model is often no model." }
  ],
  tags: ["review", "judgement", "gbdt-vs-nn"]
},

/* ---------- WEEK 7 : CNNs & Vision ---------- */
{
  d: 43, w: 7, phase: "Deep Learning", track: "DL",
  title: "Convolution — The Intuition",
  hook: "A small learned filter, slid across the whole image.",
  why: "'Why convolutions instead of a fully-connected layer for images?' is a guaranteed question, and the parameter-sharing answer demonstrates you understand the inductive bias.",
  learn: [
    { h: "Two priors baked into the architecture",
      p: "Locality: nearby pixels are related, so each unit only looks at a small patch. Translation equivariance: an edge is an edge wherever it appears, so the same filter is reused at every position. These two assumptions encode real facts about images and are why CNNs need far less data than an MLP would." },
    { h: "Parameter sharing is the huge win",
      p: "A fully-connected layer on a 224x224x3 image with 1000 hidden units needs 150 million weights. A 3x3 convolution with 64 output channels needs about 1,700. Same expressive family for image tasks, four orders of magnitude fewer parameters, and it generalises far better." },
    { h: "Channels, stride, padding",
      p: "Each filter produces one output channel — a feature map for one learned pattern. Stride controls how far the filter jumps and thus downsampling. Padding preserves spatial size; 'same' padding with a 3x3 kernel means padding of 1. Output size = floor((in + 2p - k)/s) + 1 — memorise this formula, it is asked directly." },
    { h: "Pooling and receptive field",
      p: "Max pooling downsamples and grants small translation invariance. Receptive field is how much of the original image one deep unit can see; it grows with depth, kernel size, and stride. Deep layers see globally and learn semantic concepts; shallow layers see locally and learn edges and textures." }
  ],
  cheat: {
    title: "Convolution Card",
    pts: [
      "out = floor((in + 2p - k)/s) + 1",
      "'same' pad for k=3 -> p=1",
      "params = k*k*C_in*C_out + C_out",
      "each filter -> one output channel",
      "priors: locality + translation equivariance",
      "param sharing = 1000x fewer weights",
      "pooling: downsample + small invariance",
      "receptive field grows with depth"
    ],
    eq: ["params(conv 3x3, 64->128) = 3*3*64*128 + 128 = 73,856"],
    warn: "Convolution is equivariant, not invariant: shift the input and the feature map shifts too. Pooling and global average pooling are what convert equivariance into invariance."
  },
  vids: [
    { t: "But what is a convolution", ch: "3Blue1Brown" },
    { t: "Convolutional neural networks explained", ch: "DeepLearningAI" }
  ],
  lab: {
    t: "Convolve by hand, then by PyTorch",
    steps: [
      "Implement 2-D convolution in pure NumPy; verify against torch.nn.functional.conv2d",
      "Apply hand-designed Sobel and blur kernels to an image and view the outputs",
      "Compute output shapes on paper for a chain of 5 layers, then verify with actual tensors",
      "Visualise the learned first-layer filters of a trained CNN — they will look like edge detectors"
    ],
    out: "Convolution as a concrete operation, not a black box."
  },
  qs: [
    { q: "Why convolutions instead of fully-connected layers for images?",
      a: "Three reasons. Parameter efficiency: a filter's weights are shared across all spatial positions, cutting parameters by orders of magnitude. Correct inductive bias: locality and translation equivariance are true properties of images, so the architecture encodes prior knowledge instead of having to learn it from data. And spatial structure preservation: flattening an image for an MLP destroys the 2-D relationships convolutions exploit." },
    { q: "Compute the output shape: input 32x32x3, conv 5x5, 16 filters, stride 1, padding 0.",
      a: "Spatial size = (32 - 5)/1 + 1 = 28, and the channel count becomes the number of filters, so the output is 28x28x16. Parameter count is 5*5*3*16 + 16 = 1,216 including biases." }
  ],
  tags: ["cnn", "convolution", "vision"]
},
{
  d: 44, w: 7, phase: "Deep Learning", track: "DL",
  title: "CNN Architectures — LeNet to ResNet",
  hook: "The architectural ideas that are still in everything you use.",
  why: "Knowing why ResNet's skip connection mattered — and that the same idea is inside every transformer — connects the whole field together in one answer.",
  learn: [
    { h: "The progression and what each added",
      p: "LeNet established conv-pool-FC. AlexNet added ReLU, dropout, and GPUs. VGG showed that stacking small 3x3 filters beats large ones (two 3x3s have the receptive field of one 5x5 with fewer parameters and more nonlinearity). Inception added parallel multi-scale branches. ResNet added skip connections and went to 152 layers." },
    { h: "Why ResNet was the breakthrough",
      p: "Before it, adding layers past ~20 made training error WORSE — not an overfitting problem, an optimisation problem. Skip connections let a block learn a residual F(x) with the identity available for free, so extra layers can at worst do nothing rather than actively harm. Gradients also flow directly backwards through the identity path." },
    { h: "Modern efficiency ideas",
      p: "Depthwise separable convolutions (MobileNet) factor a standard convolution into a per-channel spatial convolution plus a 1x1 mixing convolution, cutting cost by roughly 8-9x. 1x1 convolutions are cheap channel-mixing and dimensionality reduction. EfficientNet scales depth, width, and resolution together in a principled ratio." },
    { h: "Global average pooling replaced flatten",
      p: "Instead of flattening a large feature map into a huge dense layer, average each channel spatially into one number. Far fewer parameters, less overfitting, and it makes the network accept variable input sizes. Standard in every modern architecture." }
  ],
  cheat: {
    title: "CNN Architectures Card",
    pts: [
      "AlexNet: ReLU + dropout + GPU (2012)",
      "VGG: stack 3x3 (2x3x3 = 5x5 RF, cheaper)",
      "Inception: parallel multi-scale branches",
      "ResNet: y = x + F(x) -> 152 layers trainable",
      "  skip fixes DEGRADATION not just vanishing",
      "1x1 conv = channel mixing, cheap",
      "depthwise separable = ~9x cheaper (MobileNet)",
      "GlobalAvgPool replaces flatten+dense"
    ],
    eq: ["ResNet block: out = ReLU( x + conv(ReLU(conv(x))) )"],
    warn: "ResNet's problem was DEGRADATION — deeper nets had worse TRAINING error. That is not overfitting; it is an optimisation failure. Getting this distinction right impresses interviewers."
  },
  vids: [
    { t: "ResNet paper explained residual networks", ch: "Yannic Kilcher" },
    { t: "CNN architectures AlexNet VGG ResNet", ch: "Stanford CS231n" }
  ],
  lab: {
    t: "Build ResNet blocks yourself",
    steps: [
      "Implement a BasicBlock and a Bottleneck block in PyTorch from the paper description",
      "Assemble a small ResNet-18 and train it on CIFAR-10",
      "Train the identical depth without skip connections and compare TRAINING error — reproduce the degradation result",
      "Count parameters and measure inference latency for VGG-style vs ResNet-style at similar accuracy"
    ],
    out: "A ResNet you built, plus a reproduced research finding."
  },
  qs: [
    { q: "Why do residual connections help?",
      a: "They solve the degradation problem: before ResNet, adding layers beyond a point made training error worse, which is an optimisation failure rather than overfitting. A residual block learns F(x) and outputs x + F(x), so the identity mapping is available at zero cost and extra depth can never be worse than doing nothing. They also create a direct gradient path backwards, mitigating vanishing gradients. The same idea appears in every transformer block." },
    { q: "What does a 1x1 convolution do?",
      a: "It mixes information across channels at each spatial position without touching spatial extent. It is used for dimensionality reduction before expensive 3x3 convolutions — the bottleneck design in ResNet and Inception — for increasing channel depth cheaply, and to add nonlinearity. Mathematically it is a per-pixel fully-connected layer across channels." }
  ],
  tags: ["cnn", "resnet", "architectures"]
},
{
  d: 45, w: 7, phase: "Deep Learning", track: "DL",
  title: "Data Augmentation & Training Tricks",
  hook: "The cheapest accuracy you will ever buy.",
  why: "In practice, augmentation and good training hygiene beat architecture changes almost every time. Interviewers who have shipped models know this and probe for it.",
  learn: [
    { h: "Augmentation encodes invariances",
      p: "Each augmentation asserts a fact: a flipped cat is still a cat, a slightly brighter photo is the same scene. Choose them from the domain — horizontal flips are fine for natural images but wrong for digits or text, and vertical flips are wrong for street scenes but fine for satellite imagery. Wrong augmentation actively harms." },
    { h: "Modern augmentations",
      p: "RandAugment and TrivialAugment pick random operations automatically, removing the tuning burden. Mixup blends two images and their labels linearly; CutMix pastes a patch of one image into another with proportional label mixing. Both improve calibration and robustness beyond simple geometric transforms." },
    { h: "Mixed precision and gradient accumulation",
      p: "Mixed precision (torch.amp) runs most operations in fp16/bf16 with fp32 master weights, giving roughly 2x speed and half the memory on modern GPUs. Gradient accumulation sums gradients over several micro-batches before stepping, simulating a large batch on small hardware. Both are standard practice and worth naming." },
    { h: "Checkpointing and reproducibility",
      p: "Save model and optimiser state every epoch, track the best validation score, and be able to resume. Seed Python, NumPy, and torch, and log your config with every run. When an interviewer asks how you make experiments reproducible, this is the answer." }
  ],
  cheat: {
    title: "Training Tricks Card",
    pts: [
      "augment TRAIN only, never val/test",
      "pick augs from the DOMAIN (no vflip on digits)",
      "RandAugment / TrivialAugment = auto, strong",
      "mixup/cutmix: blend imgs AND labels",
      "AMP (torch.amp): ~2x speed, half memory",
      "grad accumulation = big batch on small GPU",
      "TTA: augment at test, average preds",
      "seed everything + log config per run"
    ],
    eq: ["mixup: x = l*x1 + (1-l)*x2 ; y = l*y1 + (1-l)*y2 ; l ~ Beta(a,a)"],
    warn: "Never augment the validation or test set (except deliberate TTA). Doing so makes your validation score measure a different distribution than production."
  },
  vids: [
    { t: "Data augmentation techniques deep learning", ch: "DigitalSreeni" },
    { t: "Mixed precision training explained", ch: "PyTorch" }
  ],
  lab: {
    t: "Augmentation ablation on CIFAR-10",
    steps: [
      "Baseline: no augmentation. Record test accuracy.",
      "Add flip+crop. Then RandAugment. Then mixup. Record each.",
      "Enable AMP and measure the speedup and memory reduction",
      "Implement test-time augmentation and measure the gain",
      "Deliberately add a WRONG augmentation (vertical flip) and show the accuracy drop"
    ],
    out: "An ablation table showing augmentation often beats architecture changes."
  },
  qs: [
    { q: "How do you improve a model that is overfitting on an image task?",
      a: "In order of cost-effectiveness: stronger data augmentation, since it adds real information about invariances; then more data if obtainable; then regularisation via weight decay and dropout; then transfer learning from a pretrained backbone, which is usually the biggest single win on small datasets; then reducing model capacity; and early stopping throughout. I would confirm the diagnosis from the train/validation gap first." },
    { q: "What is mixed precision training?",
      a: "Running most operations in 16-bit floating point while keeping a 32-bit master copy of the weights and using loss scaling to prevent gradient underflow. On tensor-core GPUs this roughly doubles throughput and halves activation memory with negligible accuracy impact, which also lets you use larger batches. In PyTorch it is torch.autocast plus GradScaler." }
  ],
  tags: ["augmentation", "amp", "training-tricks"]
},
{
  d: 46, w: 7, phase: "Deep Learning", track: "DL",
  title: "Transfer Learning & Fine-Tuning",
  hook: "Nobody trains from scratch. Learn to stand on giants.",
  why: "This is how deep learning actually gets used in industry, and it is the exact skill that carries forward into LLM fine-tuning in week 9.",
  learn: [
    { h: "Why it works",
      p: "Early layers learn generic features — edges, textures, colour blobs — that transfer across essentially all visual domains. Later layers learn task-specific semantics. So you keep the general feature extractor and retrain only the task-specific head, needing orders of magnitude less data." },
    { h: "Feature extraction vs fine-tuning",
      p: "Feature extraction freezes the backbone and trains only a new head: fast, works with a few hundred examples, safe against overfitting. Fine-tuning unfreezes some or all of the backbone with a small learning rate: needs more data but adapts better when your domain differs from the pretraining data." },
    { h: "Discriminative learning rates",
      p: "Use a much smaller learning rate for early layers (which need little change) and a larger one for the head. A common recipe is head at 1e-3 and backbone at 1e-5. Alternatively, train the head first with the backbone frozen, then unfreeze and fine-tune everything gently." },
    { h: "Catastrophic forgetting",
      p: "Fine-tuning aggressively on a small dataset destroys the pretrained representations, and you end up worse than feature extraction. Defences: low learning rates, gradual unfreezing, short schedules, and freezing normalisation-layer statistics. The same failure mode reappears with LLMs, which is exactly why LoRA exists." }
  ],
  cheat: {
    title: "Transfer Learning Card",
    pts: [
      "early layers = generic (edges/textures)",
      "late layers = task-specific semantics",
      "small data -> FREEZE backbone, train head",
      "more data / different domain -> fine-tune",
      "backbone lr ~ 1e-5, head lr ~ 1e-3",
      "recipe: head first, then unfreeze gently",
      "MATCH the pretraining preprocessing exactly",
      "too-high lr -> catastrophic forgetting"
    ],
    eq: ["stage 1: freeze + train head | stage 2: unfreeze + lr/100"],
    warn: "You must use the same normalisation statistics the model was pretrained with (ImageNet mean/std). Using your own dataset's statistics silently degrades everything."
  },
  vids: [
    { t: "Transfer learning explained pytorch", ch: "Aladdin Persson" },
    { t: "Fine tuning pretrained models", ch: "DeepLearningAI" }
  ],
  lab: {
    t: "Three-way transfer comparison",
    steps: [
      "Pick a small custom image dataset (200-500 images, 3-5 classes) — take your own photos if you like",
      "Train a small CNN from scratch. Record accuracy.",
      "Feature extraction with a frozen pretrained ResNet-18. Record.",
      "Full fine-tuning with discriminative learning rates. Record.",
      "Plot all three learning curves together and write up when each is appropriate"
    ],
    out: "A dramatic demonstration of transfer learning's value on small data."
  },
  qs: [
    { q: "When do you freeze the backbone vs fine-tune the whole model?",
      a: "Freeze when the dataset is small — a few hundred to a few thousand images — and the domain is close to the pretraining data, because fine-tuning would overfit and destroy good features. Fine-tune when you have more data or when the domain differs substantially, such as medical or satellite imagery versus ImageNet. A practical middle path is to train the head first with everything frozen, then unfreeze the later blocks with a much smaller learning rate." },
    { q: "What is catastrophic forgetting?",
      a: "When fine-tuning on a new task overwrites the representations learned during pretraining, so the model loses the general capability that made transfer valuable in the first place. It happens with high learning rates, long schedules, or small target datasets. Mitigations include low learning rates, gradual unfreezing, early stopping, and parameter-efficient methods like adapters or LoRA that leave the original weights untouched entirely." }
  ],
  tags: ["transfer-learning", "fine-tuning", "pretrained"]
},
{
  d: 47, w: 7, phase: "Deep Learning", track: "DL",
  title: "Debugging Deep Networks — The Checklist",
  hook: "The skill that separates people who ship models from people who don't.",
  why: "'Your model is not learning — what do you check?' is one of the highest-signal interview questions in existence, because it cannot be bluffed.",
  learn: [
    { h: "Bug taxonomy: data, model, optimisation",
      p: "Data bugs: misaligned labels, wrong normalisation, a broken augmentation, leakage. Model bugs: wrong output dimension, wrong loss pairing, shapes silently broadcasting. Optimisation bugs: learning rate wrong by orders of magnitude, missing zero_grad, exploding gradients. Diagnose in that order — data first, because it is the most common and the most expensive to discover late." },
    { h: "The single-batch overfit test",
      p: "Take 8 examples and train until loss is near zero. If it cannot, you have a data or model bug, not an optimisation one — no amount of learning rate tuning will help. If it can, your pipeline is sound and the problem is generalisation or optimisation. This one test cuts the search space in half in 30 seconds." },
    { h: "Read the loss curve like a diagnostic",
      p: "Flat loss from step one: learning rate too small, or gradients not flowing (check .grad is not None). Loss to NaN: learning rate too high, or a log(0)/division by zero. Loss spikes: exploding gradients, so clip them. Train falls, validation rises: overfitting. Validation below train: a leak or dropout being counted differently." },
    { h: "Instrument before you guess",
      p: "Log gradient norms per layer, weight update magnitudes relative to weight size (a healthy ratio is around 1e-3), and activation statistics. Visualise a batch of your actual training inputs after augmentation — you will be surprised how often the bug is visible right there." }
  ],
  cheat: {
    title: "DEBUG CHECKLIST",
    pts: [
      "0. LOOK at a batch of real inputs+labels",
      "1. overfit 8 samples to ~0 loss",
      "2. check loss at init (CE ~ ln(n_classes))",
      "3. lr sweep: 1e-5 .. 1e-1, log scale",
      "4. verify zero_grad + .grad not None",
      "5. log grad norms per layer",
      "6. update/weight ratio ~1e-3",
      "7. train() vs eval() set correctly?",
      "8. normalisation matches pretraining?"
    ],
    eq: ["CrossEntropy at random init should be ~ln(num_classes). 10 classes -> ~2.30"],
    warn: "If initial loss is far from ln(n_classes), your labels, output layer, or loss function are wrong. Check this in the first 10 seconds of every run — it is free and catches a huge class of bugs."
  },
  vids: [
    { t: "A recipe for training neural networks", ch: "Andrej Karpathy" },
    { t: "Debugging neural networks", ch: "Weights and Biases" }
  ],
  lab: {
    t: "Plant bugs, then find them",
    steps: [
      "Take a working training script. Create 6 copies, each with one planted bug: shuffled labels, missing zero_grad, softmax before CE, lr 100x too high, eval mode during training, normalisation mismatch",
      "For each, note the exact symptom in the loss curve",
      "Build notes/debug-signatures.md mapping symptom to cause",
      "This document is worth more than any tutorial you will read"
    ],
    out: "notes/debug-signatures.md — your personal diagnostic manual."
  },
  qs: [
    { q: "Your model's loss is not decreasing. Walk me through your debugging.",
      a: "First I look at actual batches of input and labels after the data pipeline, because data bugs are most common. Then I check the loss at initialisation against the theoretical value — cross-entropy should be about ln of the number of classes — which catches label and output-layer errors immediately. Then I try to overfit eight samples; if that fails the bug is in the model or data, not optimisation. If it succeeds I sweep the learning rate logarithmically, verify zero_grad is called and gradients are non-None, and log per-layer gradient norms to find where signal dies." },
    { q: "Training loss decreases but validation loss increases. What do you do?",
      a: "That is classic overfitting. I would add data augmentation first since it adds real information, then regularisation via weight decay and dropout, then early stopping with best-checkpoint restoration. I would also consider reducing model capacity or using a pretrained backbone. Before all that I would verify the validation set is genuinely disjoint and representative, since a distribution mismatch produces the same symptom for a completely different reason." }
  ],
  tags: ["debugging", "training", "interview"]
},
{
  d: 48, w: 7, phase: "Deep Learning", track: "DL",
  title: "Beyond Classification — Detection & Segmentation",
  hook: "Where is it, not just what is it.",
  why: "Many co-op projects involve detection or segmentation. You do not need to implement YOLO, but you must be able to discuss the task formulations and their metrics.",
  learn: [
    { h: "The task ladder",
      p: "Classification: one label per image. Localisation: one box. Object detection: many boxes with classes. Semantic segmentation: a class per pixel, no instance separation. Instance segmentation: a mask per object. Each step up needs richer labels and a different output head." },
    { h: "IoU and NMS",
      p: "Intersection over Union measures box overlap and defines what counts as a correct detection, typically at threshold 0.5. Non-Maximum Suppression removes duplicate boxes for the same object: sort by confidence, keep the top one, discard anything overlapping it above an IoU threshold, repeat. These two concepts are asked constantly." },
    { h: "One-stage vs two-stage",
      p: "Two-stage (Faster R-CNN) proposes regions, then classifies them: more accurate, slower. One-stage (YOLO, SSD, RetinaNet) predicts boxes and classes in a single pass: faster, real-time capable, historically less accurate but the gap has largely closed. DETR reframes detection as set prediction with a transformer and removes NMS entirely." },
    { h: "Segmentation architectures",
      p: "U-Net's encoder-decoder with skip connections is still the default in medical imaging because the skips restore the fine spatial detail lost during downsampling. Mask R-CNN adds a mask head to Faster R-CNN for instance segmentation. Segment Anything made promptable zero-shot segmentation practical." }
  ],
  cheat: {
    title: "Detection & Segmentation Card",
    pts: [
      "classify < localise < detect < segment",
      "IoU = intersection / union, thresh 0.5",
      "NMS: sort by conf, drop high-IoU dupes",
      "2-stage (Faster R-CNN): accurate, slower",
      "1-stage (YOLO): fast, real-time",
      "DETR: set prediction, NO NMS needed",
      "U-Net: enc-dec + SKIPS (medical default)",
      "metric: mAP@0.5, mAP@0.5:0.95 | Dice/IoU"
    ],
    eq: ["IoU = area(A and B) / area(A or B)"],
    warn: "Detection labelling is expensive and error-prone. In practice, start from a pretrained detector and fine-tune on a few hundred labelled images rather than training from scratch."
  },
  vids: [
    { t: "YOLO object detection explained", ch: "Computerphile" },
    { t: "U-Net image segmentation explained", ch: "DigitalSreeni" }
  ],
  lab: {
    t: "Fine-tune a detector on your own images",
    steps: [
      "Label 100-200 images with Roboflow or LabelImg (pick something you care about)",
      "Fine-tune a pretrained YOLO model; evaluate mAP@0.5",
      "Implement IoU and NMS yourself in NumPy and verify against the library",
      "Analyse failure cases: which objects are missed and why (small? occluded? rare class?)"
    ],
    out: "A working detector on a custom dataset — a very demo-able portfolio piece."
  },
  qs: [
    { q: "Explain non-maximum suppression.",
      a: "Detectors produce many overlapping boxes for the same object. NMS sorts detections by confidence, keeps the highest-scoring box, discards every remaining box whose IoU with it exceeds a threshold, and repeats on the rest. It runs per class. The tradeoff is that a low threshold merges genuinely distinct nearby objects while a high one leaves duplicates; Soft-NMS decays scores instead of discarding, and DETR avoids the problem entirely with set-based prediction." },
    { q: "Semantic vs instance segmentation?",
      a: "Semantic segmentation assigns a class to every pixel but does not distinguish separate objects of the same class — three overlapping people become one 'person' region. Instance segmentation produces a separate mask per object instance. Panoptic segmentation unifies both, giving instance masks for countable objects and semantic regions for amorphous ones like sky or road." }
  ],
  tags: ["detection", "segmentation", "yolo", "unet"]
},
{
  d: 49, w: 7, phase: "Deep Learning", track: "Project",
  title: "PROJECT 3 — Computer Vision, End to End",
  hook: "Something visual. Something you can demo in 30 seconds.",
  why: "A vision project is the easiest thing to demo live, and a live demo is disproportionately memorable in an interview. Recruiters remember the thing they could see.",
  learn: [
    { h: "Demo-ability is a feature",
      p: "A Gradio or Streamlit interface where an interviewer uploads their own image and gets a live prediction is worth more than three points of accuracy. Deploy it on HuggingFace Spaces — it is free and gives you a shareable URL for your resume." },
    { h: "Custom data beats benchmark data",
      p: "A model on CIFAR-10 tells the reviewer nothing about you. A model on data you collected and labelled yourself demonstrates initiative, data pipeline skills, and dealing with real-world mess — which is the actual job." }
  ],
  cheat: {
    title: "Project 3 Rubric",
    pts: [
      "[ ] custom or non-standard dataset",
      "[ ] baseline: from scratch vs pretrained",
      "[ ] augmentation ablation table",
      "[ ] transfer learning with proper lr strategy",
      "[ ] confusion matrix + failure gallery",
      "[ ] Gradio demo on HuggingFace Spaces",
      "[ ] inference latency measured + reported",
      "[ ] README w/ demo GIF at the top"
    ],
    eq: ["a live demo link > 3% extra accuracy"],
    warn: "Put a GIF of the working demo at the very top of the README. Most reviewers spend under 30 seconds — give them the payoff immediately."
  },
  vids: [
    { t: "Deploy machine learning model gradio huggingface spaces", ch: "1littlecoder" }
  ],
  lab: {
    t: "Ship Project 3",
    steps: [
      "Collect or curate a custom image dataset (300+ images, 3+ classes)",
      "Work the rubric above completely",
      "Build the Gradio app and deploy to HuggingFace Spaces",
      "Record a demo GIF; put it at the top of the README",
      "Update resume v3; post the demo link on LinkedIn"
    ],
    out: "A live, clickable AI demo on your resume."
  },
  qs: [
    { q: "How would you deploy this model?",
      a: "For a demo, a Gradio app on HuggingFace Spaces gives a shareable endpoint in minutes. For production, I would export to TorchScript or ONNX for a faster, dependency-light runtime, wrap it in a FastAPI service behind a container, add batching for throughput, cache repeated inputs, and monitor latency percentiles plus input-distribution drift. I would also quantise to int8 if latency or cost mattered, after measuring the accuracy impact." }
  ],
  tags: ["project", "vision", "deployment", "milestone"]
},

/* ---------- WEEK 8 : Sequences to Transformers ---------- */
{
  d: 50, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "Word Embeddings — Meaning as Geometry",
  hook: "king - man + woman = queen. Why that works.",
  why: "Embeddings are the foundation of every modern NLP and RAG system. Understanding the training objective is what lets you reason about why retrieval succeeds or fails in week 11.",
  learn: [
    { h: "The distributional hypothesis",
      p: "Words that appear in similar contexts have similar meanings. Word2Vec turns that into a prediction task: given a word, predict its neighbours (skip-gram), or given neighbours, predict the word (CBOW). The learned weight matrix becomes the embedding table. Meaning falls out of the prediction objective as a side effect." },
    { h: "Negative sampling makes it tractable",
      p: "The naive softmax over a 100,000-word vocabulary is prohibitively expensive per training step. Negative sampling reframes it as binary classification: push the true context pair together and push a handful of random pairs apart. This same contrastive idea reappears in modern embedding models and in CLIP." },
    { h: "Static vs contextual embeddings",
      p: "Word2Vec and GloVe give one fixed vector per word, so 'bank' has a single vector blending riverbank and financial senses. BERT and modern encoders produce contextual embeddings — the vector for 'bank' differs depending on the surrounding sentence. That is the crucial upgrade transformers delivered." },
    { h: "Embeddings inherit bias",
      p: "Trained on human text, they encode human stereotypes — the classic finding is that doctor-nurse analogies come out gendered. This is a real production concern and mentioning it unprompted signals maturity about deploying these systems." }
  ],
  cheat: {
    title: "Embeddings Card",
    pts: [
      "distributional hypothesis: context = meaning",
      "skip-gram: word -> context | CBOW: context -> word",
      "negative sampling: 1 true + k random pairs",
      "analogies work via vector arithmetic",
      "static (w2v/GloVe): one vec per word",
      "contextual (BERT): vec depends on sentence",
      "compare with COSINE similarity (day 8)",
      "embeddings encode societal bias"
    ],
    eq: ["vec('king') - vec('man') + vec('woman') ~ vec('queen')"],
    warn: "Static embeddings cannot disambiguate polysemy. If your retrieval keeps confusing two meanings of a word, that is the reason — move to contextual embeddings."
  },
  vids: [
    { t: "Word embeddings word2vec explained", ch: "StatQuest" },
    { t: "Word2vec skip gram negative sampling", ch: "Serrano Academy" }
  ],
  lab: {
    t: "Train and probe your own embeddings",
    steps: [
      "Train Word2Vec with gensim on a corpus you care about (Wikipedia dump, song lyrics, your own notes)",
      "Test analogies and nearest neighbours; find three that work and three that fail",
      "Visualise with PCA and t-SNE (day 30) coloured by category",
      "Probe for bias: compare cosine similarities of occupation words to gendered words and write up what you find"
    ],
    out: "notebooks/50_embeddings.ipynb + a bias audit section."
  },
  qs: [
    { q: "How does Word2Vec learn meaningful vectors?",
      a: "It trains a shallow network on a proxy task — predicting context words from a target word, or vice versa — and the hidden weight matrix becomes the embedding table. Because words occurring in similar contexts must produce similar predictions, they end up with similar vectors. That is the distributional hypothesis operationalised, and negative sampling makes it efficient by replacing the full-vocabulary softmax with binary discrimination against random negatives." },
    { q: "Word2Vec vs BERT embeddings?",
      a: "Word2Vec produces one static vector per word type, so it cannot distinguish word senses — 'bank' gets a single averaged representation. BERT produces contextual embeddings by attending over the whole sentence, so the same word yields different vectors in different contexts, and it captures syntax and word order that a bag-of-contexts model ignores. The cost is that BERT requires a forward pass rather than a lookup." }
  ],
  tags: ["embeddings", "word2vec", "nlp"]
},
{
  d: 51, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "RNNs, LSTMs & Why They Lost",
  hook: "Understand what attention replaced, and why.",
  why: "You will rarely build an RNN today, but 'why did transformers replace RNNs?' is an extremely common interview question, and the answer requires knowing what RNNs could not do.",
  learn: [
    { h: "Recurrence processes one step at a time",
      p: "An RNN maintains a hidden state h_t that summarises everything seen so far, updated as h_t = f(h_{t-1}, x_t). The same weights are applied at every timestep, which is parameter sharing across time, exactly analogous to a CNN's sharing across space." },
    { h: "The vanishing gradient over time",
      p: "Backpropagation through time multiplies the same Jacobian repeatedly, so gradients decay or explode exponentially with sequence length — day 10's problem, made much worse. In practice a vanilla RNN cannot learn dependencies beyond roughly 10-20 steps." },
    { h: "LSTM and GRU add gated memory",
      p: "The LSTM's cell state runs through the sequence with only additive updates, controlled by forget, input, and output gates. That additive path is a gradient highway, structurally the same insight as a ResNet skip connection. GRU simplifies this to two gates with similar performance and fewer parameters." },
    { h: "The fatal flaw is sequential computation",
      p: "Even with gating, you cannot compute timestep t before t-1, so training cannot be parallelised across the sequence. On modern GPUs that is the binding constraint. Transformers process all positions simultaneously, which is why they scale — the attention mechanism was almost secondary to that parallelism." }
  ],
  cheat: {
    title: "RNN/LSTM Card",
    pts: [
      "h_t = f(W h_{t-1} + U x_t)",
      "same weights every step (sharing over time)",
      "BPTT -> repeated Jacobian -> vanish/explode",
      "vanilla RNN: ~10-20 step memory, max",
      "LSTM gates: forget, input, output + cell state",
      "cell state = ADDITIVE = gradient highway",
      "GRU: 2 gates, fewer params, similar perf",
      "KILLER FLAW: sequential = no parallelism"
    ],
    eq: ["c_t = f_t * c_{t-1} + i_t * c~_t     (additive -> gradients survive)"],
    warn: "Gradient clipping is essentially mandatory for RNNs. It does not fix vanishing gradients — only exploding ones. Gating is what addresses vanishing."
  },
  vids: [
    { t: "Long short term memory LSTM clearly explained", ch: "StatQuest" },
    { t: "Illustrated guide to LSTM and GRU", ch: "The AI Hacker" }
  ],
  lab: {
    t: "Feel the limitation yourself",
    steps: [
      "Build a vanilla RNN for character-level text generation in PyTorch",
      "Replace it with an LSTM; compare generated sample quality",
      "Run the copy task: memorise a token and reproduce it N steps later; sweep N and find where each model breaks",
      "Measure training time per epoch and note the sequential bottleneck"
    ],
    out: "Direct experience of the wall that attention was invented to break."
  },
  qs: [
    { q: "Why did transformers replace RNNs?",
      a: "Two reasons. Parallelism: RNNs must process tokens sequentially so training cannot be parallelised across the sequence, whereas transformers compute all positions at once, which is what allows training on internet-scale data. And path length: in an RNN, information between distant tokens passes through many transformations and degrades, while self-attention connects any two positions in a single step, so long-range dependencies are learned far more easily." },
    { q: "How does an LSTM solve the vanishing gradient problem?",
      a: "It introduces a cell state whose updates are additive and gated rather than a repeated matrix multiplication. Because the forget gate can stay near one, gradients flow backwards along that path without exponential decay. It is structurally the same idea as a residual connection: give the gradient an unimpeded route. Note it mitigates rather than fully eliminates the problem, which is why sequence lengths were still limited." }
  ],
  tags: ["rnn", "lstm", "sequences"]
},
{
  d: 52, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "Attention From Scratch",
  hook: "The most important equation in modern AI. Learn it properly.",
  why: "If you can derive scaled dot-product attention and explain every term including why we divide by sqrt(d_k), you are ahead of the vast majority of co-op candidates.",
  learn: [
    { h: "Query, Key, Value",
      p: "The database analogy: a Query is what this token is looking for, Keys are what each token advertises, Values are what each token actually contributes. Similarity between the query and every key produces weights, and the output is the weighted sum of values. Each is a learned linear projection of the input." },
    { h: "The equation, term by term",
      p: "QK^T computes all pairwise similarities via dot products (day 8). Divide by sqrt(d_k) to keep the variance of those scores at roughly 1. Softmax turns them into a probability distribution over positions. Multiply by V to take the weighted average. Four steps, and that is the whole mechanism." },
    { h: "Why sqrt(d_k)",
      p: "The dot product of two random d_k-dimensional vectors with unit-variance components has variance d_k, so scores grow with dimension. Large scores push softmax into a saturated regime where it becomes nearly one-hot, and its gradient vanishes. Dividing by sqrt(d_k) normalises the variance back to 1 and keeps gradients healthy. This is the single most-asked attention detail." },
    { h: "Multi-head attention",
      p: "Split the representation into h heads, run attention independently in each lower-dimensional subspace, and concatenate. Different heads specialise — some track syntax, some coreference, some positional patterns. It is cheap because each head works in d_model/h dimensions, so total cost is roughly unchanged." }
  ],
  cheat: {
    title: "ATTENTION Card",
    pts: [
      "Attn(Q,K,V) = softmax(QK^T / sqrt(d_k)) V",
      "Q = what I'm looking for",
      "K = what I advertise",
      "V = what I contribute",
      "QK^T -> (n,n) similarity matrix",
      "/sqrt(d_k): keeps score variance ~1",
      "  -> stops softmax saturating -> gradients live",
      "multi-head: h heads in d/h dims, concat",
      "cost: O(n^2 * d) in time AND memory"
    ],
    eq: ["Attention(Q,K,V) = softmax( Q K^T / sqrt(d_k) ) V"],
    warn: "The O(n^2) cost in sequence length is THE limitation of transformers. Every long-context innovation (FlashAttention, sliding window, linear attention) exists to attack it. Know this."
  },
  vids: [
    { t: "Attention in transformers visually explained", ch: "3Blue1Brown" },
    { t: "Attention is all you need paper explained", ch: "Yannic Kilcher" }
  ],
  lab: {
    t: "Implement attention in NumPy, then PyTorch",
    steps: [
      "Write scaled dot-product attention in pure NumPy; verify against torch.nn.functional.scaled_dot_product_attention",
      "Implement causal masking (set future positions to -inf before softmax) and confirm no information leaks backwards",
      "Implement multi-head attention with proper reshaping; get the shapes right without looking",
      "Empirically show that removing the sqrt(d_k) scaling makes attention weights near one-hot and gradients tiny"
    ],
    out: "src/attention.py — the core of modern AI, written by you."
  },
  qs: [
    { q: "Explain self-attention.",
      a: "Each token produces a query, key, and value via learned linear projections. The query is compared against every key by dot product to score relevance, those scores are divided by the square root of the key dimension and passed through softmax to become weights, and the output for that token is the weighted sum of all values. So every token builds a representation by selectively aggregating information from every other token, in a single step regardless of distance." },
    { q: "Why divide by sqrt(d_k)?",
      a: "The dot product of two independent vectors with unit-variance entries in d_k dimensions has variance d_k, so raw scores grow with dimensionality. Large magnitude scores drive softmax into a saturated, nearly one-hot regime where its gradient is almost zero, so learning stalls. Scaling by sqrt(d_k) restores unit variance and keeps softmax in its responsive range." }
  ],
  tags: ["attention", "transformers", "interview"]
},
{
  d: 53, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "The Transformer Block",
  hook: "Attention, feed-forward, residual, norm. Repeat 96 times.",
  why: "Every LLM you will ever use is this block stacked. Being able to draw it from memory and explain each component's purpose is a core interview capability.",
  learn: [
    { h: "The block, precisely",
      p: "Multi-head self-attention, add the residual, layer-normalise; then a position-wise feed-forward network, add the residual, layer-normalise. Modern implementations use pre-norm (normalise before each sublayer) rather than the original post-norm, because it trains far more stably at depth without needing careful warmup." },
    { h: "The feed-forward network does the thinking",
      p: "It is a two-layer MLP applied independently at each position, expanding to about 4x the model dimension and back. Attention moves information between positions; the FFN transforms it. It holds roughly two-thirds of the model's parameters, and there is real evidence it functions as a key-value memory storing factual knowledge." },
    { h: "Encoder, decoder, encoder-decoder",
      p: "Encoder-only (BERT): bidirectional attention, good for understanding tasks like classification and retrieval. Decoder-only (GPT): causal masked attention, good for generation, and now dominant. Encoder-decoder (T5, original Transformer): an encoder builds a representation and a decoder cross-attends to it, natural for translation and summarisation." },
    { h: "Causal masking makes generation possible",
      p: "In a decoder, set attention scores for all future positions to negative infinity before softmax so each position can only attend to itself and the past. This is what allows training on all positions in parallel while preserving the autoregressive property at inference." }
  ],
  cheat: {
    title: "Transformer Block Card",
    pts: [
      "x = x + MHA(LN(x))     <- pre-norm",
      "x = x + FFN(LN(x))",
      "FFN: Linear(d,4d) -> GELU -> Linear(4d,d)",
      "FFN ~ 2/3 of all parameters",
      "attention MOVES info, FFN TRANSFORMS it",
      "encoder-only (BERT): bidirectional",
      "decoder-only (GPT): causal mask",
      "enc-dec (T5): cross-attention between"
    ],
    eq: ["params ~ 12 * n_layers * d_model^2   (rough, decoder-only)"],
    warn: "Pre-norm vs post-norm matters enormously in practice: post-norm (the original paper) needs careful warmup and often diverges at depth. Everything modern uses pre-norm."
  },
  vids: [
    { t: "Transformers explained visually", ch: "3Blue1Brown" },
    { t: "Let's build GPT from scratch in code", ch: "Andrej Karpathy" }
  ],
  lab: {
    t: "Build nanoGPT with Karpathy",
    steps: [
      "Follow 'Let's build GPT from scratch' and type every line yourself — do not copy-paste",
      "Train it on a text corpus you choose (your own writing, a book, song lyrics)",
      "Generate samples at several training checkpoints and watch coherence emerge",
      "Ablate: remove the residual connections, then the layer norm, then multi-head, and document how training degrades in each case"
    ],
    out: "A working GPT you built line by line. This is the single best portfolio piece in the whole 90 days."
  },
  qs: [
    { q: "Draw and explain a transformer block.",
      a: "Two sublayers, each wrapped in a residual connection with layer normalisation. First, multi-head self-attention lets every position gather information from every other. Second, a position-wise feed-forward network — expand to 4x, nonlinearity, project back — transforms each position independently. Residuals give gradients a direct path so deep stacks train; LayerNorm stabilises activations and is used rather than BatchNorm because it is independent of batch and sequence length. Modern models place the norm before each sublayer for stability." },
    { q: "Encoder-only vs decoder-only vs encoder-decoder?",
      a: "Encoder-only like BERT uses bidirectional attention, so every token sees full context — ideal for classification, NER, and embedding generation, but it cannot generate autoregressively. Decoder-only like GPT uses causal masking so each token sees only the past, which enables generation and turns out to scale extremely well, making it dominant. Encoder-decoder like T5 encodes the input bidirectionally and lets a decoder cross-attend to it, which suits sequence-to-sequence tasks such as translation." }
  ],
  tags: ["transformers", "gpt", "architecture"]
},
{
  d: 54, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "Tokenisation — BPE and Why It Matters",
  hook: "The unglamorous layer that causes half of all LLM weirdness.",
  why: "Token counts drive your API costs, context limits, and latency. And tokenisation explains famous LLM failures — being able to explain why models struggle to count letters in a word is a memorable interview answer.",
  learn: [
    { h: "Why subwords",
      p: "Character-level gives tiny vocabularies but very long sequences, which is expensive given attention's O(n^2) cost. Word-level gives short sequences but a huge vocabulary and no way to handle unseen words. Subword tokenisation is the compromise: common words stay whole, rare words split into meaningful pieces, and nothing is ever out-of-vocabulary." },
    { h: "Byte-Pair Encoding",
      p: "Start with individual bytes or characters. Repeatedly find the most frequent adjacent pair and merge it into a new token, recording the merge rule. Stop at the target vocabulary size. Encoding new text just replays the merge rules in order. WordPiece and SentencePiece are variations on the same theme." },
    { h: "Practical consequences",
      p: "English averages around 4 characters per token; code, non-English languages, and unusual formatting are far less efficient, sometimes 2-3x more tokens for the same content. That directly multiplies your API bill and eats your context window. Always measure token counts rather than character counts when budgeting." },
    { h: "The weirdness tokenisation causes",
      p: "Models struggle to count letters or reverse strings because they never see individual characters — 'strawberry' may be three tokens. Arithmetic is inconsistent because number tokenisation is irregular. Trailing whitespace changes tokenisation and can degrade output quality. Nearly every 'why is the LLM being stupid about this' question traces back here." }
  ],
  cheat: {
    title: "Tokenisation Card",
    pts: [
      "BPE: merge most frequent adjacent pair, repeat",
      "subword = no OOV + reasonable seq length",
      "~4 chars per token (English)",
      "code / non-English = far more tokens = $$$",
      "letter-counting fails: model sees TOKENS",
      "trailing space changes tokenisation (!)",
      "count tokens with tiktoken, not len(str)",
      "vocab typically 32k-256k"
    ],
    eq: ["cost = (input_tokens * in_price + output_tokens * out_price) / 1M"],
    warn: "Never estimate context usage by character count. Measure with the actual tokeniser — being wrong here means silent truncation of your prompts in production."
  },
  vids: [
    { t: "Let's build the GPT tokenizer", ch: "Andrej Karpathy" },
    { t: "Byte pair encoding tokenization explained", ch: "HuggingFace" }
  ],
  lab: {
    t: "Implement BPE from scratch",
    steps: [
      "Follow Karpathy's tokenizer video; implement BPE training and encoding yourself",
      "Train it on a corpus and inspect the learned merges — the early ones are very interpretable",
      "Compare token counts across English, Hindi/Telugu, Python code, and JSON for the same semantic content",
      "Compute what that difference costs at real API pricing for a 1M-request workload",
      "Demonstrate the strawberry letter-counting failure and explain it in writing"
    ],
    out: "src/bpe.py + a cost analysis you can cite in an interview."
  },
  qs: [
    { q: "Why do LLMs struggle to count the letters in a word?",
      a: "Because they never see letters. Text is split into subword tokens, so 'strawberry' might be two or three tokens, and the model's representation is of those chunks rather than characters. It has no direct access to the character composition unless that information happened to be learned indirectly from training text. The same cause explains difficulty with reversing strings and with inconsistent arithmetic, since number tokenisation is irregular." },
    { q: "What is BPE and why is it used?",
      a: "Byte-Pair Encoding builds a vocabulary by iteratively merging the most frequent adjacent token pair, starting from bytes or characters. It gives a fixed vocabulary with no out-of-vocabulary problem, since anything can fall back to bytes, while keeping common words as single tokens so sequences stay short. That matters because attention cost is quadratic in sequence length, so token efficiency directly affects compute and cost." }
  ],
  tags: ["tokenisation", "bpe", "llm-costs"]
},
{
  d: 55, w: 8, phase: "NLP & Transformers", track: "NLP",
  title: "Positional Encoding & Modern Attention Variants",
  hook: "Attention has no idea what order the words are in. This fixes that.",
  why: "'Why do transformers need positional encoding?' is a common follow-up to the attention question, and knowing RoPE and FlashAttention shows you follow the field rather than just the textbook.",
  learn: [
    { h: "Self-attention is permutation-equivariant",
      p: "The attention computation treats input as a set — shuffle the tokens and the outputs shuffle identically, with no change in content. Since word order carries meaning, position information must be injected explicitly. This is a direct consequence of the equation having no positional term." },
    { h: "Sinusoidal and learned encodings",
      p: "The original paper added fixed sinusoids of different frequencies to the input embeddings, chosen so that relative positions correspond to linear transformations and so the scheme extrapolates to unseen lengths. BERT and GPT-2 instead learned a position embedding table, which is simpler but cannot extrapolate beyond the trained maximum length." },
    { h: "RoPE is the modern standard",
      p: "Rotary Position Embedding rotates the query and key vectors by an angle proportional to position, so their dot product depends naturally on relative position rather than absolute. It extrapolates better, needs no extra parameters, and is used in LLaMA, Mistral, and most current open models. Position interpolation of RoPE is how context windows get extended after training." },
    { h: "Efficient attention",
      p: "FlashAttention restructures the computation to avoid writing the n-by-n attention matrix to slow GPU memory, giving large real speedups with mathematically identical output — it is an IO optimisation, not an approximation. Grouped-query attention shares key and value heads across query heads to shrink the KV cache, which is the main memory bottleneck during generation." }
  ],
  cheat: {
    title: "Position & Efficiency Card",
    pts: [
      "attention is permutation-EQUIVARIANT",
      "-> position must be injected explicitly",
      "sinusoidal: fixed, extrapolates",
      "learned: simple, hard length limit",
      "RoPE: rotate q,k by angle ~ position",
      "  -> relative position, modern default",
      "FlashAttention: IO-aware, EXACT, faster",
      "GQA/MQA: share K,V heads -> smaller KV cache"
    ],
    eq: ["PE(pos,2i) = sin(pos / 10000^(2i/d)) ; PE(pos,2i+1) = cos(...)"],
    warn: "FlashAttention is exact, not approximate. Candidates often say it is an approximation — getting this right is a small but noticeable credibility point."
  },
  vids: [
    { t: "Rotary positional embeddings RoPE explained", ch: "Efficient NLP" },
    { t: "FlashAttention explained", ch: "Aleksa Gordic" }
  ],
  lab: {
    t: "Prove order-blindness, then fix it",
    steps: [
      "Take your day-52 attention implementation; feed shuffled input and show the outputs are just permuted",
      "Implement sinusoidal positional encoding and visualise the encoding matrix as a heatmap",
      "Implement RoPE and verify that attention scores now depend on relative distance",
      "Train a tiny model on a task requiring order (e.g. sorting) with and without positional encoding; compare"
    ],
    out: "A demonstration that makes positional encoding intuitive rather than memorised."
  },
  qs: [
    { q: "Why do transformers need positional encodings?",
      a: "Self-attention computes weighted sums over all positions with no term depending on index, so it is permutation-equivariant — reordering the input just reorders the output identically. Since word order carries meaning, position must be injected explicitly, either by adding positional vectors to embeddings or, in modern models, by rotating queries and keys so their dot products encode relative position." },
    { q: "What does FlashAttention actually do?",
      a: "It computes exactly the same attention output but reorganises the computation to be IO-aware. Standard attention materialises the n-by-n score matrix in high-bandwidth memory, and that memory traffic — not arithmetic — is the bottleneck. FlashAttention tiles the computation to keep blocks in fast on-chip SRAM and uses an online softmax so the full matrix is never written out, giving large wall-clock speedups and much lower memory use." }
  ],
  tags: ["positional-encoding", "rope", "flashattention"]
},
{
  d: 56, w: 8, phase: "NLP & Transformers", track: "Review",
  title: "Week 8 Consolidation — Explain the Transformer",
  hook: "If you can teach it, you know it.",
  why: "The transformer is the single most likely deep-dive topic in an AI co-op interview. Today you rehearse explaining it at three different depths for three different audiences.",
  learn: [
    { h: "Three explanations, three audiences",
      p: "The 30-second version for a recruiter: 'a model that reads all words at once and learns which words matter to which'. The 3-minute version for a hiring manager: QKV, parallelism, why it beat RNNs. The 10-minute version for an ML engineer: the full block, masking, positional encoding, complexity, and the modern variants. Practise all three." },
    { h: "Draw it, do not describe it",
      p: "In an onsite you will have a whiteboard. Practise drawing the block diagram while talking. Being able to draw confidently is a strong nonverbal signal, and it structures your explanation automatically so you do not ramble." }
  ],
  cheat: {
    title: "Transformer Recall Test",
    pts: [
      "[ ] write the attention equation from memory",
      "[ ] explain each of Q, K, V in one line",
      "[ ] justify sqrt(d_k)",
      "[ ] draw a full block with residuals + norms",
      "[ ] explain causal masking",
      "[ ] enc-only vs dec-only vs enc-dec",
      "[ ] state complexity: O(n^2 d)",
      "[ ] why positional encoding is required",
      "[ ] name RoPE, FlashAttention, GQA"
    ],
    eq: ["if you can't write softmax(QK^T/sqrt(d_k))V blind, do it 10 more times"],
    warn: "Do not memorise a script. Understand the causal chain — each design choice solves a specific problem — so you can answer follow-ups instead of only reciting."
  },
  vids: [
    { t: "The illustrated transformer walkthrough", ch: "Jay Alammar" }
  ],
  lab: {
    t: "Teach it out loud, three times",
    steps: [
      "Record the 30-second, 3-minute, and 10-minute versions on video",
      "Draw the architecture from memory on paper. Compare against the paper diagram. Repeat until identical.",
      "Write a blog post explaining attention to someone who knows only linear algebra — publish it",
      "Complete the recall checklist above with zero references open"
    ],
    out: "A published explainer post (great resume link) + verified recall."
  },
  qs: [
    { q: "Explain transformers to a non-technical person.",
      a: "Older language models read a sentence one word at a time and had to remember everything they had seen, so they lost track of long sentences. A transformer reads the whole thing at once and, for every word, works out which other words matter most to its meaning — like how understanding 'it' in a sentence requires finding what 'it' refers to. Doing that for all words simultaneously is both more accurate and far faster to train, which is what made models this large possible." }
  ],
  tags: ["review", "transformers", "communication"]
},

/* ---------- WEEK 9 (part) : HuggingFace & Fine-Tuning ---------- */
{
  d: 57, w: 9, phase: "NLP & Transformers", track: "NLP",
  title: "The HuggingFace Ecosystem",
  hook: "The npm of machine learning. Learn it properly, save months.",
  why: "Practically every NLP job uses HuggingFace. Fluency with transformers, datasets, and the Hub is directly employable and shows up in job descriptions by name.",
  learn: [
    { h: "The core libraries",
      p: "transformers gives models and tokenisers with a unified API. datasets handles memory-mapped loading, streaming, and processing of datasets far larger than RAM. tokenizers is the fast Rust implementation. accelerate abstracts device placement and distributed training. peft provides LoRA and friends. evaluate provides standard metrics." },
    { h: "AutoClasses and the three layers of abstraction",
      p: "pipeline() is one line for inference and perfect for prototyping. AutoModel plus AutoTokenizer gives you control over the forward pass. Trainer sits in the middle for fine-tuning with sensible defaults. Know all three and pick deliberately — using pipeline in production code looks naive; hand-writing a training loop when Trainer would do looks wasteful." },
    { h: "Model selection on the Hub",
      p: "Check the licence first (some are non-commercial), then model size against your hardware, then the model card for training data and known limitations, then downloads and community adoption as a rough quality proxy. Prefer a well-documented smaller model over an undocumented large one." },
    { h: "Datasets and streaming",
      p: "load_dataset uses Apache Arrow with memory mapping, so a 100GB dataset does not need 100GB of RAM. .map() applies transformations in batches with caching, and streaming=True lets you iterate over datasets too large to download at all." }
  ],
  cheat: {
    title: "HuggingFace Card",
    pts: [
      "pipeline('task') -> instant inference",
      "AutoTokenizer + AutoModelFor<Task>",
      "Trainer + TrainingArguments for fine-tune",
      "load_dataset(...) -> Arrow, memory-mapped",
      "ds.map(fn, batched=True) -> cached",
      "streaming=True for huge datasets",
      "CHECK THE LICENCE before anything",
      "push_to_hub() to share models"
    ],
    eq: ["tok(texts, padding=True, truncation=True, return_tensors='pt')"],
    warn: "Always pass truncation=True. Without it, one long input raises an error mid-training run, or worse, silently exceeds the position limit."
  },
  vids: [
    { t: "HuggingFace transformers course chapter 1", ch: "HuggingFace" },
    { t: "Getting started with huggingface transformers", ch: "James Briggs" }
  ],
  lab: {
    t: "Speed-run the ecosystem",
    steps: [
      "Use pipeline() for sentiment, NER, summarisation, and zero-shot classification — 30 minutes total",
      "Redo sentiment manually with AutoTokenizer + AutoModel and inspect the raw logits",
      "Load a dataset with load_dataset, tokenise it with .map(batched=True), and inspect the cache",
      "Browse the Hub and shortlist 3 models for a task you care about, documenting your selection criteria"
    ],
    out: "Ecosystem fluency + a documented model-selection process."
  },
  qs: [
    { q: "How do you choose a pretrained model for a task?",
      a: "Licence first, since some models forbid commercial use and that is a hard blocker. Then task fit and architecture — encoder-only for classification and embeddings, decoder-only for generation. Then size against my latency, memory, and cost budget, since a distilled model at 95% of the quality for 10% of the cost usually wins. Then the model card for training data, language coverage, and known limitations. Finally I benchmark the top two or three on my own held-out data, because leaderboard scores rarely transfer." },
    { q: "pipeline() vs Trainer vs a custom loop?",
      a: "pipeline is for rapid prototyping and demos — one line, but limited control and it hides batching. Trainer is for standard fine-tuning where I want mixed precision, checkpointing, evaluation, and logging without writing them, and it covers most real work. A custom loop is for non-standard training: custom losses, multi-task objectives, reinforcement learning, or anything Trainer's abstractions fight against." }
  ],
  tags: ["huggingface", "transformers", "tooling"]
},
{
  d: 58, w: 9, phase: "NLP & Transformers", track: "NLP",
  title: "BERT & Encoder Models — Fine-Tuning for Understanding",
  hook: "Still the right tool for classification, retrieval, and extraction.",
  why: "Encoder models are cheaper, faster, and often more accurate than LLMs for classification. Knowing when to use BERT instead of calling an LLM API is a real cost-engineering judgement call.",
  learn: [
    { h: "How BERT was pretrained",
      p: "Masked Language Modelling: randomly mask 15% of tokens and predict them using both left and right context — which is what makes the representations bidirectional. The original also used Next Sentence Prediction, later shown to be largely unhelpful and dropped by RoBERTa." },
    { h: "The [CLS] token and fine-tuning heads",
      p: "A special token is prepended, and its final hidden state is trained to represent the whole sequence. For classification you attach a linear head to it. For token-level tasks like NER you attach a head to every token's output. For sentence-pair tasks you feed both segments separated by [SEP]." },
    { h: "The BERT family",
      p: "RoBERTa: better training recipe, no NSP, consistently stronger. DistilBERT: 40% smaller and 60% faster at ~97% of the performance, an excellent production default. DeBERTa: disentangled attention, state of the art among encoders. ModernBERT: a recent refresh with longer context and modern architecture choices." },
    { h: "Sentence embeddings need a different objective",
      p: "Raw BERT [CLS] vectors are poor for similarity, because MLM never trained them to be comparable across sentences. Sentence-BERT fine-tunes with a contrastive or triplet objective on sentence pairs, which is what makes the embeddings genuinely useful for retrieval — directly relevant to your RAG work in week 11." }
  ],
  cheat: {
    title: "BERT Card",
    pts: [
      "pretrain: MLM, mask 15%, BIDIRECTIONAL",
      "[CLS] pooled -> classification head",
      "per-token output -> NER / QA span",
      "[SEP] separates sentence pairs",
      "RoBERTa > BERT (better recipe, no NSP)",
      "DistilBERT: 60% faster, ~97% perf",
      "raw BERT vecs BAD for similarity",
      "-> use sentence-transformers (contrastive)"
    ],
    eq: ["fine-tune lr ~ 2e-5, 2-4 epochs, batch 16-32   (the standard recipe)"],
    warn: "Do not use raw BERT [CLS] embeddings for semantic search. They were never trained for cross-sentence comparability. Use a sentence-transformers model."
  },
  vids: [
    { t: "BERT explained neural network", ch: "CodeEmporium" },
    { t: "Fine tuning BERT for text classification", ch: "James Briggs" }
  ],
  lab: {
    t: "Fine-tune BERT and beat an LLM on cost",
    steps: [
      "Fine-tune DistilBERT on a text classification dataset with Trainer",
      "Compare against zero-shot classification with an LLM API on the same test set",
      "Build a table: accuracy, latency per request, cost per 1M requests, and deployment complexity",
      "Then use sentence-transformers to embed the same texts and cluster them; compare against raw BERT [CLS] vectors"
    ],
    out: "A cost/accuracy analysis that demonstrates real engineering judgement."
  },
  qs: [
    { q: "When would you use BERT instead of an LLM?",
      a: "For fixed classification, extraction, or embedding tasks with reasonable training data. A fine-tuned DistilBERT runs in milliseconds on CPU at essentially zero marginal cost, gives deterministic outputs, and typically matches or beats a general LLM on a narrow task. I would reach for an LLM when there is little labelled data, when the label set changes frequently, when the task needs reasoning or generation, or when time to first version matters more than unit cost." },
    { q: "What is masked language modelling?",
      a: "During pretraining, roughly 15% of input tokens are replaced with a mask token and the model predicts the originals using context from both directions. That bidirectionality is the key difference from causal language modelling, and it produces representations that encode context from the whole sequence, which is what makes BERT strong for understanding tasks. The tradeoff is that it cannot generate text autoregressively." }
  ],
  tags: ["bert", "fine-tuning", "classification"]
},
{
  d: 59, w: 9, phase: "NLP & Transformers", track: "LLM",
  title: "GPT & Decoder Models — How Generation Actually Works",
  hook: "Next-token prediction, all the way down.",
  why: "Understanding sampling parameters is immediately practical — every LLM application you build for the rest of this sprint depends on getting temperature and top-p right.",
  learn: [
    { h: "Autoregressive generation",
      p: "The model outputs a probability distribution over the vocabulary for the next token, one token is selected, appended to the context, and the process repeats. Everything an LLM appears to do — reasoning, coding, conversation — emerges from this single objective applied at scale." },
    { h: "Decoding strategies",
      p: "Greedy takes the highest-probability token every time: deterministic but repetitive. Beam search keeps several candidate sequences and is good for translation but bland for open-ended text. Sampling draws from the distribution and is what makes output interesting. Temperature scales the logits before softmax — below 1 sharpens, above 1 flattens. Top-k restricts to the k most likely; top-p (nucleus) restricts to the smallest set whose cumulative probability exceeds p, which adapts to how confident the model is." },
    { h: "The KV cache",
      p: "Without caching, generating token n would recompute attention over all previous tokens from scratch. The KV cache stores the key and value tensors for previous positions so each new token costs only one step. It is why generation is fast, and its memory footprint is the main constraint on batch size and context length in production." },
    { h: "Emergence and scaling",
      p: "Capabilities like in-context learning and chain-of-thought reasoning appear as scale increases without being explicitly trained. Scaling laws relate loss to parameters, data, and compute; the Chinchilla result showed most large models were badly undertrained relative to their size, which reshaped how models are built." }
  ],
  cheat: {
    title: "Generation Card",
    pts: [
      "loop: predict next token -> append -> repeat",
      "temperature <1 = focused, >1 = wild",
      "temp=0 -> greedy, deterministic",
      "top-k: keep k most likely",
      "top-p: keep smallest set summing to p (adaptive)",
      "use temp OR top-p, not both aggressively",
      "KV cache = why gen is fast, = memory hog",
      "prefill (parallel) vs decode (sequential)"
    ],
    eq: ["p_i = exp(z_i / T) / sum_j exp(z_j / T)"],
    warn: "For extraction, classification, and structured output use temperature 0. Creative defaults (0.7-1.0) in a data-extraction pipeline produce silent inconsistency across runs."
  },
  vids: [
    { t: "Intro to large language models", ch: "Andrej Karpathy" },
    { t: "How LLMs generate text sampling temperature top-p", ch: "Efficient NLP" }
  ],
  lab: {
    t: "Explore the sampling space",
    steps: [
      "Load a small open model (GPT-2 or Qwen-0.5B) locally",
      "Generate the same prompt at temperature 0, 0.3, 0.7, 1.0, 1.5 — collect and compare outputs",
      "Do the same across top-p values; document where output becomes incoherent",
      "Implement greedy decoding manually from raw logits to confirm you understand the loop",
      "Measure generation speed with and without the KV cache enabled"
    ],
    out: "Calibrated intuition for sampling parameters you will use daily."
  },
  qs: [
    { q: "Explain temperature and top-p.",
      a: "Temperature divides the logits before softmax: below 1 sharpens the distribution toward the most likely tokens, above 1 flattens it and increases randomness, and 0 is equivalent to greedy decoding. Top-p, or nucleus sampling, truncates the distribution to the smallest set of tokens whose cumulative probability exceeds p and renormalises, so it adapts — when the model is confident few tokens are considered, when uncertain more are. I use temperature 0 for extraction and structured output, and around 0.7 with top-p 0.9 for creative generation." },
    { q: "What is the KV cache and why does it matter?",
      a: "During autoregressive generation each new token attends over all previous tokens, and without caching you would recompute their key and value projections every step, making generation quadratic. The KV cache stores those tensors so each new token is a single incremental step. The cost is memory: cache size scales with batch size times sequence length times layers times hidden dimension, and it is usually the binding constraint on serving throughput — which is why grouped-query attention exists." }
  ],
  tags: ["gpt", "generation", "sampling", "kv-cache"]
},
{
  d: 60, w: 9, phase: "NLP & Transformers", track: "LLM",
  title: "Fine-Tuning Strategies — Full, LoRA, QLoRA",
  hook: "How to adapt a 7B model on a laptop-class GPU.",
  why: "'How would you fine-tune an LLM with limited compute?' is an increasingly common question, and LoRA is the answer everyone wants to hear you explain correctly.",
  learn: [
    { h: "Decide whether to fine-tune at all",
      p: "The honest order is: prompt engineering first, then few-shot examples, then RAG for knowledge, and only then fine-tuning. Fine-tuning teaches form — style, format, tone, task structure — much better than it teaches facts. If the problem is 'the model does not know our data', RAG is the correct answer, not fine-tuning." },
    { h: "LoRA",
      p: "Freeze the pretrained weights and add a low-rank update: W + BA where B is d-by-r and A is r-by-k with r typically 8 to 64. You train roughly 0.1-1% of the parameters, memory drops enormously, and adapters can be swapped at serve time. It works because the weight update needed for adaptation is empirically low-rank — which is exactly day 9's SVD insight." },
    { h: "QLoRA",
      p: "Quantise the frozen base model to 4-bit while training LoRA adapters in higher precision, using a normal-float format and double quantisation. This makes fine-tuning a 7B model feasible on a single consumer GPU with minimal quality loss, and it is the standard approach for individual practitioners." },
    { h: "Instruction tuning and preference alignment",
      p: "Supervised fine-tuning on instruction-response pairs teaches the model to follow instructions. Preference optimisation — RLHF, or the simpler DPO — aligns outputs with human preferences by training on chosen-versus-rejected response pairs. DPO is far simpler than RLHF because it removes the separate reward model and RL loop." }
  ],
  cheat: {
    title: "Fine-Tuning Card",
    pts: [
      "order: prompt > few-shot > RAG > fine-tune",
      "fine-tune teaches FORM, RAG supplies FACTS",
      "LoRA: W + BA, rank r=8-64, ~0.1-1% params",
      "target q_proj,k_proj,v_proj,o_proj (+ MLP)",
      "alpha/r = scaling; alpha ~ 2r is common",
      "QLoRA: 4-bit frozen base + LoRA adapters",
      "SFT = instruction pairs | DPO = preference pairs",
      "need ~500-5000 GOOD examples, not millions"
    ],
    eq: ["h = W_0 x + (alpha/r) * B A x     (B init 0 -> starts as identity)"],
    warn: "Fine-tuning to inject facts mostly does not work — it produces confident hallucination in the right style. Use RAG for knowledge. This is the most common mistake people make."
  },
  vids: [
    { t: "LoRA low rank adaptation explained", ch: "AI Coffee Break" },
    { t: "QLoRA fine tuning llm on single gpu", ch: "Sam Witteveen" }
  ],
  lab: {
    t: "LoRA fine-tune a small model",
    steps: [
      "Pick a small instruct model (Qwen2.5-0.5B or Llama-3.2-1B) and a task with a distinctive output format",
      "Build 300-1000 instruction-response pairs (generate them, curate them, or use an existing dataset)",
      "Fine-tune with peft LoRA; log train and eval loss",
      "Compare base vs fine-tuned on held-out examples with a clear rubric",
      "Sweep rank r in [4, 16, 64] and record quality versus trainable parameter count"
    ],
    out: "A fine-tuned model on the Hub + an honest before/after evaluation."
  },
  qs: [
    { q: "Explain LoRA.",
      a: "Instead of updating all pretrained weights, you freeze them and learn a low-rank decomposition of the update: the effective weight becomes W plus B times A, where the inner rank r is small, typically 8 to 64. That means training well under 1% of the parameters, dramatically less optimiser memory, and adapters small enough to swap per task at serve time. It works because the adaptation needed for a downstream task empirically lies in a low-dimensional subspace, and B is initialised to zero so training starts exactly at the pretrained model." },
    { q: "When would you fine-tune versus use RAG?",
      a: "RAG when the need is knowledge — facts that are proprietary, frequently updated, or need citation and access control, since you can update the index without retraining and the model can cite sources. Fine-tuning when the need is behaviour — a consistent output format, a domain-specific style or vocabulary, or a task structure that is hard to specify in a prompt. They are complementary, and a common production setup is a fine-tuned model that also retrieves. Trying to inject facts by fine-tuning generally produces fluent hallucination." }
  ],
  tags: ["lora", "qlora", "fine-tuning", "peft"]
}

];
