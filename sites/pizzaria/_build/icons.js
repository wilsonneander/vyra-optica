// Ícones e desenhos próprios da Fornalha: traço grosso e arredondado, cantos macios, como massa aberta na mão.
const ico = (d, extra = '') => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// selo da marca: forno de cúpula com a boca acesa, dentro de um quadrado de massa
const marca = `
  <rect x="2" y="2" width="60" height="60" rx="15" fill="#F4B41A"/>
  <path d="M40 15h6v12h-6z" fill="#2A1710"/>
  <path d="M10 49V36c0-12.2 9.8-22 22-22s22 9.8 22 22v13z" fill="#2A1710"/>
  <path d="M20.5 49V40.5c0-6.4 5.1-11.5 11.5-11.5s11.5 5.1 11.5 11.5V49z" fill="#C42E1A"/>
  <path d="M25 49c0-5 3-7 4.5-10.5 1.4 2.6 1.5 4.3 1.2 6 1.5-1.6 2.7-3.4 3-6 3 3 5.3 6.2 5.3 10.5z" fill="#F4B41A"/>
  <path d="M7 50.5h50" stroke="#2A1710" stroke-width="3.5" stroke-linecap="round"/>`;

module.exports = {
  logo: `<svg class="logo-svg" viewBox="0 0 64 64" role="img" aria-label="Fornalha">${marca}</svg>`,
  favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${marca}</svg>`,
  fornoSelo: `<g transform="translate(68 66) scale(2)"><path d="M3 30V22C3 14.3 9.3 8 17 8s14 6.3 14 14v8z" fill="currentColor"/><path d="M10 30v-5.5a7 7 0 0 1 14 0V30z" fill="#F4B41A"/><path d="M1 31h32" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></g>`,

  mais: ico('<path d="M12 5.5v13M5.5 12h13"/>'),
  menos: ico('<path d="M5.5 12h13"/>'),
  x: ico('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  rever: ico('<path d="M5 12a7 7 0 1 0 2.1-5"/><path d="M5.5 4v4h4"/><path d="M10.4 9.3l4.4 2.7-4.4 2.7z"/>'),
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
