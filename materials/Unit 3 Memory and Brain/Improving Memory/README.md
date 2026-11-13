# Memory Olympiad v6 — GitHub Pages

Six timed classroom memory challenges. Every attempt randomizes all stimuli. Students can take a full battery or practise an individual event without a login. Detailed answers are revealed only after the run ends. Only the two most recent completed runs stay in this browser. Reports can be saved in PDF, CSV and JSON.

## Publish

1. Extract this ZIP. Upload **the extracted contents** (including `index.html`, `js`, `css`, `assets`) to the root of a GitHub repository.
2. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**. Save.
3. Open the Pages URL. No Node, build step, database, CDN or paid API is required. The included 72 illustrated portraits work immediately, without a network connection.

## Upgrade to realistic synthetic human faces (recommended)

`thispersondoesnotexist.com` does **not** offer a dependable documented browser API with cross-origin image access. Direct embedding is not suitable for repeatable testing: a face can change between study, recall and review, and remote images may fail to load. Instead, the **optional one-time downloader** creates a fixed offline-capable pack of 60+ portraits, each of which can be used repeatedly with unique randomized name assignments.

On a computer with Internet access and Python:

```bash
python -m pip install pillow
python install_real_faces.py --count 60
```

The script politely requests one portrait at a time, saves it as a 320×320 JPG, deduplicates files and writes `js/faces-pack.js`. Include the generated `assets/real-faces/` folder and updated `js/faces-pack.js` when uploading to GitHub. The website will automatically switch to realistic photos once 50 are available. **Do not delete** `assets/faces/` (illustrated fallback). The downloader does not run inside students' browsers.

**Source permission:** Before public GitHub distribution of downloaded portraits, check the face provider's current terms and licensing and whether public redistribution is allowed. No face images from that site are included in this ZIP. The service may change its routes or block automated downloads; if that happens the included illustrated faces continue to work. The source website is not affiliated with this project.

## Test checklist

- Begin all six events; complete the memorization and recall phases; verify detailed wrong-answer feedback at the end.
- Start two new tests. Verify stimuli and name–face assignments change, while images remain consistent within each event.
- Do three completed runs on one device and verify only the newest two persist. Export a PDF and CSV.
- Verify a narrow phone viewport and restart/refresh behavior.

## Privacy and interpretation

All student responses stay in the current browser's `localStorage` until explicitly exported. No telemetry, accounts or network calls are made during student tests. No leaderboard. These are *informal classroom challenges*, not validated diagnostic measures of individual memory ability. Results depend on exposure time, practice, image differences and device conditions.
