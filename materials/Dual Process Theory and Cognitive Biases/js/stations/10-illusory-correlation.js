/* Station 10: Distinctiveness-based illusory correlation (after Hamilton & Gifford, 1976). */
(function () {
  const { ui, util } = DPT;

  // Big group: 12 desirable + 6 undesirable. Small group: 6 desirable + 3 undesirable.
  // Same 2:1 ratio in both groups, so there is NO real link between group and behaviour.
  const N = { bigGood: 12, bigBad: 6, smallGood: 6, smallBad: 3 };
  const SLIDE_MS = 3000;

  const SETS = {
    learn: {
      big: 'A', small: 'B',
      names: ['Tom', 'Aisha', 'Lukas', 'Mei', 'Oliver', 'Freja', 'Kwame', 'Sofia', 'Jonas', 'Priya', 'Mateo', 'Emma', 'Yusuf', 'Ingrid', 'Daniel', 'Leila', 'Kenji', 'Clara', 'Ali', 'Nora', 'Samuel', 'Hana', 'Viktor', 'Zara', 'Ethan', 'Maja', 'Ravi'],
      good: [
        'helped a neighbour carry shopping up four flights of stairs',
        'visited a sick friend in hospital',
        'volunteered at the local food bank on Saturday morning',
        'handed in a lost wallet with all the money still inside',
        'stayed late to help a classmate revise for a test',
        'picked up litter in the park without being asked',
        'gave up a seat on the bus for an elderly man',
        'donated a bag of clothes to a charity shop',
        'phoned a grandparent just to see how they were',
        'helped a confused tourist find the right train',
        'cooked dinner for a friend who had just moved house',
        'paid for a stranger’s coffee when their card was declined',
        'cleared snow from a neighbour’s path',
        'thanked the bus driver on the way out',
        'fixed a younger brother’s bike',
        'congratulated a rival after losing a match',
        'lent revision notes to a classmate who had been ill',
        'walked a friend home late at night so they felt safe',
      ],
      bad: [
        'was rude to a waiter who brought the wrong order',
        'dropped a crisp packet in the street',
        'pushed in at the front of a long queue',
        'took a colleague’s lunch from the office fridge',
        'shouted at a younger child for no reason',
        'copied a friend’s homework and handed it in',
        'parked across a neighbour’s driveway',
        'spread a false rumour about a classmate',
        'broke a borrowed phone and did not own up',
      ],
    },
    teach: {
      big: 'X', small: 'Y',
      names: ['Anna', 'Omar', 'Felix', 'Ida', 'Chen', 'Lucia', 'Mads', 'Amara', 'Noah', 'Elif', 'Hugo', 'Sara', 'Tariq', 'Lena', 'Isaac', 'Chloe', 'Mikkel', 'Fatima', 'Leo', 'Julia', 'Arjun', 'Rosa', 'Emil', 'Nadia', 'Gabriel', 'Astrid', 'Kofi'],
      good: [
        'helped an elderly neighbour with the gardening',
        'raised money for a children’s charity with a sponsored run',
        'picked up a stranger’s dropped shopping',
        'pointed out to a shop assistant that they had been given too much change',
        'showed a new student around the school',
        'read stories to children at the local library',
        'held the door open for someone carrying heavy boxes',
        'looked after a friend’s dog for a week',
        'gave directions to a lost driver',
        'tutored a younger student in maths for free',
        'brought in biscuits to share with the class',
        'apologised sincerely after a misunderstanding',
        'helped clear up after a school event',
        'checked on an elderly neighbour during a heatwave',
        'gave blood at a local clinic',
        'helped a lost child find their parent in a shop',
        'repaired a broken fence for a neighbour',
        'sent a thank-you card to a former teacher',
      ],
      bad: [
        'made fun of a classmate’s accent',
        'left rubbish on the beach after a picnic',
        'took the credit for a teammate’s idea',
        'cheated during a card game with friends',
        'slammed a door in a neighbour’s face',
        'lied to get out of helping at a charity event',
        'played loud music at 2 a.m. and ignored the complaints',
        'scratched a parked car and drove off without leaving a note',
        'was rude to a shop assistant who was trying to help',
      ],
    },
  };

  function buildStatements(set) {
    const good = util.shuffle(set.good);
    const bad = util.shuffle(set.bad);
    const names = util.shuffle(set.names);
    const list = [];
    const add = (grp, big, desirable, text) => list.push({ grp, big, desirable, text, name: names[list.length] });
    good.slice(0, N.bigGood).forEach(t => add(set.big, true, true, t));
    good.slice(N.bigGood).forEach(t => add(set.small, false, true, t));
    bad.slice(0, N.bigBad).forEach(t => add(set.big, true, false, t));
    bad.slice(N.bigBad).forEach(t => add(set.small, false, false, t));
    return util.shuffle(list);
  }

  const STYLE = `<style>
    .ic-slide{min-height:210px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:14px}
    .ic-grp{font-family:var(--f-mono);font-weight:700;font-size:15px;letter-spacing:.08em;text-transform:uppercase;padding:6px 16px;border-radius:999px;background:var(--accent-soft);color:var(--accent-ink);border:2px solid var(--accent)}
    .ic-grp.small{background:var(--s2-soft);color:var(--s2-ink);border-color:var(--s2)}
    .ic-text{font-size:clamp(20px,3vw,27px);font-weight:600;line-height:1.4;max-width:34ch}
    .ic-timer>div{transform-origin:left;animation:ic-shrink ${SLIDE_MS}ms linear forwards}
    .ic-paused .ic-timer>div{animation-play-state:paused}
    @keyframes ic-shrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}
    .ic-q{margin:18px 0 6px;font-weight:700;font-size:18px}
    .ic-scale{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .ic-scale .choice{padding:8px 0;width:44px;text-align:center;font-weight:800}
    .ic-scale .ic-end{font-size:13px;color:var(--muted);margin:0 4px}
    .ic-rows{display:grid;gap:12px;margin:14px 0}
    .ic-row{display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:center}
    .ic-row b{font-family:var(--f-mono);font-size:14px}
    .ic-sq{display:flex;flex-wrap:wrap;gap:5px}
    .ic-sq i{width:24px;height:24px;border-radius:6px;display:inline-block}
    .ic-sq i.g{background:var(--good)}
    .ic-sq i.b{background:var(--bad)}
    .ic-sq i.hot{box-shadow:0 0 0 3px var(--paper),0 0 0 5px var(--s1)}
    .ic-table{width:100%;border-collapse:collapse;margin:12px 0;font-size:16px}
    .ic-table th,.ic-table td{border:1px solid var(--line);padding:8px 10px;text-align:center}
    .ic-table th{font-family:var(--f-mono);font-size:12px;text-transform:uppercase;color:var(--muted);background:var(--paper)}
    .ic-table td.hot{background:var(--s1-soft);font-weight:800;color:var(--s1-ink)}
  </style>`;

  const g = l => `Group ${l}`;

  /* ── Experiment ──────────────────────────────────────────── */
  function experiment(el, ctx) {
    const set = SETS[ctx.mode];
    const items = buildStatements(set);
    let i = 0, timer = null, paused = false;

    el.innerHTML = `${STYLE}
      <p class="kicker">Read carefully</p>
      <h2 class="screen-title">${g(set.big)} and ${g(set.small)}</h2>
      <div class="prose"><p>You’ll see <b>${items.length} short statements</b>, one at a time. Each describes something a member of <b>${g(set.big)}</b> or <b>${g(set.small)}</b> did.</p>
        <p>Each statement stays on screen for about ${Math.round(SLIDE_MS / 1000)} seconds. Just read each one. Afterwards you’ll be asked some questions about the two groups.</p></div>
      <div class="btn-row"><button class="btn primary big" id="icStart">Start</button></div>`;
    el.querySelector('#icStart').onclick = startShow;

    function startShow() {
      el.innerHTML = `${STYLE}
        <div class="exp-progress" id="icProg"></div>
        <div class="timer ic-timer" id="icTimer"><div></div></div>
        <div class="task-card ic-slide" id="icSlide"></div>
        <div class="btn-row"><button class="btn ghost small" id="icPause">Pause</button></div>`;
      el.querySelector('#icPause').onclick = togglePause;
      showItem();
    }

    function showItem() {
      if (!el.isConnected) return;
      if (i >= items.length) return questions();
      const it = items[i];
      el.querySelector('#icProg').textContent = `Statement ${i + 1} of ${items.length}`;
      const t = el.querySelector('#icTimer');
      t.innerHTML = '<div></div>'; // restart the bar animation
      el.querySelector('#icSlide').innerHTML = `<span class="ic-grp ${it.big ? '' : 'small'}">${g(it.grp)}</span>
        <div class="ic-text">${it.name}, a member of ${g(it.grp)}, ${it.text}.</div>`;
      timer = setTimeout(() => { i++; showItem(); }, SLIDE_MS);
    }

    function togglePause() {
      const b = el.querySelector('#icPause');
      paused = !paused;
      if (paused) {
        clearTimeout(timer);
        el.classList.add('ic-paused');
        b.textContent = 'Resume';
      } else {
        el.classList.remove('ic-paused');
        b.textContent = 'Pause';
        showItem(); // current statement starts again from full time
      }
    }

    function questions() {
      el.classList.remove('ic-paused');
      const ans = { estSmall: null, estBig: null, worse: null, likeSmall: null, likeBig: null };
      const scale = key => `<div class="ic-scale" data-k="${key}"><span class="ic-end">1 = dislike</span>${[1, 2, 3, 4, 5, 6, 7].map(v => `<button class="choice" data-v="${v}">${v}</button>`).join('')}<span class="ic-end">7 = like</span></div>`;
      el.innerHTML = `${STYLE}
        <p class="kicker">Questions · from memory</p>
        <h2 class="screen-title">What do you remember?</h2>
        <p class="ic-q">1. There were <b>9</b> statements about ${g(set.small)}. How many described <b>undesirable</b> (bad) behaviour?</p>
        <div class="input-row"><input class="input" type="number" min="0" max="9" id="icS" inputmode="numeric" placeholder="0 to 9"><span class="muted">out of 9</span></div>
        <p class="ic-q">2. There were <b>18</b> statements about ${g(set.big)}. How many described <b>undesirable</b> behaviour?</p>
        <div class="input-row"><input class="input" type="number" min="0" max="18" id="icB" inputmode="numeric" placeholder="0 to 18"><span class="muted">out of 18</span></div>
        <p class="ic-q">3. Which group was <b>more likely</b> to behave badly?</p>
        <div class="choice-grid" id="icWorse">
          <button class="choice" data-v="big">${g(set.big)}</button>
          <button class="choice" data-v="small">${g(set.small)}</button>
          <button class="choice" data-v="none">No difference</button>
        </div>
        <p class="ic-q">4. How much do you like each group, overall?</p>
        <div class="ic-rows">
          <div class="ic-row"><b>${g(set.big)}</b>${scale('likeBig')}</div>
          <div class="ic-row"><b>${g(set.small)}</b>${scale('likeSmall')}</div>
        </div>
        <div class="btn-row"><button class="btn primary big" id="icDone" disabled>Submit answers</button></div>
        <p class="muted" style="font-size:14.5px" id="icHint">Answer all four questions to continue.</p>`;

      const done = el.querySelector('#icDone');
      const check = () => {
        const s = util.num(el.querySelector('#icS').value);
        const b = util.num(el.querySelector('#icB').value);
        ans.estSmall = Number.isFinite(s) && s >= 0 && s <= 9 ? Math.round(s) : null;
        ans.estBig = Number.isFinite(b) && b >= 0 && b <= 18 ? Math.round(b) : null;
        done.disabled = Object.values(ans).some(v => v === null);
      };
      el.querySelectorAll('.input').forEach(x => x.addEventListener('input', check));
      el.querySelectorAll('#icWorse .choice').forEach(btn => btn.onclick = () => {
        el.querySelectorAll('#icWorse .choice').forEach(x => x.classList.toggle('selected', x === btn));
        ans.worse = btn.dataset.v;
        check();
      });
      el.querySelectorAll('.ic-scale').forEach(sc => sc.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        sc.querySelectorAll('.choice').forEach(x => x.classList.toggle('selected', x === btn));
        ans[sc.dataset.k] = +btn.dataset.v;
        check();
      }));
      done.onclick = () => finish(ans);
    }

    function finish(ans) {
      const res = {
        ...ans, big: set.big, small: set.small,
        pctSmall: Math.round((ans.estSmall / 9) * 100),
        pctBig: Math.round((ans.estBig / 18) * 100),
      };
      ctx.pool.add({ pctSmall: res.pctSmall, pctBig: res.pctBig, worse: res.worse, likeSmall: res.likeSmall, likeBig: res.likeBig });
      el.innerHTML = `<p class="kicker">Experiment complete</p><h2 class="screen-title">Answers submitted</h2>
        <p class="prose">Press <b>Next</b> to see what the statements really said about each group.</p>`;
      ctx.done(res);
    }
  }

  /* ── Visuals ─────────────────────────────────────────────── */
  function squares(res, hot) {
    const row = (label, good, bad, isSmall) => `<div class="ic-row"><b>${label}</b><div class="ic-sq">${'<i class="g"></i>'.repeat(good)}${`<i class="b${hot && isSmall ? ' hot' : ''}"></i>`.repeat(bad)}</div></div>`;
    return `<div class="ic-rows">
      ${row(g(res.big) + ' (18)', N.bigGood, N.bigBad, false)}
      ${row(g(res.small) + ' (9)', N.smallGood, N.smallBad, true)}
    </div>
    <p class="muted" style="font-size:14px;margin:0"><span style="color:var(--good)">■</span> desirable · <span style="color:var(--bad)">■</span> undesirable${hot ? ' · ringed = the rarest, most distinctive statements' : ''}</p>`;
  }

  function countTable(res, hot) {
    return `<table class="ic-table">
      <thead><tr><th></th><th>Desirable</th><th>Undesirable</th><th>% undesirable</th></tr></thead>
      <tbody>
        <tr><th>${g(res.big)}</th><td>12</td><td>6</td><td><b>33%</b></td></tr>
        <tr><th>${g(res.small)}</th><td>6</td><td class="${hot ? 'hot' : ''}">3</td><td><b>33%</b></td></tr>
      </tbody></table>`;
  }

  /* ── Reveal ──────────────────────────────────────────────── */
  function reveal(res, ctx) {
    const pool = ctx.pool.all();
    const mean = k => util.mean(pool.map(r => r[k]).filter(Number.isFinite));
    const mS = mean('pctSmall'), mB = mean('pctBig');
    const worsePct = v => util.pct(pool.filter(r => r.worse === v).length, pool.length);
    const likeS = mean('likeSmall'), likeB = mean('likeBig');

    let verdict;
    if (res.worse === 'small' || res.pctSmall > res.pctBig) {
      verdict = `You ${res.worse === 'small' ? `judged <b>${g(res.small)}</b> more likely to behave badly` : `estimated more bad behaviour in <b>${g(res.small)}</b> (${res.pctSmall}%) than in <b>${g(res.big)}</b> (${res.pctBig}%)`}. But both groups behaved badly exactly <b>one-third</b> of the time. You saw a link between the <b>smaller group</b> and <b>bad behaviour</b> that was not in the data. That is an <b>illusory correlation</b>, the same result Hamilton & Gifford found.`;
    } else if (res.worse === 'none' && Math.abs(res.pctSmall - res.pctBig) <= 5) {
      verdict = `You spotted that there was <b>no difference</b>: both groups behaved badly one-third of the time. Most people don’t. They see ${g(res.small)}, the smaller group, as worse.`;
    } else {
      verdict = `Both groups behaved badly exactly <b>one-third</b> of the time, so the right answer was <b>no difference</b>. Most people judge ${g(res.small)}, the smaller group, as worse. See how the station data compares.`;
    }

    return `${STYLE}
      <div class="stat-row">
        ${ui.stat(res.pctSmall + '%', `your estimate: ${g(res.small)} undesirable (${res.estSmall}/9)`, res.pctSmall > 33 ? 's1' : '')}
        ${ui.stat(res.pctBig + '%', `your estimate: ${g(res.big)} undesirable (${res.estBig}/18)`)}
        ${ui.stat('33%', 'the truth, for both groups', 'good')}
      </div>
      ${ui.callout('key', verdict)}
      ${countTable(res, false)}
      <p>Your likeability ratings: ${g(res.big)} <b>${res.likeBig}</b>/7, ${g(res.small)} <b>${res.likeSmall}</b>/7.${res.likeSmall < res.likeBig ? ' You liked the smaller group less, even though the two groups behaved in exactly the same way.' : ''}</p>
      <h3>Everyone at this station so far</h3>
      <p class="muted" style="margin:0">Average estimate of % undesirable (true answer: 33% for both)</p>
      ${ui.bars([
        { label: `${g(res.big)} (larger)`, value: mB, max: 100, text: util.fmt(mB) + '%', cls: 's2' },
        { label: `${g(res.small)} (smaller)`, value: mS, max: 100, text: util.fmt(mS) + '%', cls: 's1' },
        { label: 'The truth', value: 33, max: 100, text: '33%', cls: 'good' },
      ])}
      <p class="muted" style="margin:0">Which group behaved worse?</p>
      ${ui.bars([
        { label: `Said ${g(res.small)}`, value: worsePct('small'), max: 100, text: worsePct('small') + '%', cls: 's1' },
        { label: `Said ${g(res.big)}`, value: worsePct('big'), max: 100, text: worsePct('big') + '%', cls: 's2' },
        { label: 'Said no difference', value: worsePct('none'), max: 100, text: worsePct('none') + '%', cls: 'good' },
      ])}
      <p class="muted" style="margin:0">Average likeability: ${g(res.big)} <b>${util.fmt(likeB, 1)}</b> · ${g(res.small)} <b>${util.fmt(likeS, 1)}</b> (out of 7)</p>
      ${ui.poolNote(pool.length)}`;
  }

  DPT.register({
    id: 'illusory', num: 10, hue: 250, minutes: 15,
    title: 'Group A, Group B',
    bias: 'Illusory correlation',
    hook: 'Two made-up groups behave in exactly the same way. So why does one of them seem worse?',
    intro: {
      learn: `<p>You’ll read a series of short statements about members of two groups, then answer some questions from memory.</p>
        <p>The groups are invented, so you know nothing about them in advance. This is a scaled-down version of a classic study by <b>Hamilton and Gifford (1976)</b> on how stereotypes can form.</p>`,
      teach: `<p><b>Host tip:</b> your guest sees Group X and Group Y, with different statements from yours. The design is the same. Watch question 3: most people pick the smaller group (Group Y) as worse.</p>`,
    },
    experiment,
    reveal,
    steps: [
      {
        kicker: 'What just happened', title: 'The two groups were identical',
        html: res => `${STYLE}<p>Here is exactly what you saw. Each square is one statement.</p>
          ${squares(res, false)}
          ${countTable(res, false)}
          ${ui.steps([
            `${g(res.big)} had <b>twice as many statements</b> as ${g(res.small)} (18 versus 9). That is the only real difference between them.`,
            `In <b>both</b> groups, two-thirds of the behaviour was desirable and one-third undesirable: 12 good to 6 bad, and 6 good to 3 bad.`,
            `So there was <b>no correlation</b> between which group someone was in and how they behaved. The correct answer to question 3 was <b>no difference</b>.`,
            `You estimated ${res.estSmall}/9 (${res.pctSmall}%) for ${g(res.small)} and ${res.estBig}/18 (${res.pctBig}%) for ${g(res.big)}. The truth was 3/9 and 6/18: <b>33% each</b>.`,
          ])}
          ${ui.callout('note', `Most people overestimate the bad behaviour in the <b>smaller</b> group and like that group less. A relationship appears in their judgement that isn’t in the data.`)}`,
      },
      {
        kicker: 'System 1’s shortcut', title: 'Rare + rare = memorable',
        html: res => `${STYLE}<p>Two things in the task were <b>uncommon</b>: statements about ${g(res.small)} (only 9 of 27) and undesirable behaviour (only 9 of 27). The statements that were <b>both</b> were the rarest of all: just <b>3 out of 27</b>.</p>
          ${squares(res, true)}
          ${ui.s1s2(
            `<p><b>Notices what stands out.</b> A rare kind of person doing a rare kind of thing is <b>doubly distinctive</b>. It grabs attention and is stored more strongly in memory.</p><p><b>Judges by what comes to mind.</b> Later, when you ask “how often did ${g(res.small)} behave badly?”, those vivid examples come back easily. Ease of recall feels like frequency, so the number is overestimated. This is the same shortcut as the <b>availability heuristic</b>.</p>`,
            `<p><b>Counts and compares proportions.</b> “How many statements about each group? What fraction of each was bad?” That would show 33% in both.</p><p>But keeping a running tally of 27 statements, shown quickly, takes effort and memory capacity. Nobody asked you to count, so System 2 didn’t, and the question was answered from impressions.</p>`
          )}
          ${ui.callout('s1', `<b>The key idea:</b> the bias doesn’t come from disliking ${g(res.small)}. You had no reason to. It comes from how System 1 <b>stores and retrieves</b> distinctive information.`)}`,
      },
      {
        kicker: 'Name the bias', title: 'Illusory correlation',
        html: `${ui.define('Illusory correlation', 'Perceiving a <b>relationship between two variables</b> (here, group membership and behaviour) <b>when none exists</b>, or seeing a relationship as stronger than it really is.')}
          ${ui.steps([
            '<b>Situation:</b> information about a smaller group and a larger group, with rare and common kinds of behaviour.',
            '<b>System 1 shortcut:</b> distinctive, rare combinations are remembered better and come to mind more easily.',
            '<b>Result:</b> the rare behaviour is overestimated for the smaller group, and that group is rated less favourably.',
            '<b>System 2 failure:</b> nobody counts the proportions, so the impression is never checked against the data.',
          ])}
          ${ui.callout('tip', `<b>This version is called distinctiveness-based illusory correlation.</b> Another kind is based on <b>expectations</b>: people “see” links they already expect to find (see Chapman & Chapman on the next screen).`)}`,
      },
      {
        kicker: 'The evidence', title: 'Key studies',
        html: `${ui.study({ name: 'Hamilton & Gifford (1976), study 1', rows: [
            ['Method', 'Participants read statements about members of Group A (26 statements) and Group B (13 statements). In both groups, desirable behaviour outnumbered undesirable behaviour by the same ratio (18:8 and 9:4).'],
            ['Findings', 'Participants <b>overestimated</b> how many undesirable behaviours came from Group B, and rated Group B <b>less favourably</b>, even though the proportions were identical.'],
            ['Link', 'The smaller group plus the rarer behaviour made the most distinctive combination, and it was over-remembered.'],
          ] })}
          ${ui.study({ name: 'Hamilton & Gifford (1976), study 2', rows: [
            ['Method', 'Same design, but now <b>undesirable</b> behaviour was the <b>majority</b> in both groups, and desirable behaviour was rare.'],
            ['Findings', 'The illusory correlation reversed: the smaller group was now linked with <b>desirable</b> behaviour.'],
            ['Link', 'The effect is about <b>distinctiveness</b> (whatever is rare), not about negative information being special. This is a strong test of the explanation.'],
          ] })}
          ${ui.study({ name: 'Chapman & Chapman (1967, 1969)', rows: [
            ['Method', 'Students, and later practising clinicians, looked at patients’ drawings or inkblot-test answers paired with their symptoms. The pairings were arranged so that there was no real link.'],
            ['Findings', 'Participants still reported links that matched common-sense expectations, for example that suspicious patients draw unusual eyes.'],
            ['Link', 'Expectations can create illusory correlations too, even among experts.'],
          ] })}`,
      },
      {
        kicker: 'Why it matters', title: 'Stereotypes and superstitions',
        html: `<p>In the real world, <b>minority groups</b> are by definition seen less often, and <b>negative behaviour</b> such as crime is, fortunately, less common than ordinary behaviour. Put those together and you have exactly the doubly distinctive combination from this experiment.</p>
          <ul>
            <li><b>Stereotypes:</b> a news story about a crime committed by a member of a minority group is distinctive and memorable. Over time this can create or strengthen a negative stereotype, even if the group behaves no differently from anyone else. This links the bias to the formation of stereotypes in <b>human relationships</b> and the sociocultural approach.</li>
            <li><b>Superstitions:</b> nurses and police often say that full-moon nights are busier. Busy full-moon nights are memorable; quiet ones and busy ordinary nights are not. Large studies of hospital and police records generally find no such link.</li>
            <li><b>Lucky and unlucky things:</b> “Every time I wear this shirt, my team loses.” The losses in that shirt are remembered; the wins, and the losses in other shirts, are not counted.</li>
          </ul>
          ${ui.callout('s2', `<b>How to switch on System 2:</b> ask for all four numbers. Not just “how often does this group do bad things?”, but also how often it does good things, and how often <i>other</i> groups do both. A correlation needs the whole table.`)}`,
      },
      {
        kicker: 'Critical thinking', title: 'How strong is this evidence?',
        html: `${ui.s1s2(
            `<ul><li>The effect is <b>reliable</b>: a meta-analysis of many studies (Mullen & Johnson, 1990) found it consistently.</li><li>Study 2 is a clever <b>test</b> of the explanation: reversing which behaviour is rare reversed the effect, supporting distinctiveness over negativity.</li><li>It offers a simple, testable account of how stereotypes can form <b>without any prejudice to begin with</b>.</li></ul>`,
            `<ul><li><b>Artificial groups:</b> “Group A” and “Group B” have no history, culture or conflict. Real stereotypes also involve culture, the media, competition and motivation, so this can only be part of the story.</li><li><b>A lab memory task</b> with short statements may not reflect how people meet real group members over years.</li><li><b>Other explanations:</b> some researchers (for example Fiedler, 1991) argue the effect can come simply from having <i>less information</i> about the smaller group, without any special memory for distinctive items.</li></ul>`,
            { s1: 'Strengths', s2: 'Limitations' }
          )}
          ${ui.callout('note', `<b>Exam link:</b> illusory correlation shows how System 1’s reliance on what is easy to recall can produce social consequences, such as stereotypes. It connects cognitive biases to the formation of stereotypes.`)}`,
      },
    ],
    host: {
      checklist: [
        { point: 'The real numbers', hint: 'Big group: 12 good, 6 bad. Small group: 6 good, 3 bad. <b>33% bad in both.</b> No correlation.' },
        { point: 'What most people conclude', hint: 'The smaller group behaved worse, and they like it less.' },
        { point: 'What System 1 did', hint: 'Small group + bad behaviour = rare + rare = <b>doubly distinctive</b>. Remembered better → easy to recall → overestimated (like availability).' },
        { point: 'What System 2 would have done', hint: 'Counted the statements and compared the proportions in each group.' },
        { point: 'Name it: illusory correlation', hint: 'Seeing a relationship between two variables when there isn’t one, or seeing it as stronger than it is.' },
        { point: 'The evidence', hint: 'Hamilton & Gifford (1976): study 1 = smaller group linked with bad behaviour. Study 2: when bad behaviour was common, the smaller group was linked with <b>good</b> behaviour. So it’s about distinctiveness.' },
        { point: 'Real life', hint: 'Stereotypes of minority groups from news of rare crimes; full-moon superstitions; the “unlucky shirt”.' },
      ],
      visual: res => `${STYLE}${squares(res, true)}${countTable(res, true)}`,
      ask: [
        'Which group did you think behaved worse? Why?',
        'Which statements do you remember best?',
        'Can you think of a stereotype that might have formed like this?',
      ],
    },
    concepts: [
      { name: 'Perspective', html: `Hamilton and Gifford offer a <b>cognitive</b> explanation of stereotypes: they can form from how memory handles rare information, with no prejudice needed. A <b>sociocultural</b> perspective would add group identity, culture, media and competition between groups, none of which exist for “Group A” and “Group B”. Even within the cognitive perspective there are rival explanations of the same result (see the next screen).` },
      { name: 'Responsibility', html: `If rare negative events involving minority groups are over-remembered, then the media has a responsibility in how it reports them. Mentioning a suspect’s ethnicity or religion when it is irrelevant can feed exactly the illusory correlation this station shows. Researchers also have a responsibility to explain that “stereotypes can form without prejudice” does not make stereotypes accurate or harmless.` },
      { name: 'Causality', html: `An illusory correlation is a false belief that two things go together, and people easily go one step further and assume one causes the other (“they behave badly <i>because</i> they are in that group”). The station is a reminder that a relationship has to be checked against all the data before we can even call it a correlation, let alone a cause.` },
      { name: 'Measurement', html: `The illusory correlation was measured in several ways: estimates of how many bad behaviours each group performed, which group people assigned statements to, and likeability ratings. These are operationalisations of a “stereotype”, but a few ratings of invented groups after 27 sentences may not capture what a real stereotype is.` },
    ],
    debate: {
      title: 'Why does the smaller group look worse?',
      sideA: { label: 'Distinctiveness (Hamilton & Gifford, 1976)', html: `The smaller group and the rarer behaviour are both distinctive, so statements that combine them are doubly distinctive. They get extra attention, are stored more strongly, and come to mind easily later, so they are overestimated. Study 2 supported this: when bad behaviour became common, the smaller group was linked with the now-rare good behaviour.` },
      sideB: { label: 'Information loss (Fiedler, 1991)', html: `Fiedler argued that no special memory for distinctive pairs is needed. We simply have less information about the smaller group, and judgements based on less information are less accurate and drift towards 50/50. The smaller group’s “2 good to 1 bad” pattern gets blurred more than the larger group’s, so it looks worse than it is.` },
      why: [
        { factor: 'Both fit study 1', html: `In the standard design, both explanations predict the same result: the smaller group is judged worse. Finding the effect again doesn’t tell us which explanation is right.` },
        { factor: 'Both fit study 2 too', html: `When bad behaviour is the majority, distinctiveness says the rare good behaviour stands out for the small group. Information loss says the small group’s estimates drift towards 50/50, which also makes it look better. So Hamilton and Gifford’s reversal cannot separate the two explanations.` },
        { factor: 'What is measured', html: `Distinctiveness predicts that people should specifically remember the rare pairs (small group, bad behaviour) better. Information loss doesn’t. Measuring memory for each type of statement, not just overall estimates, is one way to tell them apart.` },
        { factor: 'How people process the statements', html: `Later research suggests the effect is weaker when people are asked to form an impression of each group while they read, instead of judging from memory afterwards. That fits a memory-based account, but the evidence is not clear-cut.` },
      ],
      trust: `The effect itself is trustworthy: a meta-analysis (Mullen & Johnson, 1990) found it reliably across many studies. The explanation is much less certain. Because the classic designs give the same predictions under both accounts, neither side has a knock-out result, and it is quite possible that both processes contribute. Information loss is the simpler explanation, since it needs fewer assumptions about memory, but distinctiveness better explains why particular vivid examples feel so memorable. When evidence cannot separate two explanations, the honest answer is to say so and look for a study that makes them predict different things.`,
      ask: 'Design a study that would give different results depending on whether distinctiveness or information loss is right. What would you measure?',
    },
    quiz: {
      core: [
        { q: 'What is <b>illusory correlation</b>?', a: 'Seeing a relationship between two variables when there is none, or seeing it as stronger than it is', d: ['Correctly noticing that two variables tend to increase and decrease together', 'Believing that one event caused another simply because it happened first', 'Overestimating how many other people share your own opinions and habits'], why: 'The key word is illusory: the relationship is in the perceiver’s judgement, not in the data.' },
        { q: 'In this experiment, what percentage of each group’s behaviour was undesirable?', a: '33% for both groups', d: ['33% for the larger group and 67% for the smaller group', '50% for both groups', '33% for the smaller group and 17% for the larger group'], why: '6 of 18 and 3 of 9 are both one-third. There was no real difference.' },
        { q: 'How did Hamilton & Gifford (1976) explain their findings?', a: 'Rare behaviour by the smaller group was doubly distinctive, so it was remembered better and overestimated', d: ['Participants disliked Group B because they had met members of a real group like it', 'Statements about Group B were shown for longer, so they were remembered better', 'Negative behaviour is always remembered better than positive behaviour, whoever does it'], why: 'The rarest combination (minority group + rare behaviour) is the most distinctive, so it is over-remembered.' },
        { q: 'In Hamilton & Gifford’s <b>second</b> study, undesirable behaviour was the majority. What happened?', a: 'The smaller group became linked with desirable behaviour, which was now the rarer kind', d: ['The smaller group was still linked with undesirable behaviour, as in study 1', 'No illusory correlation appeared, because negative information was too common', 'Participants rated both groups equally unfavourably and saw no difference'], why: 'Reversing which behaviour was rare reversed the effect, so distinctiveness, not negativity, drives it.' },
        { q: 'What would System 2 have done in this experiment?', a: 'Counted the statements and compared the proportion of bad behaviour in each group', d: ['Relied on whichever statements were easiest to remember afterwards', 'Judged each group by its single most memorable statement', 'Assumed that a smaller group is probably different in some way'], why: 'Only a count of proportions shows that 6/18 and 3/9 are the same.' },
        { q: 'How is illusory correlation linked to the <b>availability heuristic</b>?', a: 'Distinctive examples come to mind easily, and ease of recall is taken as a sign of frequency', d: ['People rely too heavily on the first number they are given in a task', 'People seek out information that confirms what they already believe', 'People judge specific, detailed stories as more probable than general ones'], why: 'The doubly distinctive statements are easy to recall, so they seem to have happened more often.' },
        { q: 'According to this research, why might news coverage contribute to negative stereotypes of minority groups?', a: 'A rare crime by a minority group member is doubly distinctive, so it is remembered and overestimated', d: ['News reports usually describe minority groups in deliberately negative language', 'People only read news stories about groups that they themselves belong to', 'People trust news reports more when the reports are about minority groups'], why: 'Minority group + rare negative event is the same combination as Group B + bad behaviour in the lab.' },
        { q: 'Which is a <b>limitation</b> of Hamilton & Gifford’s study as an explanation of real stereotypes?', a: 'The groups were artificial, with no history or culture, so other factors behind real stereotypes are missing', d: ['The findings could not be replicated and have been shown to be unreliable', 'The study showed that stereotypes cannot form without existing prejudice', 'The participants already knew the real groups that Group A and B stood for'], why: 'Real stereotypes also involve culture, the media and motivation, which a lab task can’t capture.' },
        { q: 'Why can’t Hamilton & Gifford’s study 2 settle the debate with Fiedler’s (1991) information-loss explanation?', a: 'Both explanations predict that the small group will look better when bad behaviour is common', d: ['Study 2 failed to find any illusory correlation, so there is nothing to explain', 'Fiedler’s explanation only applies to real groups, not to invented ones', 'Study 2 measured memory for each statement, which neither account predicts'], why: 'Distinctiveness (rare good behaviour stands out) and information loss (small-group estimates drift towards 50/50) both predict the reversal.' },
      ],
      extra: [
        { q: 'Nurses often say the hospital emergency department is busier on full-moon nights, but hospital records show no difference. What is the best explanation?', a: 'Busy full-moon nights are distinctive, so they are remembered and overestimated', d: ['The moon affects behaviour, but hospital records fail to capture the effect', 'Nurses tend to work more shifts on nights when there is a full moon', 'Hospital records are usually less accurate than staff memories are'], why: 'Memorable coincidences are over-counted. Quiet full-moon nights are forgotten.' },
        { q: 'A school has 200 home students and 20 exchange students. 20 home students and 2 exchange students were caught using phones in an exam. A teacher now feels exchange students cheat more. What does the data show?', a: 'Both groups have the same rate (10%), so the teacher’s impression is an illusory correlation', d: ['Exchange students cheat at a higher rate, so the teacher’s impression is accurate', 'Home students cheat at a higher rate, so the teacher has it the wrong way round', 'The groups cannot be compared at all because they are such different sizes'], why: '20/200 and 2/20 are both 10%. Rare group + rare behaviour felt like a link.' },
        { q: 'What did <b>Chapman & Chapman</b> find about illusory correlations in clinical judgement?', a: 'People reported links between test responses and symptoms that were not in the data but matched their expectations', d: ['Experienced clinicians detected real links between drawings and symptoms that students missed', 'Drawings and inkblot answers predicted diagnoses more accurately than clinical interviews did', 'Participants reported no links at all whenever the pairings had been arranged at random'], why: 'This is expectation-based illusory correlation, and it affected experts as well as students.' },
        { q: 'Your team has lost the three matches you watched wearing a new shirt, so you think it’s unlucky. What would System 2 do?', a: 'Compare the team’s results with and without the shirt, over many matches', d: ['Focus on the most painful of the three defeats', 'Stop wearing the shirt, just to be on the safe side', 'Ask a few friends whether the shirt seems unlucky'], why: 'A real correlation needs all four cells: wins and losses, with and without the shirt.' },
        { q: 'A meta-analysis of illusory correlation studies (Mullen & Johnson, 1990) found that…', a: 'the effect appears reliably across many different studies', d: ['the effect only appears for negative behaviour', 'the effect disappears once groups are given names', 'the effect was found in just one or two laboratories'], why: 'Combining studies showed the distinctiveness-based effect is consistent, though not always large.' },
        { q: 'A news editor has learned about illusory correlation. Which decision best shows the concept of responsibility?', a: 'Leaving out a suspect’s ethnicity when it is irrelevant to the story', d: ['Reporting more crime stories so that viewers see the whole picture', 'Only reporting crimes that involve members of majority groups', 'Stopping all crime reporting so that no stereotypes can form'], why: 'Irrelevant mentions of minority group membership create the doubly distinctive pairing that feeds illusory correlations.' },
      ],
    },
  });
})();
