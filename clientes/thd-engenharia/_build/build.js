// Gera o site THD Engenharia.
//   node clientes/thd-engenharia/_build/build.js            → site/     (produção, URLs limpas: /servicos/)
//   node clientes/thd-engenharia/_build/build.js --preview  → _preview/ (links para index.html, abre sem servidor)
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

// caminho relativo da página atual até a raiz do site
const rootOf = (slug) => (slug ? '../' : '');
const link = (from, to, hash = '') => {
  const r = rootOf(from);
  if (PREVIEW) return `${r}${to ? to + '/' : ''}index.html${hash}`;
  return (to ? `${r}${to}/` : r || './') + hash;
};
const asset = (from, p) => `${rootOf(from)}assets/${p}`;
const canonical = (slug) => `${C.dominio}/${slug ? slug + '/' : ''}`;
const svc = (id) => C.servicos.find((s) => s.id === id);

// ---------- partes comuns ----------
const waBtn = (label = 'Falar no WhatsApp', cls = 'btn btn-wa', msg) =>
  `<a class="${cls}" href="${msg ? C.wa(msg) : C.waOrcamento}" target="_blank" rel="noopener">${I.whatsapp}<span>${label}</span></a>`;

function header(slug) {
  const items = PAGES.map((p) =>
    `<a href="${link(slug, p.slug)}"${p.slug === slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('');
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="topbar">
  <div class="container topbar-in">
    <a href="${C.waOrcamento}" target="_blank" rel="noopener">${I.whatsapp}<span>WhatsApp ${C.contato.whatsappTexto}</span></a>
    <a href="mailto:${C.contato.email}" class="hide-sm">${I.email}<span>${C.contato.email}</span></a>
    <div class="topbar-social">${C.contato.redes.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.rotulo}">${I[r.rede]}</a>`).join('')}</div>
  </div>
</div>
<header class="header" id="topo">
  <div class="container header-in">
    <a class="brand" href="${link(slug, '')}" aria-label="THD Engenharia, página inicial">
      <img src="${asset(slug, 'img/logo-claro.png')}" alt="THD Engenharia · Consultoria de provedores de internet" width="226" height="120">
    </a>
    <nav class="nav" id="nav" aria-label="Principal">${items}
      <a class="btn btn-primary nav-cta" href="${C.waOrcamento}" target="_blank" rel="noopener">Solicitar orçamento</a>
    </nav>
    <button class="menu-btn" aria-controls="nav" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

function footer(slug) {
  const c = C.contato;
  return `
<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="${asset(slug, 'img/logo-escuro.png')}" alt="THD Engenharia" width="226" height="120" loading="lazy">
      <p>${C.quemSomos.intro.split(',')[0]}, com excelência e garantia.</p>
      <div class="social">${c.redes.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.rotulo}">${I[r.rede]}</a>`).join('')}</div>
    </div>
    <div>
      <h3>Navegação</h3>
      <ul>${PAGES.map((p) => `<li><a href="${link(slug, p.slug)}">${p.nav}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Contato</h3>
      <ul class="footer-contact">
        <li>${I.whatsapp}<a href="${C.waOrcamento}" target="_blank" rel="noopener">${c.whatsappTexto}</a></li>
        <li>${I.email}<a href="mailto:${c.email}">${c.email}</a></li>
        <li>${I.pin}<span>${c.endereco}</span></li>
      </ul>
    </div>
    <div>
      <h3>Horário de atendimento</h3>
      <dl class="hours">${c.horario.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© ${new Date().getFullYear()} ${C.nome} · CNPJ ${C.cnpj}</span>
    <span>Site por ${C.credito.url ? `<a href="${C.credito.url}" target="_blank" rel="noopener">${C.credito.nome}</a>` : C.credito.nome}</span>
  </div>
</footer>
<a class="wa-float" href="${C.waOrcamento}" target="_blank" rel="noopener" aria-label="Falar com a THD no WhatsApp">${I.whatsapp}</a>`;
}

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
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset(slug, 'css/style.css')}?v=${ver(css)}">
<script>document.documentElement.classList.add('js')</script>${ga}${jsonld}
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

