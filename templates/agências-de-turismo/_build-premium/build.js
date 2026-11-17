// Gera o modelo Premium de agência de turismo (Peakalika Turismo) em templates/agências-de-turismo/site-premium/.
// Conteúdo, imagens e vídeos reaproveitados de https://peakalikaturismo.com/, com visual novo: noite azul-marinho,
// coral da marca e champanhe, cenas da Disney em vídeo, seções que reagem ao scroll e efeitos 3D. Sem bibliotecas.
// Uso: node "templates/agências-de-turismo/_build-premium/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'site-premium');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg, num = M.whatsapp) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
const img = (n) => `assets/img/${n}.webp`;
const vid = (n) => `assets/video/${n}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent('Curitiba, Paraná')}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Curitiba, PR')}`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
for (const d of ['img', 'video']) fs.mkdirSync(path.join(OUT, 'assets', d), { recursive: true });
const copia = (de, para) => fs.copyFileSync(path.join(__dirname, de), path.join(OUT, para));
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos'))) copia(`img/fotos/${f}`, `assets/img/${f}`);
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'video'))) copia(`img/video/${f}`, `assets/video/${f}`);
for (const f of fs.readdirSync(path.join(__dirname, 'img')).filter((f) => /\.(png|webp|jpg)$/.test(f))) copia(`img/${f}`, `assets/img/${f}`);
copia('style.css', 'assets/style.css');
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, abertura: C.abertura, aviao: I.aviaoPath })));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gloock&family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">';

// texto que entra palavra por palavra (o app.js quebra em <span>)
const split = (t, tag = 'span') => `<${tag} class="split" data-split>${t}</${tag}>`;
// botão com texto que rola no hover
const rola = (t) => `<span class="rola"><span data-t="${esc(t)}">${t}</span></span>`;
const logo = `<img src="assets/img/logo-branca.webp" alt="${M.completo}" width="300" height="220">`;

// ---------- capa ----------
const capaVideos = C.capa.videos.map((v, i) => `<video class="capa-video${i ? '' : ' ativo'}" muted loop playsinline ${i ? 'preload="none"' : 'preload="auto" autoplay'} poster="${vid(v.id)}.webp" aria-label="${esc(v.alt)}" data-capa-video><source src="${vid(v.id)}.mp4" type="video/mp4"></video>`).join('\n          ');
const capaCenas = C.capa.videos.map((v, i) => `<button type="button" class="${i ? '' : 'ativo'}" data-capa-ir="${i}" aria-label="Ver cena: ${esc(v.alt)}"><i></i></button>`).join('');

// ---------- busca ----------
const abas = C.busca.abas.map((a, i) => `<label><input type="radio" name="tipo" value="${a}"${i ? '' : ' checked'}><span>${a}</span></label>`).join('');

// ---------- destinos ----------
const destinos = C.destinos.lista.map((d) => `<a class="destino" href="${d.link}" target="_blank" rel="noopener" data-tilt data-cursor="Ver passeio">
          <span class="destino-foto"><img src="${img(d.foto)}" alt="${esc(`${d.ponto}, ${d.cidade}, ${d.pais}`)}" width="1200" height="800" loading="lazy" data-destino-img></span>
          <span class="destino-brilho" aria-hidden="true"></span>
          <span class="destino-txt">
            <small>${d.ponto} / ${d.pais}</small>
            <strong>${d.cidade}</strong>
            <em>${d.preco}<span class="destino-seta">${I.setaDiag}</span></em>
          </span>
        </a>`).join('\n        ');

// ---------- disney ----------
const disneyItens = C.disney.itens.map((it) => `<li data-anima><h3>${it.t}</h3><p>${it.d}</p></li>`).join('');

// ---------- um dia na Disney ----------
const momentos = C.dia.momentos;
const ingressos = momentos.map((m, i) => `<figure class="ingresso" data-ingresso data-k="${i}" data-hora="${m.hora}" data-t="${esc(m.t)}" data-d="${esc(m.d)}" data-cores="${m.ceu.join(',')}">
            <span class="ingresso-foto"><video muted loop playsinline preload="none" poster="${vid(m.video)}.webp" aria-label="${esc(m.t)}"><source src="${vid(m.video)}.mp4" type="video/mp4"></video></span>
            <figcaption><b>${m.t}</b><span>${m.hora}</span></figcaption>
            <span class="ingresso-canhoto">Válido para um dia mágico</span>
          </figure>`).join('\n          ');
