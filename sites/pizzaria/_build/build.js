// Gera o modelo Gold de pizzaria (Fornalha Pizza Bar, empresa fictícia) em sites/pizzaria/site-gold/
// Uso: node sites/pizzaria/_build/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'site-gold');
const M = C.marca;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',').replace(',00', '');
const wa = (txt) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(txt)}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(M.mapsQuery)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(M.mapsQuery)}`;

const TAG = {
  veg: ['Vegetariano', I.folha],
  picante: ['Picante', I.pimenta],
  novo: ['Novidade', ''],
  zero: ['Sem álcool', I.copo],
};
const tags = (t) => t.length ? `<span class="tags">${t.map((k) => `<span class="tag tag-${k}" title="${TAG[k][0]}">${TAG[k][1]}<span>${TAG[k][0]}</span></span>`).join('')}</span>` : '';

const prato = (it, i) => `
        <article class="prato" data-id="${it.id}" data-cat="${it.cat}" data-tags="${it.tags.join(' ')}" data-busca="${esc((it.nome + ' ' + it.desc).toLowerCase())}" style="--i:${i}">
          <button class="prato-foto" type="button" data-abrir="${it.id}" aria-label="Ver ${esc(it.nome)}">
            <img src="assets/img/${it.id}.webp" alt="${esc(it.nome)}" width="760" height="760" loading="lazy" decoding="async">
          </button>
          <div class="prato-info">
            <h3>${esc(it.nome)}</h3>
            <span class="preco">${it.broto ? '<small>a partir de</small>' : ''}${brl(it.broto || it.preco)}</span>
          </div>
          ${tags(it.tags)}
          <button class="prato-mais" type="button" data-rapido="${it.id}" aria-label="Pôr ${esc(it.nome)} na sacola">${I.mais}</button>
        </article>`;

const favs = C.itens.filter((i) => i.fav);
const pizzas = C.itens.filter((i) => i.cat === 'pizza');
const fatias = (() => {
  // oito fatias da roleta, rótulo no meio de cada uma
  const r = 200, out = [];
  for (let k = 0; k < 8; k++) {
    const a0 = (k * 45 - 90 - 22.5) * Math.PI / 180, a1 = ((k + 1) * 45 - 90 - 22.5) * Math.PI / 180;
    out.push(`<line x1="0" y1="0" x2="${(Math.cos(a0) * r).toFixed(1)}" y2="${(Math.sin(a0) * r).toFixed(1)}"/>`);
  }
  return out.join('');
})();
const rotulos = pizzas.map((p, k) => `<g transform="rotate(${k * 45})"><text transform="rotate(-90)" x="54" y="8">${esc(p.nome.split(' ')[0])}</text></g>`).join('');

const palavra = [...M.nome.toUpperCase()].map((l, i) => `<span style="--l:${i}">${l}</span>`).join('');

const dados = {
  marca: { nome: M.completo, whatsapp: M.whatsapp, minimo: M.entregaMinima, taxa: M.taxaEntrega },
  itens: C.itens.map(({ id, cat, nome, preco, broto, tags: t, desc }) => ({ id, cat, nome, preco, broto, tags: t, desc })),
  bordas: C.bordas,
  horarios: C.horarios,
  pizzas: pizzas.map((p) => p.id),
};

const ld = {
  '@context': 'https://schema.org', '@type': 'Restaurant', name: M.completo, servesCuisine: ['Pizza', 'Italiana'],
  url: M.url, telephone: M.telefone, priceRange: '$$', image: M.url + 'assets/img/og.jpg',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
  hasMenu: M.url + '#cardapio', acceptsReservations: true,
};

// estado vazio dos horários: aviso em cima e uma folhinha de calendário desenhada
const horasVazio = (txt, dia, rodape) => `<div class="horas-vazio"><p>${txt}</p><div class="folhinha" aria-hidden="true"><span class="folhinha-topo"><i></i><i></i><b>dia</b></span><strong>${dia}</strong><small>${rodape}</small></div></div>`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Pizza de forno a lenha em Pinheiros</title>
<meta name="description" content="${esc(M.frase)} Peça pelo WhatsApp ou reserve sua mesa.">
<meta name="robots" content="noindex">
<link rel="canonical" href="${M.url}">
<meta property="og:type" content="restaurant">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="${esc(M.frase)}">
<meta property="og:image" content="assets/img/og.jpg">
<meta name="theme-color" content="#C42E1A">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,400..900&family=Chivo:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="assets/img/capa-video.webp">
<link rel="stylesheet" href="assets/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="pular" href="#palco">Pular para o conteúdo</a>
<div class="app">
  <div class="barra">
    <a class="logo logo-mini" href="#inicio" data-ir="inicio" aria-label="${M.completo}, início">${I.logoMini}</a>
    <nav class="nav nav-mini" aria-label="Principal no celular">
      <a href="#inicio" data-ir="inicio">Início</a>
      <a href="#cardapio" data-ir="cardapio">Cardápio</a>
      <a href="#reserva" data-ir="reserva">Reserva</a>
    </nav>
    <button class="sacola-btn" type="button" data-sacola aria-label="Abrir sacola">${I.sacola}<b data-qtd>0</b><span data-total>Sacola</span></button>
  </div>

  <aside class="painel" aria-label="${M.completo}">
    <div class="painel-topo">
      <a class="logo" href="#inicio" data-ir="inicio" aria-label="${M.completo}, início">${I.logo}</a>
      <nav class="nav" aria-label="Principal">
        <a href="#inicio" data-ir="inicio">Início</a>
        <a href="#cardapio" data-ir="cardapio">Cardápio</a>
        <a href="#reserva" data-ir="reserva">Reserva</a>
        <span class="nav-luz" aria-hidden="true"></span>
      </nav>
    </div>

    <div class="painel-meio">
      <p class="painel-frase">${esc(M.frase)}</p>
      <div class="painel-acoes" data-iguais>
        <a class="btn btn-mostarda" href="#cardapio" data-ir="cardapio">Fazer pedido</a>
        <a class="btn btn-linha" href="#reserva" data-ir="reserva">Reservar mesa</a>
      </div>
      <p class="forno" data-forno>Conferindo o forno...</p>
    </div>

    <div class="favs">
      <h2>Os queridinhos</h2>
      <div class="favs-trilho">
        <div class="favs-fita">
          ${[...favs, ...favs].map((f, i) => `<button type="button" class="fav" data-abrir="${f.id}"${i >= favs.length ? ' aria-hidden="true" tabindex="-1"' : ''}><img src="assets/img/${f.id}.webp" alt="${i >= favs.length ? '' : esc(f.nome)}" width="760" height="760" loading="lazy"><span>${esc(f.nome)}</span></button>`).join('')}
        </div>
      </div>
    </div>

    <div class="marca-gigante" data-marca aria-hidden="true">${palavra}</div>
  </aside>

  <main class="palco" id="palco">

    <!-- INÍCIO -->
    <section class="vista" id="inicio" data-vista="inicio" aria-label="Início">
      <div class="capa sobe">
        <img src="assets/img/capa.webp" alt="Fatia de pizza saindo do forno com queijo puxando" width="1600" height="1100">
        <video class="capa-video" data-capa-video muted playsinline preload="auto" poster="assets/img/capa-video.webp" aria-label="Pizzaiolo abrindo a massa, montando a pizza e levando ao forno a lenha">
          <source src="assets/img/capa-video.mp4" type="video/mp4">
        </video>
        <span class="capa-tempo" aria-hidden="true"><i data-capa-tempo></i></span>
        <div class="capa-txt">
          <h1>A massa descansa <em>48 horas.</em> Você espera <em>90 segundos.</em></h1>
          <p>Fermentação lenta, forno a lenha a 450 graus e muito queijo puxando. Peça pra viagem, receba em casa ou venha pra mesa.</p>
          <div class="capa-acoes" data-iguais>
            <a class="btn btn-tomate" href="#cardapio" data-ir="cardapio">Ver o cardápio</a>
            <a class="btn btn-claro" href="#roleta">Me ajuda a escolher</a>
          </div>
        </div>
        <svg class="selo" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="giro" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0"/></defs>
          <circle cx="100" cy="100" r="96"/>
          <text><textPath href="#giro" textLength="456" lengthAdjust="spacing">forno a lenha a 450 graus forno a lenha a 450 graus</textPath></text>
          <g class="selo-meio">${I.fornoSelo}</g>
        </svg>
      </div>

      <div class="fita" aria-hidden="true">
        <div class="fita-trilho">${Array(3).fill(['Napolitana de verdade', 'Massa fresca todo dia', 'Drink de balcão', 'Borda que estala', 'Entrega em Pinheiros']).flat().map((t) => `<span>${t}</span>${I.fatiaMini}`).join('')}</div>
      </div>

      <div class="roleta" id="roleta">
        <div class="roleta-txt">
          <h2>Bateu a dúvida? <em>Gira a pizza.</em></h2>
          <p>Oito sabores, uma pá de forno e zero responsabilidade sua. Se sair a que você já ia pedir, é sinal.</p>
          <button class="btn btn-tomate" type="button" data-girar>Girar a pizza</button>
          <div class="roleta-res" data-resultado aria-live="polite"></div>
        </div>
        <div class="roleta-roda">
          <svg class="pa" viewBox="0 0 60 120" aria-hidden="true"><path d="M30 118V58"/><path d="M12 6h36l-4 40c-1 8-6 12-14 12s-13-4-14-12z"/></svg>
          <div class="roda" data-roda>
            <img src="assets/img/margherita.webp" alt="" width="760" height="760">
            <svg viewBox="-200 -200 400 400" aria-hidden="true"><g class="cortes">${fatias}</g><g class="rotulos">${rotulos}</g></svg>
          </div>
          <span class="roda-sombra" aria-hidden="true"></span>
        </div>
      </div>

      <div class="casa">
        <figure class="casa-a"><img src="assets/img/fatia.webp" alt="Mão pegando uma fatia de pizza de tomate e manjericão" width="1000" height="1200" loading="lazy"></figure>
        <div class="casa-txt">
          <h2>Uma pizzaria de bairro com <em>forno de verdade</em></h2>
          <p>A Fornalha nasceu de uma pergunta simples: por que a pizza boa tem que demorar pra chegar? A resposta virou método. A massa fermenta 48 horas na geladeira, a gente abre na mão na hora do pedido e o forno a lenha faz o resto em noventa segundos.</p>
          <p>De terça a domingo o salão enche de gente dividindo tábua, pedindo mais uma rodada e brigando pela última fatia. Delivery para o bairro todo e mesa reservada pelo WhatsApp.</p>
          <a class="link-seta" href="#reserva" data-ir="reserva">Guardar uma mesa ${I.seta}</a>
        </div>
        <figure class="casa-b"><img src="assets/img/salao.webp" alt="Salão da pizzaria com mesas de madeira e luz baixa" width="1400" height="1000" loading="lazy"></figure>
      </div>

      <div class="hora">
        <div>
          <h2>Quando o forno <em>está aceso</em></h2>
          <table class="horarios">
            ${C.horariosTexto.map(([d, h]) => `<tr data-dia="${esc(d)}"><th>${d}</th><td>${h}</td></tr>`).join('\n            ')}
          </table>
        </div>
        <div class="entrega">
          <h3>Delivery próprio</h3>
          <p>Entregamos em até 40 minutos nos bairros vizinhos, com a pizza em caixa térmica pra borda chegar estalando. Taxa fixa de ${brl(M.taxaEntrega)} e pedido mínimo de ${brl(M.entregaMinima)}.</p>
          <a class="btn btn-tomate" href="#cardapio" data-ir="cardapio">Montar meu pedido</a>
        </div>
      </div>
    </section>

    <!-- CARDÁPIO -->
    <section class="vista" id="cardapio" data-vista="cardapio" aria-label="Cardápio">
      <div class="menu-topo">
        <div class="abas" role="tablist" aria-label="Categorias">
          <button type="button" role="tab" class="aba" data-cat="todos" aria-selected="true">Tudo<small>${C.itens.length}</small></button>
          ${C.categorias.map((c) => `<button type="button" role="tab" class="aba" data-cat="${c.id}" aria-selected="false">${c.nome}<small>${C.itens.filter((i) => i.cat === c.id).length}</small></button>`).join('\n          ')}
          <span class="aba-luz" aria-hidden="true"></span>
        </div>
        <div class="filtros" data-iguais=".filtro">
          <label class="busca">${I.lupa}<input type="search" placeholder="Buscar sabor, ingrediente..." data-busca aria-label="Buscar no cardápio"></label>
          <button type="button" class="filtro" data-filtro="veg" aria-pressed="false">${I.folha}Vegetariano</button>
          <button type="button" class="filtro" data-filtro="picante" aria-pressed="false">${I.pimenta}Picante</button>
        </div>
      </div>
      <h1 class="menu-titulo" data-menu-titulo>O cardápio inteiro</h1>
      <div class="grade" data-grade>${C.itens.map(prato).join('')}
      </div>
      <div class="vazio" data-vazio hidden>
        ${I.caixa}
        <p>Nada com esse nome por aqui. Tenta outro ingrediente ou limpa os filtros.</p>
        <button type="button" class="btn btn-tomate" data-limpar>Limpar filtros</button>
      </div>
    </section>

    <!-- RESERVA -->
    <section class="vista" id="reserva" data-vista="reserva" aria-label="Reserva">
      <div class="res-capa sobe">
        <img src="assets/img/mesa.webp" alt="Mesas postas no salão" width="1400" height="1000" loading="lazy">
        <h1>Guarda uma mesa <em>pra gente?</em></h1>
      </div>
      <form class="reserva sobe" data-reserva novalidate>
        <div class="res-campos">
          <fieldset class="campo-dia">
            <legend>Qual dia?</legend>
            <div class="cal-area">
            <div class="cal">
              <div class="cal-topo">
                <button type="button" class="cal-nav cal-volta" data-cal-mes="-1" aria-label="Mês anterior">${I.seta}</button>
                <b data-cal-titulo aria-live="polite"></b>
                <button type="button" class="cal-nav" data-cal-mes="1" aria-label="Próximo mês">${I.seta}</button>
              </div>
              <div class="cal-sem" aria-hidden="true"><span>dom</span><span>seg</span><span>ter</span><span>qua</span><span>qui</span><span>sex</span><span>sáb</span></div>
              <div class="cal-grade" data-cal-grade></div>
            </div>
            <aside class="cal-folha" aria-live="polite">
              <div class="folhinha folhinha-g" data-folha>
                <span class="folhinha-topo" aria-hidden="true"><i></i><i></i><b data-folha-mes></b></span>
                <strong data-folha-dia></strong>
                <small data-folha-sem></small>
                <span class="folhinha-fatia" aria-hidden="true">${I.fatiaMini}</span>
              </div>
              <p class="folha-conta" data-folha-conta></p>
              <p class="folha-forno" data-folha-forno></p>
              <ul class="cal-legenda" aria-label="Legenda do calendário">
                <li><i class="lg-hoje"></i>Hoje</li>
                <li><i class="lg-sel"></i>Escolhido</li>
                <li><i class="lg-fechado"></i>Fechado</li>
              </ul>
            </aside>
            </div>
          </fieldset>
          <div class="res-par">
          <fieldset class="campo-horas">
            <legend>Que horas?</legend>
            <div class="horas" data-horas>${horasVazio('Escolha o dia primeiro', '?', 'qual dia?')}</div>
          </fieldset>
          <fieldset class="pessoas">
            <legend>Quantas pessoas?</legend>
            <div class="mesa-viz">
              <svg viewBox="-110 -110 220 220" data-mesa aria-hidden="true"></svg>
              <div class="passo">
                <button type="button" data-pessoas="-1" aria-label="Menos uma pessoa">${I.menos}</button>
                <output data-pessoas-n>2</output>
                <button type="button" data-pessoas="1" aria-label="Mais uma pessoa">${I.mais}</button>
              </div>
            </div>
          </fieldset>
          </div>
          <fieldset>
            <legend>Qual a ocasião?</legend>
            <div class="ocasioes">${C.ocasioes.map((o, i) => `<label><input type="radio" name="ocasiao" value="${o}"${i === 0 ? ' checked' : ''}><span>${o}</span></label>`).join('')}</div>
          </fieldset>
          <div class="campos">
            <label>Seu nome<input name="nome" autocomplete="name" required></label>
            <label>WhatsApp<input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 90000-0000" required></label>
            <label class="largo">Alguma observação?<textarea name="obs" rows="2" placeholder="Cadeirinha de bebê, bolo de aniversário, mesa na janela..."></textarea></label>
          </div>
        </div>
        <aside class="comanda" aria-live="polite">
          <div class="comanda-papel">
            <b class="comanda-casa">${M.completo}</b>
            <span class="comanda-sub">Pedido de reserva</span>
            <dl data-comanda>
              <div><dt>Dia</dt><dd data-c="dia">a escolher</dd></div>
              <div><dt>Horário</dt><dd data-c="hora">a escolher</dd></div>
              <div><dt>Pessoas</dt><dd data-c="pessoas">2</dd></div>
              <div><dt>Ocasião</dt><dd data-c="ocasiao">Jantar</dd></div>
              <div><dt>Nome</dt><dd data-c="nome">...</dd></div>
            </dl>
            <p class="comanda-nota">A mesa fica guardada por 15 minutos depois do horário. Confirmamos pelo WhatsApp.</p>
            <button class="btn btn-tomate" type="submit">${I.whats}Confirmar no WhatsApp</button>
            <p class="erro" data-erro role="alert"></p>
          </div>
        </aside>
      </form>
    </section>

    <footer class="rodape">
      <div class="mapa-onde">
        <div class="map-box">
          <img src="assets/img/mapa_pinheiros.webp" alt="Mapa de Pinheiros, São Paulo, com a localização da Fornalha" width="1240" height="760" loading="lazy">
          <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
          <div class="map-info"><b>${M.completo}</b><span>${M.endereco}, ${M.cidade}</span><span>Terça a domingo a partir das 18h, almoço sábado e domingo</span>
            <div class="mbtns"><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a class="sq" href="${rotaUrl}" target="_blank" rel="noopener" aria-label="Como chegar">${I.seta}</a></div>
          </div>
          <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
        </div>
        <div class="onde">
          <h2>Onde <em>entregamos</em></h2>
          <p>Delivery próprio em Pinheiros e arredores. Fora da área? Retire no balcão e ganhe a limonada.</p>
          <ul class="bairros" data-iguais>${C.bairros.map(([b, ok]) => `<li${ok ? ' class="on"' : ''}>${b}${ok ? '' : '<small>em breve</small>'}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="rodape-cols">
        <div class="rodape-marca"><span class="logo" role="img" aria-label="${M.completo}">${I.logo}</span><p>${esc(M.frase)}</p></div>
        <div><h3>Navegue</h3><ul><li><a href="#inicio" data-ir="inicio">Início</a></li><li><a href="#cardapio" data-ir="cardapio">Cardápio</a></li><li><a href="#reserva" data-ir="reserva">Reserva</a></li><li><a href="#roleta">Gira a pizza</a></li></ul></div>
        <div><h3>Fale com a gente</h3><ul><li>WhatsApp ${M.whatsappTexto}</li><li>Telefone ${M.telefone}</li><li>${M.endereco}</li><li>${M.cidade}</li></ul></div>
        <div><h3>Siga o forno</h3><div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="${wa('Oi, Fornalha! Tudo bem?')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a></div><p class="user">${M.instagramUser}</p></div>
      </div>
      <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Fotos ilustrativas do Unsplash.</span></div>
    </footer>
  </main>
