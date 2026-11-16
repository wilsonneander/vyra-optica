// Gera o modelo Silver de bebidas e conveniência (Tampinha) em "templates/Bebidas & Conveniências/site-silver/".
// Silver: uma página só, CSS e JS em assets/. Fotos reais dos produtos (recortadas por imagens.js) e logos das marcas.
// Uso: node "templates/Bebidas & Conveniências/_build-silver/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const medidas = require('./img/fotos/medidas.json');

const OUT = path.join(__dirname, '..', 'site-silver');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = M.telefone.replace(/\D/g, '');
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const todos = [...C.produtos, ...C.extras];
const porId = Object.fromEntries(todos.map((p) => [p.id, p]));
const cat = Object.fromEntries(C.categorias.map((c) => [c.id, c]));
const alc = (p) => (p.alc !== undefined ? p.alc : Boolean(cat[p.cat] && cat[p.cat].alc));
const tinta = (p) => p.cor;

// foto de produto (recorte transparente) ou de ambiente (drinks); alt vazio quando é repetição decorativa
const foto = (p, { cls = '', alt = true, lazy = true } = {}) => {
  const k = `${p.amb ? 'ambiente' : 'produtos'}/${p.foto}`;
  const [w, h] = medidas[k];
  return `<img class="arte${p.amb ? ' arte-amb' : ''}${cls ? ' ' + cls : ''}" src="assets/img/${k}.webp" alt="${alt ? esc(`${p.nome} ${p.vol}`) : ''}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async" data-arte="${p.id}">`;
};
const imgDe = (k, alt = '', cls = '', lazy = true) => { const [w, h] = medidas[k]; return `<img class="${cls}" src="assets/img/${k}.webp" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`; };

// tom de cada categoria (painéis da prateleira)
const tomCat = { cerveja: '#B8861F', energetico: '#4F7A22', destilado: '#7A3B17', cha: '#9C5A1C', drink: '#8E1F2A', agua: '#2C5F86', refri: '#C21D24' };

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_floresta_noite.webp'), path.join(OUT, 'assets', 'img', 'mapa_floresta_noite.webp'));
// cópia arquivo por arquivo (fs.cpSync derruba o Node 24 no Windows com acento no caminho)
for (const d of ['produtos', 'ambiente', 'logos']) {
  fs.mkdirSync(path.join(OUT, 'assets', 'img', d), { recursive: true });
  for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos', d))) fs.copyFileSync(path.join(__dirname, 'img', 'fotos', d, f), path.join(OUT, 'assets', 'img', d, f));
}
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'style.css'));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({
    whatsapp: M.whatsapp, nome: M.nome, abertura: C.abertura, entrega: C.entrega,
    produtos: Object.fromEntries(todos.map((p) => [p.id, { n: p.nome, v: p.vol, p: p.preco, c: p.cat, a: alc(p) ? 1 : 0, t: tinta(p) }])),
    cats: Object.fromEntries([...C.categorias.map((c) => [c.id, c.nome]), ['extra', 'Conveniência']]),
    kits: Object.fromEntries(C.kits.map((k) => [k.id, k.itens])),
    capa: C.capa.map((s) => ({ tom: s.tom, luz: s.luz, nome: porId[s.id].marca || porId[s.id].nome })),
  })));

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gloock&family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">';

// ---------- peças ----------
const preco = (v) => { const [r, c] = v.toFixed(2).split('.'); return `<span class="etiqueta"><small>R$</small><b>${r}</b><i>,${c}</i></span>`; };
const compra = (p) => `<div class="compra" data-compra="${p.id}">
            <button class="add" type="button" data-add="${p.id}" aria-label="Pôr ${esc(p.nome)} ${p.vol} no carrinho">${I.addTampa}</button>
            <div class="qtd" aria-label="Quantidade de ${esc(p.nome)}"><button type="button" data-menos="${p.id}" aria-label="Tirar um">${I.menos}</button><output data-qtd="${p.id}">0</output><button type="button" data-mais="${p.id}" aria-label="Pôr mais um">${I.mais}</button></div>
          </div>`;
