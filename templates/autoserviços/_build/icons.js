// Logo da Pistão Auto Center (a mesma do Silver e do Gold) e ícones desenhados para o Bronze (traço 2, pontas quadradas, sem bibliotecas prontas).
const s = (body, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${body}</svg>`;

// símbolo: pistão inclinado (cabeça com dois anéis e biela), dentro de um paralelogramo vermelho (igual ao Silver e ao Gold)
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

// pneu grande da capa: banda de rodagem em blocos, roda de cinco raios e porcas
function pneu() {
  const blocos = [];
  for (let i = 0; i < 40; i++) {
    const a = i * 9;
    blocos.push(`<path transform="rotate(${a} 250 250)" d="M242 4h16l-3 30h-10Z"/>`);
    blocos.push(`<path transform="rotate(${a + 4.5} 250 250)" d="M246 12h8l-1 16h-6Z" opacity=".55"/>`);
  }
  const raios = [];
  for (let i = 0; i < 5; i++) raios.push(`<path transform="rotate(${i * 72} 250 250)" d="M236 196 226 112q24-8 48 0l-10 84q-14 6-28 0Z"/>`);
  const porcas = [];
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180;
    porcas.push(`<circle cx="${(250 + Math.cos(a) * 30).toFixed(1)}" cy="${(250 + Math.sin(a) * 30).toFixed(1)}" r="6"/>`);
  }
  return `<svg class="pneu" viewBox="0 0 500 500" aria-hidden="true">
  <circle cx="250" cy="250" r="236" fill="#141518"/>
  <g fill="#26282d">${blocos.join('')}</g>
  <circle cx="250" cy="250" r="200" fill="none" stroke="#2e3036" stroke-width="3"/>
  <circle cx="250" cy="250" r="172" fill="#1a1b1f"/>
  <circle cx="250" cy="250" r="150" fill="#3a3d44"/>
  <circle cx="250" cy="250" r="140" fill="#1a1b1f"/>
  <g fill="#5d626b">${raios.join('')}</g>
  <circle cx="250" cy="250" r="56" fill="#6b7079"/>
  <circle cx="250" cy="250" r="44" fill="#2a2c31"/>
  <g fill="#9aa0a8">${porcas.join('')}</g>
  <circle cx="250" cy="250" r="12" fill="var(--pinca, #D42A1E)"/>
  <path d="M190 120a150 150 0 0 1 120 0" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="6"/>
</svg>`;
}

// marca de pneu no chão (tile repetido na faixa da capa e no fundo dos serviços)
const rastro = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="40" viewBox="0 0 44 40"><g fill="#000"><path d="M2 1h16l8 8.5-8 8.5H2l8-8.5Z"/><path d="M24 22h16l-8 8.5 8 8.5H24l-8-8.5Z" opacity=".75"/></g></svg>`;

// ferramentas para o fundo do Sobre: chave combinada, soquete e chave de roda em cruz
const ferramentas = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360"><g fill="none" stroke="#fff" stroke-width="3">
<g transform="rotate(-35 90 90)"><path d="M40 82h100v16H40z"/><path d="M40 90a18 18 0 1 1-6-14l-8 8 4 12 12 4 8-8"/><circle cx="152" cy="90" r="16"/><path d="M146 84l12 12M158 84l-12 12"/></g>
<g transform="translate(250 70)"><path d="M-22 -30h44v60h-44z"/><path d="M-14 -44h28v14h-28z"/><path d="M-10 0h20M0 -10v20"/></g>
<g transform="rotate(20 250 250)"><path d="M180 250h140M250 180v140"/><circle cx="180" cy="250" r="10"/><circle cx="320" cy="250" r="10"/><circle cx="250" cy="180" r="10"/><circle cx="250" cy="320" r="10"/></g>
<g transform="rotate(50 80 270)"><path d="M20 262h110v14H20z"/><path d="M130 254l24 8v14l-24 8z"/></g>
</g></svg>`;

module.exports = {
  logo, favicon, simbolo, pneu: pneu(), rastro, ferramentas,
  whats: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.8 2.3.9 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.3-.2Z"/></svg>`,
  fone: s('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
  pino: s('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><path d="M9.5 10h5"/>'),
  relogio: s('<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 7v5h4"/>'),
  desce: s('<path d="M6 9.5l6 6 6-6"/>'),
  seta: s('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  setaDiag: s('<path d="M7 17 17 7M9 7h8v8"/>'),
  mais: s('<path d="M12 5v14M5 12h14"/>'),
  check: s('<path d="M4 12.5 9.5 18 20 6.5"/>'),
  insta: s('<path d="M4 4h16v16H4z"/><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M16.5 6.8v.4"/>'),
  face: s('<path d="M14.5 21v-8h3l.5-3.5h-3.5V7.8c0-1 .3-1.8 1.8-1.8H18V3.2A24 24 0 0 0 15.4 3c-2.6 0-4.4 1.6-4.4 4.5v2H8V13h3v8"/>'),
  // estrela de avaliação: cinco pontas retas, preenchida
  estrela: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.8 6.2 6.7.7-5 4.6 1.4 6.6L12 17.2l-5.9 3.4 1.4-6.6-5-4.6 6.7-.7Z"/></svg>`,
  // ícone do Google (letra G em quatro cores) para a nota das avaliações
  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z"/></svg>`,
  // seletor de tema: sol e lua (os mesmos do Gold)
  claro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`,
  escuro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M14.8 3.4a8.7 8.7 0 1 0 5.8 12.4A7 7 0 0 1 14.8 3.4Z"/></svg>`,
};
