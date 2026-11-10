// Gera o modelo "Órbita" do site THD Engenharia (nível premium, segundo modelo).
//   node clientes/thd-engenharia/_build-orbita/build.js            → site-orbita/     (produção, URLs limpas)
//   node clientes/thd-engenharia/_build-orbita/build.js --preview  → _preview-orbita/ (abre sem servidor)
//
// O conteúdo é o mesmo do primeiro modelo (lido de ../_build/content.js). Só o design muda.
// Linguagem visual: os anéis orbitais do logo. Um giroscópio 3D no topo, seções que sobem como lâminas
// conforme a rolagem, pilha 3D de camadas para os serviços, jornada em trilho horizontal, diagnóstico em
// baralho de cartas, tambor 3D para os pilares e barras isométricas para a contabilidade.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('../_build/content');
const I = require('../_build/icons');
const { css } = require('./style');
const { js } = require('./script');

const PREVIEW = process.argv.includes('--preview');
const OUT = path.join(__dirname, '..', PREVIEW ? '_preview-orbita' : 'site-orbita');
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

// título com palavras que sobem girando em 3D; *palavra* fica em laranja
const words = (text) => text.split(' ').map((w, i) => {
  const m = /^\*(.+)\*([.,!?]?)$/.exec(w);
  const inner = m ? `<em>${m[1]}</em>${m[2]}` : w;
  return `<span class="w"><span style="--i:${i}">${inner}</span></span>`;
}).join(' ');
// texto com rolagem de letras no hover (menu e botões)
const roll = (t) => `<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;

// ---------- componentes 3D ----------
// giroscópio: planeta + anéis do logo (laranja em pé, azul-céu deitado) + anéis finos e satélites
const ORB = {
  hero: { rings: ['o', 's', 'a', 'b', 'd'], img: 'hero.webp' },
  page: { rings: ['o', 's', 'a', 'd'] },
  soft: { rings: ['o', 's', 'b'] },
  line: { rings: ['o', 's', 'a', 'b', 'd'], bare: true },
};
const orb = (slug, v = 'page', cls = '') => {
  const o = ORB[v];
  const rings = o.rings.map((r) => `<div class="ring r-${r}"><i class="ring-in">${'osb'.includes(r) ? '<b class="sat"></b>' : ''}${r === 'o' ? '<b class="sat sat-2"></b>' : ''}</i></div>`).join('');
  const planet = o.bare ? '' : `<div class="planet">${o.img ? `<img src="${asset(slug, 'img/' + o.img)}" alt="" width="1920" height="1056" fetchpriority="high">` : ''}<i class="shine"></i></div>`;
  return `<div class="orb orb-${v} ${cls}" data-orb aria-hidden="true"><div class="orb-rig">${planet}${rings}</div><div class="orb-glow"></div></div>`;
};

// barras isométricas 3D (extratos mensais)
const H = [34, 42, 38, 51, 47, 60, 58, 71, 68, 84];
const iso = (cap = true) => `<figure class="iso rv" data-iso aria-hidden="true">
  <div class="iso-stage"><div class="iso-in"><div class="iso-floor"></div>${H.map((v, i) => `<div class="bar3${i === H.length - 1 ? ' hot' : ''}" style="--h:${v};--k:${i}"><i class="f-t"></i><i class="f-a"></i><i class="f-b"></i></div>`).join('')}</div></div>
  ${cap ? '<figcaption>Extratos contábeis todo mês, para enxergar a evolução do seu provedor.</figcaption>' : ''}
</figure>`;

// pilha de camadas: uma placa por frente de serviço
const stack = (active = -1, cls = '') => `<div class="stack ${cls}" aria-hidden="true"${active > -1 ? ` style="--a:${active}"` : ''}><div class="stack-in">${C.grupos.map((g, i) => `
  <div class="plate${i === active ? ' on' : ''}" style="--i:${C.grupos.length - 1 - i}" data-plate="${i}"><div class="pl-top"><span>${g.titulo}</span></div><i class="pl-a"></i><i class="pl-b"></i></div>`).join('')}
</div></div>`;

// cartão com inclinação 3D e um anel passando pela frente e por trás da foto
const tilt = (src, alt, w, h, cls = '') => `<figure class="tilt rv ${cls}" data-tilt>
  <div class="tilt-in">
    <img src="${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy">
    <span class="tilt-ring" aria-hidden="true"><i></i></span>
    <span class="tilt-sq" aria-hidden="true"></span>
  </div>
