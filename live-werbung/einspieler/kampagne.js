// Kampagnen-Overlays (1080x1920, durchsichtig, mit Ton): Banner fährt unten ins Bild.
// Aufruf: node live-werbung/einspieler/kampagne.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const FPS = 30, SEC = 6;

const MOUNTAIN = (c) => `<svg viewBox="0 0 200 90" width="210" height="95"><path d="M0 90 L60 25 L85 50 L120 5 L200 90 Z" fill="${c}"/><path d="M120 5 L105 25 L115 22 L122 30 L130 20 L138 24 Z" fill="#fff"/></svg>`;
const DIAMOND = `<svg viewBox="0 0 100 90" width="120" height="108"><path d="M20 5 H80 L100 30 L50 88 L0 30 Z" fill="#FFB020" stroke="#FFF1C1" stroke-width="4"/><path d="M0 30 H100 M35 5 L50 30 L65 5 M50 30 V88" stroke="#FFF1C1" stroke-width="3" fill="none"/></svg>`;
const HEART = `<svg viewBox="0 0 100 90" width="120" height="108"><path d="M50 88 C15 62 0 45 5 25 C10 5 38 3 50 25 C62 3 90 5 95 25 C100 45 85 62 50 88 Z" fill="#FF4F9A" stroke="#FFD1E6" stroke-width="4"/></svg>`;
const SHIELD = `<svg viewBox="0 0 100 110" width="110" height="121"><path d="M50 4 L94 20 V55 C94 82 72 100 50 106 C28 100 6 82 6 55 V20 Z" fill="#20B2AA" stroke="#CFFAF6" stroke-width="5"/><path d="M30 55 L45 70 L72 40" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/></svg>`;
const ROSE = `<svg viewBox="0 0 100 120" width="110" height="132"><path d="M50 60 V115" stroke="#2E9E4F" stroke-width="7"/><path d="M50 90 C35 80 25 85 22 95 C35 98 45 96 50 90 Z" fill="#2E9E4F"/><circle cx="50" cy="40" r="32" fill="#E5484D"/><path d="M50 18 C38 26 38 46 50 52 C62 46 62 26 50 18 Z M30 38 C34 54 46 60 50 60 C40 52 36 44 30 38 Z M70 38 C66 54 54 60 50 60 C60 52 64 44 70 38 Z" fill="#B3262B"/></svg>`;

const CLIPS = [
  { file: '20-gipfelzeit', color: '#4CC35A', dark: '#0E3B1A', icon: MOUNTAIN('#4CC35A'), kicker: 'GIPFELSTÜRMER', big: 'GIPFELZEIT!', line: '20–22 Uhr: Jedes Geschenk zählt EXTRA', tone: 'rise' },
  { file: '21-100-preise', color: '#FFB020', dark: '#3A2300', icon: DIAMOND, kicker: '100 PREISE KAMPAGNE', big: 'TOP 100!', line: 'Bringt mich unter die besten 100!', tone: 'win' },
  { file: '22-fanclub', color: '#FF4F9A', dark: '#3D0A22', icon: HEART, kicker: 'FANCLUB', big: 'TRITT BEI!', line: 'Jedes neue Mitglied = Gipfel-Punkte', tone: 'soft' },
  { file: '23-waechter', color: '#20B2AA', dark: '#06302E', icon: SHIELD, kicker: 'LIGA A3 → A2', big: 'WÄCHTER GESUCHT', line: 'Deine Mission bringt uns Fragmente!', tone: 'hit' },
  { file: '24-wunsch-geschenke', color: '#D4AF37', dark: '#2B2205', icon: ROSE, kicker: 'JETZT ZÄHLT JEDES GESCHENK 3-FACH', big: 'LIGA · GIPFEL · TOP 100', line: 'Eine Rose hilft bei allen drei Zielen!', tone: 'rise' },
];

