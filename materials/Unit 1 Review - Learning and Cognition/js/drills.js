/* Drills: generic (sort, order, cloze) and hands-on demonstrations of the studies.
 * DRILLS.run(type, cfg, host) renders into `host` and resolves {score, max, flags?}.
 * All demonstrations are informal classroom versions, never tests of the student. */
(function () {
  'use strict';
  var h = U.h;
  var D = window.DRILLS = {};

  D.run = function (type, cfg, host) {
    host.innerHTML = '';
    var fn = D[type];
    // Test harness only (set from the console): skip hands-on drills during automated playthroughs.
    if (window.ODY_DEBUG && window.ODY_DEBUG.skipDrills && type !== 'penelope') return Promise.resolve({ score: 1, max: 1 });
    if (!fn) { host.appendChild(h('p', 'Unknown drill: ' + type)); return Promise.resolve({ score: 0, max: 0 }); }
    return fn(cfg || {}, host);
  };

  function head(title, prompt, extra) {
    return [h('div.drill-head', h('h2', title), extra || null), prompt ? h('p.drill-prompt', { html: U.md(prompt) }) : null];
  }
  function foot(host, label, onGo, opts) {
    var go = h('button.btn.btn-primary', { type: 'button', disabled: !!(opts && opts.disabled) }, label || 'Continue');
    go.addEventListener('click', onGo);
    var f = h('div.panel-foot', (opts && opts.left) || h('span'), go);
    host.appendChild(f);
    return go;
  }
  function finishView(host, title, html, score, max, resolve, extra) {
    host.innerHTML = '';
    host.append(h('div.drill-head', h('h2', title), max ? h('span.chip.chip-gold', score + ' / ' + max) : null),
      h('div.drill-result', { html: html }), extra || null);
    foot(host, 'Continue', function () { AUDIO.stop(); resolve({ score: score, max: max }); });
  }
  /* After Check, the same button becomes Continue, but only after a short pause, so a
   * double click cannot skip the feedback. */
  function holdContinue(btn) {
    btn.textContent = 'Continue';
    btn.disabled = true;
    U.later(function () { btn.disabled = false; }, S.opt('presenter') ? 0 : 1300);
  }
  function bank(kind, id) { return (ODY.drills && ODY.drills[kind] && ODY.drills[kind][id]) || null; }

  /* ---------- sort: tap a card, then tap a bucket ---------- */
  D.sort = function (cfg, host) {
    var d = bank('sort', cfg.id);
    if (!d) return missing(host, cfg.id);
    return new Promise(function (resolve) {
      var cards = U.shuffle(d.cards).slice(0, cfg.n || 10).map(function (c) { return { c: c, at: -1 }; });
      var sel = null;
      host.append.apply(host, head(d.title, d.prompt, h('span.chip', 'Tap a card, then a box')));
      var area = h('div.sort-area');
      var deck = h('div.sort-deck');
      var bucketsBox = h('div.sort-buckets');
      var buckets = d.buckets.map(function (name, bi) {
        var b = h('button.bucket', { type: 'button' }, h('h4', name), h('div.bucket-cards'));
        b.addEventListener('click', function (e) {
          if (e.target.closest('.sort-card')) return;
          if (!sel) return;
          sel.at = bi;
          sel = null;
          AUDIO.sfx('tile', 0.4);
          paint();
        });
        bucketsBox.appendChild(b);
        return b;
      });
      area.append(deck, bucketsBox);
      host.appendChild(area);
      var check = foot(host, 'Check', doCheck, { disabled: true });
      function cardBtn(item) {
        var b = h('button.sort-card' + (sel === item ? '.sel' : ''), { type: 'button', html: U.md(item.c.t) });
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (checked) return;
          sel = sel === item ? null : item;
          AUDIO.sfx('tap', 0.35);
          paint();
        });
        return b;
      }
      var checked = false;
      function paint() {
        deck.innerHTML = '';
        buckets.forEach(function (b) { b.querySelector('.bucket-cards').innerHTML = ''; b.classList.toggle('target', !!sel); });
        cards.forEach(function (item) {
          var node = cardBtn(item);
          if (checked) node.classList.add(item.at === item.c.b ? 'ok' : 'no');
          if (item.at < 0) deck.appendChild(node);
          else buckets[item.at].querySelector('.bucket-cards').appendChild(node);
        });
        if (!deck.children.length) deck.appendChild(h('span.muted.small', checked ? '' : 'All placed. Check when ready, or tap a card to move it.'));
        check.disabled = cards.some(function (x) { return x.at < 0; });
      }
      paint();
      function doCheck() {
        if (checked) { resolve({ score: score, max: cards.length }); return; }
        checked = true;
        sel = null;
        score = 0;
        cards.forEach(function (x) { if (x.at === x.c.b) score++; });
        paint();
        AUDIO.sfx(score === cards.length ? 'victory' : 'correct', 0.4);
        var wrong = cards.filter(function (x) { return x.at !== x.c.b; });
        var res = h('div.drill-result', { html: '<b>' + score + ' of ' + cards.length + ' in the right place.</b> ' +
          (wrong.length ? 'Red cards belong elsewhere:' : 'Every card is where it belongs.') });
        if (wrong.length) res.appendChild(h('ul.notes-list.small', wrong.map(function (x) {
          return h('li', { html: '<b>' + U.esc(d.buckets[x.c.b]) + ':</b> ' + U.md(x.c.t) + (x.c.why ? ' <span class="muted">(' + U.esc(x.c.why) + ')</span>' : '') });
        })));
        area.after(res);
        holdContinue(check);
      }
      var score = 0;
    });
  };

  /* ---------- order ---------- */
  D.order = function (cfg, host) {
    var d = bank('order', cfg.id);
    if (!d) return missing(host, cfg.id);
    return new Promise(function (resolve) {
      var items = U.shuffle(d.steps.map(function (s, i) { return { t: s, i: i }; }));
      if (items.every(function (x, k) { return x.i === k; })) items.reverse();
      host.append.apply(host, head(d.title, d.prompt, h('span.chip', 'Use the arrows')));
      var list = h('div.order-list');
      host.appendChild(list);
      var checked = false;
      function paint() {
        list.innerHTML = '';
        items.forEach(function (it, k) {
          var up = h('button', { type: 'button', 'aria-label': 'Move up', html: '&#9650;', disabled: k === 0 || checked });
          var dn = h('button', { type: 'button', 'aria-label': 'Move down', html: '&#9660;', disabled: k === items.length - 1 || checked });
          up.addEventListener('click', function () { swap(k, k - 1); });
          dn.addEventListener('click', function () { swap(k, k + 1); });
          var row = h('div.order-item' + (checked ? (it.i === k ? '.ok' : '.no') : ''), h('span.n', String(k + 1)), h('span', { html: U.md(it.t) }), h('div.order-btns', up, dn));
          list.appendChild(row);
        });
      }
      function swap(a, b) { var t = items[a]; items[a] = items[b]; items[b] = t; AUDIO.sfx('tap', 0.35); paint(); }
      paint();
      var go = foot(host, 'Check', function () {
        if (checked) { resolve({ score: score, max: items.length }); return; }
        checked = true;
        items.forEach(function (x, k) { if (x.i === k) score++; });
        paint();
        AUDIO.sfx('correct', 0.4);
        list.after(h('div.drill-result', { html: '<b>' + score + ' of ' + items.length + ' in the right position.</b> The correct order: ' +
          d.steps.map(function (s, i) { return (i + 1) + '. ' + U.md(s); }).join(' &nbsp; ') }));
        holdContinue(go);
      });
      var score = 0;
    });
  };

  /* ---------- cloze: rebuild a study ---------- */
  D.cloze = function (cfg, host) {
    var d = bank('cloze', cfg.id);
    if (!d) return missing(host, cfg.id);
    return new Promise(function (resolve) {
      host.append.apply(host, head(d.title, d.prompt || 'Choose the right word for each gap.'));
      var sels = [];
      var html = U.esc(d.text).replace(/\{(\d+)\}/g, function (_, n) { return '<span data-gap="' + n + '"></span>'; });
      var text = h('div.cloze-text', { html: html });
      U.$$('[data-gap]', text).forEach(function (span) {
        var g = d.gaps[+span.dataset.gap];
        var s = h('select', { 'aria-label': 'Gap ' + (+span.dataset.gap + 1) }, h('option', { value: '' }, '...'),
          U.shuffle([g.a].concat(g.d)).map(function (o) { return h('option', { value: o }, o); }));
        s.dataset.answer = g.a;
        s.addEventListener('change', function () { go.disabled = sels.some(function (x) { return !x.value; }); });
        sels.push(s);
        span.replaceWith(s);
      });
      host.appendChild(text);
      var checked = false, score = 0;
      var go = foot(host, 'Check', function () {
        if (checked) { resolve({ score: score, max: sels.length }); return; }
        checked = true;
        sels.forEach(function (s) {
          var ok = s.value === s.dataset.answer;
          if (ok) score++;
          s.classList.add(ok ? 'ok' : 'no');
          if (!ok) s.after(h('b.small', { style: { color: 'var(--good)' } }, ' ' + s.dataset.answer));
          s.disabled = true;
        });
        AUDIO.sfx('correct', 0.4);
        text.after(h('div.drill-result', { html: '<b>' + score + ' of ' + sels.length + ' gaps right.</b>' + (d.after ? ' ' + U.md(d.after) : '') }));
        holdContinue(go);
      }, { disabled: true });
    });
  };

  function missing(host, id) {
    return new Promise(function (resolve) {
      host.append(h('p', 'This drill (' + (id || '?') + ') is not available.'));
      foot(host, 'Continue', function () { resolve({ score: 0, max: 0 }); });
    });
  }

  /* ---------- levels of processing ---------- */
  var LOP_POOL = [
    { w: 'anchor', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "banker"?', m: 'Would it stop a ship from drifting?' } },
    { w: 'harbour', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "arbour"?', m: 'Is it a safe place for ships?' } },
    { w: 'olive', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "hollow"?', m: 'Could it be pressed for oil?' } },
    { w: 'helmet', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "pelmet"?', m: 'Would it protect a soldier\'s head?' } },
    { w: 'goat', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "boat"?', m: 'Is it an animal that gives milk?' } },
    { w: 'torch', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "porch"?', m: 'Would it light a dark cave?' } },
    { w: 'wool', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "pull"?', m: 'Could it be spun into a cloak?' } },
    { w: 'bronze', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "ponds"?', m: 'Is it a metal for making swords?' } },
    { w: 'honey', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "money"?', m: 'Is it made by bees?' } },
    { w: 'cliff', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "sniff"?', m: 'Could a ship be wrecked against it?' } },
    { w: 'barrel', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "carol"?', m: 'Could it hold water for a voyage?' } },
    { w: 'feather', q: { s: 'Is the word printed in capital letters?', p: 'Does it rhyme with "weather"?', m: 'Does it belong to a bird?' } }
  ];
  var LOP_FOILS = ['temple', 'sail', 'arrow', 'marble', 'grape', 'shield', 'lamp', 'rope', 'sheep', 'bread', 'river', 'crown'];
  var LEVELS = { s: 'Structural', p: 'Phonological', m: 'Semantic' };

  function lopEncode(host, onDone) {
    var pick = U.shuffle(LOP_POOL).slice(0, 9);
    var plan = pick.map(function (x, i) { return { w: x.w, level: ['s', 'p', 'm'][i % 3], q: x.q }; });
    plan = U.shuffle(plan);
    var i = 0;
    host.append.apply(host, head('The cargo tally', 'Answer the quartermaster\'s question about each word. Just yes or no.'));
    var box = h('div.big-center');
    host.appendChild(box);
    function next() {
      if (i >= plan.length) { onDone(plan.map(function (p) { return { w: p.w, level: p.level }; })); return; }
      var p = plan[i++];
      var caps = p.level === 's' ? Math.random() < 0.5 : Math.random() < 0.3;
      box.innerHTML = '';
      var yes = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Yes');
      var no = h('button.btn.btn-lg', { type: 'button' }, 'No');
      box.append(h('p.small.muted', 'Word ' + i + ' of ' + plan.length), h('p.lede', p.q[p.level]),
        h('div.word-big' + (caps ? '' : '.lower'), caps ? p.w.toUpperCase() : p.w), h('div.btn-row', yes, no));
      yes.disabled = no.disabled = true;
      setTimeout(function () { yes.disabled = no.disabled = false; }, 600);
      yes.onclick = no.onclick = function () { AUDIO.sfx('tap', 0.35); next(); };
    }
    next();
  }
  function lopRecall(host, seed, resolve, title) {
    var targets = seed.map(function (s) { return s.w; });
    var foils = U.shuffle(LOP_FOILS.filter(function (f) { return targets.indexOf(f) < 0; })).slice(0, 9);
    var all = U.shuffle(targets.concat(foils));
    var chosen = {};
    host.innerHTML = '';
    host.append.apply(host, head(title || 'Do you remember the cargo?', 'Earlier you answered questions about nine words. Tap every word you think you saw. Some of these are new.'));
    var grid = h('div.pick-grid');
    all.forEach(function (w) {
      var b = h('button', { type: 'button' }, w);
      b.addEventListener('click', function () { chosen[w] = !chosen[w]; b.classList.toggle('on', !!chosen[w]); AUDIO.sfx('tap', 0.3); });
      grid.appendChild(b);
    });
    host.appendChild(grid);
    foot(host, 'Check my memory', function () {
      var hits = { s: 0, p: 0, m: 0 };
      seed.forEach(function (s) { if (chosen[s.w]) hits[s.level]++; });
      var fa = foils.filter(function (f) { return chosen[f]; }).length;
      var total = hits.s + hits.p + hits.m;
      var html = '<b>You recognised ' + total + ' of 9 words' + (fa ? ', and picked ' + fa + ' that you never saw.' : '.') + '</b><br>' +
        'Structural (letter case): ' + hits.s + ' of 3 &nbsp;·&nbsp; Phonological (rhyme): ' + hits.p + ' of 3 &nbsp;·&nbsp; Semantic (meaning): ' + hits.m + ' of 3.<br><br>' +
        'Craik and Lockhart (1972) argued that how long a memory lasts depends on how <b>deeply</b> it was processed, not on which store it reached. Craik and Tulving (1975) used exactly this kind of surprise test after structural, phonemic and semantic questions: recognition rose with depth, best for meaning.<br>' +
        '<span class="muted">One person with three words per level is noisy evidence. The class pattern matters more. And note the circularity problem: "deep" is defined by the result it is meant to explain.</span>';
      var chart = h('div.chart', ['s', 'p', 'm'].map(function (l) {
        return h('div.bar', { style: { height: Math.max(3, hits[l] / 3 * 100) + '%' } }, h('span', LEVELS[l]));
      }));
      U.$$('button', grid).forEach(function (b) {
        var w = b.textContent;
        var isT = targets.indexOf(w) >= 0;
        b.disabled = true;
        if (chosen[w] && isT) b.classList.add('ok');
        else if (chosen[w]) b.classList.add('no');
        else if (isT) b.classList.add('miss');
      });
      if (total === 9 && !fa) S.award('lop3');
      host.innerHTML = '';
      host.append(h('div.drill-head', h('h2', 'Levels of processing'), h('span.chip.chip-gold', total + ' / 9')),
        h('div', { style: { maxWidth: '520px', width: '100%', margin: '0 auto 24px' } }, chart),
        h('div.drill-result', { html: html }), grid);
      foot(host, 'Continue', function () { resolve({ score: total, max: 9 }); });
    });
  }
  D.lopseed = function (cfg, host) {
    return new Promise(function (resolve) {
      lopEncode(host, function (seed) {
        S.data.meta.lopSeed = { words: seed, at: Date.now() };
        S.save();
        resolve({ score: 0, max: 0 });
      });
    });
  };
  D.loprecall = function (cfg, host) {
    return new Promise(function (resolve) {
      var seed = S.data.meta.lopSeed && S.data.meta.lopSeed.words;
      if (seed && seed.length === 9) { lopRecall(host, seed, resolve); return; }
      // No words from Troy (the student jumped in): encode now, fill the gap, then test.
      lopEncode(host, function (s) { fillerThen(host, function () { lopRecall(host, s, resolve); }); });
    });
  };
  D.lop = function (cfg, host) {
    return new Promise(function (resolve) {
      lopEncode(host, function (s) { fillerThen(host, function () { lopRecall(host, s, resolve, 'Surprise: which words did you see?'); }); });
    });
  };
  function fillerThen(host, then) {
    host.innerHTML = '';
    host.append.apply(host, head('Before the next part', 'Quick arithmetic for twenty seconds. Pick the right answer.'));
    var box = h('div.big-center');
    host.appendChild(box);
    var end = Date.now() + 20000;
    (function next() {
      if (Date.now() > end) { then(); return; }
      var a = 20 + Math.floor(Math.random() * 60), b = 3 + Math.floor(Math.random() * 9);
      var ans = a - b;
      box.innerHTML = '';
      box.append(h('div.word-big', a + ' - ' + b), h('div.btn-row', U.shuffle([ans, ans + 1, ans - 2]).map(function (o) {
        return h('button.btn.btn-lg', { type: 'button', onclick: function () { AUDIO.sfx('tap', 0.3); next(); } }, String(o));
      })), h('p.small.muted', Math.ceil((end - Date.now()) / 1000) + ' s'));
    })();
  }

  /* ---------- operant: the lotus grove (variable ratio, then extinction) ---------- */
  D.reinforce = function (cfg, host) {
    return new Promise(function (resolve) {
      host.append.apply(host, head('The lotus grove', 'Pick lotus flowers. Some give a sweet dream (a point), most do not. Pick as long as you like, and leave when you choose.'));
      var dreams = 0, picks = 0, afterStop = 0, stopped = false, t0 = Date.now(), lastWin = 0;
      var nextWin = 2 + Math.floor(Math.random() * 5);
      var counter = h('p.lede', 'Dreams: 0');
      var btn = h('button.lotus-btn', { type: 'button' }, 'Pick a lotus');
      var leave = h('button.btn', { type: 'button' }, 'Leave the grove');
      var note = h('p.small.muted', 'There is no right number of picks.');
      host.appendChild(h('div.big-center', counter, btn, note, leave));
      btn.addEventListener('click', function () {
        picks++;
        if (stopped) afterStop++;
        if (!stopped && picks >= nextWin) {
          dreams++;
          lastWin = picks;
          nextWin = picks + 1 + Math.floor(Math.random() * 6);
          counter.textContent = 'Dreams: ' + dreams;
          AUDIO.sfx('correct', 0.35);
          btn.animate && btn.animate([{ transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 250);
        } else AUDIO.sfx('tap', 0.25);
        // After about twenty seconds the grove quietly stops paying.
        if (!stopped && Date.now() - t0 > 20000 && dreams >= 3) stopped = true;
      });
      leave.addEventListener('click', function () {
        var resisted = stopped ? afterStop < 8 : true;
        var q = { id: 'lotusq', t: 'operant', q: 'In the grove, dreams came after an unpredictable number of picks. Which schedule was that?',
          a: 'Variable ratio', d: ['Fixed ratio', 'Fixed interval', 'Variable interval'],
          why: 'Reward after an unpredictable number of responses is variable ratio. It produces fast, persistent responding that is slow to extinguish.' };
        host.innerHTML = '';
        var summary = '<b>You picked ' + picks + ' flowers and got ' + dreams + ' dreams.</b> ' +
          (stopped ? 'The grove stopped paying a while ago, and you picked <b>' + afterStop + '</b> more times after the last dream. ' : 'You left before the grove stopped paying. ') +
          'That persistence is exactly what a variable ratio schedule produces: when rewards are unpredictable, a run of nothing does not feel like a signal to stop. It is why slot machines, loot boxes and refresh feeds are so hard to put down. When reinforcement stops completely, the behaviour eventually dies away: <b>extinction</b>.';
        host.append.apply(host, head('What just happened', null));
        host.appendChild(h('div.drill-result', { html: summary }));
        var qhost = h('div.qte-host');
        host.appendChild(qhost);
        QB.ask(qhost, q, { noRecord: true, timer: 0, label: 'Name the schedule' }).then(function (r) { if (r.aborted) return;
          resolve({ score: r.correct ? 3 : 1, max: 3, flags: { lotus_resisted: resisted, lotus_picks: picks } });
        });
      });
    });
  };

  /* ---------- schema: Bransford and Johnson ---------- */
  var BJ_TEXT = 'It is easier than it looks, but only if you choose the right day. Too little and nothing happens; too much and you lose control of the whole thing. Open ground is better than a crowded place, because the most common failures come from things getting caught. The first time, it helps to have a partner: one holds, one pulls. Move backwards steadily and let out more as you go, and do not stop until it catches. After that, small adjustments matter far more than big ones. Many people give up at this stage, which is a pity. Eventually it all has to come down again, and winding everything up neatly is the part most people forget. Done with care, the same equipment will last for years.';
  var BJ_TITLE = 'Flying a kite';
  var BJ_UNITS = ['Choose the right day (weather)', 'Too little or too much (wind) causes problems', 'Open ground is better than a crowded place', 'Failures come from getting caught (trees, wires)', 'A partner helps the first time', 'One person holds, one pulls', 'Move backwards and let out more (line)', 'Keep going until it catches (the wind)', 'Small adjustments matter most', 'Winding up neatly at the end; the equipment lasts for years'];
  D.bj = function (cfg, host) {
    return new Promise(function (resolve) {
      var cond = Math.random() < 0.5 ? 'before' : 'none';
      var rating = 0;
      host.append.apply(host, head('A passage to remember', 'You have been randomly allocated to one of two groups. Read the passage carefully. Afterwards you will rate how well you understood it and write down everything you remember.'));
      var box = h('div', { style: { display: 'grid', gap: '12px' } },
        cond === 'before' ? h('p.lede', h('b', 'Topic: ' + BJ_TITLE)) : h('p.lede', h('i', 'No topic is given.')),
        h('div.passage', BJ_TEXT));
      host.appendChild(box);
      var go = foot(host, 'I have read it', stage2, { disabled: true });
      setTimeout(function () { go.disabled = false; }, S.opt('presenter') ? 0 : 15000);
      var hint = h('span.small.muted', 'Read for at least 15 seconds.');
      go.before(hint);
      function stage2() {
        host.innerHTML = '';
        host.append.apply(host, head('How well did you understand it?', '1 = not at all, 7 = completely.'));
        var row = h('div.scale-row');
        for (var i = 1; i <= 7; i++) (function (n) {
          var b = h('button', { type: 'button' }, String(n));
          b.addEventListener('click', function () { rating = n; U.$$('button', row).forEach(function (x) { x.classList.toggle('on', +x.textContent === n); }); next.disabled = false; });
          row.appendChild(b);
        })(i);
        host.appendChild(h('div.big-center', row));
        var next = foot(host, 'Next', stage3, { disabled: true });
      }
      function stage3() {
        host.innerHTML = '';
        host.append.apply(host, head('Write down everything you remember', 'Your own words are fine. Then tick the ideas you actually included.'));
        var ta = h('textarea.write', { style: { minHeight: '140px' }, placeholder: 'Write what you remember...' });
        host.appendChild(ta);
        var list = h('ul.checklist', BJ_UNITS.map(function (u) { return h('li', h('label', h('input', { type: 'checkbox' }), h('span', u))); }));
        var reveal = h('button.btn', { type: 'button' }, 'Show the idea units');
        var unitsBox = h('div', { hidden: true }, h('p.small.muted', 'Score yourself honestly, like Bransford and Johnson\'s independent judges: tick an idea only if your writing contains it.'), list);
        reveal.addEventListener('click', function () {
          if (U.words(ta.value).length < 5) { U.toast('Write at least a few words first.'); return; }
          ta.readOnly = true; reveal.remove(); unitsBox.hidden = false; fin.disabled = false;
        });
        host.append(reveal, unitsBox);
        var fin = foot(host, 'See the results', function () {
          var recalled = U.$$('input:checked', list).length;
          var html = '<b>Your group: ' + (cond === 'before' ? 'topic given before reading' : 'no topic') + '.</b> You rated your understanding ' + rating + ' of 7 and recalled ' + recalled + ' of 10 idea units. The passage was about <b>' + BJ_TITLE.toLowerCase() + '</b>.<br><br>' +
            'Bransford and Johnson (1972) gave 52 participants a vague passage (really about washing clothes). Those told the topic <b>before</b> rated it much easier to understand and recalled roughly twice as many of the 18 idea units as those given no topic. Those told the topic <b>after</b> reading did no better than the no-topic group.<br><br>' +
            '<b>Conclusion:</b> a schema helps only if it is activated <b>at encoding</b>. Having the knowledge is not enough. <span class="muted">Your result is one data point. Compare with classmates in the other group.</span>';
          var qs = [
            { id: 'bj1', t: 'schema', q: 'In Bransford and Johnson (1972), which group recalled the most?', a: 'Topic given before the passage', d: ['Topic given after the passage', 'No topic at all', 'All three groups were equal'], why: 'Only the topic-before group could use the schema while encoding.' },
            { id: 'bj2', t: 'schema', q: 'Why did the topic-after group not improve?', a: 'The schema came too late to organise encoding', d: ['They had not heard the passage', 'The topic confused them', 'They were not randomly allocated'], why: 'Activating a schema after encoding cannot organise information that was never structured on the way in.' }
          ];
          host.innerHTML = '';
          host.append.apply(host, head('Bransford and Johnson', null));
          host.appendChild(h('div.drill-result', { html: html }));
          var qhost = h('div.qte-host');
          host.appendChild(qhost);
          var score = 0;
          QB.ask(qhost, qs[0], { noRecord: true, timer: 0, label: 'Check 1 of 2' }).then(function (r) { if (r.aborted) return;
            if (r.correct) score++;
            return QB.ask(qhost, qs[1], { noRecord: true, timer: 0, label: 'Check 2 of 2' });
          }).then(function (r) {
            if (!r || r.aborted) return;
            if (r.correct) score++;
            resolve({ score: score, max: 2 });
          });
        }, { disabled: true });
      }
    });
  };

  /* ---------- schema: Bartlett-style reconstruction ---------- */
  var TALE = [
    { orig: 'Two brothers went down to the shore at dusk to gather salt.', fam: 'Two brothers went down to the shore at dusk to go fishing.', rat: 'Two brothers went down to the shore at dusk because their mother had sent them for salt.' },
    { orig: 'Out of the fog came the sound of many oars, and singing.', fam: 'Out of the fog came the sound of a boat, and voices.', rat: 'Out of the fog came the sound of oars, and singing, as fishermen sing to keep time.' },
    { orig: 'The singers said: "Come with us. We go to trade with the people above the cliff."', fam: 'The singers said: "Come with us. We are going to the market in the next town."', rat: 'The singers said: "Come with us," because they needed more hands to row.' },
    { orig: 'The elder brother said: "I have no gift to bring." They answered: "Gifts are in the boat."', fam: 'The elder brother said: "I have no money." They answered: "We will pay for you."', rat: 'The elder brother went, since he thought the strangers looked friendly.' },
    { orig: 'At the cliff the singers climbed without ropes, and one of them said: "Quick, go back. The brother has been touched."', fam: 'At the cliff there was a fight, and someone shouted that the brother had been hurt.', rat: 'At the cliff the singers climbed, and the brother, who was tired, slipped.' },
    { orig: 'At dawn he sat down, something white came out of his mouth, and his shadow left before him. He was dead.', fam: 'At dawn he sat down, he felt ill, and he died.', rat: 'At dawn he sat down and died of his wounds, as he had been hit in the fight.' }
  ];
  var TALE_FULL = TALE.map(function (t) { return t.orig; }).join(' ') + ' The younger brother, who had gone home, told their mother: "He went with the singers." She said nothing, and covered the fire.';
  D.bartlett = function (cfg, host) {
    return new Promise(function (resolve) {
      host.append.apply(host, head('A tale from an unfamiliar shore', 'Read this story once, carefully. It comes from a place with customs you do not know. You will be asked about it shortly.'));
      host.appendChild(h('div.passage', TALE_FULL));
      var go = foot(host, 'I have read it', function () { fillerThen(host, test); }, { disabled: true });
      setTimeout(function () { go.disabled = false; }, S.opt('presenter') ? 0 : 20000);
      go.before(h('span.small.muted', 'Read for at least 20 seconds.'));
      function test() {
        var i = 0, score = 0, drift = 0;
        host.innerHTML = '';
        host.append.apply(host, head('Which version was in the story?', 'For each part, pick the sentence you read. Go with your memory.'));
        var box = h('div');
        host.appendChild(box);
        (function next() {
          if (i >= TALE.length) return done();
          var t = TALE[i++];
          box.innerHTML = '';
          var opts = U.shuffle([{ s: t.orig, k: 'orig' }, { s: t.fam, k: 'fam' }, { s: t.rat, k: 'rat' }]);
          box.append(h('p.small.muted', 'Part ' + i + ' of ' + TALE.length), h('div.qte-opts', { style: { gridTemplateColumns: '1fr' } }, opts.map(function (o) {
            return h('button.qte-opt', { type: 'button', onclick: function () { if (o.k === 'orig') score++; else drift++; AUDIO.sfx('tap', 0.3); next(); } }, h('span.qte-text', o.s));
          })));
        })();
        function done() {
          var html = '<b>You picked the original version ' + score + ' times out of ' + TALE.length + '.</b> ' +
            (drift ? 'The other ' + drift + ' times you chose a version that was more <b>familiar</b> (salt became fishing, a gift became money) or more <b>rational</b> (a reason was added so it "makes sense"). ' : 'A remarkable memory. Most people drift towards the familiar. ') +
            '<br><br>This is a small version of Bartlett (1932). British participants retold "The War of the Ghosts", a Native American legend, by <b>repeated</b> and <b>serial reproduction</b>. Over retellings the story got shorter (<b>levelling</b>), details were reshaped towards the familiar ("canoe" became "boat"; hunting seals became fishing), and strange parts were explained away to fit British expectations (<b>rationalisation</b>). The main themes survived.<br><br>' +
            '<b>Conclusion:</b> memory is reconstructive, an "effort after meaning" shaped by schemas. <span class="muted">Evaluation: Bartlett\'s procedure was not standardised and he scored recall himself, so reliability and researcher bias are concerns. His sample was only British.</span>';
          finishView(host, 'Reconstructive memory', html, score, TALE.length, resolve);
        }
      }
    });
  };

  /* ---------- MSM: Sperling-style flash ---------- */
  var LETTERS = 'BCDFGHJKLMNPRSTVXZ';
  function grid3x4() { return [0, 1, 2].map(function () { return U.shuffle(LETTERS.split('')).slice(0, 4); }); }
  D.flash = function (cfg, host) {
    return new Promise(function (resolve) {
      var trials = ['whole', 'partial', 'whole', 'partial', 'partial'];
      var res = { whole: [], partial: [] };
      var ti = 0;
      host.append.apply(host, head('The flash of letters', 'Twelve letters will flash for a fifth of a second. Sometimes you report as many as you can (whole report). Sometimes a cue tells you which row to report, just after the letters vanish (partial report).'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      var start = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start');
      stage.appendChild(start);
      start.addEventListener('click', trial);
      function trial() {
        if (ti >= trials.length) return done();
        var kind = trials[ti++];
        var g = grid3x4();
        stage.innerHTML = '';
        var gridEl = h('div.flash-grid.masked', [].concat(g[0], g[1], g[2]).map(function (l) { return h('span', l); }));
        var cue = h('div.row-cue', kind === 'whole' ? 'Whole report: remember as many as you can' : 'Partial report: watch for the row cue');
        stage.append(h('p.small.muted', 'Trial ' + ti + ' of ' + trials.length), cue, gridEl, h('p.small.muted', 'Get ready...'));
        setTimeout(function () {
          gridEl.classList.remove('masked');
          setTimeout(function () {
            gridEl.classList.add('masked');
            var row = Math.floor(Math.random() * 3);
            if (kind === 'partial') { cue.textContent = 'Report the ' + ['TOP', 'MIDDLE', 'BOTTOM'][row] + ' row'; AUDIO.sfx(['count', 'tick', 'dial'][row]); }
            else cue.textContent = 'Type every letter you saw';
            var input = h('input', { type: 'text', autocapitalize: 'characters', autocomplete: 'off', spellcheck: 'false', style: { fontSize: '24px', textAlign: 'center', letterSpacing: '.2em', maxWidth: '320px' } });
            var ok = h('button.btn.btn-primary', { type: 'button' }, 'Enter');
            stage.lastChild.replaceWith(h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
            input.focus();
            function submit() {
              var typed = input.value.toUpperCase().replace(/[^A-Z]/g, '').split('');
              var target = kind === 'partial' ? g[row] : [].concat(g[0], g[1], g[2]);
              var hit = 0;
              target.forEach(function (l) { var k = typed.indexOf(l); if (k >= 0) { hit++; typed.splice(k, 1); } });
              res[kind].push(kind === 'partial' ? hit * 3 : hit);
              trial();
            }
            ok.addEventListener('click', submit);
            input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
          }, 200);
        }, 1100);
      }
      function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
      function done() {
        var w = avg(res.whole), p = avg(res.partial);
        var html = '<b>Whole report: about ' + w.toFixed(1) + ' letters. Partial report estimate: about ' + p.toFixed(1) + ' of 12 available</b> (letters right in the cued row, times three).<br><br>' +
          'Sperling (1960) found the same pattern. People can usually report only about four letters in whole report, yet they can report almost any cued row, so much more of the display must have been briefly available. The trace fades so fast that it is gone while you are still naming the first few.<br><br>' +
          '<b>Conclusion:</b> sensory memory (here, <b>iconic</b> memory) is high-capacity but extremely short-lived, a fraction of a second. In the multi-store model, only what gets <b>attention</b> passes on to short-term memory. <span class="muted">A browser is not a tachistoscope: this is a demonstration, not a measurement.</span>';
        finishView(host, 'Iconic memory', html, 1, 1, resolve);
      }
    });
  };

  /* ---------- MSM: digit span and chunking ---------- */
  D.span = function (cfg, host) {
    return new Promise(function (resolve) {
      host.append.apply(host, head('Digit span', 'Digits appear one at a time. Type them back in order. The list grows until you miss twice at the same length.'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      var len = 4, fails = 0, best = 3;
      var start = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start');
      stage.appendChild(start);
      start.addEventListener('click', round);
      function round() {
        var seq = [];
        for (var i = 0; i < len; i++) seq.push(Math.floor(Math.random() * 10));
        stage.innerHTML = '';
        var show = h('div.word-big', '');
        stage.append(h('p.small.muted', len + ' digits'), show);
        var k = 0;
        (function tick() {
          if (k < seq.length) { show.textContent = String(seq[k++]); AUDIO.sfx('tick', 0.25); setTimeout(function () { show.textContent = ''; setTimeout(tick, 250); }, 750); return; }
          var input = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', style: { fontSize: '26px', textAlign: 'center', letterSpacing: '.25em', maxWidth: '320px' } });
          var ok = h('button.btn.btn-primary', { type: 'button' }, 'Enter');
          stage.append(h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
          input.focus();
          function submit() {
            var right = input.value.replace(/\D/g, '') === seq.join('');
            AUDIO.sfx(right ? 'correct' : 'wrong', 0.35);
            if (right) { best = Math.max(best, len); len++; fails = 0; }
            else { fails++; if (fails >= 2) return chunk(); }
            if (len > 11) return chunk();
            round();
          }
          ok.addEventListener('click', submit);
          input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
        })();
      }
      function chunk() {
        stage.innerHTML = '';
        var years = U.shuffle(['1066', '1492', '1789', '1945', '2001', '1969']).slice(0, 3);
        var digits = years.join('');
        stage.append(h('p.lede', 'Your span: ' + best + ' digits. Now remember this 12-digit number for ten seconds:'),
          h('div.word-big', { style: { fontSize: '40px' } }, years.join(' ')), h('p.small.muted', 'Hint: they are famous years.'));
        setTimeout(function () {
          stage.innerHTML = '';
          var input = h('input', { type: 'text', inputmode: 'numeric', style: { fontSize: '24px', textAlign: 'center', maxWidth: '360px' } });
          var ok = h('button.btn.btn-primary', { type: 'button' }, 'Enter');
          stage.append(h('p.lede', 'Type all twelve digits.'), h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
          input.focus();
          ok.addEventListener('click', function () {
            var right = input.value.replace(/\D/g, '') === digits;
            var html = '<b>Your digit span was ' + best + '.</b> ' + (right ? 'And you held all twelve digits of the years.' : 'The twelve digits were ' + digits + '.') + '<br><br>' +
              'Miller (1956) described short-term memory capacity as about <b>seven, plus or minus two</b> items. But an item is not a digit: <b>chunking</b> groups several symbols into one meaningful unit, so twelve digits can become three chunks. That is why a numerical limit is only a rough description. Later work (Cowan, 2010) suggests the true capacity may be nearer <b>three to five</b> chunks when people cannot use strategies.<br>' +
              '<span class="muted">Digit span is not a score of how clever you are, and one attempt is noisy.</span>';
            finishView(host, 'Capacity and chunking', html, 1, 1, resolve);
          });
        }, S.opt('presenter') ? 2000 : 10000);
      }
    });
  };

  /* ---------- MSM: serial position (Glanzer and Cunitz style) ---------- */
  var WORDS = ['oar', 'goat', 'lamp', 'shield', 'grape', 'rope', 'bread', 'coin', 'sail', 'harp', 'wolf', 'cup', 'drum', 'bee', 'ring', 'tent', 'fig', 'bow', 'jar', 'owl', 'net', 'cart', 'wheel', 'bell'];
  D.serial = function (cfg, host) {
    return new Promise(function (resolve) {
      var pool = U.shuffle(WORDS);
      var lists = [pool.slice(0, 12), pool.slice(12, 24)];
      var conds = U.shuffle(['immediate', 'delay']);
      var curves = {};
      var li = 0;
      host.append.apply(host, head('The serial position curve', 'Twelve words appear one at a time. Then type all the words you remember, in any order. You will do this twice.'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      var start = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start list 1');
      stage.appendChild(start);
      start.addEventListener('click', present);
      function present() {
        var list = lists[li], cond = conds[li];
        stage.innerHTML = '';
        var w = h('div.word-big', '');
        stage.append(h('p.small.muted', 'List ' + (li + 1) + ' of 2'), w);
        var k = 0;
        (function tick() {
          if (k < list.length) { w.textContent = list[k++]; setTimeout(function () { w.textContent = ''; setTimeout(tick, 300); }, 1000); return; }
          if (cond === 'delay') countdown(recall); else recall();
        })();
      }
      function countdown(then) {
        stage.innerHTML = '';
        var n = 90 + Math.floor(Math.random() * 60);
        var end = Date.now() + 15000;
        var box = h('div.big-center');
        stage.append(h('p.lede', 'Count backwards in threes. Pick the next number.'), box);
        (function next() {
          if (Date.now() > end) { then(); return; }
          box.innerHTML = '';
          var ans = n - 3;
          box.append(h('div.word-big', String(n)), h('div.btn-row', U.shuffle([ans, ans - 1, ans + 2]).map(function (o) {
            return h('button.btn.btn-lg', { type: 'button', onclick: function () { if (o === ans) n = ans; AUDIO.sfx('tap', 0.3); next(); } }, String(o));
          })));
        })();
      }
      function recall() {
        var list = lists[li], cond = conds[li];
        stage.innerHTML = '';
        var ta = h('textarea.write', { style: { minHeight: '120px', maxWidth: '520px' }, placeholder: 'Type the words you remember, separated by spaces or commas' });
        var ok = h('button.btn.btn-primary', { type: 'button' }, 'Done');
        stage.append(h('p.lede', 'Type every word you remember.'), ta, ok);
        ta.focus();
        ok.addEventListener('click', function () {
          var typed = ta.value.toLowerCase().split(/[^a-z]+/).filter(Boolean);
          curves[cond] = list.map(function (wd) { return typed.indexOf(wd) >= 0 ? 1 : 0; });
          li++;
          if (li < 2) {
            stage.innerHTML = '';
            var b = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start list 2');
            b.addEventListener('click', present);
            stage.append(h('p.lede', 'List 1 done.'), b);
          } else done();
        });
      }
      function done() {
        function thirds(a) { return [a.slice(0, 4), a.slice(4, 8), a.slice(8)].map(function (x) { return x.reduce(function (p, q) { return p + q; }, 0); }); }
        var imm = thirds(curves.immediate), del = thirds(curves.delay);
        var chart = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '640px', margin: '0 auto 26px' } },
          [['Immediate recall', imm], ['After 15 s of counting', del]].map(function (x) {
            return h('div', h('p.small', { style: { textAlign: 'center' } }, x[0]), h('div.chart', x[1].map(function (v, i) {
              return h('div.bar', { style: { height: Math.max(3, v / 4 * 100) + '%' } }, h('span', ['First 4', 'Middle 4', 'Last 4'][i]));
            })));
          }));
        var html = '<b>Immediate: first ' + imm[0] + '/4, middle ' + imm[1] + '/4, last ' + imm[2] + '/4. After counting: first ' + del[0] + '/4, middle ' + del[1] + '/4, last ' + del[2] + '/4.</b><br><br>' +
          'The usual pattern is a U-shape: early words are recalled well (<b>primacy</b>, rehearsed into long-term memory) and so are the last words (<b>recency</b>, still in short-term memory). Glanzer and Cunitz (1966) had 46 army men recall 15-word lists, either immediately or after counting for 10 or 30 seconds. A 10-second delay sharply reduced recency and a 30-second delay removed it, but primacy was left intact.<br><br>' +
          '<b>Conclusion:</b> this supports separate short-term and long-term stores, as the multi-store model claims. <span class="muted">One run of 12 words is very noisy; the class pattern matters more.</span>';
        finishView(host, 'Primacy and recency', html, 1, 1, resolve, chart);
      }
    });
  };

  /* ---------- WMM: twin tasks (Landry and Bartling style) ---------- */
  var LB_LETTERS = 'FKLMRXQ'.split('');
  D.dualtask = function (cfg, host) {
    return new Promise(function (resolve) {
      var order = U.shuffle(['quiet', 'suppress']);
      var res = { quiet: [], suppress: [] };
      var block = 0, trial = 0;
      host.append.apply(host, head('Twin tasks', 'Seven letters appear for five seconds, then vanish for five seconds. Type them back in order. In one block you stay silent. In the other you must say "one, two, one, two" out loud, about two numbers a second, from the moment the letters appear until you finish typing. Be honest: it only works if you really say it.'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      intro();
      function intro() {
        stage.innerHTML = '';
        var cond = order[block];
        var b = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start block ' + (block + 1));
        b.addEventListener('click', run);
        stage.append(h('p.lede', cond === 'quiet' ? 'Block ' + (block + 1) + ': stay silent.' : 'Block ' + (block + 1) + ': say "one, two, one, two" out loud the whole time.'), b);
      }
      function run() {
        var cond = order[block];
        var seq = U.shuffle(LB_LETTERS);
        stage.innerHTML = '';
        var say = cond === 'suppress' ? h('div.row-cue', 'Say: one, two, one, two...') : h('div.row-cue', 'Silent');
        var letters = h('div.word-big', seq.join(' '));
        stage.append(h('p.small.muted', 'Trial ' + (trial + 1) + ' of 3'), say, letters);
        setTimeout(function () {
          letters.textContent = '';
          setTimeout(function () {
            var input = h('input', { type: 'text', autocapitalize: 'characters', autocomplete: 'off', style: { fontSize: '26px', textAlign: 'center', letterSpacing: '.3em', maxWidth: '320px' } });
            var ok = h('button.btn.btn-primary', { type: 'button' }, 'Enter');
            stage.append(h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
            input.focus();
            function submit() {
              var typed = input.value.toUpperCase().replace(/[^A-Z]/g, '').split('');
              var right = seq.filter(function (l, i) { return typed[i] === l; }).length;
              res[cond].push(right / 7);
              trial++;
              if (trial < 3) run();
              else { trial = 0; block++; if (block < 2) intro(); else done(); }
            }
            ok.addEventListener('click', submit);
            input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
          }, 5000);
        }, 5000);
      }
      function done() {
        function pct(a) { return Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length * 100); }
        var q = pct(res.quiet), s = pct(res.suppress);
        var chart = h('div.chart', { style: { maxWidth: '420px', margin: '0 auto 26px' } },
          [['You: silent', q], ['You: "one, two"', s], ['L&B: control', 76], ['L&B: suppression', 45]].map(function (x) {
            return h('div.bar', { style: { height: Math.max(3, x[1]) + '%' } }, h('span', x[0] + ' ' + x[1] + '%'));
          }));
        var html = '<b>Letters in the right position: ' + q + '% silent, ' + s + '% while saying "one, two".</b><br><br>' +
          'Landry and Bartling (2011) tested 34 psychology students (17 per group) on lists of seven letters from F, K, L, M, R, X and Q. The suppression group recalled <b>45%</b> correctly against <b>76%</b> for the control group (p ≤ 0.01).<br><br>' +
          '<b>Why:</b> saying "one, two" occupies the <b>articulatory control process</b> (the inner voice), so the letters cannot be rehearsed and fade from the <b>phonological store</b> within about two seconds. Two verbal tasks compete for the same component of working memory. That is the logic of the dual-task method behind Baddeley and Hitch\'s (1974) model. <span class="muted">You did both conditions (repeated measures); the original used independent samples.</span>';
        finishView(host, 'Articulatory suppression', html, 1, 1, resolve, chart);
      }
    });
  };

  /* ---------- DPT: reflection puzzles ---------- */
  var CRT = [
    { q: 'A sail and an oar cost 110 drachmae together. The sail costs 100 drachmae more than the oar. How many drachmae does the oar cost?', a: 5, lure: 10 },
    { q: 'If 5 shipwrights take 5 days to build 5 boats, how many days would 100 shipwrights take to build 100 boats?', a: 5, lure: 100 },
    { q: 'A patch of seaweed doubles in size every day. It takes 48 days to cover the whole lagoon. How many days does it take to cover half the lagoon?', a: 47, lure: 24 }
  ];
  D.crt = function (cfg, host) {
    return new Promise(function (resolve) {
      var i = 0, score = 0, lured = 0;
      var answers = [];
      host.append.apply(host, head('Fast and slow', 'Three puzzles. Type a number. The first answer that comes to mind is not always right.'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      (function next() {
        if (i >= CRT.length) return done();
        var c = CRT[i++];
        stage.innerHTML = '';
        var input = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', style: { fontSize: '26px', textAlign: 'center', maxWidth: '200px' } });
        var ok = h('button.btn.btn-primary', { type: 'button' }, 'Answer');
        stage.append(h('p.small.muted', 'Puzzle ' + i + ' of 3'), h('p.qte-q', { style: { maxWidth: '720px' } }, c.q), h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
        input.focus();
        function submit() {
          var v = parseFloat(input.value.replace(',', '.'));
          if (isNaN(v)) return;
          if (v === c.a) score++; else if (v === c.lure) lured++;
          answers.push({ c: c, v: v });
          AUDIO.sfx('tap', 0.3);
          next();
        }
        ok.addEventListener('click', submit);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      })();
      function done() {
        var html = '<b>' + score + ' of 3 correct.</b> ' + (lured ? 'You gave the tempting answer ' + lured + ' time' + (lured > 1 ? 's' : '') + '. ' : '') + '<br>' +
          answers.map(function (x) { return 'Answer: <b>' + x.c.a + '</b> (the answer that springs to mind is ' + x.c.lure + '). You said ' + x.v + '.'; }).join('<br>') + '<br><br>' +
          'These puzzles copy the design of Frederick\'s (2005) Cognitive Reflection Test. <b>System 1</b> is fast, automatic and effortless, and it hands you an answer that <i>feels</i> right. <b>System 2</b> is slow and effortful; it checks, but only if it is called in. Because we are cognitive misers, it often is not. Time pressure and high cognitive load make this worse. <span class="muted">Getting one wrong says nothing about intelligence; many students at top universities fall for the first puzzle.</span>';
        finishView(host, 'System 1 and System 2', html, score, 3, resolve);
      }
    });
  };

  /* ---------- biases: anchoring ---------- */
  D.anchor = function (cfg, host) {
    return new Promise(function (resolve) {
      var high = Math.random() < 0.5;
      var anchor = high ? 6000 : 800;
      host.append.apply(host, head("Poseidon's wheel", 'Spin the wheel. Then answer a question about Mount Olympus.'));
      var stage = h('div.big-center');
      host.appendChild(stage);
      var num = h('div.word-big', '????');
      var spin = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Spin');
      stage.append(num, spin);
      spin.addEventListener('click', function () {
        spin.disabled = true;
        var n = 0;
        var iv = setInterval(function () { num.textContent = String(100 + Math.floor(Math.random() * 9000)); AUDIO.sfx('tick', 0.2); if (++n > 16) { clearInterval(iv); num.textContent = String(anchor); ask(); } }, 90);
      });
      function ask() {
        var hi = h('button.btn.btn-lg', { type: 'button' }, 'Higher');
        var lo = h('button.btn.btn-lg', { type: 'button' }, 'Lower');
        stage.append(h('p.lede', 'Is Mount Olympus higher or lower than ' + anchor + ' metres?'), h('div.btn-row', hi, lo));
        hi.onclick = lo.onclick = estimate;
      }
      function estimate() {
        stage.innerHTML = '';
        var input = h('input', { type: 'text', inputmode: 'numeric', style: { fontSize: '26px', textAlign: 'center', maxWidth: '220px' } });
        var ok = h('button.btn.btn-primary', { type: 'button' }, 'Estimate');
        stage.append(h('p.lede', 'Your best estimate: how high is Mount Olympus, in metres?'), h('div.btn-row', { style: { justifyContent: 'center' } }, input, ok));
        input.focus();
        ok.addEventListener('click', function () {
          var v = parseInt(input.value.replace(/\D/g, ''), 10);
          if (isNaN(v)) return;
          var html = '<b>Your wheel showed ' + anchor + '. You estimated ' + v + ' m. Mount Olympus is 2,918 m.</b><br><br>' +
            'Half of the players see 800 and half see 6000, at random. Across a class, people who saw 6000 usually give much higher estimates than people who saw 800, even though a wheel obviously cannot know the answer. That is <b>anchoring bias</b>: the first number becomes a starting point, and we adjust away from it, but not far enough.<br><br>' +
            'Tversky and Kahneman (1974) showed it with a five-second estimate of 8×7×6×5×4×3×2×1 (median guess 2,250) versus 1×2×3×4×5×6×7×8 (median 512); the answer is 40,320. Strack and Mussweiler (1997) found the same with absurd anchors, and studies of judges\' sentencing (Englich and colleagues) show that experts are affected too. <span class="muted">One person cannot show the effect: compare your estimate with classmates who saw the other number.</span>';
          finishView(host, 'Anchoring bias', html, 1, 1, resolve);
        });
      }
    });
  };

  /* ---------- Ithaca: Penelope tests the stranger's memory of his own voyage ---------- */
  // Fallbacks come from the Ithaca episode itself, so a student who jumped in has seen them.
  var FALLBACK = [
    { q: 'Who disguised you as a beggar when you landed on Ithaca?', a: 'Athena', d: ['Hermes', 'Circe', 'Penelope'] },
    { q: 'Who mocked the beggar in your hall?', a: 'Antinous', d: ['Eurylochus', 'Polites', 'Tiresias'] },
    { q: "What was Penelope's contest?", a: 'String the bow and shoot through twelve axes', d: ['Wrestle every suitor in turn', 'Answer three riddles from the Oracle', 'Sail around the island by nightfall'] },
    { q: 'What did you tell Athena the suitors would know?', a: 'My face', d: ['My voice', 'My sword', 'My ship'] }
  ];
  function choiceDefs() {
    var defs = {};
    ODY.episodeOrder.forEach(function (id) {
      ODY.episodes[id].script.forEach(function (s) {
        if (s && typeof s === 'object' && s.choice && s.choice.id && s.choice.ask) defs[id + ':' + s.choice.id] = s.choice;
      });
    });
    return defs;
  }
  D.penelope = function (cfg, host) {
    return new Promise(function (resolve) {
      var run = S.run();
      var defs = choiceDefs();
      var own = Object.keys(run.choices || {}).filter(function (k) { return defs[k]; }).map(function (k) {
        var c = defs[k];
        var opts = c.opts.map(function (o) { return o.t.replace(/\*/g, ''); });
        if (c.silence) opts.push(c.silence.t);
        var mine = run.choices[k];
        return { q: c.ask, a: mine, d: U.shuffle(opts.filter(function (o) { return o !== mine; })).slice(0, 3), own: true };
      }).filter(function (x) { return x.d.length; });
      var qs = U.shuffle(own).slice(0, 3);
      U.shuffle(FALLBACK).forEach(function (f) { if (qs.length < 3) qs.push(f); });
      var i = 0, score = 0;
      host.append.apply(host, head("Penelope's test", 'She asks about your voyage. Not the poem: what **you** did on this one.'));
      var qhost = h('div.qte-host');
      host.appendChild(qhost);
      (function next() {
        if (i >= qs.length) return done();
        var x = qs[i++];
        QB.ask(qhost, { id: 'pen', t: 'schema', q: x.q, a: x.a, d: x.d, why: x.own ? 'That is what you chose, on this voyage.' : 'That is how the voyage went.' }, { noRecord: true, timer: 0, label: 'Penelope asks (' + i + ' of ' + qs.length + ')' })
          .then(function (r) { if (r.aborted) return; if (r.correct) score++; next(); });
      })();
      function done() {
        var ok = score >= 2;
        var html = '<b>You remembered ' + score + ' of ' + qs.length + ' correctly.</b> ' + (ok ? 'Penelope is almost convinced.' : 'Penelope is not convinced.') + '<br><br>' +
          'Remembering your own choices feels like replaying a recording. It is not. Each time a memory is recalled it is rebuilt from fragments, and filled in from what usually happens, what you wish had happened, or what makes a good story. That is Bartlett\'s reconstructive memory, and it is exactly what Penelope is testing.';
        finishView(host, "Penelope's test", html, score, qs.length, function (res) {
          resolve({ score: res.score, max: res.max, flags: ok ? { penelope_ok: true } : { penelope_doubt: true } });
        });
      }
    });
  };

  /* ---------- biases: the 2-4-6 task ---------- */
  D.rule246 = function (cfg, host) {
    return new Promise(function (resolve) {
      var tests = [];
      function fits(a, b, c) { return a < b && b < c; }
      host.append.apply(host, head("The Oracle's rule", 'The numbers **2, 4, 6** follow the Oracle\'s secret rule. Test any three numbers and the Oracle will say whether they fit. When you are sure, name the rule.'));
      var a = h('input', { type: 'text', inputmode: 'numeric' }), b = h('input', { type: 'text', inputmode: 'numeric' }), c = h('input', { type: 'text', inputmode: 'numeric' });
      var test = h('button.btn.btn-primary', { type: 'button' }, 'Test');
      var log = h('div.rule-log');
      var guess = h('button.btn', { type: 'button' }, 'I know the rule');
      host.appendChild(h('div.big-center', h('div.triple', a, b, c, test), log, guess));
      function run() {
        var x = parseFloat(a.value), y = parseFloat(b.value), z = parseFloat(c.value);
        if ([x, y, z].some(isNaN)) { U.toast('Enter three numbers.'); return; }
        var ok = fits(x, y, z);
        tests.push({ x: x, y: y, z: z, ok: ok, plus2: (y - x === 2 && z - y === 2) });
        log.prepend(h('div', x + ', ' + y + ', ' + z + ': ' + (ok ? 'fits the rule' : 'does not fit')));
        AUDIO.sfx(ok ? 'correct' : 'wrong', 0.3);
        a.value = b.value = c.value = '';
        a.focus();
      }
      test.addEventListener('click', run);
      [a, b, c].forEach(function (inp) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); }); });
      guess.addEventListener('click', function () {
        host.innerHTML = '';
        var q = { id: 'r246', t: 'biases', q: 'What is the Oracle\'s rule?', a: 'Any three numbers in increasing order', d: ['Even numbers going up by two', 'Numbers going up by the same amount each time', 'Three numbers that add up to an even total'],
          why: 'The rule was simply "increasing". Most people only test triples that fit their first idea (up by two), so they never find that out.' };
        var qhost = h('div.qte-host');
        host.append.apply(host, head("Name the Oracle's rule", null));
        host.appendChild(qhost);
        QB.ask(qhost, q, { noRecord: true, timer: 0, label: 'Your answer' }).then(function (r) { if (r.aborted) return;
          var confirm = tests.filter(function (t) { return t.ok; }).length;
          var plus2 = tests.filter(function (t) { return t.plus2; }).length;
          var html = '<b>You ran ' + tests.length + ' tests. ' + confirm + ' fitted the rule; ' + (tests.length - confirm) + ' did not.</b> ' +
            (plus2 ? plus2 + ' of your tests went up by exactly two, which could only ever confirm the first idea. ' : '') +
            'The rule was just "any increasing numbers".<br><br>' +
            'This is Wason\'s (1960) 2-4-6 task. Only 6 of his 29 participants found the rule at their first announcement. Most tested triples that would <b>confirm</b> their hypothesis, never ones that could <b>disconfirm</b> it. That is <b>confirmation bias</b>: we seek, interpret and remember evidence that supports what we already believe. <span class="muted">The strongest test is one that could prove you wrong.</span>';
          finishView(host, 'Confirmation bias', html, r.correct ? 2 : 0, 2, resolve);
        });
      });
    });
  };
})();
