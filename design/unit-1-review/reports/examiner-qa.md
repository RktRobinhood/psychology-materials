# Examiner QA: Odyssey, The Long Way Home (Unit 1 Review)

Stage 2 (Examiner), 2026-09-24. Role: senior IB Psychology examiner, guide for first assessment 2027, Paper 1 on Learning and Cognition only.

**Scope checked:** all 330 items in `data/questions.js`; all 14 topic lessons in `data/topics.js` (voice lines, key points, terms, studies, strengths and limitations, misconceptions, exam tips) plus every sort, order and cloze drill; all 30 prompts in `data/exam.js` (12 A, 10 B, 8 C) with checklists, links, model answers, plans, markbands, stems and the three mocks; the 8 episode scripts (every narrator and character line, every `log` MCQ, every `notes` block); every results text in `js/drills.js`. Reference facts: `research/inthinking-digest.md` and `research/repo-content-digest.md`, preferred where they differ from general knowledge.

## Score: 7.5 / 10 (about 9 once the episode and drill changes below are applied)

The data layer is strong. The 330-item bank is accurate, every answer key I checked is right, distractors are wrong for a teachable reason, and answer length is close to random (the keyed option is the longest in 32% of MCQs, against 25% by chance; no item is an obvious giveaway). Study details (Bandura 72 children, 10 and 20 min, r = 0.89; Glanzer and Cunitz 46 army men, 10 s and 30 s; Landry and Bartling 34, 76% vs 45%; Bransford and Johnson 52, 18 idea units; HM 1953 at 27; MSM 1968; ARRM) match the class's sources throughout. The exam file is Paper 1 faithful: 2 × 4 describe/explain with one example, 2 × 6 unseen scenarios with "no evaluation" in every checklist, 1 of 2 at 15 marks with concept plus area of study, 90 minutes, first example only, strategies and the cognitive process itself kept in C. Model answers are genuinely top-band and the bias/perspective distinction and "strengthens/limits" stems are taught precisely. What holds the score down is the story layer: 27 of the 32 exam-style MCQs in the episodes have the correct option visibly longer than every distractor, so a student can score well there without knowing anything. The Scylla framing demonstration is invalid as built (the two options do not have equal expected outcomes), and a handful of narrator lines teach something slightly wrong ("two different kinds of learning" for two cases of classical conditioning; Bandura 1961 credited with the learning/performance distinction; "Section B almost always asks for X"). One data bug also hid four exam prompts from the Library (fixed).

## Fixes made (data files)

All edits keep the file format, British spelling and no dashes. `node design/unit-1-review/tools/audit.mjs` reports **No problems** after the edits (8 episodes, 330 questions). Checked in the browser: the Library's Cognitive load Exam moves tab now lists A8 and B7.

### data/exam.js

| Item | Before → After | Reason |
| --- | --- | --- |
| A8, B7 | `topic: "clt"` → `topic: "load"` | No topic `clt` exists. The Library's Exam moves tab for cognitive load showed "no Section A or B prompt", and the Trials chip showed the raw id "clt". |
| A10, B9 | `topic: "anchoring"` → `topic: "biases"` | Same bug: prompts invisible from the Cognitive biases Library page. |
| A11, B8 | `topic: "confirmation"` → `topic: "biases"` | Same bug. |
| A6 checklist | "Gives capacity and duration for the stores (for example 7 ± 2 items and about 15 to 30 seconds for STM)" → "Gives capacity, duration and encoding for the stores (for example 7 ± 2 items, about 15 to 30 seconds and mainly acoustic encoding for STM)" | A 4/4 MSM answer gives encoding as well [72285]; the brief flagged encoding as missing. |
| A6 model | "three separate stores that differ in capacity and duration" → "... differ in encoding, capacity and duration"; STM "which encodes mainly by sound and holds about 7 ± 2 items"; LTM "which encodes mainly by meaning and has an effectively unlimited capacity" | Same reason. |
| C3 evidence | "10 s and 30 s counting delays removed recency" → "a 10 s counting delay sharply reduced recency and a 30 s delay removed it" | The 10 s delay reduced recency; only 30 s removed it (digest rule). |
| C3 plan, conclusion | "the MSM's stores are real enough to measure" → "the MSM's stores can be measured indirectly well enough to test the model" | Contradicted the plan's own point that stores are hypothetical constructs measured only through performance. |

