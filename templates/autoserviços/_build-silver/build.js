// Gera o modelo Silver de autosserviços (Pistão Auto Center) em templates/autoserviços/site-silver/.
// Silver: uma página só (Início, Serviços, Sobre nós, FAQ, Contato), CSS e JS em assets/, fotos em assets/img.
// Uso: node "templates/autoserviços/_build-silver/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');

const OUT = path.join(__dirname, '..', 'site-silver');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = M.telefone.replace(/\D/g, '');
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const fmt = (n) => n.toLocaleString('pt-BR');

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img', 'marcas'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos')))
  fs.copyFileSync(path.join(__dirname, 'img', 'fotos', f), path.join(OUT, 'assets', 'img', f));
for (const f of ['mapa_silveira.webp', 'og.jpg'])
  fs.copyFileSync(path.join(__dirname, 'img', f), path.join(OUT, 'assets', 'img', f));
// logos das montadoras: cada SVG do Simple Icons vira um <symbol> no sprite e é usado com <use> nas esteiras
const sprite = C.marcas.map(([id]) => {
  const svg = fs.readFileSync(path.join(__dirname, 'img', 'marcas', `${id}.svg`), 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/)[1];
  const corpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '');
  return `<symbol id="m-${id}" viewBox="${vb}">${corpo}</symbol>`;
}).join('');
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, abertura: C.abertura })) + T.js('pistao-silver-tema', '#ffffff', '#101010'));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700;800&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet">';

// texto gigante vazado atrás do título da seção (decorativo)
const fundoTxt = (t) => `<span class="fundo-txt" aria-hidden="true">${t}</span>`;
const S = C.servicos;

// ---------- capa em slides ----------
const slides = C.slides.map((s, i) => `<div class="slide${i ? '' : ' ativo'}" data-slide="${i}"${i ? ' aria-hidden="true"' : ''}>
        <img class="slide-bg" src="assets/img/${s.foto}.webp" alt="${esc(s.alt)}" width="1920" height="1080"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>
        <div class="wrap slide-txt">
          <${i ? 'p' : 'h1'} class="slide-t"><span class="ln"><span>${s.t1}</span></span><span class="ln ln-r"><span>${s.t2}</span></span></${i ? 'p' : 'h1'}>
          <p class="slide-p">${esc(s.texto)}</p>
          <div class="slide-btns" data-iguais>
            <a class="btn btn-rubi" href="#contato">Agendar serviço${I.seta}</a>
            <a class="btn btn-vazado" href="#servicos">Ver serviços</a>
          </div>
        </div>
      </div>`).join('\n      ');

// ---------- serviços em cartões que se empilham ----------
const cartoes = S.map((s, i) => `<article class="cartao" id="${s.id}" style="--i:${i}">
          <figure><img src="assets/img/${s.foto}.webp" alt="${esc(s.alt)}" loading="lazy" width="960" height="680"></figure>
          <div class="cartao-txt">
            <h3>${s.nome}</h3>
            <p>${esc(s.texto)}</p>
            <ul>${s.itens.map((t) => `<li>${I.check}${t}</li>`).join('')}</ul>
            <a class="link-seta" href="${wa(`Olá, Pistão! Quero um orçamento de ${s.nome.toLowerCase()}. Meu carro é: `)}" target="_blank" rel="noopener">Pedir orçamento${I.setaDiag}</a>
          </div>
        </article>`).join('\n        ');

const marcasHtml = (copia) => C.marcas.map(([id, nome]) => `<li${copia ? ' aria-hidden="true"' : ''}><span class="marca-logo" title="${nome}"><svg fill="currentColor" aria-hidden="true" focusable="false"><use href="#m-${id}"/></svg></span><span class="marca-nome">${nome}</span></li>`).join('');

// seletor de tema comum aos modelos automotivos (pílula com sol e lua e marcador que desliza como gota)
const seletorTema = (onde) => T.pilula(onde, 'escuro');
const temaSalvo = T.head;

