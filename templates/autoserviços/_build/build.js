// Gera o modelo Bronze de autosserviços (Pistão Auto Center) em templates/autoserviços/site-bronze/.
// Bronze: uma página só, CSS e JS embutidos no index.html, fotos em assets/img.
// Uso: node "templates/autoserviços/_build/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'site-bronze');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos')))
  fs.copyFileSync(path.join(__dirname, 'img', 'fotos', f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_carlos-prates.webp'), path.join(OUT, 'assets', 'img', 'mapa_carlos-prates.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')
  .split('/*RASTRO*/').join(svgUrl(I.rastro))
  .split('/*FERRAMENTAS*/').join(svgUrl(I.ferramentas));
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, abertura: C.abertura }));

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Anybody:ital,wdth,wght@0,100,600;0,100,800;0,125,800;1,125,900&family=Oxanium:wght@500;800&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">';

const S = C.servicos;
const estrelas = (n) => `<span class="estrelas" aria-label="${n} de 5 estrelas">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${I.estrela}</i>`).join('')}</span>`;
const fmtNum = (v) => String(v).replace('.', ',');

// ---------- serviços: lista à esquerda, painel com foto à direita ----------
const abas = S.map((s, i) => `<li><button type="button" class="aba${i ? '' : ' ativa'}" id="${s.id}" data-aba="${s.id}" aria-controls="painel-${s.id}" aria-selected="${i ? 'false' : 'true'}" role="tab"><span>${s.nome}</span><em>${s.tempo}</em>${I.seta}</button></li>`).join('');
const paineis = S.map((s, i) => `<article class="painel${i ? '' : ' ativo'}" id="painel-${s.id}" role="tabpanel" aria-labelledby="${s.id}">
          <figure class="painel-foto"><img src="assets/img/${s.foto}.webp" alt="${esc(s.alt)}" loading="${i ? 'lazy' : 'eager'}" width="1400" height="933"><figcaption>${s.nome}</figcaption></figure>
          <div class="painel-txt">
            <h3>${esc(s.chamada)}</h3>
            <p>${esc(s.texto)}</p>
            <ul class="inclui">${s.itens.map((t) => `<li>${I.check}${esc(t)}</li>`).join('')}</ul>
            <div class="painel-pe">
              <span class="tempo">${I.relogio}${s.tempo}</span>
              <a class="btn btn-pinca" href="${wa(`Olá, Pistão! Quero um orçamento de ${s.nome.toLowerCase()}. Meu carro é: `)}" target="_blank" rel="noopener">${I.whats}Orçar ${s.curto.toLowerCase()}</a>
            </div>
          </div>
        </article>`).join('\n        ');

// seletor de tema (pílula branca com sol e lua, o mesmo componente do Gold): na lateral e no menu do celular
const seletorTema = (onde) => `<div class="tema-pilula ${onde}" role="group" aria-label="Tema do site">
  <button type="button" data-tema-ir="claro" aria-label="Tema claro" aria-pressed="true">${I.claro}</button>
  <button type="button" data-tema-ir="escuro" aria-label="Tema escuro" aria-pressed="false">${I.escuro}</button>
