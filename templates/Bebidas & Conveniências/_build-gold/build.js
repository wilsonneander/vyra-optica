// Gera o modelo Gold de bebidas e conveniência (Tampinha) em "templates/Bebidas & Conveniências/site-gold/".
// Gold: preto, dourado #B08D57 e branco. Uma página só, com a lata da casa em 3D girando com a rolagem (Three.js, sem CDN).
// Fotos de produto e ambiente vêm do Silver (../_build-silver/img/fotos); fotos de pessoas ficam em img/pessoas/.
// Uso: node "templates/Bebidas & Conveniências/_build-gold/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const H = require('./horario');
const medidas = require('../_build-silver/img/fotos/medidas.json');

const OUT = path.join(__dirname, '..', 'site-gold');
const FOTOS = path.join(__dirname, '..', '_build-silver', 'img', 'fotos');
const M = C.marca;
const R = C.reserva;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = M.telefone.replace(/\D/g, '');
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// a lata da casa entra no catálogo como cerveja
const reservaProd = { id: 'reserva', cat: 'cerveja', nome: R.nome, vol: R.vol, preco: R.preco, marca: 'Tampinha', cor: '#B08D57', foto: 'reserva', propria: true };
const todos = [reservaProd, ...C.produtos, ...C.extras];
const porId = Object.fromEntries(todos.map((p) => [p.id, p]));
const cat = Object.fromEntries(C.categorias.map((c) => [c.id, c]));
const alc = (p) => (p.alc !== undefined ? p.alc : Boolean(cat[p.cat] && cat[p.cat].alc));

// medidas das fotos: as do Silver, as de pessoas (lidas do cabeçalho do WebP) e a arte da lata
const tamanhoWebp = (f) => {
  const b = fs.readFileSync(f);
  const tipo = b.toString('ascii', 12, 16);
  if (tipo === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (tipo === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  const n = b.readUInt32LE(21);
  return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
};
const pessoas = fs.readdirSync(path.join(__dirname, 'img', 'pessoas')).filter((f) => f.endsWith('.webp'));
for (const f of pessoas) medidas['pessoas/' + f.replace('.webp', '')] = tamanhoWebp(path.join(__dirname, 'img', 'pessoas', f));

// foto de produto (recorte transparente) ou de ambiente (drinks); alt vazio quando é repetição decorativa
const foto = (p, { cls = '', alt = true, lazy = true } = {}) => {
  if (p.propria) return `<img class="arte arte-lata${cls ? ' ' + cls : ''}" src="assets/img/reserva.svg" alt="${alt ? esc(`${p.nome} ${p.vol}`) : ''}" width="120" height="260"${lazy ? ' loading="lazy"' : ''} decoding="async" data-arte="${p.id}">`;
  const k = `${p.amb ? 'ambiente' : 'produtos'}/${p.foto}`;
  const [w, h] = medidas[k];
  return `<img class="arte${p.amb ? ' arte-amb' : ''}${cls ? ' ' + cls : ''}" src="assets/img/${k}.webp" alt="${alt ? esc(`${p.nome} ${p.vol}`) : ''}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async" data-arte="${p.id}">`;
};
const imgDe = (k, alt = '', cls = '', lazy = true) => { const [w, h] = medidas[k]; return `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${k}.webp" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`; };
const caminho = (p) => (p.propria ? 'assets/img/reserva.svg' : `assets/img/${p.amb ? 'ambiente' : 'produtos'}/${p.foto}.webp`);

// ---------- dados da loja (o site e a Área do Cliente leem; o painel publica por cima no navegador) ----------
const destaqueIds = new Set(['reserva', ...C.destaques]);
const catalogoBase = [reservaProd, ...C.produtos];
const dadosLoja = {
  categorias: C.categorias.map((c) => ({ id: c.id, nome: c.nome, ...(c.chip ? { chip: c.chip } : {}), ...(c.alc ? { alc: true } : {}) })),
  produtos: catalogoBase.map((p) => ({
    id: p.id, cat: p.cat, nome: p.nome, vol: p.vol, preco: p.preco, marca: p.marca || '', cor: p.cor, img: caminho(p),
    ...(p.amb ? { amb: true } : {}), alc: alc(p), ...(destaqueIds.has(p.id) ? { destaque: true } : {}),
  })),
  abertura: C.abertura,
  extras: C.extras.map((p) => p.id),
  acesso: C.acesso,
  galeria: [...C.produtos.filter((p) => !p.amb).map(caminho), 'assets/img/reserva.svg', ...C.produtos.filter((p) => p.amb).map(caminho)],
};
const dadosJson = JSON.stringify(dadosLoja).replace(/</g, '\\u003c');

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
// cópia arquivo por arquivo (fs.cpSync derruba o Node 24 no Windows com acento no caminho)
const copiaPasta = (de, para) => { fs.mkdirSync(para, { recursive: true }); for (const f of fs.readdirSync(de)) fs.copyFileSync(path.join(de, f), path.join(para, f)); };
for (const d of ['produtos', 'ambiente', 'logos']) copiaPasta(path.join(FOTOS, d), path.join(OUT, 'assets', 'img', d));
copiaPasta(path.join(__dirname, 'img', 'pessoas'), path.join(OUT, 'assets', 'img', 'pessoas'));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_floresta_ouro.webp'), path.join(OUT, 'assets', 'img', 'mapa_floresta_ouro.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'img', 'reserva.svg'), I.lataReserva);
for (const f of ['style.css', 'painel.css', 'painel.js', 'loja.js', 'horario.js']) fs.copyFileSync(path.join(__dirname, f), path.join(OUT, 'assets', f));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

