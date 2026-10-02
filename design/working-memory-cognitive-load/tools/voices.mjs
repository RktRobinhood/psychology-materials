// Pre-render every voiced line of Memory Quest with Gemini TTS.
// Adapted from design/unit-1-review/tools/voices.mjs (the Odyssey review).
//
// Key: put your Gemini API key in C:\Users\<you>\.gemini_api_key (one line), or set
// GEMINI_API_KEY. The key is only used here; it never goes into the website.
//
//   node voices.mjs                  render missing lines in batches (resumable; free-tier friendly)
//   node voices.mjs --list           cast and progress per speaker (no quota)
//   node voices.mjs --single         one request per line (paid tier, or to redo a few lines)
//   node voices.mjs --only lyra,orin limit to some speakers; --match "text" limits to matching lines
//   node voices.mjs --model <m>      put every selected line on one model
//   node voices.mjs --force          re-render lines that already have a file
//   node voices.mjs --keys flags.txt only the recordings whose names appear in that file
//   node voices.mjs --resplit        re-split failed batches kept in ../voice-raw (no quota)
//   node voices.mjs --prune          delete recordings whose line no longer exists
//   node voices.mjs --manifest       just rebuild data/voice-manifest.js from files on disk
//
// Output: assets/voice/<speaker>_<hash>.mp3 (mono MP3, 48 kbps) and data/voice-manifest.js.
// The hash is FNV-1a of "speaker|text" (MQVoice.key in the lesson's js/voice.js). The subtitle
// text names the file; spoken() below only changes what the TTS reads aloud.
// Free tier: about 10 requests a day per model, resetting at 09:00 Danish time.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { voicedLines, LESSON } from './lines.mjs';

const require = createRequire(import.meta.url);
// lamejs's CommonJS entry is broken under Node; its bundled build works in a VM context.
const lameCtx = { console };
lameCtx.window = lameCtx;
vm.createContext(lameCtx);
vm.runInContext(fs.readFileSync(require.resolve('lamejs/lame.all.js'), 'utf8'), lameCtx);
const lamejs = lameCtx.lamejs;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(LESSON, 'assets', 'voice');
const MANIFEST = path.join(LESSON, 'data', 'voice-manifest.js');
const RAW = path.join(HERE, '..', 'voice-raw');
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const LIMIT = +(opt('--limit') || Infinity);
const DELAY = +(opt('--delay') || 20500); // free tier: 3 requests a minute per model

/* The cast, matched to the portraits in assets/portraits. One Gemini voice and one model each. */
export const CAST = {
  selene: { voice: 'Gacrux', model: 'gemini-3.8-flash-tts',
    style: 'Selene, a wise old owl who keeps a magical library: a mature, warm, low British voice, unhurried and precise, gently amused, a storyteller and teacher speaking to one capable student' },
  lyra: { voice: 'Laomedeia', model: 'gemini-3.8-flash-lite-tts',
    style: 'Lyra, a bold teenage adventurer in a red cape: bright, quick and upbeat, a little overconfident, honest and expressive when surprised or worried' },
  orin: { voice: 'Iapetus', model: 'gemini-3.8-flash-lite-tts',
    style: 'Orin, a bookish young scholar with glasses who loves words: articulate and precise, dry deadpan wit, slightly fussy and theatrical when frustrated' },
  nova: { voice: 'Zephyr', model: 'gemini-3.8-flash-lite-tts',
    style: 'Nova, a young fox scout and pathfinder with goggles: bright, energetic, direct and practical, a little cheeky, always ready to move' },
  cael: { voice: 'Orus', model: 'gemini-3.8-flash-lite-tts',
    style: 'Cael, a grey wolf strategist and veteran: a low, gruff, clipped voice, calm authority, few words, dry and decisive' }
};

