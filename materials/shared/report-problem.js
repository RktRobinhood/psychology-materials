/* Mindfield: "Report a problem" for every lesson.
 *
 * Classic script, no build step, works from file:// and GitHub Pages.
 *
 *   <script defer src="../shared/report-problem.js" data-lesson="Memory Quest"></script>
 *   <a href="https://github.com/RktRobinhood/psychology-materials/issues/new/choose"
 *      target="_blank" rel="noopener" data-report-problem>Report a problem</a>
 *
 * Any element with [data-report-problem] opens a small dialog that sends the student
 * to the right GitHub issue form, with the lesson, place and device filled in. If this
 * script fails to load, the link still opens GitHub's template chooser.
 *
 * A lesson can say where the student is:
 *   MindfieldReport.where = () => 'Chapter 2, screen 3 / 8';
 */
(function () {
  'use strict';

  var REPO = 'https://github.com/RktRobinhood/psychology-materials';
  var FORMS = {
    bug: { template: 'bug-report.yml', prefix: '[Bug] ' },
    content: { template: 'content-problem.yml', prefix: '[Content] ' }
  };

  var tag = document.currentScript;
  var api = window.MindfieldReport = window.MindfieldReport || {};
  api.lesson = api.lesson || (tag && tag.dataset.lesson) || document.title;
  var dialog = null;

  function where() {
    try { return typeof api.where === 'function' ? String(api.where() || '').trim() : ''; }
    catch (e) { return ''; }
  }

  function device() {
    var ua = navigator.userAgent;
    var pick = function (re) { var m = ua.match(re); return m ? ' ' + m[1] : ''; };
    var browser =
      /Edg\//.test(ua) ? 'Edge' + pick(/Edg\/(\d+)/) :
      /OPR\//.test(ua) ? 'Opera' + pick(/OPR\/(\d+)/) :
      /Firefox\//.test(ua) ? 'Firefox' + pick(/Firefox\/(\d+)/) :
      /CriOS\//.test(ua) ? 'Chrome' + pick(/CriOS\/(\d+)/) :
      /Chrome\//.test(ua) ? 'Chrome' + pick(/Chrome\/(\d+)/) :
      /Safari\//.test(ua) ? 'Safari' + pick(/Version\/(\d+)/) : 'Unknown browser';
    var ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    var os =
      ipad ? 'iPad' : /iPhone/.test(ua) ? 'iPhone' : /Android/.test(ua) ? 'Android' :
      /CrOS/.test(ua) ? 'Chromebook' : /Windows/.test(ua) ? 'Windows' :
      /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Unknown system';
    // A file:// path can hold the student's username, so only web addresses are sent.
    var address = /^https?:$/.test(location.protocol) ? location.href.split(/[?#]/)[0] : 'opened from a file';
    return browser + ' on ' + os + ', window ' + window.innerWidth + 'x' + window.innerHeight +
      '\nAddress: ' + address + '\nUser agent: ' + ua;
  }

  function formUrl(kind) {
    var form = FORMS[kind];
    var place = where();
    var params = [
      ['template', form.template],
      ['title', form.prefix + api.lesson + ': '],
      ['lesson', api.lesson],
      ['where', place],
      ['device', device()]
    ];
    return REPO + '/issues/new?' + params.map(function (p) {
      return p[0] + '=' + encodeURIComponent(p[1]);
    }).join('&');
  }

  function plainText() {
    return 'Problem report\nLesson: ' + api.lesson + '\nWhere: ' + (where() || '(not given)') +
      '\nDevice: ' + device() + '\n\nWhat happened:\n';
  }

  function copy(text, done) {
    var fallback = function () {
      var box = document.createElement('textarea');
      box.value = text;
      box.setAttribute('readonly', '');
      box.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      dialog.appendChild(box);
      box.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { /* no clipboard */ }
      box.remove();
      done(ok);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else fallback();
  }

  var CSS = '' +
    '.mf-report{border:0;padding:0;border-radius:14px;width:min(440px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;' +
      'background:#fff;color:#1b2430;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 24px 64px rgba(0,0,0,.35)}' +
    '.mf-report::backdrop{background:rgba(10,16,24,.55)}' +
    '.mf-report *{box-sizing:border-box}' +
    '.mf-report .mf-in{padding:22px 22px 18px}' +
    '.mf-report .mf-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}' +
    '.mf-report h2{margin:0;font:700 19px/1.25 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1b2430;letter-spacing:0}' +
    '.mf-report .mf-x{border:0;background:transparent;color:#5b6775;font-size:20px;line-height:1;width:34px;height:34px;border-radius:8px;cursor:pointer}' +
    '.mf-report .mf-x:hover{background:#eef1f4;color:#1b2430}' +
    '.mf-report p{margin:0 0 14px;color:#4a5563}' +
    '.mf-report .mf-where{font-size:13px;color:#5b6775;background:#f4f6f8;border-radius:8px;padding:8px 10px;margin-bottom:14px}' +
    '.mf-report .mf-where b{color:#1b2430;font-weight:600}' +
    '.mf-report .mf-choice{display:block;width:100%;text-align:left;border:1px solid #d5dbe1;background:#fff;color:#1b2430;border-radius:10px;padding:12px 14px;margin:0 0 10px;cursor:pointer;font:inherit;text-decoration:none;transition:border-color .12s,background .12s}' +
    '.mf-report .mf-choice:hover,.mf-report .mf-choice:focus-visible{border-color:#2f6fad;background:#f3f8fd;outline:none}' +
    '.mf-report .mf-choice strong{display:block;font-weight:700;font-size:15px}' +
    '.mf-report .mf-choice span{display:block;font-size:13px;color:#5b6775}' +
    '.mf-report .mf-foot{border-top:1px solid #e3e7eb;margin-top:6px;padding-top:12px;font-size:13px;color:#5b6775}' +
    '.mf-report .mf-foot p{margin:0 0 10px;font-size:13px}' +
    '.mf-report .mf-copy{border:1px solid #d5dbe1;background:#f7f9fa;color:#1b2430;border-radius:8px;padding:7px 12px;font:600 13px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;cursor:pointer}' +
    '.mf-report .mf-copy:hover{border-color:#2f6fad}' +
    '.mf-report .mf-copied{margin-left:8px;color:#2d7a55;font-weight:600}';

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    dialog = document.createElement('dialog');
    dialog.className = 'mf-report';
    dialog.setAttribute('aria-labelledby', 'mfReportTitle');
    dialog.innerHTML =
      '<div class="mf-in">' +
        '<div class="mf-head"><h2 id="mfReportTitle">Report a problem</h2>' +
        '<button type="button" class="mf-x" data-mf-close aria-label="Close">✕</button></div>' +
        '<p>Thank you for helping fix the lesson. Which one fits best?</p>' +
        '<div class="mf-where"></div>' +
        '<a class="mf-choice" data-mf-kind="bug" target="_blank" rel="noopener">' +
          '<strong>Something broke</strong><span>A button, game, timer, sound, the PDF or the layout is not working.</span></a>' +
        '<a class="mf-choice" data-mf-kind="content" target="_blank" rel="noopener">' +
          '<strong>Something is wrong or confusing</strong><span>A typo, a fact that looks wrong, or an unclear question.</span></a>' +
        '<div class="mf-foot">' +
          '<p>This opens a short form on GitHub in a new tab. You need a free GitHub account. ' +
          'Please do not write your name or other personal details: the report is public. ' +
          'No account? Copy the details and send them to your teacher.</p>' +
          '<button type="button" class="mf-copy">Copy details</button><span class="mf-copied" hidden>Copied</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(dialog);

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-mf-close]')) dialog.close();
      var choice = e.target.closest('[data-mf-kind]');
      if (choice) setTimeout(function () { dialog.close(); }, 0);
      if (e.target.closest('.mf-copy')) {
        var note = dialog.querySelector('.mf-copied');
        copy(plainText(), function (ok) {
          note.textContent = ok ? 'Copied' : 'Copy failed. Take a screenshot instead.';
          note.hidden = false;
          setTimeout(function () { note.hidden = true; }, 2500);
        });
      }
    });
    // Keep the lesson's own arrow-key and clicker navigation from firing behind the dialog.
    dialog.addEventListener('keydown', function (e) { if (e.key !== 'Escape') e.stopPropagation(); });
  }

  api.open = function () {
    if (!dialog) build();
    var place = where();
    dialog.querySelector('.mf-where').innerHTML = '';
    dialog.querySelector('.mf-where').append(
      text('Lesson: '), bold(api.lesson), text(place ? ' · Where: ' : ''), place ? bold(place) : text('')
    );
    dialog.querySelectorAll('[data-mf-kind]').forEach(function (a) { a.href = formUrl(a.dataset.mfKind); });
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.open(REPO + '/issues/new/choose', '_blank', 'noopener');
  };

  function text(s) { return document.createTextNode(s); }
  function bold(s) { var b = document.createElement('b'); b.textContent = s; return b; }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-report-problem]');
    if (!trigger) return;
    e.preventDefault();
    var host = trigger.closest('dialog');
    if (host && host !== dialog && host.open) host.close();
    api.open();
  });
})();
