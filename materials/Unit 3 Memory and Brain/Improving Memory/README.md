# Memory Olympiad: Improving Memory

Six timed memory challenges (ordered words, digits, faces and names, grid, card order, symbol pairs) for the syllabus objective "improving a cognitive process". Students take all six (about 15 minutes) or practise one, try a memory trick from the tricks page, then run it again and compare.

## For the teacher

- Every attempt uses new random material, so students can repeat as often as they like. Answers are only shown after the run ends.
- No login and no network calls. The last two completed runs stay in the browser's `localStorage`; nothing leaves the device unless the student downloads a report (PDF, CSV, JSON, QR or copied score code) and sends it to you.
- Reports are generated on the student's device and are not independently verified.
- These are informal classroom challenges, not validated measures of anyone's memory ability. Scores depend on exposure time, practice, the images drawn and the device, so compare a student's own runs rather than students with each other.

## Face images

- `assets/real-faces/` holds 60 synthetic portraits downloaded from thispersondoesnotexist.com (listed in `js/faces-pack.js`). The lesson uses them when at least 50 are present. Their licence for public redistribution has not been confirmed: check the provider's current terms, or delete the folder and empty the list in `js/faces-pack.js`.
- `assets/faces/` holds 72 illustrated portraits, the automatic fallback. Do not delete it.
