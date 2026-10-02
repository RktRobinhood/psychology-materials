// Have a Gemini text model listen to rendered voice lines and report what it hears, so
// wrong, missing or cut-off words are caught without a human ear. Uses a text model's
// quota, not the TTS quota. Adapted from design/unit-1-review/tools/listen.mjs.
//
//   node listen.mjs lyra orin            check every rendered line of these speakers
//   node listen.mjs all > ../listen.txt  check everything
//   LISTEN_MATCH="Static" node listen.mjs selene   only lines containing some text
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { voicedLines, LESSON } from './lines.mjs';

const MODEL = process.env.LISTEN_MODEL || 'gemini-3.1-flash-lite';
const PACE = +(process.env.LISTEN_DELAY || 4500); // stay under the free per-minute limit
const key = (process.env.GEMINI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.gemini_api_key'), 'utf8')).trim().split(/\s+/)[0];
const want = process.argv.slice(2);
const { lines, key: keyOf } = voicedLines();
const pick = lines.filter(l => (want.includes('all') || want.includes(l.who)) && (!process.env.LISTEN_MATCH || l.text.includes(process.env.LISTEN_MATCH)));
let bad = 0;

for (const l of pick) {
  const file = path.join(LESSON, 'assets', 'voice', keyOf(l.who, l.text) + '.mp3');
  if (!fs.existsSync(file)) { console.log('MISSING', l.who, l.text.slice(0, 50)); continue; }
  const prompt = `Listen to this voice line from a game. The script is: "${l.text}".
Symbols may be read out in words (for example "vs" as "versus", "p ≤ 0.01" as "p less than or equal to point zero one", "2 × 2" as "2 by 2"); that is fine.
Reply in exactly three lines:
HEARD: <verbatim transcript>
OK: <yes if every script word is spoken clearly, nothing is cut off at the start or end, and no words from another line are included; otherwise no>
SOUND: <a few words on how the voice sounds>`;
  let res;
  for (let t = 0; t < 5; t++) { // the text model is sometimes briefly overloaded (503)
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: 'audio/mpeg', data: fs.readFileSync(file).toString('base64') } }, { text: prompt }] }] })
    });
    if (res.status !== 503 && res.status !== 429) break;
    const wait = res.status === 429 ? ((await res.clone().text()).match(/retry in (\d+)/i) || [0, 30])[1] * 1000 + 2000 : 8000 * (t + 1);
    await new Promise(r => setTimeout(r, wait));
  }
  const j = await res.json();
  const out = res.ok ? (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim() : 'HTTP ' + res.status + ' ' + JSON.stringify(j).slice(0, 200);
  const ok = /OK:\s*yes/i.test(out);
  if (!ok) bad++;
  await new Promise(r => setTimeout(r, PACE));
  console.log(`--- ${ok ? 'ok ' : 'BAD'} ${keyOf(l.who, l.text)}: ${l.text.slice(0, 70)}\n${out}`);
}
console.log(`\nChecked ${pick.length}; flagged ${bad}.`);
