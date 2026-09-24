/* Station 6 — Availability heuristic: letters, word lists and causes of death. */
(function () {
  const { ui, util } = DPT;
  const { esc } = util;

  const LETTERS = {
    learn: { L: 'R', first: ['red', 'run', 'rain', 'river'], third: ['are', 'for', 'word', 'very', 'more', 'park'] },
    teach: { L: 'K', first: ['kind', 'keep', 'king', 'kite'], third: ['ask', 'make', 'like', 'take', 'bike', 'joke'] },
  };

  // Approximate yearly deaths in the USA. Only comparisons that are true by a wide margin.
  const DEATHS = {
    learn: [
      { id: 'tornado', a: 'Tornadoes', b: 'Asthma', note: 'Asthma: roughly 3,500–4,000 deaths a year. Tornadoes: usually fewer than 100, though it varies a lot from year to year.' },
      { id: 'homicide', a: 'Homicide (murder)', b: 'Diabetes', note: 'Diabetes: around 100,000 deaths a year as the main cause. Homicide: roughly 20,000–25,000. Diabetes kills several times more people.' },
      { id: 'shark', a: 'Shark attacks', b: 'Lightning strikes', note: 'Lightning: around 20 deaths a year. Shark attacks: usually 0–2.' },
    ],
    teach: [
      { id: 'plane', a: 'Plane crashes', b: 'Car crashes', note: 'Car crashes: around 40,000 deaths a year. Crashes of passenger airlines: very few, and in many years none at all.' },
      { id: 'fire', a: 'House fires', b: 'Accidental falls', note: 'Falls (mostly older people): over 40,000 deaths a year. Home fires: roughly 3,000.' },
      { id: 'flood', a: 'Floods', b: 'Extreme heat', note: 'Heat: well over 1,000 deaths a year recently. Floods: usually around 100.' },
    ],
  };
  // In every pair the correct answer is `b` (the quieter, less reported cause). Display order is shuffled.

  const ROUND_SECS = 20;

  const STYLE = `<style>
    .av-words{display:flex;flex-wrap:wrap;gap:6px;min-height:40px;margin:10px 0;padding:10px;border:1px dashed var(--line-2);border-radius:12px;background:var(--paper)}
    .av-w{font-family:var(--f-mono);font-size:14px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent-ink)}
    .av-count{font-family:var(--f-display);font-weight:900;font-size:42px;line-height:1;color:var(--accent)}
    .av-msg{min-height:1.5em;font-size:14.5px;color:var(--muted)}
    .av-big{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,8vw,72px);color:var(--accent);line-height:1}
    .av-pair{margin:14px 0 20px}
    .av-pair .choice{text-align:center;font-weight:700}
    .av-table{width:100%;border-collapse:collapse;margin:14px 0;font-size:15.5px}
    .av-table th{text-align:left;font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding:6px 8px}
    .av-table td{padding:10px 8px;border-top:1px solid var(--line);vertical-align:top}
    .av-table .mark{font-size:22px;font-weight:900}
    .av-table tr.ok .mark{color:var(--good)} .av-table tr.no .mark{color:var(--bad)}
  </style>`;

  function cleanWord(w) { return String(w).toLowerCase().replace(/[^a-z]/g, ''); }

  function experiment(el, ctx) {
    const letter = LETTERS[ctx.mode];
    const L = letter.L, l = L.toLowerCase();
    const pairs = util.shuffle(DEATHS[ctx.mode]).map(p => ({ ...p, order: util.coin() ? ['a', 'b'] : ['b', 'a'] }));
    const res = { mode: ctx.mode, L };

    /* Part A: the letter question */
    function partA() {
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 1 of 3</p>
        <h2 class="screen-title">A question about letters</h2>
        <div class="task-card big-q">Think about ordinary English text, such as a novel or a newspaper. Is the letter <b>${L}</b> more likely to appear as the <b>first</b> letter of a word, or as the <b>third</b> letter?</div>
        <p class="prose">Don't count anything. Just give your best judgement.</p>
        <div class="choice-grid">
          <button class="choice" data-v="first">More often <b>first</b> (like <i>${letter.first[0]}</i>)</button>
          <button class="choice" data-v="third">More often <b>third</b> (like <i>${letter.third[0]}</i>)</button>
        </div>
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>Lock in my answer</button></div>`;
      let v = null;
      const lock = el.querySelector('#lock');
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => {
        v = b.dataset.v;
        el.querySelectorAll('.choice').forEach(x => x.classList.toggle('selected', x === b));
        lock.disabled = false;
      });
      lock.onclick = () => { res.partA = v; roundIntro(1); };
    }

    /* Part B: two timed word-generation rounds */
    const rounds = {
      1: { key: 'firstWords', pos: 0, label: `words that <b>start</b> with ${L}`, eg: `${letter.first.slice(0, 2).join(', ')} …`, bad: w => `“${esc(w)}” doesn't start with ${L}` },
      2: { key: 'thirdWords', pos: 2, label: `words with ${L} as the <b>third</b> letter`, eg: `${letter.third.slice(0, 2).join(', ')} …`, bad: w => `“${esc(w)}” doesn't have ${L} as its third letter` },
    };

    function roundIntro(n) {
      const r = rounds[n];
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 2 of 3 · Round ${n} of 2</p>
        <h2 class="screen-title">Word race ${n}</h2>
        <p class="prose">You'll have <b>${ROUND_SECS} seconds</b> to type as many ${r.label} as you can. Examples: <i>${r.eg}</i> (you can't use these two).</p>
        <p class="prose">Press <b>space</b> or <b>Enter</b> after each word. Words need at least 3 letters.</p>
        <div class="btn-row"><button class="btn primary big" id="go">Start the ${ROUND_SECS} seconds</button></div>`;
      el.querySelector('#go').onclick = () => runRound(n);
    }

    function runRound(n) {
      const r = rounds[n];
      const banned = new Set((n === 1 ? letter.first : letter.third).slice(0, 2));
      const words = [];
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 2 of 3 · Round ${n} of 2</p>
        <h2 class="screen-title">Type ${r.label}</h2>
        <div class="timer"><div id="bar"></div></div>
        <div class="input-row">
          <input class="input" id="w" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type a word, then space">
          <span class="countdown" id="cd">${ROUND_SECS}s</span>
          <span class="av-count" id="cnt">0</span>
        </div>
        <div class="av-msg" id="msg"></div>
        <div class="av-words" id="list"></div>`;
      const input = el.querySelector('#w');
      const msg = el.querySelector('#msg');
      const list = el.querySelector('#list');
      const bar = el.querySelector('#bar');
      const cd = el.querySelector('#cd');
      const cnt = el.querySelector('#cnt');
      input.focus();

      function add(raw) {
        const w = cleanWord(raw);
        if (!w) return;
        if (w.length < 3) { msg.textContent = `“${w}” is too short (3 letters minimum)`; return; }
        if (w[r.pos] !== l) { msg.innerHTML = r.bad(w); return; }
        if (banned.has(w)) { msg.textContent = `“${w}” was an example, so it doesn't count`; return; }
        if (words.includes(w)) { msg.textContent = `You already have “${w}”`; return; }
        words.push(w);
        msg.textContent = '';
        list.insertAdjacentHTML('beforeend', `<span class="av-w">${esc(w)}</span>`);
        cnt.textContent = words.length;
      }
      input.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          add(input.value);
          input.value = '';
        }
      });
      input.addEventListener('input', () => {
        if (/[\s,]/.test(input.value)) {
          const parts = input.value.split(/[\s,]+/);
          const last = parts.pop();
          parts.forEach(add);
          input.value = last;
        }
      });

      const start = Date.now();
      const tick = setInterval(() => {
        const left = Math.max(0, ROUND_SECS * 1000 - (Date.now() - start));
        bar.style.width = (left / (ROUND_SECS * 10)) + '%';
        cd.textContent = Math.ceil(left / 1000) + 's';
        if (left <= 0) {
          clearInterval(tick);
          add(input.value);
          input.value = '';
          input.disabled = true;
          res[r.key] = words.slice();
          el.insertAdjacentHTML('beforeend', `<p class="feedback">Time's up! You found <b>${words.length}</b>.</p>
            <div class="btn-row"><button class="btn primary big" id="cont">${n === 1 ? 'On to round 2' : 'On to part 3'}</button></div>`);
          el.querySelector('#cont').onclick = () => (n === 1 ? roundIntro(2) : partC());
        }
      }, 100);
    }

    /* Part C: causes of death */
    function partC() {
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 3 of 3</p>
        <h2 class="screen-title">Which kills more people?</h2>
        <p class="prose">For each pair, choose the cause that kills <b>more people per year in the USA</b>. Go with your gut.</p>
        ${pairs.map((p, i) => `<div class="av-pair" data-i="${i}">
          <div class="choice-grid">${p.order.map(k => `<button class="choice" data-k="${k}">${p[k]}</button>`).join('')}</div></div>`).join('')}
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>Lock in my answers</button></div>`;
      const picks = {};
      const lock = el.querySelector('#lock');
      el.querySelectorAll('.av-pair').forEach(box => {
        const i = +box.dataset.i;
        box.querySelectorAll('.choice').forEach(b => b.onclick = () => {
          picks[i] = b.dataset.k;
          box.querySelectorAll('.choice').forEach(x => x.classList.toggle('selected', x === b));
          lock.disabled = Object.keys(picks).length < pairs.length;
        });
      });
      lock.onclick = () => {
        res.deaths = pairs.map((p, i) => ({ id: p.id, pick: picks[i], correct: picks[i] === 'b' }));
        finish();
      };
    }

    function finish() {
      res.deathScore = res.deaths.filter(d => d.correct).length;
      ctx.pool.add({ L, saidFirst: res.partA === 'first', n1: res.firstWords.length, n3: res.thirdWords.length, deathScore: res.deathScore });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">All three parts done</h2>
        <p class="prose">Press <b>Next</b> to see the right answers, and what your word races reveal about how your brain judged them.</p>`;
      ctx.done(res);
    }

    partA();
  }

  const pairOf = (mode, id) => DEATHS[mode].find(p => p.id === id);

  function deathsTable(res) {
    return `<table class="av-table"><thead><tr><th>Pair</th><th>You said</th><th>Actually more deaths</th><th></th></tr></thead><tbody>
      ${res.deaths.map(d => {
        const p = pairOf(res.mode, d.id);
        return `<tr class="${d.correct ? 'ok' : 'no'}"><td>${p.a} vs ${p.b}</td><td>${p[d.pick]}</td><td><b>${p.b}</b><br><span class="muted" style="font-size:14px">${p.note}</span></td><td class="mark">${d.correct ? '✓' : '✗'}</td></tr>`;
      }).join('')}</tbody></table>`;
  }

  function reveal(res, ctx) {
    const L = res.L;
    const letter = LETTERS[res.mode];
    const n1 = res.firstWords.length, n3 = res.thirdWords.length;
    const pool = ctx.pool.all();
    const saidFirstPct = util.pct(pool.filter(p => p.saidFirst).length, pool.length);
    const m1 = util.mean(pool.map(p => p.n1)), m3 = util.mean(pool.map(p => p.n3));
    const mMax = Math.max(m1 || 0, m3 || 0, 1);

    const aVerdict = res.partA === 'first'
      ? `You said <b>first</b>. Most people do, and most people are wrong. ${L} is more common as the <b>third</b> letter (think <i>${letter.third.slice(0, 4).join(', ')}</i>).`
      : `You said <b>third</b>, which is correct. Most people say first. ${L} really is more common in third position (think <i>${letter.third.slice(0, 4).join(', ')}</i>).`;

    const bVerdict = n1 > n3
      ? `You found <b>${n1}</b> words starting with ${L} but only <b>${n3}</b> with ${L} third. Yet words with ${L} third are <b>more common</b>. They were just harder to <b>find in memory</b>.`
      : n1 === n3
        ? `You found the same number of each (${n1}). Most people find far more words starting with the letter. Words with ${L} third are more common but much harder to search for.`
        : `You found more words with ${L} third (${n3}) than starting with ${L} (${n1}). That's unusual: most people find starting words much easier to call up.`;

    return `${STYLE}
      <h3>Part 1: the letter ${L}</h3>
      ${ui.callout(res.partA === 'first' ? 's1' : 'tip', aVerdict)}
      <h3>Part 2: your word races</h3>
      <div class="stat-row">
        ${ui.stat(n1, `words starting with ${L}`, 's1')}
        ${ui.stat(n3, `words with ${L} third`, 's2')}
      </div>
      ${ui.callout('key', bVerdict)}
      <h3>Part 3: causes of death · ${res.deathScore} / 3 correct</h3>
      ${deathsTable(res)}
      <h3>Everyone at this station so far</h3>
      ${ui.bars([
        { label: `Said the letter is more common first`, value: saidFirstPct, max: 100, text: saidFirstPct + '%', cls: 's1' },
        { label: 'Mean words found: first letter', value: m1 || 0, max: mMax, text: util.fmt(m1, 1), cls: 's1' },
        { label: 'Mean words found: third letter', value: m3 || 0, max: mMax, text: util.fmt(m3, 1), cls: 's2' },
      ])}
      ${ui.poolNote(pool.length)}
      <p class="muted" style="font-size:14.5px">Original study (Tversky &amp; Kahneman, 1973): about two-thirds of participants judged the first position more likely, for letters that are actually more common in third position.</p>`;
  }

  function mechanismVisual(res) {
    const n1 = res.firstWords.length, n3 = res.thirdWords.length;
    return `${ui.bars([
        { label: `Easy to recall: ${res.L} first`, value: n1, max: Math.max(n1, n3, 1), text: String(n1), cls: 's1' },
        { label: `Hard to recall: ${res.L} third`, value: n3, max: Math.max(n1, n3, 1), text: String(n3), cls: 's2' },
      ])}
      <div class="s1s2">
        <div class="sys s1"><div class="sys-tag"><span class="sys-dot"></span>Question System 1 answers</div><p>“Which examples come to mind more <b>easily</b>?”</p></div>
        <div class="sys s2"><div class="sys-tag"><span class="sys-dot"></span>Question you were asked</div><p>“Which is actually more <b>common</b>?”</p></div>
      </div>`;
  }

  DPT.register({
    id: 'availability', num: 6, hue: 160, minutes: 15,
    title: 'What Comes to Mind',
    bias: 'Availability heuristic',
    hook: 'Sharks or lightning? The answer that springs to mind first is often the wrong one.',
    intro: {
      learn: `<p>This experiment has three short parts: a question about letters, two 20-second word races, and a quiz about causes of death.</p>
        <p>Answer quickly and honestly. The word races need a keyboard, so make sure you can type comfortably.</p>`,
      teach: `<p><b>Host tip:</b> your guest gets the letter <b>K</b> and different causes of death from the ones you had. Watch how many words they find in each race. The gap between the two counts is the key to your explanation.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'The right answers',
        html: res => `<p>Let's start with the facts.</p>
          ${ui.steps([
            `<b>The letter ${res.L}</b> appears more often as the <b>third</b> letter of English words than as the first. Very common words like <i>${LETTERS[res.mode].third.join(', ')}</i> all have ${res.L} in third place.`,
            `<b>Causes of death:</b> in every pair, the quieter cause kills more people. ${DEATHS[res.mode].map(p => `${p.b} kills more than ${p.a.toLowerCase()}`).join('; ')}.`,
            `The wrong answers all have something in common: they are the options that are <b>easier to picture or remember</b>.`,
          ])}
          ${deathsTable(res)}`,
      },
      {
        kicker: 'The mechanism', title: 'Your word races show what went on',
        html: res => `<p>The word races were not a vocabulary test. They showed you <b>how easy it is to pull each kind of word out of memory</b>.</p>
          ${mechanismVisual(res)}
          ${ui.steps([
            `Your memory for words works a bit like a dictionary: it is easy to search by <b>first</b> letter, and very hard to search by third letter.`,
            `So when you are asked “first or third?”, examples of the first kind flood into your mind, and examples of the third kind barely come at all.`,
            `System 1 notices that feeling of ease and uses it as the answer: “lots of examples came quickly, so it must be common”.`,
            `But how easy something is to <b>find</b> is not the same as how often it <b>occurs</b>.`,
          ])}`,
      },
      {
        kicker: 'System 1 vs System 2', title: 'Swapping a hard question for an easy one',
        html: res => `<p>“How often does ${res.L} appear in third position across all English text?” is a very hard question. Nobody has those counts in their head. So System 1 quietly answers an easier one.</p>
          ${ui.s1s2(
            `<p><b>Substitutes the question.</b> Instead of “which is more common?”, it asks “which can I think of more easily?”</p><p>Words starting with ${res.L}: loads, instantly. Tornadoes and shark attacks: vivid news images. Asthma and diabetes: nothing dramatic comes to mind.</p><p>The answer comes fast and feels certain.</p>`,
            `<p><b>Questions the feeling.</b> “Am I remembering these because they are common, or because they are easy to recall? Shark attacks are in the news <i>because</i> they are rare.”</p><p>It might look for real data or think of the many everyday words with ${res.L} in third place.</p><p>That takes effort, so it rarely happens.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> this swap is called <b>attribute substitution</b>. System 1 replaces a hard judgement (frequency) with an easy one (ease of recall) and doesn't tell you it has done so.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'The availability heuristic',
        html: `${ui.define('Availability heuristic', 'A mental shortcut in which we judge how <b>frequent or likely</b> something is by how <b>easily examples come to mind</b>. It often works, but it leads to errors when something is easy to recall for reasons other than being common.')}
          ${ui.steps([
            '<b>Situation:</b> you need to judge how common or likely something is, without the real figures.',
            '<b>System 1 shortcut:</b> “if examples come to mind easily, it must be common”.',
            '<b>Result:</b> things that are vivid, recent, emotional or often in the news are overestimated. Quiet, everyday things are underestimated.',
            '<b>System 2 failure:</b> the answer feels right, so nobody asks <i>why</i> it came to mind so easily.',
          ])}
          ${ui.callout('tip', `<b>Heuristic, not always a bias.</b> Common things usually <i>are</i> easier to recall, so the shortcut is often useful. It becomes a bias when ease of recall and real frequency come apart.`)}`,
      },
      {
        kicker: 'The evidence', title: 'Three key studies',
        html: `${ui.study({ name: 'Tversky & Kahneman (1973)', rows: [
            ['Aim', 'To test whether people judge frequency by how easily examples can be brought to mind.'],
            ['Method', 'Participants were asked whether the letters K, L, N, R and V were more likely to appear in the first or the third position of English words. All five are actually more common in third position.'],
            ['Findings', 'About <b>two-thirds</b> of participants judged the first position to be more likely for most of the letters, and on average they thought first position was about twice as common.'],
            ['Link', 'Words are easier to retrieve by their first letter. System 1 used that ease of retrieval as a stand-in for frequency.'],
          ] })}
          ${ui.study({ name: 'Lichtenstein et al. (1978)', rows: [
            ['Method', 'Participants estimated how many people die each year in the USA from many different causes, and compared pairs of causes.'],
            ['Findings', 'Dramatic causes that get lots of media attention (tornadoes, floods, homicide, accidents) were <b>overestimated</b>. Common but “quiet” causes (diabetes, asthma, stroke) were <b>underestimated</b>.'],
            ['Link', 'Vivid, well-reported deaths are easy to recall, so System 1 judges them to be more frequent than they are.'],
          ] })}
          ${ui.study({ name: 'Schwarz et al. (1991)', rows: [
            ['Method', 'Participants were asked to recall either <b>6</b> or <b>12</b> examples of times they had behaved assertively, then rate how assertive they were.'],
            ['Findings', 'Those who recalled <b>6</b> examples rated themselves as <b>more</b> assertive than those who recalled 12. Finding 12 examples was hard, and that difficulty made people feel less assertive.'],
            ['Link', 'The judgement was driven by the <b>ease</b> of recall, not the <b>number</b> of examples recalled. This separates the two and gives strong support for the availability heuristic.'],
          ] })}`,
      },
      {
        kicker: 'Why we do it · real world', title: 'Why ease of recall wins, and where it misleads us',
        html: `${ui.steps([
            `<b>Cognitive miser.</b> Counting real frequencies is slow and usually impossible. A feeling of ease is instantly available, so System 1 uses it.`,
            `<b>It often works.</b> Things we meet often usually are easier to recall, so the shortcut is right much of the time. That's why the brain keeps using it.`,
            `<b>Media and vividness distort it.</b> News reports what is rare and dramatic. Emotional, vivid events are stored more strongly and recalled more easily, so they feel more common than they are.`,
          ])}
          <h3>Availability in everyday life</h3>
          <div class="two-col">
            <div class="card"><b>Fear of flying</b><br>After a plane crash is widely reported, some people choose to drive instead, even though driving is far more dangerous per journey.</div>
            <div class="card"><b>The lottery</b><br>Winners are shown on TV; the millions of losers never are. Winning feels more likely than it is.</div>
            <div class="card"><b>Sharks</b><br>A single shark attack can make headlines around the world. Many swimmers worry more about sharks than about drowning, which kills far more people.</div>
            <div class="card"><b>Crime</b><br>People who watch a lot of crime news often believe crime is rising, even in years when it is falling.</div>
          </div>`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li><b>Schwarz et al. (1991)</b> cleverly separates <i>ease</i> of recall from <i>amount</i> recalled, so it tests the mechanism directly.</li><li><b>Converging evidence</b> from very different tasks: letters, causes of death and judgements about yourself.</li><li>Clear <b>real-world relevance</b> to how people judge risk.</li></ul>`,
            `<ul><li><b>Artificial tasks:</b> judging letter positions has little to do with everyday life, and participants had no reason to try hard.</li><li>In many real situations, ease of recall and actual content are <b>hard to separate</b>: we recall more examples of common things.</li><li>Seeing something often in the media is also <b>real information</b>, so using it is not always irrational.</li><li>Later research has questioned whether the letter effect is as strong or as general as first reported.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> the availability heuristic is a clear example of System 1 using <i>attribute substitution</i>: it answers an easy question (how easily can I recall examples?) in place of a hard one (how common is it?).`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The right answers', hint: 'The letter is more common in <b>third</b> position. In every death pair, the quiet cause (asthma, diabetes, lightning / car crashes, falls, heat) kills more.' },
        { point: 'What the word races showed', hint: 'Far more words starting with the letter came to mind. Easy to find in memory ≠ more common.' },
        { point: 'What System 1 did', hint: 'Swapped “which is more common?” for “which can I think of more easily?” (attribute substitution).' },
        { point: 'What System 2 would have done', hint: 'Asked <i>why</i> examples came to mind so easily, and looked for real data.' },
        { point: 'Name it: availability heuristic', hint: 'Judging how frequent or likely something is by how easily examples come to mind.' },
        { point: 'The studies', hint: 'Tversky & Kahneman (1973): letters, about 2/3 wrong. Lichtenstein et al. (1978): dramatic deaths overestimated. Schwarz et al. (1991): 6 examples → more assertive than 12.' },
        { point: 'A real-world example', hint: 'Fear of flying after crash coverage; overestimating lottery wins; shark fear.' },
      ],
      visual: res => mechanismVisual(res),
      ask: [
        'Why did you think the letter was more common first?',
        'Which race was harder? What does that tell you?',
        'Why do you think tornadoes and sharks feel more deadly than asthma and lightning?',
      ],
    },
    quiz: {
      core: [
        { q: 'What is the <b>availability heuristic</b>?', a: 'Judging how frequent or likely something is by how easily examples come to mind', d: ['Choosing options because they match the words used in a problem', 'Making different choices when the same facts are described differently', 'Judging probability by how much something resembles a stereotype'], why: 'Availability = ease of recall used as a stand-in for frequency.' },
        { q: 'What did <b>Tversky & Kahneman (1973)</b> find in the letter task?', a: 'Most people judged the letters more common in first position, although they are more common in third', d: ['Most people correctly judged the letters more common in third position', 'People could recall more words with the letter in third position', 'People judged all letters equally common in every position'], why: 'About two-thirds chose first position, because words are easier to retrieve by their first letter.' },
        { q: 'Why is it easier to think of words that <b>start</b> with R than words with R in third place?', a: 'Memory lets us search for words by their first letter far more easily', d: ['Words that start with R are much more common in English', 'Words with R in third place are always longer and rarer', 'People learn words that start with R earlier in childhood'], why: 'It is about how memory is searched, not how common the words are. R-third words are actually more common.' },
        { q: 'Which question does System 1 answer <b>instead of</b> “Which is more common?”', a: '“Which examples can I think of more easily?”', d: ['“Which option did I see first?”', '“Which option matches the words in the question?”', '“Which option would most other people choose?”'], why: 'This swap of a hard question for an easy one is called attribute substitution.' },
        { q: 'What did <b>Lichtenstein et al. (1978)</b> find about judgements of causes of death?', a: 'Dramatic, well-reported causes were overestimated and quiet causes were underestimated', d: ['People estimated almost every cause of death accurately', 'Quiet causes like diabetes were overestimated', 'People overestimated only causes that affected them personally'], why: 'Tornadoes and homicide are vivid and in the news, so they are easy to recall. Diabetes and asthma are not.' },
        { q: 'In <b>Schwarz et al. (1991)</b>, participants who recalled <b>6</b> examples of their own assertive behaviour rated themselves…', a: 'as more assertive than those who recalled 12', d: ['as less assertive than those who recalled 12', 'exactly as assertive as those who recalled 12', 'as more assertive only if they recalled them quickly'], why: 'Recalling 12 examples was difficult. That difficulty felt like evidence of not being very assertive.' },
        { q: 'Why is <b>Schwarz et al. (1991)</b> especially strong evidence for the availability heuristic?', a: 'It separates the ease of recall from the number of examples recalled', d: ['It used a very large sample from many countries', 'It measured brain activity during recall with fMRI', 'It showed that people can recall unlimited examples'], why: 'People who recalled more examples judged themselves lower, so it must be the ease, not the amount, that drives the judgement.' },
        { q: 'After a plane crash is shown on the news for days, many people feel flying is dangerous and choose to drive. What explains this?', a: 'The availability heuristic, because vivid coverage makes plane crashes easy to recall', d: ['The framing effect, because flying is described as safe', 'Matching bias, because the news matches their beliefs', 'Their System 2 has calculated the real risk of each option'], why: 'Vivid, recent, emotional events are easy to recall, so System 1 judges them to be common. Driving is far more dangerous per journey.' },
        { q: 'Which is a <b>limitation</b> of the availability research?', a: 'Tasks like judging letter positions are artificial and may not reflect real decisions', d: ['No study has ever found evidence for the availability heuristic', 'It only used participants who were afraid of flying', 'It shows that System 2 is always faster than System 1'], why: 'Low-stakes lab tasks give participants little reason to think carefully, which limits generalisation.' },
      ],
      extra: [
        { q: 'Tversky & Kahneman also asked about the letter <b>K</b>. Which set of words has K in <b>third</b> position?', a: 'ask, make, like', d: ['kite, keep, kind', 'book, milk, park', 'knee, king, key'], why: 'A-S-K, M-A-K-E, L-I-K-E: the K is the third letter. These words are common but hard to search for.' },
        { q: 'A student is asked to list <b>ten</b> reasons why she is a good friend and struggles to finish. What does the availability heuristic predict?', a: 'She will rate herself as a worse friend than if she had listed three', d: ['She will rate herself as a better friend than if she had listed three', 'Her rating will not change, because the facts are the same', 'She will rate herself higher because she tried so hard'], why: 'Like Schwarz et al. (1991): the difficulty of recalling examples is taken as evidence against the trait.' },
        { q: 'TV shows lottery winners but never the millions who lose. How does this affect people’s judgements?', a: 'Winning becomes easy to imagine, so people overestimate their chances', d: ['People underestimate their chances because winning seems unusual', 'People judge their chances accurately because they know the odds', 'People stop buying tickets because the winners look unhappy'], why: 'Vivid examples of winners are easy to recall; the losers are invisible. Ease of recall inflates the perceived probability.' },
        { q: 'Why is the availability heuristic often <b>useful</b> rather than harmful?', a: 'Things we meet often usually are easier to recall, so ease is often a good clue', d: ['It is always more accurate than careful counting', 'It is only used by experts who have seen real data', 'It forces System 2 to check every judgement carefully'], why: 'Heuristics survive because they usually work. They cause bias when ease of recall is driven by something other than frequency, such as media coverage.' },
        { q: 'A critic says: “In real life, we remember more examples of things that really are common, so ease and amount can’t be separated.” Which study best answers this?', a: 'Schwarz et al. (1991), where fewer examples led to higher ratings', d: ['Tversky & Kahneman (1973), where letters were judged by position', 'Lichtenstein et al. (1978), where deaths were estimated', 'Griggs & Cox (1982), where the rule was about drinking age'], why: 'In Schwarz et al., recalling fewer examples (but more easily) produced a stronger judgement, so ease can be separated from amount.' },
      ],
    },
  });
})();
