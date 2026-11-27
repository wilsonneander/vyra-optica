#!/usr/bin/env node
/* Instala a "Prévia nos aparelhos" em todas as vitrines (ou só nas que forem passadas).

   Uso:
     node templates/_comum/previa/instalar.js                 todas as vitrines achadas
     node templates/_comum/previa/instalar.js --listar        só mostra o que acharia, sem gravar
     node templates/_comum/previa/instalar.js templates/clinicas/_vitrine

   Vitrine é qualquer pasta dentro de templates/ com firebase.json e index.html.
   Vitrine de cliente (em clientes/) entra só quando o caminho dela é passado no comando.
   Modelo é cada subpasta da vitrine com index.html (fora img/, assets/, previa/ e pastas com _ ou .).
   Para cada vitrine:
     - copia o visualizador para <vitrine>/previa/ (index.html, previa.css, previa.js, vitrine.js);
     - gera <vitrine>/previa/modelos.js com a lista de modelos, na ordem em que aparecem na vitrine;
     - coloca no fim do index.html da vitrine os dois scripts que mostram o botão "Ver nos aparelhos".
   Pode rodar quantas vezes quiser: o bloco no index.html é trocado, nunca duplicado.
   Rode de novo sempre que uma vitrine ganhar ou perder modelo, e antes de publicar no Firebase. */
'use strict';
const fs = require('fs');
const path = require('path');

const AQUI = __dirname;
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ARQUIVOS = ['index.html', 'previa.css', 'previa.js', 'vitrine.js', 'adaptador.js'];
const A_INICIO = '<!-- previa-adaptador -->';
const A_FIM = '<!-- /previa-adaptador -->';
const FORA = new Set(['img', 'assets', 'previa', 'node_modules', 'fonts', 'video', 'videos']);
const INICIO = '<!-- previa-nos-aparelhos -->';
const FIM = '<!-- /previa-nos-aparelhos -->';

/* Cores de cada nicho, tiradas da própria vitrine. Valem para o controle dentro dos sites (adaptador.js)
   e para a tela "Ver nos aparelhos" (previa/tema.css).
   fundo: fundo do controle e da barra · texto · apoio: ícone apagado · acento: marcador do aparelho ativo
   sobre: ícone em cima do acento · claro: true quando o nicho é de fundo claro (o palco fica claro também).
   Vitrine nova sem entrada aqui usa o PADRAO (grafite e dourado). */
const PADRAO = { fundo: '#101012', texto: '#EEEBE6', apoio: '#9C978F', acento: '#D9B26A', sobre: '#1A1408' };
const TEMAS = {
  'templates/assessoria-provedor/_apresentacao': { fundo: '#021430', texto: '#F3F5F9', apoio: '#8E9AB4', acento: '#FE5710', sobre: '#FFFFFF' },
  'templates/provedor-internet/_apresentacao': { fundo: '#1E1512', texto: '#FFF8F4', apoio: '#A8968D', acento: '#FF5A1F', sobre: '#FFFFFF' },
  'templates/barbearia/_vitrine': { fundo: '#121110', texto: '#F4F1EC', apoio: '#A59E96', acento: '#E9A46B', sobre: '#1A1206' },
  'templates/clinicas/_vitrine': { fundo: '#FFFFFF', texto: '#1F1D1A', apoio: '#67615A', acento: '#3E7F78', sobre: '#FFFFFF', cena: '#F6F4F0', claro: true },
  'templates/saloes/_vitrine': { fundo: '#FFFFFF', texto: '#2A211D', apoio: '#6E645C', acento: '#A9512F', sobre: '#FFFFFF', cena: '#F7F2EB', claro: true },
  'templates/restaurante/_apresentacao': { fundo: '#1B1714', texto: '#F4EFE1', apoio: '#A99E90', acento: '#CA603C', sobre: '#FFFFFF' },
  'templates/restaurante/_modelos': { fundo: '#1B1714', texto: '#F4EFE1', apoio: '#A99E90', acento: '#CA603C', sobre: '#FFFFFF' },
  'templates/_vitrine-aura': { fundo: '#16302A', texto: '#F4F6EE', apoio: '#9DB0A4', acento: '#C4D997', sobre: '#16302A' },
  'templates/_vitrine-auto': { fundo: '#0F1012', texto: '#F3F2EE', apoio: '#9AA0A8', acento: '#FF3D24', sobre: '#FFFFFF' },
  'templates/_vitrine-bebidas': { fundo: '#15100D', texto: '#F5EDE0', apoio: '#B3A898', acento: '#C9A46A', sobre: '#15100D' },
  'templates/_vitrine-estetica': { fundo: '#FFFDFB', texto: '#2E2326', apoio: '#6B5F62', acento: '#6B2234', sobre: '#FFFFFF', cena: '#F8F5F2', claro: true },
  'templates/_vitrine-food': { fundo: '#1F1410', texto: '#FFF3DC', apoio: '#BFA68C', acento: '#F2A516', sobre: '#1F1410' }
};

