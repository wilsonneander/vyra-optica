// Gera o modelo BRONZE do Siri na Lata (nicho restaurante e lanchonete).
//   node clientes/siri-na-lata/_build-bronze/build.js   → site-bronze/
//
// Bronze: site enxuto de uma página, foco no essencial. CSS e JS embutidos, fotos em WebP,
// SEO básico (meta, Open Graph, dados estruturados de Restaurant, sitemap e robots).
// Abre direto no navegador (index.html) e sobe em qualquer hospedagem estática.
const fs = require('fs');
const path = require('path');
const C = require('../_build/content');
const I = require('../_build/icons');
const { css } = require('./style');
const { js } = require('./script');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site-bronze');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => `R$ ${n}`;
const img = (p) => `assets/img/${p}`;

// links do WhatsApp com mensagem pronta
const wa = (msg) => `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(`${C.contato.mensagemPadrao} ${msg}`)}`;
const WA = {
  geral: wa('fazer um pedido.'),
  reserva: wa('reservar uma mesa. Dia: , horário: , pessoas: .'),
  pedido: wa('fazer um pedido para retirada.'),
  plano: (p) => wa(`saber mais sobre: ${p}.`),
};

const end = C.endereco;
const enderecoTxt = `${end.rua}, ${end.bairro}, ${end.cidade}, ${end.uf}`;
const hora = (h) => h.replace(':00', 'h').replace(':', 'h');
const horarioTxt = (h) => (h.abre ? `${hora(h.abre)} às ${hora(h.fecha)}` : 'Fechado');

const NAV = [
  ['#cardapio', 'Cardápio'],
  ['#a-casa', 'A casa'],
  ['#reservas', 'Reservas'],
  ['#duvidas', 'Dúvidas'],
  ['#visite', 'Como chegar'],
];

// ---------- dados estruturados (Google) ----------
const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: C.nome,
  url: C.dominio + '/',
  image: `${C.dominio}/assets/img/og.jpg`,
  logo: `${C.dominio}/assets/img/siri-na-lata.svg`,
  servesCuisine: ['Frutos do mar', 'Petiscos', 'Brasileira'],
  priceRange: 'R$ 30 a R$ 250',
  telephone: `+${C.contato.whatsapp}`,
  address: { '@type': 'PostalAddress', streetAddress: end.rua, addressLocality: end.cidade, addressRegion: end.uf, addressCountry: 'BR', ...(end.cep ? { postalCode: end.cep } : {}) },
  hasMenu: `${C.dominio}/#cardapio`,
  acceptsReservations: true,
  sameAs: [C.contato.instagram, C.contato.facebook].filter(Boolean),
  openingHoursSpecification: C.horarios.filter((h) => h.abre).map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.d.map((d) => DIAS[d]), opens: h.abre, closes: h.fecha })),
};
const faqld = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: C.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
};

// ---------- blocos ----------
const header = `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr-in">
    <a class="brand" href="#topo" aria-label="${esc(C.curto)}, início"><img src="${img('siri-na-lata.svg')}" alt="" width="34" height="55"><span>${esc(C.curto)}</span></a>
    <nav class="nav" id="nav" aria-label="Principal">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
    <a class="btn btn-wa" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu" data-menu>${I.menu('ic i-open')}${I.fechar('ic i-close')}</button>
  </div>
</header>`;

const hero = `
<section class="hero" id="topo">
  <div class="hero-bg"><img src="${img('hero.webp')}" alt="" width="1920" height="1100" fetchpriority="high"></div>
  <div class="wrap hero-in">
    <div>
      <h1><span>${C.hero.titulo[0]}</span><span class="l2">${C.hero.titulo[1]}</span><span class="sr"> Bar &amp; Restaurante em Florianópolis</span></h1>
      <p class="hero-line">Petisco de <em>mar</em>, cerveja <em>gelada</em> e mesa cheia no Estreito.</p>
      <p class="hero-txt">${esc(C.hero.texto)}</p>
      <div class="hero-cta">
        <a class="btn btn-siri" href="#cardapio">${C.hero.ctaPrincipal}${I.seta()}</a>
        <a class="btn btn-line" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}${C.hero.ctaSecundario}</a>
      </div>
    </div>
    <img class="mascote" src="${img('siri-na-lata.svg')}" alt="Mascote do Siri na Lata: um siri sorridente saindo de uma lata" width="300" height="486">
  </div>
  <div class="hero-info">
    <div class="wrap">
      <span data-agora>${C.horarios.filter((h) => h.abre).map((h) => `<strong>${h.dias}</strong> ${horarioTxt(h)}`).join(' &nbsp; ')}</span>
      <a href="${end.mapa}" target="_blank" rel="noopener"><strong>${esc(end.rua)}</strong>, ${esc(end.bairro)}</a>
    </div>
  </div>
</section>`;

