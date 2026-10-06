// HerzGedanken – virtuelles 3D-Nachrichtenstudio (Three.js)
// Gebündelt mit esbuild zu ../studio.bundle.js, damit es auch als lokale Datei (OBS) läuft.
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const W = 1920, H = 1080, LOOP = 16; // Sekunden, passend zur Länge des Wand-Videos
const P = new URLSearchParams(location.search);

const C = {
  night: 0x050e1a, petrol: 0x0f233d, gold: 0xd4af37, beige: 0xf3e5ab,
  pink: 0xff4d8d, blue: 0x39b8ff, teal: 0x20b2aa, violet: 0x7a3cff,
};

// ---------- Renderer ----------
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02060d);
scene.fog = new THREE.Fog(0x02060d, 22, 48);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);

// ---------- Hilfsfunktionen ----------
const emissive = (color, intensity = 1) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), toneMapped: false });

const canvasTexs = [];
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  // nach dem Laden der Webfonts neu zeichnen
  t.userData.redraw = () => { const ctx = c.getContext('2d'); ctx.clearRect(0, 0, w, h); draw(ctx, w, h); t.needsUpdate = true; };
  canvasTexs.push(t);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function heartPath(ctx, cx, cy, s) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * .9);
  ctx.bezierCurveTo(cx - s * 1.4, cy, cx - s * 1.1, cy - s * 1.1, cx, cy - s * .45);
  ctx.bezierCurveTo(cx + s * 1.1, cy - s * 1.1, cx + s * 1.4, cy, cx, cy + s * .9);
}

function glowText(ctx, text, x, y, font, color, glow, blur = 30) {
  ctx.font = font; ctx.fillStyle = color;
  ctx.shadowColor = glow;
  for (const b of [blur, blur / 2, 0]) { ctx.shadowBlur = b; ctx.fillText(text, x, y); }
  ctx.shadowBlur = 0;
}

// ---------- Boden: Spiegel + abgedunkelte Glasfläche ----------
const mirror = new Reflector(new THREE.PlaneGeometry(80, 80), {
  textureWidth: W * .5, textureHeight: H * .5, color: 0x8a8fa0,
});
mirror.rotation.x = -Math.PI / 2;
scene.add(mirror);

const floorTex = canvasTex(1024, 1024, (ctx, w, h) => {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.10)'; ctx.lineWidth = 3;
  for (let i = 0; i <= w; i += 128) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
});
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(20, 20);
const glass = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({
  color: 0x040a16, transparent: true, opacity: .72, alphaMap: null,
}));
glass.rotation.x = -Math.PI / 2; glass.position.y = .002;
scene.add(glass);
const grid = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({
  color: 0x2a4a7a, transparent: true, opacity: .35, alphaMap: floorTex, depthWrite: false,
}));
grid.rotation.x = -Math.PI / 2; grid.position.y = .004;
scene.add(grid);

// Leuchtringe im Boden um den Tisch
const rings = new THREE.Group();
[[3.6, 3.66, C.pink, 1.6], [4.3, 4.34, C.blue, 1.3], [5.4, 5.43, C.gold, 1.0]].forEach(([a, b, col, k]) => {
  const m = new THREE.Mesh(new THREE.RingGeometry(a, b, 160), emissive(col, k));
  m.rotation.x = -Math.PI / 2; m.position.y = .01; rings.add(m);
});
rings.position.set(0, 0, 2.3);
scene.add(rings);

// ---------- Gebogene LED-Videowand ----------
const WALL_R = 15, WALL_ARC = 1.12, WALL_H = 15 * 1.12 / (16 / 9), WALL_Y = .55;
const WALL_CZ = 2.5;
let wallTex;
const video = document.createElement('video');
let useVideo = !P.get('novideo') && location.protocol !== 'file:'; // file:// blockiert Video-Texturen
function imageTex() {
  const t = new THREE.TextureLoader().load(window.WALL_IMG);
  t.colorSpace = THREE.SRGBColorSpace; return t;
}
if (useVideo) {
  Object.assign(video, { src: 'assets/wall.mp4', muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous' });
  wallTex = new THREE.VideoTexture(video); wallTex.colorSpace = THREE.SRGBColorSpace;
} else wallTex = imageTex();
wallTex.wrapS = THREE.RepeatWrapping; wallTex.repeat.x = -1; wallTex.offset.x = 1;

const wallMat = new THREE.MeshBasicMaterial({ map: wallTex, side: THREE.BackSide, toneMapped: false,
  color: new THREE.Color(1, 1, 1).multiplyScalar(.92) });
const wall = new THREE.Mesh(
  new THREE.CylinderGeometry(WALL_R, WALL_R, WALL_H, 96, 1, true, Math.PI - WALL_ARC / 2, WALL_ARC), wallMat);
wall.position.set(0, WALL_Y + WALL_H / 2, WALL_CZ);
scene.add(wall);

// LED-Pixelraster als feine Struktur über der Wand
const pixTex = canvasTex(64, 64, (ctx) => {
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 60, 64, 4); ctx.fillRect(60, 0, 4, 64);
});
pixTex.wrapS = pixTex.wrapT = THREE.RepeatWrapping; pixTex.repeat.set(220, 70);
const pix = new THREE.Mesh(
  new THREE.CylinderGeometry(WALL_R - .01, WALL_R - .01, WALL_H, 96, 1, true, Math.PI - WALL_ARC / 2, WALL_ARC),
  new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: pixTex, transparent: true, opacity: .25, side: THREE.BackSide, depthWrite: false }));
