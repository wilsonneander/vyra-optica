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
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Formulários: mostra a confirmação. Integre aqui com seu backend, e-mail ou WhatsApp.
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent');
      var ok = f.querySelector('.form-ok'); if (ok) ok.focus();
      f.querySelectorAll('input:not([type=radio]), textarea').forEach(function (i) { i.value = ''; });
    });
  });

  // Máscara simples de CEP e telefone
  document.querySelectorAll('input[data-mask=cep]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; });
  });
  document.querySelectorAll('input[data-mask=tel]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\D/g, '').slice(0, 11);
      i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; });
  });

  // Consulta de cobertura (exemplo): leva para Assine já com o CEP preenchido
  var cep = document.getElementById('cep-form');
  if (cep) cep.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = cep.querySelector('input').value.replace(/\D/g, '');
    var out = cep.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
    out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
    setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
  });

  // Assine já: pré-seleciona o plano (#essencial, #conecta, #ultra) e o CEP (#cep-00000000)
  var h = location.hash.slice(1);
  if (h) {
    var radio = document.querySelector('input[name=plano][value="' + h + '"]');
    if (radio) radio.checked = true;
    var m = h.match(/^cep-(\d{8})$/), ci = document.getElementById('a-cep');
    if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
