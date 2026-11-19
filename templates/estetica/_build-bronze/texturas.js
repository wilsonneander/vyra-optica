// Texturas próprias da Camélia, geradas aqui como SVG e embutidas no CSS (nenhum arquivo extra).
// papel: grão fino de papel de algodão em toda a página
// pele: curvas de nível que lembram a textura da pele, atrás dos tratamentos
// petalas: pétalas soltas tom sobre tom, na faixa rosa do atendimento
// ouro: lascas de folha de ouro espalhadas, no rodapé vinho
// camelia: camélia grande só no contorno, atrás da capa
// Sorteio com semente fixa: o desenho sai igual a cada build.
let semente = 7;
const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
const n = (v) => Math.round(v * 10) / 10;
// codifica só o necessário, bem menor que encodeURIComponent
const uri = (svg) => {
  const limpo = svg.replace(/\s+/g, ' ').replace(/> </g, '><').trim().replace(/"/g, "'");
  return `url("data:image/svg+xml,${limpo.replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
};

const papel = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 .29  0 0 0 0 .09  0 0 0 0 .14  0 0 0 .55 0"/></filter>
  <rect width="220" height="220" filter="url(#g)" opacity=".22"/></svg>`);

// curvas de nível: anéis tortos em volta de três centros, como uma impressão digital ampliada
const anel = (cx, cy, r, fase, amp) => {
  const pts = [];
  for (let a = 0; a < 48; a++) {
    const t = (a / 48) * Math.PI * 2;
    const rr = r + Math.sin(t * 3 + fase) * amp + Math.sin(t * 5 - fase * 1.7) * amp * .45;
    pts.push(`${Math.round(cx + Math.cos(t) * rr * 1.18)} ${Math.round(cy + Math.sin(t) * rr)}`);
  }
  return `M${pts.join(' ')}Z`;
};
const centros = [[980, 180, 22], [180, 860, 16], [1180, 1040, 12]];
const pele = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1200" preserveAspectRatio="xMidYMid slice">
  <g fill="none" stroke="#B99D70" stroke-width="1.1" stroke-opacity=".26">${centros.map(([cx, cy, q]) => Array.from({ length: q }, (_, i) => `<path d="${anel(cx, cy, 26 + i * 24, i * .5 + cx / 300, 6 + i * 1.4)}"/>`).join('')).join('')}</g></svg>`);

// pétala da marca, solta e girada, num ladrilho que se repete sem emenda
const petala = (x, y, s, a) => `<path transform="translate(${n(x)} ${n(y)}) rotate(${Math.round(a)}) scale(${n(s)})" d="M0 0C-9 -6 -9 -17 0 -24C9 -17 9 -6 0 0Z"/>`;
const ladrilho = 520;
const petalasPts = [];
for (let i = 0; i < 11; i++) {
  const x = rnd() * ladrilho, y = rnd() * ladrilho, s = .6 + rnd() * 1.1, a = rnd() * 360;
  for (const dx of [-ladrilho, 0, ladrilho]) for (const dy of [-ladrilho, 0, ladrilho]) {
    const px = x + dx, py = y + dy;
    if (px > -30 && px < ladrilho + 30 && py > -30 && py < ladrilho + 30) petalasPts.push(petala(px, py, s, a));
  }
}
const petalas = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="${ladrilho}" height="${ladrilho}">
  <g fill="#E3C3BC" fill-opacity=".3" stroke="#C99A92" stroke-opacity=".22" stroke-width=".8">${petalasPts.join('')}</g></svg>`);

// lascas de ouro: polígonos pequenos e irregulares
const lasca = (x, y, r) => {
  const lados = 4 + Math.floor(rnd() * 3);
  const pts = Array.from({ length: lados }, (_, i) => {
    const t = (i / lados) * Math.PI * 2 + rnd() * .6, rr = r * (.5 + rnd() * .7);
    return `${n(x + Math.cos(t) * rr)},${n(y + Math.sin(t) * rr)}`;
  });
  return `<polygon points="${pts.join(' ')}" fill-opacity="${n(.18 + rnd() * .4)}"/>`;
};
const ouroPts = Array.from({ length: 34 }, () => lasca(8 + rnd() * 304, 8 + rnd() * 304, 1 + rnd() * (rnd() > .85 ? 5 : 2.2)));
const ouro = uri(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><g fill="#C9AE7E">${ouroPts.join('')}</g></svg>`);

// camélia grande em contorno: duas voltas de pétalas
const pet = (r, d, a) => `<path d="M0 0C${-d} ${-r * .3} ${-d} ${-r * .85} 0 ${-r}C${d} ${-r * .85} ${d} ${-r * .3} 0 0Z" transform="rotate(${a})"/>`;
const camelia = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -300 600 600">
  <g fill="none" stroke="#C99A92" stroke-opacity=".42" stroke-width="1.4" stroke-linejoin="round">
  ${[0, 72, 144, 216, 288].map((a) => pet(280, 110, a + 8)).join('')}
  ${[36, 108, 180, 252, 324].map((a) => pet(190, 72, a + 8)).join('')}
  ${[0, 72, 144, 216, 288].map((a) => pet(110, 40, a + 20)).join('')}
  <circle r="22"/><circle r="10"/></g></svg>`);

const css = `:root { --tx-papel: ${papel}; --tx-pele: ${pele}; --tx-petalas: ${petalas}; --tx-ouro: ${ouro}; --tx-camelia: ${camelia}; }`;
module.exports = { css };
