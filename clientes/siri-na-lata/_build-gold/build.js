// Gera o modelo GOLD do Siri na Lata (nicho restaurante e lanchonete).
//   node clientes/siri-na-lata/_build-gold/build.js   → site-gold/
//
// Gold, conceito "Maré": o dia na praia do Siri na Lata, do almoço ao pôr do sol.
// - Seções empilhadas: cada uma fica presa e a próxima sobe por cima, a anterior recua.
// - Rolagem suave no mouse, título que sobe, ondas em movimento, mascote boiando.
// - Manifesto que acende palavra por palavra, ilustrações que se desenham com a rolagem.
// - Cardápio em livro: rolar para baixo vira a página, rolar para cima a página volta.
// - A casa em galeria horizontal de fotos reais com o sol se pondo ao fundo.
// Conteúdo vem de _build/content.js (o mesmo do Bronze). Fotos: as mesmas do Bronze.
const fs = require('fs');
const path = require('path');
const C = require('../_build/content');
const I = require('../_build/icons');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site-gold');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => `R$ ${n}`;
const img = (p) => `assets/img/${p}`;

// ilustração que se desenha com a rolagem: traços contínuos ganham pathLength, tracejados aparecem por opacidade
const drawable = (s) => s.replace(/<(path|ellipse|circle)(?![^>]*stroke-dasharray)(?![^>]*fill="currentColor")/g, '<$1 class="dr" pathLength="1"');

// links do WhatsApp com mensagem pronta
const wa = (msg) => `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(`${C.contato.mensagemPadrao} ${msg}`)}`;
const WA = {
  geral: wa('fazer um pedido.'),
  duvida: wa('tirar uma dúvida.'),
  reserva: wa('reservar uma mesa. Dia: , horário: , pessoas: .'),
  pedido: wa('fazer um pedido para retirada.'),
  plano: (p) => wa(`saber mais sobre: ${p}.`),
};

const end = C.endereco;
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

// ---------- peças ----------
// onda que se repete (largura dupla para correr sem emenda)
const ondaPath = (y, a, period) => {
  let d = `M0 ${y} Q${period / 4} ${y - a} ${period / 2} ${y}`;
  for (let x = period / 2; x < 2880; x += period / 2) d += ` T${x + period / 2} ${y}`;
  return `${d} V160 H0Z`;
};
const ondas = (cls) => `<div class="waves ${cls}" aria-hidden="true">
  <svg class="wv wv1" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="${ondaPath(70, 26, 720)}"/></svg>
  <svg class="wv wv2" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="${ondaPath(92, 20, 480)}"/></svg>
  <svg class="wv wv3" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="${ondaPath(112, 14, 960)}"/></svg>
</div>`;
const mais = `<svg class="mais" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>`;
// seta curva desenhada à mão (dica de rolagem)
const setaCurva = `<svg class="seta-curva" viewBox="0 0 40 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4c-14 10 8 22-4 36-3 4-6 8-6 16"/><path d="M5 48l7 9 8-8"/></svg>`;
const foto = (f, alt, w, h, cls = '', cap = '') => `<figure class="${cls}"><img src="${img(f + '.webp')}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;

// ---------- topo ----------
const header = `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="hdr" data-hdr data-tone="light">
  <div class="hdr-in">
    <a class="brand" href="#topo" aria-label="${esc(C.curto)}, início"><img src="${img('siri-na-lata.svg')}" alt="" width="30" height="49"><span>${esc(C.curto)}</span></a>
    <nav class="nav" aria-label="Principal">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
    <a class="btn btn-terra hdr-cta" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar mesa</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu" data-menu><span></span><span></span></button>
  </div>
</header>
<div class="mmenu" id="menu">
  <nav aria-label="Menu do celular">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <a class="btn btn-terra" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar pelo WhatsApp</a>
  <img class="mmenu-siri" src="${img('siri-na-lata.svg')}" alt="" width="120" height="194">
