#!/usr/bin/env node
/* Instala a "Prévia nos aparelhos" em todas as vitrines (ou só nas que forem passadas).

   Uso:
     node templates/_comum/previa/instalar.js                 todas as vitrines achadas
     node templates/_comum/previa/instalar.js --listar        só mostra o que acharia, sem gravar
     node templates/_comum/previa/instalar.js templates/dentista/_vitrine

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
const ARQUIVOS = ['index.html', 'previa.css', 'previa.js', 'vitrine.js'];
const FORA = new Set(['img', 'assets', 'previa', 'node_modules', 'fonts', 'video', 'videos']);
const INICIO = '<!-- previa-nos-aparelhos -->';
const FIM = '<!-- /previa-nos-aparelhos -->';

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
  console.log(`  instalado em ${rel}/previa/`);
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