### data/questions.js

| Item | Before → After | Reason |
| --- | --- | --- |
| co05 | "free will versus determinism, **agency** and self-efficacy?" → "free will versus determinism, **locus of control** and self-efficacy?" | Agency is also the A in the Responsibility scaffold (AEAC), and Responsibility was a distractor, so two options were defensible. |
| wm08 | a: "'1, 2', twice per second" → "'1, 2', at two numbers per second" | "Twice per second" reads as saying the pair twice a second (four numbers). The study rate is two numbers per second [InThinking digest]. |
| bi05 | d: "Attention" → "Reinforcement" | "Selective attention" is a defensible description of confirmation bias, so the distractor was arguably correct. |
| me03 (why) | "Matching on a key variable means groups start out alike, ..." → "Children were matched in threes on aggression ratings and split across conditions: groups start out alike, ..." | Bandura matched in triplets, not pairs; the key "Matched pairs" stays as the nearest standard design term, but the feedback now says what actually happened. |

### data/topics.js

| Place | Before → After | Reason |
| --- | --- | --- |
| schema, voice line 2 | "A child who calls every cow a doggie is mid renovation." → "A child who calls a cow a doggie has assimilated it; learning the word cow is the renovation." | Calling a cow "doggie" is assimilation; the old line implied it was accommodation. |
| msm, key point 2 | "The stores differ in encoding, capacity and duration." → adds "Sensory memory keeps the raw sensory form; STM encodes mainly acoustically (by sound); LTM encodes mainly semantically (by meaning)." | The lesson told students to give encoding but never said what it was. |
| msm, Sperling method | "a 3 by 3 grid of letters for a fraction of a second" → "a grid of letters, such as three rows of four, for about 50 milliseconds" | Matches the classic 3 × 4 array, the repo digest's 50 ms, and the game's own flash drill (12 letters). |
| exam, key point 8 | "Cognition in general can appear in A, B or C. Your studied cognitive process (memory), and strategies to improve it, appear only in C." → "Cognition in general, including one cognitive model such as the multi-store or working memory model, can appear in A, B or C. The objectives on your studied cognitive process (memory), such as biological, cultural and environmental factors and strategies to improve it, appear only in C." | The old wording could make a student think the MSM and WMM cannot come up in A or B, which contradicts A6, A7, B5, B6 and the approach table. |
| drills.sort.concept_lens, Change card | "Could a student use operant conditioning to reshape her own study habits?" (why "Agency and the potential for change.") → "If a student reinforces her own revision, how much do her habits change, and does the change last?" (why "Mechanisms, impact and time: change.") | Agency questions fit Responsibility (AEAC) as well as Change, so the card had two right buckets. |
| drills.sort.bartlett_distortions, rationalisation card | "A reason is added: the young man refused to go because his family would worry." → "A motive is invented: the warriors attacked because the villagers had wronged them." | The young man's refusal ("my relatives do not know where I have gone") is in the original legend, so it is not an addition. |
| methods, voice line 2 | "Random allocation lets you make a causal claim." → "Manipulating the IV and allocating people at random is what supports a causal claim." | Overreach: random allocation alone does not license a causal claim, and "make" should be "support". |

## Changes needed in episode and js files (not edited, per instructions)

Each entry gives the file, the exact current text and the replacement. Quote marks inside the JS strings are shown as they appear in the file.

### A. Answer-length giveaways in episode MCQs (must fix)

27 of the 32 `log` items have the keyed answer visibly longer than every distractor (ratio above 1.25; several are 2 to 4 times longer). Fix by lengthening the distractors to match. Replace each `d: [...]` below.

**ep1-troy.js**
- Item "Which sentence uses the concept of causality most precisely?". Also change the answer, because generalising is not a causality point.
  - `a: 'Random allocation strengthens the causal claim, but the lab task limits how far it generalises.',` → `a: 'Random allocation strengthens the causal claim, but only for the short-term effect measured.',`
  - `d: ['Causality was low in this study.', 'The study proves that the IV caused the DV.', 'Correlation is not causation, so the study is weak.'],` → `d: ['Causality was low in this study because it took place in an artificial laboratory.', 'The experiment proves that the IV caused the change in the DV, so causality is high.', 'Correlation is not causation, so the study is weak and tells us nothing about cause.'],`
