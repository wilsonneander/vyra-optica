// Ícones e desenhos próprios da Fornalha: traço grosso e arredondado, cantos macios, como massa aberta na mão.
const ico = (d, extra = '') => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// símbolo da marca: forno a lenha de tijolo com o fogo aceso e uma pizza entrando na pá
const marca = `
  <path d="M41 9h8v13h-8z" fill="#9E2414"/>
  <path d="M39.5 8h11" stroke="#9E2414" stroke-width="3" stroke-linecap="round"/>
  <path d="M6 52V35C6 20.6 17.6 9 32 9s26 11.6 26 26v17z" fill="#C42E1A"/>
  <g stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity=".85">
    <path d="M16 19.5l2.6 3.2M24.5 13.4l1.4 3.9M39.5 13.4l-1.4 3.9M48 19.5l-2.6 3.2M10.6 28.8l4 1.4M53.4 28.8l-4 1.4"/>
  </g>
  <path d="M14.5 52V39.5c0-9.7 7.8-17.5 17.5-17.5s17.5 7.8 17.5 17.5V52z" fill="#FFFFFF"/>
  <path d="M18 52V39.8C18 32 24.3 25.7 32 25.7S46 32 46 39.8V52z" fill="#2A1710"/>
  <path d="M22.5 46c0-4.6 2.6-6.4 4.1-9.6 1.2 2.4 1.4 4 1.1 5.5 1.4-1.5 2.5-3.2 2.8-5.6 2.4 2.1 3.8 4.2 4.3 6.4.9-1.4 1.3-2.8 1.3-4.6 3 2.8 4.4 5.2 4.4 7.9z" fill="#F4B41A"/>
  <path d="M27.4 46c0-2.2 1.3-3.2 2.1-4.8.8 1.4 1 2.6.6 4 .9-.7 1.6-1.6 1.9-3 1.6 1.4 2.2 2.6 2.2 3.8z" fill="#E8641E"/>
  <path d="M34 49.4h25.5" stroke="#F4B41A" stroke-width="3.2" stroke-linecap="round"/>
  <ellipse cx="29" cy="48.6" rx="9.6" ry="3" fill="#F4B41A"/>
  <ellipse cx="29" cy="48.2" rx="7.6" ry="2.1" fill="#C42E1A"/>
  <circle cx="26" cy="48" r="1" fill="#FFFAF0"/><circle cx="31.5" cy="48.6" r="1" fill="#FFFAF0"/><circle cx="29" cy="47.4" r=".8" fill="#2F6B3A"/>
  <path d="M4 53.5h56" stroke="#2A1710" stroke-width="3.4" stroke-linecap="round"/>`;

module.exports = {
  // logo completo: símbolo e nome lado a lado, numa placa branca
  logo: `<svg class="logo-svg" viewBox="0 0 64 64" aria-hidden="true">${marca}</svg><span class="logo-nome" aria-hidden="true"><b>Fornalha</b><small>pizza bar</small></span>`,
  logoMini: `<svg class="logo-svg" viewBox="0 0 64 64" aria-hidden="true">${marca}</svg>`,
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#FFFFFF"/><g transform="translate(3.2 1.6) scale(.9)">${marca}</g></svg>`,
  fornoSelo: `<g transform="translate(66 64) scale(1.06)">${marca}</g>`,

  mais: ico('<path d="M12 5.5v13M5.5 12h13"/>'),
  menos: ico('<path d="M5.5 12h13"/>'),
  x: ico('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  seta: ico('<path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5"/>'),
  pino: ico('<path d="M12 21.5c-3.8-4.3-6.6-7.9-6.6-11.4a6.6 6.6 0 0 1 13.2 0c0 3.5-2.8 7.1-6.6 11.4z"/><path d="M9.6 10.2a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 1 0-4.8 0"/>'),
  lupa: ico('<path d="M4 10.5a6.5 6.5 0 1 0 13 0 6.5 6.5 0 1 0-13 0M15.4 15.4l4.8 4.8"/>'),
  sacola: ico('<path d="M5 8.5h14l-1.2 11.2a1.6 1.6 0 0 1-1.6 1.4H7.8a1.6 1.6 0 0 1-1.6-1.4z"/><path d="M8.8 10.8V7.2a3.2 3.2 0 0 1 6.4 0v3.6"/>'),
  folha: ico('<path d="M5 19c0-8 4.5-13.5 14-14 .4 9.2-5 14-12.4 14z"/><path d="M5 19c2.6-3.6 5.4-6.1 9-8"/>'),
  pimenta: ico('<path d="M15.5 7.5c2.5.8 3.6 3.2 2.6 6.2-1.6 4.6-7 7.6-13.6 6.8 4.6-1.8 6.8-4.6 7.6-9 .4-2.6 1.2-4.4 3.4-4z"/><path d="M15.5 7.5c0-2 .8-3.4 2.6-4"/>'),
  copo: ico('<path d="M6 4.5h12l-1.6 14.6a1.6 1.6 0 0 1-1.6 1.4H9.2a1.6 1.6 0 0 1-1.6-1.4z"/><path d="M6.8 10h10.4"/>'),
  whats: ico('<path d="M4.2 20l1.2-3.8A8.4 8.4 0 1 1 8.6 19z"/><path d="M9.2 8.6c-.4 2.4 2 5.8 5.6 6.4l1.2-1.6-2-1.2-.9.9c-1-.4-1.9-1.3-2.4-2.4l.9-.9-1.2-2z"/>'),
  insta: ico('<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M8.6 12a3.4 3.4 0 1 0 6.8 0 3.4 3.4 0 1 0-6.8 0"/><path d="M16.6 7.4h.01"/>'),

  // fatia de pizza pequena, separador da fita que corre
  fatiaMini: `<svg class="fatia-mini" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7c7-3.5 17-3.5 24 0L16 29z" fill="#F4B41A"/><path d="M4 7c7-3.5 17-3.5 24 0l-1.6 3.2C20 7.4 12 7.4 5.6 10.2z" fill="#B5621F"/><circle cx="13" cy="14" r="2.4" fill="#C42E1A"/><circle cx="19.5" cy="13.5" r="2" fill="#C42E1A"/><circle cx="16" cy="20" r="2" fill="#C42E1A"/></svg>`,

  // caixa de pizza aberta e vazia (sacola vazia e busca sem resultado)
  caixa: `<svg class="caixa" viewBox="0 0 160 120" aria-hidden="true"><path d="M20 62l26-40h68l26 40z" fill="#E9CFA3" stroke="#2A1710" stroke-width="3" stroke-linejoin="round"/><path d="M20 62h120v28a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z" fill="#F6E4C4" stroke="#2A1710" stroke-width="3" stroke-linejoin="round"/><path d="M46 22h68" stroke="#2A1710" stroke-width="3"/><path d="M62 76c4 4 12 4 16 0M90 76c4 4 12 4 16 0" stroke="#2A1710" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M80 34c-3 5 3 8 0 14" stroke="#C42E1A" stroke-width="3" stroke-linecap="round" fill="none" class="caixa-fumaca"/></svg>`,
};
