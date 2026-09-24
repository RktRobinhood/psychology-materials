# GAME SPECS

This document is the engineering companion to `PRODUCTION_SCRIPT.md`.

## Global rules

- Mini-games are short demonstrations, not psychometric instruments.
- Persist raw condition results locally when useful, but never convert them into ability labels.
- Use `performance.now()` for reaction-time tasks.
- Randomize stimuli, but use constrained randomization so the same response does not dominate runs.
- A replay should generate new stimuli but preserve the same condition structure.
- Every game must support keyboard and pointer input in the production version.
- Teacher mode can reset the current game without resetting the whole campaign.

---

## 1. Digit Span — Memory Span Gate

**Purpose:** experience limited active capacity.

**Stimuli:** digits 0–9.

**Flow:**
1. Start length 4.
2. Present each digit ~600–700 ms with ~100–200 ms gap.
3. Blank interval ~400–700 ms.
4. Student enters full sequence.
5. Correct -> length +1.
6. Two misses at same length -> end.
7. Cap at 9 for lesson pacing.

**Store:** longest correct length, attempts by length.

**Result copy:**
> “The point is the capacity pattern, not your personal number.”

---

## 2. Articulatory Suppression — Echo Chamber

**Purpose:** informal replication of phonological-loop interference.

**Stimulus pool:** F, K, L, M, R, X, Q.

**Condition A:** normal ordered recall.

**Condition B:** ordered recall while repeatedly saying “1–2, 1–2” at a visible/audio pace.

**Suggested production trials:** 3–5 per condition.

**Counterbalance:** half the sessions should ideally start with suppression if the class version is used for aggregate comparison. The prototype uses fixed order for narrative clarity; production teacher mode may toggle counterbalancing.

**Store:** percent positions correct per condition.

**Interpretation:** compare within student / class; do not diagnose.

---

## 3. Spatial Sequence — Map of Shards

**Purpose:** visuospatial working-memory demonstration.

**UI:** 3x3 grid.

**Flow:**
- 3-item sequence -> grow toward 6–7.
- Each cell illuminates ~400 ms.
- Student reproduces locations in order.

**Store:** sequence length and trials correct.

**Measurement caveat:** students can verbally label grid positions. Teacher can use this to discuss construct validity.

---

## 4. Selective Interference — Twin Paths

**Purpose:** compare cross-channel versus same-channel secondary tasks.

**Core primary task:** spatial sequence.

**Condition A — cross-channel:** repeat a short verbal sequence while encoding/retaining spatial locations.

**Condition B — same-channel:** perform a simple alternating spatial-tracking/tapping task while encoding/retaining spatial locations.

**Optional reverse version:** verbal list + spatial tapping versus verbal list + articulatory suppression.

**Store:** primary-task accuracy by secondary-task type.

**Expected pattern:** same-resource condition should show more disruption on average.

**Important:** do not claim cross-channel tasks are cost-free; central attention and overall difficulty can still create interference.

---

## 5. Stroop — Gate of Focus

**Purpose:** executive control / inhibition / conflict.

**Colors:** red, blue, green, yellow.

**Trials:** 16–24 in production; roughly balanced congruent/incongruent.

**Response:** ink color, not word meaning.

**Store:**
- median correct RT congruent
- median correct RT incongruent
- errors per condition
- interference cost = incongruent median – congruent median

**Accessibility:** production build needs a non-color-only alternative or explicit color labels for users with color-vision differences.

---

## 6. Task Switching — Switchyard

**Purpose:** show switch cost.

**Two rules:** e.g. classify COLOR vs classify SHAPE.

**Trials:** 16–24 with repeat and switch trials.

**Store:** median correct RT and error rate for repeat versus switch trials.

**Switch cost:** switch median – repeat median.

---

## 7. Story Loom — Episodic Buffer

**Purpose:** demonstrate integration of information from different sources.

**Flow:**
1. Brief visual scene establishes who/what/where.
2. Simultaneous or immediately adjacent spoken/text information establishes intention/time.
3. Remove both.
4. Ask questions requiring visual details, verbal details, and at least one combined response.

**Interpretation:** model demonstration only; not an isolated measure of the episodic buffer.

---

## 8. Intrinsic Load Trial

**Purpose:** show that task complexity itself creates demand.

**Design:** same visual cleanliness, but increase interacting rules/elements.

**Store:** accuracy, RT if feasible, 1–9 mental-effort rating.

**Key comparison:** easy clean task versus complex clean task.

---

## 9. Extraneous Load Trial — Noisy Hall

**Purpose:** show unnecessary instructional/environmental demand.

**Design:** same core task twice.

**Clean condition:** integrated instruction, no irrelevant motion.

**Clutter condition:** split instruction, decorative motion, redundant labels, irrelevant notifications.

**Store:** accuracy, RT, 1–9 effort rating.

**Important:** clutter must not change the actual problem difficulty.

---

## 10. Germane / Schema Trial — Pattern Shrine

**Purpose:** course-text demonstration of productive effort and schema support.

**Flow:**
1. Attempt unfamiliar structured problem.
2. Show concise worked example highlighting deep structure.
3. New surface example with same structure.

**Store:** accuracy and effort before/after worked example.

**Course alignment note:** the lesson follows the textbook’s three-load taxonomy.

---

## 11. Sana-Style Micro-Lesson

**Purpose:** conceptual replication of multitasking during learning.

**Random assignment:** focus vs multitask.

**Learning content:** neutral unfamiliar material, 90–120 seconds in final build.

**Multitask prompts:** easy unrelated tasks every ~15–25 seconds.

**Outcome:** same comprehension quiz for both conditions.

**Store:** condition, quiz score, effort rating, secondary-task completion.

**Class aggregate mode:** if implemented, wait until all groups finish before revealing mean comprehension by condition.

---

## 12. Boss Battle

**Purpose:** synthesis.

Each scenario asks three questions conceptually even if UI compresses them:
1. What resource/system is involved?
2. What is creating the difficulty?
3. What redesign reduces unnecessary demand without removing the learning goal?

**Win condition:** 4/5 or better can show full stabilization animation. Lower score still progresses, but offers recap/retry.
