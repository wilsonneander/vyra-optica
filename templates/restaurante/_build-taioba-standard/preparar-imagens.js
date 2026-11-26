// Prepara as fotos do Taioba Standard: baixa do Pexels (licença Pexels, uso livre), recorta e salva em WebP em img/,
// e grava img/creditos.json. Só precisa rodar de novo para trocar ou acrescentar fotos.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node templates/restaurante/_build-taioba-standard/preparar-imagens.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img');
fs.mkdirSync(OUT, { recursive: true });

// nome: [id no Pexels, autor, formato]  (formato: 'larga' 1600px, 'media' 1100px, 'retrato' 900x1125)
const FOTOS = {
  'capa-salao-noite': [4997875, 'Pexels', 'larga'],
  'porcoes-mesa': [19781592, 'Pexels', 'media'],
  'arroz-feijao': [19781602, 'Pexels', 'media'],
  'arroz-panela': [19781600, 'Pexels', 'media'],
  'mandioca-fogo': [9630341, 'Pexels', 'media'],
  'mandioca-frita': [5652261, 'Pexels', 'media'],
  'feijao-caldo': [36048828, 'Pexels', 'media'],
  'porcoes-vista': [34195321, 'Pexels', 'media'],
  'torresmo-couve': [37017289, 'Pexels', 'media'],
  'espetinhos': [36912022, 'Pexels', 'media'],
  'tropeiro': [34284708, 'Pexels', 'media'],
  'carne-acebolada': [39609678, 'Pexels', 'media'],
  'batata-frita': [1583884, 'Dzenina Lukac', 'media'],
  'batata-cesta': [1586942, 'Pexels', 'media'],
  'linguica': [1275692, 'Mateusz Dach', 'media'],
  'churrasco': [4294500, 'Pexels', 'media'],
  'costela-corte': [4253619, 'Pexels', 'media'],
  'drink-coupe': [10331389, 'Ron Lach', 'media'],
  'drinks-servindo': [1189257, 'Pexels', 'media'],
  'bartender': [4485382, 'Pexels', 'media'],
  'rabo-de-galo': [4762719, 'Denys Gromov', 'media'],
  'drink-coando': [28717625, 'Daniel Duarte', 'media'],
  'mesa-velas': [19569909, 'Pexels', 'media'],
  'picanha': [1251208, 'Pexels', 'media'],
  'caipirinha': [13059626, 'Marcelo Verfe', 'media'],
  'drink-limao': [8679609, 'Timur Weber', 'media'],
  'salao-vigas': [1581384, 'Pexels', 'media'],
  'varanda': [18395476, 'İnci Çınaroğlu', 'media'],
  'evento-mesa': [4992827, 'Rachel Claire', 'media'],
  'evento-longa': [26707799, 'Ayumi Photo', 'media'],
  'evento-amigos': [5738245, 'RDNE Stock project', 'media'],
  'amigos-brinde': [9961852, 'Taha Samet Arslan', 'media'],
  'iara': [10432362, 'Pexels', 'retrato'],
  'caio': [3814446, 'Miquel Ferran Gomez Figueroa', 'retrato'],
  'livia': [8902024, 'Pexels', 'retrato'],
  'rafael': [5920775, 'Kampus Production', 'retrato'],
  'jessica': [3800556, 'Andrea Piacquadio', 'retrato'],
};

const baixa = async (id) => {
  const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`);
  if (!r.ok) throw new Error(`foto ${id}: ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
};

(async () => {
  const creditos = [];
  for (const [nome, [id, autor, formato]] of Object.entries(FOTOS)) {
    const dest = path.join(OUT, `${nome}.webp`);
    if (!fs.existsSync(dest)) {
      const buf = await baixa(id);
      let s = sharp(buf).rotate();
      if (formato === 'retrato') s = s.resize(900, 1125, { fit: 'cover', position: sharp.strategy.attention });
      else s = s.resize(formato === 'larga' ? 1600 : 1100, null, { withoutEnlargement: true });
      await s.webp({ quality: 78 }).toFile(dest);
      console.log('ok', nome);
    }
    creditos.push({ arq: nome, autor, fonte: 'Pexels', url: `https://www.pexels.com/photo/${id}/` });
  }
  fs.writeFileSync(path.join(OUT, 'creditos.json'), JSON.stringify(creditos, null, 1));
})();
