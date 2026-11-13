/* An optional record of the student's review: a PDF (jsPDF), with fallbacks to open in a
 * new tab, print to PDF, or copy as text. The built-in PDF font covers Latin-1,
 * so Danish letters (æ, ø, å) survive; other characters are mapped or dropped. */
(function () {
  'use strict';
  var h = U.h;
  var E = window.EVIDENCE = {};
  var SRC = ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'];
  var loading = null;
  function ready() { return !!(window.jspdf && window.jspdf.jsPDF); }
  function ensure() {
    if (ready()) return Promise.resolve(true);
    if (loading) return loading;
    loading = SRC.reduce(function (chain, src) {
      return chain.then(function (ok) {
        return ok || new Promise(function (res) {
          var s = document.createElement('script');
          s.src = src;
          s.onload = function () { res(ready()); };
          s.onerror = function () { res(false); };
          document.head.appendChild(s);
        });
      });
    }, Promise.resolve(false)).then(function (ok) { if (!ok) loading = null; return ok; });
    return loading;
  }
  setTimeout(ensure, 3000);

  function safe(v) {
    return String(v == null ? '' : v).normalize('NFKC')
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...')
      .replace(/→/g, '->').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/×/g, 'x').replace(/•|·/g, '-')
      .replace(/★/g, '*').replace(/[^\x00-\xFF]/g, '');
  }

  function sections() {
    var m = S.data.meta;
    var out = [];
    var eps = ODY.episodeOrder.map(function (id) {
      var e = ODY.episodes[id], d = m.epDone[id];
      return { label: 'Episode ' + e.n + ': ' + e.title + ' (' + e.topic + ')', value: d ? 'Completed ' + d.times + 'x, best crew ' + d.best : 'Not completed' };
    });
    out.push({ heading: 'The voyage', items: eps.concat([
      { label: 'Endings found', value: Object.keys(m.endings).map(function (k) { return ODY.endings[k] ? ODY.endings[k].title : k; }).join(', ') || 'None yet' },
      { label: 'Laurels earned', value: Object.keys(m.achievements).length + ' of ' + ODY.achievements.length },
      { label: 'Voyages started / best streak / active time', value: m.runs + ' / ' + m.bestStreak + ' / ' + Math.round(m.activeMs / 60000) + ' min' }
    ]) });
    out.push({ heading: 'Mastery by topic (spaced recall)', items: SCREENS.topicOrder().filter(function (t) { return QB.byTopic(t).length; }).map(function (t) {
      var acc = QB.accuracy(t);
      return { label: (ODY.topics[t] || { name: t }).name, value: Math.round(QB.mastery(t) * 100) + '% mastery; ' + QB.seen(t) + ' of ' + QB.byTopic(t).length + ' questions seen' + (acc === null ? '' : '; ' + Math.round(acc * 100) + '% accuracy') };
    }) });
    var sw = m.storyWrites || {};
    var swItems = Object.keys(sw).map(function (k) {
      var x = sw[k];
      return { label: 'Captain\'s log (' + k.split(':')[0] + '): ' + x.q + ' [self-check ' + x.ticks + '/' + x.of + ']', value: x.text };
    });
    if (swItems.length) out.push({ heading: "Captain's log: written exam moves in the story", items: swItems });
    var tr = m.trials || {};
    var items = [];
    Object.keys(tr).forEach(function (id) {
      var x = tr[id];
      if (id.indexOf('mock') === 0) {
        items.push({ label: x.title + ' (' + x.mins + ' min): self-marked ' + x.total + ' / 35', value: '' });
        (x.answers || []).forEach(function (a) { items.push({ label: 'Section ' + a.sec + ' (' + a.mark + '): ' + a.q, value: a.text }); });
      } else {
        items.push({ label: 'Section ' + x.sec + ', self-marked ' + x.mark + ' (' + x.ticks + '/' + x.of + ' checklist): ' + x.q, value: x.text });
      }
    });
    out.push({ heading: "The Oracle's Trials (Paper 1 practice)", items: items.length ? items : [{ label: 'No written answers yet', value: '' }] });
    return out;
  }

  function flags() {
    return 'Presenter mode: ' + (S.opt('presenter') ? 'ON' : 'off') + ' | Calm mode: ' + (S.opt('calm') ? 'on' : 'off') + ' | Paste attempts blocked: ' + (S.data.meta.pasteBlocked || 0);
  }

  function build(name, cls) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var M = 16, CW = W - M * 2, FY = H - 9, y = 18, page = 1;
    doc.setProperties({ title: safe(name + ' - Odyssey Unit 1 Review'), author: safe(name), creator: 'Odyssey: The Long Way Home' });
    function footer() {
      doc.setDrawColor(210, 200, 180); doc.setLineWidth(0.2); doc.line(M, FY - 4, W - M, FY - 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(100, 92, 80);
      doc.text('Odyssey: The Long Way Home - IB Psychology Unit 1 Review', M, FY);
      doc.text('Page ' + page, W - M, FY, { align: 'right' });
    }
    function newPage() { footer(); doc.addPage(); page++; y = 18; }
    function need(mm) { if (y + mm > FY - 7) newPage(); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(28, 24, 19);
    doc.text('ODYSSEY: THE LONG WAY HOME', M, y); y += 7;
    doc.setFontSize(12); doc.text('Unit 1 Review (Learning and Cognition) - Evidence of Work', M, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(90, 82, 70);
    doc.text(safe(name + ' | ' + cls + ' | ' + new Date().toLocaleString()), M, y); y += 5;
    doc.text(safe(flags()), M, y); y += 7;
    doc.setFillColor(250, 243, 224); doc.setDrawColor(218, 169, 45);
    doc.roundedRect(M, y, CW, 11, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(55, 43, 20);
    doc.text('A record of your independent review: what you played, practised and still need to revise.', M + 4, y + 7); y += 18;
    sections().forEach(function (sec) {
      need(16);
      doc.setDrawColor(200, 140, 40); doc.setLineWidth(0.8); doc.line(M, y - 2.5, M + 4, y - 2.5); doc.setLineWidth(0.2);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(30, 26, 20);
      doc.text(safe(sec.heading), M + 7, y); y += 7;
      sec.items.forEach(function (it) {
        doc.setFontSize(9);
        var lab = doc.splitTextToSize(safe(it.label), CW);
        var val = it.value ? doc.splitTextToSize(safe(it.value), CW - 4) : [];
        need(lab.length * 3.8 + Math.min(val.length, 3) * 4 + 4);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(70, 62, 52);
        doc.text(lab, M, y, { lineHeightFactor: 1.2 }); y += lab.length * 3.8 + 0.8;
        doc.setFont('helvetica', 'normal'); doc.setTextColor(25, 22, 19);
        var rest = val;
        while (rest.length) {
          var fit = Math.max(1, Math.floor((FY - 7 - y) / 4));
          var chunk = rest.slice(0, fit);
          doc.text(chunk, M + 3, y, { lineHeightFactor: 1.25 });
          y += chunk.length * 4;
          rest = rest.slice(fit);
          if (rest.length) newPage();
        }
        y += 2.6;
      });
      y += 3;
    });
    footer();
    return doc;
  }
  function filename(name) {
    var a = String(name || '').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/ø/g, 'oe').replace(/Ø/g, 'Oe').replace(/å/g, 'aa').replace(/Å/g, 'Aa')
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    return (a.trim().replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'student') + '_Odyssey_Unit1_Review.pdf';
  }
  function text(name, cls) {
    return ['ODYSSEY: THE LONG WAY HOME - EVIDENCE OF WORK', name + ' | ' + cls + ' | ' + new Date().toLocaleString(), flags(), ''].concat(
      sections().reduce(function (a, s) { return a.concat(['== ' + s.heading + ' ==']).concat(s.items.map(function (i) { return '- ' + i.label + (i.value ? ': ' + i.value : ''); })).concat(['']); }, [])).join('\n');
  }

  E.panel = function () {
    var name = h('input', { type: 'text', value: S.data.name, placeholder: 'Your full name', maxlength: 60 });
    var cls = h('input', { type: 'text', value: S.data.cls, placeholder: 'Class', maxlength: 30 });
    name.addEventListener('input', function () { S.data.name = name.value; S.save(); });
    cls.addEventListener('input', function () { S.data.cls = cls.value; S.save(); });
    var status = h('p.small.muted', 'The PDF lists your episodes, mastery by topic and every Paper 1 answer you wrote.');
    function valid() {
      if (name.value.trim().length < 2) { U.toast('Type your name first.', 'bad'); name.focus(); return false; }
      return true;
    }
    var dl = h('button.btn.btn-primary', { type: 'button', html: U.icon('download', 18) + ' Save a progress PDF' });
    var tab = h('button.btn.btn-sm', { type: 'button' }, 'Open PDF in a new tab');
    var pr = h('button.btn.btn-sm', { type: 'button' }, 'Print or save as PDF');
    var cp = h('button.btn.btn-sm', { type: 'button' }, 'Copy as text');
    dl.addEventListener('click', function () {
      if (!valid()) return;
      status.textContent = 'Preparing your PDF...';
      ensure().then(function (ok) {
        if (!ok) { status.textContent = 'The PDF tool could not load (the network may block it). Use "Print or save as PDF" instead.'; return; }
        try { build(name.value.trim(), cls.value.trim()).save(filename(name.value)); status.textContent = 'Saved.'; }
        catch (e) { console.error(e); status.textContent = 'Something went wrong making the PDF. Try "Open PDF in a new tab" or "Print".'; }
      });
    });
    tab.addEventListener('click', function () {
      if (!valid()) return;
      var w = window.open('', '_blank');
      ensure().then(function (ok) {
        if (!ok) { if (w) w.close(); status.textContent = 'The PDF tool could not load. Use Print instead.'; return; }
        var url = build(name.value.trim(), cls.value.trim()).output('bloburl');
        if (w) w.location.href = url; else window.open(url, '_blank');
      });
    });
    pr.addEventListener('click', function () {
      if (!valid()) return;
      var sheet = document.getElementById('printSheet');
      sheet.innerHTML = '<h1>Odyssey: The Long Way Home - Evidence of Work</h1><p>' + U.esc(name.value + ' | ' + cls.value + ' | ' + new Date().toLocaleString()) + '<br>' + U.esc(flags()) + '</p>' +
        sections().map(function (s) { return '<h2>' + U.esc(s.heading) + '</h2><dl>' + s.items.map(function (i) { return '<dt>' + U.esc(i.label) + '</dt><dd>' + U.esc(i.value) + '</dd>'; }).join('') + '</dl>'; }).join('');
      window.print();
    });
    cp.addEventListener('click', function () {
      if (!valid()) return;
      var t = text(name.value.trim(), cls.value.trim());
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { status.textContent = 'Copied.'; }, function () {
        U.modal('Copy your evidence', h('textarea.write', { readonly: true, style: { minHeight: '50vh' } }, t));
      });
    });
    return h('div', { style: { display: 'grid', gap: '10px' } }, h('div.field-row', h('label.field', 'Name', name), h('label.field', 'Class', cls)), h('div.btn-row', dl), h('div.btn-row', tab, pr, cp), status);
  };
})();
