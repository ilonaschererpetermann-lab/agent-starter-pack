// Danke-Video (20 s) mit Ilonas Song "Ich bin noch hier": Top 3 werden enthüllt, danach alle Herzlöwen.
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const FPS = 30, SEC = 20;
const TOP = [['Ines', '39.800'], ['Birgit', '7.577'], ['Saskia Elisabeth', '5.400']];
const MORE = ['Tanja', 'ReginaMeyer', 'Lilawolke', 'Snoopy', 'Chris', 'Sisa', 'Rita'];
const b64 = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, f)).toString('base64');
const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0}body{width:1080px;height:1920px;overflow:hidden;position:relative;background:#07020f;font-family:'DejaVu Sans',sans-serif}
#bg{position:absolute;inset:-40px;background:url(${b64('loewe-full.jpg')}) center/cover;filter:blur(20px) brightness(.38) saturate(1.4)}
#lion{position:absolute;left:0;top:1080px;width:1080px;height:760px;background:url(${b64('loewe-crop.jpg')}) center/cover;opacity:.9;
  -webkit-mask-image:radial-gradient(ellipse 60% 58% at 50% 50%,#000 55%,transparent 100%)}
#rays{position:absolute;left:50%;top:1000px;width:3000px;height:3000px;margin:-1500px 0 0 -1500px;border-radius:50%;
  background:repeating-conic-gradient(rgba(255,215,90,.14) 0deg 4deg,transparent 4deg 14deg);mix-blend-mode:screen}
canvas{position:absolute;inset:0}
.t{position:absolute;left:0;right:0;text-align:center;white-space:nowrap}
.gold{background:linear-gradient(180deg,#fff7cf 0%,#ffd84a 38%,#e09a00 62%,#fff1a8 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 5px 0 #8a4b00) drop-shadow(0 10px 0 #5a2f00) drop-shadow(0 0 28px #ff3fb0)}
.neon{color:#fff;text-shadow:0 0 12px #ff3fb0,0 0 30px #ff3fb0,0 0 60px #ff3fb0}
#danke{top:120px;font-size:230px;font-weight:bold;line-height:1}
#sub{top:370px;font-size:60px;font-weight:bold}
.card{position:absolute;left:90px;right:90px;height:150px;border-radius:30px;display:flex;align-items:center;gap:30px;padding:0 34px;
  background:linear-gradient(90deg,rgba(30,8,45,.92),rgba(60,10,60,.85));border:5px solid #ffd84a;box-shadow:0 0 30px #ff3fb0aa,0 14px 30px #000a}
.rank{flex:none;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;font-size:60px;font-weight:bold;color:#2a0a3d}
.r1{background:linear-gradient(180deg,#fff3b0,#f2c744 45%,#b8860b)}.r2{background:linear-gradient(180deg,#fff,#c9ced6 50%,#8a93a0)}.r3{background:linear-gradient(180deg,#f5d7b0,#b7834a 50%,#7a5226)}
.nm{font-size:56px;white-space:nowrap;font-weight:bold;color:#fff;flex:1;overflow:hidden;text-overflow:ellipsis}
.dm{font-size:40px;font-weight:bold;color:#ffd84a}
.crown{position:absolute;left:38px;top:-62px;width:120px}
#c1{top:520px}#c2{top:700px}#c3{top:880px}
#more{top:540px;left:60px;right:60px;white-space:normal;display:flex;flex-wrap:wrap;justify-content:center;gap:22px}
#more span{font-size:56px;font-weight:bold;padding:14px 34px;border-radius:50px;color:#fff;background:rgba(255,63,176,.25);border:4px solid #ff3fb0;box-shadow:0 0 24px #ff3fb0}
#mt{top:430px;font-size:62px;font-weight:bold}
#fam{top:520px;font-size:96px;font-weight:bold;line-height:1.15;white-space:normal}
#a2{top:800px;font-size:150px;font-weight:bold}
#n{top:990px}#n span{display:inline-block;font-size:54px;font-weight:bold;color:#2a0a3d;padding:16px 44px;border-radius:60px;
  background:linear-gradient(180deg,#fff3b0,#f2c744 45%,#b8860b);border:5px solid #ff4fb8;box-shadow:0 0 30px #ff4fb8}
#h{top:1830px;font-size:30px;font-weight:bold;color:#ffd84a;letter-spacing:3px;text-shadow:0 2px 10px #000}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
</style><div id="bg"></div><div id="rays"></div><div id="lion"></div><canvas id="c" width="1080" height="1920"></canvas>
<div class="t gold" id="danke">DANKE</div><div class="t neon" id="sub">an meine Herzlöwen</div>
${TOP.map(([n, d], i) => `<div class="card" id="c${i + 1}">${i === 0 ? `<svg class="crown" viewBox="60 30 80 60"><path d="M60 40 L75 70 L100 35 L125 70 L140 40 L135 85 L65 85 Z" fill="#ffd84a" stroke="#fff3b0" stroke-width="2"/></svg>` : ''}<div class="rank r${i + 1}">${i + 1}</div><div class="nm">${n}</div><div class="dm">${d}</div></div>`).join('')}
<div class="t neon" id="mt">Und danke an</div><div class="t" id="more">${MORE.map((m) => `<span>${m}</span>`).join('')}</div>
<div class="t neon" id="fam">Ihr seid<br>meine Familie.</div><div class="t gold" id="a2">LIGA A2</div><div class="t" id="n"><span>Nächster Halt: A1</span></div>
<div class="t" id="h">@ilona.demenz · Ohne Filter.</div><div id="flash"></div>
<script>
const cl=x=>Math.max(0,Math.min(1,x)),back=t=>{const s=2;t=t-1;return t*t*((s+1)*t+s)+1};
const win=(t,a,b,f=0.35)=>cl((t-a)/f)*(1-cl((t-(b-f))/f));
let seed=11;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
const COLS=['#ffd84a','#ff3fb0','#ffffff','#20b2aa','#ff8a00','#c48bff'];
const conf=Array.from({length:150},()=>({x:R()*1080,y:R()*1920,vy:120+R()*200,vx:-40+R()*80,r:R()*6.28,vr:-5+R()*10,w:10+R()*12,h:16+R()*20,c:COLS[(R()*6)|0],ph:R()*6}));
const fw=[{t:.4,x:250,y:300},{t:.9,x:830,y:260},{t:3.2,x:900,y:960},{t:4.7,x:180,y:780},{t:6.2,x:540,y:420},{t:6.6,x:880,y:560},{t:14.3,x:540,y:820},{t:14.8,x:220,y:700},{t:15.3,x:860,y:700}]
 .map(f=>({...f,c:COLS[(R()*6)|0],p:Array.from({length:70},()=>({a:R()*6.28,s:220+R()*380}))}));
const ctx=document.getElementById('c').getContext('2d');
const $=id=>document.getElementById(id);
window.frame=(t)=>{
  // Phase 1: DANKE (0-9 s oben), Top 3 (3-9 s)
  const p1=win(t,0.3,9.2);
  const sl=back(cl((t-0.3)/0.45));$('danke').style.opacity=String(p1);$('danke').style.transform='scale('+(t<0.3?0:(3-2*sl))+')';
  $('sub').style.opacity=String(win(t,1.0,9.2));
  [[3,'c3'],[4.5,'c2'],[6,'c1']].forEach(([s,id])=>{const e=$(id);const k=back(cl((t-s)/0.5));e.style.opacity=String(win(t,s,9.2,0.2));e.style.transform='translateX('+(900*(1-k))+'px) scale('+(id==='c1'?1+0.03*Math.sin(t*6):1)+')';});
  // Phase 2: Danke an alle (9.2-14 s)
  $('mt').style.opacity=String(win(t,9.3,14.1));
  [...$('more').children].forEach((s,i)=>{const st=9.6+i*0.35;const k=back(cl((t-st)/0.4));s.style.opacity=String(win(t,st,14.1,0.2));s.style.transform='scale('+k+')';});
  $('more').style.opacity=String(win(t,9.3,14.1,0.2));
  // Phase 3: Familie + A2 (14-20 s)
  $('fam').style.opacity=String(win(t,14.2,20.5));$('fam').style.transform='scale('+back(cl((t-14.2)/0.5))+')';
  $('a2').style.opacity=String(win(t,15.2,20.5,0.2));$('a2').style.transform='scale('+(t<15.2?0:(2.5-1.5*back(cl((t-15.2)/0.45))))+')';
  $('n').style.opacity=String(win(t,16.2,20.5));$('n').style.transform='translateY('+(150*(1-back(cl((t-16.2)/0.45))))+'px)';
  $('h').style.opacity=String(cl((t-1.5)/0.6));
  $('flash').style.opacity=String(Math.max(0,0.9-Math.abs(t-0.32)*5,0.7-Math.abs(t-15.2)*5));
  $('rays').style.transform='rotate('+t*15+'deg)';
  ctx.clearRect(0,0,1080,1920);
  for(const f of fw){const dt=t-f.t;if(dt<0||dt>1.6)continue;const al=1-dt/1.6;
    for(const p of f.p){const r=p.s*(1-Math.exp(-3*dt));const x=f.x+Math.cos(p.a)*r,y=f.y+Math.sin(p.a)*r+90*dt*dt;
      ctx.globalAlpha=al;ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(x,y,5*al+1.5,0,6.28);ctx.fill();ctx.globalAlpha=al*.35;ctx.beginPath();ctx.arc(x,y,13*al,0,6.28);ctx.fill();}}
  ctx.globalAlpha=1;
  for(const c of conf){const y=((c.y+c.vy*t)%2000)-40;const x=c.x+c.vx*t%1080+Math.sin(t*3+c.ph)*30;
    ctx.save();ctx.translate((x+1080)%1080,y);ctx.rotate(c.r+c.vr*t);ctx.scale(1,Math.cos(t*6+c.ph));ctx.fillStyle=c.c;ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h);ctx.restore();}
  document.body.style.opacity=String(1-cl((t-(${SEC}-0.5))/0.5));
};
</script>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('about:blank'); await p.setContent(html);
  const dir = fs.mkdtempSync('/tmp/dankev-');
  for (let i = 0; i < SEC * FPS; i++) { await p.evaluate((t) => window.frame(t), i / FPS);
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 }); }
  await b.close();
  const song = path.join(__dirname, '../stream-deck/profil/wir/ich-bin-noch-hier.mp3');
  const boom = path.join(__dirname, '../stream-deck/battle-deck/Taste-35-boom.mp3');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'), '-i', song, '-i', boom,
    '-filter_complex', `[1:a]volume=0.95,afade=t=out:st=${SEC - 1.2}:d=1.2[s];[2:a]adelay=300|300,volume=0.6[b];[s][b]amix=inputs=2:duration=first:normalize=0[a]`,
    '-map', '0:v', '-map', '[a]', '-t', String(SEC), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    path.join(__dirname, 'danke-video-a2.mp4')]);
  fs.rmSync(dir, { recursive: true }); console.log('ok');
})();
