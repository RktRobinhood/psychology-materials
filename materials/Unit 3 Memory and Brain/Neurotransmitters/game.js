/* NEURAL LAB: CLASSROOM RESET
   Canvas simulation runs locally. Video and Mouse Party are external resources on GitHub Pages.
   Experimental numbers are SYNTHETIC and illustrate a simplified three-condition classroom pattern; not real animal data.
*/
(()=>{'use strict';
const $=id=>document.getElementById(id);const $$=s=>Array.from(document.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const S={page:'intro',mazeAudioOn:true,syn:{index:0,started:false,playing:false,narration:true,clock:0},maze:{habituated:false,running:false,selected:'saline',completed:{},route:null,animationTime:0,animationDuration:5000,kind:''}};
const narration=$('narration');let lastTime=performance.now();
function page(name){if(!$(name))return;S.page=name;$$('.page').forEach(x=>x.classList.toggle('active',x.id===name));$$('.navbtn').forEach(x=>{x.classList.toggle('active',x.dataset.page===name);if(x.dataset.page===name)x.setAttribute('aria-current','step');else x.removeAttribute('aria-current')});if(name!=='synapse')pauseSyn();window.scrollTo({top:0,behavior:'auto'});if(name==='maze'){mazeDraw(performance.now());if(Object.keys(S.maze.completed).length)drawGraph()}}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.go)));
$('teacherOpen').addEventListener('click',()=>$('teacherDialog').showModal());

/* --- THE SYNAPSE EXPLAINER --- */
const chapters=[
 {term:'SYNAPSE',title:'Two neurons. One tiny gap.',caption:'The signal travels inside one neuron. Across the tiny synaptic cleft, the message must become chemical.'},
 {term:'VESICLE · NEUROTRANSMITTER',title:'Tiny sacs hold the messengers.',caption:'A vesicle is a tiny package. It stores neurotransmitter molecules such as acetylcholine (ACh), a chemical messenger.'},
 {term:'RELEASE',title:'The arriving impulse triggers release.',caption:'An electrical impulse arrives at the sending end of the neuron. Vesicles fuse with its outer membrane and release their contents.'},
 {term:'RECEPTOR',title:'The next cell receives the message.',caption:'Transmitter molecules cross the gap and bind to matching receptors. This changes the next cell’s activity—depending on the receptor, the next signal can be more or less likely.'},
 {term:'EXCITATION AND INHIBITION',title:'Signals can push—or hold back.',caption:'Some messages make the receiving neuron more likely to fire (excitatory). Others make it less likely (inhibitory). Binding to a receptor does not always trigger another impulse.'}
];
let sceneTimer=null;let currentAudioSource=null;
function stopTimer(){if(sceneTimer){clearTimeout(sceneTimer);sceneTimer=null;}}
function pauseSyn(){S.syn.playing=false;stopTimer();narration.pause();$('synPlay').textContent='▶ Play';}
function setChapter(i,play){S.syn.index=clamp(i,0,4);S.syn.clock=0;const c=chapters[S.syn.index];$('synTerm').textContent=c.term;$('synSceneTitle').textContent=c.title;$('synCaption').textContent=c.caption;$('synCount').textContent=`${String(i+1).padStart(2,'0')} / 05`;$('synProgress').style.width=`${(i+1)*20}%`;narration.pause();narration.currentTime=0;narration.removeAttribute('src');narration.load();stopTimer();currentAudioSource=null;
 if(play){playChapter();}
}
function advanceSyn(){if(!S.syn.playing)return;if(S.syn.index===4){pauseSyn();$('synPlay').textContent='↻ Replay';return}setChapter(S.syn.index+1,true)}
function playChapter(){S.syn.playing=true;$('synPlay').textContent='Ⅱ Pause';const src=S.syn.index===4?null:`assets/audio/synapse-${String(S.syn.index+1).padStart(2,'0')}.mp3`;
 if(!src){sceneTimer=setTimeout(advanceSyn,10000);return}
 if(currentAudioSource!==src){narration.src=(window.NEURAL_AUDIO||{})[src]||src;narration.load();currentAudioSource=src;}
 if(S.syn.narration){const p=narration.play();if(p&&typeof p.catch==='function')p.catch(()=>{sceneTimer=setTimeout(advanceSyn,9800)})}else{sceneTimer=setTimeout(advanceSyn,9800)}
}
narration.addEventListener('ended',()=>{if(S.page==='synapse'&&S.syn.playing)advanceSyn()});
function startSyn(){S.syn.started=true;$('synStart').hidden=true;setChapter(0,true)}
$('synStart').addEventListener('click',startSyn);
$('synPlay').addEventListener('click',()=>{if(!S.syn.started)return startSyn();if(S.syn.playing){pauseSyn();return}if(S.syn.index===4&&narration.ended){setChapter(0,true);return}playChapter()});
$('synNext').addEventListener('click',()=>{if(!S.syn.started){S.syn.started=true;$('synStart').hidden=true}setChapter(Math.min(4,S.syn.index+1),S.syn.playing)});
$('synBack').addEventListener('click',()=>{if(!S.syn.started){S.syn.started=true;$('synStart').hidden=true}setChapter(Math.max(0,S.syn.index-1),S.syn.playing)});
$('synMute').addEventListener('click',()=>{S.syn.narration=!S.syn.narration;$('synMute').textContent=S.syn.narration?'🔊 Narration on':'🔇 Captions only';$('synMute').setAttribute('aria-pressed',String(S.syn.narration));if(S.syn.playing){stopTimer();narration.pause();if(S.syn.narration)playChapter();else{sceneTimer=setTimeout(advanceSyn,9800)}}});
setChapter(0,false);$('synMute').setAttribute('aria-pressed','true');