// Three.js vem como módulo ES; vira script comum (window.THREE) para o site abrir até direto do arquivo, sem servidor
const three = fs.readFileSync(path.join(__dirname, 'vendor', 'three.module.min.js'), 'utf8');
const iExp = three.lastIndexOf('export{');
const nomes = three.slice(iExp + 7, three.indexOf('}', iExp)).split(',').map((par) => { const [a, b] = par.split(' as '); return `${(b || a).trim()}:${a.trim()}`; });
fs.writeFileSync(path.join(OUT, 'assets', 'three.min.js'), `/* three.js r160, MIT */\n(function(){${three.slice(0, iExp)}\nwindow.THREE={${nomes.join(',')}};})();\n`);

fs.writeFileSync(path.join(OUT, 'assets', 'lata.js'), fs.readFileSync(path.join(__dirname, 'lata.js'), 'utf8')
  .replace('/*RESERVA*/', JSON.stringify({ nome: R.nome, estilo: R.estilo, capitulos: R.capitulos.length })));
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({
    whatsapp: M.whatsapp, nome: M.nome, abertura: C.abertura, entrega: C.entrega,
    produtos: Object.fromEntries(todos.map((p) => [p.id, { n: p.nome, v: p.vol, p: p.preco, c: p.cat, a: alc(p) ? 1 : 0 }])),
    cats: Object.fromEntries([...C.categorias.map((c) => [c.id, c.nome]), ['extra', 'Conveniência']]),
    kits: Object.fromEntries(C.kits.map((k) => [k.id, k.itens])),
  })));

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500&family=Familjen+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">';

// ---------- peças ----------
const preco = (v) => { const [r, c] = v.toFixed(2).split('.'); return `<span class="etiqueta"><small>R$</small>${r}<i>,${c}</i></span>`; };
const compra = (p) => `<div class="compra" data-compra="${p.id}">
            <button class="add" type="button" data-add="${p.id}" aria-label="Pôr ${esc(p.nome)} ${p.vol} no carrinho">${I.mais}<span>Adicionar</span></button>
            <div class="qtd" aria-label="Quantidade de ${esc(p.nome)}"><button type="button" data-menos="${p.id}" aria-label="Tirar um">${I.menos}</button><output data-qtd="${p.id}">0</output><button type="button" data-mais="${p.id}" aria-label="Pôr mais um">${I.mais}</button></div>
          </div>`;
