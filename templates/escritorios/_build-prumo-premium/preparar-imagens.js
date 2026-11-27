// Prepara as fotos do Prumo Premium: lê os JPGs originais do Unsplash (pasta passada no argumento,
// um arquivo <id>.jpg por foto), recorta, converte para WebP e grava img/fotos/ e img/creditos.json.
//
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules> node preparar-imagens.js <pasta com os jpg>
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIGEM = process.argv[2];
if (!ORIGEM) { console.error('uso: node preparar-imagens.js <pasta com os jpg>'); process.exit(1); }

// nome final, id no Unsplash e formato (retrato 4:5, alto 3:4, paisagem 3:2 ou largo 16:9)
const FOTOS = [
  ['equipe-laura', 'jI4HREHtae4', 'retrato'],
  ['equipe-otavio', 'o3PdpOz_iaA', 'retrato'],
  ['equipe-renata', 'NpyF7rjqmq4', 'retrato'],
  ['equipe-caio', 'iQLqpFqzwnc', 'retrato'],
  ['equipe-julia', 'o2PudTuoC84', 'retrato'],
  ['capa-predio', '8LKg3hJIeJM', 'largo'],
  ['predio-pb', 'zvU8zu2V4cE', 'alto'],
  ['predio-curvo', 'zVeLNsOYVPI', 'paisagem'],
  ['reuniao-janela', '7okkFhxrxNw', 'paisagem'],
  ['reuniao-mesa', 'YsJUxCIW14U', 'paisagem'],
  ['reuniao-quadro', 'yM3blOV977Q', 'paisagem'],
  ['equipe-risos', 'JUZlC3G4Y6c', 'alto'],
  ['dupla-laptop', 'whfkAvWoM7s', 'paisagem'],
  ['dupla-estudio', 'Dngwus36Tag', 'paisagem'],
  ['padaria', 'b5kN9ClBRNU', 'paisagem'],
  ['loja-cafe', 'yVOtS_115GY', 'paisagem'],
  ['calculadora-oculos', 'QV5VoI18Ld8', 'paisagem'],
  ['calculadora-mesa', '8wLZi9OhsWU', 'paisagem'],
  ['anotacoes', 'LNnmSumlwO4', 'paisagem'],
  ['graficos-papel', 'FVwy7PBiSUo', 'paisagem'],
  ['graficos-noite', 'T1snPsRIvfk', 'paisagem'],
  ['laptop-grafico', 'ztYmIQecyH4', 'paisagem'],
  ['sala-arquivo', 'PB5-pTZE9H4', 'paisagem'],
  ['sala-reuniao', 'JL1Q5KUTfbc', 'paisagem'],
  ['salao-aberto', 'lZkRGePI5HA', 'paisagem'],
  ['noite-laptop', 'K_O0I6tR83w', 'paisagem'],
  ['assinatura', 'QUQKrjxZ7hg', 'paisagem'],
  ['jardim-botanico', 'BME5WwsdLXE', 'paisagem'],
];

const MEDIDAS = { retrato: [880, 1100], alto: [1050, 1400], paisagem: [1500, 1000], largo: [1920, 1080] };

(async () => {
  const destino = path.join(__dirname, 'img', 'fotos');
  fs.mkdirSync(destino, { recursive: true });
  const creditos = [];
  for (const [nome, id, formato] of FOTOS) {
    const [w, h] = MEDIDAS[formato];
    await sharp(path.join(ORIGEM, `${id}.jpg`))
      .resize(w, h, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 74 })
      .toFile(path.join(destino, `${nome}.webp`));
    // o autor vem do nome de arquivo que o Unsplash devolve no download (dl=<autor>-<id>-unsplash.jpg)
    const r = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=10`, { redirect: 'manual' });
    const dl = new URL(r.headers.get('location')).searchParams.get('dl') || '';
    const autor = dl.replace(`-${id}-unsplash.jpg`, '').split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
    creditos.push({ arq: nome, autor, fonte: 'Unsplash', url: `https://unsplash.com/photos/${id}` });
    console.log('ok', nome, autor);
  }
  fs.writeFileSync(path.join(__dirname, 'img', 'creditos.json'), JSON.stringify(creditos, null, 1));
})();
