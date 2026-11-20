# Mindfield — Psychology Materials

A GitHub Pages library of interactive IB Psychology lessons, sorted into the six units of our two-year course plus a course tools section.

## Publish a material

1. Open the [`materials`](materials) folder and pick the unit the lesson belongs to (or `Course Tools` for anything course-wide).
2. Add a subfolder for the lesson with its `index.html` and supporting files.
3. Commit the change to `main`.

The deployment workflow reads every `materials/<Unit>/<Lesson>/index.html` (plus the optional `material.json`) and the unit's `section.json`, builds the homepage grouped by unit, and publishes the site.

See [`materials/README.md`](materials/README.md) for the folder layout, metadata and how to move a lesson without breaking links.

## Local preview

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## How lessons are made

Every lesson goes through the same five stages (Spark, Examiner, Designer, Playtester, Release). See [`AGENTS.md`](AGENTS.md) for the workflow and [`docs/lessons.md`](docs/lessons.md) for where each lesson stands.
