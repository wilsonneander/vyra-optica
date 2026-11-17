/* AURA Fresh, modelo 1 e 3: pequenos comportamentos de página (fita que acelera com o scroll, potes sem 3D). */
(function () {
  'use strict';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // a fita anda sozinha e acelera um pouco com a velocidade da rolagem
  const fita = document.querySelector('.fita-trilho');
  if (fita && !reduz && fita.animate) {
    const anim = fita.getAnimations()[0];
    let ultimo = scrollY, vel = 1;
    const passo = () => {
      const d = Math.abs(scrollY - ultimo); ultimo = scrollY;
      vel += ((1 + Math.min(d / 18, 4)) - vel) * 0.08;
      if (anim) anim.playbackRate = vel;
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
  // sem WebGL, os potes dos kits viram foto
  const semFoto = () => document.querySelectorAll('img[data-pote]:not([src])').forEach((img, i) => {
    img.src = 'assets/img/' + ['pote-pedra.webp', 'pote-claro.webp', 'pote-splash.webp'][(+img.dataset.pote || 1) - 1];
    img.classList.add('pronta');
  });
  new MutationObserver(() => { if (document.documentElement.classList.contains('sem-3d')) semFoto(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  setTimeout(() => { if (!document.documentElement.classList.contains('com-3d')) semFoto(); }, 6000);
})();
