/* ============ SLIDE / CAROUSEL NAV ============ */
const slideIds = ['hero','lock0','r1','r2','r3','r4','midway','r6','r7','vault','end'];
const slideTitles = {hero:'Start', lock0:'Lock 00', r1:'Lock 01', r2:'Lock 02', r3:'Lock 03', r4:'Lock 04', midway:'Midway Vault', r6:'Lock 06', r7:'Lock 07', vault:'Final Vault', end:'Escaped'};
const roomOrder = ['lock0','r1','r2','r3','r4','midway','r6','r7','vault'];
const track = document.getElementById('track');
let currentIndex = 0;
let maxUnlocked = 0;

function applyTransform(){
  track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
}
function updateNav(){
  document.getElementById('navPrev').disabled = currentIndex === 0;
  document.getElementById('navNext').disabled = currentIndex >= maxUnlocked;
  document.getElementById('navLabel').textContent = slideTitles[slideIds[currentIndex]] + '  ·  ' + (currentIndex+1) + ' / ' + slideIds.length;
}
function goTo(i){
  if(i < 0 || i > maxUnlocked || i >= slideIds.length) return;
  currentIndex = i;
  applyTransform();
  updateNav();
}
function updateRail(){
  const done = document.querySelectorAll('.room.room-complete').length;
  const pct = Math.round((done/roomOrder.length)*100);
  document.getElementById('fill').style.width = pct + '%';
  document.getElementById('rail-label').textContent = 'Lock ' + done + ' / ' + roomOrder.length;
  document.getElementById('streak').textContent = done>0 && done<roomOrder.length ? done+' cleared' : (done===roomOrder.length ? 'escaped' : '');
}
function advanceUnlock(fromId){
  const el = document.getElementById(fromId);
  if(el){
    el.classList.add('room-complete');
    const badge = el.querySelector('.lock-badge');
    if(badge) badge.textContent = '🔓';
  }
  const idx = slideIds.indexOf(fromId);
  if(idx > -1 && idx + 1 < slideIds.length){
    if(idx + 1 > maxUnlocked) maxUnlocked = idx + 1;
    goTo(idx + 1);
  }
  updateRail();
}

document.getElementById('navPrev').addEventListener('click', ()=> goTo(currentIndex - 1));
document.getElementById('navNext').addEventListener('click', ()=> goTo(currentIndex + 1));
document.addEventListener('keydown', (e)=>{
  const tag = document.activeElement.tagName;
  if(tag === 'TEXTAREA' || tag === 'INPUT') return;
  if(e.key === 'ArrowRight') document.getElementById('navNext').click();
  if(e.key === 'ArrowLeft') document.getElementById('navPrev').click();
});

document.getElementById('btn-hero').addEventListener('click', ()=>{
  if(maxUnlocked < 1) maxUnlocked = 1;
  goTo(1);
});

updateNav();

/* ============ FIELD VALIDATION ============ */
function textFieldsFilled(roomEl){
  let ok = true;
  roomEl.querySelectorAll('textarea').forEach(f=>{
    if(f.value.trim().length < 8){ ok = false; f.classList.add('needs-input'); }
    else f.classList.remove('needs-input');
  });
  roomEl.querySelectorAll('input[type=text]').forEach(f=>{
    if(f.value.trim().length < 2){ ok = false; f.classList.add('needs-input'); }
    else f.classList.remove('needs-input');
  });
  return ok;
}
function flagAndWarn(roomEl, msg){
  textFieldsFilled(roomEl);
  let warn = roomEl.querySelector('.field-warning');
  if(!warn){
    warn = document.createElement('div');
    warn.className = 'field-warning';
    roomEl.querySelector('.room-footer').insertAdjacentElement('beforebegin', warn);
  }
  warn.textContent = msg || '✏️ Fill in every box below with a real answer (not just a word or two) before continuing.';
  warn.scrollIntoView({behavior:'smooth', block:'center'});
}

