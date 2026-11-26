// Prepara as fotos próprias do Tampinha Standard Empório: baixa do Pexels (licença Pexels, uso livre), recorta e salva
// em WebP em img/fotos/, e grava img/creditos.json. Só precisa rodar de novo para trocar ou acrescentar fotos.
// Os produtos recortados vêm do Tampinha Standard Palco e as fotos de ambiente do Tampinha Standard (ver build.js).
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node "templates/bebidas/_build-tampinha-standard-emporio/preparar-imagens.js"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img', 'fotos');
fs.mkdirSync(OUT, { recursive: true });

// nome: [id no Pexels, formato]  (formato: 'larga' 1600px, 'media' 1100px, 'quadrada' 900x900, 'retrato' 900x1125)
const FOTOS = {
  // equipe
  toninho: [20311995, 'retrato'],
  marta: [27953366, 'retrato'],
  caio: [4485379, 'retrato'],
  leo: [30403324, 'retrato'],
  bia: [3907119, 'retrato'],
  dudu: [33915710, 'retrato'],
  // serviços, galeria e Instagram
  'chopp-torneira': [14823758, 'media'],
  'chopp-caneca': [5858064, 'quadrada'],
  'chopp-copo': [12786728, 'quadrada'],
  'chopeira-festa': [8920129, 'media'],
  'open-bar': [29783623, 'media'],
  'churrasco-brinde': [7893774, 'media'],
  'churrasco-amigos': [7893767, 'quadrada'],
  prateleira: [11325915, 'media'],
  geladeira: [33315803, 'retrato'],
  'gin-tonica': [16550820, 'quadrada'],
  'gin-limao': [10484522, 'quadrada'],
  'latas-engradado': [5532676, 'quadrada'],
  'balde-gelo': [28902909, 'media'],
  'balde-cima': [12489338, 'quadrada'],
  'balcao-avental': [8941709, 'media'],
};

const baixa = async (id) => {
  const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`);
  if (!r.ok) throw new Error(`foto ${id}: ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
};

(async () => {
  const creditos = [];
  for (const [nome, [id, formato]] of Object.entries(FOTOS)) {
    const dest = path.join(OUT, `${nome}.webp`);
    if (!fs.existsSync(dest)) {
      const buf = await baixa(id);
      let s = sharp(buf).rotate();
      if (formato === 'retrato') s = s.resize(900, 1125, { fit: 'cover', position: sharp.strategy.attention });
      else if (formato === 'quadrada') s = s.resize(900, 900, { fit: 'cover', position: sharp.strategy.attention });
      else s = s.resize(formato === 'larga' ? 1600 : 1100, null, { withoutEnlargement: true });
      await s.webp({ quality: 78 }).toFile(dest);
      console.log('ok', nome);
    }
    creditos.push({ arq: nome, fonte: 'Pexels', url: `https://www.pexels.com/photo/${id}/` });
  }
  fs.writeFileSync(path.join(__dirname, 'img', 'creditos.json'), JSON.stringify(creditos, null, 1));
})();
