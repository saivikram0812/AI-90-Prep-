/* ============================================================
   FULL LESSONS — written for a beginner, with worked examples.
   Rule for every day: if an interview question is asked at the
   bottom of the page, the answer must be teachable from here.
   ============================================================ */

window.DEEP = window.DEEP || {};

/* ---------------------------------------------------------- DAY 1 */
window.DEEP[1] = {
  mins: 40,
  intro: "Today has no maths and no code. It is the mental model everything else hangs off. Read it slowly — if this lands, the next 89 days are much easier.",
  secs: [

  { h: "1 · Normal programming vs machine learning",
    ps: [
      "In normal programming, YOU write the rules. You think hard about the problem, work out the logic, and type it out. The computer follows your rules exactly.",
      "In machine learning, you do not write the rules. You show the computer many examples of the right answer, and the computer works out the rules by itself.",
      "That is the entire difference. Everything else is detail."
    ],
    ex: { t: "Spam filter, both ways",
      x: "NORMAL PROGRAMMING — you write the rules yourself:\n\n    if 'free money' in email: spam\n    if 'click here now' in email: spam\n    if sender not in contacts and has_link: spam\n\nThis works for a while. Then spammers write 'fr3e m0ney' and your rules miss it. You add more rules. They change again. You lose.\n\nMACHINE LEARNING — you show examples instead:\n\n    email 1  ->  spam\n    email 2  ->  not spam\n    email 3  ->  spam\n    ... 50,000 more ...\n\nThe computer finds the patterns itself. When spammers change tactics, you feed it new examples instead of rewriting rules." },
    key: "Normal programming: rules in, answers out. Machine learning: answers in, rules out." },

  { h: "2 · What a 'model' actually is",
    ps: [
      "The word 'model' sounds mysterious. It is not. A model is just a formula with some numbers in it that you are allowed to adjust. Those adjustable numbers are called parameters, or informally, knobs.",
      "Say you want to predict a house price from its size. You guess the relationship is a straight line:",
      "price = w × size + b",
      "Here 'size' is what you know, 'price' is what you want. And w and b are the two knobs. Change them and you get a different prediction. That formula, plus a specific choice of w and b, IS the model.",
      "A linear regression has 2 knobs. A large language model has hundreds of billions. The formula gets more complicated, the idea does not change."
    ],
    ex: { t: "Trying some knob settings",
      x: "A house is 1000 sq ft and actually sold for 300,000.\n\n  w = 100, b = 0   ->  predicts 100 x 1000 + 0      = 100,000   (200,000 too low)\n  w = 400, b = 0   ->  predicts 400 x 1000 + 0      = 400,000   (100,000 too high)\n  w = 250, b = 50000 -> predicts 250 x 1000 + 50000 = 300,000   (exactly right)\n\nWe just did by hand what training does automatically: try knob settings, see how wrong they are, adjust." },
    key: "Model = a formula + the specific numbers you have chosen for its knobs." },

  { h: "3 · What 'training' means",
    ps: [
      "Training is the process of searching for good knob settings. To search, the computer needs a way to score how bad a given setting is. That score is called the loss.",
      "The loss is one single number that answers: 'across all my examples, how wrong were my predictions?' Low loss = good. Zero loss = perfect on that data.",
      "The most common loss for predicting numbers is mean squared error: for each example take (actual − predicted), square it, then average across all examples. Squaring does two things — it makes negatives and positives both count as 'wrong', and it punishes big misses much harder than small ones."
    ],
    ex: { t: "Computing a loss by hand",
      x: "Three houses. Our model predicts with w = 200, b = 0:\n\n  size    actual     predicted   error   error squared\n  1000    300,000    200,000     100,000   10,000,000,000\n  1500    400,000    300,000     100,000   10,000,000,000\n  2000    450,000    400,000      50,000    2,500,000,000\n\n  mean squared error = (10bn + 10bn + 2.5bn) / 3 = 7.5 billion\n\nNow try w = 250, b = 50,000:\n\n  1000  ->  300,000   error 0\n  1500  ->  425,000   error 25,000\n  2000  ->  550,000   error 100,000\n\n  MSE = (0 + 625m + 10bn) / 3 = 3.5 billion\n\nLower loss, so the second setting is better. Training repeats this millions of times, adjusting intelligently rather than guessing." },
    key: "Training = repeatedly adjust the knobs to make the loss number smaller." },

  { h: "4 · The words you will hear constantly",
    ps: [
      "FEATURES — the inputs. The things you know. Size, bedrooms, postcode. Written as X.",
      "LABEL (or target) — the answer you want to predict. The price. Written as y.",
      "SUPERVISED LEARNING — you have the right answers to learn from. Every house in your data has a known sale price. This is 90% of what you will do.",
      "UNSUPERVISED LEARNING — no right answers. You have customer data and want to find natural groupings, but nobody told you what the groups are.",
      "So: supervised is learning with an answer key. Unsupervised is finding structure without one."
    ],
    key: "Features (X) are what you know. The label (y) is what you want. Supervised = you have an answer key." },

  { h: "5 · The only thing that actually matters: generalisation",
    ps: [
      "Here is the trap that catches every beginner. Any model can score perfectly on data it has already seen — it can simply memorise it. That proves nothing.",
      "What you actually care about is whether it works on data it has NEVER seen. Because that is what happens in real life: a new house arrives, a new email arrives, and the model has to be right about something it has not met before.",
      "That ability is called generalisation, and it is the whole game. Almost every technique in this entire 90-day plan exists to protect generalisation."
    ],
    ex: { t: "The exam analogy — use this one in interviews",
      x: "Student A memorises the answers to last year's past paper. Word for word.\n  Past paper score: 100%.  Real exam: 40%.\n  -> He memorised. He did not learn. This is OVERFITTING.\n\nStudent B barely studied at all.\n  Past paper score: 45%.  Real exam: 42%.\n  -> Too little preparation to capture the pattern. This is UNDERFITTING.\n\nStudent C understood the underlying concepts.\n  Past paper score: 85%.  Real exam: 82%.\n  -> Generalised. This is what we want.\n\nNotice Student C scores LOWER on the past paper than Student A. A model that is\nslightly worse on training data but much better on new data is the better model.\nThis surprises people, and it is the heart of the field." },
    key: "Overfitting = memorised the training data, fails on new data. Underfitting = too simple to capture the pattern, fails on both." },

  { h: "6 · How you actually SEE overfitting",
    ps: [
      "You cannot see it by looking at one number. You must compare two: how the model does on data it trained on, versus data it has never seen.",
      "That is why the very first thing you do with any dataset is hide part of it from the model. You split your rows into groups and only let the model learn from one of them."
    ],
    ex: { t: "Reading the two numbers",
      x: "  Model              Training error   New-data error   Diagnosis\n  ----------------------------------------------------------------\n  Straight line          40%              41%          UNDERFIT — bad at both\n  Medium complexity      12%              15%          GOOD — small gap\n  Huge complex model      0%              38%          OVERFIT — big gap\n\nThe GAP between the two columns is the signal.\n  Both numbers bad          -> underfitting -> make the model MORE powerful\n  Big gap between them      -> overfitting  -> make it SIMPLER, or get more data\n\nCritically: more data fixes overfitting. More data does NOT fix underfitting —\nif your model is too simple, a million more rows changes nothing." },
    key: "Compare training error to new-data error. Both bad = underfit. Big gap = overfit." },

  { h: "7 · Three sets of data, not two — and why",
    ps: [
      "You will hear about train, validation, and test sets. Beginners always ask why you need three. Here is the honest answer.",
      "TRAINING SET (~60-70%) — the model learns directly from this. Like your textbook and homework.",
      "VALIDATION SET (~15-20%) — you check on this repeatedly while building. Should I use a bigger model? Should I add this feature? You try something, check the validation score, and keep whatever scored better. Like practice tests you take many times.",
      "TEST SET (~15-20%) — locked away, touched ONCE, right at the end. Like the real exam.",
      "So why isn't validation enough? Because of what YOU do. Every time you try something and keep the version that scored higher on validation, you are letting the validation set influence your decisions. Do that fifty times and you have gradually shaped your model to suit that specific validation data — including its random quirks. The validation score is now too optimistic. It is subtle overfitting, done by you rather than by the model.",
      "The test set stays sealed precisely so you have one honest number at the end that nothing was tuned against."
    ],
    ex: { t: "How the validation set gets used up",
      x: "  You try 50 different model configurations.\n  You keep whichever scores best on validation. Best score: 91%.\n\n  Is the model really 91% good? No.\n  Out of 50 tries, some scored high partly by LUCK on that particular\n  validation set. You picked the luckiest one.\n\n  On the sealed test set it might score 86%. That 86% is the honest number.\n\n  This is why 'never tune on the test set' is an absolute rule. The moment\n  you use it to make a decision, it stops being an honest measurement." },
    key: "Train = learn from. Validation = make decisions with (repeatedly). Test = measure honestly, once, at the very end." },

  { h: "8 · Why your setup matters",
    ps: [
      "One practical thing before you start. Use a separate Python environment for each project (a virtual environment), write down exactly which package versions you used, and put your code in git from the first day.",
      "This is not bureaucracy. Interviewers ask 'how do you make your results reproducible?' and it is a real question — if you cannot re-run an experiment from three months ago and get the same number, you cannot trust anything you claim. Reproducibility means: same code + same data + same package versions + same random seed = same result."
    ],
    key: "Reproducible = anyone (including future you) can re-run it and get the identical number." }
  ]
};

