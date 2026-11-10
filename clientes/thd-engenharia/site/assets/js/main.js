/* THD Engenharia · gerado por _build/build.js */
(function () {
  var header = document.querySelector('.header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');

  // sombra no cabeçalho ao rolar
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // menu mobile
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // entrada suave ao rolar
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // serviços: destaca a categoria visível no menu de categorias
  var svcNav = document.querySelector('.svc-nav');
  if (svcNav && 'IntersectionObserver' in window) {
    var links = svcNav.querySelectorAll('a');
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) so.observe(s); });
  }

  // formulário de contato: valida e abre a mensagem pronta no WhatsApp
  var form = document.getElementById('form-contato');
  if (form) {
    var status = form.querySelector('.form-status');
    var tel = form.elements.telefone;
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      tel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
        : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        : d.length > 2 ? d.replace(/(\d{2})(\d+)/, '($1) $2') : d;
    });
    form.addEventListener('input', function (e) { e.target.classList && e.target.classList.remove('invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      if (!f.nome.value.trim()) bad.push(f.nome);
      if (tel.value.replace(/\D/g, '').length < 10) bad.push(tel);
      if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) bad.push(f.email);
      if (!f.mensagem.value.trim()) bad.push(f.mensagem);
      bad.forEach(function (el) { el.classList.add('invalid'); });
      if (bad.length) {
        status.className = 'form-status err';
        status.textContent = 'Confira os campos destacados.';
        bad[0].focus();
        return;
      }
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

  // registra cliques no WhatsApp no Analytics
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a && window.gtag) gtag('event', 'whatsapp_click', { link_text: (a.textContent || '').trim().slice(0, 60) });
  });
})();