/* ============ QUIZZES (display controlled only by JS) ============ */
const roomQuizCorrect = {};
document.querySelectorAll('.quiz').forEach(q=>{
  const room = q.getAttribute('data-room');
  q.querySelectorAll('input[type=radio]').forEach(r=>{
    r.addEventListener('change', ()=>{
      const correctFb = q.querySelector('.fb.correct');
      const wrongFb = q.querySelector('.fb.wrong');
      correctFb.style.display = 'none';
      wrongFb.style.display = 'none';
      if(r.getAttribute('data-c') === '1'){ correctFb.style.display = 'block'; }
      else { wrongFb.style.display = 'block'; }
      if(room){
        if(!roomQuizCorrect[room]) roomQuizCorrect[room] = new Set();
        if(r.getAttribute('data-c') === '1'){ roomQuizCorrect[room].add(q); } else { roomQuizCorrect[room].delete(q); }
        checkRoomButtons(room);
      }
    });
  });
});
const answerKey = { q0a:'b', q0b:'c', q0c:'a', qmid:'d', qc1:'c', qc2:'d', qc3:'d', qc4:'c', qc5:'d', qc6:'c' };
Object.keys(answerKey).forEach(name=>{
  document.querySelectorAll('input[name="'+name+'"]').forEach(inp=>{
    if(inp.value === answerKey[name]) inp.setAttribute('data-c','1');
  });
});
function roomQuizzesOK(roomId){
  const quizzes = document.querySelectorAll('.quiz[data-room="'+roomId+'"]');
  const correctSet = roomQuizCorrect[roomId] || new Set();
  return quizzes.length > 0 && correctSet.size === quizzes.length;
}

/* ============ DRAG / CLICK MATCH GAMES ============ */
let pickedChip = null;
function placeChip(chip, zone){
  if(zone.classList.contains('zone') && zone.dataset.single === 'true'){
    const existing = zone.querySelector('.chip');
    if(existing && existing !== chip){
      const game = zone.closest('.matchgame');
      game.querySelector('.bank').appendChild(existing);
    }
  }
  zone.appendChild(chip);
  chip.classList.remove('picked');
}
document.querySelectorAll('.matchgame').forEach(game=>{
  game.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', chip.id); });
    chip.addEventListener('click', ()=>{
      game.querySelectorAll('.chip.picked').forEach(c=>c.classList.remove('picked'));
      chip.classList.add('picked');
      pickedChip = chip;
    });
  });
  game.querySelectorAll('.zone, .bank').forEach(zone=>{
    zone.addEventListener('dragover', (e)=> e.preventDefault());
    zone.addEventListener('drop', (e)=>{
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const chip = document.getElementById(id);
      if(chip){ placeChip(chip, zone); evaluateGame(game); }
    });
    zone.addEventListener('click', ()=>{
      if(pickedChip){ placeChip(pickedChip, zone); pickedChip=null; evaluateGame(game); }
    });
  });
});
function evaluateGame(game){
  const zones = game.querySelectorAll('.zone[data-accept]');
  const isSortMode = ![...zones].some(z=>z.dataset.single === 'true');
  const totalChips = game.querySelectorAll('.chip').length;
  let allCorrect = true, placedCount = 0;
  zones.forEach(zone=>{
    zone.querySelectorAll('.chip').forEach(chip=>{
      placedCount++;
      if(chip.dataset.answer !== zone.dataset.accept) allCorrect = false;
    });
  });
  let win, anyPlaced = placedCount > 0;
  if(isSortMode){ win = (placedCount === totalChips) && allCorrect; }
  else { const allZonesFilled = [...zones].every(z => z.querySelectorAll('.chip').length === 1); win = allZonesFilled && allCorrect; }
  const status = game.querySelector('.game-status');
  if(win){ status.className = 'game-status ok'; status.textContent = '✓ Correct — this door is open.'; }
  else if(anyPlaced){ status.className = 'game-status notyet'; status.textContent = 'Not quite — check the placements and try again.'; }
  else { status.className = 'game-status notyet'; status.textContent = 'Keep going — place every card.'; }
  const roomEl = game.closest('.room');
  if(roomEl) checkRoomButtons(roomEl.id);
}

/* ============ PER-ROOM BUTTON ENABLE (quiz/game correctness only — text checked at click) ============ */
function checkRoomButtons(roomId){
  if(roomId === 'lock0') document.getElementById('btn-lock0').disabled = !roomQuizzesOK('lock0');
  if(roomId === 'r2') document.getElementById('btn-r2').disabled = !document.getElementById('mg-r2').querySelector('.game-status').classList.contains('ok');
  if(roomId === 'r3') document.getElementById('btn-r3').disabled = !document.getElementById('mg-r3').querySelector('.game-status').classList.contains('ok');
  if(roomId === 'r4') document.getElementById('btn-r4').disabled = !document.getElementById('mg-r4').querySelector('.game-status').classList.contains('ok');
  if(roomId === 'midway'){
    const g1ok = document.getElementById('mg-mid1').querySelector('.game-status').classList.contains('ok');
    const gsok = document.getElementById('mg-mid-schedules').querySelector('.game-status').classList.contains('ok');
    const g2ok = document.getElementById('mg-mid2').querySelector('.game-status').classList.contains('ok');
    document.getElementById('btn-midway').disabled = !(g1ok && gsok && g2ok && roomQuizzesOK('midway'));
  }
  if(roomId === 'r7') document.getElementById('btn-r7').disabled = !roomQuizzesOK('r7');
}

