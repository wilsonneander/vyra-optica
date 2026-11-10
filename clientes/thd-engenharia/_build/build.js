// Gera o site THD Engenharia (nível premium).
//   node clientes/thd-engenharia/_build/build.js            → site/     (produção, URLs limpas: /servicos/)
//   node clientes/thd-engenharia/_build/build.js --preview  → _preview/ (links para index.html, abre sem servidor)
//
// Linguagem visual: "seu provedor montado peça por peça". Blocos geométricos nas cores da marca voam,
// se encaixam numa grade 3x3 e seguem trocando de lugar, ligados por trilhas de circuito (como as letras do logo).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('./content');
const { css } = require('./style');
const { js } = require('./script');
const I = require('./icons');

const PREVIEW = process.argv.includes('--preview');
const OUT = path.join(__dirname, '..', PREVIEW ? '_preview' : 'site');
const ver = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGES = [
  { slug: '', nav: 'Início' },
  { slug: 'quem-somos', nav: 'Quem somos' },
  { slug: 'servicos', nav: 'Serviços' },
  { slug: 'contabilidade', nav: 'Contabilidade' },
  { slug: 'contato', nav: 'Contato' },
];

const rootOf = (slug) => (slug ? '../' : '');
const link = (from, to, hash = '') => {
  const r = rootOf(from);
  if (PREVIEW) return `${r}${to ? to + '/' : ''}index.html${hash}`;
  return (to ? `${r}${to}/` : r || './') + hash;
};
const asset = (from, p) => `${rootOf(from)}assets/${p}`;
const canonical = (slug) => `${C.dominio}/${slug ? slug + '/' : ''}`;
const svc = (id) => C.servicos.find((s) => s.id === id);
const shortTitle = (t) => t.split(':')[0].replace(/ e compartilhamento de poste/, '').trim();

