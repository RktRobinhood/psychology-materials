/* Memory Olympiad v6: six standalone randomly generated memory challenges. */
(function () {
  'use strict';
  const EVENTS = [
    {id:'E01',title:'Ordered words',short:'Words',subtitle:'Remember 16 words in the right places.',max:16,study:60,recall:115,icon:'Aa',unit:'positions'},
    {id:'E02',title:'Digit sequence',short:'Digits',subtitle:'Remember 24 digits from the beginning.',max:24,study:55,recall:95,icon:'01',unit:'digits in a row'},
    {id:'E03',title:'Faces & names',short:'Faces',subtitle:'Match 10 realistic or faces to their names.',max:10,study:80,recall:120,icon:'◉',unit:'correct names'},
    {id:'E04',title:'Grid memory',short:'Grid',subtitle:'Follow 15 flashes on a 4×4 grid.',max:15,study:22,recall:85,icon:'▦',unit:'positions'},
    {id:'E05',title:'Card order',short:'Cards',subtitle:'Put 12 playing cards back in their order.',max:12,study:65,recall:95,icon:'♠',unit:'positions'},
    {id:'E06',title:'Symbol pairs',short:'Pairs',subtitle:'Remember 10 symbol-to-number matches.',max:10,study:70,recall:105,icon:'✦',unit:'pairs'}
  ];
  // More than 200 distinct, commonplace, visually imaginable words.
  const WORDS = `anchor apricot apron arrow attic badge balloon banana barrel basket battery beach beacon beard beaver beetle bicycle blanket blossom boat book bottle bow bridge broom bucket button cactus calendar camera candle canoe carpet carrot castle cave chalk cherry chest chimney circle clock cloud clover coat coconut comet compass cookie coral crown crystal curtain cushion daisy desert diamond dolphin domino dragon drawer drum eagle elbow emerald envelope feather fence ferry finger firefly flag flame flower flute forest fork fountain fox freezer frog garden garlic gate giraffe glove goldfish grape guitar hammer hammock harbor hat helmet hill honey hook horse hotel house iceberg igloo insect island jacket jellyfish jewel jungle kettle key keyboard kite ladder lake lamp lantern leaf lemon library lighthouse lion lizard lobster locker magnet mailbox marble market mask meadow medal melon meteor microphone mitten monkey moon mountain mushroom necklace needle notebook ocean octopus onion orange orchard ostrich oyster package paddle palace panda paper parrot passport peach peanut pearl pencil penguin pepper phone piano pickle pillow pineapple pirate planet plate pocket popcorn poster potato pumpkin puzzle pyramid quartz queen rabbit rainbow rake ribbon river robot rocket rope rose saddle sailboat sandwich scarf scooter seahorse seashell shadow shark sheep shield ship shoe shovel silver skeleton sled snail snowflake sofa sparrow spoon squirrel staircase star statue strawberry suitcase sunflower sunset sword table tablet telescope tent tiger toaster tomato toothbrush torch tower tractor train treasure tree triangle trumpet turtle umbrella unicorn valley vase violin volcano wagon wallet walnut waterfall watermelon whale wheel whistle window windmill wolf zebra zipper acorn almond ant apple armour asparagus bakery bamboo bandage barn beetle bell bench berry blanket blueberry bonfire bracelet breakfast brick broccoli butterfly cabin cabbage camel candy canyon captain caravan cardboard castle cat cereal chair cheese chessboard chicken chocolate circus clam classroom cliff coffee comet cone cupboard daffodil dandelion dentist dinosaur dish dog donut doorway doughnut duck eagle egg elevator factory falcon fan farm feather fern festival fireworks fishing flag flamingo flashlight football footprint fortress fossil foxglove glacier goat goblet gondola goose grass greenhouse hammock harmonica harp helicopter hedgehog hive hockey honeycomb horn hummingbird hurricane ink iron jacket jaguar jigsaw kayak koala ladder ladybug lemon lighthouse lollipop lunchbox maple marshmallow mattress medal menu mermaid microscope mint mirror mitten moccasin monster moose motorcycle muffin museum mushroom mustard narwhal necklace newspaper nightingale noodles notebook nutmeg oatmeal observatory otter pancake parachute park pastry path pebble pelican pepper peppermint picnic pier pig pigeon pillowcase pinecone playground plum porcupine porridge postcard pretzel pumpkin purse raccoon radish raincoat raft raven refrigerator rhinoceros riverbank rollercoaster rooftop rosebud rug satellite saxophone school scissors seagull seed sequoia sheepdog shovel sidewalk skateboard skates skyscraper sloth snowball snowman spaceship spider spinach sponge spring squirrel staircase submarine sundial supermarket sweater swing swordfish tadpole tambourine teapot telephone thermometer thimble throne thunderstorm ticket toothbrush tornado tortoise toy trumpet tulip tunnel turkey turtle umbrella uniform violin volcano walnut wasp watch waterfall wheelbarrow windmill wizard woodpecker worm yacht yogurt zipper`.split(/\s+/);
  const NAMES = `Aaliyah Aaron Abel Abigail Ada Adam Aisha Alba Alex Ali Amara Amelia Amir Ana Anders Andrea Anika Anya Aria Arthur Asher Astrid Ava Axel Ayla Ben Bella Benjamin Bianca Bilal Bruno Cai Camila Cara Carlos Casper Celia Charlotte Chloe Clara Cole Daisy Daniel Dara David Dilan Eden Edith Elias Ella Elliot Emil Emilia Emma Erik Eva Farah Felix Finn Flora Frances Freya Gabriel Gemma George Gia Grace Hana Hannah Harry Hazel Hugo Ibrahim Ida Imani Ingrid Iris Isak Ivan Jack Jade Jamal James Jasmine Jasper Joel Jonas Joseph Julia Kai Kamil Karim Kira Lara Layla Leah Leo Leona Liam Lina Liv Logan Luca Lucia Luna Maja Malik Malin Marco Maria Marie Maya Mei Mia Mika Mila Milo Mina Mira Mona Nadia Nala Naomi Nia Nico Noah Nora Olivia Omar Oscar Otis Otto Pablo Parker Petra Philip Pia Priya Quinn Rafael Rania Ravi Rhea Rosa Rowan Ruby Ryan Sam Sana Sara Sasha Selma Sienna Simon Sofie Sofia Stella Sven Tara Theo Tilda Tobias Uma Vera Victor Viola William Yara Yasmin Yusuf Zara Zayn Zoe`.split(/\s+/);
  const SYMBOLS = [
   ['star','★'],['diamond','◆'],['triangle','▲'],['circle','●'],['club','♣'],['spade','♠'],['heart','♥'],['sun','☀'],['moon','☾'],['snow','❄'],
   ['flower','✿'],['spark','✦'],['plus','✚'],['cross','✖'],['square','■'],['up','↑'],['down','↓'],['left','←'],['right','→'],['wave','≈'],
   ['check','✓'],['lozenge','⬟'],['bullseye','◎'],['infinity','∞'],['music','♫'],['flag','⚑'],['peace','☮'],['cloud','☁'],['umbrella','☂'],['chess','♜'],['bolt','ϟ'],['bowtie','⋈']
  ].map(([id,glyph])=>({id,glyph}));
  const SUITS = [{id:'S',symbol:'♠',red:false},{id:'H',symbol:'♥',red:true},{id:'D',symbol:'♦',red:true},{id:'C',symbol:'♣',red:false}];
  const CARDS = SUITS.flatMap(s=>['A','2','3','4','5','6','7','8','9','10','J','Q','K'].map(rank=>({id:rank+s.id,rank,suit:s.symbol,red:s.red})));
  const CARD_LOOKUP = Object.fromEntries(CARDS.map(c=>[c.id,c]));
  const FACE_FILES = Array.isArray(window.MEMORY_REAL_FACES?.files) && window.MEMORY_REAL_FACES.files.length >= 50 ? window.MEMORY_REAL_FACES.files : null;
  const FACE_COUNT = FACE_FILES ? FACE_FILES.length : 72;
  function escape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function norm(s){return String(s??'').normalize('NFC').trim().toLocaleLowerCase('en').replace(/\s+/g,' ');}
  function rand32(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]>>>0;}catch{return Math.floor(Math.random()*4294967296)>>>0;}}
  function mix(a,b){let x=(a^Math.imul(b,0x9e3779b9))>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b);x=Math.imul(x^(x>>>13),0xc2b2ae35);return (x^(x>>>16))>>>0;}
  function rng(seed){let a=seed>>>0;return ()=>{a+=0x6d2b79f5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
  function shuffled(items,random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function faceSrc(i){return FACE_FILES ? FACE_FILES[i] : `assets/faces/face-${String(i).padStart(2,'0')}.png`;}
  function cardText(id){const c=CARD_LOOKUP[id];return c?`${c.rank}${c.suit}`:'—';}
  function coord(n){return Number.isInteger(n)&&n>=0&&n<16?'ABCD'[Math.floor(n/4)]+String(n%4+1):'—';}
  function makeData(id,seed){const index=EVENTS.findIndex(e=>e.id===id);if(index<0)throw new Error('Unknown event: '+id);const r=rng(mix(seed,index+1));
    switch(id){
      case 'E01':return {items:shuffled([...new Set(WORDS)],r).slice(0,16)};
      case 'E02':return {items:Array.from({length:24},()=>String(Math.floor(r()*10)))};
      case 'E03':{
        const names=shuffled([...new Set(NAMES)],r).slice(0,10);
        const faces=shuffled(Array.from({length:FACE_COUNT},(_,i)=>i),r).slice(0,10);
        const people=faces.map((face,i)=>({face,name:names[i]}));
        return {people,recall:shuffled(people,r),options:shuffled(names,r)};
      }
      case 'E04':return {items:shuffled(Array.from({length:16},(_,i)=>i),r).slice(0,15)};
      case 'E05':{const items=shuffled(CARDS,r).slice(0,12);return {items,options:shuffled(items,r)};}
      case 'E06':{
        const symbols=shuffled(SYMBOLS,r).slice(0,10);
        const numbers=shuffled(Array.from({length:90},(_,i)=>String(i+10)),r).slice(0,10);
        const items=symbols.map((s,i)=>({...s,number:numbers[i]}));
        return {items,recall:shuffled(items,r)};
      }
    }
  }
  function score(id,data,answers={}){let n=0;switch(id){
    case 'E01':return data.items.reduce((sum,w,i)=>sum+(norm(answers[i])===norm(w)?1:0),0);
    case 'E02':{
      const typed=String(answers.digits||'').replace(/[^0-9]/g,'');for(let i=0;i<Math.min(24,typed.length);i++){if(typed[i]!==data.items[i])break;n++;}return n;
    }
    case 'E03':return data.people.reduce((sum,p)=>sum+(norm(answers[p.face])===norm(p.name)?1:0),0);
    case 'E04':return data.items.reduce((sum,pos,i)=>sum+((answers.path||[])[i]===pos?1:0),0);
    case 'E05':return data.items.reduce((sum,card,i)=>sum+((answers.cards||[])[i]===card.id?1:0),0);
    case 'E06':return data.items.reduce((sum,p)=>sum+(String(answers[p.id]??'').replace(/\D/g,'')===p.number?1:0),0);
  }return 0;}
  function review(id,data,answers={}){
    let rows=[],note='';
    switch(id){
      case 'E01':rows=data.items.map((w,i)=>({label:String(i+1),actual:String(answers[i]||'').trim()||'—',expected:w,correct:norm(answers[i])===norm(w)}));note='A word scores only when it is in the original position.';break;
      case 'E02':{
        const typed=String(answers.digits||'').replace(/[^0-9]/g,'');const streak=score(id,data,answers);
        rows=data.items.map((digit,i)=>({label:String(i+1),actual:typed[i]??'—',expected:digit,correct:i<streak}));
        note=`You got ${streak} digits in a row from the start. Digits after the first mistake do not count, even when they match.`;break;
      }
      case 'E03':rows=data.recall.map(p=>({label:`Face ${p.face+1}`,face:p.face,actual:answers[p.face]||'—',expected:p.name,correct:norm(answers[p.face])===norm(p.name)}));note='Each face needs the correct first name.';break;
      case 'E04':rows=data.items.map((spot,i)=>({label:String(i+1),actual:coord((answers.path||[])[i]),expected:coord(spot),correct:(answers.path||[])[i]===spot}));note='Grid references use rows A–D from top to bottom, columns 1–4 left to right.';break;
      case 'E05':rows=data.items.map((card,i)=>({label:String(i+1),actual:cardText((answers.cards||[])[i]),expected:cardText(card.id),correct:(answers.cards||[])[i]===card.id}));note='One point for each card in its original position.';break;
      case 'E06':rows=data.recall.map(p=>({label:p.glyph,pdfLabel:p.id,actual:String(answers[p.id]||'').trim()||'—',expected:p.number,correct:String(answers[p.id]??'').replace(/\D/g,'')===p.number}));note='Remember the two-digit number that belongs to each symbol.';break;
    }
    return {rows,note,wrong:rows.filter(r=>!r.correct).length};
  }
  function cardMarkup(c,extra=''){return `<span class="playing-card ${c.red?'red':''} ${extra}"><b>${escape(c.rank)}</b><small>${escape(c.suit)}</small></span>`;}
  function studyMarkup(id,data){switch(id){
    case 'E01':return `<div class="word-grid">${data.items.map((word,i)=>`<div class="word-item"><span>${String(i+1).padStart(2,'0')}</span>${escape(word)}</div>`).join('')}</div>`;
    case 'E02':return `<div class="digits-target">${data.items.join('').match(/.{1,4}/g).map(s=>`<span>${s}</span>`).join(' ')}</div>`;
    case 'E03':return `<div class="avatar-grid">${data.people.map(p=>`<div class="avatar-item"><img src="${faceSrc(p.face)}" alt="Portrait of ${escape(p.name)}" width="128" height="128"><b>${escape(p.name)}</b></div>`).join('')}</div>`;
    case 'E04':return `<p class="hint" style="text-align:center">Watch the 15 squares flash in order. No tapping yet.</p><div class="spatial-grid" id="spatial-study">${Array.from({length:16},(_,i)=>`<div class="spatial-cell" data-spot="${i}"></div>`).join('')}</div><p class="hint" style="text-align:center" id="spatial-status" aria-live="off"></p>`;
    case 'E05':return `<div class="card-row">${data.items.map(c=>cardMarkup(c)).join('')}</div>`;
    case 'E06':return `<div class="symbol-grid">${data.items.map(p=>`<div class="symbol-item"><b>${escape(p.glyph)}</b><span>${escape(p.number)}</span></div>`).join('')}</div>`;
  }return '';}
  function recallMarkup(id,data,answers={}){switch(id){
    case 'E01':return `<p class="hint">Type the words in their original numbered places.</p><div class="word-inputs">${data.items.map((_,i)=>`<label class="recall-field"><span class="slot-no">${i+1}</span><input data-answer="${i}" class="form-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="35" placeholder="Word ${i+1}" value="${escape(answers[i]||'')}"></label>`).join('')}</div>`;
    case 'E02':return `<p class="hint">Type the whole sequence. Only correct digits <b>from the beginning</b> score. Spaces are fine.</p><label class="field"><span>Your digits</span><input data-answer="digits" id="digits-answer" class="form-input digits-input" inputmode="numeric" type="text" autocomplete="off" maxlength="48" spellcheck="false" placeholder="Type the digits you remember" value="${escape(answers.digits||'')}"></label>`;
    case 'E03':return `<p class="hint">Choose the first name that belongs to each face. The faces have moved around.</p><div class="avatar-grid">${data.recall.map(p=>`<label class="avatar-item"><img src="${faceSrc(p.face)}" alt="Face to identify" width="128" height="128"><span class="sr-only">Name for face ${p.face+1}</span><select data-answer="${p.face}" aria-label="Name for face ${p.face+1}"><option value="">Choose name…</option>${data.options.map(n=>`<option value="${escape(n)}" ${answers[p.face]===n?'selected':''}>${escape(n)}</option>`).join('')}</select></label>`).join('')}</div>`;
    case 'E04':{
      const path=answers.path||[];
      return `<p class="hint">Tap the same squares in the same order. Use Undo if you make a mistake.</p><div class="spatial-grid" id="spatial-recall">${Array.from({length:16},(_,i)=>`<button type="button" class="spatial-cell ${path.includes(i)?'selected':''}" data-spot="${i}" ${path.includes(i)?'disabled':''} aria-label="Grid square ${coord(i)}">${path.includes(i)?path.indexOf(i)+1:''}</button>`).join('')}</div><div class="buttons centered"><span class="pill">${path.length} / 15 selected</span><button class="btn small" type="button" data-action="undo-path" ${path.length?'':'disabled'}>Undo last</button></div>`;
    }
    case 'E05':{
      const path=answers.cards||[];
      return `<p class="hint">Tap each card in the original left-to-right order. You can undo a choice.</p><div class="card-row card-selected">${Array.from({length:12},(_,i)=>{const c=data.items.find(x=>x.id===path[i]);return c?cardMarkup(c):`<span class="playing-card placeholder">${i+1}</span>`;}).join('')}</div><div class="buttons centered" style="margin:12px 0"><span class="pill">${path.length} / 12 selected</span><button class="btn small" type="button" data-action="undo-card" ${path.length?'':'disabled'}>Undo last</button></div><div class="card-pool"><b>Tap from these cards:</b><div class="card-row" style="margin-top:12px">${data.options.map(c=>`<button type="button" class="playing-card ${c.red?'red':''}" data-pick-card="${escape(c.id)}" ${path.includes(c.id)?'disabled':''} aria-label="Choose ${escape(c.rank+c.suit)}"><b>${escape(c.rank)}</b><small>${escape(c.suit)}</small></button>`).join('')}</div></div>`;
    }
    case 'E06':return `<p class="hint">Type the number that went with each symbol.</p><div class="symbol-grid">${data.recall.map(p=>`<label class="symbol-item"><b>${escape(p.glyph)}</b><span class="sr-only">Number for ${escape(p.id)}</span><input data-answer="${escape(p.id)}" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" aria-label="Number for symbol ${escape(p.id)}" placeholder="?" value="${escape(answers[p.id]||'')}"></label>`).join('')}</div>`;
  }return '';}
  const duplicateWords=WORDS.length-new Set(WORDS).size;
  if(new Set(WORDS).size<200)throw Error('Word bank too small');
  window.MemoryEvents=Object.freeze({events:EVENTS,faceCount:FACE_COUNT,faceMode:FACE_FILES?'realistic':'illustrated fallback',makeData,score,review,studyMarkup,recallMarkup,escape,norm,rand32,mix,coord,faceSrc,cardText,wordsCount:new Set(WORDS).size,namesCount:new Set(NAMES).size,duplicateWords});
})();
