// Modelo 3, "Ritual": tudo do modelo 1 (pote 3D, rótulo que sai, modal de ativos, rotina, FAQ, compra)
// em outra direção (claro, rosa e lima, o ritual do copo em 3D) e com a Área do cliente.
const { empresa: E, produto: P, kits, ativos, depoimentos } = require('./dados');
const X = require('./partes');
const { secRotulo } = require('./site-produto');
const { ic } = X;

const nav = [['index.html#ritual', 'Ritual'], ['index.html#ativos', 'Ativos'], ['index.html#rotulo', 'Rótulo'], ['index.html#comprar', 'Preços'], ['index.html#duvidas', 'Dúvidas']];

function cab(raiz = '', ativo = '') {
  return `<header class="cab cab-claro">
  <a class="cab-logo" href="${raiz}index.html" aria-label="AURA Fresh, início"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="120" height="52"></a>
  <nav class="cab-menu" aria-label="Principal">${nav.map(([h, t]) => `<a href="${raiz}${h}">${t}</a>`).join('')}<a href="${raiz}index.html#contato">Contato</a></nav>
  <div class="cab-acoes" data-iguais><a class="btn btn-contorno cab-conta${ativo === 'cliente' ? ' cab-atual' : ''}" href="${raiz}cliente.html"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.4-3.6 4.2-5.3 7.5-5.3s6.1 1.7 7.5 5.3"/></svg>Área do cliente</a><a class="btn cab-cta" href="${raiz}index.html#comprar">Comprar</a></div>
  <button class="cab-bt" type="button" data-menu aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
</header>`;
}

function pagina({ titulo, desc, corpo, raiz = '', scripts3d = false, extraJs = '', classe = '' }) {
  return `<!doctype html>
<html lang="pt-BR" data-site="aura-ritual">
<head>
${X.head({ titulo, desc, css: ['produto.css', 'clube.css'].concat(classe === 'cliente' ? ['cliente.css'] : []), raiz })}
</head>
<body class="${classe}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${cab(raiz, classe)}
<main id="conteudo">
${corpo}
</main>
${X.rodape({ raiz, mapa: 'mapa-papel.webp' })}
${X.zap()}
${X.cookies(raiz)}
${X.modalAtivo()}
${scripts3d ? X.modalPote(raiz) : ''}
${X.dadosJs(raiz)}
<script src="${raiz}assets/js/kit.js" defer></script>
${scripts3d ? `<script src="${raiz}assets/js/three.min.js" defer></script>
<script src="${raiz}assets/js/rotulo.js" defer></script>
<script src="${raiz}assets/js/pote-3d.js" defer></script>
<script src="${raiz}assets/js/produto.js" defer></script>` : ''}
<script src="${raiz}assets/js/clube.js" defer></script>
${extraJs}
</body>
</html>
`;
}

