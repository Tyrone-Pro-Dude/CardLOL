// render.js - the card drawing engine (colours, shapes, doodles, 10 templates, front + back)
const W=640,H=400,$=q=>document.querySelector(q);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const PAL=[['#f4e3c1','#e8504a','#1d1a2b','#7bd3c6'],['#fff4d6','#2f6bff','#10143a','#ffc83d'],['#1c1b2e','#ff7ab6','#f7efe2','#4be0b4'],['#e6f0d4','#2e7d4f','#17301f','#f4a259'],['#f9d9e0','#c2185b','#2b0a1a','#ffe066'],['#dfe7f5','#5b3df5','#14123a','#ff8a5c'],['#f2ece0','#111111','#111111','#ff5a36'],['#2b2118','#e9b44c','#f4e6cf','#c8553d']];
const DD={star:(c,i)=>`<path d="M0-18L5-6 18-6 8 3 12 16 0 8-12 16-8 3-18-6-5-6Z"/>`,
squig:()=>`<path fill="none" d="M-24 0q6-14 12 0t12 0 12 0 12 0"/>`,
flower:(c,i)=>[0,1,2,3,4].map(k=>`<circle cx="${(9*Math.cos(k*1.2566)).toFixed(1)}" cy="${(9*Math.sin(k*1.2566)).toFixed(1)}" r="7"/>`).join('')+`<circle r="4" fill="${i}"/>`,
arrow:()=>`<path fill="none" d="M-24 8Q-6-16 18 0M18 0L8-8M18 0L9 10"/>`,
sparkle:()=>`<path d="M0-17Q2-2 17 0 2 2 0 17-2 2-17 0-2-2 0-17Z"/>`,
heart:()=>`<path d="M0 14C-26-6-10-24 0-8 10-24 26-6 0 14Z"/>`,
sun:()=>`<circle r="8"/><path fill="none" d="M0-13V-20M0 13V20M-13 0H-20M13 0H20M9-9l5-5M-9 9l-5 5M9 9l5 5M-9-9l-5-5"/>`,
eye:(c,i)=>`<path fill="#fff" d="M-19 0Q0-17 19 0 0 17-19 0Z"/><circle r="6" fill="${i}"/>`,
spiral:()=>`<path fill="none" d="M0 0C3-2 5 2 2 4-3 7-8 0-4-6 1-12 11-6 8 3 4 13-10 12-13 2"/>`,
cloud:()=>`<path d="M-18 9Q-26-4-12-6-10-19 3-14 15-18 16-5 27-1 19 9Z"/>`};
const SL=[[596,34],[604,200],[570,366],[330,386],[40,372],[22,200],[330,18],[500,22],[130,384],[612,110],[22,70],[440,388],[250,386],[600,290]];
const FX={none:'',bw:'<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.2" intercept="-.08"/><feFuncG type="linear" slope="1.2" intercept="-.08"/><feFuncB type="linear" slope="1.2" intercept="-.08"/></feComponentTransfer>',sepia:'<feColorMatrix values=".39 .77 .19 0 0 .35 .69 .17 0 0 .27 .53 .13 0 0 0 0 0 1 0"/>',punchy:'<feColorMatrix type="saturate" values="1.9"/><feComponentTransfer><feFuncR type="linear" slope="1.25" intercept="-.12"/><feFuncG type="linear" slope="1.25" intercept="-.12"/><feFuncB type="linear" slope="1.25" intercept="-.12"/></feComponentTransfer>'};
function PATH(k,i){const a=i,b=W-i,c=i,d=H-i,f=n=>n.toFixed(1);
if(k=='rect')return`M${a} ${c}H${b}V${d}H${a}Z`;
if(k=='round'){const r=36;return`M${a+r} ${c}H${b-r}A${r} ${r} 0 0 1 ${b} ${c+r}V${d-r}A${r} ${r} 0 0 1 ${b-r} ${d}H${a+r}A${r} ${r} 0 0 1 ${a} ${d-r}V${c+r}A${r} ${r} 0 0 1 ${a+r} ${c}Z`}
if(k=='cut'){const r=32;return`M${a+r} ${c}H${b-r}L${b} ${c+r}V${d-r}L${b-r} ${d}H${a+r}L${a} ${d-r}V${c+r}Z`}
if(k=='notch')return`M${a} ${c}H${b}V${H/2-20}A20 20 0 0 0 ${b} ${H/2+20}V${d}H${a}V${H/2+20}A20 20 0 0 0 ${a} ${H/2-20}Z`;
if(k=='scallop'){const nx=Math.round((b-a)/26),ny=Math.round((d-c)/26),rx=(b-a)/nx/2,ry=(d-c)/ny/2;let s=`M${a} ${c}`;
for(let j=1;j<=nx;j++)s+=`A${f(rx)} ${f(rx)} 0 0 0 ${f(a+j*rx*2)} ${c}`;for(let j=1;j<=ny;j++)s+=`A${f(ry)} ${f(ry)} 0 0 0 ${b} ${f(c+j*ry*2)}`;
for(let j=1;j<=nx;j++)s+=`A${f(rx)} ${f(rx)} 0 0 0 ${f(b-j*rx*2)} ${d}`;for(let j=1;j<=ny;j++)s+=`A${f(ry)} ${f(ry)} 0 0 0 ${a} ${f(d-j*ry*2)}`;return s+'Z'}
const p=[],A=4,q=.09;for(let x=a;x<=b;x+=4)p.push([x,c+A*Math.sin(x*q)]);for(let y=c;y<=d;y+=4)p.push([b+A*Math.sin(y*q),y]);for(let x=b;x>=a;x-=4)p.push([x,d+A*Math.sin(x*q)]);for(let y=d;y>=c;y-=4)p.push([a+A*Math.sin(y*q),y]);
return'M'+p.map(t=>f(t[0])+' '+f(t[1])).join('L')+'Z'}
function PS(k,w,h){if(k=='circle')return`M0 ${h/2}A${w/2} ${h/2} 0 1 0 ${w} ${h/2}A${w/2} ${h/2} 0 1 0 0 ${h/2}Z`;
if(k=='rect')return`M0 0H${w}V${h}H0Z`;if(k=='arch')return`M0 ${h}V${w/2}A${w/2} ${w/2} 0 0 1 ${w} ${w/2}V${h}Z`;
if(k=='squircle'){const r=Math.min(w,h)*.3;return`M${r} 0H${w-r}A${r} ${r} 0 0 1 ${w} ${r}V${h-r}A${r} ${r} 0 0 1 ${w-r} ${h}H${r}A${r} ${r} 0 0 1 0 ${h-r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`}
if(k=='flower'){let s=[];for(let t=0;t<120;t++){const g=t/120*6.2832,r=(1+.07*Math.cos(14*g))/1.07;s.push((w/2+w/2*r*Math.cos(g)).toFixed(1)+' '+(h/2+h/2*r*Math.sin(g)).toFixed(1))}return'M'+s.join('L')+'Z'}
return`M${.5*w} 0C${.85*w} ${-.02*h} ${1.02*w} ${.3*h} ${.98*w} ${.55*h}C${.95*w} ${.9*h} ${.65*w} ${1.02*h} ${.4*w} ${h}C${.1*w} ${.98*h} ${-.03*w} ${.7*h} ${.02*w} ${.4*h}C${.05*w} ${.12*h} ${.2*w} ${.02*h} ${.5*w} 0Z`}
function face(w,h,s){return`<rect width="${w}" height="${h}" fill="${s.pop}"/><path d="M${w*.2} ${h}Q${w/2} ${h*.62} ${w*.8} ${h}Z" fill="${s.ac}" stroke="${s.ink}" stroke-width="4"/><circle cx="${w/2}" cy="${h*.42}" r="${w*.26}" fill="#f1c9a5" stroke="${s.ink}" stroke-width="4"/><path d="M${w*.24} ${h*.4}Q${w*.3} ${h*.12} ${w/2} ${h*.14}Q${w*.72} ${h*.12} ${w*.76} ${h*.4}Q${w*.66} ${h*.26} ${w/2} ${h*.27}Q${w*.34} ${h*.26} ${w*.24} ${h*.4}Z" fill="${s.ink}"/><circle cx="${w*.42}" cy="${h*.44}" r="4" fill="${s.ink}"/><circle cx="${w*.58}" cy="${h*.44}" r="4" fill="${s.ink}"/><path d="M${w*.42} ${h*.52}Q${w/2} ${h*.58} ${w*.58} ${h*.52}" fill="none" stroke="${s.ink}" stroke-width="3" stroke-linecap="round"/>`}

