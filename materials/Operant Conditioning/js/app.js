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
function fieldLabel(field){
  const box = field.closest('.box');
  if(box){
    const h = box.querySelector('h4');
    if(h) return h.textContent.trim();
  }
  const parent = field.parentElement;
  if(parent){
    const h = parent.querySelector('h4');
    if(h) return h.textContent.trim();
  }
  return field.getAttribute('placeholder') || 'Written response';
}

function collectAnswerSections(){
  const sections = [];
  document.querySelectorAll('.room').forEach(room=>{
    const num = room.querySelector('.num');
    const title = room.querySelector('.room-title');
    if(!num || !title) return;

    const items = [];
    room.querySelectorAll('.quiz').forEach((q, i)=>{
      const qtext = q.querySelector('.q') ? q.querySelector('.q').textContent.trim() : `Question ${i+1}`;
      const checked = q.querySelector('input[type=radio]:checked');
      const answer = checked ? checked.closest('label').textContent.trim() : '(not answered)';
      items.push({type:'quiz', label:qtext, value:answer});
    });

    room.querySelectorAll('.matchgame').forEach((game, i)=>{
      items.push({type:'game', label:`Interactive check ${i+1}`, value:describeMatchGame(game)});
    });

    room.querySelectorAll('textarea, input[type=text]').forEach(field=>{
      items.push({
        type:'field',
        label:fieldLabel(field),
        value:field.value.trim() || '(not answered)'
      });
    });

    if(items.length){
      sections.push({
        heading:`${num.textContent.trim()} - ${title.textContent.trim()}`,
        items
      });
    }
  });
  return sections;
}

function pdfSafeText(value){
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/\u00A0/g, ' ');
}

function buildIntegrityText(name, group){
  if(awayStart){
    tabAwayMs += Date.now() - awayStart;
    awayStart = null;
  }

  const mismatches = findKeystrokeMismatches();
  const pasteStations = [...new Set(pasteLog.map(p=>p.id))];
  const dropStations = [...new Set(dropLog.map(p=>p.id))];
  const mismatchStations = [...new Set(mismatches.map(m=>m.id))];
  const hardFlag = pasteLog.length > 0 || dropLog.length > 0 || mismatches.length > 0;

  const responseFields = [...document.querySelectorAll('.room textarea, .room input[type=text]')];
  const totalChars = responseFields.reduce((sum,t)=> sum + t.value.trim().length, 0);
  const totalWords = Math.round(totalChars / 5);
  const minutesActive = Math.max((Date.now() - sessionStart) / 60000, 0.1);
  const wpm = Math.round(totalWords / minutesActive);
  const speedNote = totalWords > 40 && wpm > 140;
  const lowPointerNote = totalChars > 150 && pointerMoveEvents < 15;

  return [
    'ESCAPE THE LOOP - TEACHER VERIFICATION',
    `Check: ${hardFlag ? 'REVIEW' : 'NO PRIMARY FLAGS'}`,
    `Student: ${name}`,
    `Class/group: ${group}`,
    `Paste attempts blocked: ${pasteLog.length}${pasteStations.length ? ' | rooms ' + pasteStations.join(', ') : ''}`,
    `Drag-drop attempts blocked: ${dropLog.length}${dropStations.length ? ' | rooms ' + dropStations.join(', ') : ''}`,
    `Keystroke/length mismatch: ${mismatches.length}${mismatchStations.length ? ' | rooms ' + mismatchStations.join(', ') : ''}`,
    `Tab switches away: ${tabAwayCount} | ${Math.round(tabAwayMs/1000)}s away`,
    `Composition speed: ~${wpm} wpm over ${totalWords} estimated words${speedNote ? ' | unusually fast' : ''}`,
    `Pointer activity: ${pointerMoveEvents} moves | ~${Math.round(pointerDistance)}px${lowPointerNote ? ' | unusually low' : ''}`,
    'Interpretation: browser-side signals only; not proof of misconduct.',
    `Generated: ${new Date().toISOString()}`
  ].join('\n');
}

function qrDataUrlFor(text){
  if(typeof QRCode === 'undefined'){
    throw new Error('QR library did not load. Refresh the page and try again.');
  }
  const host = document.getElementById('qrHidden');
  host.innerHTML = '';
  new QRCode(host, {
    text,
    width:256,
    height:256,
    correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : undefined
  });
  const canvas = host.querySelector('canvas');
  const img = host.querySelector('img');
  if(canvas) return canvas.toDataURL('image/png');
  if(img && img.src) return img.src;
  throw new Error('QR code could not be rendered.');
}