- Item "...a study using only a biological approach is "biased"":
  - `d: ['It has sampling bias.', 'It lacks measurement.', 'It is unethical.'],` → `d: ['It has sampling bias, because only one kind of explanation was sampled.', 'It lacks measurement, because biology ignores what people think.', 'It is unethical, because it reduces people to their brains.'],`

**ep2-lotus.js**
- `d: ['The teacher explains why punctuality matters.', 'Jonas watches a classmate arrive on time.', 'The bell rings louder at the start of the day.'],` → `d: ['The teacher explains to Jonas why arriving on time matters so much.', 'Jonas sits next to a classmate who always arrives on time.', 'The school bell is paired with a cheerful song every morning.'],`
- `d: ['Operant conditioning was developed by Skinner using rats.', 'Reinforcement always works better than punishment.', 'Jonas might be late because of his family.'],` → `d: ['Operant conditioning was developed by Skinner, who used rats and pigeons in a box.', 'Reinforcement always works better than punishment, so the teacher should reward him.', 'Jonas might be late because of problems at home, which the teacher should ask about.'],`

**ep3-cyclops.js**
- `d: ['Schema theory is a model of memory with three stores.', 'Bartlett (1932) used the War of the Ghosts with British participants.', 'Schemas are sometimes useful and sometimes not.'],` → `d: ['Schema theory is a model of memory with three stores that information passes through.', 'Bartlett (1932) used the War of the Ghosts to test British participants\' memory.', 'Schemas are sometimes useful and sometimes harmful, depending on the situation.'],`
- `d: ['Bartlett\'s study had low reliability.', 'Participants retold the story several times.', 'The War of the Ghosts is a Native American legend.'],` → `d: ['Bartlett\'s study had low reliability because the recall intervals were not standardised.', 'Participants retold the story several times, either alone or passed along a chain.', 'The War of the Ghosts is a Native American legend with unfamiliar names and ideas.'],`
- `d: ['Yes, it is a model of memory.', 'Yes, if you mention Bartlett.', 'Only in Section C.'],` → `d: ['Yes: it is a model of memory, because it explains recall.', 'Yes, as long as the answer describes Bartlett\'s study.', 'Only in Section C, where any theory can count as a model.'],`
- Same item, student-facing text names a copyrighted site and overstates the guide: `why: 'InThinking and the guide agree: schema theory does not count as a cognitive model.' }` → `why: 'Schema theory is a theory, not a cognitive model, so it cannot answer a model question. Use the multi-store or working memory model.' }`

**ep4-circe.js**
- Circe's bell item 2: `d: ['An unconditioned stimulus', 'A reinforcer', 'A conditioned response'],` → `d: ['An unconditioned stimulus: it caused drooling', 'A reinforcer: it made drooling more likely', 'A conditioned response: it was learned'],`
- Circe's bell item 5: `d: ['The drooling grows stronger', 'The pigs learn to ring the bell', 'The food becomes a CS'],` → `d: ['The drooling grows stronger: habituation', 'The pigs learn to ring the bell themselves', 'The food becomes a conditioned stimulus'],`
- Section B item 1: `d: ['Give him a sticker every time he reads a page.', 'Let him watch his sister enjoying books.', 'Take his tablet away when he refuses to read.'],` → `d: ['Give him a sticker every time he reads a page, so that reading pays off for him.', 'Let him watch his older sister being praised for enjoying her books every evening.', 'Take his tablet away whenever he refuses to read, so that refusing stops.'],`

**ep5-underworld.js**
- `d: ['Memory is split into a central executive and slave systems.', 'Memories are reconstructed using schemas.', 'Deeper processing produces stronger memories.'],` → `d: ['A central executive that directs attention to a phonological loop and a visuospatial sketchpad.', 'Schemas built from experience that reconstruct memories to fit what we already expect.', 'Depth of processing at encoding, from structural to semantic, decides how long memories last.'],`
- `d: ['Bartlett found stories became shorter over retellings.', 'Landry and Bartling found suppression reduced recall.', 'Pavlov\'s dogs salivated at a metronome.'],` → `d: ['Bartlett: stories became shorter and more familiar over retellings, showing that memory is reconstructive.', 'Landry and Bartling: articulatory suppression reduced recall, suggesting a separate phonological loop.', 'Craik and Tulving: words processed for meaning were recognised best, suggesting depth matters.'],`
- `d: ['Nothing, it is part of STM.', 'It should be called the phonological loop.', 'The MSM has no short-term store.'],` → `d: ['Nothing: the central executive is part of STM in both models.', 'It should be called the phonological loop in the MSM.', 'The MSM has no short-term store for it to belong to.'],`

