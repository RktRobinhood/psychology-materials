/* The Oracle's Trials: Paper 1 practice. Write, self-mark against the checklist,
 * then compare with a model. Answers are saved locally and go into the optional progress PDF. */
(function () {
  'use strict';
  var h = U.h;
  var T = window.TRIALS = {};
  var MIN = { A: { words: 60, distinct: 35 }, B: { words: 100, distinct: 55 }, C: { words: 90, distinct: 55 } };
  var MAX = { A: 4, B: 6, C: 15 };
  var MINUTES = { A: 10, B: 15, C: 40 };

  function store() { return S.data.meta.trials; }
  function drafts() { return (S.data.meta.drafts = S.data.meta.drafts || {}); }
  var mockActive = false;
  T.dirty = function () { return mockActive; };
  /* Keep a draft of every text box as the student types. */
  function keepDraft(ta, key) {
    var t = null;
    ta.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { drafts()[key] = ta.value; S.save(); }, 400);
    });
  }
  function every(fn, ms) {
    var iv = setInterval(fn, ms);
    U.onCancel(function () { clearInterval(iv); });
    return iv;
  }
  function find(id) {
    var E = ODY.exam;
    return ['A', 'B', 'C'].reduce(function (f, s) {
      return f || (E[s] || []).filter(function (x) { return x.id === id; }).map(function (x) { return { sec: s, item: x }; })[0];
    }, null);
  }
  T.find = find;
  function topicName(t) { return (ODY.topics[t] || { name: t }).name; }

  function screenEl() {
    STORY.leave();
    AUDIO.stop();
    var v = document.getElementById('view');
    v.innerHTML = '';
    var s = h('section.screen');
    s.appendChild(h('div.screen-bg', { style: { backgroundImage: 'url("assets/scenes/hades' + (window.innerWidth < 900 ? '-sm' : '') + '.webp")' } }));
    var inner = h('div.screen-inner');
    s.appendChild(inner);
    v.appendChild(s);
    return inner;
  }

  T.screen = function (tab) {
    var inner = screenEl();
    var tabs = h('div.tabs');
    var body = h('div');
    [['how', 'How Paper 1 works'], ['A', 'Section A'], ['B', 'Section B'], ['C', 'Section C'], ['mock', 'Mock paper']].forEach(function (x) {
      var b = h('button.tab', { type: 'button', dataset: { tab: x[0] } }, x[1]);
      b.addEventListener('click', function () { show(x[0]); });
      tabs.appendChild(b);
    });
    inner.append(h('p.kicker', 'Paper 1 practice'), h('h1', "The Oracle's Trials"),
      h('p.lede', 'Write real answers, mark them against the examiner\'s checklist, then compare with a model. Your answers are saved on this device, so you can come back to them.'), tabs, body);
    function show(which) {
      U.$$('.tab', tabs).forEach(function (b) { b.classList.toggle('on', b.dataset.tab === which); });
      body.innerHTML = '';
      if (which === 'how') body.appendChild(howView());
      else if (which === 'mock') body.appendChild(mockList());
      else body.appendChild(listView(which));
    }
    show(tab || 'how');
  };

  function howView() {
    var E = ODY.exam;
    var wrap = h('div', { style: { display: 'grid', gap: '16px' } });
    wrap.appendChild(h('p', 'Paper 1 lasts ' + E.format.minutes + ' minutes and is worth ' + (E.format.marks || 35) + ' marks. It is the same paper for SL and HL.'));
    wrap.appendChild(h('div.cards', E.format.sections.map(function (s) {
      return h('div.card', h('span.chip.chip-gold', s.marks + ' marks each · ~' + s.minutes + ' min'), h('h3', s.title), h('p', s.what));
    })));
    wrap.appendChild(h('p.small.muted', 'For this class test, both Section C options come from Learning and Cognition. In the real May exam, the two Section C options come from different contexts.'));
    if (E.bands && E.bands.length) {
      wrap.appendChild(h('h3', 'Section C markbands (paraphrased)'));
      wrap.appendChild(h('table.bands', h('thead', h('tr', h('th', 'Marks'), h('th', 'Knowledge and understanding'), h('th', 'Critical analysis'), h('th', 'Terminology'))),
        h('tbody', E.bands.map(function (b) { return h('tr', h('td', b.range), h('td', b.k), h('td', b.a), h('td', b.t)); }))));
    }
    if (ODY.topics.exam && ODY.topics.exam.key) {
      wrap.appendChild(h('div', h('h3', 'Technique'), h('ul.notes-list', ODY.topics.exam.key.map(function (k) { return h('li', { html: U.md(k) }); }))));
    }
    return wrap;
  }

  function listView(sec) {
    var items = ODY.exam[sec] || [];
    return h('div.cards', items.map(function (it) { return promptCard(sec, it); }));
  }
  function promptCard(sec, it) {
    var done = store()[it.id];
    var c = h('button.card', { type: 'button' },
      h('div', h('span.chip.chip-gold', 'Section ' + sec + ' · ' + MAX[sec] + ' marks'), it.topic ? h('span.chip', topicName(it.topic)) : it.concept ? h('span.chip', it.concept) : null),
      h('h3', { style: { fontSize: '16px' } }, it.q),
      it.stem ? h('p', it.stem.slice(0, 140) + (it.stem.length > 140 ? '...' : '')) : null,
      h('span.small' + (done ? '' : '.muted'), done ? 'Done: you gave yourself ' + done.mark + ' / ' + MAX[sec] : 'Not attempted'));
    c.addEventListener('click', function () { T.attempt(it.id); });
    return c;
  }

  T.forTopic = function (t) {
    var list = [];
    ['A', 'B'].forEach(function (sec) { (ODY.exam[sec] || []).forEach(function (it) { if (it.topic === t) list.push([sec, it]); }); });
    if (!list.length) return h('p.muted', 'This topic has no Section A or B prompt of its own. Try the Section C essays in the Oracle\'s Trials.');
    return h('div', h('p', 'Paper 1 prompts on this topic. Each opens in the Oracle\'s Trials.'), h('div.cards', list.map(function (x) { return promptCard(x[0], x[1]); })));
  };

  function blockPaste(ta) {
    ta.addEventListener('paste', function (e) { e.preventDefault(); S.data.meta.pasteBlocked = (S.data.meta.pasteBlocked || 0) + 1; S.save(); U.toast('Paste is switched off in the Trials. Write it yourself: that is the practice.'); });
    ta.addEventListener('drop', function (e) { e.preventDefault(); });
  }
  function counter(ta, sec, meta, onChange) {
    function upd() {
      var w = U.words(ta.value).length, d = U.distinctWords(ta.value);
      var ok = w >= MIN[sec].words && d >= MIN[sec].distinct;
      meta.textContent = w + ' words' + (ok ? '' : ' (at least ' + MIN[sec].words + ' needed, with ' + MIN[sec].distinct + ' different words)');
      onChange(ok);
    }
    ta.addEventListener('input', upd);
    upd();
  }

  /* ---------- one prompt ---------- */
  T.attempt = function (id) {
    var f = find(id);
    if (!f) return;
    var sec = f.sec, it = f.item;
    var inner = screenEl();
    var prev = store()[id];
    inner.append(h('button.btn.btn-ghost.btn-sm', { type: 'button', html: U.icon('back', 16) + ' All Section ' + sec + ' prompts', onclick: function () { T.screen(sec); } }));
    var timerChip = h('span.timer-chip', U.fmtTime(MINUTES[sec] * 60));
    var startT = null, iv = null;
    var box = h('div.prompt-box', h('div.btn-row', h('span.chip.chip-gold', 'Section ' + sec + ' · ' + MAX[sec] + ' marks · suggested ' + MINUTES[sec] + ' min'), S.opt('calm') ? h('span.small.muted', 'Calm mode: no timer') : timerChip),
      it.stem ? h('p.stem', { style: { marginTop: '10px' } }, it.stem) : null, h('p.q', it.q));
    inner.appendChild(box);
    var ta = h('textarea.write', { placeholder: sec === 'C' ? 'Write your essay, or a detailed plan: introduction, three developed paragraphs, conclusion.' : 'Write your answer here.' });
    if (drafts()[id]) ta.value = drafts()[id];
    else if (prev && prev.text) ta.value = prev.text;
    blockPaste(ta);
    keepDraft(ta, id);
    ta.addEventListener('input', function () {
      if (!startT) {
        startT = Date.now();
        if (!S.opt('calm')) iv = every(function () {
          var left = MINUTES[sec] * 60 - (Date.now() - startT) / 1000;
          timerChip.textContent = left > 0 ? U.fmtTime(left) : 'Time! +' + U.fmtTime(-left);
          if (left < 0) timerChip.style.color = 'var(--bad)';
        }, 1000);
      }
    });
    var meta = h('span');
    var done = h('button.btn.btn-primary', { type: 'button', disabled: true }, 'Finish and mark it');
    inner.append(h('div', { style: { display: 'grid', gap: '8px', marginTop: '14px' } }, ta, h('div.write-meta', meta, h('span', 'Paste is off.'))),
      h('div.btn-row', { style: { marginTop: '10px' } }, done));
    if (sec === 'C' && it.scaffold) {
      inner.appendChild(h('details.study-card', { style: { marginTop: '14px' } }, h('summary', h('b', 'Scaffold: ' + it.scaffold.name)),
        h('ul.notes-list.small', it.scaffold.parts.map(function (p) { return h('li', p); }))));
    }
    counter(ta, sec, meta, function (ok) { done.disabled = !ok; });
    done.addEventListener('click', function () {
      clearInterval(iv);
      var mins = startT ? Math.round((Date.now() - startT) / 60000) : 0;
      markView(inner, sec, it, ta.value, mins);
    });
  };

  function markView(inner, sec, it, text, mins) {
    inner.innerHTML = '';
    inner.append(h('button.btn.btn-ghost.btn-sm', { type: 'button', html: U.icon('back', 16) + ' All Section ' + sec + ' prompts', onclick: function () { T.screen(sec); } }),
      h('div.prompt-box', { style: { marginTop: '12px' } }, it.stem ? h('p.stem', it.stem) : null, h('p.q', it.q)),
      h('div.two-col', { style: { marginTop: '14px' } },
        h('div', h('h3', 'Your answer'), h('div.model', { style: { background: 'rgba(255,255,255,.04)', borderColor: 'rgba(255,255,255,.15)' } }, text),
          h('div.feedback-cta', h('p.small', h('b', 'Want feedback on your own writing? '), 'Get a feedback request to paste into an AI tutor. It tells you roughly where you are and asks questions to help you improve it.'),
            FEEDBACK.button(function () { var st = store()[it.id]; return { sec: sec, item: it, text: text, mins: mins, selfMark: st && st.text === text ? st.mark : null, max: MAX[sec] }; }))),
        checkPart()));
    function checkPart() {
      var list = h('ul.checklist', (it.checklist || []).map(function (c) { return h('li', h('label', h('input', { type: 'checkbox' }), h('span', c))); }));
      var markSel = h('select', {}, h('option', { value: '' }, 'Choose...'), Array.from({ length: MAX[sec] + 1 }, function (_, i) { return h('option', { value: i }, i + ' / ' + MAX[sec]); }));
      var reveal = h('button.btn.btn-primary', { type: 'button', disabled: true }, sec === 'C' ? 'Save and show the model plan' : 'Save and show the model answer');
      markSel.addEventListener('change', function () { reveal.disabled = markSel.value === ''; });
      var out = h('div');
      reveal.addEventListener('click', function () {
        var ticks = U.$$('input:checked', list).length;
        store()[it.id] = { text: text, mark: +markSel.value, ticks: ticks, of: (it.checklist || []).length, at: Date.now(), mins: mins, sec: sec, q: it.q };
        delete drafts()[it.id];
        S.save();
        if (sec === 'A') S.award('trial_a');
        AUDIO.sfx('sigil', 0.4);
        reveal.disabled = true;
        out.innerHTML = '';
        out.append(h('h3', { style: { marginTop: '14px' } }, sec === 'C' ? 'A model plan' : 'A model answer'),
          h('div.model', sec === 'C' ? (it.plan || []).join('\n') : (it.model || '')),
          it.links && it.links.length ? h('div', h('h3', 'Scenario links a top answer uses'), h('ul.notes-list', it.links.map(function (l) { return h('li', l); }))) : null,
          it.evidence && it.evidence.length ? h('div', h('h3', 'Evidence you could use'), h('ul.notes-list', it.evidence.map(function (l) { return h('li', l); }))) : null,
          it.pitfalls && it.pitfalls.length ? h('div', h('h3', 'Where marks are lost'), h('ul.notes-list', it.pitfalls.map(function (l) { return h('li', l); }))) : null,
          sec === 'C' && ODY.exam.stems && ODY.exam.stems[it.concept] ? h('div', h('h3', 'Sentence stems for ' + it.concept), h('ul.notes-list', ODY.exam.stems[it.concept].map(function (l) { return h('li', l); }))) : null,
          h('div.btn-row', { style: { marginTop: '12px' } }, h('button.btn', { type: 'button', onclick: function () { T.attempt(it.id); } }, 'Rewrite it'), h('button.btn.btn-primary', { type: 'button', onclick: function () { T.screen(sec); } }, 'Next prompt')));
      });
      var bandTable = sec === 'C' && ODY.exam.bands ? h('details', { style: { marginTop: '8px' } }, h('summary', 'Section C markbands'), h('table.bands', h('tbody', ODY.exam.bands.map(function (b) { return h('tr', h('td', b.range), h('td', b.k + ' ' + b.a + ' ' + b.t)); })))) : null;
      return h('div', h('h3', 'Mark it like an examiner'),
        it.strands ? h('p.small.muted', 'Strands: ' + it.strands.join(' · ')) : null,
        h('p.small', 'Tick only what your answer actually does.'), list, bandTable,
        h('label.field', { style: { marginTop: '10px' } }, 'Your mark', markSel), h('div.btn-row', { style: { marginTop: '10px' } }, reveal), out);
    }
  }

  /* ---------- mock paper ---------- */
  function mockList() {
    var mocks = ODY.exam.mocks || [];
    var wrap = h('div', { style: { display: 'grid', gap: '14px' } },
      h('p', 'A full paper: two Section A questions, two Section B questions and one Section C essay from a choice of two. Suggested time 90 minutes' + (S.opt('calm') ? ' (Calm mode is on, so there is no clock).' : '. The clock runs, but you can finish late.') + ' For this class test, both Section C options come from Learning and Cognition; in May they come from different contexts.'));
    wrap.appendChild(h('div.cards', mocks.map(function (m, i) {
      var done = store()['mock' + i];
      var c = h('button.card', { type: 'button' }, h('h3', m.title), h('p', 'A: ' + m.A.join(', ') + ' · B: ' + m.B.join(', ') + ' · C: choose ' + m.C.join(' or ')),
        h('span.small' + (done ? '' : '.muted'), done ? 'Done: ' + done.total + ' / 35' : 'Not attempted'));
      c.addEventListener('click', function () { mock(i); });
      return c;
    })));
    return wrap;
  }

  function mock(i) {
    var m = ODY.exam.mocks[i];
    var inner = screenEl();
    var chosenC = null;
    var timer = h('span.timer-chip', '90:00');
    var t0 = Date.now();
    mockActive = true;
    U.onCancel(function () { mockActive = false; });
    var iv = S.opt('calm') ? null : every(function () {
      var left = 90 * 60 - (Date.now() - t0) / 1000;
      timer.textContent = left > 0 ? U.fmtTime(left) : 'Time! +' + U.fmtTime(-left);
    }, 1000);
    inner.append(h('div.btn-row', h('button.btn.btn-ghost.btn-sm', { type: 'button', html: U.icon('back', 16) + ' Leave the mock', onclick: function () { if (confirm('Leave the mock? Your answers are kept as drafts, but the clock will stop.')) { mockActive = false; clearInterval(iv); T.screen('mock'); } } }),
      h('h2', { style: { margin: 0 } }, m.title), S.opt('calm') ? h('span.small.muted', 'Calm mode: no clock') : timer));
    var fields = [];
    var finish = null;
    function check() { if (finish) finish.disabled = !(chosenC && fields.every(function (f) { return f.ok; })); }
    function q(sec, id) {
      var f = find(id);
      if (!f) return null;
      var ta = h('textarea.write', { style: { minHeight: sec === 'C' ? '320px' : '200px' } });
      var dk = 'mock' + i + ':' + id;
      if (drafts()[dk]) ta.value = drafts()[dk];
      blockPaste(ta);
      keepDraft(ta, dk);
      var meta = h('span');
      var entry = { sec: sec, item: f.item, ta: ta, ok: false };
      counter(ta, sec, meta, function (ok) { entry.ok = ok; check(); });
      fields.push(entry);
      return h('div.prompt-box', { style: { marginTop: '14px' } }, h('span.chip.chip-gold', 'Section ' + sec + ' · ' + MAX[sec] + ' marks'),
        f.item.stem ? h('p.stem', { style: { marginTop: '8px' } }, f.item.stem) : null, h('p.q', f.item.q), ta, h('div.write-meta', meta));
    }
    m.A.forEach(function (id) { inner.appendChild(q('A', id)); });
    m.B.forEach(function (id) { inner.appendChild(q('B', id)); });
    var cBox = h('div');
    var pick = h('div.prompt-box', { style: { marginTop: '14px' } }, h('span.chip.chip-gold', 'Section C · 15 marks · choose one'),
      h('div.btn-row', { style: { marginTop: '10px' } }, m.C.map(function (id) {
        var f = find(id);
        return h('button.btn', { type: 'button', onclick: function () { chosenC = id; pick.remove(); cBox.appendChild(q('C', id)); check(); } }, f ? f.item.q : id);
      })));
    inner.append(pick, cBox);
    finish = h('button.btn.btn-primary.btn-lg', { type: 'button', disabled: true, style: { marginTop: '16px' } }, 'Finish the paper and mark it');
    inner.appendChild(finish);
    check();
    finish.addEventListener('click', function () {
      clearInterval(iv);
      mockActive = false;
      var mins = Math.round((Date.now() - t0) / 60000);
      markMock(inner, i, fields, mins);
    });
  }

  function markMock(inner, i, fields, mins) {
    inner.innerHTML = '';
    inner.append(h('h2', 'Mark your paper'), h('p', 'For each answer: tick the checklist honestly, choose a mark, then compare with the model.'));
    var sels = [];
    fields.forEach(function (f) {
      var it = f.item;
      var sel = h('select', {}, h('option', { value: '' }, 'Mark...'), Array.from({ length: MAX[f.sec] + 1 }, function (_, k) { return h('option', { value: k }, k + ' / ' + MAX[f.sec]); }));
      sels.push(sel);
      sel.addEventListener('change', upd);
      inner.appendChild(h('details.study-card', { style: { marginTop: '12px' }, open: true },
        h('summary', h('b', 'Section ' + f.sec + ': ' + it.q)),
        h('div.two-col', { style: { marginTop: '10px' } },
          h('div', h('h4', 'Your answer'), h('div.model', { style: { background: 'rgba(255,255,255,.04)', borderColor: 'rgba(255,255,255,.15)' } }, f.ta.value),
            h('div', { style: { marginTop: '8px' } }, FEEDBACK.button(function () { return { sec: f.sec, item: it, text: f.ta.value, selfMark: sel.value === '' ? null : +sel.value, max: MAX[f.sec] }; }))),
          h('div', h('h4', 'Checklist'), h('ul.checklist', (it.checklist || []).map(function (c) { return h('li', h('label', h('input', { type: 'checkbox' }), h('span.small', c))); })),
            h('details', h('summary', f.sec === 'C' ? 'Model plan' : 'Model answer'), h('div.model', f.sec === 'C' ? (it.plan || []).join('\n') : it.model || '')),
            h('label.field', { style: { marginTop: '8px' } }, 'Your mark', sel)))));
    });
    var total = h('b');
    var save = h('button.btn.btn-primary.btn-lg', { type: 'button', disabled: true, style: { marginTop: '14px' } }, 'Save my paper');
    inner.append(h('p', { style: { marginTop: '14px', fontSize: '18px' } }, 'Total: ', total, ' / 35'), save);
    function upd() {
      var t = sels.reduce(function (a, s) { return a + (+s.value || 0); }, 0);
      total.textContent = String(t);
      save.disabled = sels.some(function (s) { return s.value === ''; });
    }
    upd();
    save.addEventListener('click', function () {
      var t = sels.reduce(function (a, s) { return a + (+s.value || 0); }, 0);
      store()['mock' + i] = { total: t, mins: mins, at: Date.now(), title: ODY.exam.mocks[i].title,
        answers: fields.map(function (f, k) { return { id: f.item.id, sec: f.sec, q: f.item.q, text: f.ta.value, mark: +sels[k].value }; }) };
      Object.keys(drafts()).forEach(function (k) { if (k.indexOf('mock' + i + ':') === 0) delete drafts()[k]; });
      S.save();
      S.award('mock');
      AUDIO.sfx('victory', 0.5);
      U.toast('<b>Mock saved: ' + t + ' / 35.</b> It is saved on this device.', 'gold', 4000);
      T.screen('mock');
    });
  }
})();
