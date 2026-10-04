const { chromium } = require('playwright'); const path = require('path');
const T = [
 ['16','lachen','HAHA','Lachen','#FFD54A'],['17','applaus','KLATSCH','Applaus','#F3E5AB'],['18','trommelwirbel','TROMMEL','Wirbel','#E5484D'],
 ['19','ba-dum-tss','BA-DUM','TSS','#20B2AA'],['20','tusch-fanfare','TUSCH','Fanfare','#D4AF37'],
 ['21','airhorn','HORN','Airhorn','#FF4F9A'],['22','ding-richtig','DING','Richtig','#3DD68C'],['23','buzzer-falsch','MÖÖP','Falsch','#E5484D'],
 ['24','traurig-wahwah','WAH','wah wah','#94A3B8'],['25','boing','BOING','','#FFB020'],
 ['26','ka-ching','KA-CHING','Geschenk','#D4AF37'],['27','herzschlag','BUM-BUM','Herzschlag','#FF4F9A'],['28','spannung','???','Spannung','#20B2AA'],
 ['29','grillen-stille','ZIRP','Stille','#4CC35A'],['30','woosh','WUSCH','Übergang','#F3E5AB'],
];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 144, height: 144 } });
for (const [nr, f, big, small, col] of T) {
  await p.goto('about:blank');
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:144px;height:144px;overflow:hidden;box-sizing:border-box;
  background:radial-gradient(circle at 50% 35%,#2A1240,#0B0F2E);border:3px solid #FF4FB8;border-radius:18px;font-family:'DejaVu Sans',sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .b{font-weight:bold;color:${col};font-size:${big.length > 6 ? 21 : big.length > 4 ? 28 : 38}px;text-shadow:0 0 10px ${col}99}
  .s{font-size:15px;color:#fff;margin-top:6px;font-weight:bold}</style><div class="b">${big}</div><div class="s">${small}</div>`);
  await p.screenshot({ path: path.join(__dirname, `Taste-${nr}-${f}.png`) });
} await b.close(); })();
