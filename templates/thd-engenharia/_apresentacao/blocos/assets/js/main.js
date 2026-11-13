/* THD Engenharia · gerado por _build/build.js */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var mobile = function () { return innerWidth <= 920; };

  /* Cursor próprio */
  if (fine && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); } dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, [role=button]');
      ring.classList.remove('hover', 'text'); if (!t) return;
      var txt = t.getAttribute('data-cursor'); if (txt) { ring.classList.add('text'); ring.firstChild.textContent = txt; } else ring.classList.add('hover');
    });
  }

  /* Transição entre páginas: os blocos fecham a tela e abrem na próxima */
  var curtain = $('.curtain');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a || !curtain || reduce || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^(https?|file):$/.test(u.protocol) || u.host !== location.host) return;
    if (u.pathname === location.pathname) return;
    e.preventDefault(); try { sessionStorage.setItem('thd-nav', '1'); } catch (err) {}
    curtain.classList.add('cover'); setTimeout(function () { location.href = a.href; }, 560);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('cover'); });

  /* Cabeçalho, progresso e menu */
  var hdr = $('.hdr'), prog = $('.progress'), lastY = scrollY;
  function onScroll() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight, hide = y > lastY && y > 300 && !document.body.classList.contains('menu-open');
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 40); hdr.classList.toggle('hide', hide); document.body.classList.toggle('hdr-on', !hide);
    if (Math.abs(y - lastY) > 4) lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mm = $('.mmenu'), mbtn = $('[data-menu]');
  function setMenu(o) { mm.classList.toggle('open', o); document.body.classList.toggle('menu-open', o); mbtn.setAttribute('aria-expanded', o); mbtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); if (o) hdr.classList.remove('hide'); }
  mbtn.addEventListener('click', function () { setMenu(!mm.classList.contains('open')); });
  mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) { setMenu(false); mbtn.focus(); } });

  /* Botões magnéticos */
  if (fine && !reduce) $$('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .22 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* ---------- Blocos geométricos ---------- */
  var RADS = ['0 0 0 100%', '100% 0 0 0', '0 100% 0 0', '0 0 100% 0'];
  function scatter(t) {
    var a = rnd(0, Math.PI * 2), d = rnd(140, 320);
    t.style.setProperty('--sx', Math.cos(a) * d + 'px'); t.style.setProperty('--sy', Math.sin(a) * d + 'px');
    t.style.setProperty('--sr', (rnd(-1, 1) > 0 ? 1 : -1) * Math.round(rnd(1, 3)) * 90 + 'deg');
  }
  function assemble(g) {
    $$('.tile', g).forEach(function (t, i) { if (g.hasAttribute('data-build') && !mobile()) return; t.style.setProperty('--dl', (i * 90 + rnd(0, 120)) + 'ms'); t.classList.remove('out'); });
    setTimeout(function () { g.classList.add('ready'); }, 300);
  }
  // troca de lugar, gira ou muda o recorte de um bloco
  function shuffle(g) {
    if (g.classList.contains('geo-diag') || (g.hasAttribute('data-build') && !g.classList.contains('full'))) return;
    var tiles = $$('.tile', g), small = tiles.filter(function (t) { return !t.hasAttribute('data-big') && !t.hasAttribute('data-fixed'); }), r = Math.random();
    if (r < .45 && small.length > 1) {
      var a = small[Math.floor(Math.random() * small.length)], b = small[Math.floor(Math.random() * small.length)]; if (a === b) return shuffle(g);
      var ax = a.style.getPropertyValue('--x'), ay = a.style.getPropertyValue('--y');
      a.style.setProperty('--x', b.style.getPropertyValue('--x')); a.style.setProperty('--y', b.style.getPropertyValue('--y'));
      b.style.setProperty('--x', ax); b.style.setProperty('--y', ay);
    } else if (r < .85) {
      var t = small[Math.floor(Math.random() * small.length)]; t.style.setProperty('--r', (+t.style.getPropertyValue('--r') || 0) + (Math.random() < .5 ? 1 : -1));
    } else {
      var big = $('[data-big]', g);
      if (big) { var cur = RADS.indexOf(big.style.getPropertyValue('--rad').trim()); big.style.setProperty('--rad', RADS[(cur + 1) % 4]); }
      else { var t2 = small[Math.floor(Math.random() * small.length)]; t2.style.setProperty('--r', (+t2.style.getPropertyValue('--r') || 0) + 2); }
    }
  }
  var geos = $$('[data-geo]'), visible = [];
  geos.forEach(function (g) {
    if (!reduce) $$('.tile', g).forEach(function (t) { scatter(t); t.classList.add('out'); });
    else g.classList.add('ready');
    // parallax: o conjunto inclina e os satélites acompanham o mouse
    if (fine && !reduce) {
      var host = g.closest('section, .mmenu') || g, inner = $('.geo-in', g), sats = $$('.sat', g);
      host.addEventListener('mousemove', function (e) {
        var r = g.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        inner.style.transform = 'rotateY(' + dx * 14 + 'deg) rotateX(' + -dy * 14 + 'deg)';
        sats.forEach(function (s) { var k = +s.dataset.depth || 1; s.style.setProperty('--px', dx * 50 * k + 'px'); s.style.setProperty('--py', dy * 50 * k + 'px'); });
      });
      host.addEventListener('mouseleave', function () { inner.style.transform = ''; sats.forEach(function (s) { s.style.setProperty('--px', '0px'); s.style.setProperty('--py', '0px'); }); });
    }
  });
  if (!reduce && 'IntersectionObserver' in window) {
    var gio = new IntersectionObserver(function (es) { es.forEach(function (e) {
      var g = e.target, i = visible.indexOf(g);
      if (e.isIntersecting) { if (!g.dataset.done) { g.dataset.done = 1; assemble(g); } if (i < 0) visible.push(g); }
      else if (i > -1) visible.splice(i, 1);
    }); }, { threshold: .2 });
    geos.forEach(function (g) { gio.observe(g); });
    setInterval(function () { if (document.hidden) return; visible.forEach(function (g) { if (g.closest('.mmenu') && !mm.classList.contains('open')) return; shuffle(g); }); }, 1700);
  }

  /* ---------- Carrossel de órgãos reguladores ---------- */
  $$('[data-selos]').forEach(function (vp) {
    var sec = vp.closest('.selos'), track = $('.selos-track', vp), x = 0, set = 0, vel = 0, pend = 0, drag = null, onScreen = true, last = 0;
    var BASE = reduce ? 0 : -42; // px por segundo (negativo = para a esquerda)
    function measure() { set = track.scrollWidth / 3; if (!x) x = -set; }
    function wrap() { while (x < -2 * set) x += set; while (x > 0) x -= set; }
    function frame(t) {
      var dt = Math.min(64, t - (last || t)) / 1000; last = t;
      if (!drag && onScreen) {
        vel += (BASE - vel) * Math.min(1, dt * 4);
        var step = pend * Math.min(1, dt * 7); pend -= step;
        x += vel * dt + step; wrap();
      }
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      focus();
      requestAnimationFrame(frame);
    }
    var cards = $$('.selo', track), vw = vp.offsetWidth;
    var cardW = function () { var c = cards[0]; return c ? c.offsetWidth + (parseFloat(getComputedStyle(c).marginRight) || 0) : 296; };
    var pitch = cardW(), half = cards[0] ? cards[0].offsetWidth / 2 : 136;
    // o cartão mais perto do centro fica em cores e maior; os das pontas ficam em cinza e menores
    function focus() {
      var mid = vw / 2, reach = Math.max(pitch * 1.6, vw * .32);
      for (var i = 0; i < cards.length; i++) {
        var d = Math.abs(x + i * pitch + half - mid), f = Math.max(0, 1 - d / reach);
        f = Math.round(f * f * (3 - 2 * f) * 100) / 100;
        if (cards[i]._f !== f) { cards[i]._f = f; cards[i].style.setProperty('--f', f); }
      }
    }
    function remeasure() { vw = vp.offsetWidth; pitch = cardW(); half = cards[0] ? cards[0].offsetWidth / 2 : 136; }
    $('.next', sec).addEventListener('click', function () { pend -= cardW(); });
    $('.prev', sec).addEventListener('click', function () { pend += cardW(); });
    vp.addEventListener('pointerdown', function (e) { drag = { x0: e.clientX, x: x, t: performance.now(), lx: e.clientX }; vp.classList.add('drag'); vp.setPointerCapture(e.pointerId); });
    vp.addEventListener('pointermove', function (e) { if (!drag) return; var now = performance.now(); vel = (e.clientX - drag.lx) / Math.max(1, now - drag.t) * 1000; drag.t = now; drag.lx = e.clientX; x = drag.x + (e.clientX - drag.x0); wrap(); });
    var end = function () { if (!drag) return; drag = null; vp.classList.remove('drag'); vel = Math.max(-1600, Math.min(1600, vel)); };
    vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }).observe(vp);
    measure(); track.style.transform = 'translate3d(' + x + 'px,0,0)'; focus(); addEventListener('resize', function () { set = track.scrollWidth / 3; remeasure(); wrap(); });
    addEventListener('load', function () { measure(); remeasure(); });
    requestAnimationFrame(frame);
  });

  /* ---------- Jornada: a estrutura se monta com a rolagem ---------- */
  var jrn = $('[data-jrn]');
  if (jrn) {
    var steps = $$('.jrn-steps > li', jrn), bar = $('.jrn-bar', jrn), jg = $('[data-build]', jrn), jt = $$('.tile', jg), n = steps.length, stage = -1;
    var setStage = function (s) {
      if (s === stage) return; stage = s;
      steps.forEach(function (li, i) { li.classList.toggle('on', i <= s); li.classList.toggle('cur', i === s); });
      jt.forEach(function (t, i) { var on = +t.dataset.stage <= s; if (on && t.classList.contains('out')) t.style.setProperty('--dl', (i % 3) * 110 + 'ms'); if (!on && !t.classList.contains('out')) scatter(t); t.classList.toggle('out', !on); });
      jg.classList.toggle('full', s >= n - 1); jg.classList.toggle('ready', s >= 0);
    };
    var jrnScroll = function () {
      if (mobile() || reduce) { setStage(n - 1); steps.forEach(function (li) { li.classList.add('on'); }); return; }
      var r = jrn.getBoundingClientRect(), total = jrn.offsetHeight - innerHeight, p = Math.max(0, Math.min(1, -r.top / total));
      bar.style.setProperty('--p', p);
      setStage(Math.min(n - 1, Math.floor(p * n)));
    };
    addEventListener('scroll', jrnScroll, { passive: true }); addEventListener('resize', jrnScroll); jrnScroll();
  }

  /* ---------- Diagnóstico ---------- */
  var dg = $('[data-diag]');
  if (dg) {
    var ans = {}, total = $$('.seg', dg).length, score = $('[data-diag-score]', dg), msg = $('[data-diag-msg]', dg), pend = $('[data-diag-pend]', dg), go = $('[data-diag-go]', dg), nEl = $('[data-diag-n]', dg), bar = $('[data-diag-bar]', dg), last = 0;
    var labels = ["Outorga SCM","DICI e pós-outorga","Responsabilidade técnica","ASN próprio","Blocos de IPv4","Contabilidade especializada","Registro de marca"];
    var paint = function () {
      var ok = 0, miss = [];
      for (var i = 0; i < total; i++) { var v = ans[i], t = $('.tile[data-q="' + i + '"]', dg);
        t.classList.toggle('ok', v === 'sim'); t.classList.toggle('miss', v === 'nao' || v === 'ns');
        if (v === 'sim') ok++; else if (v) miss.push(labels[i]); }
      $$('.tile[data-fixed]', dg).forEach(function (t) { t.classList.toggle('fix', ok + miss.length > 0); });
      if (ok !== last && !reduce) { score.classList.remove('bump'); void score.offsetWidth; score.classList.add('bump'); } last = ok;
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
      go.lastChild.textContent = miss.length ? 'Resolver com a THD' : 'Enviar diagnóstico';
    };
    $$('.seg', dg).forEach(function (sg) { var i = +sg.dataset.i;
      $$('button', sg).forEach(function (b) { b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        $$('button', sg).forEach(function (o) { o.setAttribute('aria-pressed', o === b && on); });
        if (on) ans[i] = b.dataset.v; else delete ans[i];
        var li = sg.parentNode; li.classList.toggle('done', on);
        if (on) { li.dataset.v = sg.dataset.v = b.dataset.v; sg.style.setProperty('--k', ['sim', 'nao', 'ns'].indexOf(b.dataset.v)); } else { delete li.dataset.v; delete sg.dataset.v; }
        paint();
      }); });
    });
    go.addEventListener('click', function () { if (window.gtag) gtag('event', 'diagnostico_enviado', { score: score.textContent }); });
    paint();
  }

  /* ---------- Abas de serviços (home) ---------- */
  var tl = $('.svx-tabs');
  if (tl) { var tabs = $$('[role=tab]', tl);
    var pick = function (b, focus) { tabs.forEach(function (o) { var on = o === b, p = document.getElementById(o.getAttribute('aria-controls')); o.setAttribute('aria-selected', on); o.tabIndex = on ? 0 : -1; p.hidden = !on; if (on && !reduce) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); } }); if (focus) b.focus(); };
    /* no desktop a seção fica presa e a rolagem percorre as frentes em sequência, como a jornada */
    var trk = $('[data-svx]'), sbar = trk && $('.svx-bar', trk), cur = 0;
    var pinned = function () { return trk && innerHeight >= 600; };
    var total = function () { return Math.max(1, trk.offsetHeight - innerHeight); };
    var setIdx = function (i, focus) { tabs.forEach(function (o, k) { o.classList.toggle('on', !pinned() || k <= i); }); if (i === cur && !focus) return; cur = i; pick(tabs[i], focus);
      /* no celular as abas ficam numa faixa horizontal: traz a aba ativa para a vista */
      if (mobile() && tl.scrollWidth > tl.clientWidth) tl.scrollTo({ left: Math.max(0, tabs[i].offsetLeft - (tl.clientWidth - tabs[i].offsetWidth) / 2), behavior: reduce ? 'auto' : 'smooth' }); };
    var go = function (i, focus) {
      setIdx(i, focus);
      if (!pinned()) return;
      var y = trk.getBoundingClientRect().top + scrollY;
      scrollTo({ top: y + total() * (i + .5) / tabs.length, behavior: reduce ? 'auto' : 'smooth' });
    };
    var svxScroll = function () {
      if (!pinned()) { setIdx(cur); return; }
      var p = Math.max(0, Math.min(1, -trk.getBoundingClientRect().top / total()));
      sbar.style.setProperty('--p', p);
      setIdx(Math.min(tabs.length - 1, Math.floor(p * tabs.length)));
    };
    tabs.forEach(function (b, i) { b.tabIndex = i ? -1 : 0; b.addEventListener('click', function () { go(i); });
      b.addEventListener('keydown', function (e) { var k = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (k) { e.preventDefault(); go((i + k + tabs.length) % tabs.length, true); } }); });
    if (trk) { addEventListener('scroll', svxScroll, { passive: true }); addEventListener('resize', svxScroll); svxScroll(); }
  }

  /* ---------- Seção presa: a rolagem escolhe o item ativo ---------- */
  var pinScroll = function (sec, n, onIdx) {
    var cur = -1, lock = 0, ok = function () { return !mobile() && innerHeight >= 600 && !reduce; };
    var total = function () { return Math.max(1, sec.offsetHeight - innerHeight); };
    var f = function () { if (!ok()) { cur = -1; return; }
      var p = Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / total()));
      sec.style.setProperty('--p', p);
      if (lock) return;
      var i = Math.min(n - 1, Math.floor(p * n)); if (i !== cur) { cur = i; onIdx(i); } };
    addEventListener('scroll', f, { passive: true }); addEventListener('resize', f); f();
    return { ok: ok, go: function (i, instant) { if (!ok()) return false; cur = i; onIdx(i);
      clearTimeout(lock); lock = setTimeout(function () { lock = 0; f(); }, instant ? 50 : 1100);
      scrollTo({ top: sec.getBoundingClientRect().top + scrollY + total() * (i + .5) / n, behavior: instant ? 'auto' : 'smooth' }); return true; } };
  };

  /* ---------- Painéis que se abrem ---------- */
  $$('[data-pnl]').forEach(function (w) { var its = $$('.pnl-item', w), sec = w.closest('[data-pin]');
    var open = function (it) { its.forEach(function (o) { o.classList.toggle('on', o === it); o.setAttribute('aria-expanded', o === it); }); };
    var pin = sec && pinScroll(sec, its.length, function (i) { open(its[i]); });
    var choose = function (it) { if (!(pin && pin.go(its.indexOf(it)))) open(it); };
    its.forEach(function (it) { it.addEventListener('click', function () { choose(it); }); it.addEventListener('focus', function () { open(it); });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(it); } });
      if (fine) it.addEventListener('mouseenter', function () { if (!(pin && pin.ok())) open(it); }); });
  });

  /* ---------- Frentes presas na rolagem (serviços) ---------- */
  var gp = $('[data-gpin]'), gsecs = gp ? $$('.grp-sec', gp) : [], gMark = null;
  var gpin = gp && pinScroll(gp, gsecs.length, function (i) { gsecs.forEach(function (s, k) { s.classList.toggle('cur', k === i); }); if (gMark) gMark(i);
    /* a frente que entra já mostra o primeiro serviço aberto, para a tela não ficar vazia */
    var g = gsecs[i], f = g && $('.acc-item', g); if (setAcc && f && !$('.acc-item.open', g)) setAcc(f, true); });
  var gOn = function () { return gpin && gpin.ok(); };

  /* ---------- Acordeão de serviços ---------- */
  var accs = $$('.acc-item');
  var setAcc = function (it, o) { it.classList.toggle('open', o); $('button', it).setAttribute('aria-expanded', o); };
  if (gOn() && !location.hash) { var g0 = $('.grp-sec.cur', gp), f0 = g0 && $('.acc-item', g0); if (f0 && !$('.acc-item.open', g0)) setAcc(f0, true); }
  accs.forEach(function (it) { $('button', it).addEventListener('click', function () { var o = !it.classList.contains('open');
    /* com a frente presa, um item aberto por vez para caber na tela */
    if (o && gOn()) $$('.acc-item.open', it.parentNode).forEach(function (x) { setAcc(x, false); });
    setAcc(it, o); }); });
  function fromHash(first) { var id = location.hash.slice(1), it = id && document.getElementById(id);
    if (gOn() && it) { var sec = it.classList.contains('grp-sec') ? it : it.closest('.grp-sec'), gi = gsecs.indexOf(sec);
      if (gi > -1) { if (first === true) { var jump = function () { setTimeout(function () { gpin.go(gi, true); }, 60); }; if (document.readyState === 'complete') jump(); else addEventListener('load', jump); } else gpin.go(gi);
        if (it.classList.contains('acc-item')) { $$('.acc-item.open', it.parentNode).forEach(function (x) { setAcc(x, false); }); setAcc(it, true); it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash'); }
        return; } }
    if (it && it.classList.contains('acc-item')) { setAcc(it, true); it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash'); setTimeout(function () { it.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 80); } }
  if (accs.length) { fromHash(true); addEventListener('hashchange', fromHash); }

  /* ---------- Menu de frentes (serviços) ---------- */
  var gnav = $('.gnav');
  if (gnav && 'IntersectionObserver' in window) {
    var gl = $$('a', gnav), gbar = $('.bar', gnav);
    var mark = function (a) { gl.forEach(function (x) { x.classList.toggle('active', x === a); }); gbar.style.width = a.offsetWidth + 'px'; gbar.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      /* rola só o menu na horizontal: scrollIntoView mexia na rolagem da página e travava quem estava descendo */
      if (gnav.scrollWidth > gnav.clientWidth) { var l = a.offsetLeft, r = l + a.offsetWidth, sl = gnav.scrollLeft, w = gnav.clientWidth;
        if (l < sl || r > sl + w) gnav.scrollTo({ left: l < sl ? l - 16 : r - w + 16, behavior: reduce ? 'auto' : 'smooth' }); } };
    gMark = function (i) { mark(gl[i]); };
    gl.forEach(function (a, i) { a.addEventListener('click', function (e) { if (gOn()) { e.preventDefault(); gpin.go(i); history.replaceState(null, '', a.getAttribute('href')); } }); });
    var so = new IntersectionObserver(function (es) { if (gOn()) return; es.forEach(function (e) { if (e.isIntersecting) mark(gl.filter(function (a) { return a.getAttribute('href') === '#' + e.target.id; })[0]); }); }, { rootMargin: '-40% 0px -55% 0px' });
    gl.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) so.observe(s); });
    mark(gl[0]); if (document.fonts) document.fonts.ready.then(function () { mark($('.active', gnav) || gl[0]); });
  }

  /* ---------- Chave operacional / estratégico ---------- */
  /* Painel contábil: abas que avançam sozinhas, varredura de luz e linhas que se preenchem */
  $$('[data-ledger]').forEach(function (lg) {
    var tabs = $$('[role=tab]', lg), stage = $('.lg-stage', lg), cur = 0, auto = !reduce;
    var show = function (i, focus) { cur = i;
      tabs.forEach(function (t, j) { var on = j === i, p = document.getElementById(t.getAttribute('aria-controls')); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; p.hidden = !on; p.classList.remove('on'); if (on && !reduce) { void p.offsetWidth; p.classList.add('on'); } });
      if (!reduce) { stage.classList.remove('run'); void stage.offsetWidth; stage.classList.add('run'); }
      if (focus) tabs[i].focus(); };
    var stop = function () { if (auto) { auto = false; lg.classList.add('manual'); } };
    var sec = lg.closest('[data-pin]'), pin = sec && pinScroll(sec, tabs.length, function (i) { stop(); if (i !== cur || !lg.classList.contains('live')) { lg.classList.add('live'); show(i); } });
    if (pin && pin.ok()) stop();
    var pick = function (i, focus) { stop(); if (!(pin && pin.go(i))) show(i); if (focus) tabs[i].focus(); };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) { var k = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (k) { e.preventDefault(); pick((i + k + tabs.length) % tabs.length, true); } });
      $('.tm', t).addEventListener('animationend', function () { if (auto) show((cur + 1) % tabs.length); });
    });
    lg.addEventListener('mouseenter', function () { lg.classList.add('paused'); });
    lg.addEventListener('mouseleave', function () { lg.classList.remove('paused'); });
    lg.addEventListener('focusin', function () { lg.classList.add('paused'); });
    lg.addEventListener('focusout', function () { lg.classList.remove('paused'); });
    if (fine && !reduce) stage.addEventListener('mousemove', function (e) { var r = stage.getBoundingClientRect(); stage.style.setProperty('--mx', (e.clientX - r.left) + 'px'); stage.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { es.forEach(function (e) { lg.classList.toggle('away', !e.isIntersecting); if (e.isIntersecting && !lg.classList.contains('live')) { lg.classList.add('live'); show(cur); } }); }, { threshold: .35 }).observe(stage);
  });

  /* ---------- Missão que acende com a rolagem ---------- */
  $$('[data-manifesto]').forEach(function (m) { var ws = $$('.mw', m);
    var lit = function () { var r = m.getBoundingClientRect(), p = (innerHeight * .8 - r.top) / (r.height + innerHeight * .3), k = reduce ? ws.length : Math.round(Math.max(0, Math.min(1, p)) * ws.length); ws.forEach(function (w, i) { w.classList.toggle('lit', i < k); }); };
    addEventListener('scroll', lit, { passive: true }); lit(); });

  /* ---------- Entrada ao rolar ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.remove('pre'); io.unobserve(e.target); }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv, .media, .cube3d, [data-bars]').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight * .9) { el.classList.add('pre'); el.style.transitionDelay = ((+el.dataset.d || 0) * 110) + 'ms'; io.observe(el); } });
  }

  /* ---------- Formulário de contato: valida e abre a mensagem pronta no WhatsApp ---------- */
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

  /* ---------- Diagnóstico: mosaico de peças que se reencaixam no fundo ----------
     Uma onda diagonal gira as peças de tempos em tempos, o cursor gira as peças por onde passa
     e cada resposta solta uma onda a partir do botão, colorindo as peças (Sim azul, Não laranja). */
  $$('[data-mosaic]').forEach(function (sec) {
    var cv = sec.querySelector('canvas.mosaic'), ctx = cv && cv.getContext('2d'), card = sec.querySelector('[data-diag]');
    if (!ctx) return;
    var done = false, S = 64, W = 0, H = 0, cols = 0, rows = 0, ox = 0, oy = 0, tiles = [], waves = [], running = false, last = 0, sweepT = 2, hover = -1, hole = null;
    var KINDS = ['sq', 'ci', 'qa', 'ha', 'tr', 'qa', 'sq'], HALF = Math.PI / 2;
    var COL = { sim: '43,90,168', nao: '254,87,16', ns: '103,114,140', all: '43,90,168', amb: '26,59,135' };
    function layout() {
      var s = sec.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = s.width; H = s.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = W < 700 ? 48 : 64; cols = Math.ceil(W / S) + 1; rows = Math.ceil(H / S) + 1; ox = (W - cols * S) / 2; oy = (H - rows * S) / 2;
      tiles = [];
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var cx = ox + x * S + S / 2, cy = oy + y * S + S / 2, q = Math.floor(Math.random() * 4);
        tiles.push({ x: cx, y: cy, k: KINDS[Math.floor(Math.random() * KINDS.length)], a: q * HALF, t: q * HALF, f: 0, c: COL.amb, hit: -1 });
      }
      draw();
    }
    function kick(t, col, power) { t.t += HALF * (Math.random() < .5 ? 1 : -1); if (col) { t.c = col; t.f = Math.max(t.f, power); } }
    function shape(t, h) {
      ctx.beginPath();
      if (t.k === 'sq') ctx.rect(-h, -h, h * 2, h * 2);
      else if (t.k === 'ci') ctx.arc(0, 0, h, 0, Math.PI * 2);
      else if (t.k === 'qa') { ctx.moveTo(h, h); ctx.arc(h, h, h * 2, Math.PI, Math.PI * 1.5); ctx.closePath(); }
      else if (t.k === 'ha') { ctx.moveTo(-h, h * .5); ctx.arc(0, h * .5, h, Math.PI, 0); ctx.closePath(); }
      else { ctx.moveTo(-h, -h); ctx.lineTo(h, h); ctx.lineTo(-h, h); ctx.closePath(); }
    }
    function measure() { // o cartão cobre o meio: as peças embaixo dele não são desenhadas
      if (!card) return; var s = sec.getBoundingClientRect(), r = card.getBoundingClientRect();
      hole = { x0: r.left - s.left + 6, y0: r.top - s.top + 6, x1: r.right - s.left - 6, y1: r.bottom - s.top - 6 };
      tiles.forEach(function (t) { t.off = t.x > hole.x0 && t.x < hole.x1 && t.y > hole.y0 && t.y < hole.y1; });
    }
    function draw() {
      measure(); ctx.clearRect(0, 0, W, H);
      var h = S * .34; ctx.lineWidth = 1.3;
      for (var i = 0; i < tiles.length; i++) {
        var t = tiles[i]; if (t.off) continue;
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.a); shape(t, h);
        if (t.f > .01) { ctx.fillStyle = 'rgba(' + t.c + ',' + (t.f * .55).toFixed(3) + ')'; ctx.fill(); }
        ctx.strokeStyle = 'rgba(' + (t.f > .01 ? t.c : COL.amb) + ',' + (.13 + t.f * .5).toFixed(3) + ')'; ctx.stroke();
        ctx.restore();
      }
    }
    function step(dt) {
      sweepT -= dt;
      if (sweepT <= 0) { // onda diagonal ambiente, cada vez de um canto
        sweepT = 4.5 + Math.random() * 2;
        var corner = Math.floor(Math.random() * 4);
        waves.push({ x: corner % 2 ? W : 0, y: corner > 1 ? H : 0, r: 0, v: 520, band: S * 1.1, col: COL.amb, p: .35, id: Math.random(), diag: true });
      }
      waves = waves.filter(function (w) {
        w.r += w.v * dt;
        tiles.forEach(function (t) {
          if (t.off || t.hit === w.id) return;
          var d = w.diag ? (Math.abs(t.x - w.x) + Math.abs(t.y - w.y)) * .72 : Math.sqrt((t.x - w.x) * (t.x - w.x) + (t.y - w.y) * (t.y - w.y));
          if (d < w.r && d > w.r - w.band) { t.hit = w.id; if (Math.random() < (w.diag ? .5 : .85)) kick(t, w.col, w.p * (1 - Math.min(.7, d / 1400))); }
        });
        return w.r < Math.max(W, H) * 1.5;
      });
      tiles.forEach(function (t) { t.a += (t.t - t.a) * Math.min(1, dt * 7); t.f = Math.max(0, t.f - dt * .45); });
    }
    function loop(ts) { if (!running) return; var dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; step(dt); draw(); requestAnimationFrame(loop); }
    layout();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 200); });
    if (reduce) return;
    sec.addEventListener('mousemove', function (e) {
      var s = sec.getBoundingClientRect(), x = e.clientX - s.left - ox, y = e.clientY - s.top - oy, i = Math.floor(y / S) * cols + Math.floor(x / S);
      if (i !== hover && tiles[i] && !tiles[i].off) { hover = i; kick(tiles[i], COL.sim, .5); }
    }, { passive: true });
    if (card) card.addEventListener('click', function (e) {
      var b = e.target.closest('.seg button'); if (!b) return;
      var s = sec.getBoundingClientRect(), r = b.getBoundingClientRect(), v = b.dataset.v;
      waves.push({ x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top, r: 0, v: 700, band: S * 1.4, col: COL[v] || COL.amb, p: .9, id: Math.random() });
      setTimeout(function () { // todas respondidas: onda final a partir do cartão
        if (!done && card.querySelectorAll('.seg button[aria-pressed="true"]').length >= card.querySelectorAll('.seg').length) {
          done = true; var c = card.getBoundingClientRect();
          waves.push({ x: c.left + c.width / 2 - s.left, y: c.top + c.height / 2 - s.top, r: 0, v: 500, band: S * 3, col: COL.all, p: 1, id: Math.random() });
        }
      }, 60);
    });
    var start = function () { if (!running) { running = true; last = 0; requestAnimationFrame(loop); } };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!tiles.length || Math.abs(sec.getBoundingClientRect().height - H) > 4) layout(); start(); } else running = false; }); }).observe(sec);
    else start();
  });

  /* ---------- Quem somos: rede de fibra que cresce a partir da THD ----------
     Pontos novos se ligam à rede por trilhas em ângulo reto (como no logo), pacotes de luz
     saem da THD (atrás da foto) até cada ponto. O mouse funciona como lanterna sobre a rede. */
  $$('[data-net]').forEach(function (sec) {
    var cv = sec.querySelector('canvas.net'), ctx = cv && cv.getContext('2d');
    var hubEl = sec.querySelector('[data-net-hub]'), avoidEl = sec.querySelector('[data-net-avoid]');
    if (!ctx || !hubEl || !avoidEl) return;
    var COLORS = { o: '#FE5710', l: '#2B5AA8', g: '#23A455', s: '#3FA9F5' };
    var STEP = 44, W = 0, H = 0, off = 0, cols = 0, rows = 0, MAX = 40, hub, avoid, fig;
    var nodes = [], edges = [], packets = [], rings = [], used = {};
    var mouse = null, color = COLORS.o, burst = 0, running = false, last = 0, growT = 0, spawnT = 0, clock = 0;
    var rnd = function (n) { return Math.floor(Math.random() * n); };
    var pt = function (c, r) { return { x: off + c * STEP, y: off + r * STEP }; };
    var inR = function (p, q) { return p.x > q.x0 && p.x < q.x1 && p.y > q.y0 && p.y < q.y1; };
    var segHit = function (a, b, q) { // segmento horizontal ou vertical contra retângulo
      var x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
      return x1 > q.x0 && x0 < q.x1 && y1 > q.y0 && y0 < q.y1;
    };
    function rel(el, pad) {
      var s = sec.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { x0: r.left - s.left - pad, y0: r.top - s.top - pad, x1: r.right - s.left + pad, y1: r.bottom - s.top + pad };
    }
    function grow(instant) {
      for (var t = 0; t < 60; t++) {
        var p = nodes[rnd(nodes.length)];
        if (p.kids >= (p === hub ? 6 : 3) || p.dying || (p.edge && p.edge.t < 1)) continue;
        var big = p === hub ? 2 : 1; // da THD (atrás da foto) as trilhas saem mais longas, para passar da borda
        var dc = (Math.random() < .5 ? -1 : 1) * (2 + rnd(5 * big)), dr = (Math.random() < .5 ? -1 : 1) * (1 + rnd(4 * big));
        var k = Math.random(); if (k < .25) dr = 0; else if (k < .45) dc = 0;
        var c = p.c + dc, r = p.r + dr, id = c + ',' + r;
        if (c < 0 || r < 0 || c > cols || r > rows || used[id]) continue;
        var a = pt(p.c, p.r), b = pt(c, r);
        if (inR(b, avoid) || inR(b, fig)) continue;
        var m = Math.random() < .5 ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
        if (segHit(a, m, avoid) || segHit(m, b, avoid)) continue;
        var l1 = Math.abs(m.x - a.x) + Math.abs(m.y - a.y), l2 = Math.abs(b.x - m.x) + Math.abs(b.y - m.y);
        var n = { c: c, r: r, x: b.x, y: b.y, id: id, kids: 0, parent: p, flash: 0, life: instant ? 1 : 0, dying: 0 };
        n.edge = { a: a, m: m, b: b, l1: l1, len: l1 + l2, t: instant ? 1 : 0, n: n };
        p.kids++; used[id] = 1; nodes.push(n); edges.push(n.edge);
        return true;
      }
      return false;
    }
    function prune() { // a rede se renova: um ponto da ponta se desliga para outro nascer
      var leaves = nodes.filter(function (n) { return n !== hub && !n.kids && !n.dying && n.edge.t >= 1; });
      if (leaves.length) leaves[rnd(leaves.length)].dying = 1;
    }
    function layout() {
      var s = sec.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = s.width; H = s.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      off = STEP / 2; cols = Math.floor((W - off) / STEP); rows = Math.floor((H - off) / STEP);
      MAX = Math.max(14, Math.min(46, Math.round(cols * rows / 14)));
      avoid = rel(avoidEl, 28); fig = rel(hubEl, 8);
      var hc = Math.round(((fig.x0 + fig.x1) / 2 - off) / STEP), hr = Math.round(((fig.y0 + fig.y1) / 2 - off) / STEP), hp = pt(hc, hr);
      hub = { c: hc, r: hr, x: hp.x, y: hp.y, kids: 0, flash: 0, life: 1, dying: 0, edge: null };
      nodes = [hub]; edges = []; packets = []; rings = []; used = {}; used[hc + ',' + hr] = 1;
      for (var i = 0; i < Math.round(MAX * (reduce ? .8 : .45)); i++) grow(true);
      if (reduce) draw();
    }
    function path(target) { var out = []; for (var n = target; n && n.edge; n = n.parent) out.unshift(n.edge); return out; }
    function along(e, d) {
      if (d <= e.l1) { var k = e.l1 ? d / e.l1 : 1; return { x: e.a.x + (e.m.x - e.a.x) * k, y: e.a.y + (e.m.y - e.a.y) * k }; }
      var k2 = (d - e.l1) / ((e.len - e.l1) || 1); return { x: e.m.x + (e.b.x - e.m.x) * k2, y: e.m.y + (e.b.y - e.m.y) * k2 };
    }
    function lamp(x, y) { if (!mouse) return 0; var dx = x - mouse.x, dy = y - mouse.y, d = Math.sqrt(dx * dx + dy * dy); return d > 200 ? 0 : 1 - d / 200; }
    function step(dt) {
      clock += dt; burst = Math.max(0, burst - dt);
      growT -= dt;
      if (growT <= 0) { growT = .9 + Math.random() * .9; var live = nodes.filter(function (n) { return !n.dying; }).length; if (live >= MAX) prune(); grow(false); }
      edges.forEach(function (e) { if (e.t < 1) { e.t = Math.min(1, e.t + dt * 700 / e.len); if (e.t >= 1) rings.push({ x: e.b.x, y: e.b.y, t: 0, c: color }); } });
      nodes.forEach(function (n) {
        n.flash = Math.max(0, n.flash - dt * 1.6);
        if (n.dying) { n.life -= dt * .9; } else if (n.edge && n.edge.t >= 1) n.life = Math.min(1, n.life + dt * 2.5);
      });
      for (var i = nodes.length - 1; i > 0; i--) { var n = nodes[i]; if (n.dying && n.life <= 0) { n.parent.kids--; delete used[n.id]; nodes.splice(i, 1); edges.splice(edges.indexOf(n.edge), 1); } }
      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = burst ? .07 : .32;
        var ready = nodes.filter(function (n) { return n !== hub && n.edge.t >= 1 && !n.dying; });
        if (ready.length) packets.push({ p: path(ready[rnd(ready.length)]), i: 0, d: 0, c: color, v: burst ? 420 : 230 });
      }
      packets = packets.filter(function (k) {
        var e = k.p[k.i]; if (!e || e.n.dying) return false;
        k.d += k.v * dt;
        while (e && k.d >= e.len) { k.d -= e.len; k.i++; e = k.p[k.i]; }
        if (!e) { var end = k.p[k.p.length - 1].n; end.flash = 1; end.fc = k.c; rings.push({ x: end.x, y: end.y, t: .35, c: k.c }); return false; }
        return true;
      });
      rings = rings.filter(function (r) { r.t += dt * 1.1; return r.t < 1; });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      // grade de pontos que a lanterna revela
      for (var c = 0; c <= cols; c++) for (var r = 0; r <= rows; r++) {
        var g = pt(c, r), a = .09 + lamp(g.x, g.y) * .45;
        ctx.fillStyle = 'rgba(26,59,135,' + a.toFixed(3) + ')'; ctx.fillRect(g.x - 1, g.y - 1, 2, 2);
      }
      ctx.lineWidth = 1.4; ctx.lineCap = 'square';
      edges.forEach(function (e) {
        var f = Math.min(e.n.life + (e.t < 1 ? 1 : 0), 1), a = (.2 + lamp(e.b.x, e.b.y) * .5) * f;
        ctx.strokeStyle = 'rgba(26,59,135,' + a.toFixed(3) + ')';
        var d = e.len * e.t, tip = along(e, d);
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y);
        if (d > e.l1) ctx.lineTo(e.m.x, e.m.y);
        ctx.lineTo(tip.x, tip.y); ctx.stroke();
        if (e.t < 1) { ctx.fillStyle = color; ctx.fillRect(tip.x - 3, tip.y - 3, 6, 6); }
      });
      nodes.forEach(function (n) {
        if (n === hub || n.life <= 0) return;
        var s = 6 + n.flash * 4, a = n.life * (.75 + lamp(n.x, n.y) * .25);
        ctx.globalAlpha = a; ctx.fillStyle = n.flash > .05 ? n.fc : '#2B5AA8';
        if (n.flash > .05) { ctx.shadowColor = n.fc; ctx.shadowBlur = 14 * n.flash; }
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s); ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      rings.forEach(function (r) { var s = 8 + r.t * 34; ctx.globalAlpha = (1 - r.t) * .8; ctx.strokeStyle = r.c; ctx.lineWidth = 1.5; ctx.strokeRect(r.x - s / 2, r.y - s / 2, s, s); });
      ctx.globalAlpha = 1;
      packets.forEach(function (k) {
        var e = k.p[k.i]; ctx.fillStyle = k.c; ctx.shadowColor = k.c; ctx.shadowBlur = 10;
        for (var j = 0; j < 4; j++) {
          var d = k.d - j * 7; if (d < 0) break;
          var q = along(e, d), s = 5 - j; ctx.globalAlpha = 1 - j * .24; ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
        }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });
    }
    function loop(t) {
      if (!running) return;
      var dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
      step(dt); draw(); requestAnimationFrame(loop);
    }
    layout();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 200); });
    if (window.ResizeObserver) { var lastH = H; new ResizeObserver(function () { var h = sec.getBoundingClientRect().height; if (Math.abs(h - lastH) > 4) { lastH = h; clearTimeout(rt); rt = setTimeout(layout, 120); } }).observe(sec); }
    if (reduce) return;
    sec.addEventListener('mousemove', function (e) { var s = sec.getBoundingClientRect(); mouse = { x: e.clientX - s.left, y: e.clientY - s.top }; }, { passive: true });
    sec.addEventListener('mouseleave', function () { mouse = null; });
    $$('[data-disc]', sec).forEach(function (w) {
      var on = function () { color = COLORS[w.dataset.disc] || COLORS.o; burst = 1.6; };
      var off2 = function () { color = COLORS.o; };
      w.addEventListener('mouseenter', on); w.addEventListener('focus', on);
      w.addEventListener('mouseleave', off2); w.addEventListener('blur', off2);
    });
    if (fine) {
      hubEl.addEventListener('mousemove', function (e) { var r = hubEl.getBoundingClientRect(); hubEl.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); hubEl.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
      hubEl.addEventListener('mouseleave', function () { hubEl.style.setProperty('--tx', 0); hubEl.style.setProperty('--ty', 0); });
    }
    var start = function () { if (!running) { running = true; last = 0; requestAnimationFrame(loop); } };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else running = false; }); }).observe(sec);
    else start();
  });

  /* ---------- Contato: formas que seguem o mouse e aviso de atendimento ---------- */
  $$('[data-ct]').forEach(function (st) {
    if (!fine || reduce) return;
    var raf = 0, nx = 0, ny = 0;
    st.addEventListener('mousemove', function (e) {
      var r = st.getBoundingClientRect(); nx = (e.clientX - r.left) / r.width * 2 - 1; ny = (e.clientY - r.top) / r.height * 2 - 1;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; st.style.setProperty('--mx', nx.toFixed(3)); st.style.setProperty('--my', ny.toFixed(3)); });
    }, { passive: true });
    st.addEventListener('mouseleave', function () { st.style.setProperty('--mx', 0); st.style.setProperty('--my', 0); });
  });
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
})();