function index() {
  const k2 = kits[1];
  const corpo = `
<section class="ritual" id="ritual" data-ritual aria-labelledby="ritual-t">
  <div class="ritual-fixo">
    <canvas class="ritual-3d" aria-hidden="true"></canvas>
    <img class="ritual-sem3d" src="assets/img/pote-claro.webp" alt="Pote de AURA Fresh com folhas de hortelã, salsa, abacaxi e água verde" width="1100" height="825">
    <div class="ritual-txt" data-kit-area>
      <p class="apoio">Clube AURA Fresh</p>
      <h1 class="tit-g" id="ritual-t">Um minuto<br>por dia <em>é o<br>ritual.</em></h1>
      <p class="ritual-lead">Água fria, uma dose de clorofila, salsa e hortelã, e a água fica verde. Role a página e prepare o primeiro copo.</p>
      <div class="hora" role="group" aria-label="Quando você toma">
        <p>Quando você toma?</p>
        <div class="hora-bts" data-hora>
          <button type="button" data-h="manha" aria-pressed="true">Ao acordar</button><button type="button" data-h="tarde" aria-pressed="false">Depois do almoço</button><button type="button" data-h="noite" aria-pressed="false">No fim do dia</button>
        </div>
      </div>
      <div class="btns" data-iguais><a class="btn" href="#comprar">Começar meu ritual ${ic.seta}</a><button class="btn btn-contorno" type="button" data-abre-pote>Ver o pote em 3D</button></div>
    </div>
    <ol class="ritual-passos" aria-label="Passos do preparo">
      <li data-fase="0,0.24"><b>240 ml</b><span>de água fria no copo</span></li>
      <li data-fase="0.24,0.46"><b>1 dose</b><span>com a colher que vem no pote</span></li>
      <li data-fase="0.46,0.78"><b>Misture</b><span>até a água ficar verde</span></li>
      <li data-fase="0.78,1.01"><b>Pronto</b><span>até amanhã, no mesmo horário</span></li>
    </ol>
    <div class="ritual-tempo" aria-hidden="true"><span>preparo</span><i><i></i></i><span>1 min</span></div>
  </div>
</section>

<section class="ativos-sec" id="ativos" aria-labelledby="ativos-t">
  <div class="ativos-cab" data-sobe><p class="apoio">O que vai na colher</p><h2 class="tit" id="ativos-t">Três ativos,<br>em doses impressas.</h2><p class="lead">Passe o mouse ou toque em cada planta. A ficha completa abre num clique.</p></div>
  <div class="sanfona" data-sobe>
${ativos.map((a, i) => `    <article class="folha${i === 0 ? ' aberta' : ''}" style="--a-cor:${a.cor}" tabindex="0">
      <img src="assets/img/${a.img}" alt="" loading="lazy">
      <div class="folha-topo"><b>${a.qtd}</b><span>${a.nome}</span></div>
      <div class="folha-mais"><p class="folha-tec">${a.tecnico}</p><p>${a.frase}</p><button type="button" class="btn btn-lima" data-ativo="${a.id}">Ficha do ativo ${ic.seta}</button></div>
    </article>`).join('\n')}
  </div>
</section>

${secRotulo({ tom: 'claro', titulo: 'Tira o rótulo.', lead: 'Composição, modo de uso e advertências, como estão impressos no pote. Role para abrir o rótulo e ver o pó por dentro.' })}

<section class="mes" aria-labelledby="mes-t">
  <div class="mes-txt" data-sobe>
    <p class="apoio">Um pote, um mês</p>
    <h2 class="tit" id="mes-t">30 doses.<br>Um copo por dia.</h2>
    <p class="lead">O pote foi pensado para durar um mês de uso diário. No clube, você recompra com um clique antes de acabar e acompanha a entrega pela Área do cliente.</p>
    <ul class="mes-lista">
      <li><b>Sem promessa de prazo</b>Cada organismo responde no seu tempo. O AURA Fresh é um suplemento, não um tratamento.</li>
      <li data-revisar><b>O que clientes contam</b>O relato mais comum é a sensação de hálito mais fresco nas primeiras semanas de uso diário.</li>
      <li><b>Se o odor persistir</b>Procure um profissional de saúde. Ele pode ter causas que um suplemento não resolve.</li>
    </ul>
  </div>
  <div class="mes-cal" data-mes aria-hidden="true"><div class="mes-grade">${Array.from({ length: 30 }, () => '<i></i>').join('')}</div><p class="mes-leg"><span data-mes-dias>0</span> de 30 doses</p></div>
</section>

<section class="relatos relatos-claro" aria-labelledby="relatos-t">
  <div class="relatos-cab" data-sobe><p class="apoio">Relatos com autorização</p><h2 class="tit" id="relatos-t">Quem já tem o ritual.</h2><p class="lead">Experiências individuais. Não são garantia de resultado.</p></div>
  <div class="relatos-trilho" data-sobe>
${depoimentos.map(d => `    <figure class="relato" data-revisar><img src="assets/img/${d.img}" alt="Cliente com o pote de AURA Fresh" loading="lazy" width="540" height="960"><figcaption><span class="relato-tag">${d.tag}</span><blockquote>${d.texto}</blockquote><cite>${d.quem}, ${d.cidade}</cite></figcaption></figure>`).join('\n')}
  </div>
</section>

<section class="comprar comprar-claro" id="comprar" aria-labelledby="comprar-t">
  <div class="comprar-cab" data-sobe><p class="apoio">Preços e kits</p><h2 class="tit" id="comprar-t">Escolha quantos<br>meses de ritual.</h2><p class="lead">Frete grátis, colher dosadora e ${P.porcoes} doses por pote em todos os kits.</p></div>
  ${X.blocoKits({ img: 'pote' })}
</section>

<section class="conta-teaser" aria-labelledby="conta-t">
  <div class="conta-txt" data-sobe>
    <p class="apoio">Área do cliente</p>
    <h2 class="tit" id="conta-t">Seu pedido,<br>na sua mão.</h2>
    <p class="lead">Acompanhe a entrega, recompre com um clique, pause ou ajuste a assinatura, baixe a segunda via da nota fiscal e decida o que fazemos com os seus dados.</p>
    <div class="btns" data-iguais><a class="btn" href="cliente.html">Entrar na Área do cliente ${ic.seta}</a><a class="btn btn-contorno" href="cliente.html#recuperar">Esqueci minha senha</a></div>
  </div>
  <div class="conta-tela" data-sobe aria-hidden="true">
    <div class="ct-topo"><b>Olá, Camila</b><span>Pedido AF-10482</span></div>
    <div class="ct-rastreio"><span class="on">Pago</span><span class="on">Separado</span><span class="on">Em trânsito</span><span>Entregue</span></div>
    <p class="ct-prev">Entrega estimada: quinta-feira</p>
    <div class="ct-acoes"><span>Recomprar em 1 clique</span><span>Nota fiscal</span><span>Pausar assinatura</span></div>
  </div>
</section>

<section class="duvidas duvidas-claro" id="duvidas" aria-labelledby="duvidas-t">
  <div class="duvidas-cab" data-sobe><p class="apoio">Perguntas frequentes</p><h2 class="tit" id="duvidas-t">Antes do primeiro copo.</h2><p class="lead">Não achou a sua? Chame no WhatsApp.</p></div>
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
  return pagina({ titulo: 'AURA Fresh | O ritual de uma dose por dia', desc: 'Clube AURA Fresh: suplemento em pó com clorofila, salsa e hortelã, uma dose por dia. Compre, acompanhe pedidos e recompre com um clique na Área do cliente.', corpo, scripts3d: true });
}

function cliente() {
  const corpo = `<div class="area" data-area>
  <section class="entrar" data-tela="entrar" aria-labelledby="entrar-t">
    <div class="entrar-arte" aria-hidden="true"><img src="assets/img/pote-claro.webp" alt=""><p>Seu ritual, seus pedidos e seus dados num lugar só.</p></div>
    <div class="entrar-caixa">
      <form class="form-entrar" data-entrar novalidate>
        <p class="apoio">Área do cliente</p>
        <h1 id="entrar-t">Entrar</h1>
        <div class="campo"><label for="en-email">E-mail</label><input id="en-email" name="email" type="email" autocomplete="username" required></div>
        <div class="campo"><label for="en-senha">Senha</label><input id="en-senha" name="senha" type="password" autocomplete="current-password" required></div>
        <p class="msg-erro" data-entrar-erro aria-live="assertive"></p>
        <button class="btn" type="submit">Entrar ${ic.seta}</button>
        <button class="link" type="button" data-vai="recuperar">Esqueci minha senha</button>
        <p class="demo">Demonstração: <b>cliente@aurafresh.com.br</b> e senha <b>aura2026</b>. Dados fictícios.</p>
      </form>
      <form class="form-entrar" data-recuperar hidden novalidate>
        <p class="apoio">Recuperar acesso</p>
        <h1>Esqueceu a senha?</h1>
        <p class="txt">Informe o e-mail da compra. Enviamos um código de 6 dígitos que vale por 15 minutos.</p>
        <div class="campo" data-passo="1"><label for="rc-email">E-mail</label><input id="rc-email" name="email" type="email" autocomplete="email" required></div>
        <div class="campo" data-passo="2" hidden><label for="rc-cod">Código recebido</label><input id="rc-cod" name="codigo" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>
        <div class="campo" data-passo="2" hidden><label for="rc-nova">Nova senha</label><input id="rc-nova" name="nova" type="password" autocomplete="new-password" minlength="8"></div>
        <p class="msg-erro" data-rec-msg aria-live="polite"></p>
        <button class="btn" type="submit" data-rec-bt>Enviar código ${ic.seta}</button>
        <button class="link" type="button" data-vai="entrar">Voltar para o login</button>
      </form>
    </div>
  </section>

  <section class="painel" data-tela="painel" hidden aria-label="Painel do cliente">
    <aside class="painel-menu">
      <div class="painel-ola"><span class="avatar" data-avatar></span><div><b data-nome></b><small data-email></small></div></div>
      <nav aria-label="Seções da conta" data-abas>
        <button type="button" data-aba="inicio" aria-current="page">Início</button>
        <button type="button" data-aba="pedidos">Pedidos</button>
        <button type="button" data-aba="assinatura">Assinatura</button>
        <button type="button" data-aba="notas">Notas fiscais</button>
        <button type="button" data-aba="dados">Dados cadastrais</button>
        <button type="button" data-aba="enderecos">Endereços</button>
        <button type="button" data-aba="privacidade">Privacidade e LGPD</button>
        <button type="button" data-aba="suporte">Suporte</button>
      </nav>
      <button type="button" class="sair" data-sair>Sair da conta</button>
    </aside>
    <div class="painel-conteudo" data-conteudo tabindex="-1"></div>
  </section>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;
  return pagina({ titulo: 'Área do cliente | AURA Fresh', desc: 'Entre na Área do cliente AURA Fresh para acompanhar pedidos, recomprar, gerenciar a assinatura, baixar notas fiscais e cuidar dos seus dados.', corpo, classe: 'cliente', extraJs: `<script>window.AURA_EMPRESA=${JSON.stringify({ email: E.email, zap: X.zapLink('Olá! Preciso de ajuda com meu pedido.'), razao: E.razao, cnpj: E.cnpj, endereco: E.enderecoLinha })};</script>\n<script src="assets/js/cliente.js" defer></script>` });
}

function legal(chave) {
  const L = X.legais[chave];
  return pagina({ titulo: `${L.titulo} | AURA Fresh`, desc: L.lead, corpo: `<article class="doc"><p class="apoio">${L.apoio}</p><h1>${L.titulo}</h1><p class="lead">${L.lead}</p>${L.corpo}</article>` });
}

module.exports = { paginas: () => ({ 'index.html': index(), 'cliente.html': cliente(), 'entrega-e-trocas.html': legal('entrega-e-trocas'), 'privacidade.html': legal('privacidade'), 'termos.html': legal('termos') }) };
