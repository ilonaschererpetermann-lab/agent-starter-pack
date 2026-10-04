const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const k = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../danke/tiere/kowalski.png')).toString('base64');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{width:1080px;height:1920px;overflow:hidden;position:relative;font-family:'DejaVu Sans',sans-serif;text-align:center;
background:radial-gradient(ellipse at 50% 60%,#24507F,#0F233D 40%,#050E1A 100%)}
.rays{position:absolute;left:50%;top:60%;width:2800px;height:2800px;margin:-1400px 0 0 -1400px;border-radius:50%;background:repeating-conic-gradient(#D4AF3718 0deg 5deg,transparent 5deg 15deg)}
.t{position:absolute;top:230px;left:60px;right:60px}.k{font-size:42px;letter-spacing:10px;color:#20B2AA;font-weight:bold}
.h{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;font-size:150px;color:#D4AF37;text-shadow:0 0 50px #D4AF3788;margin:20px 0}
.s{font-family:Georgia,'DejaVu Serif',serif;font-size:56px;color:#F3E5AB;line-height:1.3}
img{position:absolute;left:50%;bottom:300px;width:620px;margin-left:-310px;filter:drop-shadow(0 20px 30px #000a)}
.f{position:absolute;bottom:150px;left:0;right:0;font-size:46px;font-weight:bold;color:#050E1A}
.f span{background:#D4AF37;border-radius:60px;padding:18px 40px}</style>
<div class="rays"></div><div class="t"><div class="k">DEMENZ GESTÖRT &amp; GEIL</div><div class="h">FOLG MIR</div><div class="s">Ehrlich. Menschlich.<br>Ohne Filter.</div></div>
<img src="${k}"><div class="f"><span>@ilona.demenz · täglich LIVE</span></div>`);
await p.screenshot({ path: '/tmp/endcard.png' }); await b.close(); })();