function roundrect(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function bubble(ctx,x,y,r,fill,outline){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(outline){ctx.strokeStyle=outline;ctx.lineWidth=2;ctx.stroke()}}
function line(ctx,points,color,width){ctx.beginPath();points.forEach((p,i)=>{if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p)});ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}
function label(ctx,text,x,y,color='#496f70',size=13){ctx.font=`700 ${size}px Arial`;ctx.fillStyle=color;ctx.fillText(text,x,y)}
function synapsePaint(ms){let c=$('synapseCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);const gr=ctx.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#e5f0eb');gr.addColorStop(1,'#d4e4e0');ctx.fillStyle=gr;ctx.fillRect(0,0,w,h);
 for(let i=0;i<18;i++){bubble(ctx,((i*157)%1160)-20,((i*97)%550)-40,26+i%4*12,'#ffffff25')}
 // Sending axon and terminal, intentionally schematic.
 line(ctx,[[-30,90],[150,90],[200,145],[250,155]],'#b36f4d',88);line(ctx,[[-30,90],[150,90],[200,145],[250,155]],'#edb27d',78);
 ctx.beginPath();ctx.ellipse(285,200,123,132,.16,0,Math.PI*2);ctx.fillStyle='#efbd87';ctx.fill();ctx.strokeStyle='#a96a4e';ctx.lineWidth=5;ctx.stroke();
 // Receiving membrane
 ctx.beginPath();ctx.moveTo(630,365);ctx.bezierCurveTo(725,325,744,165,880,195);ctx.bezierCurveTo(992,219,1062,305,1160,225);ctx.lineTo(1160,520);ctx.lineTo(610,520);ctx.closePath();ctx.fillStyle='#8fc1c5';ctx.fill();ctx.strokeStyle='#4d8b94';ctx.lineWidth=5;ctx.stroke();
 // Receptors sit on cell membrane
 const recX=[693,776,861,950,1036];for(let i=0;i<recX.length;i++){let x=recX[i],y=[337,247,193,222,256][i];ctx.strokeStyle='#e8f4ec';ctx.lineWidth=13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-20,y-5);ctx.lineTo(x-20,y-34);ctx.quadraticCurveTo(x,y-53,x+20,y-34);ctx.lineTo(x+20,y-5);ctx.stroke()}
 // Vesicles; move toward cleft at scene 2.
 for(let i=0;i<8;i++){let ang=i*2.4,r=49+(i%3)*16,vx=278+Math.cos(ang)*r,vy=204+Math.sin(ang)*r;
 if(S.syn.index===2){vx+=Math.max(0,Math.sin(ms/690+i*.6))*22;vy+=Math.max(0,Math.sin(ms/690+i*.6))*8}
 bubble(ctx,vx,vy,21,'#fbe4b3','#b67452');for(let j=0;j<3;j++)bubble(ctx,vx+Math.sin(j*2.1)*9,vy+Math.cos(j*2.1)*9,4,'#d9975c')}
 // Released ACh molecules; visible in release and receptor stages
 if(S.syn.index>=2){for(let i=0;i<15;i++){let t=((ms/2600)+(i*.113))%1,x=398+210*t+Math.sin(i*2.1+t*5)*20,y=175+130*((i*41)%13)/13+Math.sin(t*4+i*1.7)*31; if(S.syn.index===4) {x+=25;y+=15} bubble(ctx,x,y,7.5,'#d9a65f','#a77a48')}}
 // Synaptic pulse from incoming axon
 if(S.syn.index<=2){let x=-30+((ms/2600)%1)*260;ctx.beginPath();ctx.moveTo(x,64);ctx.lineTo(x+20,90);ctx.lineTo(x,116);ctx.strokeStyle='#fff1b2';ctx.lineWidth=9;ctx.stroke()}
 if(S.syn.index===3){for(let i=0;i<4;i++)bubble(ctx,recX[i],([337,247,193,222][i]-36),11,'#ecba79','#b9794d');for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(866,299,25+(ms/15)%75,0,Math.PI*2);ctx.strokeStyle='#f9e1a850';ctx.lineWidth=3;ctx.stroke()}}
 if(S.syn.index===4){roundrect(ctx,740,317,115,45,20,'#d7ece0');label(ctx,'+ MORE LIKELY',747,345,'#277b61',13);roundrect(ctx,873,317,115,45,20,'#f2dcda');label(ctx,'− LESS LIKELY',878,345,'#aa6663',13)}
 // Minimal fine labels
 label(ctx,'SENDING TERMINAL',115,390,'#8d654e',16);label(ctx,'SYNAPTIC CLEFT',445,99,'#4c777c',16);label(ctx,'RECEIVING CELL',834,421,'#3d7b82',16);
 if(S.syn.index===1)label(ctx,'VESICLES',185,352,'#945d44',15);
 if(S.syn.index===3)label(ctx,'RECEPTORS',805,127,'#3e7e83',15);
 ctx.strokeStyle='#90a99b';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(485,118);ctx.lineTo(485,155);ctx.moveTo(852,134);ctx.lineTo(855,163);ctx.stroke();
}

