// Gera o modelo SILVER do Siri na Lata (nicho restaurante e lanchonete).
//   node templates/siri-na-lata/_build-silver/build.js   → site-silver/
//
// Silver: mesma base do Bronze (uma página, conteúdo do _build/content.js), com experiência mais sofisticada:
// capa com foto da praia e pilha de cartões-postais que gira, faixa corrida,
// cardápio em livro que folheia com a rolagem (com + para montar o pedido),
// "um dia na casa" com o sol que anda conforme a rolagem, carrossel dos mais pedidos,
// pedido montado no site e enviado pelo WhatsApp, reserva guiada, perguntas animadas e mapa no rodapé.
const fs = require('fs');
const path = require('path');
const C = require('../_build/content');
const I = require('../_build/icons');
const { css } = require('./style');
const { js } = require('./script');
const T = require('../_build/tema');

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

// ---------- ondas (SVG próprio, usadas no "um dia na casa") ----------
// linha de onda contínua, período de 240 unidades, para rolar sem emenda
const ondaLinha = (y, amp, w = 2880) => {
  let d = `M0 ${y}`;
  for (let x = 0; x < w; x += 240) d += ` q60 ${-amp} 120 0 t120 0`;
  return d;
};
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
    ${T.botao()}
    <a class="btn btn-terra hdr-cta" href="#reservas">Reservar mesa</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu" data-menu>${I.menu('ic i-open')}${I.fechar('ic i-close')}</button>
  </div>
  <div class="trilha" aria-hidden="true"><span class="trilha-fio"></span><span class="trilha-siri" data-siri>${I.siriAndando()}</span></div>
</header>`;

const K = C.capa;
const capa = `
<section class="capa" id="topo" aria-labelledby="capa-t">
  <div class="capa-foto"><img src="${img('capa-silver.webp')}" srcset="${img('capa-silver-1000.webp')} 1000w, ${img('capa-silver.webp')} 2000w" sizes="100vw" alt="" width="2000" height="1333" fetchpriority="high" decoding="async"><span class="capa-veu" aria-hidden="true"></span></div>
  <svg class="capa-borda" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 34C240 0 520 26 760 18C1010 10 1220 36 1440 14V90H0Z"/></svg>
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
        ${K.cartoes.map((c, i) => `<li class="postal" data-pos="${i}" aria-hidden="${i ? 'true' : 'false'}"><figure><img src="${img(c.foto + '.webp')}" alt="${esc(c.alt)}" width="382" height="510"${i ? ' loading="lazy"' : ''} decoding="async"><figcaption>${esc(c.legenda)}</figcaption></figure></li>`).join('')}
      </ul>
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

// ---------- cardápio em livro (mesmo componente do Gold, com o + do pedido do Silver) ----------
// páginas em ordem de leitura. Em tela larga viram pares (esquerda e direita); no celular, uma por vez.
const cat = (id) => C.cardapio.find((c) => c.id === id);
const lista = (c) => `
  <header><h3 id="c-${c.id}">${esc(c.titulo)}</h3><p>${esc(c.nota)}</p></header>
  <ul>${ITENS.filter((it) => it.cat === c.id).map((it) => `<li><div class="row"><b>${esc(it.nome)}</b><i></i><strong>${brl(it.preco)}</strong><button type="button" class="pg-add" data-add="${it.id}" aria-label="Colocar ${esc(it.nome)} no pedido">${I.mais()}</button></div><small>${esc(it.desc)}${it.obs ? `, <em>${esc(it.obs)}</em>` : ''}${it.meia ? `. <em>Meia ${brl(it.meia)}</em>` : ''}</small></li>`).join('')}</ul>`;
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
  `<article class="pg pg-fotos mista" aria-label="Fotos dos pratos para dividir">
    ${colada('peixe-pirao', 'Peixe frito com panela de barro de pirão, arroz e salada na mesa da praia', 680, 382, 'c2', 'peixe frito com pirão')}
    <p class="pg-frase">Mesa de praia pede prato no meio e todo mundo se servindo.</p>
    ${colada('camarao-completo', 'Camarão frito com batata, arroz, pirão e salada servidos na mesa', 382, 510, 'c3', 'camarão completo')}
    ${rodape('para dividir')}
  </article>`,
  `<article class="pg pg-lista" aria-labelledby="c-pratos">${lista(cat('pratos'))}
    <p class="pg-nota">Os pratos chegam em panela de barro, direto para o meio da mesa.</p>${rodape('para dividir')}</article>`,
  `<article class="pg pg-fotos duas" aria-label="Fotos das porções">
    ${colada('isca-peixe', 'Iscas de peixe fritas e douradas com molho', 382, 510, 'c4', 'isca de peixe')}
    <p class="pg-frase">Crocante por fora, sequinho por dentro e quente até a última.</p>
    ${colada('camarao-milanesa', 'Camarão à milanesa com molho rosé', 236, 510, 'c5', 'camarão à milanesa')}
    ${rodape('porções')}
  </article>`,
  `<article class="pg pg-lista" aria-labelledby="c-salgados">${lista(cat('salgados'))}${rodape('porções')}</article>`,
  `<article class="pg pg-fotos duas" aria-label="Fotos das bebidas">
    ${colada('casa-drinks', 'Caipirinha e chope no balcão de madeira de frente para o mar', 287, 510, 'c6', 'caipirinha e chope')}
    <p class="pg-frase">Gelada no ponto e o mar fazendo a trilha sonora.</p>
    ${colada('casa-drink', 'Drink azul com rodela de laranja, com a praia ao fundo', 287, 510, 'c7', 'o drink do fim de tarde')}
    ${rodape('para beber')}
  </article>`,
  `<article class="pg pg-lista pg-fim" aria-labelledby="c-acomp">${lista(cat('acomp'))}
    <div class="pg-beber"><h4>Para beber</h4><p>${esc(C.bebidas)}</p></div>
    <a class="btn btn-terra btn-sm" href="${WA.geral}" target="_blank" rel="noopener">${I.whatsapp()}Pedir pelo WhatsApp</a>
    <p class="pg-aviso">${esc(C.avisoPrecos)}</p>
  </article>`,
];
const CAPITULOS = ['Petiscos do mar', 'Para dividir', 'Salgados e porções', 'Acompanhamentos e bebidas'];

