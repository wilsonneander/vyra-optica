// Ícones do Cobre Premium: os desenhos da marca vêm do Cobre Standard (mesma empresa); aqui só o que é novo.
const base = require('../_build-cobre-standard/icons');

module.exports = {
  ...base,
  // logo do Premium: símbolo, "Cobre" condensado e "barbearia" em letra cursiva
  logo: `<span class="logo-in">${base.simbolo}<span class="logo-txt"><b>Cobre</b><em>barbearia</em></span></span>`,
  // poste de barbeiro visto de frente: tampa, vidro com as listras e base (as listras andam pelo CSS)
  poste: `<div class="poste" aria-hidden="true">
    <span class="poste-tampa"></span>
    <span class="poste-vidro"><span class="poste-listras"></span><span class="poste-luz"></span></span>
    <span class="poste-base"></span>
  </div>`,
  // espelho de mão, usado como o zero da página 404
  espelho: '<svg class="espelho" viewBox="0 0 120 200" aria-hidden="true"><ellipse cx="60" cy="66" rx="52" ry="60" fill="var(--cobre)"/><ellipse cx="60" cy="66" rx="42" ry="50" fill="var(--fundo)"/><path class="espelho-brilho" d="M34 44c6-14 18-22 32-24" fill="none" stroke="var(--cobre)" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M50 124h20l-3 70H53Z" fill="var(--tinta)"/><path d="M47 124h26" stroke="var(--cobre)" stroke-width="6"/></svg>',
};
