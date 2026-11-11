// Gera o modelo SILVER do Siri na Lata (nicho restaurante e lanchonete).
//   node clientes/siri-na-lata/_build-silver/build.js   → site-silver/
//
// Silver: mesma base do Bronze (uma página, conteúdo do _build/content.js), com experiência mais sofisticada:
// capa em cartão-postal com a cena da Baía desenhada e animada, pilha de fotos que gira, faixa corrida,
// "um dia na casa" com o sol que anda conforme a rolagem, carrossel dos mais pedidos, cardápio em abas
// com pedido montado no site e enviado pelo WhatsApp, reserva guiada, perguntas animadas e mapa no rodapé.
const fs = require('fs');
const path = require('path');
const C = require('../_build/content');
const I = require('../_build/icons');
const { css } = require('./style');
const { js } = require('./script');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site-silver');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => `R$ ${n}`;
const img = (p) => `assets/img/${p}`;

const wa = (msg) => `https://wa.me/${C.contato.whatsapp}?text=${encodeURIComponent(`${C.contato.mensagemPadrao} ${msg}`)}`;
const WA = {
  geral: wa('fazer um pedido.'),
  duvida: wa('tirar uma dúvida.'),
  reserva: wa('reservar uma mesa.'),
};

const end = C.endereco;
const hora = (h) => h.replace(':00', 'h').replace(':', 'h');
const horarioTxt = (h) => (h.abre ? `${hora(h.abre)} às ${hora(h.fecha)}` : 'Fechado');
const enderecoQ = encodeURIComponent(`${end.rua}, ${end.bairro}, ${end.cidade} ${end.uf}`);
const rotaLink = `https://www.google.com/maps/dir/?api=1&destination=${enderecoQ}`;

const NAV = [
  ['#o-dia', 'A casa'],
  ['#cardapio', 'Cardápio'],
  ['#reservas', 'Reservas'],
  ['#duvidas', 'Dúvidas'],
  ['#visite', 'Como chegar'],
];

// itens do cardápio com id estável (categoria-posição), usados pela sacola de pedido
const ITENS = [];
C.cardapio.forEach((c) => c.itens.forEach((it, i) => ITENS.push({ ...it, id: `${c.id}-${i}`, cat: c.id })));
const porNome = (n) => ITENS.find((it) => it.nome.toLowerCase() === n.toLowerCase());

// ---------- dados estruturados ----------
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
  geo: { '@type': 'GeoCoordinates', latitude: -27.5779, longitude: -48.5817 },
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: C.cardapio.map((c) => ({
      '@type': 'MenuSection', name: c.titulo,
      hasMenuItem: c.itens.map((it) => ({ '@type': 'MenuItem', name: it.nome, description: it.desc, offers: { '@type': 'Offer', price: it.preco, priceCurrency: 'BRL' } })),
    })),
  },
  acceptsReservations: true,
  sameAs: [C.contato.instagram, C.contato.facebook].filter(Boolean),
  openingHoursSpecification: C.horarios.filter((h) => h.abre).map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.d.map((d) => DIAS[d]), opens: h.abre, closes: h.fecha })),
};
const faqld = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: C.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
};

// ---------- cena da Baía (SVG próprio) ----------
// linha de onda contínua, período de 240 unidades, para rolar sem emenda
const ondaLinha = (y, amp, w = 2880) => {
  let d = `M0 ${y}`;
  for (let x = 0; x < w; x += 240) d += ` q60 ${-amp} 120 0 t120 0`;
  return d;
};
// Ponte Hercílio Luz em traço: torres, corrente pênsil que desce até o tabuleiro e pendurais
const ponte = (() => {
  const yD = 556, tA = 690, tB = 810, top = 480, aL = 612, aR = 888;
  const cabo = `M${aL} ${yD} L${tA} ${top} Q${(tA + tB) / 2} 628 ${tB} ${top} L${aR} ${yD}`;
  const yQ = (x) => { const t = (x - tA) / (tB - tA); return (1 - t) * (1 - t) * top + 2 * (1 - t) * t * 628 + t * t * top; };
  const pend = [];
  for (let x = tA + 8; x < tB - 4; x += 8) { const y = yQ(x); if (yD - y > 4) pend.push(`M${x} ${y.toFixed(1)}V${yD}`); }
  for (let x = aL + 9; x < tA; x += 9) { const y = yD - (x - aL) * (yD - top) / (tA - aL); pend.push(`M${x} ${y.toFixed(1)}V${yD}`); }
  for (let x = tB + 9; x < aR; x += 9) { const y = top + (x - tB) * (yD - top) / (aR - tB); pend.push(`M${x} ${y.toFixed(1)}V${yD}`); }
  const torre = (x) => `M${x - 5} ${yD + 18}L${x - 3} ${top - 4}M${x + 5} ${yD + 18}L${x + 3} ${top - 4}M${x - 4} ${top + 14}H${x + 4}M${x - 4} ${top + 40}H${x + 4}M${x - 5} ${top + 64}H${x + 5}M${x - 3} ${top - 4}H${x + 3}`;
  return `<g class="ponte">
    <path class="pend" d="${pend.join('')}"/>
    <path d="${cabo}"/>
    <path d="${torre(tA)}${torre(tB)}"/>
    <path d="M590 ${yD}H910M590 ${yD + 4}H910"/>
    <path d="M604 ${yD + 4}V573M896 ${yD + 4}V573"/>
  </g>`;
})();

