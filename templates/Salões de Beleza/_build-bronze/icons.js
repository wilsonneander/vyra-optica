// Ícones do Bronze do salão: a marca e os ícones da Mecha vêm do Gold (../_build-gold/icons.js);
// aqui entram o logo do lado salão e os ícones pequenos, no traço da marca
// (1.6, pontas arredondadas para combinar com a mecha curva do símbolo, sem biblioteca de ícones).
const G = require('../_build-gold/icons');

const logo = `<span class="logo-marca">${G.simbolo()}<span class="logo-txt"><b>Mecha</b><small>salão</small></span></span>`;

module.exports = {
  ...G,
  logo,
  // pequenos
  telefone: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 5.8 5.8l1.4-2.2 4.4 1.6v3c0 1-.8 2-2 2C10 19.5 4.5 14 4.5 5.5c0-1.2 1-2 2-2Z"/></svg>',
  carta: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7"/></svg>',
  esquerda: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg>',
  direita: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>',
  calendario: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v14.5H4zM4 10h16M8.5 3.5v4M15.5 3.5v4"/></svg>',
  menu: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h10"/></svg>',
};