**ep6-sirens.js**
- `d: ['Oliver probably has a poor memory.', 'Working memory was proposed by Baddeley and Hitch in 1974.', 'The study has low ecological validity.'],` → `d: ['Oliver probably has a poor memory, so he forgets instructions more than his teammates.', 'The working memory model was proposed by Baddeley and Hitch in 1974 to replace the MSM.', 'Studies of the phonological loop use letter lists, so they have low ecological validity.'],`
- `d: ['Lists intrinsic, extraneous and germane load', 'Says technology is bad for memory', 'Describes Sana et al. in full detail'],` → `d: ['Lists and defines intrinsic, extraneous and germane load accurately', 'Explains that technology is bad for memory and should be banned', 'Describes Sana et al. in full detail, including both experiments'],`

**ep7-strait.js**
- `d: ['Anchoring bias', 'Framing effect', 'Availability heuristic'],` → `d: ['Anchoring bias: judging everything against the first omen he saw', 'Framing effect: describing the same omen in more hopeful words', 'Availability heuristic: the hawk is vivid, so hawks seem more common'],`
- The "one cow" anchoring item: see section B below (the whole item is replaced).
- `d: ['Collect more good omens', 'Ask the crew to vote quickly', 'Trust his first impression'],` → `d: ['Collect more good omens until the crew are fully convinced', 'Ask the crew to vote quickly before hunger gets worse', 'Trust his first impression, since he knows the gods best'],`
- `d: ['Ida uses System 2 to weigh all the reviews.', 'Ida is anchored on the first price she saw.', 'Confirmation bias was studied by Wason in 1960.'],` → `d: ['Ida uses System 2 to weigh every review carefully before she makes up her mind.', 'Ida is anchored on the first price she saw, so every other phone seems too expensive.', 'Confirmation bias was first studied by Wason in 1960 using the 2-4-6 number task.'],`
- `d: ['Whether Wason\'s study was ethical', 'How many participants Lord et al. used', 'Why the phone is overpriced'],` → `d: ['Whether Wason\'s 2-4-6 study was ethical and fair to its participants', 'How many participants Lord et al. used, and how they were recruited', 'Why the phone is overpriced compared with others in the same shop'],`

**ep8-ithaca.js**
- `d: ['Describe all four quadrants and three schedules with examples of each.', 'Describe Skinner\'s pigeon study in full detail.', 'Evaluate operant conditioning using the six concepts.'],` → `d: ['Describe all four quadrants and three schedules with examples of each.', 'Describe Skinner\'s pigeon study in full detail, from aim to conclusion.', 'Evaluate operant conditioning using the six concepts, one paragraph each.'],`
- `d: ['There is no difference', 'Explain needs two examples', 'Describe needs evaluation'],` → `d: ['There is no difference between them in Section A', 'Explain needs two examples; describe needs only one', 'Describe needs evaluation; explain needs a study'],`
- `d: ['Classical conditioning: he associated the hall with food', 'Schema theory: he assimilated the servants', 'Dual process theory: he used System 2'],` → `d: ['Classical conditioning: he associated the hall with food', 'Schema theory: he assimilated the servants into his hall schema', 'Dual process theory: he used slow, careful System 2 thinking'],`
- `d: ['Antinous is aggressive.', 'Bandura studied 72 children in 1961.', 'Social learning theory is reductionist.'],` → `d: ['Antinous is an aggressive young man who enjoys shouting at the servants in the hall.', 'Bandura, Ross and Ross studied 72 children who watched an adult attack a Bobo doll.', 'Social learning theory is reductionist because it ignores biological causes of aggression.'],`
- `d: ['A new study in each paragraph', 'Ethics and generalisability', 'As many models as possible'],` → `d: ['A new study in each paragraph, described in detail', 'Ethics and generalisability of every study used', 'As many models of memory as possible, compared'],`
- `d: ['Full marks for depth', 'Nothing: the concept is what matters', 'It becomes a Section B answer'],` → `d: ['Full marks, because the concept is explored in depth', 'Nothing happens: only the concept is marked', 'It is marked as a Section B answer instead'],`
- Same item: `why: 'Knowledge of the area of study is one of the three strands. InThinking reports essays like this capped at about 9.' }` → `why: 'Knowledge of the area of study is part of the first strand. Examiner guidance reports essays like this capped at about 9.' }`
- `d: ['A new study to finish on', 'A summary of the question', 'A list of all six concepts'],` → `d: ['A new study or idea to finish on a strong note', 'A restatement of the question, word for word', 'A list of all six concepts to show wide knowledge'],`

