/* ============================================================
   NEETCODE 150 — ordered by pattern, scheduled across the sprint.
   Each problem carries the KEY IDEA, not a restatement of the prompt.
   `p:1` = LeetCode Premium (use neetcode.io's free mirror instead).
   ============================================================ */

window.DSA_CATS = [

{
  id: "arrays", name: "Arrays & Hashing", short: "Arrays",
  cheat: {
    title: "Arrays & Hashing",
    pts: [
      "'seen before?' -> hash SET",
      "'how many times?' -> hash MAP / Counter",
      "'pair summing to X?' -> map val->index",
      "sort = O(n log n). hash = O(n). prefer hash.",
      "prefix/suffix products avoid division",
      "bucket sort by frequency -> O(n) top-k",
      "grid constraints -> key by (r//3, c//3)"
    ],
    eq: ["seen = {}\nfor i, v in enumerate(nums):\n    if target - v in seen: return [seen[target-v], i]\n    seen[v] = i"],
    warn: "Trading space for time IS the answer here — interviewers expect you to reach for a dict immediately. Say the O(n) space cost out loud so they know it was a choice."
  },
  qs: [
    { t: "Contains Duplicate", d: "E", s: "contains-duplicate", k: "Set of seen values; or compare len(set(nums)) to len(nums)." },
    { t: "Valid Anagram", d: "E", s: "valid-anagram", k: "Counter equality. Sorting also works at O(n log n) — mention both." },
    { t: "Two Sum", d: "E", s: "two-sum", k: "One pass, map value→index, look up target−v before inserting v." },
    { t: "Group Anagrams", d: "M", s: "group-anagrams", k: "Key by sorted string, or by a 26-length count tuple for O(n·k)." },
    { t: "Top K Frequent Elements", d: "M", s: "top-k-frequent-elements", k: "Count, then bucket sort by frequency (index = count) for O(n). Heap is the O(n log k) alternative." },
    { t: "Encode and Decode Strings", d: "M", s: "encode-and-decode-strings", p: 1, k: "Length-prefix each string: '5#hello'. Delimiters alone break on strings containing the delimiter." },
    { t: "Product of Array Except Self", d: "M", s: "product-of-array-except-self", k: "Prefix pass then suffix pass, both into the output array. No division — handles zeros." },
    { t: "Valid Sudoku", d: "M", s: "valid-sudoku", k: "Three sets per index; box key is (r//3, c//3). One pass." },
    { t: "Longest Consecutive Sequence", d: "M", s: "longest-consecutive-sequence", k: "Set of all nums; only start counting at v where v−1 is absent. That guard is what makes it O(n)." }
  ]
},

{
  id: "twop", name: "Two Pointers", short: "Two Ptr",
  cheat: {
    title: "Two Pointers",
    pts: [
      "SORTED array + find a pair -> converge from ends",
      "sum too small -> move LEFT up",
      "sum too big  -> move RIGHT down",
      "palindrome / reverse -> ends inward",
      "3Sum = sort + fix one + two-pointer the rest",
      "SKIP DUPLICATES after every match",
      "O(n) time, O(1) space — the whole appeal"
    ],
    eq: ["l, r = 0, len(a)-1\nwhile l < r:\n    s = a[l] + a[r]\n    if s == t: return (l, r)\n    if s < t: l += 1\n    else: r -= 1"],
    warn: "Two pointers requires SORTED input (or monotone structure). If order matters and you can't sort, you need a hash map instead."
  },
  qs: [
    { t: "Valid Palindrome", d: "E", s: "valid-palindrome", k: "Ends inward, skip non-alphanumeric with while-loops inside the main loop." },
    { t: "Two Sum II - Input Array Is Sorted", d: "M", s: "two-sum-ii-input-array-is-sorted", k: "The canonical converge-from-ends. Sortedness is what makes O(1) space possible." },
    { t: "3Sum", d: "M", s: "3sum", k: "Sort, fix i, two-pointer the remainder. Skip duplicate i and duplicate l after a hit." },
    { t: "Container With Most Water", d: "M", s: "container-with-most-water", k: "Always move the SHORTER wall — moving the taller one can never increase area." },
    { t: "Trapping Rain Water", d: "H", s: "trapping-rain-water", k: "Track maxLeft/maxRight; water above i = min(maxL, maxR) − h[i]. Move the pointer on the smaller side." }
  ]
},

{
  id: "window", name: "Sliding Window", short: "Window",
  cheat: {
    title: "Sliding Window",
    pts: [
      "'longest/shortest SUBARRAY with property'",
      "expand right always; shrink left while invalid",
      "each element enters + leaves once -> O(n)",
      "variable window -> while-loop shrink",
      "fixed window k -> add r, remove r-k",
      "track state in a Counter, not by re-scanning",
      "longest-repeating: len(win) - maxFreq <= k"
    ],
    eq: ["l = 0\nfor r in range(n):\n    add(a[r])\n    while invalid():\n        remove(a[l]); l += 1\n    best = max(best, r - l + 1)"],
    warn: "The classic bug is re-computing the window's state from scratch inside the loop, silently making it O(n²). Maintain state incrementally."
  },
  qs: [
    { t: "Best Time to Buy and Sell Stock", d: "E", s: "best-time-to-buy-and-sell-stock", k: "Track min price so far; profit = price − min. A window in disguise." },
    { t: "Longest Substring Without Repeating Characters", d: "M", s: "longest-substring-without-repeating-characters", k: "Set of window chars; shrink from left while the new char is already inside." },
    { t: "Longest Repeating Character Replacement", d: "M", s: "longest-repeating-character-replacement", k: "Window is valid while (windowLen − maxFreq) ≤ k. maxFreq needn't be decremented — that's the trick." },
    { t: "Permutation in String", d: "M", s: "permutation-in-string", k: "Fixed window of len(s1); compare count arrays, or maintain a 'matches' counter for O(1) checks." },
    { t: "Minimum Window Substring", d: "H", s: "minimum-window-substring", k: "Need/have counters plus a 'formed' count. Expand to satisfy, then shrink to minimise." },
    { t: "Sliding Window Maximum", d: "H", s: "sliding-window-maximum", k: "Monotonic decreasing deque of indices; front is the max, pop from back anything smaller." }
  ]
},

{
  id: "stack", name: "Stack", short: "Stack",
  cheat: {
    title: "Stack",
    pts: [
      "matching / nesting / undo -> stack",
      "'next greater/smaller' -> MONOTONIC stack",
      "increasing stack -> finds next SMALLER",
      "decreasing stack -> finds next GREATER",
      "push index, not value, when you need distance",
      "amortised O(n): each item pushed+popped once",
      "histogram: pop while h[stack[-1]] > h[i]"
    ],
    eq: ["for i, v in enumerate(a):\n    while st and a[st[-1]] < v:\n        j = st.pop(); res[j] = i - j\n    st.append(i)"],
    warn: "Monotonic stack is one pattern with many disguises: daily temperatures, car fleet, largest rectangle, next greater element. Learn to recognise it and four problems collapse into one."
  },
  qs: [
    { t: "Valid Parentheses", d: "E", s: "valid-parentheses", k: "Push openers, pop and match on closers, stack must be empty at the end." },
    { t: "Min Stack", d: "M", s: "min-stack", k: "Second stack of running minimums, pushed in lockstep. O(1) getMin." },
    { t: "Evaluate Reverse Polish Notation", d: "M", s: "evaluate-reverse-polish-notation", k: "Push numbers; on an operator pop two (mind the order for − and /)." },
    { t: "Generate Parentheses", d: "M", s: "generate-parentheses", k: "Backtracking with counts: add '(' if open < n, add ')' if close < open." },
    { t: "Daily Temperatures", d: "M", s: "daily-temperatures", k: "Monotonic decreasing stack of INDICES; distance = i − poppedIndex." },
    { t: "Car Fleet", d: "M", s: "car-fleet", k: "Sort by position descending; a car joins the fleet ahead if its arrival time is ≤ the stack top's." },
    { t: "Largest Rectangle in Histogram", d: "H", s: "largest-rectangle-in-histogram", k: "Monotonic increasing stack; when popping, the width extends back to the previous stack entry." }
  ]
},

{
  id: "bsearch", name: "Binary Search", short: "BinSearch",
  cheat: {
    title: "Binary Search",
    pts: [
      "sorted OR monotonic predicate -> binary search",
      "'minimum X that works' -> search the ANSWER space",
      "mid = l + (r-l)//2  (overflow-safe habit)",
      "l<=r with r=n-1 -> finding a value",
      "l<r  with r=n   -> finding a boundary",
      "rotated: one half is always sorted — test which",
      "O(log n); on answer space O(n log(range))"
    ],
    eq: ["while l < r:\n    m = l + (r - l)//2\n    if ok(m): r = m       # m might be the answer\n    else:     l = m + 1\nreturn l"],
    warn: "Infinite loops come from mixing the two templates. Pick ONE (boundary-search above) and use it everywhere — it handles almost every variant."
  },
  qs: [
    { t: "Binary Search", d: "E", s: "binary-search", k: "The base template. Write it once, cleanly, and reuse the shape." },
    { t: "Search a 2D Matrix", d: "M", s: "search-a-2d-matrix", k: "Treat it as one sorted array of length m·n; index → (i//n, i%n)." },
    { t: "Koko Eating Bananas", d: "M", s: "koko-eating-bananas", k: "Binary search the ANSWER (speed 1..max), predicate = hours needed ≤ h. The archetype." },
    { t: "Find Minimum in Rotated Sorted Array", d: "M", s: "find-minimum-in-rotated-sorted-array", k: "Compare a[m] to a[r]: if a[m] > a[r] the min is right, else it's at m or left." },
    { t: "Search in Rotated Sorted Array", d: "M", s: "search-in-rotated-sorted-array", k: "Determine which half is sorted, then check if the target lies inside that half's range." },
    { t: "Time Based Key-Value Store", d: "M", s: "time-based-key-value-store", k: "Per-key list sorted by timestamp; binary search for the largest timestamp ≤ query." },
    { t: "Median of Two Sorted Arrays", d: "H", s: "median-of-two-sorted-arrays", k: "Binary search the PARTITION of the smaller array so left halves total half the elements." }
  ]
},

{
  id: "linked", name: "Linked List", short: "LinkedList",
  cheat: {
    title: "Linked List",
    pts: [
      "DUMMY head kills 90% of edge cases",
      "reverse: prev/cur/next, three-line loop",
      "cycle / middle / nth-from-end -> FAST & SLOW",
      "fast moves 2, slow moves 1 -> meet inside cycle",
      "cycle START: reset one to head, move both by 1",
      "draw the pointers on paper before coding",
      "reorder = find mid + reverse 2nd half + merge"
    ],
    eq: ["prev = None\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev, cur = cur, nxt\nreturn prev"],
    warn: "Losing the rest of the list by reassigning .next before saving it is the single most common bug. Save nxt FIRST, always."
  },
  qs: [
    { t: "Reverse Linked List", d: "E", s: "reverse-linked-list", k: "prev/cur/nxt. Know the recursive version too — they sometimes ask for both." },
    { t: "Merge Two Sorted Lists", d: "E", s: "merge-two-sorted-lists", k: "Dummy head, splice the smaller each step, attach the remainder at the end." },
    { t: "Reorder List", d: "M", s: "reorder-list", k: "Three sub-problems: find middle (fast/slow), reverse second half, interleave." },
    { t: "Remove Nth Node From End of List", d: "M", s: "remove-nth-node-from-end-of-list", k: "Two pointers n apart; dummy head handles removing the head itself." },
    { t: "Copy List with Random Pointer", d: "M", s: "copy-list-with-random-pointer", k: "Pass 1 builds an old→new map; pass 2 wires next and random through it." },
    { t: "Add Two Numbers", d: "M", s: "add-two-numbers", k: "Carry propagation with a dummy head; loop while l1 or l2 or carry." },
    { t: "Linked List Cycle", d: "E", s: "linked-list-cycle", k: "Floyd's tortoise and hare. O(1) space is the point — a set also works but misses it." },
    { t: "Find the Duplicate Number", d: "M", s: "find-the-duplicate-number", k: "Treat values as next-pointers → cycle detection. Sneaky and worth knowing." },
    { t: "LRU Cache", d: "M", s: "lru-cache", k: "Hash map + doubly linked list. Dummy head AND tail nodes. Extremely common in real interviews." },
    { t: "Merge K Sorted Lists", d: "H", s: "merge-k-sorted-lists", k: "Min-heap of k heads → O(N log k). Or pairwise merge, same complexity." },
    { t: "Reverse Nodes in k-Group", d: "H", s: "reverse-nodes-in-k-group", k: "Check k nodes exist, reverse the group, reconnect. Pointer bookkeeping — draw it first." }
  ]
},

{
  id: "trees", name: "Trees", short: "Trees",
  cheat: {
    title: "Trees",
    pts: [
      "DFS recursion = default. BFS deque = level stuff.",
      "ask: what do I return UP vs pass DOWN?",
      "BST -> inorder traversal is SORTED",
      "BST search -> compare and go one way (O(h))",
      "'kth smallest in BST' -> inorder, count",
      "validate BST: pass down (lo, hi) bounds",
      "path-sum problems: return best-single-branch,",
      "  but UPDATE global with the split path"
    ],
    eq: ["def dfs(node):\n    if not node: return 0\n    l, r = dfs(node.left), dfs(node.right)\n    self.best = max(self.best, l + r)   # split here\n    return 1 + max(l, r)                 # extend upward"],
    warn: "Validating a BST by only checking node.left < node < node.right is WRONG — it passes for invalid trees. You must carry min/max bounds down the recursion."
  },
  qs: [
    { t: "Invert Binary Tree", d: "E", s: "invert-binary-tree", k: "Swap children, recurse. Three lines." },
    { t: "Maximum Depth of Binary Tree", d: "E", s: "maximum-depth-of-binary-tree", k: "1 + max(left, right). The base case for every tree recursion you'll write." },
    { t: "Diameter of Binary Tree", d: "E", s: "diameter-of-binary-tree", k: "Return height upward, update a global max with left+right at each node. The split-vs-extend pattern." },
    { t: "Balanced Binary Tree", d: "E", s: "balanced-binary-tree", k: "Return (height, isBalanced) together so it stays O(n) instead of O(n²)." },
    { t: "Same Tree", d: "E", s: "same-tree", k: "Both null → true; one null or values differ → false; else recurse both sides." },
    { t: "Subtree of Another Tree", d: "E", s: "subtree-of-another-tree", k: "At each node, run sameTree. O(n·m) is accepted; mention string-serialisation as the better answer." },
    { t: "Lowest Common Ancestor of a Binary Search Tree", d: "M", s: "lowest-common-ancestor-of-a-binary-search-tree", k: "Walk down; the split point (where p and q go different ways) is the LCA. O(h), no recursion needed." },
    { t: "Binary Tree Level Order Traversal", d: "M", s: "binary-tree-level-order-traversal", k: "BFS with a deque, processing exactly len(queue) nodes per level." },
    { t: "Binary Tree Right Side View", d: "M", s: "binary-tree-right-side-view", k: "BFS, take the last node of each level. Or DFS right-first, recording on first visit per depth." },
    { t: "Count Good Nodes in Binary Tree", d: "M", s: "count-good-nodes-in-binary-tree", k: "Pass the max-so-far DOWN the recursion. Classic 'pass down' problem." },
    { t: "Validate Binary Search Tree", d: "M", s: "validate-binary-search-tree", k: "Carry (lo, hi) bounds down; tighten one side at each step. Local comparison is insufficient." },
    { t: "Kth Smallest Element in a BST", d: "M", s: "kth-smallest-element-in-a-bst", k: "Inorder traversal, stop at k. Iterative stack version avoids traversing the whole tree." },
    { t: "Construct Binary Tree from Preorder and Inorder Traversal", d: "M", s: "construct-binary-tree-from-preorder-and-inorder-traversal", k: "Preorder gives the root; its index in inorder splits left/right. Hash the inorder indices for O(n)." },
    { t: "Binary Tree Maximum Path Sum", d: "H", s: "binary-tree-maximum-path-sum", k: "Return max single-branch gain (clamped at 0) upward; update global with left+node+right." },
    { t: "Serialize and Deserialize Binary Tree", d: "H", s: "serialize-and-deserialize-binary-tree", k: "Preorder with explicit null markers. Deserialise with an index pointer over the token list." }
  ]
},

{
  id: "tries", name: "Tries", short: "Tries",
  cheat: {
    title: "Tries",
    pts: [
      "prefix queries / autocomplete -> trie",
      "node = {children: dict, isEnd: bool}",
      "insert/search/startsWith all O(len(word))",
      "wildcard '.' -> recurse over ALL children",
      "word search II: trie + DFS on the grid",
      "  prune the trie branch once a word is found",
      "space cost is real: O(total chars)"
    ],
    eq: ["class Node:\n    def __init__(self):\n        self.ch = {}\n        self.end = False\n\ncur = root\nfor c in word:\n    cur = cur.ch.setdefault(c, Node())\ncur.end = True"],
    warn: "Word Search II is the payoff problem: running DFS per word is far too slow, but one DFS guided by a trie prunes dead branches immediately. That contrast is the interview point."
  },
  qs: [
    { t: "Implement Trie (Prefix Tree)", d: "M", s: "implement-trie-prefix-tree", k: "Dict of children + isEnd flag. Write it cleanly once — the next two build on it." },
    { t: "Design Add and Search Words Data Structure", d: "M", s: "design-add-and-search-words-data-structure", k: "On '.', recurse into every child. Everything else is a plain trie walk." },
    { t: "Word Search II", d: "H", s: "word-search-ii", k: "Build a trie of all words, then one grid DFS following trie edges. Prune found branches to avoid duplicates." }
  ]
},

{
  id: "heap", name: "Heap / Priority Queue", short: "Heap",
  cheat: {
    title: "Heap / Priority Queue",
    pts: [
      "'k largest/smallest/closest' -> heap of size k",
      "python heapq is a MIN-heap",
      "max-heap: push -value (negate on the way out)",
      "k-largest -> keep a MIN-heap of size k",
      "push+pop = O(log k), heapify = O(n)",
      "'median of a stream' -> TWO heaps, balanced",
      "  max-heap (low half) + min-heap (high half)"
    ],
    eq: ["import heapq\nh = []\nfor v in nums:\n    heapq.heappush(h, v)\n    if len(h) > k: heapq.heappop(h)\nreturn h[0]   # kth largest"],
    warn: "For top-k, a heap is O(n log k) but bucket sort is O(n) when values are bounded (see Top K Frequent). Know when the heap is NOT the best answer."
  },
  qs: [
    { t: "Kth Largest Element in a Stream", d: "E", s: "kth-largest-element-in-a-stream", k: "Min-heap capped at size k; the root is always the kth largest." },
    { t: "Last Stone Weight", d: "E", s: "last-stone-weight", k: "Max-heap via negation. Straightforward simulation." },
    { t: "K Closest Points to Origin", d: "M", s: "k-closest-points-to-origin", k: "Heap on squared distance — no need for sqrt. Quickselect is the O(n) alternative." },
    { t: "Kth Largest Element in an Array", d: "M", s: "kth-largest-element-in-an-array", k: "Heap of size k, or quickselect for O(n) average. Mention both." },
    { t: "Task Scheduler", d: "M", s: "task-scheduler", k: "Max-heap by count plus a cooldown queue. The closed-form counting solution is also worth knowing." },
    { t: "Design Twitter", d: "M", s: "design-twitter", k: "Per-user tweet lists with timestamps; merge followees' recent tweets with a heap. A design question in disguise." },
    { t: "Find Median from Data Stream", d: "H", s: "find-median-from-data-stream", k: "Two heaps kept balanced within 1. Always push to one, pop its top to the other, then rebalance." }
  ]
},

{
  id: "backtrack", name: "Backtracking", short: "Backtrack",
  cheat: {
    title: "Backtracking",
    pts: [
      "'all combinations/permutations/partitions'",
      "template: choose -> recurse -> UN-choose",
      "subsets: at index i, include or skip",
      "combinations: pass start index (no reuse back)",
      "permutations: used[] set, loop all indices",
      "DUPLICATES: sort first, skip a[i]==a[i-1]",
      "prune early — that's the only real optimisation",
      "complexity ~ O(2^n) or O(n!). Say so."
    ],
    eq: ["def bt(start, path):\n    res.append(path[:])\n    for i in range(start, n):\n        if i > start and a[i] == a[i-1]: continue   # skip dupes\n        path.append(a[i])\n        bt(i + 1, path)\n        path.pop()"],
    warn: "Append path[:] not path — appending the list itself stores a reference that you then mutate, and every result ends up identical. This bug costs people the interview."
  },
  qs: [
    { t: "Subsets", d: "M", s: "subsets", k: "Include/exclude at each index. The base template for everything below." },
    { t: "Combination Sum", d: "M", s: "combination-sum", k: "Reuse allowed → recurse with the SAME index i, not i+1." },
    { t: "Permutations", d: "M", s: "permutations", k: "Loop all indices with a used[] set, or swap-in-place." },
    { t: "Subsets II", d: "M", s: "subsets-ii", k: "Sort, then skip a[i]==a[i-1] when i > start. The canonical dedupe guard." },
    { t: "Combination Sum II", d: "M", s: "combination-sum-ii", k: "Same dedupe guard as Subsets II, but recurse with i+1 since each number is used once." },
    { t: "Word Search", d: "M", s: "word-search", k: "Grid DFS with in-place marking (set cell to '#'), restore on the way out." },
    { t: "Palindrome Partitioning", d: "M", s: "palindrome-partitioning", k: "Try every prefix; recurse only if that prefix is a palindrome." },
    { t: "Letter Combinations of a Phone Number", d: "M", s: "letter-combinations-of-a-phone-number", k: "Digit→letters map, recurse position by position. Handle empty input." },
    { t: "N-Queens", d: "H", s: "n-queens", k: "Track columns and both diagonals as sets: (r+c) and (r−c) uniquely identify diagonals." }
  ]
},

{
  id: "graphs", name: "Graphs", short: "Graphs",
  cheat: {
    title: "Graphs",
    pts: [
      "grid = graph. cell = node, neighbour = edge.",
      "shortest path (unweighted) -> BFS",
      "connectivity / flood fill -> DFS or BFS",
      "MULTI-SOURCE: seed the queue with ALL starts",
      "cycle in DIRECTED -> 3-colour DFS or Kahn",
      "topological order -> Kahn's (indegree queue)",
      "  if output length < n -> there's a cycle",
      "ALWAYS mark visited on ENQUEUE, not dequeue"
    ],
    eq: ["q = deque(starts); seen = set(starts)\nwhile q:\n    for _ in range(len(q)):      # one level\n        r, c = q.popleft()\n        for nr, nc in nbrs(r, c):\n            if ok(nr,nc) and (nr,nc) not in seen:\n                seen.add((nr,nc)); q.append((nr,nc))\n    steps += 1"],
    warn: "Marking visited on dequeue instead of enqueue lets the same node enter the queue many times — it still produces the right answer but blows up to exponential time on dense graphs."
  },
  qs: [
    { t: "Number of Islands", d: "M", s: "number-of-islands", k: "Scan the grid; on each unvisited land cell, flood-fill and increment. The graph base case." },
    { t: "Clone Graph", d: "M", s: "clone-graph", k: "DFS with an old→new hash map, which doubles as the visited set." },
    { t: "Max Area of Island", d: "M", s: "max-area-of-island", k: "Same as Number of Islands, but the DFS returns a size instead of nothing." },
    { t: "Pacific Atlantic Water Flow", d: "M", s: "pacific-atlantic-water-flow", k: "Reverse the flow: DFS INWARD from each ocean's border, then intersect the two reachable sets." },
    { t: "Surrounded Regions", d: "M", s: "surrounded-regions", k: "Mark border-connected 'O's as safe first, then flip everything else. Solve the complement." },
    { t: "Rotting Oranges", d: "M", s: "rotting-oranges", k: "Multi-source BFS: seed the queue with every rotten orange, count levels." },
    { t: "Walls and Gates", d: "M", s: "walls-and-gates", p: 1, k: "Multi-source BFS from all gates simultaneously. One pass, not one BFS per gate." },
    { t: "Course Schedule", d: "M", s: "course-schedule", k: "Cycle detection in a directed graph — DFS with a recursion-stack set, or Kahn's algorithm." },
    { t: "Course Schedule II", d: "M", s: "course-schedule-ii", k: "Same as above but output the topological order. Kahn's is cleaner here." },
    { t: "Redundant Connection", d: "M", s: "redundant-connection", k: "Union-Find: the first edge whose endpoints already share a root is the answer." },
    { t: "Number of Connected Components in an Undirected Graph", d: "M", s: "number-of-connected-components-in-an-undirected-graph", p: 1, k: "Union-Find with a component counter, decremented on each successful union." },
    { t: "Graph Valid Tree", d: "M", s: "graph-valid-tree", p: 1, k: "A tree ⟺ exactly n−1 edges AND fully connected. Both conditions, not one." },
    { t: "Word Ladder", d: "H", s: "word-ladder", k: "BFS over words; build neighbours via wildcard patterns (h*t) to avoid O(n²) comparisons." }
  ]
},

{
  id: "advgraphs", name: "Advanced Graphs", short: "Adv Graphs",
  cheat: {
    title: "Advanced Graphs",
    pts: [
      "weighted shortest path -> DIJKSTRA (heap)",
      "negative weights / ≤k edges -> BELLMAN-FORD",
      "minimum spanning tree -> PRIM (heap) or KRUSKAL",
      "use ALL edges exactly once -> Eulerian path",
      "topological sort on chars -> Alien Dictionary",
      "Dijkstra: O(E log V), push (dist, node)",
      "skip a popped node if already finalised"
    ],
    eq: ["h = [(0, src)]; dist = {}\nwhile h:\n    d, u = heapq.heappop(h)\n    if u in dist: continue\n    dist[u] = d\n    for v, w in adj[u]:\n        if v not in dist: heapq.heappush(h, (d + w, v))"],
    warn: "Cheapest Flights Within K Stops is NOT plain Dijkstra — the stop limit breaks its greedy assumption. Use Bellman-Ford relaxed exactly k+1 times, on a COPY of dist each round."
  },
  qs: [
    { t: "Reconstruct Itinerary", d: "H", s: "reconstruct-itinerary", k: "Hierholzer's algorithm: DFS greedily in lexical order, append on the way OUT, reverse at the end." },
    { t: "Min Cost to Connect All Points", d: "M", s: "min-cost-to-connect-all-points", k: "MST on a complete graph with Manhattan distance. Prim's with a heap." },
    { t: "Network Delay Time", d: "M", s: "network-delay-time", k: "Plain Dijkstra from k; answer is the max finalised distance, or −1 if any node is unreachable." },
    { t: "Swim in Rising Water", d: "H", s: "swim-in-rising-water", k: "Dijkstra where path cost is the MAX cell along the path, not the sum. Or binary search + BFS." },
    { t: "Alien Dictionary", d: "H", s: "alien-dictionary", p: 1, k: "Build char-order edges from adjacent word pairs, then topological sort. Watch the invalid-prefix case." },
    { t: "Cheapest Flights Within K Stops", d: "M", s: "cheapest-flights-within-k-stops", k: "Bellman-Ford, k+1 rounds, relaxing from a snapshot of the previous round's distances." }
  ]
},

{
  id: "dp1", name: "1-D Dynamic Programming", short: "1-D DP",
  cheat: {
    title: "1-D DP",
    pts: [
      "overlapping subproblems + optimal substructure",
      "1. define dp[i] IN WORDS first",
      "2. write the recurrence",
      "3. base cases  4. iteration order",
      "start recursive+memo, then convert to bottom-up",
      "often only need last 1-2 values -> O(1) space",
      "'take or skip' -> dp[i] = max(dp[i-1], dp[i-2]+v)",
      "unbounded (coins) -> loop amount OUTER"
    ],
    eq: ["# coin change (min coins)\ndp = [inf] * (amount + 1); dp[0] = 0\nfor a in range(1, amount + 1):\n    for c in coins:\n        if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)"],
    warn: "If you cannot state what dp[i] MEANS in one English sentence, you will get the recurrence wrong. Write the definition as a comment before writing any code — including in the interview."
  },
  qs: [
    { t: "Climbing Stairs", d: "E", s: "climbing-stairs", k: "Fibonacci. dp[i] = dp[i−1] + dp[i−2]. Your DP hello-world." },
    { t: "Min Cost Climbing Stairs", d: "E", s: "min-cost-climbing-stairs", k: "dp[i] = cost[i] + min(dp[i−1], dp[i−2]). Careful with the two possible endings." },
    { t: "House Robber", d: "M", s: "house-robber", k: "Take-or-skip: dp[i] = max(dp[i−1], dp[i−2] + v). Two rolling variables suffice." },
    { t: "House Robber II", d: "M", s: "house-robber-ii", k: "Circular → run House Robber twice: houses [0..n−2] and [1..n−1], take the max." },
    { t: "Longest Palindromic Substring", d: "M", s: "longest-palindromic-substring", k: "Expand around each of the 2n−1 centres. O(n²) time, O(1) space — beats the DP table." },
    { t: "Palindromic Substrings", d: "M", s: "palindromic-substrings", k: "Same expand-around-centre, counting instead of tracking the longest." },
    { t: "Decode Ways", d: "M", s: "decode-ways", k: "dp[i] = dp[i−1] if one digit valid, plus dp[i−2] if the two-digit number is 10–26. Zeros are the trap." },
    { t: "Coin Change", d: "M", s: "coin-change", k: "Unbounded knapsack, minimising count. Amount loop outer, coins inner." },
    { t: "Maximum Product Subarray", d: "M", s: "maximum-product-subarray", k: "Track BOTH running max and min — a negative flips them. Kadane with a twist." },
    { t: "Word Break", d: "M", s: "word-break", k: "dp[i] = True if some j has dp[j] and s[j:i] in the dict. Put the dict in a set." },
    { t: "Longest Increasing Subsequence", d: "M", s: "longest-increasing-subsequence", k: "O(n²) DP is expected; the O(n log n) patience/binary-search version is the follow-up." },
    { t: "Partition Equal Subset Sum", d: "M", s: "partition-equal-subset-sum", k: "Subset-sum to total/2. Boolean DP over reachable sums; iterate sums DESCENDING for 1-D." }
  ]
},

{
  id: "dp2", name: "2-D Dynamic Programming", short: "2-D DP",
  cheat: {
    title: "2-D DP",
    pts: [
      "two sequences / two changing quantities -> 2-D",
      "dp[i][j] over (index in A, index in B)",
      "or (index, remaining budget/capacity)",
      "match -> dp[i-1][j-1] + 1",
      "mismatch -> max/min of the neighbours",
      "grid paths -> dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "often collapsible to two rows -> O(n) space",
      "interval DP (burst balloons): loop by LENGTH"
    ],
    eq: ["# LCS\nfor i in range(1, m+1):\n    for j in range(1, n+1):\n        if A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1\n        else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])"],
    warn: "Burst Balloons inverts the natural framing: think about which balloon is popped LAST in an interval, not first. That reframing is the entire problem."
  },
  qs: [
    { t: "Unique Paths", d: "M", s: "unique-paths", k: "dp[i][j] = dp[i−1][j] + dp[i][j−1]. Also solvable as a binomial coefficient." },
    { t: "Longest Common Subsequence", d: "M", s: "longest-common-subsequence", k: "The 2-D template. Learn this one cold — Edit Distance and Distinct Subsequences are variants." },
    { t: "Best Time to Buy and Sell Stock with Cooldown", d: "M", s: "best-time-to-buy-and-sell-stock-with-cooldown", k: "State machine: hold / sold / rest. Three rolling variables, not a table." },
    { t: "Coin Change II", d: "M", s: "coin-change-ii", k: "Counting combinations → coins loop OUTER, amount inner. Swapping the loops counts permutations instead." },
    { t: "Target Sum", d: "M", s: "target-sum", k: "Memoise on (index, runningSum), or transform into a subset-sum counting problem." },
    { t: "Interleaving String", d: "M", s: "interleaving-string", k: "dp[i][j] = can s3[:i+j] be formed from s1[:i] and s2[:j]. Check the length precondition first." },
    { t: "Longest Increasing Path in a Matrix", d: "H", s: "longest-increasing-path-in-a-matrix", k: "DFS + memo. Strictly increasing means no cycles, so no visited set is needed." },
    { t: "Distinct Subsequences", d: "H", s: "distinct-subsequences", k: "On a match you may use it or skip it: dp[i][j] = dp[i−1][j−1] + dp[i−1][j]." },
    { t: "Edit Distance", d: "M", s: "edit-distance", k: "Insert / delete / replace → 1 + min of three neighbours on mismatch. Learn with LCS." },
    { t: "Burst Balloons", d: "H", s: "burst-balloons", k: "Interval DP; consider which balloon bursts LAST in [i,j]. Pad the array with 1s at both ends." },
    { t: "Regular Expression Matching", d: "H", s: "regular-expression-matching", k: "'*' means zero occurrences (skip two pattern chars) or one more (consume a text char). Enumerate carefully." }
  ]
},

{
  id: "greedy", name: "Greedy", short: "Greedy",
  cheat: {
    title: "Greedy",
    pts: [
      "greedy works only if local optimum -> global",
      "if you can't argue WHY, use DP instead",
      "running sum < 0 -> reset it (Kadane)",
      "jump game -> track furthest reachable index",
      "interval-ish -> sort, then sweep once",
      "counting/frequency -> Counter + sorted keys",
      "typical shape: sort, then one linear pass"
    ],
    eq: ["# Kadane\nbest = cur = a[0]\nfor v in a[1:]:\n    cur = max(v, cur + v)\n    best = max(best, cur)"],
    warn: "In an interview, always state the exchange argument for why greedy is safe here. 'It felt right' is how you get asked for a counterexample you can't answer."
  },
  qs: [
    { t: "Maximum Subarray", d: "M", s: "maximum-subarray", k: "Kadane: reset the running sum whenever it goes negative." },
    { t: "Jump Game", d: "M", s: "jump-game", k: "Track the furthest reachable index; fail the moment i exceeds it." },
    { t: "Jump Game II", d: "M", s: "jump-game-ii", k: "BFS-style level counting over reachable ranges — increment jumps at each range boundary." },
    { t: "Gas Station", d: "M", s: "gas-station", k: "If total gas ≥ total cost a solution exists; the start is right after wherever the running tank goes negative." },
    { t: "Hand of Straights", d: "M", s: "hand-of-straights", k: "Counter plus a min-heap or sorted keys; always start a group from the smallest remaining card." },
    { t: "Merge Triplets to Form Target Triplet", d: "M", s: "merge-triplets-to-form-target-triplet", k: "Ignore any triplet exceeding the target in any position; check the survivors cover each index." },
    { t: "Partition Labels", d: "M", s: "partition-labels", k: "Record each char's last index; extend the current partition's end as you scan." },
    { t: "Valid Parenthesis String", d: "M", s: "valid-parenthesis-string", k: "Track a RANGE of possible open counts (lo, hi); clamp lo at 0, fail if hi goes negative." }
  ]
},

{
  id: "intervals", name: "Intervals", short: "Intervals",
  cheat: {
    title: "Intervals",
    pts: [
      "step 1 is ALWAYS: sort. by start or by end.",
      "overlap test: a.start < b.end AND b.start < a.end",
      "merging -> sort by START",
      "max non-overlapping (scheduling) -> sort by END",
      "'how many concurrent?' -> min-heap of end times",
      "  or a +1/-1 sweep line over sorted events",
      "merge: newEnd = max(cur.end, next.end)"
    ],
    eq: ["res = []\nfor s, e in sorted(intervals):\n    if res and s <= res[-1][1]:\n        res[-1][1] = max(res[-1][1], e)\n    else:\n        res.append([s, e])"],
    warn: "Sort by END for 'keep the most non-overlapping intervals', by START for merging. Using the wrong key gives a plausible-looking answer that is subtly wrong on some inputs."
  },
  qs: [
    { t: "Insert Interval", d: "M", s: "insert-interval", k: "Three phases: intervals entirely before, the overlapping merge, then everything after. No sort needed — input is sorted." },
    { t: "Merge Intervals", d: "M", s: "merge-intervals", k: "Sort by start, extend the last interval's end when they touch. The template above." },
    { t: "Non-overlapping Intervals", d: "M", s: "non-overlapping-intervals", k: "Sort by END, greedily keep; count what you had to drop. Classic activity selection." },
    { t: "Meeting Rooms", d: "E", s: "meeting-rooms", p: 1, k: "Sort by start; any interval starting before the previous one ends is a conflict." },
    { t: "Meeting Rooms II", d: "M", s: "meeting-rooms-ii", p: 1, k: "Min-heap of end times — heap size is rooms in use. Or a +1/−1 sweep over sorted events." },
    { t: "Minimum Interval to Include Each Query", d: "H", s: "minimum-interval-to-include-each-query", k: "Sort queries and intervals; push (size, end) onto a heap as intervals become active, pop expired ones." }
  ]
},

{
  id: "math", name: "Math & Geometry", short: "Math",
  cheat: {
    title: "Math & Geometry",
    pts: [
      "rotate 90° = TRANSPOSE then reverse each row",
      "spiral = four bounds, shrink after each edge",
      "in-place marking: use row 0 / col 0 as flags",
      "cycle detection in sequences -> fast/slow",
      "fast power: halve the exponent, square the base",
      "watch integer overflow bounds in the prompt",
      "diagonals: (r+c) and (r-c) identify them"
    ],
    eq: ["def pow(x, n):\n    if n < 0: x, n = 1/x, -n\n    res = 1\n    while n:\n        if n & 1: res *= x\n        x *= x; n >>= 1\n    return res"],
    warn: "These look easy and are mostly about careful index bookkeeping. Write the loop bounds on paper before typing — off-by-one here wastes more interview time than any algorithm."
  },
  qs: [
    { t: "Rotate Image", d: "M", s: "rotate-image", k: "Transpose in place, then reverse each row. Two clean passes beat layer-by-layer swapping." },
    { t: "Spiral Matrix", d: "M", s: "spiral-matrix", k: "Four moving bounds (top/bottom/left/right); shrink after traversing each edge, check bounds between edges." },
    { t: "Set Matrix Zeroes", d: "M", s: "set-matrix-zeroes", k: "Use row 0 and column 0 as the marker storage for O(1) space; handle column 0 with a separate flag." },
    { t: "Happy Number", d: "E", s: "happy-number", k: "Cycle detection — a set of seen values, or Floyd's fast/slow." },
    { t: "Plus One", d: "E", s: "plus-one", k: "Walk from the end handling carry; all-nines needs a new leading digit." },
    { t: "Pow(x, n)", d: "M", s: "powx-n", k: "Fast exponentiation by squaring, O(log n). Handle negative n and n = 0." },
    { t: "Multiply Strings", d: "M", s: "multiply-strings", k: "Result array of size m+n; digits i and j contribute to positions i+j and i+j+1." },
    { t: "Detect Squares", d: "M", s: "detect-squares", k: "Count points by coordinate; for each diagonal partner, check the two corners exist and multiply counts." }
  ]
},

{
  id: "bits", name: "Bit Manipulation", short: "Bits",
  cheat: {
    title: "Bit Manipulation",
    pts: [
      "x & 1        -> is odd / lowest bit",
      "x >> 1       -> divide by 2",
      "x & (x-1)    -> clears the LOWEST set bit",
      "x & -x       -> isolates the lowest set bit",
      "a ^ a = 0, a ^ 0 = a  -> XOR cancels pairs",
      "counting bits: dp[i] = dp[i >> 1] + (i & 1)",
      "add without +: sum = a^b, carry = (a&b)<<1"
    ],
    eq: ["# count set bits (Brian Kernighan)\nc = 0\nwhile x:\n    x &= x - 1     # drops one set bit per loop\n    c += 1"],
    warn: "Python integers are arbitrary precision, so 32-bit problems (Sum of Two Integers, Reverse Integer) need explicit masking with 0xFFFFFFFF and manual sign handling. Say this out loud — it shows you understood the constraint."
  },
  qs: [
    { t: "Single Number", d: "E", s: "single-number", k: "XOR everything — pairs cancel, the loner survives. O(1) space." },
    { t: "Number of 1 Bits", d: "E", s: "number-of-1-bits", k: "Brian Kernighan: x &= x−1 clears one set bit per iteration." },
    { t: "Counting Bits", d: "E", s: "counting-bits", k: "dp[i] = dp[i >> 1] + (i & 1). DP meets bit tricks." },
    { t: "Reverse Bits", d: "E", s: "reverse-bits", k: "Shift the result left, OR in the input's lowest bit, shift input right. 32 iterations." },
    { t: "Missing Number", d: "E", s: "missing-number", k: "XOR indices with values, or use the Gauss sum n(n+1)/2 minus the actual sum." },
    { t: "Sum of Two Integers", d: "M", s: "sum-of-two-integers", k: "sum = a^b, carry = (a&b)<<1, loop until carry is 0. In Python, mask to 32 bits and fix the sign." },
    { t: "Reverse Integer", d: "M", s: "reverse-integer", k: "Pop digits with %10 and //10; check overflow against INT_MAX BEFORE pushing the next digit." }
  ]
}
];

