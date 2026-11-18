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
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* Cursor próprio */
  if (fine && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); } dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    (function loop() { rx += (mx - rx) * .17; ry += (my - ry) * .17; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, input[type=range]');
      ring.classList.remove('hover', 'text'); if (!t) return;
      var txt = t.getAttribute('data-cursor'); if (txt) { ring.classList.add('text'); ring.firstChild.textContent = txt; } else ring.classList.add('hover');
    });
  }

  /* Transição entre páginas */
  var curtain = $('.curtain');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a || !curtain || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href'); if (!/^[\w-]+\.html(#[\w-]*)?$/.test(href)) return;
    e.preventDefault(); try { sessionStorage.setItem('vyra-nav', '1'); } catch (err) {}
    curtain.classList.add('cover'); setTimeout(function () { location.href = href; }, 520);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('cover'); });

  /* Topo, progresso e menu */
  var hdr = $('.hdr'), prog = $('.progress'), lastY = 0;
  function onScroll() { var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 60); hdr.classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('menu-open')); lastY = y; }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mm = $('.mmenu');
  $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () { var o = !mm.classList.contains('open'); mm.classList.toggle('open', o); document.body.classList.toggle('menu-open', o); $$('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', o); }); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) $('[data-menu]').click(); });

  /* Cards flutuantes acompanham o mouse */
  var sc = $('.scatter');
  if (sc && fine && !reduce) sc.addEventListener('mousemove', function (e) {
    var r = sc.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    $$('.fcard', sc).forEach(function (c, i) { var d = (i % 3 + 1) * 8; c.style.translate = (dx * d) + 'px ' + (dy * d) + 'px'; });
  });

  /* Botões magnéticos */
  if (fine && !reduce) $$('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* Hero com miniaturas */
  var hero = $('.hero');
  if (hero) {
    var hs = $$('.hslide', hero), th = $$('.hthumb', hero), cur = 0, timer, DUR = 7000;
    hero.style.setProperty('--dur', DUR + 'ms');
    var go = function (i) { cur = (i + hs.length) % hs.length;
      hs.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      th.forEach(function (t) { t.setAttribute('aria-current', 'false'); }); void hero.offsetWidth; th[cur].setAttribute('aria-current', 'true');
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, DUR); };
    th.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    hero.addEventListener('mouseenter', function () { clearTimeout(timer); hero.classList.add('paused'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('paused'); go(cur); });
    if (fine && !reduce) hero.addEventListener('mousemove', function (e) { var dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
      $$('.himg', hero).forEach(function (im) { im.style.transform = 'translate(' + (-dx * 24) + 'px,' + (-dy * 18) + 'px)'; }); });
    var x0 = null; hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  /* Abas de planos */
  $$('.ptabs').forEach(function (tl) { var bs = $$('[role=tab]', tl), pill = $('.pill', tl);
    var place = function (b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + (b.offsetLeft - 6) + 'px)'; };
    var curB = function () { return bs.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; };
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-selected', o === b); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== b; }); place(b); }); });
    place(bs[0]); addEventListener('resize', function () { place(curB()); }); if (document.fonts) document.fonts.ready.then(function () { place(curB()); }); });

  /* Escolha do streaming no Família */
  $$('.choose').forEach(function (g) { var bs = $$('button', g), out = g.parentNode.querySelector('.logos');
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); out.innerHTML = b.dataset.logos; }); }); });

  /* Luz e inclinação nos cards */
  if (fine && !reduce) $$('.plan, [data-tilt]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      el.style.transform = 'perspective(1200px) rotateX(' + ((y / r.height) - .5) * -6 + 'deg) rotateY(' + ((x / r.width) - .5) * 7 + 'deg) translateY(-4px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* Pontos clicáveis na imagem */
  $$('.hs').forEach(function (b) { b.addEventListener('click', function () { var o = !b.classList.contains('open'); $$('.hs').forEach(function (x) { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); }); b.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.hs')) $$('.hs.open').forEach(function (x) { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); }); });

  /* Comparador antes/depois */
  $$('.ba').forEach(function (ba) { var r = $('input', ba);
    var set = function (v) { ba.style.setProperty('--pos', v + '%'); r.value = v; };
    r.addEventListener('input', function () { set(r.value); });
    if (!reduce && 'IntersectionObserver' in window) { var played = false, ob = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !played) { played = true; ob.disconnect();
      var t0 = null; requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 2400, 1), v = 50 + Math.sin(p * Math.PI * 2) * 28 * (1 - p); set(v.toFixed(1)); if (p < 1) requestAnimationFrame(step); }); } }, { threshold: .5 }); ob.observe(ba); } });

  /* Galeria presa que anda de lado */
  $$('.hgal').forEach(function (sec) { var track = $('.hgal-track', sec), sticky = $('.hgal-sticky', sec);
    function size() { if (innerWidth <= 900 || reduce) { sec.style.height = ''; track.style.transform = ''; return; }
      var extra = track.scrollWidth - innerWidth; sec.style.height = (innerHeight + Math.max(0, extra)) + 'px'; move(); }
    function move() { if (innerWidth <= 900 || reduce) return; var r = sec.getBoundingClientRect(), extra = track.scrollWidth - innerWidth, p = Math.max(0, Math.min(1, -r.top / (sec.offsetHeight - innerHeight)));
      track.style.transform = 'translateX(' + (-p * extra) + 'px)'; }
    size(); addEventListener('resize', size); addEventListener('scroll', move, { passive: true }); addEventListener('load', size); });

  /* Carrossel 3D de avaliações */
  $$('.cf-wrap').forEach(function (w) { var cards = $$('.cf-card', w), dots = $$('.cf-dots button', w), n = cards.length, cur = 0, t;
    function render() { cards.forEach(function (c, i) { var o = i - cur; if (o > n / 2) o -= n; if (o < -n / 2) o += n; var a = Math.abs(o);
      c.style.transform = 'translateX(' + (o * 58) + '%) translateZ(' + (-a * 160) + 'px) rotateY(' + (o * -16) + 'deg)'; c.style.opacity = a > 2 ? 0 : 1 - a * .25; c.style.zIndex = 10 - a; c.style.filter = a ? 'saturate(.6) brightness(.85)' : 'none'; c.setAttribute('aria-hidden', a !== 0); });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === cur); }); }
    function go(i) { cur = (i + n) % n; render(); clearTimeout(t); if (!reduce) t = setTimeout(function () { go(cur + 1); }, 5000); }
    $('.cf-nav .prev', w).addEventListener('click', function () { go(cur - 1); }); $('.cf-nav .next', w).addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); }); cards.forEach(function (c, i) { c.addEventListener('click', function () { go(i); }); });
    w.addEventListener('mouseenter', function () { clearTimeout(t); }); w.addEventListener('mouseleave', function () { go(cur); });
    var x0 = null; w.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true }); w.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0); });

  /* Manifesto que acende */
  $$('.manifesto').forEach(function (m) { var ws = $$('.mw', m);
    var lit = function () { var r = m.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .25), k = reduce ? ws.length : Math.round(Math.max(0, Math.min(1, p)) * ws.length); ws.forEach(function (w, i) { w.classList.toggle('lit', i < k); }); };
    addEventListener('scroll', lit, { passive: true }); lit(); });

  /* Linha que se desenha */
  $$('.path').forEach(function (wrap) { var svg = $('svg.line', wrap), track = $('.track', svg), draw = $('.draw', svg), dot = $('.head-dot', svg), cards = $$('.pcard', wrap), len = 0;
    function build() { var w = wrap.clientWidth, h = wrap.clientHeight, n = cards.length; svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var d = 'M ' + (w * .5) + ' 0', amp = Math.min(w * .3, 300);
      for (var i = 0; i < n + 1; i++) { var y0 = i * h / (n + 1), y1 = (i + 1) * h / (n + 1), sd = i % 2 ? -1 : 1; d += ' C ' + (w * .5 + sd * amp) + ' ' + (y0 + (y1 - y0) * .35) + ', ' + (w * .5 + sd * amp) + ' ' + (y0 + (y1 - y0) * .65) + ', ' + (w * .5) + ' ' + y1; }
      track.setAttribute('d', d); draw.setAttribute('d', d); len = draw.getTotalLength(); draw.style.strokeDasharray = len; update(); }
    function update() { var r = wrap.getBoundingClientRect(), p = reduce ? 1 : Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height));
      draw.style.strokeDashoffset = len * (1 - p); var pt = draw.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = p > .01 && p < .99 ? 1 : 0;
      cards.forEach(function (c) { var cr = c.getBoundingClientRect(); c.classList.toggle('lit', reduce || (cr.top + cr.height / 2 - r.top) / r.height <= p + .02); }); }
    build(); addEventListener('resize', build); addEventListener('scroll', update, { passive: true }); if (document.fonts) document.fonts.ready.then(build); });

  /* Parallax nas faixas */
  var bands = $$('.band > img');
  if (!reduce && bands.length) addEventListener('scroll', function () { bands.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; im.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -0.1) + 'px)'; }); }, { passive: true });

  /* Contadores */
  function count(el) { var raw = el.dataset.count, end = parseFloat(raw.replace(',', '.')), dec = (raw.split(',')[1] || '').length, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = raw + suf; return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1600, 1); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',') + suf; if (p < 1) requestAnimationFrame(step); }); }

  /* Entrada ao rolar */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.remove('pre'); e.target.classList.add('rv-in'); if (e.target.dataset.count) count(e.target); io.unobserve(e.target); }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv, .clip, .reveal-img').forEach(function (el) { if (!reduce && el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 110) + 'ms'; io.observe(el); } else el.classList.add('rv-in'); });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* Simulador */
  var sim = $('.sim');
  if (sim) { var people = 3, out = $('output', sim), arc = $('.gauge .val', sim), num = $('.gauge text', sim), rec = $('.rec', sim), goB = $('[data-sim-go]', sim), why = $('[data-sim-why]', sim), shownM = 0;
    function calc() { var acts = $$('.acts button[aria-pressed=true]', sim).reduce(function (s, b) { return s + +b.dataset.mbps; }, 0), need = Math.round(people * 22 + acts * (1 + (people - 1) * .22));
      var plan = need <= 250 ? ['start', 'Start', '500 Mega'] : need <= 520 ? ['familia', 'Família', '800 Mega'] : ['ultra', 'Ultra', '1 Giga'];
      out.value = people; arc.style.strokeDashoffset = 100 - Math.min(100, need / 10); rec.innerHTML = 'Vyra <b>' + plan[1] + '</b>';
      why.textContent = 'Sua casa usa cerca de ' + need + ' Mbps nos horários de pico. O ' + plan[1] + ' (' + plan[2] + ') dá conta com folga.';
      goB.setAttribute('href', 'assine.html#' + plan[0]); goB.querySelector('span').textContent = 'Assinar o ' + plan[1];
      var from = shownM, t0 = null; shownM = need; if (reduce) { num.textContent = need; return; }
      requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 700, 1); num.textContent = Math.round(from + (need - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }); }
    $$('[data-step]', sim).forEach(function (b) { b.addEventListener('click', function () { people = Math.max(1, Math.min(10, people + +b.dataset.step)); calc(); }); });
    $$('.acts button', sim).forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); calc(); }); });
    calc(); }

  /* FAQ: acordeão e busca */
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () { var it = b.closest('.acc-item'), o = !it.classList.contains('open'); it.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }); });
  var sq = $('#faq-search');
  if (sq) sq.addEventListener('input', function () { var norm = function (x) { return x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }, q = norm(sq.value), any = false;
    $$('.acc-item').forEach(function (it) { var hit = norm(it.textContent).indexOf(q) > -1; it.hidden = !hit; any = any || hit; }); $('.empty').hidden = any; });

  /* Formulários */
  $$('.fl select').forEach(function (s) { s.closest('.fl').classList.add('sel'); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11); i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  // Integre aqui com seu backend, e-mail ou WhatsApp.
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); }); });
  $$('form.cep').forEach(function (cep) { cep.addEventListener('submit', function (e) { e.preventDefault(); var v = $('input', cep).value.replace(/\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; } out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...'; setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900); }); });

  /* Área do cliente (demonstração: confere os dados fictícios no próprio navegador) */
  var ca = $('.ca');
  if (ca) {
    var lf = $('form.login', ca), lgBox = $('[data-ca-login]', ca), dash = $('[data-ca-dash]', ca), err = $('.err', lf), KEY = 'vyra-cliente';
    var store = function (k) { try { return k ? localStorage : sessionStorage; } catch (x) { return null; } };
    var showDash = function (on, scroll) {
      lgBox.hidden = on; dash.hidden = !on; dash.classList.remove('in');
      if (on) requestAnimationFrame(function () { requestAnimationFrame(function () { dash.classList.add('in'); var l = $('.bills', dash), b = $('.bill[aria-pressed="true"]', dash); if (l && b) l.scrollTop = b.parentNode.offsetTop - 8; }); });
      if (scroll) ca.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    try { if (sessionStorage.getItem(KEY) || localStorage.getItem(KEY)) showDash(true); } catch (x) {}
    $$('input[data-mask=cpf]', ca).forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11), o = v.slice(0, 3);
      if (v.length > 3) o += '.' + v.slice(3, 6); if (v.length > 6) o += '.' + v.slice(6, 9); if (v.length > 9) o += '-' + v.slice(9); i.value = o; }); });
    var eye = $('.eye', lf), pw = $('#l-pass');
    eye.addEventListener('click', function () { var show = pw.type === 'password'; pw.type = show ? 'text' : 'password'; eye.setAttribute('aria-pressed', show); eye.setAttribute('aria-label', show ? 'Esconder senha' : 'Mostrar senha'); });
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!lf.checkValidity()) { lf.reportValidity(); return; }
      if ($('#l-cpf').value.replace(/\D/g, '') !== lf.dataset.cpf || pw.value !== lf.dataset.pw) { err.hidden = false; return; }
      err.hidden = true; lf.classList.add('busy');
      setTimeout(function () { var s = store($('#l-keep').checked); try { s && s.setItem(KEY, '1'); } catch (x) {} lf.classList.remove('busy'); showDash(true, true); }, 600);
    });
    $('[data-ca-logout]', ca).addEventListener('click', function () { try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch (x) {} showDash(false, true); });
    var sched = $('[data-wa-sched]', ca), base = sched.getAttribute('href').split('?')[0];
    $$('input[name=servico]', ca).forEach(function (r) { r.addEventListener('change', function () {
      sched.setAttribute('href', base + '?text=' + encodeURIComponent(sched.dataset.tpl.replace('{servico}', r.value.toLowerCase()))); }); });

    /* Faturas: escolher o mês, gerar a fatura ou antecipar o pagamento (códigos fictícios) */
    var bl = $('[data-bills]', ca);
    if (bl) {
      var out = $('.bout', bl), cur = function () { return $('.bill[aria-pressed="true"]', bl) || $('.bill', bl); };
      $$('.bill', bl).forEach(function (b) { b.addEventListener('click', function () { $$('.bill', bl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); out.hidden = true; }); });
      var modal = $('.bmodal', ca), mbody = modal && $('.mbody', modal), lastFocus = null, info = { cls: '', title: '', body: '' };
      var TOOLS = '<span class="tools"><button type="button" class="tool" data-expand aria-label="Expandir informações da fatura" title="Expandir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.5v-5h5M19.5 9.5v-5h-5M4.5 14.5v5h5M19.5 14.5v5h-5"/></svg></button>' +
        '<button type="button" class="tool" data-collapse aria-label="Recolher informações da fatura" title="Recolher"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button></span>';
      var say = function (cls, title, body, el, mode) { info = { cls: cls, title: title, body: body, el: el, mode: mode };
        out.className = 'bout' + (cls ? ' ' + cls : ''); out.innerHTML = '<div class="bt"><b>' + title + '</b>' + TOOLS + '</div>' + body; out.hidden = false; };
      var collapse = function () { if (out.hidden) return; out.classList.add('closing'); setTimeout(function () { out.hidden = true; out.classList.remove('closing'); }, reduce ? 0 : 260); };
      var openModal = function (cls, html) { if (!modal) return; var already = !modal.hidden; if (!already) lastFocus = document.activeElement;
        modal.className = 'bmodal' + (cls ? ' ' + cls : '') + (already ? ' on' : ''); mbody.innerHTML = html; modal.scrollTop = 0;
        if (already) { $('.mclose', modal).focus(); return; }
        modal.hidden = false; document.documentElement.classList.add('modal-open'); requestAnimationFrame(function () { modal.classList.add('on'); $('.mclose', modal).focus(); }); };
      var closeModal = function () { if (!modal || modal.hidden) return; modal.classList.remove('on'); document.documentElement.classList.remove('modal-open');
        setTimeout(function () { modal.hidden = true; }, reduce ? 0 : 300); if (lastFocus) lastFocus.focus(); };
      var pix = function (d) { return '00020126VYRA.PIX.' + bl.dataset.contract + '.' + d.label.slice(-4) + d.mm + '.DEMO5204000053039865406' + d.value.replace(',', '') + '5802BR'; };
      var paidMsg = function (el) { var d = el.dataset; say('ok-paid', d.label + ' já está paga.', '<span>Pagamento confirmado em ' + d.paid + '. Nada a fazer por aqui.</span>', el, 'via'); };
      var slip = function (title, el, mode, rows) { var d = el.dataset;
        say('', title, rows.map(function (r) { return '<div class="ln"><span>' + r[0] + '</span><strong>' + r[1] + '</strong></div>'; }).join('') +
          '<span>Pix copia e cola (demonstração):</span><code>' + pix(d) + '</code><button type="button" class="copy">Copiar código Pix</button>', el, mode);
      };
      $('[data-bill="gerar"]', bl).addEventListener('click', function () { var el = cur(), d = el.dataset;
        if (d.st === 'paga') return paidMsg(el);
        slip('Fatura de ' + d.label + ' gerada', el, 'gerar', d.st === 'atraso'
          ? [['Venceu em', d.due], ['Atraso', d.late + ' dias'], ['Valor com multa e juros', 'R$ ' + d.value]]
          : [['Vencimento', d.due], ['Valor', 'R$ ' + d.value]]); });
      $('[data-bill="antecipar"]', bl).addEventListener('click', function () { var el = cur(), d = el.dataset;
        if (d.st === 'paga') return paidMsg(el);
        if (d.st === 'atraso') return say('warn', d.label + ' já venceu em ' + d.due + '.', '<span>Não dá para antecipar uma fatura vencida. Use Gerar fatura para pagar com multa e juros.</span>');
        slip('Antecipação de ' + d.label, el, 'antecipar', [['Vencimento original', d.due], ['Valor', 'R$ ' + d.value], ['Baixa na fatura', 'até 1 dia útil']]); });

      /* Modal da fatura: dados do assinante, valor, Pix e boleto com código de barras (tudo fictício) */
      var MES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      var tpl = function (c) { var t = $('template.' + c, bl); return t ? t.innerHTML : ''; };
      var num = function (s) { return parseFloat(String(s).replace(/\./g, '').replace(',', '.')); };
      var money = function (n) { return 'R$ ' + n.toFixed(2).replace('.', ','); };
      var pad = function (s, n) { s = String(s); while (s.length < n) s = '0' + s; return s.slice(-n); };
      var boleto = function (d) {
        var cents = pad(d.value.replace(/\D/g, ''), 10), free = pad(bl.dataset.contract.replace(/\D/g, '') + d.label.slice(-4) + d.mm + '7041', 25);
        var bar = '0009' + '1' + '1000' + cents + free;
        var f1 = bar.slice(0, 4) + free.slice(0, 5) + '3', f2 = free.slice(5, 15) + '8', f3 = free.slice(15, 25) + '6';
        return { bar: bar, line: f1.slice(0, 5) + '.' + f1.slice(5) + ' ' + f2.slice(0, 5) + '.' + f2.slice(5) + ' ' + f3.slice(0, 5) + '.' + f3.slice(5) + ' 1 1000' + cents };
      };
      var I25 = ['nnwwn', 'wnnnw', 'nwnnw', 'wwnnn', 'nnwnw', 'wnwnn', 'nwwnn', 'nnnww', 'wnnwn', 'nwnwn'];
      var barSvg = function (code) { var seq = 'nnnn', x = 0, r = '';
        for (var i = 0; i < code.length; i += 2) { var a = I25[+code[i]], b = I25[+code[i + 1]]; for (var k = 0; k < 5; k++) seq += a[k] + b[k]; }
        seq += 'wnn';
        for (var j = 0; j < seq.length; j++) { var w = seq[j] === 'w' ? 3 : 1; if (j % 2 === 0) r += '<rect x="' + x + '" width="' + w + '" height="50"/>'; x += w; }
        return '<svg class="barcode" viewBox="0 0 ' + x + ' 50" preserveAspectRatio="none" role="img" aria-label="Código de barras do boleto">' + r + '</svg>'; };
      var pixFull = function (d) { var v = d.value.replace(',', '.');
        return '00020126580014BR.GOV.BCB.PIX0136demo-vyra-' + bl.dataset.contract.toLowerCase() + '-' + d.label.slice(-4) + d.mm + '52040000530398654' + pad(v.length, 2) + v + '5802BR5910VYRA FIBRA6008MARIALVA62070503***6304D3E1'; };
      var openInvoice = function (el, mode) {
        var d = el.dataset, month = MES[+d.mm - 1] + ' de ' + d.label.slice(-4), paid = d.st === 'paga', base = num(bl.dataset.base), val = num(d.value);
        var title = paid ? '2ª via de fatura' : mode === 'antecipar' ? 'Antecipação de fatura' : 'Fatura gerada';
        var state = paid ? 'Paga em ' + d.paid : d.st === 'atraso' ? 'Em atraso, ' + d.late + ' dias' : mode === 'antecipar' ? 'A vencer, dentro do prazo' : 'Dentro do prazo';
        var rows = [['Titular', bl.dataset.holder], ['Código do assinante', bl.dataset.contract], ['Plano', bl.dataset.plan], ['Vencimento', d.due]];
        if (d.st === 'atraso') { var multa = base * 0.02; rows.push(['Valor original', money(base)], ['Multa de 2%', money(multa)], ['Juros de ' + d.late + ' dias', money(val - base - multa)]); }
        var note = paid ? 'Esta fatura foi paga em ' + d.paid + '. Guarde esta 2ª via como comprovante.'
          : d.st === 'atraso' ? 'A fatura de ' + month.toLowerCase() + ' venceu em ' + d.due + '. O valor já inclui multa e juros. A baixa acontece em até 1 dia útil após o pagamento.'
          : mode === 'antecipar' ? 'Pagando agora, a fatura de ' + month.toLowerCase() + ' fica quitada antes do vencimento. O valor não muda.'
          : 'Pague pelo Pix ou pelo boleto até ' + d.due + ', sem acréscimo.';
        var bo = boleto(d), pay = paid
          ? '<div class="ibox ipaid"><h5>Pagamento confirmado</h5><p>Recebemos ' + money(val) + ' em ' + d.paid + '. Não há nada a pagar nesta fatura.</p></div>'
          : '<div class="ibox"><h5>Pix copia e cola</h5><code>' + pixFull(d) + '</code><button type="button" class="btn btn-primary sm" data-copy="Copiar código Pix">Copiar código Pix</button></div>' +
            '<div class="ibox"><h5>Boleto</h5>' + barSvg(bo.bar) + '<code class="iline">' + bo.line + '</code><button type="button" class="btn btn-dark sm" data-copy="Copiar linha digitável">Copiar linha digitável</button></div>';
        openModal('invoice', '<div class="itop"><span class="kicker">Área do cliente</span><h3>' + title + '</h3></div><div class="ibody">' +
          '<button type="button" class="iback" data-back>Voltar para as faturas' + tpl('bico-arrow') + '</button>' +
          '<article class="inv"><header class="ihead"><span class="ibrand">' + tpl('blogo') + '<span><b>Vyra Fibra</b><small>CNPJ ' + bl.dataset.cnpj + '</small></span></span>' +
          '<span class="istate is-' + d.st + '">' + $('.bi', el).innerHTML + state + '</span></header>' +
          '<div class="igrid"><div class="ileft"><span class="kicker">Fatura de internet</span><h4 class="imonth">' + month + '</h4><dl>' +
          rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>' +
          '<span class="ilbl">' + (paid ? 'Valor pago' : 'Valor a pagar') + '</span><div class="ival">' + money(val) + '</div><p class="inote">' + note + '</p></div>' +
          '<div class="iright">' + pay + '</div></div>' +
          '<footer class="ifoot"><button type="button" class="btn btn-line sm" data-print>Imprimir ou salvar em PDF</button>' + $('.btalk', bl).outerHTML + '</footer></article>' +
          '<p class="idemo">Fatura demonstrativa. Os códigos de pagamento não são válidos.</p></div>');
      };
      var onCopy = function (e, root) { var b = e.target.closest('.copy'); if (!b) return; var code = $('code', root).textContent;
        var done = function () { b.textContent = 'Código copiado'; setTimeout(function () { b.textContent = 'Copiar código Pix'; }, 2000); };
        if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done(); };
      out.addEventListener('click', function (e) {
        if (e.target.closest('[data-collapse]')) return collapse();
        if (e.target.closest('[data-expand]')) return info.mode ? openInvoice(info.el, info.mode) : openModal(info.cls, '<h3>' + info.title + '</h3>' + info.body);
        onCopy(e, out); });
      /* Lista completa do ano no modal (sem rolagem), com a ação de cada fatura */
      var billEls = $$('.bill', bl);
      var openList = function () {
        var firstOpen = billEls.filter(function (b) { return b.dataset.st === 'prazo'; })[0];
        var rows = billEls.map(function (b, i) { var st = b.dataset.st, act = st === 'paga' ? ['via', '2ª via'] : st === 'atraso' ? ['gerar', 'Pagar'] : b === firstOpen ? ['gerar', 'Gerar'] : ['antecipar', 'Antecipar'];
          return '<li><div class="bill is-' + st + '" aria-pressed="' + b.getAttribute('aria-pressed') + '">' + b.innerHTML +
            '<button type="button" class="mact mact-' + st + '" data-open-bill="' + i + '" data-mode="' + act[0] + '" aria-label="' + act[1] + ' de ' + b.dataset.label + '">' + act[1] + '</button></div></li>'; }).join('');
        openModal('list', '<div class="mhead"><h3>' + $('.bh h3', bl).textContent + '</h3><span>' + $('.bh span', bl).textContent + '</span></div>' +
          '<div class="mlegend">' + tpl('blegend') + '</div><ul class="mlist">' + rows + '</ul>'); };
      var allBtn = $('[data-bills-expand]', bl);
      if (allBtn) allBtn.addEventListener('click', openList);
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal || e.target.closest('.mclose')) return closeModal();
          var ob = e.target.closest('[data-open-bill]'); if (ob) return openInvoice(billEls[+ob.dataset.openBill], ob.dataset.mode);
          if (e.target.closest('[data-back]')) return openList();
          if (e.target.closest('[data-print]')) return window.print();
          var cp = e.target.closest('[data-copy]');
          if (cp) { var txt = cp.parentNode.querySelector('code').textContent, lbl = cp.dataset.copy, ok = function () { cp.textContent = 'Copiado'; setTimeout(function () { cp.textContent = lbl; }, 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else ok(); return; }
          onCopy(e, modal); });
        addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
      }
    }
  }

  /* Assinatura em etapas */
  var wz = $('.wizard form');
  if (wz) { var panels = $$('.wpanel', wz), marks = $$('.wsteps div', wz), cur2 = 0;
    var go2 = function (i) { cur2 = i; panels.forEach(function (p, k) { p.classList.toggle('cur', k === i); }); marks.forEach(function (m, k) { m.classList.toggle('done', k < i); m.classList.toggle('cur', k === i); }); scrollTo({ top: $('.wizard').getBoundingClientRect().top + scrollY - 120, behavior: reduce ? 'auto' : 'smooth' }); };
    var valid = function (p) { var ok = true; $$('input, select', p).forEach(function (i) { if (ok && !i.checkValidity()) { i.reportValidity(); ok = false; } }); return ok; };
    $$('[data-next]', wz).forEach(function (b) { b.addEventListener('click', function () { if (valid(panels[cur2])) go2(cur2 + 1); }); });
    $$('[data-prev]', wz).forEach(function (b) { b.addEventListener('click', function () { go2(cur2 - 1); }); });
    wz.addEventListener('submit', function (e) { e.preventDefault(); if (!valid(panels[cur2])) return; panels.forEach(function (p) { p.classList.remove('cur'); }); marks.forEach(function (m) { m.classList.add('done'); m.classList.remove('cur'); }); $('.done-box').classList.add('on'); });
    var sum = $('.wsum'); var sync = function () { var r = $('input[name=plano]:checked', wz); if (!r) return; $('[data-s=name]', sum).textContent = r.dataset.name; $('[data-s=speed]', sum).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>'; $('[data-s=price]', sum).textContent = 'R$ ' + r.dataset.price; $('[data-s=logos]', sum).innerHTML = r.dataset.logos; };
    var h = location.hash.slice(1), pre = h && $('input[name=plano][value="' + h + '"]', wz); if (pre) pre.checked = true;
    var m = h && h.match(/^cep-(\d{8})$/), ci = document.getElementById('a-cep'); if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
    $$('input[name=plano]', wz).forEach(function (r) { r.addEventListener('change', sync); }); sync(); }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
