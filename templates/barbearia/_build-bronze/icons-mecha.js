// Marca e ícones próprios da Mecha Salão & Barbearia (traço 1.6, pontas retas, sem biblioteca de ícones).
// Símbolo: uma mecha curva (o salão) cruza uma lâmina reta (a barbearia), formando um X que lembra uma tesoura aberta.
const simbolo = (cls = '') => `<svg class="simbolo ${cls}" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M25.6 3.4 27.8 5.2 8.6 28.8 6.2 27.2Z" fill="var(--sim-lamina, currentColor)"/>
  <path d="M6.4 3.6C14.8 6.4 9 13.2 15.6 17.2 21.4 20.6 18.6 26 26.4 28.6" fill="none" stroke="var(--sim-mecha, #B98F6C)" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;

const logo = `<span class="logo-marca">${simbolo()}<span class="logo-txt"><b>Mecha</b><small>salão &amp; barbearia</small></span></span>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1F1B18"/>
  <path d="M25.6 3.4 27.8 5.2 8.6 28.8 6.2 27.2Z" fill="#F6F4EF"/>
  <path d="M6.4 3.6C14.8 6.4 9 13.2 15.6 17.2 21.4 20.6 18.6 26 26.4 28.6" fill="none" stroke="#C9A27F" stroke-width="2.6" stroke-linecap="round"/></svg>`;

const s = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${extra}>${d}</svg>`;

// estrela de avaliação com pontas cortadas, no traço reto da marca
const estrela = '<svg class="st" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.2 12.3 7.4 17.9 8 13.7 11.7 14.9 17.3 10 14.4 5.1 17.3 6.3 11.7 2.1 8 7.7 7.4Z"/></svg>';

// aspas desenhadas como duas mechas enroladas
const aspas = '<svg class="aspas" viewBox="0 0 56 40" aria-hidden="true"><path d="M22 4C10 7 4 15 4 25c0 6 4 11 9.5 11S23 32 23 26.5 19 18 14 18c-1.4 0-2.6.3-3.6.8C12 13 16 9.4 23 7.6Z"/><path d="M51 4C39 7 33 15 33 25c0 6 4 11 9.5 11S52 32 52 26.5 48 18 43 18c-1.4 0-2.6.3-3.6.8C41 13 45 9.4 52 7.6Z"/></svg>';

// separador da faixa corrida: o próprio símbolo, pequeno
const sep = `<svg class="sep" viewBox="0 0 32 32" aria-hidden="true"><path d="M25.6 3.4 27.8 5.2 8.6 28.8 6.2 27.2Z" fill="currentColor"/><path d="M6.4 3.6C14.8 6.4 9 13.2 15.6 17.2 21.4 20.6 18.6 26 26.4 28.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity=".55"/></svg>`;

module.exports = {
  simbolo, logo, favicon, estrela, aspas, sep,
  seta: s('<path d="M4.5 12h14M13.5 6.5 19 12l-5.5 5.5"/>'),
  diag: s('<path d="M7 17 17 7M9 6.5h8.5V15"/>'),
  mais: s('<path d="M12 5.5v13M5.5 12h13"/>'),
  menos: s('<path d="M5.5 12h13"/>'),
  fechar: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  arrasta: s('<path d="M9.5 7 4.5 12l5 5M14.5 7l5 5-5 5"/>'),
  pino: s('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 2"/>'),
  whats: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3Z"/></svg>',
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>', ' stroke-linecap="round" stroke-linejoin="round"'),
  face: s('<path d="M14.5 8.5H16V5.6h-2c-2.3 0-3.5 1.4-3.5 3.6v1.6H8.4v2.9h2.1V20h3v-6.3h2.2l.4-2.9h-2.6V9.5c0-.6.3-1 1-1Z"/>', ' stroke-linecap="round" stroke-linejoin="round"'),
  linkedin: s('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16"/>', ' stroke-linecap="round" stroke-linejoin="round"'),
};