</div>

<!-- PRODUTO -->
<div class="modal" data-modal hidden>
  <div class="modal-fundo" data-fechar></div>
  <div class="modal-caixa" role="dialog" aria-modal="true" aria-labelledby="m-nome">
    <button class="fechar" type="button" data-fechar aria-label="Fechar">${I.x}</button>
    <div class="m-foto" data-m-foto>
      <img data-m-img alt="" width="760" height="760">
      <img class="m-metade" data-m-meia alt="" width="760" height="760" hidden>
    </div>
    <div class="m-corpo">
      <h2 id="m-nome" data-m-nome></h2>
      <div data-m-tags></div>
      <p data-m-desc></p>
      <div class="m-opcoes" data-m-pizza>
        <div class="m-grupo">
          <span class="m-rot">Tamanho</span>
          <div class="seg" data-m-tam>
            <label><input type="radio" name="tam" value="broto"><span>Broto<small>4 fatias</small></span></label>
            <label><input type="radio" name="tam" value="grande" checked><span>Grande<small>8 fatias</small></span></label>
          </div>
        </div>
        <div class="m-grupo">
          <span class="m-rot">Meio a meio? <small>Vale o preço do sabor mais caro</small></span>
          <div class="meias" data-m-meias></div>
        </div>
        <div class="m-grupo">
          <span class="m-rot">Borda</span>
          <div class="bordas" data-m-bordas></div>
        </div>
      </div>
      <label class="m-obs">Observação<input data-m-obs placeholder="Sem cebola, bem passada..."></label>
      <div class="m-fim">
        <div class="passo">
          <button type="button" data-m-qtd="-1" aria-label="Diminuir">${I.menos}</button>
          <output data-m-n>1</output>
          <button type="button" data-m-qtd="1" aria-label="Aumentar">${I.mais}</button>
        </div>
        <button class="btn btn-tomate m-add" type="button" data-m-add>Pôr na sacola <b data-m-preco></b></button>
      </div>
    </div>
  </div>
