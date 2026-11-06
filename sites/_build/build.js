// Gera os 3 sites Vyra a partir de content.js.  Uso: node sites/_build/build.js
const fs = require('fs');
const path = require('path');
const content = require('./content');

const ROOT = path.join(__dirname, '..');
const FAVICON = path.join(__dirname, '..', '..', 'brand', 'logo', 'favicon.svg');
const tiers = ['basico', 'intermediario', 'premium'];

for (const tier of tiers) {
  const mod = path.join(__dirname, tier + '.js');
  if (!fs.existsSync(mod)) continue;
  const { pages, css, js } = require(mod).build(content);
  const dir = path.join(ROOT, tier);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(dir, file), html);
  fs.writeFileSync(path.join(dir, 'assets', 'style.css'), css);
  fs.writeFileSync(path.join(dir, 'assets', 'main.js'), js);
  fs.copyFileSync(FAVICON, path.join(dir, 'assets', 'favicon.svg'));
  console.log(`${tier}: ${Object.keys(pages).length} páginas`);
}
