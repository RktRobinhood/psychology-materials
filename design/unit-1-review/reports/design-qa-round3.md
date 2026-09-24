# Odyssey: The Long Way Home: design and QA review, round 3

Date: 2026-09-24. Same reviewer and role as rounds 1 and 2 (`design-qa.md`, `design-qa-round2.md`): QA lead for educational games.

Method: I re-read the changed code: `story.js` (ST.start, titleCard, retry, restartEpisode, runWrite, runDrill), `screens.js` (islandModal, drillScreen, Gauntlet), `trials.js` (mock), `drills.js` (every `QB.ask`), `audio.js` (synth), `app.js` (continueRun) and the QA block of `styles.css`. I ran Node scripts over the eight episodes (narration stats, write-step keys, model answers against the gate) and a simulation of the write gate on realistic student answers. Then I did a browser run on a local server (port 8792) at 1366x650, 1024x768, 768x1024 and 375x740, with sound muted. The pane was hidden, so I used a 16 ms `requestAnimationFrame` shim for the timer tests. The origin's localStorage was empty before testing, and I cleared it afterwards. The server is stopped. I edited no lesson files. Everything marked **verified** was reproduced in the browser.

The teacher's scope note is applied: this is for independent review, and the PDF is an optional record. I did not score the PDF.

---

## 1. Round-2 items