const card = (p, cls = '') => `<article class="card${p.amb ? ' card-amb' : ''} ${cls}" data-id="${p.id}" data-cat="${p.cat}" data-marca="${esc(p.marca || '')}" data-preco="${p.preco}" data-busca="${esc(normal(`${p.nome} ${p.marca || ''} ${p.vol} ${cat[p.cat] ? cat[p.cat].nome : ''}`))}"${alc(p) ? ' data-alc' : ''} style="--tinta:${tinta(p)}">
          <div class="card-arte" data-tilt><span class="card-halo"></span>${foto(p)}<span class="card-chao"></span></div>
          <div class="card-info"><small>${esc(p.marca || cat[p.cat].nome)}${alc(p) ? '<em>+18</em>' : ''}</small><h3>${esc(p.nome)}</h3><span>${p.vol}</span></div>
          <div class="card-pe">${preco(p.preco)}${compra(p)}</div>
        </article>`;

// capa: um palco por slide
const cenas = C.capa.map((s, i) => {
  const p = porId[s.id];
  return `<div class="cena${i ? '' : ' on'}" data-cena="${i}" aria-hidden="${i ? 'true' : 'false'}">
          <div class="cena-lado l">${foto(porId[s.lado[0]], { alt: false, lazy: i > 0 })}</div>
          <div class="cena-heroi">${foto(p, { lazy: i > 0 })}</div>
          <div class="cena-lado r">${foto(porId[s.lado[1]], { alt: false, lazy: i > 0 })}</div>
          <div class="cena-ficha">
            <div><small>${esc(p.marca || '')}</small><b>${esc(p.nome)}</b><span>${p.vol}</span></div>
            ${preco(p.preco)}${compra(p)}
          </div>
        </div>`;
}).join('\n        ');
const capaFundos = C.capa.map((s, i) => (s.fundo ? `<div class="capa-foto${i ? '' : ' on'}" data-fundo="${i}">${imgDe('ambiente/' + s.fundo, '', '', i > 0)}</div>` : '')).join('');
const capaTextos = C.capa.map((s, i) => `<div class="capa-slide${i ? '' : ' on'}" data-slide="${i}"><h2>${esc(s.titulo)}</h2><p>${esc(s.texto)}</p></div>`).join('');
const miniaturas = C.capa.map((s, i) => `<button type="button" class="mini${i ? '' : ' on'}" data-ir="${i}" aria-label="Ver ${esc(porId[s.id].nome)}"><span>${foto(porId[s.id], { alt: false, lazy: false })}</span><i></i></button>`).join('');

// cubo de gelo desenhado (flutua no palco)
const cubo = (cls) => `<svg class="cubo ${cls}" viewBox="0 0 60 60" aria-hidden="true"><path d="M8 18 L32 8 L54 20 L30 30 Z" fill="#EAF6FF" opacity=".8"/><path d="M8 18 L30 30 L30 54 L8 42 Z" fill="#CFE6F5" opacity=".55"/><path d="M30 30 L54 20 L54 44 L30 54 Z" fill="#A9CBE0" opacity=".45"/><path d="M14 20 L28 14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/></svg>`;

const fitaItens = [`Entrega em ${C.entrega.tempo}`, 'Parceiro iFood', 'Parceiro 99Food', 'Site 100% seguro', 'Atendimento no WhatsApp', `Grátis acima de ${real(C.entrega.gratisAcima)}`];
const fita = fitaItens.map((t) => `<span>${esc(t)}</span><i>${I.tampaPura}</i>`).join('');

