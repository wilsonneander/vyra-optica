// Recorta a foto do hambúrguer desmontado em camadas (uma por ingrediente) com fundo
// transparente, e tira o fundo branco da foto do hambúrguer montado.
// O site anima as camadas descendo e subindo até se juntarem, e no fim troca pela foto montada.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node templates/fastfood/_build/camadas.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FONTE = path.join(__dirname, 'img', 'fonte');
const OUT = path.join(__dirname, 'img', 'camadas');

// cor do pixel em HSV (h 0..360, s e v 0..1)
const hsv = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx / 255];
};

// classificadores de cor de cada ingrediente
const fundo = (h, s, v) => s < 0.1 && v > 0.88;
const verde = (h, s, v) => h >= 56 && h <= 150 && s > 0.2;
const vermelho = (h, s, v) => (h <= 14 || h >= 350) && s > 0.45 && v > 0.35;
const roxo = (h, s, v) => (h >= 265 && h < 350 && s > 0.12) || ((h >= 350 || h < 12) && s > 0.1 && s < 0.42);
const amarelo = (h, s, v) => h >= 36 && h <= 58 && s > 0.45 && v > 0.6;
const carne = (h, s, v) => v < 0.5 && !verde(h, s, v);
const pao = (h, s, v) => h >= 14 && h < 52 && !amarelo(h, s, v) && !fundo(h, s, v);
const naoVerde = (h, s, v) => !verde(h, s, v) && !fundo(h, s, v);
const pepinoRoxo = (h, s, v) => roxo(h, s, v) || (h >= 55 && h <= 110 && s > 0.15);

// limites entre camadas da foto desmontada (533x800): faixa onde o corte pode passar
// e o que é "de cima" (A) e "de baixo" (B)
const CORTES = [
  { de: 150, ate: 210, A: pao, B: verde },            // pão de cima | alface
  { de: 205, ate: 270, A: verde, B: vermelho },       // alface | tomate
  { de: 268, ate: 322, A: vermelho, B: roxo },        // tomate | cebola
  { de: 340, ate: 392, A: pepinoRoxo, B: amarelo },   // cebola e pepino | queijo
  { de: 384, ate: 470, A: amarelo, B: carne },        // queijo | carne
  { de: 466, ate: 525, A: carne, B: verde },          // carne | alface de baixo
  { de: 512, ate: 560, A: verde, B: naoVerde },       // alface | pão de baixo
];
const NOMES = ['pao-cima', 'alface', 'tomate', 'cebola', 'queijo', 'carne', 'alface-baixo', 'pao-baixo'];
const FIM = 641; // abaixo disso é só a sombra (o site desenha a própria sombra)

// alfa do fundo: branco puro some, quase branco fica translúcido
const alfaFundo = (r, g, b) => {
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  if (mx - mn > 26) return 255;
  return Math.max(0, Math.min(255, Math.round((242 - mn) / 34 * 255)));
};
// tira o branco do fundo que ficou misturado na borda (cor = (c - (1 - a) * 255) / a)
const semBranco = (c, a) => (a >= 255 || a === 0 ? c
  : Math.max(0, Math.min(255, Math.round((c - (1 - a / 255) * 255) / (a / 255)))));

// corte de menor custo da esquerda para a direita (programação dinâmica, desce ou sobe até 2px por coluna)
function costura(cls, W, corte) {
  const { de, ate } = corte, N = ate - de;
  const custo = new Float64Array(W * N);
  for (let x = 0; x < W; x++) {
    // custo de cortar em y: pixels B acima do corte + pixels A abaixo
    let bAcima = 0, aAbaixo = 0;
    for (let y = de; y < ate; y++) if (cls(x, y, corte.A)) aAbaixo++;
    for (let i = 0; i < N; i++) {
      const y = de + i;
      custo[x * N + i] = bAcima + aAbaixo + Math.abs(i - N / 2) * 0.02;
      if (cls(x, y, corte.B)) bAcima++;
      if (cls(x, y, corte.A)) aAbaixo--;
    }
  }
  const acum = new Float64Array(W * N), de_ = new Int32Array(W * N);
  for (let i = 0; i < N; i++) acum[i] = custo[i];
  for (let x = 1; x < W; x++) for (let i = 0; i < N; i++) {
    let best = Infinity, bi = i;
    for (let d = -2; d <= 2; d++) {
      const j = i + d; if (j < 0 || j >= N) continue;
      const c = acum[(x - 1) * N + j] + Math.abs(d) * 0.3;
      if (c < best) { best = c; bi = j; }
    }
    acum[x * N + i] = best + custo[x * N + i]; de_[x * N + i] = bi;
  }
  let i = 0;
  for (let j = 1; j < N; j++) if (acum[(W - 1) * N + j] < acum[(W - 1) * N + i]) i = j;
  const ys = new Int32Array(W);
  for (let x = W - 1; x >= 0; x--) { ys[x] = de + i; i = de_[x * N + i]; }
  return ys;
}

