// Strict check for one known batch fault: the TTS reading the "<long pause>" separator aloud,
// or a clip carrying words from a neighbouring line.
//   node pausecheck.mjs [speaker] [first] [count]
//   node pausecheck.mjs --keys ../redo-selene.txt   check only those; rewrite the file with the ones still bad
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { voicedLines, LESSON } from './lines.mjs';
import { spoken } from './voices.mjs';
const MODEL = process.env.LISTEN_MODEL || 'gemini-3.1-flash-lite';
const key = fs.readFileSync(path.join(os.homedir(), '.gemini_api_key'), 'utf8').trim().split(/\s+/)[0];
const { lines: allLines, key: keyOf } = voicedLines();
const who = process.argv[2] && !process.argv[2].startsWith('--') && isNaN(process.argv[2]) ? process.argv.splice(2, 1)[0] : null;
const ki = process.argv.indexOf('--keys'), keysFile = ki > 0 ? process.argv.splice(ki, 2)[1] : null;
const wanted = keysFile ? fs.readFileSync(keysFile, 'utf8').split(/\s+/).filter(Boolean) : null;
const lines = wanted ? allLines.filter(l => wanted.includes(keyOf(l.who, l.text))) : who ? allLines.filter(l => who.split(',').includes(l.who)) : allLines;
const still = [];
const from = +(process.argv[2] || 0), n = +(process.argv[3] || lines.length);
for (const l of lines.slice(from, from + n)) {
  const k = keyOf(l.who, l.text);
  const audio = fs.readFileSync(path.join(LESSON, 'assets', 'voice', k + '.mp3')).toString('base64');
  const prompt = `Transcribe this audio clip word for word, from the very first sound to the very last, including any quiet, mumbled or whispered words at the start or end.
Then answer: does the clip contain the words "long pause" or "pause", or any words that are NOT in this script: "${spoken(l.text)}"? Ignore small differences in how numbers or symbols are said.
Reply in exactly two lines:
HEARD: <transcript>
EXTRA: <none, or the extra words>`;
  let out = '';
  for (let t = 0; t < 6; t++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: 'audio/mpeg', data: audio } }, { text: prompt }] }], generationConfig: { temperature: 0 } })
    });
    const body = await res.text();
    if (res.ok) { out = (JSON.parse(body).candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim(); break; }
    await new Promise(r => setTimeout(r, res.status === 429 ? 30000 : 8000));
  }
  const extra = (out.match(/EXTRA:\s*(.*)/i) || [, '?'])[1].trim();
  const flag = /pause/i.test(out) || !/^<?none>?.?$/i.test(extra);
  if (flag) still.push(k);
  console.log(`${flag ? 'FLAG' : 'ok  '} ${k} | ${l.text.slice(0, 50)} | extra: ${extra}`);
  await new Promise(r => setTimeout(r, 4500));
}
if (keysFile) { fs.writeFileSync(keysFile, still.map(k => k + '\n').join('')); console.log(`${still.length} still to redo (written to ${keysFile}).`); }
