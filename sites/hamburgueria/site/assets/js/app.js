/* Braseiro Burger & Cozinha: interações da landing page.
   Tudo funciona sem GSAP/Lenis (o conteúdo aparece normalmente); com eles, ganha as animações de rolagem. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toque = matchMedia('(hover: none)').matches;
  const WHATS = '5511900000000';
  const temGsap = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Entrada ---------- */
  const loader = $('#loader');
  let saiu = false;
  const sair = () => {
    if (saiu) return;
    saiu = true;
    loader.classList.add('fora');
    entradaCapa();
  };
  window.addEventListener('load', () => setTimeout(sair, calmo ? 0 : 900));
  setTimeout(sair, 3200); // nunca prende a pessoa na entrada

  function entradaCapa() {
    if (!temGsap || calmo) return;
    gsap.from('.hero-titulo .linha > span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .12, delay: .35 });
    gsap.from('[data-hero]', { y: 30, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1, delay: .55 });
    gsap.from('.hero-card', { y: 60, rotate: 6, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .8 });
    gsap.fromTo('.hero-video', { scale: 1.25 }, { scale: 1.08, duration: 2.4, ease: 'power2.out' });
  }

  /* ---------- Rolagem suave ---------- */
  let lenis = null;
  if (window.Lenis && !calmo) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (temGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const irPara = (alvo) => {
    const el = typeof alvo === 'string' ? $(alvo) : alvo;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    fecharMenu();
    irPara(id);
  }));

  /* ---------- Topo ---------- */
  const topo = $('#topo');
  let ultimoY = 0;
  const aoRolar = () => {
    const y = window.scrollY;
    topo.classList.toggle('solido', y > 60);
    topo.classList.toggle('some', y > 600 && y > ultimoY && !menu.classList.contains('aberto'));
    ultimoY = y;
    $('.pedir-fixo').classList.toggle('on', y > window.innerHeight * .8);
  };
  window.addEventListener('scroll', aoRolar, { passive: true });

  const menu = $('#menu');
  const abrir = $('#abrirMenu');
  function fecharMenu() {
    menu.classList.remove('aberto');
    abrir.setAttribute('aria-expanded', 'false');
    lenis && lenis.start();
  }
  abrir.addEventListener('click', () => {
    const vai = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', vai);
    abrir.setAttribute('aria-expanded', String(vai));
    lenis && (vai ? lenis.stop() : lenis.start());
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { fecharMenu(); fecharLightbox(); } });

  // link da seção atual no menu
  const secoes = $$('main section[id]');
  const marcarAtual = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    $$('.menu a').forEach((a) => a.classList.toggle('atual', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach((s) => marcarAtual.observe(s));

  /* ---------- Cursor ---------- */
  const cursor = $('#cursor');
  if (!toque && cursor) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const anda = () => { cx += (tx - cx) * .18; cy += (ty - cy) * .18; cursor.style.translate = `${cx}px ${cy}px`; requestAnimationFrame(anda); };
    anda();
    const alvos = [
      ['.prato-foto', 'Pedir'], ['.hero-card', 'Ver'], ['.reel-midia', 'Play'], ['.chef', 'Oi!'],
      ['.coz-card', 'Ver'], ['.especiais-pilha', 'Hum'],
    ];
    alvos.forEach(([sel, txt]) => $$(sel).forEach((el) => {
      el.addEventListener('mouseenter', () => { cursor.firstElementChild.textContent = txt; cursor.classList.add('on'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('on'));
    }));
  }

  /* ---------- Cartão da capa: fotos que trocam ---------- */
  const fotosCard = $$('.hero-card-fotos img');
  let iCard = 0;
  if (fotosCard.length > 1 && !calmo) setInterval(() => {
    fotosCard[iCard].classList.remove('on');
    iCard = (iCard + 1) % fotosCard.length;
    fotosCard[iCard].classList.add('on');
  }, 2600);

  /* ---------- Queridinhos: pilha de fotos ---------- */
  const lista = $$('#especiaisLista li');
  const pilha = $$('#especiaisPilha img');
  const POSES = [
    'translate(-50%,-50%) rotate(-4deg)',
    'translate(-28%,-58%) rotate(8deg) scale(.92)',
    'translate(-72%,-40%) rotate(-12deg) scale(.88)',
    'translate(-44%,-30%) rotate(14deg) scale(.84)',
  ];
  const mostrarEspecial = (i) => {
    lista.forEach((li, k) => li.classList.toggle('on', k === i));
    pilha.forEach((img, k) => {
      const ordem = (k - i + pilha.length) % pilha.length;
      img.style.transform = POSES[ordem];
      img.style.zIndex = String(10 - ordem);
      img.style.filter = ordem ? 'brightness(.82)' : 'none';
    });
  };
  lista.forEach((li, i) => {
    li.addEventListener('mouseenter', () => mostrarEspecial(i));
    li.querySelector('button').addEventListener('click', () => mostrarEspecial(i));
    li.querySelector('button').addEventListener('focus', () => mostrarEspecial(i));
  });
  mostrarEspecial(0);

  /* ---------- Cardápio: abas ---------- */
  const abas = $$('#abas button');
  const marca = $('#abasMarca');
  const pratos = $$('.prato');
  const moverMarca = (b) => {
    marca.style.width = b.offsetWidth + 'px';
    marca.style.transform = `translateX(${b.offsetLeft - 5}px)`;
  };
  const trocarAba = (cat, animar = true) => {
    const b = abas.find((x) => x.dataset.cat === cat);
    if (!b) return;
    abas.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    moverMarca(b);
    const visiveis = [];
    pratos.forEach((p) => {
      const vai = p.dataset.cat === cat;
      p.hidden = !vai;
      if (vai) visiveis.push(p);
    });
    if (animar && temGsap && !calmo) {
      gsap.fromTo(visiveis, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .07, overwrite: true });
      ScrollTrigger.refresh();
    }
  };
  abas.forEach((b) => b.addEventListener('click', () => trocarAba(b.dataset.cat)));
  $('#abas').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const i = abas.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    const n = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
    n.focus(); trocarAba(n.dataset.cat);
  });
  window.addEventListener('resize', () => moverMarca(abas.find((b) => b.getAttribute('aria-selected') === 'true')));
  document.fonts && document.fonts.ready.then(() => moverMarca(abas[0]));
  moverMarca(abas[0]);

  // cards "Da nossa cozinha" abrem a categoria certa
  $$('[data-ir]').forEach((a) => a.addEventListener('click', () => setTimeout(() => trocarAba(a.dataset.ir), 50)));

  // botão Pedir de cada prato abre o WhatsApp com o item
  $$('.prato-pedir').forEach((b) => b.addEventListener('click', () => {
    const txt = `Olá! Quero pedir: ${b.dataset.item}`;
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
  }));
  $$('.prato-foto').forEach((f) => f.addEventListener('click', () => f.parentElement.querySelector('.prato-pedir').click()));

  /* ---------- Curtir prato (uma vez por pessoa, lembrado no navegador) ---------- */
  const fmtLikes = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',').replace(',0', '') + ' mil' : String(n)) + (n === 1 ? ' curtida' : ' curtidas');
  const lerCurtidas = () => { try { return JSON.parse(localStorage.getItem('braseiro-curtidas')) || []; } catch (e) { return []; } };
  const salvarCurtidas = (l) => { try { localStorage.setItem('braseiro-curtidas', JSON.stringify(l)); } catch (e) { /* navegador sem armazenamento */ } };
  const curtidas = lerCurtidas();
  $$('.curtir').forEach((b) => {
    const nome = b.closest('.prato').querySelector('h3').textContent;
    const marcar = () => {
      b.classList.add('curtido');
      b.setAttribute('aria-pressed', 'true');
      b.setAttribute('aria-label', `Você curtiu ${nome}`);
      b.querySelector('.curtir-num').textContent = fmtLikes(+b.dataset.likes + 1);
    };
    b.setAttribute('aria-label', `Curtir ${nome}`);
    if (curtidas.includes(nome)) marcar();
    b.addEventListener('click', () => {
      if (b.classList.contains('curtido')) return; // só conta uma vez
      marcar();
      curtidas.push(nome);
      salvarCurtidas(curtidas);
      if (calmo) return;
      b.classList.add('pulou');
      setTimeout(() => b.classList.remove('pulou'), 650);
      for (let i = 0; i < 8; i++) {
        const f = document.createElement('span');
        f.className = 'curtir-faisca';
        f.style.setProperty('--a', `${i * 45}deg`);
        b.appendChild(f);
        setTimeout(() => f.remove(), 750);
      }
    });
  });

  /* ---------- Vídeos que tocam só quando aparecem ---------- */
  const tocarVisivel = new IntersectionObserver((ents) => ents.forEach((en) => {
    const v = en.target;
    if (en.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
  }), { threshold: .25 });
  $$('video[data-auto]').forEach((v) => tocarVisivel.observe(v));
  const capa = $('.hero-video');
  new IntersectionObserver(([en]) => { en.isIntersecting ? capa.play().catch(() => {}) : capa.pause(); }).observe(capa);

  /* ---------- Contador da chapa ---------- */
  const cont = $('.contador');
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    const ate = +cont.dataset.ate, t0 = performance.now(), dur = calmo ? 1 : 1800;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      cont.textContent = Math.round(ate * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }, { threshold: .4 }).observe(cont);

  /* ---------- Bastidores: arrastar, tocar no hover e abrir ---------- */
  const reels = $('#reels');
  let arrastou = false;
  {
    let x0 = 0, s0 = 0, segurando = false;
    reels.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      segurando = true; arrastou = false; x0 = e.clientX; s0 = reels.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!segurando) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 6) { arrastou = true; reels.classList.add('arrastando'); }
      reels.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', () => { segurando = false; reels.classList.remove('arrastando'); });
  }
  $$('.reel').forEach((r) => {
    const v = r.querySelector('video');
    if (!toque) {
      r.addEventListener('mouseenter', () => v.play().catch(() => {}));
      r.addEventListener('mouseleave', () => v.pause());
    } else {
      tocarVisivel.observe(v);
    }
    r.addEventListener('click', (e) => {
      if (arrastou) { e.preventDefault(); arrastou = false; return; }
      abrirLightbox(r.dataset.src, r);
    });
  });

  const lb = $('#lightbox');
  const lbVideo = $('#lbVideo');
  let voltarFoco = null;
  function abrirLightbox(src, origem) {
    voltarFoco = origem;
    lbVideo.src = src;
    lb.hidden = false;
    lenis && lenis.stop();
    lbVideo.play().catch(() => {});
    $('#lbFechar').focus();
  }
  function fecharLightbox() {
    if (lb.hidden) return;
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    lb.hidden = true;
    lenis && lenis.start();
    voltarFoco && voltarFoco.focus();
  }
  $('#lbFechar').addEventListener('click', fecharLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) fecharLightbox(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [$('#lbFechar'), lbVideo];
    const i = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
  });

  /* ---------- Horário de hoje (Brasília) ---------- */
  const agoraSP = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const dia = agoraSP.getDay();
  const linhaHoje = $$('#horarios li').find((li) => li.dataset.dias.split(',').includes(String(dia)));
  if (linhaHoje) {
    linhaHoje.classList.add('hoje');
    linhaHoje.firstElementChild.textContent += ' (hoje)';
  }

  /* ---------- Depoimentos: colunas que sobem sem fim ---------- */
  $$('.depo-trilho').forEach((t) => [...t.children].forEach((c) => {
    const k = c.cloneNode(true);
    k.setAttribute('aria-hidden', 'true');
    t.appendChild(k);
  }));

  /* ---------- Letreiro do rodapé ---------- */
  const rodMarca = $('#rodMarca');
  rodMarca.innerHTML = [...rodMarca.textContent].map((l) => `<span aria-hidden="true">${l}</span>`).join('');

  /* ---------- Newsletter ---------- */
  const news = $('#news');
  news.addEventListener('submit', (e) => {
    e.preventDefault();
    const campo = $('#newsEmail');
    const msg = $('#newsMsg');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campo.value.trim());
    msg.className = 'news-msg ' + (ok ? 'ok' : 'erro');
    // Integre aqui: enviar o e-mail para a ferramenta de newsletter do cliente.
    msg.textContent = ok ? 'Pronto! O primeiro cupom chega na sua caixa de entrada.' : 'Confere o e-mail? Parece que falta alguma coisa.';
    if (ok) campo.value = '';
  });

  /* ---------- Animações de rolagem (GSAP) ---------- */
  if (!temGsap || calmo) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js');

  // capa se afasta ao rolar
  gsap.to('.hero-in', { yPercent: 18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // faixa acelera e inclina com a velocidade da rolagem
  const trilho = $('.faixa-trilho');
  const faixaAnim = trilho.getAnimations ? trilho.getAnimations()[0] : null;
  ScrollTrigger.create({
    onUpdate: (st) => {
      const v = Math.min(Math.abs(st.getVelocity()) / 300, 6);
      if (faixaAnim) faixaAnim.playbackRate = 1 + v;
      gsap.to('.faixa', { skewY: gsap.utils.clamp(-2.5, 2.5, st.getVelocity() / -900), duration: .4, overwrite: true });
    },
  });

  // títulos sobem linha a linha
  $$('[data-split]').forEach((h) => {
    const partes = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = partes.map((p) => `<span class="linha" style="display:block;overflow:hidden"><span style="display:block">${p}</span></span>`).join('');
    gsap.from(h.querySelectorAll('.linha > span'), {
      yPercent: 105, duration: 1, ease: 'power4.out', stagger: .1,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  // texto da casa acende palavra por palavra
  const casa = $('#casaTexto');
  casa.innerHTML = casa.textContent.trim().split(/\s+/).map((w) => `<span class="p">${w}</span>`).join(' ');
  const palavras = $$('.p', casa);
  ScrollTrigger.create({
    trigger: casa, start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: (st) => {
      const n = Math.round(st.progress * palavras.length);
      palavras.forEach((p, i) => p.classList.toggle('acesa', i < n));
    },
  });
  $$('.casa-foto').forEach((f) => gsap.to(f, { y: +f.dataset.vel, rotate: f.classList.contains('f1') ? 10 : -12, ease: 'none', scrollTrigger: { trigger: '.casa', start: 'top bottom', end: 'bottom top', scrub: true } }));

  // pilha dos queridinhos entra girando
  gsap.from('#especiaisPilha', { opacity: 0, y: 120, rotate: 10, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.especiais', start: 'top 70%' } });
  gsap.from('#especiaisLista li', { opacity: 0, x: -40, duration: .8, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.especiais', start: 'top 70%' } });

  // pratos surgem
  ScrollTrigger.batch('.prato:not([hidden])', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .08 }),
  });

  // vídeo da chapa abre as bordas ao rolar
  if (innerWidth > 640) {
    gsap.fromTo('#chapaMoldura', { clipPath: 'inset(0% 6% 0% 6% round 18px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: '.chapa', start: 'top 85%', end: 'top 10%', scrub: true },
    });
  }
  gsap.fromTo('.chapa-video', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.chapa', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.chapa-txt > *', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.chapa', start: 'top 40%' } });

  // cards da cozinha caem em degraus
  gsap.from('.coz-card', { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4), duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.cozinha-cards', start: 'top 85%' } });

  // assinatura: título fixo que troca e fotos passando em velocidades diferentes
  const frases = $$('#assinTitulo span');
  const chips = $$('.assin-chips span');
  ScrollTrigger.create({
    trigger: '.assin-palco', start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      const i = Math.min(frases.length - 1, Math.floor(st.progress * frases.length));
      frases.forEach((f, k) => f.classList.toggle('on', k === i));
      chips.forEach((c, k) => c.classList.toggle('on', k === i));
    },
  });
  $$('.assin-fotos img').forEach((img) => gsap.fromTo(img, { y: 0 }, {
    y: +img.dataset.vel * 2.2, ease: 'none',
    scrollTrigger: { trigger: '.assin-palco', start: 'top bottom', end: 'bottom top', scrub: true },
  }));

  // reels entram em leque
  gsap.from('.reel', { y: 80, opacity: 0, rotate: (i) => (i % 2 ? 3 : -3), duration: 1, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '#reels', start: 'top 85%' } });

  // contato com foto em parallax
  gsap.fromTo('.contato-bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.contato-quadro', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.contato-painel', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contato-quadro', start: 'top 70%' } });

  // equipe e locais
  gsap.from('.chef', { y: 80, opacity: 0, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.equipe-grade', start: 'top 85%' } });
  gsap.from('.local-card', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.local-cards', start: 'top 85%' } });
  gsap.from('.map-pino', { y: -120, opacity: 0, duration: 1, ease: 'bounce.out', scrollTrigger: { trigger: '.map-box', start: 'top 70%' } });

  // rodapé
  gsap.from('.rod-galeria a', { y: 60, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.rod-galeria', start: 'top 90%' } });
  gsap.from('#rodMarca span', { yPercent: 100, duration: 1, ease: 'power4.out', stagger: .05, scrollTrigger: { trigger: '#rodMarca', start: 'top 95%' } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
