// Gera o Salvi Premium (nutrição) em templates/clinicas/premium/salvi-premium/.
// Portfólio da nutricionista Bruna Salvi e da clínica dela em Florianópolis. Referências do pedido: Curitiba Nutrição,
// Juliana Pappi, Vittória Martineli e Zavia Clinic (estrutura e conteúdo; o desenho é próprio).
// Páginas: início, equipe, uma página por especialidade (SEO local), blog com artigos, Área do cliente e 404.
// Uso: node templates/clinicas/_build-salvi-premium/build.js
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');

const CHAVE = 'salvi';
const COR_CLARO = '#F4EEE4', COR_ESCURO = '#121712';
const OUT = path.join(__dirname, '..', 'premium', 'salvi-premium');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const ANO = 2026;
const HOJE = '2026-11-27';

// ---------- saída limpa e fotos usadas ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
for (const p of ['assets/img', 'blog', 'especialidades']) fs.mkdirSync(path.join(OUT, p), { recursive: true });

// largura e altura lidas do cabeçalho do WebP (VP8, VP8L e VP8X), para o navegador reservar o espaço da foto
const medidas = new Map();
const tamanhoWebp = (arq) => {
  const b = fs.readFileSync(arq);
  const tipo = b.toString('ascii', 12, 16);
  if (tipo === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (tipo === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
};
const usa = (nome) => {
  if (medidas.has(nome)) return medidas.get(nome);
  const arq = path.join(FOTOS, `${nome}.webp`);
  if (!fs.existsSync(arq)) throw new Error(`Foto faltando: ${nome}`);
  const m = tamanhoWebp(arq);
  medidas.set(nome, m);
  return m;
};

// B: caminho até a raiz do site a partir da página que está sendo gerada ('' ou '../')
let B = '';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reais = (v) => `R$ ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
const duracao = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const dataBr = (d) => { const [a, m, dia] = d.split('-'); return `${+dia} de ${['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][m - 1]} de ${a}`; };
const wa = (msg) => `https://wa.me/55${M.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
const src = (n) => { usa(n); return `${B}assets/img/${n}.webp`; };
const foto = (n, { alt = C.fotos[n] ?? '', cls = '', lazy = true, sizes = '' } = {}) => {
  const [w, h] = usa(n);
  const foco = C.foco[n] ? ` style="object-position:${C.foco[n]}"` : '';
  return `<img src="${src(n)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"${cls ? ` class="${cls}"` : ''}${sizes}${foco}>`;
};
const EQ = Object.fromEntries(C.equipe.map((p) => [p.id, { ...p, avatar: p.avatar || p.foto }]));
// retrato pequeno e redondo (agenda, cartões, artigos): usa o recorte do rosto quando existe
const avatar = (p, tam) => `<img src="${src(p.avatar)}" alt="" width="${tam}" height="${tam}" loading="lazy"${C.foco[p.avatar] ? ` style="object-position:${C.foco[p.avatar]}"` : ''}>`;
const SEG = Object.fromEntries(C.segmentos.map((s) => [s.id, s]));
const servicosDo = (seg) => C.servicos.filter((s) => s.seg === seg);
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/?mlat=${M.geo.lat}&mlon=${M.geo.lon}#map=17/${M.geo.lat}/${M.geo.lon}`;
const rotaUrl = `https://www.openstreetmap.org/directions?to=${M.geo.lat}%2C${M.geo.lon}`;
const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${M.completo} ${M.cidade}`)}`;
const instaUrl = `https://instagram.com/${M.instagram}`;
const tel = M.telefone.replace(/\D/g, '');
const nota = String(C.google.nota).replace('.', ',');
const estrelas = (n = 5) => `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(n)}</span>`;
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">';

// ---------- peças pequenas ----------
// botão "copo que enche": a onda sobe por trás do texto no hover; data-magnetic puxa o botão para o mouse
const btn = (href, texto, { tipo = 'cheio', ic = I.seta, attrs = '' } = {}) =>
  `<a class="btn btn-${tipo}" href="${href}" data-magnetic${attrs}><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">${esc(texto)}</span>${ic || ''}</a>`;
const btnBotao = (texto, { tipo = 'cheio', ic = I.seta, attrs = '' } = {}) =>
  `<button class="btn btn-${tipo}" data-magnetic${attrs}><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">${esc(texto)}</span>${ic || ''}</button>`;
// títulos sobem palavra por palavra (o texto inteiro fica no aria-label)
const palavras = (t) => t.split(' ').map((p, k) => `<span class="pal" style="--k:${k}"><span>${esc(p)}</span></span>`).join(' ');
const titulo = (t, tag = 'h2', cls = 'tit') => `<${tag} class="${cls}" aria-label="${esc(t)}"><span aria-hidden="true">${palavras(t)}</span></${tag}>`;
const cab = ({ ap, tit, txt = '', acao = '', tag = 'h2' }) => `<div class="sec-cab">
  <div><p class="apoio">${esc(ap)}</p>${titulo(tit, tag)}</div>
  ${txt || acao ? `<div class="sec-cab-dir">${txt ? `<p>${txt}</p>` : ''}${acao}</div>` : ''}
</div>`;
const mascara = (n, o = {}) => `<figure class="mascara${o.cls ? ` ${o.cls}` : ''}"${o.cursor ? ` data-cursor="${o.cursor}"` : ''}>${foto(n, o)}${o.leg ? `<figcaption>${o.leg}</figcaption>` : ''}</figure>`;
const ini = () => (paginaAtual === 'inicio' ? '' : `${B}index.html`);
let paginaAtual = 'inicio';

// ---------- topo e menu ----------
const navLinks = () => [
  [`${ini()}#sobre`, 'A Bruna'],
  [`${ini()}#metodo`, 'Método'],
  ['sub', 'Especialidades'],
  [`${ini()}#clinica`, 'A clínica'],
  [`${B}equipe.html`, 'Equipe'],
  [`${ini()}#convenios`, 'Convênios'],
  [`${B}blog/index.html`, 'Blog'],
];
const subEsp = () => `${C.segmentos.filter((s) => s.pagina).map((s) => `<a href="${B}especialidades/${s.pagina}.html">${esc(s.nome)}</a>`).join('')}<a href="${ini()}#servicos">Serviços e valores</a>`;
const topo = () => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="largo topo-in">
    <a class="logo" href="${B}index.html" aria-label="${M.completo}, início">${I.logo()}</a>
    <nav class="nav" aria-label="Principal"><ul>
      ${navLinks().map(([h, t]) => (h === 'sub'
    ? `<li class="tem-sub"><button type="button" class="nav-sub-btn" aria-expanded="false" aria-controls="sub-esp">${t}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="sub" id="sub-esp">${subEsp()}</div></li>`
    : `<li><a href="${h}">${t}</a></li>`)).join('')}
    </ul></nav>
    <div class="topo-acoes">
      <a class="topo-area" href="${B}area-cliente.html">${I.porta}<span>Área do cliente</span></a>
      ${btn(`${ini()}#agendar`, 'Agendar', { ic: '', attrs: ' data-cursor="Agendar"' })}
    </div>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-cel" aria-label="Abrir o menu">${I.menu}</button>
  </div>
</header>
<div class="menu-cel" id="menu-cel" hidden>
  <nav aria-label="Menu do celular"><ul>
    ${navLinks().filter(([h]) => h !== 'sub').map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}
    <li><a href="${ini()}#servicos">Especialidades e valores</a></li>
    <li><a href="${B}area-cliente.html">Área do cliente</a></li>
  </ul></nav>
  <div class="menu-cel-pe">${btn(`${ini()}#agendar`, 'Agendar consulta')}${T.pilula('deitada', 'claro')}</div>
</div>`;

// ---------- abertura, cortina entre páginas e cursor ----------
const abertura = `<div class="abertura" id="abertura" aria-hidden="true">
  <svg class="ab-desenho" viewBox="0 0 120 120"><circle class="ab-prato" cx="60" cy="60" r="52"/><circle class="ab-prato2" cx="60" cy="60" r="40"/><path class="ab-folha" d="M36 86c3-25 18-44 50-52-3 30-20 47-50 52Z"/><path class="ab-nerv" d="M38 84c12-15 25-28 40-42"/></svg>
  <p class="ab-nome">${[...M.nome].map((l, k) => `<span style="--k:${k}">${l}</span>`).join('')}</p>
  <p class="ab-sub">nutrição</p>
  <p class="ab-conta"><span data-conta>0</span></p>
</div>`;
const cortina = `<div class="cortina" aria-hidden="true"><span class="cortina-marca">${I.simbolo()}</span></div>`;
const cursor = '<div class="cursor" aria-hidden="true"><span class="cur-anel"><b class="cur-txt"></b></span><span class="cur-ponto"></span></div>';

// ---------- rodapé ----------
const horasLinhas = () => C.horario.map((h) => `<tr><th scope="row">${h.dias}</th><td>${h.horas}</td></tr>`).join('');
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));
const rodape = () => `<footer class="rodape" id="contato-rodape">
  <div class="largo">
    <div class="rod-topo">
      <div class="rod-marca">
        <a class="logo" href="${B}index.html" aria-label="${M.completo}, início">${I.logo()}</a>
        <p>Nutrição clínica e comportamental em ${M.cidade} e online. Comida de verdade, conversa sem julgamento e um plano que cabe na sua rotina.</p>
        ${btn(`${ini()}#agendar`, 'Ver horários livres', { tipo: 'claro' })}
      </div>
      <div class="rod-cols">
        <div><h3>Navegue</h3><ul>${[[`${ini()}#sobre`, 'A Bruna'], [`${ini()}#metodo`, 'Método'], [`${ini()}#servicos`, 'Serviços e valores'], [`${ini()}#clinica`, 'Tour pela clínica'], [`${ini()}#convenios`, 'Convênios'], [`${ini()}#avaliacoes`, 'Avaliações']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
        <div><h3>Especialidades</h3><ul>${C.segmentos.filter((s) => s.pagina).map((s) => `<li><a href="${B}especialidades/${s.pagina}.html">${esc(s.curto)}</a></li>`).join('')}<li><a href="${B}equipe.html">Equipe</a></li><li><a href="${B}blog/index.html">Blog</a></li></ul></div>
        <div><h3>Atendimento</h3><ul>
          <li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}${M.whatsapp}</a></li>
          <li><a href="tel:${tel}">${I.telefone}${M.telefone}</a></li>
          <li><a href="mailto:${M.email}">${I.carta}${M.email}</a></li>
          <li class="redes"><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a href="${M.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.youtube}</a></li>
        </ul></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="${B}assets/img/mapa_trindade.webp" alt="Mapa da ${M.bairro}, em ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>Seg a sex 8h às 19h, sáb 8h às 12h</span>
          <div class="mbtns"><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Consultas presenciais na ${M.bairro}, perto da UFSC, com estacionamento conveniado. Online para todo o Brasil, por vídeo.</p>
        <table class="horas"><caption>Horário de atendimento</caption><tbody>${horasLinhas()}</tbody></table>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}, registro ${M.registroPJ}. Responsável técnica: ${EQ.bruna.nome}, ${EQ.bruna.crn}. ${endereco}, CEP ${M.cep}.</p>
      <p>As informações deste site são educativas e não substituem a consulta individual com nutricionista ou médico.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="consulta">Termos da consulta</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => medidas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('')}</ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true"><span>${M.nome}</span>${I.simbolo('simbolo rod-simbolo')}</p>
  <div class="rod-fim"><div class="largo"><p>© ${ANO} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, registros, preços e avaliações fictícios.</p></div></div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo} e quero agendar uma consulta.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp" data-magnetic>${I.whats}<span>WhatsApp</span></a>`;

// ---------- janelas legais, cookies e aviso ----------
const legal = {
  consulta: ['Termos da consulta', `
    <h3>Agendamento</h3><p>O pedido feito pelo site reserva o horário por 2 horas. A consulta fica confirmada quando respondemos pelo WhatsApp. Na véspera, enviamos o lembrete com o preparo da avaliação corporal.</p>
    <h3>Valores e pagamento</h3><p>Os valores do site são de referência e podem mudar sem aviso para novos agendamentos. ${esc(C.pagamento)}</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>${esc(C.cancelamento)} Consultas online começam no horário marcado; o link chega 10 minutos antes.</p>
    <h3>Garantia do plano</h3><p>Se o plano não couber na sua rotina, ajustamos sem custo em até 15 dias depois da consulta.</p>
    <h3>Bioimpedância</h3><p>${esc(C.sensiveis[0][1])}</p>
    <h3>Gestantes, crianças e uso de medicação</h3><p>${esc(C.sensiveis[1][1])}</p>
    <h3>Limites do atendimento</h3><p>A nutricionista não prescreve nem ajusta medicamentos. Sinais de alerta são encaminhados ao médico. Fotos de antes e depois de pacientes não são publicadas, conforme as regras do Conselho Federal de Nutricionistas.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento e contato. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo educativo</h3><p>Os artigos do blog são informativos e não substituem a consulta individual. Cada plano alimentar depende de avaliação.</p>
    <h3>Pedidos pelo site</h3><p>Os horários mostrados seguem a agenda de cada profissional, mas só valem depois da nossa confirmação.</p>
    <h3>Área do cliente</h3><p>O acesso é pessoal. Não compartilhe a sua senha. Os materiais são para uso individual e não podem ser revendidos.</p>
    <h3>Links externos</h3><p>Mapas, Google, redes sociais e WhatsApp são serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, convênio, serviço, profissional, dia e horário que você informa nos formulários. Na consulta, registramos dados de saúde (exames, medidas, hábitos e sintomas), que são dados sensíveis e só servem ao seu atendimento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar a consulta, montar e acompanhar o plano alimentar e emitir recibos para reembolso. Novidades por e-mail só com o seu consentimento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. Com o seu médico, apenas com a sua autorização. O pedido trafega pelo WhatsApp (Meta) e o prontuário fica em sistema com acesso restrito à equipe.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem consulta são apagados em 6 meses. O prontuário é guardado pelo prazo exigido pelo conselho profissional.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados e revogar consentimentos pelo e-mail ${M.email}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a sua escolha sobre cookies, o tema claro ou escuro, se a abertura já foi vista nesta visita, os pedidos de agendamento feitos neste aparelho e, na Área do cliente de demonstração, o diário e a lista de compras e, na área da equipe, as triagens e os planos editados neste aparelho. Na versão do cliente, esses dados de saúde ficam no sistema da clínica, com acesso restrito à equipe. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const janelas = () => `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de ${ANO}. Texto a validar na revisão jurídica antes da publicação.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Guardamos só o necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Saiba mais</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-cheio" data-ck="todos"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Aceitar todos</span></button><button type="button" class="btn btn-linha" data-ck="essenciais"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Só os essenciais</span></button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

const lgpd = (id) => `<label class="lgpd" for="${id}"><input type="checkbox" id="${id}" name="lgpd" required><span>Li e aceito a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button> e autorizo o uso dos meus dados para responder a este pedido.</span></label>`;

// ===================== INÍCIO =====================
const capa = () => `<section class="capa" id="inicio">
  <div class="largo capa-in">
    <div class="capa-txt">
      <p class="apoio">${EQ.bruna.nome}, nutricionista em ${M.cidade}</p>
      <h1 class="capa-tit" aria-label="Comida é conversa, não castigo."><span aria-hidden="true">${palavras('Comida é conversa,')}<br><em>${palavras('não castigo.')}</em></span></h1>
      <p class="capa-lead">Nutrição clínica e comportamental para quem cansou de recomeçar a dieta. Consultas na ${M.bairro} e online para todo o Brasil, com uma equipe para cada fase da vida.</p>
      <div class="capa-btns">${btn('#agendar', 'Ver horários livres', { attrs: ' data-cursor="Agendar"' })}${btn('#metodo', 'Conhecer o método', { tipo: 'linha', ic: '' })}</div>
      <ul class="capa-fatos">
        <li><b>${nota}</b><span>no Google</span></li>
        <li><b>${C.numeros[0].valor} anos</b><span>de consultório</span></li>
        <li><b>Online</b><span>para todo o Brasil</span></li>
      </ul>
    </div>
    <div class="capa-foto">
      <svg class="capa-disco" viewBox="0 0 400 400" aria-hidden="true"><defs><path id="circ" d="M200 200m-172 0a172 172 0 1 1 344 0a172 172 0 1 1-344 0"/></defs>
        <circle cx="200" cy="200" r="150" class="disco-fundo"/>
        <text><textPath href="#circ" textLength="1075">comida de verdade <tspan class="t2">conversa sem julgamento</tspan> plano que cabe na rotina <tspan class="t2">nutrição em Florianópolis</tspan></textPath></text></svg>
      <figure class="capa-retrato">${foto('bruna-capa', { lazy: false })}</figure>
      <div class="capa-cartao">
        <b>${EQ.bruna.nome}</b><span>${EQ.bruna.crn}</span>
        <p>Próximo horário livre<strong data-proximo="bruna">consultando a agenda</strong></p>
      </div>
    </div>
  </div>
  <a class="capa-rola" href="#sobre" aria-label="Rolar para conhecer a Bruna"><span></span>role</a>
</section>`;

const sobre = () => `<section class="sobre" id="sobre">
  <div class="largo sobre-in">
    <div class="sobre-fotos">
      ${mascara('bruna-mesa', { cls: 'sobre-f1', cursor: 'Bruna' })}
      ${mascara('bruna-escuta', { cls: 'sobre-f2 inclina' })}
      <p class="sobre-assina" aria-hidden="true">Bruna</p>
    </div>
    <div class="sobre-txt">
      <p class="apoio">Prazer, Bruna</p>
      ${titulo('Doze anos ouvindo antes de prescrever.')}
      <p class="sobre-lead">${esc(EQ.bruna.bio)}</p>
      <blockquote class="sobre-frase"><p>${esc(EQ.bruna.abordagem)}</p></blockquote>
      <ul class="numeros">${C.numeros.map((n) => `<li><b><span data-conta-ate="${n.valor}">${n.valor.toLocaleString('pt-BR')}</span>${n.sufixo}</b><span>${n.rotulo}</span></li>`).join('')}</ul>
      <div class="formacao"><h3>Formação</h3><ul class="linha-tempo">${EQ.bruna.formacao.map(([a, t]) => `<li><b>${a}</b><span>${esc(t)}</span></li>`).join('')}</ul></div>
      <div class="sobre-btns">${btn('#agendar', 'Agendar com a Bruna', { attrs: ' data-escolhe-prof="bruna"' })}<a class="link-seta" href="equipe.html">Conhecer a equipe ${I.seta}</a></div>
    </div>
  </div>
</section>`;

const angulos = C.metodo.map((_, k) => k * 90 + 45);
const metodo = () => `<section class="metodo" id="metodo">
  <div class="metodo-palco">
    <div class="largo metodo-in">
      <div class="metodo-txt">
        <p class="apoio">O método Salvi</p>
        ${titulo('Um prato que se monta em quatro tempos.')}
        <ol class="metodo-etapas">${C.metodo.map((e, k) => `<li data-etapa="${k}"><h3>${e.nome}</h3><p>${esc(e.texto)}</p></li>`).join('')}</ol>
      </div>
      <div class="metodo-prato" aria-hidden="true">
        <div class="prato-disco">
          <div class="prato-foto prato-cinza">${foto('prato-metodo', { alt: '' })}</div>
          <div class="prato-foto prato-cor">${foto('prato-metodo', { alt: '' })}</div>
        </div>
        <svg class="prato-aro" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" class="aro-fundo"/><circle cx="100" cy="100" r="96" class="aro-vivo" pathLength="1"/></svg>
        ${C.metodo.map((e, k) => `<span class="prato-rot" data-etapa="${k}" style="--a:${angulos[k]}deg">${e.nome}</span>`).join('')}
      </div>
    </div>
  </div>
</section>`;

const receita = (s, k) => `<article class="receita" style="--k:${k}">
  <header><h3>${esc(s.nome)}</h3>${s.nota ? `<small>${esc(s.nota)}</small>` : ''}</header>
  <ul class="receita-inclui">${s.inclui.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  <dl class="receita-meta">
    <div><dt>Duração</dt><dd>${duracao(s.dur)}</dd></div>
    <div><dt>Valor</dt><dd>${s.aPartir ? '<small>a partir de</small> ' : ''}${reais(s.preco)}</dd></div>
    <div><dt>Onde</dt><dd>${s.online ? 'Presencial ou online' : 'Presencial'}</dd></div>
  </dl>
  <div class="receita-pe">
    <p class="receita-profs" aria-label="Com ${s.profs.map((p) => EQ[p].curto).join(', ')}">${s.profs.map((p) => avatar(EQ[p], 40)).join('')}<span>${s.profs.length > 2 ? 'Toda a equipe' : s.profs.map((p) => EQ[p].curto).join(' e ')}</span></p>
    <a class="receita-btn" href="${paginaAtual === 'inicio' ? '' : `${B}index.html?serv=${s.id}`}#agendar" data-escolhe-serv="${s.id}" data-cursor="Agendar">Agendar ${I.seta}</a>
  </div>
  ${s.sensivel ? '<p class="receita-aviso">Pede preparo: veja os combinados da consulta.</p>' : ''}
</article>`;

const servicos = () => `<section class="servicos" id="servicos">
  <div class="largo">
    ${cab({ ap: 'Especialidades e valores', tit: 'Cada fase da vida pede um prato diferente.', txt: 'Escolha a área para ver o que inclui cada consulta, quanto tempo leva e quanto custa. Todos os valores incluem o plano no app.' })}
    <div class="seg-abas" role="tablist" aria-label="Especialidades" data-iguais>${C.segmentos.map((s, k) => `<button type="button" role="tab" id="aba-${s.id}" aria-controls="seg-${s.id}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}">${esc(s.curto)}</button>`).join('')}</div>
    ${C.segmentos.map((s, k) => `<div class="seg-painel" role="tabpanel" id="seg-${s.id}" aria-labelledby="aba-${s.id}"${k ? ' hidden' : ''}>
      <div class="seg-lado">
        ${mascara(s.foto, { cls: 'seg-foto' })}
        <p class="seg-chamada">${esc(s.chamada)}</p>
        <p>${esc(s.texto)}</p>
        ${s.pagina ? `<a class="link-seta" href="especialidades/${s.pagina}.html">${esc(s.termo)} ${I.seta}</a>` : ''}
      </div>
      <div class="receitas">${servicosDo(s.id).map(receita).join('')}</div>
    </div>`).join('')}
    <div class="condicoes">
      <div><h3>Pagamento</h3><p>${esc(C.pagamento)}</p></div>
      <div><h3>Cancelamento e remarcação</h3><p>${esc(C.cancelamento)}</p></div>
      <div><h3>Convênio</h3><p>Alguns planos atendem direto e os outros por reembolso. <a href="#convenios">Confira o seu plano</a>.</p></div>
    </div>
  </div>
</section>`;

const bastidores = () => `<section class="bastidores">
  <div class="largo">${cab({ ap: 'Bastidores', tit: 'Uma semana na Salvi, do consultório à feira.', txt: 'Arraste para o lado ou use as setas.' })}</div>
  <div class="carrossel" data-carrossel role="region" aria-roledescription="carrossel" aria-label="Bastidores da Salvi">
    <div class="car-trilho" tabindex="0" data-cursor="Arrastar">${C.bastidores.map((b, k) => `<figure class="car-slide" role="group" aria-roledescription="slide" aria-label="${k + 1} de ${C.bastidores.length}: ${esc(b.titulo)}">${foto(b.foto)}<figcaption><b>${esc(b.titulo)}</b><span>${esc(b.texto)}</span></figcaption></figure>`).join('')}</div>
    <div class="largo car-ctrl"><button type="button" class="car-btn" data-car="-1" aria-label="Foto anterior">${I.setaEsq}</button><span class="car-barra"><i></i></span><button type="button" class="car-btn" data-car="1" aria-label="Próxima foto">${I.seta}</button></div>
  </div>
</section>`;

const tour = () => `<section class="tour" id="clinica">
  <div class="largo">
    ${cab({ ap: 'Tour virtual', tit: 'Entre e conheça a clínica antes da primeira consulta.', txt: 'Arraste a imagem para olhar em volta e use as portas ou a planta para mudar de sala. No teclado, as setas giram a vista.' })}
    <div class="tour-app" data-tour>
      <div class="tour-visor" tabindex="0" role="application" aria-roledescription="tour virtual" aria-label="Tour virtual da clínica" data-cursor="Arrastar">
        <div class="tour-cena"><div class="tour-cil"></div></div>
        <img class="tour-sem3d" src="${src(C.tour[0].foto)}" alt="${esc(C.fotos[C.tour[0].foto])}" width="2000" height="1000" loading="lazy">
        <div class="tour-legenda" aria-live="polite"><b>${C.tour[0].nome}</b><span>${esc(C.tour[0].texto)}</span></div>
        <p class="tour-dica">${I.arrastar}<span>Arraste para olhar em volta</span></p>
      </div>
      <aside class="tour-lado" aria-label="Planta da clínica">
        <svg class="tour-planta" viewBox="0 0 400 260" role="img" aria-label="Planta baixa da clínica com seis ambientes">
          <rect x="6" y="6" width="388" height="248" class="planta-casca"/>
          ${C.tour.map((t) => { const [x, y, w, h] = t.planta; return `<g class="planta-sala" data-sala="${t.id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/><text x="${x + w / 2}" y="${y + h / 2 + 4}">${t.curto}</text></g>`; }).join('')}
          <circle class="planta-voce" r="7" cx="0" cy="0"/>
        </svg>
        <ul class="tour-salas" data-iguais>${C.tour.map((t, k) => `<li><button type="button" data-sala="${t.id}" aria-pressed="${k === 0}">${t.nome}</button></li>`).join('')}</ul>
      </aside>
    </div>
  </div>
</section>`;

const equipeLeque = () => `<section class="equipe" id="equipe">
  <div class="largo">
    ${cab({ ap: 'Equipe', tit: 'Quatro nutricionistas, a mesma conversa.', txt: 'Cada uma cuida de uma fase da vida. Todas trabalham com o mesmo método e conversam entre si sobre os casos.', acao: btn('equipe.html', 'Conhecer a equipe', { tipo: 'linha' }) })}
    <div class="leque" style="--n:${C.equipe.length}">${C.equipe.map((p, k) => `<a class="leque-carta" href="equipe.html#${p.id}" style="--i:${k}" data-cursor="Ver">
      ${foto(p.foto)}
      <span class="leque-info"><b>${p.nome}</b><span>${esc(p.papel)}</span><small>${p.crn}</small></span>
    </a>`).join('')}</div>
  </div>
</section>`;

const agendar = () => `<section class="agendar" id="agendar">
  <div class="largo agendar-in">
    <div class="ag-intro">
      <p class="apoio">Agendamento online</p>
      ${titulo('Escolha o horário livre de quem vai cuidar de você.')}
      <p>Os horários seguem a agenda de cada profissional. O pedido chega no nosso WhatsApp e confirmamos em até 2 horas, no horário de atendimento.</p>
      ${mascara('bruna-escuta', { cls: 'ag-foto' })}
      <p class="ag-nota">Primeira vez? Escolha "Primeira consulta". Já é paciente? Use "Retorno" ou remarque pela <a href="area-cliente.html">Área do cliente</a>.</p>
    </div>
    <form class="ag" data-agenda novalidate>
      <fieldset class="ag-passo"><legend>Serviço</legend>
        <label class="campo" for="ag-servico"><span>O que você precisa</span><select id="ag-servico" name="servico" required>${C.segmentos.map((s) => `<optgroup label="${esc(s.nome)}">${servicosDo(s.id).map((v) => `<option value="${v.id}">${esc(v.nome)}${v.nota ? ` (${esc(v.nota)})` : ''}, ${v.aPartir ? 'a partir de ' : ''}${reais(v.preco)}</option>`).join('')}</optgroup>`).join('')}</select></label>
      </fieldset>
      <fieldset class="ag-passo"><legend>Profissional</legend>
        <div class="ag-profs" data-profs>${C.equipe.map((p) => `<label class="ag-prof" data-prof="${p.id}"><input type="radio" name="prof" value="${p.id}">${avatar(EQ[p.id], 56)}<span><b>${p.nome}</b><small>${esc(p.papel)}</small><em data-proximo="${p.id}"></em></span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="ag-passo"><legend>Como prefere</legend>
        <div class="ag-modal" data-iguais><label><input type="radio" name="modal" value="Presencial" checked><span>${I.casa}Presencial</span></label><label><input type="radio" name="modal" value="Online"><span>${I.video}Online</span></label></div>
      </fieldset>
      <fieldset class="ag-passo"><legend>Dia</legend>
        <div class="ag-dias" data-dias role="radiogroup" aria-label="Dias com horário livre"></div>
      </fieldset>
      <fieldset class="ag-passo"><legend>Horário</legend>
        <div class="ag-horas" data-horas role="radiogroup" aria-label="Horários livres"></div>
      </fieldset>
      <fieldset class="ag-passo ag-dados"><legend>Seus dados</legend>
        <label class="campo" for="ag-nome"><span>Nome completo</span><input id="ag-nome" name="nome" autocomplete="name" required minlength="3"></label>
        <label class="campo" for="ag-tel"><span>WhatsApp</span><input id="ag-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(48) 9 0000-0000"></label>
        <label class="campo" for="ag-email"><span>E-mail</span><input id="ag-email" name="email" type="email" autocomplete="email" required></label>
        <label class="campo" for="ag-conv"><span>Convênio (opcional)</span><input id="ag-conv" name="convenio" list="lista-conv" autocomplete="off" placeholder="Particular"></label>
        <datalist id="lista-conv">${C.convenios.map((c) => `<option value="${esc(c.nome)}">`).join('')}</datalist>
        <label class="campo campo-largo" for="ag-obs"><span>Algo que devemos saber? (opcional)</span><textarea id="ag-obs" name="obs" rows="3" maxlength="500"></textarea></label>
      </fieldset>
      ${lgpd('ag-lgpd')}
      <div class="ag-resumo" data-resumo aria-live="polite"></div>
      <p class="form-erro" data-erro role="alert"></p>
      ${btnBotao('Pedir este horário pelo WhatsApp', { ic: I.whats, attrs: ' type="submit" data-cursor="Agendar"' })}
    </form>
  </div>
</section>`;

const convenios = () => `<section class="convenios" id="convenios">
  <div class="largo">
    ${cab({ ap: 'Convênios', tit: 'Seu plano de saúde cobre a consulta?', txt: 'Digite o nome do seu plano. Alguns atendem direto, sem pagar na hora; nos outros, enviamos tudo para o reembolso no mesmo dia.' })}
    <div class="conv-app" data-convenios>
      <div class="conv-busca">
        <label for="conv-q">Nome do plano</label>
        <div class="conv-campo">${I.lupa}<input id="conv-q" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="conv-lista" autocomplete="off" placeholder="Ex.: Unimed, Cassi, SulAmérica"></div>
        <ul class="conv-lista" id="conv-lista" role="listbox" aria-label="Planos encontrados" hidden></ul>
        <div class="conv-res" data-conv-res aria-live="polite"><p>Comece a digitar para ver como funciona com o seu plano.</p></div>
      </div>
      <div class="conv-todos">
        <h3>Atendimento direto pelo plano</h3>
        <ul class="chips" data-iguais>${C.convenios.filter((c) => c.tipo === 'direto').map((c) => `<li><button type="button" data-conv="${esc(c.nome)}">${esc(c.nome)}</button></li>`).join('')}</ul>
        <h3>Por reembolso</h3>
        <ul class="chips" data-iguais>${C.convenios.filter((c) => c.tipo === 'reembolso').map((c) => `<li><button type="button" data-conv="${esc(c.nome)}">${esc(c.nome)}</button></li>`).join('')}</ul>
      </div>
    </div>
    <div class="reembolso">
      <h3>Como funciona o reembolso</h3>
      <ol class="trilha">${C.reembolso.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
    </div>
  </div>
</section>`;

const avaliacoes = () => `<section class="avaliacoes" id="avaliacoes">
  <div class="largo">
    <div class="g-resumo">
      <div>
        <p class="apoio">Avaliações no Google</p>
        ${titulo('O que dizem as pessoas que já sentaram à nossa mesa.')}
      </div>
      <div class="g-placar">
        <p class="g-nota"><b>${nota}</b>${estrelas()}<span>${C.google.total} avaliações</span></p>
        <div class="g-btns" data-iguais>${btn(googleUrl, 'Ver no Google', { tipo: 'linha', ic: I.seta45, attrs: ' target="_blank" rel="noopener"' })}${btn(googleUrl, 'Avaliar a Salvi', { ic: I.estrela, attrs: ' target="_blank" rel="noopener"' })}</div>
      </div>
    </div>
  </div>
  <div class="g-mesa" data-mesa tabindex="0" aria-label="Avaliações, role para o lado" data-cursor="Arrastar">${C.avaliacoes.map((a, k) => `<article class="g-card" style="--r:${[-2.2, 1.4, -1, 2, -1.6, 1, -2, 1.6][k % 8]}deg">
    <header><span class="g-ava" aria-hidden="true">${iniciais(a.nome)}</span><span><b>${esc(a.nome)}</b><small>${a.quando}</small></span></header>
    <p class="g-est" aria-label="Nota 5 de 5">${estrelas()}</p>
    <p class="g-txt">${esc(a.texto)}</p>
    <footer>Atendimento com ${EQ[a.prof].nome}</footer>
  </article>`).join('')}</div>
  <div class="largo"><p class="g-aviso">Avaliações de demonstração. No site do cliente, o bloco mostra as avaliações reais do perfil da clínica no Google, atualizadas automaticamente.</p></div>
</section>`;

const postCard = (p, cls = '') => `<a class="post-card${cls}" href="${B}blog/${p.slug}.html" data-cursor="Ler">
  <figure>${foto(p.foto, { alt: '' })}</figure>
  <span class="post-info"><small class="post-cat">${p.cat}</small><b>${esc(p.titulo)}</b><span>${esc(p.resumo)}</span><small class="post-meta">${EQ[p.autor].nome}, ${p.leitura} min de leitura</small></span>
</a>`;
const blogHome = () => `<section class="blog-home" id="blog">
  <div class="largo">
    ${cab({ ap: 'Blog', tit: 'Conteúdo para ler sem culpa.', txt: 'Textos curtos da equipe sobre comportamento, esporte, infância e intestino.', acao: btn('blog/index.html', 'Ver todos os artigos', { tipo: 'linha' }) })}
    <div class="revista">${C.blog.slice(0, 3).map((p, k) => postCard(p, k ? '' : ' post-grande')).join('')}</div>
  </div>
</section>`;

const cats = ['Todas', ...new Set(C.galeria.map((g) => g.cat))];
const galeria = () => `<section class="galeria" id="galeria">
  <div class="largo">
    ${cab({ ap: 'Galeria', tit: 'A clínica, a cozinha, os pratos e a feira.' })}
    <div class="filtros" role="group" aria-label="Filtrar a galeria" data-iguais>${cats.map((c, k) => `<button type="button" data-filtro="${c}" aria-pressed="${k === 0}">${c}</button>`).join('')}</div>
    <ul class="gal-grade">${C.galeria.map((g, k) => `<li data-cat="${g.cat}" style="--k:${k}"><button type="button" class="gal-item" data-full="${src(g.foto)}" data-legenda="${esc(g.legenda)}" data-cursor="Ver" aria-label="Ampliar: ${esc(g.legenda)}">${foto(g.foto)}<span>${esc(g.legenda)}</span></button></li>`).join('')}</ul>
  </div>
  <dialog class="lightbox" aria-label="Foto ampliada">
    <figure><img src="" alt=""><figcaption></figcaption></figure>
    <button type="button" class="lb-btn lb-ant" data-lb="-1" aria-label="Foto anterior">${I.setaEsq}</button>
    <button type="button" class="lb-btn lb-prox" data-lb="1" aria-label="Próxima foto">${I.seta}</button>
    <button type="button" class="lb-fecha" data-fecha aria-label="Fechar">${I.fechar}</button>
  </dialog>
</section>`;

const instagram = () => `<section class="insta">
  <div class="largo">
    <div class="insta-cab"><a class="insta-perfil" href="${instaUrl}" target="_blank" rel="noopener">${I.insta}<span>@${M.instagram}</span></a><p>Receitas da cozinha-escola, bastidores das oficinas e dicas rápidas da equipe.</p>${btn(instaUrl, 'Seguir no Instagram', { tipo: 'linha', ic: I.seta45, attrs: ' target="_blank" rel="noopener"' })}</div>
    <ul class="insta-grade">${C.instagram.map((p) => `<li><a href="${instaUrl}" target="_blank" rel="noopener" data-cursor="Abrir">${foto(p.foto, { alt: p.legenda })}<span>${esc(p.legenda)}</span></a></li>`).join('')}</ul>
  </div>
</section>`;

const faqLista = (lista) => `<div class="faq">${lista.map(([q, r]) => `<details><summary>${esc(q)}<i aria-hidden="true"></i></summary><div><p>${esc(r)}</p></div></details>`).join('')}</div>`;
const duvidas = () => `<section class="duvidas" id="duvidas">
  <div class="largo duvidas-in">
    <div>${cab({ ap: 'Dúvidas', tit: 'Antes da primeira consulta.' })}${mascara('bruna-frutas', { cls: 'duv-foto' })}</div>
    ${faqLista(C.faq)}
  </div>
</section>`;

const politicas = () => `<section class="politicas" id="combinados">
  <div class="largo">
    ${cab({ ap: 'Combinados da consulta', tit: 'Regras claras para ninguém se surpreender.' })}
    <div class="comb">${C.politicas.map(([t, d]) => `<div class="comb-item"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
    <div class="sensiveis">${C.sensiveis.map(([t, d]) => `<div><h3>${I.folha}${t}</h3><p>${d}</p></div>`).join('')}</div>
    <p class="comb-pe"><button type="button" class="link" data-doc="consulta">Ler os termos completos da consulta</button></p>
  </div>
</section>`;

const contato = () => `<section class="contato" id="contato">
  <div class="largo contato-in">
    <div class="ct-info">
      ${cab({ ap: 'Contato', tit: 'Ainda com dúvida? Escreva para a gente.' })}
      <ul class="ct-lista">
        <li>${I.whats}<a href="${wa(`Olá, ${M.completo}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">${M.whatsapp}</a></li>
        <li>${I.telefone}<a href="tel:${tel}">${M.telefone}</a></li>
        <li>${I.carta}<a href="mailto:${M.email}">${M.email}</a></li>
        <li>${I.pino}<span>${endereco}</span></li>
        <li>${I.relogio}<span>Seg a sex 8h às 19h, sáb 8h às 12h</span></li>
      </ul>
    </div>
    <form class="ct-form" data-contato novalidate>
      <label class="campo" for="ct-nome"><span>Nome</span><input id="ct-nome" name="nome" autocomplete="name" required minlength="3"></label>
      <label class="campo" for="ct-email"><span>E-mail</span><input id="ct-email" name="email" type="email" autocomplete="email" required></label>
      <label class="campo" for="ct-tel"><span>WhatsApp (opcional)</span><input id="ct-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel"></label>
      <label class="campo" for="ct-assunto"><span>Assunto</span><select id="ct-assunto" name="assunto"><option>Dúvida sobre consulta</option><option>Convênio e reembolso</option><option>Oficinas na cozinha-escola</option><option>Empresas e palestras</option><option>Outro assunto</option></select></label>
      <label class="campo campo-largo" for="ct-msg"><span>Mensagem</span><textarea id="ct-msg" name="msg" rows="4" required minlength="10" maxlength="1200"></textarea></label>
      ${lgpd('ct-lgpd')}
      <p class="form-erro" data-erro role="alert"></p>
      ${btnBotao('Enviar mensagem', { attrs: ' type="submit"' })}
    </form>
  </div>
</section>`;

// ===================== PÁGINAS INTERNAS =====================
const migalhas = (itens) => `<nav class="migalhas" aria-label="Você está em"><ol>${itens.map(([h, t], k) => (k === itens.length - 1 ? `<li aria-current="page">${esc(t)}</li>` : `<li><a href="${h}">${esc(t)}</a></li>`)).join('')}</ol></nav>`;
const pgCab = ({ trilha, ap, tit, txt, fotoN, acoes = '' }) => `<section class="pg-cab">
  <div class="largo pg-cab-in">
    <div class="pg-cab-txt">${migalhas(trilha)}<p class="apoio">${esc(ap)}</p>${titulo(tit, 'h1')}${txt ? `<p class="pg-lead">${txt}</p>` : ''}${acoes ? `<div class="pg-acoes">${acoes}</div>` : ''}</div>
    ${fotoN ? mascara(fotoN, { cls: 'pg-cab-foto', lazy: false }) : ''}
  </div>
</section>`;

const pgEquipe = () => `${pgCab({ trilha: [[`${B}index.html`, 'Início'], ['', 'Equipe']], ap: 'Equipe Salvi', tit: 'Quem vai cuidar de você.', txt: 'Quatro nutricionistas com registro no CRN-10, cada uma numa fase da vida, todas com o mesmo método e a mesma conversa sem julgamento.', fotoN: 'bruna-sala' })}
<section class="perfis">
  <div class="largo">${C.equipe.map((p, k) => `<article class="perfil${k % 2 ? ' perfil-inv' : ''}" id="${p.id}">
    ${mascara(p.foto, { cls: 'perfil-foto inclina' })}
    <div class="perfil-txt">
      <p class="apoio">${esc(p.papel)}</p>
      ${titulo(p.nome)}
      <p class="perfil-crn">${p.crn}</p>
      <p>${esc(p.bio)}</p>
      <blockquote class="sobre-frase"><p>${esc(p.abordagem)}</p></blockquote>
      <h3>Atende principalmente</h3>
      <ul class="lista-folha">${p.especialidades.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
      <h3>Formação</h3>
      <ul class="linha-tempo">${p.formacao.map(([a, t]) => `<li><b>${a}</b><span>${esc(t)}</span></li>`).join('')}</ul>
      <h3>Agenda</h3>
      <p class="perfil-agenda">${['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'].filter((_, d) => p.agenda.dias.includes(d)).join(', ')}, das ${p.agenda.ini}h às ${p.agenda.fim}h${p.agenda.online.length ? '. Online também' : ''}. <span data-proximo="${p.id}"></span></p>
      ${btn(`${B}index.html?prof=${p.id}#agendar`, `Ver horários de ${p.curto}`, { attrs: ' data-cursor="Agendar"' })}
    </div>
  </article>`).join('')}</div>
</section>`;

// quem atende a especialidade: as profissionais dos serviços exclusivos dela (a primeira consulta, que todas fazem, não conta)
const profsDa = (seg) => {
  const exclusivos = servicosDo(seg).filter((v) => v.profs.length <= 2);
  return [...new Set((exclusivos.length ? exclusivos : servicosDo(seg)).flatMap((v) => v.profs))].map((id) => EQ[id]);
};
const pgEspecialidade = (s) => `${pgCab({ trilha: [[`${B}index.html`, 'Início'], [`${B}index.html#servicos`, 'Especialidades'], ['', s.nome]], ap: s.termo, tit: s.chamada, txt: esc(s.texto), fotoN: s.foto, acoes: btn(`${B}index.html?serv=${servicosDo(s.id)[0].id}#agendar`, 'Ver horários livres', { attrs: ' data-cursor="Agendar"' }) + btn(wa(`Olá! Vim pela página de ${s.curto} e quero saber mais.`), 'Tirar dúvida no WhatsApp', { tipo: 'linha', ic: I.whats, attrs: ' target="_blank" rel="noopener"' }) })}
<section class="esp-para">
  <div class="largo esp-para-in">
    <div><p class="apoio">Para quem é</p>${titulo('Você se reconhece em alguma destas?')}</div>
    <ul class="lista-folha lista-grande">${s.paraQuem.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
  </div>
</section>
<section class="servicos servicos-esp">
  <div class="largo">
    ${cab({ ap: 'Consultas e valores', tit: `O que inclui o atendimento de ${s.curto.toLowerCase()}.` })}
    <div class="receitas receitas-largas">${servicosDo(s.id).map(receita).join('')}</div>
    <div class="condicoes"><div><h3>Pagamento</h3><p>${esc(C.pagamento)}</p></div><div><h3>Cancelamento e remarcação</h3><p>${esc(C.cancelamento)}</p></div><div><h3>Atendimento em ${M.cidade}</h3><p>Na ${M.bairro}, perto da UFSC, para quem vem de ${C.bairros.slice(1, 6).join(', ')} e de toda a Grande Florianópolis. Online para todo o Brasil.</p></div></div>
  </div>
</section>
<section class="esp-quem">
  <div class="largo">
    ${cab({ ap: 'Quem atende', tit: 'Profissionais desta especialidade.' })}
    <div class="esp-profs">${profsDa(s.id).map((p) => `<a class="esp-prof" href="${B}equipe.html#${p.id}" data-cursor="Ver">${foto(p.foto)}<span><b>${p.nome}</b><small>${esc(p.papel)}</small><small>${p.crn}</small></span></a>`).join('')}</div>
  </div>
</section>
<section class="duvidas">
  <div class="largo duvidas-in"><div>${cab({ ap: 'Dúvidas', tit: `Perguntas sobre ${s.curto.toLowerCase()}.` })}</div>${faqLista(s.faq)}</div>
</section>
<section class="faixa-cta">
  <div class="largo faixa-in"><p>${esc(s.termo)}: consultas na ${M.bairro} e online.</p>${btn(`${B}index.html?serv=${servicosDo(s.id)[0].id}#agendar`, 'Agendar agora')}</div>
</section>`;

const blogCats = ['Todos', ...new Set(C.blog.map((p) => p.cat))];
const pgBlog = () => `${pgCab({ trilha: [[`${B}index.html`, 'Início'], ['', 'Blog']], ap: 'Blog da Salvi', tit: 'Conteúdo para ler sem culpa.', txt: 'Textos da equipe sobre comportamento, esporte, infância, intestino e cozinha. Informação para o dia a dia, que não substitui a consulta.' })}
<section class="blog-lista">
  <div class="largo">
    <div class="blog-ferr">
      <div class="filtros" role="group" aria-label="Filtrar por assunto" data-iguais>${blogCats.map((c, k) => `<button type="button" data-blog-cat="${c}" aria-pressed="${k === 0}">${c}</button>`).join('')}</div>
      <label class="blog-busca" for="blog-q">${I.lupa}<span class="sr">Buscar no blog</span><input id="blog-q" type="search" placeholder="Buscar no blog" autocomplete="off"></label>
    </div>
    <div class="revista revista-toda" data-blog>${C.blog.map((p, k) => `<div class="post-item" data-cat="${p.cat}" data-busca="${esc(`${p.titulo} ${p.resumo} ${p.cat}`.toLowerCase())}">${postCard(p, k ? '' : ' post-grande')}</div>`).join('')}</div>
    <p class="blog-vazio" data-blog-vazio hidden>Nenhum artigo com essa busca. Tente outra palavra.</p>
  </div>
</section>`;

const pgPost = (p) => {
  const a = EQ[p.autor];
  const corpo = p.corpo.map(([t, v]) => (t === 'h2' ? `<h2>${esc(v)}</h2>` : t === 'lista' ? `<ul class="lista-folha">${v.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : `<p>${esc(v)}</p>`)).join('\n');
  const outros = C.blog.filter((x) => x.slug !== p.slug).slice(0, 3);
  return `<article class="artigo">
  <header class="art-cab">
    <div class="largo">${migalhas([[`${B}index.html`, 'Início'], [`${B}blog/index.html`, 'Blog'], ['', p.titulo]])}
      <p class="apoio">${p.cat}</p>
      ${titulo(p.titulo, 'h1')}
      <p class="art-resumo">${esc(p.resumo)}</p>
      <p class="art-meta">${avatar(a, 44)}<span>Por <a href="${B}equipe.html#${a.id}">${a.nome}</a>, ${a.crn}<br><time datetime="${p.data}">${dataBr(p.data)}</time>, ${p.leitura} min de leitura</span></p>
    </div>
    ${mascara(p.foto, { cls: 'art-foto largo', lazy: false })}
  </header>
  <div class="largo art-in">
    <div class="art-corpo">${corpo}
      <p class="art-aviso">Conteúdo informativo. Não substitui a consulta com nutricionista ou médico.</p>
    </div>
    <aside class="art-lado">
      <div class="art-autora">${foto(a.foto, { alt: a.nome })}<b>${a.nome}</b><span>${esc(a.papel)}</span>${btn(`${B}index.html?prof=${a.id}#agendar`, `Agendar com ${a.curto}`, { attrs: ' data-cursor="Agendar"' })}</div>
    </aside>
  </div>
  <section class="art-outros"><div class="largo">${cab({ ap: 'Continue lendo', tit: 'Outros artigos da equipe.' })}<div class="revista">${outros.map((o) => postCard(o)).join('')}</div></div></section>
</article>`;
};

const pgArea = () => `<section class="area" data-area>
  <div class="area-login" data-area-login>
    ${mascara('bruna-anota', { cls: 'area-foto', lazy: false })}
    <form class="area-form" data-login novalidate>
      ${migalhas([[`${B}index.html`, 'Início'], ['', 'Área do cliente']])}
      <p class="apoio">Área do cliente</p>
      ${titulo('Seu plano, suas consultas e seus recibos num lugar só.', 'h1')}
      <div class="papel-abas" role="group" aria-label="Quem está entrando" data-iguais><button type="button" data-papel="paciente" aria-pressed="true">Sou paciente</button><button type="button" data-papel="equipe" aria-pressed="false">Sou da equipe</button></div>
      <label class="campo" for="ar-cpf"><span>CPF</span><input id="ar-cpf" name="cpf" inputmode="numeric" autocomplete="username" required maxlength="14" placeholder="000.000.000-00" value="${C.area.login.cpf}"></label>
      <label class="campo" for="ar-senha"><span>Senha</span><input id="ar-senha" name="senha" type="password" autocomplete="current-password" required value="${C.area.login.senha}"></label>
      <p class="form-erro" data-erro role="alert"></p>
      ${btnBotao('Entrar', { attrs: ' type="submit"' })}
      <p class="area-demo">Demonstração: o CPF e a senha da paciente de exemplo já estão preenchidos. É só entrar.</p>
    </form>
    <form class="area-form" data-login-pro novalidate hidden>
      ${migalhas([[`${B}index.html`, 'Início'], ['', 'Área da equipe']])}
      <p class="apoio">Área da equipe</p>
      ${titulo('Seus pacientes, as triagens e os planos alimentares.', 'h1')}
      <div class="papel-abas" role="group" aria-label="Quem está entrando" data-iguais><button type="button" data-papel="paciente" aria-pressed="false">Sou paciente</button><button type="button" data-papel="equipe" aria-pressed="true">Sou da equipe</button></div>
      <label class="campo" for="pro-quem"><span>Nutricionista</span><select id="pro-quem" name="prof">${C.equipe.map((p) => `<option value="${p.id}">${p.nome}, ${p.crn}</option>`).join('')}</select></label>
      <label class="campo" for="pro-senha"><span>Senha</span><input id="pro-senha" name="senha" type="password" autocomplete="current-password" required value="${C.equipeArea.senha}"></label>
      <p class="form-erro" data-erro role="alert"></p>
      ${btnBotao('Entrar na área da equipe', { attrs: ' type="submit"' })}
      <p class="area-demo">Demonstração: a senha já está preenchida. Cada nutricionista vê só os próprios pacientes.</p>
    </form>
  </div>
  <div class="painel painel-pro" data-painel-pro hidden>
    <div class="largo">
      <div class="painel-cab">
        <div><p class="apoio" data-pro-ola>Olá</p><h1 class="tit-painel">Seus pacientes</h1><p data-pro-sub></p></div>
        <button type="button" class="link painel-sair" data-sair-pro>${I.sair}Sair</button>
      </div>
      <div class="pro-grade">
        <aside class="pro-lista" aria-label="Lista de pacientes">
          <label class="blog-busca" for="pro-busca">${I.lupa}<span class="sr">Buscar paciente</span><input id="pro-busca" type="search" placeholder="Buscar paciente" autocomplete="off"></label>
          <ul class="pro-pacientes" data-pro-pacientes></ul>
          <button type="button" class="link-seta" data-pro-novo aria-expanded="false" aria-controls="pro-novo-form">${I.mais}Novo paciente</button>
          <form class="pro-novo" id="pro-novo-form" data-pro-novo-form hidden novalidate>
            <label class="campo" for="pn-nome"><span>Nome completo</span><input id="pn-nome" name="nome" required minlength="3" autocomplete="off"></label>
            <label class="campo" for="pn-cat"><span>Categoria do plano</span><select id="pn-cat" name="categoria">${C.equipeArea.categorias.map((c) => `<option value="${c.id}">${c.nome}</option>`).join('')}</select></label>
            ${btnBotao('Criar com o modelo da categoria', { ic: I.mais, attrs: ' type="submit"' })}
          </form>
        </aside>
        <section class="pro-ficha" data-pro-ficha aria-live="polite"></section>
      </div>
    </div>
  </div>
  <div class="painel" data-painel hidden>
    <div class="largo">
      <div class="painel-cab">
        <div><p class="apoio">Olá, ${C.area.paciente.curto}</p><h1 class="tit-painel">${C.area.paciente.programa}</h1><p>Com ${EQ[C.area.paciente.prof].nome} desde ${dataBr(C.area.paciente.inicio)}.</p></div>
        <button type="button" class="link painel-sair" data-sair>${I.sair}Sair</button>
      </div>
      <div class="painel-abas" role="tablist" aria-label="Seções da área do cliente" data-iguais>${[['resumo', 'Resumo'], ['plano', 'Plano alimentar'], ['evolucao', 'Evolução'], ['diario', 'Diário'], ['compras', 'Lista de compras'], ['docs', 'Documentos']].map(([id, t], k) => `<button type="button" role="tab" id="pa-${id}" aria-controls="pp-${id}" aria-selected="${k === 0}" tabindex="${k ? -1 : 0}">${t}</button>`).join('')}</div>
      <div class="painel-corpo">
        <section class="pp" id="pp-resumo" role="tabpanel" aria-labelledby="pa-resumo">
          <div class="pp-grade">
            <div class="pp-cartao pp-consulta"><h2>Próxima consulta</h2><div data-consultas></div><a class="link-seta" href="${B}index.html#agendar">Marcar outro horário ${I.seta}</a></div>
            <div class="pp-cartao"><h2>Metas da semana</h2><ul class="metas" data-metas>${C.area.metas.map((m, k) => `<li><label><input type="checkbox" data-meta="${k}"><span>${esc(m)}</span></label></li>`).join('')}</ul></div>
            <div class="pp-cartao pp-agua"><h2>Água de hoje</h2><p class="agua-conta"><b data-agua-n>0</b> de 8 copos</p><div class="copos" data-copos>${Array.from({ length: 8 }, (_, k) => `<button type="button" aria-label="Copo ${k + 1}" aria-pressed="false" data-copo="${k}">${I.copo}</button>`).join('')}</div></div>
          </div>
        </section>
        <section class="pp" id="pp-plano" role="tabpanel" aria-labelledby="pa-plano" hidden>
          <div class="pp-plano-cab"><p class="pp-intro">Escolha uma opção em cada refeição. As quantidades estão no app e mudam conforme a fome do dia.</p>${btnBotao('Baixar meu plano em PDF', { ic: I.baixar, attrs: ' type="button" data-pdf-paciente' })}</div>
          <ol class="refeicoes" data-plano-paciente></ol>
          <div class="pp-orient" data-orient-paciente></div>
        </section>
        <section class="pp" id="pp-evolucao" role="tabpanel" aria-labelledby="pa-evolucao" hidden>
          <div class="evo-filtros" role="group" aria-label="Medida no gráfico" data-iguais><button type="button" data-evo="cintura" aria-pressed="true">Cintura (cm)</button><button type="button" data-evo="musculo" aria-pressed="false">Massa muscular (kg)</button><button type="button" data-evo="energia" aria-pressed="false">Energia (1 a 5)</button></div>
          <figure class="evo-grafico"><svg data-grafico viewBox="0 0 600 260" role="img" aria-label="Gráfico da evolução"></svg><figcaption data-grafico-leg></figcaption></figure>
          <p class="pp-intro">O gráfico mostra as medidas das consultas. Peso não é a única nem a principal medida do acompanhamento.</p>
        </section>
        <section class="pp" id="pp-diario" role="tabpanel" aria-labelledby="pa-diario" hidden>
          <form class="diario-form" data-diario novalidate>
            <label class="campo" for="di-ref"><span>Refeição</span><select id="di-ref" name="ref">${C.area.plano.map((r) => `<option>${r.refeicao}</option>`).join('')}</select></label>
            <label class="campo campo-largo" for="di-txt"><span>O que comi</span><input id="di-txt" name="txt" required maxlength="160"></label>
            <fieldset class="fome"><legend>Fome antes de comer</legend><div data-iguais>${['Pouca', 'Média', 'Muita'].map((f, k) => `<label><input type="radio" name="fome" value="${f}"${k === 1 ? ' checked' : ''}><span>${f}</span></label>`).join('')}</div></fieldset>
            ${btnBotao('Anotar no diário', { ic: I.mais, attrs: ' type="submit"' })}
          </form>
          <ul class="diario-lista" data-diario-lista></ul>
        </section>
        <section class="pp" id="pp-compras" role="tabpanel" aria-labelledby="pa-compras" hidden>
          <ul class="compras" data-compras>${C.area.compras.map((c, k) => `<li><label><input type="checkbox" data-compra="${k}"><span>${esc(c)}</span></label></li>`).join('')}</ul>
          <a class="link-seta" href="${wa('Lista de compras da semana: ' + C.area.compras.join(', '))}" target="_blank" rel="noopener">Mandar a lista para o meu WhatsApp ${I.seta}</a>
        </section>
        <section class="pp" id="pp-docs" role="tabpanel" aria-labelledby="pa-docs" hidden>
          <ul class="docs">${C.area.documentos.map((d) => `<li><span><b>${esc(d.nome)}</b><small>${dataBr(d.data)}</small></span><button type="button" class="link" data-demo>${I.baixar}Baixar PDF</button></li>`).join('')}</ul>
          <p class="pp-intro">Recibos e relatórios trazem CPF, CRN e o código do procedimento para o pedido de reembolso.</p>
        </section>
      </div>
    </div>
  </div>
</section>`;

// ===================== DADOS PARA O NAVEGADOR =====================
const dadosBase = () => ({
  whats: M.whatsapp.replace(/\D/g, ''),
  marca: M.completo,
  equipe: C.equipe.map(({ id, nome, curto, papel, crn, agenda }) => ({ id, nome, curto, papel, crn, agenda })),
  servicos: C.servicos.map(({ id, nome, seg, dur, preco, aPartir, profs, online }) => ({ id, nome, seg, dur, preco, aPartir: !!aPartir, profs, online })),
});

// ===================== SEO LOCAL (JSON-LD) =====================
const ID = `${M.dominio}/#clinica`;
const clinicaLd = {
  '@type': ['MedicalClinic', 'LocalBusiness'],
  '@id': ID,
  name: M.completo,
  legalName: M.razao,
  url: `${M.dominio}/`,
  image: `${M.dominio}/assets/img/bruna-sala.webp`,
  logo: `${M.dominio}/assets/favicon.svg`,
  telephone: `+55${tel}`,
  email: M.email,
  priceRange: 'R$ 120 a R$ 1.390',
  medicalSpecialty: 'DietNutrition',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.geo.lat, longitude: M.geo.lon },
  hasMap: mapsUrl,
  areaServed: [...C.bairros.slice(0, -1).map((b) => ({ '@type': 'Place', name: `${b}, ${M.cidade}` })), { '@type': 'Country', name: 'Brasil' }],
  openingHoursSpecification: C.horarioLd.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.dias, opens: h.abre, closes: h.fecha })),
  paymentAccepted: 'Pix, cartão de débito, cartão de crédito',
  currenciesAccepted: 'BRL',
  sameAs: [instaUrl, M.facebook, M.youtube],
  employee: C.equipe.map((p) => ({ '@id': `${M.dominio}/equipe.html#${p.id}` })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Consultas e programas',
    itemListElement: C.servicos.map((s) => ({ '@type': 'Offer', price: s.preco, priceCurrency: 'BRL', itemOffered: { '@type': 'Service', name: s.nome, description: s.inclui.join('; ') } })),
  },
};
const pessoaLd = (p) => ({ '@type': 'Person', '@id': `${M.dominio}/equipe.html#${p.id}`, name: p.nome, jobTitle: 'Nutricionista', description: p.papel, image: `${M.dominio}/assets/img/${p.foto}.webp`, worksFor: { '@id': ID }, knowsAbout: p.especialidades, identifier: p.crn });
const faqLd = (lista) => ({ '@type': 'FAQPage', mainEntity: lista.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) });
const migalhasLd = (itens) => ({ '@type': 'BreadcrumbList', itemListElement: itens.map(([n, u], k) => ({ '@type': 'ListItem', position: k + 1, name: n, item: `${M.dominio}/${u}` })) });
const ld = (...g) => JSON.stringify({ '@context': 'https://schema.org', '@graph': g }).replace(/</g, '\\u003c');

// ===================== MONTAGEM DAS PÁGINAS =====================
const headIntro = `<script>try{var h=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r&&!sessionStorage.getItem("${CHAVE}-intro"))h.classList.add("intro");if(!r&&sessionStorage.getItem("${CHAVE}-nav")){h.classList.add("chegando");sessionStorage.removeItem("${CHAVE}-nav")}}catch(e){}</script>`;
const publicas = [];

const pagina = ({ arquivo, pg, titulo: t, descricao, corpo, ldJson = '', dados = {}, indexar = true, ogImg = 'bruna-retrato', tipoOg = 'website' }) => {
  B = arquivo.includes('/') ? '../' : '';
  paginaAtual = pg;
  const url = `${M.dominio}/${arquivo === 'index.html' ? '' : arquivo.replace(/index\.html$/, '')}`;
  if (indexar) publicas.push(arquivo);
  const conteudo = corpo();
  const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(descricao)}">
${indexar ? `<link rel="canonical" href="${url}">\n<link rel="alternate" hreflang="pt-BR" href="${url}">` : '<meta name="robots" content="noindex, nofollow">'}
<meta property="og:type" content="${tipoOg}"><meta property="og:site_name" content="${M.completo}"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${M.dominio}/assets/img/${ogImg}.webp"><meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="BR-${M.uf}"><meta name="geo.placename" content="${M.cidade}"><meta name="geo.position" content="${M.geo.lat};${M.geo.lon}"><meta name="ICBM" content="${M.geo.lat}, ${M.geo.lon}">
<meta name="theme-color" content="${COR_CLARO}">
${T.head(`${CHAVE}-tema`)}
${headIntro}
<link rel="icon" href="${B}assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="${B}assets/site.css">
${ldJson ? `<script type="application/ld+json">${ldJson}</script>` : ''}
</head>
<body class="pg-${pg}">
${abertura}
${cortina}
${cursor}
${topo()}
<main id="conteudo">
${conteudo}
</main>
${rodape()}
${T.pilula('tema-lado', 'claro')}
${janelas()}
<script type="application/json" id="dados">${JSON.stringify({ ...dadosBase(), ...dados }).replace(/</g, '\\u003c')}</script>
<script src="${B}assets/site.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, arquivo), html);
};

pagina({
  arquivo: 'index.html', pg: 'inicio',
  titulo: `Nutricionista em ${M.cidade} | ${EQ.bruna.nome}, ${M.completo}`,
  descricao: `Nutricionista em ${M.cidade}, na ${M.bairro}: emagrecimento sem dieta restritiva, nutrição esportiva, gestação e infância, saúde intestinal e da mulher. Agendamento online, convênios e consultas online.`,
  corpo: () => [capa(), sobre(), metodo(), servicos(), bastidores(), tour(), equipeLeque(), agendar(), convenios(), avaliacoes(), blogHome(), galeria(), instagram(), duvidas(), politicas(), contato()].join('\n'),
  ldJson: ld(clinicaLd, { '@type': 'WebSite', '@id': `${M.dominio}/#site`, url: `${M.dominio}/`, name: M.completo, inLanguage: 'pt-BR', publisher: { '@id': ID } }, ...C.equipe.map(pessoaLd), faqLd(C.faq)),
  // src() registra a foto para ser copiada: o tour pede as salas pelo JavaScript, não pelo HTML
  dados: { tour: C.tour.map((t) => ({ ...t, src: src(t.foto), alt: C.fotos[t.foto] })), convenios: C.convenios },
});

pagina({
  arquivo: 'equipe.html', pg: 'equipe',
  titulo: `Equipe de nutricionistas em ${M.cidade} | ${M.completo}`,
  descricao: `Conheça as nutricionistas da ${M.completo} em ${M.cidade}: comportamento e emagrecimento, esporte, gestação e infância, intestino e saúde da mulher. Agenda e formação de cada uma.`,
  corpo: pgEquipe, ogImg: 'bruna-sala',
  ldJson: ld(migalhasLd([['Início', ''], ['Equipe', 'equipe.html']]), ...C.equipe.map(pessoaLd)),
});

for (const s of C.segmentos.filter((x) => x.pagina)) {
  const arq = `especialidades/${s.pagina}.html`;
  pagina({
    arquivo: arq, pg: 'especialidade',
    titulo: `${s.termo} | ${M.completo}`,
    descricao: `${s.termo}, na ${M.bairro} e online. ${s.texto}`.slice(0, 158),
    corpo: () => pgEspecialidade(s), ogImg: s.foto,
    ldJson: ld(
      migalhasLd([['Início', ''], ['Especialidades', '#servicos'], [s.nome, arq]]),
      { '@type': 'Service', name: s.termo, serviceType: s.nome, provider: { '@id': ID }, areaServed: { '@type': 'City', name: M.cidade }, availableChannel: { '@type': 'ServiceChannel', serviceLocation: { '@id': ID } }, offers: servicosDo(s.id).map((v) => ({ '@type': 'Offer', name: v.nome, price: v.preco, priceCurrency: 'BRL' })) },
      faqLd(s.faq),
    ),
  });
}

pagina({
  arquivo: 'blog/index.html', pg: 'blog',
  titulo: `Blog de nutrição | ${M.completo}, ${M.cidade}`,
  descricao: 'Artigos da equipe da Salvi Nutrição sobre comportamento alimentar, nutrição esportiva, introdução alimentar, saúde intestinal e cozinha do dia a dia.',
  corpo: pgBlog, ogImg: 'cafe-manha',
  ldJson: ld(migalhasLd([['Início', ''], ['Blog', 'blog/']]), { '@type': 'Blog', name: `Blog da ${M.completo}`, url: `${M.dominio}/blog/`, publisher: { '@id': ID }, blogPost: C.blog.map((p) => ({ '@type': 'BlogPosting', headline: p.titulo, url: `${M.dominio}/blog/${p.slug}.html`, datePublished: p.data })) }),
});
for (const p of C.blog) {
  const arq = `blog/${p.slug}.html`;
  pagina({
    arquivo: arq, pg: 'post', tipoOg: 'article',
    titulo: `${p.titulo} | Blog ${M.completo}`,
    descricao: p.resumo,
    corpo: () => pgPost(p), ogImg: p.foto,
    ldJson: ld(
      migalhasLd([['Início', ''], ['Blog', 'blog/'], [p.titulo, arq]]),
      { '@type': 'BlogPosting', headline: p.titulo, description: p.resumo, image: `${M.dominio}/assets/img/${p.foto}.webp`, datePublished: p.data, dateModified: p.data, inLanguage: 'pt-BR', articleSection: p.cat, author: { '@id': `${M.dominio}/equipe.html#${p.autor}` }, publisher: { '@id': ID }, mainEntityOfPage: `${M.dominio}/${arq}` },
    ),
  });
}

pagina({
  arquivo: 'area-cliente.html', pg: 'area', indexar: false,
  titulo: `Área do cliente e da equipe | ${M.completo}`,
  descricao: 'Plano alimentar, consultas, evolução, diário e recibos dos pacientes da Salvi Nutrição.',
  corpo: pgArea,
  // a área da equipe precisa dos modelos, dos pacientes e dos dados legais que vão no rodapé do PDF
  dados: { area: C.area, equipeArea: C.equipeArea, legal: { razao: M.razao, cnpj: M.cnpj, endereco, telefone: M.telefone, whatsapp: M.whatsapp } },
});

// ---------- 404: arquivo único com o CSS dentro, funciona em qualquer endereço ----------
// O zero do "404" é um prato vazio, com a folha da marca caindo devagar até ele.
const prato404 = '<svg class="prato" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--tinta)" stroke-width="8"/><circle cx="60" cy="60" r="34" fill="none" stroke="var(--tinta)" stroke-width="2" opacity=".35"/><g class="folha404"><path d="M44 74c2-15 11-27 30-32-2 18-12 28-30 32Z" fill="var(--acento)"/><path d="M45 73c7-9 15-17 24-25" stroke="var(--fundo)" stroke-width="2" stroke-linecap="round"/></g></svg>';
const css404 = `:root{--fundo:#F4EEE4;--tinta:#22301F;--texto:#56604F;--acento:#D9643A;color-scheme:light}
[data-tema="escuro"]{--fundo:#121712;--tinta:#EFE8DA;--texto:#B7B9A8;--acento:#EE7B4C;color-scheme:dark}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;display:grid;place-items:center;padding:32px 16px;background:var(--fundo);color:var(--texto);font:400 17px/1.6 "Be Vietnam Pro",Georgia,serif;text-align:center}
.c404{width:min(660px,100%);display:grid;justify-items:center;gap:18px}
.logo{display:inline-flex;align-items:center;gap:10px;color:var(--tinta);text-decoration:none;font:400 28px "Young Serif",Georgia,serif}
.logo svg{width:36px;height:36px;--nervura:var(--fundo);--folha:var(--acento)}
.num{display:flex;align-items:center;gap:8px;font:400 clamp(100px,24vw,200px)/1 "Young Serif",Georgia,serif;color:var(--tinta)}
.prato{width:.9em;height:.9em}
.folha404{animation:cai 4s ease-in-out infinite;transform-origin:60px 60px}
@keyframes cai{0%{transform:translate(18px,-40px) rotate(-30deg);opacity:0}30%{opacity:1}70%,100%{transform:none;opacity:1}}
.apoio{color:var(--acento);font-weight:600;font-size:13px;letter-spacing:.14em;text-transform:uppercase}
h1{font:400 clamp(30px,5vw,46px)/1.1 "Young Serif",Georgia,serif;color:var(--tinta)}
.acoes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:min(460px,100%);margin-top:8px}
.acoes a{display:flex;align-items:center;justify-content:center;min-height:54px;padding:0 18px;border-radius:14px;text-decoration:none;font-weight:600;background:var(--tinta);color:var(--fundo);transition:transform .3s}
.acoes a+a{background:#1F8A4C;color:#fff}
.acoes a:hover{transform:translateY(-3px)}
.atalhos{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px;font-size:15px}
.atalhos a{color:var(--tinta)}
@media (max-width:420px){.acoes{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.folha404{animation:none}}`;
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
${T.head(`${CHAVE}-tema`)}
${fontes}
<style>${css404}</style>
</head>
<body>
<main class="c404">
  <a class="logo" href="/">${I.simbolo()}${M.nome}</a>
  <p class="num" aria-label="404"><span>4</span>${prato404}<span>4</span></p>
  <p class="apoio">Erro 404</p>
  <h1>Este prato ficou vazio</h1>
  <p>A página que você procurou não existe ou mudou de endereço. Volte ao início ou siga por um dos atalhos.</p>
  <div class="acoes"><a href="/">Voltar ao início</a><a href="${wa(`Olá, ${M.completo}! Cheguei numa página que não existe no site.`)}" target="_blank" rel="noopener">WhatsApp</a></div>
  <p class="atalhos"><a href="/#agendar">Agendar</a><a href="/equipe.html">Equipe</a><a href="/blog/index.html">Blog</a><a href="/#convenios">Convênios</a><a href="/area-cliente.html">Área do cliente</a></p>
</main>
</body>
</html>
`);

// ---------- arquivos de apoio ----------
for (const nome of medidas.keys()) fs.copyFileSync(path.join(FOTOS, `${nome}.webp`), path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_trindade.webp'), path.join(OUT, 'assets', 'img', 'mapa_trindade.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(`${CHAVE}-tema`, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /area-cliente.html\nSitemap: ${M.dominio}/sitemap.xml\n`);
const lastmod = (a) => (a.startsWith('blog/') && a !== 'blog/index.html' ? C.blog.find((p) => a === `blog/${p.slug}.html`).data : HOJE);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicas.map((a) => `  <url><loc>${M.dominio}/${a === 'index.html' ? '' : a.replace(/index\.html$/, '')}</loc><lastmod>${lastmod(a)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`ok: ${OUT} (${publicas.length + 2} páginas, ${medidas.size} fotos)`);
