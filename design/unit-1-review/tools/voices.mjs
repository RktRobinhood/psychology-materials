// Pre-render every voiced line of the Odyssey review game with Gemini TTS.
//
// Key: put your Gemini API key in C:\Users\<you>\.gemini_api_key (one line), or set
// GEMINI_API_KEY. The key is only used here; it never goes into the website.
//
//   node tools/voices.mjs                 render missing lines in batches (resumable; free-tier friendly)
//   node tools/voices.mjs --single        one request per line (paid tier)
//   node tools/voices.mjs --only narrator render one speaker
//   node tools/voices.mjs --audition      one sample per cast member into ../voice-auditions
//   node tools/voices.mjs --limit 50      stop after 50 new lines (free-tier friendly)
//   node tools/voices.mjs --resplit       re-split failed batches kept in ../voice-raw (no quota)
//   node tools/voices.mjs --manifest      just rebuild data/voice-manifest.js from files on disk
//
// Output: assets/voice/<speaker>_<hash>.mp3 (mono MP3, 48 kbps) and data/voice-manifest.js.
// The hash is FNV-1a of "speaker|text" and must match U.hash in js/util.js.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadData, voicedLines, LESSON } from './audit.mjs';

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
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const MODELS = (opt('--model') ? [opt('--model')] : ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts']);
const LIMIT = +(opt('--limit') || Infinity);
const DELAY = +(opt('--delay') || 20500); // free tier: 3 requests a minute per model

export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}
const keyOf = (who, text) => who + '_' + hash(who + '|' + text);

function apiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const f = path.join(os.homedir(), '.gemini_api_key');
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8').trim().split(/\s+/)[0];
  return null;
}

function writeManifest() {
  fs.mkdirSync(OUT, { recursive: true });
  const have = fs.readdirSync(OUT).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
  const body = '/* Pre-rendered voice lines, written by design/unit-1-review/tools/voices.mjs. */\nwindow.ODY = window.ODY || {};\nODY.voices = {' +
    have.map(k => JSON.stringify(k) + ':1').join(',') + '};\n';
  fs.writeFileSync(MANIFEST, body);
  return have.length;
}

/* Parse the RIFF WAV Gemini returns (24 kHz, mono, 16-bit) and trim silence at the ends. */
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

const MOODS = { angry: 'angry', shout: 'shouting, urgent', roar: 'roaring with fury', howl: 'howling in pain', worried: 'worried', wary: 'wary', tired: 'weary', smug: 'smug', alarm: 'alarmed', sad: 'sad, quiet', warm: 'warm', awe: 'awed, eager', sing: 'singing softly, hypnotic', fairsing: 'singing softly, hypnotic', stern: 'stern', smile: 'amused', cold: 'cold, menacing', hiss: 'hissing' };

async function tts(key, model, voice, text, style) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(90000),
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


/* ---------- batch mode (free tier: 10 requests a day per model) ----------
 * Many lines from one speaker go into a single request, separated by long pauses.
 * The returned audio is split at the longest silences, one piece per line. A batch
 * whose pieces do not fit the expected lengths is rejected and retried smaller. */
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
  // Choose the n-1 gaps whose pieces best fit each line's expected length, preferring long gaps
  // (dynamic programming, so a dramatic mid-line pause no longer derails the whole batch).
  const G = gaps.length, INF = 1e18;
  const pts = [{ end: first }].concat(gaps).concat([{ start: last + 1 }]); // pts[0] start, pts[G+1] end
  const cost = (a, b, k) => { const s = (pts[b].start - pts[a].end) * fsec; if (s <= 0) return INF; const r = Math.log(s / Math.max(0.3, chars[k] * rate0)); return r * r * 4; };
  const bonus = g => -Math.log(pts[g].len / 12);
  // dp[k][g]: best cost with line k ending at point g.
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

const RAW = path.join(HERE, '..', 'voice-raw');
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
    const pieces = splitBatch(pcm, rate, lines.map(l => l.text));
    if (!pieces) return console.log('still unsplittable:', f);
    pieces.forEach((p, k) => fs.writeFileSync(path.join(OUT, keyOf(lines[k].who, lines[k].text) + '.mp3'), toMp3(trim(p, rate), rate)));
    n += pieces.length;
    fs.unlinkSync(path.join(RAW, f)); fs.unlinkSync(path.join(RAW, f.replace('.json', '.wav')));
  });
  console.log('Recovered ' + n + ' lines. Manifest lists ' + writeManifest() + ' files.');
}

