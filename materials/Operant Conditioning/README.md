# Escape the Loop — Operant Conditioning

Static GitHub Pages project for the IB Psychology operant-conditioning escape room.

## Structure

- `index.html` — student-facing content and room markup
- `css/styles.css` — layout, typography and lab/escape-room theme
- `js/app.js` — navigation, quizzes, matching games, validation, integrity signals and PDF preparation
- `assets/images/` — local WebP illustrations and background art
- QRCode.js is loaded from cdnjs and is used only when preparing the submission report

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Serving over HTTP is preferable to double-clicking `index.html`, especially for embedded YouTube content.

## GitHub Pages

Push the contents of this folder to a repository. In **Settings → Pages**, deploy from the branch containing `index.html` (usually `main`, root folder).

## Image assets

All included illustrations are original local WebP assets, so there are no image hotlinks. Replace any asset with another file of the same name to change the visual without editing the HTML.