/* wire "input" listeners so text-only rooms feel responsive (validated at click, but clear the red state live) */
document.querySelectorAll('textarea, input[type=text]').forEach(f=>{
  f.addEventListener('input', ()=>{
    const min = f.tagName === 'TEXTAREA' ? 8 : 2;
    if(f.value.trim().length >= min) f.classList.remove('needs-input');
  });
});

document.getElementById('btn-lock0').addEventListener('click', ()=>{ if(!document.getElementById('btn-lock0').disabled) advanceUnlock('lock0'); });

document.getElementById('btn-r1').addEventListener('click', ()=>{
  const el = document.getElementById('r1');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('r1');
});
document.getElementById('btn-r2').addEventListener('click', ()=>{ if(!document.getElementById('btn-r2').disabled) advanceUnlock('r2'); });
document.getElementById('btn-r3').addEventListener('click', ()=>{
  if(document.getElementById('btn-r3').disabled) return;
  const el = document.getElementById('r3');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('r3');
});
document.getElementById('btn-r4').addEventListener('click', ()=>{
  if(document.getElementById('btn-r4').disabled) return;
  const el = document.getElementById('r4');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('r4');
});
document.getElementById('btn-midway').addEventListener('click', ()=>{
  if(document.getElementById('btn-midway').disabled) return;
  const el = document.getElementById('midway');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('midway');
});
document.getElementById('btn-r6').addEventListener('click', ()=>{
  const el = document.getElementById('r6');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('r6');
});
document.getElementById('btn-r7').addEventListener('click', ()=>{ if(!document.getElementById('btn-r7').disabled) advanceUnlock('r7'); });
document.getElementById('btn-vault').addEventListener('click', ()=>{
  const el = document.getElementById('vault');
  if(!textFieldsFilled(el)){ flagAndWarn(el, '✏️ Fill in every box in both Part A and Part B — a real answer, not a placeholder — before you can escape.'); return; }
  advanceUnlock('vault');
});

document.querySelectorAll('.reveal-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=> document.getElementById(btn.getAttribute('data-target')).classList.toggle('show'));
});

updateRail();

/* ============ INTEGRITY SIGNALS ============ */
const sessionStart = Date.now();
const pasteLog = [];
const dropLog = [];
const keystrokeCounts = new WeakMap();
const toast = document.getElementById('pasteToast');
let toastTimer;
let tabAwayCount = 0, tabAwayMs = 0, awayStart = null;
let pointerMoveEvents = 0, pointerDistance = 0, lastPX = null, lastPY = null;

function stationOf(el){
  const s = el.closest('.room');
  if(!s) return {id:'?', label:'Unknown'};
  const num = s.querySelector('.num');
  const title = s.querySelector('.room-title');
  return { id: num ? num.textContent.trim() : '?', label: title ? title.textContent.trim() : s.id };
}
function flash(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2600);
}
const IGNORE_KEYS = new Set(['Control','Alt','Meta','Shift','Tab','Escape','CapsLock',
  'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown',
  'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12']);

document.querySelectorAll('textarea').forEach(ta=>{
  keystrokeCounts.set(ta, 0);
  ta.addEventListener('paste', (e)=>{
    e.preventDefault();
    const st = stationOf(ta);
    pasteLog.push({ id: st.id, label: st.label });
    ta.classList.add('flagged');
    flash('Pasting is disabled here — type your own answer.');
  });
  ta.addEventListener('drop', (e)=>{
    e.preventDefault();
    const st = stationOf(ta);
    dropLog.push({ id: st.id, label: st.label });
    ta.classList.add('flagged');
    flash('Dragging text in is disabled here — type your own answer.');
  });
  ta.addEventListener('dragover', (e)=> e.preventDefault());
  ta.addEventListener('keydown', (e)=>{
    if(!IGNORE_KEYS.has(e.key)) keystrokeCounts.set(ta, keystrokeCounts.get(ta) + 1);
  });
});

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){ tabAwayCount++; awayStart = Date.now(); }
  else if(awayStart){ tabAwayMs += Date.now() - awayStart; awayStart = null; }
});
document.addEventListener('pointermove', (e)=>{
  pointerMoveEvents++;
  if(lastPX !== null){ pointerDistance += Math.hypot(e.clientX-lastPX, e.clientY-lastPY); }
  lastPX = e.clientX; lastPY = e.clientY;
});

