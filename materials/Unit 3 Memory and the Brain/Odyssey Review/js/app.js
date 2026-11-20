/* App shell: routing between screens, top bar buttons, settings. */
(function () {
  'use strict';
  var APP = window.APP = {};
  var current = 'title';

  APP.go = function (where, arg) {
    if (window.TRIALS && TRIALS.dirty() && !confirm('Leave the Trials? Your draft is saved, but a timed mock paper will stop.')) return;
    U.closeModal();
    var m = document.getElementById('menuDlg');
    if (m.open) m.close();
    current = where;
    if (where === 'title') SCREENS.title();
    else if (where === 'map') SCREENS.map();
    else if (where === 'library') SCREENS.library(arg);
    else if (where === 'trials') TRIALS.screen(arg);
    else if (where === 'progress') SCREENS.progress();
    else if (where === 'gauntlet') SCREENS.gauntlet();
    STORY.hud();
    window.scrollTo(0, 0);
  };

  APP.newVoyage = function () {
    if (S.run() && S.run().epState && !confirm('Start a new voyage from Troy? Your current crew, drachmae and items will be replaced. Mastery and laurels are kept.')) return;
    S.newRun(ODY.episodeOrder[0]);
    current = 'episode';
    STORY.start(ODY.episodeOrder[0], { restart: true });
  };

  APP.continueRun = function () {
    var r = S.run();
    if (!r) { APP.newVoyage(); return; }
    current = 'episode';
    if (r.epState === 'wrecked') { STORY.showWreck(r.ep); return; }
    if (r.epState === 'done') {
      var idx = ODY.episodeOrder.indexOf(r.ep);
      var next = ODY.episodeOrder[idx + 1];
      if (!next) { SCREENS.ending(r.ending || 'canon'); return; }
      r.ep = next; r.epState = 'new'; r.pos = 0; S.save();
      STORY.start(next, { restart: true });
      return;
    }
    STORY.start(r.ep, { restart: r.epState !== 'playing' });
  };

  APP.applySettings = function () {
    document.documentElement.style.setProperty('--fs', S.opt('textSize') || 1);
    var snd = document.getElementById('soundBtn');
    var on = S.opt('voice') || S.opt('sfx');
    snd.innerHTML = U.icon(on ? 'sound' : 'mute', 20);
    snd.title = on ? 'Sound on (click to mute)' : 'Sound off (click to turn on)';
    document.body.classList.toggle('presenter', !!S.opt('presenter'));
    document.body.classList.toggle('calm', !!S.opt('calm'));
  };

  function wire() {
    document.getElementById('homeBtn').addEventListener('click', function () { APP.go('title'); });
    document.getElementById('mapBtn').innerHTML = U.icon('map', 20);
    document.getElementById('mapBtn').addEventListener('click', function () { APP.go('map'); });
    document.getElementById('menuBtn').innerHTML = U.icon('menu', 20);
    document.getElementById('menuBtn').addEventListener('click', SCREENS.menu);
    document.getElementById('logBtn').innerHTML = U.icon('log', 20);
    document.getElementById('logBtn').addEventListener('click', STORY.showLog);
    document.getElementById('hudBag').addEventListener('click', STORY.satchel);
    document.getElementById('soundBtn').addEventListener('click', function () {
      var on = S.opt('voice') || S.opt('sfx');
      S.set('voice', !on); S.set('sfx', !on);
      if (on) AUDIO.stop();
      APP.applySettings();
    });
    document.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { b.closest('dialog').close(); AUDIO.stop(); });
    });
    document.getElementById('modalDlg').addEventListener('close', function () { if (!document.body.classList.contains('in-episode')) AUDIO.stop(); });
  }

  (window.MindfieldReport = window.MindfieldReport || {}).where = function () {
    if (document.body.classList.contains('in-episode')) return STORY.where();
    return 'Screen: ' + current;
  };

  document.addEventListener('DOMContentLoaded', function () {
    wire();
    APP.applySettings();
    if (!S.canSave) {
      var bar = U.h('div.save-warning', { role: 'status' }, 'This browser is not saving your progress (private window or blocked storage). If you want a record, save a progress PDF from Progress before you close the tab.');
      document.getElementById('app').insertBefore(bar, document.getElementById('view'));
    }
    APP.go('title');
  });
})();
