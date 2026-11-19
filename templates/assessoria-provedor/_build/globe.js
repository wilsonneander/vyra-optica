// Globo animado da home (seção "Quem somos"): canvas 2D, sem biblioteca.
// Os continentes são polígonos simplificados (lon, lat) desenhados à mão; no build eles viram uma grade de
// pontos de área igual, gravada em faixas (início, tamanho) por latitude para o arquivo ficar pequeno.
// No navegador: projeção ortográfica, grade de meridianos, arcos de conexão entre cidades e o Rio (sede) em laranja.

const LAND = [
  // América do Norte
  [[-168, 66], [-162, 70], [-140, 70], [-125, 70], [-95, 72], [-80, 73], [-65, 62], [-56, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-83, 29], [-90, 30], [-97, 27], [-97, 21], [-92, 18], [-87, 21], [-88, 15], [-83, 9], [-79, 8], [-82, 8], [-86, 12], [-92, 14], [-105, 20], [-110, 23], [-115, 30], [-118, 34], [-124, 40], [-124, 48], [-130, 55], [-140, 60], [-152, 59], [-165, 55], [-158, 58], [-166, 62]],
  [[-120, 72], [-80, 73], [-70, 80], [-90, 82], [-120, 78]],
  // Groenlândia e Islândia
  [[-55, 60], [-44, 60], [-20, 70], [-18, 80], [-35, 83], [-60, 82], [-72, 78], [-58, 75], [-52, 68]],
  [[-24, 64], [-14, 64], [-14, 66.5], [-22, 66.5]],
  // América do Sul
  [[-80, 9], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -14], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-62, -41], [-65, -45], [-68, -52], [-72, -54], [-75, -48], [-73, -38], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -1], [-78, 3], [-77, 8]],
  // Eurásia
  [[-10, 36], [-9, 43], [-2, 43.5], [-4.5, 48], [2, 51], [8, 54], [8, 57], [10, 58], [5, 59], [5, 62], [13, 66], [18, 70], [26, 71], [33, 70], [41, 67], [44, 68], [60, 69], [70, 73], [80, 73], [100, 77], [112, 74], [130, 71], [150, 71], [170, 70], [180, 68], [180, 65], [170, 60], [163, 57], [156, 51], [155, 58], [142, 59], [135, 54], [141, 48], [135, 43], [130, 42], [129, 35], [126, 38], [121, 40], [122, 37], [119, 35], [122, 30], [121, 25], [114, 22], [108, 21], [106, 17], [109, 12], [105, 9], [100, 13], [100, 6], [104, 1], [100, 3], [98, 8], [98, 16], [94, 17], [92, 22], [88, 22], [85, 20], [80, 15], [78, 8], [73, 16], [72, 21], [67, 25], [62, 25], [57, 26], [59, 22], [56, 18], [52, 16], [43, 12], [39, 20], [35, 28], [34, 30], [35, 32], [36, 36], [30, 36], [27, 37], [26, 40], [23, 40], [22, 37], [20, 40], [19, 42], [15, 45], [13, 45], [16, 41], [18, 40], [16, 38], [12, 42], [9, 44], [3, 43], [-1, 37], [-6, 36]],
  // Reino Unido e Irlanda
  [[-5, 50], [1, 51], [2, 53], [-2, 56], [-2, 58.5], [-6, 58.5], [-5, 55], [-3, 54], [-5, 52]],
  [[-10, 52], [-6, 52], [-6, 55], [-8, 55]],
  // África e Madagascar
  [[-17, 21], [-16, 15], [-17, 12], [-12, 7], [-8, 4], [-2, 5], [5, 6], [9, 4], [10, -2], [12, -6], [13, -12], [12, -17], [15, -27], [18, -34], [22, -34], [27, -33], [32, -28], [35, -24], [40, -15], [40, -10], [39, -5], [42, 0], [46, 2], [51, 11], [44, 11], [43, 12], [39, 16], [37, 22], [35, 28], [32, 31], [25, 32], [20, 31], [20, 33], [11, 33], [11, 37], [3, 37], [-6, 36], [-10, 30], [-13, 27]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -16]],
  // Japão, Filipinas, Indonésia, Nova Guiné
  [[130, 31], [132, 34], [135, 34], [140, 35], [141, 41], [141, 45], [144, 44], [141, 42], [140, 38], [136, 36]],
  [[120, 18], [122, 18], [126, 7], [122, 7], [120, 14]],
  [[95, 5], [106, -6], [104, -5], [98, 2]],
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
  [[105, -6], [115, -8], [114, -7]],
  [[131, -1], [141, -3], [150, -10], [141, -9], [137, -5]],
  // Austrália e Nova Zelândia
  [[114, -22], [114, -34], [118, -35], [124, -33], [131, -31], [135, -34], [138, -35], [141, -38], [147, -38], [150, -37], [153, -28], [153, -25], [146, -19], [142, -10], [141, -17], [136, -12], [130, -12], [126, -14], [122, -18]],
  [[172, -34], [178, -38], [175, -41.5], [172, -41]],
  [[172, -41], [174.5, -41.5], [171, -46], [167, -46]],
];

