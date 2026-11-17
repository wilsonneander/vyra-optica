// Gera o símbolo do Siri na Lata (caranguejo + lata) em SVG vetorial e as versões PNG.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const sharp = require('sharp');

const OUT = process.argv[2] || 'out';
fs.mkdirSync(OUT, { recursive: true });
const serif = opentype.loadSync('fonts/Gloock-Regular.ttf');
const black = opentype.loadSync('fonts/ArchivoBlack.ttf');

// texto centralizado em x, convertido em curva
function txt(font, s, cx, y, size, fill, track = 0) {
  let w = 0;
  const glyphs = font.stringToGlyphs(s);
  glyphs.forEach((g, i) => { w += g.advanceWidth * size / font.unitsPerEm + (i < glyphs.length - 1 ? track : 0); });
  let x = cx - w / 2; let d = '';
  glyphs.forEach((g) => { d += g.getPath(x, y, size).toPathData(2); x += g.advanceWidth * size / font.unitsPerEm + track; });
  return `<path d="${d}" fill="${fill}"/>`;
}

const C = {
  shell: '#E4572E', shellDk: '#C13D1C', line: '#7E2410', belly: '#F6A57C', bellyLt: '#FBC9A6',
  can: '#F3ECD8', canLt: '#FFFBF0', canDk: '#D9CFB4', canDk2: '#B8AD8F', inner: '#5A4A3A',
  red: '#C8341B', ink: '#1C1714', eye: '#2F7BC0',
};
const ST = `stroke="${C.line}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

// perna articulada: dois segmentos + ponta
const leg = (pts) => {
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  const nx = -uy * 6.5, ny = ux * 6.5; const tx = b[0] + ux * 20, ty = b[1] + uy * 20;
  const tip = `M${b[0] + nx} ${b[1] + ny} L${tx} ${ty} L${b[0] - nx} ${b[1] - ny} Z`;
  const j = pts[1];
  return `<path d="${tip}" fill="${C.shellDk}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${C.line}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${C.shell}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${j[0]}" cy="${j[1]}" r="4.5" fill="${C.shellDk}"/>`;
};

function symbol({ label = true } = {}) {
  return `
  <defs>
    <linearGradient id="canG" x1="0" x2="1">
      <stop offset="0" stop-color="${C.canDk2}"/><stop offset=".14" stop-color="${C.canDk}"/>
      <stop offset=".38" stop-color="${C.canLt}"/><stop offset=".62" stop-color="${C.can}"/>
      <stop offset=".88" stop-color="${C.canDk}"/><stop offset="1" stop-color="${C.canDk2}"/>
    </linearGradient>
    <radialGradient id="shellG" cx=".42" cy=".32" r=".75">
      <stop offset="0" stop-color="#F27A4E"/><stop offset=".6" stop-color="${C.shell}"/><stop offset="1" stop-color="${C.shellDk}"/>
    </radialGradient>
    <radialGradient id="clawG" cx=".4" cy=".3" r=".8">
      <stop offset="0" stop-color="#F48056"/><stop offset=".7" stop-color="${C.shell}"/><stop offset="1" stop-color="${C.shellDk}"/>
    </radialGradient>
  </defs>

  <!-- lata: corpo -->
  <path d="M92 262 V478 A108 22 0 0 0 308 478 V262 Z" fill="url(#canG)" stroke="${C.canDk2}" stroke-width="3"/>
  <!-- frisos da lata -->
  <path d="M92 300 A108 22 0 0 0 308 300 M92 452 A108 22 0 0 0 308 452" fill="none" stroke="${C.canDk}" stroke-width="5"/>
  ${label ? `
  <!-- rótulo -->
  <path d="M104 336 A96 18 0 0 0 296 336 V424 A96 18 0 0 1 104 424 Z" fill="#FFFDF6"/>
  ${txt(serif, 'Siri na Lata', 200, 380, 36, C.red, 0)}
  <rect x="122" y="394" width="156" height="26" rx="2" fill="${C.ink}"/>
  ${txt(black, 'BAR & RESTAURANTE', 200, 411.5, 10, '#FFFDF6', 0.6)}` : ''}

  <!-- boca da lata -->
  <ellipse cx="200" cy="262" rx="108" ry="22" fill="${C.inner}" stroke="${C.canDk2}" stroke-width="3"/>
  <ellipse cx="200" cy="265" rx="96" ry="16" fill="#3E3228"/>

  <!-- pernas de trás (dentro da lata) -->
  ${leg([[150, 238], [118, 226], [96, 246]])}
  ${leg([[250, 238], [282, 226], [304, 246]])}

  <!-- braço erguido -->
  <path d="M132 214 C 96 200 82 168 92 132" fill="none" stroke="${C.line}" stroke-width="30" stroke-linecap="round"/>
  <path d="M132 214 C 96 200 82 168 92 132" fill="none" stroke="${C.shell}" stroke-width="22" stroke-linecap="round"/>
  <!-- garra erguida: palma + dedo fixo + dedo móvel -->
  <path d="M86 140 C 52 120 44 72 70 44 C 92 20 132 18 150 34 C 158 42 156 52 146 56 L 108 72 C 126 78 142 92 140 104 C 132 128 108 146 86 140 Z" fill="url(#clawG)" ${ST}/>
  <path d="M150 34 C 168 30 182 40 178 54 C 172 72 140 74 118 72" fill="url(#clawG)" ${ST}/>
  <path d="M112 70 C 128 64 142 60 150 56" fill="none" stroke="#5A170A" stroke-width="5" stroke-linecap="round"/>
  <path d="M74 64 C 80 50 94 42 108 40" fill="none" stroke="${C.bellyLt}" stroke-width="6" stroke-linecap="round" opacity=".8"/>

  <!-- olhos (hastes atrás do corpo) -->
  <path d="M176 176 L170 128 M224 176 L230 128" stroke="${C.line}" stroke-width="13" stroke-linecap="round"/>
  <path d="M176 176 L170 128 M224 176 L230 128" stroke="${C.shell}" stroke-width="7" stroke-linecap="round"/>

  <!-- casco -->
  <path d="M104 214 C 100 172 146 150 200 150 C 254 150 300 172 296 214 C 292 248 250 262 200 262 C 150 262 108 248 104 214 Z" fill="url(#shellG)" ${ST}/>
  <!-- pontinhas do casco -->
  <path d="M110 188 l-12 -6 l8 14 M290 188 l12 -6 l-8 14" fill="${C.shell}" ${ST}/>
  <!-- barriga clara -->
  <path d="M140 232 C 160 252 240 252 260 232 C 252 252 230 260 200 260 C 170 260 148 252 140 232 Z" fill="${C.belly}"/>
  <!-- manchas do casco -->
  <path d="M138 182 C 150 170 168 166 180 166" fill="none" stroke="${C.bellyLt}" stroke-width="7" stroke-linecap="round" opacity=".7"/>
  <circle cx="262" cy="188" r="5" fill="${C.shellDk}" opacity=".6"/><circle cx="274" cy="202" r="3.5" fill="${C.shellDk}" opacity=".6"/>
  <circle cx="128" cy="210" r="4" fill="${C.shellDk}" opacity=".6"/>

  <!-- olhos -->
  <circle cx="168" cy="122" r="21" fill="#fff" ${ST}/>
  <circle cx="232" cy="122" r="21" fill="#fff" ${ST}/>
  <circle cx="172" cy="126" r="11" fill="${C.eye}"/><circle cx="228" cy="126" r="11" fill="${C.eye}"/>
  <circle cx="173" cy="127" r="6" fill="${C.ink}"/><circle cx="227" cy="127" r="6" fill="${C.ink}"/>
  <circle cx="168" cy="120" r="4" fill="#fff"/><circle cx="222" cy="120" r="4" fill="#fff"/>
  <!-- sobrancelhas -->
  <path d="M150 96 Q166 88 182 96 M218 96 Q234 88 250 96" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>

  <!-- sorriso -->
  <path d="M168 196 C 182 222 218 222 232 196 C 218 204 182 204 168 196 Z" fill="#6E1A0E" ${ST}/>
  <path d="M184 210 C 194 216 206 216 216 210 C 210 205 190 205 184 210 Z" fill="#E86A5A"/>
  <circle cx="148" cy="200" r="9" fill="#F4826A" opacity=".55"/><circle cx="252" cy="200" r="9" fill="#F4826A" opacity=".55"/>

  <!-- borda da frente da lata (cobre a base do casco) -->
  <path d="M92 262 A108 22 0 0 0 308 262" fill="none" stroke="${C.canLt}" stroke-width="9"/>
  <path d="M92 262 A108 22 0 0 0 308 262" fill="none" stroke="${C.canDk2}" stroke-width="2.5" transform="translate(0 5)"/>

  <!-- pernas penduradas por cima da borda -->
  ${leg([[128, 236], [92, 254], [86, 300]])}
  ${leg([[142, 246], [114, 272], [116, 318]])}
  ${leg([[272, 236], [308, 254], [314, 300]])}
  ${leg([[258, 246], [286, 272], [284, 318]])}

  <!-- braço dobrado e garra cruzada na frente -->
  <path d="M290 214 C 304 236 290 254 262 252" fill="none" stroke="${C.line}" stroke-width="26" stroke-linecap="round"/>
  <path d="M290 214 C 304 236 290 254 262 252" fill="none" stroke="${C.shell}" stroke-width="18" stroke-linecap="round"/>
  <path d="M268 232 C 252 220 222 222 206 236 C 194 246 196 262 212 266 C 236 272 262 266 272 254 C 278 246 276 238 268 232 Z" fill="url(#clawG)" ${ST}/>
  <path d="M210 240 C 196 230 180 232 176 242 C 174 250 190 254 206 250" fill="url(#clawG)" ${ST}/>
  <path d="M222 238 C 234 232 250 232 258 236" fill="none" stroke="${C.bellyLt}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
}

