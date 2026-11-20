/* Station 5 — Framing effect: the disease outbreak problem. */
(function () {
  const { ui, util } = DPT;

  const SCENARIO = `<p>Your country is getting ready for the outbreak of a rare disease. If nothing is done, experts expect it to kill <b>600 people</b>.</p>
    <p>Health officials have proposed two programmes to fight it. The scientific estimates of what each programme would achieve are below.</p>`;

  // Two descriptions of exactly the same pair of outcomes.
  const FRAMES = {
    gain: {
      name: '“Saved” wording', short: 'saved',
      options: [
        { key: 'A', safe: true, text: '<b>Programme A:</b> 200 people will be <b>saved</b>.' },
        { key: 'B', safe: false, text: '<b>Programme B:</b> there is a 1/3 probability that 600 people will be <b>saved</b>, and a 2/3 probability that no one will be <b>saved</b>.' },
      ],
    },
    loss: {
      name: '“Die” wording', short: 'die',
      options: [
        { key: 'C', safe: true, text: '<b>Programme C:</b> 400 people will <b>die</b>.' },
        { key: 'D', safe: false, text: '<b>Programme D:</b> there is a 1/3 probability that nobody will <b>die</b>, and a 2/3 probability that 600 people will <b>die</b>.' },
      ],
    },
  };

  // Teach-mode bonus item: McNeil, Pauker, Sox & Tversky (1982), lung cancer treatment.
  const SURGERY = {
    pos: {
      name: 'survival wording',
      surgery: 'Of 100 people who have surgery, <b>90 survive</b> the operation and the month after it, <b>68 are alive</b> after one year, and <b>34 are alive</b> after five years.',
      radiation: 'Of 100 people who have radiation therapy, <b>all 100 survive</b> the treatment, <b>77 are alive</b> after one year, and <b>22 are alive</b> after five years.',
    },
    neg: {
      name: 'death wording',
      surgery: 'Of 100 people who have surgery, <b>10 die</b> during the operation or the month after it, <b>32 have died</b> by the end of one year, and <b>66 have died</b> by the end of five years.',
      radiation: 'Of 100 people who have radiation therapy, <b>none die</b> during the treatment, <b>23 have died</b> by the end of one year, and <b>78 have died</b> by the end of five years.',
    },
  };

  // Learn-mode bonus item: Levin & Gaeth (1988), minced beef.
  const MINCE = {
    pos: { name: '“75% lean” label', label: '75% lean' },
    neg: { name: '“25% fat” label', label: '25% fat' },
  };

  const other = f => (f === 'gain' ? 'loss' : 'gain');
  const optByKey = k => [...FRAMES.gain.options, ...FRAMES.loss.options].find(o => o.key === k);

  const STYLE = `<style>
    .f5-scale{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:14px 0 6px;max-width:560px}
    .f5-scale .choice{text-align:center;padding:12px 0;font-weight:800;font-size:19px}
    .f5-ends{display:flex;justify-content:space-between;max-width:560px;font-size:14px;color:var(--muted)}
    .f5-pack{display:inline-block;border:3px solid var(--line-2);border-radius:14px;padding:16px 26px;background:var(--paper);text-align:center;margin:6px 0 10px}
    .f5-pack b{display:block;font-family:var(--f-display);font-size:34px;line-height:1.1;color:var(--accent-ink)}
    .f5-pack span{font-size:14px;color:var(--muted)}
    .f5-table{width:100%;border-collapse:collapse;margin:14px 0;font-size:15.5px}
    .f5-table th{text-align:left;font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding:6px 8px}
    .f5-table td{padding:10px 8px;border-top:1px solid var(--line);vertical-align:top}
    .f5-eq{font-family:var(--f-display);font-weight:900;font-size:26px;color:var(--good);text-align:center;vertical-align:middle!important}
  </style>`;

  function experiment(el, ctx) {
    const first = util.coin() ? 'gain' : 'loss';
    const extraType = ctx.mode === 'teach' ? 'surgery' : 'mince';
    const extraFrame = util.coin() ? 'pos' : 'neg';
    const res = { mode: ctx.mode, first, second: other(first), extraType, extraFrame };
    const TOTAL = 3;

    function ask({ n, title, pre, options, lockText, onLock }) {
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Question ${n} of ${TOTAL}</p>
        <h2 class="screen-title">${title}</h2>
        ${pre}
        <div class="choice-list">${options.map((o, i) => `<button class="choice" data-i="${i}">${o.text}</button>`).join('')}</div>
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>${lockText || 'Lock in my choice'}</button></div>`;
      let picked = null;
      const lock = el.querySelector('#lock');
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => {
        picked = +b.dataset.i;
        el.querySelectorAll('.choice').forEach(x => x.classList.toggle('selected', x === b));
        lock.disabled = false;
      });
      lock.onclick = () => onLock(options[picked]);
    }

    function q1() {
      ask({
        n: 1, title: 'A public health decision',
        pre: `<div class="task-card">${SCENARIO}</div><p class="prose">Which programme would you choose? There is no trick and no extra information. Go with your honest preference.</p>`,
        options: FRAMES[first].options,
        onLock: o => { res.c1 = o.key; res.safe1 = o.safe; q2(); },
      });
    }

    function q2() {
      ask({
        n: 2, title: 'Same problem, different words',
        pre: `${ui.callout('key', `<b>This is the same disease and the same 600 people.</b> The officials have simply described the programmes in a different way. What would you choose now?`)}
          <div class="task-card">${SCENARIO}</div>`,
        options: FRAMES[res.second].options,
        onLock: o => { res.c2 = o.key; res.safe2 = o.safe; q3(); },
      });
    }

    function q3() {
      if (extraType === 'surgery') {
        const s = SURGERY[extraFrame];
        ask({
          n: 3, title: 'A treatment decision',
          pre: `<div class="task-card"><p>Imagine you have lung cancer and your doctor offers two treatments. Here are the results for people who had each treatment in the past:</p></div>
            <p class="prose">Which treatment would you choose?</p>`,
          options: [
            { key: 'surgery', text: `<b>Surgery.</b> ${s.surgery}` },
            { key: 'radiation', text: `<b>Radiation therapy.</b> ${s.radiation}` },
          ],
          onLock: o => { res.extraVal = o.key === 'surgery' ? 1 : 0; finish(); },
        });
        return;
      }
      const m = MINCE[extraFrame];
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Question 3 of ${TOTAL}</p>
        <h2 class="screen-title">A quick shopping judgement</h2>
        <p class="prose">You're buying minced beef for a lasagne. This is what the label on the packet says:</p>
        <div class="f5-pack"><b>${m.label}</b><span>minced beef · 500 grams</span></div>
        <p class="prose">Overall, how good do you expect this beef to be?</p>
        <div class="f5-scale">${[1, 2, 3, 4, 5, 6, 7].map(v => `<button class="choice" data-v="${v}">${v}</button>`).join('')}</div>
        <div class="f5-ends"><span>1 = very poor</span><span>7 = excellent</span></div>
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>Lock in my rating</button></div>`;
      let v = null;
      const lock = el.querySelector('#lock');
      el.querySelectorAll('.f5-scale .choice').forEach(b => b.onclick = () => {
        v = +b.dataset.v;
        el.querySelectorAll('.f5-scale .choice').forEach(x => x.classList.toggle('selected', x === b));
        lock.disabled = false;
      });
      lock.onclick = () => { res.extraVal = v; finish(); };
    }

    function finish() {
      ctx.pool.add({ first, safe1: res.safe1, safe2: res.safe2, extraType, extraFrame, extraVal: res.extraVal });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">All choices locked in</h2>
        <p class="prose">Press <b>Next</b> to see what you chose, what everyone else at this station chose, and why the wording matters so much.</p>`;
      ctx.done(res);
    }

    q1();
  }

  /* ── Helpers for the reveal and explanation ── */
  function verdictOf(res) {
    const gainSafe = res.first === 'gain' ? res.safe1 : res.safe2;
    const lossSafe = res.first === 'loss' ? res.safe1 : res.safe2;
    if (gainSafe && !lossSafe) return 'classic';
    if (!gainSafe && lossSafe) return 'reverse';
    return 'consistent';
  }

  function poolStats(pool) {
    const g = pool.filter(p => p.first === 'gain');
    const l = pool.filter(p => p.first === 'loss');
    return {
      g, l,
      gPct: util.pct(g.filter(p => p.safe1).length, g.length),
      lPct: util.pct(l.filter(p => p.safe1).length, l.length),
    };
  }
  const pctText = (p, n) => (n ? `${p}% of ${n} ${n === 1 ? "person" : "people"}` : 'no data yet');

  function equivalenceTable() {
    return `${STYLE}<table class="f5-table">
      <thead><tr><th>“Saved” wording</th><th></th><th>“Die” wording</th></tr></thead>
      <tbody>
        <tr><td><b>A:</b> 200 saved for certain</td><td class="f5-eq">=</td><td><b>C:</b> 400 die for certain<br><span class="muted">600 − 400 = 200 saved</span></td></tr>
        <tr><td><b>B:</b> 1/3 chance all 600 saved, 2/3 chance none saved</td><td class="f5-eq">=</td><td><b>D:</b> 1/3 chance nobody dies, 2/3 chance all 600 die</td></tr>
      </tbody></table>`;
  }

  function valueCurve() {
    return `<svg viewBox="0 0 340 230" role="img" aria-label="Prospect theory value curve: gentle for gains, steep for losses" style="width:100%;max-width:440px;display:block;margin:10px auto">
      <line x1="10" y1="115" x2="330" y2="115" style="stroke:var(--line-2);stroke-width:2"/>
      <line x1="170" y1="10" x2="170" y2="220" style="stroke:var(--line-2);stroke-width:2"/>
      <path d="M170 115 C 205 80, 250 62, 325 55" style="fill:none;stroke:var(--s2);stroke-width:4;stroke-linecap:round"/>
      <path d="M170 115 C 150 160, 120 195, 40 215" style="fill:none;stroke:var(--s1);stroke-width:4;stroke-linecap:round"/>
      <text x="325" y="108" text-anchor="end" style="fill:var(--muted);font-size:12px;font-family:var(--f-mono)">GAINS →</text>
      <text x="15" y="108" style="fill:var(--muted);font-size:12px;font-family:var(--f-mono)">← LOSSES</text>
      <text x="176" y="22" style="fill:var(--muted);font-size:12px;font-family:var(--f-mono)">feels good</text>
      <text x="176" y="214" style="fill:var(--muted);font-size:12px;font-family:var(--f-mono)">feels bad</text>
      <text x="250" y="45" text-anchor="middle" style="fill:var(--s2);font-size:13px;font-weight:700">flattens out</text>
      <text x="60" y="175" text-anchor="middle" style="fill:var(--s1);font-size:13px;font-weight:700">steep</text>
    </svg>`;
  }

  function reveal(res, ctx) {
    const v = verdictOf(res);
    const o1 = optByKey(res.c1), o2 = optByKey(res.c2);
    const tag = o => o.safe ? '<span class="pill s2">certain option</span>' : '<span class="pill s1">gamble</span>';
    let verdict;
    if (v === 'classic') verdict = `<b>You switched, in exactly the direction most people do.</b> With the “saved” wording you took the sure thing. With the “die” wording you took the gamble. The outcomes never changed. Only the words did.`;
    else if (v === 'reverse') verdict = `<b>You switched, but in the opposite direction to most people.</b> You gambled with the “saved” wording and played safe with the “die” wording. Either way, the same outcomes got two different answers from you, which is what a framing effect is.`;
    else verdict = `<b>You made the same kind of choice both times</b> (${res.safe1 ? 'the certain option' : 'the gamble'}). Seeing both versions one after the other makes it much easier to spot that they are the same, so this is common in the second question. The real test is the <b>first</b> question, where people only see one wording. That's what the class data below compares.`;

    const pool = ctx.pool.all();
    const ps = poolStats(pool);

    let extraHtml = '';
    if (res.extraType === 'mince') {
      const pos = pool.filter(p => p.extraType === 'mince' && p.extraFrame === 'pos');
      const neg = pool.filter(p => p.extraType === 'mince' && p.extraFrame === 'neg');
      const mp = util.mean(pos.map(p => p.extraVal)), mn = util.mean(neg.map(p => p.extraVal));
      extraHtml = `<h3>Question 3: the minced beef</h3>
        <p>You saw the <b>${MINCE[res.extraFrame].label}</b> label and gave it <b>${res.extraVal} out of 7</b>. Other visitors saw the other label. 75% lean and 25% fat are the same beef.</p>
        ${ui.bars([
          { label: '“75% lean” label: mean rating', value: pos.length ? mp : 0, max: 7, text: pos.length ? `${util.fmt(mp, 1)} (${pos.length} people)` : 'no data yet', cls: 's2' },
          { label: '“25% fat” label: mean rating', value: neg.length ? mn : 0, max: 7, text: neg.length ? `${util.fmt(mn, 1)} (${neg.length} people)` : 'no data yet', cls: 's1' },
        ])}`;
    } else {
      const pos = pool.filter(p => p.extraType === 'surgery' && p.extraFrame === 'pos');
      const neg = pool.filter(p => p.extraType === 'surgery' && p.extraFrame === 'neg');
      const sp = util.pct(pos.filter(p => p.extraVal === 1).length, pos.length);
      const sn = util.pct(neg.filter(p => p.extraVal === 1).length, neg.length);
      extraHtml = `<h3>Question 3: the treatment</h3>
        <p>You saw the <b>${SURGERY[res.extraFrame].name}</b> and chose <b>${res.extraVal ? 'surgery' : 'radiation therapy'}</b>. The two versions give exactly the same numbers: 90 survive means 10 die.</p>
        ${ui.bars([
          { label: 'Survival wording: chose surgery', value: sp, max: 100, text: pctText(sp, pos.length), cls: 's2' },
          { label: 'Death wording: chose surgery', value: sn, max: 100, text: pctText(sn, neg.length), cls: 's1' },
          { label: 'Original study: survival wording', value: 82, max: 100, text: '82%', cls: 'muted' },
          { label: 'Original study: death wording', value: 56, max: 100, text: '56%', cls: 'muted' },
        ])}`;
    }

    return `${STYLE}
      <table class="f5-table"><thead><tr><th>Question</th><th>Wording</th><th>You chose</th></tr></thead><tbody>
        <tr><td>1</td><td>${FRAMES[res.first].name}</td><td>${o1.key} ${tag(o1)}</td></tr>
        <tr><td>2</td><td>${FRAMES[res.second].name}</td><td>${o2.key} ${tag(o2)}</td></tr>
      </tbody></table>
      ${ui.callout('key', verdict)}
      <h3>Everyone at this station so far (question 1 only)</h3>
      <p>Each visitor is randomly given one wording first. Here's how often people chose the <b>certain</b> option:</p>
      ${ui.bars([
        { label: '“Saved” wording: chose A', value: ps.gPct, max: 100, text: pctText(ps.gPct, ps.g.length), cls: 's2' },
        { label: '“Die” wording: chose C', value: ps.lPct, max: 100, text: pctText(ps.lPct, ps.l.length), cls: 's1' },
      ])}
      ${ui.poolNote(pool.length)}
      <p><b>Original study (Tversky &amp; Kahneman, 1981):</b></p>
      ${ui.bars([
        { label: '“Saved” wording: chose A', value: 72, max: 100, text: '72%', cls: 'muted' },
        { label: '“Die” wording: chose C', value: 22, max: 100, text: '22%', cls: 'muted' },
      ])}
      ${extraHtml}`;
  }

  DPT.register({
    id: 'framing', num: 5, hue: 280, minutes: 15,
    title: 'Saved or Lost?',
    bias: 'Framing effect',
    hook: '200 people saved or 400 people die? Same numbers, different words, and most people change their answer.',
    intro: {
      learn: `<p>You'll make three quick decisions: two about a public health emergency and one about food shopping.</p>
        <p>There are no right or wrong answers in the experiment itself. Just choose what you honestly prefer. Afterwards you'll see how the <b>wording</b> of a choice can steer people towards one option or the other.</p>`,
      teach: `<p><b>Host tip:</b> the computer randomly gives your guest either the “saved” or the “die” wording first. Watch whether they go for the <b>certain</b> option or the <b>gamble</b>, and whether they switch when they see the other wording. Question 3 (a cancer treatment) is new: you haven't seen it.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'Four programmes, only two outcomes',
        html: res => `<p>Programmes A, B, C and D sounded like four different plans. In fact there were only <b>two</b> plans, each described in two ways. Let's check the maths.</p>
          ${ui.steps([
            `600 people are at risk. Every “saved” number and every “die” number must add up to <b>600</b>.`,
            `<b>A:</b> 200 saved. So 600 − 200 = <b>400 die</b>. That is exactly <b>C</b>.`,
            `<b>B:</b> a 1/3 chance that all 600 are saved means a 1/3 chance that <b>nobody dies</b>. A 2/3 chance that nobody is saved means a 2/3 chance that <b>600 die</b>. That is exactly <b>D</b>.`,
            `So A = C (the <b>certain</b> plan) and B = D (the <b>gamble</b>). On average, all four save 200 people: 1/3 × 600 = 200.`,
          ])}
          ${equivalenceTable()}
          ${ui.callout('key', `<b>The key point:</b> a logical decision-maker should choose the same plan whichever wording they see. ${verdictOf(res) === 'consistent' ? 'Across the class, though, the first choice depends heavily on the wording.' : 'You didn’t, and neither do most people.'} The wording alone changes the decision.`)}`,
      },
      {
        kicker: 'System 1’s shortcut', title: 'You reacted to the words',
        html: res => `<p>When you read the options, you probably didn't do any sums. You got a <b>feeling</b> from the words. ${verdictOf(res) === 'classic' ? 'Your choices show exactly this pattern.' : ''}</p>
          ${ui.s1s2(
            `<p><b>Takes the words at face value.</b> “200 people will be <b>saved</b>” sounds like a win. Why risk it? Take the sure thing.</p><p>“400 people will <b>die</b>” sounds like a disaster. A gamble offers a chance that nobody dies, so it feels worth the risk.</p><p>It never translates one wording into the other. It reacts to what's in front of it.</p>`,
            `<p><b>Converts both into the same terms.</b> “200 saved out of 600 means 400 die. So A and C are the same plan.”</p><p>Once the options are in the same units, the wording has no pull. Then you choose based on whether you prefer certainty or risk, and you choose it consistently.</p><p>That takes effort, and System 1's feeling already seems like a good enough answer.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> System 1 answers the question <i>as it is presented</i>. It uses only the information in front of it and doesn't ask whether the same facts could be described another way.`)}`,
      },
      {
        kicker: 'Why gains and losses feel different', title: 'Losses hurt more than gains please',
        html: `<p>Why does “saved” push people to play safe while “die” pushes them to gamble? Kahneman and Tversky explained this in <b>prospect theory</b> (1979).</p>
          ${valueCurve()}
          ${ui.steps([
            `We judge outcomes as <b>gains or losses</b> from a starting point, not as final totals.`,
            `<b>Losses loom larger than gains.</b> Losing something feels roughly twice as bad as gaining the same thing feels good. This is called <b>loss aversion</b>.`,
            `<b>With gains, we avoid risk.</b> A sure gain feels safe, and gambling it away would hurt. So in the “saved” wording, most people take A.`,
            `<b>With losses, we take risks.</b> A sure loss feels unbearable, so a gamble that might avoid it looks attractive. So in the “die” wording, most people take D.`,
          ])}
          ${ui.callout('note', `The wording decides whether System 1 treats the situation as a gain or a loss. The frame sets the starting point, and the starting point sets the feeling.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'The framing effect',
        html: `${ui.define('Framing effect', 'The tendency to make <b>different decisions about the same information</b> depending on how it is presented, for example as a gain or as a loss, or in positive or negative terms.')}
          ${ui.steps([
            '<b>Situation:</b> the same outcome can be described in more than one way.',
            '<b>System 1 shortcut:</b> react to the description as given (“saved” feels good, “die” feels bad).',
            '<b>Result:</b> people avoid risk when options are framed as gains and seek risk when they are framed as losses.',
            '<b>System 2 failure:</b> nobody translates the options into the same terms, so the equivalence goes unnoticed.',
          ])}
          ${ui.callout('tip', `<b>Two kinds of frame at this station:</b> the disease problem uses <i>gain versus loss</i> framing (a choice about risk). The minced beef and the surgery survival rates use <i>positive versus negative</i> labels for one fact (75% lean versus 25% fat, 90% survive versus 10% die).`)}`,
      },
      {
        kicker: 'The evidence', title: 'Three key studies',
        html: `${ui.study({ name: 'Tversky & Kahneman (1981)', rows: [
            ['Aim', 'To investigate whether the wording of a choice changes people’s decisions, even when the outcomes are identical.'],
            ['Method', 'University students were given the disease problem you just did. A <b>between-subjects</b> design: one group saw the “saved” wording, another group saw the “die” wording. (In the original paper it was called the “Asian disease problem”; most teachers now use a neutral name.)'],
            ['Findings', '“Saved” wording: <b>72%</b> chose the certain programme. “Die” wording: only <b>22%</b> chose the certain programme, so 78% gambled.'],
            ['Link', 'Identical outcomes, opposite preferences. System 1 responded to the emotional meaning of the words, and System 2 did not step in to check the maths.'],
          ] })}
          ${ui.study({ name: 'McNeil, Pauker, Sox & Tversky (1982)', rows: [
            ['Method', 'Patients, <b>doctors</b> and graduate students chose between surgery and radiation therapy for lung cancer. The results were described either as survival rates or as death rates.'],
            ['Findings', 'Radiation therapy was chosen by 18% when framed as survival, but by 44% when framed as deaths. “10% die” during surgery sounded much worse than “90% survive”. The doctors showed the effect too.'],
            ['Link', 'Expert knowledge did not protect people. Framing is a System 1 effect, and it matters for real medical decisions.'],
          ] })}
          ${ui.study({ name: 'Levin & Gaeth (1988)', rows: [
            ['Method', 'Participants rated minced beef labelled either “75% lean” or “25% fat”. Some rated it before tasting it, some after.'],
            ['Findings', 'Beef labelled “75% lean” was rated as better quality, better tasting and less greasy. The effect was smaller after people had tasted the meat.'],
            ['Link', 'A positive label creates a positive impression. When people have more real information to go on, the frame has less pull.'],
          ] })}`,
      },
      {
        kicker: 'Why we do it · real world', title: 'Why framing works, and where you meet it',
        html: `${ui.steps([
            `<b>Cognitive miser.</b> Translating every statement into its opposite takes effort. The brain saves effort by accepting information in the form it arrives.`,
            `<b>Emotion comes first.</b> Words like “saved”, “survive” and “lean” produce a quick positive feeling; “die” and “fat” produce a negative one. System 1 uses that feeling as a guide to the decision.`,
            `<b>What you see is all there is.</b> System 1 builds its answer from the information in front of it. It doesn't ask what the same fact would look like described the other way round.`,
          ])}
          <h3>Framing in everyday life</h3>
          <div class="two-col">
            <div class="card"><b>Food labels</b><br>“90% fat-free” is judged healthier than “contains 10% fat”, even though it's the same yoghurt.</div>
            <div class="card"><b>Health messages</b><br>“Wearing sunscreen keeps your skin healthy” versus “Skipping sunscreen increases your cancer risk”. Health campaigns choose their frame carefully.</div>
            <div class="card"><b>Politics</b><br>“92% employment” sounds like success; “8% unemployment” sounds like a problem. Politicians choose the frame that suits their argument.</div>
            <div class="card"><b>Marketing</b><br>“95% success rate” for a treatment or course; “save £20” rather than “pay £80”. Sellers pick the frame that makes you feel good.</div>
          </div>`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li><b>Replicated many times</b> with different scenarios, countries and samples. A large review of framing studies (Kühberger, 1998) found the effect is reliable, although its size varies from task to task.</li><li><b>Real-world relevance:</b> McNeil et al. showed it in doctors making medical choices, not just students.</li><li><b>Randomly allocated</b> between-subjects groups, so differences between conditions can be linked to the wording.</li></ul>`,
            `<ul><li><b>Hypothetical choices:</b> nobody actually lived or died. With real consequences, people might think harder.</li><li><b>Samples</b> were mostly university students from Western countries, which limits how far we can generalise.</li><li>Some studies find the effect <b>shrinks</b> when people are asked to justify their answer or to think carefully. That suggests System 2 can correct it when it is engaged.</li><li>The effect is weaker when people have direct experience to rely on (tasting the beef in Levin & Gaeth).</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> the framing effect shows that System 1 responds to how information is <i>presented</i> rather than to what it <i>means</i>. The reduction in the effect when people must justify their choice is good evidence that System 2 can override System 1 if it is prompted.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The four programmes are really two', hint: 'A (200 saved) = C (400 die). B = D (1/3 chance everyone lives, 2/3 chance everyone dies). All four save 200 on average.' },
        { point: 'What System 1 did', hint: 'Reacted to the words. “Saved” feels like a gain, so play safe. “Die” feels like a loss, so gamble.' },
        { point: 'What System 2 would have done', hint: 'Converted both wordings into the same terms, noticed A = C and B = D, and chosen consistently.' },
        { point: 'Why: prospect theory and loss aversion', hint: 'Kahneman & Tversky (1979): losses feel worse than equal gains feel good. Gains → avoid risk. Losses → take risks.' },
        { point: 'Name it: the framing effect', hint: 'Making different decisions about the same information depending on how it is presented (gains versus losses, positive versus negative).' },
        { point: 'The studies', hint: 'Tversky & Kahneman (1981): 72% certain option when “saved”, 22% when “die”. McNeil et al. (1982): doctors too, surgery versus radiation.' },
        { point: 'A real-world example and a limitation', hint: '“90% fat-free” versus “10% fat”. Limitation: hypothetical choices, no real consequences.' },
      ],
      visual: () => equivalenceTable(),
      ask: [
        'Did you choose the sure thing or the gamble the first time? Why?',
        'Did you change your answer when you saw the other wording? What made you change, or not?',
        'Which would you rather buy: “90% fat-free” or “contains 10% fat”?',
      ],
    },
    concepts: [
      { name: 'Measurement', html: `The disease problem measures decision-making with a hypothetical choice on paper, not a real decision about real lives. The wording itself is part of the measurement: “200 people will be saved” doesn't say what happens to the other 400, so the task may partly measure how people fill that gap rather than their attitude to risk. In Levin &amp; Gaeth (1988) the label effect shrank once people tasted the beef, a reminder that ratings of a label in a lab are not the same as judgements based on real experience.` },
      { name: 'Causality', html: `Tversky &amp; Kahneman (1981) randomly allocated participants to the “saved” or the “die” wording, and nothing else differed. That lets us conclude that the <b>wording caused</b> the change in choices. What the design cannot tell us is <i>why</i>: loss aversion and a simple misreading of the incomplete wording would both produce the same result.` },
      { name: 'Responsibility', html: `McNeil et al. (1982) showed that the way a doctor presents survival figures can steer a patient's choice of treatment, and that doctors themselves are affected. A responsible doctor might give both frames (“90 out of 100 survive, 10 die”). Marketers who write “90% fat-free” and politicians who pick the kinder frame are using the same effect, which raises questions about when framing becomes manipulation.` },
      { name: 'Change', html: `Framing is one of the main tools used to change behaviour, for example in health campaigns that stress what you lose by not getting screened. Our scientific knowledge of framing has also changed over time: large replication projects confirmed the classic result, while later studies with fuller wording changed how researchers explain it.` },
    ],
    debate: {
      title: 'Is the framing effect about losses, or about missing words?',
      sideA: { label: 'The classic effect replicates (Tversky & Kahneman, 1981; Klein et al., 2014)', html: `With the original wording, most people choose the certain option when it is described as lives saved and the gamble when it is described as deaths. Many Labs 1 (Klein et al., 2014) repeated the task with thousands of participants in many labs and countries and found the effect again. A meta-analysis by Kühberger (1998) concluded that framing effects are reliable, although their size varies a lot between tasks.` },
      sideB: { label: 'Complete wording shrinks it (Kühberger, 1995; Mandel, 2014)', html: `When the certain option is described in full (“200 people will be saved and 400 will not be saved”), the framing effect becomes much smaller, and in some studies it largely disappears. Mandel argued that people read “200 will be saved” as “at least 200 will be saved”. On that reading, choosing A in one frame and D in the other is not irrational at all.` },
      why: [
        { factor: 'Wording', html: `The original certain options only mention one side of the outcome. “200 saved” leaves open whether more might survive, and “400 die” leaves open whether more might die. The gambles are described in full, so the two kinds of option are not described in the same way.` },
        { factor: 'Operationalisation', html: `Both sides use “the disease problem”, but not the same version of it. The replications used the original incomplete wording, so they show that the result is reliable, not what causes it. The complete-wording studies change the task in order to test the explanation.` },
        { factor: 'Sample size and setting', html: `A single study with students can be a fluke. A multi-site project with thousands of people across countries is much stronger evidence that the classic result is real. The complete-wording studies are smaller, so their exact effect sizes are less certain.` },
        { factor: 'Publication bias', html: `Meta-analyses can only include studies that were published. If studies that found no framing effect were less likely to be published, the average effect in a meta-analysis could look larger than it really is.` },
      ],
      trust: `We can trust that the classic wording produces a framing effect: it has been replicated in a very large, multi-site project, which is stronger than any single study. The disagreement is about the explanation. The complete-wording studies are the better test of <i>why</i> the effect happens, because they remove the ambiguity, and they suggest that part of the classic effect comes from how people read the missing information. Framing effects also appear in other tasks, such as the beef and surgery studies, so ambiguity is unlikely to be the whole story. The honest conclusion is that both loss aversion and the way people interpret incomplete wording probably play a part, and researchers still disagree about how much each contributes.`,
      ask: 'If “200 people will be saved” really means “at least 200” to most people, were the participants actually making a mistake?',
    },
    quiz: {
      core: [
        { q: 'What is the <b>framing effect</b>?', a: 'Making different decisions about the same information depending on how it is described', d: ['Judging how likely something is by how easily examples come to mind', 'Relying too heavily on the first number you see when estimating', 'Searching only for information that supports what you already believe'], why: 'Framing is about presentation: the facts stay the same, the wording changes, and so does the decision.' },
        { q: 'In the disease problem, why are Programme A (“200 people will be saved”) and Programme C (“400 people will die”) the same?', a: 'Out of 600 people, 200 saved means 400 die', d: ['Both are gambles with a 1/3 chance of success', 'Both save more people than Programmes B and D', 'Both were chosen by most people in the original study'], why: '600 − 200 = 400. A and C describe exactly the same outcome in different words.' },
        { q: 'In Tversky & Kahneman (1981), what did most people choose when the options were worded in terms of people <b>dying</b>?', a: 'The gamble (about 78% chose it)', d: ['The certain option (about 72% chose it)', 'The certain option (about 90% chose it)', 'Both options about equally often'], why: 'Only 22% chose the certain option in the “die” wording, so about 78% gambled. With “saved” wording, 72% chose the certain option.' },
        { q: 'According to <b>prospect theory</b>, how do people usually respond to gains and losses?', a: 'They avoid risk with gains but take risks to avoid losses', d: ['They take risks with gains but avoid risk with losses', 'They treat gains and losses in exactly the same way', 'They ignore losses whenever any gain is possible'], why: 'Losses feel worse than equal gains feel good (loss aversion), so people gamble to avoid a sure loss but protect a sure gain.' },
        { q: 'What did <b>McNeil et al. (1982)</b> find?', a: 'Surgery was more popular when described with survival rates, and doctors showed the effect too', d: ['Doctors were unaffected by framing, but patients were strongly affected', 'Radiation was more popular when described with survival rates', 'Framing only affected students with no medical knowledge'], why: '“90% survive” sounds better than “10% die”. Radiation was chosen by 18% in the survival frame and 44% in the death frame, and expertise did not protect doctors.' },
        { q: 'What would <b>System 2</b> do to avoid the framing effect in the disease problem?', a: 'Put both options into the same terms and notice that the outcomes are identical', d: ['Go with whichever option produces the stronger gut feeling', 'Choose the option that uses the more positive words', 'Always pick the certain option, because certainty is safer'], why: 'Converting “saved” into “die” (or the reverse) removes the emotional pull of the wording, so the choice becomes consistent.' },
        { q: 'Which is a <b>limitation</b> of the original disease problem study?', a: 'The choices were hypothetical, so participants faced no real consequences', d: ['It used random allocation, so the groups cannot be compared', 'It has never been replicated with any other sample', 'Participants were told the correct answer before choosing'], why: 'People may think harder when real lives or real money are at stake, so hypothetical tasks may exaggerate the effect.' },
        { q: 'A yoghurt is labelled “90% fat-free”. An identical yoghurt is labelled “contains 10% fat”. What does the framing effect predict?', a: 'People will judge the “90% fat-free” yoghurt as healthier', d: ['People will judge the “10% fat” yoghurt as healthier', 'People will judge both as equally healthy', 'People will refuse to buy either yoghurt'], why: 'The positive frame (“fat-free”) triggers a positive System 1 feeling, even though the two labels mean the same thing.' },
        { q: 'Why does System 1 fall for framing?', a: 'It responds to the emotional meaning of the words and uses only the information as presented', d: ['It carefully calculates the expected value of every option', 'It remembers the other wording from a previous experiment', 'It is only active when people are under time pressure'], why: 'System 1 takes information at face value (“what you see is all there is”) and uses the feeling it creates to decide.' },
        { q: 'Why do some researchers call the classic disease problem wording a <b>measurement</b> problem?', a: '“200 will be saved” leaves out the other 400, so it can be read as “at least 200”', d: ['The numbers are too large for most participants to work out in their heads', 'Participants were told which programme the researchers preferred', 'The two groups were given the problem in different languages'], why: 'The certain options are described incompletely while the gambles are complete. Studies that describe both outcomes in full (Kühberger, 1995; Mandel, 2014) find a much smaller effect.' },
      ],
      extra: [
        { q: 'In <b>Levin & Gaeth (1988)</b>, how did people rate minced beef labelled “75% lean” compared with “25% fat”?', a: 'As better quality and less greasy', d: ['As worse quality and more greasy', 'Exactly the same on every rating', 'As less healthy but better tasting'], why: 'The positive label created a more positive impression of the same meat.' },
        { q: 'Levin & Gaeth also found the labelling effect was <b>smaller after people tasted the beef</b>. What does this suggest?', a: 'Frames have most influence when people have little direct information', d: ['Tasting makes System 1 more powerful than System 2', 'The label was only noticed after the tasting', 'Framing effects are caused by the sense of taste'], why: 'Once people had real experience to judge by, the words on the label mattered less.' },
        { q: 'In the disease problem, how many people does Programme B save <b>on average</b>?', a: '200', d: ['600', '400', '300'], why: 'A 1/3 chance of saving 600 gives 1/3 × 600 = 200 on average, the same as the certain Programme A.' },
        { q: 'A student chose Programme A with the “saved” wording and Programme D with the “die” wording. What best describes this?', a: 'Their preference reversed because of the wording, although the outcomes were identical', d: ['They were consistent, because A and D describe the same outcome', 'They chose the option that saves the most lives both times', 'They showed the availability heuristic, not framing'], why: 'A is the certain plan and D is the gamble. Switching from certain to gamble when only the words change is the classic framing effect.' },
        { q: 'Some studies find framing effects get smaller when participants must <b>justify</b> their choice. Why might this be?', a: 'Explaining a choice engages System 2, which is more likely to spot the equivalence', d: ['Justifying a choice makes people rely more heavily on gut feelings', 'Participants copy the answers of the researcher', 'It makes the losses seem larger and the gains seem smaller'], why: 'Having to give reasons prompts slower, more careful thinking, which can override the first System 1 reaction.' },
        { q: 'A government can say “employment is at 92%” or “unemployment is at 8%”. Which wording will make most people feel better about the economy?', a: '“Employment is at 92%”', d: ['“Unemployment is at 8%”', 'Both wordings will produce identical feelings', 'Neither, because economic figures do not produce feelings'], why: 'Same fact, positive frame. System 1 reacts to “employment” as good news and “unemployment” as bad news.' },
        { q: 'Tversky & Kahneman randomly allocated people to the “saved” or “die” wording. What does this design allow us to conclude?', a: 'The wording caused the change in choices, but not why it did', d: ['Loss aversion is proven to be the cause of the framing effect', 'The effect will be the same size in every culture and sample', 'The two groups already had different attitudes to risk'], why: 'Random allocation means the wording is the only systematic difference, so it caused the effect. It cannot separate loss aversion from a misreading of the incomplete wording.' },
      ],
    },
  });
})();
