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