/* --- MEMORY MAZE, A PHYSICAL CORRIDOR GRAPH, NOT A DECORATIVE RACE --- */
const groups={saline:{name:'Saline control',short:'Saline',color:'#368f8b',desc:'Saline: same procedure, no active drug.'},scop:{name:'ACh receptor blocked',short:'Antagonist',color:'#d47a60',desc:'Scopolamine blocks ACh receptors (antagonist).'},physo:{name:'ACh breakdown slowed',short:'Enzyme inhibitor',color:'#9b78ad',desc:'Physostigmine slows ACh breakdown (enzyme inhibitor).'}};
const mainPath=[[70,385],[160,385],[160,287],[267,287],[267,164],[388,164],[388,283],[503,283],[503,160],[620,160],[620,87],[697,87]];
const branches={2:[[92,287],[92,198]],4:[[267,92],[333,92]],6:[[388,382],[466,382]],8:[[433,160],[433,79]],9:[[620,258],[701,258]]};
const errorSlots=[2,4,6,8,9,2,6,8,4,9,2,6];
function routeFromErrors(count){let per={};for(let i=0;i<count;i++)per[errorSlots[i%errorSlots.length]]=(per[errorSlots[i%errorSlots.length]]||0)+1;
 const pts=[{x:mainPath[0][0],y:mainPath[0][1]}];for(let i=1;i<mainPath.length;i++){let p=mainPath[i];pts.push({x:p[0],y:p[1]});if(branches[i])for(let k=0;k<(per[i]||0);k++){let b=branches[i];pts.push({x:b[0][0],y:b[0][1]});pts.push({x:b[1][0],y:b[1][1],wrong:true});pts.push({x:b[0][0],y:b[0][1]});pts.push({x:p[0],y:p[1]})}}
 let sum=0,markers=[],mistakes=[];for(let i=1;i<pts.length;i++){sum+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);if(pts[i].wrong){markers.push(sum);mistakes.push({x:pts[i].x,y:pts[i].y,d:sum})}}return{pts,dist:sum,markers,mistakes};}
