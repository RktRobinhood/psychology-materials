# Odyssey: The Long Way Home: design and QA review

Date: 2026-09-24. Reviewer role: QA lead for educational games (narrative design, Telltale-style; secondary-school UX).
Scope: `materials/Unit 1 Review - Learning and Cognition/` (index.html, css, all js, data/cast.js, all eight episodes; topics/questions/exam skimmed for structure), measured against the teacher's brief, `docs/preferences.md`, `docs/workflow/3-designer.md`, `docs/workflow/4-playtester.md`, `research/telltale-gamification.md` and the narrator pack.

Method: a careful read of the code; a run of `design/unit-1-review/tools/audit.mjs` (it reports no problems: 447 voiced lines, 330 questions); small Node scripts over the compiled scripts (flags, line lengths, answer-length cues); and a short browser check on a local server (port 8767, sound muted) at 1366x650 and 375x740. Every bug below marked **verified** was reproduced in the browser. I restored localStorage for that origin afterwards and edited no lesson files.

---

## Scores

| # | Area | Score | Why |
|---|---|---|---|
| 1 | Fidelity to the teacher's request | **8 / 10** | Almost every ask is built: eight episodes you can play in order or jump into; a story-free Library; Paper 1 Trials; 17 drill types; timed choices; recall QTEs; crew as lives and a real shipwreck; coins, a shop and eight power-ups (Moly as the undo); five endings plus "lost"; an evidence PDF. It loses marks on three things. Voice is not delivered yet (`data/voice-manifest.js` is empty and `assets/voice/` holds 0 files), so everything runs on browser speech, and that picks the wrong gender for most male characters on Chrome (B9). Phones cannot reach the power-ups (B3). Branching is thinner than the brief implies. |
| 2 | Telltale feel | **6.5 / 10** | The pieces are there: "X will remember that" toasts, timed choices with a silence option, "Previously" recaps keyed to earlier choices, a "Next time" teaser, the end-of-episode choice recap, and a hidden trust stat that decides the cattle scene. But the Chronicler speaks 306 of 447 voiced lines (68%), so it plays more like a narrated documentary than a character drama. Most choices only change the next one or two lines. Several setups never pay off: the Troy sail and Telemachus choices; Circe's "Remember that thought; it will matter later" (`potion_test` is never tested again); and the Sirens `song` choice has no consequence for two of its three options. Trust drives the most important branch, yet the player never sees it. |
| 3 | Gamification and replayability | **6 / 10** | There is a lot of system: omens, a variable-ratio chest, streak bonuses, Leitner weighting, a random shop, a random framing condition, the Charybdis gamble and 20 laurels. The balance is off, though. Income is roughly 140 to 150 drachmae per episode against prices of 25 to 60 and a 6-slot satchel, so coins pile up by episode 3. The laurel never leaves the satchel and cancels whole scripted deaths (B5). Moly doubles as a way to undo QTE losses (B8). The lantern reports "no visible cost" for options that later kill sailors (B14). None of the `||` line variants are used, so replays sound identical. The mastery meters barely move within one voyage. |
| 4 | Learning design | **7.5 / 10** | The best part of the game. Students experience each effect before it is named: the lotus grove on variable ratio and extinction, Bransford and Johnson with random allocation, a Bartlett-style reconstruction, a real framing manipulation, and a levels-of-processing encode at Troy that is recalled in Hades, which is genuine spacing. All 330 questions carry a "why" line, and missed questions come back. It falls short on exam transfer: in-story practice is recognition only, and 29 of the 32 exam-move items can be answered by picking the longest option (D1). Two bugs quietly corrupt mastery (B1, B2). Notes panels overflow the laptop screen (B7). |
| 5 | Narrator and dialogue | **7.5 / 10** | The Chronicler's voice is strong: dry, warm and exact ("a syllabus-sized quantity of trouble", "That is not conditioning. That is rope."). The fourth wall holds well: the audit's jargon check passes, and characters stay in world apart from Circe counting out "Three questions". It breaks the bible's own cadence rules, though: runs of 4 to 5 narrator lines in a row, 28 of 39 lines in the high-tension Strait episode, and 35 lines of 35 words or more (the longest is 44), which is long for TTS pacing and for the phone narration box. There are also small continuity slips (B15). |
| 6 | UX and accessibility (laptop and phone) | **6 / 10** | The foundations are good: laptop-first CSS with compact-height rules, 44px buttons, number-key choices, Calm mode, `:focus-visible`, a text-size setting, `prefers-reduced-motion` handling and a tap-only sort drill. **Verified problems:** on phones the HUD item tray is 0px wide, so the power-ups are invisible and cannot be tapped, and the coin pill overlaps the wrath pill. At 1366x650, all 11 notes panels overflow by 64 to 199px, which puts Continue at y≈778, below the fold. Beyond that: focus is never moved to new choices, panels or the Begin button; Presenter mode still runs QTE timers; double-clicking Check skips drill feedback; text size only scales dialogue and QTE text. |
| 7 | Robustness | **5 / 10** | Nothing is cancelled when a student navigates away. A question, choice or log that is left behind keeps its timers and document-level key listeners, and can later record false misses, swallow keystrokes in essays, cost crew in a different run state or close a new episode's panel (B1, verified). The `QB.record` monkey-patch leaks, which switches off mastery tracking for the rest of the session (B2, verified). Flags pile up when an episode is replayed (B4). A shipwrecked run keeps 0 crew and re-wrecks when continued (B6). Trials drafts are dead code. localStorage failure is handled silently but never reported to the student. |
| | **Overall** | **6.5 / 10** | An ambitious, well-written and pedagogically clever build whose content is ahead of its state handling. About six code fixes (B1 to B6) and two content passes (exam distractors, payoffs for choices) would lift it to 8 or better. |

