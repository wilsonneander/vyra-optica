// Modelo 5, "Maré": a terceira versão premium do produto. Claro (água e rosa), tipografia grande e muito ar.
// Hero: a onda de água enrolada em volta do pote quebra, desce e escreve AURA com a água.
// Depois: o pote que abre com as folhas (cena do modelo 1), texto que enche de água, ativos revelados por uma onda,
// ritual numa linha de água, rótulo, avaliações em faixas que correm com a rolagem, kits, dúvidas e contato.
const { empresa: E, produto: P, kits, ativos, depoimentos } = require('./dados');
const X = require('./partes');
const { ic } = X;

const nav = [['#mare', 'Entrega'], ['#pote', 'O pote'], ['#formula', 'Fórmula'], ['#ritual', 'Ritual'], ['#avaliacoes', 'Avaliações'], ['#comprar', 'Preços']];

function cab(raiz = '') {
  return `<header class="cab">
  <a class="cab-logo" href="${raiz}index.html" aria-label="AURA Fresh, início"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="120" height="52"></a>
  <nav class="cab-menu" aria-label="Principal">${nav.map(([h, t]) => `<a href="${raiz}index.html${h}">${t}</a>`).join('')}</nav>
  ${X.temaBt()}
  <a class="cab-sacola" href="${raiz}index.html#comprar" aria-label="Ver os kits e comprar"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8.5h11l-1 11.5h-9Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/><path d="M10.2 13.6c.9 1 2.7 1 3.6 0" /></svg></a>
  <button class="cab-bt" type="button" data-menu aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
</header>`;
}

// carregamento: a logo e uma linha de água que se desenha embaixo (ganchos do kit.js escondidos)
const carregandoMare = (raiz = '') => `<div class="carga carga-mare" data-carga role="status" aria-label="Carregando AURA Fresh">
  <div class="carga-centro">
    <img class="cmare-logo" src="${raiz}assets/img/logo.png" alt="" width="160" height="69">
    <svg class="cmare-onda" viewBox="0 0 240 24" aria-hidden="true"><path class="cmare-trilho" d="M2 12c20-14 38-14 58 0s38 14 58 0 38-14 58 0 38 14 58 0"/><path class="cmare-agua" pathLength="1" d="M2 12c20-14 38-14 58 0s38 14 58 0 38-14 58 0 38 14 58 0"/></svg>
    <svg hidden aria-hidden="true"><g class="carga-agua"></g><path class="carga-onda"/></svg>
    <p class="carga-fase" data-carga-fase hidden></p>
    <p class="carga-pct" hidden><b data-carga-pct>0</b>%</p>
  </div>
</div>`;

function pagina({ titulo, desc, corpo, raiz = '', scripts3d = false }) {
  return `<!doctype html>
<html lang="pt-BR" data-site="aura-mare" data-tema-padrao="claro">
<head>
${X.head({ titulo, desc, css: ['produto.css', 'mare.css', 'tema-mare.css'], raiz })}
</head>
<body class="mare">
${carregandoMare(raiz)}
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${cab(raiz)}
<main id="conteudo">
${corpo}
</main>
${X.rodape({ raiz, mapa: 'mapa-papel.webp' })}
${X.nivel()}
${X.zap()}
${X.cookies(raiz)}
${X.modalAtivo()}
${scripts3d ? X.modalPote(raiz) : ''}
${X.dadosJs(raiz)}
<script src="${raiz}assets/js/kit.js" defer></script>
${scripts3d ? `<script src="${raiz}assets/js/three.min.js" defer></script>
<script src="${raiz}assets/js/rotulo.js" defer></script>
<script src="${raiz}assets/js/pote-3d.js" defer></script>` : ''}
<script src="${raiz}assets/js/produto.js" defer></script>
<script src="${raiz}assets/js/mare.js" defer></script>
</body>
</html>
`;
}