function routePosition(route,p){const target=route.dist*clamp(p,0,1);let walked=0;for(let i=1;i<route.pts.length;i++){const a=route.pts[i-1],b=route.pts[i],seg=Math.hypot(a.x-b.x,a.y-b.y);if(walked+seg>=target){let u=(target-walked)/(seg||1);return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,angle:Math.atan2(b.y-a.y,b.x-a.x)}}walked+=seg}return{x:697,y:87,angle:0}}
const mazePathGeometry=[mainPath,...Object.entries(branches).map(([index,p])=>[mainPath[Number(index)],...p])];
let mazeBackdrop=null;
function traceMazeCorridors(ctx){ctx.beginPath();for(const path of mazePathGeometry){path.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]))}}
function createMazeBackdrop(){
 const c=document.createElement('canvas');c.width=760;c.height=470;const g=c.getContext('2d');
 const base=g.createLinearGradient(0,0,760,470);base.addColorStop(0,'#e2dfd4');base.addColorStop(1,'#d2d8cc');g.fillStyle=base;g.fillRect(0,0,760,470);
 for(let i=0;i<22;i++){g.strokeStyle=`rgba(46,76,71,${0.024+i%4*.004})`;g.lineWidth=1;g.beginPath();g.moveTo(i*37,0);g.lineTo(i*37-48,470);g.stroke()}
 g.shadowColor='rgba(21,41,39,.28)';g.shadowBlur=15;g.shadowOffsetY=8;
 roundrect(g,13,12,734,446,24,'#8b9e97','#5c7771');g.shadowBlur=0;g.shadowOffsetY=0;
 roundrect(g,22,20,716,428,16,'#eee5d4','#66847d');
 // Distinct light-colored floor under the maze: the carved passages reveal it.
 const floor=g.createLinearGradient(0,42,0,448);floor.addColorStop(0,'#f9f5e9');floor.addColorStop(1,'#ece7d8');roundrect(g,31,28,698,410,10,floor);
 for(let y=46;y<435;y+=20){g.strokeStyle='rgba(124,115,88,.04)';g.lineWidth=1;g.beginPath();g.moveTo(35,y);g.lineTo(725,y);g.stroke()}
 // Create a continuous top surface then cut passages *out* of the wall surface.
 const wall=document.createElement('canvas');wall.width=760;wall.height=470;const w=wall.getContext('2d');
 w.fillStyle='#b4c9c3';w.fillRect(32,29,696,408);
 w.globalCompositeOperation='destination-out';w.strokeStyle='black';w.lineWidth=68;w.lineCap='round';w.lineJoin='round';traceMazeCorridors(w);w.stroke();
 w.beginPath();w.arc(70,385,40,0,Math.PI*2);w.arc(697,87,41,0,Math.PI*2);w.fill();
 w.globalCompositeOperation='source-atop';
 const gloss=w.createLinearGradient(0,28,700,440);gloss.addColorStop(0,'rgba(255,255,255,.26)');gloss.addColorStop(.5,'rgba(255,255,255,0)');gloss.addColorStop(1,'rgba(53,102,97,.18)');w.fillStyle=gloss;w.fillRect(0,0,760,470);
 // Fine engravings belong to the wall tops, not the pathways.
 w.strokeStyle='rgba(255,255,255,.18)';w.lineWidth=1;
 for(let x=55;x<725;x+=52){w.beginPath();w.moveTo(x,30);w.lineTo(x+27,437);w.stroke()}
 w.globalCompositeOperation='source-over';
 // The translated darker wall mask is the visible vertical extrusion.
 g.save();g.globalAlpha=.72;g.filter='brightness(0.58)';g.drawImage(wall,0,7);g.restore();
 g.save();g.shadowColor='rgba(20,54,51,.38)';g.shadowBlur=9;g.shadowOffsetY=4;g.drawImage(wall,0,0);g.restore();
 // Subtle inlaid floor guide marks, behind the rat (not a suggested solution route).
 g.fillStyle='#dce9df';g.strokeStyle='#76a69c';g.lineWidth=2;
 g.beginPath();g.roundRect(43,361,59,52,14);g.fill();g.stroke();
 g.fillStyle='#e4bf86';g.strokeStyle='#ad8356';g.beginPath();g.roundRect(665,55,61,61,14);g.fill();g.stroke();
 // A food cup with two pellets, visible before the rat reaches it.
 g.shadowColor='rgba(77,53,34,.2)';g.shadowBlur=6;g.shadowOffsetY=3;
 bubble(g,697,87,20,'#f8edcf','#a98352');g.shadowBlur=0;g.shadowOffsetY=0;
 bubble(g,693,80,6,'#c18b54');bubble(g,702,94,5,'#bd8d58');bubble(g,702,78,3,'#e7bb6e');
 g.fillStyle='#3b806f';g.font='bold 12px Arial';g.textAlign='left';g.fillText('START',46,347);
 g.fillStyle='#926034';g.textAlign='right';g.fillText('FOOD',720,48);g.textAlign='left';
 // Bolts make this read as a physical lab apparatus.
 for(const [x,y] of [[17,18],[742,18],[17,454],[742,454]]){bubble(g,x,y,4,'#dce8e1','#42665f');line(g,[[x-2,y],[x+2,y]],'#72938a',1)}
 return c;
}
function traceVisited(ctx,route,progress){if(!route||progress<=0)return;const goal=route.dist*clamp(progress,0,1);let taken=0;ctx.save();ctx.setLineDash([2,11]);ctx.strokeStyle='rgba(54,112,107,.45)';ctx.lineWidth=4.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(route.pts[0].x,route.pts[0].y);
 for(let i=1;i<route.pts.length;i++){const a=route.pts[i-1],b=route.pts[i],length=Math.hypot(a.x-b.x,a.y-b.y);if(taken+length>goal){const f=(goal-taken)/(length||1);ctx.lineTo(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f);break;}ctx.lineTo(b.x,b.y);taken+=length}ctx.stroke();ctx.restore();
 for(const mark of route.mistakes||[]){if(mark.d<=goal){bubble(ctx,mark.x,mark.y,12,'#edbdad','#c66c5b');ctx.fillStyle='#943c35';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 14px Arial';ctx.fillText('×',mark.x,mark.y);ctx.textAlign='left';ctx.textBaseline='alphabetic'}}
}
function drawMouse(ctx,x,y,ang,scale=1,clock=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(scale,scale);
 const s=Math.sin(clock/155);
 // Tail and legs trail behind a soft, top-down head-and-body silhouette.
 ctx.strokeStyle='#af9790';ctx.lineWidth=5.3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-20,1);ctx.bezierCurveTo(-40,-13-s*4,-41,17+s*6,-64,9+s*7);ctx.stroke();
 ctx.fillStyle='#64777145';ctx.beginPath();ctx.ellipse(-3,6,27,18,0,0,Math.PI*2);ctx.fill();
 const feet=[[-17,-14],[-18,15],[11,-14],[11,15]];for(let i=0;i<4;i++){let [fx,fy]=feet[i];ctx.fillStyle='#d9b2ae';ctx.beginPath();ctx.ellipse(fx+s*(i%2?3:-3),fy,7,3.5,0,0,Math.PI*2);ctx.fill()}
 const fur=ctx.createLinearGradient(-28,-17,20,20);fur.addColorStop(0,'#fffef7');fur.addColorStop(.68,'#e0e4db');fur.addColorStop(1,'#c4c9c2');ctx.fillStyle=fur;ctx.strokeStyle='#8c9c94';ctx.lineWidth=1.7;ctx.beginPath();ctx.ellipse(-6,0,29,17,0,0,Math.PI*2);ctx.fill();ctx.stroke();
 for(const yy of [-13,13]){bubble(ctx,8,yy,10,'#dbaeb0','#a68e8e');bubble(ctx,9,yy,6.2,'#f0c7c9')}
 ctx.fillStyle='#fafaf4';ctx.beginPath();ctx.ellipse(16,0,17,11,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a0aca2';ctx.stroke();
 for(const yy of [-5.1,5.1]){bubble(ctx,20,yy,2.9,'#334846');bubble(ctx,20.9,yy-1,1,'#fff')}
 bubble(ctx,33,0,3.6,'#d88f93');ctx.strokeStyle='#a2a9a3';ctx.lineWidth=1.15;
 for(const yoff of [-1,1])for(let j=0;j<2;j++){ctx.beginPath();ctx.moveTo(31,yoff*2.2);ctx.lineTo(40+j*3,yoff*(7+j*4));ctx.stroke()}
 ctx.restore();
}
function mazeDraw(now){const c=$('mazeCanvas'),ctx=c.getContext('2d');if(!mazeBackdrop)mazeBackdrop=createMazeBackdrop();ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(mazeBackdrop,0,0);
 const rat=S.maze;let x=70,y=385,ang=0,progress=0;
 if(rat.running&&rat.route){progress=clamp((now-rat.animationTime)/rat.animationDuration,0,1);traceVisited(ctx,rat.route,progress);const pos=routePosition(rat.route,progress);x=pos.x;y=pos.y;ang=pos.angle;const newErrors=rat.route.markers.filter(m=>m<=progress*rat.route.dist).length;if($('errorReadout').textContent!==String(newErrors))$('errorReadout').textContent=String(newErrors)}
 else{const done=Object.keys(S.maze.completed).length>0||S.maze.habituated;x=done?697:70;y=done?87:385;ang=done?-.2:0}
 ctx.save();ctx.shadowColor='rgba(36,57,53,.25)';ctx.shadowBlur=4;ctx.shadowOffsetY=3;drawMouse(ctx,x,y,ang,1.0,rat.running?now:0);ctx.restore();
 if(rat.running&&progress===1)finishRun();
}

function sampleRng(seed){return ()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function simulateGroup(key){
 let rng=sampleRng(435618+{saline:19,scop:132,physo:341}[key]),rats=[];
 for(let r=0;r<6;r++){
  const bias=(rng()-.5)*.75,values=[];
  for(let tr=0;tr<12;tr++){
   // These are NOT reported results: chosen to depict the three-condition classroom model.
   const baseline={saline:6.10,scop:7.25,physo:4.70}[key];
   const learning={saline:.31,scop:.17,physo:.33}[key];
   const err=Math.round(clamp(baseline-learning*tr+bias+(rng()-.5)*.95,0,9));
   values.push(err);
  }
  rats.push(values);
 }
 const mean=Array.from({length:12},(_,t)=>+(rats.reduce((sum,rat)=>sum+rat[t],0)/6).toFixed(2));
 return {key,rats,mean};
}
const sim=S.maze;
function stageMsg(title,help,badge){$('mazeStageTitle').textContent=title;$('expHeading').textContent=title;$('expHelp').textContent=help;$('mazeBadge').textContent=badge}
function startRoute(route,kind,ms){sim.running=true;sim.route=route;sim.kind=kind;sim.animationTime=performance.now();sim.animationDuration=ms;$('habituateBtn').disabled=true;$('runGroup').disabled=true;$('mazeBadge').textContent='RUNNING';$('errorReadout').textContent='0'}
$('habituateBtn').addEventListener('click',()=>{stageMsg('Practice','A warm-up. No score.','FAMILIARIZING');$('conditionReadout').textContent='Practice';$('trialReadout').textContent='Practice';startRoute(routeFromErrors(0),'habituate',3600);autoMazeAudio('assets/audio/maze-01.mp3')});
function finishRun(){
 if(!sim.running)return;
 sim.running=false;$('habituateBtn').disabled=false;$('runGroup').disabled=false;$('mazeBadge').textContent='COMPLETE';
 if(sim.kind==='habituate'){
  sim.habituated=true;$('habituateArea').hidden=true;$('experimentArea').hidden=false;
  stageMsg('Choose a condition','Start with saline. Count the wrong turns.','READY');
  $('conditionReadout').textContent='Ready';$('errorReadout').textContent='0';return;
 }
 if(sim.kind==='group'){
  if(sim.demoIndex<2){sim.demoIndex++;startDemoRoute();return;}
  const key=sim.selected;
  sim.completed[key]=sim.pending;
  stageMsg(`${groups[key].short} · recorded`,'Choose the next condition, then compare all three.','RECORDED');
  $$('.vial').forEach(btn=>{const k=btn.dataset.group;btn.querySelector('.vial-status').textContent=sim.completed[k]?'DONE':(k===sim.selected?'READY':'')});
  const next=!sim.completed.saline?'saline':!sim.completed.scop?'scop':!sim.completed.physo?'physo':null;
  $('runSummary').textContent=next?`${Object.keys(sim.completed).length} / 3 groups recorded · Next: ${groups[next].name}`:'3 / 3 recorded · Results are below the maze.';
  $('runSummary').classList.toggle('finished',!next);
  if(next){selectGroup(next);}else{
   $('graphZone').hidden=false;$('evaluation').hidden=false;drawGraph();
   $('revealStudy').disabled=false;
   autoMazeAudio('assets/audio/analysis-01.mp3');
  }
 }
}
function selectGroup(key){if(sim.running)return;sim.selected=key;$$('.vial').forEach(b=>{const sel=b.dataset.group===key;b.classList.toggle('selected',sel);b.setAttribute('aria-pressed',sel?'true':'false');b.querySelector('.vial-status').textContent=sim.completed[b.dataset.group]?'DONE':(sel?'READY':'')});$('conditionReadout').textContent=groups[key].short;$('runGroup').textContent=sim.completed[key]?'↻ Repeat group':'▶ Run 12 trials';$('expHelp').textContent=groups[key].desc;}
$$('.vial').forEach(b=>b.addEventListener('click',()=>selectGroup(b.dataset.group)));
function startDemoRoute(){
 const t=[0,5,11][sim.demoIndex],errors=sim.pending.rats[0][t];
 $('trialReadout').textContent=`Trial ${t+1} / 12`;
 $('mazeStageTitle').textContent=['First trial','Midway','Final trial'][sim.demoIndex];
 $('expHelp').textContent='Watch the rat. Each wrong corridor adds 1 error.';
 startRoute(routeFromErrors(errors),'group',2300+errors*320);
}
$('runGroup').addEventListener('click',()=>{
 if(sim.running||!sim.habituated)return;
 const key=sim.selected;sim.pending=simulateGroup(key);sim.demoIndex=0;
 $('ratName').textContent=['Pip','Noodle','Mochi'][Object.keys(groups).indexOf(key)];
 $('conditionReadout').textContent=groups[key].short;
 startDemoRoute();
 autoMazeAudio(key==='scop'?'assets/audio/synapse-05.mp3':key==='physo'?'assets/audio/maze-03.mp3':'assets/audio/maze-02.mp3');
});
function playExtraAudio(path){
 narration.pause();currentAudioSource=path;
 narration.src=(window.NEURAL_AUDIO||{})[path]||path;
 const prom=narration.play();if(prom&&prom.catch)prom.catch(()=>{$('mazeVoice').title='Browser prevented playback. Tap Audio on to retry.'});
}
function autoMazeAudio(path){if(S.mazeAudioOn)playExtraAudio(path);}
$('mazeVoice').addEventListener('click',()=>{
 S.mazeAudioOn=!S.mazeAudioOn;
 const b=$('mazeVoice');b.textContent=S.mazeAudioOn?'🔊 Audio on':'🔇 Audio off';b.setAttribute('aria-pressed',String(S.mazeAudioOn));
 if(!S.mazeAudioOn)narration.pause();
 else playExtraAudio(sim.habituated?'assets/audio/maze-02.mp3':'assets/audio/maze-01.mp3');
});
$('revealStudy').addEventListener('click',()=>{$('researchReveal').hidden=false;$('researchReveal').scrollIntoView({behavior:'smooth',block:'nearest'})});
const averages=(vals,a,b)=>+(vals.slice(a,b).reduce((x,y)=>x+y,0)/(b-a)).toFixed(2);
function drawGraph(){
 const c=$('resultsCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
 const L=66,R=1003,T=20,B=171,xp=i=>L+(i/11)*(R-L),yp=v=>B-(v/9)*(B-T);
 for(let i=0;i<=9;i+=3){const y=yp(i);line(ctx,[[L,y],[R,y]],'#e2e9e3',1);ctx.textAlign='right';label(ctx,String(i),L-13,y+4,'#5b7771',12)}
 ctx.textAlign='start';line(ctx,[[L,T],[L,B],[R,B]],'#78948b',2);
 for(let t=0;t<12;t++){ctx.textAlign='center';label(ctx,String(t+1),xp(t),B+21,'#55746d',11)}
 ctx.textAlign='start';label(ctx,'WRONG TURNS',L,T-7,'#52766d',11);
 label(ctx,'TRIAL',L+(R-L)/2-17,B+45,'#52766d',11);
 for(const k of ['physo','saline','scop']){
  const res=sim.completed[k];if(!res)continue;
  const col=groups[k].color;line(ctx,res.mean.map((v,i)=>[xp(i),yp(v)]),col,4);
  for(let i=0;i<12;i++)bubble(ctx,xp(i),yp(res.mean[i]),3.3,'#fff',col);
  label(ctx,{scop:'Blocker',saline:'Saline',physo:'Enzyme'}[k],R+9,yp(res.mean[11])+4,col,12);
 }
 $('graphLegend').innerHTML=['scop','saline','physo'].filter(k=>sim.completed[k]).map(k=>`<span><i style="background:${groups[k].color}"></i>${groups[k].short}</span>`).join('');
 $('metrics').innerHTML=['scop','saline','physo'].filter(k=>sim.completed[k]).map(k=>{const res=sim.completed[k];return `<div class="metric compact-metric"><b style="color:${groups[k].color}">${groups[k].short}</b><small>Early: ${averages(res.mean,0,3)} → Late: ${averages(res.mean,9,12)} errors</small></div>`}).join('');
}
function csvExport(){let rows=[['DATA TYPE','SYNTHETIC classroom illustration, NOT research measurements'],['condition','virtual_rat','trial','wrong_turns']];for(const [k,g] of Object.entries(sim.completed)){g.rats.forEach((rat,i)=>rat.forEach((v,t)=>rows.push([k,`virtual-${i+1}`,t+1,v])))}const csv=rows.map(r=>r.map(s=>`"${String(s).replaceAll('"','""')}"`).join(',')).join('\r\n');download('neural-lab-SYNTHETIC-maze.csv',csv,'text/csv')}
$('exportCsv').addEventListener('click',csvExport);

/* --- FIELD NOTES --- */
function download(filename,content,mime='text/plain'){const b=new Blob([content],{type:mime});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)}
const prompts=[...Array(4)].map((_,i)=>$('answer'+(i+1)));
prompts.forEach((el,i)=>{try{el.value=localStorage.getItem('neural-reset-note-'+(i+1))||''}catch{}el.addEventListener('input',()=>{try{localStorage.setItem('neural-reset-note-'+(i+1),el.value)}catch{}})});
/* No PDF worksheet - recap lives inside this HTML. */
$('downloadNotes').addEventListener('click',()=>download('Neural_Lab_Take_Home_Recap.txt',['NEURAL LAB: RECAP','',...prompts.map((el,i)=>`${i+1}. ${el.previousElementSibling.textContent}\n${el.value.trim()}\n`),'','All numbers are invented for a classroom comparison inspired by Martinez & Kesner teaching materials.'].join('\n')));
$('restartLesson').addEventListener('click',()=>{if(!confirm('Clear your notes and restart the lesson?'))return;prompts.forEach((el,i)=>{el.value='';try{localStorage.removeItem('neural-reset-note-'+(i+1))}catch{}});location.reload()});


/* --- MAIN ANIMATION LOOP --- */
function tick(now){let dt=clamp(now-lastTime,0,60);lastTime=now;if(S.page==='synapse'){if(S.syn.playing)S.syn.clock+=dt;synapsePaint(S.syn.clock)}else if(S.page==='maze'){mazeDraw(now)}requestAnimationFrame(tick)}
requestAnimationFrame(tick);
(window.MindfieldReport=window.MindfieldReport||{}).where=()=>({intro:'Start',synapse:`01 Signal, scene ${S.syn.index+1} / 5`,maze:'02 Memory (maze)',molecules:'03 Drug lab (Mouse Party)',notebook:'Recap'})[S.page]||S.page;
// Test-only API: no effect on normal student use.
window.__NEURAL_QA__={state:S,simulateGroup,routeFromErrors,chapters,selectGroup,finishRun,drawGraph,page,averages};
})();
