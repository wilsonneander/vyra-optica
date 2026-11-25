// Modelo 2, "Diário": página de conteúdo e guia de uso, comparador de rotina, depoimentos, blog e SEO avançado.
// Sem WebGL: HTML estático, imagens com tamanho declarado e carregamento preguiçoso, JS pequeno e adiado.
const { empresa: E, produto: P, kits, ativos, faq, depoimentos } = require('./dados');
const X = require('./partes');
const { ic, esc } = X;

const URL_BASE = 'https://useaurafresh.com'; // domínio do cliente; trocar se o guia ficar em subdomínio
const PUBLICADO = '2026-11-17';

const posts = [
  {
    slug: 'halito-e-odor-corporal-o-que-e-normal', cat: 'Saúde e bem-estar', min: 6, img: 'situ-perceber.webp',
    titulo: 'Hálito e odor corporal: o que é normal e quando procurar ajuda',
    resumo: 'Todo mundo tem cheiro. Entenda o que muda ao longo do dia, o que a rotina influencia e os sinais de que vale conversar com um profissional.',
    corpo: `<p>O corpo tem cheiro, e isso é normal. Suor, alimentação, hidratação, sono e até o estresse mudam a intensidade do odor ao longo do dia. O hálito da manhã, por exemplo, aparece porque a produção de saliva cai durante o sono.</p>
<h2 id="o-que-influencia">O que influencia no dia a dia</h2>
<ul><li>Pouca água: a boca seca favorece o hálito mais forte.</li><li>Longos períodos sem comer.</li><li>Alimentos de cheiro marcante, como alho e cebola.</li><li>Higiene bucal incompleta, principalmente da língua.</li><li>Roupas de tecido que retém suor.</li></ul>
<h2 id="quando-procurar">Quando procurar um profissional</h2>
<p>Se o odor é persistente, mudou de repente ou vem com outros sinais (dor, sangramento na gengiva, febre, alterações digestivas), procure um dentista ou médico. O mau odor pode ter causas que nenhum suplemento resolve, e o diagnóstico vem primeiro.</p>
<h2 id="onde-entra">Onde a rotina entra</h2>
<p>Hábitos simples, como beber água, cuidar da higiene bucal e manter horários de refeição, ajudam a manter a sensação de frescor. O AURA Fresh é um suplemento em pó que pode fazer parte dessa rotina, sem substituir nenhum desses cuidados.</p>`,
  },
  {
    slug: 'clorofila-clorofilina-agua-verde', cat: 'Ingredientes', min: 4, img: 'clorofila.webp',
    titulo: 'Clorofila: o que é a clorofilina e por que ela deixa a água verde',
    resumo: 'O pigmento das plantas, numa forma que se dissolve na água. Veja de onde vem, por que a bebida fica verde e por que as fezes podem mudar de cor.',
    corpo: `<p>Clorofila é o pigmento verde das plantas, o que capta a luz do sol na fotossíntese. A clorofilina é uma forma da clorofila que se dissolve em água, o que permite usá-la num pó para preparo de bebida.</p>
<h2 id="por-que-verde">Por que a água fica verde</h2>
<p>Porque o ativo é um pigmento. Uma dose do AURA Fresh tem 100 mg de clorofilina cúprica, o suficiente para deixar o copo verde na hora em que você mistura.</p>
<h2 id="fezes-verdes">E as fezes verdes?</h2>
<p>O mesmo pigmento passa pelo intestino e pode deixar as fezes esverdeadas. É esperado, e a cor volta ao normal quando você para de tomar. Se notar qualquer outro sintoma, procure um profissional de saúde.</p>
<h2 id="origem">De onde vem</h2>
<p>A clorofilina do AURA Fresh é uma matéria-prima importada. É o ingrediente mais caro da fórmula e o principal motivo do preço do pote.</p>`,
  },
  {
    slug: 'como-criar-um-habito-diario', cat: 'Rotina', min: 5, img: 'pote-pedra.webp',
    titulo: 'Como criar um hábito diário que dura (e não esquecer a dose)',
    resumo: 'Ancorar a dose num momento que já existe no seu dia é o jeito mais fácil de não pular. Três rotinas que funcionam para clientes.',
    corpo: `<p>Suplemento de uso diário depende de constância. A forma mais simples de não esquecer é prender o novo hábito a um que você já tem.</p>
<h2 id="ancora">Escolha uma âncora</h2>
<ul><li>Ao acordar: o copo de água da manhã vira o copo de AURA Fresh.</li><li>Depois do almoço: junto com o café ou a escovação.</li><li>No fim do dia: ao chegar em casa, antes do jantar.</li></ul>
<h2 id="deixe-a-vista">Deixe o pote à vista</h2>
<p>Pote guardado no armário é pote esquecido. Deixe ao lado da garrafa de água ou da cafeteira, com a tampa bem fechada e longe do sol.</p>
<h2 id="nao-compense">Esqueceu? Não compense</h2>
<p>Se pulou um dia, siga normalmente no dia seguinte. Não tome duas doses para compensar: a recomendação é de uma dose por dia.</p>`,
  },
  {
    slug: 'salsa-e-hortela-plantas-da-cozinha', cat: 'Ingredientes', min: 4, img: 'hortela.webp',
    titulo: 'Salsa e hortelã: duas plantas da cozinha com longa tradição',
    resumo: 'Antes de virar extrato, as duas já estavam no prato e no chá depois do almoço. O que cada uma traz para a fórmula e para o sabor.',
    corpo: `<p>A salsa e a hortelã estão entre as ervas mais usadas na cozinha brasileira. No AURA Fresh, aparecem em extrato, nas quantidades impressas no rótulo.</p>
<h2 id="salsa">Salsa, 200 mg por dose</h2>
<p>É o ativo em maior quantidade da fórmula. Rica em compostos naturais da planta, tem uso tradicional ligado à sensação de hálito limpo depois das refeições.</p>
<h2 id="hortela">Hortelã, 50 mg por dose</h2>
<p>A Mentha piperita é a planta do mentol. Na bebida, dá o frescor e combina com o sabor de abacaxi. É a mesma do chá que muita gente toma depois do almoço.</p>
<h2 id="sabor">E o sabor?</h2>
<p>O pó é aromatizado artificialmente com sabor abacaxi com hortelã. Fica melhor bem gelado, em água ou suco.</p>`,
  },
];