</div>`;

// ---------- seções ----------
const hero = `
<section class="panel hero" id="topo" data-panel data-tone="dark" aria-labelledby="hero-t">
  <div class="hero-bg" aria-hidden="true"><img src="${img('capa-praia.webp')}" alt="" width="1672" height="941" fetchpriority="high"></div>
  <div class="sol" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="hero-kick">Bar &amp; Restaurante no ${esc(end.bairro)}, ${esc(end.cidade)}</p>
      <h1 id="hero-t"><span class="ln"><span>${C.hero.titulo[0]}</span></span><span class="ln l2"><span>${C.hero.titulo[1]}</span></span></h1>
      <p class="hero-line">Petisco de mar com o <mark>pé na areia</mark>.</p>
      <p class="hero-txt">${esc(C.hero.texto)}</p>
      <div class="hero-cta">
        <a class="btn btn-sol" href="#cardapio">Folhear o cardápio${I.seta()}</a>
        <a class="btn btn-line-cream" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}${C.hero.ctaSecundario}</a>
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <figure class="polaroid hp"><img src="${img('casa-praia.webp')}" alt="" width="382" height="510"><figcaption>a mesa é na areia</figcaption></figure>
      <figure class="polaroid hp2"><img src="${img('casquinha-siri.webp')}" alt="" width="382" height="510"><figcaption>casquinha com vista</figcaption></figure>
    </div>
  </div>
  <div class="hero-info wrap">
    <p data-agora>${C.horarios.filter((h) => h.abre).map((h) => `<span><strong>${h.dias}</strong> ${horarioTxt(h)}</span>`).join('')}</p>
    <a href="${end.mapa}" target="_blank" rel="noopener">${I.pino()}${esc(end.rua)}, ${esc(end.bairro)}</a>
    <span class="role">Role devagar${setaCurva}</span>
  </div>
  ${ondas('w-hero')}
</section>`;

const palavras = C.boasVindas.texto.split(/\s+/);
const manifesto = `
<span class="anchor" id="boas-vindas"></span>
<section class="panel mani" data-panel data-tone="light" data-mani aria-labelledby="mani-t">
  <div class="pin">
    ${foto('casa-drink', 'Drink azul com rodela de laranja sobre a mesa, com a praia ao fundo', 287, 510, 'fl fl1', '')}
    ${foto('isca-peixe', 'Prato de iscas de peixe fritas e douradas com molho', 382, 510, 'fl fl2', '')}
    ${foto('camarao-milanesa', 'Camarão empanado com molho rosé e limão', 236, 510, 'fl fl3', '')}
    ${foto('casa-sequencia', 'Mesa servida com camarão, batata frita, arroz, pirão, salada e drinks', 382, 510, 'fl fl4', '')}
    <div class="mani-in">
      <h2 class="mani-k" id="mani-t">${esc(C.boasVindas.titulo)}</h2>
      <p class="mani-t" style="--n:${palavras.length}">${palavras.map((w, i) => `<span style="--i:${i}">${esc(w)}</span>`).join(' ')}</p>
      <p class="mani-sig">${esc(C.boasVindas.assinatura)}</p>
    </div>
  </div>
</section>`;

const D = C.destaques;
const assinatura = `
<span class="anchor" id="destaques"></span>
<section class="panel sig" data-panel data-tone="dark" aria-labelledby="sig-t">
  ${I.alga('alga a1')}
  <div class="wrap sig-row">
    <div class="sig-art">
      <div class="arch arch-b"><img src="${img('casquinha-siri.webp')}" alt="Siri desfiado gratinado servido na casquinha de barro com alface e limão, na mesa de frente para o mar" width="382" height="510" loading="lazy" decoding="async"></div>
      <div class="sig-draw" data-draw>${drawable(I.lataSiri('ill'))}</div>
    </div>
    <div class="sig-txt rv">
      <p class="kick">O prato que dá nome à casa</p>
      <h2 id="sig-t">${esc(D[0].titulo)}</h2>
      <p>${esc(D[0].texto)}</p>
      <a class="btn btn-cream" href="#cardapio">Ver no cardápio${I.seta()}</a>
    </div>
  </div>
  <div class="wrap sig-row rev">
    <div class="sig-art">
      <div class="arch arch-b"><img src="${img('camarao-fritas.webp')}" alt="Camarões empanados com batata frita e molho" width="287" height="510" loading="lazy" decoding="async"></div>
      <div class="sig-draw" data-draw>${drawable(I.porcao('ill'))}</div>
    </div>
    <div class="sig-txt rv">
      <p class="kick">Pede mais uma?</p>
      <h2>${esc(D[1].titulo)}</h2>
      <p>${esc(D[1].texto)}</p>
      <a class="btn btn-line-cream" href="${WA.pedido}" target="_blank" rel="noopener">${I.whatsapp()}Pedir para retirar</a>
    </div>
  </div>
