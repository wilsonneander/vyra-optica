// Gera o modelo Bronze de bebidas e conveniência (Tampinha) em "templates/bebidas/bronze/".
// Bronze: uma página só, CSS e JS embutidos no index.html, fotos e logos em assets/.
// Uso: node "templates/bebidas/_build-bronze/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-tampinha');

const OUT = path.join(__dirname, '..', 'bronze');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const porId = Object.fromEntries(C.produtos.map((p) => [p.id, p]));
const cat = Object.fromEntries(C.categorias.map((c) => [c.id, c]));
const alc = (p) => Boolean(cat[p.cat] && cat[p.cat].alc);
const imgDe = (p) => (p.foto ? `assets/img/${p.foto}.webp` : `assets/logos/${p.logo}`);

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'logos'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos'))) fs.copyFileSync(path.join(__dirname, 'img', 'fotos', f), path.join(OUT, 'assets', 'img', f));
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'logos'))) fs.copyFileSync(path.join(__dirname, 'img', 'logos', f), path.join(OUT, 'assets', 'logos', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_floresta.webp'), path.join(OUT, 'assets', 'img', 'mapa_floresta.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css;
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({
    whatsapp: M.whatsapp, nome: M.nome, abertura: C.abertura, entrega: C.entrega,
    produtos: Object.fromEntries(C.produtos.map((p) => [p.id, { n: `${p.nome} ${p.vol}`, p: p.preco, i: imgDe(p), l: p.logo ? p.fundo : 0 }])),
    kits: Object.fromEntries(C.kits.map((k) => [k.id, k.itens])),
  })) + T.js('tampinha-bronze-tema', '#2A1A12', '#120C09');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Epilogue:wght@400;500;600;700&display=swap" rel="stylesheet">';

// ---------- créditos das imagens ----------
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));
const listaCreditos = creditos.map((c) => (c.fonte === 'Unsplash'
  ? `<li>${esc(c.arq)}: <a href="https://unsplash.com/photos/${c.id.split('-').slice(-1)}" target="_blank" rel="noopener">Unsplash</a></li>`
  : `<li>${esc(c.arq)}: <a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.arquivo.replace(/ /g, '_'))}" target="_blank" rel="noopener">${esc(c.autor || 'Wikimedia Commons')}</a>, ${esc(c.licenca || '')}</li>`)).join('');

// ---------- peças ----------
const preco = (v) => { const [r, c] = v.toFixed(2).split('.'); return `<span class="preco"><small>R$</small>${r}<i>,${c}</i></span>`; };
const compra = (p, cls = '') => `<div class="compra ${cls}" data-compra="${p.id}">
            <button class="add" type="button" data-add="${p.id}" aria-label="Adicionar ${esc(p.nome)} ${esc(p.vol)} ao carrinho">${I.mais}<span>Adicionar</span></button>
            <div class="qtd" aria-label="Quantidade de ${esc(p.nome)}"><button type="button" data-menos="${p.id}" aria-label="Tirar um">${I.menos}</button><output data-qtd="${p.id}">0</output><button type="button" data-mais="${p.id}" aria-label="Pôr mais um">${I.mais}</button></div>
          </div>`;
const foto = (p, lazy = true) => (p.foto
  ? `<div class="prod-foto"><img src="${imgDe(p)}" alt="${esc(p.nome)} ${esc(p.vol)}" width="640" height="640"${lazy ? ' loading="lazy"' : ''}></div>`
  : `<div class="prod-foto prod-logo" style="--fundo:${p.fundo}"><img src="${imgDe(p)}" alt="Logo ${esc(p.marca)}"${lazy ? ' loading="lazy"' : ''}><span>Foto ilustrativa</span></div>`);
const card = (p, cls = '', lazy = true) => `<article class="prod ${cls}" data-id="${p.id}" data-cat="${p.cat}" data-busca="${esc(normal(`${p.nome} ${p.marca} ${p.vol} ${cat[p.cat].nome}`))}"${alc(p) ? ' data-alc' : ''}>
          ${foto(p, lazy)}
          <div class="prod-info"><span class="prod-marca">${esc(p.marca)}</span><h3>${esc(p.nome)}</h3><span class="prod-vol">${esc(p.vol)}</span>${p.nota ? `<span class="prod-nota">${esc(p.nota)}</span>` : ''}</div>
          <div class="prod-pe">${preco(p.preco)}${compra(p)}</div>
        </article>`;