const pageHero = (slug, eyebrow, title, lead) => `
<section class="page-hero">
  <div class="circuit" aria-hidden="true"></div>
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="${link(slug, '')}">Início</a><span>/</span><span aria-current="page">${PAGES.find((p) => p.slug === slug).nav}</span></nav>
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>
</section>`;

const ctaBand = (slug, titulo = 'Vamos tirar o seu provedor do papel ou deixá-lo em dia?', texto = 'Conte o que você precisa. Respondemos pelo WhatsApp em horário comercial.') => `
<section class="cta-band">
  <div class="container cta-in">
    <div class="cta-text reveal">
      <p class="eyebrow">Fale com a nossa equipe</p>
      <h2>${titulo}</h2>
      <p>${texto}</p>
      <div class="actions">${waBtn('Chamar no WhatsApp')}<a class="btn btn-ghost-light" href="${link(slug, 'contato')}">Enviar mensagem</a></div>
    </div>
    <img class="cta-img" src="${asset(slug, 'img/atendente.webp')}" alt="Atendente da THD Engenharia" width="768" height="559" loading="lazy">
  </div>
</section>`;

const serviceCard = (slug, s) => `
<a class="card svc reveal" href="${link(slug, 'servicos', '#' + s.id)}">
  <span class="ico">${I[s.icone]}</span>
  <h3>${s.titulo}</h3>
  <p>${s.curto}</p>
  <span class="more">Saiba mais ${I.seta}</span>
</a>`;

