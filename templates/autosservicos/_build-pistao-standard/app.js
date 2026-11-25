// Interação do modelo Bronze da Pistão (sem bibliotecas).
(() => {
  const D = /*DADOS*/;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  document.documentElement.classList.add('js');

  // ano do rodapé
  $$('[data-ano]').forEach((e) => { e.textContent = new Date().getFullYear(); });

  // aberto agora / horário de hoje
  const agora = new Date(), dia = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes();
  const faixa = D.abertura[dia];
  const status = $('[data-status]');
  if (status && faixa && min >= faixa[0] && min < faixa[1]) {
    const f = faixa[1], h = Math.floor(f / 60), m = f % 60;
    status.innerHTML = `<b>Aberto agora</b>, até ${h}h${m ? String(m).padStart(2, '0') : ''}`;
    status.classList.add('aberto');
  }
  const linhas = $$('.horas tr');
  const idx = dia === 0 ? 2 : dia === 6 ? 1 : 0;
  if (linhas[idx]) linhas[idx].classList.add('hoje');

  // topo: esconde a barrinha de cima ao rolar
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('rolou', scrollY > 40);
  addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

  // menu do celular
  const burger = $('.burger'), menu = $('#menu');
  const fecharMenu = () => { menu.classList.remove('aberto'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const abre = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', abre); burger.setAttribute('aria-expanded', String(abre));
  });
  // submenu Serviços: abre no hover (mouse) e no clique (toque e teclado)
  const sub = $('.tem-sub'), subBtn = $('.sub-btn');
  const abrirSub = (on) => { sub.classList.toggle('aberto', on); subBtn.setAttribute('aria-expanded', String(on)); };
  const temMouse = matchMedia('(hover: hover) and (min-width: 1041px)');
  sub.addEventListener('mouseenter', () => { if (temMouse.matches) abrirSub(true); });
  sub.addEventListener('mouseleave', () => { if (temMouse.matches) abrirSub(false); });
  subBtn.addEventListener('click', () => abrirSub(!sub.classList.contains('aberto')));
  document.addEventListener('click', (e) => { if (temMouse.matches && !sub.contains(e.target)) abrirSub(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sub.classList.contains('aberto')) { abrirSub(false); subBtn.focus(); } });
  $$('#menu a').forEach((a) => a.addEventListener('click', () => { fecharMenu(); abrirSub(false); }));

  // grupos com a mesma largura (regra das diretrizes)
  const igualar = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const filhos = [...g.children];
    filhos.forEach((f) => { f.style.width = 'auto'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    g.style.setProperty('--larg', Math.ceil(maior) + 'px');
  });
  igualar();
  if (document.fonts) document.fonts.ready.then(igualar);
  addEventListener('resize', igualar);

  // serviços em abas; links da nav levam direto ao serviço
  const abas = $$('.aba');
  const ativar = (id, foco) => {
    const aba = abas.find((a) => a.dataset.aba === id);
    if (!aba) return false;
    abas.forEach((a) => { const on = a === aba; a.classList.toggle('ativa', on); a.setAttribute('aria-selected', String(on)); });
    $$('.painel').forEach((p) => p.classList.toggle('ativo', p.id === 'painel-' + id));
    $$('.sub a').forEach((a) => a.classList.toggle('atual', a.dataset.ir === id));
    subBtn.classList.toggle('atual', $$('.sub a').some((a) => a.dataset.ir === id));
    const lista = aba.closest('.abas');
    if (lista.scrollWidth > lista.clientWidth) lista.scrollTo({ left: aba.parentElement.offsetLeft - (lista.clientWidth - aba.offsetWidth) / 2, behavior: calmo ? 'auto' : 'smooth' });
    if (foco) { aba.classList.remove('piscar'); void aba.offsetWidth; aba.classList.add('piscar'); }
    return true;
  };
  abas.forEach((a) => a.addEventListener('click', () => ativar(a.dataset.aba)));
  $('.abas').addEventListener('keydown', (e) => {
    const i = abas.indexOf(document.activeElement);
    if (i < 0 || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const n = abas[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + abas.length) % abas.length];
    n.focus(); ativar(n.dataset.aba);
  });
  const irPara = (id) => {
    if (!ativar(id, true)) return;
    const alvo = $('#servicos .oficina-board');
    const y = alvo.getBoundingClientRect().top + scrollY - (innerWidth > 1040 ? 104 : 90);
    scrollTo({ top: y, behavior: calmo ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
  };
  $$('[data-ir]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); irPara(a.dataset.ir); }));
  if (location.hash && abas.some((a) => a.dataset.aba === location.hash.slice(1))) setTimeout(() => irPara(location.hash.slice(1)), 200);

  // aparecer ao rolar, contadores e medidor do alinhamento
  const contar = (el) => {
    const fim = parseFloat(el.dataset.conta), dec = String(fim).includes('.') ? 1 : 0, t0 = performance.now(), dur = 1600;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = fim * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec).replace('.', ',');
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const medir = (m) => {
    $$('.roda', m).forEach((r) => { r.style.transform = `rotate(${r.dataset.de * 4}deg)`; });
    setTimeout(() => {
      $$('.roda', m).forEach((r) => { r.style.transform = 'rotate(0deg)'; });
      $$('[data-grau]', m).forEach((g) => {
        const de = parseFloat(m.querySelector(`[data-roda="${g.dataset.grau}"]`).dataset.de), t0 = performance.now();
        const passo = (t) => {
          const k = Math.min(1, (t - t0) / 2400), v = de * (1 - (1 - Math.pow(1 - k, 3)));
          g.textContent = (Math.abs(v) < 0.05 ? '0,0' : v.toFixed(1).replace('.', ',')) + '°';
          if (k < 1) requestAnimationFrame(passo); else m.classList.add('ok');
        };
        requestAnimationFrame(passo);
      });
    }, 900);
  };
  const medidor = $('[data-medidor]');
  if (medidor) $$('.roda', medidor).forEach((r) => { r.style.transform = `rotate(${r.dataset.de * 4}deg)`; });
  if ('IntersectionObserver' in window && !calmo) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains('revela')) el.classList.add('visto');
      if (el.dataset.conta) contar(el);
      if (el.hasAttribute('data-medidor')) medir(el);
      io.unobserve(el);
    }), { threshold: 0.25 });
    $$('.revela, [data-conta], [data-medidor]').forEach((el) => io.observe(el));
  } else {
    $$('.revela').forEach((el) => el.classList.add('visto'));
    if (medidor) { $$('.roda', medidor).forEach((r) => { r.style.transform = 'none'; }); $$('[data-grau]', medidor).forEach((g) => { g.textContent = '0,0°'; }); medidor.classList.add('ok'); }
  }

  // pneu da capa acelera com a rolagem
  const pneu = $('.pneu-gira');
  if (pneu && !calmo) {
    let ultimo = scrollY, giro = 0, pedido = false;
    addEventListener('scroll', () => {
      giro += (scrollY - ultimo) * 0.35; ultimo = scrollY;
      if (!pedido) { pedido = true; requestAnimationFrame(() => { pneu.style.transform = `rotate(${giro}deg) translateY(${scrollY * 0.12}px)`; pedido = false; }); }
    }, { passive: true });
  }

  // orçamento rápido da capa
  const orcar = $('[data-orcar]');
  orcar.addEventListener('submit', (e) => {
    e.preventDefault();
    const servs = $$('input[name="serv"]:checked', orcar).map((i) => i.value);
    const carro = orcar.carro.value.trim();
    let msg = 'Olá, Pistão! Quero um orçamento grátis.';
    if (servs.length) msg += `\nServiço: ${servs.join(', ')}`;
    if (carro) msg += `\nCarro: ${carro}`;
    open(wa(msg), '_blank', 'noopener');
  });

  // formulário de contato vai para o WhatsApp
  const form = $('[data-form]'), aviso = $('[data-aviso]');
  form.fone.addEventListener('input', () => {
    const d = form.fone.value.replace(/\D/g, '').slice(0, 11);
    form.fone.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const falta = ['nome', 'carro'].filter((n) => !form[n].value.trim());
    $$('.campo', form).forEach((c) => c.classList.remove('erro'));
    falta.forEach((n) => form[n].closest('.campo').classList.add('erro'));
    if (falta.length) { aviso.textContent = 'Preencha seu nome e o carro para a gente orçar.'; form[falta[0]].focus(); return; }
    aviso.textContent = '';
    let msg = `Olá, Pistão! Meu nome é ${form.nome.value.trim()}.\nCarro: ${form.carro.value.trim()}\nServiço: ${form.servico.value}`;
    if (form.fone.value) msg += `\nWhatsApp: ${form.fone.value}`;
    if (form.msg.value.trim()) msg += `\n${form.msg.value.trim()}`;
    open(wa(msg), '_blank', 'noopener');
  });
})();
