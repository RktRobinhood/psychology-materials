/* Question bank: Leitner-style spacing, mastery, and the timed question card (QTE).
 * Each question has a box 0-4 in save data. Missed questions drop to box 0 and come
 * back two to four questions later in the same session ("the Oracle remembers"). */
(function () {
  'use strict';
  var Q = window.QB = {};
  var WEIGHT = [9, 6, 3, 1.6, 0.8];
  var session = { recent: [], missed: [], asked: 0 };

  function stat(id) {
    var s = S.data.meta.q[id];
    if (!s) s = S.data.meta.q[id] = { b: 0, n: 0, r: 0 };
    return s;
  }
  Q.byTopic = function (t) { return ODY.questions.filter(function (q) { return q.t === t; }); };

  /* Pick n questions from the given topics, weighted towards low boxes. */
  Q.pick = function (topics, n, opts) {
    opts = opts || {};
    var pool = ODY.questions.filter(function (q) {
      return (!topics || !topics.length || topics.indexOf(q.t) >= 0) &&
        (!opts.maxLv || q.lv <= opts.maxLv) && (!opts.minLv || q.lv >= opts.minLv);
    });
    if (!pool.length) pool = ODY.questions.slice();
    var chosen = [];
    for (var i = 0; i < n; i++) {
      // A missed question returns once a couple of others have gone by.
      var due = session.missed.filter(function (m) {
        return session.asked + chosen.length - m.at >= m.gap && (!topics || !topics.length || topics.indexOf(m.q.t) >= 0);
      })[0];
      if (due && chosen.indexOf(due.q) < 0) {
        session.missed.splice(session.missed.indexOf(due), 1);
        due.q._return = true;
        chosen.push(due.q);
        continue;
      }
      var cand = pool.filter(function (q) { return chosen.indexOf(q) < 0 && session.recent.indexOf(q.id) < 0; });
      if (!cand.length) cand = pool.filter(function (q) { return chosen.indexOf(q) < 0; });
      if (!cand.length) break;
      var total = 0;
      var w = cand.map(function (q) {
        var s = S.data.meta.q[q.id];
        var x = WEIGHT[s ? s.b : 0] * (s && s.n ? 1 : 1.4);
        if (opts.prefLv && q.lv === opts.prefLv) x *= 1.8;
        total += x;
        return x;
      });
      var r = Math.random() * total;
      for (var j = 0; j < cand.length; j++) { r -= w[j]; if (r <= 0) break; }
      var q = cand[Math.min(j, cand.length - 1)];
      q._return = false;
      chosen.push(q);
    }
    return chosen;
  };

  Q.record = function (q, correct) {
    var s = stat(q.id);
    s.n += 1;
    if (correct) { s.r += 1; s.b = Math.min(4, s.b + 1); }
    else {
      s.b = 0;
      session.missed.push({ q: q, at: session.asked, gap: 2 + Math.floor(Math.random() * 3) });
    }
    s.t = Date.now();
    session.asked += 1;
    session.recent.push(q.id);
    if (session.recent.length > 18) session.recent.shift();
    S.save();
  };

  /* Mastery: average box (capped at 3) across a topic's questions. */
  Q.mastery = function (t) {
    var qs = Q.byTopic(t);
    if (!qs.length) return 0;
    var sum = 0;
    qs.forEach(function (q) { var s = S.data.meta.q[q.id]; sum += s ? Math.min(3, s.b) : 0; });
    return sum / (qs.length * 3);
  };
  Q.seen = function (t) {
    return Q.byTopic(t).filter(function (q) { return S.data.meta.q[q.id]; }).length;
  };
  Q.accuracy = function (t) {
    var n = 0, r = 0;
    Q.byTopic(t).forEach(function (q) { var s = S.data.meta.q[q.id]; if (s) { n += s.n; r += s.r; } });
    return n ? r / n : null;
  };
  Q.checkMastery = function () {
    var keys = Object.keys(ODY.topics || {}).filter(function (t) { return Q.byTopic(t).length; });
    var over = keys.filter(function (t) { return Q.mastery(t) >= 0.8; });
    if (over.length) S.award('master1');
    if (keys.length && over.length === keys.length) S.award('master_all');
  };

  /* ---------- the question card ----------
   * host: element to render into. Returns a Promise resolving to
   * {correct, timedOut, skipped, aborted, ms}.
   * opts: {timer (s, 0 = none), items (bool), label, noRecord (bool)}.
   * The card is cancelled (resolves {aborted:true}) by U.cancelActivities(). */
  Q.ask = function (host, q, opts) {
    opts = opts || {};
    var h = U.h;
    var calm = S.opt('calm') || S.opt('presenter') || !opts.timer;
    var limit = calm ? 0 : opts.timer;
    var run = S.run();
    var useItems = opts.items && run;
    var record = !opts.noRecord && !q.noRecord;
    var options = q.tf ? [{ t: 'True', ok: q.a === true }, { t: 'False', ok: q.a === false }]
      : U.shuffle([{ t: q.a, ok: true }].concat(q.d.map(function (d) { return { t: d, ok: false }; })));
    var topicName = (ODY.topics && ODY.topics[q.t] && ODY.topics[q.t].short) || q.t;

    return new Promise(function (resolve) {
      var start = performance.now();
      var frozen = false, done = false, settled = false, remaining = limit, raf = null, lastTs = null, graceUntil = 0;
      var timers = [];
      var key2 = null;
      function settle(r) {
        if (settled) return;
        settled = true;
        unCancel();
        resolve(r);
      }
      function teardown() {
        done = true;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        document.removeEventListener('keydown', onKey);
        if (key2) document.removeEventListener('keydown', key2);
      }
      var unCancel = U.onCancel(function () { teardown(); settle({ aborted: true, correct: false }); });

      host.innerHTML = '';
      var ring = h('div.qte-ring', { role: 'timer', html: '<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="qte-ring-bg" cx="22" cy="22" r="19"/><circle class="qte-ring-fg" cx="22" cy="22" r="19"/></svg><span class="qte-secs"></span>' });
      var secs = ring.querySelector('.qte-secs');
      var fg = ring.querySelector('.qte-ring-fg');
      var head = h('div.qte-head',
        h('span.qte-label', opts.label || 'Quick recall'),
        h('span.qte-topic', topicName),
        q._return ? h('span.qte-return', { title: 'You missed this one earlier. The Oracle remembers.' }, 'The Oracle remembers') : null,
        limit ? ring : h('span.qte-calm', 'No timer'));
      var qEl = h('p.qte-q', { html: U.md(q.q), tabindex: '-1' });
      var grid = h('div.qte-opts' + (q.tf ? '.qte-tf' : ''));
      var btns = options.map(function (o, i) {
        var b = h('button.qte-opt', { type: 'button', 'data-key': i + 1 },
          h('span.qte-key', String(i + 1)), h('span.qte-text', o.t));
        b.addEventListener('click', function () { answer(o, b); });
        grid.appendChild(b);
        return b;
      });
      var itemBar = h('div.qte-items');
      if (useItems) {
        [['owl', 'Remove two wrong answers', q.tf ? null : useOwl], ['wax', 'Stop the clock', limit ? useWax : null], ['bag', 'Skip this question safely', useBag]]
          .forEach(function (it) {
            var n = run.items.filter(function (x) { return x === it[0]; }).length;
            if (!n || !it[2]) return;
            var b = h('button.item-btn', { type: 'button', title: ODY.items[it[0]].name + ': ' + it[1] },
              U.img(ODY.items[it[0]].icon, 'item-img'), h('span', ODY.items[it[0]].name), h('b', 'x' + n));
            b.addEventListener('click', function () { if (!done) { it[2](); b.disabled = true; } });
            itemBar.appendChild(b);
          });
      }
      var fb = h('div.qte-feedback', { 'aria-live': 'polite' });
      var sr = h('span.sr-only', { 'aria-live': 'assertive' });
      host.appendChild(h('div.qte-card', head, qEl, grid, itemBar, fb, sr));
      AUDIO.sfx('notify', 0.4);
      try { qEl.focus({ preventScroll: true }); } catch (e) { /* ignore */ }

      function consume(name) {
        var i = run.items.indexOf(name);
        if (i >= 0) run.items.splice(i, 1);
        S.save();
        if (window.STORY) STORY.hud();
      }
      function useOwl() {
        consume('owl');
        var wrong = btns.filter(function (b, i) { return !options[i].ok; });
        U.shuffle(wrong).slice(0, 2).forEach(function (b) { b.disabled = true; b.classList.add('struck'); });
        AUDIO.sfx('tile');
      }
      function useWax() { consume('wax'); frozen = true; ring.classList.add('frozen'); AUDIO.sfx('tile'); }
      function useBag() {
        consume('bag');
        finish({ correct: false, skipped: true, timedOut: false });
        fb.innerHTML = '<b>A gust carries the ship past.</b> No crew lost, no coins won. The answer was: <b>' + U.esc(q.tf ? String(q.a) : q.a) + '</b>.';
        showContinue(700);
      }

      /* A one-second orientation beat before the clock starts. */
      var warned = false;
      function tick(ts) {
        if (done) return;
        if (!graceUntil) graceUntil = ts + 1000;
        if (ts >= graceUntil) {
          if (lastTs !== null && !frozen) remaining -= (ts - lastTs) / 1000;
          lastTs = ts;
        }
        var frac = U.clamp(remaining / limit, 0, 1);
        fg.style.strokeDashoffset = String(119.4 * (1 - frac));
        secs.textContent = frozen ? '||' : String(Math.ceil(Math.max(0, remaining)));
        ring.classList.toggle('urgent', remaining < 4 && !frozen);
        if (remaining < 5 && !warned && !frozen) { warned = true; sr.textContent = 'Five seconds left'; }
        if (remaining <= 0) {
          AUDIO.sfx('wrong');
          var right = btns[options.findIndex(function (o) { return o.ok; })];
          right.classList.add('right');
          reveal(false, true);
          return;
        }
        raf = requestAnimationFrame(tick);
      }
      if (limit) raf = requestAnimationFrame(tick);

      function onKey(e) {
        if (done) return;
        if (document.querySelector('dialog[open]')) return;
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= btns.length && !btns[n - 1].disabled) { e.preventDefault(); btns[n - 1].click(); }
      }
      document.addEventListener('keydown', onKey);

      function answer(o, b) {
        if (done) return;
        var ok = o.ok;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) btns[options.findIndex(function (x) { return x.ok; })].classList.add('right');
        AUDIO.sfx(ok ? 'correct' : 'wrong');
        reveal(ok, false);
      }
      function reveal(ok, timedOut) {
        if (record) QB.record(q, ok);
        finish({ correct: ok, timedOut: timedOut, skipped: false, q: q });
        fb.className = 'qte-feedback ' + (ok ? 'is-right' : 'is-wrong');
        fb.innerHTML = '<b>' + (ok ? 'Correct.' : (timedOut ? 'Out of time.' : 'Not quite.')) + '</b> ' + U.md(q.why || '');
        showContinue(ok ? 500 : 1400, ok);
      }
      var result = null;
      function finish(r) {
        done = true;
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        btns.forEach(function (b) { b.disabled = true; });
        U.$$('.item-btn', itemBar).forEach(function (b) { b.disabled = true; });
        r.ms = performance.now() - start;
        result = r;
      }
      function showContinue(delay, auto) {
        var go = h('button.btn.btn-primary.qte-go', { type: 'button', disabled: true }, 'Continue');
        fb.appendChild(go);
        function proceed() {
          teardown();
          settle(result);
        }
        key2 = function (e) {
          if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
          if ((e.key === 'Enter' || e.key === ' ') && !go.disabled) { e.preventDefault(); proceed(); }
        };
        timers.push(setTimeout(function () {
          go.disabled = false;
          try { go.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
          document.addEventListener('keydown', key2);
        }, delay));
        go.addEventListener('click', proceed);
        if (auto && S.opt('autoplay')) timers.push(setTimeout(proceed, 2600));
      }
    });
  };
})();