const regua = momentos.map((m) => `<li data-regua>${m.hora}</li>`).join('');

// ---------- serviços ----------
const servicos = C.servicos.lista.map((s, i) => `<a class="bloco bloco-${s.tam}" style="--i:${i}" href="${wa(`Olá! Gostaria de saber mais sobre ${s.nome.toLowerCase()} com a Peakalika Turismo.`)}" target="_blank" rel="noopener" data-cursor="Saiba mais" data-bloco>
          ${s.video
    ? `<video class="bloco-midia" muted loop playsinline preload="none" poster="${vid(s.video)}.webp" aria-label="${esc(s.nome)}" data-auto><source src="${vid(s.video)}.mp4" type="video/mp4"></video>`
    : `<img class="bloco-midia" src="${img(s.foto)}" alt="${esc(s.nome)}" width="760" height="1100" loading="lazy">`}
          <span class="bloco-txt"><b>${s.nome}</b><span class="bloco-d">${s.d}</span></span>
          <span class="bloco-seta">${I.setaDiag}</span>
        </a>`).join('\n        ');

// ---------- vistos ----------
const etapas = C.vistos.etapas.map((e) => `<li class="etapa" data-etapa><h3>${e.t}</h3><p>${e.d}</p></li>`).join('');

// ---------- clientes ----------
const estrelas = `<span class="estrelas" aria-label="Nota 5 de 5">${I.estrela.repeat(5)}</span>`;
const depo = C.clientes.depoimentos.map((d, i) => `<article class="depo" style="--i:${i}" data-depo aria-roledescription="depoimento">
            <header><img src="${img(d.foto)}" alt="${esc(d.nome)}" width="90" height="90" loading="lazy"><div><b>${d.nome}</b><span>${I.pino}${d.cidade}</span></div>${estrelas}</header>
            <blockquote>“${esc(d.texto)}”</blockquote>
            ${d.link ? `<a href="${d.link}" target="_blank" rel="noopener">${I.google}Ver avaliação no Google</a>` : `<span class="depo-fonte">${I.google}Avaliação no Google</span>`}
          </article>`).join('\n          ');
const parceiros = C.clientes.parceiros.map((p) => `<img src="assets/img/parceiro-${p}.png" alt="${p[0].toUpperCase() + p.slice(1)}" height="40" loading="lazy">`).join('');