/* ---------------------------------------------------------- DAY 2 */
window.DEEP[2] = {
  mins: 45,
  intro: "NumPy is the foundation under pandas, scikit-learn and PyTorch. Broadcasting in particular will confuse you again in week 6 if you skip it now, so take the time.",
  secs: [

  { h: "1 · Why Python lists are slow (the real reason)",
    ps: [
      "People say 'NumPy is faster' without explaining why. The why matters because it is an interview question.",
      "A Python list does not store numbers. It stores POINTERS — memory addresses — to number objects that are scattered anywhere in memory. And each of those objects is not just a number: it carries its type, a reference count for garbage collection, and then the actual value. A single Python integer costs about 28 bytes; the raw number needs 8.",
      "So when you loop over a Python list adding numbers, for every single element the interpreter must: follow the pointer to wherever the object lives, check what type it is, unwrap the actual number, do the addition, wrap the result back into a new object, and store a pointer to it. That is a huge amount of work per number.",
      "A NumPy array stores the raw numbers themselves, all the same type, packed side by side in one continuous block of memory. So the loop runs in compiled C with no type checking, the CPU can fetch neighbouring values efficiently into cache, and it can use SIMD instructions — special CPU instructions that add 4 or 8 numbers in a single operation instead of one at a time.",
      "Result: typically 50 to 200 times faster."
    ],
    ex: { t: "The four reasons, which is the interview answer",
      x: "  1. CONTIGUOUS MEMORY — raw values packed together, not scattered pointers.\n     The CPU cache loads neighbours for free.\n\n  2. COMPILED C LOOP — the loop runs in C, not in the Python interpreter.\n\n  3. NO TYPE DISPATCH — the whole array is one dtype, so the type is checked\n     once, not once per element.\n\n  4. SIMD VECTORISATION — CPU instructions that process several numbers in a\n     single step.\n\nMemorise these four. 'It's written in C' alone is a shallow answer." },
    key: "Lists = scattered pointers to fat objects, interpreted loop. Arrays = packed raw numbers, C loop, SIMD." },

  { h: "2 · shape and dtype — print these constantly",
    ps: [
      "Every array has a shape (a tuple saying how big it is in each direction) and a dtype (what type ALL its elements are — an array cannot mix types).",
      "Nearly every NumPy bug you will ever have is a shape bug or a dtype bug. Experienced engineers print .shape far more often than beginners, not less. Get into the habit today."
    ],
    code: "import numpy as np\n\na = np.array([1, 2, 3])\na.shape        # (3,)      one dimension, 3 elements\na.dtype        # int64\n\nb = np.array([[1, 2, 3],\n              [4, 5, 6]])\nb.shape        # (2, 3)    2 rows, 3 columns\n\nb.reshape(3, 2)   # rearrange to 3 rows, 2 columns\nb.reshape(-1, 1)  # -1 means 'work it out': gives (6, 1)",
    key: "shape = how big in each direction. dtype = the one type all elements share." },

  { h: "3 · axis — the rule that stops the guessing",
    ps: [
      "Everyone guesses at axis=0 versus axis=1 and gets it wrong half the time. Here is the rule that fixes it permanently:",
      "THE AXIS YOU NAME IS THE AXIS THAT DISAPPEARS.",
      "Say it out loud when you write it. If you have a (2, 3) array and you sum with axis=0, the 2 disappears and you are left with 3 numbers — one per column. If you sum with axis=1, the 3 disappears and you get 2 numbers — one per row."
    ],
    ex: { t: "Worked out with real numbers",
      x: "  b = [[1, 2, 3],\n       [4, 5, 6]]        shape (2, 3)\n\n  b.sum(axis=0)   ->  [5, 7, 9]      shape (3,)\n      The 2 vanished. We collapsed DOWN the rows.\n      1+4=5,  2+5=7,  3+6=9   -> one result per COLUMN\n\n  b.sum(axis=1)   ->  [6, 15]        shape (2,)\n      The 3 vanished. We collapsed ACROSS the columns.\n      1+2+3=6,  4+5+6=15      -> one result per ROW\n\n  b.sum()         ->  21             everything collapses" },
    key: "The axis you name is the axis that disappears." },

  { h: "4 · Vectorisation — stop writing loops",
    ps: [
      "Vectorisation means applying an operation to a whole array at once instead of looping element by element. NumPy does the loop for you, in C.",
      "Beyond speed, vectorised code is shorter and closer to the maths you are trying to express."
    ],
    code: "# SLOW — a Python loop\nresult = []\nfor x in data:\n    result.append(x * 2 + 1)\n\n# FAST — vectorised. Same thing, ~100x quicker.\nresult = data * 2 + 1\n\n# Standardising every column (you will use this constantly):\nz = (X - X.mean(axis=0)) / X.std(axis=0)",
    key: "If you are writing a for-loop over a NumPy array, there is almost always a vectorised way." },

  { h: "5 · Broadcasting — the part people find confusing",
    ps: [
      "Broadcasting is how NumPy handles operations between arrays of DIFFERENT shapes. Instead of erroring, it stretches the smaller one to match — without actually copying any memory.",
      "There are exactly two rules. Compare the shapes from the RIGHT-hand side. For each pair of dimensions, they are compatible if they are equal, OR if one of them is 1. If a dimension is missing on one side, treat it as 1.",
      "That is all. Everything else follows."
    ],
    ex: { t: "Broadcasting, step by step",
      x: "EXAMPLE 1 — subtract a column mean from every row\n\n  X.shape     = (100, 3)     100 houses, 3 features\n  means.shape =      (3,)    one mean per feature\n\n  Line them up from the RIGHT:\n        (100, 3)\n             (3)\n  Rightmost pair: 3 vs 3  -> equal, fine.\n  Next: 100 vs nothing    -> missing counts as 1, fine.\n\n  So means is treated as if repeated 100 times. Result: (100, 3).\n  X - means  subtracts the right mean from every column. One line.\n\n\nEXAMPLE 2 — the trap that eats your memory\n\n  a.shape = (1000, 1)    a column\n  b.shape =    (1, 1000) a row\n\n  Line up from the right:\n        (1000,    1)\n        (   1, 1000)\n  Rightmost: 1 vs 1000 -> one is 1, so it stretches. Fine.\n  Next:   1000 vs 1    -> one is 1, so it stretches. Fine.\n\n  Result: (1000, 1000) — a MILLION numbers.\n  You wanted 1000 results and silently got a million. No error. This is the\n  classic broadcasting bug." },
    key: "Align shapes from the right. Each pair must be equal, or one must be 1. Missing = 1." },

  { h: "6 · Selecting data: masks and fancy indexing",
    ps: [
      "You can index a NumPy array with a boolean array of the same shape. It keeps only the positions that are True. This is called a boolean mask and it is used constantly.",
      "np.where(condition, value_if_true, value_if_false) is the vectorised version of an if/else."
    ],
    code: "a = np.array([1, -2, 3, -4, 5])\n\na > 0            # array([True, False, True, False, True])  <- the mask\na[a > 0]         # array([1, 3, 5])                        <- apply it\na[a > 0] = 0     # you can assign through a mask too\n\nnp.where(a > 0, a, 0)      # keep positives, replace negatives with 0\n\n# top 3 values without sorting the whole array:\nnp.argpartition(a, -3)[-3:]",
    key: "mask = a boolean array. array[mask] keeps only the True positions." },

  { h: "7 · The three bugs that will bite you",
    ps: [
      "ONE. The star operator * is element-by-element multiplication, NOT matrix multiplication. For matrix multiply use the @ operator. Mixing these up produces wrong numbers with no error message.",
      "TWO. Broadcasting an (n,1) with a (1,n) gives you an (n,n). Check your output shape whenever a result looks strange or memory spikes.",
      "THREE. Slicing a NumPy array gives you a VIEW, not a copy. Modifying the slice modifies the original array. Use .copy() when you want independence."
    ],
    code: "A * B     # element-wise: multiply matching positions\nA @ B     # matrix multiply (the linear algebra one)\n\ns = a[1:4]      # a VIEW into a — shares memory\ns[0] = 999      # this CHANGES a as well!\n\ns = a[1:4].copy()   # independent copy",
    key: "* is element-wise, @ is matrix multiply. Slices are views, not copies." }
  ]
};

