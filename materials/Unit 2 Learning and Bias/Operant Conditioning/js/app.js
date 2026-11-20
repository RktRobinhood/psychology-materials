/* ============ SAVED PROGRESS ============ */
// Everything a student does is kept in localStorage, so a reload or a crashed tab
// does not cost them their answers (or their evidence PDF).
const STORE_KEY = 'escape-the-loop:v2';
function blankState(){
  return {
    v:2, order:null, fields:[], keys:[], radios:{}, attempts:{}, chips:{},
    maxUnlocked:0, current:0, done:[], code:null, name:'', group:'', sound:true,
    integrity:{ paste:[], drop:[], tabAwayCount:0, tabAwayMs:0, pointerMoves:0, pointerDist:0, sessionStart:Date.now() }
  };
}
function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if(s && s.v === 2) return Object.assign(blankState(), s);
  }catch(e){ /* storage blocked or corrupt */ }
  return null;
}
const restored = loadState();
const state = restored || blankState();
let saveTimer;
function saveNow(){
  clearTimeout(saveTimer);
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){ /* private mode: progress lives only in this tab */ }
}
function saveSoon(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
window.addEventListener('pagehide', saveNow);

/* ============ SOUND ============ */
// CC0 sound effects from kenney.nl, levelled to even loudness (see assets/CREDITS.md).
const SFX = ['tap','place','correct','wrong','unlock','door','dial','clunk','creak','escape'];
let actx = null, master = null;
const buffers = {}, fallbackAudio = {}, lastPlayed = {};
function audioInit(){
  if(actx || !(window.AudioContext || window.webkitAudioContext)) return;
  try{
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain();
    master.gain.value = .8;
    master.connect(actx.destination);
    SFX.forEach(name => fetch(`assets/audio/${name}.wav`)
      .then(r => r.arrayBuffer())
      .then(b => new Promise((res, rej) => actx.decodeAudioData(b, res, rej)))
      .then(buf => { buffers[name] = buf; })
      .catch(()=>{ /* file:// blocks fetch: <audio> fallback below */ }));
  }catch(e){ actx = null; }
}
['pointerdown','keydown'].forEach(ev => document.addEventListener(ev, ()=>{
  audioInit();
  if(actx && actx.state === 'suspended') actx.resume();
}, {capture:true}));
function sfx(name){
  if(!state.sound) return;
  const now = performance.now();
  if(now - (lastPlayed[name] || 0) < 70) return; // rapid clicks must not stack
  lastPlayed[name] = now;
  try{
    if(actx && buffers[name]){
      const src = actx.createBufferSource();
      src.buffer = buffers[name];
      if(name === 'tap' || name === 'place' || name === 'dial') src.playbackRate.value = .95 + Math.random() * .1;
      src.connect(master);
      src.start();
      return;
    }
    const base = fallbackAudio[name] || (fallbackAudio[name] = new Audio(`assets/audio/${name}.wav`));
    const a = base.cloneNode();
    a.volume = .8;
    a.play().catch(()=>{});
  }catch(e){ /* no audio */ }
}

/* ============ ICONS ============ */
// Lucide icons (ISC licence), inlined so they work offline.
const ICON = {
  on:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>',
  off:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>'
};
// Our own padlock: the shackle is a separate path so it can swing open.
const PADLOCK = '<svg class="padlock" viewBox="0 -7 24 35" aria-hidden="true"><path class="shackle" d="M7 12V8a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><rect x="3" y="11.5" width="18" height="14" rx="2.6" fill="currentColor"/><circle cx="12" cy="17.2" r="1.9" class="keyhole"/><rect x="11.05" y="17.6" width="1.9" height="4.4" rx=".95" class="keyhole"/></svg>';
document.querySelectorAll('.lock-badge').forEach(b => { b.innerHTML = PADLOCK; });
document.querySelectorAll('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', ICON[el.dataset.icon] || ''); });

// Tells the shared Report a problem form where the student is.
(window.MindfieldReport = window.MindfieldReport || {}).where = () => document.getElementById('navLabel').textContent.replace(/\s+/g, ' ').trim();
const soundBtn = document.getElementById('soundBtn');
function renderSoundBtn(){
  soundBtn.innerHTML = state.sound ? ICON.on : ICON.off;
  soundBtn.setAttribute('aria-label', state.sound ? 'Sound on (click to mute)' : 'Sound off (click to turn on)');
  soundBtn.title = soundBtn.getAttribute('aria-label');
}
soundBtn.addEventListener('click', ()=>{ state.sound = !state.sound; renderSoundBtn(); saveNow(); sfx('tap'); });
renderSoundBtn();

/* ============ SLIDE / CAROUSEL NAV ============ */
const slideIds = ['hero','lock0','r1','r2','r3','r4','midway','r6','r7','vault','end'];
const slideTitles = {hero:'Start', lock0:'Lock 00', r1:'Lock 01', r2:'Lock 02', r3:'Lock 03', r4:'Lock 04', midway:'Midway Vault', r6:'Lock 06', r7:'Lock 07', vault:'Final Vault', end:'Escaped'};
const roomOrder = ['lock0','r1','r2','r3','r4','midway','r6','r7','vault'];
const track = document.getElementById('track');
let currentIndex = 0;
let maxUnlocked = 0;
let fxBusy = false;

