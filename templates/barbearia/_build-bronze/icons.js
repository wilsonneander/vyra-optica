// Ícones do Bronze: reaproveita a marca e os ícones da Mecha (icons-mecha.js, cópia do Gold do salão) e acrescenta os desenhos próprios da barbearia,
// no mesmo traço (1.6, pontas retas, sem biblioteca de ícones).
const G = require('./icons-mecha');

const s = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"${extra}>${d}</svg>`;

// logo do lado barbearia: o mesmo símbolo, com "barbearia" embaixo do nome
const logo = `<span class="logo-marca">${G.simbolo()}<span class="logo-txt"><b>Mecha</b><small>barbearia</small></span></span>`;

module.exports = {
  ...G,
  logo,
  // grade de pontos do botão do painel (como na referência)
  pontos: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + [4, 12, 20].flatMap((y) => [4, 12, 20].map((x) => `<circle cx="${x}" cy="${y}" r="1.7" fill="currentColor"/>`)).join('') + '</svg>',
  // cadeira de barbeiro vista de lado
  cadeira: s('<path d="M8 3.5h7v7.5H8zM6 11h11.5v3.2H6zM9 14.2v3.3M15 14.2v3.3M7.5 20.5h9M12 17.5v3M6 8.5v4.2M17.5 8.5v4.2"/>'),
  // lâmina de barbear dupla
  lamina: s('<path d="M3.5 8.5h17v7h-17zM8 12h8M10 10.2v3.6M14 10.2v3.6"/>'),
  telefone: s('<path d="M6.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 5.8 5.8l1.4-2.2 4.4 1.6v3c0 1-.8 2-2 2C10 19.5 4.5 14 4.5 5.5c0-1.2 1-2 2-2Z"/>'),
  carta: s('<path d="M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7"/>'),
  agenda: s('<path d="M4 5.5h16v14.5H4zM4 10h16M8.5 3.5v4M15.5 3.5v4M8 14h3"/>'),
};