const ILL = { siri: I.lataSiri('ill'), porcao: I.porcao('ill') };
const destaques = `
<section class="sec cream" aria-labelledby="destaques-t">
  <h2 class="sr" id="destaques-t">Destaques da casa</h2>
  ${I.alga('alga tr')}${I.alga('alga bl')}
  <div class="wrap duo">
    ${C.destaques.map((d, i) => `${i === 1 ? I.longNeck('neck') : ''}
    <article class="rv">${ILL[d.id]}<h2>${esc(d.titulo)}</h2><p>${esc(d.texto)}</p></article>`).join('')}
  </div>
</section>`;

const boasVindas = `
<section class="sec white welcome" aria-labelledby="bv-t">
  ${I.alga('alga br')}
  <div class="wrap rv">
    <h2 id="bv-t">${esc(C.boasVindas.titulo)}</h2>
    <blockquote><p>${esc(C.boasVindas.texto)}</p></blockquote>
    <cite>${esc(C.boasVindas.assinatura)}</cite>
  </div>
</section>`;

const faixaCardapio = `
<div class="band" id="cardapio">
  <img src="${img('faixa-cardapio.webp')}" alt="" width="1920" height="900" loading="lazy" decoding="async">
  <div class="wrap rv"><h2>Cardápio</h2><p>Os mais pedidos da casa</p></div>
</div>`;

const cardapio = `
<section class="sec cream" aria-label="Cardápio">
  ${I.alga('alga tr')}
  <div class="wrap">
    <ul class="grid-fotos">
      ${C.cardapioFotos.map((f) => `<li class="rv"><figure><img src="${img(f.foto + '.webp')}" alt="${esc(f.alt)}" width="640" height="800" loading="lazy" decoding="async"></figure><span>${esc(f.nome)}</span></li>`).join('')}
    </ul>

    <div class="menu-head">
      <h2>O cardápio completo</h2>
      <p>Tudo feito na hora. Pediu para levar? Mande pelo WhatsApp e retire no balcão.</p>
    </div>
    <nav class="cats" aria-label="Seções do cardápio">${C.cardapio.map((c) => `<a href="#c-${c.id}">${esc(c.titulo)}</a>`).join('')}</nav>
    <div class="menu">
      ${C.cardapio.map((c) => `<section id="c-${c.id}" aria-labelledby="t-${c.id}">
        <h3 id="t-${c.id}">${esc(c.titulo)}</h3>
        <p class="nota">${I.onda()}${esc(c.nota)}</p>
        <ul>${c.itens.map((it) => `<li><div class="row"><b>${esc(it.nome)}</b><i></i><strong>${brl(it.preco)}</strong></div><small>${esc(it.desc)}${it.obs ? `. <em>${esc(it.obs)}</em>` : ''}${it.meia ? `. <em>Meia porção ${brl(it.meia)}</em>` : ''}</small></li>`).join('')}</ul>
      </section>`).join('')}
    </div>
    <div class="bebidas">
        <h3>Para beber</h3>
        <p>${esc(C.bebidas)}</p>
        <a class="btn btn-siri" href="${WA.pedido}" target="_blank" rel="noopener">${I.whatsapp()}Pedir para retirar</a>
    </div>
    <p class="aviso">${esc(C.avisoPrecos)}</p>
  </div>
</section>`;