### B. Factual or conceptual errors in episodes (must fix)

1. **ep7-strait.js, the framing demonstration is invalid.** The gain frame offers 10 certain survivors against a gamble worth 4 on average (1/3 × 12), so the certain option is simply better and both frames should favour Scylla. Tversky and Kahneman's options had equal expected values; that is what makes the effect a bias. Keep Scylla at two deaths and make the gamble worth 10 on average:
   - `'?frame_gain eurylochus.lookout~wary: Hug Scylla\'s cliff and ten of us will certainly come through alive. Risk the whirlpool, and there is a one in three chance all twelve come through, and a two in three chance none of us do.',` → `'?frame_gain eurylochus.lookout~wary: Hug Scylla\'s cliff and ten of us will certainly come through alive. Risk the whirlpool, and there is a five in six chance all twelve come through, and a one in six chance none of us do.',`
   - `'?frame_loss eurylochus.lookout~wary: Hug Scylla\'s cliff and two of us will certainly die. Risk the whirlpool, and there is a one in three chance nobody dies, and a two in three chance all twelve of us die.',` → `'?frame_loss eurylochus.lookout~wary: Hug Scylla\'s cliff and two of us will certainly die. Risk the whirlpool, and there is a five in six chance nobody dies, and a one in six chance all twelve of us die.',`
   - `'?side_charybdis @random gamble_ok gamble_bad gamble_bad',` → `'?side_charybdis @random gamble_ok gamble_ok gamble_ok gamble_ok gamble_ok gamble_bad',` (`@random` picks one argument uniformly, so this gives 5 in 6.)
   - `'?gamble_ok N: The whirlpool breathes out just as you pass. Everyone lives. It was a one in three chance, and you got it. Do not mistake that for proof that the choice was wise.',` → `'?gamble_ok N: The whirlpool breathes out just as you pass. Everyone lives. It was a five in six chance, and you got it. Do not mistake that for proof that the choice was wise.',`
   - `'N: Now, a confession. Eurylochus described the choice to you in one of two ways, chosen at random. Ten will certainly live, or two will certainly die. Same numbers. Different words.',` → `'N: Now, a confession. Eurylochus described the choice to you in one of two ways, chosen at random. Ten will certainly live, or two will certainly die. Same numbers, and on average the gamble saves just as many. Different words.',`
   - Teacher note: silence defaults to Charybdis in both frames; ask students who froze to leave their choice out of the class comparison. Suggested addition to the `teacher:` string: `Students who froze were given the gamble by default; leave them out when comparing frames.`
2. **ep7-strait.js, "one cow" is not an anchor.** Starting small and escalating is closer to foot-in-the-door. Give Eurylochus a real high anchor:
   - `'eurylochus.argue~angry: One cow, Captain. Just one. Split between us it is almost nothing.',` → `'eurylochus.argue~angry: At home a lord would slaughter a hundred head for a feast. We ask for one cow, Captain. Just one.',`
   - Replace the item (it spans two lines in the file) `{ q: '"One cow. Just one." Why is starting the bargaining at one cow dangerous?', a: 'It is an anchor: later demands get judged against it and adjusted only a little', d: ['It is an example of classical conditioning', 'It is a schema', 'It reduces cognitive load'], why: 'Anchoring: once one cow is on the table, two feels like a small adjustment, not a new decision.' },` with `{ q: 'Eurylochus mentions a feast of a hundred cattle before asking for one. Why does that make one cow sound reasonable?', a: 'Anchoring: the hundred sets a high reference point, so one cow seems small', d: ['Classical conditioning: the crew have learned to link the cattle with food', 'Confirmation bias: the crew remember only the omens that suit them', 'Cognitive load: the crew are too hungry and tired to count properly'], why: 'The first number becomes the anchor. Judged against a hundred, one cow feels like almost nothing, although the real question is whether to touch the cattle at all.' },`
