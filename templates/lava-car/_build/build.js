// Gera o modelo Silver de lava car (Garoa Lava Car) em templates/lava-car/site-silver/.
// Uma página só: Início, Serviços, Planos, Antes e depois, Avaliações, Contato.
// Uso: node "templates/lava-car/_build/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'site-silver');
const M = C.marca;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = M.telefone.replace(/\D/g, '');
const enderecoCompleto = `${M.endereco}, ${M.bairro}, ${M.cidade}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(enderecoCompleto)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;
const real = (n) => n.toLocaleString('pt-BR');

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'video'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'img', 'fotos')))
  fs.copyFileSync(path.join(__dirname, 'img', 'fotos', f), path.join(OUT, 'assets', 'img', f));
for (const f of ['mapa_buritis.webp', 'og.jpg'])
  fs.copyFileSync(path.join(__dirname, 'img', f), path.join(OUT, 'assets', 'img', f));
for (const f of fs.readdirSync(path.join(__dirname, 'video')))
  fs.copyFileSync(path.join(__dirname, 'video', f), path.join(OUT, 'assets', 'video', f));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'style.css'));
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({
    whatsapp: M.whatsapp, abertura: C.abertura,
    niveis: C.niveis.map((n) => ({ id: n.id, nome: n.nome, precos: n.precos })),
    planos: C.planos.map((p) => ({ id: p.id, nome: p.nome, precos: p.precos })),
  })));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,500;0,700;0,800;0,900;1,800;1,900&family=Familjen+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">';

// título que sobe palavra por palavra ao aparecer
const titulo = (tag, txt, attrs = '') => `<${tag}${attrs} data-palavras>${txt.split(' ').map((p) => `<span class="pw"><span>${p}</span></span>`).join(' ')}</${tag}>`;
const letreiro = ['Lavagem técnica', 'Higienização interna', 'Tratamento de couro', 'Revitalização de plásticos', 'Motor a vapor', 'Planos de assinatura', 'Leva e traz'];
const letreiroHtml = (copia) => letreiro.map((t) => `<li${copia ? ' aria-hidden="true"' : ''}>${t}${I.pingo}</li>`).join('');

// ---------- lavagem técnica ----------
const N = C.niveis;
const nivelAbas = N.map((n, i) => `<button type="button" role="tab" id="aba-${n.id}" aria-controls="painel-nivel" aria-selected="${i ? 'false' : 'true'}" data-nivel="${i}" data-texto="${esc(n.texto)}"><span>${n.nome}</span><small>${n.tempo}</small></button>`).join('');
const nivelFotos = N.map((n, i) => `<img src="assets/img/${n.foto}.webp" alt="${esc(n.alt)}" width="960" height="720" loading="lazy" class="${i ? '' : 'ativa'}" data-foto="${i}">`).join('');
const etapasHtml = C.etapas.map(([t, min]) => `<li data-min="${min}"${min ? ' class="fora"' : ''}><span class="marca-etapa">${I.ok}</span>${t}</li>`).join('');

// ---------- acabamentos ----------
const acab = C.acabamentos.map((a, i) => `<li class="acab${i ? '' : ' ativo'}" id="${a.id}" data-acab="${i}">
          <button type="button" class="acab-nome" aria-expanded="${i ? 'false' : 'true'}"><span class="acab-t">${a.nome}</span><span class="acab-mais">${I.mais}</span></button>
          <div class="acab-corpo">
            <img class="acab-foto-mob" src="assets/img/${a.foto}.webp" alt="${esc(a.alt)}" width="1000" height="760" loading="lazy">
            <p>${esc(a.texto)}</p>
            <a class="link-gota" href="${wa(`Olá, Garoa! Quero agendar: ${a.nome}. Meu carro é: `)}" target="_blank" rel="noopener">Agendar${I.seta}</a>
          </div>
        </li>`).join('\n        ');
const acabFotos = C.acabamentos.map((a, i) => `<img src="assets/img/${a.foto}.webp" alt="${esc(a.alt)}" width="1000" height="760" loading="lazy" class="${i ? '' : 'ativa'}" data-foto="${i}">`).join('');

// ---------- vídeos ----------
const V = C.videos;
const videoLista = V.map((v, i) => `<li><button type="button" class="vid-mini${i ? '' : ' ativo'}" data-vid="${i}" data-src="assets/video/${v.arq}.mp4" data-t="${esc(v.t)}" data-d="${esc(v.d)}" aria-label="Assistir: ${esc(v.t)}">
            <video src="assets/video/${v.arq}.mp4#t=1" muted loop playsinline preload="metadata" tabindex="-1"></video>
            <span class="vid-mini-txt"><b>${v.t}</b><small>${v.d}</small></span>
            <span class="vid-mini-play">${I.play}</span>
          </button></li>`).join('\n          ');

// ---------- antes e depois ----------
const AD = C.antesDepois;
const adAbas = AD.map((a, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" data-ad="${i}" data-depois="assets/img/${a.foto}.webp" data-antes="assets/img/${a.foto}-antes.webp" data-alt="${esc(a.alt)}">${a.nome}</button>`).join('');

