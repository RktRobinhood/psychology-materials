/* Two Minds — pages, station flows (Learn / Teach) and quiz engine. */
(function () {
  'use strict';
  const { util, ui } = DPT;
  const { esc, shuffle } = util;
  const app = document.getElementById('app');

  /* ── Routing ───────────────────────────────────────────── */
  // ''          → library of stations
  // #s3         → station 3 landing (what the laptop shows between visitors)
  // #s3/learn   → learn flow        #s3/teach → teach flow
  function route() {
    const m = location.hash.match(/^#s(\d+)(?:\/(learn|teach))?/);
    window.scrollTo(0, 0);
    if (!m) return renderHome();
    const st = DPT.get(m[1]);
    if (!st) return renderHome();
    if (!m[2]) return renderLanding(st);
    return runFlow(st, m[2]);
  }
  window.addEventListener('hashchange', route);

  const hueStyle = st => `--hue:${st.hue ?? 20}`;

  /* ── Icons (Lucide, ISC licence) ───────────────────────── */
  const ICONS = {
    wason: 'layers', crt: 'calculator', anchoring: 'anchor', confirmation: 'search-check',
    framing: 'frame', availability: 'lightbulb', conjunction: 'blend', baserate: 'car-taxi-front',
    beliefbias: 'scale', illusory: 'users',
  };
  const icon = (name, cls = '') => `<i data-lucide="${name}" class="${cls}"></i>`;
  let iconQueued = false;
  new MutationObserver(() => {
    if (iconQueued || !window.lucide) return;
    iconQueued = true;
    requestAnimationFrame(() => { iconQueued = false; window.lucide.createIcons(); });
  }).observe(app, { childList: true, subtree: true });

  /* ── Sound: delegated taps + mute toggle ───────────────── */
  const sfx = DPT.sfx;
  app.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t || t.disabled) return;
    if (t.closest('.flipdemo')) return sfx.play('flip');
    if (t.matches('.wcard, .choice')) return sfx.play('tap');
    if (t.matches('.lock-b')) return sfx.play('lock');
    if (t.matches('.mute-btn, .q-opt, .wu-b')) return;
    if (t.matches('.btn, .mode-btn, .st-card-main')) sfx.play('click');
  });
  app.addEventListener('change', e => { if (e.target.matches('.check-item input') && e.target.checked) sfx.play('tap'); });
  const muteBtn = () => `<button class="mute-btn" type="button" title="Sound on/off" aria-label="Sound on/off">${icon(sfx.muted ? 'volume-x' : 'volume-2')}</button>`;
  app.addEventListener('click', e => {
    const b = e.target.closest('.mute-btn');
    if (!b) return;
    const m = sfx.toggle();
    app.querySelectorAll('.mute-btn').forEach(x => { x.innerHTML = icon(m ? 'volume-x' : 'volume-2'); });
    if (!m) sfx.play('tap');
  });

  /* ── Home ──────────────────────────────────────────────── */
  const WARMUP = [
    ['Reading a shop sign as you walk past it', 1],
    ['Working out 17 × 24 without a calculator', 2],
    ['Hearing from one word that your friend is upset', 1],
    ['Comparing two phone contracts to find the cheaper one over two years', 2],
    ['Finishing the phrase “salt and …”', 1],
    ['Checking whether an argument in an essay actually follows logically', 2],
    ['Flinching when a ball flies towards your face', 1],
    ['Counting how many times the letter “e” appears in a paragraph', 2],
  ];

  function renderHome() {
    document.title = 'Two Minds — Dual Process Theory & Cognitive Biases';
    app.innerHTML = `
    <header class="home-hero">
      <div class="wrap hero-grid">
        <div class="hero-text">
        <p class="kicker">IB Psychology · Cognitive approach · Thinking &amp; decision-making</p>
        <h1 class="display">Two <span class="s1-word">Min</span><span class="s2-word">ds</span></h1>
        <p class="lede">Your brain runs two kinds of thinking: one fast and automatic, one slow and effortful. Most of the time the fast one is in charge, and that is where cognitive biases come from. Ten stations, ten biases. Experience one, work out why it happened, then teach it.</p>
        <div class="hero-sys">
          <div class="sys-chip s1">${icon('rabbit')}<b>System 1</b> fast · automatic · effortless · intuitive</div>
          <div class="sys-chip s2">${icon('turtle')}<b>System 2</b> slow · deliberate · effortful · logical</div>
        </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="orb s1">${icon('rabbit')}</div>
          <div class="orb s2">${icon('turtle')}</div>
        </div>
        <div class="hero-mute">${muteBtn()}</div>
      </div>
    </header>

    <main class="wrap home-main">
      <section class="home-block">
        <h2>How the lesson works</h2>
        <div class="how-grid">
          <div class="how"><span class="how-ic">${icon('book-open')}</span><span class="how-n">1</span><h3>Learn your station</h3><p>Your group gets one station. Press <b>Learn</b>: do the experiment yourself first, then work through the step-by-step explanation and the quiz.</p></div>
          <div class="how"><span class="how-ic">${icon('presentation')}</span><span class="how-n">2</span><h3>Host a visitor</h3><p>When a visitor arrives, press <b>Teach</b>. It skips the explanation and goes straight to the experiment. <b>You</b> do the explaining, from memory.</p></div>
          <div class="how"><span class="how-ic">${icon('swords')}</span><span class="how-n">3</span><h3>Quiz each other</h3><p>Teach mode finishes with a head-to-head quiz for the host and the guest. It includes questions the host hasn't seen before.</p></div>
        </div>
      </section>

      <section class="home-block">
        <h2>The theory in two minutes</h2>
        <div class="primer">
          <p><b>Dual process theory</b> says that thinking and decision-making run on two systems. You can't avoid making hundreds of decisions a day, and thinking hard about every one would exhaust you. So the brain acts as a <b>cognitive miser</b>: it saves effort by letting a fast, automatic system handle most things, and brings in slow, careful reasoning only when it has to.</p>
          ${ui.s1s2(
            `<ul><li>Automatic, quick, needs almost no effort</li><li>Runs on <b>heuristics</b>, mental rules of thumb</li><li>Driven by context and whatever evidence is in front of it; ignores what's missing</li><li>Gives impressions, gut feelings and a strong sense of certainty</li><li>Handles everyday decisions; takes over when cognitive load is high or time is short</li></ul>`,
            `<ul><li>Conscious, slow, takes effort</li><li>Works through possibilities and rules them out one by one</li><li>Can think abstractly and apply a rule to a new situation</li><li>More logical and more reliable, but feels less certain</li><li>Needs time, motivation and spare mental capacity</li></ul>`
          )}
          <p>The key point for this lesson: <b>System 1 answers first.</b> Its answer arrives quickly and feels right, so System 2 often accepts it without checking. When a heuristic doesn't fit the situation, the result is a <b>cognitive bias</b>: an error that is <i>systematic</i> (it happens to most people in the same direction), not random.</p>
        </div>
      </section>

      <section class="home-block">
        <h2>Warm-up: System 1 or System 2?</h2>
        <p class="muted">Decide for each one. Most things use both systems, so pick whichever does most of the work.</p>
        <div class="warmup" id="warmup"></div>
      </section>

      <section class="home-block">
        <h2>The stations</h2>
        <div class="station-grid">
          ${DPT.stations.map(st => `
            <article class="st-card" style="${hueStyle(st)}">
              <a class="st-card-main" href="#s${st.num}">
                <span class="st-top"><span class="st-num">${String(st.num).padStart(2, '0')}</span><span class="st-icon">${icon(ICONS[st.id] || 'brain')}</span></span>
                <span class="st-bias">${esc(st.bias)}</span>
                <span class="st-title">${esc(st.title)}</span>
                <span class="st-hook">${esc(st.hook)}</span>
              </a>
              <div class="st-actions">
                <a class="btn small learn" href="#s${st.num}/learn">Learn</a>
                <a class="btn small teach" href="#s${st.num}/teach">Teach</a>
              </div>
            </article>`).join('')}
        </div>
      </section>

      <section class="home-block">
        <details class="teacher">
          <summary>Teacher guide</summary>
          <div class="teacher-body">
            <h3>Set-up</h3>
            <ul>
              <li>One laptop per station. Open each laptop on its station page (click the station card) so it shows the big station number and the Learn / Teach buttons. Each station has its own address ending in <code>#s1</code> to <code>#s10</code>, which you can bookmark.</li>
              <li>Groups of 2–3 per station. Everyone in the group should be ready to host.</li>
            </ul>
            <h3>Suggested timing (about 75 min)</h3>
            <ol>
              <li><b>Round 0, whole class (5 min):</b> the primer and warm-up above on the board.</li>
              <li><b>Round 1, Learn (15–20 min):</b> each group does its own station in Learn mode, together, and finishes the quiz.</li>
              <li><b>Rounds 2–5, rotate (10 min each):</b> split every group into <i>hosts</i> and <i>visitors</i>. Visitors move to the next station; hosts run Teach mode for them. Swap the roles each round, or every two rounds, so everyone both hosts and visits.</li>
              <li><b>Plenary (5 min):</b> which biases share the same System 1 shortcut? (Substitution, ease of retrieval, surface features.)</li>
            </ol>
            <h3>Station notes</h3>
            <ul>
              <li>The <b>IB-required biases</b> are Anchoring (station 3) and Confirmation bias (station 4). Put your strongest groups there or have everyone visit both.</li>
              <li>Some stations assign visitors to conditions at random and <b>save anonymous results on that laptop</b>, so over the lesson each station builds up its own class data set. Clear it below before a new class.</li>
              <li>Teach mode has a head-to-head quiz drawing on a bigger question pool, including questions that never appear in Learn mode. Question order and answer order are shuffled every time.</li>
            </ul>
            <button class="btn ghost small" id="clearData">Clear saved class data on this laptop</button>
          </div>
        </details>
      </section>
      <footer class="foot">Two Minds · original teaching material. Studies cited are summarised for classroom use.</footer>
    </main>`;

    const wu = document.getElementById('warmup');
    let answered = 0, right = 0;
    wu.innerHTML = shuffle(WARMUP).map(([text, sys], i) => `
      <div class="wu-item" data-sys="${sys}">
        <span class="wu-text">${esc(text)}</span>
        <span class="wu-btns"><button class="wu-b s1" data-pick="1">S1</button><button class="wu-b s2" data-pick="2">S2</button></span>
      </div>`).join('') + `<p class="wu-score" id="wuScore"></p>`;
    wu.addEventListener('click', e => {
      const b = e.target.closest('.wu-b');
      if (!b) return;
      const item = b.closest('.wu-item');
      if (item.classList.contains('done')) return;
      item.classList.add('done');
      const ok = b.dataset.pick === item.dataset.sys;
      answered++; if (ok) right++;
      item.classList.add(ok ? 'ok' : 'no');
      sfx.play(ok ? 'correct' : 'wrong');
      item.querySelector(`.wu-b.s${item.dataset.sys}`).classList.add('answer');
      if (answered === WARMUP.length) document.getElementById('wuScore').textContent = `${right} / ${WARMUP.length}. Did you have to think about any of them? That was System 2 at work.`;
    });

    document.getElementById('clearData').onclick = () => {
      DPT.stations.forEach(st => DPT.pool(st.id).clear());
      DPT.toast('Saved class data cleared on this laptop');
    };
  }

  /* ── Station landing ───────────────────────────────────── */
  function renderLanding(st) {
    document.title = `Station ${st.num} · ${st.title}`;
    app.innerHTML = `
    <div class="landing" style="${hueStyle(st)}">
      <div class="landing-bar"><a class="landing-home" href="#">← All stations</a>${muteBtn()}</div>
      <div class="landing-inner">
        <div class="landing-icon">${icon(ICONS[st.id] || 'brain')}</div>
        <div class="landing-num">Station ${st.num}</div>
        <h1 class="landing-title">${esc(st.title)}</h1>
        <p class="landing-hook">${esc(st.hook)}</p>
        <div class="landing-modes">
          <a class="mode-btn learn" href="#s${st.num}/learn">
            <span class="mode-name">${icon('book-open')} Learn</span>
            <span class="mode-desc">First time here? Do the experiment, then get a full step-by-step explanation and a quiz.</span>
          </a>
          <a class="mode-btn teach" href="#s${st.num}/teach">
            <span class="mode-name">${icon('presentation')} Teach</span>
            <span class="mode-desc">Hosting a visitor? Straight into the experiment. You explain it, then you both take the quiz.</span>
          </a>
        </div>
        <p class="landing-bias">Bias at this station: <b>${esc(st.bias)}</b> · about ${st.minutes || 15} min</p>
      </div>
    </div>`;
  }

  /* ── Flow engine ───────────────────────────────────────── */
  function runFlow(st, mode) {
    document.title = `Station ${st.num} · ${mode === 'learn' ? 'Learn' : 'Teach'} · ${st.title}`;
    const state = { result: null, done: false };
    const screens = mode === 'learn' ? learnScreens(st, state) : teachScreens(st, state);
    let idx = 0;

    app.innerHTML = `
    <div class="flow ${mode}" style="${hueStyle(st)}">
      <header class="flow-top">
        <a class="flow-back" href="#s${st.num}" title="Back to station start">‹ Station ${st.num}</a>
        <div class="flow-title"><span class="flow-mode ${mode}">${mode === 'learn' ? 'Learn' : 'Teach'}</span> ${esc(st.title)}</div>
        <div class="flow-dots" id="dots"></div>
        ${muteBtn()}
      </header>
      <main class="flow-stage" id="stage"></main>
      <nav class="flow-nav">
        <button class="btn ghost" id="prevBtn">‹ Back</button>
        <span class="flow-label" id="navLabel"></span>
        <button class="btn primary" id="nextBtn">Next ›</button>
      </nav>
    </div>`;

    const stage = document.getElementById('stage');
    const dots = document.getElementById('dots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navLabel = document.getElementById('navLabel');

    screens.forEach(s => {
      s.el = document.createElement('section');
      s.el.className = 'screen';
      s.el.hidden = true;
      stage.appendChild(s.el);
    });
    dots.innerHTML = screens.map((s, i) => `<span class="dot" title="${esc(s.label)}"></span>`).join('');

    const ctx = {
      mode, station: st, state,
      pool: DPT.pool(st.id),
      done(result) {
        if (!state.done) sfx.play('lock');
        state.result = result;
        state.done = true;
        refreshNav();
      },
      next() { go(idx + 1); },
      refreshNav,
    };

    function refreshNav() {
      const s = screens[idx];
      const locked = s.locked && s.locked();
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = !!locked;
      nextBtn.textContent = idx === screens.length - 1 ? 'Finish ›' : (s.nextLabel || 'Next ›');
      navLabel.textContent = locked ? (s.lockHint || 'Finish this step to continue') : s.label;
      [...dots.children].forEach((d, i) => d.className = 'dot' + (i < idx ? ' past' : i === idx ? ' now' : ''));
    }

    function go(i) {
      if (i < 0) return;
      if (i >= screens.length) { location.hash = `#s${st.num}`; return; }
      screens[idx].el.hidden = true;
      idx = i;
      const s = screens[idx];
      if (!s.rendered || s.rerender) {
        s.el.innerHTML = '';
        s.render(s.el, ctx);
        s.rendered = true;
      }
      s.el.hidden = false;
      stage.scrollTop = 0;
      window.scrollTo(0, 0);
      refreshNav();
    }

    prevBtn.onclick = () => go(idx - 1);
    nextBtn.onclick = () => go(idx + 1);
    go(0);
  }

  const resolve = (v, ctx) => typeof v === 'function' ? v(ctx.state.result, ctx) : (v || '');

  function screenHead(kicker, title) {
    return `<p class="kicker">${kicker}</p><h2 class="screen-title">${title}</h2>`;
  }

  function experimentScreen(st, state, label) {
    return {
      label, locked: () => !state.done, lockHint: 'Finish the experiment to continue',
      render(el, ctx) {
        el.classList.add('exp-screen');
        st.experiment(el, ctx);
      },
    };
  }

  function revealScreen(st, kicker) {
    return {
      label: 'Your results', rerender: true,
      render(el, ctx) {
        sfx.play('reveal');
        el.innerHTML = screenHead(kicker, 'What happened?');
        const body = document.createElement('div');
        el.appendChild(body);
        const out = st.reveal(state_(ctx), ctx, body);
        if (typeof out === 'string') body.innerHTML = out;
      },
    };
  }
  const state_ = ctx => ctx.state.result;

  function learnScreens(st, state) {
    const list = [];
    list.push({
      label: 'Start',
      render(el, ctx) {
        el.innerHTML = `${screenHead(`Station ${st.num} · Learn mode`, esc(st.title))}
          <div class="prose">${resolve(st.intro?.learn, ctx)}</div>
          ${ui.callout('note', `<b>Do the experiment before you read anything else.</b> Answer honestly and go with your first instinct if you have one. The bias is easiest to understand once you've fallen for it yourself.`)}
          <div class="plan"><span>1 · Experiment</span><span>2 · Your results</span><span>3 · Step-by-step explanation</span><span>4 · Prepare to teach</span><span>5 · Quiz</span></div>`;
      },
    });
    list.push(experimentScreen(st, state, 'Experiment'));
    list.push(revealScreen(st, 'Step 2 · Your results'));
    (st.steps || []).forEach((step, i) => {
      list.push({
        label: step.label || step.kicker,
        rerender: true,
        render(el, ctx) {
          el.innerHTML = screenHead(`Explanation ${i + 1} of ${st.steps.length} · ${step.kicker}`, step.title);
          const body = document.createElement('div');
          body.className = 'prose';
          el.appendChild(body);
          if (step.render) step.render(body, state.result, ctx);
          else body.innerHTML = resolve(step.html, ctx);
        },
      });
    });
    list.push({
      label: 'Prepare to teach',
      render(el, ctx) {
        el.innerHTML = `${screenHead('Get ready to host', 'Your turn to teach')}
          <p class="prose">In <b>Teach mode</b> your visitor does the experiment, then you explain it <b>without the text</b>. You'll only see the headings below as a checklist. Read each hint, then cover it and say it out loud to your group.</p>
          ${hostChecklist(st, true)}
          ${st.host?.ask?.length ? `<h3>Questions to ask your visitor</h3><ul class="ask">${st.host.ask.map(q => `<li>${q}</li>`).join('')}</ul>` : ''}
          ${ui.callout('tip', `<b>Good hosting:</b> ask before you tell. Let your visitor say what they answered and why before you name the bias. Then walk them through step by step, exactly as you were walked through.`)}`;
      },
    });
    list.push({
      label: 'Quiz',
      render(el, ctx) {
        el.innerHTML = screenHead('Check your understanding', 'Quiz');
        soloQuiz(el, st);
      },
    });
    list.push({
      label: 'Done',
      render(el) {
        el.innerHTML = `${screenHead('Station complete', 'You’re ready to host')}
          <div class="prose"><p>When a visitor arrives, go back to the station start and press <b>Teach</b>. Hand them the laptop for the experiment and keep the explanation in your head.</p></div>
          <div class="done-actions">
            <a class="btn teach" href="#s${st.num}/teach">Start Teach mode</a>
            <a class="btn ghost" href="#s${st.num}/learn" onclick="setTimeout(()=>location.reload(),0)">Redo Learn mode</a>
          </div>`;
      },
    });
    return list;
  }

  function hostChecklist(st, showHints) {
    const items = st.host?.checklist || [];
    return `<div class="checklist ${showHints ? 'open' : ''}">${items.map((c, i) => `
      <div class="check-item">
        <label><input type="checkbox"><span class="check-n">${i + 1}</span><span class="check-point">${c.point}</span></label>
        ${c.hint ? `<div class="check-hint" ${showHints ? '' : 'hidden'}>${c.hint}</div>
        ${showHints ? '' : `<button class="peek" type="button">peek</button>`}` : ''}
      </div>`).join('')}</div>`;
  }

  function teachScreens(st, state) {
    const list = [];
    list.push({
      label: 'Host briefing',
      render(el, ctx) {
        el.innerHTML = `${screenHead(`Station ${st.num} · Teach mode`, 'Host briefing')}
          <div class="brief-grid">
            <div class="brief host"><h3>Host (you)</h3><ul>
              <li>Hand the laptop to your guest. <b>Don't explain anything yet</b>, and don't give away the answer.</li>
              <li>Watch what they choose. Their mistakes are your teaching material.</li>
              <li>Afterwards you explain it. The next screens give you headings only, no script.</li>
            </ul></div>
            <div class="brief guest"><h3>Guest</h3><ul>
              <li>Do the experiment honestly. Your first instinct is what matters here.</li>
              <li>Don't try to spot the trick. Just answer.</li>
              <li>At the end you'll be quizzed against your host.</li>
            </ul></div>
          </div>
          ${st.intro?.teach ? `<div class="prose">${resolve(st.intro.teach, ctx)}</div>` : ''}
          <p class="handover">➜ Guest, you have the controls. Press <b>Next</b>.</p>`;
      },
    });
    list.push(experimentScreen(st, state, 'Experiment'));
    list.push(revealScreen(st, 'Results'));
    list.push({
      label: 'Explain it',
      render(el, ctx) {
        el.innerHTML = `${screenHead('Host: your turn', 'Explain what just happened')}
          <p class="prose">Go through the points in order and tick each one off. Only press <b>peek</b> if you're stuck.</p>
          ${hostChecklist(st, false)}
          ${st.host?.visual ? `<div class="host-visual"><div class="hv-label">Use this to explain</div>${resolve(st.host.visual, ctx)}</div>` : ''}
          ${st.host?.ask?.length ? `<h3>Ask your guest</h3><ul class="ask">${st.host.ask.map(q => `<li>${q}</li>`).join('')}</ul>` : ''}
          ${ui.callout('tip', `<b>Before the quiz:</b> ask your guest to explain the bias back to you in one or two sentences, using the words <i>System 1</i> and <i>System 2</i>.`)}`;
        el.querySelectorAll('.peek').forEach(b => b.onclick = () => {
          b.previousElementSibling.hidden = false;
          b.remove();
        });
      },
    });
    list.push({
      label: 'Head-to-head quiz',
      render(el) {
        el.innerHTML = screenHead('Host vs Guest', 'Head-to-head quiz');
        duelQuiz(el, st);
      },
    });
    list.push({
      label: 'Wrap-up',
      render(el) {
        el.innerHTML = `${screenHead('Before your guest leaves', 'Wrap-up')}
          <div class="prose">
            <p><b>Guest:</b> say out loud, in one sentence each:</p>
            <ol class="walk">
              <li>What is <b>${esc(st.bias)}</b>?</li>
              <li>What did System 1 do in the experiment, and what would System 2 have done?</li>
              <li>Name one study or real-life example.</li>
            </ol>
            <p><b>Host:</b> which point was hardest to explain? Look it up in Learn mode before your next visitor arrives.</p>
          </div>
          <div class="done-actions">
            <a class="btn teach" href="#s${st.num}/teach" onclick="setTimeout(()=>location.reload(),0)">Next visitor</a>
            <a class="btn ghost" href="#s${st.num}">Station start</a>
          </div>`;
      },
    });
    return list;
  }

  /* ── Quiz engine ───────────────────────────────────────── */
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  function prepare(q) {
    const opts = shuffle([{ t: q.a, ok: true }, ...q.d.map(t => ({ t, ok: false }))]);
    return { ...q, opts, correct: opts.findIndex(o => o.ok) };
  }

  function soloQuiz(el, st) {
    const box = document.createElement('div');
    box.className = 'quiz';
    el.appendChild(box);
    const N = 5;
    let qs, i, score;
    function start() {
      qs = shuffle(st.quiz.core).slice(0, N).map(prepare);
      i = 0; score = 0;
      show();
    }
    function show() {
      if (i >= qs.length) {
        sfx.play(score === qs.length ? 'win' : 'done');
        box.innerHTML = `<div class="quiz-end">
          <div class="quiz-score">${score} / ${qs.length}</div>
          <p>${score === qs.length ? 'Perfect. You’re ready to host.' : score >= qs.length - 1 ? 'Nearly there. Reread the explanation for the one you missed.' : 'Go back through the explanation steps, then try again. The questions come in a new order each time.'}</p>
          <button class="btn ghost" id="again">Try again</button></div>`;
        box.querySelector('#again').onclick = start;
        return;
      }
      const q = qs[i];
      box.innerHTML = `<div class="q-count">Question ${i + 1} of ${qs.length}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-opts">${q.opts.map((o, k) => `<button class="q-opt" data-k="${k}"><span class="q-letter">${LETTERS[k]}</span><span>${o.t}</span></button>`).join('')}</div>
        <div class="q-why" hidden></div>`;
      box.querySelectorAll('.q-opt').forEach(b => b.onclick = () => {
        const k = +b.dataset.k;
        box.querySelectorAll('.q-opt').forEach((x, j) => {
          x.disabled = true;
          if (j === q.correct) x.classList.add('correct');
          else if (j === k) x.classList.add('wrong');
        });
        if (k === q.correct) score++;
        sfx.play(k === q.correct ? 'correct' : 'wrong');
        const why = box.querySelector('.q-why');
        why.hidden = false;
        why.innerHTML = `<b>${k === q.correct ? 'Correct.' : 'Not quite.'}</b> ${q.why || ''}
          <div><button class="btn primary small" id="qnext">${i === qs.length - 1 ? 'See score' : 'Next question'}</button></div>`;
        why.querySelector('#qnext').onclick = () => { i++; show(); };
      });
    }
    start();
  }

  function duelQuiz(el, st) {
    const box = document.createElement('div');
    box.className = 'quiz duel';
    el.appendChild(box);
    const TOTAL = 6;
    let qs, i, scores;
    function start() {
      const extra = shuffle(st.quiz.extra || []).slice(0, 3).map(q => ({ ...q, fresh: true }));
      const core = shuffle(st.quiz.core).slice(0, TOTAL - extra.length);
      qs = shuffle([...extra, ...core]).map(prepare);
      i = 0; scores = { guest: 0, host: 0 };
      show();
    }
    function show() {
      if (i >= qs.length) {
        const { guest, host } = scores;
        sfx.play('win');
        const verdict = guest > host ? 'The guest wins! Good teaching, host.' : host > guest ? 'The host wins this time.' : 'A draw!';
        box.innerHTML = `<div class="quiz-end">
          <div class="duel-final"><div><span>Guest</span><b>${guest}</b></div><div><span>Host</span><b>${host}</b></div></div>
          <p>${verdict} Any question you both missed is worth talking through now.</p>
          <button class="btn ghost" id="again">Rematch (new questions)</button></div>`;
        box.querySelector('#again').onclick = start;
        return;
      }
      const q = qs[i];
      const picks = { guest: null, host: null };
      box.innerHTML = `
        <div class="duel-bar"><span>Question ${i + 1} of ${qs.length}</span>${q.fresh ? '<span class="fresh">NEW: not in Learn mode</span>' : ''}<span class="duel-score">Guest <b>${scores.guest}</b> · Host <b>${scores.host}</b></span></div>
        <div class="q-text">${q.q}</div>
        <div class="q-opts plain">${q.opts.map((o, k) => `<div class="q-opt" data-k="${k}"><span class="q-letter">${LETTERS[k]}</span><span>${o.t}</span></div>`).join('')}</div>
        <div class="lockrows">
          ${['guest', 'host'].map(who => `<div class="lockrow" data-who="${who}">
            <span class="lock-who">${who === 'guest' ? 'Guest' : 'Host'}</span>
            <span class="lock-btns">${q.opts.map((o, k) => `<button class="lock-b" data-k="${k}">${LETTERS[k]}</button>`).join('')}</span>
            <span class="lock-status">choose secretly</span></div>`).join('')}
        </div>
        <p class="lock-tip">Take turns. The other player looks away. Your choice stays hidden until the reveal.</p>
        <div class="q-why" hidden></div>`;
      box.querySelectorAll('.lockrow').forEach(row => {
        const who = row.dataset.who;
        row.querySelectorAll('.lock-b').forEach(b => b.onclick = () => {
          picks[who] = +b.dataset.k;
          row.classList.add('locked');
          row.querySelectorAll('.lock-b').forEach(x => x.disabled = true);
          row.querySelector('.lock-status').textContent = '🔒 locked in';
          if (picks.guest !== null && picks.host !== null) reveal();
        });
      });
      function reveal() {
        const anyRight = picks.guest === q.correct || picks.host === q.correct;
        setTimeout(() => sfx.play(anyRight ? 'correct' : 'wrong'), 350);
        box.querySelectorAll('.q-opts .q-opt').forEach((x, j) => { if (j === q.correct) x.classList.add('correct'); });
        box.querySelectorAll('.lockrow').forEach(row => {
          const who = row.dataset.who;
          const ok = picks[who] === q.correct;
          if (ok) scores[who]++;
          row.classList.add(ok ? 'ok' : 'no');
          row.querySelector('.lock-status').textContent = `${LETTERS[picks[who]]} · ${ok ? '✓ correct' : '✗ wrong'}`;
        });
        box.querySelector('.duel-score').innerHTML = `Guest <b>${scores.guest}</b> · Host <b>${scores.host}</b>`;
        box.querySelector('.lock-tip').hidden = true;
        const why = box.querySelector('.q-why');
        why.hidden = false;
        why.innerHTML = `${q.why || ''}<div><button class="btn primary small" id="qnext">${i === qs.length - 1 ? 'Final score' : 'Next question'}</button></div>`;
        why.querySelector('#qnext').onclick = () => { i++; show(); };
      }
    }
    start();
  }

  route();
})();