const card = (p, cls = '') => `<article class="card${p.amb ? ' card-amb' : ''}${cls ? ' ' + cls : ''}" data-id="${p.id}" data-cat="${p.cat}" data-marca="${esc(p.marca || '')}" data-preco="${p.preco}" data-busca="${esc(normal(`${p.nome} ${p.marca || ''} ${p.vol} ${cat[p.cat] ? cat[p.cat].nome : ''}`))}"${alc(p) ? ' data-alc' : ''} style="--tinta:${p.cor}">
          <div class="card-arte" data-tilt><span class="card-halo"></span>${foto(p)}</div>
          <div class="card-info"><small>${esc(p.marca || cat[p.cat].nome)}${alc(p) ? '<em>+18</em>' : ''}</small><h3>${esc(p.nome)}</h3><span>${p.vol}</span></div>
          <div class="card-pe">${preco(p.preco)}${compra(p)}</div>
        </article>`;

// capa: três garrafas em pé sobre a água, cada uma com reflexo e anéis na água
const altura = { 'heineken-ln': 0.8, 'red-label': 1, tanqueray: 0.9, 'coca-vidro': 0.72 };
const garrafas = C.vitrine.map((id, i) => {
  const p = porId[id];
  return `<figure class="garrafa g${i}" style="--h:${altura[id] || 0.85};--i:${i}">
          <div class="garrafa-corpo">${foto(p, { lazy: false })}</div>
          <div class="garrafa-reflexo" aria-hidden="true">${foto(p, { alt: false, lazy: false })}</div>
          <span class="anel" aria-hidden="true"></span><span class="anel a2" aria-hidden="true"></span>
          <figcaption><b>${esc(p.marca)}</b>${preco(p.preco)}</figcaption>
        </figure>`;
}).join('\n        ');

const fitaItens = [`Entrega em ${C.entrega.tempo}`, 'Parceiro iFood', 'Parceiro 99Food', 'Site 100% seguro', 'Atendimento no WhatsApp', `Grátis acima de ${real(C.entrega.gratisAcima)}`];
const fita = fitaItens.map((t) => `<span>${esc(t)}</span><i>${I.tampaPura}</i>`).join('');

// mosaico de momentos (fotos de gente)
const momentos = C.momentos.map((m, i) => `<figure class="mom m${i}">
          <div class="mom-img" data-paralaxe-in>${imgDe('pessoas/' + m.foto, m.alt)}</div>
          <figcaption>${esc(m.legenda)}</figcaption>
        </figure>`).join('\n        ');

// a lata 3D: capítulos de texto que trocam com a rolagem
const capitulos = R.capitulos.map((c, i) => `<div class="cap${i ? '' : ' on'}" data-cap="${i}">
            <h3>${esc(c.titulo)}</h3>
            <p>${esc(c.texto)}</p>
          </div>`).join('\n          ');
const marcadores = R.capitulos.map((c, i) => `<li data-marca-cap="${i}"${i ? '' : ' class="on"'}><span>${esc(c.titulo)}</span></li>`).join('');
const ficha = R.ficha.map(([k, v]) => `<li><span>${k}</span><b>${esc(v)}</b></li>`).join('');

// categorias em índice editorial: nome grande, contagem e as garrafas aparecendo no hover
const contagem = (id) => C.produtos.filter((p) => p.cat === id).length + (id === 'cerveja' ? 1 : 0);
const indice = C.categorias.map((c) => {
  const artes = c.vitrine.length ? c.vitrine.map((id) => foto(porId[id], { alt: false })).join('') : imgDe('ambiente/' + c.fundo, '', 'ind-foto');
  return `<li><button type="button" class="ind" data-filtro="${c.id}" aria-label="${c.nome}: ver ${contagem(c.id)} opções">
            <span class="ind-nome">${c.nome}</span>
            <span class="ind-artes" aria-hidden="true">${artes}</span>
            <span class="ind-info">${contagem(c.id)} opções${c.alc ? ' <em>+18</em>' : ''}</span>
            <span class="ind-seta">${I.seta}</span>
          </button></li>`;
}).join('\n          ');

