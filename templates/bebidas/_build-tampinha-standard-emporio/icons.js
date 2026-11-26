// Ícones do Tampinha Standard Empório. O logo (tampinha coroa com "t") e os ícones base são os do Tampinha Standard,
// a mesma marca; aqui entram só os desenhos novos deste modelo, no mesmo traço (2px, pontas redondas).
const base = require('../_build-tampinha-standard/icons');

const s = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

module.exports = {
  ...base,
  // estrela de avaliação, cheia
  estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7 6.4 19.8l1.3-6.2L3 9.3l6.3-.7Z"/></svg>',
  // aspas de depoimento: duas gotas de chopp
  aspas: '<svg viewBox="0 0 48 36" aria-hidden="true"><path fill="currentColor" d="M4 34V22C4 10 10 3 20 1l2 5c-6 2-9 6-9 12h7v16Zm24 0V22c0-12 6-19 16-21l2 5c-6 2-9 6-9 12h7v16Z"/></svg>',
  menu: s('<path d="M4 7 H20 M4 12 H20 M4 17 H14"/>'),
  calendario: s('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10 H20.5 M8 3 V7 M16 3 V7"/>'),
  chopp: s('<path d="M5 7 H15 V20 A1.5 1.5 0 0 1 13.5 21.5 H6.5 A1.5 1.5 0 0 1 5 20 Z"/><path d="M15 10 H17.5 A2 2 0 0 1 19.5 12 V15 A2 2 0 0 1 17.5 17 H15"/><path d="M5 7 C5 4.5 7 3.5 8.5 4.5 C9.5 3 12 3 13 4.5 C14.5 4 15.5 5.5 15 7"/><path d="M8.5 11 V18 M11.5 11 V18"/>'),
  predio: s('<path d="M4 21 V5 L12 3 V21 M12 9 H20 V21 M2 21 H22"/><path d="M7 8 H9 M7 12 H9 M7 16 H9 M15 13 H17 M15 17 H17"/>'),
  coracao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 20.5 4.3 13a4.8 4.8 0 0 1 6.8-6.8l.9.9.9-.9A4.8 4.8 0 0 1 19.7 13Z"/></svg>',
  diag: s('<path d="M7 17 L17 7 M9 7 H17 V15"/>'),
  aviso: s('<path d="M12 3.5 L21.5 20 H2.5 Z"/><path d="M12 10 V14 M12 17 H12.01"/>'),
};
