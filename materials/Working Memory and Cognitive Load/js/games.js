/* Memory Quest — interactive tasks.
   Each game is fn(mount, done, ctx). ctx supplies cancellable timers (sleep/every),
   key handling, sound, speech and stored results; app.js cancels them when the screen changes. */
(() => {
  const LETTERS = ['F', 'K', 'L', 'M', 'R', 'X', 'Q'];

  /* ── helpers ─────────────────────────────────────────────── */
  const h = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const btn = (text, fn, cls = 'answer-btn') => {
    const b = h('button', cls, text);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  };
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const rand = n => Math.floor(Math.random() * n);
  const median = xs => {
    if (!xs.length) return 0;
    const a = [...xs].sort((x, y) => x - y), m = Math.floor(a.length / 2);
    return Math.round(a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2);
  };
  const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
  const pct = (n, d) => d ? Math.round(n / d * 100) : 0;

  function header(mount, title, instruction) {
    mount.innerHTML = '';
    mount.append(h('h2', 'game-title', title));
    if (instruction) mount.append(h('p', 'game-instruction', instruction));
    const status = h('div', 'game-status');
    const body = h('div', 'game-body');
    mount.append(status, body);
    return { status, body };
  }

  /* A start screen so nobody is caught off guard. */
  function gate(body, lines, label = 'Start') {
    return new Promise(resolve => {
      body.innerHTML = '';
      const box = h('div', 'brief');
      lines.forEach(l => { const p = h('p'); p.innerHTML = l; box.append(p); });
      const b = btn(label, () => resolve(), 'jrpg-btn primary big');
      box.append(b);
      body.append(box);
      b.focus();
    });
  }

  /* Horizontal comparison bars. rows: {label, value, max, text, tone} */
  function bars(rows, caption) {
    const wrap = h('div', 'bars');
    if (caption) wrap.append(h('div', 'bars-caption', caption));
    rows.forEach(r => {
      const row = h('div', 'bar-row' + (r.tone ? ' ' + r.tone : ''));
      row.append(h('div', 'bar-label', r.label));
      const track = h('div', 'bar-track');
      const fill = h('div', 'bar-fill');
      fill.style.width = Math.max(2, Math.min(100, r.value / r.max * 100)) + '%';
      track.append(fill);
      row.append(track, h('div', 'bar-value', r.text ?? String(r.value)));
      wrap.append(row);
    });
    return wrap;
  }

  function verdict(text) { return h('p', 'verdict', text); }

  /* After a multiple-choice answer: mark right/wrong and hide the other options,
     so the explanation replaces space instead of adding to it (no scrollbar). */
  function reveal(buttons, correct, picked) {
    buttons.forEach(b => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add('right');
      else if (b.textContent === picked) b.classList.add('wrong');
      else b.hidden = true;
    });
  }
  /* Explanation box with its Next button inside it. */
  function explain(ok, html, label, onNext) {
    const box = h('div', 'why ' + (ok ? 'good' : 'bad'));
    const text = h('div', 'why-text');
    text.innerHTML = html;
    const next = btn(label, onNext, 'jrpg-btn primary');
    box.append(text, next);
    return { box, next };
  }

  /* 1–9 mental effort rating (self-report measure). */
  function effort(body, question = 'How hard did your brain work?') {
    return new Promise(resolve => {
      const wrap = h('div', 'effort');
      wrap.append(h('p', 'effort-q', question));
      const scale = h('div', 'effort-scale');
      for (let i = 1; i <= 9; i++) scale.append(btn(String(i), () => { wrap.remove(); resolve(i); }));
      const ends = h('div', 'effort-ends');
      ends.append(h('span', '', '1 = very little'), h('span', '', '9 = extremely hard'));
      wrap.append(scale, ends);
      body.append(wrap);
    });
  }

  function countdown(ctx, el, from = 3) {
    return (async () => {
      for (let i = from; i > 0; i--) { el.textContent = String(i); ctx.sound('count'); await ctx.sleep(600); }
      el.textContent = '';
    })();
  }

  /* Grid of cells for spatial tasks. */
  function makeGrid(size) {
    const grid = h('div', 'spatial-grid');
    grid.style.setProperty('--n', size);
    const cells = [];
    for (let i = 0; i < size * size; i++) {
      const c = h('button', 'spatial-cell');
      c.type = 'button';
      c.disabled = true;
      c.setAttribute('aria-label', `Square ${i + 1}`);
      grid.append(c);
      cells.push(c);
    }
    return { grid, cells };
  }

  function randomPath(len, cellsCount) {
    const seq = [];
    while (seq.length < len) {
      const n = rand(cellsCount);
      if (!seq.includes(n)) seq.push(n);
    }
    return seq;
  }

  async function showPath(ctx, cells, seq, on = 650, off = 200) {
    for (const n of seq) {
      cells[n].classList.add('flash');
      ctx.sound('tile');
      await ctx.sleep(on);
      cells[n].classList.remove('flash');
      await ctx.sleep(off);
    }
  }

  function collectPath(cells, count) {
    return new Promise(resolve => {
      const entry = [];
      const handlers = cells.map((c, i) => {
        const fn = () => {
          if (entry.length >= count) return;
          entry.push(i);
          c.classList.add('picked');
          c.dataset.order = entry.length;
          if (entry.length === count) {
            cells.forEach((x, k) => { x.disabled = true; x.removeEventListener('click', handlers[k]); });
            setTimeout(() => resolve(entry), 250);
          }
        };
        c.disabled = false;
        c.addEventListener('click', fn);
        return fn;
      });
    });
  }

  function clearGrid(cells) {
    cells.forEach(c => { c.classList.remove('flash', 'picked', 'correct', 'wrong'); delete c.dataset.order; c.disabled = true; });
  }

  /* ── 1. Digit span ───────────────────────────────────────── */
  async function digitSpan(mount, done, ctx) {
    const { status, body } = header(mount, 'Memory Span Gate', 'Digits appear one at a time. Enter them in the same order.');
    await gate(body, ['The list starts at <b>3 digits</b> and grows by one each time you get it right.', 'You get <b>two tries</b> at each length. Two misses and the gate closes.']);
    body.innerHTML = '';
    const stim = h('div', 'big-stimulus');
    const slots = h('div', 'slots');
    const pad = h('div', 'number-pad');
    body.append(stim, slots, pad);
    let entry = '', target = '', accept = false, resolveEntry = null;

    const drawSlots = () => {
      slots.innerHTML = '';
      for (let i = 0; i < target.length; i++) slots.append(h('span', 'slot' + (entry[i] ? ' filled' : ''), entry[i] || ''));
    };
    const press = d => { if (!accept || entry.length >= target.length) return; entry += d; drawSlots(); if (entry.length === target.length) submit(); };
    const undo = () => { if (!accept) return; entry = entry.slice(0, -1); drawSlots(); };
    const submit = () => { if (!accept) return; accept = false; resolveEntry(entry); };
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(d => pad.append(btn(String(d), () => press(String(d)))));
    pad.append(btn('⌫', undo, 'answer-btn ghost'));
    ctx.onKey(e => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') undo();
    });
    pad.hidden = true;

    let len = 3, best = 0, misses = 0;
    const log = [];
    while (len <= 10) {
      status.textContent = `Length ${len} · try ${misses + 1} of 2`;
      target = '';
      while (target.length < len) {
        const d = String(rand(10));
        if (target.at(-1) !== d) target += d;
      }
      entry = ''; slots.innerHTML = ''; pad.hidden = true;
      await ctx.sleep(600);
      for (const d of target) { stim.textContent = d; ctx.sound('tile'); await ctx.sleep(750); stim.textContent = ''; await ctx.sleep(200); }
      stim.textContent = '?';
      drawSlots(); pad.hidden = false; accept = true;
      const answer = await new Promise(r => { resolveEntry = r; });
      pad.hidden = true;
      const ok = answer === target;
      log.push({ len, ok });
      stim.textContent = ok ? '✓' : target;
      stim.className = 'big-stimulus ' + (ok ? 'good' : 'bad');
      ctx.sound(ok ? 'correct' : 'wrong');
      await ctx.sleep(ok ? 700 : 1400);
      stim.className = 'big-stimulus';
      if (ok) { best = len; len++; misses = 0; }
      else if (++misses >= 2) break;
    }
    body.innerHTML = '';
    status.textContent = 'Gate closed.';
    const big = h('div', 'big-result');
    big.append(h('span', 'big-number', String(best)), h('span', '', best ? 'digits — your longest correct list' : 'digits — try again with Replay'));
    body.append(big, verdict('Most people manage somewhere between 5 and 8. The exact number matters less than the pattern: everyone hits a limit.'));
    done({ span: best, summary: `Longest digit span: ${best}` });
  }

  /* ── 2. Articulatory suppression (Landry & Bartling) ─────── */
  async function letterRecall(mount, done, ctx) {
    const { status, body } = header(mount, 'The Echo Chamber', 'Remember 7 letters in order. They stay on screen for 5 seconds, then you wait 5 seconds, then you answer.');
    const scores = { normal: [], suppression: [] };

    async function trial(cond, n) {
      body.innerHTML = '';
      status.textContent = `${cond === 'normal' ? 'Round 1 · quiet' : 'Round 2 · say "one, two" out loud'} — list ${n} of 3`;
      const stim = h('div', 'letter-stim');
      const chant = h('div', 'chant');
      const timer = h('div', 'timebar'); const fill = h('div'); timer.append(fill);
      body.append(chant, stim, timer);
      let tick = null;
      if (cond === 'suppression') {
        let k = 0;
        tick = ctx.every(500, () => { chant.textContent = k % 2 ? '2' : '1'; chant.classList.toggle('beat'); ctx.sound('tick'); k++; });
        chant.textContent = '1';
        await ctx.sleep(1500);
      } else {
        await countdown(ctx, stim, 3);
      }
      const seq = shuffle(LETTERS);
      stim.textContent = seq.join(' ');
      fill.style.animation = 'drain 5s linear forwards';
      await ctx.sleep(5000);
      stim.textContent = '';
      stim.append(h('span', 'wait', cond === 'suppression' ? 'keep chanting…' : 'wait…'));
      fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = 'drain 5s linear forwards';
      await ctx.sleep(5000);
      // The empty stimulus box would push the answer keys down, so it goes before they appear.
      timer.remove();
      stim.remove();
      const answer = await pickLetters(body, ctx);
      if (tick) { ctx.stop(tick); chant.remove(); }
      const correct = answer.filter((c, i) => c === seq[i]).length;
      scores[cond].push(correct);
      const fb = h('div', 'letter-feedback');
      fb.innerHTML = `<div>Shown: <b>${seq.join(' ')}</b></div><div>Yours: <b>${answer.map((c, i) => `<span class="${c === seq[i] ? 'ok' : 'no'}">${c}</span>`).join(' ')}</b></div><div>${correct}/7 in the right place</div>`;
      body.innerHTML = '';
      body.append(fb);
      ctx.sound(correct >= 5 ? 'correct' : 'wrong');
      await ctx.sleep(1800);
    }

    await gate(body, [
      '<b>Round 1:</b> three lists. Just remember them, in silence.',
      'Answer by tapping the letters in order (or typing them).'
    ], 'Start round 1');
    for (let i = 1; i <= 3; i++) await trial('normal', i);

    await gate(body, [
      '<b>Round 2:</b> the same task, but say <b>"one, two, one, two…"</b> OUT LOUD, in time with the tick.',
      'Start chanting when the ticking starts. <b>Keep going</b> until you have submitted your answer.'
    ], 'Start round 2');
    for (let i = 1; i <= 3; i++) await trial('suppression', i);

    const normal = pct(scores.normal.reduce((a, b) => a + b, 0), 21);
    const suppression = pct(scores.suppression.reduce((a, b) => a + b, 0), 21);
    body.innerHTML = '';
    status.textContent = 'Results — letters recalled in the correct position';
    body.append(bars([
      { label: 'You · quiet', value: normal, max: 100, text: normal + '%', tone: 'you' },
      { label: 'You · chanting', value: suppression, max: 100, text: suppression + '%', tone: 'you alt' },
      { label: 'Study · control', value: 76, max: 100, text: '76%', tone: 'study' },
      { label: 'Study · suppression', value: 45, max: 100, text: '45%', tone: 'study alt' }
    ], 'Landry & Bartling (2011) found 76% vs 45%'));
    body.append(verdict(suppression < normal
      ? `Chanting cost you ${normal - suppression} percentage points — the same direction as the original study.`
      : 'Your two rounds were similar. Small samples are noisy — compare with the class. (Did you really chant out loud the whole time?)'));
    done({ normal, suppression, summary: `Quiet: ${normal}% · Chanting "1-2": ${suppression}%` });
  }

  function pickLetters(body, ctx) {
    return new Promise(resolve => {
      const wrap = h('div', 'letter-pick');
      const slots = h('div', 'slots');
      const keys = h('div', 'letter-keys');
      const chosen = [];
      const draw = () => {
        slots.innerHTML = '';
        for (let i = 0; i < 7; i++) slots.append(h('span', 'slot' + (chosen[i] ? ' filled' : ''), chosen[i] || ''));
        [...keys.children].forEach(b => { if (b.dataset.l) b.disabled = chosen.includes(b.dataset.l); });
        submit.disabled = chosen.length === 0;
      };
      const add = l => { if (chosen.length < 7 && !chosen.includes(l)) { chosen.push(l); draw(); } };
      LETTERS.forEach(l => { const b = btn(l, () => add(l)); b.dataset.l = l; keys.append(b); });
      keys.append(btn('⌫', () => { chosen.pop(); draw(); }, 'answer-btn ghost'));
      const submit = btn('Submit', () => finish(), 'jrpg-btn primary');
      const finish = () => { ctx.offKey(keyFn); wrap.remove(); resolve(chosen.concat(Array(7 - chosen.length).fill('–'))); };
      const keyFn = e => {
        const k = e.key.toUpperCase();
        if (LETTERS.includes(k)) add(k);
        else if (e.key === 'Backspace') { chosen.pop(); draw(); }
        else if (e.key === 'Enter' && chosen.length) finish();
      };
      ctx.onKey(keyFn);
      wrap.append(h('p', 'game-instruction', 'Tap the letters in the order you saw them. Skip any you have forgotten.'), slots, keys, submit);
      body.append(wrap);
      draw();
    });
  }

  /* ── 3. Spatial span (Corsi-style) ───────────────────────── */
  async function spatialSpan(mount, done, ctx) {
    const { status, body } = header(mount, 'The Map of Shards', 'Tiles light up one at a time. Tap the same tiles in the same order.');
    await gate(body, ['Starts at <b>3 tiles</b>. Each correct answer adds one.', 'Two misses at the same length ends the run.']);
    body.innerHTML = '';
    const { grid, cells } = makeGrid(4);
    body.append(grid);
    let len = 3, best = 0, misses = 0;
    while (len <= 9) {
      status.textContent = `Length ${len} · try ${misses + 1} of 2 · watch…`;
      clearGrid(cells);
      await ctx.sleep(700);
      const seq = randomPath(len, 16);
      await showPath(ctx, cells, seq);
      status.textContent = `Length ${len} · your turn`;
      const entry = await collectPath(cells, len);
      const ok = entry.every((v, i) => v === seq[i]);
      entry.forEach((v, i) => cells[v].classList.add(v === seq[i] ? 'correct' : 'wrong'));
      ctx.sound(ok ? 'correct' : 'wrong');
      await ctx.sleep(900);
      if (ok) { best = len; len++; misses = 0; }
      else if (++misses >= 2) break;
    }
    body.innerHTML = '';
    status.textContent = 'Route complete.';
    const big = h('div', 'big-result');
    big.append(h('span', 'big-number', String(best)), h('span', '', 'tiles — your longest correct route'));
    body.append(big, verdict('Did you picture the route, or name the squares to yourself? If you named them, you were borrowing the phonological loop.'));
    done({ span: best, summary: `Longest spatial span: ${best}` });
  }

  /* ── 4. Dual task: spatial memory + verbal vs spatial secondary task ── */
  async function dualTask(mount, done, ctx) {
    const { status, body } = header(mount, 'Twin Paths', 'Remember a 5-tile route on the grid. While you remember it, you also do a second task.');
    const results = { verbal: [], spatial: [], taps: [0, 0] };
    const LEN = 5;

    async function trial(kind, n) {
      body.innerHTML = '';
      status.textContent = `${kind === 'verbal' ? 'Condition A · chant "the, the, the"' : 'Condition B · tap the glowing pad'} — route ${n} of 3`;
      const area = h('div', 'dual-area');
      const { grid, cells } = makeGrid(4);
      const side = h('div', 'dual-side');
      area.append(grid, side);
      body.append(area);
      let secondary = null;
      if (kind === 'verbal') {
        const chant = h('div', 'chant', 'the');
        side.append(chant);
        secondary = ctx.every(500, () => { chant.classList.toggle('beat'); ctx.sound('tick'); });
      } else {
        const pads = h('div', 'tap-pads');
        const ps = [0, 1, 2, 3].map(() => { const p = btn('', () => { if (p.classList.contains('lit')) { results.taps[0]++; p.classList.remove('lit'); ctx.sound('tap'); } }, 'tap-pad'); pads.append(p); return p; });
        side.append(h('div', 'side-label', 'Tap the lit pad'), pads);
        let last = -1;
        secondary = ctx.every(800, () => {
          ps.forEach(p => { if (p.classList.contains('lit')) p.classList.remove('lit'); });
          let k; do { k = rand(4); } while (k === last);
          last = k; ps[k].classList.add('lit'); results.taps[1]++;
        });
      }
      await ctx.sleep(1500);
      const seq = randomPath(LEN, 16);
      await showPath(ctx, cells, seq, 700, 250);
      status.textContent += ' · hold it…';
      await ctx.sleep(4000);
      ctx.stop(secondary);
      side.innerHTML = '';
      side.append(h('div', 'side-label', 'Stop. Now recall the route.'));
      const entry = await collectPath(cells, LEN);
      const correct = entry.filter((v, i) => v === seq[i]).length;
      entry.forEach((v, i) => cells[v].classList.add(v === seq[i] ? 'correct' : 'wrong'));
      results[kind].push(correct);
      ctx.sound(correct >= 4 ? 'correct' : 'wrong');
      await ctx.sleep(1100);
    }

    await gate(body, [
      '<b>Condition A (verbal extra task):</b> say <b>"the, the, the…"</b> out loud in time with the tick while you watch and hold the route.',
      'Chant from when the ticking starts until it stops.'
    ], 'Start condition A');
    for (let i = 1; i <= 3; i++) await trial('verbal', i);
    await gate(body, [
      '<b>Condition B (spatial extra task):</b> stay silent, but <b>tap whichever pad glows</b> while you watch and hold the route.',
      'Keep tapping until the pads stop.'
    ], 'Start condition B');
    for (let i = 1; i <= 3; i++) await trial('spatial', i);

    const v = pct(results.verbal.reduce((a, b) => a + b, 0), LEN * 3);
    const s = pct(results.spatial.reduce((a, b) => a + b, 0), LEN * 3);
    body.innerHTML = '';
    status.textContent = 'Results — route tiles recalled in the right place';
    body.append(bars([
      { label: 'Route + chanting (different systems)', value: v, max: 100, text: v + '%', tone: 'you' },
      { label: 'Route + tapping (same system)', value: s, max: 100, text: s + '%', tone: 'you alt' }
    ]));
    body.append(verdict(s < v
      ? 'Tapping hurt more than chanting — the two spatial tasks competed for the visuospatial sketchpad.'
      : 'Your results did not show the usual pattern. That happens with small samples — check the class pattern.'));
    done({ verbal: v, spatial: s, summary: `Route + chanting: ${v}% · Route + tapping: ${s}%` });
  }

  /* ── 5. Stroop ───────────────────────────────────────────── */
  async function stroop(mount, done, ctx) {
    const { status, body } = header(mount, 'The Gate of Focus', 'Choose the INK colour. Ignore what the word says.');
    const colors = { RED: '#e04848', GREEN: '#3fae5f', BLUE: '#3d7ff0', YELLOW: '#e8c12c' };
    const names = Object.keys(colors);
    await gate(body, ['20 words. Answer as fast as you can without mistakes.', 'Buttons or keys: <b>R</b> red · <b>G</b> green · <b>B</b> blue · <b>Y</b> yellow.']);
    body.innerHTML = '';
    const word = h('div', 'stroop-word');
    const choices = h('div', 'color-choices');
    body.append(word, choices);
    let current = null, t0 = 0, resolveTrial = null;
    const respond = name => {
      if (!current) return;
      const rt = performance.now() - t0;
      const c = current; current = null;
      resolveTrial({ ...c, rt, correct: name === c.ink });
    };
    names.forEach(n => {
      const b = btn(`${n} (${n[0]})`, () => respond(n));
      b.style.background = colors[n];
      choices.append(b);
    });
    ctx.onKey(e => { const n = names.find(x => x[0] === e.key.toUpperCase()); if (n) respond(n); });

    let trials = [];
    for (let i = 0; i < 20; i++) {
      const ink = names[i % 4];
      const congruent = i < 10;
      const text = congruent ? ink : shuffle(names.filter(x => x !== ink))[0];
      trials.push({ ink, text, congruent });
    }
    trials = shuffle(trials);
    await countdown(ctx, word, 3);
    const data = [];
    for (let i = 0; i < trials.length; i++) {
      status.textContent = `Word ${i + 1} of ${trials.length}`;
      word.textContent = '+'; word.style.color = '#cfd6dc';
      await ctx.sleep(400);
      current = trials[i];
      word.textContent = current.text;
      word.style.color = colors[current.ink];
      t0 = performance.now();
      data.push(await new Promise(r => { resolveTrial = r; }));
    }
    const c = data.filter(x => x.congruent), inc = data.filter(x => !x.congruent);
    const cRT = median(c.filter(x => x.correct).map(x => x.rt));
    const iRT = median(inc.filter(x => x.correct).map(x => x.rt));
    const cErr = c.filter(x => !x.correct).length, iErr = inc.filter(x => !x.correct).length;
    body.innerHTML = '';
    status.textContent = 'Results — typical (median) response time';
    const max = Math.max(cRT, iRT, 1) * 1.15;
    body.append(bars([
      { label: 'Word matches ink', value: cRT, max, text: `${cRT} ms · ${cErr} errors`, tone: 'you' },
      { label: 'Word clashes with ink', value: iRT, max, text: `${iRT} ms · ${iErr} errors`, tone: 'you alt' }
    ]));
    body.append(verdict(iRT > cRT
      ? `The clash cost you ${iRT - cRT} ms per word. That extra time is your central executive blocking the urge to read.`
      : 'No slowdown this time — did you make more errors on the clashing words instead?'));
    done({ congruent: cRT, incongruent: iRT, cost: iRT - cRT, errors: cErr + iErr, summary: `Match: ${cRT} ms · Clash: ${iRT} ms · Cost: ${iRT - cRT} ms · Errors: ${cErr + iErr}` });
  }

  /* ── 6. Task switching ───────────────────────────────────── */
  async function taskSwitch(mount, done, ctx) {
    const { status, body } = header(mount, 'The Switchyard', 'The rule tells you what to sort by. Left = RED or CIRCLE. Right = BLUE or SQUARE.');
    await gate(body, [
      'If the rule says <b>COLOUR</b>: red → left, blue → right.',
      'If the rule says <b>SHAPE</b>: circle → left, square → right.',
      'Keys: <b>A</b> = left, <b>L</b> = right. 24 trials.'
    ]);
    body.innerHTML = '';
    const rule = h('div', 'switch-rule');
    const stim = h('div', 'switch-stim');
    const row = h('div', 'switch-keys');
    body.append(rule, stim, row);
    let current = null, t0 = 0, resolveTrial = null;
    const respond = side => {
      if (!current) return;
      const c = current; current = null;
      resolveTrial({ ...c, rt: performance.now() - t0, correct: side === c.answer });
    };
    row.append(btn('◀ LEFT (A)\nred · circle', () => respond('L'), 'answer-btn tall'), btn('RIGHT (L) ▶\nblue · square', () => respond('R'), 'answer-btn tall'));
    ctx.onKey(e => { const k = e.key.toLowerCase(); if (k === 'a') respond('L'); if (k === 'l') respond('R'); });

    // Runs of 1–3 so roughly half of trials are switches.
    const rules = [];
    let r = Math.random() < .5 ? 'COLOUR' : 'SHAPE';
    while (rules.length < 24) {
      const run = 1 + rand(3);
      for (let i = 0; i < run && rules.length < 24; i++) rules.push(r);
      r = r === 'COLOUR' ? 'SHAPE' : 'COLOUR';
    }
    const data = [];
    for (let i = 0; i < 24; i++) {
      const color = Math.random() < .5 ? 'red' : 'blue';
      const shape = Math.random() < .5 ? 'circle' : 'square';
      const answer = rules[i] === 'COLOUR' ? (color === 'red' ? 'L' : 'R') : (shape === 'circle' ? 'L' : 'R');
      status.textContent = `Trial ${i + 1} of 24`;
      stim.className = 'switch-stim';
      await ctx.sleep(350);
      rule.textContent = rules[i];
      rule.className = 'switch-rule ' + (rules[i] === 'COLOUR' ? 'rule-colour' : 'rule-shape');
      stim.className = `switch-stim ${shape} ${color}`;
      current = { switch: i > 0 && rules[i] !== rules[i - 1], first: i === 0, answer };
      t0 = performance.now();
      data.push(await new Promise(res => { resolveTrial = res; }));
    }
    const rep = data.filter(x => !x.switch && !x.first), sw = data.filter(x => x.switch);
    const a = median(rep.filter(x => x.correct).map(x => x.rt)), b = median(sw.filter(x => x.correct).map(x => x.rt));
    const eRep = rep.filter(x => !x.correct).length, eSw = sw.filter(x => !x.correct).length;
    body.innerHTML = '';
    status.textContent = 'Results — typical (median) response time';
    const max = Math.max(a, b, 1) * 1.15;
    body.append(bars([
      { label: 'Same rule as before', value: a, max, text: `${a} ms · ${eRep} errors`, tone: 'you' },
      { label: 'Rule just switched', value: b, max, text: `${b} ms · ${eSw} errors`, tone: 'you alt' }
    ]));
    body.append(verdict(b > a ? `Each switch cost you about ${b - a} ms.` : 'No time cost this run — check your errors on switch trials.'));
    done({ repeat: a, switch: b, cost: b - a, summary: `Repeat: ${a} ms · Switch: ${b} ms · Cost: ${b - a} ms` });
  }

  /* ── 7. Story Loom (episodic buffer) ─────────────────────── */
  async function storyLoom(mount, done, ctx) {
    const { status, body } = header(mount, 'The Story Loom', 'Watch the scene AND listen to the message. You will need both.');
    const message = 'When the bells ring at sunset, take it to the north tower. Tell no one.';
    await gate(body, ['Turn your sound on. The scene and the spoken message each contain different details.'], 'Play the scene');
    body.innerHTML = '';
    const scene = h('div', 'loom-scene');
    scene.innerHTML = `
      <img class="loom-sprite lyra" src="assets/sprites/lyra_0.webp" alt="Lyra">
      <img class="loom-sprite nova" src="assets/sprites/nova_0.webp" alt="Nova">
      <div class="loom-gem"></div>
      <div class="loom-place">The library alcove</div>`;
    const caption = h('div', 'loom-caption');
    body.append(scene, caption);
    status.textContent = 'Watch… and listen.';
    await ctx.sleep(600);
    scene.classList.add('play');
    const spoken = await ctx.speak(message);
    if (!spoken) {
      caption.textContent = `🔊 “${message}”`;
      await ctx.sleep(5500);
      caption.textContent = '';
    } else {
      await ctx.sleep(1200);
    }
    await ctx.sleep(1500);
    scene.remove(); caption.remove();

    const qs = shuffle([
      { q: 'Who has the crystal now?', o: ['Nova', 'Lyra', 'Orin'], a: 'Nova', src: 'seen' },
      { q: 'What colour is the crystal?', o: ['Blue', 'Red', 'Green'], a: 'Blue', src: 'seen' },
      { q: 'Where must it be taken?', o: ['The north tower', 'The echo chamber', 'The switchyard'], a: 'The north tower', src: 'heard' },
      { q: 'When?', o: ['At sunset', 'At dawn', 'At midnight'], a: 'At sunset', src: 'heard' }
    ]);
    qs.push({ q: 'Put it together: what happens at sunset?', o: ['Nova takes the blue crystal to the north tower', 'Lyra takes the red crystal to the north tower', 'Nova takes the blue crystal to the library'], a: 'Nova takes the blue crystal to the north tower', src: 'both' });
    let score = 0;
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      status.textContent = `Question ${i + 1} of ${qs.length}`;
      body.innerHTML = '';
      body.append(h('h3', 'q-title', q.q));
      const row = h('div', 'game-button-row col');
      body.append(row);
      const picked = await new Promise(res => shuffle(q.o).forEach(o => row.append(btn(o, () => res(o)))));
      if (picked === q.a) score++;
      ctx.sound(picked === q.a ? 'correct' : 'wrong');
    }
    body.innerHTML = '';
    status.textContent = '';
    const big = h('div', 'big-result');
    big.append(h('span', 'big-number', `${score}/${qs.length}`), h('span', '', 'details combined'));
    body.append(big, verdict('Some answers came from what you SAW, some from what you HEARD, and the last one needed both at once. That combining is the episodic buffer\'s job.'));
    done({ score, of: qs.length, summary: `Story Loom: ${score}/${qs.length}` });
  }

  /* ── 8a. Intrinsic load ──────────────────────────────────── */
  async function intrinsicTrial(mount, done, ctx) {
    const { status, body } = header(mount, 'Chamber of Intrinsic Load', 'Pick the bigger value. Same layout both times — only the problems change.');
    const easy = () => { let a, b; do { a = 10 + rand(89); b = 10 + rand(89); } while (a === b); return { l: String(a), r: String(b), lv: a, rv: b }; };
    const hard = () => {
      let L, R;
      do {
        const [a, b, c] = [3 + rand(7), 3 + rand(7), 2 + rand(15)];
        const [d, e, f] = [3 + rand(7), 3 + rand(7), 2 + rand(15)];
        L = { t: `${a} × ${b} − ${c}`, v: a * b - c };
        R = { t: `${d} × ${e} + ${f}`, v: d * e + f };
      } while (L.v === R.v || Math.abs(L.v - R.v) > 12);
      return { l: L.t, r: R.t, lv: L.v, rv: R.v };
    };
    async function block(label, gen) {
      const res = { correct: 0, times: [] };
      for (let i = 0; i < 4; i++) {
        status.textContent = `${label} — problem ${i + 1} of 4`;
        body.innerHTML = '';
        const p = gen();
        const row = h('div', 'compare-row');
        const t0 = performance.now();
        const pick = await new Promise(r => {
          row.append(btn(p.l, () => r('l'), 'compare-btn'), h('span', 'vs', 'or'), btn(p.r, () => r('r'), 'compare-btn'));
          body.append(h('p', 'game-instruction center', 'Which is bigger?'), row);
        });
        res.times.push(performance.now() - t0);
        if ((pick === 'l') === (p.lv > p.rv)) res.correct++;
        await ctx.sleep(250);
      }
      body.innerHTML = '';
      res.effort = await effort(body);
      return res;
    }
    await gate(body, ['<b>Part A:</b> compare two numbers.', '<b>Part B:</b> compare two sums — do them in your head.']);
    const a = await block('Part A', easy);
    await gate(body, ['<b>Part B:</b> now each side is a sum. Work them out in your head.'], 'Start part B');
    const b = await block('Part B', hard);
    const ta = (mean(a.times) / 1000).toFixed(1), tb = (mean(b.times) / 1000).toFixed(1);
    body.innerHTML = '';
    status.textContent = 'Results';
    body.append(bars([
      { label: 'Simple · time', value: +ta, max: Math.max(+tb, +ta) * 1.15, text: `${ta} s · ${a.correct}/4`, tone: 'you' },
      { label: 'Complex · time', value: +tb, max: Math.max(+tb, +ta) * 1.15, text: `${tb} s · ${b.correct}/4`, tone: 'you alt' },
      { label: 'Simple · effort', value: a.effort, max: 9, text: `${a.effort}/9`, tone: 'study' },
      { label: 'Complex · effort', value: b.effort, max: 9, text: `${b.effort}/9`, tone: 'study alt' }
    ]));
    body.append(verdict('Nothing distracted you. The sums were just harder: more pieces to hold and combine at once.'));
    done({ simpleTime: +ta, complexTime: +tb, simpleEffort: a.effort, complexEffort: b.effort, summary: `Simple: ${ta}s, effort ${a.effort}/9 · Complex: ${tb}s, effort ${b.effort}/9` });
  }

  /* ── 8b. Extraneous load ─────────────────────────────────── */
  async function extraneousTrial(mount, done, ctx) {
    const { status, body } = header(mount, 'Chamber of Extraneous Load', 'Find the target symbol as fast as you can.');
    const POOL = ['◆', '●', '▲', '■', '✚', '⬟', '⬢', '✦', '◐', '☾', '♜', '♞'];

    async function block(noisy) {
      const res = { correct: 0, times: [] };
      for (let i = 0; i < 3; i++) {
        status.textContent = `${noisy ? 'Noisy room' : 'Clean room'} — search ${i + 1} of 3`;
        body.innerHTML = '';
        const syms = shuffle(POOL);
        const target = syms[0];
        const field = h('div', 'search-field' + (noisy ? ' noisy' : ''));
        const instr = h('div', 'search-instr', noisy ? `find: ${target}` : `Find this symbol: ${target}`);
        const grid = h('div', 'search-grid');
        const cells = shuffle([target, ...Array.from({ length: 23 }, () => syms[1 + rand(syms.length - 1)])]);
        const t0 = performance.now();
        const picked = await new Promise(r => {
          cells.forEach(s => grid.append(btn(s, () => r(s), 'search-cell')));
          field.append(instr, grid);
          if (noisy) addNoise(field, ctx);
          body.append(field);
        });
        res.times.push(performance.now() - t0);
        if (picked === target) res.correct++;
        ctx.sound(picked === target ? 'correct' : 'wrong');
        await ctx.sleep(300);
      }
      body.innerHTML = '';
      res.effort = await effort(body);
      return res;
    }
    await gate(body, ['<b>Round 1:</b> a clean, calm room.', '<b>Round 2:</b> the same search… in the Noisy Hall.']);
    const clean = await block(false);
    await gate(body, ['<b>Round 2:</b> same task. Different room. Ignore everything else.'], 'Enter the Noisy Hall');
    const noisy = await block(true);
    const tc = (mean(clean.times) / 1000).toFixed(1), tn = (mean(noisy.times) / 1000).toFixed(1);
    body.innerHTML = '';
    status.textContent = 'Results';
    const m = Math.max(+tc, +tn) * 1.15;
    body.append(bars([
      { label: 'Clean · time', value: +tc, max: m, text: `${tc} s · ${clean.correct}/3`, tone: 'you' },
      { label: 'Noisy · time', value: +tn, max: m, text: `${tn} s · ${noisy.correct}/3`, tone: 'you alt' },
      { label: 'Clean · effort', value: clean.effort, max: 9, text: `${clean.effort}/9`, tone: 'study' },
      { label: 'Noisy · effort', value: noisy.effort, max: 9, text: `${noisy.effort}/9`, tone: 'study alt' }
    ]));
    body.append(verdict('The task was identical. The extra time and effort came from things that had nothing to do with it.'));
    done({ cleanTime: +tc, noisyTime: +tn, cleanEffort: clean.effort, noisyEffort: noisy.effort, summary: `Clean: ${tc}s, effort ${clean.effort}/9 · Noisy: ${tn}s, effort ${noisy.effort}/9` });
  }

  function addNoise(field, ctx) {
    const notes = ['NEW MESSAGE', '🔥 12 likes', 'Battery 5%', '⚠ Update ready', '👀 Seen', 'Mum: call me', 'LIVE NOW', '+3 followers', 'Sale ends soon!', 'Reply?'];
    const ticker = h('div', 'noise-ticker', 'BREAKING · 3 people reacted to your story · You won\'t believe what happened next · Tap to see more · ');
    field.append(ticker);
    const spawn = () => {
      const n = h('div', 'noise-note', notes[rand(notes.length)]);
      n.style.left = (2 + Math.random() * 70) + '%';
      n.style.top = (8 + Math.random() * 78) + '%';
      n.style.setProperty('--r', (-12 + Math.random() * 24) + 'deg');
      field.append(n);
      setTimeout(() => n.remove(), 1600);
      if (Math.random() < .35) ctx.sound('notify');
    };
    for (let i = 0; i < 3; i++) spawn();
    ctx.every(450, spawn);
  }

  /* ── 8c. Germane load: building a schema ─────────────────── */
  async function germaneTrial(mount, done, ctx) {
    const { status, body } = header(mount, 'Chamber of Germane Load', 'Crack the code. Every letter has been changed in the same way.');
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    async function code(cipher, answer, withHint) {
      body.innerHTML = '';
      const strip = h('div', 'abc-strip', ABC.split('').join(' '));
      body.append(h('div', 'cipher', cipher), strip);
      const input = h('input', 'code-input');
      input.maxLength = 12; input.autocomplete = 'off'; input.placeholder = 'Type the word';
      const fb = h('div', 'code-fb');
      const hint = h('div', 'code-hint');
      const submit = btn('Check', () => check(), 'jrpg-btn primary');
      const row = h('div', 'sequence-input'); row.append(input, submit);
      body.append(row, fb, hint);
      input.focus();
      const t0 = performance.now();
      let tries = 0, resolveCode;
      const check = () => {
        tries++;
        if (input.value.trim().toUpperCase() === answer) { ctx.sound('correct'); resolveCode({ time: performance.now() - t0, tries, gaveUp: false }); }
        else { ctx.sound('wrong'); fb.textContent = 'Not yet — try again.'; input.select(); }
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      if (withHint) {
        ctx.sleep(35000).then(() => { hint.textContent = 'Hint: look at each letter on the alphabet strip. Where is the letter before it?'; });
        ctx.sleep(75000).then(() => { hint.append(' ', btn('Show me', () => resolveCode({ time: performance.now() - t0, tries, gaveUp: true }), 'answer-btn ghost')); });
      }
      return new Promise(r => { resolveCode = r; });
    }

    await gate(body, ['A secret word has been scrambled with one simple rule.', 'Use the alphabet strip to work it out.']);
    status.textContent = 'Code 1';
    const c1 = await code('I F M M P', 'HELLO', true);
    body.innerHTML = '';
    const e1 = await effort(body);
    body.innerHTML = '';
    const worked = h('div', 'worked');
    worked.innerHTML = `<h3>${c1.gaveUp ? 'The answer was HELLO.' : 'Cracked: HELLO.'} Here is the pattern:</h3>
      <div class="worked-row"><span>I→H</span><span>F→E</span><span>M→L</span><span>M→L</span><span>P→O</span></div>
      <p>Every letter was moved <b>one step forward</b> in the alphabet. To decode, move each one step back.</p>
      <p class="muted">You just built a <b>schema</b> — a pattern you can reuse.</p>`;
    body.append(worked);
    await new Promise(r => body.append(btn('Try code 2', r, 'jrpg-btn primary big')));
    status.textContent = 'Code 2';
    const c2 = await code('X P S M E', 'WORLD', false);
    body.innerHTML = '';
    const e2 = await effort(body);
    const t1 = (c1.time / 1000).toFixed(0), t2 = (c2.time / 1000).toFixed(0);
    body.innerHTML = '';
    status.textContent = 'Results';
    const m = Math.max(+t1, +t2, 1) * 1.15;
    body.append(bars([
      { label: 'Code 1 · time', value: +t1, max: m, text: `${t1} s`, tone: 'you' },
      { label: 'Code 2 · time', value: +t2, max: m, text: `${t2} s`, tone: 'you alt' },
      { label: 'Code 1 · effort', value: e1, max: 9, text: `${e1}/9`, tone: 'study' },
      { label: 'Code 2 · effort', value: e2, max: 9, text: `${e2}/9`, tone: 'study alt' }
    ]));
    body.append(verdict('The effort on code 1 was not wasted: it built a pattern in long-term memory, so code 2 took less working memory.'));
    done({ code1Time: +t1, code2Time: +t2, code1Effort: e1, code2Effort: e2, summary: `Code 1: ${t1}s, effort ${e1}/9 · Code 2: ${t2}s, effort ${e2}/9` });
  }

  /* ── 9. Distracted lecture (Sana et al.) ─────────────────── */
  async function microLecture(mount, done, ctx) {
    let condition = ctx.remember('sanaCondition');
    if (!condition) condition = ctx.remember('sanaCondition', Math.random() < .5 ? 'focus' : 'multitask');
    const label = condition === 'focus' ? 'Group F — Focus' : 'Group M — Multitask';
    const { status, body } = header(mount, 'The Distracted Lecture', '');
    const READ = 50;
    await gate(body, [
      `Your device has been randomly placed in <b class="cond">${label}</b>.`,
      condition === 'focus'
        ? 'Read the lesson carefully. You have 50 seconds.'
        : 'Read the lesson carefully. You have 50 seconds. <b>Messages will pop up — answer each one.</b>',
      'Then there is a 5-question quiz. Remember your group!'
    ], 'Start reading');
    body.innerHTML = '';
    const lesson = h('div', 'micro-lesson');
    lesson.innerHTML = `<h3>Signal Towers</h3>
      <p>Before the telegraph, some countries sent messages using chains of signal towers built on hilltops. Each tower had large wooden arms that could be set in different positions. Every position stood for a letter or a word in a shared code book.</p>
      <p>An operator watched the next tower through a telescope, copied its signal, and passed it on. Because each tower had to see the next one, fog and darkness stopped the whole line.</p>
      <p>A message could cross a country in a few hours instead of the days a rider needed. But one careless operator could copy a signal wrongly — and the mistake travelled down the whole line.</p>`;
    const timer = h('div', 'timebar'); const fill = h('div'); timer.append(fill);
    body.append(timer, lesson);
    fill.style.animation = `drain ${READ}s linear forwards`;
    let popDone = 0, popTotal = 0;
    if (condition === 'multitask') {
      const pops = [
        ['What is 8 + 7?', ['13', '15', '17'], '15'],
        ['Tap the BLUE button', ['RED', 'BLUE', 'GREEN'], 'BLUE'],
        ['Which day comes after Thursday?', ['Friday', 'Monday', 'Sunday'], 'Friday'],
        ['Reply to Maya: "Are you coming later?"', ['Yes 👍', 'No', 'Maybe'], null],
        ['What is 6 × 4?', ['24', '26', '20'], '24'],
        ['Tap the circle', ['▲', '●', '■'], '●']
      ];
      pops.forEach(([q, opts, ans], i) => {
        ctx.sleep(4000 + i * 7500).then(() => {
          popTotal++;
          const p = h('div', 'popup-task');
          // Two slots from the top and one anchored to the bottom, so no pop-up hangs below the card.
          if (i % 3 === 2) p.style.bottom = '6%'; else p.style.top = (6 + (i % 3) * 28) + '%';
          const app = h('div', 'popup-app'); app.innerHTML = `${window.Studies.ic('phone')} New message`; p.append(app, h('strong', '', q));
          const r = h('div', 'game-button-row');
          opts.forEach(o => r.append(btn(o, () => { if (ans === null || o === ans) popDone++; p.remove(); })));
          p.append(r);
          lesson.append(p);
          ctx.sound('notify');
        });
      });
    }
    for (let s = READ; s > 0; s--) { status.textContent = `${label} · ${s}s left`; await ctx.sleep(1000); }
    body.innerHTML = '';
    const qs = [
      ['Where were the signal towers usually built?', ['On hilltops', 'In cities', 'Beside rivers'], 'On hilltops'],
      ['What did every tower need so the signals meant the same thing?', ['A shared code book', 'A fast horse', 'A clock'], 'A shared code book'],
      ['What did operators use to read the next tower?', ['A telescope', 'A lantern', 'A bell'], 'A telescope'],
      ['What stopped the whole line working?', ['Fog and darkness', 'Rain on the arms', 'Too many messages'], 'Fog and darkness'],
      ['What happened if one operator copied a signal wrongly?', ['The mistake travelled down the line', 'The next tower corrected it', 'The message stopped'], 'The mistake travelled down the line']
    ];
    let score = 0;
    for (let i = 0; i < qs.length; i++) {
      const [q, o, a] = qs[i];
      status.textContent = `Quiz · question ${i + 1} of ${qs.length}`;
      body.innerHTML = '';
      body.append(h('h3', 'q-title', q));
      const row = h('div', 'game-button-row col');
      body.append(row);
      const picked = await new Promise(res => shuffle(o).forEach(x => row.append(btn(x, () => res(x)))));
      if (picked === a) score++;
    }
    body.innerHTML = '';
    const eff = await effort(body, 'How hard was it to learn the lesson?');
    status.textContent = '';
    const big = h('div', 'big-result');
    big.append(h('span', 'big-number', `${score}/5`), h('span', '', label));
    body.append(big);
    if (condition === 'multitask') body.append(verdict(`You answered ${popDone} of ${popTotal} messages correctly. Finishing the messages is not the same as learning the lesson.`));
    else body.append(verdict('You had no interruptions. Compare your score with Group M in the class tally.'));
    done({ condition, score, effort: eff, summary: `${label}: quiz ${score}/5, effort ${eff}/9` });
  }

  /* ── 10. Final challenge ─────────────────────────────────── */
  async function bossBattle(mount, done, ctx) {
    const { status, body } = header(mount, 'The Overload Engine', 'Diagnose each situation to break a layer of the Engine.');
    const scenarios = [
      { q: 'Sam memorises a phone number by repeating it silently while someone reads out a list of names.', o: ['Two tasks competing for the phonological loop', 'Two tasks competing for the visuospatial sketchpad', 'No competition at all'], why: 'Both the number and the names are sounds or words, so they fight over the phonological loop.' },
      { q: 'Aisha drives a familiar route while chatting to a passenger. She copes fine.', o: ['Different components are used, so they clash less', 'The central executive has unlimited capacity', 'Driving uses the phonological loop'], why: 'Driving is mostly visuospatial; talking is phonological. Different components can run side by side.' },
      { q: 'A student keeps reading the word instead of naming its ink colour.', o: ['The central executive failing to block an automatic response', 'The episodic buffer is full', 'Intrinsic load from a hard task'], why: 'Blocking a habit (reading) is an executive control job — the Stroop effect.' },
      { q: 'A revision sheet has tiny text, flashing banners and the instructions on a different page from the questions.', o: ['Extraneous load', 'Intrinsic load', 'Germane load'], why: 'None of that clutter is part of the content. It is extraneous load — and it can be removed.' },
      { q: 'A first-time learner finds balancing chemical equations hard even in a silent room.', o: ['Intrinsic load — the task has many parts to combine', 'Extraneous load from the room', 'Phonological loop overload'], why: 'The difficulty is built into the task. Break it into steps and use worked examples.' },
      { q: 'After studying three worked examples, a student solves a new problem of the same type much faster.', o: ['A schema has formed, lowering the load (germane effort paid off)', 'Their working memory capacity doubled', 'The problem had no intrinsic load'], why: 'Effort spent understanding built a schema in long-term memory, freeing working memory.' },
      { q: 'Farmers score higher on reasoning tests after the harvest than before it.', o: ['Money worries take up working memory (extraneous load)', 'The harvest improves intelligence', 'They practised the test'], why: 'Mani et al. (2013): worry about money uses up capacity — the same people did better once the worry eased. (Practice is a fair limitation to discuss, though!)' },
      { q: 'A student studying for an exam tomorrow wants the best conditions. Which is best?', o: ['Phone in another room, quiet space, past-paper practice', 'Music with lyrics and notifications on', 'Switch subject every five minutes'], why: 'Remove extraneous load, avoid switch costs, and build schemas through practice.' }
    ].map(s => ({ ...s, answer: s.o[0] }));
    const hp = h('div', 'boss-hp');
    scenarios.forEach(() => hp.append(h('span')));
    mount.insertBefore(hp, status);
    let score = 0;
    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i];
      status.textContent = `Engine layer ${i + 1} of ${scenarios.length}`;
      body.innerHTML = '';
      body.append(h('p', 'scenario', s.q));
      const row = h('div', 'game-button-row col');
      body.append(row);
      const buttons = [];
      const picked = await new Promise(res => shuffle(s.o).forEach(o => { const b = btn(o, () => res(o)); buttons.push(b); row.append(b); }));
      const ok = picked === s.answer;
      reveal(buttons, s.answer, picked);
      if (ok) { score++; hp.children[i].classList.add('down'); }
      ctx.sound(ok ? 'shatter' : 'wrong');
      await new Promise(r => {
        const { box, next } = explain(ok, `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${s.why}`, i < scenarios.length - 1 ? 'Next layer ▸' : 'See result', r);
        body.append(box);
        next.focus({ preventScroll: true });
      });
    }
    body.innerHTML = '';
    status.textContent = '';
    const win = score >= 6;
    const big = h('div', 'big-result');
    big.append(h('span', 'big-number', `${score}/${scenarios.length}`), h('span', '', win ? 'The Engine is broken. The Archive is safe.' : 'The Engine is weakened — replay to finish it off.'));
    body.append(big);
    if (win) ctx.sound('victory');
    done({ score, of: scenarios.length, summary: `Final challenge: ${score}/${scenarios.length}` });
  }

  window.GameRegistry = {
    digitSpan, letterRecall, spatialSpan, dualTask, stroop, taskSwitch, storyLoom,
    intrinsicTrial, extraneousTrial, germaneTrial, microLecture, bossBattle
  };
  window.MQHelpers = { h, btn, shuffle, bars, verdict, reveal, explain };
})();