/* Pronunciation fixes: what the TTS reads, without changing the subtitle or the file name. */
export function spoken(t) {
  return t
    .replace(/\s·\s/g, ', ')
    .replace(/p ≤ 0\.01/g, 'p less than or equal to point zero one')
    .replace(/SD = /g, 'standard deviation ')
    .replace(/(\d) × (\d)/g, '$1 by $2')
    .replace(/(\d+)–(\d+)/g, '$1 to $2')
    .replace(/(\d) s\b/g, '$1 seconds')
    .replace(/\bvs\b\.?/g, 'versus')
    .replace(/\be\.g\./g, 'for example')
    .replace(/\bWMM\b/g, 'working memory model')
    .replace(/\bIVs\b/g, 'independent variables')
    .replace(/\bfNIRS\b/g, 'F-NIRS')
    .replace(/−/g, 'minus ');
}
// Extra acting notes for single-line renders (keyed by subtitle text).
const DIRECT = { 'When the bells ring at sunset, take it to the north tower. Tell no one.': 'a hushed, urgent whisper, passing on a secret message' };

export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}
const keyOf = (who, text) => who + '_' + hash(who + '|' + text);
const fileOf = l => path.join(OUT, keyOf(l.who, l.text) + '.mp3');

function apiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const f = path.join(os.homedir(), '.gemini_api_key');
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8').trim().split(/\s+/)[0];
  return null;
}

function writeManifest() {
  fs.mkdirSync(OUT, { recursive: true });
  const have = fs.readdirSync(OUT).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
  const body = '/* Pre-rendered voice lines, written by design/working-memory-cognitive-load/tools/voices.mjs. */\nwindow.MQ_VOICES = {' +
    have.map(k => JSON.stringify(k) + ':1').join(',') + '};\n';
  fs.writeFileSync(MANIFEST, body);
  return have.length;
}

/* Parse the RIFF WAV Gemini returns (24 kHz, mono, 16-bit). */
function pcmFromWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF') return { rate: 24000, pcm: new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 2)) };
  let off = 12, rate = 24000, data = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4), size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') rate = buf.readUInt32LE(off + 12);
    if (id === 'data') { data = buf.subarray(off + 8, off + 8 + Math.min(size, buf.length - off - 8)); break; }
    off += 8 + size + (size % 2);
  }
  const copy = Buffer.from(data);
  return { rate, pcm: new Int16Array(copy.buffer, copy.byteOffset, Math.floor(copy.length / 2)) };
}
function trim(pcm, rate) {
  const thr = 350, pad = Math.round(rate * 0.12);
  let a = 0, b = pcm.length - 1;
  while (a < b && Math.abs(pcm[a]) < thr) a++;
  while (b > a && Math.abs(pcm[b]) < thr) b--;
  return pcm.subarray(Math.max(0, a - pad), Math.min(pcm.length, b + pad));
}
function toMp3(pcm, rate) {
  const enc = new lamejs.Mp3Encoder(1, rate, 48);
  const chunks = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const out = enc.encodeBuffer(pcm.subarray(i, i + 1152));
    if (out.length) chunks.push(Buffer.from(out));
  }
  const end = enc.flush();
  if (end.length) chunks.push(Buffer.from(end));
  return Buffer.concat(chunks);
}
const save = (l, pcm, rate) => fs.writeFileSync(fileOf(l), toMp3(trim(pcm, rate), rate));

