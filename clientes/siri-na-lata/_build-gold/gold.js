/* Siri na Lata, modelo Gold "Maré". Sem dependências.
   - rolagem suave no mouse (a página desliza, não pula)
   - pilha de seções: a próxima sobe por cima, a anterior recua e escurece
   - manifesto que acende palavra por palavra, ilustrações que se desenham
   - cardápio em livro: descer vira a página, subir a página volta
   - galeria horizontal da casa com o sol se pondo
   - topo que some ao descer e volta ao subir, "aberto agora" no horário de Brasília */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var vh = innerHeight, vw = root.clientWidth, sy = scrollY;

  /* ---------- menu do celular ---------- */
  var hdr = $('[data-hdr]'), mbtn = $('[data-menu]');
  function setMenu(o) {
    root.classList.toggle('menu-open', o); hdr.classList.toggle('open', o);
    mbtn.setAttribute('aria-expanded', o); mbtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
  }
  mbtn.addEventListener('click', function () { setMenu(!hdr.classList.contains('open')); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- rolagem suave ---------- */
  var S = { cur: sy, tgt: sy, run: false }, smooth = fine && !reduce;
  var maxY = function () { return root.scrollHeight - innerHeight; };
  function glide() {
    S.cur += (S.tgt - S.cur) * 0.085;
    if (Math.abs(S.tgt - S.cur) < 0.5) { S.cur = S.tgt; S.run = false; }
    scrollTo(0, S.cur);
    if (S.run) requestAnimationFrame(glide);
  }
  function go(y) {
    y = clamp(Math.round(y), 0, maxY());
    if (reduce) { scrollTo(0, y); return; }
    if (smooth) { if (!S.run) { S.cur = scrollY; S.run = true; requestAnimationFrame(glide); } S.tgt = y; }
    else scrollTo({ top: y, behavior: 'smooth' });
  }
  if (smooth) {
    addEventListener('wheel', function (e) {
      if (e.ctrlKey || root.classList.contains('menu-open')) return;
      e.preventDefault();
      var dy = e.deltaY * (e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? innerHeight : 1);
      if (!S.run) { S.cur = S.tgt = scrollY; }
      S.tgt = clamp(S.tgt + dy, 0, maxY());
      if (!S.run) { S.run = true; requestAnimationFrame(glide); }
    }, { passive: false });
  }
  addEventListener('scroll', function () { if (!S.run) S.cur = S.tgt = scrollY; }, { passive: true });

  var docTop = function (el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1), t = id && d.getElementById(id);
    if (!t) return;
    e.preventDefault(); setMenu(false);
    go(id === 'topo' ? 0 : docTop(t));
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* ---------- pilha de seções ---------- */
  var panels = $$('[data-panel]'), P = [];

  /* ---------- cardápio em livro ---------- */
  var bsec = $('[data-book-sec]'), book = bsec && $('[data-book]', bsec), stage = book && $('.book-stage', book);
  var pages = book ? $$('.book-src .pg', book) : [], leaves = [], mode = '', flips = 0, bt = 0, btT = 0;
  var caps = bsec ? $$('[data-cap]', bsec) : [], capCur = 0;
  var duoMq = matchMedia('(min-width: 860px)');
  function holder(cls, pg) { var f = d.createElement('div'); f.className = cls; if (pg) f.appendChild(pg); return f; }
  function addLeaf(a, b) {
    var l = d.createElement('div'); l.className = 'leaf';
    var back = holder('face back' + (b ? '' : ' blank'), b);
    if (!b) back.setAttribute('aria-hidden', 'true');
    l.appendChild(holder('face front', a)); l.appendChild(back);
    stage.appendChild(l); leaves.push(l);
  }
  function layoutBook() {
    if (!book || pages.length !== 8) return;
    var m = duoMq.matches ? 'duo' : 'solo';
    if (m !== mode) {
      mode = m; stage.textContent = ''; leaves = [];
      book.className = 'book ' + m;
      if (m === 'duo') {
        stage.appendChild(holder('base l', pages[0]));
        for (var k = 0; k < 3; k++) addLeaf(pages[2 * k + 1], pages[2 * k + 2]);
      } else {
        for (var j = 0; j < 7; j++) addLeaf(pages[j], null);
      }
      stage.appendChild(holder('base r', pages[7]));
      flips = leaves.length; bt = btT = clamp(Math.round(bt), 0, flips); paintBook(true);
    }
    bsec.style.height = Math.round(vh * (1.2 + flips * (m === 'duo' ? 0.95 : 0.62))) + 'px';
  }
  function paintBook(force) {
    for (var k = 0; k < leaves.length; k++) {
      var l = leaves[k], u = clamp(bt - k, 0, 1), v = clamp((u - 0.08) / 0.84, 0, 1);
      v = v * v * (3 - 2 * v);
      var a = Math.round(v * 1800) / 10;
      if (!force && l._a === a) continue;
      l._a = a;
      l.style.transform = 'rotateY(' + (-a) + 'deg)';
      l.style.zIndex = a > 0 && a < 180 ? 60 : a >= 180 ? 10 + k : 40 - k;
      l.style.setProperty('--s', (Math.sin(a * Math.PI / 180) * 0.9).toFixed(3));
      l.style.opacity = mode === 'solo' && a > 96 ? clamp(1 - (a - 96) / 44, 0, 1) : '';
      l.style.visibility = mode === 'solo' && a >= 140 ? 'hidden' : '';
    }
    var vis = Math.round(bt), c = mode === 'duo' ? vis : Math.floor(vis / 2);
    c = clamp(c, 0, caps.length - 1);
    if (c !== capCur) { capCur = c; caps.forEach(function (b, i) { b.setAttribute('aria-current', i === c ? 'true' : 'false'); }); }
  }
  caps.forEach(function (b, c) {
    b.addEventListener('click', function () {
      var o = P[panels.indexOf(bsec)]; if (!o || !flips) return;
      var t = Math.min(mode === 'duo' ? c : 2 * c + 1, flips);
      var p = (t / flips + 0.04) / 1.08;
      go(o.top + p * (o.h - vh) + 2);
    });
  });
  /* inclinação leve do livro seguindo o mouse */
  if (fine && !reduce && book) {
    bsec.addEventListener('pointermove', function (e) {
      var r = book.getBoundingClientRect();
      stage.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2));
      stage.style.setProperty('--ty', ((0.5 - (e.clientY - r.top) / r.height) * 4).toFixed(2));
    });
    bsec.addEventListener('pointerleave', function () { stage.style.setProperty('--tx', 0); stage.style.setProperty('--ty', 0); });
  }

  /* ---------- galeria horizontal ---------- */
  var gal = $('[data-gal]'), track = gal && $('.gal-track', gal), hint = gal && $('.gal-hint', gal), galW = 0;
  function layoutGal() {
    if (!gal) return;
    track.style.transform = '';
    galW = Math.max(0, track.scrollWidth - vw);
    gal.style.height = Math.round(vh + galW * 1.1 + vh * 0.25) + 'px';
  }

  /* ---------- manifesto e floats ---------- */
  var mani = $('[data-mani]'), maniT = mani && $('.mani-t', mani), nW = maniT ? $$('span', maniT).length : 0;
  var floats = mani ? $$('.fl', mani) : [], depth = [0.18, -0.12, 0.26, -0.2];
  var draws = $$('[data-draw]');

  function measure() {
    vh = innerHeight; vw = root.clientWidth;
    layoutBook(); layoutGal();
    /* posições naturais (sem o efeito de presa): a pilha começa no topo do main */
    var y = panels.length ? docTop(panels[0].parentNode) : 0;
    P = panels.map(function (p) {
      var h = p.offsetHeight, o = { el: p, h: h, top: y };
      y += h;
      p.style.top = Math.min(0, vh - h) + 'px';
      p.style.transformOrigin = '50% ' + Math.round(Math.max(h - vh / 2, h / 2)) + 'px';
      return o;
    });
    need = true;
  }

  /* ---------- rodapé: nome que enche de cor (o mapa é imagem estática do OpenStreetMap, sem JS) ---------- */
  var ftr = $('[data-ftr]');

  /* ---------- quadro a quadro ---------- */
  var need = true, lastY = -1, hidden = false;
  var setV = function (el, k, v) { if (el['_' + k] !== v) { el['_' + k] = v; el.style.setProperty('--' + k, v); } };
  function frame() {
    sy = scrollY;
    var moved = sy !== lastY;
    if (moved || need) {
      var cur = P[0];
      for (var i = 0; i < P.length; i++) {
        var o = P[i], n = P[i + 1];
        var e = i ? clamp(1 - (o.top - sy) / vh, 0, 1) : 1;
        var c = n ? clamp(1 - (n.top - sy) / vh, 0, 1) : 0;
        if (reduce) { e = 1; c = c >= 1 ? 1 : 0; }
        setV(o.el, 'e', e.toFixed(3)); setV(o.el, 'c', c.toFixed(3));
        o.el.classList.toggle('gone', c >= 1);
        if (o.top - sy <= 40) cur = o;
      }
      /* topo: cor conforme a seção por baixo, some ao descer e volta ao subir */
      if (cur) hdr.setAttribute('data-tone', cur.el.getAttribute('data-tone'));
      hdr.classList.toggle('solid', sy > 30);
      if (sy < 140 || root.classList.contains('menu-open')) { if (hidden) { hidden = false; hdr.classList.remove('hide'); } }
      else if (sy > lastY + 3 && !hidden) { hidden = true; hdr.classList.add('hide'); }
      else if (sy < lastY - 3 && hidden) { hidden = false; hdr.classList.remove('hide'); }

      /* manifesto */
      if (mani) {
        var om = P[panels.indexOf(mani)];
        if (om && sy > om.top - vh && sy < om.top + om.h) {
          var pm = clamp((sy - om.top + vh * 0.3) / (om.h - vh * 0.6), 0, 1);
          setV(mani, 'k', (pm * (nW + 6) - 1).toFixed(2));
          if (!reduce) floats.forEach(function (f, j) { f.style.setProperty('--y', ((0.5 - pm) * depth[j] * vh * 1.6).toFixed(1) + 'px'); });
        }
      }
      /* ilustrações que se desenham */
      draws.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        setV(el, 'd', reduce ? '1' : clamp((vh - r.top) / (vh * 0.85), 0, 1).toFixed(3));
      });
      /* galeria */
      if (gal) {
        var og = P[panels.indexOf(gal)];
        if (og && sy > og.top - vh && sy < og.top + og.h) {
          var pg = clamp((sy - og.top) / (og.h - vh), 0, 1), pt = clamp(pg * 1.1, 0, 1);
          track.style.transform = 'translate3d(' + (-galW * pt).toFixed(1) + 'px,0,0)';
          setV(gal, 'p', pg.toFixed(3));
          if (hint) hint.classList.toggle('off', pg > 0.12);
        }
      }
      /* livro */
      if (bsec && flips) {
        var ob = P[panels.indexOf(bsec)];
        if (ob) btT = flips * clamp(((sy - ob.top) / (ob.h - vh)) * 1.08 - 0.04, 0, 1);
      }
      /* nome do rodapé: enche de cor conforme a rolagem do site inteiro */
      if (ftr) { var mx = maxY(); setV(ftr, 'fp', reduce ? '1' : (mx > 0 ? clamp(sy / mx, 0, 1) : 1).toFixed(4)); }
      lastY = sy; need = false;
    }
    if (bsec && flips && Math.abs(btT - bt) > 0.0005) {
      bt += (btT - bt) * (reduce ? 1 : 0.12);
      if (Math.abs(btT - bt) < 0.001) bt = btT;
      paintBook(false);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- entrada ao rolar ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- medir e começar ---------- */
  var rw = vw, rh = vh, rt;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var w = root.clientWidth, h = innerHeight;
      if (w !== rw || Math.abs(h - rh) > 120) { rw = w; rh = h; measure(); }
    }, 120);
  });
  measure();
  addEventListener('load', measure);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
  /* abriu com #ancora: vai para a posição certa da pilha */
  if (location.hash) { var t0 = d.getElementById(location.hash.slice(1)); if (t0) addEventListener('load', function () { scrollTo(0, docTop(t0)); }); }
  requestAnimationFrame(frame);

  /* ---------- aberto agora (horário de Brasília) ---------- */
  var H = window.SNL_HORARIOS || [], NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  try {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var g = function (t) { return (p.find(function (x) { return x.type === t; }) || {}).value; };
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min = (+g('hour') % 24) * 60 + (+g('minute'));
    var m = function (s) { var a = s.split(':'); return a[0] * 60 + (+a[1]); };
    var fmt = function (s) { return s.replace(':00', 'h').replace(':', 'h'); };
    var hoje = H.filter(function (h) { return h.d.indexOf(dia) > -1; })[0], txt;
    $$('tr[data-dias]').forEach(function (tr) { if (tr.getAttribute('data-dias').split(',').indexOf(String(dia)) > -1) tr.classList.add('hoje'); });
    if (hoje && hoje.a && min >= m(hoje.a) && min < m(hoje.f)) txt = 'Aberto agora, até as ' + fmt(hoje.f);
    else {
      for (var i = 0; i < 8; i++) {
        var dd = (dia + i) % 7, h = H.filter(function (x) { return x.d.indexOf(dd) > -1; })[0];
        if (h && h.a && (i > 0 || min < m(h.a))) { txt = 'Fechado agora. Abrimos ' + (i === 0 ? 'hoje' : i === 1 ? 'amanhã' : NOMES[dd]) + ' às ' + fmt(h.a); break; }
      }
    }
    var el = $('[data-agora]');
    if (el && txt) { var s = d.createElement('span'); s.className = 'agora'; s.textContent = txt; el.insertBefore(s, el.firstChild); }
    var ev = $('[data-agora-vis]'); if (ev && txt) ev.textContent = txt;
  } catch (err) { /* sem Intl: fica só a tabela */ }
})();
