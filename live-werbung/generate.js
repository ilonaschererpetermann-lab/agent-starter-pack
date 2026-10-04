// Erzeugt die stündlichen Story-Grafiken (1080x1920) für den Live-Abend.
// Aufruf: node live-werbung/generate.js
const { chromium } = require('playwright');
const path = require('path');

const ADS = [
  { file: '15-uhr', kicker: 'HEUTE', big: '19:00', line: 'LIVE mit Ilona', sub: 'Ab 20:00 BIG MATCH · Alles erlaubt' },
  { file: '16-uhr', kicker: 'NOCH 3 STUNDEN', big: '19:00', line: 'Wir gehen LIVE', sub: 'Danach 20:00 BIG MATCH · Alles erlaubt' },
  { file: '17-uhr', kicker: 'NOCH 2 STUNDEN', big: '19:00', line: 'Herzlöwen, seid ihr dabei?', sub: '20:00 BIG MATCH · Alles erlaubt' },
  { file: '18-uhr', kicker: 'NOCH 1 STUNDE', big: '19:00', line: 'Glocke an. Platz sichern.', sub: '20:00 BIG MATCH · Alles erlaubt' },
  { file: '19-uhr', kicker: 'JETZT', big: 'LIVE', line: 'Komm rein – ohne Filter', sub: 'Gleich um 20:00: BIG MATCH' },
  { file: '20-uhr', kicker: 'JETZT', big: 'BIG MATCH', line: 'Alles erlaubt!', sub: 'Jede Rose zählt – kämpf mit uns' },
];

const lionHeart = `
<svg viewBox="0 0 200 200" width="260" height="260">
  <defs><radialGradient id="g" cx="50%" cy="45%" r="60%">
    <stop offset="0" stop-color="#F3E5AB"/><stop offset="1" stop-color="#D4AF37"/></radialGradient></defs>
  <path d="M60 40 L75 70 L100 35 L125 70 L140 40 L135 85 L65 85 Z" fill="url(#g)"/>
  <path d="M100 185 C40 140 20 115 30 92 C40 70 75 72 100 100 C125 72 160 70 170 92 C180 115 160 140 100 185 Z"
        fill="url(#g)" stroke="#F3E5AB" stroke-width="3"/>
</svg>`;

const html = (a) => `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;overflow:hidden;font-family:'DejaVu Sans',sans-serif;color:#E2E8F0;
    background:radial-gradient(circle at 50% 38%,#0F233D 0%,#071322 55%,#050E1A 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 80px}
  .glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(212,175,55,.22),transparent 45%)}
  .frame{position:absolute;inset:40px;border:4px solid #D4AF37;border-radius:40px;opacity:.7}
  .brand{font-size:38px;letter-spacing:8px;color:#F3E5AB;margin-top:30px}
  .kicker{margin-top:90px;font-size:64px;letter-spacing:10px;color:#20B2AA;font-weight:bold}
  .big{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:#D4AF37;line-height:1;
    font-size:${a.big.length > 5 ? 190 : 300}px;margin:30px 0;text-shadow:0 0 50px rgba(212,175,55,.55)}
  .line{font-family:Georgia,'DejaVu Serif',serif;font-size:76px;color:#F3E5AB}
  .sub{margin-top:70px;font-size:42px;white-space:nowrap;font-weight:bold;color:#050E1A;background:#D4AF37;padding:26px 50px;border-radius:70px}
  .motto{position:absolute;bottom:110px;font-size:36px;letter-spacing:4px;color:#E2E8F0;opacity:.85}
</style></head><body>
  <div class="glow"></div><div class="frame"></div>
  ${lionHeart}
  <div class="brand">DEMENZ GESTÖRT &amp; GEIL</div>
  <div class="kicker">${a.kicker}</div>
  <div class="big">${a.big}</div>
  <div class="line">${a.line}</div>
  <div class="sub">${a.sub}</div>
  <div class="motto">Ehrlich. Menschlich. Ohne Filter.</div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const a of ADS) {
    await page.setContent(html(a));
    await page.screenshot({ path: path.join(__dirname, `story-${a.file}.png`) });
  }
  await browser.close();
})();