3. **ep4-circe.js, "two different kinds of learning".** The pigs and Eurylochus are both classical conditioning.
   - `'N: Keep that. Eurylochus has just described two different kinds of learning, and he does not know either of their names.',` → `'N: Keep that. Eurylochus has just described two examples of the same kind of learning, the pigs\' and his own, and he does not know its name.',`
4. **ep4-circe.js, learning versus performance credited to the 1961 study.** Bandura, Ross and Ross (1961) had no reward or punishment condition; the distinction comes from Bandura (1965).
   - `'Learning and performance are not the same thing. The children could learn the aggression by watching, but whether they showed it depended on motivation. Keep that distinction for evaluation.'` → `'Learning and performance are not the same thing. In a later study, Bandura showed children a model being punished: they copied less, yet reproduced the aggression when offered a reward. Keep that distinction for evaluation.'`
5. **ep6-sirens.js, cognitive load theory does not start from the working memory model.** It rests on the general limit of working memory capacity, not on Baddeley and Hitch's components.
   - `'Cognitive load theory starts from the working memory model: working memory has a limited capacity, and learning suffers when the demands on it exceed that capacity.',` → `'Cognitive load theory starts from one assumption: working memory has a limited capacity, and learning suffers when the demands on it exceed that capacity.',`

### C. Exam-format overreach in episode narration (should fix)

A Section B question always names the theory, so students never have to guess it from the scenario type.
- ep4-circe.js: `say: 'Your exam move. Section B scenarios about changing a feeling are almost always classical conditioning.',` → `say: 'Your exam move. Section B names the theory for you. When it asks how classical conditioning could change a feeling, map every term onto the scenario.',`
- ep6-sirens.js: `say: 'The exam move. A Section B scenario about forgetting instructions under pressure is asking for the working memory model.',` → `say: 'The exam move. When a Section B question asks you to use the working memory model, name the component and tie it to a detail of the scenario.',`
- ep7-strait.js: `say: 'The exam move for this island. Section B loves confirmation bias.',` → `say: 'The exam move for this island. Section B can ask you to use a bias to explain a scenario, and explain means saying why, not just naming it.',`

### D. Smaller episode fixes (consider)

- ep5-underworld.js, MSM notes, encoding promised but never given: `'Rehearsal moves information into long-term memory, which is effectively unlimited. Without rehearsal, short-term memory decays, or new information pushes the old out. That is displacement.',` → `'Rehearsal moves information into long-term memory, which is effectively unlimited and encodes mainly by meaning, while short-term memory encodes mainly by sound. Without rehearsal, short-term memory decays, or new information pushes the old out. That is displacement.',`
- ep4-circe.js, continuity: Polites assumes the player refused the cup. `'polites~calm: Have you noticed? You refused Circe\'s cup and lived. Now half the young ones water their wine the way you do.',` → `'polites~calm: Have you noticed? You faced Circe and walked out a man. Now half the young ones water their wine the way you do.',`
- ep4-circe.js, name clash with exam B2 (where Mikkel is a nine-year-old boy): `stem: 'Mikkel\'s son hates reading ...'` and `q: 'How could classical conditioning make reading pleasant for Mikkel\'s son?'` → use `Tobias` in both (`'Tobias hates reading and groans when books come out. His favourite thing in the world is his grandmother\'s singing, which always makes him relax and smile.'`, `'How could classical conditioning make reading pleasant for Tobias?'`).
- ep6-sirens.js, Section B item 1 why: `'Both the instructions and the chanting are verbal, auditory input competing for the same limited store.'` → `'Both the instructions and the chanting are verbal, auditory input competing for the same limited component.'` (the loop is a component with a store inside it).

### E. js/drills.js (should fix)

- Serial position results, line 660: `The delay wiped out recency but left primacy intact.` → `A 10-second delay sharply reduced recency and a 30-second delay removed it, but primacy was left intact.`
- Twin tasks instructions, line 674: `say "one, two, one, two" out loud, twice a second, from the moment` → `say "one, two, one, two" out loud, about two numbers a second, from the moment` (same ambiguity as wm08).
- Anchoring results, line 801: `Strack and Mussweiler (1997) and studies of judges\' sentencing (Englich and colleagues) show that experts are affected too.` → `Strack and Mussweiler (1997) found the same with absurd anchors, and studies of judges\' sentencing (Englich and colleagues) show that experts are affected too.` (Strack and Mussweiler tested students, not experts.)
- Levels of processing pool, line 195 (consider): `p: 'Does it rhyme with "alive"?'` (olive does not rhyme with alive) → `p: 'Does it rhyme with "hollow"?'`. Unscored, but every semantic question is a "yes" while structural and rhyme questions mix yes and no. Craik and Tulving found "yes" items were remembered better, so the demo slightly inflates the semantic bar. Consider making three semantic questions "no" (e.g. harbour: `'Is it a kind of fruit?'`).

