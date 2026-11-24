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
  const fino = matchMedia('(pointer: fine)').matches;

  // ---------- carregando: espera a fachada, a recepção e as fontes; depois as portas de vidro se abrem ----------
  const cg = $('.carregando');
  if (cg && raiz.classList.contains('carregando-on')) {
    const barra = $('.cg-barra', cg);
    const fontes = document.fonts ? document.fonts.ready : Promise.resolve();
    const tarefas = ['assets/img/fachada.webp', 'assets/img/recepcao.webp'].map((src) => new Promise((ok) => { const im = new Image(); im.onload = im.onerror = ok; im.src = src; }));
    tarefas.push(fontes);
    let feitas = 0;
    tarefas.forEach((t) => t.then(() => { feitas++; barra.style.setProperty('--cg', (feitas / tarefas.length * 0.9).toFixed(2)); }));
    const minimo = new Promise((ok) => setTimeout(ok, reduz ? 300 : 2200));
    const teto = new Promise((ok) => setTimeout(ok, 7000)); // conexão lenta: não prende a pessoa
    Promise.race([Promise.all([...tarefas, minimo]), teto]).then(() => {
      barra.style.setProperty('--cg', 1);
      try { sessionStorage.setItem('sorrisus-cg', '1'); } catch { /* sem armazenamento */ }
      setTimeout(() => {
        cg.classList.add('abre');
        raiz.classList.remove('carregando-on');
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        setTimeout(() => cg.remove(), 1400);
      }, 350);
    });
  } else cg?.remove();

  // ---------- abajur: puxa a cordinha, a luminária balança e a luz (ou a noite) se espalha a partir dela ----------
  const abajur = $('[data-abajur]');
  const metaCor = $('meta[name="theme-color"]');
  const marcaTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    if (!abajur) return;
    abajur.setAttribute('aria-pressed', String(escuro));
    abajur.setAttribute('aria-label', escuro ? 'Acender a luz (tema claro)' : 'Apagar a luz (tema escuro)');
    $('.abajur-dica', abajur).textContent = escuro ? 'Acender' : 'Apagar';
    if (metaCor) metaCor.content = escuro ? '#0C0A08' : '#1C1915';
  };
  const aplicaTema = (t) => {
    if (t === 'escuro') raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
    try { localStorage.setItem('sorrisus-tema', t); } catch { /* sem armazenamento */ }
    marcaTema();
  };
  marcaTema();
  abajur?.addEventListener('click', () => {
    const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
    abajur.classList.remove('puxa'); void abajur.offsetWidth; abajur.classList.add('puxa');
    if (!document.startViewTransition || reduz) return aplicaTema(novo);
    const r = abajur.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.bottom - 12;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // um instante para a cordinha ser puxada antes da luz mudar
    setTimeout(() => {
      const vt = document.startViewTransition(() => aplicaTema(novo));
      vt.ready.then(() => raiz.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 950, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' },
      )).catch(() => {});
    }, 170);
  });

  // ---------- cursor: anel dourado que vira o dente da marca sobre links e um rótulo sobre o que se arrasta ----------
  if (fino && !reduz) {
    const cx = document.createElement('div');
    cx.className = 'cursor fora';
    cx.setAttribute('aria-hidden', 'true');
    cx.innerHTML = '<span class="cur-anel"><i><svg viewBox="0 0 64 64"><circle class="cur-circ" cx="32" cy="32" r="30"/><g class="cur-dente"><path d="M32 15C26 8.5 14.5 9 11.6 18.6 9 27.5 14.4 35.4 16.2 45.5 17.3 52 19 57.6 22.2 57.6 26 57.6 26.2 46.4 32 44.2 37.8 46.4 38 57.6 41.8 57.6 45 57.6 46.7 52 47.8 45.5 49.6 35.4 55 27.5 52.4 18.6 49.5 9 38 8.5 32 15Z"/><path d="M21.5 41.5C28.5 37.5 36.5 30 44.5 21"/><path d="M38.6 22.2 45.6 19.6 43.6 26.4"/></g></svg><b></b></i></span><span class="cur-ponto"><i></i></span>';
    document.body.appendChild(cx);
    const anel = $('.cur-anel', cx), ponto = $('.cur-ponto', cx), rot = $('b', cx);
    raiz.classList.add('cursor-on');
    const ROTULOS = [['[data-ad]', 'Arraste'], ['.av-trilho', 'Arraste'], ['.cl-trilho', 'Role'], ['.palco', 'Role']];
    const ESCURO = '.entrada, .diferenca, .clinica, .pacientes, .rodape, .carregando, .menu-aberto .menu';
    let mx = -100, my = -100, ax = -100, ay = -100, ativo = false;
    const avalia = (alvo) => {
      if (!(alvo instanceof Element)) return;
      const campo = alvo.closest('input:not([type="radio"]):not([type="checkbox"]), textarea');
      const r = !campo && ROTULOS.find(([s]) => alvo.closest(s));
      const link = !campo && !r && alvo.closest('a, button, summary, label, select, .map-box');
      cx.classList.toggle('rotulo', !!r);
      if (r) rot.textContent = r[1];
      cx.classList.toggle('link', !!link);
      cx.classList.toggle('campo', !!campo);
      cx.classList.toggle('claro', raiz.dataset.tema === 'escuro' || !!alvo.closest(ESCURO));
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!ativo) { ax = mx; ay = my; ativo = true; }
      ponto.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cx.classList.remove('fora');
      avalia(e.target);
    }, { passive: true });
    addEventListener('scroll', () => { if (ativo) avalia(document.elementFromPoint(mx, my)); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cx.classList.add('fora'));
    addEventListener('pointerdown', () => cx.classList.add('aperta'));
    addEventListener('pointerup', () => cx.classList.remove('aperta'));
    addEventListener('blur', () => cx.classList.remove('aperta'));
    const segue = () => {
      ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
      anel.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
      requestAnimationFrame(segue);
    };
    requestAnimationFrame(segue);
  }

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
    ['.dent-sub h3, .anos li, .exp', 'cena'],
    ['.dif-intro, .dif-lista li', 'cena'], ['.dif-numeros', 'cena-zoom'],
    ['.tc-cab > p:not(.rotulo), .tc', 'cena'],
    ['.visita .caminho li', 'cena'],
    ['.sec-cab > p:not(.rotulo), .av-ctrl, .av-nota', 'cena'], ['.resultados > div', 'cena'],
    ['.faq-cab > p:not(.rotulo), .faq-cab > a, .faq-lista details', 'cena'],
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
  const alterna = $$('.titulo, .revela');
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('on', e.isIntersecting)), { rootMargin: '-6% 0px -6% 0px' });
    alterna.forEach((el) => io.observe(el));
  } else alterna.forEach((el) => el.classList.add('on'));

  // ---------- contadores: contam de novo toda vez que voltam à tela ----------
  const contadores = $$('[data-conta]');
  const conta = (el) => {
    const fim = +el.dataset.conta, t0 = performance.now(), dur = 1400;
    const passo = (t) => { const k = lim((t - t0) / dur); el.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3))); if (k < 1 && el.dataset.ativo === '1') requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  };
  if ('IntersectionObserver' in window && !reduz) {
    const ioC = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && e.target.dataset.ativo !== '1') { e.target.dataset.ativo = '1'; conta(e.target); }
      else if (!e.isIntersecting) { e.target.dataset.ativo = '0'; e.target.textContent = '0'; }
    }), { rootMargin: '-4% 0px -4% 0px' });
    contadores.forEach((el) => ioC.observe(el));
  }

  // ---------- antes e depois: arrasta a linha (mouse, dedo ou setas do teclado) ----------
  $$('[data-ad]').forEach((ad) => {
    let corte = 50, arrastando = false, mexeu = false, anim = 0;
    const poe = (v) => { corte = lim(v, 0, 100); ad.style.setProperty('--corte', `${corte.toFixed(2)}%`); ad.setAttribute('aria-valuenow', String(Math.round(corte))); };
    const doPonteiro = (e) => { const r = ad.getBoundingClientRect(); poe(((e.clientX - r.left) / r.width) * 100); };
    const para = () => { cancelAnimationFrame(anim); mexeu = true; };
    ad.addEventListener('pointerdown', (e) => { para(); arrastando = true; ad.classList.add('arrasta'); ad.setPointerCapture(e.pointerId); doPonteiro(e); });
    ad.addEventListener('pointermove', (e) => { if (arrastando) doPonteiro(e); });
    const solta = () => { arrastando = false; ad.classList.remove('arrasta'); };
    ad.addEventListener('pointerup', solta);
    ad.addEventListener('pointercancel', solta);
    ad.addEventListener('keydown', (e) => {
      const passos = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, Home: -100, End: 100 };
      if (!(e.key in passos)) return;
      e.preventDefault(); para(); poe(corte + passos[e.key]);
    });
    // ao entrar na tela, a linha balança uma vez para mostrar que dá para arrastar (até a pessoa mexer)
    if ('IntersectionObserver' in window && !reduz) {
      new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting || mexeu) return;
        const t0 = performance.now();
        const vai = (t) => {
          const k = lim((t - t0) / 1800);
          poe(50 + Math.sin(k * Math.PI * 2) * 18 * (1 - k));
          if (k < 1 && !mexeu) anim = requestAnimationFrame(vai);
        };
        cancelAnimationFrame(anim);
        anim = requestAnimationFrame(vai);
      }), { threshold: 0.6 }).observe(ad);
    }
  });

  // ---------- carrossel de avaliações ----------
  $$('[data-carrossel]').forEach((car) => {
    const trilho = $('.av-trilho', car), barra = $('.av-barra i', car), btns = $$('[data-av]', car);
    const cartao = () => { const c = trilho.firstElementChild; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(trilho).columnGap || 0) : 300; };
    const marca = () => {
      const max = trilho.scrollWidth - trilho.clientWidth;
      const vis = trilho.clientWidth / trilho.scrollWidth;
      barra?.style.setProperty('--av-w', `${(vis * 100).toFixed(1)}%`);
      barra?.style.setProperty('--av-x', `${(max > 0 ? (trilho.scrollLeft / max) * (1 - vis) * 100 : 0).toFixed(1)}%`);
      btns[0].disabled = trilho.scrollLeft < 4;
      btns[1].disabled = trilho.scrollLeft > max - 4;
    };
    btns.forEach((b) => b.addEventListener('click', () => { trilho.scrollBy({ left: cartao() * +b.dataset.av, behavior: reduz ? 'auto' : 'smooth' }); parado = true; }));
    trilho.addEventListener('scroll', () => requestAnimationFrame(marca), { passive: true });
    // no computador, dá para puxar o carrossel com o mouse; ao soltar, ele encaixa no cartão mais próximo
    let px = null, sl = 0, puxou = false;
    trilho.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button) return;
      px = e.clientX; sl = trilho.scrollLeft; puxou = false;
      trilho.classList.add('puxando');
      trilho.setPointerCapture(e.pointerId);
    });
    trilho.addEventListener('pointermove', (e) => {
      if (px === null) return;
      const dx = e.clientX - px;
      if (Math.abs(dx) > 4) puxou = true;
      trilho.scrollLeft = sl - dx;
    });
    const soltaTrilho = () => {
      if (px === null) return;
      px = null;
      trilho.classList.remove('puxando');
      const c = cartao();
      trilho.scrollTo({ left: Math.round(trilho.scrollLeft / c) * c, behavior: 'smooth' });
    };
    trilho.addEventListener('pointerup', soltaTrilho);
    trilho.addEventListener('pointercancel', soltaTrilho);
    trilho.addEventListener('click', (e) => { if (puxou) { e.preventDefault(); e.stopPropagation(); puxou = false; } }, true);
    trilho.addEventListener('dragstart', (e) => e.preventDefault());
    addEventListener('resize', marca);
    marca();
    // passa sozinho devagar enquanto está na tela; para quando a pessoa interage
    let parado = reduz, visivel = false;
    ['pointerdown', 'focusin', 'wheel', 'touchstart'].forEach((ev) => trilho.addEventListener(ev, () => { parado = true; }, { passive: true }));
    car.addEventListener('pointerenter', () => { car.dataset.sobre = '1'; });
    car.addEventListener('pointerleave', () => { car.dataset.sobre = '0'; });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visivel = es[0].isIntersecting; }).observe(trilho);
    setInterval(() => {
      if (parado || !visivel || car.dataset.sobre === '1' || document.hidden) return;
      const max = trilho.scrollWidth - trilho.clientWidth;
      trilho.scrollTo({ left: trilho.scrollLeft >= max - 4 ? 0 : trilho.scrollLeft + cartao(), behavior: 'smooth' });
    }, 5500);
  });

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
