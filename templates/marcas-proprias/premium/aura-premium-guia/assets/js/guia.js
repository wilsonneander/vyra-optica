/* AURA Fresh, modelo 2 "Diário": comparador de rotina, rótulo aberto em 2D e filtro do blog. Sem WebGL. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (document.querySelector('meta[name="aura-img"]') || {}).content || 'assets/img/';

  // comparador: a divisória acompanha o range (teclado, mouse e toque)
  const comp = $('[data-comp]');
  if (comp) {
    const r = $('[data-comp-range]', comp);
    const aplica = v => comp.style.setProperty('--x', v + '%');
    r.addEventListener('input', () => aplica(r.value));
    // arrastar em qualquer ponto do bloco
    let ativo = false;
    const move = e => { const b = comp.getBoundingClientRect(); const v = Math.max(4, Math.min(96, (e.clientX - b.left) / b.width * 100)); r.value = v; aplica(v); };
    comp.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button) return; ativo = true; move(e); });
    addEventListener('pointermove', e => { if (ativo) move(e); });
    addEventListener('pointerup', () => { ativo = false; });
    // dica: a divisória balança uma vez quando o bloco aparece
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { comp.classList.add('dica'); io.disconnect(); } }, { threshold: 0.5 }).observe(comp);
  }

  // rótulo aberto: desenha a mesma folha do pote 3D e posiciona os pontos
  const r2 = $('[data-rotulo2d]');
  if (r2 && window.AuraRotulo) {
    const RT = window.AuraRotulo, cv = $('canvas', r2);
    const leitura = $$('.r2-leitura > div', r2), pontos = $$('.r2-ponto', r2);
    const escolhe = p => { leitura.forEach(d => d.classList.toggle('on', d.dataset.t === p)); pontos.forEach(b => b.setAttribute('aria-pressed', b.dataset.p === p)); };
    const desenha = () => RT.carrega(img).then(() => {
      const c = RT.desenha();
      cv.width = c.width; cv.height = c.height; cv.getContext('2d').drawImage(c, 0, 0);
      pontos.forEach(b => { const p = RT.pontos[b.dataset.p]; if (p) { b.style.left = (p[0] / RT.LW * 100) + '%'; b.style.top = (p[1] / RT.LH * 100) + '%'; } });
      r2.classList.add('pronto');
    });
    // só desenha quando a seção chega perto da tela (o canvas é grande)
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { desenha(); io.disconnect(); } }, { rootMargin: '300px' }).observe(r2);
    pontos.forEach(b => { b.addEventListener('click', () => escolhe(b.dataset.p)); b.addEventListener('mouseenter', () => escolhe(b.dataset.p)); });
    escolhe('clorofila');
  }

  // filtro do blog
  const filtro = $('[data-filtro]');
  if (filtro) {
    $$('button', filtro).forEach(b => b.addEventListener('click', () => {
      $$('button', filtro).forEach(x => x.setAttribute('aria-pressed', x === b));
      $$('.blog-lista .post-card').forEach(p => { p.hidden = !!b.dataset.cat && p.dataset.cat !== b.dataset.cat; });
    }));
  }
})();
