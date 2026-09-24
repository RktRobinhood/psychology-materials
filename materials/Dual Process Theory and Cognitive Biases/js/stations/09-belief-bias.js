/* Station 9: Syllogisms under time pressure. Belief bias. */
(function () {
  const { ui, util } = DPT;

  // type: VB valid-believable, VU valid-unbelievable, IB invalid-believable, IU invalid-unbelievable.
  // Only four simple forms are used:
  //   All A are B; X are A; so X are B           (valid)
  //   No A are B; X are A; so X are not B        (valid)
  //   All A are B; X are B; so X are A           (invalid)
  //   All A are B; some B are C; so some A are C (invalid)
  const SETS = {
    learn: [
      { type: 'VB', p: ['All birds have feathers.', 'Robins are birds.'], c: 'Robins have feathers.' },
      { type: 'VB', p: ['No fish are mammals.', 'Salmon are fish.'], c: 'Salmon are not mammals.' },
      { type: 'VU', p: ['All mammals can fly.', 'Whales are mammals.'], c: 'Whales can fly.' },
      { type: 'VU', p: ['No vegetables are healthy.', 'Carrots are vegetables.'], c: 'Carrots are not healthy.' },
      { type: 'IB', p: ['All flowers need water.', 'Roses need water.'], c: 'Roses are flowers.' },
      { type: 'IB', p: ['All dogs are animals.', 'Some animals are pets.'], c: 'Some dogs are pets.' },
      { type: 'IU', p: ['All cars have wheels.', 'Shopping trolleys have wheels.'], c: 'Shopping trolleys are cars.' },
      { type: 'IU', p: ['All pizzas are food.', 'Some food is fruit.'], c: 'Some pizzas are fruit.' },
    ],
    teach: [
      { type: 'VB', p: ['All metals conduct electricity.', 'Copper is a metal.'], c: 'Copper conducts electricity.' },
      { type: 'VB', p: ['No insects have backbones.', 'Ants are insects.'], c: 'Ants do not have backbones.' },
      { type: 'VU', p: ['All reptiles can sing.', 'Snakes are reptiles.'], c: 'Snakes can sing.' },
      { type: 'VU', p: ['No fruits are sweet.', 'Strawberries are fruits.'], c: 'Strawberries are not sweet.' },
      { type: 'IB', p: ['All fish live in water.', 'Sharks live in water.'], c: 'Sharks are fish.' },
      { type: 'IB', p: ['All cats are mammals.', 'Some mammals are furry.'], c: 'Some cats are furry.' },
      { type: 'IU', p: ['All fish can swim.', 'Olympic swimmers can swim.'], c: 'Olympic swimmers are fish.' },
      { type: 'IU', p: ['All bicycles are vehicles.', 'Some vehicles are aeroplanes.'], c: 'Some bicycles are aeroplanes.' },
    ],
  };

  const PRACTICE = [
    { p: ['All zorbs are blue.', 'Fip is a zorb.'], c: 'Fip is blue.', valid: true, why: 'If <i>every</i> zorb is blue and Fip is a zorb, Fip <b>has</b> to be blue. The conclusion is forced by the premises: <b>valid</b>.' },
    { p: ['All zorbs are blue.', 'Fip is blue.'], c: 'Fip is a zorb.', valid: false, why: 'Lots of things could be blue without being zorbs. Fip might be one of them. The conclusion <i>could</i> be true, but it doesn’t <b>have</b> to be: <b>invalid</b>.' },
  ];

  const TIME = 10; // seconds per argument (as in Evans & Curtis-Holmes, 2005)
  const isValid = t => t[0] === 'V';
  const isConflict = t => t === 'VU' || t === 'IB';
  const TYPES = ['VB', 'VU', 'IB', 'IU'];
  const EVANS = { VB: 89, VU: 56, IB: 71, IU: 10 };
  const LABEL = { VB: 'Valid + believable', VU: 'Valid + unbelievable', IB: 'Invalid + believable', IU: 'Invalid + unbelievable' };

  const STYLE = `<style>
    .bb-arg{font-size:clamp(19px,2.6vw,23px);line-height:1.5;margin:10px 0 16px}
    .bb-arg .bb-p{display:block}
    .bb-arg .bb-c{display:block;margin-top:8px;padding-top:8px;border-top:2px solid var(--line-2);font-weight:700}
    .bb-btns{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
    .bb-btns .btn{padding:18px;font-size:19px}
    .bb-timer>div{transform-origin:left;animation:bb-shrink ${TIME}s linear forwards}
    @keyframes bb-shrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}
    .bb-table{width:100%;border-collapse:separate;border-spacing:8px;margin:10px -8px}
    .bb-table th{font-family:var(--f-mono);font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;padding:4px}
    .bb-table td{background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:10px 12px;vertical-align:top;font-size:15px;width:45%}
    .bb-table td.conf{border-color:var(--s1);background:linear-gradient(var(--s1-soft),var(--paper) 80%)}
    .bb-big{font-family:var(--f-display);font-weight:900;font-size:30px;line-height:1.05}
    .bb-sub{font-size:13.5px;color:var(--muted)}
    .bb-tag{display:inline-block;font-family:var(--f-mono);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:999px;margin-bottom:4px}
    .bb-tag.conf{background:var(--s1);color:#fff}
    .bb-tag.ok{background:var(--line);color:var(--ink-2)}
    .bb-euler{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:14px 0}
    .bb-euler figure{margin:0;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:10px}
    .bb-euler figcaption{font-size:14.5px;color:var(--ink-2);margin-top:4px}
    .bb-euler svg{width:100%;height:auto;display:block}
  </style>`;

  function argHTML(it) {
    return `<div class="task-card bb-arg">${it.p.map(x => `<span class="bb-p">${x}</span>`).join('')}<span class="bb-c">Therefore: ${it.c}</span></div>`;
  }

  /* ── Experiment ──────────────────────────────────────────── */
  function experiment(el, ctx) {
    const items = util.shuffle(SETS[ctx.mode]);
    const answers = [];
    let timer = null;

    function practice(k) {
      const it = PRACTICE[k];
      el.innerHTML = `${STYLE}
        <p class="kicker">Practice ${k + 1} of ${PRACTICE.length} · no time limit</p>
        <h2 class="screen-title">Does the conclusion follow?</h2>
        ${k === 0 ? `<div class="prose"><p>An argument is <b>logically valid</b> if the conclusion <b>must</b> be true <i>whenever the premises are true</i>. You are not judging whether the conclusion is true in real life. You are judging whether it is <b>forced</b> by the premises.</p>
          <p><b>Assume every premise is true</b>, even if it is obviously false, and ask: <i>does the conclusion have to follow?</i></p></div>` : ''}
        ${argHTML(it)}
        <div class="bb-btns"><button class="btn s2" data-v="1">Valid</button><button class="btn s1" data-v="0">Invalid</button></div>
        <div class="feedback" id="fb"></div>`;
      el.querySelectorAll('.bb-btns .btn').forEach(b => b.onclick = () => {
        el.querySelectorAll('.bb-btns .btn').forEach(x => x.disabled = true);
        const ok = (b.dataset.v === '1') === it.valid;
        const fb = el.querySelector('#fb');
        fb.className = 'feedback ' + (ok ? 'good' : 'bad');
        fb.innerHTML = `<p>${ok ? 'Correct.' : 'Not quite.'} ${it.why}</p>
          <button class="btn primary" id="go">${k + 1 < PRACTICE.length ? 'Next practice' : 'I’m ready'}</button>`;
        fb.querySelector('#go').onclick = () => k + 1 < PRACTICE.length ? practice(k + 1) : ready();
      });
    }

    function ready() {
      el.innerHTML = `${STYLE}
        <p class="kicker">The real test</p>
        <h2 class="screen-title">8 arguments, ${TIME} seconds each</h2>
        <div class="prose"><p>Some arguments are about real things, some have silly premises. It doesn’t matter: <b>assume the premises are true</b> and decide whether the conclusion <b>must</b> follow.</p>
          <p>You have <b>${TIME} seconds</b> for each one. There is no feedback until the end.</p></div>
        <div class="btn-row"><button class="btn primary big" id="start">Start</button></div>`;
      el.querySelector('#start').onclick = () => show(0);
    }

    function show(i) {
      if (!el.isConnected) return;
      if (i >= items.length) return finish();
      const it = items[i];
      const t0 = performance.now();
      el.innerHTML = `${STYLE}
        <div class="exp-progress">Argument ${i + 1} of ${items.length}</div>
        <div class="timer bb-timer"><div></div></div>
        ${argHTML(it)}
        <p class="prose" style="margin:0">Assuming the premises are true, does the conclusion <b>necessarily</b> follow?</p>
        <div class="bb-btns"><button class="btn s2" data-v="valid">Valid</button><button class="btn s1" data-v="invalid">Invalid</button></div>`;
      const record = said => {
        clearTimeout(timer);
        answers.push({ type: it.type, c: it.c, said, rt: Math.round(performance.now() - t0) });
        el.querySelectorAll('.bb-btns .btn').forEach(x => x.disabled = true);
        setTimeout(() => show(i + 1), said ? 350 : 900);
        if (!said) el.querySelector('.bb-btns').insertAdjacentHTML('afterend', '<p class="feedback bad">Time’s up!</p>');
      };
      el.querySelectorAll('.bb-btns .btn').forEach(b => b.onclick = () => record(b.dataset.v));
      timer = setTimeout(() => { if (el.isConnected) record(null); }, TIME * 1000);
    }

    function finish() {
      const cells = {};
      TYPES.forEach(t => {
        const a = answers.filter(x => x.type === t && x.said);
        cells[t] = [a.filter(x => x.said === 'valid').length, a.length];
      });
      const correct = x => x.said && ((x.said === 'valid') === isValid(x.type));
      const conf = answers.filter(x => isConflict(x.type));
      const non = answers.filter(x => !isConflict(x.type));
      const rt = xs => { const a = xs.filter(x => x.said); return a.length ? Math.round(util.mean(a.map(x => x.rt))) : null; };
      const res = {
        answers, cells,
        confOK: conf.filter(correct).length, nonOK: non.filter(correct).length,
        rtConf: rt(conf), rtNon: rt(non),
        timeouts: answers.filter(x => !x.said).length,
      };
      ctx.pool.add({ cells, confOK: res.confOK, nonOK: res.nonOK });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">All 8 arguments done</h2>
        <p class="prose">Press <b>Next</b> to see which ones were valid, and whether your beliefs got in the way.</p>`;
      ctx.done(res);
    }

    practice(0);
  }

  /* ── Reveal ──────────────────────────────────────────────── */
  function cellHTML(t, res, pooled) {
    const [v, n] = res.cells[t];
    const [pv, pn] = pooled[t];
    const shouldSay = isValid(t) ? 'valid' : 'invalid';
    return `<td class="${isConflict(t) ? 'conf' : ''}">
      <span class="bb-tag ${isConflict(t) ? 'conf' : 'ok'}">${isConflict(t) ? 'conflict' : 'no conflict'}</span>
      <div class="bb-big">${n ? `${v}/${n}` : '–'}</div>
      <div class="bb-sub">you said “valid” (correct answer: <b>${shouldSay}</b>)</div>
      <div style="margin-top:6px">Station: <b>${pn ? util.pct(pv, pn) + '%' : '–'}</b> · Evans et al.: <b>${EVANS[t]}%</b></div>
    </td>`;
  }

  function pooledCells(pool) {
    const out = {};
    TYPES.forEach(t => {
      out[t] = pool.reduce(([v, n], r) => r.cells && r.cells[t] ? [v + r.cells[t][0], n + r.cells[t][1]] : [v, n], [0, 0]);
    });
    return out;
  }

  function reveal(res, ctx) {
    const pool = ctx.pool.all();
    const pc = pooledCells(pool);
    const listRows = res.answers.map(a => {
      const ok = a.said && ((a.said === 'valid') === isValid(a.type));
      return `<tr class="${ok ? 'ok' : 'no'}"><td>${a.c}</td><td><span class="pill ${isConflict(a.type) ? 's1' : ''}">${LABEL[a.type]}</span></td><td>${a.said || 'too slow'}</td><td class="mark">${ok ? '✓' : '✗'}</td></tr>`;
    }).join('');

    let verdict;
    if (res.confOK < res.nonOK) verdict = `You got <b>${res.nonOK}/4</b> right when logic and belief agreed, but only <b>${res.confOK}/4</b> when they <b>conflicted</b>. That gap is belief bias: the believability of the conclusion pulled your answer away from the logic.`;
    else if (res.confOK === 4) verdict = `You got all four <b>conflict</b> items right. That’s impressive under a ${TIME}-second limit: your System 2 overrode the pull of belief. Most people find these the hardest.`;
    else verdict = `You did about as well on conflict items (<b>${res.confOK}/4</b>) as on no-conflict items (<b>${res.nonOK}/4</b>). Look at the station data and the original study: for most people, the conflict items are much harder.`;

    return `${STYLE}<style>.wtable{width:100%;border-collapse:collapse;margin:14px 0;font-size:15px}.wtable th{text-align:left;font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding:6px 8px}.wtable td{padding:8px;border-top:1px solid var(--line);vertical-align:top}.wtable tr.ok td.mark{color:var(--good)}.wtable tr.no td.mark{color:var(--bad)}.wtable .mark{font-size:22px;font-weight:900}</style>
      <p>How often did you say <b>“valid”</b> for each kind of argument? The two <b style="color:var(--s1)">conflict</b> cells are where logic and belief point in opposite directions.</p>
      <table class="bb-table">
        <thead><tr><th></th><th>Believable conclusion</th><th>Unbelievable conclusion</th></tr></thead>
        <tbody>
          <tr><th>Valid</th>${cellHTML('VB', res, pc)}${cellHTML('VU', res, pc)}</tr>
          <tr><th>Invalid</th>${cellHTML('IB', res, pc)}${cellHTML('IU', res, pc)}</tr>
        </tbody>
      </table>
      ${ui.callout('key', verdict)}
      <div class="stat-row">
        ${ui.stat(res.nonOK + '/4', 'correct: no conflict', 's2')}
        ${ui.stat(res.confOK + '/4', 'correct: conflict', 's1')}
        ${res.rtConf && res.rtNon ? ui.stat(`${util.fmt(res.rtConf / 1000, 1)}s versus ${util.fmt(res.rtNon / 1000, 1)}s`, 'your average time: conflict versus no conflict') : ''}
      </div>
      ${res.timeouts ? `<p class="muted">You ran out of time on ${res.timeouts} argument${res.timeouts > 1 ? 's' : ''}.</p>` : ''}
      <h3>Everyone at this station so far: % saying “valid”</h3>
      ${ui.bars(TYPES.map(t => ({ label: LABEL[t], value: util.pct(pc[t][0], pc[t][1]), max: 100, text: util.pct(pc[t][0], pc[t][1]) + '%', cls: isConflict(t) ? 's1' : 's2' })))}
      ${ui.poolNote(pool.length)}
      <details><summary><b>Your answers, one by one</b></summary>
        <table class="wtable"><thead><tr><th>Conclusion</th><th>Type</th><th>You said</th><th></th></tr></thead><tbody>${listRows}</tbody></table>
      </details>`;
  }

  /* ── Euler diagrams ──────────────────────────────────────── */
  function euler(outer, inner, dot, dotInside) {
    const dx = dotInside ? 100 : 196, dy = dotInside ? 128 : 118;
    return `<svg viewBox="0 0 260 200" role="img" aria-label="${outer}, ${inner}, ${dot}">
      <ellipse cx="130" cy="108" rx="122" ry="86" style="fill:var(--s2-soft);stroke:var(--s2);stroke-width:2.5"/>
      <text x="130" y="42" text-anchor="middle" style="fill:var(--s2-ink);font:700 13px var(--f-ui)">${outer}</text>
      <circle cx="100" cy="120" r="48" style="fill:var(--paper);stroke:var(--accent);stroke-width:2.5"/>
      <text x="100" y="98" text-anchor="middle" style="fill:var(--accent-ink);font:700 13px var(--f-ui)">${inner}</text>
      <circle cx="${dx}" cy="${dy}" r="8" style="fill:var(--s1)"/>
      <text x="${dx}" y="${dy + 24}" text-anchor="middle" style="fill:var(--ink);font:700 12.5px var(--f-ui)">${dot}</text>
    </svg>`;
  }

  const ROSES = `<div class="bb-euler">
      <figure>${euler('Things that need water', 'Flowers', 'Roses', true)}<figcaption><b>Picture 1:</b> roses inside “flowers”. Fits both premises.</figcaption></figure>
      <figure>${euler('Things that need water', 'Flowers', 'Roses', false)}<figcaption><b>Picture 2:</b> roses need water but sit <b>outside</b> “flowers”. <b>Also fits both premises.</b></figcaption></figure>
    </div>`;
  const WHALES = `<div class="bb-euler">
      <figure>${euler('Things that can fly', 'Mammals', 'Whales', true)}<figcaption><b>The only possible picture:</b> if all mammals are inside “can fly”, and whales are mammals, whales <b>must</b> be inside “can fly”.</figcaption></figure>
    </div>`;

  DPT.register({
    id: 'beliefbias', num: 9, hue: 95, minutes: 15,
    title: 'Logic versus Belief',
    bias: 'Belief bias',
    hook: '“All flowers need water. Roses need water. So roses are flowers.” True. But is it logical?',
    intro: {
      learn: `<p>You’ll judge eight short arguments, called <b>syllogisms</b>. For each one you decide whether the conclusion follows logically from the premises.</p>
        <p>There’s a catch: you only get <b>${TIME} seconds</b> per argument. You’ll have two untimed practice items first.</p>`,
      teach: `<p><b>Host tip:</b> your guest gets eight different arguments from the ones you saw. Watch the arguments where logic and belief clash, such as “All fish live in water. Sharks live in water. So sharks are fish.”</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'Valid is not the same as true',
        html: `${STYLE}<p>Logic is about the <b>structure</b> of an argument, not whether the conclusion is true in real life. Take this one:</p>
          ${argHTML(SETS.learn[4])}
          <p>Every sentence is true. Roses <i>are</i> flowers. But the argument is <b>invalid</b>, because the premises don’t force the conclusion. Draw it:</p>
          ${ROSES}
          ${ui.steps([
            'Premise 1 puts “flowers” <b>inside</b> “things that need water”.',
            'Premise 2 puts roses somewhere inside “things that need water”. It doesn’t say <b>where</b>.',
            'Roses could be inside “flowers” (picture 1) or outside it (picture 2), like cats, cactuses or people. Both pictures fit the premises.',
            'So the conclusion <b>might</b> be true, but it doesn’t <b>have</b> to be. That makes it <b>invalid</b>. You only “know” roses are flowers from real life, not from the argument.',
          ])}
          <p>Now the opposite case:</p>
          ${argHTML(SETS.learn[2])}
          ${WHALES}
          ${ui.callout('key', `<b>Whales can’t fly, but the argument is valid.</b> <i>If</i> the premises were true, the conclusion would have to be true. The problem is the false first premise, not the logic.`)}`,
      },
      {
        kicker: 'The two systems', title: 'Two different questions',
        html: res => `${STYLE}<p>When you read an argument, two questions compete. They usually agree. On <b>conflict items</b> they don’t.</p>
          ${ui.s1s2(
            `<p><b>Asks: “Is the conclusion believable?”</b></p><p>It checks the conclusion against what you already know. “Roses are flowers”: yes, <b>accept</b>. “Whales can fly”: nonsense, <b>reject</b>. This is instant and feels like reasoning, but it ignores the premises entirely.</p>`,
            `<p><b>Asks: “Does it follow from the premises?”</b></p><p>It sets real-world knowledge aside and checks the structure, maybe by picturing circles as you saw on the last screen. This is slow and effortful, and with ${TIME} seconds there may not be time to finish.</p>`
          )}
          <table class="bb-table"><thead><tr><th></th><th>Believable</th><th>Unbelievable</th></tr></thead><tbody>
            <tr><th>Valid</th><td>S1 says <b>accept</b><br>S2 says <b>accept</b><br><span class="bb-tag ok">agree</span></td><td class="conf">S1 says <b>reject</b><br>S2 says <b>accept</b><br><span class="bb-tag conf">conflict</span></td></tr>
            <tr><th>Invalid</th><td class="conf">S1 says <b>accept</b><br>S2 says <b>reject</b><br><span class="bb-tag conf">conflict</span></td><td>S1 says <b>reject</b><br>S2 says <b>reject</b><br><span class="bb-tag ok">agree</span></td></tr>
          </tbody></table>
          ${ui.callout('s1', `<b>The key idea:</b> on conflict items System 2 must actively <b>override</b> the answer System 1 has already produced. ${res.confOK < res.nonOK ? `Your results show this: <b>${res.confOK}/4</b> on conflict items versus <b>${res.nonOK}/4</b> when they agreed.` : 'That takes effort and time, which is why most people score worse on these.'}`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Belief bias',
        html: `${ui.define('Belief bias', 'The tendency to judge how <b>logically strong</b> an argument is by how <b>believable its conclusion</b> is. People accept invalid arguments with believable conclusions and reject valid arguments with unbelievable ones.')}
          ${ui.steps([
            '<b>Situation:</b> an argument whose logic and believability point in different directions (a conflict item).',
            '<b>System 1 shortcut:</b> “if the conclusion sounds true, the argument is good”.',
            '<b>Result:</b> invalid-believable arguments are accepted; valid-unbelievable ones are rejected.',
            '<b>System 2 failure:</b> overriding a belief takes effort and time. When time is short, belief wins.',
          ])}
          ${ui.callout('tip', `<b>Watch out:</b> the strongest pull is on <b>invalid-believable</b> arguments. The conclusion is something you already agree with, so nothing feels wrong and System 2 is never alerted.`)}`,
      },
      {
        kicker: 'The evidence', title: 'Key studies',
        html: `${ui.study({ name: 'Evans, Barston & Pollard (1983)', rows: [
            ['Method', 'Participants judged syllogisms of all four types and were told to accept only conclusions that followed logically.'],
            ['Findings', '% of arguments accepted as valid: <b>valid-believable 89%</b>, <b>valid-unbelievable 56%</b>, <b>invalid-believable 71%</b>, <b>invalid-unbelievable 10%</b>.'],
            ['Link', 'Logic mattered (valid accepted more than invalid), but belief mattered too, most of all on invalid arguments. Two processes seem to be competing.'],
          ] })}
          ${ui.study({ name: 'Evans & Curtis-Holmes (2005)', rows: [
            ['Method', 'Participants judged syllogisms either with <b>unlimited time</b> or with a <b>rapid-response limit</b> of about 10 seconds.'],
            ['Findings', 'Under time pressure, <b>belief-based</b> answers increased and <b>logic-based</b> answers decreased.'],
            ['Link', `System 2 needs time. Limiting time handicaps System 2, so System 1’s belief-based answer takes over. This is what the ${TIME}-second timer did to you.`],
          ] })}
          ${ui.study({ name: 'Goel & Dolan (2003)', rows: [
            ['Method', 'Participants judged belief-laden syllogisms in an <b>fMRI</b> scanner.'],
            ['Findings', 'When people <b>overrode</b> belief and answered logically, the <b>right lateral prefrontal cortex</b> was more active. When belief <b>won</b>, the <b>ventromedial prefrontal cortex</b>, linked with emotion and personal relevance, was more active.'],
            ['Link', 'This suggests belief-based and logic-based responses involve different brain areas, which fits a two-system account. It is correlational, so it doesn’t prove there are two systems.'],
          ] })}`,
      },
      {
        kicker: 'Why it matters', title: 'Belief bias in real life',
        html: `<ul>
            <li><b>Politics:</b> we rate an argument as “logical” when it reaches a conclusion we like, and pick holes in equally good arguments from the other side.</li>
            <li><b>Fake news and social media:</b> a post with a believable conclusion is shared without anyone checking whether the evidence actually supports it.</li>
            <li><b>Your own essays:</b> it is easy to accept a weak study because its conclusion fits what you expected to find. Examiners reward evaluation that checks the method, not just the conclusion.</li>
            <li><b>Juries:</b> a story that “sounds right” can be more persuasive than the evidence behind it.</li>
          </ul>
          ${ui.callout('s2', `<b>How to switch on System 2:</b> ask “if I didn’t already believe the conclusion, would these reasons convince me?” or swap the content for nonsense words (zorbs and fips) and check whether the structure still works.`)}`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>Belief bias is a very <b>reliable</b> effect, replicated many times with different syllogisms.</li><li><b>Converging evidence:</b> behavioural data (Evans et al.), a manipulation of time that should affect System 2 (Evans & Curtis-Holmes), and brain imaging (Goel & Dolan).</li><li>The time-pressure finding is an <b>experimental</b> test of the theory, so it supports a cause-and-effect claim about System 2 needing time.</li></ul>`,
            `<ul><li><b>Artificial task:</b> real arguments are rarely neat syllogisms, and some participants may not understand what “valid” means, whatever the instructions say.</li><li><b>Individual differences:</b> people with higher cognitive ability or a stronger <i>need for cognition</i> show less belief bias, so the effect is not the same for everyone.</li><li><b>fMRI is correlational:</b> activity in an area doesn’t show it causes the response.</li><li>Closely linked to <b>confirmation bias</b>, so it can be hard to separate the two.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> belief bias gives you an experimental test of dual process theory (time pressure) plus biological evidence (Goel & Dolan), both in one bias.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'Valid is not the same as true', hint: 'Valid = the conclusion <b>must</b> follow if the premises are true. “Whales can fly” can be valid; “roses are flowers” can be invalid.' },
        { point: 'Explain one invalid-believable item', hint: '“All fish live in water. Sharks live in water. So sharks are fish.” Other things live in water too. The premises don’t force it. Use the circles.' },
        { point: 'What System 1 did', hint: 'Asked “is the conclusion believable?” and accepted or rejected on that basis, ignoring the premises.' },
        { point: 'What System 2 would have done', hint: 'Assumed the premises were true and checked whether the conclusion is forced. Slow; the time limit made it harder.' },
        { point: 'Name it: belief bias', hint: 'Judging an argument’s logic by how believable its conclusion is. Worst on conflict items.' },
        { point: 'The evidence', hint: 'Evans et al. (1983): valid and believable 89%, valid and unbelievable 56%, invalid and believable 71%, invalid and unbelievable 10%. Evans & Curtis-Holmes (2005): time pressure → more belief bias. Goel & Dolan (2003): right lateral PFC when logic wins; VMPFC when belief wins.' },
        { point: 'Real life', hint: 'Judging political arguments by whether you like the conclusion; sharing fake news; accepting weak studies in essays.' },
      ],
      visual: `${STYLE}<div class="bb-euler">
          <figure>${euler('Things that live in water', 'Fish', 'Sharks', true)}<figcaption>Sharks inside “fish”: fits the premises.</figcaption></figure>
          <figure>${euler('Things that live in water', 'Fish', 'Sharks', false)}<figcaption>Sharks outside “fish”: <b>also fits</b>. So “sharks are fish” is <b>not forced</b>: invalid.</figcaption></figure>
        </div>`,
      ask: [
        'Which arguments felt hardest? Why?',
        'Did you answer any from what you know about the world rather than from the premises?',
        'What might happen to your score with unlimited time?',
      ],
    },
    concepts: [
      { name: 'Causality', html: `Evans and Curtis-Holmes (2005) <b>manipulated</b> the time allowed, so they can claim that time pressure <i>causes</i> more belief-based answers. Goel and Dolan (2003) only <b>recorded</b> which brain areas were active when belief or logic won. That is correlational: it shows what happens alongside each kind of answer, not what causes it.` },
      { name: 'Measurement', html: `Belief bias is measured by asking people to judge arguments as “valid” or “invalid”. But some participants may read “valid” as “true” or “sensible”, whatever the instructions say, so part of the effect could be a misunderstanding of the task. Researchers also have to choose what to measure: accuracy alone, or response time and confidence as well, which can tell a different story.` },
      { name: 'Bias', html: `Belief bias applies to researchers too. A scientist, examiner or student may accept a weak study without question when its conclusion fits what they already believe, and pick holes in an equally good study that disagrees. Checking the method before looking at the conclusion is one way research tries to guard against this.` },
      { name: 'Perspective', html: `The same bias can be studied at different levels: behaviour (which answers people give), cognition (how two systems compete) and biology (which brain areas are active). Within the cognitive perspective, researchers also disagree about whether System 1 is blind to logic or has some fast sense of it (see the next screen).` },
    ],
    debate: {
      title: 'Is System 1 blind to logic?',
      sideA: { label: 'System 2 is needed for logic (Evans & Curtis-Holmes, 2005)', html: `In the classic view, System 1 gives a fast, belief-based answer and System 2 may step in later to check the logic. Evans and Curtis-Holmes supported this: when participants had to answer within about 10 seconds, belief-based answers increased and logic-based answers fell. Cutting System 2’s time seemed to leave only belief.` },
      sideB: { label: 'Some logic may be intuitive (De Neys and colleagues)', html: `Studies by Wim De Neys and colleagues found that people who give the belief-based answer on conflict items still tend to be <b>slower</b> and <b>less confident</b> than on items where logic and belief agree. In some studies, many people who reached the logical answer already gave it as a fast first response. This suggests System 1 may pick up some logical structure, not just believability.` },
      why: [
        { factor: 'What is measured', html: `Evans and Curtis-Holmes measured the <b>final answer</b>. De Neys and colleagues also measured <b>response time and confidence</b>. A wrong answer given with hesitation shows something that accuracy alone would miss, so the studies may be looking at different parts of the same process.` },
        { factor: 'How “fast” is defined', html: `A 10-second limit reduces System 2 time but doesn’t remove it. Later studies used much shorter deadlines, sometimes with an extra memory task, to be surer that only fast processes were at work. Different time limits could lead to different conclusions.` },
        { factor: 'Interpretation', html: `Slower, less confident belief-based answers could mean System 1 detects a logical conflict. But they could also mean System 2 started checking and then gave up. The data fit both explanations, so the disagreement is partly about interpretation.` },
        { factor: 'Individual differences', html: `Averages hide variety. Some people may have good logical intuitions while others rely only on belief. A study that averages across everyone can make the whole group look either more or less logical than any one person is.` },
        { factor: 'Sample size in brain studies', html: `Goel and Dolan (2003), often cited for the two-system view, used a small sample, as was common in early fMRI research. Small samples make findings less reliable, so the brain evidence should be treated as supportive rather than decisive.` },
      ],
      trust: `The behavioural finding that time pressure increases belief bias is well replicated, and so is the finding that people are slower and less confident on conflict items. So both sets of data are trustworthy. What is uncertain is the theory built on them: the idea that System 1 is completely blind to logic looks too simple. It is probably safest to say that belief usually dominates fast responses, but that some sensitivity to logic can be fast too. The small-sample brain evidence is the weakest link and should carry the least weight.`,
      ask: 'If people feel uneasy about a conflict item even when they get it wrong, does that mean System 1 “knows” some logic, or that System 2 started and gave up?',
    },
    quiz: {
      core: [
        { q: 'What is <b>belief bias</b>?', a: 'Judging whether an argument is logically valid by whether its conclusion is believable', d: ['Trusting information more when it comes from an expert or authority figure', 'Holding on to a belief after the evidence for it has been shown to be false', 'Looking only for information that supports what you already believe'], why: 'Belief bias is about letting the believability of the conclusion stand in for a judgement of logic.' },
        { q: '“All flowers need water. Roses need water. Therefore roses are flowers.” Is this valid?', a: 'Invalid: the premises allow roses to be something else that needs water', d: ['Valid: roses really are flowers, so the argument works', 'Valid: both of the premises are true in real life', 'Invalid: the first premise is false in real life'], why: 'The conclusion is true, but it isn’t forced by the premises. Other things need water too.' },
        { q: '“All mammals can fly. Whales are mammals. Therefore whales can fly.” Is this valid?', a: 'Valid: if the premises were true, the conclusion would have to be true', d: ['Invalid: whales cannot fly, so the conclusion is false', 'Invalid: the first premise is false, so the argument fails', 'Valid: some mammals, such as bats, really can fly'], why: 'Validity is about structure. The false premise makes the conclusion false, but the logic is sound.' },
        { q: 'In <b>Evans, Barston & Pollard (1983)</b>, which finding shows belief bias most clearly?', a: 'Invalid arguments with believable conclusions were accepted about 71% of the time', d: ['Valid arguments with believable conclusions were accepted about 89% of the time', 'Invalid arguments with unbelievable conclusions were accepted about 71% of the time', 'All four types of argument were accepted at roughly the same rate'], why: 'Invalid arguments should be rejected. Accepting 71% of them because the conclusion sounds right is belief overriding logic.' },
        { q: 'What did <b>Evans & Curtis-Holmes (2005)</b> find?', a: 'Under a short time limit, belief-based answers increased and logic-based answers decreased', d: ['Under a short time limit, people reasoned more logically because beliefs had no time to act', 'Time limits made no difference to the amount of belief bias people showed', 'With unlimited time, people relied more on their beliefs and less on logic'], why: 'Time pressure limits System 2, so System 1’s belief-based answer wins more often.' },
        { q: 'Why does the time-pressure finding support dual process theory?', a: 'System 2 needs time, so limiting time leaves System 1’s belief-based answer in charge', d: ['System 1 needs time, so limiting time leaves System 2’s logical answer in charge', 'Time pressure raises motivation, which switches System 2 on more strongly', 'Time pressure affects memory rather than reasoning, so only one system is involved'], why: 'If limiting time increases belief bias, the process being cut short is the slow, logical one.' },
        { q: 'In <b>Goel & Dolan (2003)</b>, which area was more active when participants <b>overrode</b> belief and answered logically?', a: 'The right lateral prefrontal cortex', d: ['The ventromedial prefrontal cortex', 'The left temporal lobe', 'The hippocampus'], why: 'Right lateral PFC when logic won; ventromedial PFC (linked with emotion) when belief won.' },
        { q: 'Which arguments are <b>conflict items</b>?', a: 'Valid-unbelievable and invalid-believable, because logic and belief give different answers', d: ['Valid-believable and invalid-unbelievable, because logic and belief give different answers', 'Any argument with a premise that is false in real life', 'Any argument that takes longer than ten seconds to read'], why: 'On conflict items System 1 (belief) and System 2 (logic) disagree, so System 2 has to override System 1.' },
        { q: 'De Neys and colleagues found that people who gave belief-based answers on conflict items were slower and less confident. What might this suggest?', a: 'Some fast sensitivity to logic may exist, even when the final answer is wrong', d: ['System 2 played no part at all in any of their reasoning', 'Belief bias only appears when people are given plenty of time', 'Confidence ratings cannot be used in reasoning research at all'], why: 'Hesitation on a wrong answer hints that something noticed the conflict with logic, although System 2 starting and giving up is another possible explanation.' },
      ],
      extra: [
        { q: '“All students who revise pass the exam. Maya passed the exam. Therefore Maya revised.” Is this valid?', a: 'Invalid: Maya could have passed without revising', d: ['Valid: passing the exam proves that Maya revised', 'Valid: both premises sound believable', 'Invalid: the first premise is unlikely to be true'], why: 'Same structure as the roses argument. Passing is compatible with not revising.' },
        { q: 'A voter rates an argument as “very logical” mainly because it supports the party she already votes for. This is an example of…', a: 'belief bias: the appeal of the conclusion is driving her judgement of the logic', d: ['framing: the argument was worded in a positive way that made it persuasive', 'anchoring: she heard her party’s view first and adjusted too little from it', 'base-rate neglect: she ignored how many people vote for each party'], why: 'She is judging the reasoning by whether she likes where it ends up.' },
        { q: 'Which pattern of results would show <b>no</b> belief bias at all?', a: 'Valid arguments accepted equally often whether or not the conclusion is believable', d: ['Believable conclusions accepted more often than unbelievable ones', 'Invalid-believable arguments accepted more often than valid-unbelievable ones', 'Unbelievable conclusions rejected regardless of the logic'], why: 'If believability had no effect, only validity would change acceptance rates.' },
        { q: 'People with higher cognitive ability and a stronger need for cognition tend to show less belief bias. What does this suggest?', a: 'Some people are more able or more willing to use System 2 to override belief', d: ['Belief bias only affects people with low intelligence', 'Belief bias is caused by a lack of knowledge about the topic', 'High ability makes System 1 faster, so it wins more often'], why: 'Overriding System 1 takes effort and capacity. Individual differences affect how often System 2 steps in.' },
        { q: 'Why should Goel & Dolan’s (2003) findings be interpreted with caution?', a: 'fMRI shows areas active at the same time as a process, not that they cause it', d: ['The study used no conflict items, so belief could not be measured at all', 'All of the participants were patients with damage to the frontal lobe', 'fMRI can only measure activity in the brain stem, not the cortex'], why: 'Brain imaging is correlational. It fits a two-system view but doesn’t prove it.' },
        { q: 'Evans & Curtis-Holmes changed the time allowed; Goel & Dolan recorded brain activity. Which concept explains why only the first supports a cause-and-effect claim?', a: 'Causality: only a variable the researcher manipulates allows a causal conclusion', d: ['Measurement: brain scanners cannot record activity in the frontal lobes', 'Perspective: biological studies are always less valid than cognitive ones', 'Change: brain activity changes too quickly for any scanner to measure'], why: 'Manipulating time is an experiment. Recording brain activity alongside answers is correlational.' },
      ],
    },
  });
})();
