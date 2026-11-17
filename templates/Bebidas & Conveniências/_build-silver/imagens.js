// Trata as fotos reais do modelo Silver: recorta o fundo claro dos produtos (vira transparente), apara, reduz e gera WebP.
// Originais em img/originais/ (enviados pelo cliente ou baixados de lojas online; fora do git por tamanho).
// Saída em img/fotos/ (produtos, ambiente, logos) + img/fotos/medidas.json, que o build usa para width/height.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node "templates/Bebidas & Conveniências/_build-silver/imagens.js"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIG = path.join(__dirname, 'img', 'originais');
const OUT = path.join(__dirname, 'img', 'fotos');

// recorte de fundo: tol = quanto a cor pode fugir da cor do canto e ainda ser fundo; crop = recorte antes de tudo
const PRODUTOS = {
  'coca-2l': {}, 'coca-vidro': { tol: 16 }, 'coca-zero-lata': {}, 'guarana-lata': {}, 'guarana-zero-lata': {}, 'guarana-zero-2l': {},
  'fanta-lata': {}, 'sprite-2l': {}, 'sprite-zero-lata': {}, 'schweppes-lata': {},
  'monster': {}, 'monster-violet': {}, 'monster-peachy': {}, 'monster-zero': {}, 'redbull': {},
  'heineken-ln': {}, 'heineken-lata': {}, 'heineken-zero': {}, 'heineken-dupla': {}, 'budweiser-ln': {}, 'budweiser-lata': {}, 'budweiser-aluminio': {},
  'brahma-lata': {}, 'amstel-lata': {}, 'original-lata': {}, 'skol-lata': {}, 'spaten-lata': {}, 'sol-ln': {}, 'cervejas-grupo': { tol: 34 },
  'smirnoff': {}, 'absolut': { tol: 14 }, 'red-label': {}, 'tanqueray': {},
  'vinho-pergola': {}, 'vinho-miolo': {}, 'vinho-campo-largo': {}, 'vinho-vindima': { tol: 70, crop: { left: 850, top: 60, width: 330, height: 1940 } },
  'matte': {}, 'del-valle-uva': {}, 'ades-laranja': {},
  'crystal': { tol: 14 }, 'crystal-azul': { tol: 14 }, 'galao-hydrate': { tol: 8 },
  'gelo': { tol: 14 }, 'copo': { tol: 14 }, 'carvao': {},
};
const AMBIENTE = { 'amb-heineken-bar': 1400, 'amb-balde-corona': 1400, 'amb-brinde': 1800, 'amb-canecas': 1200, 'amb-skol-litrao': 1200, 'amb-drinks-gin': 1200,
  'drink-rose': 900, 'drink-gin-frutas': 900, 'drink-soda-frutas': 700, 'drink-spritz-morango': 900, 'drink-maracuja': 900 };
const LOGOS = { 'logo-coca': {}, 'logo-fanta': { tol: 30 }, 'logo-guarana': {}, 'logo-sprite': {}, 'logo-ifood': { manter: true },
  'logo-99food-largo': { manter: true, crop: { left: 1330, top: 440, width: 2000, height: 1500 } } };

const origem = (nome) => { const f = fs.readdirSync(ORIG).find((x) => x.replace(/\.[^.]+$/, '') === nome); if (!f) throw new Error('falta ' + nome); return path.join(ORIG, f); };

// apaga o fundo por inundação a partir das bordas: só some o que está ligado à borda e parecido com a cor dos cantos
async function recorta(arquivo, { tol = 24, crop, manter } = {}) {
  let img = sharp(arquivo).rotate();
  if (crop) img = img.extract(crop);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = (x, y) => (y * W + x) * 4;
  const cantos = [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]].map(([x, y]) => [...data.subarray(px(x, y), px(x, y) + 4)]).filter((c) => c[3] > 200);
  if (manter || cantos.length < 3) return sharp(data, { raw: info }); // já transparente (ou é para manter o fundo)
  const perto = (k) => cantos.some((c) => Math.abs(data[k] - c[0]) + Math.abs(data[k + 1] - c[1]) + Math.abs(data[k + 2] - c[2]) < tol * 3);
  const fundo = new Uint8Array(W * H);
  const fila = [];
  for (let x = 0; x < W; x++) fila.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) fila.push([0, y], [W - 1, y]);
  while (fila.length) {
    const [x, y] = fila.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const i = y * W + x;
    if (fundo[i] || !perto(i * 4)) continue;
    fundo[i] = 1;
    fila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  // máscara suavizada (contorno sem serrilhado) aplicada no canal alfa
  const mascara = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) mascara[i] = fundo[i] ? 0 : 255;
  const suave = await sharp(mascara, { raw: { width: W, height: H, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer();
  for (let i = 0; i < W * H; i++) data[i * 4 + 3] = Math.min(data[i * 4 + 3], suave[i]);
  return sharp(data, { raw: info });
}

(async () => {
  const medidas = {};
  for (const d of ['produtos', 'ambiente', 'logos']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const salva = async (pipe, d, nome, caixa, q = 82) => {
    // apara primeiro (o trim de PNG transparente usa o alfa), depois reduz
    const png = await pipe.png().toBuffer();
    const apar = caixa ? await sharp(png).trim({ threshold: 1 }).toBuffer() : png;
    const r = caixa ? sharp(apar).resize({ width: caixa[0], height: caixa[1], fit: 'inside', withoutEnlargement: true }) : sharp(apar);
    const info = await r.webp({ quality: q, alphaQuality: 90, effort: 5 }).toFile(path.join(OUT, d, nome + '.webp'));
    medidas[`${d}/${nome}`] = [info.width, info.height];
    console.log(d, nome, info.width + 'x' + info.height, (info.size / 1024).toFixed(0) + 'KB');
  };
  for (const [nome, op] of Object.entries(PRODUTOS)) await salva(await recorta(origem(nome), op), 'produtos', nome, [520, 760]);
  for (const [nome, op] of Object.entries(LOGOS)) await salva(await recorta(origem(nome), op), 'logos', nome, [600, 400], 90);
  for (const [nome, w] of Object.entries(AMBIENTE)) await salva(sharp(origem(nome)).rotate().resize({ width: w, withoutEnlargement: true }), 'ambiente', nome, null, 76);
  fs.writeFileSync(path.join(OUT, 'medidas.json'), JSON.stringify(medidas, null, 1));
})();
