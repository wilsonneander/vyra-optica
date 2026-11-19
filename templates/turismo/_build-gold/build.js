// Gera o modelo Premium de agência de turismo (Peakalika Turismo) em templates/turismo/gold/.
// Conteúdo, imagens e vídeos reaproveitados de https://peakalikaturismo.com/, com visual novo: noite azul-marinho,
// coral da marca e champanhe, cenas da Disney em vídeo, seções que reagem ao scroll e efeitos 3D. Sem bibliotecas.
// Uso: node "templates/turismo/_build-gold/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'gold');
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

// ---------- destinos: mapa-múndi com rotas saindo de Curitiba ----------
const MUNDO = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'mundo.json'), 'utf8'));
const proj = (lat, lon) => [(lon + 180) / 360 * MUNDO.w, (MUNDO.latMax - lat) / (MUNDO.latMax - MUNDO.latMin) * MUNDO.h];
const km = (a, b) => {
  const r = Math.PI / 180, s = Math.sin((b.lat - a.lat) * r / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin((b.lon - a.lon) * r / 2) ** 2;
  return Math.round(12742 * Math.asin(Math.sqrt(s)) / 100) * 100;
};
const O = C.destinos.origem;
const [ox, oy] = proj(O.lat, O.lon);
const DEST = C.destinos.lista.map((d) => {
  const [x, y] = proj(d.lat, d.lon);
  const dist = Math.hypot(x - ox, y - oy);
  const cx = (ox + x) / 2, cy = Math.min(oy, y) - dist * .32;
  return { ...d, x, y, rota: `M${ox.toFixed(1)} ${oy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`, km: km(O, d).toLocaleString('pt-BR'),
    href: d.link || wa(d.wa), src: `assets/${d.foto}.webp` };
});
const mapa = `<svg class="mundo" viewBox="0 0 ${MUNDO.w} ${MUNDO.h}" aria-hidden="true">
          <path class="mundo-pontos" d="${MUNDO.d}"/>
          <g class="rotas">${DEST.map((d) => `<path class="rota" data-rota d="${d.rota}" pathLength="1"/>`).join('')}</g>
          <g class="cidades">${DEST.map((d) => `<g class="cidade" data-cidade transform="translate(${d.x.toFixed(1)} ${d.y.toFixed(1)})"><circle r="2.6"/><text y="-8">${d.cod}</text></g>`).join('')}</g>
          <g class="origem" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})"><circle class="origem-onda" r="4"/><circle r="4"/><text y="16">${O.cod}</text></g>
          <g class="mapa-aviao" data-mapa-aviao><path d="${I.aviaoPath}" transform="translate(-12 -12)"/></g>
        </svg>`;
const destFotos = DEST.map((d, i) => `<img class="dfoto${i ? '' : ' on'}" data-dfoto src="${d.src}" alt="${esc(`${d.cidade}, ${d.pais}`)}" width="1200" height="800" ${i ? 'loading="lazy"' : ''}>`).join('\n          ');
const destCards = DEST.map((d, i) => `<article class="dcard${i ? '' : ' on'}" data-dcard>
            <p class="dcard-rota"><b>${O.cod}</b><i>${I.aviao}</i><b>${d.cod}</b><span>cerca de ${d.km} km de ${O.cidade}</span></p>
            <h3>${d.cidade}</h3>
            <p class="dcard-ponto">${d.ponto}, ${d.pais}</p>
            <div class="dcard-pe"><span>${d.preco}</span><a class="btn btn-coral" href="${d.href}" target="_blank" rel="noopener" data-ima>${rola(d.link ? 'Ver passeio' : 'Montar roteiro')}</a></div>
          </article>`).join('\n          ');
const destLista = DEST.map((d, i) => `<li class="${i ? '' : 'on'}" data-dest-item>${d.cidade}</li>`).join('');

// ---------- transição 3D: montanha-russa em primeira pessoa ----------
const trem = (k) => { const tr = C.transicoes[k]; return `<section class="trem trem-${tr.modo}" data-pin data-trem data-modo="${tr.modo}" data-semente="${tr.semente}" data-nome="${esc(tr.nome)}" data-apoio="${esc(tr.apoio)}" aria-label="${esc(`${tr.apoio}: ${tr.nome}`)}">
  <div class="trem-fixa"><canvas class="trem-tela" data-trem-tela aria-hidden="true"></canvas></div>
</section>`; };

// ---------- disney ----------
const disneyItens = C.disney.itens.map((it) => `<li data-anima><h3>${it.t}</h3><p>${it.d}</p></li>`).join('');

// ---------- roteiro: um dia perfeito na Disney ----------
const momentos = C.dia.momentos;
const rVideos = momentos.map((m, i) => `<video class="rvideo${i ? '' : ' on'}" data-rvideo muted loop playsinline preload="none" poster="${vid(m.video)}.webp" aria-hidden="true"><source src="${vid(m.video)}.mp4" type="video/mp4"></video>`).join('\n      ');
const rLinha = momentos.map((m, i) => `<li class="${i ? '' : 'on'}" data-r-item data-hora="${m.hora}" data-t="${esc(m.t)}" data-d="${esc(m.d)}"><b>${m.hora}</b><span>${m.t}</span></li>`).join('');

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
  <div class="pre-palco">
    <div class="pre-logo">${logo}</div>
    <div class="pre-barra"><i data-pre-barra></i></div>
    <p class="pre-txt"><span data-pre-num>0</span>%</p>
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

<!-- CAPA: vídeos da Disney em tela cheia com o buscador de passagens do site original -->
<section class="capa" id="inicio" aria-label="Início">
  <div class="capa-fixa">
    <div class="capa-midia" data-capa-midia>
      ${capaVideos}
      <div class="capa-veu" aria-hidden="true"></div>
    </div>
    <div class="wrap capa-in">
      <div class="capa-txt">
        <h1 class="capa-t">${C.capa.titulo.map((l, i) => `<span class="ln"><span style="--d:${i}">${l}</span></span>`).join('')}</h1>
        <p class="capa-p" data-capa-el>${C.capa.texto}</p>
        <div class="capa-btns" data-capa-el>
          <a class="btn btn-coral" href="#destinos" data-ima>${rola('Ver destinos')}</a>
          <a class="btn btn-vidro" href="#disney" data-ima>${rola('Ver a magia da Disney')}</a>
        </div>
      </div>
      <div class="capa-busca" id="passagens" data-capa-el>
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
    </div>
    <div class="capa-cenas" role="group" aria-label="Cenas da capa">${capaCenas}</div>
  </div>
</section>

<div class="faixa-zona" aria-hidden="true"><div class="faixa">
  <div class="faixa-trilho">${[0, 1].map(() => `<span>${C.faixa.map((f) => `${f}<i>${I.aviao}</i>`).join('')}</span>`).join('')}</div>
</div></div>

<!-- GALERIA: duas faixas de fotos correndo em sentidos opostos sobre o degradê laranja da marca -->
<section class="galeria" aria-labelledby="galeria-t">
  <div class="wrap galeria-cab">
    <h2 id="galeria-t">${split(C.galeria.titulo)}</h2>
    <p data-anima>${C.galeria.texto}</p>
  </div>
  ${C.galeria.faixas.map((faixa, n) => `<div class="galeria-faixa${n ? ' reversa' : ''}" aria-hidden="${n ? 'true' : 'false'}">
    <div class="galeria-trilho">${[0, 1].map((k) => faixa.map((g) => `<figure class="foto"${k ? ' aria-hidden="true"' : ''}><img src="assets/${g.src}.webp" alt="${k || n ? '' : esc(g.nome)}" width="600" height="760" loading="lazy"><figcaption>${g.nome}</figcaption></figure>`).join('')).join('')}</div>
  </div>`).join('\n  ')}
</section>


${trem('destinos')}

<!-- DESTINOS: mapa-múndi com as rotas saindo de Curitiba; a cada destino o avião voa a rota e a foto troca -->
<section class="destinos" id="destinos" data-pin data-destinos style="--n:${DEST.length}" aria-labelledby="destinos-t">
  <div class="destinos-fixa">
    <div class="destinos-mapa">
      <div class="destinos-cab">
        <p class="apoio">Pelo mundo com a Peakalika</p>
        <h2 id="destinos-t">${C.destinos.titulo}</h2>
        <p>${C.destinos.texto}</p>
      </div>
      <div class="mundo-caixa">
        ${mapa}
      </div>
      <ol class="destinos-lista" aria-hidden="true">${destLista}</ol>
    </div>
    <div class="destinos-info">
      <div class="destinos-fotos">
          ${destFotos}
      </div>
      <div class="destinos-cards" aria-live="polite">
          ${destCards}
      </div>
    </div>
  </div>
</section>

${trem('disney')}

<!-- DISNEY: abertura em vídeo, citação e o que entra no planejamento -->
<section class="disney" id="disney" aria-labelledby="disney-t">
  <div class="disney-capa" data-p>
    <video class="disney-video" muted loop playsinline preload="none" poster="${vid('show-noturno')}.webp" aria-label="Show de luzes e fogos sobre o castelo à noite" data-auto><source src="${vid('show-noturno')}.mp4" type="video/mp4"></video>
    <div class="disney-veu" aria-hidden="true"></div>
    <div class="wrap disney-topo">
      <img class="wdw" src="assets/img/parceiro-wdw.png" alt="Walt Disney World" width="460" height="260" loading="lazy" data-anima>
      <h2 id="disney-t">${split(C.disney.titulo)}</h2>
      <p data-anima>${C.disney.texto}</p>
      <div class="dois-bts" data-anima>
        <a class="btn btn-ouro" href="${M.portalDisney}" target="_blank" rel="noopener" data-ima>${rola('Montar minha viagem Disney')}</a>
        <a class="btn btn-vidro" href="${wa('Olá! Quero planejar minha viagem para a Disney com a Peakalika Turismo.')}" target="_blank" rel="noopener" data-ima>${rola('Falar com especialista')}</a>
      </div>
    </div>
  </div>
  <div class="wrap disney-corpo">
    <blockquote class="citacao" data-anima>
      <p>“${C.disney.citacao}”</p>
      <cite>${C.disney.autor}</cite>
    </blockquote>
    <ul class="disney-itens">${disneyItens}</ul>
  </div>
</section>

<!-- ROTEIRO: um dia perfeito na Disney em vídeo, com a linha do tempo avançando pelo scroll -->
<section class="roteiro" data-pin data-roteiro style="--n:${momentos.length}" aria-labelledby="roteiro-t">
  <div class="roteiro-fixa">
    <div class="roteiro-videos">
      ${rVideos}
    </div>
    <div class="roteiro-veu" aria-hidden="true"></div>
    <div class="wrap roteiro-in">
      <div class="roteiro-txt">
        <p class="apoio">${C.dia.apoio}</p>
        <h2 id="roteiro-t">${C.dia.titulo}</h2>
        <p class="roteiro-hora" aria-hidden="true"><span data-r-hora>${momentos[0].hora}</span></p>
        <div class="roteiro-momento" aria-live="polite"><h3 data-r-titulo>${momentos[0].t}</h3><p data-r-texto>${momentos[0].d}</p></div>
      </div>
      <ol class="roteiro-linha" aria-label="Horários do roteiro"><i data-r-barra aria-hidden="true"></i>${rLinha}</ol>
    </div>
  </div>
</section>

<section class="contagem-sec" aria-labelledby="contagem-t">
  <div class="wrap contagem" data-anima>
    <div class="contagem-txt">
      <h3 id="contagem-t">Quanto falta para a viagem?</h3>
      <p>Coloque a data do embarque e acompanhe a contagem regressiva.</p>
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

<!-- SERVIÇOS: mosaico de fotos com a Disney em vídeo -->
<section class="servicos" id="servicos" aria-labelledby="serv-t">
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
<section class="vistos" id="vistos" aria-labelledby="vistos-t">
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
<section class="consultora" aria-labelledby="cons-t">
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
<section class="clientes" id="clientes" aria-labelledby="cli-t">
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
<section class="insta" aria-labelledby="insta-t">
  <div class="wrap insta-cab">
    <h2 id="insta-t">${split('Siga a magia no Instagram')}</h2>
    <a class="insta-user" href="${M.instagram}" target="_blank" rel="noopener">${I.insta}@peakalikaturismo</a>
  </div>
  <div class="insta-palco" data-insta>
    <div class="insta-trilho" data-insta-trilho>${insta}${insta.replace(/data-post/g, 'data-post aria-hidden="true" tabindex="-1"')}</div>
  </div>
</section>

<!-- FINAL -->
<section class="final" aria-labelledby="final-t">
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
