// Baixa as fotos de demonstração do Unsplash (licença livre) e gera os WebP do modelo Silver de lava car.
// Também gera os pares de antes e depois: a foto limpa é a "depois" e a "antes" é a mesma foto com sujeira aplicada aqui.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node "templates/lava-car/_build/imagens.js"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img', 'fotos');
// arquivo: [id do Unsplash, largura, altura]
const FOTOS = {
  'capa': ['1769641156615-5d561513b3fa', 1920, 1080],
  'equipe-pressao': ['1769641156615-5d561513b3fa', 1100, 1300],
  'equipe-balde': ['1607860108855-64acf2078ed9', 1200, 800],
  'esponja': ['1694678505383-676d78ea3b96', 960, 720],
  'espuma-roda': ['1608506375591-b90e1f955e4b', 960, 720],
  'roda-escova': ['1565689876697-e467b6c54da2', 960, 720],
  'painel-pincel': ['1771491237218-cbd4a707497e', 1000, 760],
  'couro': ['1682858110563-3f609263d418', 1000, 760],
  'volante-pano': ['1732357624591-f2137085659b', 1000, 760],
  'pneu-escova': ['1708805282683-50a060eba80f', 1000, 760],
  'polidora': ['1780558852670-3f49298ecc1f', 1000, 760],
  'espuma-bmw': ['1633014041037-f5446fb4ce99', 900, 1200],
  'espuma-azul': ['1704796141009-5ed5cc8ca5f3', 900, 1200],
  'vapor': ['1575844611398-2a68400b437c', 1920, 1100],
  'garagem': ['1567808291548-fc3ee04dbcf0', 1200, 1400],
  // antes e depois (depois = limpa)
  'ad-pintura': ['1508974239320-0a029497e820', 1400, 900],
  'ad-couro': ['1682858110563-3f609263d418', 1400, 900],
  'ad-painel': ['1549064233-945d7063292f', 1400, 900],
  // Instagram
  'insta-bmw': ['1633014041037-f5446fb4ce99', 640, 640],
  'insta-merc': ['1761312834150-4beefff097a7', 640, 640],
  'insta-dupla': ['1761312834165-c27d037b3a6b', 640, 640],
  'insta-tunel': ['1762933855598-273a51b47649', 640, 640],
  'insta-rolo': ['1762933868999-a7adb3f60287', 640, 640],
  'insta-jato': ['1520340356584-f9917d1eea6f', 640, 640],
  'insta-vapor': ['1575844611398-2a68400b437c', 640, 640],
  'insta-sedan': ['1485291571150-772bcfc10da5', 640, 640],
};

// camada de sujeira: poeira (ruído) por cima de tudo, lama concentrada na metade de baixo e respingos
function sujeira(w, h, seed) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let respingos = '';
  for (let i = 0; i < 140; i++) {
    const x = rnd() * w, y = h * (0.35 + 0.65 * Math.pow(rnd(), 0.6)), r = 2 + Math.pow(rnd(), 3) * 26;
    respingos += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="rgb(${96 + rnd() * 30 | 0},${74 + rnd() * 20 | 0},${48 + rnd() * 14 | 0})" opacity="${(0.25 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 0.44  0 0 0 0 0.36  0 0 0 0 0.26  0 0 0 1.1 -0.45"/></filter>
    <filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 3}"/><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 1.4 -0.8"/></filter>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stop-color="#5a4430" stop-opacity="0"/><stop offset="1" stop-color="#5a4430" stop-opacity="0.55"/></linearGradient>
    <filter id="b"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>
  <rect width="100%" height="100%" filter="url(#p)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" filter="url(#f)"/>
  <g filter="url(#b)">${respingos}</g>
</svg>`);
}

// película de poeira clara: aparece sobre pintura e couro escuros, onde a lama some
function poeira(w, h, seed) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><filter id="d" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="5" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 1.4 -0.2  0 0 0 1.4 -0.2  0 0 0 1.4 -0.2  0 0 0 0 1"/></filter><rect width="100%" height="100%" filter="url(#d)"/></svg>`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, [id, w, h]] of Object.entries(FOTOS)) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${Math.round(Math.max(w, h) * 1.3)}&q=85&fm=jpg`);
    if (!res.ok) throw new Error(`${nome}: ${res.status}`);
    const buf = await sharp(Buffer.from(await res.arrayBuffer())).resize(w, h, { fit: 'cover', position: nome.startsWith('ad-') ? 'centre' : 'attention' }).toBuffer();
    await sharp(buf).webp({ quality: w > 1000 ? 74 : 78 }).toFile(path.join(OUT, `${nome}.webp`));
    if (nome.startsWith('ad-')) {
      const fosco = await sharp(buf).modulate({ brightness: 0.9, saturation: 0.55 }).toBuffer();
      // a poeira só gruda onde a luz bate (superfície do carro), não no fundo escuro
      const ruido = await sharp(poeira(w, h, nome.length * 31 + 7)).greyscale().toBuffer();
      const mascara = await sharp(buf).greyscale().linear(1.6, -20).composite([{ input: ruido, blend: 'multiply' }]).linear(0.75, 0).blur(1.5).extractChannel(0).toBuffer();
      const pelicula = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 176, g: 160, b: 132 } } }).joinChannel(mascara, { raw: undefined }).png().toBuffer();
      await sharp(fosco).composite([{ input: pelicula, blend: 'over' }, { input: sujeira(w, h, nome.length * 977 + 13), blend: 'multiply' }])
        .webp({ quality: 74 }).toFile(path.join(OUT, `${nome}-antes.webp`));
    }
    console.log('ok', nome);
  }
  fs.copyFileSync(process.env.MOTOR || '/tmp/motor.webp', path.join(OUT, 'motor.webp'));
  await sharp(path.join(OUT, 'capa.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(__dirname, 'img', 'og.jpg'));
})();
