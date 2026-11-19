// Põe (ou atualiza) o botão de tema claro/escuro no N3 Drinks, que não tem gerador.
// As peças vêm de templates/_comum/tema-tampinha.js; aqui só entram no index.html, no style.css e no app.js,
// sempre entre as marcas "tema:inicio" e "tema:fim", então dá para rodar de novo sem duplicar.
// Uso: node "templates/bebidas/plus/tema-plus.js"
const fs = require('fs');
const path = require('path');
const T = require('../../_comum/tema-tampinha');

const CHAVE = 'n3-tema';
const D = __dirname;
const ler = (f) => fs.readFileSync(path.join(D, f), 'utf8');
const gravar = (f, s) => fs.writeFileSync(path.join(D, f), s.replace(/\r?\n/g, '\r\n'));
// troca o que está entre as marcas; se ainda não existe, chama o "senao"
const bloco = (txt, ini, fim, novo, senao) => {
  const a = txt.indexOf(ini), b = txt.indexOf(fim);
  if (a >= 0 && b > a) return txt.slice(0, a) + novo + txt.slice(b + fim.length);
  return senao(txt, novo);
};

// estilo: o CSS próprio do N3 (tema escuro e lugar da pílula) fica em tema-plus.css, junto com o comum
const css = '/* tema:inicio */\n' + ler('tema-plus.css') + T.css + '/* tema:fim */';
gravar('assets/css/style.css', bloco(ler('assets/css/style.css').replace(/\r\n/g, '\n'), '/* tema:inicio */', '/* tema:fim */', css, (t, n) => t.trimEnd() + '\n\n' + n + '\n'));

const js = '/* tema:inicio */' + T.js(CHAVE, '#F2F1EC', '#111210') + '/* tema:fim */';
gravar('assets/js/app.js', bloco(ler('assets/js/app.js').replace(/\r\n/g, '\n'), '/* tema:inicio */', '/* tema:fim */', js, (t, n) => t.trimEnd() + '\n\n' + n + '\n'));

let h = ler('index.html').replace(/\r\n/g, '\n');
h = h.replace('<html lang="pt-BR">', '<html lang="pt-BR" data-tema="claro">');
h = bloco(h, '<!-- tema:cabeca -->', '<!-- /tema:cabeca -->', `<!-- tema:cabeca -->${T.head(CHAVE)}<!-- /tema:cabeca -->`,
  (t, n) => t.replace('<meta name="theme-color" content="#FF4B1F">', `<meta name="theme-color" content="#FF4B1F">\n${n}`));
h = bloco(h, '<!-- tema:menu -->', '<!-- /tema:menu -->', `<!-- tema:menu --><div class="menu-tema"><span>Tema do site</span>${T.pilula('deitada', 'claro')}</div><!-- /tema:menu -->`,
  (t, n) => t.replace('    <a href="#onde">Onde comprar</a>\n  </nav>', `    <a href="#onde">Onde comprar</a>\n    ${n}\n  </nav>`));
h = bloco(h, '<!-- tema:lado -->', '<!-- /tema:lado -->', `<!-- tema:lado -->${T.pilula('tema-lado', 'claro')}<!-- /tema:lado -->`,
  (t, n) => t.replace('</header>\n', `</header>\n${n}\n`));
gravar('index.html', h);
console.log('ok, tema no N3 Drinks');
