/* THD Engenharia · globo da home · gerado por _build/build.js (edite _build/globe.js) */
(function () {
  var box = document.querySelector('[data-globe]'); if (!box) return;
  var cv = box.querySelector('canvas'), ctx = cv.getContext('2d'); if (!ctx) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROWS = [[],[],[33,2],[34,2],[35,3],[37,3,120,2],[38,3,125,1],[40,4,131,1],[41,5,135,2],[42,6,127,2,139,2],[44,6,129,5,143,1],[45,8,82,2,122,3,130,7],[46,9,84,4,125,6,133,8],[47,9,85,6,127,17],[48,10,86,8,130,17],[49,10,88,8,132,18],[50,12,88,10,102,2,134,17],[51,13,90,10,104,2,136,17],[52,13,91,11,105,2,140,14],[52,14,91,13,106,3,143,12],[51,17,92,13,108,2,146,10],[51,18,94,13,110,2,149,6,156,1],[50,20,94,14,157,1],[50,21,95,13],[50,22,95,14,158,4],[49,23,95,14,158,4],[50,21,95,15,158,3],[50,18,95,15,145,4,156,2],[50,15,95,16,145,4],[51,14,95,18,141,1,145,4],[51,13,94,20,140,1,146,3],[51,12,84,29,147,1],[48,2,51,10,83,30,137,1,149,2],[50,9,81,32,126,1,137,1,140,1,148,2],[80,29,125,2,136,5,147,2],[43,2,80,27,108,3,124,2,135,5,146,2],[40,4,79,26,106,5,122,3,134,4,144,1],[38,6,78,34,120,5,130,6],[35,5,43,1,77,25,103,8,118,6,128,7],[33,6,76,35,116,20],[32,6,75,33,113,23],[31,6,75,61],[29,9,43,1,74,59],[28,15,74,18,93,38],[27,16,73,12,91,37],[26,17,71,8,89,35],[24,19,69,8,85,37,128,2],[23,19,67,4,79,1,82,37,121,1],[21,21,65,4,74,2,77,42],[21,20,64,4,71,2,74,41],[20,20,64,5,70,43,115,1],[19,21,61,50],[19,20,58,49],[17,22,58,45],[16,22,52,4,57,41],[15,21,50,1,52,1,55,38,99,1],[13,21,49,1,53,36,94,2],[6,1,12,19,46,1,50,35,88,3],[4,25,31,3,46,41],[3,24,30,3,44,40],[3,22,28,4,34,2,41,38],[2,20,26,4,32,2,39,34],[3,17,24,5,36,5,42,25],[9,9,22,6,34,3,42,18],[13,3,19,6,38,9],[8,6,17,5,37,4],[7,6,14,6,34,1],[6,11],[6,3,10,4],[8,2]], STEP = 2, LAT0 = -56;
  var HUBS = [[-43.2,-22.9],[-46.6,-23.5],[-38.5,-3.7],[-58.4,-34.6],[-70.6,-33.4],[-74.1,4.7],[-80.2,25.8],[-74,40.7],[-118.2,34],[-79.4,43.7],[-9.1,38.7],[-0.1,51.5],[8.7,50.1],[3.4,6.5],[28,-26.2],[55.3,25.2],[72.9,19],[103.8,1.3],[139.7,35.7],[151.2,-33.9],[114.2,22.3],[37.6,55.8]], BR = [[0,7],[0,10],[2,10],[2,6],[0,13],[1,4],[0,14],[2,7],[1,3],[0,5]];
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
