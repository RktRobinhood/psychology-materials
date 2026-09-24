# Odyssey: The Long Way Home: design and QA review, round 2

Date: 2026-09-24. Same reviewer and role as round 1 (`design-qa.md`): QA lead for educational games (Telltale-style narrative design; secondary-school UX).

Method: a full re-read of `js/` (story, qbank, util, app, state, audio, screens, drills, trials, evidence), the CSS, `data/cast.js` and all eight episodes, including the 21:08 wording pass that makes the evidence PDF an optional progress record (I did not score its optionality). Node scripts over the compiled data (flag ownership, option lengths, economy inputs, narration stats). A browser run on a local server (port 8791, sound muted except for one speech test), at 1366x650, 1024x768, 880x700, 768x1024 and 375x740. The browser pane was hidden, so `requestAnimationFrame` was paused; for timer tests I swapped in a 16 ms `setTimeout` shim. The origin's localStorage was empty before testing, and I cleared it afterwards. I edited no lesson files. Everything marked **verified** was reproduced in the browser.

---

## 1. Round-1 items

| # | Item | Status | Evidence |
|---|---|---|---|
| B1 | Abandoned activities never cancel | **Partly** | The story is fixed. `U.onCancel`/`U.cancelActivities` cleanly tear down QTEs, choices, logs and Library recall. Verified: leaving a story QTE for the map leaves no key listener behind. But the drill check questions and Scylla's Gauntlet ignore `aborted`, which brings back ghost questions and adds navigation hijacks (N2). |
| B2 | `QB.record` monkey-patch leak | Fixed | The patching is gone. `QB.ask` honours `noRecord`, and the log and all four drills pass it. |
| B3 | Phone HUD hides power-ups | **Partly** | Phones are fixed: at 375 the satchel button is 40x40, the sheet lists all 6 items with 40px "Use now" rows, and there is no sideways scroll (verified). Tablets are still broken: from 761 to about 980px the tray is back, with item buttons 8px wide (768) and 12px wide (880), and the satchel button hidden (N5, verified). |
| B4 | Flags pile up on replay | Fixed | `r.flagEp` and `restartEpisode` work. No flag is set in two episodes (script check), so ownership is unambiguous. Verified: a restart clears `potion_test`, restores crew and coins, and applies no penalty. |
| B5 | Laurel never consumed | Fixed | Verified: it absorbs one QTE miss, is removed from the satchel, `shield` drops to 0, and the description matches. |
| B6 | 0-crew run re-wrecks | Fixed, with a new bug | `epState 'wrecked'` works. Title and map Continue open the wreck panel. Athena's mercy from that panel works (verified). But Athena's mercy **from the map after a reload** throws (N3). |
| B7 | Notes overflow at 1366x650 | Fixed | Verified on all 11 notes panels: Continue sits at y=637 in a 640px panel, and content ends at least 40px above the sticky footer. Leftover: an 8px phantom scroll on every panel (N9). |
| B8 | Moly as a general rewind | Fixed | Verified: blocked while `has-panel` is set; it rewinds flags, wrath and choices but keeps crew, coins and items; the old choice reappears. |
| B9 | Female voice for male characters | Fixed | Whole-word matching. On this machine (David, Mark, Zira) the men map to David or Mark. Small leftover: the narrator's `en-GB` preference can pick a female UK voice on Edge. |
| B10 | Speech error races autoplay | Fixed, with a new bug | It falls back to reading time, but now shows a false "Voice unavailable" toast (N4, verified). |
| B11 | Presenter mode runs timers | Fixed | `calm = calm \|\| presenter \|\| !timer`; choice timers check both. |
| B12 | Double-click skips drill feedback | Fixed | `holdContinue` holds the button for 1.3 s on sort, order and cloze. |
| B13 | Trials writing lost on navigation | **Partly** | Drafts save and restore, and `APP.go` has a guard. But the **mock paper no longer renders at all** (N1, verified), so neither the guard nor the mock drafts can be used. |
| B14 | Lantern hides real costs | Fixed | `risk:` text is on roof_leave, side_scylla, cattle_pray, mast_none, said_name, taunted and others. |
| B15 | Continuity slips | Mostly | Fixed: Circe's line now pays off in Strait, the Sirens choice is skipped under wax (and row and turn now have lines), the wrath line, the "fewer oars" line, the serial offerings, lop3 and the retry label. Still open: ep7 lines 24-25 ("ten of us", "all twelve") against a HUD that may show 7; ep1 line 94 (Polites: "They would have lived") also plays when nobody died at dawn. |
| D1 | Exam moves answerable by length | Partly | Correct option strictly the longest: 29 of 32 → **17 of 32**, and none is more than 1.3x the longest distractor. The 330-item bank is unchanged (91 of 281, 32%). |
| D2 | Generation in the story | Fixed (weak gate) | One `{write}` per episode (8), saved to the log and the PDF. The gate accepts junk (N8). |
| D3 | Economy | Partly | QTE pay is 6 to 10, logs 6, drills max 12, and prices rise 15% per purchase. But participation-only demos (flash, span, serial, dual task, anchor) still pay the full 12, there are no new sinks, and the 6-slot satchel, not coins, remains the real limit. Estimated income at 75% accuracy: about 100 to 150 dr per episode. |
| D4 | Choice payoffs | Mostly | troy_listen/fast and potion_test are paid off in Strait, tell_* in Ithaca, and crew mood is shown on the end screen. Still missing: a branch-and-bottleneck scene, and `cave_wait` is still never read. |
| D5 | Narrator cadence | Partly | Lines of 35 words or more: 35 → 20. The narrator has 190 of 333 voiced lines (57%). Strait: 30 of 43. |
| D6 | Replay variety | Not fixed | One script line uses `\|\|`. The 4th-chest narrator line is new (it fires once per device). |
| D7 | Mastery visibility | Partly | The Oracle's scroll of missed questions is on the end screen. There are no time-based due dates. |
| D8 | Focus and load | Mostly | Focus now goes to the first choice, Begin and the QTE question. There is an aria-live "Five seconds left", `--fs` applies to `.panel`/`.screen-inner`, phone targets are 40px, a 1 s grace comes before the clock (verified: an 8 s timer expires at about 9.0 to 9.5 s, and the ring holds at 8 during the grace), and the background pauses under panels. The HUD is not dimmed. |
| D9 | Fair endings for jumpers | Fixed | The fallbacks come from Ithaca itself, and `axes_perfect` routes to Scholar before `end_doubt`. |
| D10 | Storage warning | Fixed | A `S.canSave` probe and a banner. |

