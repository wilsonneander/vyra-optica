// Ícones do Bronze do salão: a marca e os ícones da Mecha vêm do Gold (../_build-gold/icons.js);
// aqui entram o logo do lado salão e os desenhos próprios dos atalhos de serviço, no traço da marca
// (1.6, pontas arredondadas para combinar com a mecha curva do símbolo, sem biblioteca de ícones).
const G = require('../_build-gold/icons');

// ícones grandes dos atalhos (viewBox 48): traço da cor do texto e um toque de rosa em --ic-tom
const g = (d) => `<svg class="ic-at" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const tom = 'stroke="var(--ic-tom)"';

const logo = `<span class="logo-marca">${G.simbolo()}<span class="logo-txt"><b>Mecha</b><small>salão</small></span></span>`;

module.exports = {
  ...G,
  logo,
  // atalhos
  tesoura: g(`<circle cx="14" cy="34" r="5.5"/><circle cx="26" cy="38" r="5.5"/><path d="M18 30 36 7M22 33.5 38 14"/><path ${tom} d="M30 23.5c3.5 1.2 7 4 8.5 8.5"/>`),
  secador: g(`<path d="M8 14.5c0-4 3.3-7 7.5-7H28c5 0 9 4 9 9s-4 9-9 9h-5.5l-2 15h-6l1.5-15.5C11 24 8 19.5 8 14.5Z"/><circle cx="18" cy="16.5" r="3.5"/><path ${tom} d="M40 12c1.6 1.4 1.6 7.6 0 9M43.5 9c2.6 2.6 2.6 12.4 0 15"/>`),
  pincel: g(`<path d="M9 27h22l-2.5 12.5h-17Z"/><path d="M7 27h26"/><path d="M27 23 40 8.5"/><path d="M36.5 6.5 42 12"/><path ${tom} d="M13 32.5c3 1.5 9.5 1.5 13 0"/>`),
  mecha: g(`<path d="M15 6c-6 9 6 13-1 22-4 5-1 11 4 14"/><path d="M23 6c-6 9 6 13-1 22-4 5-1 11 4 14"/><path ${tom} d="M31 6c-6 9 6 13-1 22-4 5-1 11 4 14"/><path d="M33.5 15.5 41 13l1.5 7-7.5 2.5"/>`),
  pote: g(`<path d="M11 19h26v15c0 4-3 7-7 7H18c-4 0-7-3-7-7Z"/><path d="M9.5 13h29v6h-29Z"/><path ${tom} d="M24 25c2.5 3 3.5 4.5 3.5 6.2a3.5 3.5 0 0 1-7 0c0-1.7 1-3.2 3.5-6.2Z"/>`),
  prancha: g(`<path d="M10 39 30.5 8.5c1-1.5 3-1.8 4.4-.8s1.8 3 .8 4.4L15 42.5"/><path d="M15.5 40.5 36 10"/><path d="M10 39l-3 4.5M15 42.5l-3 4"/><path ${tom} d="M38 26c2 3 2 7 0 10M42 23c3 4.5 3 11.5 0 16"/>`),
  // pequenos
  telefone: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 5.8 5.8l1.4-2.2 4.4 1.6v3c0 1-.8 2-2 2C10 19.5 4.5 14 4.5 5.5c0-1.2 1-2 2-2Z"/></svg>',
  carta: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7"/></svg>',
  esquerda: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg>',
  direita: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>',
  calendario: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v14.5H4zM4 10h16M8.5 3.5v4M15.5 3.5v4"/></svg>',
  menu: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h10"/></svg>',
};
