/* Screens outside the story: title, voyage map, stall (shop), episode end, shipwreck,
 * Library (study mode), Progress, settings and the teacher guide. */
(function () {
  'use strict';
  var h = U.h;
  var SC = window.SCREENS = {};

  function view() { return document.getElementById('view'); }
  function screen(bg) {
    STORY.leave();
    AUDIO.stop();
    var v = view();
    v.innerHTML = '';
    var s = h('section.screen');
    if (bg) s.appendChild(h('div.screen-bg', { style: { backgroundImage: 'url("assets/scenes/' + bg + (window.innerWidth < 900 ? '-sm' : '') + '.webp")' } }));
    v.appendChild(s);
    return s;
  }
  function coinImg() { return h('img', { src: U.prop('coin'), alt: 'drachmae', width: 18, height: 18 }); }
  function epTopicsMastery(ep) {
    var ts = ep.topics.filter(function (t) { return QB.byTopic(t).length; });
    if (!ts.length) return 0;
    return ts.reduce(function (a, t) { return a + QB.mastery(t); }, 0) / ts.length;
  }
  function meter(frac, label) {
    return h('div.meter-row', h('div.meter', h('i', { style: { width: Math.round(frac * 100) + '%' } })), h('span', label || Math.round(frac * 100) + '%'));
  }

  /* ---------- title ---------- */
  SC.title = function () {
    var s = screen('deck');
    s.classList.add('title-screen');
    var run = S.run();
    var name = h('input', { type: 'text', value: S.data.name, placeholder: 'Your name', autocomplete: 'name', maxlength: 60 });
    var cls = h('input', { type: 'text', value: S.data.cls, placeholder: 'e.g. 2.x Psych', maxlength: 30 });
    name.addEventListener('input', function () { S.data.name = name.value; S.save(); });
    cls.addEventListener('input', function () { S.data.cls = cls.value; S.save(); });
    var card = h('div.title-card',
      h('div.field-row', h('label.field', 'Name (optional, for a progress PDF)', name), h('label.field', 'Class', cls)),
      run && run.ep ? h('button.btn.btn-primary.btn-lg', { type: 'button', onclick: function () { APP.continueRun(); } },
        U.icon('play', 18), 'Continue the voyage', h('small', epLabel(run))) : null,
      h('button.btn' + (run ? '' : '.btn-primary.btn-lg'), { type: 'button', onclick: function () { APP.newVoyage(); } },
        U.icon('oar', 18), run ? 'Start a new voyage' : 'Start the voyage', h('small', 'Story mode, about 2 hours')),
      h('button.btn', { type: 'button', onclick: function () { APP.go('map'); } }, U.icon('map', 18), 'Choose an island', h('small', 'Jump to any topic')),
      h('button.btn', { type: 'button', onclick: function () { APP.go('library'); } }, U.icon('book', 18), "Athena's Library", h('small', 'Study mode, no story')),
      h('button.btn', { type: 'button', onclick: function () { APP.go('trials'); } }, U.icon('pen', 18), "The Oracle's Trials", h('small', 'Paper 1 practice')),
      h('button.btn', { type: 'button', onclick: function () { APP.go('gauntlet'); } }, U.icon('trident', 18), "Scylla's Gauntlet", h('small', 'Endless recall, best: ' + (S.data.meta.gauntletBest || 0))),
      h('button.btn', { type: 'button', onclick: function () { APP.go('progress'); } }, U.icon('star', 18), 'Progress and laurels', h('small', 'Mastery and endings')));
    s.appendChild(h('div.title-wrap',
      h('div',
        h('p.kicker', 'IB Psychology · Unit 1 Review · Learning and Cognition'),
        h('h1.logo', 'Odyssey'),
        h('p.logo-sub', 'The Long Way Home'),
        h('p.lede', 'A voiced, branching voyage through everything in Unit 1, built to get you ready for Paper 1. Your choices change the story. Your knowledge keeps your crew alive.'),
        h('ul.title-points',
          h('li', U.img('medal_ship'), h('span', h('b', 'Eight episodes, one topic per island. '), 'Play start to finish or jump in anywhere.')),
          h('li', U.img('coin'), h('span', h('b', 'Quick-time recall with real stakes. '), 'Miss and the sea takes a sailor. Earn drachmae and spend them on help.')),
          h('li', U.img('moly'), h('span', h('b', 'Choices are final. '), 'Unless you buy a Moly herb. Different choices, different endings.')),
          h('li', U.img('medal_exam'), h('span', h('b', 'Paper 1 practice built in. '), 'Section A, B and C, with checklists and model answers.')))),
      card));
  };
  function epLabel(run) {
    var ep = ODY.episodes[run.ep];
    if (!ep) return '';
    return 'Ep ' + ep.n + (run.epState === 'wrecked' ? ', shipwrecked' : ', ' + run.crew + ' crew');
  }

  /* ---------- voyage map ---------- */
  SC.map = function () {
    var s = screen('sirens');
    var run = S.run();
    var inner = h('div.screen-inner');
    inner.append(h('p.kicker', 'The voyage'), h('h1', 'Choose your island'),
      h('p.lede', 'Each island reviews one part of the unit. Sail in order for the full story, or jump straight to what you need to revise. Jumping in starts you with a fresh crew of ten.'));
    if (run) {
      var ep = ODY.episodes[run.ep];
      inner.appendChild(h('div.run-bar',
        h('b', 'Current voyage'),
        h('span.stat', U.icon('oar', 16), run.crew + ' crew'),
        h('span.stat', coinImg(), run.coins + ' drachmae'),
        h('span.stat', U.icon('trident', 16), 'wrath ' + run.wrath + '/5'),
        h('span.stat', run.items.length + ' items'),
        h('span', { style: { flex: 1 } }),
        h('button.btn.btn-sm', { type: 'button', onclick: function () { SC.shop({}).then(function () { SC.map(); }); } }, "The Chronicler's stall"),
        ep ? h('button.btn.btn-primary.btn-sm', { type: 'button', onclick: function () { APP.continueRun(); } }, run.epState === 'done' ? 'Sail on' : 'Continue: ' + ep.title) : null));
    }
    var grid = h('div.map');
    ODY.episodeOrder.forEach(function (id) {
      var ep = ODY.episodes[id];
      var done = S.data.meta.epDone[id];
      var here = run && run.ep === id && run.epState !== 'done';
      var b = h('button.isle', { type: 'button' },
        h('div.isle-img', { style: { backgroundImage: 'url("assets/scenes/' + ep.scene + '-sm.webp")' } },
          h('span.isle-num', String(ep.n)),
          here ? h('span.isle-here', 'You are here') : done ? h('span.isle-done', 'Done' + (done.times > 1 ? ' x' + done.times : '')) : null),
        h('div.isle-body', h('h3', ep.title), h('span.isle-topic', ep.topic), h('span.isle-blurb', ep.blurb),
          meter(epTopicsMastery(ep), 'mastery ' + Math.round(epTopicsMastery(ep) * 100) + '%')));
      b.addEventListener('click', function () { islandModal(ep); });
      grid.appendChild(b);
    });
    inner.appendChild(grid);
    s.appendChild(inner);
  };

  function islandModal(ep) {
    var run = S.run();
    var body = h('div', { style: { display: 'grid', gap: '12px' } },
      h('p', { html: U.md(ep.blurb) }),
      h('p.small.muted', 'Topics: ' + ep.topics.map(function (t) { return ODY.topics[t] ? ODY.topics[t].name : t; }).join(', ') + '. About ' + ep.minutes + ' minutes.'));
    var row = h('div.btn-row');
    if (run && run.ep !== ep.id && run.crew > 0 && run.epState !== 'wrecked') {
      row.appendChild(h('button.btn.btn-primary', { type: 'button', onclick: function () { U.closeModal(); run.ep = ep.id; run.epState = 'new'; S.save(); STORY.start(ep.id, { restart: true }); } },
        'Sail here with your crew (' + run.crew + ')'));
    }
    if (run && run.ep === ep.id && run.epState === 'wrecked') {
      row.appendChild(h('button.btn.btn-primary', { type: 'button', onclick: function () { U.closeModal(); STORY.retry(); } }, "Athena's mercy: retry with at least 6 crew"));
    } else if (run && run.ep === ep.id && run.epState === 'done') {
      var nx = ODY.episodes[ODY.episodeOrder[ODY.episodeOrder.indexOf(ep.id) + 1]];
      if (nx) row.appendChild(h('button.btn.btn-primary', { type: 'button', onclick: function () { U.closeModal(); APP.continueRun(); } }, 'Sail on to Episode ' + nx.n + ': ' + nx.title));
      row.appendChild(h('button.btn', { type: 'button', onclick: function () { U.closeModal(); run.epState = 'new'; S.save(); STORY.start(ep.id, { restart: true }); } }, 'Sail here again with your crew (' + run.crew + ')'));
    } else if (run && run.ep === ep.id) {
      row.appendChild(h('button.btn.btn-primary', { type: 'button', onclick: function () { U.closeModal(); APP.continueRun(); } }, run.epState === 'playing' ? 'Continue this episode' : 'Play this episode'));
      if (run.epState === 'playing') row.appendChild(h('button.btn', { type: 'button', onclick: function () { U.closeModal(); STORY.restartEpisode(ep.id); } }, 'Restart this episode'));
    }
    row.appendChild(h('button.btn' + (run ? '' : '.btn-primary'), { type: 'button', onclick: function () {
      if (run && !confirm('Start a new voyage from this island? Your current crew and drachmae will be replaced.')) return;
      U.closeModal(); S.newRun(ep.id); STORY.start(ep.id, { restart: true });
    } }, 'New voyage from here'));
    row.appendChild(h('button.btn', { type: 'button', onclick: function () { U.closeModal(); SC.library(ep.topics[0]); } }, U.icon('book', 16), 'Study these topics instead'));
    body.appendChild(row);
    U.modal('Episode ' + ep.n + ': ' + ep.title, body, { narrow: true });
  }

  /* ---------- the Chronicler's stall ---------- */
  var SHOP_LINES = [
    'Welcome to my stall. Everything here is entirely legitimate and only slightly enchanted.',
    'Ah, a customer. I would offer a loyalty card, but you have already studied what those do to people.',
    'Browse freely. Prices are fixed, unlike Poseidon.',
    'Everything must go. Mostly because I have to narrate the next island.'
  ];
  ODY.shopLines = SHOP_LINES;
  SC.price = function (k) {
    var run = S.run();
    return Math.round(ODY.items[k].price * (1 + 0.15 * ((run && run.boughtRun) || 0)));
  };
  SC.shop = function (opts) {
    opts = opts || {};
    var run = S.run();
    return new Promise(function (resolve) {
      if (!run) { resolve(); return; }
      var key = run.ep + ':' + run.epState + ':' + (run.pos || 0);
      if (run.stockKey !== key) {
        run.stockKey = key;
        run.stock = U.shuffle(Object.keys(ODY.items)).slice(0, 4);
        run.sold = [];
        S.save();
      }
      var host;
      if (opts.inline) host = STORY.openPanel('shop-panel');
      else {
        var s = screen('troy');
        host = h('div.screen-inner');
        s.appendChild(host);
      }
      var purse = h('b');
      var line = U.pick(SHOP_LINES);
      var itemsBox = h('div.shop-items');
      function paint() {
        purse.textContent = run.coins + ' drachmae';
        itemsBox.innerHTML = '';
        run.stock.forEach(function (k) {
          var it = ODY.items[k];
          var price = SC.price(k);
          var sold = run.sold.indexOf(k) >= 0;
          var afford = run.coins >= price;
          var b = h('button.shop-item' + (sold ? '.sold' : ''), { type: 'button', disabled: sold || !afford },
            h('img', { src: U.prop(it.icon), alt: '' }),
            h('div', h('h4', it.name), h('p', it.desc), h('span.price', coinImg(), sold ? 'Sold' : price + ' dr')));
          b.addEventListener('click', function () {
            if (run.items.length >= ODY.itemMax) { U.toast('Your satchel is full (' + ODY.itemMax + ' items).'); return; }
            if (!STORY.addItem(k)) return;
            run.coins -= price;
            run.boughtRun = (run.boughtRun || 0) + 1;
            run.sold.push(k);
            S.data.meta.bought += 1;
            if (S.data.meta.bought >= 5) S.award('shopper');
            AUDIO.sfx('unlock');
            S.save();
            STORY.hud();
            paint();
          });
          itemsBox.appendChild(b);
        });
      }
      paint();
      host.append(
        h('div.shop',
          h('div.shop-keeper',
            h('p.kicker', 'Between the islands'),
            h('h2', "The Chronicler's stall"),
            h('div.narr', { style: { position: 'static', transform: 'none', width: '100%' } },
              h('img.narr-medal', { src: 'assets/ui/narrator-medallion.svg', alt: '' }),
              h('div.narr-body', h('span.narr-name', 'The Chronicler'), h('p.narr-text', line))),
            h('p', 'Your purse: ', purse),
            h('p.small.muted', 'Stock changes every visit, and prices rise a little with every purchase on this voyage. You can carry ' + ODY.itemMax + ' items. Quick-time items appear as buttons during a question.')),
          itemsBox),
        h('div.panel-foot', h('span'), h('button.btn.btn-primary', { type: 'button', onclick: function () { AUDIO.stop(); if (opts.inline) STORY.closePanel(); resolve(); } }, 'Leave the stall')));
      AUDIO.say('narrator', line);
    });
  };

  /* ---------- end of an episode ---------- */
  SC.episodeEnd = function (ep, st, nextId) {
    var run = S.run();
    return new Promise(function (resolve) {
      var p = STORY.openPanel('end-panel');
      var right = st.right || 0, wrong = st.wrong || 0;
      var recap = h('ul.choice-recap');
      Object.keys(run.choices).filter(function (k) { return k.indexOf(ep.id + ':') === 0; }).forEach(function (k) {
        var hist = S.data.meta.choiceHist[k] || {};
        var total = Object.keys(hist).reduce(function (a, x) { return a + hist[x]; }, 0);
        var mine = hist[run.choices[k]] || 0;
        recap.appendChild(h('li', h('div', { html: U.md(run.choices[k]) }),
          total > 1 ? h('span.pct', 'You have made this choice in ' + mine + ' of your ' + total + ' voyages through here.') : h('span.pct', 'First time through. Replay to see how else it could go.')));
      });
      var mastery = h('div.mastery-list', ep.topics.filter(function (t) { return QB.byTopic(t).length; }).map(function (t) {
        var m = QB.mastery(t);
        return h('div.row', h('span', ODY.topics[t] ? ODY.topics[t].name : t), h('div.meter', h('i', { style: { width: Math.round(m * 100) + '%' } })), h('b', Math.round(m * 100) + '%'));
      }));
      var nextEp = nextId && ODY.episodes[nextId];
      var missed = (st.missed || []).map(function (id) { return ODY.questions.filter(function (q) { return q.id === id; })[0]; }).filter(Boolean);
      var scroll = missed.length ? h('div', h('h3', "The Oracle's scroll: questions to revisit"),
        h('ul.notes-list.small', missed.map(function (q) { return h('li', { html: U.md(q.q) + ' <b>' + U.esc(q.tf ? String(q.a) : q.a) + '</b>' }); })),
        h('p.small.muted', 'These come back later in the voyage and in the Library. The Oracle remembers.')) : h('p.small.muted', 'No missed questions this episode. The Oracle has nothing to remember.');
      var mood = run.trust >= 2 ? 'The crew trust you with their lives.' : run.trust >= 1 ? 'The crew follow you, mostly.' : run.trust >= 0 ? 'The crew are uneasy. They are watching your choices.' : 'The crew mutter when you pass. Trust is running out.';
      p.append(
        h('div.drill-head', h('div', h('p.kicker', 'Episode ' + ep.n + ' complete'), h('h2', ep.title))),
        h('div.big-stats',
          h('div.big-stat', h('b', String(run.crew)), h('span', 'crew left')),
          h('div.big-stat', h('b', String(st.lost || 0)), h('span', 'sailors lost')),
          h('div.big-stat', h('b', right + '/' + (right + wrong)), h('span', 'quick-time correct')),
          h('div.big-stat', h('b', String(run.coins)), h('span', 'drachmae'))),
        h('div.end-grid',
          h('div', h('h3', 'Your choices'), recap.children.length ? recap : h('p.muted', 'No story choices this time.')),
          h('div', h('h3', 'Your mastery'), mastery, h('p.small.muted', 'Mastery grows as you get questions right on spaced repeats.'), h('h3', { style: { marginTop: '10px' } }, 'Crew mood'), h('p', mood))),
        scroll,
        nextEp ? h('p.notes-spoken', { html: U.md(ep.next) }) : null,
        h('div.panel-foot',
          h('button.btn', { type: 'button', onclick: function () { AUDIO.stop(); APP.go('map'); resolve(); } }, 'Back to the map'),
          h('div.btn-row',
            nextEp ? h('button.btn', { type: 'button', onclick: function () { AUDIO.stop(); SC.shop({ inline: true }).then(function () { STORY.openPanel('end-panel'); p.innerHTML = ''; p.append(h('div.big-center', h('h2', 'Ready to sail?'), h('button.btn.btn-primary.btn-lg', { type: 'button', onclick: go }, 'Sail on to Episode ' + nextEp.n + ': ' + nextEp.title))); }); } }, "Visit the Chronicler's stall") : null,
            nextEp ? h('button.btn.btn-primary', { type: 'button', onclick: go }, 'Sail on to Episode ' + nextEp.n) : h('button.btn.btn-primary', { type: 'button', onclick: function () { AUDIO.stop(); SC.ending(run.ending || 'canon'); resolve(); } }, 'See your ending'))));
      if (nextEp) AUDIO.say('narrator', ep.next);
      AUDIO.sfx('victory', 0.45);
      function go() {
        AUDIO.stop();
        run.ep = nextId;
        run.epState = 'new';
        run.pos = 0;
        S.save();
        resolve();
        STORY.start(nextId, { restart: true });
      }
    });
  };

  SC.ending = function (id) {
    var e = ODY.endings[id] || ODY.endings.canon;
    S.endingFound(id);
    if (id === 'scholar') S.award('scholar');
    S.award('homecoming');
    var run = S.run();
    var s = screen('ithaca');
    var inner = h('div.screen-inner');
    var found = ODY.endingOrder.filter(function (k) { return S.data.meta.endings[k]; }).length;
    inner.append(h('p.kicker', 'Ending'), h('div.ending-art', U.img(e.icon), h('div', h('h1', e.title), h('p.lede', e.text))),
      run ? h('div.run-bar', h('b', 'This voyage'), h('span', run.crew + ' crew'), h('span', run.coins + ' drachmae'), h('span', run.stats.right + ' right, ' + run.stats.wrong + ' wrong'), h('span', 'wrath ' + run.wrath + '/5')) : null,
      h('p', 'Endings found: ' + found + ' of ' + ODY.endingOrder.length + '. Different choices, more knowledge, or more hubris lead to different homecomings.'),
      h('div.btn-row',
        h('button.btn.btn-primary', { type: 'button', onclick: function () { APP.go('progress'); } }, 'Progress and laurels'),
        h('button.btn', { type: 'button', onclick: function () { APP.newVoyage(); } }, 'Sail again'),
        h('button.btn', { type: 'button', onclick: function () { APP.go('trials'); } }, "Try the Oracle's Trials")));
    s.appendChild(inner);
    AUDIO.say('narrator', e.text);
  };

  SC.wreck = function (ep) {
    var run = S.run();
    var p = STORY.openPanel('end-panel');
    var e = ODY.endings.lost;
    p.append(h('div.big-center',
      U.img('lock', 'prop-big'),
      h('h2', e.title),
      h('p.lede', e.text),
      h('p.small.muted', 'Every sailor was lost in ' + (ep ? ep.title : 'this episode') + '. Your mastery and laurels are kept. Look at the questions you missed: they will come back.'),
      h('div.btn-row', { style: { justifyContent: 'center' } },
        h('button.btn.btn-primary', { type: 'button', onclick: function () { AUDIO.stop(); STORY.retry(); } }, "Athena's mercy: retry the episode (at least 6 crew, half your drachmae)"),
        h('button.btn', { type: 'button', onclick: function () { AUDIO.stop(); APP.go('library', ep && ep.topics[0]); } }, 'Study first'),
        h('button.btn', { type: 'button', onclick: function () { AUDIO.stop(); APP.go('map'); } }, 'Back to the map'))));
    AUDIO.say('narrator', e.text);
  };

  /* ---------- Library (study mode) ---------- */
  var TOPIC_ORDER = ['concepts', 'classical', 'operant', 'slt', 'schema', 'msm', 'wmm', 'lop', 'load', 'dpt', 'biases', 'models', 'exam', 'methods'];
  SC.topicOrder = function () { return TOPIC_ORDER.filter(function (t) { return ODY.topics[t] || QB.byTopic(t).length; }); };
  var SPECIAL = {
    operant: [['reinforce', 'Reinforcement schedules: an unpredictable reward']],
    schema: [['bj', 'Bransford and Johnson: title or no title?'], ['bartlett', 'Bartlett: reconstructing an unfamiliar story']],
    msm: [['flash', 'Sperling: the flash of letters'], ['span', 'Digit span and chunking'], ['serial', 'The serial position curve']],
    lop: [['lop', 'Depth of processing: a surprise test']],
    wmm: [['dualtask', 'Twin tasks: the dual-task method']],
    dpt: [['crt', 'Fast and slow: reflection puzzles']],
    biases: [['anchor', 'Anchoring: a random first number'], ['rule246', 'Confirmation bias: the 2-4-6 task']]
  };
  SC.drillsFor = function (t) {
    var list = (SPECIAL[t] || []).map(function (x) { return { type: x[0], id: null, title: x[1] }; });
    ['sort', 'order', 'cloze'].forEach(function (kind) {
      var bank = (ODY.drills && ODY.drills[kind]) || {};
      Object.keys(bank).forEach(function (id) {
        if (bank[id].topic === t) list.push({ type: kind, id: id, title: bank[id].title });
      });
    });
    return list;
  };

  SC.library = function (focusTopic) {
    if (focusTopic && ODY.topics[focusTopic]) return SC.topic(focusTopic);
    var s = screen('garden');
    var inner = h('div.screen-inner');
    inner.append(h('p.kicker', 'Study mode'), h('h1', "Athena's Library"),
      h('p.lede', 'Every topic without the story: the Chronicler\'s lesson, the studies, drills and rapid recall. Your mastery here is shared with the voyage.'));
    var cards = h('div.cards');
    SC.topicOrder().forEach(function (t) {
      var tp = ODY.topics[t] || { name: t };
      var m = QB.mastery(t);
      var c = h('button.card', { type: 'button' }, h('h3', tp.name), h('p', tp.hook || ''), h('span.small.muted', 'Paper 1: ' + (tp.paper || 'A, B, C')), meter(m));
      c.addEventListener('click', function () { SC.topic(t); });
      cards.appendChild(c);
    });
    inner.appendChild(cards);
    s.appendChild(inner);
  };

  SC.topic = function (t, tab) {
    var tp = ODY.topics[t] || { name: t };
    var s = screen('garden');
    var inner = h('div.screen-inner');
    var tabs = h('div.tabs');
    var body = h('div');
    var TABS = [['lesson', 'Lesson'], ['studies', 'Studies'], ['drills', 'Drills'], ['recall', 'Rapid recall'], ['exam', 'Exam moves']];
    TABS.forEach(function (x) {
      var b = h('button.tab', { type: 'button' }, x[1]);
      b.addEventListener('click', function () { show(x[0]); });
      b.dataset.tab = x[0];
      tabs.appendChild(b);
    });
    inner.append(h('button.btn.btn-ghost.btn-sm', { type: 'button', html: U.icon('back', 16) + ' All topics', onclick: function () { SC.library(); } }),
      h('p.kicker', { style: { marginTop: '12px' } }, "Athena's Library"), h('h1', tp.name), h('p.lede', tp.hook || ''), meter(QB.mastery(t), 'mastery ' + Math.round(QB.mastery(t) * 100) + '%'), tabs, body);
    s.appendChild(inner);
    function show(which) {
      AUDIO.stop();
      U.cancelActivities();
      U.$$('.tab', tabs).forEach(function (b) { b.classList.toggle('on', b.dataset.tab === which); });
      body.innerHTML = '';
      if (which === 'lesson') body.appendChild(lessonView(t));
      if (which === 'studies') body.appendChild(studiesView(t));
      if (which === 'drills') body.appendChild(drillsView(t));
      if (which === 'recall') body.appendChild(recallView(t));
      if (which === 'exam') body.appendChild(TRIALS.forTopic(t));
    }
    show(tab || 'lesson');
  };

  function lessonView(t) {
    var tp = ODY.topics[t] || {};
    // Study mode is for students who chose to skip the story: the narrator is a plain tutor here.
    var lines = (tp.tutor && tp.tutor.length) ? tp.tutor : (tp.voice || []);
    var spoken = h('p.notes-spoken', '');
    var play = h('button.btn.btn-primary', { type: 'button', html: U.icon('play', 16) + ' Listen to the lesson' });
    var i = 0, playing = false;
    play.addEventListener('click', function () {
      if (playing) { AUDIO.stop(); playing = false; play.innerHTML = U.icon('play', 16) + ' Listen to the lesson'; return; }
      playing = true; i = 0;
      play.innerHTML = U.icon('x', 16) + ' Stop';
      (function next() {
        if (!playing) return;
        if (i >= lines.length) { playing = false; play.innerHTML = U.icon('replay', 16) + ' Hear it again'; return; }
        spoken.innerHTML = U.md(lines[i]);
        var v = AUDIO.say('narrator', lines[i++]);
        v.done.then(function (nat) { if (nat) setTimeout(next, 250); });
      })();
    });
    var wrap = h('div', { style: { display: 'grid', gap: '16px' } },
      h('div.btn-row', play),
      spoken,
      h('div.two-col',
        h('div', h('h3', 'Key points'), h('ul.notes-list', (tp.key || []).map(function (k) { return h('li', { html: U.md(k) }); }))),
        h('div', h('h3', 'Key terms'), h('dl.notes-terms', (tp.terms || []).map(function (x) { return [h('dt', x[0]), h('dd', { html: U.md(x[1]) })]; })))));
    if ((tp.strengths && tp.strengths.length) || (tp.limitations && tp.limitations.length)) {
      wrap.appendChild(h('div.two-col',
        h('div', h('h3', 'Strengths'), h('ul.notes-list', (tp.strengths || []).map(function (k) { return h('li', { html: U.md(k) }); }))),
        h('div', h('h3', 'Limitations'), h('ul.notes-list', (tp.limitations || []).map(function (k) { return h('li', { html: U.md(k) }); })))));
    }
    if (tp.misconceptions && tp.misconceptions.length) {
      wrap.appendChild(h('div', h('h3', 'Watch out'), h('ul.notes-list', tp.misconceptions.map(function (m) {
        return h('li', { html: '<b>' + U.esc(m[0]) + '</b> ' + U.md(m[1]) });
      }))));
    }
    if (tp.examTips && tp.examTips.length) {
      wrap.appendChild(h('div', h('h3', 'Exam tips'), h('ul.notes-list', tp.examTips.map(function (m) { return h('li', { html: U.md(m) }); }))));
    }
    return wrap;
  }
  SC.lessonView = lessonView;

  function studiesView(t) {
    var tp = ODY.topics[t] || {};
    var list = tp.studies || [];
    if (!list.length) return h('p.muted', 'This topic has no key studies of its own. Use the lesson and the exam moves.');
    return h('div', { style: { display: 'grid', gap: '14px' } }, list.map(function (st) {
      var rows = [['Aim', st.aim], ['Method', st.method], ['Results', st.results], ['Conclusion', st.conclusion]].filter(function (r) { return r[1]; });
      return h('div.study-card', h('h4', st.name + (st.tag ? ': ' + st.tag : '')),
        h('dl', rows.map(function (r) { return [h('dt', r[0]), h('dd', { html: U.md(r[1]) })]; })),
        st.eval && st.eval.length ? h('div', { style: { marginTop: '8px' } }, h('b.small', 'Evaluation'), h('ul.notes-list.small', st.eval.map(function (e) { return h('li', { html: U.md(e) }); }))) : null,
        st.concepts ? h('div', { style: { marginTop: '6px' } }, Object.keys(st.concepts).map(function (c) {
          return h('p.small', { style: { margin: '2px 0' } }, h('span.chip.chip-gold', c), ' ', st.concepts[c]);
        })) : null);
    }));
  }

  function drillsView(t) {
    var list = SC.drillsFor(t);
    if (!list.length) return h('p.muted', 'No drills for this topic yet. Try Rapid recall.');
    return h('div.cards', list.map(function (d) {
      var c = h('button.card', { type: 'button' }, h('h3', d.title), h('p', d.type === 'sort' ? 'Sort the cards' : d.type === 'order' ? 'Put the steps in order' : d.type === 'cloze' ? 'Rebuild the study' : 'Interactive demonstration'));
      c.addEventListener('click', function () { SC.drillScreen(d, t); });
      return c;
    }));
  }

  SC.drillScreen = function (d, t) {
    var s = screen('garden');
    var wrap = h('div.panel-wrap.in', { style: { position: 'absolute' } });
    var p = h('div.panel.drill-panel');
    wrap.appendChild(p);
    s.appendChild(wrap);
    var g = U.gen;
    DRILLS.run(d.type, { id: d.id, standalone: true }, p).then(function () { if (U.gen === g) SC.topic(t, 'drills'); });
  };

  function recallView(t) {
    var host = h('div.qte-host', { style: { minHeight: '420px' } });
    var info = h('p.lede', 'Ten questions from this topic, weighted towards the ones you find hard. No crew at stake. ' + (S.opt('calm') ? 'Calm mode is on: no timer.' : 'Each has a 20 second timer (turn on Calm mode in Settings to remove it).'));
    var start = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Start rapid recall');
    var wrap = h('div', info, host);
    host.appendChild(h('div.big-center', start));
    start.addEventListener('click', function () {
      var qs = QB.pick([t], 10);
      var right = 0, i = 0;
      (function next() {
        if (i >= qs.length) {
          QB.checkMastery();
          host.innerHTML = '';
          host.appendChild(h('div.big-center', h('h2', right + ' / ' + qs.length), h('p', 'Mastery now ' + Math.round(QB.mastery(t) * 100) + '%.'),
            h('button.btn.btn-primary', { type: 'button', onclick: function () { SC.topic(t, 'recall'); } }, 'Again')));
          return;
        }
        QB.ask(host, qs[i++], { timer: 20, label: 'Rapid recall ' + i + ' / ' + qs.length }).then(function (r) { if (r.aborted) return; if (r.correct) right++; next(); });
      })();
    });
    return wrap;
  }

  SC.topicModal = function (t) {
    var tp = ODY.topics[t] || { name: t };
    U.modal(tp.name, lessonView(t));
  };

  /* ---------- Scylla's Gauntlet: endless recall, three heads to spare ---------- */
  SC.gauntlet = function () {
    var s = screen('strait');
    var inner = h('div.screen-inner');
    var best = S.data.meta.gauntletBest || 0;
    var host = h('div.qte-host', { style: { minHeight: '440px' } });
    var hud = h('div.run-bar');
    inner.append(h('p.kicker', 'Endless recall'), h('h1', "Scylla's Gauntlet"),
      h('p.lede', 'Questions from every topic until Scylla has taken three sailors. The clock tightens as your score climbs. Your best: ' + best + '.'), hud, host);
    s.appendChild(inner);
    var start = h('button.btn.btn-primary.btn-lg', { type: 'button' }, 'Run the gauntlet');
    host.appendChild(h('div.big-center', U.img('medal_ship', 'prop-big'), start));
    start.addEventListener('click', function () {
      var lives = 3, score = 0, streak = 0;
      function paint() {
        hud.innerHTML = '';
        hud.append(h('span.stat', h('b', 'Score ' + score)), h('span.stat', 'Lives ' + '♥'.repeat(lives) + '♡'.repeat(3 - lives)), h('span.stat', 'Streak ' + streak), h('span.stat.muted', 'Best ' + Math.max(best, score)));
      }
      (function next() {
        paint();
        if (lives <= 0) {
          var isBest = score > best;
          if (isBest) { S.data.meta.gauntletBest = score; S.save(); }
          QB.checkMastery();
          host.innerHTML = '';
          host.appendChild(h('div.big-center', h('h2', 'Scylla wins, this time'), h('p.lede', 'Score: ' + score + (isBest ? '. A new best!' : '. Best: ' + best + '.')),
            h('div.btn-row', h('button.btn.btn-primary', { type: 'button', onclick: SC.gauntlet }, 'Again'), h('button.btn', { type: 'button', onclick: function () { APP.go('progress'); } }, 'See my weakest topics'))));
          AUDIO.sfx(isBest ? 'victory' : 'close', 0.5);
          return;
        }
        var q = QB.pick([], 1)[0];
        var timer = Math.max(7, 16 - Math.floor(score / 4));
        QB.ask(host, q, { timer: timer, label: 'Gauntlet · question ' + (score + (3 - lives) + 1) }).then(function (r) {
          if (r.aborted) return;
          if (r.correct) { score++; streak++; } else { lives--; streak = 0; }
          next();
        });
      })();
    });
  };

  /* ---------- progress ---------- */
  SC.progress = function () {
    var s = screen('ithaca');
    var inner = h('div.screen-inner');
    var meta = S.data.meta;
    var mastery = h('div.mastery-list', SC.topicOrder().map(function (t) {
      var m = QB.mastery(t);
      var acc = QB.accuracy(t);
      return h('div.row', h('span', (ODY.topics[t] || { name: t }).name), h('div.meter', h('i', { style: { width: Math.round(m * 100) + '%' } })), h('b', Math.round(m * 100) + '%'),
        acc === null ? null : null);
    }));
    var weakest = SC.topicOrder().filter(function (t) { return QB.byTopic(t).length; })
      .sort(function (a, b) { return QB.mastery(a) - QB.mastery(b); }).slice(0, 3);
    var ends = h('div.cards', ODY.endingOrder.map(function (k) {
      var e = ODY.endings[k];
      var got = meta.endings[k];
      return h('div.card', { style: { opacity: got ? 1 : 0.55 } }, h('h3', got ? e.title : '???'), h('p', got ? e.text : 'Not found yet.'));
    }));
    var achs = h('div.ach-grid', ODY.achievements.map(function (a) {
      return h('div.ach' + (meta.achievements[a.id] ? '.got' : ''), h('b', (meta.achievements[a.id] ? '★ ' : '') + a.name), h('span.muted', a.desc));
    }));
    var eps = ODY.episodeOrder.map(function (id) { return meta.epDone[id]; }).filter(Boolean).length;
    inner.append(h('p.kicker', 'Your record'), h('h1', 'Progress and laurels'),
      h('div.run-bar',
        h('span.stat', h('b', String(eps)), ' of ' + ODY.episodeOrder.length + ' episodes finished'),
        h('span.stat', h('b', String(meta.runs)), ' voyages'),
        h('span.stat', 'best streak ', h('b', String(meta.bestStreak))),
        h('span.stat', 'active time ', h('b', Math.round(meta.activeMs / 60000) + ' min'))),
      h('div.two-col', { style: { marginTop: '18px' } },
        h('div', h('h2', 'Mastery by topic'), mastery,
          h('p.small.muted', 'Revise these next: ' + weakest.map(function (t) { return (ODY.topics[t] || { name: t }).name; }).join(', ') + '.')),
        h('div', h('h2', 'Save a record (optional)'), h('p.small.muted', 'Useful if you want to keep track of your review, or show your teacher what you did. Not required.'), EVIDENCE.panel())),
      h('h2', { style: { marginTop: '24px' } }, 'Endings'), ends,
      h('h2', { style: { marginTop: '24px' } }, 'Laurels'), achs);
    s.appendChild(inner);
  };

  /* ---------- menu, settings, teacher ---------- */
  SC.menu = function () {
    var dlg = document.getElementById('menuDlg');
    var g = document.getElementById('menuGrid');
    g.innerHTML = '';
    var inEp = document.body.classList.contains('in-episode');
    [['home', 'Home', function () { APP.go('title'); }],
      ['map', 'Voyage map', function () { APP.go('map'); }],
      ['book', "Athena's Library", function () { APP.go('library'); }],
      ['pen', "Oracle's Trials (Paper 1)", function () { APP.go('trials'); }],
      ['trident', "Scylla's Gauntlet", function () { APP.go('gauntlet'); }],
      ['star', 'Progress and evidence', function () { APP.go('progress'); }],
      ['settings', 'Settings', function () { SC.settings(); }],
      inEp ? ['log', 'Dialogue log', function () { STORY.showLog(); }] : null,
      ['teacher', 'Teacher guide', function () { SC.teacher(); }]
    ].filter(Boolean).forEach(function (x) {
      g.appendChild(h('button.btn', { type: 'button', html: U.icon(x[0], 18) + ' ' + U.esc(x[1]), onclick: function () { dlg.close(); x[2](); } }));
    });
    dlg.showModal();
  };

  SC.settings = function () {
    function toggle(key, label, help) {
      var cb = h('input', { type: 'checkbox' });
      cb.checked = !!S.opt(key);
      cb.addEventListener('change', function () { S.set(key, cb.checked); APP.applySettings(); });
      return h('label', h('input', { type: 'hidden' }), cb, h('span', h('b', label), help ? h('span.small.muted', ' ' + help) : null));
    }
    var size = h('select', {}, [['0.92', 'Smaller'], ['1', 'Normal'], ['1.12', 'Larger']].map(function (o) {
      var op = h('option', { value: o[0] }, o[1]);
      if (String(S.opt('textSize')) === o[0]) op.selected = true;
      return op;
    }));
    size.addEventListener('change', function () { S.set('textSize', +size.value); APP.applySettings(); });
    U.modal('Settings', h('div', { style: { display: 'grid', gap: '12px' } },
      h('ul.checklist',
        h('li', toggle('voice', 'Voices', 'Characters and the Chronicler speak their lines.')),
        h('li', toggle('browserVoice', 'Use browser voices when a recording is missing', 'Robotic, but better than silence.')),
        h('li', toggle('sfx', 'Sound effects')),
        h('li', toggle('autoplay', 'Auto-play dialogue', 'Move on when a line finishes.')),
        h('li', toggle('calm', 'Calm mode', 'No timers anywhere. Same content, same rewards.'))),
      h('label.field', 'Text size', size)), { narrow: true });
  };

  SC.teacher = function () {
    var presenter = h('input', { type: 'checkbox' });
    presenter.checked = !!S.opt('presenter');
    presenter.addEventListener('change', function () { S.set('presenter', presenter.checked); APP.applySettings(); });
    var eps = h('div', { style: { display: 'grid', gap: '10px' } }, ODY.episodeOrder.map(function (id) {
      var e = ODY.episodes[id];
      return h('div.study-card', h('h4', 'Episode ' + e.n + ': ' + e.title + ' (' + e.minutes + ' min)'),
        h('p.small', { style: { margin: 0 } }, h('b', 'Topics: '), e.topics.map(function (t) { return (ODY.topics[t] || { name: t }).name; }).join(', ')),
        e.teacher ? h('p.small', { style: { margin: '4px 0 0' } }, e.teacher) : null);
    }));
    U.modal('Teacher guide', h('div', { style: { display: 'grid', gap: '14px' } },
      h('p', 'Odyssey reviews Unit 1 Learning and Cognition for a full Paper 1. Students can play the story (eight episodes, about 90 to 120 minutes in total), study each topic in the Library, and practise Paper 1 in the Oracle\'s Trials. It is built for independent review. Everything saves in the browser; the Progress page can make an optional progress PDF, but nothing needs to be submitted.'),
      h('div.study-card', h('h4', 'Suggested plan'),
        h('ul.notes-list.small',
          h('li', 'Lesson 1 (70 min): Episodes 1 to 3 in class, headphones on. Students who finish start the Library for their weakest topic.'),
          h('li', 'Lesson 2 (70 min): Episodes 4 to 6.'),
          h('li', 'Lesson 3 (70 min): Episodes 7 and 8, then one Section B and one Section C plan in the Oracle\'s Trials.'),
          h('li', 'Homework: a full mock Paper 1 in the Trials (90 minutes, or untimed in Calm mode). Students can save a progress PDF if it helps them.'))),
      h('div.study-card', h('h4', 'How the game works'),
        h('ul.notes-list.small',
          h('li', 'Crew are lives: a wrong quick-time answer loses a sailor. Losing all of them ends the episode; students retry with six crew. Mastery is never lost.'),
          h('li', 'Missed questions return a few questions later and in later sessions (spaced repetition).'),
          h('li', 'Story choices change dialogue, callbacks and which of five endings a student reaches. They never affect marks.'),
          h('li', 'Every written answer (the Trials, the mock papers and the story\'s written Captain\'s log) has an optional "Get AI feedback" button. It copies one self-contained request that turns any AI chatbot into a Socratic Paper 1 tutor: a rough mark band first, then one question at a time, a rewrite and a re-estimate. It is told never to write the answer for the student. Students use whichever tool your school allows; nothing is sent from this page.'),
          h('li', 'Calm mode removes every timer. Presenter mode (below) unlocks Continue for projector use; arrow keys and clickers move the story on.'))),
      h('label', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, presenter, h('b', 'Presenter mode'), h('span.small.muted', 'No reading pauses, no timers.')),
      h('h3', 'Episodes'), eps,
      h('div.btn-row', h('button.btn.btn-danger', { type: 'button', onclick: function () {
        if (confirm('Erase all progress on this device? This cannot be undone.')) { S.reset(); U.closeModal(); APP.go('title'); }
      } }, 'Reset all progress on this device'))));
  };
})();