---

## 2. New bugs (ranked)

### N1. BLOCKER: the mock paper crashes and renders nothing. Verified.
- **Where:** `js/trials.js` 249 (`counter(..., function (ok) { entry.ok = ok; check(); })`), 263 to 265 (`var finish` is declared after the questions are built).
- **Failure:** `counter()` runs `upd()` at once, which calls `check()`, and `check()` sets `finish.disabled` while `finish` is still undefined. This throws `TypeError: Cannot set properties of undefined (setting 'disabled')`. The student sees "Leave the mock / Mock paper 2 / 90:00" and nothing else. `mockActive` stays true, so every top-bar navigation now asks "Leave the Trials?". The teacher guide's homework ("a full mock Paper 1 in the Trials") cannot be done.
- **Fix:** declare `finish` before the first `q()` call, or write `if (finish) finish.disabled = ...` in `check()` and call `check()` once after `inner.appendChild(finish)`.

### N2. HIGH: drill check questions and the Gauntlet are not cancellation-aware (ghost questions, hijacked navigation). Verified.
- **Where:** `js/drills.js` 358-360 (lotus), 422-428 (Bransford and Johnson), 848-849 (Penelope), 892 (2-4-6); `js/screens.js` 441 (`drillScreen` → `.then(SC.topic(...))`), 504-507 (Gauntlet).
- **Failure (verified):**
  - *Library, lotus grove:* at "Name the schedule", press Home. The abort resolves the drill, and `drillScreen` sends the student straight back to Operant > Drills. Home does nothing.
  - *Library, Bransford and Johnson:* at check 1, go to the Map. The abort starts a second, untimed ghost question. Pressing `1` on the map was `preventDefault`ed and answered it. A later Enter (or autoplay) resolved it, and the student was pulled off the map into Schema theory. The same would happen mid-episode: pressing Continue on the title screen starts the episode, then the ghost resolves and `SC.topic` tears the story down.
  - *Gauntlet:* leave mid-question for Home. The abort counts as a lost life, and `next()` asks a new question on the detached host. Pressing `1` on the title screen answered it and **recorded a miss** (`bi12: n 1, r 0`). With a visible tab the ghost's timer also expires and records misses on its own, up to three.
  - *Story:* leaving a lotus or Bransford and Johnson check question still pays coins and shows a "Drill complete" toast on the next screen. `runDrill` then calls `closePanel()` on whatever stage `el` points to by then.