const S = C.sobre;
const aCasa = `
<section class="sec white" id="a-casa" aria-labelledby="casa-t">
  <div class="wrap story">
    <div class="story-txt rv">
      <p>${esc(S.titulo)}</p>
      <h2 id="casa-t">${esc(S.subtitulo)}</h2>
      ${S.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
      <div class="selo"><img src="${img('siri-na-lata.svg')}" alt="" width="58" height="94" loading="lazy"><div><h3>${esc(S.selo.titulo)}</h3><p>${esc(S.selo.texto)}</p></div></div>
    </div>
    <div class="mosaico rv">
      <figure class="m1"><img src="${img('casa-kibe.webp')}" alt="Kibe servido em tábua de madeira com limão" width="900" height="900" loading="lazy" decoding="async"></figure>
      <figure class="marca"><img src="${img('siri-na-lata.svg')}" alt="Logo do Siri na Lata" width="124" height="200" loading="lazy"></figure>
      <figure class="m2"><img src="${img('casa-lagosta.webp')}" alt="Lagostas frescas com limão e salsinha" width="900" height="1200" loading="lazy" decoding="async"></figure>
      <figure class="m3"><img src="${img('casa-mesa.webp')}" alt="Travessa de frutos do mar com camarão, mexilhão e vieiras" width="900" height="700" loading="lazy" decoding="async"></figure>
    </div>
  </div>
</section>`;

const P = C.planos;
const reservas = `
<section class="reserva" id="reservas" aria-labelledby="res-t">
  <img src="${img('faixa-reserva.webp')}" alt="" width="1920" height="1000" loading="lazy" decoding="async">
  <div class="wrap">
    <div class="reserva-head rv">
      <h2 id="res-t">${esc(P.titulo)}</h2>
      <p>${esc(P.texto)}</p>
    </div>
    <div class="planos">
      ${P.opcoes.map((o) => `<article class="plano rv${o.destaque ? ' top' : ''}">
        <h3>${esc(o.nome)}</h3>
        <p class="para">${esc(o.para)}</p>
        <p class="valor">${esc(o.valor)}</p>
        <ul>${o.condicoes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        <a class="btn ${o.destaque ? 'btn-siri' : ''}" href="${WA.plano(o.nome)}" target="_blank" rel="noopener">${I.whatsapp()}Combinar pelo WhatsApp</a>
      </article>`).join('')}
    </div>
    <p class="pagamento"><span><strong>Pagamento:</strong> ${P.pagamento.join(', ')}</span><span>${esc(P.taxaServico)}</span></p>
  </div>
</section>`;

const mais = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>`;
const faq = `
<section class="sec cream" id="duvidas" aria-labelledby="faq-t">
  <div class="wrap faq-in">
    <div class="side rv">
      <h2 id="faq-t">Perguntas frequentes</h2>
      <p>Não achou o que procurava? Chama a gente no WhatsApp que a resposta vem rapidinho.</p>
      <a class="btn btn-ink" href="${WA.geral.replace(encodeURIComponent('fazer um pedido.'), encodeURIComponent('tirar uma dúvida.'))}" target="_blank" rel="noopener">${I.whatsapp()}Falar com a gente</a>
    </div>
    <div class="faq rv">
      ${C.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.p)}${mais}</summary><p>${esc(f.r)}</p></details>`).join('')}
    </div>
  </div>
</section>`;

const visite = `
<section class="sec white" id="visite" aria-labelledby="vis-t">
  ${I.alga('alga tr')}
  <div class="wrap visite">
    <div class="rv">
      <h2 id="vis-t">Venha nos visitar</h2>
      <address>${esc(end.rua)}<br>${esc(end.bairro)}, ${esc(end.cidade)}, ${end.uf}</address>
      <p class="ref">${esc(end.referencia)}</p>
      <div class="acoes">
        <a class="btn btn-ink" href="${end.mapa}" target="_blank" rel="noopener">${I.pino()}Como chegar</a>
        <a class="btn btn-wa" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar mesa</a>
      </div>
    </div>
    <div class="horas rv">
      <h3>Horário de funcionamento</h3>
      <table><tbody>${C.horarios.map((h) => `<tr data-dias="${h.d.join(',')}"><td>${h.dias}</td><td${h.abre ? '' : ' class="fechado"'}>${horarioTxt(h)}</td></tr>`).join('')}</tbody></table>
    </div>
  </div>
</section>`;

