// Recorta e reduz as fotos que viram quadros dentro da cena 3D (retrato da responsável e gravuras).
// Saem em img/texturas/ e entram no site como data URI (assim a cena abre até direto do arquivo, sem servidor).
// Uso: NODE_PATH=<pasta com node_modules/sharp> node preparar-texturas.js
const sharp = require('sharp');
const path = require('path');
const F = (n) => path.join(__dirname, 'img', 'fotos', `${n}.webp`);
const S = (n) => path.join(__dirname, 'img', 'texturas', `${n}.webp`);
(async () => {
  // retrato: busto da responsável, para a moldura em arco do consultório
  await sharp(F('responsavel')).extract({ left: 60, top: 150, width: 800, height: 1000 }).resize(440, 550).webp({ quality: 78 }).toFile(S('retrato'));
  // gravuras: texturas de sérum (recepção) e frasco de sérum (sala de procedimentos)
  await sharp(F('galeria-produtos')).extract({ left: 100, top: 120, width: 1200, height: 600 }).resize(520, 260).webp({ quality: 74 }).toFile(S('gravura-produtos'));
  await sharp(F('galeria-serum')).resize(400, 267).webp({ quality: 74 }).toFile(S('gravura-serum'));
  console.log('ok');
})();
