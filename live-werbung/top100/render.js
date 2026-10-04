// Werbevideo (10 s) und Show-Intro (6 s) aus dem Top-100-Plakat.
// Aufruf: node live-werbung/top100/render.js
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const IMG = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'plakat-top100.jpg')).toString('base64');
const FPS = 30, DX = 549, DY = 730;
const page = (mode) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0}body{width:1080px;height:1920px;overflow:hidden;position:relative;background:#000;font-family:'DejaVu Sans',sans-serif}
#zoom{position:absolute;inset:0;transform-origin:${mode === 'intro' ? DX + 'px ' + DY + 'px' : '540px 1000px'}}
#zoom img{width:1080px;height:1920px;display:block}
#glow{position:absolute;left:${DX - 260}px;top:${DY - 260}px;width:520px;height:520px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(190,230,255,.45) 18%,rgba(255,80,190,.18) 40%,transparent 68%);mix-blend-mode:screen}
.st{position:absolute;width:70px;height:70px;margin:-35px 0 0 -35px;mix-blend-mode:screen}
.st::before,.st::after{content:"";position:absolute;left:50%;top:50%;background:#fff;border-radius:50%;box-shadow:0 0 14px #fff,0 0 30px #9fdcff}
.st::before{width:6px;height:70px;margin:-35px 0 0 -3px}.st::after{width:70px;height:6px;margin:-3px 0 0 -35px}
#rib{position:absolute;left:40px;top:540px;width:300px;padding:18px 0;border-radius:34px;display:grid;place-items:center;text-align:center;
  background:linear-gradient(90deg,#FF2FA8,#FF5CC0 50%,#FF2FA8);border:4px solid #FFE07A;box-shadow:0 0 30px #FF2FA8,0 0 60px #FF2FA899}
#rib span{font-size:40px;line-height:1.1;font-weight:bold;color:#fff;text-shadow:0 2px 0 #8a005a,0 0 12px #fff8}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
#live{position:absolute;left:0;right:0;top:880px;text-align:center;opacity:0}
#live b{display:inline-block;font-size:170px;line-height:1;font-weight:bold;color:#fff;padding:20px 50px;border-radius:40px;
  background:rgba(20,0,30,.55);text-shadow:0 0 20px #FF2FA8,0 0 50px #FF2FA8,0 6px 0 #8a005a;border:6px solid #FF2FA8;box-shadow:0 0 40px #FF2FA8}
</style>
<div id="zoom"><img src="${IMG}"><div id="glow"></div>
${[[-170,-60],[160,-90],[-120,110],[190,70],[0,-170],[40,150]].map(([x,y],i)=>`<div class="st" id="s${i}" style="left:${DX+x}px;top:${DY+y}px"></div>`).join('')}
</div>
<div id="rib"><span>20 UHR<br>BIG MATCH<br><small style="font-size:26px">ALLES ERLAUBT</small></span></div>
<div id="live"><b>${mode === 'intro' ? 'JETZT LIVE!' : ''}</b></div><div id="flash"></div>
<script>
const cl=x=>Math.max(0,Math.min(1,x)), ease=t=>1-Math.pow(1-t,3), back=t=>{const s=1.7;t=t-1;return t*t*((s+1)*t+s)+1};
const MODE='${mode}';
window.frame=(t)=>{
  let z;
  if(MODE==='intro'){ z=1.9-0.9*ease(cl(t/1.6)); }
  else { z=1+0.03*ease(cl(t/9)); }
  document.getElementById('zoom').style.transform='scale('+z+')';
  document.getElementById('glow').style.opacity=String(0.55+0.45*Math.sin(t*5));
  for(let i=0;i<6;i++){const s=document.getElementById('s'+i);const ph=Math.sin(t*4+i*1.7);s.style.opacity=String(Math.max(0,ph));
    s.style.transform='scale('+(0.4+0.8*Math.max(0,ph))+') rotate('+(t*60+i*30)+'deg)';}
  const r=document.getElementById('rib');
  const rin=MODE==='intro'?cl((t-1.4)/0.5):cl((t-0.8)/0.6);
  r.style.transform='rotate(-6deg) scale('+back(rin)*(1+0.03*Math.sin(t*6))+')';r.style.opacity=String(cl(rin*3));
  if(MODE==='intro'){
    document.getElementById('flash').style.opacity=String(Math.max(0,0.9-Math.abs(t-1.6)*4));
    const l=document.getElementById('live');const p=cl((t-1.6)/0.45);
    l.style.opacity=String(cl(p*2)*(1-cl((t-5.3)/0.5)));l.querySelector('b').style.transform='scale('+back(p)*(1+0.04*Math.sin(t*8))+')';
    document.body.style.opacity=String(1-cl((t-5.6)/0.4));
  }
};
</script>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [mode, sec, out] of [['promo', 10, 'top100-werbung.mp4'], ['intro', 6, 'show-intro-top100.mp4']]) {
    const dir = fs.mkdtempSync('/tmp/t100-'); await p.goto('about:blank'); await p.setContent(page(mode));
    for (let i = 0; i < sec * FPS; i++) { await p.evaluate((t) => window.frame(t), i / FPS);
      await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 }); }
    const audio = mode === 'intro'
      ? "0.5*sin(2*PI*(150+500*t)*t)*lt(t,1.6)*exp(-0.2*t)+0.8*sin(2*PI*80*t)*exp(-5*(t-1.6))*gte(t,1.6)+0.3*(sin(2*PI*523*t)+sin(2*PI*659*t)+sin(2*PI*784*t))*exp(-0.9*(t-1.6))*gte(t,1.6)"
      : "0";
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
      '-f', 'lavfi', '-i', `aevalsrc='${audio}':s=48000:d=${sec}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
      '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', path.join(__dirname, out)]);
    fs.rmSync(dir, { recursive: true }); console.log('ok', out);
  }
  await b.close();
})();
