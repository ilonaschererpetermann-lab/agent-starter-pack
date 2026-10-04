// Ergänzt Ilonas Löwen-Werbung um "19 Uhr Live · 20 Uhr Big Match".
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const src = 'data:image/png;base64,' + fs.readFileSync('/tmp/loewe.png').toString('base64');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 940, height: 1672 }, deviceScaleFactor: 2 });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
  *{margin:0}body{width:940px;height:1672px;position:relative;overflow:hidden;font-family:'DejaVu Sans',sans-serif}
  img{position:absolute;inset:0;width:940px;height:1672px}
  .rib{position:absolute;left:40px;right:40px;top:1268px;height:96px;border-radius:20px;display:grid;place-items:center;
    background:linear-gradient(180deg,#FFF3B0,#F2C744 40%,#B8860B);border:4px solid #FF4FB8;
    box-shadow:0 0 28px #FF4FB8,0 0 60px #FF4FB8AA,inset 0 3px 0 #fff9}
  .rib span{white-space:nowrap;font-weight:bold;font-size:38px;color:#2A0A3D;letter-spacing:1px;text-shadow:0 1px 0 #fff8}
  .burst{position:absolute;left:705px;top:340px;width:215px;height:215px;display:grid;place-items:center;transform:rotate(12deg);
    background:radial-gradient(circle,#FF4FB8 0%,#D6127F 70%);clip-path:polygon(50% 0,61% 13%,77% 6%,80% 22%,96% 25%,89% 40%,100% 52%,88% 62%,93% 78%,77% 79%,72% 95%,58% 88%,45% 100%,37% 86%,21% 93%,19% 77%,3% 72%,11% 58%,0 45%,13% 36%,8% 20%,24% 18%,29% 3%,42% 12%);
    filter:drop-shadow(0 0 12px #FF4FB8)}
  .burst div{text-align:center;color:#fff;font-weight:bold;line-height:1;text-shadow:0 2px 4px #0008}
  .burst .a{font-size:19px}.burst .b{font-size:40px;color:#FFE27A}.burst .c{font-size:20px}
  </style><img src="${src}">
  <div class="burst"><div><div class="a">SCHON AB</div><div class="b">19 UHR</div><div class="c">LIVE!</div></div></div>
  <div class="rib"><span>19 UHR LIVE · 20 UHR BIG MATCH</span></div>`);
  await p.screenshot({ path: path.join(__dirname, 'werbung-loewe-19-20-uhr.png') }); await b.close();
})();
