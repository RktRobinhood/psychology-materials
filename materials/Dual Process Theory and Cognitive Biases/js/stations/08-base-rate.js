/* Station 8: Taxi-cab problem / medical screening problem. Base-rate neglect. */
(function () {
  const { ui, util } = DPT;

  // Four groups in every problem:
  // A = really the target AND flagged (Blue cab called Blue / ill person tests positive)
  // B = really the target, NOT flagged (Blue cab called Green / ill person tests negative)
  // C = NOT the target but flagged (Green cab called Blue / healthy person tests positive)
  // D = NOT the target, NOT flagged (Green cab called Green / healthy person tests negative)
  const PROBS = {
    taxi: {
      name: 'Taxi witness', total: 100, cols: 10, delay: 6,
      counts: { A: 12, B: 3, C: 17, D: 68 },
      correct: 41, intuitive: 80,
      okRange: [36, 46], s1Range: [75, 85],
      bins: [[0, 29], [30, 50], [51, 74], [75, 85], [86, 100]],
      goodBin: 1, s1Bin: 3,
      target: 'Blue', other: 'Green', flag: 'says Blue',
      story: `<p>A taxi was involved in a hit-and-run accident at night. Two taxi companies operate in the city: the <b>Green</b> company and the <b>Blue</b> company.</p>
        <ul><li><b>85%</b> of the city’s taxis are <b>Green</b> and <b>15%</b> are <b>Blue</b>.</li>
        <li>A witness says the taxi was <b>Blue</b>.</li>
        <li>The court tested the witness under the same night-time conditions. The witness identified each colour correctly <b>80%</b> of the time and got it wrong <b>20%</b> of the time.</li></ul>`,
      question: 'What is the probability that the taxi in the accident was actually <b>Blue</b>?',
      relyOpts: [
        ['witness', 'Mainly the witness’s accuracy (80%)'],
        ['base', 'Mainly the proportion of taxis (15% Blue, 85% Green)'],
        ['both', 'I combined both pieces of information'],
        ['guess', 'I mostly guessed'],
      ],
      intro0: 'Imagine <b>100 taxis</b> in the city, one dot each. Press step 1.',
      stages: [
        { btn: 'Base rate', cap: '<b>Step 1: the base rate.</b> Before the witness says anything, <b>85</b> taxis are Green and only <b>15</b> are Blue. Blue taxis are rare.' },
        { btn: 'Witness accuracy', cap: '<b>Step 2: apply the witness’s 80% accuracy to every taxi.</b> Of the 15 Blue taxis, the witness would correctly say “Blue” for <b>12</b> (80%) and wrongly say “Green” for 3. Of the 85 Green taxis, the witness would wrongly say “Blue” for <b>17</b> (20%). Ringed dots = the witness says “Blue”.' },
        { btn: 'Says “Blue”', cap: '<b>Step 3: keep only the taxis the witness would call Blue.</b> There are 12 + 17 = <b>29</b>. Only <b>12</b> of them are really Blue. 12 ÷ 29 = <b>41%</b>. It is actually <b>more likely the taxi was Green</b>.' },
      ],
      legend: { A: 'Blue, witness says Blue', B: 'Blue, witness says Green', C: 'Green, witness says Blue', D: 'Green, witness says Green' },
    },
    med: {
      name: 'Medical test', total: 1000, cols: 40, delay: 1,
      counts: { A: 9, B: 1, C: 89, D: 901 },
      correct: 9, intuitive: 90,
      okRange: [5, 14], s1Range: [85, 95],
      bins: [[0, 4], [5, 15], [16, 79], [80, 95], [96, 100]],
      goodBin: 1, s1Bin: 3,
      target: 'Ill', other: 'Healthy', flag: 'tests positive',
      story: `<p>A screening test is used to check people for a disease that has no symptoms in its early stages.</p>
        <ul><li><b>1%</b> of the people being tested have the disease.</li>
        <li>If a person <b>has</b> the disease, the test comes back positive <b>90%</b> of the time.</li>
        <li>If a person does <b>not</b> have the disease, the test still comes back positive <b>9%</b> of the time.</li></ul>
        <p>You take the test and the result is <b>positive</b>.</p>`,
      question: 'What is the probability that you <b>actually have the disease</b>?',
      relyOpts: [
        ['witness', 'Mainly how accurate the test is (90%)'],
        ['base', 'Mainly how rare the disease is (1%)'],
        ['both', 'I combined both pieces of information'],
        ['guess', 'I mostly guessed'],
      ],
      intro0: 'Imagine <b>1,000 people</b> taking the test, one small dot each. Press step 1.',
      stages: [
        { btn: 'Base rate', cap: '<b>Step 1: the base rate.</b> Only 1% have the disease: <b>10</b> people out of 1,000. The other <b>990</b> are healthy.' },
        { btn: 'Test accuracy', cap: '<b>Step 2: apply the test to everyone.</b> Of the 10 ill people, <b>9</b> test positive (90%) and 1 is missed. Of the 990 healthy people, about <b>89</b> also test positive (9%). Ringed dots = positive result.' },
        { btn: 'Positives only', cap: '<b>Step 3: keep only the positive results.</b> There are 9 + 89 = <b>98</b>. Only <b>9</b> of them are really ill. 9 ÷ 98 = about <b>9%</b>. Most positive results are <b>false alarms</b>.' },
      ],
      legend: { A: 'Ill, tests positive', B: 'Ill, tests negative', C: 'Healthy, tests positive', D: 'Healthy, tests negative' },
    },
  };

  const MODE_PROB = { learn: 'taxi', teach: 'med' };

  const STYLE = `<style>
    .br-viz{--t:#2f7de1;--o:#35a262;margin:16px 0}
    .br-viz[data-prob="med"]{--t:var(--bad);--o:#8e98a3}
    .br-ctrl{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
    .br-ctrl .br-go.on{background:var(--accent);color:#fff;border-color:var(--accent)}
    .br-grid{display:grid;gap:5px;max-width:420px;padding:12px;background:var(--paper);border:1px solid var(--line);border-radius:14px}
    .br-grid.br-fine{gap:3px;max-width:620px;padding:10px}
    .br-dot{display:block;aspect-ratio:1;border-radius:50%;background:var(--line-2);transition:background .35s,opacity .35s,box-shadow .35s}
    .br-viz.st1 .br-A,.br-viz.st1 .br-B{background:var(--t)}
    .br-viz.st1 .br-C,.br-viz.st1 .br-D{background:var(--o)}
    .br-viz.st2 .br-A,.br-viz.st2 .br-C{box-shadow:0 0 0 2px var(--paper),0 0 0 4px var(--ink)}
    .br-viz.st2 .br-fine .br-A,.br-viz.st2 .br-fine .br-C{box-shadow:0 0 0 1.5px var(--ink)}
    .br-viz.st3 .br-B,.br-viz.st3 .br-D{opacity:.12}
    .br-legend{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:14px;margin:10px 0 0;color:var(--ink-2)}
    .br-legend span{display:inline-flex;align-items:center;gap:6px}
    .br-legend i{width:13px;height:13px;border-radius:50%;display:inline-block}
    .br-legend .ring{box-shadow:0 0 0 1.5px var(--paper),0 0 0 3px var(--ink)}
    .br-range{width:100%;max-width:520px;accent-color:var(--accent);height:32px}
    .br-out{font-family:var(--f-display);font-weight:900;font-size:56px;line-height:1;color:var(--accent);min-width:3ch}
    .br-scale{display:flex;justify-content:space-between;max-width:520px;font-family:var(--f-mono);font-size:12px;color:var(--muted)}
    .br-sum{font-family:var(--f-mono);font-size:15px;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin:12px 0}
  </style>`;

  /* ── Dot grid: one shared, stepable visual ───────────────── */
  function legendHTML(p, stage) {
    if (stage === 0) return '';
    if (stage === 1) {
      return `<span><i style="background:var(--t)"></i>${p.target}: ${p.counts.A + p.counts.B}</span>
        <span><i style="background:var(--o)"></i>${p.other}: ${p.counts.C + p.counts.D}</span>`;
    }
    const item = (k, col, ring) => `<span><i class="${ring ? 'ring' : ''}" style="background:${col}"></i>${p.legend[k]}: <b>${p.counts[k]}</b></span>`;
    return item('A', 'var(--t)', true) + item('C', 'var(--o)', true) + item('B', 'var(--t)', false) + item('D', 'var(--o)', false);
  }

  function setStage(viz, n) {
    const p = PROBS[viz.dataset.prob];
    viz.className = 'br-viz' + [1, 2, 3].filter(k => k <= n).map(k => ' st' + k).join('');
    viz.dataset.stage = n;
    viz.querySelectorAll('.br-go').forEach(b => b.classList.toggle('on', +b.dataset.go === n));
    viz.querySelector('.br-cap').innerHTML = n === 0 ? p.intro0 : p.stages[n - 1].cap;
    viz.querySelector('.br-legend').innerHTML = legendHTML(p, n);
  }

  function gridHTML(key, stage = 0) {
    const p = PROBS[key];
    let dots = '', i = 0;
    ['A', 'B', 'C', 'D'].forEach(k => {
      for (let n = 0; n < p.counts[k]; n++, i++) dots += `<i class="br-dot br-${k}" style="transition-delay:${i * p.delay}ms"></i>`;
    });
    const cls = 'br-viz' + [1, 2, 3].filter(k => k <= stage).map(k => ' st' + k).join('');
    return `${STYLE}<div class="${cls}" data-prob="${key}" data-stage="${stage}">
      <div class="br-ctrl">${p.stages.map((s, k) => `<button type="button" class="btn small ghost br-go ${k + 1 === stage ? 'on' : ''}" data-go="${k + 1}">${k + 1} · ${s.btn}</button>`).join('')}
        <button type="button" class="btn small ghost br-go" data-go="0">Reset</button></div>
      <div class="br-grid ${p.total > 100 ? 'br-fine' : ''}" style="grid-template-columns:repeat(${p.cols},1fr)">${dots}</div>
      <div class="br-legend">${legendHTML(p, stage)}</div>
      <div class="callout key br-cap">${stage === 0 ? p.intro0 : p.stages[stage - 1].cap}</div>
    </div>`;
  }

  // One delegated listener drives every grid (steps, host visual) wherever it is rendered.
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.br-go');
    if (!b) return;
    const viz = b.closest('.br-viz');
    if (viz) setStage(viz, +b.dataset.go);
  });

  /* ── Experiment ──────────────────────────────────────────── */
  function experiment(el, ctx) {
    const key = MODE_PROB[ctx.mode];
    const p = PROBS[key];
    let est = null;

    el.innerHTML = `${STYLE}
      <p class="kicker">One problem · take your time</p>
      <h2 class="screen-title">${key === 'taxi' ? 'The hit-and-run' : 'The positive test'}</h2>
      <div class="task-card">${p.story}</div>
      <div class="big-q">${p.question}</div>
      <div class="input-row"><div class="br-out" id="brOut">?</div><span class="muted">Drag the slider to give your estimate.</span></div>
      <input type="range" min="0" max="100" step="1" value="50" class="br-range" id="brRange" aria-label="Your estimate in percent">
      <div class="br-scale"><span>0%</span><span>50%</span><span>100%</span></div>
      <div class="btn-row"><button class="btn primary big" id="brLock" disabled>Lock in my estimate</button></div>
      <p class="muted" style="font-size:14.5px">No calculator needed. Give your best estimate. You’ll find out the answer on the next screen.</p>`;

    const range = el.querySelector('#brRange');
    const out = el.querySelector('#brOut');
    const lock = el.querySelector('#brLock');
    range.addEventListener('input', () => {
      est = +range.value;
      out.textContent = est + '%';
      lock.disabled = false;
    });
    lock.onclick = () => askRely();

    function askRely() {
      el.innerHTML = `${STYLE}
        <p class="kicker">One more question</p>
        <h2 class="screen-title">What did you base it on?</h2>
        <p class="prose">You answered <b>${est}%</b>. Which information did you rely on most?</p>
        <div class="choice-list">${p.relyOpts.map(([v, t]) => `<button class="choice" data-v="${v}">${t}</button>`).join('')}</div>`;
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => finish(b.dataset.v));
    }

    function finish(rely) {
      ctx.pool.add({ prob: key, est, rely });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">Estimate locked in</h2>
        <p class="prose">Press <b>Next</b> to see the correct answer and how it compares with your estimate.</p>`;
      ctx.done({ prob: key, est, rely });
    }
  }

  /* ── Reveal ──────────────────────────────────────────────── */
  const inRange = (x, [lo, hi]) => x >= lo && x <= hi;

  function reveal(res, ctx) {
    const p = PROBS[res.prob];
    const pool = ctx.pool.all().filter(r => r.prob === res.prob);
    const ests = pool.map(r => r.est);
    const med = util.median(ests);
    const binCounts = p.bins.map(b => ests.filter(x => inRange(x, b)).length);
    const s1Pct = util.pct(binCounts[p.s1Bin], ests.length);
    const okPct = util.pct(ests.filter(x => inRange(x, p.okRange)).length, ests.length);
    const flagged = p.counts.A + p.counts.C;

    let verdict;
    if (inRange(res.est, p.okRange)) verdict = `You were close to the right answer. That is unusual: most people give a number near <b>${p.intuitive}%</b>. You took the <b>base rate</b> into account${res.rely === 'both' ? ', and you say you combined both pieces of information, which is exactly what System 2 has to do' : ''}.`;
    else if (inRange(res.est, p.s1Range)) verdict = `You answered <b>${res.est}%</b>, very close to the ${res.prob === 'taxi' ? 'witness’s' : 'test’s'} accuracy. This is the most common answer by far, and it is the error this station is about. You judged how reliable the ${res.prob === 'taxi' ? 'witness' : 'test'} is and <b>ignored how ${res.prob === 'taxi' ? 'rare Blue taxis are' : 'rare the disease is'}</b>.`;
    else if (res.est > p.okRange[1]) verdict = `You answered <b>${res.est}%</b>, well above the correct <b>${p.correct}%</b>. Like most people, you gave too little weight to the <b>base rate</b>: ${res.prob === 'taxi' ? 'only 15% of taxis are Blue' : 'only 1% of people have the disease'}.`;
    else verdict = `You answered <b>${res.est}%</b>, below the correct <b>${p.correct}%</b>. You gave a lot of weight to the base rate, perhaps too much. Most people make the opposite mistake and answer about <b>${p.intuitive}%</b>.`;

    const labels = p.bins.map(([lo, hi], i) => `${lo}–${hi}%${i === p.goodBin ? ' (right area)' : i === p.s1Bin ? ` (${res.prob === 'taxi' ? 'witness' : 'test'} accuracy)` : ''}`);

    return `${STYLE}
      <div class="stat-row">
        ${ui.stat(res.est + '%', 'your estimate', inRange(res.est, p.okRange) ? 'good' : 's1')}
        ${ui.stat(p.correct + '%', 'correct answer', 's2')}
        ${ui.stat(p.intuitive + '%', 'the most common answer')}
      </div>
      ${ui.callout('key', verdict)}
      <div class="br-sum">${res.prob === 'taxi'
        ? `Witness says “Blue” for <b>${flagged}</b> taxis out of 100 → only <b>${p.counts.A}</b> are really Blue → ${p.counts.A} ÷ ${flagged} = <b>41%</b>`
        : `<b>${flagged}</b> people out of 1,000 test positive → only <b>${p.counts.A}</b> are really ill → ${p.counts.A} ÷ ${flagged} = <b>9%</b>`}</div>
      <p>${ctx.mode === 'learn' ? 'The next screen shows' : 'Your host will now show you'} where this number comes from, one dot at a time.</p>
      <h3>Everyone at this station so far (${p.name.toLowerCase()} problem)</h3>
      <div class="stat-row">
        ${ui.stat(Number.isFinite(med) ? util.fmt(med) + '%' : '–', 'median estimate')}
        ${ui.stat(s1Pct + '%', `answered ${p.s1Range[0]}–${p.s1Range[1]}%`, 's1')}
        ${ui.stat(okPct + '%', `answered ${p.okRange[0]}–${p.okRange[1]}%`, 'good')}
      </div>
      ${ui.bars(p.bins.map((b, i) => ({
        label: labels[i], value: binCounts[i], max: Math.max(1, ...binCounts),
        text: binCounts[i] + '', cls: i === p.goodBin ? 'good' : i === p.s1Bin ? 's1' : 'muted',
      })))}
      ${ui.poolNote(pool.length)}`;
  }

  DPT.register({
    id: 'baserate', num: 8, hue: 190, minutes: 15,
    title: 'The Taxi Witness',
    bias: 'Base-rate neglect',
    hook: 'A reliable witness says the taxi was Blue. So it was probably Blue. Wasn’t it?',
    intro: {
      learn: `<p>You’ll read one short problem about a hit-and-run accident and a witness, then estimate a probability.</p>
        <p>This is the <b>taxi-cab problem</b>, created by Amos Tversky and Daniel Kahneman. It shows how System 1 handles statistics, and why even a “reliable” piece of evidence can mislead you.</p>`,
      teach: `<p><b>Host tip:</b> your guest gets a <b>different problem</b> from the one you did: a medical test instead of a taxi. The structure is identical. Watch whether their estimate lands near the test’s accuracy (about 90%).</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'The answer, one dot at a time',
        render(el, res) {
          el.innerHTML = `<p>The easiest way to see the answer is to stop thinking in percentages and <b>count</b>. Press the steps in order.</p>
            ${gridHTML('taxi', 0)}
            ${ui.steps([
              `Start with the <b>base rate</b>: out of 100 taxis, <b>15 Blue</b> and <b>85 Green</b>.`,
              `The witness is right 80% of the time <i>for every taxi</i>. So they call <b>12</b> of the Blue taxis “Blue” (correct) and <b>17</b> of the Green taxis “Blue” (wrong).`,
              `The witness said “Blue”, so the taxi must be one of those <b>29</b>. Only <b>12 of the 29</b> are really Blue.`,
              `12 ÷ 29 = <b>41%</b>. Even with a good witness, the taxi was <b>more likely Green</b>, because there are so many more Green taxis for the witness to get wrong.`,
            ])}
            ${ui.callout('note', `You answered <b>${res.est}%</b>${res.prob === 'taxi' ? '' : ' on the medical version'}. The typical answer is <b>80%</b>, which is just the witness’s accuracy with the base rate thrown away.`)}`;
        },
      },
      {
        kicker: 'System 1’s shortcut', title: 'You answered an easier question',
        html: res => `<p>The question was: <i>“What is the probability the taxi was Blue?”</i> That is hard. It needs two pieces of information combined. Most people quietly answer a different, easier question: <i>“How reliable is the witness?”</i> The answer to that is 80%, so they say 80%.${res.rely === 'witness' ? ' <b>You said you relied mainly on the witness</b>, which is exactly this.' : ''}</p>
          ${ui.s1s2(
            `<p><b>Swaps the question.</b> Replacing a hard question with an easy one is called <b>substitution</b>. It happens without you noticing, and the easy answer feels like the answer to the real question.</p><p><b>Loves the witness.</b> The witness is specific and vivid, and tells a causal story: <i>someone saw it</i>. The 85/15 split is dry, general and abstract. It doesn’t seem to explain anything about <i>this</i> accident, so System 1 drops it.</p>`,
            `<p><b>Combines both facts.</b> “How many taxis would the witness call Blue? Some real Blue ones, and quite a lot of wrongly-called Green ones, because there are so many Green taxis.”</p><p>That needs counting or calculation. It takes effort, so System 2 usually accepts System 1’s 80%.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> the witness’s 80% accuracy is real, but it isn’t the answer. It only becomes the answer once you combine it with <b>how common Blue taxis are to begin with</b>. System 1 skips that step.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Base-rate neglect',
        html: `${ui.define('Base-rate neglect', 'Ignoring or underweighting <b>general information about how common something is</b> (the base rate, or prior probability) when you are given <b>specific information about the individual case</b>, such as a witness report, a test result or a personality description.')}
          ${ui.steps([
            '<b>Situation:</b> you have a base rate (15% of taxis are Blue) and a specific piece of evidence (the witness says Blue).',
            '<b>System 1 shortcut:</b> focus on the specific, vivid evidence and substitute an easier question (“how reliable is the witness?”).',
            '<b>Result:</b> the estimate lands near the witness’s accuracy (80%) instead of the correct 41%.',
            '<b>System 2 failure:</b> combining the two numbers takes effort, and 80% already feels right, so it isn’t checked.',
          ])}
          ${ui.callout('tip', `<b>Why “base rate”?</b> It is the rate you start from, before any evidence about this case. A sensible judgement starts from the base rate and then adjusts for the evidence. Base-rate neglect jumps straight to the evidence.`)}`,
      },
      {
        kicker: 'The evidence', title: 'Key studies',
        html: `${ui.study({ name: 'Kahneman & Tversky (1973): engineers and lawyers', rows: [
            ['Method', 'Participants read short personality descriptions, supposedly picked at random from a group of 100 professionals. One group was told the 100 were <b>30 engineers and 70 lawyers</b>; the other group was told <b>70 engineers and 30 lawyers</b>. They judged the probability that each person was an engineer.'],
            ['Example', '“Jack” was described as a careful, conservative man with no interest in politics who enjoys home carpentry and mathematical puzzles.'],
            ['Findings', 'Judgements about Jack were <b>almost identical</b> in both groups, even though the base rate had flipped. People judged by how much Jack <b>resembled</b> an engineer. When they were given <b>no description</b>, they used the base rate correctly. When the description was bland and told them nothing useful, they tended to say 50%, again ignoring the base rate.'],
            ['Link', 'As soon as specific information appears, System 1 uses it and the base rate is set aside.'],
          ] })}
          ${ui.study({ name: 'Tversky & Kahneman (1980, 1982): the taxi problem', rows: [
            ['Method', 'Participants answered the taxi problem you just did.'],
            ['Findings', 'The most common (median) answer was <b>80%</b>, the witness’s accuracy. The correct answer is about 41%.'],
            ['Twist', 'In another version the base rate was made <b>causal</b>: the companies were the same size, but <b>85% of accidents</b> involved Green taxis. Now the base rate suggests a cause (reckless Green drivers), and people used it much more.'],
            ['Link', 'System 1 thinks in causes and stories. A base rate that fits a story gets used; a dry statistic gets ignored.'],
          ] })}`,
      },
      {
        kicker: 'Why it matters', title: 'Real life, and a simple fix',
        html: res => `<p>The same structure appears whenever something is <b>rare</b> and the evidence is <b>good but not perfect</b>. Here is a medical version${res.prob === 'med' ? ' (the one you did)' : ''}: 1% of people have a disease; the test catches 90% of them, but 9% of healthy people also test positive. Most people, and many doctors, say a positive result means about a 90% chance of disease.</p>
          ${gridHTML('med', 0)}
          ${ui.study({ name: 'Gigerenzer & Hoffrage (1995): natural frequencies', rows: [
            ['Method', 'Participants solved problems like these presented either as <b>probabilities</b> (“1%”, “80%”) or as <b>natural frequencies</b> (“10 out of 1,000 people…”).'],
            ['Findings', 'Correct answers rose from roughly <b>1 in 6</b> with probabilities to almost <b>half</b> with frequencies. Later training studies with doctors (Gigerenzer and colleagues) found a similar jump.'],
            ['Link', 'Counting dots is what System 1 is good at. Frequencies make the base rate visible, so the error shrinks.'],
          ] })}
          <h3>Where else?</h3>
          <ul>
            <li><b>Medical screening:</b> a positive result for a rare condition is often a false alarm. That is why positive screening results are followed up with a second test.</li>
            <li><b>Security and profiling:</b> a scanner or profile that flags 95% of real threats will still flag mostly innocent people, because innocent travellers massively outnumber threats.</li>
            <li><b>“Most car accidents happen close to home”:</b> most driving happens close to home, so this is what the base rate predicts. It doesn’t show local roads are more dangerous.</li>
            <li><b>Courts and juries:</b> a forensic match that is “99% accurate” sounds decisive, but how many people in the area could also match?</li>
          </ul>`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>The effect is <b>replicated</b> with many different problems (taxis, professions, medical tests) and with experts such as doctors, not just students.</li><li>It clearly fits dual process theory: the error is <b>systematic</b> (answers cluster near 80%), and presenting the numbers in a System 1-friendly way reduces it.</li><li>It has obvious <b>real-world importance</b>: medicine, law and security.</li></ul>`,
            `<ul><li><b>Artificial word problems:</b> real decisions rarely come as neat percentages. Participants may treat it as a maths puzzle, not a judgement.</li><li><b>Numeracy differs:</b> people who are more confident with numbers make fewer errors, so part of the effect may be maths skill, not a thinking bias.</li><li><b>Presentation matters:</b> Gigerenzer argues that frequency formats show people are not simply “irrational”; the problem is partly how the information is presented.</li><li>People <i>do</i> use base rates when they seem causal, so “neglect” is not the whole story.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> base-rate neglect is a clear example of <i>substitution</i> by System 1 and of System 1 ignoring information that isn’t vivid. You can use it to show how the <i>format</i> of information changes which system does the work.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The right answer, and the usual answer', hint: 'Taxi: correct ≈ <b>41%</b>, typical answer 80%. Medical: correct ≈ <b>9%</b>, typical answer about 90%.' },
        { point: 'Count it out with the dots', hint: 'Taxi: 15 Blue → 12 called Blue; 85 Green → 17 called Blue; 12 of 29 = 41%. Medical: 10 ill → 9 positive; 990 healthy → 89 positive; 9 of 98 ≈ 9%.' },
        { point: 'What System 1 did', hint: 'Answered an easier question (“how accurate is the witness / test?”). That is <b>substitution</b>. It focused on the vivid, specific evidence and dropped the dry base rate.' },
        { point: 'What System 2 would have done', hint: 'Combined the base rate with the accuracy, for example by imagining 100 or 1,000 cases and counting.' },
        { point: 'Name it: base-rate neglect', hint: 'Ignoring general information about how common something is in favour of specific information about the case.' },
        { point: 'The evidence', hint: 'Kahneman & Tversky (1973): Jack judged an engineer whether engineers were 30% or 70% of the group. Taxi problem: median answer 80%. A causal base rate gets used more.' },
        { point: 'The fix and the real world', hint: 'Gigerenzer & Hoffrage (1995): natural frequencies (“9 out of 98”) make correct answers far more common. Medical tests, airport security, juries.' },
      ],
      visual: res => `<p class="muted" style="margin:0 0 6px">Press the steps with your guest. Their problem was the ${res.prob === 'taxi' ? 'taxi' : 'medical'} version.</p>${gridHTML(res.prob, 0)}`,
      ask: [
        'What number did you give, and which fact did it come from?',
        'How many people in 1,000 would test positive, altogether?',
        'Why does the rarity of the disease matter so much?',
      ],
    },
    quiz: {
      core: [
        { q: 'Taxi problem: 85% of taxis are Green, 15% are Blue. A witness who is right 80% of the time says the taxi was Blue. What is the probability it really was Blue?', a: 'About 41%', d: ['About 80%', 'About 15%', 'About 68%'], why: 'Out of 100 taxis the witness calls 12 Blue taxis and 17 Green taxis “Blue”. 12 of 29 is about 41%.' },
        { q: 'What is <b>base-rate neglect</b>?', a: 'Ignoring how common something is in general, in favour of specific information about the case', d: ['Relying too heavily on the first number you hear when making an estimate', 'Judging how likely something is by how easily examples come to mind', 'Believing that two events together are more likely than one of them alone'], why: 'The base rate is the general, prior probability. System 1 drops it when vivid, specific evidence appears.' },
        { q: 'Most people answer “80%” on the taxi problem. Which System 1 process best explains this?', a: 'Substitution: answering “how reliable is the witness?” instead of the question asked', d: ['Careful calculation that combines the base rate with the witness’s accuracy', 'Anchoring on the first percentage mentioned in the problem, which was 85%', 'Deliberately distrusting the witness because witnesses are often wrong'], why: '80% is the witness’s accuracy. People swap the hard question for an easier one and give that answer.' },
        { q: 'In Kahneman & Tversky’s (1973) engineer/lawyer study, what happened when participants read the description of “Jack”?', a: 'Their estimates barely changed whether engineers made up 30% or 70% of the group', d: ['They used the base rate carefully and ignored the description', 'They judged Jack to be a lawyer whenever lawyers were the majority', 'They refused to estimate without knowing more about Jack’s job'], why: 'People judged how much Jack resembled an engineer. The base rate had almost no effect.' },
        { q: 'What did <b>Gigerenzer & Hoffrage (1995)</b> find?', a: 'Giving the numbers as natural frequencies (“12 out of 29”) made correct answers much more common', d: ['Experts such as doctors never made base-rate errors in any format', 'Adding a vivid story about the case made people use base rates more', 'Time pressure made people more accurate on probability problems'], why: 'Frequencies make the base rate visible, which suggests part of the problem is presentation.' },
        { q: 'Why does System 1 tend to ignore the base rate in the taxi problem?', a: 'It is abstract and statistical, while the witness is specific and gives a causal story', d: ['It is mentioned first, so it has been forgotten by the end', 'Base rates are always less accurate than eyewitness reports', 'People assume the percentages were invented by the experimenter'], why: 'System 1 prefers vivid, causal information. A dry statistic doesn’t seem to explain this particular accident.' },
        { q: 'Why is a positive result on an accurate test for a <b>rare</b> disease often a false alarm?', a: 'Healthy people vastly outnumber ill people, so even a small false-positive rate produces many false alarms', d: ['Accurate tests tend to become less reliable the more often they are used on patients', 'Ill people are much less likely to take a screening test than healthy people are', 'Doctors tend to misread results for rare diseases because they seldom see them'], why: 'Nine per cent of 990 healthy people is 89 false positives, against only 9 true positives.' },
        { q: 'Which is a <b>limitation</b> of the taxi problem as evidence for base-rate neglect?', a: 'It is an artificial word problem, and performance improves when the same numbers are given as frequencies', d: ['Statisticians disagree about the correct answer, so no answer can be marked wrong', 'It measures memory for numbers rather than any kind of judgement or reasoning', 'The witness in the problem was a real person, which made participants biased'], why: 'If the format changes the result so much, part of the “bias” may be about how the information is presented.' },
      ],
      extra: [
        { q: '1% of people have a disease. The test detects 90% of people who have it, and 9% of healthy people also test positive. You test positive. Roughly how likely is it that you have the disease?', a: 'About 9%', d: ['About 90%', 'About 50%', 'About 1%'], why: 'Out of 1,000: 9 true positives and about 89 false positives. 9 out of 98 is about 9%.' },
        { q: 'In one version of the taxi problem, the companies were the same size but <b>85% of accidents</b> involved Green taxis. What happened?', a: 'People used the base rate more, because it now suggested a cause', d: ['People ignored the base rate even more than in the original version', 'Almost everyone calculated the exact correct answer of 41%', 'People refused to answer because the information seemed contradictory'], why: 'A causal base rate (“Green drivers are reckless”) fits System 1’s love of stories, so it gets used.' },
        { q: 'An airport scanner flags 95% of real threats and 1% of harmless passengers. Real threats are extremely rare. Who are most of the flagged passengers?', a: 'Harmless passengers, because there are so many more of them to flag', d: ['Real threats, because the scanner catches 95% of them', 'Real threats, because a 1% error rate is very small', 'About half real threats and half harmless passengers'], why: '1% of millions of harmless passengers is far more than 95% of a handful of real threats.' },
        { q: '“Most car accidents happen within a few miles of home.” What is the best response?', a: 'Most driving happens near home, so most accidents would happen there even if local roads are no riskier', d: ['Drivers relax near home and take more risks, so local roads really are more dangerous', 'Roads near people’s homes are usually in worse condition than main roads are', 'Accidents near home are mostly minor, so they shouldn’t be counted in the figures'], why: 'The base rate of where people drive explains the statistic. No special danger is needed.' },
        { q: 'In the engineer/lawyer study, what did participants do when given <b>no description at all</b>?', a: 'They used the base rate correctly', d: ['They guessed 50% every time', 'They still ignored the base rate', 'They always chose “engineer”'], why: 'People can use base rates. They abandon them once any specific information, even useless information, is given.' },
      ],
    },
  });
})();