- **Fix:**
  - After every `QB.ask(...)` in drills.js, start the `.then` with `if (r.aborted) return;`, and never resolve an aborted drill.
  - In `drillScreen`, capture `var g = U.gen` and only call `SC.topic` if `U.gen === g`.
  - In the Gauntlet, add `if (r.aborted) return;`.

### N3. MEDIUM: Athena's mercy from the map throws after a reload. Verified.
- **Where:** `js/story.js` 1026-1037 (`ST.retry` uses the module-level `ep`, which is `null` until an episode has loaded in this page session); it is called from `js/screens.js` 116.
- **Failure:** a student wrecks, closes the tab, and next lesson goes Map → the island → "Athena's mercy". The result is `TypeError: Cannot read properties of null (reading 'id')`, after the run has already been replaced (coins halved, `epState 'retry'`). The modal closes, nothing starts, and a second click is needed.
- **Fix:** `var id = S.run().ep || (ep && ep.id);` and use `id` in both `ST.start` calls.

### N4. MEDIUM: false "Voice unavailable on this device" toast. Verified in Chrome.
- **Where:** `js/audio.js` 133-139.
- **Failure:** `speechSynthesis.cancel()` (which runs on every Continue, skip or new line) fires `onerror` with `error: 'interrupted'`. The first time a student skips a line, they are told their device has no voice, while speech keeps working. After the MP3s arrive this only affects lines without a file, but it will still appear.
- **Fix:** `u.onerror = function (e) { if (ctl.stopped || e.error === 'interrupted' || e.error === 'canceled') return; ... }`.

### N5. MEDIUM: tablet and narrow-laptop HUD still hides the power-ups. Verified.
- **Where:** `css/styles.css` 540 and 563-566 (the satchel only appears at `max-width: 760px`); 55 (`.hud-items { overflow: hidden }`).
- **Failure:** with 6 items, the item buttons measure 8px at 768 wide (iPad portrait) and 12px at 880. Lyre, Amphora and Moly cannot be used there. They are 28px at 1024 and 38px at 1366.
- **Fix:** switch to the satchel at `max-width: 1000px`, or always show the satchel button and let the tray scroll.

### N6. MEDIUM-LOW: "Play this episode" on a finished island starts the next one. Verified.
- **Where:** `js/screens.js` 111-119 with `js/app.js` 35-41.
- **Failure:** after finishing Cyclops, clicking the Cyclops island shows "Play this episode", which starts Circe's Hall. There is also no way to replay a finished island with the current crew ("Sail here" requires `run.ep !== ep.id`).
- **Fix:** when `run.epState === 'done'` and `run.ep === ep.id`, show "Sail on to Episode n+1" and a separate "Sail here again with your crew" (set `epState 'new'`, then `STORY.start(ep.id, {restart:true})`).

### N7. LOW-MEDIUM: omens stack when Continue is pressed while the title card is showing. Verified.
- **Where:** `js/story.js` 904-918 (at `pos === 0`, a start is not a resume, and the snapshot is taken **after** the earlier omen was applied) and 936-945.
- **Failure:** six Continues on Lotus gave Owl, then +15 dr, with both kept (and "Short rations" applied twice). A reload or Map → Continue at the title card re-rolls the omen and adds it again, which farms owls and coins.
- **Fix:** if `r.omen && r.omen.ep === epId && r.pos === 0`, reuse the stored omen without calling `give` again. Or save the pre-omen snapshot and restore it before re-rolling.

### N8. LOW: the written Captain's log accepts junk. Verified.
- **Where:** `js/story.js` 729-741.
- **Failure:** "a b c d ... y" (25 single letters) passes the 25-distinct-word gate, is saved to the log and the PDF as the student's exam move, and pays 5 dr. Drag-and-drop text is not blocked (the Trials do block it).
- **Fix:** count only words of 3 or more letters. Require 2 of the step's key terms (add `keys:` per write step, for example `['causality','because']`). Add a `drop` preventDefault.