const html = `<!doctype html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Mecânica, revisão e estética automotiva em BH</title>
<meta name="description" content="Centro automotivo no ${M.bairro}, ${M.cidade}: mecânica geral, revisão com garantia de fábrica, freios, suspensão, alinhamento 3D, injeção eletrônica e estética. Todas as marcas.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#101010">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Mecânica, revisão, freios, suspensão, alinhamento 3D e estética automotiva no ${M.bairro}, BH.">
<meta property="og:image" content="assets/img/og.jpg">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${temaSalvo("pistao-silver-tema")}
${fontes}
<link rel="stylesheet" href="assets/style.css">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'AutoRepair', name: M.completo, telephone: M.telefone, email: M.email,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  openingHours: ['Mo-Fr 07:30-18:30', 'Sa 08:00-14:00'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '486' },
})}</script>
</head>
<body class="carregando">
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${sprite}</svg>
<div class="pre" aria-hidden="true">
  <div class="pre-pista">
    <span class="risco"></span><span class="risco r2"></span><span class="risco r3"></span><span class="risco r4"></span>
    ${I.carro}
  </div>
  <p class="pre-txt">Aquecendo o motor</p>
</div>

<a class="pular" href="#servicos">Pular para os serviços</a>

<header class="topo" id="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, voltar ao início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Seções">
      <ul>
        <li><a href="#inicio">Início</a></li>
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#sobre">Sobre nós</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
      <a class="btn btn-rubi menu-cta" href="#contato">Agendar serviço</a>
      ${seletorTema("menu-tema deitada")}
    </nav>
    <a class="topo-fone" href="tel:${tel}"><span class="pulso">${I.fone}</span><span><small data-status>Ligue agora</small>${M.telefone}</span></a>
    <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
  </div>
</header>

${seletorTema("tema-lado")}

<main>
  <section class="capa" id="inicio" aria-roledescription="carrossel" aria-label="Destaques">
    <div class="slides">
      ${slides}
    </div>
    <div class="capa-ctrl">
      <button type="button" class="circ" data-ant aria-label="Slide anterior">${I.setaEsq}</button>
      <button type="button" class="circ" data-prox aria-label="Próximo slide">${I.seta}</button>
    </div>
    <div class="capa-pag" role="tablist" aria-label="Escolher slide">${C.slides.map((s, i) => `<button type="button" role="tab" aria-label="Slide: ${s.t1} ${s.t2}" aria-selected="${i ? 'false' : 'true'}" data-ir-slide="${i}"><i></i></button>`).join('')}</div>
    <div class="capa-social">
      <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
      <a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a>
      <span>Siga a Pistão</span>
    </div>
    <div class="capa-info">
      <div class="wrap">
        <a href="mailto:${M.email}"><span class="pulso">${I.email}</span>${M.email}</a>
        <a href="${mapsUrl}" target="_blank" rel="noopener"><span class="pulso">${I.pino}</span>${M.endereco}, ${M.bairro}</a>
        <span><span class="pulso">${I.relogio}</span>${C.horarioTexto}</span>
      </div>
    </div>
  </section>

  <section class="etapas" aria-label="Como cuidamos do seu carro">
    <div class="wrap etapas-in">
      ${C.etapas.map(([k, t, d]) => `<div class="etapa" data-anima="sobe">
        <span class="etapa-barra" aria-hidden="true"><i></i></span>
        <div class="etapa-corpo"><span class="pulso grande">${I.etapas[k]}</span><div><h2>${t}</h2><p>${d}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="sobre" id="sobre">
    <div class="wrap sobre-grid">
      <div class="sobre-txt">
        <div class="titulo">
          ${fundoTxt('Sobre')}
          <p class="apoio">Sobre nós</p>
          <h2 data-letras>Por que a Pistão</h2>
        </div>
        <p data-anima="sobe">Começamos em ${M.desde} com dois elevadores e uma regra: ninguém mexe no carro sem o dono aprovar. Hoje são oito boxes, alinhador 3D, scanner multimarcas e uma equipe de ${C.numeros[2][1]} mecânicos certificados.</p>
        <p data-anima="sobe">Você recebe fotos e vídeo de cada etapa no WhatsApp, a peça velha volta no porta-malas e a garantia vem escrita na nota.</p>
        <ul class="contorno">${C.porque.map((t) => `<li data-preenche>${t}</li>`).join('')}</ul>
        <a class="btn btn-rubi" href="#contato" data-anima="sobe">Conhecer a oficina${I.seta}</a>
      </div>
      <div class="sobre-foto" data-anima="dir">
        <span class="sobre-rubi" aria-hidden="true"></span>
        <img src="assets/img/capa.webp" alt="Mecânico da Pistão ajustando peças no motor de um carro" loading="lazy" width="1300" height="1950">
        <div class="selo-gira" aria-label="Desde ${M.desde}">
          <svg viewBox="0 0 160 160" aria-hidden="true"><defs><path id="circulo" d="M80 80m-62 0a62 62 0 1 1 124 0a62 62 0 1 1-124 0"/></defs><text textLength="384" lengthAdjust="spacing"><textPath href="#circulo" textLength="384" lengthAdjust="spacing">PISTÃO AUTO CENTER   DESDE ${M.desde}   BH   </textPath></text></svg>
          <span>${I.simbolo}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="numeros" aria-label="A Pistão em números">
    <div class="numeros-bg" aria-hidden="true"><img src="assets/img/motor.webp" alt="" loading="lazy" width="1920" height="900"></div>
    <div class="wrap numeros-in">
      ${C.numeros.map(([k, v, suf, t]) => `<div class="num" data-anima="sobe"><span class="num-ico">${I.numeros[k]}</span><b><span data-conta="${v}">${fmt(v)}</span>${suf}</b><span>${t}</span></div>`).join('\n      ')}
    </div>
  </section>

  <section class="servicos" id="servicos">
    <div class="servicos-grade" aria-hidden="true"></div>
    <div class="wrap servicos-in">
      <div class="servicos-lado">
        <div class="titulo">
          ${fundoTxt('Serviços')}
          <p class="apoio">Serviços</p>
          <h2 data-letras>Tudo o que o seu carro precisa</h2>
        </div>
        <p data-anima="sobe">Da troca de óleo ao motor aberto, da suspensão ao polimento. Role para ver cada serviço e peça o orçamento direto pelo WhatsApp.</p>
        <ol class="servicos-indice" aria-label="Lista de serviços">${S.map((s) => `<li><a href="#${s.id}" data-indice="${s.id}">${s.nome}</a></li>`).join('')}</ol>
        <a class="btn btn-vazado" href="${wa('Olá, Pistão! Quero um orçamento.')}" target="_blank" rel="noopener">${I.whats}Orçamento no WhatsApp</a>
      </div>
      <div class="pilha">
        ${cartoes}
      </div>
    </div>
  </section>

  <section class="faixa" aria-labelledby="faixa-t">
    <div class="faixa-bg" aria-hidden="true"><img src="assets/img/faixa.webp" alt="" loading="lazy" width="1920" height="1000"></div>
    <div class="letreiro" aria-hidden="true"><div class="letreiro-trilho">${Array.from({ length: 2 }, () => `<span>Revisão</span><span class="cheio">Freios</span><span>Suspensão</span><span class="cheio">Injeção</span><span>Alinhamento 3D</span><span class="cheio">Estética</span>`).join('')}</div></div>
    <div class="wrap faixa-in">
      <h2 id="faixa-t" data-letras>Agende hoje, rode tranquilo amanhã.</h2>
      <p data-anima="sobe">Leva e traz grátis nos bairros vizinhos e carro reserva para revisões acima de um dia.</p>
      <div class="faixa-btns" data-iguais>
        <a class="btn btn-rubi" href="#contato">Agendar agora${I.seta}</a>
        <a class="btn btn-claro" href="${wa('Olá, Pistão! Quero agendar um serviço.')}" target="_blank" rel="noopener">${I.whats}Chamar no WhatsApp</a>
      </div>
    </div>
  </section>

  <section class="marcas" aria-labelledby="marcas-t">
    <div class="wrap marcas-topo">
      <h2 id="marcas-t">Atendemos todas as marcas</h2>
      <p>Scanner multimarcas e peças com a especificação de cada montadora.</p>
    </div>
    <div class="esteira"><ul class="esteira-trilho">${marcasHtml(false)}${marcasHtml(true)}</ul></div>
    <div class="esteira volta" aria-hidden="true"><ul class="esteira-trilho">${marcasHtml(true)}${marcasHtml(true)}</ul></div>
  </section>

  <section class="depo" aria-labelledby="depo-t">
    <div class="depo-bg" aria-hidden="true"><img src="assets/img/noturno.webp" alt="" loading="lazy" width="1920" height="1100"></div>
    <div class="wrap">
      <div class="depo-topo">
        <div class="titulo">
          ${fundoTxt('Clientes')}
          <p class="apoio">Depoimentos</p>
          <h2 id="depo-t" data-letras>Quem confia o carro à Pistão</h2>
        </div>
        <div class="depo-ctrl">
          <button type="button" class="circ" data-dep-ant aria-label="Depoimento anterior">${I.setaEsq}</button>
          <button type="button" class="circ" data-dep-prox aria-label="Próximo depoimento">${I.seta}</button>
        </div>
      </div>
      <div class="depo-janela">
        <div class="depo-trilho" data-depo>
          ${C.avaliacoes.map(([n, carro, t]) => `<figure class="depo-cartao">
            <span class="aspas">${I.aspas}</span>
            <span class="estrelas" aria-label="5 de 5 estrelas">${I.estrela.repeat(5)}</span>
            <blockquote>${esc(t)}</blockquote>
            <figcaption><b>${n}</b><span>${carro}</span></figcaption>
          </figure>`).join('\n          ')}
        </div>
      </div>
      <div class="depo-barra" aria-hidden="true"><i data-depo-barra></i></div>
    </div>
  </section>

  <section class="faq" id="faq">
    <div class="faq-roda" aria-hidden="true">${I.rodaFundo}</div>
    <div class="wrap faq-grid">
      <div class="faq-lado">
        <div class="titulo">
          ${fundoTxt('FAQ')}
          <p class="apoio">Perguntas frequentes</p>
          <h2 data-letras>Tire suas dúvidas</h2>
        </div>
        <figure class="faq-foto" data-anima="esq"><img src="assets/img/ferramentas.webp" alt="Parede de ferramentas organizada na oficina" loading="lazy" width="1200" height="1400"></figure>
      </div>
      <div class="faq-lista">
        ${C.faq.map(([q, r], i) => `<details class="pergunta" data-anima="sobe"${i ? '' : ' open'}>
          <summary><span>${q}</span><i aria-hidden="true">${I.mais}</i></summary>
          <div class="resposta"><p>${esc(r)}</p></div>
        </details>`).join('\n        ')}
        <p class="faq-mais">Não achou a sua dúvida? <a href="${wa('Olá, Pistão! Tenho uma dúvida: ')}" target="_blank" rel="noopener">Pergunte no WhatsApp</a></p>
      </div>
    </div>
  </section>

  <section class="contato" id="contato">
    <div class="contato-bg" aria-hidden="true"><img src="assets/img/lanterna.webp" alt="" loading="lazy" width="1920" height="1100"></div>
    <div class="wrap contato-grid">
      <div class="contato-txt">
        <div class="titulo">
          ${fundoTxt('Contato')}
          <p class="apoio">Contato</p>
          <h2 data-letras>Agende o seu horário</h2>
        </div>
        <p data-anima="sobe">Preencha o formulário e a mensagem chega pronta no nosso WhatsApp. Respondemos em poucos minutos no horário de atendimento.</p>
        <ul class="canais">
          <li data-anima="sobe"><a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener"><span class="pulso">${I.whats}</span><span><small>WhatsApp</small>${M.whatsappTexto}</span></a></li>
          <li data-anima="sobe"><a href="tel:${tel}"><span class="pulso">${I.fone}</span><span><small>Telefone</small>${M.telefone}</span></a></li>
          <li data-anima="sobe"><a href="mailto:${M.email}"><span class="pulso">${I.email}</span><span><small>E-mail</small>${M.email}</span></a></li>
          <li data-anima="sobe"><a href="${mapsUrl}" target="_blank" rel="noopener"><span class="pulso">${I.pino}</span><span><small>Endereço</small>${M.endereco}, ${M.bairro}</span></a></li>
        </ul>
        <table class="horas"><caption>Horário de atendimento</caption>${C.horarios.map(([d, h]) => `<tr><th scope="row">${d}</th><td>${h}</td></tr>`).join('')}</table>
      </div>
      <form class="form" data-form novalidate data-anima="dir">
        <h3>Agendamento</h3>
        <div class="duas">
          <label class="campo"><span>Seu nome</span><input name="nome" required autocomplete="name" placeholder="Nome completo"></label>
          <label class="campo"><span>WhatsApp</span><input name="fone" required inputmode="tel" autocomplete="tel" placeholder="(31) 9 0000-0000" data-mascara></label>
        </div>
        <div class="duas">
          <label class="campo"><span>Marca</span><select name="marca">${C.marcas.map(([, n]) => `<option>${n}</option>`).join('')}<option>Outra</option></select></label>
          <label class="campo"><span>Modelo e ano</span><input name="carro" required placeholder="Ex.: Onix 2020"></label>
        </div>
        <label class="campo"><span>Serviço</span><select name="servico">${S.map((s) => `<option>${s.nome}</option>`).join('')}<option>Não sei, preciso de diagnóstico</option></select></label>
        <div class="duas">
          <label class="campo"><span>Data preferida</span><input name="data" type="date" data-data></label>
          <fieldset class="campo periodo"><legend>Período</legend><div class="opcoes" data-iguais><label><input type="radio" name="periodo" value="Manhã" checked><span>Manhã</span></label><label><input type="radio" name="periodo" value="Tarde"><span>Tarde</span></label></div></fieldset>
        </div>
        <label class="campo"><span>O que está acontecendo com o carro?</span><textarea name="msg" rows="3" placeholder="Ex.: barulho na roda dianteira ao frear"></textarea></label>
        <button class="btn btn-rubi" type="submit">${I.whats}Enviar pelo WhatsApp</button>
        <p class="aviso" data-aviso role="status"></p>
      </form>
    </div>
  </section>

  <section class="insta" aria-labelledby="insta-t">
    <div class="wrap insta-topo">
      <p class="apoio">Nosso Instagram</p>
      <h2 id="insta-t"><a href="${M.instagram}" target="_blank" rel="noopener">${M.instagramUser}</a></h2>
    </div>
    <ul class="insta-fotos">
      ${C.instagram.map((f, i) => `<li><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Ver no Instagram" style="--i:${i}"><img src="assets/img/${f}.webp" alt="Carro atendido pela Pistão Auto Center" loading="lazy" width="640" height="640"><span>${I.insta}</span></a></li>`).join('\n      ')}
    </ul>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_silveira.webp" alt="Mapa do bairro Silveira, Belo Horizonte, com a localização da Pistão Auto Center" width="1240" height="760" loading="lazy">
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
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a>
        <p>${esc(M.frase)}</p>
        <a class="rodape-fone" href="tel:${tel}"><span class="pulso">${I.fone}</span>${M.telefone}</a>
      </div>
      <div><h3>Navegação</h3><ul><li><a href="#inicio">Início</a></li><li><a href="#servicos">Serviços</a></li><li><a href="#sobre">Sobre nós</a></li><li><a href="#faq">FAQ</a></li><li><a href="#contato">Contato</a></li></ul></div>
      <div><h3>Serviços</h3><ul>${S.slice(0, 5).map((s) => `<li><a href="#${s.id}">${s.nome}</a></li>`).join('')}</ul></div>
      <div><h3>Fale com a gente</h3>
        <ul class="rodape-contato"><li>${I.pino}<span>${M.endereco}, ${M.bairro}<br>${M.cidade}</span></li><li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li><li>${I.relogio}<span>${C.horarioTexto}</span></li></ul>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a>
          <a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
      </div>
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Fotos ilustrativas do Unsplash. Logos das montadoras pertencem às respectivas marcas.</span></div>
  </div>
</footer>

<a class="whats-flutua" href="${wa('Olá, Pistão! Quero agendar um serviço.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>
<a class="sobe-topo" href="#inicio" aria-label="Voltar ao topo"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="anel" cx="24" cy="24" r="21"/><path d="M24 32V16M17 23l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></a>

<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
