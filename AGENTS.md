# Mindfield: IB Psychology lessons

Interactive, self-guiding IB Psychology lessons for students at Ikast-Brande Gymnasium, published to GitHub Pages from `main` (https://rktrobinhood.github.io/psychology-materials/).

## Where things live

- `materials/<Lesson Name>/`: the **student-facing** lesson. Everything in here is published, so only clean, finished files belong here (see [Release](docs/workflow/5-release.md)).
- `design/<lesson-slug>/`: the lesson's **workshop** (kebab-case slug). Briefs, stage reports, prototypes, source crops. Never published.
- `docs/`: how we work. This file points into it.

## The pipeline

Every lesson moves through five stages, each with its own role. The user usually asks for one stage per session, often days apart. When a request names a stage, or clearly means one ("check it as an examiner", "design and QA pass", "make it ready for students"), read that stage's file before starting and take on its role.

1. **Spark** ([1-spark.md](docs/workflow/1-spark.md)): turn a wild idea and raw material into a brief and a first playable lesson.
2. **Examiner** ([2-examiner.md](docs/workflow/2-examiner.md)): audit academic rigour as an IB Psychology examiner.
3. **Designer** ([3-designer.md](docs/workflow/3-designer.md)): raise the look, feel and solo-work design; enrich with public resources.
4. **Playtester** ([4-playtester.md](docs/workflow/4-playtester.md)): play every activity in a real browser and fix what breaks.
5. **Release** ([5-release.md](docs/workflow/5-release.md)): strip the lesson down to a clean student product and ship it.

"Design and QA" means Designer then Playtester, in that order. Stages can repeat: new content added after Examiner goes back through Examiner.

At the end of every stage, update the lesson's row in [docs/lessons.md](docs/lessons.md).

## Devices

Every lesson must work well on both laptops and phones.

- **The laptop is the primary surface** (target viewport 1366x650). Design for it first and use its width: multi-column layouts, generous type. A laptop must never get a narrow, phone-sized column with empty space on both sides.
- **Phones and tablets are first-class citizens**, not an afterthought: every activity must be completable by touch on a 375-wide screen with no sideways scrolling. Drag-and-drop needs a tap alternative.
- Check both at every stage that touches layout (Spark, Designer, Playtester). The details are in [preferences.md](docs/preferences.md#layout).

## House style

[docs/preferences.md](docs/preferences.md) is the single record of the user's standards and habits: writing style, copyright rules, assets, build conventions, git. Read it before writing any lesson content or code.

It is a living document. When the user corrects you, states a preference, or approves an approach worth repeating, add it there in the same session (one line, with the reason) and tell the user you did.

## Git

"Commit" means commit and push to `origin main`: the site deploys from there. Stage only the files for the task at hand; other sessions often have uncommitted work in the same folder.