if(!state.code) state.code = roomOrder.map(()=> Math.floor(Math.random() * 10));

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
  state.current = i;
  applyTransform();
  updateNav();
  saveSoon();
  const slide = document.getElementById('slide-' + slideIds[i]);
  if(slide) slide.scrollTop = 0;
}
function updateRail(){
  const done = document.querySelectorAll('.room.room-complete').length;
  const pct = Math.round((done/roomOrder.length)*100);
  document.getElementById('fill').style.width = pct + '%';
  document.getElementById('rail-label').textContent = 'Lock ' + done + ' / ' + roomOrder.length;
  document.getElementById('streak').textContent = done>0 && done<roomOrder.length ? done+' cleared' : (done===roomOrder.length ? 'escaped' : '');
  document.querySelectorAll('#code .digit').forEach((d, i)=>{
    const got = state.done.includes(roomOrder[i]);
    d.textContent = got ? state.code[i] : '•';
    d.classList.toggle('got', got);
  });
}
function markComplete(el){
  el.classList.add('room-complete');
  const badge = el.querySelector('.lock-badge');
  if(badge) badge.classList.add('open');
}
function advanceUnlock(fromId){
  if(fxBusy) return;
  const el = document.getElementById(fromId);
  const first = el && !el.classList.contains('room-complete');
  if(el) markComplete(el);
  if(!state.done.includes(fromId)) state.done.push(fromId);
  const idx = slideIds.indexOf(fromId);
  if(idx > -1 && idx + 1 < slideIds.length && idx + 1 > maxUnlocked) maxUnlocked = idx + 1;
  state.maxUnlocked = maxUnlocked;
  saveNow();
  updateRail();
  const next = ()=> goTo(idx + 1);
  if(!first) return next();
  if(fromId === 'vault') vaultSequence(next);
  else unlockSequence(fromId, next);
}

/* ============ UNLOCK EFFECTS ============ */
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const unlockFx = document.getElementById('unlockFx');
unlockFx.querySelector('.fx-lock').innerHTML = PADLOCK;