// catálogo intercalando as categorias, para o "Tudo" já começar variado
const filas = C.categorias.map((c) => C.produtos.filter((p) => p.cat === c.id));
const misturados = [];
for (let i = 0; filas.some((f) => f[i]); i++) filas.forEach((f) => { if (f[i]) misturados.push(f[i]); });

const contagem = (id) => C.produtos.filter((p) => p.cat === id).length;
const categorias = C.categorias.map((c, i) => `<li class="revela"${c.alc ? ' data-alc' : ''}><button type="button" class="cat${i === 0 ? ' cat-grande' : ''}" data-filtro="${c.id}">
          <img src="assets/img/${c.foto}.webp" alt="${esc(c.alt)}" loading="lazy">
          <span class="cat-txt"><b>${c.nome}</b><small>${contagem(c.id)} opções</small></span>
          <span class="cat-ir" aria-hidden="true">${I.seta}</span>
        </button></li>`).join('\n        ');

const chips = [['tudo', 'Tudo'], ...C.categorias.map((c) => [c.id, c.nome, c.alc])]
  .map(([id, nome, a]) => `<button type="button" class="chip${id === 'tudo' ? ' on' : ''}" data-chip="${id}" aria-pressed="${id === 'tudo'}"${a ? ' data-alc' : ''}>${nome}</button>`).join('');

const logos = C.marcas.map(([n, arq]) => `<button type="button" class="logo-marca" data-marca="${esc(n)}" aria-label="Ver bebidas ${esc(n)}"><img src="assets/logos/${arq}" alt="${esc(n)}" loading="lazy"></button>`).join('');
const esteiraLogos = `<div class="esteira-trilho">${logos}${logos.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ')}</div>`;

const kitTotal = (k) => k.itens.reduce((s, [id, q]) => s + porId[id].preco * q, 0);
const kitAlc = (k) => k.itens.some(([id]) => alc(porId[id]));
const kits = C.kits.map((k, i) => `<article class="kit${i ? '' : ' kit-grande'} revela"${kitAlc(k) ? ' data-alc' : ''}>
        <img class="kit-foto" src="assets/img/${k.foto}.webp" alt="${esc(k.alt)}" loading="lazy">
        <div class="kit-txt">
          <h3>${k.nome}</h3>
          <p>${esc(k.texto)}</p>
          <ul>${k.itens.map(([id, q]) => `<li><b>${q}x</b> ${esc(porId[id].nome)} <span>${esc(porId[id].vol)}</span></li>`).join('')}</ul>
          <div class="kit-pe"><span class="kit-preco"><small>leva tudo por</small>${real(kitTotal(k))}</span><button type="button" class="btn btn-tampa" data-kit="${k.id}">${I.engradado}<span>Pôr o kit no carrinho</span></button></div>
        </div>
      </article>`).join('\n      ');

const promessas = C.promessas.map(([ic, t, d]) => `<li class="revela"><span class="prom-ic">${I[ic]}</span><div><b>${t}</b><p>${d}</p></div></li>`).join('');

const extras = C.extras.map((id) => porId[id]).map((p) => `<li class="extra"><span class="mini"><img src="${imgDe(p)}" alt="" loading="lazy"></span><div><b>${esc(p.nome)}</b><span>${esc(p.vol)} por ${real(p.preco)}</span></div>${compra(p)}</li>`).join('');

