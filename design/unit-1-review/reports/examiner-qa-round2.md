# Examiner QA, round 2: Odyssey, The Long Way Home (Unit 1 Review)

Stage 2 (Examiner), second pass, 2026-09-24. Same role as round 1: senior IB Psychology examiner, guide for first assessment 2027, Paper 1 on Learning and Cognition only. Round 1 report: `reports/examiner-qa.md`.

**Scope checked:** every round-1 change (data, episode and js files); all new content: the eight `{write}` steps (question, model, checklist, stem, placement, placeholder), the new narrator and character payoff lines (ep6 `song_listen`/`song_row`, ep7 `troy_listen`/`troy_fast` and `potion_test`, ep8 `tell_truth`/`tell_story`/`tell_nothing`), the Penelope fallback questions in `js/drills.js`, `ODY.chestLines` in `data/cast.js` against the chest code in `js/story.js`, and the Section C note in `js/trials.js`. I also re-ran an answer-length check on all 32 episode `log` items and re-read the Bartlett material after the softening.

## Score: 8.5 / 10 (about 9 once the three must-fix items below are applied)

Every round-1 change has been applied, and applied correctly. The framing demonstration is now valid (certain 10 survivors against a gamble worth 5/6 × 12 = 10 on average, with the `@random` line weighted 5 to 1 and the teacher note added), the anchor is a real high anchor, the four narrator errors are gone, and the answer-length giveaway is fixed: only 1 of 32 episode items still has the key clearly longer than every distractor (ratio above 1.25), down from 27. The Bartlett softening is consistent in `sc14`, the A12 pitfall and (after my fix) the Library study card.

The new write steps are a real gain for Paper 1 readiness: they make students produce the "because" link that Sections B and C reward, and six of the eight are accurate, well pitched and paired with checklists that reward the right things (application to a named detail, why not just what, no evaluation in B). Two model answers need correcting before students copy them. The shades model (ep5) explains the multi-store model with levels-of-processing vocabulary ("maintenance rehearsal ... nothing is transferred") and so contradicts the MSM's own claim, made in the same episode, that rehearsal moves information into LTM. That is the very model-mixing error the ep5 log warns against. The Section C model (ep8) is sound but ends on a generic judgement and uses a loose "a filled delay removes recency", which round 1 had corrected elsewhere. One narration bug in ep6 makes the narrator contradict the player's choice.

## Round-1 changes: verified

| Area | Status |
| --- | --- |
| exam.js topic ids (A8, B7 `load`; A10, B9, A11, B8 `biases`) | Present. No `clt`, `anchoring` or `confirmation` topic ids remain. |
| exam.js A6 checklist and model (encoding), C3 evidence and conclusion | Present. |
| questions.js co05, wm08, bi05, me03 | Present. |
| topics.js schema voice line, MSM encoding, Sperling 3 × 4 at 50 ms, exam key point 8, Change card, rationalisation card, methods voice line | Present. |
| Episode section A (answer-length giveaways, all 27 items) | Applied as specified. Recheck: 1 of 32 items still above 1.25 (see D below); keyed option longest in 18 of 32, but by small margins (all others at or below 1.21). |
| Episode section B (framing, anchor, "same kind of learning", Bandura 1965, CLT assumption) | All applied, exactly as specified. Expected values now equal in both frames. |
| Episode section C (three "Section B names the theory" lines) | Applied. |
| Episode section D (MSM encoding note, Polites continuity, Tobias, "component") | Applied. |
| js/drills.js section E (Glanzer and Cunitz results, "two numbers a second", Strack and Mussweiler, "hollow") | Applied. The optional "no" semantic questions in the levels-of-processing pool were not added (still low priority). |
| cast.js `lop3` award text | Applied. |
| Bartlett softening (sc14, A12 pitfall) | Applied and accurate: "Both produced the same kinds of distortion". The topics.js study card still said "Both methods gave similar results"; fixed below for consistency. |
| Trials note on Section C contexts | Present and accurate: in May the two Section C options come from different contexts [InThinking 59707]. |

## Fixes made (data files)

`node design/unit-1-review/tools/audit.mjs` reports **No problems** after the edits (8 episodes, 330 questions). exam.js kept its CRLF endings; no en or em dashes in either file.