const cena = `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="g-sol" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#F3B48C"/><stop offset=".6" stop-color="#E07B52"/><stop offset="1" stop-color="#CA603C"/></radialGradient>
    <linearGradient id="g-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0C7A9"/><stop offset=".45" stop-color="#E8AE8A"/><stop offset="1" stop-color="#D98F69"/></linearGradient>
    <linearGradient id="g-morro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7B394"/><stop offset="1" stop-color="#EFC6AA"/></linearGradient>
  </defs>
  <g class="aves"><path d="M560 200q10-10 20 0q10-10 20 0"/><path d="M612 228q7-7 14 0q7-7 14 0"/><path d="M660 186q6-6 12 0q6-6 12 0"/></g>
  <g data-par="0.18"><circle class="sol" cx="750" cy="566" r="82" fill="url(#g-sol)"/></g>
  <path class="morro" fill="url(#g-morro)" d="M470 576C540 548 590 506 660 512C716 517 740 470 808 458C880 446 930 496 990 488C1060 478 1100 420 1186 428C1270 436 1330 494 1440 492V576Z"/>
  ${ponte}
  <rect y="572" width="1440" height="330" fill="url(#g-mar)"/>
  <g class="reflexo">${[[750, 594, 120], [750, 614, 92], [750, 638, 66], [750, 664, 44], [750, 694, 28], [750, 728, 16]].map(([x, y, w], i) => `<path style="--i:${i}" d="M${x - w / 2} ${y}H${x + w / 2}"/>`).join('')}</g>
  <g class="barco"><path d="M0 0h46l-8 9H8z"/><path d="M24 0V-44L44 -4z"/><path d="M21 -4V-34L6 -4z"/></g>
  <g class="ondas">
    <path class="o1" d="${ondaLinha(604, 4)}"/>
    <path class="o2" d="${ondaLinha(640, 6)}"/>
    <path class="o3" d="${ondaLinha(688, 8)}"/>
    <path class="o4" d="${ondaLinha(748, 10)}"/>
  </g>
  <path class="areia" d="M0 812C240 774 520 800 760 790C1010 780 1220 808 1440 786V900H0Z"/>
</svg>`;

// carimbo postal (texto em círculo)
const carimbo = (id, texto, cls) => `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <defs><path id="${id}" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0"/></defs>
  <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <text><textPath href="#${id}" startOffset="0">${texto}</textPath></text>
</svg>`;

// ---------- blocos ----------
const intro = `
<div class="intro" data-intro aria-hidden="true">
  <div class="intro-in">
    <img src="${img('siri-na-lata.svg')}" alt="" width="120" height="194">
    <p>Siri na Lata</p>
    <span>Balneário Estreito, Florianópolis</span>
  </div>
  <svg class="intro-onda" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 0H1440V44C1260 90 1080 6 900 40S540 92 360 50 120 20 0 52Z"/></svg>
</div>`;