const chips = [['tudo', 'Tudo'], ...C.categorias.map((c) => [c.id, c.chip || c.nome])]
  .map(([id, nome]) => `<button type="button" class="chip${id === 'tudo' ? ' on' : ''}" data-chip="${id}" aria-pressed="${id === 'tudo'}">${nome}</button>`).join('');

const marcaBloco = ([n, , prod]) => `<button type="button" class="marca" data-marca="${esc(n)}" aria-label="Ver bebidas ${esc(n)}">${foto(porId[prod], { alt: false })}<span>${esc(n)}</span></button>`;
const esteira = () => { const b = C.marcas.map(marcaBloco).join(''); return `<div class="esteira"><div class="esteira-trilho">${b}${b.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ')}</div></div>`; };

const kitTotal = (k) => k.itens.reduce((s, [id, q]) => s + porId[id].preco * q, 0);
const kitFoto = { 'kit-churrasco': 'ambiente/amb-canecas', 'kit-esquenta': 'pessoas/brinde-noite', 'kit-gin': 'pessoas/gin' };
const kits = C.kits.map((k) => `<article class="kit">
          <div class="kit-foto">${imgDe(kitFoto[k.id], '')}</div>
          <div class="kit-arte">${k.arte.map((id, j) => foto(porId[id], { cls: j === 1 ? 'meio' : '', alt: j === 1 })).join('')}</div>
          <div class="kit-txt">
            <h3>${k.nome}</h3>
            <p>${esc(k.texto)}</p>
            <ul>${k.itens.map(([id, q]) => `<li><b>${q}x</b> ${esc(porId[id].nome)} <span>${porId[id].vol}</span></li>`).join('')}</ul>
            <div class="kit-pe"><span class="kit-preco"><small>leva tudo por</small>${real(kitTotal(k))}</span><button type="button" class="btn btn-ouro" data-kit="${k.id}">Pôr o kit no carrinho</button></div>
          </div>
        </article>`).join('\n        ');

const passos = C.passos.map(([ic, t, d]) => `<li class="passo"><span class="passo-ic">${I[ic]}</span><div><h3>${t}</h3><p>${esc(d)}</p></div></li>`).join('');

// selo de site seguro: texto girando em volta do cadeado (sem caractere separador, só espaço)
const selo = (cls = '') => `<div class="selo ${cls}" role="img" aria-label="Site 100% seguro">
          <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="selo-c${cls}" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0"/></defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
            <g class="selo-giro"><text font-size="13" fill="currentColor"><textPath href="#selo-c${cls}" textLength="482" lengthAdjust="spacing">SITE 100% SEGURO    COMPRA PROTEGIDA    </textPath></text></g>
            <circle cx="100" cy="100" r="54" fill="var(--ouro)"/>
            <g transform="translate(70 66) scale(2.5)" fill="none" stroke="#0B0A09" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5"/><path d="M12 14.5 V17"/></g>
          </svg>
        </div>`;

