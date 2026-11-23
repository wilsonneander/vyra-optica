// Gera o Bronze do salão (Mecha Salão, marca fictícia) em "templates/Salões de Beleza/bronze/".
// Página única, enxuta, no desenho da referência pedida (Stylicle): capa ameixa com foto e barra de agendamento,
// faixa de atalhos com ícones, galeria fixa em mosaico, lista de serviços e preços, avaliação em cartão ameixa,
// políticas e higiene, cartão de agendamento com foto (no lugar da newsletter) e rodapé ameixa com mapa.
// Uso: node "templates/Salões de Beleza/_build-bronze/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const CHAVE_TEMA = 'mecha-salao-bronze-tema';
const COR_CLARO = '#42293C', COR_ESCURO = '#1C1119';

const OUT = path.join(__dirname, '..', 'bronze');
const GOLD_IMG = path.join(__dirname, '..', '_build-gold', 'img');
const PASTAS = [path.join(GOLD_IMG, 'fotos')];
const M = C.marca;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.endereco}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const tel = M.telefone.replace(/\D/g, '');
const nota = String(M.nota).replace('.', ',');
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const todos = C.grupos.flatMap((g) => g.servicos);

// ---------- fotos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Map();
const acha = (nome) => PASTAS.map((p) => path.join(p, `${nome}.webp`)).find((f) => fs.existsSync(f));
const foto = (nome, { cls = '', lazy = true, alt, attrs = '' } = {}) => {
  const arq = acha(nome);
  if (!arq) console.warn('Foto faltando:', nome);
  usadas.set(nome, arq);
  const desc = alt ?? C.fotos[nome] ?? '';
  return `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${attrs}>`;
};

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Prata&family=Albert+Sans:wght@400;500;600&display=swap" rel="stylesheet">';

// ---------- dados para o navegador ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura,
  servicos: todos.map(({ id, nome, min, preco, de, quimica }) => ({ id, nome, min, preco, de: !!de, quimica: !!quimica })),
};
const opcoes = C.grupos.map((g) => `<optgroup label="${esc(g.nome)}">${g.servicos.map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join('')}</optgroup>`).join('');

// ---------- topo ----------
const nav = [['servicos', 'Serviços e preços'], ['galeria', 'Galeria'], ['avaliacoes', 'Avaliações'], ['politicas', 'Políticas'], ['contato', 'Contato']];
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="largo topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}
      <div class="menu-tema">${T.pilula('deitada', 'claro')}</div>
    </nav>
    <div class="topo-acoes">
      <a class="btn btn-linha btn-p topo-tel" href="tel:${tel}">${I.telefone}<span>Ligar</span></a>
      <a class="btn btn-ameixa btn-p" href="#agendar">Agendar</a>
      <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>`;

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <figure class="capa-foto">${foto('depois-escova', { lazy: false, attrs: ' width="1400" height="933"' })}</figure>
  <div class="largo capa-in">
    <p class="capa-apoio">${I.simbolo()}<span>Corte, escova, cor e tratamentos na ${M.bairro}</span></p>
    <h1>Cabelo bem cuidado, <em>pertinho de você.</em></h1>
    <p class="capa-txt">Salão com hora marcada, preço combinado antes de começar e teste de mecha antes de qualquer química.</p>
    <form class="barra" id="form-rapido" novalidate>
      <label><span>Serviço</span><select name="servico" aria-label="Serviço"><option value="">O que vamos fazer?</option>${opcoes}</select></label>
      <label><span>Melhor dia</span><input name="data" type="date" aria-label="Melhor dia"></label>
      <button class="btn btn-rosa" type="submit">${I.whats}<span>Agendar</span></button>
    </form>
    <p class="capa-nota">${estrelas}<b>${nota}</b><span>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></p>
  </div>
</section>`;

// ---------- atalhos de serviço ----------
const atalhos = `<nav class="atalhos" aria-label="Atalhos para os serviços">
  <div class="largo atalhos-in">
    ${C.atalhos.map((a) => `<a class="atalho" href="#s-${a.alvo}"><span class="atalho-ic">${I[a.icone]}</span><span>${a.nome}</span></a>`).join('\n    ')}
  </div>
</nav>`;