// ===== 10 TEMPLATES. d = [palette#, border shape, font, photo shape, border line, doodle count]
const TP=[
{n:'Retro passport',band:'top',title:'PASSPORT',sub:'VALID EVERYWHERE',ph:[38,100,176,200],tx:244,ty:100,pat:'none',ex:'mrz',pr:0,d:[0,'scallop','Shrikhand','blob','double',8]},
{n:'Boarding pass',band:'left',title:'BOARDING PASS',sub:'',ph:[116,86,150,190],tx:292,ty:80,pat:'stripes',ex:'bars',pr:0,d:[5,'notch','DM Serif Display','rect','solid',5]},
{n:'Sticker club',band:'blob',title:'THE LOST CLUB',sub:'MEMBER SINCE ALWAYS',ph:[44,66,220,250],tx:290,ty:130,pat:'dots',ex:'stamp',pr:-3,nw:210,d:[3,'wave','Shrikhand','blob','dashed',10]},
{n:'Library card',band:'bottom',title:'LIBRARY CARD',sub:'RETURN BY NEVER',ph:[430,70,166,200],tx:40,ty:80,pat:'lines',ex:'none',pr:0,d:[7,'rect','DM Serif Display','rect','solid',6]},
{n:'Press pass',band:'top2',title:'PRESS',sub:'ACCESS ALL AREAS',ph:[40,134,160,196],tx:226,ty:140,pat:'grid',ex:'slot',pr:0,d:[6,'cut','Permanent Marker','rect','solid',6]},
{n:'Zine wanted',band:'none',title:'WANTED: YOU',sub:'REWARD: ONE GOOD STORY',ph:[372,84,210,240],tx:34,ty:142,pat:'dots',ex:'none',pr:4,d:[0,'wave','Permanent Marker','rect','solid',8]},
{n:'Funny college ID',band:'top',title:'COLLEGE ID',sub:'DEPT. OF PROCRASTINATION',ph:[40,92,170,210],tx:232,ty:100,pat:'lines',ex:'none',pr:0,d:[1,'round','DM Serif Display','squircle','solid',8]},
{n:'Gamer card',band:'top2',title:'PLAYER ONE',sub:'PRESS START TO RETURN',ph:[40,134,160,196],tx:226,ty:142,pat:'grid',ex:'none',pr:0,d:[2,'cut','Space Mono','rect','solid',9]},
{n:'Minimalist',band:'min',title:'LOST & FOUND',sub:'RETURN TO OWNER',ph:[40,76,150,200],tx:214,ty:76,pat:'none',ex:'none',pr:0,d:[6,'rect','Space Mono','rect','none',0]},
{n:'Meme card',band:'bottom',title:'HEAD EMPTY',sub:'NO THOUGHTS',ph:[40,60,210,230],tx:270,ty:70,pat:'dots',ex:'none',pr:-3,d:[4,'wave','Shrikhand','flower','dashed',12]}];
// Ready-made funny lines the customer can click (they can also type their own)
const FUNNY=['Reward: a free chai and eternal gratitude.','If found, please feed me snacks.','Not lost, just exploring.','Warning: contains 3am thoughts.','Return me, I have the notes.','Property of a very tired student.','Finder gets unlimited good vibes.','Please do not read my search history.'];
const wrap=(t,n)=>{const o=[];let c='';for(const w of String(t).split(/\s+/).filter(Boolean)){if(c&&(c+' '+w).length>n){o.push(c);c=w}else c=c?c+' '+w:w}if(c)o.push(c);return o};
// pick the biggest text size where everything fits in maxL lines (so nothing is ever cut off)
const para=(t,w,sz,maxL)=>{let r;for(const z of sz){r={z,l:wrap(t,Math.floor(w/(z*.62)))};if(r.l.length<=maxL)break}return r};