// ---------- planos ----------
const portesHtml = C.portes.map(([p, d], i) => `<button type="button" role="radio" aria-checked="${p === 'M' ? 'true' : 'false'}" data-porte="${p}"><b>${p}</b><small>${d}</small></button>`).join('');
const planosHtml = C.planos.map((p) => {
  const [lav, qtd] = p.gotas[0];
  const gotas = Array.from({ length: qtd }, () => `<span class="ficha-gota">${I.pingo}</span>`).join('');
  return `<article class="plano${p.destaque ? ' plano-destaque' : ''}" data-plano="${p.id}" data-revela>
          ${p.destaque ? `<p class="plano-selo">${p.destaque}</p>` : ''}
          <h3>${p.nome}</h3>
          <p class="plano-para">${esc(p.para)}</p>
          <div class="ficha" aria-hidden="true">${gotas}${p.extra ? '<span class="ficha-extra">+1 serviço</span>' : ''}<span class="ficha-leg">${qtd} ${lav}${p.extra ? ` e 1 serviço ${p.extra}` : ''}</span></div>
          <p class="plano-preco"><small>R$</small><b data-preco-plano="${p.id}">${p.precos.M}</b><span>/mês</span></p>
          ${p.desconto ? `<p class="plano-desc"><b>${p.desconto}%</b> de desconto nos demais serviços</p>` : '<p class="plano-desc plano-desc-vazio">Lavagem pronta pra rodar a semana toda</p>'}
          <ul>${p.itens.map((t) => `<li>${I.pingo}${t}</li>`).join('')}</ul>
          <a class="btn ${p.destaque ? 'btn-amarelo' : 'btn-claro'}" href="${wa(`Olá, Garoa! Quero assinar o plano ${p.nome}. Porte do carro: M`)}" target="_blank" rel="noopener" data-wa-plano="${p.id}"><span>Assinar ${p.nome}</span></a>
        </article>`;
}).join('\n        ');

// ---------- avaliações ----------
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const estrelas = I.estrela.repeat(5);
const avals = C.avaliacoes.map((a, i) => `<li class="aval" style="--h:${(i * 47) % 360}">
            <div class="aval-estrelas" aria-label="5 de 5 estrelas">${estrelas}</div>
            <p class="aval-txt">${esc(a.texto)}</p>
            <div class="aval-quem"><span class="aval-ini" aria-hidden="true">${iniciais(a.nome)}</span><span><b>${a.nome}</b><small>${a.carro}, ${a.servico}</small></span></div>
          </li>`).join('\n          ');