const nav = [['guia.html', 'Guia de uso'], ['index.html#rotina', 'Antes e depois da rotina'], ['blog.html', 'Blog'], ['index.html#relatos', 'Relatos'], ['index.html#comprar', 'Preços']];

function cab(raiz = '') {
  return `<header class="cab cab-guia">
  <a class="cab-logo" href="${raiz}index.html" aria-label="AURA Fresh, início"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="110" height="47"></a>
  <nav class="cab-menu" aria-label="Principal">${nav.map(([h, t]) => `<a href="${raiz}${h}">${t}</a>`).join('')}<a href="${raiz}index.html#contato">Contato</a></nav>
  ${X.temaBt()}
  <a class="btn cab-cta" href="${raiz}index.html#comprar">Comprar</a>
  <button class="cab-bt" type="button" data-menu aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
</header>`;
}

const org = { '@type': 'Organization', '@id': URL_BASE + '/#org', name: 'AURA Fresh', legalName: E.razao, taxID: E.cnpj, url: URL_BASE, email: E.email, telephone: E.telefone, logo: URL_BASE + '/assets/img/logo.png', sameAs: [E.instagram, E.facebook, E.linkedin], address: { '@type': 'PostalAddress', streetAddress: E.endereco, addressLocality: 'Indaiatuba', addressRegion: 'SP', postalCode: E.cep, addressCountry: 'BR' } };
const ld = obj => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...obj })}</script>`;
const migalha = itens => ld({ '@type': 'BreadcrumbList', itemListElement: itens.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: URL_BASE + u })) });

function pagina({ titulo, desc, corpo, raiz = '', caminho = '/', extraHead = '', classe = '', rotulo = false, preload = '' }) {
  return `<!doctype html>