const estrelas = n => `<span class="estrelas" role="img" aria-label="Nota ${n} de 5">${Array.from({ length: 5 }, (_, i) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${i < n ? 'on' : ''}"><path d="M12 2.8c.4 0 .7.2.9.6l2.3 4.7 5.1.8c.8.1 1.1 1.1.5 1.7l-3.7 3.6.9 5.1c.1.8-.7 1.4-1.4 1L12 17.9l-4.6 2.4c-.7.4-1.5-.2-1.4-1l.9-5.1L3.2 10.6c-.6-.6-.3-1.6.5-1.7l5.1-.8 2.3-4.7c.2-.4.5-.6.9-.6Z"/></svg>`).join('')}</span>`;

// frase que enche de água conforme a rolagem
const frase = 'Clorofila de verdade, salsa na maior dose do pote e hortelã para o primeiro gole. Sem corante para disfarçar o verde: a cor do copo é a cor da planta.';
const destaques = ['Clorofila', 'salsa', 'hortelã', 'verde:', 'planta.'];


const ritual = [
  ['240 ml', 'de água fria ou suco no copo. Gelado fica melhor.'],
  ['1 dose', 'com a colher que já vem dentro do pote.'],
  ['Misture', 'por alguns segundos e beba. Uma vez ao dia.'],
];

function index() {
  const k1 = kits[0], k2 = kits[1];
  const corpo = `
<section class="mh" id="mare" data-mare aria-labelledby="mh-t">
  <div class="mh-fixo">
    <canvas class="mare-3d" aria-hidden="true"></canvas>
    <img class="mh-sem3d" src="assets/img/pote-splash.webp" alt="Pote de AURA Fresh entre respingos de água, hortelã e abacaxi" width="1100" height="1100">
    <div class="mh-intro">
      <h1 class="mh-tit" id="mh-t">Um copo d'água<br>pode ser <em>verde?</em></h1>
      <p class="mh-lead">Uma dose de AURA Fresh em 240 ml de água fria. Clorofila, salsa e hortelã, com sabor de abacaxi com hortelã.</p>
      <div class="mh-acoes">
        <a class="btn mh-comprar" href="${k1.url}" target="_blank" rel="noopener">Quero o meu <span>${k1.totalTxt}</span></a>
        <a class="mh-link" href="#formula">Ver o que tem dentro</a>
      </div>
    </div>
    <div class="mh-meio">
      <h2 class="mh-meio-t">Sai daqui<br><em>do jeito certo.</em></h2>
      <p class="mh-meio-lead">Na caixa da marca, com papel de seda e a colher dosadora dentro do pote.</p>
    </div>
    <p class="mh-role" aria-hidden="true"><svg viewBox="0 0 20 28"><path d="M10 2C10 2 3 11 3 16a7 7 0 0 0 14 0C17 11 10 2 10 2Z"/></svg>Role</p>
    <div class="mh-fim" data-kit-area>
      <h2 class="mh-fim-t">Frete grátis<br><em>até a sua porta.</em></h2>
      <p class="mh-fim-lead">O código de rastreio chega por e-mail e WhatsApp assim que o pedido sai.</p>
      <div class="seletor mh-seletor" data-escolhe-kit="kit2" role="group" aria-label="Quantidade de potes">
        ${kits.map(k => `<button type="button" data-kit="${k.id}" aria-pressed="false"><b>${k.potes}</b> ${k.potes > 1 ? "potes" : "pote"}</button>`).join("")}
      </div>
      <p class="mh-preco"><b data-kit-total>${k2.totalTxt}</b> <span data-kit-parcela>12x de ${k2.parcelaTxt}</span></p>
      <div class="mh-acoes"><a class="btn mh-comprar" href="${k2.url}" data-kit-compra target="_blank" rel="noopener">Comprar agora ${ic.seta}</a><a class="mh-link" href="#comprar">Comparar os kits</a></div>
    </div>
  </div>
</section>

