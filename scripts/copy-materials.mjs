import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'materials');
const destination = path.join(root, 'dist', 'materials');

await fs.mkdir(path.join(root, 'dist'), { recursive: true });
await fs.cp(source, destination, {
  recursive: true,
  // section.json is only read by the catalogue; it is not part of any lesson.
  filter: (file) => path.basename(file) !== 'section.json',
});
await fs.writeFile(path.join(root, 'dist', '.nojekyll'), '');
console.log('Copied materials into the published site.');

// Redirect pages at old lesson addresses, so bookmarks, shared links and
// Redemption Arc QR codes (which carry their data in the #hash) still work.
const redirects = JSON.parse(await fs.readFile(path.join(root, 'scripts', 'legacy-redirects.json'), 'utf8'));
const encode = (folder) => folder.split('/').map(encodeURIComponent).join('/');
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let written = 0;

for (const [oldFolder, newFolder] of Object.entries(redirects)) {
  if (oldFolder.startsWith('_')) continue;
  try {
    await fs.access(path.join(source, newFolder, 'index.html'));
  } catch {
    throw new Error(`legacy-redirects.json: "${newFolder}" has no index.html`);
  }
  const target = path.join(destination, oldFolder, 'index.html');
  try {
    await fs.access(target);
    continue; // A real lesson lives at the old address again: leave it alone.
  } catch {}

  const depth = oldFolder.split('/').length;
  const href = `${'../'.repeat(depth)}${encode(newFolder)}/`;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(
    target,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>This lesson has moved</title>
<link rel="canonical" href="${escape(href)}">
<script>location.replace(${JSON.stringify(href)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${escape(href)}"></noscript>
<style>body{font:17px/1.5 system-ui,sans-serif;margin:3rem auto;max-width:34rem;padding:0 1rem;color:#0b2633}</style>
</head>
<body>
<p>This lesson has moved to <a href="${escape(href)}">${escape(newFolder.split('/').pop())}</a>.</p>
</body>
</html>
`,
  );
  written += 1;
}
console.log(`Wrote ${written} redirect${written === 1 ? '' : 's'} from old lesson addresses.`);