</figure>`;

// ---------- partes comuns ----------
const waBtn = (label = 'Falar no WhatsApp', cls = 'btn btn-w', msg) =>
  `<a class="${cls}" href="${msg ? C.wa(msg) : C.waOrcamento}" target="_blank" rel="noopener" data-magnetic>${I.whatsapp}${roll(label)}</a>`;
const arrowBtn = (href, label, cls = 'btn btn-o', extra = '') =>
  `<a class="${cls}" href="${href}"${extra} data-magnetic>${roll(label)}<span class="b-ar">${I.seta}</span></a>`;
const bgOrbits = (cls = '') => `<svg class="bg-orbits ${cls}" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g class="bo-a"><ellipse cx="500" cy="500" rx="470" ry="150"/><circle class="bo-s" r="6" cx="970" cy="500"/></g>
  <g class="bo-b"><ellipse cx="500" cy="500" rx="150" ry="440"/><circle class="bo-s o" r="5" cx="500" cy="60"/></g>
  <g class="bo-c"><ellipse cx="500" cy="500" rx="360" ry="360"/></g>
</svg>`;

function header(slug) {
  const items = PAGES.map((p) => `<a href="${link(slug, p.slug)}"${p.slug === slug ? ' aria-current="page"' : ''}>${roll(p.nav)}</a>`).join('');
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<canvas class="sky" aria-hidden="true"></canvas>
<div class="warp" aria-hidden="true"><i class="warp-o"></i><i class="warp-s"></i></div>
<header class="hdr">
  <div class="hdr-in">
    <a class="brand" href="${link(slug, '')}" aria-label="THD Engenharia, página inicial">
      <img src="${asset(slug, 'img/logo-simbolo.png')}" alt="THD Engenharia, consultoria de provedores de internet" width="360" height="217">
    </a>
    <nav class="nav" aria-label="Principal">${items}<span class="nav-ind" aria-hidden="true"></span></nav>
    <a class="btn btn-o btn-sm hdr-cta" href="${C.waOrcamento}" target="_blank" rel="noopener" data-magnetic>${roll('Solicitar orçamento')}<span class="b-ar">${I.seta}</span></a>
    <button class="menu-btn" data-menu aria-controls="mmenu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
  </div>
</header>
<div class="mmenu" id="mmenu">
  ${orb(slug, 'line', 'mm-orb')}
  <nav aria-label="Menu">${PAGES.map((p, i) => `<a href="${link(slug, p.slug)}" style="--i:${i}"${p.slug === slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('')}</nav>
  <div class="mmenu-foot">
    <a href="${C.waOrcamento}" target="_blank" rel="noopener">WhatsApp ${C.contato.whatsappTexto}</a>
    <a href="mailto:${C.contato.email}">${C.contato.email}</a>
  </div>
</div>`;
}

function footer(slug) {
  const c = C.contato;
  return `
<footer class="footer t-dark">
  <div class="container where">
    <div class="where-copy rv">
      <p class="kicker">Onde estamos</p>
      <h2>${words('Nosso escritório fica no *Rio* *de* *Janeiro.*')}</h2>
      <p>Estamos no Cacuia, na Ilha do Governador. Atendemos de segunda a sexta, das 9h às 18h, pelo WhatsApp, por e-mail ou pessoalmente com horário marcado.</p>
      ${arrowBtn(C.waOrcamento, 'Marcar um horário', 'btn btn-o', ' target="_blank" rel="noopener"')}
    </div>
    <div class="map3d rv" data-tilt>
      <div class="tilt-in map-box">
        <iframe title="Mapa: THD Engenharia na R. Almirante Pestana, 6, Cacuia, Rio de Janeiro" src="${c.mapa}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div class="map-info"><b>THD Engenharia</b><span>${c.endereco}</span><span>${c.horario[0][0]}, ${c.horario[0][1]}</span>
          <div class="mbtns"><a href="${c.mapsLink}" target="_blank" rel="noopener">${I.pin}Abrir no Maps</a><a class="sq" href="${c.rotaLink}" target="_blank" rel="noopener" aria-label="Traçar rota até a THD">${I.seta}</a></div>
        </div>
      </div>
    </div>
  </div>
  <div class="container foot-grid">
    <div class="foot-brand">
      <img src="${asset(slug, 'img/logo.png')}" alt="THD Engenharia" width="440" height="308" loading="lazy">
      <p>Consultoria para provedores de internet, com excelência e garantia.</p>
      <div class="social">${c.redes.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.rotulo}">${I[r.rede]}</a>`).join('')}</div>
    </div>
    <div>
      <h3>Navegação</h3>
      <ul>${PAGES.map((p) => `<li><a href="${link(slug, p.slug)}">${roll(p.nav)}</a></li>`).join('')}</ul>
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
  <p class="foot-word" aria-hidden="true" data-par="-.06">THD Engenharia</p>
  <div class="container foot-bottom">
    <span>© <span id="year">${new Date().getFullYear()}</span> ${C.nome}. CNPJ ${C.cnpj}</span>
    <span>Site por ${C.credito.url ? `<a href="${C.credito.url}" target="_blank" rel="noopener">${C.credito.nome}</a>` : C.credito.nome}</span>
  </div>
