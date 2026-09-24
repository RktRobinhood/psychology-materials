# Odyssey (Unit 1 Review): workshop

The student-facing game is `materials/Unit 1 Review - Learning and Cognition/`. This folder holds everything behind it.

| Path | What it is |
|---|---|
| `brief.md` | The idea, learning outcomes, format, sources, open questions |
| `research/` | InThinking digest, repo lesson digest, Telltale and gamification notes |
| `reports/` | Examiner and design QA reports (rounds 1 and 2) |
| `tools/audit.mjs` | Checks every script: labels, poses, faces, drills, flags, the fourth-wall rule, answer-length giveaways. Run before committing. |
| `tools/voices.mjs` | Renders the voices with Gemini text-to-speech into `assets/voice/` and rebuilds `data/voice-manifest.js` |
| `tools/slice_sheets.py`, `tools/build_assets.py` | Cut the character sheets into sprites and export the runtime WebP art |
| `source-assets/` | The original art pack and the narrator pack (not committed: large) |
| `prototype/` | The earlier ChatGPT prototype, kept for reference (not committed) |

## Finishing the voices

The Gemini free tier allows 10 requests a day per model, resetting at 09:00 Danish time. The tool renders in batches (one request covers up to 26 lines of one speaker), so the full script needs about two days of free quota. Each run picks up where the last one stopped.

From the repo root:

```
cd "design/unit-1-review/tools"
npm install
node voices.mjs
```

The key is read from `C:\Users\<you>\.gemini_api_key`. It is never written into the website. Until a line has a recording, the game uses the browser's own voice.

Changing the text of a voiced line changes its file name (the name is a hash of speaker and text), so edited lines are re-rendered on the next run. Delete orphaned MP3s with `node voices.mjs --prune` before committing.
