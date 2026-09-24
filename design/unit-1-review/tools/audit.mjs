// Audit the Odyssey review game's data: script integrity, assets, the fourth-wall
// rule, and a count of voiced lines. Run: node tools/audit.mjs [--lines out.json]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const LESSON = path.resolve(HERE, '..', '..', '..', 'materials', 'Unit 1 Review - Learning and Cognition');

export function loadData() {
  const ctx = { console };
  ctx.window = ctx;
  vm.createContext(ctx);
  const html = fs.readFileSync(path.join(LESSON, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map(m => m[1]);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(LESSON, f), 'utf8'), ctx, { filename: f });
  return ctx.ODY;
}

const LINE = /^([a-z]+|N)(?:\.([a-z]+))?(?:~([a-z]+))?:\s*(.+)$/;
export function compile(ep) {
  const steps = [], labels = {};
  for (let s of ep.script) {
    if (typeof s !== 'string') { steps.push({ kind: 'obj', obj: s, cond: s.if || null }); continue; }
    s = s.trim();
    let cond = null;
    if (s[0] === '#') { labels[s.slice(1)] = steps.length; continue; }
    if (s[0] === '?') { const sp = s.indexOf(' '); cond = s.slice(1, sp); s = s.slice(sp + 1).trim(); }
    if (s[0] === '>') { steps.push({ kind: 'goto', to: s.slice(1).trim(), cond }); continue; }
    if (s[0] === '@') { const p = s.slice(1).split(/\s+/); steps.push({ kind: 'dir', name: p[0], args: p.slice(1), cond }); continue; }
    const m = s.match(LINE);
    if (!m) { steps.push({ kind: 'bad', raw: s }); continue; }
    steps.push({ kind: 'line', who: m[1] === 'N' ? 'narrator' : m[1], pose: m[2], face: m[3], text: m[4].split(/\s*\|\|\s*/), cond });
  }
  return { steps, labels };
}

/* Every line that should have a voice recording. */
export function voicedLines(ODY) {
  const out = [];
  const add = (who, text, face) => { if (text && typeof text === 'string') out.push({ who, text, face }); };
  for (const id of ODY.episodeOrder) {
    const ep = ODY.episodes[id];
    add('narrator', ep.next);
    for (const st of compile(ep).steps) {
      if (st.kind === 'line') st.text.forEach(t => add(st.who, t, st.face));
      if (st.kind === 'obj') {
        const o = st.obj;
        for (const k of ['choice', 'qte', 'log', 'write']) if (o[k] && o[k].say) [].concat(o[k].say).forEach(t => add('narrator', t));
        if (o.drill && o.say) add('narrator', o.say);
        if (o.notes) (o.say ? [].concat(o.say) : (ODY.topics[o.notes] || {}).voice || []).forEach(t => add('narrator', t));
      }
    }
  }
  for (const t of Object.values(ODY.topics)) (t.voice || []).forEach(x => add('narrator', x));
  for (const e of Object.values(ODY.endings)) add('narrator', e.text);
  (ODY.chestLines || []).forEach(t => add('narrator', t));
  (ODY.shopLines || [
    'Welcome to my stall. Everything here is entirely legitimate and only slightly enchanted.',
    'Ah, a customer. I would offer a loyalty card, but you have already studied what those do to people.',
    'Browse freely. Prices are fixed, unlike Poseidon.',
    'Everything must go. Mostly because I have to narrate the next island.'
  ]).forEach(t => add('narrator', t));
  const seen = new Set();
  return out.filter(l => { const k = l.who + '|' + l.text; if (seen.has(k)) return false; seen.add(k); return true; });
}

const JARGON = /\b(psycholog\w*|conditioning|reinforce\w*|schema\w*|cognitive|paper 1|exam|syllabus|IB|system 1|system 2|working memory|multi-store|stimulus|operant|bandura|skinner|pavlov|bartlett|bias\w*|heuristic|quiz|review)\b/i;