const STEP = 2, LAT0 = -56, LAT1 = 82;
const inside = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const rows = [];
for (let lat = LAT0; lat <= LAT1; lat += STEP) {
  const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP)), runs = [];
  let start = -1;
  for (let i = 0; i <= n; i++) {
    const on = i < n && LAND.some((p) => inside(-180 + ((i + 0.5) * 360) / n, lat, p));
    if (on && start < 0) start = i;
    if (!on && start >= 0) { runs.push(start, i - start); start = -1; }
  }
  rows.push(runs);
}

// Cidades: [lon, lat]. A primeira é o Rio de Janeiro, sede da THD.
const HUBS = [[-43.2, -22.9], [-46.6, -23.5], [-38.5, -3.7], [-58.4, -34.6], [-70.6, -33.4], [-74.1, 4.7], [-80.2, 25.8], [-74, 40.7], [-118.2, 34], [-79.4, 43.7], [-9.1, 38.7], [-0.1, 51.5], [8.7, 50.1], [3.4, 6.5], [28, -26.2], [55.3, 25.2], [72.9, 19], [103.8, 1.3], [139.7, 35.7], [151.2, -33.9], [114.2, 22.3], [37.6, 55.8]];
// Rotas fixas que saem do Brasil (cabos submarinos reais saem de Fortaleza e do Rio), sorteadas com mais frequência
const BR = [[0, 7], [0, 10], [2, 10], [2, 6], [0, 13], [1, 4], [0, 14], [2, 7], [1, 3], [0, 5]];

