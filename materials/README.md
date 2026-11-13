# The materials folder

Everything in here is published. The homepage is built from these folders, so adding a lesson needs no other edit.

```text
materials/
  Course Guide/              the two-year plan and the syllabus checklist
  Unit 1 Foundations/
  Unit 2 Learning and Bias/
  Unit 3 Memory and Brain/
  Unit 4 Relationships/
  Unit 5 Health/
  Unit 6 Development/
  Exam Practice/             paper practice that runs across units
  shared/                    code used by several lessons (not listed on the site)
```

## Add a lesson

Put it in the unit it is taught in, either way:

```text
materials/Unit 4 Relationships/Conformity/index.html     a folder (use this when there are other files)
materials/Unit 4 Relationships/conformity-quiz.html      a single file
```

It appears on the homepage under that unit after the next commit to `main`. A new top-level folder that is not a unit (say `Projects/`) also appears, as its own section.

The card's title and description come from the page:

```html
<title>Conformity</title>
<meta name="description" content="Why we go along with the group, and when we do not.">
```

For a lesson folder, an optional `material.json` beside `index.html` overrides them and sets the order within the unit (low numbers first) and the small label above the title:

```json
{
  "title": "Conformity",
  "description": "Why we go along with the group, and when we do not.",
  "category": "Lesson",
  "order": 10
}
```

## Change the units

Unit names, numbers and guiding questions are in [`units.json`](units.json). `folder` must match the folder name exactly.

## Move or rename a lesson

Move the folder, then add a line to [`redirects.json`](redirects.json) (`"old path": "new path"`, both relative to `materials/`) so links students already have keep working.

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

`materials/shared/` is skipped by the catalog.