async function tts(key, model, voice, text, style) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      model,
      input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style }] }] }],
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice }] }
    })
  });
  const body = await res.text();
  if (!res.ok) { const e = new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`); e.status = res.status; throw e; }
  const j = JSON.parse(body);
  const data = (j.output_audio && j.output_audio.data) ||
    (j.outputs || j.output || []).flatMap(o => [o].concat(o.content || [])).map(o => o && (o.data || (o.audio && o.audio.data))).find(Boolean) ||
    findAudio(j);
  if (!data) throw new Error('No audio in response: ' + body.slice(0, 300));
  return Buffer.from(data, 'base64');
}
function findAudio(o) {
  if (!o || typeof o !== 'object') return null;
  if (typeof o.data === 'string' && o.data.length > 1000) return o.data;
  for (const v of Object.values(o)) { const r = findAudio(v); if (r) return r; }
  return null;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isDaily = e => e.status === 429 && /per.?day|PerDay|daily|RPD/i.test(e.message);

/* ---------- batch mode (free tier) ----------
 * Many lines from one speaker go into a single request, separated by long pauses.
 * The returned audio is split at the silences, one piece per line. A batch whose pieces
 * do not fit the expected lengths is saved to voice-raw and retried as two halves. */
function frames(pcm, rate) {
  const n = Math.round(rate * 0.02), out = [];
  for (let i = 0; i + n <= pcm.length; i += n) {
    let s = 0;
    for (let j = i; j < i + n; j++) s += pcm[j] * pcm[j];
    out.push(Math.sqrt(s / n));
  }
  return { rms: out, frame: n };
}
function splitBatch(pcm, rate, texts) {
  const { rms, frame } = frames(pcm, rate);
  const loud = rms.map(v => v > 450);
  const first = loud.indexOf(true), last = loud.lastIndexOf(true);
  if (first < 0) return null;
  const n = texts.length, need = n - 1;
  const fsec = frame / rate;
  // Candidate cut points: silent runs of at least 0.25 s between the first and last loud frame.
  const gaps = [];
  for (let i = first; i < last;) {
    if (loud[i]) { i++; continue; }
    let j = i;
    while (j < last && !loud[j]) j++;
    if (j - i >= 12) gaps.push({ start: i, end: j, len: j - i });
    i = j;
  }
  if (gaps.length < need) return null;
  // Speaking rate estimated from the whole take, minus the n-1 longest gaps.
  const chars = texts.map(t => t.length), totalChars = chars.reduce((a, b) => a + b, 0);
  const longest = gaps.map(g => g.len).sort((a, b) => b - a).slice(0, need).reduce((a, b) => a + b, 0);
  const rate0 = (last + 1 - first - longest) * fsec / totalChars;
  // Choose the n-1 gaps whose pieces best fit each line's expected length, preferring long gaps.
  const G = gaps.length, INF = 1e18;
  const pts = [{ end: first }].concat(gaps).concat([{ start: last + 1 }]);
  const cost = (a, b, k) => { const s = (pts[b].start - pts[a].end) * fsec; if (s <= 0) return INF; const r = Math.log(s / Math.max(0.3, chars[k] * rate0)); return r * r * 4; };
  const bonus = g => -Math.log(pts[g].len / 12);
  const dp = Array.from({ length: n }, () => new Float64Array(G + 2).fill(INF));
  const back = Array.from({ length: n }, () => new Int32Array(G + 2).fill(-1));
  for (let g = 1; g <= G; g++) dp[0][g] = cost(0, g, 0) + bonus(g);
  if (n === 1) { dp[0][G + 1] = cost(0, G + 1, 0); }
  for (let k = 1; k < n; k++) {
    const lastLine = k === n - 1;
    for (let g = k + 1; g <= G + 1; g++) {
      if (lastLine !== (g === G + 1)) continue;
      for (let p = k; p < g; p++) {
        if (dp[k - 1][p] >= INF) continue;
        const c = dp[k - 1][p] + cost(p, g, k) + (lastLine ? 0 : bonus(g));
        if (c < dp[k][g]) { dp[k][g] = c; back[k][g] = p; }
      }
    }
  }
  if (dp[n - 1][G + 1] >= INF) return null;
  const chosen = [];
  for (let k = n - 1, g = G + 1; k > 0; k--) { g = back[k][g]; chosen.unshift(g); }
  // The shortest chosen gap must be clearly longer than ordinary speech pauses.
  if (need && Math.min(...chosen.map(g => pts[g].len)) < 20) return null; // < 0.4 s
  const bounds = [first].concat(chosen.map(g => Math.round((pts[g].start + pts[g].end) / 2))).concat([last + 1]);
  const pieces = [], secs = [];
  for (let k = 0; k < n; k++) {
    pieces.push(pcm.subarray(bounds[k] * frame, bounds[k + 1] * frame));
    let a = bounds[k], b = bounds[k + 1] - 1;
    while (a < b && !loud[a]) a++;
    while (b > a && !loud[b]) b--;
    secs.push((b - a + 1) * fsec);
  }
  // Sanity check: each piece's length should roughly follow its text length.
  const r1 = secs.reduce((a, b) => a + b, 0) / totalChars;
  for (let k = 0; k < n; k++) {
    const expect = chars[k] * r1;
    if (secs[k] < expect * 0.4 - 0.5 || secs[k] > expect * 2.4 + 1.0) return null;
  }
  return pieces;
}

function saveRaw(wav, lines) {
  fs.mkdirSync(RAW, { recursive: true });
  const id = lines[0].who + '_' + hash(lines.map(l => l.text).join('|'));
  fs.writeFileSync(path.join(RAW, id + '.wav'), wav);
  fs.writeFileSync(path.join(RAW, id + '.json'), JSON.stringify(lines.map(l => ({ who: l.who, text: l.text }))));
}
/* --resplit: retry the splitter on failed batches saved in voice-raw (costs no quota). */
function resplit() {
  if (!fs.existsSync(RAW)) return console.log('Nothing in voice-raw.');
  let n = 0;
  fs.readdirSync(RAW).filter(f => f.endsWith('.json')).forEach(f => {
    const lines = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
    const { rate, pcm } = pcmFromWav(fs.readFileSync(path.join(RAW, f.replace('.json', '.wav'))));
    const pieces = splitBatch(pcm, rate, lines.map(l => spoken(l.text)));
    if (!pieces) return console.log('still unsplittable:', f);
    pieces.forEach((p, k) => save(lines[k], p, rate));
    n += pieces.length;
    fs.unlinkSync(path.join(RAW, f)); fs.unlinkSync(path.join(RAW, f.replace('.json', '.wav')));
  });
  console.log('Recovered ' + n + ' lines. Manifest lists ' + writeManifest() + ' files.');
}

const modelOf = who => opt('--model') || CAST[who].model;

async function batchMain(key, lines) {
  fs.mkdirSync(OUT, { recursive: true });
  const todo = lines.filter(l => flag('--force') || !fs.existsSync(fileOf(l)));
  console.log(`BATCH MODE. ${lines.length} voiced lines, ${lines.length - todo.length} rendered, ${todo.length} to go.`);
  const bySpeaker = {};
  todo.forEach(l => { (bySpeaker[l.who] = bySpeaker[l.who] || []).push(l); });
  // Up to 26 lines or about 3000 characters per request, whichever comes first.
  const size = +(opt('--batch') || 26), maxChars = +(opt('--chars') || 3000);
  const jobs = [];
  Object.keys(bySpeaker).forEach(who => {
    let cur = [], chars = 0;
    for (const l of bySpeaker[who]) {
      if (cur.length && (cur.length >= size || chars + l.text.length > maxChars)) { jobs.push({ who, lines: cur }); cur = []; chars = 0; }
      cur.push(l); chars += l.text.length;
    }
    if (cur.length) jobs.push({ who, lines: cur });
  });
  // One model per speaker keeps each voice consistent.
  const queues = [...new Set(jobs.map(j => modelOf(j.who)))].map(model => ({ model, jobs: jobs.filter(j => modelOf(j.who) === model) }));
  let saved = 0;
  async function worker(q) {
    const stack = q.jobs;
    let job;
    while ((job = stack.shift())) {
      const c = CAST[job.who];
      // No written separator: the flash model read "<long pause>" aloud. Paragraph breaks plus
      // the instruction give the silent gaps the splitter cuts at.
      const text = job.lines.map(l => spoken(l.text)).join('\n\n');
      let wav;
      try {
        wav = await tts(key, q.model, c.voice, text, c.style + `. The text has ${job.lines.length} separate paragraphs. Read each paragraph as its own line and leave two full seconds of complete silence after each one. Read only the words written; never say the word pause.`);
      } catch (e) {
        if (isDaily(e)) { console.log(`DAILY QUOTA reached on ${q.model}. ${stack.length + 1} batches left for this model; run again after the reset (09:00 Danish time).`); return; }
        if (e.status === 429) { const m = e.message.match(/retry in (\d+)/i); await sleep(((m ? +m[1] : 30) + 2) * 1000); stack.unshift(job); continue; }
        console.log(`FAILED batch ${job.who} x${job.lines.length}: ${String(e.message).slice(0, 160)}`);
        // Network hiccups: put the batch back once rather than dropping it for the day.
        if (!job.retried) { job.retried = true; stack.push(job); }
        await sleep(15000);
        continue;
      }
      const { rate, pcm } = pcmFromWav(wav);
      const pieces = splitBatch(pcm, rate, job.lines.map(l => spoken(l.text)));
      if (!pieces) {
        saveRaw(wav, job.lines);
        console.log(`${new Date().toLocaleTimeString()} split failed for ${job.who} x${job.lines.length}; retrying as two smaller batches.`);
        if (job.lines.length > 1) {
          const half = Math.ceil(job.lines.length / 2);
          stack.unshift({ who: job.who, lines: job.lines.slice(half) });
          stack.unshift({ who: job.who, lines: job.lines.slice(0, half) });
        }
        await sleep(DELAY);
        continue;
      }
      pieces.forEach((p, k) => save(job.lines[k], p, rate));
      saved += pieces.length;
      writeManifest();
      console.log(`${new Date().toLocaleTimeString()} ${q.model} ${job.who}: saved ${pieces.length} lines (total ${saved})`);
      await sleep(DELAY);
    }
  }
  await Promise.all(queues.map(worker));
  console.log(`FINISHED: saved ${saved} lines this run. Manifest lists ${writeManifest()} files.`);
}

async function singleMain(key, lines) {
  fs.mkdirSync(OUT, { recursive: true });
  const todo = lines.filter(l => flag('--force') || !fs.existsSync(fileOf(l)));
  console.log(`${lines.length} voiced lines selected, ${todo.length} to render one by one.`);
  const queues = [...new Set(todo.map(l => modelOf(l.who)))].map(model => ({ model, items: todo.filter(l => modelOf(l.who) === model) }));
  let done = 0;
  async function worker(q) {
    for (const l of q.items) {
      if (done >= LIMIT) return;
      const c = CAST[l.who];
      const style = c.style + (DIRECT[l.text] ? '; in this line: ' + DIRECT[l.text] : '');
      for (let tries = 0; tries < 3; tries++) {
        try {
          const { rate, pcm } = pcmFromWav(await tts(key, q.model, c.voice, spoken(l.text), style));
          save(l, pcm, rate);
          done++;
          console.log(`${new Date().toLocaleTimeString()} ${done}/${todo.length} ${q.model} ${l.who}: ${l.text.slice(0, 60)}`);
          writeManifest();
          break;
        } catch (e) {
          if (isDaily(e)) { console.log(`DAILY QUOTA reached on ${q.model}; this worker stops.`); return; }
          const m = e.status === 429 && e.message.match(/retry in (\d+)/i);
          console.log(`${new Date().toLocaleTimeString()} FAILED ${l.who}: ${String(e.message).slice(0, 160)}`);
          await sleep(((m ? +m[1] : 10) + 2) * 1000);
        }
      }
      await sleep(DELAY);
    }
  }
  await Promise.all(queues.map(worker));
  console.log(`FINISHED: rendered ${done} lines. Manifest lists ${writeManifest()} files.`);
}

async function main() {
  if (flag('--resplit')) return resplit();
  if (flag('--manifest')) return console.log('Manifest lines:', writeManifest());
  let lines = voicedLines().lines;
  if (flag('--list')) {
    let have = 0;
    Object.keys(CAST).forEach(who => {
      const mine = lines.filter(l => l.who === who), got = mine.filter(l => fs.existsSync(fileOf(l))).length;
      have += got;
      console.log(`${who.padEnd(7)} ${CAST[who].voice.padEnd(10)} ${String(got).padStart(3)}/${mine.length}`);
    });
    return console.log(`total   ${have}/${lines.length}`);
  }
  if (flag('--prune')) {
    const keep = new Set(lines.map(l => path.basename(fileOf(l))));
    let n = 0;
    if (fs.existsSync(OUT)) fs.readdirSync(OUT).filter(f => f.endsWith('.mp3') && !keep.has(f)).forEach(f => { fs.unlinkSync(path.join(OUT, f)); n++; });
    return console.log('Removed ' + n + ' orphaned recordings. Manifest lists ' + writeManifest() + ' files.');
  }
  const key = apiKey();
  if (!key) { console.error('No API key. Save it in ' + path.join(os.homedir(), '.gemini_api_key') + ' or set GEMINI_API_KEY.'); process.exit(1); }
  if (opt('--only')) lines = lines.filter(l => opt('--only').split(',').includes(l.who));
  if (opt('--match')) lines = lines.filter(l => l.text.includes(opt('--match')));
  // --keys file.txt: only the recordings named in a file (e.g. FLAG lines from pausecheck.mjs).
  if (opt('--keys')) { const ks = fs.readFileSync(opt('--keys'), 'utf8'); lines = lines.filter(l => ks.includes(path.basename(fileOf(l), '.mp3'))); }
  return flag('--single') ? singleMain(key, lines) : batchMain(key, lines);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e); writeManifest(); process.exit(1); });