pix.position.copy(wall.position);
scene.add(pix);

// Rahmen-Lichtleisten oben/unten an der Wand
function arcStrip(r, y, h, col, k, arc = WALL_ARC + .02) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 96, 1, true, Math.PI - arc / 2, arc), emissive(col, k));
  m.material.side = THREE.DoubleSide; m.position.set(0, y, WALL_CZ); scene.add(m); return m;
}
arcStrip(WALL_R - .05, WALL_Y - .08, .08, C.gold, 1.4);
arcStrip(WALL_R - .05, WALL_Y + WALL_H + .1, .1, C.pink, 1.6);
// dunkle Blende/Sockel unter der Wand
const plinth = new THREE.Mesh(new THREE.CylinderGeometry(WALL_R + .1, WALL_R + .1, WALL_Y - .12, 96, 1, true, Math.PI - WALL_ARC / 2, WALL_ARC),
  new THREE.MeshStandardMaterial({ color: 0x0a1424, metalness: .6, roughness: .35, side: THREE.DoubleSide }));
plinth.position.set(0, (WALL_Y - .12) / 2, WALL_CZ);
scene.add(plinth);

// ---------- Seitliche LED-Säulen mit Schrift ----------
function pillarTex(lines, accent) {
  return canvasTex(256, 1536, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0F233D'); g.addColorStop(.6, '#1B2A5C'); g.addColorStop(1, '#3A1F5E');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.translate(w / 2, h * .3); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((t, i) => glowText(ctx, t, 0, (i - (lines.length - 1) / 2) * 78, '600 52px "Josefin Sans"', '#F3E5AB', accent, 24));
    ctx.restore();
    ctx.fillStyle = accent; ctx.fillRect(0, 0, 10, h); ctx.fillRect(w - 10, 0, 10, h);
  });
}
function pillar(x, z, rotY, tex) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 9, .5),
    new THREE.MeshStandardMaterial({ color: 0x07101e, metalness: .7, roughness: .3 }));
  body.position.y = 4.5; g.add(body);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 8.6), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.set(0, 4.55, .26); g.add(screen);
  g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g); return g;
}
pillar(-9.2, -7.4, .55, pillarTex(['MUSIK', 'VERBINDET HERZEN'], '#FF4D8D'));
pillar(9.2, -7.4, -.55, pillarTex(['MUT · WURZELN', 'ZUKUNFT'], '#39B8FF'));

// Hintere Lichtlamellen (Tiefe hinter der Wand)
for (let i = -7; i <= 7; i++) {
  if (Math.abs(i) < 5) continue;
  const bar = new THREE.Mesh(new THREE.BoxGeometry(.08, 11, .08), emissive(i % 2 ? C.blue : C.violet, .9));
  bar.position.set(i * 2.05, 5.5, -13 - Math.abs(i) * .3); scene.add(bar);
}

// ---------- Decke: Traverse mit Scheinwerfern und Lichtkegeln ----------
const truss = new THREE.Mesh(new THREE.BoxGeometry(30, .25, .25), new THREE.MeshStandardMaterial({ color: 0x1a2235, metalness: .9, roughness: .4 }));
truss.position.set(0, 11.2, -2); scene.add(truss);
const beams = [];
const beamMat = (col) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  uniforms: { col: { value: new THREE.Color(col) }, k: { value: .16 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform vec3 col; uniform float k; varying vec2 vUv; void main(){ float a=pow(vUv.y,1.6)*k*(1.-abs(vUv.x-.5)*1.2); gl_FragColor=vec4(col*a,a); }',
});
[[-8, C.pink], [-4, C.blue], [4, C.blue], [8, C.pink], [0, C.gold]].forEach(([x, col], i) => {
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.22, .3, .45, 24), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: .9, roughness: .3 }));
  lamp.position.set(x, 10.9, -2); scene.add(lamp);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.2, 24), emissive(col, 2.5));
  lens.rotation.x = Math.PI / 2; lens.position.set(x, 10.66, -2); scene.add(lens);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 10.6, 40, 1, true), beamMat(col));
  const pivot = new THREE.Group(); pivot.position.set(x, 10.66, -2); scene.add(pivot);
  cone.position.y = -5.3; pivot.add(cone);
  pivot.userData = { base: x * -.035, phase: i * 1.3 };
  beams.push(pivot);
});