const ano = new Date().getFullYear();
const footer = `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div>
        <a class="brand" href="#topo"><img src="${img('siri-na-lata.svg')}" alt="" width="46" height="75" loading="lazy"><span>${esc(C.curto)}</span></a>
        <p>Petisco bom é petisco dividido. Frutos do mar, porções e cerveja gelada no Estreito.</p>
      </div>
      <div>
        <h3>Navegue</h3>
        <ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Atendimento</h3>
        <ul>
          ${C.horarios.map((h) => `<li>${h.dias}: ${horarioTxt(h)}</li>`).join('')}
          <li><a href="${WA.geral}" target="_blank" rel="noopener">WhatsApp ${esc(C.contato.whatsappExibicao)}</a></li>
        </ul>
      </div>
      <div>
        <h3>Endereço</h3>
        <p><a href="${end.mapa}" target="_blank" rel="noopener">${esc(end.rua)}<br>${esc(end.bairro)}<br>${esc(end.cidade)}, ${end.uf}</a></p>
        <h3 style="margin-top:22px">Siga</h3>
        <div class="redes">
          <a href="${C.contato.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${esc(C.contato.instagramUser)}">${I.instagram()}</a>
          <a href="${WA.geral}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp()}</a>
          ${C.contato.facebook ? `<a href="${C.contato.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook()}</a>` : ''}
        </div>
      </div>
    </div>
    <div class="ftr-bot"><span>&copy; ${ano} ${esc(C.nome)}</span><a href="${C.contato.instagram}" target="_blank" rel="noopener">${esc(C.contato.instagramUser)}</a></div>
  </div>
</footer>
<a class="wa-float" href="${WA.geral}" target="_blank" rel="noopener" aria-label="Fale com o Siri na Lata pelo WhatsApp">${I.whatsapp()}<span>Peça pelo WhatsApp</span></a>`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(C.seo.titulo)}</title>
<meta name="description" content="${esc(C.seo.descricao)}">
<link rel="canonical" href="${C.dominio}/">
<meta name="theme-color" content="#3F3E3B">
<meta property="og:type" content="restaurant">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(C.nome)}">
<meta property="og:title" content="${esc(C.seo.titulo)}">
<meta property="og:description" content="${esc(C.seo.descricao)}">
<meta property="og:url" content="${C.dominio}/">
<meta property="og:image" content="${C.dominio}/assets/img/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.png" type="image/png">
<link rel="icon" href="assets/img/siri-na-lata.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preload" as="image" href="${img('hero.webp')}" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Gloock&display=swap">
<script>document.documentElement.classList.add('js')</script>
<style>${css.replace(/\n\s*/g, '').trim()}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(faqld)}</script>
</head>
<body>
${header}
<main id="conteudo">
${hero}
${destaques}
${boasVindas}
${faixaCardapio}
${cardapio}
${aCasa}
${reservas}
${faq}
${visite}
</main>
${footer}
<script>${js}</script>
</body>
</html>
`;

// ---------- saída ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);

const IMGS = ['hero.webp', 'faixa-cardapio.webp', 'faixa-reserva.webp', 'casa-kibe.webp', 'casa-lagosta.webp', 'casa-mesa.webp', 'og.jpg', ...C.cardapioFotos.map((f) => f.foto + '.webp')];
IMGS.forEach((f) => fs.copyFileSync(path.join(ROOT, '_build/img', f), path.join(OUT, 'assets/img', f)));
[['siri-na-lata.svg', 'siri-na-lata.svg'], ['favicon.png', 'favicon.png'], ['apple-touch-icon.png', 'apple-touch-icon.png']]
  .forEach(([a, b]) => fs.copyFileSync(path.join(ROOT, 'marca', a), path.join(OUT, 'assets/img', b)));

fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${C.dominio}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.htaccess'), `# Cache e compressão (Apache)\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/html "access plus 0 seconds"\n</IfModule>\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain\n</IfModule>\n`);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';
console.log('site-bronze gerado:', kb(path.join(OUT, 'index.html')), 'de HTML');
