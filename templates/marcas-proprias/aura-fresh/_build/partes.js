// Peças de HTML comuns aos três modelos (kit de componentes).
const { empresa: E, produto: P, kits, ativos, faq, brl } = require('./dados');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const zapLink = (txt = 'Olá! Quero saber mais sobre o AURA Fresh.') => `https://wa.me/${E.whatsapp}?text=${encodeURIComponent(txt)}`;
const enderecoQ = encodeURIComponent(E.enderecoLinha);

// ---------- ícones próprios (traço arredondado, cantos suaves) ----------
const ic = {
  zap: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.5A12.4 12.4 0 0 0 5.3 22.2L3.6 28.4l6.4-1.7A12.4 12.4 0 1 0 16 3.5Zm0 22.6a10.2 10.2 0 0 1-5.2-1.4l-.4-.2-3.8 1 1-3.7-.2-.4A10.2 10.2 0 1 1 16 26.1Zm5.6-7.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.4 8.4 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.6 3.6 0 0 0-1.1 2.6 6.2 6.2 0 0 0 1.3 3.3 14.2 14.2 0 0 0 5.4 4.8c2 .9 2.8.9 3.8.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.5Z"/></svg>',
  seta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>',
  fecha: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  pino: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C7.5 15.5 5.5 12.5 5.5 9.5a6.5 6.5 0 0 1 13 0c0 3-2 6-6.5 11.5Z"/><circle cx="12" cy="9.5" r="2.2"/></svg>',
  insta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  face: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.6v3h2.6V21h3.2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.9 8.8H3.8V20h3.1V8.8ZM5.3 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-5-4.3-5a3.7 3.7 0 0 0-3.3 1.8V8.8H9.6V20h3.1v-5.6c0-1.5.4-2.9 2.2-2.9s1.9 1.6 1.9 3V20h3.1v-6.4Z"/></svg>',
  // folha de hortelã desenhada para a marca (sem biblioteca)
  folha: '<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="#c4d997" d="M6 34C5 20 14 7 34 6c1 18-10 29-28 28Z"/><path d="M8 32 28 12M14 26l-1-7M19 21l6 1M22 18l-1-6" stroke="#2b462b" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
  // pote visto de frente, para o aviso de cookies
  pote: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="6" width="26" height="11" rx="3" fill="#c4d997"/><rect x="8" y="17.5" width="24" height="17" rx="3" fill="#c4d997" opacity=".55"/><path d="M12 25h16M12 29h10" stroke="#16231a" stroke-width="2" stroke-linecap="round"/></svg>',
};

