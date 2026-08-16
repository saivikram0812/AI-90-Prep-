/* ============================================================
   SPACED REPETITION — SM-2 lite.
   Cards are generated from material you have ALREADY covered, so the
   deck grows as you do. Nothing you haven't studied ever appears.
   ============================================================ */

const SRS = {
  /* interval growth in days for the first few successful reps, then ease-driven */
  FIRST: [1, 3],
  MIN_EASE: 1.3,
  START_EASE: 2.5
};

/* ---------- card generation ---------- */
/* A card is { id, front, back, src, tag }.
   id must be stable across sessions — it keys the schedule. */
function srsCards() {
  const out = [];

  // 1. One card per COMPLETED day, from its cheat note.
  DAYS.forEach(d => {
    if (!isDone(d.d)) return;
    out.push({
      id: "day:" + d.d,
      front: `Day ${d.d} — ${d.title}\n\nRecall the key points of "${d.cheat.title}".`,
      back: d.cheat.pts.join("\n") +
            (d.cheat.eq && d.cheat.eq.length ? "\n\n" + d.cheat.eq.join("\n") : "") +
            (d.cheat.warn ? "\n\n⚠ TRAP: " + d.cheat.warn : ""),
      src: `Day ${d.d}`,
      tag: d.track
    });
  });

  // 2. One card per interview question you have TICKED.
  //    Ticking means "I can answer this" — SRS then checks you still can.
  INTERVIEW.forEach(c => c.qs.forEach(q => {
    if (!S.iv[q.id]) return;
    out.push({
      id: "iv:" + q.id,
      front: q.q,
      back: q.key,
      src: c.cat,
      tag: "Interview"
    });
  }));

  // 3. One card per DSA pattern where you have solved at least one problem.
  (window.DSA_CATS || []).forEach(c => {
    const solved = DSA.filter(p => p.cat === c.id && dsaSolved(p.s)).length;
    if (!solved) return;
    out.push({
      id: "dsa:" + c.id,
      front: `DSA pattern — ${c.name}\n\nRecall the template, the recognition cues, and the trap.`,
      back: c.cheat.pts.join("\n") +
            (c.cheat.eq && c.cheat.eq.length ? "\n\n" + c.cheat.eq.join("\n") : "") +
            (c.cheat.warn ? "\n\n⚠ TRAP: " + c.cheat.warn : ""),
      src: "NeetCode 150",
      tag: "DSA"
    });
  });

  return out;
}

/* ---------- scheduling ---------- */
function srsState(id) {
  return S.srs[id] || { due: todayISO(), int: 0, ease: SRS.START_EASE, reps: 0, lapses: 0 };
}
function srsDue(cards) {
  const t = todayISO();
  return cards.filter(c => srsState(c.id).due <= t);
}
function srsNew(cards) {
  return cards.filter(c => !S.srs[c.id]);
}
function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Grade a card. q: 0 forgot, 1 hard, 2 good, 3 easy.
 * Forgetting resets the interval — that is the whole point, you see it again tomorrow.
 */
function srsGrade(id, q) {
  const s = srsState(id);
  if (q === 0) {
    s.lapses++;
    s.reps = 0;
    s.int = 1;
    s.ease = Math.max(SRS.MIN_EASE, s.ease - 0.2);
  } else {
    if (s.reps < SRS.FIRST.length) {
      s.int = SRS.FIRST[s.reps];
    } else {
      s.int = Math.max(1, Math.round(s.int * s.ease));
    }
    s.reps++;
    if (q === 1) { s.ease = Math.max(SRS.MIN_EASE, s.ease - 0.15); s.int = Math.max(1, Math.round(s.int * 0.6)); }
    if (q === 3) { s.ease = s.ease + 0.15; s.int = Math.round(s.int * 1.3); }
  }
  s.due = addDays(todayISO(), s.int);
  s.last = todayISO();
  S.srs[id] = s;
  save();
  return s;
}

/* ---------- stats ---------- */
function srsStats() {
  const cards = srsCards();
  const t = todayISO();
  const seen = cards.filter(c => S.srs[c.id]);
  const mature = seen.filter(c => srsState(c.id).int >= 21);
  const leeches = seen.filter(c => srsState(c.id).lapses >= 4);
  return {
    total: cards.length,
    due: srsDue(cards).length,
    fresh: srsNew(cards).length,
    seen: seen.length,
    mature: mature.length,
    leeches,
    reviewedToday: Object.values(S.srs).filter(s => s.last === t).length
  };
}
