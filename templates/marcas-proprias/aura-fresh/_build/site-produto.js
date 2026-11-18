// Modelo 1, "Origem": site de marca e produto com o pote 3D em destaque (fundo verde-noite).
const { empresa: E, produto: P, kits, ativos, depoimentos } = require('./dados');
const X = require('./partes');
const { ic } = X;

const nav = [['#formula', 'Fórmula'], ['#rotulo', 'Rótulo'], ['#rotina', 'Rotina'], ['#comprar', 'Preços'], ['#duvidas', 'Dúvidas'], ['#contato', 'Contato']];

function cab(raiz = '') {
  return `<header class="cab">
  <a class="cab-logo" href="${raiz}index.html" aria-label="AURA Fresh, início"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="120" height="52"></a>
  <nav class="cab-menu" aria-label="Principal">${nav.map(([h, t]) => `<a href="${raiz}index.html${h}">${t}</a>`).join('')}</nav>
  ${X.temaBt()}
  <a class="btn btn-lima cab-cta" href="${raiz}index.html#comprar">Comprar</a>
  <button class="cab-bt" type="button" data-menu aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
</header>`;
}

function pagina({ titulo, desc, corpo, raiz = '', scripts3d = false, url = '' }) {
  return `<!doctype html>
<html lang="pt-BR" data-site="aura-origem" data-tema-padrao="escuro">
<head>
${X.head({ titulo, desc, url, css: ['produto.css', 'tema-produto.css'], raiz, img: raiz + 'assets/img/' })}
</head>
<body>
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
</body>
</html>
`;
}