// ---------- serviços para o formulário ----------
const opcoes = [
  ['Lavagem técnica', N.map((n) => `Lavagem ${n.nome}`)],
  ['Interior e acabamentos', C.acabamentos.map((a) => a.nome)],
  ['Planos de assinatura', C.planos.map((p) => `Plano ${p.nome}`)],
].map(([g, l]) => `<optgroup label="${g}">${l.map((t) => `<option>${t}</option>`).join('')}</optgroup>`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Lavagem técnica e estética automotiva no ${M.bairro}, BH</title>
<meta name="description" content="Lava car no ${M.bairro}, ${M.cidade}: lavagem técnica Platina, Diamante e Rubi, higienização interna, tratamento de couro, revitalização de plásticos, lavagem de motor a vapor e planos de assinatura.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0A1322">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="${esc(M.frase)}">
<meta property="og:image" content="assets/img/og.jpg">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<div class="pre" aria-hidden="true">
  <div class="pre-gota">${I.gota}</div>
  <span class="pre-onda"></span><span class="pre-onda"></span>
</div>

<header class="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="nav" aria-label="Principal">
      <ul>
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#planos">Planos</a></li>
        <li><a href="#antes-depois">Antes e depois</a></li>
        <li><a href="#videos">Vídeos</a></li>
        <li><a href="#avaliacoes">Avaliações</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
    </nav>
    <div class="topo-acoes">
      <span class="status" data-status>Aberto agora</span>
      <a class="btn btn-amarelo btn-p" href="#contato"><span>Agendar</span></a>
      <button class="menu-bt" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-mob">${I.menu}</button>
    </div>
  </div>
</header>

<div class="menu-mob" id="menu-mob" hidden>
  <button class="menu-fecha" type="button" aria-label="Fechar menu">${I.fechar}</button>
  <ul>
    <li><a href="#servicos">Serviços</a></li>
    <li><a href="#planos">Planos</a></li>
    <li><a href="#antes-depois">Antes e depois</a></li>
    <li><a href="#videos">Vídeos</a></li>
    <li><a href="#avaliacoes">Avaliações</a></li>
    <li><a href="#contato">Contato</a></li>
  </ul>
  <a class="btn btn-amarelo" href="${wa('Olá, Garoa! Quero agendar uma lavagem.')}" target="_blank" rel="noopener">${I.whats}<span>Agendar no WhatsApp</span></a>
</div>

<main id="conteudo">
  <section class="capa" id="inicio" aria-labelledby="capa-t">
    <video class="capa-video" src="assets/video/45755.mp4" poster="assets/img/capa.webp" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>
    <div class="capa-veu" aria-hidden="true"></div>
    <div class="capa-vidro" aria-hidden="true"></div>
    <span class="capa-rodo" aria-hidden="true">${I.rodo}</span>
    <div class="bolhas" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${6 + (i * 7) % 7}s;--a:${(i * 0.9) % 6}s;--s:${8 + (i * 5) % 22}px"></i>`).join('')}</div>
    <div class="wrap capa-in">
      <p class="apoio apoio-claro">Lava car e estética automotiva no ${M.bairro}</p>
      <h1 id="capa-t" class="capa-t"><span class="ln"><span>Brilho de</span></span><span class="ln"><span><em>primeiro dia,</em></span></span><span class="ln"><span>toda semana.</span></span></h1>
      <p class="capa-p">Lavagem técnica em três níveis, higienização interna, couro, plásticos e motor a vapor. Com hora marcada e planos de assinatura pra quem não quer pensar nisso toda vez.</p>
      <div class="capa-btns" data-iguais>
        <a class="btn btn-amarelo" href="${wa('Olá, Garoa! Quero agendar uma lavagem.')}" target="_blank" rel="noopener">${I.whats}<span>Agendar pelo WhatsApp</span></a>
        <a class="btn btn-vidro" href="#planos"><span>Conhecer os planos</span></a>
      </div>
    </div>
    <div class="capa-nota">
      <div class="capa-nota-n"><b>${C.notaGoogle}</b><span class="capa-nota-e">${estrelas}</span></div>
      <p>${C.totalAvaliacoes} avaliações no Google</p>
    </div>
    <a class="capa-desce" href="#equipe" aria-label="Rolar para o conteúdo"><span></span></a>
  </section>

  <div class="letreiro" aria-label="Serviços">
    <ul class="letreiro-trilho">${letreiroHtml(false)}${letreiroHtml(true)}</ul>
  </div>

  <section class="equipe" id="equipe" aria-labelledby="equipe-t">
    <div class="wrap equipe-in">
      <div class="equipe-fotos">
        <figure class="equipe-f1" data-paralaxe="-0.06"><img src="assets/img/equipe-pressao.webp" alt="Lavador com lavadora de alta pressão enxaguando um SUV no box" width="1100" height="1300" loading="lazy"></figure>
        <figure class="equipe-f2" data-paralaxe="0.08"><img src="assets/img/equipe-balde.webp" alt="Profissional passando a luva de lavagem no carro preto ao lado dos baldes" width="1200" height="800" loading="lazy"></figure>
        <div class="equipe-selo" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="circ" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#circ">lavagem técnica com hora marcada </textPath></text></svg>${I.gota}</div>
      </div>
      <div class="equipe-txt">
        <p class="apoio">Quem cuida do seu carro</p>
        ${titulo('h2', 'Gente treinada, produto certo e tempo pra fazer direito.', ' id="equipe-t"')}
        <p class="lead">Lava jato é rápido. A Garoa é cuidadosa. Cada carro passa pelas mesmas etapas, na mesma ordem, com o produto feito pra cada superfície. Do shampoo de pH neutro ao pincel que entra no emblema.</p>
        <ul class="compromissos">
          ${C.compromissos.map(([t, d]) => `<li data-revela>${I.pingo}<div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n          ')}
        </ul>
        <div class="numeros">
          ${C.numeros.map((n) => `<p data-revela><b data-conta="${n.n}" data-dec="${n.dec || 0}">0</b>${n.suf ? `<span>${n.suf}</span>` : ''}<small>${n.t}</small></p>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <section class="lavagem" id="servicos" aria-labelledby="lavagem-t">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio apoio-claro">Lavagem técnica</p>
        ${titulo('h2', 'Três níveis de lavagem. Você escolhe o capricho.', ' id="lavagem-t"')}
        <p class="sec-sub">Lavagem completa por dentro e por fora, com produtos e técnicas pra cada necessidade. Disponível para veículos P, M e G.</p>
      </div>
      <div class="nivel">
        <div class="nivel-abas" role="tablist" aria-label="Níveis de lavagem">${nivelAbas}</div>
        <div class="nivel-painel" id="painel-nivel" role="tabpanel" aria-labelledby="aba-${N[0].id}">
          <div class="nivel-foto">${nivelFotos}
            <div class="nivel-medidor" aria-hidden="true"><span class="nivel-agua" data-agua></span><small>Nível de cuidado</small></div>
          </div>
          <div class="nivel-info">
            <h3 data-nivel-nome>${N[0].nome}</h3>
            <p class="nivel-texto" data-nivel-texto>${esc(N[0].texto)}</p>
            <ul class="etapas">${etapasHtml}</ul>
            <div class="nivel-rodape">
              <div class="porte-mini" role="radiogroup" aria-label="Porte do veículo">${C.portes.map(([p], i) => `<button type="button" role="radio" aria-checked="${p === 'M' ? 'true' : 'false'}" data-porte-nivel="${p}">${p}</button>`).join('')}</div>
              <p class="nivel-preco">a partir de <b>R$ <span data-nivel-preco>${N[0].precos.M}</span></b></p>
              <a class="btn btn-amarelo" data-nivel-wa href="${wa(`Olá, Garoa! Quero agendar a lavagem ${N[0].nome}. Porte do carro: M`)}" target="_blank" rel="noopener"><span>Agendar <span data-nivel-bt>${N[0].nome}</span></span></a>
            </div>
            <p class="nota-valor">Valores de referência. Confirme pelo WhatsApp com o modelo do carro.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="acabamentos" aria-labelledby="acab-t">
    <div class="wrap acab-in">
      <div class="acab-lado">
        <p class="apoio">Interior e acabamentos</p>
        ${titulo('h2', 'Cuidado de dentro pra fora.', ' id="acab-t"')}
        <p class="sec-sub">Serviços avulsos ou junto com a lavagem. Escolha um e chame no WhatsApp pra receber o orçamento.</p>
        <div class="acab-moldura" aria-hidden="true">${acabFotos}<span class="acab-rodo"></span></div>
      </div>
      <ul class="acab-lista">
        ${acab}
      </ul>
    </div>
  </section>

  <section class="videos" id="videos" aria-labelledby="videos-t">
    <div class="wrap">
      <div class="sec-topo sec-topo-lado">
        <div>
          <p class="apoio apoio-claro">Bastidores</p>
          ${titulo('h2', 'Veja a lavagem acontecendo.', ' id="videos-t"')}
        </div>
        <p class="sec-sub">Do jato de espuma ao último pano de microfibra. É assim que o seu carro é tratado aqui dentro.</p>
      </div>
      <div class="vid">
        <div class="vid-palco">
          <video class="vid-grande" src="assets/video/${V[0].arq}.mp4" muted loop playsinline preload="metadata" data-vid-grande></video>
          <div class="vid-legenda"><b data-vid-t>${V[0].t}</b><span data-vid-d>${V[0].d}</span></div>
          <button type="button" class="vid-bt" data-vid-bt aria-label="Pausar vídeo"><span class="ico-pausa">${I.pausa}</span><span class="ico-play">${I.play}</span></button>
          <div class="vid-barra" aria-hidden="true"><span data-vid-barra></span></div>
        </div>
        <ul class="vid-lista">
          ${videoLista}
        </ul>
      </div>
    </div>
  </section>

  <section class="antes" id="antes-depois" aria-labelledby="antes-t">
    <div class="wrap antes-in">
      <div class="antes-txt">
        <p class="apoio">Antes e depois</p>
        ${titulo('h2', 'Arraste e veja a diferença.', ' id="antes-t"')}
        <p class="sec-sub">Pintura sem brilho, couro ressecado, painel cheio de poeira. Puxe a barra pro lado e compare o carro que chegou com o carro que saiu.</p>
        <div class="antes-abas" role="tablist" aria-label="Escolha a comparação">${adAbas}</div>
      </div>
      <div class="comp" data-comp style="--p:50%">
        <img class="comp-depois" src="assets/img/${AD[0].foto}.webp" alt="Depois: ${esc(AD[0].alt)} limpos" width="1400" height="900" loading="lazy">
        <div class="comp-antes"><img src="assets/img/${AD[0].foto}-antes.webp" alt="Antes: ${esc(AD[0].alt)} sujos" width="1400" height="900" loading="lazy"></div>
        <span class="comp-rot comp-rot-a" aria-hidden="true">Antes</span><span class="comp-rot comp-rot-d" aria-hidden="true">Depois</span>
        <span class="comp-linha" aria-hidden="true"><span class="comp-puxa">${I.esq}${I.dir}</span></span>
        <input class="comp-range" type="range" min="0" max="100" value="50" aria-label="Arraste para comparar antes e depois">
      </div>
    </div>
  </section>

  <section class="planos" id="planos" aria-labelledby="planos-t">
    <div class="planos-fundo" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-topo sec-topo-centro">
        <p class="apoio apoio-claro">Planos de assinatura</p>
        ${titulo('h2', 'Carro limpo o mês inteiro, sem pensar toda vez.', ' id="planos-t"')}
        <p class="sec-sub">Cuidado recorrente com economia mensal. Escolha o porte do carro e veja o valor de cada plano.</p>
      </div>
      <div class="porte" role="radiogroup" aria-label="Porte do veículo">${portesHtml}</div>
      <div class="planos-grade">
        ${planosHtml}
      </div>
      <div class="como">
        <p class="como-t">Como funciona</p>
        <ol class="como-passos">
          <li><b>Escolha o plano</b><span>pelo porte do carro</span></li>
          <li><b>Agende pelo WhatsApp</b><span>o dia e o horário que preferir</span></li>
          <li><b>Lave quando quiser</b><span>dentro do mês, sem fila</span></li>
        </ol>
        <span class="como-gota" aria-hidden="true">${I.pingo}</span>
      </div>
      <p class="nota-valor nota-centro">Valores variam conforme o porte do veículo e o plano escolhido. Cancele quando quiser.</p>
    </div>
  </section>

  <section class="avaliacoes" id="avaliacoes" aria-labelledby="aval-t">
    <div class="wrap aval-in">
      <div class="aval-lado">
        <p class="apoio">Avaliações</p>
        ${titulo('h2', 'Quem lava aqui, volta.', ' id="aval-t"')}
        <div class="aval-nota">
          <b>${C.notaGoogle}</b>
          <div><span class="aval-estrelas aval-estrelas-g">${estrelas}</span><small>${C.totalAvaliacoes} avaliações no Google</small></div>
        </div>
        <div class="aval-setas">
          <button type="button" data-aval-ant aria-label="Avaliação anterior">${I.esq}</button>
          <button type="button" data-aval-prox aria-label="Próxima avaliação">${I.dir}</button>
        </div>
      </div>
      <div class="aval-janela" data-aval>
        ${I.aspas}
        <ul class="aval-trilho">
          ${avals}
        </ul>
        <div class="aval-prog" aria-hidden="true"><span></span></div>
      </div>
    </div>
  </section>

  <section class="faq" aria-labelledby="faq-t">
    <div class="wrap faq-in">
      <div>
        <p class="apoio">Dúvidas frequentes</p>
        ${titulo('h2', 'Antes de agendar.', ' id="faq-t"')}
        <p class="sec-sub">Não achou a resposta? <a href="${wa('Olá, Garoa! Tenho uma dúvida.')}" target="_blank" rel="noopener">Pergunte no WhatsApp</a>.</p>
      </div>
      <div class="faq-lista">
        ${C.faq.map(([q, r], i) => `<details${i ? '' : ' open'}><summary>${q}<span>${I.mais}</span></summary><div class="faq-r"><p>${r}</p></div></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="contato" id="contato" aria-labelledby="contato-t">
    <div class="wrap contato-in">
      <div class="contato-foto">
        <img src="assets/img/espuma-azul.webp" alt="Carro azul coberto de espuma sendo lavado" width="900" height="1200" loading="lazy">
        <div class="contato-cartao">
          <p class="status status-escuro" data-status>Aberto agora</p>
          <a class="contato-fone" href="tel:+55${tel}">${I.fone}${M.telefone}</a>
          <p>${I.pino}<span>${M.endereco}<br>${M.bairro}, ${M.cidade}</span></p>
          <table class="horas">${C.horarios.map(([d, h]) => `<tr><th>${d}</th><td>${h}</td></tr>`).join('')}</table>
        </div>
      </div>
      <div class="contato-form">
        <p class="apoio">Agendamento</p>
        ${titulo('h2', 'Marque o horário do seu carro.', ' id="contato-t"')}
        <p class="sec-sub">Preencha e a mensagem chega pronta no nosso WhatsApp. A gente confirma o horário em minutos.</p>
        <form class="form" data-form novalidate>
          <label class="campo"><span>Seu nome</span><input name="nome" autocomplete="name" required placeholder="Como podemos te chamar?"></label>
          <label class="campo"><span>WhatsApp</span><input name="fone" inputmode="tel" autocomplete="tel" required placeholder="(31) 9 0000-0000" data-mascara></label>
          <label class="campo"><span>Carro</span><input name="carro" required placeholder="Ex.: Onix 2021 prata"></label>
          <fieldset class="campo campo-porte"><legend>Porte</legend>
            <div class="radios">${C.portes.map(([p, d], i) => `<label><input type="radio" name="porte" value="${p}"${i === 1 ? ' checked' : ''}><span>${p}</span></label>`).join('')}</div>
          </fieldset>
          <label class="campo campo-largo"><span>Serviço</span><select name="servico" required><option value="">Escolha o serviço</option>${opcoes}</select></label>
          <label class="campo"><span>Data</span><input type="date" name="data" required></label>
          <label class="campo"><span>Período</span><select name="periodo"><option>Manhã</option><option>Tarde</option></select></label>
          <label class="campo campo-largo campo-check"><input type="checkbox" name="busca"><span>Quero o leva e traz</span></label>
          <button class="btn btn-azul campo-largo" type="submit">${I.whats}<span>Enviar pelo WhatsApp</span></button>
          <p class="aviso campo-largo" data-aviso role="status"></p>
        </form>
      </div>
    </div>
  </section>

  <section class="insta" aria-labelledby="insta-t">
    <div class="wrap insta-topo">
      <div>
        <p class="apoio">No Instagram</p>
        <h2 id="insta-t"><a href="${M.instagram}" target="_blank" rel="noopener">${M.instagramUser}</a></h2>
      </div>
      <a class="btn btn-escuro" href="${M.instagram}" target="_blank" rel="noopener">${I.insta}<span>Seguir</span></a>
    </div>
    <ul class="insta-fotos">
      ${C.instagram.map((f, i) => `<li style="--i:${i}"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Ver no Instagram"><img src="assets/img/${f}.webp" alt="Carro lavado na Garoa Lava Car" loading="lazy" width="640" height="640"><span class="insta-veu">${I.insta}<small>Ver post</small></span></a></li>`).join('\n      ')}
    </ul>
  </section>
</main>

<footer class="rodape">
  <div class="rodape-onda" aria-hidden="true"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 30c120-26 240-26 360 0s240 26 360 0 240-26 360 0 240 26 360 0v30H0Z"/></svg></div>
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_buritis.webp" alt="Mapa do bairro Buritis, Belo Horizonte, com a localização da Garoa Lava Car" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.completo}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${enderecoCompleto}</span><span>${C.horarioTexto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Leva e traz sem custo nos bairros abaixo. Fora da lista, combine pelo WhatsApp.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a>
        <p>${esc(M.frase)}</p>
        <a class="rodape-fone" href="tel:+55${tel}">${I.fone}${M.telefone}</a>
      </div>
      <div><h3>Navegação</h3><ul><li><a href="#servicos">Lavagem técnica</a></li><li><a href="#planos">Planos</a></li><li><a href="#antes-depois">Antes e depois</a></li><li><a href="#videos">Vídeos</a></li><li><a href="#avaliacoes">Avaliações</a></li><li><a href="#contato">Agendamento</a></li></ul></div>
      <div><h3>Acabamentos</h3><ul>${C.acabamentos.map((a) => `<li><a href="#${a.id}">${a.nome}</a></li>`).join('')}</ul></div>
      <div><h3>Fale com a gente</h3>
        <ul class="rodape-contato"><li>${I.pino}<span>${M.endereco}<br>${M.bairro}, ${M.cidade}</span></li><li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li><li>${I.relogio}<span>${C.horarioTexto}</span></li></ul>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a>
          <a href="${wa('Olá, Garoa!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
      </div>
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Fotos ilustrativas do Unsplash e vídeos do Mixkit.</span></div>
  </div>
</footer>

<a class="whats-flutua" href="${wa('Olá, Garoa! Quero agendar uma lavagem.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>
<a class="sobe-topo" href="#inicio" aria-label="Voltar ao topo"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="anel" cx="24" cy="24" r="21"/><path d="M24 32V16M17 23l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>

<script src="assets/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
