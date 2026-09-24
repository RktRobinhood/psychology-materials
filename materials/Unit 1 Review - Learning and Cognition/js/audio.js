/* Voice and sound effects.
 * Voice: a pre-rendered MP3 per line (assets/voice/<speaker>_<hash>.mp3, listed in
 * data/voice-manifest.js). If a line has no file, the browser's own speech is used,
 * and if that is off or missing, the line is simply shown for reading time.
 * Sound effects: Kenney CC0 WAVs, throttled so rapid clicks do not stack. */
(function () {
  'use strict';
  var A = window.AUDIO = {};
  var SFX = ['tap', 'correct', 'wrong', 'notify', 'unlock', 'open', 'close', 'page1', 'page2', 'tick', 'count', 'tile',
    'sigil', 'victory', 'shatter', 'back', 'clunk', 'creak', 'door', 'escape', 'dial'];
  var pool = {};
  var lastPlay = {};
  var current = null;

  function sfxOn() { return S.opt('sfx'); }
  function voiceOn() { return S.opt('voice'); }

  A.sfx = function (name, vol) {
    if (!sfxOn() || SFX.indexOf(name) < 0) return;
    var now = performance.now();
    if (lastPlay[name] && now - lastPlay[name] < 90) return;
    lastPlay[name] = now;
    try {
      var list = pool[name] = pool[name] || [];
      var a = list.filter(function (x) { return x.paused || x.ended; })[0];
      if (!a) {
        if (list.length >= 3) return;
        a = new Audio('assets/sfx/' + name + '.wav');
        list.push(a);
      }
      a.volume = vol == null ? 0.55 : vol;
      a.currentTime = 0;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* ignore */ }
  };

  /* ---------- voice ---------- */
  var synthVoices = [];
  function loadVoices() {
    try { synthVoices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { synthVoices = []; }
  }
  if (window.speechSynthesis) {
    loadVoices();
    try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { /* ignore */ }
  }
  function chooseVoice(profile, lang, speaker) {
    if (!synthVoices.length) loadVoices();
    var en = synthVoices.filter(function (v) { return /^en/i.test(v.lang); });
    if (!en.length) return null;
    var prefs = (profile && profile.prefer) || [];
    // Named voices first; then gender words matched as whole words ("male" must not match "Female").
    for (var i = 0; i < prefs.length; i++) {
      var p = prefs[i].toLowerCase();
      if (p === 'male' || p === 'female') continue;
      var hit = en.filter(function (v) { return v.name.toLowerCase().indexOf(p) >= 0 || v.lang.toLowerCase() === p; })[0];
      if (hit) return hit;
    }
    var female = prefs.some(function (x) { return x.toLowerCase() === 'female'; });
    var wantRe = female ? /\bfemale\b|\bwoman\b|zira|susan|hazel|libby|sonia|samantha|karen|victoria|moira|fiona|serena/i
      : /(^|[^e])\bmale\b|\bman\b|david|mark|george|ryan|thomas|daniel|arthur|james|oliver|alex|fred/i;
    var pool = en.filter(function (v) { return wantRe.test(v.name) && !(female ? false : /female/i.test(v.name)); });
    if (!pool.length) pool = en;
    return pool[parseInt(U.hash(speaker || 'x'), 36) % pool.length] || pool[0];
  }

  A.hasFile = function (speaker, text) {
    return !!(ODY.voices && ODY.voices[U.voiceKey(speaker, text)]);
  };
  A.readingMs = function (text) {
    return U.clamp(900 + String(text).length * 42, 1500, 12000);
  };

  /* Plays one line. Returns {done: Promise, stop()}. `done` resolves true when the
   * line finished on its own, false when stopped. */
  A.say = function (speaker, text) {
    A.stop();
    var ctl = { stopped: false };
    var resolveFn;
    ctl.done = new Promise(function (r) { resolveFn = r; });
    ctl.finish = function (natural) {
      if (ctl.ended) return;
      ctl.ended = true;
      resolveFn(natural);
    };
    ctl.stop = function () {
      ctl.stopped = true;
      if (ctl.audio) { try { ctl.audio.pause(); } catch (e) { /* ignore */ } }
      if (ctl.synth && window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
      clearTimeout(ctl.timer);
      ctl.finish(false);
    };
    current = ctl;
    ctl.mode = 'text';
    if (!voiceOn() || !text) {
      ctl.timer = setTimeout(function () { ctl.finish(true); }, A.readingMs(text));
      return ctl;
    }
    var key = U.voiceKey(speaker, text);
    if (ODY.voices && ODY.voices[key]) {
      ctl.mode = 'file';
      var a = new Audio('assets/voice/' + key + '.mp3');
      ctl.audio = a;
      a.volume = speaker === 'narrator' ? 1 : 0.95;
      a.onended = function () { ctl.finish(true); };
      a.onerror = function () { if (!ctl.stopped) synth(ctl, speaker, text); };
      var p = a.play();
      if (p && p.catch) p.catch(function () { if (!ctl.stopped) synth(ctl, speaker, text); });
      return ctl;
    }
    synth(ctl, speaker, text);
    return ctl;
  };

  function synth(ctl, speaker, text) {
    var cast = ODY.cast[speaker] || ODY.cast.narrator;
    if (!S.opt('browserVoice') || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      ctl.mode = 'text';
      ctl.timer = setTimeout(function () { ctl.finish(true); }, A.readingMs(text));
      return;
    }
    try {
      ctl.mode = 'synth';
      ctl.synth = true;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
      var v = chooseVoice(cast.tts, cast.lang, speaker);
      if (v) u.voice = v;
      u.lang = (v && v.lang) || cast.lang || 'en-GB';
      u.pitch = (cast.tts && cast.tts.pitch) || 1;
      u.rate = (cast.tts && cast.tts.rate) || 1;
      u.onend = function () { ctl.finish(true); };
      u.onerror = function (e) {
        if (ctl.stopped || (e && (e.error === 'interrupted' || e.error === 'canceled'))) return;
        // Speech failed: fall back to reading time so autoplay does not race ahead.
        ctl.mode = 'text';
        clearTimeout(ctl.timer);
        ctl.timer = setTimeout(function () { ctl.finish(true); }, A.readingMs(text));
        if (!A._warned) { A._warned = true; if (window.U) U.toast('Voice unavailable on this device: reading mode.'); }
      };
      speechSynthesis.speak(u);
      // Some browsers never fire onend; never leave the player stuck.
      ctl.timer = setTimeout(function () { ctl.finish(true); }, A.readingMs(text) * 2.2 + 4000);
    } catch (e) {
      ctl.mode = 'text';
      ctl.timer = setTimeout(function () { ctl.finish(true); }, A.readingMs(text));
    }
  }

  A.stop = function () {
    if (current && !current.ended) current.stop();
    current = null;
  };
  A.speaking = function () { return !!(current && !current.ended); };

  /* Mobile browsers only allow audio after a tap; warm up on the first one. */
  var warmed = false;
  document.addEventListener('pointerdown', function () {
    if (warmed) return;
    warmed = true;
    try {
      var a = new Audio('assets/sfx/tick.wav');
      a.volume = 0;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* ignore */ }
  }, { capture: true });
})();