// pinos do rótulo (iguais no clube)
const pinos = [
  ['clorofila', 'e', 'No rótulo', '100 mg de clorofila', 'Clorofilina cúprica, a forma da clorofila que se dissolve na água. É ela que deixa a bebida verde.'],
  ['salsa', 'e', 'No rótulo', '200 mg de salsa', 'A maior dose da fórmula. Extrato da mesma erva que vai na comida.'],
  ['hortela', 'e', 'No rótulo', '50 mg de hortelã', 'Mentha piperita, o frescor que acompanha o sabor de abacaxi.'],
  ['porcoes', 'd', 'Na frente', '30 doses no pote', 'Uma por dia, um mês inteiro. A colher dosadora vem dentro do pote.'],
  ['uso', 'd', 'No verso', 'Modo de uso à vista', '240 ml de água fria ou suco, uma dose, misture. Sem cápsula para engolir.'],
  ['advertencias', 'd', 'No verso', 'Advertências sem letra miúda', 'Quem não deve tomar sem orientação está escrito no pote e repetido aqui no site.'],
];
function secRotulo({ tom = 'escuro', titulo = 'Tira o rótulo.', lead = 'Tudo o que vai num pote de AURA Fresh, impresso onde dá para ler. Role a página para tirar o rótulo e ver o pó por dentro.' } = {}) {
  return `<section class="rotulo" id="rotulo" data-rotulo="${tom}" aria-labelledby="rotulo-t">
  <div class="rotulo-fixo">
    <canvas class="rotulo-3d" aria-hidden="true"></canvas>
    <svg class="fios" aria-hidden="true">${pinos.map(p => `<path data-fio="${p[0]}" pathLength="1"/>`).join('')}</svg>
    <div class="rotulo-cab">
      <p class="apoio">O que tem no pote</p>
      <h2 class="tit" id="rotulo-t">${titulo}</h2>
      <p class="rotulo-lead">${lead}</p>
    </div>
    <div class="rotulo-pct" aria-hidden="true">
      <div><span>Rótulo fora</span><b data-pct>0%</b></div>
      <i><i data-pct-barra></i></i>
      <p>Composição por dose. Conferir sempre com o rótulo aprovado na embalagem.</p>
    </div>
${pinos.map(p => `    <div class="pino" data-pino="${p[0]}" data-lado="${p[1]}"><span class="ponto"></span><div class="texto"><p class="apoio">${p[2]}</p><h3>${p[3]}</h3><p>${p[4]}</p></div></div>`).join('\n')}
    <div class="rotulo-legenda" data-legenda aria-live="polite"></div>
  </div>
</section>
<section class="rotulo-plano rotulo-plano-${tom}" aria-labelledby="rp-t" data-secao="Informações do rótulo">
  <div class="rp-cab" data-sobe>
    <p class="apoio">O rótulo em texto</p>
    <h3 class="tit" id="rp-t">Informações<br>do rótulo.</h3>
    <p class="rp-lead">A mesma folha que você acabou de ver sair do pote, impressa para ler com calma. Confira sempre com a embalagem que chegou na sua casa.</p>
    <span class="rp-selo" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="rp-circ" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#rp-circ">SUPLEMENTO ALIMENTAR    USO ORAL    </textPath></text><circle cx="60" cy="60" r="27"/><path d="M48 66c4-14 14-20 26-20-2 13-10 22-26 20Zm2-2 14-12" /></svg></span>
  </div>
  <div class="rp-sombra" data-sobe><article class="rp-folha">
    <header class="rp-produto">
      <div><p class="rp-rot">Produto</p><h4>${P.nome}</h4><p>${P.linha}, ${P.sub}. ${P.tipo}, sabor ${P.sabor.toLowerCase()}. ${P.aroma}.</p></div>
      <dl class="rp-numeros">
        <div><dt>Peso líquido</dt><dd>${P.peso}</dd></div>
        <div><dt>Doses no pote</dt><dd>${P.porcoes}</dd></div>
        <div><dt>Cada dose</dt><dd>3 g</dd></div>
        <div><dt>Uso</dt><dd>Oral</dd></div>
      </dl>
    </header>
    <section class="rp-comp">
      <p class="rp-rot">Composição por dose de ${P.porcao}</p>
      <ul>${P.composicao.map(c => { const mg = parseInt(c.qtd, 10); return `<li style="--w:${(mg / 200 * 100).toFixed(0)}%"><span>${c.nome}</span><b>${c.qtd}</b><i aria-hidden="true"></i></li>`; }).join('')}</ul>
      <p class="rp-nota">${P.ingredientes}</p>
    </section>
    <section class="rp-uso">
      <p class="rp-rot">Modo de uso</p>
      <div class="rp-passos"><span><b>240 ml</b>de água fria ou suco</span><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M1 6h34M30 1l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span><b>1 dose</b>com a colher do pote</span><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M1 6h34M30 1l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span><b>Misture</b>e beba, uma vez ao dia</span></div>
    </section>
    <section class="rp-adv">
      <p class="rp-rot">Advertências</p>
      <ul>${P.advertencias.map(a => `<li>${a}</li>`).join('')}</ul>
    </section>
    <section class="rp-contra">
      <p class="rp-rot">Contraindicações</p>
      <p>${P.contraindicacoes}</p>
    </section>
    <footer class="rp-reg">
      <div><p class="rp-rot">Registro</p><p>${E.anvisa}</p><p>${E.razao}, CNPJ ${E.cnpj}. SAC ${E.email}.</p></div>
      <span class="rp-barras" aria-hidden="true"></span>
    </footer>
  </article></div>
</section>`;
}

