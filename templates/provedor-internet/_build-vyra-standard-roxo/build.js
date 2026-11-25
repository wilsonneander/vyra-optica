// Gera o Vyra Standard Roxo em templates/provedor-internet/standard/vyra-standard-roxo/
// Uso: node templates/provedor-internet/_build-vyra-standard-roxo/build.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('./content');
const { logo, icon, socialIcon, esc } = require('../_build/helpers');
const { streamLogos } = require('../_build/vyra-standard');
const T = require('../../_comum/tema-pilula');

const OUT = path.join(__dirname, '..', 'standard', 'vyra-standard-roxo');
const IMG = 'assets/img/';
const E = C.empresa;
const CHAVE_TEMA = 'vyra-roxo-tema';
const ROSA = '#CB2166';
const ver = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const marcaLogo = (cls = 'logo') => logo(cls, ROSA);
const seta = icon('arrow', 'ico seta');
const ESTRELA = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L10 14.6l-5.1 2.8 1.1-5.7L1.8 7.8l5.7-.7z"/></svg>';
const estrelas = `<div class="estrelas" role="img" aria-label="5 de 5 estrelas">${ESTRELA.repeat(5)}</div>`;
const WA_MSG = encodeURIComponent('Olá! Vim pelo site da Vyra e quero saber mais sobre os planos.');