</section>`;

// ---------- cardápio em livro ----------
// páginas em ordem de leitura. Em tela larga viram pares (esquerda e direita); no celular, uma por vez.
const cat = (id) => C.cardapio.find((c) => c.id === id);
const lista = (c) => `
  <header><h3 id="c-${c.id}">${esc(c.titulo)}</h3><p>${esc(c.nota)}</p></header>
  <ul>${c.itens.map((it) => `<li><div class="row"><b>${esc(it.nome)}</b><i></i><strong>${brl(it.preco)}</strong></div><small>${esc(it.desc)}${it.obs ? `, <em>${esc(it.obs)}</em>` : ''}${it.meia ? `. <em>Meia ${brl(it.meia)}</em>` : ''}</small></li>`).join('')}</ul>`;
const rodape = (t) => `<p class="pg-run">${esc(C.curto)}, ${t}</p>`;
const colada = (f, alt, w, h, cls, cap) => `<figure class="cola ${cls}"><img src="${img(f + '.webp')}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"><figcaption>${esc(cap)}</figcaption></figure>`;

const PAGINAS = [
  `<article class="pg pg-capa">
    <p class="pg-k">${esc(C.nome)}</p>
    <h3>Cardápio</h3>
    <p class="pg-sub">Tudo feito na hora, pensado para dividir com a mesa toda.</p>
    ${colada('casquinha-siri', 'Casquinha de siri com alface e limão', 382, 510, 'c1', 'casquinha de siri')}
    <img class="pg-siri" src="${img('siri-na-lata.svg')}" alt="" width="90" height="146" loading="lazy">
    ${rodape('frutos do mar')}
  </article>`,
  `<article class="pg pg-lista" aria-labelledby="c-mar">${lista(cat('mar'))}${rodape('petiscos')}</article>`,
  `<article class="pg pg-fotos" aria-label="Fotos dos pratos para dividir">
    ${colada('peixe-pirao', 'Peixe frito com panela de barro de pirão, arroz e salada na mesa da praia', 680, 382, 'c2', 'peixe frito com pirão')}
    <p class="pg-frase alt">Mesa de praia pede prato no meio e todo mundo se servindo.</p>
    ${colada('camarao-completo', 'Camarão frito com batata, arroz, pirão e salada servidos na mesa', 382, 510, 'c3', 'camarão completo')}
    ${rodape('para dividir')}
  </article>`,
  `<article class="pg pg-lista" aria-labelledby="c-pratos">${lista(cat('pratos'))}
    <p class="pg-nota">Os pratos chegam em panela de barro, direto para o meio da mesa.</p>${rodape('para dividir')}</article>`,
  `<article class="pg pg-fotos" aria-label="Fotos das porções">
    ${colada('isca-peixe', 'Iscas de peixe fritas e douradas com molho', 382, 510, 'c4', 'isca de peixe')}
    <p class="pg-frase alt">Crocante por fora, sequinho por dentro e quente até a última.</p>
    ${colada('camarao-milanesa', 'Camarão à milanesa com molho rosé', 236, 510, 'c5', 'camarão à milanesa')}
    ${rodape('porções')}
  </article>`,
  `<article class="pg pg-lista" aria-labelledby="c-salgados">${lista(cat('salgados'))}${rodape('porções')}</article>`,
  `<article class="pg pg-fotos" aria-label="Fotos das bebidas">
    ${colada('casa-drinks', 'Caipirinha e chope no balcão de madeira de frente para o mar', 287, 510, 'c6', 'caipirinha e chope')}
    <p class="pg-frase alt">Gelada no ponto e o mar fazendo a trilha sonora.</p>
    ${colada('casa-drink', 'Drink azul com rodela de laranja, com a praia ao fundo', 287, 510, 'c7', 'o drink do fim de tarde')}
    ${rodape('para beber')}
  </article>`,
  `<article class="pg pg-lista pg-fim" aria-labelledby="c-acomp">${lista(cat('acomp'))}
    <div class="pg-beber"><h4>Para beber</h4><p>${esc(C.bebidas)}</p></div>
    <a class="btn btn-terra btn-sm" href="${WA.pedido}" target="_blank" rel="noopener">${I.whatsapp()}Pedir para retirar</a>
    <p class="pg-aviso">${esc(C.avisoPrecos)}</p>
  </article>`,
];
const CAPITULOS = ['Petiscos do mar', 'Para dividir', 'Salgados e porções', 'Acompanhamentos e bebidas'];

const cardapio = `
<span class="anchor" id="cardapio"></span>
<section class="panel menu-p" data-panel data-tone="dark" data-book-sec aria-labelledby="menu-t">
  <div class="pin">
    <div class="wrap menu-top">
      <div>
        <h2 id="menu-t">O cardápio</h2>
        <p class="menu-dica">Desça para virar a página. Suba e ela volta.</p>
      </div>
      <nav class="caps" aria-label="Capítulos do cardápio">${CAPITULOS.map((c, i) => `<button type="button" data-cap="${i}"${i === 0 ? ' aria-current="true"' : ''}>${c}</button>`).join('')}</nav>
    </div>
    <div class="book" data-book>
      <div class="book-stage"></div>
      <div class="book-src">${PAGINAS.join('')}</div>
    </div>
  </div>