function render(s,p,o={}){
const tp=TP[s.tpl],R=rng(s.seed),B=rng(77),tx=[],bk=o.side=='back',pr=!!o.print,rf=s.wob&&!o.thumb?` filter="url(#${p}r)"`:'';
const M='Space Mono',D=s.font,X0='x="-200" y="-200" width="1040" height="800"';
// T = draw text. mw = max width: text auto-shrinks to fit, so it never gets cut off.
const T=(t,x,y,z,f,c,q={})=>{t=String(t);if(q.mw)z=Math.max(9,Math.min(z,(q.mw/Math.max(t.length,1)-(q.ls||0))/(f=='Caveat'?.46:.62)));tx.push({t,x,y,z,f,c,...q});return o.exp?'':`<text x="${x}" y="${y}" font-size="${z.toFixed(1)}" font-family="'${f}',sans-serif" fill="${c}"${q.a?` text-anchor="${q.a}"`:''}${q.w?` font-weight="${q.w}"`:''}${q.ls?` letter-spacing="${q.ls}"`:''}${q.r?` transform="rotate(${q.r} ${x} ${y})"`:''}>${esc(t)}</text>`};
const pt={dots:`<circle cx="7" cy="7" r="1.7" fill="${s.ink}" opacity=".18"/>`,stripes:`<path d="M-2 16L16-2" stroke="${s.ink}" stroke-width="3" opacity=".08"/>`,lines:`<path d="M0 13.5H14" stroke="${s.ink}" opacity=".14"/>`,grid:`<path d="M0 13.5H14M13.5 0V14" stroke="${s.ink}" opacity=".1"/>`,none:''}[tp.pat];
const defs=`<clipPath id="${p}c"><path d="${PATH(s.shape,0)}"/></clipPath><pattern id="${p}p" width="14" height="14" patternUnits="userSpaceOnUse">${pt}</pattern><filter id="${p}r" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence baseFrequency=".035" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter><filter id="${p}f">${FX[s.fx]||'<feOffset/>'}</filter><filter id="${p}g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 .1 0 0 0 0 .08 0 0 0 0 .1 0 0 0 .6 -.14"/></filter>`;
const doodles=n=>{let dg='';const on=Object.keys(s.doods).filter(k=>s.doods[k]);
if(on.length&&n>0){const sl=SL.map(v=>[v,R()]).sort((a,c)=>a[1]-c[1]).map(v=>v[0]),cl=[s.ac,s.pop,s.ink,s.bg];
for(let i=0;i<n;i++){const v=sl[i%sl.length],k=on[Math.floor(R()*on.length)],c=cl[Math.floor(R()*4)],x=v[0]+(R()-.5)*22,y=v[1]+(R()-.5)*16;
dg+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(R()*70-35).toFixed(0)}) scale(${(1+R()*.7).toFixed(2)})" fill="${c}" stroke="${s.ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${DD[k](c,s.ink)}</g>`}}
return`<g${rf}>${dg}</g>`};
let i='';
if(bk){ // ---------- BACK OF CARD
i+=`<rect x="-200" y="-200" width="1040" height="264" fill="${s.ac}"/>`+T('IF FOUND',40,44,30,D,s.bg,{mw:300})+T('PLEASE READ ME',600,40,12,M,s.bg,{a:'end',ls:2,w:700,mw:260});
i+=doodles(Math.round(s.dens/2));
const P=para(s.msg,340,[20,17,15,13],5);P.l.forEach((l,n)=>i+=T(l,40,108+n*P.z*1.35,P.z,M,s.ink,{w:700}));
i+=T('THIS BELONGS TO',40,262,11,M,s.ac,{ls:3,w:700})+T(s.name,40,296,36,D,s.ink,{mw:340});
if(s.note.trim()){const N=para(s.note,340,[15,13,12],2);N.l.forEach((l,n)=>i+=T(l,40,324+n*17,N.z,'Permanent Marker',s.ac))}
// QR PLACEHOLDER: replace with a real QR code in Phase 4
let g='',m=160/25;const zone=(a,b)=>(a<8&&b<8)||(a>16&&b<8)||(a<8&&b>16);
for(let a=0;a<25;a++)for(let b=0;b<25;b++){let on;if(zone(a,b)){const u=a>16?a-18:a,v=b>16?b-18:b;on=u>=0&&u<7&&v>=0&&v<7&&(u%6==0||v%6==0||(u>1&&u<5&&v>1&&v<5))}else on=B()>.5;if(on)g+=`<rect x="${(b*m).toFixed(1)}" y="${(a*m).toFixed(1)}" width="${(m+.4).toFixed(1)}" height="${(m+.4).toFixed(1)}"/>`}
i+=`<g transform="translate(430 96)"><rect x="-10" y="-10" width="180" height="180" fill="#fff" stroke="${s.ink}" stroke-width="4"/><g fill="${s.ink}">${g}</g></g>`;
i+=T('SCAN ME IF FOUND',520,292,13,M,s.ac,{a:'middle',w:700,mw:190})+T('QR placeholder - yourdomain.com/found/...',520,310,10,M,s.ink,{a:'middle',mw:190});
}else{ // ---------- FRONT OF CARD
const b=tp.band;
if(b=='top')i+=`<rect x="-200" y="-200" width="1040" height="264" fill="${s.ac}"/>`+T(tp.title,40,44,30,D,s.bg,{mw:330})+T(tp.sub,600,40,12,M,s.bg,{a:'end',ls:2,w:700,mw:250});
if(b=='top2')i+=`<rect x="-200" y="-200" width="1040" height="312" fill="${s.ac}"/>`+T(tp.title,40,92,70,D,s.bg,{mw:340})+T(tp.sub,600,96,12,M,s.bg,{a:'end',ls:2,w:700,mw:230});
if(b=='left')i+=`<rect x="-200" y="-200" width="284" height="800" fill="${s.ac}"/>`+T(tp.title,52,200,26,D,s.bg,{a:'middle',r:-90,mw:300});
if(b=='bottom')i+=`<rect x="-200" y="344" width="1040" height="300" fill="${s.ac}"/>`+T(tp.title,40,380,24,D,s.bg,{mw:330})+T(tp.sub,600,378,12,M,s.bg,{a:'end',ls:2,w:700,mw:230});
if(b=='blob'){const q=tp.ph;i+=`<ellipse cx="${q[0]+q[2]/2+10}" cy="${q[1]+q[3]/2}" rx="${q[2]*.74}" ry="${q[3]*.64}" fill="${s.ac}"/>`+T(tp.title,tp.tx,72,28,D,s.ac,{mw:290})+T(tp.sub,tp.tx,96,12,M,s.ink,{ls:2,w:700,mw:290})}
if(b=='none')i+=T(tp.title,34,100,42,D,s.ac,{r:-3,mw:320})+T(tp.sub,34,126,12,M,s.ink,{ls:2,w:700,mw:320});
if(b=='min')i+=`<rect x="40" y="46" width="560" height="3" fill="${s.ink}"/>`+T(tp.title,40,34,14,M,s.ink,{ls:5,w:700,mw:300})+T(tp.sub,600,34,11,M,s.ac,{a:'end',ls:3,w:700,mw:250});
if(tp.ex=='slot')i+=`<rect x="288" y="14" width="64" height="16" rx="8" fill="${s.bg}" stroke="${s.ink}" stroke-width="3"/>`;
i+=doodles(s.dens);
const[x,y,w,h]=tp.ph,cx=x+w/2,cy=y+h/2,pd=PS(s.ph,w,h);
i+=`<g${rf} transform="rotate(${tp.pr} ${cx} ${cy}) translate(${x} ${y})"><path d="${pd}" transform="translate(7 7)" fill="${s.ink}"/><clipPath id="${p}k"><path d="${pd}"/></clipPath><g clip-path="url(#${p}k)">`+(s.img?`<g transform="translate(${w/2+s.px} ${h/2+s.py}) scale(${s.z}) translate(${-w/2} ${-h/2})"><image href="${s.img}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" filter="url(#${p}f)"/></g>`:face(w,h,s))+`</g><path d="${pd}" fill="none" stroke="${s.ink}" stroke-width="5"/>`+(s.tape?`<rect x="${w/2-34}" y="-12" width="68" height="24" fill="${s.pop}" opacity=".88" stroke="${s.ink}" stroke-opacity=".25" transform="rotate(-6 ${w/2} 0)"/>`:'')+`</g>`;
const aw=x>tp.tx?x-tp.tx-16:W-tp.tx-34,nw=tp.nw||aw,ty=tp.ty;
i+=T(s.sig,cx,y+h+34,28,'Caveat',s.ink,{a:'middle',r:-4,w:700,mw:w+20});
i+=T(s.name,tp.tx,ty+34,44,D,s.ink,{mw:aw});
[['FROM',s.place],['BORN',s.dob]].forEach((q,n)=>{const yy=ty+64+n*50;i+=T(q[0],tp.tx,yy,11,M,s.ac,{ls:3,w:700})+T(q[1],tp.tx,yy+22,19,M,s.ink,{w:700,mw:aw})});
// FUNNY TEXT BOX (replaces the old ID number) - wraps and shrinks so the whole text is always visible
if(s.note.trim()){const N=para(s.note,nw,[15,13,12],3);i+=`<rect x="${tp.tx-8}" y="${ty+146}" width="${nw+16}" height="58" rx="6" fill="${s.pop}" fill-opacity=".35" stroke="${s.ink}" stroke-width="2" stroke-dasharray="6 4"/>`;N.l.forEach((l,n)=>i+=T(l,tp.tx,ty+164+n*16,N.z,M,s.ink,{w:700}))}
i+=T(s.tag,tp.tx,ty+228,19,'Permanent Marker',s.ac,{r:-2,mw:nw});
if(tp.ex=='mrz'){const m=(t,n)=>(t.toUpperCase().replace(/[^A-Z0-9]+/g,'<')+'<'.repeat(n)).slice(0,n);i+=T('P<LOST'+m(s.name,30),38,362,14,M,s.ink,{ls:1})+T(m(s.place,16)+m(s.dob,14)+'<<<<',38,384,14,M,s.ink,{ls:1})}
if(tp.ex=='bars'){let r='';for(let q=292;q<604;){const z=1+Math.floor(B()*4);if(B()>.35)r+=`<rect x="${q}" y="318" width="${z}" height="46"/>`;q+=z+1}i+=`<g fill="${s.ink}">${r}</g>`}
if(tp.ex=='stamp')i+=`<g transform="rotate(-14 556 332)" fill="none" stroke="${s.ac}" stroke-width="3"><circle cx="556" cy="332" r="46" stroke-dasharray="6 4"/><circle cx="556" cy="332" r="38"/></g>`+T('APPROVED',556,338,14,M,s.ac,{a:'middle',r:-14,w:700,ls:2});
}
const bgr=`<rect ${X0} fill="${s.bg}"/><rect ${X0} fill="url(#${p}p)"/>`,grain=s.grain?`<rect ${X0} filter="url(#${p}g)"/>`:'';
let bd='';if(s.bs!='none'){const bw=s.bw,d=PATH(s.shape,bw/2+6),da={dashed:`${bw*2.2} ${bw*1.4}`,dotted:`0 ${bw*1.9}`}[s.bs],dbl=s.bs=='double';
bd=`<g${rf}><path d="${d}" fill="none" stroke="${s.ink}" stroke-width="${dbl?bw*1.7:bw}"${da?` stroke-dasharray="${da}"`:''} stroke-linecap="round"/>`+(dbl?`<path d="${d}" fill="none" stroke="${s.bg}" stroke-width="${bw*.5}"/>`:'')+`</g>`}
// print mode: 3mm bleed around the card + artwork shrunk to 90% so nothing sits closer than ~4mm to the cut line
const vb=pr?[-22.45,-22.2,684.9,444.4]:[0,0,W,H];
return{tx,vb,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}"><defs>${defs}</defs><g${pr?'':` clip-path="url(#${p}c)"`}>${bgr}<g${pr?' transform="translate(32 20) scale(.9)"':''}>${i}${grain}${bd}</g></g></svg>`}}
