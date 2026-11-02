# MINDVAULT — IB Psychology Escape Room

## Deploy on GitHub Pages
Upload **index.html**, **style.css**, **questions.js**, and **main.js** together in the repository root. In repository Settings → Pages, select **Deploy from a branch**, choose `main` and `/ (root)`, and publish. Open the resulting HTTPS URL. No server, framework, external dependency or YAML configuration is needed.

## Student use
1. Begin the escape and work through nine rooms (five questions per room, six for concepts). Each new browser session's first question selection is randomized; saved runs resume where they left off.
2. Read feedback for every question. Both correct and incorrect responses are retained in the browser-based report.
3. Open the notes workshop, develop nine topic pages, and connect the six IB concepts.
4. Download **Submission report** (JSON) for the teacher and **Obsidian ZIP** for personal notes. Extract the Obsidian ZIP into a folder, then choose 'Open folder as vault' in Obsidian.
5. Use Backup/Restore JSON before changing devices or clearing site data.

## Teacher customization
Question objects are in `questions.js`, grouped by room ID. Format: `[room id, question, unused field, four choices, index of correct choice (0–3), explanation]`. You may edit/add questions; preserve the array structure. There is no answer secrecy on static hosting: students can inspect the published source. This is a practice and formative accountability tool, not a secure exam.

## Learning design
- Rooms: Short- & long-term memory; Glanzer and Cunitz; neuroplasticity; localization; classical conditioning; operant conditioning; cognitive load; cognitive bias; six IB concepts.
- Neuroplasticity includes developmental branching, pruning, myelination, adult training and the limits of structural MRI inference.
- Multiple-choice is a starting point; the final independent note-writing step elicits student explanations and links.
- Content is original practice, not official IB questions or marking guidance.

## Data, limits and privacy
- No external analytics, no network uploads and no required personal names.
- Scores/attempts are self-reported local browser data, freely editable by a technically skilled user. No trusted timestamps, proctoring or identity checks.
- Browser storage is local to origin/device; backup/export is essential. Serving from GitHub Pages will preserve storage on that origin when students return on the same browser, subject to browser policies.
- Submitted JSON can be opened by the teacher in any text editor; do not treat it as cryptographic evidence. For formal collection use a school-approved LMS.