// ---------- topo: faixa + menu (mesma navegação do Vyra Standard) ----------
function topo(pg) {
  return `<a class="sr" href="#conteudo">Pular para o conteúdo</a>
<div class="faixa"><div class="container">
  <span class="faixa-txt">Fibra óptica em <b>${C.cities.now.join(', ')}</b> e região. Suporte técnico 24h</span>
  <span class="lado"><span>WhatsApp <b>${C.contact.whatsapp}</b></span><a href="assine.html#visita">Agendar visita técnica</a></span>
</div></div>
<header class="topo">
  <div class="container">
    <a class="marca" href="index.html" aria-label="Vyra, página inicial">${marcaLogo()}</a>
    <nav class="nav" id="nav" aria-label="Principal">
      ${C.menu.map(n => `<a href="${n.href}"${n.id === pg ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
      <div class="acoes">
        <a class="btn btn-wa" href="${C.contact.whatsappLink}?text=${WA_MSG}" target="_blank" rel="noopener">${socialIcon('whatsapp')}WhatsApp</a>
        <a class="btn btn-rosa" href="assine.html"${pg === 'assine' ? ' aria-current="page"' : ''}>Assine já</a>
      </div>
      <div class="tema-menu">${T.pilula('deitada', 'claro')}</div>
    </nav>
    <button class="menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav" data-fecha='${icon('close')}'>${icon('menu')}</button>
  </div>
</header>
${T.pilula('tema-lado', 'claro')}`;
}

// ---------- rodapé com o mapa padrão (OpenStreetMap) ----------
function rodape() {
  return `<footer class="rodape">
  <div class="container">
    <div class="onde">
      <div class="map-box rv">
        <img src="${IMG}mapa_marialva.jpg" alt="Mapa do centro de Marialva, Paraná, com a loja da Vyra" loading="lazy">
        <span class="pin" aria-hidden="true"><b>Vyra Fibra</b></span>
        <div class="map-info"><b>Vyra Fibra</b><span>${E.endereco}, ${E.cidade}</span><span>${C.contact.hours[0][1]}</span>
          <div class="mbtns"><a href="${E.mapa}" target="_blank" rel="noopener">${icon('pin')}Abrir no Maps</a><a href="${E.rota}" target="_blank" rel="noopener">${icon('arrow')}Como chegar</a></div></div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="rv" data-d="1">
        <h2>Onde atendemos</h2>
        <p>Fibra óptica em Marialva e região, chegando a novas cidades do interior. Confira se a Vyra já passa no seu endereço.</p>
        <div class="cidades">${C.cities.now.map(x => `<span class="on">${x}<small>atendendo</small></span>`).join('')}${C.cities.soon.map(x => `<span>${x}<small>em breve</small></span>`).join('')}</div>
      </div>
    </div>
    <div class="rod-marca">${marcaLogo()}<b>${esc(C.brand.slogan)}</b></div>
    <div class="cols">
      <div><h3>Navegação</h3><ul>${C.menu.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="assine.html">Assine já</a></li></ul></div>
      <div><h3>Planos</h3><ul>${C.combos.map(p => `<li><a href="assine.html#${p.id}">${p.name}, ${p.speed} ${p.unit}</a></li>`).join('')}<li><a href="empresas.html">Vyra Empresas</a></li><li><a href="assine.html#visita">Agendar visita técnica</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul><li>WhatsApp: ${C.contact.whatsapp}</li><li>Telefone: ${C.contact.phone}</li><li>${C.contact.email}</li><li>${C.contact.hours[1][0]}: ${C.contact.hours[1][1]}</li></ul></div>
      <div><h3>Siga a Vyra</h3>${social()}
        <ul style="margin-top:18px"><li><button type="button" class="link" data-doc="servico">Política de atendimento</button></li><li><button type="button" class="link" data-doc="uso">Termos de uso</button></li><li><button type="button" class="link" data-doc="privacidade">Política de privacidade</button></li><li><button type="button" class="link" data-cookies>Preferências de cookies</button></li></ul></div>
    </div>
    <div class="base"><span>© <span id="ano">2026</span> ${E.nome}. Todos os direitos reservados.</span><span>${E.razao}, CNPJ ${E.cnpj}. ${E.anatel}. Dados de demonstração.</span></div>
  </div>
</footer>
<a class="whats-flutua" href="${C.contact.whatsappLink}?text=${WA_MSG}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${socialIcon('whatsapp')}<span>WhatsApp</span></a>`;
}

function social() {
  const s = C.contact.social;
  return `<div class="social">${[['instagram', 'Instagram'], ['facebook', 'Facebook'], ['linkedin', 'LinkedIn'], ['whatsapp', 'WhatsApp']].map(([k, l]) => `<a href="${s[k]}" target="_blank" rel="noopener" aria-label="${l} da Vyra">${socialIcon(k)}</a>`).join('')}</div>`;
}

// ---------- janelas legais e cookies ----------
const legal = {
  servico: ['Política de atendimento', `
    <h3>Agendamento</h3><p>A instalação e a visita técnica são agendadas pelo site, WhatsApp ou telefone, de segunda a sábado, nos horários de ${C.horarios.join(', ')}. O horário só vale depois da nossa confirmação pelo WhatsApp.</p>
    <h3>Atraso</h3><p>O técnico espera 15 minutos no endereço. Se o atraso for nosso e passar de 30 minutos, avisamos antes e você pode remarcar com prioridade, sem custo.</p>
    <h3>Cancelamento e remarcação da visita</h3><p>Sem custo até 2 horas antes do horário. Ausência sem aviso gera nova visita; a segunda ausência seguida tem taxa de R$ 30 (valor de exemplo), cobrada na fatura.</p>
    <div class="destaque"><h3>Instalação rural, mudança de endereço e fidelidade</h3><p>Chácaras e sítios passam por um estudo de viabilidade antes do agendamento: o prazo e o custo do projeto são informados por escrito antes de qualquer cobrança. Na mudança de endereço, a cobertura do novo local é conferida antes da retirada. Planos com fidelidade mostram o prazo e a multa proporcional no contrato, antes da assinatura.</p></div>
    <h3>Pagamento</h3><p>${C.pagamento.map(p => `${p[0]}: ${p[1]}`).join(' ')}</p>
    <h3>Cancelamento do plano</h3><p>Pode ser pedido a qualquer momento pelos canais de atendimento, com número de protocolo. Os equipamentos em comodato voltam para a Vyra, retirados pelo técnico sem custo.</p>
    <h3>Garantia do serviço</h3><p>A velocidade é medida com você na instalação. Se a média ficar abaixo do que a Anatel exige para o seu plano, o técnico volta sem custo. Visita causada por falha da rede Vyra nunca é cobrada. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${E.nome} (${E.razao}, CNPJ ${E.cnpj}) e recebe pedidos de assinatura, agendamento e contato. Ao usar o site, você concorda com estes termos.</p>
    <h3>Ofertas e preços</h3><p>Os valores do site são de referência e podem mudar sem aviso. Vale o que estiver no contrato assinado. Streamings dependem das regras de cada serviço; as marcas pertencem aos seus donos.</p>
    <h3>Pedidos</h3><p>O formulário envia o pedido pelo WhatsApp. A assinatura e o horário só valem depois da nossa confirmação e da checagem de cobertura.</p>
    <h3>Conteúdo</h3><p>Textos, marca e imagens pertencem à Vyra ou a seus autores. As fotos de pessoas são ilustrativas.</p>
    <h3>Links externos</h3><p>Mapas, redes sociais e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${E.razao} (CNPJ ${E.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, CPF, telefone, e-mail, endereço de instalação, plano, serviço, técnico, data e horário escolhidos e a mensagem que você escreve.</p>
    <h3>Para que usamos</h3><p>Conferir a cobertura, montar o contrato, agendar e confirmar a visita e responder ao seu contato. Ofertas só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta), e a consulta de CPF segue as regras de proteção ao crédito.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem contratação são apagados em 6 meses. Dados de clientes ficam enquanto houver contrato e pelo prazo legal depois dele.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados e revogar consentimentos, pelo e-mail ${C.contact.email}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador só a sua escolha sobre cookies e o tema claro ou escuro. Não usamos cookies de publicidade. Medição de visitas, apenas se você aceitar todos no aviso de cookies.</p>`],
};
const janelas = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="fecha" data-fecha aria-label="Fechar">${icon('close')}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Saiba mais</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-roxo" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>`;

// ---------- blocos ----------
function vitrine() {
  const v = C.vitrine;
  return `<section class="vitrine" aria-roledescription="carrossel" aria-label="Ofertas Vyra" tabindex="-1">
  <div class="slides">${v.map((s, i) => `
    <div class="slide${i === 0 ? ' on' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${v.length}">
      <div class="foto"><img src="${IMG}${s.img}" alt="${esc(s.alt)}" style="object-position:${s.pos}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}></div>
      <div class="painel" aria-hidden="true"></div>
      <div class="container"><div class="copia">
        <span class="etiqueta">${s.tag}</span>
        ${i === 0 ? `<h1>${s.title}</h1>` : `<h2>${s.title}</h2>`}
        <p>${s.text}</p>
        <div class="preco"><small>a partir de R$</small><b>${s.price}</b><small>/mês</small></div>
        <div class="botoes"><a class="btn btn-rosa" href="${s.cta}">Quero esse ${seta}</a><a class="btn btn-vazado" href="#planos">Ver planos</a></div>
      </div></div>
    </div>`).join('')}
  </div>
  <div class="vit-ctrl"><div class="container">
    <div class="pontos">${v.map((s, i) => `<button type="button" aria-label="Ir para a oferta ${i + 1}"></button>`).join('')}</div>
    <div class="setas"><button type="button" class="ant" aria-label="Oferta anterior">${icon('arrow')}</button><button type="button" class="prox" aria-label="Próxima oferta">${icon('arrow')}</button></div>
  </div></div>
</section>`;
}

function pcab(img, pos, alt, titulo, texto, trilha) {
  return `<section class="pcab">
  <div class="foto"><img src="${IMG}${img}" alt="${esc(alt)}" style="object-position:${pos}" fetchpriority="high"></div>
  <div class="container">
    <div class="trilha"><a href="index.html">Início</a> / ${trilha}</div>
    <h1>${titulo}</h1><p>${texto}</p>
  </div>
</section>`;
}

function planoCard(p, emp) {
  const valor = p.price ? `<div class="valor"><small>R$</small><b>${p.price}</b><small>/mês</small></div>` : `<div class="valor"><span class="cons">Sob consulta</span></div>`;
  const href = emp ? 'contato.html' : `assine.html#${p.id}`;
  return `<article class="plano rv${p.featured ? ' destaque' : ''}">
    ${p.featured ? `<span class="aba-topo">${emp ? 'Mais contratado' : 'Mais vendido'}</span>` : ''}
    <span class="nome">${p.name}</span>
    <div class="vel">${p.speed}<small>${p.unit}</small></div>
    <p class="frase">${p.tag}</p>
    ${p.streams ? `<div class="inclui"><b>Streaming incluso</b><div class="logos">${streamLogos(p.streams)}</div></div>` : ''}
    <ul>${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
    ${valor}
    <a class="btn ${p.featured ? 'btn-branco' : 'btn-roxo'}" href="${href}">${emp ? (p.price ? 'Contratar' : 'Pedir proposta') : 'Quero esse'}</a>
  </article>`;
}

function planos(modo = 'ambos') {
  const res = `<div class="planos">${C.combos.map(p => planoCard(p)).join('')}</div><p class="nota">Valores de exemplo. Streamings sujeitos às regras de cada serviço; as marcas pertencem aos seus donos.</p>`;
  const emp = `<div class="planos">${C.businessPlans.map(p => planoCard(p, true)).join('')}</div><p class="nota">Valores de exemplo. Planos empresariais com contrato e nota fiscal.</p>`;
  const tit = modo === 'emp' ? 'Planos <em>Vyra Empresas</em>' : 'Escolha a sua <em>velocidade.</em>';
  const sub = modo === 'emp' ? 'Conexão estável para quem não pode parar.' : 'Fibra até a sua casa, Wi-Fi 6 incluso e os streamings que você já usa.';
  const corpo = modo === 'ambos' ? `<div style="text-align:center"><div class="abas" role="tablist" aria-label="Tipo de plano">
      <button role="tab" aria-selected="true" aria-controls="aba-casa" id="t-casa">Para casa</button>
      <button role="tab" aria-selected="false" aria-controls="aba-emp" id="t-emp" tabindex="-1">Para empresas</button></div></div>
    <div class="painel-aba" id="aba-casa" role="tabpanel" aria-labelledby="t-casa">${res}</div>
    <div class="painel-aba" id="aba-emp" role="tabpanel" aria-labelledby="t-emp" hidden>${emp}</div>` : (modo === 'emp' ? emp : res);
  return `<section class="sec soft" id="planos"><div class="container">
    <div class="cab meio rv"><span class="apoio">Planos de internet fibra</span><h2>${tit}</h2><p>${sub}</p></div>
    ${corpo}
  </div></section>`;
}

function servicos(seg) {
  const lista = seg ? C.servicos.filter(s => seg.includes(s.seg)) : C.servicos;
  const segs = seg ? C.segmentos.filter(s => seg.includes(s.id)) : C.segmentos;
  const filtro = segs.length > 1 ? `<div class="filtros" data-filtro="lista-serv" role="group" aria-label="Filtrar serviços por segmento" style="--n:${segs.length + 1}">
      ${segs.map((s, i) => `<button type="button" data-v="${s.id}" aria-pressed="${i === 0}">${s.nome}</button>`).join('')}<button type="button" data-v="todas" aria-pressed="false">Todos</button></div>` : '';
  const nomeSeg = id => C.segmentos.find(s => s.id === id).nome;
  const primeiro = segs.length > 1 ? segs[0].id : null;
  return `<section class="sec" id="servicos"><div class="container">
    <div class="cab rv"><span class="apoio">Serviços</span><h2>Tudo o que a Vyra faz, <em>com prazo e preço.</em></h2><p>Escolha o segmento e veja o que cada serviço inclui, quanto tempo leva e quanto custa.</p></div>
    ${filtro}
    <div class="servicos" id="lista-serv">${lista.map((s, i) => `
      <article class="serv rv" data-cat="${s.seg}" data-d="${i % 3}"${primeiro && s.seg !== primeiro ? ' hidden' : ''}>
        <figure><img src="${IMG}${s.img}" alt="" loading="lazy"><span>${nomeSeg(s.seg)}</span></figure>
        <div class="corpo"><h3>${s.nome}</h3>
          <ul>${s.inclui.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul>
          <dl><div><dt>Prazo</dt><dd>${s.prazo}</dd></div><div><dt>Valor</dt><dd class="v">${s.valor}</dd></div></dl>
        </div>
      </article>`).join('')}
    </div>
    ${condicoes()}
  </div></section>`;
}

function condicoes() {
  return `<div class="condicoes">
      <div class="cond a rv"><h3>Condições de pagamento</h3><dl>${C.pagamento.map(p => `<div><dt>${p[0]}</dt><dd>${p[1]}</dd></div>`).join('')}</dl></div>
      <div class="cond b rv" data-d="1"><h3>Cancelamento e remarcação</h3><dl>${C.cancelamento.map(p => `<div><dt>${p[0]}</dt><dd>${p[1]}</dd></div>`).join('')}</dl>
        <button type="button" class="link" data-doc="servico">Ler a política de atendimento completa</button></div>
    </div>`;
}

function streaming() {
  return `<section class="sec"><div class="container lado-a-lado">
    <div class="midia rv"><div class="principal"><img src="${IMG}casal_tv.jpg" alt="Casal rindo no sofá enquanto assiste TV" loading="lazy"></div>
      <div class="menor"><img src="${IMG}jovem_selfie.jpg" alt="Jovem de fone fazendo selfie com o celular" style="object-position:50% 20%" loading="lazy"></div>
      <div class="selo"><b>4K</b><span>sem travar no<br>horário de pico</span></div></div>
    <div class="texto rv" data-d="1"><span class="apoio">Internet e streaming</span>
      <h2>A série na TV, o vídeo no celular, <em>tudo junto.</em></h2>
      <p>YouTube Premium em qualquer plano Vyra. No Família, escolha mais um streaming. No Ultra, leve todos na mesma conta da internet.</p>
      <div class="logos">${streamLogos(C.streamings)}</div>
      <a class="btn btn-roxo" href="#planos">Comparar planos ${seta}</a>
    </div>
  </div></section>`;
}

function momentos() {
  const f = [
    ['familia_tv_sala.jpg', 'Família assistindo TV junta na sala', 'Noite de filme', 'Todo mundo no sofá, sem a rodinha girando.'],
    ['jovens_sofa_fones.jpg', 'Dois jovens de fone, um no notebook e outra no celular', 'Cada um na sua tela', 'Aula, jogo e música ao mesmo tempo.'],
    ['mae_filha_tablet.jpg', 'Mãe e filha no sofá com o tablet', 'Desenho no tablet', 'Controle dos pais pelo app.'],
    ['equipe_vibra.jpg', 'Equipe comemorando na frente do notebook', 'No trabalho', 'Videochamada estável e upload rápido para a equipe toda.'],
  ];
  return `<section class="sec"><div class="container">
    <div class="cab rv"><span class="apoio">Para todos os momentos</span><h2>Gente conectada <em>de verdade.</em></h2></div>
    <div class="mosaico">${f.map((x, i) => `<div class="ft rv" data-d="${i}"><img src="${IMG}${x[0]}" alt="${esc(x[1])}" loading="lazy"><div><b>${x[2]}</b><span>${x[3]}</span></div></div>`).join('')}</div>
  </div></section>`;
}

function porque() {
  const it = [...C.benefits, { title: 'Wi-Fi 6 em todos os planos', text: 'Roteador moderno incluso, com sinal forte na casa toda.' }];
  return `<section class="sec soft"><div class="container lado-a-lado inv">
    <div class="midia rv"><div class="principal"><img src="${IMG}senhora_tablet.jpg" alt="Senhora sorrindo enquanto usa o tablet no sofá" loading="lazy"></div>
      <div class="menor"><img src="${IMG}jovem_fone_joinha.jpg" alt="Jovem de fone fazendo joinha" loading="lazy"></div>
      <div class="selo"><b>100%</b><span>fibra óptica<br>até a sua casa</span></div></div>
    <div class="texto rv" data-d="1"><span class="apoio">Por que a Vyra</span><h2>Internet boa para <em>todas as idades.</em></h2>
      <ul class="lista-check">${it.map(b => `<li><span class="ck">${icon('check')}</span><b>${b.title}</b><span>${b.text}</span></li>`).join('')}</ul>
    </div>
  </div></section>`;
}

function equipeMini() {
  return `<section class="sec soft"><div class="container">
    <div class="cab rv"><span class="apoio">Nossa equipe</span><h2>Quem atende <em>é daqui.</em></h2><p>Técnicos, atendentes e consultores da região, que conhecem cada bairro.</p></div>
    <div class="equipe-mini">${C.equipe.map((p, i) => `<a class="rv" data-d="${i % 3}" href="equipe.html"><img src="${IMG}${p.foto}" alt="${p.nome}, ${p.funcao.toLowerCase()}" style="object-position:${p.pos}" loading="lazy"><b>${p.nome}</b><span>${p.funcao}</span></a>`).join('')}</div>
    <div style="margin-top:30px"><a class="btn btn-linha" href="equipe.html">Conhecer a equipe ${seta}</a></div>
  </div></section>`;
}

function empBand() {
  return `<section class="chamada"><img src="${IMG}colegas_soquinho.jpg" alt="" loading="lazy" style="object-position:60% 30%">
  <div class="container">
    <span class="apoio" style="color:#FFC2DA">Vyra Empresas</span>
    <h2>Internet de empresa <em>que não para.</em></h2>
    <p>Link dedicado, IP fixo, SLA em contrato e uma consultora que conhece a sua operação.</p>
    <div class="nums"><div><b>99,9%</b><span>de disponibilidade (meta)</span></div><div><b>4h</b><span>SLA no link dedicado</span></div><div><b>24/7</b><span>monitoramento</span></div></div>
    <a class="btn btn-branco" href="empresas.html">Ver planos para empresas ${seta}</a>
  </div></section>`;
}

const iniciais = w => w.replace(/^(Dona|Seu) /, '').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
function depoimentos() {
  const top = C.reviews.slice(0, 3), resto = C.reviews.slice(3);
  const mini = r => `<figure><p>"${r.text}"</p><figcaption><b>${r.name}</b>, ${r.where}. ${r.plan}</figcaption></figure>`;
  return `<section class="sec"><div class="container">
    <div class="cab meio rv"><span class="apoio">Depoimentos</span><h2>Quem já é Vyra <em>recomenda.</em></h2><p>Relatos de exemplo, para trocar por avaliações reais de clientes.</p></div>
    <div class="depo">${top.map((r, i) => `<blockquote class="rv" data-d="${i}">${estrelas}<p>"${r.text}"</p><footer><span class="av">${iniciais(r.name)}</span><div><b>${r.name}</b><span>${r.where}, ${r.plan}</span></div></footer></blockquote>`).join('')}</div>
  </div>
  <div class="depo-mais" aria-label="Mais depoimentos"><div class="trilho">${resto.map(mini).join('')}<div aria-hidden="true" style="display:contents">${resto.map(mini).join('')}</div></div></div>
  </section>`;
}

function instagram() {
  const url = C.contact.social.instagram;
  return `<section class="sec soft"><div class="container">
    <div class="insta-cab rv">
      <div class="insta-perfil"><span class="av"><span>${marcaLogo()}</span></span><div><b>${E.instagram}</b><small>Dicas de Wi-Fi, bastidores e ofertas</small></div></div>
      <a class="btn btn-roxo" href="${url}" target="_blank" rel="noopener">${socialIcon('instagram')}Seguir no Instagram</a>
    </div>
    <div class="insta">${C.insta.map((p, i) => `<a class="rv" data-d="${i % 3}" href="${url}" target="_blank" rel="noopener" aria-label="Post do Instagram: ${esc(p.txt)}"><img src="${IMG}${p.img}" alt="${esc(p.alt)}" loading="lazy"><span>${p.txt}</span></a>`).join('')}</div>
  </div></section>`;
}

function faq(n) {
  const l = n ? C.faq.slice(0, n) : C.faq;
  return `<section class="sec"><div class="container faq-duas">
    <div class="faq-lado rv">
      <div class="cab" style="margin:0"><span class="apoio">FAQ</span><h2>Perguntas <em>frequentes.</em></h2><p>Não achou? Um técnico da região responde pelo WhatsApp.</p></div>
      <div class="principal"><img src="${IMG}mulher_ligacao.jpg" alt="Mulher sorrindo ao telefone no sofá" loading="lazy"></div>
      <div class="par"><a class="btn btn-roxo" href="${C.contact.whatsappLink}?text=${WA_MSG}" target="_blank" rel="noopener">${socialIcon('whatsapp')}Chamar no WhatsApp</a>${n ? '<a class="btn btn-linha" href="faq.html">Todas as perguntas</a>' : ''}</div>
    </div>
    <div class="faq rv" data-d="1">${l.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f.q}${icon('plus')}</summary><p>${f.a}</p></details>`).join('')}</div>
  </div></section>`;
}

function chamadaCep() {
  return `<section class="chamada"><img src="${IMG}amigas_sofa.jpg" alt="" loading="lazy" style="object-position:50% 40%">
  <div class="container">
    <h2>Será que a fibra Vyra <em>já chega aí?</em></h2>
    <p>Digite o seu CEP e veja na hora. Se chegar, você já escolhe o plano e o dia da instalação.</p>
    <form class="cep" novalidate><label class="sr" for="cep-fim">CEP</label><input id="cep-fim" inputmode="numeric" placeholder="Digite seu CEP" data-mask="cep" required><button class="btn btn-rosa" type="submit">Consultar cobertura</button></form>
    <div class="cep-res" role="status" aria-live="polite"></div>
  </div></section>`;
}

function lgpd(id) {
  return `<label class="lgpd" for="${id}"><input type="checkbox" id="${id}" required><span>Li e aceito a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button> e autorizo a Vyra a usar estes dados para responder ao meu pedido.</span></label>`;
}

function contatoForm(emp) {
  return `<form class="form cartao-form" novalidate data-msg="${emp ? 'Olá! Vim pelo site e quero uma proposta para empresa.' : 'Olá! Vim pelo site e quero falar com a Vyra.'}">
    <div class="linha2">
      <label for="c-nome">Nome<input id="c-nome" autocomplete="name" data-rot="Nome" required></label>
      <label for="c-tel">WhatsApp<input id="c-tel" inputmode="tel" data-mask="tel" autocomplete="tel" data-rot="WhatsApp" required></label>
    </div>
    ${emp ? `<div class="linha2"><label for="c-emp">Empresa<input id="c-emp" autocomplete="organization" data-rot="Empresa" required></label><label for="c-cnpj">CNPJ<input id="c-cnpj" inputmode="numeric" data-rot="CNPJ"></label></div>` : ''}
    <label for="c-email">E-mail<input id="c-email" type="email" autocomplete="email" data-rot="E-mail" required></label>
    <label for="c-assunto">Assunto<select id="c-assunto" data-rot="Assunto">${(emp ? ['Proposta de link dedicado', 'Plano Empresa 400', 'Plano Empresa 800', 'Rede interna do escritório', 'Outro'] : ['Quero contratar', 'Proposta para empresa', 'Suporte técnico', 'Financeiro', 'Outro']).map(o => `<option>${o}</option>`).join('')}</select></label>
    <label for="c-msg">Mensagem<textarea id="c-msg" data-rot="Mensagem" required></textarea></label>
    ${lgpd(emp ? 'c-lgpd-e' : 'c-lgpd')}
    <div><button class="btn btn-rosa" type="submit">${emp ? 'Pedir proposta' : 'Enviar mensagem'} ${seta}</button></div>
    <div class="form-ok" tabindex="-1" role="status">${emp ? 'Pedido recebido. Uma consultora fala com você em até 1 dia útil.' : 'Mensagem enviada. Respondemos em breve pelo WhatsApp.'}</div>
  </form>`;
}

function info(img, alt) {
  return `<aside class="info"><img src="${IMG}${img}" alt="${esc(alt)}" loading="lazy"><div class="in">
    <div class="info-it">${socialIcon('whatsapp')}<div><b>WhatsApp</b><span>${C.contact.whatsapp}</span></div></div>
    <div class="info-it">${icon('phone')}<div><b>Telefone</b><span>${C.contact.phone}</span></div></div>
    <div class="info-it">${icon('mail')}<div><b>E-mail</b><span>${C.contact.email}</span></div></div>
    <div class="info-it">${icon('pin')}<div><b>Endereço</b><span>${E.endereco}, ${E.cidade}</span></div></div>
    ${C.contact.hours.map(h => `<div class="info-it">${icon('clock')}<div><b>${h[0]}</b><span>${h[1]}</span></div></div>`).join('')}
    <div><b style="font-family:var(--f-tit);display:block;margin-bottom:10px">Redes sociais</b>${social()}</div>
  </div></aside>`;
}

function galeria() {
  return `<section class="sec" id="galeria"><div class="container">
    <div class="cab rv"><span class="apoio">Galeria</span><h2>A Vyra <em>no dia a dia.</em></h2><p>Fotos ilustrativas de quem usa a internet em casa, no trabalho e na diversão, e da nossa equipe.</p></div>
    <div class="filtros gal" style="--n:5" data-filtro="lista-gal" role="group" aria-label="Filtrar fotos por categoria">${C.galeriaCats.map(([v, l], i) => `<button type="button" data-v="${v}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
    <div class="galeria" id="lista-gal">${C.galeria.map(g => `<button type="button" data-cat="${g.cat}" data-rot="${esc(g.alt)}" aria-label="Ampliar: ${esc(g.alt)}"><img src="${IMG}${g.img}" alt="${esc(g.alt)}" loading="lazy"></button>`).join('')}</div>
  </div></section>
  <dialog class="zoom" id="zoom" aria-label="Foto ampliada"><button type="button" class="fecha" data-fecha aria-label="Fechar">${icon('close')}</button><img src="" alt=""><p></p></dialog>`;
}

function politicaVisivel() {
  return `<section class="sec soft" id="politica"><div class="container">
    <div class="cab rv"><span class="apoio">Antes de agendar</span><h2>Política de agendamento, <em>atraso e garantia.</em></h2></div>
    <div class="politica">
      <article class="rv"><h3>Agendamento</h3><p>Segunda a sábado, em ${C.horarios.length} horários por dia. O horário vale depois da confirmação pelo WhatsApp.</p></article>
      <article class="rv" data-d="1"><h3>Atraso</h3><p>O técnico espera 15 minutos. Se o atraso for nosso e passar de 30 minutos, avisamos antes e você remarca com prioridade.</p></article>
      <article class="rv"><h3>Cancelamento e remarcação</h3><p>Sem custo até 2 horas antes. A segunda ausência seguida sem aviso tem taxa de R$ 30 (valor de exemplo).</p></article>
      <article class="rv" data-d="1"><h3>Garantia</h3><p>Velocidade medida com você na instalação. Se a média ficar abaixo do exigido pela Anatel, o técnico volta sem custo.</p></article>
      <article class="alerta rv" style="grid-column:1 / -1"><h3>Atenção: área rural, mudança de endereço e fidelidade</h3><p>Chácaras e sítios passam por estudo de viabilidade antes do agendamento, com prazo e custo informados por escrito. Na mudança de endereço, conferimos a cobertura do novo local antes de retirar os equipamentos. Planos com fidelidade mostram prazo e multa proporcional antes da assinatura. <button type="button" class="link" style="color:#fff" data-doc="servico">Ler a política completa</button></p></article>
    </div>
  </div></section>`;
}

function agenda() {
  const tecnicos = C.equipe.filter(p => p.campo);
  const servs = [['Instalação nova', 'instalacao'], ['Visita técnica', 'visita'], ['Ponto extra de Wi-Fi mesh', 'mesh'], ['Mudança de endereço', 'mudanca'], ['Estudo de viabilidade rural', 'rural']];
  return `<section class="sec" id="agendar"><div class="container" style="max-width:960px">
    <div class="cab rv"><span class="apoio">Assinatura e agendamento</span><h2>Escolha o serviço, o técnico <em>e o melhor dia.</em></h2><p>Ao enviar, o pedido segue pelo WhatsApp e a gente confirma a cobertura e o horário.</p></div>
    <form class="form cartao-form" id="agenda" novalidate data-msg="Olá! Vim pelo site e quero agendar com a Vyra.">
      <fieldset><legend>Serviço</legend>
        <label for="a-servico">O que você precisa?<select id="a-servico" data-rot="Serviço" required>${servs.map(([s, h]) => `<option data-h="${h}">${s}</option>`).join('')}</select></label>
      </fieldset>
      <fieldset id="fs-plano"><legend>Plano<small>Só para instalação nova.</small></legend>
        <div class="escolha">${C.combos.map(p => `<label><input type="radio" name="plano" value="${p.id}" data-rot="Plano"${p.featured ? ' checked' : ''}><b>${p.name}</b><span>${p.speed} ${p.unit}, R$ ${p.price}/mês</span><span>${p.streams.join(' + ')}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>Técnico, data e horário</legend>
        <div class="linha2">
          <label for="a-tec">Profissional<select id="a-tec" data-rot="Técnico"><option>Primeiro disponível</option>${tecnicos.map(p => `<option>${p.nome} (${p.funcao.toLowerCase()})</option>`).join('')}</select></label>
          <label for="a-data">Data<input id="a-data" type="date" data-rot="Data" required></label>
        </div>
        <div role="radiogroup" aria-label="Horário" class="horas">${C.horarios.map((h, i) => `<label><input type="radio" name="hora" value="${h}" data-rot="Horário"${i === 0 ? ' required' : ''}>${h}</label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>Seus dados</legend>
        <div class="linha2"><label for="a-nome">Nome completo<input id="a-nome" autocomplete="name" data-rot="Nome" required></label><label for="a-cpf">CPF<input id="a-cpf" inputmode="numeric" data-mask="cpf" data-rot="CPF" required></label></div>
        <div class="linha2"><label for="a-tel">WhatsApp<input id="a-tel" inputmode="tel" data-mask="tel" autocomplete="tel" data-rot="WhatsApp" required></label><label for="a-email">E-mail<input id="a-email" type="email" autocomplete="email" data-rot="E-mail" required></label></div>
      </fieldset>
      <fieldset><legend>Endereço da visita</legend>
        <div class="linha2"><label for="a-cep">CEP<input id="a-cep" inputmode="numeric" data-mask="cep" placeholder="00000-000" data-rot="CEP" required></label><label for="a-num">Número<input id="a-num" data-rot="Número" required></label></div>
        <div class="linha2"><label for="a-rua">Rua<input id="a-rua" autocomplete="address-line1" data-rot="Rua" required></label><label for="a-bairro">Bairro<input id="a-bairro" data-rot="Bairro" required></label></div>
      </fieldset>
      ${lgpd('a-lgpd')}
      <div><button class="btn btn-rosa" type="submit">Enviar pedido pelo WhatsApp ${seta}</button></div>
      <div class="form-ok" tabindex="-1" role="status">Pedido recebido. Vamos confirmar a cobertura e o horário pelo WhatsApp.</div>
    </form>
  </div></section>`;
}

// ---------- páginas ----------
const paginas = {
  index: { t: `${E.nome} | Internet fibra óptica em Marialva e região`, b: () => `${vitrine()}
  ${planos('ambos')}
  ${servicos()}
  ${streaming()}
  ${momentos()}
  ${porque()}
  ${empBand()}
  ${equipeMini()}
  ${depoimentos()}
  ${instagram()}
  ${faq(5)}
  ${chamadaCep()}` },

  sobre: { t: `Sobre nós | ${E.nome}`, b: () => `${pcab('familia_cinco.jpg', '50% 60%', 'Pai, mãe e três filhos sorrindo no sofá', 'Feita no interior, <em>para o interior.</em>', C.about.intro, 'Sobre nós')}
  <section class="sec"><div class="container lado-a-lado">
    <div class="midia rv"><div class="principal"><img src="${IMG}equipe_joinha.jpg" alt="Equipe da Vyra fazendo joinha em volta do notebook" loading="lazy"></div>
      <div class="menor"><img src="${IMG}tecnico_capacete.jpg" alt="Técnico de campo de capacete" style="object-position:50% 20%" loading="lazy"></div>
      <div class="selo"><b>24h</b><span>suporte por gente<br>da região</span></div></div>
    <div class="texto rv" data-d="1"><span class="apoio">Nossa história</span><h2>Gente de perto, <em>fibra de verdade.</em></h2>${C.about.story.map(p => `<p>${p}</p>`).join('')}<a class="btn btn-linha" href="equipe.html">Conhecer a equipe ${seta}</a></div>
  </div></section>
  <section class="sec soft"><div class="container">
    <div class="proposito rv"><small>Nosso propósito</small><p>${C.about.purpose}</p></div>
    <div class="valores">${C.about.values.map((v, i) => `<div class="rv" data-d="${i % 3}"><b>${v.title}</b><span>${v.text}</span></div>`).join('')}</div>
  </div></section>
  ${galeria()}
  ${momentos()}
  ${chamadaCep()}` },

  residencial: { t: `Internet residencial | ${E.nome}`, b: () => `${pcab('jovens_sofa_fones.jpg', '50% 40%', 'Dois jovens de fone no sofá, um no notebook e outra no celular', 'Internet para casa <em>cheia de telas.</em>', 'Planos de 500 Mega a 1 Giga com YouTube Premium incluso, Wi-Fi 6 e instalação grátis.', 'Residencial')}
  ${planos('casa')}
  ${servicos(['casa', 'rural', 'extra'])}
  ${streaming()}
  ${momentos()}
  ${depoimentos()}
  ${faq(5)}
  ${chamadaCep()}` },

  empresas: { t: `Internet para empresas | ${E.nome}`, b: () => `${pcab('equipe_notebook_risos.jpg', '50% 35%', 'Colegas rindo em volta do notebook no escritório', 'Vyra Empresas: <em>sua operação não para.</em>', 'IP fixo, link dedicado e SLA em contrato para comércio, clínicas, indústria e agro.', 'Empresas')}
  ${planos('emp')}
  ${servicos(['empresa'])}
  <section class="sec soft"><div class="container lado-a-lado">
    <div class="midia rv"><div class="principal"><img src="${IMG}empreendedora_caixas.jpg" alt="Empreendedora sorrindo no notebook entre caixas de pedidos" loading="lazy"></div>
      <div class="menor"><img src="${IMG}dona_negocio.jpg" alt="Dona de loja sorrindo no caixa" loading="lazy"></div>
      <div class="selo"><b>SLA</b><span>tempo de reparo<br>em contrato</span></div></div>
    <div class="texto rv" data-d="1"><span class="apoio">Para o seu negócio</span><h2>Conexão de empresa, <em>atendimento de vizinho.</em></h2>
      <p>Maquininha, sistema na nuvem, câmeras e nota fiscal dependem da internet. A Vyra cuida para que nada disso pare.</p>
      <ul class="lista-check">${C.business.map(b => `<li><span class="ck">${icon('check')}</span><b>${b.title}</b><span>${b.text}</span></li>`).join('')}</ul>
    </div>
  </div></section>
  ${empBand()}
  <section class="sec"><div class="container contato-grade">
    <div style="display:grid;gap:18px"><div class="cab" style="margin:0"><span class="apoio">Proposta</span><h2>Peça uma proposta <em>sob medida.</em></h2><p>Uma consultora responde em até 1 dia útil.</p></div>${contatoForm(true)}</div>
    ${info('empresaria_notebook.jpg', 'Consultora sorrindo no notebook')}
  </div></section>` },

  equipe: { t: `Equipe | ${E.nome}`, b: () => `${pcab('equipe_vibra.jpg', '50% 35%', 'Equipe comemorando na frente do notebook', 'Quem atende <em>é daqui.</em>', 'Técnicos, atendentes e consultores da região. Você escolhe o técnico na hora de agendar.', 'Equipe')}
  <section class="sec"><div class="container">
    <div class="cab rv"><span class="apoio">Nossa equipe</span><h2>Conheça quem cuida <em>da sua conexão.</em></h2><p>Nomes e fotos de demonstração, para trocar pela equipe real.</p></div>
    <div class="equipe">${C.equipe.map((p, i) => `<article class="pessoa rv" data-d="${i % 3}">
      <figure><img src="${IMG}${p.foto}" alt="${p.nome}, ${p.funcao.toLowerCase()} da Vyra" style="object-position:${p.pos}" loading="lazy">${p.campo ? '<span>Vai até você</span>' : ''}</figure>
      <div class="corpo"><h3>${p.nome}</h3><span class="func">${p.funcao}</span><div class="esp">${p.esp.map(e => `<span>${e}</span>`).join('')}</div></div>
    </article>`).join('')}</div>
    <div style="margin-top:34px"><a class="btn btn-rosa" href="assine.html#visita">Agendar com um técnico ${seta}</a></div>
  </div></section>
  <section class="sec soft"><div class="container lado-a-lado inv">
    <div class="midia rv"><div class="principal"><img src="${IMG}equipe_comemora.jpg" alt="Equipe comemorando em reunião" loading="lazy"></div>
      <div class="menor"><img src="${IMG}atendente_headset.jpg" alt="Atendente com headset" style="object-position:70% 30%" loading="lazy"></div></div>
    <div class="texto rv" data-d="1"><span class="apoio">Como trabalhamos</span><h2>Um time só, <em>do atendimento ao poste.</em></h2>
      <p>Quem atende o seu WhatsApp senta ao lado de quem monitora a rede e de quem vai até a sua casa. Por isso o chamado não se perde no caminho.</p>
      <ul class="lista-check"><li><span class="ck">${icon('check')}</span><b>Técnicos próprios</b><span>Nada de terceirizado que nunca viu a sua rua.</span></li><li><span class="ck">${icon('check')}</span><b>Treinamento contínuo</b><span>Fibra, Wi-Fi 6 e atendimento com paciência.</span></li><li><span class="ck">${icon('check')}</span><b>Identificação na visita</b><span>Uniforme, crachá e nome confirmado no WhatsApp antes de chegar.</span></li></ul>
    </div>
  </div></section>
  ${instagram()}` },

  faq: { t: `Perguntas frequentes | ${E.nome}`, b: () => `${pcab('casal_celular.jpg', '50% 30%', 'Casal rindo com o celular no sofá', 'Perguntas <em>frequentes.</em>', 'Respostas rápidas sobre instalação, planos, streaming e suporte.', 'FAQ')}
  ${faq()}
  ${politicaVisivel()}
  ${chamadaCep()}` },

  contato: { t: `Contato | ${E.nome}`, b: () => `${pcab('atendente_headset.jpg', '70% 30%', 'Atendente sorrindo com headset no computador', 'Fale com <em>a gente.</em>', 'Tire dúvidas, peça uma proposta ou fale com o suporte. Gente da região responde.', 'Contato')}
  <section class="sec"><div class="container contato-grade">
    <div style="display:grid;gap:18px"><div class="cab" style="margin:0"><span class="apoio">Contato</span><h2>Envie sua <em>mensagem.</em></h2></div>${contatoForm(false)}</div>
    ${info('mulher_tablet_janela.jpg', 'Mulher usando o tablet perto da janela')}
  </div></section>
  ${instagram()}` },

  assine: { t: `Assine e agende | ${E.nome}`, b: () => `${pcab('familia_tv_sala.jpg', '50% 30%', 'Família assistindo TV junta no sofá', 'Assine <em>e agende.</em>', 'Escolha o plano, o técnico e o melhor dia. A gente confirma a cobertura e chega no horário.', 'Assine já')}
  ${agenda()}
  ${politicaVisivel()}` },
};

// ---------- página completa ----------
const FONTES = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Red+Hat+Display:wght@700;800;900&display=swap">`;

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css;
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, '#6A1794', '#110A16');
const cssV = ver(css), jsV = ver(js);

function pagina(id, { t, b }) {
  return `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t)}</title>
<meta name="description" content="${esc(C.brand.description)}">
<meta name="theme-color" content="#6A1794">
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${FONTES}
<link rel="stylesheet" href="assets/style.css?v=${cssV}">
</head>
<body data-page="${id}" data-wa="${C.contact.whatsappLink}">
${topo(id)}
<main id="conteudo">
  ${b()}
</main>
${rodape()}
${janelas}
<script src="assets/main.js?v=${jsV}"></script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith('.html'))) fs.unlinkSync(path.join(OUT, f));
let usadas = new Set();
for (const [id, p] of Object.entries(paginas)) {
  const html = pagina(id, p);
  for (const m of html.matchAll(/assets\/img\/([\w.-]+\.(?:jpg|png|webp))/g)) usadas.add(m[1]);
  fs.writeFileSync(path.join(OUT, id + '.html'), html);
}
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), css);
fs.writeFileSync(path.join(OUT, 'assets', 'main.js'), js);
// favicon: logo da Vyra em roxo com o ponto magenta
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6A1794"/><path d="M15 18h8.5l8 22 8-22H48L36 48h-9z" fill="#fff"/><circle cx="50" cy="46" r="6" fill="#CB2166"/></svg>`);
// fotos: só as usadas, do próprio modelo ou das fotos comuns da Vyra
const dst = path.join(OUT, 'assets', 'img');
for (const f of fs.readdirSync(dst)) if (!usadas.has(f)) fs.unlinkSync(path.join(dst, f));
const faltando = [];
for (const f of usadas) {
  const a = path.join(__dirname, 'img', f), b = path.join(__dirname, '..', '_build', 'img', f);
  if (fs.existsSync(a)) fs.copyFileSync(a, path.join(dst, f));
  else if (fs.existsSync(b)) fs.copyFileSync(b, path.join(dst, f));
  else faltando.push(f);
}
if (faltando.length) { console.error('Fotos não encontradas:', faltando.join(', ')); process.exitCode = 1; }
console.log(`vyra-standard-roxo: ${Object.keys(paginas).length} páginas, ${usadas.size} fotos`);
