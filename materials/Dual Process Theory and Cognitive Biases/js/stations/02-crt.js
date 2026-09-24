/* Station 2: Cognitive Reflection Test. Intuitive errors and the lazy System 2. */
(function () {
  const { ui, util } = DPT;
  const { esc } = util;

  // Strip currency signs and words, keep the number.
  const cleanNum = raw => util.num(String(raw).replace(/[£$€]/g, '').replace(/[a-z]+/gi, ' ').trim());

  // Each item: `check(raw)` returns { shown, correct, intuitive }.
  const ITEMS = {
    bat: {
      short: 'Bat and ball',
      q: 'A bat and a ball cost <b>£1.10</b> in total. The bat costs <b>£1.00 more</b> than the ball. How much does the ball cost?',
      type: 'num', unit: 'pence', placeholder: 'e.g. 25',
      correctText: '5p', intuitiveText: '10p',
      check(raw) {
        let n = cleanNum(raw);
        if (/£/.test(raw) || (n > 0 && n < 1)) n = Math.round(n * 100 * 100) / 100;
        return { shown: Number.isFinite(n) ? n + 'p' : esc(raw), correct: n === 5, intuitive: n === 10 };
      },
    },
    widgets: {
      short: 'Machines and widgets',
      q: 'If it takes <b>5 machines 5 minutes</b> to make <b>5 widgets</b>, how long would it take <b>100 machines</b> to make <b>100 widgets</b>?',
      type: 'num', unit: 'minutes', placeholder: 'e.g. 12',
      correctText: '5 minutes', intuitiveText: '100 minutes',
      check(raw) {
        const n = cleanNum(raw);
        return { shown: Number.isFinite(n) ? n + ' min' : esc(raw), correct: n === 5, intuitive: n === 100 };
      },
    },
    lily: {
      short: 'Lily pads',
      q: 'A lake has a patch of lily pads. Every day, the patch <b>doubles</b> in size. It takes <b>48 days</b> for the patch to cover the whole lake. How long does it take to cover <b>half</b> the lake?',
      type: 'num', unit: 'days', placeholder: 'e.g. 30',
      correctText: '47 days', intuitiveText: '24 days',
      check(raw) {
        const n = cleanNum(raw);
        return { shown: Number.isFinite(n) ? n + ' days' : esc(raw), correct: n === 47, intuitive: n === 24 };
      },
    },
    race: {
      short: 'The race',
      q: 'You are running in a race and you overtake the person in <b>second place</b>. What place are you in now?',
      type: 'choice', options: ['1st', '2nd', '3rd', 'You can’t tell'],
      correctText: '2nd', intuitiveText: '1st',
      check(raw) { return { shown: esc(raw), correct: raw === '2nd', intuitive: raw === '1st' }; },
    },
    sheep: {
      short: 'The farmer’s sheep',
      q: 'A farmer had <b>15 sheep</b>, and all but <b>8</b> died. How many sheep are left?',
      type: 'num', unit: 'sheep', placeholder: 'e.g. 3',
      correctText: '8', intuitiveText: '7',
      check(raw) {
        const n = cleanNum(raw);
        return { shown: Number.isFinite(n) ? String(n) : esc(raw), correct: n === 8, intuitive: n === 7 };
      },
    },
    emily: {
      short: 'Emily’s sisters',
      q: 'Emily’s father has three daughters. The first two are called <b>April</b> and <b>May</b>. What is the third daughter called?',
      type: 'text', unit: '', placeholder: 'Type a name',
      correctText: 'Emily', intuitiveText: 'June',
      check(raw) {
        const s = String(raw).toLowerCase();
        return { shown: esc(raw), correct: /emil/.test(s), intuitive: /june/.test(s) };
      },
    },
    goat: {
      short: 'The mountain goat',
      q: 'A mountain goat is climbing a <b>60-foot</b> cliff. Every minute it climbs <b>up 3 feet</b>, then slips <b>back 2 feet</b>. How many minutes does it take to reach the top?',
      type: 'num', unit: 'minutes', placeholder: 'e.g. 20',
      correctText: '58 minutes', intuitiveText: '60 minutes',
      check(raw) {
        const n = cleanNum(raw);
        return { shown: Number.isFinite(n) ? n + ' min' : esc(raw), correct: n === 58, intuitive: n === 60 };
      },
    },
  };

  const SETS = { learn: ['bat', 'widgets', 'lily'], teach: ['race', 'sheep', 'emily', 'goat'] };

  const CONFIDENCE = [
    'Certain: I got them all right',
    'Fairly sure I got them all right',
    'Not sure',
    'I think I got at least one wrong',
  ];

  const secs = ms => (ms / 1000).toFixed(1) + ' s';

  function experiment(el, ctx) {
    const set = ctx.mode === 'teach' ? 'teach' : 'learn';
    const order = SETS[set];
    const answers = [];
    let step = 0;

    el.innerHTML = `<p class="kicker">Before you start</p>
      <h2 class="screen-title">${order.length} short questions</h2>
      <div class="prose">
        <p>Each question has a single correct answer. Type or choose your answer, then press <b>Submit</b>.</p>
        <p>Work at a <b>normal, fairly quick pace</b>, the way you would in a class quiz. The laptop records how long you take, but there is no time limit.</p>
        <p>You won't find out how you did until the end.</p>
      </div>
      <div class="btn-row"><button class="btn primary big" id="crtStart">Start</button></div>`;
    el.querySelector('#crtStart').onclick = show;

    function show() {
      const id = order[step];
      const it = ITEMS[id];
      const t0 = performance.now();
      const input = it.type === 'choice'
        ? `<div class="choice-grid">${it.options.map(o => `<button class="choice" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`
        : `<div class="input-row"><input class="input" id="crtAns" autocomplete="off" ${it.type === 'num' ? 'inputmode="decimal"' : ''} placeholder="${it.placeholder}">
            ${it.unit ? `<span class="muted">${it.unit}</span>` : ''}
            <button class="btn primary" id="crtGo" disabled>Submit</button></div>`;
      el.innerHTML = `<p class="exp-progress">Question ${step + 1} of ${order.length}</p>
        <div class="task-card big-q">${it.q}</div>
        ${input}
        <p class="muted" style="font-size:14.5px">No feedback yet. Answers are checked at the end.</p>`;

      const submit = raw => {
        const ms = Math.round(performance.now() - t0);
        answers.push({ id, raw: String(raw), ms, ...it.check(String(raw).trim()) });
        step++;
        if (step < order.length) show(); else confidence();
      };

      if (it.type === 'choice') {
        el.querySelectorAll('.choice').forEach(b => b.onclick = () => submit(b.dataset.v));
      } else {
        const box = el.querySelector('#crtAns');
        const go = el.querySelector('#crtGo');
        const valid = () => it.type === 'num' ? Number.isFinite(cleanNum(box.value)) : box.value.trim().length > 0;
        box.oninput = () => { go.disabled = !valid(); };
        box.onkeydown = e => { if (e.key === 'Enter' && valid()) submit(box.value); };
        go.onclick = () => submit(box.value);
        box.focus();
      }
    }

    function confidence() {
      el.innerHTML = `<p class="exp-progress">One last question</p>
        <h2 class="screen-title">How confident are you?</h2>
        <p class="prose">How sure are you that you got <b>every</b> question right?</p>
        <div class="choice-list">${CONFIDENCE.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join('')}</div>`;
      el.querySelectorAll('.choice').forEach(b => b.onclick = () => finish(+b.dataset.i));
    }

    function finish(conf) {
      const score = answers.filter(a => a.correct).length;
      const nIntuitive = answers.filter(a => a.intuitive).length;
      ctx.pool.add({
        set, conf, score,
        items: answers.map(a => ({ id: a.id, c: a.correct, i: a.intuitive, ms: a.ms })),
      });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">All answers submitted</h2>
        <p class="prose">Press <b>Next</b> to see the correct answers and how long you took.</p>`;
      ctx.done({ set, order, answers, conf, score, nIntuitive });
    }
  }

  const STYLE = `<style>.crt-table{width:100%;border-collapse:collapse;margin:14px 0;font-size:15.5px}.crt-table th{text-align:left;font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding:6px 8px}.crt-table td{padding:10px 8px;border-top:1px solid var(--line);vertical-align:top}.crt-table .mark{font-size:24px;font-weight:900}.crt-table tr.ok .mark{color:var(--good)}.crt-table tr.no .mark{color:var(--bad)}.crt-time{font-family:var(--f-mono);font-size:14px;color:var(--muted)}.crt-sum{font-family:var(--f-mono);font-size:17px;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin:12px 0;line-height:1.9}.crt-sum .bad{color:var(--bad);font-weight:700}.crt-sum .good{color:var(--good);font-weight:700}</style>`;

  function reveal(res, ctx) {
    const rows = res.answers.map(a => {
      const it = ITEMS[a.id];
      return `<tr class="${a.correct ? 'ok' : 'no'}"><td><b>${it.short}</b></td>
        <td>${a.shown}${a.intuitive ? '<br><span class="pill s1">System 1’s answer</span>' : ''}</td>
        <td>${it.correctText}<br><span class="muted" style="font-size:13.5px">tempting: ${it.intuitiveText}</span></td>
        <td class="crt-time">${secs(a.ms)}</td><td class="mark">${a.correct ? '✓' : '✗'}</td></tr>`;
    }).join('');

    const n = res.answers.length;
    let verdict;
    if (res.nIntuitive) verdict = `You gave <b>System 1’s answer</b> on <b>${res.nIntuitive} of ${n}</b> question${n > 1 ? 's' : ''}. Look at your wrong answers: they aren't random guesses. They are exactly the answer the wording pushes you towards, and it's the same wrong answer most people give.`;
    else if (res.score === n) verdict = `All ${n} correct. That's unusual. Be honest: did a quick answer pop into your head first (${res.order.map(id => ITEMS[id].intuitiveText).join(', ')})? Most people who get these right say they had to <b>stop and override</b> a first answer. That override is System 2 at work.`;
    else verdict = `You avoided the typical System 1 answers, but some answers were still wrong. The next screens show where the tempting answer comes from and how to check it.`;

    const confident = res.conf <= 1;
    const confNote = confident && res.score < n
      ? ui.callout('s1', `You said you were <b>“${CONFIDENCE[res.conf].toLowerCase()}”</b>, but you got <b>${n - res.score}</b> wrong. That feeling of certainty is typical of System 1: its answers arrive quickly and feel obviously right, so System 2 sees no reason to check.`)
      : ui.callout('note', `Your confidence: <b>${CONFIDENCE[res.conf]}</b>. People who give the intuitive answers are usually just as confident as people who get them right, and often more so.`);

    const intMs = res.answers.filter(a => a.intuitive).map(a => a.ms);
    const okMs = res.answers.filter(a => a.correct).map(a => a.ms);
    const timeNote = intMs.length && okMs.length
      ? `<p>Your System 1 answers took on average <b>${secs(util.mean(intMs))}</b>. Your correct answers took <b>${secs(util.mean(okMs))}</b>.</p>` : '';

    const pool = ctx.pool.all().filter(r => r.set === res.set);
    const barItems = res.order.map(id => {
      const recs = pool.map(r => (r.items || []).find(x => x.id === id)).filter(Boolean);
      const p = util.pct(recs.filter(x => x.i).length, recs.length);
      return { label: `${ITEMS[id].short}: gave ${ITEMS[id].intuitiveText}`, value: p, max: 100, text: p + '%', cls: 's1' };
    });
    const all = pool.flatMap(r => r.items || []);
    const pInt = all.filter(x => x.i).map(x => x.ms);
    const pOk = all.filter(x => x.c).map(x => x.ms);

    return `${STYLE}
      <table class="crt-table"><thead><tr><th>Question</th><th>You said</th><th>Correct</th><th>Time</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      ${ui.callout('key', verdict)}
      ${confNote}
      ${timeNote}
      <h3>Everyone at this station so far</h3>
      <p class="muted" style="font-size:15px">Percentage who gave the tempting System 1 answer:</p>
      ${ui.bars(barItems)}
      <div class="stat-row">
        ${ui.stat(pInt.length ? secs(util.median(pInt)) : 'no data', 'typical time for a System 1 answer', 's1')}
        ${ui.stat(pOk.length ? secs(util.median(pOk)) : 'no data', 'typical time for a correct answer', 's2')}
      </div>
      ${ui.poolNote(pool.length)}`;
  }

  const batAlgebra = `<div class="crt-sum">
      Try ball = 10p → bat = 10p + £1.00 = £1.10 → total = <span class="bad">£1.20 ✗</span><br>
      Let ball = x → bat = x + £1.00<br>
      x + (x + £1.00) = £1.10 → 2x = £0.10 → x = <span class="good">5p</span><br>
      Check: 5p + £1.05 = <span class="good">£1.10 ✓</span></div>`;

  DPT.register({
    id: 'crt', num: 2, hue: 40, minutes: 15,
    title: 'The Bat and the Ball',
    bias: 'Intuitive errors (the lazy System 2)',
    hook: 'Three easy-looking maths questions. Most students at Harvard, MIT and Princeton got the first one wrong.',
    intro: {
      learn: `<p>You'll answer three short questions. They look simple, and none of them needs more than primary-school maths.</p>
        <p>They come from the <b>Cognitive Reflection Test</b> (CRT), which measures something specific: whether you stop to check the first answer that comes into your head.</p>`,
      teach: `<p><b>Host tip:</b> your guest gets four <i>different</i> questions from the ones you did. Each has a tempting wrong answer. Watch how fast they answer, and whether they hesitate before submitting.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'The bat and ball, step by step',
        html: res => {
          const bat = res.answers.find(a => a.id === 'bat');
          return `${STYLE}
            <p>Most people answer <b>10p</b> within a second or two. ${bat ? `You answered <b>${bat.shown}</b>.` : ''} Let's check 10p properly.</p>
            ${batAlgebra}
            ${ui.steps([
              `If the ball costs 10p, the bat costs £1.00 more: <b>£1.10</b>.`,
              `Together that's 10p + £1.10 = <b>£1.20</b>. The question said £1.10. So 10p is wrong, and you can show it in five seconds.`,
              `The correct answer is <b>5p</b>: the ball is 5p, the bat is £1.05, total £1.10, and the difference is exactly £1.00.`,
            ])}
            <h3>The other two</h3>
            ${ui.steps([
              `<b>Machines:</b> 5 machines make 5 widgets in 5 minutes, so <b>each machine takes 5 minutes to make one widget</b>. 100 machines working at once make 100 widgets in the same <b>5 minutes</b>, not 100.`,
              `<b>Lily pads:</b> the patch doubles every day. So the day before it covers the whole lake, it covered <b>half</b>. That's day <b>47</b>, not 24.`,
            ])}
            ${ui.callout('key', `<b>Notice:</b> none of these needs difficult maths. Checking each answer takes a few seconds. The error doesn't come from lack of ability. It comes from not checking.`)}`;
        },
      },
      {
        kicker: 'System 1’s shortcut', title: 'Answering an easier question',
        html: `<p>Where does 10p come from? £1.10 splits neatly into <b>£1</b> and <b>10p</b>. System 1 sees the two numbers and produces the answer instantly. It has swapped the hard question (“what value makes both conditions true?”) for an easy one (“how does £1.10 split up?”). This swap is called <b>substitution</b>.</p>
          ${ui.s1s2(
            `<ul><li><b>Bat and ball:</b> “£1.10 is £1 and 10p, so 10p.”</li><li><b>Machines:</b> “5, 5, 5… so 100, 100, 100.” It copies the pattern.</li><li><b>Lily pads:</b> “Half the lake, so half the time: 24.”</li></ul><p>Each answer arrives with no effort and <b>feels</b> right.</p>`,
            `<ul><li>Would test the answer against the question: “does 10p plus £1.10 make £1.10?”</li><li>Would think about the process: one machine makes one widget in 5 minutes.</li><li>Would reason backwards: doubling means yesterday was half.</li></ul><p>All of this is easy, but it takes <b>effort</b> and a decision to check.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> the errors are <b>systematic</b>. People who get these wrong almost all give the <i>same</i> wrong answer (10p, 100, 24). Random mistakes would be spread out. That pattern shows that one fast process is producing the answer for most people.`)}`,
      },
      {
        kicker: 'Why no one checked', title: 'System 2 is a lazy controller',
        html: res => `<p>In dual process theory, System 2 is supposed to <b>monitor</b> System 1 and step in when its answer is wrong. Kahneman describes System 2 as a <b>lazy controller</b>: it can check, but it usually doesn't bother if System 1's answer feels right.</p>
          ${ui.steps([
            `System 1 offers an answer straight away (10p).`,
            `The answer comes with a <b>feeling of rightness</b>. ${res.conf <= 1 ? `You felt it too: you said you were “${CONFIDENCE[res.conf].toLowerCase()}”.` : 'Most people feel confident about it.'}`,
            `Checking would cost effort. The brain is a <b>cognitive miser</b> and avoids spending effort when it seems unnecessary.`,
            `So System 2 accepts the answer without testing it. The error goes through.`,
          ])}
          <h3>When does System 2 check even less?</h3>
          <div class="two-col">
            <div class="card"><b>High cognitive load</b><br>If your working memory is busy (a conversation, a second task, stress), there's less spare capacity for System 2.</div>
            <div class="card"><b>Time pressure and tiredness</b><br>With little time or energy, people rely even more on the first answer System 1 gives.</div>
          </div>
          ${ui.callout('note', `This is why the CRT is called a test of <b>cognitive reflection</b>. It doesn't measure how clever you are. It measures whether you stop and question your first answer.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Intuitive errors',
        html: `${ui.define('Intuitive error', 'A mistake that happens when <b>System 1 gives a quick answer that feels right</b> and <b>System 2 fails to check it</b>. The opposite skill, stopping to question that first answer, is called <b>cognitive reflection</b>.')}
          ${ui.steps([
            '<b>Situation:</b> a question with an easy-looking surface and a tempting answer.',
            '<b>System 1 shortcut:</b> substitution, answering an easier question that uses the same numbers or words.',
            '<b>Result:</b> most people give the same wrong answer, quickly and confidently.',
            '<b>System 2 failure:</b> the lazy controller accepts the answer because checking takes effort.',
          ])}`,
      },
      {
        kicker: 'The evidence', title: 'Two key studies',
        html: `${ui.study({ name: 'Frederick (2005)', rows: [
            ['Aim', 'To create a short test of whether people override an intuitive but wrong answer.'],
            ['Method', 'About <b>3,400</b> participants, many of them university students, answered the three CRT questions (the ones you just did).'],
            ['Findings', 'On the bat-and-ball question, <b>more than 50%</b> of students at Harvard, MIT and Princeton answered 10p. At less selective universities the figure was <b>over 80%</b>. People who gave the intuitive answer tended to think the question was easy.'],
            ['Link', 'Clever, well-educated people make the error too. It comes from not checking (lazy System 2), not from poor maths.'],
          ] })}
          ${ui.study({ name: 'Alter, Oppenheimer, Epley & Eyre (2007)', rows: [
            ['Aim', 'To test whether a feeling of difficulty makes people use System 2.'],
            ['Method', '<b>40</b> Princeton students did the CRT. Half had it printed in a clear font. Half had it in a small, grey, <b>hard-to-read</b> (disfluent) font.'],
            ['Findings', 'In the clear font, <b>90%</b> made at least one error. In the hard-to-read font, only <b>35%</b> did.'],
            ['Link', 'When a task <i>feels</i> hard, System 1 no longer feels certain, so System 2 is switched on and checks the answer.'],
          ] })}`,
      },
      {
        kicker: 'Real life', title: 'Where intuitive errors happen',
        html: `${ui.steps([
            `<b>Shop offers:</b> “3 for the price of 2” feels like half price. It's actually a third off each item. “50% extra free” is not the same as 50% off: you get a third off the price per gram.`,
            `<b>Exams:</b> reading a question too fast and answering the question you <i>expected</i>, not the one on the page. Many multiple-choice distractors are built on exactly this.`,
            `<b>Quick estimates:</b> judging a bill, a tip or a discount in your head, then paying without checking.`,
          ])}
          ${ui.callout('tip', `<b>A habit that helps:</b> when an answer arrives instantly and feels obvious, put it back into the question and check it. That five-second test is the whole of cognitive reflection.`)}`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.study({ name: 'Meyer et al. (2015)', rows: [
            ['What they did', 'A large replication of the disfluent-font effect, combining data from many samples (more than 7,000 participants).'],
            ['Findings', 'The hard-to-read font did <b>not</b> improve CRT scores.'],
            ['So what?', 'The original Alter et al. result came from only 40 students. A small study can produce a striking result by chance. This is why replication matters before we trust a finding.'],
          ] })}
          ${ui.s1s2(
            `<ul><li>The bat-and-ball error is very <b>reliable</b>: large samples, many universities.</li><li>The wrong answers are <b>the same</b> across people, which supports the idea of a fast, automatic process.</li><li>Easy to replicate in class, as you just did.</li></ul>`,
            `<ul><li>CRT scores are linked to <b>maths ability</b>, so errors may partly reflect numeracy. (Newer items like “Emily’s father” need no maths for this reason.)</li><li>The test is now <b>well known</b>. Many people have seen it, so scores may reflect memory rather than reflection.</li><li><b>Artificial</b>: a puzzle with nothing at stake may not reflect real decisions.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The right answers and the tempting ones', hint: 'Race: <b>2nd</b> (not 1st). Sheep: <b>8</b> (not 7). Third daughter: <b>Emily</b> (not June). Goat: <b>58</b> minutes (not 60: at minute 58 it climbs from 57 ft to 60 ft and is at the top).' },
        { point: 'What System 1 did', hint: 'Answered an <b>easier question</b> (substitution): “overtake = win”, “15 take away 8”, “April, May, June”, “60 feet at 1 foot a minute”. Fast, and it felt right.' },
        { point: 'Why System 2 didn’t check', hint: 'Kahneman’s <b>lazy controller</b>: checking costs effort, the answer felt certain, so it went through. Cognitive miser.' },
        { point: 'Name it: intuitive error / cognitive reflection', hint: 'System 1 gives a quick answer that feels right and System 2 fails to check it. Cognitive reflection = stopping to question the first answer.' },
        { point: 'Frederick (2005)', hint: 'About 3,400 people. Bat and ball: more than 50% at Harvard, MIT and Princeton said 10p; over 80% at less selective universities.' },
        { point: 'Alter et al. (2007), and the problem with it', hint: '40 Princeton students. Hard-to-read font: 35% made an error vs 90% in a clear font. But Meyer et al. (2015) could not replicate it in a much larger sample.' },
      ],
      visual: `${STYLE}<p><b>Give your guest the bat-and-ball question</b>: a bat and a ball cost £1.10; the bat costs £1.00 more than the ball. How much is the ball? Then show them this:</p>${batAlgebra}`,
      ask: [
        'Did an answer pop into your head before you’d finished reading?',
        'How confident were you? Why do you think you felt that sure?',
        'What could you have done in five seconds to catch the mistake?',
      ],
    },
    quiz: {
      core: [
        { q: 'A bat and a ball cost £1.10 in total. The bat costs £1.00 more than the ball. How much is the ball?', a: '5p', d: ['10p', '1p', '15p'], why: 'If the ball is 5p, the bat is £1.05. Total £1.10, difference £1.00. The 10p answer gives a total of £1.20.' },
        { q: 'In the lily pad question the patch doubles daily and covers the lake on day 48. Why do many people answer 24?', a: 'They halve the time because the lake is halved, ignoring that the patch doubles', d: ['They divide 48 by the number of lily pads on the lake', 'They add up the days it takes to cover each quarter', 'They misread the question as asking about the whole lake'], why: 'System 1 applies an easy “half the lake, half the time” rule. With doubling, the lake is half covered just one day earlier: day 47.' },
        { q: 'What does <b>cognitive reflection</b> mean?', a: 'The ability to stop and check an intuitive answer before accepting it', d: ['The ability to remember the answers to puzzles seen before', 'The ability to reason quickly when under time pressure', 'The ability to describe your emotions while solving a task'], why: 'The CRT measures whether System 2 steps in to question System 1’s first answer.' },
        { q: 'Kahneman calls System 2 a <b>“lazy controller”</b>. What does this mean?', a: 'It can check System 1’s answers but often accepts them without checking, because checking takes effort', d: ['It is slower than System 1, so it always gives the wrong answer in the end', 'It only works when people are tired or under time pressure', 'It controls System 1 so well that intuitive errors are very rare'], why: 'System 2 is capable but effortful. If an answer feels right, it usually lets it through.' },
        { q: 'What did <b>Frederick (2005)</b> find about the bat-and-ball question?', a: 'More than half of students at elite universities such as MIT and Princeton answered 10p', d: ['Students at elite universities almost never gave the intuitive answer', 'Only participants with little maths education gave the answer 10p', 'Most people who answered 10p said the question felt very difficult'], why: 'Even highly able students made the error, and those who got it wrong tended to think it was easy.' },
        { q: 'In <b>Alter et al. (2007)</b>, what happened when the CRT was printed in a hard-to-read font?', a: 'Fewer students made errors (35% compared with 90%)', d: ['More students made errors (90% compared with 35%)', 'There was no difference in errors between the two fonts', 'Students took longer but made exactly the same errors'], why: 'The difficulty made the task feel less certain, which was thought to trigger System 2.' },
        { q: 'Which situation is <b>most</b> likely to produce intuitive errors?', a: 'Doing a quiz on your phone while walking and chatting with a friend', d: ['Doing a quiz at a desk with pen, paper and plenty of time', 'Going back over your answers at the end of an exam', 'Explaining each step of your working out loud to a friend'], why: 'Divided attention raises cognitive load, leaving less capacity for System 2 to check System 1.' },
        { q: 'Why is <b>Meyer et al. (2015)</b> important when evaluating Alter et al. (2007)?', a: 'A much larger replication found that the hard-to-read font did not improve scores', d: ['It showed the hard-to-read font doubled the number of correct answers', 'It found the original study had used the wrong CRT questions', 'It showed the effect only works on students at Princeton'], why: 'Alter et al. had only 40 participants. When the effect was tested in more than 7,000 people, it disappeared.' },
      ],
      extra: [
        { q: 'A pencil and an eraser cost £1.20 in total. The pencil costs £1.00 more than the eraser. How much is the eraser?', a: '10p', d: ['20p', '5p', '12p'], why: 'Eraser 10p, pencil £1.10: total £1.20, difference £1.00. The tempting answer is 20p, which gives a total of £1.40.' },
        { q: 'If 3 cooks take 3 hours to bake 3 cakes, how long do 9 cooks take to bake 9 cakes?', a: '3 hours', d: ['9 hours', '1 hour', '27 hours'], why: 'Each cook bakes one cake in 3 hours. Nine cooks working together bake nine cakes in the same 3 hours.' },
        { q: 'A shop offers “3 for the price of 2”. What discount is this on each item?', a: 'About 33% off', d: ['50% off', '25% off', '66% off'], why: 'You pay for 2 items and get 3, so each costs two-thirds of the price: a third off. “Feels like half price” is System 1.' },
        { q: 'A critic says the CRT only measures maths skill. Which point best answers this criticism?', a: 'Newer items such as “Emily’s father has three daughters” need no maths but still produce intuitive errors', d: ['The CRT was first tested on students at very selective universities', 'People who solve the CRT correctly usually take slightly longer', 'The original CRT has only three questions, so it is quick to do'], why: 'Thomson and Oppenheimer (2016) wrote non-numerical items for this reason. They still catch people out, so the error is about reflection, not just numeracy.' },
        { q: 'Why might CRT scores in a class today be <b>higher</b> than in Frederick’s 2005 sample?', a: 'Many people have already seen the questions, so they remember the answers', d: ['People today have a larger working memory capacity than in 2005', 'Modern fonts are harder to read, which switches on System 2', 'The questions have since been made easier by researchers'], why: 'The CRT is famous. Remembering an answer is not the same as reflecting, which threatens the validity of the test.' },
      ],
    },
  });
})();
