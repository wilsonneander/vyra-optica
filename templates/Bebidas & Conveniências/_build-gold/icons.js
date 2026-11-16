// Logo e ícones próprios da Tampinha. Traço 2, pontas redondas, cantos suaves, como a borda de uma tampinha.

// tampinha coroa vista de cima: 21 dentes
const coroa = (cx, cy, rFora, rDentro, n = 21) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2, r = i % 2 ? rDentro : rFora;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
};

const capa = (extra = '') => `<polygon points="${coroa(24, 24, 23, 20.2)}" fill="#B08D57"/><circle cx="24" cy="24" r="17" fill="#8A6C3F"/><circle cx="24" cy="24" r="14.5" fill="#B08D57"/>
<path d="M13.5 17 A12 12 0 0 1 21 12.6" fill="none" stroke="#F3E6CC" stroke-width="2" stroke-linecap="round" opacity=".6"/>${extra}`;
const letraT = '<path d="M23 14.5 V28 Q23 33 28 33 H30 M17.5 20 H29" fill="none" stroke="#0B0A09" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>';

const logo = `<svg class="logo-svg" viewBox="0 0 220 48" role="img" aria-label="Tampinha Bebidas e Conveniência">${capa(letraT)}
<text x="58" y="26" class="logo-nome" font-size="21" fill="currentColor" letter-spacing="6">TAMPINHA</text>
<text x="59" y="41" class="logo-sub" font-size="8.4" fill="currentColor" letter-spacing="2.6">BEBIDAS &amp; CONVENIÊNCIA</text></svg>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${capa(letraT)}</svg>`;

// botão de adicionar: a própria tampinha com um "+"
const addTampa = `<svg viewBox="0 0 48 48" aria-hidden="true">${capa('<path d="M24 16 V32 M16 24 H32" stroke="#0B0A09" stroke-width="3.6" stroke-linecap="round"/>')}</svg>`;
const tampaPura = `<svg viewBox="0 0 48 48" aria-hidden="true">${capa()}</svg>`;

const s = (d, w = 24) => `<svg viewBox="0 0 ${w} 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

// a lata da casa (Tampinha Reserva) desenhada de frente: miniatura do carrinho e imagem de reserva quando não há WebGL.
// Mesmo rótulo da textura 3D de lata.js: sol dourado, serras em linhas e ondas, nome no meio.
const serra = (y, amp, fase) => { let d = 'M10 ' + y; for (let x = 10; x <= 110; x += 5) d += ' L' + x + ' ' + (y - Math.abs(Math.sin((x + fase) / 9)) * amp - Math.sin((x + fase) / 23) * amp * 0.6).toFixed(1); return d; };
const onda = (y, fase) => { let d = 'M10 ' + y; for (let x = 10; x <= 110; x += 4) d += ' L' + x + ' ' + (y + Math.sin((x + fase) / 5) * 2.2).toFixed(1); return d; };
const lataReserva = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 260"><defs>
<linearGradient id="lr-c" x1="0" x2="1"><stop offset="0" stop-color="#050505"/><stop offset=".22" stop-color="#1b1916"/><stop offset=".36" stop-color="#3a352d"/><stop offset=".5" stop-color="#14120f"/><stop offset="1" stop-color="#030303"/></linearGradient>
<linearGradient id="lr-m" x1="0" x2="1"><stop offset="0" stop-color="#5d5850"/><stop offset=".35" stop-color="#e9e4da"/><stop offset=".6" stop-color="#9d978b"/><stop offset="1" stop-color="#3c3832"/></linearGradient>
<linearGradient id="lr-b" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".33" stop-color="#fff" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="lr-k"><path d="M14 30 Q14 22 22 20 H98 Q106 22 106 30 V236 Q106 244 98 246 H22 Q14 244 14 236 Z"/></clipPath></defs>
<path d="M24 8 H96 L104 20 H16 Z" fill="url(#lr-m)"/><rect x="22" y="5" width="76" height="5" rx="2.5" fill="url(#lr-m)"/>
<path d="M14 30 Q14 22 22 20 H98 Q106 22 106 30 V236 Q106 244 98 246 H22 Q14 244 14 236 Z" fill="url(#lr-c)"/>
<g clip-path="url(#lr-k)" fill="none" stroke="#B08D57" stroke-width="1.1">
<circle cx="60" cy="62" r="17" fill="#B08D57" stroke="none"/><circle cx="60" cy="62" r="22" opacity=".5"/>
<path d="${serra(102, 12, 0)}"/><path d="${serra(110, 9, 17)}" opacity=".7"/><path d="${serra(118, 6, 40)}" opacity=".5"/>
<path d="${onda(196, 0)}" opacity=".7"/><path d="${onda(203, 3)}" opacity=".55"/><path d="${onda(210, 6)}" opacity=".4"/><path d="${onda(217, 9)}" opacity=".3"/>
</g>
<text x="60" y="146" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="3.4" fill="#F4EEE3">TAMPINHA</text>
<text x="60" y="170" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="19" fill="#B08D57">Reserva</text>
<text x="60" y="184" text-anchor="middle" font-family="Arial,sans-serif" font-size="5.6" letter-spacing="1.6" fill="#F4EEE3" opacity=".7">LAGER DOURADA</text>
<rect x="14" y="20" width="92" height="226" fill="url(#lr-b)"/>
<path d="M16 246 Q20 254 30 255 H90 Q100 254 104 246 Z" fill="url(#lr-m)"/></svg>`;

