/* Memory Olympiad v6 — no sign-up; fresh questions; two saved runs. */
(function(){
'use strict';
const EV=window.MemoryEvents;
const EX=window.MemoryExport;
const EVENTS=EV.events;
const MAIN=document.getElementById('app');
const STORAGE_KEY='memory-olympiad-v5-local';
const s=EV.escape;
const TRICKS=[
 {name:'Memory palace',best:'Words & card order',head:'Put things in familiar places.',steps:['Pick a familiar route with 5–10 stops, like the route through your home.','Imagine a funny, vivid object at each stop.','Walk through the same route in your mind to recall the objects in order.'],example:'Front door = giant banana; sink = dancing tiger; sofa = exploding clock. Look away and walk through the three places again.'},
 {name:'Chunking',best:'Digits',head:'Make a long sequence easier to handle.',steps:['Split a number or list into manageable groups.','Turn the groups into meaningful dates, images or familiar patterns.','Remember the groups and rebuild the original sequence.'],example:'202610223314 becomes 2026 | 1022 | 33 | 14. Give each group a meaning; just adding spaces is not enough.'},
 {name:'Ridiculous story',best:'Words & sequences',head:'Link objects into one surprising story.',steps:['Picture the first two objects doing something unusual together.','Make the second item lead directly to the third.','Recreate the original order by retelling the story.'],example:'Tiger → laptop → pizza → balloon. A tiger orders a pizza on a laptop, then the pizza turns into a balloon.'},
 {name:'Name + face hook',best:'Faces & names',head:'Link the name to a memorable face detail.',steps:['Notice a distinctive, respectful visual detail such as a hat or hair shape.','Turn the name into a mental picture or a sound-alike word.','Make that picture interact with the detail.'],example:'Rose wears round glasses. Imagine a rose growing through the frames.'},
 {name:'Shape the route',best:'Grid memory',head:'Remember one moving path, not isolated squares.',steps:['Notice straight lines, corners and zigzags as a route is shown.','Mentally draw the path as a single pencil stroke.','Trace it back with your finger after the squares disappear.'],example:'Top-left → top-right → bottom-right → bottom-left. Picture drawing the four sides of a giant square.'},
 {name:'Picture the pair',best:'Symbols & numbers',head:'Make two unrelated things interact.',steps:['Turn the symbol or number into a memorable picture.','Combine both things in one odd or vivid scene.','Use the first picture as a cue to retrieve the second.'],example:'A star goes with 42: picture a star wearing a football shirt numbered 42.'}
];
function empty(){return {version:5,history:[],active:null};}
let state=empty();
let storageWorks=true;
try{
 const raw=localStorage.getItem(STORAGE_KEY);
 if(raw){const parsed=JSON.parse(raw);if(parsed.version===5&&Array.isArray(parsed.history)){state={version:5,history:parsed.history.slice(0,2),active:parsed.active||null};}}
}catch(e){storageWorks=false;console.warn('Local save unavailable',e);}
let screen=state.active?'run':'home';
let selectedRunId=state.history[0]?.id||'';
let showEveryAnswer=false;
let alertTimer=null;
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){storageWorks=false;}}
function toast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(alertTimer);alertTimer=setTimeout(()=>el.classList.remove('visible'),4000);}
function scrollTop(){window.scrollTo({top:0,behavior:'instant'});}
function byId(id){return EVENTS.find(e=>e.id===id);}
function fileStem(run){const n=(run.name||'student').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/(^-|-$)/g,'').slice(0,30).toLowerCase();return `memory-olympiad-${n||'student'}-${run.id.slice(-6)}`;}
function formatted(iso){return iso?new Date(iso).toLocaleString():'—';}
function overall(run){if(!run||!run.results?.length)return 0;return Math.round(run.results.reduce((sum,r)=>sum+100*(r.score/r.max),0)/run.results.length);}
function matches(a,b){return !!(a&&b&&a.results.length===b.results.length&&a.results.every((r,i)=>r.id===b.results[i].id));}
function isTimed(){return !!(state.active?.current&&['study','recall'].includes(state.active.current.stage));}
function progress(){const a=state.active;if(!a)return '';const completed=a.results.length,total=a.eventIds.length;return `<div class="stage-info"><span>${a.eventIds.length===6?'Six-test battery':'Single challenge'} · ${Math.min(completed+1,total)} of ${total}</span><span>${completed} finished</span></div><div class="progress-track" role="progressbar" aria-label="Challenges completed" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${completed}"><div class="progress-fill" style="width:${100*completed/total}%"></div></div>`;}
function pageHome(){
 const busy=!!state.active;const defaults=state.history[0]||{name:'',strategy:''};
 document.body.classList.remove('in-test');
 const previous=state.history.map((run,i)=>`<button type="button" class="history-row" data-action="view-run" data-run="${s(run.id)}"><span><b>${s(run.mode==='battery'?'Six-test battery':byId(run.mode)?.title||'One game')}</b><small>${s(formatted(run.finishedAt))}${run.name?' · '+s(run.name):''}</small></span><strong>${overall(run)}%</strong><span class="history-arrow">View →</span></button>`).join('');
 MAIN.innerHTML=`<div class="hero" style="margin-bottom:20px"><div><p class="eyebrow">Memory Olympiad · free practice</p><h1>How much can you remember?</h1><p class="lead">Six quick challenges. <strong>Fresh questions every time.</strong> See exactly what you got right and wrong when you finish.</p><div class="badges"><span class="pill">No account needed</span><span class="pill">Unlimited attempts</span><span class="pill">Your last 2 runs are saved</span></div></div><div class="hero-card"><span class="hero-symbol">✦</span><div class="number">6</div><p>Ways to challenge your memory.</p><span class="tiny">Try a trick. Try again. See what changes.</span></div></div>
 ${busy?`<section class="card good"><h2>You have a test in progress</h2><p>Pick up where you left off. Your timer continues if the test is running.</p><div class="buttons"><button class="btn primary" data-action="resume">Continue my test →</button><button class="btn" data-action="stop-run">Discard it</button></div></section>`:''}
 <section class="card start-card"><div class="panel-heading"><div><p class="eyebrow">Start here</p><h2>Take the six-test battery</h2><p class="muted">You can leave these boxes blank if you're just practising.</p></div><div class="card-badge">01 — 06</div></div>
 <div class="start-inputs"><label class="field"><span>Your name (optional)</span><input type="text" id="display-name" class="input" placeholder="e.g. Alex" maxlength="65" autocomplete="nickname" value="${s(defaults.name)}"></label><label class="field"><span>Memory trick (optional)</span><select id="strategy" class="input"><option value="" ${defaults.strategy?'':'selected'}>I'm just testing</option>${TRICKS.map(t=>`<option value="${s(t.name)}" ${defaults.strategy===t.name?'selected':''}>${s(t.name)}</option>`).join('')}<option value="My own technique" ${defaults.strategy==='My own technique'?'selected':''}>My own technique</option></select></label></div>
 <div class="buttons"><button type="button" class="btn primary big-button" data-action="new-battery">Start all 6 challenges →</button><button type="button" class="btn" data-action="tips">Explore memory tricks</button></div><p class="tiny" style="margin-top:15px">About 15 minutes, depending on how fast you answer. Nothing is sent automatically.</p></section>
 <section class="card"><p class="eyebrow">Want a shorter workout?</p><h2>Practise just one</h2><div class="game-grid">${EVENTS.map(e=>`<button type="button" class="game-tile game-pick" data-action="single" data-event="${e.id}"><div class="game-glyph">${s(e.icon)}</div><b>${s(e.title)}</b><small>${s(e.subtitle)}</small><span class="mini-cta">Play ↗</span></button>`).join('')}</div></section>
 <div class="two-panel"><section class="card"><p class="eyebrow">Saved on this device</p><h2>Your last two runs</h2>${previous||'<p class="muted">Your results will appear here when you finish a run.</p>'}<p class="tiny">Only the latest two completed runs are kept. Starting a third and finishing it replaces the oldest.</p><button class="link" type="button" data-action="clear-history" ${state.history.length?'':'disabled'}>Clear saved runs</button></section><section class="card soft"><p class="eyebrow">Try a different approach</p><h2>Memory tricks</h2><p>Memory palaces, chunking, storytelling, face hooks, route shapes and picture pairs. All optional, all easy to try.</p><button type="button" class="btn" data-action="tips">See the six tricks →</button><p class="tiny" style="margin-top:14px">Your scores stay in this browser, unless you choose to download and share them.</p></section></div>`;
}
function pageTips(){document.body.classList.remove('in-test');MAIN.innerHTML=`<div class="welcome-heading"><p class="eyebrow">A few things to try</p><h1>The Memory Tricks Lab</h1><p class="lead">You don't need to become an expert. Pick one trick, try the example, then test yourself with new random questions.</p><div class="buttons"><button class="btn primary" data-action="home">← Back to the games</button></div></div><section class="trick-grid">${TRICKS.map((t,i)=>`<article class="trick-card"><span class="trick-number">TRICK ${String(i+1).padStart(2,'0')}</span><h2 style="font-size:24px">${s(t.name)}</h2><p class="trick-best">Good for: ${s(t.best)}</p><p>${s(t.head)}</p><details class="detail"><summary>Show me how</summary><ol class="trick-steps">${t.steps.map(x=>`<li>${s(x)}</li>`).join('')}</ol><div class="try-example"><b>Try it:</b> ${s(t.example)}</div></details></article>`).join('')}</section><section class="card soft"><p class="eyebrow">Extra ideas (optional)</p><h2>Research and practice</h2><p>Explore how memory champions practise, or learn why retrieval practice can help learning. The links aren't required to use this website.</p><div class="resource-list"><a href="https://artofmemory.com/start/" rel="noopener noreferrer" target="_blank"><b>Art of Memory →</b><span>Memory palace examples and beginner techniques.</span></a><a href="https://www.learningscientists.org/" rel="noopener noreferrer" target="_blank"><b>The Learning Scientists →</b><span>Research-based strategies for studying and remembering.</span></a></div><div class="buttons" style="margin-top:18px"><button class="btn primary" data-action="home">Test a new strategy →</button></div></section>`;}
function newRun(mode){
 if(state.active&&!confirm('You have an unfinished run. Discard that run and start fresh?'))return;
 const name=document.getElementById('display-name')?.value.trim().replace(/\s+/g,' ')||'';
 const strategy=document.getElementById('strategy')?.value||'';
 const seed=EV.rand32();
 const runId=`${Date.now().toString(36)}-${seed.toString(36).padStart(7,'0')}`;
 const eventIds=mode==='battery'?EVENTS.map(e=>e.id):[mode];
 state.active={id:runId,seed,name,strategy,mode,startedAt:new Date().toISOString(),eventIds,index:0,results:[],current:null};
 prepareCurrent();screen='run';save();render();scrollTop();
}
function prepareCurrent(){
 const a=state.active;if(!a)return;
 const eventId=a.eventIds[a.index];
 a.current={eventId,seed:EV.mix(a.seed,a.index+1),stage:'ready',data:EV.makeData(eventId,EV.mix(a.seed,a.index+1)),answers:{},deadline:0,stageStart:0};
}
function runReady(){const a=state.active,c=a?.current;if(!a||!c)return pageHome();const e=byId(c.eventId);document.body.classList.remove('in-test');MAIN.innerHTML=`${progress()}<div class="stage-hero"><p class="eyebrow">Get ready</p><h1><span class="event-glyph">${s(e.icon)}</span> ${s(e.title)}</h1><p class="lead">${s(e.subtitle)}</p></div><section class="card intro-card"><div class="event-how"><div><span class="how-number">1</span><b>Look and memorise</b><span>${e.study} seconds</span></div><div><span class="how-number">2</span><b>Recall from memory</b><span>${e.recall} seconds (maximum)</span></div><div><span class="how-number">3</span><b>Check your results</b><span>After you finish the run</span></div></div><div class="callout">${s(rule(e.id))}</div><div class="buttons"><button class="btn primary big-button" data-action="begin">I'm ready — show me →</button><button class="btn" data-action="stop-run">Quit this run</button></div></section>`;}
function rule(id){return {
 E01:'Memorise the order of the words. Each word must go in exactly the right numbered position.',
 E02:'Remember as many digits from the start as you can. The score stops at the first wrong digit.',
 E03:'Remember which first name belongs to each face. You will choose from a list of names.',
 E04:'Watch 15 squares flash one by one. Afterwards, tap the squares in the same order.',
 E05:'Look at 12 cards from left to right. Then select them in the same order.',
 E06:'Look at ten symbols and their numbers. Afterwards, type the number for each symbol.'
 }[id]||'';}
