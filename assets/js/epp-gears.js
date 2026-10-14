// Macchina del piano partecipato: ruote incastrate, nessuna molla centrale.
// A turno una ruota dà la spinta (tratto a sanguigna) e tutta la macchina si ricalibra sulla sua velocità.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const canvas = document.getElementById('epp-gears');

// n = denti, parent = ruota con cui ingrana, deg = direzione dal centro del parent
const GEARS = [
  { n: 32, parent: -1, deg: 0 },
  { n: 14, parent: 0, deg: 10 },
  { n: 26, parent: 1, deg: -35 },
  { n: 12, parent: 2, deg: 20 },
  { n: 20, parent: 0, deg: 150 },
  { n: 10, parent: 4, deg: 95 },
  { n: 28, parent: 4, deg: 215 },
  { n: 16, parent: 0, deg: 265 },
  { n: 18, parent: 2, deg: -110 },
  { n: 22, parent: 3, deg: 70 }
];
const MOD = 0.12;
const TURN_MS = 5200;
const SPEED = 0.22;
const SEPIA = '#6B4F33';

const css = getComputedStyle(document.documentElement);
const PAPER = css.getPropertyValue('--epp-bg').trim() || '#F1F1EE';
const ACCENT = css.getPropertyValue('--epp-accent').trim() || '#B83A22';

const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)];

