// Ícones do Mecha Premium Vinho: marca e ícones pequenos vêm do Standard Terracota (mesma empresa).
// Aqui entram só os novos, no mesmo traço 1.6 de pontas arredondadas, desenhados à mão (sem biblioteca de ícones).
const B = require('../_build-mecha-standard-terracota/icons');

const s = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

module.exports = {
  ...B,
  // ramo de louros em volta da nota (o da direita é espelhado no CSS)
  ramo: '<svg class="ramo" viewBox="0 0 24 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M17 45C7 38 5 24 11 6"/><path d="M12.5 36c-4 .3-6.5-1.6-7.5-4.5 3.4-.4 6 1 7.5 4.5ZM10 28c-3.6-.8-5.4-3.2-5.6-6.2 3.2.3 5.3 2.4 5.6 6.2ZM9.6 19.6C6.6 18 5.6 15.2 6.2 12.4c2.8 1 4.2 3.6 3.4 7.2ZM11 11.4C9 9 9 6.2 10.6 3.8c2 2.1 2.2 4.8.4 7.6ZM14 41.5c-1.2 3.6-3.8 5-6.8 4.8 1-3.2 3.4-4.8 6.8-4.8Z"/></svg>',
  // duas setas em volta, para "virar a carta"
  vira: s('<path d="M5 9.5A7.5 7.5 0 0 1 18.2 7M19 14.5A7.5 7.5 0 0 1 5.8 17"/><path d="M18.6 3.6 18.2 7l-3.4-.4M5.4 20.4l.4-3.4 3.4.4"/>'),
  tiktok: s('<path d="M14 4.5v10.2a3.8 3.8 0 1 1-3.8-3.8"/><path d="M14 4.5c.4 2.6 2.2 4.3 5 4.5"/>'),
};