const globeJs = `/* THD Engenharia · globo da home · gerado por _build/build.js (edite _build/globe.js) */
(function () {
  var box = document.querySelector('[data-globe]'); if (!box) return;
  var cv = box.querySelector('canvas'), ctx = cv.getContext('2d'); if (!ctx) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROWS = ${JSON.stringify(rows)}, STEP = ${STEP}, LAT0 = ${LAT0};
  var HUBS = ${JSON.stringify(HUBS)}, BR = ${JSON.stringify(BR)};
  var D = Math.PI / 180, PX = [], PY = [], PC = [], PS = [];
  ROWS.forEach(function (runs, k) { var lat = (LAT0 + k * STEP) * D, n = Math.max(1, Math.round(360 * Math.cos(lat) / STEP));
    for (var r = 0; r < runs.length; r += 2) for (var i = runs[r]; i < runs[r] + runs[r + 1]; i++) { var lon = (-180 + (i + .5) * 360 / n) * D; PS.push(Math.sin(lon)); PC.push(Math.cos(lon)); PY.push(Math.sin(lat)); PX.push(Math.cos(lat)); } });
  var N = PY.length;
  var vec = function (lon, lat) { lon *= D; lat *= D; return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]; };
  var H = HUBS.map(function (h) { return vec(h[0], h[1]); });

  /* estado da câmera: rot = giro (rad), tilt = inclinação */
  var rot = 40 * D, tilt = 12 * D, vel = reduce ? 0 : .0011, auto = .0011, W = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  var cr, sr, ct, st;
  var cam = function () { cr = Math.cos(rot); sr = Math.sin(rot); ct = Math.cos(tilt); st = Math.sin(tilt); };
  /* gira um vetor unitário (x, y, z) com a câmera e devolve [X, Y, z, raio2] na tela */
  var out = [0, 0, 0, 0];
  var proj = function (x, y, z, m) { var x1 = x * cr + z * sr, z1 = z * cr - x * sr, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct; out[0] = cx + R * m * x1; out[1] = cy - R * m * y2; out[2] = z2; out[3] = (x1 * x1 + y2 * y2) * m * m; return out; };

  /* arcos: interpolação esférica entre duas cidades, erguida no meio */
  var arcs = [], SEG = 56;
  var slerp = function (a, b, t) { var d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))), s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s; return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2, d]; };
  var addArc = function (i, j, now) { var a = H[i], b = H[j], pts = [], d = slerp(a, b, .5)[3], lift = .06 + d * .16;
    for (var s = 0; s <= SEG; s++) { var t = s / SEG, p = slerp(a, b, t); pts.push([p[0], p[1], p[2], 1 + lift * Math.sin(Math.PI * t)]); }
    arcs.push({ pts: pts, t0: now, dur: 1800 + d * 900, home: i === 0 || j === 0, to: j }); };
  var visible = function (i) { var v = H[i]; proj(v[0], v[1], v[2], 1); return out[2] > .15; };
  var spawn = function (now) { var i, j, tries = 0;
    do { if (Math.random() < .55) { var r = BR[(Math.random() * BR.length) | 0]; i = r[0]; j = r[1]; } else { i = (Math.random() * H.length) | 0; j = (Math.random() * H.length) | 0; } tries++; }
    while ((i === j || !(visible(i) || visible(j))) && tries < 20);
    if (i !== j) { if (Math.random() < .5 && j !== 0) { var x = i; i = j; j = x; } addArc(i, j, now); } };
  var pulses = [];

  var size = function () { var r = box.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; var h = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, h) * .4; cx = W / 2; cy = h / 2; draw(performance.now()); };

  var draw = function (now) {
    var h = cv.height / dpr; cam(); ctx.clearRect(0, 0, W, h);
    /* halo e corpo do globo */
    var g = ctx.createRadialGradient(cx, cy, R * .9, cx, cy, R * 1.32); g.addColorStop(0, 'rgba(43,90,168,.38)'); g.addColorStop(1, 'rgba(43,90,168,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.32, 0, 7); ctx.fill();
    g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R); g.addColorStop(0, '#163A78'); g.addColorStop(.65, '#0A2452'); g.addColorStop(1, '#061738');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    /* grade de meridianos e paralelos (só a face da frente) */
    ctx.strokeStyle = 'rgba(160,195,255,.09)'; ctx.lineWidth = 1; ctx.beginPath();
    var line = function (fn, n) { var pen = false; for (var s = 0; s <= n; s++) { var v = fn(s / n); proj(v[0], v[1], v[2], 1); if (out[2] > 0) { pen ? ctx.lineTo(out[0], out[1]) : ctx.moveTo(out[0], out[1]); pen = true; } else pen = false; } };
    for (var m = 0; m < 12; m++) line(function (t) { return vec(m * 30, -90 + t * 180); }, 40);
    for (var p = -60; p <= 60; p += 30) line(function (t) { return vec(-180 + t * 360, p); }, 80);
    ctx.stroke();
    /* continentes em pontos, agrupados por brilho para desenhar rápido */
    var buckets = [[], [], [], []], sz = Math.max(1.3, R / 150);
    for (var k = 0; k < N; k++) { var x = PX[k] * PS[k], y = PY[k], z = PX[k] * PC[k];
      var x1 = x * cr + z * sr, z1 = z * cr - x * sr, z2 = y * st + z1 * ct; if (z2 <= 0) continue;
      buckets[Math.min(3, (z2 * 4) | 0)].push(cx + R * x1, cy - R * (y * ct - z1 * st)); }
    buckets.forEach(function (b, i) { ctx.fillStyle = 'rgba(190,214,255,' + (.18 + i * .2) + ')'; ctx.beginPath(); var s = sz * (.7 + i * .12);
      for (var q = 0; q < b.length; q += 2) ctx.rect(b[q] - s / 2, b[q + 1] - s / 2, s, s); ctx.fill(); });
    /* borda iluminada */
    ctx.strokeStyle = 'rgba(140,185,255,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();

    /* arcos de conexão: a cabeça corre pela rota e a cauda some atrás */
    ctx.lineCap = 'round';
    arcs = arcs.filter(function (a) { var t = reduce ? 1.4 : (now - a.t0) / a.dur; if (t > 2) return false;
      var head = Math.min(1, t), tail = Math.max(0, t - 1), i0 = Math.floor(tail * SEG), i1 = Math.ceil(head * SEG), col = a.home ? '254,87,16' : '150,195,255';
      for (var s = i0; s < i1; s++) { var A = a.pts[s], B = a.pts[s + 1];
        proj(A[0], A[1], A[2], A[3]); var ax = out[0], ay = out[1], av = out[2] > 0 || out[3] > 1;
        proj(B[0], B[1], B[2], B[3]); if (!av || !(out[2] > 0 || out[3] > 1)) continue;
        var f = (s - i0) / Math.max(1, i1 - i0); ctx.strokeStyle = 'rgba(' + col + ',' + (.15 + f * .75) + ')'; ctx.lineWidth = a.home ? 1.8 : 1.3;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(out[0], out[1]); ctx.stroke(); }
      if (t < 1 && !reduce) { var P = a.pts[i1]; proj(P[0], P[1], P[2], P[3]); if (out[2] > 0 || out[3] > 1) { ctx.fillStyle = 'rgb(' + col + ')'; ctx.beginPath(); ctx.arc(out[0], out[1], 2.4, 0, 7); ctx.fill(); } }
      if (t >= 1 && !a.hit) { a.hit = 1; pulses.push({ i: a.to, t0: now }); }
      return true; });

    /* cidades e pulsos de chegada */
    H.forEach(function (v, i) { proj(v[0], v[1], v[2], 1); if (out[2] <= 0) return; var al = Math.min(1, out[2] * 2);
      ctx.fillStyle = i === 0 ? 'rgba(254,87,16,' + al + ')' : 'rgba(255,255,255,' + (al * .85) + ')'; ctx.beginPath(); ctx.arc(out[0], out[1], i === 0 ? 3.6 : 2, 0, 7); ctx.fill(); });
    pulses = pulses.filter(function (p) { var t = (now - p.t0) / 1100; if (t > 1) return false; var v = H[p.i]; proj(v[0], v[1], v[2], 1); if (out[2] <= 0) return true;
      ctx.strokeStyle = (p.i === 0 ? 'rgba(254,87,16,' : 'rgba(170,205,255,') + (1 - t) * .8 + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(out[0], out[1], 3 + t * 14, 0, 7); ctx.stroke(); return true; });
    /* a sede: anel laranja que respira e o nome da cidade */
    var r0 = H[0]; proj(r0[0], r0[1], r0[2], 1);
    if (out[2] > .05) { var al = Math.min(1, out[2] * 2.5), b = reduce ? .5 : (now % 2400) / 2400, rx = out[0], ry = out[1];
      ctx.strokeStyle = 'rgba(254,87,16,' + al * (1 - b) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(rx, ry, 5 + b * 16, 0, 7); ctx.stroke();
      ctx.font = '600 12px Onest, Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,' + al + ')'; ctx.fillText('Rio de Janeiro', rx + 12, ry + 4); }
  };

  /* laço: só roda com o globo na tela e a aba visível */
  var on = false, raf = 0, lastSpawn = 0, drag = null;
  var loop = function (now) { raf = 0; if (!on) return;
    if (!drag) { rot += vel; vel += (auto - vel) * .02; }
    if (now - lastSpawn > 520 && arcs.length < 9) { spawn(now); lastSpawn = now; }
    draw(now); raf = requestAnimationFrame(loop); };
  var play = function () { if (!raf && on && !reduce) raf = requestAnimationFrame(loop); };
  if (reduce) { var t = performance.now(); cam(); for (var z = 0; z < 7; z++) spawn(t); }
  new IntersectionObserver(function (es) { on = es[0].isIntersecting && !document.hidden; play(); }, { rootMargin: '80px' }).observe(box);
  document.addEventListener('visibilitychange', function () { on = !document.hidden && box.getBoundingClientRect().bottom > 0 && box.getBoundingClientRect().top < innerHeight; play(); });

  /* arrastar para girar (na horizontal; a rolagem vertical do celular continua livre) */
  box.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, r: rot, tl: tilt, lx: e.clientX, lt: e.timeStamp }; box.classList.add('grab'); box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', function (e) { if (!drag) return; var k = 1.6 / R;
    rot = drag.r + (e.clientX - drag.x) * k; tilt = Math.max(-.5, Math.min(.6, drag.tl + (e.clientY - drag.y) * k * .5));
    vel = (e.clientX - drag.lx) * k / Math.max(8, e.timeStamp - drag.lt) * 16; drag.lx = e.clientX; drag.lt = e.timeStamp; if (reduce) draw(performance.now()); });
  var end = function () { if (!drag) return; drag = null; box.classList.remove('grab'); vel = Math.max(-.05, Math.min(.05, vel)); };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);

  ('ResizeObserver' in window) ? new ResizeObserver(size).observe(box) : addEventListener('resize', size);
  size(); if (document.fonts) document.fonts.ready.then(function () { draw(performance.now()); });
})();
`;

module.exports = { globeJs, dots: rows.reduce((n, r) => n + r.filter((_, i) => i % 2).reduce((a, b) => a + b, 0), 0) };
