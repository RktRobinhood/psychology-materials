// Have a Gemini text model listen to rendered voice lines and report what it hears,
// so we can catch audio tags read aloud ("growling") or wrong words without a human ear.
// Uses a text model's quota, not the TTS quota.
//
//   node tools/listen.mjs cyclops sirens     check every rendered line of these speakers
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadData, voicedLines, LESSON } from './audit.mjs';
import { DIRECT } from './voice-fx.mjs';

const MODEL = process.env.LISTEN_MODEL || 'gemini-3.8-flash';
const key = (process.env.GEMINI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.gemini_api_key'), 'utf8')).trim().split(/\s+/)[0];
const hash = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const who = process.argv.slice(2);
const lines = voicedLines(loadData()).filter(l => who.includes(l.who) && (!process.env.LISTEN_MATCH || l.text.includes(process.env.LISTEN_MATCH)));

for (const l of lines) {
  const file = path.join(LESSON, 'assets', 'voice', l.who + '_' + hash(l.who + '|' + l.text) + '.mp3');
  if (!fs.existsSync(file)) { console.log('MISSING', l.who, l.text.slice(0, 50)); continue; }
  const prompt = `Listen to this voice line from a game. The script is: "${l.text}".
Reply in exactly three lines:
HEARD: <verbatim transcript; put non-speech sounds such as growls, laughs or grunts in (parentheses)>
OK: <yes if every script word is spoken and no stage directions (words like growling, sniffing, giggle, singing, whispering, roaring) are spoken aloud as words; otherwise no>
SOUND: <a few words on how the voice sounds>`;
  let res;
  for (let t = 0; t < 5; t++) { // the text model is sometimes briefly overloaded (503)
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: 'audio/mpeg', data: fs.readFileSync(file).toString('base64') } }, { text: prompt }] }] })
    });
    if (res.status !== 503) break;
    await new Promise(r => setTimeout(r, 8000 * (t + 1)));
  }
  const j = await res.json();
  const out = res.ok ? (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim() : 'HTTP ' + res.status + ' ' + JSON.stringify(j).slice(0, 200);
  console.log(`--- ${l.who}: ${l.text.slice(0, 60)}${(DIRECT[l.who] || {})[l.text] ? '' : '  (no direction)'}\n${out}`);
}
