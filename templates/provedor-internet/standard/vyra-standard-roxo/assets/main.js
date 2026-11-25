// Vyra Standard Roxo: comportamento do site
(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = document.body.dataset.wa;

  /* ---------- toda página abre no topo (ou na seção do link) ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function topo() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  topo();
  addEventListener('load', function () { topo(); setTimeout(topo, 60); });

  /* ---------- menu do celular ---------- */
  var mb = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  function fechaMenu() { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Abrir menu'); mb.innerHTML = mb.dataset.abre; }
  if (mb && nav) {
    mb.dataset.abre = mb.innerHTML;
    mb.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      mb.setAttribute('aria-expanded', o);
      mb.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
      mb.innerHTML = o ? mb.dataset.fecha : mb.dataset.abre;
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) fechaMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { fechaMenu(); mb.focus(); } });
  }

  /* ---------- carrossel de abertura: setas, pontos, arraste e pausa ---------- */
  var vit = document.querySelector('.vitrine');
  if (vit) {
    var sl = vit.querySelectorAll('.slide'), pt = vit.querySelectorAll('.pontos button'), cur = 0, t;
    var vai = function (i) {
      cur = (i + sl.length) % sl.length;
      sl.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); s.inert = k !== cur; });
      pt.forEach(function (d, k) { d.setAttribute('aria-current', k === cur); });
      clearTimeout(t); if (!reduz && !vit.classList.contains('parado')) t = setTimeout(function () { vai(cur + 1); }, 6500);
    };
    vit.querySelector('.ant').addEventListener('click', function () { vai(cur - 1); });
    vit.querySelector('.prox').addEventListener('click', function () { vai(cur + 1); });
    pt.forEach(function (d, k) { d.addEventListener('click', function () { vai(k); }); });
    var para = function () { vit.classList.add('parado'); clearTimeout(t); };
    var segue = function () { vit.classList.remove('parado'); vai(cur); };
    vit.addEventListener('mouseenter', para); vit.addEventListener('mouseleave', segue);
    vit.addEventListener('focusin', para); vit.addEventListener('focusout', function (e) { if (!vit.contains(e.relatedTarget)) segue(); });
    var x0 = null;
    vit.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    vit.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) vai(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    vit.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') vai(cur - 1); if (e.key === 'ArrowRight') vai(cur + 1); });
    vai(0);
  }

  /* ---------- abas Residencial / Empresas ---------- */
  document.querySelectorAll('[role=tablist]').forEach(function (tl) {
    var abas = tl.querySelectorAll('[role=tab]');
    abas.forEach(function (a) {
      a.addEventListener('click', function () {
        abas.forEach(function (o) { o.setAttribute('aria-selected', o === a); o.tabIndex = o === a ? 0 : -1; document.getElementById(o.getAttribute('aria-controls')).hidden = o !== a; });
      });
    });
  });

  /* ---------- filtros (serviços por segmento e galeria por categoria) ---------- */
  document.querySelectorAll('[data-filtro]').forEach(function (grupo) {
    var alvo = document.getElementById(grupo.dataset.filtro), bts = grupo.querySelectorAll('button');
    bts.forEach(function (b) {
      b.addEventListener('click', function () {
        bts.forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        alvo.querySelectorAll('[data-cat]').forEach(function (it) { it.hidden = b.dataset.v !== 'todas' && it.dataset.cat !== b.dataset.v; });
      });
    });
  });

  /* ---------- foto ampliada da galeria ---------- */
  var zoom = document.getElementById('zoom');
  if (zoom) {
    document.querySelectorAll('.galeria button').forEach(function (b) {
      b.addEventListener('click', function () {
        var im = b.querySelector('img');
        zoom.querySelector('img').src = im.src; zoom.querySelector('img').alt = im.alt;
        zoom.querySelector('p').textContent = im.alt;
        zoom.showModal();
      });
    });
    zoom.addEventListener('click', function (e) { if (e.target === zoom || e.target.closest('[data-fecha]')) zoom.close(); });
  }

  /* ---------- janelas legais ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-doc]');
    if (b) { e.preventDefault(); var d = document.getElementById('doc-' + b.dataset.doc); if (d) d.showModal(); return; }
    var f = e.target.closest('dialog.doc [data-fecha]');
    if (f) f.closest('dialog').close();
  });
  document.querySelectorAll('dialog.doc').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });

  /* ---------- aviso de cookies ---------- */
  var ck = document.getElementById('cookies'), CHAVE = 'vyra-roxo-cookies';
  var salvo = null; try { salvo = localStorage.getItem(CHAVE); } catch (err) {}
  if (ck && !salvo) ck.hidden = false;
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ck]');
    if (b) { try { localStorage.setItem(CHAVE, JSON.stringify({ escolha: b.dataset.ck, data: new Date().toISOString() })); } catch (err) {} ck.hidden = true; return; }
    if (e.target.closest('[data-cookies]')) { ck.hidden = false; iguala(); ck.querySelector('button').focus(); }
  });

  /* ---------- componentes do mesmo grupo com a mesma largura ---------- */
  function iguala() {
    document.querySelectorAll('[data-iguais]').forEach(function (g) {
      g.style.removeProperty('--larg');
      var m = 0; Array.prototype.forEach.call(g.children, function (c) { c.style.width = 'auto'; m = Math.max(m, c.scrollWidth); c.style.width = ''; });
      g.style.setProperty('--larg', m + 'px');
    });
  }
  iguala(); if (document.fonts) document.fonts.ready.then(iguala); addEventListener('resize', iguala);

  /* ---------- máscaras ---------- */
  document.querySelectorAll('input[data-mask=cep]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; });
  });
  document.querySelectorAll('input[data-mask=tel]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
      i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; });
  });
  document.querySelectorAll('input[data-mask=cpf]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
      i.value = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); });
  });

  /* ---------- consulta de cobertura (exemplo): leva para Assine já com o CEP ---------- */
  document.querySelectorAll('form.cep').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = f.querySelector('input').value.replace(/\D/g, ''), out = f.parentNode.querySelector('.cep-res');
      if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
      out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
      setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
    });
  });

  /* ---------- agendamento: serviço, plano, técnico, data e horário ---------- */
  var ag = document.getElementById('agenda');
  if (ag) {
    var serv = ag.querySelector('#a-servico'), fsPlano = ag.querySelector('#fs-plano'), data = ag.querySelector('#a-data');
    var hoje = new Date(); hoje.setDate(hoje.getDate() + 1);
    data.min = hoje.toISOString().slice(0, 10);
    var mostraPlano = function () {
      var inst = serv.value === 'Instalação nova';
      fsPlano.hidden = !inst;
      fsPlano.querySelectorAll('input').forEach(function (i) { i.required = inst; });
    };
    serv.addEventListener('change', mostraPlano);
    data.addEventListener('change', function () {
      var d = new Date(data.value + 'T12:00:00');
      data.setCustomValidity(d.getDay() === 0 ? 'Aos domingos não fazemos visitas. Escolha outro dia.' : '');
    });
    // #familia, #ultra... escolhe o plano; #cep-00000000 preenche o CEP; #visita escolhe o serviço
    var h = location.hash.slice(1);
    if (h) {
      var r = ag.querySelector('input[name=plano][value="' + h + '"]'); if (r) r.checked = true;
      var m = h.match(/^cep-(\d{8})$/); if (m) ag.querySelector('#a-cep').value = m[1].slice(0, 5) + '-' + m[1].slice(5);
      var o = ag.querySelector('#a-servico option[data-h="' + h + '"]'); if (o) serv.value = o.value;
    }
    mostraPlano();
  }

  /* ---------- formulários: validam, pedem o aceite da LGPD e fecham no WhatsApp ---------- */
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var linhas = [f.dataset.msg];
      f.querySelectorAll('[data-rot]').forEach(function (c) {
        if (c.closest('[hidden]')) return;
        var v = c.type === 'radio' ? (c.checked ? c.value : '') : c.value;
        if (c.type === 'date' && v) v = v.split('-').reverse().join('/');
        if (v) linhas.push(c.dataset.rot + ': ' + v);
      });
      f.classList.add('enviado');
      var ok = f.querySelector('.form-ok'); if (ok) ok.focus();
      // Integre aqui com o seu sistema. Na demonstração, o pedido segue pelo WhatsApp.
      if (WA) window.open(WA + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  });

  /* ---------- entrada suave ao rolar (só o que ainda está abaixo da tela) ---------- */
  if (!reduz && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 90) + 'ms'; io.observe(el); }
    });
  }

  var y = document.getElementById('ano'); if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#6A1794' : '#110A16';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('vyra-roxo-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
