/* AURA Fresh, modelo 4 "Nascente": vídeo da marca sob demanda, galeria que anda de lado com a rolagem,
   antes e depois com a linha arrastável e as gotas da fórmula em paralaxe. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // ---------- vídeo: só carrega o player do YouTube quando a pessoa toca ----------
  const quadro = $('[data-video]');
  if (quadro) $('[data-video-play]', quadro).addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${quadro.dataset.video}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    f.title = 'Vídeo da AURA Fresh';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    quadro.classList.add('tocando');
    quadro.appendChild(f);
    f.focus();
  });

  // ---------- galeria: no computador o trilho anda de lado enquanto a página desce ----------
  const gal = $('[data-galeria]'), trilho = $('[data-galeria-trilho]');
  const largo = matchMedia('(min-width: 901px)');
  function medeGaleria() {
    if (!gal) return;
    if (!largo.matches || reduz) { gal.style.height = ''; trilho.style.transform = ''; return; }
    const sobra = trilho.scrollWidth - innerWidth + 80;
    gal.style.height = `${innerHeight + Math.max(0, sobra)}px`;
    gal.dataset.sobra = Math.max(0, sobra);
  }
  function andaGaleria() {
    if (!gal || !largo.matches || reduz) return;
    const r = gal.getBoundingClientRect(), total = r.height - innerHeight;
    const k = total > 0 ? clamp(-r.top / total) : 0;
    trilho.style.transform = `translate3d(${-k * (+gal.dataset.sobra || 0)}px,0,0)`;
  }

  // ---------- gotas da fórmula em velocidades diferentes ----------
  const gotas = $$('[data-paralaxe]');
  function paralaxe() {
    if (reduz) return;
    gotas.forEach(g => {
      const r = g.getBoundingClientRect();
      const meio = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      g.style.setProperty('--py', `${(-meio * +g.dataset.paralaxe * 300).toFixed(1)}px`);
    });
  }

  let pedido = false;
  const rola = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; andaGaleria(); paralaxe(); }); };
  addEventListener('scroll', rola, { passive: true });
  addEventListener('resize', () => { medeGaleria(); rola(); });
  addEventListener('load', () => { medeGaleria(); rola(); });
  if (largo.addEventListener) largo.addEventListener('change', () => { medeGaleria(); rola(); });
  medeGaleria(); rola();

  // ---------- antes e depois ----------
  const ad = $('[data-ad]');
  if (ad) {
    const range = $('.ad-range', ad);
    const poe = v => { ad.style.setProperty('--x', v + '%'); range.value = v; };
    range.addEventListener('input', () => poe(+range.value));
    let arrasta = false;
    const pelo = e => { const r = ad.getBoundingClientRect(); poe(Math.round(clamp((e.clientX - r.left) / r.width) * 100)); };
    ad.addEventListener('pointerdown', e => { if (e.target === range) return; arrasta = true; ad.setPointerCapture(e.pointerId); ad.classList.add('arrastando'); pelo(e); });
    ad.addEventListener('pointermove', e => { if (arrasta) pelo(e); });
    const solta = () => { arrasta = false; ad.classList.remove('arrastando'); };
    ad.addEventListener('pointerup', solta); ad.addEventListener('pointercancel', solta);
    // a linha anda sozinha uma vez quando a seção aparece, para mostrar que dá para arrastar
    if (!reduz) new IntersectionObserver((es, io) => {
      if (!es[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const passo = agora => { if (arrasta) return; const k = clamp((agora - t0) / 1800); poe(Math.round(50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k))); if (k < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }, { threshold: 0.5 }).observe(ad);

  }

  // ---------- avaliações: uma fala por vez; o anel do rosto ativo enche e passa para a próxima ----------
  const aval = $('[data-aval]');
  if (aval) {
    const falas = $$('[data-fala]', aval), bts = $$('[data-fala-bt]', aval);
    let atual = 0;
    const mostra = i => {
      atual = (i + falas.length) % falas.length;
      falas.forEach((f, k) => { f.classList.toggle('on', k === atual); f.setAttribute('aria-hidden', String(k !== atual)); });
      bts.forEach((b, k) => { b.setAttribute('aria-pressed', String(k === atual)); });
    };
    bts.forEach((b, k) => {
      b.addEventListener('click', () => mostra(k));
      b.querySelector('circle').addEventListener('animationend', () => { if (k === atual) mostra(atual + 1); });
    });
    // o anel só conta enquanto a seção está na tela
    new IntersectionObserver(es => aval.classList.toggle('vendo', es[0].isIntersecting), { threshold: 0.4 }).observe(aval);
  }
})();
