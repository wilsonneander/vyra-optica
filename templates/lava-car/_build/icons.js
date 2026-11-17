// Logo e ícones desenhados para a Garoa Lava Car (traço arredondado, 1.8px, cantos suaves).
// Nada de biblioteca de ícones: tudo aqui é SVG próprio.
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;

// gota com o carro vazado dentro
const gota = `<svg class="logo-gota" viewBox="0 0 40 48" aria-hidden="true" focusable="false">
  <path class="g-corpo" d="M20 1.5C17.6 4.6 4.5 19.6 4.5 31a15.5 15.5 0 0 0 31 0C35.5 19.6 22.4 4.6 20 1.5Z"/>
  <path class="g-carro" d="M9.6 35.2h20.8v-3.6c0-1.1-.8-2-1.9-2.2l-3.2-.6-2.8-3.3c-.5-.6-1.3-1-2.1-1h-5.4c-.8 0-1.6.4-2.1 1l-2.6 3.3-1 .3c-1 .3-1.7 1.2-1.7 2.2v3.9Z"/>
  <circle class="g-roda" cx="14.6" cy="35.4" r="2.7"/><circle class="g-roda" cx="25.4" cy="35.4" r="2.7"/>
  <path class="g-brilho" d="M12.6 21.5c1.2-2.6 3-5.3 4.8-7.6" fill="none" stroke-width="2" stroke-linecap="round"/>
</svg>`;

module.exports = {
  gota,
  logo: `${gota}<span class="logo-txt"><b>garoa</b><small>lava car</small></span>`,
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48"><path fill="#1F5EFF" d="M20 1.5C17.6 4.6 4.5 19.6 4.5 31a15.5 15.5 0 0 0 31 0C35.5 19.6 22.4 4.6 20 1.5Z"/><path fill="#fff" d="M9.6 35.2h20.8v-3.6c0-1.1-.8-2-1.9-2.2l-3.2-.6-2.8-3.3c-.5-.6-1.3-1-2.1-1h-5.4c-.8 0-1.6.4-2.1 1l-2.6 3.3-1 .3c-1 .3-1.7 1.2-1.7 2.2v3.9Z"/><circle fill="#1F5EFF" cx="14.6" cy="35.4" r="2.7"/><circle fill="#1F5EFF" cx="25.4" cy="35.4" r="2.7"/></svg>`,

  // gotinha usada como marcador de lista e separador do letreiro
  pingo: `<svg class="pingo" viewBox="0 0 12 16" aria-hidden="true" focusable="false"><path d="M6 .8C5 2.3.9 7.4.9 10.6a5.1 5.1 0 0 0 10.2 0C11.1 7.4 7 2.3 6 .8Z" fill="currentColor"/></svg>`,

  seta: s('<path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5"/>'),
  setaDiag: s('<path d="M7 17 17 7M8.5 7H17v8.5"/>'),
  esq: s('<path d="M14.5 5.5 8 12l6.5 6.5"/>'),
  dir: s('<path d="M9.5 5.5 16 12l-6.5 6.5"/>'),
  ok: s('<path d="M5 12.5l4.2 4L19 7"/>', ' class="ok"'),
  mais: s('<path d="M12 5v14M5 12h14"/>'),
  fone: s('<path d="M7.6 3.5h-2a1.6 1.6 0 0 0-1.6 1.8 16.6 16.6 0 0 0 14.7 14.7 1.6 1.6 0 0 0 1.8-1.6v-2a1.6 1.6 0 0 0-1.2-1.6l-2.7-.7a1.6 1.6 0 0 0-1.6.5l-1 1.1a12.6 12.6 0 0 1-5.6-5.6l1.1-1a1.6 1.6 0 0 0 .5-1.6L9.2 4.7a1.6 1.6 0 0 0-1.6-1.2Z"/>'),
  pino: s('<path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11Z"/><path d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"/>'),
  relogio: s('<path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"/><path d="M12 7.5V12l3 2"/>'),
  email: s('<path d="M4 6.5h16v11H4z"/><path d="m4.5 7 7.5 6 7.5-6"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.6v12.8c0 .8.9 1.3 1.6.8l9.4-6.4c.6-.4.6-1.2 0-1.6L9.6 4.8C8.9 4.3 8 4.8 8 5.6Z" fill="currentColor"/></svg>',
  pausa: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></svg>',
  // estrela de avaliação com pontas arredondadas
  estrela: '<svg class="estrela" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8l2.6 5.6 6 .7c.6.1.9.9.4 1.3l-4.5 4.1 1.2 6c.1.7-.6 1.2-1.2.8L12 18.4l-5.3 2.9c-.6.4-1.4-.1-1.2-.8l1.2-6L2.2 10.4c-.5-.4-.2-1.2.4-1.3l6-.7L11.2 2.8c.3-.6 1.2-.6 1.4 0Z" fill="currentColor"/></svg>',
  aspas: '<svg class="aspas" viewBox="0 0 48 36" aria-hidden="true" focusable="false"><path d="M4 36V22C4 10 10 2.5 20 0l2 5c-5.5 2-8.6 6-9 12h8v19H4Zm24 0V22c0-12 6-19.5 16-22l2 5c-5.5 2-8.6 6-9 12h8v19H28Z" fill="currentColor"/></svg>',
  // rodo: cabo e borracha, usado na abertura da capa e no puxador do antes e depois
  rodo: '<svg class="rodo" viewBox="0 0 40 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect x="14" y="0" width="12" height="400" rx="3" fill="#0A1322"/><rect x="24" y="0" width="5" height="400" rx="2" fill="#FFC93C"/></svg>',
  menu: s('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  fechar: s('<path d="M6 6l12 12M18 6 6 18"/>'),

  whats: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8ZM20.4 3.6A11.8 11.8 0 0 0 1.9 17.9L.2 24l6.3-1.6A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.6-8.4Z"/></svg>',
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z"/><path d="M17.2 6.9h.01" stroke-width="2.6"/>'),
  face: s('<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.5-1.5h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H9v3h2.5V21"/>'),
  youtube: s('<path d="M21 8.2c-.2-1.4-1.1-2.3-2.5-2.5C16.6 5.4 12 5.4 12 5.4s-4.6 0-6.5.3C4.1 5.9 3.2 6.8 3 8.2 2.7 10 2.7 12 2.7 12s0 2 .3 3.8c.2 1.4 1.1 2.3 2.5 2.5 1.9.3 6.5.3 6.5.3s4.6 0 6.5-.3c1.4-.2 2.3-1.1 2.5-2.5.3-1.8.3-3.8.3-3.8s0-2-.3-3.8Z"/><path d="m10.2 14.8 4.6-2.8-4.6-2.8v5.6Z" fill="currentColor"/>'),
};
