// Gera o mapa estático do Taioba (Santa Tereza, Belo Horizonte) a partir de tiles do OpenStreetMap, recolorido na paleta do modelo.
// Mesmo método do THD (templates/assessoria-provedor/_build/gerar-mapa.js). Nunca usar mapa do Google.
//
// Uso (sharp instalado fora do projeto):
//   node gerar-mapa.js quintal img/mapa_santa-tereza.webp
//
// Ponto: Rua Mármore, Santa Tereza, Belo Horizonte (endereço fictício na rua real).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// o centro fica a oeste do ponto: o restaurante aparece em 66% da largura, livre do cartão de informações
const [lat, lon, Z] = [-19.91575, -43.91640 - 0.00212, 17];
const W = 1240, H = 760;
const [TEMA, OUT] = process.argv.slice(2);

// rampas de cor (do escuro dos rótulos ao claro das ruas) e cor da água, por modelo
const TEMAS = {
  quintal: {
    ramp: [[0, [31, 58, 43]], [0.55, [120, 140, 112]], [0.82, [232, 224, 204]], [0.92, [244, 238, 225]], [1, [252, 249, 242]]],
    agua: [168, 196, 186],
  },
};
const T = TEMAS[TEMA];
if (!T || !OUT) { console.error('uso: node gerar-mapa.js <quintal> <saida.webp>'); process.exit(1); }

const n = 2 ** Z;
const px = (lon + 180) / 360 * n * 256;
const r = lat * Math.PI / 180;
const py = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n * 256;
const x0 = px - W / 2, y0 = py - H / 2;
const tx0 = Math.floor(x0 / 256), ty0 = Math.floor(y0 / 256);
const tx1 = Math.floor((x0 + W) / 256), ty1 = Math.floor((y0 + H) / 256);

const cache = process.env.TILES || path.join(require('os').tmpdir(), 'osm-tiles');
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

const col = (t) => {
  const ramp = T.ramp;
  for (let i = 1; i < ramp.length; i++) if (t <= ramp[i][0]) {
    const [a, ca] = ramp[i - 1], [b, cb] = ramp[i], k = (t - a) / (b - a);
    return ca.map((v, j) => v + (cb[j] - v) * k);
  }
  return ramp.at(-1)[1];
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

  for (let i = 0; i < data.length; i += 3) {
    const R = data[i], G = data[i + 1], B = data[i + 2];
    const l = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
    const agua = B > R + 25 && B > G;
    const c = agua ? T.agua : col(Math.min(1, Math.max(0, l)));
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
  }
  await sharp(data, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 84 }).toFile(OUT);
  console.log('ok', OUT, tx1 - tx0 + 1, 'x', ty1 - ty0 + 1, 'tiles');
})();