| File, place | Before → After | Reason |
| --- | --- | --- |
| exam.js, C7 evidence | "Dresler et al. (2013): 23 memory athletes and 51 matched controls; 6 weeks of loci training ..." → "Dresler et al. (2017): 23 memory athletes compared with matched controls; 51 novices randomly allocated to 6 weeks of loci training, working-memory training or none; loci trainees more than doubled recall of 72 words; gain persisted at 4 months" | Flagged as medium in round 1. The study is Dresler et al. (2017, *Neuron*). The 51 were novices randomised to three training conditions, not matched controls (the digest's own sub-bullet says they were randomised). Random allocation is also what lets a student make the causal point C7 needs. **Please update `research/inthinking-digest.md` line 660 to 2017 as well**, so later stages do not reintroduce 2013. |
| topics.js, Bartlett (1932) results | "Both methods gave similar results." → "Both methods produced the same kinds of distortion." | Matches the softened sc14 and A12 pitfall. "Similar results" overstates it: serial reproduction changed the story faster and further. |

## The eight write steps: audit

| Ep | Write step | Question | Model | Checklist | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | Causality at Ismarus | Good C-style concept use | Accurate; models "strengthens or limits" and ties to the experimental logic (cannot rerun with one thing changed) | Rewards using the concept, not name-checking it | Good. Placeholder misleading (see below) |
| 2 | Operant conditioning for Jonas | Good B-style | Accurate (positive reinforcement, FR5 correctly named) | Correct; "consequence follows the behaviour" is exactly the right check | Good |
| 3 | Schema theory in the cave | Good B-style | Accurate (script, assimilation, "never checked") | Correct | Good |
| 4 | Social learning on the roof | **Premise false on two of three routes** | Accurate on ARRM and vicarious reinforcement, but the last clause assumes the player's route | Correct | Fix (must) |
| 5 | The MSM and the shades | Good | **Mixes models**; see below | Correct | Fix (must) |
| 6 | The WMM on the pitch | Good B-style | Accurate (loop, store, inner voice, limited capacity) | Correct | Good |
| 7 | Confirmation bias and Ida | Good B-style | Accurate; defines, applies, explains why | Correct | Good |
| 8 | Section C in miniature | Good | Mostly sound; imprecise delay and generic judgement | Correct, and "reaches a judgement" is the right third check | Fix (should) |

Checklists as a set reward the right things: a named concept or theory used (not just named), a specific scenario detail, and a "because" or "why". None rewards description of a study or evaluation in a B-style task. Good.

## Changes needed in episode and js files (not edited, per instructions)

### A. Must fix

1. **ep5-underworld.js, shades model: model mixing.** "Maintenance rehearsal" is Craik and Lockhart's term, and "nothing is transferred into long-term memory" contradicts the MSM, in which rehearsal is what transfers information to LTM (the episode's own notes say so). A student copying this into a Section A or B answer is mixing models.
   - `model: 'In the multi-store model, short-term memory holds information for only about 15 to 30 seconds unless it is rehearsed. Because the shades can hold a thought only by repeating it, they are relying on maintenance rehearsal, and nothing is transferred into long-term memory.',`
   - → `model: 'In the multi-store model, short-term memory holds about 7 ± 2 items for only about 15 to 30 seconds unless it is rehearsed. Because the shades can keep a thought only by repeating it, they are using rehearsal to hold it in short-term memory, and as soon as they stop, it decays or is displaced by the next thought.',`

2. **ep4-circe.js, Elpenor write step: false premise on the `roof_model` and `roof_order` routes.** On `roof_order` Elpenor "never got to try"; on `roof_model` he comes down safely, so "the wine meant he could not reproduce it safely" is wrong for most players. Ask why he *wanted* to, and make the reproduction clause conditional.
   - `q: 'Using social learning theory, explain why Elpenor tried to sleep on Circe\'s roof. One or two sentences.',` → `q: 'Using social learning theory, explain why Elpenor wanted to sleep on Circe\'s roof. One or two sentences.',`
   - `model: 'Elpenor paid attention to the older sailors, admired models, and retained the route up the ladder. Because he saw them rewarded with cool air and laughter, vicarious reinforcement motivated him to reproduce the behaviour, although the wine meant he could not reproduce it safely.',` → `model: 'Elpenor paid attention to the older sailors, who were admired models, and retained their route: the ladder by the kitchen, then along the beam. Because he saw them rewarded with cool air and laughter, vicarious reinforcement motivated him to copy them, although whether he could reproduce the climb safely, full of wine, was another matter.',`

3. **ep6-sirens.js, narrator contradicts the player.** With `mast_bound` and silence (`song_listen`), the player hears "You listened ... nobody untied you" and then "Odysseus still manages one order". With `mast_none` and silence, "nobody untied you" is wrong because nobody was tied.
   - `'?mast_bound&!song_turn N: The song pours into the loop that holds words, and there is no room left to rehearse anything else. Odysseus still manages one order. That is his central executive, fighting for control.',` → `'?mast_bound&song_row N: The song pours into the loop that holds words, and there is no room left to rehearse anything else. Odysseus still manages one order. That is his central executive, fighting for control.',`
   - `'?song_listen N: You listened. You heard everything they promised, and nobody untied you. Try to remember afterwards exactly what they said. It is harder than you think.',` → `'?song_listen&mast_bound N: You listened. You heard everything they promised, and nobody untied you. Try to remember afterwards exactly what they said. It is harder than you think.',` and add directly after it: `'?song_listen&!mast_bound N: You listened, and so did the crew. The oars slow. Try to remember afterwards exactly what they sang. It is harder than you think.',`