---

## Top 10 overall (value order)

1. B1: cancel abandoned activities (ghost QTEs and choices)
2. B2: stop the `QB.record` monkey-patch leak
3. B3: phone HUD items unreachable
4. B4: flags pile up when an episode is replayed
5. D1: exam-move MCQs answerable by option length
6. B5: laurel never consumed; cancels scripted deaths
7. B6: shipwreck leaves a 0-crew run that re-wrecks
8. D2: put writing (generation) into the story
9. B7: notes panels overflow at 1366x650
10. D4: make choices pay off (Telltale callbacks)

---

## A. Confirmed bugs (ranked)

### B1. HIGH: Abandoned activities never cancel (ghost QTEs, choices, recall). Verified.
- **Where:** `js/qbank.js` 166-190 (rAF timer, document `keydown` onKey), 217-231 (`key2` listener, auto-proceed); `js/story.js` 501-510 (choice `onKey` removed only inside `choose`), 537-579 (`runQte` chain), 592-597 (`closePanel` uses module-level `el`); `js/screens.js` 427-446 (Library recall chain), 340-349 (tab switch just empties `body`); `js/app.js` 7-19 and `STORY.leave` (story.js 888-894), which bump tokens but cancel nothing.
- **Failure scenarios:**
  - *Choice left open:* a student is at the Circe potion choice, opens the menu, goes to the Oracle's Trials and types in a Section A answer. The keys 1 to 3 are swallowed (`preventDefault`) by the leaked choice listener. Verified: `keydown '1'` on the textarea returned defaultPrevented = true.
  - *QTE or Library recall left mid-question:* the rAF timer keeps running on the detached card. At 0 it calls `QB.record(q, false)`, so the student gets a miss on a question they never finished. After 1.4 s `key2` attaches to `document`; the next Space or Enter anywhere (an essay, the story) is swallowed and resolves the ghost promise. The chain then renders the next question into the detached host, and it times out and records another miss, and so on for up to 10 Library questions. In Calm mode there is no timer, so the digits 1 to 4 typed anywhere answer ghost questions and are recorded.
  - *Story QTE left and a new episode started:* the ghost `runQte` chain calls `give({crew:-1})` on the live run, which can shipwreck it. When it finishes it calls `closePanel()`, which now points at the **new** stage and hides whatever drill or notes panel is open. The live loop then waits forever: a soft lock.