| # | Item | Status | Evidence |
|---|---|---|---|
| N1 | The mock paper crashes | **Fixed, verified** | `finish` is declared as `null` before the questions and `check()` is guarded. All three mocks render: 4 textareas, 2 Section C choices, and Finish disabled. I did one full run end to end (fill, choose C, finish, mark 5 answers, save): `mock1` was stored, `TRIALS.dirty()` returned false, and there were no errors. "Leave the mock" clears the dirty flag. |
| N2 | Ghost drill questions and hijacked navigation | **Fixed, verified** | All four drill `QB.ask` calls and the Gauntlet return on `r.aborted`, and `drillScreen` checks `U.gen`. Library lotus, leave at "Name the schedule", then Home: the student stays on the title screen, and `1`/Enter are not `defaultPrevented`. Library Bransford and Johnson, leave at check 1 for the Map: the student stays on the map, with no ghost question. Gauntlet, leave mid-question for Home, then press `1` and wait 20 s with timers running: `meta.q` is unchanged, so no misses are recorded. Story lotus, leave at the check question: no coins, no "Drill complete" toast. A normal story lotus run still pays 12 dr, sets `lotus_resisted`/`lotus_picks` and moves on to the next step. |
| N3 | Athena's mercy throws after a reload | **Fixed, verified** | `ST.retry` uses `S.run().ep`. Wreck, reload, Map, island, Athena's mercy: coins go from 60 to 30 (the snapshot's coins halved), crew from 10 to 11 (at least 6, then +1 from a Stowaway omen), `epState 'playing'`, the title card shows, and there are no errors. |
| N4 | False "Voice unavailable" toast | **Fixed, verified** | Two utterances were interrupted (a raw `speechSynthesis.cancel()` and a `ctl.stop()`). Both fired `onerror: 'interrupted'`, no toast appeared, and `_warned` stayed false. |
| N5 | Tablet HUD hides the power-ups | **Fixed, verified** | At 768: satchel button 40x40, tray `display:none`, no sideways scroll. At 375: the sheet lists all 6 items. At 1024 the tray is back with 30px items (it was 28), which is fine for a mouse but small for touch on an iPad in landscape (low). |
| N6 | Finished-island button | **Fixed, verified** | A finished island now offers "Sail on to Episode 3: The Cyclops" and "Sail here again with your crew (11)". Sail here again: same crew and coins (77), `lotus` flags cleared, `troy` flags kept, new snapshot, title card shows. Sail on: Cyclops starts. The map's run-bar reads "Sail on". |
| N7 | Omens stack at the title card | **Fixed, verified** | Four Map → Continue loops, a title-screen Continue, and a reload then Continue all kept one Stowaway omen (crew stayed 11, coins 30, one owl). The snapshot is taken before the omen, so a restart gives the pre-omen state plus exactly one new omen. See R2 for the remaining re-roll. |
| N8 | Write gate accepts junk | **Fixed, but now too strict (see M1)** | Junk made of single letters is blocked. Drop is `preventDefault`ed (verified). But the new gate blocks genuine two-sentence answers and some correct alternatives. |
| N9 | Phantom 8px scroll | **Fixed, verified** | `--pp` drives the sticky footer. At 1366x650, on all 31 notes, write and log panels in the eight episodes, `scrollHeight - clientHeight = 0`. The footer sits 1px inside the panel. |
| N10 | Small consistency issues | **Mostly fixed** | Verified: with the satchel sheet open during a QTE, `1` is ignored and nothing is recorded. The satchel now says Moly is "Use it from here right after a story choice" and the Amphora gives "double drachmae from every correct quick-time answer". Moly decrements `choiceHist` (code). Still open: the QTE clock keeps running behind the sheet (low). |
| D3 | Participation demos pay 12 | **Fixed** | Flash, span, serial, dual task and anchor end with 1/1, which `runDrill` pays at 6 dr. |
| B15 | Continuity | **Mostly fixed** | Polites' Ismarus line is now "Men could have died on that beach", gated on `ismarus_stay`. The Strait says "Of the twelve at the oars". See R4. |
| D5 | Narrator cadence | **Improved** | The narrator now has 177 of 324 lines (55%, was 57%), and the Strait 25 of 42 (was 30 of 43). The framing problem and Scylla's strike now come from Eurylochus and Scylla. Lines of 35 words or more: 21. |
| D6 | Replay variety | **Slightly better** | Seven warm-up lines now have a `||` variant. Recaps and QTE lead-ins are still single-variant. |

### Regression hunt in ST.start (all clean)

I traced every entry path in code and exercised the main ones in the browser:

- **Resume** (`playing`, `pos > 0`): restages and continues. Omens are not touched. Verified with the drill and QTE resumes.
- **At the title card** (`playing`, `pos 0`, stored omen, snapshot): the omen and checkpoint are kept, and `titleCard` sees `applied` and does not give again. Verified. Every episode's step 0 is an `@scene` directive, so `pos 0` only ever means the title card.
- **Fresh start** (new voyage, "Sail here", "Sail on", the episode-end `go()`): `epState` is `new` or `null`, so the fresh path runs. The snapshot is taken **before** `r.omen = null` and the new omen, so it is pre-omen. Correct.
- **restartEpisode**: restores the snapshot and sets `epState 'restart'`, which is not `playing`, so the fresh path runs and one new omen is applied. No stacking. Verified over four restarts.
- **retry**: the snapshot with crew at least 6 and half the coins, then the fresh path. Verified after a reload.
- **Sail here again**: `epState 'new'` then the fresh path. Only that episode's flags and choices are cleared. Verified.
- Episode 1 has no omen, so a Continue at its title card takes the fresh path again. That is harmless, because nothing has happened yet at `pos 0`.
- A save made before this fix, sitting at a title card, has an omen without `applied`, so it re-gives once. That is a one-time, pre-release edge. Ignore it.

---

## 2. Remaining issues

### M1. MUST FIX (small): the write gate now blocks genuine answers and some correct ones. Verified.
- **Where:** `js/story.js` 734-748 (`min = 25`, counting distinct words of 3 or more letters), and the `keys:` on each `{write}` step in `data/episodes/*.js`.
- **Failure 1, the length gate.** The prompt says "One or two sentences". But 25 *distinct* words of 3 or more letters needs about 35 to 40 running words. Every model answer passes (32 to 47 such words, 38 to 71 running words). Realistic, correct student answers do not:

  | Answer (all correct) | Words | Distinct, 3+ letters | Result |
  |---|---|---|---|
  | Jonas, positive reinforcement with "because" | 30 | 20 | Blocked: "20 different words (at least 25)" |
  | Oliver, phonological loop with "because" | 27 | 21 | Blocked |
  | Ida, confirmation bias with "because" | 28 | 23 | Blocked |
  | Ismarus, causal chain | 32 | 23 | Blocked |

  The counter says "20 different words" to a student who has written 30, because short words are silently dropped. It reads as a bug.
- **Failure 2, keys that reject correct answers:**
  - Episode 2 (`reinforce`): a correct answer that uses **punishment** ("negative punishment: remove his break time...") is told "Use the key terms: reinforce". The step's own checklist accepts "reinforcement or punishment".
  - Episode 5 (`short-term`): "short term memory" (no hyphen) and "STM" are rejected. These are the most common spellings in student writing.
  - Episode 4 (`attention`): a good SLT answer built on models, vicarious reinforcement and motivation is rejected unless it says "attention". The checklist asks for "at least two of" the four processes.
  - Episode 1 (`caus`): this key is satisfied by the word "be**caus**e", so an answer that never mentions causality passes. The key has no effect.
  - Every step except Ithaca also requires the literal word "because". Only episodes 2 and 6 ask for it in the question. Elsewhere, "so", "since" or "therefore" is blocked with no warning in the prompt.
- **Fix (about 15 minutes):**
  1. Lower the default to `min: 15` words of 3 or more letters, and relabel the counter "N key words (at least 15)". Or count all distinct words against 20. Either way, a 25 to 30 word two-sentence answer should pass.
  2. Make each key an any-of group, matched on word starts, for example: `keys: [['reinforc','punish'], ['because','since','therefore','so ']]`; `[['short-term','short term','stm']]`; `[['attention','retention','reproduc','motivat','vicarious']]`; for Ismarus, `/\bcaus/`, which does not match "because".
  3. Where "because" really is required, say so in the question text, as episodes 2 and 6 already do.

### R2. LOW: "Restart this episode" at the title card re-rolls the omen.
It restores the pre-omen snapshot, so nothing stacks. But a student can restart until they get Fair winds (+15 dr) or Athena's favour (an Owl). This is cheap omen-shopping, not farming. Fix: in `restartEpisode`, carry `r.omen` across when `r.pos === 0`, or always keep the omen of the current `snapshot.ep` on a restart.

### R3. LOW: small UX leftovers
- The QTE clock keeps running while the phone satchel sheet is open (digit keys are now safely ignored).
- From 1001 to about 1100px wide the tray items are 30px, below a comfortable touch size on landscape tablets. `max-width: 1100px` for the satchel, or 36px items, would cover it.
- An interrupted utterance that was not `stop()`ped now waits for the long fallback timer (reading time x 2.2 + 4 s) before `done` resolves. This only happens if the OS or another tab cancels speech. Continue still works, so it is harmless.

### R4. LOW: continuity leftovers
- Episode 1, line 96: `?!ismarus_stay N: The fleet slips away from Ismarus whole.` The watch path (2 QTE questions) and the leave path (1 question) can both cost sailors, so "whole" can be false. Add `?crew<...` handling, or change it to "slips away from Ismarus before the Cicones arrive".
- Episode 1, line 94: "Men could have died on that beach. If we had sailed." Men may **have** died in the dawn QTE, and "if we had sailed" would have *prevented* deaths, so the counterfactuals point the wrong way. Try: "It could have gone differently. If we had sailed. If the Cicones had slept late...".
- Episode 7, lines 24-25: "Of the twelve at the oars" still sits against a HUD that may show 7. This is acceptable as a stated hypothetical, because the framing numbers must be fixed. Optionally add: "Say, twelve at the oars".

---

## 3. Scores

| # | Area | R1 | R2 | **R3** | Why |
|---|---|---|---|---|---|
| 1 | Fidelity to the teacher's request | 8 | 8 | **8.5** | The mock Paper 1 works end to end. Story, Library and Trials all serve independent review, and the PDF is correctly optional. |
| 2 | Telltale feel | 6.5 | 7.5 | **7.5** | The Strait is now acted (Eurylochus frames it, Scylla strikes), and a finished island can be replayed with the same crew. Still 55% narrator, no branch-and-bottleneck scene, and variants only in the warm-ups. |
| 3 | Gamification and replayability | 6 | 7 | **8** | Omens no longer stack, demos pay 6, "Sail here again" makes replaying the islands a real option, and prices escalate. Left: omen re-roll by restart (R2), and no coin sinks beyond the stall. |
| 4 | Learning design | 7.5 | 8.5 | **8** | The mock and the drill checks are sound again. But the write gate, the one piece of generation in every episode, now blocks correct two-sentence answers and misdirects punishment, "short term" and SLT answers (M1). Fix M1 and this is 8.5 to 9. |
| 5 | Narrator and dialogue | 7.5 | 8 | **8.5** | Continuity repaired, the Strait is voiced by its characters, and the warm-ups vary. Two small Ismarus slips remain (R4). |
| 6 | UX and accessibility | 6 | 7.5 | **8.5** | The satchel works on tablets, the false voice toast is gone, there are no phantom scrollbars, the island buttons are correct, and digit keys are safe under dialogs. All verified at 375, 768, 1024 and 1366. |
| 7 | Robustness | 5 | 6.5 | **8.5** | N1 to N3 were fixed and verified, with no console errors across about 40 scripted navigations. Every ST.start path (resume, title card, fresh, restart, retry, Sail here again) is correct. No regressions found. |
| | **Overall** | 6.5 | 7.5 | **8.2 / 10** | Above the commit bar. Every blocker and high item from round 2 is fixed and verified, and the story engine's state machine is now clean. The one must-fix (M1) is a content-gate calibration, not a crash. It should land before students use the write steps, because as it stands it blocks correct answers and teaches the wrong key terms. |

---

## 4. Recommendation

- **Commit: yes** (8.2). Ideally land M1 in the same pass; it is a 15-minute change to one function and eight `keys:` arrays.
- After M1, re-run the gate simulation. The test set is four genuine 27 to 32 word answers, plus one punishment answer, one "short term"/"STM" answer and one SLT answer without the word "attention". All should pass. Junk made of single letters should still fail.
- Towards 8.5 or more: R2 (keep the omen across a title-card restart), R4 (two Ismarus lines), `||` variants on the recap and QTE lead-in lines, and one branch-and-bottleneck scene (for example in the Strait: Scylla's cliff and Charybdis converge on Thrinacia with different crew moods).