function begin(){const c=state.active?.current;if(!c||c.stage!=='ready')return;c.stage='study';c.answers={};c.stageStart=Date.now();c.deadline=c.stageStart+byId(c.eventId).study*1000;save();render();}
function runTimed(){const a=state.active,c=a?.current;if(!a||!c)return pageHome();const e=byId(c.eventId),study=c.stage==='study';document.body.classList.add('in-test');const duration=study?e.study:e.recall;
 MAIN.innerHTML=`${progress()}<section class="card active-test"><div class="panel-heading stage-panel"><div><p class="eyebrow">${study?'MEMORISE':'YOUR TURN'}</p><h2>${s(e.title)}</h2><p class="muted">${study?'Look closely — the answers will disappear.':'Rebuild what you remember. Submit early or use the full time.'}</p></div><div class="counter"><span id="timer" class="timer" role="timer" aria-label="Seconds remaining">${Math.max(0,Math.ceil((c.deadline-Date.now())/1000))}</span><small>sec</small></div></div><div class="progress-track"><div class="progress-fill" id="timebar" style="width:${Math.max(0,(c.deadline-Date.now())/(duration*1000)*100)}%"></div></div><div class="study-board"><div>${study?EV.studyMarkup(c.eventId,c.data):EV.recallMarkup(c.eventId,c.data,c.answers)}</div></div><div class="buttons" style="margin-top:25px;justify-content:center">${study?'<span class="pill">The recall screen will open automatically.</span>':`<button class="btn primary big-button" data-action="submit-event">Submit my answers →</button>`}</div><div class="test-exit"><button type="button" class="link" data-action="stop-run">Exit this run</button></div></section>`;
 tickVisual();
}
function stopRun(){if(!state.active)return;if(!confirm('Leave this run? Its unfinished answers will be discarded. Your previous two completed runs will stay saved.'))return;state.active=null;screen='home';save();render();scrollTop();}
function tickVisual(){const c=state.active?.current;if(!c||!['study','recall'].includes(c.stage))return;
 const duration=(c.stage==='study'?byId(c.eventId).study:byId(c.eventId).recall)*1000;
 const remain=Math.max(0,c.deadline-Date.now());const el=document.getElementById('timer'),bar=document.getElementById('timebar');if(el)el.textContent=String(Math.ceil(remain/1000));if(bar)bar.style.width=`${Math.min(100,Math.max(0,remain/duration*100))}%`;
 if(c.eventId==='E04'&&c.stage==='study'){
   const elapsed=Math.max(0,Date.now()-c.stageStart);const flash=Math.floor(elapsed/1100);const board=document.getElementById('spatial-study');if(board){for(const el of board.querySelectorAll('[data-spot]'))el.classList.toggle('live',flash<15&&Number(el.dataset.spot)===c.data.items[flash]);}
   const txt=document.getElementById('spatial-status');if(txt)txt.textContent=flash<15?`Square ${flash+1} of 15`:'Sequence finished. Get ready to recall.';
 }
}
function resumeClocks(){const c=state.active?.current;if(!c||!['study','recall'].includes(c.stage))return;
 if(!Number.isFinite(c.deadline)){c.stage='ready';save();render();return;}
 // After a long interruption, restart the interrupted event with fresh random content.
 if(Date.now()-c.deadline>120000){const seed=EV.rand32();c.seed=seed;c.data=EV.makeData(c.eventId,seed);c.stage='ready';c.deadline=0;c.stageStart=0;c.answers={};save();render();toast('That timed challenge was interrupted. Here is a fresh version.');return;}
 if(Date.now()<c.deadline){tickVisual();return;}
 if(c.stage==='study'){
   const recallDeadline=c.deadline+byId(c.eventId).recall*1000;
   c.stage='recall';c.stageStart=c.deadline;c.deadline=recallDeadline;c.answers={};
   if(Date.now()>=recallDeadline){finishEvent();return;}
   save();render();return;
 }
 if(c.stage==='recall')finishEvent();
}
function finishEvent(){const a=state.active,c=a?.current;if(!a||!c||c.stage!=='recall')return;
 const e=byId(c.eventId);const score=EV.score(c.eventId,c.data,c.answers);if(!Number.isInteger(score)||score<0||score>e.max)throw Error('Invalid event score');
 a.results.push({id:c.eventId,max:e.max,score,data:c.data,answers:c.answers,finishedAt:new Date().toISOString()});
 a.index++;
 if(a.index<a.eventIds.length){a.current=null;screen='between';}
 else{
   const completed={id:a.id,name:a.name,strategy:a.strategy,mode:a.mode,startedAt:a.startedAt,finishedAt:new Date().toISOString(),results:a.results};
   state.history.unshift(completed);state.history=state.history.slice(0,2);
   state.active=null;selectedRunId=completed.id;screen='results';showEveryAnswer=false;
 }
 save();render();scrollTop();
}
function between(){const a=state.active;if(!a)return pageHome();document.body.classList.remove('in-test');MAIN.innerHTML=`${progress()}<section class="card between-card"><div class="big-check">✓</div><p class="eyebrow">Answer saved</p><h1>Challenge ${a.results.length} complete.</h1><p class="lead">You can see scores and corrections once you've finished this run.</p><div class="buttons centered"><button class="btn primary big-button" data-action="next-event">Next challenge →</button><button class="btn" data-action="stop-run">Quit this run</button></div></section>`;}
function historyRun(){return state.history.find(x=>x.id===selectedRunId)||state.history[0]||null;}
function roundBar(r){const pct=Math.round(100*r.score/r.max);return `<div class="score-row"><div class="score-name"><b>${s(byId(r.id)?.title||r.id)}</b><span>${r.score} / ${r.max}</span></div><div class="score-track"><div style="width:${pct}%" class="score-fill ${pct>=80?'good-fill':pct>=50?'medium-fill':'low-fill'}"></div></div><strong>${pct}%</strong></div>`;}
function answerRow(row){return `<div class="answer-row ${row.correct?'is-right':'is-wrong'}"><div class="answer-key">${row.face!==undefined?`<img src="${EV.faceSrc(row.face)}" class="tiny-avatar" alt="Face ${row.face+1}" width="52" height="52">`:`<span class="answer-position">${s(row.label)}</span>`}</div><div class="answer-values"><span><small>You said</small><strong>${s(row.actual)}</strong></span><span><small>Correct answer</small><strong>${s(row.expected)}</strong></span></div><span class="answer-mark" aria-label="${row.correct?'Correct':'Incorrect'}">${row.correct?'✓':'×'}</span></div>`;}
function reviewCard(r,i){const ev=byId(r.id),review=EV.review(r.id,r.data,r.answers);const shown=showEveryAnswer?review.rows:review.rows.filter(row=>!row.correct);return `<details class="review-card" ${i===0?'open':''}><summary><span class="review-title"><strong>${s(ev.title)}</strong><small>${r.score}/${r.max} · ${review.wrong===0?'Everything correct':`${review.wrong} ${r.id==='E02'?'unscored digits':'to review'}`}</small></span><span class="review-chevron">View answers ⌄</span></summary><div class="review-body"><p class="tiny">${s(review.note)}</p>${shown.length?shown.map(answerRow).join(''):`<p class="all-correct">${showEveryAnswer?'Nothing to show.':'Perfect — no corrections needed. Select “Show all answers” to see your full answer key.'}</p>`}</div></details>`;}
function pageResults(){const run=historyRun();if(!run){screen='home';return pageHome();}document.body.classList.remove('in-test');const pct=overall(run);const previous=state.history.find(r=>r.id!==run.id);const delta=matches(run,previous)?pct-overall(previous):null;
 MAIN.innerHTML=`<div class="result-header"><div><p class="eyebrow">Run complete</p><h1>Your memory results</h1><p class="lead">${run.name?`${s(run.name)} · `:''}${s(run.mode==='battery'?'All six challenges':'One challenge')} · ${s(formatted(run.finishedAt))}</p></div><div class="result-score"><strong>${pct}%</strong><span>Average across completed challenges</span></div></div>
 ${delta!==null?`<p class="comparison-note">Compared with your other saved run: <b>${delta>0?'+':''}${delta} percentage points</b>. This is practice, so results can change with familiarity, timing and strategy.</p>`:''}
 ${!run.name?`<section class="card good report-name"><p class="eyebrow">Sending this to your teacher?</p><label class="field"><span>Add your name to the downloadable report (optional)</span><input id="result-name" class="input" type="text" maxlength="65" placeholder="Your name"></label><button class="btn small primary" data-action="save-result-name">Add name to this run</button></section>`:''}
 <section class="card"><div class="panel-heading"><div><h2>At a glance</h2><p class="muted">Each game has a different maximum, so the overall percentage gives equal weight to each game.</p></div><span class="pill">${run.results.length} / ${run.results.length} done</span></div><div class="score-stack">${run.results.map(roundBar).join('')}</div><div class="buttons"><button class="btn primary" data-action="download-pdf">Download my results (PDF) ↓</button><button class="btn" data-action="download-csv">Download scores (CSV)</button><button class="btn" data-action="new-from-results">Try a fresh run →</button></div><p class="tiny" style="margin-top:16px">Send the downloaded file to your teacher if asked. The website does not send anything automatically.</p></section>
 <section class="card review-section" id="review-answers"><div class="panel-heading"><div><p class="eyebrow">Learn from your mistakes</p><h2>Your answers, checked</h2><p class="muted">See what you entered and what the answer should have been.</p></div><button class="btn small" data-action="toggle-correct">${showEveryAnswer?'Show mistakes only':'Show all answers'}</button></div>${run.results.map(reviewCard).join('')}</section>
 <div class="two-panel"><section class="card soft"><h2>Want another go?</h2><p>Every run creates new words, digits, faces, cards, grid routes and symbol pairs.</p><div class="buttons"><button class="btn primary" data-action="new-from-results">Start again →</button><button class="btn" data-action="tips">Find a memory trick</button></div></section><section class="card"><h2>More ways to save</h2><p class="tiny">If PDF downloads don't work on your device, use one of these alternatives.</p><div class="buttons"><button class="btn small" data-action="open-pdf">Open PDF</button><button class="btn small" data-action="print">Print / Save as PDF</button><button class="btn small" data-action="download-json">Detailed JSON</button><button class="btn small" data-action="save-qr">Save score QR</button><button class="btn small" data-action="copy-code">Copy scores</button></div></section></div>
 ${state.history.length>1?`<section class="card"><h2>Other saved run</h2>${state.history.filter(x=>x.id!==run.id).map(x=>`<button type="button" class="history-row" data-action="view-run" data-run="${s(x.id)}"><span><b>${s(x.mode==='battery'?'Six-test battery':byId(x.mode)?.title||'One game')}</b><small>${s(formatted(x.finishedAt))}</small></span><strong>${overall(x)}%</strong><span>View →</span></button>`).join('')}</section>`:''}`;
}
function render(){if(state.active&&screen==='run'){const stage=state.active.current?.stage||'ready';if(stage==='ready')return runReady();if(stage==='study'||stage==='recall')return runTimed();}
 if(state.active&&screen==='between')return between();if(screen==='tips')return pageTips();if(screen==='results')return pageResults();return pageHome();}
