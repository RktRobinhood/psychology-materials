/* Memory Olympiad v5: real multi-page PDF and a compact score QR, all offline. */
(function(){
'use strict';
function fnv(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0').toUpperCase();}
function verification(run,events){const values=events.map(e=>{const r=run.results.find(t=>t.id===e.id);return r?r.score:'-';}).join('.');const body=`MO5|ID:${run.id.slice(-8)}|P:${Math.round(run.results.reduce((s,r)=>s+100*r.score/r.max,0)/run.results.length)}|S:${values}`;return `${body}|H:${fnv(run.id+'|'+run.name+'|'+values)}`;}
const QRSIZE=37,DATA_CODEWORDS=108,ECC_CODEWORDS=26;
function gfMultiply(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((y>>>i)&1)*x;}return z;}
function rsDivisor(degree){const out=new Array(degree).fill(0);out[degree-1]=1;let root=1;for(let i=0;i<degree;i++){for(let j=0;j<degree;j++){out[j]=gfMultiply(out[j],root);if(j+1<degree)out[j]^=out[j+1];}root=gfMultiply(root,2);}return out;}
function rsRemainder(data,divisor){const out=new Array(divisor.length).fill(0);for(const b of data){const factor=b^out.shift();out.push(0);for(let j=0;j<divisor.length;j++)out[j]^=gfMultiply(divisor[j],factor);}return out;}
function toBytes(text){const bytes=new TextEncoder().encode(text);if(bytes.length>106)throw new Error('Score QR exceeds maximum capacity');const bits=[];const push=(num,n)=>{for(let i=n-1;i>=0;i--)bits.push((num>>>i)&1);};push(4,4);push(bytes.length,8);for(const b of bytes)push(b,8);const cap=DATA_CODEWORDS*8;push(0,Math.min(4,cap-bits.length));while(bits.length%8)bits.push(0);const out=[];for(let i=0;i<bits.length;i+=8)out.push(bits.slice(i,i+8).reduce((x,b)=>x*2+b,0));while(out.length<DATA_CODEWORDS)out.push(out.length%2?0x11:0xec);return out;}
function qrMatrix(text){const bytes=toBytes(text),data=[...bytes,...rsRemainder(bytes,rsDivisor(ECC_CODEWORDS))];const stream=data.flatMap(b=>Array.from({length:8},(_,i)=>(b>>>(7-i))&1));
 const grid=Array.from({length:QRSIZE},()=>Array(QRSIZE).fill(-1)),blocked=Array.from({length:QRSIZE},()=>Array(QRSIZE).fill(false));
 const put=(x,y,value)=>{if(x>=0&&x<QRSIZE&&y>=0&&y<QRSIZE){grid[y][x]=value?1:0;blocked[y][x]=true;}};
 const finder=(ox,oy)=>{for(let y=-1;y<=7;y++)for(let x=-1;x<=7;x++){const d=Math.max(Math.abs(x-3),Math.abs(y-3));put(ox+x,oy+y,d!==2&&d!==4&&x>=0&&x<=6&&y>=0&&y<=6);}};
 finder(0,0);finder(QRSIZE-7,0);finder(0,QRSIZE-7);
 for(let i=8;i<QRSIZE-8;i++){put(6,i,i%2===0);put(i,6,i%2===0);}
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)put(30+dx,30+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);
 const d=8;let r=d;for(let i=0;i<10;i++)r=(r<<1)^(((r>>>9)&1)*0x537);const format=((d<<10)|r)^0x5412,bit=i=>(format>>>i)&1;
 for(let i=0;i<=5;i++)put(8,i,bit(i));put(8,7,bit(6));put(8,8,bit(7));put(7,8,bit(8));for(let i=9;i<15;i++)put(14-i,8,bit(i));
 for(let i=0;i<8;i++)put(QRSIZE-1-i,8,bit(i));for(let i=8;i<15;i++)put(8,QRSIZE-15+i,bit(i));put(8,QRSIZE-8,1);
 let k=0;for(let right=QRSIZE-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<QRSIZE;vert++){const y=((right+1)&2)===0?QRSIZE-1-vert:vert;for(let j=0;j<2;j++){const x=right-j;if(!blocked[y][x]){grid[y][x]=(k<stream.length?stream[k]:0)^(((x+y)%2===0)?1:0);k++;}}}}
 if(k<stream.length)throw Error('QR overflow');return grid;
}
function escapeXml(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function qrSvgCard(run,events){const code=verification(run,events),grid=qrMatrix(code);let p='';for(let y=0;y<QRSIZE;y++)for(let x=0;x<QRSIZE;x++)if(grid[y][x])p+=`M${x+4} ${y+4}h1v1h-1z`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 67" width="650" height="670"><rect width="65" height="67" rx="2" fill="#fff"/><text x="4" y="5" font-family="Arial" font-size="2.7" font-weight="bold" fill="#152b42">MEMORY OLYMPIAD · v5</text><g transform="translate(4 9)"><rect x="0" y="0" width="45" height="45" fill="white"/><path fill="black" d="${p.replace(/M([0-9]+) ([0-9]+)/g,(_,x,y)=>`M${+x-4} ${+y-4}`)}"/></g><text x="4" y="60" font-family="monospace" font-size="1.4" fill="#222">${escapeXml(code)}</text><text x="4" y="63" font-family="Arial" font-size="1.8" fill="#333">Student-generated score record · keep your PDF/CSV too</text></svg>`;
}
function plain(value){return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/æ/g,'ae').replace(/Æ/g,'AE').replace(/ø/g,'oe').replace(/Ø/g,'OE').replace(/å/g,'aa').replace(/Å/g,'AA').replace(/ß/g,'ss').replace(/—/g,'--').replace(/–/g,'-').replace(/♠/g,'S').replace(/♥/g,'H').replace(/♦/g,'D').replace(/♣/g,'C').replace(/[^\x20-\x7e]/g,'?');}
function pdfText(value){return plain(value).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrap(value,max=94){const words=plain(value).split(/\s+/),out=[];let line='';for(let word of words){if(word.length>max){if(line){out.push(line);line='';}while(word.length>max){out.push(word.slice(0,max));word=word.slice(max);}}if((line+' '+word).trim().length>max){out.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)out.push(line);return out.length?out:[''];}
function pdf(run,events,ev){const pages=[];let commands=[],y=710;
 const op=x=>commands.push(x);
 const text=(x,yy,font,value,bold=false,color='0.10 0.20 0.29')=>op(`BT /${bold?'B':'R'} ${font} Tf ${color} rg ${x} ${yy} Td (${pdfText(value)}) Tj ET`);
 function startPage(){commands=[];op('0.07 0.15 0.24 rg 0 754 595 88 re f');text(42,801,18,'MEMORY OLYMPIAD',true,'1 1 1');text(42,779,10,'SIX MEMORY CHALLENGES / PERSONAL PRACTICE',false,'0.79 0.94 0.86');y=722;
 if(pages.length===0){const m=qrMatrix(verification(run,events)),unit=1.92,left=463,bottom=628;op(`1 1 1 rg ${left-8} ${bottom-8} ${45*unit} ${45*unit} re f`);for(let yy=0;yy<QRSIZE;yy++)for(let xx=0;xx<QRSIZE;xx++)if(m[yy][xx])op(`0 0 0 rg ${(left+xx*unit).toFixed(2)} ${(bottom+(QRSIZE-1-yy)*unit).toFixed(2)} ${unit} ${unit} re f`);}
 }
 function endPage(){text(42,27,8,`Generated on this device | Run ${run.id} | Student-supplied results; not independently verified.`);pages.push(commands.join('\n')+'\n');}
 function ensure(height=25){if(y-height<60){endPage();startPage();}}
 function line(value,opt={}){const {bold=false,size=9,indent=0,tall=17,color}=opt;const bits=wrap(value,size>11?65:94);for(const part of bits){ensure(tall);text(45+indent,y,size,part,bold,color);y-=tall;}}
 function heading(v){ensure(125);y-=10;line(v,{bold:true,size:13,tall:21});op(`0.80 0.86 0.84 RG 43 ${y+5} m 550 ${y+5} l S`);y-=10;}
 startPage();line(`Name: ${run.name||'Not entered'}    Memory trick: ${run.strategy||'Not specified'}`,{bold:true,size:11,tall:22});line(`Completed: ${new Date(run.finishedAt).toLocaleString()}    Run type: ${run.mode==='battery'?'All six challenges':'One challenge'}`,{tall:20});y-=8;
 heading('MY SCORES');
 for(const result of run.results){const event=events.find(e=>e.id===result.id);line(`${event?.title||result.id}: ${result.score} / ${result.max} (${Math.round(result.score/result.max*100)}%)`,{size:11,bold:true,tall:22});}
 const overall=Math.round(run.results.reduce((x,r)=>x+100*r.score/r.max,0)/run.results.length);y-=4;line(`Overall (equal-weighted challenge average): ${overall}%`,{bold:true,size:11,tall:20});
 y-=15;
 heading('CORRECT ANSWERS AND MISTAKES');
 line('Items marked WRONG did not earn a point. The full review is also visible on the website.',{tall:16});y-=5;
 for(const result of run.results){const event=events.find(e=>e.id===result.id),rv=ev.review(result.id,result.data,result.answers);heading(`${event?.title||result.id} - ${result.score}/${result.max}`);line(rv.note,{size:9,tall:15});y-=5;
  for(const row of rv.rows){
    const tag=row.correct?'RIGHT':'WRONG';const label=result.id==='E03'?`Face ${row.face+1}`:(row.pdfLabel||row.label);
    line(`${tag} | ${label}: you: ${row.actual}   /   answer: ${row.expected}`,{size:9,tall:12,indent:5,color:row.correct?'0.16 0.39 0.34':'0.66 0.20 0.24'});
  }
  y-=10;
 }
 endPage();
 // PDF has standard fonts and pages as real vector/text objects, without external libraries.
 const pageCount=pages.length,objects=[null,'<< /Type /Catalog /Pages 2 0 R >>',null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
 const kidRefs=[];
 for(let i=0;i<pageCount;i++){
   const pageRef=5+i*2,contentRef=6+i*2,kid=pageRef+' 0 R';kidRefs.push(kid);
   objects[pageRef]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents ${contentRef} 0 R >>`;
   objects[contentRef]=`<< /Length ${pages[i].length} >>\nstream\n${pages[i]}endstream`;
 }
 objects[2]=`<< /Type /Pages /Kids [${kidRefs.join(' ')}] /Count ${pageCount} >>`;
 let output='%PDF-1.4\n%MemoryOlympiad\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=output.length;output+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
 const xref=output.length;output+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)output+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
 output+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
 const bytes=new Uint8Array(output.length);for(let i=0;i<output.length;i++)bytes[i]=output.charCodeAt(i)&255;
 if(new TextDecoder().decode(bytes.slice(0,8))!=='%PDF-1.4')throw Error('PDF signature failure');return new Blob([bytes],{type:'application/pdf'});
}
window.MemoryExport=Object.freeze({pdf,verification,qrMatrix,qrSvgCard});
})();
