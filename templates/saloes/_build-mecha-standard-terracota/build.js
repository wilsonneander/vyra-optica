// Gera o Silver do salão (Mecha Salão, marca fictícia) em templates/saloes/standard/mecha-standard-terracota/.
// Desenho baseado na referência pedida (Elysia, feita no Framer): topo escuro, capa com foto inteira e título serifado,
// serviços em cartões por segmento com menu preso ao lado, tendências em grade desencontrada, seção escura de motivos
// com a garantia, equipe em carrossel, antes e depois, avaliações correndo, Instagram, produtos, bom saber,
// políticas, dúvidas e agendamento com serviço, profissional, dia e horário. Mais as páginas da equipe e da galeria
// e a Área do cliente (entrar, criar conta e painel para cadastrar serviços, produtos, equipe e dados da empresa).
// Uso: node templates/saloes/_build-mecha-standard-terracota/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const CHAVE_TEMA = 'mecha-salao-silver-tema';
const COR_CLARO = '#211B18', COR_ESCURO = '#120E0C';

const OUT = path.join(__dirname, '..', 'standard', 'mecha-standard-terracota');
const IMG_SILVER = path.join(__dirname, 'img');
const IMG_GOLD = path.join(__dirname, '..', '_build-mecha-premium', 'img');
const PASTAS = [path.join(IMG_SILVER, 'fotos'), path.join(IMG_GOLD, 'fotos')];
const M = C.marca;

// ---------- fotos usadas (copiadas para assets/img) ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Map();
const acha = (nome) => PASTAS.map((p) => path.join(p, `${nome}.webp`)).find((f) => fs.existsSync(f));
const usa = (nome) => { if (!nome || /^(data:|https?:)/.test(nome)) return; const arq = acha(nome); if (!arq) console.warn('Foto faltando:', nome); usadas.set(nome, arq); };
const fotoSrc = (n) => (/^(data:|https?:)/.test(n) ? n : `assets/img/${n}.webp`);
const alt = (n) => C.fotos[n] ?? '';

const wa = (msg) => `https://wa.me/55${String(M.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
const P = require('./partes')({ I, fotoSrc: (n) => { usa(n); return fotoSrc(n); }, wa });
const { esc, reais, minutos } = P;
const foto = (nome, opts = {}) => { usa(nome); return P.img(nome, opts.alt ?? alt(nome), opts); };

// dados padrão (o painel parte deles; o site os usa para remontar o que o painel salvar)
const padrao = {
  empresa: {
    nome: M.completo, razao: M.razao, cnpj: M.cnpj, telefone: M.telefone, whatsapp: M.whatsapp, email: M.email, instagram: M.instagram,
    endereco: M.endereco, bairro: M.bairro, cidade: M.cidade, uf: M.uf, cep: M.cep, referencia: M.referencia, estacionamento: M.estacionamento,
  },
  horario: C.horario,
  segmentos: C.segmentos.map((g) => ({ ...g, alt: alt(g.foto) })),
  servicos: C.servicos,
  equipe: C.equipe.map((m) => ({ ...m, alt: alt(m.foto) })),
  produtos: C.produtos.map((p) => ({ ...p, alt: alt(p.foto) })),
};
const L = padrao;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.endereco}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const tel = M.telefone.replace(/\D/g, '');
const nota = String(M.nota).replace('.', ',');
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const instaUrl = `https://instagram.com/${C.instagram.usuario}`;
const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${M.completo} ${M.bairro}`)}`;
const anosCasa = new Date().getFullYear() - M.desde;

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">';

// ícones que o navegador precisa para remontar as peças
const icNavegador = Object.fromEntries(['relogio', 'seta', 'whats', 'calendario', 'pessoa', 'lapis', 'lixo', 'olho', 'olhoFechado', 'sobe', 'desce', 'foto', 'fechar', 'mais', 'refaz'].map((k) => [k, I[k]]));
const simboloNav = I.simbolo();

