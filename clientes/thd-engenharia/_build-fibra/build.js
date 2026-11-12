// Gera o modelo "Fibra" do site THD Engenharia (nível premium, terceiro modelo).
//   node clientes/thd-engenharia/_build-fibra/build.js            → site-fibra/     (produção, URLs limpas)
//   node clientes/thd-engenharia/_build-fibra/build.js --preview  → _preview-fibra/ (abre sem servidor)
//
// O conteúdo é o mesmo dos outros modelos (lido de ../_build/content.js). Só o design muda.
// Linguagem visual: a luz que corre pela fibra óptica. Fios de luz em canvas atrás das seções, base clara e
// editorial com tipografia condensada gigante, menu em trilho vertical, prisma 3D que gira com a rolagem para
// os serviços, trilha de fibra que se desenha na jornada, rack 3D no diagnóstico, palavras que se acendem nos
// pilares, extrato que sai da impressora e comparador arrastável na gestão contábil.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('../_build/content');
const I = require('../_build/icons');
const { css } = require('./style');
const { js } = require('./script');

const PREVIEW = process.argv.includes('--preview');
const OUT = path.join(__dirname, '..', PREVIEW ? '_preview-fibra' : 'site-fibra');
const ver = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGES = [
  { slug: '', nav: 'Início', tip: 'Página inicial', ico: 'navInicio', img: 'hero.webp' },
  { slug: 'quem-somos', nav: 'Quem somos', tip: 'Conheça a THD', ico: 'navQuemSomos', img: 'rede.webp' },
  { slug: 'servicos', nav: 'Serviços', tip: 'Serviços para o seu provedor', ico: 'navServicos', img: 'internet.webp' },
  { slug: 'contabilidade', nav: 'Contabilidade', tip: 'Contabilidade para provedores', ico: 'navContabilidade', img: 'contabilidade.webp' },
  { slug: 'contato', nav: 'Contato', tip: 'Fale com a THD', ico: 'navContato', img: 'rack.webp' },
  { slug: 'area-do-cliente', nav: 'Área do Cliente', tip: 'Área do Cliente', ico: 'navCliente', img: 'rede.webp' },
];
const AREA = 'area-do-cliente';
// ícones só deste modelo, no mesmo traço reto dos outros (cantos vivos e nó de circuito).
// A Área do Cliente usa o ícone de pessoa que era do Quem somos; o Quem somos passa a ser o prédio do escritório.
const sv = (d, w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${d}</svg>`;
const nd = (x, y) => `<rect x="${x - 1.6}" y="${y - 1.6}" width="3.2" height="3.2" fill="currentColor" stroke="none"/>`;
const IC = {
  ...I,
  navCliente: I.navQuemSomos,
  navQuemSomos: sv(`<path d="M3.5 20.5h17"/><path d="M5.5 20.5V3.5h9v17"/><path d="M14.5 9h4v11.5"/><path d="M8.5 7.5h3M8.5 11h3"/><path d="M8.5 20.5v-4.5h3v4.5"/>${nd(16.5, 13.5)}`),
  // situação das faturas: paga, dentro do prazo e em atraso
  ftPago: sv('<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>', 2.4),
  ftPrazo: sv('<path d="M6 12h12"/>', 2.6),
  ftAtraso: sv(`<path d="M4 4h16v16H4z"/><path d="M12 7.5V12h4"/>${nd(12, 12)}`, 2),
  expandir: sv('<path d="M14 4h6v6M10 20H4v-6"/><path d="M20 4l-6.5 6.5M4 20l6.5-6.5"/>'),
  fechar: sv('<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>', 2),
  chevron: sv('<path d="M6 14.5 12 8.5l6 6"/>', 2.2),
};

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
const ofGroup = (id) => C.servicos.filter((s) => s.grupo === id);

// *palavra* fica em laranja
const em = (t) => t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
// título com revelação em bloco (o bloco laranja passa e deixa o texto)
const bl = (tag, text, attrs = '') => `<${tag} class="bl"${attrs}><span class="bl-t">${em(text)}</span></${tag}>`;
// título principal: palavras sobem de dentro de uma máscara
const rise = (text) => text.split(' ').map((w, i) => {
  const m = /^\*(.+)\*([.,!?]?)$/.exec(w);
  const inner = m ? `<em>${m[1]}</em>${m[2]}` : w;
  return `<span class="w"><span style="--i:${i}">${inner}</span></span>`;
}).join(' ');
// texto com rolagem de letras no hover
const roll = (t) => `<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
const kicker = (t, cls = '') => `<p class="kicker ${cls}" data-decode>${t}</p>`;
const fibers = (tone) => `<canvas class="fibers" data-fibers="${tone}" aria-hidden="true"></canvas>`;

// ---------- partes comuns ----------
const waBtn = (label = 'Falar no WhatsApp', cls = 'btn btn-w', msg) =>
  `<a class="${cls}" href="${msg ? C.wa(msg) : C.waOrcamento}" target="_blank" rel="noopener" data-magnetic>${I.whatsapp}${roll(label)}</a>`;
const arrowBtn = (href, label, cls = 'btn btn-o', extra = '') =>
  `<a class="${cls}" href="${href}"${extra} data-magnetic>${roll(label)}<span class="b-ar">${I.seta}</span></a>`;
const linkArrow = (href, label, extra = '') => `<a class="link-arrow" href="${href}"${extra}>${roll(label)}${I.seta}</a>`;
const bars = () => `<span class="bars" aria-hidden="true">${[0, 1, 2, 3, 4].map((k) => `<i style="--k:${k}"></i>`).join('')}</span>`;

function header(slug) {
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="shut" aria-hidden="true">${[0, 1, 2, 3, 4].map((k) => `<i style="--k:${k}"></i>`).join('')}</div>
<header class="rail">
  <a class="brand" href="${link(slug, '')}" aria-label="THD Engenharia, página inicial">
    <img src="${asset(slug, 'img/logo-simbolo.png')}" alt="THD Engenharia, consultoria de provedores de internet" width="360" height="217">
  </a>
  <nav class="rail-nav" aria-label="Principal">${PAGES.map((p) => `<a href="${link(slug, p.slug)}"${p.slug === AREA ? ' class="rn-acc"' : ''}${p.slug === slug ? ' aria-current="page"' : ''}>${IC[p.ico]}<span class="rn-tip">${p.tip}</span></a>`).join('')}</nav>
  <span class="rail-prog" aria-hidden="true"><i></i></span>
  ${slug === AREA ? '' : `<a class="rail-acc" href="${link(slug, AREA)}">${IC.navCliente}<span>Área do Cliente</span></a>`}
  <button class="menu-btn" data-menu aria-controls="mmenu" aria-expanded="false" aria-label="Abrir menu"><span class="mb-t">Menu</span><span class="mb-i"><i></i><i></i></span></button>
</header>
<div class="top-cta">
  ${slug === AREA ? '' : `<a class="btn btn-n btn-sm top-acc" href="${link(slug, AREA)}" data-magnetic>${IC.navCliente}${roll('Área do Cliente')}</a>`}
  <a class="btn btn-o btn-sm" href="${C.waOrcamento}" target="_blank" rel="noopener" data-magnetic>${roll('Solicitar orçamento')}<span class="b-ar">${I.seta}</span></a>
</div>
<div class="mmenu" id="mmenu">
  ${fibers('dark')}
  <div class="mm-in">
    <nav aria-label="Menu">${PAGES.map((p, i) => `<a href="${link(slug, p.slug)}" style="--i:${i}" data-prev="${i}"${p.slug === slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('')}</nav>
    <div class="mm-prev" aria-hidden="true">${PAGES.map((p, i) => `<img src="${asset(slug, 'img/' + p.img)}" alt="" data-p="${i}" loading="lazy"${p.slug === slug ? ' class="on"' : ''}>`).join('')}</div>
  </div>
  <div class="mm-foot">
    <a href="${C.waOrcamento}" target="_blank" rel="noopener">WhatsApp ${C.contato.whatsappTexto}</a>
    <a href="mailto:${C.contato.email}">${C.contato.email}</a>
    <span>${C.contato.endereco}</span>
  </div>
</div>`;
}

function footer(slug) {
  const c = C.contato;
  return `
<footer class="footer t-night">
  <div class="container where">
    <div class="where-copy rv">
      ${kicker('Onde estamos')}
      ${bl('h2', 'Nosso escritório fica no *Rio de Janeiro.*')}
      <p>Estamos no Cacuia, na Ilha do Governador. Atendemos de segunda a sexta, das 9h às 18h, pelo WhatsApp, por e-mail ou pessoalmente com horário marcado.</p>
      ${arrowBtn(C.waOrcamento, 'Marcar um horário', 'btn btn-o', ' target="_blank" rel="noopener"')}
    </div>
    <div class="map-frame mapc" data-reveal>
      <img class="map-img" src="${asset(slug, 'img/mapa-thd.webp')}" alt="Mapa do Cacuia, Ilha do Governador, com a localização da THD Engenharia na R. Almirante Pestana" width="1240" height="760" loading="lazy" decoding="async">
      <span class="map-pin" aria-hidden="true"><b>THD Engenharia</b></span>
      <span class="map-attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      <div class="map-info"><b>THD Engenharia</b><span>${c.endereco}</span><span>${c.horario[0][0]}, ${c.horario[0][1]}</span>
        <div class="mbtns"><a href="${c.mapsLink}" target="_blank" rel="noopener">${I.pin}Abrir no Maps</a><a class="sq" href="${c.rotaLink}" target="_blank" rel="noopener" aria-label="Traçar rota até a THD">${I.seta}</a></div>
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
  <p class="foot-word" aria-hidden="true" data-spot>THD Engenharia</p>
  <div class="container foot-bottom">
    <span>© <span id="year">${new Date().getFullYear()}</span> ${C.nome}. CNPJ ${C.cnpj}</span>
  </div>
</footer>
<a class="wa-float" href="${C.waOrcamento}" target="_blank" rel="noopener" aria-label="Falar com a THD no WhatsApp" data-cursor="Conversar">${I.whatsapp}<span>Fale com a THD</span></a>
<div class="cursor" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((k) => `<i class="c-tr" style="--n:${k}"></i>`).join('')}<i class="c-dot"></i><span class="c-tag"></span></div>`;
}

const headScript = `<script>(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('thd-f-nav')){d.classList.add('enter');sessionStorage.removeItem('thd-f-nav');}if(sessionStorage.getItem('thd-f-ac'))d.classList.add('ac-in');}catch(e){}})();</script>`;

function layout({ slug, title, desc, body, jsonld = '', noindex = false }) {
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
<link rel="canonical" href="${canonical(slug)}">${noindex ? '\n<meta name="robots" content="noindex">' : ''}
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
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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

// ---------- componentes ----------
const pageHero = (slug, kick, title, lead, img, alt) => `
<section class="phero t-paper">
  ${fibers('light')}
  <div class="container phero-in">
    <nav class="crumbs up" style="--d:.1s" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">${PAGES.find((p) => p.slug === slug).nav}</span></nav>
    ${kicker(kick, 'up')}
    <h1 class="hl">${rise(title)}</h1>
    <div class="phero-row${img ? '' : ' no-media'}">
      ${lead ? `<p class="lead up" style="--d:.7s">${lead}</p>` : ''}
      ${img ? `<figure class="media phero-media">${img.card
        ? `<div class="logo-card"><img src="${asset(slug, 'img/logo.png')}" alt="${alt}" width="440" height="308"><span>${img.card}</span></div>`
        : `<img src="${asset(slug, 'img/' + img.src)}" alt="${alt}" width="${img.w}" height="${img.h}" fetchpriority="high" data-par=".08">`}${bars()}</figure>` : ''}
    </div>
  </div>
</section>`;

const ctaBand = (slug, titulo = 'Vamos tirar o seu provedor do papel ou deixá-lo em dia?', texto = 'Conte o que você precisa. Respondemos pelo WhatsApp em horário comercial.') => {
  const c = C.contato;
  return `
<section class="cta t-orange">
  ${fibers('orange')}
  <div class="container cta-in">
    <div class="cta-l">
      ${kicker('Fale com a nossa equipe')}
      ${bl('h2', titulo)}
      <p class="cta-lead rv">${texto}</p>
    </div>
    <div class="cta-r rv" style="--d:1">
      ${waBtn('Chamar no WhatsApp', 'btn btn-w btn-lg')}
      ${arrowBtn(link(slug, 'contato'), 'Enviar mensagem', 'btn btn-n btn-lg')}
      <dl class="cta-info">
        <div><dt>WhatsApp</dt><dd><a href="${C.waOrcamento}" target="_blank" rel="noopener">${c.whatsappTexto}</a></dd></div>
        <div><dt>E-mail</dt><dd><a href="mailto:${c.email}">${c.email}</a></dd></div>
        <div><dt>Atendimento</dt><dd>Seg. a sex., ${c.horario[0][1]}</dd></div>
      </dl>
    </div>
  </div>
</section>`;
};

// órgãos reguladores em linhas; no computador o logo segue o cursor
const orgs = (slug, tone = 'light') => `
<section class="orgs ${tone === 'light' ? 't-white' : 't-deep'}" id="orgaos" aria-labelledby="org-t">
  ${tone === 'light' ? '' : fibers('dark')}
  <div class="container">
    <div class="orgs-head">
      ${kicker('Órgãos reguladores')}
      ${bl('h2', 'Seu provedor em dia com quem regula o setor', ' id="org-t"')}
    </div>
    <ul class="org-list" data-orgs>${C.selos.map((s, i) => `
      <li class="org rv" style="--d:${i % 3}" data-org="${i}">
        <span class="org-n">${s.nome}</span>
        <span class="org-p">${s.papel}</span>
        <span class="org-logo"><img src="${asset(slug, 'img/' + s.img)}" alt="" style="--h:${s.h}px" loading="lazy"></span>
      </li>`).join('')}
    </ul>
    <p class="orgs-note">As marcas pertencem aos respectivos órgãos e aparecem aqui só para indicar com quem a THD trata os processos do seu provedor.</p>
  </div>
  <div class="org-float" aria-hidden="true">${C.selos.map((s, i) => `<img src="${asset(slug, 'img/' + s.img)}" alt="" data-f="${i}" loading="lazy">`).join('')}</div>
</section>`;

// pilares: palavras gigantes que se acendem com a rolagem
const pilares = () => {
  const P = C.quemSomos.pilares;
  return `
<section class="plr t-white" style="--n:${P.length}" data-plr>
  <div class="plr-sticky">
    <div class="container plr-in">
      <div class="plr-l">
        ${kicker('Como trabalhamos')}
        ${bl('h2', 'O que você pode esperar da THD')}
        <div class="plr-desc">${P.map((p, i) => `<div class="plr-d${i ? '' : ' on'}"><h3>${p.t}</h3><p>${p.d}</p></div>`).join('')}</div>
      </div>
      <div class="plr-words" aria-hidden="true"><ul class="plr-track">${P.map((p, i) => `<li><button type="button" class="pw" data-t="${p.t}" data-go="${i}" tabindex="-1">${p.t}</button></li>`).join('')}</ul></div>
    </div>
  </div>
</section>`;
};

// feixe de fibras que converge em cada face do prisma (decorativo, com pulsos de luz)
const pfArt = (i) => {
  const ys = [16, 40, 64, 88, 112, 136];
  const end = (k) => 70 + (k - 2.5) * 5 + (i % 2 ? 12 : -8);
  const d = (k) => `M0 ${ys[k]} C 150 ${ys[k]}, 230 ${end(k)}, 400 ${end(k)}`;
  return `<svg class="pf-art" viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true">${ys.map((_, k) => `<path d="${d(k)}"/>`).join('')}${ys.map((_, k) => `<path class="p" pathLength="100" style="--k:${(k * 3 + i) % 6}" d="${d(k)}"/>`).join('')}</svg>`;
};

// impressora de extrato contábil (decorativa)
const printer = (slug) => `
<figure class="prn" data-print data-tilt aria-hidden="true">
  <div class="prn-in">
    <div class="prn-head"><img src="${asset(slug, 'img/logo-simbolo.png')}" alt="" width="360" height="217" loading="lazy"><span><b>Extrato contábil</b><small>Smart Accounting</small></span></div>
    <i class="prn-slot"></i>
    <div class="prn-clip"><div class="prn-paper">
      <p class="pp-t">Resumo do mês</p>
      ${[['Receita', 88], ['Custos', 54], ['Impostos', 30], ['Lucro', 66, 1]].map(([t, v, h], k) => `<div class="pp-row${h ? ' hot' : ''}" style="--v:${v};--k:${k}"><span>${t}</span><i><b></b></i></div>`).join('')}
      <svg class="pp-chart" viewBox="0 0 260 64"><path class="pp-g" d="M0 16H260M0 32H260M0 48H260"/><path class="pp-l" pathLength="1" d="M4 56 L40 50 L76 52 L112 38 L148 34 L184 22 L220 18 L256 6"/></svg>
      <p class="pp-f">Oportunidades de redução de custos e impostos verificadas pela nossa equipe.</p>
    </div></div>
  </div>
</figure>`;

// ---------- páginas ----------
function home() {
  const slug = '';
  const D = C.diagnostico;
  const G = C.grupos;
  const body = `
<section class="hero t-paper">
  ${fibers('light')}
  <div class="container hero-in">
    ${kicker(C.slogan, 'up')}
    <h1 class="hl">${rise('Seu provedor *regular,* em dia e pronto para crescer.')}</h1>
    <div class="hero-row">
      <div class="hero-copy">
        <p class="lead up" style="--d:.8s">Outorga SCM, ASN, IPv4, declarações à Anatel e contabilidade especializada. A THD cuida da parte técnica e burocrática para você focar no que importa: seus clientes.</p>
        <div class="actions up" style="--d:.95s">
          ${waBtn('Solicitar orçamento', 'btn btn-o')}
          ${arrowBtn('#diagnostico', 'Fazer o diagnóstico', 'btn btn-line')}
        </div>
      </div>
      <figure class="media hero-media">
        <img src="${asset(slug, 'img/hero.webp')}" alt="Miniaturas de técnicos conectando cabos de rede em um roteador" width="1920" height="1056" fetchpriority="high" data-par=".08">
        ${bars()}
        <figcaption class="media-tag up" style="--d:1.3s">Anatel, CREA, CFT e Registro.br em um só parceiro</figcaption>
      </figure>
    </div>
    <ul class="facts up" style="--d:1.1s">
      <li><strong>Dezenas de empresas</strong>atendidas e crescendo</li>
      <li><strong>Do registro à rede</strong>outorga, ASN, IPv4 e responsabilidade técnica</li>
      <li><strong>Seg. a sex., 9h às 18h</strong>atendimento pelo WhatsApp</li>
    </ul>
  </div>
</section>

${orgs(slug)}

<section class="prs t-navy" id="servicos" style="--n:${G.length}" data-prs>
  <div class="prs-sticky">
    ${fibers('dark')}
    <div class="container prs-in">
      <div class="prs-l">
        ${kicker('Nossos serviços')}
        ${bl('h2', 'Tudo o que o seu provedor precisa, organizado por frente')}
        <div class="prs-idx" role="tablist" aria-label="Frentes de serviço">${G.map((g, i) => `<button type="button" role="tab" id="pt-${g.id}" aria-controls="pf-${g.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span>${g.titulo}</span><i aria-hidden="true"></i></button>`).join('')}</div>
        ${linkArrow(link(slug, 'servicos'), 'Ver todos os serviços')}
      </div>
      <div class="prism-wrap">
        <div class="prism" data-prism>${G.map((g, i) => `
          <article class="pf pf-${i}" style="--i:${i}" role="tabpanel" id="pf-${g.id}" aria-labelledby="pt-${g.id}">
            <h3>${g.titulo}</h3>
            <p class="pf-sum">${g.resumo}</p>
            ${pfArt(i)}
            <ul class="pf-list">${ofGroup(g.id).map((s) => `<li><a href="${link(slug, 'servicos', '#' + s.id)}" data-cursor="Ver"><strong>${s.titulo}</strong><small>${s.curto}</small>${I.seta}</a></li>`).join('')}</ul>
          </article>`).join('')}
        </div>
        <i class="prism-floor" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</section>

<section class="jrn t-paper" data-jrn>
  <div class="container">
    <div class="jrn-head">
      ${kicker('A jornada do provedor')}
      ${bl('h2', 'Montamos a estrutura do seu provedor, peça por peça')}
      <p class="rv">Siga a luz pela fibra: cada etapa acende quando o seu provedor chega nela.</p>
    </div>
    <div class="jrn-body" data-jrn-body>
      <svg class="jrn-svg" aria-hidden="true"><path class="jb"/><path class="jl"/><g class="jp"><circle class="jp-h" r="18"/><circle r="7"/></g></svg>
      <ol class="jrn-list">${C.jornada.map((j, i) => `
        <li class="jrn-st ${i % 2 ? 'r' : 'l'}">
          <span class="jrn-node" aria-hidden="true"></span>
          <div class="jrn-card rv">
            <h3>${j.t}</h3>
            <p>${j.d}</p>
            <ul class="tags">${j.ids.map((id) => `<li><a href="${link(slug, 'servicos', '#' + id)}">${shortTitle(svc(id).titulo)}</a></li>`).join('')}</ul>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="dg t-deep" id="diagnostico">
  <div class="container dg-in" data-diag>
    <div class="dg-l">
      ${kicker('Diagnóstico rápido')}
      ${bl('h2', 'Como está o seu provedor hoje?')}
      <p class="rv">Responda e veja quais módulos já estão instalados no rack do seu provedor. No fim, mande o resultado direto para a nossa equipe.</p>
      <ul class="dq-list">${D.map((d, i) => `
        <li class="dq rv" style="--d:${i % 3}">
          <p class="dq-q" id="dq-${i}">${d.q}</p>
          <div class="tri" role="group" aria-labelledby="dq-${i}" data-i="${i}"><i class="tri-th" aria-hidden="true"></i><button type="button" data-v="sim" aria-pressed="false">Sim</button><button type="button" data-v="nao" aria-pressed="false">Não</button><button type="button" data-v="ns" aria-pressed="false">Não sei</button></div>
        </li>`).join('')}
      </ul>
      <button type="button" class="link-arrow dg-reset" data-diag-reset>${roll('Responder de novo')}${I.seta}</button>
    </div>
    <aside class="dg-r" aria-live="polite">
      <div class="rack" data-tilt>
        <div class="rack-in">
          <div class="rack-face">
            <p class="rack-cap"><span>Rack do seu provedor</span><b data-diag-score>0</b><small>de ${D.length} módulos</small></p>
            ${D.map((d, i) => `<div class="slot" data-q="${i}"><div class="mod"><span class="mod-l">${d.pend}</span><span class="mod-st"></span><i class="mod-v"></i></div></div>`).join('')}
          </div>
          <i class="rack-side rs-l"></i><i class="rack-side rs-r"></i><i class="rack-top"></i>
        </div>
      </div>
      <p class="dg-msg" data-diag-msg>Cada resposta encaixa um módulo. Os que faltam saltam para fora em laranja.</p>
      <ul class="dg-pend" data-diag-pend></ul>
      <a class="btn btn-o" href="${C.waOrcamento}" target="_blank" rel="noopener" data-diag-go data-magnetic>${I.whatsapp}<span class="lbl">Enviar diagnóstico</span></a>
    </aside>
  </div>
</section>

${pilares()}

<section class="qs t-navy">
  <div class="container qs-in">
    <figure class="iris" data-iris><img src="${asset(slug, 'img/rack.webp')}" alt="Rack de rede com cabos organizados em um provedor de internet" width="683" height="1024" loading="lazy"></figure>
    <div class="qs-copy">
      ${kicker('Quem somos')}
      ${bl('h2', 'Consultoria feita para quem leva internet às pessoas')}
      <p class="rv">${C.quemSomos.intro}</p>
      <p class="rv">${C.quemSomos.historia}</p>
      <blockquote class="rv"><strong>Nossa missão</strong>${C.quemSomos.missao}</blockquote>
      ${linkArrow(link(slug, 'quem-somos'), 'Conheça a THD')}
    </div>
  </div>
</section>

<section class="sec t-paper ctb">
  <div class="container split-2">
    <div>
      ${kicker('Contabilidade para provedores')}
      ${bl('h2', C.contabilidade.pergunta)}
      <p class="rv">${C.contabilidade.smart}</p>
      <div class="actions rv">${arrowBtn(link(slug, 'contabilidade'), 'Conhecer a contabilidade')}</div>
    </div>
    ${printer(slug)}
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

// ---------- equipe (Quem somos): retrato com fios de luz e formação em cabos ----------
const ini = (n) => n.split(' ').filter((w) => w.length > 2).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const teamMsg = (p) => `Olá! Vim pelo site da THD e quero falar com ${p.nome.split(' ')[0]}, da área de ${(p.setor || p.cargo).toLowerCase()}.`;
const FIOS = [
  ['M-10 40 C 60 40, 90 120, 210 110', 'M-10 150 C 80 150, 120 70, 210 60', 'M-10 210 C 70 200, 140 230, 210 180'],
  ['M-10 70 C 90 60, 100 170, 210 160', 'M-10 120 C 50 130, 150 30, 210 40', 'M-10 230 C 90 220, 120 180, 210 215'],
  ['M-10 30 C 70 90, 130 60, 210 130', 'M-10 180 C 60 140, 140 160, 210 90', 'M-10 120 C 90 200, 150 220, 210 240'],
  ['M-10 100 C 60 30, 140 40, 210 70', 'M-10 200 C 70 180, 110 110, 210 150', 'M-10 60 C 100 140, 130 230, 210 230'],
];
function equipe() {
  const E = C.equipe;
  return `
<section class="sec t-paper team" id="equipe">
  <div class="container">
    <div class="head team-head">
      <div>
        ${kicker('Nossa equipe')}
        ${bl('h2', E.titulo.replace(/seu provedor$/, '*seu provedor*'))}
      </div>
      <p class="team-lead rv">${E.texto}</p>
    </div>
    <ul class="team-grid">${E.pessoas.map((p, i) => `
      <li class="fx a-${p.area} rv" style="--d:${i}">
        <figure class="fx-pic">
          <svg class="fx-fios" viewBox="0 0 200 250" preserveAspectRatio="none" aria-hidden="true">${FIOS[i % FIOS.length].map((d, k) => `<path class="fb" d="${d}"/><path class="fp" style="--k:${k}" pathLength="100" d="${d}"/>`).join('')}</svg>
          ${p.foto ? `<img src="../assets/img/${p.foto}" alt="${esc(p.nome)}, ${esc(p.cargo)} da THD" width="720" height="720" loading="lazy">` : `<b class="fx-ini" aria-hidden="true">${ini(p.nome)}</b>`}
          <figcaption>${p.cargo}</figcaption>
        </figure>
        <div class="fx-body">
          <h3>${p.nome}</h3>
          <ul class="fx-edu">${p.formacao.map(([t, c, now]) => `
            <li${now ? ' class="now"' : ''}><small>${t}</small><span>${c}</span></li>`).join('')}
          </ul>
          ${waBtn('Falar no WhatsApp', 'btn btn-w fx-btn', teamMsg(p))}
        </div>
      </li>`).join('')}
    </ul>
  </div>
</section>`;
}

function quemSomos() {
  const slug = 'quem-somos';
  const Q = C.quemSomos;
  // missão digitada letra por letra conforme a rolagem
  const tw = Q.missao.split(' ').map((w) => `<span class="tw-w${/praticidade|segurança/i.test(w) ? ' hl' : ''}">${[...w].map((ch) => `<span class="c">${ch}</span>`).join('')}</span>`).join(' ');
  const DISC = [['engenharia', 'o', 'Engenharia'], ['regulatório', 'l', 'Regulatório'], ['contabilidade', 'g', 'Contabilidade'], ['marketing', 's', 'Marketing']];
  const cables = `<svg class="cables" viewBox="0 0 470 340" data-cables aria-hidden="true">
    ${DISC.map(([, k, label], i) => { const y = 44 + i * 82; return `<g class="cab c-${k}" data-k="${k}"><text x="0" y="${y - 14}">${label}</text><path class="cab-b" d="M0 ${y} C 190 ${y}, 200 170, 352 170"/><path class="cab-p" pathLength="100" d="M0 ${y} C 190 ${y}, 200 170, 352 170"/><rect x="-2" y="${y - 5}" width="10" height="10" rx="2"/></g>`; }).join('')}
    <g class="hub"><rect x="352" y="128" width="112" height="84" rx="10"/><text x="408" y="182">THD</text></g>
  </svg>`;
  const body = `
${pageHero(slug, 'Institucional', 'Quem *somos*', Q.intro, { src: 'rede.webp', w: 1600, h: 900 }, 'Profissional analisando a rede em um data center')}
<section class="sec t-white hist">
  <div class="container split-2">
    <div class="hist-copy">
      ${kicker('Nossa história')}
      ${bl('h2', 'Soluções completas para quem leva internet *às pessoas*')}
      <p class="rv hist-lead">${Q.historia}</p>
      <p class="rv">Reunimos ${DISC.map(([w, k], i, a) => `<span class="disc d-${k}" data-disc="${k}" tabindex="0">${w}</span>${i < a.length - 2 ? ', ' : i === a.length - 2 ? ' e ' : ''}`).join('')} em um só lugar, para que o provedor tenha um parceiro que entende o seu negócio de ponta a ponta.</p>
      <div class="actions rv">${waBtn('Faça seu orçamento', 'btn btn-o')}</div>
    </div>
    <div class="cables-wrap rv">${cables}</div>
  </div>
</section>
${equipe()}
<section class="sec t-navy mis">
  ${fibers('dark')}
  <div class="container">
    ${kicker('Nossa missão')}
    <p class="tw" data-tw aria-label="${esc(Q.missao)}"><span aria-hidden="true">${tw}</span></p>
  </div>
</section>

${pilares()}
${orgs(slug, 'deep')}

<section class="sec t-paper">
  <div class="container">
    <div class="head">
      ${kicker('Onde atuamos')}
      ${bl('h2', 'Quatro frentes, um só parceiro')}
    </div>
    <ul class="fronts" data-fronts>${C.grupos.map((g, i) => `
      <li class="rv" style="--d:${i}"><a href="${link(slug, 'servicos', '#' + g.id)}" data-cursor="Ver">
        <strong>${g.titulo}</strong>
        <span class="fr-sum">${g.resumo}</span>
        ${i === 0 ? pfArt(1) : ''}
        <span class="fr-list">${ofGroup(g.id).map((s) => `<span>${shortTitle(s.titulo)}</span>`).join('')}</span>
        <span class="go">${I.seta}</span>
      </a></li>`).join('')}
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
${pageHero(slug, 'Catálogo de soluções', 'Serviços para *provedores* de internet', 'Da outorga na Anatel à contabilidade: escolha o que o seu provedor precisa ou fale com a gente para montar um pacote.', { src: 'internet.webp', w: 1000, h: 483 }, 'Mapa do mundo com conexões de internet iluminadas')}
<section class="cat t-paper">
  <div class="container cat-in">
    <nav class="cat-nav" aria-label="Frentes de serviço" data-catnav>
      <p class="cat-nav-t">Frentes de serviço</p>
      <div class="cat-links">${C.grupos.map((g) => `<a href="#${g.id}"><span>${g.titulo}</span><i><b></b></i></a>`).join('')}</div>
      ${waBtn('Pedir orçamento', 'btn btn-w btn-sm')}
    </nav>
    <div class="cat-groups">${C.grupos.map((g) => `
      <section class="grp" id="${g.id}" aria-labelledby="gh-${g.id}">
        <div class="grp-head">
          ${kicker(g.titulo)}
          ${bl('h2', g.resumo, ` id="gh-${g.id}"`)}
        </div>
        <div class="acc">${ofGroup(g.id).map((s, k) => `
          <div class="acc-item rv" id="${s.id}" style="--d:${k}">
            <h3 class="acc-h"><button type="button" aria-expanded="false" aria-controls="b-${s.id}"><span class="acc-tt"><span class="acc-t">${s.titulo}</span><small>${s.curto}</small></span><span class="tog">${I.mais}</span></button></h3>
            <div class="acc-body" id="b-${s.id}" role="region"><div><div class="inner">
              <p>${s.texto}</p>
              <div class="actions">
                ${waBtn('Pedir orçamento', 'btn btn-o btn-sm', `Olá, THD! Quero um orçamento de: ${s.titulo}.`)}
                ${s.link ? linkArrow(link(slug, s.link), 'Ver contabilidade') : ''}
              </div>
            </div></div></div>
          </div>`).join('')}
        </div>
      </section>`).join('')}
    </div>
  </div>
</section>
${ctaBand(slug, 'Não sabe por onde começar?', `Faça o <a href="${link(slug, '', '#diagnostico')}" class="u">diagnóstico rápido</a> ou fale com a nossa equipe. Indicamos o caminho certo para a situação do seu provedor.`)}`;
  return layout({ slug, body,
    title: 'Serviços | THD Engenharia',
    desc: 'Outorga SCM, SEAC e STFC, DICI e pós-outorga, notificações Anatel/CREA/CFT, ASN, aluguel de IPv4, responsabilidade técnica, segurança do trabalho, contabilidade, marketing e registro de marca.' });
}

function contabilidade() {
  const slug = 'contabilidade';
  const K = C.contabilidade;
  const opSt = ['Abertura e alterações', 'Todo mês', 'Arquivo organizado', 'Sob demanda', 'Periódico'];
  const row = (x, s, i) => `<li style="--k:${i}"><span>${x}</span><small>${s}</small></li>`;
  const body = `
${pageHero(slug, 'Serviço contábil especializado', 'Você sabe a *rentabilidade* do seu negócio?', K.smart, { card: 'Contabilidade' }, 'THD Engenharia')}
<section class="sec t-white smart">
  <div class="container split-2">
    <div>
      ${kicker('Smart Accounting')}
      ${bl('h2', 'Contabilidade que mostra onde está o seu lucro')}
      <p class="rv">${K.time}</p>
      <div class="actions rv">${waBtn('Falar com a contabilidade', 'btn btn-o', 'Olá, THD! Quero saber mais sobre o serviço de contabilidade.')}</div>
    </div>
    ${printer(slug)}
  </div>
</section>

<section class="sec t-navy cmp-sec">
  ${fibers('dark')}
  <div class="container">
    <div class="cmp-head">
      <div>
        ${kicker('Gestão contábil')}
        ${bl('h2', 'Do operacional ao estratégico')}
      </div>
      <p class="rv">${svc('gestao-contabil').texto}</p>
    </div>
    <div class="cmp-tabs rv" role="group" aria-label="Escolha o que ver">
      <button type="button" data-cmp-go="100" aria-pressed="false"><strong>Rotina operacional</strong><small>O dia a dia resolvido por nós</small></button>
      <button type="button" data-cmp-go="0" aria-pressed="false"><strong>Planejamento estratégico</strong><small>Os números trabalhando pelo lucro</small></button>
    </div>
    <div class="cmp rv" data-cmp>
      <div class="cmp-a"><div class="cmp-c">
        <p class="cmp-tag">Rotina operacional</p>
        <h3>O dia a dia contábil, resolvido</h3>
        <p>Guias, notas, documentos e demonstrações em dia, sem você precisar correr atrás.</p>
        <ul class="lg-rows">${K.operacional.map((x, i) => row(x, opSt[i] || '', i)).join('')}</ul>
      </div></div>
      <div class="cmp-b"><div class="cmp-c">
        <p class="cmp-tag">Planejamento estratégico</p>
        <h3>Números a favor do negócio</h3>
        <p>${K.estrategico}</p>
        <svg class="lg-chart" viewBox="0 0 300 110" aria-hidden="true">
          <g class="gl">${[22, 44, 66, 88].map((y) => `<path d="M0 ${y}H300"/>`).join('')}</g>
          <path class="ar" d="M10 96 L60 82 L110 88 L160 58 L210 46 L260 24 L292 12 V108 H10Z"/>
          <path class="ln" d="M10 96 L60 82 L110 88 L160 58 L210 46 L260 24 L292 12"/>
        </svg>
        <ul class="lg-rows">${[['Extratos contábeis mensais', 'Todo mês'], ['Oportunidades de redução de custos e impostos', 'Contínuo'], ['Mais lucratividade para o negócio', 'Resultado']].map(([x, s], i) => row(x, s, i)).join('')}</ul>
      </div></div>
      <button type="button" class="cmp-h" role="slider" aria-label="Arraste para comparar a rotina operacional com o planejamento estratégico" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Os dois lados" data-cursor="Arraste"><i></i><span>${I.seta}${I.seta}</span></button>
    </div>
  </div>
</section>

<section class="sec t-paper segs-sec">
  <div class="container split-2 segs-in">
    <div>
      ${kicker('Atendemos')}
      ${bl('h2', 'Provedores de internet e empresas de outros segmentos')}
      <p class="rv">Nossos contadores fornecem extratos contábeis mensais e verificam as melhores oportunidades de redução de custos e impostos.</p>
    </div>
    <ul class="segs">${K.segmentos.map((s, i) => `<li class="rv" style="--d:${i}">${s}</li>`).join('')}</ul>
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
${pageHero(slug, 'Formulário e WhatsApp', 'Fale com a nossa *equipe*', 'Estamos à disposição para o seu contato. Escolha o canal que preferir.', null)}
<section class="sec t-paper ct">
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

    <aside class="chan t-navy rv" style="--d:1">
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

// ---------- área do cliente (demonstrativa) ----------
// Dados de exemplo do assinante. Troque aqui quando o provedor ligar a área ao sistema dele.
const ASSINANTE = {
  nome: 'Mariana Costa',
  codigo: '004817',
  endereco: 'Rua das Acácias, 120, Jardim Guanabara, Rio de Janeiro, RJ',
  desde: '15/09/2026',
  plano: { nome: 'Fibra 500', down: 500, up: 250, valor: '99,90', tecnologia: 'Fibra óptica até a sua casa', wifi: 'Wi-Fi 6 dual band' },
  beneficios: [
    ['Roteador Wi-Fi 6 em comodato', 'Equipamento incluso, com troca sem custo em caso de defeito'],
    ['Instalação sem custo', 'Feita por técnico da equipe, com teste no local'],
    ['Internet ilimitada', 'Sem franquia de dados e sem redução de velocidade'],
    ['IPv6 ativo', 'Endereço moderno para jogos, câmeras e casa conectada'],
    ['Suporte pelo WhatsApp', 'Atendimento humano em horário comercial'],
    ['Visita técnica inclusa', 'Sem cobrança quando o problema é na rede'],
  ],
  fidelidade: { meses: 12, cumpridos: 7, fim: '15/09/2027' },
  vencimento: 'Todo dia 10',
  proxima: '10/05/2027',
  pagamento: 'Boleto ou Pix',
  condicoes: [
    'Depois do vencimento, a fatura tem multa de 2% e juros de 1% ao mês.',
    'Cancelamento antes do fim da fidelidade gera multa proporcional aos meses restantes.',
    'Mudança de endereço depende de viabilidade técnica na nova região.',
    'Valor reajustado uma vez por ano pelo IPCA, com aviso prévio na fatura.',
  ],
};
const SPEEDTEST = 'https://www.speedtest.net/pt';
const AG_SERV = ['Visita técnica', 'Mudança de endereço', 'Ponto extra de Wi-Fi', 'Troca de equipamento'];
const AG_PER = ['Manhã', 'Tarde'];
// faturas de 2027 do assinante de exemplo (a demonstração se passa no começo de maio de 2027):
// janeiro a março pagas, abril em atraso, maio dentro do prazo e junho a dezembro a vencer (podem ser antecipadas)
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const pad = (n) => String(n).padStart(2, '0');
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const FATURAS = MESES.map((m, i) => {
  const st = i < 3 ? 'pago' : i === 3 ? 'atraso' : i === 4 ? 'aberto' : 'futuro';
  const valor = 99.9;
  const seq = String(48170 + i * 7).padStart(6, '0');
  return {
    ref: `${m.slice(0, 3)}/2027`, mes: `${m} de 2027`, venc: `10/${pad(i + 1)}/2027`, st, valor,
    total: st === 'atraso' ? Math.round(valor * 1.03 * 100) / 100 : valor,
    pagoEm: st === 'pago' ? `${pad(7 + i)}/${pad(i + 1)}/2027` : '',
    linha: `34191.09008 ${seq}.1${pad(i + 1)}04 81700.004817 ${(i % 9) + 1} ${String(9990 + i * 31).padStart(14, '0')}`,
    pix: `00020126580014BR.GOV.BCB.PIX0136demo-thd-004817-2027${pad(i + 1)}5204000053039865406${valor.toFixed(2)}5802BR5914THD ENGENHARIA6014RIO DE JANEIRO62070503***6304${(41000 + i * 97).toString(16).toUpperCase()}`,
  };
});
const FT_ST = {
  pago: { label: 'Paga', ic: 'ftPago', acao: '2ª via' },
  aberto: { label: 'Dentro do prazo', ic: 'ftPrazo', acao: 'Gerar' },
  futuro: { label: 'A vencer, dentro do prazo', ic: 'ftPrazo', acao: 'Antecipar' },
  atraso: { label: 'Em atraso', ic: 'ftAtraso', acao: 'Pagar' },
};
const ftNota = (f) => f.st === 'pago' ? `Paga em ${f.pagoEm}` : f.st === 'atraso' ? `Venceu em ${f.venc}` : `Vence em ${f.venc}`;
const fillTpl = (t, vals) => t.replace(/\{(\w+)\}/g, (_, k) => vals[k] || '');

function areaCliente() {
  const slug = AREA;
  const A = ASSINANTE;
  const P = A.plano;
  const quem = `Sou ${A.nome}, assinante código ${A.codigo}, plano ${P.nome} (${P.down} Mega).`;
  const tplAg = `Olá! Vim pela Área do Cliente. ${quem} Quero agendar: {servico}. Melhor período: {periodo}. Endereço: ${A.endereco}.`;
  const msgSuporte = `Olá! Vim pela Área do Cliente. ${quem} Preciso de atendimento.`;
  const msgFatura = `Olá! Vim pela Área do Cliente. ${quem} Tenho uma dúvida sobre a minha fatura.`;
  const ftIc = (f) => `<span class="ft-ic ft-${f.st}" title="${FT_ST[f.st].label}">${IC[FT_ST[f.st].ic]}<span class="sr">${FT_ST[f.st].label}</span></span>`;
  const ftBtn = (f, i) => `<button type="button" class="ft-a${f.st === 'atraso' ? ' hot' : ''}" data-ft-gen="${i}"${f.st === 'futuro' ? ' data-ft-mode="antecipar"' : ''} aria-label="${FT_ST[f.st].acao}: fatura de ${f.mes}">${FT_ST[f.st].acao}</button>`;
  const conta = (st) => FATURAS.filter((f) => st.includes(f.st)).length;
  const iAberto = FATURAS.findIndex((f) => f.st === 'aberto');
  const iFuturo = FATURAS.findIndex((f) => f.st === 'futuro');
  const ftResumo = `<p class="ft-sum">
          <span class="ft-atraso">${IC.ftAtraso}${conta(['atraso'])} em atraso</span>
          <span class="ft-pago">${IC.ftPago}${conta(['pago'])} pagas</span>
          <span class="ft-aberto">${IC.ftPrazo}${conta(['aberto', 'futuro'])} dentro do prazo</span>
        </p>`;
  // dados das faturas para o JS montar a fatura gerada (o "<" vira < para não fechar o script)
  const ftData = JSON.stringify({
    titular: A.nome, codigo: A.codigo, plano: `${P.nome}, ${P.down} Mega`, endereco: A.endereco,
    emissor: C.nome, cnpj: C.cnpj, wa: C.wa(msgFatura),
    ic: { pago: IC.ftPago, aberto: IC.ftPrazo, futuro: IC.ftPrazo, atraso: IC.ftAtraso, wa: I.whatsapp, seta: I.seta },
    st: Object.fromEntries(Object.entries(FT_ST).map(([k, v]) => [k, v.label])),
    itens: FATURAS,
  }).replace(/</g, '\\u003c');
  const senhaMsg = 'Olá! Vim pela Área do Cliente e esqueci minha senha de acesso. Podem me ajudar?';
  const chips = (name, legend, opts) => `
        <fieldset class="subj ac-chips">
          <legend>${legend}</legend>
          <div>${opts.map((o, i) => `<label><input type="radio" name="${name}" value="${esc(o)}"${i ? '' : ' checked'}><span>${o}</span></label>`).join('')}</div>
        </fieldset>`;
  const waBox = (tpl) => `data-wa-tpl="${esc(tpl)}" data-whats="${C.contato.whatsapp}"`;
  const pct = Math.round((A.fidelidade.cumpridos / A.fidelidade.meses) * 100);
  const body = `
<section class="ac-login t-paper" data-ac-login aria-labelledby="ac-lt">
  ${fibers('light')}
  <div class="container ac-login-in">
    <div class="ac-login-copy">
      <nav class="crumbs up" style="--d:.1s" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">Área do Cliente</span></nav>
      ${kicker('Área do Cliente', 'up')}
      <h1 class="hl" id="ac-lt">${rise('Sua *conexão* em um só lugar.')}</h1>
      <p class="lead up" style="--d:.7s">Consulte o seu plano, confira vencimento e fidelidade, teste a velocidade e agende um atendimento sem sair de casa.</p>
      <ul class="ac-feat up" style="--d:.85s">
        <li>Plano contratado<small>Velocidade e valor mensal</small></li>
        <li>Detalhes do contrato<small>Vencimento, fidelidade e condições</small></li>
        <li>Teste de conexão<small>Confira a velocidade em casa</small></li>
        <li>Agendamento<small>Técnico marcado pelo WhatsApp</small></li>
      </ul>
    </div>
    <form class="form ac-form up" style="--d:.5s" id="ac-login" novalidate>
      <p class="kicker">Acesso do assinante</p>
      <h2>Entrar</h2>
      <p class="form-note">Use o CPF do titular e a senha enviada na instalação.</p>
      <label class="fl"><input name="cpf" inputmode="numeric" autocomplete="username" required placeholder=" " maxlength="14"><span>CPF do titular *</span></label>
      <label class="fl fl-pw"><input name="senha" type="password" autocomplete="current-password" required placeholder=" "><span>Senha *</span><button type="button" class="ac-eye" data-ac-eye aria-pressed="false">Mostrar</button></label>
      <button class="btn btn-o" type="submit" data-magnetic>${roll('Acessar minha conta')}<span class="b-ar">${I.seta}</span></button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="ac-help"><a href="${C.wa(senhaMsg)}" target="_blank" rel="noopener">Esqueci minha senha</a><a href="${C.wa('Olá! Vim pelo site e quero conhecer os planos de internet.')}" target="_blank" rel="noopener">Ainda não sou cliente</a></p>
      <p class="ac-demo">Ambiente demonstrativo: entre com qualquer CPF e qualquer senha para ver a área do assinante.</p>
    </form>
  </div>
</section>

<div class="ac-dash" data-ac-dash>
<section class="phero ac-top t-paper" aria-labelledby="ac-dt">
  ${fibers('light')}
  <div class="container phero-in">
    <nav class="crumbs up" style="--d:.1s" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">Área do Cliente</span></nav>
    ${kicker('Área do Cliente', 'up')}
    <div class="ac-hello">
      <h1 class="hl" id="ac-dt" tabindex="-1">${rise(`Olá, *${A.nome.split(' ')[0]}.*`)}</h1>
      <button type="button" class="btn btn-line btn-sm up" style="--d:.5s" data-ac-out>${roll('Sair da conta')}<span class="b-ar">${I.seta}</span></button>
    </div>
    <dl class="ac-id up" style="--d:.6s">
      <div><dt>Titular</dt><dd>${A.nome}</dd></div>
      <div><dt>Código do assinante</dt><dd>${A.codigo}</dd></div>
      <div><dt>CPF</dt><dd data-ac-cpf>***.***.***-**</dd></div>
      <div><dt>Situação</dt><dd class="ok">Conexão ativa</dd></div>
    </dl>
  </div>
</section>

<section class="sec t-paper ac-main">
  <div class="container ac-grid">
    <article class="ac-card ac-plan t-navy rv" aria-labelledby="ac-pl">
      ${fibers('dark')}
      <p class="kicker">Plano contratado</p>
      <h2 id="ac-pl">${P.nome}</h2>
      <p class="ac-speed"><b>${P.down}</b><span>Mega<small>de download</small></span></p>
      <dl class="ac-spec">
        <div><dt>Upload</dt><dd>${P.up} Mega</dd></div>
        <div><dt>Tecnologia</dt><dd>${P.tecnologia}</dd></div>
        <div><dt>Roteador</dt><dd>${P.wifi}</dd></div>
      </dl>
      <div class="ac-plan-foot">
        <p class="ac-price"><small>Valor mensal</small><b>R$ ${P.valor}</b><span>por mês</span></p>
        ${arrowBtn('#ac-detalhe', 'Ver detalhes do plano', 'btn btn-o btn-sm')}
      </div>
    </article>

    <article class="ac-card ac-test t-white rv" style="--d:1" aria-labelledby="ac-tt">
      <figure class="gauge" aria-hidden="true">
        <svg viewBox="0 0 240 140">
          <path class="g-tr" d="M24 124 A96 96 0 0 1 216 124"/>
          <path class="g-fl" pathLength="100" d="M24 124 A96 96 0 0 1 216 124"/>
          <path class="g-lt" pathLength="100" d="M24 124 A96 96 0 0 1 216 124"/>
          <text class="g-v" x="120" y="112">${P.down}</text>
          <text class="g-u" x="120" y="134">Mega contratados</text>
        </svg>
      </figure>
      <div class="ac-test-c">
        <p class="kicker">Teste sua conexão</p>
        <h2 id="ac-tt">A velocidade está chegando?</h2>
        <ul class="ac-tips">
          <li>Para medir o plano inteiro, ligue o computador no roteador pelo cabo.</li>
          <li>No Wi-Fi, fique perto do roteador e feche downloads e vídeos abertos.</li>
        </ul>
        <a class="btn btn-o" href="${SPEEDTEST}" target="_blank" rel="noopener" data-magnetic>${roll('Testar minha velocidade')}<span class="b-ar">${I.seta}</span></a>
      </div>
    </article>

    <article class="ac-card ac-detail t-white rv" id="ac-detalhe" aria-labelledby="ac-dh">
      <div>
        <p class="kicker">Detalhamento do plano</p>
        <h2 id="ac-dh">O que o seu plano inclui</h2>
        <ul class="ac-ben">${A.beneficios.map(([t, d]) => `<li><strong>${t}</strong><small>${d}</small></li>`).join('')}</ul>
      </div>
      <div class="ac-terms">
        <dl>
          <div><dt>Vencimento</dt><dd>${A.vencimento}</dd></div>
          <div><dt>Próxima fatura</dt><dd>${A.proxima}, R$ ${P.valor}</dd></div>
          <div><dt>Forma de pagamento</dt><dd>${A.pagamento}</dd></div>
          <div><dt>Cliente desde</dt><dd>${A.desde}</dd></div>
          <div class="ac-fid"><dt>Fidelidade</dt><dd>${A.fidelidade.meses} meses, até ${A.fidelidade.fim}</dd>
            <p class="ac-bar" role="img" aria-label="${A.fidelidade.cumpridos} de ${A.fidelidade.meses} meses de fidelidade cumpridos"><i style="--p:${pct}%"></i></p>
            <small>${A.fidelidade.cumpridos} de ${A.fidelidade.meses} meses cumpridos</small></div>
        </dl>
        <div class="ac-cond-h">
          <h3 id="ac-ch">Condições</h3>
          <button type="button" class="ac-tog" data-ac-tog aria-expanded="true" aria-controls="ac-cond" aria-label="Recolher as condições" title="Recolher">${IC.chevron}</button>
        </div>
        <div class="ac-cond-w" id="ac-cond" role="region" aria-labelledby="ac-ch"><div><ul class="ac-cond">${A.condicoes.map((c) => `<li>${c}</li>`).join('')}</ul></div></div>
      </div>
    </article>

    <article class="ac-card ac-act ac-sched t-deep rv" aria-labelledby="ac-ag" ${waBox(tplAg)}>
      <p class="kicker">Agende um serviço</p>
      <h2 id="ac-ag">Precisa de um técnico em casa?</h2>
      <p>Escolha o serviço e o melhor período. A mensagem abre pronta no WhatsApp, com seus dados e endereço.</p>
      ${chips('servico', 'Serviço', AG_SERV)}
      ${chips('periodo', 'Período', AG_PER)}
      <a class="btn btn-w" href="${C.wa(fillTpl(tplAg, { servico: AG_SERV[0], periodo: AG_PER[0] }))}" target="_blank" rel="noopener" data-wa-go data-magnetic>${I.whatsapp}${roll('Agendar pelo WhatsApp')}</a>
      <a class="wa-lnk" href="${C.wa(msgSuporte)}" target="_blank" rel="noopener">${I.whatsapp}<span>Outro assunto? Fale com o suporte</span></a>
    </article>

    <article class="ac-card ac-fat t-white rv" style="--d:1" aria-labelledby="ac-ft">
      <div class="ft-head">
        <div>
          <p class="kicker">Faturas</p>
          <h2 id="ac-ft">Suas faturas de 2027</h2>
        </div>
        <button type="button" class="ft-exp" data-ft-open aria-haspopup="dialog" aria-label="Expandir as faturas" title="Expandir">${IC.expandir}</button>
      </div>
      ${ftResumo}
      <div class="ft-acts">
        <button type="button" class="btn btn-o btn-sm" data-ft-gen="${iAberto}" data-magnetic>${roll('Gerar fatura do mês')}<span class="b-ar">${I.seta}</span></button>
        <button type="button" class="btn btn-line btn-sm" data-ft-gen="${iFuturo}" data-ft-mode="antecipar" data-magnetic>${roll('Antecipar fatura')}<span class="b-ar">${I.seta}</span></button>
      </div>
      <ul class="ft-list" aria-label="Faturas de 2027">${FATURAS.map((f, i) => `
        <li class="ft${f.st === 'aberto' ? ' now' : ''}">${ftIc(f)}<span class="ft-m"><b>${f.ref}</b><small>${ftNota(f)}</small></span><span class="ft-v">${brl(f.total)}</span>${ftBtn(f, i)}</li>`).join('')}
      </ul>
      <a class="wa-lnk" href="${C.wa(msgFatura)}" target="_blank" rel="noopener">${I.whatsapp}<span>Dúvida na fatura? Fale conosco</span></a>
    </article>
  </div>
</section>

<dialog class="ft-modal" id="ft-modal" aria-labelledby="ftm-t">
  <header class="ftm-head">
    <div>
      <p class="kicker">Área do Cliente</p>
      <h2 id="ftm-t">Faturas de 2027</h2>
    </div>
    <button type="button" class="ftm-x" data-ft-close aria-label="Fechar">${IC.fechar}</button>
  </header>
  <div class="ftm-body">
    <div class="ftm-list" data-ftm-list>
      <div class="ftm-top">
        ${ftResumo}
        <div class="ft-acts">
          <button type="button" class="btn btn-o btn-sm" data-ft-gen="${iAberto}">${roll('Gerar fatura do mês')}<span class="b-ar">${I.seta}</span></button>
          <button type="button" class="btn btn-line btn-sm" data-ft-gen="${iFuturo}" data-ft-mode="antecipar">${roll('Antecipar fatura')}<span class="b-ar">${I.seta}</span></button>
        </div>
      </div>
      <table class="ftm-tb">
        <thead><tr><th scope="col">Mês</th><th scope="col">Vencimento</th><th scope="col">Valor</th><th scope="col">Situação</th><th scope="col"><span class="sr">Ação</span></th></tr></thead>
        <tbody>${FATURAS.map((f, i) => `
          <tr class="${f.st === 'aberto' ? 'now' : ''}"><th scope="row">${f.mes}</th><td data-l="Vencimento">${f.venc}</td><td data-l="Valor">${brl(f.total)}${f.st === 'atraso' ? '<small>com multa e juros</small>' : ''}</td><td data-l="Situação"><span class="ftm-st ft-${f.st}">${IC[FT_ST[f.st].ic]}${f.st === 'pago' ? `Paga em ${f.pagoEm}` : FT_ST[f.st].label}</span></td><td>${ftBtn(f, i)}</td></tr>`).join('')}
        </tbody>
      </table>
      <a class="wa-lnk" href="${C.wa(msgFatura)}" target="_blank" rel="noopener">${I.whatsapp}<span>Dúvida na fatura? Fale conosco</span></a>
    </div>
    <div class="ftm-doc" data-ftm-doc hidden></div>
  </div>
</dialog>
<script type="application/json" id="ft-data">${ftData}</script>
</div>`;
  return layout({ slug, body, noindex: true,
    title: 'Área do Cliente | THD Engenharia',
    desc: 'Área do assinante: plano contratado, vencimento, fidelidade, teste de velocidade e agendamento de serviços pelo WhatsApp.' });
}

// ---------- gravação ----------
const pages = { '': home(), 'quem-somos': quemSomos(), servicos: servicos(), contabilidade: contabilidade(), contato: contato(), [AREA]: areaCliente() };

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
${Object.keys(pages).filter((s) => s !== AREA).map((s) => `  <url><loc>${canonical(s)}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
  fs.copyFileSync(path.join(__dirname, '..', '_build', 'htaccess.txt'), path.join(OUT, '.htaccess'));
}
console.log(`THD Fibra: ${Object.keys(pages).length} páginas → ${path.relative(process.cwd(), OUT) || OUT}`);
