// Modelo 4, "Nascente": a mesma experiência premium do modelo 1 (pote 3D, rótulo que sai, modal, kits)
// com outra direção: preto-água, a gota que cai e o rebote que vira o pote. Seções de vídeo da marca,
// imagens da marca, antes e depois e avaliações.
const { empresa: E, produto: P, kits, ativos, depoimentos } = require('./dados');
const X = require('./partes');
const { secRotulo } = require('./site-produto');
const { ic } = X;

const VIDEO_ID = 'lEygblIM29Y';
const nav = [['#formula', 'Fórmula'], ['#rotulo', 'Rótulo'], ['#pote-3d', '3D'], ['#video', 'Vídeo'], ['#antes-depois', 'Antes e depois'], ['#avaliacoes', 'Avaliações'], ['#comprar', 'Preços'], ['#duvidas', 'Dúvidas']];

function cab(raiz = '') {
  return `<header class="cab">
  <a class="cab-logo" href="${raiz}index.html" aria-label="AURA Fresh, início"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="120" height="52"></a>
  <nav class="cab-menu" aria-label="Principal">${nav.map(([h, t]) => `<a href="${raiz}index.html${h}">${t}</a>`).join('')}</nav>
  ${X.temaBt()}
  <a class="btn btn-lima cab-cta" href="${raiz}index.html#comprar">Comprar</a>
  <button class="cab-bt" type="button" data-menu aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
</header>`;
}

function pagina({ titulo, desc, corpo, raiz = '', scripts3d = false }) {
  return `<!doctype html>
<html lang="pt-BR" data-site="aura-nascente" data-tema-padrao="escuro">
<head>
${X.head({ titulo, desc, css: ['produto.css', 'nascente.css', 'tema-nascente.css'], raiz })}
</head>
<body class="nascente">
${X.carregando(raiz)}
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${cab(raiz)}
<main id="conteudo">
${corpo}
</main>
${X.rodape({ raiz })}
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
<script src="${raiz}assets/js/nascente.js" defer></script>
</body>
</html>
`;
}

// gota desenhada para a marca (máscara das fotos dos ativos e botão do vídeo)
const gotaPath = 'M50 2C50 2 8 52 8 76a42 42 0 0 0 84 0C92 52 50 2 50 2Z';
const estrelas = n => `<span class="estrelas" role="img" aria-label="Nota ${n} de 5">${Array.from({ length: 5 }, (_, i) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${i < n ? 'on' : ''}"><path d="M12 2.8c.4 0 .7.2.9.6l2.3 4.7 5.1.8c.8.1 1.1 1.1.5 1.7l-3.7 3.6.9 5.1c.1.8-.7 1.4-1.4 1L12 17.9l-4.6 2.4c-.7.4-1.5-.2-1.4-1l.9-5.1L3.2 10.6c-.6-.6-.3-1.6.5-1.7l5.1-.8 2.3-4.7c.2-.4.5-.6.9-.6Z"/></svg>`).join('')}</span>`;

// antes e depois: a mesma cena da campanha (mesma mulher), antes com a mão na boca e depois com o casal sorrindo
const par = { antes: 'ad-antes.webp', depois: 'ad-depois.webp', txtA: 'Acordar ao lado de alguém e já tapar a boca antes do bom-dia.', txtD: 'Um copo de água verde virou parte da manhã, e o bom-dia ficou mais perto.' };

// avaliações: os relatos do site atual. A nota de cada um deve vir da plataforma de avaliações (a confirmar)
const avaliacoes = depoimentos.map((d, i) => ({ ...d, nota: 5 }));
const media = (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1).replace('.', ',');

const galeria = [
  ['pote-splash.webp', 'Pote de AURA Fresh entre folhas de hortelã, salsa, abacaxi e água', 'Abacaxi, hortelã e água fria. O sabor que você sente no primeiro gole.', 'quad'],
  ['pessoa-pote.webp', 'Mulher sorrindo com o pote de AURA Fresh nas mãos', 'Um pote, trinta manhãs.', 'quad'],
  ['pote-claro.webp', 'Pote de AURA Fresh com respingos verdes e folhas', 'O verde da clorofila, sem corante para disfarçar.', 'larga'],
  ['explosao.webp', 'Pó verde de AURA Fresh explodindo ao redor do pote', 'O pó dissolve na água em segundos.', 'quad'],
  ['pote-pedra.webp', 'Dois potes de AURA Fresh sobre uma pedra clara', 'Tampa de rosca e colher dosadora dentro.', 'quad'],
];

function index() {
  const k2 = kits[1];
  const corpo = `
