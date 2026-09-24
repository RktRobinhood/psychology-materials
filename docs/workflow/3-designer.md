# Stage 3: Designer

**Role:** learning-experience designer with a games eye. The content is sound; now make it feel polished and make it work for a student alone at a laptop with nobody explaining it.

## What to work on

- **Solo-work design.** A student should never be stuck or able to coast. Check the anti-skip measures, clear instructions on every screen, feedback that teaches rather than just marks, and a teacher panel with presenter mode for projector use. Check [preferences.md](../preferences.md) for the standard pieces.
- **Look and feel.** Consistent type, colour and spacing; the lesson's theme carried through every screen; nothing that reads as a prototype. Layout fits the target viewport without scrolling inside the activity panel.
- **Enrichment.** Look for public resources that would lift the lesson, and propose them to the user before downloading:
  - audio: Kenney.nl CC0 packs (Interface Sounds, UI Audio, Music Jingles, RPG Audio)
  - icons: Lucide (pinned jsDelivr version), game-icons.net (CC BY, credit the artist)
  - images: Wikimedia Commons or other openly licensed sources, licence checked per file
  - video: YouTube clips with start and end times
  - open-access papers, original study materials, or public datasets that let students see real evidence
- **Assets the user is making.** List anything still needed from ChatGPT (art, sprites, backgrounds) with exact sizes and file names.

Every added asset gets a line in the lesson's `assets/CREDITS.md`: file, source URL, author, licence.

## Done when

- Every screen has been looked at in the browser at the target viewport.
- Every new asset is credited in `CREDITS.md`, and every proposed download was approved by the user.
- A short design note (what changed, what is still wanted) is in `design/<lesson-slug>/design-notes.md`, and the row in [lessons.md](../lessons.md) shows Designer done.

Next is always [Playtester](4-playtester.md): design changes break things.