</div>`;
// lê o tema salvo (ou ?tema=claro|escuro na URL) antes de pintar, para não piscar
const temaSalvo = (chave) => `<script>try{var t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("${chave}");if(t==="claro"||t==="escuro")document.documentElement.dataset.tema=t;}catch(e){}</script>`;

const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Pneus, freio, suspensão e mecânica em BH</title>
<meta name="description" content="Centro automotivo no ${M.bairro}, ${M.cidade}: pneus e rodas, mecânica geral, troca de óleo, freio, suspensão e alinhamento 3D. Orçamento grátis pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0F1012">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Pneus, freio, suspensão, óleo e alinhamento 3D no ${M.bairro}. Orçamento grátis pelo WhatsApp.">
<meta property="og:image" content="assets/img/oficina.webp">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
${temaSalvo("pistao-bronze-tema")}
${fontes}
<style>
${css}
</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'AutoRepair', name: M.completo, telephone: M.telefone, email: M.email,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  openingHours: ['Mo-Fr 07:30-18:00', 'Sa 08:00-13:00'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
})}</script>
</head>
<body>
<a class="pular" href="#servicos">Pular para os serviços</a>

<header class="topo" id="topo">
  <div class="barra-sup">
    <div class="wrap">
      <a class="endereco-sup" href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}${M.endereco}, ${M.bairro}, Belo Horizonte</a>
      <div class="info-sup">
        <span class="status" data-status>${C.horarioTexto}</span>
        <a href="tel:${M.telefone.replace(/\D/g, '')}">${I.fone}${M.telefone}</a>
      </div>
    </div>
  </div>
  <div class="nav">
    <div class="wrap">
      <a class="logo" href="#inicio" aria-label="${M.completo}, voltar ao início">${I.logo}</a>
      <nav class="menu" id="menu" aria-label="Principal">
        <ul class="menu-lista">
          <li><a href="#inicio">Início</a></li>
          <li class="tem-sub">
            <button class="sub-btn" type="button" aria-expanded="false" aria-controls="sub-servicos">Serviços${I.desce}</button>
            <ul class="sub" id="sub-servicos">${C.nav.map(([id, t]) => `<li><a href="#${id}" data-ir="${id}">${t}${I.seta}</a></li>`).join('')}<li class="sub-todos"><a href="#servicos">Ver todos os serviços</a></li></ul>
          </li>
          <li><a href="#sobre">Sobre nós</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        ${seletorTema("menu-tema")}
      </nav>
      <a class="btn btn-pinca btn-orc" href="${wa('Olá, Pistão! Quero um orçamento grátis.')}" target="_blank" rel="noopener">${I.whats}<span>Orçamento grátis</span></a>
      <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>

${seletorTema("tema-lado")}

<main>
  <section class="capa" id="inicio">
    <div class="wrap capa-grid">
      <div class="capa-txt">
        <p class="apoio revela">Centro automotivo no ${M.bairro}, BH</p>
        <h1 class="revela">Seu carro <span class="quebra">pisando firme</span> de novo.</h1>
        <p class="capa-sub revela">Pneus, freio, suspensão, óleo e alinhamento 3D com orçamento por foto no WhatsApp antes de qualquer serviço.</p>
        <form class="orcar revela" data-orcar>
          <fieldset>
            <legend>O que o carro precisa?</legend>
            <div class="chips" data-iguais>${S.map((s) => `<label><input type="checkbox" name="serv" value="${s.nome}"><span>${s.curto}</span></label>`).join('')}</div>
          </fieldset>
          <div class="orcar-linha">
            <label class="campo"><span>Modelo e ano</span><input name="carro" type="text" placeholder="Ex.: Onix 2019" autocomplete="off"></label>
            <button class="btn btn-pinca" type="submit">${I.whats}Pedir orçamento</button>
          </div>
        </form>
      </div>
      <div class="capa-visual">
        <div class="pneu-gira" aria-hidden="true">${I.pneu}</div>
        <figure class="capa-foto"><img src="assets/img/capa.webp" alt="Mecânico da Pistão trabalhando no motor de um carro" width="1300" height="1950" fetchpriority="high"></figure>
        <div class="selo" aria-label="Garantia de 90 dias por escrito">
          <svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circ" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#circ" textLength="284" lengthAdjust="spacing">GARANTIA POR ESCRITO  PEÇA E MÃO DE OBRA</textPath></text></svg>
          <b>90<small>dias</small></b>
        </div>
        <div class="nota-capa">${I.google}<div><b>4,9</b>${estrelas(5)}<span>312 avaliações no Google</span></div></div>
      </div>
    </div>
    <div class="rastro" aria-hidden="true"></div>
  </section>

  <section class="numeros" aria-label="A Pistão em números">
    <div class="wrap">
      ${C.numeros.map(([v, suf, t]) => `<div class="num"><b><span data-conta="${v}">${fmtNum(v)}</span>${suf}</b><span>${t}</span></div>`).join('\n      ')}
    </div>
  </section>

  <section class="servicos" id="servicos">
    <div class="wrap">
      <div class="sec-topo">
        <div>
          <p class="apoio">Serviços</p>
          <h2 class="revela">Tudo o que o carro pede, <span class="quebra">num endereço só.</span></h2>
        </div>
        <p class="sec-desc revela">Escolha o serviço para ver o que está incluso e o tempo médio. O orçamento é grátis e chega por foto no WhatsApp.</p>
      </div>
      <div class="oficina-board" data-abas>
        <ul class="abas" role="tablist" aria-label="Serviços">${abas}</ul>
        <div class="paineis">
        ${paineis}
        </div>
      </div>
    </div>
  </section>

  <section class="alinha" aria-labelledby="alinha-t">
    <div class="wrap alinha-grid">
      <div class="medidor" data-medidor aria-hidden="true">
        <svg viewBox="0 0 360 300">
          <g class="grade"><path d="M0 50h360M0 100h360M0 150h360M0 200h360M0 250h360M60 0v300M120 0v300M180 0v300M240 0v300M300 0v300"/></g>
          <path class="carro" d="M128 40q52-22 104 0l8 40v140l-8 40q-52 22-104 0l-8-40V80Z"/>
          <path class="vidro" d="M138 92h84l-8 30h-68ZM146 196h68l8 24h-84Z"/>
          ${[[96, 74, 'de', -1.8], [264, 74, 'dd', 1.2], [96, 226, 'te', -0.9], [264, 226, 'td', 0.6]].map(([x, y, k, v]) => `<g class="roda" data-roda="${k}" data-de="${v}" style="transform-origin:${x}px ${y}px"><rect x="${x - 11}" y="${y - 28}" width="22" height="56" rx="3"/><path class="eixo" d="M${x} ${y - 40}v80"/></g>
          <text class="graus" x="${x < 180 ? x - 66 : x + 22}" y="${y + 5}" data-grau="${k}">${fmtNum(v.toFixed(1))}°</text>`).join('\n          ')}
          <path class="scan" d="M0 0h360"/>
        </svg>
      </div>
      <div class="alinha-txt">
        <p class="apoio">Alinhamento 3D</p>
        <h2 id="alinha-t" class="revela">Você vê cada roda voltar para o zero.</h2>
        <p>Câmeras de alta precisão leem os alvos presos nas rodas e mostram cambagem, caster e convergência na tela, em tempo real. No fim, você leva o relatório impresso com o antes e o depois.</p>
        <a class="btn btn-claro" href="${wa('Olá, Pistão! Quero agendar um alinhamento 3D. Meu carro é: ')}" target="_blank" rel="noopener">${I.whats}Agendar alinhamento</a>
      </div>
    </div>
  </section>

  <section class="sobre" id="sobre">
    <div class="wrap sobre-grid">
      <div class="sobre-fotos">
        <img class="f1" src="assets/img/oficina.webp" alt="Oficina ampla com carros nos elevadores" loading="lazy" width="1600" height="789">
        <img class="f2" src="assets/img/mecanico.webp" alt="Mecânico sorrindo ao lado de um carro com o capô aberto" loading="lazy" width="1200" height="800">
        <div class="desde"><small>desde</small><b>${M.desde}</b></div>
      </div>
      <div class="sobre-txt">
        <p class="apoio">Sobre nós</p>
        <h2 class="revela">Oficina de bairro, <span class="quebra">padrão de concessionária.</span></h2>
        <p>A Pistão nasceu em ${M.desde} num galpão de dois elevadores na Av. Pedro II. Hoje são seis boxes, alinhador 3D, scanner multimarcas e uma equipe que explica o que vai fazer antes de abrir o capô.</p>
        <p>A regra da casa é simples: ninguém mexe no carro sem você aprovar o orçamento, e tudo o que sai dele volta para você.</p>
        <dl class="difs">${C.diferenciais.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </section>

  <section class="avaliacoes" id="avaliacoes" aria-labelledby="aval-t">
    <div class="wrap aval-topo">
      <div>
        <p class="apoio">Avaliações</p>
        <h2 id="aval-t" class="revela">Quem roda com a gente, volta.</h2>
      </div>
      <div class="nota-geral">${I.google}<b>4,9</b><div>${estrelas(5)}<span>312 avaliações no Google</span></div></div>
    </div>
    ${[C.avaliacoes.slice(0, 4), C.avaliacoes.slice(4)].map((linha, k) => `<div class="esteira${k ? ' volta' : ''}"><div class="esteira-trilho">${[...linha, ...linha].map(([n, carro, t, e], j) => `<figure class="aval"${j >= linha.length ? ' aria-hidden="true"' : ''}>${estrelas(e)}<blockquote>${esc(t)}</blockquote><figcaption><b>${n}</b><span>${carro}</span></figcaption></figure>`).join('')}</div></div>`).join('\n    ')}
  </section>

  <section class="contato" id="contato">
    <div class="wrap contato-grid">
      <div class="contato-txt">
        <p class="apoio">Contato</p>
        <h2 class="revela">Conte o que está acontecendo com o carro.</h2>
        <p>Respondemos em poucos minutos no horário de atendimento. Se puder, mande uma foto ou um vídeo do barulho.</p>
        <ul class="canais">
          <li><a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener">${I.whats}<span><small>WhatsApp</small>${M.whatsappTexto}</span></a></li>
          <li><a href="tel:${M.telefone.replace(/\D/g, '')}">${I.fone}<span><small>Telefone</small>${M.telefone}</span></a></li>
          <li><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}<span><small>Endereço</small>${M.endereco}, ${M.bairro}</span></a></li>
        </ul>
        <table class="horas"><caption>Horário de atendimento</caption>${C.horarios.map(([d, h]) => `<tr><th scope="row">${d}</th><td>${h}</td></tr>`).join('')}</table>
      </div>
      <form class="form" data-form novalidate>
        <h3>Pedir orçamento grátis</h3>
        <label class="campo"><span>Seu nome</span><input name="nome" required autocomplete="name"></label>
        <div class="duas">
          <label class="campo"><span>WhatsApp</span><input name="fone" inputmode="tel" autocomplete="tel" placeholder="(31) 9 0000-0000"></label>
          <label class="campo"><span>Carro e ano</span><input name="carro" required placeholder="Ex.: HB20 2021"></label>
        </div>
        <label class="campo"><span>Serviço</span><select name="servico">${S.map((s) => `<option>${s.nome}</option>`).join('')}<option>Outro / não sei</option></select></label>
        <label class="campo"><span>O que está acontecendo?</span><textarea name="msg" rows="3" placeholder="Ex.: barulho na roda dianteira ao frear"></textarea></label>
        <button class="btn btn-pinca" type="submit">${I.whats}Enviar pelo WhatsApp</button>
        <p class="aviso" data-aviso role="status"></p>
      </form>
    </div>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_carlos-prates.webp" alt="Mapa do Carlos Prates, Belo Horizonte, com a localização da Pistão Auto Center" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${enderecoCompleto}</span><span>${C.horarioTexto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Leva e traz grátis nos bairros abaixo. Fora da lista, combine pelo WhatsApp.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Serviços</h3><ul>${S.map((s) => `<li><a href="#${s.id}" data-ir="${s.id}">${s.nome}</a></li>`).join('')}</ul></div>
      <div><h3>Fale com a gente</h3><ul><li><a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li>${M.email}</li><li>${M.endereco}, ${M.bairro}</li></ul></div>
      <div><h3>Redes</h3>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
        <p class="user">${M.instagramUser}</p>
      </div>
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Fotos ilustrativas do Unsplash.</span></div>
  </div>
</footer>

<a class="whats-flutua" href="${wa('Olá, Pistão! Quero um orçamento.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>

<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
