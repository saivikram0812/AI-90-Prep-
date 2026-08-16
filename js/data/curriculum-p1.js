/* ============================================================
   PHASE 1-2 :: Days 1-30
   Foundations -> Math -> Supervised ML -> Trees & Ensembles
   ============================================================ */

window.CURRICULUM_P1 = [

/* ---------- WEEK 1 : Data & Python Foundations ---------- */
{
  d: 1, w: 1, phase: "Foundations", track: "Tooling",
  title: "How ML Actually Works + Your Setup",
  hook: "Before any math: build the correct mental model of what a model IS.",
  why: "Every co-op interview opens with 'walk me through how you'd approach this problem.' If your mental model is fuzzy, everything after sounds memorised. Also: a clean, reproducible environment is the #1 thing that separates a student notebook from an engineer's repo.",
  learn: [
    { h: "A model is a function with tunable knobs",
      p: "f(x; theta) takes input x and produces a prediction. Training = searching for the theta that makes predictions least wrong on data you have. That is genuinely it. Linear regression has 2 knobs; GPT-class models have hundreds of billions. The search procedure changes, the idea does not." },
    { h: "The loss function is where you encode 'wrong'",
      p: "You cannot optimise what you cannot measure. A loss function turns 'how bad was that prediction' into one number. Squared error punishes big misses hard; absolute error shrugs at outliers; cross-entropy punishes confident-and-wrong brutally. Choosing a loss IS a modelling decision, not a detail." },
    { h: "Generalisation is the whole game",
      p: "Anyone can fit training data — memorise it and you get 100%. The only thing that matters is performance on data the model has never seen. This single idea generates train/test splits, cross-validation, regularisation, dropout, and early stopping. All of them are defences against fooling yourself." },
    { h: "Your environment is part of your engineering story",
      p: "Use a virtual environment per project, pin dependencies, commit to git from day one. When an interviewer asks 'how do you make results reproducible?', you want a real answer, not a shrug." }
  ],
  cheat: {
    title: "ML in 6 Lines",
    pts: [
      "model = function with knobs (theta)",
      "loss = number that says 'how wrong'",
      "training = search theta to shrink loss",
      "train set -> fit. test set -> truth.",
      "overfit = memorised, didn't learn",
      "underfit = too simple to even memorise"
    ],
    eq: ["theta* = argmin_theta  L( f(X;theta), y )"],
    warn: "NEVER let test data influence any decision. Not scaling, not feature selection, not 'just peeking'. That is leakage and it silently inflates every number you report."
  },
  vids: [
    { t: "A gentle introduction to machine learning", ch: "StatQuest" },
    { t: "But what is a neural network", ch: "3Blue1Brown" }
  ],
  lab: {
    t: "Set up your 90-day repo",
    steps: [
      "Create a git repo named ai-coop-90 with folders: notebooks/, src/, projects/, notes/, dsa/",
      "Make a virtual env (python -m venv .venv) and install numpy pandas matplotlib scikit-learn jupyter",
      "Freeze it: pip freeze > requirements.txt, and add a .gitignore that excludes .venv and data/",
      "Write README.md with your goal, start date, and a table you will tick off weekly",
      "In dsa/, add a solutions file per pattern (arrays.py, twopointers.py, …) — the DSA track starts day 3",
      "Commit and push to GitHub. This repo becomes your portfolio artefact."
    ],
    out: "Public GitHub repo with a real README and a working env."
  },
  qs: [
    { q: "What is the difference between overfitting and underfitting?",
      a: "Overfitting = low training error, high test error; the model memorised noise specific to the training set. Underfitting = high error on both; the model is too simple (or under-trained) to capture the real signal. Diagnose by comparing train vs validation curves, not by looking at one number." },
    { q: "Why do we need a test set if we already have a validation set?",
      a: "The validation set gets used repeatedly for tuning, so you gradually overfit to it through your own decisions. The test set is touched once, at the end, to give an unbiased estimate. If you tune on the test set, you no longer have an honest number." }
  ],
  tags: ["fundamentals", "setup", "git"]
},
{
  d: 2, w: 1, phase: "Foundations", track: "Python",
  title: "NumPy & Vectorised Thinking",
  hook: "Stop writing loops. Start thinking in arrays.",
  why: "Every ML library is NumPy-shaped. PyTorch tensors are NumPy with a GPU and gradients. If broadcasting confuses you now, it will confuse you again in week 6 when a matrix multiply silently produces the wrong shape and your model trains to garbage.",
  learn: [
    { h: "The ndarray: shape, dtype, axis",
      p: "An array has a shape tuple (rows, cols, ...) and a single dtype. Nearly every NumPy bug is a shape bug or a dtype bug. Get in the habit of printing .shape constantly — professional ML engineers do this more than beginners, not less." },
    { h: "Broadcasting is the superpower",
      p: "NumPy stretches smaller arrays across larger ones without copying memory. Rule: compare shapes right-to-left; dimensions must be equal or one of them must be 1. A (100,3) array minus a (3,) array subtracts a per-column mean from every row — that is feature standardisation in one line." },
    { h: "Vectorisation replaces loops",
      p: "A Python for-loop over a million elements runs in the interpreter; the equivalent NumPy op runs in compiled C over contiguous memory. Expect 50-200x speedups. In interviews, rewriting a loop as a vectorised expression is an instant credibility signal." },
    { h: "Axis semantics",
      p: "axis=0 collapses rows (gives a per-column result), axis=1 collapses columns (per-row result). Say it out loud as 'the axis I name is the axis that disappears' and you will stop guessing." }
  ],
  cheat: {
    title: "NumPy Survival Card",
    pts: [
      "a.shape / a.dtype / a.reshape(-1,1)",
      "axis=0 -> down columns (kills rows)",
      "axis=1 -> across rows (kills cols)",
      "broadcast: align RIGHT, dims eq or 1",
      "a[a>0] boolean mask, np.where(c,x,y)",
      "@ = matmul, * = elementwise (!!)",
      "np.newaxis / None to add a dimension"
    ],
    eq: ["z = (X - X.mean(0)) / X.std(0)   # standardise, all columns, one line"],
    warn: "* is NOT matrix multiply. (n,1) and (1,n) broadcast into (n,n) — a classic silent bug that eats your RAM and your afternoon."
  },
  vids: [
    { t: "NumPy broadcasting explained", ch: "Keith Galli" },
    { t: "NumPy full course for beginners", ch: "freeCodeCamp",
      n: "1h course · watch only up to broadcasting (~first 30 min), then stop" }
  ],
  lab: {
    t: "Vectorise everything",
    steps: [
      "Write a Python loop computing euclidean distance from one point to 10,000 points; time it",
      "Rewrite it in pure NumPy with broadcasting; time it; record the speedup in your notes",
      "Implement standardisation, min-max scaling, and one-hot encoding using only NumPy",
      "Implement a function that returns the top-k indices of an array without sorting the whole thing (np.argpartition)"
    ],
    out: "notebooks/02_numpy.ipynb with a timing comparison table."
  },
  qs: [
    { q: "Explain broadcasting.",
      a: "NumPy aligns shapes from the rightmost dimension. Two dimensions are compatible if equal or if one is 1; size-1 dims are virtually repeated without copying memory. It lets you apply a (3,) vector across a (100,3) matrix as if it were tiled 100 times, at zero memory cost." },
    { q: "Why is NumPy faster than a Python list loop?",
      a: "Contiguous typed memory instead of scattered PyObject pointers, loops executed in compiled C rather than the interpreter, SIMD vectorisation, and no per-element type dispatch." }
  ],
  tags: ["numpy", "vectorisation"]
},
{
  d: 3, w: 1, phase: "Foundations", track: "Python",
  title: "pandas I — Load, Select, Clean",
  hook: "80% of the job is here. Genuinely.",
  why: "Interviewers hand you a messy CSV in take-homes. Fluency in pandas is assumed and never taught on the job. Slow, clumsy data wrangling is the most common reason a strong candidate runs out of time in a take-home.",
  learn: [
    { h: "Series and DataFrame",
      p: "A Series is a labelled 1-D array; a DataFrame is a dict of Series sharing an index. The index is not decoration — it drives alignment in every operation, and mysterious NaNs after an operation are almost always misaligned indexes." },
    { h: "loc vs iloc",
      p: ".loc is label-based and inclusive of the endpoint; .iloc is integer-position based and exclusive, like normal Python slicing. Mixing them up is the single most common pandas bug. Use .loc for real work; use .iloc when you genuinely mean 'the third row'." },
    { h: "Missing data is a modelling decision",
      p: "isna(), fillna(), dropna() are easy. The hard part is deciding: is this value missing at random, or is missingness itself a signal? A null income field might mean 'unemployed'. Creating an explicit was_missing indicator column often beats imputation." },
    { h: "dtypes and memory",
      p: "object dtype means Python strings and is slow and huge. Convert repeated strings to category, downcast int64 to int32 where safe, and parse dates at read time with parse_dates. On a 2GB CSV this is the difference between working and crashing." }
  ],
  cheat: {
    title: "pandas Card 1",
    pts: [
      "df.loc[rows, cols] label, END-INCLUSIVE",
      "df.iloc[i, j] position, end-exclusive",
      "df[df.age > 30 & ...] -> WRAP IN PARENS",
      "df.isna().sum() -> null audit, always",
      "df.astype('category') for repeated strings",
      "pd.read_csv(..., parse_dates=['ts'])",
      "df.copy() to break the view/copy chain"
    ],
    eq: ["df.info(memory_usage='deep')  # the honest memory number"],
    warn: "SettingWithCopyWarning is not noise. It means you may be writing to a temporary view and your change may vanish. Fix it with .loc or an explicit .copy()."
  },
  vids: [
    { t: "Pandas tutorial loc iloc selecting rows and columns", ch: "Corey Schafer" },
    { t: "Pandas handling missing data dropna fillna", ch: "Corey Schafer" }
  ],
  lab: {
    t: "Clean a genuinely messy dataset",
    steps: [
      "Download the Titanic dataset (or any Kaggle CSV with nulls)",
      "Produce a null audit table: column, null count, null %, and your decision for each",
      "Fix dtypes: dates parsed, categoricals converted; report memory before/after",
      "Write a single clean_data(df) function that takes raw and returns model-ready. This function is reusable for the rest of the 90 days."
    ],
    out: "src/clean.py with a tested clean_data() function."
  },
  qs: [
    { q: "loc vs iloc?",
      a: "loc selects by label and includes the end of a slice; iloc selects by integer position and excludes the end. loc respects the index, so it still works after filtering or sorting reorders rows." },
    { q: "How do you handle missing values?",
      a: "First diagnose the mechanism: MCAR, MAR, or MNAR. Then choose — drop if rare and random, impute with median/mode for numeric/categorical, use a model-based imputer if correlated, and crucially add a was_missing binary flag when missingness may itself be predictive. Always fit imputers on train only." }
  ],
  tags: ["pandas", "data-cleaning"]
},
{
  d: 4, w: 1, phase: "Foundations", track: "Python",
  title: "pandas II — groupby, merge, reshape",
  hook: "split -> apply -> combine. The pattern behind every analytics question.",
  why: "'Compute average revenue per user per month, ranked' is a real take-home line. It is one groupby chain if you are fluent and forty minutes of pain if you are not.",
  learn: [
    { h: "The split-apply-combine model",
      p: "groupby splits rows into buckets by key, applies a function to each bucket, and combines results back. .agg() for reductions, .transform() to broadcast a group result back onto every original row (perfect for 'value minus its group mean'), .apply() as the flexible slow escape hatch." },
    { h: "Joins are set operations on keys",
      p: "inner keeps matches, left keeps everything on the left, outer keeps all. Before every merge, check for duplicate keys — an unintended many-to-many join silently multiplies your row count and quietly corrupts every downstream metric. Always assert the shape after merging." },
    { h: "Long vs wide",
      p: "melt goes wide -> long, pivot/pivot_table goes long -> wide. Models want long/tidy: one row per observation, one column per variable. Humans and dashboards want wide. Knowing which direction you need is half the battle." },
    { h: "Window functions in pandas",
      p: "rolling() for moving averages, expanding() for cumulative, shift() for lags, and groupby().rank() for within-group ranking. These are also exactly the SQL window functions you will be asked about tomorrow — same concepts, two syntaxes." }
  ],
  cheat: {
    title: "pandas Card 2",
    pts: [
      "df.groupby('k')['v'].agg(['mean','count'])",
      "transform -> same shape back (group mean)",
      "agg -> collapsed shape (one row/group)",
      "pd.merge(a,b,on='id',how='left',validate='1:m')",
      "df.melt() wide->long | pivot_table long->wide",
      "df.sort_values('t').groupby('u')['v'].shift(1)",
      "ALWAYS assert len(df) after a merge"
    ],
    eq: ["df['dev'] = df.v - df.groupby('k').v.transform('mean')"],
    warn: "Duplicate join keys silently explode your rows. Pass validate='one_to_many' to pandas and let it scream instead of you debugging metrics at midnight."
  },
  vids: [
    { t: "Pandas groupby explained", ch: "Corey Schafer" },
    { t: "Pandas merge join concat tutorial", ch: "Data School" }
  ],
  lab: {
    t: "Answer 8 business questions with chains",
    steps: [
      "Take a transactions-style dataset (Kaggle: e-commerce, retail, or Olist)",
      "Write single-chain answers to: revenue per month, top 10 customers, average order value by category, month-over-month growth, customer cohort retention",
      "Use transform() at least once and a rolling window at least once",
      "Time-box yourself to 60 minutes. Speed here is the actual skill."
    ],
    out: "notebooks/04_groupby.ipynb, 8 questions answered."
  },
  qs: [
    { q: "agg vs transform vs apply?",
      a: "agg reduces each group to one value (shape shrinks). transform returns a result the same length as the group and broadcasts it back, so shape is preserved — used for group-relative features. apply is the general fallback that can return anything and is the slowest." },
    { q: "You merged two tables and row count grew. What happened?",
      a: "The join key is not unique on at least one side, producing a many-to-many cartesian expansion within key groups. Fix by deduplicating or aggregating the right table to one row per key first, and use validate= to catch it automatically." }
  ],
  tags: ["pandas", "groupby", "joins"]
},
{
  d: 5, w: 1, phase: "Foundations", track: "Data",
  title: "EDA & Visualisation Discipline",
  hook: "EDA is not making pretty charts. It is hunting for the thing that will break your model.",
  why: "In a take-home, the EDA section is where reviewers judge your thinking. Generic histograms of every column scores zero. A chart that reveals leakage, or a class imbalance, or a broken sensor, scores the interview.",
  learn: [
    { h: "EDA has a checklist, not a vibe",
      p: "Shape and dtypes. Target distribution. Missingness pattern. Cardinality of categoricals. Outliers and impossible values (negative ages, future dates). Correlation with the target. Duplicates. Time drift if there is a timestamp. Run it every single time." },
    { h: "Chart choice follows the question",
      p: "Distribution -> histogram/KDE. Comparison across categories -> bar or box. Relationship between two numerics -> scatter. Trend over time -> line. Composition -> stacked bar. If you cannot state the question the chart answers in one sentence, delete the chart." },
    { h: "Look for leakage during EDA",
      p: "A feature with suspiciously high correlation to the target is usually leakage, not luck. Ask: would this value actually exist at prediction time? A column like days_since_account_closed will predict churn perfectly and be useless in production." },
    { h: "Every chart needs a sentence",
      p: "Under each plot write what you concluded and what you will do about it. This turns a notebook into an analysis. Reviewers read those sentences, not your axes." }
  ],
  cheat: {
    title: "EDA Checklist",
    pts: [
      "1. shape, dtypes, head, describe",
      "2. target distribution (imbalanced?)",
      "3. nulls: count, %, pattern (heatmap)",
      "4. cardinality of every categorical",
      "5. impossible values / outliers",
      "6. corr with target -> LEAKAGE HUNT",
      "7. duplicates + time drift",
      "8. one sentence conclusion per chart"
    ],
    eq: ["df.corr(numeric_only=True)['target'].sort_values(ascending=False)"],
    warn: "Correlation ~0.97 with the target is a red flag, not a win. Ask if that feature exists at prediction time."
  },
  vids: [
    { t: "Exploratory data analysis with python", ch: "Rob Mulla" },
    { t: "Matplotlib and Seaborn tutorial", ch: "Corey Schafer" }
  ],
  lab: {
    t: "Write eda_report(df, target) once, use it for 90 days",
    steps: [
      "Build a reusable function that prints the 8-point checklist automatically",
      "Include a missingness heatmap and a target-correlation ranking",
      "Run it on two different datasets and confirm it does not crash on either",
      "Deliberately plant a leaky column in one dataset and confirm your report catches it"
    ],
    out: "src/eda.py — your permanent EDA tool."
  },
  qs: [
    { q: "What do you look for first in a new dataset?",
      a: "Target distribution and missingness, because both decide the modelling approach: imbalance changes metric and sampling strategy, missingness changes preprocessing. Then leakage candidates via target correlation, because that invalidates everything downstream." },
    { q: "How do you detect data leakage?",
      a: "Implausibly high single-feature correlation or AUC near 1.0; features whose value is only known after the outcome; and a train/test performance gap that inverts (test better than train) which suggests split contamination. The definitive test is asking whether the feature is available at inference time." }
  ],
  tags: ["eda", "visualisation", "leakage"]
},
{
  d: 6, w: 1, phase: "Foundations", track: "Data",
  title: "SQL That Actually Gets Asked",
  hook: "Window functions. That is the whole interview.",
  why: "Every data-adjacent co-op screens SQL, including ML engineering roles. The bar is consistently: joins, aggregation, and window functions. Candidates who freeze on ROW_NUMBER() get filtered before anyone reads their model code.",
  learn: [
    { h: "Order of execution, not order of writing",
      p: "SQL executes FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT. This explains why you cannot use a SELECT alias in WHERE but can in ORDER BY, and why filtering aggregates needs HAVING not WHERE. Interviewers love this question." },
    { h: "Joins are about key cardinality",
      p: "LEFT JOIN keeps unmatched left rows with NULLs — essential for 'customers with zero orders'. Watch the trap: putting a condition on the right table in WHERE turns a LEFT JOIN back into an INNER JOIN. Put it in the ON clause instead." },
    { h: "Window functions",
      p: "ROW_NUMBER/RANK/DENSE_RANK for top-N-per-group. LAG/LEAD for period-over-period change. SUM() OVER (PARTITION BY ... ORDER BY ...) for running totals. Unlike GROUP BY, windows keep every row while adding the aggregate alongside it." },
    { h: "The top-N-per-group pattern",
      p: "Memorise it cold: a CTE that computes ROW_NUMBER() OVER (PARTITION BY group ORDER BY metric DESC), then an outer query filtering rn <= N. This single pattern answers maybe a third of all SQL interview questions." }
  ],
  cheat: {
    title: "SQL Interview Card",
    pts: [
      "exec: FROM>WHERE>GROUP>HAVING>SELECT>ORDER",
      "WHERE filters rows, HAVING filters groups",
      "LEFT JOIN + right cond in WHERE = INNER (!!)",
      "ROW_NUMBER: 1,2,3  RANK: 1,1,3  DENSE: 1,1,2",
      "LAG(x,1) OVER(PARTITION BY u ORDER BY t)",
      "COUNT(*) counts NULLs, COUNT(col) does not",
      "top-N: CTE + row_number, outer WHERE rn<=N"
    ],
    eq: ["WITH r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY sal DESC) rn FROM emp) SELECT * FROM r WHERE rn<=3"],
    warn: "NULL != NULL. Use IS NULL. And NOT IN with a NULL in the subquery returns zero rows — always. Use NOT EXISTS."
  },
  vids: [
    { t: "SQL window functions explained", ch: "Alex The Analyst" },
    { t: "Advanced SQL interview questions", ch: "Data with Baraa" }
  ],
  lab: {
    t: "20 problems on StrataScratch or LeetCode SQL",
    steps: [
      "Do 10 medium problems focused on GROUP BY + HAVING + joins",
      "Do 10 problems that require window functions",
      "For every one you fail, write the pattern (not the answer) into notes/sql-patterns.md",
      "Re-solve the 3 hardest tomorrow from scratch"
    ],
    out: "notes/sql-patterns.md with 8-10 named reusable patterns."
  },
  qs: [
    { q: "RANK vs DENSE_RANK vs ROW_NUMBER?",
      a: "ROW_NUMBER always gives distinct sequential numbers even on ties. RANK gives ties the same number then skips (1,1,3). DENSE_RANK gives ties the same number without skipping (1,1,2). Use ROW_NUMBER for deduplication and top-N, RANK when gaps are meaningful." },
    { q: "Find the second highest salary.",
      a: "Safest general form: SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp) — returns NULL cleanly if there is no second value. The window form uses DENSE_RANK() = 2, which handles ties as a single logical rank." }
  ],
  tags: ["sql", "interview"]
},
{
  d: 7, w: 1, phase: "Foundations", track: "Review",
  title: "Week 1 Consolidation — Your First Real EDA",
  hook: "Ship something small and complete. Momentum compounds.",
  why: "A finished, well-written notebook is a portfolio asset. Six half-finished ones are not. This is also when you build the habit that carries all 90 days: every week ends with something committed.",
  learn: [
    { h: "Consolidation beats consumption",
      p: "Re-deriving a concept from memory strengthens recall far more than re-watching a video. Today you close the laptop and explain groupby, broadcasting, and window functions out loud, from nothing, before you look anything up." },
    { h: "Write for the reviewer, not for yourself",
      p: "Notebooks are read top to bottom by a stranger with three minutes. Lead with a summary of findings. Put the boring cleaning in a src/ module. Every chart gets a conclusion sentence." },
    { h: "Track your own weak points",
      p: "Keep notes/weak-spots.md. Anything you had to look up twice goes in it. In week 12 this file becomes your personalised revision list, and it will be far better targeted than any generic guide." }
  ],
  cheat: {
    title: "Weekly Ritual",
    pts: [
      "1. Re-explain 3 concepts w/o notes",
      "2. Finish + polish one notebook",
      "3. Push to GitHub w/ real commit msg",
      "4. Update weak-spots.md",
      "5. Write 3 lines in your journey log",
      "6. Rest. Seriously. Consolidation is sleep."
    ],
    eq: ["retrieval practice > re-reading, by a wide margin"],
    warn: "Do not start week 2 with an unfinished week 1 notebook. Debt compounds faster than knowledge."
  },
  vids: [
    { t: "How to build a data science portfolio", ch: "Ken Jee" }
  ],
  lab: {
    t: "Publish EDA #1",
    steps: [
      "Pick one dataset you find genuinely interesting (this matters for motivation)",
      "Full EDA using your own eda.py, 6-8 charts, each with a conclusion sentence",
      "Top of notebook: 'Key findings' — 5 bullets a manager could read",
      "README in the folder explaining the dataset, question, and findings",
      "Push. Then write your first journey-log entry in the site."
    ],
    out: "First portfolio-quality notebook on GitHub."
  },
  qs: [
    { q: "Walk me through how you explore a dataset you have never seen.",
      a: "Structured checklist: shape and dtypes, target distribution, missingness pattern and mechanism, cardinality of categoricals, impossible values, correlation scan for leakage, duplicates, and time drift. Then I form two or three hypotheses about what drives the target and test them with targeted plots rather than plotting everything." }
  ],
  tags: ["review", "portfolio"]
},

/* ---------- WEEK 2 : Math That Actually Matters ---------- */
{
  d: 8, w: 2, phase: "Foundations", track: "Math",
  title: "Linear Algebra I — Vectors & Dot Products",
  hook: "Every embedding, every similarity search, every attention score is a dot product.",
  why: "When you build RAG in week 11, 'why cosine similarity?' has a real answer rooted in today. Interviewers ask it constantly because it separates people who understand embeddings from people who called an API.",
  learn: [
    { h: "A vector is a point and a direction",
      p: "In ML a vector is almost always a list of features or a learned embedding. A 768-dim embedding is literally a point in 768-dimensional space, and 'similar meaning' becomes 'geometrically close'. That translation from meaning to geometry is the core trick of modern AI." },
    { h: "The dot product measures alignment",
      p: "a.b = |a||b|cos(theta). If vectors point the same way it is large and positive; perpendicular gives zero; opposite gives negative. Every neuron computes a dot product between inputs and weights, then applies a nonlinearity. That is the entire computational unit of deep learning." },
    { h: "Norms measure size",
      p: "L2 (euclidean) norm is the straight-line length and is what ridge regression penalises. L1 is the sum of absolute values, penalised by lasso, and it produces sparsity because its constraint region has corners on the axes. This geometric fact is why lasso zeroes coefficients and ridge does not." },
    { h: "Cosine similarity vs euclidean distance",
      p: "Cosine ignores magnitude and compares direction only — ideal for text embeddings where document length should not dominate meaning. Euclidean cares about magnitude. If your vectors are L2-normalised the two rank identically, which is why vector DBs normalise by default." }
  ],
  cheat: {
    title: "Vectors Card",
    pts: [
      "a.b = sum(a_i*b_i) = |a||b|cos(th)",
      "a.b > 0 same dir, =0 perp, <0 opposite",
      "L2 = sqrt(sum x^2)  -> ridge, circles",
      "L1 = sum|x|         -> lasso, diamonds",
      "cos_sim = a.b / (|a||b|)  in [-1,1]",
      "normalised vectors: cosine ~ euclidean",
      "neuron = dot(w,x) + b, then nonlinearity"
    ],
    eq: ["cos(a,b) = (a . b) / (||a|| * ||b||)"],
    warn: "L1 gives sparsity because its unit ball has CORNERS on the axes — the optimum lands on a corner where coefficients are exactly 0. Draw this. It is a favourite interview question."
  },
  vids: [
    { t: "Essence of linear algebra chapter 1 vectors", ch: "3Blue1Brown" },
    { t: "Dot products and duality", ch: "3Blue1Brown" }
  ],
  lab: {
    t: "Build a tiny semantic search by hand",
    steps: [
      "Take 20 sentences. Encode with sklearn TfidfVectorizer (no neural nets yet)",
      "Implement cosine similarity in pure NumPy — no library helper",
      "Query the set and return the top 3 matches",
      "Now compare against euclidean distance on unnormalised vectors and explain, in writing, why results differ"
    ],
    out: "notebooks/08_vectors.ipynb — your first retrieval system."
  },
  qs: [
    { q: "Why cosine similarity for text embeddings instead of euclidean?",
      a: "Cosine measures direction only, so it is invariant to vector magnitude. Document length and token count inflate magnitude without changing meaning, so euclidean would call a long and short document about the same topic dissimilar. On L2-normalised vectors the two give identical rankings, since euclidean distance becomes a monotonic function of cosine." },
    { q: "Why does L1 regularisation produce sparse weights but L2 does not?",
      a: "Geometrically, the L1 constraint region is a diamond with vertices on the axes, so the loss contours are most likely to first touch it at a corner where some coefficients are exactly zero. L2's region is a smooth sphere with no corners, so it shrinks coefficients toward zero without reaching it." }
  ],
  tags: ["linear-algebra", "embeddings", "similarity"]
},
{
  d: 9, w: 2, phase: "Foundations", track: "Math",
  title: "Linear Algebra II — Matrices, Rank, SVD",
  hook: "A matrix is a function that moves space.",
  why: "Matrix multiply shape rules are the #1 source of PyTorch errors. Rank and SVD are the mathematical core of PCA, of LoRA fine-tuning in week 9, and of recommender systems.",
  learn: [
    { h: "Matrix multiplication is composition of transformations",
      p: "Ax transforms vector x. AB means apply B first, then A. Shapes must chain: (m,n)(n,p) -> (m,p). The inner dimensions must match and they vanish. Say 'inner must match, outer survives' until it is automatic — this saves hours of debugging later." },
    { h: "Rank = how much information survives",
      p: "Rank is the number of linearly independent columns, i.e. the dimensionality of the output space. A low-rank matrix squashes space onto a lower-dimensional subspace, losing information irreversibly. Multicollinearity in regression is exactly rank deficiency, which is why the closed-form solution blows up." },
    { h: "SVD decomposes any matrix into rotate-stretch-rotate",
      p: "A = U S V^T for literally any matrix. The singular values in S rank how important each direction is. Keep the top k and you get the best possible rank-k approximation of A — this single fact powers PCA, image compression, latent-factor recommenders, and LoRA." },
    { h: "Eigenvectors are the directions that do not turn",
      p: "Av = lambda*v means v only gets scaled, not rotated. The eigenvectors of a covariance matrix are the principal components, and their eigenvalues are the variance explained. That is PCA in one sentence — we will implement it on day 30." }
  ],
  cheat: {
    title: "Matrix Card",
    pts: [
      "(m,n) @ (n,p) -> (m,p)  inner match, dies",
      "AB != BA  (order = order of ops)",
      "rank = # independent cols = info kept",
      "full rank -> invertible -> unique solution",
      "SVD: A = U S V^T  (ANY matrix)",
      "top-k singular vals = best rank-k approx",
      "Av = lambda v -> v direction unchanged",
      "cov eigenvectors = principal components"
    ],
    eq: ["A = U S V^T  ;  A_k = U[:, :k] S[:k,:k] V[:k, :]^T"],
    warn: "Multicollinearity = near rank-deficient X^T X = unstable, huge, sign-flipping coefficients. It hurts interpretation badly but often barely hurts prediction. Know that distinction."
  },
  vids: [
    { t: "Essence of linear algebra matrix multiplication as composition", ch: "3Blue1Brown" },
    { t: "Singular value decomposition SVD visually explained", ch: "Visual Kernel" }
  ],
  lab: {
    t: "Compress an image with SVD",
    steps: [
      "Load a greyscale image as a matrix with NumPy",
      "Run np.linalg.svd and reconstruct using the top k singular values for k in [5, 20, 50, 200]",
      "Plot reconstruction vs k and compute the compression ratio for each",
      "Plot the singular-value spectrum and note where it collapses — that elbow is the intrinsic dimensionality"
    ],
    out: "A visual, intuitive grasp of low-rank approximation you will reuse for PCA and LoRA."
  },
  qs: [
    { q: "What is the rank of a matrix and why does it matter in ML?",
      a: "Rank is the number of linearly independent columns — the true dimensionality of the information. It matters because rank-deficient feature matrices make X^T X singular, so ordinary least squares has no unique solution and coefficients become unstable. Regularisation fixes this by adding lambda*I, guaranteeing invertibility." },
    { q: "How does SVD relate to PCA?",
      a: "PCA finds eigenvectors of the covariance matrix. Running SVD on the mean-centred data matrix gives those same directions directly in V, with singular values squared and divided by n-1 giving the explained variances. SVD is preferred in practice because it is numerically more stable than forming the covariance matrix explicitly." }
  ],
  tags: ["linear-algebra", "svd", "pca"]
},
{
  d: 10, w: 2, phase: "Foundations", track: "Math",
  title: "Calculus for ML — Gradients & the Chain Rule",
  hook: "Backpropagation is the chain rule. That is the whole secret.",
  why: "If you can explain backprop as repeated chain rule on a computation graph, you are ahead of most co-op candidates who can only say 'the gradients flow backwards'.",
  learn: [
    { h: "The derivative is a sensitivity",
      p: "dL/dw answers: if I nudge w up by a tiny amount, how much does the loss change, and in which direction? That is all a gradient is — a list of sensitivities, one per parameter. Training just repeatedly steps every parameter in the direction that reduces loss." },
    { h: "The gradient points uphill",
      p: "The gradient vector points in the direction of steepest increase, so we step in the NEGATIVE gradient direction to descend. Its magnitude tells you how steep the slope is, which is why gradients vanishing to near-zero means learning stalls." },
    { h: "The chain rule composes local derivatives",
      p: "If L depends on a which depends on w, then dL/dw = dL/da * da/dw. Deep networks are just deeply nested functions, so their gradients are long products of local derivatives. Multiply many numbers below 1 and you get vanishing gradients; many above 1 and you get exploding gradients. Both problems fall straight out of this." },
    { h: "Computation graphs make it mechanical",
      p: "Represent the forward pass as a graph of simple operations. Each node knows how to compute its local derivative. Backprop is one reverse pass accumulating products along edges. This is exactly what PyTorch autograd does, and you will implement a tiny version on day 36." }
  ],
  cheat: {
    title: "Calculus Card",
    pts: [
      "grad = vector of partial derivatives",
      "grad points UPHILL -> step NEGATIVE",
      "chain: dL/dw = dL/da * da/dw",
      "deep net = nested fns = long product",
      "many <1 factors -> vanishing gradient",
      "many >1 factors -> exploding gradient",
      "d/dx sigmoid = s(1-s), max 0.25 (!!)",
      "d/dx relu = 1 if x>0 else 0  (no decay)"
    ],
    eq: ["w := w - eta * dL/dw"],
    warn: "Sigmoid's derivative peaks at 0.25, so stacking 10 sigmoid layers multiplies gradients by <=0.25^10 ~ 1e-6. THAT is why ReLU replaced sigmoid in hidden layers. This is a top-tier interview answer."
  },
  vids: [
    { t: "What is backpropagation really doing", ch: "3Blue1Brown" },
    { t: "Backpropagation calculus", ch: "3Blue1Brown" }
  ],
  lab: {
    t: "Hand-derive and verify",
    steps: [
      "On paper, derive dL/dw for L = (y - wx - b)^2. Then for logistic loss with sigmoid",
      "Verify numerically: compare your analytic gradient against (L(w+h)-L(w-h))/(2h) with h=1e-5",
      "Confirm they match to ~6 decimal places. This is 'gradient checking', a real debugging technique",
      "Write down why the central difference is more accurate than the forward difference"
    ],
    out: "Analytic gradients you derived and verified yourself."
  },
  qs: [
    { q: "Explain backpropagation.",
      a: "It is reverse-mode automatic differentiation. The forward pass builds a computation graph and caches intermediates. The backward pass starts from the loss and applies the chain rule node by node, multiplying each node's local derivative by the gradient flowing in from above. Reverse mode is used because we have one scalar output and millions of parameters, so computing all gradients costs roughly one extra forward pass." },
    { q: "Why do vanishing gradients happen and how do you fix them?",
      a: "Gradients are products of many per-layer derivatives; if those are consistently below 1 the product decays exponentially with depth and early layers stop learning. Fixes: ReLU-family activations whose derivative is 1 for positive inputs, residual/skip connections that give gradients an unimpeded path, careful initialisation like He or Xavier, and normalisation layers." }
  ],
  tags: ["calculus", "backprop", "gradients"]
},
{
  d: 11, w: 2, phase: "Foundations", track: "Math",
  title: "Gradient Descent From Scratch",
  hook: "Write the optimiser yourself once and you will never be confused by one again.",
  why: "Learning rate is the single most impactful hyperparameter in deep learning. Understanding batch vs mini-batch vs stochastic tradeoffs is asked in essentially every ML interview.",
  learn: [
    { h: "The algorithm is four lines",
      p: "Initialise parameters. Compute predictions. Compute the gradient of the loss with respect to parameters. Step against the gradient. Repeat until convergence. Everything else in optimisation is a refinement of the step." },
    { h: "Learning rate is a tightrope",
      p: "Too small and training crawls or stalls in a flat region. Too large and you overshoot the minimum and diverge to NaN. The practical method is a learning-rate range test: increase lr exponentially over a few hundred steps, plot loss, and pick roughly one order of magnitude below where it explodes." },
    { h: "Batch vs mini-batch vs stochastic",
      p: "Full-batch gives an exact gradient but one slow step per epoch. Stochastic (one sample) is fast and noisy. Mini-batch (32-256) is the practical middle: accurate enough, GPU-efficient, and the noise itself helps escape sharp minima. Larger batches usually need a proportionally larger learning rate." },
    { h: "Momentum and adaptive methods",
      p: "Momentum accumulates a velocity so you power through small bumps and dampen oscillation across narrow valleys. Adam adds per-parameter adaptive step sizes based on running estimates of gradient mean and variance. Adam is the safe default; well-tuned SGD with momentum often generalises slightly better in vision." }
  ],
  cheat: {
    title: "Gradient Descent Card",
    pts: [
      "w := w - eta * grad(L)",
      "eta too big -> diverge/NaN",
      "eta too small -> crawl, stuck",
      "batch=all: exact, slow | SGD=1: noisy, fast",
      "mini-batch 32-256: the real-world answer",
      "momentum: v=beta*v+g ; w-=eta*v",
      "Adam = momentum + per-param adaptive lr",
      "loss NaN? lower lr first, always"
    ],
    eq: ["v_t = b*v_{t-1} + (1-b)*g_t   ;   w -= eta * v_t"],
    warn: "If your loss goes to NaN, 90% of the time it is the learning rate. Divide by 10 before you touch anything else in the architecture."
  },
  vids: [
    { t: "Gradient descent how neural networks learn", ch: "3Blue1Brown" },
    { t: "Adam optimizer explained", ch: "DeepBean" }
  ],
  lab: {
    t: "Implement three optimisers in NumPy",
    steps: [
      "Implement vanilla GD, GD+momentum, and Adam — no autograd, hand-derived gradients",
      "Fit a linear regression with each; plot loss curves on the same axes",
      "Run a learning-rate sweep [1e-5 .. 1e0] and plot final loss vs lr on a log axis",
      "Identify the divergence threshold and note it — you have just done an LR range test"
    ],
    out: "src/optimizers.py + a loss-curve plot you understand completely."
  },
  qs: [
    { q: "Batch vs stochastic vs mini-batch gradient descent?",
      a: "Batch uses the whole dataset per step: exact gradient, expensive, one update per epoch. Stochastic uses one sample: very noisy but fast updates and the noise can escape poor minima. Mini-batch uses 32-256 samples, balancing gradient quality with GPU parallelism, and is what everyone actually uses." },
    { q: "Why does Adam usually converge faster than SGD?",
      a: "Adam maintains per-parameter running averages of the gradient (first moment) and its square (second moment), then divides the step by the square root of the second moment. Parameters with consistently small or noisy gradients get relatively larger steps, so it adapts without manual tuning. The tradeoff is that it sometimes generalises slightly worse than well-tuned SGD with momentum." }
  ],
  tags: ["optimisation", "gradient-descent", "adam"]
},
{
  d: 12, w: 2, phase: "Foundations", track: "Math",
  title: "Probability — Distributions & Bayes",
  hook: "Every classifier outputs a probability. Do you know what it means?",
  why: "Bayes questions appear in interviews at every level, usually disguised as the medical-test puzzle. Understanding distributions tells you which loss function and which model assumptions are appropriate.",
  learn: [
    { h: "The distributions you must know cold",
      p: "Bernoulli (single yes/no), Binomial (count of successes), Normal (sums of many small effects, via CLT), Poisson (rare events per interval), Exponential (waiting time between events), Uniform. Recognising which one generated your data drives your modelling choice." },
    { h: "Bayes theorem inverts conditional probability",
      p: "P(A|B) = P(B|A)P(A)/P(B). It converts 'probability of evidence given hypothesis' into 'probability of hypothesis given evidence'. The base rate P(A) is what everyone forgets, and forgetting it is exactly what the classic interview puzzle tests." },
    { h: "Expectation and variance",
      p: "E[X] is the long-run average; Var(X) is the average squared deviation. Key identities: E[aX+b] = aE[X]+b, Var(aX+b) = a^2 Var(X), and for independent variables variances add. That last fact is why averaging n independent models reduces variance by 1/n — the mathematical basis of bagging." },
    { h: "Independence and conditional independence",
      p: "Naive Bayes assumes features are conditionally independent given the class. This is nearly always false, yet the classifier often works well because argmax only needs the ranking to be right, not the probabilities to be calibrated. Being able to say that is a strong interview answer." }
  ],
  cheat: {
    title: "Probability Card",
    pts: [
      "P(A|B) = P(B|A)P(A) / P(B)",
      "P(B) = P(B|A)P(A) + P(B|~A)P(~A)",
      "BASE RATE is what everyone forgets",
      "E[aX+b]=aE[X]+b ; Var(aX+b)=a^2Var(X)",
      "indep: Var(X+Y)=Var(X)+Var(Y)",
      "mean of n indep -> var/n  (= bagging!)",
      "CLT: sums -> normal, whatever the source"
    ],
    eq: ["P(disease|+) = P(+|d)P(d) / [P(+|d)P(d) + P(+|~d)P(~d)]"],
    warn: "The classic trap: 99% accurate test, 0.1% prevalence -> a positive result means only ~9% chance of disease. Rare base rates dominate. Expect this question."
  },
  vids: [
    { t: "Bayes theorem the geometry of changing beliefs", ch: "3Blue1Brown" },
    { t: "Statistics fundamentals probability distributions", ch: "StatQuest" }
  ],
  lab: {
    t: "Simulate your way to intuition",
    steps: [
      "Simulate the medical-test problem 100,000 times with NumPy; confirm the ~9% answer empirically",
      "Demonstrate CLT: sample means from a wildly skewed distribution, show they become normal as n grows",
      "Show empirically that averaging k independent noisy predictors reduces variance by ~1/k",
      "Write one paragraph connecting that last result to random forests"
    ],
    out: "notebooks/12_probability.ipynb — intuition earned, not memorised."
  },
  qs: [
    { q: "A test is 99% accurate for a disease affecting 0.1% of people. You test positive. What is the probability you have it?",
      a: "Roughly 9%. P(d|+) = (0.99 * 0.001) / (0.99*0.001 + 0.01*0.999) = 0.00099/0.01098 ~ 0.090. The false positives from the huge healthy population overwhelm the true positives from the tiny sick population. The lesson is that base rate dominates when prevalence is low." },
    { q: "Why is Naive Bayes 'naive', and why does it still work?",
      a: "It assumes all features are conditionally independent given the class, which is essentially never true — words in text are highly correlated. It still works because classification only needs the correct argmax, not calibrated probabilities. The dependence distorts the magnitudes but often preserves the ordering between classes." }
  ],
  tags: ["probability", "bayes", "distributions"]
},
{
  d: 13, w: 2, phase: "Foundations", track: "Stats",
  title: "Statistics — Sampling, CIs, Hypothesis Tests",
  hook: "The vocabulary of every data-science interview.",
  why: "A/B testing questions are guaranteed in DS-flavoured co-ops, and increasingly asked of ML engineers too (you will be asked to prove your model actually improved something). p-values are also the most commonly misexplained concept in interviews — getting it right stands out.",
  learn: [
    { h: "Sampling distributions and standard error",
      p: "A statistic computed from a sample is itself random. Its distribution across hypothetical repeated samples is the sampling distribution, and its standard deviation is the standard error, SE = sigma/sqrt(n). Note the sqrt: quadrupling your sample size only halves your uncertainty. That is why experiments need so much traffic." },
    { h: "Confidence intervals",
      p: "A 95% CI is a procedure that captures the true parameter 95% of the time across repeated experiments. It is NOT '95% probability the parameter is in this interval' — the parameter is fixed, the interval is random. Interviewers do check this distinction." },
    { h: "Hypothesis testing logic",
      p: "Assume the null (no effect). Compute how extreme your observed data would be under that assumption. The p-value is P(data this extreme or more | null true). A small p-value means the data is surprising under the null. It is NOT the probability the null is true." },
    { h: "Errors and power",
      p: "Type I (alpha) is a false positive — declaring an effect that is not there. Type II (beta) is a false negative. Power = 1-beta is the chance of detecting a real effect, conventionally targeted at 80%. Power rises with sample size and effect size, and falls with variance." }
  ],
  cheat: {
    title: "Stats Card",
    pts: [
      "SE = sigma/sqrt(n)  -> 4x data = 2x precision",
      "95% CI = est +/- 1.96*SE",
      "p = P(data this extreme | H0 TRUE)",
      "p is NOT P(H0 true). Ever.",
      "Type I = false positive = alpha",
      "Type II = false negative = beta",
      "power = 1-beta, aim 80%",
      "many tests -> Bonferroni / FDR correct"
    ],
    eq: ["n per arm ~ 16 * sigma^2 / delta^2   (80% power, alpha .05)"],
    warn: "Peeking at an A/B test daily and stopping when p<0.05 inflates your false positive rate to ~30%+. Fix the sample size in advance or use a sequential test."
  },
  vids: [
    { t: "p-values clearly explained", ch: "StatQuest" },
    { t: "Statistical power and sample size", ch: "StatQuest" }
  ],
  lab: {
    t: "Prove p-hacking is real",
    steps: [
      "Simulate an A/B test with NO true effect; run it 1000 times; confirm ~5% give p<0.05",
      "Now simulate 'peeking': check daily and stop early if p<0.05. Measure the new false-positive rate",
      "Write a sample-size calculator function given baseline rate, MDE, alpha, power",
      "Use it to answer: how much traffic to detect a 2% lift on a 10% baseline conversion rate?"
    ],
    out: "src/ab_test.py — a calculator you can demo in an interview."
  },
  qs: [
    { q: "Explain a p-value to a non-technical stakeholder.",
      a: "It is how surprising our result would be if the change actually did nothing. A p-value of 0.03 means that if the new version were truly identical to the old, we would see a difference this large only 3% of the time by pure chance. It is evidence against 'no effect', not the probability that our change works." },
    { q: "Your A/B test shows p=0.04 after 3 days. Ship it?",
      a: "Not on that alone. I would check whether the sample size was fixed in advance — if we have been peeking, the effective false positive rate is far above 5%. I would also check whether we hit the pre-registered duration to cover weekly seasonality, whether the effect size is above the minimum detectable effect we cared about commercially, and whether guardrail metrics regressed." }
  ],
  tags: ["statistics", "ab-testing", "interview"]
},
{
  d: 14, w: 2, phase: "Foundations", track: "Review",
  title: "Week 2 Build — Linear Regression From Scratch + Resume v1",
  hook: "The single highest-leverage exercise in all of ML.",
  why: "Implementing linear regression end to end from raw math forces every week-2 concept to become concrete. And today interview prep officially begins: resume v1 goes out, because applications open long before you feel ready.",
  learn: [
    { h: "Two solutions, two lessons",
      p: "The closed form (X^T X)^-1 X^T y is exact but requires an invertible matrix and O(d^3) time — infeasible above a few thousand features. Gradient descent is approximate, scales to any size, and generalises to models with no closed form at all. Knowing when each applies is a real interview question." },
    { h: "Your model is only as honest as your evaluation",
      p: "Fit on train, evaluate on held-out test, report R^2 and RMSE, and plot residuals. If residuals show structure (a curve, a fan shape), your model is missing something systematic — that plot tells you more than any single metric." },
    { h: "Resume v1 today, not in week 12",
      p: "Co-op timelines move faster than you expect and applications open early. A resume with two solid projects submitted in week 2 beats a perfect resume submitted after the deadline. You will iterate it every two weeks as projects ship." }
  ],
  cheat: {
    title: "Linear Regression Card",
    pts: [
      "y_hat = Xw + b",
      "MSE = (1/n) sum (y - y_hat)^2",
      "closed form: w = (X^T X)^-1 X^T y",
      "GD: w -= eta * (2/n) X^T (Xw - y)",
      "R^2 = 1 - SS_res/SS_tot",
      "resid plot flat+random = good model",
      "resid curve/fan = missing signal / heterosced."
    ],
    eq: ["dMSE/dw = (2/n) * X^T (Xw - y)"],
    warn: "Standardise features BEFORE gradient descent. Unscaled features make the loss surface a long thin valley and GD zigzags forever."
  },
  vids: [
    { t: "Linear regression clearly explained", ch: "StatQuest" },
    { t: "Resume tips for software engineering internships", ch: "Jeff Su" }
  ],
  lab: {
    t: "LinearRegression, written by you",
    steps: [
      "Write a class with fit/predict, supporting both 'closed_form' and 'gradient_descent' modes",
      "Validate against sklearn's LinearRegression — coefficients should match to ~4 decimals",
      "Add L2 regularisation (ridge) and show it stabilises coefficients on collinear features",
      "THEN: write resume v1. One line per project: what, how, measurable result. Use numbers.",
      "Get it reviewed — NEU career services, a senior, or post it for feedback"
    ],
    out: "src/linreg.py matching sklearn + resume v1 in circulation."
  },
  qs: [
    { q: "When would you use the normal equation vs gradient descent?",
      a: "Normal equation when features number in the low thousands or fewer and X^T X is well-conditioned — it is exact and needs no learning rate. Gradient descent when the feature count or dataset is large, because inverting a d x d matrix is O(d^3), or when the model has no closed-form solution at all, which is every neural network." },
    { q: "What are the assumptions of linear regression?",
      a: "Linearity in parameters, independent errors, homoscedasticity (constant error variance), normally distributed errors (needed for inference, not for point prediction), and no perfect multicollinearity. Violations mostly damage your confidence intervals and coefficient interpretation rather than raw predictive accuracy." }
  ],
  tags: ["linear-regression", "from-scratch", "resume"]
},

/* ---------- WEEK 3 : Supervised ML Core ---------- */
{
  d: 15, w: 3, phase: "Classical ML", track: "ML",
  title: "Framing an ML Problem (and Not Fooling Yourself)",
  hook: "Most failed ML projects failed at framing, not modelling.",
  why: "The most common senior-level interview question is 'a stakeholder asks for X — how do you approach it?'. They are testing framing, not algorithms. This day is worth more than any single model.",
  learn: [
    { h: "From business question to ML problem",
      p: "'Reduce churn' is not an ML problem. 'Predict probability a subscriber cancels within 30 days, so retention can target the top 5% with an offer' is. You must define the target, the prediction time, the population, the horizon, and the action the prediction triggers. If no decision changes, do not build the model." },
    { h: "The split must mirror deployment",
      p: "Random splits are only valid when rows are exchangeable. Time-series needs a chronological split. Data with repeated users needs a grouped split so the same user cannot be in train and test. Get this wrong and your offline metrics will be beautiful and completely fake." },
    { h: "Leakage: the silent killer",
      p: "Target leakage means a feature encodes the future. Train-test contamination means information crossed the split — scaling on the full dataset, imputing before splitting, or oversampling before cross-validation. Rule: every fitted transformation learns from train only, inside a pipeline." },
    { h: "Baselines before models",
      p: "Always establish a trivial baseline: predict the majority class, or the mean, or last week's value. If your gradient-boosted ensemble beats it by 1%, you have learned something important about the problem's difficulty. Reporting a model without a baseline is meaningless." }
  ],
  cheat: {
    title: "Problem Framing Card",
    pts: [
      "define: target, population, horizon, ACTION",
      "no decision changes -> no model needed",
      "split mirrors deployment (time? group?)",
      "fit transforms on TRAIN only, in a Pipeline",
      "baseline first: majority / mean / last value",
      "choose metric from the COST of errors",
      "ask: is this feature available at inference?"
    ],
    eq: ["value = P(model right) x (cost of error avoided) - cost to build/serve"],
    warn: "Oversampling (SMOTE) before cross-validation copies minority samples across the fold boundary. Your CV score becomes fiction. Resample INSIDE each fold."
  },
  vids: [
    { t: "How to frame a machine learning problem", ch: "Data Professor" },
    { t: "Data leakage in machine learning", ch: "Chai Time Data Science" }
  ],
  lab: {
    t: "Write framing docs for 3 problems",
    steps: [
      "Pick 3 realistic problems: churn prediction, fraud detection, delivery-time estimation",
      "For each write: target definition, prediction timestamp, population, horizon, action taken, metric and why, split strategy, and 3 leakage risks",
      "Half a page each. This document IS the interview answer.",
      "Keep in notes/framing/ — reread before every interview"
    ],
    out: "3 framing docs — your best interview prep artefact so far."
  },
  qs: [
    { q: "A PM says 'use ML to reduce customer churn.' What do you ask?",
      a: "What does churn mean precisely and over what horizon. When do we need the prediction, and what action follows it — because if retention can only contact 500 users a week, this is a ranking problem where precision@500 matters, not overall accuracy. What data exists at that prediction time. What is the current baseline process. And what is the value of a retained customer versus the cost of an incentive, since that sets the decision threshold." },
    { q: "How would you split data for a model predicting next month's sales?",
      a: "Chronologically, never randomly. Train on earlier periods, validate on later ones, using rolling or expanding-window cross-validation. A random split lets the model see the future, which inflates scores and hides the fact that relationships drift over time." }
  ],
  tags: ["problem-framing", "leakage", "interview"]
},
{
  d: 16, w: 3, phase: "Classical ML", track: "ML",
  title: "Linear Regression, Properly",
  hook: "The model you will be asked to explain more than any other.",
  why: "It is the reference point for every conversation about interpretability, assumptions, and regularisation. Interviewers use it to test depth because everyone claims to know it.",
  learn: [
    { h: "Interpreting coefficients honestly",
      p: "A coefficient is the expected change in y for a one-unit change in that feature, HOLDING ALL OTHERS CONSTANT. That clause matters enormously: with correlated features, holding others constant may be physically impossible, which makes the coefficient meaningless as a causal statement. Regression coefficients are not causal effects." },
    { h: "Scaling changes interpretation, not fit",
      p: "Standardising features leaves predictions and R^2 identical but makes coefficients comparable as effect sizes. It is mandatory for regularised models, because otherwise the penalty unfairly punishes features that happen to be measured in small units." },
    { h: "Residual diagnostics",
      p: "Plot residuals against fitted values. Random scatter is healthy. A curve means you need nonlinear terms. A fan shape means heteroscedasticity, so consider a log transform of the target. A Q-Q plot checks normality of errors, which matters for confidence intervals." },
    { h: "R^2 and its traps",
      p: "R^2 is the proportion of variance explained but never decreases when you add features, even random ones. Adjusted R^2 penalises complexity. And a high R^2 on training data says nothing about generalisation — always report the test-set number." }
  ],
  cheat: {
    title: "Regression Card",
    pts: [
      "coef = dY per unit X, OTHERS HELD FIXED",
      "coef != causal effect. Ever.",
      "scaling: same fit, comparable coefs",
      "R^2 never decreases w/ more features",
      "adj R^2 penalises params",
      "resid curve -> add nonlinear term",
      "resid fan -> log(y) or use weights",
      "VIF > 10 -> serious multicollinearity"
    ],
    eq: ["R^2_adj = 1 - (1-R^2)(n-1)/(n-p-1)"],
    warn: "Log-transforming the target changes the interpretation: coefficients become approximate PERCENT changes. Say that out loud in interviews; most candidates miss it."
  },
  vids: [
    { t: "Linear regression assumptions and diagnostics", ch: "StatQuest" },
    { t: "Multicollinearity explained VIF", ch: "zedstatistics" }
  ],
  lab: {
    t: "Full regression analysis",
    steps: [
      "Use a housing or bike-sharing dataset",
      "Fit, then produce residual plot, Q-Q plot, and VIF table",
      "Find at least one assumption violation and fix it (transform, add a term, drop a collinear feature)",
      "Report before/after test RMSE and write 3 sentences interpreting your top 3 coefficients correctly"
    ],
    out: "notebooks/16_regression.ipynb with real diagnostics, not just .fit()."
  },
  qs: [
    { q: "Your model has R^2 = 0.95 on train and 0.42 on test. Diagnosis?",
      a: "Severe overfitting. Likely causes: too many features relative to sample size, high-degree polynomial terms, or unregularised fitting of noise. Remedies: add L1/L2 regularisation, reduce feature count, gather more data, and verify no train/test distribution shift or improper split is contributing." },
    { q: "Two features are highly correlated. What happens and does it matter?",
      a: "The coefficient estimates become unstable with inflated standard errors, and their signs can flip with small data changes, because the model cannot attribute shared variance. It seriously harms interpretation. It usually barely harms prediction accuracy, so if the goal is pure prediction it may be acceptable; if the goal is inference, drop one, combine them, or use ridge." }
  ],
  tags: ["regression", "diagnostics", "interpretation"]
},
{
  d: 17, w: 3, phase: "Classical ML", track: "ML",
  title: "Bias-Variance & Regularisation",
  hook: "The single most important conceptual framework in classical ML.",
  why: "This is asked in essentially every ML interview, and it also gives you a systematic debugging procedure: when a model underperforms, diagnosing bias vs variance tells you exactly what to try next.",
  learn: [
    { h: "The decomposition",
      p: "Expected test error = bias^2 + variance + irreducible noise. Bias is systematic error from wrong assumptions (too simple). Variance is sensitivity to the particular training sample (too flexible). Noise is the floor you cannot beat. You trade the first two against each other." },
    { h: "Diagnosing from learning curves",
      p: "Plot train and validation error against training-set size. High error on both, converged and close together = high bias, so add capacity or features. Low train error with a large persistent gap = high variance, so add data or regularisation. This is a debugging procedure, not just theory." },
    { h: "Ridge, Lasso, Elastic Net",
      p: "Ridge (L2) shrinks all coefficients smoothly and handles correlated features by splitting weight between them. Lasso (L1) drives some exactly to zero, giving automatic feature selection, but picks arbitrarily among correlated features. Elastic Net mixes both and is the pragmatic default when you have many correlated predictors." },
    { h: "Regularisation is a prior",
      p: "Ridge is equivalent to a Gaussian prior on weights; lasso to a Laplace prior. You are telling the model 'large coefficients are implausible unless the data strongly insists'. That framing is a strong, memorable interview answer." }
  ],
  cheat: {
    title: "Bias-Variance Card",
    pts: [
      "err = bias^2 + variance + noise",
      "high bias: train err HIGH, gap small",
      "high var: train err LOW, gap BIG",
      "bias fix: bigger model, more features",
      "var fix: more data, regularise, simplify",
      "ridge L2: shrink all, keep correlated",
      "lasso L1: zero some, auto-select",
      "elastic net: both, alpha mixes"
    ],
    eq: ["Ridge: min ||y-Xw||^2 + lambda||w||_2^2    Lasso: + lambda||w||_1"],
    warn: "More data fixes VARIANCE, not BIAS. If your model is underfitting, collecting another million rows changes nothing. Know which problem you have before you spend money."
  },
  vids: [
    { t: "Bias variance tradeoff clearly explained", ch: "StatQuest" },
    { t: "Ridge lasso regularization", ch: "StatQuest" }
  ],
  lab: {
    t: "See the tradeoff with your own eyes",
    steps: [
      "Fit polynomial regression degree 1..15 on a small noisy dataset",
      "Plot train and test error vs degree; find the U-shape and the optimum",
      "Now add ridge with increasing lambda at degree 15 and watch test error recover",
      "Plot the coefficient paths for ridge and lasso as lambda varies — see lasso hit exact zeros"
    ],
    out: "The two canonical plots of classical ML, generated by you."
  },
  qs: [
    { q: "Explain the bias-variance tradeoff.",
      a: "Test error decomposes into bias squared, variance, and irreducible noise. Bias is error from overly simple assumptions; variance is error from over-sensitivity to the training sample. Increasing model complexity lowers bias but raises variance, so there is an optimum in the middle. In practice I diagnose which dominates from learning curves before deciding what to change." },
    { q: "When would you pick lasso over ridge?",
      a: "When I want automatic feature selection or believe most features are irrelevant, since lasso drives coefficients exactly to zero and yields a sparse interpretable model. Ridge is better when features are correlated and all plausibly matter, because lasso arbitrarily keeps one of a correlated group. Elastic Net when both conditions hold." }
  ],
  tags: ["bias-variance", "regularisation", "interview"]
},
{
  d: 18, w: 3, phase: "Classical ML", track: "ML",
  title: "Logistic Regression & Decision Boundaries",
  hook: "Still the production baseline at most companies. There is a reason.",
  why: "Fast, interpretable, calibrated, and hard to beat on tabular data with good features. Interviewers ask 'why is it called regression if it classifies?' to see if you actually understand it.",
  learn: [
    { h: "It models log-odds linearly",
      p: "log(p/(1-p)) = w.x + b. The linear part lives in log-odds space; the sigmoid squashes it into [0,1]. That is why it is called regression — it regresses the log-odds. A coefficient means: a one-unit increase multiplies the ODDS by e^w." },
    { h: "Why cross-entropy, not MSE",
      p: "MSE with a sigmoid gives a non-convex loss with flat regions where gradients vanish. Cross-entropy is convex in the parameters and its gradient simplifies beautifully to (y_hat - y)x, so learning stays strong exactly when predictions are confidently wrong. This is a great interview answer." },
    { h: "The decision boundary is linear",
      p: "The boundary is where w.x + b = 0 — a line, plane, or hyperplane. Logistic regression cannot solve XOR without feature engineering. Adding interaction or polynomial features gives you nonlinear boundaries while keeping the model linear in parameters." },
    { h: "Threshold is a business decision",
      p: "The model outputs a probability; 0.5 is an arbitrary default. Choose the threshold from the relative cost of false positives and false negatives. For fraud detection you might use 0.05. Tuning the threshold is free performance that most candidates forget to mention." }
  ],
  cheat: {
    title: "Logistic Regression Card",
    pts: [
      "log(p/(1-p)) = w.x + b",
      "p = sigmoid(z) = 1/(1+e^-z)",
      "coef w -> odds multiply by e^w",
      "loss = -[y log p + (1-y) log(1-p)]",
      "grad = (p - y) * x   <- beautifully simple",
      "boundary is LINEAR (add feats for curves)",
      "0.5 threshold is arbitrary. Tune it."
    ],
    eq: ["dL/dw = (sigmoid(w.x+b) - y) * x"],
    warn: "Perfectly separable data makes coefficients diverge to infinity. Regularisation is not optional there — sklearn applies L2 by default for exactly this reason."
  },
  vids: [
    { t: "Logistic regression clearly explained", ch: "StatQuest" },
    { t: "Why we use cross entropy loss", ch: "Aurelien Geron" }
  ],
  lab: {
    t: "Logistic regression from scratch + threshold tuning",
    steps: [
      "Implement it in NumPy with cross-entropy and gradient descent; match sklearn",
      "Plot the decision boundary on a 2-D toy dataset",
      "Demonstrate it failing on XOR, then fix it by adding an x1*x2 interaction feature",
      "On a real imbalanced dataset, sweep the threshold and plot precision/recall vs threshold; pick one and justify it in a sentence"
    ],
    out: "src/logreg.py + a threshold-choice justification you can defend."
  },
  qs: [
    { q: "Why is it called logistic REGRESSION if it does classification?",
      a: "Because it performs linear regression on the log-odds of the positive class. The linear model predicts log(p/(1-p)); the logistic (sigmoid) function then maps that unbounded value into a probability. Classification only happens afterwards, when you apply a threshold to that probability." },
    { q: "Why not use MSE as the loss for logistic regression?",
      a: "Combining MSE with a sigmoid gives a non-convex objective with multiple local minima, and its gradient contains a sigmoid-derivative factor that vanishes precisely when the model is confidently wrong — so learning stalls exactly when it should be fastest. Cross-entropy is convex in the parameters and its gradient reduces to (p - y)x, which stays large for confident errors." }
  ],
  tags: ["logistic-regression", "classification", "sigmoid"]
},
{
  d: 19, w: 3, phase: "Classical ML", track: "ML",
  title: "Classification Metrics — The Deep Version",
  hook: "'We got 99% accuracy' is how you fail an interview.",
  why: "Metric selection is the most frequently botched part of candidate answers. Being fluent in precision/recall tradeoffs and knowing when ROC-AUC misleads immediately signals maturity.",
  learn: [
    { h: "Accuracy lies under imbalance",
      p: "With 1% fraud, predicting 'never fraud' gives 99% accuracy and zero business value. Whenever classes are imbalanced or error costs differ, accuracy is the wrong headline metric. Say this before anyone asks." },
    { h: "Precision vs recall is a business tradeoff",
      p: "Precision = of those I flagged, how many were right (cost of false alarms). Recall = of all true cases, how many did I catch (cost of misses). Cancer screening wants recall. Spam filtering wants precision — a lost real email is worse than a spam that got through. F1 is their harmonic mean, useful only when you genuinely have no preference." },
    { h: "ROC-AUC vs PR-AUC",
      p: "ROC-AUC is the probability a random positive is ranked above a random negative, and it is invariant to class balance — which is both its strength and its trap. Under heavy imbalance ROC-AUC looks impressively high while the model is still useless in practice. PR-AUC focuses on the positive class and is the honest choice for rare events." },
    { h: "Calibration",
      p: "A model can rank perfectly (AUC 0.95) while its probabilities are badly scaled. If you use the probability in a downstream expected-value calculation, calibration matters. Check with a reliability curve; fix with Platt scaling or isotonic regression. Very few candidates mention this — it is a differentiator." }
  ],
  cheat: {
    title: "Metrics Card",
    pts: [
      "precision = TP/(TP+FP)  'flagged & right'",
      "recall    = TP/(TP+FN)  'caught them all'",
      "F1 = 2PR/(P+R)  harmonic mean",
      "spam -> PRECISION | cancer -> RECALL",
      "ROC-AUC: balance-invariant, can flatter",
      "PR-AUC: use when positives are rare",
      "calibration != discrimination",
      "always show the confusion matrix"
    ],
    eq: ["specificity = TN/(TN+FP) ;  FPR = 1 - specificity"],
    warn: "With 0.1% positives, ROC-AUC of 0.95 can still mean atrocious precision. Report PR-AUC and precision@k for rare-event problems, always."
  },
  vids: [
    { t: "ROC and AUC clearly explained", ch: "StatQuest" },
    { t: "Precision recall F1 confusion matrix", ch: "StatQuest" }
  ],
  lab: {
    t: "Metric selection under imbalance",
    steps: [
      "Build a 99:1 imbalanced dataset; train a model; show accuracy is misleading",
      "Plot ROC and PR curves side by side; note how differently they read",
      "Plot a calibration curve; apply CalibratedClassifierCV and show the improvement",
      "Write a cost matrix (cost of FP, cost of FN) and compute the optimal threshold by expected cost"
    ],
    out: "src/metrics.py with a cost-optimal threshold finder."
  },
  qs: [
    { q: "Model has 99% accuracy on fraud detection. Impressed?",
      a: "No — with roughly 1% fraud, always predicting 'not fraud' also scores 99%. I would ask for the confusion matrix, precision and recall on the fraud class, PR-AUC, and precision@k for the number of cases investigators can actually review. Then I would pick a threshold from the relative cost of a missed fraud versus a false investigation." },
    { q: "When is ROC-AUC the wrong metric?",
      a: "Under severe class imbalance. ROC-AUC uses the false positive rate, whose denominator is the huge negative class, so even many false positives barely move it. PR-AUC uses precision, whose denominator is what you flagged, so it reflects real-world usefulness. Also wrong when you need calibrated probabilities rather than ranking, since AUC is purely rank-based." }
  ],
  tags: ["metrics", "imbalance", "calibration", "interview"]
},
{
  d: 20, w: 3, phase: "Classical ML", track: "ML",
  title: "Cross-Validation, Pipelines & Hyperparameter Search",
  hook: "The infrastructure that keeps you honest.",
  why: "sklearn Pipelines are the single best signal in a take-home that you understand leakage. Reviewers notice immediately whether you fit your scaler before or after the split.",
  learn: [
    { h: "k-fold and its variants",
      p: "k-fold gives k estimates of performance and thus a mean and a standard deviation — the variance matters as much as the mean. Use StratifiedKFold for classification to preserve class ratios, GroupKFold when rows share an entity, and TimeSeriesSplit for temporal data. Nested CV when you need an unbiased estimate after tuning." },
    { h: "Pipelines make leakage structurally impossible",
      p: "A Pipeline chains transformers and an estimator so that .fit() only ever sees training data within each CV fold. Scaling, imputation, encoding, and resampling all belong inside it. This is not a style preference; it is correctness." },
    { h: "Search strategies",
      p: "Grid search is exhaustive and wasteful when only a couple of hyperparameters actually matter. Random search finds good configurations faster in high dimensions for the same budget. Bayesian optimisation (Optuna) models the objective and is the best choice when each fit is expensive." },
    { h: "Report mean AND std",
      p: "'0.87 accuracy' is incomplete. '0.87 +/- 0.03 across 5 folds' tells the reader whether a rival model at 0.88 is genuinely better or inside the noise. Reporting variance is a maturity signal." }
  ],
  cheat: {
    title: "CV & Pipeline Card",
    pts: [
      "Pipeline([('sc',StandardScaler()),('m',Model())])",
      "fit inside folds -> leakage impossible",
      "Stratified for classification (imbalance)",
      "GroupKFold when rows share a user/entity",
      "TimeSeriesSplit for temporal (never shuffle)",
      "grid = exhaustive | random = better/budget",
      "Optuna when each fit is expensive",
      "report mean +/- std, not a lone number"
    ],
    eq: ["cross_val_score(pipe, X, y, cv=StratifiedKFold(5), scoring='average_precision')"],
    warn: "Tuning on CV then reporting that same CV score is optimistically biased — you selected for it. Hold out a final test set that no tuning ever touched."
  },
  vids: [
    { t: "Cross validation clearly explained", ch: "StatQuest" },
    { t: "Scikit-learn pipelines tutorial", ch: "Data School" }
  ],
  lab: {
    t: "Prove leakage inflates scores",
    steps: [
      "Deliberately scale on the full dataset before splitting; record the CV score",
      "Now do it correctly inside a Pipeline; record the score; document the gap",
      "Build a ColumnTransformer handling numeric and categorical columns separately",
      "Tune with RandomizedSearchCV, then with Optuna; compare best score per unit of compute time"
    ],
    out: "A leakage demonstration you can describe verbally in an interview."
  },
  qs: [
    { q: "Why use a Pipeline instead of transforming data upfront?",
      a: "Because inside cross-validation the transformer must be fit only on that fold's training portion. If you scale or impute on the whole dataset first, statistics from validation rows leak into training and your CV score is optimistic. A Pipeline makes the correct behaviour automatic and also guarantees the identical transformation is applied at inference." },
    { q: "Grid search vs random search?",
      a: "Grid search evaluates every combination, which scales exponentially and wastes budget on hyperparameters that do not matter. Random search samples the space, so for a fixed budget it explores more distinct values of the few parameters that actually matter — Bergstra and Bengio showed this is usually more efficient. Bayesian methods beat both when each evaluation is expensive." }
  ],
  tags: ["cross-validation", "pipelines", "hyperparameters"]
},
{
  d: 21, w: 3, phase: "Classical ML", track: "Review",
  title: "Week 3 Build — End-to-End sklearn Pipeline",
  hook: "Raw CSV in, tuned honest model out, one command.",
  why: "This exact artefact is what take-home assignments ask for. Having it pre-built means your next take-home is an evening, not a weekend.",
  learn: [
    { h: "Structure your repo like an engineer",
      p: "src/ for reusable modules, notebooks/ for exploration only, config for parameters, a README stating the problem, approach, results, and limitations. Reviewers scan structure before code — a tidy repo buys you goodwill in the first ten seconds." },
    { h: "Limitations sections win interviews",
      p: "Explicitly stating what your model cannot do, where it would fail, and what you would do with more time reads as senior. Overclaiming reads as junior. Always include a limitations section." }
  ],
  cheat: {
    title: "Take-Home Template",
    pts: [
      "1. framing + metric justification",
      "2. EDA w/ conclusions, leakage check",
      "3. baseline (majority/mean) FIRST",
      "4. ColumnTransformer + Pipeline",
      "5. CV w/ mean +/- std",
      "6. tuned model + threshold choice",
      "7. error analysis on worst cases",
      "8. limitations + next steps"
    ],
    eq: ["baseline -> simple model -> tuned model -> error analysis"],
    warn: "Never present a model without a baseline comparison. It is the fastest way to look inexperienced."
  },
  vids: [
    { t: "End to end machine learning project scikit-learn", ch: "Krish Naik" }
  ],
  lab: {
    t: "Build your reusable take-home template",
    steps: [
      "Pick a tabular dataset with mixed numeric/categorical columns",
      "Implement the 8-step template above end to end",
      "Add an error-analysis section: pull the 20 worst predictions and find a pattern",
      "Make it runnable as python src/train.py --config config.yaml",
      "Push. This repo gets reused for every future take-home."
    ],
    out: "A template repo that turns future take-homes into fill-in-the-blanks."
  },
  qs: [
    { q: "Walk me through an end-to-end ML project you built.",
      a: "Structure the answer as: business framing and the decision the model informs, data and its problems, why I chose the metric, baseline result, modelling progression with what each step bought me, honest validation strategy, error analysis and what it revealed, and finally limitations. Lead with the framing and the result, not with the algorithm." }
  ],
  tags: ["review", "portfolio", "take-home"]
},

/* ---------- WEEK 4 : Trees, Ensembles, Features ---------- */
{
  d: 22, w: 4, phase: "Classical ML", track: "ML",
  title: "Decision Trees",
  hook: "The building block of the models that actually win on tabular data.",
  why: "Gradient-boosted trees beat neural networks on most tabular problems, and every one of them is built from this. Interviewers ask about entropy and gini to check you know more than .fit().",
  learn: [
    { h: "Greedy recursive splitting",
      p: "At each node, try every feature and every threshold, pick the split that most reduces impurity, then recurse. It is greedy — locally optimal choices, never revisited — which is why trees are fast to build but not globally optimal. Finding the optimal tree is NP-hard." },
    { h: "Impurity measures",
      p: "Gini = 1 - sum(p^2), entropy = -sum(p log p). Both peak when classes are evenly mixed and hit zero when a node is pure. They almost always produce similar trees; gini is the default because it avoids computing logarithms. For regression, the criterion is variance reduction (MSE)." },
    { h: "Trees overfit ferociously",
      p: "An unconstrained tree grows until every leaf is pure — perfectly memorising the training set. Control it with max_depth, min_samples_leaf, min_samples_split, and ccp_alpha for cost-complexity pruning. min_samples_leaf is usually the most effective single knob." },
    { h: "Strengths and the big weakness",
      p: "No scaling needed, handles mixed types, captures interactions automatically, fully interpretable. The weakness is instability: change a few training rows and the whole tree structure can change. That high variance is precisely what bagging and boosting exist to fix — which is tomorrow." }
  ],
  cheat: {
    title: "Decision Tree Card",
    pts: [
      "greedy: best split now, never revisit",
      "gini = 1 - sum p^2 (default, no logs)",
      "entropy = -sum p log p (same-ish result)",
      "regression -> variance/MSE reduction",
      "unconstrained -> pure leaves -> overfit",
      "knobs: max_depth, min_samples_leaf, ccp_alpha",
      "NO scaling needed (splits are ordinal)",
      "unstable = high variance = bag/boost it"
    ],
    eq: ["gain = impurity(parent) - sum (n_child/n_parent) * impurity(child)"],
    warn: "Default feature_importances_ is impurity-based and biased toward high-cardinality features. Use permutation importance or SHAP when it matters."
  },
  vids: [
    { t: "Decision trees clearly explained", ch: "StatQuest" },
    { t: "Regression trees clearly explained", ch: "StatQuest" }
  ],
  lab: {
    t: "Build a tree from scratch",
    steps: [
      "Implement gini impurity and best-split search in NumPy",
      "Recursively build a depth-limited tree; predict by traversal",
      "Compare accuracy to sklearn's DecisionTreeClassifier",
      "Plot train vs test accuracy against max_depth and locate the overfitting point"
    ],
    out: "src/tree.py — you now understand what XGBoost is made of."
  },
  qs: [
    { q: "Gini vs entropy — which is better?",
      a: "In practice they produce nearly identical trees; empirical comparisons show no consistent winner. Gini is the common default because it avoids logarithm computation and is slightly faster. Entropy comes from information theory and has a cleaner interpretation as expected information gain. The choice matters far less than depth and leaf-size constraints." },
    { q: "Why do decision trees overfit, and how do you stop it?",
      a: "Because they keep splitting until leaves are pure, so they will eventually isolate individual noisy training points. Prevention is pre-pruning via max_depth, min_samples_leaf, min_samples_split, and max_features, or post-pruning via cost-complexity pruning tuned by cross-validation. The structural fix is ensembling, which averages away the variance." }
  ],
  tags: ["trees", "gini", "entropy"]
},
{
  d: 23, w: 4, phase: "Classical ML", track: "ML",
  title: "Bagging & Random Forests",
  hook: "Average many overfit models and the errors cancel.",
  why: "Random Forest is the reliable strong baseline you reach for on any tabular problem. The variance-reduction argument connects straight back to day 12's probability.",
  learn: [
    { h: "Bootstrap aggregating",
      p: "Sample the training set with replacement to create B different datasets, train one tree on each, and average their predictions (or vote). Averaging k independent estimators divides variance by k — that is the day-12 result applied directly. Bias stays roughly the same, variance drops sharply." },
    { h: "The extra randomness in Random Forest",
      p: "Bagging alone gives correlated trees because one dominant feature gets chosen at the top of every tree. Random Forest also samples a random subset of features at each split (max_features ~ sqrt(p) for classification), decorrelating the trees so averaging helps far more. That feature subsampling is the actual innovation." },
    { h: "Out-of-bag evaluation is free validation",
      p: "Each bootstrap sample leaves out roughly 37% of rows. Evaluate each tree on its own out-of-bag rows and you get a validation estimate without a separate holdout — genuinely useful on small datasets. The 37% comes from (1-1/n)^n -> 1/e." },
    { h: "Tuning is mercifully simple",
      p: "More trees never hurts accuracy, only compute — so set n_estimators as high as your budget allows and never tune it for overfitting. The knobs that matter are max_features and min_samples_leaf. This robustness is why RF is such a good default." }
  ],
  cheat: {
    title: "Random Forest Card",
    pts: [
      "bootstrap = sample WITH replacement",
      "avg k indep models -> variance / k",
      "RF adds: random FEATURES per split",
      "that decorrelates trees (the key idea)",
      "max_features: sqrt(p) clf, p/3 reg",
      "OOB ~37% left out -> free validation",
      "more trees never overfits, just costs",
      "trees deep + many = fine for RF"
    ],
    eq: ["Var(mean of k, corr rho) = rho*sigma^2 + (1-rho)*sigma^2/k"],
    warn: "That formula is the whole point: as k grows the second term vanishes but rho*sigma^2 remains. Reducing CORRELATION between trees is what feature subsampling buys you."
  },
  vids: [
    { t: "Random forests part 1 building and using", ch: "StatQuest" },
    { t: "Bootstrapping main ideas", ch: "StatQuest" }
  ],
  lab: {
    t: "Build bagging yourself, then beat it",
    steps: [
      "Implement bagging over your day-22 tree; plot test error vs number of trees",
      "Add random feature selection at each split; show the error curve improves",
      "Verify the ~37% out-of-bag fraction empirically",
      "Compare impurity importance vs permutation importance on a dataset with one high-cardinality feature; document the bias"
    ],
    out: "Empirical proof that decorrelation, not just averaging, is the win."
  },
  qs: [
    { q: "How does Random Forest reduce overfitting?",
      a: "Individual deep trees are low-bias but high-variance. Bagging trains each tree on a bootstrap sample and averages, which reduces variance; random feature selection at each split further decorrelates trees, and since the variance of an average scales with the correlation between members, lower correlation means much lower variance. Bias barely changes, so total error drops." },
    { q: "Random Forest vs gradient boosting?",
      a: "RF builds deep independent trees in parallel and averages them, primarily attacking variance; it is robust, hard to overfit, and easy to tune. Boosting builds shallow trees sequentially, each correcting the previous residuals, primarily attacking bias; it usually achieves higher accuracy but is sensitive to learning rate and number of rounds and can overfit if left unchecked." }
  ],
  tags: ["random-forest", "bagging", "ensembles"]
},
{
  d: 24, w: 4, phase: "Classical ML", track: "ML",
  title: "Boosting — The Intuition",
  hook: "Each new model apologises for the last one's mistakes.",
  why: "Gradient boosting is the most-used algorithm in production tabular ML, and 'explain boosting vs bagging' is close to a guaranteed interview question.",
  learn: [
    { h: "Sequential, not parallel",
      p: "Boosting fits models one after another, each focusing on what the ensemble still gets wrong. AdaBoost does this by re-weighting misclassified samples upward. Gradient boosting does it by fitting the next tree to the residuals — more precisely, to the negative gradient of the loss." },
    { h: "Gradient boosting is gradient descent in function space",
      p: "Each new tree approximates the negative gradient of the loss with respect to the current predictions, and you take a small step in that direction scaled by the learning rate. Once you see it that way, 'why does it work for any differentiable loss?' answers itself." },
    { h: "Weak learners on purpose",
      p: "Boosting uses shallow trees (depth 3-6, often called stumps at depth 1). Each contributes a small correction, so the ensemble builds up complexity gradually and controllably. Using deep trees in boosting overfits fast — the opposite of Random Forest, where depth is fine." },
    { h: "Learning rate and n_estimators trade off",
      p: "A lower learning rate needs more trees but usually generalises better. The standard recipe is to fix a small learning rate (0.01-0.1), then use early stopping on a validation set to choose the number of trees automatically." }
  ],
  cheat: {
    title: "Boosting Card",
    pts: [
      "bagging: parallel, indep, kills VARIANCE",
      "boosting: sequential, kills BIAS",
      "each tree fits the RESIDUAL / -gradient",
      "= gradient descent in function space",
      "shallow trees (3-6) on purpose",
      "low lr + many trees + early stopping",
      "lr and n_estimators trade off inversely",
      "boosting CAN overfit (RF basically can't)"
    ],
    eq: ["F_m(x) = F_{m-1}(x) + eta * h_m(x),  h_m fits -dL/dF"],
    warn: "Boosting is sensitive to noisy labels and outliers because it keeps chasing the points it gets wrong — including the mislabelled ones. Clean your labels first."
  },
  vids: [
    { t: "Gradient boost part 1 regression main ideas", ch: "StatQuest" },
    { t: "AdaBoost clearly explained", ch: "StatQuest" }
  ],
  lab: {
    t: "Implement gradient boosting in ~40 lines",
    steps: [
      "Start with the mean as F_0; loop: compute residuals, fit a shallow tree to them, add eta * tree to F",
      "Confirm training loss decreases monotonically",
      "Compare to sklearn's GradientBoostingRegressor",
      "Sweep learning rate in [0.01, 0.1, 0.5, 1.0] and plot test error vs number of trees for each — see the tradeoff directly"
    ],
    out: "src/gbm.py — boosting demystified permanently."
  },
  qs: [
    { q: "Bagging vs boosting?",
      a: "Bagging trains independent models in parallel on bootstrap samples and averages them, targeting variance; members are deliberately low-bias and high-variance, like deep trees. Boosting trains models sequentially where each fits the errors of the current ensemble, targeting bias; members are deliberately weak, like shallow trees. Bagging is robust and hard to overfit; boosting is usually more accurate but needs careful regularisation." },
    { q: "How is gradient boosting related to gradient descent?",
      a: "It is gradient descent performed in function space rather than parameter space. At each round we compute the negative gradient of the loss with respect to the current predictions — the pseudo-residuals — fit a weak learner to approximate that direction, and add it to the ensemble scaled by the learning rate, which acts as the step size. That framing is why it extends to any differentiable loss." }
  ],
  tags: ["boosting", "gradient-boosting", "interview"]
},
{
  d: 25, w: 4, phase: "Classical ML", track: "ML",
  title: "XGBoost & LightGBM in Practice",
  hook: "The models that win Kaggle and quietly run production.",
  why: "Naming these and knowing their real differences signals you have worked on actual tabular problems rather than only coursework.",
  learn: [
    { h: "What XGBoost added",
      p: "Second-order (Newton) optimisation using both gradient and Hessian, an explicit regularisation term on leaf weights and tree complexity, sparsity-aware split finding that handles missing values natively by learning a default direction, and heavy systems engineering for cache and parallelism." },
    { h: "LightGBM's differences",
      p: "Leaf-wise growth (always split the leaf with the highest loss reduction) instead of level-wise, which gives lower loss for the same number of leaves but overfits more easily on small data. Plus histogram binning of continuous features for large speedups. It is usually the fastest on large datasets." },
    { h: "CatBoost's niche",
      p: "Ordered target encoding for categorical features that avoids the target leakage naive mean-encoding causes, plus symmetric trees. Best default when you have many high-cardinality categorical columns and do not want to hand-engineer encodings." },
    { h: "A tuning order that works",
      p: "Fix a low learning rate and use early stopping for n_estimators. Then tune max_depth or num_leaves, then min_child_weight/min_data_in_leaf, then subsample and colsample_bytree, and finally the L1/L2 regularisation terms. Tuning in this order gets 95% of the achievable gain fast." }
  ],
  cheat: {
    title: "GBDT Practical Card",
    pts: [
      "XGB: level-wise, 2nd order, native NaN",
      "LGBM: leaf-wise, histogram, FAST, big data",
      "CatBoost: ordered target enc, high-card cats",
      "tune order: lr+early stop > depth > min_child",
      "  > subsample/colsample > reg_lambda",
      "lr 0.01-0.05 + early_stopping_rounds=50",
      "scale_pos_weight for imbalance",
      "NO feature scaling needed"
    ],
    eq: ["obj = sum L(y, y_hat) + sum_trees [ gamma*T + 0.5*lambda*||w||^2 ]"],
    warn: "LightGBM leaf-wise growth overfits small datasets badly. Under ~10k rows set num_leaves low (or just use XGBoost)."
  },
  vids: [
    { t: "XGBoost part 1 regression", ch: "StatQuest" },
    { t: "LightGBM vs XGBoost vs CatBoost", ch: "Rob Mulla" }
  ],
  lab: {
    t: "Three-way shootout",
    steps: [
      "On one tabular dataset, train XGBoost, LightGBM, and CatBoost with sane defaults",
      "Record accuracy, training time, and inference latency in a comparison table",
      "Tune the best one with Optuna using early stopping; record the improvement",
      "Explain the results with SHAP: global importance plus one local force plot for a single prediction"
    ],
    out: "A comparison table + SHAP explanations you can talk through."
  },
  qs: [
    { q: "XGBoost vs LightGBM — when do you pick which?",
      a: "LightGBM for large datasets and speed, since histogram binning and leaf-wise growth make it substantially faster, but it overfits small datasets so num_leaves needs constraining. XGBoost for smaller or noisier data where its level-wise growth is more conservative, and when I want its mature ecosystem. CatBoost when there are many high-cardinality categoricals, because its ordered target encoding avoids the leakage of naive mean encoding." },
    { q: "How does XGBoost handle missing values?",
      a: "It learns a default direction at each split. During training, rows with a missing value for the split feature are tried in both the left and right branch, and whichever gives more loss reduction becomes that node's default. So missingness is handled natively and can even be exploited as signal, without imputation." }
  ],
  tags: ["xgboost", "lightgbm", "shap"]
},
{
  d: 26, w: 4, phase: "Classical ML", track: "ML",
  title: "Feature Engineering & Encoding",
  hook: "On tabular data, features beat models. Consistently.",
  why: "'What features would you create for this problem?' is one of the most common applied interview questions, and it is where domain thinking shows.",
  learn: [
    { h: "Categorical encoding by cardinality",
      p: "Low cardinality: one-hot. Ordered categories: ordinal encoding that respects the order. High cardinality: target encoding (with smoothing and computed inside CV folds to avoid leakage), hashing, or just let CatBoost handle it. Tree models can also take integer-coded categories directly in LightGBM/CatBoost." },
    { h: "Numeric transformations",
      p: "Log or Box-Cox for right-skewed variables like income. Binning to capture nonlinearity in linear models. Ratios and differences often carry more signal than raw values — price per square foot beats price and area separately. Interaction terms matter for linear models; trees find interactions themselves." },
    { h: "Datetime and cyclical features",
      p: "Extract hour, day of week, month, is_weekend, is_holiday, and days-since-event. Crucially, encode cyclical features with sine and cosine pairs so that hour 23 and hour 0 are adjacent in feature space, rather than maximally far apart as raw integers." },
    { h: "Aggregation features are the big win",
      p: "For entity-level prediction, group-level aggregates dominate: user's mean transaction amount, count in the last 7 days, ratio of current value to their historical mean. These carry the most signal on real tabular problems — and they are exactly where leakage sneaks in, so compute them using only data available before the prediction timestamp." }
  ],
  cheat: {
    title: "Feature Engineering Card",
    pts: [
      "low card -> one-hot | ordered -> ordinal",
      "high card -> target enc (SMOOTH + in-fold)",
      "skewed -> log1p | heavy tails -> rank/quantile",
      "ratios & diffs > raw values",
      "cyclical: sin(2pi t/T), cos(2pi t/T)",
      "aggregates per entity = biggest win",
      "always add was_missing flags",
      "trees: no scaling. linear/NN: scale."
    ],
    eq: ["target_enc = (sum_y + prior*m) / (count + m)   # m-smoothing"],
    warn: "Naive target encoding leaks the label. Compute it out-of-fold or with ordered statistics, otherwise your CV looks amazing and production collapses."
  },
  vids: [
    { t: "Feature engineering techniques for machine learning", ch: "Krish Naik" },
    { t: "Target encoding explained", ch: "Abhishek Thakur" }
  ],
  lab: {
    t: "Feature engineering sprint",
    steps: [
      "Take a dataset with a timestamp and an entity id (transactions, clicks, orders)",
      "Baseline: raw features only. Record the score.",
      "Add datetime + cyclical features. Record.",
      "Add entity aggregates computed strictly from the past. Record.",
      "Add correctly out-of-fold target encoding. Record. Plot the score progression."
    ],
    out: "A score-progression chart proving features beat model choice."
  },
  qs: [
    { q: "How do you encode a categorical feature with 10,000 unique values?",
      a: "One-hot is out — it explodes dimensionality and creates near-empty columns. Options: target encoding with smoothing computed out-of-fold to avoid leakage; frequency or count encoding; hashing to a fixed number of buckets when memory is tight; grouping rare levels into an 'other' bucket; learned embeddings if there is a neural model; or CatBoost, which does ordered target encoding natively." },
    { q: "What features would you engineer to predict food delivery time?",
      a: "Temporal: hour, day of week, is_weekend, is_holiday, and cyclical encodings. Distance and route: haversine distance, historical average speed on that route. Restaurant: historical mean prep time, current open-order backlog, item count and complexity. Courier: experience, current load. Contextual: weather, live traffic index. And critically, all historical aggregates must use only data before the order timestamp." }
  ],
  tags: ["feature-engineering", "encoding", "interview"]
},
{
  d: 27, w: 4, phase: "Classical ML", track: "ML",
  title: "Imbalanced Data & Threshold Tuning",
  hook: "Fraud, churn, disease, defects — the valuable problems are all imbalanced.",
  why: "Almost every real ML problem worth solving has rare positives. Handling imbalance well, and knowing that threshold tuning usually beats resampling, is a strong signal.",
  learn: [
    { h: "Try the cheap fixes first",
      p: "Before resampling anything: use class_weight='balanced' or scale_pos_weight, switch your metric to PR-AUC, and tune the decision threshold. These three cost nothing and frequently solve the problem entirely. Resampling is a heavier tool with real downsides." },
    { h: "Resampling and its costs",
      p: "Random undersampling throws away majority data (fast, loses information). Random oversampling duplicates minority rows (risks overfitting to them). SMOTE synthesises interpolated minority points, which helps on continuous features but produces nonsense on categorical or high-dimensional sparse data. Always resample inside CV folds only." },
    { h: "Threshold tuning is the highest-leverage step",
      p: "The model's ranking is often already good; the default 0.5 cutoff is simply wrong for the cost structure. Sweep thresholds, plot precision and recall, and select using the actual business cost matrix. Expected cost = FP_count * cost_FP + FN_count * cost_FN — minimise that." },
    { h: "Anomaly detection when positives are vanishingly rare",
      p: "Below roughly 0.1% positives, or when you have almost no labelled positives, reframe as anomaly detection: Isolation Forest, One-Class SVM, or an autoencoder's reconstruction error. You model 'normal' and flag deviations rather than learning a decision boundary from a handful of examples." }
  ],
  cheat: {
    title: "Imbalance Card",
    pts: [
      "1. class_weight='balanced' (free)",
      "2. metric -> PR-AUC, precision@k",
      "3. TUNE THE THRESHOLD (biggest win)",
      "4. only then resample",
      "SMOTE: continuous only, INSIDE folds",
      "undersample = lose data, oversample = overfit",
      "<0.1% positives -> anomaly detection",
      "expected cost = FP*c_fp + FN*c_fn"
    ],
    eq: ["threshold* = argmin_t [ FP(t)*cost_FP + FN(t)*cost_FN ]"],
    warn: "Resampling distorts predicted probabilities. If you need calibrated probabilities downstream, either recalibrate afterwards or use class weights instead."
  },
  vids: [
    { t: "Handling imbalanced datasets in machine learning", ch: "codebasics" },
    { t: "SMOTE oversampling explained", ch: "Data Science Garage" }
  ],
  lab: {
    t: "Beat imbalance the right way",
    steps: [
      "Use the credit-card fraud dataset (0.17% positives)",
      "Baseline with default settings; then class_weight; then threshold tuning; then SMOTE-in-pipeline",
      "Report PR-AUC and precision@100 for each; rank the interventions by gain per unit of complexity",
      "Define a cost matrix and compute the cost-optimal threshold; state the dollar impact"
    ],
    out: "Evidence that threshold tuning usually beats SMOTE — a great interview story."
  },
  qs: [
    { q: "How do you handle a 99:1 imbalanced dataset?",
      a: "First change how I measure: PR-AUC and precision@k instead of accuracy. Then class weights, which cost nothing. Then tune the decision threshold using the actual cost of false positives versus false negatives, which is usually the single biggest gain. Only then consider resampling, applied strictly inside CV folds. And if positives are extremely rare, reframe as anomaly detection." },
    { q: "Why can SMOTE make things worse?",
      a: "It interpolates between minority neighbours, so in high-dimensional or sparse spaces it generates unrealistic points, and near class boundaries it can synthesise samples inside the majority region, blurring the boundary. It is also invalid for categorical features. And applying it before cross-validation leaks synthetic copies across folds, producing fake validation scores." }
  ],
  tags: ["imbalance", "smote", "threshold"]
},
{
  d: 28, w: 4, phase: "Classical ML", track: "Project",
  title: "PROJECT 1 — Tabular ML, End to End",
  hook: "First portfolio piece. Make it defensible, not flashy.",
  why: "Two strong projects beat six shallow ones. This one demonstrates the full classical-ML competency: framing, honest validation, tuning, explanation, and error analysis.",
  learn: [
    { h: "Pick a problem with a decision attached",
      p: "Choose a dataset where you can articulate who uses the prediction and what they do differently because of it. 'Predict hospital readmission so care coordinators can prioritise follow-up calls for the top 10%' is a project. 'Titanic survival' is a tutorial." },
    { h: "The README is the project",
      p: "Most reviewers never run your code. They read the README. Lead with the problem, the result versus baseline, one key chart, and the limitations. Code quality matters second." }
  ],
  cheat: {
    title: "Project 1 Rubric",
    pts: [
      "[ ] framing doc: target/horizon/action/metric",
      "[ ] EDA w/ leakage check documented",
      "[ ] baseline reported BEFORE the model",
      "[ ] Pipeline + proper CV (mean +/- std)",
      "[ ] tuned model + threshold justification",
      "[ ] SHAP or permutation explanation",
      "[ ] error analysis: 20 worst cases, pattern",
      "[ ] limitations + 'with more time I would'",
      "[ ] README a manager could read in 2 min"
    ],
    eq: ["a defensible 0.82 > an unexplained 0.89"],
    warn: "Do not use Titanic, Iris, or Boston Housing. Reviewers see them a hundred times a week and stop reading."
  },
  vids: [
    { t: "How to build machine learning projects for your portfolio", ch: "Ken Jee" }
  ],
  lab: {
    t: "Ship Project 1",
    steps: [
      "Choose from the Projects page (tier 1) or bring your own with a real decision attached",
      "Work through the rubric above completely — every box ticked",
      "Write the README last, for a non-technical reader",
      "Push, then add one line to your resume with a measurable result",
      "Post it on LinkedIn with the key chart. Visibility is part of the job search."
    ],
    out: "Portfolio project #1, resume updated, posted publicly."
  },
  qs: [
    { q: "Tell me about a project you are proud of.",
      a: "Use the frame: problem and who it helps, why it was non-trivial, what you tried and what failed, the honest result against a baseline, and what you learned or would do differently. Interviewers care far more about your reasoning and your handling of failure than about the final metric. Rehearse this to 90 seconds." }
  ],
  tags: ["project", "portfolio", "milestone"]
},

/* ---------- WEEK 5 (part) : Unsupervised ---------- */
{
  d: 29, w: 5, phase: "Classical ML", track: "ML",
  title: "Clustering — k-means, Hierarchical, DBSCAN",
  hook: "Finding structure with no labels at all.",
  why: "Customer segmentation is one of the most common real business applications, and 'how do you choose k?' is a standard interview probe.",
  learn: [
    { h: "k-means and its assumptions",
      p: "Alternate between assigning points to the nearest centroid and recomputing centroids. It assumes clusters are spherical, similar in size, and similar in density, because it minimises within-cluster variance using euclidean distance. When those assumptions break — elongated or nested clusters — it fails visibly." },
    { h: "Choosing k",
      p: "The elbow method plots inertia versus k and looks for a bend, but the bend is often ambiguous. Silhouette score is usually better: it measures how close each point is to its own cluster versus the next nearest, and you pick the k that maximises the mean. Best of all, validate against a downstream business use." },
    { h: "DBSCAN finds arbitrary shapes",
      p: "Density-based: core points have at least min_samples neighbours within eps, clusters grow by connectivity, and low-density points are labelled noise. It does not need k in advance and handles non-spherical clusters and outliers. The catch is that eps is hard to choose and it struggles when clusters have very different densities." },
    { h: "Scaling is mandatory",
      p: "All of these use distance, so a feature measured in dollars will completely dominate one measured in years. Always standardise first. This is the most common practical mistake in clustering." }
  ],
  cheat: {
    title: "Clustering Card",
    pts: [
      "SCALE FIRST. always. distance-based.",
      "k-means: spherical, equal-size assumption",
      "k-means++ init to avoid bad local optima",
      "elbow = inertia vs k (often ambiguous)",
      "silhouette in [-1,1], higher better",
      "DBSCAN: eps + min_samples, finds noise",
      "DBSCAN handles arbitrary shapes, no k",
      "hierarchical -> dendrogram, cut at height"
    ],
    eq: ["silhouette = (b - a) / max(a, b)   a=own cluster, b=next nearest"],
    warn: "k-means will always return k clusters, even in pure noise. Always sanity-check that the clusters mean something before presenting them."
  },
  vids: [
    { t: "K-means clustering clearly explained", ch: "StatQuest" },
    { t: "DBSCAN clearly explained", ch: "StatQuest" }
  ],
  lab: {
    t: "Customer segmentation that a business could use",
    steps: [
      "Build RFM features (recency, frequency, monetary) from a transactions dataset",
      "Scale, then run k-means for k in 2..10; plot elbow and silhouette",
      "Profile each cluster: mean values per feature, size, and a human-readable NAME",
      "Run DBSCAN on the same data; compare, and explain where each one wins",
      "Write one paragraph of business recommendation per segment"
    ],
    out: "A segmentation with named personas and actions — genuinely portfolio-worthy."
  },
  qs: [
    { q: "How do you choose the number of clusters?",
      a: "Technically, elbow on inertia and silhouette score across a range of k, preferring silhouette because the elbow is often ambiguous. Gap statistic if I want a more principled criterion. But the real answer is downstream utility: if marketing can run four campaigns, four interpretable clusters beat seven statistically optimal ones. Clustering is unsupervised, so validation ultimately comes from use." },
    { q: "When does k-means fail?",
      a: "When clusters are non-spherical, of very different sizes, or of different densities, since it minimises euclidean within-cluster variance. It is also sensitive to outliers, which drag centroids, and to initialisation, which k-means++ mitigates. And it forces every point into a cluster, so it cannot express 'this is noise' — DBSCAN or Gaussian mixtures handle those cases better." }
  ],
  tags: ["clustering", "kmeans", "dbscan", "segmentation"]
},
{
  d: 30, w: 5, phase: "Classical ML", track: "ML",
  title: "PCA & Dimensionality Reduction",
  hook: "Day 9's SVD, now doing something useful.",
  why: "PCA appears constantly: preprocessing, visualisation, compression, and denoising. And it is the clearest demonstration that you understood the linear algebra rather than memorising a recipe.",
  learn: [
    { h: "PCA finds the directions of maximum variance",
      p: "Centre the data, compute the covariance matrix, take its eigenvectors — those are the principal components, ordered by eigenvalue, which equals the variance captured along that direction. Projecting onto the top k gives the best possible k-dimensional linear approximation in a least-squares sense." },
    { h: "How many components",
      p: "Plot cumulative explained variance and keep enough for 90-95%, or look for the elbow in the scree plot. If PCA is a preprocessing step for a supervised model, just treat the component count as a hyperparameter and tune it by cross-validation." },
    { h: "What PCA costs you",
      p: "Interpretability: components are linear combinations of all original features, so 'PC1' has no business meaning. It is also unsupervised, so the highest-variance direction is not necessarily the most predictive one — PCA can discard exactly the low-variance direction that separates your classes. LDA is the supervised alternative." },
    { h: "t-SNE and UMAP are for looking, not modelling",
      p: "These are nonlinear and excellent for 2-D visualisation of clusters. But distances between clusters and cluster sizes in a t-SNE plot are not meaningful, results depend heavily on perplexity, and there is no reliable transform for new points. Use them to explore; never feed their output into a production model." }
  ],
  cheat: {
    title: "PCA Card",
    pts: [
      "CENTRE (and usually scale) first",
      "PCs = eigenvectors of covariance matrix",
      "eigenvalue = variance along that PC",
      "PCs are orthogonal, ordered by variance",
      "pick k: cumulative var 90-95% or scree elbow",
      "PCA is UNSUPERVISED -> may drop signal",
      "loses interpretability entirely",
      "t-SNE/UMAP: visualise only, never model"
    ],
    eq: ["explained_var_ratio_k = lambda_k / sum(lambda)"],
    warn: "Fit PCA on the TRAINING set only and transform the test set with it. Fitting on everything is textbook leakage — put it in a Pipeline."
  },
  vids: [
    { t: "PCA principal component analysis step by step", ch: "StatQuest" },
    { t: "t-SNE clearly explained", ch: "StatQuest" }
  ],
  lab: {
    t: "PCA from scratch, then compare",
    steps: [
      "Implement PCA with NumPy via SVD on centred data; match sklearn's components (up to sign)",
      "On a high-dimensional dataset, plot cumulative explained variance and choose k",
      "Compare downstream model accuracy at k = 2, 10, 50, and all features; note the tradeoff",
      "Visualise the same data with PCA, t-SNE, and UMAP side by side and write what each reveals",
      "Construct a case where the top PC is NOT the discriminative direction — great interview story"
    ],
    out: "src/pca.py + a three-way visualisation comparison."
  },
  qs: [
    { q: "Explain PCA.",
      a: "It finds an orthogonal basis ordered by how much variance of the data each direction captures. Concretely: centre the data, take the eigenvectors of the covariance matrix (or equivalently the right singular vectors from SVD), and project onto the top k. Those k dimensions give the best possible linear reconstruction in the least-squares sense, so it compresses while preserving as much variance as possible." },
    { q: "When would PCA hurt your model?",
      a: "When the discriminative signal lies in a low-variance direction — PCA is unsupervised and ranks by variance, not by relationship to the target, so it can throw away exactly what separates the classes. It also destroys interpretability, breaks sparsity, and is useless for capturing nonlinear structure. For tree ensembles it usually just adds cost, since trees handle irrelevant features natively." }
  ],
  tags: ["pca", "dimensionality-reduction", "tsne"]
}

];
