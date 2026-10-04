// Baut Trailer: Marken-Hintergrund + Tier-Clip (alpha WebM mit Stimme) darüber.
// Aufruf: node live-werbung/trailer/make.js <clip_alpha.webm> <ausgabe.mp4> "<Zeile oben>"
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const [clip, out, top] = process.argv.slice(2);
const bg = path.join(__dirname, path.basename(out, '.mp4') + '_bg.png');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
  *{margin:0}body{width:1080px;height:1920px;overflow:hidden;font-family:'DejaVu Sans',sans-serif;text-align:center;
  background:radial-gradient(circle at 50% 70%,#1B3A63 0%,#0F233D 35%,#071322 65%,#050E1A 100%);position:relative}
  .rays{position:absolute;left:50%;top:68%;width:2600px;height:2600px;margin:-1300px 0 0 -1300px;border-radius:50%;
  background:repeating-conic-gradient(#D4AF3714 0deg 6deg,transparent 6deg 18deg)}
  .frame{position:absolute;inset:36px;border:5px solid #D4AF37;border-radius:44px;opacity:.75}
  .top{position:absolute;top:120px;left:60px;right:60px;display:grid;gap:18px}
  .k{font-size:44px;letter-spacing:10px;color:#20B2AA;font-weight:bold}
  .h{font-family:Georgia,'DejaVu Serif',serif;font-weight:bold;color:#D4AF37;font-size:118px;line-height:1;text-shadow:0 0 40px #D4AF3788}
  .s{font-size:40px;white-space:nowrap;font-weight:bold;color:#050E1A;background:#D4AF37;border-radius:60px;padding:18px 34px;justify-self:center}
  .l{font-family:Georgia,'DejaVu Serif',serif;font-size:46px;color:#F3E5AB}
  .foot{position:absolute;bottom:80px;left:0;right:0;font-size:34px;letter-spacing:4px;color:#E2E8F0;opacity:.9}
  </style><div class="rays"></div><div class="frame"></div>
  <div class="top"><div class="k">DEMENZ GESTÖRT &amp; GEIL</div><div class="h">${top}</div>
  <div class="s">20:00 BIG MATCH · ALLES ERLAUBT</div></div>
  <div class="foot">Ehrlich. Menschlich. Ohne Filter.</div>`);
  await p.screenshot({ path: bg });
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-framerate', '30', '-i', bg,
    '-c:v', 'libvpx-vp9', '-i', clip,
    '-filter_complex', "[1:v]scale=900:-1,format=rgba[c];[0:v][c]overlay=(W-w)/2:H-h-90:shortest=1,format=yuv420p[v]",
    '-map', '[v]', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', '30',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out]);
  console.log('ok', out);
})();
