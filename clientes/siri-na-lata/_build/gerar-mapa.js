// Gera o mapa estático do Siri na Lata a partir de tiles do OpenStreetMap, recolorido na paleta da casa
// (creme, pêssego e terracota, sem azul). Mesmo componente de mapa dos outros templates (THD, provedores).
//
// Uso: precisa de `sharp` instalado fora do projeto.
//   NODE_PATH=<pasta com node_modules/sharp> node clientes/siri-na-lata/_build/gerar-mapa.js
// Saída: _build/img/mapa-siri.webp (1240 x 760)
const sharp = require('sharp');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Rua São José, Balneário Estreito (trecho da beira-mar). [CONFIRMAR] posição exata do 610 com o cliente.
const [lat, lon, Z] = [-27.5779, -48.5817, 17];
const W = 1240, H = 760;
const OUT = path.join(__dirname, 'img', 'mapa-siri.webp');

const n = 2 ** Z;
const px = (lon + 180) / 360 * n * 256;
const r = lat * Math.PI / 180;
const py = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n * 256;
const x0 = px - W / 2, y0 = py - H / 2;
const tx0 = Math.floor(x0 / 256), ty0 = Math.floor(y0 / 256);
const tx1 = Math.floor((x0 + W) / 256), ty1 = Math.floor((y0 + H) / 256);

// cache fora do projeto
const cache = path.join(os.tmpdir(), 'siri-na-lata-tiles');
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

// rampa clara: rótulos em tinta, quadras areia, fundo creme, ruas brancas
const ramp = [
  [0.00, [27, 23, 20]],
  [0.55, [150, 120, 100]],
  [0.82, [228, 214, 190]],
  [0.92, [244, 239, 225]],
  [1.00, [255, 255, 255]],
];
const col = (t) => {
  for (let i = 1; i < ramp.length; i++) if (t <= ramp[i][0]) {
    const [a, ca] = ramp[i - 1], [b, cb] = ramp[i], k = (t - a) / (b - a);
    return ca.map((v, j) => v + (cb[j] - v) * k);
  }
  return ramp.at(-1)[1];
};
const WATER = [238, 205, 182]; // mar em pêssego claro, combina com o pôr do sol do site

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
    const water = B > R + 25 && B > G;
    const c = water ? WATER : col(Math.min(1, Math.max(0, l)));
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
  }
  await sharp(data, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 84 }).toFile(OUT);
  console.log('ok', OUT);
})();