// ---------- páginas ----------
function home() {
  const slug = '';
  const destaques = ['outorga-scm', 'pos-outorga', 'asn', 'ipv4'].map(svc);
  const body = `
<section class="hero">
  <picture class="hero-bg"><source srcset="assets/img/hero.webp" type="image/webp"><img src="assets/img/hero.jpg" alt="" width="1920" height="1056" fetchpriority="high"></picture>
  <div class="circuit" aria-hidden="true"></div>
  <div class="container hero-in">
    <div class="hero-text">
      <p class="eyebrow">${I.sinal} ${C.slogan}</p>
      <h1>Seu provedor <em>regular</em>, em dia e pronto para crescer.</h1>
      <p class="lead">Outorga SCM, ASN, IPv4, declarações à Anatel e contabilidade especializada. A THD cuida da parte técnica e burocrática para você focar no que importa: seus clientes.</p>
      <div class="actions">
        ${waBtn('Solicitar orçamento', 'btn btn-primary btn-lg')}
        <a class="btn btn-ghost-light btn-lg" href="${link(slug, 'servicos')}">Ver serviços</a>
      </div>
      <ul class="hero-proof">
        <li>${I.check} Dezenas de empresas atendidas</li>
        <li>${I.check} Anatel, CREA, CFT e Registro.br</li>
      </ul>
    </div>
    <aside class="hero-card" aria-label="Serviços mais procurados">
      <p class="hero-card-title">Mais procurados</p>
      <ul>${destaques.map((s) => `<li><a href="${link(slug, 'servicos', '#' + s.id)}"><span class="ico">${I[s.icone]}</span><span><strong>${s.titulo}</strong><small>${s.curto}</small></span></a></li>`).join('')}</ul>
    </aside>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">Nossos serviços</p>
      <h2>Como a THD pode ajudar a sua empresa</h2>
      <p>Tudo o que um provedor de internet precisa para operar dentro das regras, em um só parceiro.</p>
    </header>
    <div class="grid-svc">${C.servicos.map((s) => serviceCard(slug, s)).join('')}
      <a class="card svc svc-cta reveal" href="${C.waOrcamento}" target="_blank" rel="noopener">
        <span class="ico">${I.whatsapp}</span>
        <h3>Precisa de outra solução?</h3>
        <p>Conte a situação do seu provedor e indicamos o melhor caminho.</p>
        <span class="more">Falar com a equipe ${I.seta}</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-dark">
  <div class="circuit" aria-hidden="true"></div>
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">A jornada do provedor</p>
      <h2>Acompanhamos cada etapa, da outorga ao crescimento</h2>
    </header>
    <ol class="journey">${C.jornada.map((j, i) => `
      <li class="reveal" style="--d:${i * 80}ms">
        <span class="step">0${i + 1}</span>
        <h3>${j.t}</h3>
        <p>${j.d}</p>
        <ul class="tags">${j.ids.map((id) => `<li><a href="${link(slug, 'servicos', '#' + id)}">${svc(id).titulo.split(':')[0].split('·')[0].trim()}</a></li>`).join('')}</ul>
      </li>`).join('')}
    </ol>
  </div>
</section>

<section class="section">
  <div class="container split">
    <figure class="split-media reveal">
      <img src="assets/img/internet.webp" alt="Conexões de internet ao redor do mundo" width="1000" height="483" loading="lazy">
    </figure>
    <div class="split-text reveal">
      <p class="eyebrow">Quem somos</p>
      <h2>Consultoria feita para provedores de internet</h2>
      <p>${C.quemSomos.intro}</p>
      <p>${C.quemSomos.historia}</p>
      <blockquote><strong>Nossa missão:</strong> ${C.quemSomos.missao.charAt(0).toLowerCase() + C.quemSomos.missao.slice(1)}</blockquote>
      <a class="btn btn-outline" href="${link(slug, 'quem-somos')}">Conheça a THD ${I.seta}</a>
    </div>
  </div>
</section>

<section class="section section-soft">
  <div class="container split split-rev">
    <div class="split-text reveal">
      <p class="eyebrow">Contabilidade</p>
      <h2>${C.contabilidade.pergunta}</h2>
      <p>${C.contabilidade.smart}</p>
      <ul class="checks">${C.contabilidade.operacional.slice(0, 4).map((x) => `<li>${I.check}${x}</li>`).join('')}</ul>
      <a class="btn btn-outline" href="${link(slug, 'contabilidade')}">Ver contabilidade ${I.seta}</a>
    </div>
    <figure class="split-media media-square reveal">
      <img src="assets/img/contabilidade.webp" alt="THD Engenharia · Contabilidade" width="800" height="800" loading="lazy">
    </figure>
  </div>
</section>
${ctaBand(slug)}`;
  const jsonld = `
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: C.nome, description: C.quemSomos.intro,
    url: C.dominio + '/', logo: C.dominio + '/assets/img/logo-claro.png', image: C.dominio + '/assets/img/og.jpg',
    telephone: C.contato.telefoneSchema, email: C.contato.email, taxID: C.cnpj,
    address: { '@type': 'PostalAddress', streetAddress: 'R. Almirante Pestana, 6', addressLocality: 'Rio de Janeiro', addressRegion: 'RJ', addressCountry: 'BR' },
    openingHours: 'Mo-Fr 09:00-18:00', sameAs: C.contato.redes.map((r) => r.url),
    areaServed: 'BR',
  })}</script>`;
  return layout({ slug, jsonld, body,
    title: 'THD Engenharia · Consultoria de provedores de internet',
    desc: 'Consultoria para provedores de internet: outorga SCM, ASN, aluguel de IPv4, DICI, notificações Anatel, responsabilidade técnica e contabilidade especializada.' });
}

function quemSomos() {
  const slug = 'quem-somos';
  const Q = C.quemSomos;
  const body = `
${pageHero(slug, 'Institucional', 'Quem somos', Q.intro)}
<section class="section">
  <div class="container split">
    <div class="split-text reveal">
      <p class="eyebrow">Nossa história</p>
      <h2>Soluções completas para quem leva internet às pessoas</h2>
      <p>${Q.historia}</p>
      <p>Reunimos engenharia, regulatório, contabilidade e marketing em um só lugar, para que o provedor tenha um parceiro que entende o seu negócio de ponta a ponta.</p>
      <div class="actions">${waBtn('Confira nossos serviços e faça seu orçamento', 'btn btn-primary')}</div>
    </div>
    <figure class="split-media reveal">
      <img src="../assets/img/rede.webp" alt="Profissional analisando a rede em um data center" width="1600" height="900" loading="lazy">
    </figure>
  </div>
</section>

<section class="section section-dark mission">
  <div class="circuit" aria-hidden="true"></div>
  <div class="container narrow reveal">
    <p class="eyebrow">Nossa missão</p>
    <p class="mission-text">“${Q.missao}”</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">Como trabalhamos</p>
      <h2>O que você pode esperar da THD</h2>
    </header>
    <div class="grid-4">${Q.pilares.map((p, i) => `
      <article class="card pillar reveal" style="--d:${i * 70}ms">
        <span class="ico">${I[['selo', 'escudo', 'raio', 'cadeado'][i]]}</span>
        <h3>${p.t}</h3><p>${p.d}</p>
      </article>`).join('')}
    </div>
  </div>
</section>
${ctaBand(slug)}`;
  return layout({ slug, body,
    title: 'Quem somos · THD Engenharia',
    desc: 'A THD é uma consultoria especializada em provedores de internet. Praticidade e segurança para resolver as questões técnicas e regulatórias do seu provedor.' });
}