</footer>
<a class="wa-float" href="${C.waOrcamento}" target="_blank" rel="noopener" aria-label="Falar com a THD no WhatsApp" data-cursor="Conversar">
  <svg class="wa-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30"/><circle class="p" cx="32" cy="32" r="30"/></svg>${I.whatsapp}
</a>
<div class="cursor" aria-hidden="true"><i class="c-dot"></i><i class="c-ring"><span></span></i></div>`;
}

const headScript = `<script>(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('thd-o-nav')){d.classList.add('enter');sessionStorage.removeItem('thd-o-nav');}}catch(e){}})();</script>`;

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
<link rel="icon" type="image/png" sizes="64x64" href="${asset(slug, 'img/favicon.png')}">
<link rel="icon" type="image/png" sizes="512x512" href="${asset(slug, 'img/icon-512.png')}">
<link rel="apple-touch-icon" href="${asset(slug, 'img/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
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

const pageHero = (slug, kicker, title, lead, v = 'page') => `
<section class="phero t-dark" data-tone="dark">
  ${bgOrbits()}
  <div class="container phero-in">
    <div class="phero-copy" data-par=".18">
      <nav class="crumbs up" style="--d:.15s" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">${PAGES.find((p) => p.slug === slug).nav}</span></nav>
      <p class="kicker up" style="--d:.25s">${kicker}</p>
      <h1 class="split in">${words(title)}</h1>
      ${lead ? `<p class="lead up" style="--d:.75s">${lead}</p>` : ''}
    </div>
    ${orb(slug, v, 'phero-orb')}
  </div>
</section>`;

const ctaBand = (slug, titulo = 'Vamos tirar o seu provedor do papel ou deixá-lo em dia?', texto = 'Conte o que você precisa. Respondemos pelo WhatsApp em horário comercial.') => {
  const c = C.contato;
  return `
<section class="cta sheet t-orange" data-tone="orange">
  ${orb(slug, 'line', 'cta-orb')}
  <div class="container cta-in">
    <p class="kicker rv">Fale com a nossa equipe</p>
    <h2 class="split">${words(titulo)}</h2>
    <p class="cta-lead rv" style="--d:1">${texto}</p>
    <div class="cta-actions rv" style="--d:2">${waBtn('Chamar no WhatsApp', 'btn btn-w btn-lg')}<a class="link-arrow" href="${link(slug, 'contato')}">${roll('Enviar mensagem')}${I.seta}</a></div>
    <dl class="cta-info rv" style="--d:3">
      <div><dt>WhatsApp</dt><dd><a href="${C.waOrcamento}" target="_blank" rel="noopener">${c.whatsappTexto}</a></dd></div>
      <div><dt>E-mail</dt><dd><a href="mailto:${c.email}">${c.email}</a></dd></div>
      <div><dt>Atendimento</dt><dd>Seg. a sex., ${c.horario[0][1]}</dd></div>
    </dl>
  </div>
</section>`;
};

// parede de órgãos reguladores: cada placa gira em 3D e mostra o papel do órgão
const selos = (slug, tone = 'light') => `
<section class="selos sheet t-${tone}" id="orgaos" data-tone="${tone}" aria-labelledby="selos-t">
  ${tone === 'light' ? '<div class="bg-grid" aria-hidden="true"></div>' : bgOrbits()}
  <div class="container">
    <div class="selos-head">
      <p class="kicker rv">Órgãos reguladores</p>
      <h2 class="split" id="selos-t">${words('Seu provedor em dia com quem regula o setor')}</h2>
    </div>
    <ul class="wall" data-wall>${C.selos.map((s, i) => `
      <li class="flip rv" style="--d:${i % 3}"><button type="button" class="flip-in" aria-label="${s.nome}: ${s.papel}" data-cursor="Girar">
        <span class="fc fc-f"><img src="${asset(slug, 'img/' + s.img)}" alt="" style="--h:${s.h}px" loading="lazy" draggable="false"></span>
        <span class="fc fc-b"><strong>${s.nome}</strong><span>${s.papel}</span></span>
      </button></li>`).join('')}
    </ul>
    <p class="selos-note">As marcas pertencem aos respectivos órgãos e aparecem aqui só para indicar com quem a THD trata os processos do seu provedor.</p>
  </div>
