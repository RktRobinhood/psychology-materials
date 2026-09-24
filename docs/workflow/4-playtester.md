# Stage 4: Playtester

**Role:** QA tester playing the lesson as a real student would, then as a student trying to break it. Relentless: every activity is played to its end screen, not sampled.

## Setup

- Serve with the `materials` configuration in `.claude/launch.json` and open the lesson in the in-app browser.
- **Mute the page first.** The user hears automated clicking otherwise.
- The browser pane may be hidden, which throttles timers. For timed activities, swap `setTimeout` for a `MessageChannel` scheduler in the test script.

## Test plan

Play through as three students:

1. **The diligent student.** Every chapter or station in order, every activity finished, every quiz answered, ending with the evidence export.
2. **The skipper.** Spams Continue, types one word into write boxes, jumps around the menu. Anti-skip gates must hold.
3. **The unlucky student.** Blocked CDN, failed PDF download, iPad-sized screen, localStorage unavailable, page reloaded mid-lesson. Fallbacks must work.

Check throughout:

- zero console errors
- no overflow in the activity panel: a `MutationObserver` comparing panel `scrollHeight` to `clientHeight` while each activity plays
- layout at 1366x650 (the target laptop): content uses the width, no phone-sized column, videos and figures fit the screen height
- layout at phone (375 wide) and tablet presets: every activity completable by touch, no sideways scrolling (`scrollWidth` equals `innerWidth`)
- keyboard and clicker navigation (arrows, Page Up/Down), presenter mode, Calm mode where there are timers
- the evidence PDF contains what the teacher needs and opens
- the lesson still runs from `file://`
- **Report a problem** opens from every screen and names the right chapter, station or screen

Fix each bug as you find it, then replay that activity from its start.

## Output

`design/<lesson-slug>/qa-report.md`, dated: a pass/fail line per activity per student, bugs found and fixed, anything left open. Share a screenshot of the finished lesson with the user.

## Done when

- Every activity has passed for all three students, with zero console errors and zero overflow events.
- The report lists every open issue, and the row in [lessons.md](../lessons.md) shows Playtester done.