async function desmontado() {
  const { data, info } = await sharp(path.join(FONTE, 'burger-desmontado.jpg'))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => { const k = (y * W + x) * 3; return [data[k], data[k + 1], data[k + 2]]; };
  const cls = (x, y, fn) => { const [r, g, b] = px(x, y); return fn(...hsv(r, g, b)); };

  const linhas = CORTES.map((c) => costura(cls, W, c));
  const limites = [new Int32Array(W).fill(0), ...linhas, new Int32Array(W).fill(FIM)];

  fs.mkdirSync(OUT, { recursive: true });
  const meta = [];
  // camada de cada pixel: primeiro pela costura; dentro da faixa de um corte, a cor decide
  const camadaDe = (x, y) => {
    let n = 0;
    while (n < NOMES.length && y >= limites[n + 1][x]) n++;
    if (n >= NOMES.length) return -1;
    const [r, g, b] = px(x, y); const c = hsv(r, g, b);
    for (const k of [n - 1, n]) {
      const corte = CORTES[k];
      if (!corte || y < corte.de || y >= corte.ate) continue;
      if (corte.A(...c)) return k;
      if (corte.B(...c)) return k + 1;
    }
    return n;
  };
  const dono = new Int8Array(W * H).fill(-1);
  for (let x = 0; x < W; x++) for (let y = 0; y < FIM; y++) dono[y * W + x] = camadaDe(x, y);

  for (let n = 0; n < NOMES.length; n++) {
    let y0 = H, y1 = 0;
    const rgba = Buffer.alloc(W * H * 4);
    for (let x = 0; x < W; x++) for (let y = 0; y < FIM; y++) {
      if (dono[y * W + x] !== n) continue;
      const [r, g, b] = px(x, y);
      const a = alfaFundo(r, g, b);
      const k = (y * W + x) * 4;
      rgba[k] = semBranco(r, a); rgba[k + 1] = semBranco(g, a); rgba[k + 2] = semBranco(b, a); rgba[k + 3] = a;
      if (a > 40) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    const caixa = { left: 0, top: y0, width: W, height: y1 - y0 + 1 };
    await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
      .extract(caixa).webp({ quality: 88, alphaQuality: 90 })
      .toFile(path.join(OUT, `${NOMES[n]}.webp`));
    meta.push({ nome: NOMES[n], topo: y0, altura: caixa.height });
  }
  return { largura: W, altura: H, camadas: meta };
}

// foto montada: some o fundo branco ligado à borda e a sombra vira sombra de verdade (preta translúcida)
async function montado() {
  const { data, info } = await sharp(path.join(FONTE, 'burger-montado.png'))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const neutro = (k) => {
    const r = data[k], g = data[k + 1], b = data[k + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) < 30 && Math.min(r, g, b) > 120;
  };
  const visto = new Uint8Array(W * H), fila = [];
  for (let x = 0; x < W; x++) fila.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) fila.push(y * W, y * W + W - 1);
  while (fila.length) {
    const p = fila.pop();
    if (visto[p] || !neutro(p * 3)) continue;
    visto[p] = 1;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) fila.push(p - 1); if (x < W - 1) fila.push(p + 1);
    if (y > 0) fila.push(p - W); if (y < H - 1) fila.push(p + W);
  }
  const rgba = Buffer.alloc(W * H * 4);
  let y0 = H, y1 = 0;
  for (let p = 0; p < W * H; p++) {
    const k = p * 3, j = p * 4;
    if (visto[p]) {
      const lum = (data[k] + data[k + 1] + data[k + 2]) / 3;
      const a = Math.max(0, Math.min(1, (247 - lum) / 70)) * 150;
      rgba[j] = 40; rgba[j + 1] = 22; rgba[j + 2] = 12; rgba[j + 3] = Math.round(a);
    } else {
      rgba[j] = data[k]; rgba[j + 1] = data[k + 1]; rgba[j + 2] = data[k + 2]; rgba[j + 3] = 255;
      const y = (p / W) | 0; y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(OUT, 'montado.webp'));
  // contorno do lanche (sem sombra), para o site encaixar as camadas no mesmo lugar
  let x0 = W, x1 = 0;
  for (let p = 0; p < W * H; p++) if (!visto[p]) { const x = p % W; x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  return { largura: W, altura: H, topo: y0, base: y1, esq: x0, dir: x1 };
}

(async () => {
  const meta = { desmontado: await desmontado(), montado: await montado() };
  fs.writeFileSync(path.join(OUT, 'camadas.json'), JSON.stringify(meta, null, 2));
  console.log(JSON.stringify(meta, null, 1));
})();
