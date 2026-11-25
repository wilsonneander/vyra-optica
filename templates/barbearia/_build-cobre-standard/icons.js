// Desenhos próprios da Cobre Barbearia (sem biblioteca de ícones). Traço 1.6, pontas retas, cantos vivos.
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${extra}>${d}</svg>`;

// símbolo: navalha aberta formando um "C" dentro de um losango cortado
const simbolo = `<svg class="simbolo" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 38 20 20 38 2 20Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M26.5 14.2a8.6 8.6 0 1 0 0 11.6" fill="none" stroke="var(--cobre, #F0AD73)" stroke-width="3.4"/><path d="M25.6 20h7" stroke="var(--cobre, #F0AD73)" stroke-width="2.2"/></svg>`;

module.exports = {
  simbolo,
  logo: `<span class="logo-in">${simbolo}<span class="logo-txt"><b>Cobre</b><small>Barbearia</small></span></span>`,
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#111"/><path d="M20 4 36 20 20 36 4 20Z" fill="none" stroke="#fff" stroke-width="2"/><path d="M26.5 14.2a8.6 8.6 0 1 0 0 11.6" fill="none" stroke="#F0AD73" stroke-width="3.4"/><path d="M25.6 20h6" stroke="#F0AD73" stroke-width="2.2"/></svg>`,
  // navalha fechada, separador da faixa corrida
  navalha: `<svg class="ic-navalha" viewBox="0 0 48 16" aria-hidden="true"><path d="M2 9.5h26l4-3.5h14v4H32l-4 3.5H2Z" fill="currentColor"/><circle cx="30.5" cy="8" r="1.4" fill="var(--fundo, #111)"/></svg>`,
  tesoura: s('<circle cx="6" cy="17.5" r="2.8"/><circle cx="17.5" cy="17.5" r="2.8"/><path d="M8 15.4 18.5 3.5M15.5 15.4 5 3.5"/>'),
  pente: s('<path d="M3 8h18v4H3Z"/><path d="M5 12v6M8 12v6M11 12v6M14 12v5M17 12v4M20 12v3"/>'),
  pino: s('<path d="M12 21.5s-6.5-6.3-6.5-11.2a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11.2-6.5 11.2Z"/><path d="M12 8v4.6"/>'),
  seta: s('<path d="M5 19 19 5M8.5 5H19v10.5"/>'),
  setaDir: s('<path d="M3.5 12h16M13.5 5.5l6.5 6.5-6.5 6.5"/>'),
  setaEsq: s('<path d="M20.5 12h-16M10.5 5.5 4 12l6.5 6.5"/>'),
  relogio: s('<path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z"/><path d="M12 7.5V12l3.2 2.2"/>'),
  agenda: s('<path d="M3.5 6h17v14.5h-17Z"/><path d="M3.5 10.5h17M8 3.5V7M16 3.5V7"/><path d="M7.5 14.5h3v3h-3Z" fill="currentColor" stroke="none"/>'),
  telefone: s('<path d="M7.2 3.5 4 4.3c-.5 6.8 5.9 13.7 15.7 15.7l.8-3.2-4.2-2-2 1.9c-2.4-1-4.6-3.2-5.6-5.6l1.9-2Z"/>'),
  whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.6a7.9 7.9 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A7.9 7.9 0 1 1 12 19.8Zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.1 1.7 2.6 4.1 3.7 1.5.6 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.6Z"/></svg>',
  insta: s('<path d="M4 4h16v16H4Z"/><path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z"/><path d="M16.8 6.6h.4"/>'),
  face: s('<path d="M14 21V13h3l.5-3.4H14V7.7c0-1 .3-1.7 1.8-1.7h1.8V3a24 24 0 0 0-2.6-.1c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.8V13h2.9v8"/>'),
  coracao: s('<path d="M12 20s-8-4.8-8-10.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.6C20 15.2 12 20 12 20Z"/>'),
  balao: s('<path d="M4 4.5h16v11.5H10l-4.5 3.5V16H4Z"/>'),
  estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.7 6 6.5.6-4.9 4.4 1.4 6.4L12 16.9l-5.7 3.3 1.4-6.4-4.9-4.4 6.5-.6Z"/></svg>',
  fechar: s('<path d="M5 5l14 14M19 5 5 19"/>'),
  menu: s('<path d="M3.5 7h17M3.5 12h17M9.5 17h11"/>'),
  mais: s('<path d="M12 4.5v15M4.5 12h15"/>'),
  check: s('<path d="m4.5 12.5 4.8 4.5L19.5 7"/>'),
  aspas: '<svg viewBox="0 0 40 30" aria-hidden="true"><path fill="currentColor" d="M0 30V18C0 7.6 5.3 1.6 15.8 0l1.4 4.4C11.5 6 8.6 9.4 8.2 14.6H16V30Zm23 0V18C23 7.6 28.3 1.6 38.8 0l1.2 4.4c-5.7 1.6-8.6 5-9 10.2H39V30Z"/></svg>',
  lupa: s('<path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z"/><path d="m15.6 15.6 4.9 4.9"/>'),
  // toalha dobrada, usada no selo de higiene
  toalha: s('<path d="M4 6h16v5H4Z"/><path d="M4 11v7h16v-7M8 11v7M4 14.5h4"/>'),
};
