// Ícones do Silver do salão: marca, logo do lado salão e ícones pequenos vêm do Bronze (que reaproveita o Gold).
// Aqui entram os que só o Silver usa (Instagram, galeria, painel da Área do cliente), no mesmo traço 1.6
// de pontas arredondadas, desenhados à mão (sem biblioteca de ícones).
const B = require('../_build-mecha-standard/icons');

const s = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

module.exports = {
  ...B,
  relogio: s('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 2"/>'),
  seta: s('<path d="M4.5 12h14M13.5 6.5 19 12l-5.5 5.5"/>'),
  // Instagram: coração em gota, balão com cauda curva e a seta de compartilhar
  coracao: s('<path d="M12 19.5S4.5 15 4.5 9.6A4 4 0 0 1 12 7.8a4 4 0 0 1 7.5 1.8C19.5 15 12 19.5 12 19.5Z"/>'),
  balao: s('<path d="M5 17.5 6 14A7.3 7.3 0 1 1 9 17.2Z"/>'),
  grade: s('<path d="M4.5 4.5h15v15h-15zM9.5 4.5v15M14.5 4.5v15M4.5 9.5h15M4.5 14.5h15"/>'),
  ampliar: s('<path d="M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5 13.5 10.5M4.5 19.5l6-6"/>'),
  // painel
  pessoa: s('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 19.5c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
  sair: s('<path d="M14 4.5H6.5v15H14M10.5 12h9M16 8.5l3.5 3.5-3.5 3.5"/>'),
  lapis: s('<path d="M15.5 5.5l3 3L9 18l-4 1 1-4Z"/>'),
  lixo: s('<path d="M5 7h14M9.5 7V4.8h5V7M7 7l.9 12.2h8.2L17 7"/>'),
  olho: s('<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.8"/>'),
  olhoFechado: s('<path d="M4 4.5l16 15M9.8 6.1A9.4 9.4 0 0 1 12 5.8c5.8 0 9.2 6.2 9.2 6.2a16 16 0 0 1-2.6 3.3M6.4 7.7A16 16 0 0 0 2.8 12s3.4 6.2 9.2 6.2a9 9 0 0 0 4-.9"/>'),
  sobe: s('<path d="M12 18.5v-13M7 10l5-4.5 5 4.5"/>'),
  desce: s('<path d="M12 5.5v13M7 14l5 4.5 5-4.5"/>'),
  foto: s('<path d="M4 7.5h3.2L9 5h6l1.8 2.5H20v11H4z"/><circle cx="12" cy="12.8" r="3.2"/>'),
  loja: s('<path d="M4.5 9.5 6 4.5h12l1.5 5M4.5 9.5h15M5.5 9.5v10h13v-10M9.5 19.5v-5h5v5"/>'),
  tesoura: s('<circle cx="7" cy="17" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M8.8 15.1 18 4.5M15.2 15.1 6 4.5"/>'),
  frasco: s('<path d="M10 3.5h4v3h-4zM9 6.5h6l1.5 3v10h-9v-10Z"/><path d="M7.5 12.5h9"/>'),
  predio: s('<path d="M5.5 20V5.5h9V20M14.5 9.5h4V20M3.5 20h17M8.5 9h3M8.5 12.5h3M8.5 16h3"/>'),
  refaz: s('<path d="M5.5 12a6.5 6.5 0 1 0 2-4.7M5 4.5V8h3.5"/>'),
};