</section>`;

// pilares em um tambor 3D que gira com a rolagem
const pilares = (tone = 'light') => {
  const P = C.quemSomos.pilares;
  return `
<section class="pil sheet t-${tone}" style="--n:${P.length}" data-pil data-tone="${tone}">
  <div class="pil-sticky">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="container pil-in">
      <div class="pil-head">
        <p class="kicker rv">Como trabalhamos</p>
        <h2 class="split">${words('O que você pode esperar da THD')}</h2>
        <div class="pil-tabs rv" role="tablist" aria-label="Pilares">${P.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-pil-go="${i}">${p.t}</button>`).join('')}<i class="pil-bar" aria-hidden="true"></i></div>
      </div>
      <div class="drum-wrap" aria-hidden="true"><div class="drum" data-drum>${P.map((p, i) => `<span class="drum-f" style="--i:${i}">${p.t}</span>`).join('')}</div></div>
      <div class="pil-desc">${P.map((p, i) => `<div class="pil-d${i ? '' : ' on'}" role="tabpanel"><h3>${p.t}</h3><p>${p.d}</p></div>`).join('')}</div>
    </div>
  </div>
</section>`;
};

const srow = (slug, s, k = 0) => `
<a class="srow" href="${link(slug, 'servicos', '#' + s.id)}" style="--k:${k}" data-cursor="Ver">
  <span class="srow-t"><strong>${s.titulo}</strong><small>${s.curto}</small></span>
  <span class="go">${I.seta}</span>
</a>`;