function buildSubmissionPdf(name, group, qrDataUrl, sections){
  if(!window.jspdf || !window.jspdf.jsPDF){
    throw new Error('PDF library did not load. Refresh the page and try again.');
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'portrait', unit:'mm', format:'a4'});
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  const footerY = pageH - 9;
  let y = 18;
  let pageNo = 1;

  doc.setProperties({
    title: `${name} - Escape the Loop`,
    subject: 'IB Psychology - Operant Conditioning evidence of work',
    author: name,
    creator: 'Escape the Loop'
  });

  function drawFooter(){
    doc.setDrawColor(220, 214, 202);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.setTextColor(105, 96, 84);
    doc.text('Escape the Loop - IB Psychology', margin, footerY);
    doc.text(`Page ${pageNo}`, pageW - margin, footerY, {align:'right'});
  }

  function addPage(){
    drawFooter();
    doc.addPage();
    pageNo += 1;
    y = 18;
  }

  function ensureSpace(mm){
    if(y + mm > footerY - 7) addPage();
  }

  function wrapped(text, x, maxWidth, fontSize=9, style='normal', color=[32,28,23], lineFactor=1.25){
    const safe = pdfSafeText(text);
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(safe, maxWidth);
    const lineMm = fontSize * 0.3528 * lineFactor;
    const height = Math.max(lineMm, lines.length * lineMm);
    ensureSpace(height + 1);
    doc.text(lines, x, y, {lineHeightFactor:lineFactor});
    y += height;
    return lines;
  }

  // Header
  doc.setFont('helvetica','bold');
  doc.setFontSize(18);
  doc.setTextColor(28,24,19);
  doc.text('OPERANT CONDITIONING', margin, y);
  y += 7;
  doc.setFontSize(14);
  doc.text('Escape the Loop - Evidence of Work', margin, y);
  y += 7;
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.setTextColor(95,87,76);
  doc.text(pdfSafeText(`${name} | ${group} | ${new Date().toLocaleDateString()}`), margin, y);

  // QR is deliberately presented without revealing the encoded result to students.
  const qrSize = 27;
  const qrX = pageW - margin - qrSize;
  const qrY = 13;
  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize, undefined, 'FAST');
  doc.setFont('helvetica','normal');
  doc.setFontSize(6.5);
  doc.setTextColor(110,100,88);
  doc.text('Teacher verification', qrX + qrSize/2, qrY + qrSize + 3.2, {align:'center'});

  y = Math.max(y + 7, qrY + qrSize + 8);

  // Required evidence reminder
  const reminder = 'REQUIRED: Upload this downloaded PDF to Elevfeedback as evidence of your work for this lesson.';
  doc.setFillColor(250,243,224);
  doc.setDrawColor(218,169,45);
  doc.roundedRect(margin, y, contentW, 17, 1.5, 1.5, 'FD');
  doc.setFont('helvetica','bold');
  doc.setFontSize(9.5);
  doc.setTextColor(55,43,20);
  const reminderLines = doc.splitTextToSize(reminder, contentW - 8);
  doc.text(reminderLines, margin + 4, y + 6, {lineHeightFactor:1.25});
  y += 23;

  sections.forEach(section=>{
    ensureSpace(18);
    doc.setDrawColor(214,55,31);
    doc.setLineWidth(0.8);
    doc.line(margin, y - 2.5, margin + 4, y - 2.5);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11.5);
    doc.setTextColor(34,29,23);
    const headingLines = doc.splitTextToSize(pdfSafeText(section.heading), contentW - 8);
    doc.text(headingLines, margin + 7, y, {lineHeightFactor:1.15});
    y += headingLines.length * 4.7 + 3;

    section.items.forEach(item=>{
      const label = pdfSafeText(item.label);
      const value = pdfSafeText(item.value);
      const labelLines = doc.splitTextToSize(label, contentW);
      const valueLines = doc.splitTextToSize(value, contentW - 4);
      const estimated = labelLines.length * 3.6 + valueLines.length * 3.6 + 5;
      ensureSpace(estimated);

      doc.setFont('helvetica', item.type === 'quiz' ? 'italic' : 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(73,66,57);
      doc.text(labelLines, margin, y, {lineHeightFactor:1.2});
      y += labelLines.length * 3.6 + 1;

      doc.setFont('helvetica','normal');
      doc.setFontSize(9);
      doc.setTextColor(25,22,19);
      doc.text(valueLines, margin + 3, y, {lineHeightFactor:1.25});
      y += valueLines.length * 4 + 3.2;
    });
    y += 2;
  });

  drawFooter();
  return doc;
}

function safeFilenamePart(value){
  return String(value || 'student')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'student';
}

const prepareBtn = document.getElementById('prepareBtn');
const submissionStatus = document.getElementById('submissionStatus');

function showSubmissionStatus(message, kind){
  submissionStatus.textContent = message;
  submissionStatus.className = `submission-status show ${kind || ''}`.trim();
}

prepareBtn.addEventListener('click', async ()=>{
  const nameField = document.getElementById('subName');
  const groupField = document.getElementById('subGroup');
  const name = nameField.value.trim();
  const group = groupField.value.trim();

  nameField.classList.toggle('needs-input', !name);
  groupField.classList.toggle('needs-input', !group);
  if(!name || !group){
    showSubmissionStatus('Enter both your name and class/group before downloading your evidence PDF.', 'error');
    return;
  }

  prepareBtn.disabled = true;
  const oldLabel = prepareBtn.textContent;
  prepareBtn.textContent = 'Building PDF...';
  showSubmissionStatus('Creating your evidence PDF...', '');

  try{
    const integrityText = buildIntegrityText(name, group);
    const qrDataUrl = qrDataUrlFor(integrityText);
    const sections = collectAnswerSections();
    const doc = buildSubmissionPdf(name, group, qrDataUrl, sections);
    const filename = `${safeFilenamePart(name)}_Escape_The_Loop_Evidence.pdf`;
    doc.save(filename);
    showSubmissionStatus(`PDF downloaded as ${filename}. Upload this file to Elevfeedback now as evidence of your work.`, 'success');
  }catch(err){
    console.error(err);
    showSubmissionStatus(`The PDF could not be created: ${err && err.message ? err.message : 'unknown error'}`, 'error');
  }finally{
    prepareBtn.disabled = false;
    prepareBtn.textContent = oldLabel;
  }
});