<section class="gota" data-gota aria-labelledby="gota-t">
  <div class="gota-fixo">
    <canvas class="gota-3d" aria-hidden="true"></canvas>
    <img class="gota-sem3d" src="assets/img/pote-splash.webp" alt="Pote de AURA Fresh entre respingos de água, hortelã e abacaxi" width="1100" height="1100">
    <div class="gota-intro">
      <p class="apoio">${P.linha}, suplemento em pó</p>
      <h1 class="tit-g" id="gota-t">Tudo começa<br><em>numa gota.</em></h1>
      <p class="gota-role">role para soltar a gota</p>
    </div>
    <ol class="gota-fases" aria-hidden="true">
      <li class="fase" data-fase="0.05,0.22"><b>Água fria</b>a base de todo copo</li>
      <li class="fase" data-fase="0.22,0.42"><b>O rebote</b>a água volta para cima</li>
      <li class="fase" data-fase="0.42,0.62"><b>3 ativos</b>clorofila, salsa e hortelã</li>
      <li class="fase" data-fase="0.62,0.82"><b>30 doses</b>num pote de ${P.peso}</li>
    </ol>
    <div class="gota-fim" data-kit-area>
      <p class="apoio">O cuidado começa por dentro</p>
      <h2 class="tit">Uma dose na água.<br><em>Todo dia.</em></h2>
      <p class="gota-lead">Clorofila, salsa e hortelã, sabor abacaxi com hortelã. Mistura em 240 ml de água fria e pronto.</p>
      <div class="hero-kit">
        <p class="hero-kit-t">Escolha o kit</p>
        <div class="seletor" data-escolhe-kit="kit2" role="group" aria-label="Quantidade de potes">
          ${kits.map(k => `<button type="button" data-kit="${k.id}" aria-pressed="false"><b>${k.potes}</b> ${k.potes > 1 ? 'potes' : 'pote'}</button>`).join('')}
        </div>
        <p class="hero-preco"><b data-kit-total>${k2.totalTxt}</b> <span data-kit-parcela>12x de ${k2.parcelaTxt}</span><span><em data-kit-doses>${k2.doses}</em> doses, <em data-kit-dia>${k2.porDia}</em> por dia. Frete grátis.</span></p>
        <div class="btns" data-iguais><a class="btn btn-lima" href="${k2.url}" data-kit-compra target="_blank" rel="noopener">Comprar agora ${ic.seta}</a><button class="btn btn-contorno" type="button" data-abre-pote>Girar o pote</button></div>
      </div>
    </div>
    <div class="gota-regua" aria-hidden="true"><i></i></div>
  </div>
</section>

<section class="formula-gotas" id="formula" aria-labelledby="formula-t">
  <div class="fg-cab" data-sobe>
    <p class="apoio">A fórmula</p>
    <h2 class="tit" id="formula-t">Três gotas<br>de planta.</h2>
    <p class="lead">Cada dose de ${P.porcao} leva três ativos de origem vegetal, nas quantidades impressas no pote. Toque numa gota para abrir a ficha.</p>
  </div>
  <div class="fg-gotas">
${ativos.map((a, i) => `    <button type="button" class="fg-gota fg-${a.id}" data-ativo="${a.id}" data-paralaxe="${[0.12, -0.08, 0.18][i]}" style="--a-cor:${a.cor}">
      <span class="fg-forma"><img src="assets/img/${a.img}" alt="" loading="lazy"></span>
      <span class="fg-mg">${a.qtd}</span>
      <span class="fg-nome">${a.nome}<small>${a.tecnico}</small></span>
      <span class="fg-frase">${a.frase}</span>
    </button>`).join('\n')}
  </div>
</section>