/* ------------------------------------------------------------
   SCHEDULE — which categories get worked in which day range.
   Days 1-2  : none (environment setup week)
   Days 3-84 : ~2 problems/day, spread evenly inside each block
   Days 85-90: no new problems — redo everything flagged 'redo'
   ------------------------------------------------------------ */
window.DSA_PLAN = [
  { from: 3,  to: 14, cats: ["arrays", "twop", "window", "stack"],           note: "The four patterns that appear most often in screens. Get these automatic." },
  { from: 15, to: 28, cats: ["bsearch", "linked", "trees"],                  note: "Pointer discipline and recursion. Trees are the single biggest block — pace yourself." },
  { from: 29, to: 42, cats: ["tries", "heap", "backtrack", "graphs"],        note: "Heavier block, and it overlaps your PyTorch weeks. Two a day, no heroics." },
  { from: 43, to: 56, cats: ["advgraphs", "dp1"],                            note: "Lighter on purpose — weeks 7-8 of the AI track (CNNs, transformers) are demanding." },
  { from: 57, to: 70, cats: ["dp2", "greedy"],                               note: "DP is where most people stall. Write dp[i] in words before any code." },
  { from: 71, to: 84, cats: ["intervals", "math", "bits"],                   note: "The quick-win patterns. Good pairing with the heavy RAG/MLOps weeks." }
];

window.DSA_REVISION = {
  from: 85, to: 90,
  note: "No new problems. Re-solve everything you flagged for redo, from a blank file, timed at 25 minutes. Then one mixed set per day across random patterns."
};
