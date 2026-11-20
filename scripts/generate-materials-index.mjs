// Builds public/materials.json from the folders in materials/.
//
//   materials/<Section>/section.json        a unit or the course tools section
//   materials/<Section>/<Lesson>/index.html a lesson (material.json optional)
//
// A lesson folder dropped straight into materials/ (no section) is still listed,
// under "Not yet sorted", so nothing uploaded ever disappears from the homepage.
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

const readJson = async (file) => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw new Error(`${path.relative(root, file)}: ${error.message}`);
  }
};

const subfolders = async (folder) =>
  (await fs.readdir(folder, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name);

// Returns the catalogue entry for a lesson folder, or null if it has no index.html.
async function readMaterial(relativePath) {
  const folder = path.join(materialsDirectory, relativePath);
  let html;
  try {
    html = await fs.readFile(path.join(folder, 'index.html'), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  const metadata = (await readJson(path.join(folder, 'material.json'))) ?? {};
  const title =
    metadata.title ||
    matchContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
    humanize(path.basename(relativePath));
  const description =
    metadata.description ||
    matchContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ||
    'Open this psychology resource.';

  return {
    path: relativePath.split(path.sep).join('/'),
    title,
    description,
    category: metadata.category || 'Lesson',
    covers: Array.isArray(metadata.covers) ? metadata.covers : [],
    order: Number.isFinite(metadata.order) ? metadata.order : 999,
  };
}

const byOrder = (a, b) => a.order - b.order || a.title.localeCompare(b.title);

await fs.mkdir(materialsDirectory, { recursive: true });
await fs.mkdir(path.dirname(outputFile), { recursive: true });

const sections = [];
const unsorted = [];

for (const name of await subfolders(materialsDirectory)) {
  const section = await readJson(path.join(materialsDirectory, name, 'section.json'));

  if (!section) {
    // A lesson uploaded straight into materials/ rather than into a unit.
    const material = await readMaterial(name);
    if (material) unsorted.push(material);
    continue;
  }

  const materials = [];
  for (const lesson of await subfolders(path.join(materialsDirectory, name))) {
    const material = await readMaterial(path.join(name, lesson));
    if (material) materials.push(material);
  }
  materials.sort(byOrder);

  sections.push({
    id: section.kind === 'unit' ? `unit-${section.number}` : name.toLowerCase().replace(/\W+/g, '-'),
    folder: name,
    kind: section.kind === 'unit' ? 'unit' : 'tools',
    number: section.number ?? null,
    year: section.year ?? null,
    title: section.title || humanize(name),
    short: section.short || section.title || humanize(name),
    question: section.question || '',
    context: section.context || '',
    practical: section.practical || null,
    guide: section.guide || null,
    checklist: section.checklist || null,
    order: Number.isFinite(section.order) ? section.order : 999,
    materials,
  });
}

if (unsorted.length > 0) {
  sections.push({
    id: 'unsorted',
    folder: '',
    kind: 'unsorted',
    number: null,
    year: null,
    title: 'Not yet sorted',
    short: 'New',
    question: 'Recently added materials that have not been placed in a unit yet.',
    context: '',
    practical: null,
    guide: null,
    checklist: null,
    order: 1000,
    materials: unsorted.sort(byOrder),
  });
}

sections.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
await fs.writeFile(outputFile, `${JSON.stringify({ sections }, null, 2)}\n`);

const count = sections.reduce((total, section) => total + section.materials.length, 0);
console.log(`Catalogued ${count} material${count === 1 ? '' : 's'} in ${sections.length} sections.`);