// ---------- páginas ----------
function home() {
  const slug = '';
  const D = C.diagnostico;
  const R = 84, CIRC = 2 * Math.PI * R, SEG = CIRC / D.length, GAP = 7;
  const arcs = D.map((d, i) => `<circle class="arc" data-q="${i}" cx="110" cy="110" r="${R}" stroke-dasharray="${(SEG - GAP).toFixed(2)} ${(CIRC - SEG + GAP).toFixed(2)}" stroke-dashoffset="${(-i * SEG).toFixed(2)}"/>`).join('');

  const body = `
<section class="hero t-dark" data-tone="dark">
  ${bgOrbits('hero-bo')}
  <div class="container hero-in">
    <div class="hero-text" data-par=".22">
      <p class="kicker up" style="--d:.15s">${C.slogan}</p>
      <h1 class="split in">${words('Seu provedor *regular,* em dia e pronto para crescer.')}</h1>
      <p class="lead up" style="--d:.85s">Outorga SCM, ASN, IPv4, declarações à Anatel e contabilidade especializada. A THD cuida da parte técnica e burocrática para você focar no que importa: seus clientes.</p>
      <div class="actions up" style="--d:1s">
        ${waBtn('Solicitar orçamento', 'btn btn-o')}
        <a class="btn btn-ghost" href="#diagnostico" data-magnetic>${roll('Fazer o diagnóstico')}<span class="b-ar">${I.seta}</span></a>
      </div>
    </div>
    <div class="hero-vis">${orb(slug, 'hero', 'hero-orb')}</div>
  </div>
  <ul class="container facts up" style="--d:1.15s">
    <li><strong>Anatel, CREA, CFT</strong>e Registro.br em um só parceiro</li>
    <li><strong>Dezenas de empresas</strong>atendidas e crescendo</li>
    <li><strong>Seg. a sex., 9h às 18h</strong>atendimento pelo WhatsApp</li>
  </ul>
</section>

${selos(slug)}

<section class="stk sheet t-deep" id="servicos" style="--n:${C.grupos.length}" data-stk data-tone="dark">
  <div class="stk-sticky">
    ${bgOrbits()}
    <div class="container">
      <div class="head-row">
        <div>
          <p class="kicker rv">Nossos serviços</p>
          <h2 class="split">${words('Tudo o que o seu provedor precisa, organizado por frente')}</h2>
        </div>
        <a class="link-arrow rv" href="${link(slug, 'servicos')}">${roll('Ver todos os serviços')}${I.seta}</a>
      </div>
      <div class="stk-grid">
        <div class="stk-vis">${stack(0, 'stack-live')}
          <div class="stk-tabs" role="tablist" aria-label="Frentes de serviço">${C.grupos.map((g, i) => `<button class="stk-tab" role="tab" id="t-${g.id}" aria-controls="p-${g.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${g.titulo}</button>`).join('')}</div>
        </div>
        <div class="stk-panels">${C.grupos.map((g, i) => `
          <div class="stk-panel${i === 0 ? ' on' : ''}" role="tabpanel" id="p-${g.id}" aria-labelledby="t-${g.id}">
            <h3>${g.titulo}</h3>
            <p class="stk-sum">${g.resumo}</p>
            <div class="srows">${C.servicos.filter((s) => s.grupo === g.id).map((s, k) => srow(slug, s, k)).join('')}
              <a class="srow srow-cta" href="${C.waOrcamento}" target="_blank" rel="noopener" style="--k:4" data-cursor="Conversar"><span class="srow-t"><strong>Precisa de outra solução?</strong><small>Conte a situação do seu provedor e indicamos o melhor caminho.</small></span><span class="go">${I.whatsapp}</span></a>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="jr sheet t-light" style="--n:${C.jornada.length}" data-jr data-tone="light">
  <div class="jr-sticky">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="container jr-head">
      <p class="kicker rv">A jornada do provedor</p>
      <h2 class="split">${words('Montamos a estrutura do seu provedor, peça por peça')}</h2>
    </div>
    <div class="jr-view">
      <ol class="jr-track" data-jr-track>
        <span class="jr-rail" aria-hidden="true"><i class="jr-fill"></i><i class="jr-spark"></i></span>${C.jornada.map((j, i) => `
        <li class="jr-st${i === 0 ? ' on' : ''}" style="--k:${i}">
          <span class="jr-node" aria-hidden="true"><i></i><b></b></span>
          <div class="jr-card">
            <h3>${j.t}</h3>
            <p>${j.d}</p>
            <ul class="jr-tags">${j.ids.map((id) => `<li><a href="${link(slug, 'servicos', '#' + id)}">${shortTitle(svc(id).titulo)}</a></li>`).join('')}</ul>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="diag-sec sheet t-deep" id="diagnostico" data-tone="dark">
  ${bgOrbits()}
  <div class="container diag" data-diag>
    <div class="diag-l">
      <p class="kicker rv">Diagnóstico rápido</p>
      <h2 class="split">${words('Como está o seu provedor hoje?')}</h2>
      <p class="rv">Responda e veja quais peças já estão no lugar. No fim, mande o resultado direto para a nossa equipe.</p>
      <div class="diag-prog rv" aria-live="polite"><span><b data-diag-n>0</b> de ${D.length} respondidas</span><i><em data-diag-bar></em></i></div>
      <div class="deck rv" data-deck>${D.map((d, i) => `
        <div class="qc" data-i="${i}">
          <p class="qc-k">${d.pend}</p>
          <p class="qc-q" id="dq-${i}">${d.q}</p>
          <div class="seg" role="group" aria-labelledby="dq-${i}" data-i="${i}"><button type="button" data-v="sim" aria-pressed="false">Sim</button><button type="button" data-v="nao" aria-pressed="false">Não</button><button type="button" data-v="ns" aria-pressed="false">Não sei</button></div>
        </div>`).join('')}
        <div class="qc qc-end" data-i="${D.length}">
          <p class="qc-k">Diagnóstico concluído</p>
          <p class="qc-q">Veja o mapa do seu provedor e envie o resultado para a THD.</p>
          <button type="button" class="link-arrow" data-deck-reset>${roll('Responder de novo')}${I.seta}</button>
        </div>
      </div>
      <div class="deck-nav rv"><button type="button" data-deck-prev>${I.seta}<span>Voltar</span></button><button type="button" data-deck-next><span>Pular</span>${I.seta}</button></div>
    </div>
    <aside class="diag-card rv" aria-live="polite">
      <h3>O mapa do seu provedor</h3>
      <p class="diag-msg" data-diag-msg>Cada resposta encaixa uma peça. As que faltam ficam marcadas em laranja.</p>
      <div class="gauge">
        <svg viewBox="0 0 220 220" aria-hidden="true"><circle class="g-orbit" cx="110" cy="110" r="104"/><g transform="rotate(-90 110 110)">${arcs}</g></svg>
        <p class="diag-score"><span data-diag-score>0</span><small>de ${D.length} peças<br>no lugar</small></p>
      </div>
      <ul class="diag-pend" data-diag-pend></ul>
      <a class="btn btn-o" href="${C.waOrcamento}" target="_blank" rel="noopener" data-diag-go data-magnetic>${I.whatsapp}<span class="lbl">Enviar diagnóstico</span></a>
    </aside>
  </div>
</section>

${pilares()}

<section class="sec sheet t-deep qs" data-tone="dark">
  ${bgOrbits()}
  <div class="container split-2">
    ${tilt(asset(slug, 'img/rack.webp'), 'Rack de rede com cabos organizados em um provedor de internet', 683, 1024, 'tilt-tall')}
    <div>
      <p class="kicker rv">Quem somos</p>
      <h2 class="split">${words('Consultoria feita para quem leva internet às pessoas')}</h2>
      <p class="rv">${C.quemSomos.intro}</p>
      <p class="rv">${C.quemSomos.historia}</p>
      <blockquote class="rv"><strong>Nossa missão:</strong> ${C.quemSomos.missao.charAt(0).toLowerCase() + C.quemSomos.missao.slice(1)}</blockquote>
      <a class="link-arrow rv" href="${link(slug, 'quem-somos')}">${roll('Conheça a THD')}${I.seta}</a>
    </div>
  </div>
</section>

<section class="sec sheet t-light ctb" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container split-2 ctb-in">
    <div>
      <p class="kicker rv">Contabilidade para provedores</p>
      <h2 class="split">${words(C.contabilidade.pergunta)}</h2>
      <p class="rv" style="--d:1">${C.contabilidade.smart}</p>
      <div class="actions rv" style="--d:2">${arrowBtn(link(slug, 'contabilidade'), 'Conhecer a contabilidade')}</div>
    </div>
    ${iso()}
  </div>
</section>
${ctaBand(slug)}`;
  const jsonld = `
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: C.nome, description: C.quemSomos.intro,
    url: C.dominio + '/', logo: C.dominio + '/assets/img/logo-positivo.png', image: C.dominio + '/assets/img/og.jpg',
    telephone: C.contato.telefoneSchema, email: C.contato.email, taxID: C.cnpj,
    address: { '@type': 'PostalAddress', streetAddress: 'R. Almirante Pestana, 6', addressLocality: 'Rio de Janeiro', addressRegion: 'RJ', addressCountry: 'BR' },
    openingHours: 'Mo-Fr 09:00-18:00', sameAs: C.contato.redes.map((r) => r.url), areaServed: 'BR',
  })}</script>`;
  return layout({ slug, jsonld, body,
    title: 'THD Engenharia | Consultoria de provedores de internet',
    desc: 'Consultoria para provedores de internet: outorga SCM, ASN, aluguel de IPv4, DICI, notificações Anatel, responsabilidade técnica e contabilidade especializada.' });
}

function quemSomos() {
  const slug = 'quem-somos';
  const Q = C.quemSomos;
  const missao = Q.missao.split(' ').map((w) => `<span class="mw${/praticidade|segurança/i.test(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const body = `