const contagem = (id) => C.produtos.filter((p) => p.cat === id).length;
const prateleira = C.categorias.map((c, i) => `<li><button type="button" class="cat${i ? '' : ' on'}" data-filtro="${c.id}" style="--c:${tomCat[c.id]}" aria-label="${c.nome}: ver ${contagem(c.id)} opções">
            <span class="cat-nome">${c.nome}</span>
            ${c.fundo ? `<span class="cat-fundo">${imgDe('ambiente/' + c.fundo)}</span>` : ''}<span class="cat-artes">${c.vitrine.map((id) => foto(porId[id], { alt: false })).join('')}</span>
            <span class="cat-info"><b>${contagem(c.id)} opções${c.alc ? ' <em>+18</em>' : ''}</b><span>Ver ${c.nome.toLowerCase()} ${I.seta}</span></span>
          </button></li>`).join('\n          ');

const chips = [['tudo', 'Tudo'], ...C.categorias.map((c) => [c.id, c.chip || c.nome])]
  .map(([id, nome]) => `<button type="button" class="chip${id === 'tudo' ? ' on' : ''}" data-chip="${id}" aria-pressed="${id === 'tudo'}">${nome}</button>`).join('');

const marcaBloco = ([n, cor, prod, logo]) => `<button type="button" class="marca" data-marca="${esc(n)}" style="--cor:${cor}" aria-label="Ver bebidas ${esc(n)}">${foto(porId[prod], { alt: false })}<span class="marca-nome">${logo ? imgDe('logos/' + logo, n, 'marca-logo') : esc(n)}</span></button>`;
const meio = Math.ceil(C.marcas.length / 2);
const esteira = (lista, rev) => { const b = lista.map(marcaBloco).join(''); return `<div class="esteira${rev ? ' contra' : ''}"><div class="esteira-trilho">${b}${b.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ')}</div></div>`; };

const kitTotal = (k) => k.itens.reduce((s, [id, q]) => s + porId[id].preco * q, 0);
const kits = C.kits.map((k, i) => `<article class="kit${i ? '' : ' kit-g'}">
          ${k.fundo ? `<span class="kit-fundo">${imgDe('ambiente/' + k.fundo)}</span>` : ''}
          <div class="kit-arte">${k.arte.map((id, j) => foto(porId[id], { cls: j === 1 ? 'meio' : '', alt: j === 1 })).join('')}</div>
          <div class="kit-txt">
            <h3>${k.nome}</h3>
            <p>${esc(k.texto)}</p>
            <ul>${k.itens.map(([id, q]) => `<li><b>${q}x</b> ${esc(porId[id].nome)} <span>${porId[id].vol}</span></li>`).join('')}</ul>
            <div class="kit-pe"><span class="kit-preco"><small>leva tudo por</small>${real(kitTotal(k))}</span><button type="button" class="btn btn-verm" data-kit="${k.id}">${I.engradado}Pôr o kit no carrinho</button></div>
          </div>
        </article>`).join('\n        ');

const passos = C.passos.map(([ic, t, d]) => `<li class="passo"><span class="passo-ic">${I[ic]}</span><h3>${t}</h3><p>${esc(d)}</p></li>`).join('');

// selo de site seguro: texto girando em volta do cadeado (sem caractere separador, só espaço)
const selo = (cls = '') => `<div class="selo ${cls}" role="img" aria-label="Site 100% seguro">
          <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="selo-c${cls}" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0"/></defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 5"/>
            <g class="selo-giro"><text font-size="14" fill="currentColor"><textPath href="#selo-c${cls}" textLength="482" lengthAdjust="spacing">SITE 100% SEGURO    COMPRA PROTEGIDA    </textPath></text></g>
            <circle cx="100" cy="100" r="54" fill="var(--verm)"/>
            <g transform="translate(70 66) scale(2.5)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5"/><path d="M12 14.5 V17"/></g>
          </svg>
        </div>`;

const faqs = C.faq.map(([q, r], i) => `<details class="faq-item"${i ? '' : ' open'}><summary><span>${esc(q)}</span><i>${I.mais}</i></summary><div class="faq-r"><p>${esc(r)}</p></div></details>`).join('\n          ');
const bairros = C.bairros.map((b) => `<li>${esc(b)}</li>`).join('');
const horarios = C.horarios.map(([d, h]) => `<li><span>${d}</span><b>${h}</b></li>`).join('');
const horarioTexto = C.horarios.map(([d, h]) => `${d}: ${h}`).join('. ');

