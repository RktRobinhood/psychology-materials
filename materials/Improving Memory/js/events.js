/* No modules and no remote assets: this file works on GitHub Pages AND file:// */
(function(){'use strict';
const EVENT_DEFS=[
 {id:'E01',title:'Ordered words',subtitle:'Remember sixteen words in exactly the right positions.',max:16,study:60,recall:115,icon:'Aa',unit:'positions'},
 {id:'E02',title:'Digit sequence',subtitle:'Recall a twenty-four digit sequence from the beginning.',max:24,study:55,recall:95,icon:'01',unit:'digits in a row'},
 {id:'E03',title:'Names & avatars',subtitle:'Pair ten unfamiliar illustrated faces with their first names.',max:10,study:80,recall:120,icon:'◉',unit:'names'},
 {id:'E04',title:'Visual / spatial order',subtitle:'Watch fifteen squares flash, then reconstruct the path.',max:15,study:40,recall:85,icon:'▦',unit:'positions'},
 {id:'E05',title:'Card order',subtitle:'Remember twelve playing cards and recreate their precise order.',max:12,study:65,recall:95,icon:'♠',unit:'positions'},
 {id:'E06',title:'Association pairs',subtitle:'Learn ten symbol-to-number connections.',max:10,study:70,recall:105,icon:'✦',unit:'pairs'}
];
const PRESETS=[
 {id:'foundation',name:'Foundation',factor:1.45,tag:'Extra study time · practice only'},
 {id:'official',name:'Official',factor:1,tag:'Fixed timing · for baseline and final'},
 {id:'sprint',name:'Sprint',factor:.72,tag:'Shorter timings · practice only'},
 {id:'elite',name:'Elite',factor:.50,tag:'Very short timings · practice only'}
];
const WORD_A=['lantern','river','copper','whistle','velvet','forest','bottle','mirror','anchor','garden','window','marble','candle','pocket','island','rabbit'];
const WORD_B=['hammock','silver','ticket','shadow','bridge','pencil','carpet','fountain','ladder','castle','glove','feather','bucket','sunset','orange','button'];
const NAME_A=['Maya','Noah','Leila','Oscar','Freya','Amir','Elena','Hugo','Ines','Jonas'];
const NAME_B=['Sofia','Adam','Nadia','Luca','Amara','Elias','Clara','Milan','Zara','Felix'];
const SYMBOLS=['★','◆','▲','●','♣','♠','♥','✦','☾','☀'];
const SYMBOL_NUMBERS_A=['12','28','34','46','51','63','72','85','91','07'];
const SYMBOL_NUMBERS_B=['14','26','39','43','58','61','75','82','96','03'];
const SUITS=[{symbol:'♠',id:'S',red:false},{symbol:'♥',id:'H',red:true},{symbol:'♦',id:'D',red:true},{symbol:'♣',id:'C',red:false}];
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function shuffle(input,rand){const a=input.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function esc(v){return String(v===null||v===undefined?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function scoreText(value){return String(value||'').normalize('NFC').trim().toLocaleLowerCase('en').replace(/\s+/g,' ')}
function duration(eventId,presetId){const e=EVENT_DEFS.find(x=>x.id===eventId),p=PRESETS.find(x=>x.id===presetId)||PRESETS[1];return {study:Math.round(e.study*p.factor),recall:Math.round(e.recall*p.factor)}}
function formFor(id,phase){const number=Number((id||'P001').replace(/\D/g,''))||1;return ((number%2===0)===(phase==='baseline'))?'A':'B'}
function makeData(eventId,form,participant){
 const rand=rng(hash(`${eventId}|${form}|${participant}`));
 if(eventId==='E01')return {items:shuffle(form==='A'?WORD_A:WORD_B,rand)};
 if(eventId==='E02')return {items:Array.from({length:24},()=>String(Math.floor(rand()*10)))};
 if(eventId==='E03'){
  const names=shuffle(form==='A'?NAME_A:NAME_B,rand);
  const people=names.map((name,i)=>({id:'face'+i,name,faceSeed:hash(participant+'|'+form+'|face|'+i)}));
  return {people,recall:shuffle(people,rand)};
 }
 if(eventId==='E04')return {items:shuffle(Array.from({length:16},(_,i)=>i),rand).slice(0,15)};
 if(eventId==='E05'){
  const cards=[];for(const suit of SUITS){for(const rank of ['A','2','3','4','5','6','7','8','9','10','J','Q','K'])cards.push({id:rank+suit.id,rank,suit:suit.symbol,red:suit.red})}
  const items=shuffle(cards,rand).slice(0,12);return {items,pool:shuffle(items,rng(hash('recall|'+participant+'|'+form)))};
 }
 if(eventId==='E06'){
  const nums=form==='A'?SYMBOL_NUMBERS_A:SYMBOL_NUMBERS_B;
  const entries=shuffle(SYMBOLS.map((symbol,i)=>({symbol,number:nums[i]})),rand);return {items:entries,recall:shuffle(entries,rng(hash('recall|'+participant+'|'+form)))};
 }
 throw new Error('Unknown event '+eventId);
}
function makeAvatar(seed){
 const r=rng(seed);const skins=['#e7bd92','#f2d4b9','#bf8d60','#9b6745','#d99f79','#704d3f'];const hair=['#35272c','#583b31','#ae7c44','#272b40','#5a4540'];const shirts=['#6ad2ca','#bb9fe8','#d7868b','#e4c068','#6e9bd7'];const face=skins[Math.floor(r()*skins.length)];const hairColor=hair[Math.floor(r()*hair.length)];const shirt=shirts[Math.floor(r()*shirts.length)];const shape=Math.floor(r()*3);const eyes=28+Math.floor(r()*6);const mouth=61+Math.floor(r()*4);
 return `<svg viewBox="0 0 100 100" role="img" aria-label="Illustrated person"><rect width="100" height="100" rx="19" fill="#213e58"/><circle cx="50" cy="45" r="36" fill="#2f526d"/><path d="M12 98Q13 71 40 72L59 72Q88 75 88 98Z" fill="${shirt}"/><ellipse cx="50" cy="45" rx="24" ry="29" fill="${face}"/><path d="M${shape===0?'25 40Q23 14 49 15Q81 14 75 41L65 31L32 33Z':shape===1?'27 32Q27 13 52 17Q78 18 73 43Q65 18 39 28Z':'27 34Q31 12 55 17Q75 19 74 40L64 26Q45 39 28 35Z'}" fill="${hairColor}"/><circle cx="41" cy="${eyes+15}" r="2.6" fill="#172733"/><circle cx="59" cy="${eyes+15}" r="2.6" fill="#172733"/><path d="M42 ${mouth}Q50 ${mouth+5} 58 ${mouth}" fill="none" stroke="#8f5c53" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}
function cardMarkup(c,extra=''){return `<span class="playing-card ${c.red?'red':''} ${extra}" data-card="${esc(c.id)}"><b>${esc(c.rank)}</b><small>${esc(c.suit)}</small></span>`}
function studyMarkup(eventId,data){
 if(eventId==='E01')return `<div class="word-grid">${data.items.map((word,i)=>`<div class="word-item"><span>${String(i+1).padStart(2,'0')}</span>${esc(word)}</div>`).join('')}</div>`;
 if(eventId==='E02')return `<div class="digits-target">${data.items.join('').match(/.{1,4}/g).map(x=>`<span>${x}</span>`).join(' &nbsp; ')}</div>`;
 if(eventId==='E03')return `<div class="avatar-grid">${data.people.map(p=>`<div class="avatar-item">${makeAvatar(p.faceSeed)}<b>${esc(p.name)}</b></div>`).join('')}</div>`;
 if(eventId==='E04')return `<p class="hint" style="text-align:center">Watch each square flash in order. All fifteen appear once, then disappear. Do not write anything yet.</p><div class="spatial-grid" id="spatial-study">${Array.from({length:16},(_,i)=>`<div class="spatial-cell" data-spot="${i}"></div>`).join('')}</div><p id="spatial-status" class="hint" style="text-align:center" aria-live="off"></p>`;
 if(eventId==='E05')return `<div class="card-row">${data.items.map(cardMarkup).join('')}</div>`;
 if(eventId==='E06')return `<div class="symbol-grid">${data.items.map(p=>`<div class="symbol-item"><b>${esc(p.symbol)}</b><span>${p.number}</span></div>`).join('')}</div>`;
 return '';
}
function recallMarkup(eventId,data,answers={}){
 if(eventId==='E01')return `<p class="hint">Write each word in its original numbered position. Spelling matters; capital letters do not.</p><div class="word-inputs">${data.items.map((_,i)=>`<div class="recall-field"><label for="answer-${i}">${i+1}</label><input id="answer-${i}" data-answer="${i}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(answers[i]||'')}" placeholder="Word ${i+1}" maxlength="30"></div>`).join('')}</div>`;
 if(eventId==='E02')return `<p class="hint">Type the digits in the original order. Spaces are ignored. Your score is the number of correct digits <strong>from the start</strong>; the first incorrect digit ends the streak.</p><label class="field" for="digit-answer"><span style="display:block;font-weight:800;margin-bottom:8px">Your 24 digits</span><input id="digit-answer" class="form-input digits-input" data-answer="digits" inputmode="numeric" type="text" autocomplete="off" maxlength="40" spellcheck="false" value="${esc(answers.digits||'')}" placeholder="Type the sequence…" aria-label="Type the remembered 24 digits"></label>`;
 if(eventId==='E03')return `<p class="hint">Name each person. The faces are shown in a new order.</p><div class="avatar-grid">${data.recall.map(p=>`<div class="avatar-item">${makeAvatar(p.faceSeed)}<label class="recall-field" style="width:100%"><span class="hint">First name</span><input data-answer="${esc(p.id)}" class="form-input" type="text" autocapitalize="words" autocomplete="off" spellcheck="false" value="${esc(answers[p.id]||'')}" maxlength="35" placeholder="Name"></label></div>`).join('')}</div>`;
 if(eventId==='E04')return `<p class="hint">Tap the squares in the same order as the flashes. You must select up to 15 different squares. If you make a mistake, use Undo.</p><div class="spatial-grid" id="spatial-recall">${Array.from({length:16},(_,i)=>`<button type="button" data-spot="${i}" class="spatial-cell ${(answers.path||[]).includes(i)?'selected':''}" ${((answers.path||[]).includes(i))?'disabled':''} aria-label="Grid square ${i+1}">${(answers.path||[]).includes(i)?(answers.path||[]).indexOf(i)+1:''}</button>`).join('')}</div><div class="button-row" style="justify-content:center;margin-top:15px"><span class="pill" id="spatial-count">${(answers.path||[]).length}/15 entered</span><button type="button" class="btn btn-sm" data-action="undo-path">Undo last</button></div>`;
 if(eventId==='E05'){
  const picked=answers.cards||[];
  return `<p class="hint">Select the cards in their original left-to-right order. You can Undo if needed.</p><div class="card-row" id="card-selected">${Array.from({length:12},(_,i)=>{const c=data.items.find(x=>x.id===picked[i]);return c?cardMarkup(c,'recalled'):`<span class="playing-card placeholder">${i+1}</span>`}).join('')}</div><div class="card-pool"><h3>Tap to place the next card</h3><div class="card-row" id="card-pool">${data.pool.map(c=>`<button type="button" class="playing-card ${c.red?'red':''}" data-pick-card="${esc(c.id)}" ${(picked.includes(c.id))?'disabled':''} aria-label="Choose ${esc(c.rank+c.suit)}"><b>${esc(c.rank)}</b><small>${esc(c.suit)}</small></button>`).join('')}</div><div class="button-row" style="margin-top:12px"><span class="pill" id="card-count">${picked.length}/12 entered</span><button type="button" class="btn btn-sm" data-action="undo-card">Undo last</button></div></div>`;
 }
 if(eventId==='E06')return `<p class="hint">Enter the two-digit number that was paired with each symbol. Write a leading zero where needed, e.g. 07.</p><div class="symbol-grid">${data.recall.map(p=>`<label class="symbol-item"><b aria-hidden="true">${esc(p.symbol)}</b><span class="hint">Number for ${esc(p.symbol)}</span><input class="form-input" inputmode="numeric" type="text" autocomplete="off" maxlength="2" data-answer="${esc(p.symbol)}" value="${esc(answers[p.symbol]||'')}" placeholder="00" aria-label="Two digit number for ${esc(p.symbol)}"></label>`).join('')}</div>`;
 return '';
}
function score(eventId,data,answers={}){
 if(eventId==='E01')return data.items.reduce((sum,w,i)=>sum+(scoreText(answers[i])===w?1:0),0);
 if(eventId==='E02'){
  const typed=String(answers.digits||'').replace(/\s+/g,'').replace(/[^0-9]/g,'');let n=0;
  for(let i=0;i<Math.min(24,typed.length);i++){if(typed[i]!==data.items[i])break;n++}return n;
 }
 if(eventId==='E03')return data.people.reduce((sum,p)=>sum+(scoreText(answers[p.id])===scoreText(p.name)?1:0),0);
 if(eventId==='E04')return data.items.reduce((sum,pos,i)=>sum+(Number((answers.path||[])[i])===pos?1:0),0);
 if(eventId==='E05')return data.items.reduce((sum,c,i)=>sum+((answers.cards||[])[i]===c.id?1:0),0);
 if(eventId==='E06')return data.items.reduce((sum,p)=>sum+(String(answers[p.symbol]||'').replace(/\D/g,'').padStart(2,'0')===p.number?1:0),0);
 return 0;
}
window.MemoryEvents=Object.freeze({events:EVENT_DEFS,presets:PRESETS,makeData,studyMarkup,recallMarkup,score,duration,formFor,escape:esc});
})();
