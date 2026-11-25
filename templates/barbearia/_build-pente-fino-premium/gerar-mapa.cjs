// Gera o mapa do Gold Pente Fino a partir de tiles do OpenStreetMap, recolorido na paleta (preto e osso).
// Mesmo método dos outros modelos (saloes/_build-mecha-premium/gerar-mapa.js). Nunca usar mapa do Google.
//
// Uso (sharp instalado fora do projeto, por NODE_PATH):
//   node gerar-mapa.cjs public/img/mapa.webp
//
// Ponto de exemplo: Botafogo, Rio de Janeiro, Rua São Clemente, a duas quadras do metrô (número fictício do modelo).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [lat, lon, Z] = [-22.94938, -43.18659, 16];
const W = 1240, H = 760;
const PINO_X = 0.62; // o ponto fica a 62% da largura, livre do cartão de informações (à esquerda)
const OUT = process.argv[2];
if (!OUT) { console.error('uso: node gerar-mapa.cjs <saida.webp>'); process.exit(1); }

// mapa escuro: rótulos (escuros no OSM) viram osso; quadras e lotes viram preto; ruas (brancas) ficam um cinza acima do chão
const RAMPA = [[0, [214, 212, 208]], [0.5, [118, 117, 114]], [0.75, [36, 36, 35]], [0.86, [27, 27, 26]], [0.93, [17, 17, 17]], [0.97, [18, 18, 18]], [1, [60, 60, 58]]];
const VIA = [86, 85, 82];   // avenidas (amarelas e laranjas no OSM)
const VERDE = [21, 24, 22]; // parques e morros
const AGUA = [26, 28, 31];

const n = 2 ** Z;
const px = (lon + 180) / 360 * n * 256;
const r = lat * Math.PI / 180;
const py = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n * 256;
const x0 = px - W * PINO_X, y0 = py - H / 2;
const tx0 = Math.floor(x0 / 256), ty0 = Math.floor(y0 / 256);
const tx1 = Math.floor((x0 + W) / 256), ty1 = Math.floor((y0 + H) / 256);

const cache = path.join(__dirname, 'tiles');
fs.mkdirSync(cache, { recursive: true });

async function tile(x, y) {
  const f = path.join(cache, `${Z}_${x}_${y}.png`);
  if (!fs.existsSync(f)) {
    const res = await fetch(`https://tile.openstreetmap.org/${Z}/${x}/${y}.png`, { headers: { 'User-Agent': 'static-map-builder/1.0' } });
    if (!res.ok) throw new Error(`tile ${x},${y}: ${res.status}`);
    fs.writeFileSync(f, Buffer.from(await res.arrayBuffer()));
    await new Promise((ok) => setTimeout(ok, 150));
  }
  return f;
}

const cor = (t) => {
  for (let i = 1; i < RAMPA.length; i++) if (t <= RAMPA[i][0]) {
    const [a, ca] = RAMPA[i - 1], [b, cb] = RAMPA[i], k = (t - a) / (b - a);
    return ca.map((v, j) => v + (cb[j] - v) * k);
  }
  return RAMPA.at(-1)[1];
};

(async () => {
  const comps = [];
  for (let x = tx0; x <= tx1; x++) for (let y = ty0; y <= ty1; y++)
    comps.push({ input: await tile(x, y), left: (x - tx0) * 256, top: (y - ty0) * 256 });
  const big = await sharp({ create: { width: (tx1 - tx0 + 1) * 256, height: (ty1 - ty0 + 1) * 256, channels: 3, background: '#fff' } })
    .composite(comps).png().toBuffer();
  const { data } = await sharp(big)
    .extract({ left: Math.round(x0 - tx0 * 256), top: Math.round(y0 - ty0 * 256), width: W, height: H })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (process.env.CRU) { await sharp(data, { raw: { width: W, height: H, channels: 3 } }).png().toFile(process.env.CRU); }
  for (let i = 0; i < data.length; i += 3) {
    const R = data[i], G = data[i + 1], B = data[i + 2];
    const l = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
    const agua = B > R + 25 && B > G;
    const via = R > 215 && G > 160 && B < R - 30;
    const verde = G > R + 8 && G > B;
    const c = agua ? AGUA : via ? VIA : verde ? VERDE : cor(Math.min(1, Math.max(0, l)));
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
  }
  await sharp(data, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 84 }).toFile(OUT);
  console.log('ok', OUT, tx1 - tx0 + 1, 'x', ty1 - ty0 + 1, 'tiles');
})();