// ---------- blocos geométricos ----------
// tile: [forma, cor, coluna, linha, giro, extras]. Formas: sq ci qa ha tr ri st dt ar ln lq im x
// cores: o laranja, b azul, l azul do logo, w branco, n marinho, p azul claro, k tinta
const T = (k, c, x, y, r = 0, o = {}) => ({ k, c, x, y, r, ...o });
const WIRES = {
  a: ['M-30 100H100V200H200V330', 'M200 -30V100H330'],
  b: ['M-30 200H200V100H330', 'M100 -30V100'],
  c: ['M-30 100H200V200H330', 'M100 330V200'],
};
const nodes = { a: [[100, 100], [100, 200], [200, 200], [200, 100]], b: [[200, 200], [200, 100], [100, 100]], c: [[100, 100], [200, 100], [200, 200], [100, 200]] };
function geo(tiles, { cls = '', wires = 'a', sats = true, attrs = '' } = {}) {
  const w = wires ? `<svg class="wires" viewBox="0 0 300 300" preserveAspectRatio="none">${WIRES[wires].map((d) => `<path class="base draw" style="--len:700" d="${d}"/><path class="flow" d="${d}"/>`).join('')}${nodes[wires].map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8"/>`).join('')}</svg>` : '';
  const t = tiles.map((o) => {
    const style = [`--x:${o.x}`, `--y:${o.y}`, `--r:${o.r}`, o.w ? `--w:${o.w}` : '', o.rad ? `--rad:${o.rad}` : ''].filter(Boolean).join(';');
    const data = [o.st != null ? ` data-stage="${o.st}"` : '', o.q != null ? ` data-q="${o.q}"` : '', o.fixed ? ' data-fixed' : '', o.w ? ' data-big' : ''].join('');
    return `<div class="tile" style="${style}"${data}><i class="s s-${o.k} c-${o.c}">${o.img ? `<img src="${o.img}" alt="" width="1920" height="1056" fetchpriority="high">` : ""}</i></div>`;
  }).join('');
  const s = sats ? `<i class="sat sat-a s-sq c-o" data-depth="2"></i><i class="sat sat-b s-ci c-l" data-depth="3"></i><i class="sat sat-c s-sq c-w" data-depth="1.5"></i>` : '';
  return `<div class="geo ${cls}" data-geo${attrs} aria-hidden="true"><div class="geo-in">${t}${w}</div>${s}</div>`;
}

// marca geométrica de cada serviço (quatro quadrantes)
const MARKS = {
  'outorga-scm': [['qa', 'o'], ['sq', 'b'], ['x', ''], ['ci', 'l']],
  'seac-stfc': [['ci', 'b'], ['qb', 'o'], ['sq', 'l'], ['x', '']],
  'pos-outorga': [['sq', 'b'], ['ln', 'b'], ['qd', 'o'], ['sq', 'l']],
  notificacoes: [['x', ''], ['ci', 'o'], ['qc', 'b'], ['sq', 'l']],
  asn: [['ci', 'l'], ['x', ''], ['ci', 'b'], ['ci', 'o']],
  ipv4: [['sq', 'b'], ['sq', 'l'], ['sq', 'o'], ['ln', 'b']],
  'responsabilidade-tecnica': [['qa', 'b'], ['qb', 'o'], ['qc', 'l'], ['qd', 'b']],
  'seguranca-do-trabalho': [['sq', 'o'], ['qc', 'b'], ['x', ''], ['sq', 'l']],
  'gestao-contabil': [['x', ''], ['sq', 'l'], ['sq', 'b'], ['qa', 'o']],
  marketing: [['ci', 'o'], ['qd', 'l'], ['ln', 'b'], ['ci', 'b']],
  'registro-de-marca': [['qb', 'b'], ['ci', 'o'], ['sq', 'l'], ['qc', 'b']],
  cta: [['ci', 'w'], ['qa', 'w'], ['sq', 'w'], ['x', '']],
};
const mk = (id) => `<span class="mk" aria-hidden="true">${(MARKS[id] || MARKS.cta).map(([k, c]) => `<i class="s-${k} c-${c || 'b'}"></i>`).join('')}</span>`;

// título com palavras que sobem; *palavra* recebe o sublinhado em bloco
const words = (text) => text.split(' ').map((w, i) => {
  const m = /^\*(.+)\*([.,!?]?)$/.exec(w);
  const inner = m ? `<span class="mark">${m[1]}</span>${m[2]}` : w;
  return `<span class="w"><span style="--i:${i}">${inner}</span></span>`;
}).join(' ');

// ---------- partes comuns ----------
const waBtn = (label = 'Falar no WhatsApp', cls = 'btn btn-w', msg) =>
  `<a class="${cls}" href="${msg ? C.wa(msg) : C.waOrcamento}" target="_blank" rel="noopener" data-magnetic>${I.whatsapp}<span>${label}</span></a>`;

function header(slug) {
  const items = PAGES.map((p) => `<a href="${link(slug, p.slug)}"${p.slug === slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('');
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="progress" aria-hidden="true"></div>
<div class="curtain" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--d:${((i % 6) + Math.floor(i / 6)) * 45}ms"></i>`).join('')}</div>
<header class="hdr">
  <div class="container hdr-in">
    <a class="brand" href="${link(slug, '')}" aria-label="THD Engenharia, página inicial">
      <img src="${asset(slug, 'img/logo-escuro.png')}" alt="THD Engenharia, consultoria de provedores de internet" width="226" height="120">
    </a>
    <nav class="nav" aria-label="Principal">${items}</nav>
    <a class="btn btn-o btn-sm" href="${C.waOrcamento}" target="_blank" rel="noopener" data-magnetic><span>Solicitar orçamento</span>${I.seta}</a>
    <button class="menu-btn" data-menu aria-controls="mmenu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <nav aria-label="Menu">${items}</nav>
  <div class="mmenu-foot">
    <a href="${C.waOrcamento}" target="_blank" rel="noopener">WhatsApp ${C.contato.whatsappTexto}</a>
    <a href="mailto:${C.contato.email}">${C.contato.email}</a>
  </div>
  ${geo([T('qa', 'o', 0, 0), T('sq', 'l', 1, 0), T('ci', 'b', 2, 0), T('st', 'l', 0, 1), T('ar', 'o', 1, 1, 2), T('x', 'w', 2, 1), T('sq', 'b', 0, 2), T('tr', 'o', 1, 2, 1), T('ci', 'l', 2, 2)], { wires: false, sats: false })}
</div>`;
}

function footer(slug) {
  const c = C.contato;
  return `
<footer class="footer on-dark">
  ${geo([T('ci', 'w', 0, 0), T('qa', 'w', 1, 0, 1), T('sq', 'w', 2, 0), T('sq', 'w', 0, 1), T('x', 'w', 1, 1), T('ri', 'w', 2, 1), T('tr', 'w', 0, 2), T('sq', 'w', 1, 2), T('qa', 'w', 2, 2, 2)], { cls: 'foot-geo', wires: false, sats: false })}
  <div class="container where">
    <div class="map-box rv">
      <iframe title="Mapa: THD Engenharia na R. Almirante Pestana, 6, Cacuia, Rio de Janeiro" src="${c.mapa}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="map-info"><b>THD Engenharia</b><span>${c.endereco}</span><span>${c.horario[0][0]}, ${c.horario[0][1]}</span>
        <div class="mbtns"><a href="${c.mapsLink}" target="_blank" rel="noopener">${I.pin}Abrir no Maps</a><a class="sq" href="${c.rotaLink}" target="_blank" rel="noopener" aria-label="Traçar rota até a THD">${I.seta}</a></div>
      </div>
    </div>
    <div class="rv" style="transition-delay:.12s">
      <span class="kicker">Onde estamos</span>
      <h2>Nosso escritório fica no <span class="o">Rio de Janeiro.</span></h2>
      <p>Estamos no Cacuia, na Ilha do Governador. Atendemos de segunda a sexta, das 9h às 18h, pelo WhatsApp, por e-mail ou pessoalmente com horário marcado.</p>
      <a class="btn btn-o" href="${C.waOrcamento}" target="_blank" rel="noopener">Marcar um horário</a>
    </div>
  </div>
  <div class="container foot-grid">
    <div class="foot-brand">
      <img src="${asset(slug, 'img/logo-escuro.png')}" alt="THD Engenharia" width="226" height="120" loading="lazy">
      <p>Consultoria para provedores de internet, com excelência e garantia.</p>
      <div class="social">${c.redes.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.rotulo}">${I[r.rede]}</a>`).join('')}</div>
    </div>
    <div>
      <h3>Navegação</h3>
      <ul>${PAGES.map((p) => `<li><a href="${link(slug, p.slug)}">${p.nav}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Contato</h3>
      <ul class="foot-contact">
        <li>${I.whatsapp}<a href="${C.waOrcamento}" target="_blank" rel="noopener">${c.whatsappTexto}</a></li>
        <li>${I.email}<a href="mailto:${c.email}">${c.email}</a></li>
        <li>${I.pin}<span>${c.endereco}</span></li>
      </ul>
    </div>
    <div>
      <h3>Atendimento</h3>
      <dl class="hours">${c.horario.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>
    </div>
  </div>
  <div class="container foot-bottom">
    <span>© <span id="year">${new Date().getFullYear()}</span> ${C.nome}. CNPJ ${C.cnpj}</span>
    <span>Site por ${C.credito.url ? `<a href="${C.credito.url}" target="_blank" rel="noopener">${C.credito.nome}</a>` : C.credito.nome}</span>
  </div>
</footer>
<a class="wa-float" href="${C.waOrcamento}" target="_blank" rel="noopener" aria-label="Falar com a THD no WhatsApp" data-cursor="Conversar">${I.whatsapp}</a>`;
}

const headScript = `<script>(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('thd-nav')){d.classList.add('enter');sessionStorage.removeItem('thd-nav');}}catch(e){}})();</script>`;

function layout({ slug, title, desc, body, jsonld = '' }) {
  const ga = C.ga4 && !PREVIEW ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${C.ga4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${C.ga4}');</script>` : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical(slug)}">
<meta name="theme-color" content="#021430">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${C.nome}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical(slug)}">
<meta property="og:image" content="${C.dominio}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${asset(slug, 'img/favicon.png')}">
<link rel="apple-touch-icon" href="${asset(slug, 'img/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900&family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset(slug, 'css/style.css')}?v=${ver(css)}">
${headScript}${ga}${jsonld}
</head>
<body>
${header(slug)}
<main id="conteudo">
${body}
</main>
${footer(slug)}
<script src="${asset(slug, 'js/main.js')}?v=${ver(js)}" defer></script>
</body>
</html>
`;
}

const pageHero = (slug, kicker, title, lead, tiles, wires = 'b') => `
<section class="phero on-dark">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="container phero-in">
    <div>
      <nav class="crumbs fade-up" style="--d:.1s" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">${PAGES.find((p) => p.slug === slug).nav}</span></nav>
      <p class="kicker fade-up" style="--d:.2s">${kicker}</p>
      <h1>${words(title)}</h1>
      ${lead ? `<p class="lead fade-up" style="--d:.7s">${lead}</p>` : ''}
    </div>
    ${geo(tiles, { wires })}
  </div>
</section>`;

const ctaBand = (slug, titulo = 'Vamos tirar o seu provedor do papel ou deixá-lo em dia?', texto = 'Conte o que você precisa. Respondemos pelo WhatsApp em horário comercial.') => `
<section class="cta">
  <div class="container cta-in">
    <div class="cta-text">
      <p class="kicker rv">Fale com a nossa equipe</p>
      <h2 class="rv">${titulo}</h2>
      <p class="rv" data-d="1">${texto}</p>
      <div class="actions rv" data-d="2">${waBtn('Chamar no WhatsApp')}<a class="btn btn-dark" href="${link(slug, 'contato')}" data-magnetic><span>Enviar mensagem</span>${I.seta}</a></div>
    </div>
    <div class="cta-media">
      <i class="bit b1"></i><i class="bit b2"></i><i class="bit b3"></i>
      <img src="${asset(slug, 'img/atendente.webp')}" alt="Atendente da THD Engenharia" width="768" height="559" loading="lazy">
    </div>
  </div>
</section>`;

// carrossel de órgãos reguladores: anda sozinho, arrasta com o dedo/mouse e tem setas
const selos = (slug) => {
  const card = (s, clone) => `<li class="selo"${clone ? ' aria-hidden="true"' : ''}><div class="selo-in">
      <span class="selo-logo"><img src="${asset(slug, 'img/' + s.img)}" alt="${clone ? '' : s.nome}" style="--h:${s.h}px" loading="lazy" draggable="false"></span>
      <span class="selo-cap"><strong>${s.nome}</strong>${s.papel}</span>
    </div></li>`;
  return `
<section class="selos" id="orgaos" aria-labelledby="selos-t">
  <div class="container selos-head">
    <div>
      <p class="kicker rv">Órgãos reguladores</p>
      <h2 class="rv" id="selos-t">Seu provedor em dia com quem regula o setor</h2>
    </div>
    <div class="selos-nav rv">
      <button type="button" class="prev" aria-label="Voltar">${I.seta}</button>
      <button type="button" class="next" aria-label="Avançar">${I.seta}</button>
    </div>
  </div>
  <div class="selos-viewport" data-selos data-cursor="Arraste">
    <ul class="selos-track">${C.selos.map((s) => card(s)).join('')}${C.selos.map((s) => card(s, true)).join('')}${C.selos.map((s) => card(s, true)).join('')}</ul>
  </div>
  <p class="container selos-note">As marcas pertencem aos respectivos órgãos e aparecem aqui só para indicar com quem a THD trata os processos do seu provedor.</p>
</section>`;
};

const srow = (slug, s, k = 0) => `
<a class="srow" href="${link(slug, 'servicos', '#' + s.id)}" style="--k:${k}" data-cursor="Ver">
  ${mk(s.id)}
  <div><h3>${s.titulo}</h3><p>${s.curto}</p></div>
  <span class="go">${I.seta}</span>
</a>`;

// ---------- páginas ----------
function home() {
  const slug = '';
  const heroGeo = geo([
    T('im', 'n', 0, 0, 0, { w: 2, img: 'assets/img/hero.webp', rad: '0 0 0 100%' }),
    T('ci', 'o', 2, 0), T('st', 'l', 2, 1, 1), T('qa', 'o', 0, 2, 1), T('sq', 'l', 1, 2), T('ar', 'w', 2, 2, 0),
  ], { wires: 'c', attrs: ' data-shuffle' });

  const jrnGeo = geo([
    T('sq', 'b', 0, 2, 0, { st: 0 }), T('sq', 'l', 1, 2, 0, { st: 0 }), T('qa', 'o', 2, 2, 1, { st: 0 }),
    T('ci', 'w', 0, 1, 0, { st: 1 }), T('st', 'l', 1, 1, 0, { st: 1 }),
    T('ar', 'o', 2, 1, 0, { st: 2 }), T('dt', 'w', 0, 0, 0, { st: 2 }),
    T('tr', 'l', 1, 0, 1, { st: 3 }), T('ci', 'o', 2, 0, 0, { st: 3 }),
  ], { wires: 'a', attrs: ' data-build' });

  const D = C.diagnostico;
  const diagLayout = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2]];
  const diagKinds = [['qa', 'o', 0], ['sq', 'l', 0], ['ci', 'b', 0], ['st', 'l', 0], ['ar', 'o', 2], ['sq', 'b', 0], ['qa', 'l', 1]];
  const diagGeo = geo([
    ...D.map((d, i) => T(diagKinds[i][0], diagKinds[i][1], diagLayout[i][0], diagLayout[i][1], diagKinds[i][2], { q: i })),
    T('ci', 'o', 1, 1, 0, { fixed: 1 }), T('tr', 'w', 2, 2, 2, { fixed: 1 }),
  ], { cls: 'geo-diag', wires: false, sats: false });

  const body = `
<section class="hero on-dark">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="container hero-in">
    <div class="hero-text">
      <p class="kicker fade-up" style="--d:.1s">${C.slogan}</p>
      <h1>${words('Seu provedor *regular,* em dia e pronto para crescer.')}</h1>
      <p class="lead fade-up" style="--d:.8s">Outorga SCM, ASN, IPv4, declarações à Anatel e contabilidade especializada. A THD cuida da parte técnica e burocrática para você focar no que importa: seus clientes.</p>
      <div class="actions fade-up" style="--d:.95s">
        ${waBtn('Solicitar orçamento', 'btn btn-o')}
        <a class="btn btn-line" href="#diagnostico" data-magnetic><span>Fazer o diagnóstico</span>${I.seta}</a>
      </div>
      <ul class="facts fade-up" style="--d:1.1s">
        <li><strong>Anatel, CREA, CFT</strong>e Registro.br em um só parceiro</li>
        <li><strong>Dezenas de empresas</strong>atendidas e crescendo</li>
        <li><strong>Seg. a sex., 9h às 18h</strong>atendimento pelo WhatsApp</li>
      </ul>
    </div>
    ${heroGeo}
  </div>
  <span class="scroll-hint" aria-hidden="true"></span>
</section>

${selos(slug)}
<section class="section" id="servicos">
  <div class="container">
    <div class="head-row">
      <div class="head">
        <p class="kicker rv">Nossos serviços</p>
        <h2 class="rv">Tudo o que o seu provedor precisa, organizado por frente</h2>
      </div>
      <a class="link-arrow rv" href="${link(slug, 'servicos')}">Ver todos os serviços ${I.seta}</a>
    </div>
    <div class="svx">
      <div class="svx-tabs" role="tablist" aria-label="Frentes de serviço">${C.grupos.map((g, i) => `
        <button class="svx-tab" role="tab" id="t-${g.id}" aria-controls="p-${g.id}" aria-selected="${i === 0}"><strong>${g.titulo}</strong><small>${g.resumo}</small></button>`).join('')}
      </div>
      <div>${C.grupos.map((g, i) => `
        <div class="svx-panel" role="tabpanel" id="p-${g.id}" aria-labelledby="t-${g.id}"${i ? ' hidden' : ''}>${C.servicos.filter((s) => s.grupo === g.id).map((s, k) => srow(slug, s, k)).join('')}
          <a class="srow srow-cta" href="${C.waOrcamento}" target="_blank" rel="noopener" style="--k:4" data-cursor="Conversar">${mk('cta')}<div><h3>Precisa de outra solução?</h3><p>Conte a situação do seu provedor e indicamos o melhor caminho.</p></div><span class="go">${I.whatsapp}</span></a>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section-dark on-dark jrn" style="--n:${C.jornada.length}" data-jrn>
  <div class="jrn-sticky">
    <div class="blueprint" aria-hidden="true"></div>
    <div class="container jrn-in">
      <div>
        <div class="head">
          <p class="kicker">A jornada do provedor</p>
          <h2>Montamos a estrutura do seu provedor, peça por peça</h2>
        </div>
        <ol class="jrn-steps"><span class="jrn-bar" aria-hidden="true"></span>${C.jornada.map((j, i) => `
          <li${i === 0 ? ' class="on cur"' : ''}>
            <h3>${j.t}</h3>
            <div class="body"><div>
              <p>${j.d}</p>
              <ul class="jrn-tags">${j.ids.map((id) => `<li><a href="${link(slug, 'servicos', '#' + id)}">${shortTitle(svc(id).titulo)}</a></li>`).join('')}</ul>
            </div></div>
          </li>`).join('')}
        </ol>
      </div>
      ${jrnGeo}
    </div>
  </div>
</section>

<section class="section section-paper" id="diagnostico">
  <div class="container">
    <div class="head">
      <p class="kicker rv">Diagnóstico rápido</p>
      <h2 class="rv">Como está o seu provedor hoje?</h2>
      <p class="rv" data-d="1">Responda as perguntas e veja quais peças já estão no lugar. No fim, mande o resultado direto para a nossa equipe.</p>
    </div>
    <div class="diag" data-diag>
      <ul class="dq">${D.map((d, i) => `
        <li class="rv" data-d="${i % 3}">
          <p id="dq-${i}">${d.q}</p>
          <div class="seg" role="group" aria-labelledby="dq-${i}" data-i="${i}">
            <button type="button" data-v="sim" aria-pressed="false">Sim</button><button type="button" data-v="nao" aria-pressed="false">Não</button><button type="button" data-v="ns" aria-pressed="false">Não sei</button>
          </div>
        </li>`).join('')}
      </ul>
      <aside class="diag-card on-dark" aria-live="polite">
        <h3>O mapa do seu provedor</h3>
        <p class="diag-msg" data-diag-msg>Cada resposta encaixa uma peça. As que faltam ficam marcadas em laranja.</p>
        ${diagGeo}
        <p class="diag-score"><span data-diag-score>0</span><small>de ${D.length} peças<br>no lugar</small></p>
        <ul class="diag-pend" data-diag-pend></ul>
        <a class="btn btn-o" href="${C.waOrcamento}" target="_blank" rel="noopener" data-diag-go data-magnetic>${I.whatsapp}<span>Enviar diagnóstico</span></a>
      </aside>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="head">
      <p class="kicker rv">Como trabalhamos</p>
      <h2 class="rv">O que você pode esperar da THD</h2>
    </div>
    <div class="pnl rv" data-pnl>${C.quemSomos.pilares.map((p, i) => `
      <div class="pnl-item${i === 0 ? ' on' : ''}" tabindex="0" role="button" aria-expanded="${i === 0}" data-cursor="Abrir"><span class="pnl-shape" aria-hidden="true"></span><h3>${p.t}</h3><p>${p.d}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section section-paper">
  <div class="container split">
    <figure class="media rv">
      <img src="assets/img/internet.webp" alt="Conexões de internet ao redor do mundo" width="1000" height="483" loading="lazy">
      <i class="bit b1"></i><i class="bit b2"></i><i class="bit b3"></i>
    </figure>
    <div>
      <p class="kicker rv">Quem somos</p>
      <h2 class="rv">Consultoria feita para quem leva internet às pessoas</h2>
      <p class="rv">${C.quemSomos.intro}</p>
      <p class="rv">${C.quemSomos.historia}</p>
      <blockquote class="rv"><strong>Nossa missão:</strong> ${C.quemSomos.missao.charAt(0).toLowerCase() + C.quemSomos.missao.slice(1)}</blockquote>
      <a class="link-arrow rv" href="${link(slug, 'quem-somos')}">Conheça a THD ${I.seta}</a>
    </div>
  </div>
</section>

<section class="section section-dark on-dark ctb">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="container ctb-in">
    <div>
      <p class="kicker rv">Contabilidade para provedores</p>
      <h2 class="rv">${C.contabilidade.pergunta}</h2>
      <p class="rv" data-d="1">${C.contabilidade.smart}</p>
      <div class="actions rv" data-d="2"><a class="btn btn-o" href="${link(slug, 'contabilidade')}" data-magnetic><span>Conhecer a contabilidade</span>${I.seta}</a></div>
    </div>
    ${bars()}
  </div>
</section>
${ctaBand(slug)}`;
  const jsonld = `
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: C.nome, description: C.quemSomos.intro,
    url: C.dominio + '/', logo: C.dominio + '/assets/img/logo-claro.png', image: C.dominio + '/assets/img/og.jpg',
    telephone: C.contato.telefoneSchema, email: C.contato.email, taxID: C.cnpj,
    address: { '@type': 'PostalAddress', streetAddress: 'R. Almirante Pestana, 6', addressLocality: 'Rio de Janeiro', addressRegion: 'RJ', addressCountry: 'BR' },
    openingHours: 'Mo-Fr 09:00-18:00', sameAs: C.contato.redes.map((r) => r.url), areaServed: 'BR',
  })}</script>`;
  return layout({ slug, jsonld, body,
    title: 'THD Engenharia | Consultoria de provedores de internet',
    desc: 'Consultoria para provedores de internet: outorga SCM, ASN, aluguel de IPv4, DICI, notificações Anatel, responsabilidade técnica e contabilidade especializada.' });
}

// gráfico decorativo de barras que sobem (extratos mensais)
function bars() {
  const h = [34, 42, 38, 51, 47, 60, 58, 71, 68, 84];
  return `<div><div class="bars" data-bars aria-hidden="true">${h.map((v, i) => `<i style="--h:${v}%;--k:${i}"></i>`).join('')}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path vector-effect="non-scaling-stroke" d="M${h.map((v, i) => `${(i + 0.5) * 10} ${100 - v - 6}`).join(' L')}"/></svg></div>
    <p class="bars-cap">Extratos contábeis todo mês, para enxergar a evolução do seu provedor.</p></div>`;
}

function quemSomos() {
  const slug = 'quem-somos';
  const Q = C.quemSomos;
  const missao = Q.missao.split(' ').map((w) => `<span class="mw${/praticidade|segurança/i.test(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const body = `
${pageHero(slug, 'Institucional', 'Quem *somos*', Q.intro,
    [T('sq', 'l', 0, 0), T('qa', 'o', 1, 0, 1), T('x', 'w', 2, 0), T('ci', 'w', 0, 1), T('sq', 'b', 1, 1), T('ar', 'o', 2, 1), T('st', 'l', 0, 2), T('tr', 'o', 1, 2, 3), T('ci', 'l', 2, 2)])}
<section class="section">
  <div class="container split">
    <div>
      <p class="kicker rv">Nossa história</p>
      <h2 class="rv">Soluções completas para quem leva internet às pessoas</h2>
      <p class="rv">${Q.historia}</p>
      <p class="rv">Reunimos engenharia, regulatório, contabilidade e marketing em um só lugar, para que o provedor tenha um parceiro que entende o seu negócio de ponta a ponta.</p>
      <div class="actions rv">${waBtn('Faça seu orçamento', 'btn btn-o')}</div>
    </div>
    <figure class="media rv">
      <img src="../assets/img/rede.webp" alt="Profissional analisando a rede em um data center" width="1600" height="900" loading="lazy">
      <i class="bit b1"></i><i class="bit b2"></i><i class="bit b3"></i>
    </figure>
  </div>
</section>

<section class="section section-dark on-dark">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="container">
    <p class="kicker">Nossa missão</p>
    <p class="manifesto" data-manifesto>${missao}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="head">
      <p class="kicker rv">Como trabalhamos</p>
      <h2 class="rv">O que você pode esperar da THD</h2>
    </div>
    <div class="pnl rv" data-pnl>${Q.pilares.map((p, i) => `
      <div class="pnl-item${i === 0 ? ' on' : ''}" tabindex="0" role="button" aria-expanded="${i === 0}" data-cursor="Abrir"><span class="pnl-shape" aria-hidden="true"></span><h3>${p.t}</h3><p>${p.d}</p></div>`).join('')}
    </div>
  </div>
</section>
${selos(slug)}
<section class="section section-paper">
  <div class="container">
    <div class="head">
      <p class="kicker rv">Onde atuamos</p>
      <h2 class="rv">Quatro frentes, um só parceiro</h2>
    </div>
    <ul class="fronts">${C.grupos.map((g, i) => `
      <li class="rv"><a href="${link(slug, 'servicos', '#' + g.id)}" data-cursor="Ver"><strong>${g.titulo}</strong><span>${g.resumo}</span><span class="go">${I.seta}</span><i class="float" style="--c:${['var(--orange)', 'var(--blue)', 'var(--blue-l)', 'var(--orange)'][i]};border-radius:${['50%', '100% 0 0 0', '0', '0 0 100% 0'][i]}"></i></a></li>`).join('')}
    </ul>
  </div>
</section>
${ctaBand(slug)}`;
  return layout({ slug, body,
    title: 'Quem somos | THD Engenharia',
    desc: 'A THD é uma consultoria especializada em provedores de internet. Praticidade e segurança para resolver as questões técnicas e regulatórias do seu provedor.' });
}

function servicos() {
  const slug = 'servicos';
  const grpGeo = [
    [T('qa', 'o', 0, 0), T('sq', 'b', 1, 0), T('x', 'w', 2, 0), T('sq', 'l', 0, 1), T('ci', 'o', 1, 1), T('sq', 'b', 2, 1), T('x', 'w', 0, 2), T('st', 'b', 1, 2), T('qa', 'l', 2, 2, 2)],
    [T('ci', 'l', 0, 0), T('x', 'w', 1, 0), T('ci', 'b', 2, 0), T('sq', 'o', 0, 1), T('ri', 'b', 1, 1), T('sq', 'o', 2, 1), T('ci', 'b', 0, 2), T('x', 'w', 1, 2), T('ci', 'l', 2, 2)],
    [T('tr', 'o', 0, 0), T('sq', 'b', 1, 0), T('qa', 'l', 2, 0, 1), T('st', 'l', 0, 1, 1), T('sq', 'o', 1, 1), T('x', 'w', 2, 1), T('sq', 'b', 0, 2), T('ar', 'l', 1, 2), T('tr', 'o', 2, 2, 2)],
    [T('x', 'w', 0, 0), T('sq', 'l', 1, 0), T('qa', 'o', 2, 0, 1), T('sq', 'b', 0, 1), T('sq', 'l', 1, 1), T('dt', 'b', 2, 1), T('qa', 'o', 0, 2, 3), T('sq', 'b', 1, 2), T('ci', 'o', 2, 2)],
  ];
  const body = `
${pageHero(slug, 'Catálogo de soluções', 'Serviços para *provedores* de internet', 'Da outorga na Anatel à contabilidade: escolha o que o seu provedor precisa ou fale com a gente para montar um pacote.',
    [T('sq', 'b', 0, 0), T('ci', 'o', 1, 0), T('qa', 'l', 2, 0, 1), T('st', 'l', 0, 1), T('x', 'w', 1, 1), T('sq', 'o', 2, 1), T('ar', 'w', 0, 2), T('sq', 'l', 1, 2), T('tr', 'o', 2, 2, 2)], 'a')}
<div class="gnav-wrap">
  <nav class="container gnav" aria-label="Frentes de serviço">${C.grupos.map((g) => `<a href="#${g.id}">${g.titulo}</a>`).join('')}<span class="bar" aria-hidden="true"></span></nav>
</div>
${C.grupos.map((g, gi) => `
<section class="section${gi % 2 ? ' section-paper' : ''}" id="${g.id}">
  <div class="container grp">
    <div class="grp-head">
      <p class="kicker rv">${g.titulo}</p>
      <h2 class="rv">${g.resumo}</h2>
      ${geo(grpGeo[gi], { wires: false, sats: false, attrs: ' data-shuffle' })}
    </div>
    <div class="acc">${C.servicos.filter((s) => s.grupo === g.id).map((s) => `
      <div class="acc-item rv" id="${s.id}">
        <h3 class="acc-h"><button type="button" aria-expanded="false" aria-controls="b-${s.id}">${mk(s.id)}<span><span class="acc-t">${s.titulo}</span><small>${s.curto}</small></span><span class="tog">${I.mais}</span></button></h3>
        <div class="acc-body" id="b-${s.id}" role="region"><div><div class="inner">
          <p>${s.texto}</p>
          <div class="actions">
            ${waBtn('Pedir orçamento', 'btn btn-o btn-sm', `Olá, THD! Quero um orçamento de: ${s.titulo}.`)}
            ${s.link ? `<a class="link-arrow" href="${link(slug, s.link)}">Ver contabilidade ${I.seta}</a>` : ''}
          </div>
        </div></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>`).join('')}
${ctaBand(slug, 'Não sabe por onde começar?', `Faça o <a href="${link(slug, '', '#diagnostico')}" style="color:var(--orange);font-weight:600">diagnóstico rápido</a> ou fale com a nossa equipe. Indicamos o caminho certo para a situação do seu provedor.`)}`;
  return layout({ slug, body,
    title: 'Serviços | THD Engenharia',
    desc: 'Outorga SCM, SEAC e STFC, DICI e pós-outorga, notificações Anatel/CREA/CFT, ASN, aluguel de IPv4, responsabilidade técnica, segurança do trabalho, contabilidade, marketing e registro de marca.' });
}

function contabilidade() {
  const slug = 'contabilidade';
  const K = C.contabilidade;
  const body = `
${pageHero(slug, 'Serviço contábil especializado', 'Você sabe a *rentabilidade* do seu negócio?', K.smart,
    [T('x', 'w', 0, 0), T('sq', 'l', 1, 0), T('qa', 'o', 2, 0, 1), T('sq', 'b', 0, 1), T('sq', 'l', 1, 1), T('sq', 'o', 2, 1), T('sq', 'b', 0, 2), T('sq', 'l', 1, 2), T('sq', 'o', 2, 2)], 'c')}
<section class="section">
  <div class="container split">
    <figure class="media sq rv">
      <img src="../assets/img/contabilidade.webp" alt="THD Engenharia, contabilidade" width="800" height="800" loading="lazy">
      <i class="bit b1"></i><i class="bit b2"></i><i class="bit b3"></i>
    </figure>
    <div>
      <p class="kicker rv">Smart Accounting</p>
      <h2 class="rv">Contabilidade que mostra onde está o seu lucro</h2>
      <p class="rv">${K.time}</p>
      <p class="rv"><strong>Atendemos:</strong></p>
      <ul class="segments rv">${K.segmentos.map((s) => `<li>${s}</li>`).join('')}</ul>
      <div class="actions rv">${waBtn('Falar com a contabilidade', 'btn btn-o', 'Olá, THD! Quero saber mais sobre o serviço de contabilidade.')}</div>
    </div>
  </div>
</section>

<section class="section section-paper">
  <div class="container">
    <div class="head">
      <p class="kicker rv">Gestão contábil</p>
      <h2 class="rv">Do operacional ao estratégico</h2>
      <p class="rv">${svc('gestao-contabil').texto}</p>
    </div>
    <div class="switch rv" role="tablist" data-switch>
      <button role="tab" id="sw-op" aria-controls="pn-op" aria-selected="true">Rotina operacional</button>
      <button role="tab" id="sw-es" aria-controls="pn-es" aria-selected="false">Planejamento estratégico</button>
      <span class="bar" aria-hidden="true"></span>
    </div>
    <div class="sw-panel" role="tabpanel" id="pn-op" aria-labelledby="sw-op">
      <div><h3>O dia a dia contábil, resolvido</h3><p>Guias, notas, documentos e demonstrações em dia, sem você precisar correr atrás.</p></div>
      <ul class="big-list">${K.operacional.map((x) => `<li><i></i>${x}</li>`).join('')}</ul>
    </div>
    <div class="sw-panel" role="tabpanel" id="pn-es" aria-labelledby="sw-es" hidden>
      <div><h3>Números a favor do negócio</h3><p>${K.estrategico}</p></div>
      <ul class="big-list"><li><i></i>Extratos contábeis mensais</li><li><i></i>Oportunidades de redução de custos e impostos</li><li><i></i>Mais lucratividade para o negócio</li></ul>
    </div>
  </div>
</section>

<section class="section section-dark on-dark ctb">
  <div class="blueprint" aria-hidden="true"></div>
  <div class="container ctb-in">
    <div>
      <p class="kicker rv">Extratos mensais</p>
      <h2 class="rv">Enxergue a evolução do seu provedor mês a mês</h2>
      <p class="rv" data-d="1">Nossos contadores acompanham os números e apontam onde reduzir custos e impostos.</p>
    </div>
    ${bars()}
  </div>
</section>
${ctaBand(slug, 'Descubra a real rentabilidade do seu provedor', 'Converse com a nossa equipe contábil e veja onde é possível economizar.')}`;
  return layout({ slug, body,
    title: 'Contabilidade para provedores | THD Engenharia',
    desc: 'Contabilidade especializada com Smart Accounting: extratos mensais, redução de custos e impostos e planejamento estratégico para provedores de internet e empresas.' });
}

function contato() {
  const slug = 'contato';
  const c = C.contato;
  const body = `
${pageHero(slug, 'Formulário e WhatsApp', 'Fale com a nossa *equipe*', 'Estamos à disposição para o seu contato. Escolha o canal que preferir.',
    [T('ci', 'o', 0, 0), T('sq', 'l', 1, 0), T('x', 'w', 2, 0), T('qa', 'b', 0, 1, 1), T('ri', 'w', 1, 1), T('sq', 'o', 2, 1), T('x', 'w', 0, 2), T('ar', 'l', 1, 2), T('ci', 'b', 2, 2)])}
<section class="section">
  <div class="container contact">
    <form class="form rv" id="form-contato" novalidate data-whats="${c.whatsapp}">
      <h2>Envie sua mensagem</h2>
      <p class="form-note">Ao enviar, sua mensagem abre pronta no WhatsApp da THD.</p>
      <div class="row2">
        <label class="fl"><input name="nome" autocomplete="name" required placeholder=" "><span>Nome *</span></label>
        <label class="fl"><input name="empresa" autocomplete="organization" placeholder=" "><span>Empresa ou provedor</span></label>
      </div>
      <div class="row2">
        <label class="fl"><input name="telefone" type="tel" autocomplete="tel" inputmode="tel" required placeholder=" "><span>Telefone *</span></label>
        <label class="fl"><input name="email" type="email" autocomplete="email" placeholder=" "><span>E-mail</span></label>
      </div>
      <fieldset class="subj">
        <legend>Assunto *</legend>
        <div>${c.assuntos.map((a, i) => `<label><input type="radio" name="assunto" value="${a}"${i === 0 ? ' checked' : ''}><span>${a}</span></label>`).join('')}</div>
      </fieldset>
      <label class="fl"><textarea name="mensagem" rows="4" required placeholder=" "></textarea><span>Mensagem *</span></label>
      <button class="btn btn-o" type="submit" data-magnetic>${I.whatsapp}<span>Enviar mensagem</span></button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>

    <aside class="chan rv" data-d="1">
      <a class="wa" href="${C.waOrcamento}" target="_blank" rel="noopener" data-cursor="Conversar"><span class="ci">${I.whatsapp}</span><span><strong>Estamos no WhatsApp</strong><small>${c.whatsappTexto}, clique para conversar</small></span></a>
      <a href="mailto:${c.email}"><span class="ci">${I.email}</span><span><strong>E-mail</strong><small>${c.email}</small></span></a>
      <div><span class="ci">${I.relogio}</span><span><strong>Horário de atendimento</strong>${c.horario.map(([d, h]) => `<small>${d}: ${h}</small>`).join('')}</span></div>
      <div><span class="ci">${I.sinal}</span><span><strong>Redes sociais</strong>${c.redes.map((r) => `<small><a href="${r.url}" target="_blank" rel="noopener">${r.rotulo} ${r.handle}</a></small>`).join('')}</span></div>
      <div><span class="ci">${I.pin}</span><span><strong>Endereço</strong><small>${c.endereco}</small></span></div>
    </aside>
  </div>
</section>`;
  return layout({ slug, body,
    title: 'Contato | THD Engenharia',
    desc: 'Fale com a THD Engenharia pelo WhatsApp (21) 9 9834-0142 ou e-mail contato@thdengenharia.com. Atendimento de segunda a sexta, das 9h às 18h.' });
}

// ---------- gravação ----------
const pages = { '': home(), 'quem-somos': quemSomos(), servicos: servicos(), contabilidade: contabilidade(), contato: contato() };

fs.rmSync(OUT, { recursive: true, force: true });
for (const [slug, html] of Object.entries(pages)) {
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
for (const d of ['css', 'js', 'img']) fs.mkdirSync(path.join(OUT, 'assets', d), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'css', 'style.css'), css);
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'main.js'), js);
const IMG = path.join(__dirname, 'img');
for (const f of fs.readdirSync(IMG)) fs.copyFileSync(path.join(IMG, f), path.join(OUT, 'assets', 'img', f));

if (!PREVIEW) {
  const hoje = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).map((s) => `  <url><loc>${canonical(s)}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
  fs.copyFileSync(path.join(__dirname, 'htaccess.txt'), path.join(OUT, '.htaccess'));
}
console.log(`THD: ${Object.keys(pages).length} páginas → ${path.relative(process.cwd(), OUT) || OUT}`);
