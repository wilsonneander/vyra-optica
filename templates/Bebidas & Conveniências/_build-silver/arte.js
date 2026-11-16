// Ilustrações próprias das embalagens (SVG), modelo Silver. Nenhum logo real: só a forma, as cores do produto e o nome em texto.
// Todas usam o mesmo quadro 120 x 240 e a mesma base (y = 236), então ficam alinhadas na prateleira.
const B = 236;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;');

// texto que cabe na largura disponível (Syne 800 tem ~0,68em por letra)
const texto = (t, x, y, larg, max, cor, rot) => {
  const fs = Math.min(max, larg / (t.length * 0.66)).toFixed(1);
  const tr = rot ? ` transform="rotate(-90 ${x} ${y})"` : '';
  return `<text x="${x}" y="${y}" font-size="${fs}" fill="${cor}" text-anchor="middle" dominant-baseline="central"${tr}>${esc(t)}</text>`;
};
const sub = (t, x, y, cor) => (t ? `<text class="s" x="${x}" y="${y}" font-size="8" fill="${cor}" text-anchor="middle" letter-spacing="1.2">${esc(t.toUpperCase())}</text>` : '');
const brilho = (x, y, h, w = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="#fff" opacity=".32"/>`;
const sombra = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" opacity=".1"/>`;
const tampinha = (cx, y, cor) => {
  // tampa coroa vista de lado: faixa com dentinhos embaixo
  let d = `M${cx - 9} ${y} H${cx + 9} V${y + 7}`;
  for (let i = 0; i < 6; i++) d += ` L${cx + 9 - i * 3 - 1.5} ${y + 9} L${cx + 9 - (i + 1) * 3} ${y + 7}`;
  return `<path d="${d} Z" fill="${cor}"/>`;
};

function lata(p, topo, x0, x1) {
  const cx = (x0 + x1) / 2, meio = (topo + 12 + B - 40) / 2, w = x1 - x0;
  const corpo = `M${x0 + 5} ${topo} L${x1 - 5} ${topo} L${x1} ${topo + 12} L${x1} ${B - 8} Q${x1} ${B} ${x1 - 8} ${B} L${x0 + 8} ${B} Q${x0} ${B} ${x0} ${B - 8} L${x0} ${topo + 12} Z`;
  const faixa = p.rot && p.rot !== p.cor ? `<rect x="${x0}" y="${B - 36}" width="${w}" height="12" fill="${p.rot}"/><rect x="${x0}" y="${topo + 14}" width="${w}" height="4" fill="${p.rot}"/>` : '';
  return `<rect x="${x0 + 6}" y="${topo - 5}" width="${w - 12}" height="7" rx="2" fill="#C5CACE"/><rect x="${cx - 6}" y="${topo - 7}" width="12" height="4" rx="2" fill="#AEB4B9"/>
<path d="${corpo}" fill="${p.cor}"/>${faixa}
${texto(p.rotulo, cx, meio, B - topo - 70, 22, p.txt, true)}${sub(p.sub, cx, B - 12, p.txt)}
${sombra(x1 - 9, topo + 12, 9, B - topo - 20)}${brilho(x0 + 6, topo + 14, B - topo - 30)}`;
}

function vidro(p, d, tampaY, rotY, rotH, gargalo, larg) {
  const cx = 60;
  const ar = p.vidro ? `<rect x="${cx - gargalo}" y="${tampaY + 10}" width="${gargalo * 2}" height="20" fill="#fff" opacity=".5"/>` : '';
  return `<path d="${d}" fill="${p.cor}"/>${ar}
<rect x="${cx - larg}" y="${rotY}" width="${larg * 2}" height="${rotH}" fill="${p.rot}"/>
${texto(p.rotulo, cx, rotY + rotH / 2 - (p.sub ? 4 : 0), larg * 2 - 8, 17, p.txt)}${sub(p.sub, cx, rotY + rotH - 7, p.txt)}
${tampinha(cx, tampaY, p.tampa || '#C9A646')}`;
}

const formas = {
  lata: (p) => lata(p, 120, 32, 88),
  latao: (p) => lata(p, 90, 32, 88),
  slim: (p) => lata(p, 112, 39, 81),

  longneck: (p) => vidro(p, `M54 40 L66 40 L66 92 C66 110 84 114 84 134 L84 228 Q84 236 76 236 L44 236 Q36 236 36 228 L36 134 C36 114 54 110 54 92 Z`, 31, 162, 44, 6, 24)
    + `<rect x="54" y="70" width="12" height="12" fill="${p.rot}"/>${brilho(41, 138, 86)}${brilho(56, 44, 40, 3)}`,

  litrao: (p) => vidro(p, `M53 32 L67 32 L67 82 C67 104 90 108 90 132 L90 228 Q90 236 82 236 L38 236 Q30 236 30 228 L30 132 C30 108 53 104 53 82 Z`, 23, 150, 52, 7, 30)
    + `${brilho(36, 136, 90)}${brilho(56, 36, 42, 3)}`,

  pet: (p) => `<path d="M52 24 L68 24 L68 34 C68 50 92 56 92 80 L92 150 C88 156 88 162 92 168 L92 222 Q92 236 78 236 L42 236 Q28 236 28 222 L28 168 C32 162 32 156 28 150 L28 80 C28 56 52 50 52 34 Z" fill="${p.cor}"/>
<rect x="52" y="24" width="16" height="16" fill="#fff" opacity=".55"/><rect x="50" y="6" width="20" height="15" rx="2" fill="${p.tampa || p.rot}"/><rect x="48" y="20" width="24" height="4" rx="1" fill="${p.tampa || p.rot}" opacity=".8"/>
<rect x="28" y="100" width="64" height="44" fill="${p.rot}"/>${texto(p.rotulo, 60, 122 - (p.sub ? 4 : 0), 56, 17, p.txt)}${sub(p.sub, 60, 137, p.txt)}
<path d="M28 196 H92 M28 212 H92" stroke="#fff" stroke-width="1.4" opacity=".22"/>${sombra(83, 80, 9, 140)}${brilho(33, 150, 70)}${brilho(33, 74, 22)}`,

  petm: (p) => `<path d="M53 55 L67 55 L67 64 C67 78 88 84 88 104 L88 224 Q88 236 76 236 L44 236 Q32 236 32 224 L32 104 C32 84 53 78 53 64 Z" fill="${p.cor}"/>
<rect x="53" y="55" width="14" height="12" fill="#fff" opacity=".5"/><rect x="51" y="40" width="18" height="13" rx="2" fill="${p.tampa || p.rot}"/><rect x="49" y="52" width="22" height="3" fill="${p.tampa || p.rot}" opacity=".8"/>
<rect x="32" y="128" width="56" height="44" fill="${p.rot}"/>${texto(p.rotulo, 60, 150 - (p.sub ? 4 : 0), 48, 16, p.txt)}${sub(p.sub, 60, 165, p.txt)}
${sombra(80, 104, 8, 120)}${brilho(37, 178, 46)}${brilho(37, 100, 22)}`,

  agua: (p) => `<path d="M54 92 L66 92 L66 100 C66 110 82 116 82 130 L82 226 Q82 236 72 236 L48 236 Q38 236 38 226 L38 130 C38 116 54 110 54 100 Z" fill="${p.cor}" opacity=".9"/>
<path d="M38 150 H82 M38 210 H82" stroke="#fff" stroke-width="2" opacity=".7"/><rect x="52" y="78" width="16" height="13" rx="2" fill="${p.tampa}"/>
<rect x="38" y="160" width="44" height="40" fill="${p.rot}"/>${texto(p.rotulo, 60, 178 - (p.sub ? 4 : 0), 38, 13, p.txt)}${sub(p.sub, 60, 193, p.txt)}${brilho(42, 128, 26, 4)}${brilho(42, 214, 14, 4)}`,

  galao: (p) => `<path d="M52 70 L68 70 L68 80 L96 98 Q104 104 104 114 L104 226 Q104 236 94 236 L26 236 Q16 236 16 226 L16 114 Q16 104 24 98 L52 80 Z" fill="${p.cor}" opacity=".9"/>
<path d="M74 84 L92 96 Q97 100 97 106 L97 118" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/><rect x="50" y="56" width="20" height="15" rx="2" fill="${p.tampa}"/>
<rect x="16" y="150" width="88" height="46" fill="${p.rot}"/>${texto(p.rotulo, 60, 168, 76, 20, p.txt)}${sub('5 litros', 60, 186, p.txt)}${brilho(22, 116, 30, 5)}${brilho(22, 202, 22, 5)}`,

  garrafa: (p) => vidro(p, `M52 40 L68 40 L68 70 C68 88 88 92 88 112 L88 226 Q88 236 78 236 L42 236 Q32 236 32 226 L32 112 C32 92 52 88 52 70 Z`, 14, 146, 50, 8, 28)
    + `<rect x="50" y="14" width="20" height="26" rx="2" fill="${p.tampa || '#2A1A12'}"/>${sombra(80, 112, 8, 114)}${brilho(37, 116, 108)}${brilho(55, 44, 26, 3)}`,

  quadrada: (p) => `<path d="M52 44 L68 44 L68 74 L90 96 L90 230 Q90 236 84 236 L36 236 Q30 236 30 230 L30 96 L52 74 Z" fill="${p.cor}"/>
<rect x="50" y="18" width="20" height="27" rx="2" fill="${p.tampa}"/><path d="M30 156 L90 142 L90 178 L30 192 Z" fill="${p.rot}"/>
<g transform="rotate(-13 60 167)">${texto(p.rotulo, 60, 167, 52, 15, p.txt)}</g>${sombra(81, 98, 9, 132)}${brilho(35, 100, 40)}${brilho(35, 200, 26)}`,

  caixinha: (p) => `<path d="M34 92 L57 76 L80 92 Z" fill="${p.cor}"/><path d="M34 92 L57 76 L80 92 Z" fill="#000" opacity=".08"/>
<path d="M80 92 L90 84 L90 228 L80 236 Z" fill="${p.cor}"/><path d="M80 92 L90 84 L90 228 L80 236 Z" fill="#000" opacity=".2"/>
<rect x="34" y="92" width="46" height="144" fill="${p.cor}"/><circle cx="66" cy="86" r="5" fill="${p.rot}"/>
<rect x="34" y="196" width="46" height="14" fill="${p.rot}"/><circle cx="57" cy="166" r="12" fill="#fff" opacity=".22"/>
${texto(p.rotulo, 57, 132, 40, 14, p.txt)}${brilho(38, 98, 92, 4)}`,

  saco: (p) => `<path d="M30 82 Q60 72 90 82 L96 226 Q96 236 86 236 L34 236 Q24 236 24 226 Z" fill="${p.cor}"/><rect x="28" y="72" width="64" height="12" rx="2" fill="${p.rot}"/>
${p.id === 'gelo' ? '<rect x="38" y="194" width="16" height="16" rx="3" fill="#fff" opacity=".7"/><rect x="60" y="200" width="14" height="14" rx="3" fill="#fff" opacity=".6"/><rect x="48" y="210" width="15" height="15" rx="3" fill="#fff" opacity=".8"/>' : ''}
<rect x="26" y="134" width="68" height="40" fill="${p.rot}"/>${texto(p.rotulo, 60, 154, 58, 17, p.txt)}${brilho(32, 92, 36)}`,
};

// gotas de condensação: aparecem nas bebidas do palco e nos cards (o CSS faz escorrer)
const GOTAS = [[44, 150, 2.2], [70, 168, 1.6], [52, 196, 2.6], [76, 210, 1.8], [46, 222, 1.4], [64, 136, 1.5], [58, 182, 1.2], [72, 228, 2]];
const gotas = () => `<g class="gotas">${GOTAS.map(([x, y, r], i) => `<ellipse style="--i:${i}" cx="${x}" cy="${y}" rx="${r}" ry="${(r * 1.35).toFixed(2)}" fill="#fff" opacity=".55"/>`).join('')}</g>`;

// p = produto; cls = classe extra; g = desenhar gotas
const arte = (p, cls = '', g = false) => `<svg class="arte ${cls}" viewBox="0 0 120 240" aria-hidden="true" data-arte="${p.id}">${formas[p.forma](p)}${g && p.forma !== 'saco' ? gotas() : ''}</svg>`;

module.exports = { arte };