// ---------- galeria fixa ----------
const galeria = `<section class="galeria" id="galeria">
  <div class="largo">
    <div class="cab cab-centro rev">
      <h2>Feito aqui, cadeira por cadeira</h2>
      <p>Trabalhos das nossas cabeleireiras, sem filtro e com autorização das clientes.</p>
    </div>
    <div class="mosaico">
      ${C.galeria.map((g, k) => `<figure class="mos mos-${k ? 'p' : 'alta'} rev">${foto(g.foto)}<figcaption>${esc(g.legenda)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- serviços e preços ----------
const servicos = `<section class="servicos" id="servicos">
  <div class="largo">
    <div class="cab cab-centro rev">
      <p class="apoio">Serviços e preços</p>
      <h2>Preço na mesa antes de começar</h2>
      <p>O que inclui, quanto tempo leva e quanto custa. Toque em agendar e o formulário já vem com o serviço escolhido.</p>
    </div>
    <div class="grupos">
      ${C.grupos.map((g) => `<article class="grupo rev" id="g-${g.id}">
        <h3>${esc(g.nome)}</h3>
        <ul>
          ${g.servicos.map((s) => `<li class="serv${s.destaque ? ' destaque' : ''}" id="s-${s.id}">
            <div class="serv-txt"><h4>${esc(s.nome)}${s.destaque ? '<small>o mais pedido</small>' : ''}</h4><p>${esc(s.inclui)}</p>${s.quimica ? '<p class="serv-q">Teste de mecha 48h antes</p>' : ''}</div>
            <div class="serv-preco"><b>${s.de ? '<small>a partir de</small>' : ''}${reais(s.preco)}</b><span>${minutos(s.min)}</span><a href="#agendar" data-servico="${s.id}">Agendar</a></div>
          </li>`).join('\n          ')}
        </ul>
      </article>`).join('\n      ')}
    </div>
    <dl class="condicoes rev">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Remarcação</dt><dd>Sem custo até 24 horas antes. <a href="#politicas">Ver todas as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- avaliações ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo">
    <div class="cab cab-centro rev">
      <p class="apoio">Avaliações</p>
      <h2>O que dizem as clientes</h2>
    </div>
    <div class="aval-cartao rev" aria-roledescription="carrossel" aria-label="Avaliações de clientes">
      <div class="aval-arte" aria-hidden="true">
        <i class="arco a1"></i><i class="arco a2"></i>
        <div class="aval-fotos">${C.depoimentos.map((d, k) => foto(d.foto, { alt: '', cls: k ? '' : 'on' })).join('')}</div>
      </div>
      <div class="aval-textos" aria-live="polite">
        ${C.depoimentos.map((d, k) => `<figure class="aval${k ? '' : ' on'}"${k ? ' hidden' : ''}>
          ${I.aspas}
          <figcaption><b>${esc(d.nome)}</b><span>${esc(d.bairro)}, ${esc(d.serv)}</span></figcaption>
          <h3>${esc(d.titulo)}</h3>
          <blockquote><p>“${esc(d.texto)}”</p></blockquote>
        </figure>`).join('\n        ')}
      </div>
    </div>
    <div class="aval-nav">
      <button type="button" class="seta-btn" data-aval="-1" aria-label="Avaliação anterior">${I.esquerda}</button>
      <p class="aval-google">${estrelas}<span><b>${nota}</b> de 5 em ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></p>
      <button type="button" class="seta-btn cheia" data-aval="1" aria-label="Próxima avaliação">${I.direita}</button>
    </div>
  </div>
</section>`;

// ---------- políticas e higiene ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="largo pol-in">
    <div class="pol-lista rev">
      <p class="apoio">Políticas da casa</p>
      <h2>Regras claras, combinadas antes da capa</h2>
      ${C.politicas.map((p, k) => `<details class="pol${p.destaque ? ' destaque' : ''}"${k === 0 || p.destaque ? ' open' : ''}>
        <summary><span>${esc(p.titulo)}${p.destaque ? '<small>Atenção</small>' : ''}</span><i aria-hidden="true">${I.mais}</i></summary>
        <p>${esc(p.texto)}</p>
      </details>`).join('\n      ')}
    </div>
    <aside class="higiene rev">
      <h3>Higiene e produtos</h3>
      <ul>${C.higiene.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="nota-juridica">Textos de políticas e higiene a validar na revisão jurídica antes da publicação.</p>
    </aside>
  </div>
</section>`;

// ---------- agendamento (cartão com foto, no lugar da newsletter da referência) ----------
const agendar = `<section class="agendar" id="agendar">
  <div class="largo">
    <div class="ag-cartao rev">
      <figure class="ag-foto">${foto('escova')}<figcaption><b>Confirmação em até 1 hora</b><span>no horário de funcionamento</span></figcaption></figure>
      <form class="form" id="form-agenda" novalidate>
        <h2>Agende seu horário</h2>
        <p class="form-intro">Preencha e o pedido segue pronto pelo WhatsApp. Campos com * são obrigatórios.</p>
        <div class="campos">
          <label><span>Nome *</span><input name="nome" autocomplete="name" required placeholder="Seu nome"></label>
          <label><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(11) 90000-0000"></label>
          <label class="larga"><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></label>
          <label><span>Serviço *</span><select name="servico" required><option value="">Escolha</option>${opcoes}</select></label>
          <label><span>Dia *</span><input name="data" type="date" required></label>
          <fieldset class="larga periodo"><legend>Período *</legend>
            <div class="periodos" data-iguais>${['Manhã', 'Tarde', 'Noite'].map((p) => `<label><input type="radio" name="periodo" value="${p.toLowerCase()}"${p === 'Manhã' ? ' required' : ''}><span>${p}</span></label>`).join('')}</div>
          </fieldset>
          <label class="larga"><span>Algo que devemos saber?</span><textarea name="obs" rows="2" placeholder="O resultado que você quer, alergias, química recente"></textarea></label>
        </div>
        <p class="form-aviso" data-aviso-quimica hidden>Este serviço pede teste de mecha e de sensibilidade 48 horas antes para quem nunca fez aqui. Combinamos o teste na confirmação.</p>
        <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso do meu nome, telefone e e-mail só para responder a este pedido. *</span></label>
        <label class="aceite"><input type="checkbox" name="novidades"><span>Quero receber lembretes e novidades pelo WhatsApp. Posso cancelar quando quiser.</span></label>
        <p class="form-erro" role="alert" hidden></p>
        <button class="btn btn-ameixa" type="submit">${I.whats}<span>Enviar pedido pelo WhatsApp</span></button>
        <div class="form-ok" role="status" hidden></div>
      </form>
    </div>
  </div>
</section>`;

// ---------- rodapé ----------
const creditos = JSON.parse(fs.readFileSync(path.join(GOLD_IMG, 'creditos.json'), 'utf8'));
const dias = C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const redes = `<div class="redes">
      <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
      <a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>
      <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
    </div>`;
const rodape = `<footer class="rodape" id="contato">
  <div class="largo">
    <div class="rod-topo"><a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>${redes}</div>
    <div class="rod-cols">
      <div><h3>Navegue</h3><ul>${[['inicio', 'Início'], ...nav, ['agendar', 'Agendar horário']].map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${tel}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li><a href="#agendar">Agendamento online</a></li></ul></div>
      <div><h3>Onde estamos</h3><ul><li>${M.endereco}</li><li>${M.bairro}, ${M.cidade}, ${M.uf}</li><li>CEP ${M.cep}</li></ul></div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_vila-madalena.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização do ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioCurto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só no salão, com hora marcada. Clientes destes bairros chegam a pé ou em poucos minutos.</p>
        <ul class="bairros">${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário de funcionamento</caption>${dias}</table>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b> (${M.casa}), CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}. WhatsApp ${M.whatsappTexto}. ${M.email}.</p>
      <p>Atendimento pelo WhatsApp, telefone, e-mail e formulário do site, no horário de funcionamento. Material esterilizado em autoclave ou descartável. Produtos com registro ou notificação na Anvisa.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a>` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
  <div class="rod-fim"><div class="largo"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div></div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site do ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;

// ---------- janelas legais e cookies ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação do ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. Serviços com valor "a partir de" dependem do comprimento e do volume do cabelo, e o valor é fechado no diagnóstico, antes de começar. Nenhum valor é alterado sem o seu aceite. ${esc(C.pagamento)}</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Cor e alinhamento pedem sinal de 30% via Pix, que vira crédito para nova data em até 60 dias quando o aviso vem com menos de 24 horas. Duas faltas sem aviso pedem sinal em todos os agendamentos seguintes.</p>
    <h3>Coloração e química</h3><p>Teste de mecha e de sensibilidade obrigatório, com 48 horas de antecedência para quem nunca fez o serviço aqui. A profissional pode recusar ou adiar o serviço quando o fio ou o couro cabeludo não estiverem em condições, explicando o motivo. Informe alergias, gestação, medicamentos e química feita fora do salão.</p>
    <h3>Garantia</h3><p>Corte e escova: ajuste sem custo em até 7 dias. Cor: retoque de tom sem custo em até 15 dias, seguindo os cuidados indicados. A garantia não cobre mudança de ideia sobre o resultado combinado nem processos feitos fora do salão.</p>
    <h3>Higiene</h3><p>Material esterilizado em autoclave ou descartável e produtos com registro ou notificação na Anvisa. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços do ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos, marcas e imagens pertencem à ${M.nome} ou a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário envia o pedido pelo WhatsApp. O horário só vale depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, redes sociais e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, serviço, dia, período e observações que você escreve no formulário. Alergias e informações de saúde são dados sensíveis e só são usadas para a sua segurança no atendimento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar o horário e registrar o serviço feito, como a fórmula da cor. Novidades e promoções só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com o salão e pelo prazo legal depois dela.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados, e revogar consentimentos, pelo e-mail ${M.email}. Encarregado de dados: ${M.razao}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador apenas a sua escolha sobre cookies e o tema claro ou escuro. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-ameixa" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- SEO local ----------
const precos = todos.map((s) => s.preco);
const ld = {
  '@context': 'https://schema.org', '@type': 'HairSalon', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/depois-escova.webp`, telephone: M.telefone, email: M.email, priceRange: `R$ ${Math.min(...precos)} a R$ ${Math.max(...precos)}`,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.5564, longitude: -46.6893 },
  openingHoursSpecification: Object.entries(C.abertura).filter(([, h]) => h).map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: `${String(h[0]).padStart(2, '0')}:00`, closes: `${String(h[1]).padStart(2, '0')}:00` })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [M.instagram, M.facebook, M.linkedin],
};
const titulo = `${M.completo} | Salão de beleza na ${M.bairro}, ${M.cidade}`;
const descricao = `Salão de beleza com hora marcada na ${M.bairro}: corte feminino, escova, coloração, mechas, hidratação e alinhamento sem formol. Preços claros e agendamento pelo WhatsApp.`;

const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/depois-escova.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="${COR_CLARO}">
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${topo}
<main id="conteudo">
${capa}
${atalhos}
${galeria}
${servicos}
${avaliacoes}
${politicas}
${agendar}
</main>
${rodape}
${T.pilula('tema-lado', 'claro')}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados)}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

// ---------- grava ----------
for (const [nome, arq] of usadas) if (arq) fs.copyFileSync(arq, path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(GOLD_IMG, 'mapa_vila-madalena.webp'), path.join(OUT, 'assets', 'img', 'mapa_vila-madalena.webp'));
const favicon = I.favicon.replace('fill="#1F1B18"', `fill="${COR_CLARO}"`).replace('stroke="#C9A27F"', 'stroke="#EBC3D6"');
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${M.dominio}/</loc></url></urlset>\n`);
console.log(`ok: ${OUT} (${usadas.size} fotos)`);
