// Logo e ícones desenhados para a Pistão (traço 1.8, cantos vivos, inclinação de 8° na marca). Sem bibliotecas prontas.
const s = (body, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${body}</svg>`;
// ícones cheios (números e etapas): preenchidos na cor de destaque
const f = (body, vb = '0 0 32 32') => `<svg viewBox="${vb}" fill="currentColor" aria-hidden="true">${body}</svg>`;

// símbolo: pistão inclinado (cabeça com dois anéis e biela), dentro de um paralelogramo vermelho
const simbolo = `<svg class="simbolo" viewBox="0 0 52 48" aria-hidden="true">
  <path d="M10 2h40L42 46H2Z" fill="var(--rubi, #FF3D24)"/>
  <g transform="skewX(-9) translate(7 0)">
    <path d="M14 9h20v4H14zM14 15h20v3H14z" fill="#101010"/>
    <path d="M14 20h20v6l-3 3H17l-3-3Z" fill="#101010"/>
    <circle cx="24" cy="24.5" r="2.2" fill="var(--rubi, #FF3D24)"/>
    <path d="M21.5 29h5l1.5 10h-8Z" fill="#101010"/>
    <path d="M18 38h12v4H18z" fill="#101010"/>
  </g>
</svg>`;

const logo = `${simbolo}<span class="logo-txt"><b>PISTÃO</b><small>auto center</small></span>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 48"><path d="M10 2h40L42 46H2Z" fill="#FF3D24"/><g transform="skewX(-9) translate(7 0)"><path d="M14 9h20v4H14zM14 15h20v3H14zM14 20h20v6l-3 3H17l-3-3ZM21.5 29h5l1.5 10h-8ZM18 38h12v4H18z" fill="#101010"/></g></svg>`;

// carro de lado para o preloader (carroceria cheia, rodas separadas para girar)
const carro = `<svg class="pre-carro" viewBox="0 0 220 80" aria-hidden="true">
  <path d="M8 56c0-8 4-13 12-15l30-6 26-16c8-5 16-7 26-7h34c10 0 18 3 25 9l16 14 22 4c8 2 13 7 13 14v6c0 3-2 5-5 5h-14a22 22 0 0 0-43 0H70a22 22 0 0 0-43 0H13c-3 0-5-2-5-5Z" fill="#fff"/>
  <path d="M84 24 74 36h46V18h-16c-8 0-14 2-20 6ZM128 18v18h48l-12-11c-5-5-11-7-18-7Z" fill="#101010"/>
  <path d="M190 44h14v6h-14z" fill="var(--rubi, #FF3D24)"/>
  <path d="M10 48h10v6H10z" fill="#ffb4a8"/>
  ${[48, 170].map((x) => `<g class="roda" style="transform-origin:${x}px 62px"><circle cx="${x}" cy="62" r="16" fill="#1c1c1c" stroke="#fff" stroke-width="3"/><circle cx="${x}" cy="62" r="7" fill="none" stroke="var(--rubi, #FF3D24)" stroke-width="3"/><path d="M${x} 47v8M${x} 69v8M${x - 15} 62h8M${x + 7} 62h8" stroke="#fff" stroke-width="2.4"/></g>`).join('')}
</svg>`;

// ícones das etapas
const etapas = {
  diagnostico: f('<path d="M16 5A14 14 0 0 0 2 19c0 2.3.6 4.5 1.6 6.4l1.1 2H27.3l1.1-2A14 14 0 0 0 16 5Zm0 3.2a10.8 10.8 0 0 1 10.6 13.6H5.4A10.8 10.8 0 0 1 16 8.2Z"/><path d="m21.6 11.2 2 1.6-5.4 7a2.6 2.6 0 1 1-2-1.6Z"/>'),
  reparo: f('<path d="M21.6 2.6a7.4 7.4 0 0 0-7 9.6L3.4 23.4a3 3 0 0 0 4.2 4.2l11.2-11.2a7.4 7.4 0 0 0 9.6-7L24 13.8l-4.6-1.2-1.2-4.6 4.4-4.4c-.3-.6-.6-.9-1-1Z"/>'),
  entrega: f('<path d="M5 18.5 8.2 11c.6-1.5 2-2.5 3.6-2.5h8.4c1.6 0 3 1 3.6 2.5l3.2 7.5c1.5.6 2.5 2 2.5 3.6V27h-3v2.5h-4.5V27h-12v2.5H5.5V27h-3v-4.9c0-1.6 1-3 2.5-3.6Zm3.3-.5h15.4L21.4 12.3a1 1 0 0 0-1-.6h-8.8a1 1 0 0 0-1 .6Zm-.8 3.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm17 0a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"/>'),
};

// ícones dos números (maleta, polegar, equipe, medalha), como na faixa de referência
const numeros = {
  horas: f('<path d="M11 4h10l1.5 1.5V8H28c1.1 0 2 .9 2 2v6.5H2V10c0-1.1.9-2 2-2h5.5V5.5Zm2 3v1h6v-1Z"/><path d="M2 18.5h11.5v2h5v-2H30V26c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2Z"/>'),
  clientes: f('<path d="M3 13h5v15H3Z"/><path d="M10 13.5 15.5 4c1.8-.4 3.4 1 3.2 2.8L18 12h8.5c1.8 0 3.1 1.7 2.7 3.4l-2.4 10.2c-.3 1.4-1.5 2.4-3 2.4H10Z"/>'),
  equipe: f('<circle cx="16" cy="9" r="5"/><circle cx="7" cy="11.5" r="3.8"/><circle cx="25" cy="11.5" r="3.8"/><path d="M7 28c0-5.5 4-9.5 9-9.5s9 4 9 9.5Z"/><path d="M1 26c0-4.2 2.7-7.2 6.3-7.2 1 0 1.8.2 2.6.6A11 11 0 0 0 5.3 26ZM31 26c0-4.2-2.7-7.2-6.3-7.2-1 0-1.8.2-2.6.6a11 11 0 0 1 4.6 6.6Z"/>'),
  selo: f('<path d="m16 1.5 2.6 1.8 3.1-.2 1.2 2.9 2.7 1.5-.4 3.1 1.6 2.7-2.1 2.3-.3 3.1-3 .8-1.8 2.6-2.9-1.2-2.9 1.2-1.8-2.6-3-.8-.3-3.1-2.1-2.3 1.6-2.7-.4-3.1 2.7-1.5 1.2-2.9 3.1.2Z"/><path d="m10 21.5 1.8 2.6 2.4.1L12 31l-2.3-2.6-3.4.5Zm12 0 3.7 7.4-3.4-.5L20 31l-2.2-6.8 2.4-.1Z"/>'),
};

// roda de liga leve em contorno (fundo do FAQ, gira devagar)
const rodaFundo = (() => {
  const raios = Array.from({ length: 6 }, (_, i) => `<path transform="rotate(${i * 60} 200 200)" d="M188 150 178 52q22-6 44 0l-10 98"/>`).join('');
  const furos = Array.from({ length: 5 }, (_, i) => { const a = (i * 72 - 90) * Math.PI / 180; return `<circle cx="${(200 + Math.cos(a) * 28).toFixed(1)}" cy="${(200 + Math.sin(a) * 28).toFixed(1)}" r="6"/>`; }).join('');
  return `<svg viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width="2"><circle cx="200" cy="200" r="196"/><circle cx="200" cy="200" r="172"/><g class="aro"><circle cx="200" cy="200" r="160" stroke="currentColor" stroke-width="6"/></g><circle cx="200" cy="200" r="148"/>${raios}<circle cx="200" cy="200" r="50"/>${furos}</svg>`;
})();

// conta-giros do preloader: arco de fundo, arco que enche, marcas e ponteiro (girado pelo JS)
const contaGiros = (() => {
  const marcas = Array.from({ length: 11 }, (_, i) => {
    const a = (-210 + i * 24) * Math.PI / 180;
    const r1 = i > 7 ? 74 : 78, r2 = 90;
    return `<path d="M${(100 + Math.cos(a) * r1).toFixed(1)} ${(100 + Math.sin(a) * r1).toFixed(1)}L${(100 + Math.cos(a) * r2).toFixed(1)} ${(100 + Math.sin(a) * r2).toFixed(1)}"${i > 7 ? ' class="vermelha"' : ''}/>`;
  }).join('');
  return `<svg class="giros" viewBox="0 0 200 170" aria-hidden="true">
  <path class="giros-trilho" d="M30.7 140A80 80 0 1 1 169.3 140" pathLength="100"/>
  <path class="giros-cheio" d="M30.7 140A80 80 0 1 1 169.3 140" pathLength="100"/>
  <g class="giros-marcas">${marcas}</g>
  <g class="giros-ponteiro"><path d="M97 100 100 34 103 100Z"/><circle cx="100" cy="100" r="9"/></g>
</svg>`;
})();

module.exports = {
  rodaFundo, contaGiros,
  // play: triângulo cheio com a ponta levemente cortada
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3.5 20 12 7 20.5Z"/></svg>`,
  // alternar tema: círculo dividido na diagonal, metade cheia
  tema: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="currentColor" d="M18 6A8.5 8.5 0 0 1 6 18Z"/></svg>`,
  fechar: s('<path d="M5 5l14 14M19 5 5 19"/>'),
  // seletor de tema: sol com raios e lua em contorno (traço fino)
  claro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`,
  escuro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M14.8 3.4a8.7 8.7 0 1 0 5.8 12.4A7 7 0 0 1 14.8 3.4Z"/></svg>`,
  // aspas do depoimento em gota, como na referência
  aspasGota: `<svg viewBox="0 0 64 48" aria-hidden="true"><path fill="currentColor" d="M14 0a14 14 0 0 1 14 14c0 14-8 26-20 34l-3-4c6-5 10-11 11-17A14 14 0 1 1 14 0Zm36 0a14 14 0 0 1 14 14c0 14-8 26-20 34l-3-4c6-5 10-11 11-17A14 14 0 1 1 50 0Z"/></svg>`,
  enviar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.5 2.5 2.5 10l7 3 3 7Zm-11 10.2 6.8-6.8-5.2 8.6Z"/></svg>`,
  checkCirc: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".18"/><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  logo, favicon, simbolo, carro, etapas, numeros,
  whats: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.8 2.3.9 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.3-.2Z"/></svg>`,
  fone: s('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
  email: s('<path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/>'),
  pino: s('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><path d="M12 7.5v5"/>'),
  relogio: s('<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 7v5h4"/>'),
  seta: s('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  setaEsq: s('<path d="M20 12H5M11 6l-6 6 6 6"/>'),
  setaDiag: s('<path d="M7 17 17 7M9 7h8v8"/>'),
  mais: s('<path d="M12 4v16M4 12h16"/>'),
  check: s('<path d="M4 12.5 9.5 18 20 6.5"/>'),
  insta: s('<path d="M4 4h16v16H4z"/><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M16.5 6.8v.4"/>'),
  face: s('<path d="M14.5 21v-8h3l.5-3.5h-3.5V7.8c0-1 .3-1.8 1.8-1.8H18V3.2A24 24 0 0 0 15.4 3c-2.6 0-4.4 1.6-4.4 4.5v2H8V13h3v8"/>'),
  youtube: s('<path d="M3 6.5h18v11H3z"/><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor"/>'),
  // aspas de depoimento: dois blocos inclinados
  aspas: `<svg viewBox="0 0 48 40" aria-hidden="true"><path fill="currentColor" d="M8 4h14l-6 16h6v16H2V20Zm24 0h14l-6 16h6v16H26V20Z"/></svg>`,
  estrela: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.8 6.2 6.7.7-5 4.6 1.4 6.6L12 17.2l-5.9 3.4 1.4-6.6-5-4.6 6.7-.7Z"/></svg>`,
};
