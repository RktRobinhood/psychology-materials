// Builds public/materials.json: the homepage catalog, grouped by unit folder.
//
// Anything dropped into materials/ is picked up automatically:
//   materials/<Group>/<Lesson>/index.html   a lesson folder
//   materials/<Group>/<name>.html           a single-file lesson
//   materials/<Lesson>/index.html           a lesson outside any group (listed under "Other")
// Groups are described in materials/units.json. A folder that is not listed there
// still appears, as its own group, named after the folder.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const materialsDirectory = path.join(root, 'materials');
const outputFile = path.join(root, 'public', 'materials.json');
const SKIP = new Set(['shared']);

const humanize = (value) =>
  value
    .replace(/\.html?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const decode = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const matchContent = (html, pattern) => decode(html.match(pattern)?.[1]);

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw new Error(`${path.relative(root, file)}: ${error.message}`);
    return fallback;
  }
};

const listDirectory = async (directory) =>
  (await fs.readdir(directory, { withFileTypes: true })).filter((entry) => !entry.name.startsWith('.'));

const exists = (file) => fs.access(file).then(() => true, () => false);

const urlPath = (...segments) => segments.map(encodeURIComponent).join('/');

async function describe(htmlFile, metadata, fallbackName, href) {
  const html = await fs.readFile(htmlFile, 'utf8');
  return {
    href,
    title: metadata.title || matchContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || humanize(fallbackName),
    description:
      metadata.description ||
      matchContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i),
    tag: metadata.category || '',
    order: Number.isFinite(metadata.order) ? metadata.order : 999,
  };
}

async function collectItems(folderName) {
  const folder = path.join(materialsDirectory, folderName);
  const items = [];
  for (const entry of await listDirectory(folder)) {
    if (entry.isDirectory()) {
      const lessonFolder = path.join(folder, entry.name);
      const indexFile = path.join(lessonFolder, 'index.html');
      if (!(await exists(indexFile))) continue;
      const metadata = await readJson(path.join(lessonFolder, 'material.json'), {});
      items.push(await describe(indexFile, metadata, entry.name, `materials/${urlPath(folderName, entry.name)}/`));
    } else if (/\.html?$/i.test(entry.name)) {
      items.push(
        await describe(path.join(folder, entry.name), {}, entry.name, `materials/${urlPath(folderName, entry.name)}`),
      );
    }
  }
  return items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

await fs.mkdir(path.dirname(outputFile), { recursive: true });

const configured = await readJson(path.join(materialsDirectory, 'units.json'), []);
const folders = (await listDirectory(materialsDirectory))
  .filter((entry) => entry.isDirectory() && !SKIP.has(entry.name))
  .map((entry) => entry.name);

const groups = [];
const loose = [];
const seen = new Set();

for (const unit of configured) {
  seen.add(unit.folder);
  const items = folders.includes(unit.folder) ? await collectItems(unit.folder) : [];
  groups.push({ ...unit, items });
}

for (const name of folders.filter((folder) => !seen.has(folder)).sort()) {
  const indexFile = path.join(materialsDirectory, name, 'index.html');
  if (await exists(indexFile)) {
    const metadata = await readJson(path.join(materialsDirectory, name, 'material.json'), {});
    loose.push(await describe(indexFile, metadata, name, `materials/${urlPath(name)}/`));
  } else {
    const items = await collectItems(name);
    if (items.length) groups.push({ folder: name, kind: 'extra', title: humanize(name), items });
  }
}

if (loose.length) groups.push({ folder: '', kind: 'extra', title: 'Other', items: loose });

await fs.writeFile(outputFile, `${JSON.stringify(groups, null, 2)}\n`);
const count = groups.reduce((total, group) => total + group.items.length, 0);
console.log(`Catalogued ${count} page${count === 1 ? '' : 's'} in ${groups.length} groups.`);