function runFx(overlay, steps, done){
  // steps: [[ms, fn], ...]; clicking the overlay skips to the end.
  fxBusy = true;
  overlay.hidden = false;
  overlay.classList.remove('play');
  void overlay.offsetWidth;
  overlay.classList.add('play');
  const timers = [];
  let finished = false;
  const finish = ()=>{
    if(finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    overlay.classList.remove('play');
    overlay.hidden = true;
    overlay.onclick = null;
    fxBusy = false;
    done();
  };
  steps.forEach(([ms, fn]) => timers.push(setTimeout(()=>{ if(!finished) fn(finish); }, REDUCED ? Math.min(ms, 300) : ms)));
  overlay.onclick = finish;
}
function unlockSequence(roomId, done){
  const i = roomOrder.indexOf(roomId);
  const num = document.getElementById(roomId).querySelector('.num');
  unlockFx.querySelector('.fx-title').textContent = (num ? num.textContent.split('·')[0].trim() : 'LOCK') + ' OPEN';
  unlockFx.querySelector('.fx-digit').textContent = state.code[i];
  runFx(unlockFx, [
    [0, ()=> sfx('dial')],
    [320, ()=> sfx('unlock')],
    [1050, ()=> sfx('door')],
    [1500, finish => finish()]
  ], done);
}

const vaultFx = document.getElementById('vaultFx');
(function buildVault(){
  const ticks = Array.from({length:40}, (_, k)=>{
    const a = k * 9 * Math.PI / 180, r1 = k % 5 ? 88 : 82;
    return `<line x1="${100 + Math.sin(a)*r1}" y1="${100 - Math.cos(a)*r1}" x2="${100 + Math.sin(a)*94}" y2="${100 - Math.cos(a)*94}"/>`;
  }).join('');
  const spokes = Array.from({length:6}, (_, k)=> `<rect x="95" y="28" width="10" height="72" rx="5" transform="rotate(${k*60} 100 100)"/>`).join('');
  vaultFx.querySelector('.vault-wheel').innerHTML =
    `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96" class="vw-rim"/><g class="vw-ticks">${ticks}</g>` +
    `<g class="vw-spin"><circle cx="100" cy="100" r="62" class="vw-ring"/>${spokes}<circle cx="100" cy="100" r="20" class="vw-hub"/></g></svg>`;
  vaultFx.querySelector('.vault-digits').innerHTML = roomOrder.map(()=> '<span></span>').join('');
})();
function vaultSequence(done){
  const cells = [...vaultFx.querySelectorAll('.vault-digits span')];
  cells.forEach(c => { c.textContent = ''; c.classList.remove('on'); });
  const steps = cells.map((c, i)=> [250 + i*170, ()=>{ c.textContent = state.code[i]; c.classList.add('on'); sfx('dial'); }]);
  steps.push([250 + cells.length*170 + 150, ()=>{ vaultFx.classList.add('turn'); sfx('clunk'); }]);
  steps.push([250 + cells.length*170 + 900, ()=>{ vaultFx.classList.add('swing'); sfx('creak'); }]);
  steps.push([250 + cells.length*170 + 1500, ()=> sfx('escape')]);
  steps.push([250 + cells.length*170 + 2900, finish => finish()]);
  vaultFx.classList.remove('turn','swing');
  runFx(vaultFx, steps, ()=>{ vaultFx.classList.remove('turn','swing'); done(); });
}

document.getElementById('navPrev').addEventListener('click', ()=> goTo(currentIndex - 1));
document.getElementById('navNext').addEventListener('click', ()=> goTo(currentIndex + 1));
document.addEventListener('keydown', (e)=>{
  const tag = document.activeElement.tagName;
  if(fxBusy || tag === 'TEXTAREA' || tag === 'INPUT') return;
  if(e.key === 'ArrowRight') document.getElementById('navNext').click();
  if(e.key === 'ArrowLeft') document.getElementById('navPrev').click();
});

document.getElementById('btn-hero').addEventListener('click', ()=>{
  if(maxUnlocked < 1){ maxUnlocked = 1; state.maxUnlocked = 1; sfx('door'); }
  goTo(Math.max(1, Math.min(state.current || 1, maxUnlocked)));
});
document.getElementById('btn-reset').addEventListener('click', ()=>{
  if(!confirm('Start over? This deletes every answer saved on this device for this lesson.')) return;
  try{ localStorage.removeItem(STORE_KEY); }catch(e){}
  location.reload();
});

/* ============ SHUFFLED ORDER (per student, kept across reloads) ============ */
function shuffled(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const quizName = q => q.querySelector('input[type=radio]').name;
const allQuizzes = [...document.querySelectorAll('.quiz')];
const quizRooms = [...new Set(allQuizzes.map(q => q.dataset.room))];
if(!state.order){
  const o = {options:{}, quizzes:{}, banks:{}};
  allQuizzes.forEach(q=>{ o.options[quizName(q)] = shuffled([...q.querySelectorAll('input[type=radio]')].map(i => i.value)); });
  quizRooms.forEach(room=>{ o.quizzes[room] = shuffled(allQuizzes.filter(q => q.dataset.room === room).map(quizName)); });
  document.querySelectorAll('.matchgame').forEach(g=>{ o.banks[g.id] = shuffled([...g.querySelectorAll('.bank .chip')].map(c => c.id)); });
  state.order = o;
}
(function applyOrder(){
  const o = state.order;
  allQuizzes.forEach(q=>{
    const order = o.options[quizName(q)];
    if(!order) return;
    const firstFb = q.querySelector('.fb');
    order.forEach(v=>{
      const input = q.querySelector(`input[type=radio][value="${v}"]`);
      if(input) q.insertBefore(input.closest('label'), firstFb);
    });
  });
  quizRooms.forEach(room=>{
    const qs = allQuizzes.filter(q => q.dataset.room === room);
    const order = o.quizzes[room];
    if(!order || qs.length < 2 || !qs.every(q => q.parentNode === qs[0].parentNode)) return;
    const parent = qs[0].parentNode;
    const anchor = qs[qs.length - 1].nextSibling;
    order.forEach(name=>{ const q = qs.find(x => quizName(x) === name); if(q) parent.insertBefore(q, anchor); });
  });
  // Numbered checks are renumbered to match the new order.
  document.querySelectorAll('#r7 .quiz .q').forEach((p, i)=>{ p.textContent = (i + 1) + '. ' + p.textContent.replace(/^\d+\.\s*/, ''); });
  document.querySelectorAll('.matchgame').forEach(g=>{
    const bank = g.querySelector('.bank');
    (o.banks[g.id] || []).forEach(id=>{ const chip = document.getElementById(id); if(chip && chip.parentNode === bank) bank.appendChild(chip); });
  });
})();
// Runs after the shuffle: consecutive questions share a grid that shows two columns on laptops.
document.querySelectorAll('.room').forEach(room=>{
  const qs = [...room.children].filter(el => el.classList.contains('quiz'));
  if(qs.length < 2) return;
  const grid = document.createElement('div');
  grid.className = 'quiz-grid';
  qs[0].before(grid);
  qs.forEach(q => grid.appendChild(q));
});

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
  sfx('wrong');
  let warn = roomEl.querySelector('.field-warning');
  if(!warn){
    warn = document.createElement('div');
    warn.className = 'field-warning';
    roomEl.querySelector('.room-footer').insertAdjacentElement('beforebegin', warn);
  }
  warn.textContent = msg || '✏️ Fill in every box below with a real answer (not just a word or two) before continuing.';
  warn.scrollIntoView({behavior:'smooth', block:'center'});
}

/* ============ QUIZZES ============ */
// A wrong pick locks the question for a few seconds, so guessing through the options is slow.
// The number of picks is recorded for the teacher.
const COOLDOWN_S = 4;
const answerKey = { q0a:'b', q0b:'c', q0c:'a', qmid:'d', qc1:'c', qc2:'d', qc3:'d', qc4:'c', qc5:'d', qc6:'c' };
Object.keys(answerKey).forEach(name=>{
  document.querySelectorAll('input[name="'+name+'"]').forEach(inp=>{
    if(inp.value === answerKey[name]) inp.setAttribute('data-c','1');
  });
});
const roomQuizCorrect = {};
function showQuizResult(q, right){
  q.querySelector('.fb.correct').style.display = right ? 'block' : 'none';
  q.querySelector('.fb.wrong').style.display = right ? 'none' : 'block';
}
function setSolved(q){
  q.classList.add('solved');
  q.querySelectorAll('input[type=radio]').forEach(i => { i.disabled = true; });
  const room = q.dataset.room;
  if(!roomQuizCorrect[room]) roomQuizCorrect[room] = new Set();
  roomQuizCorrect[room].add(q);
}
function coolDown(q){
  const inputs = q.querySelectorAll('input[type=radio]');
  inputs.forEach(i => { i.disabled = true; });
  q.classList.add('cooling');
  let note = q.querySelector('.cool-note');
  if(!note){ note = document.createElement('div'); note.className = 'cool-note'; q.querySelector('.fb.wrong').appendChild(note); }
  let left = COOLDOWN_S;
  const tick = ()=>{
    if(left <= 0){
      q.classList.remove('cooling');
      if(!q.classList.contains('solved')) inputs.forEach(i => { i.disabled = false; });
      note.textContent = 'Try again.';
      return;
    }
    note.textContent = `Re-read the question. The options unlock in ${left} s.`;
    left--;
    setTimeout(tick, 1000);
  };
  tick();
}
allQuizzes.forEach(q=>{
  const name = quizName(q);
  q.querySelectorAll('input[type=radio]').forEach(r=>{
    r.addEventListener('change', ()=>{
      const right = r.getAttribute('data-c') === '1';
      state.radios[name] = r.value;
      state.attempts[name] = (state.attempts[name] || 0) + 1;
      showQuizResult(q, right);
      if(right){ setSolved(q); sfx('correct'); }
      else { sfx('wrong'); coolDown(q); }
      saveNow();
      checkRoomButtons(q.dataset.room);
    });
  });
});
function roomQuizzesOK(roomId){
  const quizzes = document.querySelectorAll('.quiz[data-room="'+roomId+'"]');
  const correctSet = roomQuizCorrect[roomId] || new Set();
  return quizzes.length > 0 && correctSet.size === quizzes.length;
}

/* ============ DRAG / CLICK MATCH GAMES ============ */
let pickedChip = null;
const zonesOf = game => [...game.querySelectorAll('.zone')];
function recordChip(chip){
  const game = chip.closest('.matchgame');
  const zone = chip.closest('.zone');
  state.chips[chip.id] = zone ? zonesOf(game).indexOf(zone) : -1;
}
function placeChip(chip, zone){
  if(zone.classList.contains('zone') && zone.dataset.single === 'true'){
    const existing = zone.querySelector('.chip');
    if(existing && existing !== chip){
      const game = zone.closest('.matchgame');
      game.querySelector('.bank').appendChild(existing);
      recordChip(existing);
    }
  }
  zone.appendChild(chip);
  chip.classList.remove('picked');
  recordChip(chip);
  saveSoon();
  sfx('place');
}
document.querySelectorAll('.matchgame').forEach(game=>{
  game.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', chip.id); });
    chip.addEventListener('click', (e)=>{
      // A tap on a chip that is already picked puts it down again.
      e.stopPropagation();
      if(chip.classList.contains('picked')){ chip.classList.remove('picked'); pickedChip = null; return; }
      // Holding a card and tapping one already in a slot drops the held card into that slot.
      if(pickedChip && game.contains(pickedChip) && chip.parentNode.classList.contains('zone')){
        placeChip(pickedChip, chip.parentNode); pickedChip = null; evaluateGame(game); return;
      }
      game.querySelectorAll('.chip.picked').forEach(c=>c.classList.remove('picked'));
      chip.classList.add('picked');
      pickedChip = chip;
      sfx('tap');
    });
  });
  game.querySelectorAll('.zone, .bank').forEach(zone=>{
    zone.addEventListener('dragover', (e)=> e.preventDefault());
    zone.addEventListener('drop', (e)=>{
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const chip = document.getElementById(id);
      if(chip && game.contains(chip)){ placeChip(chip, zone); evaluateGame(game); }
    });
    zone.addEventListener('click', ()=>{
      if(pickedChip && game.contains(pickedChip)){ placeChip(pickedChip, zone); pickedChip = null; evaluateGame(game); }
    });
  });
});
function evaluateGame(game, silent){
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
  const wasWon = status.classList.contains('ok');
  if(win){ status.className = 'game-status ok'; status.textContent = '✓ Correct — this door is open.'; if(!wasWon && !silent) sfx('correct'); }
  else if(anyPlaced){ status.className = 'game-status notyet'; status.textContent = 'Not quite — check the placements and try again.'; }
  else { status.className = 'game-status notyet'; status.textContent = 'Keep going — place every card.'; }
  const roomEl = game.closest('.room');
  if(roomEl) checkRoomButtons(roomEl.id);
}

