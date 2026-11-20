# Materials

Everything in this folder is published. The homepage is built from the folders, so **where a lesson lives decides where it appears**.

```text
materials/
  Course Tools/                    course map, syllabus checklist, tools used in every unit
  Unit 1 Foundations/
  Unit 2 Learning and Bias/
    section.json                   the unit's title, guiding question, year and practical
    Operant Conditioning/          one lesson
      index.html
      material.json                optional: title, description, category, order
  Unit 3 Memory and the Brain/
  Unit 4 Relationships/
  Unit 5 Health/
  Unit 6 Development/
  shared/                          scripts shared by lessons (not listed)
```

The six units follow the [Two-Year Course Guide](Course%20Tools/Course%20Guide/index.html). A unit with no lessons yet still shows on the homepage, with links to its part of the course guide and checklist.

## Adding a lesson

1. Put the lesson's folder (with its `index.html`) inside the unit it teaches. Course-wide things that belong to no single unit (class info, exam practice across units, the syllabus documents) go in `Course Tools/`.
2. Optionally add `material.json` beside `index.html`:

   ```json
   {
     "title": "Escape the Loop: Operant Conditioning",
     "description": "An escape room about reinforcement and punishment.",
     "category": "Escape room",
     "order": 1,
     "covers": [2]
   }
   ```

   Without it, the title and description are read from the page's `<title>` and `<meta name="description">`. `category` is the small label on the card (Lesson, Lab, Story lab, Escape room, Group stations, Practice, Context review, Exam practice...). `order` sorts cards within the unit. `covers` lists other units the lesson also reviews, shown as "Also covers Unit 2".
3. Commit to `main`. GitHub Actions rebuilds the catalogue and publishes it.

A lesson folder uploaded straight into `materials/` (for example with GitHub's "Add files via upload") is not lost: it appears under **Not yet sorted** at the bottom of the homepage until it is moved into a unit.

## Moving or renaming a published lesson

Students and Redemption Arc QR codes link to lesson addresses, so after moving a folder add a line to [`scripts/legacy-redirects.json`](../scripts/legacy-redirects.json) (`"Old Folder": "Unit N .../New Folder"`). The build writes a redirect page at the old address that keeps any `#hash` and `?query`. Also update any `design/` tools that point at the folder, and the link in [docs/lessons.md](../docs/lessons.md).

Lessons sit two folders deep, so shared scripts load from `../../shared/`.

## Report a problem

Every lesson has a **Report a problem** entry in its menu or top bar. It opens a small dialog that sends students to one of the GitHub issue forms in `.github/ISSUE_TEMPLATE/` ("Something broke" or "Something is wrong or confusing"), with the lesson name, the place in the lesson and the device already filled in. Students without a GitHub account can copy the same details and send them to their teacher.

To add it to a lesson:

1. Load the shared script after the lesson's own scripts, with the lesson's short name:

   ```html
   <script defer src="../../shared/report-problem.js" data-lesson="Memory Quest"></script>
   ```

2. Put a link in the lesson's menu or top bar. Without the script it still opens GitHub's template chooser:

   ```html
   <a href="https://github.com/RktRobinhood/psychology-materials/issues/new/choose"
      target="_blank" rel="noopener" data-report-problem>Report a problem</a>
   ```

3. Tell the form where the student is:

   ```js
   (window.MindfieldReport = window.MindfieldReport || {}).where = () => 'Chapter 2, screen 3 / 8';
   ```

`materials/shared/` has no `index.html`, so it does not appear in the catalog.
