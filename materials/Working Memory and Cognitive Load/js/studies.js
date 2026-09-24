/* Memory Quest — evidence files (step-through study walkthroughs) and the interactive model.
   Wording is original; figures come from the published studies. */
(() => {
  const { h, btn, bars } = window.MQHelpers;
  const ic = (name, cls = '') => {
    const d = window.MQIcons && window.MQIcons[name];
    return d ? `<svg class="gi ${cls}" viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>` : '';
  };
  const withIcons = html => html.replace(/\{i:(\w+)\}/g, (_, n) => ic(n));

  /* Each study is a list of steps: { tag, title, html, visual? }.
     visual is an HTML string for the animated panel beside the text. */
  const STUDIES = {
    landry: {
      icon: 'sound',
      name: 'Landry & Bartling (2011)',
      label: 'Laboratory experiment',
      steps: [
        { tag: 'Aim', title: 'Does blocking the inner voice hurt recall?',
          html: '<p>To test whether <b>articulatory suppression</b> reduces recall of letter lists that sound different from each other.</p>',
          visual: '<div class="v-letters"><span>F</span><span>K</span><span>L</span><span>M</span><span>R</span><span>X</span><span>Q</span></div>' },
        { tag: 'Participants', title: '34 psychology undergraduates',
          html: '<p><b>Independent samples design:</b> half were in the control group, half in the suppression group.</p><p class="muted">Letters F, K, L, M, R, X and Q were chosen because they do not rhyme.</p>',
          visual: '<div class="v-groups"><div><b>17</b><span>control</span></div><div><b>17</b><span>suppression</span></div></div>' },
        { tag: 'Procedure', title: 'Look · wait · write',
          html: '<ol><li>A list of 7 letters was shown for <b>5 seconds</b>.</li><li>Participants waited <b>5 seconds</b>.</li><li>They wrote the letters in order.</li></ol><p>The suppression group said <b>"1, 2"</b> twice a second from seeing the list until they finished writing. Ten lists each.</p>',
          visual: '<div class="v-timeline"><div class="seg show">SHOW 5s</div><div class="seg wait">WAIT 5s</div><div class="seg recall">WRITE</div><div class="chant-line">"1, 2, 1, 2, 1, 2…"</div></div>' },
        { tag: 'Results', title: '76% vs 45%', result: true,
          html: '<p>Mean correct recall was <b>76%</b> for the control group but only <b>45%</b> for the suppression group.</p>' },
        { tag: 'Conclusion', title: 'The loop needs its inner voice',
          html: '<p>Saying "1, 2" occupied the articulatory control process, so the letters could not be rehearsed and faded from the phonological store. This supports the WMM.</p>' },
        { tag: 'Evaluate', title: 'What can — and cannot — we conclude?',
          html: '<ul class="eval"><li class="plus">Standardised procedure: easy to replicate (you just did).</li><li class="plus">Clear cause and effect: only the suppression changed.</li><li class="minus">Independent samples: the groups may have differed in memory ability.</li><li class="minus">Letter lists are artificial — low ecological validity.</li><li class="minus">Small sample of students from one university.</li></ul>' }
      ]
    },

    dualTask: {
      icon: 'split',
      name: 'Baddeley & Hitch (1974)',
      label: 'Dual-task technique',
      steps: [
        { tag: 'The problem', title: 'Is short-term memory one store?',
          html: '<p>The multi-store model said short-term memory was a <b>single</b> store. If so, filling it with one task should wreck performance on any other task.</p>',
          visual: '<div class="v-box single">ONE STORE?</div>' },
        { tag: 'Method', title: 'Do two things at once',
          html: '<p>Participants held a string of digits in mind <b>while</b> doing a reasoning task. The researchers compared performance with doing each task alone.</p><p>This is the <b>dual-task technique</b>.</p>',
          visual: '<div class="v-dual"><div class="task a">digits</div><div class="plus">+</div><div class="task b">reasoning</div></div>' },
        { tag: 'Findings', title: 'Some pairs clash, some do not',
          html: '<p>A few digits barely affected the reasoning task. Heavy loads slowed it — but it did not collapse.</p><p>Later studies found that two <b>similar</b> tasks (two verbal, or two visual) interfere much more than two <b>different</b> tasks.</p>',
          visual: '<div class="v-clash"><div class="pair ok">{i:ear}<span>+</span>{i:eye}<b>OK</b></div><div class="pair bad">{i:ear}<span>+</span>{i:ear}<b>CLASH</b></div></div>' },
        { tag: 'Conclusion', title: 'Short-term memory has several parts',
          html: '<p>If two tasks clash, they probably use the <b>same</b> component. If they coexist, they probably use <b>different</b> ones. That logic built the working memory model — and it is exactly what you tested on the grid.</p>' }
      ]
    },

    kf: {
      icon: 'hospital',
      name: 'Warrington & Shallice (1969–1974): patient KF',
      label: 'Case study',
      respectful: true,
      steps: [
        { tag: 'Background', title: 'A brain injury after a motorcycle accident',
          html: '<p>KF\'s <b>long-term memory</b> was largely intact — he could still learn new things. But his <b>short-term memory</b> was badly affected.</p><p class="muted">Case studies of brain injury let researchers see which abilities can be damaged separately.</p>',
          visual: '<div class="v-kf"><div class="store ltm">Long-term memory <b>✓ intact</b></div><div class="store stm">Short-term memory <b>✕ impaired</b></div></div>' },
        { tag: 'Findings', title: 'Heard vs seen',
          html: '<p>KF quickly forgot letters and numbers that were <b>read aloud</b> to him — but remembered them much better when he <b>saw</b> them written down.</p>',
          visual: '<div class="v-kf"><div class="store bad">{i:ear} heard words <b>poor recall</b></div><div class="store good">{i:eye} seen words <b>much better</b></div></div>' },
        { tag: 'More detail', title: 'Not all sounds',
          html: '<p>Later testing showed he could still recall <b>meaningful sounds</b> like a phone ringing or a cat meowing. The damage was specific to <b>verbal</b> auditory information.</p>' },
        { tag: 'Conclusion', title: 'Separate stores',
          html: '<p>One store was damaged while another worked. This suggests verbal and visual short-term memory are separate — the <b>phonological loop</b> and <b>visuospatial sketchpad</b>.</p>' },
        { tag: 'Evaluate', title: 'Careful with one case',
          html: '<ul class="eval"><li class="plus">Rich, detailed data followed over several years.</li><li class="plus">Shows what cannot be tested ethically in healthy people.</li><li class="minus">One person — we cannot be sure every brain is organised like this.</li><li class="minus">We do not know exactly what KF\'s memory was like before the accident.</li></ul>' }
      ]
    },

    sana: {
      icon: 'laptop',
      name: 'Sana, Weston & Cepeda (2013)',
      label: 'Laboratory experiments',
      steps: [
        { tag: 'Experiment 1', title: 'Multitasking on your own laptop',
          html: '<p><b>44 university students</b> listened to a lecture on meteorology and took notes on laptops. Half were also given small online tasks (for example, looking up what was on TV at 9 pm).</p>',
          visual: '<div class="v-lecture"><div class="stu">{i:laptop}<span>notes only</span></div><div class="stu busy">{i:laptop}<span>notes + tasks</span></div></div>' },
        { tag: 'Result 1', title: 'Multitaskers scored lower',
          html: '<p>On a comprehension test afterwards, the multitaskers scored about <b>11% lower</b>. Extra tasks increased their cognitive load.</p>',
          visual: '<div class="v-arrow down">−11%</div>' },
        { tag: 'Experiment 2', title: 'Just seeing someone else multitask',
          html: '<p>This time <b>nobody</b> multitasked themselves. Some students sat where they could see <b>other people\'s</b> laptops showing unrelated activity (actors placed by the researchers).</p>',
          visual: '<div class="v-lecture"><div class="stu">{i:notebook}<span>clear view</span></div><div class="stu busy">{i:notebook}<span>view of busy screens</span></div></div>' },
        { tag: 'Result 2', title: 'Distracted by other people',
          html: '<p>Students who could see the multitasking screens scored about <b>17% lower</b> — even though they did nothing different themselves.</p>',
          visual: '<div class="v-arrow down">−17%</div>' },
        { tag: 'Evaluate', title: 'What does this tell us?',
          html: '<ul class="eval"><li class="plus">Random allocation and a controlled lecture: strong cause and effect.</li><li class="plus">Clear real-world use: laptop rules in classrooms.</li><li class="minus">Cognitive load was assumed, not measured directly.</li><li class="minus">One short lecture — real lessons, motivation and grades differ.</li></ul>' }
      ]
    },

    mani: {
      icon: 'coins',
      name: 'Mani, Mullainathan, Shafir & Zhao (2013)',
      label: 'Lab experiment + natural experiment',
      steps: [
        { tag: 'Aim', title: 'Does money worry use up working memory?',
          html: '<p>To test whether thinking about financial problems takes up mental capacity — leaving less for other tasks.</p>' },
        { tag: 'Study 1 · lab', title: 'An easy or a hard car repair',
          html: '<p>Shoppers with lower or higher incomes read a scenario: <b>your car needs repairing</b>. For some the bill was small (about <b>$150</b>), for others large (about <b>$1,500</b>). Then they did <b>Raven\'s Progressive Matrices</b>, a reasoning test.</p>',
          visual: '<div class="v-bill"><div class="tag easy">$150</div><div class="car">{i:car}</div><div class="tag hard">$1,500</div></div>' },
        { tag: 'Result', title: 'The expensive repair only hurt the poorer group',
          html: '<p>With the <b>easy</b> scenario, both groups performed about the same. With the <b>hard</b> scenario, the lower-income participants scored clearly worse — the higher-income group did not.</p>',
          visual: '<div class="v-mini-bars"><div><span style="height:78%"></span><span style="height:76%"></span><em>$150</em></div><div><span style="height:78%"></span><span class="low" style="height:48%"></span><em>$1,500</em></div><small><i class="k1"></i>higher income <i class="k2"></i>lower income</small></div>' },
        { tag: 'Study 2 · field', title: '464 sugarcane farmers in India',
          html: '<p>In 54 villages in Tamil Nadu, farmers get most of their income once a year, at harvest. So the <b>same people</b> are poor just before the harvest and better off just after — a <b>natural experiment</b>.</p><p>They took Raven\'s test and a Stroop test at both times.</p>',
          visual: '<div class="v-harvest"><div class="season before">{i:sprout}before harvest<b>money tight</b></div><div class="season after">{i:wheat}after harvest<b>money in</b></div></div>' },
        { tag: 'Results', title: 'Better after the harvest', farm: true,
          html: '<p>After the harvest, farmers solved more Raven\'s items (<b>5.45</b> vs <b>4.35</b>), were faster on the Stroop test (<b>131 s</b> vs <b>146 s</b>) and made fewer errors (5.16 vs 5.93).</p>' },
        { tag: 'Conclusion', title: 'Poverty is a load, not a lack of ability',
          html: '<p>Worrying about money uses up working memory, leaving less for other thinking. The farmers were no less capable — they were carrying more.</p>' },
        { tag: 'Evaluate', title: 'How was load measured?',
          html: '<ul class="eval"><li class="plus">Field study: real people with real money worries — high ecological validity.</li><li class="plus">Same farmers compared with themselves, which controls for individual differences.</li><li class="minus">Lab study: the car and the bill were imaginary.</li><li class="minus">Load was <b>inferred</b> (from income or season), never measured directly.</li><li class="minus">Other things change after a harvest too: diet, sleep, workload, and practice on the tests.</li></ul>' }
      ]
    },

    modi: {
      icon: 'scalpel',
      name: 'Modi et al. (2019)',
      label: 'Laboratory experiment with brain imaging',
      steps: [
        { tag: 'Why it matters', title: 'Overload in the operating theatre',
          html: '<p>If a surgeon becomes overloaded, performance drops — with serious consequences. Could we detect overload in the brain before mistakes happen?</p>' },
        { tag: 'Method', title: '33 trainee surgeons · fNIRS',
          html: '<p>Trainees did <b>simulated keyhole surgery</b> while wearing an <b>fNIRS cap</b>. fNIRS shines near-infrared light through the skull to track changes in blood oxygen in the cortex — without surgery or injections.</p>',
          visual: '<div class="v-fnirs"><div class="head">{i:brain}</div><div class="cap"><i></i><i></i><i></i><i></i><i></i></div><div class="label">fNIRS cap</div></div>' },
        { tag: 'Procedure', title: 'Demands were added step by step',
          html: '<p>The researchers gradually made the environment more demanding — more pressure and distractions — and tracked surgical performance and brain activity.</p>',
          visual: '<div class="v-demands"><span>{i:stopwatch} time pressure</span><span>{i:bell} alarms</span><span>{i:shout} instructions</span></div>' },
        { tag: 'Results', title: 'Performance dropped · prefrontal cortex switched off',
          html: '<p>As load rose, performance fell and activity in the <b>prefrontal cortex decreased</b>. The researchers suggest this may show the surgeon <b>disengaging</b> from the task under overload.</p>',
          visual: '<div class="v-gauge"><div class="needle"></div><span>load ↑ · performance ↓ · PFC ↓</span></div>' },
        { tag: 'Evaluate', title: 'A physiological measure',
          html: '<ul class="eval"><li class="plus">Objective: does not rely on what people say.</li><li class="plus">Could one day warn surgeons in real time.</li><li class="minus">A simulator, not a real operation.</li><li class="minus">Blood oxygen is not "cognitive load" itself — it has to be interpreted.</li><li class="minus">Cannot yet be read live during real surgery.</li></ul>' }
      ]
    }
  };

  /* Result panels that compare the student's own data with the study. */
  function resultPanel(study, step, ctx) {
    if (study === STUDIES.landry && step.result) {
      const mine = ctx.result('echo', 'letterRecall');
      const rows = [
        { label: 'Study · control', value: 76, max: 100, text: '76%', tone: 'study' },
        { label: 'Study · suppression', value: 45, max: 100, text: '45%', tone: 'study alt' }
      ];
      if (mine) rows.push(
        { label: 'You · quiet', value: mine.normal, max: 100, text: mine.normal + '%', tone: 'you' },
        { label: 'You · chanting', value: mine.suppression, max: 100, text: mine.suppression + '%', tone: 'you alt' });
      return bars(rows, mine ? 'The study vs you' : 'Mean correct recall');
    }
    if (study === STUDIES.mani && step.farm) {
      return bars([
        { label: 'Raven\'s · before', value: 4.35, max: 6.5, text: '4.35 items', tone: 'study alt' },
        { label: 'Raven\'s · after', value: 5.45, max: 6.5, text: '5.45 items', tone: 'study' },
        { label: 'Stroop · before', value: 146, max: 160, text: '146 s', tone: 'study alt' },
        { label: 'Stroop · after', value: 131, max: 160, text: '131 s', tone: 'study' }
      ], 'Higher Raven\'s = better · lower Stroop time = better');
    }
    return null;
  }

  function renderStudy(mount, done, ctx, studyId) {
    const study = STUDIES[studyId];
    let i = 0, seenAll = false;
    mount.innerHTML = '';
    mount.classList.add('study-mode');
    const head = h('div', 'study-head');
    const label = h('div', 'study-label');
    label.innerHTML = `${ic(study.icon, 'study-icon')}<span>Evidence file · ${study.label}</span>`;
    head.append(label, h('h2', 'game-title', study.name));
    const dots = h('div', 'study-dots');
    const card = h('div', 'study-card' + (study.respectful ? ' respectful' : ''));
    const nav = h('div', 'study-nav');
    const prev = btn('◂ Back', () => go(i - 1), 'jrpg-btn secondary');
    const next = btn('Next ▸', () => go(i + 1), 'jrpg-btn primary');
    nav.append(prev, next);
    mount.append(head, dots, card, nav);
    study.steps.forEach((s, k) => {
      const d = btn(s.tag, () => go(k), 'study-dot');
      dots.append(d);
    });

    function go(k) {
      if (k < 0 || k >= study.steps.length) return;
      i = k;
      const s = study.steps[i];
      [...dots.children].forEach((d, n) => { d.classList.toggle('on', n === i); d.classList.toggle('seen', n < i || d.classList.contains('seen')); });
      card.innerHTML = '';
      const text = h('div', 'study-text');
      text.innerHTML = withIcons(`<div class="step-tag">${s.tag}</div><h3>${s.title}</h3>${s.html}`);
      card.append(text);
      const extra = resultPanel(study, s, ctx);
      if (extra || s.visual) {
        const vis = h('div', 'study-visual');
        if (s.visual) vis.innerHTML = withIcons(s.visual);
        if (extra) vis.append(extra);
        card.append(vis);
        card.classList.add('has-visual');
      } else card.classList.remove('has-visual');
      card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      prev.disabled = i === 0;
      next.hidden = i === study.steps.length - 1;
      if (i === study.steps.length - 1 && !seenAll) {
        seenAll = true;
        done({ viewed: true });
      }
    }
    go(0);
  }

  /* ── Interactive working memory model ─────────────────────── */
  const PARTS = [
    { id: 'ce', name: 'Central executive', icon: 'executive_control', tone: 'gold',
      text: 'The boss. Directs attention, blocks distractions, switches between tasks and sends information to the right component. Limited capacity; handles any type of information.',
      you: 'You used it in the Stroop test and the Switchyard.' },
    { id: 'pl', name: 'Phonological loop', icon: 'phonological_loop', tone: 'blue',
      text: 'Holds sounds and words. The <b>inner ear</b> (phonological store) holds them for about 2 seconds; the <b>inner voice</b> (articulatory control process) rehearses them.',
      you: 'You overloaded it when you chanted "1, 2".' },
    { id: 'vs', name: 'Visuospatial sketchpad', icon: 'visuospatial', tone: 'teal',
      text: 'The <b>inner eye</b>. Holds what things look like and where they are: shapes, colours, positions, routes.',
      you: 'You overloaded it when you tapped pads while holding a route.' },
    { id: 'eb', name: 'Episodic buffer', icon: 'episodic_buffer', tone: 'violet',
      text: 'Added in 2000. Combines information from the other parts and from long-term memory into one experience. Limited capacity.',
      you: 'You used it in the Story Loom — if your class played it.' },
    { id: 'ltm', name: 'Long-term memory', icon: 'working_memory', tone: 'grey',
      text: 'Not part of working memory itself, but all components exchange information with it.',
      you: 'Your knowledge of the alphabet helped crack codes later.' }
  ];

  function renderModel(mount, done) {
    mount.innerHTML = '';
    mount.append(h('h2', 'game-title', 'The Working Memory Model'), h('p', 'game-instruction', 'Baddeley & Hitch (1974), with the episodic buffer added by Baddeley (2000). Tap each part.'));
    const wrap = h('div', 'wmm');
    const diagram = h('div', 'wmm-diagram');
    const info = h('div', 'wmm-info');
    info.innerHTML = '<p class="muted">Tap a component to open it.</p>';
    const opened = new Set();
    PARTS.forEach(p => {
      const node = btn('', () => open(p, node), `wmm-node ${p.id} ${p.tone}`);
      node.innerHTML = `<img src="assets/icons/${p.icon}.webp" alt=""><span>${p.name}</span>`;
      diagram.append(node);
    });
    const lines = h('div', 'wmm-lines');
    diagram.prepend(lines);
    wrap.append(diagram, info);
    mount.append(wrap);
    function open(p, node) {
      opened.add(p.id);
      [...diagram.querySelectorAll('.wmm-node')].forEach(n => n.classList.remove('active'));
      node.classList.add('active', 'seen');
      info.innerHTML = `<h3>${p.name}</h3><p>${p.text}</p><p class="you">${p.you}</p><p class="count">${opened.size} of ${PARTS.length} opened</p>`;
      if (opened.size === PARTS.length) done({ viewed: true });
    }
  }

  window.Studies = { renderStudy, renderModel, STUDIES, ic };
})();
