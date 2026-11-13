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

// Vyra · modelo Intermediário
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // Topo, barra de progresso e menu
  var hdr = $('.hdr'), prog = $('.progress');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    hdr.classList.toggle('scrolled', scrollY > 20);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mb = $('.menu-btn'), nav = $('.nav');
  if (mb) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

  // Palco de ofertas com abas
  var stage = $('.stage');
  if (stage) {
    var slides = $$('.slide', stage), tabs = $$('.stab', stage), cur = 0, timer, DUR = 7000;
    stage.style.setProperty('--dur', DUR + 'ms');
    var go = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      tabs.forEach(function (t) { t.setAttribute('aria-current', 'false'); });
      void stage.offsetWidth; tabs[cur].setAttribute('aria-current', 'true');
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, DUR);
    };
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    stage.addEventListener('mouseenter', function () { clearTimeout(timer); stage.classList.add('paused'); });
    stage.addEventListener('mouseleave', function () { stage.classList.remove('paused'); go(cur); });
    var x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  // Abas de planos com pílula deslizante
  $$('.ptabs').forEach(function (tl) {
    var btns = $$('[role=tab]', tl), pill = $('.pill', tl);
    function place(b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + (b.offsetLeft - 5) + 'px)'; }
    btns.forEach(function (b) { b.addEventListener('click', function () {
      btns.forEach(function (o) { o.setAttribute('aria-selected', o === b); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== b; });
      place(b);
    }); });
    place(btns[0]);
    addEventListener('resize', function () { place(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]); });
    if (document.fonts) document.fonts.ready.then(function () { place(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]); });
  });

  // Plano Família: escolha do streaming
  $$('.choose').forEach(function (g) {
    var bs = $$('button', g), out = g.parentNode.querySelector('.logos');
    bs.forEach(function (b) { b.addEventListener('click', function () {
      bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
      out.innerHTML = b.dataset.logos;
    }); });
  });

  // Luz que segue o mouse e leve inclinação nos planos
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    $$('.plan').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        el.style.transform = 'perspective(1200px) rotateX(' + ((y / r.height) - .5) * -5 + 'deg) rotateY(' + ((x / r.width) - .5) * 6 + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // Linha que se desenha com a rolagem
  $$('.path').forEach(function (wrap) {
    var svg = $('svg.line', wrap), track = $('.track', svg), draw = $('.draw', svg), dot = $('.head-dot', svg), cards = $$('.pcard', wrap), len = 0;
    function build() {
      var w = wrap.clientWidth, h = wrap.clientHeight, n = cards.length;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var d = 'M ' + (w * .5) + ' 0', amp = Math.min(w * .3, 300);
      for (var i = 0; i < n + 1; i++) {
        var y0 = i * h / (n + 1), y1 = (i + 1) * h / (n + 1), side = i % 2 ? -1 : 1;
        d += ' C ' + (w * .5 + side * amp) + ' ' + (y0 + (y1 - y0) * .35) + ', ' + (w * .5 + side * amp) + ' ' + (y0 + (y1 - y0) * .65) + ', ' + (w * .5) + ' ' + y1;
      }
      track.setAttribute('d', d); draw.setAttribute('d', d);
      len = draw.getTotalLength(); draw.style.strokeDasharray = len; update();
    }
    function update() {
      var r = wrap.getBoundingClientRect(), p = (innerHeight * .65 - r.top) / r.height;
      p = reduce ? 1 : Math.max(0, Math.min(1, p));
      draw.style.strokeDashoffset = len * (1 - p);
      var pt = draw.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      dot.style.opacity = p > 0.01 && p < 0.99 ? 1 : 0;
      cards.forEach(function (c) { var cr = c.getBoundingClientRect(); c.classList.toggle('lit', reduce || (cr.top + cr.height / 2 - r.top) / r.height <= p + .02); });
    }
    build(); addEventListener('resize', build); addEventListener('scroll', update, { passive: true });
    if (document.fonts) document.fonts.ready.then(build);
  });

  // Galeria arrastável
  $$('.gallery').forEach(function (g) {
    var box = g.closest('section'), prev = $('.gal-nav .prev', box), next = $('.gal-nav .next', box);
    var step = function () { var c = $('.gcard', g); return c ? c.offsetWidth + 18 : 300; };
    if (prev) prev.addEventListener('click', function () { g.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { g.scrollBy({ left: step(), behavior: 'smooth' }); });
    var down = false, sx = 0, sl = 0, moved = false;
    g.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; g.classList.add('drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; g.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; g.classList.remove('drag'); });
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  // Foto de fundo com leve parallax
  var bands = $$('.band > img');
  if (!reduce && bands.length) addEventListener('scroll', function () {
    bands.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; im.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -0.08) + 'px)'; });
  }, { passive: true });

  // Contadores
  function count(el) {
    var raw = el.dataset.count, end = parseFloat(raw.replace(',', '.')), dec = (raw.split(',')[1] || '').length, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = raw + suf; return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1500, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec).replace('.', ',') + suf; if (p < 1) requestAnimationFrame(step); });
  }

  // Entrada ao rolar (só esconde o que está abaixo da tela) e contadores
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; e.target.classList.remove('pre');
      if (e.target.dataset.count) count(e.target);
      io.unobserve(e.target);
    }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv, .reveal-img').forEach(function (el) {
      if (!reduce && el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 100) + 'ms'; io.observe(el); }
    });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  }

  // FAQ
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () {
    var it = b.closest('.acc-item'), o = !it.classList.contains('open'); it.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  }); });

  // Formulários (integre aqui com seu backend, e-mail ou WhatsApp)
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) {
    e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); var ok = $('.form-ok', f); if (ok) ok.focus();
  }); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
    i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  $$('form.cep').forEach(function (cep) { cep.addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('input', cep).value.replace(/\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
    out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
    setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
  }); });

  // Assine já: plano pela URL e resumo ao lado
  var radios = $$('input[name=plano]');
  function sync() { var r = $('input[name=plano]:checked'), s = $('.summary'); if (!r || !s) return;
    $('[data-s=name]', s).textContent = r.dataset.name; $('[data-s=speed]', s).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>';
    $('[data-s=price]', s).textContent = 'R$ ' + r.dataset.price; $('[data-s=logos]', s).innerHTML = r.dataset.logos; }
  var h = location.hash.slice(1);
  if (h) { var pre = $('input[name=plano][value="' + h + '"]'); if (pre) pre.checked = true;
    var m = h.match(/^cep-(\d{8})$/), ci = document.getElementById('a-cep'); if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5); }
  radios.forEach(function (r) { r.addEventListener('change', sync); }); sync();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
