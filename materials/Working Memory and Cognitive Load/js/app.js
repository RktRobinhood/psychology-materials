/* Memory Quest — lesson engine: navigation, screens, teacher tools, evidence PDF. */
(() => {
  const data = window.MEMORY_QUEST;
  const { h, btn, shuffle, bars } = window.MQHelpers;
  const $ = id => document.getElementById(id);
  const els = {
    scene: $('scene'), portrait: $('portraitImg'), portraitStage: $('portraitStage'),
    dialogue: $('dialogueText'), speaker: $('speakerName'), avatar: $('speakerAvatar'), dialogueBox: $('dialogueBox'),
    next: $('continueBtn'), back: $('backBtn'), replay: $('replayBtn'),
    panel: $('panel'), chapter: $('chapterLabel'), progress: $('progressFill'), step: $('screenProgress'),
    sigils: $('sigilBar'), menu: $('chapterMenu'), chapterList: $('chapterList'),
    teacher: $('teacherPanel'), teacherBody: $('teacherBody'), toast: $('toast'), lockHint: $('lockHint')
  };

  /* ── state ─────────────────────────────────────────────── */
  const blank = () => ({ chapter: 0, screen: 0, earned: [], results: {}, polls: {}, writes: {}, checks: {}, tally: {}, memo: {}, done: {}, recap: {}, maxChapter: 0, presenterUsed: false, sound: true, presenter: false, reducedMotion: false, calm: false, name: '', group: '' });
  let state = load();
  function load() {
    try { return { ...blank(), ...JSON.parse(localStorage.getItem(data.meta.storageKey) || '{}') }; }
    catch { return blank(); }
  }
  function save() { try { localStorage.setItem(data.meta.storageKey, JSON.stringify(state)); } catch { /* storage blocked: progress lives only in this tab */ } }

  const chapter = () => data.chapters[state.chapter];
  const screen = () => chapter().screens[state.screen];
  const key = (c = state.chapter, s = state.screen) => `${data.chapters[c].id}:${s}`;
  const totalScreens = data.chapters.reduce((n, c) => n + c.screens.length, 0);
  const flatIndex = () => data.chapters.slice(0, state.chapter).reduce((n, c) => n + c.screens.length, 0) + state.screen;

  /* ── audio & speech ────────────────────────────────────── */
  // CC0 sound effects from kenney.nl, pre-mixed to even loudness (see assets/CREDITS.md).
  // Web Audio keeps latency low so the metronome stays in time; <audio> is the fallback.
  const SFX = ['page1', 'page2', 'back', 'tile', 'tap', 'correct', 'wrong', 'tick', 'sigil', 'victory', 'shatter', 'notify', 'open', 'close', 'count', 'unlock'];
  const VOLUMES = { high: 1, low: .4, off: 0 };
  if (!(state.volume in VOLUMES)) state.volume = state.sound === false ? 'off' : 'high';
  let actx = null, master = null;
  const buffers = {}, fallback = {};
  function audioInit() {
    if (actx || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = VOLUMES[state.volume];
      master.connect(actx.destination);
      SFX.forEach(name => fetch(`assets/audio/${name}.wav`)
        .then(r => r.arrayBuffer())
        .then(b => actx.decodeAudioData(b))
        .then(buf => { buffers[name] = buf; })
        .catch(() => { /* file:// blocks fetch: <audio> fallback below */ }));
    } catch { actx = null; }
  }
  // Browsers only allow audio after a user gesture.
  ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => {
    audioInit();
    if (actx && actx.state === 'suspended') actx.resume();
  }, { capture: true }));
  function sound(name) {
    const vol = VOLUMES[state.volume];
    if (!vol) return;
    if (name === 'page') name = Math.random() < .5 ? 'page1' : 'page2';
    try {
      if (actx && buffers[name]) {
        const src = actx.createBufferSource();
        src.buffer = buffers[name];
        src.playbackRate.value = name === 'tap' || name === 'tile' ? .96 + Math.random() * .08 : 1;
        src.connect(master);
        src.start();
        return;
      }
      const base = fallback[name] || (fallback[name] = new Audio(`assets/audio/${name}.wav`));
      const a = base.cloneNode();
      a.volume = vol;
      a.play().catch(() => {});
    } catch { /* no audio */ }
  }
  function setVolume(v) {
    state.volume = v;
    state.sound = v !== 'off';
    if (master) master.gain.value = VOLUMES[v];
    save();
  }
  function speak(text) {
    return new Promise(resolve => {
      if (!state.sound || !('speechSynthesis' in window)) return resolve(false);
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = .92; u.lang = 'en-GB';
        let settled = false;
        const finish = ok => { if (!settled) { settled = true; resolve(ok); } };
        u.onend = () => finish(true);
        u.onerror = () => finish(false);
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
        setTimeout(() => { if (!speechSynthesis.speaking) finish(false); }, 1500);
        setTimeout(() => finish(true), 12000);
      } catch { resolve(false); }
    });
  }

  /* ── per-screen context: cancellable timers and key handlers ── */
  let run = null;
  function newRun() {
    if (run) run.cancel();
    const timers = new Set(), intervals = new Set(), keys = new Set();
    let alive = true;
    const r = {
      sleep: ms => new Promise(res => { const t = setTimeout(() => { timers.delete(t); if (alive) res(); }, ms); timers.add(t); }),
      every: (ms, fn) => { const t = setInterval(() => alive && fn(), ms); intervals.add(t); return t; },
      stop: t => { clearInterval(t); intervals.delete(t); },
      onKey: fn => keys.add(fn),
      offKey: fn => keys.delete(fn),
      keys,
      sound, speak,
      result: (chapterId, gameId) => state.results[`${chapterId}:${gameId}`],
      remember: (k, v) => { if (v !== undefined) { state.memo[k] = v; save(); } return state.memo[k]; },
      cancel: () => {
        alive = false;
        timers.forEach(clearTimeout); intervals.forEach(clearInterval);
        timers.clear(); intervals.clear(); keys.clear();
        try { speechSynthesis.cancel(); } catch { /* none */ }
      }
    };
    run = r;
    return r;
  }

  /* ── small UI helpers ──────────────────────────────────── */
  let toastTimer = null;
  function toast(t) {
    els.toast.textContent = t;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2000);
  }
  const esc = (s = '') => String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const exprSrc = (name, expr) => {
    const c = data.characters[name];
    const e = c && c.expressions.includes(expr) ? expr : c?.expressions[0];
    return `assets/expressions/${name.toLowerCase()}_${e}.webp`;
  };

  let typing = null, fullText = '';
  function typeText(text) {
    clearInterval(typing);
    fullText = text;
    els.dialogue.textContent = '';
    if (state.reducedMotion || !text) { els.dialogue.textContent = text; return; }
    let i = 0;
    typing = setInterval(() => {
      i += 2;
      els.dialogue.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typing); typing = null; }
    }, 18);
  }
  function finishTyping() {
    if (!typing) return false;
    clearInterval(typing); typing = null;
    els.dialogue.textContent = fullText;
    return true;
  }

  /* ── gating: interactive screens must be completed ─────── */
  const GATED = new Set(['game', 'study', 'model', 'sort', 'quiz', 'poll', 'trial', 'recap', 'write']);
  const isLocked = () => GATED.has(screen().type) && !state.done[key()] && !state.presenter;
  // A chapter is complete when every activity in it is done; core chapters cannot be skipped from the menu.
  const chapterComplete = i => data.chapters[i].screens.every((sc, s) => !GATED.has(sc.type) || state.done[key(i, s)]);
  const canJump = i => state.presenter || i <= state.maxChapter ||
    data.chapters.slice(0, i).every((c, j) => !c.core || chapterComplete(j));

  /* Short reading pause so Continue cannot be spammed; shorter on screens already seen. */
  let readyAt = 0, coolTimer = null;
  function startCooldown() {
    const ms = state.presenter ? 0 : state.done[key()] ? 300 : 900;
    readyAt = Date.now() + ms;
    clearTimeout(coolTimer);
    els.next.classList.toggle('cooling', ms > 0);
    coolTimer = setTimeout(() => els.next.classList.remove('cooling'), ms);
  }
  function markDone(extra) {
    state.done[key()] = true;
    save();
    updateNav();
    if (extra) toast(extra);
  }
  function updateNav() {
    const locked = isLocked();
    els.next.classList.toggle('locked', locked);
    els.lockHint.hidden = !locked;
    const last = state.chapter === data.chapters.length - 1 && state.screen === chapter().screens.length - 1;
    els.next.textContent = last ? 'Finish' : 'Continue ▸';
    els.back.disabled = state.chapter === 0 && state.screen === 0;
  }

  /* ── render ────────────────────────────────────────────── */
  function render() {
    const ch = chapter(), sc = screen();
    const r = newRun();
    els.scene.style.backgroundImage = `url('assets/backgrounds/${ch.background}.webp')`;
    els.chapter.textContent = ch.title;
    els.step.textContent = `${state.screen + 1} / ${ch.screens.length}`;
    els.progress.style.width = `${(flatIndex() + 1) / totalScreens * 100}%`;
    els.panel.innerHTML = '';
    els.panel.className = 'panel';
    els.panel.hidden = true;
    els.replay.hidden = sc.type !== 'game';

    const speaker = sc.speaker && data.characters[sc.speaker] ? sc.speaker : null;
    if (speaker) {
      const c = data.characters[speaker];
      els.speaker.textContent = speaker;
      els.speaker.style.background = c.color;
      els.avatar.src = exprSrc(speaker, sc.expr);
      els.avatar.alt = speaker;
      els.avatar.hidden = false;
    } else {
      els.speaker.textContent = 'The Archive';
      els.speaker.style.background = '#24364a';
      els.avatar.hidden = true;
    }
    // Big portrait only on plain dialogue screens.
    const showPortrait = speaker && sc.type === 'dialogue';
    els.portraitStage.classList.toggle('show', !!showPortrait);
    if (showPortrait) {
      els.portrait.src = `assets/portraits/${speaker.toLowerCase()}_main.webp`;
      els.portrait.alt = speaker;
      els.portraitStage.classList.toggle('right', data.characters[speaker].side === 'right');
    }
    els.dialogueBox.hidden = sc.type === 'title';
    els.scene.classList.toggle('no-dialogue', sc.type === 'title');
    typeText(sc.text || '');

    const renderers = { keyfact, video, poll, game, study, model, sort, quiz, trial, recap, write, tally, title, finish };
    if (renderers[sc.type]) {
      els.panel.hidden = false;
      els.panel.classList.add('type-' + sc.type);
      renderers[sc.type](sc, r);
    }
    renderSigils();
    updateNav();
    startCooldown();
  }

  /* ── screen renderers ──────────────────────────────────── */
  function title() {
    const p = els.panel;
    p.innerHTML = `
      <div class="title-card">
        <p class="kicker">IB Psychology · Cognitive approach</p>
        <h1 class="logo">Memory <em>Quest</em></h1>
        <p class="logo-sub">The Mind Archive</p>
        <p class="lede">The Archive is failing. Five guides, fourteen chambers, one question: <b>is something broken — or is it simply overloaded?</b> Along the way you will test your own working memory and discover how cognitive load works.</p>
        <div class="party"></div>
        <div class="meta-row"><span><b>~90 min</b> core · optional extras</span><span><b>Sound on</b> for some tasks</span><span><b>Evidence PDF</b> at the end</span></div>
        <div class="attendance"><b>Working alone?</b> That is how it is built: go at your own pace, and use headphones for the sound tasks. <b>Attendance:</b> the final screen saves your evidence. Upload it to <b>Elevfeedback</b>.</div>
      </div>`;
    const party = p.querySelector('.party');
    Object.entries(data.characters).forEach(([name, c]) => {
      const f = h('figure', 'party-member');
      f.innerHTML = `<img src="assets/portraits/${name.toLowerCase()}_main.webp" alt="${name}"><figcaption><b>${name}</b><span>${c.role}</span></figcaption>`;
      party.append(f);
    });
    const start = btn(state.done[key()] ? 'Continue the quest ▸' : 'Begin the quest ▸', () => { markDone(); sound('unlock'); next(); }, 'jrpg-btn primary big');
    p.querySelector('.title-card').append(start);
  }

  function keyfact(sc) {
    const p = els.panel;
    const card = h('div', 'keyfact');
    card.innerHTML = `
      ${sc.icon ? `<img class="keyfact-icon" src="assets/icons/${sc.icon}.webp" alt="">` : ''}
      <div><div class="keyfact-label">Key idea</div><h2>${esc(sc.title || '')}</h2><p class="keyfact-main">${esc(sc.text)}</p>${sc.detail ? `<p class="keyfact-detail">${esc(sc.detail)}</p>` : ''}</div>`;
    p.append(card);
    // The dialogue box would repeat the card, so it gives a spoken-style cue instead.
    typeText(sc.title ? `Remember this: ${sc.title.toLowerCase()}.` : '');
    if (sc.sigil) earn(sc.sigil);
  }

  function video(sc) {
    const v = data.meta.video;
    const p = els.panel;
    const url = `https://www.youtube.com/watch?v=${v.id}&t=${v.start}s`;
    p.innerHTML = `<h2 class="game-title">Opening hook</h2>
      <p class="game-instruction">Watch from the start to about <b>4:05</b> (the part about executive function). Your teacher may pause earlier.</p>
      <div class="video-frame"><iframe title="Hook video: Why are humans dumber now?" src="https://www.youtube-nocookie.com/embed/${v.id}?start=${v.start}&end=${v.end}&rel=0&modestbranding=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <p class="video-fallback">Video not playing? <a href="${url}" target="_blank" rel="noopener">Open it on YouTube ↗</a></p>`;
  }

  function poll(sc) {
    const p = els.panel;
    p.append(h('h2', 'game-title', sc.prompt));
    const row = h('div', 'poll-options');
    const draw = () => [...row.children].forEach(b => b.classList.toggle('chosen', b.textContent === state.polls[sc.id]));
    sc.options.forEach(o => row.append(btn(o, () => { state.polls[sc.id] = o; save(); draw(); markDone(); })));
    p.append(row);
    if (sc.id === 'endPoll' && state.polls.hookPoll) p.append(h('p', 'muted center', `At the start you chose: “${state.polls.hookPoll}”`));
    draw();
  }

  function game(sc, r) {
    const fn = window.GameRegistry[sc.gameId];
    const ch = chapter();
    const prev = state.results[`${ch.id}:${sc.gameId}`];
    if (prev && state.done[key()]) {
      const p = els.panel;
      p.append(h('h2', 'game-title', 'Already completed'));
      p.append(h('p', 'game-instruction', prev.summary || 'Result saved.'));
      p.append(btn('↻ Play again', () => { delete state.done[key()]; save(); render(); }, 'jrpg-btn secondary'));
      return;
    }
    fn(els.panel, result => {
      state.results[`${ch.id}:${sc.gameId}`] = result;
      markDone('Result saved');
      sound('correct');
    }, r);
  }

  function study(sc, r) {
    window.Studies.renderStudy(els.panel, () => markDone(), r, sc.studyId);
  }
  function model() { window.Studies.renderModel(els.panel, () => markDone('Model complete')); }

  function sort(sc) {
    const p = els.panel;
    p.append(h('h2', 'game-title', sc.prompt));
    const pool = h('div', 'sort-pool');
    const bins = h('div', 'sort-bins');
    bins.style.setProperty('--n', sc.categories.length);
    const record = state.checks[sc.id] || { firstTry: 0, total: sc.items.length, mistakes: 0 };
    let selected = null, placed = 0;
    const missed = new Set();
    const binEls = sc.categories.map((c, ci) => {
      const b = h('div', 'sort-bin');
      const head = btn(c, () => drop(ci), 'sort-bin-head');
      const list = h('div', 'sort-bin-list');
      b.append(head, list);
      b.addEventListener('click', e => { if (e.target === b || e.target === list) drop(ci); });
      bins.append(b);
      return list;
    });
    shuffle(sc.items.map((it, idx) => ({ ...it, idx }))).forEach(it => {
      const card = btn(it.text, () => {
        if (card.classList.contains('placed')) return;
        pool.querySelectorAll('.sort-card').forEach(c => c.classList.remove('sel'));
        card.classList.add('sel');
        selected = { it, card };
      }, 'sort-card');
      pool.append(card);
    });
    function drop(ci) {
      if (!selected) { toast('Tap a card first'); return; }
      const { it, card } = selected;
      if (it.cat === ci) {
        card.classList.remove('sel');
        card.classList.add('placed');
        binEls[ci].append(card);
        placed++;
        sound('tap');
        if (placed === sc.items.length) {
          record.firstTry = sc.items.length - missed.size;
          state.checks[sc.id] = record;
          save();
          p.append(h('p', 'verdict', `All sorted — ${record.firstTry}/${sc.items.length} right first time.`));
          markDone();
        }
      } else {
        missed.add(it.idx);
        record.mistakes++;
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 450);
        sound('wrong');
      }
      selected = null;
      pool.querySelectorAll('.sort-card').forEach(c => c.classList.remove('sel'));
    }
    p.append(pool, bins);
  }

  function quiz(sc) {
    const p = els.panel;
    let i = 0, score = 0;
    const body = h('div');
    p.append(h('h2', 'game-title', 'Check your understanding'));
    if (sc.intro) p.append(h('p', 'quiz-intro', sc.intro));
    p.append(body);
    const show = () => {
      body.innerHTML = '';
      if (i >= sc.questions.length) {
        state.checks[sc.id] = { score, total: sc.questions.length };
        save();
        body.append(h('p', 'verdict', `${score}/${sc.questions.length} correct.`));
        markDone();
        return;
      }
      const q = sc.questions[i];
      body.append(h('p', 'muted', `Question ${i + 1} of ${sc.questions.length}`));
      if (q.passage) { const d = h('div', 'passage'); d.innerHTML = q.passage; body.append(d); }
      body.append(h('h3', 'q-title', q.q));
      const row = h('div', 'game-button-row col');
      const correct = q.options[q.answer];
      (q.fixed ? q.options : shuffle(q.options)).forEach(o => row.append(btn(o, () => {
        const ok = o === correct;
        if (ok) score++;
        [...row.children].forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('right'); else if (b.textContent === o) b.classList.add('wrong'); });
        sound(ok ? 'correct' : 'wrong');
        const why = h('div', 'why ' + (ok ? 'good' : 'bad'));
        why.innerHTML = `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${esc(q.explain)}`;
        const nb = btn(i < sc.questions.length - 1 ? 'Next question ▸' : 'Finish', () => { i++; show(); }, 'jrpg-btn primary');
        body.append(why, nb);
        nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      })));
      body.append(row);
    };
    show();
  }

  /* Static Surge: a timed multiple-choice check. Every answer holds or loses one page.
     Calm mode drops the clock for anyone who needs it. */
  function trial(sc, r) {
    const p = els.panel;
    const n = sc.questions.length;
    p.append(h('h2', 'game-title', sc.title));
    const track = h('div', 'surge-track');
    track.setAttribute('aria-hidden', 'true');
    const body = h('div');
    p.append(track, body);
    const drawTrack = marks => {
      track.innerHTML = '';
      for (let k = 0; k < n; k++) track.append(h('span', marks[k] === true ? 'held' : marks[k] === false ? 'lost' : ''));
      const lost = marks.filter(m => m === false).length;
      track.style.setProperty('--static', `${lost / n * 100}%`);
    };

    function intro() {
      drawTrack([]);
      body.innerHTML = '';
      const best = state.checks[sc.id];
      const box = h('div', 'brief');
      box.innerHTML = `<p>${n} questions. Get <b>${sc.pass} or more</b> right to hold back the Static.</p>
        <p>${state.calm ? 'Calm mode is on: no clock.' : `You have <b>${sc.seconds} seconds</b> per question. The explanation after each answer is untimed, so read it.`}</p>
        ${best ? `<p class="muted">Your best so far: ${best.score}/${best.total}${best.calm ? ' (calm mode)' : ''}.</p>` : ''}`;
      const calm = h('label', 'switch calm-switch');
      calm.innerHTML = `<input type="checkbox" ${state.calm ? 'checked' : ''}> <span>Calm mode: no timer (for anyone who needs it)</span>`;
      calm.querySelector('input').onchange = e => { state.calm = e.target.checked; save(); intro(); };
      const go = btn('Face the surge ▸', play, 'jrpg-btn primary big');
      box.append(calm, go);
      body.append(box);
    }

    function ask(i, marks) {
      return new Promise(res => {
        const q = sc.questions[i];
        const correct = q.options[q.answer];
        body.innerHTML = '';
        body.append(h('p', 'muted center', `Question ${i + 1} of ${n}`), h('h3', 'q-title', q.q));
        let tick = null, left = sc.seconds, settled = false;
        const bar = h('div', 'timebar'), fill = h('div'), clock = h('div', 'surge-clock');
        bar.append(fill);
        if (!state.calm) {
          fill.style.animation = `drain ${sc.seconds}s linear forwards`;
          clock.textContent = `${left}s`;
          body.append(bar, clock);
          tick = r.every(1000, () => {
            left--;
            clock.textContent = `${Math.max(0, left)}s`;
            clock.classList.toggle('urgent', left <= 5);
            if (left <= 5 && left > 0) sound('tick');
            if (left <= 0) answer(null);
          });
        }
        const row = h('div', 'game-button-row col');
        const buttons = shuffle(q.options).map(o => btn(o, () => answer(o)));
        row.append(...buttons);
        body.append(row);
        function answer(o) {
          if (settled) return;
          settled = true;
          if (tick) r.stop(tick);
          fill.style.animationPlayState = 'paused';
          const ok = o === correct;
          marks[i] = ok;
          drawTrack(marks);
          buttons.forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('right'); else if (b.textContent === o) b.classList.add('wrong'); });
          sound(ok ? 'shatter' : 'wrong');
          const why = h('div', 'why ' + (ok ? 'good' : 'bad'));
          why.innerHTML = `<b>${ok ? 'Held!' : o === null ? 'Time is up.' : 'The Static advances.'}</b> ${esc(q.explain)}`;
          const nb = btn(i < n - 1 ? 'Next question ▸' : 'See the result', () => res(ok), 'jrpg-btn primary');
          body.append(why, nb);
          nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          nb.focus({ preventScroll: true });
        }
      });
    }

    async function play() {
      const marks = [];
      let score = 0;
      for (let i = 0; i < n; i++) if (await ask(i, marks)) score++;
      const prev = state.checks[sc.id];
      if (!prev || score >= prev.score) state.checks[sc.id] = { score, total: n, calm: state.calm };
      save();
      const held = score >= sc.pass;
      body.innerHTML = '';
      const big = h('div', 'big-result');
      big.append(h('span', 'big-number', `${score}/${n}`),
        h('span', '', held ? 'The line holds. The Static falls back.' : 'The Static broke through this time. Read the explanations, then try again.'));
      body.append(big);
      sound(held ? 'victory' : 'wrong');
      body.append(btn('↻ Try again', intro, 'jrpg-btn secondary'));
      markDone(held ? 'Surge held' : 'Result saved');
    }
    intro();
  }

  const RECAP_LEVELS = ['Not yet', 'Getting there', 'Confident'];
  function recap(sc) {
    const p = els.panel;
    const ratings = state.recap;
    p.append(h('h2', 'game-title', 'What can you do now?'),
      h('p', 'muted', 'Rate each statement. Open "Remind me" if you are unsure, then rate yourself honestly.'));
    const list = h('ol', 'recap-list');
    const check = () => { if (sc.items.every((_, k) => ratings[k])) markDone(); };
    sc.items.forEach(([can, remind], k) => {
      const li = h('li', 'recap-item');
      li.append(h('p', 'recap-can', `I can ${can.charAt(0).toLowerCase()}${can.slice(1)}`));
      const d = h('details', 'hint');
      d.innerHTML = `<summary>Remind me</summary><p>${esc(remind)}</p>`;
      const row = h('div', 'recap-levels');
      const draw = () => [...row.children].forEach(b => b.classList.toggle('chosen', b.textContent === ratings[k]));
      RECAP_LEVELS.forEach(l => row.append(btn(l, () => { ratings[k] = l; save(); draw(); check(); })));
      draw();
      li.append(row, d);
      list.append(li);
    });
    p.append(list);
    check();
  }

  function write(sc) {
    const p = els.panel;
    p.append(h('h2', 'game-title', sc.prompt));
    if (sc.hint) {
      const d = h('details', 'hint');
      d.innerHTML = `<summary>Need a hint?</summary><p>${esc(sc.hint)}</p>`;
      p.append(d);
    }
    const ta = h('textarea', 'answer-box' + (sc.large ? ' large' : ''));
    ta.value = state.writes[sc.id] || '';
    ta.placeholder = 'Type your answer here. It is saved automatically and goes into your PDF.';
    const count = h('div', 'word-count');
    const min = sc.minWords || 10;
    const upd = () => {
      const words = ta.value.trim() ? ta.value.trim().split(/\s+/) : [];
      // Distinct words stop "a a a a a" from counting.
      const enough = words.length >= min && new Set(words.map(w => w.toLowerCase())).size >= min * .6;
      count.textContent = enough ? `${words.length} words · saved` : `${words.length} words · write at least ${min} real words to continue`;
      count.classList.toggle('short', !enough);
      if (!!state.done[key()] !== enough) { state.done[key()] = enough; save(); updateNav(); }
    };
    ta.addEventListener('input', () => { state.writes[sc.id] = ta.value; save(); upd(); });
    p.append(ta, count);
    upd();
  }

  /* Class tallies: the teacher types in class averages on the projector device. */
  const TALLIES = {
    echoTally: {
      title: 'Class results: quiet vs chanting',
      help: 'Working alone? You can skip the boxes: the next screen compares your own result with the study. In class, the teacher asks for a show of hands in 10% bands and enters a rough class average.',
      max: 100, unit: '%',
      fields: [['quiet', 'Class · quiet'], ['chant', 'Class · chanting']],
      mine: () => { const r = state.results['echo:letterRecall']; return r && `You scored ${r.normal}% quiet and ${r.suppression}% while chanting.`; },
      extra: [{ label: 'Study · control', value: 76, tone: 'study' }, { label: 'Study · suppression', value: 45, tone: 'study alt' }],
      verdict: (a, b) => b < a ? 'The class dropped when chanting — the same direction as Landry & Bartling.' : 'No drop this time. Did everyone really chant out loud?'
    },
    sanaTally: {
      title: 'Class results: Focus vs Multitask',
      help: 'Working alone? You can skip the boxes: the next screen shows what the real study found. In class, the teacher asks each group for their scores (hands up for 5, 4, 3…) and enters the group averages.',
      max: 5, unit: '/5',
      fields: [['focus', 'Group F · Focus'], ['multi', 'Group M · Multitask']],
      mine: () => { const r = state.results['lecture:microLecture']; return r && `You were in ${r.condition === 'focus' ? 'Group F (Focus)' : 'Group M (Multitask)'} and scored ${r.score}/5.`; },
      extra: [],
      verdict: (a, b) => b < a ? 'The multitask group learned less — the same direction as Sana et al.' : 'No difference this time. Think about sample size, and whether everyone read carefully.'
    }
  };

  function tally(sc) {
    const cfg = TALLIES[sc.id];
    const p = els.panel;
    p.append(h('h2', 'game-title', cfg.title));
    const mine = cfg.mine();
    if (mine) p.append(h('p', 'game-instruction', mine));
    p.append(h('p', 'muted', cfg.help));
    const t = state.tally[sc.id] || (state.tally[sc.id] = {});
    const form = h('div', 'tally-form');
    cfg.fields.forEach(([k, label]) => {
      const l = h('label', 'tally-field');
      l.append(h('span', '', `${label} (average${cfg.unit === '%' ? ' %' : ', out of ' + cfg.max})`));
      const inp = h('input');
      inp.type = 'number'; inp.min = 0; inp.max = cfg.max; inp.step = cfg.max > 10 ? 1 : .1;
      inp.value = t[k] ?? '';
      inp.addEventListener('input', () => { t[k] = inp.value === '' ? undefined : Math.min(cfg.max, Math.max(0, +inp.value)); save(); draw(); });
      l.append(inp);
      form.append(l);
    });
    const out = h('div');
    p.append(form, out);
    const fmt = v => (cfg.max > 10 ? Math.round(v) : v.toFixed(1)) + cfg.unit;
    function draw() {
      out.innerHTML = '';
      const [a, b] = cfg.fields.map(([k]) => t[k]);
      if (a === undefined || b === undefined) return;
      out.append(bars([
        { label: cfg.fields[0][1], value: a, max: cfg.max, text: fmt(a), tone: 'you' },
        { label: cfg.fields[1][1], value: b, max: cfg.max, text: fmt(b), tone: 'you alt' },
        ...cfg.extra.map(e => ({ ...e, max: cfg.max, text: fmt(e.value) }))
      ]));
      out.append(h('p', 'verdict', cfg.verdict(a, b)));
    }
    draw();
  }

  function finish() {
    const p = els.panel;
    p.innerHTML = `<h2 class="game-title">Your evidence of work</h2>
      <p class="game-instruction">Enter your details, then save your evidence. Everything you did today is included automatically.</p>
      <div class="finish-grid">
        <label class="tally-field"><span>Name</span><input id="subName" autocomplete="name"></label>
        <label class="tally-field"><span>Class / group</span><input id="subGroup"></label>
      </div>
      <div class="summary"></div>
      <button class="jrpg-btn primary big" id="pdfBtn">Download evidence PDF</button>
      <div id="pdfStatus" class="pdf-status" role="status"></div>
      <details class="hint save-help" id="saveHelp">
        <summary>Download did not work, or the PDF will not open?</summary>
        <p>Try these in order. Any one of them is fine for Elevfeedback.</p>
        <div class="save-options">
          <button type="button" class="jrpg-btn secondary" id="openBtn">1 · Open PDF in a new tab</button>
          <button type="button" class="jrpg-btn secondary" id="printBtn">2 · Print → Save as PDF</button>
          <button type="button" class="jrpg-btn secondary" id="copyBtn">3 · Copy as text</button>
        </div>
        <p class="muted">1: on iPad, tap Share → Save to Files. 2: uses your browser's own PDF maker; choose "Save as PDF" as the printer. 3: paste the text straight into Elevfeedback.</p>
        <textarea id="copyBox" class="answer-box" readonly hidden></textarea>
      </details>
      <div class="attendance"><b>Required:</b> upload your evidence to <b>Elevfeedback</b> before you leave.</div>`;
    const name = $('subName'), group = $('subGroup'), st = $('pdfStatus');
    name.value = state.name; group.value = state.group;
    name.oninput = () => { state.name = name.value; save(); };
    group.oninput = () => { state.group = group.value; save(); };
    const sumEl = p.querySelector('.summary');
    const secs = collectSections();
    const done = secs.reduce((n, s) => n + s.items.filter(i => !i.missing).length, 0);
    const all = secs.reduce((n, s) => n + s.items.length, 0);
    sumEl.innerHTML = `<b>${done}</b> of <b>${all}</b> activities recorded.` + (done < all ? ' <span class="muted">Missing ones show as "not completed". Optional chapters are fine to skip; use the chapter menu (☰) to go back to anything else.</span>' : '');
    ensurePdfLib(); // start loading now so the click is quick
    const status = (t, ok) => { st.textContent = t; st.className = 'pdf-status ' + (ok ? 'ok' : 'error'); };
    const who = () => {
      if (name.value.trim() && group.value.trim()) return [name.value.trim(), group.value.trim()];
      status('Enter your name and class first.', false);
      name.focus();
      return null;
    };
    const fail = e => {
      status(`The PDF could not be made here (${e.message}). Use one of the options below instead.`, false);
      $('saveHelp').open = true;
    };
    const openInTab = async w => {
      const tab = window.open('', '_blank'); // must open during the click or it is blocked
      try {
        const doc = await makePdf(...w);
        const url = doc.output('bloburl');
        if (tab) { tab.location.href = url; status('The PDF opened in a new tab. Save or share it from there, then upload it to Elevfeedback.', true); }
        else { doc.save(pdfName(w[0])); status('Pop-ups are blocked, so the PDF was downloaded instead.', true); }
      } catch (e) { if (tab) tab.close(); fail(e); }
    };
    $('pdfBtn').onclick = async () => {
      const w = who(); if (!w) return;
      // iPads and some embedded browsers ignore downloads, so they get the PDF in a new tab.
      if (IS_IOS) return openInTab(w);
      try {
        const file = await savePdf(...w);
        status(`Downloaded ${file}. Upload it to Elevfeedback. Nothing downloaded? Open the options below.`, true);
        $('saveHelp').open = true;
      } catch (e) { fail(e); }
    };
    $('openBtn').onclick = () => { const w = who(); if (w) openInTab(w); };
    $('printBtn').onclick = () => { const w = who(); if (w) printEvidence(...w); };
    $('copyBtn').onclick = async () => {
      const w = who(); if (!w) return;
      const box = $('copyBox');
      box.value = evidenceText(...w);
      box.hidden = false;
      try { await navigator.clipboard.writeText(box.value); status('Copied. Paste it into Elevfeedback.', true); }
      catch { box.focus(); box.select(); status('Select all the text in the box, copy it, and paste it into Elevfeedback.', true); }
    };
  }

  /* ── evidence: shared by the PDF, print sheet and text copy ── */
  function collectSections() {
    const res = (c, g) => state.results[`${c}:${g}`];
    const item = (label, value) => ({ label, value: value ?? 'not completed', missing: value == null || value === '' });
    const chk = id => {
      const c = state.checks[id];
      if (!c) return null;
      if (c.score === undefined) return `${c.firstTry}/${c.total} right first time`;
      return `${c.score}/${c.total} correct${c.calm ? ' (calm mode, untimed)' : ''}`;
    };
    const recapScreen = data.chapters.flatMap(c => c.screens).find(s => s.type === 'recap');
    let need = 0, got = 0;
    const unfinished = [];
    data.chapters.forEach((c, i) => {
      if (!c.core) return;
      c.screens.forEach((sc, k) => { if (GATED.has(sc.type)) { need++; if (state.done[key(i, k)]) got++; } });
      if (!chapterComplete(i)) unfinished.push(c.title.split(/ [—-] /).pop());
    });
    const progress = [
      item('Core activities completed', `${got} of ${need}`),
      item('Core chapters not finished', unfinished.length ? unfinished.join('; ') : 'none: all core chapters complete')];
    if (state.presenterUsed) progress.push(item('Note for the teacher', 'Presenter mode (which lets you skip activities) was switched on at some point on this device.'));
    return [
      { heading: 'Progress', items: progress },
      { heading: 'Hook: the claim', items: [
        item('Start of lesson: is our ability to focus getting worse?', state.polls.hookPoll),
        item('End of lesson: is our ability to focus getting worse?', state.polls.endPoll)] },
      { heading: 'Working memory tasks', items: [
        item('Digit span', res('workshop', 'digitSpan')?.summary),
        item('Articulatory suppression (Landry & Bartling replication)', res('echo', 'letterRecall')?.summary),
        item('Spatial span', res('shards', 'spatialSpan')?.summary),
        item('Dual task', res('dual', 'dualTask')?.summary),
        item('Stroop', res('focus', 'stroop')?.summary),
        item('Task switching', res('switchyard', 'taskSwitch')?.summary),
        item('Story Loom', res('loom', 'storyLoom')?.summary),
        item('Evaluating the WMM (sort)', chk('wmmEval'))] },
      { heading: 'Cognitive load tasks', items: [
        item('Intrinsic load', res('loads', 'intrinsicTrial')?.summary),
        item('Extraneous load', res('loads', 'extraneousTrial')?.summary),
        item('Germane load', res('loads', 'germaneTrial')?.summary),
        item('Distracted lecture (Sana replication)', res('lecture', 'microLecture')?.summary),
        item('Google effect check (Sparrow et al.)', chk('sparrowCheck')),
        item('Measurement types (sort)', chk('measureSort')),
        item('Final challenge', res('boss', 'bossBattle')?.summary)] },
      { heading: 'Timed checks (best score)', items: [
        item('Static Surge I: the working memory model', chk('surge1')),
        item('Static Surge II: research methods & evaluation', chk('surge2')),
        item('Static Surge III: cognitive load', chk('surge3')),
        item('Examiner\'s chair: judging sample answers', chk('examinerDesk'))] },
      { heading: 'Self-check: what I can do now', items: (recapScreen?.items || []).map(([can], k) => item(can, state.recap[k])) },
      { heading: 'Written answers', items: [
        item('Which part of the WMM is hardest to measure, and why?', state.writes.wmmMeasure?.trim()),
        item('How was cognitive load operationalised by Mani et al., and one limitation?', state.writes.maniMeasure?.trim()),
        item('Application: two changes Freja could make, using cognitive load theory', state.writes.examAnswer?.trim())] }
    ];
  }

  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const pdfName = name => {
    const ascii = name.replace(/[æÆ]/g, 'ae').replace(/[øØ]/g, 'oe').replace(/[åÅ]/g, 'aa')
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    return `${ascii.replace(/[^a-zA-Z0-9._-]+/g, '_') || 'student'}_Memory_Quest_Evidence.pdf`;
  };
  const stamp = () => new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  // Two CDNs, tried in turn: some school networks block one of them.
  const PDF_SOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
  ];
  let pdfLoading = null;
  function ensurePdfLib() {
    const ready = () => !!window.jspdf?.jsPDF;
    if (ready()) return Promise.resolve(true);
    if (pdfLoading) return pdfLoading;
    pdfLoading = PDF_SOURCES.reduce((chain, src) => chain.then(ok => ok || new Promise(res => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => res(ready());
      s.onerror = () => res(false);
      document.head.append(s);
    })), Promise.resolve(false)).then(ok => { if (!ok) pdfLoading = null; return ok; });
    return pdfLoading;
  }

  function pdfSafe(v) {
    return String(v ?? '').normalize('NFKC')
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
      .replace(/…/g, '...').replace(/·/g, '-').replace(/≤/g, '<=').replace(/[^\x00-\xFF]/g, '');
  }

  async function makePdf(name, group) {
    if (!(await ensurePdfLib())) throw new Error('the PDF tool could not load; the network may be blocking it');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 16, CW = W - M * 2;
    let y = 18, page = 1;
    doc.setProperties({ title: `${name} - Memory Quest`, subject: 'IB Psychology - Working memory and cognitive load', author: name });
    const footer = () => {
      doc.setDrawColor(220, 214, 202); doc.line(M, H - 13, W - M, H - 13);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(105, 96, 84);
      doc.text('Memory Quest - IB Psychology', M, H - 9); doc.text(`Page ${page}`, W - M, H - 9, { align: 'right' });
    };
    const space = mm => { if (y + mm > H - 20) { footer(); doc.addPage(); page++; y = 18; } };
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(28, 24, 19);
    doc.text('WORKING MEMORY & COGNITIVE LOAD', M, y); y += 7;
    doc.setFontSize(13); doc.text('Memory Quest - Evidence of Work', M, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(95, 87, 76);
    doc.text(pdfSafe(`${name} | ${group} | ${stamp()}`), M, y); y += 7;
    doc.setFillColor(250, 243, 224); doc.setDrawColor(196, 138, 53);
    doc.roundedRect(M, y, CW, 11, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(55, 43, 20);
    doc.text('REQUIRED: Upload this PDF to Elevfeedback as evidence of your work for this lesson.', M + 4, y + 7);
    y += 18;
    collectSections().forEach(sec => {
      space(16);
      doc.setDrawColor(196, 138, 53); doc.setLineWidth(.8); doc.line(M, y - 2.5, M + 4, y - 2.5);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11.5); doc.setTextColor(34, 29, 23);
      doc.text(pdfSafe(sec.heading), M + 7, y); y += 7;
      sec.items.forEach(it => {
        const lab = doc.splitTextToSize(pdfSafe(it.label), CW);
        doc.setFontSize(9);
        const val = doc.splitTextToSize(pdfSafe(it.value), CW - 4);
        space(lab.length * 3.6 + val.length * 4 + 5);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(73, 66, 57);
        doc.text(lab, M, y); y += lab.length * 3.6 + 1;
        doc.setFont('helvetica', it.missing ? 'italic' : 'normal'); doc.setFontSize(9);
        doc.setTextColor(...(it.missing ? [150, 140, 130] : [25, 22, 19]));
        doc.text(val, M + 3, y); y += val.length * 4 + 3.2;
      });
      y += 2;
    });
    footer();
    return doc;
  }
  async function savePdf(name, group) {
    const doc = await makePdf(name, group);
    const file = pdfName(name);
    doc.save(file);
    return file;
  }

  /* Browser-native fallback: a plain sheet that the print dialog turns into a PDF. */
  function printEvidence(name, group) {
    let sheet = $('printSheet');
    if (!sheet) { sheet = h('div'); sheet.id = 'printSheet'; document.body.append(sheet); }
    sheet.innerHTML = `<h1>Memory Quest: Evidence of Work</h1>
      <p class="ps-meta">${esc(name)} | ${esc(group)} | ${esc(stamp())}</p>
      <p class="ps-req">Upload this to Elevfeedback as evidence of your work for this lesson.</p>
      ${collectSections().map(sec => `<h2>${esc(sec.heading)}</h2><dl>${sec.items.map(it =>
        `<dt>${esc(it.label)}</dt><dd class="${it.missing ? 'missing' : ''}">${esc(it.value)}</dd>`).join('')}</dl>`).join('')}`;
    window.print();
  }

  function evidenceText(name, group) {
    return ['MEMORY QUEST - EVIDENCE OF WORK', `${name} | ${group} | ${stamp()}`, '',
      ...collectSections().flatMap(sec => [`== ${sec.heading} ==`, ...sec.items.map(it => `- ${it.label}: ${it.value}`), ''])].join('\n');
  }

  /* ── sigils ────────────────────────────────────────────── */
  function earn(id) {
    if (!id || state.earned.includes(id)) return;
    state.earned.push(id);
    save();
    sound('sigil');
    const s = data.sigils.find(x => x.id === id);
    toast(`Sigil gained: ${s ? s.label : id}`);
    renderSigils();
  }
  function renderSigils() {
    els.sigils.innerHTML = '';
    data.sigils.forEach(s => {
      const img = h('img', 'sigil-mini' + (state.earned.includes(s.id) ? ' earned' : ''));
      img.src = `assets/icons/${s.id}.webp`;
      img.alt = s.label;
      img.title = s.label + (state.earned.includes(s.id) ? '' : ' (not yet earned)');
      els.sigils.append(img);
    });
  }

  /* ── navigation ────────────────────────────────────────── */
  function next() {
    if (finishTyping()) return;
    if (Date.now() < readyAt) return;
    if (isLocked()) {
      els.next.classList.add('shake');
      setTimeout(() => els.next.classList.remove('shake'), 450);
      toast('Finish the activity first');
      return;
    }
    const ch = chapter();
    if (!GATED.has(screen().type)) state.done[key()] = true;
    if (state.screen < ch.screens.length - 1) {
      state.screen++;
      sound('page');
    } else {
      earn(ch.sigil);
      if (state.chapter < data.chapters.length - 1) { state.chapter++; state.screen = 0; state.maxChapter = Math.max(state.maxChapter, state.chapter); sound('page'); }
      else { sound('victory'); toast('Quest complete!'); return; }
    }
    save();
    render();
  }
  function back() {
    if (state.chapter > 0 || state.screen > 0) sound('back');
    if (state.screen > 0) state.screen--;
    else if (state.chapter > 0) { state.chapter--; state.screen = chapter().screens.length - 1; }
    else return;
    save();
    render();
  }
  function jump(c, s = 0) {
    state.chapter = c; state.screen = s;
    state.maxChapter = Math.max(state.maxChapter, c);
    save();
    if (els.menu.open) els.menu.close();
    render();
  }

  /* ── chapter menu ──────────────────────────────────────── */
  function renderMenu() {
    els.chapterList.innerHTML = '';
    data.chapters.forEach((c, i) => {
      const doneCount = c.screens.filter((_, s) => state.done[key(i, s)]).length;
      const open = canJump(i);
      const b = btn('', () => open ? jump(i) : toast('Finish the core chapters before this one first'), 'chapter-jump' + (i === state.chapter ? ' current' : '') + (open ? '' : ' locked'));
      b.innerHTML = `<span class="cj-title">${esc(c.title)}</span>
        <span class="cj-meta">${esc(c.short)} · ${c.minutes} min · ${c.core ? '<b class="core">core</b>' : '<b class="opt">optional</b>'}</span>
        <span class="cj-done">${open ? '' : '🔒 '}${doneCount}/${c.screens.length}</span>`;
      els.chapterList.append(b);
    });
  }

  /* ── teacher panel ─────────────────────────────────────── */
  function renderTeacher(tab = 'notes') {
    const ch = chapter(), t = ch.teacher || {};
    const tabs = `<div class="tabs">${['notes', 'plan', 'controls'].map(x => `<button type="button" class="tab ${x === tab ? 'on' : ''}" data-tab="${x}">${{ notes: 'This chapter', plan: 'Lesson plan', controls: 'Controls' }[x]}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'notes') {
      body = `<h3>${esc(ch.title)} <small>${ch.minutes} min</small></h3>
        <dl class="notes">
          <dt>Goal</dt><dd>${esc(t.goal)}</dd>
          <dt>Say</dt><dd>“${esc(t.say)}”</dd>
          <dt>Ask</dt><dd>${esc(t.ask)}</dd>
          <dt>Expect</dt><dd>${esc(t.expect)}</dd>
          <dt>Research fidelity</dt><dd>${esc(t.fidelity)}</dd>
        </dl>`;
    } else if (tab === 'plan') {
      const core = data.chapters.filter(c => c.core).reduce((n, c) => n + c.minutes, 0);
      const all = data.chapters.reduce((n, c) => n + c.minutes, 0);
      body = `<p>Full quest ≈ <b>${all} min</b>. Core chapters only ≈ <b>${core} min</b>. Skip optional chapters from the ☰ menu.</p>
        <ol class="plan">${data.chapters.map(c => `<li class="${c.core ? '' : 'opt'}"><b>${esc(c.title)}</b> — ${esc(c.short)} <span>${c.minutes} min${c.core ? '' : ' · optional'}</span></li>`).join('')}</ol>
        <p class="muted">These are informal classroom demonstrations. They illustrate research logic and do not diagnose anyone's ability.</p>`;
    } else {
      body = `<label class="switch"><input type="checkbox" id="presenterToggle" ${state.presenter ? 'checked' : ''}> <span><b>Presenter mode</b> — Continue is never locked, so you can click through activities on the projector without completing them.</span></label>
        <label class="switch"><input type="checkbox" id="motionToggle" ${state.reducedMotion ? 'checked' : ''}> <span><b>Reduce motion</b> — no typing effect or animations.</span></label>
        <label class="switch"><input type="checkbox" id="calmToggle" ${state.calm ? 'checked' : ''}> <span><b>Calm mode</b> — the three Static Surge checks have no timer. Students can also switch this on themselves before each surge; the PDF notes it.</span></label>
        <p><b>Keyboard / clicker:</b> → or Page Down = continue · ← or Page Up = back.</p>
        <p><button type="button" class="jrpg-btn secondary" id="resetBtn">Reset all progress on this device</button></p>`;
    }
    els.teacherBody.innerHTML = tabs + body;
    els.teacherBody.querySelectorAll('.tab').forEach(b => b.onclick = () => renderTeacher(b.dataset.tab));
    const pt = $('presenterToggle');
    if (pt) pt.onchange = () => { state.presenter = pt.checked; if (pt.checked) state.presenterUsed = true; save(); updateNav(); };
    const mt = $('motionToggle');
    if (mt) mt.onchange = () => { state.reducedMotion = mt.checked; applyMotion(); save(); };
    const ct = $('calmToggle');
    if (ct) ct.onchange = () => { state.calm = ct.checked; save(); if (screen().type === 'trial') render(); };
    const rb = $('resetBtn');
    if (rb) rb.onclick = () => {
      if (!confirm('Reset all answers and results on this device?')) return;
      const keep = { sound: state.sound, volume: state.volume, presenter: state.presenter };
      state = { ...blank(), ...keep };
      save(); els.teacher.close(); render();
    };
  }
  const applyMotion = () => document.documentElement.dataset.reducedMotion = state.reducedMotion;

  /* ── wiring ────────────────────────────────────────────── */
  els.next.onclick = next;
  els.back.onclick = back;
  els.replay.onclick = () => { delete state.done[key()]; save(); render(); };
  els.dialogue.onclick = finishTyping;
  $('menuBtn').onclick = () => { renderMenu(); els.menu.showModal(); sound('open'); };
  $('teacherBtn').onclick = () => { renderTeacher(); els.teacher.showModal(); sound('open'); };
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('close', () => sound('close')));
  // A soft click for plain choice buttons; tasks add their own right/wrong sounds on top.
  document.addEventListener('click', e => {
    if (e.target.closest('.answer-btn, .sort-card, .sort-bin-head, .study-dot, .wmm-node, .tab, .chapter-jump, .poll-options button')) sound('tap');
  });
  const soundBtn = $('soundBtn');
  const drawSound = () => {
    soundBtn.textContent = { high: '🔊', low: '🔉', off: '🔇' }[state.volume];
    soundBtn.setAttribute('aria-label', `Sound: ${state.volume}`);
    soundBtn.title = `Sound: ${state.volume} (click to change)`;
  };
  soundBtn.onclick = () => {
    setVolume({ high: 'low', low: 'off', off: 'high' }[state.volume]);
    drawSound();
    sound('tap');
  };
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]')) return;
    const tag = document.activeElement?.tagName;
    const typingField = tag === 'INPUT' || tag === 'TEXTAREA';
    if (!typingField && (e.key === 'ArrowRight' || e.key === 'PageDown')) { e.preventDefault(); next(); return; }
    if (!typingField && (e.key === 'ArrowLeft' || e.key === 'PageUp')) { e.preventDefault(); back(); return; }
    if (!typingField && run) run.keys.forEach(fn => fn(e));
  });

  if (state.chapter >= data.chapters.length || state.screen >= chapter().screens.length) { state.chapter = 0; state.screen = 0; }
  drawSound();
  applyMotion();
  render();
  // Console hook for teachers and testing: MemoryQuest.jump(chapter, screen)
  window.MemoryQuest = { jump };
})();
