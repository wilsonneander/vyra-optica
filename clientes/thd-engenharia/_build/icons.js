// Ícones em SVG (traço 24x24). Herdam a cor do texto (currentColor).
const s = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const f = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="currentColor" aria-hidden="true">${d}</svg>`;

module.exports = {
  // serviços
  outorga: s('<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  antena: s('<path d="M12 12v9"/><path d="M9 21h6"/><circle cx="12" cy="10" r="2"/><path d="M7.8 5.8a6 6 0 0 0 0 8.4M16.2 5.8a6 6 0 0 1 0 8.4"/><path d="M5 3a10 10 0 0 0 0 14M19 3a10 10 0 0 1 0 14"/>'),
  documento: s('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  alerta: s('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'),
  rede: s('<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-5.5 5.5M12 12l5.5 5.5"/>'),
  servidor: s('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6"/>'),
  prancheta: s('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/>'),
  capacete: s('<path d="M3 17h18v2H3z"/><path d="M5 17v-3a7 7 0 0 1 14 0v3"/><path d="M10 7.3V5h4v2.3"/><path d="M12 10v4"/>'),
  calculadora: s('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
  megafone: s('<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1"/><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11"/>'),
  selo: s('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/><path d="m9.5 9 1.7 1.7 3.3-3.4"/>'),
  // gerais
  escudo: s('<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/>'),
  raio: s('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  cadeado: s('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/>'),
  grafico: s('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/><path d="M15 7h5v5"/>'),
  relogio: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  email: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: s('<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12"/><circle cx="12" cy="9" r="2.5"/>'),
  check: s('<path d="m5 12.5 4.5 4.5L19 7.5"/>', ' class="i-check"'),
  seta: s('<path d="M5 12h14M13 6l6 6-6 6"/>', ' class="i-arrow"'),
  sinal: s('<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a5.5 5.5 0 0 1 8 0"/><circle cx="12" cy="18.5" r=".8" fill="currentColor"/>'),
  // marcas
  whatsapp: f('<path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/>'),
  instagram: s('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
  facebook: f('<path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2h-3.1C10.6 2 10 4.5 10 6.1v2.4H7.5V12H10v10h4V12h2.8l.4-3.5z"/>'),
  telegram: f('<path d="M21.4 3.6 2.9 10.7c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.4-1.5M9.6 13.3l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.3z"/>'),
};
