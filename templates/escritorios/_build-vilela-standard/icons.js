// Ícones próprios do Vilela Standard: traço de 1,5 com pontas arredondadas, cantos em arco, como o emblema.
// Nada de biblioteca de ícones. Todos usam currentColor.
const svg = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// emblema: arco de portal com a balança dentro (o travessão gira no carregando e na 404)
const emblema = (cls = '') => `<svg class="emblema ${cls}" viewBox="0 0 64 72" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path pathLength="1" class="em-arco" d="M6 70V30a26 26 0 0 1 52 0v40"/>
  <path pathLength="1" class="em-base" d="M22 62h20M32 24v38"/>
  <g class="em-travessao"><path pathLength="1" d="M16 28h32"/>
    <g class="em-prato em-prato-e"><path pathLength="1" d="M16 28l-6 14M16 28l6 14"/><path pathLength="1" d="M8.5 42a7.5 4 0 0 0 15 0Z"/></g>
    <g class="em-prato em-prato-d"><path pathLength="1" d="M48 28l-6 14M48 28l6 14"/><path pathLength="1" d="M40.5 42a7.5 4 0 0 0 15 0Z"/></g>
  </g>
  <circle cx="32" cy="22" r="2.4" fill="currentColor" stroke="none"/>
</svg>`;

const I = {
  dir: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  esq: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  baixo: svg('<path d="M6 9l6 6 6-6"/>'),
  mais: svg('<path d="M12 5v14M5 12h14"/>'),
  fechar: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  menu: svg('<path d="M4 8h16M4 16h10"/>'),
  pino: svg('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  rota: svg('<path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M8 17h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>'),
  fone: svg('<path d="M7.6 3.5 5 4.3a1.8 1.8 0 0 0-1.2 2c1.1 7 6.9 12.8 13.9 13.9a1.8 1.8 0 0 0 2-1.2l.8-2.6-4-2.2-2 2a11 11 0 0 1-5.6-5.6l2-2Z"/>'),
  email: svg('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M4.5 7.5 12 13l7.5-5.5"/>'),
  relogio: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  video: svg('<rect x="3.5" y="6.5" width="12" height="11" rx="3"/><path d="M15.5 10.5 20.5 8v8l-5-2.5"/>'),
  predio: svg('<path d="M5 20.5V6.5L12 3l7 3.5v14M3.5 20.5h17M9 9.5h.01M15 9.5h.01M9 13.5h.01M15 13.5h.01M10.5 20.5v-3h3v3"/>'),
  doc: svg('<path d="M7 3.5h7l4 4v13H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h4"/>'),
  cadeado: svg('<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2"/>'),
  pena: svg('<path d="M19.5 4.5c-6 0-11 4-12 11l-3 4M7.5 15.5c5 0 9.5-3 12-11"/><path d="M11 12h4"/>'),
  paragrafo: svg('<path d="M14.5 5.5A3.5 3.5 0 1 0 11 9M9.5 18.5A3.5 3.5 0 1 0 13 15M11 9c3.5 0 5 1.5 5 3s-1.5 3-3 3c-3.5 0-5-1.5-5-3s1.5-3 3-3"/>'),
  insta: svg('<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>'),
  linkedin: svg('<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M8.5 10.5v5M8.5 8h.01M12 15.5v-5M12 13c0-1.7 1-2.6 2.2-2.6s1.8.8 1.8 2.3v2.8"/>'),
  aspas: '<svg class="ic" viewBox="0 0 32 24" fill="currentColor" aria-hidden="true"><path d="M0 24V14C0 6.3 4 1.6 11.5 0l1.3 2.8C8.6 4.3 6.7 7 6.5 10.5H12V24Zm19 0V14c0-7.7 4-12.4 11.5-14l1.3 2.8c-4.2 1.5-6.1 4.2-6.3 7.7H31V24Z"/></svg>',
  // WhatsApp desenhado para o build: balão com o fone dentro
  whats: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 19.8l1.1-4A8.3 8.3 0 1 1 8.6 19Z"/><path d="M9.3 8.2c.3-.4.9-.5 1.2-.1l.8 1.4c.2.3.1.7-.1 1l-.5.5a5.6 5.6 0 0 0 2.4 2.4l.5-.5c.3-.2.7-.3 1-.1l1.4.8c.4.3.3.9-.1 1.2-.7.6-1.6.8-2.5.4a8.3 8.3 0 0 1-4.5-4.5c-.4-.9-.2-1.8.4-2.5Z"/></svg>',
};

module.exports = { I, emblema };
