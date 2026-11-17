/* Pistão Auto Center: interações do modelo Silver. Sem bibliotecas. */
(() => {
  const D = /*DADOS*/;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---------- preloader: fica no mínimo 0,9 s e no máximo 2,6 s ---------- */
  const t0 = performance.now();
  const libera = () => {
    if (document.body.classList.contains('carregado')) return;
    document.body.classList.add('carregado');
    document.body.classList.remove('carregando');
    iniciaSlides();
  };
  window.addEventListener('load', () => setTimeout(libera, Math.max(0, 900 - (performance.now() - t0))));
  setTimeout(libera, 2600);

  /* ---------- grupos com a mesma largura ---------- */
  const igualar = () => {
    $$('[data-iguais]').forEach((g) => {
      if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
      g.classList.remove('medido');
      const maior = Math.max(...[...g.children].map((c) => c.offsetWidth));
      if (maior > 0) { g.style.setProperty('--larg', maior + 'px'); g.classList.add('medido'); }
    });
  };
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);
  window.addEventListener('load', igualar);
  igualar();

  /* ---------- topo e menu ---------- */
  const topo = $('.topo');
  const burger = $('.burger');
  const fechaMenu = () => { document.body.classList.remove('menu-aberto'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); };
  burger.addEventListener('click', () => {
    const abre = !document.body.classList.contains('menu-aberto');
    document.body.classList.toggle('menu-aberto', abre);
    burger.setAttribute('aria-expanded', String(abre));
    burger.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
  });
  $$('.menu a').forEach((a) => a.addEventListener('click', fechaMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechaMenu(); });

  // link do menu da seção visível
  const links = $$('.menu ul a');
  const secoes = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const secObs = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('atual', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach((s) => secObs.observe(s));

  /* ---------- status aberto ou fechado ---------- */
  const st = $('[data-status]');
  if (st) {
    const agora = new Date();
    const min = agora.getHours() * 60 + agora.getMinutes();
    const h = D.abertura[agora.getDay()];
    st.textContent = h && min >= h[0] && min < h[1] ? 'Aberto agora, ligue' : 'Fechado agora, deixe recado';
  }

  /* ---------- título em letras ---------- */
  $$('[data-letras]').forEach((el) => {
    const txt = el.textContent.trim();
    let n = 0;
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(' ').map((p) => `<span class="pal" aria-hidden="true">${[...p].map((l) => `<span class="let" style="--n:${n++}">${l}</span>`).join('')}</span>`).join(' ');
  });

  /* ---------- entradas ao rolar ---------- */
  const vis = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    vis.unobserve(e.target);
    if (e.target.matches('[data-conta-box]')) contar(e.target);
  }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
  // atraso em cascata para irmãos com data-anima
  $$('[data-anima]').forEach((el) => {
    const irmaos = [...el.parentElement.children].filter((c) => c.hasAttribute('data-anima'));
    const i = irmaos.indexOf(el);
    if (i > 0 && !el.style.getPropertyValue('--atraso')) el.style.setProperty('--atraso', `${Math.min(i, 6) * 0.09}s`);
  });
  $$('[data-anima], [data-letras], .insta-fotos').forEach((el) => vis.observe(el));

  /* ---------- números que contam ---------- */
  const fmt = (v) => Math.round(v).toLocaleString('pt-BR');
  const contar = (box) => $$('[data-conta]', box).forEach((el) => {
    const alvo = +el.dataset.conta;
    if (calmo) { el.textContent = fmt(alvo); return; }
    const ini = performance.now(), dur = 2200;
    const passo = (t) => {
      const k = Math.min(1, (t - ini) / dur);
      el.textContent = fmt(alvo * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
  const numBox = $('.numeros');
  if (numBox) {
    $$('[data-conta]', numBox).forEach((el) => { el.textContent = '0'; });
    numBox.setAttribute('data-conta-box', '');
    vis.observe(numBox);
  }

  /* ---------- capa em slides ---------- */
  const slides = $$('.slide');
  const pags = $$('[data-ir-slide]');
  const TEMPO = 7000;
  let atual = 0, relogio = null;
  const vaiPara = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === atual) return;
    const velho = slides[atual];
    velho.classList.remove('ativo');
    velho.classList.add('saindo');
    velho.setAttribute('aria-hidden', 'true');
    setTimeout(() => velho.classList.remove('saindo'), 1150);
    // reinicia o zoom do slide que entra
    const novo = slides[n];
    const img = $('.slide-bg', novo);
    img.style.transition = 'none'; img.style.transform = 'scale(1.18)'; void img.offsetWidth; img.style.transition = ''; img.style.transform = '';
    novo.classList.add('ativo');
    novo.removeAttribute('aria-hidden');
    pags.forEach((p, i) => p.setAttribute('aria-selected', String(i === n)));
    atual = n;
    agenda();
  };
  const agenda = () => {
    clearTimeout(relogio);
    if (calmo) return;
    // reinicia a barrinha do slide atual
    const p = pags[atual];
    if (p) { p.setAttribute('aria-selected', 'false'); void p.offsetWidth; p.style.setProperty('--tempo', TEMPO + 'ms'); p.setAttribute('aria-selected', 'true'); }
    relogio = setTimeout(() => vaiPara(atual + 1), TEMPO);
  };
  function iniciaSlides() { if (slides.length > 1 && !relogio) agenda(); }
  $('[data-prox]')?.addEventListener('click', () => vaiPara(atual + 1));
  $('[data-ant]')?.addEventListener('click', () => vaiPara(atual - 1));
  pags.forEach((p, i) => p.addEventListener('click', () => vaiPara(i)));
  // arrastar na capa (celular)
  const capa = $('.capa');
  let x0 = null;
  capa?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  capa?.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) vaiPara(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(relogio); else if (document.body.classList.contains('carregado')) agenda(); });

  /* ---------- depoimentos ---------- */
  const trilho = $('[data-depo]');
  if (trilho) {
    const cartoes = [...trilho.children];
    const barra = $('[data-depo-barra]');
    let i = 0, auto = null;
    const porTela = () => (innerWidth <= 960 ? 1 : 2);
    const max = () => cartoes.length - porTela();
    const passo = () => cartoes[0].offsetWidth + parseFloat(getComputedStyle(trilho).gap || 0);
    const mostra = () => {
      i = Math.max(0, Math.min(i, max()));
      trilho.style.transform = `translateX(${-i * passo()}px)`;
      const total = cartoes.length;
      barra.style.width = `${(porTela() / total) * 100}%`;
      barra.style.left = `${(i / total) * 100}%`;
      cartoes.forEach((c, k) => c.setAttribute('aria-hidden', String(k < i || k >= i + porTela())));
    };
    const roda = () => { clearInterval(auto); if (!calmo) auto = setInterval(() => { i = i >= max() ? 0 : i + 1; mostra(); }, 6500); };
    $('[data-dep-prox]').addEventListener('click', () => { i = i >= max() ? 0 : i + 1; mostra(); roda(); });
    $('[data-dep-ant]').addEventListener('click', () => { i = i <= 0 ? max() : i - 1; mostra(); roda(); });
    // arrastar com mouse ou dedo
    let ini = null, dx = 0;
    trilho.addEventListener('pointerdown', (e) => { ini = e.clientX; dx = 0; trilho.classList.add('arrastando'); trilho.setPointerCapture(e.pointerId); clearInterval(auto); });
    trilho.addEventListener('pointermove', (e) => { if (ini === null) return; dx = e.clientX - ini; trilho.style.transform = `translateX(${-i * passo() + dx}px)`; });
    const solta = () => { if (ini === null) return; trilho.classList.remove('arrastando'); if (Math.abs(dx) > 60) i += dx < 0 ? 1 : -1; ini = null; mostra(); roda(); };
    trilho.addEventListener('pointerup', solta);
    trilho.addEventListener('pointercancel', solta);
    trilho.closest('.depo').addEventListener('mouseenter', () => clearInterval(auto));
    trilho.closest('.depo').addEventListener('mouseleave', roda);
    window.addEventListener('resize', mostra);
    mostra(); roda();
  }

  /* ---------- FAQ: uma pergunta aberta por vez ---------- */
  const perguntas = $$('.pergunta');
  perguntas.forEach((d) => d.addEventListener('toggle', () => { if (d.open) perguntas.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- efeitos ligados à rolagem ---------- */
  const fundos = $$('.fundo-txt');
  const contornos = $$('.contorno li');
  const paralaxe = $$('.faixa-bg, .contato-bg, .sobre-rubi');
  const pilha = $$('.cartao');
  const indice = $$('[data-indice]');
  const sobe = $('.sobe-topo');
  let ultimoY = scrollY, pedido = false;
  const quadro = () => {
    pedido = false;
    const y = scrollY, H = innerHeight;
    // topo: fundo depois da capa, some ao descer e volta ao subir
    topo.classList.toggle('rolou', y > 40);
    if (!document.body.classList.contains('menu-aberto')) topo.classList.toggle('some', y > 700 && y > ultimoY + 2);
    if (y < ultimoY - 2) topo.classList.remove('some');
    ultimoY = y;
    // botão de voltar ao topo com anel de progresso
    const total = document.documentElement.scrollHeight - H;
    sobe.style.setProperty('--rolado', total > 0 ? (y / total).toFixed(3) : 0);
    sobe.classList.toggle('mostra', y > H * .8);
    if (calmo) return;
    // texto vazado gigante desliza com a rolagem
    fundos.forEach((f) => {
      const r = f.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > H + 200) return;
      f.style.setProperty('--desloc', `${((r.top + r.height / 2) / H - .5) * -160}px`);
    });
    // frases em contorno se preenchem conforme sobem na tela
    contornos.forEach((li) => {
      const r = li.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (H * .82 - r.top) / (H * .35)));
      li.style.setProperty('--p', p.toFixed(3));
    });
    // fundos com paralaxe
    paralaxe.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) return;
      const k = el.classList.contains('sobre-rubi') ? .12 : .18;
      el.style.setProperty('--para', `${((r.top + r.height / 2) - H / 2) * -k}px`);
    });
    // cartões de serviço: o de baixo encolhe e escurece quando o próximo chega por cima
    pilha.forEach((c, k) => {
      const prox = pilha[k + 1];
      if (!prox) return;
      const topoC = c.getBoundingClientRect().top;
      const d = prox.getBoundingClientRect().top - topoC;
      const p = Math.min(1, Math.max(0, 1 - d / c.offsetHeight));
      c.style.setProperty('--enc', (1 - p * .06).toFixed(4));
      c.style.setProperty('--luz', (1 - p * .45).toFixed(3));
    });
    // serviço em destaque no índice
    let ativo = null;
    pilha.forEach((c) => { if (c.getBoundingClientRect().top < H * .5) ativo = c.id; });
    indice.forEach((a) => a.classList.toggle('atual', a.dataset.indice === ativo));
  };
  const pede = () => { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } };
  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', pede);
  quadro();

  /* ---------- formulário de agendamento ---------- */
  const form = $('[data-form]');
  if (form) {
    const aviso = $('[data-aviso]', form);
    const fone = $('[data-mascara]', form);
    fone.addEventListener('input', () => {
      const d = fone.value.replace(/\D/g, '').slice(0, 11);
      fone.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
        : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
        : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });
    const data = $('[data-data]', form);
    const hoje = new Date(); hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    data.min = hoje.toISOString().slice(0, 10);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const faltam = [];
      $$('.erro', form).forEach((el) => el.classList.remove('erro'));
      [['nome', 'seu nome'], ['fone', 'o WhatsApp'], ['carro', 'o modelo do carro']].forEach(([k, t]) => {
        const v = String(f.get(k) || '').trim();
        if (!v || (k === 'fone' && v.replace(/\D/g, '').length < 10)) { faltam.push(t); form.elements[k].classList.add('erro'); }
      });
      if (faltam.length) {
        aviso.className = 'aviso';
        aviso.textContent = `Falta preencher ${faltam.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`;
        form.querySelector('.erro').focus();
        return;
      }
      const dt = f.get('data') ? f.get('data').split('-').reverse().join('/') : 'a combinar';
      const msg = [
        'Olá, Pistão! Quero agendar um serviço.',
        `Nome: ${f.get('nome')}`,
        `WhatsApp: ${f.get('fone')}`,
        `Carro: ${f.get('marca')} ${f.get('carro')}`,
        `Serviço: ${f.get('servico')}`,
        `Data: ${dt}, ${String(f.get('periodo')).toLowerCase()}`,
        f.get('msg') ? `O que está acontecendo: ${f.get('msg')}` : '',
      ].filter(Boolean).join('\n');
      aviso.className = 'aviso ok';
      aviso.textContent = 'Abrindo o WhatsApp com o seu agendamento...';
      window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
