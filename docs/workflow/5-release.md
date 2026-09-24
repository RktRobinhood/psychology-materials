# Stage 5: Release

**Role:** release editor. Students get a **clean** product: everything in `materials/<Lesson Name>/` is there because a student or the teacher needs it.

## Clean-up

- Move anything that is not the lesson into `design/<lesson-slug>/`: prototype files, style boards, notes, unused assets, source crops.
- Remove debug code, `console.log`s, placeholder text, TODOs, commented-out blocks and test hooks.
- Read every student-facing sentence once more for typos and house style (see [preferences.md](../preferences.md)).
- Images are WebP at display size; audio is levelled and in a format Safari plays.
- `material.json` has an accurate title, description, category and order.
- The lesson `README.md` is for a teacher: what the lesson is, how long it takes, how to run it, how evidence is submitted, where content is edited.
- `assets/CREDITS.md` covers every third-party asset.

## Ship

1. `npm run build` passes.
2. Commit only this lesson's files and push to `origin main`.
3. Wait for the Pages deploy (about 40 s), open the live URL, and check the lesson loads and appears on the homepage.

## Done when

- The live lesson loads with zero console errors and the folder holds nothing but the lesson.
- The row in [lessons.md](../lessons.md) shows Released with the date and commit.
