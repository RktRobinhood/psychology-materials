/* Station 4: Confirmation bias. Wason (1960) 2-4-6 rule discovery task. */
(function () {
  const { ui, util } = DPT;
  const { esc } = util;

  const MIN_TESTS = 3;
  const MAX_TESTS = 12;

  // The secret rule: any three numbers in strictly increasing order.
  const fits = ([a, b, c]) => a < b && b < c;
  // Tests that follow the obvious pattern (going up in equal steps) are ones people expect to fit.
  const samePattern = ([a, b, c]) => b > a && Math.abs((b - a) - (c - b)) < 1e-9;

  const SETS = {
    learn: {
      start: [2, 4, 6],
      hunches: ['Numbers going up by 2', 'Even numbers going up by 2', 'Numbers going up by the same amount', 'Something else, or no idea yet'],
      rules: [
        { t: 'Numbers going up by 2' },
        { t: 'Even numbers going up by 2' },
        { t: 'Numbers going up by the same amount each time' },
        { t: 'Any three numbers in increasing order', ok: true },
        { t: 'The third number is the sum of the first two' },
        { t: 'Any three even numbers' },
      ],
    },
    teach: {
      start: [1, 3, 5],
      hunches: ['Numbers going up by 2', 'Odd numbers going up by 2', 'Numbers going up by the same amount', 'Something else, or no idea yet'],
      rules: [
        { t: 'Numbers going up by 2' },
        { t: 'Odd numbers going up by 2' },
        { t: 'Numbers going up by the same amount each time' },
        { t: 'Any three numbers in increasing order', ok: true },
        { t: 'Any three odd numbers' },
      ],
    },
  };

  const seq = s => s.map(n => util.fmt(n, 3)).join(', ');

  const STYLE = `<style>.conf-nums{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:12px 0}.conf-nums .input{width:96px;text-align:center}.conf-log{display:grid;gap:6px;margin:12px 0;max-width:520px}.conf-row{display:flex;align-items:center;gap:12px;padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:var(--paper);font-family:var(--f-mono);font-size:16px}.conf-row .n{color:var(--muted);font-size:13px;width:2em}.conf-row .s{flex:1;font-weight:700}.conf-row.yes .v{color:var(--good);font-weight:800}.conf-row.no .v{color:var(--bad);font-weight:800}.conf-row .p{font-family:var(--f-ui)}.conf-start{font-family:var(--f-mono);font-weight:800;font-size:clamp(30px,6vw,48px);text-align:center;letter-spacing:.05em}.conf-grid{width:100%;border-collapse:collapse;margin:14px 0;font-size:15px}.conf-grid th,.conf-grid td{padding:8px;border-top:1px solid var(--line);text-align:center}.conf-grid th:first-child,.conf-grid td:first-child{text-align:left}.conf-grid th{font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted)}.conf-grid .y{color:var(--good);font-weight:800}.conf-grid .x{color:var(--bad);font-weight:800}.conf-grid tr.win td{background:var(--good-soft)}</style>`;

  function experiment(el, ctx) {
    const set = ctx.mode === 'teach' ? 'teach' : 'learn';
    const S = SETS[set];
    const tests = [];
    let hunch = null;

    function hunchScreen() {
      el.innerHTML = `${STYLE}<p class="kicker">Crack the rule</p>
        <h2 class="screen-title">I have a secret rule</h2>
        <p class="prose">My rule is about sequences of <b>three numbers</b>. This sequence follows the rule:</p>
        <div class="task-card"><div class="conf-start">${seq(S.start)}</div></div>
        <p class="prose">Your job is to work out the rule. First, what's your hunch right now?</p>
        <div class="choice-list">${S.hunches.map((h, i) => `<button class="choice" data-i="${i}">${h}</button>`).join('')}</div>`;
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => { hunch = +b.dataset.i; testScreen(); });
    }

    function testScreen() {
      const canAnnounce = tests.length >= MIN_TESTS;
      const full = tests.length >= MAX_TESTS;
      el.innerHTML = `${STYLE}<p class="exp-progress">Test ${Math.min(tests.length + 1, MAX_TESTS)} of up to ${MAX_TESTS} · starting example: ${seq(S.start)}</p>
        <h2 class="screen-title">Test your own sequences</h2>
        <p class="prose">Type any three numbers and press <b>Test</b>. I'll tell you whether they fit my rule. Test at least ${MIN_TESTS} sequences. When you're confident you know the rule, announce it.</p>
        ${full ? ui.callout('note', `You've used all ${MAX_TESTS} tests. Time to announce the rule.`) : `
        <div class="conf-nums">
          <input class="input" inputmode="decimal" autocomplete="off" aria-label="First number">
          <input class="input" inputmode="decimal" autocomplete="off" aria-label="Second number">
          <input class="input" inputmode="decimal" autocomplete="off" aria-label="Third number">
          <button class="btn primary" id="confTest" disabled>Test</button>
        </div>`}
        <div class="conf-log">${tests.length ? tests.slice().reverse().map(t => `<div class="conf-row ${t.fits ? 'yes' : 'no'}"><span class="n">${t.n}</span><span class="s">${seq(t.s)}</span><span class="v">${t.fits ? '✓ fits' : '✗ doesn’t fit'}</span></div>`).join('') : '<p class="muted">Your tests will appear here.</p>'}</div>
        <div class="btn-row"><button class="btn ${canAnnounce ? 's2' : 'ghost'}" id="confAnnounce" ${canAnnounce ? '' : 'disabled'}>I know the rule: announce it</button></div>
        ${canAnnounce ? '' : `<p class="muted" style="font-size:14.5px">Test ${MIN_TESTS - tests.length} more sequence${MIN_TESTS - tests.length > 1 ? 's' : ''} before you can announce.</p>`}`;

      el.querySelector('#confAnnounce').onclick = announceScreen;
      if (full) return;
      const boxes = [...el.querySelectorAll('.conf-nums .input')];
      const btn = el.querySelector('#confTest');
      const vals = () => boxes.map(b => util.num(b.value));
      const valid = () => vals().every(Number.isFinite);
      boxes.forEach((b, i) => {
        b.oninput = () => { btn.disabled = !valid(); };
        b.onkeydown = e => {
          if (e.key !== 'Enter') return;
          if (valid()) run();
          else if (i < 2) boxes[i + 1].focus();
        };
      });
      btn.onclick = run;
      boxes[0].focus();
      function run() {
        const s = vals();
        tests.push({ n: tests.length + 1, s, fits: fits(s), same: samePattern(s) });
        testScreen();
      }
    }

    function announceScreen() {
      const opts = util.shuffle(S.rules);
      el.innerHTML = `${STYLE}<p class="kicker">Announce the rule</p>
        <h2 class="screen-title">What is my rule?</h2>
        <p class="prose">You tested ${tests.length} sequence${tests.length > 1 ? 's' : ''}. Choose the rule you think is correct. You only get one announcement.</p>
        <div class="choice-list">${opts.map((o, i) => `<button class="choice" data-i="${i}">${o.t}</button>`).join('')}</div>
        <div class="btn-row"><button class="btn ghost small" id="confBack" ${tests.length >= MAX_TESTS ? 'hidden' : ''}>‹ Back to testing</button></div>`;
      el.querySelector('#confBack').onclick = testScreen;
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => finish(opts[+b.dataset.i]));
    }

    function finish(choice) {
      const nSame = tests.filter(t => t.same).length;
      const nNo = tests.filter(t => !t.fits).length;
      const triedBreak = tests.some(t => !t.same);
      const result = {
        set, start: S.start, hunch: S.hunches[hunch], hunchIdx: hunch, tests,
        announced: choice.t, correct: !!choice.ok, nSame, nNo, triedBreak,
      };
      ctx.pool.add({ set, correct: result.correct, n: tests.length, nSame, gotNo: nNo > 0, triedBreak });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">Rule announced</h2>
        <p class="prose">Press <b>Next</b> to find out the rule, and what your tests reveal about how you were thinking.</p>`;
      ctx.done(result);
    }

    hunchScreen();
  }

  function logHTML(res) {
    return `<div class="conf-log">${res.tests.map(t => `<div class="conf-row ${t.fits ? 'yes' : 'no'}"><span class="n">${t.n}</span><span class="s">${seq(t.s)}</span><span class="v">${t.fits ? '✓' : '✗'}</span>
      <span class="p">${t.same ? '<span class="pill s1">same pattern</span>' : '<span class="pill s2">risky test</span>'}</span></div>`).join('')}</div>`;
  }

  // Hypotheses versus test sequences: which ideas each test could rule out.
  const HYP = [
    { t: 'Going up by 2', f: ([a, b, c]) => b - a === 2 && c - b === 2 },
    { t: 'Going up by the same amount', f: samePattern },
    { t: 'Any increasing numbers (the real rule)', f: fits, win: true },
  ];
  const DEMO = [[8, 10, 12], [20, 22, 24], [1, 2, 50], [3, 10, 11], [6, 4, 2]];
  function gridHTML() {
    return `<table class="conf-grid"><thead><tr><th>If the rule were…</th>${DEMO.map(d => `<th>${seq(d)}</th>`).join('')}</tr></thead><tbody>
      ${HYP.map(h => `<tr class="${h.win ? 'win' : ''}"><td>${h.t}</td>${DEMO.map(d => h.f(d) ? '<td class="y">✓</td>' : '<td class="x">✗</td>').join('')}</tr>`).join('')}
      </tbody></table>`;
  }

  function reveal(res, ctx) {
    const n = res.tests.length;
    let verdict;
    if (res.correct && res.triedBreak) verdict = `You found the rule, and you did it the right way: you tested at least one sequence that <b>broke the pattern</b>. That is what most people never do.`;
    else if (res.correct) verdict = `You chose the right rule, but every one of your tests followed the same pattern as ${seq(res.start)}. None of your tests could actually have shown you that the broader rule was true, so this may have been a lucky announcement.`;
    else if (!res.triedBreak) verdict = `<b>All ${n} of your tests followed the pattern</b> you already expected (going up in equal steps). Every one said “fits”, which felt like progress. But none of them could ever have shown you that your idea was wrong. That is confirmation bias.`;
    else verdict = `You did try some risky tests, which is good, but the rule you announced still didn't match all the evidence. Look at your log: which ✓ results did your announced rule fail to explain?`;

    const pool = ctx.pool.all().filter(r => r.set === res.set);
    const pc = util.pct(pool.filter(r => r.correct).length, pool.length);
    const pb = util.pct(pool.filter(r => r.triedBreak).length, pool.length);
    const pno = util.pct(pool.filter(r => r.gotNo).length, pool.length);

    return `${STYLE}
      <div class="stat-row">
        ${ui.stat(res.correct ? 'Correct' : 'Not quite', `you announced: “${esc(res.announced)}”`, res.correct ? 'good' : 'bad')}
        ${ui.stat(`${res.nSame} / ${n}`, 'tests that followed the same pattern', 's1')}
        ${ui.stat(res.nNo, 'times you heard “doesn’t fit”', 's2')}
      </div>
      ${ui.define('The rule was…', '<b>Any three numbers in increasing order.</b> 1, 2, 50 fits. 3, 10, 11 fits. -5, 0, 1000 fits. Only sequences that go down or stay the same (6, 4, 2 or 5, 5, 5) break it.')}
      <h3>Your tests</h3>
      <p class="muted" style="font-size:15px">Your first hunch: <b>${esc(res.hunch)}</b>. <span class="pill s1">same pattern</span> = went up in equal steps, like ${seq(res.start)}. <span class="pill s2">risky test</span> = broke that pattern, so it could have proved your idea wrong.</p>
      ${logHTML(res)}
      ${ui.callout('key', verdict)}
      <h3>Everyone at this station so far</h3>
      ${ui.bars([
        { label: 'Announced the correct rule', value: pc, max: 100, text: pc + '%', cls: 'good' },
        { label: 'Tried at least one risky test', value: pb, max: 100, text: pb + '%', cls: 's2' },
        { label: 'Ever heard “doesn’t fit”', value: pno, max: 100, text: pno + '%', cls: 'muted' },
      ])}
      ${ui.poolNote(pool.length)}
      <p class="muted" style="font-size:15px">Wason (1960): only <b>6 of 29</b> participants (about 21%) announced the correct rule the first time.</p>`;
  }

  DPT.register({
    id: 'confirmation', num: 4, hue: 210, minutes: 15,
    title: 'Crack the Rule (2-4-6)',
    bias: 'Confirmation bias',
    hook: 'A simple number rule. You can test it as often as you like, yet four out of five people get it wrong.',
    intro: {
      learn: `<p>I'm thinking of a rule for sequences of three numbers. I'll give you one example that fits. You can test as many sequences of your own as you like (up to ${MAX_TESTS}), and I'll tell you whether each one fits.</p>
        <p>When you're confident, you announce the rule. This is Peter Wason's <b>2-4-6 task</b>, one of the first experiments on how people test their own ideas.</p>`,
      teach: `<p><b>Host tip:</b> your guest starts from <b>1, 3, 5</b>, not 2, 4, 6. The secret rule is the same. Watch their tests: do they ever try a sequence they expect to <i>fail</i>?</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'Why 8, 10, 12 told you nothing',
        html: res => `${STYLE}
          <p>Most people's first idea is <b>“going up by 2”</b>. So they test 8, 10, 12. It fits. They test 20, 22, 24. It fits. They feel more and more sure, and announce “going up by 2”. Wrong.</p>
          <p>Each column below is a test. Each row is a possible rule. A ✓ means that rule predicts the sequence would fit.</p>
          ${gridHTML()}
          ${ui.steps([
            `<b>8, 10, 12</b> and <b>20, 22, 24</b> get a ✓ from <b>every</b> rule. Whatever the answer, they will fit. So they can't tell the rules apart. They tell you nothing new.`,
            `<b>1, 2, 50</b> is the test that matters. “Going up by 2” predicts ✗. The real answer is ✓. One test, and the idea is dead.`,
            `<b>6, 4, 2</b> checks the other direction. It fails, which tells you that order matters.`,
            `The only way to find the rule is to try sequences you <b>expect to fail</b>. A “doesn't fit” is often the most useful answer you can get.`,
          ])}
          ${res.triedBreak ? '' : ui.callout('s1', `<b>You never tried a risky test.</b> Every sequence you tried followed the same pattern as ${seq(res.start)}, so the answer was always going to be “fits”.`)}`,
      },
      {
        kicker: 'System 1’s shortcut', title: 'Looking for a “yes”',
        html: `<p>People test sequences they expect to fit. This is called a <b>positive test strategy</b>. Each “fits” feels like evidence that you're right, so confidence grows, even though nothing has actually been tested.</p>
          ${ui.s1s2(
            `<ul><li>Forms a hypothesis quickly from the example (“up by 2”).</li><li>Looks for cases that <b>agree</b> with it.</li><li>Every ✓ gives a pleasant feeling of progress and certainty.</li><li>Never considers what evidence would prove the idea wrong.</li></ul>`,
            `<ul><li>Asks: “What result would show my idea is <b>wrong</b>?”</li><li>Deliberately tests sequences that break the pattern (1, 2, 50; 6, 4, 2).</li><li>Treats a ✗ as useful information, not failure.</li><li>This is how science works: <b>falsification</b>, trying to disprove your own hypothesis.</li></ul>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> System 1 searches for evidence that confirms what it already thinks. Trying to break your own idea feels uncomfortable and takes effort, so System 2 rarely does it unless it has to.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Confirmation bias',
        html: `${ui.define('Confirmation bias', 'The tendency to <b>search for, interpret, favour and remember</b> information in a way that <b>supports what we already believe</b>, while ignoring or downplaying information that goes against it.')}
          <p>It works through three processes:</p>
          ${ui.steps([
            `<b>Selective exposure:</b> choosing information that agrees with you. <i>Example:</i> following only social media accounts that share your political views, or testing only sequences that fit your hunch.`,
            `<b>Selective perception (interpretation):</b> seeing the same evidence as support for your view. <i>Example:</i> two fans watch the same foul and each is sure the referee was biased against their team.`,
            `<b>Selective retention (memory):</b> remembering the evidence that fits and forgetting the rest. <i>Example:</i> remembering the times your “lucky” pen helped in a test, and forgetting the times it didn't.`,
          ])}`,
      },
      {
        kicker: 'The evidence', title: 'Two key studies',
        html: `${ui.study({ name: 'Wason (1960)', rows: [
            ['Aim', 'To investigate how people test hypotheses.'],
            ['Method', '29 university students were given the sequence 2, 4, 6 and asked to find the rule by testing their own sequences, then announce it.'],
            ['Findings', 'Only <b>6 of 29</b> (about 21%) announced the correct rule (any increasing numbers) first time. Most tested only sequences that fitted their own hypothesis.'],
            ['Link', 'People seek confirming evidence rather than trying to disprove their idea.'],
          ] })}
          ${ui.study({ name: 'Lord, Ross & Lepper (1979)', rows: [
            ['Aim', 'To see whether people evaluate evidence differently depending on their existing beliefs.'],
            ['Method', '<b>48 Stanford</b> undergraduates, half in favour of capital punishment and half against, read two made-up studies: one suggesting the death penalty deters crime, and one suggesting it doesn’t. They rated how convincing each study was and reported their attitudes.'],
            ['Findings', 'Each side rated the study that <b>supported their view</b> as better and more convincing, and found flaws in the other. After reading <b>both</b> studies, both groups became <b>more extreme</b> in their original views (<b>attitude polarisation</b>).'],
            ['Link', 'The same mixed evidence pushed people further apart. Each side interpreted it through its existing beliefs.'],
          ] })}
          ${ui.callout('key', `<b>Why Lord et al. is so important:</b> you might expect balanced evidence to make people more moderate. The opposite happened, because each group accepted the evidence that confirmed its view and picked holes in the rest.`)}`,
      },
      {
        kicker: 'Why we do it', title: 'Why do we seek confirmation?',
        html: `${ui.steps([
            `<b>It reduces cognitive load.</b> Information that fits our existing schemas is easy to process. Information that challenges them means rethinking, which takes effort. The cognitive miser takes the easy route.`,
            `<b>It protects self-esteem.</b> Finding out you were wrong is uncomfortable. Avoiding disconfirming evidence protects your ego.`,
            `<b>Memory favours what fits.</b> Information that matches our beliefs is encoded and retrieved more easily, so it feels like there is more of it.`,
            `<b>Beliefs are part of group identity.</b> Our views are often shared with friends, family or a community. Changing them can risk social rejection, so there is pressure to defend them.`,
            `<b>It may have evolved for speed.</b> Quickly acting on what experience has taught you, instead of doubting it every time, could help survival.`,
          ])}
          ${ui.callout('s1', `<b>Put simply:</b> System 1 finds it easy, comfortable and socially safe to accept what fits. Questioning it is System 2's job, and System 2 is effortful.`)}`,
      },
      {
        kicker: 'Real life', title: 'Confirmation bias every day',
        html: `<div class="two-col">
            <div class="card"><b>Filter bubbles</b><br>Social media algorithms show you more of what you already like and agree with. Over time you rarely see the other side, and people become more <b>polarised</b>, just as in Lord et al.</div>
            <div class="card"><b>Choosing a university</b><br>Once you have a favourite, you read the glowing reviews carefully and skim past the complaints. You're not weighing the evidence; you're collecting support.</div>
            <div class="card"><b>Stereotypes</b><br>If you expect a group to behave a certain way, you notice and remember the cases that fit and dismiss the ones that don't as exceptions. The stereotype seems to be confirmed again and again.</div>
            <div class="card"><b>Science and medicine</b><br>A researcher or doctor who looks only for signs that fit their first idea can miss the real cause. Good science builds in tests that could prove the hypothesis wrong.</div>
          </div>`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `<h3>Evaluating Lord, Ross &amp; Lepper (1979)</h3>
          ${ui.s1s2(
            `<ul><li>Participants were chosen because they <b>already held strong opinions</b>, so the study tested real beliefs.</li><li>Both sides read the <b>same</b> two studies, so differences came from beliefs, not the material.</li><li>The findings match later research on polarisation and online news.</li></ul>`,
            `<ul><li><b>Sample:</b> 48 Stanford undergraduates, a small and unrepresentative group. Students may also have felt they had to <b>justify their opinion</b> to the researchers.</li><li><b>Measurement:</b> attitudes were self-reported on rating scales. People interpret scales differently, and saying you became “more extreme” is not the same as actually changing.</li><li><b>Artificial:</b> the studies were made up and read in a lab, which is unlike how people meet evidence in real life.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Nuance for the 2-4-6 task:</b> Klayman and Ha (1987) argued that testing cases you expect to fit is often a <b>sensible</b> strategy in real life. It only fails badly when the true rule is broader than your idea, as in the 2-4-6 task. So the task may exaggerate how irrational people are.`)}
          ${ui.callout('tip', `<b>Exam tip:</b> a Paper 1 Section A question might ask you to <i>“Explain confirmation bias with reference to one example.”</i> Three moves:<ol><li><b>Describe</b> the bias: seeking, interpreting and remembering information that supports existing beliefs.</li><li><b>Give an example</b>: Lord, Ross &amp; Lepper (1979), Wason (1960), or a real-life case such as filter bubbles.</li><li><b>Explain why</b> it happens: System 1 takes the low-effort route (cognitive miser, fits existing schemas, protects self-esteem), and System 2 does not deliberately look for disconfirming evidence.</li></ol>`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The rule, and what your guest tested', hint: '<b>Any three increasing numbers.</b> Point to their log: how many tests followed the same pattern? Did they ever try one they expected to fail?' },
        { point: 'Why “same pattern” tests tell you nothing', hint: 'Sequences like 7, 9, 11 fit <b>every</b> likely rule, so they can’t rule anything out. Tests like 1, 2, 50 or 5, 3, 1 can.' },
        { point: 'System 1 versus System 2', hint: 'System 1: looks for a “yes” (positive test strategy); each ✓ feels like progress. System 2: tries to <b>disprove</b> its own idea (falsification).' },
        { point: 'Name it: confirmation bias + three processes', hint: 'Seeking, interpreting, favouring and remembering info that supports what you believe. Selective exposure, selective perception, selective retention.' },
        { point: 'Wason (1960)', hint: '2-4-6 task: only 6 of 29 (about 21%) announced the right rule first time.' },
        { point: 'Lord, Ross & Lepper (1979)', hint: '48 Stanford students for/against the death penalty read two fake studies. Each rated the supporting study as better, and both groups became more extreme (polarisation).' },
        { point: 'Why we do it', hint: 'Less cognitive load, protects self-esteem, fitting info is remembered better, beliefs tied to group identity, quick decisions based on experience.' },
        { point: 'Real life and one limitation', hint: 'Filter bubbles, choosing a university, stereotypes. Limitation of Lord et al.: small Stanford sample, self-report rating scales, artificial studies.' },
      ],
      visual: res => `${STYLE}<p style="margin:0 0 6px">Your guest's tests:</p>${logHTML(res)}
        <p style="margin:12px 0 4px">Which tests can tell the rules apart?</p>${gridHTML()}`,
      ask: [
        'Before you announced, how sure were you? What made you feel sure?',
        'Did you ever try a sequence you thought would NOT fit? Why not?',
        'Can you think of a time you only looked for evidence that agreed with you?',
      ],
    },
    concepts: [
      { name: 'Measurement', html: 'How do you measure whether someone’s attitude has become more extreme? Lord et al. asked participants to <b>report</b> how much their view had changed on rating scales. That is not the same as measuring the attitude before and after, and later studies found the two methods give different answers. In the 2-4-6 task the measure is behaviour instead: how many of your tests followed the same pattern, which avoids relying on self-report.' },
      { name: 'Bias', html: 'Confirmation bias is a systematic distortion in how we search for and interpret evidence, as your test log showed. Researchers are not immune: a scientist who expects a result can design studies, or read data, in ways that confirm it. That is why good research tries to falsify its own hypotheses, exactly the strategy the 2-4-6 task rewards.' },
      { name: 'Responsibility', html: 'Lord et al. gave participants made-up studies presented as real research, which is deception. Researchers have a responsibility to debrief participants, especially as the study may have left them with more extreme views. Social media companies also carry responsibility: algorithms that show people only what they already agree with can strengthen confirmation bias across a whole society.' },
      { name: 'Perspective', html: 'Confirmation bias can be explained from different angles. A cognitive view stresses low effort (the cognitive miser); a motivational view stresses protecting self-esteem; a sociocultural view stresses beliefs as part of group identity. Klayman and Ha (1987) add another perspective: testing cases you expect to fit is often a sensible strategy, not a flaw.' },
    ],
    debate: {
      title: 'Does mixed evidence really push people further apart?',
      sideA: { label: 'Yes: Lord, Ross & Lepper (1979)', html: '48 Stanford students with strong views for or against capital punishment read one made-up study supporting it and one opposing it. Each side rated the study that agreed with them as more convincing, and after reading both, both groups said their views had become more extreme. This became the classic evidence for attitude polarisation.' },
      sideB: { label: 'Not so clear: Miller et al. (1993); Guess & Coppock (2020)', html: 'Miller, McHoskey, Bane and Dowd repeated the study. They again found that people rated agreeing evidence as better, but polarisation appeared mainly when people <b>reported</b> how much they had changed, and much less when attitudes were measured before and after. Guess and Coppock ran large online experiments on political topics such as gun control and the minimum wage, and found that people usually shifted slightly <b>towards</b> the evidence they read rather than away from it.' },
      why: [
        { factor: 'Measurement', html: 'This is the key factor. Asking “how much has your view changed?” invites people to describe themselves as firmer in their beliefs, which may reflect how they see themselves rather than real change. Measuring the attitude before and after the evidence gives a more direct measure, and it shows far less polarisation.' },
        { factor: 'Sample size', html: 'Lord et al. tested 48 students. Guess and Coppock tested thousands of adults across several experiments, so their results are much less likely to be due to chance.' },
        { factor: 'Who was tested', html: 'Lord et al. chose students who already had strong views, which is when polarisation is most likely. Large studies of the general public include many people with weaker views, who may simply update. Both results could be true for different groups.' },
        { factor: 'Demand characteristics', html: 'Participants who know they were picked for their strong opinion may feel they should defend it in front of the researchers. A more hidden before-and-after measure makes this less likely.' },
        { factor: 'Publication bias', html: 'A dramatic finding like “balanced evidence makes people more extreme” is memorable and widely cited. Studies showing ordinary, small updating are less eye-catching, so the dramatic version may have spread further than the evidence justified.' },
      ],
      trust: 'Two claims need to be separated. The claim that people judge evidence that agrees with them as stronger (biased assimilation) is well supported: it appeared in Lord et al., in Miller et al., and in much later work. The stronger claim that mixed evidence makes people more extreme is less secure, because it seems to depend on self-reported change, and larger studies with before-and-after measures usually find small movement towards the evidence. So the more trustworthy conclusion is that confirmation bias slows down how much we update, but it does not usually make us go backwards. This is still debated, and polarisation may happen for some people on some very emotional topics.',
      ask: 'If people usually move slightly towards the evidence, is it still worth arguing with someone who disagrees with you? What does this debate suggest about how to change someone’s mind?',
    },
    quiz: {
      core: [
        { q: 'In Wason’s 2-4-6 task, what was the experimenter’s rule?', a: 'Any three numbers in increasing order', d: ['Even numbers going up by 2', 'Numbers going up by the same amount', 'Any three even numbers in any order'], why: '2, 4, 6 fits many rules. The real one is much broader than most people’s first guess.' },
        { q: 'Your hypothesis is “numbers going up by 2”. Which test is <b>most useful</b> for checking it?', a: '3, 10, 11', d: ['10, 12, 14', '20, 22, 24', '100, 102, 104'], why: 'Your hypothesis predicts 3, 10, 11 will fail. If it fits, your idea is wrong. The other three fit every likely rule, so they tell you nothing new.' },
        { q: 'What is <b>confirmation bias</b>?', a: 'Seeking, interpreting and remembering information in ways that support what you already believe', d: ['Relying too much on the first piece of information you are given', 'Choosing options because they match the words used in a problem', 'Changing your belief as soon as you meet any evidence against it'], why: 'It covers what we look for, how we interpret it and what we remember.' },
        { q: 'What did <b>Wason (1960)</b> find?', a: 'Only about 21% (6 of 29) announced the correct rule first time', d: ['About 80% announced the correct rule first time', 'Nearly all participants tested sequences they expected to fail', 'Participants announced the correct rule after exactly three tests'], why: 'Most participants tested only sequences that fitted their hypothesis, so they never discovered it was wrong.' },
        { q: 'In <b>Lord, Ross &amp; Lepper (1979)</b>, what happened after participants read one study for and one against capital punishment?', a: 'Both groups became more extreme in the views they started with', d: ['Both groups became more moderate after seeing balanced evidence', 'Supporters changed their minds but opponents did not', 'Neither group’s attitudes changed at all'], why: 'This is attitude polarisation. Each side accepted the supporting study and criticised the other.' },
        { q: 'Sam supports one political party and only follows news channels that agree with it. This is an example of…', a: 'selective exposure', d: ['selective retention', 'anchoring and adjustment', 'the availability heuristic'], why: 'Selective exposure means choosing to encounter information that fits your existing views.' },
        { q: 'Mia believes her lucky bracelet helps in exams. She remembers the good results when she wore it and forgets the bad ones. This is…', a: 'selective retention', d: ['selective exposure', 'selective perception', 'attitude polarisation'], why: 'Selective retention is remembering belief-consistent information better than inconsistent information.' },
        { q: 'Which is an explanation of <b>why</b> confirmation bias happens?', a: 'Information that fits existing schemas takes less effort to process than information that challenges them', d: ['People are naturally motivated to look for evidence that they are wrong', 'System 2 automatically searches for disconfirming evidence', 'Beliefs are stored separately from memory, so evidence cannot change them'], why: 'The cognitive miser prefers the low-effort route. Challenging information requires effortful System 2 thinking.' },
        { q: 'Which is a <b>limitation</b> of Lord, Ross &amp; Lepper (1979)?', a: 'A small Stanford sample rating fictitious studies may not reflect how people handle real evidence', d: ['Participants did not have any opinions about capital punishment', 'The two groups read completely different studies from each other', 'The researchers did not measure attitudes after the studies'], why: 'Sample bias and artificial materials limit generalisation. Self-report scales add measurement problems.' },
        { q: 'Miller et al. (1993) repeated Lord et al.’s study. When did attitude polarisation mainly appear?', a: 'When people reported how much their view had changed, rather than when it was measured before and after', d: ['When attitudes were measured before and after, rather than when people reported their change', 'Only when participants had no opinion about capital punishment beforehand', 'Only when participants read the study that disagreed with them first'], why: 'The self-report measure showed polarisation; direct before-and-after measures showed much less. The way change is measured shapes the result.' },
      ],
      extra: [
        { q: 'Lord et al. presented made-up studies to participants as real research. Which step is most important for acting responsibly afterwards?', a: 'Debriefing participants that the studies were fictitious', d: ['Asking participants to keep their new opinions private', 'Paying participants more if their views changed', 'Showing participants only the study they agreed with'], why: 'Deception must be followed by a debrief, especially as participants may have left with more extreme views based on false evidence.' },
        { q: 'A video platform recommends more of the videos you already watch and agree with. Over months your views become more extreme. This is best described as…', a: 'a filter bubble strengthening confirmation bias', d: ['anchoring on the first video you watched', 'the framing effect in video titles', 'matching bias caused by abstract content'], why: 'The algorithm does the selective exposure for you, which leads to the kind of polarisation Lord et al. found.' },
        { q: 'Klayman and Ha (1987) argued that the positive test strategy in the 2-4-6 task…', a: 'is often sensible in real life and fails mainly when the true rule is broader than your idea', d: ['is always irrational and should never be used', 'is only used by people with low intelligence', 'guarantees the correct rule if you test enough times'], why: 'Testing expected “yes” cases often works. The 2-4-6 task is designed so that it doesn’t, which may exaggerate irrationality.' },
        { q: 'A teacher expects a student to misbehave. She notices every time he talks in class and sees his questions as “showing off”. Which process is this?', a: 'Selective perception (interpretation)', d: ['Selective exposure', 'Selective retention', 'Anchoring and adjustment'], why: 'She interprets neutral or positive behaviour (asking questions) in a way that fits her expectation.' },
        { q: 'Why is falsification seen as a <b>System 2</b> strategy?', a: 'Deliberately trying to disprove your own idea takes effort and goes against the pull of confirming evidence', d: ['It happens automatically whenever people test an idea', 'It relies on gut feelings about which tests to run', 'It is the quickest way to reach a confident answer'], why: 'System 1 seeks a “yes”. Designing a test that could prove you wrong is effortful and deliberate.' },
      ],
    },
  });
})();
