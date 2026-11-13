/* Mouse Party companion whiteboard. Student work is stored only in this browser.
   The downloadable PDF is generated locally without external libraries. */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const storagePrefix = 'mouseparty-whiteboard-';
  const rows = $$('.worksheet-row');
  if (!rows.length) return;
  const tabs = $('#whiteboardTabs');
  const count = $('#whiteboardCount');
  const prev = $('#whiteboardPrev');
  const next = $('#whiteboardNext');
  const inputs = $$('.ws-input');
  const boards = $$('.sketch-pad');
  const drugNames = rows.map(row => $('.drug-name strong',row).textContent.trim());
  let selected = 0;
  const sketches = new Map();

  function get(key) { try { return localStorage.getItem(storagePrefix+key); } catch { return null; } }
  function set(key,value) { try { localStorage.setItem(storagePrefix+key,value); } catch {} }
  function remove(key) { try { localStorage.removeItem(storagePrefix+key); } catch {} }

  inputs.forEach(el=>{
    const value = get(el.dataset.key);
    if (value !== null) el.value=value;
    el.addEventListener('input',()=>set(el.dataset.key,el.value));
  });

  function select(index, focus=false) {
    selected=(index+rows.length)%rows.length;
    rows.forEach((row,i)=>row.hidden=i!==selected);
    const buttons=$$('.whiteboard-tab',tabs);
    buttons.forEach((b,i)=>{
      b.setAttribute('aria-selected',String(i===selected));
      b.tabIndex=i===selected?0:-1;
      if(i===selected && focus) b.focus({preventScroll:true});
    });
    if(count) count.textContent=`${selected+1} of ${rows.length} · ${drugNames[selected]}`;
    set('active-tab',String(selected));
  }
  drugNames.forEach((drug,i)=>{
    const button=document.createElement('button');
    button.type='button';button.className='whiteboard-tab';button.setAttribute('role','tab');
    button.textContent=drug;button.id=`whiteboard-tab-${i}`;
    button.addEventListener('click',()=>select(i));
    button.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'){e.preventDefault();select(i+1,true);}
      if(e.key==='ArrowLeft'){e.preventDefault();select(i-1,true);}
    });
    tabs.appendChild(button);
  });
  if(prev) prev.addEventListener('click',()=>select(selected-1));
  if(next) next.addEventListener('click',()=>select(selected+1));
  const restored=Number(get('active-tab'));
  select(Number.isInteger(restored)?restored:0);

  function defaultBrush(ctx){
    ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#1a6167';
  }
  function resetBoard(canvas){
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);defaultBrush(ctx);
  }
  function applySnapshot(canvas,uri){
    if(!uri){resetBoard(canvas);return;}
    const img=new Image();
    img.onload=()=>{
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);defaultBrush(ctx);
    };
    img.onerror=()=>resetBoard(canvas);
    img.src=uri;
  }
  function saveBoard(canvas){set(canvas.dataset.key,canvas.toDataURL('image/png'));}
  function locationOnCanvas(canvas,event){
    const bounds=canvas.getBoundingClientRect();
    return {x:(event.clientX-bounds.left)*canvas.width/bounds.width,
            y:(event.clientY-bounds.top)*canvas.height/bounds.height};
  }

  boards.forEach(canvas=>{
    const context=canvas.getContext('2d');
    const saved=get(canvas.dataset.key);
    resetBoard(canvas);
    if(saved) applySnapshot(canvas,saved);
    let pointer=null,history=[];
    function point(event){const p=locationOnCanvas(canvas,event);context.lineTo(p.x,p.y);context.stroke();}
    canvas.addEventListener('pointerdown',event=>{
      if(event.button!==undefined && event.button!==0 && event.pointerType==='mouse')return;
      event.preventDefault();
      pointer=event.pointerId;
      history.push(canvas.toDataURL('image/png'));if(history.length>12)history.shift();
      canvas.setPointerCapture(event.pointerId);
      const p=locationOnCanvas(canvas,event);context.beginPath();context.moveTo(p.x,p.y);
      context.lineTo(p.x+0.08,p.y+0.08);context.stroke();
    });
    canvas.addEventListener('pointermove',event=>{if(event.pointerId===pointer){event.preventDefault();point(event);}});
    function finish(event){
      if(pointer!==event.pointerId)return;
      pointer=null;try{canvas.releasePointerCapture(event.pointerId);}catch{}
      saveBoard(canvas);
    }
    canvas.addEventListener('pointerup',finish);
    canvas.addEventListener('pointercancel',finish);
    const clearBtn=$('.sketch-clear',canvas.parentElement);
    clearBtn?.addEventListener('click',()=>{
      history.push(canvas.toDataURL('image/png'));resetBoard(canvas);saveBoard(canvas);
    });
    const undo=document.createElement('button');undo.type='button';undo.className='sketch-clear';
    undo.textContent='Undo';undo.setAttribute('aria-label',`Undo most recent ${drugNames[boards.indexOf(canvas)]} drawing stroke`);
    undo.addEventListener('click',()=>{
      const snapshot=history.pop();if(!snapshot)return;applySnapshot(canvas,snapshot);set(canvas.dataset.key,snapshot);
    });
    clearBtn?.before(undo);
    sketches.set(canvas.dataset.key,canvas);
  });

  /* Draw a print-quality A4 page for every drug. Canvas text ensures student
     handwriting/sketches survive export even when a device cannot print textareas. */
  const PW=1488, PH=2105;
  function rect(ctx,x,y,w,h,fill,stroke){
    ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
  }
  function wrap(ctx,text,x,y,maxWidth,lineHeight,maxY){
    const paragraphs=(text||'').split(/\n/);
    for(const paragraph of paragraphs){
      const words=paragraph.split(/\s+/).filter(Boolean);
      let line='';
      for(let word of words){
        while(ctx.measureText(word).width>maxWidth && word.length>2){
          const cut=Math.max(1,Math.floor(word.length*maxWidth/ctx.measureText(word).width)-1);
          const part=word.slice(0,cut);word=word.slice(cut);
          if(line){ctx.fillText(line,x,y);y+=lineHeight;line='';}
          if(y>maxY)return y;
          ctx.fillText(part,x,y);y+=lineHeight;
        }
        const cand=line?`${line} ${word}`:word;
        if(ctx.measureText(cand).width>maxWidth && line){
          ctx.fillText(line,x,y);y+=lineHeight;line=word;
          if(y>maxY)return y;
        } else {line=cand;}
      }
      if(line)ctx.fillText(line,x,y);
      y+=lineHeight;
      if(y>maxY)return y;
    }
    return y;
  }
  function writeTextBlock(ctx,title,text,x,y,width,height){
    rect(ctx,x,y,width,height,'#ffffff','#dce4df');
    ctx.fillStyle='#275e65';ctx.font='bold 25px Arial, sans-serif';ctx.fillText(title,x+25,y+48);
    const content=(text||'').trim();
    if(!content){ctx.fillStyle='#829492';ctx.font='italic 24px Arial, sans-serif';ctx.fillText('No notes added',x+25,y+104);return;}
    for(const sz of [29,27,25,23,21,19]){
      ctx.font=`${sz}px Arial, sans-serif`;
      const rows=content.split(/\n/).reduce((n,p)=>n+Math.max(1,Math.ceil(ctx.measureText(p).width/(width-65)*1.35)),0);
      if(rows*sz*1.4<height-110 || sz===19)break;
    }
    ctx.fillStyle='#19383f';wrap(ctx,content,x+25,y+102,width-60,Math.round(parseInt(ctx.font,10)*1.5),y+height-16);
  }
  function renderPdfPage(drug,row,index){
    const paper=document.createElement('canvas');paper.width=PW;paper.height=PH;
    const ctx=paper.getContext('2d');rect(ctx,0,0,PW,PH,'#f9f9f6');
    rect(ctx,0,0,PW,17,'#176169');
    ctx.fillStyle='#2a656c';ctx.font='bold 28px Arial, sans-serif';ctx.fillText('NEURAL LAB  /  MOUSE PARTY OBSERVATIONS',91,100);
    ctx.fillStyle='#213f45';ctx.font='58px Georgia,serif';ctx.fillText(drug,88,193);
    ctx.fillStyle='#617b7d';ctx.font='23px Arial,sans-serif';ctx.fillText(`Substance ${index+1} of ${rows.length}  •  Observation worksheet`,90,250);
    const fields=$$('.ws-input',row);
    writeTextBlock(ctx,'NEUROTRANSMITTER(S)',fields[0]?.value,90,304,1308,340);
    writeTextBlock(ctx,'WHAT DOES THE SUBSTANCE DO?',fields[1]?.value,90,685,1308,445);
    ctx.fillStyle='#295a63';ctx.font='bold 27px Arial,sans-serif';ctx.fillText('SKETCH  /  WHAT CHANGES AT THE SYNAPSE?',90,1210);
    rect(ctx,88,1245,1312,759,'#ffffff','#d3dfd9');
    const board=$('.sketch-pad',row);
    if(board){const ratio=Math.min(1242/board.width,690/board.height);
      const w=board.width*ratio,h=board.height*ratio;
      ctx.drawImage(board,92+(1304-w)/2,1284+(690-h)/2,w,h);
    }
    ctx.fillStyle='#687f7f';ctx.font='21px Arial,sans-serif';
    ctx.fillText('Student-made observation notes  ·  Visit the University of Utah Mouse Party activity for source content.',90,2062);
    return paper.toDataURL('image/jpeg',.88).split(',')[1];
  }
  function pdfBytes(base64pages){
    const encode=new TextEncoder(),parts=[],offsets=[0];let length=0;
    function bytes(s){const b=encode.encode(s);parts.push(b);length+=b.length;}
    function binary(b){parts.push(b);length+=b.length;}
    function obj(i,value){offsets[i]=length;bytes(`${i} 0 obj\n${value}\nendobj\n`);}
    const count=base64pages.length;
    bytes('%PDF-1.4\n%NeuralLab\n');
    obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
    obj(2,`<< /Type /Pages /Count ${count} /Kids [${base64pages.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`);
    base64pages.forEach((data,i)=>{
      const page=3+i*3,content=page+1,image=page+2;
      obj(page,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${image} 0 R >> >> /Contents ${content} 0 R >>`);
      const commands='q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
      obj(content,`<< /Length ${encode.encode(commands).length} >>\nstream\n${commands}endstream`);
      const raw=atob(data);const jpg=new Uint8Array(raw.length);
      for(let n=0;n<raw.length;n++)jpg[n]=raw.charCodeAt(n);
      offsets[image]=length;
      bytes(`${image} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${PW} /Height ${PH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
      binary(jpg);
      bytes('\nendstream\nendobj\n');
    });
    const xref=length;
    bytes(`xref\n0 ${2+count*3+1}\n0000000000 65535 f \n`);
    for(let j=1;j<=2+count*3;j++)bytes(`${String(offsets[j]).padStart(10,'0')} 00000 n \n`);
    bytes(`trailer\n<< /Size ${2+count*3+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(parts,{type:'application/pdf'});
  }
  $('#downloadWorksheet')?.addEventListener('click',()=>{
    const btn=$('#downloadWorksheet');btn.disabled=true;btn.textContent='Building PDF…';
    try{
      const pages=rows.map((row,i)=>renderPdfPage(drugNames[i],row,i));
      const blob=pdfBytes(pages);const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='Neural_Lab_Mouse_Party_Notes.pdf';
      document.body.appendChild(a);a.click();a.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url),15000);
    }catch(err){console.error('PDF export failed:',err);window.alert('PDF export failed. Please use the Print button and choose Save as PDF.');}
    finally{btn.disabled=false;btn.textContent='Download my PDF ↓';}
  });
  $('#printWorksheet')?.addEventListener('click',()=>{
    document.body.classList.add('print-worksheet');
    rows.forEach(row=>row.hidden=false);
    window.requestAnimationFrame(()=>window.print());
  });
  window.addEventListener('afterprint',()=>{
    document.body.classList.remove('print-worksheet');select(selected);
  });
  $('#clearWorksheet')?.addEventListener('click',()=>{
    if(!window.confirm('Clear all seven Mouse Party notes and sketches on this device?'))return;
    inputs.forEach(el=>{el.value='';remove(el.dataset.key);});
    boards.forEach(canvas=>{remove(canvas.dataset.key);resetBoard(canvas);});
    select(0);
  });
  window.__MOUSEPARTY_WHITEBOARD_QA__={getNames:()=>drugNames,select,rows:()=>rows.length};
})();
