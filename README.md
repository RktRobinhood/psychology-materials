# Mindfield — Psychology Materials

A polished GitHub Pages library for publishing standalone psychology resources.

## Publish a material

1. Open the [`materials`](materials) folder.
2. Create a new subfolder with a short URL-friendly name, such as `cognitive-biases`.
3. Put the material's `index.html` and any supporting files inside that subfolder.
4. Commit the change to `main`.

The deployment workflow finds every `materials/*/index.html`, reads its title and meta description, adds it to the homepage, and publishes the complete site automatically.

See [`materials/README.md`](materials/README.md) for the optional metadata format.

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