const extras = C.extras.map((p) => `<div class="extra" data-id="${p.id}">${foto(p, { alt: false })}<div><b>${esc(p.nome)}</b><span>${p.vol}</span><strong>${real(p.preco)}</strong></div><button type="button" class="extra-add" data-add="${p.id}" aria-label="Pôr ${esc(p.nome)} no carrinho">${I.mais}</button></div>`).join('');

const destaques = C.destaques.map((id) => card(porId[id], 'card-g')).join('\n        ');
const catalogo = C.produtos.map((p) => card(p)).join('\n        ');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Bebida gelada com entrega em ${M.bairro}, BH</title>
<meta name="description" content="${esc(M.frase)} Cervejas, refrigerantes, energéticos, destilados, drinks, chás e água. Monte o carrinho e envie o pedido pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#120E0C">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="carregando">

<div class="preload" aria-hidden="true">
  <div class="preload-garrafa">
    <svg viewBox="0 0 120 200"><path d="M50 20 L70 20 L70 70 C70 92 94 98 94 124 L94 200 L26 200 L26 124 C26 98 50 92 50 70 Z" fill="#2A1A12"/><rect x="50" y="48" width="20" height="10" fill="#D7261E"/><rect x="26" y="140" width="68" height="34" fill="#F4EFE8"/><text x="60" y="162" text-anchor="middle" font-size="16" fill="#120E0C">tampinha</text></svg>
    <span class="preload-tampa">${I.tampaPura}</span>
    <span class="preload-espuma"><i></i><i></i><i></i><i></i><i></i><i></i></span>
  </div>
</div>

<a class="pular" href="#bebidas">Pular para as bebidas</a>

<header class="topo" data-topo>
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      <a href="#categorias">Categorias</a><a href="#bebidas">Bebidas</a><a href="#marcas">Marcas</a><a href="#kits">Kits</a><a href="#entrega">Entrega</a><a href="#duvidas">Dúvidas</a>
    </nav>
    <div class="topo-acoes">
      <span class="status" data-status>Aberto agora</span>
      <a class="topo-wa" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>
      <button type="button" class="topo-carrinho" data-abrir-carrinho aria-label="Abrir carrinho">${I.engradado}<span data-conta>0</span></button>
      <button type="button" class="hamb" data-hamb aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
    </div>
  </div>
</header>

