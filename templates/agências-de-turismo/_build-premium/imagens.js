// Prepara as imagens do modelo Premium (Peakalika Turismo) a partir das imagens do site original (peakalikaturismo.com).
// Converte tudo para WebP no tamanho de uso e gera a logo branca com fundo transparente (a original é laranja chapada).
//
// Uso (sharp instalado fora do projeto, como nos outros modelos):
//   ORIGEM=<pasta com as imagens baixadas de peakalikaturismo.com/images> node imagens.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIGEM = process.env.ORIGEM;
if (!ORIGEM) { console.error('defina ORIGEM com a pasta das imagens originais'); process.exit(1); }
const OUT = path.join(__dirname, 'img', 'fotos');
fs.mkdirSync(OUT, { recursive: true });

// [arquivo original, nome de saída, largura máxima, qualidade]
const LISTA = [
  // destinos internacionais
  ['paris.webp', 'paris', 1200], ['rome.webp', 'roma', 1200], ['spain.webp', 'madrid', 1200], ['lisbon.avif', 'lisboa', 1200],
  ['london.webp', 'londres', 1200], ['dubai.webp', 'dubai', 1200], ['Tokyo.avif', 'toquio', 1200], ['venice.webp', 'veneza', 1200],
  ['new-york.webp', 'nova-york', 1600],
  // serviços
  ['hosting.webp', 'hospedagem', 760], ['tickets.webp', 'passagens', 760], ['packages.webp', 'pacotes', 760], ['tours.webp', 'passeios', 760],
  ['transfers.webp', 'transfers', 760], ['insurance.webp', 'seguros', 760], ['car-rental.webp', 'carros', 760], ['universal.webp', 'universal', 760],
  ['xcaret.webp', 'xcaret', 760], ['cruise.webp', 'cruzeiros', 760], ['disney-services.webp', 'disney', 760],
  // vistos, equipe e clientes
  ['passaport.webp', 'passaporte', 900], ['post-insta1.webp', 'consultora', 1000],
  ['isadora-client.png', 'cliente-isadora', 180], ['laodiceia.webp', 'cliente-laodiceia', 180], ['Larissa-client.png', 'cliente-larissa', 180], ['leo-client.webp', 'cliente-leo', 180],
  // instagram
  ['post-insta-2.webp', 'insta-2', 720], ['post-insta-3.webp', 'insta-3', 720], ['post-insta-4.webp', 'insta-4', 720],
  ['post-insta-5.webp', 'insta-5', 720], ['post-insta-6.webp', 'insta-6', 720], ['post-insta1.webp', 'insta-1', 720],
];

(async () => {
  for (const [orig, nome, larg, q = 80] of LISTA) {
    const f = path.join(ORIGEM, orig);
    if (!fs.existsSync(f)) { console.warn('faltando', orig); continue; }
    await sharp(f).resize({ width: larg, withoutEnlargement: true }).webp({ quality: q }).toFile(path.join(OUT, `${nome}.webp`));
  }

  // logo: o fundo laranja vira transparente e o desenho fica branco (o azul separa bem o branco do laranja)
  const { data, info } = await sharp(path.join(ORIGEM, 'logo-peakalika.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const b = data[i + 2];
    const a = Math.max(0, Math.min(255, Math.round((b - 120) / (235 - 120) * 255)));
    rgba[j] = rgba[j + 1] = rgba[j + 2] = 255; rgba[j + 3] = a;
  }
  const logo = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer();
  await sharp(logo).resize({ height: 220 }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(__dirname, 'img', 'logo-branca.webp'));
  await sharp(logo).resize({ height: 220 }).png().toFile(path.join(__dirname, 'img', 'logo-branca.png'));

  // logos de parceiros em tons claros para o fundo escuro (cinza invertido mantém o desenho de cada marca)
  // e o logo Walt Disney World, que já é branco
  for (const [orig, nome] of [['Tripadvisor.png', 'tripadvisor'], ['Expedia.png', 'expedia'], ['booking.png', 'booking'], ['Airbnb.png', 'airbnb'], ['walt-disney-world-logo.png', 'wdw']]) {
    const img = sharp(path.join(ORIGEM, orig)).ensureAlpha();
    const { data: d, info: n } = await img.raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < d.length; i += 4) {
      const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const v = nome === 'wdw' ? 255 : Math.round(255 - l * 0.85);
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    await sharp(d, { raw: { width: n.width, height: n.height, channels: 4 } }).trim({ threshold: 1 })
      .resize({ height: nome === 'wdw' ? 260 : 80, withoutEnlargement: true }).png().toFile(path.join(__dirname, 'img', `parceiro-${nome}.png`));
  }

  // favicon e imagem de compartilhamento
  await sharp(path.join(ORIGEM, 'logo-peakalika.webp')).resize(180).png().toFile(path.join(__dirname, 'img', 'apple-touch-icon.png'));
  await sharp(path.join(ORIGEM, 'logo-peakalika.webp')).resize(64).png().toFile(path.join(__dirname, 'img', 'favicon.png'));
  console.log('ok', fs.readdirSync(OUT).length, 'fotos');
})();
