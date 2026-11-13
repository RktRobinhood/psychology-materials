import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'materials');
const destination = path.join(root, 'dist', 'materials');

await fs.mkdir(path.join(root, 'dist'), { recursive: true });
await fs.cp(source, destination, { recursive: true });
await fs.writeFile(path.join(root, 'dist', '.nojekyll'), '');

// Old addresses keep working: materials/redirects.json maps a retired folder to its new home.
// The query string and #fragment are carried over (Redemption Arc QR codes rely on the fragment).
let redirects = {};
try {
  redirects = JSON.parse(await fs.readFile(path.join(source, 'redirects.json'), 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

let written = 0;
for (const [from, to] of Object.entries(redirects)) {
  const folder = path.join(destination, from);
  const stub = path.join(folder, 'index.html');
  try {
    await fs.access(stub);
    continue; // a real page lives here now; never overwrite it
  } catch {
    // free to use
  }
  const target = `${'../'.repeat(from.split('/').length)}${to.split('/').map(encodeURIComponent).join('/')}/`;
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(
    stub,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>This page has moved</title>
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head><body><p>This page has moved. <a href="${target}">Open it here.</a></p></body></html>
`,
  );
  written += 1;
}

console.log(`Copied materials into the published site (${written} redirects).`);
