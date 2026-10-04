// Danke-Bild mit den Top 3 Supportern (1080x1920) – Kowalski, Maya und Odin auf dem Siegertreppchen.
// Aufruf: node live-werbung/danke/make-danke.js "Platz1" "Platz2" "Platz3" [Datum] [Spruch-Nr]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [n1 = 'Platz 1', n2 = 'Platz 2', n3 = 'Platz 3', datum, nr] = process.argv.slice(2);
const SPRUECHE = [
  'Vergessen kann ich vieles. Euch nie.',
  'Demenz nimmt mir manches. Aber nicht euch.',
  'Ihr seid das Herz, das für mich mitschlägt.',
  'Wer mit Herz schenkt, gewinnt immer.',
  'Ehrlich, laut und zusammen. Das sind wir.',
];
const tag = datum || new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const spruch = SPRUECHE[nr !== undefined ? Number(nr) % SPRUECHE.length : new Date().getDate() % SPRUECHE.length];
const img = (n) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'tiere', n + '.png')).toString('base64');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;position:relative;font-family:'DejaVu Sans',sans-serif;color:#E2E8F0;
  background:radial-gradient(ellipse at 50% 62%,#24507F 0%,#0F233D 38%,#071322 70%,#050E1A 100%)}
.rays{position:absolute;left:50%;top:60%;width:2800px;height:2800px;margin:-1400px 0 0 -1400px;border-radius:50%;
  background:repeating-conic-gradient(#D4AF3718 0deg 5deg,transparent 5deg 15deg)}
.spot{position:absolute;left:50%;top:40%;width:900px;height:1100px;margin-left:-450px;
  background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(243,229,171,.28),transparent 100%)}
.frame{position:absolute;inset:34px;border:5px solid #D4AF37;border-radius:46px;opacity:.8}
.confetti i{position:absolute;width:14px;height:26px;border-radius:3px;opacity:.85}
.head{position:absolute;top:120px;left:0;right:0;text-align:center}
.k{font-size:40px;letter-spacing:12px;color:#20B2AA;font-weight:bold}
.h{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;font-size:190px;line-height:1;color:#D4AF37;
  text-shadow:0 0 60px #D4AF3799,0 6px 0 #8a6d16}
.sub{font-family:Georgia,'DejaVu Serif',serif;font-size:50px;color:#F3E5AB;margin-top:10px}
.date{font-size:32px;color:#94A3B8;margin-top:12px;letter-spacing:3px}
.stage{position:absolute;left:0;right:0;bottom:330px;height:900px}
.place{position:absolute;bottom:0;display:flex;flex-direction:column;align-items:center}
.place img{display:block;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55))}
.block{width:100%;display:grid;place-items:center;border-radius:22px 22px 0 0;
  background:linear-gradient(180deg,#F3E5AB,#D4AF37 45%,#9C7B1E);box-shadow:inset 0 4px 0 #fff8,0 -6px 40px #D4AF3755}
.num{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:#050E1A;font-size:110px;line-height:1}
.name{margin:-30px 0 18px;background:#050E1A;border:4px solid #D4AF37;border-radius:60px;padding:14px 30px;
  font-weight:bold;color:#F3E5AB;font-size:44px;max-width:360px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  position:relative;z-index:2;box-shadow:0 8px 24px #000a}
.p1{left:350px;width:380px;z-index:3}.p1 .block{height:300px}.p1 img{width:380px;height:440px}
.p2{left:40px;width:330px}.p2 .block{height:210px;background:linear-gradient(180deg,#F1F5F9,#C9CED6 45%,#8A93A0)}.p2 img{width:330px;height:400px}
.p3{left:710px;width:330px}.p3 .block{height:160px;background:linear-gradient(180deg,#F5D7B0,#B7834A 45%,#7A5226)}.p3 img{width:330px;height:400px}
.crown{position:absolute;top:-70px;left:50%;margin-left:-55px;width:110px}
.quote{position:absolute;left:90px;right:90px;bottom:150px;text-align:center;font-family:Georgia,'DejaVu Serif',serif;
  font-style:italic;font-size:54px;line-height:1.3;color:#F3E5AB;text-shadow:0 2px 12px #000}
.foot{position:absolute;bottom:80px;left:0;right:0;text-align:center;font-size:28px;letter-spacing:5px;color:#E2E8F0;opacity:.85}
</style>
<div class="rays"></div><div class="frame"></div>
<div class="confetti">${Array.from({ length: 34 }, (_, i) => {
  const c = ['#D4AF37', '#F3E5AB', '#20B2AA', '#E5484D', '#FF7AC6'][i % 5];
  const x = (i * 197) % 1040 + 10, y = (i * 233) % 560 + 470, r = (i * 47) % 180;
  return `<i style="left:${x}px;top:${y}px;background:${c};transform:rotate(${r}deg)"></i>`;
}).join('')}</div>
<div class="head"><div class="k">DEMENZ GESTÖRT &amp; GEIL</div><div class="h">DANKE</div>
<div class="sub">an unsere Top 3 Herzlöwen</div><div class="date">${esc(tag)}</div></div>
<div class="stage">
  <div class="place p2"><img src="${img('maya')}"><div class="name">${esc(n2)}</div><div class="block"><div class="num">2</div></div></div>
  <div class="place p3"><img src="${img('odin')}"><div class="name">${esc(n3)}</div><div class="block"><div class="num">3</div></div></div>
  <div class="place p1"><svg class="crown" viewBox="60 30 80 60"><path d="M60 40 L75 70 L100 35 L125 70 L140 40 L135 85 L65 85 Z" fill="#D4AF37" stroke="#F3E5AB" stroke-width="2"/></svg>
    <img src="${img('kowalski')}"><div class="name">${esc(n1)}</div><div class="block"><div class="num">1</div></div></div>
</div>
<div class="quote">„${esc(spruch)}“</div>
<div class="foot">Ehrlich. Menschlich. Ohne Filter.</div>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html);
  const out = path.join(__dirname, `danke-${new Date().toISOString().slice(0, 10)}${process.env.SUFFIX || ''}.png`);
  await p.screenshot({ path: out }); await b.close(); console.log(out);
})();
