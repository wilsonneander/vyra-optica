// Baixa as fotos de demonstração do Unsplash (licença livre) e gera os WebP do site.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node sites/pizzaria/_build/imagens.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img');
// arquivo: [id do Unsplash, largura, altura]
const FOTOS = {
  'margherita': ['1574071318508-1cdbab80d002'],
  'pepperoni': ['1628840042765-356cda07504e'],
  'verde': ['1593560708920-61dd98c46a4e'],
  'burrata': ['1573821663912-6df460f9c684'],
  'calabresa': ['1594007654729-407eedc4be65'],
  'portuguesa': ['1604382354936-07c5d9983bd3'],
  'frango': ['1565299624946-b28f40a0ae38'],
  'horta': ['1585238342024-78d387f4a707'],
  'arrabbiata': ['1621996346565-e3dbc646d9a9'],
  'carbonara': ['1612874742237-6526221588e3'],
  'mar': ['1563379926898-05f4575a45d8'],
  'ragu': ['1579684947550-22e945225d9a'],
  'lasanha': ['1574894709920-11b28e7367e3'],
  'pomodoro': ['1598866594230-a7c12756260f'],
  'caesar': ['1550304943-4f24f54ddde9'],
  'bowl': ['1512621776951-a57141f2eefd'],
  'horta-salada': ['1540420773420-3366772f4999'],
  'frutas': ['1505253716362-afaea1d3d1af'],
  'farfalle': ['1473093295043-cdd812d0e601'],
  'old-fashioned': ['1470337458703-46ad1756a187'],
  'amaro': ['1514362545857-3bc16c4c7d1b'],
  'sangria': ['1536935338788-846bb9981813'],
  'cosmo': ['1544145945-f90425340c7e'],
  'limonada': ['1551538827-9c037cb4f32a'],
  'cha': ['1556679343-c7306c1976bc'],
  'bruschetta': ['1572695157366-5e585ab2b69f'],
  'tabua': ['1541529086526-db283c563270'],
  'polpettine': ['1529042410759-befb1204b468'],
  'fritas': ['1573080496219-bb080dd4f877'],
  'rustica': ['1541592106381-b31e9677c0e5'],
  'tiramisu': ['1571877227200-a0d98ea607e9'],
  'capa': ['1593504049359-74330189a345', 1600, 1100],
  'fatia': ['1600028068383-ea11a7a101f3', 1000, 1200],
  'salao': ['1555396273-367ea4eb4db5', 1400, 1000],
  'mesa': ['1517248135467-4c7edcad34c4', 1400, 1000],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, [id, w = 760, h = 760]] of Object.entries(FOTOS)) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${w * 1.3 | 0}&q=85&fm=jpg`);
    if (!res.ok) throw new Error(`${nome}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 74 }).toFile(path.join(OUT, `${nome}.webp`));
    console.log('ok', nome);
  }
  await sharp(path.join(OUT, 'capa.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(OUT, 'og.jpg'));
})();
