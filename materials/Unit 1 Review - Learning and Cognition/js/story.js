/* The story engine.
 *
 * An episode's `script` is a list read top to bottom, like a screenplay:
 *   'N: text'                          the Chronicler (the only fourth-wall voice)
 *   'odysseus.think~worried: text'     a character line, with optional pose and face
 *   'N: variant A || variant B'        one variant is picked at random
 *   '?flag N: ...' '?!flag ...' '?trust>=2 ...' '?crew<6 >label'   conditions
 *   '#label'  '>label'                 labels and jumps
 *   '@scene lotus left=eurylochus.argue right=odysseus'   set the stage
 *   '@enter right=circe.stand'  '@exit circe'  '@fx shake|flash|storm|clear|dark|light'
 *   '@sfx creak'  '@wait 600'  '@set flag'  '@unset flag'  '@give crew+1 coins+10 wrath+1 trust-1'
 *   '@shop'  '@end'
 * and objects for interactive beats: {choice}, {qte}, {drill}, {notes}, {log}, {hot}.
 */
(function () {
  'use strict';
  var h = U.h;
  var ST = window.STORY = {};
  var ep = null, steps = [], labels = {}, pos = 0, token = 0;
  var el = {};
  var actors = {};           // who -> {slot, pose, node}
  var lineLog = [];
  var hotspots = [];
  var advanceWaiter = null;

  /* ---------- compiling ---------- */
  function compile(e) {
    var out = [], labs = {};
    e.script.forEach(function (s) {
      if (typeof s !== 'string') { out.push({ kind: 'obj', obj: s, cond: s.if || null }); return; }
      s = s.trim();
      var cond = null;
      if (s[0] === '#') { labs[s.slice(1)] = out.length; return; }
      if (s[0] === '?') { var sp = s.indexOf(' '); cond = s.slice(1, sp); s = s.slice(sp + 1).trim(); }
      if (s[0] === '>') { out.push({ kind: 'goto', to: s.slice(1).trim(), cond: cond }); return; }
      if (s[0] === '@') {
        var parts = s.slice(1).split(/\s+/);
        out.push({ kind: 'dir', name: parts[0], args: parts.slice(1), cond: cond });
        return;
      }
      var m = s.match(/^([a-z]+|N)(?:\.([a-z]+))?(?:~([a-z]+))?:\s*(.+)$/);
      if (!m) { console.warn('Unparsed script line', s); return; }
      out.push({ kind: 'line', who: m[1] === 'N' ? 'narrator' : m[1], pose: m[2] || null, face: m[3] || null,
        text: m[4].split(/\s*\|\|\s*/), cond: cond });
    });
    return { steps: out, labels: labs };
  }
  ST.compile = compile;

  /* Every voiced line in an episode (used by the voice build and the audit). */
  ST.allLines = function (e) {
    var list = [];
    compile(e).steps.forEach(function (st) {
      if (st.kind === 'line') st.text.forEach(function (t) { list.push({ who: st.who, text: t }); });
      if (st.kind === 'obj') {
        var o = st.obj;
        ['choice', 'qte', 'drill', 'notes', 'log'].forEach(function (k) {
          if (o[k] && o[k].say) [].concat(o[k].say).forEach(function (t) { list.push({ who: 'narrator', text: t }); });
        });
      }
    });
    return list;
  };

  /* ---------- conditions and effects ---------- */
  function test(cond) {
    if (!cond) return true;
    var r = S.run();
    return cond.split('&').every(function (c) {
      var neg = c[0] === '!';
      if (neg) c = c.slice(1);
      var m = c.match(/^([a-z]+)(>=|<=|>|<|=)(-?\d+)$/);
      var v;
      if (m) {
        var x = r[m[1]] != null ? r[m[1]] : 0;
        var y = +m[3];
        v = m[2] === '>=' ? x >= y : m[2] === '<=' ? x <= y : m[2] === '>' ? x > y : m[2] === '<' ? x < y : x === y;
      } else if (c.indexOf('item:') === 0) {
        v = r.items.indexOf(c.slice(5)) >= 0;
      } else v = !!r.flags[c];
      return neg ? !v : v;
    });
  }
  ST.test = test;

  function give(fx, quiet) {
    if (!fx) return;
    var r = S.run();
    var msgs = [];
    Object.keys(fx).forEach(function (k) {
      var v = fx[k];
      if (k === 'crew') {
        if (v < 0 && fx.qte && r.shield) {
          r.shield -= 1;
          var li = r.items.indexOf('laurel');
          if (li >= 0) r.items.splice(li, 1);
          msgs.push('<b>The laurel holds.</b> No sailor lost. (Laurel used.)');
          AUDIO.sfx('tile');
          return;
        }
        r.crew = U.clamp(r.crew + v, 0, 20);
        if (v < 0) { r.stats.lost += -v; epStat('lost', -v); msgs.push('<b>' + (-v === 1 ? 'A sailor is lost.' : (-v) + ' sailors are lost.') + '</b> Crew: ' + r.crew); AUDIO.sfx('shatter', 0.45); bump('crew'); }
        else if (v > 0) { msgs.push('<b>+' + v + ' crew.</b>'); bump('crew'); }
      } else if (k === 'coins') {
        S.addCoins(v);
        if (v > 0) { epStat('coins', v); bump('coins'); } else bump('coins');
        if (!quiet) msgs.push((v > 0 ? '+' : '') + v + ' drachmae');
      } else if (k === 'wrath') {
        r.wrath = U.clamp(r.wrath + v, 0, 5);
        if (v > 0) { msgs.push("<b>Poseidon's wrath rises.</b> His tests get faster."); bump('wrath'); AUDIO.sfx('clunk', 0.4); }
      } else if (k === 'trust') {
        r.trust = U.clamp(r.trust + v, -3, 5);
      } else if (k === 'wisdom') {
        r.wisdom += v;
      } else if (k === 'qte') {
        /* marker only */
      } else if (k === 'item') {
        addItem(v);
        msgs.push('Gained: ' + ODY.items[v].name);
      }
    });
    S.save();
    ST.hud();
    if (msgs.length && !quiet) U.toast(msgs.join('<br>'), fx.crew < 0 ? 'bad' : '');
    if (r.crew <= 0) shipwreck();
  }
  ST.give = give;
  function parseGive(args) {
    var fx = {};
    args.forEach(function (a) {
      var m = a.match(/^([a-z]+)([+-]\d+)$/);
      if (m) fx[m[1]] = +m[2];
      else if (a.indexOf('item=') === 0) fx.item = a.slice(5);
    });
    return fx;
  }
  function addItem(name) {
    var r = S.run();
    if (r.items.length >= ODY.itemMax) { U.toast('Your satchel is full.'); return false; }
    if (name === 'laurel') { r.shield += 1; }
    r.items.push(name);
    S.save();
    ST.hud();
    return true;
  }
  ST.addItem = addItem;
  function setFlag(f, v) {
    var r = S.run();
    r.flags[f] = v === undefined ? true : v;
    r.flagEp = r.flagEp || {};
    if (ep) r.flagEp[f] = ep.id;
  }
  ST.setFlag = setFlag;
  function epStat(k, v) {
    var r = S.run();
    var s = r.epStats[r.ep] = r.epStats[r.ep] || { right: 0, wrong: 0, lost: 0, coins: 0 };
    s[k] = (s[k] || 0) + v;
  }

  /* ---------- HUD ---------- */
  function bump(which) {
    var n = document.getElementById(which === 'crew' ? 'hudCrew' : which === 'coins' ? 'hudCoins' : 'hudWrath');
    if (!n) return;
    n.classList.remove('bump');
    void n.offsetWidth;
    n.classList.add('bump');
  }
  ST.hud = function () {
    var r = S.run();
    var hud = document.getElementById('hud');
    var inEp = !!(r && ep && document.body.classList.contains('in-episode'));
    hud.hidden = !inEp;
    document.getElementById('logBtn').hidden = !inEp;
    if (!inEp) return;
    document.getElementById('hudEp').textContent = 'Ep ' + ep.n + ': ' + ep.title;
    document.getElementById('hudCrew').innerHTML = U.icon('oar', 18) + '<b>' + r.crew + '</b><span class="hud-lbl">crew</span>';
    document.getElementById('hudCoins').innerHTML = '<img src="' + U.prop('coin') + '" alt="">' + '<b>' + r.coins + '</b><span class="hud-lbl">dr</span>';
    var w = document.getElementById('hudWrath');
    w.innerHTML = U.icon('trident', 18) + '<span class="wrath-pips">' + [0, 1, 2, 3, 4].map(function (i) { return '<i class="' + (i < r.wrath ? 'on' : '') + '"></i>'; }).join('') + '</span><b class="wrath-num">' + r.wrath + '</b>';
    w.title = "Poseidon's wrath: " + r.wrath + ' of 5. Each point makes quick-time questions a second faster.';
    var items = document.getElementById('hudItems');
    items.innerHTML = '';
    var counts = {};
    r.items.forEach(function (i) { counts[i] = (counts[i] || 0) + 1; });
    Object.keys(counts).forEach(function (k) {
      var it = ODY.items[k];
      var usable = (k === 'moly' && r.choiceSnap) || it.use === 'now';
      var b = h('button.hud-item' + (usable ? '.usable' : ''), { type: 'button', title: it.name + ': ' + it.desc },
        U.img(it.icon, 'hud-item-img'), counts[k] > 1 ? h('b', String(counts[k])) : null);
      b.addEventListener('click', function () { useItem(k); });
      items.appendChild(b);
    });
    var bag = document.getElementById('hudBag');
    if (bag) {
      bag.innerHTML = '';
      bag.appendChild(U.img('bag', 'hud-item-img'));
      bag.appendChild(h('b', String(r.items.length)));
      bag.hidden = false;
    }
  };
  /* Phones: the satchel opens a sheet with one large row per item. */
  ST.satchel = function () {
    var r = S.run();
    if (!r) return;
    var counts = {};
    r.items.forEach(function (i) { counts[i] = (counts[i] || 0) + 1; });
    var keys = Object.keys(counts);
    var body = h('div', { style: { display: 'grid', gap: '10px' } },
      keys.length ? keys.map(function (k) {
        var it = ODY.items[k];
        var usable = (k === 'moly' && r.choiceSnap) || it.use === 'now';
        return h('div.shop-item', U.img(it.icon), h('div', h('h4', it.name + (counts[k] > 1 ? ' x' + counts[k] : '')), h('p', it.desc),
          usable ? h('button.btn.btn-primary.btn-sm', { type: 'button', onclick: function () { U.closeModal(); useItem(k); } }, 'Use now')
            : h('span.small.muted', it.use === 'qte' ? 'Appears as a button during quick-time questions.' : k === 'lantern' ? 'Appears as a button at the next story choice.' : k === 'moly' ? 'Use it from here right after a story choice you want to take back.' : 'Works automatically.')));
      }) : h('p.muted', 'Your satchel is empty. The Chronicler sells useful things between islands.'));
    U.modal('Your satchel (' + r.items.length + ' of ' + ODY.itemMax + ')', body, { narrow: true });
  };

  function useItem(k) {
    var r = S.run();
    var it = ODY.items[k];
    if (k === 'moly') {
      if (!r.choiceSnap) { U.toast('Moly undoes your most recent story choice. There is no choice to undo yet.'); return; }
      if (el.stage && el.stage.classList.contains('has-panel')) { U.toast('Moly works during the story, not in the middle of a challenge. Finish this first.'); return; }
      if (!confirm('Use the Moly herb to undo your last choice ("' + r.choiceSnap.label + '") and choose again? The story rewinds; your crew, drachmae and satchel stay as they are now.')) return;
      var snap = r.choiceSnap;
      if (snap.key) { var hist = S.data.meta.choiceHist[snap.key]; if (hist && hist[snap.label] > 0) hist[snap.label]--; }
      var restored = snap.state;
      restored.crew = r.crew;
      restored.coins = r.coins;
      restored.items = r.items.slice();
      var i = restored.items.indexOf('moly');
      if (i >= 0) restored.items.splice(i, 1);
      restored.shield = restored.items.filter(function (x) { return x === 'laurel'; }).length;
      restored.stats = r.stats;
      restored.choiceSnap = null;
      restored.snapshot = r.snapshot;
      S.data.run = restored;
      S.save();
      S.award('moly');
      AUDIO.sfx('sigil');
      U.toast('<b>Moly.</b> Time folds back to the moment of choice.', 'gold');
      jump(snap.pos, true);
      return;
    }
    if (k === 'lyre') {
      r.items.splice(r.items.indexOf('lyre'), 1);
      AUDIO.sfx('victory', 0.4);
      give({ crew: 2 });
      return;
    }
    if (k === 'amphora') {
      r.items.splice(r.items.indexOf('amphora'), 1);
      r.doubleCoins = true;
      S.save(); ST.hud();
      U.toast('<b>Amphora of Plenty.</b> Correct answers pay double for the rest of this episode.', 'gold');
      return;
    }
    U.toast(it.name + ': ' + it.desc);
  }

  /* ---------- stage ---------- */
  function build() {
    var view = document.getElementById('view');
    view.innerHTML = '';
    el.stage = h('section.stage');
    el.bg = h('div.stage-bg');
    el.fx = h('div.stage-fx');
    el.actors = h('div.stage-actors');
    el.hot = h('div.stage-hot');
    el.narr = h('div.narr', { hidden: true, 'aria-live': 'polite' },
      h('img.narr-medal', { src: 'assets/ui/narrator-medallion.svg', alt: '' }),
      h('div.narr-body', h('span.narr-name', 'The Chronicler'), h('p.narr-text')));
    el.box = h('div.dbox', { hidden: true, 'aria-live': 'polite' },
      h('div.dbox-face'), h('div.dbox-main', h('div.dbox-name'), h('p.dbox-text')));
    el.controls = h('div.dctrl', { hidden: true });
    el.next = h('button.btn.btn-primary.next-btn', { type: 'button', html: 'Continue ' + U.icon('next', 16) });
    el.replay = h('button.btn.btn-ghost.btn-sm', { type: 'button', title: 'Replay this line', html: U.icon('replay', 16) });
    el.auto = h('button.btn.btn-ghost.btn-sm.auto-btn', { type: 'button', title: 'Auto-play: move on when a line finishes' });
    el.controls.append(el.replay, el.auto, el.next);
    el.choices = h('div.choices', { hidden: true });
    el.panel = h('div.panel-wrap', { hidden: true }, h('div.panel'));
    el.title = h('div.ep-title', { hidden: true });
    el.stage.append(el.bg, el.fx, el.actors, el.hot, el.narr, el.box, el.controls, el.choices, el.panel, el.title);
    view.appendChild(el.stage);
    el.next.addEventListener('click', function () { tryAdvance(); });
    el.replay.addEventListener('click', function () { if (el.replayFn) el.replayFn(); });
    el.auto.addEventListener('click', function () { S.set('autoplay', !S.opt('autoplay')); paintAuto(); });
    el.stage.addEventListener('click', function (e) {
      if (e.target === el.stage || e.target === el.bg || e.target.closest('.stage-actors') || e.target.closest('.dbox') || e.target.closest('.narr')) tryAdvance();
    });
    paintAuto();
  }
  function paintAuto() {
    el.auto.innerHTML = U.icon('play', 14) + '<span>Auto ' + (S.opt('autoplay') ? 'on' : 'off') + '</span>';
    el.auto.classList.toggle('on', !!S.opt('autoplay'));
  }
  ST.panel = function () { return el.panel.firstChild; };

  function setScene(bg, cast) {
    var small = window.innerWidth < 900;
    el.bg.style.backgroundImage = 'url("assets/scenes/' + bg + (small ? '-sm' : '') + '.webp")';
    el.bg.dataset.scene = bg;
    el.actors.innerHTML = '';
    actors = {};
    el.hot.innerHTML = '';
    hotspots = [];
    (cast || []).forEach(function (c) { enter(c.slot, c.who, c.pose); });
  }
  function slotArgs(args) {
    var bg = null, cast = [];
    args.forEach(function (a) {
      var m = a.match(/^(left|right|center|farleft|farright)=([a-z]+)(?:\.([a-z]+))?$/);
      if (m) cast.push({ slot: m[1], who: m[2], pose: m[3] });
      else if (!bg) bg = a;
    });
    return { bg: bg, cast: cast };
  }
  function spriteSrc(who, pose) { return 'assets/cast/' + who + '-' + pose + '.webp'; }
  function hasPose(who, pose) { return ODY.sprites && ODY.sprites[who + '-' + pose]; }
  function enter(slot, who, pose) {
    var c = ODY.cast[who] || {};
    pose = pose && hasPose(who, pose) ? pose : (hasPose(who, c.pose) ? c.pose : firstPose(who));
    if (!pose) return;
    if (actors[who]) exit(who, true);
    var node = h('div.actor.slot-' + slot, { dataset: { who: who } }, h('img', { src: spriteSrc(who, pose), alt: c.name || who, draggable: 'false' }));
    sizeActor(node, who, pose);
    el.actors.appendChild(node);
    actors[who] = { slot: slot, pose: pose, node: node };
    requestAnimationFrame(function () { node.classList.add('in'); });
  }
  function firstPose(who) {
    var k = Object.keys(ODY.sprites || {}).filter(function (x) { return x.indexOf(who + '-') === 0; })[0];
    return k ? k.slice(who.length + 1) : null;
  }
  var SIZE = { cyclops: 1.28, poseidon: 1.18, scylla: 1.25, sirens: 0.95, tiresias: 0.9, elpenor: 0.93 };
  var refH = {};
  function tallest(who) {
    if (refH[who]) return refH[who];
    var m = 0;
    Object.keys(ODY.sprites || {}).forEach(function (k) { if (k.indexOf(who + '-') === 0) m = Math.max(m, ODY.sprites[k][1]); });
    return (refH[who] = m || 1);
  }
  function sizeActor(node, who, pose) {
    // Poses on one sheet share a scale, so size each against the character's tallest pose.
    var me = ODY.sprites[who + '-' + pose];
    var rel = me ? me[1] / tallest(who) : 1;
    node.style.setProperty('--h', (rel * (SIZE[who] || 1)).toFixed(3));
    node.style.setProperty('--ar', me ? (me[0] / me[1]).toFixed(3) : '0.5');
  }
  function exit(who, instant) {
    var a = actors[who];
    if (!a) return;
    delete actors[who];
    if (instant) { a.node.remove(); return; }
    a.node.classList.remove('in');
    setTimeout(function () { a.node.remove(); }, 400);
  }
  function setPose(who, pose) {
    var a = actors[who];
    if (!a || !pose || a.pose === pose || !hasPose(who, pose)) return;
    a.pose = pose;
    a.node.querySelector('img').src = spriteSrc(who, pose);
    sizeActor(a.node, who, pose);
  }
  function focus(who) {
    Object.keys(actors).forEach(function (k) {
      actors[k].node.classList.toggle('speaking', k === who);
      actors[k].node.classList.toggle('dim', who !== 'narrator' && k !== who);
    });
    el.actors.classList.toggle('narrating', who === 'narrator');
  }

  function stageFx(name) {
    var s = el.stage;
    if (name === 'shake') { s.classList.remove('shake'); void s.offsetWidth; if (!U.reducedMotion()) s.classList.add('shake'); }
    else if (name === 'flash') { el.fx.classList.remove('flash'); void el.fx.offsetWidth; el.fx.classList.add('flash'); }
    else if (name === 'storm' || name === 'dark' || name === 'night' || name === 'gold') { el.fx.dataset.mood = name; }
    else if (name === 'clear' || name === 'light') { el.fx.dataset.mood = ''; }
  }

  /* ---------- hotspots (chests hidden in the scenery) ---------- */
  function addHot(o) {
    var b = h('button.hotspot', { type: 'button', title: 'Something glints here', style: { left: o.x + '%', top: o.y + '%' } },
      U.img(o.img || 'chest', 'hot-img'));
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      b.disabled = true;
      var lo = (o.coins || [0, 20])[0], hi = (o.coins || [0, 20])[1];
      // Variable ratio: sometimes nothing, sometimes a lot.
      var got = Math.random() < 0.35 ? 0 : Math.round(lo + Math.random() * (hi - lo));
      S.data.meta.chests += 1;
      if (S.data.meta.chests >= 5) S.award('chests');
      if (S.data.meta.chests === 4 && ODY.chestLines) {
        var cl = U.pick(ODY.chestLines);
        AUDIO.say('narrator', cl);
        U.toast('<i>' + U.esc(cl) + '</i>', 'remember', 5000);
      }
      b.innerHTML = '';
      b.appendChild(U.img(got ? 'chest_open' : 'chest', 'hot-img'));
      b.classList.add('opened');
      if (got) { AUDIO.sfx('unlock'); give({ coins: got }); }
      else { AUDIO.sfx('creak', 0.5); U.toast('Empty. Nothing but sand.'); }
      if (o.flag) { setFlag(o.flag, (S.run().flags[o.flag] || 0) + 1); S.save(); }
      setTimeout(function () { b.classList.add('gone'); }, 1400);
    });
    el.hot.appendChild(b);
  }

  /* ---------- lines ---------- */
  function minPause(text) {
    if (S.opt('presenter')) return 0;
    return U.clamp(300 + text.length * 14, 700, 2600);
  }
  function showLine(who, text, pose, face) {
    var my = ++token;
    var c = ODY.cast[who] || { name: who, color: '#ddd' };
    if (who !== 'narrator') {
      if (pose) setPose(who, pose);
      el.narr.hidden = true;
      el.box.hidden = false;
      el.box.style.setProperty('--who', c.color);
      el.box.querySelector('.dbox-name').textContent = c.name;
      var faceBox = el.box.querySelector('.dbox-face');
      var f = face || c.face;
      faceBox.innerHTML = '';
      if (f) {
        var fi = h('img', { src: 'assets/faces/' + who + '-' + f + '.webp', alt: '' });
        fi.onerror = function () { faceBox.innerHTML = ''; faceBox.classList.add('empty'); };
        faceBox.classList.remove('empty');
        faceBox.appendChild(fi);
      } else faceBox.classList.add('empty');
      var t = el.box.querySelector('.dbox-text');
      t.innerHTML = U.md(text);
      restartFade(t);
    } else {
      el.box.hidden = true;
      el.narr.hidden = false;
      var nt = el.narr.querySelector('.narr-text');
      nt.innerHTML = U.md(text);
      restartFade(el.narr);
    }
    focus(who);
    lineLog.push({ who: who, text: text });
    if (lineLog.length > 200) lineLog.shift();
    el.controls.hidden = false;
    el.next.disabled = true;
    el.next.classList.remove('ready');

    return new Promise(function (resolve) {
      var voice = AUDIO.say(who, text);
      el.stage.classList.add('talking');
      var canGo = false, voiceDone = false;
      var pause = minPause(text);
      el.replayFn = function () { voice.stop(); voice = AUDIO.say(who, text); voiceDone = false; voice.done.then(onVoice); };
      setTimeout(function () {
        if (my !== token) return;
        canGo = true;
        el.next.disabled = false;
        if (voiceDone) el.next.classList.add('ready');
      }, pause);
      function onVoice(natural) {
        if (my !== token) return;
        voiceDone = true;
        el.stage.classList.remove('talking');
        el.next.classList.add('ready');
        if (natural && S.opt('autoplay') && voice.mode !== 'text') {
          setTimeout(function () { if (my === token && canGo) finish(); }, 550);
        }
      }
      voice.done.then(onVoice);
      function finish() {
        if (my !== token) return;
        token++;
        voice.stop();
        el.stage.classList.remove('talking');
        advanceWaiter = null;
        resolve();
      }
      advanceWaiter = function () { if (canGo) finish(); else pulse(); };
    });
  }
  function restartFade(n) { n.classList.remove('fade-in'); void n.offsetWidth; n.classList.add('fade-in'); }
  function pulse() { el.next.classList.remove('nudge'); void el.next.offsetWidth; el.next.classList.add('nudge'); }
  function tryAdvance() { if (advanceWaiter) advanceWaiter(); }
  ST.advance = tryAdvance;

  function hideTalk() {
    el.box.hidden = true;
    el.narr.hidden = true;
    el.controls.hidden = true;
    focus(null);
  }

  /* ---------- choices ---------- */
  function fxPreview(o) {
    var fx = o.fx || {};
    var bits = [];
    if (fx.crew) bits.push((fx.crew > 0 ? '+' : '') + fx.crew + ' crew');
    if (fx.coins) bits.push((fx.coins > 0 ? '+' : '') + fx.coins + ' dr');
    if (fx.wrath) bits.push((fx.wrath > 0 ? '+' : '') + fx.wrath + ' wrath');
    if (fx.trust) bits.push((fx.trust > 0 ? 'crew trust up' : 'crew trust down'));
    if (o.risk) bits.push(o.risk);
    return bits.length ? bits.join(', ') : 'no visible cost';
  }
  function runChoice(c, stepIndex) {
    var r = S.run();
    var opts = c.opts.filter(function (o) { return test(o.if); });
    var timed = c.timer && !S.opt('calm') && !S.opt('presenter');
    // Remember the state just before this choice so a Moly herb can undo it.
    var snapState = S.snapshot();
    hideTalk();
    AUDIO.stop();
    return new Promise(function (resolve) {
      var my = ++token;
      el.choices.innerHTML = '';
      el.choices.hidden = false;
      var prompt = h('div.choice-prompt', c.prompt ? h('span', { html: U.md(c.prompt) }) : null);
      var bar = timed ? h('div.choice-timer', h('i')) : null;
      var list = h('div.choice-list');
      var lanternOn = false;
      var btns = opts.map(function (o, i) {
        var b = h('button.choice-btn', { type: 'button' }, h('span.choice-key', String(i + 1)), h('span.choice-text', { html: U.md(o.t) }), h('span.choice-fx'));
        b.addEventListener('click', function () { choose(o); });
        list.appendChild(b);
        return b;
      });
      el.choices.append(prompt, list);
      if (bar) el.choices.appendChild(bar);
      if (r.items.indexOf('lantern') >= 0) {
        var lb = h('button.btn.btn-ghost.btn-sm.lantern-btn', { type: 'button' }, U.img('lantern', 'btn-img'), "Use Tiresias' Lantern");
        lb.addEventListener('click', function () {
          r.items.splice(r.items.indexOf('lantern'), 1);
          S.save(); ST.hud();
          lanternOn = true;
          lb.remove();
          btns.forEach(function (b, i) { b.querySelector('.choice-fx').textContent = fxPreview(opts[i]); });
          AUDIO.sfx('tile');
        });
        prompt.appendChild(lb);
      }
      if (c.say) AUDIO.say('narrator', c.say);
      var start = performance.now(), raf = null;
      function tick(ts) {
        if (my !== token) return;
        var frac = 1 - (ts - start) / (c.timer * 1000);
        bar.firstChild.style.transform = 'scaleX(' + Math.max(0, frac) + ')';
        bar.classList.toggle('urgent', frac < 0.3);
        if (frac <= 0) { choose(c.silence || opts[opts.length - 1], true); return; }
        raf = requestAnimationFrame(tick);
      }
      if (timed) raf = requestAnimationFrame(tick);
      function onKey(e) {
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= btns.length) { e.preventDefault(); btns[n - 1].click(); }
      }
      document.addEventListener('keydown', onKey);
      var unCancel = U.onCancel(function () { cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); });
      try { btns[0].focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      function choose(o, silent) {
        if (my !== token) return;
        token++;
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        unCancel();
        AUDIO.stop();
        AUDIO.sfx('tap');
        el.choices.hidden = true;
        var label = silent ? (c.silence ? c.silence.t : '(silence)') : o.t;
        var cur = S.run();
        cur.choiceSnap = { pos: stepIndex, state: snapState, label: label.replace(/\*/g, ''), key: c.id ? ep.id + ':' + c.id : null };
        if (c.id) S.recordChoice(ep.id + ':' + c.id, label.replace(/\*/g, ''));
        if (o.set) [].concat(o.set).forEach(function (f) { setFlag(f); });
        if (silent && c.silence && c.silence.set) [].concat(c.silence.set).forEach(function (f) { setFlag(f); });
        S.save();
        ST.hud();
        if (o.remember) setTimeout(function () { U.toast(U.esc(o.remember), 'remember', 3200); AUDIO.sfx('page2', 0.5); }, 250);
        if (silent) U.toast('Time ran out. You said nothing.', 'bad');
        give(o.fx);
        resolve(o.go || null);
      }
    });
  }

  /* ---------- quick-time sequences ---------- */
  function qteTimer(base) {
    var r = S.run();
    var t = (base || 15) - r.wrath;
    if (r.omen && r.omen.timer && r.omen.ep === ep.id) t += r.omen.timer;
    return Math.max(7, t);
  }
  function runQte(o) {
    var r = S.run();
    hideTalk();
    var panel = openPanel('qte-panel');
    var qs = QB.pick(o.t || ep.topics, o.n || 3, { prefLv: o.lv });
    var right = 0;
    var head = h('div.qte-banner', h('b', o.title || 'Quick-time: recall'), h('span', o.stakes === 'coins' ? 'Stakes: drachmae' : 'Stakes: a sailor for every miss'));
    var host = h('div.qte-host');
    panel.append(head, host);
    if (o.say) AUDIO.say('narrator', o.say);
    var chain = Promise.resolve();
    qs.forEach(function (q, i) {
      chain = chain.then(function () {
        head.querySelector('span').textContent = (o.stakes === 'coins' ? 'Stakes: drachmae' : 'Stakes: a sailor for every miss') + '   ' + (i + 1) + ' / ' + qs.length;
        return QB.ask(host, q, { timer: qteTimer(o.timer), items: true, label: o.label });
      }).then(function (res) {
        if (res.aborted) return Promise.reject('aborted');
        var cur = S.run();
        if (res.correct) {
          right++;
          cur.stats.right++; epStat('right', 1);
          cur.streak++;
          if (cur.streak > S.data.meta.bestStreak) S.data.meta.bestStreak = cur.streak;
          if (cur.streak >= 10) S.award('streak10');
          var pay = 4 + (q.lv || 1) * 2;
          if (cur.doubleCoins) pay *= 2;
          if (cur.omen && cur.omen.firstDouble && cur.omen.ep === ep.id && cur.omen.firstDouble > 0) { pay *= 2; cur.omen.firstDouble--; }
          if (cur.streak && cur.streak % 5 === 0) { pay += 10; U.toast('Streak of ' + cur.streak + '! +10 bonus', 'gold'); }
          give({ coins: pay, wisdom: 1 }, true);
        } else if (!res.skipped) {
          cur.stats.wrong++; epStat('wrong', 1);
          var es = cur.epStats[cur.ep];
          if (es) { es.missed = es.missed || []; if (es.missed.indexOf(q.id) < 0) es.missed.push(q.id); }
          cur.streak = 0;
          if (o.stakes === 'coins') give({ coins: -5 }, true);
          else give({ crew: -1, qte: true });
        }
        S.save();
        return S.run().crew > 0 ? null : Promise.reject('wreck');
      });
    });
    return chain.then(function () {
      closePanel();
      return { right: right, total: qs.length };
    }, function (why) {
      if (why === 'aborted') return { aborted: true };
      closePanel();
      return { wrecked: true };
    });
  }

  /* ---------- activity panel ---------- */
  function openPanel(cls) {
    hideTalk();
    var p = el.panel.firstChild;
    p.className = 'panel ' + (cls || '');
    p.innerHTML = '';
    el.panel.hidden = false;
    el.stage.classList.add('has-panel');
    requestAnimationFrame(function () { el.panel.classList.add('in'); });
    return p;
  }
  function closePanel() {
    el.panel.classList.remove('in');
    el.panel.hidden = true;
    el.panel.firstChild.innerHTML = '';
    el.stage.classList.remove('has-panel');
  }
  ST.openPanel = openPanel;
  ST.closePanel = closePanel;

  function runNotes(o) {
    var t = ODY.topics[o.notes] || {};
    var p = openPanel('notes-panel');
    var lines = o.say ? [].concat(o.say) : (t.voice || []);
    var head = h('div.notes-head', h('img.notes-medal', { src: 'assets/ui/narrator-medallion.svg', alt: '' }),
      h('div', h('span.notes-kicker', "The Chronicler's notes"), h('h2', t.name || o.notes)));
    var spoken = h('p.notes-spoken');
    var cols = h('div.notes-cols',
      h('div.notes-col', h('h3', 'Key points'), h('ul.notes-list', (t.key || []).map(function (k) { return h('li', { html: U.md(k) }); }))),
      h('div.notes-col', h('h3', 'Key terms'), h('dl.notes-terms', (t.terms || []).slice(0, o.terms || 5).map(function (x) {
        return [h('dt', x[0]), h('dd', { html: U.md(x[1]) })];
      }))));
    var go = h('button.btn.btn-primary', { type: 'button', disabled: true }, 'Continue');
    var bar = h('div.panel-foot', h('button.btn.btn-ghost.btn-sm', { type: 'button', html: U.icon('book', 16) + ' Open in the Library', onclick: function () { SCREENS.topicModal(o.notes); } }), go);
    p.append(head, spoken, cols, bar);
    return new Promise(function (resolve) {
      var i = 0;
      var my = ++token;
      function next() {
        if (my !== token) return;
        if (i >= lines.length) { go.disabled = false; go.classList.add('ready'); return; }
        var line = lines[i++];
        spoken.innerHTML = U.md(line);
        restartFade(spoken);
        var v = AUDIO.say('narrator', line);
        v.done.then(function () { setTimeout(next, 250); });
        el.skipNotes = function () { v.stop(); };
      }
      next();
      setTimeout(function () { go.disabled = false; }, S.opt('presenter') ? 0 : 4000);
      go.addEventListener('click', function () { token++; AUDIO.stop(); closePanel(); resolve(); });
    });
  }

  /* Captain's log: an exam move with hand-written options, untimed. */
  function runLog(o) {
    var p = openPanel('log-panel');
    var items = o.items || [o];
    var head = h('div.log-head', U.img('scroll', 'log-img'), h('div', h('span.notes-kicker', o.kicker || "Captain's log: exam move"), h('h2', o.title || 'Paper 1 practice')));
    var stem = o.stem ? h('div.log-stem', { html: U.md(o.stem) }) : null;
    var host = h('div.qte-host');
    p.append(head, stem, host);
    if (o.say) AUDIO.say('narrator', o.say);
    var right = 0;
    var chain = Promise.resolve();
    items.forEach(function (it, i) {
      chain = chain.then(function () {
        var q = { id: 'log', t: (ep.topics || ['exam'])[0], q: it.q, a: it.a, d: it.d, why: it.why, noRecord: true };
        return QB.ask(host, q, { timer: 0, items: false, noRecord: true, label: o.label || ('Exam move ' + (i + 1) + ' of ' + items.length) });
      }).then(function (res) {
        if (res.aborted) return Promise.reject('aborted');
        if (res.correct) { right++; give({ coins: 6, wisdom: 1 }, true); }
      });
    });
    return chain.then(function () { closePanel(); return { right: right, total: items.length }; }, function () { return { aborted: true }; });
  }

  /* Captain's log, written: one Section B style sentence, then a model and a self-check.
   * Saved on this device (and in the optional progress PDF). */
  function runWrite(o) {
    var p = openPanel('write-panel');
    var r = S.run();
    var key = ep.id + ':' + (o.id || 'write');
    var head = h('div.log-head', U.img('scroll', 'log-img'), h('div', h('span.notes-kicker', "Captain's log: write it"), h('h2', o.title || 'Write the link')));
    var stem = o.stem ? h('div.log-stem', { html: U.md(o.stem) }) : null;
    var qEl = h('p.qte-q', { html: U.md(o.q) });
    var ta = h('textarea.write', { style: { minHeight: '110px' }, placeholder: o.placeholder || 'Write one or two sentences. Name the theory, then say how it explains a detail: "... because ..."' });
    ta.addEventListener('paste', function (e) { e.preventDefault(); U.toast('Paste is switched off here. Write it yourself.'); });
    ta.addEventListener('drop', function (e) { e.preventDefault(); });
    var meta = h('span.small.muted');
    var min = o.min || 15;
    var go = h('button.btn.btn-primary', { type: 'button', disabled: true }, 'Compare with a model');
    var out = h('div');
    p.append(head, stem, qEl, ta, h('div.write-meta', meta, h('span', 'Paste is off.')), out, h('div.panel-foot', h('span'), go));
    if (o.say) AUDIO.say('narrator', o.say);
    /* Each key is a pattern of acceptable alternatives: the theory's own terms, and a link word. */
    var keys = (o.keys || []).map(function (k) { return new RegExp(k, 'i'); });
    function upd() {
      var words = {};
      U.words(ta.value).forEach(function (w) { if (w.length >= 3) words[w.toLowerCase()] = 1; });
      var d = Object.keys(words).length;
      var missing = keys.filter(function (k) { return !k.test(ta.value); }).length;
      meta.textContent = d + ' meaningful words' + (d < min ? ' (at least ' + min + ')' : '') +
        (missing && d >= min ? '. Use the theory\'s own terms, and link them to the scenario with "because" or "so".' : '');
      go.disabled = d < min || missing > 0;
    }
    ta.addEventListener('input', upd);
    upd();
    try { ta.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    return new Promise(function (resolve) {
      var stage2 = false;
      go.addEventListener('click', function () {
        if (!stage2) {
          stage2 = true;
          ta.readOnly = true;
          var checks = h('ul.checklist', (o.checks || []).map(function (c) { return h('li', h('label', h('input', { type: 'checkbox' }), h('span', c))); }));
          out.append(h('h3', 'A model answer'), h('div.model', o.model), h('h3', 'Does yours...'), checks);
          go.textContent = 'Save to my log';
          go.disabled = true;
          U.later(function () { go.disabled = false; }, S.opt('presenter') ? 0 : 2500);
          return;
        }
        var ticks = U.$$('input:checked', out).length;
        var w = S.data.meta.storyWrites = S.data.meta.storyWrites || {};
        w[key] = { q: o.q, text: ta.value, ticks: ticks, of: (o.checks || []).length, at: Date.now() };
        S.save();
        give({ coins: 5 + ticks * 2, wisdom: 1 }, true);
        U.toast('Saved to your log.   +' + (5 + ticks * 2) + ' dr');
        closePanel();
        resolve();
      });
    });
  }

  function runDrill(o) {
    var p = openPanel('drill-panel');
    if (o.say) AUDIO.say('narrator', o.say);
    return DRILLS.run(o.drill, o, p).then(function (res) {
      AUDIO.stop();
      closePanel();
      if (res && res.max && isFinite(res.score)) {
        var pay = res.max <= 1 ? 6 : Math.round(12 * res.score / res.max);
        if (pay) give({ coins: pay }, true);
        U.toast('Drill complete: ' + res.score + ' / ' + res.max + (pay ? '   +' + pay + ' dr' : ''), res.score === res.max ? 'gold' : '');
      }
      if (res && res.flags) Object.keys(res.flags).forEach(function (f) { setFlag(f, res.flags[f]); });
      S.save();
      return res;
    });
  }

  /* ---------- main loop ---------- */
  var running = false;
  function jump(to, fromMoly) {
    U.cancelActivities();
    token++;
    AUDIO.stop();
    el.choices.hidden = true;
    closePanel();
    pos = to;
    if (fromMoly) restage(pos);
    loop();
  }
  async function loop() {
    var myRun = ++ST.runId;
    running = true;
    while (pos < steps.length) {
      if (myRun !== ST.runId) return;
      var st = steps[pos];
      var r = S.run();
      if (!r) return;
      r.pos = pos;
      S.save();
      if (st.cond && !test(st.cond)) { pos++; continue; }
      var next = pos + 1;
      if (st.kind === 'goto') { next = labels[st.to]; if (next == null) { console.warn('No label', st.to); next = pos + 1; } }
      else if (st.kind === 'line') {
        var text = st.text.length > 1 ? U.pick(st.text) : st.text[0];
        if (st.who !== 'narrator' && st.pose && !actors[st.who]) { /* off-stage speaker: portrait only */ }
        await showLine(st.who, text, st.pose, st.face);
      } else if (st.kind === 'dir') {
        var res = await directive(st);
        if (res === 'end' || res === 'stop') return;
      } else if (st.kind === 'obj') {
        var o = st.obj;
        if (o.choice) {
          var go = await runChoice(o.choice, pos);
          if (go) next = labels[go];
        } else if (o.qte) {
          var q = await runQte(o.qte);
          if (q.wrecked || q.aborted) return;
          if (o.qte.pass != null && q.right < o.qte.pass && o.qte.fail) next = labels[o.qte.fail];
          else if (o.qte.win && q.right === q.total) next = labels[o.qte.win];
        } else if (o.drill) {
          var d = await runDrill(o);
          if (d && d.go && labels[d.go] != null) next = labels[d.go];
        } else if (o.notes) {
          await runNotes(o);
        } else if (o.log) {
          var lg = await runLog(o.log);
          if (lg && lg.aborted) return;
        } else if (o.write) {
          await runWrite(o.write);
        } else if (o.hot) {
          addHot(o.hot);
        }
        if (myRun !== ST.runId) return;
        if (S.run() && S.run().crew <= 0) return;
      }
      if (myRun !== ST.runId) return;
      pos = next;
    }
    running = false;
  }
  ST.runId = 0;

  async function directive(st) {
    var a = st.args;
    switch (st.name) {
      case 'scene': var sa = slotArgs(a); setScene(sa.bg || el.bg.dataset.scene, sa.cast); break;
      case 'enter': slotArgs(a).cast.forEach(function (c) { enter(c.slot, c.who, c.pose); }); break;
      case 'exit': a.forEach(function (w) { exit(w); }); break;
      case 'pose': a.forEach(function (x) { var p = x.split('.'); setPose(p[0], p[1]); }); break;
      case 'fx': a.forEach(stageFx); break;
      case 'sfx': AUDIO.sfx(a[0], a[1] ? +a[1] : undefined); break;
      case 'wait': hideTalk(); await U.sleep(S.opt('presenter') ? 100 : +(a[0] || 600)); break;
      case 'set': a.forEach(function (f) { setFlag(f); }); S.save(); break;
      case 'unset': a.forEach(function (f) { delete S.run().flags[f]; }); S.save(); break;
      case 'random': setFlag(U.pick(a)); S.save(); break;
      case 'give': give(parseGive(a)); if (S.run().crew <= 0) return 'stop'; break;
      case 'award': S.award(a[0]); break;
      case 'shop': hideTalk(); await SCREENS.shop({ inline: true }); ST.hud(); break;
      case 'ending': S.run().ending = a[0]; S.save(); break;
      case 'end': hideTalk(); await endEpisode(); return 'end';
    }
    return null;
  }

  /* Rebuild the stage for a resume or undo: apply staging from the last scene change. */
  function restage(upto) {
    var last = 0;
    for (var i = 0; i < upto; i++) if (steps[i].kind === 'dir' && steps[i].name === 'scene') last = i;
    for (var j = last; j < upto; j++) {
      var s = steps[j];
      if (s.kind !== 'dir') continue;
      if (s.name === 'scene') { var sa = slotArgs(s.args); setScene(sa.bg || ep.scene, sa.cast); }
      else if (s.name === 'enter') slotArgs(s.args).cast.forEach(function (c) { enter(c.slot, c.who, c.pose); });
      else if (s.name === 'exit') s.args.forEach(function (w) { exit(w, true); });
      else if (s.name === 'fx') s.args.forEach(stageFx);
    }
  }

  /* ---------- episodes ---------- */
  ST.current = function () { return ep; };
  ST.where = function () { return ep ? 'Episode ' + ep.n + ' (' + ep.title + '), step ' + (pos + 1) + ' of ' + steps.length : ''; };
  ST.log = function () { return lineLog.slice(); };

  ST.start = function (epId, opts) {
    opts = opts || {};
    U.cancelActivities();
    ST.runId++;
    ep = ODY.episodes[epId];
    var c = compile(ep);
    steps = c.steps; labels = c.labels;
    var r = S.run();
    document.body.classList.add('in-episode');
    build();
    lineLog = [];
    var resume = r.ep === epId && r.epState === 'playing' && r.pos > 0 && !opts.restart;
    // Back at the title card of an episode already begun: keep its omen and checkpoint.
    var atTitle = !resume && r.ep === epId && r.epState === 'playing' && r.pos === 0 && r.omen && r.omen.ep === epId && r.snapshot;
    r.ep = epId;
    if (!resume && !atTitle) {
      // A fresh start of this episode forgets what an earlier attempt at it decided.
      r.flagEp = r.flagEp || {};
      Object.keys(r.flagEp).forEach(function (f) { if (r.flagEp[f] === epId) { delete r.flags[f]; delete r.flagEp[f]; } });
      Object.keys(r.choices).forEach(function (k) { if (k.indexOf(epId + ':') === 0) delete r.choices[k]; });
      r.pos = 0;
      r.epState = 'playing';
      r.doubleCoins = false;
      r.choiceSnap = null;
      r.snapshot = S.snapshot();
      r.epStats[epId] = { right: 0, wrong: 0, lost: 0, coins: 0, crewStart: r.crew, calm: !!S.opt('calm') };
      r.omen = null;
    }
    S.save();
    ST.hud();
    setScene(ep.scene, []);
    if (resume) {
      pos = r.pos;
      restage(pos);
      U.toast('Resuming ' + ep.title + '.');
      loop();
    } else {
      pos = 0;
      titleCard().then(loop);
    }
  };

  function titleCard() {
    var r = S.run();
    return new Promise(function (resolve) {
      var keep = r.omen && r.omen.ep === ep.id && r.omen.applied;
      var omen = keep ? r.omen : (ep.n > 1 ? U.pick(ODY.omens) : null);
      if (omen && !keep) {
        r.omen = Object.assign({ ep: ep.id }, omen);
        var fx = {};
        if (omen.coins) fx.coins = omen.coins;
        if (omen.crew) fx.crew = omen.crew;
        if (omen.trust) fx.trust = omen.trust;
        if (omen.item) fx.item = omen.item;
        give(fx, true);
        r.omen.applied = true;
        S.save();
      }
      el.title.innerHTML = '';
      el.title.hidden = false;
      el.title.append(
        h('div.ep-kicker', 'Episode ' + ep.n + ' of ' + ODY.episodeOrder.length),
        h('h1', ep.title),
        h('p.ep-topic', ep.topic),
        omen ? h('div.omen', h('b', 'Omen: ' + omen.name), h('span', omen.text)) : null,
        h('button.btn.btn-primary.btn-lg', { type: 'button', onclick: function () { el.title.classList.add('out'); setTimeout(function () { el.title.hidden = true; el.title.classList.remove('out'); resolve(); }, 450); AUDIO.sfx('page1'); } }, 'Begin'));
      AUDIO.sfx('open');
      var bb = el.title.querySelector('button');
      try { bb.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    });
  }

  async function endEpisode() {
    var r = S.run();
    AUDIO.stop();
    r.epState = 'done';
    var st = r.epStats[ep.id] || {};
    var md = S.data.meta.epDone[ep.id] = S.data.meta.epDone[ep.id] || { times: 0 };
    md.times += 1;
    md.best = Math.max(md.best || 0, r.crew);
    md.last = Date.now();
    if (!st.lost) S.award('all_hands');
    if (st.calm) S.award('calm');
    S.award('first_steps');
    QB.checkMastery();
    S.history({ type: 'episode', ep: ep.id, crew: r.crew, coins: r.coins, right: st.right, wrong: st.wrong });
    r.choiceSnap = null;
    var idx = ODY.episodeOrder.indexOf(ep.id);
    var nextId = ODY.episodeOrder[idx + 1];
    S.save();
    await SCREENS.episodeEnd(ep, st, nextId);
  }

  var wrecking = false;
  function shipwreck() {
    var r = S.run();
    if (!r || wrecking || r.epState === 'wrecked') return;
    wrecking = true;
    token++;
    ST.runId++;
    U.cancelActivities();
    AUDIO.stop();
    r.epState = 'wrecked';
    r.choiceSnap = null;
    S.award('shipwreck');
    S.endingFound('lost');
    S.history({ type: 'wreck', ep: ep && ep.id });
    S.saveNow();
    el.title.hidden = true;
    setTimeout(function () { wrecking = false; SCREENS.wreck(ep); }, 700);
  }
  /* Open the wreck panel for a run that was already shipwrecked (after a reload). */
  ST.showWreck = function (epId) {
    ep = ODY.episodes[epId];
    var c = compile(ep);
    steps = c.steps; labels = c.labels;
    U.cancelActivities();
    document.body.classList.add('in-episode');
    build();
    setScene(ep.scene, []);
    ST.hud();
    SCREENS.wreck(ep);
  };
  ST.shipwreck = shipwreck;

  /* Restart the current episode from its checkpoint (no penalty, no farming). */
  ST.restartEpisode = function (epId) {
    var r = S.run();
    if (r && r.snapshot && r.snapshot.ep === epId) {
      var restored = JSON.parse(JSON.stringify(r.snapshot));
      restored.snapshot = r.snapshot;
      restored.epState = 'restart';
      S.data.run = restored;
      S.save();
    }
    ST.start(epId, { restart: true });
  };

  ST.retry = function () {
    var r = S.run();
    var id = r.ep || (ep && ep.id);
    var snap = r.snapshot;
    if (!snap) { ST.start(id, { restart: true }); return; }
    var restored = JSON.parse(JSON.stringify(snap));
    restored.crew = Math.max(6, restored.crew);
    restored.coins = Math.floor(restored.coins / 2);
    restored.snapshot = snap;
    restored.epState = 'retry';
    S.data.run = restored;
    S.save();
    ST.start(id, { restart: true });
  };

  ST.leave = function () {
    U.cancelActivities();
    token++;
    ST.runId++;
    AUDIO.stop();
    document.body.classList.remove('in-episode');
    ST.hud();
  };

  ST.showLog = function () {
    var list = h('div.log-list', lineLog.slice(-80).map(function (l) {
      var c = ODY.cast[l.who] || { name: l.who, color: '#ccc' };
      return h('div.log-line' + (l.who === 'narrator' ? '.log-narr' : ''), h('b', { style: { color: c.color } }, c.name), h('span', { html: U.md(l.text) }));
    }));
    U.modal('Dialogue log', lineLog.length ? list : h('p', 'Nothing has been said yet.'));
    setTimeout(function () { list.scrollTop = list.scrollHeight; }, 30);
  };

  /* Keyboard: Space / Enter / PageDown / right arrow move the story on. */
  document.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('in-episode')) return;
    if (document.querySelector('dialog[open]')) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown' || e.key === 'ArrowRight') {
      if (advanceWaiter) { e.preventDefault(); tryAdvance(); }
    }
  });
})();
