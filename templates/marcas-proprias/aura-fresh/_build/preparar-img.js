// Prepara as imagens da AURA Fresh (baixadas de useaurafresh.com em _build/fonte) para os três modelos.
// Uso (sharp fora do projeto): NODE_PATH=<pasta com node_modules> node _build/preparar-img.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const F = path.join(__dirname, 'fonte');
const OUT = path.join(__dirname, '..', '_kit', 'img');
fs.mkdirSync(OUT, { recursive: true });

async function logo() {
  // o favicon traz o logo branco sobre o verde: a luminância vira transparência e sobra só o desenho das letras
  const { data, info } = await sharp(path.join(F, 'favicon.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const rgba = Buffer.alloc(W * H * 4);
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const l = (0.299 * r + 0.587 * g + 0.114 * b);
    // verde do fundo fica perto de 60, branco perto de 255
    const a = Math.max(0, Math.min(255, Math.round((l - 80) / (235 - 80) * 255)));
    const x = i % W, y = (i / W) | 0;
    // descarta o canto arredondado do ícone (borda clara do antisserrilhado)
    const borda = x < 40 || y < 40 || x > W - 40 || y > H - 40;
    const al = borda ? 0 : a;
    rgba[i * 4] = 255; rgba[i * 4 + 1] = 255; rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = al;
    if (al > 40) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  const pad = 4;
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: x0 - pad, top: y0 - pad, width: x1 - x0 + pad * 2, height: y1 - y0 + pad * 2 })
    .png().toFile(path.join(OUT, 'logo.png'));
  await sharp(path.join(F, 'favicon.png')).resize(192, 192).png().toFile(path.join(OUT, 'favicon.png'));
  console.log('logo', x1 - x0, 'x', y1 - y0);
}

const fotos = [
  // [arquivo de origem, saída, largura máxima]
  ['home-como-usar-fundo.webp', 'pote-pedra.webp', 1024],
  ['sh-chamada-final.webp', 'pote-splash.webp', 1100],
  ['home-formula-fundo.webp', 'pote-claro.webp', 1100],
  ['home-formula-a.webp', 'hortela.webp', 500],
  ['home-formula-b.webp', 'clorofila.webp', 700],
  ['home-formula-c.webp', 'salsa.webp', 260],
  ['home-situ-fechados.webp', 'situ-fechados.webp', 900],
  ['home-situ-intima.webp', 'situ-intima.webp', 900],
  ['home-situ-perceber.webp', 'situ-perceber.webp', 900],
  ['sh-depoimento-1.webp', 'depo-1.webp', 540],
  ['sh-depoimento-2.webp', 'depo-2.webp', 540],
  ['sh-depoimento-3.webp', 'depo-3.webp', 540],
  ['sh-depoimento-4.webp', 'depo-4.webp', 540],
  ['sh-depoimento-5.webp', 'depo-5.webp', 540],
  ['sh-garantia-fundo.webp', 'pessoa-pote.webp', 1000],
  ['sh-carrossel-explosao.webp', 'explosao.webp', 1000],
  ['home-hero-pote.webp', 'pote-topo.webp', 400],
];

(async () => {
  await logo();
  for (const [de, para, w] of fotos) {
    await sharp(path.join(F, de)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 }).toFile(path.join(OUT, para));
  }
  // folhas para o 3D (texturas com transparência, potência de 2 não é obrigatória no three r149 com CanvasTexture/Texture comum)
  await sharp(path.join(F, 'home-formula-a.webp')).resize(256).png().toFile(path.join(OUT, 'folha-hortela.png'));
  await sharp(path.join(F, 'home-formula-c.webp')).resize(256).png().toFile(path.join(OUT, 'folha-salsa.png'));
  fs.copyFileSync(path.join(F, 'home-acao.mp4'), path.join(OUT, 'acao.mp4'));
  await sharp(path.join(F, 'home-acao-poster.jpg')).webp({ quality: 80 }).toFile(path.join(OUT, 'acao-poster.webp'));
  // imagem de compartilhamento
  await sharp(path.join(F, 'home-formula-fundo.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og.jpg'));
  console.log('ok', fs.readdirSync(OUT).length, 'arquivos');
})();
