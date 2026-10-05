// "LIGA A2"-Party-Animation: Ilonas Löwe, goldene 3D-Schrift, Feuerwerk, Konfetti.
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const FPS = 30, SEC = 7;
const b64 = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, f)).toString('base64');
const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0}body{width:1080px;height:1920px;overflow:hidden;position:relative;background:#07020f;font-family:'DejaVu Sans',sans-serif}
#bg{position:absolute;inset:-40px;background:url(${b64('loewe-full.jpg')}) center/cover;filter:blur(18px) brightness(.45) saturate(1.4)}
#lion{position:absolute;left:0;top:560px;width:1080px;height:760px;background:url(${b64('loewe-crop.jpg')}) center/cover;
  -webkit-mask-image:radial-gradient(ellipse 60% 58% at 50% 50%,#000 60%,transparent 100%);mask-image:radial-gradient(ellipse 60% 58% at 50% 50%,#000 60%,transparent 100%)}
#rays{position:absolute;left:50%;top:950px;width:3000px;height:3000px;margin:-1500px 0 0 -1500px;border-radius:50%;
  background:repeating-conic-gradient(rgba(255,215,90,.16) 0deg 4deg,transparent 4deg 14deg);mix-blend-mode:screen}
canvas{position:absolute;inset:0}
.t{position:absolute;left:0;right:0;text-align:center}
#k{top:150px;font-size:66px;font-weight:bold;letter-spacing:10px;color:#fff;text-shadow:0 0 12px #ff3fb0,0 0 30px #ff3fb0,0 0 60px #ff3fb0}
#a2{top:260px;font-size:200px;line-height:1;font-weight:bold;letter-spacing:-2px;white-space:nowrap;
  background:linear-gradient(180deg,#fff7cf 0%,#ffd84a 38%,#e09a00 62%,#fff1a8 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 6px 0 #8a4b00) drop-shadow(0 12px 0 #5a2f00) drop-shadow(0 0 30px #ff3fb0) drop-shadow(0 0 60px #ffb300)}
#shine{position:absolute;top:240px;height:280px;width:220px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.85),transparent);mix-blend-mode:overlay}
#d{top:1380px;white-space:nowrap;font-size:76px;font-weight:bold;color:#fff;text-shadow:0 0 14px #ff3fb0,0 0 34px #ff3fb0,0 4px 0 #8a005a}
#n{top:1520px}
#n span{display:inline-block;font-size:56px;font-weight:bold;color:#2a0a3d;padding:18px 46px;border-radius:60px;
  background:linear-gradient(180deg,#fff3b0,#f2c744 45%,#b8860b);border:5px solid #ff4fb8;box-shadow:0 0 30px #ff4fb8,0 0 70px #ff4fb899}
#h{top:1700px;font-size:34px;font-weight:bold;color:#ffd84a;letter-spacing:3px;text-shadow:0 2px 10px #000}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
</style><div id="bg"></div><div id="rays"></div><div id="lion"></div><canvas id="c" width="1080" height="1920"></canvas>
<div class="t" id="k">WIR SIND</div><div class="t" id="a2">LIGA A2</div><div id="shine"></div>
<div class="t" id="d">DANKE, HERZLÖWEN!</div><div class="t" id="n"><span>Nächster Halt: A1</span></div>
<div class="t" id="h">@ilona.demenz · Demenz gestört &amp; geil</div><div id="flash"></div>
<script>
const cl=x=>Math.max(0,Math.min(1,x)),back=t=>{const s=2.2;t=t-1;return t*t*((s+1)*t+s)+1};
let seed=7;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
const COLS=['#ffd84a','#ff3fb0','#ffffff','#20b2aa','#ff8a00','#c48bff'];
const conf=Array.from({length:170},()=>({x:R()*1080,y:-R()*1900,vy:180+R()*260,vx:-60+R()*120,r:R()*6.28,vr:-6+R()*12,w:10+R()*14,h:18+R()*22,c:COLS[(R()*6)|0],ph:R()*6}));
const fw=[{t:.5,x:250,y:520},{t:1.1,x:830,y:430},{t:1.8,x:540,y:300},{t:2.6,x:200,y:1250},{t:3.2,x:880,y:1200},{t:4.2,x:540,y:520},{t:5.0,x:300,y:400}]
 .map(f=>({...f,c:COLS[(R()*6)|0],p:Array.from({length:70},()=>({a:R()*6.28,s:250+R()*420}))}));
const ctx=document.getElementById('c').getContext('2d');
window.frame=(t)=>{
  const sl=back(cl((t-0.35)/0.45)), shake=t>0.35&&t<1.0?Math.sin(t*90)*14*(1-(t-0.35)/0.65):0;
  const a2=document.getElementById('a2'); a2.style.transform='translate('+shake+'px,0) scale('+(t<0.35?0:(3-2*sl)*(1+0.025*Math.sin(t*6)))+')'; a2.style.opacity=String(cl((t-0.35)/0.1));
  document.getElementById('k').style.opacity=String(cl((t-0.9)/0.3));
  document.getElementById('k').style.transform='translateY('+(-40*(1-cl((t-0.9)/0.3)))+'px)';
  document.getElementById('shine').style.left=(-300+((t-1)%2.2)*900)+'px';
  document.getElementById('flash').style.opacity=String(Math.max(0,0.95-Math.abs(t-0.4)*5));
  document.getElementById('rays').style.transform='rotate('+t*20+'deg)';
  document.getElementById('lion').style.transform='scale('+(1.08-0.08*cl(t/7))+')';
  const dIn=back(cl((t-1.4)/0.45)); const d=document.getElementById('d'); d.style.transform='scale('+dIn+')'; d.style.opacity=String(cl((t-1.4)/0.15));
  const nIn=back(cl((t-1.9)/0.45)); const n=document.getElementById('n'); n.style.transform='translateY('+(200*(1-nIn))+'px)'; n.style.opacity=String(cl((t-1.9)/0.2));
  document.getElementById('h').style.opacity=String(cl((t-2.4)/0.4));
  ctx.clearRect(0,0,1080,1920);
  for(const f of fw){const dt=t-f.t;if(dt<0||dt>1.6)continue;const al=1-dt/1.6;
    for(const p of f.p){const r=p.s*(1-Math.exp(-3*dt));const x=f.x+Math.cos(p.a)*r,y=f.y+Math.sin(p.a)*r+90*dt*dt;
      ctx.globalAlpha=al;ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(x,y,5*al+1.5,0,6.28);ctx.fill();
      ctx.globalAlpha=al*.35;ctx.beginPath();ctx.arc(x,y,13*al,0,6.28);ctx.fill();}}
  ctx.globalAlpha=1;
  if(t>0.35)for(const c of conf){const tt=t-0.35;const y=c.y+c.vy*tt*1.4+300;if(y<-40||y>1960)continue;
    const x=c.x+c.vx*tt+Math.sin(tt*3+c.ph)*30;ctx.save();ctx.translate(x,y);ctx.rotate(c.r+c.vr*tt);ctx.scale(1,Math.cos(tt*6+c.ph));
    ctx.fillStyle=c.c;ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h);ctx.restore();}
  document.body.style.opacity=String(1-cl((t-(${SEC}-0.4))/0.4));
};
</script>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('about:blank'); await p.setContent(html);
  const dir = fs.mkdtempSync('/tmp/party-');
  for (let i = 0; i < SEC * FPS; i++) { await p.evaluate((t) => window.frame(t), i / FPS);
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 }); }
  await b.close();
  const sd = path.join(__dirname, '../stream-deck');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
    '-i', path.join(sd, 'sound-deck/Taste-20-tusch-fanfare.mp3'), '-i', path.join(sd, 'sound-deck/Taste-17-applaus.mp3'), '-i', path.join(sd, 'battle-deck/Taste-35-boom.mp3'),
    '-filter_complex', '[3:a]adelay=350|350,volume=0.9[b];[1:a]adelay=700|700,volume=0.9[f];[2:a]adelay=1600|1600,volume=0.7[ap];[b][f][ap]amix=inputs=3:duration=longest:normalize=0,apad[a]',
    '-map', '0:v', '-map', '[a]', '-t', String(SEC), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    path.join(__dirname, 'liga-a2-party.mp4')]);
  fs.rmSync(dir, { recursive: true }); console.log('ok');
})();