// ruota di legno: denti a piolo arrotondati, cerchione, razze e mozzo
function wheelShape(n, R) {
  const ra = R + MOD, rf = R - 1.25 * MOD, p = (Math.PI * 2) / n;
  const prof = [[rf, -0.5], [rf, -0.25], [R, -0.2], [R + 0.7 * MOD, -0.15], [ra, -0.07], [ra, 0.07], [R + 0.7 * MOD, 0.15], [R, 0.2], [rf, 0.25]];
  const s = new THREE.Shape();
  for (let i = 0; i < n; i++) {
    prof.forEach(([r, f], k) => {
      const [x, y] = polar(r, (i + f) * p);
      if (i === 0 && k === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
  }
  s.closePath();

  const rim = rf - Math.max(0.1, R * 0.16);
  const hub = Math.max(0.12, R * 0.24);
  if (R > 0.65) {
    const spokes = R > 1.3 ? 6 : R > 0.9 ? 5 : 4;
    const half = 0.05 + R * 0.035;
    const dO = Math.asin(half / rim), dI = Math.asin(Math.min(0.9, half / hub));
    for (let j = 0; j < spokes; j++) {
      const a0 = (j * Math.PI * 2) / spokes, a1 = ((j + 1) * Math.PI * 2) / spokes;
      const hole = new THREE.Path();
      const [sx, sy] = polar(rim, a0 + dO);
      hole.moveTo(sx, sy);
      hole.absarc(0, 0, rim, a0 + dO, a1 - dO, false);
      const [ix, iy] = polar(hub, a1 - dI);
      hole.lineTo(ix, iy);
      hole.absarc(0, 0, hub, a1 - dI, a0 + dI, true);
      hole.closePath();
      s.holes.push(hole);
    }
  }
  const axle = new THREE.Path();
  axle.absarc(0, 0, Math.max(0.05, R * 0.08), 0, Math.PI * 2, true);
  s.holes.push(axle);
  return s;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 20);

  // foglio inclinato, come un disegno in prospettiva da codice
  const rig = new THREE.Group();
  rig.rotation.set(-0.5, 0.32, 0.04);
  scene.add(rig);

  const g = GEARS.map((d) => ({ ...d, R: (MOD * d.n) / 2, x: 0, y: 0, th: (d.deg * Math.PI) / 180, k: 1 }));
  g.forEach((d) => {
    if (d.parent < 0) return;
    const p = g[d.parent];
    d.x = p.x + Math.cos(d.th) * (p.R + d.R);
    d.y = p.y + Math.sin(d.th) * (p.R + d.R);
    d.k = (-p.k * p.n) / d.n;
  });
  const minX = Math.min(...g.map((d) => d.x - d.R)), maxX = Math.max(...g.map((d) => d.x + d.R));
  const minY = Math.min(...g.map((d) => d.y - d.R)), maxY = Math.max(...g.map((d) => d.y + d.R));
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const spanW = maxX - minX, spanH = maxY - minY;

  const sepia = new THREE.Color(SEPIA);
  const red = new THREE.Color(ACCENT);
  const guideMat = new THREE.LineBasicMaterial({ color: SEPIA, transparent: true, opacity: 0.18, depthWrite: false });
  const dashMat = new THREE.LineDashedMaterial({ color: SEPIA, transparent: true, opacity: 0.3, dashSize: 0.07, gapSize: 0.06, depthWrite: false });
  const seg = (pts, mat) => {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(([x, y]) => new THREE.Vector3(x, y, 0.12))), mat);
    line.computeLineDistances();
    line.renderOrder = 1;
    rig.add(line);
  };

  g.forEach((d) => {
    const ox = d.x - cx, oy = d.y - cy;
    const geo = new THREE.ExtrudeGeometry(wheelShape(d.n, d.R), { depth: 0.2, bevelEnabled: false, curveSegments: 20 });
    geo.translate(0, 0, -0.1);
    const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: PAPER, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
    d.lineMat = new THREE.LineBasicMaterial({ color: sepia.clone(), transparent: true, opacity: 0.5, depthWrite: false });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 24), d.lineMat);
    edges.renderOrder = 2;
    d.wheel = new THREE.Group();
    d.wheel.add(fill, edges);
    d.wheel.position.set(ox, oy, 0);
    rig.add(d.wheel);

    // linee di costruzione: circonferenza primitiva, croce del centro, linea dei centri
    const circ = [];
    for (let i = 0; i <= 96; i++) {
      const [x, y] = polar(d.R, (i / 96) * Math.PI * 2);
      circ.push([ox + x, oy + y]);
    }
    seg(circ, dashMat);
    const arm = d.R * 1.3;
    seg([[ox - arm, oy], [ox + arm, oy]], guideMat);
    seg([[ox, oy - arm], [ox, oy + arm]], guideMat);
    if (d.parent >= 0) seg([[g[d.parent].x - cx, g[d.parent].y - cy], [ox, oy]], guideMat);
  });

  // la rotazione di ogni ruota deriva da quella con cui ingrana: i denti restano incastrati
  const place = (phi) => {
    g.forEach((d) => {
      if (d.parent < 0) d.rot = phi;
      else {
        const p = g[d.parent];
        const p1 = (p.n * (d.th - p.rot)) / (Math.PI * 2);
        d.rot = d.th + Math.PI - ((Math.PI * 2) / d.n) * (0.5 - p1);
      }
      d.wheel.rotation.z = d.rot;
    });
  };

  // riempie l'area come uno sfondo: le ruote escono dai bordi
  const resize = () => {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const halfH = (Math.min(spanH, spanW / aspect) / 2) * 0.96;
    camera.left = -halfH * aspect;
    camera.right = halfH * aspect;
    camera.top = halfH;
    camera.bottom = -halfH;
    camera.updateProjectionMatrix();
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let drv = 0, phi = 0, vel = SPEED / Math.abs(g[0].k), last = performance.now(), visible = true, t = 0;

  const paint = (dt) => {
    const e = Math.min(1, dt * 2.5);
    g.forEach((d, i) => {
      const on = i === drv;
      d.lineMat.color.lerp(on ? red : sepia, e);
      d.lineMat.opacity += ((on ? 0.85 : 0.5) - d.lineMat.opacity) * e;
    });
    rig.rotation.y = 0.32 + Math.sin(t * 0.12) * 0.04;
    place(phi);
    renderer.render(scene, camera);
  };

  const tick = (now) => {
    requestAnimationFrame(tick);
    if (!visible) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    // cambia chi spinge: tutta la macchina si ricalibra sulla sua velocità
    const target = SPEED / Math.abs(g[drv].k);
    vel += (target - vel) * (1 - Math.exp(-dt * 1.2));
    phi += vel * dt;
    paint(dt);
  };

  resize();
  new ResizeObserver(() => { resize(); if (reduce) paint(1); }).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);
  setInterval(() => {
    drv = (drv + 1 + Math.floor(Math.random() * (g.length - 1))) % g.length;
    if (reduce) paint(1);
  }, TURN_MS);

  if (reduce) paint(1);
  else requestAnimationFrame(tick);
}

if (canvas) init();
