// Vyra · comportamento comum
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function toTop() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  toTop();
  addEventListener('load', function () { toTop(); setTimeout(toTop, 60); });
  addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.nav a');
    if (!a) return;
    var nav = a.closest('.nav'); nav.classList.remove('open');
    var b = document.querySelector('.menu-btn');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (b.dataset.open) b.innerHTML = b.dataset.open; }
  });
})();

// Vyra · modelo Premium
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Cursor próprio ---------- */
  if (fine && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    addEventListener('mousedown', function () { ring.classList.add('down'); });
    addEventListener('mouseup', function () { ring.classList.remove('down'); });
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, .spot');
      ring.classList.remove('hover', 'text');
      if (!t) return;
      var txt = t.getAttribute('data-cursor');
      if (txt) { ring.classList.add('text'); ring.firstChild.textContent = txt; } else ring.classList.add('hover');
    });
  }

  /* ---------- Transição entre páginas ---------- */
  var curtain = $('.curtain');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || !curtain || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!/^[\w-]+\.html(#[\w-]*)?$/.test(href)) return;
    if (href.split('#')[0] === location.pathname.split('/').pop() && href.indexOf('#') > -1) return;
    e.preventDefault();
    try { sessionStorage.setItem('vyra-nav', '1'); } catch (err) {}
    curtain.classList.add('cover');
    setTimeout(function () { location.href = href; }, 520);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('cover'); });

  /* ---------- Topo, progresso e menu ---------- */
  var hdr = $('.hdr'), prog = $('.progress'), lastY = 0;
  function onScroll() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 40);
    hdr.classList.toggle('hide', y > lastY && y > 300 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mm = $('.mmenu');
  $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () {
    var open = !mm.classList.contains('open');
    mm.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
    $$('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', open); });
    if (open) setTimeout(function () { var f = mm.querySelector('a'); f && f.focus(); }, 300);
  }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) $('[data-menu]').click(); });

  /* ---------- Botões magnéticos e luz que segue o mouse ---------- */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * .3 + 'px,' + y * .35 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    $$('.spot').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        if (el.hasAttribute('data-tilt')) el.style.transform = 'rotateX(' + ((y / r.height) - .5) * -6 + 'deg) rotateY(' + ((x / r.width) - .5) * 8 + 'deg)';
      });
      el.addEventListener('mouseleave', function () { if (el.hasAttribute('data-tilt')) el.style.transform = ''; });
    });
  }

  /* ---------- Rede de fibra em canvas ---------- */
  $$('canvas.net').forEach(function (cv) {
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), W, H, nodes = [], pulses = [], mouse = { x: -999, y: -999 }, running = true;
    var density = parseFloat(cv.dataset.density || '1');
    function resize() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(110, Math.round(W * H / 13000 * density));
      nodes = []; for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
      if (reduce) draw();
    }
    var LINK = 150;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          var dmx = mouse.x - a.x, dmy = mouse.y - a.y, dm = Math.hypot(dmx, dmy); if (dm < 180) { a.x += dmx * .004; a.y += dmy * .004; } }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            var near = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2) < 160;
            ctx.strokeStyle = near ? 'rgba(232,72,12,' + (1 - d / LINK) * .7 + ')' : 'rgba(255,90,31,' + (1 - d / LINK) * .38 + ')';
            ctx.lineWidth = near ? 1 : .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduce && Math.random() < .0009 && pulses.length < 26) pulses.push({ a: a, b: b, t: 0, s: .008 + Math.random() * .012 });
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k], hot = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 140;
        ctx.fillStyle = hot ? '#E8480C' : 'rgba(232,72,12,.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, hot ? 2.4 : 1.5, 0, 6.283); ctx.fill();
      }
      pulses = pulses.filter(function (p) {
        p.t += p.s; if (p.t >= 1) return false;
        var x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, 'rgba(232,72,12,.95)'); g.addColorStop(1, 'rgba(232,72,12,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
        return true;
      });
    }
    function loop() { if (running) draw(); requestAnimationFrame(loop); }
    resize(); addEventListener('resize', resize);
    var host = cv.parentElement;
    host.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { running = es[0].isIntersecting; }).observe(cv);
    if (!reduce) loop();
  });

  /* ---------- Revelar ao rolar ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = (el.dataset.d || 0) * 110 + 'ms'; io.observe(el); } });
  }

  /* ---------- Manifesto: palavras acendem com a rolagem ---------- */
  var man = $('.manifesto');
  if (man) {
    var words = $$('.mw', man);
    var lit = function () {
      var r = man.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .3);
      var n = reduce ? words.length : Math.round(Math.max(0, Math.min(1, p)) * words.length);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    };
    addEventListener('scroll', lit, { passive: true }); lit();
  }

  /* ---------- Status ao vivo (demonstração) ---------- */
  var lat = $('[data-live=lat]'), up = $('[data-live=up]');
  if (lat && !reduce) setInterval(function () { lat.textContent = (3 + Math.floor(Math.random() * 3)) + ' ms'; up.textContent = (99.9 + Math.random() * .09).toFixed(2).replace('.', ',') + '%'; }, 1800);

  /* ---------- Simulador de plano ---------- */
  var sim = $('.sim');
  if (sim) {
    var people = 3, out = $('output', sim), arc = $('.gauge .val'), num = $('.gauge text'), rec = $('.rec'), go = $('[data-sim-go]'), why = $('[data-sim-why]');
    var shownMbps = 0;
    function calc() {
      var acts = $$('.acts button[aria-pressed=true]', sim).reduce(function (s, b) { return s + +b.dataset.mbps; }, 0);
      var need = Math.round(people * 22 + acts * (1 + (people - 1) * .22));
      var plan = need <= 250 ? ['essencial', 'Essencial', '300 Mega'] : need <= 520 ? ['conecta', 'Conecta', '600 Mega'] : ['ultra', 'Ultra', '1 Giga'];
      out.value = people;
      arc.style.strokeDashoffset = 100 - Math.min(100, need / 10);
      rec.innerHTML = 'Plano <b>' + plan[1] + '</b>';
      why.textContent = 'Sua casa usa cerca de ' + need + ' Mbps nos horários de pico. O ' + plan[1] + ' (' + plan[2] + ') dá conta com folga.';
      go.setAttribute('href', 'assine.html#' + plan[0]); go.querySelector('span').textContent = 'Assinar ' + plan[1];
      var from = shownMbps, t0 = null; shownMbps = need;
      if (reduce) { num.textContent = need; return; }
      requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 700, 1); num.textContent = Math.round(from + (need - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); });
    }
    $$('[data-step]', sim).forEach(function (b) { b.addEventListener('click', function () { people = Math.max(1, Math.min(10, people + +b.dataset.step)); calc(); }); });
    $$('.acts button', sim).forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); calc(); }); });
    calc();
  }

  /* ---------- Depoimentos ---------- */
  var qs = $$('.q'), qd = $$('.qdots button'), qi = 0, qt;
  function showQ(i) { qi = i; qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); qd.forEach(function (d, k) { d.setAttribute('aria-current', k === i); }); clearTimeout(qt); if (!reduce) qt = setTimeout(function () { showQ((qi + 1) % qs.length); }, 6000); }
  qd.forEach(function (d, k) { d.addEventListener('click', function () { showQ(k); }); });
  if (qs.length) showQ(0);

  /* ---------- Valores (Sobre) no toque ---------- */
  var vals = $$('.val');
  function pickVal(v) { vals.forEach(function (o) { var on = o === v; o.classList.toggle('on', on); o.setAttribute('aria-expanded', on); if (on) o.removeAttribute('data-cursor'); else o.setAttribute('data-cursor', 'Abrir'); }); }
  vals.forEach(function (v) {
    v.addEventListener('click', function () { pickVal(v); });
    v.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickVal(v); } });
  });
  if (vals.length) pickVal(vals.filter(function (v) { return v.classList.contains('on'); })[0] || vals[0]);

  /* ---------- Serviços: índice fixo ---------- */
  var navs = $$('.svc-nav a');
  if (navs.length) {
    var items = $$('.svc-item'), svcNav = $('.svc-nav');
    var lightUp = function () {
      var cur = 0;
      items.forEach(function (it, k) { if (it.getBoundingClientRect().top < innerHeight * .55) cur = k; });
      navs.forEach(function (a, k) { a.classList.toggle('lit', k <= cur); a.classList.toggle('on', k === cur); });
      svcNav.style.setProperty('--fill', (navs.length > 1 ? cur / (navs.length - 1) * 100 : 100) + '%');
    };
    addEventListener('scroll', lightUp, { passive: true }); addEventListener('resize', lightUp); lightUp();
  }

  /* ---------- FAQ: acordeão e busca ---------- */
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () {
    var it = b.closest('.acc-item'), open = !it.classList.contains('open'); it.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  }); });
  var sq = $('#faq-search');
  if (sq) sq.addEventListener('input', function () {
    var q = sq.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), any = false;
    $$('.acc-item').forEach(function (it) { var hit = it.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(q) > -1; it.hidden = !hit; any = any || hit; });
    $('.empty').hidden = any;
  });

  /* ---------- Formulários ---------- */
  $$('.fl select').forEach(function (s) { s.closest('.fl').classList.add('sel'); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
    i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  // Integre aqui com seu backend, e-mail ou WhatsApp.
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); }); });

  /* ---------- Assine já em etapas ---------- */
  var wz = $('.wizard form');
  if (wz) {
    var panels = $$('.wpanel', wz), marks = $$('.wsteps div'), cur = 0;
    function go(i) {
      cur = i; panels.forEach(function (p, k) { p.classList.toggle('cur', k === i); });
      marks.forEach(function (m, k) { m.classList.toggle('done', k < i); m.classList.toggle('cur', k === i); });
      scrollTo({ top: $('.wizard').getBoundingClientRect().top + scrollY - 120, behavior: reduce ? 'auto' : 'smooth' });
    }
    function valid(p) { var ok = true; $$('input, select', p).forEach(function (i) { if (ok && !i.checkValidity()) { i.reportValidity(); ok = false; } }); return ok; }
    $$('[data-next]', wz).forEach(function (b) { b.addEventListener('click', function () { if (valid(panels[cur])) go(cur + 1); }); });
    $$('[data-prev]', wz).forEach(function (b) { b.addEventListener('click', function () { go(cur - 1); }); });
    wz.addEventListener('submit', function (e) { e.preventDefault(); if (!valid(panels[cur])) return;
      panels.forEach(function (p) { p.classList.remove('cur'); }); marks.forEach(function (m) { m.classList.add('done'); m.classList.remove('cur'); });
      $('.done-box').classList.add('on'); });
    var sum = $('.wsum');
    function sync() { var r = $('input[name=plano]:checked', wz); if (!r) return;
      $('[data-s=name]', sum).textContent = r.dataset.name; $('[data-s=speed]', sum).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>'; $('[data-s=price]', sum).textContent = 'R$ ' + r.dataset.price; }
    var h = location.hash.slice(1), pre = h && $('input[name=plano][value="' + h + '"]', wz); if (pre) pre.checked = true;
    $$('input[name=plano]', wz).forEach(function (r) { r.addEventListener('change', sync); }); sync();
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