${pageHero(slug, 'Institucional', 'Quem *somos*', Q.intro)}
<section class="sec sheet t-light hist" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container split-2">
    <div class="hist-copy">
      <p class="kicker rv">Nossa história</p>
      <h2 class="split">${words('Soluções completas para quem leva internet *às* *pessoas*')}</h2>
      <p class="rv hist-lead">${Q.historia}</p>
      <p class="rv">Reunimos ${[['engenharia', 'o'], ['regulatório', 'l'], ['contabilidade', 'g'], ['marketing', 's']].map(([w, k], i, a) => `<span class="disc d-${k}" data-disc="${k}" tabindex="0">${w}</span>${i < a.length - 2 ? ', ' : i === a.length - 2 ? ' e ' : ''}`).join('')} em um só lugar, para que o provedor tenha um parceiro que entende o seu negócio de ponta a ponta.</p>
      <div class="actions rv">${waBtn('Faça seu orçamento', 'btn btn-o')}</div>
    </div>
    ${tilt('../assets/img/rede.webp', 'Profissional analisando a rede em um data center', 1600, 900, 'tilt-wide hist-media')}
  </div>
</section>

<section class="sec sheet t-deep mis" data-tone="dark">
  ${bgOrbits()}
  <div class="container">
    <p class="kicker rv">Nossa missão</p>
    <p class="manifesto" data-manifesto>${missao}</p>
  </div>
</section>

${pilares()}
${selos(slug, 'deep')}

