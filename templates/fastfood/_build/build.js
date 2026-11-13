// Gera o modelo Gold de fast food (Monta Burger) em templates/fastfood/site-gold/.
// Uso: node templates/fastfood/_build/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'site-gold');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const camadas = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'camadas', 'camadas.json'), 'utf8'));

// ---------- copiar arquivos ----------
const copiar = (de, para) => {
  fs.mkdirSync(para, { recursive: true });
  for (const f of fs.readdirSync(de)) {
    const a = path.join(de, f), b = path.join(para, f);
    if (fs.statSync(a).isDirectory()) copiar(a, b); else fs.copyFileSync(a, b);
  }
};
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
copiar(path.join(__dirname, 'img', 'fotos'), path.join(OUT, 'assets', 'img'));
copiar(path.join(__dirname, 'img', 'video'), path.join(OUT, 'assets', 'video'));
copiar(path.join(__dirname, 'img', 'logos'), path.join(OUT, 'assets', 'img', 'logos'));
fs.mkdirSync(path.join(OUT, 'assets', 'img', 'camadas'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'camadas'))) if (f.endsWith('.webp'))
  fs.copyFileSync(path.join(__dirname, 'img', 'camadas', f), path.join(OUT, 'assets', 'img', 'camadas', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_savassi.webp'), path.join(OUT, 'assets', 'img', 'mapa_savassi.webp'));
for (const f of ['style.css', 'app.js', 'painel.css', 'painel.js', 'cardapio.js'])
  fs.copyFileSync(path.join(__dirname, f), path.join(OUT, 'assets', f));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

// dados que o site e o painel leem (o painel publica por cima no navegador)
const dados = {
  marca: M, horarios: C.horarios, categorias: C.categorias, produtos: C.produtos, acesso: C.acesso,
};
const dadosJson = JSON.stringify(dados).replace(/</g, '\\u003c');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet">';

const head = (titulo, desc, css) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#E3262B">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
${css.map((c) => `<link rel="stylesheet" href="assets/${c}">`).join('\n')}
</head>`;

// ---------- capa: hambúrguer que se monta ----------
// área usada da foto desmontada: y de 60 a 660 (600 de altura) e 533 de largura
const Y0 = 60, AH = 600;
// onde cada camada termina quando o lanche está montado (mesma escala da foto)
const ALVO = { 'pao-cima': 196, alface: 272, tomate: 300, cebola: 304, queijo: 318, carne: 336, 'alface-baixo': 404, 'pao-baixo': 414 };
// ordem de profundidade: quem está mais perto do meio do lanche fica na frente
const Z = { 'pao-cima': 1, alface: 2, tomate: 3, cebola: 4, queijo: 7, carne: 6, 'alface-baixo': 5, 'pao-baixo': 3 };
const pct = (v) => +(v * 100).toFixed(3) + '%';
const pilha = camadas.desmontado.camadas.map((c, i) => `<img class="cam" src="assets/img/camadas/${c.nome}.webp" alt="" aria-hidden="true" data-cam="${c.nome}" data-ordem="${i}" data-de="${c.topo}" data-para="${ALVO[c.nome]}" data-alt="${c.altura}" style="top:${pct((c.topo - Y0) / AH)};height:${pct(c.altura / AH)};z-index:${Z[c.nome]}" width="533" height="${c.altura}">`).join('\n          ');
const rotulos = camadas.desmontado.camadas.filter((c) => c.nome !== 'alface-baixo').map((c, i) => `<li data-rot="${c.nome}" class="${i % 2 ? 'dir' : 'esq'}">${esc(C.ingredientes[c.nome])}</li>`).join('');
// foto montada encaixada no mesmo centro do lanche empilhado
const mo = camadas.montado;
const larguraMontado = 0.86; // fração da largura da pilha
const centroPilha = (196 + 414 + 127) / 2; // centro vertical do lanche montado, na escala da foto
const escalaMo = (larguraMontado * 533) / mo.largura;
const topoMo = centroPilha - ((mo.topo + mo.base) / 2) * escalaMo;
const esqMo = 533 * 0.5 - ((mo.esq + mo.dir) / 2) * escalaMo;
const montadoStyle = `left:${pct(esqMo / 533)};top:${pct((topoMo - Y0) / AH)};width:${pct(larguraMontado)}`;

// faíscas que sobem no fundo de Os mais pedidos (posições pseudoaleatórias fixas)
let semente = 7;
const rnd = () => { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; };
const faiscas = Array.from({ length: 26 }, () => `<i style="--x:${(rnd() * 100).toFixed(1)}%;--t:${(6 + rnd() * 8).toFixed(1)}s;--a:-${(rnd() * 12).toFixed(1)}s;--s:${(3 + rnd() * 5).toFixed(1)}px;--d:${(rnd() * 80 - 40).toFixed(0)}px"></i>`).join('');

const status = '<p class="status" data-status><span data-status-txt>Confira o horário</span></p>';

// ---------- página principal ----------
const nav = [['cardapio', 'Cardápio'], ['mais-pedidos', 'Promoções'], ['sobre', 'Sobre'], ['delivery', 'Delivery'], ['contato', 'Contato']];

const index = `${head(`${M.completo} | Burger prensado na chapa na Savassi, BH`, M.frase, ['style.css'])}
<body>
<a class="pular" href="#cardapio">Pular para o cardápio</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="nav" aria-label="Principal" data-nav>
      ${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('\n      ')}
      <a class="nav-area" href="painel.html">Área do cliente</a>
    </nav>
    <div class="topo-acoes">
      <a class="area-link" href="painel.html">Área do cliente</a>
      <button class="btn-sacola" type="button" data-abrir-sacola aria-label="Abrir sacola">${I.sacola}<span class="qtd" data-sacola-qtd hidden>0</span></button>
      <a class="btn btn-verm btn-topo" href="#cardapio">Pedir agora</a>
      <button class="btn-menu" type="button" data-menu aria-label="Abrir menu" aria-expanded="false">${I.menu}</button>
    </div>
  </div>
</header>

<main>
  <section class="hero" id="inicio" data-hero>
    <video class="hero-video" data-hero-video autoplay muted loop playsinline preload="auto" poster="assets/video/chapa.webp" aria-label="Chapeiro prensando o hambúrguer na chapa quente">
      <source src="assets/video/chapa.mp4" type="video/mp4">
    </video>
    <div class="hero-veu" aria-hidden="true"></div>
    <div class="hero-in">
      <div class="hero-txt">
        <p class="hero-sobre rv">Hambúrguer, pizza e combos na Savassi</p>
        <h1 class="rv"><em>Monta</em> o seu. A gente prensa na chapa e entrega quentinho.</h1>
        <p class="hero-lead rv">Pão brioche selado na manteiga, blend moído no dia e o queijo que escorre. Peça pelo site, pelo iFood ou pelo 99Food.</p>
        <div class="hero-btns rv" data-iguais>
          <a class="btn btn-verm" data-ima href="#cardapio">Peça agora ${I.seta}</a>
          <a class="btn btn-vidro" data-ima href="#montagem">Veja como montamos</a>
        </div>
        ${status}
      </div>
      <a class="cartao-off" href="#delivery" data-off aria-label="10% off no pedido feito direto pelo site">
        <span class="off-num"><b data-conta="10" data-de="0">10</b><i>%</i></span>
        <span class="off-txt"><b>off</b>no pedido feito direto pelo site</span>
        <span class="off-brilho" aria-hidden="true"></span>
      </a>
    </div>
    <a class="hero-desce" href="#montagem">Role e veja o burger se montar${I.desce}</a>
  </section>

  <div class="letreiro" aria-hidden="true">
    <div class="letreiro-trilho">${Array(2).fill(['Prensado na hora', 'Brioche na manteiga', 'Cheddar que escorre', 'Blend moído no dia', 'Entrega em 25 min', 'Combos pra galera'].map((t) => `<span>${t}</span>${I.simbolo}`).join('')).join('')}</div>
  </div>

  <section class="capa" id="montagem" data-capa aria-labelledby="t-montagem">
    <div class="capa-fixa">
      <div class="capa-txt">
        <p class="capa-sobre">Do jeito que chega na sua casa</p>
        <h2 id="t-montagem">Cada camada <em>no lugar certo</em></h2>
        <p class="capa-lead">Brioche selado, alface americana, tomate, cebola roxa, cheddar e o blend de 160 g. Continue rolando e veja o lanche fechar.</p>
        <div class="capa-btns" data-iguais>
          <a class="btn btn-verm" data-ima href="#cardapio">Ver o cardápio ${I.seta}</a>
          <a class="btn btn-borda" data-ima href="#mais-pedidos">Ver promoções</a>
        </div>
      </div>
      <div class="capa-palco" data-palco>
        <div class="disco" aria-hidden="true"></div>
        <div class="pilha" data-pilha role="img" aria-label="Hambúrguer com os ingredientes separados que se juntam conforme a página rola">
          ${pilha}
          <img class="montado" data-montado src="assets/img/camadas/montado.webp" alt="" aria-hidden="true" width="${mo.largura}" height="${mo.altura}" style="${montadoStyle}">
          <ul class="rotulos" aria-hidden="true">${rotulos}</ul>
        </div>
        <div class="sombra-chao" data-sombra aria-hidden="true"></div>
        <figure class="cartao-voz">
          <img src="assets/img/cliente-davi.webp" alt="" width="48" height="48">
          <figcaption>"Chegou em vinte minutos e o queijo ainda escorria."</figcaption>
        </figure>
        <p class="dica-rolar" data-dica><span data-dica-txt>Role a página e veja o burger se montar</span>${I.desce}</p>
      </div>
    </div>
  </section>

  <section class="canais" aria-label="Onde pedir">
    <div class="canais-in">
      <p>Peça onde preferir</p>
      <ul>
        <li><a class="marca-ifood" href="${M.ifood}" target="_blank" rel="noopener">iFood</a></li>
        <li><a class="marca-99" href="${M.food99}" target="_blank" rel="noopener">99Food</a></li>
        <li><a class="marca-wa" href="${wa('Oi, Monta! Quero fazer um pedido.')}" target="_blank" rel="noopener">${I.whats}WhatsApp</a></li>
        <li><a class="marca-balcao" href="#contato">Retirada no balcão</a></li>
      </ul>
    </div>
  </section>

  <section class="chapa" id="chapa" aria-labelledby="t-chapa">
    <div class="chapa-in">
      <div class="chapa-video" data-video-box>
        <video data-video autoplay muted loop playsinline preload="metadata" poster="assets/video/queijo.webp" aria-label="Cheddar derretendo no maçarico sobre o hambúrguer na chapa">
          <source src="assets/video/queijo.mp4" type="video/mp4">
        </video>
        <p class="video-leg">Cheddar no maçarico antes de fechar o pão</p>
      </div>
      <div class="chapa-txt">
        <h2 id="t-chapa" class="rv">Prensado na chapa só depois que você pede</h2>
        <p>Nada fica pronto esperando. A bolinha de blend vai pra chapa quente, leva a prensa e forma aquela casquinha tostada por fora, suculenta por dentro.</p>
        <dl class="chapa-fatos">
          <div><dt>Blend</dt><dd>Acém e peito moídos todo dia de manhã</dd></div>
          <div><dt>Pão</dt><dd>Brioche da padaria da esquina, selado na manteiga</dd></div>
          <div><dt>Queijo</dt><dd>Cheddar derrete sobre a carne ainda na chapa</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="cardapio" id="cardapio" aria-labelledby="t-cardapio">
    <div class="sec-in">
      <div class="cardapio-topo rv">
        <h2 id="t-cardapio">Cardápio</h2>
        <p>Escolha a categoria, toque no + e o lanche vai pra sacola.</p>
      </div>
      <div class="filtros-linha">
        <div class="abas" role="tablist" aria-label="Categorias do cardápio" data-abas data-iguais></div>
        <label class="busca"><span class="sr">Buscar no cardápio</span><input type="search" placeholder="Buscar: bacon, shake, pizza..." data-busca></label>
      </div>
      <div class="grade" data-grade aria-live="polite"></div>
      <p class="vazio" data-vazio hidden>Nada encontrado com esse nome. Tente outra palavra.</p>
      <noscript><p>Ative o JavaScript para ver o cardápio completo ou chame no WhatsApp ${M.whatsappTexto}.</p></noscript>
    </div>
  </section>

  <section class="destaques" id="mais-pedidos" aria-labelledby="t-destaques">
    <div class="dest-fundo" aria-hidden="true">
      <span class="brasa b1"></span><span class="brasa b2"></span><span class="brasa b3"></span>
      ${faiscas}
    </div>
    <div class="sec-in dest-in">
      <div class="dest-lado rv">
        <p class="dest-sobre">Promoção da semana</p>
        <h2 id="t-destaques">Os mais pedidos, <em>com preço de promoção</em></h2>
        <p class="relogio-promo" data-relogio><span>A promoção acaba em</span><b data-rel-txt>domingo, 23h59</b></p>
        <div class="dest-minis" data-dest-minis role="tablist" aria-label="Escolha a promoção"></div>
      </div>
      <div class="dest-palco" data-dest-palco aria-live="polite"></div>
    </div>
  </section>

  <section class="sobre" id="sobre" aria-labelledby="t-sobre">
    <img class="sobre-bg" data-parallax src="assets/img/balcao.webp" alt="" aria-hidden="true" width="900" height="600" loading="lazy">
    <div class="sobre-veu" aria-hidden="true"></div>
    <div class="sec-in sobre-in">
      <figure class="sobre-chef rv">
        <img src="assets/img/chef-kenji.webp" alt="Kenji Tanaka, chapeiro-chefe, de braços cruzados na cozinha" width="700" height="820" loading="lazy">
        <figcaption>Kenji Tanaka, chapeiro-chefe desde a primeira chapa</figcaption>
      </figure>
      <div class="sobre-txt">
        <p class="sobre-sobre rv">Nossa casa na Savassi</p>
        <h2 id="t-sobre" class="rv">Começou com uma chapa e uma fila na calçada</h2>
        <p class="rv">A Monta abriu em ${M.desde} num balcão de três metros na Savassi. O plano era simples: hambúrguer prensado na hora, pão de padaria e preço de lanchonete. A fila veio antes da placa.</p>
        <p class="rv">Hoje são duas chapas, um salão pequeno e entrega própria pelos bairros vizinhos. O blend continua sendo moído toda manhã e o pão continua chegando da mesma padaria.</p>
        <ul class="sobre-num">
          <li><b><span data-conta="${M.desde}" data-de="1990">${M.desde}</span></b><span>abrimos a primeira chapa</span></li>
          <li><b><span data-conta="160">160</span> g</b><span>de blend no burger da casa</span></li>
          <li><b><span data-conta="25">25</span> min</b><span>de entrega, em média</span></li>
          <li><b><span data-conta="40">40</span> mil</b><span>burgers prensados por ano</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="delivery" id="delivery" aria-labelledby="t-delivery">
    <div class="sec-in">
      <div class="delivery-topo rv">
        <h2 id="t-delivery">Peça pelo app que você já usa</h2>
        <p class="delivery-lead">O mesmo cardápio e o pedido sai da mesma chapa. Escolha o seu lado, ou peça direto com a gente e ganhe 10% off.</p>
      </div>
      <div class="duelo rv" data-duelo>
        <a class="lado lado-ifood" href="${M.ifood}" target="_blank" rel="noopener" aria-label="Pedir no iFood">
          <img class="lado-logo" src="assets/img/logos/ifood.svg" alt="iFood" width="190" height="100">
          <p class="lado-frase">Acompanhe o motoboy no mapa e pague pelo app.</p>
          <div class="lado-info"><span><small>entrega</small><b>25 a 40 min</b></span><span><small>taxa a partir de</small><b>R$ 4,99</b></span></div>
          <span class="lado-cta">Pedir no iFood ${I.seta}</span>
        </a>
        <div class="duelo-meio" aria-hidden="true">
          <img src="assets/img/camadas/montado.webp" alt="" width="657" height="661" loading="lazy">
          <span class="duelo-ou">ou</span>
        </div>
        <a class="lado lado-99" href="${M.food99}" target="_blank" rel="noopener" aria-label="Pedir no 99Food">
          <span class="logo-99"><img src="assets/img/logos/99.svg" alt="" width="70" height="70"><b>Food</b></span>
          <p class="lado-frase">Cupons da semana no app. Busque por Monta Burger.</p>
          <div class="lado-info"><span><small>entrega</small><b>25 a 45 min</b></span><span><small>taxa a partir de</small><b>R$ 3,99</b></span></div>
          <span class="lado-cta">Pedir no 99Food ${I.seta}</span>
        </a>
      </div>
      <div class="comanda rv">
        <div class="comanda-papel">
          <p class="comanda-topo"><b>Pedido direto</b>pelo site, chega no nosso WhatsApp</p>
          <div class="comanda-linha"><span>Taxa de app</span><b>R$ 0,00</b></div>
          <div class="comanda-linha"><span>Desconto do site</span><b>10% off</b></div>
          <div class="comanda-linha"><span>Entrega própria</span><b>20 a 35 min</b></div>
          <button class="btn btn-verm btn-cheio" type="button" data-abrir-sacola>Abrir a sacola ${I.seta}</button>
        </div>
      </div>
      <div class="delivery-info">
        ${status}
        <p>${I.relogio}${C.horarioTexto}</p>
        <p>${I.pino}${M.endereco}, ${M.bairro}</p>
      </div>
    </div>
  </section>

  <section class="vozes" aria-labelledby="t-vozes">
    <div class="sec-in">
      <div class="vozes-topo">
        <div class="rv">
          <h2 id="t-vozes">O que dizem os <em>clientes</em></h2>
          <p>Quem pede uma vez costuma voltar na sexta seguinte.</p>
        </div>
        <div class="vozes-setas"><button type="button" data-car="-1" aria-label="Depoimentos anteriores">${I.setaEsq}</button><button type="button" data-car="1" aria-label="Próximos depoimentos">${I.seta}</button></div>
      </div>
    </div>
    <div class="carrossel" data-carrossel tabindex="0" aria-label="Depoimentos de clientes, role para os lados">
      ${C.depoimentos.map((d, i) => `<figure class="voz${i % 3 === 1 ? ' voz-verm' : ''}">
        <svg class="aspas" viewBox="0 0 60 44" aria-hidden="true"><path d="M4 44V26C4 12 10 4 24 2l2 7c-7 2-10 6-10 13h10v22zm32 0V26c0-14 6-22 20-24l2 7c-7 2-10 6-10 13h10v22z" fill="currentColor"/></svg>
        <blockquote>${esc(d.texto)}</blockquote>
        <figcaption>${d.foto ? `<img src="assets/img/${d.foto}.webp" alt="" width="56" height="56" loading="lazy">` : `<span class="inicial" aria-hidden="true">${esc(d.nome[0])}</span>`}<span><b>${esc(d.nome)}</b>${esc(d.papel)}</span></figcaption>
      </figure>`).join('\n      ')}
    </div>
    <div class="sec-in"><div class="car-trilho" aria-hidden="true"><span data-car-barra></span></div></div>
  </section>
</main>

<footer class="rodape" id="contato">
  <div class="rodape-in">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_savassi.webp" alt="Mapa da Savassi, Belo Horizonte, com a localização da Monta Burger" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${M.endereco}, ${M.bairro}, ${M.cidade}</span><span>${C.horarioTexto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde entregamos</h2>
        <p>Entrega própria nos bairros abaixo. Fora da lista, peça pelo iFood ou 99Food ou retire no balcão.</p>
        <ul class="bairros" data-iguais>${C.bairros.map(([b, ok]) => `<li${ok ? ' class="on"' : ''}>${b}${ok ? '' : '<small>em breve</small>'}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo logo-claro" href="#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Navegue</h3><ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}<li><a href="painel.html">Área do cliente</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul><li><a href="${wa('Oi, Monta! Tudo bem?')}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li>Telefone ${M.telefone}</li><li>${M.endereco}</li><li>${M.bairro}, ${M.cidade}</li></ul></div>
      <div><h3>Redes</h3>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${M.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a>
          <a href="${wa('Oi, Monta! Tudo bem?')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
        <p class="user">${M.instagramUser}</p>
      </div>
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Fotos ilustrativas do Unsplash e vídeo do Pexels.</span></div>
  </div>
</footer>

<a class="wa-flutua" href="${wa('Oi, Monta! Quero fazer um pedido.')}" target="_blank" rel="noopener" aria-label="Pedir pelo WhatsApp">${I.whats}</a>

<!-- SACOLA -->
<div class="sacola" data-sacola hidden>
  <div class="sacola-fundo" data-fechar-sacola></div>
  <aside class="sacola-caixa" role="dialog" aria-modal="true" aria-labelledby="t-sacola">
    <div class="sacola-topo"><h2 id="t-sacola">Sua sacola</h2><button type="button" class="fechar" data-fechar-sacola aria-label="Fechar sacola">${I.x}</button></div>
    <ul class="sacola-itens" data-sacola-itens></ul>
    <p class="sacola-vazia" data-sacola-vazia>Sua sacola está vazia. Toque no + de um lanche para começar.</p>
    <form class="sacola-form" data-sacola-form>
      <div class="opcao" data-iguais role="radiogroup" aria-label="Como receber">
        <label><input type="radio" name="tipo" value="entrega" checked><span>Entrega</span></label>
        <label><input type="radio" name="tipo" value="retirada"><span>Retirada</span></label>
      </div>
      <label class="campo"><span>Seu nome</span><input name="nome" required autocomplete="name"></label>
      <label class="campo" data-campo-end><span>Endereço com número e bairro</span><input name="endereco" autocomplete="street-address"></label>
      <label class="campo"><span>Pagamento</span><select name="pag"><option>Pix</option><option>Cartão na entrega</option><option>Dinheiro</option></select></label>
      <div class="sacola-total"><span>Subtotal</span><b data-sacola-sub>R$ 0,00</b></div>
      <div class="sacola-total desc"><span>10% off pedindo direto</span><b data-sacola-desc>R$ 0,00</b></div>
      <div class="sacola-total fim"><span>Total</span><b data-sacola-total>R$ 0,00</b></div>
      <button class="btn btn-verm btn-cheio" type="submit">${I.whats}Enviar pedido no WhatsApp</button>
      <p class="sacola-apps">Prefere app? <a href="${M.ifood}" target="_blank" rel="noopener">iFood</a> ou <a href="${M.food99}" target="_blank" rel="noopener">99Food</a></p>
    </form>
  </aside>
</div>
<p class="aviso" data-aviso role="status" aria-live="polite"></p>

<script id="dados" type="application/json">${dadosJson}</script>
<script src="assets/cardapio.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
`;

// ---------- Área do Cliente (painel da loja) ----------
const painel = `${head(`Área do cliente | ${M.completo}`, 'Painel da loja: cadastre produtos e categorias e publique o cardápio no site.', ['painel.css'])}
<body class="painel">
<section class="login" data-login>
  <div class="login-arte" aria-hidden="true">
    <video class="login-video" src="assets/video/chapa.mp4" poster="assets/video/chapa.webp" autoplay muted loop playsinline preload="metadata"></video>
    <div class="login-veu"></div>
    <a class="logo logo-claro login-marca" href="index.html" tabindex="-1">${I.logo}</a>

    <div class="flutua f-publicado">
      <span class="f-simbolo">${I.simbolo}</span>
      <div><b>Cardápio publicado</b><small>${C.produtos.length} produtos no site agora</small></div>
    </div>

    <div class="login-frase">
      <h2>Seu cardápio no ar do jeito que sai da chapa.</h2>
      <p>Aqui você cadastra novos produtos, troca preços e fotos, cria promoções e organiza as categorias do cardápio. Quando terminar, é só publicar: o site atualiza na hora.</p>
      <ul class="login-pode">
        <li><b>Produtos</b>Cadastre com foto, descrição e preço</li>
        <li><b>Promoções</b>Preço promocional e destaque em Os mais pedidos</li>
        <li><b>Categorias</b>Crie, renomeie e escolha a ordem das abas</li>
        <li><b>Publicação</b>Revise o rascunho e mande para o site</li>
      </ul>
    </div>
  </div>

  <div class="login-lado">
    <form class="login-caixa" data-login-form>
      <a class="logo" href="index.html" aria-label="Voltar ao site">${I.logo}</a>
      <div class="login-titulo">
        <p class="login-apoio">Área do cliente</p>
        <h1><span data-saudacao>Olá</span>, ${esc(C.acesso.responsavel.split(' ')[0])}.</h1>
        <p>Entre para cadastrar produtos, organizar as categorias e publicar o cardápio no site.</p>
      </div>
      <label class="campo"><span>E-mail</span><span class="entrada">${I.arroba}<input type="email" name="email" autocomplete="username" required value="${esc(C.acesso.email)}"></span></label>
      <label class="campo"><span>Senha</span><span class="entrada senha">${I.cadeado}<input type="password" name="senha" autocomplete="current-password" required value="${esc(C.acesso.senha)}"><button type="button" data-ver-senha aria-label="Mostrar senha">${I.olho}</button></span></label>
      <p class="erro" data-login-erro hidden>E-mail ou senha não conferem.</p>
      <button class="btn btn-verm btn-cheio btn-entrar" type="submit"><span>Entrar no painel</span>${I.seta}</button>
      <p class="demo">Modo demonstração: e-mail e senha já estão preenchidos.</p>
    </form>
    <div class="login-rodape">
      <a class="voltar" href="index.html">${I.setaEsq}Voltar ao site</a>
      <a class="ajuda" href="https://wa.me/${M.whatsapp}?text=${encodeURIComponent('Olá! Preciso de ajuda com o painel da loja.')}" target="_blank" rel="noopener">${I.whats}Preciso de ajuda</a>
    </div>
  </div>
</section>

<div class="app" data-app hidden>
  <aside class="lateral">
    <a class="logo logo-claro" href="index.html" aria-label="Ver site">${I.logo}</a>
    <nav class="menu-lateral" aria-label="Painel">
      <button type="button" class="on" data-tela="produtos">${I.sacola}Produtos</button>
      <button type="button" data-tela="categorias">${I.menu}Categorias</button>
      <a href="index.html#cardapio" target="_blank" rel="noopener">${I.olho}Ver o site</a>
    </nav>
    <div class="quem"><b data-quem></b><span>Monta Burger, Savassi</span><button type="button" data-sair>${I.sair}Sair</button></div>
  </aside>

  <main class="area">
    <header class="area-topo">
      <div>
        <h1 data-titulo>Produtos</h1>
        <p class="estado" data-estado>Tudo publicado</p>
      </div>
      <div class="area-acoes">
        <button class="btn btn-borda" type="button" data-descartar hidden>Descartar alterações</button>
        <button class="btn btn-verm" type="button" data-publicar disabled>${I.enviar}Publicar no site</button>
      </div>
    </header>

    <section class="tela" data-tela-box="produtos">
      <div class="barra">
        <div class="filtros" data-filtros data-iguais></div>
        <div class="vista" role="group" aria-label="Formato da lista">
          <button type="button" data-vista="lista" aria-pressed="true" title="Ver em lista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="5" width="4" height="4" rx="1.2"/><rect x="4" y="15" width="4" height="4" rx="1.2"/><path d="M12 7h8M12 17h8"/></svg><span>Lista</span></button>
          <button type="button" data-vista="grade" aria-pressed="false" title="Ver em grade"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg><span>Grade</span></button>
        </div>
        <label class="busca"><span class="sr">Buscar produto</span><input type="search" placeholder="Buscar produto" data-p-busca></label>
        <button class="btn btn-escuro" type="button" data-novo>${I.mais}Novo produto</button>
      </div>
      <div class="lista" data-lista></div>
    </section>

    <section class="tela" data-tela-box="categorias" hidden>
      <form class="cat-nova" data-cat-form>
        <label class="campo"><span>Nova categoria</span><input name="nome" placeholder="Ex.: Sobremesas" required maxlength="24"></label>
        <button class="btn btn-escuro" type="submit">${I.mais}Adicionar</button>
      </form>
      <ul class="cats" data-cats></ul>
      <p class="nota">A ordem aqui é a ordem das abas no cardápio do site. Uma categoria só pode ser apagada quando estiver vazia.</p>
      <p class="nota">Demonstração: tudo fica salvo neste navegador. <button type="button" class="link" data-restaurar>Voltar ao cardápio original</button></p>
    </section>
  </main>
</div>

<!-- formulário de produto -->
<div class="gaveta" data-gaveta hidden>
  <div class="gaveta-fundo" data-fechar></div>
  <form class="gaveta-caixa" data-form role="dialog" aria-modal="true" aria-labelledby="t-form">
    <div class="gaveta-topo"><h2 id="t-form" data-form-titulo>Novo produto</h2><button type="button" class="fechar" data-fechar aria-label="Fechar">${I.x}</button></div>
    <div class="foto-campo">
      <div class="foto-prev" data-foto-prev>${I.foto}<span>Sem foto</span></div>
      <div class="foto-acoes">
        <label class="btn btn-borda">${I.foto}Enviar foto<input type="file" accept="image/*" data-foto-arquivo hidden></label>
        <p>Ou escolha uma da galeria:</p>
        <div class="galeria" data-galeria></div>
      </div>
    </div>
    <label class="campo"><span>Nome</span><input name="nome" required maxlength="40"></label>
    <label class="campo"><span>Categoria</span><select name="cat" data-form-cat required></select></label>
    <div class="dupla">
      <label class="campo"><span>Preço (R$)</span><input name="preco" inputmode="decimal" required placeholder="29,90"></label>
      <label class="campo"><span>Preço de promoção (opcional)</span><input name="promo" inputmode="decimal" placeholder="24,90"></label>
    </div>
    <label class="campo"><span>Descrição</span><textarea name="desc" rows="3" maxlength="160"></textarea></label>
    <label class="check"><input type="checkbox" name="destaque"><span>Mostrar em <b>Os mais pedidos</b></span></label>
    <label class="check"><input type="checkbox" name="oculto"><span>Esconder do site por enquanto</span></label>
    <p class="erro" data-form-erro hidden></p>
    <div class="gaveta-btns" data-iguais>
      <button type="button" class="btn btn-borda" data-fechar>Cancelar</button>
      <button type="submit" class="btn btn-verm">Salvar produto</button>
    </div>
  </form>
</div>
<p class="aviso" data-aviso role="status" aria-live="polite"></p>

<script id="dados" type="application/json">${dadosJson}</script>
<script src="assets/cardapio.js"></script>
<script src="assets/painel.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), index);
fs.writeFileSync(path.join(OUT, 'painel.html'), painel);
console.log('ok', OUT);
