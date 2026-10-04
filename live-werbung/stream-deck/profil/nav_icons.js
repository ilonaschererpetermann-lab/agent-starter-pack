const { chromium } = require('playwright'); const path = require('path');
const T = [['nav-next','WEITER','Seite ▶','#D4AF37'],['nav-prev','ZURÜCK','◀ Seite','#D4AF37'],['nav-board','BOARD','Teleprompter','#20B2AA']];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 144, height: 144 } });
for (const [f, big, small, col] of T) { await p.goto('about:blank');
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:144px;height:144px;overflow:hidden;box-sizing:border-box;
  background:#0B1830;border:3px solid ${col};border-radius:18px;font-family:'DejaVu Sans',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .b{font-weight:bold;color:${col};font-size:28px}.s{font-size:15px;color:#fff;margin-top:6px;font-weight:bold}</style><div class="b">${big}</div><div class="s">${small}</div>`);
  await p.screenshot({ path: path.join(__dirname, f + '.png') }); } await b.close(); })();
