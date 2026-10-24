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
ctx.legacy.m = await evaluate("sha(canonical(Object.fromEntries(Object.entries(legacy).filter(([key])=>key!=='m'))))");
assert.ok(await evaluate('verify(decodeRecord(encodeRecord(legacy)))'));
assert.match(evaluate('humanReport(legacy)'), /Script-dispatched input events: not recorded/);

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

// No content-bearing input log is introduced.
assert.ok(!JSON.stringify(evaluate('run.log')).includes('Typed normally'));
assert.ok(!/id="(?:saveDraft|saveText|saveHTML|saveJSON|saveHistory|saveQR)"/.test(html));
console.log('PASS: actual input handlers, clipboard protections, snapshots, legacy QR records, unsigned checksum boundary, and PDF-only controls.');

export { ctx, evaluate, scripts };