function mistura(a, b, t) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = n(a), y = n(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function temaDa(rel) {
  const t = Object.assign({}, PADRAO, TEMAS[rel] || {});
  t.linha = mistura(t.fundo, t.texto, t.claro ? 0.14 : 0.16);
  t.botao = mistura(t.fundo, t.texto, 0.07);
  const cena = t.cena || t.fundo;
  t.palcoA = t.claro ? cena : mistura(cena, t.texto, 0.07);
  t.palcoB = t.claro ? mistura(cena, t.texto, 0.08) : mistura(cena, '#000000', 0.35);
  return t;
}

function temaCss(t) {
  return '/* Gerado por templates/_comum/previa/instalar.js (TEMAS). Não edite: rode o instalador de novo. */\n' +
    ':root {\n' +
    `  --fundo: ${t.claro ? t.cena || t.fundo : mistura(t.fundo, '#000000', 0.2)};\n` +
    `  --barra: ${t.fundo};\n  --linha: ${t.linha};\n  --botao: ${t.botao};\n` +
    `  --txt: ${t.texto};\n  --apoio: ${t.apoio};\n  --acento: ${t.acento};\n  --acento-txt: ${t.sobre};\n` +
    `  --palco-a: ${t.palcoA};\n  --palco-b: ${t.palcoB};\n` +
    '}\n';
}

const args = process.argv.slice(2);
const listar = args.includes('--listar');
const alvos = args.filter((a) => !a.startsWith('--'));

function ehVitrine(dir) {
  return fs.existsSync(path.join(dir, 'firebase.json')) && fs.existsSync(path.join(dir, 'index.html'));
}

function acharVitrines(dir, nivel, saida) {
  if (nivel > 4) return saida;
  let itens;
  try { itens = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return saida; }
  for (const it of itens) {
    if (!it.isDirectory() || it.name.startsWith('.') || it.name === 'node_modules' || it.name.startsWith('_build')) continue;
    const sub = path.join(dir, it.name);
    if (ehVitrine(sub)) saida.push(sub);
    else acharVitrines(sub, nivel + 1, saida);
  }
  return saida;
}

function semTags(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ').trim();
}

function tituloDaPasta(p) {
  return p.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function regexPasta(p) {
  const e = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<a\\b([^>]*)href="(?:\\./)?${e}/(?:index\\.html)?"([^>]*)>([\\s\\S]*?)</a>`, 'gi');
}

/* Nome do modelo, nesta ordem: aria-label "Abrir o modelo X", texto "Modelo X" no bloco do modelo,
   botão "Abrir o X", nome da pasta. */
function nomeDoModelo(html, pasta) {
  const re = regexPasta(pasta);
  let m, porBloco = null, porTexto = null;
  while ((m = re.exec(html))) {
    const attrs = m[1] + m[2];
    const rotulo = attrs.match(/aria-label="Abrir o modelo ([^"]+)"/i);
    if (rotulo) return semTags(rotulo[1]);
    const inicio = Math.max(html.lastIndexOf('<section', m.index), html.lastIndexOf('<article', m.index));
    if (!porBloco && inicio >= 0) {
      const bloco = html.slice(inicio, m.index).match(/>\s*Modelo ([^<]{2,40})</);
      if (bloco) porBloco = semTags(bloco[1]);
    }
    const texto = semTags(m[3]).match(/^Abrir (?:o|a) (.+)$/i);
    if (texto && !porTexto && !/^(site|modelo)$/i.test(texto[1])) porTexto = texto[1].trim();
  }
  return porBloco || porTexto || tituloDaPasta(pasta);
}

function modelosDa(vitrine, html) {
  const pastas = fs.readdirSync(vitrine, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !FORA.has(d.name) && !/^[._]/.test(d.name))
    .filter((d) => fs.existsSync(path.join(vitrine, d.name, 'index.html')))
    .map((d) => d.name);
  const posicao = (p) => {
    const m = regexPasta(p).exec(html);
    return m ? m.index : Infinity;
  };
  return pastas
    .map((p) => ({ pasta: p, nome: nomeDoModelo(html, p), pos: posicao(p) }))
    .sort((a, b) => a.pos - b.pos || a.pasta.localeCompare(b.pasta))
    .map(({ pasta, nome }) => ({ pasta, nome }));
}

function instalar(vitrine) {
  const indice = path.join(vitrine, 'index.html');
  let html = fs.readFileSync(indice, 'utf8');
  const titulo = semTags((html.match(/<title>([\s\S]*?)<\/title>/i) || [, 'Modelos'])[1]);
  const modelos = modelosDa(vitrine, html);
  const rel = path.relative(RAIZ, vitrine).split(path.sep).join('/');

  console.log(`\n${rel}  (${titulo})`);
  modelos.forEach((m) => console.log(`  ${m.pasta.padEnd(16)} ${m.nome}`));
  if (!modelos.length) { console.log('  nenhum modelo, pulei'); return; }
  if (listar) return;

  const destino = path.join(vitrine, 'previa');
  fs.mkdirSync(destino, { recursive: true });
  for (const f of ARQUIVOS) fs.copyFileSync(path.join(AQUI, f), path.join(destino, f));
  const tema = temaDa(rel);
  const temaJs = JSON.stringify(Object.fromEntries(
    ['fundo', 'texto', 'apoio', 'acento', 'sobre', 'linha', 'botao', 'palcoA', 'palcoB'].map((k) => [k, tema[k]])));
  const adaptador = fs.readFileSync(path.join(AQUI, 'adaptador.js'), 'utf8');
  if (!adaptador.includes('/*TEMA*/null')) throw new Error('adaptador.js sem o marcador /*TEMA*/null');
  fs.writeFileSync(path.join(destino, 'adaptador.js'), adaptador.replace('/*TEMA*/null', temaJs));
  fs.writeFileSync(path.join(destino, 'tema.css'), temaCss(tema));
  if (!TEMAS[rel]) console.log('  sem cores próprias em TEMAS (instalar.js), usei o padrão grafite e dourado');
  fs.writeFileSync(
    path.join(destino, 'modelos.js'),
    '/* Gerado por templates/_comum/previa/instalar.js. Não edite: rode o instalador de novo. */\n' +
      'window.PREVIA = ' + JSON.stringify({ titulo, modelos }, null, 2) + ';\n'
  );

  const bloco = `${INICIO}<script src="previa/modelos.js"></script><script src="previa/vitrine.js"></script>${FIM}`;
  const antigo = new RegExp(`${INICIO}[\\s\\S]*?${FIM}\\n?`);
  if (antigo.test(html)) html = html.replace(antigo, bloco + '\n');
  else if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, bloco + '\n</body>');
  else html += '\n' + bloco + '\n';
  fs.writeFileSync(indice, html);

  /* adaptador dentro de cada página dos sites da vitrine (só nestas cópias, nunca no modelo original) */
  let paginas = 0;
  for (const m of modelos) {
    for (const pagina of paginasHtml(path.join(vitrine, m.pasta))) {
      let h = fs.readFileSync(pagina, 'utf8');
      if (!/<body|<html/i.test(h)) continue;
      const src = path.relative(path.dirname(pagina), path.join(destino, 'adaptador.js')).split(path.sep).join('/');
      const b = `${A_INICIO}<script src="${src}" defer></script>${A_FIM}`;
      const velho = new RegExp(`${A_INICIO}[\\s\\S]*?${A_FIM}\\n?`);
      if (velho.test(h)) h = h.replace(velho, b + '\n');
      else if (/<\/body>/i.test(h)) h = h.replace(/<\/body>(?![\s\S]*<\/body>)/i, b + '\n</body>');
      else h += '\n' + b + '\n';
      fs.writeFileSync(pagina, h);
      paginas++;
    }
  }
  console.log(`  instalado em ${rel}/previa/ e em ${paginas} página(s) dos sites`);
}

function paginasHtml(dir) {
  const saida = [];
  for (const it of fs.readdirSync(dir, { withFileTypes: true })) {
    if (it.name.startsWith('.') || it.name === 'node_modules' || it.name === 'previa') continue;
    const p = path.join(dir, it.name);
    if (it.isDirectory()) saida.push(...paginasHtml(p));
    else if (/\.html?$/i.test(it.name)) saida.push(p);
  }
  return saida;
}

const vitrines = alvos.length
  ? alvos.map((a) => path.resolve(a)).filter((d) => {
      if (ehVitrine(d)) return true;
      console.warn(`${a}: não é vitrine (precisa de firebase.json e index.html)`);
      return false;
    })
  : acharVitrines(path.join(RAIZ, 'templates'), 0, []);

if (!vitrines.length) { console.log('Nenhuma vitrine encontrada.'); process.exit(0); }
vitrines.forEach(instalar);
console.log(`\n${vitrines.length} vitrine(s) ${listar ? 'encontradas' : 'prontas'}.`);