<section class="sec sheet t-light" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container">
    <div class="head">
      <p class="kicker rv">Onde atuamos</p>
      <h2 class="split">${words('Quatro frentes, um só parceiro')}</h2>
    </div>
    <ul class="fronts" data-fronts>${C.grupos.map((g, i) => `
      <li class="rv" style="--d:${i}"><a href="${link(slug, 'servicos', '#' + g.id)}" data-cursor="Ver">${stack(i, 'stack-mini')}<strong>${g.titulo}</strong><span class="fr-sum">${g.resumo}</span><span class="go">${I.seta}</span></a></li>`).join('')}
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
  const body = `
${pageHero(slug, 'Catálogo de soluções', 'Serviços para *provedores* de internet', 'Da outorga na Anatel à contabilidade: escolha o que o seu provedor precisa ou fale com a gente para montar um pacote.', 'soft')}
<div class="gnav-wrap">
  <nav class="container gnav" aria-label="Frentes de serviço">${C.grupos.map((g) => `<a href="#${g.id}">${g.titulo}</a>`).join('')}<span class="bar" aria-hidden="true"></span></nav>
</div>
${C.grupos.map((g, gi) => `
<section class="sec sheet grp-sec t-${gi % 2 ? 'deep' : 'light'}" id="${g.id}" data-tone="${gi % 2 ? 'dark' : 'light'}">
  ${gi % 2 ? bgOrbits() : '<div class="bg-grid" aria-hidden="true"></div>'}
  <div class="container grp">
    <div class="grp-head">
      <p class="kicker rv">${g.titulo}</p>
      <h2 class="split">${words(g.resumo)}</h2>
      ${stack(gi, 'stack-grp rv')}
    </div>
    <div class="acc">${C.servicos.filter((s) => s.grupo === g.id).map((s, k) => `
      <div class="acc-item rv" id="${s.id}" style="--d:${k}">
        <h3 class="acc-h"><button type="button" aria-expanded="false" aria-controls="b-${s.id}"><span class="acc-tt"><span class="acc-t">${s.titulo}</span><small>${s.curto}</small></span><span class="tog">${I.mais}</span></button></h3>
        <div class="acc-body" id="b-${s.id}" role="region"><div><div class="inner">
          <p>${s.texto}</p>
          <div class="actions">
            ${waBtn('Pedir orçamento', 'btn btn-o btn-sm', `Olá, THD! Quero um orçamento de: ${s.titulo}.`)}
            ${s.link ? `<a class="link-arrow" href="${link(slug, s.link)}">${roll('Ver contabilidade')}${I.seta}</a>` : ''}
          </div>
        </div></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>`).join('')}
${ctaBand(slug, 'Não sabe por onde começar?', `Faça o <a href="${link(slug, '', '#diagnostico')}" style="color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:4px">diagnóstico rápido</a> ou fale com a nossa equipe. Indicamos o caminho certo para a situação do seu provedor.`)}`;
  return layout({ slug, body,
    title: 'Serviços | THD Engenharia',
    desc: 'Outorga SCM, SEAC e STFC, DICI e pós-outorga, notificações Anatel/CREA/CFT, ASN, aluguel de IPv4, responsabilidade técnica, segurança do trabalho, contabilidade, marketing e registro de marca.' });
}

function contabilidade() {
  const slug = 'contabilidade';
  const K = C.contabilidade;
  const opSt = ['Abertura e alterações', 'Todo mês', 'Arquivo organizado', 'Sob demanda', 'Periódico'];
  const row = (x, s, i) => `<li style="--k:${i}"><span class="lg-n">${x}</span><span class="lg-st">${s}</span></li>`;
  const body = `
${pageHero(slug, 'Serviço contábil especializado', 'Você sabe a *rentabilidade* do seu negócio?', K.smart, 'soft')}
<section class="sec sheet t-light" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container split-2">
    ${tilt('../assets/img/contabilidade.webp', 'THD Engenharia, contabilidade', 800, 800, 'tilt-square')}
    <div>
      <p class="kicker rv">Smart Accounting</p>
      <h2 class="split">${words('Contabilidade que mostra onde está o seu lucro')}</h2>
      <p class="rv">${K.time}</p>
      <p class="rv"><strong>Atendemos:</strong></p>
      <ul class="segments rv">${K.segmentos.map((s, i) => `<li style="--k:${i}">${s}</li>`).join('')}</ul>
      <div class="actions rv">${waBtn('Falar com a contabilidade', 'btn btn-o', 'Olá, THD! Quero saber mais sobre o serviço de contabilidade.')}</div>
    </div>
  </div>
</section>

