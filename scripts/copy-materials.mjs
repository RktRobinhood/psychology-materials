import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'materials');
const destination = path.join(root, 'dist', 'materials');

await fs.mkdir(path.join(root, 'dist'), { recursive: true });
await fs.cp(source, destination, { recursive: true });
await fs.writeFile(path.join(root, 'dist', '.nojekyll'), '');
console.log('Copied materials into the published site.');
