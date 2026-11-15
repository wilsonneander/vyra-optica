/* Pistão Auto Center: interações do modelo Gold. Sem bibliotecas. */
(() => {
  const D = {"whatsapp":"5531999990000","abertura":{"1":[450,1110],"2":[450,1110],"3":[450,1110],"4":[450,1110],"5":[450,1110],"6":[480,840]}};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouseFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const economia = navigator.connection && navigator.connection.saveData;
  document.documentElement.classList.add('js');
  const tocar = (v) => { if (!v || economia) return; const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  /* ---------- preloader: conta-giros sobe até 100% (mín. 1,3 s, máx. 3,2 s) ---------- */
  const pre = $('.pre');
  const pct = $('[data-pre-pct]');
  const t0 = performance.now();
  let alvo = 0, mostrado = 0, pronto = false;
  const animaPre = () => {
    if (document.body.classList.contains('carregado')) return;
    const passou = performance.now() - t0;
    alvo = pronto ? 100 : Math.min(88, passou / 18);
    mostrado += (alvo - mostrado) * .12;
    if (pronto && passou > 1300 && mostrado > 99) mostrado = 100;
    pre.style.setProperty('--p', (mostrado / 100).toFixed(3));
    pct.textContent = Math.round(mostrado);
    if (mostrado >= 100) return libera();
    requestAnimationFrame(animaPre);
  };
  const libera = () => {
    if (document.body.classList.contains('carregado')) return;
    pre.style.setProperty('--p', 1); pct.textContent = 100;
    document.body.classList.add('carregado');
    document.body.classList.remove('carregando');
    iniciaSlides();
  };
  window.addEventListener('load', () => { pronto = true; });
  setTimeout(() => { pronto = true; }, 2200);
  setTimeout(libera, 3200);
  if (calmo) { pronto = true; setTimeout(libera, 300); } else requestAnimationFrame(animaPre);

  /* ---------- tema claro ou escuro ---------- */
  const raiz = document.documentElement;
  const botoesTema = $$('[data-tema-ir]');
  const marcaTema = () => botoesTema.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
  botoesTema.forEach((b) => b.addEventListener('click', () => {
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('pistao-tema', raiz.dataset.tema); } catch (e) { /* sem armazenamento, o tema vale só nesta visita */ }
    $('meta[name="theme-color"]').content = raiz.dataset.tema === 'claro' ? '#ffffff' : '#101010';
    marcaTema();
  }));
  marcaTema();

  /* ---------- letras que rolam no hover ---------- */
  $$('[data-rola]').forEach((el) => {
    const txt = el.textContent.trim();
    let n = 0;
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(' ').map((p) => `<span class="p" aria-hidden="true">${[...p].map((l) => `<span class="l" style="--n:${n++}">${l}</span>`).join('')}</span>`).join('');
  });

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

  const links = $$('.menu ul a');
  const secObs = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('atual', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => secObs.observe(s));

  /* ---------- status aberto ou fechado e dia de hoje na tabela ---------- */
  const agora = new Date();
  const min = agora.getHours() * 60 + agora.getMinutes();
  const h = D.abertura[agora.getDay()];
  const st = $('[data-status]');
  if (st) st.textContent = h && min >= h[0] && min < h[1] ? 'Aberto agora, ligue' : 'Fechado agora, deixe recado';
  const linhas = $$('.horas tr');
  const dia = agora.getDay();
  const linhaHoje = dia >= 1 && dia <= 5 ? 0 : dia === 6 ? 1 : 2;
  if (linhas[linhaHoje]) linhas[linhaHoje].classList.add('hoje');

  /* ---------- título em letras ---------- */
  $$('[data-letras]').forEach((el) => {
    // respeita as quebras de linha (<br>) do título
    const linhas = el.innerHTML.split(/<br\s*\/?>/i).map((l) => l.replace(/<[^>]+>/g, '').trim());
    let n = 0;
    el.setAttribute('aria-label', linhas.join(' '));
    el.innerHTML = linhas.map((ln) => ln.split(' ').map((p) => `<span class="pal" aria-hidden="true">${[...p].map((l) => `<span class="let" style="--n:${n++}">${l}</span>`).join('')}</span>`).join(' ')).join('<br>');
  });

  /* ---------- números que contam ---------- */
  const contar = (box) => $$('[data-conta]', box).forEach((el) => {
    const fim = +el.dataset.conta;
    if (calmo) { el.textContent = fim; return; }
    const ini = performance.now(), dur = 2200;
    const passo = (t) => {
      const k = Math.min(1, (t - ini) / dur);
      el.textContent = Math.round(fim * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
  $$('[data-conta]').forEach((el) => { el.textContent = '0'; });

  /* ---------- entradas ao rolar ---------- */
  const vis = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    vis.unobserve(e.target);
    if (e.target.matches('[data-conta-box], .sobre-anos')) contar(e.target);
  }), { threshold: .16, rootMargin: '0px 0px -8% 0px' });
  $$('[data-anima]').forEach((el) => {
    const irmaos = [...el.parentElement.children].filter((c) => c.hasAttribute('data-anima'));
    const i = irmaos.indexOf(el);
    if (i > 0 && !el.style.getPropertyValue('--atraso')) el.style.setProperty('--atraso', `${Math.min(i, 6) * 0.1}s`);
  });
  $$('[data-anima], [data-letras], [data-conta-box]').forEach((el) => vis.observe(el));
  // fotos com cortina: o recorte total esconde o elemento do observador, então observa o pai
  const revObs = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    $$(':scope > [data-revela]', e.target).forEach((f) => f.classList.add('visto'));
    revObs.unobserve(e.target);
  }), { threshold: .2 });
  new Set($$('[data-revela]').map((f) => f.parentElement)).forEach((p) => revObs.observe(p));
  // cada número da faixa acende com um atraso
  $$('.num').forEach((n, i) => n.style.setProperty('--atraso', `${i * .15}s`));

  /* ---------- capa em slides (vídeo no primeiro) ---------- */
  const slides = $$('.slide');
  const pags = $$('[data-ir-slide]');
  const TEMPO = 8000;
  let atual = 0, relogio = null;
  const videoDo = (s) => $('video', s);
  const vaiPara = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === atual) return;
    const velho = slides[atual];
    velho.classList.remove('ativo');
    velho.classList.add('saindo');
    velho.setAttribute('aria-hidden', 'true');
    setTimeout(() => { velho.classList.remove('saindo'); const vv = videoDo(velho); if (vv) vv.pause(); }, 1250);
    const novo = slides[n];
    const bg = $('.slide-bg', novo);
    bg.style.transition = 'none'; bg.style.transform = 'scale(1.15)'; void bg.offsetWidth; bg.style.transition = ''; bg.style.transform = '';
    const nv = videoDo(novo);
    if (nv) { nv.currentTime = 0; tocar(nv); }
    novo.classList.add('ativo');
    novo.removeAttribute('aria-hidden');
    pags.forEach((p, i) => p.setAttribute('aria-selected', String(i === n)));
    atual = n;
    agenda();
  };
  const agenda = () => {
    clearTimeout(relogio);
    if (calmo) return;
    const p = pags[atual];
    // o slide do vídeo fica o tempo do vídeo (até 16 s); as fotos ficam 8 s
    const v = videoDo(slides[atual]);
    const tempo = v && v.duration ? Math.min(16000, v.duration * 1000 - 300) : TEMPO;
    if (p) { p.setAttribute('aria-selected', 'false'); void p.offsetWidth; p.style.setProperty('--tempo', tempo + 'ms'); p.setAttribute('aria-selected', 'true'); }
    relogio = setTimeout(() => vaiPara(atual + 1), tempo);
  };
  function iniciaSlides() {
    const v = videoDo(slides[0]);
    if (v && !calmo) {
      tocar(v);
      if (v.readyState >= 1) agenda(); else v.addEventListener('loadedmetadata', agenda, { once: true });
      setTimeout(() => { if (!relogio) agenda(); }, 1500);
    } else if (slides.length > 1 && !relogio) agenda();
  }
  $('[data-prox]')?.addEventListener('click', () => vaiPara(atual + 1));
  $('[data-ant]')?.addEventListener('click', () => vaiPara(atual - 1));
  pags.forEach((p, i) => p.addEventListener('click', () => vaiPara(i)));
  const capa = $('.capa');
  let x0 = null;
  capa?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  capa?.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) vaiPara(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  // texto da capa acompanha o mouse de leve
  if (mouseFino && !calmo) capa?.addEventListener('mousemove', (e) => {
    capa.style.setProperty('--mx', (e.clientX / innerWidth - .5).toFixed(3));
    capa.style.setProperty('--my', (e.clientY / innerHeight - .5).toFixed(3));
  });
  document.addEventListener('visibilitychange', () => {
    const v = videoDo(slides[atual]);
    if (document.hidden) { clearTimeout(relogio); if (v) v.pause(); }
    else if (document.body.classList.contains('carregado')) { agenda(); if (v) tocar(v); }
  });

  /* ---------- vídeos que tocam no hover (serviços e equipe) ou quando aparecem (toque) ---------- */
  $$('[data-hover-video]').forEach((v) => {
    const caixa = v.closest('.servico, .pessoa');
    v.addEventListener('playing', () => caixa.classList.add('tocando'));
    v.addEventListener('pause', () => caixa.classList.remove('tocando'));
    if (calmo) return;
    if (mouseFino) {
      caixa.addEventListener('mouseenter', () => tocar(v));
      caixa.addEventListener('mouseleave', () => v.pause());
    }
  });
  // reels do Instagram, vídeo de fundo da oficina e (no toque) equipe e serviços: tocam só quando estão na tela
  const autoVideos = $$('[data-reel], [data-auto-video]').concat(mouseFino ? [] : $$('[data-hover-video]'));
  const vidObs = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting && !calmo) tocar(e.target); else e.target.pause(); }), { threshold: .55 });
  autoVideos.forEach((v) => vidObs.observe(v));

  /* ---------- player do vídeo da oficina ---------- */
  const player = $('[data-player]');
  if (player) {
    const pv = $('video', player);
    $('[data-abre-video]').addEventListener('click', () => { player.showModal(); tocar(pv); });
    const fecha = () => { pv.pause(); player.close(); };
    $('[data-fecha-video]').addEventListener('click', fecha);
    player.addEventListener('click', (e) => { if (e.target === player) fecha(); });
    player.addEventListener('close', () => pv.pause());
  }

  /* ---------- depoimentos: slide grande com troca automática ---------- */
  const palco = $('[data-depo]');
  if (palco) {
    const ds = $$('.depo-slide', palco);
    const pontos = $$('[data-ir-depo]');
    const TD = 7000;
    let i = 0, auto = null;
    const mostra = (n) => {
      i = (n + ds.length) % ds.length;
      ds.forEach((s, k) => { s.classList.toggle('ativo', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
      pontos.forEach((p, k) => { p.setAttribute('aria-selected', 'false'); if (k === i) { void p.offsetWidth; p.style.setProperty('--tempo', TD + 'ms'); p.setAttribute('aria-selected', 'true'); } });
      roda();
    };
    const roda = () => { clearTimeout(auto); if (!calmo) auto = setTimeout(() => mostra(i + 1), TD); };
    $('[data-dep-prox]').addEventListener('click', () => mostra(i + 1));
    $('[data-dep-ant]').addEventListener('click', () => mostra(i - 1));
    pontos.forEach((p, k) => p.addEventListener('click', () => mostra(k)));
    let ini = null;
    palco.addEventListener('pointerdown', (e) => { ini = e.clientX; });
    palco.addEventListener('pointerup', (e) => { if (ini === null) return; const dx = e.clientX - ini; if (Math.abs(dx) > 60) mostra(i + (dx < 0 ? 1 : -1)); ini = null; });
    palco.addEventListener('pointercancel', () => { ini = null; });
    const depoObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) mostra(i); else clearTimeout(auto); }, { threshold: .3 });
    depoObs.observe(palco);
  }

  /* ---------- pacotes: carrossel com setas e arrastar ---------- */
  const trilho = $('[data-pacotes]');
  if (trilho) {
    const cards = [...trilho.children];
    let i = 0;
    const porTela = () => (innerWidth <= 640 ? 1 : innerWidth <= 1240 ? 2 : 3);
    const max = () => Math.max(0, cards.length - porTela());
    const passo = () => cards[0].offsetWidth + parseFloat(getComputedStyle(trilho).gap || 0);
    const mostra = () => {
      i = Math.max(0, Math.min(i, max()));
      trilho.style.transform = `translateX(${-i * passo()}px)`;
    };
    $('[data-pac-prox]').addEventListener('click', () => { i = i >= max() ? 0 : i + 1; mostra(); });
    $('[data-pac-ant]').addEventListener('click', () => { i = i <= 0 ? max() : i - 1; mostra(); });
    let ini = null, dx = 0;
    trilho.addEventListener('pointerdown', (e) => { if (e.target.closest('a')) return; ini = e.clientX; dx = 0; trilho.classList.add('arrastando'); trilho.setPointerCapture(e.pointerId); });
    trilho.addEventListener('pointermove', (e) => { if (ini === null) return; dx = e.clientX - ini; trilho.style.transform = `translateX(${-i * passo() + dx}px)`; });
    const solta = () => { if (ini === null) return; trilho.classList.remove('arrastando'); if (Math.abs(dx) > 50) i += dx < 0 ? 1 : -1; ini = null; mostra(); };
    trilho.addEventListener('pointerup', solta);
    trilho.addEventListener('pointercancel', solta);
    window.addEventListener('resize', mostra);
    mostra();
  }

  /* ---------- FAQ: uma pergunta aberta por vez ---------- */
  const perguntas = $$('.pergunta');
  perguntas.forEach((d) => d.addEventListener('toggle', () => { if (d.open) perguntas.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- clicar num serviço já escolhe ele no formulário ---------- */
  const sel = $('[data-servico-select]');
  $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
    if (!sel) return;
    sel.value = a.dataset.servico;
    const campo = sel.closest('.campo');
    campo.classList.remove('pisca'); void campo.offsetWidth; campo.classList.add('pisca');
  }));

  /* ---------- cursor ---------- */
  const cursor = $('.cursor');
  if (mouseFino && !calmo && cursor) {
    let mx = -100, my = -100, ax = -100, ay = -100;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseover', (e) => cursor.classList.toggle('sobre-link', !!e.target.closest('a, button, summary, label, .pessoa, [data-depo]')));
    document.addEventListener('mouseleave', () => { mx = my = -100; });
    const segue = () => {
      ax += (mx - ax) * .2; ay += (my - ay) * .2;
      cursor.style.setProperty('--cx', mx + 'px'); cursor.style.setProperty('--cy', my + 'px');
      cursor.style.setProperty('--ax', ax.toFixed(1) + 'px'); cursor.style.setProperty('--ay', ay.toFixed(1) + 'px');
      requestAnimationFrame(segue);
    };
    segue();
  }

  /* ---------- efeitos ligados à rolagem ---------- */
  const fundos = $$('.cab-fundo');
  const paralaxe = $$('.sobre-vinho');
  const moldura = $('[data-video-moldura]');
  const sobe = $('.sobe-topo');
  let ultimoY = scrollY, pedido = false;
  const quadro = () => {
    pedido = false;
    const y = scrollY, H = innerHeight;
    topo.classList.toggle('rolou', y > 40);
    if (!document.body.classList.contains('menu-aberto')) topo.classList.toggle('some', y > 700 && y > ultimoY + 2);
    if (y < ultimoY - 2) topo.classList.remove('some');
    ultimoY = y;
    const total = document.documentElement.scrollHeight - H;
    const rolado = total > 0 ? (y / total).toFixed(4) : 0;
    sobe.style.setProperty('--rolado', rolado);
    sobe.classList.toggle('mostra', y > H * .8);
    if (calmo) return;
    // palavra metálica atrás dos títulos desliza de leve com a rolagem
    fundos.forEach((f) => {
      const r = f.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > H + 200) return;
      f.style.setProperty('--desloc', `${((r.top + r.height / 2) / H - .5) * -120}px`);
    });
    paralaxe.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) return;
      el.style.setProperty('--para', `${((r.top + r.height / 2) - H / 2) * -.08}px`);
    });
    // moldura do vídeo abre até a tela cheia conforme a seção sobe
    if (moldura) {
      const r = moldura.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (r.top - H * .05) / (H * .75)));
      moldura.style.setProperty('--v', k.toFixed(3));
    }
  };
  const pede = () => { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } };
  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', pede);
  quadro();

  /* ---------- máscara de telefone ---------- */
  const mascara = (el) => el.addEventListener('input', () => {
    const d = el.value.replace(/\D/g, '').slice(0, 11);
    el.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
      : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
      : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  $$('[data-mascara]').forEach(mascara);
  const abreWhats = (msg) => window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');

  /* ---------- formulário de agendamento ---------- */
  const form = $('[data-form]');
  if (form) {
    const aviso = $('[data-aviso]', form);
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
      abreWhats([
        'Olá, Pistão! Quero agendar um serviço.',
        `Nome: ${f.get('nome')}`,
        `WhatsApp: ${f.get('fone')}`,
        `Carro: ${f.get('marca')} ${f.get('carro')}`,
        `Serviço: ${f.get('servico')}`,
        `Data: ${dt}, ${String(f.get('periodo')).toLowerCase()}`,
        f.get('msg') ? `O que está acontecendo: ${f.get('msg')}` : '',
      ].filter(Boolean).join('\n'));
      aviso.className = 'aviso ok';
      aviso.textContent = 'Abrindo o WhatsApp com o seu agendamento...';
    });
  }

  /* ---------- lembrete de revisão no rodapé ---------- */
  const lembrete = $('[data-lembrete]');
  if (lembrete) {
    const aviso = $('[data-aviso]', lembrete);
    lembrete.addEventListener('submit', (e) => {
      e.preventDefault();
      const fone = lembrete.elements.fone.value;
      if (fone.replace(/\D/g, '').length < 10) {
        aviso.className = 'aviso';
        aviso.textContent = 'Digite o WhatsApp com DDD.';
        lembrete.elements.fone.focus();
        return;
      }
      abreWhats(`Olá, Pistão! Quero receber o lembrete da próxima revisão. Meu WhatsApp: ${fone}`);
      aviso.className = 'aviso ok';
      aviso.textContent = 'Pronto! Confirme a mensagem no WhatsApp.';
    });
  }

  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