// ---------- instagram ----------
const insta = C.instagram.map((p) => p.video
  ? `<a class="post reel" href="${M.instagram}" target="_blank" rel="noopener" data-post><video muted loop playsinline preload="none" poster="${vid(p.video)}.webp" aria-label="${esc(p.alt)}" data-auto><source src="${vid(p.video)}.mp4" type="video/mp4"></video><span class="reel-marca">${I.play}</span></a>`
  : `<a class="post" href="${M.instagram}" target="_blank" rel="noopener" data-post><img src="${img(p.foto)}" alt="${esc(p.alt)}" width="720" height="900" loading="lazy"></a>`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Viagens, Disney e vistos em Curitiba</title>
<meta name="description" content="Agência de turismo em Curitiba: passagens, hotéis, pacotes, Disney com guiamento virtual exclusivo, cruzeiros e assessoria de visto americano. Recomendada por mais de 5.000 clientes.">
<meta name="theme-color" content="#0A1322">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Era uma vez a sua próxima viagem. Passagens, Disney, cruzeiros e vistos com quem cuida de cada detalhe.">
<meta property="og:image" content="assets/video/capa-fogos.webp">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
${fontes}
<link rel="preload" as="image" href="${vid('capa-fogos')}.webp">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="carregando">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<div class="pre" data-pre aria-hidden="true">
  <div class="pre-ceu" data-estrelas="pre"></div>
  <div class="pre-palco">
    ${I.castelo}
    <div class="pre-logo">${logo}</div>
    <p class="pre-txt">Preparando a sua magia <span data-pre-num>0</span>%</p>
  </div>
</div>

<canvas class="poeira" data-poeira aria-hidden="true"></canvas>
<div class="cursor" data-cursor-el aria-hidden="true"><span></span></div>
<div class="progresso" aria-hidden="true"><i data-progresso></i></div>

<!-- transição do menu: o avião passa puxando a faixa e a página troca por trás -->
<div class="voo" data-voo aria-hidden="true">
  <div class="voo-faixa"><p class="voo-txt"><small>Próxima parada</small><b data-voo-destino></b></p></div>
  <span class="voo-aviao">${I.aviao}</span>
</div>
<!-- avião de praia que cruza o topo rebocando o nome de cada seção nova -->
<div class="reboque" data-reboque aria-hidden="true"><span class="reboque-faixa" data-reboque-txt></span><i class="reboque-corda"></i><span class="reboque-aviao">${I.aviao}</span></div>

<header class="topo" data-topo>
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, voltar ao início">${logo}</a>
    <nav class="nav" aria-label="Principal">
      <a href="#passagens">${rola('Passagens')}</a>
      <a href="#destinos">${rola('Destinos')}</a>
      <a href="#disney">${rola('Disney')}</a>
      <a href="#servicos">${rola('Serviços')}</a>
      <a href="#vistos">${rola('Vistos')}</a>
      <a href="#clientes">${rola('Clientes')}</a>
    </nav>
    <a class="btn btn-coral topo-cta" href="${wa('Olá! Quero planejar uma viagem com a Peakalika Turismo.')}" target="_blank" rel="noopener" data-ima>${rola('Planejar viagem')}</a>
    <button class="menu-bt" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu" data-menu-bt><span></span><span></span></button>
  </div>
</header>
<div class="menu" id="menu" data-menu hidden>
  <nav aria-label="Menu do celular">
    <a href="#passagens">Passagens</a><a href="#destinos">Destinos</a><a href="#disney">Disney</a>
    <a href="#servicos">Serviços</a><a href="#vistos">Vistos</a><a href="#clientes">Clientes</a>
  </nav>
  <a class="btn btn-coral" href="${wa('Olá! Quero planejar uma viagem com a Peakalika Turismo.')}" target="_blank" rel="noopener">${I.whats}Falar no WhatsApp</a>
</div>

<main id="conteudo">

<!-- CAPA: vídeo em tela cheia que, com o scroll, encolhe para dentro de uma janela de castelo -->
<section class="capa" id="inicio" data-pin aria-label="Início">
  <div class="capa-fixa">
    <div class="capa-ceu" data-estrelas="capa" aria-hidden="true"></div>
    <div class="capa-midia" data-capa-midia>
      ${capaVideos}
      <div class="capa-veu" aria-hidden="true"></div>
    </div>
    <div class="capa-moldura" aria-hidden="true"></div>
    <p class="capa-depois" aria-hidden="true"><span>Sonhe.</span><span>Embarque.</span></p>
    <div class="wrap capa-txt">
      <p class="apoio" data-capa-el>${M.completo}, ${M.cidade}</p>
      <h1 class="capa-t">${C.capa.titulo.map((l, i) => `<span class="ln"><span style="--d:${i}">${l}</span></span>`).join('')}</h1>
      <p class="capa-p" data-capa-el>${C.capa.texto}</p>
      <div class="capa-btns" data-capa-el>
        <a class="btn btn-coral" href="#passagens" data-ima>${rola('Começar a planejar')}</a>
        <a class="btn btn-vidro" href="#disney" data-ima>${rola('Ver a magia da Disney')}</a>
      </div>
    </div>
    <div class="capa-cenas" role="group" aria-label="Cenas da capa">${capaCenas}</div>
    <p class="capa-rolar" aria-hidden="true"><span>Role para embarcar</span><i></i></p>
  </div>
</section>

<!-- BUSCA: o buscador do site original, que vira uma mensagem pronta no WhatsApp -->
<section class="busca" id="passagens" data-parada="Passagens" aria-labelledby="busca-t">
  <div class="wrap">
    <form class="busca-card" data-busca data-tilt-leve novalidate>
      <div class="busca-cab">
        <h2 id="busca-t">Comece a planejar hoje com a Peakalika</h2>
        <p>Preencha o que já sabe. A gente devolve as melhores opções no WhatsApp.</p>
      </div>
      <div class="abas" role="radiogroup" aria-label="O que você procura" data-iguais>${abas}</div>
      <div class="busca-linha">
        <label class="campo campo-sel"><span>Trecho</span><select name="trecho" data-trecho>${C.busca.trechos.map((t) => `<option>${t}</option>`).join('')}</select></label>
        <div class="campo campo-pax"><span>Viajantes</span>
          <div class="pax"><button type="button" aria-label="Menos viajantes" data-pax="-1">${I.menos}</button><output data-pax-n>1 viajante</output><button type="button" aria-label="Mais viajantes" data-pax="1">${I.mais}</button></div>
        </div>
      </div>
      <div class="busca-campos">
        <label class="campo"><span>De onde sairemos?</span><input name="origem" placeholder="Curitiba (CWB)" autocomplete="off" data-origem></label>
        <button type="button" class="troca" aria-label="Trocar origem e destino" data-troca>${I.troca}</button>
        <label class="campo"><span>Para onde vamos?</span><input name="destino" placeholder="Orlando (MCO)" autocomplete="off" data-destino></label>
        <label class="campo"><span>Data ida</span><input type="date" name="ida"></label>
        <label class="campo" data-volta><span>Data volta</span><input type="date" name="volta"></label>
        <button class="btn btn-coral busca-bt" type="submit" data-ima>${rola('Buscar')}</button>
      </div>
    </form>
  </div>
</section>

<div class="faixa-zona" aria-hidden="true"><div class="faixa">
  <div class="faixa-trilho">${[0, 1].map(() => `<span>${C.faixa.map((f) => `${f}<i>${I.aviao}</i>`).join('')}</span>`).join('')}</div>
</div></div>

<!-- DESTINOS: galeria horizontal presa ao scroll, com o avião percorrendo a rota -->
<section class="destinos" id="destinos" data-parada="Destinos" data-pin data-destinos aria-labelledby="destinos-t">
  <div class="destinos-fixa">
    <div class="destinos-trilho" data-destinos-trilho>
      <div class="destinos-intro">
        <p class="apoio">Pelo mundo com a Peakalika</p>
        <h2 id="destinos-t">${split(C.destinos.titulo)}</h2>
        <p>${C.destinos.texto}</p>
        <p class="destinos-dica">${I.rota}Role e embarque</p>
      </div>
      ${destinos}
      <a class="destino destino-mais" href="${wa('Olá! Quero conhecer mais destinos com a Peakalika Turismo.')}" target="_blank" rel="noopener" data-tilt data-cursor="Falar com a gente">
        <span class="destino-foto"><img src="${img('nova-york')}" alt="Estátua da Liberdade e o horizonte de Nova York" width="1600" height="1066" loading="lazy" data-destino-img></span>
        <span class="destino-txt"><small>E muito mais</small><strong>Mais destinos</strong><em>Monte o seu roteiro<span class="destino-seta">${I.setaDiag}</span></em></span>
      </a>
    </div>
    <div class="rota-voo" aria-hidden="true">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none"><path d="M0 30 C 250 0, 750 0, 1000 30" pathLength="1"/></svg>
      <span class="rota-aviao" data-rota-aviao>${I.aviao}</span>
    </div>
  </div>
</section>

<!-- MONTANHA-RUSSA: transição de Destinos para a Disney, o trem anda com o scroll e o dia vira noite -->
<section class="montanha" data-pin data-montanha data-parada="Montanha-russa" aria-label="Transição: montanha-russa a caminho da Disney">
  <div class="montanha-fixa" data-montanha-ceu>
    ${I.montanha}
    <p class="mr-antes" aria-hidden="true">${C.montanha.antes}<small>${C.montanha.dica}</small></p>
    <p class="mr-depois" aria-hidden="true">${C.montanha.depois}</p>
  </div>
</section>

<!-- DISNEY: céu estrelado, castelo que se desenha e contador da viagem -->
<section class="disney" id="disney" data-parada="Disney" aria-labelledby="disney-t">
  <canvas class="ceu" data-ceu aria-hidden="true"></canvas>
  <div class="wrap disney-topo">
    <img class="wdw" src="assets/img/parceiro-wdw.png" alt="Walt Disney World" width="460" height="260" loading="lazy" data-anima>
    <h2 id="disney-t">${split(C.disney.titulo)}</h2>
    <p data-anima>${C.disney.texto}</p>
    <div class="dois-bts" data-anima>
      <a class="btn btn-ouro" href="${M.portalDisney}" target="_blank" rel="noopener" data-ima data-fogos-hover>${rola('Montar minha viagem Disney')}</a>
      <a class="btn btn-vidro" href="${wa('Olá! Quero planejar minha viagem para a Disney com a Peakalika Turismo.')}" target="_blank" rel="noopener" data-ima>${rola('Falar com especialista')}</a>
    </div>
  </div>

  <div class="castelo-palco" data-p data-castelo>
    <button type="button" class="castelo-bt" data-castelo-bt aria-label="Soltar fogos sobre o castelo">${I.castelo}</button>
    <p class="castelo-dica">Toque no castelo</p>
  </div>

  <blockquote class="citacao" data-anima>
    <p>“${C.disney.citacao}”</p>
    <cite>${C.disney.autor}</cite>
  </blockquote>

  <ul class="wrap disney-itens">${disneyItens}</ul>

  <div class="wrap contagem" data-anima>
    <div class="contagem-txt">
      <h3>Quanto falta para a magia?</h3>
      <p>Coloque a data da sua viagem e acompanhe a contagem regressiva. Quando chegar, os fogos são por nossa conta.</p>
      <label class="campo campo-data"><span>Data da viagem</span><input type="date" data-contagem-data></label>
    </div>
    <div class="contagem-num" data-contagem aria-live="polite">
      <div><b data-c="d">000</b><span>dias</span></div>
      <div><b data-c="h">00</b><span>horas</span></div>
      <div><b data-c="m">00</b><span>minutos</span></div>
      <div><b data-c="s">00</b><span>segundos</span></div>
    </div>
  </div>
</section>

<!-- UM DIA PERFEITO NA DISNEY: o céu muda do amanhecer à noite e o relógio avança com o scroll -->
<section class="dia" data-pin data-dia data-parada="Um dia na Disney" aria-labelledby="dia-t">
  <div class="dia-fixa">
    <div class="dia-ceu" aria-hidden="true">
      <span class="dia-estrelas"></span>
      <span class="dia-sol" data-dia-sol></span>
      <span class="dia-lua" data-dia-lua></span>
      <span class="dia-nuvem n1">${I.nuvem}</span><span class="dia-nuvem n2">${I.nuvem}</span><span class="dia-nuvem n3">${I.nuvem}</span>
    </div>
    <div class="wrap dia-in">
      <div class="dia-txt">
        <p class="apoio">${C.dia.apoio}</p>
        <h2 id="dia-t">${C.dia.titulo}</h2>
        <p class="dia-hora" aria-hidden="true"><span data-dia-hora>${momentos[0].hora}</span></p>
        <div class="dia-momento" aria-live="polite"><h3 data-dia-titulo>${momentos[0].t}</h3><p data-dia-texto>${momentos[0].d}</p></div>
      </div>
      <div class="dia-ingressos">
          ${ingressos}
      </div>
    </div>
    <div class="wrap"><ol class="dia-regua" aria-hidden="true">${regua}<i data-dia-barra></i></ol></div>
  </div>
</section>

<!-- JANELA DO CASTELO: as cortinas abrem e a câmera entra pela janela até o show de fogos -->
<section class="janela" data-pin data-janela data-parada="O castelo" aria-labelledby="janela-t">
  <div class="janela-fixa">
    <video class="janela-video" muted loop playsinline preload="none" poster="${vid('show-noturno')}.webp" aria-label="Show de luzes e fogos no castelo à noite" data-auto><source src="${vid('show-noturno')}.mp4" type="video/mp4"></video>
    <div class="janela-veu" aria-hidden="true"></div>
    ${I.fachada}
    <p class="janela-convite" aria-hidden="true">${C.janela.convite}<small>${C.janela.dica}</small></p>
    <div class="wrap janela-txt">
      <h2 id="janela-t">${C.janela.titulo}</h2>
      <p>${C.janela.texto}</p>
    </div>
  </div>
</section>

<!-- SERVIÇOS: mosaico de fotos com a Disney em vídeo -->
<section class="servicos" id="servicos" data-parada="Serviços" aria-labelledby="serv-t">
  <div class="wrap">
    <div class="servicos-cab">
      <div>
        <p class="apoio">Tudo em um só lugar</p>
        <h2 id="serv-t">${split(C.servicos.titulo)}</h2>
      </div>
      <div>
        <p>${C.servicos.texto}</p>
        <a class="btn btn-escuro" href="${wa('Olá! Quero um orçamento com a Peakalika Turismo.')}" target="_blank" rel="noopener" data-ima>${rola('Pedir orçamento')}</a>
      </div>
    </div>
    <div class="bento">
        ${servicos}
    </div>
  </div>
</section>

<!-- VISTOS: passaporte em 3D e o caminho do processo desenhado pelo scroll -->
<section class="vistos" id="vistos" data-parada="Vistos" aria-labelledby="vistos-t">
  <div class="vistos-fundo" data-p aria-hidden="true"><img src="${img('nova-york')}" alt="" width="1600" height="1066" loading="lazy"></div>
  <div class="wrap vistos-in">
    <div class="vistos-txt">
      <p class="apoio">${C.vistos.apoio}</p>
      <h2 id="vistos-t">${split(C.vistos.titulo)}</h2>
      <p data-anima>${C.vistos.texto}</p>
      <p data-anima>${C.vistos.texto2}</p>
      <a class="btn btn-coral" href="${wa('Olá! Preciso de ajuda com assessoria de vistos. Podem me orientar sobre o processo?', M.whatsappVistos)}" target="_blank" rel="noopener" data-ima>${rola('Fale com nosso consultor')}</a>
    </div>
    <div class="passaporte-palco" data-passaporte>
      <div class="passaporte">
        <img src="${img('passaporte')}" alt="Passaporte brasileiro na mão de uma viajante" width="900" height="1348" loading="lazy">
        <span class="passaporte-brilho" aria-hidden="true"></span>
      </div>
      <span class="carimbo" aria-hidden="true">Aprovado<small>EUA</small></span>
    </div>
  </div>
  <div class="wrap jornada" data-p data-jornada>
    <svg class="jornada-linha" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <path class="base" d="M20 170 C 200 40, 360 40, 480 120 S 760 210, 900 100 S 1120 30, 1180 60"/>
      <path class="traco" data-jornada-path d="M20 170 C 200 40, 360 40, 480 120 S 760 210, 900 100 S 1120 30, 1180 60" pathLength="1"/>
    </svg>
    <span class="jornada-aviao" data-jornada-aviao aria-hidden="true">${I.aviao}</span>
    <ol class="etapas">${etapas}</ol>
  </div>
</section>

<!-- CONSULTORA -->
<section class="consultora" data-parada="Atendimento" aria-labelledby="cons-t">
  <div class="wrap consultora-in">
    <figure class="consultora-foto" data-p>
      <img src="${img('consultora')}" alt="Consultora da Peakalika Turismo de blazer laranja" width="1000" height="1250" loading="lazy">
    </figure>
    <div class="consultora-txt">
      <p class="apoio">${C.consultora.nome || 'Atendimento de verdade'}</p>
      <h2 id="cons-t">${split(C.consultora.titulo)}</h2>
      <p data-anima>${C.consultora.texto}</p>
      <p class="frase-marca" data-anima>${M.frase}</p>
      <a class="btn btn-escuro" href="${wa('Olá! Quero conversar sobre a minha próxima viagem.')}" target="_blank" rel="noopener" data-ima>${rola('Conversar agora')}</a>
    </div>
  </div>
</section>

<!-- CLIENTES -->
<section class="clientes" id="clientes" data-parada="Clientes" aria-labelledby="cli-t">
  <div class="wrap clientes-in">
    <div class="clientes-cab">
      <p class="clientes-num" aria-hidden="true">+<span data-conta="${C.clientes.numero}">0</span></p>
      <h2 id="cli-t">${split(C.clientes.titulo)}</h2>
      <p data-anima>${C.clientes.texto}</p>
      <div class="parceiros" data-anima>${parceiros}</div>
    </div>
    <div class="baralho-area">
      <div class="baralho" data-baralho>
          ${depo}
      </div>
      <div class="baralho-bts" data-anima>
        <button type="button" class="btn btn-linha" data-depo-ir="-1">${I.setaEsq}Anterior</button>
        <button type="button" class="btn btn-linha" data-depo-ir="1">Próximo${I.seta}</button>
      </div>
    </div>
  </div>
</section>

<!-- INSTAGRAM: esteira curva em 3D com posts e reels -->
<section class="insta" data-parada="Instagram" aria-labelledby="insta-t">
  <div class="wrap insta-cab">
    <h2 id="insta-t">${split('Siga a magia no Instagram')}</h2>
    <a class="insta-user" href="${M.instagram}" target="_blank" rel="noopener">${I.insta}@peakalikaturismo</a>
  </div>
  <div class="insta-palco" data-insta>
    <div class="insta-trilho" data-insta-trilho>${insta}${insta.replace(/data-post/g, 'data-post aria-hidden="true" tabindex="-1"')}</div>
  </div>
</section>

<!-- FINAL -->
<section class="final" data-parada="Final feliz" aria-labelledby="final-t">
  <canvas class="ceu" data-ceu aria-hidden="true"></canvas>
  <div class="wrap final-in">
    <h2 id="final-t">${C.final.titulo.map((l) => `<span class="ln"><span>${l}</span></span>`).join('')}</h2>
    <p data-anima>${C.final.texto}</p>
    <a class="btn btn-ouro btn-grande" href="${wa('Olá! Quero começar o próximo capítulo: planejar minha viagem com a Peakalika.')}" target="_blank" rel="noopener" data-ima data-fogos-hover>${I.whats}${rola('Começar o próximo capítulo')}</a>
  </div>
</section>

</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-cols">
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}">${logo}</a>
        <p>${M.frase}</p>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${wa('Olá, Peakalika!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
      </div>
      <div><h3>Navegação</h3><ul><li><a href="#passagens">Passagens</a></li><li><a href="#destinos">Destinos</a></li><li><a href="#disney">Disney</a></li><li><a href="#servicos">Serviços</a></li><li><a href="#vistos">Vistos</a></li><li><a href="#clientes">Clientes</a></li></ul></div>
      <div><h3>Viagens</h3><ul><li><a href="${M.portalDisney}" target="_blank" rel="noopener">Pacotes Disney</a></li><li><a href="#servicos">Universal</a></li><li><a href="#servicos">Cruzeiros</a></li><li><a href="#servicos">Xcaret</a></li><li><a href="#destinos">Europa</a></li></ul></div>
      <div><h3>Contato</h3><ul class="rodape-contato"><li><a href="${wa('Olá, Peakalika!')}" target="_blank" rel="noopener">${I.whats}${M.telefone}</a></li><li><a href="${M.instagram}" target="_blank" rel="noopener">${I.insta}@peakalikaturismo</a></li><li><span>${I.pino}${M.cidade}</span></li></ul></div>
    </div>
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_curitiba.webp" alt="Mapa do centro de Curitiba com a localização da Peakalika Turismo" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${M.endereco}, ${M.cidade}</span><span>${M.horario}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Atendimento presencial em Curitiba e por WhatsApp para qualquer lugar do Brasil.</p>
        <ul class="chips" data-iguais>${C.atendemos.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-fim">
      <span>© <span data-ano>2026</span> ${M.completo}. Todos os direitos reservados. Desenvolvido por Wilson Neander.</span>
      <span class="rodape-nota">Walt Disney World® é marca registrada de Disney Enterprises, Inc. Vídeos: Pexels e Pixabay.</span>
    </div>
  </div>
</footer>

<div class="chat" data-chat>
  <div class="chat-janela" id="chat-janela" data-chat-janela hidden>
    <div class="chat-cab"><img src="assets/img/apple-touch-icon.png" alt="" width="44" height="44"><div><b>${M.completo}</b><span data-chat-status>Respondemos rapidinho</span></div>
      <button type="button" aria-label="Fechar conversa" data-chat-fecha>${I.fechar}</button></div>
    <div class="chat-corpo">
      <p class="chat-msg">Olá! Para onde vamos? Escolha um assunto e a conversa continua no WhatsApp.</p>
      <div class="chat-ops" data-iguais>${['Disney', 'Passagens', 'Pacotes', 'Vistos', 'Cruzeiros', 'Outro destino'].map((o) => `<button type="button" data-chat-op="${o}">${o}</button>`).join('')}</div>
    </div>
  </div>
  <button type="button" class="chat-bt" aria-expanded="false" aria-controls="chat-janela" data-chat-bt data-ima>${I.whats}<span>Fale conosco!</span></button>
</div>

<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
const tamanho = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((t, f) => t + (f.isDirectory() ? tamanho(path.join(d, f.name)) : fs.statSync(path.join(d, f.name)).size), 0);
console.log('ok', OUT, (tamanho(OUT) / 1048576).toFixed(1) + ' MB');
