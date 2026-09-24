/* Station 7 — Representativeness heuristic and the conjunction fallacy: the Linda problem. */
(function () {
  const { ui, util } = DPT;

  // `single` = the one-part statement; `both` = the conjunction that contains it.
  const STORIES = {
    linda: {
      name: 'Linda', who: 'women', pronoun: 'she',
      text: `<p><b>Linda</b> is 31 years old, single, outspoken and very bright. She studied philosophy at university.</p>
        <p>As a student she cared deeply about discrimination and social justice, and she also joined protests against nuclear weapons.</p>`,
      gloss: 'A <i>bank teller</i> is a cashier who serves customers at the counter in a bank.',
      items: [
        { id: 'teacher', text: 'Linda is a teacher in a primary school.' },
        { id: 'bookshop', text: 'Linda works in a bookshop and takes yoga classes.' },
        { id: 'fem', text: 'Linda is active in the feminist movement.', role: 'fit' },
        { id: 'social', text: 'Linda is a psychiatric social worker.' },
        { id: 'insurance', text: 'Linda is an insurance salesperson.' },
        { id: 'single', text: 'Linda is a bank teller.', role: 'single' },
        { id: 'both', text: 'Linda is a bank teller and is active in the feminist movement.', role: 'both' },
      ],
      inner: ['feminist', 'bank tellers'],
      A: 'bank tellers', AB: 'bank tellers who are active feminists', fitLabel: 'active feminists',
      short: { single: 'bank teller', both: 'bank teller <i>and</i> feminist', fit: 'feminist' },
      qA: 'How many of them are <b>bank tellers</b>?',
      qAB: 'How many of them are <b>bank tellers and active in the feminist movement</b>?',
    },
    bill: {
      name: 'Bill', who: 'men', pronoun: 'he',
      text: `<p><b>Bill</b> is 34 years old. He is intelligent, but not very imaginative, rather compulsive and generally lacking in energy.</p>
        <p>At school he was good at maths but weak at social studies and the humanities.</p>`,
      gloss: '',
      items: [
        { id: 'doctor', text: 'Bill is a doctor who plays poker for a hobby.' },
        { id: 'architect', text: 'Bill is an architect.' },
        { id: 'acct', text: 'Bill is an accountant.', role: 'fit' },
        { id: 'single', text: 'Bill plays jazz for a hobby.', role: 'single' },
        { id: 'surf', text: 'Bill surfs for a hobby.' },
        { id: 'reporter', text: 'Bill is a reporter.' },
        { id: 'both', text: 'Bill is an accountant who plays jazz for a hobby.', role: 'both' },
        { id: 'climb', text: 'Bill climbs mountains for a hobby.' },
      ],
      inner: ['accountants', 'who play jazz'],
      A: 'jazz players', AB: 'accountants who play jazz', fitLabel: 'accountants',
      short: { single: 'plays jazz', both: 'accountant <i>and</i> plays jazz', fit: 'accountant' },
      qA: 'How many of them <b>play jazz for a hobby</b>?',
      qAB: 'How many of them are <b>accountants who play jazz for a hobby</b>?',
    },
  };
  const storyFor = mode => (mode === 'teach' ? 'bill' : 'linda');

  const STYLE = `<style>
    .cj-list{display:grid;gap:9px;margin:14px 0}
    .cj-item{display:flex;align-items:center;gap:12px;text-align:left;background:var(--paper);border:2px solid var(--line-2);border-radius:12px;padding:12px 16px;font-size:17px}
    .cj-item:hover:not(:disabled){border-color:var(--accent)}
    .cj-item.ranked{border-color:var(--accent);background:var(--accent-soft)}
    .cj-item:disabled{cursor:default}
    .cj-rank{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-family:var(--f-mono);background:var(--line);color:var(--muted)}
    .cj-item.ranked .cj-rank{background:var(--accent);color:#fff}
    .cj-dots{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;max-width:360px;margin:14px 0}
    .cj-dot{aspect-ratio:1;border-radius:50%;background:var(--line);border:3px solid transparent}
    .cj-dot.fit{border-color:var(--s1)}
    .cj-dot.a{background:var(--s2)}
    .cj-legend{display:flex;flex-wrap:wrap;gap:14px;font-size:14.5px;margin:6px 0 12px}
    .cj-legend span{display:inline-flex;align-items:center;gap:6px}
    .cj-legend i{display:inline-block;width:16px;height:16px;border-radius:50%;background:var(--line);border:3px solid transparent}
    .cj-freq label{display:block;font-weight:600;margin:14px 0 4px}
    .cj-freq .input{max-width:140px}
  </style>`;

  function experiment(el, ctx) {
    const key = storyFor(ctx.mode);
    const S = STORIES[key];
    const items = util.shuffle(S.items);
    const res = { mode: ctx.mode, story: key };

    function ranking() {
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 1 of 2</p>
        <h2 class="screen-title">Meet ${S.name}</h2>
        <div class="task-card">${S.text}</div>
        <p class="prose">Below are ${items.length} statements about ${S.name} today. Rank them by how <b>probable</b> they are. Tap the <b>most</b> probable first, then the next, and so on down to the <b>least</b> probable.</p>
        ${S.gloss ? `<p class="muted" style="font-size:14.5px">${S.gloss}</p>` : ''}
        <div class="cj-list">${items.map(it => `<button class="cj-item" data-id="${it.id}"><span class="cj-rank"></span><span>${it.text}</span></button>`).join('')}</div>
        <div class="btn-row">
          <button class="btn ghost" id="reset">Start ranking again</button>
          <button class="btn primary big" id="lock" disabled>Lock in my ranking</button>
        </div>`;
      const order = [];
      const lock = el.querySelector('#lock');
      const btns = [...el.querySelectorAll('.cj-item')];
      btns.forEach(b => b.onclick = () => {
        if (order.includes(b.dataset.id)) return;
        order.push(b.dataset.id);
        b.classList.add('ranked');
        b.disabled = true;
        b.querySelector('.cj-rank').textContent = order.length;
        lock.disabled = order.length < items.length;
      });
      el.querySelector('#reset').onclick = () => {
        order.length = 0;
        btns.forEach(b => { b.classList.remove('ranked'); b.disabled = false; b.querySelector('.cj-rank').textContent = ''; });
        lock.disabled = true;
      };
      lock.onclick = () => {
        res.order = order.slice();
        res.rankSingle = order.indexOf('single') + 1;
        res.rankBoth = order.indexOf('both') + 1;
        res.rankFit = order.indexOf(S.items.find(i => i.role === 'fit').id) + 1;
        res.fallacy = res.rankBoth < res.rankSingle;
        frequency();
      };
    }

    function frequency() {
      el.innerHTML = `${STYLE}
        <p class="exp-progress">Part 2 of 2</p>
        <h2 class="screen-title">Now count them</h2>
        <div class="task-card">${S.text}</div>
        <p class="prose">Imagine <b>100 ${S.who}</b> who all fit this description of ${S.name}. Give your best estimate for each question (a whole number from 0 to 100).</p>
        <div class="cj-freq">
          <label for="fa">1. ${S.qA}</label>
          <input class="input" id="fa" type="number" min="0" max="100" inputmode="numeric">
          <label for="fab">2. ${S.qAB}</label>
          <input class="input" id="fab" type="number" min="0" max="100" inputmode="numeric">
        </div>
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>Lock in my numbers</button></div>`;
      const fa = el.querySelector('#fa'), fab = el.querySelector('#fab');
      const lock = el.querySelector('#lock');
      const valid = x => Number.isFinite(x) && x >= 0 && x <= 100;
      const check = () => { lock.disabled = !(valid(util.num(fa.value)) && valid(util.num(fab.value))); };
      fa.oninput = check; fab.oninput = check;
      lock.onclick = () => {
        res.freqA = Math.round(util.num(fa.value));
        res.freqAB = Math.round(util.num(fab.value));
        res.freqFallacy = res.freqAB > res.freqA;
        finish();
      };
    }

    function finish() {
      ctx.pool.add({ story: key, fallacy: res.fallacy, freqFallacy: res.freqFallacy });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">Ranking and numbers locked in</h2>
        <p class="prose">Press <b>Next</b> to see how your ranking compares with your numbers, and with everyone else's.</p>`;
      ctx.done(res);
    }

    ranking();
  }

  /* ── Visuals ── */
  function dotGrid(S) {
    // Illustrative numbers: 100 people, 60 fit the stereotype, 8 in group A, 5 of those also fit.
    const dots = Array.from({ length: 100 }, (_, i) => {
      const a = i < 8, fit = i < 5 || (i >= 8 && i < 63);
      return `<span class="cj-dot${a ? ' a' : ''}${fit ? ' fit' : ''}"></span>`;
    }).join('');
    return `<div class="cj-dots" role="img" aria-label="100 dots: 8 are ${S.A}, 5 of those are also ${S.fitLabel}">${dots}</div>
      <div class="cj-legend">
        <span><i style="background:var(--s2)"></i>${S.A} (8)</span>
        <span><i style="border-color:var(--s1)"></i>${S.fitLabel} (60)</span>
        <span><i style="background:var(--s2);border-color:var(--s1)"></i>${S.AB} (5)</span>
      </div>`;
  }

  function nestedCircles(S) {
    return `<svg viewBox="0 0 320 220" role="img" aria-label="The smaller group sits entirely inside the larger group" style="width:100%;max-width:400px;display:block;margin:10px auto">
      <circle cx="160" cy="110" r="100" style="fill:var(--s2-soft);stroke:var(--s2);stroke-width:3"/>
      <circle cx="175" cy="135" r="48" style="fill:var(--s1-soft);stroke:var(--s1);stroke-width:3"/>
      <text x="160" y="42" text-anchor="middle" style="fill:var(--s2);font-weight:800;font-size:15px">All ${S.A}</text>
      <text x="175" y="132" text-anchor="middle" style="fill:var(--s1);font-weight:800;font-size:12.5px">${S.inner[0]}</text>
      <text x="175" y="148" text-anchor="middle" style="fill:var(--s1);font-weight:800;font-size:12.5px">${S.inner[1]}</text>
    </svg>
    <p style="text-align:center;font-weight:700;margin-top:0">The smaller circle is <b>inside</b> the bigger one. It can never be bigger.</p>`;
  }

  function visual(res) {
    const S = STORIES[res.story];
    return `${nestedCircles(S)}${dotGrid(S)}`;
  }

  function reveal(res, ctx) {
    const S = STORIES[res.story];
    const pool = ctx.pool.all();
    const mine = pool.filter(p => p.story === res.story);
    const fPct = util.pct(mine.filter(p => p.fallacy).length, mine.length);
    const qPct = util.pct(mine.filter(p => p.freqFallacy).length, mine.length);

    let verdict;
    if (res.fallacy && !res.freqFallacy) verdict = `<b>You committed the conjunction fallacy in part 1, then avoided it in part 2.</b> You ranked “${S.short.both}” as more probable than “${S.short.single}”. But when you counted, you correctly gave fewer ${S.AB} (${res.freqAB}) than ${S.A} (${res.freqA}). Same logic, different format, different answer.`;
    else if (res.fallacy) verdict = `<b>You committed the conjunction fallacy in both parts.</b> You ranked “${S.short.both}” above “${S.short.single}”, and you estimated more ${S.AB} (${res.freqAB}) than ${S.A} (${res.freqA}). That's impossible, as the next screens show.`;
    else if (res.freqFallacy) verdict = `<b>Your ranking was logical, but your numbers weren't.</b> You estimated more ${S.AB} (${res.freqAB}) than ${S.A} (${res.freqA}). That's impossible, as the next screens show. This pattern is unusual: counting normally makes the error <i>less</i> likely.`;
    else verdict = `<b>You avoided the conjunction fallacy.</b> You ranked “${S.short.single}” above “${S.short.both}”, and your numbers agree (${res.freqA} vs ${res.freqAB}). That's unusual: most people rank the combined statement higher. The next screens explain why.`;

    return `${STYLE}
      <div class="stat-row">
        ${ui.stat('#' + res.rankFit, `your rank for “${S.short.fit}”`)}
        ${ui.stat('#' + res.rankSingle, `your rank for “${S.short.single}”`, 's2')}
        ${ui.stat('#' + res.rankBoth, `your rank for “${S.short.both}”`, res.fallacy ? 'bad' : 'good')}
      </div>
      <p class="muted" style="font-size:14.5px">#1 = most probable. The fallacy is ranking “${S.short.both}” <b>higher</b> (a smaller number) than “${S.short.single}”.</p>
      ${ui.callout(res.fallacy ? 'key' : 'tip', verdict)}
      <h3>Everyone at this station so far (the ${S.name} problem)</h3>
      ${ui.bars([
        { label: 'Ranking: combined statement above single', value: fPct, max: 100, text: mine.length ? fPct + '%' : 'no data yet', cls: 's1' },
        { label: 'Counting: more in the combined group', value: qPct, max: 100, text: mine.length ? qPct + '%' : 'no data yet', cls: 's2' },
      ])}
      ${ui.poolNote(mine.length)}
      <p><b>Original study (Tversky &amp; Kahneman, 1983):</b></p>
      ${ui.bars([{ label: 'Ranked the combined statement higher', value: 85, max: 100, text: 'about 85%', cls: 'muted' }])}`;
  }

  DPT.register({
    id: 'conjunction', num: 7, hue: 320, minutes: 15,
    title: 'The Linda Problem',
    bias: 'Representativeness heuristic & the conjunction fallacy',
    hook: 'A short description, a list of jobs, and a mistake that even statistics students make.',
    intro: {
      learn: `<p>You'll read a short description of a person and rank some statements about her from most to least probable. Then you'll answer a quick counting question about the same person.</p>
        <p>Read the description carefully and go with your judgement. There is no time limit.</p>`,
      teach: `<p><b>Host tip:</b> your guest gets a different person, <b>Bill</b>, not Linda. The trap is the same: watch whether they rank “Bill is an accountant who plays jazz” above “Bill plays jazz”.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'Two things together can’t beat one thing alone',
        html: res => {
          const S = STORIES[res.story];
          return `<p>Think about every ${S.name} there could possibly be. Every one of the ${S.AB} is also one of the ${S.A}. So the ${S.AB} are a <b>smaller group inside</b> the ${S.A}.</p>
          ${nestedCircles(S)}
          ${ui.steps([
            `“${S.short.single}” is true in every case where “${S.short.both}” is true, and in some extra cases too.`,
            `So “${S.short.both}” can <b>never</b> be more probable than “${S.short.single}” alone. At most they are equally probable.`,
            `This is the <b>conjunction rule</b>: the probability of A <b>and</b> B can never be higher than the probability of A.`,
            `${res.fallacy ? `You ranked “${S.short.both}” at #${res.rankBoth} and “${S.short.single}” at #${res.rankSingle}. That breaks the rule.` : `You ranked them correctly: “${S.short.single}” at #${res.rankSingle}, above “${S.short.both}” at #${res.rankBoth}.`}`,
          ])}
          ${ui.callout('key', `<b>Adding a detail can only make a statement less probable (or leave it the same).</b> It can never make it more probable, however well the detail fits.`)}`;
        },
      },
      {
        kicker: 'System 1’s shortcut', title: 'You judged how well the description fitted',
        html: res => {
          const S = STORIES[res.story];
          const lin = res.story === 'linda';
          return `<p>The description of ${S.name} was written to fit a stereotype. ${lin ? 'Linda sounds like a typical feminist activist and nothing like a typical bank teller.' : 'Bill sounds like a typical accountant and nothing like a typical jazz musician.'} ${res.rankFit <= 2 ? `You ranked “${S.short.fit}” near the top (#${res.rankFit}), like most people.` : ''}</p>
          ${ui.s1s2(
            `<p><b>Asks “how similar?”</b> “${S.short.single}” on its own doesn't match the description at all. Add “${S.short.fit}” and suddenly the picture fits much better.</p><p>A better fit <b>feels</b> more likely, so System 1 ranks the combined statement higher. It answers instantly and confidently.</p>`,
            `<p><b>Asks “how probable?”</b> “Every ${lin ? 'feminist bank teller is a bank teller' : 'accountant who plays jazz is someone who plays jazz'}. So the combined statement can't be more probable.”</p><p>That requires ignoring the vivid description and applying a rule. It takes effort, and the story is so convincing that most people never do it.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> System 1 swapped the hard question (“how probable is this?”) for an easier one (“how much does this resemble my picture of ${S.name}?”). This is <b>attribute substitution</b> again.`)}`;
        },
      },
      {
        kicker: 'The twist', title: 'Why counting helps',
        html: res => {
          const S = STORIES[res.story];
          return `<p>In part 2 you answered exactly the same question, but as <b>numbers out of 100</b>. ${res.fallacy && !res.freqFallacy ? '<b>This fixed the error for you</b>, and it does for many people.' : res.freqFallacy ? 'This format usually helps, although it did not for you this time.' : 'Your numbers matched your logical ranking.'}</p>
          ${dotGrid(S)}
          ${ui.s1s2(
            `<p>With “probable”, System 1 has nothing to picture except ${S.name}, so it falls back on how well the story fits.</p>`,
            `<p>“100 ${S.who}” makes you picture a <b>group</b>. Once you imagine the ${S.A} and then pick out the ${S.AB} from among them, it is obvious that the second group is smaller. The format <b>cues</b> System 2.</p>`,
            { s1: 'Probability wording', s2: 'Frequency wording' }
          )}
          ${ui.callout('key', `<b>Why this matters:</b> people are not simply unable to use the conjunction rule. When the question makes the set structure visible, most people get it right. The error comes from how System 1 handles a vivid description plus a vague word like “probable”.`)}`;
        },
      },
      {
        kicker: 'Name the bias', title: 'Representativeness and the conjunction fallacy',
        html: `${ui.define('Representativeness heuristic', 'A mental shortcut in which we judge how <b>likely</b> something is by how much it <b>resembles</b> a typical example or stereotype, rather than by the actual probabilities.')}
          ${ui.define('Conjunction fallacy', 'The error of judging that two things happening <b>together</b> (A and B) is <b>more</b> probable than one of them happening alone (A). It is a common result of the representativeness heuristic.')}
          ${ui.steps([
            '<b>Situation:</b> a vivid description of a person, followed by a probability judgement.',
            '<b>System 1 shortcut:</b> “the better it matches the stereotype, the more likely it is”.',
            '<b>Result:</b> adding a detail that fits the stereotype makes a statement feel <i>more</i> likely, when it must be less likely.',
            '<b>System 2 failure:</b> the conjunction rule is never applied, because the story feels so convincing.',
          ])}`,
      },
      {
        kicker: 'The evidence', title: 'Key studies',
        html: `${ui.study({ name: 'Tversky & Kahneman (1983)', rows: [
            ['Aim', 'To test whether people judge probability by representativeness, even when this breaks a basic rule of probability.'],
            ['Method', 'Participants read the description of Linda (and other characters, including Bill) and ranked statements by probability. Another version asked them to choose between just “bank teller” and “bank teller and feminist”.'],
            ['Findings', 'About <b>85%</b> judged “bank teller and active in the feminist movement” more probable than “bank teller”. Graduate students with advanced training in statistics showed the fallacy at similarly high rates.'],
            ['Link', 'Participants judged by resemblance to a stereotype (System 1) instead of applying the conjunction rule (System 2). Knowing the rule did not protect people.'],
          ] })}
          ${ui.study({ name: 'Frequency-format studies (Fiedler, 1988; Hertwig & Gigerenzer, 1999)', rows: [
            ['Method', 'The Linda problem was rephrased: “There are 100 people who fit this description. How many are bank tellers? How many are bank tellers and active feminists?”'],
            ['Findings', 'The conjunction fallacy fell sharply. In some conditions it dropped from around 80–90% to around 20% or less.'],
            ['Link', 'Thinking in terms of <b>groups of people</b> makes the subset relationship obvious and cues System 2. People can reason correctly when the problem is presented in the right way.'],
          ] })}`,
      },
      {
        kicker: 'Why we do it · real world', title: 'Why resemblance wins, and where it misleads us',
        html: `${ui.steps([
            `<b>Cognitive miser.</b> Working out real probabilities needs information we rarely have. Judging similarity to a stereotype is instant and effortless.`,
            `<b>Stories feel true.</b> System 1 builds a coherent picture from the details it is given. The more the details fit together, the more confident it feels, even though every extra detail is another thing that has to be true.`,
            `<b>What you see is all there is.</b> The description is vivid; the base rates (how many bank tellers or feminists there actually are) are invisible, so they are ignored.`,
          ])}
          <h3>Representativeness in everyday life</h3>
          <div class="two-col">
            <div class="card"><b>Stereotyping</b><br>Judging a person's job, background or behaviour by how well they fit a stereotype, instead of by how common that job or behaviour really is.</div>
            <div class="card"><b>Courtrooms</b><br>A prosecutor's story with lots of specific details can sound more convincing to a jury, even though each added detail makes the whole story less probable.</div>
            <div class="card"><b>Conspiracy theories</b><br>Detailed, joined-up stories feel more plausible than “it was an accident”. But the more parts a theory has, the more things must all be true at once.</div>
            <div class="card"><b>Forecasts</b><br>“A war breaks out <i>and</i> oil prices double” can feel more likely than “oil prices double”, because the first gives a reason. It can't be more likely.</div>
          </div>`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>The Linda effect is very <b>reliable</b>: it has been replicated many times with different samples and stories.</li><li>It appears even in people <b>trained in statistics</b>, which suggests an automatic process rather than a lack of knowledge.</li><li>The frequency-format results show <b>when</b> System 2 takes over, which fits dual process theory well.</li></ul>`,
            `<ul><li><b>Misunderstanding the words:</b> some researchers, including Hertwig & Gigerenzer, argue that people read “probable” as “plausible” or “fits the description”, not in the mathematical sense.</li><li>People may also assume that “Linda is a bank teller” means “a bank teller who is <i>not</i> a feminist”, because that is how the sentence would be read in normal conversation.</li><li><b>Artificial task:</b> a made-up person with a stereotyped description may exaggerate the effect compared with real decisions.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> the Linda problem is evidence that System 1 substitutes “how similar?” for “how probable?”. The frequency-format finding shows that System 2 <i>can</i> apply the rule when it is cued, which supports the idea of two systems.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The correct logic', hint: '“Bank teller and feminist” is a smaller group inside “bank teller”, so it can never be more probable. (Bill: “accountant who plays jazz” is inside “plays jazz”.)' },
        { point: 'What System 1 did', hint: 'Judged by how well the statement matches the stereotype of Linda / Bill, not by probability.' },
        { point: 'What System 2 would have done', hint: 'Applied the conjunction rule: P(A and B) can never be higher than P(A).' },
        { point: 'Name it: representativeness heuristic and conjunction fallacy', hint: 'Representativeness = judging probability by resemblance to a stereotype. Conjunction fallacy = judging A and B more probable than A alone.' },
        { point: 'The studies', hint: 'Tversky & Kahneman (1983): about 85% fell for it, even statistics-trained students. Frequency formats (“100 women like Linda”) greatly reduce it.' },
        { point: 'Real world and a criticism', hint: 'Detailed stories in court or conspiracy theories feel more likely. Criticism: people may read “probable” as “plausible”.' },
      ],
      visual: res => visual(res),
      ask: [
        'Why did you rank the combined statement where you did?',
        'Look at the circles. Can the small circle ever be bigger than the one it sits inside?',
        'Why do you think counting out of 100 made it easier (or would have)?',
      ],
    },
    quiz: {
      core: [
        { q: 'What is the <b>conjunction fallacy</b>?', a: 'Judging that two things together are more probable than one of them alone', d: ['Judging frequency by how easily examples come to mind', 'Making different decisions when the same facts are worded differently', 'Choosing options because they match the words in a problem'], why: 'P(A and B) can never be greater than P(A). Judging otherwise is the conjunction fallacy.' },
        { q: 'What is the <b>representativeness heuristic</b>?', a: 'Judging how likely something is by how much it resembles a typical example or stereotype', d: ['Judging how likely something is by how recently you heard about it', 'Relying on the first number you see when making an estimate', 'Preferring information that confirms what you already believe'], why: 'Linda resembles a typical feminist, so System 1 treats “feminist” statements as likely.' },
        { q: 'Why can “Linda is a bank teller and a feminist” <b>never</b> be more probable than “Linda is a bank teller”?', a: 'Every feminist bank teller is also a bank teller, so that group can’t be bigger', d: ['Very few bank tellers are feminists in real life', 'Linda’s description makes feminism impossible', 'Longer statements are always false in probability questions'], why: 'Feminist bank tellers are a subset of bank tellers. A subset can be the same size or smaller, never larger.' },
        { q: 'What did <b>Tversky & Kahneman (1983)</b> find with the Linda problem?', a: 'About 85% judged the combined statement more probable than “bank teller”', d: ['About 85% correctly ranked “bank teller” as more probable', 'About half chose each statement, so there was no clear bias', 'Only people with no education made the error'], why: 'A large majority broke the conjunction rule because Linda fitted the feminist stereotype.' },
        { q: 'How did graduate students with advanced statistics training do on the Linda problem?', a: 'They still committed the conjunction fallacy at very high rates', d: ['They all applied the conjunction rule correctly', 'They did worse because they overthought the problem', 'They refused to rank the statements at all'], why: 'Knowing the rule wasn’t enough. The vivid description triggered System 1 before System 2 could apply it.' },
        { q: 'What happens when the Linda problem is asked in a <b>frequency format</b> (“Of 100 women like Linda, how many…”)?', a: 'Far fewer people commit the conjunction fallacy', d: ['Even more people commit the conjunction fallacy', 'People refuse to give numbers, so it can’t be tested', 'The results are exactly the same as the ranking version'], why: 'Thinking about groups makes the subset relationship visible and cues System 2 (Fiedler, 1988; Hertwig & Gigerenzer, 1999).' },
        { q: 'In the Linda problem, which question does System 1 answer <b>instead of</b> “How probable is this?”', a: '“How similar is this to my picture of Linda?”', d: ['“How easily can I remember a bank teller?”', '“Which statement did I read first?”', '“What would most other people answer?”'], why: 'This is attribute substitution: similarity (easy) is swapped for probability (hard).' },
        { q: 'A lawyer adds more and more specific details to her account of a crime. What does the conjunction rule tell us?', a: 'Each detail may make the story more convincing but also less probable', d: ['Each detail makes the story both more convincing and more probable', 'Details have no effect on how probable a story is', 'Only details that fit a stereotype reduce the probability'], why: 'Every detail is one more thing that must be true, so the probability can only fall, even as the story feels more coherent.' },
        { q: 'Which is a criticism of the Linda problem?', a: 'People may read “probable” as “plausible”, not in the mathematical sense', d: ['The effect has never been replicated in other studies', 'It was only tested on young children', 'It used brain scans, which are correlational'], why: 'Hertwig & Gigerenzer argued that everyday meanings of “probable” may explain some of the errors.' },
      ],
      extra: [
        { q: 'Someone ranks “Bill is an accountant who plays jazz” above “Bill plays jazz”. Why is this an error?', a: 'Everyone who is an accountant and plays jazz also plays jazz', d: ['Accountants are not allowed to play jazz as a hobby', 'Bill’s description rules out playing any music', 'Jazz is too rare a hobby to appear in the problem'], why: 'Same logic as Linda: the combined statement describes a subset, so it can’t be more probable.' },
        { q: 'Out of 100 women like Linda, a student estimates 10 are bank tellers. What is the <b>largest</b> number that could be feminist bank tellers?', a: '10', d: ['100', '50', '11'], why: 'Feminist bank tellers are a subset of the 10 bank tellers, so there can be at most 10.' },
        { q: 'Someone thinks “there will be heavy rain and a power cut tomorrow” is more likely than “there will be a power cut tomorrow”. What error is this?', a: 'The conjunction fallacy, because the rain-and-power-cut case is part of all power cuts', d: ['The availability heuristic, because power cuts are easy to recall', 'The framing effect, because rain is described negatively', 'No error, because rain often causes power cuts'], why: 'Rain may make the story feel more plausible, but “A and B” can never be more probable than “B” alone.' },
        { q: 'Why do conspiracy theories with many specific details often feel convincing?', a: 'The details make a coherent story that System 1 finds believable, though each one lowers the probability', d: ['More details always mean more evidence, which makes a theory more likely', 'Detailed theories are usually checked carefully by System 2', 'People only believe theories that contain very few details'], why: 'Coherence and resemblance drive System 1’s confidence. Probability drops with every extra claim that must be true.' },
        { q: 'What does the frequency-format finding suggest about dual process theory?', a: 'System 2 can apply the conjunction rule when the question makes the groups visible', d: ['System 1 is always accurate when numbers are involved', 'People cannot reason about probability under any conditions', 'The Linda problem measures memory rather than reasoning'], why: 'The same people who fail the probability version often succeed with frequencies, so the rule is available when System 2 is cued.' },
      ],
    },
  });
})();
