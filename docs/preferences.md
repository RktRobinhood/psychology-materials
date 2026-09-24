# House style and preferences

What the user wants from every lesson, learned by working together. Add to it whenever the user corrects you or approves an approach worth repeating: one line, with the reason. Remove lines that stop being true.

## Students and classroom

- Lessons are built for **solo work at a student's own pace**; a teacher should be able to run them with little prep. Why: the user wants self-guiding, learn-by-doing lessons.
- Some students spam Continue. Every lesson has **anti-skip**: a short reading pause on each new screen, a minimum count of distinct words on write screens, and a menu that cannot jump past unfinished core chapters.
- Every lesson ends in **evidence for Elevfeedback**: a PDF made with jsPDF (student name, class, responses, core progress, presenter-mode flag). Always with fallbacks: open the PDF in a new tab, print to PDF, copy as text. Why: students once could not open or make the PDF.
- Danish names must survive the PDF (æ, ø, å).
- A **teacher panel** with per-chapter notes, a lesson plan and presenter mode (unlocks Continue for projector use; arrow keys and clicker Page Up/Down navigate).
- Timed checks offer a **Calm mode** with no timer.
- Classroom tasks are **informal replications or demonstrations**, never diagnosis of a student.

## Writing

- All prose is **original**. InThinking and textbooks are copyrighted: use them as a syllabus guide and reuse study facts only.
- No em dashes in prose.
- Hooks can be provocative, but the lesson never builds on a claim the evidence does not support.

## Look, sound and assets

- Aim high on aesthetics: these are student-facing and should feel polished.
- Use **public assets**, never synthesized sound. Audio: Kenney.nl CC0 packs, converted to levelled WAV so Safari plays them. Throttle sound effects so rapid clicks do not stack. Why: the user found synthesized Web Audio beeps "horrific".
- Icons: Lucide from jsDelivr at a pinned version, plus custom SVG; game-icons.net (CC BY) with credit.
- Every lesson has `assets/CREDITS.md`. **Ask before downloading** a new asset pack.
- The user often makes art with ChatGPT and relays it; list exactly which assets are still needed.

## Layout

- Target viewport: **1366x650** (a school laptop minus browser toolbars), with compact CSS for max-height 800 and 680. Phones should work too.
- Nothing inside the activity panel may grow mid-activity: the user saw scrollbars flash. Inside the panel, use fade animations only, never slide or scale.

## Build conventions

- Plain HTML, CSS and **classic scripts** (no modules, no build step), so a lesson runs from `file://` and from GitHub Pages.
- Lesson content in `data/lesson-data.js`; engine in `js/app.js`; tasks in their own `js/` files.
- External libraries from cdnjs at a pinned version, with jsDelivr as a backup.
- Folder names: `materials/<Lesson Name>/` in Title Case with spaces (matches existing lessons); `design/<lesson-slug>/` in kebab-case.

## Git

- Work directly on `main`. "Commit" means commit and push; the site deploys from `main`.
- `design/` folders can be large (Memory Quest's is about 17 MB): ask before committing big design assets.