</section>`;

// ---------- a casa (galeria horizontal) ----------
const S = C.sobre;
const pol = (f, alt, w, h, cap, cls) => `<figure class="polaroid gp ${cls}"><img src="${img(f + '.webp')}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"><figcaption>${esc(cap)}</figcaption></figure>`;
const aCasa = `
<span class="anchor" id="a-casa"></span>
<section class="panel casa" data-panel data-tone="light" data-gal aria-labelledby="casa-t">
  <div class="pin">
    <div class="sol sol-casa" aria-hidden="true"></div>
    <div class="gal-track">
      <div class="gal-txt gal-intro">
        <p class="kick">${esc(S.titulo)}</p>
        <h2 id="casa-t">${esc(S.subtitulo)}</h2>
        <p>${esc(S.paragrafos[0])}</p>
      </div>
      ${pol('casa-praia', 'Mesas do Siri na Lata na areia, à sombra das árvores, de frente para o mar', 382, 510, 'mesa na areia, sombra de árvore', 'g1')}
      ${pol('casa-drinks', 'Caipirinha e chope no balcão de madeira de frente para o mar', 287, 510, 'o balcão de frente para o mar', 'g2')}
      ${pol('peixe-pirao', 'Peixe frito com panela de barro de pirão, arroz e salada na mesa da praia', 680, 382, 'pirão na panela de barro', 'g3 wide')}
      <div class="gal-txt gal-mid"><p>${esc(S.paragrafos[1])}</p></div>
      ${pol('casa-drink', 'Drink azul com rodela de laranja sobre a mesa, com a praia ao fundo', 287, 510, 'cor de fim de tarde', 'g4')}
      ${pol('camarao-completo', 'Camarão frito com batata, arroz, pirão e salada servidos na mesa', 382, 510, 'camarão completo', 'g5')}
      <div class="gal-selo">
        <img src="${img('siri-na-lata.svg')}" alt="" width="110" height="178" loading="lazy">
        <h3>${esc(S.selo.titulo)}</h3>
        <p>${esc(S.selo.texto)}</p>
      </div>
      ${pol('casa-sequencia', 'Mesa servida com camarão, batata frita, arroz, pirão, salada e drinks', 382, 510, 'mesa cheia, conversa boa', 'g6')}
      <div class="gal-txt gal-fim">
        <p>${esc(S.paragrafos[2])}</p>
        <a class="btn btn-ink" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Guardar minha mesa</a>
      </div>
    </div>
    <p class="gal-hint" aria-hidden="true">continue rolando</p>
    ${ondas('w-casa')}
  </div>
