// Gera os 3 sites Vyra a partir de content.js.  Uso: node sites/_build/build.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// versão pelo conteúdo: o navegador baixa o CSS/JS de novo só quando o arquivo muda
const ver = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const content = require('./content');

const ROOT = path.join(__dirname, '..');
const FAVICON = path.join(__dirname, '..', '..', 'brand', 'logo', 'favicon.svg');
const tiers = ['basico', 'intermediario', 'premium'];

// Comum aos 3 modelos: toda página abre no topo (o navegador ou o visualizador às vezes restaura
// a rolagem da página anterior, abrindo no rodapé). Só mantém a posição se o link apontar para uma
// seção existente, como servicos.html#empresas. Também fecha o menu mobile ao tocar num link.
const COMMON_JS = `// Vyra · comportamento comum
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function toTop() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  toTop();
  addEventListener('load', function () { toTop(); setTimeout(toTop, 60); });
  addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.nav a');
    if (!a) return;
    var nav = a.closest('.nav'); nav.classList.remove('open');
    var b = document.querySelector('.menu-btn');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (b.dataset.open) b.innerHTML = b.dataset.open; }
  });
})();
`;

for (const tier of tiers) {
  const mod = path.join(__dirname, tier + '.js');
  if (!fs.existsSync(mod)) continue;
  const { pages, css, js } = require(mod).build(content);
  const dir = path.join(ROOT, tier);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  // remove páginas que não fazem mais parte do modelo
  for (const old of fs.readdirSync(dir).filter(f => f.endsWith('.html') && !(f in pages))) fs.unlinkSync(path.join(dir, old));
  const mainJs = COMMON_JS + '\n' + js, cssV = ver(css), jsV = ver(mainJs);
  for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(dir, file), html
    .replace(/href="assets\/style\.css"/g, `href="assets/style.css?v=${cssV}"`)
    .replace(/src="assets\/main\.js"/g, `src="assets/main.js?v=${jsV}"`));
  fs.writeFileSync(path.join(dir, 'assets', 'style.css'), css);
  fs.writeFileSync(path.join(dir, 'assets', 'main.js'), mainJs);
  // favicon: o Básico usa a paleta azul e verde
  let fav = fs.readFileSync(FAVICON, 'utf8');
  if (tier === 'basico') fav = fav.replace(/#FF7A3D/gi, '#3B82F6').replace(/#FF5A1F/gi, '#2563EB').replace(/#E11D2E/gi, '#16A34A');
  fs.writeFileSync(path.join(dir, 'assets', 'favicon.svg'), fav);
  // fotos compartilhadas (sites/_build/img) para os modelos que usam imagens
  {
    const src = path.join(__dirname, 'img'), dst = path.join(dir, 'assets', 'img');
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
  }
  console.log(`${tier}: ${Object.keys(pages).length} páginas`);
}