module.exports = {
  lataReserva,
  logo, favicon, addTampa, tampaPura,
  // engradado (carrinho)
  engradado: s('<path d="M3 9 H21 L19.6 20 H4.4 Z"/><path d="M8 9 V20 M12 9 V20 M16 9 V20"/><path d="M7 9 V5.5 M12 9 V3.5 M17 9 V5.5"/>'),
  whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z"/></svg>',
  moto: s('<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M5.5 17 H11 L14 11 H18 L18.5 17"/><path d="M9 11 H13"/><path d="M16 11 L15 7 H12.5"/><rect x="2.5" y="7" width="6" height="5" rx="1"/>'),
  sacola: s('<path d="M4.5 8 H19.5 L18.4 21 H5.6 Z"/><path d="M8.5 10.5 V6.5 A3.5 3.5 0 0 1 15.5 6.5 V10.5"/>'),
  cadeado: s('<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5"/><path d="M12 14.5 V17"/>'),
  balao: s('<path d="M4 5.5 H20 V16 H11 L6.5 20 V16 H4 Z"/><path d="M8 10.5 H16"/>'),
  pino: s('<path d="M12 21 C7.5 15.5 5.5 12.5 5.5 9.5 A6.5 6.5 0 0 1 18.5 9.5 C18.5 12.5 16.5 15.5 12 21 Z"/><circle cx="12" cy="9.5" r="2.2"/>'),
  seta: s('<path d="M5 12 H19 M13.5 6.5 L19 12 L13.5 17.5"/>'),
  esq: s('<path d="M15 5 L8 12 L15 19"/>'),
  dir: s('<path d="M9 5 L16 12 L9 19"/>'),
  fone: s('<path d="M7.5 3.5 L10 8.5 L8.2 10 A11 11 0 0 0 14 15.8 L15.5 14 L20.5 16.5 L19.5 19.5 C12 20.5 3.5 12 4.5 4.5 Z"/>'),
  busca: s('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15 L20 20"/>'),
  fechar: s('<path d="M6 6 L18 18 M18 6 L6 18"/>'),
  menos: s('<path d="M6 12 H18"/>'),
  mais: s('<path d="M12 6 V18 M6 12 H18"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5 V12 L15 14"/>'),
  copo: s('<path d="M6 4 H18 L16.5 20.5 H7.5 Z"/><path d="M6.6 10 H17.4"/><circle cx="10.5" cy="14" r=".6"/><circle cx="13.5" cy="16.5" r=".6"/>'),
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7 H17.01"/>'),
  cima: s('<path d="M12 19 V5 M6.5 10.5 L12 5 L17.5 10.5"/>'),
  lixo: s('<path d="M5 7 H19 M9.5 7 V4.5 H14.5 V7 M7 7 L8 20 H16 L17 7"/>'),
  gelo: s('<path d="M4 9 L11 6 L18 9 L11 12 Z"/><path d="M4 9 V16 L11 19 V12 M18 9 V16 L11 19"/><path d="M14 4.5 L16 3.5"/>'),
  pix: s('<path d="M12 3 L21 12 L12 21 L3 12 Z"/><path d="M8.5 12 H15.5"/>'),
  cartao: s('<rect x="3" y="6" width="18" height="12.5" rx="2"/><path d="M3 10.5 H21 M6.5 15 H10"/>'),
  nota: s('<rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9.5 V9.6 M18.5 14.4 V14.5"/>'),
  loja: s('<path d="M4 10 V20 H20 V10"/><path d="M3 10 L5 4.5 H19 L21 10 Z"/><path d="M10 20 V14.5 H14 V20"/>'),
  face: s('<path d="M14.5 21 V13.5 H17.5 L18 10 H14.5 V8 C14.5 7 15 6.5 16 6.5 H18 V3.5 H15.5 C12.8 3.5 11 5.2 11 8 V10 H8 V13.5 H11 V21"/>'),
  coroa,
};
