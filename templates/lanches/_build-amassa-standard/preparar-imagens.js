// Prepara as fotos do Amassa Standard: baixa do Pexels (licença Pexels, uso livre), recorta e salva em WebP em img/,
// e grava img/creditos.json. Só precisa rodar de novo para trocar ou acrescentar fotos.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node templates/lanches/_build-amassa-standard/preparar-imagens.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'img');
fs.mkdirSync(OUT, { recursive: true });

// nome: [id no Pexels, formato]  (formato: 'larga' 1600px, 'media' 1100px, 'quadrada' 900x900, 'retrato' 900x1125)
const FOTOS = {
  'capa': [28828556, 'larga'],
  'smash-classico': [24595902, 'quadrada'],
  'smash-duplo': [28828554, 'quadrada'],
  'smash-triplo': [19345991, 'quadrada'],
  'smash-bacon': [19345995, 'quadrada'],
  'smash-afogado': [19259153, 'quadrada'],
  'smash-salada': [19247575, 'quadrada'],
  'frango-crocante': [39042553, 'quadrada'],
  'frango-ardido': [16962441, 'quadrada'],
  'frango-mao': [27758760, 'quadrada'],
  'fritas-cheddar': [12946720, 'quadrada'],
  'fritas-ketchup': [39034209, 'quadrada'],
  'fritas-queijo': [39441284, 'quadrada'],
  'aneis': [34528321, 'quadrada'],
  'shake-flocos': [34224584, 'quadrada'],
  'shake-morango': [39344590, 'quadrada'],
  'shake-baunilha': [20205955, 'quadrada'],
  'shake-chocolate': [34926740, 'quadrada'],
  'combo-caixa': [7564746, 'quadrada'],
  'combo-mesa': [4021939, 'quadrada'],
  'bandeja-combo': [16962427, 'media'],
  'chapa-prensa': [30406049, 'media'],
  'chapa-espatula': [30406044, 'media'],
  'chapa-montagem': [31650314, 'media'],
  'chapeiro': [30406045, 'media'],
  'mordida': [17492350, 'retrato'],
  'amigos-mesa': [31650409, 'media'],
  'mesa-cima': [4809147, 'media'],
  'atendimento': [31650381, 'media'],
  'salao-xadrez': [38666632, 'media'],
  'balcao': [32681017, 'media'],
  'festa-aniversario': [9543840, 'media'],
  'evento-truck': [40227509, 'media'],
  'smash-cebola': [36554232, 'quadrada'],
  'smash-grao': [6546034, 'quadrada'],
  'frango-tiras': [29653191, 'quadrada'],
  'molhos': [5899677, 'quadrada'],
  'bebidas': [8679076, 'quadrada'],
  'combo-pequeno': [7497244, 'quadrada'],
  'carol': [5737834, 'retrato'],
  'tiago': [17244282, 'retrato'],
  'lu': [6223007, 'retrato'],
  'rafa': [16537979, 'retrato'],
  'bia': [6205635, 'retrato'],
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
    creditos.push({ arq: nome, autor: 'Pexels', fonte: 'Pexels', url: `https://www.pexels.com/photo/${id}/` });
  }
  fs.writeFileSync(path.join(OUT, 'creditos.json'), JSON.stringify(creditos, null, 1));
})();