/* ============ PER-ROOM BUTTON ENABLE (quiz/game correctness only — text checked at click) ============ */
const gameOK = id => document.getElementById(id).querySelector('.game-status').classList.contains('ok');
function checkRoomButtons(roomId){
  if(roomId === 'lock0') document.getElementById('btn-lock0').disabled = !roomQuizzesOK('lock0');
  if(roomId === 'r2') document.getElementById('btn-r2').disabled = !gameOK('mg-r2');
  if(roomId === 'r3') document.getElementById('btn-r3').disabled = !gameOK('mg-r3');
  if(roomId === 'r4') document.getElementById('btn-r4').disabled = !gameOK('mg-r4');
  if(roomId === 'midway') document.getElementById('btn-midway').disabled = !(gameOK('mg-mid1') && gameOK('mg-mid-schedules') && gameOK('mg-mid2') && roomQuizzesOK('midway'));
  if(roomId === 'r7') document.getElementById('btn-r7').disabled = !roomQuizzesOK('r7');
}

/* ============ WRITTEN ANSWERS ============ */
const responseFields = [...document.querySelectorAll('.room textarea, .room input[type=text]')];
const keystrokeCounts = new WeakMap();
responseFields.forEach((f, i)=>{
  keystrokeCounts.set(f, state.keys[i] || 0);
  f.addEventListener('input', ()=>{
    const min = f.tagName === 'TEXTAREA' ? 8 : 2;
    if(f.value.trim().length >= min) f.classList.remove('needs-input');
    state.fields[i] = f.value;
    state.keys[i] = keystrokeCounts.get(f) || 0;
    saveSoon();
  });
});

