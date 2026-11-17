// Gera os três modelos da AURA Fresh a partir do kit comum.
// Uso: node templates/marcas-proprias/aura-fresh/_build/build.js
//   produto/  modelo 1 "Origem": marca e produto com o pote 3D
//   guia/     modelo 2 "Diário": conteúdo, guia de uso, blog e SEO (sem WebGL, carrega rápido)
//   clube/    modelo 3 "Ritual": tudo do modelo 1 com outra direção e a Área do cliente
//   nascente/ modelo 4 "Nascente": a gota que cai e o rebote vira o pote, vídeo, imagens, antes e depois, avaliações
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const KIT = path.join(RAIZ, '_kit');

const SITES = {
  produto: { mod: './site-produto', js: ['kit.js', 'rotulo.js', 'pote-3d.js', 'three.min.js', 'produto.js'], css: ['kit.css', 'produto.css', 'tema-produto.css'], semImg: ['acao.mp4', 'acao-poster.webp', 'mapa-papel.webp', 'video-capa.webp'] },
  guia: { mod: './site-guia', js: ['kit.js', 'rotulo.js', 'guia.js'], css: ['kit.css', 'guia.css', 'tema-guia.css'], semImg: ['folha-hortela.png', 'folha-salsa.png', 'mapa-floresta.webp', 'video-capa.webp'] },
  clube: { mod: './site-clube', js: ['kit.js', 'rotulo.js', 'pote-3d.js', 'three.min.js', 'produto.js', 'clube.js', 'cliente.js'], css: ['kit.css', 'produto.css', 'clube.css', 'cliente.css', 'tema-clube.css'], semImg: ['acao.mp4', 'acao-poster.webp', 'mapa-floresta.webp', 'video-capa.webp'] },
  nascente: { mod: './site-nascente', js: ['kit.js', 'rotulo.js', 'pote-3d.js', 'three.min.js', 'produto.js', 'nascente.js'], css: ['kit.css', 'produto.css', 'nascente.css', 'tema-nascente.css'], semImg: ['acao.mp4', 'acao-poster.webp', 'mapa-papel.webp'] },
};

function copia(de, para) { fs.mkdirSync(path.dirname(para), { recursive: true }); fs.copyFileSync(de, para); }

const pedidos = process.argv.slice(2).filter(a => SITES[a]);
for (const [nome, cfg] of Object.entries(SITES)) {
  if (pedidos.length && !pedidos.includes(nome)) continue;
  let mod; try { mod = require(cfg.mod); } catch (e) { if (e.code === 'MODULE_NOT_FOUND' && e.message.includes(cfg.mod.slice(2))) { console.log('pulando', nome); continue; } throw e; }
  const out = path.join(RAIZ, nome);
  fs.rmSync(path.join(out, 'assets'), { recursive: true, force: true });
  for (const js of cfg.js) { const f = path.join(KIT, 'js', js); if (fs.existsSync(f)) copia(f, path.join(out, 'assets', 'js', js)); else console.warn('  falta js', js); }
  for (const css of cfg.css) { const f = path.join(KIT, 'css', css); if (fs.existsSync(f)) copia(f, path.join(out, 'assets', 'css', css)); else console.warn('  falta css', css); }
  for (const img of fs.readdirSync(path.join(KIT, 'img'))) if (!cfg.semImg.includes(img)) copia(path.join(KIT, 'img', img), path.join(out, 'assets', 'img', img));
  const paginas = mod.paginas();
  for (const [arq, html] of Object.entries(paginas)) {
    const dest = path.join(out, arq);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, html);
  }
  console.log(nome, Object.keys(paginas).length, 'arquivos');
}
