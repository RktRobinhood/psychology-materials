/* Station 3: Anchoring bias. Tversky & Kahneman (1974) multiplication + Strack & Mussweiler (1997) Gandhi. */
(function () {
  const { ui, util } = DPT;
  const { fmt, median } = util;

  const TRUE_PRODUCT = 40320;
  const TRUE_AGE = 78;
  const SHOW_MS = 5000;

  const A = {
    asc: { name: 'ascending', expr: '1 × 2 × 3 × 4 × 5 × 6 × 7 × 8', orig: 512, partial: ['1 × 2 = 2', '× 3 = 6', '× 4 = 24', '× 5 = 120'] },
    desc: { name: 'descending', expr: '8 × 7 × 6 × 5 × 4 × 3 × 2 × 1', orig: 2250, partial: ['8 × 7 = 56', '× 6 = 336', '× 5 = 1,680', '× 4 = 6,720'] },
  };
  const B = {
    low: { name: 'low anchor (9)', anchor: 9, orig: 50.1 },
    high: { name: 'high anchor (140)', anchor: 140, orig: 66.7 },
  };

  /* Random assignment, balanced: the smaller group on this laptop gets the next person; ties are a coin flip. */
  function assign(rows, key, x, y) {
    const nx = rows.filter(r => r[key] === x).length;
    const ny = rows.filter(r => r[key] === y).length;
    if (nx < ny) return x;
    if (ny < nx) return y;
    return util.coin() ? x : y;
  }

  const STYLE = `<style>.anc-flash{font-family:var(--f-mono);font-size:clamp(24px,5vw,42px);font-weight:700;text-align:center;padding:34px 10px;letter-spacing:.02em}.anc-count{font-family:var(--f-display);font-weight:900;font-size:44px;text-align:center;color:var(--accent);line-height:1}.anc-bar{height:10px;background:var(--line);border-radius:999px;overflow:hidden;margin:12px 0}.anc-bar>div{height:100%;background:var(--accent);transform-origin:left;transition:transform ${SHOW_MS}ms linear}.anc-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0}.anc-col{background:var(--paper);border:2px solid var(--line-2);border-radius:14px;padding:12px 16px}.anc-col.me{border-color:var(--accent)}.anc-col h4{margin:0 0 6px;font-family:var(--f-mono);font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}.anc-col .ex{font-family:var(--f-mono);font-weight:700;font-size:15px;margin-bottom:6px}.anc-col ol{margin:0;padding-left:1.3em;font-family:var(--f-mono);font-size:15px}.anc-col .stop{color:var(--muted);font-size:13.5px;margin-top:6px}@media (max-width:680px){.anc-cols{grid-template-columns:1fr}}</style>`;

  function experiment(el, ctx) {
    const rows = ctx.pool.all();
    const condA = assign(rows, 'a', 'asc', 'desc');
    const condB = assign(rows, 'b', 'low', 'high');
    const res = { mode: ctx.mode, a: { cond: condA }, b: { cond: condB } };

    function partAIntro() {
      el.innerHTML = `${STYLE}<p class="exp-progress">Part 1 of 2</p>
        <h2 class="screen-title">A quick estimate</h2>
        <div class="prose">
          <p>When you press the button, a multiplication will appear for <b>5 seconds</b>, then disappear.</p>
          <p>You won't have time to work it out. Don't try to calculate it fully. Just look at it and then give your <b>best quick estimate</b> of the answer.</p>
        </div>
        <div class="btn-row"><button class="btn primary big" id="ancShow">Show me</button></div>`;
      el.querySelector('#ancShow').onclick = partAFlash;
    }

    function partAFlash() {
      el.innerHTML = `${STYLE}<p class="exp-progress">Part 1 of 2 · look now</p>
        <div class="task-card"><div class="anc-flash">${A[condA].expr} = ?</div></div>
        <div class="anc-bar"><div id="ancBar"></div></div>
        <div class="anc-count" id="ancCount">5</div>`;
      const bar = el.querySelector('#ancBar');
      const count = el.querySelector('#ancCount');
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = 'scaleX(0)'; }));
      const t0 = performance.now();
      const h = setInterval(() => {
        const left = SHOW_MS - (performance.now() - t0);
        if (left <= 0) { clearInterval(h); partAEstimate(); return; }
        count.textContent = Math.ceil(left / 1000);
      }, 100);
    }

    function partAEstimate() {
      el.innerHTML = `${STYLE}<p class="exp-progress">Part 1 of 2</p>
        <h2 class="screen-title">Your estimate</h2>
        <p class="prose">What is your best estimate of the answer to the multiplication you just saw?</p>
        <div class="input-row"><input class="input" id="ancA" inputmode="numeric" autocomplete="off" placeholder="Your estimate">
          <button class="btn primary" id="ancAGo" disabled>Submit</button></div>
        <p class="muted" style="font-size:14.5px">No feedback yet. You'll see how you did at the end.</p>`;
      const box = el.querySelector('#ancA');
      const go = el.querySelector('#ancAGo');
      const valid = () => util.num(box.value) > 0;
      box.oninput = () => { go.disabled = !valid(); };
      box.onkeydown = e => { if (e.key === 'Enter' && valid()) submit(); };
      go.onclick = submit;
      box.focus();
      function submit() { res.a.est = util.num(box.value); partBAnchor(); }
    }

    function partBAnchor() {
      el.innerHTML = `<p class="exp-progress">Part 2 of 2</p>
        <h2 class="screen-title">A general knowledge question</h2>
        <div class="task-card big-q">Did Mahatma Gandhi die <b>before</b> or <b>after</b> the age of <b>${B[condB].anchor}</b>?</div>
        <div class="choice-grid">
          <button class="choice" data-v="before">Before the age of ${B[condB].anchor}</button>
          <button class="choice" data-v="after">After the age of ${B[condB].anchor}</button>
        </div>`;
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => { res.b.side = b.dataset.v; partBEstimate(); });
    }

    function partBEstimate() {
      el.innerHTML = `<p class="exp-progress">Part 2 of 2</p>
        <h2 class="screen-title">One more</h2>
        <div class="task-card big-q">How old was Mahatma Gandhi when he died?</div>
        <div class="input-row"><input class="input" id="ancB" inputmode="numeric" autocomplete="off" placeholder="Age in years">
          <span class="muted">years</span>
          <button class="btn primary" id="ancBGo" disabled>Submit</button></div>
        <p class="muted" style="font-size:14.5px">If you're not sure, give your best guess.</p>`;
      const box = el.querySelector('#ancB');
      const go = el.querySelector('#ancBGo');
      const valid = () => { const n = util.num(box.value); return n > 0 && n < 150; };
      box.oninput = () => { go.disabled = !valid(); };
      box.onkeydown = e => { if (e.key === 'Enter' && valid()) submit(); };
      go.onclick = submit;
      box.focus();
      function submit() { res.b.est = util.num(box.value); finish(); }
    }

    function finish() {
      ctx.pool.add({ mode: res.mode, a: res.a.cond, aEst: res.a.est, b: res.b.cond, bEst: res.b.est });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">Both estimates recorded</h2>
        <p class="prose">Press <b>Next</b>. You'll find out that not everyone saw the same questions as you.</p>`;
      ctx.done(res);
    }

    partAIntro();
  }

  /* Pooled station data: medians per condition. */
  function poolStats(ctx) {
    const rows = ctx.pool.all();
    const pick = (key, cond, est) => rows.filter(r => r[key] === cond && Number.isFinite(r[est])).map(r => r[est]);
    const aAsc = pick('a', 'asc', 'aEst'), aDesc = pick('a', 'desc', 'aEst');
    const bLow = pick('b', 'low', 'bEst'), bHigh = pick('b', 'high', 'bEst');
    return {
      n: rows.length,
      aAsc: { n: aAsc.length, med: median(aAsc) }, aDesc: { n: aDesc.length, med: median(aDesc) },
      bLow: { n: bLow.length, med: median(bLow) }, bHigh: { n: bHigh.length, med: median(bHigh) },
    };
  }
  const medText = g => g.n ? fmt(g.med) : 'no data yet';

  function effectNote(lowG, highG, highName) {
    if (!lowG.n || !highG.n) return `<p class="muted" style="font-size:15px">Only one group has data so far. The comparison appears once someone from the other group has taken part.</p>`;
    if (highG.med > lowG.med) return `<p>At this station, the <b>${highName}</b> group's typical estimate is <b>higher</b> (${fmt(highG.med)} vs ${fmt(lowG.med)}). Same question, different starting number, different answers. That gap <b>is</b> the anchoring effect.</p>`;
    return `<p>At this station the two groups aren't (yet) different in the expected direction. With only a few people, one unusual answer can swing the median. The original studies used much bigger samples.</p>`;
  }

  function reveal(res, ctx) {
    const ca = A[res.a.cond], cb = B[res.b.cond];
    const other = A[res.a.cond === 'asc' ? 'desc' : 'asc'];
    const otherB = B[res.b.cond === 'low' ? 'high' : 'low'];
    const s = poolStats(ctx);
    const aPct = Math.round((res.a.est / TRUE_PRODUCT) * 100);

    return `${STYLE}
      ${ui.callout('key', `<b>Surprise:</b> this station runs a <b>between-subjects experiment</b>. The laptop randomly put you into one group for each part. People in the other group saw a different version, and nobody is told which group they were in until now.`)}

      <h3>Part 1: the multiplication</h3>
      <p>You were in the <b>${ca.name}</b> group and saw <b>${ca.expr}</b>. The other group saw <b>${other.expr}</b>. It's the same calculation.</p>
      <div class="stat-row">
        ${ui.stat(fmt(res.a.est), 'your estimate', 's1')}
        ${ui.stat(fmt(TRUE_PRODUCT), 'true answer', 'good')}
        ${ui.stat(fmt(ca.orig), `original median, ${ca.name} group`)}
      </div>
      ${res.a.est < TRUE_PRODUCT ? `<p>Your estimate was about <b>${aPct}%</b> of the real answer. Almost everyone underestimates, and people who see the small numbers first underestimate most.</p>` : `<p>You estimated at or above the true answer, which is unusual. Most people guess far too low.</p>`}
      <p><b>Everyone at this station so far (median estimate):</b></p>
      ${ui.bars([
        { label: `Ascending 1 × 2 × … (n = ${s.aAsc.n})`, value: s.aAsc.med || 0, max: Math.max(s.aAsc.med || 0, s.aDesc.med || 0, 1), text: medText(s.aAsc), cls: 's2' },
        { label: `Descending 8 × 7 × … (n = ${s.aDesc.n})`, value: s.aDesc.med || 0, max: Math.max(s.aAsc.med || 0, s.aDesc.med || 0, 1), text: medText(s.aDesc), cls: 's1' },
      ])}
      ${effectNote(s.aAsc, s.aDesc, 'descending')}
      <p class="muted" style="font-size:15px">Tversky &amp; Kahneman (1974): ascending median 512, descending median 2,250. True answer 40,320.</p>

      <h3>Part 2: Gandhi</h3>
      <p>You were asked whether Gandhi died before or after the age of <b>${cb.anchor}</b>. The other group was asked about <b>${otherB.anchor}</b>. Both numbers are obviously wrong.</p>
      <div class="stat-row">
        ${ui.stat(fmt(res.b.est), 'your estimate', 's1')}
        ${ui.stat(TRUE_AGE, 'true age at death', 'good')}
        ${ui.stat(fmt(cb.orig, 1), `original mean, ${cb.name}`)}
      </div>
      <p><b>Everyone at this station so far (median estimate):</b></p>
      ${ui.bars([
        { label: `Asked about 9 (n = ${s.bLow.n})`, value: s.bLow.med || 0, max: 100, text: medText(s.bLow), cls: 's2' },
        { label: `Asked about 140 (n = ${s.bHigh.n})`, value: s.bHigh.med || 0, max: 100, text: medText(s.bHigh), cls: 's1' },
        { label: 'True answer', value: TRUE_AGE, max: 100, text: String(TRUE_AGE), cls: 'good' },
      ])}
      ${effectNote(s.bLow, s.bHigh, 'high anchor (140)')}
      <p class="muted" style="font-size:15px">Strack &amp; Mussweiler (1997): mean estimate 50.1 after the anchor 9, and 66.7 after the anchor 140.</p>
      ${ui.poolNote(s.n)}
      ${ui.callout('s1', `<b>Why this matters:</b> you couldn't feel the anchor working. On your own, your estimate just seemed like a sensible guess. The bias only becomes visible when you compare the two groups.`)}`;
  }

  function partialCols(res) {
    const me = res ? res.a.cond : null;
    return ['asc', 'desc'].map(k => `<div class="anc-col ${me === k ? 'me' : ''}"><h4>${A[k].name}${me === k ? ' (you)' : ''}</h4>
      <div class="ex">${A[k].expr}</div>
      <ol>${A[k].partial.map(p => `<li>${p}</li>`).join('')}</ol>
      <div class="stop">…time's up → adjust upwards from here<br>Original median: <b>${fmt(A[k].orig)}</b></div></div>`).join('');
  }

  DPT.register({
    id: 'anchoring', num: 3, hue: 350, minutes: 15,
    title: 'The First Number Wins',
    bias: 'Anchoring bias',
    hook: 'Five seconds to estimate a sum. The order of the numbers changes your answer by thousands.',
    intro: {
      learn: `<p>You'll make two quick estimates: one maths problem you only see for five seconds, and one general knowledge question.</p>
        <p>There's more going on than it looks. You'll find out what afterwards.</p>`,
      teach: `<p><b>Host tip:</b> don't tell your guest which group they are in, or that there are groups at all. The laptop assigns them at random, which might be different from the group you were in. Watch how long they spend on the estimates.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'Five seconds is not enough',
        html: res => `${STYLE}
          <p>The true answer is <b>40,320</b>. Nobody can multiply eight numbers in five seconds, so everyone does the same thing: work out the first few steps, then guess upwards from there.</p>
          <div class="anc-cols">${partialCols(res)}</div>
          ${ui.steps([
            `In five seconds most people get through <b>three or four steps</b>.`,
            `Starting with <b>8 × 7 × 6</b>, you already have hundreds or thousands in your head. Starting with <b>1 × 2 × 3</b>, you only have single or double figures.`,
            `That partial answer becomes your <b>anchor</b>, the starting point for your guess.`,
            `You then <b>adjust upwards</b>, because you know there are more numbers. But you stop too soon. Both groups end up far below 40,320, and the ascending group ends up lowest.`,
          ])}
          ${ui.callout('key', `<b>The key point:</b> the two versions are mathematically identical. The only difference is which numbers you saw first. If people were reasoning carefully, the order wouldn't matter.`)}`,
      },
      {
        kicker: 'System 1’s shortcut', title: 'Anchor, then adjust (not enough)',
        html: `<p>Tversky and Kahneman called this the <b>anchoring and adjustment heuristic</b>. When we have to estimate something we don't know, we start from whatever number is available and adjust away from it. The adjustment is almost always <b>insufficient</b>, so the final answer stays close to the anchor.</p>
          ${ui.s1s2(
            `<ul><li>Grabs the first number available (the partial product, or 9 / 140) as a starting point.</li><li>Adjusts until the answer seems <b>plausible</b>, then stops.</li><li>With Gandhi, comparing him with the anchor brings to mind facts that fit that number (“he was assassinated” fits young; “he was a frail old man” fits old).</li><li>Feels like an honest, independent guess.</li></ul>`,
            `<ul><li>Would ignore the anchor completely, since 9 and 140 are obviously irrelevant.</li><li>Would build an estimate from real knowledge: “8! is 8 × 5,040, so about 40,000.”</li><li>Would ask: “What would I have guessed if I'd never seen that number?”</li><li>Takes effort, so it rarely happens.</li></ul>`
          )}
          ${ui.callout('s1', `<b>Why the Gandhi result is so striking:</b> everyone knows Gandhi didn't die at 9 or live to 140. System 2 correctly rejects the anchor (you probably said “after 9” or “before 140”). But the number has already done its work: System 1 used it as the starting point for the next estimate.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Anchoring bias',
        html: `${ui.define('Anchoring bias', 'The tendency to rely too heavily on the <b>first piece of information</b> we receive (the <b>anchor</b>) when making a judgement or estimate. We adjust away from the anchor, but <b>not far enough</b>, even when the anchor is random or obviously irrelevant.')}
          ${ui.steps([
            '<b>Situation:</b> you have to estimate a number and you don’t know the answer.',
            '<b>System 1 shortcut:</b> start from whatever number is in front of you and adjust.',
            '<b>Result:</b> estimates are pulled towards the anchor. High anchor, high estimate; low anchor, low estimate.',
            '<b>System 2 failure:</b> the adjustment stops once the answer seems reasonable, so it stays too close to the anchor.',
          ])}
          ${ui.callout('note', `<b>Between-subjects design:</b> anchoring is measured by comparing two <b>randomly assigned</b> groups who see different anchors. Random assignment means the anchor is the only systematic difference between them, so the difference in estimates can be put down to the anchor.`)}`,
      },
      {
        kicker: 'The evidence', title: 'Three key studies',
        html: `${ui.study({ name: 'Tversky & Kahneman (1974)', rows: [
            ['Aim', 'To show that estimates are pulled towards a starting value.'],
            ['Method', 'High school students had <b>5 seconds</b> to estimate either 1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 or 8 × 7 × 6 × 5 × 4 × 3 × 2 × 1.'],
            ['Findings', 'Median estimate: <b>512</b> (ascending) vs <b>2,250</b> (descending). The true answer is <b>40,320</b>.'],
            ['Link', 'Participants anchored on the first few steps and adjusted too little. The first numbers seen shaped the answer.'],
          ] })}
          ${ui.study({ name: 'Strack & Mussweiler (1997)', rows: [
            ['Aim', 'To test whether even implausible anchors affect judgements.'],
            ['Method', 'Participants were asked whether Gandhi died before or after the age of <b>9</b> or <b>140</b>, and then asked to estimate his age at death.'],
            ['Findings', 'Mean estimate: <b>50.1</b> years after the anchor 9 vs <b>66.7</b> years after the anchor 140. (He died at 78.)'],
            ['Link', 'An anchor works even when people know it is absurd. System 2 rejects it, but System 1 still uses it as a starting point.'],
          ], note: 'Caution: the original study also used plausible anchors (numbers close to the true answer) and several other questions besides Gandhi. Textbook summaries often report only the most striking part. When you cite a study, be aware you may be reading a simplified version.' })}
          ${ui.study({ name: 'Englich, Mussweiler & Strack (2006)', rows: [
            ['Aim', 'To test whether anchors affect experts making real-world style decisions.'],
            ['Method', 'Experienced legal professionals read about a woman caught shoplifting. Before deciding her sentence they rolled a pair of dice, which were <b>loaded</b> to land on either <b>3</b> or <b>9</b>.'],
            ['Findings', 'Those who rolled 9 gave longer sentences, about <b>8 months</b>, than those who rolled 3, about <b>5 months</b>.'],
            ['Link', 'A number that was obviously random still anchored a serious judgement, even in trained experts.'],
          ] })}`,
      },
      {
        kicker: 'Why we do it', title: 'Why does System 1 anchor?',
        html: `<p>Anchoring isn't laziness for its own sake. It happens because of the situations we are in when we make judgements:</p>
          ${ui.steps([
            `<b>We lack knowledge.</b> If you don't know the answer, you need a starting point from somewhere. The anchor is the easiest one available.`,
            `<b>We are cognitive misers.</b> Building an estimate from scratch takes effort. Starting from a number that's already there reduces cognitive load.`,
            `<b>Time pressure.</b> With little time (like your 5 seconds), there's no chance for System 2 to work through the problem, so the first number wins.`,
            `<b>Mental tiredness.</b> After lots of decisions, people have less energy for effortful thinking (sometimes called ego depletion), so they rely more on shortcuts.`,
            `<b>Mood and social pressure.</b> A good mood, or wanting to seem agreeable (for example, not wanting to insult a seller), makes people less likely to question the first figure.`,
          ])}
          ${ui.callout('s1', `<b>Put simply:</b> System 1 grabs the anchor because it saves effort, and System 2 doesn't adjust far enough because adjusting is effortful too.`)}`,
      },
      {
        kicker: 'Real life', title: 'Anchors are everywhere',
        html: `<div class="two-col">
            <div class="card"><b>Bargaining in a market</b><br>The seller names a high first price. Everything after that is judged against it, so a price that is still high can feel like a good deal. Whoever names the first number sets the anchor.</div>
            <div class="card"><b>Menu design</b><br>A very expensive dish near the top makes the other dishes seem reasonable in comparison. It may exist mainly to anchor you, not to be ordered.</div>
            <div class="card"><b>“Was £200, now £99”</b><br>The crossed-out price is an anchor. You judge the £99 against £200, not against what the item is really worth.</div>
            <div class="card"><b>Salary and house prices</b><br>The first figure mentioned in a negotiation, or the asking price on a house, pulls the final agreed number towards it.</div>
          </div>
          ${ui.callout('tip', `<b>Resisting an anchor:</b> before you look at the price or the first offer, decide your own number. Or deliberately think of reasons why the anchor might be wrong in the other direction.`)}`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>Anchoring is one of the most <b>replicated</b> effects in psychology, found with many kinds of number and question.</li><li><b>Random assignment</b> to anchor conditions allows cause and effect to be tested.</li><li>Englich et al. show it also affects <b>experts</b> in a realistic, high-stakes task.</li></ul>`,
            `<ul><li><b>Real decisions have many other variables</b> (money, time, mood, liking the seller). In real life the anchor can't be isolated, so its effect is hard to measure.</li><li>People <b>can't report their own heuristics</b>. If asked, they give a sensible-sounding reason instead (rationalisation), so we can only infer the process.</li><li><b>Samples</b> are mostly Western university students, which limits generalisation.</li><li><b>Low motivation:</b> estimating Gandhi's age doesn't matter to participants, so they may not use System 2 at all.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Think about it:</b> your own station data probably has only a few people per group. Would you trust a difference between groups of five? This is why the original studies' sample sizes matter.`)}`,
      },
      {
        kicker: 'Exam focus', title: 'Writing about anchoring',
        html: `${ui.callout('tip', `<b>Exam tip:</b> a Paper 1 Section A question might ask you to <i>“Explain anchoring bias with reference to one example.”</i> Three moves:<ol><li><b>Describe</b> the bias: relying too much on the first number and adjusting too little.</li><li><b>Give an example</b>: a study (Tversky &amp; Kahneman, 1974; Strack &amp; Mussweiler, 1997) or a real-life case such as bargaining.</li><li><b>Explain why</b> it happens: System 1 grabs the anchor as a quick starting point because we are cognitive misers, and System 2 adjusts insufficiently.</li></ol>`)}
          ${ui.steps([
            `<b>Describe:</b> “Anchoring bias is the tendency to base an estimate on an initial value and then adjust away from it too little.”`,
            `<b>Example:</b> “In Tversky and Kahneman's study, students who saw 8 × 7 × 6… gave a median estimate of 2,250, but those who saw 1 × 2 × 3… estimated 512.”`,
            `<b>Explain:</b> “With only 5 seconds, System 1 computed the first steps and used that partial product as the anchor. Because System 2 did not have time to calculate, the adjustment was insufficient, so the group with larger first numbers gave larger estimates.”`,
          ])}
          ${ui.callout('warn', `<b>Common mistake:</b> describing the study in detail but never explaining <i>why</i> the bias happened. The “why” (System 1, cognitive miser, insufficient adjustment) is what makes it an explanation.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'Reveal the two groups', hint: 'Your guest was randomly put in one group. The other group saw the numbers in the <b>opposite order</b> (and 9 vs 140 for Gandhi). Same question, different anchor.' },
        { point: 'What System 1 did in part 1', hint: 'Worked out the first 3–4 steps in 5 seconds, used that as the <b>anchor</b>, then adjusted upwards <b>too little</b>. True answer 40,320.' },
        { point: 'Why Gandhi is surprising', hint: '9 and 140 are obviously wrong, and System 2 rejects them. But System 1 still uses them as a starting point for the estimate.' },
        { point: 'Name it: anchoring bias', hint: 'Relying too much on the first number you see, and adjusting away from it too little, even when it is random.' },
        { point: 'The two classic studies', hint: 'Tversky &amp; Kahneman (1974): median 512 vs 2,250. Strack &amp; Mussweiler (1997): mean 50.1 (anchor 9) vs 66.7 (anchor 140).' },
        { point: 'Why we anchor', hint: 'Lack of knowledge (need a starting point), cognitive miser, time pressure, mental tiredness, mood and social pressure.' },
        { point: 'Real life', hint: 'Englich et al. (2006): legal professionals rolled loaded dice (3 or 9); rolling 9 led to about 8 months’ sentence vs 5. Also market bargaining, menus, “was £200, now £99”.' },
        { point: 'One limitation', hint: 'Real decisions involve many variables so the anchor can’t be isolated; people can’t report their heuristics; mostly Western students; low motivation in lab tasks.' },
      ],
      visual: (res, ctx) => {
        const s = poolStats(ctx);
        return `${STYLE}<div class="anc-cols">${partialCols(res)}</div>
          <p style="margin:10px 0 4px"><b>Station data (median estimates)</b></p>
          ${ui.bars([
            { label: `Ascending (n = ${s.aAsc.n})`, value: s.aAsc.med || 0, max: Math.max(s.aAsc.med || 0, s.aDesc.med || 0, 1), text: medText(s.aAsc), cls: 's2' },
            { label: `Descending (n = ${s.aDesc.n})`, value: s.aDesc.med || 0, max: Math.max(s.aAsc.med || 0, s.aDesc.med || 0, 1), text: medText(s.aDesc), cls: 's1' },
            { label: `Gandhi, anchor 9 (n = ${s.bLow.n})`, value: s.bLow.med || 0, max: 100, text: medText(s.bLow), cls: 's2' },
            { label: `Gandhi, anchor 140 (n = ${s.bHigh.n})`, value: s.bHigh.med || 0, max: 100, text: medText(s.bHigh), cls: 's1' },
          ])}`;
      },
      ask: [
        'Did the number 9 (or 140) feel like it influenced you?',
        'What would you have guessed if you had never seen that number?',
        'Can you think of a time a first price or first offer affected what you paid?',
      ],
    },
    quiz: {
      core: [
        { q: 'What is <b>anchoring bias</b>?', a: 'Relying too heavily on the first number you see and adjusting away from it too little', d: ['Remembering the first and last items in a list better than the middle', 'Sticking with a decision because of the effort already put into it', 'Judging how likely something is by how easily examples come to mind'], why: 'The anchor is the starting point. Adjustment happens, but not enough.' },
        { q: 'In <b>Tversky &amp; Kahneman (1974)</b>, what were the median estimates for the ascending and descending sequences?', a: 'Ascending 512; descending 2,250', d: ['Ascending 2,250; descending 512', 'Both groups estimated about 40,000', 'Ascending 4,000; descending 8,000'], why: 'Seeing the larger numbers first produced a much bigger partial product to anchor on. Both groups were far below 40,320.' },
        { q: 'Why did <b>both</b> groups in Tversky &amp; Kahneman’s study underestimate so badly?', a: 'They worked out the first few steps, then adjusted upwards from that partial answer too little', d: ['They forgot how many numbers were in the sequence after it was hidden', 'They multiplied only the first and last numbers of the sequence', 'They thought the question was a trick and guessed a low number'], why: 'This is the anchoring-and-adjustment heuristic: start from the partial product, adjust insufficiently.' },
        { q: 'What did <b>Strack &amp; Mussweiler (1997)</b> show with the Gandhi question?', a: 'Even obviously implausible anchors (9 or 140) shifted people’s estimates of his age', d: ['Anchors only work when they are close to the true answer', 'People ignored the anchor once they realised it was absurd', 'Only the high anchor had any effect on the estimates'], why: 'Mean estimates were 50.1 (anchor 9) vs 66.7 (anchor 140), although both anchors were clearly wrong.' },
        { q: 'A car dealer first shows you a car for £30,000, then one for £18,000. The £18,000 car now seems cheap. This is best explained by…', a: 'anchoring: the £30,000 price became the reference point for judging the second car', d: ['confirmation bias: you looked only for reasons to buy the second car', 'the availability heuristic: the first car was easier to remember', 'framing: the second price was described in more positive words'], why: 'The first price anchors your sense of what a car costs, so the second is judged against it.' },
        { q: 'Why is anchoring usually explained as a <b>System 1</b> process?', a: 'Using an available number as a starting point is fast and saves effort, so the brain does it automatically', d: ['It only happens when people are deliberately working through a calculation', 'People can always explain exactly how the anchor affected their answer', 'It disappears completely when people are given enough time to think'], why: 'We are cognitive misers. The anchor is an effortless starting point; proper estimation takes System 2 effort.' },
        { q: 'Why do anchoring experiments <b>randomly assign</b> participants to high and low anchors?', a: 'So the anchor is the only systematic difference between the groups', d: ['So each participant can compare the two anchors directly', 'So participants can guess the aim and try harder', 'So the researchers can choose the most suitable people for each group'], why: 'Random assignment spreads other differences (knowledge, maths skill) evenly, so a difference in estimates can be put down to the anchor.' },
        { q: 'Which is a <b>limitation</b> of applying lab anchoring studies to real-life decisions?', a: 'Real decisions involve many other variables, so the effect of the anchor can’t be isolated', d: ['Anchoring has never been found outside the laboratory', 'Lab studies use too many participants for the results to be precise', 'People in lab studies always know which anchor group they are in'], why: 'In a shop or a negotiation, money, mood, time and liking the other person all play a part too.' },
      ],
      extra: [
        { q: 'In <b>Englich, Mussweiler &amp; Strack (2006)</b>, what happened after legal professionals rolled loaded dice?', a: 'Those who rolled 9 gave longer sentences than those who rolled 3 (about 8 vs 5 months)', d: ['Those who rolled 3 gave longer sentences than those who rolled 9', 'The dice had no effect because they were experts', 'Those who rolled 9 found the shoplifter not guilty'], why: 'A number that was clearly random still anchored a serious decision made by experienced professionals.' },
        { q: 'A restaurant puts a £95 lobster dish at the top of its menu, although it rarely sells. What is the most likely reason?', a: 'It acts as an anchor, making the other dishes seem reasonably priced', d: ['It confirms what customers already believe about the restaurant', 'It is easier to remember, so customers talk about it more', 'It tests which customers are willing to take financial risks'], why: 'Next to £95, a £28 main course feels moderate. The expensive dish anchors price judgements.' },
        { q: 'Your class data show a smaller anchoring effect than the original studies. Which explanation is <b>most</b> likely?', a: 'Small groups at one station make the medians unreliable', d: ['Anchoring no longer affects people living today', 'The true answer to 8 × 7 × … × 1 has changed', 'Students cannot be affected by numbers they see'], why: 'With a handful of people per group, one unusual answer can shift the median a lot. Sample size matters.' },
        { q: 'According to the explanations for anchoring, why would a seller at a busy market benefit from naming a price quickly and asking for a fast decision?', a: 'Time pressure leaves less chance for System 2 to question the first price', d: ['Buyers remember quick prices less well, so they pay more', 'Time pressure makes buyers more likely to use System 2', 'Fast decisions always lead to cheaper prices for the buyer'], why: 'With little time, the first number becomes the anchor and the adjustment away from it is small.' },
        { q: 'You read that Strack &amp; Mussweiler used “anchors of 9 and 140”. In fact the study also used plausible anchors and other questions. What is the best lesson from this?', a: 'Summaries can simplify studies, so check the original before relying on details', d: ['Studies with several conditions are always unreliable', 'Only the implausible anchors had any effect at all', 'The Gandhi question is not evidence for anchoring'], why: 'Textbooks report the most striking part of a study. A careful psychologist checks what the original actually did.' },
      ],
    },
  });
})();
