// Ícones próprios da THD: traço reto, cantos vivos e nós de circuito (como as trilhas dentro das letras do logo).
// Herdam a cor do texto (currentColor). Os logos de redes sociais são as marcas oficiais.
const s = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${extra}>${d}</svg>`;
const f = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="currentColor" aria-hidden="true">${d}</svg>`;
const node = (x, y) => `<rect x="${x - 1.6}" y="${y - 1.6}" width="3.2" height="3.2" fill="currentColor" stroke="none"/>`;

module.exports = {
  // seta em trilha: linha reta que termina em um bloco
  seta: s(`<path d="M3 12h13"/><path d="M14 6.5 19.5 12 14 17.5"/>`, ' class="i-arrow"'),
  // mais / menos para os acordeões
  mais: s(`<path d="M12 4v16M4 12h16"/>`, ' class="i-plus"'),
  // envelope desenhado como placa de circuito
  email: s(`<path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/>${node(12, 13)}`),
  // marcador de local com o sinal do logo
  pin: s(`<path d="M12 21 5.5 12.5A7 7 0 1 1 18.5 12.5z"/>${node(12, 9.5)}`),
  relogio: s(`<path d="M4 4h16v16H4z"/><path d="M12 7.5V12h4"/>${node(12, 12)}`),
  sinal: s(`<path d="M6 10a8.5 8.5 0 0 1 12 0"/><path d="M8.8 13.2a4.5 4.5 0 0 1 6.4 0"/>${node(12, 17)}`),
  // marcas
  whatsapp: f('<path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/>'),
  instagram: s('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>', ''),
  facebook: f('<path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2h-3.1C10.6 2 10 4.5 10 6.1v2.4H7.5V12H10v10h4V12h2.8l.4-3.5z"/>'),
  telegram: f('<path d="M21.4 3.6 2.9 10.7c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.4-1.5M9.6 13.3l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.3z"/>'),
};