const dias = C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th>${d}</th><td>${h}</td></tr>`).join('');

const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Bebida gelada com entrega na ${M.bairro}, BH</title>
<meta name="description" content="Adega e conveniência na ${M.bairro}, BH: cervejas, refrigerantes, energéticos, destilados, drinks, chás, água e gelo. Monte o carrinho e peça pelo WhatsApp. Também no iFood e 99Food.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#2A1A12">
${T.head('tampinha-bronze-tema')}
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Bebida gelada na porta: monte o carrinho e feche o pedido pelo WhatsApp.">
<meta property="og:image" content="assets/img/capa.webp">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/img/capa.webp">
<script>document.documentElement.classList.add("js");try{if(localStorage.getItem("tampinha-idade")==="nao")document.documentElement.classList.add("sem-alcool")}catch(e){}</script>
${fontes}
<style>
${css}
</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'LiquorStore', name: M.completo, telephone: M.telefone, email: M.email,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  openingHours: ['Mo-Th 10:00-23:00', 'Fr-Sa 10:00-01:00', 'Su 10:00-22:00'],
})}</script>
</head>
<body>
<a class="pular" href="#catalogo">Pular para as bebidas</a>

<div class="idade" id="idade" role="dialog" aria-modal="true" aria-labelledby="idade-t" hidden>
  <div class="idade-caixa">
    <img class="idade-foto" src="assets/img/brinde.webp" alt="" width="1400" height="933">
    <div class="idade-txt">
      <h2 id="idade-t">Antes de entrar: você tem 18 anos ou mais?</h2>
      <p>Vendemos bebida alcoólica só para maiores de idade. Se ainda não tiver 18, mostramos apenas refrigerante, água, chá, suco e energético.</p>
      <div class="idade-btns"><button type="button" class="btn btn-tampa" data-idade="sim">Tenho 18 ou mais</button><button type="button" class="btn btn-linha" data-idade="nao">Ainda não tenho</button></div>
    </div>
  </div>
</div>

<header class="topo" id="topo">
  <div class="barra-sup">
    <div class="wrap">
      <span>Entrega grátis a partir de ${real(C.entrega.gratisAcima)} na ${M.bairro} e região</span>
      <span class="status" data-status>Entregas das 10h às 23h</span>
    </div>
  </div>
  <div class="nav">
    <div class="wrap">
      <a class="logo" href="#inicio" aria-label="${M.completo}, voltar ao início">${I.logo}</a>
      <nav class="menu" id="menu" aria-label="Principal">
        <a href="#categorias">Categorias</a>
        <a href="#catalogo">Bebidas</a>
        <a href="#kits">Kits</a>
        <a href="#nos">Quem somos</a>
        <a href="#entrega">Entrega</a>
        <div class="menu-tema"><span>Tema do site</span>${T.pilula('deitada', 'claro')}</div>
      </nav>
      <a class="nav-whats" href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener">${I.whats}<span>${M.whatsappTexto}</span></a>
      <button class="carrinho-btn" type="button" data-abrir-carrinho aria-label="Abrir carrinho">${I.engradado}<b data-conta>0</b><span data-total-nav>R$ 0,00</span></button>
      <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>
${T.pilula('tema-lado', 'claro')}

<main>
  <section class="capa" id="inicio">
    <img class="capa-foto" src="assets/img/capa.webp" alt="Amigos brindando com cerveja num bar" width="2000" height="1333" fetchpriority="high">
    <div class="wrap capa-grid">
      <div class="capa-txt">
        <p class="apoio revela">Adega e conveniência na ${M.bairro}, BH</p>
        <h1 class="revela">A cerveja gelada chega antes da <em>turma.</em></h1>
        <p class="capa-sub revela">Cerveja, refri, energético, destilado e gelo com preço de distribuidora. Monte o carrinho aqui e o pedido chega pronto no nosso WhatsApp.</p>
        <div class="capa-btns revela"><a class="btn btn-tampa" href="#catalogo">${I.engradado}Montar meu pedido</a><a class="btn btn-claro" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener">${I.whats}Chamar no WhatsApp</a></div>
        <ul class="capa-selos revela">
          <li>${I.cadeado}<span>Site 100% seguro</span></li>
          <li><img src="assets/logos/ifood.svg" alt="iFood" class="selo-ifood"><span>e 99Food</span></li>
          <li>${I.moto}<span>Entrega em ${C.entrega.tempo}</span></li>
        </ul>
      </div>
      <aside class="atende revela" aria-label="Atendimento">
        <img src="assets/img/balcao.webp" alt="${M.atendente}, atendente da ${M.nome}, no balcão da adega" width="1400" height="933">
        <div>
          <b>${M.atendente}, do balcão</b>
          <p>"Mandou o pedido, eu confiro e já separo da câmara fria. Em poucos minutos te respondo."</p>
          <span class="online" data-online>Respondendo agora no WhatsApp</span>
        </div>
      </aside>
    </div>
  </section>

  <section class="marcas" aria-labelledby="marcas-t">
    <div class="wrap marcas-cab"><h2 id="marcas-t">As marcas que você já conhece</h2><p>Toque num logo para ver o que temos da marca.</p></div>
    <div class="esteira">${esteiraLogos}</div>
  </section>

  <section class="promessas" aria-label="Por que pedir na ${M.nome}">
    <ul class="wrap">${promessas}</ul>
  </section>

  <section class="categorias" id="categorias">
    <div class="wrap">
      <div class="cab revela">
        <h2>O que vai gelar hoje?</h2>
        <p>Escolha uma categoria e a gente separa as bebidas para você.</p>
      </div>
      <ul class="cats">
        ${categorias}
      </ul>
    </div>
  </section>

  <section class="destaques" id="destaques">
    <div class="wrap">
      <div class="cab cab-linha revela">
        <div><h2>Os que mais saem do freezer</h2><p>Os pedidos campeões da semana, já gelados.</p></div>
        <div class="setas"><button type="button" data-rolar="-1" aria-label="Voltar">${I.esq}</button><button type="button" data-rolar="1" aria-label="Avançar">${I.dir}</button></div>
      </div>
      <div class="carrossel" data-carrossel tabindex="0" aria-label="Bebidas mais pedidas">
        ${C.destaques.map((id) => card(porId[id], 'prod-carr')).join('\n        ')}
      </div>
      <div class="progresso" aria-hidden="true"><i data-progresso></i></div>
    </div>
  </section>

  <section class="catalogo" id="catalogo">
    <div class="wrap">
      <div class="cab revela">
        <h2>Tudo o que tem na câmara fria</h2>
        <p>Filtre por categoria ou procure pela marca. Os preços valem para pedidos pelo site e pelo WhatsApp.</p>
      </div>
      <div class="filtros">
        <div class="chips" data-iguais role="group" aria-label="Categorias">${chips}</div>
        <label class="busca">${I.busca}<input type="search" placeholder="Procurar bebida ou marca" aria-label="Procurar bebida ou marca" data-busca-input><button type="button" data-limpar aria-label="Limpar busca" hidden>${I.fechar}</button></label>
      </div>
      <p class="achados" data-achados aria-live="polite"></p>
      <div class="grade" data-grade>
        ${misturados.map((p) => card(p)).join('\n        ')}
      </div>
      <div class="ver-mais"><button type="button" class="btn btn-linha" data-ver-mais>${I.mais}<span>Ver as outras bebidas</span></button></div>
      <div class="vazio" data-vazio hidden><p>Não achamos essa bebida no site, mas pode ser que tenha no estoque. Pergunte no WhatsApp: se não tiver, a gente tenta conseguir.</p><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Vocês têm `)}" target="_blank" rel="noopener">${I.whats}Perguntar no WhatsApp</a></div>
    </div>
  </section>

  <section class="kits" id="kits">
    <div class="wrap">
      <div class="cab revela">
        <h2>Kits prontos para não esquecer nada</h2>
        <p>Um toque e tudo vai para o carrinho. Dá para mudar as quantidades depois.</p>
      </div>
      <div class="kits-grade">
      ${kits}
      </div>
    </div>
  </section>

  <section class="nos" id="nos">
    <div class="wrap nos-grid">
      <div class="nos-fotos revela">
        <img class="nos-f1" src="assets/img/geladeira.webp" alt="Geladeira da adega cheia de latas geladas" loading="lazy">
        <img class="nos-f2" src="assets/img/entrega.webp" alt="Atendente entregando a sacola do pedido para o cliente" loading="lazy">
      </div>
      <div class="nos-txt revela">
        <p class="apoio">Quem somos</p>
        <h2>A adega da esquina, agora no seu celular.</h2>
        <p>A ${M.nome} abriu em ${M.desde} como uma portinha na ${M.endereco.split(',')[0]}, com uma geladeira e muita vontade de atender bem o bairro. Hoje são três câmaras frias, entregadores da casa e o mesmo cuidado de sempre: quem pede no WhatsApp fala com a gente, não com robô.</p>
        <p>Conferimos a validade de tudo, trocamos casco de cerveja retornável e, se a bebida que você quer não estiver no site, a gente tenta conseguir.</p>
        <dl class="numeros">${C.numeros.map(([n, t]) => `<div><dt>${n}</dt><dd>${t}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </section>

  <section class="como" id="como">
    <div class="wrap como-grid">
      <img class="como-foto revela" src="assets/img/celular.webp" alt="Mão segurando o celular com um aplicativo de pedidos aberto" loading="lazy">
      <div class="como-txt">
        <div class="cab revela"><h2>Do carrinho ao WhatsApp em um minuto</h2></div>
        <ol class="passos">
          <li class="revela"><span class="passo-ic">${I.engradado}</span><div><h3>Escolha as bebidas</h3><p>Toque em "Adicionar" em cada uma. O carrinho guarda tudo, mesmo se você fechar a página.</p></div></li>
          <li class="revela"><span class="passo-ic">${I.balao}</span><div><h3>Diga como quer receber</h3><p>Entrega ou retirada no balcão, forma de pagamento e alguma observação, se tiver.</p></div></li>
          <li class="revela"><span class="passo-ic">${I.whats}</span><div><h3>Envie no WhatsApp</h3><p>O pedido abre pronto na conversa com a gente. É só mandar e aguardar a confirmação.</p></div></li>
        </ol>
        <div class="seguro revela">${I.cadeado}<div><b>Site 100% seguro</b><p>Conexão protegida do começo ao fim. Você não digita cartão nem senha por aqui: o pagamento é feito na entrega, por Pix, cartão ou dinheiro.</p></div></div>
      </div>
    </div>
  </section>

  <section class="entrega" id="entrega">
    <div class="wrap entrega-grid">
      <div class="entrega-info revela">
        <h2>Entrega gelada em ${C.entrega.tempo}</h2>
        <p>Nossos entregadores saem da ${M.bairro} com a bebida em bolsa térmica. Taxa de ${real(C.entrega.taxa)}, grátis a partir de ${real(C.entrega.gratisAcima)} em compras. Também dá para retirar no balcão.</p>
        <table class="horarios"><caption>Horário de entrega</caption><tbody>${dias}</tbody></table>
      </div>
      <div class="entrega-foto revela">
        <img src="assets/img/moto.webp" alt="Entregador de moto com a caixa de entregas" loading="lazy">
        <div class="apps">
          <h3>Prefere pedir pelo aplicativo?</h3>
          <p>Também estamos no iFood e no 99Food, com o mesmo estoque.</p>
          <div class="apps-btns">
            <a class="app app-ifood" href="${M.ifood}" target="_blank" rel="noopener" aria-label="Pedir no iFood"><img src="assets/logos/ifood.svg" alt="iFood"></a>
            <a class="app app-99" href="${M.food99}" target="_blank" rel="noopener"><b>99Food</b></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="duvidas" aria-labelledby="duvidas-t">
    <div class="wrap duvidas-grid">
      <div class="cab revela"><h2 id="duvidas-t">Ficou alguma dúvida?</h2><p>Se não estiver aqui, pergunte no WhatsApp. Quem responde é o ${M.atendente}.</p><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">${I.whats}Perguntar</a></div>
      <div class="faq">${C.faq.map(([q, r]) => `<details class="revela"><summary>${q}<i aria-hidden="true">${I.mais}</i></summary><p>${r}</p></details>`).join('')}</div>
    </div>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_floresta.webp" alt="Mapa da Floresta, Belo Horizonte, com a localização da Tampinha Bebidas" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${enderecoCompleto}</span><span>Todos os dias a partir das 10h</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Entregamos nos bairros abaixo. Mora perto e não achou o seu? Chame no WhatsApp.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Bebidas</h3><ul>${C.categorias.map((c) => `<li${c.alc ? ' data-alc' : ''}><a href="#catalogo" data-filtro="${c.id}">${c.nome}</a></li>`).join('')}</ul></div>
      <div><h3>Fale com a gente</h3><ul><li><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li>${M.email}</li><li>${M.endereco}, ${M.bairro}</li></ul></div>
      <div><h3>Redes</h3>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
        <p class="user">${M.instagramUser}</p>
        <div class="rodape-seguro">${I.cadeado}<span>Site 100% seguro</span></div>
      </div>
    </div>
    <p class="aviso18">Beba com moderação. Venda e entrega de bebida alcoólica proibidas para menores de 18 anos. Se for dirigir, não beba. <button type="button" data-rever-idade>Rever confirmação de idade</button></p>
    <details class="creditos"><summary>Créditos das imagens</summary><p>Fotos do Unsplash (licença Unsplash) e do Wikimedia Commons. Logos das marcas do Wikimedia Commons, usados só para identificar os produtos vendidos; as marcas pertencem aos seus donos.</p><ul>${listaCreditos}</ul></details>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Preços ilustrativos.</span></div>
  </div>
</footer>

<div class="barra-carrinho" data-barra hidden><button type="button" data-abrir-carrinho>${I.engradado}<span><b data-conta>0</b> itens</span><strong data-total-nav>R$ 0,00</strong><em>Ver pedido</em></button></div>
<a class="whats-flutua" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>

<div class="veu" data-veu hidden></div>
<aside class="carrinho" id="carrinho" aria-label="Seu pedido" aria-hidden="true">
  <div class="car-topo"><h2>${I.engradado}Seu pedido</h2><button type="button" class="car-fechar" data-fechar-carrinho aria-label="Fechar carrinho">${I.fechar}</button></div>
  <div class="car-corpo">
    <div class="frete" data-frete><p data-frete-txt></p><div class="frete-barra"><i data-frete-barra></i></div></div>
    <ul class="car-itens" data-itens></ul>
    <div class="car-vazio" data-car-vazio><img src="assets/img/latas-gelo.webp" alt="" loading="lazy"><p>Seu carrinho está vazio. Escolha uma bebida e toque em "Adicionar".</p><button type="button" class="btn btn-linha" data-fechar-carrinho data-ir="catalogo">Ver as bebidas</button></div>
    <div class="leve"><h3>Leve também</h3><ul>${extras}</ul></div>
    <form class="pedido" data-pedido novalidate>
      <h3>Para quem e como</h3>
      <label class="campo"><span>Seu nome</span><input name="nome" type="text" autocomplete="name" required></label>
      <fieldset class="opcoes"><legend>Receber</legend><div data-iguais>
        <label><input type="radio" name="receber" value="entrega" checked><span>Entrega</span></label>
        <label><input type="radio" name="receber" value="retirada"><span>Retirar no balcão</span></label>
      </div></fieldset>
      <label class="campo" data-endereco><span>Endereço com número e bairro</span><input name="endereco" type="text" autocomplete="street-address"></label>
      <fieldset class="opcoes"><legend>Pagamento na entrega</legend><div data-iguais>
        <label><input type="radio" name="pag" value="Pix" checked><span>Pix</span></label>
        <label><input type="radio" name="pag" value="Cartão na maquininha"><span>Cartão</span></label>
        <label><input type="radio" name="pag" value="Dinheiro"><span>Dinheiro</span></label>
      </div></fieldset>
      <label class="campo" data-troco hidden><span>Troco para quanto?</span><input name="troco" type="text" inputmode="decimal" placeholder="Ex.: 100"></label>
      <label class="campo"><span>Observação</span><input name="obs" type="text" placeholder="Ex.: interfone 302, bem gelada"></label>
      <p class="erro" data-erro role="alert"></p>
    </form>
  </div>
  <div class="car-pe">
    <dl class="contas"><div><dt>Produtos</dt><dd data-subtotal>R$ 0,00</dd></div><div><dt>Entrega</dt><dd data-taxa>R$ 0,00</dd></div><div class="total"><dt>Total</dt><dd data-total>R$ 0,00</dd></div></dl>
    <button type="button" class="btn btn-tampa btn-enviar" data-enviar>${I.whats}Enviar pedido no WhatsApp</button>
    <p class="car-seguro">${I.cadeado}Site 100% seguro. Você paga só quando receber.</p>
  </div>
</aside>

<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