<main>
  <section class="capa" id="inicio" data-capa style="--tom:${C.capa[0].tom};--luz:${C.capa[0].luz}">
    <div class="capa-fundo" aria-hidden="true">${capaFundos}<span class="capa-nome" data-capa-nome>${esc(porId[C.capa[0].id].marca)}</span></div>
    <div class="bolhas" data-bolhas aria-hidden="true"></div>
    <div class="wrap capa-in">
      <div class="capa-txt">
        <p class="apoio">Bebidas &amp; conveniência no ${M.bairro}, ${M.cidade.replace(', MG', '')}</p>
        <h1><span class="h1-l">A bebida certa,</span> <span class="h1-l"><em>gelada</em>, na sua porta.</span></h1>
        <div class="capa-slides" aria-live="polite">${capaTextos}</div>
        <div class="capa-btns" data-iguais><a class="btn btn-verm" href="#bebidas">${I.engradado}Montar meu pedido</a><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener">${I.whats}Pedir no WhatsApp</a></div>
        <ul class="capa-selos">
          <li>${I.moto}<span><b>${C.entrega.tempo}</b>entrega no bairro</span></li>
          <li>${I.cadeado}<span><b>100% seguro</b>site protegido</span></li>
          <li>${I.sacola}<span><b>iFood e 99Food</b>também estamos lá</span></li>
        </ul>
      </div>
      <div class="palco" data-palco>
        <span class="palco-luz" aria-hidden="true"></span>
        <span class="palco-disco" aria-hidden="true"></span>
        ${cubo('c1')}${cubo('c2')}${cubo('c3')}
        ${cenas}
        <div class="palco-nav">
          <button type="button" class="seta" data-capa-ant aria-label="Bebida anterior">${I.esq}</button>
          <div class="minis">${miniaturas}</div>
          <button type="button" class="seta" data-capa-prox aria-label="Próxima bebida">${I.dir}</button>
        </div>
      </div>
    </div>
    <a class="capa-rolar" href="#categorias" aria-label="Rolar para as categorias"><span></span></a>
  </section>

  <div class="fita" aria-label="Vantagens"><div class="fita-trilho">${fita}${fita}</div></div>

  <section class="cats" id="categorias">
    <div class="wrap">
      <header class="sec-cab">
        <p class="apoio">Categorias</p>
        <h2>O que vai gelar hoje?</h2>
        <p class="sec-txt">Passe o mouse ou toque numa prateleira para abrir. Um clique leva direto para as bebidas dela.</p>
      </header>
      <ul class="cats-lista" data-cats>
          ${prateleira}
      </ul>
    </div>
  </section>

  <section class="mais" id="mais-pedidos">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Mais pedidos da semana</p><h2>Os que mais saem da câmara fria</h2></div>
        <div class="trilho-nav"><button type="button" class="seta" data-trilho-ant aria-label="Anteriores">${I.esq}</button><button type="button" class="seta" data-trilho-prox aria-label="Próximos">${I.dir}</button></div>
      </header>
    </div>
    <div class="trilho" data-trilho tabindex="0" aria-label="Carrossel de mais pedidos">
        ${destaques}
    </div>
    <div class="wrap"><div class="trilho-barra"><span data-trilho-barra></span></div></div>
  </section>

  <section class="faixa-foto" aria-label="${esc(C.faixas.brinde.titulo)}">
    <div class="faixa-img" data-paralaxe>${imgDe('ambiente/' + C.faixas.brinde.foto, 'Amigos brindando com copos de cerveja')}</div>
    <div class="wrap faixa-txt">
      <h2>${esc(C.faixas.brinde.titulo)}</h2>
      <p>${esc(C.faixas.brinde.texto)}</p>
      <button type="button" class="btn btn-verm" data-ir-cat="cerveja">${I.engradado}Ver cervejas</button>
    </div>
  </section>

  <section class="marcas" id="marcas">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Marcas</p><h2>As marcas que você já conhece</h2></div>
        <p class="sec-txt">Clique numa marca para ver só as bebidas dela no catálogo.</p>
      </header>
    </div>
    ${esteira(C.marcas.slice(0, meio))}
    ${esteira(C.marcas.slice(meio), true)}
  </section>

  <section class="catalogo" id="bebidas">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Catálogo</p><h2>Todas as bebidas</h2></div>
        <div class="busca-linha">
          <label class="busca">${I.busca}<input type="search" placeholder="Buscar bebida ou marca" data-busca aria-label="Buscar bebida ou marca"></label>
          <label class="ordem"><span>Ordenar</span><select data-ordem><option value="">Sugestão da casa</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="az">Nome de A a Z</option></select></label>
        </div>
      </header>
      <div class="chips" data-chips data-iguais role="group" aria-label="Filtrar por categoria">${chips}</div>
      <div class="filtro-marca" data-filtro-marca hidden><span>Mostrando a marca <b data-marca-nome></b></span><button type="button" data-limpar-marca>${I.fechar}Ver todas as marcas</button></div>
      <p class="contagem" data-contagem aria-live="polite"></p>
      <div class="grade" data-grade>
        ${catalogo}
      </div>
      <div class="mais-linha"><button type="button" class="btn btn-escuro" data-ver-mais>Ver mais bebidas</button></div>
      <p class="vazio" data-vazio hidden>Não achamos essa bebida. Chama no <a href="${wa(`Olá, ${M.nome}! Vocês têm `)}" target="_blank" rel="noopener">WhatsApp</a> que a gente confere no estoque.</p>
    </div>
  </section>

  <section class="kits" id="kits">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Kits prontos</p><h2>Um clique e o rolê está montado</h2></div>
        <p class="sec-txt">Os kits entram no carrinho item por item, então dá para tirar ou pôr mais depois.</p>
      </header>
      <div class="kits-grade">
        ${kits}
      </div>
    </div>
  </section>

  <section class="como" id="como-pedir">
    <div class="wrap">
      <header class="sec-cab">
        <p class="apoio">Pedido pelo WhatsApp</p>
        <h2>Do carrinho para a conversa, já organizado</h2>
        <p class="sec-txt">O site separa o pedido por categoria, soma tudo e monta a mensagem. Você só confere e envia.</p>
      </header>
      <div class="como-linha" data-como>
        <svg class="como-caminho" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M20 60 C 160 -10, 300 130, 500 60 S 840 -10, 980 60" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 8" pathLength="1000"/><path class="como-cheio" d="M20 60 C 160 -10, 300 130, 500 60 S 840 -10, 980 60" fill="none" stroke="var(--verm)" stroke-width="3" pathLength="1000"/></svg>
        <span class="como-tampa" aria-hidden="true">${I.tampaPura}</span>
        <ol class="passos">${passos}</ol>
      </div>
      <div class="como-msg">
        <div class="como-foto">${imgDe('ambiente/amb-skol-litrao', 'Garrafa de Skol gelada com gelo e cevada')}</div>
        <div class="msg-bolha" aria-label="Exemplo da mensagem que chega no WhatsApp">
          <b>Pedido Tampinha</b>
          <span><u>Cervejas</u>12x Skol Pilsen lata 350ml</span>
          <span><u>Refrigerantes</u>2x Coca-Cola garrafa 2L</span>
          <span><u>Conveniência</u>1x Gelo em cubos saco 5kg</span>
          <span><u>Total</u>R$ 83,26 com entrega</span>
          <span><u>Pagamento</u>Pix</span>
          <small>enviado agora</small>
        </div>
        <p>Chega assim no nosso WhatsApp. A gente confirma estoque e horário na hora.</p>
      </div>
    </div>
  </section>

  <section class="entrega" id="entrega">
    <div class="wrap entrega-in">
      <div class="entrega-txt">
        <p class="apoio">Entrega e parceiros</p>
        <h2>Gelada na sua porta em ${C.entrega.tempo}</h2>
        <ul class="entrega-dados">
          <li><span>Taxa de entrega</span><b>${real(C.entrega.taxa)}</b></li>
          <li><span>Entrega grátis</span><b>acima de ${real(C.entrega.gratisAcima)}</b></li>
          <li><span>Retirada no balcão</span><b>sem taxa</b></li>
          <li><span>Pagamento</span><b>Pix, cartão ou dinheiro na entrega</b></li>
        </ul>
        <p class="parceiros-txt">Prefere pedir pelo aplicativo? Estamos no iFood e no 99Food com o mesmo estoque.</p>
        <div class="parceiros" data-iguais>
          <a class="parc parc-ifood" href="${M.ifood}" target="_blank" rel="noopener">${imgDe('logos/logo-ifood', 'iFood')}<span>pedir no app</span></a>
          <a class="parc parc-99" href="${M.food99}" target="_blank" rel="noopener">${imgDe('logos/logo-99food-largo', '99Food')}<span>pedir no app</span></a>
        </div>
      </div>
      <div class="entrega-lado">
        ${selo()}
        <div class="seguro">
          <h3>Site 100% seguro</h3>
          <p>Conexão criptografada do começo ao fim. Aqui você não digita cartão nem senha: o pedido vai para o WhatsApp e o pagamento é feito na entrega ou na retirada.</p>
        </div>
        <a class="atendimento" href="${wa(`Olá, ${M.nome}! Preciso de ajuda com um pedido.`)}" target="_blank" rel="noopener">
          <span class="atend-ic">${I.whats}</span>
          <span><b>Atendimento no WhatsApp</b>Gente de verdade do outro lado, do pedido até a entrega. ${M.whatsappTexto}</span>
        </a>
      </div>
    </div>
    <div class="wrap">
      <div class="bairros-faixa">
        <h3>Bairros com entrega</h3>
        <ul class="bairros" data-iguais>${bairros}</ul>
      </div>
    </div>
  </section>

  <section class="duvidas" id="duvidas">
    <div class="wrap duvidas-in">
      <header class="sec-cab">
        <p class="apoio">Dúvidas</p>
        <h2>Antes de pedir</h2>
        <p class="sec-txt">Não achou a resposta? Fale com a gente no <a href="${wa(`Olá, ${M.nome}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">WhatsApp</a>.</p>
        ${cubo('faq-cubo')}
      </header>
      <div class="faq">
          ${faqs}
      </div>
    </div>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_floresta_noite.webp" alt="Mapa da região do bairro Floresta, em Belo Horizonte, com a localização da ${M.completo}" loading="lazy" width="1240" height="760">
        <span class="pin" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${enderecoCompleto}</span><span>${horarioTexto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Entregamos em ${M.bairro} e nos bairros vizinhos de ${M.cidade.replace(', MG', '')}. Retirada no balcão todos os dias.</p>
        <ul class="onde-lista">${bairros}</ul>
      </div>
    </div>
    <div class="rodape-col">
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
        <p>${esc(M.frase)}</p>
        <div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${M.instagramUser}">${I.insta}</a><a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a></div>
      </div>
      <nav aria-label="Rodapé"><h3>Navegar</h3><a href="#categorias">Categorias</a><a href="#bebidas">Bebidas</a><a href="#marcas">Marcas</a><a href="#kits">Kits</a><a href="#entrega">Entrega</a><a href="#duvidas">Dúvidas</a></nav>
      <div><h3>Contato</h3><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a><a href="tel:+55${tel}">Telefone ${M.telefone}</a><a href="mailto:${M.email}">${M.email}</a><span>${enderecoCompleto}</span></div>
      <div><h3>Horário</h3><ul class="horas">${horarios}</ul></div>
    </div>
    <div class="rodape-base">
      ${selo('selo-p')}
      <p><b>Venda proibida para menores de 18 anos.</b> Se beber, não dirija. Aprecie com moderação.</p>
      <p>© ${new Date().getFullYear()} ${M.completo}. Preços e estoque sujeitos a alteração. Modelo de demonstração.</p>
    </div>
  </div>
</footer>

<div class="barra-carrinho" data-barra>
  <button type="button" data-abrir-carrinho><span>${I.engradado}<b data-conta-txt>0 itens</b></span><span>Ver carrinho <b data-total-barra>R$ 0,00</b></span></button>
</div>

<a class="flutua-wa" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener" aria-label="Pedir pelo WhatsApp">${I.whats}</a>
<button type="button" class="topo-volta" data-volta aria-label="Voltar ao topo"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity=".2"/><circle class="volta-anel" cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-width="2" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>${I.cima}</button>

<div class="veu" data-veu hidden></div>
<aside class="carrinho" data-carrinho aria-label="Carrinho" aria-hidden="true" inert>
  <header class="carr-topo">
    <div><h2>Seu pedido</h2><span data-carr-sub>Nenhum item ainda</span></div>
    <button type="button" class="fechar" data-fechar-carrinho aria-label="Fechar carrinho">${I.fechar}</button>
  </header>
  <div class="carr-etapas" data-etapas><button type="button" class="on" data-etapa="itens">Itens</button><button type="button" data-etapa="dados">Entrega e pagamento</button></div>
  <div class="carr-corpo">
    <div class="carr-pane on" data-pane="itens">
      <div class="frete" data-frete><p data-frete-txt></p><span><i data-frete-barra></i></span></div>
      <ul class="carr-lista" data-lista></ul>
      <div class="carr-vazio" data-carr-vazio>
        <svg viewBox="0 0 160 120" aria-hidden="true"><path d="M20 50 H140 L130 110 H30 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M50 50 V110 M80 50 V110 M110 50 V110" stroke="currentColor" stroke-width="3" opacity=".4"/><g class="vazio-tampa">${I.tampaPura.replace('<svg ', '<svg x="62" y="6" width="36" height="36" ')}</g></svg>
        <p>O engradado está vazio.</p>
        <a class="btn btn-verm" href="#bebidas" data-fechar-carrinho>Escolher bebidas</a>
      </div>
      <div class="leve" data-leve><h3>Leve também</h3><div class="extras">${extras}</div></div>
    </div>
    <form class="carr-pane" data-pane="dados" data-form novalidate>
      <fieldset><legend>Como prefere receber?</legend>
        <div class="opcoes" data-iguais><label><input type="radio" name="modo" value="entrega" checked><span>${I.moto}Entrega</span></label><label><input type="radio" name="modo" value="retirada"><span>${I.loja}Retirar no balcão</span></label></div>
      </fieldset>
      <label class="campo"><span>Seu nome</span><input name="nome" autocomplete="name" required placeholder="Como devemos te chamar"></label>
      <div class="so-entrega" data-so-entrega>
        <label class="campo"><span>Endereço com número</span><input name="endereco" autocomplete="street-address" placeholder="Rua, número"></label>
        <div class="campo-dupla">
          <label class="campo"><span>Bairro</span><select name="bairro">${C.bairros.map((b) => `<option>${esc(b)}</option>`).join('')}<option value="outro">Outro bairro</option></select></label>
          <label class="campo"><span>Complemento</span><input name="compl" placeholder="Apto, bloco, referência"></label>
        </div>
      </div>
      <fieldset><legend data-pag-legenda>Pagamento na entrega</legend>
        <div class="opcoes tres" data-iguais><label><input type="radio" name="pag" value="Pix" checked><span>${I.pix}Pix</span></label><label><input type="radio" name="pag" value="Cartão"><span>${I.cartao}Cartão</span></label><label><input type="radio" name="pag" value="Dinheiro"><span>${I.nota}Dinheiro</span></label></div>
      </fieldset>
      <label class="campo" data-troco hidden><span>Troco para quanto?</span><input name="troco" inputmode="decimal" placeholder="Ex.: 100"></label>
      <label class="campo"><span>Observação</span><textarea name="obs" rows="2" placeholder="Ex.: bem gelada, sem copo, tocar o interfone"></textarea></label>
      <p class="aviso-18" data-aviso-18 hidden>Seu pedido tem bebida alcoólica. Ao enviar você confirma ter 18 anos ou mais. O entregador pode pedir documento.</p>
      <p class="erro" data-erro role="alert"></p>
    </form>
  </div>
  <footer class="carr-pe">
    <ul class="resumo"><li><span>Subtotal</span><b data-subtotal>R$ 0,00</b></li><li><span>Entrega</span><b data-taxa>R$ 0,00</b></li><li class="total"><span>Total</span><b data-total>R$ 0,00</b></li></ul>
    <button type="button" class="btn btn-verm btn-cheio" data-avancar disabled>Continuar</button>
    <p class="carr-seguro">${I.cadeado}Nada é cobrado pelo site. O pedido vai para o nosso WhatsApp.</p>
  </footer>
</aside>

<div class="idade" data-idade hidden role="dialog" aria-modal="true" aria-labelledby="idade-t">
  <div class="idade-box">
    ${I.tampaPura}
    <h2 id="idade-t">Você tem 18 anos ou mais?</h2>
    <p>Para pôr bebida alcoólica no carrinho, confirme sua idade. A venda para menores de 18 anos é proibida.</p>
    <div class="idade-btns" data-iguais><button type="button" class="btn btn-verm" data-idade-sim>Sim, tenho 18+</button><button type="button" class="btn btn-linha" data-idade-nao>Não tenho</button></div>
  </div>
</div>

<div class="aviso" data-aviso role="status" aria-live="polite"></div>

<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), (html.length / 1024).toFixed(0) + ' KB');
