// HerzGedanken – modernes Nachrichtenstudio im Stil großer News-Sender (Three.js)
// Hell, klar, viele LED-Flächen, Rot-Weiß-Akzente, weißer Moderationstisch, spiegelnder Boden.
// Gebündelt mit esbuild zu ../news.bundle.js. Standard Hochformat 1080x1920, ?quer=1 für 1920x1080.
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const P = new URLSearchParams(location.search);
const V = !P.get('quer');
const W = V ? 1080 : 1920, H = V ? 1920 : 1080, LOOP = 16;
// ?ebene=hinten: Studio ohne Tisch (unter die Kamera), ?ebene=vorne: nur der Tisch, durchsichtig (über die Kamera)
const EBENE = P.get('ebene') || 'alles';
const VORNE = EBENE === 'vorne', HINTEN = EBENE === 'hinten';
const RED = 0xd50f25, WHITE = 0xffffff, NAVY = 0x0b1d3a;

// ---------- Renderer ----------
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: VORNE });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
if (!VORNE) { scene.background = new THREE.Color(0x0e1a2c); scene.fog = new THREE.Fog(0x0e1a2c, 26, 60); }
const room = new THREE.Group(); // alles außer dem Tisch
const _add = scene.add.bind(scene);
_add(room);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;
const camera = new THREE.PerspectiveCamera(V ? 74 : 40, W / H, 0.1, 200);