<section class="hero mp" id="pote" data-hero-pote aria-labelledby="mp-t">
  <div class="hero-fixo">
    <canvas class="hero-3d" aria-hidden="true"></canvas>
    <img class="hero-sem3d" src="assets/img/pote-splash.webp" alt="Pote de AURA Fresh entre folhas de hortelã, salsa e abacaxi" width="1100" height="1100" loading="lazy">
    <div class="hero-txt" data-kit-area>
      <p class="apoio">O pote, de perto</p>
      <h2 class="tit-g" id="mp-t">Abre a tampa,<br><em>solta o verde.</em></h2>
      <p class="hero-lead">${P.peso} de pó para o preparo de bebida, ${P.porcoes} doses e a colher dosadora dentro. Escolha quantos meses quer em casa.</p>
      <div class="hero-kit">
        <p class="hero-kit-t">Escolha o kit</p>
        <div class="seletor" data-escolhe-kit="kit2" role="group" aria-label="Quantidade de potes">
          ${kits.map(k => `<button type="button" data-kit="${k.id}" aria-pressed="false"><b>${k.potes}</b> ${k.potes > 1 ? 'potes' : 'pote'}</button>`).join('')}
        </div>
        <p class="hero-preco"><b data-kit-total>${k2.totalTxt}</b> <span data-kit-parcela>12x de ${k2.parcelaTxt}</span><span><em data-kit-doses>${k2.doses}</em> doses, <em data-kit-dia>${k2.porDia}</em> por dia. Frete grátis.</span></p>
        <div class="btns" data-iguais><a class="btn btn-lima" href="${k2.url}" data-kit-compra target="_blank" rel="noopener">Comprar agora ${ic.seta}</a><button class="btn btn-contorno" type="button" data-abre-pote>Ver o pote de perto</button></div>
      </div>
    </div>
    <div class="hero-fases" aria-hidden="true">
      <p class="fase" data-fase="0.16,0.36"><b>100 mg</b>de clorofila</p>
      <p class="fase" data-fase="0.36,0.54"><b>200 mg</b>de salsa</p>
      <p class="fase" data-fase="0.54,0.74"><b>50 mg</b>de hortelã</p>
      <p class="fase fase-fim" data-fase="0.74,1.01"><b>1 dose</b>por dia, 30 no pote</p>
    </div>
    <p class="hero-role" aria-hidden="true">role para abrir o pote</p>
    <div class="hero-barra" aria-hidden="true"><i></i></div>
  </div>
</section>

<section class="enche" id="formula" data-enche aria-labelledby="enche-t">
  <div class="enche-fixo">
    <svg class="enche-mar" viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true"><path class="em-a" d=""/><path class="em-b" d=""/></svg>
    <div class="enche-txt">
      <p class="apoio" id="enche-t">A fórmula</p>
      <p class="enche-frase">${frase.split(' ').map(w => `<span${destaques.includes(w) ? ' class="d"' : ''}>${w}</span>`).join(' ')}</p>
    </div>
  </div>
</section>

<section class="ativos-m" aria-labelledby="ativos-t">
  <div class="am-cab" data-sobe>
    <h2 class="tit" id="ativos-t">Três plantas,<br><em>na dose do rótulo.</em></h2>
    <p class="lead">Toque em cada uma para ler a ficha. As quantidades são as impressas no pote, por dose de ${P.porcao}.</p>
  </div>
  <div class="am-lista">
${ativos.map((a, i) => `    <button type="button" class="am" data-ativo="${a.id}" data-am style="--a-cor:${a.cor}">
      <span class="am-foto"><span class="am-img"><img src="assets/img/${a.img}" alt="" loading="lazy" style="--w:${({ clorofila: 700, hortela: 500, salsa: 300 })[a.id] || 400}px"></span><svg class="am-crista" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d=""/></svg></span>
      <span class="am-txt"><b>${a.nome}</b><small>${a.tecnico}</small><span>${a.frase}</span></span>
      <span class="am-qtd">${a.qtd}</span>
    </button>`).join('\n')}
  </div>
</section>

<section class="ritual-m" id="ritual" data-ritual aria-labelledby="ritual-t">
  <div class="rm-cab" data-sobe>
    <p class="apoio">Modo de uso</p>
    <h2 class="tit" id="ritual-t">Leva menos que<br><em>um bom-dia.</em></h2>
  </div>
  <div class="rm-trilha">
    <svg class="rm-linha" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path class="rm-fundo" d="M0 60C100 10 200 10 300 60S500 110 600 60 800 10 900 60 1100 110 1200 60"/><path class="rm-agua" pathLength="1" d="M0 60C100 10 200 10 300 60S500 110 600 60 800 10 900 60 1100 110 1200 60"/></svg>
    <ol class="rm-passos">
