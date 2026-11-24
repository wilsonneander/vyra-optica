// Sorrisus Prime, Gold de odontologia.
// Câmera da fachada até a recepção (GSAP + ScrollTrigger), galeria horizontal da estrutura,
// página que se monta e se desfaz conforme a rolagem nos dois sentidos, e agendamento pelo WhatsApp.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dados = JSON.parse($('#dados')?.textContent || '{}');
  const lim = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const faixa = (v, a, b) => lim((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const suave = (t) => t * t * (3 - 2 * t);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // ---------- menu ----------
  const menuBtn = $('.menu-btn');
  const fechaMenu = () => { document.body.classList.remove('menu-aberto'); menuBtn?.setAttribute('aria-expanded', 'false'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !document.body.classList.contains('menu-aberto');
    document.body.classList.toggle('menu-aberto', abre);
    menuBtn.setAttribute('aria-expanded', String(abre));
    menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
  });
  $$('.menu a').forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') fechaMenu(); });

  // ---------- grupos com o mesmo tamanho: a largura do item mais longo ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent) return;
    let maior = 0;
    [...g.children].forEach((f) => {
      const c = f.cloneNode(true);
      c.style.cssText = 'position:absolute;visibility:hidden;width:max-content;left:0;top:0;pointer-events:none';
      $$('input', c).forEach((x) => x.removeAttribute('name'));
      g.appendChild(c);
      maior = Math.max(maior, c.getBoundingClientRect().width);
      c.remove();
    });
    g.style.setProperty('--larg', `${Math.ceil(maior)}px`);
  });
  document.fonts?.ready.then(iguala);
  addEventListener('resize', iguala);
  iguala();

  // ---------- palavras dos títulos: índice para a entrada em sequência ----------
  $$('.pa').forEach((el) => { el.firstElementChild?.style.setProperty('--i', [...el.parentElement.querySelectorAll(':scope > .pa')].indexOf(el)); });

  const temGsap = !!(window.gsap && window.ScrollTrigger);
  if (temGsap) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }

  // =====================================================================
  // ENTRADA: a câmera se aproxima da vidraça da recepção e atravessa o vidro
  // =====================================================================
  const IMG = { w: 1536, h: 1024 };               // fachada.webp
  const VID = { x0: 421, y0: 508, x1: 649, y1: 779 }; // vidraça central da recepção, em pixels da fachada
  const REC = { w: 2400, h: 1350 };               // recepcao.webp
  const G = { x: (VID.x0 + VID.x1) / 2, y: (VID.y0 + VID.y1) / 2 };
  const entrada = $('.entrada'), palco = $('.palco'), fach = $('.fachada'), dentro = $('.dentro'), dImg = $('.dentro-img');
  const reflexo = $('.reflexo'), veu = $('.veu'), txt = $('.entrada-txt'), rolar = $('.rolar'), bem = $('.bemvindo'), fundo = $('.fundo-borrado');
  let vw = 0, vh = 0, s0 = 1, zFim = 1, c0 = { x: 0, y: 0 }, retrato = false, rec = { w: 0, h: 0, l: 0, t: 0 };

  const mede = () => {
    vw = palco.clientWidth; vh = palco.clientHeight;
    retrato = vw / vh < 0.85;
    // no computador a fachada cobre a tela; em pé (celular) ela aparece inteira na largura, sobre a própria foto desfocada
    s0 = retrato ? Math.max((vw * 1.22) / IMG.w, (vh * 0.42) / IMG.h) : Math.max(vw / IMG.w, vh / IMG.h);
    // no fim, a vidraça passa das bordas da tela com folga
    zFim = Math.max(vw / (VID.x1 - VID.x0), vh / (VID.y1 - VID.y0)) * 1.14;
    c0 = { x: retrato ? lerp(IMG.w / 2, G.x, 0.4) : IMG.w / 2, y: IMG.h / 2 };
    const sr = Math.max(vw / REC.w, vh / REC.h);
    rec.w = REC.w * sr; rec.h = REC.h * sr;
    // no celular a recepção puxa para o balcão e a placa
    rec.l = lim(vw / 2 - rec.w * (retrato ? 0.71 : 0.5), vw - rec.w, 0);
    rec.t = (vh - rec.h) / 2;
    dImg.style.cssText = `width:${rec.w}px;height:${rec.h}px;left:${rec.l}px;top:${rec.t}px;transform-origin:${vw / 2 - rec.l}px ${vh / 2 - rec.t}px;--pf:${(rec.w * 0.0098).toFixed(2)}px`;
    if (fundo) fundo.style.opacity = retrato ? 1 : 0;
  };

  const desenha = (p) => {
    const pA = lim(p / 0.8);          // aproximação até a porta
    const pB = faixa(p, 0.8, 1);      // já do lado de dentro
    const e = easeIO(pA);
    const z = s0 * Math.pow(zFim / s0, e);
    // a mira vai para a porta logo no começo, a aproximação continua depois
    const ec = suave(lim(pA * 1.7));
    let cx = lerp(c0.x, G.x, ec), cy = lerp(c0.y, G.y, ec);
    const hw = vw / (2 * z), hh = vh / (2 * z);
    cx = IMG.w * z >= vw ? lim(cx, hw, IMG.w - hw) : IMG.w / 2;
    // em pé, a fachada inteira sobe um pouco e deixa a parte de baixo para o texto
    cy = IMG.h * z >= vh ? lim(cy, hh, IMG.h - hh) : IMG.h / 2 + ((vh - IMG.h * z) / vh) * vh * 0.17 / z;
    const tx = vw / 2 - cx * z, ty = vh / 2 - cy * z;
    fach.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${z.toFixed(5)})`;

    // a vidraça na tela: a recepção aparece só dentro dela e cresce junto
    const gx0 = tx + VID.x0 * z, gy0 = ty + VID.y0 * z, gx1 = tx + VID.x1 * z, gy1 = ty + VID.y1 * z;
    dentro.style.clipPath = `inset(${Math.max(0, gy0).toFixed(1)}px ${Math.max(0, vw - gx1).toFixed(1)}px ${Math.max(0, vh - gy1).toFixed(1)}px ${Math.max(0, gx0).toFixed(1)}px)`;
    dentro.style.opacity = suave(faixa(pA, 0.1, 0.48)).toFixed(3);
    // o que está atrás do vidro se aproxima mais devagar que a fachada (profundidade)
    const gcx = (gx0 + gx1) / 2, gcy = (gy0 + gy1) / 2;
    // a recepção inteira cabe na vidraça (cobre o vidro sem sobra); quando o vidro passa da tela, ela cobre a tela
    const cobre = Math.max((gx1 - gx0) / rec.w, (gy1 - gy0) / rec.h) * 1.04;
    const si = Math.min(cobre, 1) * lerp(1, 1.06, suave(pB));
    const k = 1 - suave(faixa(pA, 0.82, 1)); // no fim, a recepção se assenta no centro da tela
    dImg.style.transform = `translate3d(${((gcx - vw / 2) * k).toFixed(2)}px, ${((gcy - vh / 2) * k).toFixed(2)}px, 0) scale(${si.toFixed(4)})`;
    // reflexo no vidro: aparece ao chegar perto e desliza para fora quando a câmera atravessa
    reflexo.style.opacity = (suave(faixa(pA, 0.15, 0.45)) * (1 - suave(faixa(pA, 0.72, 0.98)))).toFixed(3);
    reflexo.style.transform = `translate3d(${lerp(-18, 60, pA).toFixed(1)}%, 0, 0)`;
    veu.style.opacity = (1 - 0.5 * suave(faixa(pA, 0.2, 0.9)) + 0.25 * pB).toFixed(3);
    // textos da fachada saem logo nos primeiros passos; o "bem-vindo" chega já do lado de dentro
    const s = faixa(p, 0, 0.09);
    txt.style.opacity = (1 - s).toFixed(3);
    txt.style.transform = `translate3d(0, ${(-50 * s).toFixed(1)}px, 0)`;
    rolar.style.opacity = (1 - faixa(p, 0, 0.05)).toFixed(3);
    const b = suave(faixa(pB, 0.05, 0.65));
    bem.style.opacity = b.toFixed(3);
    bem.style.setProperty('--bv', b.toFixed(3));
    bem.style.transform = `translate3d(0, ${(24 * (1 - b)).toFixed(1)}px, 0)`;
  };

  if (temGsap && !reduz && entrada) {
    mede();
    raiz.classList.add('pronto');
    desenha(0);
    const estado = { p: 0 };
    gsap.to(estado, {
      p: 1, ease: 'none', onUpdate: () => desenha(estado.p),
      scrollTrigger: { trigger: entrada, start: 'top top', end: () => `+=${Math.round(innerHeight * 3.2)}`, pin: true, scrub: 1.1, anticipatePin: 1, invalidateOnRefresh: true },
    });
    ScrollTrigger.addEventListener('refreshInit', mede);
    ScrollTrigger.addEventListener('refresh', () => desenha(estado.p));
    // o indicador de rolagem leva até a porta, não pula a animação
    rolar?.addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: innerHeight * 3.2, behavior: 'smooth' }); });
  } else if (dentro) {
    dentro.remove();
  }

  // =====================================================================
  // ESTRUTURA: galeria que corre de lado enquanto a página desce
  // =====================================================================
  const trilho = $('.cl-trilho'), barra = $('.cl-barra');
  if (temGsap && !reduz && trilho) {
    const dist = () => Math.max(0, trilho.scrollWidth - innerWidth);
    gsap.to(trilho, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.clinica', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (st) => barra?.style.setProperty('--cl', st.progress.toFixed(3)),
      },
    });
  }

  // =====================================================================
  // A HISTÓRIA NA ROLAGEM: blocos seguem a posição da página nos dois sentidos
  // =====================================================================
  const CENAS = [
    ['.dent-txt > :not(h2)', 'cena'], ['.dent-foto figcaption', 'cena-lado'],
    ['.dent-sub h3, .anos li, .exp', 'cena'], ['.difs li', 'cena'],
    ['.sec-cab > p:not(.rotulo), .trat-indice', 'cena'], ['.trat-txt > :not(h3)', 'cena'],
    ['.visita .caminho li', 'cena'],
    ['.relato', 'cena'], ['.resultados > div', 'cena'],
    ['.ag-txt > :not(h2)', 'cena'], ['.ag-form', 'cena-zoom'],
    ['.mapa-linha > *, .rodape-cols > div', 'cena'],
  ];
  const cenas = [];
  if (!reduz) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      el.classList.add(cls);
      // irmãos lado a lado entram em sequência: o atraso vira distância de rolagem
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 6) * 0.04 });
    }));
  }
  // títulos sobem palavra por palavra e fotos se revelam por máscara; ligam ao entrar e desligam ao sair por qualquer borda
  const alterna = $$('.titulo, .trat-txt h3, .difs-tit, .revela');
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('on', e.isIntersecting)), { rootMargin: '-6% 0px -6% 0px' });
    alterna.forEach((el) => io.observe(el));
  } else alterna.forEach((el) => el.classList.add('on'));

  const topo = $('.topo'), dentista = $('#dentista');
  let pedido = false, ultimoY = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh2 = innerHeight;
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, !r.height && !r.width]; });
    // --p: entrada pela borda de baixo; --q: saída pela borda de cima
    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = lim((vh2 * (1.01 - atraso) - top) / (vh2 * 0.3));
      const q = lim((bottom - vh2 * 0.02) / (vh2 * 0.3));
      el.style.setProperty('--p', (1 - Math.pow(1 - p, 3)).toFixed(3));
      el.style.setProperty('--q', (1 - Math.pow(1 - q, 3)).toFixed(3));
    }
    const y = scrollY;
    const desce = y > ultimoY;
    if (Math.abs(y - ultimoY) > 2) { raiz.dataset.rolagem = desce ? 'desce' : 'sobe'; }
    // topo: claro sobre a fachada, sólido depois de entrar; some ao descer e volta ao subir
    const passou = dentista ? dentista.getBoundingClientRect().top < 90 : y > vh2;
    topo?.classList.toggle('solido', passou);
    raiz.classList.toggle('passou', passou);
    if (Math.abs(y - ultimoY) > 2) {
      topo?.classList.toggle('esconde', passou && desce && y > ultimoY + 2 && !document.body.classList.contains('menu-aberto'));
      ultimoY = y;
    }
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(rola));
  addEventListener('load', () => { if (temGsap) ScrollTrigger.refresh(); requestAnimationFrame(rola); });
  rola();

  // ---------- agendamento: abre o pedido pronto no WhatsApp ----------
  const form = $('[data-agenda]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const erro = $('.ag-erro', form);
    const nome = String(f.get('nome') || '').trim();
    const fone = String(f.get('fone') || '').replace(/\D/g, '');
    if (!nome) { erro.textContent = 'Conte o seu nome para a recepção.'; form.nome.focus(); return; }
    if (fone.length < 10) { erro.textContent = 'Confira o número de WhatsApp, com DDD.'; form.fone.focus(); return; }
    if (!f.get('lgpd')) { erro.textContent = 'Para enviar, autorize o uso dos dados para este atendimento.'; return; }
    erro.textContent = '';
    const msg = [
      `Olá! Sou ${nome} e gostaria de agendar uma avaliação na ${dados.nome}.`,
      `Interesse: ${f.get('trat') || 'avaliação geral'}.`,
      `Melhor período: ${f.get('periodo')}.`,
      f.get('msg') ? `Mensagem: ${String(f.get('msg')).trim()}` : '',
      `Meu WhatsApp: ${f.get('fone')}`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${dados.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