async function batchMain(key, ODY, lines) {
  fs.mkdirSync(OUT, { recursive: true });
  const todo = lines.filter(l => !fs.existsSync(path.join(OUT, keyOf(l.who, l.text) + '.mp3')));
  console.log(`BATCH MODE. ${lines.length} voiced lines, ${lines.length - todo.length} rendered, ${todo.length} to go.`);
  const bySpeaker = {};
  todo.forEach(l => { (bySpeaker[l.who] = bySpeaker[l.who] || []).push(l); });
  const size = +(opt('--batch') || 26);
  const jobs = [];
  Object.keys(bySpeaker).forEach(who => {
    const list = bySpeaker[who];
    for (let i = 0; i < list.length; i += size) jobs.push({ who, lines: list.slice(i, i + size) });
  });
  const queues = [
    { model: 'gemini-3.8-flash-tts', jobs: jobs.filter(j => j.who === 'narrator') },
    { model: 'gemini-3.8-flash-lite-tts', jobs: jobs.filter(j => j.who !== 'narrator') }
  ];
  let saved = 0;
  // When flash runs out of narrator work it takes whole speakers the lite queue has not started,
  // from the back of that queue, so every voice still comes from a single model.
  queues[0].steal = queues[1];
  const started = new Set(lines.filter(l => fs.existsSync(path.join(OUT, keyOf(l.who, l.text) + '.mp3'))).map(l => l.who));
  function nextJob(q) {
    if (q.jobs.length) return q.jobs.shift();
    const o = q.steal;
    if (!o) return null;
    for (let i = o.jobs.length - 1; i >= 0; i--) {
      const who = o.jobs[i].who;
      if (!started.has(who) && o.jobs.filter(j => j.who === who).length === 1) return o.jobs.splice(i, 1)[0];
    }
    return null;
  }
  async function worker(q) {
    const stack = q.jobs;
    let job;
    while ((job = nextJob(q))) {
      started.add(job.who);
      const c = ODY.cast[job.who] || ODY.cast.narrator;
      const text = job.lines.map(l => l.text).join(' <long pause> <long pause> ');
      let wav;
      try {
        wav = await tts(key, q.model, c.voice, text, c.style + '. Read each sentence group as a separate line, with a long, silent pause between them.');
      } catch (e) {
        if (e.status === 429 && /per day/i.test(e.message)) { console.log(`DAILY QUOTA reached on ${q.model}. ${stack.length + 1} batches left for this model; run again after the reset (09:00 Danish time).`); return; }
        if (e.status === 429) { const m = e.message.match(/retry in (\d+)/i); await sleep(((m ? +m[1] : 30) + 2) * 1000); stack.unshift(job); continue; }
        console.log(`FAILED batch ${job.who} x${job.lines.length}: ${String(e.message).slice(0, 160)}`);
        // Network hiccups: put the batch back once rather than dropping it for the day.
        if (!job.retried) { job.retried = true; stack.push(job); }
        await sleep(15000);
        continue;
      }
      const { rate, pcm } = pcmFromWav(wav);
      const pieces = splitBatch(pcm, rate, job.lines.map(l => l.text));
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
      pieces.forEach((p, k) => {
        fs.writeFileSync(path.join(OUT, keyOf(job.lines[k].who, job.lines[k].text) + '.mp3'), toMp3(trim(p, rate), rate));
      });
      saved += pieces.length;
      writeManifest();
      console.log(`${new Date().toLocaleTimeString()} ${q.model.includes('lite') ? 'lite ' : 'flash'} ${job.who}: saved ${pieces.length} lines (total ${saved})`);
      await sleep(DELAY);
    }
  }
  await Promise.all(queues.map(worker));
  console.log(`FINISHED: saved ${saved} lines this run. Manifest lists ${writeManifest()} files.`);
}