// ---------- Moderationstisch ----------
const desk = new THREE.Group();
const DESK_C = new THREE.Vector3(0, 0, -.2); // Mittelpunkt des Bogens
const R_IN = 2.5, R_OUT = 3.25, DESK_ARC = 1.25, DESK_H = 1.05;
const deskMat = new THREE.MeshPhysicalMaterial({ color: 0x0b1628, metalness: .55, roughness: .18, clearcoat: 1, clearcoatRoughness: .08 });
const topMat = new THREE.MeshPhysicalMaterial({ color: 0x9aa6bc, metalness: .3, roughness: .2, clearcoat: 1, clearcoatRoughness: .05 });
function arcShape(r1, r2, arc) {
  const s = new THREE.Shape();
  const a0 = -Math.PI / 2 - arc / 2, a1 = -Math.PI / 2 + arc / 2;
  s.absarc(0, 0, r2, a0, a1, false); s.absarc(0, 0, r1, a1, a0, true); return s;
}
// Korpus
const body = new THREE.Mesh(new THREE.ExtrudeGeometry(arcShape(R_IN, R_OUT, DESK_ARC), { depth: DESK_H - .08, bevelEnabled: false, curveSegments: 64 }), deskMat);
body.rotation.x = -Math.PI / 2; desk.add(body);
// Tischplatte (weiß glänzend, leicht überstehend)
const top = new THREE.Mesh(new THREE.ExtrudeGeometry(arcShape(R_IN - .15, R_OUT + .12, DESK_ARC + .08), { depth: .08, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 3, curveSegments: 64 }), topMat);
top.rotation.x = -Math.PI / 2; top.position.y = DESK_H - .08; desk.add(top);

// Logo-Front
const logoTex = canvasTex(2048, 640, (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#050E1A'); g.addColorStop(.5, '#0F233D'); g.addColorStop(1, '#050E1A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.font = '230px "Great Vibes"'; const wHerz = ctx.measureText('Herz').width;
  ctx.font = '400 168px Montserrat'; const wGed = ctx.measureText('Gedanken').width;
  let x = (w - wHerz - wGed - 210) / 2;
  glowText(ctx, 'Herz', x, 380, '230px "Great Vibes"', '#FFE3C8', '#F28A5B', 40);
  glowText(ctx, 'Gedanken', x + wHerz + 6, 380, '400 168px Montserrat', '#FFFFFF', '#8EA2FF', 36);
  ctx.lineWidth = 12; ctx.strokeStyle = '#FF6FA0'; ctx.shadowColor = '#FF4D8D';
  for (const b of [40, 16, 0]) { ctx.shadowBlur = b; heartPath(ctx, w - x - 85, 300, 92); ctx.stroke(); }
  ctx.shadowBlur = 0; ctx.textAlign = 'center';
  glowText(ctx, 'R  A  D  I  O    ·    T  V', w / 2, 520, '400 64px "Josefin Sans"', '#F3E5AB', '#D4AF37', 20);
});
const front = new THREE.Mesh(
  new THREE.CylinderGeometry(R_OUT + .01, R_OUT + .01, .62, 96, 1, true, -.62, 1.24),
  new THREE.MeshBasicMaterial({ map: logoTex, toneMapped: false }));
front.position.y = .56; desk.add(front);
// Leuchtstreifen am Tisch
const s1 = new THREE.Mesh(new THREE.CylinderGeometry(R_OUT + .02, R_OUT + .02, .035, 96, 1, true, -DESK_ARC / 2, DESK_ARC), emissive(C.gold, 1.6));
s1.position.y = .93; desk.add(s1);
const s2 = new THREE.Mesh(new THREE.CylinderGeometry(R_OUT + .02, R_OUT + .02, .05, 96, 1, true, -DESK_ARC / 2, DESK_ARC), emissive(C.pink, 1.8));
s2.position.y = .06; desk.add(s2);
desk.position.copy(DESK_C);
scene.add(desk);