function index() {
  const k2 = kits[1];
  const corpo = `
<section class="hero" data-hero-pote aria-labelledby="hero-t">
  <div class="hero-fixo">
    <canvas class="hero-3d" aria-hidden="true"></canvas>
    <img class="hero-sem3d" src="assets/img/pote-splash.webp" alt="Pote de AURA Fresh entre folhas de hortelã, salsa e abacaxi" width="1100" height="1100">
    <div class="hero-txt" data-kit-area>
      <p class="apoio">${P.linha}, suplemento em pó</p>
      <h1 class="tit-g" id="hero-t">O cuidado começa <em>por dentro.</em></h1>
      <p class="hero-lead">Clorofila, salsa e hortelã numa dose por dia, sabor abacaxi com hortelã. Você mistura na água e segue o dia.</p>
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

<div class="fita" aria-hidden="true"><div class="fita-trilho">${Array(2).fill(`<span>Clorofila, menta e salsa</span><span>Uma dose por dia</span><span>Sabor abacaxi com hortelã</span><span>Frete grátis para todo o Brasil</span><span>Pó para o preparo de bebida</span><span>Matéria-prima importada</span>`).join('')}</div></div>

<section class="formula" id="formula" aria-labelledby="formula-t">
  <div class="formula-cab" data-sobe>
    <p class="apoio">A fórmula</p>
    <h2 class="tit" id="formula-t">Três plantas,<br>uma colher.</h2>
    <p class="lead">Nada de lista enorme de ingredientes. Cada dose de ${P.porcao} leva três ativos de origem vegetal, nas quantidades impressas no pote. Toque em cada um para ver de perto.</p>
  </div>
  <div class="formula-mosaico">
${ativos.map((a, i) => `    <button type="button" class="ativo ativo-${a.id}" data-ativo="${a.id}" data-sobe style="--a-cor:${a.cor}">
      <img src="assets/img/${a.img}" alt="" loading="lazy">
      <span class="ativo-mg">${a.qtd}</span>
      <span class="ativo-nome">${a.nome}<small>${a.tecnico}</small></span>
      <span class="ativo-frase">${a.frase}</span>
      <span class="ativo-abre">Ver o ativo ${ic.seta}</span>
    </button>`).join('\n')}
    <figure class="formula-foto" data-sobe><img src="assets/img/pote-pedra.webp" alt="Dois potes de AURA Fresh sobre uma pedra clara, com luz de janela" loading="lazy" width="1024" height="1024"><figcaption>Fórmula com matéria-prima importada, fabricada seguindo as normas da Anvisa para suplementos.</figcaption></figure>
  </div>
</section>

${secRotulo()}

<section class="rotina" id="rotina" aria-labelledby="rotina-t">
  <div class="rotina-cab" data-sobe>
    <p class="apoio">Rotina de uso</p>
    <h2 class="tit" id="rotina-t">Um copo por dia.<br>No horário que for seu.</h2>
  </div>
  <ol class="trilha" data-sobe>
    <li><span class="trilha-arte"><svg viewBox="0 0 120 120" aria-hidden="true"><rect x="22" y="40" width="76" height="62" rx="12" fill="#2b462b"/><rect x="18" y="22" width="84" height="24" rx="8" fill="#c4d997"/><path d="M60 8v18" stroke="#c4d997" stroke-width="6" stroke-linecap="round"/></svg></span><b>Abra o pote</b><span>A colher dosadora fica dentro, sobre o pó.</span></li>
    <li><span class="trilha-arte"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M30 24h60l-8 82H38Z" fill="none" stroke="#eef1e6" stroke-width="5" stroke-linejoin="round"/><path d="M36 56h48l-5 46H41Z" fill="#9fc7c0" opacity=".7"/></svg></span><b>240 ml de água fria</b><span>Ou suco, se preferir. Gelado fica melhor.</span></li>
    <li><span class="trilha-arte"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M30 24h60l-8 82H38Z" fill="none" stroke="#eef1e6" stroke-width="5" stroke-linejoin="round"/><path d="M36 56h48l-5 46H41Z" fill="#5f8f2f"/><path d="M48 70c8-6 16 6 24 0M46 84c8-6 18 6 26 0" stroke="#c4d997" stroke-width="4" fill="none" stroke-linecap="round"/></svg></span><b>Uma dose e misture</b><span>A água fica verde. É a clorofila.</span></li>
    <li><span class="trilha-arte"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="40" fill="none" stroke="#c4d997" stroke-width="5"/><path d="M60 34v28l16 10" stroke="#eef1e6" stroke-width="6" stroke-linecap="round" fill="none"/></svg></span><b>Mesmo horário</b><span>Ao acordar ou depois do almoço. O que importa é não pular.</span></li>
  </ol>
  <div class="esperar" data-sobe>
    <div class="esperar-txt">
      <p class="apoio">O que esperar, sem promessa</p>
      <h3>Cada organismo tem o seu tempo.</h3>
      <p>O AURA Fresh não é remédio e não tem prazo garantido. O que contamos aqui é o que clientes relatam com o uso diário, para você saber o que observar.</p>
    </div>
    <ul class="esperar-linha">
      <li><b>Primeira semana</b><span>A dose vira hábito. A clorofila pode deixar as fezes esverdeadas, o que é esperado.</span></li>
      <li data-revisar><b>Primeiras semanas</b><span>O relato mais comum é a sensação de hálito mais fresco ao longo do dia.</span></li>
      <li><b>Todo dia</b><span>Constância pesa mais que quantidade. Não tome mais de uma dose para acelerar.</span></li>
    </ul>
    <p class="esperar-nota">Se o odor for persistente, procure um profissional de saúde. Ele pode ter causas que um suplemento não resolve.</p>
  </div>
</section>

<section class="relatos" aria-labelledby="relatos-t">
  <div class="relatos-cab" data-sobe><p class="apoio">Quem já toma</p><h2 class="tit" id="relatos-t">Relatos de clientes.</h2><p class="lead">Experiências individuais, publicadas com autorização. Não são garantia de resultado.</p></div>
  <div class="relatos-trilho" data-sobe>
${depoimentos.map(d => `    <figure class="relato" data-revisar><img src="assets/img/${d.img}" alt="Cliente segurando o pote de AURA Fresh" loading="lazy" width="540" height="960"><figcaption><span class="relato-tag">${d.tag}</span><blockquote>${d.texto}</blockquote><cite>${d.quem}, ${d.cidade}</cite></figcaption></figure>`).join('\n')}
  </div>
</section>

<section class="comprar" id="comprar" aria-labelledby="comprar-t">
  <div class="comprar-cab" data-sobe><p class="apoio">Preços e kits</p><h2 class="tit" id="comprar-t">Quanto mais potes,<br>menor a dose.</h2><p class="lead">Todos os kits com frete grátis, colher dosadora e as mesmas ${P.porcoes} doses por pote.</p></div>
  ${X.blocoKits({ img: 'pote' })}
</section>

<section class="duvidas" id="duvidas" aria-labelledby="duvidas-t">
  <div class="duvidas-cab" data-sobe><p class="apoio">Perguntas frequentes</p><h2 class="tit" id="duvidas-t">Antes de abrir o pote.</h2><p class="lead">Se a sua dúvida não estiver aqui, a equipe responde no WhatsApp ou pelo formulário.</p></div>
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
  return pagina({ titulo: 'AURA Fresh | Suplemento em pó com clorofila, salsa e hortelã', desc: 'AURA Fresh: suplemento alimentar em pó com clorofila, salsa e hortelã. Uma dose por dia, sabor abacaxi com hortelã, 30 doses por pote e frete grátis.', corpo, scripts3d: true });
}

function legal(chave) {
  const L = X.legais[chave];
  return pagina({ titulo: `${L.titulo} | AURA Fresh`, desc: L.lead, corpo: `<article class="doc"><p class="apoio">${L.apoio}</p><h1>${L.titulo}</h1><p class="lead">${L.lead}</p>${L.corpo}</article>` });
}

module.exports = { paginas: () => ({ 'index.html': index(), 'entrega-e-trocas.html': legal('entrega-e-trocas'), 'privacidade.html': legal('privacidade'), 'termos.html': legal('termos') }), secRotulo, pinos, cab };