### F. data/cast.js (outside the listed files; consider)

- `desc: 'Recognise all three words the Chronicler hid in Troy.'` → `desc: 'Recognise all nine words the Chronicler hid in Troy, with no false alarms.'` (the award fires at 9 of 9 with no foils picked).

## Fourth-wall check

Passed. The audit's jargon scan finds no warnings, and I read every character line: no character names a theory, study or exam term. Characters describe experiences ("They watched what happened to you", "People see what they expect to see", "The men can only hold so much"), and only the narrator labels them.

## Remaining concerns, by severity

**High**
1. The episode MCQ length giveaways (section A) and the invalid framing demonstration (B1) are the two things most likely to mislead students or the teacher. Neither is in a file I was allowed to edit.

**Medium**
2. **Dresler et al. year and sample (exam.js C7).** The digest says Dresler et al. (2013), "23 memory athletes and 51 matched controls". To my knowledge the loci-training study with 72-word recall and a 4-month follow-up is Dresler et al. (2017, *Neuron*): 23 athletes with 23 matched controls, plus 51 naive participants randomised to loci training, working-memory training or none. I left the digest's version because the brief says to prefer the digests. Verify before students quote it; study detail is not marked in Section C, so the exam risk is low.
3. **Bartlett "no real difference between the two methods"** (sc14, topics, A12 pitfall). This is InThinking's reading. Bartlett's own account is that both methods produced the same kinds of distortion, with serial reproduction changing the story faster and further. The sc14 feedback ("so the change came from schemas, not the method") claims more than that. Consider "Both methods produced the same kinds of distortion".
4. **Section C mocks pair two L&C prompts.** In the real paper the two C options come from different contexts. That is a sensible adaptation for an L&C-only class test, but a line on the Trials or mock screen saying so would stop students expecting it in May.
5. **Unverified numbers** (taken from the digests, not checked against the primary papers): Lowe et al. (2004) "two inner-city London schools" (Food Dudes was developed at Bangor; check the setting), Gilbert et al. (2023) Anki figures, Coates et al. +91 kcal, Anderson and Pichert n = 39, Modi et al. n = 33, Mani et al. farmer means. None of these is in a quick-recall question except Coates' 26%.

**Low**
6. **Pavlov "used a metronome, not a bell"** (cc05, classical misconceptions). Pavlov's lab used metronomes, buzzers and bells. The game already says "bell" costs no marks; consider softening the misconception card to "He is best known for using a metronome".
7. **Framing effect and availability heuristic** (bi13 to bi16, bias sort, ep7) go beyond the two biases on the syllabus list (anchoring, confirmation). They are fine as contrast items, but a student should not choose framing for a Section A anchoring question. The Library could label them "for contrast".
8. **C6 and C7 stems.** "Evaluate perspective with regard to ..." is legitimate (the specimen used evaluate) but reads awkwardly. C7 ("To what extent can strategies to improve memory bring about lasting change?") names the concept only implicitly; consider "To what extent does research on strategies to improve one cognitive process show lasting change?".
9. **me03 key "Matched pairs"** for a matched-triplets design is the nearest standard term; the feedback now explains it. A stricter examiner might prefer "matched groups".
10. **questions.js line endings.** My scripted edit saved `questions.js` with LF endings (`topics.js` is LF too; `exam.js` kept CRLF). The file is untracked, so I could not confirm the original; git will normalise either way.

## Not changed, deliberately

- Glanzer and Cunitz, MSM date, ARRM wording and accommodation wording follow the digest rules and are consistent everywhere.
- Skinner's 15-second interval (repo digest) versus InThinking's 30 seconds: the question bank avoids the number, and the lesson says "15 seconds in the setting Skinner reported", which matches Skinner (1948).
- `docs/lessons.md`: the Odyssey row already records the Examiner stage. I left it for the coordinating session to update with "episode and drill text changes pending (see reports/examiner-qa.md)".
