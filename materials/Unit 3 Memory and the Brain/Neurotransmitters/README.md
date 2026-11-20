# Neural Lab — GitHub Pages Classroom Edition

An interactive IB Psychology lesson: neurotransmission, a synthetic rat-maze investigation inspired by the simplified Martinez & Kesner teaching account, and an external link to the University of Utah's original Mouse Party activity.

## Publish on GitHub Pages

1. Unzip this archive. Upload **its contents**, not a parent folder, to the root of your GitHub Pages repository.
2. Keep `index.html`, `game.js`, `styles.css`, and the entire `assets/` directory in their existing relative positions.
3. In GitHub Settings → Pages, deploy from your chosen branch and the repository root (`/`).
4. Open your published GitHub Pages URL. No build step or JavaScript framework is required.

The YouTube lesson video requires internet access; the player is shown directly **before the maze experiment**. The final activity links to the University of Utah's **Mouse Party** website. It launches the original resource in a new tab rather than copying it into this project.

## Audio assets

All **12 previously approved Ian narration recordings** are included as MP3 files under `assets/audio/`. The game loads the files using relative URLs such as `assets/audio/synapse-01.mp3`; no audio files are hosted on external services. An integrity manifest is at `assets/audio_manifest.json`.

The additional general excitatory/inhibitory explainer scene is captioned and has no separate recording. **Narration defaults ON** for the synapse explainer and automatically plays when a student starts maze actions. Students may mute it using the visible control; browser policy can require that first user interaction before sound starts.

Before public redistribution, confirm that the original ElevenLabs-generated voice recordings may be distributed under your plan's terms.

## Scientific accuracy

Maze graphics and numerical observations are a deliberately simplified **synthetic teaching simulation**, not actual measurements from rats or an exact replication of the original apparatus. The default curves deliberately illustrate the three-condition classroom account associated with **Martinez & Kesner (1991)**: receptor antagonist = most errors, saline = intermediate, acetylcholinesterase inhibitor = fewest. They are **illustrative assumptions**, not measured outcomes or a verified primary-source replication. The video covers that teaching account. In the distinct, peer-reviewed **Rogers & Kesner (2003)** maze experiments, scopolamine impaired **encoding** and physostigmine impaired **retrieval**, rather than demonstrating a universal more-ACh-is-better result. See https://pubmed.ncbi.nlm.nih.gov/14521875/.

## Student privacy

No student answer upload or accounts are built into Neural Lab. Recap answers stay in the student's browser and can be exported as text. The embedded YouTube player and the outbound Mouse Party site are third-party services and have their own privacy practices.

## What changed in the compact maze release

- No automatic scroll to the chart after a trial. The chart appears once all three conditions finish.
- Twelve simulated trials per group, with three animated sample traversals of one virtual rat.
- Shortened maze text, reduced results chart height, simplified readings.
- Verified relative MP3 loading for the existing 12 files in Chromium.

## Mouse Party companion whiteboard (new)

The Drug Lab page now includes a built-in, original observation whiteboard inspired by the structure of the classroom worksheet. Students keep the website open while they explore the official Mouse Party activity in a second tab. The board covers **heroin, ecstasy, marijuana, methamphetamine, alcohol, cocaine, and LSD**, with dedicated fields for neurotransmitters, mechanism, and a freehand synapse sketch.

- Select substances using the tabs or Previous/Next; keyboard arrow keys work on tabs.
- Type notes and draw with a mouse, touchscreen, or stylus. Undo and Clear controls are provided for each sketch.
- Answers and sketches are saved locally in that browser, not uploaded to a teacher or server.
- **Download my PDF** creates a seven-page A4 PDF directly in the browser, with all typed notes and sketches. The PDF requires no server or third-party JavaScript library. The optional Print button uses the browser's print dialog.
- The original University of Utah worksheet PDF is *not redistributed* as part of this public GitHub bundle. Use the university's original site and teaching material when appropriate.

Mouse art is an original generated illustration, not copied from the Utah site. The final release contains all local image and MP3 assets under `assets/`.
