// Ícones próprios do Prumo Premium: traço de 1,6, pontas retas e cantos vivos, como a régua e o prumo.
// Nada de biblioteca de ícones. Todos usam currentColor.
const svg = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${extra}>${d}</svg>`;

// emblema: a barra de apoio, o fio e o peso do prumo (o peso balança no carregando, na cortina e na 404)
const emblema = (cls = '') => `<svg class="emblema ${cls}" viewBox="0 0 32 44" fill="none" aria-hidden="true">
  <path class="em-barra" d="M6 3h20" stroke="currentColor" stroke-width="3"/>
  <g class="em-pendulo"><path class="em-fio" d="M16 3v22" stroke="currentColor" stroke-width="2"/>
    <path class="em-peso" d="M16 24l7 8-7 11-7-11Z" fill="var(--em-peso, currentColor)"/></g>
</svg>`;

const I = {
  dir: svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  esq: svg('<path d="M20 12H5M11 6l-6 6 6 6"/>'),
  diag: svg('<path d="M7 17L17 7M9 7h8v8"/>'),
  baixo: svg('<path d="M6 9l6 6 6-6"/>'),
  mais: svg('<path d="M12 5v14M5 12h14"/>'),
  fechar: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  menu: svg('<path d="M4 8h16M4 16h11"/>'),
  pino: svg('<path d="M12 21l-6-8.5A6.5 6.5 0 1 1 18 12.5Z"/><path d="M12 7.5v3"/>'),
  rota: svg('<path d="M5 19h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h10"/><path d="M16 1l3 2-3 2"/>'),
  fone: svg('<path d="M8 3.5H5.5a1.5 1.5 0 0 0-1.5 1.6C4.6 13 11 19.4 18.9 20a1.5 1.5 0 0 0 1.6-1.5V16l-4-1.5-2 2a11 11 0 0 1-5.5-5.5l2-2Z"/>'),
  email: svg('<path d="M3.5 5.5h17v13h-17z"/><path d="M3.5 6l8.5 7 8.5-7"/>'),
  relogio: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4"/>'),
  video: svg('<path d="M3.5 6.5h12v11h-12z"/><path d="M15.5 10.5l5-3v9l-5-3"/>'),
  predio: svg('<path d="M4 20.5h16M6 20.5V4h8v16.5M14 9h4v11.5M9 7.5h2M9 11h2M9 14.5h2"/>'),
  doc: svg('<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h4"/>'),
  cadeado: svg('<path d="M5.5 10.5h13v10h-13z"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3M12 14v3"/>'),
  calendario: svg('<path d="M4 6h16v14.5H4zM4 10.5h16M8.5 3.5V8M15.5 3.5V8"/>'),
  grafico: svg('<path d="M4 20.5h16M7 17v-5M12 17V7M17 17v-8"/>'),
  insta: svg('<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>'),
  linkedin: svg('<path d="M4 4h16v16H4z"/><path d="M8.5 10.5v5M8.5 8h.01M12 15.5v-5M12 13c0-1.7 1-2.6 2.2-2.6s1.8.8 1.8 2.3v2.8"/>'),
  aspas: '<svg class="ic" viewBox="0 0 32 24" fill="currentColor" aria-hidden="true"><path d="M0 24V13L7 0h5L8 12h5v12Zm18 0V13l7-13h5l-4 12h5v12Z"/></svg>',
  // WhatsApp desenhado para o build: balão com o fone dentro
  whats: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 19.8l1.1-4A8.3 8.3 0 1 1 8.6 19Z"/><path d="M9.3 8.2c.3-.4.9-.5 1.2-.1l.8 1.4c.2.3.1.7-.1 1l-.5.5a5.6 5.6 0 0 0 2.4 2.4l.5-.5c.3-.2.7-.3 1-.1l1.4.8c.4.3.3.9-.1 1.2-.7.6-1.6.8-2.5.4a8.3 8.3 0 0 1-4.5-4.5c-.4-.9-.2-1.8.4-2.5Z"/></svg>',
};

module.exports = { I, emblema };