### N9. LOW: phantom 8px scroll on every activity panel at laptop heights. Verified.
- **Where:** `css/styles.css` 543 (`bottom:-22px; margin-bottom:-22px`) against a panel padding of 18px (at ≤800px height) or 14px (at ≤680px).
- **Failure:** every notes, write and log panel has `scrollHeight - clientHeight = 8`, so a scrollbar shows even when everything fits, and the footer's bottom 7px is clipped.
- **Fix:** put the padding in a variable (`--pp`) and use `bottom: calc(-1 * var(--pp)); margin-bottom: calc(-1 * var(--pp))` at each breakpoint.

### N10. LOW: small consistency issues
- The phone satchel sheet does not pause a running QTE, and digit keys still answer the question behind the modal.
- In the satchel, Moly says "Used at a story choice" when it is really used from the HUD after a choice.
- Amphora says "every correct answer" pays double, but only QTE answers do.
- The end-screen recap counts Moly re-choices as extra "voyages".

---

## 3. Scores

| # | Area | Round 1 | Round 2 | Why |
|---|---|---|---|---|
| 1 | Fidelity to the teacher's request | 8 | **8** | Writing in every episode and real callbacks are new. But the mock paper, a core part of the Paper 1 ask, is broken (N1). Voice is assumed to arrive. |
| 2 | Telltale feel | 6.5 | **7.5** | Troy, Circe and Telemachus choices now pay off episodes later. Crew mood is visible, the lantern tells the truth, and the Sirens choice is fixed. Still narrator-heavy (57%; Strait 30 of 43), with no branch-and-bottleneck and no line variants. |
| 3 | Gamification and replayability | 6 | **7** | Laurel, Moly, price escalation and tighter pay work. Remaining problems: participation demos pay the full 12, there are no coin sinks, omens stack (N7), and replays sound identical. |
| 4 | Learning design | 7.5 | **8.5** | Generation in every episode, the Oracle's scroll, mastery tracking now intact, and better exam-move distractors. The 330-item bank still favours the longest option (32%), and junk writes pass (N8). |
| 5 | Narrator and dialogue | 7.5 | **8** | Long lines fell from 35 to 20, continuity is mostly repaired, and the payoff lines are in the right voice. Two continuity slips remain, and the Strait is still narrated rather than acted. |
| 6 | UX and accessibility | 6 | **7.5** | Phone satchel, notes fit at 1366x650, focus management, aria-live cue, 1 s grace, 40px targets, storage banner. Against that: the tablet HUD (N5), a false voice toast (N4), phantom scrollbars (N9) and the mislabelled island button (N6). |
| 7 | Robustness | 5 | **6.5** | The story's activity scope is solid and verified. But the mock crashes (N1), drills and the Gauntlet produce ghosts and hijack navigation (N2), and retry throws after a reload (N3). |
| | **Overall** | 6.5 | **7.5 / 10** | A clear step up, and the story core is now trustworthy. It is **not yet above the 8/10 commit bar**, because a blocker (N1) and a navigation-hijack class of bug (N2) were introduced or left in the non-story modes. |

---

## 4. Shortest path above 8

Must fix (all small code changes; together about 8.3 overall):
1. **N1:** declare `finish` before building the mock questions (one line).
2. **N2:** `if (r.aborted) return;` after every drill `QB.ask` and in the Gauntlet, plus the `U.gen` guard in `drillScreen`.
3. **N3:** `ST.retry` uses `S.run().ep`.
4. **N4:** ignore `interrupted`/`canceled` in `u.onerror`.
5. **N5:** show the satchel up to 1000px wide.

Then, towards 8.5 or more:

6. **N6:** fix the finished-island button and allow replaying an island with the current crew.
7. **N7:** stop omens re-rolling at the title card.
8. **N8:** add a key-term gate to the write step.
9. **Content:** in the Strait, move 6 to 8 narrator lines into Eurylochus's and Odysseus's mouths. Add `||` variants to recaps and QTE lead-ins. Pay participation demos 6 dr instead of 12.

Add a regression check to `tools/audit.mjs` or a small browser smoke script that opens each mock, leaves each drill mid-question, and asserts that no `keydown` is `defaultPrevented` afterwards. Both N1 and N2 would have been caught that way.
