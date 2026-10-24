// Run with: node design/redemption-arc/integrity-checks.mjs
// Executes the lesson's actual inline functions in an isolated, in-memory DOM stub.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const html = fs.readFileSync(new URL('../../materials/Redemtion Arc P1/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
scripts.forEach((source, i) => new vm.Script(source, { filename: `inline-${i}` }));
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, { value: '', dataset: {}, classList: { add() {} } });
  return elements.get(id);
};
const ctx = vm.createContext({
  console, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, DataView, Blob,
  setTimeout, clearTimeout, atob, btoa, URL, performance, crypto: webcrypto,
  document: { hasFocus: () => true, hidden: false, getElementById: element,
    createElement: () => ({ toDataURL: () => '' }) },
  location: { protocol: 'https:', href: 'https://example.test/redemption/', hash: '' },
});
ctx.window = ctx;
ctx.self = ctx;
scripts.slice(0, 3).forEach(source => vm.runInContext(source, ctx));
vm.runInContext(scripts[3].slice(0, scripts[3].indexOf("$('begin').addEventListener")), ctx);
vm.runInContext(scripts[3].match(/const FONT_DATA="[^"]+";/)[0], ctx);
vm.runInContext(scripts[3].slice(scripts[3].indexOf('async function buildPDF'), scripts[3].indexOf('function getPDF')), ctx);
vm.runInContext(`
  guard=()=>false; account=()=>{}; save=()=>{}; note=()=>{};
  renderThesis=()=>{}; renderCounts=()=>{}; drawQR=()=>{};
  run=newRun('QA æøå',4); db.runs=[run];
`, ctx);
const evaluate = source => vm.runInContext(source, ctx);

element('write-intro').value = 'Typed normally.';
evaluate("input({isTrusted:true,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.stats.scripted'), 0);

element('write-intro').value = 'Typed normally. Script change.';
evaluate("input({isTrusted:false,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.stats.scripted'), 1);
assert.equal(evaluate('run.fields.intro.scripted'), 1);
assert.equal(evaluate('run.answers.intro'), element('write-intro').value);

// A DOM-dispatched event with no text change must not inflate the counter.
evaluate("input({isTrusted:false,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.stats.scripted'), 1);

// The app synthesizes its own audit/composition wrappers. Neither is a scripted DOM event.
element('write-intro').value += ' Audit change.';
evaluate("input({audit:true},'intro')");
assert.equal(evaluate('run.stats.unobserved'), 1);
element('write-intro').value += ' Composition change.';
evaluate("input({composition:true},'intro')");
assert.equal(evaluate('run.stats.scripted'), 1);

// Clipboard and block-size protections remain active.
ctx.prevented = false;
evaluate("before({inputType:'insertFromPaste',preventDefault(){prevented=true}},'intro')");
assert.equal(ctx.prevented, true);
assert.equal(evaluate('run.stats.paste'), 1);
const previous = evaluate('run.answers.intro');
element('write-intro').value += 'x'.repeat(90);
evaluate("input({isTrusted:false,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.answers.intro'), previous);
assert.equal(element('write-intro').value, previous);
assert.equal(evaluate('run.stats.large'), 1);
assert.equal(evaluate('run.stats.scripted'), 2);

evaluate("run.finish=run.start+60000;run.status='locked';run.reason='submitted'");
ctx.submission = await evaluate('snapshot(run)');
assert.equal(ctx.submission.qrRecord.u, 2);
assert.equal(ctx.submission.qrRecord.t.length, 3);
assert.ok(ctx.submission.qrRecord.x.includes('SCRIPT_DISPATCHED_INPUT'));
assert.ok(await evaluate('verify(decodeRecord(submission.code))'));
assert.match(evaluate('humanReport(submission.qrRecord)'), /Script-dispatched input events: 2/);
assert.match(evaluate('humanReport(submission.qrRecord)'), /not a digital signature/);
assert.ok(evaluate('humanReport(submission.qrRecord)').includes(ctx.submission.record.h));
assert.ok(evaluate('processHTML(submission)').includes(ctx.submission.record.h));

// Old v2 and compact v3 records must still decode, with absent new counts labelled honestly.
assert.ok(await evaluate('verify(decodeRecord(encodeRecord(submission.record)))'));
ctx.legacy = structuredClone(ctx.submission.qrRecord);
delete ctx.legacy.u;
delete ctx.legacy.t;
delete ctx.legacy.y;
ctx.legacy.m = await evaluate("sha(canonical(Object.fromEntries(Object.entries(legacy).filter(([key])=>key!=='m'))))");
assert.ok(await evaluate('verify(decodeRecord(encodeRecord(legacy)))'));
assert.match(evaluate('humanReport(legacy)'), /Script-dispatched input events: not recorded/);
assert.match(evaluate('humanReport(legacy)'), /typing rates were not recorded/);

// Demonstrate the security boundary: checksum changes are detected, but can be recomputed.
ctx.changed = structuredClone(ctx.submission.qrRecord);
ctx.changed.n = 'Changed name';
assert.equal(await evaluate('verify(changed)'), false);
ctx.changed.m = await evaluate("sha(canonical(Object.fromEntries(Object.entries(changed).filter(([key])=>key!=='m'))))");
assert.equal(await evaluate('verify(changed)'), true);

ctx.bad = structuredClone(ctx.submission.qrRecord);
ctx.bad.u = -1;
assert.throws(() => evaluate('decodeRecord(encodeRecord(bad))'), /Invalid input-event count/);
ctx.bad.u = 0;
ctx.bad.t = [1, -1, 3];
assert.throws(() => evaluate('decodeRecord(encodeRecord(bad))'), /Invalid growth counts/);

// Active-only cadence excludes idle gaps and untimed first characters in every burst.
evaluate("run=newRun('Typing check',4);db.runs=[run];recordPace(run,'intro',1,0,true)");
for (let i = 1; i <= 150; i++) evaluate(`recordPace(run,'intro',1,${i * 200},true)`);
assert.equal(evaluate('paceRecord(run)[0]'), 30000);
assert.equal(evaluate('paceRecord(run)[1]'), 150);
assert.equal(evaluate('paceRecord(run)[2]'), 60);
assert.equal(evaluate('paceRecord(run)[3]'), 60);
evaluate("recordPace(run,'intro',1,330000,true)");
assert.equal(evaluate('paceRecord(run)[0]'), 30000);
evaluate("recordPace(run,'point',1,330100,true)");
assert.equal(evaluate('paceRecord(run)[1]'), 150);
evaluate("pausePace(run);recordPace(run,'point',1,330200,true)");
assert.equal(evaluate('paceRecord(run)[0]'), 30000);
evaluate("recordPace(run,'point',5,330300,false);recordPace(run,'point',1,330400,true)");
assert.equal(evaluate('paceRecord(run)[1]'), 150);

// Above-reference averages and sustained fast bursts are separate contextual flags.
evaluate("run=newRun('Fast sample',4);db.runs=[run];recordPace(run,'intro',1,0,true)");
for (let i = 1; i <= 110; i++) evaluate(`recordPace(run,'intro',1,${i * 150},true)`);
evaluate("run.finish=run.start+60000;run.status='locked';run.reason='submitted'");
ctx.fast = await evaluate('snapshot(run)');
assert.equal(ctx.fast.qrRecord.y[2], 80);
assert.ok(ctx.fast.qrRecord.x.includes('ABOVE_TYPING_REFERENCE'));
assert.ok(!ctx.fast.qrRecord.x.includes('HIGH_TYPING_RATE'));
for (let i = 1; i <= 80; i++) evaluate(`recordPace(run,'intro',1,${16500 + i * 80},true)`);
ctx.fast = await evaluate('snapshot(run)');
assert.equal(ctx.fast.qrRecord.y[3], 150);
assert.ok(ctx.fast.qrRecord.x.includes('HIGH_TYPING_RATE'));
assert.match(evaluate('humanReport(fast.qrRecord)'), /Peak minus average:/);
assert.ok(await evaluate('verify(decodeRecord(fast.code))'));

// A short burst cannot provide a stable average or a continuous five-second peak.
evaluate("run=newRun('Short sample',4);recordPace(run,'intro',1,0,true);recordPace(run,'intro',1,100,true)");
assert.equal(evaluate('paceRecord(run)[2]'), null);
assert.equal(evaluate('paceRecord(run)[3]'), null);
evaluate("delete run.pace;recordPace(run,'intro',1,200,true)");
assert.equal(evaluate('paceRecord(run)[4]'), 1);

// Input in an unfocused/hidden document remains evidence, but is not keyboard-active time.
evaluate("run=newRun('Away sample',4);focused=false");
element('write-intro').value = 'a';
evaluate("input({isTrusted:true,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.pace.last'), null);
assert.equal(evaluate('paceRecord(run)[0]'), 0);
evaluate('focused=true;visible=false');
element('write-intro').value = 'ab';
evaluate("input({isTrusted:true,inputType:'insertText'},'intro')");
assert.equal(evaluate('run.pace.last'), null);
evaluate('visible=true');

ctx.bad = structuredClone(ctx.fast.qrRecord);
ctx.bad.y = [0, 0, null, -1, 0, 120];
assert.throws(() => evaluate('decodeRecord(encodeRecord(bad))'), /Invalid typing sample/);
ctx.bad.y = [0, 0, null, null, 0, 120];
assert.doesNotThrow(() => evaluate('decodeRecord(encodeRecord(bad))'));

// Student summary is deliberately brief; the teacher report retains the underlying context.
const studentSummary = evaluate('summaryTable(fast,true)');
assert.match(studentSummary, /Session at a glance/);
assert.ok(!studentSummary.includes('SCRIPT_DISPATCHED_INPUT'));
assert.ok(!studentSummary.includes('fingerprint'));
assert.ok(html.includes("window.addEventListener('beforeprint',preparePrint)"));
assert.ok(html.includes("$('printDraft').addEventListener('click',printWork)"));

// Native print preparation works before a run, for drafts, and without a QR/PDF snapshot.
vm.runInContext(scripts[3].slice(scripts[3].indexOf('function preparePrint(){'), scripts[3].indexOf("window.addEventListener('beforeprint'")), ctx);
element('questionChoice').value = '4';
evaluate('run=null;preparePrint()');
assert.match(element('printArea').innerHTML, /Question 4/);
evaluate("run=newRun('Paper check',4);run.answers.intro='Paper-only rescue <&>.';preparePrint()");
assert.match(element('printArea').innerHTML, /DRAFT/);
assert.match(element('printArea').innerHTML, /Paper-only rescue &lt;&amp;&gt;\./);
assert.equal(evaluate('run.status'), 'running');
evaluate("run.status='locked';run.finish=run.start+60000;run.reason='submitted';preparePrint()");
assert.match(element('printArea').innerHTML, /QR process report unavailable/);
assert.match(element('printArea').innerHTML, /Session summary/);
evaluate('run.snapshot=submission;preparePrint()');
assert.ok(element('printArea').innerHTML.includes(ctx.submission.answers.intro));
assert.match(element('printArea').innerHTML, /print-stamp/);

// No content-bearing input log is introduced.
assert.ok(!JSON.stringify(evaluate('run.log')).includes('Typed normally'));
assert.ok(!/id="(?:saveDraft|saveText|saveHTML|saveJSON|saveHistory|saveQR)"/.test(html));
console.log('PASS: input protections, active-only rates, peak/threshold flags, legacy QR records, brief summaries, and setup/draft/QR-failure print preparation.');

export { ctx, evaluate, scripts };
