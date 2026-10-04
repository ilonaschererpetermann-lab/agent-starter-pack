// Erzeugt 144x144-Tastenbilder für das Stream Deck.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const T = [
  ['01-intro-live','LIVE','Intro','#E5484D'],['02-big-match-start','MATCH','Start','#D4AF37'],
  ['03-boost-x2','x2','Boost','#20B2AA'],['04-boost-x3','x3','Boost','#D4AF37'],['05-boost-x5','x5','Boost','#E5484D'],
  ['06-letzte-60-sekunden','60s','Letzte','#E5484D'],['07-gewonnen','SIEG','Gewonnen','#D4AF37'],['08-danke','DANKE','Herz','#F3E5AB'],
  ['09-folgt-uns-bitte','FOLGEN','Bitte','img'],['10-teamherze','TEAM','Herze','img'],['11-kowalski-danke-fuers-folgen','KOWALSKI','Danke','img'],
  ['12-maya','MAYA','','img'],['13-odin','ODIN','','img'],
  ['20-gipfelzeit','GIPFEL','20-22 Uhr','#4CC35A'],['21-100-preise','TOP100','Preise','#FFB020'],['22-fanclub','FAN','Club','#FF4F9A'],
  ['23-waechter','WÄCHTER','gesucht','#20B2AA'],['24-wunsch-geschenke','3-FACH','Geschenke','#D4AF37'],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 144, height: 144 } });
  for (const [f, big, small, col] of T) {
    const img = col === 'img' ? 'data:image/png;base64,' + fs.readFileSync(`/tmp/thumbs/${f}.png`).toString('base64') : null;
    await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:144px;height:144px;overflow:hidden;
      background:radial-gradient(circle at 50% 40%,#0F233D,#050E1A);font-family:'DejaVu Sans',sans-serif;position:relative;
      display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:3px solid #D4AF37;box-sizing:border-box;border-radius:18px}
      img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.95}
      .bar{position:absolute;left:0;right:0;bottom:0;background:#050E1Add;padding:4px 0 6px}
      .b{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:${img ? '#D4AF37' : col};font-size:${img ? (big.length > 6 ? 17 : 22) : (big.length > 6 ? 22 : big.length > 4 ? 30 : 50)}px;line-height:1}
      .s{font-size:15px;color:#F3E5AB;margin-top:4px;font-weight:bold;letter-spacing:1px}</style>
      ${img ? `<img src="${img}"><div class="bar"><div class="b">${big}</div></div>` : `<div class="b">${big}</div><div class="s">${small}</div>`}`);
    await p.screenshot({ path: path.join(__dirname, 'icons', f + '.png') });
  }
  await b.close();
})();