// ---------- <head> ----------
function head({ titulo, desc, url = '', css = [], extra = '', img = 'assets/img/', raiz = '' }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#16231a">
<meta name="aura-img" content="${img}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AURA Fresh">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${raiz}assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
${url ? `<link rel="canonical" href="${url}">` : ''}
<link rel="icon" type="image/png" href="${raiz}assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..600&family=Inter+Tight:wght@500..900&family=Gochi+Hand&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${raiz}assets/css/kit.css">
${css.map(c => `<link rel="stylesheet" href="${raiz}assets/css/${c}">`).join('\n')}
${extra}`;
}

// dados que os scripts do navegador leem
function dadosJs(raiz = '') {
  const rot = {
    linha: P.linha, sub: P.sub, tipo: P.tipo, aroma: P.aroma, sabor: P.sabor, peso: P.peso, porcoes: P.porcoes, porcao: P.porcao,
    uso: P.uso, composicao: P.composicao, advertencias: P.advertencias, razao: E.razao, cnpj: E.cnpj, email: E.email,
  };
  const at = ativos.map(a => ({ ...a, imgSrc: raiz + 'assets/img/' + a.img }));
  return `<script>window.AURA_KITS=${JSON.stringify(kits)};window.AURA_ATIVOS=${JSON.stringify(at)};window.AURA_ROTULO=${JSON.stringify(rot)};</script>`;
}

// ---------- botão flutuante de WhatsApp ----------
const zap = (txt) => `<a class="zap" href="${zapLink(txt)}" target="_blank" rel="noopener" aria-label="Falar com a AURA Fresh no WhatsApp">${ic.zap}<span>Fale com a gente</span></a>`;

// ---------- aviso de cookies ----------
const cookies = (raiz = '') => `<section class="ck" data-ck hidden role="dialog" aria-modal="false" aria-labelledby="ck-t" aria-describedby="ck-d">
  <div class="ck-cab">${ic.pote}<p class="ck-apoio">Cookies e privacidade</p></div>
  <h2 id="ck-t">Uma dose de transparência</h2>
  <p id="ck-d" class="ck-txt">Usamos cookies necessários para o site e o carrinho funcionarem. Estatística e marketing só entram com o seu sim, e você pode mudar de ideia a qualquer momento. Detalhes na <a href="${raiz}privacidade.html">Política de Privacidade</a>.</p>
  <div class="ck-opcoes" hidden>
    <label class="ck-op"><b>Necessários</b><small>Carrinho, segurança e suas escolhas de cookies.</small><input class="chave" type="checkbox" checked disabled></label>
    <label class="ck-op"><b>Estatística</b><small>Contagem anônima de visitas para melhorar as páginas.</small><input class="chave" type="checkbox" name="ck-est"></label>
    <label class="ck-op"><b>Marketing</b><small>Anúncios da AURA Fresh em outras redes.</small><input class="chave" type="checkbox" name="ck-mkt"></label>
  </div>
  <div class="ck-btns"><button type="button" class="ck-sim" data-ck-sim>Aceitar todos</button><button type="button" class="ck-nao" data-ck-nao>Só os necessários</button><button type="button" class="ck-mais" data-ck-mais>Escolher quais cookies</button></div>
</section>`;

// ---------- formulário de contato (LGPD) ----------
function form({ id = 'contato', assunto = true, raiz = '' } = {}) {
  return `<form class="form" data-lead data-politica="privacidade-v1-2026-11" novalidate aria-describedby="${id}-nota">
  <div class="campo"><label for="${id}-nome">Seu nome</label><input id="${id}-nome" name="nome" autocomplete="name" required><span class="msg-erro" aria-live="polite"></span></div>
  <div class="campo"><label for="${id}-email">E-mail</label><input id="${id}-email" name="email" type="email" autocomplete="email" required><span class="msg-erro" aria-live="polite"></span></div>
  <div class="campo"><label for="${id}-tel">WhatsApp (opcional)</label><input id="${id}-tel" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel"></div>
  ${assunto ? `<div class="campo"><label for="${id}-assunto">Assunto</label><select id="${id}-assunto" name="assunto"><option>Dúvida sobre o produto</option><option>Meu pedido</option><option>Troca ou devolução</option><option>Parcerias e revenda</option><option>Imprensa</option></select></div>` : ''}
  <div class="campo todo"><label for="${id}-msg">Mensagem</label><textarea id="${id}-msg" name="mensagem" required></textarea><span class="msg-erro" aria-live="polite"></span></div>
  <label class="consent"><input type="checkbox" name="aceite" required><span>Li a <a href="${raiz}privacidade.html">Política de Privacidade</a> e autorizo a AURA Fresh a usar meus dados para responder a este contato. <span class="msg-erro" aria-live="polite"></span></span></label>
  <label class="consent"><input type="checkbox" name="marketing"><span>Quero receber novidades e ofertas por e-mail e WhatsApp. Posso cancelar quando quiser.</span></label>
  <p class="form-nota" id="${id}-nota">Seus dados ficam guardados só pelo tempo necessário para o atendimento. Para acessar, corrigir ou apagar, escreva para ${E.email}.</p>
  <button class="btn" type="submit">Enviar mensagem ${ic.seta}</button>
  <p class="form-ok" tabindex="-1" role="status">Recebemos sua mensagem. A equipe responde em até 1 dia útil, no e-mail ou WhatsApp que você deixou.</p>
</form>`;
}

// ---------- bloco de produto com os kits ----------
function blocoKits({ img = 'pote', raiz = '' } = {}) {
  const fig = n => img === 'pote' ? `<img data-pote="${n}" alt="${n === 1 ? 'Um pote' : n + ' potes'} de AURA Fresh" width="640" height="520">`
    : `<img src="${raiz}assets/img/${n === 1 ? 'pote-pedra' : n === 2 ? 'pote-claro' : 'pote-splash'}.webp" alt="${n === 1 ? 'Um pote' : n + ' potes'} de AURA Fresh" width="640" height="520" loading="lazy">`;
  return `<div class="kits">
${kits.map(k => `  <article class="kit${k.potes === 2 ? ' destaque' : ''}">
    ${k.selo ? `<span class="kit-selo">${k.selo}</span>` : ''}
    <div class="kit-img">${fig(k.potes)}</div>
    <div><h3>${k.titulo}</h3><p class="kit-inclui">${k.doses} doses para ${k.dias} dias. ${k.potes} ${k.potes > 1 ? 'potes' : 'pote'} de ${P.peso} com colher dosadora.</p></div>
    <p class="kit-preco"><b>${k.totalTxt}</b><span>ou ${k.parcelas}x de ${k.parcelaTxt} no cartão</span><span><em>${k.porDia} por dia</em>${k.potes > 1 ? `, ${k.porPoteTxt} cada pote` : ''}</span></p>
    <a class="btn${k.potes === 2 ? '' : ' btn-contorno'}" href="${k.url}" target="_blank" rel="noopener">Comprar ${k.titulo.toLowerCase()} ${ic.seta}</a>
    <p class="kit-extra">Frete grátis para todo o Brasil</p>
  </article>`).join('\n')}
</div>
<div class="condicoes">
  <div><b>O que vem no pote</b>${P.peso} de pó sabor ${P.sabor.toLowerCase()}, ${P.porcoes} doses e colher dosadora.</div>
  <div><b>Pagamento</b>Pix, boleto ou cartão em até 12x. Valores com juros do cartão já na parcela.</div>
  <div><b>Frete e prazo</b>Grátis para todo o Brasil. Prazo calculado pelo CEP no checkout. <a href="${raiz}entrega-e-trocas.html">Política de entrega</a>.</div>
  <div><b>Arrependimento</b>7 dias pelo CDC e garantia de satisfação de 14 dias. <a href="${raiz}entrega-e-trocas.html#devolucao">Como devolver</a>.</div>
</div>`;
}

// ---------- perguntas frequentes ----------
const blocoFaq = (lista = faq) => `<div class="faq">
${lista.map(f => `  <details${f.revisar ? ' data-revisar' : ''}><summary>${esc(f.q)}<i aria-hidden="true"></i></summary><p class="resp">${esc(f.a)}</p></details>`).join('\n')}
</div>`;

// ---------- modais ----------
const modalAtivo = () => `<div class="modal" data-modal="ativo" hidden role="dialog" aria-modal="true" aria-labelledby="ativo-nome">
  <div class="modal-caixa">
    <button class="modal-fecha" type="button" aria-label="Fechar">${ic.fecha}</button>
    <div class="ativo-grid">
      <div class="ativo-arte"><img data-a="img" src="" alt=""><span class="ativo-qtd" data-a="qtd"></span></div>
      <div class="ativo-txt">
        <p class="apoio">Ativo da fórmula, por dose</p>
        <h2 id="ativo-nome" data-a="nome"></h2>
        <p class="tec" data-a="tec"></p>
        <p class="frase" data-a="frase"></p>
        <p data-a="texto"></p>
        <p data-a="revisar" data-revisar></p>
        <ul class="ativo-notas" data-a="notas"></ul>
        <div class="ativo-nav"><button type="button" data-a="ant"></button><button type="button" data-a="prox"></button></div>
      </div>
    </div>
  </div>
</div>`;

const modalPote = (raiz = '') => `<div class="modal" data-modal="pote" hidden role="dialog" aria-modal="true" aria-labelledby="pote-nome">
  <div class="modal-caixa" style="--m-cor:#1f3325">
    <button class="modal-fecha" type="button" aria-label="Fechar">${ic.fecha}</button>
    <div class="pote-grid">
      <div class="pote-palco"><canvas class="modal-3d" aria-label="Pote de AURA Fresh em 3D. Arraste para girar."></canvas><img class="pote-sem3d" src="${raiz}assets/img/pote-splash.webp" alt="Pote de AURA Fresh"><p class="pote-dica">arraste para girar</p></div>
      <div class="ativo-txt">
        <p class="apoio">${P.linha}, ${P.sub}</p>
        <h2 id="pote-nome">O pote de perto</h2>
        <p class="frase">${P.tipo}, sabor ${P.sabor.toLowerCase()}.</p>
        <p>${P.peso}, ${P.porcoes} doses de ${P.porcao}. ${P.composicao.map(c => `${c.qtd} de ${c.origem}`).join(', ')} em cada dose.</p>
        <ul class="ativo-notas"><li>${P.porcoes} doses</li><li>${P.peso}</li><li>Uso oral</li></ul>
        <div class="ativo-nav"><a class="btn btn-lima" href="#comprar">Ver preços</a><button type="button" data-ativo="clorofila">Ver os ativos</button></div>
      </div>
    </div>
  </div>
</div>`;

// ---------- rodapé legal com mapa ----------
function rodape({ raiz = '', mapa = 'mapa-floresta.webp', frase = 'Suplemento alimentar em pó com clorofila, salsa e hortelã. Uma dose por dia, de dentro para fora.' } = {}) {
  return `<footer class="rodape" id="rodape">
  <div class="rodape-topo">
    <div class="rodape-marca"><img src="${raiz}assets/img/logo.png" alt="AURA Fresh" width="170" height="73" loading="lazy"><p>${frase}</p>
      <div class="redes"><a href="${E.instagram}" target="_blank" rel="noopener" aria-label="Instagram da AURA Fresh">${ic.insta}</a><a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook da AURA Fresh">${ic.face}</a><a href="${E.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn da AURA Fresh">${ic.linkedin}</a></div>
    </div>
    <div class="rodape-col"><h3>Atendimento</h3><ul>
      <li><a href="${zapLink()}" target="_blank" rel="noopener">WhatsApp ${E.whatsappTexto}</a></li>
      <li><a href="mailto:${E.email}">${E.email}</a></li>
      <li><a href="tel:${E.telefoneLink}">Telefone ${E.telefone}</a></li>
      <li>${E.horario}</li>
    </ul></div>
    <div class="rodape-col"><h3>Compra segura</h3><ul>
      <li><a href="${raiz}entrega-e-trocas.html">Entrega</a></li>
      <li><a href="${raiz}entrega-e-trocas.html#devolucao">Trocas e devoluções</a></li>
      <li><a href="${raiz}entrega-e-trocas.html#arrependimento">Direito de arrependimento</a></li>
      <li><a href="${raiz}index.html#comprar">Preços e kits</a></li>
    </ul></div>
    <div class="rodape-col"><h3>Transparência</h3><ul>
      <li><a href="${raiz}termos.html">Termos de uso</a></li>
      <li><a href="${raiz}privacidade.html">Política de privacidade</a></li>
      <li><a href="${raiz}privacidade.html#direitos">Seus dados (LGPD)</a></li>
      <li><a href="${raiz}index.html#rotulo">Informações do rótulo</a></li>
    </ul></div>
  </div>
  <div class="rodape-mapa">
    <div class="map-box">
      <img src="${raiz}assets/img/${mapa}" alt="Mapa do Park Comercial de Indaiatuba, em São Paulo, com a localização da AURA Fresh" loading="lazy" width="1240" height="760">
      <span class="pin" aria-hidden="true"><b>AURA Fresh</b></span>
      <div class="map-info"><b>AURA Fresh</b><span>${E.endereco}, ${E.bairro}, ${E.cidade}, CEP ${E.cep}</span><span>${E.horario}. Atendimento online, sem loja aberta ao público.</span>
        <div class="mbtns" data-iguais><a href="https://www.openstreetmap.org/search?query=${enderecoQ}" target="_blank" rel="noopener">${ic.pino}Abrir no Maps</a><a href="https://www.google.com/maps/dir/?api=1&amp;destination=${enderecoQ}" target="_blank" rel="noopener">${ic.seta}Como chegar</a></div>
      </div>
      <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
    </div>
    <div class="onde">
      <h2>Onde atendemos</h2>
      <p>Venda online com frete grátis para todo o Brasil, saindo de Indaiatuba, SP. Prazo por região no checkout.</p>
      <ul class="onde-lista"><li>Sudeste</li><li>Sul</li><li>Centro-Oeste</li><li>Nordeste</li><li>Norte</li><li>Capitais e interior</li></ul>
    </div>
  </div>
  <div class="legal">
    <div><p><b>${E.razao}</b>, CNPJ ${E.cnpj}.</p><p>${E.enderecoLinha}.</p><p>${E.anvisa}</p></div>
    <div><p>Este produto não é um medicamento e não substitui uma alimentação equilibrada nem o acompanhamento de um profissional de saúde. Não se destina a diagnosticar, tratar ou curar doenças.</p><p>Resultados variam de pessoa para pessoa.</p></div>
  </div>
  <div class="rodape-base">
    <p>© <span data-ano>2026</span> AURA Fresh. Todos os direitos reservados. <button type="button" data-ck-abre>Preferências de cookies</button></p>
    <nav aria-label="Políticas"><a href="${raiz}termos.html">Termos de uso</a><a href="${raiz}privacidade.html">Privacidade</a><a href="${raiz}entrega-e-trocas.html">Entrega e trocas</a></nav>
  </div>
</footer>`;
}

// ---------- páginas legais ----------
const legais = {
  'entrega-e-trocas': {
    titulo: 'Entrega, trocas e devoluções', apoio: 'Compra segura',
    lead: 'Como o seu pedido chega, o que fazer se algo der errado e como desistir da compra. Tudo pelo Código de Defesa do Consumidor.',
    corpo: `<nav class="indice" aria-label="Nesta página"><a href="#entrega">Entrega</a><a href="#devolucao">Trocas e devoluções</a><a href="#arrependimento">Direito de arrependimento</a><a href="#garantia">Garantia de satisfação</a></nav>
<h2 id="entrega">Entrega</h2>
<p>Enviamos para todo o Brasil com frete grátis a partir de Indaiatuba, SP. O prazo aparece no checkout depois que você informa o CEP e começa a contar após a confirmação do pagamento.</p>
<p>Assim que o pedido sai, você recebe o código de rastreio por e-mail e WhatsApp. Se o prazo passar e o pedido não chegar, fale com a gente: abrimos a ocorrência com a transportadora e reenviamos quando for o caso.</p>
<p>Prazos médios por região e transportadoras: [preencher com o cliente].</p>
<h2 id="devolucao">Trocas e devoluções</h2>
<p>Se o pote chegar violado, amassado ou diferente do pedido, escreva em até 7 dias corridos do recebimento para ${E.email} com o número do pedido e uma foto. Trocamos sem custo para você.</p>
<p>Por ser um alimento, não aceitamos devolução de pote aberto, exceto por defeito de fabricação ou nos casos da garantia de satisfação abaixo.</p>
<h2 id="arrependimento">Direito de arrependimento</h2>
<p>Compras feitas pela internet podem ser canceladas em até 7 dias corridos do recebimento, sem precisar explicar o motivo (artigo 49 do Código de Defesa do Consumidor). O valor pago, inclusive o frete, é devolvido pelo mesmo meio de pagamento.</p>
<p>Para pedir, escreva para ${E.email} ou chame no WhatsApp com o número do pedido. Enviamos a autorização de postagem sem custo.</p>
<h2 id="garantia">Garantia de satisfação</h2>
<p data-revisar>Além do prazo legal, a AURA Fresh oferece 14 dias de garantia de satisfação a partir do recebimento: se não gostar, devolvemos 100% do valor do produto.</p>
<div class="aviso">Política válida para compras feitas no site oficial. Texto base para a revisão jurídica do cliente antes da publicação.</div>`,
  },
  privacidade: {
    titulo: 'Política de privacidade', apoio: 'LGPD',
    lead: 'Quais dados a AURA Fresh coleta, para quê, por quanto tempo e como você exerce os seus direitos pela Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    corpo: `<nav class="indice" aria-label="Nesta página"><a href="#quem">Quem cuida dos dados</a><a href="#quais">Quais dados e para quê</a><a href="#cookies">Cookies</a><a href="#compartilha">Com quem compartilhamos</a><a href="#direitos">Seus direitos</a></nav>
<h2 id="quem">Quem cuida dos seus dados</h2>
<p>A controladora é a ${E.razao}, CNPJ ${E.cnpj}, ${E.enderecoLinha}. Encarregado de dados (DPO): [preencher nome], contato ${E.email}.</p>
<h2 id="quais">Quais dados e para quê</h2>
<ul>
<li>Formulário de contato: nome, e-mail, WhatsApp e mensagem, para responder você (base legal: consentimento).</li>
<li>Compra: nome, CPF, endereço, telefone e e-mail, para emitir nota fiscal, entregar e dar suporte (base legal: execução de contrato e obrigação legal).</li>
<li>Novidades e ofertas: e-mail e WhatsApp, só se você marcar a opção (base legal: consentimento, que pode ser retirado a qualquer momento).</li>
<li>Navegação: cookies necessários e, com o seu sim, de estatística e marketing.</li>
</ul>
<h2 id="cookies">Cookies</h2>
<p>Os necessários mantêm o carrinho e as suas escolhas. Os de estatística contam visitas de forma agregada. Os de marketing mostram anúncios da AURA Fresh em outras redes. Você muda as preferências no link "Preferências de cookies" no rodapé de qualquer página.</p>
<h2 id="compartilha">Com quem compartilhamos</h2>
<p>Plataforma de pagamento e checkout, transportadoras, emissor de nota fiscal e ferramentas de atendimento, só no necessário para cada finalidade. Não vendemos dados.</p>
<p>Guardamos os dados de compra pelo prazo exigido pela legislação fiscal e os de contato por até 2 anos depois da última interação.</p>
<h2 id="direitos">Seus direitos</h2>
<p>Você pode pedir a qualquer momento: confirmação de que tratamos seus dados, acesso, correção, anonimização, portabilidade, exclusão dos dados tratados com consentimento e informação sobre com quem compartilhamos. Escreva para ${E.email}. Respondemos em até 15 dias.</p>
<div class="aviso">Texto base para a revisão jurídica do cliente antes da publicação. Versão privacidade-v1-2026-11.</div>`,
  },
  termos: {
    titulo: 'Termos de uso', apoio: 'Transparência',
    lead: 'Regras de uso do site e das compras da AURA Fresh.',
    corpo: `<h2>Sobre o site</h2>
<p>Este site é mantido pela ${E.razao}, CNPJ ${E.cnpj}. Ao navegar e comprar, você concorda com estes termos e com a <a href="privacidade.html">Política de Privacidade</a>.</p>
<h2>Sobre o produto</h2>
<p>O AURA Fresh é um suplemento alimentar. As informações do site têm caráter informativo e não substituem orientação de médico, nutricionista ou outro profissional de saúde. Leia sempre o rótulo antes de consumir.</p>
<p>${P.contraindicacoes}</p>
<h2>Preços e ofertas</h2>
<p>Preços e condições valem enquanto estiverem publicados no site e podem mudar sem aviso, sem afetar pedidos já confirmados. Em caso de erro evidente de preço, avisamos e você escolhe entre pagar o valor correto ou cancelar com reembolso integral.</p>
<h2>Depoimentos</h2>
<p data-revisar>Os relatos publicados são de clientes reais que autorizaram o uso por escrito. Eles contam experiências individuais e não garantem o mesmo resultado para outras pessoas.</p>
<h2>Propriedade intelectual</h2>
<p>Marca, logo, textos, fotos e o desenho da embalagem pertencem à AURA Fresh e não podem ser usados sem autorização.</p>
<h2>Contato</h2>
<p>${E.email}, WhatsApp ${E.whatsappTexto} e telefone ${E.telefone}, ${E.horario.toLowerCase()}.</p>
<div class="aviso">Texto base para a revisão jurídica do cliente antes da publicação.</div>`,
  },
};

module.exports = { esc, ic, head, dadosJs, zap, zapLink, cookies, form, blocoKits, blocoFaq, modalAtivo, modalPote, rodape, legais, brl };
