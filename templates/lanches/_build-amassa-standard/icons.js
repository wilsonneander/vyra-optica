// Ícones e adesivos próprios do Amassa. Traço grosso de 2, pontas retas, como carimbo de lanchonete.
// Nada de biblioteca de ícones: tudo desenhado aqui.
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// a espátula de chapa: lâmina larga com o cabo inclinado
const espatula = '<svg class="espatula" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 40h30l4 10H4Z" fill="currentColor"/><path d="M38 40 50 14" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M47 20 56 4" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>';

// flor de azulejo português (separador das faixas)
const azulejo = '<svg class="azulejo" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2c3.4 6 3.4 10 0 14-3.4-4-3.4-8 0-14Zm0 36c-3.4-6-3.4-10 0-14 3.4 4 3.4 8 0 14ZM2 20c6-3.4 10-3.4 14 0-4 3.4-8 3.4-14 0Zm36 0c-6 3.4-10 3.4-14 0 4-3.4 8-3.4 14 0Z" fill="currentColor"/><circle cx="20" cy="20" r="3.4" fill="currentColor"/><path d="M8.5 8.5l5 5M31.5 8.5l-5 5M8.5 31.5l5-5M31.5 31.5l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

// logo: as letras do meio estão prensadas, como a carne debaixo da espátula
const logoTxt = '<span class="logo-txt" aria-hidden="true"><i>A</i><i>M</i><i>A</i><i class="lp">S</i><i class="lp">S</i><i>A</i></span>';

// adesivos (ilustrações da marca, não etiquetas): forma, cor de fundo, cor do texto, texto escrito à mão
const bordaEstrela = (n, r1, r2, cx = 60, cy = 60) => {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1; p.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`); }
  return p.join(' ');
};
const adesivo = (forma, fundo, tinta, linhas, extra = '') => {
  const txt = linhas.map((l, k) => `<text x="60" y="${(linhas.length === 1 ? 70 : 58 + k * 24)}" text-anchor="middle">${l}</text>`).join('');
  const corpo = {
    estrela: `<polygon points="${bordaEstrela(14, 58, 48)}" fill="#fff"/><polygon points="${bordaEstrela(14, 52, 43)}" fill="${fundo}"/>`,
    oval: `<ellipse cx="60" cy="60" rx="58" ry="40" fill="#fff"/><ellipse cx="60" cy="60" rx="52" ry="34" fill="${fundo}"/>`,
    redondo: `<circle cx="60" cy="60" r="56" fill="#fff"/><circle cx="60" cy="60" r="50" fill="${fundo}"/>`,
  }[forma];
  return `<svg class="adesivo-svg" viewBox="0 0 120 120" aria-hidden="true">${corpo}<g fill="${tinta}" class="adesivo-txt">${txt}</g>${extra}</svg>`;
};
const risco = (cor) => `<path d="M30 86c18-5 42-6 62-2" stroke="${cor}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

module.exports = {
  espatula, azulejo, logoTxt, adesivo, risco,
  logo: `<span class="logo-marca">${logoTxt}<span class="logo-apoio">smash burger</span></span>`,
  diag: s('<path d="M7 17 17 7M9 7h8v8"/>'),
  seta: s('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  esquerda: s('<path d="M15 5 8 12l7 7"/>'),
  direita: s('<path d="m9 5 7 7-7 7"/>'),
  menu: s('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  fechar: s('<path d="m6 6 12 12M18 6 6 18"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  pessoas: s('<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3.2 2.7-5 5.5-5s4.9 1.8 5.5 5"/><path d="M15.5 6a2.8 2.8 0 1 1 0 5.5M17.5 14.5c1.6.6 2.6 2.2 3 4.5"/>'),
  pessoa: s('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>'),
  pino: s('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  calendario: s('<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  sacola: s('<path d="M5.5 8h13l-1 11.5h-11Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>'),
  moto: s('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h4l3-6h4l1 6M13 11l-2-4H8M17 11h-3"/>'),
  balcao: s('<path d="M3 10h18M5 10v10M19 10v10M8 14h8"/><path d="M4 10 6 4h12l2 6"/>'),
  fogo: s('<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 3-5 3-8.4 2.4 1.2 3.4 3 3.4 5 1-.6 1.6-1.8 1.6-3 2.6 1.8 4 4 4 6.4 0 3.2-2.4 5.6-6 5.6Z"/>'),
  broto: s('<path d="M12 20.5v-8.5"/><path d="M12 12.5C12 8.2 9 5.5 4.8 5.5c0 4.2 3 7 7.2 7ZM12 14.5c0-3.6 2.6-6 6.4-6 0 3.6-2.6 6-6.4 6Z"/>'),
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>', ' class="ic-insta"'),
  imprimir: s('<path d="M7 9V3.5h10V9M7 17H4.5V9h15v8H17"/><path d="M7 14h10v6.5H7Z"/>'),
  coracao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.6-4.6-7.6-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.6 2.4C19.6 15.4 12 20 12 20Z" fill="currentColor"/></svg>',
  estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.4 2.6 5.5 6 .7-4.4 4.1 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.1 6-.7Z" fill="currentColor"/></svg>',
  aspas: '<svg viewBox="0 0 48 36" aria-hidden="true"><path d="M3 34V21C3 10 8.6 3.4 19 2l1.2 4.6C14.4 8.2 11.4 12 11 18h8v16Zm25 0V21C28 10 33.6 3.4 44 2l1.2 4.6C39.4 8.2 36.4 12 36 18h8v16Z" fill="currentColor"/></svg>',
  whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.7 21.4l4.8-1.3A9.3 9.3 0 1 0 12 2.6Zm0 17a7.7 7.7 0 0 1-3.9-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.6Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z"/></svg>',
};