function findKeystrokeMismatches(){
  const THRESHOLD = 15;
  const mismatches = [];
  document.querySelectorAll('textarea').forEach(ta=>{
    const val = ta.value.trim();
    if(val.length < 20) return;
    const keys = keystrokeCounts.get(ta) || 0;
    if(val.length - keys > THRESHOLD){
      const st = stationOf(ta);
      mismatches.push({ id: st.id, label: st.label });
    }
  });
  return mismatches;
}
function describeMatchGame(game){
  const zones = game.querySelectorAll('.zone[data-accept]');
  let correct = 0, placed = 0;
  zones.forEach(z=>{
    z.querySelectorAll('.chip').forEach(chip=>{
      placed++;
      if(chip.dataset.answer === z.dataset.accept) correct++;
    });
  });
  const total = game.querySelectorAll('.chip').length;
  return correct + '/' + total + ' correct';
}
function collectAnswers(){
  const rooms = document.querySelectorAll('.room');
  let html = '';
  rooms.forEach(s=>{
    const num = s.querySelector('.num');
    const title = s.querySelector('.room-title');
    if(!num || !title) return;
    const boxes = s.querySelectorAll('textarea, input[type=text]');
    const quizzes = s.querySelectorAll('.quiz');
    const games = s.querySelectorAll('.matchgame');
    if(boxes.length === 0 && quizzes.length === 0 && games.length === 0) return;
    let section = `<div style="margin-bottom:22px;"><div style="font-family:Georgia,serif;font-weight:700;font-size:16px;border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:8px;">${num.textContent.trim()} — ${title.textContent.trim()}</div>`;
    quizzes.forEach(q=>{
      const qtext = q.querySelector('.q') ? q.querySelector('.q').textContent.trim() : '';
      const checked = q.querySelector('input[type=radio]:checked');
      const chosenLabel = checked ? checked.closest('label').textContent.trim() : '(not answered)';
      section += `<div style="margin:6px 0;font-size:13px;"><i>${qtext}</i><br><b>Answer:</b> ${chosenLabel}</div>`;
    });
    games.forEach(g=>{ section += `<div style="margin:6px 0;font-size:13px;"><b>Matching game:</b> ${describeMatchGame(g)}</div>`; });
    boxes.forEach(b=>{
      const val = b.value.trim();
      const ph = b.getAttribute('placeholder') || '';
      section += `<div style="margin:6px 0;font-size:13px;">${ph ? '<i>'+ph+'</i><br>' : ''}${val ? val.replace(/</g,'&lt;') : '<span style="color:#999;">(not answered)</span>'}</div>`;
    });
    section += `</div>`;
    html += section;
  });
  return html;
}

