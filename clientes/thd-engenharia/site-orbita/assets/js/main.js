/* THD Engenharia, modelo Órbita. Gerado por _build-orbita/build.js (edite _build-orbita/script.js) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pinMQ = matchMedia('(min-width: 921px) and (min-height: 621px)');
  var pinned = function () { return pinMQ.matches; };
  var smooth = reduce ? 'auto' : 'smooth';

  /* um único laço de rolagem para tudo que depende da posição */
  var ticks = [], ticking = false;
  var req = function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; for (var i = 0; i < ticks.length; i++) ticks[i](); }); };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  addEventListener('load', req);
  var progress = function (sec) { var r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight), 0, 1); };
var passP = function (sec) { var r = sec.getBoundingClientRect(); return clamp((innerHeight * .85 - r.top) / (innerHeight * .95), 0, 1); };
  var scrollToP = function (sec, p) { var top = sec.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (sec.offsetHeight - innerHeight) * p, behavior: smooth }); };

  if (root.classList.contains('enter')) setTimeout(function () { root.classList.remove('enter'); }, 1150);

  /* ---------- céu: nós que flutuam, se ligam entre si e ao cursor ---------- */
  var sky = $('.sky');
  if (sky && sky.getContext) (function () {
    var ctx = sky.getContext('2d'), W = 0, H = 0, pts = [], mx = -9999, my = -9999, sy = 0;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      sky.width = Math.round(W * dpr); sky.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(W * H / 15000, 28, 95)); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2, r: Math.random() * 1.5 + .5, o: Math.random() < .14, d: Math.random() * .6 + .2 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var off = sy * .08, i, j, a, b, dx, dy, d, yA, yB;
      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < -20) a.x = W + 20; if (a.x > W + 20) a.x = -20; if (a.y < -20) a.y = H + 20; if (a.y > H + 20) a.y = -20; }
        yA = ((a.y - off * a.d) % (H + 40) + H + 40) % (H + 40) - 20;
        for (j = i + 1; j < pts.length; j++) {
          b = pts[j]; yB = ((b.y - off * b.d) % (H + 40) + H + 40) % (H + 40) - 20;
          dx = a.x - b.x; dy = yA - yB; d = dx * dx + dy * dy;
          if (d < 15000) { ctx.strokeStyle = 'rgba(91,197,240,' + (.13 * (1 - d / 15000)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, yA); ctx.lineTo(b.x, yB); ctx.stroke(); }
        }
        dx = a.x - mx; dy = yA - my; d = dx * dx + dy * dy;
        if (d < 32000) { ctx.strokeStyle = 'rgba(254,87,16,' + (.35 * (1 - d / 32000)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(a.x, yA); ctx.lineTo(mx, my); ctx.stroke(); }
        ctx.fillStyle = a.o ? 'rgba(254,87,16,.85)' : 'rgba(170,215,245,.55)';
        ctx.fillRect(a.x - a.r, yA - a.r, a.r * 2, a.r * 2);
      }
    }
    function loop() { if (!document.hidden) draw(); requestAnimationFrame(loop); }
    size(); addEventListener('resize', size);
    addEventListener('scroll', function () { sy = scrollY; if (reduce) draw(); }, { passive: true });
    if (fine) addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    if (reduce) draw(); else loop();
  })();

  /* ---------- cursor: ponto + órbita que estica na direção do movimento ---------- */
  if (fine && !reduce) (function () {
    var dot = $('.c-dot'), ring = $('.c-ring'), lab = ring && ring.firstChild;
    if (!dot) return;
    var mx = 0, my = 0, rx = 0, ry = 0, shown = false;
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    (function loop() {
      var dx = mx - rx, dy = my - ry; rx += dx * .17; ry += dy * .17;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      if (!ring.classList.contains('hover') && !ring.classList.contains('text')) {
        var sp = Math.min(Math.sqrt(dx * dx + dy * dy), 140);
        ring.style.setProperty('--ca', (Math.atan2(dy, dx) * 57.3).toFixed(1) + 'deg');
        ring.style.setProperty('--cs', (1 + sp / 150).toFixed(3));
      } else ring.style.setProperty('--cs', 1);
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, [role=button]');
      ring.classList.remove('hover', 'text');
      if (!t) return;
      var txt = t.getAttribute('data-cursor');
      if (txt) { ring.classList.add('text'); lab.textContent = txt; } else ring.classList.add('hover');
    });
  })();

  /* ---------- transição entre páginas: círculo laranja que nasce do clique ---------- */
  var warp = $('.warp');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || !warp || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url; try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.protocol !== location.protocol || url.origin !== location.origin) return;
    if (url.href.split('#')[0] === location.href.split('#')[0]) return;
    e.preventDefault();
    root.classList.remove('enter');
    warp.style.setProperty('--wx', e.clientX + 'px'); warp.style.setProperty('--wy', e.clientY + 'px');
    void warp.offsetWidth; warp.classList.add('cover');
    try { sessionStorage.setItem('thd-o-nav', '1'); } catch (_) {}
    setTimeout(function () { location.href = a.href; }, 640);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && warp) warp.classList.remove('cover'); });

  /* ---------- cabeçalho: some ao descer, volta ao subir, troca de cor sobre seções claras ---------- */
  var hdr = $('.hdr'), tones = $$('[data-tone]'), lastY = scrollY, mm = $('.mmenu'), mbtn = $('[data-menu]');
  ticks.push(function () {
    var y = scrollY, open = mm && mm.classList.contains('open');
    hdr.classList.toggle('scrolled', y > 30);
    if (!open) {
      if (y > 160 && y > lastY + 4) { hdr.classList.add('hide'); root.classList.add('hdr-off'); }
      else if (y < lastY - 4 || y < 160) { hdr.classList.remove('hide'); root.classList.remove('hdr-off'); }
    }
    lastY = y;
    var tone = 'dark', probe = 42;
    for (var i = 0; i < tones.length; i++) { var r = tones[i].getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) tone = tones[i].getAttribute('data-tone'); }
    hdr.classList.toggle('light', tone === 'light' && !open);
  });
  var nav = $('.nav'), ind = $('.nav-ind');
  if (nav && ind) {
    var curA = $('a[aria-current]', nav), links = $$('a', nav);
    var indTo = function (a) {
      links.forEach(function (l) { l.classList.toggle('hot', l === a); });
      if (!a) { ind.style.opacity = 0; return; }
      ind.style.opacity = 1; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    };
    links.forEach(function (a) { a.addEventListener('mouseenter', function () { indTo(a); }); a.addEventListener('focus', function () { indTo(a); }); });
    nav.addEventListener('mouseleave', function () { indTo(curA); });
    indTo(curA); if (document.fonts) document.fonts.ready.then(function () { indTo(curA); });
    addEventListener('resize', function () { indTo(curA); });
  }
  function setMenu(o) { mm.classList.toggle('open', o); document.body.classList.toggle('menu-open', o); mbtn.setAttribute('aria-expanded', o); mbtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); if (o) hdr.classList.remove('hide', 'light'); }
  if (mbtn && mm) {
    mbtn.addEventListener('click', function () { setMenu(!mm.classList.contains('open')); });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) { setMenu(false); mbtn.focus(); } });
  }

  /* ---------- botões: preenchimento a partir do ponto de entrada + efeito magnético ---------- */
  $$('.btn').forEach(function (b) {
    var at = function (e) { var r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left) + 'px'); b.style.setProperty('--by', (e.clientY - r.top) + 'px'); };
    b.addEventListener('pointerenter', at); b.addEventListener('pointerleave', at);
  });
  if (fine && !reduce) $$('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .2).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* ---------- entrada sequencial: cada bloco aparece quando chega na tela ---------- */
  var revealEls = $$('.rv, .split:not(h1), [data-iso]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('in'); });

  /* lâminas: a seção sobe e se abre conforme entra na tela */
  var sheets = $$('.sheet');
  ticks.push(function () {
    var h = innerHeight;
    sheets.forEach(function (s) {
      var p = reduce ? 1 : clamp((h - s.getBoundingClientRect().top) / (h * .72), 0, 1);
      p = Math.round(p * 1000) / 1000;
      if (s._p === p) return; s._p = p;
      s.style.setProperty('--p', p); s.classList.toggle('full', p >= 1);
    });
  });

  /* paralaxe leve */
  var pars = $$('[data-par]'), parMq = matchMedia('(max-width:920px)');
  if (!reduce) ticks.push(function () {
    /* no celular o layout é empilhado: deslocar o texto faz ele cobrir o bloco de baixo */
    if (parMq.matches) { pars.forEach(function (el) { if (el.style.transform) el.style.transform = ''; }); return; }
    pars.forEach(function (el) { var host = el.closest('section, footer') || el.parentNode, r = host.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; el.style.transform = 'translate3d(0,' + (-r.top * parseFloat(el.dataset.par)).toFixed(1) + 'px,0)'; });
  });

  /* ---------- giroscópio: inclina com o mouse e gira com a rolagem ---------- */
  var orbs = $$('[data-orb]');
  if (!reduce) {
    if (fine) { var oraf = 0, onx = 0, ony = 0;
      addEventListener('mousemove', function (e) { onx = e.clientX / innerWidth * 2 - 1; ony = e.clientY / innerHeight * 2 - 1;
        if (!oraf) oraf = requestAnimationFrame(function () { oraf = 0; orbs.forEach(function (o) { o.style.setProperty('--ty', (onx * 20).toFixed(2)); o.style.setProperty('--tx', (-ony * 16).toFixed(2)); }); }); }, { passive: true }); }
    ticks.push(function () { orbs.forEach(function (o) { var r = o.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; o.style.setProperty('--sr', (-(r.top + r.height / 2 - innerHeight / 2) * .06).toFixed(2)); }); });
  }

  /* cartões inclinados (fotos, mapa, folha contábil) */
  if (fine && !reduce) $$('[data-tilt]').forEach(function (t) {
    var inner = t.firstElementChild;
    t.addEventListener('mousemove', function (e) { var r = t.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1; inner.style.setProperty('--tx', (nx * 9).toFixed(2)); inner.style.setProperty('--ty', (-ny * 7).toFixed(2)); });
    t.addEventListener('mouseleave', function () { inner.style.setProperty('--tx', 0); inner.style.setProperty('--ty', 0); });
  });
  /* holofote que segue o mouse nas seções claras */
  if (fine && !reduce) $$('.bg-grid').forEach(function (g) {
    var host = g.parentNode;
    host.addEventListener('mousemove', function (e) { var r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });
  });
  /* barras isométricas giram com o mouse */
  if (fine && !reduce) $$('[data-iso]').forEach(function (f) {
    var inn = $('.iso-in', f);
    f.addEventListener('mousemove', function (e) { var r = f.getBoundingClientRect(); inn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3)); inn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3)); });
    f.addEventListener('mouseleave', function () { inn.style.setProperty('--mx', 0); inn.style.setProperty('--my', 0); });
  });

  /* ---------- órgãos reguladores: placas que giram sozinhas, no hover e no toque ---------- */
  $$('[data-wall]').forEach(function (w) {
    var cards = $$('.flip', w), k = 0, hov = false, vis = false;
    cards.forEach(function (c) {
      $('.flip-in', c).addEventListener('click', function () { var on = !c.classList.contains('on'); cards.forEach(function (x) { x.classList.remove('on'); }); c.classList.toggle('on', on); });
      if (fine) { c.addEventListener('mouseenter', function () { hov = true; cards.forEach(function (x) { x.classList.toggle('on', x === c); }); }); c.addEventListener('mouseleave', function () { hov = false; c.classList.remove('on'); }); }
    });
    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .3 }).observe(w);
    setInterval(function () { if (!vis || hov || document.hidden) return; cards.forEach(function (x, i) { x.classList.toggle('on', i === k % cards.length); }); k++; }, 2300);
  });

  /* ---------- serviços da home: pilha presa na rolagem, uma camada por frente ---------- */
  var stk = $('[data-stk]');
  if (stk) (function () {
    var tabs = $$('.stk-tab', stk), panels = $$('.stk-panel', stk), plates = $$('.stack-live .plate', stk), sin = $('.stack-live .stack-in', stk), n = tabs.length, cur = -1, lock = 0;
    function show(i, focus) {
      if (i !== cur) { cur = i;
        tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
        panels.forEach(function (p, k) { var on = k === i; p.classList.toggle('on', on); if (on) p.removeAttribute('inert'); else p.setAttribute('inert', ''); p.setAttribute('aria-hidden', !on); });
        plates.forEach(function (pl) { pl.classList.toggle('on', +pl.dataset.plate === i); });
      }
      if (focus) tabs[i].focus();
    }
    function go(i, focus) { lock = Date.now() + 1000; if (pinned()) scrollToP(stk, (i + .5) / n); show(i, focus); }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i); });
      t.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (d) { e.preventDefault(); go((i + d + n) % n, true); } });
    });
    plates.forEach(function (pl) { $('.pl-top', pl).addEventListener('click', function () { go(+pl.dataset.plate); }); });
    ticks.push(function () {
      if (!pinned()) { sin.style.removeProperty('--gap'); sin.style.removeProperty('--sp'); return; }
      var p = progress(stk);
      sin.style.setProperty('--gap', (40 + p * 34).toFixed(1) + 'px'); sin.style.setProperty('--sp', p.toFixed(3));
      if (Date.now() > lock) show(Math.min(n - 1, Math.floor(p * n)));
    });
    show(0);
  })();

  /* ---------- jornada: o trilho anda na horizontal enquanto a página desce ---------- */
  var jr = $('[data-jr]');
  if (jr) (function () {
    var track = $('[data-jr-track]', jr), sts = $$('.jr-st', jr), rail = $('.jr-rail', jr), n = sts.length;
    function place() {
      if (!pinned()) { rail.style.left = ''; rail.style.width = ''; return; }
      var a = $('.jr-node', sts[0]), x0 = sts[0].offsetLeft + a.offsetWidth / 2, x1 = sts[n - 1].offsetLeft + a.offsetWidth / 2;
      rail.style.left = x0 + 'px'; rail.style.width = (x1 - x0) + 'px';
    }
    ticks.push(function () {
      if (!pinned()) { track.style.transform = ''; rail.style.setProperty('--f', 1); sts.forEach(function (s) { s.classList.add('on'); }); return; }
      var p = progress(jr), max = Math.max(0, track.offsetWidth - innerWidth);
      track.style.transform = 'translate3d(' + (-p * max).toFixed(1) + 'px,0,0)';
      rail.style.setProperty('--f', p.toFixed(4));
      sts.forEach(function (s, k) { s.classList.toggle('on', p >= k / (n - 1) - .03); });
    });
    place(); addEventListener('resize', place); addEventListener('load', place);
    if (document.fonts) document.fonts.ready.then(place);
  })();

  /* ---------- diagnóstico: baralho de perguntas e mapa em anel ---------- */
  var dg = $('[data-diag]');
  if (dg) (function () {
    var labels = ["Outorga SCM","DICI e pós-outorga","Responsabilidade técnica","ASN próprio","Blocos de IPv4","Contabilidade especializada","Registro de marca"];
    var cards = $$('.qc', dg), total = labels.length, cur = 0, ans = {}, last = 0;
    var score = $('[data-diag-score]', dg), msg = $('[data-diag-msg]', dg), pend = $('[data-diag-pend]', dg), go = $('[data-diag-go]', dg), nEl = $('[data-diag-n]', dg), bar = $('[data-diag-bar]', dg);
    var prev = $('[data-deck-prev]', dg), next = $('[data-deck-next]', dg);
    function lay() {
      cards.forEach(function (c, i) { var o = i - cur, on = o === 0;
        c.classList.toggle('gone', o < 0); c.classList.toggle('far', o > 2); c.style.setProperty('--o', Math.max(0, o));
        if (on) c.removeAttribute('inert'); else c.setAttribute('inert', ''); c.setAttribute('aria-hidden', !on); });
      prev.disabled = cur === 0; next.disabled = cur >= total;
    }
    function to(i, focus) { cur = clamp(i, 0, total); lay(); if (focus) { var b = $('button[aria-pressed=true], button', cards[cur]); if (b) b.focus({ preventScroll: true }); } }
    function paint() {
      var ok = 0, miss = [];
      for (var i = 0; i < total; i++) { var v = ans[i], arc = $('.arc[data-q="' + i + '"]', dg);
        arc.classList.toggle('ok', v === 'sim'); arc.classList.toggle('miss', v === 'nao' || v === 'ns');
        if (v === 'sim') ok++; else if (v) miss.push(labels[i]); }
      if (ok !== last && !reduce) { score.parentNode.classList.remove('bump'); void score.offsetWidth; score.parentNode.classList.add('bump'); } last = ok;
      score.textContent = ok;
      var answered = Object.keys(ans).length;
      nEl.textContent = answered; bar.style.setProperty('--p', answered / total);
      msg.textContent = !answered ? 'Cada resposta encaixa uma peça. As que faltam ficam marcadas em laranja.'
        : ok === total ? 'Estrutura completa! A THD ajuda a manter tudo em dia e a crescer com segurança.'
        : miss.length ? 'Encontramos ' + miss.length + (miss.length > 1 ? ' pontos' : ' ponto') + ' para resolver. A THD cuida disso para você:'
        : 'Ótimo começo. Continue respondendo para ver o mapa completo.';
      pend.innerHTML = miss.map(function (m) { return '<li>' + m + '</li>'; }).join('');
      var txt = 'Olá, THD! Fiz o diagnóstico no site: ' + ok + ' de ' + total + ' peças no lugar.' + (miss.length ? '\n\nPreciso de ajuda com:\n' + miss.map(function (m) { return '- ' + m; }).join('\n') : '\n\nQuero manter meu provedor em dia.');
      go.href = 'https://wa.me/5521998340142?text=' + encodeURIComponent(txt);
      $('.lbl', go).textContent = miss.length ? 'Resolver com a THD' : 'Enviar diagnóstico';
    }
    $$('.seg', dg).forEach(function (sg) { var i = +sg.dataset.i;
      $$('button', sg).forEach(function (b) { b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        $$('button', sg).forEach(function (o) { o.setAttribute('aria-pressed', o === b && on); });
        if (on) ans[i] = b.dataset.v; else delete ans[i];
        paint();
        if (on && i === cur) setTimeout(function () { if (cur === i) to(i + 1, true); }, reduce ? 0 : 420);
      }); });
    });
    prev.addEventListener('click', function () { to(cur - 1, true); });
    next.addEventListener('click', function () { to(cur + 1, true); });
    $('[data-deck-reset]', dg).addEventListener('click', function () { ans = {}; $$('.seg button', dg).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); paint(); to(0, true); });
    go.addEventListener('click', function () { if (window.gtag) gtag('event', 'diagnostico_enviado', { score: score.textContent }); });
    lay(); paint();
  })();

  /* ---------- pilares: tambor 3D que gira com a rolagem ---------- */
  $$('[data-pil]').forEach(function (sec) {
    var faces = $$('.drum-f', sec), drum = $('[data-drum]', sec), ds = $$('.pil-d', sec), tabs = $$('[data-pil-go]', sec), bar = $('.pil-bar', sec), n = faces.length, cur = -1, lock = 0;
    function setA(a) { drum.style.setProperty('--a', (a * 40).toFixed(2)); faces.forEach(function (f, i) { var d = Math.abs(a - i); f.style.setProperty('--o', Math.max(.05, 1 - d * .62).toFixed(3)); f.classList.toggle('on', d < .5); }); }
    function show(i) { if (i === cur) return; cur = i; ds.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); }); var t = tabs[i]; if (t && t.offsetWidth) { bar.style.width = t.offsetWidth + 'px'; bar.style.transform = 'translateX(' + t.offsetLeft + 'px)'; } }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { lock = Date.now() + 1600; show(i); setA(i); }); });
    ticks.push(function () {
      if (!pinned() || Date.now() < lock) return;
      var p = passP(sec), a = p * (n - 1), f = a - Math.floor(a), e = Math.floor(a) + f * f * (3 - 2 * f);
      setA(e); show(Math.round(e));
    });
    setA(0); show(0); if (document.fonts) document.fonts.ready.then(function () { cur = -1; show(Math.max(0, Math.round(parseFloat(drum.style.getPropertyValue('--a') || 0) / 40))); });
  });

  /* ---------- missão que acende palavra por palavra ---------- */
  $$('[data-manifesto]').forEach(function (m) { var ws = $$('.mw', m);
    ticks.push(function () { var r = m.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .35), k = reduce ? ws.length : Math.round(clamp(p, 0, 1) * ws.length); ws.forEach(function (w, i) { w.classList.toggle('lit', i < k); }); });
  });
  /* disciplinas tingem a foto */
  var hm = $('.hist-media .tilt-in'), DC = { o: 'rgba(254,87,16,.55)', l: 'rgba(43,90,168,.6)', g: 'rgba(35,164,85,.55)', s: 'rgba(91,197,240,.6)' };
  $$('[data-disc]').forEach(function (d) { var on = function () { if (hm) hm.style.setProperty('--tint', DC[d.dataset.disc]); }, off = function () { if (hm) hm.style.removeProperty('--tint'); };
    d.addEventListener('mouseenter', on); d.addEventListener('focus', on); d.addEventListener('mouseleave', off); d.addEventListener('blur', off); });

  /* ---------- serviços: acordeões, link direto (#servico) e navegação das frentes ---------- */
  var accs = $$('.acc-item');
  var setAcc = function (it, o) { it.classList.toggle('open', o); $('button', it).setAttribute('aria-expanded', o); };
  accs.forEach(function (it) { $('button', it).addEventListener('click', function () { setAcc(it, !it.classList.contains('open')); }); });
  function fromHash() { var id = location.hash.slice(1), it = id && document.getElementById(id);
    if (!it || !it.classList.contains('acc-item')) return;
    setAcc(it, true); it.classList.add('in'); it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash');
    setTimeout(function () { it.scrollIntoView({ behavior: smooth, block: 'center' }); }, 150); }
  if (accs.length) { fromHash(); addEventListener('hashchange', fromHash); }
  var gnav = $('.gnav');
  if (gnav) (function () {
    var gl = $$('a', gnav), gbar = $('.bar', gnav);
    var mark = function (a) { if (!a) return; gl.forEach(function (x) { x.classList.toggle('active', x === a); }); gbar.style.width = a.offsetWidth + 'px'; gbar.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      if (gnav.scrollWidth > gnav.clientWidth) gnav.scrollTo({ left: a.offsetLeft - 20, behavior: smooth }); };
    ticks.push(function () { var pick = gl[0]; gl.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < innerHeight * .45) pick = a; }); if (!pick.classList.contains('active')) mark(pick); });
    mark(gl[0]); if (document.fonts) document.fonts.ready.then(function () { mark($('.active', gnav) || gl[0]); });
  })();

  /* ---------- gestão contábil: a folha vira do operacional para o estratégico ---------- */
  $$('[data-lgx]').forEach(function (sec) {
    var tabs = $$('[role=tab]', sec), faces = $$('.face', sec), inner = $('.sheet3d-in', sec), cur = -1, lock = 0;
    function show(i, focus) {
      if (i !== cur) { cur = i; inner.style.setProperty('--flip', i);
        tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
        faces.forEach(function (f, k) { var on = k === i; if (on) f.removeAttribute('inert'); else f.setAttribute('inert', ''); f.setAttribute('aria-hidden', !on); f.classList.remove('on'); if (on) { void f.offsetWidth; f.classList.add('on'); } }); }
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { lock = Date.now() + 1100; if (pinned()) scrollToP(sec, i ? .8 : .2); show(i); });
      t.addEventListener('keydown', function (e) { var d = /Arrow(Down|Right)/.test(e.key) ? 1 : /Arrow(Up|Left)/.test(e.key) ? -1 : 0; if (d) { e.preventDefault(); show((i + d + 2) % 2, true); } });
    });
    ticks.push(function () { if (!pinned() || Date.now() < lock) return; show(progress(sec) < .5 ? 0 : 1); });
    show(0);
  });

  /* ---------- formulário de contato: valida e abre a mensagem pronta no WhatsApp ---------- */
  var form = document.getElementById('form-contato');
  if (form) {
    var status = form.querySelector('.form-status'), tel = form.elements.telefone;
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      tel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
        : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        : d.length > 2 ? d.replace(/(\d{2})(\d+)/, '($1) $2') : d;
    });
    form.addEventListener('input', function (e) { var l = e.target.closest('.fl'); if (l) l.classList.remove('invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      if (!f.nome.value.trim()) bad.push(f.nome);
      if (tel.value.replace(/\D/g, '').length < 10) bad.push(tel);
      if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) bad.push(f.email);
      if (!f.mensagem.value.trim()) bad.push(f.mensagem);
      bad.forEach(function (el) { el.closest('.fl').classList.add('invalid'); });
      if (bad.length) { status.className = 'form-status err'; status.textContent = 'Confira os campos destacados.'; bad[0].focus(); return; }
      var txt = 'Olá, THD! Vim pelo site.\n\n'
        + '*Assunto:* ' + f.assunto.value + '\n'
        + '*Nome:* ' + f.nome.value.trim() + '\n'
        + (f.empresa.value.trim() ? '*Empresa:* ' + f.empresa.value.trim() + '\n' : '')
        + '*Telefone:* ' + tel.value + '\n'
        + (f.email.value ? '*E-mail:* ' + f.email.value + '\n' : '')
        + '\n' + f.mensagem.value.trim();
      window.open('https://wa.me/' + form.dataset.whats + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      status.className = 'form-status ok';
      status.textContent = 'Pronto! Sua mensagem foi aberta no WhatsApp. É só tocar em enviar.';
      if (window.gtag) gtag('event', 'generate_lead', { method: 'whatsapp_form', subject: f.assunto.value });
    });
  }

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

  /* botão do WhatsApp mostra quanto da página já foi lida */
  var wa = $('.wa-float');
  if (wa) ticks.push(function () { var max = document.documentElement.scrollHeight - innerHeight; wa.style.setProperty('--sp', max > 0 ? (scrollY / max).toFixed(3) : 0); });

  /* registra cliques no WhatsApp no Analytics */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a && window.gtag) gtag('event', 'whatsapp_click', { link_text: (a.textContent || '').trim().slice(0, 60) });
  });
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  req();
})();
