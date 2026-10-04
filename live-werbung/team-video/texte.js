// Rendert die Untertitel als durchsichtige PNGs im Löwen-Stil (Gold + Pink-Neon).
const { chromium } = require('playwright'); const path = require('path');
const T = [
  ['2 Stunden vor dem BIG MATCH…', 'Kowalski ist hochkonzentriert.'],
  ['Das Team bespricht', 'die Taktik.'],
  ['Odin', 'hat noch Fragen.'],
  ['Taktik steht:', 'Erst schlafen. Dann gewinnen.'],
  ['Und Max sagt:', '„Ich bin bereit."'],
  ['Max: „Ich mach das', 'nur für die Rosen."'],
];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (let i = 0; i < T.length; i++) {
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:1080px;height:1920px;background:transparent;font-family:'DejaVu Sans',sans-serif}
  .box{position:absolute;left:50px;right:50px;top:170px;text-align:center;padding:30px 30px 36px;border-radius:40px;
   background:linear-gradient(180deg,#0B0F2Ecc,#1A0B2Ecc);border:5px solid #FFD54A;box-shadow:0 0 30px #FF3FB0,0 0 70px #FF3FB088}
  .a{font-size:58px;font-weight:bold;color:#fff;text-shadow:0 0 18px #FF3FB0}
  .b{font-size:74px;font-weight:bold;margin-top:8px;line-height:1.1;background:linear-gradient(180deg,#FFF6C8,#FFD54A 45%,#D99A00);
   -webkit-background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #6B3A00) drop-shadow(0 0 16px #FF3FB0)}
  .tag{position:absolute;bottom:120px;left:0;right:0;text-align:center;font-size:40px;font-weight:bold;color:#fff;text-shadow:0 2px 10px #000,0 0 14px #FF3FB0}
  </style><div class="box"><div class="a">${T[i][0]}</div><div class="b">${T[i][1]}</div></div><div class="tag">@ilona.demenz · Herzlöwen-WG</div>`);
  await p.screenshot({ path: path.join(__dirname, `t${i + 1}.png`), omitBackground: true });
} await b.close(); })();