function servicos() {
  const slug = 'servicos';
  const body = `
${pageHero(slug, 'Catálogo de soluções', 'Serviços para provedores de internet', 'Da outorga na Anatel à contabilidade: escolha o que o seu provedor precisa ou fale com a gente para montar um pacote.')}
<div class="svc-nav-wrap">
  <nav class="container svc-nav" aria-label="Categorias de serviço">${C.grupos.map((g) => `<a href="#${g.id}">${g.titulo}</a>`).join('')}</nav>
</div>
${C.grupos.map((g, gi) => `
<section class="section ${gi % 2 ? 'section-soft' : ''}" id="${g.id}">
  <div class="container">
    <header class="section-head left reveal">
      <p class="eyebrow">0${gi + 1} · ${g.titulo}</p>
      <h2>${g.resumo}</h2>
    </header>
    <div class="svc-list">${C.servicos.filter((s) => s.grupo === g.id).map((s) => `
      <article class="card svc-full reveal" id="${s.id}">
        <span class="ico">${I[s.icone]}</span>
        <div>
          <h3>${s.titulo}</h3>
          <p>${s.texto}</p>
          <div class="svc-actions">
            ${waBtn('Pedir orçamento', 'btn btn-sm btn-primary', `Olá, THD! Quero um orçamento de: ${s.titulo}.`)}
            ${s.link ? `<a class="btn btn-sm btn-outline" href="${link(slug, s.link)}">Ver contabilidade ${I.seta}</a>` : ''}
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`).join('')}
${ctaBand(slug, 'Não encontrou o que procura?', 'Fale com a nossa equipe. Indicamos o caminho certo para a situação do seu provedor.')}`;
  return layout({ slug, body,
    title: 'Serviços · THD Engenharia',
    desc: 'Outorga SCM, SEAC e STFC, DICI e pós-outorga, notificações Anatel/CREA/CFT, ASN, aluguel de IPv4, responsabilidade técnica, segurança do trabalho, contabilidade, marketing e registro de marca.' });
}

function contabilidade() {
  const slug = 'contabilidade';
  const K = C.contabilidade;
  const body = `
${pageHero(slug, 'Serviço contábil especializado', K.pergunta, K.smart)}
<section class="section">
  <div class="container split">
    <figure class="split-media media-square reveal">
      <img src="../assets/img/contabilidade.webp" alt="THD Engenharia · Contabilidade" width="800" height="800" loading="lazy">
    </figure>
    <div class="split-text reveal">
      <p class="eyebrow">Smart Accounting</p>
      <h2>Contabilidade que mostra onde está o seu lucro</h2>
      <p>${K.time}</p>
      <p>Atendemos:</p>
      <ul class="chips">${K.segmentos.map((s) => `<li>${s}</li>`).join('')}</ul>
      <div class="actions">${waBtn('Falar com a contabilidade', 'btn btn-primary', 'Olá, THD! Quero saber mais sobre o serviço de contabilidade.')}</div>
    </div>
  </div>
</section>

<section class="section section-soft">
  <div class="container">
    <header class="section-head reveal">
      <p class="eyebrow">Gestão contábil</p>
      <h2>Do operacional ao estratégico</h2>
      <p>${svc('gestao-contabil').texto}</p>
    </header>
    <div class="grid-2">
      <article class="card reveal">
        <span class="ico">${I.documento}</span>
        <h3>Rotina operacional</h3>
        <ul class="checks">${K.operacional.map((x) => `<li>${I.check}${x}</li>`).join('')}</ul>
      </article>
      <article class="card reveal" style="--d:80ms">
        <span class="ico">${I.grafico}</span>
        <h3>Planejamento estratégico</h3>
        <p>${K.estrategico}</p>
        <ul class="checks">
          <li>${I.check}Extratos contábeis mensais</li>
          <li>${I.check}Oportunidades de redução de custos e impostos</li>
          <li>${I.check}Mais lucratividade para o negócio</li>
        </ul>
      </article>
    </div>
  </div>
</section>
${ctaBand(slug, 'Descubra a real rentabilidade do seu provedor', 'Converse com a nossa equipe contábil e veja onde é possível economizar.')}`;
  return layout({ slug, body,
    title: 'Contabilidade para provedores · THD Engenharia',
    desc: 'Contabilidade especializada com Smart Accounting: extratos mensais, redução de custos e impostos e planejamento estratégico para provedores de internet e empresas.' });
}

function contato() {
  const slug = 'contato';
  const c = C.contato;
  const body = `
${pageHero(slug, 'Formulário e WhatsApp', 'Entre em contato com a nossa equipe', 'Estamos à disposição para o seu contato. Escolha o canal que preferir.')}
<section class="section">
  <div class="container contact-grid">
    <form class="card form reveal" id="form-contato" novalidate data-whats="${c.whatsapp}">
      <h2>Envie sua mensagem</h2>
      <p class="form-note">Ao enviar, sua mensagem abre pronta no WhatsApp da THD.</p>
      <div class="field-row">
        <label class="field"><span>Nome *</span><input name="nome" autocomplete="name" required></label>
        <label class="field"><span>Empresa / provedor</span><input name="empresa" autocomplete="organization"></label>
      </div>
      <div class="field-row">
        <label class="field"><span>Telefone *</span><input name="telefone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(00) 00000-0000"></label>
        <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
      </div>
      <fieldset class="field">
        <legend>Assunto *</legend>
        <div class="radios">${c.assuntos.map((a, i) => `<label><input type="radio" name="assunto" value="${a}"${i === 0 ? ' checked' : ''}><span>${a}</span></label>`).join('')}</div>
      </fieldset>
      <label class="field"><span>Mensagem *</span><textarea name="mensagem" rows="5" required placeholder="Conte como podemos ajudar"></textarea></label>
      <button class="btn btn-primary btn-lg" type="submit">${I.whatsapp}<span>Enviar mensagem</span></button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>

    <aside class="contact-side">
      <a class="card contact-wa reveal" href="${C.waOrcamento}" target="_blank" rel="noopener">
        <span class="ico ico-wa">${I.whatsapp}</span>
        <span><strong>Estamos no WhatsApp</strong><small>${c.whatsappTexto} · clique para conversar</small></span>
      </a>
      <a class="card contact-item reveal" href="mailto:${c.email}">
        <span class="ico">${I.email}</span>
        <span><strong>E-mail</strong><small>${c.email}</small></span>
      </a>
      <div class="card contact-item reveal">
        <span class="ico">${I.relogio}</span>
        <span><strong>Horário de atendimento</strong>${c.horario.map(([d, h]) => `<small>${d}: ${h}</small>`).join('')}</span>
      </div>
      <div class="card contact-item reveal">
        <span class="ico">${I.instagram}</span>
        <span><strong>Redes sociais</strong>${c.redes.map((r) => `<small><a href="${r.url}" target="_blank" rel="noopener">${r.rotulo} ${r.handle}</a></small>`).join('')}</span>
      </div>
    </aside>
  </div>
</section>
<section class="map-wrap" aria-label="Mapa">
  <iframe title="Localização da THD Engenharia" src="${c.mapa}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</section>`;
  return layout({ slug, body,
    title: 'Contato · THD Engenharia',
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
fs.mkdirSync(path.join(OUT, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
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