<html lang="pt-BR" data-site="aura-diario" data-tema-padrao="claro">
<head>
${X.head({ titulo, desc, url: URL_BASE + caminho, css: ['guia.css', 'tema-guia.css'], raiz, img: raiz + 'assets/img/' })}
${preload ? `<link rel="preload" as="image" href="${raiz}assets/img/${preload}" fetchpriority="high">` : ''}
<meta name="robots" content="index, follow, max-image-preview:large">
${ld({ '@graph': [org, { '@type': 'WebSite', '@id': URL_BASE + '/#site', url: URL_BASE, name: 'AURA Fresh', inLanguage: 'pt-BR', publisher: { '@id': URL_BASE + '/#org' } }] })}
${extraHead}
</head>
<body class="${classe}">
${X.carregando(raiz)}
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
${X.dadosJs(raiz)}
<script src="${raiz}assets/js/kit.js" defer></script>
${rotulo ? `<script src="${raiz}assets/js/rotulo.js" defer></script>` : ''}
<script src="${raiz}assets/js/guia.js" defer></script>
</body>
</html>
`;
}

// comparador de rotina: hábitos de um dia, sem resultado prometido
const rotinaAntes = [['7h', 'Enxaguante bucal antes de sair de casa'], ['10h', 'Bala de menta antes da reunião'], ['13h', 'Chiclete depois do almoço'], ['16h', 'Spray bucal na bolsa'], ['19h', 'Desodorante reforçado antes de sair']];
const rotinaDepois = [['7h', 'Um copo de AURA Fresh com água gelada'], ['7h15', 'Escovação e fio dental, como sempre'], ['13h', 'Água ao longo da tarde'], ['16h', 'Nenhum lembrete extra para o dia'], ['22h', 'Pote ao lado da garrafa para amanhã']];

function index() {
  const corpo = `