${secRotulo({ titulo: 'Tira o rótulo.', lead: 'A água formou o pote. Agora a rolagem tira o rótulo e mostra o pó por dentro, com o que está impresso em cada parte.' })}

<section class="palco" id="pote-3d" data-palco aria-labelledby="palco-t">
  <div class="palco-txt" data-sobe>
    <p class="apoio">O pote em 3D</p>
    <h2 class="tit" id="palco-t">Gire, abra<br><em>e confira.</em></h2>
    <p class="lead">Arraste o pote para girar. Abra a tampa para ver o pó e a colher, ou vá direto para a frente ou o verso do rótulo.</p>
    <div class="palco-bts" data-iguais role="group" aria-label="Controles do pote">
      <button type="button" data-palco-acao="tampa" aria-pressed="false">Abrir a tampa</button>
      <button type="button" data-palco-acao="frente">Ver a frente</button>
      <button type="button" data-palco-acao="verso">Ver o verso</button>
    </div>
    <ul class="palco-dados"><li><b>${P.peso}</b>peso líquido</li><li><b>${P.porcoes}</b>doses</li><li><b>3 g</b>por dose</li></ul>
  </div>
  <div class="palco-cena" data-sobe>
    <canvas class="palco-3d" aria-label="Pote de AURA Fresh em 3D. Arraste para girar."></canvas>
    <img class="palco-sem3d" src="assets/img/pote-splash.webp" alt="Pote de AURA Fresh" width="1100" height="1100" loading="lazy">
    <p class="palco-dica" aria-hidden="true">arraste para girar</p>
  </div>
</section>

<section class="video" id="video" aria-labelledby="video-t">
  <div class="video-cab" data-sobe>
    <p class="apoio">Vídeo da marca</p>
    <h2 class="tit" id="video-t">A AURA Fresh<br><em>em movimento.</em></h2>
  </div>
  <div class="video-quadro" data-video="${VIDEO_ID}" data-sobe>
    <img src="assets/img/pote-claro.webp" alt="Pote de AURA Fresh entre respingos de água verde, hortelã, salsa e abacaxi" width="1100" height="825" loading="lazy">
    <button type="button" class="video-play" data-video-play aria-label="Assistir ao vídeo da AURA Fresh">
      <svg viewBox="0 0 100 120" aria-hidden="true"><path class="vp-gota" d="${gotaPath}" transform="translate(0 14)"/><path class="vp-tri" d="M42 72v26l22-13Z"/></svg>
      <span>Assistir ao vídeo</span>
    </button>
    <p class="video-nota">Ao tocar, o vídeo carrega do YouTube, que pode usar cookies próprios.</p>
  </div>
</section>

<section class="galeria" id="imagens" aria-labelledby="galeria-t" data-galeria>
  <div class="galeria-fixo">
    <div class="galeria-cab">
      <p class="apoio">Imagens da marca</p>
      <h2 class="tit" id="galeria-t">Verde de<br>ponta a ponta.</h2>
      <p class="lead">Fotos da campanha da AURA Fresh. Role para passar.</p>
    </div>
    <div class="galeria-trilho" data-galeria-trilho>
${galeria.map(([img, alt, leg, forma]) => `      <figure class="gal gal-${forma}"><img src="assets/img/${img}" alt="${alt}" loading="lazy"><figcaption>${leg}</figcaption></figure>`).join('\n')}
      <a class="gal gal-fim" href="#comprar"><span>Quer um desses<br>na sua cozinha?</span><b>Ver os kits ${ic.seta}</b></a>
    </div>
  </div>
</section>

