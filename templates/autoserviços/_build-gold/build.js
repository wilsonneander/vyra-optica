// Gera o modelo Gold de autosserviços (Pistão Auto Center) em templates/autoserviços/site-gold/.
// Gold: uma página só (Início, Serviços, Sobre nós, FAQ, Contato) com o visual do template CRAS
// (https://cras-three.vercel.app/cras-main/index.html): faixa de contatos no topo da capa, cartões pretos chapados,
// texto de fundo em degradê metálico, foto inclinada sobre bloco vinho, preços em colunas coladas e newsletter no rodapé.
// Por cima disso: vídeo na capa, vídeo da oficina, equipe e serviços em vídeo, reels e tema claro/escuro.
// Uso: node "templates/autoserviços/_build-gold/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');

const OUT = path.join(__dirname, '..', 'site-gold');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = M.telefone.replace(/\D/g, '');
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'video'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos')))
  fs.copyFileSync(path.join(__dirname, 'img', 'fotos', f), path.join(OUT, 'assets', 'img', f));
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'video')))
  fs.copyFileSync(path.join(__dirname, 'img', 'video', f), path.join(OUT, 'assets', 'video', f));
for (const f of ['mapa_silveira.webp', 'og.jpg'])
  fs.copyFileSync(path.join(__dirname, 'img', f), path.join(OUT, 'assets', 'img', f));
const sprite = C.marcas.map(([id]) => {
  const svg = fs.readFileSync(path.join(__dirname, 'img', 'marcas', `${id}.svg`), 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/)[1];
  const corpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '');
  return `<symbol id="m-${id}" viewBox="${vb}">${corpo}</symbol>`;
}).join('');
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, abertura: C.abertura, icones: { whats: I.whats, mais: I.mais, menos: I.menos } })) + T.js('pistao-tema', '#ffffff', '#101010'));
// loja (vitrine, reservas e agendamentos) e painel do dono
fs.writeFileSync(path.join(OUT, 'assets', 'loja.js'), fs.readFileSync(path.join(__dirname, 'loja.js'), 'utf8')
  .replace('/*SEMENTE*/', JSON.stringify({ categorias: C.categorias, produtos: C.produtos, agendamentosExemplo: C.agendamentosExemplo, painel: C.painel, whatsapp: M.whatsapp })));