// ---------- topo (o mesmo em todas as páginas do site) ----------
const nav = (pg) => {
  const base = pg === 'inicio' ? '' : 'index.html';
  return [[`${base}#servicos`, 'Serviços', 'servicos'], ['equipe.html', 'Equipe', 'equipe'], ['galeria.html', 'Galeria', 'galeria'], [`${base}#avaliacoes`, 'Avaliações', 'avaliacoes'], [`${base}#duvidas`, 'Dúvidas', 'duvidas'], [`${base}#visite`, 'Visite', 'visite']];
};
const topo = (pg) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="largo topo-in">
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav(pg).map(([h, t, id]) => `<a href="${h}"${id === pg ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
      <a class="menu-cliente" href="cliente.html">${I.pessoa}<span>Área do cliente</span></a>
      <div class="menu-tema">${T.pilula('deitada', 'claro')}</div>
    </nav>
    <div class="topo-acoes">
      <a class="topo-cliente" href="cliente.html" aria-label="Área do cliente" title="Área do cliente">${I.pessoa}</a>
      <a class="btn btn-telha btn-p" href="${pg === 'inicio' ? '' : 'index.html'}#agendar"><span>Agendar<span class="so-largo"> horário</span></span>${I.diag}</a>
      <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>`;

// ---------- capa ----------
const titulo = 'Cabelo, unhas e cor feitos com calma, pertinho de você.';
const pal = titulo.split(' ');
const palavras = pal.map((p, k) => `<span class="palavra${k >= pal.length - 3 ? ' em' : ''}" style="--i:${k}"><span>${p}</span></span>`).join(' ');
const capa = `<section class="capa" id="inicio">
  <figure class="capa-foto">${foto('capa-salao', { lazy: false, attrs: ' fetchpriority="high" width="1600" height="1068"' })}</figure>
  <div class="largo capa-in">
    <a class="capa-nota" href="#avaliacoes">${estrelas}<b>${nota}</b><span>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></a>
    <h1 aria-label="${esc(titulo)}"><span aria-hidden="true">${palavras}</span></h1>
    <div class="capa-pe">
      <p class="capa-local">${I.pino}<span>Salão de cabelo, unhas e sobrancelha na ${M.bairro}, ${M.cidade}</span></p>
      <div class="capa-btns" data-iguais><a class="btn btn-telha" href="#agendar">${I.calendario}<span>Agendar horário</span></a><a class="btn btn-vidro" href="#servicos"><span>Ver serviços e preços</span>${I.seta}</a></div>
    </div>
  </div>
</section>
<div class="faixa" aria-hidden="true"><div class="faixa-trilho">${Array.from({ length: 2 }, () => `<div class="faixa-grupo">${C.servicos.filter((s, k) => k % 2 === 0).map((s) => `<span>${esc(s.nome)}</span>${I.sep}`).join('')}</div>`).join('')}</div></div>`;

// ---------- serviços em cartões por segmento ----------
const servicos = `<section class="servicos" id="servicos">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Serviços e preços</p><h2>Serviços pensados para o seu jeito</h2></div>
      <p>Cada visita começa com uma conversa sobre o seu cabelo, a sua rotina e o resultado que você quer. Os preços são de referência e o valor final é fechado antes de começar.</p>
    </div>
    <div class="serv-corpo">
      <nav class="seg-nav" aria-label="Segmentos de serviço" data-seg-nav><i class="seg-nav-marca" aria-hidden="true"></i>${P.segNav(L)}</nav>
      <div class="segs" data-servicos>
      ${P.servicosHtml(L)}
      </div>
    </div>
    <dl class="condicoes rev">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>Sem custo até 24 horas antes. <a href="#politicas">Ver todas as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- tendências ----------
const looks = `<section class="looks" id="looks">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Tendências da estação</p><h2>Os cortes e cores que mais saem agora</h2></div>
      <p>Referências para levar para a conversa no espelho. A profissional adapta cada uma ao seu fio, ao formato do rosto e ao tempo que você tem para arrumar o cabelo.</p>
    </div>
    <div class="looks-grade">
      ${C.looks.map((l, k) => `<figure class="look rev" data-vel="${k % 2 ? 0.08 : -0.04}">
        <div class="look-foto">${foto(l.foto)}</div>
        <figcaption><h3>${esc(l.nome)}</h3><p>${esc(l.texto)}</p></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- por que a Mecha (escura) com a garantia ----------
const numeros = [
  [anosCasa, '', 'anos de bairro, desde ' + M.desde],
  [M.nota, ',', 'de nota no Google'],
  [M.avaliacoes, '', 'avaliações de clientes'],
  [15, '', 'dias de garantia na cor'],
];
const porque = `<section class="porque" id="porque">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">O jeito Mecha</p><h2>Por que as clientes voltam</h2></div>
      <p>Um salão pequeno, com hora marcada e tempo de sobra para cada pessoa. O que muda de verdade está nos detalhes que você vê na cadeira.</p>
    </div>
    <div class="porque-grade">
      ${C.motivos.map((m) => `<article class="motivo rev"><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p></article>`).join('\n      ')}
      <figure class="porque-foto rev">${foto('escova2')}</figure>
    </div>
    <div class="numeros rev">
      ${numeros.map(([v, dec, t]) => `<p><b data-conta="${v}"${dec ? ' data-dec="1"' : ''}>${String(v).replace('.', ',')}</b><span>${esc(t)}</span></p>`).join('\n      ')}
    </div>
    <div class="garantia rev">
      <div class="garantia-txt"><p class="apoio">Garantia de ajuste</p><h3>Se não ficou como combinado, a gente ajusta</h3><p>Volte dentro do prazo e a mesma profissional revê o serviço sem custo. Vale para o que foi combinado no espelho, seguindo os cuidados passados no dia.</p></div>
      <table class="garantia-tab"><caption class="vh">Prazos de ajuste sem custo</caption>${C.garantia.map(([s, p]) => `<tr><th scope="row">${esc(s)}</th><td>${esc(p)}</td></tr>`).join('')}</table>
    </div>
  </div>
</section>`;

// ---------- quem somos e equipe ----------
const sobre = `<section class="sobre" id="equipe">
  <div class="largo sobre-in">
    <figure class="sobre-foto rev">${foto('equipe-trio')}<figcaption>Parte da equipe num sábado de movimento</figcaption></figure>
    <div class="sobre-cartao rev">
      <p class="apoio">Quem cuida de você</p>
      <h2>Um salão de bairro que conhece cada cliente pelo nome</h2>
      <p>Desde ${M.desde} na ${M.bairro}, a Mecha junta cabeleireira, colorista, manicure e designer de sobrancelha no mesmo endereço. Cada uma tem a própria agenda, então você escolhe com quem quer ser atendida.</p>
    </div>
  </div>
  <div class="largo pros-cab rev">
    <h3>Conheça a equipe</h3>
    <div class="setas"><button type="button" class="seta-btn" data-pros="-1" aria-label="Profissional anterior">${I.esquerda}</button><button type="button" class="seta-btn cheia" data-pros="1" aria-label="Próxima profissional">${I.direita}</button></div>
  </div>
  <div class="pros" data-pros-lista data-transborda tabindex="0" aria-label="Equipe do salão">
    ${P.ativos(L.equipe).map(P.proCard).join('\n    ')}
  </div>
  <div class="largo pros-pe"><a class="btn btn-linha" href="equipe.html"><span>Ver a equipe completa</span>${I.seta}</a></div>
</section>`;

// ---------- antes e depois ----------
const nomePro = (id) => C.equipe.find((m) => m.id === id)?.nome || '';
const historias = `<section class="historias" id="historias">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Histórias de clientes</p><h2>Antes e depois, com tempo e preço</h2></div>
      <p>Arraste a linha sobre a foto para comparar. Cada caso mostra quanto tempo levou e quanto custou, para você chegar sabendo o que esperar.</p>
    </div>
    ${C.historias.map((h, k) => `<article class="hist rev${k % 2 ? ' inverte' : ''}">
      <div class="comparar" data-comparar style="--pos:50%">
        ${foto(h.depois, { cls: 'cmp-depois' })}
        <div class="cmp-antes">${foto(h.antes)}</div>
        <span class="cmp-rot cmp-rot-a">Antes</span><span class="cmp-rot cmp-rot-d">Depois</span>
        <span class="cmp-linha" aria-hidden="true"><i>${I.arrasta}</i></span>
        <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${esc(h.titulo)}">
      </div>
      <div class="hist-txt">
        <p class="apoio">${esc(h.servico)}</p>
        <h3>${esc(h.titulo)}</h3>
        <p>${esc(h.texto)}</p>
        <dl><div><dt>Tempo na cadeira</dt><dd>${esc(h.tempo)}</dd></div><div><dt>Preço</dt><dd>${esc(h.preco)}</dd></div><div><dt>Com</dt><dd>${esc(nomePro(h.prof))}</dd></div></dl>
      </div>
    </article>`).join('\n    ')}
    <p class="nota-fotos">Fotos ilustrativas de pessoas diferentes. No site publicado entram fotos reais de clientes, com autorização de imagem.</p>
  </div>
</section>`;

// ---------- avaliações em faixas que correm ----------
const avalCard = (d) => `<figure class="aval">${estrelas}<blockquote><p>${esc(d.texto)}</p></blockquote><figcaption><b>${esc(d.nome)}</b><span>${esc(d.serv)}</span></figcaption></figure>`;
const trilho = (lista, sentido) => `<div class="aval-linha${sentido ? ' volta' : ''}"><div class="aval-trilho">${[0, 1].map((k) => `<div class="aval-grupo"${k ? ' aria-hidden="true"' : ''}>${lista.map(avalCard).join('')}</div>`).join('')}</div></div>`;
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Avaliações</p><h2>O que dizem as clientes</h2></div>
      <a class="google" href="${googleUrl}" target="_blank" rel="noopener">${estrelas}<b>${nota}</b><span>de 5 em ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></a>
    </div>
  </div>
  <div class="aval-faixa" data-transborda>
    ${trilho(C.depoimentos.slice(0, 4), false)}
    ${trilho(C.depoimentos.slice(4), true)}
  </div>
  <div class="largo aval-pe"><button type="button" class="btn btn-linha btn-p" data-pausa aria-pressed="false">Pausar as avaliações</button><a class="btn btn-telha btn-p" href="${googleUrl}" target="_blank" rel="noopener"><span>Ler mais no Google</span>${I.diag}</a></div>
</section>`;

// ---------- Instagram incorporado ----------
const G = C.instagram;
const instagram = `<section class="insta" id="instagram">
  <div class="largo insta-in">
    <div class="insta-perfil rev">
      <p class="apoio">No Instagram</p>
      <div class="insta-topo">
        <span class="insta-avatar" aria-hidden="true">${I.simbolo()}</span>
        <div><h2>@${G.usuario}</h2><p>${esc(G.nome)}</p></div>
      </div>
      <dl class="insta-num"><div><dt>publicações</dt><dd>${G.posts}</dd></div><div><dt>seguidores</dt><dd>${G.seguidores}</dd></div><div><dt>seguindo</dt><dd>${G.seguindo}</dd></div></dl>
      <p class="insta-bio">${esc(G.bio)}</p>
      <a class="btn btn-telha" href="${instaUrl}" target="_blank" rel="noopener">${I.insta}<span>Seguir no Instagram</span></a>
    </div>
    <div class="insta-grade">
      ${G.fotos.map((f) => `<a class="insta-post rev" href="${instaUrl}" target="_blank" rel="noopener">
        ${foto(f.foto, { alt: f.legenda })}
        <span class="insta-sobre" aria-hidden="true"><span>${I.coracao}${f.curtidas.toLocaleString('pt-BR')}</span><span>${I.balao}${f.comentarios}</span></span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- produtos ----------
const produtos = `<section class="produtos" id="produtos">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Para levar para casa</p><h2>Os produtos que usamos na cadeira</h2></div>
      <p>Reserve pelo WhatsApp e retire no balcão. A profissional explica como usar cada um no seu tipo de fio.</p>
    </div>
    <div class="prod-grade" data-produtos>
      ${P.ativos(L.produtos).map((p) => P.produto(p, M.completo)).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- bom saber ----------
const saber = `<section class="saber" id="bom-saber">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Antes de vir</p><h2>Bom saber antes da sua visita</h2></div>
      <p>Detalhes práticos para chegar tranquila e sem surpresa.</p>
    </div>
    <ul class="saber-lista">
      ${C.bomSaber.map(([t, d]) => `<li class="rev"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n      ')}
    </ul>
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

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duv-in">
    <div class="sec-cab rev"><div><p class="apoio">Dúvidas</p><h2>Perguntas que a gente mais ouve</h2></div><p>Não achou a sua? Mande no <a href="${wa(`Olá, ${M.completo}! Tenho uma dúvida:`)}" target="_blank" rel="noopener">WhatsApp</a> que a recepção responde.</p></div>
    <div class="duv-lista rev">
      ${C.faq.map(([q, r]) => `<details class="duv"><summary><span>${esc(q)}</span><i aria-hidden="true">${I.mais}</i></summary><p>${esc(r)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- agendamento: serviço, profissional, dia e horário ----------
const agendar = `<section class="agendar" id="agendar">
  <div class="largo ag-in">
    <aside class="ag-resumo rev" aria-live="polite">
      <figure class="ag-foto">${foto('escova')}</figure>
      <div class="ag-cartao">
        <p class="apoio">Seu pedido</p>
        <dl data-resumo>
          <div><dt>Serviço</dt><dd data-r="servico">Escolha o serviço</dd></div>
          <div><dt>Com</dt><dd data-r="pro">Sem preferência</dd></div>
          <div><dt>Quando</dt><dd data-r="quando">Escolha o dia e o horário</dd></div>
          <div><dt>Duração</dt><dd data-r="tempo">&nbsp;</dd></div>
          <div class="ag-total"><dt>Valor</dt><dd data-r="valor">&nbsp;</dd></div>
        </dl>
        <p class="ag-nota">${I.relogio}<span>Confirmamos pelo WhatsApp em até 1 hora, no horário de funcionamento.</span></p>
      </div>
    </aside>
    <form class="form rev" id="form-agenda" novalidate>
      <p class="apoio">Agendamento</p>
      <h2>Agende seu horário</h2>
      <p class="form-intro">Escolha o serviço, a profissional, o dia e o horário. O pedido segue pronto pelo WhatsApp. Campos com * são obrigatórios.</p>
      <div class="passo">
        <label class="campo"><span>Qual serviço? *</span><select name="servico" required data-lista><option value="">Escolha o serviço</option>${P.opcoes(L)}</select></label>
        <p class="form-aviso" data-aviso-quimica hidden></p>
      </div>
      <fieldset class="passo">
        <legend>Com quem? *</legend>
        <div class="pros-escolha" data-pros-escolha></div>
      </fieldset>
      <div class="passo">
        <label class="campo"><span>Que dia? *</span><input name="data" type="date" required data-cal></label>
      </div>
      <fieldset class="passo">
        <legend>Que horas? *</legend>
        <div class="horarios" data-horarios><p class="horarios-vazio">Escolha o serviço e o dia para ver os horários.</p></div>
      </fieldset>
      <div class="campos">
        <label class="campo"><span>Nome *</span><input name="nome" autocomplete="name" required placeholder="Seu nome"></label>
        <label class="campo"><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(11) 90000-0000"></label>
        <label class="campo larga"><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></label>
        <label class="campo larga"><span>Algo que devemos saber?</span><textarea name="obs" rows="2" placeholder="O resultado que você quer, alergias, química recente, outro serviço no mesmo dia"></textarea></label>
      </div>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso do meu nome, telefone e e-mail só para responder a este pedido. *</span></label>
      <label class="aceite"><input type="checkbox" name="novidades"><span>Quero receber lembretes e novidades pelo WhatsApp. Posso cancelar quando quiser.</span></label>
      <p class="form-erro" role="alert" hidden></p>
      <button class="btn btn-telha btn-largo" type="submit">${I.whats}<span>Enviar pedido pelo WhatsApp</span></button>
      <div class="form-ok" role="status" hidden></div>
    </form>
  </div>
</section>`;

// ---------- rodapé com mapa ----------
const creditos = [...JSON.parse(fs.readFileSync(path.join(IMG_SILVER, 'creditos.json'), 'utf8')), ...JSON.parse(fs.readFileSync(path.join(IMG_GOLD, 'creditos.json'), 'utf8'))];
// fotos do site inteiro (todos os corpos são montados antes de gravar as páginas)
const creditosUsados = () => creditos.filter((c, k, arr) => usadas.has(c.arq) && arr.findIndex((x) => x.arq === c.arq) === k);
const redes = `<div class="redes">
      <a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
      <a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>
      <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp" data-wa="Olá!">${I.whats}</a>
    </div>`;
const rodape = (pg) => {
  const base = pg === 'inicio' ? '' : 'index.html';
  return `<footer class="rodape" id="visite">
  <div class="largo">
    <div class="rod-topo"><a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>${redes}</div>
    <div class="rod-cols">
      <div><h3>Navegue</h3><ul>${[['index.html', 'Início'], [`${base}#servicos`, 'Serviços e preços'], ['equipe.html', 'Equipe'], ['galeria.html', 'Galeria'], [`${base}#avaliacoes`, 'Avaliações'], [`${base}#duvidas`, 'Dúvidas'], [`${base}#agendar`, 'Agendar horário'], ['cliente.html', 'Área do cliente']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" data-wa="Olá!">WhatsApp <span data-emp="whatsapp">${M.whatsapp}</span></a></li><li><a href="tel:${tel}" data-emp-tel>Telefone <span data-emp="telefone">${M.telefone}</span></a></li><li><a href="mailto:${M.email}" data-emp-mail><span data-emp="email">${M.email}</span></a></li><li><a href="${base}#agendar">Agendamento online</a></li></ul></div>
      <div><h3>Onde estamos</h3><ul><li data-emp="endereco">${M.endereco}</li><li><span data-emp="bairro">${M.bairro}</span>, <span data-emp="cidade">${M.cidade}</span>, <span data-emp="uf">${M.uf}</span></li><li>CEP <span data-emp="cep">${M.cep}</span></li><li data-emp="referencia">${M.referencia}</li><li data-emp="estacionamento">${M.estacionamento}</li></ul></div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_vila-madalena.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização do ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b data-emp="nome">${M.completo}</b><span data-emp-end>${endereco}, CEP ${M.cep}</span><span data-horario-curto>${P.horarioCurto(L.horario)}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só no salão, com hora marcada. Clientes destes bairros chegam a pé ou em poucos minutos.</p>
        <ul class="bairros">${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário de funcionamento</caption><tbody data-horas>${P.horasLinhas(L.horario)}</tbody></table>
      </div>
    </div>
    <div class="legal">
      <p><b data-emp="razao">${M.razao}</b> (${M.casa}), CNPJ <span data-emp="cnpj">${M.cnpj}</span>. <span data-emp-end>${endereco}, CEP ${M.cep}</span>. Telefone <span data-emp="telefone">${M.telefone}</span>. WhatsApp <span data-emp="whatsapp">${M.whatsapp}</span>. <span data-emp="email">${M.email}</span>.</p>
      <p>Atendimento pelo WhatsApp, telefone, e-mail e formulário do site, no horário de funcionamento. Material esterilizado em autoclave ou descartável. Produtos com registro ou notificação na Anvisa.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditosUsados().map((c) => `<li>${esc(c.arq)}: ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a>` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
  <p class="rod-marca" aria-hidden="true">${M.nome}</p>
  <div class="rod-fim"><div class="largo"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div></div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site do ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" data-wa="Olá! Vim pelo site.">${I.whats}<span>WhatsApp</span></a>`;
};

// ---------- janelas legais, cookies, aviso ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação do ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. Serviços com valor "a partir de" dependem do comprimento e do volume do cabelo, e o valor é fechado no diagnóstico, antes de começar. Nenhum valor é alterado sem o seu aceite. ${esc(C.pagamento)}</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Cor e alinhamento acima de R$ 300 pedem sinal de 30% via Pix, que vira crédito para nova data em até 60 dias quando o aviso vem com menos de 24 horas. Duas faltas sem aviso pedem sinal em todos os agendamentos seguintes.</p>
    <h3>Coloração, química e henna</h3><p>Teste de mecha e de sensibilidade obrigatório, 48 horas antes para quem nunca fez o serviço aqui. A profissional pode recusar ou adiar o serviço quando o fio, a pele ou o couro cabeludo não estiverem em condições, explicando o motivo. Informe alergias, gestação, medicamentos e química feita fora do salão.</p>
    <h3>Garantia</h3><p>Ajuste sem custo nos prazos de cada serviço: corte, escova e design de sobrancelha em até 7 dias; cor, mechas, gloss e alinhamento em até 15 dias; esmaltação em gel em até 5 dias; maquiagem antes de sair do salão. A garantia não cobre mudança de ideia sobre o resultado combinado nem processos feitos fora do salão.</p>
    <h3>Produtos</h3><p>Produtos reservados pelo WhatsApp ficam separados por 3 dias. Troca só com a embalagem lacrada, em até 7 dias.</p>
    <h3>Higiene</h3><p>Material esterilizado em autoclave ou descartável e produtos com registro ou notificação na Anvisa. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços do ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos, marcas e imagens pertencem à ${M.nome} ou a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário envia o pedido pelo WhatsApp. Os horários mostrados seguem a agenda de cada profissional, mas o horário só vale depois da nossa confirmação.</p>
    <h3>Área do cliente</h3><p>A Área do cliente é de uso exclusivo do salão, para manter serviços, preços, equipe, produtos e horário atualizados. O acesso é pessoal.</p>
    <h3>Links externos</h3><p>Mapas, redes sociais, Instagram e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, serviço, profissional, dia, horário e observações que você escreve no formulário. Alergias e informações de saúde são dados sensíveis e só são usadas para a sua segurança no atendimento.</p>
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
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-telha" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- página da equipe ----------
const pgEquipe = `<section class="pg-cab">
  <div class="largo pg-cab-in">
    <p class="apoio rev">Equipe</p>
    <h1 class="rev">Quatro profissionais, cada uma com a própria agenda</h1>
    <p class="rev">Conheça quem vai cuidar de você, o que cada uma faz melhor e os dias em que atende. Escolha a profissional e agende direto com ela.</p>
  </div>
</section>
<section class="equipe-lista">
  <div class="largo" data-membros>
    ${P.ativos(L.equipe).map((m, k) => P.membro(m, L, k)).join('\n    ')}
  </div>
</section>
<section class="equipe-pe">
  <div class="largo equipe-pe-in">
    <div class="rev"><h2>Responsável técnica</h2><p>${esc(C.equipe[0].nome)}, colorista, responde pelos produtos químicos da casa: confere o registro na Anvisa, a validade e a ficha de cada cliente antes de qualquer cor, alinhamento ou henna.</p></div>
    <div class="rev"><h2>Trabalhe com a gente</h2><p>Procuramos profissionais que gostem de conversar antes de começar. Mande seu portfólio para <a href="mailto:${M.email}?subject=Trabalhe%20conosco" data-emp-mail><span data-emp="email">${M.email}</span></a>.</p></div>
  </div>
</section>`;

// ---------- página da galeria ----------
const cats = [...C.segmentos.map((g) => [g.id, g.curto]), ['espaco', 'O espaço']].filter(([id]) => C.galeria.some((f) => f.cat === id));
const pgGaleria = `<section class="pg-cab">
  <div class="largo pg-cab-in">
    <p class="apoio rev">Galeria</p>
    <h1 class="rev">A vida dentro da Mecha</h1>
    <p class="rev">Trabalhos da equipe e o dia a dia do salão, separados por categoria. Toque numa foto para ver maior.</p>
  </div>
</section>
<section class="galeria">
  <div class="largo">
    <div class="filtros" role="group" aria-label="Filtrar a galeria por categoria" data-iguais>
      <button type="button" data-filtro="todos" aria-pressed="true">Todos<small>${C.galeria.length}</small></button>
      ${cats.map(([id, t]) => `<button type="button" data-filtro="${id}" aria-pressed="false">${esc(t)}<small>${C.galeria.filter((f) => f.cat === id).length}</small></button>`).join('')}
    </div>
    <div class="gal-grade" data-galeria>
      ${C.galeria.map((f, k) => `<figure class="gal" data-cat="${f.cat}"><button type="button" data-abre="${k}" aria-label="Ampliar: ${esc(f.legenda)}">${foto(f.foto)}<span class="gal-amplia" aria-hidden="true">${I.ampliar}</span></button><figcaption>${esc(f.legenda)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>
<dialog class="caixa-foto" id="caixa-foto" aria-label="Foto ampliada">
  <figure><img src="" alt=""><figcaption><span data-cf-cat></span><b data-cf-leg></b><span data-cf-pos></span></figcaption></figure>
  <button type="button" class="cf-btn cf-fecha" data-fecha aria-label="Fechar">${I.fechar}</button>
  <button type="button" class="cf-btn cf-ant" data-cf="-1" aria-label="Foto anterior">${I.esquerda}</button>
  <button type="button" class="cf-btn cf-prox" data-cf="1" aria-label="Próxima foto">${I.direita}</button>
</dialog>`;

// ---------- Área do cliente ----------
const acessoTopo = `<header class="acesso-topo">
  <a class="logo" href="index.html" aria-label="${M.completo}, voltar ao site">${I.logo}</a>
  <div class="acesso-topo-acoes">${T.pilula('deitada', 'claro')}<a class="link-volta" href="index.html">${I.esquerda}<span>Voltar ao site</span></a></div>
</header>`;
const pgCliente = `<main class="acesso" id="conteudo">
  <div class="acesso-arte">${foto('interior', { lazy: false })}<div class="acesso-arte-txt"><p class="apoio">Área do cliente</p><p class="acesso-frase">O painel do salão: serviços, produtos, equipe e dados da empresa num lugar só.</p></div></div>
  <div class="acesso-lado">
    ${acessoTopo}
    <form class="acesso-form" data-entrar novalidate>
      <h1>Entrar no painel</h1>
      <p class="acesso-intro">Cadastre serviços, produtos e funcionários, e atualize horário e dados da empresa. O site muda na hora.</p>
      <div class="acesso-erro" role="alert" hidden data-erro></div>
      <label class="campo"><span>E-mail</span><input type="email" name="email" autocomplete="username" required></label>
      <label class="campo campo-senha"><span>Senha</span><input type="password" name="senha" autocomplete="current-password" required><button type="button" class="olho" data-olho aria-label="Mostrar a senha" aria-pressed="false">${I.olho}</button></label>
      <button class="btn btn-telha btn-largo" type="submit"><span>Entrar</span>${I.seta}</button>
      <div class="acesso-demo"><b>Acesso de demonstração</b><span>E-mail <code data-demo-email></code></span><span>Senha <code data-demo-senha></code></span></div>
      <p class="acesso-links">Ainda não tem conta? <a href="cadastro.html">Cadastre o salão</a></p>
    </form>
  </div>
</main>`;
const pgCadastro = `<main class="acesso" id="conteudo">
  <div class="acesso-arte">${foto('recepcao', { lazy: false })}<div class="acesso-arte-txt"><p class="apoio">Área do cliente</p><p class="acesso-frase">Crie o acesso de quem cuida do site do salão.</p></div></div>
  <div class="acesso-lado">
    ${acessoTopo}
    <form class="acesso-form" data-cadastro novalidate>
      <h1>Cadastrar o salão</h1>
      <p class="acesso-intro">Nesta demonstração a conta fica só neste navegador. No site publicado, o cadastro passa por um servidor com senha protegida.</p>
      <div class="acesso-erro" role="alert" hidden data-erro></div>
      <label class="campo"><span>Seu nome</span><input name="nome" autocomplete="name" required></label>
      <label class="campo"><span>Nome do salão</span><input name="salao" autocomplete="organization" required value="${esc(M.completo)}"></label>
      <label class="campo"><span>E-mail</span><input type="email" name="email" autocomplete="username" required></label>
      <label class="campo campo-senha"><span>Senha (mínimo 8 caracteres)</span><input type="password" name="senha" autocomplete="new-password" minlength="8" required><button type="button" class="olho" data-olho aria-label="Mostrar a senha" aria-pressed="false">${I.olho}</button></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito os <button type="button" class="link" data-doc="uso">Termos de uso</button> e a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <button class="btn btn-telha btn-largo" type="submit"><span>Criar conta e entrar</span>${I.seta}</button>
      <p class="acesso-links">Já tem conta? <a href="cliente.html">Entrar</a></p>
    </form>
  </div>
</main>`;
const abas = [['empresa', 'Dados da empresa', I.predio], ['horario', 'Horário', I.relogio], ['servicos', 'Serviços', I.tesoura], ['produtos', 'Produtos', I.frasco], ['equipe', 'Funcionários', I.pessoa]];
const pgPainel = `<div class="painel" id="conteudo">
  <aside class="painel-lado">
    <a class="logo" href="index.html" aria-label="${M.completo}, ver o site">${I.logo}</a>
    <p class="painel-ola" data-ola>Olá</p>
    <nav class="painel-nav" role="tablist" aria-label="Seções do painel">
      ${abas.map(([id, t, ic], k) => `<button type="button" role="tab" id="aba-${id}" aria-controls="pn-${id}" aria-selected="${k === 0}" data-aba="${id}">${ic}<span>${t}</span><small data-conta-aba="${id}"></small></button>`).join('\n      ')}
    </nav>
    <div class="painel-lado-pe">
      ${T.pilula('deitada', 'claro')}
      <a class="painel-ver" href="index.html" target="_blank" rel="noopener">${I.diag}<span>Ver o site</span></a>
      <button type="button" class="painel-sair" data-sair>${I.sair}<span>Sair</span></button>
    </div>
  </aside>
  <main class="painel-corpo">
    <header class="painel-cab">
      <div><p class="apoio">Área do cliente</p><h1 data-titulo-aba>Dados da empresa</h1></div>
      <div class="painel-cab-acoes"><button type="button" class="btn btn-linha btn-p" data-restaurar>${I.refaz}<span>Restaurar o padrão</span></button></div>
    </header>
    <p class="painel-aviso">Demonstração: o que você salva fica neste navegador e aparece no site na hora. No site publicado, o painel grava num servidor e vale para todos os visitantes.</p>
    ${abas.map(([id], k) => `<section class="painel-aba" role="tabpanel" id="pn-${id}" aria-labelledby="aba-${id}" data-painel="${id}"${k ? ' hidden' : ''}></section>`).join('\n    ')}
  </main>
</div>
<dialog class="doc editor" id="editor" aria-labelledby="editor-t">
  <form method="dialog" data-editor novalidate>
    <div class="doc-cab"><h2 id="editor-t" data-editor-t>Editar</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
    <div class="doc-corpo editor-campos" data-editor-campos></div>
    <div class="editor-pe"><p class="form-erro" role="alert" hidden data-editor-erro></p><button type="button" class="btn btn-linha" data-fecha>Cancelar</button><button type="submit" class="btn btn-telha">Salvar</button></div>
  </form>
</dialog>`;

// ---------- montagem das páginas ----------
const precos = C.servicos.map((s) => s.preco);
const ld = {
  '@context': 'https://schema.org', '@type': 'HairSalon', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/capa-salao.webp`, telephone: M.telefone, email: M.email, priceRange: `R$ ${Math.min(...precos)} a R$ ${Math.max(...precos)}`,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.5564, longitude: -46.6893 },
  openingHoursSpecification: C.horario.map((d, i) => [d, i]).filter(([d]) => d.aberto).map(([d, i]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i], opens: d.abre, closes: d.fecha })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  employee: C.equipe.map((m) => ({ '@type': 'Person', name: m.nome, jobTitle: m.cargo })),
  sameAs: [instaUrl, M.facebook, M.linkedin],
};

const pagina = ({ arquivo, pg, titulo: t, descricao, corpo, tipo = 'site', ld: comLd = false, noindex = false }) => {
  const dados = { pagina: pg, nome: M.completo, padrao, ic: icNavegador, simbolo: simboloNav, demo: { email: 'dono@mechasalao.com.br', senha: 'mecha2026', nome: 'Carla Menezes' } };
  const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(descricao)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${M.dominio}/${arquivo === 'index.html' ? '' : arquivo}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/capa-salao.webp"><meta property="og:locale" content="pt_BR">`}
<meta name="theme-color" content="${COR_CLARO}">
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
${comLd ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body class="pg-${pg}">
${tipo === 'site' ? `${topo(pg)}
<main id="conteudo">
${corpo}
</main>
${rodape(pg)}
${T.pilula('tema-lado', 'claro')}` : corpo}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/partes.js" defer></script>
<script src="assets/loja.js" defer></script>
<script src="assets/${tipo === 'site' ? 'site' : 'painel'}.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, arquivo), html);
};

const corpoInicio = [capa, servicos, looks, porque, sobre, historias, avaliacoes, instagram, produtos, saber, politicas, duvidas, agendar].join('\n');
pagina({ arquivo: 'index.html', pg: 'inicio', titulo: `${M.completo} | Salão de beleza na ${M.bairro}, ${M.cidade}`, descricao: `Salão de beleza com hora marcada na ${M.bairro}: corte, escova, cor e mechas, cachos, tratamentos, unhas, sobrancelha e maquiagem. Preços claros e agendamento online com a profissional que você escolher.`, corpo: corpoInicio, ld: true });
pagina({ arquivo: 'equipe.html', pg: 'equipe', titulo: `Equipe | ${M.completo}, ${M.bairro}`, descricao: `Conheça a equipe do ${M.completo}: colorista, cabeleireira, manicure e designer de sobrancelha, com a agenda de cada uma.`, corpo: pgEquipe });
pagina({ arquivo: 'galeria.html', pg: 'galeria', titulo: `Galeria | ${M.completo}, ${M.bairro}`, descricao: `Fotos de cortes, cor, cachos, unhas, sobrancelha e do espaço do ${M.completo}, separadas por categoria.`, corpo: pgGaleria });
pagina({ arquivo: 'cliente.html', pg: 'cliente', titulo: `Área do cliente | ${M.completo}`, descricao: 'Entre para cadastrar serviços, produtos, equipe e os dados do salão.', corpo: pgCliente, tipo: 'acesso', noindex: true });
pagina({ arquivo: 'cadastro.html', pg: 'cadastro', titulo: `Cadastrar o salão | ${M.completo}`, descricao: 'Crie o acesso à Área do cliente do salão.', corpo: pgCadastro, tipo: 'acesso', noindex: true });
pagina({ arquivo: 'painel.html', pg: 'painel', titulo: `Painel | ${M.completo}`, descricao: 'Painel do salão: serviços, produtos, equipe, horário e dados da empresa.', corpo: pgPainel, tipo: 'acesso', noindex: true });

// ---------- grava os arquivos de apoio ----------
for (const [nome, arq] of usadas) if (arq) fs.copyFileSync(arq, path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(IMG_GOLD, 'mapa_vila-madalena.webp'), path.join(OUT, 'assets', 'img', 'mapa_vila-madalena.webp'));
const favicon = I.favicon.replace('fill="#1F1B18"', `fill="${COR_CLARO}"`).replace('stroke="#C9A27F"', 'stroke="#E58A68"');
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
const comum = fs.readFileSync(path.join(__dirname, 'comum.js'), 'utf8');
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), comum + fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'assets', 'painel.js'), comum + fs.readFileSync(path.join(__dirname, 'painel.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.copyFileSync(path.join(__dirname, 'partes.js'), path.join(OUT, 'assets', 'partes.js'));
fs.copyFileSync(path.join(__dirname, 'loja.js'), path.join(OUT, 'assets', 'loja.js'));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /cliente.html\nDisallow: /cadastro.html\nDisallow: /painel.html\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'equipe.html', 'galeria.html'].map((u) => `<url><loc>${M.dominio}/${u}</loc></url>`).join('')}</urlset>\n`);
console.log(`ok: ${OUT} (${usadas.size} fotos)`);