- **Fix:** add one activity scope, for example `ACT = new AbortController()`, renewed by `STORY.leave`, `jump`, `ST.start`, `screen()` in screens.js, `screenEl()` in trials.js and the Library tab `show()`. `QB.ask(host, q, {signal})` cancels the rAF, removes `onKey` and `key2`, and resolves `{aborted:true}` on abort. `runQte`, `runLog`, `recallView` and the drill chains stop on `aborted`. `runChoice` removes `onKey` when its token is superseded. `closePanel` takes the panel it opened rather than reading global `el`.

### B2. HIGH: `QB.record` monkey-patch leaks and disables mastery tracking. Verified.
- **Where:** `js/story.js` 654-658 (`askUnrecorded`); `js/drills.js` 351-355 (lotus grove), 417-425 (Bransford and Johnson), 841-849 (Penelope), 890-892 (2-4-6).
- **Failure:** a student leaves in the middle of a Captain's log, or any of those four drills' check questions, through Home, Map, Menu or Moly. The promise never settles, so `QB.record` stays `function () {}`. Verified: after leaving Circe's bell log for the Library, `String(QB.record) === "function () {}"`. Nothing the student answers after that (Library recall, story QTEs) is recorded until a reload, and the evidence PDF under-reports their work. A nested patch makes it permanent: `rec` captures the no-op.
- **Fix:** delete the patching. `runLog` already sets `q.noRecord = true`, so make `QB.ask` honour it (`if (!q.noRecord && opts.record !== false) QB.record(q, ok)`) and pass `record:false` from the drills.

### B3. HIGH: Phone HUD hides every power-up. Verified at 375x740.
- **Where:** `css/styles.css` 41-60 and the phone block 447-460 (`.hud-items { max-width: 72px }`, `min-width:0; overflow:hidden`).
- **Failure:** with six items, `#hudItems` measured 0px wide and each item button was squashed to 8px and clipped. Lyre and Amphora can only be used from the HUD, and Moly can only be used from the HUD, so on a phone none of them can be used at all, including the free Moly that episode 4 introduces as a key mechanic. The coin pill (42px) also overflows into the wrath pill.
- **Fix:** below 760px, swap the tray for one "Satchel (n)" icon button that opens a bottom sheet with 44px item rows, or move the items to a second HUD row. Show wrath as a single "Ψ 3" figure on phones instead of 5 pips. Add a `min-width` to `.hud-stat`.

### B4. HIGH: Mutually exclusive flags pile up when an episode is replayed.
- **Where:** `js/story.js` 790-798 (a non-resume start resets pos, stats and omen but never `r.flags` or `r.choices`); the entry points are `js/screens.js` 110 ("Sail here with your crew", including sailing back to an earlier island) and 115 ("Restart this episode").
- **Failure:** in episode 3 the student names himself, restarts the episode from the map, and answers "Nobody" this time. Now `said_name` and `said_nobody` are both set, so the Cyclops shouts "Nobody!" **and** "Odysseus!", both narrator follow-ups play, both the boulder and the wave QTEs run, and both the `hubris` and `nobody` laurels are awarded. The same thing happens with `elpenor_lives` plus `elpenor_died` (both Underworld scenes play), `lotus_*`, `mast_*` and every other choice. Restart also skips Athena's mercy penalty (it keeps coins) while replaying the chests and paid questions, so it can be farmed.
- **Fix:** on any non-resume `ST.start`, rebuild the run from `r.snapshot` (the episode-start copy) the way `ST.retry` does, minus the penalty. Or track `r.epFlags[epId]` and delete those flags on restart.

