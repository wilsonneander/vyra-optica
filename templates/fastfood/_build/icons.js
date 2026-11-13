// Logo e ícones desenhados para a Monta Burger: traço grosso e redondo, cantos macios,
// no mesmo jeito do símbolo (pão em cúpula, queijo escorrendo, carne e pão de baixo).
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// símbolo: burger empilhado que forma um "M" na carne
const simbolo = `<svg class="simbolo" viewBox="0 0 64 56" aria-hidden="true">
  <path d="M6 24c0-12 11.6-19 26-19s26 7 26 19c0 1.7-1.3 3-3 3H9c-1.7 0-3-1.3-3-3z" fill="#E3262B"/>
  <g fill="#FFF3E6"><ellipse cx="22" cy="13" rx="2.2" ry="1.3" transform="rotate(-20 22 13)"/><ellipse cx="33" cy="10" rx="2.2" ry="1.3"/><ellipse cx="43" cy="14" rx="2.2" ry="1.3" transform="rotate(20 43 14)"/><ellipse cx="28" cy="19" rx="2" ry="1.2"/><ellipse cx="38" cy="20" rx="2" ry="1.2"/></g>
  <path d="M5 30h54l-4 5c-1.6 2-3.8 2-5.4 0l-1.2-1.5-2.4 4.5c-1.2 2.2-3.3 2.2-4.5 0L38.4 34H25.6l-3.1 4c-1.2 2.2-3.3 2.2-4.5 0l-2.4-4.5-1.2 1.5c-1.6 2-3.8 2-5.4 0z" fill="#FFC23A"/>
  <path d="M8 39c0-1.7 1.3-3 3-3h4.5l4.5 5 4.5-5h15l4.5 5 4.5-5H53c1.7 0 3 1.3 3 3v1.5c0 1.7-1.3 3-3 3H11c-1.7 0-3-1.3-3-3z" fill="#3A1A14"/>
  <path d="M7 47c0-1.1.9-2 2-2h46c1.1 0 2 .9 2 2 0 3.3-2.7 6-6 6H13c-3.3 0-6-2.7-6-6z" fill="#E3262B"/>
</svg>`;

module.exports = {
  simbolo,
  logo: `${simbolo}<span class="logo-txt"><b>monta</b><small>burger</small></span>`,
  // favicon: símbolo sobre quadrado creme
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#FFF8F2"/><g transform="translate(0 4)">${simbolo.replace(/<svg[^>]*>|<\/svg>/g, '')}</g></svg>`,

  sacola: s('<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>'),
  mais: s('<path d="M12 6v12M6 12h12"/>'),
  menos: s('<path d="M6 12h12"/>'),
  x: s('<path d="M7 7l10 10M17 7 7 17"/>'),
  seta: s('<path d="M5 12h13M13 7l5 5-5 5"/>'),
  setaEsq: s('<path d="M19 12H6M11 7l-5 5 5 5"/>'),
  pino: s('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  moto: s('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h5l2-5h-4l-2-4H7M16 12l2 5M14 6h3"/>'),
  menu: s('<path d="M4 8h16M4 16h11"/>'),
  play: s('<path d="M8 6v12l10-6z" fill="currentColor"/>'),
  pausa: s('<path d="M9 6v12M15 6v12"/>'),
  lixo: s('<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>'),
  lapis: s('<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>'),
  olho: s('<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/>'),
  olhoFechado: s('<path d="M4 4l16 16M10 6.2A9 9 0 0 1 12 6c5.5 0 9 6 9 6a15 15 0 0 1-2.6 3.2M6.5 8A15 15 0 0 0 3 12s3.5 6 9 6a9 9 0 0 0 3-.5"/>'),
  sobe: s('<path d="M7 14l5-5 5 5"/>'),
  desce: s('<path d="M7 10l5 5 5-5"/>'),
  foto: s('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><circle cx="9" cy="10.5" r="1.8"/><path d="M20 16l-5-4.5-8 7"/>'),
  arroba: s('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M4.5 7.5l6.3 5a2 2 0 0 0 2.4 0l6.3-5"/>'),
  cadeado: s('<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2"/>'),
  sair: s('<path d="M14 5h4a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19h-4M10 8l-4 4 4 4M6 12h9"/>'),
  enviar: s('<path d="M4 12l16-7-6 15-3-6z"/>'),
  insta: s('<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>'),
  face: s('<path d="M14 21v-8h2.6l.4-3H14V8.2c0-.9.3-1.5 1.6-1.5H17V4.1A20 20 0 0 0 14.8 4C12.6 4 11 5.3 11 7.8V10H8.5v3H11v8"/>'),
  tiktok: s('<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.6 2.4 4.4 5 4.6"/>'),
  whats: s('<path d="M4.5 19.5l1.2-3.7A8 8 0 1 1 8.4 18.5z"/><path d="M9 9.3c.2 2.7 2.6 5.3 5.6 5.7l1-1.3-1.8-1-.9.8c-.9-.4-1.8-1.3-2.2-2.2l.8-.9-1-1.8z" fill="currentColor" stroke-width="1"/>'),
};