fs.copyFileSync(path.join(__dirname, 'painel.css'), path.join(OUT, 'assets', 'painel.css'));
fs.writeFileSync(path.join(OUT, 'assets', 'painel.js'), fs.readFileSync(path.join(__dirname, 'painel.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ icones: { mais: I.mais, menos: I.menos, lixeira: I.lixeira, whats: I.whats, foto: I.foto } })) + T.js('pistao-tema', '#ffffff', '#101010'));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@500;600;700;800&family=Sarabun:ital,wght@0,400;0,500;0,600;1,500&display=swap" rel="stylesheet">';

// título de seção no padrão da referência: palavra gigante em degradê metálico atrás do título
const titulo = (fundo, h2, { id = '', txt = '', centro = false } = {}) => `<div class="cab${centro ? ' centro' : ''}">
          <span class="cab-fundo" aria-hidden="true">${fundo}</span>
          <h2${id ? ` id="${id}"` : ''}${h2.includes('<a') ? '' : ' data-letras'}>${h2}</h2>
          ${txt ? `<p data-anima="sobe">${txt}</p>` : ''}
        </div>`;
// link com as letras que rolam no hover (o "text-hover-animation" da referência)
const rola = (t) => `<span class="rola" data-rola>${t}</span>`;
const S = C.servicos;
// seletor de tema comum aos modelos automotivos (pílula com sol e lua e marcador que desliza como gota): na lateral e no menu do celular
const seletorTema = (onde) => T.pilula(onde, 'escuro');
const v = (n) => `assets/video/${n}`;

// ---------- capa ----------
const slides = C.slides.map((s, i) => {
  const fundo = s.video
    ? `<video class="slide-bg" data-slide-video muted loop playsinline preload="auto" poster="${v(s.video)}.webp" aria-label="${esc(s.alt)}"><source src="${v(s.video)}.mp4" type="video/mp4"></video>`
    : `<img class="slide-bg" src="assets/img/${s.foto}.webp" alt="${esc(s.alt)}" width="1920" height="1080" loading="lazy">`;
  const tag = i ? 'p' : 'h1';
  return `<div class="slide${i ? '' : ' ativo'}"${i ? ' aria-hidden="true"' : ''}>
        <div class="slide-fundo">${fundo}</div>
        <div class="wrap slide-txt">
          <${tag} class="slide-t"><span class="ln" data-px="300"><span>${s.t1}</span></span><span class="ln" data-px="100"><span>${s.t2}</span></span></${tag}>
          <p class="slide-p" data-px="400">${esc(s.texto)}</p>
          <div data-px="300"><a class="btn" href="#contato">${rola('Agendar serviço')}</a></div>
        </div>
      </div>`;
}).join('\n      ');

const html = `<!doctype html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Mecânica, revisão e estética automotiva em BH</title>
<meta name="description" content="Centro automotivo no ${M.bairro}, ${M.cidade}: mecânica geral, revisão com garantia de fábrica, freios, suspensão, alinhamento 3D, injeção eletrônica e estética. Pacotes com preço fechado.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#101010">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Mecânica, revisão, freios, suspensão, alinhamento 3D e estética automotiva no ${M.bairro}, BH.">
<meta property="og:image" content="assets/img/og.jpg">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem('pistao-tema');if(t==='claro'||t==='escuro')document.documentElement.dataset.tema=t;}catch(e){}</script>
${fontes}
<link rel="preload" as="image" href="${v('capa')}.webp">
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
  <div class="pre-cortina pre-c1"></div><div class="pre-cortina pre-c2"></div>
  <div class="pre-miolo">
    ${I.contaGiros}
    <b class="pre-pct"><span data-pre-pct>0</span>%</b>
    <p class="pre-txt">Aquecendo o motor</p>
  </div>
</div>
<div class="cursor" aria-hidden="true"><i></i></div>

<a class="pular" href="#servicos">Pular para os serviços</a>

<header class="topo" id="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, voltar ao início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Seções">
      <ul>
        <li><a href="#inicio">${rola('Início')}</a></li>
        <li><a href="#servicos">${rola('Serviços')}</a></li>
        <li><a href="#produtos">${rola('Produtos')}</a></li>
        <li><a href="#sobre">${rola('Sobre nós')}</a></li>
        <li><a href="#faq">${rola('FAQ')}</a></li>
        <li><a href="#contato">${rola('Contato')}</a></li>
      </ul>
      <div class="menu-botoes"><a class="btn menu-cta" href="#contato">Agendar serviço</a><a class="topo-area menu-area" href="painel/index.html">${I.cliente}<span>Área do cliente</span></a></div>
      ${seletorTema('menu-tema deitada')}
    </nav>
    <a class="topo-area" href="painel/index.html">${I.cliente}${rola('Área do cliente')}</a>
    <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
  </div>
</header>

${seletorTema('tema-lado')}

<main>
  <section class="capa" id="inicio" aria-roledescription="carrossel" aria-label="Destaques">
    <div class="slides">
      ${slides}
    </div>
    <div class="capa-info">
      <div class="wrap">
        <a href="mailto:${M.email}"><span class="pulso">${I.email}</span>${M.email}</a>
        <a href="${mapsUrl}" target="_blank" rel="noopener"><span class="pulso">${I.pino}</span>${M.endereco}, ${M.bairro}</a>
        <span><span class="pulso">${I.relogio}</span>${C.horarioTexto}</span>
      </div>
    </div>
    <div class="capa-ctrl">
      <button type="button" data-ant aria-label="Slide anterior">${I.setaEsq}</button>
      <button type="button" data-prox aria-label="Próximo slide">${I.seta}</button>
    </div>
    <div class="capa-pag" role="tablist" aria-label="Escolher slide">${C.slides.map((s, i) => `<button type="button" role="tab" aria-label="Slide: ${s.t1} ${s.t2}" aria-selected="${i ? 'false' : 'true'}" data-ir-slide="${i}"><i></i></button>`).join('')}</div>
    <div class="capa-social">
      <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
      <a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a>
      <span class="capa-social-fio" aria-hidden="true"></span>
      <span>Siga a Pistão</span>
    </div>
  </section>

  <section class="etapas" aria-label="Como cuidamos do seu carro">
    <div class="wrap etapas-in">
      ${C.etapas.map(([k, t, d]) => `<div class="etapa" data-anima="sobe">
        <div class="etapa-topo" aria-hidden="true"><span class="etapa-seta">${I.seta}</span><i></i></div>
        <div class="etapa-card">
          <span class="pulso">${I.etapas[k]}</span>
          <h2>${t}</h2>
          <p>${d}</p>
        </div>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="sobre" id="sobre">
    <div class="wrap sobre-grid">
      <div class="sobre-txt">
        ${titulo('Sobre', 'Por que a Pistão', { txt: `Começamos em ${M.desde} com dois elevadores e uma regra: ninguém mexe no carro sem o dono aprovar. Hoje são oito boxes, alinhador 3D, scanner multimarcas e 14 mecânicos certificados. Você recebe fotos e vídeo de cada etapa no WhatsApp e a garantia vem escrita na nota.` })}
        <ul class="contorno">${C.porque.map((t) => `<li>${t}</li>`).join('')}</ul>
        <a class="btn" href="#contato" data-anima="sobe">${rola('Conhecer a oficina')}</a>
      </div>
    </div>
    <div class="sobre-foto" data-anima="dir">
      <span class="sobre-vinho" aria-hidden="true"></span>
      <div class="sobre-img"><img src="assets/img/capa.webp" alt="Mecânico da Pistão ajustando peças no motor de um carro" loading="lazy" width="1300" height="1950"></div>
      <div class="selo-gira" aria-label="Desde ${M.desde}">
        <svg viewBox="0 0 160 160" aria-hidden="true"><defs><path id="circulo" d="M80 80m-60 0a60 60 0 1 1 120 0a60 60 0 1 1-120 0"/></defs><text><textPath href="#circulo" textLength="372" lengthAdjust="spacing">PISTÃO AUTO CENTER   DESDE ${M.desde}   </textPath></text></svg>
        <span>${I.simbolo}</span>
      </div>
    </div>
  </section>

  <section class="servicos" id="servicos">
    <div class="wrap">
      <div class="servicos-topo">
        ${titulo('Serviços', 'Serviços<br>dedicados', { txt: 'Da troca de óleo ao motor aberto, da suspensão ao polimento. Passe o mouse nos cartões para ver o serviço em vídeo e peça o orçamento pelo WhatsApp.' })}
        <a class="link-mais" href="${wa('Olá, Pistão! Quero um orçamento.')}" target="_blank" rel="noopener">${rola('Orçamento no WhatsApp')}</a>
      </div>
      <div class="servicos-lista">
        ${S.map((s) => `<article class="servico" id="${s.id}" data-anima="esq">
          <a class="servico-midia" href="#contato" data-servico="${esc(s.nome)}" tabindex="-1" aria-hidden="true">
            <img src="assets/img/${s.foto}.webp" alt="" loading="lazy" width="960" height="680">
            ${s.video ? `<video muted loop playsinline preload="none" data-hover-video><source src="${v(s.video)}.mp4" type="video/mp4"></video><span class="servico-play">${I.play}</span>` : ''}
          </a>
          <div class="servico-txt">
            <h3><a href="#contato" data-servico="${esc(s.nome)}">${s.nome}</a></h3>
            <p>${esc(s.texto)}</p>
            <p class="servico-itens">${s.itens.join(', ')}</p>
            <a class="link-mais" href="${wa(`Olá, Pistão! Quero um orçamento de ${s.nome.toLowerCase()}. Meu carro é: `)}" target="_blank" rel="noopener">${rola('Pedir orçamento')}</a>
          </div>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="video-sec" aria-label="Vídeo da oficina">
    <div class="video-moldura" data-video-moldura>
      <video class="video-fundo" muted loop playsinline preload="none" poster="${v('oficina')}.webp" data-auto-video aria-hidden="true"><source src="${v('oficina')}.mp4" type="video/mp4"></video>
      <button type="button" class="play" data-abre-video aria-label="Assistir ao vídeo da oficina">${I.play}</button>
    </div>
  </section>

  <section class="numeros" aria-label="A Pistão em números" data-conta-box>
    <div class="wrap numeros-in">
      ${C.numeros.map(([n, suf, t]) => `<div class="num" data-anima="sobe"><b><span data-conta="${n}">${n}</span>${suf}</b><span>${t}</span></div>`).join('\n      ')}
    </div>
  </section>

  <section class="marcas" aria-labelledby="marcas-t">
    <h2 id="marcas-t">Montadoras que atendemos</h2>
    <div class="wrap">
      <div class="esteira"><ul class="esteira-trilho">${[false, true].map((copia) => C.marcas.map(([id, nome]) => `<li${copia ? ' aria-hidden="true"' : ''}><svg fill="currentColor" aria-hidden="true" focusable="false"><use href="#m-${id}"/></svg><span>${nome}</span></li>`).join('')).join('')}</ul></div>
    </div>
  </section>

  <section class="depo" aria-labelledby="depo-t">
    <div class="wrap">
      <div class="depo-topo">
        ${titulo('Clientes', 'O que dizem nossos<br>clientes', { id: 'depo-t' })}
        <div class="depo-ctrl">
          <button type="button" class="caixa-btn" data-dep-ant>${I.setaEsq}<span>Anterior</span></button>
          <button type="button" class="caixa-btn" data-dep-prox><span>Próximo</span>${I.seta}</button>
        </div>
      </div>
      <div class="depo-palco" data-depo aria-live="polite">
        ${C.avaliacoes.map(([n, carro, t, foto], i) => `<figure class="depo-slide${i ? '' : ' ativo'}"${i ? ' aria-hidden="true"' : ''}>
          <div class="depo-info">
            <div class="depo-quem"><div><b>${n}</b><span>${carro}</span></div><span class="aspas">${I.aspasGota}</span></div>
            <blockquote>“${esc(t)}”</blockquote>
            <span class="estrelas" aria-label="5 de 5 estrelas">${I.estrela.repeat(5)}</span>
          </div>
          <div class="depo-foto"><span class="depo-vinho" aria-hidden="true"></span><div class="depo-img"><img src="assets/img/${foto}.webp" alt="Carro de ${n.split(' ')[0]} atendido pela Pistão" loading="lazy" width="640" height="640"></div></div>
        </figure>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="equipe" aria-labelledby="equipe-t">
    <div class="wrap equipe-in">
      <div class="equipe-txt">
        ${titulo('Equipe', 'Nossa equipe', { id: 'equipe-t', txt: 'Mecânicos com certificação das montadoras e curso de atualização todo ano. Passe o mouse para ver cada um trabalhando.' })}
        <a class="link-mais" href="#contato">${rola('Agendar com a equipe')}</a>
      </div>
      <div class="equipe-cartoes">
        ${C.equipe.map((p) => `<figure class="pessoa" data-anima="sobe">
          <div class="pessoa-midia"><video muted loop playsinline preload="none" poster="${v(p.video)}.webp" data-hover-video aria-label="${esc(p.alt)}"><source src="${v(p.video)}.mp4" type="video/mp4"></video><span class="pessoa-play" aria-hidden="true">${I.play}</span></div>
          <figcaption><b>${p.nome}</b><span>${p.cargo}</span></figcaption>
        </figure>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="pacotes" aria-labelledby="pacotes-t">
    <div class="wrap">
      ${titulo('Pacotes', 'Pacotes de revisão', { id: 'pacotes-t', centro: true, txt: 'Valor de carro de passeio até 2.0, com peças e mão de obra. Sem surpresa no fim.' })}
      <div class="pacotes-janela">
        <div class="pacotes-trilho" data-pacotes>
          ${C.pacotes.map((p) => `<article class="pacote${p.destaque ? ' destaque' : ''}">
            <h3>${p.nome}</h3>
            <p class="preco"><small>R$</small>${p.preco}</p>
            <p class="preco-de">R$ ${p.de}</p>
            <ul>${p.itens.map((t) => `<li>${I.checkCirc}${t}</li>`).join('')}</ul>
            <a class="pacote-btn" href="${wa(`Olá, Pistão! Quero agendar o pacote ${p.nome} (R$ ${p.preco}). Meu carro é: `)}" target="_blank" rel="noopener">${rola('Agendar')}${I.seta}</a>
          </article>`).join('\n          ')}
        </div>
      </div>
      <div class="pacotes-ctrl">
        <button type="button" class="caixa-btn" data-pac-ant aria-label="Pacote anterior">${I.setaEsq}</button>
        <button type="button" class="caixa-btn" data-pac-prox aria-label="Próximo pacote">${I.seta}</button>
      </div>
    </div>
  </section>

  <section class="produtos" id="produtos" aria-labelledby="produtos-t">
    <div class="wrap">
      <div class="produtos-topo">
        ${titulo('Loja', 'Peças e<br>acessórios', { id: 'produtos-t', txt: 'Peças com nota fiscal e garantia, escolhidas pela nossa equipe. Reserve pelo site, retire no balcão ou deixe que a gente instala junto com o serviço.' })}
        <div class="filtros" role="group" aria-label="Filtrar produtos por categoria" data-filtros data-iguais></div>
      </div>
      <div class="vitrine" data-vitrine aria-live="polite"></div>
      <p class="vitrine-vazia" data-vitrine-vazia hidden>Nenhum produto nesta categoria agora. Pergunte pelo WhatsApp que a gente encomenda.</p>
    </div>
  </section>

  <section class="faq" id="faq">
    <div class="wrap faq-grid">
      <div class="faq-lado">
        ${titulo('FAQ', 'Tire suas<br>dúvidas', { txt: 'As perguntas que mais ouvimos no balcão. Não achou a sua? Fale com a gente no WhatsApp.' })}
        <a class="link-mais" href="${wa('Olá, Pistão! Tenho uma dúvida: ')}" target="_blank" rel="noopener">${rola('Perguntar no WhatsApp')}</a>
      </div>
      <div class="faq-lista">
        ${C.faq.map(([q, r], i) => `<details class="pergunta" data-anima="sobe"${i ? '' : ' open'}>
          <summary><span>${q}</span><i aria-hidden="true">${I.mais}</i></summary>
          <div class="resposta"><p>${esc(r)}</p></div>
        </details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="contato" id="contato">
    <div class="wrap contato-grid">
      <div class="contato-txt">
        ${titulo('Contato', 'Agende o seu<br>horário', { txt: 'Preencha o formulário e a mensagem chega pronta no nosso WhatsApp. Respondemos em poucos minutos no horário de atendimento.' })}
        <ul class="canais">
          <li><a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener"><span class="pulso">${I.whats}</span><span><small>WhatsApp</small>${M.whatsappTexto}</span></a></li>
          <li><a href="tel:${tel}"><span class="pulso">${I.fone}</span><span><small>Telefone</small>${M.telefone}</span></a></li>
          <li><a href="mailto:${M.email}"><span class="pulso">${I.email}</span><span><small>E-mail</small>${M.email}</span></a></li>
          <li><a href="${mapsUrl}" target="_blank" rel="noopener"><span class="pulso">${I.pino}</span><span><small>Endereço</small>${M.endereco}, ${M.bairro}</span></a></li>
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
        <label class="campo"><span>Serviço ou pacote</span><select name="servico" data-servico-select>${S.map((s) => `<option>${s.nome}</option>`).join('')}${C.pacotes.map((p) => `<option>Pacote ${p.nome}</option>`).join('')}<option>Não sei, preciso de diagnóstico</option></select></label>
        <div class="duas">
          <label class="campo"><span>Data preferida</span><input name="data" type="date" data-data></label>
          <fieldset class="campo periodo"><legend>Período</legend><div class="opcoes" data-iguais><label><input type="radio" name="periodo" value="Manhã" checked><span>Manhã</span></label><label><input type="radio" name="periodo" value="Tarde"><span>Tarde</span></label></div></fieldset>
        </div>
        <label class="campo"><span>O que está acontecendo com o carro?</span><textarea name="msg" rows="3" placeholder="Ex.: barulho na roda dianteira ao frear"></textarea></label>
        <button class="btn" type="submit">${I.whats}${rola('Enviar pelo WhatsApp')}</button>
        <p class="aviso" data-aviso role="status"></p>
      </form>
    </div>
  </section>

  <section class="insta" aria-labelledby="insta-t">
    <div class="wrap insta-topo">
      ${titulo('Instagram', `<a href="${M.instagram}" target="_blank" rel="noopener">${M.instagramUser}</a>`, { id: 'insta-t' })}
      <a class="link-mais" href="${M.instagram}" target="_blank" rel="noopener">${rola('Seguir no Instagram')}</a>
    </div>
    <div class="insta-esteira">
      <ul class="insta-trilho">${[false, true].map((copia) => C.instagram.map((it) => `<li${copia ? ' aria-hidden="true"' : ''}><a href="${M.instagram}" target="_blank" rel="noopener"${copia ? ' tabindex="-1"' : ''} aria-label="${esc(it.alt)} (abre o Instagram)">
        ${it.reel
          ? `<video muted loop playsinline preload="none" poster="${v(it.reel)}.webp" data-reel><source src="${v(it.reel)}.mp4" type="video/mp4"></video><span class="reel-tag">${I.play}Reel</span>`
          : `<img src="assets/img/${it.foto}.webp" alt="" loading="lazy" width="640" height="640">`}
        <span class="insta-veu">${I.insta}</span>
      </a></li>`).join('')).join('')}</ul>
    </div>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-news">
      <span class="cab-fundo" aria-hidden="true">Lembrete</span>
      <h2>Receba o lembrete da próxima revisão no seu WhatsApp, sem spam</h2>
      <form class="lembrete" data-lembrete novalidate>
        <label class="sr" for="lembrete-fone">Seu WhatsApp</label>
        <input id="lembrete-fone" name="fone" inputmode="tel" autocomplete="tel" placeholder="Seu WhatsApp com DDD" data-mascara>
        <button type="submit" aria-label="Quero receber o lembrete">${I.enviar}</button>
        <p class="aviso" data-aviso role="status"></p>
      </form>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a>
        <p>${esc(M.frase)}</p>
        <a class="rodape-fone" href="tel:${tel}"><span class="pulso">${I.fone}</span>${M.telefone}</a>
      </div>
      <div><h3>Navegação</h3><ul><li><a href="#inicio">${rola('Início')}</a></li><li><a href="#servicos">${rola('Serviços')}</a></li><li><a href="#produtos">${rola('Produtos')}</a></li><li><a href="#sobre">${rola('Sobre nós')}</a></li><li><a href="#faq">${rola('FAQ')}</a></li><li><a href="#contato">${rola('Contato')}</a></li><li><a href="painel/index.html">${rola('Área do cliente')}</a></li></ul></div>
      <div><h3>Serviços</h3><ul>${S.slice(0, 5).map((s) => `<li><a href="#${s.id}">${rola(s.nome)}</a></li>`).join('')}</ul></div>
      <div><h3>Endereço e contato</h3>
        <ul class="rodape-contato"><li>${I.pino}<span>${M.endereco}, ${M.bairro}<br>${M.cidade}</span></li><li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li><li>${I.relogio}<span>${C.horarioTexto}</span></li></ul>
      </div>
    </div>
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
    <div class="rodape-fim">
      <span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração. Fotos Unsplash, vídeos Mixkit.</span>
      <div class="redes">
        <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
        <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
        <a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a>
        <a href="${wa('Olá, Pistão!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
      </div>
    </div>
  </div>
</footer>

<dialog class="player" data-player aria-label="Vídeo da oficina">
  <button type="button" class="player-fecha" data-fecha-video aria-label="Fechar vídeo">${I.fechar}</button>
  <video controls playsinline preload="none" poster="${v('oficina')}.webp"><source src="${v('oficina')}.mp4" type="video/mp4"></video>
</dialog>

<dialog class="reserva" data-reserva aria-labelledby="reserva-t">
  <form class="form" data-reserva-form novalidate>
    <button type="button" class="reserva-fecha" data-reserva-fecha aria-label="Fechar">${I.fechar}</button>
    <div class="reserva-item">
      <img src="" alt="" width="160" height="120" data-reserva-foto>
      <div><h3 id="reserva-t" data-reserva-nome>Reservar produto</h3><p data-reserva-preco></p><small data-reserva-sit></small></div>
    </div>
    <div class="duas">
      <label class="campo"><span>Seu nome</span><input name="nome" required autocomplete="name" placeholder="Nome completo"></label>
      <label class="campo"><span>WhatsApp</span><input name="fone" required inputmode="tel" autocomplete="tel" placeholder="(31) 9 0000-0000" data-mascara></label>
    </div>
    <div class="duas">
      <div class="campo"><span id="qtd-t">Quantidade</span>
        <div class="qtd" role="group" aria-labelledby="qtd-t"><button type="button" data-qtd="-1" aria-label="Menos uma">${I.menos}</button><input name="quantidade" type="number" min="1" max="20" value="1" inputmode="numeric" aria-labelledby="qtd-t"><button type="button" data-qtd="1" aria-label="Mais uma">${I.mais}</button></div>
      </div>
      <fieldset class="campo periodo"><legend>Como prefere</legend><div class="opcoes" data-iguais><label><input type="radio" name="entrega" value="Retirar no balcão" checked><span>Retirar</span></label><label><input type="radio" name="entrega" value="Instalar na oficina"><span>Instalar aqui</span></label></div></fieldset>
    </div>
    <p class="reserva-total">Total estimado <b data-reserva-total>R$ 0,00</b></p>
    <button class="btn" type="submit">${I.whats}Reservar pelo WhatsApp</button>
    <p class="aviso" data-aviso role="status"></p>
  </form>
</dialog>

<a class="whats-flutua" href="${wa('Olá, Pistão! Quero agendar um serviço.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>
<a class="sobe-topo" href="#inicio" aria-label="Voltar ao topo"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="anel" cx="24" cy="24" r="21"/><path d="M24 32V16M17 23l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></a>

<div class="veu" aria-hidden="true"></div>

<script src="assets/loja.js" defer></script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');

// ---------- painel do dono (painel/index.html) ----------
const P = C.painel;
const painel = `<!doctype html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Área do dono | ${M.completo}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#101010">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem('pistao-tema');if(t==='claro'||t==='escuro')document.documentElement.dataset.tema=t;if(sessionStorage.getItem('pistao-sessao')||localStorage.getItem('pistao-sessao'))document.documentElement.classList.add('logado');}catch(e){}</script>
${fontes}
<link rel="stylesheet" href="../assets/style.css">
<link rel="stylesheet" href="../assets/painel.css">
</head>
<body class="pn">

<main class="login" data-tela-login>
  <div class="login-foto" aria-hidden="true">
    <span class="login-vinho"></span>
    <div class="login-img"><img src="../assets/img/oficina.webp" alt="" width="1300" height="900"></div>
  </div>
  <div class="login-lado">
    <a class="logo" href="../index.html" aria-label="Voltar ao site da ${M.completo}">${I.logo}</a>
    <form class="form login-form" data-login novalidate>
      <div class="cab">
        <span class="cab-fundo" aria-hidden="true">Painel</span>
        <h1>Área do dono</h1>
        <p>Cadastre peças e acessórios, controle o estoque e acompanhe os agendamentos e reservas que chegam pelo site.</p>
      </div>
      <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="username" required placeholder="voce@suaoficina.com.br" value="${P.email}"></label>
      <div class="campo"><label for="senha"><span>Senha</span></label>
        <div class="senha"><input id="senha" name="senha" type="password" autocomplete="current-password" required placeholder="Sua senha" value="${P.senha}"><button type="button" data-mostra-senha aria-label="Mostrar senha" aria-pressed="false">${I.olho}</button></div>
      </div>
      <label class="marcar"><input type="checkbox" name="manter"><span>Manter conectado neste aparelho</span></label>
      <button class="btn" type="submit">${rola('Entrar no painel')}</button>
      <p class="aviso" data-aviso role="status"></p>
      <p class="login-demo">Acesso de demonstração já preenchido: <b>${P.email}</b> e senha <b>${P.senha}</b></p>
    </form>
    <a class="link-mais" href="../index.html">${rola('Voltar ao site')}</a>
  </div>
</main>

<div class="app" data-tela-app>
  <header class="app-topo">
    <div class="wrap app-topo-in">
      <a class="logo" href="../index.html" aria-label="Abrir o site da ${M.completo}">${I.logo}</a>
      <nav class="abas" role="tablist" aria-label="Seções do painel">
        <button type="button" role="tab" id="t-produtos" aria-controls="aba-produtos" aria-selected="true" data-aba="produtos">Produtos</button>
        <button type="button" role="tab" id="t-agenda" aria-controls="aba-agenda" aria-selected="false" data-aba="agenda" tabindex="-1">Pedidos<b class="novos" data-cont-novos hidden></b></button>
        <button type="button" role="tab" id="t-ajustes" aria-controls="aba-ajustes" aria-selected="false" data-aba="ajustes" tabindex="-1">Ajustes</button>
      </nav>
      <div class="app-acoes">
        <a class="link-mais" href="../index.html#produtos" target="_blank" rel="noopener">${rola('Ver vitrine')}</a>
        ${seletorTema('app-tema deitada')}
        <button type="button" class="caixa-btn" data-sair>${I.sair}<span>Sair</span></button>
      </div>
    </div>
  </header>

  <main class="wrap app-main" id="conteudo">
    <div class="ola">
      <div class="cab"><span class="cab-fundo" aria-hidden="true">Oficina</span><h1 data-ola>Olá, ${P.dono}</h1><p data-ola-txt>Veja como está a loja hoje.</p></div>
      <ul class="resumo" data-resumo>
        <li style="--i:0"><button type="button" data-ir-filtro="vitrine"><b data-res="vitrine">0</b><span>na vitrine</span></button></li>
        <li style="--i:1"><button type="button" data-ir-filtro="baixo"><b data-res="baixo">0</b><span>estoque baixo</span></button></li>
        <li style="--i:2"><button type="button" data-ir-filtro="zero"><b data-res="zero">0</b><span>sem estoque</span></button></li>
        <li style="--i:3"><button type="button" data-ir-filtro="novos"><b data-res="novos">0</b><span>pedidos novos</span></button></li>
      </ul>
    </div>

    <section class="aba" id="aba-produtos" role="tabpanel" aria-labelledby="t-produtos" data-painel="produtos">
      <div class="barra">
        <label class="campo busca"><span class="sr">Buscar produto</span><input type="search" placeholder="Buscar pelo nome" data-busca></label>
        <label class="campo"><span class="sr">Categoria</span><select data-filtro-cat><option value="">Todas as categorias</option>${C.categorias.map((c) => `<option>${c}</option>`).join('')}</select></label>
        <label class="campo"><span class="sr">Situação</span><select data-filtro-sit><option value="">Todos os produtos</option><option value="vitrine">Na vitrine</option><option value="oculto">Fora da vitrine</option><option value="baixo">Estoque baixo</option><option value="zero">Sem estoque</option></select></label>
        <button type="button" class="btn btn-novo" data-novo>${I.mais}Novo produto</button>
      </div>
      <div class="tabela">
        <div class="tabela-cab" aria-hidden="true"><span>Produto</span><span>Preço</span><span>Estoque</span><span>Vitrine</span><span>Destaque</span><span></span></div>
        <ul class="lista" data-lista></ul>
      </div>
      <p class="vazio" data-vazio hidden>Nenhum produto encontrado com esses filtros.</p>
    </section>

    <section class="aba" id="aba-agenda" role="tabpanel" aria-labelledby="t-agenda" data-painel="agenda" hidden>
      <div class="barra">
        <div class="filtros" role="group" aria-label="Filtrar pedidos pela situação" data-filtro-status data-iguais>
          <button type="button" aria-pressed="true" data-st="">Todos</button><button type="button" aria-pressed="false" data-st="novo">Novos</button><button type="button" aria-pressed="false" data-st="confirmado">Confirmados</button><button type="button" aria-pressed="false" data-st="concluido">Concluídos</button><button type="button" aria-pressed="false" data-st="cancelado">Cancelados</button>
        </div>
        <label class="campo"><span class="sr">Tipo de pedido</span><select data-filtro-tipo><option value="">Agendamentos e reservas</option><option>Agendamento</option><option>Reserva</option></select></label>
      </div>
      <div class="pedidos" data-pedidos></div>
      <p class="vazio" data-vazio-pedidos hidden>Nenhum pedido aqui. Os agendamentos e reservas feitos no site aparecem nesta lista.</p>
    </section>

    <section class="aba" id="aba-ajustes" role="tabpanel" aria-labelledby="t-ajustes" data-painel="ajustes" hidden>
      <div class="ajustes">
        <form class="form" data-troca-senha novalidate>
          <h2>Trocar senha</h2>
          <label class="campo"><span>Senha atual</span><input name="atual" type="password" autocomplete="current-password" required></label>
          <div class="duas">
            <label class="campo"><span>Nova senha</span><input name="nova" type="password" autocomplete="new-password" minlength="6" required></label>
            <label class="campo"><span>Repita a nova senha</span><input name="repete" type="password" autocomplete="new-password" required></label>
          </div>
          <button class="btn" type="submit">Salvar nova senha</button>
          <p class="aviso" data-aviso role="status"></p>
        </form>
        <div class="form">
          <h2>Cópia de segurança</h2>
          <p>Os produtos, fotos e pedidos ficam salvos neste navegador. Baixe uma cópia de vez em quando e use o mesmo arquivo para levar tudo para outro computador.</p>
          <div class="botoes" data-iguais>
            <button type="button" class="caixa-btn" data-exporta>${I.baixar}<span>Baixar cópia</span></button>
            <label class="caixa-btn">${I.subir}<span>Carregar cópia</span><input type="file" accept="application/json,.json" class="sr" data-importa></label>
          </div>
          <p class="aviso" data-aviso-backup role="status"></p>
        </div>
        <div class="form">
          <h2>Voltar ao exemplo</h2>
          <p>Apaga os produtos cadastrados e volta para a lista de demonstração do modelo. Os pedidos não são apagados.</p>
          <button type="button" class="caixa-btn perigo" data-restaura>${I.lixeira}<span>Restaurar produtos de exemplo</span></button>
        </div>
      </div>
    </section>
  </main>
</div>

<dialog class="gaveta" data-gaveta aria-labelledby="gaveta-t">
  <form class="form gaveta-form" data-form-produto novalidate>
    <div class="gaveta-topo"><h2 id="gaveta-t">Novo produto</h2><button type="button" class="reserva-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
    <div class="foto-zona" data-foto-zona>
      <img src="" alt="Foto do produto" data-foto-prev hidden>
      <div class="foto-vazia" data-foto-vazia>${I.foto}<span>Arraste a foto aqui</span></div>
      <div class="foto-botoes" data-iguais>
        <label class="caixa-btn"><span data-foto-rotulo>Escolher foto</span><input type="file" accept="image/*" class="sr" data-foto-input></label>
        <button type="button" class="caixa-btn" data-foto-tira hidden>Remover foto</button>
      </div>
    </div>
    <label class="campo"><span>Nome do produto</span><input name="nome" required maxlength="80" placeholder="Ex.: Kit óleo 5W30 com filtro"></label>
    <div class="duas">
      <label class="campo"><span>Categoria</span><select name="categoria">${C.categorias.map((c) => `<option>${c}</option>`).join('')}</select></label>
      <label class="campo"><span>Estoque (unidades)</span><input name="estoque" type="number" min="0" step="1" inputmode="numeric" value="1"></label>
    </div>
    <div class="duas">
      <label class="campo"><span>Preço (R$)</span><input name="preco" inputmode="decimal" required placeholder="219,90"></label>
      <label class="campo"><span>Preço antigo, se tiver promoção</span><input name="de" inputmode="decimal" placeholder="259,90"></label>
    </div>
    <label class="campo"><span>Descrição curta</span><textarea name="descricao" rows="3" maxlength="220" placeholder="O que vem no produto e se a instalação está inclusa"></textarea></label>
    <div class="marcas-chave">
      <label class="marcar"><input type="checkbox" name="vitrine" checked><span>Mostrar na vitrine do site</span></label>
      <label class="marcar"><input type="checkbox" name="destaque"><span>Destaque (aparece primeiro)</span></label>
    </div>
    <p class="aviso" data-aviso role="status"></p>
    <div class="gaveta-acoes"><button class="btn" type="submit">Salvar produto</button><button type="button" class="caixa-btn" data-fecha>Cancelar</button></div>
  </form>
</dialog>

<dialog class="confirma" data-confirma aria-labelledby="confirma-t">
  <form method="dialog" class="form">
    <h2 id="confirma-t" data-confirma-t>Excluir?</h2>
    <p data-confirma-p></p>
    <div class="confirma-acoes"><button class="btn perigo" value="sim">Excluir</button><button class="caixa-btn" value="nao">Cancelar</button></div>
  </form>
</dialog>

<div class="recado" data-recado role="status" aria-live="polite"></div>
<div class="veu" aria-hidden="true"></div>

<script src="../assets/loja.js" defer></script>
<script src="../assets/painel.js" defer></script>
</body>
</html>
`;
fs.mkdirSync(path.join(OUT, 'painel'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'painel', 'index.html'), painel);
console.log('ok', path.relative(process.cwd(), path.join(OUT, 'painel')), Math.round(painel.length / 1024) + 'k');