/* ---------------------------------------------------------- DAY 3 */
window.DEEP[3] = {
  mins: 45,
  intro: "You will spend more time in pandas than in any other library, all sprint and all career. Fluency here is the difference between finishing a take-home and running out of time.",
  secs: [

  { h: "1 · Series and DataFrame",
    ps: [
      "A SERIES is a single column of data with labels attached. Think of one column of a spreadsheet, where each row also has a name.",
      "A DATAFRAME is a collection of Series sharing the same row labels. Think of the whole spreadsheet.",
      "One important difference from a spreadsheet: each column has ONE type. A whole column is integers, or strings, or dates. Not a mixture."
    ],
    code: "import pandas as pd\n\ns = pd.Series([10, 20, 30], index=['a', 'b', 'c'])\n\ndf = pd.DataFrame({\n    'name': ['Ann', 'Bob', 'Cat'],\n    'age':  [25, 32, 28],\n    'city': ['Boston', 'Delhi', 'Boston'],\n})\n\ndf.shape     # (3, 3)\ndf.dtypes    # name: object, age: int64, city: object\ndf.head()    # first 5 rows — always look before you act",
    key: "Series = one labelled column. DataFrame = several Series sharing row labels." },

  { h: "2 · The index — and why mysterious NaNs appear",
    ps: [
      "Every DataFrame has an index: the row labels down the left side. By default it is 0, 1, 2, 3… but it can be anything — dates, customer IDs, names.",
      "The index is not decoration. pandas ALIGNS on it during operations. When you add two Series together, pandas matches them up by label, not by position.",
      "This is the cause of the classic 'why is my result full of NaN' problem."
    ],
    ex: { t: "Alignment producing NaN",
      x: "  s1 = pd.Series([1, 2, 3], index=['a', 'b', 'c'])\n  s2 = pd.Series([10, 20, 30], index=['b', 'c', 'd'])\n\n  s1 + s2  gives:\n\n     a     NaN     <- 'a' exists only in s1, nothing to add\n     b    12.0     <- 2 + 10, matched by LABEL\n     c    23.0     <- 3 + 20\n     d     NaN     <- 'd' exists only in s2\n\n  Note it did NOT add 1+10, 2+20, 3+30 by position. It matched labels.\n  If you ever get unexpected NaNs after an operation, check your indexes first.\n  .reset_index(drop=True) makes both sides use plain 0,1,2 again." },
    key: "pandas aligns by index label, not by position. Mystery NaNs are usually misaligned indexes." },

  { h: "3 · loc vs iloc — the most common pandas confusion",
    ps: [
      ".loc selects by LABEL. .iloc selects by integer POSITION.",
      "There is one more difference that catches everyone: .loc INCLUDES the end of a slice, .iloc EXCLUDES it (like normal Python slicing).",
      "Practical rule: use .loc for real work, because it keeps working after you filter or sort rows. Use .iloc only when you genuinely mean 'the third row from the top'."
    ],
    ex: { t: "The inclusive/exclusive difference, shown",
      x: "  df = pd.DataFrame({'age': [25, 32, 28, 41]},\n                    index=['w', 'x', 'y', 'z'])\n\n  df.loc['w':'y']    -> rows w, x, y      THREE rows. End INCLUDED.\n  df.iloc[0:2]       -> rows w, x         TWO rows.   End EXCLUDED.\n\n  df.loc['x', 'age']   -> 32     row labelled 'x', column 'age'\n  df.iloc[1, 0]        -> 32     row at position 1, column at position 0\n\n  Why .loc is safer: after df.sort_values('age'), position 1 is now a\n  different row — but the label 'x' still refers to the same person." },
    key: "loc = labels, end included. iloc = positions, end excluded." },

  { h: "4 · Filtering rows — and the parentheses trap",
    ps: [
      "You filter by putting a condition inside square brackets. The condition produces a True/False value for every row, and pandas keeps the True ones.",
      "When you combine two conditions you MUST wrap each in parentheses, and use & for 'and', | for 'or'. Not the words 'and' / 'or'. This is because of how Python's operator precedence works, and forgetting it gives a confusing error every single time."
    ],
    code: "df[df.age > 30]                              # one condition, fine\n\ndf[(df.age > 30) & (df.city == 'Boston')]    # CORRECT\ndf[df.age > 30 & df.city == 'Boston']        # ERROR — no parentheses\ndf[(df.age > 30) and (df.city == 'Boston')]  # ERROR — 'and' not '&'\n\ndf[df.city.isin(['Boston', 'Delhi'])]        # matching several values\ndf[~df.city.isin(['Boston'])]                # ~ means NOT",
    key: "Wrap each condition in parentheses. Use & and |, never 'and' / 'or'." },

  { h: "5 · Missing data — the part interviews actually probe",
    ps: [
      "Finding missing values is easy: df.isna().sum() gives you a count per column. The hard part is deciding what to do, and that depends on WHY the value is missing. There are three cases, and knowing their names is a genuine interview differentiator.",
      "MCAR — Missing Completely At Random. The missingness has nothing to do with anything. A sensor glitched; a form page failed to load. Safe to drop rows if there are few, or impute simply.",
      "MAR — Missing At Random (badly named). The missingness depends on some OTHER column you can see. For example, older respondents skip the income question more often — so missingness depends on age, which you have. You can predict and impute it sensibly using the other columns.",
      "MNAR — Missing Not At Random. The missingness depends on the missing value ITSELF. High earners refuse to state their income. You cannot fix this from the data alone, because the very thing that predicts missingness is the thing you do not have.",
      "For MNAR especially, the fact that it is missing is itself information. Which brings us to the single most useful trick here."
    ],
    ex: { t: "Add a 'was missing' flag — do this often",
      x: "  df['income_was_missing'] = df['income'].isna().astype(int)\n  df['income'] = df['income'].fillna(df['income'].median())\n\n  You have now kept BOTH pieces of information:\n    - a reasonable filled-in value, so the row is usable\n    - the fact that it was originally missing, which may itself predict the target\n\n  In a loan-default model, 'refused to state income' can be more predictive\n  than any actual income number. Throwing that away loses real signal.\n\n  CRITICAL: compute the median on the TRAINING data only, then apply that same\n  value to the test data. Computing it over everything leaks information from\n  your test set into training — you will meet this again on day 15." },
    key: "Diagnose why it is missing (MCAR / MAR / MNAR). Add a was_missing flag. Fit imputers on training data only." },

  { h: "6 · dtypes and memory",
    ps: [
      "The 'object' dtype means Python strings, and it is both slow and enormous. If a column has repeated text values — a city, a category, a status — converting it to 'category' can cut memory by 90%+ because pandas then stores each distinct value once and uses small integer codes.",
      "Also parse dates when you read the file, not afterwards. A date stored as text is useless; as a datetime you can extract month, weekday, and compute differences."
    ],
    code: "df.info(memory_usage='deep')     # the honest memory number\n\ndf['city'] = df['city'].astype('category')\n\npd.read_csv('f.csv', parse_dates=['order_date'])\n\ndf['order_date'].dt.month        # now you can do this\ndf['order_date'].dt.dayofweek",
    key: "Repeated strings -> category. Parse dates at read time with parse_dates." },

  { h: "7 · SettingWithCopyWarning — what it actually means",
    ps: [
      "Sooner or later you will see SettingWithCopyWarning. It is not noise and you should not ignore it.",
      "It means pandas is not sure whether you are modifying the original DataFrame or a temporary copy of it. If it is a copy, your change silently disappears — no error, just a value that did not update.",
      "It happens when you index twice in a row (chained indexing)."
    ],
    code: "# RISKY — chained indexing, may modify a temporary copy\ndf[df.age > 30]['city'] = 'Boston'\n\n# CORRECT — one .loc call, unambiguous\ndf.loc[df.age > 30, 'city'] = 'Boston'\n\n# Or take a deliberate copy when you want a separate object\nadults = df[df.age > 30].copy()\nadults['city'] = 'Boston'      # clearly only affects `adults`",
    key: "Fix it with a single .loc assignment, or an explicit .copy()." }
  ]
};