document.getElementById('btn-lock0').addEventListener('click', ()=>{ if(!document.getElementById('btn-lock0').disabled) advanceUnlock('lock0'); });
document.getElementById('btn-r1').addEventListener('click', ()=>{
  const el = document.getElementById('r1');
  if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
  advanceUnlock('r1');
});
document.getElementById('btn-r2').addEventListener('click', ()=>{ if(!document.getElementById('btn-r2').disabled) advanceUnlock('r2'); });
['r3','r4','midway'].forEach(id=>{
  document.getElementById('btn-' + id).addEventListener('click', ()=>{
    if(document.getElementById('btn-' + id).disabled) return;
    const el = document.getElementById(id);
    if(!textFieldsFilled(el)){ flagAndWarn(el); return; }
    advanceUnlock(id);
  });
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

/* ============ RESTORE ============ */
(function restore(){
  responseFields.forEach((f, i)=>{ if(typeof state.fields[i] === 'string') f.value = state.fields[i]; });
  allQuizzes.forEach(q=>{
    const v = state.radios[quizName(q)];
    const input = v && q.querySelector(`input[type=radio][value="${v}"]`);
    if(!input) return;
    input.checked = true;
    const right = input.getAttribute('data-c') === '1';
    showQuizResult(q, right);
    if(right) setSolved(q);
  });
  document.querySelectorAll('.matchgame').forEach(game=>{
    const zones = zonesOf(game);
    game.querySelectorAll('.chip').forEach(chip=>{
      const at = state.chips[chip.id];
      if(typeof at === 'number' && zones[at]) zones[at].appendChild(chip);
    });
    if(game.querySelector('.zone .chip')) evaluateGame(game, true);
  });
  state.done.forEach(id=>{ const el = document.getElementById(id); if(el) markComplete(el); });
  maxUnlocked = Math.min(state.maxUnlocked || 0, slideIds.length - 1);
  quizRooms.forEach(checkRoomButtons);
  if(restored && (maxUnlocked > 0 || responseFields.some(f => f.value))){
    document.getElementById('resumeNote').hidden = false;
    document.getElementById('btn-hero').textContent = 'CONTINUE EXPERIMENT';
  }
  document.getElementById('subName').value = state.name || '';
  document.getElementById('subGroup').value = state.group || '';
})();
updateRail();
updateNav();
saveNow();

/* ============ INTEGRITY SIGNALS ============ */
const integ = state.integrity;
const toast = document.getElementById('pasteToast');
let toastTimer;
let awayStart = null;
let lastPX = null, lastPY = null;

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

document.querySelectorAll('.room textarea').forEach(ta=>{
  ta.addEventListener('paste', (e)=>{
    e.preventDefault();
    const st = stationOf(ta);
    integ.paste.push({ id: st.id, label: st.label });
    ta.classList.add('flagged');
    saveNow();
    flash('Pasting is disabled here — type your own answer.');
  });
  ta.addEventListener('drop', (e)=>{
    e.preventDefault();
    const st = stationOf(ta);
    integ.drop.push({ id: st.id, label: st.label });
    ta.classList.add('flagged');
    saveNow();
    flash('Dragging text in is disabled here — type your own answer.');
  });
  ta.addEventListener('dragover', (e)=> e.preventDefault());
  ta.addEventListener('keydown', (e)=>{
    if(!IGNORE_KEYS.has(e.key)) keystrokeCounts.set(ta, keystrokeCounts.get(ta) + 1);
  });
});

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){ integ.tabAwayCount++; awayStart = Date.now(); saveNow(); }
  else if(awayStart){ integ.tabAwayMs += Date.now() - awayStart; awayStart = null; saveSoon(); }
});
document.addEventListener('pointermove', (e)=>{
  integ.pointerMoves++;
  if(lastPX !== null){ integ.pointerDist += Math.hypot(e.clientX-lastPX, e.clientY-lastPY); }
  lastPX = e.clientX; lastPY = e.clientY;
});

