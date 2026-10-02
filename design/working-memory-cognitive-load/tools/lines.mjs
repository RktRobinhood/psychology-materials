// Load Memory Quest's lesson files in a sandbox and list every line that needs a voice.
// The text rules live in the lesson's own js/voice.js, so the file names always match.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const LESSON = path.resolve(HERE, '..', '..', '..', 'materials', 'Working Memory and Cognitive Load');

export function loadLesson() {
  const ctx = { console, MQHelpers: {} };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of ['data/lesson-data.js', 'js/studies.js', 'js/voice.js'])
    vm.runInContext(fs.readFileSync(path.join(LESSON, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

export function voicedLines() {
  const w = loadLesson();
  return { lines: w.MQVoice.allLines(w.MEMORY_QUEST, w.Studies.STUDIES, w.Studies.PARTS), key: w.MQVoice.key };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { lines } = voicedLines();
  const by = {};
  lines.forEach(l => { by[l.who] = by[l.who] || { n: 0, chars: 0 }; by[l.who].n++; by[l.who].chars += l.text.length; });
  console.log(lines.length, 'lines', by);
  if (process.argv[2] === '--print') lines.forEach(l => console.log(l.who.padEnd(7), l.text));
}
