// Ícones próprios do Taioba (traço de 1.6, pontas arredondadas, como desenho de caderno de receitas).
// Nada de biblioteca de ícones: tudo desenhado aqui.
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// a folha de taioba: larga, em ponta de flecha, com a nervura central e as laterais
const folha = (cor = 'currentColor', nerv = 'var(--papel, #F4EEE1)') => `<svg class="folha" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 44c-1-4-1.2-7.4-.6-10.4C14 33 6 27.4 5 17.6 4.6 13.4 6 9.6 8.4 7.2c3.4 3.2 8.4 5.4 15.6 5.6 7.2-.2 12.2-2.4 15.6-5.6 2.4 2.4 3.8 6.2 3.4 10.4-1 9.8-9 15.4-18.4 16-.6 3-.4 6.4.6 10.4" fill="${cor}"/><path d="M24 33.6V13M24 20.4l-8.6-6.2M24 20.4l8.6-6.2M24 26.6l-11-4.4M24 26.6l11-4.4" stroke="${nerv}" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;

module.exports = {
  folha,
  logo: `<span class="logo-marca">${folha('var(--folha-logo)', 'var(--fundo-logo)')}<span class="logo-txt"><b>Taioba</b><small>bar e cozinha mineira</small></span></span>`,
  diag: s('<path d="M7 17 17 7M9 7h8v8"/>'),
  seta: s('<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>'),
  esquerda: s('<path d="M15 5.5 8.5 12l6.5 6.5"/>'),
  direita: s('<path d="m9 5.5 6.5 6.5L9 18.5"/>'),
  menu: s('<path d="M4 7.5h16M4 12h11M4 16.5h16"/>'),
  fechar: s('<path d="m6 6 12 12M18 6 6 18"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 2"/>'),
  pessoas: s('<circle cx="9" cy="8.6" r="3"/><path d="M3.6 19c.6-3.2 2.7-5 5.4-5s4.8 1.8 5.4 5"/><path d="M15.6 6.2a2.8 2.8 0 1 1 0 5.4M17.4 14.4c1.6.6 2.6 2.2 3 4.6"/>'),
  pessoa: s('<circle cx="12" cy="8.4" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>'),
  pino: s('<path d="M12 21s-6.4-6-6.4-11a6.4 6.4 0 0 1 12.8 0c0 5-6.4 11-6.4 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  calendario: s('<rect x="4" y="5.6" width="16" height="14.4" rx="1.6"/><path d="M4 10h16M8.4 3.6v4M15.6 3.6v4"/>'),
  panela: s('<path d="M4 10.4h16v4.4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M2.4 10.4H4M20 10.4h1.6M9 7.2c0-1.4 1.2-1.4 1.2-2.8M13.6 7.2c0-1.4 1.2-1.4 1.2-2.8"/>'),
  broto: s('<path d="M12 20.4v-8.6"/><path d="M12 12.4C12 8.2 9 5.6 4.8 5.6c0 4.2 3 6.8 7.2 6.8ZM12 14.6c0-3.6 2.6-6 6.4-6 0 3.6-2.6 6-6.4 6Z"/>'),
  sair: s('<path d="M14.4 4.4H18a1.6 1.6 0 0 1 1.6 1.6v12a1.6 1.6 0 0 1-1.6 1.6h-3.6M10 16.4 5.6 12 10 7.6M5.6 12h10"/>'),
  baixar: s('<path d="M12 4v11M7.4 10.6 12 15.2l4.6-4.6M5 19.6h14"/>'),
  lixo: s('<path d="M5 7h14M10 7V5h4v2M7 7l.8 12.2c.1.9.8 1.4 1.6 1.4h5.2c.8 0 1.5-.5 1.6-1.4L17 7"/>'),
  mais: s('<path d="M12 5v14M5 12h14"/>'),
  menos: s('<path d="M5 12h14"/>'),
  sacola: s('<path d="M5.4 8.2h13.2l-1 11.4H6.4Z"/><path d="M9 10.4V7a3 3 0 0 1 6 0v3.4"/>'),
  insta: s('<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.6"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>', ' class="ic-insta"'),
  coracao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.6-4.6-7.6-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.6 2.4C19.6 15.4 12 20 12 20Z" fill="currentColor"/></svg>',
  estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.4 2.6 5.5 6 .7-4.4 4.1 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.1 6-.7Z" fill="currentColor"/></svg>',
  aspas: '<svg viewBox="0 0 48 36" aria-hidden="true"><path d="M3 34V21C3 10 8.6 3.4 19 2l1.2 4.6C14.4 8.2 11.4 12 11 18h8v16Zm25 0V21C28 10 33.6 3.4 44 2l1.2 4.6C39.4 8.2 36.4 12 36 18h8v16Z" fill="currentColor"/></svg>',
  ampliar: s('<path d="M14 4h6v6M10 20H4v-6M20 4l-6.6 6.6M4 20l6.6-6.6"/>'),
  whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.7 21.4l4.8-1.3A9.3 9.3 0 1 0 12 2.6Zm0 17a7.7 7.7 0 0 1-3.9-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.6Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z"/></svg>',
};
