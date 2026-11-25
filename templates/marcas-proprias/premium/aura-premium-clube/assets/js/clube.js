/* AURA Fresh, modelo 3: hora do ritual (troca a luz da cena), sanfona de ativos e o mês que se preenche. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // hora do ritual: troca a cor da cena (manhã rosa, tarde lima, noite verde-escuro)
  const ritual = $('[data-ritual]');
  const hora = $('[data-hora]');
  if (ritual && hora) {
    const salvo = (() => { try { return localStorage.getItem('aura-ritual-hora'); } catch (e) { return null; } })();
    const escolhe = h => {
      ritual.dataset.hora = h;
      $$('button', hora).forEach(b => b.setAttribute('aria-pressed', b.dataset.h === h));
      try { localStorage.setItem('aura-ritual-hora', h); } catch (e) { /* privado */ }
    };
    $$('button', hora).forEach(b => b.addEventListener('click', () => escolhe(b.dataset.h)));
    escolhe(salvo || 'manha');
  }

  // sanfona: abre no passar do mouse, no foco e no toque
  const folhas = $$('.folha');
  folhas.forEach(f => {
    const abre = () => folhas.forEach(o => o.classList.toggle('aberta', o === f));
    f.addEventListener('mouseenter', abre);
    f.addEventListener('focusin', abre);
    f.addEventListener('click', e => { if (!e.target.closest('[data-ativo]')) abre(); });
  });

  // um pote, um mês: as 30 bolinhas acendem conforme a seção passa pela tela
  const mes = $('[data-mes]');
  if (mes) {
    const bolas = $$('i', mes), cont = $('[data-mes-dias]', mes);
    const anda = () => {
      const r = mes.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.6 + r.height * 0.6)));
      const n = Math.round(k * 30);
      bolas.forEach((b, i) => b.classList.toggle('on', i < n));
      if (cont) cont.textContent = n;
    };
    anda(); addEventListener('scroll', anda, { passive: true });
  }
})();
