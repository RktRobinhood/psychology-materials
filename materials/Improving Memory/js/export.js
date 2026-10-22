/* Real one-page PDF, embedded QR, and QR image. Works without internet. */
(function(){'use strict';
function fnv(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0').toUpperCase()}
function verification(state,events){const b=events.map(e=>state.scores.before[e.id]?.score??'-').join('.'),a=events.map(e=>state.scores.after[e.id]?.score??'-').join('.');const content=`MO4|B:${b}|A:${a}`;return `${content}|H:${fnv(state.student+'|'+state.group+'|'+state.technique+'|'+content)}`}
const SIZE=37,DATA_CODEWORDS=108,ECC_CODEWORDS=26;
function gfMultiply(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z}
function rsDivisor(degree){const result=new Array(degree).fill(0);result[degree-1]=1;let root=1;for(let i=0;i<degree;i++){for(let j=0;j<degree;j++){result[j]=gfMultiply(result[j],root);if(j+1<degree)result[j]^=result[j+1]}root=gfMultiply(root,2)}return result}
function rsRemainder(data,divisor){const out=new Array(divisor.length).fill(0);for(const b of data){const factor=b^out.shift();out.push(0);for(let j=0;j<divisor.length;j++)out[j]^=gfMultiply(divisor[j],factor)}return out}
function toDataBytes(text){const bytes=new TextEncoder().encode(text);if(bytes.length>106)throw new Error('Verification code too long for QR capacity');const bits=[];const append=(n,count)=>{for(let i=count-1;i>=0;i--)bits.push((n>>>i)&1)};append(4,4);append(bytes.length,8);for(const b of bytes)append(b,8);const capacity=DATA_CODEWORDS*8;append(0,Math.min(4,capacity-bits.length));while(bits.length%8)bits.push(0);const out=[];for(let i=0;i<bits.length;i+=8)out.push(bits.slice(i,i+8).reduce((v,b)=>v*2+b,0));for(let i=out.length;i<DATA_CODEWORDS;i++)out.push(i%2?0x11:0xEC);return out}
function qrMatrix(text){const data=toDataBytes(text);const ecc=rsRemainder(data,rsDivisor(ECC_CODEWORDS));const bytes=[...data,...ecc],bitstream=bytes.flatMap(b=>Array.from({length:8},(_,i)=>(b>>>(7-i))&1));
 const grid=Array.from({length:SIZE},()=>Array(SIZE).fill(-1));const reserved=Array.from({length:SIZE},()=>Array(SIZE).fill(false));
 function put(x,y,v){if(x>=0&&x<SIZE&&y>=0&&y<SIZE){grid[y][x]=v?1:0;reserved[y][x]=true}}
 function finder(cx,cy){for(let dy=-1;dy<=7;dy++)for(let dx=-1;dx<=7;dx++){let d=Math.max(Math.abs(dx-3),Math.abs(dy-3));put(cx+dx,cy+dy,d!==2&&d!==4&&dx>=0&&dx<=6&&dy>=0&&dy<=6)}}
 finder(0,0);finder(SIZE-7,0);finder(0,SIZE-7);
 for(let i=8;i<SIZE-8;i++){put(6,i,i%2===0);put(i,6,i%2===0)}
 // One non-overlapping alignment pattern at (30,30) for version 5.
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)put(30+dx,30+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);
 // Level L = 01; mask 0 = 000; BCH(15,5) formatting.
 let d=(1<<3)|0,r=d;for(let i=0;i<10;i++)r=(r<<1)^(((r>>>9)&1)*0x537);const format=((d<<10)|r)^0x5412;
 const bit=i=>(format>>>i)&1;
 for(let i=0;i<=5;i++)put(8,i,bit(i));put(8,7,bit(6));put(8,8,bit(7));put(7,8,bit(8));for(let i=9;i<15;i++)put(14-i,8,bit(i));
 for(let i=0;i<8;i++)put(SIZE-1-i,8,bit(i));for(let i=8;i<15;i++)put(8,SIZE-15+i,bit(i));put(8,SIZE-8,1);
 let k=0;for(let right=SIZE-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<SIZE;vert++){const y=((right+1)&2)===0?SIZE-1-vert:vert;for(let j=0;j<2;j++){const x=right-j;if(!reserved[y][x]){const raw=k<bitstream.length?bitstream[k]:0;grid[y][x]=raw^(((x+y)%2===0)?1:0);k++}}}}
 if(k<bitstream.length)throw new Error(`QR data overflow: ${k}/${bitstream.length}`);
 return grid;
}
function qrSvg(code,withCard=true){const grid=qrMatrix(code),q=4,module=5;let paths='';for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(grid[y][x])paths+=`M${(x+q)*module} ${(y+q)*module}h${module}v${module}h-${module}z`;
 const qrSize=(SIZE+2*q)*module;if(!withCard)return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qrSize} ${qrSize}"><rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="${paths}"/></svg>`;
 const width=640,height=372;const qrX=24,qrY=82;return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" rx="13" fill="#ffffff"/><rect x="0" y="0" width="${width}" height="59" fill="#152b42"/><text x="24" y="39" fill="#f1fcff" font-family="Arial" font-weight="bold" font-size="26">RECALL LAB · VERIFICATION CARD</text><g transform="translate(${qrX},${qrY})"><rect width="${qrSize}" height="${qrSize}" fill="#fff"/><path d="${paths}" fill="#000"/></g><text x="270" y="118" fill="#19354d" font-family="Arial" font-size="15" font-weight="bold">Memory Olympiad / v2</text><text x="270" y="150" fill="#19354d" font-family="Arial" font-size="20">${escapeXml(code.split('|')[1]||'')}</text><text x="270" y="183" fill="#445b68" font-family="Arial" font-size="14">Individual score record</text><text x="270" y="209" fill="#445b68" font-family="Arial" font-size="12">Scan or copy the code below.</text><text x="270" y="235" fill="#9a4d4d" font-family="Arial" font-size="12">Not a secure digital signature.</text><text x="24" y="346" fill="#263c51" font-family="monospace" font-size="13">${escapeXml(code)}</text></svg>`}

function pdfPlain(value){return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/æ/g,'ae').replace(/Æ/g,'AE').replace(/ø/g,'oe').replace(/Ø/g,'OE').replace(/å/g,'aa').replace(/Å/g,'AA').replace(/[^\x20-\x7e]/g,'?')}
function escapePDF(value){return pdfPlain(value).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function pdf(state,events){const op=[];const put=(x,y,size,t,bold=false,color='0.09 0.18 0.25')=>op.push(`BT /${bold?'B':'R'} ${size} Tf ${color} rg ${x} ${y} Td (${escapePDF(t)}) Tj ET`);
 op.push('0.07 0.16 0.24 rg 0 731 595 111 re f');
 put(45,786,23,'MEMORY OLYMPIAD',true,'1 1 1');put(45,759,12,'SIX MEMORY CHALLENGES | MY RESULTS',false,'0.78 0.95 0.83');
 put(46,702,15,`Student: ${state.student}`,true);
 put(46,682,10,`Class / group: ${state.group||'Not entered'}`);put(46,666,10,`Memory trick: ${state.technique||'Not entered'}`);
 put(46,632,10,'CHALLENGE',true);put(360,632,10,'FIRST',true);put(426,632,10,'AFTER',true);put(500,632,10,'CHANGE',true);
 op.push('0.73 0.81 0.78 RG 45 620 m 550 620 l S');
 let yy=594;for(const e of events){const b=state.scores.before[e.id]?.score,a=state.scores.after[e.id]?.score,complete=Number.isInteger(b)&&Number.isInteger(a),delta=complete?a-b:null;put(46,yy,11,`${e.title} (out of ${e.max})`);put(360,yy,11,Number.isInteger(b)?b:'--');put(426,yy,11,Number.isInteger(a)?a:'--');put(500,yy,11,complete?`${delta>0?'+':''}${delta}`:'--',true);yy-=34;op.push(`0.90 0.93 0.90 RG 45 ${yy+18} m 550 ${yy+18} l S`)}
 const bs=events.every(e=>Number.isInteger(state.scores.before[e.id]?.score))?100*events.reduce((s,e)=>s+state.scores.before[e.id].score/e.max,0)/events.length:null;
 const as=events.every(e=>Number.isInteger(state.scores.after[e.id]?.score))?100*events.reduce((s,e)=>s+state.scores.after[e.id].score/e.max,0)/events.length:null;
 if(bs!==null&&as!==null){put(46,340,12,`Overall change: ${(as-bs>=0?'+':'')+(as-bs).toFixed(1)} percentage points`,true)}
 put(46,311,10,`First finished: ${state.finishedAt.before?.slice(0,16).replace('T',' ')||'Not done'}`);
 put(46,296,10,`After finished: ${state.finishedAt.after?.slice(0,16).replace('T',' ')||'Not done'}`);
 op.push('0.85 0.92 0.86 rg 40 70 515 188 re f');put(52,232,12,'WHAT TO DO NEXT',true);put(52,209,10,'Send this PDF (or your downloaded CSV) to your teacher.');put(52,191,9,'Your results stay in your browser until you send them.');
 put(52,136,9,'Each game has a different maximum score.');put(52,121,9,'A gain of +3 points in one game is not the same');put(52,106,9,'as +3 points in another.');
 const grid=qrMatrix(verification(state,events)),unit=2.35,qx=410,qy=85;op.push(`1 1 1 rg ${qx-9.4} ${qy-9.4} ${45*unit} ${45*unit} re f`);grid.forEach((row,y)=>row.forEach((v,x)=>{if(v)op.push(`0 0 0 rg ${(qx+x*unit).toFixed(2)} ${(qy+(36-y)*unit).toFixed(2)} ${unit} ${unit} re f`)}));
 put(46,46,8,`Generated ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC | Unverified, student-supplied results.`);
 const content=op.join('\n')+'\n';
 const objs=['','<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [5 0 R] /Count 1 >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents 6 0 R >>',`<< /Length ${content.length} >>\nstream\n${content}endstream`];
 let out='%PDF-1.4\n',offset=[0];for(let i=1;i<objs.length;i++){offset[i]=out.length;out+=`${i} 0 obj\n${objs[i]}\nendobj\n`}const startXref=out.length;
 out+=`xref\n0 ${objs.length}\n0000000000 65535 f \n`;for(let i=1;i<objs.length;i++)out+=String(offset[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
 const bytes=new Uint8Array(out.length);for(let i=0;i<out.length;i++)bytes[i]=out.charCodeAt(i)&255;if(new TextDecoder().decode(bytes.slice(0,8))!=='%PDF-1.4')throw Error('Invalid PDF');return new Blob([bytes],{type:'application/pdf'});
}
function qrSvgCard(state,events){const code=verification(state,events),grid=qrMatrix(code),q=4;let p='';for(let y=0;y<37;y++)for(let x=0;x<37;x++)if(grid[y][x])p+=`M${x+q} ${y+q}h1v1h-1z`;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 60" width="490" height="600"><rect width="49" height="60" fill="white"/><path fill="black" d="${p}"/><text x="3" y="48" fill="black" font-family="Arial" font-size="2.3">MEMORY OLYMPIAD</text><text x="3" y="51" fill="black" font-family="Arial" font-size="1.7">${verification(state,events)}</text><text x="3" y="55" fill="black" font-family="Arial" font-size="1.8">Keep your original CSV/PDF too.</text></svg>`}
window.MemoryExport=Object.freeze({pdf,verification,qrSvgCard,qrMatrix});
})();