const faqs = C.faq.map(([q, r], i) => `<details class="faq-item"${i ? '' : ' open'}><summary><span>${esc(q)}</span><i>${I.mais}</i></summary><div class="faq-r"><p>${esc(r)}</p></div></details>`).join('\n          ');
const bairros = C.bairros.map((b) => `<li>${esc(b)}</li>`).join('');
// horário sai da abertura de cada dia (a mesma que a Área do Cliente edita)
const horarios = H.grupos(C.abertura).map(([d, h]) => `<li><span>${d}</span><b>${h}</b></li>`).join('');
const horarioTexto = H.texto(C.abertura);
const extras = C.extras.map((p) => `<div class="extra" data-id="${p.id}">${foto(p, { alt: false })}<div><b>${esc(p.nome)}</b><span>${p.vol}</span><strong>${real(p.preco)}</strong></div><button type="button" class="extra-add" data-add="${p.id}" aria-label="Pôr ${esc(p.nome)} no carrinho">${I.mais}</button></div>`).join('');
const destaques = catalogoBase.filter((p) => destaqueIds.has(p.id)).map((p) => card(p, 'card-g')).join('\n        ');
const catalogo = [reservaProd, ...C.produtos].map((p) => card(p)).join('\n        ');
const creditos = C.creditos.map(([f, id]) => `<a href="https://unsplash.com/photos/${id}" target="_blank" rel="noopener">${f}</a>`).join(', ');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Adega e conveniência com entrega em ${M.bairro}, BH</title>
<meta name="description" content="${esc(M.frase)} Cervejas, destilados, vinhos, drinks, energéticos e refrigerantes. Monte o carrinho e envie o pedido pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0B0A09">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="carregando">

<div class="preload" aria-hidden="true">
  <div class="pre-in">
    <div class="pre-tampa">${I.tampaPura}</div>
    <p class="pre-nome">TAMPINHA</p>
    <span class="pre-barra"><i></i></span>
  </div>
</div>

<a class="pular" href="#bebidas">Pular para as bebidas</a>

<header class="topo" data-topo>
  <div class="topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      <a href="#reserva">Reserva</a><a href="#bebidas">Bebidas</a><a href="#categorias">Categorias</a><a href="#momentos">Momentos</a><a href="#kits">Kits</a><a href="#entrega">Entrega</a>
      <a class="menu-area" href="painel.html">Área do cliente</a>
    </nav>
    <div class="topo-acoes">
      <span class="status" data-status>Aberto agora</span>
      <button type="button" class="topo-carrinho" data-abrir-carrinho aria-label="Abrir carrinho">${I.sacola}<span data-conta>0</span></button>
      <a class="btn btn-linha topo-pedir" href="painel.html">${I.pessoa}Área do cliente</a>
      <button type="button" class="hamb" data-hamb aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
    </div>
  </div>
</header>