function download(name,data,mime){const blob=data instanceof Blob?data:new Blob([data],{type:mime||'application/octet-stream'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),45000);}
function csvCell(v){const t=String(v??'');return `"${(/^[=+@-]/.test(t)?"'"+t:t).replace(/"/g,'""')}"`;}
function csvFor(run){const cols=['Version','Run ID','Name','Strategy','Game mode','Completed','Overall %',...EVENTS.map(e=>`${e.short} (${e.max})`)];const vals=['6',run.id,run.name,run.strategy,run.mode,run.finishedAt,overall(run),...EVENTS.map(e=>run.results.find(r=>r.id===e.id)?.score??'')];return '\ufeff'+cols.map(csvCell).join(',')+'\r\n'+vals.map(csvCell).join(',')+'\r\n';}
function jsonFor(run){return JSON.stringify({app:'Memory Olympiad',version:6,note:'Generated on the student device; not independently verified.',...run,reviews:run.results.map(r=>({event:r.id,feedback:EV.review(r.id,r.data,r.answers)}))},null,2);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied!');}catch{const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();toast(ok?'Copied!':'Copy unavailable — download the file instead.');}}
function printReport(){showEveryAnswer=true;pageResults();[...MAIN.querySelectorAll('details.review-card')].forEach(x=>x.open=true);requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()));}
function handle(action,element){const run=historyRun();switch(action){
 case 'home':if(isTimed()){if(!confirm('Leave this timed challenge? The timer continues if you return.'))return;}screen='home';render();scrollTop();break;
 case 'tips':if(isTimed()){toast('Finish the timed challenge first.');return;}screen='tips';render();scrollTop();break;
 case 'new-battery':newRun('battery');break;
 case 'single':newRun(element.dataset.event);break;
 case 'resume':screen=state.active?.current?'run':'between';render();scrollTop();break;
 case 'stop-run':stopRun();break;
 case 'begin':begin();break;
 case 'submit-event':finishEvent();break;
 case 'next-event':prepareCurrent();screen='run';save();render();scrollTop();break;
 case 'undo-path':if(state.active?.current?.stage==='recall'){const arr=state.active.current.answers.path||[];state.active.current.answers.path=arr.slice(0,-1);save();render();}break;
 case 'undo-card':if(state.active?.current?.stage==='recall'){const arr=state.active.current.answers.cards||[];state.active.current.answers.cards=arr.slice(0,-1);save();render();}break;
 case 'view-run':selectedRunId=element.dataset.run;showEveryAnswer=false;screen='results';render();scrollTop();break;
 case 'toggle-correct':showEveryAnswer=!showEveryAnswer;pageResults();document.getElementById('review-answers')?.scrollIntoView({block:'start'});break;
 case 'new-from-results':screen='home';render();scrollTop();document.getElementById('display-name')?.focus();break;
 case 'save-result-name':if(run){const name=document.getElementById('result-name')?.value.trim().replace(/\s+/g,' ');if(!name){toast('Enter a name first, or leave it blank if you are just practising.');break;}run.name=name;save();pageResults();toast('Name added to your report.');}break;
 case 'clear-history':if(confirm('Delete your two saved completed runs from this device? This cannot be undone.')){state.history=[];selectedRunId='';save();screen='home';render();}break;
 case 'download-pdf':case 'open-pdf':if(!run)return;try{const pdf=EX.pdf(run,EVENTS,EV);if(action==='open-pdf'){const url=URL.createObjectURL(pdf);const tab=window.open(url,'_blank');if(!tab){download(fileStem(run)+'.pdf',pdf,'application/pdf');toast('Popup blocked — downloaded the PDF instead.');}else setTimeout(()=>URL.revokeObjectURL(url),60000);}else{download(fileStem(run)+'.pdf',pdf,'application/pdf');toast('PDF saved.');}}catch(error){console.error(error);toast('Could not create PDF; try CSV, JSON or Print.');}break;
 case 'download-csv':if(run){download(fileStem(run)+'.csv',csvFor(run),'text/csv;charset=utf-8');toast('CSV saved.');}break;
 case 'download-json':if(run){download(fileStem(run)+'.json',jsonFor(run),'application/json');toast('Detailed answers saved.');}break;
 case 'save-qr':if(run){try{download(fileStem(run)+'-qr.svg',EX.qrSvgCard(run,EVENTS),'image/svg+xml');toast('QR saved.');}catch(error){console.error(error);toast('Could not save the QR. Please download CSV or PDF.');}}break;
 case 'copy-code':if(run)copy(EX.verification(run,EVENTS));break;
 case 'print':printReport();break;
 }}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(button){event.preventDefault();handle(button.dataset.action,button);return;}
 const c=state.active?.current;if(!c||c.stage!=='recall')return;
 const grid=event.target.closest('#spatial-recall [data-spot]');if(grid&&c.eventId==='E04'){
  const i=Number(grid.dataset.spot),arr=c.answers.path||[];if(arr.length===15||arr.includes(i))return;c.answers.path=[...arr,i];save();render();return;
 }
 const card=event.target.closest('[data-pick-card]');if(card&&c.eventId==='E05'){
  const id=card.dataset.pickCard,arr=c.answers.cards||[];if(arr.length===12||arr.includes(id))return;c.answers.cards=[...arr,id];save();render();
 }
});
MAIN.addEventListener('input',event=>{const c=state.active?.current;if(c?.stage==='recall'&&event.target.matches('[data-answer]')){c.answers[event.target.dataset.answer]=event.target.value;save();}});
MAIN.addEventListener('change',event=>{const c=state.active?.current;if(c?.stage==='recall'&&event.target.matches('[data-answer]')){c.answers[event.target.dataset.answer]=event.target.value;save();}});
window.addEventListener('beforeunload',save);
window.setInterval(resumeClocks,250);
render();resumeClocks();
})();
