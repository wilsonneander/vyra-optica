// Fotos coloridas do Gold Pente Fino: recorta fotos do Unsplash (as mesmas do Gold Mecha, com créditos em
// ../../Salões de Beleza/_build-gold/img/creditos.json) nos formatos que o site usa e grava em public/img/.
//
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com sharp>/node_modules node preparar-fotos.mjs
// ou, com sharp instalado aqui: node preparar-fotos.mjs
//
// Formatos: espelho 3:2 (1400 px), corte 6:7 (760 px), produto 4:5 (820 px). Nunca aumenta a foto de origem.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ORIGEM = path.join(AQUI, '..', '..', 'Salões de Beleza', '_build-gold', 'img', 'fotos');
const DESTINO = path.join(AQUI, 'public', 'img');

// [origem, destino, largura, altura, recorte opcional em frações {x, y, w, h} da foto de origem]
const FOTOS = [
  // espelhos: o barbeiro trabalhando
  ['corte-m2', 'espelho-1.webp', 1400, 933],
  ['corte-m', 'espelho-2.webp', 1400, 933],
  ['barba', 'espelho-3.webp', 1400, 933, { x: 0, y: 0.2, w: 1, h: 0.444 }],
  ['navalha', 'espelho-4.webp', 1400, 933],
  // cortes: de frente
  ['l15', 'cortes/corte-1-frente.webp', 760, 887],
  ['l11', 'cortes/corte-2-frente.webp', 760, 887],
  ['l10', 'cortes/corte-3-frente.webp', 760, 887],
  ['l9', 'cortes/corte-4-frente.webp', 434, 507],
  ['rafael', 'cortes/corte-5-frente.webp', 760, 887, { x: 0.12, y: 0.02, w: 0.76, h: 0.591 }],
  ['l12', 'cortes/corte-6-frente.webp', 760, 887],
  ['l13', 'cortes/corte-7-frente.webp', 434, 507],
  ['l14', 'cortes/corte-8-frente.webp', 760, 887],
  // cortes: na cadeira (o corte sendo feito)
  ['corte-m3', 'cortes/corte-1-costas.webp', 760, 887],
  ['corte-m4', 'cortes/corte-2-costas.webp', 760, 887, { x: 0, y: 0.1, w: 1, h: 0.778 }],
  ['thiago', 'cortes/corte-3-costas.webp', 760, 887],
  ['kids', 'cortes/corte-4-costas.webp', 760, 887, { x: 0, y: 0.05, w: 1, h: 0.778 }],
  ['barba-toalha', 'cortes/corte-5-costas.webp', 760, 887, { x: 0, y: 0.12, w: 1, h: 0.778 }],
  ['pigmentacao', 'cortes/corte-6-costas.webp', 760, 887],
  ['sobrancelha', 'cortes/corte-7-costas.webp', 760, 887],
  ['antes-barba', 'cortes/corte-8-costas.webp', 760, 887, { x: 0, y: 0.1, w: 1, h: 0.778 }],
  // produtos
  ['produtos2', 'produtos/pomada.webp', 820, 1025, { x: 0.53, y: 0.36, w: 0.3, h: 0.563 }],
  ['produtos2', 'produtos/oleo.webp', 820, 1025, { x: 0.29, y: 0.15, w: 0.36, h: 0.675 }],
  ['produtos3', 'produtos/shampoo.webp', 820, 1025, { x: 0.08, y: 0.18, w: 0.7, h: 0.583 }],
  ['produtos', 'produtos/kit.webp', 742, 928, { x: 0.12, y: 0, w: 0.53, h: 0.993 }],
];

for (const [de, para, W, H, corte] of FOTOS) {
  const arq = path.join(ORIGEM, `${de}.webp`);
  let img = sharp(arq);
  const meta = await img.metadata();
  if (corte) {
    img = img.extract({
      left: Math.round(corte.x * meta.width), top: Math.round(corte.y * meta.height),
      width: Math.round(corte.w * meta.width), height: Math.round(corte.h * meta.height),
    });
  }
  const saida = path.join(DESTINO, para);
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  await img.resize(W, H, { fit: 'cover', position: sharp.strategy.attention, withoutEnlargement: true })
    .webp({ quality: 80 }).toFile(saida);
  console.log('ok', para);
}
