# Escape the Loop — Operant Conditioning

Static GitHub Pages project for the IB Psychology operant-conditioning escape room.

## Structure

- `index.html` — student-facing content and room markup
- `css/styles.css` — layout, typography and lab/escape-room theme
- `js/app.js` — navigation, quizzes, matching games, validation, saved progress, sound, unlock effects, hidden verification signals, QR generation and PDF export
- `assets/images/` — local WebP illustrations and background art
- `assets/audio/` — CC0 Kenney sound effects (see `assets/CREDITS.md`)
- jsPDF and qrcode-generator are loaded from cdnjs, with jsDelivr as a backup when a school network blocks one of them

## Escape-room layer

- Every cleared lock plays an unlock animation and reveals one digit of a vault code (random per student) on the top rail. The final Escape dials the code and swings the vault door open.
- Sound effects can be muted with the speaker button on the rail.
- Multiple-choice options, the order of the questions within a lock, and the order of the matching cards are shuffled for each student, so a list of answer letters or positions cannot be shared. The order is kept across reloads.
- A wrong multiple-choice pick locks that question for 4 seconds. The PDF records how many picks each question took.

## Saved progress

Answers, placements, unlocked rooms and the verification counters are saved in the browser's localStorage as students work. A reload or closed tab restores everything; **Start over** on the first screen clears it.

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Serving over HTTP is preferable to double-clicking `index.html`, especially for embedded YouTube content.

## GitHub Pages

Push the contents of this folder to a repository. In **Settings → Pages**, deploy from the branch containing `index.html` (usually `main`, root folder).

## Image assets

All included illustrations are original local WebP assets, so there are no image hotlinks. Sound credits are in `assets/CREDITS.md`. Replace any asset with another file of the same name to change the visual without editing the HTML.

## Submission flow

At the final screen, students enter their name and class/group and click **Download submission PDF**. The PDF contains their recorded responses and a teacher-verification QR code. The verification result is not displayed in the student interface.

The QR code used to be made with qrcodejs 1.0.0, which crashed on any non-ASCII character, so students with æ, ø or å in their name or class could not get a PDF. It now uses qrcode-generator in UTF-8 mode and is drawn straight into the PDF. If the QR library is blocked, the PDF is still made, with a note in place of the code.

If the download does not work, backup options appear: open the PDF in a new tab (the default on iPad), print to PDF, or copy the answers as text. The copied text ends with the verification details as a base64 code. Students are reminded on-screen and inside the PDF to upload the downloaded file to **Elevfeedback** as evidence of work.