</section>`;

// ---------- reservas ----------
const P = C.planos;
const reservas = `
<span class="anchor" id="reservas"></span>
<section class="panel res" data-panel data-tone="dark" aria-labelledby="res-t">
  <img class="res-bg" src="${img('faixa-reserva.webp')}" alt="" width="1920" height="1000" loading="lazy" decoding="async">
  <div class="wrap res-in">
    <div class="res-head rv">
      <h2 id="res-t">${esc(P.titulo)}</h2>
      <p>${esc(P.texto)}</p>
      <p class="pag"><strong>Pagamento</strong> ${P.pagamento.join(', ')}. ${esc(P.taxaServico)}</p>
    </div>
    <div class="res-list rv">
      ${P.opcoes.map((o) => `<details class="fmt" name="formato"${o.destaque ? ' open' : ''}>
        <summary><span class="f-nome">${esc(o.nome)}</span><span class="f-para">${esc(o.para)}</span><span class="f-valor">${esc(o.valor)}</span>${mais}</summary>
        <div class="f-body">
          <ul>${o.condicoes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
          <a class="btn ${o.destaque ? 'btn-terra' : 'btn-line-cream'}" href="${WA.plano(o.nome)}" target="_blank" rel="noopener">${I.whatsapp()}Combinar pelo WhatsApp</a>
        </div>
      </details>`).join('')}
    </div>
  </div>
</section>`;

const faq = `
<span class="anchor" id="duvidas"></span>
<section class="panel faq-p" data-panel data-tone="light" aria-labelledby="faq-t">
  ${I.alga('alga a2')}
  <div class="wrap faq-in">
    <div class="side rv">
      <h2 id="faq-t">Perguntas que a gente ouve na mesa</h2>
      <p>Não achou a sua? Chama no WhatsApp que a resposta vem rapidinho.</p>
      <a class="btn btn-ink" href="${WA.duvida}" target="_blank" rel="noopener">${I.whatsapp()}Falar com a gente</a>
    </div>
    <div class="faq rv">
      ${C.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.p)}${mais}</summary><div class="faq-r"><p>${esc(f.r)}</p></div></details>`).join('')}
    </div>
  </div>
</section>`;

const visite = `
<span class="anchor" id="visite"></span>
<section class="panel vis" data-panel data-tone="light" aria-labelledby="vis-t">
  <div class="sol sol-vis" aria-hidden="true"></div>
  <div class="wrap vis-in">
    <div class="vis-txt rv">
      <p class="kick">O pôr do sol está guardado</p>
      <h2 id="vis-t">Venha sentar na areia com a gente</h2>
      <address>${esc(end.rua)}<br>${esc(end.bairro)}, ${esc(end.cidade)}, ${end.uf}</address>
      <p class="ref">${esc(end.referencia)}</p>
      <div class="acoes">
        <a class="btn btn-ink" href="${end.mapa}" target="_blank" rel="noopener">${I.pino()}Como chegar</a>
        <a class="btn btn-terra" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar mesa</a>
      </div>
    </div>
    <div class="horas rv">
      <h3>Horário</h3>
      <p class="agora-vis" data-agora-vis></p>
      <table><tbody>${C.horarios.map((h) => `<tr data-dias="${h.d.join(',')}"><td>${h.dias}</td><td${h.abre ? '' : ' class="fechado"'}>${horarioTxt(h)}</td></tr>`).join('')}</tbody></table>
    </div>
  </div>
  ${ondas('w-vis')}
</section>`;

