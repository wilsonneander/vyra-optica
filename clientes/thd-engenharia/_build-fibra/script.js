// JS do modelo "Fibra" (sem dependências): fios de luz em canvas, cursor com rastro, venezianas entre páginas,
// trilho de navegação, prisma 3D dos serviços, trilha de fibra da jornada, diagnóstico com rack 3D, pilares que
// se acendem, foto em íris, missão digitada, cabos das disciplinas, catálogo, comparador e formulário.
const C = require('../_build/content');

const js = `/* THD Engenharia, modelo Fibra. Gerado por _build-fibra/build.js (edite _build-fibra/script.js) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pinMQ = matchMedia('(min-width: 921px) and (min-height: 700px)');
  var pinned = function () { return pinMQ.matches; };
  var smooth = reduce ? 'auto' : 'smooth';

  /* um único laço de rolagem para tudo que depende da posição */
  var ticks = [], ticking = false;
  var req = function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; for (var i = 0; i < ticks.length; i++) ticks[i](); }); };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  addEventListener('load', req);
  var progress = function (sec) { var r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight), 0, 1); };
/* pilares: o giro começa com a seção inteira na tela e termina quando ela começa a sair por cima */
  var passP = function (sec) { var r = sec.getBoundingClientRect(), s = Math.max(innerHeight - r.height, innerHeight * .35), e = -r.height * .35; return clamp((s - r.top) / (s - e), 0, 1); };
  var scrollToP = function (sec, p) { var top = sec.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (sec.offsetHeight - innerHeight) * p, behavior: smooth }); };
  var ease = function (f) { return f * f * (3 - 2 * f); };
  var hold = function (a) { var b = Math.floor(a), f = a - b; return b + ease(ease(f)); };

  if (root.classList.contains('enter')) setTimeout(function () { root.classList.remove('enter'); }, 1200);

  /* ---------- fios de luz: fibras que ondulam, desviam do cursor e levam pulsos de luz ---------- */
  var mouse = { x: -9999, y: -9999 };
  if (fine) addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  var PAL = {
    light: { s: '26,59,135', a: .12, p: ['254,87,16', '43,90,168'] },
    dark: { s: '91,197,240', a: .13, p: ['254,87,16', '91,197,240'] },
    orange: { s: '255,255,255', a: .2, p: ['255,255,255', '255,226,210'] }
  };
  var fibers = $$('canvas.fibers').map(function (cv) {
    var ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return null;
    var pal = PAL[cv.getAttribute('data-fibers')] || PAL.dark, W = 0, H = 0, st = [], f = { cv: cv, vis: false, t: Math.random() * 100 };
    f.size = function () {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width || !r.height) return;
      W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(H / 46, 7, W < 700 ? 10 : 17)); st = [];
      for (var i = 0; i < n; i++) {
        var pulses = [];
        for (var k = 0; k < (Math.random() < .45 ? 2 : 1); k++) pulses.push({ s: Math.random() * 1.3 - .3, v: .0011 + Math.random() * .0022, c: Math.random() < .62 ? 0 : 1, l: .05 + Math.random() * .07 });
        st.push({ y0: H * (.08 + .84 * (i + Math.random() * .6) / n), y1: H * (.04 + .92 * Math.random()), amp: 14 + Math.random() * 46, fr: .7 + Math.random() * 1.5, ph: Math.random() * 6.28, sp: .25 + Math.random() * .45, w: Math.random() < .2 ? 1.6 : 1, p: pulses });
      }
      f.draw();
    };
    function pt(s, q, r, out) {
      var x = -40 + (W + 80) * s, y = q.y0 + (q.y1 - q.y0) * ease(s) + q.amp * Math.sin(s * Math.PI * q.fr + f.t * q.sp + q.ph) * Math.sin(s * Math.PI);
      var dx = x - (mouse.x - r.left), dy = y - (mouse.y - r.top), d2 = dx * dx + dy * dy;
      if (d2 < 19600) { var d = Math.sqrt(d2) || 1; y += (dy >= 0 ? 1 : -1) * (1 - d / 140) * 46; }
      out.x = x; out.y = y; return out;
    }
    var tmp = { x: 0, y: 0 }, SEG = 44;
    f.draw = function () {
      var r = cv.getBoundingClientRect(), i, k, j, q, p, s;
      ctx.clearRect(0, 0, W, H);
      for (i = 0; i < st.length; i++) {
        q = st[i];
        ctx.strokeStyle = 'rgba(' + pal.s + ',' + pal.a + ')'; ctx.lineWidth = q.w; ctx.beginPath();
        for (j = 0; j <= SEG; j++) { pt(j / SEG, q, r, tmp); if (j) ctx.lineTo(tmp.x, tmp.y); else ctx.moveTo(tmp.x, tmp.y); }
        ctx.stroke();
        for (k = 0; k < q.p.length; k++) {
          p = q.p[k];
          if (!reduce) { p.s += p.v; if (p.s > 1 + p.l) { p.s = -Math.random() * .4; p.c = Math.random() < .62 ? 0 : 1; } }
          var a = Math.max(0, p.s - p.l), b = Math.min(1, p.s); if (b <= a) continue;
          var col = pal.p[p.c];
          for (var pass = 0; pass < 2; pass++) {
            ctx.beginPath();
            for (j = 0; j <= 10; j++) { s = a + (b - a) * j / 10; pt(s, q, r, tmp); if (j) ctx.lineTo(tmp.x, tmp.y); else ctx.moveTo(tmp.x, tmp.y); }
            ctx.lineWidth = pass ? 2.2 : 7; ctx.strokeStyle = 'rgba(' + col + ',' + (pass ? .95 : .14) + ')'; ctx.lineCap = 'round'; ctx.stroke();
          }
          pt(b, q, r, tmp); ctx.fillStyle = 'rgba(' + col + ',1)'; ctx.fillRect(tmp.x - 2.5, tmp.y - 2.5, 5, 5);
        }
      }
    };
    return f;
  }).filter(Boolean);
  if (fibers.length) {
    var resizeAll = function () { fibers.forEach(function (f) { f.size(); }); };
    if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { fibers.forEach(function (f) { if (f.cv === e.target) { f.vis = e.isIntersecting; if (f.vis) f.draw(); } }); }); });
      fibers.forEach(function (f) { fio.observe(f.cv); });
    } else fibers.forEach(function (f) { f.vis = true; });
    var rz = 0; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(resizeAll, 150); });
    if (document.fonts) document.fonts.ready.then(resizeAll);
    addEventListener('load', resizeAll);
    resizeAll();
    if (!reduce) (function loop() { if (!document.hidden) fibers.forEach(function (f) { if (f.vis) { f.t += .016; f.draw(); } }); requestAnimationFrame(loop); })();
  }

  /* ---------- cursor: pulso de luz com rastro ---------- */
  if (fine && !reduce) (function () {
    var cur = $('.cursor'), dot = $('.c-dot'), tag = $('.c-tag'), trs = $$('.c-tr');
    if (!cur) return;
    var mx = 0, my = 0, shown = false, P = trs.map(function () { return { x: 0, y: 0 }; });
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; P.forEach(function (p) { p.x = mx; p.y = my; }); document.body.classList.add('has-cursor'); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    (function loop() {
      var t = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      dot.style.transform = t; tag.style.transform = t;
      var px = mx, py = my;
      P.forEach(function (p, i) { p.x += (px - p.x) * .42; p.y += (py - p.y) * .42; trs[i].style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0)'; px = p.x; py = p.y; });
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, [role=slider]');
      cur.classList.remove('hover', 'text');
      if (!t) return;
      var txt = t.getAttribute('data-cursor');
      if (txt) { cur.classList.add('text'); tag.textContent = txt; } else cur.classList.add('hover');
    });
  })();

  /* ---------- transição entre páginas: venezianas descem e sobem ---------- */
  var shut = $('.shut');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || !shut || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url; try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.protocol !== location.protocol || url.origin !== location.origin) return;
    if (url.href.split('#')[0] === location.href.split('#')[0]) return;
    e.preventDefault();
    root.classList.remove('enter');
    void shut.offsetWidth; shut.classList.add('cover');
    try { sessionStorage.setItem('thd-f-nav', '1'); } catch (_) {}
    setTimeout(function () { location.href = a.href; }, 720);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && shut) shut.classList.remove('cover'); });

  /* ---------- trilho: progresso da leitura, barra do celular some ao descer, menu ---------- */
  var rail = $('.rail'), rprog = $('.rail-prog'), topCta = $('.top-cta'), mm = $('.mmenu'), mbtn = $('[data-menu]'), lastY = scrollY;
  ticks.push(function () {
    var y = scrollY, max = document.documentElement.scrollHeight - innerHeight, open = mm && mm.classList.contains('open');
    if (rprog) rprog.style.setProperty('--sp', max > 0 ? (y / max).toFixed(3) : 0);
    if (!open) {
      var down = y > 160 && y > lastY + 4, up = y < lastY - 4 || y < 160;
      if (down) { rail.classList.add('hide'); if (topCta) topCta.classList.add('hide'); root.classList.add('hdr-off'); }
      else if (up) { rail.classList.remove('hide'); if (topCta) topCta.classList.remove('hide'); root.classList.remove('hdr-off'); }
    }
    lastY = y;
  });
  function setMenu(o) { mm.classList.toggle('open', o); document.body.classList.toggle('menu-open', o); mbtn.setAttribute('aria-expanded', o); mbtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); if (o) rail.classList.remove('hide'); }
  if (mbtn && mm) {
    mbtn.addEventListener('click', function () { setMenu(!mm.classList.contains('open')); });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) { setMenu(false); mbtn.focus(); } });
    var prevs = $$('.mm-prev img', mm);
    $$('nav a', mm).forEach(function (a) { var on = function () { prevs.forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-p') === a.getAttribute('data-prev')); }); }; a.addEventListener('mouseenter', on); a.addEventListener('focus', on); });
  }

  /* ---------- botões magnéticos ---------- */
  if (fine && !reduce) $$('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .26).toFixed(1) + 'px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* ---------- textos de apoio que se decodificam ---------- */
  var GLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/';
  function decode(el) {
    if (el._dec || reduce) return; el._dec = true;
    var txt = el.textContent, n = txt.length, fr = 0, total = Math.min(34, 12 + n);
    el.setAttribute('aria-label', txt);
    (function step() {
      fr++; var out = '';
      for (var i = 0; i < n; i++) { var ch = txt[i]; out += ch === ' ' || fr > (i / n) * total * .8 + 6 ? ch : GLY[(Math.random() * GLY.length) | 0]; }
      el.textContent = out;
      if (fr < total + 6) setTimeout(step, 28); else { el.textContent = txt; el.removeAttribute('aria-label'); }
    })();
  }

  /* ---------- entrada: blocos aparecem quando chegam na tela ---------- */
  var revealEls = $$('.rv, .bl, [data-print], [data-reveal], [data-decode]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var t = e.target; t.classList.add('in'); if (t.hasAttribute('data-decode')) setTimeout(function () { decode(t); }, t.classList.contains('up') ? 300 + (root.classList.contains('enter') ? 550 : 0) : 0); io.unobserve(t); }); }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('in'); });

  /* paralaxe leve dentro das molduras */
  var pars = $$('[data-par]');
  if (!reduce) ticks.push(function () {
    pars.forEach(function (el) { var r = el.parentNode.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return; el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - innerHeight / 2) * -parseFloat(el.dataset.par)).toFixed(1) + 'px,0)'; });
  });

  /* cartões que inclinam com o mouse (rack, impressora) */
  if (fine && !reduce) $$('[data-tilt]').forEach(function (t) {
    var inner = t.firstElementChild;
    t.addEventListener('mousemove', function (e) { var r = t.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1; inner.style.setProperty('--tx', (nx * 10).toFixed(2)); inner.style.setProperty('--ty', (-ny * 7).toFixed(2)); });
    t.addEventListener('mouseleave', function () { inner.style.setProperty('--tx', 0); inner.style.setProperty('--ty', 0); });
  });

  /* ---------- órgãos reguladores: o logo segue o cursor sobre a linha ---------- */
  $$('[data-orgs]').forEach(function (list) {
    var sec = list.closest('section'), fl = $('.org-float', sec), imgs = $$('img', fl || document.createElement('i'));
    if (!fine || !fl) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, on = false, raf = 0;
    function loop() {
      var dx = tx - cx; cx += dx * .14; cy += (ty - cy) * .14;
      fl.style.transform = 'translate3d(' + (cx - 125).toFixed(1) + 'px,' + (cy - 85).toFixed(1) + 'px,0) rotate(' + clamp(dx * .06, -10, 10).toFixed(2) + 'deg)';
      raf = on || Math.abs(dx) > .5 ? requestAnimationFrame(loop) : 0;
    }
    list.addEventListener('mousemove', function (e) { var r = sec.getBoundingClientRect(); tx = e.clientX - r.left + 40; ty = e.clientY - r.top; if (!on) { cx = tx; cy = ty; } if (!raf) raf = requestAnimationFrame(loop); });
    $$('.org', list).forEach(function (row) { row.addEventListener('mouseenter', function () { on = true; fl.classList.add('on'); imgs.forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-f') === row.getAttribute('data-org')); }); }); });
    list.addEventListener('mouseleave', function () { on = false; fl.classList.remove('on'); });
  });

  /* ---------- serviços da home: prisma de quatro faces que gira com a rolagem ---------- */
  var prs = $('[data-prs]');
  if (prs) (function () {
    var prism = $('[data-prism]', prs), faces = $$('.pf', prs), tabs = $$('.prs-idx [role=tab]', prs), n = faces.length, cur = -1, lock = 0, wasPinned = null;
    function setA(a) {
      prism.style.setProperty('--a', a.toFixed(4));
      faces.forEach(function (f, i) { f.style.filter = 'brightness(' + (.42 + .58 * Math.max(0, Math.cos((a - i) * Math.PI / 2))).toFixed(3) + ')'; });
      tabs.forEach(function (t, i) { t.style.setProperty('--f', clamp(1 - Math.abs(a - i), 0, 1).toFixed(3)); });
    }
    function show(i, focus) {
      if (i !== cur) { cur = i;
        tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
        faces.forEach(function (f, k) { var on = k === i; if (on) f.removeAttribute('inert'); else f.setAttribute('inert', ''); f.setAttribute('aria-hidden', !on); });
      }
      if (focus && tabs[i]) tabs[i].focus();
    }
    function go(i, focus) { lock = Date.now() + 1100; scrollToP(prs, i / (n - 1)); show(i, focus); }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i); });
      t.addEventListener('keydown', function (e) { var d = /Arrow(Down|Right)/.test(e.key) ? 1 : /Arrow(Up|Left)/.test(e.key) ? -1 : 0; if (d) { e.preventDefault(); go((i + d + n) % n, true); } });
    });
    ticks.push(function () {
      var pin = pinned();
      if (!pin) { if (wasPinned !== false) { wasPinned = false; cur = -1; prism.style.removeProperty('--a'); faces.forEach(function (f) { f.style.filter = ''; f.removeAttribute('inert'); f.removeAttribute('aria-hidden'); }); } return; }
      wasPinned = true;
      var a = reduce ? Math.round(progress(prs) * (n - 1)) : hold(progress(prs) * (n - 1));
      setA(a); if (Date.now() > lock) show(Math.round(a));
    });
  })();

  /* ---------- jornada: a fibra se desenha e o pulso acende cada etapa ---------- */
  $$('[data-jrn]').forEach(function (sec) {
    var body = $('[data-jrn-body]', sec), svg = $('.jrn-svg', body), base = $('.jb', svg), lit = $('.jl', svg), pulse = $('.jp', svg), sts = $$('.jrn-st', body), L = 0, marks = [];
    function build() {
      var br = body.getBoundingClientRect(), W = br.width, H = body.offsetHeight;
      if (!W) return;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var pts = sts.map(function (s) { var r = $('.jrn-node', s).getBoundingClientRect(); return [r.left - br.left + r.width / 2, r.top - br.top + r.height / 2]; });
      var narrow = W < 700, sx = narrow ? pts[0][0] : W / 2, prev = [sx, -70], d = 'M' + prev[0] + ' ' + prev[1];
      pts.forEach(function (p) { var dy = p[1] - prev[1]; d += ' C' + prev[0] + ' ' + (prev[1] + dy * .55) + ',' + p[0] + ' ' + (p[1] - dy * .55) + ',' + p[0] + ' ' + p[1]; prev = p; });
      d += ' C' + prev[0] + ' ' + (prev[1] + 90) + ',' + sx + ' ' + (H - 40) + ',' + sx + ' ' + (H + 40);
      base.setAttribute('d', d); lit.setAttribute('d', d);
      L = lit.getTotalLength(); lit.style.strokeDasharray = L + ' ' + L;
      marks = pts.map(function (p) { var lo = 0, hi = L; for (var k = 0; k < 22; k++) { var m = (lo + hi) / 2; if (lit.getPointAtLength(m).y < p[1]) lo = m; else hi = m; } return lo; });
      req();
    }
    ticks.push(function () {
      if (!L) return;
      var r = body.getBoundingClientRect(), p = reduce ? 1 : clamp((innerHeight * .6 - r.top + 70) / (r.height + 70), 0, 1), len = L * p;
      lit.style.strokeDashoffset = (L - len).toFixed(1);
      var q = lit.getPointAtLength(len); pulse.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ')');
      pulse.style.opacity = p > 0 && p < 1 ? 1 : 0;
      sts.forEach(function (s, i) { s.classList.toggle('on', len >= marks[i] - 4); });
    });
    build(); addEventListener('resize', build); addEventListener('load', build);
    if (document.fonts) document.fonts.ready.then(build);
  });

  /* ---------- diagnóstico: chaves de três posições e módulos que entram no rack ---------- */
  var dg = $('[data-diag]');
  if (dg) (function () {
    var labels = ${JSON.stringify(C.diagnostico.map((d) => d.pend))};
    var total = labels.length, ans = {}, last = 0;
    var score = $('[data-diag-score]', dg), cap = score.parentNode, msg = $('[data-diag-msg]', dg), pend = $('[data-diag-pend]', dg), go = $('[data-diag-go]', dg);
    var tris = $$('.tri', dg), slots = $$('.slot', dg);
    function thumb(tri) {
      var b = $('button[aria-pressed=true]', tri), th = $('.tri-th', tri);
      tri.classList.toggle('v-sim', !!b && b.getAttribute('data-v') === 'sim');
      if (!b) { th.style.opacity = 0; return; }
      th.style.opacity = 1; th.style.width = b.offsetWidth + 'px'; th.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    }
    function paint() {
      var ok = 0, miss = [];
      for (var i = 0; i < total; i++) {
        var v = ans[i], sl = slots[i], st = $('.mod-st', sl);
        sl.classList.toggle('ok', v === 'sim'); sl.classList.toggle('miss', v === 'nao' || v === 'ns');
        st.textContent = v === 'sim' ? 'instalado' : v ? 'pendente' : '';
        tris[i].closest('.dq').classList.toggle('done', !!v);
        if (v === 'sim') ok++; else if (v) miss.push(labels[i]);
      }
      if (ok !== last && !reduce) { cap.classList.remove('bump'); void cap.offsetWidth; cap.classList.add('bump'); } last = ok;
      score.textContent = ok;
      var answered = Object.keys(ans).length;
      msg.textContent = !answered ? 'Cada resposta encaixa um módulo. Os que faltam saltam para fora em laranja.'
        : ok === total ? 'Rack completo! A THD ajuda a manter tudo em dia e a crescer com segurança.'
        : miss.length ? 'Encontramos ' + miss.length + (miss.length > 1 ? ' pontos' : ' ponto') + ' para resolver. A THD cuida disso para você:'
        : 'Ótimo começo. Continue respondendo para ver o rack completo.';
      pend.innerHTML = miss.map(function (m) { return '<li>' + m + '</li>'; }).join('');
      var txt = 'Olá, THD! Fiz o diagnóstico no site: ' + ok + ' de ' + total + ' módulos instalados.' + (miss.length ? '\\n\\nPreciso de ajuda com:\\n' + miss.map(function (m) { return '- ' + m; }).join('\\n') : '\\n\\nQuero manter meu provedor em dia.');
      go.href = 'https://wa.me/${C.contato.whatsapp}?text=' + encodeURIComponent(txt);
      $('.lbl', go).textContent = miss.length ? 'Resolver com a THD' : 'Enviar diagnóstico';
    }
    tris.forEach(function (tri) { var i = +tri.getAttribute('data-i');
      $$('button', tri).forEach(function (b) { b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        $$('button', tri).forEach(function (o) { o.setAttribute('aria-pressed', o === b && on); });
        if (on) ans[i] = b.getAttribute('data-v'); else delete ans[i];
        thumb(tri); paint();
      }); });
    });
    $('[data-diag-reset]', dg).addEventListener('click', function () { ans = {}; $$('.tri button', dg).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); tris.forEach(thumb); paint(); });
    go.addEventListener('click', function () { if (window.gtag) gtag('event', 'diagnostico_enviado', { score: score.textContent }); });
    addEventListener('resize', function () { tris.forEach(thumb); });
    if (document.fonts) document.fonts.ready.then(function () { tris.forEach(thumb); });
    paint();
  })();

  /* ---------- pilares: a palavra da vez se acende em laranja ---------- */
  $$('[data-plr]').forEach(function (sec) {
    var words = $$('.pw', sec), track = $('.plr-track', sec), box = $('.plr-words', sec), ds = $$('.plr-d', sec), n = words.length, cur = -1, lock = 0;
    function setA(a) {
      words.forEach(function (w, i) { w.style.setProperty('--f', clamp(1 - Math.abs(a - i) * 1.15, 0, 1).toFixed(3)); });
      var lo = Math.floor(a), hi = Math.min(n - 1, lo + 1), c = function (k) { return words[k].offsetTop + words[k].offsetHeight / 2; };
      var y = c(lo) + (c(hi) - c(lo)) * (a - lo);
      track.style.transform = 'translate3d(0,' + (box.clientHeight / 2 - y).toFixed(1) + 'px,0)';
    }
    function show(i) { if (i === cur) return; cur = i; ds.forEach(function (d, k) { d.classList.toggle('on', k === i); }); }
    words.forEach(function (w, i) { w.addEventListener('click', function () { lock = Date.now() + 1600; setA(i); show(i); }); });
    ticks.push(function () {
      if (!pinned() || Date.now() < lock) return;
      var a = reduce ? Math.round(passP(sec) * (n - 1)) : hold(passP(sec) * (n - 1));
      setA(a); show(Math.round(a));
    });
  });

  /* ---------- foto que abre em íris com a rolagem ---------- */
  var irises = $$('[data-iris]');
  ticks.push(function () {
    irises.forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      var p = reduce ? 1 : clamp((innerHeight - r.top) / (innerHeight * .55 + r.height * .5), 0, 1);
      el.style.setProperty('--r', (16 + ease(p) * 60).toFixed(2)); el.style.setProperty('--rp', p.toFixed(3));
    });
  });

  /* ---------- missão digitada letra por letra conforme a rolagem ---------- */
  $$('[data-tw]').forEach(function (el) {
    var cs = $$('.c', el), n = cs.length, last = -1;
    ticks.push(function () {
      var r = el.getBoundingClientRect(), p = reduce ? 1 : clamp((innerHeight * .88 - r.top) / (r.height + innerHeight * .3), 0, 1), k = Math.round(p * n);
      if (k === last) return; last = k;
      cs.forEach(function (c, i) { c.classList.toggle('on', i < k); c.classList.toggle('cur', i === k - 1 || (k === 0 && i === 0)); });
    });
  });

  /* ---------- disciplinas acendem o cabo correspondente ---------- */
  var cables = $('[data-cables]');
  if (cables) (function () {
    var discs = $$('[data-disc]'), keys = discs.map(function (d) { return d.getAttribute('data-disc'); }), k = 0, hov = false, vis = false;
    var set = function (key) { if (key) cables.setAttribute('data-on', key); else cables.removeAttribute('data-on'); discs.forEach(function (d) { d.classList.toggle('on', d.getAttribute('data-disc') === key); }); };
    discs.forEach(function (d) {
      var on = function () { hov = true; set(d.getAttribute('data-disc')); }, off = function () { hov = false; set(null); };
      d.addEventListener('mouseenter', on); d.addEventListener('focus', on); d.addEventListener('mouseleave', off); d.addEventListener('blur', off);
    });
    $$('.cab', cables).forEach(function (g) { g.addEventListener('mouseenter', function () { hov = true; set(g.getAttribute('data-k')); }); g.addEventListener('mouseleave', function () { hov = false; set(null); }); });
    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .4 }).observe(cables);
    setInterval(function () { if (!vis || hov || document.hidden) return; set(keys[k % keys.length]); k++; }, 2200);
  })();

  /* frentes: o preenchimento nasce de onde o mouse entra */
  $$('[data-fronts] a').forEach(function (a) {
    a.addEventListener('mouseenter', function (e) { var r = a.getBoundingClientRect(); a.style.setProperty('--cx', (e.clientX - r.left) + 'px'); a.style.setProperty('--cy', (e.clientY - r.top) + 'px'); });
  });

  /* ---------- serviços: acordeões, link direto (#servico) e índice com progresso ---------- */
  var accs = $$('.acc-item');
  var setAcc = function (it, o) { it.classList.toggle('open', o); $('button', it).setAttribute('aria-expanded', o); };
  accs.forEach(function (it) { $('button', it).addEventListener('click', function () { setAcc(it, !it.classList.contains('open')); }); });
  function fromHash() { var id = location.hash.slice(1), it = id && document.getElementById(id);
    if (!it || !it.classList.contains('acc-item')) return;
    setAcc(it, true); it.classList.add('in'); it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash');
    setTimeout(function () { it.scrollIntoView({ behavior: smooth, block: 'center' }); }, 150); }
  if (accs.length) { fromHash(); addEventListener('hashchange', fromHash); }
  var catnav = $('[data-catnav]');
  if (catnav) (function () {
    var ls = $$('.cat-links a', catnav), box = $('.cat-links', catnav), groups = ls.map(function (a) { return document.querySelector(a.getAttribute('href')); }), act = null;
    ticks.push(function () {
      var pick = ls[0], mid = innerHeight * .45;
      groups.forEach(function (g, i) { if (!g) return; var r = g.getBoundingClientRect(); ls[i].style.setProperty('--f', clamp((mid - r.top) / r.height, 0, 1).toFixed(3)); if (r.top < mid) pick = ls[i]; });
      if (pick !== act) { act = pick; ls.forEach(function (a) { a.classList.toggle('active', a === pick); }); if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: pick.offsetLeft - 20, behavior: smooth }); }
    });
  })();

  /* ---------- gestão contábil: comparador arrastável ---------- */
  $$('[data-cmp]').forEach(function (cmp) {
    var h = $('.cmp-h', cmp), sec = cmp.closest('section'), tabs = $$('[data-cmp-go]', sec), x = 50, drag = false, hinted = false;
    function set(v, anim) {
      x = clamp(v, 0, 100);
      cmp.classList.toggle('anim', !!anim);
      cmp.style.setProperty('--x', x.toFixed(1));
      h.setAttribute('aria-valuenow', Math.round(x));
      h.setAttribute('aria-valuetext', x >= 80 ? 'Rotina operacional' : x <= 20 ? 'Planejamento estratégico' : 'Os dois lados');
      tabs.forEach(function (t) { var g = +t.getAttribute('data-cmp-go'); t.setAttribute('aria-pressed', g ? x >= 80 : x <= 20); });
      cmp.classList.toggle('show-b', x <= 20);
    }
    function at(e) { var r = cmp.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    cmp.addEventListener('pointerdown', function (e) { if (e.button !== 0 || matchMedia('(max-width: 640px)').matches) return; drag = true; cmp.classList.add('drag'); try { cmp.setPointerCapture(e.pointerId); } catch (_) {} set(at(e)); h.focus({ preventScroll: true }); });
    cmp.addEventListener('pointermove', function (e) { if (drag) set(at(e)); });
    var stop = function () { drag = false; cmp.classList.remove('drag'); };
    cmp.addEventListener('pointerup', stop); cmp.addEventListener('pointercancel', stop);
    h.addEventListener('keydown', function (e) {
      var d = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }[e.key];
      if (e.key === 'Home') { e.preventDefault(); set(0, true); } else if (e.key === 'End') { e.preventDefault(); set(100, true); } else if (d) { e.preventDefault(); set(x + d); }
    });
    tabs.forEach(function (t) { t.addEventListener('click', function () { var g = +t.getAttribute('data-cmp-go'); set(t.getAttribute('aria-pressed') === 'true' ? 50 : g, true); }); });
    set(50);
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || hinted) return; hinted = true;
      setTimeout(function () { if (!drag) set(62, true); }, 500); setTimeout(function () { if (!drag) set(50, true); }, 1300);
    }, { threshold: .5 }).observe(cmp);
  });

  /* ---------- rodapé: a luz segue o cursor no nome da THD ---------- */
  var spot = $('[data-spot]');
  if (spot && fine && !reduce) spot.parentNode.addEventListener('mousemove', function (e) { var r = spot.getBoundingClientRect(); spot.style.setProperty('--mx', (e.clientX - r.left) + 'px'); spot.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });

  /* ---------- formulário de contato: valida e abre a mensagem pronta no WhatsApp ---------- */
  var form = document.getElementById('form-contato');
  if (form) {
    var status = form.querySelector('.form-status'), tel = form.elements.telefone;
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\\D/g, '').slice(0, 11);
      tel.value = d.length > 10 ? d.replace(/(\\d{2})(\\d{5})(\\d{0,4})/, '($1) $2-$3')
        : d.length > 6 ? d.replace(/(\\d{2})(\\d{4})(\\d{0,4})/, '($1) $2-$3')
        : d.length > 2 ? d.replace(/(\\d{2})(\\d+)/, '($1) $2') : d;
    });
    form.addEventListener('input', function (e) { var l = e.target.closest('.fl'); if (l) l.classList.remove('invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      if (!f.nome.value.trim()) bad.push(f.nome);
      if (tel.value.replace(/\\D/g, '').length < 10) bad.push(tel);
      if (f.email.value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(f.email.value)) bad.push(f.email);
      if (!f.mensagem.value.trim()) bad.push(f.mensagem);
      bad.forEach(function (el) { el.closest('.fl').classList.add('invalid'); });
      if (bad.length) { status.className = 'form-status err'; status.textContent = 'Confira os campos destacados.'; bad[0].focus(); return; }
      var txt = 'Olá, THD! Vim pelo site.\\n\\n'
        + '*Assunto:* ' + f.assunto.value + '\\n'
        + '*Nome:* ' + f.nome.value.trim() + '\\n'
        + (f.empresa.value.trim() ? '*Empresa:* ' + f.empresa.value.trim() + '\\n' : '')
        + '*Telefone:* ' + tel.value + '\\n'
        + (f.email.value ? '*E-mail:* ' + f.email.value + '\\n' : '')
        + '\\n' + f.mensagem.value.trim();
      window.open('https://wa.me/' + form.dataset.whats + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      status.className = 'form-status ok';
      status.textContent = 'Pronto! Sua mensagem foi aberta no WhatsApp. É só tocar em enviar.';
      if (window.gtag) gtag('event', 'generate_lead', { method: 'whatsapp_form', subject: f.assunto.value });
    });
  }

  /* ---------- área do cliente (demonstrativa): login local, sem servidor ---------- */
  var acf = document.getElementById('ac-login');
  if (acf) {
    var AK = 'thd-f-ac', acCpf = acf.elements.cpf, acPw = acf.elements.senha, acSt = acf.querySelector('.form-status'), acBtn = acf.querySelector('[type=submit]');
    var maskCpf = function (v) { var d = v.replace(/\\D/g, '').slice(0, 11); return d.replace(/(\\d{3})(\\d)/, '$1.$2').replace(/(\\d{3})\\.(\\d{3})(\\d)/, '$1.$2.$3').replace(/(\\d{3})\\.(\\d{3})\\.(\\d{3})(\\d)/, '$1.$2.$3-$4'); };
    var showDash = function (cpf, focus) {
      var out = $('[data-ac-cpf]');
      if (out && cpf && cpf.length === 11) out.textContent = cpf.slice(0, 3) + '.***.***-' + cpf.slice(9);
      root.classList.add('ac-in');
      dispatchEvent(new Event('resize'));
      if (focus) { scrollTo(0, 0); var h = $('#ac-dt'); if (h) h.focus({ preventScroll: true }); }
    };
    try { var saved = sessionStorage.getItem(AK); if (saved) showDash(saved); } catch (_) {}
    acCpf.addEventListener('input', function () { acCpf.value = maskCpf(acCpf.value); });
    acf.addEventListener('input', function (e) { var l = e.target.closest('.fl'); if (l) l.classList.remove('invalid'); });
    var eye = acf.querySelector('[data-ac-eye]');
    if (eye) eye.addEventListener('click', function () { var show = acPw.type === 'password'; acPw.type = show ? 'text' : 'password'; eye.textContent = show ? 'Ocultar' : 'Mostrar'; eye.setAttribute('aria-pressed', show); acPw.focus(); });
    acf.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = acCpf.value.replace(/\\D/g, ''), bad = [];
      if (d.length !== 11) bad.push(acCpf);
      if (!acPw.value) bad.push(acPw);
      bad.forEach(function (el) { el.closest('.fl').classList.add('invalid'); });
      if (bad.length) { acSt.className = 'form-status err'; acSt.textContent = d.length !== 11 ? 'Digite os 11 números do CPF do titular.' : 'Digite a sua senha.'; bad[0].focus(); return; }
      acSt.className = 'form-status ok'; acSt.textContent = 'Entrando na sua conta...'; acBtn.disabled = true;
      setTimeout(function () {
        try { sessionStorage.setItem(AK, d); } catch (_) {}
        acBtn.disabled = false; acSt.textContent = '';
        showDash(d, true);
        if (window.gtag) gtag('event', 'login', { method: 'area_do_cliente_demo' });
      }, 650);
    });
    $$('[data-ac-out]').forEach(function (b) {
      b.addEventListener('click', function () {
        try { sessionStorage.removeItem(AK); } catch (_) {}
        root.classList.remove('ac-in'); acf.reset(); acSt.textContent = '';
        acPw.type = 'password'; if (eye) { eye.textContent = 'Mostrar'; eye.setAttribute('aria-pressed', 'false'); }
        dispatchEvent(new Event('resize')); scrollTo(0, 0); acCpf.focus({ preventScroll: true });
      });
    });
  }
  /* botões de WhatsApp com mensagem montada pelas escolhas (agendamento e atendimento) */
  $$('[data-wa-tpl]').forEach(function (box) {
    var go = box.querySelector('[data-wa-go]'); if (!go) return;
    var upd = function () {
      var t = box.getAttribute('data-wa-tpl').replace(/\\{(\\w+)\\}/g, function (_, k) { var i = box.querySelector('input[name="' + k + '"]:checked'); return i ? i.value : ''; });
      go.href = 'https://wa.me/' + box.getAttribute('data-whats') + '?text=' + encodeURIComponent(t);
    };
    box.addEventListener('change', upd); upd();
  });

  /* horário: avisa se a equipe está atendendo agora */
  $$('[data-now]').forEach(function (el) {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      var wd = '', h = 0; p.forEach(function (x) { if (x.type === 'weekday') wd = x.value; if (x.type === 'hour') h = +x.value; });
      var open = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(wd) > -1 && h >= 9 && h < 18;
      el.textContent = open ? 'Atendendo agora, até as 18h' : 'Fora do horário agora. Deixe sua mensagem e respondemos no próximo dia útil.';
      el.classList.toggle('open', open);
    } catch (e) {}
  });

  /* registra cliques no WhatsApp no Analytics */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a && window.gtag) gtag('event', 'whatsapp_click', { link_text: (a.textContent || '').trim().slice(0, 60) });
  });
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  req();
})();
`;
module.exports = { js };