/* ---------------------------------------------------------- DAY 4 */
window.DEEP[4] = {
  mins: 45,
  intro: "Yesterday was about one table. Today is about summarising and combining tables — which is what real analysis actually consists of.",
  secs: [

  { h: "1 · Split, apply, combine",
    ps: [
      "groupby is the single most useful thing in pandas, and it always does the same three steps.",
      "SPLIT the rows into buckets by some key. APPLY a function to each bucket. COMBINE the results back into one table.",
      "Once you see those three steps, every groupby question becomes readable."
    ],
    ex: { t: "The three steps, visibly",
      x: "  city     sales\n  Boston   100\n  Delhi     50\n  Boston   200\n  Delhi     70\n\n  df.groupby('city')['sales'].sum()\n\n  SPLIT     Boston -> [100, 200]     Delhi -> [50, 70]\n  APPLY     sum    ->  300           sum   ->  120\n  COMBINE\n            city     sales\n            Boston     300\n            Delhi      120" },
    key: "Split into buckets by key, apply a function to each, combine the results." },

  { h: "2 · agg vs transform vs apply",
    ps: [
      "This is asked in interviews and confuses everyone, because the difference is about the SHAPE of what comes back.",
      "agg REDUCES each group to a single value. Four rows in, two rows out (one per group). The table shrinks.",
      "transform returns a value for EVERY ORIGINAL ROW, by broadcasting the group's result back onto its members. Four rows in, four rows out. The shape is preserved. This is what you want for features like 'how far is this sale from its city's average'.",
      "apply is the flexible fallback — it can return anything — and it is the slowest, because it loses pandas' optimised paths. Use it only when neither of the others fits."
    ],
    ex: { t: "Same data, three results",
      x: "  city     sales\n  Boston   100\n  Delhi     50\n  Boston   200\n  Delhi     70\n\n  AGG — shape shrinks to one row per group\n    df.groupby('city')['sales'].agg('mean')\n      Boston   150\n      Delhi     60\n\n  TRANSFORM — shape stays at 4 rows, group value broadcast back\n    df.groupby('city')['sales'].transform('mean')\n      0    150      <- Boston's mean, on Boston's row\n      1     60      <- Delhi's mean\n      2    150\n      3     60\n\n  Which lets you build a group-relative feature in one line:\n    df['vs_city_avg'] = df.sales - df.groupby('city').sales.transform('mean')\n      100 - 150 = -50\n       50 -  60 = -10\n      200 - 150 = +50\n       70 -  60 = +10\n\n  That feature — 'how unusual is this row for its group' — is often far more\n  predictive than the raw value, and transform is the only clean way to get it." },
    key: "agg shrinks the table. transform keeps the shape. apply is the slow do-anything option." },

  { h: "3 · Joining tables",
    ps: [
      "A join combines two tables using a shared key column. The 'how' argument decides what happens to rows that do not match.",
      "INNER — keep only rows where the key exists in BOTH tables. LEFT — keep every row from the left table, filling NaN where the right has no match. RIGHT — the mirror image. OUTER — keep everything from both sides.",
      "LEFT is the one you want most often, because usually you have a main table and are enriching it with extra columns — and you do not want to silently lose rows that lack a match."
    ],
    ex: { t: "Every join type on the same tiny tables",
      x: "  orders                customers\n  id  cust  amt         cust  name\n   1    A    10            A   Ann\n   2    B    20            B   Bob\n   3    C    30            D   Dee\n\n  INNER (only A and B exist in both)\n     1  A  10  Ann\n     2  B  20  Bob                        -> 2 rows. Order 3 is LOST.\n\n  LEFT (keep all orders)\n     1  A  10  Ann\n     2  B  20  Bob\n     3  C  30  NaN                        -> 3 rows. Order 3 kept, name blank.\n\n  OUTER (keep everything)\n     1  A  10  Ann\n     2  B  20  Bob\n     3  C  30  NaN\n   NaN  D NaN  Dee                        -> 4 rows." },
    key: "inner = matches only. left = keep everything on the left. outer = keep everything." },

  { h: "4 · The join bug that silently corrupts your numbers",
    ps: [
      "This is the most dangerous thing in this lesson, so read it twice.",
      "If the key you are joining on is NOT unique in the right-hand table, every matching row on the left gets duplicated once per match. Your row count grows. No error is raised. Every total you compute afterwards is now wrong, and it looks completely plausible.",
      "The fix is to check, every single time."
    ],
    ex: { t: "How 3 rows become 5",
      x: "  orders               prices  (note: A appears TWICE)\n  id  item             item  price\n   1    A                 A     10\n   2    B                 A     12     <- duplicate key!\n   3    C                 B     20\n                          C     30\n\n  Merging on 'item' gives:\n     1  A  10\n     1  A  12      <- order 1 appeared twice\n     2  B  20\n     3  C  30\n\n  4 rows from 3 orders. Now sum the revenue: order 1 is counted twice.\n  Your revenue figure is inflated and nothing warned you.\n\n  THE FIX — make pandas shout instead of you debugging at midnight:\n\n    merged = orders.merge(prices, on='item', how='left', validate='m:1')\n\n  'm:1' asserts many-on-the-left, one-on-the-right. If the right side has\n  duplicate keys, pandas raises an error immediately.\n\n  And always: assert len(merged) == len(orders)" },
    ps2: [
      "The name for what happened: a many-to-many cartesian expansion within each key group. Every left row pairs with every matching right row.",
      "Two ways to fix it. Either DEDUPLICATE the right table (drop_duplicates on the key) if the extra rows are genuinely redundant, or AGGREGATE it down to one row per key first (groupby the key and take a sum, mean, or latest) if the duplicates are real and you want them summarised."
    ],
    key: "Duplicate keys on the right silently multiply rows — a cartesian expansion. Deduplicate or aggregate the right table first, use validate=, and assert the row count." },

  { h: "5 · Long vs wide",
    ps: [
      "The same data can be shaped two ways. WIDE has one row per entity and a column per period — easy for humans to read. LONG (or 'tidy') has one row per observation — which is what nearly every modelling and plotting library expects.",
      "melt converts wide to long. pivot / pivot_table converts long to wide."
    ],
    ex: { t: "The same numbers, both shapes",
      x: "  WIDE                          LONG (tidy)\n  name  jan  feb                name  month  value\n  Ann   100  120                Ann   jan    100\n  Bob    90  110                Ann   feb    120\n                                Bob   jan     90\n                                Bob   feb    110\n\n  wide -> long:  df.melt(id_vars='name', var_name='month', value_name='value')\n  long -> wide:  df.pivot(index='name', columns='month', values='value')\n\n  Models want LONG. Dashboards and humans want WIDE." },
    key: "melt goes wide to long. pivot goes long to wide. Models want long." },

  { h: "6 · Time-aware operations",
    ps: [
      "shift moves a column up or down, letting you compare a row to the previous one. rolling computes a moving window, like a 7-day average. Both are essential for anything with a time dimension.",
      "One critical detail you will need again on day 33: .rolling() INCLUDES the current row by default. If you are building a feature to predict the current row, that means you have leaked the answer into the input. Add .shift(1) to push the window back."
    ],
    code: "df = df.sort_values('date')\n\n# previous day's value, per user\ndf['prev'] = df.groupby('user')['sales'].shift(1)\n\n# change vs previous day\ndf['change'] = df['sales'] - df['prev']\n\n# 7-day average — WITHOUT today (safe for prediction)\ndf['avg7'] = df.groupby('user')['sales'].shift(1).rolling(7).mean()\n\n# rank within each group\ndf['rank_in_city'] = df.groupby('city')['sales'].rank(ascending=False)",
    key: "shift compares to previous rows. rolling averages a window — shift it by 1 to avoid using today's answer." }
  ]
};