const sym = (label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="36 14 300 486">${symbol({ label })}</svg>`;
const symbolSvg = sym(true);
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-37 14 446 486">${symbol({ label: true })}</svg>`;
fs.writeFileSync(path.join(OUT, 'siri-na-lata.svg'), symbolSvg);
module.exports = { symbol, txt };

(async () => {
  await sharp(Buffer.from(symbolSvg), { density: 300 }).resize({ height: 1600 }).png().toFile(path.join(OUT, 'siri-na-lata-1600.png'));
  await sharp(Buffer.from(symbolSvg), { density: 200 }).resize({ height: 600 }).png().toFile(path.join(OUT, 'siri-na-lata-600.png'));
  // ícones quadrados: fundo creme com o símbolo centralizado
  const sq = (size, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-37 14 446 486" width="${size}" height="${size}">${bg ? `<rect x="-37" y="14" width="446" height="486" fill="${bg}"/>` : ''}${symbol({ label: true })}</svg>`;
  await sharp(Buffer.from(sq(512, '#F6EFDF')), { density: 200 }).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));
  await sharp(Buffer.from(sq(180, '#F6EFDF')), { density: 200 }).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
  await sharp(Buffer.from(sq(64)), { density: 200 }).resize(64, 64).png().toFile(path.join(OUT, 'favicon.png'));
  // prévia sobre fundos claro e escuro
  const big = await sharp(Buffer.from(symbolSvg), { density: 200 }).resize({ height: 640 }).png().toBuffer();
  const m = await sharp(big).metadata();
  await sharp({ create: { width: m.width * 2 + 120, height: 720, channels: 3, background: '#F6EFDF' } })
    .composite([{ input: Buffer.from(`<svg width="${m.width * 2 + 120}" height="720"><rect x="${m.width + 60}" width="${m.width + 60}" height="720" fill="#1C1714"/></svg>`) }, { input: big, left: 30, top: 40 }, { input: big, left: m.width + 90, top: 40 }])
    .png().toFile(path.join(OUT, 'preview.png'));
  console.log('ok', m.width, m.height);
})();