function findKeystrokeMismatches(){
  const THRESHOLD = 15;
  const mismatches = [];
  document.querySelectorAll('.room textarea').forEach(ta=>{
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
  let correct = 0;
  zones.forEach(z=>{
    z.querySelectorAll('.chip').forEach(chip=>{ if(chip.dataset.answer === z.dataset.accept) correct++; });
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
function quizValue(q){
  const checked = q.querySelector('input[type=radio]:checked');
  if(!checked) return '(not answered)';
  const answer = checked.closest('label').textContent.trim();
  const n = state.attempts[quizName(q)] || 1;
  if(!q.classList.contains('solved')) return `${answer} [not yet correct, ${n} attempt${n === 1 ? '' : 's'}]`;
  return `${answer} [${n === 1 ? 'correct first try' : 'correct on attempt ' + n}]`;
}

function collectAnswerSections(){
  const sections = [];
  const cleared = state.done.filter(id => roomOrder.includes(id)).length;
  const quizzes = allQuizzes.length;
  const firstTry = allQuizzes.filter(q => q.classList.contains('solved') && (state.attempts[quizName(q)] || 1) === 1).length;
  sections.push({ heading:'Progress', items:[
    {type:'field', label:'Locks cleared', value:`${cleared} of ${roomOrder.length}`},
    {type:'field', label:'Multiple-choice questions correct on the first try', value:`${firstTry} of ${quizzes}`}
  ]});
  document.querySelectorAll('.room').forEach(room=>{
    const num = room.querySelector('.num');
    const title = room.querySelector('.room-title');
    if(!num || !title) return;

    const items = [];
    room.querySelectorAll('.quiz').forEach((q, i)=>{
      const qtext = q.querySelector('.q') ? q.querySelector('.q').textContent.trim() : `Question ${i+1}`;
      items.push({type:'quiz', label:qtext, value:quizValue(q)});
    });
    room.querySelectorAll('.matchgame').forEach((game, i)=>{
      items.push({type:'game', label:`Interactive check ${i+1}`, value:describeMatchGame(game)});
    });
    room.querySelectorAll('textarea, input[type=text]').forEach(field=>{
      items.push({ type:'field', label:fieldLabel(field), value:field.value.trim() || '(not answered)' });
    });
    if(items.length){
      sections.push({ heading:`${num.textContent.trim()} - ${title.textContent.trim()}`, items });
    }
  });
  return sections;
}

function pdfSafeText(value){
  // The built-in PDF font only covers Latin-1 (æ, ø and å are fine); anything else is mapped or dropped.
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≠/g, '!=')
    .replace(/•/g, '-')
    .replace(/ /g, ' ')
    .replace(/[^\x00-\xFF]/g, '');
}

function buildIntegrityText(name, group){
  if(awayStart){
    integ.tabAwayMs += Date.now() - awayStart;
    awayStart = Date.now();
  }
  const mismatches = findKeystrokeMismatches();
  const pasteStations = [...new Set(integ.paste.map(p=>p.id))];
  const dropStations = [...new Set(integ.drop.map(p=>p.id))];
  const mismatchStations = [...new Set(mismatches.map(m=>m.id))];
  const hardFlag = integ.paste.length > 0 || integ.drop.length > 0 || mismatches.length > 0;

  const totalChars = responseFields.reduce((sum,t)=> sum + t.value.trim().length, 0);
  const totalWords = Math.round(totalChars / 5);
  const minutesActive = Math.max((Date.now() - integ.sessionStart) / 60000, 0.1);
  const wpm = Math.round(totalWords / minutesActive);
  const speedNote = totalWords > 40 && wpm > 140;
  const lowPointerNote = totalChars > 150 && integ.pointerMoves < 15;
  const guesses = allQuizzes.reduce((n, q)=> n + Math.max(0, (state.attempts[quizName(q)] || 0) - 1), 0);

  return [
    'ESCAPE THE LOOP - TEACHER VERIFICATION',
    `Check: ${hardFlag ? 'REVIEW' : 'NO PRIMARY FLAGS'}`,
    `Student: ${name}`,
    `Class/group: ${group}`,
    `Paste attempts blocked: ${integ.paste.length}${pasteStations.length ? ' | rooms ' + pasteStations.join(', ') : ''}`,
    `Drag-drop attempts blocked: ${integ.drop.length}${dropStations.length ? ' | rooms ' + dropStations.join(', ') : ''}`,
    `Keystroke/length mismatch: ${mismatches.length}${mismatchStations.length ? ' | rooms ' + mismatchStations.join(', ') : ''}`,
    `Tab switches away: ${integ.tabAwayCount} | ${Math.round(integ.tabAwayMs/1000)}s away`,
    `Composition speed: ~${wpm} wpm over ${totalWords} estimated words${speedNote ? ' | unusually fast' : ''}`,
    `Pointer activity: ${integ.pointerMoves} moves | ~${Math.round(integ.pointerDist)}px${lowPointerNote ? ' | unusually low' : ''}`,
    `Wrong MC picks before correct: ${guesses}`,
    `Session started: ${new Date(integ.sessionStart).toISOString()}`,
    'Interpretation: browser-side signals only; not proof of misconduct.',
    `Generated: ${new Date().toISOString()}`
  ].join('\n');
}

/* ============ EVIDENCE EXPORT ============ */
// Each library has two CDNs, tried in turn: some school networks block one of them.
const LIBS = {
  pdf: { ready:()=> !!(window.jspdf && window.jspdf.jsPDF), src:[
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'] },
  // qrcode-generator replaces qrcodejs, which crashed on any non-ASCII character (æ, ø, å).
  qr: { ready:()=> typeof window.qrcode === 'function', src:[
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
    'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js'] }
};
const libLoading = {};
function ensureLib(key){
  const lib = LIBS[key];
  if(lib.ready()) return Promise.resolve(true);
  if(libLoading[key]) return libLoading[key];
  libLoading[key] = lib.src.reduce((chain, src)=> chain.then(ok => ok || new Promise(res=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=> res(lib.ready());
    s.onerror = ()=> res(false);
    document.head.appendChild(s);
  })), Promise.resolve(false)).then(ok => { if(!ok) libLoading[key] = null; return ok; });
  return libLoading[key];
}
// Start loading early so the final click is quick.
setTimeout(()=>{ ensureLib('pdf'); ensureLib('qr'); }, 1500);

function makeQr(text){
  if(!LIBS.qr.ready()) return null;
  try{
    window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
    const q = window.qrcode(0, 'L');
    q.addData(text, 'Byte');
    q.make();
    return q;
  }catch(e){ console.error(e); return null; }
}

async function buildSubmissionPdf(name, group){
  const [pdfOk] = await Promise.all([ensureLib('pdf'), ensureLib('qr')]);
  if(!pdfOk) throw new Error('the PDF tool could not load; the network may be blocking it');
  const qr = makeQr(buildIntegrityText(name, group));
  const sections = collectAnswerSections();

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
    title: pdfSafeText(`${name} - Escape the Loop`),
    subject: 'IB Psychology - Operant Conditioning evidence of work',
    author: pdfSafeText(name),
    creator: 'Escape the Loop'
  });

  function drawFooter(){
    doc.setDrawColor(220, 214, 202);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.setTextColor(105, 96, 84);
    doc.text('Escape the Loop - IB Psychology', margin, footerY);
    doc.text(`Page ${pageNo}`, pageW - margin, footerY, {align:'right'});
  }
  function addPage(){ drawFooter(); doc.addPage(); pageNo += 1; y = 18; }
  function ensureSpace(mm){ if(y + mm > footerY - 7) addPage(); }

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

  // QR drawn as vector squares; the encoded result is deliberately not shown to students.
  const qrSize = 38;
  const qrX = pageW - margin - qrSize;
  const qrY = 10;
  if(qr){
    const n = qr.getModuleCount();
    const cell = qrSize / (n + 4);
    doc.setFillColor(255,255,255);
    doc.rect(qrX, qrY, qrSize, qrSize, 'F');
    doc.setFillColor(0,0,0);
    for(let r = 0; r < n; r++){
      let c = 0;
      while(c < n){
        if(!qr.isDark(r, c)){ c++; continue; }
        let run = 1;
        while(c + run < n && qr.isDark(r, c + run)) run++;
        doc.rect(qrX + (c + 2) * cell, qrY + (r + 2) * cell, run * cell + 0.01, cell + 0.01, 'F');
        c += run;
      }
    }
  }else{
    doc.setDrawColor(180,170,155);
    doc.rect(qrX, qrY, qrSize, qrSize);
    doc.setFontSize(6.5);
    doc.setTextColor(110,100,88);
    doc.text(['Verification code', 'unavailable', '(QR tool blocked)'], qrX + qrSize/2, qrY + qrSize/2 - 2, {align:'center'});
  }
  doc.setFont('helvetica','normal');
  doc.setFontSize(6.5);
  doc.setTextColor(110,100,88);
  doc.text('Teacher verification', qrX + qrSize/2, qrY + qrSize + 3.2, {align:'center'});

  y = Math.max(y + 7, qrY + qrSize + 8);

  const reminder = 'REQUIRED: Upload this downloaded PDF to Elevfeedback as evidence of your work for this lesson.';
  doc.setFillColor(250,243,224);
  doc.setDrawColor(218,169,45);
  doc.roundedRect(margin, y, contentW, 12, 1.5, 1.5, 'FD');
  doc.setFont('helvetica','bold');
  doc.setFontSize(9.5);
  doc.setTextColor(55,43,20);
  doc.text(doc.splitTextToSize(reminder, contentW - 8), margin + 4, y + 7.3);
  y += 19;

  sections.forEach(section=>{
    ensureSpace(18);
    doc.setDrawColor(214,55,31);
    doc.setLineWidth(0.8);
    doc.line(margin, y - 2.5, margin + 4, y - 2.5);
    doc.setLineWidth(0.2);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11.5);
    doc.setTextColor(34,29,23);
    const headingLines = doc.splitTextToSize(pdfSafeText(section.heading), contentW - 8);
    doc.text(headingLines, margin + 7, y, {lineHeightFactor:1.15});
    y += headingLines.length * 4.7 + 3;

    section.items.forEach(item=>{
      doc.setFontSize(8.5);
      const labelLines = doc.splitTextToSize(pdfSafeText(item.label), contentW);
      doc.setFontSize(9);
      const valueLines = doc.splitTextToSize(pdfSafeText(item.value), contentW - 4);
      // Long answers may run over several pages; print them in page-sized chunks.
      ensureSpace(labelLines.length * 3.6 + Math.min(valueLines.length, 3) * 4 + 5);

      doc.setFont('helvetica', item.type === 'quiz' ? 'italic' : 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(73,66,57);
      doc.text(labelLines, margin, y, {lineHeightFactor:1.2});
      y += labelLines.length * 3.6 + 1;

      doc.setFont('helvetica','normal');
      doc.setFontSize(9);
      doc.setTextColor(25,22,19);
      let rest = valueLines;
      while(rest.length){
        const fit = Math.max(1, Math.floor((footerY - 7 - y) / 4));
        const chunk = rest.slice(0, fit);
        doc.text(chunk, margin + 3, y, {lineHeightFactor:1.25});
        y += chunk.length * 4;
        rest = rest.slice(fit);
        if(rest.length) addPage();
      }
      y += 3.2;
    });
    y += 2;
  });

  drawFooter();
  return { doc, hasQr: !!qr };
}

function pdfFilename(name){
  const ascii = String(name || '').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/ø/g, 'oe').replace(/Ø/g, 'Oe')
    .replace(/å/g, 'aa').replace(/Å/g, 'Aa')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  const safe = ascii.trim().replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'student';
  return `${safe}_Escape_The_Loop_Evidence.pdf`;
}

/* Browser-native fallback: a plain sheet that the print dialog turns into a PDF. */
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function printEvidence(name, group){
  await ensureLib('qr');
  const qr = makeQr(buildIntegrityText(name, group));
  const sheet = document.getElementById('printSheet');
  sheet.innerHTML = `<div class="ps-head"><div><h1>Escape the Loop: Evidence of Work</h1>
      <p class="ps-meta">${escapeHtml(name)} | ${escapeHtml(group)} | ${escapeHtml(new Date().toLocaleString())}</p>
      <p class="ps-req">Upload this to Elevfeedback as evidence of your work for this lesson.</p></div>
      ${qr ? `<figure>${qr.createSvgTag(3, 6)}<figcaption>Teacher verification</figcaption></figure>` : ''}</div>
    ${collectAnswerSections().map(sec => `<h2>${escapeHtml(sec.heading)}</h2><dl>${sec.items.map(it =>
      `<dt>${escapeHtml(it.label)}</dt><dd>${escapeHtml(it.value)}</dd>`).join('')}</dl>`).join('')}`;
  window.print();
}
function evidenceText(name, group){
  const code = btoa(unescape(encodeURIComponent(buildIntegrityText(name, group))));
  return ['ESCAPE THE LOOP - EVIDENCE OF WORK', `${name} | ${group} | ${new Date().toLocaleString()}`, '',
    ...collectAnswerSections().flatMap(sec => [`== ${sec.heading} ==`, ...sec.items.map(it => `- ${it.label}: ${it.value}`), '']),
    'Teacher verification code:', code].join('\n');
}

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const prepareBtn = document.getElementById('prepareBtn');
const submissionStatus = document.getElementById('submissionStatus');
const nameField = document.getElementById('subName');
const groupField = document.getElementById('subGroup');
nameField.addEventListener('input', ()=>{ state.name = nameField.value; saveSoon(); });
groupField.addEventListener('input', ()=>{ state.group = groupField.value; saveSoon(); });

function showSubmissionStatus(message, kind){
  submissionStatus.textContent = message;
  submissionStatus.className = `submission-status show ${kind || ''}`.trim();
}
function who(){
  const name = nameField.value.trim();
  const group = groupField.value.trim();
  nameField.classList.toggle('needs-input', !name);
  groupField.classList.toggle('needs-input', !group);
  if(name && group) return [name, group];
  showSubmissionStatus('Enter both your name and class/group first.', 'error');
  (name ? groupField : nameField).focus();
  return null;
}
function showHelp(){ document.getElementById('saveHelp').classList.add('show'); }
function failed(err){
  console.error(err);
  showHelp();
  showSubmissionStatus(`The PDF could not be made here (${err && err.message ? err.message : 'unknown error'}). Use one of the backup options below instead.`, 'error');
}
async function busy(btn, label, fn){
  const old = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = label;
  try{ await fn(); } finally { btn.disabled = false; btn.innerHTML = old; }
}
async function openInTab(w){
  const tab = window.open('', '_blank'); // must open during the click or it is blocked
  try{
    const { doc, hasQr } = await buildSubmissionPdf(...w);
    const url = doc.output('bloburl');
    if(tab){ tab.location.href = url; showSubmissionStatus('The PDF opened in a new tab. Save or share it from there (on iPad: Share → Save to Files), then upload it to Elevfeedback.', 'success'); }
    else { doc.save(pdfFilename(w[0])); showSubmissionStatus('Pop-ups are blocked, so the PDF was downloaded instead. Upload it to Elevfeedback.', 'success'); }
    if(!hasQr) showHelp();
  }catch(e){ if(tab) tab.close(); failed(e); }
}

prepareBtn.addEventListener('click', ()=>{
  const w = who(); if(!w) return;
  saveNow();
  // iPads and some embedded browsers ignore downloads, so they get the PDF in a new tab.
  if(IS_IOS) return openInTab(w);
  busy(prepareBtn, 'Building PDF...', async ()=>{
    showSubmissionStatus('Creating your evidence PDF...', '');
    try{
      const { doc, hasQr } = await buildSubmissionPdf(...w);
      const filename = pdfFilename(w[0]);
      doc.save(filename);
      showSubmissionStatus(`PDF downloaded as ${filename}. Upload this file to Elevfeedback now. Nothing downloaded? Use the backup options below.${hasQr ? '' : ' (The verification code could not load; your teacher may ask about it.)'}`, 'success');
      showHelp();
    }catch(e){ failed(e); }
  });
});
document.getElementById('openBtn').addEventListener('click', ()=>{ const w = who(); if(w) openInTab(w); });
document.getElementById('printBtn').addEventListener('click', ()=>{ const w = who(); if(w) printEvidence(...w); });
document.getElementById('copyBtn').addEventListener('click', async ()=>{
  const w = who(); if(!w) return;
  const box = document.getElementById('copyBox');
  box.value = evidenceText(...w);
  box.hidden = false;
  try{ await navigator.clipboard.writeText(box.value); showSubmissionStatus('Copied. Paste it into Elevfeedback.', 'success'); }
  catch(e){ box.focus(); box.select(); showSubmissionStatus('Select all the text in the box, copy it, and paste it into Elevfeedback.', 'success'); }
});