### B. Should fix

4. **ep8-ithaca.js, Section C model.** "A filled delay removes recency" is the imprecision round 1 corrected in C3 and the serial position drill (10 s reduced it; 30 s removed it). The closing "one lens alone gives an incomplete account" is a slogan, not a judgement about the model. HM also supports the MSM's STM/LTM split, which the model should say before using him to limit it: that is what "evaluate" looks like.
   - `model: 'From a cognitive perspective, the multi-store model explains the serial position effect well, because a filled delay removes recency but not primacy. A biological perspective, using HM, shows that long-term memory is not a single store, so one lens alone gives an incomplete account.',` → `model: 'From a cognitive perspective, the multi-store model is well supported: a 30-second filled delay removes recency but leaves primacy, which suggests separate short-term and long-term stores. A biological perspective both supports and limits it, because HM\'s surgery left his short-term memory intact but stopped new long-term memories, yet he could still learn skills, so the model is right to separate the stores but too simple in treating long-term memory as one.',`

5. **js/story.js default write placeholder does not fit the two concept tasks.** The default reads "Name the theory, then say how it explains a detail". Ep1 and ep8 are Section C-style concept tasks. Add a `placeholder` to each write object:
   - ep1-troy.js, in the `ismarus` write object, add: `placeholder: 'Name the concept, use it on a detail of Ismarus, then say what strengthens or limits the claim.',`
   - ep8-ithaca.js, in the `perspective` write object, add: `placeholder: 'Name a perspective, use it on the model with evidence, then give your judgement.',`

### C. Consider

6. **ep4-circe.js, Tobias item (the one remaining length outlier, ratio 1.29).** `a: 'Repeatedly pair reading time with his grandmother singing, until reading alone brings the relaxed feeling.',` → `a: 'Pair reading time with his grandmother\'s singing until reading alone relaxes him.',`
7. **ep7-strait.js, `potion_test` payoff.** Accurate enough: asking Circe to drink first is a test whose result could disconfirm a belief about the cup. But in ep4 Circe framed it as "see what happens to someone else first", which sounds like observational learning, so the link to Wason may not land. A tighter line: `'?potion_test N: At Circe\'s table you asked her to drink first: a test whose result could have proved your guess about the cup wrong. That is the move the two, four, six task asks for, and the one Eurylochus never makes.',`
8. **js/trials.js, the Section C note.** Accurate, but it appears only on the "How Paper 1 works" tab, and it leads that tab before the format is described. Move it below the section cards and repeat it on the mock intro (line 213), for example by appending to that paragraph: `' For this class test, both Section C options come from Learning and Cognition; in May they come from different contexts.'`
9. **ep1-troy.js, Ismarus model.** Written for the `ismarus_stay` route. Players who left or posted a watch can still use it as a model, since the question allows "or what prevented them". No change needed unless you want a route-specific model.

## New content passed without change

- **ep7 `troy_listen` / `troy_fast` (Eurylochus).** In character, no psychology terms. Fourth wall intact.
- **ep8 `tell_truth` / `tell_story` / `tell_nothing` (narrator).** No psychological claims; they close the loop on Polites's reconstructive-memory point in ep1. Fine.
- **ep6 `song_row` (narrator, `&!mast_bound`).** Fine.
- **Penelope fallbacks (js/drills.js).** All four are correct against the ep8 script (Athena disguised him; Antinous mocked him; bow and twelve axes; "They will know my face"). Distractors are plausible cast names. The results text on reconstructive memory is accurate.
- **`ODY.chestLines` (data/cast.js).** Correct. The code gives an independent 35% chance of an empty chest, so reward follows an unpredictable number of openings, which is a variable ratio schedule in effect. The line fires at the fourth chest, matching "Four chests".
- **Fourth-wall check.** Passed. The audit's jargon scan is clean, and I read every new character line: none names a theory, study or exam term.

## Remaining concerns carried over from round 1 (unchanged, all low)

- Unverified digest numbers (Lowe et al. setting, Gilbert et al. figures, Coates et al., Anderson and Pichert n, Modi et al., Mani et al.). Now that Dresler has turned out to be wrong in the digest, these are worth checking against the primary papers before the next release.
- Pavlov "metronome, not a bell" misconception card; framing and availability as off-list contrast biases; C6 and C7 stem wording; levels-of-processing semantic questions all answered "yes".