<main>
  <section class="capa" id="inicio" data-capa>
    <div class="capa-luz" aria-hidden="true"></div>
    <div class="gotas" data-gotas aria-hidden="true"></div>
    <p class="capa-marca" aria-hidden="true">TAMPINHA</p>
    <div class="vitrine" data-vitrine>
        ${garrafas}
      <div class="agua" aria-hidden="true"></div>
    </div>
    <div class="capa-txt">
      <div>
        <p class="apoio">Adega e conveniência no ${M.bairro}, ${M.cidade.replace(', MG', '')}</p>
        <h1>A noite pede uma bebida <em>à altura.</em></h1>
      </div>
      <div class="capa-lado">
        <p>Destilados, vinhos, cervejas e a lata da casa. Tudo gelado, separado com cuidado e entregue na sua porta em ${C.entrega.tempo}.</p>
        <div class="capa-btns" data-iguais><a class="btn btn-ouro" href="#bebidas">Montar meu pedido</a><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener">${I.whats}Pedir no WhatsApp</a></div>
      </div>
    </div>
    <a class="capa-rolar" href="#reserva" aria-label="Rolar para baixo"><span></span></a>
  </section>

  <div class="fita" aria-label="Vantagens"><div class="fita-trilho">${fita}${fita}</div></div>

  <section class="reserva" id="reserva" data-reserva>
    <div class="reserva-palco">
      <canvas class="reserva-canvas" data-lata aria-hidden="true"></canvas>
      <img class="reserva-fixa" src="assets/img/reserva.svg" alt="" width="120" height="260" aria-hidden="true">
      <div class="reserva-txt">
        <p class="apoio">A lata da casa</p>
        <h2>${esc(R.nome)}</h2>
        <p class="reserva-estilo">${esc(R.estilo)}, ${R.vol}</p>
        <div class="caps" aria-live="polite">
          ${capitulos}
        </div>
      </div>
      <ol class="reserva-marcas" aria-hidden="true">${marcadores}</ol>
      <div class="reserva-compra" data-reserva-compra>
        <ul class="ficha">${ficha}</ul>
        <div class="reserva-pe">${preco(R.preco)}${compra(reservaProd)}</div>
      </div>
      <p class="reserva-dica" aria-hidden="true">Role para girar a lata</p>
    </div>
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
      <div class="mais-linha"><button type="button" class="btn btn-linha" data-ver-mais>Ver mais bebidas</button></div>
      <p class="vazio" data-vazio hidden>Não achamos essa bebida. Chama no <a href="${wa(`Olá, ${M.nome}! Vocês têm `)}" target="_blank" rel="noopener">WhatsApp</a> que a gente confere no estoque.</p>
    </div>
  </section>

  <section class="cats" id="categorias">
    <div class="wrap">
      <header class="sec-cab sec-dupla">
        <div><p class="apoio">Categorias</p><h2>O que vai na <em>sua mesa</em> hoje?</h2></div>
        <p class="sec-txt">Escolha uma categoria e o catálogo abre já filtrado.</p>
      </header>
      <ul class="indice" data-indice>
          ${indice}
      </ul>
    </div>
  </section>

  <section class="mais" id="mais-pedidos">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Seleção da casa</p><h2>Os preferidos da semana</h2></div>
        <div class="trilho-nav" data-iguais><button type="button" class="seta" data-trilho-ant aria-label="Anteriores">${I.esq}</button><button type="button" class="seta" data-trilho-prox aria-label="Próximos">${I.dir}</button></div>
      </header>
    </div>
    <div class="trilho" data-trilho tabindex="0" aria-label="Carrossel da seleção da casa">
        ${destaques}
    </div>
    <div class="wrap"><div class="trilho-barra"><span data-trilho-barra></span></div></div>
  </section>

  <section class="momentos" id="momentos">
    <div class="wrap">
      <header class="sec-cab sec-dupla">
        <div><p class="apoio">Momentos</p><h2>Bebida boa é a que <em>junta gente.</em></h2></div>
        <p class="sec-txt">Do happy hour na varanda ao brinde de madrugada, a Tampinha separa a bebida certa para cada noite e entrega gelada, do jeito que a turma gosta.</p>
      </header>
      <div class="mosaico">
        ${momentos}
      </div>
    </div>
  </section>

  <section class="faixa-foto" aria-label="Brinde">
    <div class="faixa-img" data-paralaxe>${imgDe('pessoas/brinde', 'Amigos brindando com copos de cerveja e drinks')}</div>
    <div class="wrap faixa-txt">
      <p class="faixa-frase">O gelo, o copo e a bebida certa. <em>O resto é com a sua turma.</em></p>
      <button type="button" class="btn btn-ouro" data-ir-cat="cerveja">Ver as cervejas</button>
    </div>
  </section>

  <section class="marcas" id="marcas">
    <div class="wrap">
      <header class="sec-cab sec-linha">
        <div><p class="apoio">Marcas</p><h2>As marcas que você já conhece</h2></div>
        <p class="sec-txt">Toque numa marca para ver só as bebidas dela.</p>
      </header>
    </div>
    ${esteira()}
  </section>

  <section class="kits" id="kits">
    <div class="wrap">
      <header class="sec-cab sec-dupla">
        <div><p class="apoio">Kits prontos</p><h2>A noite montada <em>em um toque.</em></h2></div>
        <p class="sec-txt">Os kits entram no carrinho item por item, então dá para tirar ou pôr mais depois.</p>
      </header>
      <div class="kits-lista">
        ${kits}
      </div>
    </div>
  </section>

  <section class="como" id="como-pedir">
    <div class="wrap como-in">
      <div class="como-esq">
        <header class="sec-cab">
          <p class="apoio">Pedido pelo WhatsApp</p>
          <h2>Do carrinho para a conversa, <em>já organizado.</em></h2>
          <p class="sec-txt">O site separa o pedido por categoria, soma tudo e monta a mensagem. Você só confere e envia.</p>
        </header>
        <ol class="passos" data-como><span class="passos-linha" aria-hidden="true"><i></i></span>${passos}</ol>
      </div>
      <div class="como-dir">
        <div class="como-foto">${imgDe('pessoas/rooftop', 'Casal brindando com drinks num terraço')}</div>
        <div class="msg-bolha" aria-label="Exemplo da mensagem que chega no WhatsApp">
          <b>Pedido Tampinha</b>
          <span><u>Cervejas</u>6x Tampinha Reserva lata 473ml</span>
          <span><u>Destilados</u>1x Gin Tanqueray London Dry</span>
          <span><u>Refrigerantes</u>6x Água Tônica Schweppes</span>
          <span><u>Total</u>R$ 218,04 com entrega grátis</span>
          <span><u>Pagamento</u>Pix</span>
          <small>enviado agora</small>
        </div>
      </div>
    </div>
  </section>

  <section class="entrega" id="entrega">
    <div class="wrap entrega-in">
      <div class="entrega-txt">
        <p class="apoio">Entrega e parceiros</p>
        <h2>Gelada na sua porta em <em>${C.entrega.tempo}.</em></h2>
        <ul class="entrega-dados">
          <li><span>Taxa de entrega</span><b>${real(C.entrega.taxa)}</b></li>
          <li><span>Entrega grátis</span><b>acima de ${real(C.entrega.gratisAcima)}</b></li>
          <li><span>Retirada no balcão</span><b>sem taxa</b></li>
          <li><span>Pagamento</span><b>Pix, cartão ou dinheiro na entrega</b></li>
        </ul>
        <p class="parceiros-txt">Prefere pedir pelo aplicativo? Estamos no iFood e no 99Food com o mesmo estoque.</p>
        <div class="parceiros" data-iguais>
          <a class="parc parc-ifood" href="${M.ifood}" target="_blank" rel="noopener">${imgDe('logos/logo-ifood', 'iFood')}<span>Pedir no iFood</span></a>
          <a class="parc parc-99" href="${M.food99}" target="_blank" rel="noopener">${imgDe('logos/logo-99food-largo', '99Food')}<span>Pedir no 99Food</span></a>
        </div>
      </div>
      <div class="entrega-lado">
        <div class="entrega-foto">${imgDe('pessoas/moto', 'Entregador de moto numa rua da cidade')}</div>
        <div class="seguro">
          ${selo()}
          <div>
            <h3>Site 100% seguro</h3>
            <p>Conexão criptografada do começo ao fim. Aqui você não digita cartão nem senha: o pedido vai para o WhatsApp e o pagamento é feito na entrega ou na retirada.</p>
          </div>
        </div>
        <a class="atendimento" href="${wa(`Olá, ${M.nome}! Preciso de ajuda com um pedido.`)}" target="_blank" rel="noopener">
          <span class="atend-ic">${I.whats}</span>
          <span><b>Atendimento no WhatsApp</b>Gente de verdade do outro lado, do pedido até a entrega. ${M.whatsappTexto}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="duvidas" id="duvidas">
    <div class="wrap duvidas-in">
      <header class="sec-cab">
        <p class="apoio">Dúvidas</p>
        <h2>Antes de <em>pedir.</em></h2>
        <p class="sec-txt">Não achou a resposta? Fale com a gente no <a href="${wa(`Olá, ${M.nome}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">WhatsApp</a>.</p>
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
        <img src="assets/img/mapa_floresta_ouro.webp" alt="Mapa da região do bairro Floresta, em Belo Horizonte, com a localização da ${M.completo}" loading="lazy" width="1240" height="760">
        <span class="pin" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${enderecoCompleto}</span><span data-horario-texto>${horarioTexto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Entregamos no ${M.bairro} e nos bairros vizinhos de ${M.cidade.replace(', MG', '')}. Retirada no balcão todos os dias.</p>
        <ul class="onde-lista" data-iguais>${bairros}</ul>
      </div>
    </div>
    <div class="rodape-col">
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
        <p>${esc(M.frase)}</p>
        <div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${M.instagramUser}">${I.insta}</a><a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a></div>
      </div>
      <nav aria-label="Rodapé"><h3>Navegar</h3><a href="#reserva">Tampinha Reserva</a><a href="#bebidas">Bebidas</a><a href="#momentos">Momentos</a><a href="#kits">Kits</a><a href="#entrega">Entrega</a><a href="#duvidas">Dúvidas</a><a href="painel.html">Área do cliente</a></nav>
      <div><h3>Contato</h3><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a><a href="tel:+55${tel}">Telefone ${M.telefone}</a><a href="mailto:${M.email}">${M.email}</a><span>${enderecoCompleto}</span></div>
      <div><h3>Horário</h3><ul class="horas" data-horas>${horarios}</ul></div>
    </div>
    <div class="rodape-base">
      <p><b>Venda proibida para menores de 18 anos.</b> Se beber, não dirija. Aprecie com moderação.</p>
      <p>© ${new Date().getFullYear()} ${M.completo}. Preços e estoque sujeitos a alteração. Modelo de demonstração. Tampinha Reserva é uma marca fictícia.</p>
      <p class="creditos">Fotos de pessoas: Unsplash (${creditos}). Fotos de produto e logos usados só para identificar o que a loja vende.</p>
    </div>
  </div>
</footer>

<div class="barra-carrinho" data-barra>
  <button type="button" data-abrir-carrinho><span>${I.sacola}<b data-conta-txt>0 itens</b></span><span>Ver carrinho <b data-total-barra>R$ 0,00</b></span></button>
</div>

<a class="flutua-wa" href="${wa(`Olá, ${M.nome}! Quero fazer um pedido.`)}" target="_blank" rel="noopener" aria-label="Pedir pelo WhatsApp">${I.whats}</a>
<button type="button" class="topo-volta" data-volta aria-label="Voltar ao topo"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".2"/><circle class="volta-anel" cx="22" cy="22" r="20" fill="none" stroke="currentColor" stroke-width="1.5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>${I.cima}</button>

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
        <div class="vazio-tampa">${I.tampaPura}</div>
        <p>Seu carrinho ainda está vazio.</p>
        <a class="btn btn-ouro" href="#bebidas" data-fechar-carrinho>Escolher bebidas</a>
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
    <button type="button" class="btn btn-ouro btn-cheio" data-avancar disabled>Continuar</button>
    <p class="carr-seguro">${I.cadeado}Nada é cobrado pelo site. O pedido vai para o nosso WhatsApp.</p>
  </footer>
</aside>

<div class="idade" data-idade hidden role="dialog" aria-modal="true" aria-labelledby="idade-t">
  <div class="idade-box">
    <div class="idade-foto">${imgDe('pessoas/varanda', '')}</div>
    <div class="idade-txt">
      ${I.tampaPura}
      <h2 id="idade-t">Você tem 18 anos ou mais?</h2>
      <p>Para pôr bebida alcoólica no carrinho, confirme sua idade. A venda para menores de 18 anos é proibida.</p>
      <div class="idade-btns" data-iguais><button type="button" class="btn btn-ouro" data-idade-sim>Sim, tenho 18+</button><button type="button" class="btn btn-linha" data-idade-nao>Não tenho</button></div>
    </div>
  </div>
</div>

<div class="aviso" data-aviso role="status" aria-live="polite"></div>

<script id="dados" type="application/json">${dadosJson}</script>
<script src="assets/horario.js" defer></script>
<script src="assets/loja.js" defer></script>
<script src="assets/three.min.js" defer></script>
<script src="assets/lata.js" defer></script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'painel.html'), require('./painel-html')({ M, C, I, H, esc, imgDe, fontes, dadosJson, nProdutos: catalogoBase.length }));
console.log('ok', path.relative(process.cwd(), OUT), (html.length / 1024).toFixed(0) + ' KB');