<section class="capa" aria-labelledby="capa-t">
  <div class="capa-txt">
    <p class="apoio">Guia AURA Fresh, edição de ${new Date(PUBLICADO).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
    <h1 id="capa-t">O guia do frescor<br>que começa <span class="marca-texto">por dentro.</span></h1>
    <p class="lead">Como usar o AURA Fresh, o que tem no pote, o que esperar sem promessa e conteúdo para quem quer entender o próprio corpo. Tudo num lugar só.</p>
    <div class="btns" data-iguais><a class="btn" href="guia.html">Ler o guia de uso ${ic.seta}</a><a class="btn btn-contorno" href="#comprar">Ver preços</a></div>
  </div>
  <figure class="capa-foto"><img src="assets/img/pote-pedra.webp" alt="Dois potes de AURA Fresh sobre pedra clara, iluminados por luz de janela" width="1024" height="1024" fetchpriority="high"><figcaption>Pó para o preparo de bebida. ${P.porcoes} doses, ${P.peso}.</figcaption></figure>
  <ul class="capa-indice" aria-label="Nesta edição">
    <li><a href="guia.html"><b>Guia de uso</b><span>Preparo, horário e cuidados</span></a></li>
    <li><a href="#rotina"><b>Rotina lado a lado</b><span>Disfarçar ou cuidar</span></a></li>
    <li><a href="#rotulo"><b>Rótulo aberto</b><span>Composição e advertências</span></a></li>
    <li><a href="blog.html"><b>Blog</b><span>${posts.length} artigos novos</span></a></li>
  </ul>
</section>

<section class="passos" aria-labelledby="passos-t">
  <h2 class="tit" id="passos-t" data-sobe>Uma dose, um copo, todo dia.</h2>
  <div class="passos-linha" data-sobe>
    <div><b>Água fria</b><p>240 ml ou mais, ou suco.</p></div>
    <svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 10h52M46 3l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div><b>Uma dose</b><p>Com a colher que vem no pote.</p></div>
    <svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 10h52M46 3l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div><b>Misture e beba</b><p>A água fica verde: é a clorofila.</p></div>
    <svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 10h52M46 3l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div><b>Mesmo horário</b><p>Constância vale mais que quantidade.</p></div>
  </div>
  <a class="link-seta" href="guia.html" data-sobe>Guia completo de uso ${ic.seta}</a>
</section>

<section class="rotina-comp" id="rotina" aria-labelledby="rotina-t">
  <div class="rc-cab" data-sobe>
    <p class="apoio">Rotina lado a lado</p>
    <h2 class="tit" id="rotina-t">Disfarçar o dia todo<br>ou cuidar uma vez por dia.</h2>
    <p class="lead">Arraste a divisória para comparar dois dias de hábitos. É uma comparação de rotina, não de resultado: cada organismo responde de um jeito.</p>
  </div>
  <div class="comp" data-comp style="--x:50%">
    <div class="comp-lado comp-antes" aria-label="Rotina de disfarce">
      <p class="comp-t">Rotina de disfarce</p>
      <ol>${rotinaAntes.map(([h, t]) => `<li><b>${h}</b><span>${t}</span></li>`).join('')}</ol>
      <p class="comp-pe">5 produtos, 5 lembretes no dia.</p>
    </div>
    <div class="comp-lado comp-depois" aria-label="Rotina com AURA Fresh">
      <p class="comp-t">Rotina com AURA Fresh</p>
      <ol>${rotinaDepois.map(([h, t]) => `<li><b>${h}</b><span>${t}</span></li>`).join('')}</ol>
      <p class="comp-pe">1 copo por dia, junto com a higiene de sempre.</p>
    </div>
    <label class="comp-alca"><span class="so-leitor">Comparar rotinas</span><input type="range" min="0" max="100" value="50" data-comp-range><i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg></i></label>
  </div>
  <p class="rc-nota" data-sobe>O AURA Fresh não substitui escovação, fio dental nem consulta com dentista ou médico.</p>
</section>

<section class="rotulo-2d" id="rotulo" aria-labelledby="rotulo-t">
  <div class="r2-cab" data-sobe><p class="apoio">Rótulo aberto</p><h2 class="tit" id="rotulo-t">Tudo o que está<br>impresso no pote.</h2><p class="lead">Toque nos pontos para ler cada parte. A versão em texto está logo abaixo.</p></div>
  <div class="r2-folha" data-rotulo2d data-sobe>
    <div class="r2-canvas"><canvas aria-hidden="true"></canvas>
      <button type="button" class="r2-ponto" data-p="clorofila" aria-label="Clorofila, 100 mg"></button>
      <button type="button" class="r2-ponto" data-p="salsa" aria-label="Salsa, 200 mg"></button>
      <button type="button" class="r2-ponto" data-p="hortela" aria-label="Hortelã, 50 mg"></button>
      <button type="button" class="r2-ponto" data-p="porcoes" aria-label="30 porções"></button>
      <button type="button" class="r2-ponto" data-p="uso" aria-label="Modo de uso"></button>
      <button type="button" class="r2-ponto" data-p="advertencias" aria-label="Advertências"></button>
    </div>
    <div class="r2-leitura" aria-live="polite">
      <div data-t="clorofila" class="on"><b>100 mg de clorofila</b><p>Clorofilina cúprica, a forma da clorofila que se dissolve em água. É o que deixa a bebida verde.</p></div>
      <div data-t="salsa"><b>200 mg de salsa</b><p>A maior dose da fórmula, em extrato da folha.</p></div>
      <div data-t="hortela"><b>50 mg de hortelã</b><p>Mentha piperita, o frescor que acompanha o sabor de abacaxi.</p></div>
      <div data-t="porcoes"><b>30 porções</b><p>Uma dose de ${P.porcao} por dia. O pote dura um mês.</p></div>
      <div data-t="uso"><b>Modo de uso</b><p>${P.uso}</p></div>
      <div data-t="advertencias"><b>Advertências</b><p>${P.advertencias[0]} ${P.advertencias[1]}</p></div>
    </div>
  </div>
  <details class="r2-texto"><summary>Ler o rótulo em texto</summary>
    <dl>
      <div><dt>Produto</dt><dd>${P.nome}, ${P.linha}. ${P.tipo}, sabor ${P.sabor.toLowerCase()}. ${P.aroma}. Peso líquido ${P.peso}.</dd></div>
      <div><dt>Composição por dose de ${P.porcao}</dt><dd>${P.composicao.map(c => `${c.nome}: ${c.qtd}`).join('. ')}. ${P.ingredientes}</dd></div>
      <div><dt>Modo de uso</dt><dd>${P.uso}</dd></div>
      <div><dt>Advertências</dt><dd>${P.advertencias.join(' ')}</dd></div>
      <div><dt>Contraindicações</dt><dd>${P.contraindicacoes}</dd></div>
      <div><dt>Registro</dt><dd>${E.anvisa}</dd></div>
    </dl>
  </details>
  <div class="r2-ativos">${ativos.map(a => `<button type="button" data-ativo="${a.id}" style="--a-cor:${a.cor}"><img src="assets/img/${a.img}" alt="" width="120" height="120" loading="lazy"><span><b>${a.nome}</b> ${a.qtd} por dose</span>${ic.seta}</button>`).join('')}</div>
</section>

<section class="relatos-g" id="relatos" aria-labelledby="relatos-t">
  <div class="rg-cab" data-sobe><p class="apoio">Relatos de clientes</p><h2 class="tit" id="relatos-t">Quem já tomou conta.</h2><p class="lead">Publicados com autorização por escrito. Experiências individuais, que não garantem o mesmo resultado para outras pessoas.</p></div>
  <div class="rg-grade">
${depoimentos.map((d, i) => `    <figure class="rg${i === 0 ? ' rg-grande' : ''}" data-revisar data-sobe><img src="assets/img/${d.img}" alt="Cliente com o pote de AURA Fresh" width="540" height="960" loading="lazy"><figcaption><blockquote>${d.texto}</blockquote><cite>${d.quem}, ${d.cidade}</cite></figcaption></figure>`).join('\n')}
  </div>
</section>

<section class="blog-home" aria-labelledby="blog-t">
  <div class="bh-cab" data-sobe><p class="apoio">Do blog</p><h2 class="tit" id="blog-t">Para ler com calma.</h2><a class="link-seta" href="blog.html">Todos os artigos ${ic.seta}</a></div>
  <div class="bh-grade">
${posts.slice(0, 3).map((p, i) => `    <article class="post-card${i === 0 ? ' post-destaque' : ''}" data-sobe><a href="blog/${p.slug}.html"><figure><img src="assets/img/${p.img}" alt="" width="900" height="700" loading="lazy"></figure><p class="post-meta">${p.cat}, ${p.min} min de leitura</p><h3>${p.titulo}</h3><p>${p.resumo}</p></a></article>`).join('\n')}
  </div>
</section>

<section class="comprar-g" id="comprar" aria-labelledby="comprar-t">
  <div class="cg-cab" data-sobe><p class="apoio">Produto e preços</p><h2 class="tit" id="comprar-t">O que vem e quanto custa.</h2></div>
  ${X.blocoKits({ img: 'foto' })}
</section>

<section class="faq-g" id="duvidas" aria-labelledby="duvidas-t">
  <div data-sobe><p class="apoio">Perguntas frequentes</p><h2 class="tit" id="duvidas-t">Respostas diretas.</h2></div>
  ${X.blocoFaq()}
</section>

<section class="contato-g" id="contato" aria-labelledby="contato-t">
  <div class="cgt" data-sobe><p class="apoio">Contato</p><h2 class="tit" id="contato-t">Escreva para a gente.</h2><p class="lead">WhatsApp ${E.whatsappTexto}, ${E.email} ou telefone ${E.telefone}. ${E.horario}.</p></div>
  ${X.form({ id: 'ct' })}
</section>`;
  const prod = ld({
    '@type': 'Product', name: 'AURA Fresh Inner Freshness Complex', description: 'Suplemento alimentar em pó para o preparo de bebida, com clorofila, salsa e hortelã. Sabor abacaxi com hortelã, 30 porções, 90 g.', brand: { '@type': 'Brand', name: 'AURA Fresh' }, image: URL_BASE + '/assets/img/pote-pedra.webp',
    offers: kits.map(k => ({ '@type': 'Offer', name: k.titulo, price: k.total.toFixed(2), priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: k.url, shippingDetails: { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'BRL' }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BR' } }, hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'BR', returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 7 } })),
  });
  const faqLd = ld({ '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return pagina({ titulo: 'Guia AURA Fresh | Como usar, rótulo, rotina e blog', desc: 'Guia de uso do AURA Fresh: como preparar, o que tem no rótulo, comparação de rotina, relatos de clientes, artigos e preços com frete grátis.', corpo, caminho: '/', extraHead: prod + faqLd, rotulo: true, preload: 'pote-pedra.webp' });
}

function guia() {
  const secs = [
    ['preparo', 'Como preparar', `<p>${P.uso}</p><ol class="lista-num"><li>Coloque 240 ml ou mais de água fria ou suco num copo.</li><li>Adicione 1 dose medidora (a colher que vem dentro do pote).</li><li>Misture bem até dissolver. A bebida fica verde.</li><li>Beba em seguida.</li></ol>`],
    ['horario', 'Qual o melhor horário', '<p>Não existe horário certo. O melhor é aquele em que você não esquece: ao acordar, depois do almoço ou no fim do dia. Escolha um e mantenha.</p>'],
    ['quantidade', 'Quantidade por dia', '<p>Uma dose por dia, como indicado no rótulo. Tomar mais não acelera nada e não é recomendado. Se esquecer um dia, siga normalmente no dia seguinte.</p>'],
    ['esperado', 'O que é esperado', '<p>A clorofila é um pigmento verde e pode deixar as fezes esverdeadas. É esperado e passa quando você para de tomar.</p><p data-revisar>O relato mais comum de clientes é a sensação de hálito mais fresco nas primeiras semanas de uso diário. Não há prazo garantido.</p>'],
    ['quem-nao', 'Quem não deve tomar sem orientação', `<p>${P.contraindicacoes}</p><ul>${P.advertencias.map(a => `<li>${a}</li>`).join('')}</ul>`],
    ['guardar', 'Como guardar', '<p>Em local seco e fresco, longe do sol, com a tampa bem fechada. Use a colher seca para não empedrar o pó.</p>'],
    ['procurar', 'Quando procurar um profissional', '<p>Se o odor for persistente, mudou de repente ou veio com outros sintomas, converse com um dentista ou médico. O AURA Fresh é um suplemento e não trata doenças.</p>'],
  ];
  const howto = ld({ '@type': 'HowTo', name: 'Como preparar o AURA Fresh', totalTime: 'PT1M', supply: [{ '@type': 'HowToSupply', name: 'AURA Fresh em pó' }, { '@type': 'HowToSupply', name: '240 ml de água fria ou suco' }], tool: [{ '@type': 'HowToTool', name: 'Colher dosadora' }], step: ['Coloque 240 ml ou mais de água fria ou suco num copo.', 'Adicione 1 dose medidora.', 'Misture bem até dissolver.', 'Beba em seguida, uma vez ao dia.'].map((t, i) => ({ '@type': 'HowToStep', position: i + 1, text: t })) });
  const corpo = `<article class="artigo guia-pag">
  <nav class="migalha" aria-label="Você está em"><a href="index.html">Início</a> <span aria-hidden="true">/</span> <span>Guia de uso</span></nav>
  <header class="art-cab"><p class="apoio">Guia de uso</p><h1>Como usar o AURA Fresh</h1><p class="lead">Preparo, horário, cuidados e o que esperar. Leitura de 4 minutos.</p></header>
  <div class="art-grade">
    <aside class="art-indice"><p>Nesta página</p><nav aria-label="Seções do guia">${secs.map(s => `<a href="#${s[0]}">${s[1]}</a>`).join('')}</nav></aside>
    <div class="art-corpo">${secs.map(s => `<section id="${s[0]}"><h2>${s[1]}</h2>${s[2]}</section>`).join('\n')}
      <aside class="art-cta"><img src="assets/img/pote-splash.webp" alt="" width="300" height="300" loading="lazy"><div><b>${P.porcoes} doses por pote</b><p>A partir de ${kits[2].porDia} por dia no kit de 3 potes. Frete grátis.</p><a class="btn" href="index.html#comprar">Ver preços ${ic.seta}</a></div></aside>
    </div>
  </div>
</article>`;
  return pagina({ titulo: 'Como usar o AURA Fresh | Guia de uso', desc: 'Passo a passo para preparar o AURA Fresh, melhor horário, quantidade por dia, cuidados, quem não deve tomar e como guardar o pote.', corpo, caminho: '/guia.html', extraHead: howto + migalha([['Início', '/'], ['Guia de uso', '/guia.html']]) });
}

function blog() {
  const cats = [...new Set(posts.map(p => p.cat))];
  const corpo = `<section class="blog-pag">
  <nav class="migalha" aria-label="Você está em"><a href="index.html">Início</a> <span aria-hidden="true">/</span> <span>Blog</span></nav>
  <header class="art-cab"><p class="apoio">Blog AURA Fresh</p><h1>Dicas para o dia a dia.</h1><p class="lead">Conteúdo sobre rotina, ingredientes e bem-estar, escrito em linguagem simples. Nada aqui substitui uma consulta.</p></header>
  <div class="filtro" role="group" aria-label="Filtrar por tema" data-filtro data-iguais><button type="button" aria-pressed="true" data-cat="">Todos</button>${cats.map(c => `<button type="button" aria-pressed="false" data-cat="${c}">${c}</button>`).join('')}</div>
  <div class="bh-grade blog-lista">
${posts.map((p, i) => `    <article class="post-card${i === 0 ? ' post-destaque' : ''}" data-cat="${p.cat}"><a href="blog/${p.slug}.html"><figure><img src="assets/img/${p.img}" alt="" width="900" height="700" loading="lazy"></figure><p class="post-meta">${p.cat}, ${p.min} min de leitura</p><h2>${p.titulo}</h2><p>${p.resumo}</p></a></article>`).join('\n')}
  </div>
</section>`;
  return pagina({ titulo: 'Blog AURA Fresh | Rotina, ingredientes e bem-estar', desc: 'Artigos sobre hálito e odor corporal, clorofila, salsa, hortelã e como criar um hábito diário.', corpo, caminho: '/blog.html', extraHead: migalha([['Início', '/'], ['Blog', '/blog.html']]) });
}

function artigo(p) {
  const outros = posts.filter(x => x !== p).slice(0, 2);
  const h2s = [...p.corpo.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  const art = ld({ '@type': 'Article', headline: p.titulo, description: p.resumo, image: URL_BASE + '/assets/img/' + p.img, datePublished: PUBLICADO, dateModified: PUBLICADO, author: { '@type': 'Organization', name: 'Equipe AURA Fresh' }, publisher: { '@id': URL_BASE + '/#org' }, mainEntityOfPage: URL_BASE + '/blog/' + p.slug + '.html', inLanguage: 'pt-BR' });
  const corpo = `<article class="artigo">
  <nav class="migalha" aria-label="Você está em"><a href="../index.html">Início</a> <span aria-hidden="true">/</span> <a href="../blog.html">Blog</a> <span aria-hidden="true">/</span> <span>${p.cat}</span></nav>
  <header class="art-cab"><p class="apoio">${p.cat}, ${p.min} min de leitura</p><h1>${p.titulo}</h1><p class="lead">${p.resumo}</p>
    <p class="art-autor">Por Equipe AURA Fresh. Publicado em <time datetime="${PUBLICADO}">${new Date(PUBLICADO + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</time>. Revisão técnica: [profissional de saúde a definir].</p></header>
  <figure class="art-capa"><img src="../assets/img/${p.img}" alt="" width="1100" height="700" fetchpriority="high"></figure>
  <div class="art-grade">
    <aside class="art-indice"><p>Neste artigo</p><nav aria-label="Seções do artigo">${h2s.map(m => `<a href="#${m[1]}">${m[2]}</a>`).join('')}</nav></aside>
    <div class="art-corpo">${p.corpo}
      <p class="art-aviso">Conteúdo informativo. Não substitui a orientação de médico, dentista ou nutricionista.</p>
      <aside class="art-cta"><img src="../assets/img/pote-splash.webp" alt="" width="300" height="300" loading="lazy"><div><b>Conheça o AURA Fresh</b><p>Clorofila, salsa e hortelã numa dose por dia. Frete grátis.</p><a class="btn" href="../index.html#comprar">Ver preços ${ic.seta}</a></div></aside>
    </div>
  </div>
  <section class="relacionados" aria-labelledby="rel-t"><h2 id="rel-t">Leia também</h2><div class="bh-grade">${outros.map(o => `<article class="post-card"><a href="${o.slug}.html"><figure><img src="../assets/img/${o.img}" alt="" width="900" height="700" loading="lazy"></figure><p class="post-meta">${o.cat}, ${o.min} min</p><h3>${o.titulo}</h3></a></article>`).join('')}</div></section>
</article>`;
  return pagina({ titulo: `${p.titulo} | Blog AURA Fresh`, desc: p.resumo, corpo, raiz: '../', caminho: '/blog/' + p.slug + '.html', extraHead: art + migalha([['Início', '/'], ['Blog', '/blog.html'], [p.titulo, '/blog/' + p.slug + '.html']]) });
}

function legal(chave) {
  const L = X.legais[chave];
  return pagina({ titulo: `${L.titulo} | AURA Fresh`, desc: L.lead, caminho: '/' + chave + '.html', corpo: `<article class="doc"><p class="apoio">${L.apoio}</p><h1>${L.titulo}</h1><p class="lead">${L.lead}</p>${L.corpo}</article>` });
}

function paginas() {
  const out = { 'index.html': index(), 'guia.html': guia(), 'blog.html': blog(), 'entrega-e-trocas.html': legal('entrega-e-trocas'), 'privacidade.html': legal('privacidade'), 'termos.html': legal('termos') };
  posts.forEach(p => { out['blog/' + p.slug + '.html'] = artigo(p); });
  const urls = Object.keys(out).map(f => '/' + f.replace(/^index\.html$/, ''));
  out['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${URL_BASE}${u}</loc><lastmod>${PUBLICADO}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  out['robots.txt'] = `User-agent: *\nAllow: /\nSitemap: ${URL_BASE}/sitemap.xml\n`;
  return out;
}

module.exports = { paginas };