<section class="ad" id="antes-depois" aria-labelledby="ad-t">
  <div class="ad-txt" data-sobe>
    <p class="apoio">Antes e depois</p>
    <h2 class="tit" id="ad-t">A rotina<br>antes e <em>com AURA.</em></h2>
    <p class="lead">Arraste a linha para comparar. O que muda é o hábito: um copo por dia no lugar das soluções de emergência.</p>
    <dl class="ad-legenda">
      <div><dt>Antes</dt><dd data-ad-a>${par.txtA}</dd></div>
      <div><dt>Com AURA Fresh</dt><dd data-ad-d>${par.txtD}</dd></div>
    </dl>
    <p class="ad-nota" data-revisar>Cena ilustrativa da campanha, com modelos. Não mostra resultado de uso e não é garantia de efeito.</p>
  </div>
  <div class="ad-comp" data-ad data-sobe style="--x:50%">
    <div class="ad-par on">
      <img class="ad-depois" src="assets/img/${par.depois}" alt="Com AURA Fresh: casal abraçado e sorrindo na cama ao acordar" loading="lazy" width="900" height="469">
      <span class="ad-antes"><img class="ad-antes-img" src="assets/img/${par.antes}" alt="Antes: mulher sentada na cama com a mão na boca, preocupada com o hálito" loading="lazy" width="900" height="469"></span>
    </div>
    <span class="ad-rot ad-rot-a" aria-hidden="true">Antes</span><span class="ad-rot ad-rot-d" aria-hidden="true">Com AURA</span>
    <span class="ad-linha" aria-hidden="true"><svg viewBox="0 0 100 120"><path d="${gotaPath}" transform="translate(0 14)"/><path d="M34 82l-9 8 9 8M66 82l9 8-9 8" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <input class="ad-range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois">
  </div>
</section>

<section class="aval" id="avaliacoes" aria-labelledby="aval-t">
  <div class="aval-resumo" data-sobe>
    <p class="apoio">Avaliações</p>
    <h2 class="tit" id="aval-t">Quem toma,<br>conta.</h2>
    <div class="aval-nota" data-revisar><b>${media}</b>${estrelas(5)}<span>média das ${avaliacoes.length} avaliações publicadas aqui. Total na loja: [preencher].</span></div>
    <p class="aval-aviso">Experiências individuais, publicadas com autorização. Não são garantia de resultado.</p>
  </div>
  <div class="aval-grade">
${avaliacoes.map((a, i) => `    <figure class="aval-card${i === 0 ? ' aval-foto' : ''}" data-revisar data-sobe>
      ${i === 0 ? `<img src="assets/img/${a.img}" alt="Cliente com o pote de AURA Fresh" loading="lazy" width="540" height="960">` : ''}
      <div class="aval-corpo">${estrelas(a.nota)}<blockquote>${a.texto}</blockquote><figcaption><span class="aval-ava"><img src="assets/img/${a.img}" alt="" loading="lazy"></span><span><b>${a.quem}</b><small>${a.cidade}, ${a.tag.toLowerCase()}</small></span></figcaption></div>
    </figure>`).join('\n')}
  </div>
</section>

<section class="comprar" id="comprar" aria-labelledby="comprar-t">
  <div class="comprar-cab" data-sobe><p class="apoio">Preços e kits</p><h2 class="tit" id="comprar-t">Quantos meses<br>de água verde?</h2><p class="lead">Todos os kits com frete grátis, colher dosadora e as mesmas ${P.porcoes} doses por pote.</p></div>
  ${X.blocoKits({ img: 'pote' })}
</section>

<section class="duvidas" id="duvidas" aria-labelledby="duvidas-t">
  <div class="duvidas-cab" data-sobe><p class="apoio">Perguntas frequentes</p><h2 class="tit" id="duvidas-t">Antes da<br>primeira gota.</h2><p class="lead">Se a sua dúvida não estiver aqui, a equipe responde no WhatsApp ou pelo formulário.</p></div>
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
  return pagina({ titulo: 'AURA Fresh | Tudo começa numa gota', desc: 'AURA Fresh: suplemento alimentar em pó com clorofila, salsa e hortelã. Uma dose por dia na água, sabor abacaxi com hortelã, 30 doses por pote e frete grátis.', corpo, scripts3d: true });
}

function legal(chave) {
  const L = X.legais[chave];
  return pagina({ titulo: `${L.titulo} | AURA Fresh`, desc: L.lead, corpo: `<article class="doc"><p class="apoio">${L.apoio}</p><h1>${L.titulo}</h1><p class="lead">${L.lead}</p>${L.corpo}</article>` });
}

module.exports = { paginas: () => ({ 'index.html': index(), 'entrega-e-trocas.html': legal('entrega-e-trocas'), 'privacidade.html': legal('privacidade'), 'termos.html': legal('termos') }) };