const header = `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr-in">
    <a class="brand" href="#topo" aria-label="${esc(C.curto)}, início"><img src="${img('siri-na-lata.svg')}" alt="" width="30" height="49"><span>Siri <em>na Lata</em></span></a>
    <nav class="nav" id="nav" aria-label="Principal">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
    <a class="btn btn-terra hdr-cta" href="#reservas">Reservar mesa</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu" data-menu>${I.menu('ic i-open')}${I.fechar('ic i-close')}</button>
  </div>
  <div class="trilha" aria-hidden="true"><span class="trilha-fio"></span><span class="trilha-siri" data-siri>${I.siriAndando()}</span></div>
</header>`;

const K = C.capa;
const capa = `
<section class="capa" id="topo" aria-labelledby="capa-t">
  <div class="cena">${cena}</div>
  <div class="wrap capa-in">
    <div class="capa-txt">
      <p class="capa-local ent" style="--d:0">Pé na areia no Balneário Estreito</p>
      <h1 id="capa-t"><span class="ent" style="--d:1">Siri</span> <em class="ent" style="--d:2">na Lata</em><span class="sr"> Bar &amp; Restaurante em Florianópolis</span></h1>
      <p class="capa-linha ent" style="--d:3">${esc(K.linha)}</p>
      <p class="capa-texto ent" style="--d:4">${esc(K.texto)}</p>
      <div class="capa-cta ent" style="--d:5">
        <a class="btn btn-terra" href="#cardapio">Ver o cardápio${I.seta()}</a>
        <a class="btn btn-linha" href="#reservas">Reservar mesa na areia</a>
      </div>
      <p class="capa-status ent" style="--d:6" data-agora></p>
    </div>
    <div class="postais ent" style="--d:3" data-postais role="region" aria-roledescription="carrossel" aria-label="Fotos do Siri na Lata">
      <ul class="postais-pilha">
        ${K.cartoes.map((c, i) => `<li class="postal" data-pos="${i}" aria-hidden="${i ? 'true' : 'false'}"><figure><img src="${img(c.foto + '.webp')}" alt="${esc(c.alt)}" width="382" height="510"${i ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"><figcaption>${esc(c.legenda)}</figcaption></figure></li>`).join('')}
      </ul>
      ${carimbo('cp-capa', 'SIRI NA LATA   ESTREITO   FLORIANÓPOLIS   SC   ', 'carimbo')}
      <div class="postais-ctl">
        <button type="button" data-prev aria-label="Foto anterior">${I.voltar()}</button>
        <button type="button" data-next aria-label="Próxima foto">${I.seta()}</button>
      </div>
    </div>
  </div>
</section>`;

const faixaItens = C.faixa.map((w) => `<span>${esc(w)}</span>${I.onda('sep')}`).join('');
const faixa = `
<div class="faixa" aria-hidden="true">
  <div class="faixa-trilho"><div>${faixaItens}</div><div>${faixaItens}</div></div>
</div>`;

const siriItem = porNome('Siri na lata');
const estrela = `
<section class="sec estrela" aria-labelledby="estrela-t">
  ${I.alga('alga tr')}
  <div class="wrap">
    <div class="estrela-row">
      <div class="estrela-ill draw">${I.lataSiri('ill')}</div>
      <div class="estrela-txt rv">
        <p class="apoio">A estrela da casa</p>
        <h2 id="estrela-t">${esc(C.destaques[0].titulo)}</h2>
        <p>${esc(C.destaques[0].texto)}</p>
        <div class="preco-grande"><strong>${brl(siriItem.preco)}</strong><span>${esc(C.cardapio.find((c) => c.id === siriItem.cat).nota)}, com torradas</span></div>
        <button class="btn btn-tinta" type="button" data-add="${siriItem.id}">${I.mais()}Colocar no pedido</button>
      </div>
    </div>
    <div class="estrela-row inv">
      <div class="estrela-ill draw">${I.porcao('ill')}</div>
      <div class="estrela-txt rv">
        <p class="apoio">Para a turma toda</p>
        <h2>${esc(C.destaques[1].titulo)}</h2>
        <p>${esc(C.destaques[1].texto)}</p>
        <a class="btn btn-linha-escura" href="#cardapio">Ver as porções${I.seta()}</a>
      </div>
    </div>
  </div>
</section>`;

const M = C.momentos;
const dia = `
<section class="dia" id="o-dia" data-dia aria-labelledby="dia-t">
  <div class="dia-pin">
    <div class="dia-ceu" aria-hidden="true">
      <i class="ceu c-tarde"></i><i class="ceu c-noite"></i>
      <span class="estrelas"></span>
      <svg class="arco" viewBox="0 0 1000 400" preserveAspectRatio="none"><path d="M40 380C200 30 800 30 960 380" vector-effect="non-scaling-stroke"/></svg>
      <span class="astro" data-astro></span>
      <span class="lua"></span>
      <svg class="dia-mar" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="${ondaLinha(30, 8, 1440)}V120H0Z"/></svg>
    </div>
    <div class="wrap dia-in">
      <div class="dia-head">
        <p class="apoio">Um dia no Siri na Lata</p>
        <h2 id="dia-t">Do almoço ao pôr do sol</h2>
      </div>
      <div class="dia-fotos">
        ${M.map((m, i) => `<figure class="dia-foto${i ? '' : ' on'}" data-m="${i}"><img src="${img(m.foto + '.webp')}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async"></figure>`).join('')}
      </div>
      <div class="dia-txts">
        ${M.map((m, i) => `<article class="dia-txt${i ? '' : ' on'}" data-m="${i}"><p class="hora">${esc(m.hora)}</p><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p></article>`).join('')}
      </div>
      <div class="dia-linha" aria-hidden="true">
        <span class="dia-barra"><i data-dia-barra></i></span>
        ${M.map((m, i) => `<button type="button" tabindex="-1" data-ir="${i}"${i ? '' : ' class="on"'}>${esc(m.titulo)}</button>`).join('')}
      </div>
    </div>
  </div>
</section>`;

const prato = (f) => {
  const it = porNome(f.nome);
  return `<li class="prato">
    <figure><img src="${img(f.foto + '.webp')}" alt="${esc(f.alt)}" width="382" height="510" loading="lazy" decoding="async"></figure>
    <div class="prato-txt">
      <h3>${esc(f.nome)}</h3>
      ${it ? `<p>${esc(it.desc)}${it.obs ? `, ${esc(it.obs)}` : ''}</p>
      <div class="prato-pe"><strong>${brl(it.preco)}</strong><button type="button" class="add-mini" data-add="${it.id}" aria-label="Colocar ${esc(f.nome)} no pedido">${I.mais()}</button></div>` : ''}
    </div>
  </li>`;
};

const itemRow = (it) => `<li class="item" data-item="${it.id}">
  <div class="item-txt"><b>${esc(it.nome)}</b><small>${esc(it.desc)}${it.obs ? `. <em>${esc(it.obs)}</em>` : ''}${it.meia ? `. <em>Meia porção ${brl(it.meia)}</em>` : ''}</small></div>
  <strong class="item-preco">${brl(it.preco)}</strong>
  <div class="qtd" data-qtd="${it.id}">
    <button type="button" class="q-add" data-add="${it.id}" aria-label="Colocar ${esc(it.nome)} no pedido">${I.mais()}</button>
    <span class="q-step"><button type="button" data-sub="${it.id}" aria-label="Tirar um ${esc(it.nome)}">${I.menos()}</button><output aria-live="polite">0</output><button type="button" data-add="${it.id}" aria-label="Mais um ${esc(it.nome)}">${I.mais()}</button></span>
  </div>
</li>`;

const cardapio = `
<section class="sec cardapio" id="cardapio" aria-labelledby="card-t">
  <div class="wrap card-head">
    <div class="rv">
      <p class="apoio">Cardápio</p>
      <h2 id="card-t">Os mais pedidos da casa</h2>
    </div>
    <div class="trilho-ctl rv">
      <p>Arraste para ver, toque no + para montar o seu pedido.</p>
      <div><button type="button" data-tr-prev aria-label="Pratos anteriores">${I.voltar()}</button><button type="button" data-tr-next aria-label="Próximos pratos">${I.seta()}</button></div>
    </div>
  </div>
  <div class="trilho" data-trilho tabindex="0" aria-label="Fotos dos pratos mais pedidos">
    <ul>${C.cardapioFotos.map(prato).join('')}</ul>
  </div>
  <div class="wrap"><div class="trilho-prog" aria-hidden="true"><i data-tr-prog></i></div></div>

  <div class="wrap">
    <div class="menu-head rv">
      <h2>O cardápio completo</h2>
      <p>Tudo feito na hora. Monte o pedido aqui e mande pelo WhatsApp para retirar no balcão, ou peça direto na mesa.</p>
    </div>
    <div class="abas" role="tablist" aria-label="Seções do cardápio">
      ${C.cardapio.map((c, i) => `<button type="button" role="tab" id="aba-${c.id}" aria-controls="pn-${c.id}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''}>${esc(c.titulo)}</button>`).join('')}
      <span class="abas-marca" aria-hidden="true"></span>
    </div>
    ${C.cardapio.map((c, i) => `<div class="painel" role="tabpanel" id="pn-${c.id}" aria-labelledby="aba-${c.id}"${i ? ' hidden' : ''}>
      <p class="nota">${I.onda()}${esc(c.nota)}</p>
      <ul class="itens">${ITENS.filter((it) => it.cat === c.id).map(itemRow).join('')}</ul>
    </div>`).join('')}
    <div class="bebidas rv">
      <h3>Para beber</h3>
      <p>${esc(C.bebidas)}</p>
    </div>
    <p class="aviso">${esc(C.avisoPrecos)}</p>
  </div>
</section>`;

const S = C.sobre;
const casa = `
<section class="sec casa" id="a-casa" aria-labelledby="casa-t">
  <div class="wrap casa-in">
    <div class="casa-txt rv">
      <p class="apoio">${esc(S.titulo)}</p>
      <h2 id="casa-t">${esc(S.subtitulo)}</h2>
      ${S.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
      <blockquote><p>${esc(C.boasVindas.texto.split('. ').slice(0, 2).join('. ').replace(/\.$/, ''))}.</p><cite>${esc(C.boasVindas.assinatura)}</cite></blockquote>
    </div>
    <div class="casa-fotos">
      <figure class="cf cf1" data-par="-0.06"><img src="${img('casa-praia.webp')}" alt="Mesas do Siri na Lata na areia, à sombra das árvores, de frente para o mar" width="382" height="510" loading="lazy" decoding="async"></figure>
      <figure class="cf cf2" data-par="0.08"><img src="${img('casa-drink.webp')}" alt="Drink com rodela de laranja sobre a mesa, com a praia ao fundo" width="287" height="510" loading="lazy" decoding="async"></figure>
      <figure class="cf cf3" data-par="-0.12"><img src="${img('camarao-completo.webp')}" alt="Camarão frito com batata, arroz, pirão e salada servidos na mesa" width="382" height="510" loading="lazy" decoding="async"></figure>
      <div class="selo-gira" data-par="0.14">
        ${carimbo('cp-selo', 'COMIDA DI BUTECO 2026   COMIDA DI BUTECO 2026   ', 'selo-txt')}
        <img src="${img('siri-na-lata.svg')}" alt="" width="58" height="94" loading="lazy">
      </div>
    </div>
  </div>
  <div class="wrap">
    <div class="selo-nota rv"><h3>${esc(S.selo.titulo)}</h3><p>${esc(S.selo.texto)}</p></div>
  </div>
</section>`;

const P = C.planos;
const fmtDefault = { 'Mesa reservada': 4, 'Aniversário': 15, 'Evento fechado': 30 };
const reservas = `
<section class="reserva" id="reservas" aria-labelledby="res-t">
  <img class="reserva-bg" src="${img('faixa-reserva.webp')}" alt="" width="1920" height="1000" loading="lazy" decoding="async">
  <svg class="onda-topo" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H1440V30C1200 70 980 10 720 34S240 70 0 28Z"/></svg>
  <div class="wrap reserva-in">
    <div class="reserva-txt rv">
      <p class="apoio">Reservas e eventos</p>
      <h2 id="res-t">Guarde a sua mesa na areia</h2>
      <p>${esc(P.texto)}</p>
      <div class="formatos" role="radiogroup" aria-label="Tipo de reserva">
        ${P.opcoes.map((o, i) => `<label class="formato">
          <input type="radio" name="formato" form="f-reserva" value="${esc(o.nome)}" data-pessoas="${fmtDefault[o.nome] || 4}"${i === 0 ? ' checked' : ''}>
          <span class="f-nome">${esc(o.nome)}</span><span class="f-para">${esc(o.para)}</span><span class="f-valor">${esc(o.valor)}</span>
        </label>`).join('')}
      </div>
      ${P.opcoes.map((o, i) => `<ul class="condicoes" data-cond="${esc(o.nome)}"${i ? ' hidden' : ''}>${o.condicoes.map((c) => `<li>${I.onda()}<span>${esc(c)}</span></li>`).join('')}</ul>`).join('')}
    </div>
    <form class="reserva-form rv" id="f-reserva" data-reserva novalidate>
      <h3>Pedido de reserva</h3>
      <div class="campo"><label for="r-nome">Seu nome</label><input id="r-nome" name="nome" type="text" autocomplete="name" required placeholder="Como devemos te chamar"></div>
      <div class="campos2">
        <div class="campo"><label for="r-dia">Dia</label><input id="r-dia" name="dia" type="date" required></div>
        <div class="campo"><label for="r-hora">Horário</label><select id="r-hora" name="hora" required></select></div>
      </div>
      <p class="campo-aviso" data-dia-aviso hidden></p>
      <div class="campo">
        <span class="rot" id="r-pes-rot">Pessoas</span>
        <div class="stepper" role="group" aria-labelledby="r-pes-rot">
          <button type="button" data-pes="-1" aria-label="Menos uma pessoa">${I.menos()}</button>
          <input id="r-pes" name="pessoas" type="number" inputmode="numeric" min="1" max="200" value="4" aria-labelledby="r-pes-rot">
          <button type="button" data-pes="1" aria-label="Mais uma pessoa">${I.mais()}</button>
        </div>
      </div>
      <div class="campo"><label for="r-obs">Observação <small>(opcional)</small></label><textarea id="r-obs" name="obs" rows="2" placeholder="Ex.: mesa na sombra, cadeirinha de bebê, bolo de aniversário"></textarea></div>
      <button class="btn btn-terra btn-cheio" type="submit">${I.whatsapp()}Enviar pedido pelo WhatsApp</button>
      <p class="form-nota">A reserva é confirmada pela nossa equipe na conversa do WhatsApp.</p>
    </form>
  </div>
  <div class="wrap"><p class="pagamento"><span><strong>Pagamento:</strong> ${P.pagamento.join(', ')}.</span><span>${esc(P.taxaServico)}</span></p></div>
</section>`;

const faq = `
<section class="sec duvidas" id="duvidas" aria-labelledby="faq-t">
  <div class="wrap faq-in">
    <div class="side rv">
      <p class="apoio">Perguntas frequentes</p>
      <h2 id="faq-t">Antes de vir para a areia</h2>
      <p>Não achou o que procurava? Chama a gente no WhatsApp que a resposta vem rapidinho.</p>
      <a class="btn btn-tinta" href="${WA.duvida}" target="_blank" rel="noopener">${I.whatsapp()}Falar com a gente</a>
    </div>
    <div class="faq rv" data-faq>
      ${C.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.p)}${I.mais('ic')}</summary><div class="faq-r"><p>${esc(f.r)}</p></div></details>`).join('')}
    </div>
  </div>
</section>`;

const ano = new Date().getFullYear();
const abertoResumo = C.horarios.filter((h) => h.abre).map((h) => `${h.dias}, ${horarioTxt(h)}`).join('. ');
const footer = `
<footer class="ftr" id="visite">
  <svg class="onda-topo" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H1440V36C1180 72 960 8 700 36S220 66 0 30Z"/></svg>
  <div class="wrap visite">
    <div class="visite-txt rv">
      <p class="apoio">Como chegar</p>
      <h2>Pé na areia, no Balneário Estreito</h2>
      <address>${esc(end.rua)}<br>${esc(end.bairro)}, ${esc(end.cidade)}, ${end.uf}</address>
      <p class="ref">${esc(end.referencia)}</p>
      <table class="horas"><caption class="sr">Horário de funcionamento</caption><tbody>${C.horarios.map((h) => `<tr data-dias="${h.d.join(',')}"><th scope="row">${h.dias}</th><td${h.abre ? '' : ' class="fechado"'}>${horarioTxt(h)}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="mapc rv">
      <img class="map-img" src="${img('mapa-siri.webp')}" alt="Mapa do Balneário Estreito, em Florianópolis, com a localização do Siri na Lata na ponta da Rua São José, de frente para o mar" width="1240" height="760" loading="lazy" decoding="async">
      <span class="map-pin" aria-hidden="true"><b>Siri na Lata</b></span>
      <span class="map-attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      <div class="map-info"><b>${esc(C.curto)}</b><span>${esc(end.rua)}, ${esc(end.bairro)}</span><span>${esc(abertoResumo)}</span>
        <div class="mbtns"><a href="${end.mapa}" target="_blank" rel="noopener">${I.pino()}Abrir no Maps</a><a class="sq" href="${rotaLink}" target="_blank" rel="noopener" aria-label="Traçar rota até o Siri na Lata">${I.rota()}</a></div>
      </div>
    </div>
  </div>
  <div class="wrap">
    <div class="ftr-grid">
      <div>
        <a class="brand" href="#topo"><img src="${img('siri-na-lata.svg')}" alt="" width="44" height="71" loading="lazy"><span>Siri <em>na Lata</em></span></a>
        <p>Petisco bom é petisco dividido. Frutos do mar, porções e cerveja gelada com o pé na areia.</p>
      </div>
      <div>
        <h3>Navegue</h3>
        <ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Fale com a gente</h3>
        <ul>
          <li><a href="${WA.geral}" target="_blank" rel="noopener">WhatsApp ${esc(C.contato.whatsappExibicao)}</a></li>
          <li><a href="${C.contato.instagram}" target="_blank" rel="noopener">Instagram ${esc(C.contato.instagramUser)}</a></li>
        </ul>
        <div class="redes">
          <a href="${C.contato.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${esc(C.contato.instagramUser)}">${I.instagram()}</a>
          <a href="${WA.geral}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp()}</a>
          ${C.contato.facebook ? `<a href="${C.contato.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook()}</a>` : ''}
        </div>
      </div>
    </div>
    <div class="ftr-bot"><span>&copy; ${ano} ${esc(C.nome)}</span><span>Balneário Estreito, Florianópolis, SC</span></div>
  </div>
</footer>

<div class="sacola" data-sacola aria-label="Seu pedido" role="region">
  <div class="sacola-lista" id="sacola-lista" hidden><ul data-sac-lista></ul></div>
  <div class="sacola-bar">
    <button type="button" class="sacola-ver" data-sac-ver aria-expanded="false" aria-controls="sacola-lista"><b data-sac-qtd>0 itens</b><span data-sac-total>R$ 0</span></button>
    <button type="button" class="sacola-limpar" data-sac-limpar>Limpar</button>
    <a class="btn btn-terra" data-sac-enviar href="${WA.geral}" target="_blank" rel="noopener">${I.whatsapp()}<span>Enviar pedido</span></a>
  </div>
</div>
<p class="toast" data-toast role="status" aria-live="polite"></p>
<a class="wa-float" href="${WA.geral}" target="_blank" rel="noopener" aria-label="Fale com o Siri na Lata pelo WhatsApp">${I.whatsapp()}</a>`;

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap">
<script>(function(h){h.classList.add('js');var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,v;try{v=sessionStorage.getItem('siri-intro');}catch(e){}if(!rm&&!v)h.classList.add('com-intro');setTimeout(function(){h.classList.add('pronto');},3200);})(document.documentElement)</script>
<style>${css.replace(/\n\s*/g, '').trim()}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(faqld)}</script>
</head>
<body>
${intro}
${header}
<main id="conteudo">
${capa}
${faixa}
${estrela}
${dia}
${cardapio}
${casa}
${reservas}
${faq}
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

const IMGS = new Set(['faixa-reserva.webp', 'mapa-siri.webp', 'og.jpg', 'casa-praia.webp', 'casa-drink.webp', 'camarao-completo.webp',
  ...K.cartoes.map((c) => c.foto + '.webp'), ...M.map((m) => m.foto + '.webp'), ...C.cardapioFotos.map((f) => f.foto + '.webp')]);
IMGS.forEach((f) => fs.copyFileSync(path.join(ROOT, '_build/img', f), path.join(OUT, 'assets/img', f)));
['siri-na-lata.svg', 'favicon.png', 'apple-touch-icon.png'].forEach((f) => fs.copyFileSync(path.join(ROOT, 'marca', f), path.join(OUT, 'assets/img', f)));

fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${C.dominio}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.htaccess'), `# Cache e compressão (Apache)\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/html "access plus 0 seconds"\n</IfModule>\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain\n</IfModule>\n`);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';
console.log('site-silver gerado:', kb(path.join(OUT, 'index.html')), 'de HTML,', IMGS.size + 3, 'imagens');
