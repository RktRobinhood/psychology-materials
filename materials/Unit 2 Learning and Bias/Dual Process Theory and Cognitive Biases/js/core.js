/* Two Minds — shared core: station registry, utilities, UI helpers, local data pool.
   Station files call DPT.register({...}); app.js builds the pages from the registry. */
(function () {
  'use strict';

  const stations = [];

  const util = {
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    coin() { return Math.random() < 0.5; },
    esc(s) {
      return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },
    mean(xs) { return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN; },
    median(xs) {
      if (!xs.length) return NaN;
      const s = xs.slice().sort((a, b) => a - b);
      const m = Math.floor(s.length / 2);
      return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    },
    pct(n, d) { return d ? Math.round((n / d) * 100) : 0; },
    fmt(n, digits = 0) {
      if (!Number.isFinite(n)) return '—';
      return n.toLocaleString('en-GB', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
    },
    sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
    num(value) {
      const n = parseFloat(String(value).replace(/[, ]/g, ''));
      return Number.isFinite(n) ? n : NaN;
    },
    /** Build an element from an HTML string (first element). */
    el(html) {
      const t = document.createElement('template');
      t.innerHTML = html.trim();
      return t.content.firstElementChild;
    },
  };

  /* ── Local data pool ─────────────────────────────────────────
     Each station laptop remembers anonymous results from everyone who
     has tried the experiment on that device, so between-groups studies
     (anchoring, framing …) can show real class data. */
  const memoryPools = {};
  function pool(id) {
    const key = 'two-minds-pool-' + id;
    const read = () => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return memoryPools[key] || []; }
    };
    const write = (rows) => {
      memoryPools[key] = rows;
      try { localStorage.setItem(key, JSON.stringify(rows)); } catch (e) { /* private window etc. */ }
    };
    return {
      all: read,
      add(rec) { const rows = read(); rows.push({ ...rec, t: Date.now() }); write(rows.slice(-400)); },
      clear() { write([]); },
    };
  }

  /* ── UI helpers (return HTML strings) ────────────────────── */
  const ui = {
    /** Side-by-side System 1 vs System 2 panel. */
    s1s2(s1, s2, labels = {}) {
      return `<div class="s1s2">
        <div class="sys s1"><div class="sys-tag"><i data-lucide="rabbit"></i>${labels.s1 || 'System 1 · fast'}</div>${s1}</div>
        <div class="sys s2"><div class="sys-tag"><i data-lucide="turtle"></i>${labels.s2 || 'System 2 · slow'}</div>${s2}</div>
      </div>`;
    },
    callout(type, html) { return `<div class="callout ${type}">${html}</div>`; },
    /** Key-study card. rows: [[label, html], ...] */
    study({ name, rows = [], note = '' }) {
      return `<div class="study">
        <div class="study-name">${name}</div>
        <dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        ${note ? `<p class="study-note">${note}</p>` : ''}
      </div>`;
    },
    /** Horizontal bars. items: [{label, value, max, cls, text}] */
    bars(items) {
      const max = Math.max(...items.map(i => i.max ?? i.value), 1);
      return `<div class="bars">${items.map(i => {
        const w = Math.max(2, Math.min(100, ((i.value || 0) / (i.max ?? max)) * 100));
        return `<div class="bar-row"><div class="bar-label">${i.label}</div>
          <div class="bar-track"><div class="bar-fill ${i.cls || ''}" style="width:${Number.isFinite(w) ? w : 2}%"></div></div>
          <div class="bar-val">${i.text ?? util.fmt(i.value)}</div></div>`;
      }).join('')}</div>`;
    },
    /** Big definition block. */
    define(term, def) {
      return `<div class="define"><div class="define-term">${term}</div><p>${def}</p></div>`;
    },
    /** Numbered, explicit walk-through list. */
    steps(items) {
      return `<ol class="walk">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
    },
    stat(value, label, cls = '') {
      return `<div class="stat ${cls}"><div class="stat-v">${value}</div><div class="stat-l">${label}</div></div>`;
    },
    poolNote(n) {
      return `<p class="pool-note">Data from <b>${n}</b> ${n === 1 ? 'person' : 'people'} who have done this on this laptop.</p>`;
    },
  };

  /* ── Sound effects (Kenney, CC0; see assets/audio/CREDITS.md) ──
     Web Audio for low latency. Buffers load on the first user gesture. */
  const SFX = {
    tap: 0.45, flip: 0.5, lock: 0.55, correct: 0.5, wrong: 0.55, tick: 0.35,
    reveal: 0.9, click: 0.5, suspense: 0.35, win: 0.6, done: 0.55,
  };
  const sfx = (() => {
    let ac = null;
    const buffers = {};
    const lastPlayed = {};
    let voices = 0;
    let muted = false;
    try { muted = localStorage.getItem('two-minds-muted') === '1'; } catch (e) { /* ignore */ }
    function init() {
      if (ac) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      Object.keys(SFX).forEach(name => {
        fetch(`assets/audio/${name}.ogg`)
          .then(r => r.arrayBuffer())
          .then(b => ac.decodeAudioData(b))
          .then(buf => { buffers[name] = buf; })
          .catch(() => { /* missing or unsupported: stay silent */ });
      });
    }
    ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, () => {
      init();
      if (ac && ac.state === 'suspended') ac.resume();
    }, { capture: true }));
    return {
      play(name, vol = 1) {
        if (muted || !ac || !buffers[name]) return;
        // Stop rapid clicks from stacking into noise.
        const now = performance.now();
        if (now - (lastPlayed[name] || 0) < 80 || voices >= 4) return;
        lastPlayed[name] = now;
        voices++;
        const src = ac.createBufferSource();
        src.onended = () => { voices--; };
        const gain = ac.createGain();
        gain.gain.value = (SFX[name] ?? 0.5) * vol;
        src.buffer = buffers[name];
        src.connect(gain).connect(ac.destination);
        src.start();
      },
      get muted() { return muted; },
      toggle() {
        muted = !muted;
        try { localStorage.setItem('two-minds-muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
        return muted;
      },
    };
  })();

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._h);
    toast._h = setTimeout(() => t.classList.remove('show'), 2400);
  }

  window.DPT = {
    stations,
    register(def) {
      stations.push(def);
      stations.sort((a, b) => a.num - b.num);
    },
    get(id) { return stations.find(s => s.id === id || String(s.num) === String(id)); },
    util,
    ui,
    pool,
    sfx,
    toast,
  };
})();