const page = (c) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;background:transparent;font-family:'DejaVu Sans',sans-serif;position:relative}
#wrap{position:absolute;left:50px;right:50px;bottom:170px}
#card{position:relative;border-radius:40px;padding:34px 40px 36px 210px;min-height:260px;
  background:linear-gradient(135deg,${c.dark}F2,#050E1AF2);border:6px solid ${c.color};
  box-shadow:0 0 0 3px #050E1A,0 0 60px ${c.color}AA,0 20px 50px #000C;overflow:hidden}
#shine{position:absolute;top:0;bottom:0;width:180px;left:-200px;background:linear-gradient(100deg,transparent,${c.color}55,transparent)}
#icon{position:absolute;left:40px;top:50%;transform:translateY(-50%)}
#k{font-size:34px;font-weight:bold;letter-spacing:6px;color:${c.color}}
#b{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:#fff;line-height:1.05;margin:6px 0 10px;
  font-size:${c.big.length > 16 ? 58 : c.big.length > 11 ? 74 : 96}px;text-shadow:0 0 30px ${c.color}AA}
#l{font-size:38px;font-weight:bold;color:#F3E5AB}
#badge{position:absolute;top:-40px;right:30px;background:${c.color};color:#050E1A;font-weight:bold;font-size:30px;
  padding:10px 24px;border-radius:40px;box-shadow:0 6px 20px #000A;letter-spacing:2px}
</style>
<div id="wrap"><div id="badge">HERZLÖWEN</div><div id="card"><div id="shine"></div><div id="icon">${c.icon}</div>
<div id="k">${c.kicker}</div><div id="b">${c.big}</div><div id="l">${c.line}</div></div></div>
<script>
const D=${SEC};const cl=x=>Math.max(0,Math.min(1,x));const back=t=>{const s=1.6;t=t-1;return t*t*((s+1)*t+s)+1};
window.frame=(t)=>{
  const inn=back(cl(t/0.6)), out=cl((t-(D-0.5))/0.5);
  const y=(1-inn)*520 + out*520;
  const w=document.getElementById('wrap');
  w.style.transform='translateY('+y+'px) scale('+(1+0.02*Math.sin(t*6)*(t>0.6&&t<D-0.5?1:0))+')';
  w.style.opacity=String(cl(t/0.25)*(1-out));
  document.getElementById('shine').style.left=(-200+((t*700)%1500))+'px';
  document.getElementById('icon').style.transform='translateY(-50%) rotate('+(Math.sin(t*4)*6)+'deg) scale('+(1+0.06*Math.sin(t*8))+')';
  document.getElementById('badge').style.transform='scale('+back(cl((t-0.3)/0.4))+')';
};
</script>`;

const AUDIO = {
  rise: "0.5*sin(2*PI*(200+300*t)*t)*exp(-0.5*t)",
  hit: "0.7*sin(2*PI*90*t)*exp(-6*t)+0.35*sin(2*PI*880*t)*exp(-4*t)",
  win: "0.3*(sin(2*PI*523*t)+sin(2*PI*659*t)*gte(t,0.25)+sin(2*PI*784*t)*gte(t,0.5))*exp(-0.7*t)",
  soft: "0.35*(sin(2*PI*392*t)+sin(2*PI*494*t))*exp(-0.8*t)",
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const c of CLIPS) {
    const dir = fs.mkdtempSync('/tmp/kamp-'); await p.goto('about:blank');
    await p.setContent(page(c));
    for (let i = 0; i < SEC * FPS; i++) {
      await p.evaluate((t) => window.frame(t), i / FPS);
      await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.png`), omitBackground: true });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png'),
      '-f', 'lavfi', '-i', `aevalsrc='${AUDIO[c.tone]}':s=48000:d=${SEC}`,
      '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-b:v', '2500k', '-deadline', 'realtime', '-cpu-used', '8',
      '-c:a', 'libopus', '-b:a', '128k', '-shortest', path.join(__dirname, `${c.file}_alpha.webm`)]);
    // Vorschau-Standbild mit dunklem Hintergrund
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x3a3a3a:s=1080x1920', '-i', path.join(dir, 'f0090.png'),
      '-filter_complex', 'overlay', '-frames:v', '1', `/tmp/kamp-prev-${c.file}.png`]);
    fs.rmSync(dir, { recursive: true });
    console.log('ok', c.file);
  }
  await b.close();
})();