document.getElementById('prepareBtn').addEventListener('click', ()=>{
  const name = document.getElementById('subName').value.trim() || '(name not entered)';
  const group = document.getElementById('subGroup').value.trim() || '(group not entered)';
  if(awayStart){ tabAwayMs += Date.now() - awayStart; awayStart = null; }

  const mismatches = findKeystrokeMismatches();
  const pasteStations = [...new Set(pasteLog.map(p=>p.id))];
  const dropStations = [...new Set(dropLog.map(p=>p.id))];
  const mismatchStations = [...new Set(mismatches.map(m=>m.id))];
  const hardFlag = pasteLog.length > 0 || dropLog.length > 0 || mismatches.length > 0;

  const totalChars = [...document.querySelectorAll('textarea, input[type=text]')].reduce((sum,t)=> sum + t.value.trim().length, 0);
  const totalWords = Math.round(totalChars / 5);
  const minutesActive = Math.max((Date.now() - sessionStart) / 60000, 0.1);
  const wpm = Math.round(totalWords / minutesActive);
  const speedNote = (totalWords > 40 && wpm > 140);
  const lowPointerNote = (totalChars > 150 && pointerMoveEvents < 15);

  const lines = [
    hardFlag ? 'INTEGRITY FLAG' : 'INTEGRITY CHECK — CLEAN',
    name,
    `Paste attempts blocked: ${pasteLog.length}${pasteStations.length ? ' (rooms ' + pasteStations.join(', ') + ')' : ''}`,
    `Drag-drop attempts blocked: ${dropLog.length}${dropStations.length ? ' (rooms ' + dropStations.join(', ') + ')' : ''}`,
    `Keystroke/length mismatch: ${mismatches.length} field(s)${mismatchStations.length ? ' (rooms ' + mismatchStations.join(', ') + ')' : ''}`,
    `Tab switches away: ${tabAwayCount} (${Math.round(tabAwayMs/1000)}s away total)`,
    `Composition speed: ~${wpm} wpm over ${totalWords} words${speedNote ? ' — unusually fast' : ''}`,
    `Pointer activity: ${pointerMoveEvents} moves, ~${Math.round(pointerDistance)}px${lowPointerNote ? ' — unusually low for the amount typed' : ''}`,
    `Generated: ${new Date().toLocaleString()}`
  ];
  const integrityText = lines.join('\n');

  const preview = document.getElementById('integrityPreview');
  preview.style.display = 'block';
  preview.className = hardFlag ? 'flag' : 'clean';
  let previewHtml = hardFlag ? `⚠ <b>Flagged.</b> ` : `✓ <b>No paste, drag-drop, or keystroke-mismatch signals detected.</b> `;
  const parts = [];
  if(pasteLog.length) parts.push(`${pasteLog.length} paste attempt(s) — ${pasteStations.join(', ')}`);
  if(dropLog.length) parts.push(`${dropLog.length} drag-drop attempt(s) — ${dropStations.join(', ')}`);
  if(mismatches.length) parts.push(`${mismatches.length} field(s) with unexplained text — ${mismatchStations.join(', ')}`);
  if(parts.length) previewHtml += parts.join(' · ') + '. ';
  previewHtml += `<br><span style="opacity:.75;">Context: ${tabAwayCount} tab switch(es), ~${wpm} wpm, ${pointerMoveEvents} pointer moves. Informational only, not proof.</span>`;
  preview.innerHTML = previewHtml;

  const qrHost = document.getElementById('qrHidden');
  qrHost.innerHTML = '';
  new QRCode(qrHost, { text: integrityText, width: 150, height: 150 });

  setTimeout(()=>{
    const canvas = qrHost.querySelector('canvas');
    const qrDataUrl = canvas ? canvas.toDataURL('image/png') : '';
    const answersHtml = collectAnswers();
    const flagged = hardFlag;
    const docHtml = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>${name} — Operant Conditioning Submission</title>
      <style>
        body{font-family:Georgia,serif;color:#111;max-width:720px;margin:32px auto;padding:0 20px;}
        h1{font-family:Arial,sans-serif;font-size:22px;margin-bottom:2px;}
        .meta{font-family:Arial,sans-serif;font-size:13px;color:#555;margin-bottom:18px;}
        .integrity{display:flex;align-items:center;gap:16px;border:2px solid ${flagged ? '#D6371F' : '#3C7A3F'};padding:14px 16px;margin:20px 0 10px;font-family:Arial,sans-serif;}
        .integrity img{flex-shrink:0;}
        .integrity .txt{font-size:12.5px;white-space:pre-line;line-height:1.5;}
        .integrity .flag-title{font-weight:700;color:${flagged ? '#D6371F' : '#3C7A3F'};margin-bottom:4px;font-size:13.5px;}
        .caveat{font-family:Arial,sans-serif;font-size:11px;color:#888;margin-bottom:24px;}
        .attend{font-family:Arial,sans-serif;font-size:12px;background:#FBEFE0;border:1px solid #E7A63C;padding:8px 12px;margin-bottom:20px;}
        @media print{ body{margin:0;} }
      </style></head><body>
        <h1>Operant Conditioning — Escape Room Submission</h1>
        <div class="meta">${name} · ${group} · ${new Date().toLocaleDateString()}</div>
        <div class="attend">📋 Remember to upload this PDF to Elevfeedback to be marked present for this lesson.</div>
        <div class="integrity">
          ${qrDataUrl ? `<img src="${qrDataUrl}" width="110" height="110">` : ''}
          <div class="txt"><div class="flag-title">${flagged ? 'INTEGRITY FLAG' : 'INTEGRITY CHECK — CLEAN'}</div>${integrityText.split(String.fromCharCode(10)).slice(2).join(String.fromCharCode(10))}</div>
        </div>
        <div class="caveat">These are weak, browser-side signals (blocked paste/drag-drop, keystroke-vs-text mismatch, tab switching, typing speed, pointer activity) — useful as a prompt to look closer, not proof of anything on their own.</div>
        ${answersHtml}
      </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(docHtml);
    w.document.close();
    w.focus();
    setTimeout(()=> w.print(), 300);
  }, 200);
});