function main() {
  const ODY = loadData();
  const problems = [], warns = [];
  const faces = new Set(fs.readdirSync(path.join(LESSON, 'assets', 'faces')).map(f => f.replace('.webp', '')));
  const flagsSet = new Set(), flagsUsed = new Set();
  const drillKinds = ['sort', 'order', 'cloze', 'lopseed', 'loprecall', 'lop', 'reinforce', 'bj', 'bartlett', 'flash', 'span', 'serial', 'dualtask', 'crt', 'anchor', 'rule246', 'penelope'];
  const drillFlags = ['lotus_resisted', 'lotus_picks', 'penelope_ok', 'penelope_doubt'];
  drillFlags.forEach(f => flagsSet.add(f));
  for (const id of ODY.episodeOrder) {
    const ep = ODY.episodes[id];
    const { steps, labels } = compile(ep);
    const where = i => `${id}#${i}`;
    const noteCond = c => { if (!c) return; for (const part of c.split('&')) { const p = part.replace(/^!/, ''); if (!/[<>=]/.test(p) && !p.startsWith('item:')) flagsUsed.add(p); } };
    steps.forEach((st, i) => {
      noteCond(st.cond);
      if (st.kind === 'bad') problems.push(`${where(i)} unparsed: ${st.raw}`);
      if (st.kind === 'goto' && labels[st.to] == null) problems.push(`${where(i)} missing label ${st.to}`);
      if (st.kind === 'line') {
        if (st.who !== 'narrator' && !ODY.cast[st.who]) problems.push(`${where(i)} unknown speaker ${st.who}`);
        if (st.pose && !ODY.sprites[st.who + '-' + st.pose]) problems.push(`${where(i)} missing pose ${st.who}.${st.pose}`);
        if (st.face && !faces.has(st.who + '-' + st.face)) problems.push(`${where(i)} missing face ${st.who}~${st.face}`);
        st.text.forEach(t => {
          if (/[—–]/.test(t)) problems.push(`${where(i)} dash in: ${t.slice(0, 60)}`);
          if (st.who !== 'narrator' && JARGON.test(t)) warns.push(`${where(i)} fourth wall? ${st.who}: ${t.slice(0, 90)}`);
          if (t.split(/\s+/).length > 48) warns.push(`${where(i)} long line (${t.split(/\s+/).length} words)`);
        });
      }
      if (st.kind === 'dir') {
        if (['scene', 'enter'].includes(st.name)) st.args.forEach(a => {
          const m = a.match(/^(?:left|right|center|farleft|farright)=([a-z]+)(?:\.([a-z]+))?$/);
          if (m && m[2] && !ODY.sprites[m[1] + '-' + m[2]]) problems.push(`${where(i)} missing pose ${m[1]}.${m[2]}`);
          if (!m && st.name === 'scene' && !fs.existsSync(path.join(LESSON, 'assets', 'scenes', a + '.webp'))) problems.push(`${where(i)} missing scene ${a}`);
        });
        if (['set', 'random'].includes(st.name)) st.args.forEach(f => flagsSet.add(f));
        if (st.name === 'award' && !ODY.achievements.some(a => a.id === st.args[0])) problems.push(`${where(i)} unknown achievement ${st.args[0]}`);
        if (st.name === 'ending' && !ODY.endings[st.args[0]]) problems.push(`${where(i)} unknown ending ${st.args[0]}`);
      }
      if (st.kind === 'obj') {
        const o = st.obj;
        if (o.choice) {
          o.choice.opts.forEach(op => { [].concat(op.set || []).forEach(f => flagsSet.add(f)); noteCond(op.if); if (op.go && labels[op.go] == null) problems.push(`${where(i)} choice go missing ${op.go}`); });
          if (o.choice.silence) [].concat(o.choice.silence.set || []).forEach(f => flagsSet.add(f));
          if (o.choice.timer && !o.choice.silence) warns.push(`${where(i)} timed choice without silence option`);
        }
        if (o.qte) {
          (o.qte.t || []).forEach(t => { if (!ODY.questions.some(q => q.t === t)) problems.push(`${where(i)} qte topic has no questions: ${t}`); });
          if (o.qte.fail && labels[o.qte.fail] == null) problems.push(`${where(i)} qte fail label missing ${o.qte.fail}`);
        }
        if (o.drill) {
          if (!drillKinds.includes(o.drill)) problems.push(`${where(i)} unknown drill ${o.drill}`);
          if (['sort', 'order', 'cloze'].includes(o.drill) && !(ODY.drills[o.drill] || {})[o.id]) problems.push(`${where(i)} missing ${o.drill} ${o.id}`);
        }
        if (o.notes && !ODY.topics[o.notes]) problems.push(`${where(i)} missing topic ${o.notes}`);
        if (o.log) (o.log.items || [o.log]).forEach(it => {
          if (!it.q || !it.a || !it.d || it.d.length < 2) { problems.push(`${where(i)} bad log item`); return; }
          const longest = Math.max(...it.d.map(d => d.length));
          if (it.a.length > 1.3 * longest) warns.push(`${where(i)} answer is the giveaway longest option: ${it.q.slice(0, 60)}`);
        });
        if (o.write && (!o.write.q || !o.write.model || !(o.write.checks || []).length)) problems.push(`${where(i)} bad write step`);
      }
    });
  }
  // Flags set in one episode and tested in a later one are fine; flags tested but never set are bugs.
  for (const f of flagsUsed) if (!flagsSet.has(f)) problems.push(`flag tested but never set: ${f}`);
  const lines = voicedLines(ODY);
  const byWho = {};
  lines.forEach(l => { byWho[l.who] = (byWho[l.who] || 0) + 1; });
  const words = lines.reduce((a, l) => a + l.text.split(/\s+/).length, 0);
  console.log(`Episodes: ${ODY.episodeOrder.length}. Voiced lines: ${lines.length} (${words} words, about ${Math.round(words / 150)} min of audio).`);
  console.log('By speaker:', JSON.stringify(byWho));
  console.log(`Questions: ${ODY.questions.length}.`);
  if (warns.length) { console.log(`\nWARNINGS (${warns.length})`); warns.forEach(w => console.log(' - ' + w)); }
  console.log(problems.length ? `\nPROBLEMS (${problems.length})` : '\nNo problems.');
  problems.forEach(p => console.log(' - ' + p));
  const outIdx = process.argv.indexOf('--lines');
  if (outIdx > 0) fs.writeFileSync(process.argv[outIdx + 1], JSON.stringify(lines, null, 1));
  process.exitCode = problems.length ? 1 : 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
