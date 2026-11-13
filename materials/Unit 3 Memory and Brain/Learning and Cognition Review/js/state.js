/* Save data: settings, long-term progress (meta) and the current voyage (run).
 * Everything lives in localStorage; every access is guarded because private
 * windows and locked-down school browsers can throw. */
(function () {
  'use strict';
  var KEY = 'odyssey-unit1-review-v1';
  var S = window.S = {};

  function fresh() {
    return {
      v: 1,
      name: '', cls: '',
      settings: { voice: true, sfx: true, browserVoice: true, calm: false, autoplay: true, textSize: 1, presenter: false },
      meta: {
        runs: 0, endings: {}, achievements: {}, epDone: {}, bought: 0, chests: 0,
        choiceHist: {}, lopSeed: null, q: {}, trials: {}, history: [], bestStreak: 0, maxCoins: 0,
        started: Date.now(), activeMs: 0
      },
      run: null
    };
  }

  S.data = fresh();
  /* Probe storage once, so the app can warn students whose progress will not be kept. */
  S.canSave = (function () {
    try { localStorage.setItem(KEY + '-probe', '1'); localStorage.removeItem(KEY + '-probe'); return true; } catch (e) { return false; }
  })();
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.v === 1) {
        var base = fresh();
        S.data = Object.assign(base, parsed);
        S.data.settings = Object.assign(base.settings, parsed.settings || {});
        S.data.meta = Object.assign(base.meta, parsed.meta || {});
      }
    }
  } catch (e) { /* storage unavailable: play without saving */ }

  var timer = null;
  S.save = function () {
    clearTimeout(timer);
    timer = setTimeout(S.saveNow, 250);
  };
  S.saveNow = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.data)); } catch (e) { /* ignore */ }
  };
  window.addEventListener('pagehide', S.saveNow);
  document.addEventListener('visibilitychange', function () { if (document.hidden) S.saveNow(); });

  /* Count active time (tab visible) for the teacher's evidence. */
  var lastTick = Date.now();
  setInterval(function () {
    var now = Date.now();
    if (!document.hidden && now - lastTick < 20000) S.data.meta.activeMs += now - lastTick;
    lastTick = now;
  }, 5000);

  S.reset = function () {
    S.data = fresh();
    S.saveNow();
  };

  S.set = function (k, v) { S.data.settings[k] = v; S.save(); };
  S.opt = function (k) { return S.data.settings[k]; };

  /* ---------- the voyage ---------- */
  S.newRun = function (startEp) {
    var epIdx = Math.max(0, ODY.episodeOrder.indexOf(startEp || ODY.episodeOrder[0]));
    var jumped = epIdx > 0;
    S.data.meta.runs += 1;
    S.data.run = {
      id: Date.now().toString(36),
      ep: ODY.episodeOrder[epIdx],
      crew: jumped ? 10 : 12, crewMax: 12,
      coins: jumped ? 60 : 30,
      wrath: 0, trust: 1, wisdom: 0,
      items: jumped ? ['owl'] : [],
      flags: {}, choices: {},
      pos: 0, epState: null, snapshot: null, choiceSnap: null,
      streak: 0, shield: 0, doubleCoins: false, omen: null,
      stats: { right: 0, wrong: 0, lost: 0 }, epStats: {},
      jumped: jumped, calmOnly: true, startedAt: Date.now()
    };
    S.save();
    return S.data.run;
  };
  S.run = function () { return S.data.run; };

  S.snapshot = function () {
    var r = S.data.run;
    var copy = JSON.parse(JSON.stringify(r));
    copy.snapshot = null; copy.choiceSnap = null;
    return copy;
  };

  S.addCoins = function (n) {
    var r = S.data.run;
    if (!r || !isFinite(n)) return 0;
    r.coins = Math.max(0, (isFinite(r.coins) ? r.coins : 0) + n);
    if (r.coins > S.data.meta.maxCoins) S.data.meta.maxCoins = r.coins;
    if (r.coins >= 300) S.award('rich');
    S.save();
    return n;
  };

  S.flag = function (name) { var r = S.data.run; return !!(r && r.flags[name]); };

  S.recordChoice = function (key, optText) {
    var r = S.data.run;
    if (r) r.choices[key] = optText;
    var h = S.data.meta.choiceHist[key] = S.data.meta.choiceHist[key] || {};
    h[optText] = (h[optText] || 0) + 1;
    S.save();
  };

  /* ---------- achievements ---------- */
  S.award = function (id) {
    if (S.data.meta.achievements[id]) return false;
    var a = ODY.achievements.filter(function (x) { return x.id === id; })[0];
    if (!a) return false;
    S.data.meta.achievements[id] = Date.now();
    S.save();
    if (window.AUDIO) AUDIO.sfx('sigil');
    if (window.U) U.toast('<b>Laurel earned: ' + U.esc(a.name) + '</b><br>' + U.esc(a.desc), 'gold', 3600);
    return true;
  };

  S.endingFound = function (id) {
    if (!S.data.meta.endings[id]) S.data.meta.endings[id] = Date.now();
    var homeEndings = ['crew', 'canon', 'scholar', 'wrath', 'doubt'];
    if (homeEndings.every(function (e) { return S.data.meta.endings[e]; })) S.award('all_endings');
    S.save();
  };

  S.history = function (entry) {
    entry.at = Date.now();
    S.data.meta.history.push(entry);
    if (S.data.meta.history.length > 60) S.data.meta.history.shift();
    S.save();
  };
})();