async function main() {
  if (flag('--resplit')) return resplit();
  if (flag('--manifest')) { console.log('Manifest lines:', writeManifest()); return; }
  if (flag('--prune')) {
    const keep = new Set(voicedLines(loadData()).map(l => keyOf(l.who, l.text) + '.mp3'));
    let n = 0;
    if (fs.existsSync(OUT)) fs.readdirSync(OUT).filter(f => f.endsWith('.mp3') && !keep.has(f)).forEach(f => { fs.unlinkSync(path.join(OUT, f)); n++; });
    console.log('Removed ' + n + ' orphaned recordings. Manifest lists ' + writeManifest() + ' files.');
    return;
  }
  const key = apiKey();
  if (!key) { console.error('No API key. Save it in ' + path.join(os.homedir(), '.gemini_api_key') + ' or set GEMINI_API_KEY.'); process.exit(1); }
  const ODY = loadData();
  let lines = voicedLines(ODY);
  if (opt('--only')) lines = lines.filter(l => l.who === opt('--only'));
  if (!flag('--single') && !flag('--audition')) return batchMain(key, ODY, lines);
  if (flag('--audition')) {
    const dir = path.join(HERE, '..', 'voice-auditions');
    fs.mkdirSync(dir, { recursive: true });
    const seen = new Set();
    lines = lines.filter(l => !seen.has(l.who) && seen.add(l.who));
    for (const l of lines) {
      const c = ODY.cast[l.who];
      const wav = await tts(key, MODELS[0], c.voice, l.text, c.style);
      const { rate, pcm } = pcmFromWav(wav);
      fs.writeFileSync(path.join(dir, l.who + '.mp3'), toMp3(trim(pcm, rate), rate));
      console.log('audition', l.who, c.voice);
      await sleep(DELAY);
    }
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const todo = lines.filter(l => !fs.existsSync(path.join(OUT, keyOf(l.who, l.text) + '.mp3')));
  console.log(`${lines.length} voiced lines, ${lines.length - todo.length} already rendered, ${todo.length} to go.`);
  // One model per speaker keeps each voice consistent. The narrator gets the flagship model.
  const queues = [
    { model: 'gemini-3.8-flash-tts', items: todo.filter(l => l.who === 'narrator') },
    { model: 'gemini-3.8-flash-lite-tts', items: todo.filter(l => l.who !== 'narrator') }
  ];
  let done = 0;
  async function worker(q) {
    let fails = 0;
    for (const l of q.items) {
      if (done >= LIMIT) return;
      const c = ODY.cast[l.who] || ODY.cast.narrator;
      const style = c.style + (l.face && MOODS[l.face] ? '; in this line: ' + MOODS[l.face] : '');
      for (;;) {
        try {
          const wav = await tts(key, q.model, c.voice, l.text, style);
          const { rate, pcm } = pcmFromWav(wav);
          fs.writeFileSync(path.join(OUT, keyOf(l.who, l.text) + '.mp3'), toMp3(trim(pcm, rate), rate));
          done++; fails = 0;
          console.log(`${new Date().toLocaleTimeString()} ${done}/${todo.length} ${q.model.includes('lite') ? 'lite ' : 'flash'} ${l.who}: ${l.text.slice(0, 60)}`);
          if (done % 10 === 0) writeManifest();
          break;
        } catch (e) {
          if (e.status === 429) {
            if (/per.?day|PerDay|daily|RPD/i.test(e.message)) { console.log(`DAILY QUOTA reached on ${q.model}; this worker stops. Run again tomorrow.`); return; }
            const m = e.message.match(/retry in (\d+)/i);
            console.log(`${new Date().toLocaleTimeString()} 429 on ${q.model}, waiting ${m ? m[1] : 30}s`);
            await sleep(((m ? +m[1] : 30) + 2) * 1000);
            continue;
          }
          console.log(`${new Date().toLocaleTimeString()} FAILED ${l.who}: ${String(e.message).slice(0, 200)}`);
          if (++fails >= 5) { console.log(`Too many failures on ${q.model}; worker stops.`); return; }
          await sleep(10000);
          break;
        }
      }
      await sleep(DELAY);
    }
  }
  await Promise.all(queues.map(worker));
  console.log(`FINISHED: rendered ${done} new lines. Manifest lists ${writeManifest()} files.`);
}
main().catch(e => { console.error(e); writeManifest(); process.exit(1); });
