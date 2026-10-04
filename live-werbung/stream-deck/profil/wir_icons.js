// Tastenbilder für Seite 4 "Das sind wir" aus Ilonas eigenen Bildern.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const D = path.join(__dirname, 'wir');
const uri = (f) => { const ext = f.split('.').pop(); const m = ext === 'jpg' ? 'jpeg' : ext; return `data:image/${m};base64,` + fs.readFileSync(path.join(D, f)).toString('base64'); };
const T = [
  ['kein-mitgefuehl', 'bild-16uhr.webp', 'KEIN', 'MITGEFÜHL', 'center 18%'],
  ['ich-bin-noch-hier', 'bild-tag5.webp', 'ICH BIN', 'NOCH HIER', 'center 12%'],
  ['audio-mai', 'bild-krake.jpg', 'AUDIO', 'MAI', 'center 45%'],
  ['audio-juni', 'bild-housecup.webp', 'AUDIO', 'JUNI', 'center 8%'],
  ['maya', 'bild-maya.png', 'MAYA', '', 'center 30%'],
  ['odin', 'bild-odin.png', 'ODIN', '', 'center 30%'],
];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 144, height: 144 } });
for (const [key, img, a, s, posi] of T) { await p.goto('about:blank');
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:144px;height:144px;overflow:hidden;position:relative;box-sizing:border-box;
  border:3px solid #FFD54A;border-radius:18px;background:#0B0F2E;font-family:'DejaVu Sans',sans-serif}
  img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${posi}}
  .bar{position:absolute;left:0;right:0;bottom:0;background:#000c;text-align:center;padding:3px 0 5px}
  .a{font-weight:bold;color:#FFD54A;font-size:${(a + s).length > 12 ? 15 : 19}px;line-height:1.1}.s{font-weight:bold;color:#FF4FB8;font-size:15px;line-height:1.1}</style>
  <img src="${uri(img)}"><div class="bar"><div class="a">${a}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`);
  await p.screenshot({ path: path.join(D, `icon-${key}.png`) }); }
await b.close(); })();
