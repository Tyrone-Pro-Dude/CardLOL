// app.js - the screen: buttons, form fields, live preview, PNG/PDF export
const S={tpl:0,side:'front',name:'Your Name',place:'Somewhere Else',dob:'01 OCT 2007',note:FUNNY[0],tag:'lost on purpose',sig:'Your Name',
msg:'If you found me, please return me to my owner. Kindness is rewarded. Snacks are even better.',
bg:'',ac:'',ink:'',pop:'',shape:'',bw:6,bs:'',ph:'',font:'',fx:'none',wob:true,grain:true,tape:true,seed:7,dens:9,z:1,px:0,py:0,img:null,bleed:true,
doods:{star:1,squig:1,flower:1,arrow:1,sparkle:1,heart:0,sun:1,eye:0,spiral:1,cloud:0}};
function setTpl(i){S.tpl=i;const d=TP[i].d;[S.bg,S.ac,S.ink,S.pop]=PAL[d[0]];[S.shape,S.font,S.ph,S.bs]=[d[1],d[2],d[3],d[4]];S.dens=d[5];S.tape=d[5]>0}
setTpl(0);
const sel=(k,a)=>`<select data-k="${k}">${a.map(v=>`<option value="${v[0]}">${v[1]}</option>`).join('')}</select>`;
const tin=(k,l,m)=>`<label>${l}</label><input type="text" maxlength="${m||28}" data-k="${k}">`;
const rg=(k,l,a,b,st)=>`<label>${l}</label><input type="range" data-k="${k}" min="${a}" max="${b}" step="${st||1}">`;
const ck=(k,l)=>`<label class="ck"><input type="checkbox" data-k="${k}">${l}</label>`;
$('#panel').innerHTML=`<div class="sec"><h3>1. Template</h3><div id="tpls"></div></div>
<div class="sec"><h3>2. Your details</h3><div class="g2"><div>${tin('name','Display name')}</div><div>${tin('place','From')}</div><div>${tin('dob','Born')}</div><div>${tin('sig','Signature')}</div></div>
<label>Funny text box (front + back)</label><textarea data-k="note" rows="2" maxlength="70"></textarea><div id="fn" class="row" style="margin-top:8px"></div>
${tin('tag','Funny title (handwritten line)')}</div>
<div class="sec"><h3>3. Back of card</h3><label>Message</label><textarea data-k="msg" rows="3" maxlength="140"></textarea><p class="hint">Tap "Back" above the card to preview it. The QR code is a placeholder for now.</p></div>
<div class="sec"><h3>4. Colour</h3><div id="sw"></div><div class="g4" style="margin-top:12px"><div><label>Paper</label><input type="color" data-k="bg"></div><div><label>Accent</label><input type="color" data-k="ac"></div><div><label>Ink</label><input type="color" data-k="ink"></div><div><label>Pop</label><input type="color" data-k="pop"></div></div></div>
<div class="sec"><h3>5. Photo</h3><input type="file" id="file" accept="image/*"><div class="g2"><div><label>Frame shape</label>${sel('ph',[['blob','Blob'],['circle','Circle'],['arch','Arch'],['flower','Flower'],['squircle','Squircle'],['rect','Rectangle']])}</div><div><label>Filter</label>${sel('fx',[['none','Original'],['bw','Black & white'],['sepia','Sepia'],['punchy','Punchy']])}</div></div>${rg('z','Zoom',1,3,.05)}${rg('px','Move left / right',-120,120)}${rg('py','Move up / down',-120,120)}<div class="row"><button id="noimg">Remove photo</button></div>${ck('tape','Tape on the photo')}</div>
<div class="sec"><h3>6. Border &amp; type</h3><div class="g2"><div><label>Border shape</label>${sel('shape',[['scallop','Stamp edge'],['rect','Square'],['round','Rounded'],['notch','Ticket'],['cut','Cut corners'],['wave','Wavy']])}</div><div><label>Border line</label>${sel('bs',[['double','Double'],['solid','Solid'],['dashed','Dashed'],['dotted','Dotted'],['none','None']])}</div></div>${rg('bw','Border thickness',2,14)}<label>Title font</label>${sel('font',[['Shrikhand','Shrikhand'],['Permanent Marker','Marker'],['DM Serif Display','Serif'],['Space Mono','Mono'],['Caveat','Handwritten']])}${ck('wob','Hand-drawn wobble')}${ck('grain','Paper grain')}</div>
<div class="sec"><h3>7. Doodles</h3><div id="ch"></div>${rg('dens','How many',0,16)}<div class="row"><button id="shuf">Shuffle doodles</button></div></div>`;
$('#tpls').innerHTML=TP.map((t,i)=>`<button data-t="${i}"><svg viewBox="0 0 ${W} ${H}"></svg>${t.n}</button>`).join('');
$('#fn').innerHTML=FUNNY.map((t,i)=>`<button class="chip" data-f="${i}">${t}</button>`).join('');
$('#sw').innerHTML=PAL.map((p,i)=>`<button class="sw" data-p="${i}" style="background:linear-gradient(90deg,${p[0]} 25%,${p[1]} 25% 50%,${p[2]} 50% 75%,${p[3]} 75%)"></button>`).join('');
$('#ch').innerHTML=Object.keys(S.doods).map(k=>`<button class="chip" data-d="${k}">${k}</button>`).join('');
let raf=0;
function sync(){document.querySelectorAll('[data-k]').forEach(e=>{const v=S[e.dataset.k];e.type=='checkbox'?e.checked=!!v:e.value=v});
document.querySelectorAll('[data-d]').forEach(e=>e.classList.toggle('on',!!S.doods[e.dataset.d]));document.querySelectorAll('[data-t]').forEach(e=>e.classList.toggle('on',+e.dataset.t==S.tpl));
$('#sf').classList.toggle('on',S.side=='front');$('#sb').classList.toggle('on',S.side=='back')}
function draw(){$('#stage').innerHTML=render(S,'m',{side:S.side}).svg;cancelAnimationFrame(raf);
raf=requestAnimationFrame(()=>document.querySelectorAll('#tpls svg').forEach((el,i)=>{el.innerHTML=render({...S,tpl:i,img:null,...Object.fromEntries([['bg','ac','ink','pop'].map((k,j)=>[k,PAL[TP[i].d[0]][j]])].flat()),shape:TP[i].d[1],font:TP[i].d[2],ph:TP[i].d[3],bs:TP[i].d[4],dens:TP[i].d[5]},'t'+i,{thumb:true}).svg.replace(/^<svg[^>]*>|<\/svg>$/g,'')}))}
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;const t=e.target;S[k]=t.type=='checkbox'?t.checked:t.type=='range'?+t.value:t.value;draw()});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
if(b.dataset.t!=null)setTpl(+b.dataset.t);if(b.dataset.p!=null)[S.bg,S.ac,S.ink,S.pop]=PAL[b.dataset.p];
if(b.dataset.d)S.doods[b.dataset.d]=S.doods[b.dataset.d]?0:1;if(b.dataset.f!=null)S.note=FUNNY[b.dataset.f];
if(b.id=='shuf')S.seed++;if(b.id=='noimg'){S.img=null;S.z=1;S.px=S.py=0}if(b.id=='sf')S.side='front';if(b.id=='sb')S.side='back';sync();draw()});
$('#file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f),im=new Image();
im.onload=()=>{const m=1400,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);S.img=c.toDataURL('image/jpeg',.9);URL.revokeObjectURL(u);S.z=1;S.px=S.py=0;sync();draw()};im.src=u});
const pick=a=>a[Math.floor(Math.random()*a.length)];
$('#rnd').onclick=()=>{setTpl(Math.floor(Math.random()*TP.length));[S.bg,S.ac,S.ink,S.pop]=pick(PAL);S.shape=pick(['scallop','rect','round','notch','cut','wave']);S.ph=pick(['blob','circle','arch','flower','squircle','rect']);S.bs=pick(['double','solid','dashed']);S.note=pick(FUNNY);S.seed=Math.floor(Math.random()*999);Object.keys(S.doods).forEach(k=>S.doods[k]=Math.random()>.4?1:0);sync();draw()};
const msg=t=>{$('#msg').textContent=t;setTimeout(()=>$('#msg').textContent='',5000)};
// ---------- EXPORT: 300 DPI. Card = 85.6 x 53.98 mm. Print-ready adds 3 mm bleed on every side.
const CARD=[85.6,53.98],BLEED=3,PXMM=300/25.4;
async function makeCanvas(side,print){
const r=render(S,'e',{exp:true,print,side}),bl=print?BLEED:0,cw=Math.round((CARD[0]+2*bl)*PXMM),ch=Math.round((CARD[1]+2*bl)*PXMM);
const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(r.svg.replace('<svg ',`<svg width="${cw}" height="${ch}" preserveAspectRatio="none" `))});
const c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d');x.drawImage(im,0,0,cw,ch);
await Promise.all([...new Set(r.tx.map(t=>t.f))].map(f=>document.fonts.load(`700 20px "${f}"`)));
const v=r.vb,sx=cw/v[2],sy=ch/v[3],k=print?.9:1;
r.tx.forEach(t=>{const X=print?(t.x-320)*k+320:t.x,Y=print?(t.y-200)*k+200:t.y;x.save();x.translate((X-v[0])*sx,(Y-v[1])*sy);if(t.r)x.rotate(t.r*Math.PI/180);
x.font=`${t.w||400} ${t.z*k*sx}px "${t.f}"`;x.fillStyle=t.c;x.textAlign=t.a=='middle'?'center':t.a=='end'?'right':'left';if('letterSpacing'in x)x.letterSpacing=(t.ls||0)*k*sx+'px';x.fillText(t.t,0,0);x.restore()});
return c}
const save=(b,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};
$('#png').onclick=async()=>{try{msg('Making your PNGs...');for(const sd of ['front','back']){const c=await makeCanvas(sd,S.bleed);save(await new Promise(ok=>c.toBlob(ok,'image/png')),`lostfound-${sd}.png`);await new Promise(r=>setTimeout(r,400))}msg('Done! Check your Downloads folder (2 files).')}catch(e){msg('Could not export. Try Chrome or Edge.')}};
$('#pdf').onclick=async()=>{if(!window.jspdf)return msg('PDF tool did not load. Check your internet connection and refresh.');
try{msg('Making your PDF...');const bl=S.bleed?BLEED:0,w=CARD[0]+2*bl,h=CARD[1]+2*bl,pdf=new window.jspdf.jsPDF({orientation:'landscape',unit:'mm',format:[w,h]});
for(const [n,sd] of ['front','back'].entries()){if(n)pdf.addPage([w,h],'landscape');pdf.addImage((await makeCanvas(sd,S.bleed)).toDataURL('image/png'),'PNG',0,0,w,h)}
pdf.save('lostfound-card.pdf');msg(S.bleed?`PDF saved: ${w.toFixed(1)} x ${h.toFixed(1)} mm (card + 3 mm bleed), page 1 front, page 2 back.`:'PDF saved at exact card size.')}catch(e){msg('Could not export PDF.')}};
sync();draw();
