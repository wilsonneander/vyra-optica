// Prepara as fotos do Vilela Standard: lê os JPGs originais do Unsplash (pasta passada no argumento,
// um arquivo <id>.jpg por foto), recorta, converte para WebP e grava img/fotos/ e img/creditos.json.
//
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules> node preparar-imagens.js <pasta com os jpg>
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIGEM = process.argv[2];
if (!ORIGEM) { console.error('uso: node preparar-imagens.js <pasta com os jpg>'); process.exit(1); }

// nome final, id no Unsplash, formato (retrato 4:5, quadrado ou paisagem) e ponto de interesse
const FOTOS = [
  ['equipe-helena', 'ea3STzN7Lw8', 'retrato'],
  ['equipe-rodrigo', '1qJPdNWQSC8', 'retrato'],
  ['equipe-camila', 'xJNnd1CjQoM', 'retrato'],
  ['equipe-tiago', 'T4w6f2JrnAM', 'retrato'],
  ['capa-biblioteca', 'GcVPF58fg7A', 'quadrado'],
  ['atendimento', 'ft1ET-Sizow', 'paisagem'],
  ['reuniao', 'iPheGw7_UaI', 'paisagem'],
  ['documentos', 'TFFn3BYLc5s', 'paisagem'],
  ['assinatura', 'FKnEYIEVOyI', 'paisagem'],
  ['contrato', 'xYnominUM0I', 'paisagem'],
  ['consulta', 'EoPb1QSkpvQ', 'paisagem'],
  ['familia', 'uIKlD9dc_Bc', 'paisagem'],
  ['casal-documentos', 'hnRs_icKhCI', 'paisagem'],
  ['casal-contas', 'DQdilc0v6u8', 'paisagem'],
  ['casal-sofa', 'J4KsphFse-c', 'paisagem'],
  ['mesa-trabalho', '-4uudWvBX9w', 'paisagem'],
  ['advogada-pasta', 'XtM2iFUcmLs', 'retrato'],
  ['escrita', 'pXKv-0-aYDY', 'paisagem'],
  ['sala-vidro', '6PndD8S9XMw', 'paisagem'],
  ['salas-madeira', 'xaGFrbbJuAo', 'paisagem'],
  ['sala-cidade', 'yzOieLQof-U', 'paisagem'],
  ['sala-reuniao', 'rm3PeMyY2GU', 'paisagem'],
  ['recepcao', 'xrNM0KNhI6Q', 'paisagem'],
  ['sala-mesa', 'uNXs95cQMdQ', 'paisagem'],
  ['sala-trabalho', 'PeRMFBdrScs', 'paisagem'],
  ['livros-mesa', 'w0ub5h1tbUM', 'paisagem'],
  ['livros-estante', 'ioRcKUIiIdw', 'paisagem'],
  ['livros-direito', 'IqV6EYHoXK0', 'retrato'],
  ['biblioteca', '3K6Qcxm6Jig', 'paisagem'],
];

const MEDIDAS = { retrato: [880, 1100], quadrado: [1100, 1100], paisagem: [1500, 1000] };

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