### B5. HIGH: The laurel is never consumed and cancels whole scripted deaths.
- **Where:** `js/story.js` 93 (the shield branch), 131 (`addItem`); `data/cast.js` 67-68.
- **Failure:** `give` decrements `r.shield` but leaves `'laurel'` in `r.items`. The icon stays in the HUD forever and permanently takes a satchel slot (so a player who buys 2 laurels loses 2 of their 6 slots). Also, one shield absorbs the **whole** `crew-2` or `crew-3` event, which contradicts the script on screen: in episode 3 the narrator says "Two sailors do not see the morning" and the toast replies "The laurel holds. No sailor lost." The item text says it protects against "the next wrong answer".
- **Fix:** splice `'laurel'` out of `items` when the shield fires; apply it only to QTE misses (`runQte`), or to one sailor of a scripted loss, and match the description to whichever you choose.

### B6. MEDIUM-HIGH: A shipwreck leaves a 0-crew run that re-wrecks when continued.
- **Where:** `js/story.js` 116 (any `give` with crew ≤ 0 calls `shipwreck`), 859-871; `js/app.js` 40; `js/screens.js` 40-41, 110-116.
- **Failure:** after a wreck, `epState` stays `'playing'` with crew 0. Title shows "Continue the voyage: Ep 4, 0 crew"; the map offers "Continue this episode", "Restart" and "Sail here with your crew (0)". Each of these runs until the first reward of any kind (even a warm-up coin answer, verified) and then wrecks again. With "Sail here", the omen's `give` fires on the title card, so the wreck panel opens underneath it (z-index 10 against 12). "Begin" then starts the story loop behind the wreck panel. Also, `r.wrecking = true` is saved into the run; if the tab closes during the 700 ms delay, later wrecks never fire.
- **Fix:** set `epState = 'wrecked'` in `shipwreck`. Have `continueRun`, the island modal and the title route a wrecked run to the wreck panel (Athena's mercy, Study, New voyage). Keep `wrecking` in a module variable, not in save data.

### B7. MEDIUM: Notes panels overflow the 1366x650 laptop; sort drills grow mid-activity. Verified.
- **Where:** `js/story.js` 601-633 (`runNotes`, up to 8 terms), `css/styles.css` 160-173, 342-352.
- **Failure:** at 1366x650, all 11 notes panels scroll inside the panel (overflow of 64 to 199px). Troy's Continue button sits at y≈778 on a 650px viewport, so students must discover an inner scroll to go on. Sort drills gain a scrollbar as cards move into buckets (up to +92px), which breaks the "nothing grows mid-activity" rule in preferences.md.
- **Fix:** give notes a fixed layout (spoken line across the top, key points on the left, terms on the right, 4 or 5 terms with "More in the Library"), a sticky `.panel-foot`, and tighter rules under `max-height:680px`. Give sort buckets a fixed height with internal scrolling, or reserve the space for the deck.

### B8. MEDIUM: Moly works as a general rewind (save-scum) and at odd moments.
- **Where:** `js/story.js` 171 (usable whenever `choiceSnap` exists), 179-197.
- **Failure:** the HUD stays live during QTEs, drills, the shop and the wreck panel. Moly restores the state from before the last choice, so all crew lost in later QTEs comes back. It rescues a shipwreck after the "lost" ending and laurel were already recorded. Used mid-QTE or mid-drill, it triggers B1 and B2. A Moly bought at the map stall mid-episode refunds itself, because the rewind restores the coins and items from before the purchase.
- **Fix:** allow Moly only while a dialogue line or choice is on screen (not during `has-panel`). Decide whether it rewinds only the choice's own `fx` and flags (fairer) or everything (then say so on the item card).

### B9. MEDIUM: The browser voice picker gives male characters a female voice.
- **Where:** `js/audio.js` 52-58; the `prefer` lists in `data/cast.js`.
- **Failure:** `v.name.toLowerCase().indexOf('male')` also matches "Google UK English **Fe**male", which Chrome lists before "Male". Odysseus, Polites, Elpenor, Polyphemus, Poseidon, Scylla and the crew can all come out as the same female voice, with only pitch changed. Since no MP3s exist yet, this is what students hear today.
- **Fix:** match whole words (`/\bmale\b/` and not `/female/`). Better: allocate distinct installed voices round-robin by cast gender, so no two speakers in a scene share one.

### B10. MEDIUM: A browser-speech error counts as a finished line, so autoplay races ahead.
- **Where:** `js/audio.js` 127-128 (`u.onerror = finish(true)` with `mode` still `'synth'`), and story.js 415-417.
- **Failure:** if speech errors (not-allowed, synthesis-failed, no voices), every line resolves at once as "natural". Autoplay then advances as soon as `minPause` allows (at most 2.6 s), so a 44-word line is gone before it can be read.
- **Fix:** on error, set `ctl.mode = 'text'` and finish after `A.readingMs(text)`. Show a small "Voice unavailable: reading mode" toast once.

### B11. MEDIUM: Presenter mode still runs QTE and recall timers.
- **Where:** `js/qbank.js` 101 (checks Calm mode only); the claim is in `js/screens.js` 559 ("No reading pauses, no timers").
- **Fix:** `var calm = S.opt('calm') || S.opt('presenter') || !opts.timer;`.

### B12. MEDIUM: Double-clicking Check skips drill feedback (an anti-skip hole).
- **Where:** `js/drills.js` 88-89 (sort), 133-134 (order), 167-168 (cloze): the same button turns from Check into Continue, and its handler resolves at once when `checked`.
- **Fix:** disable the button for about 1.5 s after checking (the same pattern as `qte-go`), or render a new Continue button.

### B13. MEDIUM: Trials writing is lost when a student navigates away.
- **Where:** `js/trials.js` 126-136 and 152 (`draft[id]` is written but never read), 212-216 (only the mock's own Back button asks for confirmation; top-bar Home, Map and Menu do not), plus the `setInterval` timers, which are never cleared.
- **Failure:** one tap on Map in the middle of a 90-minute mock throws the essay away.
- **Fix:** save drafts to `S.data.meta.drafts[id]` on input (debounced) and restore them in `T.attempt` and `mock`; add a guard in `APP.go` while a Trials text box is dirty; add `beforeunload`; clear the intervals on leave.

### B14. LOW-MEDIUM: Tiresias' Lantern hides the costs that matter.
- **Where:** `js/story.js` 444-453 (`fxPreview`); the data at `ep4-circe.js` 77 (`roof_leave`, which later means `crew-1` and Elpenor's death), `ep7-strait.js` 85 (`cattle_pray` leads to `crew-3`), 27 (`side_scylla` leads to `crew-2`).
- **Failure:** the lantern shows "no visible cost" on the options that cost the most, which teaches students that the lantern lies.
- **Fix:** add `risk:` text to every option with a delayed consequence ("Elpenor may not survive the night"), or compute it from the conditional `@give` lines that follow.

### B15. LOW: Script continuity slips.
- `ep4-circe.js` 60: "Remember that thought; it will matter later." `potion_test` is never tested again.
- `ep6-sirens.js` 49-56: the timed `song` choice ("The song fills everything") is shown even with `mast_wax`, when Odysseus has wax in his own ears; `song_turn` under wax, and `song_row` and `song_listen` in every case, have no consequence.
- `ep3-cyclops.js` 93: says wrath makes questions "a second faster", but the taunt adds 2 wrath, which is 2 seconds.
- `ep1-troy.js` 93: "escapes Ismarus with fewer oars" plays even when every answer was right and no crew was lost.
- `ep5-underworld.js` 45: "Twelve names of the dead", but the serial drill shows object words (oar, goat, lamp).
- `data/cast.js` 102: `lop3` says "all three words"; there are nine.
- `js/screens.js` 277: the retry button promises "6 crew", but `ST.retry` gives `max(6, crew at episode start)`.
- `ep7-strait.js` 24-25: Eurylochus says "all twelve" when the HUD may show 7.

---

## B. Design suggestions (ranked)

### D1. HIGH: Exam-move MCQs are answerable by option length.
- **What:** in 29 of the 32 Captain's-log items the correct option is strictly the longest (in the 330-item bank it is 90 of 281, 32% against a 25% baseline). Examples: the Troy causality item, the Jonas link sentence, the Oliver link sentence. The correct answer is also often the only hedged, "developed" sentence.
- **Why:** this is the Paper 1 bridge; if the items can be guessed, the exam-transfer claim does not hold, and Continue-spammers earn 10 dr each.
- **Fix:** rewrite the distractors as near-miss developed sentences of similar length: a right theory with no scenario link, a scenario link to the wrong component, or an evaluation where none is asked for. Add a lint to `audit.mjs` that flags items where `a.length > 1.3 × max(d.length)`.

### D2. HIGH: Put generation into the story, not only recognition.
- **What:** in story mode, every exam move is multiple choice. The only free writing is the Bransford and Johnson recall and the separate Trials.
- **Why:** retrieval practice and Paper 1 transfer come from producing sentences. The teacher asked for review for a full Paper 1.
- **Fix:** once per episode, add a "Captain's log: write it" beat: one Section B link sentence of 25 or more distinct words, anti-paste, then a reveal of the model sentence and a three-item self-check, saved into the evidence PDF. Keep it untimed and cheap (about 90 seconds).

### D3. HIGH: Rebalance the economy so the shop is a decision.
- **What:** a student at 75% accuracy earns roughly 140 to 150 dr per episode (warm-ups, about 7 QTE answers at 7 to 11 dr, logs at 10 each, three drills at up to 20 each, including flat pay for participation demos, chests, omens). Prices are 25 to 60 and the satchel holds 6, so coins pile up from episode 3 (the "Treasure of Troy" laurel for 300 dr is near-automatic).
- **Fix:** pay demos 5 to 10 dr for participation, not 20. Pay logs only on the first attempt per run. Raise prices by 10% per purchase in a run. Add sinks that matter: "Recruit a sailor" (+1 crew, 45 dr, rising), a confidence wager on QTEs (stake 10 dr on "sure", which uses hypercorrection; research #10), and an optional "hard water" route with level-3 questions that pay double (research #11).

### D4. HIGH: Make choices pay off (the core of the Telltale feel).
- **What:** 56 flags are set. Most choices are only ever tested inside their own episode (only `ismarus_*`, `lotus_*`, the taunt, Elpenor's fate, `ask_*`, `mast_*` and the cattle reach a later episode, and mostly as one "Previously" line), and several are pure dead ends (`troy_*`, `tell_*`, `cave_wait`, `song_row`, `song_listen`, `potion_*` apart from the next line). The main systemic payoff (trust, which decides the cattle scene and skips the choice at trust ≥ 2 or ≤ -1) is never shown to the player.
- **Fix:**
  - Pay off Telemachus in Ithaca (Penelope or the nurse reacts to "the truth / the story / nothing").
  - Pay off `troy_listen` or `troy_fast` in Eurylochus's cattle speech ("You heard us out at Troy...").
  - Pay off `potion_test` (Odysseus asks Circe to drink first, which mirrors the 2-4-6 lesson: test what could prove you wrong).
  - Add a narrator callback that quotes the student's own choice text (the bible's `{{choice:...}}` token; `run.choices` already stores it).
  - Show trust as crew-mood faces on the end-of-episode screen.
  - Give each episode one real branch-and-bottleneck (two different 2 to 3 minute scenes that rejoin), not just alternative lines.

### D5. MEDIUM-HIGH: Rebalance narrator cadence and line length for voice.
- **What:** the narrator has 306 of 447 voiced lines (68%). Strait: 28 of 39. There are runs of 4 or 5 narrator lines in a row (Troy's opening, the HM passage, the framing reveal, the Ithaca endings). 35 lines run to 35 words or more; the median is 22 and the longest is 44. Troy speaks 262 words before the first choice.
- **Why:** the narrator bible asks for "one short intervention every 2 to 4 character scenes" and less narration in high-tension scenes. Long lines also slow TTS pacing and fill the phone narration box.
- **Fix:** move scene description into character lines (Eurylochus can describe Scylla; Polites can recount the sheep). Cap narrator lines at about 30 words and split the rest. Get to the first choice in Troy within about 60 seconds.

### D6. MEDIUM: Add replay variety and use the chest as a live operant lesson.
- **What:** the engine supports `A || B` variants, but none are used. Seven omens, one random frame and one gamble make up the only run-to-run story variation.
- **Fix:**
  - Write 2 or 3 variants for recaps, QTE lead-ins, shop greetings and "Here is how you stand".
  - Randomise the hazard order within an episode where the fiction allows.
  - Unlock an alternate telling after the first homecoming (research #13).
  - The chests are already a variable-ratio schedule (35% empty). Count openings and let the narrator comment after the fourth ("one more chest", bible §9), then call back to it in the lotus grove. The rewards mechanic becomes content that way.

### D7. MEDIUM: Make mastery visible and motivating within a voyage.
- **What:** mastery is the average Leitner box capped at 3, over 14 to 30 questions per topic. A full voyage asks about 5 questions per topic, so the end-of-episode "Your mastery" meters show around 5 to 15%, which reads as failure. The teacher guide promises questions returning "in later sessions", but `s.t` is saved and never used for scheduling.
- **Fix:** on the end screen, show "this episode: 7/9, 3 questions due for review" plus the list of missed items (an "Oracle's scroll", research #8). Add time-based due dates (box intervals of 1, 3 and 7 days, using `s.t`) and seed the next episode's warm-up with due items.

### D8. MEDIUM: Keyboard, focus and extraneous load.
- **What:**
  - Focus is never moved to new content (choices, the title card's Begin, panel headings, the QTE card), so keyboard and screen-reader users must hunt for it.
  - The countdown has no text alternative.
  - `--fs` (text size) scales only dialogue and QTE text, not notes, drills, the Library or Trials.
  - On phones, `.btn-sm` (36px) and `.hud-item` (32px) are below the 40px minimum.
  - QTE timers start on first paint, with no orientation beat.
  - The HUD and the drifting, raining background stay active during questions.
- **Fix:**
  - Move focus to the first choice, the Begin button and the panel heading.
  - Add an `aria-live` "5 seconds left" cue.
  - Apply `--fs` to `.panel` and `.screen-inner`.
  - Raise the touch targets to 40px or more.
  - Add a 1 s grace period before the ring starts (research #2).
  - Pause `.stage-bg` and storm animations and dim the HUD while `.has-panel` is set (research #15).

### D9. MEDIUM: Fairer endings for students who jump in.
- **What:** a student who starts at Ithaca has no stored choices, so Penelope asks poem trivia (`FALLBACK` in drills.js 809-814, such as Circe's bell) that they never saw, and a low score sets `end_doubt`. That then overrides Scholar even after 12 out of 12 axes (ep8 96-100).
- **Fix:** fill in Penelope's questions from what the student did in *this* run (the axes, the insult choice, the mock), or from recall on the topics they played. Put Scholar before Doubt, or combine the two into one epilogue ("Scholar, but Penelope still wonders").

### D10. LOW-MEDIUM: Tell students when progress cannot be saved.
- **What:** `state.js` 24-44 fails silently when localStorage throws (private windows, locked-down school browsers). A student can play for two hours, close the tab and lose everything, including the Trials answers the evidence PDF needs.
- **Fix:** probe storage at start-up. If it fails, show a persistent banner ("This browser is not saving your progress. Download your evidence PDF before you close the tab") and prompt for the PDF at the end of each episode.

---

## Strengths to keep

- The experience-first demos (lotus grove, Bransford and Johnson, Bartlett reconstruction, randomised framing, dual-task suppression, the 2-4-6 task) are excellent, and the narrator frames each as an informal demonstration rather than a test of the student.
- The Troy-to-Hades levels-of-processing thread is real delayed retrieval, woven into the fiction.
- Two exam moves are especially good examples of theory application: Circe's bell ("before I name anything, you name it") and the rescue choice, which the narrator classifies into operant quadrants.
- Data hygiene is strong: the audit is clean, there are no dashes in the script, every question has a `why`, the evidence PDF keeps Danish letters, and there are fallbacks for PDF, print and copy.
