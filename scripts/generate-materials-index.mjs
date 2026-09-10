import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const materialsDirectory = path.join(root, 'materials');
const outputFile = path.join(root, 'public', 'materials.json');

const humanize = (value) =>
  value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const decode = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const matchContent = (html, pattern) => decode(html.match(pattern)?.[1]);

await fs.mkdir(materialsDirectory, { recursive: true });
await fs.mkdir(path.dirname(outputFile), { recursive: true });

const entries = await fs.readdir(materialsDirectory, { withFileTypes: true });
const materials = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

  const folder = path.join(materialsDirectory, entry.name);
  const indexFile = path.join(folder, 'index.html');

  try {
    const html = await fs.readFile(indexFile, 'utf8');
    let metadata = {};

    try {
      metadata = JSON.parse(await fs.readFile(path.join(folder, 'material.json'), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const title = metadata.title || matchContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || humanize(entry.name);
    const description = metadata.description || matchContent(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    ) || 'Open this psychology resource.';

    materials.push({
      slug: entry.name,
      title,
      description,
      category: metadata.category || 'Psychology resource',
      order: Number.isFinite(metadata.order) ? metadata.order : 999,
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

materials.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
await fs.writeFile(outputFile, `${JSON.stringify(materials, null, 2)}\n`);
console.log(`Catalogued ${materials.length} material${materials.length === 1 ? '' : 's'}.`);
