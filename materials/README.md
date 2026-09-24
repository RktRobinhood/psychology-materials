# Adding a psychology material

Create a subfolder here and place an `index.html` inside it:

```text
materials/
  cognitive-biases/
    index.html
```

The homepage title and description are read automatically from the page:

```html
<title>Cognitive Biases</title>
<meta name="description" content="A practical introduction to common cognitive biases.">
```

For more control, add an optional `material.json` beside `index.html`:

```json
{
  "title": "Cognitive Biases",
  "description": "A practical introduction to common cognitive biases.",
  "category": "Cognition",
  "order": 10
}
```

Commit the folder to the `main` branch. GitHub Actions will rebuild the catalog and publish it automatically.

## Report a problem

Every lesson has a **Report a problem** entry in its menu or top bar. It opens a small dialog that sends students to one of the GitHub issue forms in `.github/ISSUE_TEMPLATE/` ("Something broke" or "Something is wrong or confusing"), with the lesson name, the place in the lesson and the device already filled in. Students without a GitHub account can copy the same details and send them to their teacher.

To add it to a lesson:

1. Load the shared script after the lesson's own scripts, with the lesson's short name:

   ```html
   <script defer src="../shared/report-problem.js" data-lesson="Memory Quest"></script>
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