<section class="lgx sheet t-deep" data-lgx data-tone="dark">
  <div class="lgx-sticky">
    ${bgOrbits()}
    <div class="container lgx-in">
      <div class="lgx-head">
        <p class="kicker rv">Gestão contábil</p>
        <h2 class="split">${words('Do operacional ao estratégico')}</h2>
        <p class="rv">${svc('gestao-contabil').texto}</p>
        <div class="lgx-tabs rv" role="tablist" aria-label="Frentes da gestão contábil">
          <button role="tab" id="sw-op" aria-controls="pn-op" aria-selected="true"><strong>Rotina operacional</strong><small>O dia a dia resolvido por nós</small></button>
          <button role="tab" id="sw-es" aria-controls="pn-es" aria-selected="false" tabindex="-1"><strong>Planejamento estratégico</strong><small>Os números trabalhando pelo lucro</small></button>
        </div>
      </div>
      <div class="sheet3d rv" data-tilt>
        <div class="sheet3d-in">
          <div class="face face-f" role="tabpanel" id="pn-op" aria-labelledby="sw-op">
            <h3>O dia a dia contábil, resolvido</h3>
            <p>Guias, notas, documentos e demonstrações em dia, sem você precisar correr atrás.</p>
            <ul class="lg-rows">${K.operacional.map((x, i) => row(x, opSt[i] || '', i)).join('')}</ul>
          </div>
          <div class="face face-b" role="tabpanel" id="pn-es" aria-labelledby="sw-es">
            <h3>Números a favor do negócio</h3>
            <p>${K.estrategico}</p>
            <svg class="lg-chart" viewBox="0 0 300 120" aria-hidden="true">
              <defs><linearGradient id="lg-ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FE5710" stop-opacity=".4"/><stop offset="1" stop-color="#FE5710" stop-opacity="0"/></linearGradient></defs>
              <g class="gl">${[24, 48, 72, 96].map((y) => `<path d="M0 ${y}H300"/>`).join('')}</g>
              <path class="ar" d="M10 100 L60 86 L110 92 L160 62 L210 50 L260 26 L292 14 V116 H10Z" fill="url(#lg-ar)"/>
              <path class="ln" pathLength="1" d="M10 100 L60 86 L110 92 L160 62 L210 50 L260 26 L292 14"/>
            </svg>
            <ul class="lg-rows">${[['Extratos contábeis mensais', 'Todo mês'], ['Oportunidades de redução de custos e impostos', 'Contínuo'], ['Mais lucratividade para o negócio', 'Resultado']].map(([x, s], i) => row(x, s, i)).join('')}</ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec sheet t-light ctb" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container split-2 ctb-in">
    <div>
      <p class="kicker rv">Extratos mensais</p>
      <h2 class="split">${words('Enxergue a evolução do seu provedor mês a mês')}</h2>
      <p class="rv" style="--d:1">Nossos contadores acompanham os números e apontam onde reduzir custos e impostos.</p>
    </div>
    ${iso()}
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
${pageHero(slug, 'Formulário e WhatsApp', 'Fale com a nossa *equipe*', 'Estamos à disposição para o seu contato. Escolha o canal que preferir.')}
<section class="sec sheet t-light ct" data-tone="light">
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="container contact">
    <form class="form rv" id="form-contato" novalidate data-whats="${c.whatsapp}">
      <p class="kicker">Resposta em horário comercial</p>
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
      <button class="btn btn-o" type="submit" data-magnetic>${I.whatsapp}${roll('Enviar mensagem')}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>

    <aside class="chan t-dark rv" style="--d:1">
      ${orb(slug, 'line', 'chan-orb')}
      <p class="chan-hd"><strong>Fale direto com a equipe</strong><span class="chan-now" data-now>Segunda a sexta, das 9h às 18h</span></p>
      <a class="ch ch-wa" href="${C.waOrcamento}" target="_blank" rel="noopener" data-cursor="Conversar"><span class="ci">${I.whatsapp}</span><span><strong>Estamos no WhatsApp</strong><small>${c.whatsappTexto}, clique para conversar</small></span></a>
      <a class="ch" href="mailto:${c.email}"><span class="ci">${I.email}</span><span><strong>E-mail</strong><small>${c.email}</small></span></a>
      <div class="ch"><span class="ci">${I.relogio}</span><span><strong>Horário de atendimento</strong>${c.horario.map(([d, h]) => `<small>${d}: ${h}</small>`).join('')}</span></div>
      <div class="ch"><span class="ci">${I.sinal}</span><span><strong>Redes sociais</strong>${c.redes.map((r) => `<small><a href="${r.url}" target="_blank" rel="noopener">${r.rotulo} ${r.handle}</a></small>`).join('')}</span></div>
      <div class="ch"><span class="ci">${I.pin}</span><span><strong>Endereço</strong><small>${c.endereco}</small></span></div>
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
const IMG = path.join(__dirname, '..', '_build', 'img');
for (const f of fs.readdirSync(IMG)) fs.copyFileSync(path.join(IMG, f), path.join(OUT, 'assets', 'img', f));

if (!PREVIEW) {
  const hoje = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).map((s) => `  <url><loc>${canonical(s)}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
  fs.copyFileSync(path.join(__dirname, '..', '_build', 'htaccess.txt'), path.join(OUT, '.htaccess'));
}
console.log(`THD Órbita: ${Object.keys(pages).length} páginas → ${path.relative(process.cwd(), OUT) || OUT}`);
