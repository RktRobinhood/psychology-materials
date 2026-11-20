/* Memory Quest — character voices.
   Every spoken line is a pre-rendered MP3 (assets/voice/<speaker>_<hash>.mp3, listed in
   data/voice-manifest.js), made at build time with Gemini TTS by
   design/working-memory-cognitive-load/tools/voices.mjs. Lines without a file stay silent.
   The text rules below are shared with that tool (it loads this file), so the hashes match. */
(() => {
  const V = window.MQVoice = {};

  /* FNV-1a 32-bit, base 36. The file name is speaker + hash of "speaker|text". */
  V.hash = s => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  };
  V.key = (who, text) => who + '_' + V.hash(who + '|' + text);

  /* Spoken versions of on-screen text. Plain string rules, no DOM, so Node gives the same result. */
  const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };
  const end = s => /[.!?:…]["”’)]?$/.test(s) ? s : s + '.';
  const join = parts => parts.map(s => (s || '').trim()).filter(Boolean).map(end).join(' ');
  V.strip = html => String(html || '')
    .replace(/\{i:\w+\}/g, '')
    .replace(/<li class="plus">/g, '<li>Strength: ')
    .replace(/<li class="minus">/g, '<li>Limitation: ')
    .replace(/<\/(p|li|h\d|div)>/g, '. ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(\w+|#\d+);/g, (m, e) => ENT[e] || m)
    .replace(/\s*\.\s*(\.\s*)+/g, '. ')
    .replace(/([.!?:…])\s*\./g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // The message heard (not seen) in the Story Loom task.
  V.loom = { who: 'lyra', text: 'When the bells ring at sunset, take it to the north tower. Tell no one.' };

  /* The line spoken when a screen opens. Keyfacts read the card; the rest read the dialogue box. */
  V.screenLine = sc => {
    if (!sc || !sc.speaker) return null;
    const text = sc.type === 'keyfact' ? join([sc.title ? 'Remember this: ' + sc.title.toLowerCase() : '', sc.text, sc.detail]) : sc.text;
    return text ? { who: sc.speaker.toLowerCase(), text } : null;
  };
  V.studyLine = step => ({ who: 'selene', text: join([step.tag, step.title, V.strip(step.html)]) });
  V.partLine = part => ({ who: 'selene', text: join([part.name, V.strip(part.text), V.strip(part.you)]) });

  /* Every line that should have a recording (used by the build tool). */
  V.allLines = (data, studies, parts) => {
    const out = [];
    const add = l => { if (l && l.text && !out.some(o => o.who === l.who && o.text === l.text)) out.push(l); };
    data.chapters.forEach(ch => ch.screens.forEach(sc => add(V.screenLine(sc))));
    Object.values(studies || {}).forEach(st => st.steps.forEach(s => add(V.studyLine(s))));
    (parts || []).forEach(p => add(V.partLine(p)));
    add(V.loom);
    return out;
  };

  /* ── player ─────────────────────────────────────────────
     say() returns a promise: true if the recording played to the end, false if it was
     missing, muted or interrupted. { after: true } waits for the current line first. */
  let volume = () => 1;
  let current = null, gen = 0, tail = Promise.resolve();
  V.setVolume = fn => { volume = fn; };
  V.has = (who, text) => !!(window.MQ_VOICES && window.MQ_VOICES[V.key(who, text)]);
  V.stop = () => {
    gen++;
    if (current) { const c = current; current = null; try { c.audio.pause(); } catch { /* none */ } c.finish(false); }
  };
  V.say = (who, text, opts = {}) => {
    if (!opts.after) V.stop();
    const my = gen;
    const live = () => my === gen;
    const run = (opts.after ? tail : Promise.resolve()).then(async () => {
      if (opts.delay && live()) await new Promise(r => setTimeout(r, opts.delay));
      const vol = volume();
      if (!live() || !vol || !V.has(who, text)) return false;
      const audio = new Audio(`assets/voice/${V.key(who, text)}.mp3`);
      audio.volume = vol;
      let finish;
      const done = new Promise(r => { finish = r; });
      const c = current = { audio, finish: ok => { if (current === c) current = null; finish(ok); } };
      audio.onended = () => c.finish(true);
      audio.onerror = () => c.finish(false);
      const p = audio.play();
      if (p && p.catch) p.catch(() => c.finish(false));
      return done;
    });
    tail = run.catch(() => false);
    return run;
  };
})();
