/* Station 1 — Wason selection task: matching bias. */
(function () {
  const { ui, util } = DPT;

  // Each puzzle: 4 cards; `must` marks the logically required cards (P and not-Q);
  // `match` marks the cards that simply match the words in the rule (P and Q).
  const PUZZLES = {
    colour: {
      name: 'Numbers & colours', kind: 'abstract',
      rule: 'If a card has an <b>even number</b> on one side, then its other side is <b>red</b>.',
      cards: [
        { front: '3', back: '<span style="color:#c0392b">red</span>', why: 'The rule says nothing about odd numbers. Whatever colour is on the back, the rule can’t be broken.', must: false },
        { front: '8', back: '<span style="color:#8a5a2b">brown?</span>', why: 'If the back is <b>not red</b>, the rule is broken. You <b>must</b> check it.', must: true, match: true },
        { front: '<span class="swatch" style="background:#d6453b"></span>', frontText: 'red', back: '3?', why: 'The rule doesn’t say red cards must be even. That would be the rule reversed. An odd number here breaks nothing.', must: false, match: true },
        { front: '<span class="swatch" style="background:#8a5a2b"></span>', frontText: 'brown', back: '8?', why: 'If the back is an <b>even number</b>, the rule is broken. You <b>must</b> check it.', must: true },
      ],
    },
    letters: {
      name: 'Letters & numbers', kind: 'abstract',
      rule: 'If a card has a <b>vowel</b> on one side, then it has an <b>even number</b> on the other side.',
      cards: [
        { front: 'A', back: '7?', why: 'If the back is <b>odd</b>, the rule is broken. You <b>must</b> check it.', must: true, match: true },
        { front: 'K', back: '3', why: 'K is a consonant. The rule says nothing about consonants.', must: false },
        { front: '4', back: 'K', why: 'The rule doesn’t say even numbers must have vowels. A consonant here breaks nothing.', must: false, match: true },
        { front: '7', back: 'E?', why: 'If the back is a <b>vowel</b>, the rule is broken. You <b>must</b> check it.', must: true },
      ],
    },
    names: {
      name: 'Names & subjects', kind: 'abstract',
      rule: 'If a card has a <b>boy’s name</b> on one side, then it has an <b>IB subject</b> on the other side.',
      cards: [
        { front: 'John', small: true, back: 'Football?', why: 'If the back is <b>not an IB subject</b>, the rule is broken. <b>Must</b> check.', must: true, match: true },
        { front: 'Sofia', small: true, back: 'Football', why: 'The rule says nothing about girls’ names.', must: false },
        { front: 'Chemistry', small: true, back: 'Sofia', why: 'The rule doesn’t say IB subjects must go with boys’ names. Any name here is fine.', must: false, match: true },
        { front: 'Football', small: true, back: 'John?', why: 'If the back is a <b>boy’s name</b>, the rule is broken. <b>Must</b> check.', must: true },
      ],
    },
    beer: {
      name: 'Drinking age', kind: 'concrete',
      rule: 'If a person is <b>drinking beer</b>, then they must be <b>over 18</b>.',
      cards: [
        { front: 'Drinking beer', small: true, back: '16 years?', why: 'Could be under-age, so <b>check</b>.', must: true, match: true },
        { front: 'Drinking cola', small: true, back: '15 years', why: 'Anyone may drink cola.', must: false },
        { front: '25 years old', small: true, back: 'Beer', why: 'Adults may drink whatever they like.', must: false, match: true },
        { front: '16 years old', small: true, back: 'Beer?', why: 'If they’re drinking beer, the rule is broken, so <b>check</b>.', must: true },
      ],
    },
  };

  const ORDER = { learn: ['colour', 'names', 'beer'], teach: ['letters', 'names', 'beer'] };

  function cardFace(c) {
    return c.frontText
      ? `<span>${c.front}<br><small style="font-size:.5em;font-family:Inter,sans-serif;font-weight:700">${c.frontText}</small></span>`
      : c.front;
  }

  function cardHTML(c, i, flippable) {
    return `<div class="wcard-wrap"><button class="wcard" data-i="${i}" ${flippable ? '' : ''}>
      <div class="wcard-inner">
        <div class="wcard-face wcard-front ${c.small ? 'small' : ''}">${cardFace(c)}</div>
        <div class="wcard-face wcard-back ${c.small ? 'small' : ''}">${c.back}</div>
      </div></button><span class="wcard-tag"></span></div>`;
  }

  function experiment(el, ctx) {
    const order = ORDER[ctx.mode];
    const results = [];
    let step = 0;
    const style = '<style>.swatch{display:inline-block;width:1.4em;height:1.4em;border-radius:6px;vertical-align:middle}</style>';

    function show() {
      const p = PUZZLES[order[step]];
      el.innerHTML = `${style}
        <p class="kicker">Puzzle ${step + 1} of ${order.length}</p>
        <h2 class="screen-title">Which cards must you turn over?</h2>
        <p class="prose">Each card has something on the front and something on the back. You can only see the front. Here is a rule:</p>
        <div class="task-card big-q">${p.rule}</div>
        <p class="prose">Tap <b>only</b> the card(s) you would <b>definitely need</b> to turn over to find out whether the rule is being broken. Don’t turn over any you don’t need.</p>
        <div class="cards4">${p.cards.map((c, i) => cardHTML(c, i)).join('')}</div>
        <div class="btn-row"><button class="btn primary big" id="lock" disabled>Lock in my answer</button></div>
        <p class="muted" style="font-size:14.5px">No feedback yet. You’ll see how you did after all ${order.length} puzzles.</p>`;
      const picked = new Set();
      const lock = el.querySelector('#lock');
      el.querySelectorAll('.wcard').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        picked.has(i) ? picked.delete(i) : picked.add(i);
        b.classList.toggle('selected', picked.has(i));
        lock.disabled = picked.size === 0;
      });
      lock.onclick = () => {
        const pickedArr = [...picked].sort();
        const correct = p.cards.every((c, i) => c.must === picked.has(i));
        const matched = p.cards.every((c, i) => !!c.match === picked.has(i));
        results.push({ id: order[step], picked: pickedArr, correct, matched });
        step++;
        if (step < order.length) show();
        else finish();
      };
    }

    function finish() {
      const abstractOK = results.filter(r => PUZZLES[r.id].kind === 'abstract').every(r => r.correct);
      ctx.pool.add({ first: results[0].correct, concrete: results[results.length - 1].correct });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">All answers locked in</h2>
        <p class="prose">Press <b>Next</b> to see which cards you should have turned over, and why.</p>`;
      ctx.done({ results, order, abstractOK });
    }
    show();
  }

  function pickedText(r) {
    const p = PUZZLES[r.id];
    return r.picked.map(i => p.cards[i].frontText || p.cards[i].front.replace(/<[^>]+>/g, '')).join(' + ') || '—';
  }
  function mustText(id) {
    const p = PUZZLES[id];
    return p.cards.filter(c => c.must).map(c => c.frontText || c.front.replace(/<[^>]+>/g, '')).join(' + ');
  }

  function reveal(res, ctx) {
    const rows = res.results.map(r => {
      const p = PUZZLES[r.id];
      return `<tr class="${r.correct ? 'ok' : 'no'}"><td><b>${p.name}</b><br><span class="pill ${p.kind === 'concrete' ? 's2' : ''}">${p.kind}</span></td>
        <td>${pickedText(r)}${r.matched && !r.correct ? '<br><span class="pill s1">matched the rule’s words</span>' : ''}</td>
        <td>${mustText(r.id)}</td><td class="mark">${r.correct ? '✓' : '✗'}</td></tr>`;
    }).join('');
    const pool = ctx.pool.all();
    const firstPct = util.pct(pool.filter(x => x.first).length, pool.length);
    const concPct = util.pct(pool.filter(x => x.concrete).length, pool.length);
    const nAbsWrong = res.results.filter(r => PUZZLES[r.id].kind === 'abstract' && !r.correct).length;
    const concreteOK = res.results.find(r => r.id === 'beer').correct;
    let verdict;
    if (nAbsWrong && concreteOK) verdict = `You got the <b>abstract</b> puzzle${nAbsWrong > 1 ? 's' : ''} wrong but the <b>drinking-age</b> puzzle right. That is the classic pattern: the logic is <i>identical</i> in all three puzzles. Only the content changed.`;
    else if (nAbsWrong) verdict = `You found these hard, and so does almost everyone. Even the drinking-age version tripped you up, which is less common.`;
    else verdict = `You got every puzzle right. That’s rare: fewer than 1 in 10 people solve the abstract version. Either your System 2 checked carefully, or you’ve seen this task before. Either way, the next screens show you why most people fail.`;

    return `<style>.wtable{width:100%;border-collapse:collapse;margin:14px 0;font-size:15.5px}.wtable th{text-align:left;font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding:6px 8px}.wtable td{padding:10px 8px;border-top:1px solid var(--line);vertical-align:top}.wtable tr.ok td.mark{color:var(--good)}.wtable tr.no td.mark{color:var(--bad)}.wtable .mark{font-size:24px;font-weight:900}</style>
      <table class="wtable"><thead><tr><th>Puzzle</th><th>You turned</th><th>Correct</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      ${ui.callout('key', verdict)}
      <h3>Everyone at this station so far</h3>
      ${ui.bars([
        { label: 'Puzzle 1 (abstract) correct', value: firstPct, max: 100, text: firstPct + '%', cls: 's1' },
        { label: 'Drinking-age puzzle correct', value: concPct, max: 100, text: concPct + '%', cls: 's2' },
      ])}
      ${ui.poolNote(pool.length)}`;
  }

  function flipDemo(id) {
    const p = PUZZLES[id];
    return `<style>.swatch{display:inline-block;width:1.4em;height:1.4em;border-radius:6px;vertical-align:middle}</style>
      <div class="task-card" style="font-size:18px">${p.rule}</div>
      <div class="cards4 flipdemo">${p.cards.map((c, i) => cardHTML(c, i)).join('')}</div>`;
  }
  function wireFlip(root, id, withText) {
    const p = PUZZLES[id];
    const out = root.querySelector('.flip-why');
    root.querySelectorAll('.flipdemo .wcard').forEach(b => b.onclick = () => {
      const c = p.cards[+b.dataset.i];
      b.classList.add('flipped', c.must ? 'ok' : 'no');
      b.parentElement.querySelector('.wcard-tag').innerHTML = c.must ? '<span style="color:var(--good)">MUST turn</span>' : '<span style="color:var(--bad)">no need</span>';
      if (withText && out) out.innerHTML = `<b>${c.frontText || c.front.replace(/<[^>]+>/g, '')}:</b> ${c.why}`;
    });
  }

  DPT.register({
    id: 'wason', num: 1, hue: 12, minutes: 15,
    title: 'The Four-Card Problem',
    bias: 'Matching bias',
    hook: 'Four cards, one rule. Most university students get it wrong, until the rule is about beer.',
    intro: {
      learn: `<p>You’ll solve three short logic puzzles with cards. Each one gives you a rule, and you decide which cards you’d have to turn over to test it.</p>
        <p>This is the <b>Wason selection task</b>, probably the most famous reasoning puzzle in psychology and one of the main pieces of evidence for dual process theory.</p>`,
      teach: `<p><b>Host tip:</b> watch which cards your guest chooses in puzzle 1. Most people choose the cards that <i>match the words</i> in the rule.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'The logic, one card at a time',
        render(el, res) {
          const id = res.order[0];
          el.innerHTML = `<p>Here is puzzle 1 again. You are trying to catch the rule being <b>broken</b>. A card is only worth turning if what’s on the back could <b>break</b> the rule.</p>
            <p><b>Tap each card</b> to flip it and see whether it needed checking.</p>
            ${flipDemo(id)}
            <div class="callout note flip-why">Tap a card…</div>
            ${ui.steps([
              `The rule is <b>“If P, then Q”</b>. It is only broken by a card that has <b>P and not-Q</b>.`,
              `So turn the <b>P card</b> (${res.order[0] === 'colour' ? '8' : 'A'}), because its back might be not-Q.`,
              `And turn the <b>not-Q card</b> (${res.order[0] === 'colour' ? 'brown' : '7'}), because its back might be P.`,
              `The Q card (${res.order[0] === 'colour' ? 'red' : '4'}) is the trap. The rule never says Q only goes with P, so it can’t break the rule.`,
            ])}`;
          wireFlip(el, id, true);
        },
      },
      {
        kicker: 'System 1’s shortcut', title: 'You picked what matched the words',
        html: res => {
          const r0 = res.results[0];
          return `<p>Most people pick <b>${res.order[0] === 'colour' ? '8 and red' : 'A and 4'}</b>. ${r0.matched ? '<b>So did you.</b> ' : ''}Why these two? Because they are the cards that <b>match the words in the rule</b>: “${res.order[0] === 'colour' ? 'even' : 'vowel'}” and “${res.order[0] === 'colour' ? 'red' : 'even'}”.</p>
          ${ui.s1s2(
            `<p><b>Looks at the words.</b> The rule mentions “even” and “red”, so System 1 points you at the 8 and the red card. It feels obviously right, with no effort at all.</p><p>It never thinks about the <b>brown</b> card, because brown isn’t mentioned. System 1 focuses on the evidence in front of it and ignores what’s absent.</p>`,
            `<p><b>Works through the logic.</b> “What would break this rule? An even card that isn’t red. Which cards could be hiding that? The 8, and the brown card.”</p><p>That takes effort, and System 2 usually doesn’t bother, because System 1's answer already <i>feels</i> right.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> System 1 answered first, and its answer felt certain. System 2 accepted it without checking. That is why the error is so common and so consistent.`)}`;
        },
      },
      {
        kicker: 'The twist', title: 'Why the beer version is easy',
        html: res => {
          const beer = res.results.find(r => r.id === 'beer');
          return `<p>The drinking-age puzzle has <b>exactly the same logical structure</b>: turn the P card (drinking beer) and the not-Q card (16 years old). Yet around <b>three-quarters</b> of people get it right, compared with fewer than one in ten for the abstract version.</p>
          <p>${beer.correct ? 'You got it right too.' : 'You found this one hard too, which is less common.'}</p>
          ${ui.s1s2(
            `<p>You have real experience of this kind of rule (ID checks at a bar or shop). System 1 immediately asks the right question: <i>who might be breaking the rule?</i> In this case the fast route and the logical route agree.</p>`,
            `<p>Barely needed. The familiar context does the work. Abstract rules about letters and colours give System 1 nothing familiar to go on, so it falls back on matching the words.</p>`,
            { s1: 'System 1 · helped by context', s2: 'System 2 · less needed' }
          )}
          ${ui.callout('key', `<b>Why this matters for the theory:</b> the same logic produces very different performance depending on the content. That fits the idea that most people aren’t reasoning through the logic at all. A fast, context-driven process is answering for them.`)}`;
        },
      },
      {
        kicker: 'Name the bias', title: 'Matching bias',
        html: `${ui.define('Matching bias', 'The tendency to choose options because they <b>match the words or features mentioned in a problem</b>, not because logic says they’re relevant. It is a System 1 shortcut, strongest when the problem is abstract.')}
          ${ui.steps([
            '<b>Situation:</b> an abstract rule with no familiar context.',
            '<b>System 1 shortcut:</b> “pick what the rule mentions”.',
            '<b>Result:</b> people turn the P and Q cards and miss the not-Q card.',
            '<b>System 2 failure:</b> the answer feels right, so it isn’t checked.',
          ])}`,
      },
      {
        kicker: 'The evidence', title: 'Three key studies',
        html: `${ui.study({ name: 'Wason (1968)', rows: [
            ['Aim', 'To investigate how people test a conditional (“if… then…”) rule.'],
            ['Method', 'Participants saw four cards and a rule, and chose which cards to turn over to test it.'],
            ['Findings', 'Fewer than 10% chose correctly. Most chose the cards named in the rule. Even after training, errors came back when the content of the task changed.'],
            ['Link', 'The training didn’t transfer to new content. Transferring a rule to a new situation is a System 2 ability, so participants were relying on System 1.'],
          ] })}
          ${ui.study({ name: 'Griggs & Cox (1982)', rows: [
            ['Method', 'Participants did the same task written as a <b>drinking-age</b> rule: “If a person is drinking beer, they must be over 18.”'],
            ['Findings', 'About <b>75%</b> answered correctly, with no matching bias.'],
            ['Link', 'When the task is concrete and familiar, System 1 can solve it. The error comes from abstraction, not from the logic itself.'],
          ] })}
          ${ui.study({ name: 'Goel et al. (2000)', rows: [
            ['Method', 'Participants solved abstract and concrete versions of a logic task while in an <b>fMRI</b> scanner.'],
            ['Findings', 'Abstract problems → more activity in the <b>parietal lobe</b>. Concrete problems → more activity in the <b>left temporal lobe</b>.'],
            ['Link', 'Biological evidence that the brain processes the two kinds of problem differently, which fits the idea of two systems.'],
          ] })}`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>The Wason task gives <b>reliable</b> results: most people fail the abstract version, in many countries and samples.</li><li><b>Converging evidence</b>: behavioural data (Griggs & Cox) plus brain data (Goel).</li></ul>`,
            `<ul><li><b>Artificial task:</b> participants may not care about letters and colours, so there’s little reason to use System 2. Low motivation, not a “bias”, could explain the errors.</li><li><b>fMRI is correlational</b>: different active areas don’t prove there are two separate systems.</li><li>The theory doesn’t explain <b>how</b> the two systems interact.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> this station gives you evidence to <i>describe dual process theory</i> and to show that System 1 can interfere with System 2 even after you’ve been taught the right way.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'Which cards were correct, and why', hint: 'You only need cards that could <b>break</b> the rule: the P card (A / 8) and the not-Q card (7 / brown).' },
        { point: 'What System 1 did', hint: 'It picked the cards that <b>match the words</b> in the rule. That feels right and takes no effort.' },
        { point: 'What System 2 would have done', hint: 'Asked “what would break this rule?” and checked every card. Slow and effortful, so usually skipped.' },
        { point: 'Name it: matching bias', hint: 'Choosing options because they match the words in the problem, not because of logic.' },
        { point: 'Why the beer version is easy', hint: 'Same logic, but concrete and familiar. System 1 knows how to spot rule-breakers. About 75% correct (Griggs & Cox, 1982).' },
        { point: 'The brain evidence', hint: 'Goel et al. (2000), fMRI: abstract → parietal lobe; concrete → left temporal lobe.' },
      ],
      visual: res => `<div class="cards4" style="pointer-events:none">${PUZZLES[res.order[0]].cards.map(c => `<div class="wcard-wrap"><div class="wcard ${c.must ? 'ok' : 'no'}"><div class="wcard-inner"><div class="wcard-face wcard-front ${c.small ? 'small' : ''}">${cardFace(c)}</div></div></div><span class="wcard-tag">${c.must ? '<span style="color:var(--good)">MUST turn</span>' : '<span style="color:var(--bad)">no need</span>'}</span></div>`).join('')}</div><style>.swatch{display:inline-block;width:1.4em;height:1.4em;border-radius:6px;vertical-align:middle}</style>`,
      ask: [
        'Why did you choose those cards?',
        'Why was the drinking puzzle easier, even though the logic is the same?',
        'Which system do you think you used for each puzzle?',
      ],
    },
    quiz: {
      core: [
        { q: 'Rule: “If a card has an even number on one side, its other side is red.” Cards: <b>3, 8, red, brown</b>. Which must be turned over?', a: '8 and brown', d: ['8 and red', '8 only', '3 and brown'], why: 'Only a card with an even number and a non-red back breaks the rule. The 8 might have a non-red back; the brown card might have an even number.' },
        { q: 'What is <b>matching bias</b>?', a: 'Choosing options because they match the words in a problem, rather than because logic says they’re relevant', d: ['Remembering information that matches what you already believe', 'Copying the answer that most other people choose', 'Preferring people who are similar to yourself'], why: 'Matching bias is the System 1 shortcut in the Wason task: pick what the rule mentions.' },
        { q: 'What did <b>Griggs & Cox (1982)</b> find?', a: 'When the rule was about a familiar situation (drinking age), about 75% of people chose correctly', d: ['Training on the abstract task removed errors on every later version', 'Concrete versions produced more errors than abstract ones', 'People could accurately explain why they chose each card'], why: 'Same logic, familiar content, and far fewer errors. The problem is abstraction, not logic.' },
        { q: 'Why is the Wason task used as evidence for dual process theory?', a: 'The logic is identical in abstract and concrete versions, but performance changes dramatically. That suggests a fast, context-driven process answers unless effortful reasoning takes over.', d: ['It shows everyone uses System 2 for logic problems', 'It proves System 1 is located in the parietal lobe', 'It shows people can never reason logically'], why: 'If people were reasoning logically, the content shouldn’t matter. It does, which points to System 1.' },
        { q: 'In <b>Goel et al. (2000)</b>, which area was more active during the <b>abstract</b> version of the task?', a: 'The parietal lobe', d: ['The left temporal lobe', 'The amygdala', 'The hippocampus'], why: 'Abstract problems → parietal lobe; concrete problems → left temporal lobe.' },
        { q: 'In the colour version, why must the <b>brown</b> card be turned over?', a: 'If its other side is an even number, the rule is broken', d: ['If its other side is an odd number, the rule is broken', 'It isn’t mentioned in the rule, so it’s irrelevant', 'The rule says brown cards must be odd'], why: 'Brown is “not-Q”. An even number (P) on the back would be P and not-Q, which breaks the rule.' },
        { q: 'Which is a <b>limitation</b> of using the Wason task as evidence for System 1?', a: 'The task is artificial and participants may have little motivation to think hard, so errors may not reflect real-life decisions', d: ['The findings have never been replicated', 'The task measures memory, not thinking', 'It was only ever tested on children'], why: 'Low motivation in an unimportant lab task could explain the errors as well as a “bias” does.' },
      ],
      extra: [
        { q: 'Rule: “If a card has a vowel on one side, it has an even number on the other.” Cards: <b>E, T, 6, 9</b>. Which must be turned?', a: 'E and 9', d: ['E and 6', 'E only', 'T and 9'], why: 'P = vowel (E). Not-Q = odd number (9). The 6 is the matching trap.' },
        { q: 'A swimming-pool rule: “If you are in the pool, you must wear a swim cap.” Which people must the lifeguard check?', a: 'The person in the pool and the person without a cap', d: ['The person in the pool and the person wearing a cap', 'Only the person in the pool', 'The person at the café and the person without a cap'], why: 'Same structure as the beer version: check P (in the pool) and not-Q (no cap).' },
        { q: 'Wason found that when trained participants got a version with <b>new content</b>…', a: 'they made the same matching errors again, because the training didn’t transfer', d: ['they solved it perfectly', 'they did better on abstract than concrete versions', 'they refused to answer'], why: 'Applying a rule to a new situation is a System 2 skill. Participants fell back on System 1.' },
        { q: 'Which statement best describes System 1 in the drinking-age version?', a: 'It can reach the right answer because the situation matches familiar experience of spotting rule-breakers', d: ['It is switched off completely', 'It causes even stronger matching bias', 'It is replaced by the parietal lobe'], why: 'System 1 isn’t always wrong. With familiar context its shortcuts work well.' },
      ],
    },
  });
})();
