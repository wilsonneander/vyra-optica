// Ícones próprios da Salvi Nutrição: traço de 1.6, pontas arredondadas, folha de sálvia como assinatura.
// Nenhum vem de biblioteca. class="ic" recebe o tamanho no CSS.
const svg = (corpo, vb = '0 0 24 24', extra = '') => `<svg class="ic" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${corpo}</svg>`;

// símbolo: prato (aro duplo) com uma folha de sálvia atravessada e a nervura central
const simbolo = (cls = 'simbolo') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="24" cy="24" r="15.5" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/><path class="folha" d="M14 34c1-10 7-18 20-21-1 12-8 19-20 21Z" fill="var(--folha, currentColor)" stroke="none"/><path d="M15 33c5-6 10-11 16-17" fill="none" stroke="var(--nervura, #fff)" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const logo = (nome = 'Salvi') => `${simbolo()}<span class="logo-txt"><b>${nome}</b><small>nutrição</small></span>`;

module.exports = {
  simbolo,
  logo,
  favicon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#2E4430"/><circle cx="24" cy="24" r="16" fill="none" stroke="#F4EEE4" stroke-width="2.4"/><path d="M15 32c1-9 6-15 17-18-1 10-7 16-17 18Z" fill="#E0703F"/><path d="M16 31c4-5 8-9 13-14" stroke="#F4EEE4" stroke-width="1.5" stroke-linecap="round"/></svg>',
  seta: svg('<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>'),
  setaEsq: svg('<path d="M19 12H6M11 6.5 5.5 12 11 17.5"/>'),
  seta45: svg('<path d="M7 17 17 7M9 7h8v8"/>'),
  whats: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.8 21.4l4.8-1.2A9.3 9.3 0 1 0 12 2.6Zm0 16.9a7.6 7.6 0 0 1-3.9-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A7.6 7.6 0 1 1 12 19.5Zm4.2-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.2 6.2 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/></svg>',
  telefone: svg('<path d="M8.2 3.5 10 7.6 8 9.2a10.5 10.5 0 0 0 6.8 6.8l1.6-2 4.1 1.8-.6 3.4A2 2 0 0 1 18 20.8 16.8 16.8 0 0 1 3.2 6a2 2 0 0 1 1.6-1.9Z"/>'),
  carta: svg('<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/>'),
  pino: svg('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><path d="M9.6 10.4c.4-1.8 1.4-3 3.4-3.4-.2 1.9-1.4 3.1-3.4 3.4Z"/>'),
  insta: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>'),
  face: svg('<path d="M14.5 8.5h2.5V5h-2.5A3.5 3.5 0 0 0 11 8.5V11H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3V9a.5.5 0 0 1 .5-.5Z"/>'),
  youtube: svg('<rect x="2.8" y="5.5" width="18.4" height="13" rx="4"/><path d="m10.3 9.2 4.6 2.8-4.6 2.8Z"/>'),
  fechar: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  mais: svg('<path d="M12 5v14M5 12h14"/>'),
  menu: svg('<path d="M4 8h16M4 16h10"/>'),
  lupa: svg('<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>'),
  relogio: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  video: svg('<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="m15.5 10.5 5-3v9l-5-3"/>'),
  casa: svg('<path d="M4 10.5 12 4l8 6.5V20H4Z"/><path d="M10 20v-5.5h4V20"/>'),
  folha: svg('<path d="M5 19c1-8 5.5-13 15-15-.8 9.5-6 14.2-15 15Z"/><path d="M6 18c3.5-4 7-7.5 11-11"/>'),
  marca: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  baixar: svg('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
  sair: svg('<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h9"/>'),
  copo: svg('<path d="M6 4h12l-1.6 15.2a2 2 0 0 1-2 1.8H9.6a2 2 0 0 1-2-1.8Z"/><path d="M6.6 9.5h10.8"/>'),
  porta: svg('<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M4 21h16"/><path d="M14.5 12h.01"/>'),
  arrastar: svg('<path d="M8 12H3m0 0 2.5-2.5M3 12l2.5 2.5M16 12h5m0 0-2.5-2.5M21 12l-2.5 2.5"/><circle cx="12" cy="12" r="2.4"/>'),
  estrela: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 3.2 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.5l6.1-.7Z"/></svg>',
};