// ---------- Hilfen ----------
const lit = (c, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
const texs = [];
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  t.userData.redraw = () => { const x = c.getContext('2d'); x.clearRect(0, 0, w, h); draw(x, w, h); t.needsUpdate = true; };
  t.userData.redraw(); texs.push(t); return t;
}
function heart(ctx, cx, cy, s) {
  ctx.beginPath(); ctx.moveTo(cx, cy + s * .9);
  ctx.bezierCurveTo(cx - s * 1.4, cy, cx - s * 1.1, cy - s * 1.1, cx, cy - s * .45);
  ctx.bezierCurveTo(cx + s * 1.1, cy - s * 1.1, cx + s * 1.4, cy, cx, cy + s * .9);
}
function logo(ctx, x, y, size, col = '#fff') { // „HerzGedanken“ zentriert auf x
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${size * 1.25}px "Great Vibes"`; const a = ctx.measureText('Herz').width;
  ctx.font = `600 ${size}px Montserrat`; const b = ctx.measureText('Gedanken').width;
  const x0 = x - (a + b + size * .9) / 2;
  ctx.fillStyle = col; ctx.font = `${size * 1.25}px "Great Vibes"`; ctx.fillText('Herz', x0, y);
  ctx.font = `600 ${size}px Montserrat`; ctx.fillText('Gedanken', x0 + a + 4, y);
  ctx.fillStyle = '#E3112D'; heart(ctx, x0 + a + b + size * .55, y - size * .38, size * .32); ctx.fill();
}

// ---------- Boden: dunkel glänzend mit Lichtlinien ----------
const mirror = new Reflector(new THREE.PlaneGeometry(90, 90), { textureWidth: W * .5, textureHeight: H * .5, color: 0x9aa4b4 });
mirror.rotation.x = -Math.PI / 2; room.add(mirror);
const glass = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshBasicMaterial({ color: 0x141e2e, transparent: true, opacity: .93 }));
glass.rotation.x = -Math.PI / 2; glass.position.y = .002; room.add(glass);
for (let i = -6; i <= 6; i++) { if (!i) continue; // weiße Bodenfugen strahlenförmig zur Wand
  const l = new THREE.Mesh(new THREE.PlaneGeometry(.035, 40), lit(0xcfe0ff, .35));
  l.rotation.x = -Math.PI / 2; l.rotation.z = i * .07; l.position.set(i * 1.1, .004, -2); room.add(l);
}
const ring = new THREE.Mesh(new THREE.RingGeometry(4.2, 4.26, 160), lit(RED, 1.6));
ring.rotation.x = -Math.PI / 2; ring.position.set(0, .01, V ? 4.6 : 2.6); room.add(ring);

// ---------- Haupt-Videowand (aus einzelnen LED-Kacheln) ----------
const WALL_W = V ? 8.4 : 17, WALL_H = V ? 13.2 : 8.6, WALL_Z = -12.5, WALL_Y = .6;
const wallTex = canvasTex(V ? 1080 : 1920, V ? 1700 : 980, (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0B2A5C'); g.addColorStop(.55, '#0F4C9C'); g.addColorStop(1, '#0A2347');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // Weltkugel aus Längen-/Breitengraden
  const cx = w / 2, cy = h * (V ? .52 : .55), R = Math.min(w, h) * (V ? .36 : .34);
  const rg = ctx.createRadialGradient(cx, cy, R * .2, cx, cy, R * 1.3);
  rg.addColorStop(0, 'rgba(90,170,255,.35)'); rg.addColorStop(1, 'rgba(90,170,255,0)');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(160,210,255,.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(Math.cos(k * .42)) * R, R, 0, 0, 7); ctx.stroke(); }
  for (let k = -3; k <= 3; k++) { const yy = cy + Math.sin(k * .42) * R; const rr = Math.cos(k * .42) * R; ctx.beginPath(); ctx.ellipse(cx, yy, rr, rr * .12, 0, 0, 7); ctx.stroke(); }
  // Lichtpunkte (Städte) auf der Kugel
  let sd = 9; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 160; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * .96;
    ctx.fillStyle = r() < .85 ? 'rgba(220,240,255,.9)' : 'rgba(255,80,100,.95)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5 + r() * 2.5, 0, 7); ctx.fill(); }
  // Raster
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  // Logo-Kopf oben
  logo(ctx, w / 2, V ? 170 : 150, V ? 108 : 120);
  ctx.fillStyle = '#E3112D'; const bw = V ? 620 : 700, by = V ? 215 : 190; ctx.fillRect(w / 2 - bw / 2, by, bw, 64);
  ctx.fillStyle = '#fff'; ctx.font = '800 38px Montserrat'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('NEWS  ·  TALK  ·  LIVE', w / 2, by + 34); ctx.textAlign = 'left';
});
const COLS = V ? 3 : 6, ROWS = V ? 5 : 3, GAP = .04;
for (let cx = 0; cx < COLS; cx++) for (let cy = 0; cy < ROWS; cy++) {
  const tw = WALL_W / COLS, th = WALL_H / ROWS;
  const geo = new THREE.PlaneGeometry(tw - GAP, th - GAP);
  const uv = geo.attributes.uv; // passenden Bildausschnitt auf jede Kachel legen
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (cx + uv.getX(i)) / COLS, (cy + uv.getY(i)) / ROWS);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: wallTex, toneMapped: false }));
  m.position.set(-WALL_W / 2 + tw * (cx + .5), WALL_Y + th * (cy + .5), WALL_Z); room.add(m);
}
const frame = new THREE.Mesh(new THREE.BoxGeometry(WALL_W + .5, WALL_H + .5, .3), new THREE.MeshStandardMaterial({ color: 0x0a0f18, metalness: .6, roughness: .4 }));
frame.position.set(0, WALL_Y + WALL_H / 2, WALL_Z - .2); room.add(frame);
const base = new THREE.Mesh(new THREE.BoxGeometry(WALL_W + .5, .12, .12), lit(RED, 1.8)); base.position.set(0, WALL_Y - .12, WALL_Z + .05); room.add(base);

// ---------- Seitliche Wände: rot-weiße Info-Flächen ----------
function sideTex(left) {
  return canvasTex(600, 1600, (ctx, w, h) => {
    ctx.fillStyle = '#F4F6FA'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#D50F25'; ctx.fillRect(0, h * .08, w, h * .16);
    ctx.fillStyle = '#fff'; ctx.font = '900 120px Montserrat'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(left ? 'LIVE' : 'NEWS', w / 2, h * .16);
    ctx.fillStyle = '#0B1D3A';
    for (let i = 0; i < 9; i++) { ctx.globalAlpha = .9 - i * .08; ctx.fillRect(60, h * .32 + i * 95, w - 120 - (i % 3) * 90, 22); }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(w / 2, h * .82); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#D50F25'; ctx.font = '800 70px Montserrat';
    ctx.fillText(left ? 'EHRLICH · MENSCHLICH' : 'OHNE FILTER', 0, 0); ctx.restore();
  });
}
function sideWall(x, rotY, tex) {
  const g = new THREE.Group();
  const s = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 9.6), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0xdcdcdc }));
  s.position.y = 5.4; g.add(s);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(.08, 9.8, .08), lit(WHITE, 1.4)); edge.position.set(1.65, 5.4, 0); g.add(edge);
  const edge2 = edge.clone(); edge2.position.x = -1.65; g.add(edge2);
  g.position.set(x, 0, -9.8); g.rotation.y = rotY; room.add(g);
}
sideWall(V ? -6.2 : -11, V ? .38 : .5, sideTex(true));
sideWall(V ? 6.2 : 11, V ? -.38 : -.5, sideTex(false));

// Lichtsäulen und Decken-Lichtpaneele (Tiefe)
for (const x of [-9.5, -8, 8, 9.5]) { const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 14, .18), lit(WHITE, 1.1)); b.position.set(x, 7, -14); room.add(b); }
for (let i = -3; i <= 3; i++) for (let j = 0; j < 3; j++) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), lit(0xeaf2ff, 1.25)); p.rotation.x = Math.PI / 2;
  p.position.set(i * 3, 15.5, -10 + j * 4); room.add(p);
}

// ---------- Moderationstisch: weiß glänzend mit rotem Band ----------
const desk = new THREE.Group();
const R_IN = 2.5, R_OUT = 3.25, ARC = 1.25, DH = 1.05;
function arcShape(r1, r2, arc) { const s = new THREE.Shape(), a0 = -Math.PI / 2 - arc / 2, a1 = -Math.PI / 2 + arc / 2;
  s.absarc(0, 0, r2, a0, a1, false); s.absarc(0, 0, r1, a1, a0, true); return s; }
const white = new THREE.MeshPhysicalMaterial({ color: 0xf3f5f8, metalness: .05, roughness: .15, clearcoat: 1, clearcoatRoughness: .05 });
const body = new THREE.Mesh(new THREE.ExtrudeGeometry(arcShape(R_IN, R_OUT, ARC), { depth: DH - .08, bevelEnabled: false, curveSegments: 64 }), white);
body.rotation.x = -Math.PI / 2; desk.add(body);
const top = new THREE.Mesh(new THREE.ExtrudeGeometry(arcShape(R_IN - .15, R_OUT + .12, ARC + .08), { depth: .07, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 3, curveSegments: 64 }),
  new THREE.MeshPhysicalMaterial({ color: 0x1b2433, metalness: .4, roughness: .2, clearcoat: 1 }));
top.rotation.x = -Math.PI / 2; top.position.y = DH - .08; desk.add(top);
const frontTex = canvasTex(2048, 560, (ctx, w, h) => {
  ctx.fillStyle = '#F4F6FA'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#D50F25'; ctx.fillRect(0, h * .72, w, h * .14);
  logo(ctx, w / 2, h * .52, 170, '#0B1D3A');
});
const front = new THREE.Mesh(new THREE.CylinderGeometry(R_OUT + .01, R_OUT + .01, .8, 96, 1, true, -.62, 1.24), new THREE.MeshBasicMaterial({ map: frontTex, toneMapped: false, color: 0xe8e8e8 }));
front.position.y = .5; desk.add(front);
const glow = new THREE.Mesh(new THREE.CylinderGeometry(R_OUT + .02, R_OUT + .02, .04, 96, 1, true, -ARC / 2, ARC), lit(RED, 1.8)); glow.position.y = .05; desk.add(glow);
// Hochformat: Tisch näher und größer, damit er den Oberkörper bis zur Brust verdeckt
if (V) { desk.position.set(0, 0, 2.6); desk.scale.setScalar(1.15); } else { desk.position.set(0, 0, 1.2); desk.scale.setScalar(1.15); }
_add(desk);

// ---------- Licht ----------
_add(new THREE.HemisphereLight(0xeaf2ff, 0x2a3242, 1.0));
const key = new THREE.SpotLight(0xffffff, 90, 34, .55, .6, 1.4); key.position.set(0, 9, 10); key.target.position.set(0, 1, 0); _add(key, key.target);
const fillL = new THREE.PointLight(0x9cc8ff, 30, 22, 1.6); fillL.position.set(-6, 4, 3); _add(fillL);
const fillR = new THREE.PointLight(0xffd6d6, 25, 22, 1.6); fillR.position.set(6, 4, 3); _add(fillR);

// ---------- Nachbearbeitung ----------
const composer = new EffectComposer(renderer); composer.setPixelRatio(1); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), .35, .4, .9));
composer.addPass(new OutputPass());

// ---------- Kamera (sanfter, nahtloser 16-s-Loop) ----------
const look = new THREE.Vector3();
function update(t) {
  const p = (t % LOOP) / LOOP * Math.PI * 2, still = P.get('still') || VORNE;
  const sx = still ? 0 : Math.sin(p) * (V ? .5 : 1.2);
  if (V) { camera.position.set(sx, .95, 13.5); look.set(sx * .2, -.15, -4); }
  else { camera.position.set(sx, 2.3, 11.8); look.set(sx * .25, 3.0, -4); }
  camera.lookAt(look);
  ring.material.color.setHex(RED).multiplyScalar(1.3 + .4 * Math.sin(p * 4));
}
room.visible = !VORNE; desk.visible = !HINTEN;
function render(t) { update(VORNE ? 0 : t); if (VORNE) renderer.render(scene, camera); else composer.render(); }

window.studio = { async renderAt(t) { render(t); } };
(async () => {
  await document.fonts.ready;
  await Promise.all(['120px "Great Vibes"', '600 100px Montserrat', '800 40px Montserrat', '900 100px Montserrat'].map(f => document.fonts.load(f).catch(() => {})));
  texs.forEach(t => t.userData.redraw());
  window.studio.ready = true;
  if (!P.get('capture')) { const t0 = performance.now(); renderer.setAnimationLoop(() => render((performance.now() - t0) / 1000)); }
  else render(0);
})();
