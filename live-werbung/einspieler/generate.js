// Rendert die Einspieler (1080x1920, 30 fps, mit Ton) für TikTok LIVE Studio.
// Aufruf: node live-werbung/einspieler/generate.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const CLIPS = [
  { file: '01-intro-live', sec: 4, kicker: 'Demenz gestört & geil', big: 'LIVE', line: 'Ehrlich. Menschlich. Ohne Filter.', accent: '#E5484D', tone: 'rise' },
  { file: '02-big-match-start', sec: 4, kicker: 'Jetzt geht es los', big: 'BIG MATCH', line: 'Alles erlaubt!', accent: '#D4AF37', tone: 'rise' },
  { file: '03-boost-x2', sec: 3, kicker: 'Boost aktiv', big: 'x2', line: 'Jede Rose zählt doppelt!', accent: '#20B2AA', tone: 'hit' },
  { file: '04-boost-x3', sec: 3, kicker: 'Boost aktiv', big: 'x3', line: 'Dreifach – jetzt reinhauen!', accent: '#D4AF37', tone: 'hit' },
  { file: '05-boost-x5', sec: 3, kicker: 'Mega-Boost', big: 'x5', line: 'Fünffach! Alles rein!', accent: '#E5484D', tone: 'hit' },
  { file: '06-letzte-60-sekunden', sec: 4, kicker: 'Letzte Chance', big: '60', line: 'Sekunden – JETZT entscheidet es sich!', accent: '#E5484D', tone: 'tick' },
  { file: '07-gewonnen', sec: 5, kicker: 'Herzlöwen', big: 'GEWONNEN', line: 'Das wart IHR!', accent: '#D4AF37', tone: 'win' },
  { file: '08-danke', sec: 5, kicker: 'Von Herzen', big: 'DANKE', line: 'Ihr seid meine Familie, Herzlöwen.', accent: '#F3E5AB', tone: 'soft' },
];

const page = (c, alpha) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;font-family:'DejaVu Sans',sans-serif;color:#E2E8F0;background:#050E1A;position:relative}
#bg{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#0F233D 0%,#071322 50%,#050E1A 100%)}
#rays{position:absolute;left:50%;top:45%;width:2600px;height:2600px;margin:-1300px 0 0 -1300px;
  background:repeating-conic-gradient(from 0deg,${c.accent}22 0deg 6deg,transparent 6deg 18deg);border-radius:50%}
#ring{position:absolute;left:50%;top:45%;border:10px solid ${c.accent};border-radius:50%}
#stack{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 70px;gap:40px}
#kicker{font-size:58px;letter-spacing:12px;text-transform:uppercase;color:#20B2AA;font-weight:bold}
#big{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:${c.accent};line-height:.95;
  font-size:${c.big.length <= 2 ? 520 : c.big.length <= 4 ? 300 : c.big.length <= 6 ? 200 : 170}px;
  text-shadow:0 0 60px ${c.accent}AA,0 0 6px #000}
#line{font-family:Georgia,'DejaVu Serif',serif;font-size:72px;color:#F3E5AB;line-height:1.2}
#crown{width:200px;height:200px}
#frame{position:absolute;inset:36px;border:5px solid #D4AF37;border-radius:44px;opacity:.75}
#flash{position:absolute;inset:0;background:#fff}
${alpha ? 'body{background:transparent!important}#bg,#rays,#frame,#flash{display:none}#big,#line,#kicker{text-shadow:0 0 50px '+c.accent+'AA,0 4px 18px #000,0 0 4px #000}#stack{justify-content:flex-start;padding-top:260px}' : ''}
</style></head><body>
<div id="bg"></div><div id="rays"></div><div id="ring"></div><div id="frame"></div>
<div id="stack">
  <svg id="crown" viewBox="0 0 200 200"><path d="M60 40 L75 70 L100 35 L125 70 L140 40 L135 85 L65 85 Z" fill="#D4AF37"/>
  <path d="M100 185 C40 140 20 115 30 92 C40 70 75 72 100 100 C125 72 160 70 170 92 C180 115 160 140 100 185 Z" fill="#D4AF37"/></svg>
  <div id="kicker">${c.kicker}</div><div id="big">${c.big}</div><div id="line">${c.line}</div>