const ano = new Date().getFullYear();
const footer = `
<footer class="ftr" data-ftr>
  <div class="wrap">
    <div class="ftr-mapa">
      <div class="mapa" data-mapa data-src="https://www.google.com/maps?q=${encodeURIComponent(`${end.rua}, ${end.bairro}, ${end.cidade}, ${end.uf}`)}&amp;z=16&amp;output=embed">
        <noscript><iframe title="Mapa: ${esc(end.rua)}, ${esc(end.bairro)}" src="https://www.google.com/maps?q=${encodeURIComponent(`${end.rua}, ${end.bairro}, ${end.cidade}, ${end.uf}`)}&amp;z=16&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></noscript>
      </div>
      <div class="mapa-card">
        <p class="kick">Onde a gente está</p>
        <h3>${esc(end.rua)}</h3>
        <p>${esc(end.bairro)}, ${esc(end.cidade)}, ${end.uf}. ${esc(end.referencia)}</p>
        <div class="acoes">
          <a class="btn btn-sol" href="${end.mapa}" target="_blank" rel="noopener">${I.pino()}Traçar rota</a>
          <a class="btn btn-line-cream" href="${WA.reserva}" target="_blank" rel="noopener">${I.whatsapp()}Reservar mesa</a>
        </div>
      </div>
    </div>
    <div class="ftr-grid">
      <div>
        <a class="brand" href="#topo"><img src="${img('siri-na-lata.svg')}" alt="" width="40" height="65" loading="lazy"><span>${esc(C.curto)}</span></a>
        <p>Petisco bom é petisco dividido. Frutos do mar, porções e cerveja gelada com o pé na areia.</p>
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
        <div class="redes">
          <a href="${C.contato.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${esc(C.contato.instagramUser)}">${I.instagram()}</a>
          <a href="${WA.geral}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp()}</a>
          ${C.contato.facebook ? `<a href="${C.contato.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook()}</a>` : ''}
        </div>
      </div>
    </div>
    <p class="ftr-marca" aria-hidden="true"><span class="m-linha">Siri na Lata</span><span class="m-cheio">Siri na Lata</span></p>
    <div class="ftr-bot"><span>&copy; ${ano} ${esc(C.nome)}</span><a href="${C.contato.instagram}" target="_blank" rel="noopener">${esc(C.contato.instagramUser)}</a></div>
  </div>
</footer>
<a class="wa-float" href="${WA.geral}" target="_blank" rel="noopener" aria-label="Pedir pelo WhatsApp">
  <svg class="wa-anel" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="wa-c" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0"/></defs><text><textPath href="#wa-c" textLength="292" lengthAdjust="spacing">bateu a fome?&#160;o siri sai quentinho,&#160;pede agora&#160;&#160;&#160;</textPath></text></svg>
  <span class="wa-bola">${I.whatsapp()}</span>
  <span class="wa-dica" aria-hidden="true">Sai quentinho, pede agora</span>
</a>`;

const horariosJs = JSON.stringify(C.horarios.map((h) => ({ d: h.d, a: h.abre, f: h.fecha })));

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(C.seo.titulo)}</title>
<meta name="description" content="${esc(C.seo.descricao)}">
<link rel="canonical" href="${C.dominio}/">
<meta name="theme-color" content="#F4EFE1">
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
<link rel="preload" as="image" href="${img('capa-praia.webp')}" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Gloock&family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400&display=swap">
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="assets/gold.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(faqld)}</script>
</head>
<body>
${header}
<main id="conteudo" class="stack">
${hero}
${manifesto}
${assinatura}
${cardapio}
${aCasa}
${reservas}
${faq}
${visite}
</main>
${footer}
<script>window.SNL_HORARIOS=${horariosJs}</script>
<script src="assets/gold.js" defer></script>
</body>
</html>
`;

// ---------- saída ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'gold.css'), path.join(OUT, 'assets/gold.css'));
fs.copyFileSync(path.join(__dirname, 'gold.js'), path.join(OUT, 'assets/gold.js'));

// mesmas fotos do Bronze
const IMGS = ['capa-praia.webp', 'faixa-reserva.webp', 'casa-drinks.webp', 'casa-praia.webp', 'casa-drink.webp', 'casa-sequencia.webp', 'og.jpg', ...C.cardapioFotos.map((f) => f.foto + '.webp')];
IMGS.forEach((f) => fs.copyFileSync(path.join(ROOT, '_build/img', f), path.join(OUT, 'assets/img', f)));
[['siri-na-lata.svg', 'siri-na-lata.svg'], ['favicon.png', 'favicon.png'], ['apple-touch-icon.png', 'apple-touch-icon.png']]
  .forEach(([a, b]) => fs.copyFileSync(path.join(ROOT, 'marca', a), path.join(OUT, 'assets/img', b)));

fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${C.dominio}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.htaccess'), `# Cache e compressão (Apache)\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n  ExpiresByType text/html "access plus 0 seconds"\n</IfModule>\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain\n</IfModule>\n`);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';
console.log('site-gold gerado:', kb(path.join(OUT, 'index.html')), 'HTML,', kb(path.join(OUT, 'assets/gold.css')), 'CSS,', kb(path.join(OUT, 'assets/gold.js')), 'JS');
