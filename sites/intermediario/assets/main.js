// Vyra · modelo Intermediário
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Topo muda ao rolar
  var top = document.querySelector('.topbar');
  function onScroll() { top.classList.toggle('scrolled', window.scrollY > 20); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open ? btn.dataset.close : btn.dataset.open;
  });

  // Entrada ao rolar: só esconde o que ainda está abaixo da tela
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pre');
        el.style.transitionDelay = ((el.dataset.d || 0) * 90) + 'ms';
        io.observe(el);
      }
    });
  }

  // Contadores
  function count(el) {
    var end = parseFloat(el.dataset.count), dur = 1400, t0 = null, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } }); });
    counters.forEach(function (c) { co.observe(c); });
  } else counters.forEach(count);

  // Medidor do hero
  var m = document.querySelector('.meter i'); if (m) setTimeout(function () { m.style.width = m.dataset.w; }, 300);

  // Abas Casa / Empresa
  document.querySelectorAll('[role=tablist]').forEach(function (tl) {
    var tabs = tl.querySelectorAll('[role=tab]');
    tabs.forEach(function (t) { t.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== t; });
    }); });
  });

  // FAQ (acordeão)
  document.querySelectorAll('.acc-item button').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.acc-item'), open = !item.classList.contains('open');
      item.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
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

  // Formulários (integre aqui com seu backend, e-mail ou WhatsApp)
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent'); var ok = f.querySelector('.form-ok'); ok && ok.focus();
    });
  });

  // Assine já: plano pela URL (#conecta) e resumo ao lado
  var radios = document.querySelectorAll('input[name=plano]');
  function sync() {
    var r = document.querySelector('input[name=plano]:checked'); if (!r) return;
    var s = document.querySelector('.summary'); if (!s) return;
    s.querySelector('[data-s=name]').textContent = r.dataset.name;
    s.querySelector('[data-s=speed]').innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>';
    s.querySelector('[data-s=price]').textContent = 'R$ ' + r.dataset.price;
  }
  var h = location.hash.slice(1), pre = h && document.querySelector('input[name=plano][value="' + h + '"]');
  if (pre) pre.checked = true;
  radios.forEach(function (r) { r.addEventListener('change', sync); }); sync();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
