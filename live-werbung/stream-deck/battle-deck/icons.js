const { chromium } = require('playwright'); const path = require('path');
const T = [['31','attacke','ATTACKE!','Horn','#FF3B3B'],['32','kriegstrommeln','TROMMELN','Krieg','#FF8A00'],['33','alarm','ALARM','Sirene','#FF3B3B'],
 ['34','countdown','3-2-1','Countdown','#FFD54A'],['35','boom','BOOM','Explosion','#FF8A00'],['36','power-up','POWER','Up','#20B2AA'],
 ['37','schwert','KLING','Schwert','#CFE8FF'],['38','kino-schlag','WUMMS','Kino','#E5484D'],['39','level-up','LEVEL','Up','#3DD68C'],['40','ko','K.O.','Ringglocke','#FFD54A']];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 144, height: 144 } });
for (const [nr, f, big, small, col] of T) { await p.goto('about:blank');
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:144px;height:144px;overflow:hidden;box-sizing:border-box;
  background:radial-gradient(circle at 50% 35%,#3A0A0A,#120404);border:3px solid #FF3B3B;border-radius:18px;font-family:'DejaVu Sans',sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .b{font-weight:bold;color:${col};font-size:${big.length > 6 ? 22 : big.length > 4 ? 30 : 40}px;text-shadow:0 0 12px ${col}}
  .s{font-size:15px;color:#fff;margin-top:6px;font-weight:bold}</style><div class="b">${big}</div><div class="s">${small}</div>`);
  await p.screenshot({ path: path.join(__dirname, `Taste-${nr}-${f}.png`) }); } await b.close(); })();