// Zwei Monitore auf dem Tisch-Niveau links/rechts (Studiogeräte)
function monitor(x, z, rotY, tex) {
  const g = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.1, 16), new THREE.MeshStandardMaterial({ color: 0x1b2333, metalness: .9, roughness: .3 }));
  stand.position.y = 1.05; g.add(stand);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.45, .5, .05, 32), stand.material); g.add(foot);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.36, .08), new THREE.MeshStandardMaterial({ color: 0x0b0f18, metalness: .8, roughness: .3 }));
  frame.position.y = 2.6; g.add(frame);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.24), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  scr.position.set(0, 2.6, .045); g.add(scr);
  g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
}
const liveTex = canvasTex(1024, 576, (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#C2185B'); g.addColorStop(1, '#5B2A86');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w / 2 - 300, h / 2 - 20, 30, 0, 7); ctx.fill();
  glowText(ctx, 'ON AIR', w / 2 + 30, h / 2 - 14, '800 150px Montserrat', '#fff', '#FF9EC0', 30);
  glowText(ctx, 'Mehr als Radio ♥', w / 2, h - 90, '600 56px "Josefin Sans"', '#F3E5AB', '#000', 0);
});
const claimTex = canvasTex(1024, 576, (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#0F233D'); g.addColorStop(1, '#20B2AA');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  glowText(ctx, 'Gute Musik', w / 2, 190, '110px "Great Vibes"', '#FFE3C8', '#F28A5B', 24);
  glowText(ctx, 'für starke Menschen', w / 2, 330, '110px "Great Vibes"', '#FFE3C8', '#F28A5B', 24);
  glowText(ctx, 'EHRLICH · MENSCHLICH · OHNE FILTER', w / 2, 480, '600 40px "Josefin Sans"', '#F3E5AB', '#000', 0);
});
monitor(-5.4, -.6, .4, liveTex);
monitor(5.4, -.6, -.4, claimTex);

// ---------- Licht ----------
scene.add(new THREE.HemisphereLight(0x8fb3ff, 0x1a0b26, .35));
const key = new THREE.SpotLight(0xfff1e0, 60, 30, .5, .6, 1.5); key.position.set(0, 7, 9); key.target.position.set(0, .8, 0);
scene.add(key, key.target);
const pinkL = new THREE.PointLight(C.pink, 40, 18, 1.6); pinkL.position.set(-6, 3, 2); scene.add(pinkL);
const blueL = new THREE.PointLight(C.blue, 40, 18, 1.6); blueL.position.set(6, 3, 2); scene.add(blueL);
const wallL = new THREE.PointLight(0x7a6cff, 30, 20, 1.6); wallL.position.set(0, 4, -8); scene.add(wallL);

// ---------- Nachbearbeitung (Bloom wie bei LED-Studios) ----------
const composer = new EffectComposer(renderer);
composer.setPixelRatio(1); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), .55, .55, .82));
composer.addPass(new OutputPass());

// ---------- Kamerafahrt (nahtloser Loop über LOOP Sekunden) ----------
const look = new THREE.Vector3();
function update(t) {
  const p = (t % LOOP) / LOOP * Math.PI * 2;
  const still = P.get('still');
  const sx = still ? 0 : Math.sin(p) * 1.6;
  camera.position.set(sx, 2.3 + (still ? 0 : Math.sin(p * 2) * .07), 11.4 + (still ? 0 : Math.cos(p) * .35));
  look.set(sx * .25, 2.95, -4);
  camera.lookAt(look);
  beams.forEach(b => { b.rotation.z = b.userData.base + Math.sin(p + b.userData.phase) * .12; });
  rings.children.forEach((r, i) => r.material.color.setHex([C.pink, C.blue, C.gold][i]).multiplyScalar(1 + .5 * Math.sin(p * 4 + i * 1.7)));
}
function frame(t) { update(t); composer.render(); }

// ---------- Start ----------
window.studio = {
  // für Video-Export: exakten Zeitpunkt rendern (inkl. Wandvideo)
  async renderAt(t) {
    if (useVideo && video.readyState >= 1) {
      await new Promise(res => { video.onseeked = res; video.currentTime = t % video.duration; });
      wallTex.needsUpdate = true;
    }
    frame(t);
  },
};

async function start() {
  await document.fonts.ready;
  await Promise.all(['230px "Great Vibes"', '400 168px Montserrat', '600 62px "Josefin Sans"', '800 150px Montserrat']
    .map(f => document.fonts.load(f).catch(() => {})));
  canvasTexs.forEach(t => t.userData.redraw());
  if (useVideo) {
    const ok = await new Promise(res => {
      video.onloadeddata = () => res(true); video.onerror = () => res(false);
      setTimeout(() => res(video.readyState >= 2), 4000);
      video.load();
    });
    if (!ok) { useVideo = false; wallMat.map = imageTex(); wallMat.map.wrapS = THREE.RepeatWrapping; wallMat.map.repeat.x = -1; wallMat.map.offset.x = 1; wallMat.needsUpdate = true; }
    else if (!P.get('capture')) video.play().catch(() => {});
  }
  window.studio.ready = true;
  if (!P.get('capture')) {
    const t0 = performance.now();
    renderer.setAnimationLoop(() => frame((performance.now() - t0) / 1000));
  } else frame(0);
}
start();