/* ---------------------------------------------------------- DAY 5 */
window.DEEP[5] = {
  mins: 40,
  intro: "EDA is not making pretty charts. It is hunting for the thing that will silently break your model later. Today you build a checklist you will reuse for 85 more days.",
  secs: [

  { h: "1 · What EDA is actually for",
    ps: [
      "EDA stands for Exploratory Data Analysis. Beginners treat it as 'make some charts so the notebook looks thorough'. That scores zero with a reviewer.",
      "Its real purpose is to answer three questions before you waste a week modelling. Can this data even answer my question? What is broken in it? And what will silently sabotage me later?",
      "A chart that reveals a broken sensor, a class imbalance, or a leaking column is worth twenty histograms of columns nobody cares about."
    ],
    key: "EDA is a hunt for problems, not a gallery of charts." },

  { h: "2 · The checklist, one item at a time",
    ps: [
      "Run these eight in order, every time, on every dataset. Do not improvise.",
      "1. SHAPE AND DTYPES — how many rows and columns, and what type is each. A number stored as text will break everything downstream and is very common in real CSVs.",
      "2. TARGET DISTRIBUTION — what you are predicting. If it is a category, what percentage is each class? 50/50 and 99/1 need completely different approaches. If it is a number, is it skewed? Are there impossible values?",
      "3. MISSINGNESS — count and percentage per column, and look at the PATTERN. Do the same rows tend to be missing across several columns? That usually means a whole data source failed, not random noise.",
      "4. CARDINALITY OF CATEGORICALS — how many distinct values does each text column have. 5 is easy to one-hot encode. 10,000 needs a completely different strategy (day 26).",
      "5. IMPOSSIBLE VALUES — negative ages, dates in the future, prices of zero, 99999 used as a code for 'unknown'. These are extremely common and they poison averages.",
      "6. CORRELATION WITH THE TARGET — and this is a leakage hunt, not a feature-selection step. See section 4.",
      "7. DUPLICATES — exact duplicate rows usually mean a broken data pipeline. If they are in your data, they will be split across train and test and inflate your score.",
      "8. TIME DRIFT — if there is a date column, plot your target over time. If the relationship changes partway through, a random split will lie to you."
    ],
    key: "Eight checks, same order, every dataset. Shape, target, missing, cardinality, impossible, leakage, duplicates, drift." },

  { h: "3 · Choosing a chart",
    ps: [
      "Pick the chart from the question, not from what looks nice. If you cannot say in one sentence what question a chart answers, delete it.",
      "One variable's spread -> histogram. Comparing groups -> bar or box plot. Relationship between two numbers -> scatter. Something over time -> line. Parts of a whole -> stacked bar (and almost never a pie chart)."
    ],
    key: "State the question first, then pick the chart. No question, no chart." },

  { h: "4 · Data leakage — the thing that will hurt you most",
    ps: [
      "Leakage is when information that would NOT be available at prediction time sneaks into your training data. Your model scores brilliantly offline and then fails completely in production.",
      "The test is one question, and you should ask it of every single feature: would I actually know this value at the moment I need to make the prediction?",
      "During EDA, the warning sign is a single feature that correlates suspiciously strongly with the target. A correlation of 0.97 is almost never good luck."
    ],
    ex: { t: "Three real leaks",
      x: "  LEAK 1 — a feature that only exists after the outcome\n    Predicting customer churn, and one column is days_since_account_closed.\n    It predicts churn perfectly. It is only filled in AFTER they churn.\n    In production it is empty for everyone you care about. Useless.\n\n  LEAK 2 — a code that encodes the answer\n    Predicting loan default, and there is a column 'collections_agency_id'.\n    Only defaulted loans get sent to collections. The model finds it instantly.\n\n  LEAK 3 — the sneaky one, done by you\n    You scale your features using the mean of the WHOLE dataset, then split\n    into train and test. The training data now contains information about the\n    test set (its mean). Your test score is optimistic and dishonest.\n    Day 20 fixes this permanently with Pipelines.\n\n  THE TEST, always:\n    'At the moment I need to predict, would I really have this value?'\n    If no -> drop it, however good it looks." },
    ps2: [
      "THREE SIGNALS THAT YOU HAVE A LEAK. First, one feature with an implausibly high correlation to the target, or a model scoring an AUC near 1.0 on a problem that should be hard. Second, a feature whose value is only known AFTER the outcome you are predicting. Third — and this one surprises people — a performance gap that INVERTS, where the test score comes out better than the training score. That usually means the split was contaminated and information crossed between the two sets.",
      "The definitive check is never statistical. It is asking whether the feature is available at inference time."
    ],
    key: "Leakage = using information you would not have at prediction time. Signals: implausible correlation or AUC near 1.0, features known only after the outcome, or test scoring better than train (contamination)." },

  { h: "5 · Write a sentence under every chart",
    ps: [
      "This one habit turns a notebook into an analysis, and it is what reviewers actually read.",
      "Under each chart write what you concluded and what you will do about it. Not 'here is the distribution of age' — that is visible. Instead: 'Age is bimodal with peaks at 25 and 55, suggesting two distinct customer segments. I will test a segment feature.'",
      "At the very top of the notebook, put a Key Findings section: five bullets a manager could read without scrolling. Write it last, put it first."
    ],
    key: "Every chart gets a conclusion sentence. The notebook gets a Key Findings section at the top." }
  ]
};

