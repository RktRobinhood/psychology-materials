/* Small shared helpers. Classic script: everything hangs off window.U. */
(function () {
  'use strict';
  var U = window.U = {};

  /* Let node.append(a, cond ? b : null) skip empty values instead of printing "null". */
  ['append', 'prepend', 'before', 'after'].forEach(function (m) {
    var orig = Element.prototype[m];
    Element.prototype[m] = function () {
      var args = Array.prototype.filter.call(arguments, function (a) { return a !== null && a !== undefined && a !== false; });
      return orig.apply(this, args);
    };
  });

  /* Activity scope: anything with timers or document-level listeners registers a
   * cleanup here, and every navigation calls U.cancelActivities(). */
  var cleanups = [];
  U.gen = 0;
  U.onCancel = function (fn) {
    cleanups.push(fn);
    return function () { var i = cleanups.indexOf(fn); if (i >= 0) cleanups.splice(i, 1); };
  };
  U.cancelActivities = function () {
    U.gen++;
    var list = cleanups.splice(0);
    list.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  };
  /* setTimeout / setInterval that die with the activity scope. */
  U.later = function (fn, ms) {
    var g = U.gen;
    return setTimeout(function () { if (g === U.gen) fn(); }, ms);
  };

  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* h('div.card#id', {onclick: fn, html: '...'}, child, 'text', [children]) */
  U.h = function (tag, props) {
    var m = tag.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i);
    var node = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) {
      m[2].replace(/([.#])([\w-]+)/g, function (_, kind, name) {
        if (kind === '.') node.classList.add(name); else node.id = name;
      });
    }
    var start = 1;
    if (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) {
      start = 2;
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === undefined || v === null || v === false) return;
        if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      });
    }
    for (var i = start; i < arguments.length; i++) U.append(node, arguments[i]);
    return node;
  };
  U.append = function (node, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { U.append(node, c); }); return; }
    if (typeof child === 'string' && child.indexOf('<svg') === 0) { node.insertAdjacentHTML('beforeend', child); return; }
    node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  };

  U.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  /* Light markup for data text: **bold** and *italic*. */
  U.md = function (s) {
    return U.esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  };

  U.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  U.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  U.clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  U.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  U.words = function (s) { return (String(s).trim().match(/[\p{L}\p{N}'’-]+/gu) || []); };
  U.distinctWords = function (s) {
    var seen = {};
    U.words(s).forEach(function (w) { seen[w.toLowerCase()] = 1; });
    return Object.keys(seen).length;
  };

  /* FNV-1a 32-bit, base 36. Must match tools/voices.mjs so audio files are found. */
  U.hash = function (str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(36);
  };
  U.voiceKey = function (speaker, text) { return speaker + '_' + U.hash(speaker + '|' + text); };

  U.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  U.isPhone = function () { return window.innerWidth < 700; };

  U.prop = function (name) { return 'assets/props/' + name + '.webp'; };
  U.img = function (name, cls, alt) { return U.h('img.' + (cls || 'prop-img'), { src: U.prop(name), alt: alt || '', draggable: 'false' }); };

  /* Custom line icons (drawn for this lesson). */
  var ICONS = {
    sound: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    mute: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    log: '<path d="M6 3h10l3 3v15H6z"/><path d="M9 9h7M9 13h7M9 17h4"/>',
    oar: '<path d="M5 19L15 9"/><path d="M14 4c3 0 6 3 6 6l-3 3c-2-1-5-4-6-6z"/>',
    trident: '<path d="M12 22V6M6 3v5a6 6 0 0 0 12 0V3M12 3v3"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    replay: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    pen: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    teacher: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    skip: '<path d="M5 5l9 7-9 7zM17 5v14"/>'
  };
  U.icon = function (name, size) {
    var s = size || 20;
    return '<svg class="ico" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  };

  U.toast = function (html, kind, ms) {
    var box = document.getElementById('toasts');
    var t = U.h('div.toast' + (kind ? '.toast-' + kind : ''), { html: html });
    box.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('in'); });
    setTimeout(function () { t.classList.remove('in'); setTimeout(function () { t.remove(); }, 400); }, ms || 2600);
  };

  U.modal = function (title, body, opts) {
    var dlg = document.getElementById('modalDlg');
    document.getElementById('modalTitle').textContent = title;
    var b = document.getElementById('modalBody');
    b.innerHTML = '';
    U.append(b, body);
    dlg.classList.toggle('dlg-narrow', !!(opts && opts.narrow));
    if (!dlg.open) dlg.showModal();
    return dlg;
  };
  U.closeModal = function () { var d = document.getElementById('modalDlg'); if (d.open) d.close(); };

  U.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  };
})();