</div><div id="flash"></div>
<script>
const D=${c.sec};
const ease=t=>1-Math.pow(1-t,3);
const back=t=>{const s=1.9;t=t-1;return t*t*((s+1)*t+s)+1};
const cl=(x)=>Math.max(0,Math.min(1,x));
window.frame=(t)=>{
  const p=t/D;
  document.getElementById('rays').style.transform='rotate('+(t*25)+'deg)';
  const r=600+((t*700)%900);
  const ring=document.getElementById('ring');
  ring.style.width=ring.style.height=r+'px';ring.style.marginLeft=ring.style.marginTop=(-r/2)+'px';
  ring.style.opacity=String(1-((t*700)%900)/900);
  const pop=back(cl(t/0.45));
  const big=document.getElementById('big');
  const pulse=1+0.04*Math.sin(t*9);
  big.style.transform='scale('+(pop*pulse)+')';
  document.getElementById('kicker').style.opacity=String(cl((t-0.15)/0.3));
  document.getElementById('crown').style.transform='translateY('+(-60*(1-ease(cl(t/0.5))))+'px)';
  document.getElementById('crown').style.opacity=String(cl(t/0.3));
  const l=document.getElementById('line');
  l.style.opacity=String(cl((t-0.4)/0.35));l.style.transform='translateY('+(40*(1-ease(cl((t-0.4)/0.35))))+'px)';
  document.getElementById('flash').style.opacity=String(Math.max(0,0.85-t*4));
  const out=cl((t-(D-0.35))/0.35);
  document.getElementById('stack').style.opacity=String(1-out);
  document.body.style.opacity=String(1-out*0.6);
};
</script></body></html>`;

const AUDIO = {
  rise: "0.5*sin(2*PI*(200+300*t)*t)*exp(-0.4*t)",
  hit: "0.7*sin(2*PI*90*t)*exp(-6*t)+0.35*sin(2*PI*880*t)*exp(-4*t)",
  tick: "0.5*sin(2*PI*1000*t)*lt(mod(t,0.5),0.06)",
  win: "0.3*(sin(2*PI*523*t)+sin(2*PI*659*t)*gte(t,0.25)+sin(2*PI*784*t)*gte(t,0.5))*exp(-0.7*t)",
  soft: "0.35*(sin(2*PI*392*t)+sin(2*PI*494*t))*exp(-0.8*t)",
};

(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const alpha = !!process.env.ALPHA;
  for (const c of CLIPS) {
    const outName = alpha ? `${c.file}_alpha.webm` : `${c.file}.mp4`;
    if (process.env.SKIP_EXISTING && fs.existsSync(path.join(__dirname, outName))) continue;
    const dir = fs.mkdtempSync('/tmp/einsp-');
    await p.setContent(page(c, alpha));
    const n = c.sec * FPS;
    for (let i = 0; i < n; i++) {
      await p.evaluate((t) => window.frame(t), i / FPS);
      await p.screenshot(alpha
        ? { path: path.join(dir, `f${String(i).padStart(4, '0')}.png`), omitBackground: true }
        : { path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 88 });
    }
    const out = path.join(__dirname, outName);
    if (alpha) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png'),
        '-f', 'lavfi', '-i', `aevalsrc='${AUDIO[c.tone]}':s=48000:d=${c.sec}`,
        '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-b:v', '2500k', '-deadline', 'realtime', '-cpu-used', '8',
        '-c:a', 'libopus', '-b:a', '128k', '-shortest', out]);
      fs.rmSync(dir, { recursive: true });
      console.log('ok', outName);
      continue;
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
      '-f', 'lavfi', '-i', `aevalsrc='${AUDIO[c.tone]}':s=44100:d=${c.sec}`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20',
      '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
    fs.rmSync(dir, { recursive: true });
    console.log('ok', c.file);
  }
  await browser.close();
})();