</div>

<!-- SACOLA -->
<div class="gaveta" data-gaveta hidden>
  <div class="modal-fundo" data-fechar-sacola></div>
  <div class="gaveta-caixa" role="dialog" aria-modal="true" aria-labelledby="g-titulo">
    <div class="g-topo"><h2 id="g-titulo">Sua sacola</h2><button class="fechar" type="button" data-fechar-sacola aria-label="Fechar sacola">${I.x}</button></div>
    <div class="g-vazia" data-g-vazia>${I.caixa}<p>Sacola vazia. O forno está esperando.</p><a class="btn btn-tomate" href="#cardapio" data-ir="cardapio" data-fechar-sacola>Ver o cardápio</a></div>
    <ul class="g-lista" data-g-lista></ul>
    <form class="g-pedido" data-g-pedido novalidate>
      <div class="seg seg-largo">
        <label><input type="radio" name="modo" value="entrega" checked><span>Entrega</span></label>
        <label><input type="radio" name="modo" value="retirada"><span>Retiro no balcão</span></label>
      </div>
      <label data-g-end>Endereço de entrega<input name="end" autocomplete="street-address" placeholder="Rua, número, bairro"></label>
      <label>Pagamento<select name="pag"><option>Pix</option><option>Cartão na entrega</option><option>Dinheiro</option></select></label>
      <dl class="g-contas">
        <div><dt>Subtotal</dt><dd data-g-sub></dd></div>
        <div data-g-taxa-l><dt>Entrega</dt><dd data-g-taxa></dd></div>
        <div class="g-total"><dt>Total</dt><dd data-g-total></dd></div>
      </dl>
      <p class="g-falta" data-g-falta></p>
      <button class="btn btn-tomate g-enviar" type="submit">${I.whats}Enviar pedido no WhatsApp</button>
    </form>
  </div>
</div>

<div class="aviso" data-aviso role="status" aria-live="polite"></div>
<a class="whats-flut" href="${wa('Oi, Fornalha! Quero fazer um pedido.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>

<script>window.FORNALHA=${JSON.stringify(dados)};</script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'style.css'));
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(OUT, 'assets', 'app.js'));
for (const f of fs.readdirSync(path.join(__dirname, 'img'))) {
  if (/\.(webp|jpg|mp4)$/.test(f)) fs.copyFileSync(path.join(__dirname, 'img', f), path.join(OUT, 'assets', 'img', f));
}
fs.writeFileSync(path.join(OUT, 'assets', 'img', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('ok', path.relative(process.cwd(), OUT));