/* ---------------------------------------------------------- DAY 6 */
window.DEEP[6] = {
  mins: 50,
  intro: "Almost every data-adjacent co-op screens SQL, including ML engineering roles. The bar is consistently joins, aggregation, and window functions. Window functions are where candidates freeze.",
  secs: [

  { h: "1 · SQL runs in a different order than you write it",
    ps: [
      "You WRITE: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY.",
      "It RUNS: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.",
      "This single fact explains two things that otherwise seem arbitrary. First, you cannot use a column alias you created in SELECT inside your WHERE clause — WHERE runs before SELECT exists. Second, you CAN use that alias in ORDER BY, because ORDER BY runs after SELECT.",
      "It also explains WHERE versus HAVING, which is the next section."
    ],
    key: "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT — that is the true order." },

  { h: "2 · WHERE vs HAVING",
    ps: [
      "WHERE filters individual ROWS, and it runs BEFORE grouping. HAVING filters GROUPS, and it runs AFTER grouping.",
      "So: to remove rows before summarising, use WHERE. To keep only the groups whose summary meets a condition, use HAVING."
    ],
    ex: { t: "Both in one query",
      x: "  SELECT city, COUNT(*) AS n\n  FROM orders\n  WHERE amount > 10        -- throw away cheap ORDERS first\n  GROUP BY city\n  HAVING COUNT(*) > 5      -- then keep only busy CITIES\n\n  WHERE runs first, on rows.  HAVING runs last, on the grouped result.\n  You cannot put COUNT(*) in WHERE — at that point the groups do not exist yet." },
    key: "WHERE filters rows before grouping. HAVING filters groups after." },

  { h: "3 · Joins, and the trap that turns LEFT into INNER",
    ps: [
      "Joins in SQL work exactly like the pandas merges from day 4. INNER keeps matches only; LEFT keeps every row of the left table.",
      "But there is a trap unique to SQL, and it is asked in interviews.",
      "If you write a LEFT JOIN and then put a condition on the RIGHT table in the WHERE clause, you silently turn it back into an INNER JOIN. Why? Because unmatched rows have NULL in every right-hand column, and any comparison with NULL is not true — so WHERE throws those rows away, which is exactly what LEFT JOIN was supposed to preserve.",
      "The fix: put conditions about the right table in the ON clause, not in WHERE."
    ],
    ex: { t: "The trap, and the fix",
      x: "  -- BROKEN: this is now effectively an INNER JOIN\n  SELECT c.name, o.amount\n  FROM customers c\n  LEFT JOIN orders o ON c.id = o.cust_id\n  WHERE o.amount > 100\n\n  Customers with no orders have o.amount = NULL.\n  NULL > 100 is not true -> WHERE removes them.\n  You lost exactly the rows LEFT JOIN existed to keep.\n\n  -- CORRECT: condition moves into ON\n  SELECT c.name, o.amount\n  FROM customers c\n  LEFT JOIN orders o ON c.id = o.cust_id AND o.amount > 100\n\n  Now customers with no matching order are kept, with NULL amounts." },
    key: "In a LEFT JOIN, conditions on the right table belong in ON, not WHERE." },

  { h: "4 · Window functions — the actual interview topic",
    ps: [
      "A GROUP BY collapses many rows into one. A WINDOW FUNCTION computes a group-level value but KEEPS every original row, adding the answer alongside.",
      "The syntax is: FUNCTION() OVER (PARTITION BY something ORDER BY something). PARTITION BY is 'group by' for windows. ORDER BY decides the ordering within each partition, which matters for ranking and running totals.",
      "The three ranking functions differ only in how they handle ties, and this is asked constantly."
    ],
    ex: { t: "The three ranking functions side by side",
      x: "  Salaries: 100, 90, 90, 80\n\n  salary   ROW_NUMBER   RANK   DENSE_RANK\n    100         1         1         1\n     90         2         2         2\n     90         3         2         2      <- tie\n     80         4         4         3\n                                    ^\n  ROW_NUMBER  always distinct: 1,2,3,4 — breaks ties arbitrarily\n  RANK        ties share, then SKIPS:  1,2,2,4\n  DENSE_RANK  ties share, NO skip:     1,2,2,3\n\n  Use ROW_NUMBER for deduplication and top-N.\n  Use RANK when the gap after a tie is meaningful (like sports placings).\n  Use DENSE_RANK for 'the 2nd highest distinct salary'.\n\n\n  OTHER ESSENTIAL WINDOW FUNCTIONS\n\n  LAG(sales, 1) OVER (PARTITION BY city ORDER BY month)\n     -> the previous month's value on the same row. Month-over-month growth.\n\n  SUM(sales) OVER (PARTITION BY city ORDER BY month)\n     -> a running total that accumulates down the rows." },
    key: "GROUP BY collapses rows. Window functions keep every row and add the group value beside it." },

  { h: "5 · Top-N-per-group — memorise this pattern",
    ps: [
      "This single pattern answers a large share of all SQL interview questions: top 3 earners per department, most recent order per customer, best-selling product per region.",
      "Number the rows within each group, then filter on that number. It always looks the same."
    ],
    ex: { t: "The pattern",
      x: "  WITH ranked AS (\n      SELECT *,\n             ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn\n      FROM employees\n  )\n  SELECT * FROM ranked WHERE rn <= 3;\n\n  WITH ... AS (...) is a CTE — a named temporary result you can then query.\n  It exists because you cannot filter on a window function in WHERE directly\n  (window functions run after WHERE — see section 1).\n\n  Swap ROW_NUMBER for DENSE_RANK if ties should all be included.\n\n\n  RELATED CLASSIC — second highest salary\n\n    SELECT MAX(salary) FROM emp\n    WHERE salary < (SELECT MAX(salary) FROM emp);\n\n  Returns NULL cleanly if there is no second value.\n  Window version, which handles ties as one logical rank:\n\n    WITH r AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) d FROM emp)\n    SELECT DISTINCT salary FROM r WHERE d = 2;" },
    key: "CTE + ROW_NUMBER() OVER (PARTITION BY group ORDER BY metric DESC), then filter rn <= N." },

  { h: "6 · NULL traps",
    ps: [
      "NULL means 'unknown', and it does not behave like a value. NULL = NULL is not true — it is unknown. You must use IS NULL.",
      "COUNT(*) counts every row including NULLs. COUNT(column) counts only rows where that column is not NULL. The difference between them tells you how many NULLs there are.",
      "And the nastiest one: NOT IN with a subquery that contains even a single NULL returns ZERO rows, always. Because 'x is not equal to unknown' can never be proven true. Use NOT EXISTS instead."
    ],
    code: "WHERE col IS NULL          -- correct\nWHERE col = NULL           -- always false, never matches\n\nCOUNT(*)        -- all rows\nCOUNT(col)      -- rows where col is not null\n\n-- DANGER: returns nothing if the subquery has any NULL\nWHERE id NOT IN (SELECT cust_id FROM orders)\n\n-- SAFE\nWHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.cust_id = c.id)\n\nCOALESCE(col, 0)     -- replace NULL with a default",
    key: "Use IS NULL. COUNT(*) includes NULLs, COUNT(col) does not. Never NOT IN with possible NULLs." }
  ]
};

