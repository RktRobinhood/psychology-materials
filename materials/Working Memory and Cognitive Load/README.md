# Memory Quest — Working Memory & Cognitive Load

A story-driven IB Psychology lesson built for students working alone at their own pace (about 110 min core, 140 min with optional chapters). Students test their own working memory, replicate Landry & Bartling (2011) and Sana et al. (2013), and experience intrinsic, extraneous and germane cognitive load. Three timed "Static Surge" checks (Calm mode removes the timer), a self-rating recap and an examiner-marking task lead to the evidence for Elevfeedback.

## Saving evidence
The final screen downloads a PDF. If that fails (iPads, embedded browsers, blocked CDNs), students can open the PDF in a new tab, print to PDF with the browser, or copy the evidence as text. jsPDF loads from cdnjs with jsDelivr as a backup.

## Running it
Open `index.html` directly, or use the published GitHub Pages site. The Teacher button has per-chapter notes, a lesson plan and **presenter mode**, which unlocks Continue so you can click through on a projector. Arrow keys or a clicker (Page Up/Down) move between screens.

## Files
- `data/lesson-data.js`: all dialogue, teacher notes, quizzes and sorts. Edit content here.
- `js/games.js`: the interactive tasks.
- `js/studies.js`: study walkthroughs and the working memory model.
- `js/app.js`: navigation, sound, teacher panel and PDF.
- `assets/CREDITS.md`: asset sources and licences.

## Background
The first prototype and art were made with ChatGPT; its design notes are kept in `design/working-memory-cognitive-load/docs/` at the repo root. All lesson wording is original. The InThinking pages were used only as a syllabus guide.
