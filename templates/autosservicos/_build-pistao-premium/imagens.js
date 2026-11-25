// Baixa as fotos de demonstração do Unsplash (licença livre) e gera os WebP do modelo Gold (mesmas fotos do Silver).
// freio, suspensao, pneus, alinhamento, capa e oficina vêm prontas do modelo Bronze (também Unsplash).
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node "templates/autosservicos/_build-pistao-premium/imagens.js"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img', 'fotos');
// arquivo: [id do Unsplash, largura, altura]
const FOTOS = {
  // capa em slides
  'slide-garagem': ['1492144534655-ae79c964c9d7', 1920, 1080],
  'slide-estrada': ['1503376780353-7e6692767b70', 1920, 1080],
  'slide-noite': ['1606664515524-ed2f786a0bd6', 1920, 1080],
  // serviços
  'mecanica': ['1625047509248-ec889cbff17f', 960, 680],
  'oleo': ['1487754180451-c456f719a1fc', 960, 680],
  'estetica': ['1607860108855-64acf2078ed9', 960, 680],
  'diagnostico': ['1599256872237-5dcc0fbe9668', 960, 680],
  // fundos de seção
  'faixa': ['1619682817481-e994891cd1f5', 1920, 1000],
  'motor': ['1486262715619-67b85e0b08d3', 1920, 900],
  'lanterna': ['1493238792000-8113da705763', 1920, 1100],
  'ferramentas': ['1530046339160-ce3e530c7d2f', 1200, 1400],
  'noturno': ['1617814076367-b759c7d7e738', 1920, 1100],
  // Instagram
  'insta-laranja': ['1525609004556-c46c7d6cf023', 640, 640],
  'insta-bmw': ['1580273916550-e323be2ae537', 640, 640],
  'insta-amarelo': ['1511919884226-fd3cad34687c', 640, 640],
  'insta-camaro': ['1552519507-da3b142c6e3d', 640, 640],
  'insta-fusca': ['1489824904134-891ab64532f1', 640, 640],
  'insta-amg': ['1618843479313-40f8afb4b4d8', 640, 640],
  'insta-m5': ['1555215695-3004980ad54e', 640, 640],
  'insta-500': ['1549317661-bd32c8ce0db2', 640, 640],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, [id, w, h]] of Object.entries(FOTOS)) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${Math.round(w * 1.25)}&q=85&fm=jpg`);
    if (!res.ok) throw new Error(`${nome}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: w > 1000 ? 72 : 76 }).toFile(path.join(OUT, `${nome}.webp`));
    console.log('ok', nome);
  }
  await sharp(path.join(OUT, 'slide-garagem.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(__dirname, 'img', 'og.jpg'));
})();