/* ---------------------------------------------------------- DAY 7 */
window.DEEP[7] = {
  mins: 25,
  intro: "A lighter day on purpose. Today you consolidate week 1 and ship something finished — because six half-done notebooks are worth less than one complete one.",
  secs: [

  { h: "1 · Why re-deriving beats re-reading",
    ps: [
      "Re-reading your notes feels productive and is one of the least effective ways to study. It creates RECOGNITION — you see the answer and think 'yes, I knew that'.",
      "Interviews test RECALL — producing the answer from nothing, out loud, under mild stress. These are different skills and only one of them gets you hired.",
      "The fix is retrieval practice: close everything, and explain the concept from memory. The struggle to remember is exactly what strengthens the memory. If it feels uncomfortable, it is working."
    ],
    key: "Recognition is not recall. Close the notes and explain it out loud." },

  { h: "2 · Answering 'walk me through how you explore a new dataset'",
    ps: [
      "This is a real interview question and it has a good structured answer, which is just your day-5 checklist spoken aloud plus a sentence about hypotheses at the end.",
      "Say it in this order: shape and dtypes; the target's distribution, because imbalance changes everything downstream; missingness and its likely mechanism; cardinality of the categorical columns; impossible values and outliers; a correlation scan specifically to hunt leakage; duplicates; and time drift if there is a date.",
      "Then finish with the sentence that separates you from someone reciting a list: 'Then I form two or three hypotheses about what actually drives the target, and test those with targeted plots, rather than plotting everything.'"
    ],
    key: "Recite the eight checks, then say you form hypotheses and test them — that last part is what sounds senior." },

  { h: "3 · Making the notebook something a stranger can read",
    ps: [
      "Reviewers read top to bottom with about three minutes of patience. Structure for that.",
      "Put a Key Findings section at the very top: five bullets, plain English, no jargon. Move the boring cleaning code into a file in src/ and import it, so the notebook shows analysis rather than plumbing. Give every chart its conclusion sentence. End with limitations and what you would do next.",
      "That last section matters more than people expect. Stating what your analysis cannot show reads as senior. Overclaiming reads as junior."
    ],
    key: "Key Findings at the top, cleaning code moved to src/, a conclusion under every chart, limitations at the end." },

  { h: "4 · Start weak-spots.md today",
    ps: [
      "Keep a file called weak-spots.md. Every time you have to look something up TWICE, it goes in.",
      "It costs you ten seconds a day. By week 13, when you are revising for interviews, it is a personalised list of exactly your gaps — far better targeted than any generic guide, because it was generated by your own actual confusion."
    ],
    key: "Anything you look up twice goes in weak-spots.md. It becomes your week-13 revision list." }
  ]
};