${ritual.map(([b, t], i) => `      <li data-rm="${i}"><svg class="rm-gota" viewBox="0 0 20 28" aria-hidden="true"><path d="M10 2C10 2 3 11 3 16a7 7 0 0 0 14 0C17 11 10 2 10 2Z"/></svg><b>${b}</b><span>${t}</span></li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="rotulo-m" id="rotulo" aria-labelledby="rotulo-t">
  <div class="rot-cab" data-sobe>
    <p class="apoio">O que diz o rótulo</p>
    <h2 class="tit" id="rotulo-t">Tudo à vista,<br><em>como a água.</em></h2>
    <p class="lead">${P.nome} ${P.linha}, ${P.sub}. ${P.tipo}, sabor ${P.sabor.toLowerCase()}. ${P.aroma}. ${P.peso}, ${P.porcoes} porções.</p>
  </div>
  <div class="rot-col" data-sobe>
    <details class="rot-item" open><summary>Advertências<i aria-hidden="true"></i></summary><ul>${P.advertencias.map(a => `<li>${a}</li>`).join('')}</ul></details>
    <details class="rot-item"><summary>Contraindicações<i aria-hidden="true"></i></summary><p>${P.contraindicacoes}</p></details>
    <details class="rot-item"><summary>Ingredientes e registro<i aria-hidden="true"></i></summary><p>${P.ingredientes}</p><p>${E.anvisa}</p><p>Fabricante: ${E.razao}, CNPJ ${E.cnpj}. SAC: ${E.email}.</p></details>
  </div>
</section>

<section class="aval-m" id="avaliacoes" data-faixas aria-labelledby="aval-t">
  <div class="av-cab" data-sobe>
    <div><p class="apoio">Avaliações</p>
    <h2 class="tit" id="aval-t">Quem toma,<br><em>conta.</em></h2></div>
    <p class="av-nota" data-revisar>${estrelas(5)}<span>Relatos de clientes do site atual. Nota e total da loja: [preencher].</span></p>
  </div>
${[0, 1].map(f => `  <div class="av-faixa" data-faixa="${f ? -1 : 1}"><div class="av-trilho">
${[...depoimentos, ...depoimentos].map((d, i) => `    <figure class="av" data-revisar${i >= depoimentos.length ? ' aria-hidden="true"' : ''}>${f ? `<img src="assets/img/${d.img}" alt="" loading="lazy">` : ''}<blockquote>${d.texto}</blockquote><figcaption><b>${d.quem}</b> ${d.cidade}</figcaption></figure>`).join('\n')}
  </div></div>`).join('\n')}
  <p class="av-aviso">Experiências individuais, publicadas com autorização. Não são garantia de resultado.</p>
</section>

<section class="comprar" id="comprar" aria-labelledby="comprar-t">
  <div class="comprar-cab" data-sobe><p class="apoio">Preços e kits</p><h2 class="tit" id="comprar-t">Quantas marés<br><em>de verde?</em></h2><p class="lead">Todos os kits com frete grátis, colher dosadora e as mesmas ${P.porcoes} doses por pote.</p></div>
  ${X.blocoKits({ img: 'pote' })}
</section>

<section class="duvidas" id="duvidas" aria-labelledby="duvidas-t">
  <div class="duvidas-cab" data-sobe><p class="apoio">Perguntas frequentes</p><h2 class="tit" id="duvidas-t">Antes do<br>primeiro copo.</h2><p class="lead">Se a sua dúvida não estiver aqui, a equipe responde no WhatsApp ou pelo formulário.</p></div>
  ${X.blocoFaq()}
</section>

<section class="contato" id="contato" aria-labelledby="contato-t">
  <div class="contato-cab" data-sobe>
    <p class="apoio">Contato</p>
    <h2 class="tit" id="contato-t">Fala com a gente.</h2>
    <ul class="contato-canais">
      <li><b>WhatsApp</b><a href="${X.zapLink()}" target="_blank" rel="noopener">${E.whatsappTexto}</a></li>
      <li><b>E-mail</b><a href="mailto:${E.email}">${E.email}</a></li>
      <li><b>Telefone</b><a href="tel:${E.telefoneLink}">${E.telefone}</a></li>
      <li><b>Instagram</b><a href="${E.instagram}" target="_blank" rel="noopener">@aurafreshbrasil</a></li>
      <li><b>Horário</b><span>${E.horario}</span></li>
      <li><b>Endereço</b><span>${E.enderecoLinha}</span></li>
    </ul>
  </div>
  ${X.form({ id: 'ct' })}
</section>`;
  return pagina({ titulo: 'AURA Fresh | Um copo d\'água pode ser verde', desc: 'AURA Fresh: suplemento alimentar em pó com clorofila, salsa e hortelã. Uma dose por dia em 240 ml de água, sabor abacaxi com hortelã, 30 doses por pote e frete grátis.', corpo, scripts3d: true });
}

function legal(chave) {
  const L = X.legais[chave];
  return pagina({ titulo: `${L.titulo} | AURA Fresh`, desc: L.lead, corpo: `<article class="doc"><p class="apoio">${L.apoio}</p><h1>${L.titulo}</h1><p class="lead">${L.lead}</p>${L.corpo}</article>` });
}

module.exports = { paginas: () => ({ 'index.html': index(), 'entrega-e-trocas.html': legal('entrega-e-trocas'), 'privacidade.html': legal('privacidade'), 'termos.html': legal('termos') }) };