const livro = `
<section class="livro-sec" id="cardapio" data-book-sec aria-labelledby="menu-t">
  <div class="pin">
    <div class="wrap menu-top">
      <div>
        <p class="apoio">Cardápio</p>
        <h2 id="menu-t">O cardápio completo</h2>
        <p class="menu-dica">Desça para virar a página, suba e ela volta. Toque no + para montar o seu pedido.</p>
      </div>
      <nav class="caps" aria-label="Capítulos do cardápio">${CAPITULOS.map((c, i) => `<button type="button" data-cap="${i}"${i === 0 ? ' aria-current="true"' : ''}>${c}</button>`).join('')}</nav>
    </div>
    <div class="book" data-book>
      <div class="book-stage"></div>
      <div class="book-src">${PAGINAS.join('')}</div>
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
        ${M.map((m, i) => `<figure class="dia-foto${i ? '' : ' on'}${m.w > m.h ? ' larga' : ''}" data-m="${i}"><img src="${img(m.foto + '.webp')}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async"></figure>`).join('')}
      </div>
      <div class="dia-txts">
        ${M.map((m, i) => `<article class="dia-txt${i ? '' : ' on'}" data-m="${i}"><p class="hora">${esc(m.hora)}</p><h3>${esc(m.titulo)}</h3>${m.prato ? `<p class="dia-prato">${esc(m.prato)}</p>` : ''}<p>${esc(m.texto)}</p></article>`).join('')}
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

const cardapio = `
<section class="sec cardapio" id="mais-pedidos" aria-labelledby="card-t">
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
<meta name="theme-color" content="#F4EFE1" data-dark="#0B1822">
${T.HEAD}
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
<link rel="preload" as="image" href="${img('capa-silver.webp')}" imagesrcset="${img('capa-silver-1000.webp')} 1000w, ${img('capa-silver.webp')} 2000w" imagesizes="100vw" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap">
<script>(function(h){h.classList.add('js');var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,v;try{v=sessionStorage.getItem('siri-intro');}catch(e){}if(!rm&&!v)h.classList.add('com-intro');setTimeout(function(){h.classList.add('pronto');},3200);})(document.documentElement)</script>
<style>${(css + T.CSS).replace(/\n\s*/g, '').trim()}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(faqld)}</script>
</head>
<body>
${intro}
${header}
<main id="conteudo">
${capa}
${faixa}
${livro}
${dia}
${cardapio}
${casa}
${reservas}
${faq}
</main>
${footer}
<script>${js}
${T.JS}</script>
</body>
</html>
`;

// ---------- saída ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);

const IMGS = new Set(['casquinha-siri.webp', 'isca-peixe.webp', 'camarao-milanesa.webp', 'casa-drinks.webp', 'capa-silver.webp', 'capa-silver-1000.webp', 'faixa-reserva.webp', 'mapa-siri.webp', 'og.jpg', 'casa-praia.webp', 'casa-drink.webp', 'camarao-completo.webp',
  ...K.cartoes.map((c) => c.foto + '.webp'), ...M.map((m) => m.foto + '.webp'), ...C.cardapioFotos.map((f) => f.foto + '.webp')]);
IMGS.forEach((f) => fs.copyFileSync(path.join(ROOT, '_build/img', f), path.join(OUT, 'assets/img', f)));
['siri-na-lata.svg', 'favicon.png', 'apple-touch-icon.png'].forEach((f) => fs.copyFileSync(path.join(ROOT, 'marca', f), path.join(OUT, 'assets/img', f)));

fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${C.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${C.dominio}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.htaccess'), `# Cache e compressão (Apache)\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/html "access plus 0 seconds"\n</IfModule>\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain\n</IfModule>\n`);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';
console.log('site-silver gerado:', kb(path.join(OUT, 'index.html')), 'de HTML,', IMGS.size + 3, 'imagens');
