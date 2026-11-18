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

// Vyra · modelo Básico
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });

  // Carrossel de ofertas
  var hero = document.querySelector('.hero');
  if (hero && hero.querySelector('.prev')) {
    var slides = hero.querySelectorAll('.slide'), dots = hero.querySelectorAll('.dots button'), cur = 0, timer;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var go = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === cur); });
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, 6500);
    };
    hero.querySelector('.prev').addEventListener('click', function () { go(cur - 1); });
    hero.querySelector('.next').addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    hero.addEventListener('mouseenter', function () { clearTimeout(timer); });
    hero.addEventListener('mouseleave', function () { go(cur); });
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  // Abas Residencial / Empresas
  document.querySelectorAll('[role=tablist]').forEach(function (tl) {
    var tabs = tl.querySelectorAll('[role=tab]');
    tabs.forEach(function (t) { t.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== t; });
    }); });
  });

  // Formulários: mostra a confirmação. Integre aqui com seu backend, e-mail ou WhatsApp.
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent'); var ok = f.querySelector('.form-ok'); if (ok) ok.focus();
    });
  });

  // Máscaras
  document.querySelectorAll('input[data-mask=cep]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; });
  });
  document.querySelectorAll('input[data-mask=tel]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
      i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; });
  });

  // Consulta de cobertura (exemplo): leva para Assine já com o CEP
  document.querySelectorAll('form.cep').forEach(function (cep) {
    cep.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = cep.querySelector('input').value.replace(/\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
      if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
      out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
      setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
    });
  });

  // Assine já: pré-seleciona o plano (#start, #familia, #ultra) e o CEP (#cep-00000000)
  var h = location.hash.slice(1);
  if (h) {
    var radio = document.querySelector('input[name=plano][value="' + h + '"]'); if (radio) radio.checked = true;
    var m = h.match(/^cep-(\d{8})$/), ci = document.getElementById('a-cep');
    if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
  }
  // Entrada suave ao rolar (só esconde o que ainda está abaixo da tela)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 90) + 'ms'; io.observe(el); }
    });
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
